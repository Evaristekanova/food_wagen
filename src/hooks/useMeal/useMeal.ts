import { useMutation, useQuery } from "@tanstack/react-query";
import { mealService } from "@/src/services/mealService";
import { toast } from "sonner";
import { Meal } from "@/src/types/meal";

export const useMeal = () => {
  const {
    data: mealsData,
    isPending: isLoadingMeals,
    error: errorMeals,
  } = useQuery<Meal[], Error>({
    queryKey: ["meals"],
    queryFn: async () => (await mealService.getMeals()) as Meal[],
    meta: {
      onSuccess: () => {
        toast.success("Meals fetched successfully!");
      },
      onError: (error: Error) => {
        toast.error(`${error?.message || "Failed to fetch meals"}`);
      },
    },
  });

  return {
    mealsData,
    isLoadingMeals,
    errorMeals,
  };
};

export const useMealById = (id: string, enable?: boolean) => {
  const {
    data: mealByIdData,
    isPending: isLoadingMealById,
    error: errorMealById,
  } = useQuery<Meal, Error>({
    queryKey: ["mealById", id],
    queryFn: async () => (await mealService.getMealById(id)) as Meal,
    enabled: !!enable,
  });
  return {
    mealByIdData,
    isLoadingMealById,
    errorMealById,
  };
};

export const useCreateMeal = () => {
  const {
    mutate: createMeal,
    isPending: isLoadingCreateMeal,
    error: errorCreateMeal,
    isSuccess: isSuccessCreateMeal,
  } = useMutation({
    mutationFn: async (meal: Meal) => await mealService.createMeal(meal),
    onSuccess: () => {
      toast.success("Meal created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`${error?.message || "Failed to create meal"}`);
    },
  });
  return {
    createMeal,
    isLoadingCreateMeal,
    errorCreateMeal,
    isSuccessCreateMeal,
  };
};

export const useUpdateMeal = (id: string) => {
  const {
    mutate: updateMeal,
    isPending: isLoadingUpdateMeal,
    error: errorUpdateMeal,
    isSuccess: isSuccessUpdateMeal,
  } = useMutation({
    mutationFn: async (meal: Meal) => await mealService.updateMeal(id, meal),
    onSuccess: () => {
      toast.success("Meal updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`${error?.message || "Failed to update meal"}`);
    },
  });
  return {
    updateMeal,
    isLoadingUpdateMeal,
    errorUpdateMeal,
    isSuccessUpdateMeal,
  };
};

export const useDeleteMealById = () => {
  const {
    mutate: deleteMealById,
    isPending: isLoadingDeleteMealById,
    error: errorDeleteMealById,
    isSuccess: isSuccessDeleteMealById,
  } = useMutation({
    mutationFn: async (id: string) => await mealService.deleteMeal(id),
    onSuccess: () => {
      toast.success("Meal deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`${error?.message || "Failed to delete meal"}`);
    },
  });
  return {
    deleteMealById,
    isLoadingDeleteMealById,
    errorDeleteMealById,
    isSuccessDeleteMealById,
  };
};
