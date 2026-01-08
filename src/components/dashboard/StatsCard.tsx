import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'gradient-primary text-primary-foreground',
  success: 'gradient-success text-success-foreground',
  warning: 'gradient-warning text-warning-foreground',
  info: 'gradient-secondary text-primary-foreground',
};

export const StatsCard = ({ title, value, change, icon, variant = 'default' }: StatsCardProps) => {
  const isGradient = variant !== 'default';

  return (
    <div
      className={cn(
        'rounded-xl p-5 transition-all duration-300 hover:shadow-lg animate-slide-up',
        variantStyles[variant],
        isGradient && 'shadow-glow'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              isGradient ? 'opacity-80' : 'text-muted-foreground'
            )}
          >
            {title}
          </p>
          <p className={cn('mt-2 text-3xl font-bold', isGradient ? '' : 'text-foreground')}>
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  isGradient
                    ? 'opacity-90'
                    : change.isPositive
                    ? 'text-success'
                    : 'text-destructive'
                )}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <span className={cn('text-xs', isGradient ? 'opacity-70' : 'text-muted-foreground')}>
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            isGradient ? 'bg-white/20' : 'bg-primary/10'
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
