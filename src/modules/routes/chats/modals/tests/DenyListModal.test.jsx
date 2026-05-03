import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';
import { mockDeniedFriendship } from '../../../../../../tests/utilities/mockFriendship';
import openMenuAndGetButton from '../../../../../../tests/utilities/openMenuAndGetButton';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsRouteModals from '../../ChatsRouteModals';
import ChatsFooter from '../../footer/ChatsFooter';

import removeFromDenyAction from '../../../../utilities/actions/removeFromDenyAction';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: (
                    <>
                        <ChatsRouteModals />
                        <ChatsFooter />
                    </>
                ),
            },
            {
                path: '/remove-from-deny/:userId',
                action: removeFromDenyAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the deny list modal', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can open the deny list and indicate a loading state', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /denied users/i);

        // This just means that "runRefresher" will be true
        // This allows testing what happens when data has yet to return
        stalledFetch();

        await user.click(button);

        // It is intended for this to throw if there's more than 1 dialog
        const denyListModal = screen.getByRole('dialog');

        expect(
            within(denyListModal).getByRole('heading', {
                name: /loading/i,
            })
        );
    });

    it('Can open the deny list and indicate an empty state', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /denied users/i);

        mockFetches(
            get200({
                type: 'DENY_LIST',
                friendships: [],
            })
        );

        await user.click(button);

        const denyListModal = screen.getByRole('dialog');

        expect(
            within(denyListModal).getByRole('heading', {
                name: /denied users/i,
            })
        );
        expect(
            within(denyListModal).getByRole('heading', {
                name: /no users denied/i,
            })
        );
        expect(
            within(denyListModal).getByText(
                "You haven't denied any users. If you do, they will appear here."
            )
        );
    });

    it('Can open the deny list and fully interact with it', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /denied users/i);

        mockFetches(
            get200({
                type: 'DENY_LIST',
                friendships: [
                    mockDeniedFriendship(1, 2, 1, 'test2', 'Test Two'),
                    mockDeniedFriendship(2, 3, 1, 'test3', 'Test Three'),
                ],
            }),
            get200({ success: true }),
            get200({
                type: 'DENY_LIST',
                friendships: [
                    mockDeniedFriendship(2, 3, 1, 'test3', 'Test Three'),
                ],
            })
        );

        await user.click(button);

        const denyListModal = screen.getByRole('dialog');

        // Items are rendering correctly
        expect(within(denyListModal).getByText('test2')).toBeInTheDocument();
        expect(within(denyListModal).getByText('test3')).toBeInTheDocument();

        const removeButtons = within(denyListModal).getAllByRole('button', {
            name: /remove from deny list/i,
        });
        expect(removeButtons).toHaveLength(2);

        await user.click(removeButtons[0]);

        await waitFor(() => expect(within(denyListModal).queryByText('test2')).not.toBeInTheDocument());
        expect(within(denyListModal).getByText('test3')).toBeInTheDocument();
    });

    it('Can open the deny list and receive errors', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /denied users/i);

        mockFetches(
            get200({
                type: 'DENY_LIST',
                friendships: [
                    mockDeniedFriendship(1, 2, 1, 'test2', 'Test Two'),
                    mockDeniedFriendship(2, 3, 1, 'test3', 'Test Three'),
                ],
            }),
            get200({ success: false }),
        );

        await user.click(button);

        const denyListModal = screen.getByRole('dialog');

        const removeButtons = within(denyListModal).getAllByRole('button', {
            name: /remove from deny list/i,
        });

        await user.click(removeButtons[0]);

        await waitFor(() => expect(within(denyListModal).getByTestId('request-denied-error')).toBeInTheDocument());
    });
});
