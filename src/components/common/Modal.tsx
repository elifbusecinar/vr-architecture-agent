import { useEffect, useRef, useId } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const titleId = useId();
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Lock body scroll and remember previously focused element
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previousFocusRef.current?.focus();
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Move focus into modal on open
    useEffect(() => {
        if (!isOpen) return;
        const frame = requestAnimationFrame(() => {
            const first = modalRef.current?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            first?.focus();
        });
        return () => cancelAnimationFrame(frame);
    }, [isOpen]);

    // ESC to close + focus trap
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
                return;
            }

            if (e.key !== 'Tab' || !modalRef.current) return;

            const focusable = Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute('disabled'));

            if (!focusable.length) return;

            const first = focusable[0];
            const last  = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="modal-overlay"
            onClick={onClose}
            aria-hidden="false"
        >
            <div
                ref={modalRef}
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 id={titleId} className="modal-title">{title}</h3>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
