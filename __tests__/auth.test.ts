import { jest } from "@jest/globals";
import Cookies from "js-cookie";
import {
  AuthService,
  AuthRole,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
} from "@/lib/auth";

// Mock dependencies
jest.mock("js-cookie");
jest.mock("@/lib/api/client", () => ({
  setTokenGetter: jest.fn(),
  API_KEY: "test-api-key",
}));

describe("AuthService", () => {
  const mockCookies = Cookies as jest.Mocked<typeof Cookies>;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Token Management", () => {
    describe("setToken", () => {
      it("stores token in cookies with 7-day expiry", () => {
        const token = "test-token-123";
        mockCookies.set.mockReturnValue(undefined as any);

        AuthService.setToken(token);

        expect(mockCookies.set).toHaveBeenCalledWith("auth_token", token, {
          expires: 7,
        });
      });
    });

    describe("getToken", () => {
      it("retrieves token from cookies", () => {
        const token = "stored-token";
        (mockCookies.get as jest.Mock).mockReturnValue(token);

        const result = AuthService.getToken();

        expect(mockCookies.get).toHaveBeenCalledWith("auth_token");
        expect(result).toBe(token);
      });

      it("returns undefined when no token exists", () => {
        (mockCookies.get as jest.Mock).mockReturnValue(undefined);

        const result = AuthService.getToken();

        expect(result).toBeUndefined();
      });
    });

    describe("removeToken", () => {
      it("removes token from cookies", () => {
        AuthService.removeToken();

        expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
      });
    });
  });

  describe("Authentication State", () => {
    describe("isAuthenticated", () => {
      it("returns false in server environment", () => {
        const originalWindow = global.window;
        delete (global as any).window;

        const result = AuthService.isAuthenticated();

        expect(result).toBe(false);

        (global as any).window = originalWindow;
      });

      it("returns true when token exists", () => {
        (mockCookies.get as jest.Mock).mockReturnValue("valid-token");

        const result = AuthService.isAuthenticated();

        expect(result).toBe(true);
      });

      it("returns false when token does not exist", () => {
        (mockCookies.get as jest.Mock).mockReturnValue(undefined);

        const result = AuthService.isAuthenticated();

        expect(result).toBe(false);
      });
    });

    describe("isAdmin", () => {
      it("returns true for Admin role", () => {
        const adminUser: User = {
          id: 1,
          username: "admin",
          role: AuthRole.Admin,
        };

        const result = AuthService.isAdmin(adminUser);

        expect(result).toBe(true);
      });

      it("returns true for SeedUser role", () => {
        const seedUser: User = {
          id: 2,
          username: "seed",
          role: AuthRole.SeedUser,
        };

        const result = AuthService.isAdmin(seedUser);

        expect(result).toBe(true);
      });

      it("returns false for regular User role", () => {
        const regularUser: User = {
          id: 3,
          username: "user",
          role: AuthRole.User,
        };

        const result = AuthService.isAdmin(regularUser);

        expect(result).toBe(false);
      });

      it("returns false for null user", () => {
        const result = AuthService.isAdmin(null);

        expect(result).toBe(false);
      });

      it("returns false for undefined user", () => {
        const result = AuthService.isAdmin(undefined as any);

        expect(result).toBe(false);
      });
    });
  });

  describe("Login", () => {
    const credentials: LoginCredentials = {
      username: "testuser",
      password: "password123",
    };

    it("successfully logs in with valid credentials", async () => {
      const mockResponse = {
        token: "new-auth-token",
        user: {
          id: 1,
          username: "testuser",
          role: AuthRole.User,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => mockResponse,
      } as unknown as Response);

      const result = await AuthService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/login",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-API-Key": "test-api-key",
          }),
          body: JSON.stringify(credentials),
        }),
      );

      expect(mockCookies.set).toHaveBeenCalledWith(
        "auth_token",
        "new-auth-token",
        { expires: 7 },
      );
      expect(result).toEqual(mockResponse);
    });

    it("returns empty object for successful login without JSON response", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: () => null,
        },
      } as unknown as Response);

      const result = await AuthService.login(credentials);

      expect(result).toEqual({});
      expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it("throws error for failed login", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => "Invalid credentials",
      } as Response);

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(AuthService.login(credentials)).rejects.toThrow(
        "Login failed: 401",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Login failed:",
        401,
        "Invalid credentials",
      );

      consoleErrorSpy.mockRestore();
    });

    it("includes API key in request headers when available", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        headers: {
          get: () => "application/json",
        },
        json: async () => ({ token: "token" }),
      } as unknown as Response);

      await AuthService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-API-Key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("Register", () => {
    const credentials: RegisterCredentials = {
      username: "newuser",
      email: "new@example.com",
      passwordHash: "hashed-password",
      role: AuthRole.User,
    };

    it("successfully registers with valid credentials", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      await expect(AuthService.register(credentials)).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/register",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-API-Key": "test-api-key",
          }),
          body: JSON.stringify(credentials),
        }),
      );
    });

    it("throws error for failed registration", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => "Username already exists",
      } as Response);

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(AuthService.register(credentials)).rejects.toThrow(
        "Registration failed: 400",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Registration failed:",
        400,
        "Username already exists",
      );

      consoleErrorSpy.mockRestore();
    });

    it("includes API key in request headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      await AuthService.register(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-API-Key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("Get Current User", () => {
    it("returns user when token is valid", async () => {
      const mockUser: User = {
        id: 1,
        username: "currentuser",
        email: "current@example.com",
        role: AuthRole.User,
      };

      (mockCookies.get as jest.Mock).mockReturnValue("valid-token");

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const result = await AuthService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/me",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
            "X-API-Key": "test-api-key",
          }),
        }),
      );

      expect(result).toEqual(mockUser);
    });

    it("returns null when no token exists", async () => {
      (mockCookies.get as jest.Mock).mockReturnValue(undefined);

      const result = await AuthService.getCurrentUser();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("removes token and returns null on 401 response", async () => {
      (mockCookies.get as jest.Mock).mockReturnValue("expired-token");

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      } as Response);

      const result = await AuthService.getCurrentUser();

      expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
      expect(result).toBeNull();
    });

    it("removes token and returns null on fetch error", async () => {
      (mockCookies.get as jest.Mock).mockReturnValue("invalid-token");

      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await AuthService.getCurrentUser();

      expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
      expect(result).toBeNull();
    });

    it("includes API key in request headers", async () => {
      (mockCookies.get as jest.Mock).mockReturnValue("valid-token");

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 1, username: "user", role: AuthRole.User }),
      } as Response);

      await AuthService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-API-Key": "test-api-key",
          }),
        }),
      );
    });
  });

  describe("Logout", () => {
    it("removes token from cookies", () => {
      AuthService.logout();

      expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
    });
  });
});
