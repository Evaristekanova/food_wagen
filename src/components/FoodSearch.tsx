"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "./ui/Button";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/CustomInput";

interface FoodSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const previousSearchQueryRef = useRef(searchQuery);

  useEffect(() => {
    setTimeout(() => {
      setLocalSearchQuery(searchQuery || "");
    }, 0);
    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    const trimmedLocal = localSearchQuery.trim();
    const trimmedPrevious = previousSearchQueryRef.current.trim();

    if (trimmedPrevious && !trimmedLocal) {
      onSearchChange("");
    }

    previousSearchQueryRef.current = localSearchQuery;
  }, [localSearchQuery, onSearchChange]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-16 items-stretch sm:items-center w-full border-food-dark-gray-3 rounded-lg p-3 sm:p-4"
    >
      <div className="w-full h-[48px] sm:h-[52px]">
        <Input
          fieldName="search"
          inputType="text"
          placeholder="Search for a meal"
          className="h-full bg-food-white-2 text-sm sm:text-base"
          value={localSearchQuery}
          onChange={handleInputChange}
          icon={
            <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-food-dark-gray-3" />
          }
        />
      </div>

      {/* Button */}
      <Button
        type="submit"
        className="bg-food-orange-2 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-bold flex items-center
                  justify-center gap-2 cursor-pointer transition-all duration-150 ease-out h-[48px] sm:h-[52px] shrink-0 w-full sm:w-[160px] text-sm sm:text-base"
      >
        <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Find Meal</span>
        <span className="sm:hidden">Search</span>
      </Button>
    </form>
  );
};

export default FoodSearch;
