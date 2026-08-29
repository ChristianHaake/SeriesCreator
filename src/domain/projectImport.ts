import { parseProjectJson, type ProjectParseResult } from './projectCodec';

export function parseProjectTextInWorker(text: string, seasonFallback: string): Promise<ProjectParseResult> {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(parseProjectJson(text, seasonFallback));
  }

  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(
        new URL('../workers/projectImport.worker.ts', import.meta.url),
        { type: 'module' },
      );
    } catch {
      resolve(parseProjectJson(text, seasonFallback));
      return;
    }
    let settled = false;
    const finish = (result: ProjectParseResult) => {
      if (settled) return;
      settled = true;
      worker.terminate();
      resolve(result);
    };

    worker.addEventListener('message', (event: MessageEvent<ProjectParseResult>) => finish(event.data));
    worker.addEventListener('error', () => finish(parseProjectJson(text, seasonFallback)));
    worker.addEventListener('messageerror', () => finish(parseProjectJson(text, seasonFallback)));
    worker.postMessage({ text, seasonFallback });
  });
}
