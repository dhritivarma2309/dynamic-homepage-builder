import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  tone?: "default" | "clay" | "enamel";
};

export function Button({ active, tone = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        active && tone === "clay" && "bg-primary text-primary-foreground shadow-sm",
        active && tone === "enamel" && "bg-enamel text-paper shadow-sm",
        active && tone === "default" && "bg-foreground text-background",
        !active && "bg-card text-foreground ring-1 ring-border hover:bg-accent",
        className,
      )}
      {...props}
    />
  );
}