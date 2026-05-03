import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import HomeHeader from '../../../root/HomeHeader';
import ChatsFooter from '../ChatsFooter';

import logoutAction from '../../../../utilities/actions/logoutAction';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomeHeader />,
            },
            {
                path: '/chats',
                element: <ChatsFooter />,
            },
            {
                path: '/logout',
                action: logoutAction,
            }
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the logout popover', () => {
    beforeEach(() => {
        vi.resetAllMocks();

        // The below test case explains the issue
        // Suppress the warning regardless as it isn't conducive to anything
        vi.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
            if (
                typeof msg === 'string' &&
                msg.includes('[@mantine/hooks/use-focus-trap]')
            ) {
                return;
            }
            console.warn(msg, ...args);
        });
    });

    // Note: due to the technicalities of the interaction with the popover
    // I've opted to just include all interactions in 1 test case
    it('Can properly interact with the popover', async () => {
        const { user, router } = renderApp(
            buildRoutes(),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('contentinfo'));

        const logoutPopoverButton = screen.getByRole('button', {
            name: /logout/i,
        });

        await user.click(logoutPopoverButton);

        // Since happy-dom cannot fully emulate behavior required by Mantine
        // the dialog won't show up naturally
        // fortunately it is added to the DOM
        // therefore, I can adjust it as seen below
        let dialog = await screen.findByRole('dialog', { hidden: true });
        dialog.style.display = 'block';

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());

        const cancelButton = within(dialog).getByRole('button', {
            name: /cancel/i,
        });

        await user.click(cancelButton);

        await waitFor(() =>
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );

        await user.click(logoutPopoverButton);

        dialog = await screen.findByRole('dialog', { hidden: true });
        dialog.style.display = 'block';

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible());

        const logoutButton = within(dialog).getByRole('button', {
            name: /logout/i,
        });

        // The response doesn't really matter here
        // This is again a case of the server doing the heavy-lifting
        mockFetches(get200({ success: true }));

        vi.spyOn(localStorage, 'removeItem');

        await user.click(logoutButton);

        expect(router.state.location.pathname).toBe('/');
        expect(localStorage.removeItem).toHaveBeenCalled();
    });
});
