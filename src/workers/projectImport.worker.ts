import { parseProjectJson } from '../domain/projectCodec';

self.addEventListener('message', (event: MessageEvent<string>) => {
  try {
    self.postMessage(parseProjectJson(event.data));
  } catch {
    self.postMessage({
      ok: false,
      message: 'Projektdatei konnte nicht geprüft werden.',
    });
  }
});
