import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialProjectData } from '../types';
import { IMPORT_WORKER_TIMEOUT_MS, parseProjectTextInWorker } from './projectImport';

class TestWorker {
  static response: unknown;
  static eventType = 'message';
  static silent = false;
  static latest: TestWorker | undefined;
  readonly listeners = new Map<string, EventListener>();
  readonly terminate = vi.fn();

  constructor() {
    TestWorker.latest = this;
  }

  addEventListener(type: string, listener: EventListener) {
    this.listeners.set(type, listener);
  }

  postMessage() {
    if (TestWorker.silent) return;
    queueMicrotask(() => {
      this.listeners.get(TestWorker.eventType)?.({ data: TestWorker.response } as unknown as Event);
    });
  }
}

describe('parseProjectTextInWorker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    TestWorker.silent = false;
    TestWorker.latest = undefined;
  });

  it('falls back to the validated codec when workers are unavailable', async () => {
    vi.stubGlobal('Worker', undefined);

    const result = await parseProjectTextInWorker(JSON.stringify(initialProjectData), 'Season');

    expect(result.ok).toBe(true);
  });

  it('accepts a valid worker response and terminates the worker', async () => {
    TestWorker.eventType = 'message';
    TestWorker.response = { ok: true, data: initialProjectData };
    vi.stubGlobal('Worker', TestWorker);

    const result = await parseProjectTextInWorker(JSON.stringify(initialProjectData), 'Season');

    expect(result).toEqual({ ok: true, data: initialProjectData });
  });

  it('falls back to the codec after a worker error', async () => {
    TestWorker.eventType = 'error';
    TestWorker.response = undefined;
    vi.stubGlobal('Worker', TestWorker);

    const result = await parseProjectTextInWorker(JSON.stringify(initialProjectData), 'Season');

    expect(result).toEqual({ ok: true, data: initialProjectData });
  });

  it('terminates a silent worker and reports a bounded import failure', async () => {
    vi.useFakeTimers();
    TestWorker.silent = true;
    vi.stubGlobal('Worker', TestWorker);

    const pending = parseProjectTextInWorker(JSON.stringify(initialProjectData), 'Season');
    await vi.advanceTimersByTimeAsync(IMPORT_WORKER_TIMEOUT_MS);

    await expect(pending).resolves.toEqual({ ok: false, code: 'workerTimeout' });
    expect(TestWorker.latest?.terminate).toHaveBeenCalledOnce();
  });

  it('falls back to the codec when a module worker cannot be created', async () => {
    vi.stubGlobal('Worker', class {
      constructor() {
        throw new Error('Module workers are unavailable');
      }
    });

    const result = await parseProjectTextInWorker(JSON.stringify(initialProjectData), 'Season');

    expect(result).toEqual({ ok: true, data: initialProjectData });
  });
});
