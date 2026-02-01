import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-muted text-muted-foreground border-border',
    success: 'bg-success/20 text-success border-success/30',
    info: 'bg-info/20 text-info border-info/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    error: 'bg-destructive/20 text-destructive border-destructive/30'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}