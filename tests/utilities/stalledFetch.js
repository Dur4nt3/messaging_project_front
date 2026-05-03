import { vi } from 'vitest';

export function stalledFetch() {
    window.fetch = vi.fn(() => new Promise(() => {}));
}
