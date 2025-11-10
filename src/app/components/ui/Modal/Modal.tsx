"use client";
import React, { useRef, useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  modalBlurClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  modalBlurClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      requestAnimationFrame(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-30 flex items-start justify-center p-2 md:p-14 bg-gray-400/50 dark:bg-black/50 backdrop-blur-[5px] overflow-y-auto transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${modalBlurClassName}`}
    >
      <div
        ref={modalRef}
        className={`relative w-full h-fit rounded-2xl sm:p-8 md:py-16  bg-food-white transition-all duration-150 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-center items-center ">
            <h2
              id="hs-stacked-overlays-label"
              className="flex items-center text-center text-[40px] font-bold text-food-yellow-1"
            >
              {title}
            </h2>
          </div>
        )}
        <div className="py-8">{children}</div>
      </div>
    </div>
  );
};
