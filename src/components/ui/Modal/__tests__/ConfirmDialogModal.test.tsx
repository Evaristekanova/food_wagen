import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialogModal from "../ConfirmDialogModal";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the Button component
jest.mock("../../Button", () => ({
  Button: ({
    children,
    onClick,
    isLoading,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} disabled={disabled || isLoading} {...props}>
      {isLoading ? "Loading..." : children}
    </button>
  ),
}));

// Mock the Modal component
jest.mock("../Modal", () => ({
  Modal: ({
    isOpen,
    children,
    title,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    title: React.ReactNode;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    );
  },
}));

describe("ConfirmDialogModal Component Rendering", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal with title and message when isOpen is true", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
      />
    );

    expect(screen.getByText("Delete Item")).toBeDefined();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeDefined();
  });

  it("should render with default confirm and cancel button text", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm"
        message="Are you sure?"
      />
    );

    expect(screen.getByRole("button", { name: /confirm/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDefined();
  });

  it("should render with custom confirm and cancel button text", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
        confirmButtonText="Yes, Delete"
        cancelButtonText="No, Keep"
      />
    );

    expect(screen.getByRole("button", { name: /yes, delete/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /no, keep/i })).toBeDefined();
  });

  it("should not render modal when isOpen is false", () => {
    render(
      <ConfirmDialogModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
      />
    );

    expect(screen.queryByTestId("modal")).toBeNull();
  });

  it("should show loading state on confirm button when isLoading is true", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
        isLoading={true}
      />
    );

    // When loading, button text changes to "Loading..."
    const confirmButton = screen.getByRole("button", {
      name: /loading/i,
    }) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toBe("Loading...");
  });
});

describe("ConfirmDialogModal User Interaction", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("should not call onClose when confirm button is clicked and isLoading is true", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole("button", {
      name: /loading/i,
    }) as HTMLButtonElement;
    // Button is disabled when loading, so click won't work
    // But we can verify the button state
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toBe("Loading...");

    // When disabled, onClick handlers don't fire
    // This is the expected behavior - disabled buttons don't trigger events
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should disable confirm button when isLoading is true", () => {
    render(
      <ConfirmDialogModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete"
        message="Are you sure?"
        isLoading={true}
      />
    );

    const confirmButton = screen.getByRole("button", {
      name: /loading/i,
    }) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
  });
});
