import { Meal } from "@/src/types/meal";
import Image from "next/image";
import React from "react";

const FoodCard: React.FC<{ meal: Meal }> = ({ meal }) => {
  const {
    id,
    name,
    restaurantName,
    avatar,
    logo,
    image,
    rating,
    open,
    status,
    Price,
    createdAt,
  } = meal;
  return (
    <div className="bg-food-white rounded-lg p-4">
      <div className="w-full h-[220px] relative overflow-hidden rounded-3xl">
        <Image src={`${image}`} alt={name} width={400} height={400} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{restaurantName}</p>
        <p className="text-sm text-gray-500">{rating}</p>
        <p className="text-sm text-gray-500">{open ? "Open" : "Closed"}</p>
        <p className="text-sm text-gray-500">{status}</p>
        <p className="text-sm text-gray-500">{Price}</p>
        <p className="text-sm text-gray-500">{createdAt}</p>
      </div>
    </div>
  );
};

export default FoodCard;
