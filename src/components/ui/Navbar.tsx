"use client";
import Link from "next/link";
import { Button } from "./Button";
import Image from "next/image";

interface NavbarProps {
  onAddMeal: () => void;
}
const Navbar = ({ onAddMeal }: NavbarProps) => {
  return (
    <nav className="flex items-center justify-between py-4 px-22 bg-food-white w-full rounded-md ">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="FoodWagen"
          width={100}
          height={37}
          className="w-auto h-auto"
        />
      </Link>
      <Button
        className="bg-food-yellow-1 text-white px-4 py-2 rounded-md font-bold cursor-pointer hover:bg-food-yellow-2 transition-all duration-150 ease-out shadow-xl shadow-food-yellow-1/50"
        onClick={onAddMeal}
      >
        Add Meal
      </Button>
    </nav>
  );
};

export default Navbar;
