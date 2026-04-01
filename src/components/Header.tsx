import React from "react";
import { Icons } from "../ui/Icon";
import { Button } from "../ui/Button";

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
}

export function Header({ setIsVisible }: Props) {
  return (
    <header className="w-full p-4 flex justify-between items-start absolute md:fixed top-0 left-0 z-10">
      <div className="text-xl font-medium text-gray-700 tracking-tight">
        <div>
          <img src="./onutech.png" alt="" className="w-35 -mt-8" />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          onClick={() => setIsVisible(1)}
          variant="secondary"
          size="none"
          className="shadow-sm hover:shadow-md transition-all text-[12px] md:text-sm p-[8px] px-[8px]  md:h-10 md:px-4"
        >
          {Icons.Pin}
          <span className="hidden md:block">Localisation</span>
        </Button>

        <Button
          onClick={() => setIsVisible(2)}
          variant="secondary"
          size="icon"
          className="shadow-sm hover:shadow-md transition-all text-gray-600"
          aria-label="Applications Google"
        >
          {Icons.Project}
        </Button>
      </div>
    </header>
  );
}
