import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-premium active:scale-[0.97] active:duration-150 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-forest-700 text-white hover:bg-forest-600 hover:shadow-lg hover:shadow-forest-700/30",
        // A soft band of light sweeps across on hover.
        gold: "relative isolate overflow-hidden bg-gold-500 text-forest-950 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/30 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/45 before:to-transparent before:transition-transform before:duration-1000 before:ease-premium hover:before:translate-x-full",
        outline: "border border-white/40 text-white hover:border-white/70 hover:bg-white/10",
        ghost: "text-forest-800 hover:bg-forest-100",
        subtle: "border border-[#cfdcd3] bg-white text-forest-800 hover:border-forest-600/40 hover:bg-forest-50",
        whatsapp: "bg-[#25D366] text-forest-950 hover:bg-[#3ee07b] hover:shadow-lg hover:shadow-[#25D366]/30",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
