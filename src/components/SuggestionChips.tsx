import React from "react";
import { Button } from "../ui/Button";

interface ChipProps {
  icon?: string;
  text: string;
}

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
  onSelectSuggestion: (text: string) => void;
}

function Chip({ icon, text, onClick }: ChipProps & { onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="pill"
      className="z-2 gap-2 px-4 py-3 shadow-sm text-[12px] md:text-sm whitespace-nowrap"
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </Button>
  );
}

export function SuggestionChips({ setIsVisible, onSelectSuggestion }: Props) {
  const chips = [
    {
      icon: "🏢",
      text: "À propos",
      onClick: () => onSelectSuggestion("A propos de ONUtech"),
    },
    {
      icon: "💼",
      text: "Projets realises",
      onClick: () => setIsVisible(2),
    },
    {
      icon: "🚀",
      text: "Secteurs d'activités",
      onClick: () => onSelectSuggestion("Quels sont les secteurs d'activités"),
    },
    {
      icon: "✅",
      text: "Éligibilité de ONUtech",
      onClick: () => onSelectSuggestion("Eligibilite de ONUtech"),
    },
    {
      icon: "📍",
      text: "Localisation",
      onClick: () => setIsVisible(1),
    },
  ];

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex w-full md:w-3/4 flex-wrap justify-center gap-3 px-2">
        {chips.map((chip, index) => (
          <Chip
            key={index}
            icon={chip.icon}
            text={chip.text}
            onClick={chip.onClick}
          />
        ))}
      </div>
    </div>
  );
}
