import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Header } from "../components/Header";
import { PromptInput } from "../components/PromptInput";
import { SuggestionChips } from "../components/SuggestionChips";
import { Response } from "../components/response";
import { useAskQuestion } from "../hooks/chatbot";
import { FreeMap3D } from "../components/modals/Maps";
import { Galerie } from "../components/modals/Galerie";
import { Banner } from "../components/banner";

type AskQuestionResponse = {
  answer: {
    question: string;
    answer: string;
    sources?: string[];
  };
};

type UserProfile = {
  name: string;
  email: string;
  picture: string;
};

declare var google: any;

const CLIENT = import.meta.env.VITE_CLIENT_GOOGLE_APPS;

const HomeScreen = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [prompt, setPrompt] = React.useState("");
  const [showResponse, setShowResponse] = React.useState(false);
  const [lastQuestion, setLastQuestion] = React.useState("");
  const { mutate, isPending, data, error, isError } = useAskQuestion();
  const [isVisible, setIsVisible] = useState<number>(0);

  const handleSend = (overrideQuestion?: string) => {
    const question = (overrideQuestion ?? prompt).trim();
    if (!question) return;
    setLastQuestion(question);
    setShowResponse(true);
    mutate({ question, session_id: "string" });
  };

  const handleCallbackResponse = (response: any) => {
    const token = response.credential;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    setUser({
      name: payload.given_name || payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  };

  useEffect(() => {
    if ((window as any).google) {
      google.accounts.id.initialize({
        client_id: CLIENT,
        callback: handleCallbackResponse,
      });
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
      google.accounts.id.prompt();
    }
  }, []);

  return (
    <main className="min-h-screen w-full relative flex flex-col font-sans bg-gradient-to-br from-blue-50 via-slate-100 to-pink-50">
      <div className="fixed left-0 right-0">
        <div className="absolute w-[500px] h-[500px] bg-[#2BAA6A] opacity-30 rounded-full blur-3xl top-[-100px] left-[-100px]  light1"></div>
        <div className="absolute w-[500px] h-[500px] bg-yellow-300 opacity-30 rounded-full blur-3xl bottom-[-150px] right-[-150px]  light2"></div>
        <div className="absolute w-[400px] h-[400px] bg-pink-300 opacity-30 rounded-full blur-3xl top-[40%] left-[60%] mix-blend-screen light3"></div>
      </div>
      <Banner />
      <Header setIsVisible={setIsVisible} />
      <FreeMap3D isVisible={isVisible} setIsVisible={setIsVisible} />
      <Galerie isVisible={isVisible} setIsVisible={setIsVisible} user={user} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full max-w-5xl mx-auto pt-8 pb-32">
        {showResponse && (
          <div className="mt-20">
            <Response
              question={lastQuestion}
              answer={(data as AskQuestionResponse | undefined)?.answer?.answer}
              isPending={isPending}
              isError={isError}
              error={error}
            />
          </div>
        )}
        {!showResponse && (
          <div className="h-full flex flex-col items-center justify-center gap-10 z-2 mt-25">
            <div className="flex flex-col gap-2 px-2 md:px-8">
              <h2 className="text-2xl text-gray-600 flex items-center gap-3">
                Bonjour{" "}
                <span className="text-[#2BAA6A] text-3xl pacifico-regular">
                  {user ? user.name : "Visiteur"}
                </span>
              </h2>
              <h1 className="text-2xl md:text-4xl text-gray-800">
                Que voulez-vous savoir au sujet de ONUtech?
              </h1>
            </div>
            <SuggestionChips
              setIsVisible={setIsVisible}
              onSelectSuggestion={(text) => {
                setPrompt(text);
                handleSend(text);
              }}
            />
          </div>
        )}
      </div>
      <div className="fixed z-3 bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent">
        <div className="max-w-5xl mx-auto">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSend={() => handleSend(prompt)}
          />
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </main>
  );
};

export default HomeScreen;
