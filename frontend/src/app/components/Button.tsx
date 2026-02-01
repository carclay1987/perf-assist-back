import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {

  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:-translate-x-0.5 cursor-pointer relative overflow-hidden';
  
  const variantStyles = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg border-2',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2',
    outline: 'border-2 border-border text-foreground hover:bg-muted'
  };


  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} border-transparent ${className}`}
    >
      {children}
    </button>
  );
}