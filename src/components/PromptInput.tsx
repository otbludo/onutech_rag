import React from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function PromptInput({ value, onChange, onSend }: PromptInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const maxTextareaHeight = 180;

  const handleSend = () => {
    onSend();
    onChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    const nextHeight = Math.min(
      textareaRef.current.scrollHeight,
      maxTextareaHeight,
    );
    textareaRef.current.style.height = `${nextHeight}px`;
    textareaRef.current.style.overflowY =
      textareaRef.current.scrollHeight > maxTextareaHeight ? "auto" : "hidden";
  }, [value]);

  return (
    <Card className="w-full max-w-[750px] mx-auto z-3 rounded-[28px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-3 sm:p-4 flex flex-col gap-2 sm:gap-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex px-2 pt-2 items-end">
        <textarea
          ref={textareaRef}
          className="w-full flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder:text-gray-500 min-h-[48px] sm:min-h-[60px] max-h-[180px] text-base sm:text-lg leading-relaxed overflow-y-auto no-scrollbar"
          placeholder="Demander à Gemini 3"
          rows={1}
          aria-label="Saisissez votre prompt ici"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onInput={(event) => {
            const target = event.currentTarget;
            target.style.height = "0px";
            const nextHeight = Math.min(target.scrollHeight, maxTextareaHeight);
            target.style.height = `${nextHeight}px`;
            target.style.overflowY =
              target.scrollHeight > maxTextareaHeight ? "auto" : "hidden";
          }}
        />
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full text-gray-600 !bg-black !shadow-xl"
            aria-label="Utiliser le microphone"
            onClick={handleSend}
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
