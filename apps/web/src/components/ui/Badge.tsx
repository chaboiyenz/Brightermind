import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-stone-100 text-stone-700",
        brand: "bg-brand-100 text-brand-700",
        success: "bg-sage-100 text-sage-600",
        warning: "bg-clay-100 text-clay-600",
        danger: "bg-brick-100 text-brick-600",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/**
 * Maps GAD-7 severity bands to a badge tone. Deliberately avoids danger/red for
 * "severe" per the migration plan's design note — calm, non-alarming language
 * even at higher severity, paired with a clear next step elsewhere in the UI.
 */
export function severityToTone(severity: "minimal" | "mild" | "moderate" | "severe") {
  const map = {
    minimal: "success",
    mild: "brand",
    moderate: "warning",
    severe: "warning", // intentionally not "danger" — see note above
  } as const;
  return map[severity];
}

/**
 * Display label for a severity value — sentence case ("Severe") rather than
 * the raw lowercase value the type uses internally, wherever a severity band
 * is shown directly to a user (GAD-7 result, psychologist inbox, etc).
 */
export function severityToLabel(severity: "minimal" | "mild" | "moderate" | "severe"): string {
  const map = {
    minimal: "Minimal",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
  } as const;
  return map[severity];
}
