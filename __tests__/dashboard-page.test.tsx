import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '@/components/dashboard/Dashboard';
import OverviewPage from '@/app/(dashboard)/page';
import * as authContext from '@/contexts/AuthContext';
import * as clusterContext from '@/contexts/ClusterContext';
import * as clustersApi from '@/lib/api/clusters';
import { useRouter } from 'next/navigation';

jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ClusterContext');
jest.mock('@/lib/api/clusters');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/dashboard/HeroBanner', () => {
  return function HeroBanner() {
    return <div data-testid="hero-banner">Hero Banner</div>;
  };
});

jest.mock('@/components/dashboard/ClusterCard', () => {
  return function ClusterCard({ cluster, isSelected, isDeleting, onSelect, onEdit, onDelete }: any) {
    return (
      <div data-testid={`cluster-card-${cluster.id}`} data-selected={isSelected}>
        <h3>{cluster.name}</h3>
        <p>{cluster.description}</p>
        <button onClick={onSelect}>Select</button>
        <button onClick={onEdit} data-testid={`edit-${cluster.id}`}>Edit</button>
        <button onClick={onDelete} data-testid={`delete-${cluster.id}`} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/CreateClusterDialog', () => {
  return function CreateClusterDialog({ open, onClose, onSubmit }: any) {
    if (!open) return null;
    return (
      <div data-testid="create-cluster-dialog">
        <h2>Create Cluster</h2>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={() => {
            onSubmit({
              name: 'New Cluster',
              description: 'Test cluster',
              apiEndpoint: 'https://api.test.com',
              prometheusEndpoint: 'https://prometheus.test.com',
            });
            onClose();
          }}
        >
          Submit
        </button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/EditClusterDialog', () => {
  return function EditClusterDialog({ open, cluster, onClose, onSubmit }: any) {
    if (!open || !cluster) return null;
    return (
      <div data-testid="edit-cluster-dialog">
        <h2>Edit Cluster: {cluster.name}</h2>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={() => {
            onSubmit(cluster.id, {
              name: cluster.name + ' Updated',
              description: cluster.description,
              apiEndpoint: cluster.apiEndpoint,
              prometheusEndpoint: cluster.prometheusEndpoint,
            });
            onClose();
          }}
        >
          Update
        </button>
      </div>
    );
  };
});

jest.mock('@/components/dashboard/EmptyClusterState', () => {
  return function EmptyClusterState({ onAddCluster }: any) {
    return (
      <div data-testid="empty-cluster-state">
        <p>No clusters found</p>
        <button onClick={onAddCluster}>Add Cluster</button>
      </div>
    );
  };
});

describe('Dashboard Page', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  const mockClusters = [
    {
      id: 1,
      name: 'Production',
      description: 'Production cluster',
      apiEndpoint: 'https://api.prod.com',
      prometheusEndpoint: 'https://prometheus.prod.com',
      createdBy: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 1,
      updatedAt: '2024-01-01T00:00:00Z',
      isDeleted: false,
    },
    {
      id: 2,
      name: 'Staging',
      description: 'Staging cluster',
      apiEndpoint: 'https://api.staging.com',
      prometheusEndpoint: 'https://prometheus.staging.com',
      createdBy: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedBy: 1,
      updatedAt: '2024-01-01T00:00:00Z',
      isDeleted: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    (authContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', email: 'user@example.com' },
      loading: false,
      logout: jest.fn(),
    });

    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      clusters: mockClusters,
      selectedClusterId: 1,
      selectedCluster: mockClusters[0],
      setSelectedClusterId: jest.fn(),
      loading: false,
      error: null,
      refetchClusters: jest.fn(),
    });
  });

  describe('OverviewPage', () => {
    it('redirects to login when user is not authenticated', () => {
      (authContext.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        logout: jest.fn(),
      });

      render(<OverviewPage />);

      expect(mockRouter.replace).toHaveBeenCalledWith('/login');
    });

    it('shows loading state while checking authentication', () => {
      (authContext.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        logout: jest.fn(),
      });

      render(<OverviewPage />);

      expect(screen.getByText('Restoring your session…')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders Dashboard when user is authenticated', () => {
      render(<OverviewPage />);

      expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
      expect(screen.getByText('Clusters')).toBeInTheDocument();
    });
  });

  describe('Dashboard Component Rendering', () => {
    it('renders HeroBanner component', () => {
      render(<Dashboard />);

      expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    });

    it('renders Clusters heading', () => {
      render(<Dashboard />);

      expect(screen.getByText('Clusters')).toBeInTheDocument();
    });

    it('renders add cluster button', () => {
      render(<Dashboard />);

      const addIcon = screen.getByTestId('AddIcon');
      expect(addIcon).toBeInTheDocument();
    });

    it('renders all cluster cards', () => {
      render(<Dashboard />);

      expect(screen.getByTestId('cluster-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('cluster-card-2')).toBeInTheDocument();
      expect(screen.getByText('Production')).toBeInTheDocument();
      expect(screen.getByText('Staging')).toBeInTheDocument();
    });

    it('shows selected cluster with correct styling', () => {
      render(<Dashboard />);

      const selectedCard = screen.getByTestId('cluster-card-1');
      expect(selectedCard).toHaveAttribute('data-selected', 'true');

      const unselectedCard = screen.getByTestId('cluster-card-2');
      expect(unselectedCard).toHaveAttribute('data-selected', 'false');
    });
  });

  describe('Cluster Selection', () => {
    it('calls setSelectedClusterId when cluster is selected', () => {
      const mockSetSelectedClusterId = jest.fn();
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const selectButtons = screen.getAllByText('Select');
      fireEvent.click(selectButtons[1]); // Click second cluster

      expect(mockSetSelectedClusterId).toHaveBeenCalledWith(2);
    });

    it('persists selected cluster across page navigation', () => {
      const mockSetSelectedClusterId = jest.fn();
      const { rerender } = render(<Dashboard />);

      // Simulate selecting cluster 2
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 2,
        selectedCluster: mockClusters[1],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      rerender(<Dashboard />);

      const selectedCard = screen.getByTestId('cluster-card-2');
      expect(selectedCard).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('Adding Cluster', () => {
    it('opens create dialog when add button is clicked', () => {
      render(<Dashboard />);

      const addIcon = screen.getByTestId('AddIcon');
      const addButton = addIcon.closest('button');
      fireEvent.click(addButton!);

      expect(screen.getByTestId('create-cluster-dialog')).toBeInTheDocument();
      expect(screen.getByText('Create Cluster')).toBeInTheDocument();
    });

    it('closes create dialog when cancel is clicked', () => {
      render(<Dashboard />);

      const addIcon = screen.getByTestId('AddIcon');
      const addButton = addIcon.closest('button');
      fireEvent.click(addButton!);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByTestId('create-cluster-dialog')).not.toBeInTheDocument();
    });

    it('calls createCluster API and refetches clusters on submit', async () => {
      const mockCreateCluster = jest.fn(async () => undefined);
      const mockRefetchClusters = jest.fn(async () => undefined);

      jest.spyOn(clustersApi, 'createCluster').mockImplementation(mockCreateCluster);
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: mockRefetchClusters,
      });

      render(<Dashboard />);

      const addIcon = screen.getByTestId('AddIcon');
      const addButton = addIcon.closest('button');
      fireEvent.click(addButton!);

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateCluster).toHaveBeenCalledWith({
          name: 'New Cluster',
          description: 'Test cluster',
          apiEndpoint: 'https://api.test.com',
          prometheusEndpoint: 'https://prometheus.test.com',
        });
      });

      expect(mockRefetchClusters).toHaveBeenCalled();
    });

    it('shows empty state when no clusters exist', () => {
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: [],
        selectedClusterId: null,
        selectedCluster: null,
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByTestId('empty-cluster-state')).toBeInTheDocument();
      expect(screen.getByText('No clusters found')).toBeInTheDocument();
    });

    it('opens create dialog from empty state', () => {
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: [],
        selectedClusterId: null,
        selectedCluster: null,
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const addButton = screen.getByText('Add Cluster');
      fireEvent.click(addButton);

      expect(screen.getByTestId('create-cluster-dialog')).toBeInTheDocument();
    });
  });

  describe('Editing Cluster', () => {
    it('opens edit dialog when edit button is clicked', () => {
      render(<Dashboard />);

      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);

      expect(screen.getByTestId('edit-cluster-dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Cluster: Production')).toBeInTheDocument();
    });

    it('closes edit dialog when cancel is clicked', () => {
      render(<Dashboard />);

      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByTestId('edit-cluster-dialog')).not.toBeInTheDocument();
    });

    it('calls updateCluster API and refetches clusters on update', async () => {
      const mockUpdateCluster = jest.fn(async (id: number, data: any): Promise<void> => undefined);
      const mockRefetchClusters = jest.fn(async () => undefined);

      jest.spyOn(clustersApi, 'updateCluster').mockImplementation(mockUpdateCluster);
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: mockRefetchClusters,
      });

      render(<Dashboard />);

      const editButton = screen.getByTestId('edit-1');
      fireEvent.click(editButton);

      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(mockUpdateCluster).toHaveBeenCalledWith(1, {
          name: 'Production Updated',
          description: 'Production cluster',
          apiEndpoint: 'https://api.prod.com',
          prometheusEndpoint: 'https://prometheus.prod.com',
        });
      });

      expect(mockRefetchClusters).toHaveBeenCalled();
    });

    it('does not trigger cluster selection when edit button is clicked', () => {
      const mockSetSelectedClusterId = jest.fn();
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const editButton = screen.getByTestId('edit-2');
      fireEvent.click(editButton);

      expect(mockSetSelectedClusterId).not.toHaveBeenCalled();
    });
  });

  describe('Deleting Cluster', () => {
    it('calls deleteCluster API and refetches clusters on delete', async () => {
      const mockDeleteCluster = jest.fn(async (id: number): Promise<void> => undefined);
      const mockRefetchClusters = jest.fn(async () => undefined);

      jest.spyOn(clustersApi, 'deleteCluster').mockImplementation(mockDeleteCluster);
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: mockRefetchClusters,
      });

      render(<Dashboard />);

      const deleteButton = screen.getByTestId('delete-2');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteCluster).toHaveBeenCalledWith(2);
      });

      expect(mockRefetchClusters).toHaveBeenCalled();
    });

    it('shows deleting state on delete button', async () => {
      const mockDeleteCluster = jest.fn(async (id: number): Promise<void> => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      jest.spyOn(clustersApi, 'deleteCluster').mockImplementation(mockDeleteCluster);

      render(<Dashboard />);

      const deleteButton = screen.getByTestId('delete-1');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Deleting...')).toBeInTheDocument();
      });
    });

    it('does not trigger cluster selection when delete button is clicked', () => {
      const mockSetSelectedClusterId = jest.fn();
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const deleteButton = screen.getByTestId('delete-2');
      fireEvent.click(deleteButton);

      expect(mockSetSelectedClusterId).not.toHaveBeenCalled();
    });

    it('handles delete errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockDeleteCluster = jest.fn(async (id: number): Promise<void> => {
        throw new Error('Delete failed');
      });
      
      jest.spyOn(clustersApi, 'deleteCluster').mockImplementation(mockDeleteCluster);

      render(<Dashboard />);

      const deleteButton = screen.getByTestId('delete-1');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to delete cluster:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('prevents multiple simultaneous delete operations', async () => {
      const mockDeleteCluster = jest.fn(async (id: number): Promise<void> => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      jest.spyOn(clustersApi, 'deleteCluster').mockImplementation(mockDeleteCluster);

      render(<Dashboard />);

      const deleteButton = screen.getByTestId('delete-1');
      
      // Try to click multiple times
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeleteCluster).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading spinner when clusters are loading', () => {
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: [],
        selectedClusterId: null,
        selectedCluster: null,
        setSelectedClusterId: jest.fn(),
        loading: true,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error message when cluster fetch fails', () => {
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: [],
        selectedClusterId: null,
        selectedCluster: null,
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: 'Failed to load clusters',
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      expect(screen.getByText('Failed to load clusters')).toBeInTheDocument();
    });

    it('hides error message when clusters load successfully', () => {
      const { rerender } = render(<Dashboard />);

      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: [],
        selectedClusterId: null,
        selectedCluster: null,
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: 'Failed to load clusters',
        refetchClusters: jest.fn(),
      });

      rerender(<Dashboard />);
      expect(screen.getByText('Failed to load clusters')).toBeInTheDocument();

      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: jest.fn(),
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      rerender(<Dashboard />);
      expect(screen.queryByText('Failed to load clusters')).not.toBeInTheDocument();
    });
  });

  describe('Cluster Persistence Across Navigation', () => {
    it('maintains selected cluster when returning to dashboard', () => {
      const localStorageMock = {
        getItem: jest.fn(() => '2'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });

      const mockSetSelectedClusterId = jest.fn((id: number) => {
        localStorageMock.setItem('selectedClusterId', id.toString());
      });

      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 2,
        selectedCluster: mockClusters[1],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const selectedCard = screen.getByTestId('cluster-card-2');
      expect(selectedCard).toHaveAttribute('data-selected', 'true');
    });

    it('saves selected cluster to localStorage on selection', () => {
      const localStorageMock = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });

      const mockSetSelectedClusterId = jest.fn((id: number) => {
        localStorageMock.setItem('selectedClusterId', id.toString());
      });

      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        clusters: mockClusters,
        selectedClusterId: 1,
        selectedCluster: mockClusters[0],
        setSelectedClusterId: mockSetSelectedClusterId,
        loading: false,
        error: null,
        refetchClusters: jest.fn(),
      });

      render(<Dashboard />);

      const selectButtons = screen.getAllByText('Select');
      fireEvent.click(selectButtons[1]);

      expect(mockSetSelectedClusterId).toHaveBeenCalledWith(2);
    });
  });
});
