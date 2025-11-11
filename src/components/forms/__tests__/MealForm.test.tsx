import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MealForm from "../MealForm";
import * as useMealHook from "@/src/hooks/useMeal/useMeal";

// Mock the hooks
jest.mock("@/src/hooks/useMeal/useMeal");
jest.mock("@/src/hooks/useModal", () => ({
  useModal: () => ({
    setIsEdit: jest.fn(),
  }),
}));

// Mock the UI components
jest.mock("../../ui/CustomInput", () => ({
  Input: ({
    fieldName,
    placeholder,
    error,
    inputType,
    ...props
  }: {
    fieldName: string;
    placeholder: string;
    error: string;
    inputType?: string;
    [key: string]: unknown;
  }): React.ReactNode => {
    // Filter out inputType and other non-DOM props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { inputType: _, ...domProps } = props;
    return (
      <div>
        <input
          data-testid={`input-${fieldName}`}
          placeholder={placeholder}
          type={inputType || "text"}
          {...(domProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        {error && <span data-testid={`error-${fieldName}`}>{error}</span>}
      </div>
    );
  },
}));

jest.mock("../../ui/Button", () => ({
  Button: ({
    children,
    onClick,
    type,
    isLoading,
    disabled,
    loadingText,
    ...props
  }: {
    children: React.ReactNode;
    onClick: () => void;
    type: "button" | "submit" | "reset";
    isLoading: boolean;
    disabled: boolean;
    loadingText?: string;
    [key: string]: unknown;
  }): React.ReactNode => {
    // Filter out loadingText and other non-DOM props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loadingText: _, ...domProps } = props;
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled || isLoading}
        {...(domProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {isLoading ? loadingText || "Loading..." : children}
      </button>
    );
  },
}));

jest.mock("../../ui/ComboBox", () => ({
  __esModule: true,
  default: ({
    label,
    value,
    onChange,
    options,
    error,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    error: string;
  }): React.ReactNode => (
    <div>
      <label>{label}</label>
      <select
        data-testid="restaurant-status-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select status</option>
        {options.map((opt: { value: string; label: string }) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span data-testid="error-restaurantStatus">{error}</span>}
    </div>
  ),
}));

jest.mock("../../ui/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("MealForm User Interaction", () => {
  let queryClient: QueryClient;
  const mockCreateMeal = jest.fn();
  const mockUpdateMeal = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // Disable garbage collection to speed up tests
        },
        mutations: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    // Mock invalidateQueries to prevent hanging
    queryClient.invalidateQueries = jest.fn().mockResolvedValue(undefined);

    jest.clearAllMocks();

    // Default mock implementations
    (useMealHook.useMealById as jest.Mock).mockReturnValue({
      mealByIdData: null,
      isLoadingMealById: false,
      errorMealById: null,
    });

    (useMealHook.useCreateMeal as jest.Mock).mockReturnValue({
      createMeal: mockCreateMeal,
      isLoadingCreateMeal: false,
      isSuccessCreateMeal: false,
    });

    (useMealHook.useUpdateMeal as jest.Mock).mockReturnValue({
      updateMeal: mockUpdateMeal,
      isLoadingUpdateMeal: false,
      isSuccessUpdateMeal: false,
    });
  });

  afterEach(async () => {
    // Clean up rendered components
    cleanup();
    // Clean up React Query cache and cancel all queries
    await queryClient.cancelQueries();
    queryClient.removeQueries();
    queryClient.clear();
    // Ensure QueryClient is properly reset
    queryClient.resetQueries();
  });

  const renderMealForm = (isEdit: string | null = null) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MealForm onClose={mockOnClose} isEdit={isEdit} />
      </QueryClientProvider>
    );
  };

  it("should render form with all input fields", () => {
    renderMealForm();

    expect(screen.getByTestId("input-food-name")).toBeDefined();
    expect(screen.getByTestId("input-food-rating")).toBeDefined();
    expect(screen.getByTestId("input-restaurant-logo")).toBeDefined();
    expect(screen.getByTestId("input-restaurant-avatar")).toBeDefined();
    expect(screen.getByTestId("restaurant-status-select")).toBeDefined();
  });

  it("should allow user to input form data and submit successfully", async () => {
    const user = userEvent.setup();

    // Mock creation - start with success false, we only need to verify the function was called
    (useMealHook.useCreateMeal as jest.Mock).mockReturnValue({
      createMeal: mockCreateMeal,
      isLoadingCreateMeal: false,
      isSuccessCreateMeal: false, // Don't trigger useEffect immediately
    });

    renderMealForm();

    // Fill in the form
    await user.type(screen.getByTestId("input-food-name"), "Burger");
    await user.type(screen.getByTestId("input-food-rating"), "4.5");
    await user.type(screen.getByTestId("input-restaurant-logo"), "https://example.com/logo.png");
    await user.type(screen.getByTestId("input-restaurant-avatar"), "https://example.com/avatar.png");
    await user.selectOptions(
      screen.getByTestId("restaurant-status-select"),
      "true"
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add/i });
    await user.click(submitButton);

    // Verify the createMeal function was called with correct data
    expect(mockCreateMeal).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Burger",
        rating: 4.5,
        logo: "https://example.com/logo.png",
        avatar: "https://example.com/avatar.png",
        open: true,
        status: "true",
      })
    );
  });

  it("should show validation errors for invalid input", async () => {
    const user = userEvent.setup();

    renderMealForm();

    // Try to submit empty form
    const submitButton = screen.getByRole("button", { name: /add/i });
    await user.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(
      () => {
        const errorElement = screen.getByTestId("error-food-name");
        expect(errorElement).toBeDefined();
      },
      { timeout: 3000 }
    );
  });

  it("should validate minimum name length", async () => {
    const user = userEvent.setup();

    renderMealForm();

    // Enter name that's too short
    await user.type(screen.getByTestId("input-food-name"), "Ab");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(
      () => {
        const errorElement = screen.getByTestId("error-food-name");
        expect(errorElement).toBeDefined();
        expect(errorElement.textContent).toBe(
          "Name must be at least 3 characters long!"
        );
      },
      { timeout: 3000 }
    );
  });

  it("should validate rating range", async () => {
    const user = userEvent.setup();

    renderMealForm();

    // Enter invalid rating
    await user.type(screen.getByTestId("input-food-name"), "Burger");
    await user.type(screen.getByTestId("input-food-rating"), "6");
    await user.type(screen.getByTestId("input-restaurant-logo"), "https://example.com/logo.png");
    await user.type(screen.getByTestId("input-restaurant-avatar"), "https://example.com/avatar.png");
    await user.selectOptions(
      screen.getByTestId("restaurant-status-select"),
      "true"
    );

    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(
      () => {
        const errorElement = screen.getByTestId("error-food-rating");
        expect(errorElement).toBeDefined();
        expect(errorElement.textContent).toBe(
          "Food rating must be in the range of 1-5!"
        );
      },
      { timeout: 3000 }
    );
  });

  it("should validate URL format for restaurant logo", async () => {
    const user = userEvent.setup();

    renderMealForm();

    await user.type(screen.getByTestId("input-food-name"), "Burger");
    await user.type(screen.getByTestId("input-food-rating"), "4.5");
    await user.type(screen.getByTestId("input-restaurant-logo"), "invalid-url");
    await user.type(screen.getByTestId("input-restaurant-avatar"), "https://example.com/avatar.png");
    await user.selectOptions(
      screen.getByTestId("restaurant-status-select"),
      "true"
    );

    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(
      () => {
        expect(screen.getByTestId("error-restaurant-logo")).toBeDefined();
      },
      { timeout: 3000 }
    );
  });

  it("should populate form fields when editing a meal", async () => {
    const mockMealData = {
      id: "1",
      name: "Pizza",
      rating: 4.5,
      restaurantName: "Pizza Place",
      logo: "https://example.com/logo.png",
      open: true,
      status: "Open",
      Price: "15.99",
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "",
      image: "",
    };

    (useMealHook.useMealById as jest.Mock).mockReturnValue({
      mealByIdData: mockMealData,
      isLoadingMealById: false,
      errorMealById: null,
    });

    renderMealForm("1");

    await waitFor(
      () => {
        expect(
          (screen.getByTestId("input-food-name") as HTMLInputElement).value
        ).toBe("Pizza");
        expect(
          (screen.getByTestId("input-food-rating") as HTMLInputElement).value
        ).toBe("4.5");
        expect(
          (screen.getByTestId("input-restaurant-logo") as HTMLInputElement).value
        ).toBe("https://example.com/logo.png");
        expect(
          (screen.getByTestId("input-restaurant-avatar") as HTMLInputElement).value
        ).toBe("");
        expect(
          (screen.getByTestId("restaurant-status-select") as HTMLSelectElement)
            .value
        ).toBe("true");
      },
      { timeout: 3000 }
    );
  });

  it("should call updateMeal when submitting edit form", async () => {
    const user = userEvent.setup();

    const mockMealData = {
      id: "1",
      name: "Pizza",
      rating: 4.5,
      restaurantName: "Pizza Place",
      logo: "https://example.com/logo.png",
      open: true,
      status: "Open",
      Price: "15.99",
      createdAt: "2024-01-01T00:00:00Z",
      avatar: "https://example.com/avatar.png",
      image: "",
    };

    (useMealHook.useMealById as jest.Mock).mockReturnValue({
      mealByIdData: mockMealData,
      isLoadingMealById: false,
      errorMealById: null,
    });

    (useMealHook.useUpdateMeal as jest.Mock).mockReturnValue({
      updateMeal: mockUpdateMeal,
      isLoadingUpdateMeal: false,
      isSuccessUpdateMeal: false, // Don't trigger useEffect immediately
    });

    renderMealForm("1");

    // Wait for form to populate
    await waitFor(
      () => {
        expect(
          (screen.getByTestId("input-food-name") as HTMLInputElement).value
        ).toBe("Pizza");
        expect(
          (screen.getByTestId("input-food-rating") as HTMLInputElement).value
        ).toBe("4.5");
        expect(
          (screen.getByTestId("input-restaurant-logo") as HTMLInputElement).value
        ).toBe("https://example.com/logo.png");
        expect(
          (screen.getByTestId("input-restaurant-avatar") as HTMLInputElement).value
        ).toBe("https://example.com/avatar.png");
        expect(
          (screen.getByTestId("restaurant-status-select") as HTMLSelectElement)
            .value
        ).toBe("true");
      },
      { timeout: 3000 }
    );

    // Change the name
    await user.clear(screen.getByTestId("input-food-name"));
    await user.type(screen.getByTestId("input-food-name"), "Updated Pizza");

    // Submit
    const submitButton = screen.getByRole("button", { name: /save/i });
    await user.click(submitButton);

    // Verify updateMeal was called - wait for form submission
    await waitFor(
      () => {
        expect(mockUpdateMeal).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Updated Pizza",
            rating: 4.5,
            logo: "https://example.com/logo.png",
            avatar: "https://example.com/avatar.png",
            open: true,
            status: "true",
          })
        );
      },
      { timeout: 3000 }
    );
  });
});
