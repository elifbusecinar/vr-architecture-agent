import { useEffect } from 'react';

/**
 * Runtime technical improvements — mounted once at the app root.
 *
 * Handles:
 *   - iOS Safari --vh fix (100dvh alternative via CSS variable)
 *   - Passive touch/wheel listeners to unblock the main thread
 *   - Silent logging for unhandled promise rejections
 */
export function useTechnicalImprovements(): void {
  // --vh CSS variable — iOS Safari mis-calculates 100vh (excludes browser chrome)
  // Usage in CSS: height: calc(var(--vh, 1vh) * 100)
  useEffect(() => {
    function setVh() {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    }

    setVh();
    window.addEventListener('resize', setVh, { passive: true });
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Passive touch/wheel listeners — prevents browser from waiting for JS before scrolling
  useEffect(() => {
    const noop = () => {};
    const opts = { passive: true };
    document.addEventListener('touchstart', noop, opts);
    document.addEventListener('touchmove',  noop, opts);
    document.addEventListener('wheel',      noop, opts);
    return () => {
      document.removeEventListener('touchstart', noop);
      document.removeEventListener('touchmove',  noop);
      document.removeEventListener('wheel',      noop);
    };
  }, []);

  // Unhandled promise rejections — log silently instead of red console errors
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      console.warn('[VRA] Unhandled rejection:', event.reason);
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);
}
