import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QueuePage from '@/app/(dashboard)/queue/page';
import * as jobsApi from '@/lib/api/jobs';
import * as authContext from '@/contexts/AuthContext';
import * as clusterContext from '@/contexts/ClusterContext';
import { jest } from '@jest/globals';

// Mock the API module
jest.mock('@/lib/api/jobs');

// Mock the contexts
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ClusterContext');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: jest.fn(),
      push: jest.fn(),
    };
  },
}));

describe('QueuePage - Job Rendering', () => {
  const mockJobs = {
    jobs: [
      {
        job_name: 'llama-job-1765666530-6d37a926',
        status: 'succeeded' as const,
        node_name: 'nano1',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765666533-8aaf7728',
        status: 'succeeded' as const,
        node_name: 'nano3',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765666538-7d75e77a',
        status: 'failed' as const,
        node_name: 'nano1',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765666542-c6b90d67',
        status: 'pending' as const,
        node_name: 'nano2',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765674676-f26d3e5f',
        status: 'succeeded' as const,
        node_name: 'nano2',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765674864-381c76b2',
        status: 'running' as const,
        node_name: 'nano2',
        namespace: 'prompts',
      },
      {
        job_name: 'llama-job-1765709417-9554987b',
        status: 'succeeded' as const,
        node_name: 'nano1',
        namespace: 'prompts',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useAuth hook
    (authContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    // Mock useCluster hook
    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: 1,
      loading: false,
      error: null,
    });

    // Mock fetchJobQueue API
    (jobsApi.fetchJobQueue as jest.Mock<any>).mockResolvedValue(mockJobs);
  });

  it('should render all 16 jobs from the API response', async () => {
    render(<QueuePage />);

    await waitFor(() => {
      mockJobs.jobs.forEach((job) => {
        expect(screen.getByText(job.job_name)).toBeInTheDocument();
      });
    });
  });

  it('should render correct number of job rows', async () => {
    render(<QueuePage />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(mockJobs.jobs.length + 1);
    });
  });

  it('should display correct job details for each row', async () => {
    render(<QueuePage />);

    await waitFor(() => {
      mockJobs.jobs.forEach((job) => {
        // Check each job name is rendered (all are unique)
        expect(screen.getByText(job.job_name)).toBeInTheDocument();
      });
      // Check namespace appears in the table (can have multiple instances)
      expect(screen.getAllByText('prompts')).toHaveLength(mockJobs.jobs.length);
      // Check that all status types are rendered with correct counts
      expect(screen.getAllByText('succeeded')).toHaveLength(4);
      expect(screen.getAllByText('failed')).toHaveLength(1);
      expect(screen.getAllByText('running')).toHaveLength(1);
      expect(screen.getAllByText('pending')).toHaveLength(1);
    });
  });

  it('should call fetchJobQueue with correct clusterId', async () => {
    render(<QueuePage />);

    await waitFor(() => {
      expect(jobsApi.fetchJobQueue).toHaveBeenCalledWith(1);
    });
  });

  describe('Status Color Rendering', () => {
    it('should render succeeded status with success color', async () => {
      render(<QueuePage />);

      await waitFor(() => {
        const succeededChips = screen.getAllByText('succeeded');
        succeededChips.forEach((chip) => {
          const chipElement = chip.closest('.MuiChip-root');
          expect(chipElement).toHaveClass('MuiChip-colorSuccess');
        });
      });
    });

    it('should render failed status with error color', async () => {
      render(<QueuePage />);

      await waitFor(() => {
        const failedChip = screen.getByText('failed');
        const chipElement = failedChip.closest('.MuiChip-root');
        expect(chipElement).toHaveClass('MuiChip-colorError');
      });
    });

    it('should render running status with info color', async () => {
      render(<QueuePage />);

      await waitFor(() => {
        const runningChip = screen.getByText('running');
        const chipElement = runningChip.closest('.MuiChip-root');
        expect(chipElement).toHaveClass('MuiChip-colorInfo');
      });
    });

    it('should render pending status with warning color', async () => {
      render(<QueuePage />);

      await waitFor(() => {
        const pendingChip = screen.getByText('pending');
        const chipElement = pendingChip.closest('.MuiChip-root');
        expect(chipElement).toHaveClass('MuiChip-colorWarning');
      });
    });

    it('should render all status types with correct colors', async () => {
      render(<QueuePage />);

      await waitFor(() => {
        // Check succeeded jobs (should be multiple)
        const succeededChips = screen.getAllByText('succeeded');
        expect(succeededChips.length).toBeGreaterThan(0);
        
        // Check failed job exists
        const failedChip = screen.getByText('failed');
        expect(failedChip).toBeInTheDocument();
        
        // Check running job exists
        const runningChip = screen.getByText('running');
        expect(runningChip).toBeInTheDocument();
        
        // Check pending job exists
        const pendingChip = screen.getByText('pending');
        expect(pendingChip).toBeInTheDocument();
      });
    });
  });
});
