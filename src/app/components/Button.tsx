import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'outline', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed font-sans';

    const variants = {
      solid: 'bg-[var(--brand-dark)] text-[var(--brand-lime)] border border-[var(--brand-dark)] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-dark)] hover:border-[var(--brand-accent)]',
      outline: 'bg-transparent text-[var(--brand-dark)] border border-[var(--brand-dark)] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-dark)]',
      ghost: 'bg-transparent text-[var(--brand-dark)] hover:bg-[var(--brand-accent)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-6 py-3 text-xs',
      lg: 'px-8 py-4 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
