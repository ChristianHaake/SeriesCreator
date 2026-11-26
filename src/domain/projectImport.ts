import { parseProjectJson, type ProjectParseResult } from './projectCodec';

export const IMPORT_WORKER_TIMEOUT_MS = 10_000;

export function parseProjectTextInWorker(text: string, seasonFallback: string, episodeFallback = 'New Episode'): Promise<ProjectParseResult> {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(parseProjectJson(text, seasonFallback, episodeFallback));
  }

  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(
        new URL('../workers/projectImport.worker.ts', import.meta.url),
        { type: 'module' },
      );
    } catch {
      resolve(parseProjectJson(text, seasonFallback, episodeFallback));
      return;
    }
    let settled = false;
    const timeoutId = window.setTimeout(() => {
      finish({ ok: false, code: 'workerTimeout' });
    }, IMPORT_WORKER_TIMEOUT_MS);
    const finish = (result: ProjectParseResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      worker.terminate();
      resolve(result);
    };

    worker.addEventListener('message', (event: MessageEvent<ProjectParseResult>) => finish(event.data));
    worker.addEventListener('error', () => finish(parseProjectJson(text, seasonFallback, episodeFallback)));
    worker.addEventListener('messageerror', () => finish(parseProjectJson(text, seasonFallback, episodeFallback)));
    worker.postMessage({ text, seasonFallback, episodeFallback });
  });
}
