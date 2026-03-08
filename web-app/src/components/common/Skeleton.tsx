interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'line' | 'title' | 'avatar' | 'card';
  style?: React.CSSProperties;
}

const VARIANT_CLASS: Record<string, string> = {
  line: 'sk-line',
  title: 'sk-title',
  avatar: 'sk-avatar',
  card: 'sk-card',
};

export const Skeleton = ({ className, count = 1, variant = 'line', style }: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`skeleton ${VARIANT_CLASS[variant] ?? ''} ${className ?? ''}`}
          style={style}
        />
      ))}
    </>
  );
};

export function SkeletonCard({ children }: { children: React.ReactNode }) {
  return <div className="skeleton-card">{children}</div>;
}

export function StatCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton variant="line" style={{ width: '50%' }} />
        <Skeleton variant="title" style={{ width: '35%' }} />
        <Skeleton variant="line" style={{ width: '65%' }} />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ padding: '0 16px' }}>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{
            padding: '13px 0',
            borderBottom: i < rows - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Skeleton variant="avatar" style={{ width: 28, height: 28, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Skeleton variant="line" style={{ width: `${55 - i * 5}%` }} />
            <Skeleton variant="line" style={{ width: `${35 - i * 2}%`, opacity: 0.6 }} />
          </div>
          <Skeleton variant="card" style={{ width: 60, height: 22, borderRadius: 'var(--radius-sm)' }} />
        </div>
      ))}
    </div>
  );
}
