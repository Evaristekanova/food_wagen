import React from "react";
import FoodCard from "./ui/FoodCard";
import { Meal } from "@/src/types/meal";
import Loader from "./ui/Loader";
import { SearchX } from "lucide-react";

interface FoodListProps {
  meals: Meal[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchQuery?: string;
}

const FoodList: React.FC<FoodListProps> = ({
  meals,
  onEdit,
  onDelete,
  isLoading,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <section className="py-14 px-20">
        <Loader />
      </section>
    );
  }

  const hasSearchQuery = searchQuery?.trim();
  const hasNoResults = hasSearchQuery && meals.length === 0;

  return (
    <section className="py-14 px-20">
      <h1 className="text-4xl font-bold text-food-dark-gray-1 text-center">
        Featured Meals
      </h1>
      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <SearchX className="w-16 h-16 text-food-dark-gray-3" />
          <h2 className="text-2xl font-bold text-food-dark-gray-1">
            No meals found
          </h2>
          <p className="text-food-dark-gray-3 text-center max-w-md">
            We couldn&apos;t find any meals matching &quot;{searchQuery?.trim()}
            &quot;. Try searching with a different term.
          </p>
        </div>
      ) : (
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
      )}
    </section>
  );
};

export default FoodList;
