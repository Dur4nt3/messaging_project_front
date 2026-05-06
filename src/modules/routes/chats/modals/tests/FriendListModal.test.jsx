import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';
import { mockFriend } from '../../../../../../tests/utilities/mockFriendship';
import openMenuAndGetButton from '../../../../../../tests/utilities/openMenuAndGetButton';
import mockChatListItem from '../../../../../../tests/utilities/mockChatListItem';
import mockChatData from '../../../../../../tests/utilities/mockChatData';

import {
    get200,
    get400,
} from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsRouteModals from '../../ChatsRouteModals';
import ChatList from '../../ChatList';
import ChatPanel from '../../ChatPanel';
import ChatsFooter from '../../footer/ChatsFooter';

import deleteFriendAction from '../../../../utilities/actions/deleteFriendAction';
import openChatAction from '../../../../utilities/actions/openChatAction';

const buildRoutes = (activeChats) => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: (
                    <>
                        <ChatsRouteModals />
                        <ChatList
                            activeChats={activeChats}
                            markChatAsRead={vi.fn()}
                        />
                        <ChatPanel testEnv={true} />
                        <ChatsFooter />
                    </>
                ),
            },
            {
                path: '/delete-friend/:userId',
                action: deleteFriendAction,
            },
            {
                path: '/open-chat/:userId',
                action: openChatAction,
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

    it('Can open the friend list and indicate a loading state', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        stalledFetch();

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        expect(
            within(friendListModal).getByRole('heading', {
                name: /loading/i,
            })
        );
    });

    it('Can open the friend list and indicate an empty state', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [],
            })
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        expect(
            within(friendListModal).getByRole('heading', {
                name: /no friends/i,
            })
        );

        expect(
            within(friendListModal).getByText(
                /you haven't added any friends yet. once you've added some friends, they will appear here./i
            )
        );
    });

    it('Can close the friend requests modal', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        stalledFetch();

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        const closeModalButton = within(friendListModal).getByRole('button', {
            name: /close modal/i,
        });

        await user.click(closeModalButton);

        await waitFor(() => expect(friendListModal).not.toBeInTheDocument());
    });

    it('Can properly render friend list items', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [mockFriend(1, 1, 2, 'test1', 'Test One', false)],
            })
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        await waitFor(() =>
            expect(
                within(friendListModal).getByText(/test one/i)
            ).toBeInTheDocument()
        );

        expect(
            within(friendListModal).getByRole('button', {
                name: /open chat with test one/i,
            })
        ).toBeInTheDocument();
        expect(
            within(friendListModal).getByRole('button', {
                name: /remove test one from friend list/i,
            })
        ).toBeInTheDocument();
    });

    it('Can indicate when an error occurred', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [mockFriend(1, 1, 2, 'test1', 'Test One', false)],
            }),
            get400({ success: false })
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        await waitFor(() =>
            expect(
                within(friendListModal).getByText(/test one/i)
            ).toBeInTheDocument()
        );

        await user.click(
            within(friendListModal).getByRole('button', {
                name: /open chat with test one/i,
            })
        );

        await waitFor(() =>
            expect(
                within(friendListModal).getByTestId('request-denied-error')
            ).toBeInTheDocument()
        );
    });

    it('Can remove a friend from the list', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [mockFriend(1, 1, 2, 'test1', 'Test One', false)],
            }),
            get200({ success: true }),
            get200({
                type: 'FRIEND_LIST',
                friendships: [],
            })
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        await waitFor(() =>
            expect(
                within(friendListModal).getByText(/test one/i)
            ).toBeInTheDocument()
        );

        await user.click(
            within(friendListModal).getByRole('button', {
                name: /remove test one from friend list/i,
            })
        );

        await waitFor(() =>
            expect(
                within(friendListModal).getByRole('heading', {
                    name: /no friends/i,
                })
            )
        );
    });

    it('Can open a chat with a friend (chat exists already)', async () => {
        const { user } = renderApp(
            buildRoutes([
                mockChatListItem(
                    1,
                    new Date(),
                    1,
                    'test1',
                    'Test One',
                    'testing #1',
                    false,
                    10
                ),
            ]),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [mockFriend(1, 1, 2, 'test1', 'Test One', false)],
            }),
            get200({ success: true, chat: { chatId: 1 } }),
            get200(mockChatData(1, 1, 'Test One', [], false, true))
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        await waitFor(() =>
            expect(
                within(friendListModal).getByText(/test one/i)
            ).toBeInTheDocument()
        );

        await user.click(
            within(friendListModal).getByRole('button', {
                name: /open chat with test one/i,
            })
        );

        await waitFor(() => expect(friendListModal).not.toBeInTheDocument());

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        expect(item).toHaveClass('active');

        const chatPanel = screen.getByTestId('chat-panel');

        await waitFor(() =>
            expect(within(chatPanel).getByText(/Test One/i)).toBeInTheDocument()
        );
    });

    it('Can open a chat with a friend (chat does not exist already)', async () => {
        const { user } = renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /friend list/i);

        mockFetches(
            get200({
                type: 'FRIEND_LIST',
                friendships: [mockFriend(1, 1, 2, 'test1', 'Test One', false)],
            }),
            get200({ success: true, chat: null }),
            get200({ success: true, chat: { chatId: 1 } }),
            get200(mockChatData(1, 1, 'Test One', [], false, true))
        );

        await user.click(button);

        const friendListModal = screen.getByRole('dialog');

        await waitFor(() =>
            expect(
                within(friendListModal).getByText(/test one/i)
            ).toBeInTheDocument()
        );

        await user.click(
            within(friendListModal).getByRole('button', {
                name: /open chat with test one/i,
            })
        );

        await waitFor(() => expect(friendListModal).not.toBeInTheDocument());

        const chatPanel = screen.getByTestId('chat-panel');

        await waitFor(() =>
            expect(within(chatPanel).getByText(/Test One/i)).toBeInTheDocument()
        );
    });
});
