import { jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthRole, AuthService, type User } from '@/lib/auth';

type AuthValue = ReturnType<typeof useAuth>;

jest.mock('@/lib/auth', () => ({
  AuthRole: { Admin: 1, SeedUser: 2, User: 3 },
  AuthService: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    isAdmin: jest.fn(),
    setToken: jest.fn(),
    getToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

describe('AuthContext', () => {
  const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
  let latestAuth: AuthValue | null = null;

  const renderWithProvider = () =>
    render(
      <AuthProvider>
        <AuthStateCapture />
      </AuthProvider>
    );

  function AuthStateCapture() {
    const value = useAuth();

    useEffect(() => {
      latestAuth = value;
    }, [value]);

    return null;
  }

  beforeEach(() => {
    latestAuth = null;
    jest.clearAllMocks();

    mockedAuthService.isAuthenticated.mockReturnValue(false);
    mockedAuthService.getCurrentUser.mockResolvedValue(null);
    mockedAuthService.login.mockResolvedValue({});
    mockedAuthService.logout.mockImplementation(() => {});
    mockedAuthService.isAdmin.mockReturnValue(false);
  });

  it('throws when useAuth is used outside provider', () => {
    const OutsideConsumer = () => {
      useAuth();
      return null;
    };

    expect(() => render(<OutsideConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('initializes with loading then resolves to unauthenticated when not authenticated', async () => {
    mockedAuthService.isAuthenticated.mockReturnValue(false);

    renderWithProvider();

    await waitFor(() => {
      expect(latestAuth?.loading).toBe(false);
    });

    expect(mockedAuthService.getCurrentUser).not.toHaveBeenCalled();
    expect(latestAuth?.user).toBeNull();
  });

  it('loads current user when a token exists', async () => {
    const mockUser: User = { id: 1, username: 'alice', role: AuthRole.Admin };

    mockedAuthService.isAuthenticated.mockReturnValue(true);
    mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    mockedAuthService.isAdmin.mockReturnValue(true);

    renderWithProvider();

    await waitFor(() => {
      expect(latestAuth?.user).toEqual(mockUser);
      expect(latestAuth?.loading).toBe(false);
    });

    expect(mockedAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockedAuthService.isAdmin).toHaveBeenCalledWith(mockUser);
  });

  it('sets user after successful login response', async () => {
    const mockUser: User = { id: 2, username: 'bob', role: AuthRole.User };

    mockedAuthService.login.mockResolvedValue({ user: mockUser });

    renderWithProvider();

    await act(async () => {
      await latestAuth?.login('bob', 'pw');
    });

    await waitFor(() => {
      expect(latestAuth?.user).toEqual(mockUser);
    });

    expect(mockedAuthService.login).toHaveBeenCalledWith({ username: 'bob', password: 'pw' });
  });

  it('fetches current user when login response omits user', async () => {
    const fallbackUser: User = { id: 3, username: 'carol', role: AuthRole.User };

    mockedAuthService.login.mockResolvedValue({});
    mockedAuthService.getCurrentUser.mockResolvedValue(fallbackUser);

    renderWithProvider();

    await act(async () => {
      await latestAuth?.login('carol', 'secret');
    });

    await waitFor(() => {
      expect(latestAuth?.user).toEqual(fallbackUser);
    });

    expect(mockedAuthService.getCurrentUser).toHaveBeenCalled();
  });

  it('clears user and calls logout', async () => {
    const mockUser: User = { id: 4, username: 'dave', role: AuthRole.SeedUser };

    mockedAuthService.isAuthenticated.mockReturnValue(true);
    mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

    renderWithProvider();

    await waitFor(() => {
      expect(latestAuth?.user).toEqual(mockUser);
    });

    await act(async () => {
      latestAuth?.logout();
    });

    expect(mockedAuthService.logout).toHaveBeenCalledTimes(1);
    expect(latestAuth?.user).toBeNull();
  });

  it('derives admin flag using AuthService.isAdmin', async () => {
    const mockUser: User = { id: 5, username: 'erin', role: AuthRole.Admin };

    mockedAuthService.isAuthenticated.mockReturnValue(true);
    mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    mockedAuthService.isAdmin.mockImplementation((user: User | null) =>
      Boolean(user && user.role === AuthRole.Admin)
    );

    renderWithProvider();

    await waitFor(() => {
      expect(latestAuth?.user).toEqual(mockUser);
      expect(latestAuth?.isAdmin).toBe(true);
    });

    expect(mockedAuthService.isAdmin).toHaveBeenCalledWith(mockUser);
  });
});
