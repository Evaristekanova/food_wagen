"use client";
import React from "react";
import { Modal } from "./components/ui/Modal/Modal";
import { useModal } from "../hooks/useModal";
import MealForm from "./components/forms/MealForm";
import Navbar from "./components/ui/Navbar";
import FoodSearch from "./components/FoodSearch";
import FoodCard from "./components/FoodCard";
import { Meal } from "@/src/types/meal";

const meals: Meal[] = [
  {
    createdAt: "2025-11-10T07:41:18.563Z",
    name: "Classic Cheddar Smash Burger",
    avatar: "https://picsum.photos/seed/kGv7JERt/203/3569?blur=4",
    rating: 4.4,
    open: true,
    logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=120&q=60",
    Price: "12.75",
    id: "3",
    image:
      "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=800&q=80",
    restaurantName: "Burger Barn",
    status: "Open",
  },
  {
    createdAt: "2025-11-10T10:44:47.316Z",
    name: "Caprese Mozzarella Panini",
    avatar: "https://picsum.photos/seed/E9mCkvMzP/1379/3566?blur=1",
    rating: 4.3,
    open: true,
    logo: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=120&q=60",
    Price: "11.20",
    id: "6",
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
    restaurantName: "Pressed & Toasted",
    status: "Open",
  },
  {
    createdAt: "2025-11-10T13:45:40.092Z",
    name: "Smoked Brisket BBQ Plate",
    avatar: "https://picsum.photos/seed/NFL2EMy33/2453/3319?grayscale&blur=7",
    rating: 4.5,
    open: false,
    logo: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=120&q=60",
    Price: "22.00",
    id: "8",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    restaurantName: "Smokey Hills BBQ",
    status: "Closed",
  },
  {
    createdAt: "2025-11-10T09:46:17.580Z",
    name: "Rainbow Buddha Grain Bowl",
    avatar: "https://picsum.photos/seed/q0L87Kap/1041/3104?blur=4",
    rating: 4.2,
    open: true,
    logo: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=120&q=60",
    Price: "15.30",
    id: "9",
    restaurantName: "Roots & Grains",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    status: "Open",
  },
];

const HomePage: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div className=" min-h-screen flex-col gap-4">
      <Navbar openModal={openModal} />
      <FoodSearch />
      <section className="py-14 px-20">
        <h1 className="text-4xl font-bold text-food-dark-gray-1 text-center">
          Featured Meals
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {meals.map((meal) => (
            <FoodCard key={meal.id} meal={meal} />
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
        <MealForm closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default HomePage;
