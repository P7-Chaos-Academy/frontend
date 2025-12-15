import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobsPage from '@/app/(dashboard)/jobs/page';
import * as authContext from '@/contexts/AuthContext';
import * as clusterContext from '@/contexts/ClusterContext';
import * as jobsApi from '@/lib/api/jobs';

jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ClusterContext');
jest.mock('@/lib/api/jobs');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('JobsPage - Prompt Input Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (authContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', email: 'user@example.com' },
      loading: false,
    });

    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: 1,
      loading: false,
      error: null,
    });

    (jobsApi.postJob as jest.MockedFunction<typeof jobsApi.postJob>).mockResolvedValue({
      jobDetails: {
        status: 'pending',
        job_name: 'job-12345',
        namespace: 'default',
        uid: 'uid-12345',
        creation_timestamp: '2024-01-01T00:00:00Z',
      },
      estimatedTimeRemainingSeconds: 300,
    });
  });

  it('renders the prompt input form', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Token Usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Prompt/i })).toBeInTheDocument();
  });

  it('submits form with default values when user provides only a prompt', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(jobsApi.postJob).toHaveBeenCalledWith(
        {
          temperature: 0.7,
          tokenUsage: 128,
          prompt: 'Test prompt',
        },
        1
      );
    });
  });

    it('submits form with custom temperature value', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const temperatureInput = screen.getByLabelText(/Temperature/i) as HTMLInputElement;
    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(temperatureInput, { target: { value: '0.9' } });
    expect(temperatureInput.value).toBe('0.9');

    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(jobsApi.postJob).toHaveBeenCalledWith(
        {
          temperature: 0.9,
          tokenUsage: 128,
          prompt: 'Test prompt',
        },
        1
      );
    });
  });

  it('submits form with custom token usage value', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const tokenInput = screen.getByLabelText(/Token Usage/i) as HTMLInputElement;
    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(tokenInput, { target: { value: '512' } });
    expect(tokenInput.value).toBe('512');

    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(jobsApi.postJob).toHaveBeenCalledWith(
        {
          temperature: 0.7,
          tokenUsage: 512,
          prompt: 'Test prompt',
        },
        1
      );
    });
  });

  it('submits form with all custom values', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const temperatureInput = screen.getByLabelText(/Temperature/i);
    const tokenInput = screen.getByLabelText(/Token Usage/i);
    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(temperatureInput, { target: { value: '0.3' } });
    fireEvent.change(tokenInput, { target: { value: '256' } });
    fireEvent.change(promptInput, { target: { value: 'Explain quantum computing' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(jobsApi.postJob).toHaveBeenCalledWith(
        {
          temperature: 0.3,
          tokenUsage: 256,
          prompt: 'Explain quantum computing',
        },
        1
      );
    });
  });

  it('passes correct clusterId to postJob API', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(promptInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const call = (jobsApi.postJob as jest.MockedFunction<typeof jobsApi.postJob>).mock.calls[0];
      expect(call[1]).toBe(1); // clusterId should be 1
    });
  });

  it('disables submit button when prompt is empty', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('enables submit button when prompt has content', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i }) as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);

    fireEvent.change(promptInput, { target: { value: 'Test' } });

    expect(submitButton.disabled).toBe(false);
  });

  it('clears form after successful submission', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const temperatureInput = screen.getByLabelText(/Temperature/i) as HTMLInputElement;
    const tokenInput = screen.getByLabelText(/Token Usage/i) as HTMLInputElement;
    const promptInput = screen.getByLabelText(/Prompt/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(temperatureInput, { target: { value: '0.5' } });
    fireEvent.change(tokenInput, { target: { value: '256' } });
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(temperatureInput.value).toBe('0.7');
      expect(tokenInput.value).toBe('128');
      expect(promptInput.value).toBe('');
    });
  });

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (jobsApi.postJob as jest.MockedFunction<typeof jobsApi.postJob>).mockRejectedValueOnce(
      new Error('API Error')
    );

    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    fireEvent.change(promptInput, { target: { value: 'Test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error posting job:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('displays error message when cluster is not selected', async () => {
    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: null,
      loading: false,
      error: null,
    });

    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('No cluster selected')).toBeInTheDocument();
    });

    expect(screen.queryByText('Create Prompt')).not.toBeInTheDocument();
  });

  it('displays error message when cluster context has an error', async () => {
    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: null,
      loading: false,
      error: 'Failed to fetch clusters',
    });

    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch clusters')).toBeInTheDocument();
    });

    expect(screen.queryByText('Create Prompt')).not.toBeInTheDocument();
  });

  it('rejects temperature input that does not match 0.1 step increment', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const temperatureInput = screen.getByLabelText(/Temperature/i) as HTMLInputElement;
    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    // Try to set invalid temperature (0.15 is not a multiple of 0.1)
    fireEvent.change(temperatureInput, { target: { value: '0.15' } });

    // Fill in prompt
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    // Attempt to submit
    fireEvent.click(submitButton);

    // Verify postJob was NOT called with the invalid temperature
    await waitFor(() => {
      // The browser's HTML5 validation should prevent the form from submitting
      // with an invalid step value, so postJob should not be called
      expect(jobsApi.postJob).not.toHaveBeenCalled();
    });
  });

  it('accepts temperature input that matches 0.1 step increment', async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Prompt')).toBeInTheDocument();
    });

    const temperatureInput = screen.getByLabelText(/Temperature/i) as HTMLInputElement;
    const promptInput = screen.getByLabelText(/Prompt/i);
    const submitButton = screen.getByRole('button', { name: /Submit Prompt/i });

    // Set valid temperature (0.3 is a multiple of 0.1)
    fireEvent.change(temperatureInput, { target: { value: '0.3' } });

    // Fill in prompt
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    // Submit
    fireEvent.click(submitButton);

    // Verify postJob IS called with the valid temperature
    await waitFor(() => {
      expect(jobsApi.postJob).toHaveBeenCalledWith(
        {
          temperature: 0.3,
          tokenUsage: 128,
          prompt: 'Test prompt',
        },
        1
      );
    });
  });
});
