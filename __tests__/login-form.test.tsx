import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "@/components/LoginForm";
import * as authContext from "@/contexts/AuthContext";
import { jest } from "@jest/globals";

jest.mock("@/contexts/AuthContext");

describe("LoginForm - Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockLogin = jest.fn(async () => {
      throw new Error("Invalid credentials");
    });
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it("shows error when login fails", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your credentials.")
      ).toBeInTheDocument();
    });
  });

  it("disables button while loading and re-enables after failure", async () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(button);

    // During submission, label changes to Signing in...
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your credentials.")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
    });
  });
});

describe("LoginForm - Success Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockLogin = jest.fn(async () => Promise.resolve());
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("authorizes user and redirects on successful login", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "validpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Button should be in loading state initially
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    // Wait for login to resolve
    await waitFor(() => {
      // No error should be shown
      expect(
        screen.queryByText("Login failed. Please check your credentials.")
      ).not.toBeInTheDocument();
    });

    // Confirm redirect timer scheduled
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

    // Advance the setTimeout used for redirect
    jest.advanceTimersByTime(150);
  });
});