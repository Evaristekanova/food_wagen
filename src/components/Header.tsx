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
      <div className="bg-food-yellow-1 flex items-center justify-center max-h-[380px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-28 p-6 sm:p-12 md:p-20 relative z-10 overflow-hidden w-full">
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col gap-1 pt-0 sm:pt-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white">
                Are you starving?
              </h1>
              <p className="text-white text-xs sm:text-sm md:text-base mb-2">
                Within a few clicks, find meals that are accessible near you
              </p>
            </div>
            <div className="space-y-4 bg-food-white rounded-lg p-4 sm:p-6 w-full mt-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  className="flex items-center justify-center gap-2 bg-food-orange-2/30 text-food-orange-2 px-3 sm:px-4 py-2
                rounded-md font-bold cursor-text transition-all duration-150 ease-out text-xs sm:text-sm"
                >
                  <Motorbike className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Delivery</span>
                </Button>
                <Button
                  className="flex items-center justify-center gap-2 text-food-dark-gray-3 px-3 sm:px-4 py-2 
                rounded-md font-extrabold cursor-text transition-all duration-150 ease-out text-xs sm:text-sm"
                >
                  <Image
                    src="/basket.svg"
                    alt="Basket"
                    width={16}
                    height={18}
                    loading="lazy"
                  />
                  <span>Pickup</span>
                </Button>
              </div>
              <FoodSearch
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
            </div>
          </div>
          <div className="hidden md:block col-span-1">
            <Image
              src="/plate.png"
              alt="Plate"
              width={400}
              height={400}
              loading="lazy"
              className="w-auto overflow-hidden mx-auto rounded-lg object-cover -mb-20"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
