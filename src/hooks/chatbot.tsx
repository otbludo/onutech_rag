import { useMutation } from "@tanstack/react-query";
import { request } from "../api/client";

type AskQuestionPayload = {
  question: string;
  session_id: string | null;
};

export const useAskQuestion = () => {
  return useMutation({
    mutationKey: ["useAskQuestion"],
    mutationFn: (data: AskQuestionPayload) => request("/api/v1/ask", "POST", data),
  });
};
