import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';
import { mockFriendRequest } from '../../../../../../tests/utilities/mockFriendship';
import openMenuAndGetButton from '../../../../../../tests/utilities/openMenuAndGetButton';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsRouteModals from '../../ChatsRouteModals';
import ChatsFooter from '../../footer/ChatsFooter';

import handleFriendRequestAction from '../../../../utilities/actions/handleFriendRequestAction';

// Due to the size of the required tests
// this suite has been split into 3 suites
// refer to "./FriendRequestModalReceived.test.jsx" and "./FriendRequestModalSent.test.jsx
// for additional tests

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
                path: '/handle-friend-request/:userId',
                action: handleFriendRequestAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the friend requests modal', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can open the friend requests modal and indicate a loading state', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        stalledFetch();

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');

        expect(
            within(friendRequestsModal).getByRole('heading', {
                name: /loading/i,
            })
        );
    });

    it('Can open the friend requests modal and indicate a general empty state', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');

        expect(
            within(friendRequestsModal).getByRole('heading', {
                name: /friend requests/i,
            })
        );
        expect(
            within(friendRequestsModal).getByRole('heading', {
                name: /no pending requests/i,
            })
        );
        expect(
            within(friendRequestsModal).getByText(
                /you haven't sent or received any friend requests./i
            )
        );
    });

    it('Can close the friend requests modal', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        stalledFetch();

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');

        const closeModalButton = within(friendRequestsModal).getByRole(
            'button',
            {
                name: /close modal/i,
            }
        );

        await user.click(closeModalButton);

        await waitFor(() =>
            expect(friendRequestsModal).not.toBeInTheDocument()
        );
    });

    it('Can properly switch between the sent and received tabs', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 1, 2, 'test1', 'Test One', true),
                    mockFriendRequest(1, 3, 1, 'test3', 'Test Three', false),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');
        const sentTabButton = within(friendRequestsModal).getByRole('button', {
            name: /sent/i,
        });
        const receivedTabButton = within(friendRequestsModal).getByRole(
            'button',
            {
                name: /received/i,
            }
        );

        expect(
            within(friendRequestsModal).getByText(/test three/i)
        ).toBeInTheDocument();

        await user.click(sentTabButton);

        expect(
            within(friendRequestsModal).getByText(/test one/i)
        ).toBeInTheDocument();

        await user.click(receivedTabButton);

        expect(
            within(friendRequestsModal).getByText(/test three/i)
        ).toBeInTheDocument();
    });
});
