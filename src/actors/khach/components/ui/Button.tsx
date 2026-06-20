import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "neutral"
    | "outline"
    | "ghost";
  size?: "small" | "medium" | "large";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "medium",
      iconStart,
      iconEnd,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-brand-primary text-white hover:bg-blue-600 shadow-sm",
      secondary:
        "bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm",
      neutral:
        "bg-surface-bg text-text-primary border border-border hover:bg-slate-50",
      outline:
        "bg-transparent text-brand-primary border border-brand-primary hover:bg-brand-primary/5",
      ghost:
        "bg-transparent text-text-secondary hover:bg-slate-100 hover:text-text-primary",
    };

    const sizes = {
      small: "px-3 py-1.5 text-sm gap-1.5",
      medium: "px-4 py-2 text-sm gap-2",
      large: "px-6 py-3 text-base gap-2",
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
        {iconStart && (
          <span className="flex-shrink-0">{iconStart}</span>
        )}
        {children}
        {iconEnd && (
          <span className="flex-shrink-0">{iconEnd}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";