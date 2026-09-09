import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

// docs/DESIGN.md buttons: pill silhouette, Plus Jakarta labels, gentle hover.
//  - primary: the brand green — default action everywhere in the app.
//  - accent:  the coral/clay "mindful CTA". Reserved for the one thing a page
//             most wants the visitor to do (book a session). Never stack two.
//  - outline / ghost / secondary: quiet supporting actions.
//  - danger:  muted brick, not alarm red.
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-[0.01em] transition-[background-color,box-shadow,transform,filter] duration-200 ease-gentle disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50",
  {
    variants: {
      variant: {
        primary: "bg-brand-600 text-on-brand hover:bg-brand-700",
        accent: "bg-clay-500 text-on-clay shadow-coral hover:brightness-95",
        secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200",
        outline:
          "border-[1.5px] border-stone-200 bg-transparent text-stone-800 hover:border-brand-300 hover:bg-brand-300/10",
        ghost: "text-stone-700 hover:bg-stone-100",
        danger: "bg-brick-500 text-stone-25 hover:bg-brick-600",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-[15px]",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
