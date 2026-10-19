import { parseProjectJson } from '../domain/projectCodec';

interface ImportRequest {
  text: string;
  /** Localized label used when an imported season has no title of its own. */
  seasonFallback: string;
}

self.addEventListener('message', (event: MessageEvent<ImportRequest>) => {
  try {
    self.postMessage(parseProjectJson(event.data.text, event.data.seasonFallback));
  } catch {
    // A code, not a message: this crosses postMessage, where the UI's
    // translator cannot follow.
    self.postMessage({ ok: false, code: 'invalidJson' });
  }
});
