import React from "react";
import { motion } from "framer-motion";

type Tag = {
  text: string;
  size: string;
  color: string;
  top: string;
  left: string;
};

type Dictionary = {
  main: { text: string; color: string; size: string };
  others: Tag[];
};

const DICTIONARIES: Record<string, Dictionary> = {
  realisations: {
    main: {
      text: "RÉALISATIONS",
      color: "text-gray-800",
      size: "text-7xl md:text-9xl",
    },
    others: [
      {
        text: "PROJETS",
        size: "text-4xl",
        color: "text-gray-900",
        top: "25%",
        left: "45%",
      },
      {
        text: "GESTION",
        size: "text-5xl",
        color: "text-gray-800",
        top: "70%",
        left: "55%",
      },
      {
        text: "MANAGEMENT",
        size: "text-3xl",
        color: "text-green-500",
        top: "30%",
        left: "55%",
      },
      {
        text: "PROGRAMME",
        size: "text-4xl",
        color: "text-gray-600",
        top: "35%",
        left: "65%",
      },
      {
        text: "BILAN",
        size: "text-3xl",
        color: "text-gray-900",
        top: "65%",
        left: "5%",
      },
      {
        text: "RESSOURCES",
        size: "text-2xl",
        color: "text-green-500",
        top: "75%",
        left: "15%",
      },
      {
        text: "ÉTHIQUE",
        size: "text-3xl",
        color: "text-gray-800",
        top: "70%",
        left: "15%",
      },
      {
        text: "RESPECT",
        size: "text-2xl",
        color: "text-green-600",
        top: "78%",
        left: "30%",
      },
      {
        text: "OBJECTIF",
        size: "text-2xl",
        color: "text-gray-900",
        top: "68%",
        left: "75%",
      },
      {
        text: "FAIRE",
        size: "text-2xl",
        color: "text-gray-900",
        top: "68%",
        left: "85%",
      },
      {
        text: "COÛTS",
        size: "text-2xl",
        color: "text-gray-900",
        top: "38%",
        left: "8%",
      },
      {
        text: "RISQUES",
        size: "text-2xl",
        color: "text-green-400",
        top: "33%",
        left: "18%",
      },
      {
        text: "STRATÉGIQUE",
        size: "text-sm",
        color: "text-gray-600",
        top: "72%",
        left: "38%",
      },
      {
        text: "COMPLEXE",
        size: "text-sm",
        color: "text-gray-600",
        top: "72%",
        left: "80%",
      },
    ],
  },
  localisations: {
    main: {
      text: "LOCALISATION",
      color: "text-gray-800",
      size: "text-7xl md:text-9xl",
    },
    others: [
      {
        text: "FRANCE",
        size: "text-4xl",
        color: "text-green-600",
        top: "25%",
        left: "45%",
      },
      {
        text: "PARIS",
        size: "text-5xl",
        color: "text-gray-800",
        top: "70%",
        left: "55%",
      },
      {
        text: "EUROPE",
        size: "text-3xl",
        color: "text-green-400",
        top: "30%",
        left: "55%",
      },
      {
        text: "LYON",
        size: "text-4xl",
        color: "text-gray-600",
        top: "35%",
        left: "65%",
      },
      {
        text: "MONDE",
        size: "text-3xl",
        color: "text-gray-900",
        top: "65%",
        left: "10%",
      },
      {
        text: "PROXIMITÉ",
        size: "text-2xl",
        color: "text-green-500",
        top: "75%",
        left: "20%",
      },
      {
        text: "ADRESSE",
        size: "text-3xl",
        color: "text-gray-800",
        top: "70%",
        left: "15%",
      },
      {
        text: "SIÈGE",
        size: "text-2xl",
        color: "text-green-600",
        top: "78%",
        left: "35%",
      },
      {
        text: "BORDEAUX",
        size: "text-2xl",
        color: "text-gray-900",
        top: "68%",
        left: "75%",
      },
      {
        text: "NANTES",
        size: "text-2xl",
        color: "text-gray-900",
        top: "68%",
        left: "85%",
      },
      {
        text: "MARSEILLE",
        size: "text-2xl",
        color: "text-gray-900",
        top: "38%",
        left: "8%",
      },
      {
        text: "INTERNATIONAL",
        size: "text-2xl",
        color: "text-green-400",
        top: "33%",
        left: "18%",
      },
    ],
  },
};

interface IntroAnimationProps {
  variant?: "realisations" | "localisations";
}

export function IntroAnimation({
  variant = "realisations",
}: IntroAnimationProps) {
  const data = DICTIONARIES[variant] || DICTIONARIES.realisations;

  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center scale-[0.35] sm:scale-[0.6] md:scale-100">
        <div className="relative w-[1000px] h-[600px] flex-shrink-0">
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black uppercase tracking-tighter ${data.main.color} ${data.main.size} z-20 drop-shadow-sm whitespace-nowrap`}
          >
            {data.main.text}
          </motion.h1>
          {data.others.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`absolute uppercase font-bold whitespace-nowrap ${tag.size} ${tag.color}`}
              style={{
                top: tag.top,
                left: tag.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              {tag.text}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
