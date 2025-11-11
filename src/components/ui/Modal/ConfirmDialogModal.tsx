import { AnimatePresence } from "framer-motion";
import React from "react";
import { Button } from "../Button";
import { Modal } from "../Modal/Modal";

interface ConfirmDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

const ConfirmDialogModal: React.FC<ConfirmDialogModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        className="max-w-[700px] pt-7! pb-4!"
        preventClose={isLoading}
      >
        <div className="py-3">
          <p className=" text-food-dark-gray-1 text-center">{message}</p>
        </div>
        <div className="px-4 flex justify-center rounded-2 gap-6 items-center w-full mt-4">
          <Button
            className="bg-food-yellow-1 text-white px-4 py-3 rounded-md font-bold cursor-pointer  w-[170px]"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmButtonText}
          </Button>
          <Button
            className="border-2 border-food-yellow-1 text-black px-4 py-3 rounded-md font-bold cursor-pointer w-[170px]"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
        </div>
      </Modal>
    </AnimatePresence>
  );
};

export default ConfirmDialogModal;
