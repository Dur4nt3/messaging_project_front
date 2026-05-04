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

describe('Test suite for the friend requests modal (received tab)', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate an empty state on the received tab', async () => {
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

        expect(
            within(friendRequestsModal).getByRole('heading', {
                name: /no pending requests/i,
            })
        );
        expect(
            within(friendRequestsModal).getByText(
                /^you haven't received any friend requests.$/i
            )
        );
    });

    it('Can properly render received requests', async () => {
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

        const receivedTabButton = within(friendRequestsModal).getByRole(
            'button',
            { name: /received/i }
        );
        // Indicator count
        expect(within(receivedTabButton).getByText('1')).toBeInTheDocument();

        expect(
            within(friendRequestsModal).getByText(/test one/i)
        ).toBeInTheDocument();
        expect(
            within(friendRequestsModal).getByRole('button', {
                name: /accept friend request/i,
            })
        ).toBeInTheDocument();
        expect(
            within(friendRequestsModal).getByRole('button', {
                name: /deny friend request/i,
            })
        ).toBeInTheDocument();
    });

    it('Can properly accept and deny friend requests', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 2, 1, 'test2', 'Test Two', false),
                    mockFriendRequest(2, 3, 1, 'test3', 'Test Three', false),
                    mockFriendRequest(3, 1, 4, 'test4', 'Test Four', true),
                ],
            }),
            get200({ success: true }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(2, 3, 1, 'test3', 'Test Three', false),
                    mockFriendRequest(3, 1, 4, 'test4', 'Test Four', true),
                ],
            }),
            get200({ success: true }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(3, 1, 4, 'test4', 'Test Four', true),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');

        const [acceptReq1] = within(friendRequestsModal).getAllByRole(
            'button',
            {
                name: /accept friend request/i,
            }
        );

        await user.click(acceptReq1);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).queryByText(/test two/i)
            ).not.toBeInTheDocument()
        );
        expect(
            within(friendRequestsModal).getByText(/test three/i)
        ).toBeInTheDocument();

        const acceptOtherReq = within(friendRequestsModal).getByRole('button', {
            name: /accept friend request/i,
        });

        await user.click(acceptOtherReq);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).getByRole('heading', {
                    name: /no pending requests/i,
                })
            )
        );
        expect(
            within(friendRequestsModal).getByText(
                /^you haven't received any friend requests.$/i
            )
        );
    });

    it('Can indicate an error when accepting or denying friend requests', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend requests/i);

        mockFetches(
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 2, 1, 'test2', 'Test Two', false),
                    mockFriendRequest(2, 3, 1, 'test3', 'Test Three', false),
                ],
            }),
            get200({ success: false }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 2, 1, 'test2', 'Test Two', false),
                    mockFriendRequest(2, 3, 1, 'test3', 'Test Three', false),
                ],
            }),
            get200({ success: false }),
            get200({
                type: 'FRIEND_REQUEST',
                friendships: [
                    mockFriendRequest(1, 2, 1, 'test2', 'Test Two', false),
                    mockFriendRequest(2, 3, 1, 'test3', 'Test Three', false),
                ],
            })
        );

        await user.click(button);

        const friendRequestsModal = screen.getByRole('dialog');

        const [acceptReq1] = within(friendRequestsModal).getAllByRole(
            'button',
            {
                name: /accept friend request/i,
            }
        );

        await user.click(acceptReq1);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).getByTestId(/request-denied-error/i)
            ).toBeInTheDocument()
        );

        const acceptOtherReq = within(friendRequestsModal).getByRole('button', {
            name: /accept friend request/i,
        });

        await user.click(acceptOtherReq);

        await waitFor(() =>
            expect(
                within(friendRequestsModal).getAllByTestId(
                    /request-denied-error/i
                )
            ).toHaveLength(2)
        );
    });
});
