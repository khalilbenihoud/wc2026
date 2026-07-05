import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-screen bg-brand-bg text-brand-text">
            <div className="text-center p-8">
              <h2 className="font-unbounded text-xl mb-3">Something went wrong</h2>
              <p className="text-brand-muted text-sm mb-5">
                Please refresh the page to try again.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-5 py-2.5 font-unbounded text-sm text-brand-gold-hi"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
