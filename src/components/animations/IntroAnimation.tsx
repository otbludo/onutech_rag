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
      text: "REALISATIONS",
      color: "text-gray-800",
      size: "text-7xl md:text-9xl",
    },
    others: [
      {
        text: "QUELLE EXPÉRIENCE ?",
        size: "text-4xl",
        color: "text-gray-900",
        top: "25%",
        left: "45%",
      },
      {
        text: "QUELS PROJETS ?",
        size: "text-5xl",
        color: "text-gray-800",
        top: "68%",
        left: "55%",
      },
      {
        text: "QUEL IMPACT ?",
        size: "text-3xl",
        color: "text-green-500",
        top: "30%",
        left: "55%",
      },
      {
        text: "QUELLES SOLUTIONS ?",
        size: "text-4xl",
        color: "text-gray-600",
        top: "35%",
        left: "58%",
      },
      {
        text: "QUEL BILAN ?",
        size: "text-3xl",
        color: "text-gray-900",
        top: "65%",
        left: "10%",
      },
      {
        text: "COMMENT GÉRER ?",
        size: "text-2xl",
        color: "text-green-500",
        top: "75%",
        left: "20%",
      },
      {
        text: "QUELLE ÉTHIQUE ?",
        size: "text-3xl",
        color: "text-gray-800",
        top: "70%",
        left: "15%",
      },
      {
        text: "QUEL RÉSULTAT ?",
        size: "text-2xl",
        color: "text-green-600",
        top: "79%",
        left: "35%",
      },
      {
        text: "QUEL OBJECTIF ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "64%",
        left: "72%",
      },
      {
        text: "POURQUOI NOUS ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "60%",
        left: "76%",
      },
      {
        text: "QUELLE VALEUR ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "36%",
        left: "8%",
      },
      {
        text: "QUELS DÉFIS ?",
        size: "text-2xl",
        color: "text-green-400",
        top: "32%",
        left: "18%",
      },
      {
        text: "STRATÉGIE ?",
        size: "text-sm",
        color: "text-gray-600",
        top: "68%",
        left: "38%",
      },
      {
        text: "INNOVATION ?",
        size: "text-sm",
        color: "text-gray-600",
        top: "75%",
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
        text: "OÙ NOUS TROUVER ?",
        size: "text-4xl",
        color: "text-green-600",
        top: "25%",
        left: "45%",
      },
      {
        text: "QUELLE ADRESSE ?",
        size: "text-5xl",
        color: "text-gray-800",
        top: "68%",
        left: "55%",
      },
      {
        text: "QUEL SECTEUR ?",
        size: "text-3xl",
        color: "text-green-400",
        top: "30%",
        left: "55%",
      },
      {
        text: "PROXIMITÉ ?",
        size: "text-4xl",
        color: "text-gray-600",
        top: "35%",
        left: "65%",
      },
      {
        text: "À PARIS ?",
        size: "text-3xl",
        color: "text-gray-900",
        top: "61%",
        left: "10%",
      },
      {
        text: "DANS LE MONDE ?",
        size: "text-2xl",
        color: "text-green-500",
        top: "71%",
        left: "20%",
      },
      {
        text: "QUELLE RÉGION ?",
        size: "text-3xl",
        color: "text-gray-800",
        top: "66%",
        left: "15%",
      },
      {
        text: "NOTRE SIÈGE ?",
        size: "text-2xl",
        color: "text-green-600",
        top: "76%",
        left: "35%",
      },
      {
        text: "QUELLE VILLE ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "75%",
        left: "75%",
      },
      {
        text: "PRÈS DE VOUS ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "64%",
        left: "80%",
      },
      {
        text: "QUEL PAYS ?",
        size: "text-2xl",
        color: "text-gray-900",
        top: "35%",
        left: "8%",
      },
      {
        text: "RAYONNEMENT ?",
        size: "text-2xl",
        color: "text-green-400",
        top: "31%",
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
