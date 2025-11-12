"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  className = "",
  disabled,
  loadingText = "processing...",
  ...props
}) => {
  return (
    <button
      className={`${className} ${
        disabled || isLoading ? "opacity-70  disabled:cursor-not-allowed" : ""
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center text-food-white">
          <Loader2 className="animate-spin ml-1 mr-2 h-5 w-5" />
          <span className=" text-lg">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
