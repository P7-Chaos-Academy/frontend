import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfilePage from "@/app/(dashboard)/profile/page";
import * as authContext from "@/contexts/AuthContext";
import { jest } from "@jest/globals";

jest.mock("@/contexts/AuthContext");

const mockUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
}));

describe("ProfilePage - Logout Dialog", () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      user: { id: "1", email: "test@example.com" },
      loading: false,
      logout: mockLogout,
      isAdmin: false,
    });
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it("renders logout confirmation dialog when Sign out button is clicked", async () => {
    render(<ProfilePage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to sign out?")
      ).toBeInTheDocument();
    });
  });

  it("closes dialog when Cancel button is clicked", async () => {
    render(<ProfilePage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    });
  });

  it("successfully logs out user when confirming through dialog", async () => {
    render(<ProfilePage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    });
    
    const dialogButtons = screen.getAllByRole("button");
    const dialogConfirmButton = dialogButtons.find(
      (btn) => btn.textContent?.includes("Sign out") && btn.closest('[role="dialog"]')
    );
    
    await act(async () => {
      fireEvent.click(dialogConfirmButton!);
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    await waitFor(() => {
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    });
  });

  it("disables Sign out button when no user is logged in", () => {
    (authContext.useAuth as unknown as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      logout: mockLogout,
      isAdmin: false,
    });

    render(<ProfilePage />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    expect(signOutButton).toBeDisabled();
  });
});
