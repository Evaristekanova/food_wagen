import { Meal } from "../types/meal";
import { api } from "../libs/apiClient";

export const mealService = {
  getMeals: async (name?: string) => {
    try {
      const url = name ? `Food?name=${encodeURIComponent(name)}` : "Food";
      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return [];
      }
      throw error;
    }
  },
  getMealById: async (id: string) => {
    const response = await api.get<Meal>(`Food/${id}`);
    return response.data;
  },
  createMeal: async (meal: Meal) => {
    const response = await api.post<Meal>("Food", meal);
    return response.data;
  },
  updateMeal: async (id: string, meal: Meal) => {
    const response = await api.put<Meal>(`Food/${id}`, meal);
    return response.data;
  },
  deleteMeal: async (id: string) => {
    const response = await api.delete<Meal>(`Food/${id}`);
    return response.data;
  },
};
