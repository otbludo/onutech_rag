import React from "react";
import { Card } from "../ui/Card";

export type ChatHistoryEntry = {
  question: string;
  answer: string;
};

type ResponseProps = {
  question: string;
  answer?: string;
  history?: ChatHistoryEntry[];
  isPending: Boolean;
  isError: Boolean;
  error: any;
};

const ConversationBlock = ({
  label,
  question,
  content,
}: {
  label: string;
  question: string;
  content: React.ReactNode;
}) => (
  <div className="py-6 first:pt-0">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </p>
    <p className="mt-3 text-gray-900 text-lg sm:text-xl font-medium leading-relaxed">
      {question}
    </p>
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 shadow-sm">
          <img src="./onutech.png" alt="" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-sm font-bold text-gray-800">Réponse</span>
      </div>
      <div className="text-gray-700 text-base sm:text-lg leading-relaxed pl-11">
        {content}
      </div>
    </div>
  </div>
);

export function Response({
  question,
  answer,
  history = [],
  isPending,
  isError,
  error,
}: ResponseProps) {
  const lastPersistedQuestion = history[history.length - 1]?.question;
  const shouldRenderCurrentQuestion =
    Boolean(question) && question !== lastPersistedQuestion;
  const shouldDisplayEmptyState =
    history.length === 0 && !shouldRenderCurrentQuestion;

  const renderAnswerContent = (
    entryAnswer?: string,
    options?: {
      pending?: boolean;
      hasHistory?: boolean;
      isError?: Boolean;
      error?: any;
    },
  ) => {
    if (entryAnswer) {
      return <p className="whitespace-pre-wrap">{entryAnswer}</p>;
    }
    if (options?.pending) {
      return (
        <p className="text-gray-400 italic">Chargement de la réponse...</p>
      );
    }
    if (options?.isError) {
      return (
        <p className="text-red-500 text-sm sm:text-base">
          Une erreur est survenue lors de la requête
          {options.error instanceof Error ? ` : ${options.error.message}` : "."}
        </p>
      );
    }
    return (
      <p className="text-gray-400 italic">
        {options?.hasHistory
          ? "Sélectionnez ou posez une nouvelle question pour afficher la réponse."
          : "Posez une question pour commencer la conversation."}
      </p>
    );
  };

  return (
    <Card
      variant="glass"
      className="w-full max-w-[900px] mx-auto flex flex-col gap-6 p-6 pb-1 sm:p-8 sm:pb-3"
    >
      {shouldDisplayEmptyState ? (
        <div className="text-gray-400 italic text-center">
          Posez une question pour commencer la conversation.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {history.map((entry, index) => (
            <ConversationBlock
              key={`${entry.question}-${index}`}
              label={`Question #${index + 1}`}
              question={entry.question}
              content={renderAnswerContent(entry.answer)}
            />
          ))}
          {shouldRenderCurrentQuestion && (
            <ConversationBlock
              label={isPending ? "Question en cours" : "Dernière question"}
              question={question}
              content={renderAnswerContent(answer, {
                pending: Boolean(isPending),
                hasHistory: history.length > 0,
                isError,
                error,
              })}
            />
          )}
        </div>
      )}
    </Card>
  );
}
