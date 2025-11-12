import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMeal } from "@/src/hooks/useMeal/useMeal";
import FoodList from "../FoodList";
import { mealService } from "@/src/services/mealService";
import { Meal } from "@/src/types/meal";

// Mock the meal service to control API responses
jest.mock("@/src/services/mealService");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child components
jest.mock("@/src/components/ui/FoodCard", () => ({
  __esModule: true,
  default: ({
    meal,
    onEdit,
    onDelete,
  }: {
    meal: Meal;
    onEdit: () => void;
    onDelete: () => void;
  }) => (
    <div data-testid={`food-card-${meal.id}`}>
      <span>{meal.name}</span>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

jest.mock("@/src/components/ui/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Test component that uses the hook
const TestComponent: React.FC<{ searchQuery?: string }> = ({ searchQuery }) => {
  const { mealsData, isLoadingMeals } = useMeal(searchQuery);
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  return (
    <FoodList
      meals={mealsData}
      onEdit={mockOnEdit}
      onDelete={mockOnDelete}
      isLoading={isLoadingMeals}
      searchQuery={searchQuery}
    />
  );
};

describe("FoodList API Error Handling", () => {
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

  const renderComponent = (searchQuery?: string) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TestComponent searchQuery={searchQuery} />
      </QueryClientProvider>
    );
  };

  it("should display error message when API request fails", async () => {
    // Mock API to throw an error
    const mockError = new Error("Failed to fetch meals: Network error");
    (mealService.getMeals as jest.Mock).mockRejectedValue(mockError);

    renderComponent();

    // Initially should show loading
    expect(screen.getByTestId("loader")).toBeDefined();

    // Wait for error state
    await waitFor(
      () => {
        expect(screen.queryByTestId("loader")).toBeNull();
      },
      { timeout: 3000 }
    );

    // Verify error handling - should show empty state when API fails
    // The hook returns empty array on error, so we should see "No meals available"
    await waitFor(() => {
      const noMealsMessage = screen.getByText("No meals available");
      expect(noMealsMessage).toBeDefined();
    });

    // Verify API was called
    expect(mealService.getMeals).toHaveBeenCalledTimes(1);
  });

  it("should successfully fetch and display meals when API request succeeds", async () => {
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

    // Mock successful API response
    (mealService.getMeals as jest.Mock).mockResolvedValue(mockMeals);

    renderComponent();

    // Initially should show loading
    expect(screen.getByTestId("loader")).toBeDefined();

    // Wait for data to load
    await waitFor(
      () => {
        expect(screen.queryByTestId("loader")).toBeNull();
      },
      { timeout: 3000 }
    );

    // Verify meals are displayed
    await waitFor(() => {
      expect(screen.getByTestId("food-card-1")).toBeDefined();
      expect(screen.getByTestId("food-card-2")).toBeDefined();
      expect(screen.getByText("Pizza Margherita")).toBeDefined();
      expect(screen.getByText("Burger Deluxe")).toBeDefined();
    });

    // Verify API was called
    expect(mealService.getMeals).toHaveBeenCalledTimes(1);
    expect(mealService.getMeals).toHaveBeenCalledWith(undefined);
  });

  it("should handle 404 error gracefully (return empty array)", async () => {
    // Mock 404 error - mealService returns empty array for 404
    const axiosError = {
      response: {
        status: 404,
        data: { message: "Not found" },
      },
    };
    (mealService.getMeals as jest.Mock).mockRejectedValue(axiosError);

    renderComponent();

    // Wait for error handling
    await waitFor(
      () => {
        expect(screen.queryByTestId("loader")).toBeNull();
      },
      { timeout: 3000 }
    );

    // 404 errors return empty array, so should show "No meals available"
    await waitFor(() => {
      const noMealsMessage = screen.getByText("No meals available");
      expect(noMealsMessage).toBeDefined();
    });

    // Verify API was called
    expect(mealService.getMeals).toHaveBeenCalledTimes(1);
  });

  it("should handle search query with API call", async () => {
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
    ];

    // Mock successful API response with search query
    (mealService.getMeals as jest.Mock).mockResolvedValue(mockMeals);

    renderComponent("pizza");

    // Wait for data to load
    await waitFor(
      () => {
        expect(screen.queryByTestId("loader")).toBeNull();
      },
      { timeout: 3000 }
    );

    // Verify API was called with search query
    await waitFor(() => {
      expect(mealService.getMeals).toHaveBeenCalledWith("pizza");
      expect(screen.getByText("Pizza Margherita")).toBeDefined();
    });
  });
});
