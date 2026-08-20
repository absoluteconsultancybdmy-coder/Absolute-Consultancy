import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional label for diagnostics. */
  name?: string;
  /** Called when an error is caught. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary — graceful fallback for lazy / dynamic sections.
 * Prevents a single failing section from breaking the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== 'undefined') {
      console.error(
        `[ErrorBoundary${this.props.name ? `: ${this.props.name}` : ''}]`,
        error,
        info.componentStack
      );
    }
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div
          role="alert"
          className="relative w-full flex items-center justify-center"
          style={{
            minHeight: '40vh',
            background: 'rgba(2, 22, 53,0.4)',
            border: '1px solid rgb(var(--color-gold) / 0.15)',
            color: 'rgba(245,232,211,0.7)',
            padding: '32px 16px',
            textAlign: 'center',
          }}
        >
          <p className="font-body uppercase tracking-widest text-xs">
            {this.props.name ? `${this.props.name} is temporarily unavailable.` : 'This section failed to load.'}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
