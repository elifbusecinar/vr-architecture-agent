type InlineVariant = 'red' | 'amber' | 'blue';

interface InlineErrorProps {
  variant?: InlineVariant;
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULT_ICONS: Record<InlineVariant, string> = {
  red: '\u26A0',
  amber: '\u25D0',
  blue: '\u2139',
};

export function InlineError({
  variant = 'red',
  icon,
  message,
  actionLabel,
  onAction,
}: InlineErrorProps) {
  return (
    <div className={`inline-error ${variant}`}>
      <span className="ie-icon">{icon ?? DEFAULT_ICONS[variant]}</span>
      <div className="ie-text">{message}</div>
      {actionLabel && (
        <button className="ie-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
