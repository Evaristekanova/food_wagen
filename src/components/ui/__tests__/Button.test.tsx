import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

// Mock lucide-react Loader2 icon
jest.mock("lucide-react", () => ({
  Loader2: ({ className }: { className?: string }) => (
    <svg data-testid="loader-icon" className={className}>
      <title>Loading</title>
    </svg>
  ),
}));

describe("Button Component Rendering", () => {
  it("should render button with children text", () => {
    render(<Button>Click Me</Button>);

    expect(screen.getByRole("button", { name: /click me/i })).toBeDefined();
  });

  it("should render button with custom className", () => {
    render(<Button className="custom-class">Test Button</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("should render button with loading state and loading text", () => {
    render(
      <Button isLoading={true} loadingText="Processing...">
        Submit
      </Button>
    );

    expect(screen.getByTestId("loader-icon")).toBeDefined();
    expect(screen.getByText("Processing...")).toBeDefined();
    expect(screen.queryByText("Submit")).toBeNull();
  });

  it("should render button as disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("should render button as disabled when isLoading is true", () => {
    render(<Button isLoading>Loading Button</Button>);

    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.className).toContain("opacity-70");
    expect(button.className).toContain("disabled:cursor-not-allowed");
  });

  it("should render button with default loading text when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);

    expect(screen.getByText("processing...")).toBeDefined();
  });
});

describe("Button User Interaction", () => {
  it("should call onClick handler when button is clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when button is disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should not call onClick when button is loading", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} isLoading>
        Loading Button
      </Button>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should support different button types", () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).type).toBe(
      "submit"
    );

    rerender(<Button type="reset">Reset</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).type).toBe(
      "reset"
    );

    rerender(<Button type="button">Button</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).type).toBe(
      "button"
    );
  });
});
