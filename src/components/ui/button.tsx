import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#C08B7A] to-[#A67265] text-primary-foreground shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-md hover:from-[#A67265] hover:to-[#9B6B5A] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:bg-destructive/90 hover:shadow-md",
        outline: "border border-primary/40 bg-transparent hover:bg-primary/5 hover:border-primary/60 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:bg-secondary/80 hover:shadow-md",
        ghost: "hover:bg-muted/40 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        hero: "shimmer-host bg-gradient-to-b from-[#C08B7A] to-[#A67265] text-primary-foreground shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_28px_rgba(192,139,122,0.45)] hover:from-[#A67265] hover:to-[#9B6B5A] active:scale-[0.98] font-semibold",
        premium: "bg-secondary/40 text-foreground border border-primary/30 shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-primary/50 hover:bg-secondary/60 hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
