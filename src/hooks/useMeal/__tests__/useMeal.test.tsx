import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMeal, useMealById } from '../useMeal';
import { mealService } from '@/src/services/mealService';
import { Meal } from '@/src/types/meal';

// Mock the meal service
jest.mock('@/src/services/mealService');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useMeal API Mocking Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up React Query cache and cancel all queries
    await queryClient.cancelQueries();
    queryClient.removeQueries();
    queryClient.clear();
    // Ensure QueryClient is properly reset
    queryClient.resetQueries();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Successful API Data Fetch', () => {
    it('should successfully fetch and return meals data', async () => {
      const mockMeals: Meal[] = [
        {
          id: '1',
          name: 'Pizza Margherita',
          restaurantName: 'Italian Bistro',
          logo: 'https://example.com/logo.png',
          image: 'https://example.com/pizza.jpg',
          avatar: 'https://example.com/pizza.jpg',
          rating: 4.5,
          open: true,
          status: 'Open',
          Price: '15.99',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Burger Deluxe',
          restaurantName: 'Burger King',
          logo: 'https://example.com/burger-logo.png',
          image: 'https://example.com/burger.jpg',
          avatar: 'https://example.com/burger.jpg',
          rating: 4.2,
          open: false,
          status: 'Closed',
          Price: '12.99',
          createdAt: '2024-01-02T00:00:00Z',
        },
      ];

      // Mock successful API response
      (mealService.getMeals as jest.Mock).mockResolvedValue(mockMeals);

      const { result } = renderHook(() => useMeal(), { wrapper });

      // Initially should be loading
      expect(result.current.isLoadingMeals).toBe(true);

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoadingMeals).toBe(false);
      });

      // Verify the data was fetched and returned correctly
      expect(result.current.mealsData).toEqual(mockMeals);
      expect(result.current.mealsData).toHaveLength(2);
      expect(result.current.mealsData?.[0].name).toBe('Pizza Margherita');
      expect(result.current.mealsData?.[0].rating).toBe(4.5);
      expect(result.current.mealsData?.[0].Price).toBe('15.99');
      expect(result.current.mealsData?.[1].name).toBe('Burger Deluxe');
      expect(result.current.mealsData?.[1].open).toBe(false);

      // Verify the API was called
      expect(mealService.getMeals).toHaveBeenCalledTimes(1);
    });

    it('should successfully fetch a single meal by ID', async () => {
      const mockMeal: Meal = {
        id: '1',
        name: 'Pizza Margherita',
        restaurantName: 'Italian Bistro',
        logo: 'https://example.com/logo.png',
        image: 'https://example.com/pizza.jpg',
        avatar: 'https://example.com/pizza.jpg',
        rating: 4.5,
        open: true,
        status: 'Open',
        Price: '15.99',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Mock successful API response
      (mealService.getMealById as jest.Mock).mockResolvedValue(mockMeal);

      const { result } = renderHook(() => useMealById('1', true), { wrapper });

      // Initially should be loading
      expect(result.current.isLoadingMealById).toBe(true);

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isLoadingMealById).toBe(false);
      });

      // Verify the data was fetched and returned correctly
      expect(result.current.mealByIdData).toEqual(mockMeal);
      expect(result.current.mealByIdData?.name).toBe('Pizza Margherita');
      expect(result.current.mealByIdData?.rating).toBe(4.5);
      expect(result.current.mealByIdData?.Price).toBe('15.99');

      // Verify the API was called with correct ID
      expect(mealService.getMealById).toHaveBeenCalledWith('1');
      expect(mealService.getMealById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle API error when fetching meals fails', async () => {
      const errorMessage = 'Failed to fetch meals: Network error';
      const mockError = new Error(errorMessage);

      // Mock failed API response
      (mealService.getMeals as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMeal(), { wrapper });

      // Initially should be loading
      expect(result.current.isLoadingMeals).toBe(true);

      // Wait for the query to complete (with error)
      await waitFor(() => {
        expect(result.current.isLoadingMeals).toBe(false);
      });

      // Verify error state
      expect(result.current.errorMeals).toBeDefined();
      expect(result.current.errorMeals?.message).toBe(errorMessage);
      expect(result.current.mealsData).toEqual([]);

      // Verify the API was called
      expect(mealService.getMeals).toHaveBeenCalledTimes(1);
    });

    it('should handle API error when fetching meal by ID fails', async () => {
      const errorMessage = 'Meal not found';
      const mockError = new Error(errorMessage);

      // Mock failed API response
      (mealService.getMealById as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMealById('999', true), { wrapper });

      // Initially should be loading
      expect(result.current.isLoadingMealById).toBe(true);

      // Wait for the query to complete (with error)
      await waitFor(() => {
        expect(result.current.isLoadingMealById).toBe(false);
      });

      // Verify error state
      expect(result.current.errorMealById).toBeDefined();
      expect(result.current.errorMealById?.message).toBe(errorMessage);
      expect(result.current.mealByIdData).toBeUndefined();

      // Verify the API was called with correct ID
      expect(mealService.getMealById).toHaveBeenCalledWith('999');
      expect(mealService.getMealById).toHaveBeenCalledTimes(1);
    });

    it('should handle network timeout error', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';

      // Mock timeout error
      (mealService.getMeals as jest.Mock).mockRejectedValue(timeoutError);

      const { result } = renderHook(() => useMeal(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoadingMeals).toBe(false);
      });

      // Verify error is handled
      expect(result.current.errorMeals).toBeDefined();
      expect(result.current.errorMeals?.name).toBe('TimeoutError');
      expect(result.current.mealsData).toEqual([]);
    });
  });

  describe('Data Display Verification', () => {
    it('should return meals with all required properties', async () => {
      const mockMeals: Meal[] = [
        {
          id: '1',
          name: 'Test Meal',
          restaurantName: 'Test Restaurant',
          logo: 'https://example.com/logo.png',
          image: 'https://example.com/image.jpg',
          avatar: 'https://example.com/avatar.jpg',
          rating: 4.5,
          open: true,
          status: 'Open',
          Price: '10.99',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (mealService.getMeals as jest.Mock).mockResolvedValue(mockMeals);

      const { result } = renderHook(() => useMeal(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoadingMeals).toBe(false);
      });

      const meal = result.current.mealsData?.[0];
      expect(meal).toHaveProperty('id');
      expect(meal).toHaveProperty('name');
      expect(meal).toHaveProperty('restaurantName');
      expect(meal).toHaveProperty('rating');
      expect(meal).toHaveProperty('Price');
      expect(meal).toHaveProperty('open');
      expect(meal).toHaveProperty('status');
    });
  });
});

