import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

const fieldBase =
  "w-full rounded-sm border border-stone-300 bg-stone-25 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "min-h-[100px] resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Wraps a single Input/Textarea with a label and inline error state.
 * Error text uses `brick`, not alarm-red, per the app's tone (see design tokens).
 */
export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-800">
        {label}
        {required && <span className="ml-0.5 text-brick-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-stone-600">{hint}</p>}
      {error && (
        <p className="text-xs text-brick-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
