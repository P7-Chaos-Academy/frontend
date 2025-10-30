import Cookies from "js-cookie";
import { setTokenGetter, API_KEY } from "./api/client";

export interface User {
  id: number;
  username: string;
  email?: string;
  role: AuthRole;
}

export enum AuthRole {
  Admin = 1,
  SeedUser = 2,
  User = 3,
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
}

export interface AuthResponse {
  token?: string;
  user?: User;
}

interface RuntimeConfig {
  NEXT_PUBLIC_API_BASE_URL: string;
}

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

setTokenGetter(() => AuthService.getToken());

export class AuthService {
  private static readonly TOKEN_KEY = "auth_token";

  static setToken(token: string): void {
    Cookies.set(this.TOKEN_KEY, token, { expires: 7 }); // 7 days
  }

  static getToken(): string | undefined {
    return Cookies.get(this.TOKEN_KEY);
  }

  static removeToken(): void {
    Cookies.remove(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!this.getToken();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      headers["X-API-Key"] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login failed:", response.status, errorText);
      throw new Error(`Login failed: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.token) {
        this.setToken(data.token);
      }
      return data;
    }

    // If no JSON response, return empty object (successful login but no data)
    return {};
  }

  static async register(credentials: RegisterCredentials): Promise<void> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API Key
    if (API_KEY) {
      headers["X-API-Key"] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Registration failed:", response.status, errorText);
      throw new Error(`Registration failed: ${response.status}`);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      // Add API Key
      if (API_KEY) {
        headers["X-API-Key"] = API_KEY;
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        headers,
      });

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      return await response.json();
    } catch {
      this.removeToken();
      return null;
    }
  }

  static logout(): void {
    this.removeToken();
  }

  static isAdmin(user: User | null): boolean {
    return user?.role === AuthRole.Admin || user?.role === AuthRole.SeedUser;
  }
}
