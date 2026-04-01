import React, { useState } from "react";
import { X } from "lucide-react";
import { OpenFreeMapLeaflet } from "../../api/Maps";
import { Button } from "../../ui/Button";

interface Props {
  isVisible: Number;
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
}

export function FreeMap3D({ isVisible, setIsVisible }: Props) {
  if (isVisible !== 1) return null;

  return (
    <div
      onClick={() => setIsVisible(0)}
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-11/12 md:w-3/4 h-[96vh] md:h-[600px] bg-white shadow-2xl p-2 rounded-3xl overflow-hidden cursor-default"
      >
        <Button
          onClick={() => setIsVisible(0)}
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-[1001] bg-white/80 rounded-full shadow-md hover:bg-white"
          aria-label="Fermer"
        >
          <X size={20} strokeWidth={2.5} />
        </Button>
        <OpenFreeMapLeaflet />
      </div>
    </div>
  );
}
