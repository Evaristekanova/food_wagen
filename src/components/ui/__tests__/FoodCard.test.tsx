import React from "react";
import { render, screen } from "@testing-library/react";
import FoodCard from "../FoodCard";
import { Meal } from "@/src/types/meal";

// Mock the MealMenu component
jest.mock("../MealMenu", () => ({
  MealMenu: ({
    id,
    onEdit,
    onDelete,
  }: {
    id: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => (
    <div data-testid="meal-menu">
      <button onClick={() => onEdit(id)}>Edit</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  ),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("FoodCard Component Rendering", () => {
  const mockMeal: Meal = {
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
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render food card with expected props - displays food name, price, and rating", () => {
    render(
      <FoodCard meal={mockMeal} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Verify food name is displayed (meal name is shown, not restaurant name)
    expect(screen.getByText("Pizza Margherita")).toBeDefined();

    // Verify price is displayed
    expect(screen.getByText("$15.99")).toBeDefined();

    // Verify rating is displayed
    expect(screen.getByText("4.5")).toBeDefined();
  });

  it("should render restaurant name correctly when restaurantName is a string", () => {
    const mealWithStringName: Meal = {
      ...mockMeal,
      restaurantName: "Burger King",
    };

    render(
      <FoodCard
        meal={mealWithStringName}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // FoodCard displays meal name, not restaurant name
    expect(screen.getByText("Pizza Margherita")).toBeDefined();
  });

  it("should render restaurant name correctly when restaurantName is an object", () => {
    const mealWithObjectName: Meal = {
      ...mockMeal,
      name: "McDonald's Burger",
      restaurantName: {
        name: "McDonald's",
        logo: "https://example.com/mcd.png",
        status: "Open",
      },
    };

    render(
      <FoodCard
        meal={mealWithObjectName}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // FoodCard displays the meal name, not the restaurant name
    expect(screen.getByText("McDonald's Burger")).toBeDefined();
  });

  it('should display "Open Now" status when restaurant is open', () => {
    const openMeal: Meal = {
      ...mockMeal,
      open: true,
    };

    render(
      <FoodCard meal={openMeal} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Open Now")).toBeDefined();
  });

  it('should display "Closed" status when restaurant is closed', () => {
    const closedMeal: Meal = {
      ...mockMeal,
      open: false,
    };

    render(
      <FoodCard meal={closedMeal} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Closed")).toBeDefined();
  });

  it("should render meal image with correct alt text", () => {
    render(
      <FoodCard meal={mockMeal} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    // Query all images and find the main meal image by src attribute
    const images = screen.getAllByRole("img");
    const mainMealImage = images.find(
      (img) => img.getAttribute("src") === "https://example.com/pizza.jpg"
    );

    expect(mainMealImage).toBeDefined();
    expect(mainMealImage?.getAttribute("src")).toBe(
      "https://example.com/pizza.jpg"
    );
    expect(mainMealImage?.getAttribute("alt")).toBe("Pizza Margherita");
  });

  it("should render meal menu component", () => {
    render(
      <FoodCard meal={mockMeal} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByTestId("meal-menu")).toBeDefined();
  });
});
