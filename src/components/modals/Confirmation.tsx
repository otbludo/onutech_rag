import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

interface ConfirmationProps {
  closeConfirm: () => void;
  title?: string;
  description?: string;
  isPendingDelete: boolean;
  onConfirm?: () => void;
}

/**
 * UI component responsible for rendering the confirmation section.
 */
export function Confirmation({
  closeConfirm,
  title,
  description,
  isPendingDelete,
  onConfirm,
}: ConfirmationProps) {

  /**
   * Handles confirm behavior.
   */
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <main
      onClick={isPendingDelete ? undefined : closeConfirm}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[100]"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="max-w-sm w-full p-4"
      >
        <h2 className="text-xl text-center font-bold text-gray-900 mb-2">
          {title || "Confirmer l'action"}
        </h2>
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-8">
          {description || "Voulez-vous vraiment effectuer cette opération ?"}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={closeConfirm}
            disabled={isPendingDelete}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            className="flex-1 "
            onClick={handleConfirm}
            disabled={isPendingDelete}
          >
            {isPendingDelete ? (
              <Loader2 className={`w-6 h-6 animate-spin text-[#E8524D]`} />
            ) : (
              "Confirmer"
            )}
          </Button>
        </div>
      </Card>
    </main>
  );
}
