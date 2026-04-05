import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OpenFreeMapLeaflet } from "../../api/Maps";
import { Button } from "../../ui/Button";
import { IntroAnimation } from "../animations/IntroAnimation";

interface Props {
  isVisible: Number;
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
}

export function FreeMap3D({ isVisible, setIsVisible }: Props) {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    if (isVisible === 1) {
      setAnimationState(1);
      const timer = setTimeout(() => setAnimationState(2), 3500);
      return () => clearTimeout(timer);
    } else {
      setAnimationState(0);
    }
  }, [isVisible]);

  if (isVisible !== 1) return null;

  return (
    <div
      onClick={() => setIsVisible(0)}
      className="fixed inset-0 z-[100] flex justify-center items-center bg-black/40 backdrop-blur-sm cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-11/12 md:w-3/4 h-[96vh] md:h-[600px] bg-white shadow-2xl p-2 rounded-3xl overflow-hidden cursor-default"
      >
        <AnimatePresence>
          {animationState === 1 && (
            <IntroAnimation variant="localisations" key="intro-loc" />
          )}
        </AnimatePresence>
        <div
          className={`h-full w-full transition-opacity duration-700 ${
            animationState === 1 ? "opacity-0" : "opacity-100"
          }`}
        >
          <Button
            onClick={() => setIsVisible(0)}
            variant="secondary"
            size="icon"
            className="absolute top-4 left-4 z-[1001] bg-white shadow-md rounded-full"
          >
            <X size={20} />
          </Button>
          <OpenFreeMapLeaflet />
        </div>
      </div>
    </div>
  );
}
