import React from "react";

type Variant = "primary" | "secondary" | "success" | "ghost";

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    primary: "cc-btn cc-btn--primary",
    secondary: "cc-btn cc-btn--secondary",
    success: "cc-btn bg-(--cc-success) text-white",
    ghost: "cc-btn bg-transparent hover:bg-zinc-50",
  };
  return (
    <button
      type={type}
      className={`${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
