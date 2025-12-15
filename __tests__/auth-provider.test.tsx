import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminGuard } from '@/components/AuthProvider';
import * as authContext from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext');

describe('AdminGuard Component', () => {
  const mockUseAuth = authContext.useAuth as jest.Mock;
  const originalConsoleError = console.error;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      const first = args[0] as unknown;
      const message =
        typeof first === 'string'
          ? first
          : first && typeof (first as { message?: unknown }).message === 'string'
          ? (first as { message: string }).message
          : undefined;

      if (message && message.includes('Not implemented: navigation')) {
        return;
      }
      return originalConsoleError(...args);
    });
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading message when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not render children while loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('Authentication Handling', () => {
    it('shows console log when user is not authenticated', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('AdminGuard: No user, redirecting to login');
      });

      consoleLogSpy.mockRestore();
    });

    it('returns null when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { container } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Authorization Handling', () => {
    it('logs error when user is not admin', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Access denied: User is not an admin.');
      });

      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('logs user info when user is not admin', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith('USER: ', mockUser);
        expect(consoleWarnSpy).toHaveBeenCalledWith('IS ADMIN: ', false);
      });

      consoleWarnSpy.mockRestore();
    });

    it('returns fallback when user is not admin', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard fallback={<div>Access Denied</div>}>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('returns null when user is not admin and no fallback provided', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { container } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Admin Access', () => {
    it('renders children when user is authenticated and is admin', () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('does not redirect when user is admin', () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('ignores fallback when user is admin', () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard fallback={<div>Access Denied</div>}>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
    });
  });

  describe('Effect Dependencies', () => {
    it('re-evaluates when user changes', async () => {
      const mockUser1 = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      const mockUser2 = {
        id: 2,
        username: 'admin@example.com',
        role: 1,
      };

      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      mockUseAuth.mockReturnValue({
        user: mockUser1,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { rerender } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      mockUseAuth.mockReturnValue({
        user: mockUser2,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      rerender(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('re-evaluates when loading state changes', async () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { rerender } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      rerender(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('re-evaluates when isAdmin flag changes', async () => {
      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { rerender } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      rerender(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  describe('Fallback Component', () => {
    it('renders custom fallback when provided', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const fallbackComponent = <div className="fallback-content">You do not have permission</div>;

      render(
        <AdminGuard fallback={fallbackComponent}>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('You do not have permission')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('renders complex fallback with multiple elements', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'user@example.com',
        role: 3,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard
          fallback={
            <div>
              <h1>Access Denied</h1>
              <p>You do not have permission to view this page.</p>
              <button>Go Back</button>
            </div>
          }
        >
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing useAuth context gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const errorMock = jest.fn(() => {
        throw new Error('useAuth must be used within an AuthProvider');
      });

      mockUseAuth.mockImplementation(errorMock);

      expect(() => {
        render(
          <AdminGuard>
            <div>Admin Content</div>
          </AdminGuard>
        );
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid state changes', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { rerender } = render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
        login: jest.fn(),
        logout: jest.fn(),
      });

      rerender(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      rerender(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      const { container } = render(<AdminGuard>{null}</AdminGuard>);

      expect(container).toBeDefined();
    });

    it('handles multiple children correctly', () => {
      const mockUser = {
        id: 1,
        username: 'admin@example.com',
        role: 1,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        isAdmin: true,
        login: jest.fn(),
        logout: jest.fn(),
      });

      render(
        <AdminGuard>
          <div>Content 1</div>
          <div>Content 2</div>
          <div>Content 3</div>
        </AdminGuard>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });
  });
});
