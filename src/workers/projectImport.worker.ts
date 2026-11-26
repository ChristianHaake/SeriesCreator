import { parseProjectJson } from '../domain/projectCodec';

interface ImportRequest {
  text: string;
  /** Localized label used when an imported season has no title of its own. */
  seasonFallback: string;
  /** Localized label used when an imported episode has no title of its own. */
  episodeFallback: string;
}

self.addEventListener('message', (event: MessageEvent<ImportRequest>) => {
  try {
    self.postMessage(parseProjectJson(event.data.text, event.data.seasonFallback, event.data.episodeFallback));
  } catch {
    // A code, not a message: this crosses postMessage, where the UI's
    // translator cannot follow.
    self.postMessage({ ok: false, code: 'invalidJson' });
  }
});
