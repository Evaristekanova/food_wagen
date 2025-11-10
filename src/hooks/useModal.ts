"use client";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isNewOpen, setIsNewOpen] = useState(initialState);
  const [isEdit, setIsEdit] = useState<string | undefined>(undefined);
  const [showDetails, setShowDetails] = useState(false);
  const [actionStep, setActionStep] = useState<string>("");
  const queryClient = useQueryClient();

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(
    (queryKeysToRemove?: string[]) => {
      setIsOpen(false);
      if (queryKeysToRemove && queryKeysToRemove.length > 0) {
        queryKeysToRemove.forEach((queryKey) => {
          queryClient.removeQueries({ queryKey: [queryKey] });
        });
      }
    },
    [queryClient]
  );
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  const openNewModal = useCallback(() => setIsNewOpen(true), []);
  const closenewModal = useCallback(() => setIsNewOpen(false), []);
  const toggleNewModal = useCallback(() => setIsNewOpen((prev) => !prev), []);

  const handleEditModal = (id: string | undefined) => {
    setIsOpen(true);
    setIsEdit(id);
    setShowDetails(false);
    setActionStep("");
  };

  return {
    isOpen,
    isNewOpen,
    isEdit,
    showDetails,
    actionStep,
    setActionStep,
    setShowDetails,
    setIsEdit,
    handleEditModal,
    openModal,
    openNewModal,
    closenewModal,
    toggleNewModal,
    closeModal,
    toggleModal,
  };
};
