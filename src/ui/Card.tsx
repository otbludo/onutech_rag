import React from "react";
import { cn } from "./cn";

type CardVariant = "default" | "outline" | "elevated" | "glass" | "muted";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white border border-gray-100 shadow-sm",
  outline: "bg-white border border-gray-200",
  elevated: "bg-white border border-gray-100 shadow-md",
  glass: "bg-white/80 backdrop-blur-xl border border-gray-100 shadow-sm",
  muted: "bg-slate-50 border border-slate-200",
};

export function Card({ variant = "default", className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-2xl", variantClasses[variant], className)}
      {...props}
    />
  );
}
