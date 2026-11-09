import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../i18n';
import type { Episode } from '../types';
import { processImageUpload } from '../domain/imageUpload';
import { EpisodeDialog } from './EpisodeDialog';

vi.mock('../domain/imageUpload', () => ({ processImageUpload: vi.fn() }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

function Harness() {
  const [episode, setEpisode] = useState<Episode>({ id: 'episode-1', title: 'Episode', summary: '' });
  const [mounted, setMounted] = useState(true);
  return (
    <LocaleProvider>
      <output data-testid="episode-state">{JSON.stringify(episode)}</output>
      <button onClick={() => setMounted(false)}>Unmount dialog</button>
      {mounted && <EpisodeDialog
        episode={episode}
        seasonId="season-1"
        index={0}
        onUpdate={(_seasonId, _episodeId, updates) => setEpisode((current) => ({
          ...current,
          ...(typeof updates === 'function' ? updates(current) : updates),
        }))}
        onClose={() => {}}
      />}
    </LocaleProvider>
  );
}

function contentImageInput() {
  return document.querySelector<HTMLInputElement>('input[aria-label="Add image block"]')!;
}

afterEach(() => vi.clearAllMocks());

describe('EpisodeDialog image uploads', () => {
  it('appends a completed image upload to text edits made while processing', async () => {
    const upload = deferred<{ ok: true; url: string }>();
    vi.mocked(processImageUpload).mockReturnValue(upload.promise);
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Add image block' }));
    fireEvent.change(contentImageInput(), { target: { files: [new File(['image'], 'image.png', { type: 'image/png' })] } });
    await user.click(screen.getByRole('button', { name: 'Add text block' }));
    await user.type(screen.getByLabelText('Content'), 'Text entered during image processing');

    await act(async () => upload.resolve({ ok: true, url: 'data:image/jpeg;base64,IMAGE' }));
    await waitFor(() => {
      const state = JSON.parse(screen.getByTestId('episode-state').textContent!);
      expect(state.contentBlocks).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'text', body: 'Text entered during image processing' }),
        expect.objectContaining({ type: 'image', imageUrl: 'data:image/jpeg;base64,IMAGE' }),
      ]));
    });
  });

  it('does not update the episode when an upload resolves after the dialog unmounts', async () => {
    const upload = deferred<{ ok: true; url: string }>();
    vi.mocked(processImageUpload).mockReturnValue(upload.promise);
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Add image block' }));
    fireEvent.change(contentImageInput(), { target: { files: [new File(['image'], 'image.png', { type: 'image/png' })] } });
    await user.click(screen.getByRole('button', { name: 'Unmount dialog' }));
    const before = screen.getByTestId('episode-state').textContent;

    await act(async () => upload.resolve({ ok: true, url: 'data:image/jpeg;base64,IMAGE' }));

    expect(screen.getByTestId('episode-state').textContent).toBe(before);
    expect(JSON.parse(before!).contentBlocks ?? []).toHaveLength(0);
  });
});
