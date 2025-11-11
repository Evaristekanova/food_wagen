import React from "react";
import FoodCard from "../FoodCard";
import { Meal } from "@/src/types/meal";
import Loader from "./Loader";
interface FoodListProps {
  meals: Meal[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}
const FoodList = ({ meals, onEdit, onDelete, isLoading }: FoodListProps) => {
  if (isLoading) {
    return (
      <section className="py-14 px-20">
        <Loader />
      </section>
    );
  }
  return (
    <section className="py-14 px-20">
      <h1 className="text-4xl font-bold text-food-dark-gray-1 text-center">
        Featured Meals
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {meals?.map((meal: Meal) => (
          <FoodCard
            key={meal.id}
            meal={meal}
            onEdit={() => onEdit(meal.id)}
            onDelete={() => onDelete(meal.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default FoodList;
