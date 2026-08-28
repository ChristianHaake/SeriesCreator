import { parseProjectJson, type ProjectParseResult } from './projectCodec';

export function parseProjectTextInWorker(text: string): Promise<ProjectParseResult> {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(parseProjectJson(text));
  }

  return new Promise((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(
        new URL('../workers/projectImport.worker.ts', import.meta.url),
        { type: 'module' },
      );
    } catch {
      resolve(parseProjectJson(text));
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
    worker.addEventListener('error', () => finish(parseProjectJson(text)));
    worker.addEventListener('messageerror', () => finish(parseProjectJson(text)));
    worker.postMessage(text);
  });
}
