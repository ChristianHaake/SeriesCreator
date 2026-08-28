import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Localized copy, passed in because the boundary sits outside the provider. */
  title: string;
  body: string;
  reloadLabel: string;
}

interface State {
  failed: boolean;
}

/**
 * Without this, an uncaught render error leaves a blank page. The project is
 * autosaved to localStorage and survives a reload, but a student looking at
 * nothing has no way to know that — so say it, and offer the reload.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nothing is reported anywhere off-device; this is only for a teacher
    // reading the console.
    console.error('SeriesCreator failed to render', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="app-error" role="alert">
        <h1>{this.props.title}</h1>
        <p>{this.props.body}</p>
        <button
          type="button"
          className="ui-button"
          onClick={() => window.location.reload()}
        >
          {this.props.reloadLabel}
        </button>
      </div>
    );
  }
}
