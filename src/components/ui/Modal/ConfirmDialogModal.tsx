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
        className="max-w-[900px] font-centuryGothic"
      >
        <div className="py-3">
          <p className="text-sm md:text-base text-gray-900 font-centuryGothic dark:text-ubuDarkModeMediumGray">
            {message}
          </p>
        </div>
        <div className="px-4 py-3 flex justify-center rounded-b-lg gap-4">
          <Button
            className="border-2 border-food-yellow-1 text-black px-4 py-3 rounded-md font-bold cursor-pointer"
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
          <Button
            className="bg-food-yellow-1 text-white px-4 py-3 rounded-md font-bold cursor-pointer"
            onClick={() => {
              onConfirm();
              if (!isLoading) {
                onClose();
              }
            }}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmButtonText}
          </Button>
        </div>
      </Modal>
    </AnimatePresence>
  );
};

export default ConfirmDialogModal;
