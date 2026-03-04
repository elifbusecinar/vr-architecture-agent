import { useState, type ReactNode } from 'react';

type BannerVariant = 'error' | 'warning';

interface BannerProps {
  variant: BannerVariant;
  icon?: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
}

export function Banner({
  variant,
  icon,
  children,
  actionLabel,
  onAction,
  dismissible = true,
}: BannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const isError = variant === 'error';
  const cls = isError ? 'error-banner' : 'warning-banner';
  const defaultIcon = isError ? '\u26A0' : '\u25D0';

  return (
    <div className={cls}>
      <span className={isError ? 'eb-icon' : 'wb-icon'}>{icon ?? defaultIcon}</span>
      <div className={isError ? 'eb-text' : 'wb-text'}>{children}</div>
      {actionLabel && (
        <button className={isError ? 'eb-action' : 'wb-action'} onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {dismissible && (
        <button
          className={isError ? 'eb-close' : 'wb-close'}
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
        >
          \u2715
        </button>
      )}
    </div>
  );
}
