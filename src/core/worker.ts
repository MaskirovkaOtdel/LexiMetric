import { profileText, LinguisticProfile } from './linguistics.js';

export interface WorkerMessageRequest {
  id: string;
  type: 'ANALYZE';
  text: string;
}

export interface WorkerMessageResponse {
  id: string;
  type: 'RESULT' | 'ERROR';
  profile?: LinguisticProfile;
  error?: string;
}

// In-worker event listener when run inside a DedicatedWorkerGlobalScope
if (typeof self !== 'undefined' && typeof window === 'undefined' && typeof (self as any).importScripts === 'function') {
  self.onmessage = (event: MessageEvent<WorkerMessageRequest>) => {
    const { id, type, text } = event.data;
    if (type === 'ANALYZE') {
      try {
        const result = profileText(text);
        const response: WorkerMessageResponse = {
          id,
          type: 'RESULT',
          profile: result
        };
        self.postMessage(response);
      } catch (err: any) {
        const response: WorkerMessageResponse = {
          id,
          type: 'ERROR',
          error: err?.message || 'Unknown profiling error'
        };
        self.postMessage(response);
      }
    }
  };
}

/**
 * Client-side helper to run linguistic profiling asynchronously.
 * Falls back transparently to direct execution if Workers are unsupported.
 */
export class LinguisticWorkerPool {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, { resolve: (p: LinguisticProfile) => void; reject: (e: any) => void }>();
  private requestCounter = 0;

  constructor(workerUrl?: string | URL) {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        if (workerUrl) {
          this.worker = new Worker(workerUrl, { type: 'module' });
        } else {
          // Inline blob worker fallback for zero-config bundling
          const blobCode = `
            import { profileText } from '${window.location.origin}/src/core/linguistics.js';
            self.onmessage = function(e) {
              const { id, type, text } = e.data;
              if (type === 'ANALYZE') {
                try {
                  const res = profileText(text);
                  self.postMessage({ id, type: 'RESULT', profile: res });
                } catch(err) {
                  self.postMessage({ id, type: 'ERROR', error: err.message });
                }
              }
            };
          `;
          const blob = new Blob([blobCode], { type: 'application/javascript' });
          this.worker = new Worker(URL.createObjectURL(blob), { type: 'module' });
        }

        this.worker.onmessage = (event: MessageEvent<WorkerMessageResponse>) => {
          const { id, type, profile, error } = event.data;
          const handler = this.pendingRequests.get(id);
          if (handler) {
            this.pendingRequests.delete(id);
            if (type === 'RESULT' && profile) {
              handler.resolve(profile);
            } else {
              handler.reject(new Error(error || 'Worker error'));
            }
          }
        };
      } catch {
        // Transparent fallback to synchronous processing if blob worker fails
        this.worker = null;
      }
    }
  }

  public async profile(text: string): Promise<LinguisticProfile> {
    if (!this.worker) {
      // Synchronous fallback
      return profileText(text);
    }

    const id = `req_${++this.requestCounter}_${Date.now()}`;
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage({
        id,
        type: 'ANALYZE',
        text
      });
    });
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
  }
}
