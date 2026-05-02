import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsNav from '../ChatsNav';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: <ChatsNav userInitials='JD' />,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the chats navbar', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the navbar', async () => {
        const { container } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('navigation'));

        expect(container).toMatchSnapshot();
    });
});
