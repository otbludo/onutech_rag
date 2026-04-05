import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { OpenFreeMapLeaflet } from "../../api/Maps";
import { Button } from "../../ui/Button";
import { IntroAnimation } from "../animations/IntroAnimation";

interface Props {
  isVisible: number;
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100/80 backdrop-blur-md cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full md:w-[98vw] md:h-[95vh] bg-[#F9F9F9] text-gray-900 flex flex-col md:rounded-lg overflow-hidden border border-gray-200 shadow-2xl cursor-default"
      >
        <AnimatePresence>
          {animationState === 1 && (
            <IntroAnimation variant="localisations" key="intro-loc" />
          )}
        </AnimatePresence>

        <div
          className={`flex flex-col flex-1 transition-opacity duration-700 ${
            animationState === 1 ? "opacity-0" : "opacity-100"
          }`}
        >
          <header className="px-6 py-8 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2 text-gray-900">
                  LOCA <span className="text-gray-300">LISATION</span>
                </h2>
                <div className="h-1 w-20 bg-green-600 mb-4" />
                <p className="text-gray-400 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                  Global Positioning & Presence
                </p>
              </div>

              <Button
                variant="secondary"
                size="none"
                onClick={() => setIsVisible(0)}
                className="rounded-full p-2 px-2 hover:bg-gray-100 transition-colors"
              >
                <X size={32} strokeWidth={1.2} />
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">
                Interactive Map
              </span>
              <div className="h-[1px] flex-1 bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-mono italic">
                EST. {new Date().getFullYear()}
              </span>
            </div>
          </header>
          <main className="flex-1 relative bg-[#F2F2F2]">
            <div className="absolute inset-0">
              <OpenFreeMapLeaflet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
