import React from "react";
import { Card } from "../ui/Card";

type ResponseProps = {
  question: string;
  answer?: string;
  isPending: Boolean;
  isError: Boolean;
  error: any;
};

export function Response({
  question,
  answer,
  isPending,
  isError,
  error,
}: ResponseProps) {
  return (
    <Card
      variant="glass"
      className="w-full max-w-[900px] mx-auto flex flex-col gap-6 p-6 sm:p-8"
    >
      {/* Bloc Question */}
      <div className="border-b border-gray-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Votre question
        </p>
        <p className="mt-3 text-gray-900 text-lg sm:text-xl font-medium leading-relaxed">
          {question || "Aucune question posée"}
        </p>
      </div>

      {/* Bloc Réponse avec Logo */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Conteneur du Logo */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 shadow-sm">
            <img
              src="./onutech.png"
              alt=""
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-sm font-bold text-gray-800">Réponse</span>
        </div>

        {/* Corps de la réponse */}
        <div className="text-gray-700 text-base sm:text-lg leading-relaxed pl-11">
          {answer ? (
            <p className="whitespace-pre-wrap">{answer}</p>
          ) : isPending ? (
            <p className="text-gray-400 italic">Chargement de la réponse...</p>
          ) : (
            <p className="text-gray-400 italic">
              Une erreur est survenue lors de la requête
              {error instanceof Error ? ` : ${error.message}` : "."}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
