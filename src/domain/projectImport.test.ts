import { afterEach, describe, expect, it, vi } from 'vitest';
import { initialProjectData } from '../types';
import { parseProjectTextInWorker } from './projectImport';

class TestWorker {
  static response: unknown;
  static eventType = 'message';
  readonly listeners = new Map<string, EventListener>();
  readonly terminate = vi.fn();

  addEventListener(type: string, listener: EventListener) {
    this.listeners.set(type, listener);
  }

  postMessage() {
    queueMicrotask(() => {
      this.listeners.get(TestWorker.eventType)?.({ data: TestWorker.response } as unknown as Event);
    });
  }
}

describe('parseProjectTextInWorker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
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
