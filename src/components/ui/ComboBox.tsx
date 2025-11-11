"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";

type OptionType = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  label: string;
  options: OptionType[];
  name: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const DropdownField = ({
  label,
  options,
  name,
  error,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
}: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleSelect = (option: OptionType) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full space-y-1" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 rounded-md text-left bg-food-white-2 truncate 
            focus:outline-none focus:border-food-dark-white-2 ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${error ? "border border-food-red-1" : ""}`}
        >
          <div className="flex items-center justify-between">
            <span className="block truncate text-food-dark-gray-3">
              {selectedOption ? selectedOption.label : `Select ${label}`}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-2 w-full max-h-72 overflow-auto bg-white 
          rounded-md shadow-lg border-food-dark-white-2 border-2 border-food-dark-gray-3"
          >
            <div>
              {filteredOptions.length > 0 &&
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-full font-centuryGothic text-left px-4 py-2 bg-food-white hover:bg-food-white-2 text-sm transition-colors ${
                      option.value === value &&
                      "bg-food-white-2 text-lg text-food-dark-gray-1 font-bold"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          className={`h-[10px] mt-2 text-sm text-food-red-1 font-source-sans-pro transition-all duration-500 ease-in-out`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default DropdownField;
