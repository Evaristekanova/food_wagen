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
import { useModal } from "@/src/hooks/useModal";
import DropdownField from "../ui/ComboBox";

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
    .refine((url) => url.startsWith("https://"), {
      message: "URL must use HTTPS protocol",
    }),
  restaurantStatus: z
    .string()
    .refine((val) => val === "open" || val === "closed", {
      message: "Please select a restaurant status!",
    }),
});

type Schema = z.infer<typeof schema>;

interface MealFormProps {
  onClose: () => void;
  isEdit: string | null;
}

const MealForm: React.FC<MealFormProps> = ({ onClose, isEdit }) => {
  const queryClient = useQueryClient();
  const { setIsEdit } = useModal();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      foodRating: undefined as unknown as number,
      restaurantName: "",
      restaurantLogo: "",
      restaurantStatus: "",
    },
  });

  const { mealByIdData, isLoadingMealById } = useMealById(
    isEdit || "",
    !!isEdit
  );
  const { createMeal, isLoadingCreateMeal, isSuccessCreateMeal } =
    useCreateMeal();
  const { updateMeal, isLoadingUpdateMeal, isSuccessUpdateMeal } =
    useUpdateMeal(isEdit || "");

  useEffect(() => {
    if (isEdit && mealByIdData) {
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
      setIsEdit(undefined);
      onClose();
    }
  }, [
    isSuccessCreateMeal,
    isSuccessUpdateMeal,
    onClose,
    reset,
    setIsEdit,
    queryClient,
  ]);

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
      createMeal({
        name: data.name,
        rating: data.foodRating,
        restaurantName: data.restaurantName,
        logo: data.restaurantLogo,
        open: data.restaurantStatus === "open",
      } as Meal);
    }
  };

  if (isLoadingMealById && isEdit) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 px-10">
        <Input
          fieldName="name"
          inputType="text"
          placeholder="Food name"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          fieldName="foodRating"
          inputType="number"
          placeholder="Food rating (1-5)"
          step="0.1"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("foodRating", { valueAsNumber: true })}
          error={errors.foodRating?.message}
        />
        <Input
          fieldName="restaurantName"
          inputType="text"
          placeholder="Restaurant name"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("restaurantName")}
          error={errors.restaurantName?.message}
        />
        <Input
          fieldName="restaurantLogo"
          inputType="text"
          placeholder="Restaurant logo (link)"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("restaurantLogo")}
          error={errors.restaurantLogo?.message}
        />
        <DropdownField
          label="Restaurant status"
          name="restaurantStatus"
          value={watch("restaurantStatus")}
          onChange={(value) =>
            setValue("restaurantStatus", value, { shouldValidate: true })
          }
          options={[
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
          ]}
          required={true}
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
