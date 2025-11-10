"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName?: string;
  error?: string;
  icon?: React.ReactNode;
  inputType?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ fieldName, error, icon, className = "", inputType, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            name={fieldName}
            ref={ref}
            type={inputType || "text"}
            className={`w-full py-3.5 bg-food-white-2 font-source-sans-pro outline-none rounded-md 
              focus:outline-none focus:border-food-dark-gray-3 
              ${icon ? "pl-10 pr-4" : "px-4"} 
              placeholder:text-food-dark-gray-3 placeholder:text-lg ${className}`}
            {...props}
          />
        </div>
        <p
          className={`h-[10px] mt-2 text-sm text-food-red-1 font-source-sans-pro transition-all duration-500 ease-in-out`}
        >
          {error}
        </p>
      </div>
    );
  }
);

Input.displayName = "Input";
