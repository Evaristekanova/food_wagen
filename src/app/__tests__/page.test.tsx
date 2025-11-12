import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "../page";
import * as useMealHook from "@/src/hooks/useMeal/useMeal";
import { Meal } from "@/src/types/meal";

// Mock the hooks
jest.mock("@/src/hooks/useMeal/useMeal");
jest.mock("@/src/hooks/useModal", () => ({
  useModal: () => ({
    isOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
    setIsEdit: jest.fn(),
    isEdit: undefined,
  }),
}));

// Mock child components
jest.mock("@/src/components/ui/Navbar", () => ({
  __esModule: true,
  default: ({ onAddMeal }: { onAddMeal: () => void }) => (
    <nav data-testid="navbar">
      <button onClick={onAddMeal}>Add Meal</button>
    </nav>
  ),
}));

jest.mock("@/src/components/Header", () => ({
  __esModule: true,
  default: ({
    searchQuery,
    onSearchChange,
  }: {
    searchQuery: string;
    onSearchChange: (query: string) => void;
  }) => (
    <header data-testid="header">
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </header>
  ),
}));

jest.mock("@/src/components/FoodList/FoodList", () => ({
  __esModule: true,
  default: ({
    meals,
    isLoading,
  }: {
    meals: Meal[];
    isLoading: boolean;
    searchQuery?: string;
  }) => (
    <div data-testid="food-list">
      {isLoading ? (
        <div data-testid="loading">Loading meals...</div>
      ) : meals.length === 0 ? (
        <div data-testid="no-meals">No meals available</div>
      ) : (
        <div data-testid="meals-container">
          {meals.map((meal) => (
            <div key={meal.id} data-testid={`meal-${meal.id}`}>
              {meal.name}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

jest.mock("@/src/components/ui/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("@/src/components/ui/Modal/Modal", () => ({
  Modal: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

jest.mock("@/src/components/ui/Modal/ConfirmDialogModal", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("HomePage API Error Handling", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
          gcTime: 0,
        },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await queryClient.cancelQueries();
    queryClient.removeQueries();
    queryClient.clear();
    queryClient.resetQueries();
  });

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    );
  };

  it("should display error state when API request fails", async () => {
    const mockError = new Error("Failed to fetch meals: Network error");

    // Mock the useMeal hook to return an error
    (useMealHook.useMeal as jest.Mock).mockReturnValue({
      mealsData: [],
      isLoadingMeals: false,
      errorMeals: mockError,
    });

    (useMealHook.useDeleteMealById as jest.Mock).mockReturnValue({
      deleteMealById: jest.fn(),
      isLoadingDeleteMealById: false,
      isSuccessDeleteMealById: false,
    });

    renderPage();

    // Wait for the component to render with error state
    await waitFor(() => {
      expect(screen.getByTestId("food-list")).toBeDefined();
    });

    // Verify that no meals are displayed (empty array due to error)
    const noMealsMessage = screen.getByTestId("no-meals");
    expect(noMealsMessage).toBeDefined();
    expect(noMealsMessage.textContent).toBe("No meals available");

    // Verify the hook was called
    expect(useMealHook.useMeal).toHaveBeenCalled();
  });

  it("should display loading state while API request is in progress", () => {
    // Mock the useMeal hook to return loading state
    (useMealHook.useMeal as jest.Mock).mockReturnValue({
      mealsData: [],
      isLoadingMeals: true,
      errorMeals: null,
    });

    (useMealHook.useDeleteMealById as jest.Mock).mockReturnValue({
      deleteMealById: jest.fn(),
      isLoadingDeleteMealById: false,
      isSuccessDeleteMealById: false,
    });

    renderPage();

    // Verify loading state is displayed
    const loadingIndicator = screen.getByTestId("loading");
    expect(loadingIndicator).toBeDefined();
    expect(loadingIndicator.textContent).toBe("Loading meals...");
  });

  it("should display meals when API request succeeds", async () => {
    const mockMeals: Meal[] = [
      {
        id: "1",
        name: "Pizza Margherita",
        restaurantName: "Italian Bistro",
        logo: "https://example.com/logo.png",
        image: "https://example.com/pizza.jpg",
        avatar: "https://example.com/pizza.jpg",
        rating: 4.5,
        open: true,
        status: "Open",
        Price: "15.99",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Burger Deluxe",
        restaurantName: "Burger King",
        logo: "https://example.com/burger-logo.png",
        image: "https://example.com/burger.jpg",
        avatar: "https://example.com/burger.jpg",
        rating: 4.2,
        open: false,
        status: "Closed",
        Price: "12.99",
        createdAt: "2024-01-02T00:00:00Z",
      },
    ];

    // Mock the useMeal hook to return successful data
    (useMealHook.useMeal as jest.Mock).mockReturnValue({
      mealsData: mockMeals,
      isLoadingMeals: false,
      errorMeals: null,
    });

    (useMealHook.useDeleteMealById as jest.Mock).mockReturnValue({
      deleteMealById: jest.fn(),
      isLoadingDeleteMealById: false,
      isSuccessDeleteMealById: false,
    });

    renderPage();

    // Wait for meals to be displayed
    await waitFor(() => {
      expect(screen.getByTestId("meals-container")).toBeDefined();
    });

    // Verify meals are displayed
    expect(screen.getByTestId("meal-1").textContent).toBe("Pizza Margherita");
    expect(screen.getByTestId("meal-2").textContent).toBe("Burger Deluxe");
  });
});
