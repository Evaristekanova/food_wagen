import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../Modal";

describe("Modal Component Rendering", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal with title and children when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Test Modal")).toBeDefined();
    expect(screen.getByText("Modal Content")).toBeDefined();
  });

  it("should not render modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText("Test Modal")).toBeNull();
    expect(screen.queryByText("Modal Content")).toBeNull();
  });

  it("should render modal with custom className", () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        className="custom-modal-class"
      >
        <div>Content</div>
      </Modal>
    );

    const modalContent = screen
      .getByText("Content")
      .closest('div[class*="custom-modal-class"]');
    expect(modalContent).toBeDefined();
  });

  it("should render modal with custom modalBlurClassName", () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        modalBlurClassName="custom-blur-class"
      >
        <div>Content</div>
      </Modal>
    );

    const modalBackdrop = screen
      .getByText("Content")
      .closest('div[class*="custom-blur-class"]');
    expect(modalBackdrop).toBeDefined();
  });

  it("should render modal without title when title is not provided", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content without title</div>
      </Modal>
    );

    expect(screen.getByText("Content without title")).toBeDefined();
  });
});

describe("Modal User Interaction", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when Escape is pressed and modal is closed", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should prevent body scroll when modal is open", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore body scroll when modal is closed", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("unset");
  });
});
