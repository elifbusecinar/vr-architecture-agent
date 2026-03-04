import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  hint?: string;
  illustration?: ReactNode;
  size?: 'sm' | 'md';
  dashed?: boolean;
  className?: string;
}

export const EmptyState = ({
  icon,
  title = 'Nothing here',
  description = 'No items found.',
  action,
  hint,
  illustration,
  size = 'md',
  dashed = false,
  className,
}: EmptyStateProps) => {
  return (
    <div className={`empty-state${size === 'sm' ? ' sm' : ''} ${className ?? ''}`}>
      {illustration}
      {icon && (
        <div className={`empty-state-illustration${dashed ? ' dashed' : ''}`}>{icon}</div>
      )}
      <div className={`empty-state-title${size === 'sm' ? '' : ''}`} style={size === 'sm' ? { fontSize: 15 } : undefined}>
        {title}
      </div>
      <div className="empty-state-desc">{description}</div>
      {action && <div className="empty-state-actions">{action}</div>}
      {hint && <div className="empty-state-hint">{hint}</div>}
    </div>
  );
};
