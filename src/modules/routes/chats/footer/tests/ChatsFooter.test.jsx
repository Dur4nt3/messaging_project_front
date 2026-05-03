import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsFooter from '../ChatsFooter';

// Note: This is just a simple snapshot test for the footer
// "LogoutPopover.test.jsx" 
// and other tests at the "../modals" directory
// delve into the interaction with the footer

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: <ChatsFooter />,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the chats footer', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the navbar', async () => {
        const { container } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('contentinfo'));

        expect(container).toMatchSnapshot();
    });
});
