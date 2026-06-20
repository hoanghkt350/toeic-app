import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "subtle" | "ghost";
  size?: "small" | "medium" | "large";
}

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(
  (
    {
      className,
      icon,
      variant = "subtle",
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-brand-primary text-white hover:bg-blue-600",
      subtle:
        "bg-slate-100 text-text-secondary hover:bg-slate-200 hover:text-text-primary",
      ghost:
        "bg-transparent text-text-secondary hover:bg-slate-100 hover:text-text-primary",
    };

    const sizes = {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            className,
          ),
        )}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";