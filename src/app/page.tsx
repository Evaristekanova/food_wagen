"use client";
import React, { useState } from "react";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { useModal } from "../hooks/useModal";
import MealForm from "@/src/components/forms/MealForm";
import Navbar from "@/src/components/ui/Navbar";
import FoodSearch from "@/src/components/FoodSearch";
import FoodCard from "@/src/components/FoodCard";
import { Meal } from "@/src/types/meal";
import { useDeleteMealById, useMeal } from "@/src/hooks/useMeal/useMeal";
import Loader from "../components/ui/Loader";
import ConfirmDialogModal from "../components/ui/Modal/ConfirmDialogModal";

const HomePage: React.FC = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { isOpen, openModal, closeModal, setIsEdit, isEdit } = useModal();
  const { mealsData: meals, isLoadingMeals, errorMeals } = useMeal();
  const {
    deleteMealById,
    isLoadingDeleteMealById,
    errorDeleteMealById,
    isSuccessDeleteMealById,
  } = useDeleteMealById();
  const onEdit = (id: string) => {
    setIsEdit(id);
    openModal();
  };

  const onDelete = (id: string) => {
    deleteMealById(id);
    if (isSuccessDeleteMealById) {
      setIsConfirmDialogOpen(false);
    }
  };

  if (isLoadingMeals) {
    return <Loader />;
  }

  return (
    <div className=" min-h-screen flex-col gap-4">
      <Navbar openModal={openModal} />
      <FoodSearch />
      <section className="py-14 px-20">
        <h1 className="text-4xl font-bold text-food-dark-gray-1 text-center">
          Featured Meals
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add a meal"
        className="max-w-[800px] "
        modalBlurClassName="bg-food-dark-gray-1/50"
      >
        <MealForm
          onClose={() => closeModal(["mealById"])}
          isEdit={isEdit || null}
        />
      </Modal>
      <ConfirmDialogModal
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => deleteMealById(isEdit || "")}
        title="Delete meal"
        message="Are you sure you want to delete this meal?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        isLoading={isLoadingDeleteMealById}
      />
    </div>
  );
};

export default HomePage;
