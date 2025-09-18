import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary-hover',
        gradient: 'bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 hover:from-primary-hover hover:to-primary-dark',
        premium: 'bg-gradient-to-r from-primary via-primary-hover to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 glow',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
