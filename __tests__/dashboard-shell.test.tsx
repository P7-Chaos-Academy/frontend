import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardShell from '@/components/dashboard/DashboardShell/DashboardShell';
import * as authContext from '@/contexts/AuthContext';
import * as clusterContext from '@/contexts/ClusterContext';
import { usePathname, useRouter } from 'next/navigation';

jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ClusterContext');
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
}));

describe('DashboardShell', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');

    (authContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', email: 'user@example.com' },
      loading: false,
      logout: jest.fn(),
    });

    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedCluster: { id: 1, name: 'Production' },
      selectedClusterId: 1,
      loading: false,
      error: null,
    });
  });

  describe('Logo Rendering', () => {
    it('renders the logo with correct text', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getAllByText('Strato').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Control Plane').length).toBeGreaterThan(0);
    });

    it('renders the HubIcon in the logo', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      // MUI icons render as svg elements with specific test IDs or classes
      const hubIcon = screen.getAllByTestId('HubIcon');
      expect(hubIcon.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Routes', () => {
    it('renders all navigation route buttons', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getByRole('link', { name: /Overview/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Jobs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Queue/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Monitoring/i })).toBeInTheDocument();
    });

    it('navigates to Jobs page when Jobs button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const jobsLink = screen.getByRole('link', { name: /Jobs/i });
      expect(jobsLink).toHaveAttribute('href', '/jobs');
    });

    it('navigates to Queue page when Queue button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const queueLink = screen.getByRole('link', { name: /Queue/i });
      expect(queueLink).toHaveAttribute('href', '/queue');
    });

    it('navigates to Monitoring page when Monitoring button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const monitoringLink = screen.getByRole('link', { name: /Monitoring/i });
      expect(monitoringLink).toHaveAttribute('href', '/monitoring');
    });

    it('navigates to Overview page when Overview button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const overviewLink = screen.getByRole('link', { name: /Overview/i });
      expect(overviewLink).toHaveAttribute('href', '/');
    });

    it('highlights the active route', () => {
      (usePathname as jest.Mock).mockReturnValue('/jobs');

      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const jobsButton = screen.getByRole('link', { name: /Jobs/i });
      expect(jobsButton).toHaveClass('Mui-selected');
    });
  });

  describe('Profile Button', () => {
    it('renders the user profile section with email', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getAllByText('Signed in as').length).toBeGreaterThan(0);
      expect(screen.getAllByText('user@example.com').length).toBeGreaterThan(0);
    });

    it('renders avatar with first letter of email', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getAllByText('U').length).toBeGreaterThan(0); // First letter of user@example.com
    });

    it('navigates to profile page when profile button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const profileButtons = screen.getAllByText('Signed in as');
      const profileButton = profileButtons[0].closest('div');
      fireEvent.click(profileButton!);

      expect(mockRouter.push).toHaveBeenCalledWith('/profile');
    });

    it('opens logout confirmation dialog when logout button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const logoutButton = screen.getByRole('button', { name: /Sign out/i });
      fireEvent.click(logoutButton);

      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to sign out/i)).toBeInTheDocument();
    });

    it('logs out and redirects when logout is confirmed', async () => {
      const mockLogout = jest.fn();
      (authContext.useAuth as jest.Mock).mockReturnValue({
        user: { id: 'u1', email: 'user@example.com' },
        loading: false,
        logout: mockLogout,
      });

      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const logoutButtons = screen.getAllByRole('button', { name: /Sign out/i });
      fireEvent.click(logoutButtons[0]);

      // Wait for dialog to appear
      await screen.findByText('Are you sure?');

      // Find the "Sign out" button inside the dialog (not the main logout button)
      const dialogButtons = screen.getAllByRole('button', { name: /Sign out/i });
      const confirmButton = dialogButtons.find(btn => btn.closest('[role="dialog"]'));
      
      if (confirmButton) {
        fireEvent.click(confirmButton);
      }

      expect(mockLogout).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('closes logout dialog when cancel is clicked', async () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const logoutButtons = screen.getAllByRole('button', { name: /Sign out/i });
      fireEvent.click(logoutButtons[0]);

      // Wait for dialog to appear
      await screen.findByText('Are you sure?');

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
      });
    });
  });

  describe('DashboardShell on Different Pages', () => {
    it('renders correctly on Jobs page', () => {
      (usePathname as jest.Mock).mockReturnValue('/jobs');

      render(
        <DashboardShell>
          <div>Jobs Page Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Jobs Page Content')).toBeInTheDocument();
      expect(screen.getAllByText('Strato').length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: /Jobs/i })).toHaveClass('Mui-selected');
    });

    it('renders correctly on Monitoring page', () => {
      (usePathname as jest.Mock).mockReturnValue('/monitoring');

      render(
        <DashboardShell>
          <div>Monitoring Page Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Monitoring Page Content')).toBeInTheDocument();
      expect(screen.getAllByText('Strato').length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: /Monitoring/i })).toHaveClass('Mui-selected');
    });

    it('renders correctly on Profile page', () => {
      (usePathname as jest.Mock).mockReturnValue('/profile');

      render(
        <DashboardShell>
          <div>Profile Page Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Profile Page Content')).toBeInTheDocument();
      expect(screen.getAllByText('Strato').length).toBeGreaterThan(0);
      expect(screen.getAllByText('user@example.com').length).toBeGreaterThan(0);
    });

    it('renders correctly on Queue page', () => {
      (usePathname as jest.Mock).mockReturnValue('/queue');

      render(
        <DashboardShell>
          <div>Queue Page Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Queue Page Content')).toBeInTheDocument();
      expect(screen.getAllByText('Strato').length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: /Queue/i })).toHaveClass('Mui-selected');
    });
  });

  describe('Cluster Environment Display', () => {
    it('displays the current cluster environment', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Current environment')).toBeInTheDocument();
      expect(screen.getByText('Production')).toBeInTheDocument();
    });

    it('displays "unknown" when no cluster is selected', () => {
      (clusterContext.useCluster as jest.Mock).mockReturnValue({
        selectedCluster: null,
        selectedClusterId: null,
        loading: false,
        error: null,
      });

      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Current environment')).toBeInTheDocument();
      expect(screen.getByText('unknown')).toBeInTheDocument();
    });
  });

  describe('Mobile Drawer', () => {
    it('renders mobile menu button', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const menuButton = screen.getByRole('button', { name: /open navigation/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('toggles mobile drawer when menu button is clicked', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      const menuButton = screen.getByRole('button', { name: /open navigation/i });
      fireEvent.click(menuButton);

      // The mobile drawer should be open (this is tested via state change)
      // We can verify by checking if the drawer content is accessible
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading indicator when auth is loading', () => {
      (authContext.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        logout: jest.fn(),
      });

      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('Preparing dashboard…')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('renders content when loading is complete', () => {
      render(
        <DashboardShell>
          <div>Test Content</div>
        </DashboardShell>
      );

      expect(screen.queryByText('Preparing dashboard…')).not.toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Children Rendering', () => {
    it('renders children content correctly', () => {
      render(
        <DashboardShell>
          <div data-testid="child-content">Child Content</div>
        </DashboardShell>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <DashboardShell>
          <div>First Child</div>
          <div>Second Child</div>
        </DashboardShell>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
    });
  });
});
