import { Meal } from "@/src/types/meal";
import { Tag } from "lucide-react";
import Image from "next/image";
import React from "react";
import { MealMenu } from "./MealMenu";

interface FoodCardProps {
  meal: Meal;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ meal, onEdit, onDelete }) => {
  const {
    name,
    restaurantName,
    logo,
    image,
    rating,
    open,
    status,
    Price: price,
    id,
    avatar,
  } = meal;

  return (
    <div className="bg-food-white rounded-lg p-4 w-full ">
      <div className="w-full h-[195px] relative overflow-hidden rounded-3xl">
        <Image
          src={`${image || avatar}`}
          alt={name}
          width={400}
          height={195}
          className="w-full h-full object-cover"
          loading="lazy"
          unoptimized
        />
        <div className="absolute  left-5 top-5 from-food-dark-gray-1/50 to-transparent bg-food-orange-1 px-4 py-2 rounded-lg flex items-center gap-2">
          <Tag className="w-7 h-7 text-food-white" />
          <p className="text-sm text-food-white font-bold">${price}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <div className="flex  gap-2 justify-between">
          <div className="flex items-center gap-6">
            <Image
              src={`${logo}`}
              alt={name}
              width={48}
              height={48}
              className="rounded-lg object-cover w-12 h-12 shadow-md shrink-0"
              loading="lazy"
              unoptimized
            />
            <div className="flex flex-col gap-1">
              <p className="text-lg text-food-dark-gray-1 font-bold">{name}</p>
              <div className="flex items-center gap-1">
                <Image src="/star.svg" alt="Star" width={20} height={20} />
                <p className="text-xl text-food-yellow-1 font-light">
                  {rating}
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm text-food-dark-gray-1 font-bold text-right cursor-pointer mt-1">
            <MealMenu id={id} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-opacity duration-150 ease-out ${
              open
                ? "bg-food-green/30 opacity-100 text-food-green"
                : "bg-food-orange-1/40 opacity-100 text-food-orange-1"
            }`}
          >
            {open ? "Open Now" : "Closed"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
