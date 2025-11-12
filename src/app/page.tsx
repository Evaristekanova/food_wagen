"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useModal } from "../hooks/useModal";
import Navbar from "@/src/components/ui/Navbar";
import { useDeleteMealById, useMeal } from "@/src/hooks/useMeal/useMeal";
import FoodList from "@/src/components/FoodList/FoodList";
import Footer from "@/src/components/ui/Footer";
import Header from "@/src/components/Header";
import { useQueryClient } from "@tanstack/react-query";

const Modal = dynamic(
  () =>
    import("@/src/components/ui/Modal/Modal").then((mod) => ({
      default: mod.Modal,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);
const MealForm = dynamic(() => import("@/src/components/forms/MealForm"), {
  ssr: false,
});
const ConfirmDialogModal = dynamic(
  () => import("@/src/components/ui/Modal/ConfirmDialogModal"),
  {
    ssr: false,
  }
);

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isOpen, openModal, closeModal, setIsEdit, isEdit } = useModal();
  const { mealsData: meals, isLoadingMeals } = useMeal(searchQuery);
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
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      setTimeout(() => {
        setIsEdit(undefined);
        setIsConfirmDialogOpen(false);
      }, 0);
    }
  }, [isSuccessDeleteMealById, setIsEdit, queryClient]);

  return (
    <div className=" min-h-screen flex-col gap-4">
      <Navbar onAddMeal={onAddMeal} />
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <FoodList
        meals={meals || []}
        onEdit={onEdit}
        onDelete={onDelete}
        isLoading={isLoadingMeals}
        searchQuery={searchQuery}
      />

      <Footer />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={isEdit ? "Edit a meal" : "Add meal"}
        className="max-w-[800px] sm:py-10! sm:pb-7!"
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
        confirmButtonText={isLoadingDeleteMealById ? "Deleting..." : "Delete"}
        cancelButtonText="Cancel"
        isLoading={isLoadingDeleteMealById}
      />
    </div>
  );
};

export default HomePage;
