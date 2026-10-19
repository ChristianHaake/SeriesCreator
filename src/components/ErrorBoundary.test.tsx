import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

function Explode(): never {
  throw new Error('render blew up');
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs the caught error; keep the test output readable.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  const copy = {
    title: 'Something went wrong',
    body: 'Changes made since the last successful save may be unavailable.',
    reloadLabel: 'Reload the page',
  };

  it('renders its children when nothing throws', () => {
    render(<ErrorBoundary {...copy}><p>editor</p></ErrorBoundary>);

    expect(screen.getByText('editor')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('replaces a blank page with a recovery message when a child throws', () => {
    render(<ErrorBoundary {...copy}><Explode /></ErrorBoundary>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(alert).toHaveTextContent('last successful save may be unavailable');
    expect(screen.getByRole('button', { name: 'Reload the page' })).toBeInTheDocument();
  });
});
