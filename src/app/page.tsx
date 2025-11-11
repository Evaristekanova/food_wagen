"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/src/components/ui/Modal/Modal";
import { useModal } from "../hooks/useModal";
import MealForm from "@/src/components/forms/MealForm";
import Navbar from "@/src/components/ui/Navbar";
import FoodSearch from "@/src/components/FoodSearch";
import { useDeleteMealById, useMeal } from "@/src/hooks/useMeal/useMeal";
import ConfirmDialogModal from "@/src/components/ui/Modal/ConfirmDialogModal";
import FoodList from "@/src/components/FoodList";
import Footer from "@/src/components/ui/Footer";

const HomePage: React.FC = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { isOpen, openModal, closeModal, setIsEdit, isEdit } = useModal();
  const { mealsData: meals, isLoadingMeals } = useMeal();
  const { deleteMealById, isLoadingDeleteMealById, isSuccessDeleteMealById } =
    useDeleteMealById();
  const onEdit = (id: string) => {
    setIsEdit(id);
    openModal();
  };

  const onAddMeal = () => {
    setIsEdit(undefined);
    openModal();
  };

  const onDelete = (id: string) => {
    setIsConfirmDialogOpen(true);
    setIsEdit(id);
  };

  useEffect(() => {
    if (isSuccessDeleteMealById) {
      setTimeout(() => {
        setIsEdit(undefined);
        setIsConfirmDialogOpen(false);
      }, 0);
    }
  }, [isSuccessDeleteMealById, setIsEdit, setIsConfirmDialogOpen]);

  return (
    <div className=" min-h-screen flex-col gap-4">
      <Navbar onAddMeal={onAddMeal} />
      <FoodSearch />

      <FoodList
        meals={meals || []}
        onEdit={onEdit}
        onDelete={onDelete}
        isLoading={isLoadingMeals}
      />

      <Footer />

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
