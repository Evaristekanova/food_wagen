import React from "react";
import { Button } from "./ui/Button";
import { Motorbike } from "lucide-react";
import FoodSearch from "./FoodSearch";
import Image from "next/image";

const Header = ({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => {
  return (
    <header>
      <div className=" bg-food-yellow-1 flex items-center justify-center max-h-[380px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-28 p-20 relative z-10 overflow-hidden">
          <div className="col-span-2">
            <div className="flex flex-col gap-1 pt-3">
              <h1 className="text-3xl sm:text-6xl font-bold text-white">
                Are you starving?
              </h1>
              <p className="text-white text-sm sm:text-base mb-2">
                Within a few clicks, find meals that are accessible near you
              </p>
            </div>
            <div className=" space-y-4 bg-food-white rounded-lg p-6 w-full">
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center justify-center gap-2 bg-food-orange-2/30 text-food-orange-2 px-4 py-2
                rounded-md font-bold cursor-text transition-all duration-150 ease-out"
                >
                  <Motorbike className="w-5 h-5" />
                  <span>Delivery</span>
                </Button>
                <Button
                  className="flex items-center justify-center gap-2 text-food-dark-gray-3 px-4 py-2 
                rounded-md font-extrabold cursor-text transition-all duration-150 ease-out"
                >
                  <img src="/basket.svg" alt="Basket" width={16} height={18} />
                  <span>Pickup</span>
                </Button>
              </div>
              <FoodSearch
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </div>
          </div>
          <div className="col-span-1">
            <Image
              src="/plate.png"
              alt="Plate"
              width={400}
              height={400}
              className="w-auto overflow-hidden mx-auto  rounded-lg object-cover -mb-20"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
