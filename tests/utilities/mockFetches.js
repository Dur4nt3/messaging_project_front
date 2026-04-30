import { vi } from 'vitest';

export default function mockFetches(...responses) {
    const fetchMock = vi.fn();

    responses.forEach((res) => {
        fetchMock.mockImplementationOnce(() =>
            Promise.resolve({
                ok: res.ok ?? true,
                status: res.status ?? 200,
                json: () => Promise.resolve(res.body),
            })
        );
    });

    fetchMock.mockImplementation((input) => {
         const url = typeof input === 'string' ? input : input?.url;

        throw new Error(
            `A fetch was made to ${url}, this call wasn't mocked, throwing...`
        );
    });

    window.fetch = fetchMock;

    return fetchMock;
}
