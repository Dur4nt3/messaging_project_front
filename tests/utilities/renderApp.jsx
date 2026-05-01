import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export default function renderApp(
    routes,
    token = null,
    memoryRouterOptions = undefined
) {
    const user = userEvent.setup();

    window.localStorage = {
        getItem: vi.fn(() => token),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    };

    const router = createMemoryRouter(routes, memoryRouterOptions);
    const app = (
        <MantineProvider>
            <Notifications />
            <RouterProvider router={router} />
        </MantineProvider>
    );

    const container = render(app);

    return { container, user, router };
}
