import React, { useEffect } from "react";
import { Input } from "../ui/CustomInput";
import { Button } from "../ui/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateMeal,
  useMealById,
  useUpdateMeal,
} from "@/src/hooks/useMeal/useMeal";
import Loader from "../ui/Loader";
import { Meal } from "@/src/types/meal";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long!" }),
  foodRating: z
    .number()
    .min(1, { message: "Food rating must be in the range of 1-5!" })
    .max(5, { message: "Food rating must be in the range of 1-5!" }),
  restaurantName: z
    .string()
    .min(3, { message: "Restaurant name must be at least 3 characters long!" }),
  restaurantLogo: z
    .string()
    .url({ message: "Restaurant logo must be a valid URL!" })
    .or(z.string().min(1, { message: "Restaurant logo is required!" })),
  restaurantStatus: z.enum(["open", "closed"] as const, {
    message: "Status must be either 'open' or 'closed'!",
  }),
});

type Schema = z.infer<typeof schema>;

interface MealFormProps {
  onClose: () => void;
  isEdit: string | null;
}
const MealForm: React.FC<MealFormProps> = ({ onClose, isEdit }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      foodRating: 0,
      restaurantName: "",
      restaurantLogo: "",
      restaurantStatus: "open" as const,
    },
  });

  const { mealByIdData, isLoadingMealById, errorMealById } = useMealById(
    isEdit || "",
    !!isEdit ? true : false
  );
  const {
    createMeal,
    isLoadingCreateMeal,
    errorCreateMeal,
    isSuccessCreateMeal,
  } = useCreateMeal();
  const {
    updateMeal,
    isLoadingUpdateMeal,
    errorUpdateMeal,
    isSuccessUpdateMeal,
  } = useUpdateMeal(isEdit || "");

  useEffect(() => {
    if (isEdit) {
      setValue("name", mealByIdData?.name || "");
      setValue("foodRating", mealByIdData?.rating || 0);
      setValue(
        "restaurantName",
        (typeof mealByIdData?.restaurantName === "string"
          ? mealByIdData?.restaurantName
          : mealByIdData?.restaurantName?.name) || ""
      );
      setValue("restaurantLogo", mealByIdData?.logo || "");
      setValue("restaurantStatus", mealByIdData?.open ? "open" : "closed");
    }
  }, [isEdit, mealByIdData, setValue]);

  useEffect(() => {
    if (isSuccessCreateMeal || isSuccessUpdateMeal) {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      reset();
      onClose();
    }
  }, [isSuccessCreateMeal, isSuccessUpdateMeal, onClose, reset]);

  const onSubmit = (data: Schema) => {
    if (isEdit) {
      updateMeal({
        id: isEdit,
        name: data.name,
        rating: data.foodRating,
        restaurantName: data.restaurantName,
        logo: data.restaurantLogo,
        open: data.restaurantStatus === "open",
      } as Meal);
    } else {
      reset();
      createMeal({
        name: data.name,
        rating: data.foodRating,
        restaurantName: data.restaurantName,
        logo: data.restaurantLogo,
        open: data.restaurantStatus === "open",
      } as Meal);
    }
  };

  if (isLoadingMealById) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 px-10">
        <Input
          fieldName="name"
          inputType="text"
          placeholder="Food name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          fieldName="foodRating"
          inputType="number"
          placeholder="Food rating (1-5)"
          step="0.1"
          {...register("foodRating", { valueAsNumber: true })}
          error={errors.foodRating?.message}
        />
        <Input
          fieldName="restaurantName"
          inputType="text"
          placeholder="Restaurant name"
          {...register("restaurantName")}
          error={errors.restaurantName?.message}
        />
        <Input
          fieldName="restaurantLogo"
          inputType="text"
          placeholder="Restaurant logo (link)"
          {...register("restaurantLogo")}
          error={errors.restaurantLogo?.message}
        />
        <Input
          fieldName="restaurantStatus"
          inputType="text"
          placeholder="Restaurant status (open/closed)"
          {...register("restaurantStatus")}
          error={errors.restaurantStatus?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="bg-food-yellow-1 text-white px-4 py-3 rounded-md font-bold cursor-pointer"
            type="submit"
            isLoading={isLoadingCreateMeal || isLoadingUpdateMeal}
            disabled={isLoadingCreateMeal || isLoadingUpdateMeal}
          >
            {isEdit ? "Save" : "Add"}
          </Button>
          <Button
            className="border-2 border-food-yellow-1 text-black px-4 py-3 rounded-md font-bold cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MealForm;
