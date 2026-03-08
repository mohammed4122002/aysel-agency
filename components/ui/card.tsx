import { forwardRef, type HTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, DivProps>(function Card({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border bg-white text-card-foreground shadow ${className}`.trim()}
      {...props}
    />
  );
});

export const CardContent = forwardRef<HTMLDivElement, DivProps>(function CardContent(
  { className = "", ...props },
  ref,
) {
  return <div ref={ref} className={`p-6 ${className}`.trim()} {...props} />;
});

