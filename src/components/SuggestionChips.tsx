import { Button } from "../ui/Button";
import { Icons } from "../ui/Icon";

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
  onSelectSuggestion: (text: string) => void;
}

function Chip({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="pill"
      className="z-2 gap-2 px-4 py-3 shadow-sm text-[12px] md:text-sm whitespace-nowrap flex items-center"
    >
      {icon}
      <span>{text}</span>
    </Button>
  );
}

export function SuggestionChips({ setIsVisible, onSelectSuggestion }: Props) {
  const chips = [
    {
      icon: Icons.Home,
      text: "À propos",
      action: () => onSelectSuggestion("A propos de ONUtech"),
    },
    {
      icon: Icons.Project,
      text: "Projets réalisés",
      action: () => setIsVisible(2),
    },
    {
      icon: Icons.Sectors,
      text: "Secteurs d'activités",
      action: () => onSelectSuggestion("Quels sont les secteurs d'activités"),
    },
    {
      icon: Icons.Eligibility,
      text: "Éligibilité de ONUtech",
      action: () => onSelectSuggestion("Eligibilite de ONUtech"),
    },
    {
      icon: Icons.Pin,
      text: "Localisation",
      action: () => setIsVisible(1),
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
            onClick={chip.action}
          />
        ))}
      </div>
    </div>
  );
}
