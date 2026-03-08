import { useState, useCallback, type ReactNode } from 'react';

type ErrorColor = 'red' | 'amber' | 'blue';

interface ErrorStateProps {
  icon?: string;
  color?: ErrorColor;
  title?: string;
  description?: string;
  errorCode?: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  secondaryAction?: ReactNode;
  className?: string;
}

export const ErrorState = ({
  icon = '\u26A1',
  color = 'red',
  title = 'Something went wrong',
  description,
  errorCode,
  onRetry,
  retryLabel = '\u21BA Retry',
  secondaryAction,
  className,
}: ErrorStateProps) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setRetrying(false), 2000);
    }
  }, [onRetry]);

  return (
    <div className={`error-state ${className ?? ''}`}>
      <div className={`error-state-icon ${color}`}>{icon}</div>
      <div className="error-state-title">{title}</div>
      {description && <div className="error-state-desc">{description}</div>}
      <div className="error-state-actions">
        {onRetry && (
          <button
            className="btn btn-primary"
            onClick={handleRetry}
            disabled={retrying}
            style={retrying ? { opacity: 0.7 } : undefined}
          >
            {retrying ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span className="spinner sm" style={{ borderTopColor: 'var(--bg)' }} />
                Retrying\u2026
              </span>
            ) : (
              retryLabel
            )}
          </button>
        )}
        {secondaryAction}
      </div>
      {errorCode && <div className="error-state-code">{errorCode}</div>}
    </div>
  );
};
