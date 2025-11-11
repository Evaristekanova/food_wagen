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

// const imageUrlValidator = z
//   .string()
//   .min(1, { message: "Image is required!" })
//   .url({ message: "Must be a valid URL!" })
//   .refine((url) => url.startsWith("https://"), {
//     message: "URL must use HTTPS protocol!",
//   })
//   .refine(
//     (url) => {
//       const hasImageExtension =
//         /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(url);
//       return hasImageExtension;
//     },
//     { message: "URL must be a valid image (jpg, png, gif, webp, svg)" }
//   );

const imageUrlValidator = z
  .string()
  .min(1, { message: "Image URL is required!" })
  .url({ message: "Must be a valid image URL!" })
  .refine((url) => url.startsWith("https://"), {
    message: "Image URL must use HTTPS protocol!",
  });

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long!" }),
  rating: z
    .number()
    .min(1, { message: "Food rating must be in the range of 1-5!" })
    .max(5, { message: "Food rating must be in the range of 1-5!" }),
  logo: imageUrlValidator,
  avatar: imageUrlValidator,
  open: z.boolean(),
  status: z.string().refine((val) => val === "true" || val === "false", {
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
      rating: undefined as unknown as number,
      logo: "",
      avatar: "",
      open: false,
      status: "",
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
      setValue("rating", mealByIdData?.rating || 0);
      setValue("logo", mealByIdData?.logo || "");
      setValue("avatar", mealByIdData?.avatar || "");
      setValue("open", mealByIdData?.open || false);
      setValue("status", mealByIdData?.open ? "true" : "false");
      setValue("rating", mealByIdData?.rating || 0);
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
    const openValue = data.status === "true";
    if (isEdit) {
      updateMeal({
        id: isEdit,
        name: data.name,
        rating: data.rating,
        logo: data.logo,
        avatar: data.avatar,
        open: openValue,
        status: data.status,
        createdAt: new Date().toISOString(),
      } as unknown as Meal);
    } else {
      createMeal({
        name: data.name,
        rating: data.rating,
        logo: data.logo,
        avatar: data.avatar,
        open: openValue,
        status: data.status,
        createdAt: new Date().toISOString(),
      } as unknown as Meal);
    }
  };

  if (isLoadingMealById && isEdit) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 px-10">
        <Input
          label={isEdit ? "Food Name" : undefined}
          fieldName="food-name"
          inputType="text"
          placeholder="Enter Food Name"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label={isEdit ? "Food Rating" : undefined}
          fieldName="food-rating"
          inputType="number"
          placeholder="Enter Food Rating (1-5)"
          step="0.1"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("rating", { valueAsNumber: true })}
          error={errors.rating?.message}
        />
        <Input
          label={isEdit ? "Restaurant Logo" : undefined}
          fieldName="restaurant-logo"
          inputType="text"
          placeholder="Enter Restaurant Logo (link)"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("logo")}
          error={errors.logo?.message}
        />
        <Input
          label={isEdit ? "Restaurant Avatar" : undefined}
          fieldName="restaurant-avatar"
          inputType="text"
          placeholder="Enter Restaurant Avatar (link)"
          className="bg-food-white-2 text-food-dark-gray-1"
          {...register("avatar")}
          error={errors.avatar?.message}
        />
        <DropdownField
          label={isEdit ? "Restaurant Status(Open Now/Closed)" : undefined}
          value={watch("status")}
          onChange={(value) =>
            setValue(
              "status",
              value as unknown as "true" | "false",
              {
                shouldValidate: true,
              } as unknown as Partial<{
                shouldValidate: boolean;
                shouldDirty: boolean;
                shouldTouch: boolean;
              }>
            )
          }
          options={[
            { value: "", label: "Choose Restaurant status" },
            { value: "true", label: "Open Now" },
            { value: "false" as unknown as "true" | "false", label: "Closed" },
          ]}
          error={errors.status?.message}
        />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            className="bg-food-yellow-1 text-white px-4 py-3 rounded-md font-bold cursor-pointer"
            type="submit"
            isLoading={isLoadingCreateMeal || isLoadingUpdateMeal}
            disabled={isLoadingCreateMeal || isLoadingUpdateMeal}
            loadingText={isEdit ? "Updating Food..." : "Adding Food..."}
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
