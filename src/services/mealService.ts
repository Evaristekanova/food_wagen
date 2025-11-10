import { Meal } from "../types/meal";
import { api } from "../libs/apiClient";

export const mealService = {
  getMeals: async () => {
    const response = await api.get("Food");
    return response.data;
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
