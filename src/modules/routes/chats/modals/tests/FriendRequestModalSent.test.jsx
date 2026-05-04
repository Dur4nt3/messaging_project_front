import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
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

describe('Test suite for the friend requests modal (sent tab)', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate an empty state on the sent tab', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 1, 2, 'test1', 'Test One', false),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');
        const sentTabButton = within(friendRequestsModal).getByRole('button', {
            name: /sent/i,
        });

        await user.click(sentTabButton);

        expect(
            within(friendRequestsModal).getByRole('heading', {
                name: /no pending requests/i,
            })
        );
        expect(
            within(friendRequestsModal).getByText(
                /^you haven't sent any friend requests.$/i
            )
        );
    });

    it('Can properly render sent requests', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 1, 2, 'test1', 'Test One', true),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');
        const sentTabButton = within(friendRequestsModal).getByRole('button', {
            name: /sent/i,
        });

        expect(within(sentTabButton).getByText('1')).toBeInTheDocument();

        await user.click(sentTabButton);

        expect(
            within(friendRequestsModal).getByText(/test one/i)
        ).toBeInTheDocument();
        expect(
            within(friendRequestsModal).getByRole('button', {
                name: /undo friend request/i,
            })
        ).toBeInTheDocument();
        expect(
            within(friendRequestsModal).getByText(/pending/i)
        ).toBeInTheDocument();
    });

    it('Can properly undo friend requests', async () => {
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
            }),
            get200({ success: true }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 3, 1, 'test3', 'Test Three', false),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');
        const sentTabButton = within(friendRequestsModal).getByRole('button', {
            name: /sent/i,
        });

        await user.click(sentTabButton);

        const undoReq = within(friendRequestsModal).getByRole('button', {
            name: /undo friend request/i,
        });

        await user.click(undoReq);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).getByRole('heading', {
                    name: /no pending requests/i,
                })
            )
        );
        expect(
            within(friendRequestsModal).getByText(
                /^you haven't sent any friend requests.$/i
            )
        );
    });

    it('Can indicate an error when undoing friend requests', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 1, 2, 'test1', 'Test One', true),
                ],
            }),
            get200({ success: false }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 1, 2, 'test1', 'Test One', true),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');
        const sentTabButton = within(friendRequestsModal).getByRole('button', {
            name: /sent/i,
        });

        await user.click(sentTabButton);

        const undoReq = within(friendRequestsModal).getByRole('button', {
            name: /undo friend request/i,
        });

        await user.click(undoReq);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).getByTestId(/request-denied-error/i)
            ).toBeInTheDocument()
        );
    });
});
