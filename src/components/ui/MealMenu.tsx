import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useOutsideClick } from "@/src/hooks/useClickOutside";

interface MealMenuProps {
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MealMenu = ({ id, onEdit, onDelete }: MealMenuProps) => {
  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded hover:bg-gray-200 hover:cursor-pointer"
      >
        <EllipsisVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {onEdit && (
            <button
              onClick={() => onEdit?.(id)}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete?.(id)}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

MealMenu.displayName = "MealMenu";
