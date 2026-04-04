import React from "react";
import { cn } from "./cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "pill"
  | "ghostDanger"
  | "black";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "none";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2BAA6A] text-white hover:bg-[#24945d] border border-transparent",
  secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
  outline: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 border border-transparent",
  danger:
    "bg-[#E8524D] text-white hover:bg-[#d94742] border border-transparent",
  pill: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 rounded-full",
  ghostDanger: "bg-transparent text-red-600 hover:bg-red-50 justify-start",
  black: "bg-[#000000] text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  none: "h-auto px-0",
  icon: "h-9 w-9 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2BAA6A]/40 disabled:opacity-60 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
