import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="vr-app" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', minHeight: '100vh' }}>
                    <div className="error-state" style={{ padding: '64px 32px' }}>
                        <div className="error-state-icon red">{'\u26A1'}</div>
                        <div className="error-state-title" style={{ fontSize: 18 }}>Something went wrong</div>
                        <div className="error-state-desc" style={{ maxWidth: 340 }}>
                            The application encountered an unexpected error. Please try refreshing the page.
                        </div>
                        <div className="error-state-actions">
                            <button
                                className="btn btn-primary"
                                style={{ padding: '10px 24px', fontSize: 13 }}
                                onClick={() => window.location.reload()}
                            >
                                Refresh page
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '10px 24px', fontSize: 13 }}
                                onClick={() => this.setState({ hasError: false })}
                            >
                                Try again
                            </button>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <div className="error-state-code" style={{ marginTop: 20, maxWidth: 420, wordBreak: 'break-word' }}>
                                {this.state.error.toString()}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
