"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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

const ITEMS_PER_PAGE = 8;

const FoodList: React.FC<FoodListProps> = ({
  meals,
  onEdit,
  onDelete,
  isLoading,
  searchQuery,
}) => {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const prevMealsLengthRef = useRef(meals.length);
  const prevSearchQueryRef = useRef(searchQuery);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mealsLengthChanged = prevMealsLengthRef.current !== meals.length;
    const searchQueryChanged = prevSearchQueryRef.current !== searchQuery;

    if (mealsLengthChanged || searchQueryChanged) {
      const timeoutId = setTimeout(() => {
        setVisibleCount(ITEMS_PER_PAGE);
        prevMealsLengthRef.current = meals.length;
        prevSearchQueryRef.current = searchQuery;
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [meals.length, searchQuery]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => {
      const newCount = prev + ITEMS_PER_PAGE;
      return Math.min(newCount, meals.length);
    });
  }, [meals.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && meals.length > visibleCount) {
          handleLoadMore();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before the element is visible
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && meals.length > visibleCount) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, meals.length, handleLoadMore]);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-10 md:py-14 px-4 sm:px-8 md:px-12 lg:px-20">
        <Loader />
      </section>
    );
  }

  const hasSearchQuery = searchQuery?.trim();
  const hasNoResults = hasSearchQuery && meals.length === 0;
  const isEmpty = !hasSearchQuery && meals.length === 0;
  const visibleMeals = meals?.slice(0, visibleCount) || [];
  const hasMoreItems = meals.length > visibleCount;

  return (
    <section className="py-8 sm:py-10 md:py-14 px-4 sm:px-8 md:px-12 lg:px-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-food-dark-gray-1 text-center mb-6 sm:mb-8 md:mb-10">
        Featured Meals
      </h1>
      {hasNoResults ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 gap-3 sm:gap-4 px-4">
          <SearchX className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-food-dark-gray-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-food-dark-gray-1 text-center">
            No meals found
          </h2>
          <p className="text-sm sm:text-base text-food-dark-gray-3 text-center max-w-md px-4">
            We couldn&apos;t find any meals matching &quot;{searchQuery?.trim()}
            &quot;. Try searching with a different term.
          </p>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 gap-3 sm:gap-4 px-4">
          <SearchX className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-food-dark-gray-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-food-dark-gray-1 text-center">
            No meals available
          </h2>
          <p className="text-sm sm:text-base text-food-dark-gray-3 text-center max-w-md px-4">
            There are no meals in the database yet. Add your first meal to get
            started!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {visibleMeals.map((meal: Meal) => (
              <FoodCard
                key={meal.id}
                meal={meal}
                onEdit={() => onEdit(meal.id)}
                onDelete={() => onDelete(meal.id)}
              />
            ))}
          </div>
          {hasMoreItems && (
            <div
              ref={observerTarget}
              className="flex justify-center mt-8 sm:mt-10 py-4"
            >
              <Loader />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default FoodList;
