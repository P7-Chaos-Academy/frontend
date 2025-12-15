import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
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

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your credentials.")
      ).toBeInTheDocument();
    });
  });

  it("disables button while loading and re-enables after failure", async () => {
    // Override mock with a controllable rejecting promise so we can observe loading state
    let rejectLogin: (reason?: unknown) => void = () => {};
    const loginPromise = new Promise<never>((_, reject) => {
      rejectLogin = reject;
    });
    const mockLogin = jest.fn(() => loginPromise);
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpass" },
    });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/signing in/i);
    });

    // Trigger rejection to finish the flow
    rejectLogin(new Error("Invalid credentials"));

    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please check your credentials.")
      ).toBeInTheDocument();
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent(/sign in/i);
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

    let resolveLogin: () => void = () => {};
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });
    const mockLogin = jest.fn(() => loginPromise);
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "validpass" },
    });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent(/signing in/i);
    });

    // Resolve login to continue flow
    resolveLogin();

    await waitFor(() => {
      expect(
        screen.queryByText("Login failed. Please check your credentials.")
      ).not.toBeInTheDocument();
    });

    // Confirm redirect timer scheduled
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

    // Advance the setTimeout used for redirect
    act(() => {
      jest.advanceTimersByTime(150);
    });
  });
});