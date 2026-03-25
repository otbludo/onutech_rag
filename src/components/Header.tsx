import React from "react";
import { GridIcon, MapIcon } from "lucide-react";
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
          className="shadow-sm hover:shadow-md transition-all text-[12px] md:text-sm p-[10px] md:p-3 px-3 md:h-10 md:p-0 md:px-4"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="duoicon-primary-layer"
              d="M6.72 16.64a1 1 0 1 1 .56 1.92c-.5.146-.86.3-1.091.44c.238.143.614.303 1.136.452C8.48 19.782 10.133 20 12 20s3.52-.218 4.675-.548c.523-.149.898-.309 1.136-.452c-.23-.14-.59-.294-1.09-.44a1 1 0 0 1 .559-1.92c.668.195 1.28.445 1.75.766c.435.299.97.82.97 1.594c0 .783-.548 1.308-.99 1.607c-.478.322-1.103.573-1.786.768C15.846 21.77 14 22 12 22s-3.846-.23-5.224-.625c-.683-.195-1.308-.446-1.786-.768c-.442-.3-.99-.824-.99-1.607c0-.774.535-1.295.97-1.594c.47-.321 1.082-.571 1.75-.766M12 7.5c-1.54 0-2.502 1.667-1.732 3c.357.619 1.017 1 1.732 1c1.54 0 2.502-1.667 1.732-3A2 2 0 0 0 12 7.5"
              fill="#3f3e3e"
            />
            <path
              className="duoicon-secondary-layer"
              d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 2.568-1.4 4.656-2.85 6.14a16.4 16.4 0 0 1-1.853 1.615c-.594.446-1.952 1.282-1.952 1.282a1.71 1.71 0 0 1-1.69 0a21 21 0 0 1-1.952-1.282A16.4 16.4 0 0 1 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5A7.5 7.5 0 0 1 12 2"
              fill="#555"
              opacity=".6"
            />
          </svg>
          <span className="hidden md:block">Localisation</span>
        </Button>

        <Button
          onClick={() => setIsVisible(2)}
          variant="secondary"
          size="icon"
          className="shadow-sm hover:shadow-md transition-all text-gray-600"
          aria-label="Applications Google"
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="ipTDatabaseSuccess0">
              <g
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <path
                  d="M44 31c0 5.523-4.477 10-10 10c-1.79 0-3.472-.47-4.926-1.295A10.01 10.01 0 0 1 24 31c0-2.568.968-4.91 2.558-6.68A9.975 9.975 0 0 1 34 21c5.523 0 10 4.477 10 10Z"
                  fill="#555"
                />
                <path d="M34 12v9a9.975 9.975 0 0 0-7.442 3.32A9.963 9.963 0 0 0 24 31a10.01 10.01 0 0 0 5.074 8.705C26.412 40.51 22.878 41 19 41c-8.284 0-15-2.239-15-5V12" />
                <path
                  d="M34 12c0 2.761-6.716 5-15 5c-8.284 0-15-2.239-15-5s6.716-5 15-5c8.284 0 15 2.239 15 5Z"
                  fill="#555"
                />
                <path d="M4 28c0 2.761 6.716 5 15 5c1.807 0 3.54-.106 5.144-.302M4 20c0 2.761 6.716 5 15 5c2.756 0 5.339-.248 7.558-.68M38.5 29L33 34.5l-3-3" />
              </g>
            </mask>
            <path
              d="M0 0h48v48H0z"
              fill="currentColor"
              mask="url(#ipTDatabaseSuccess0)"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
}
