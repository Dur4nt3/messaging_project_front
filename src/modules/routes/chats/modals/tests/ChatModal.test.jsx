import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';

import mockFetches from '../../../../../../tests/utilities/mockFetches';
import mockChatListItem from '../../../../../../tests/utilities/mockChatListItem';
import mockChatData from '../../../../../../tests/utilities/mockChatData';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsRouteModal from '../../ChatsRouteModals';
import ChatList from '../../ChatList';
import ChatPanel from '../../ChatPanel';

import deleteFriendAction from '../../../../utilities/actions/deleteFriendAction';

const buildRoutes = (activeChats) => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: (
                    <>
                        <ChatsRouteModal testEnv={true} />
                        <ChatList
                            activeChats={activeChats}
                            markChatAsRead={vi.fn()}
                        />
                    </>
                ),
            },
            {
                path: '/delete-friend/:userId',
                action: deleteFriendAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

// TODO: Test exit chat on header
// TODO: Test that remove friend disappears from the menu after clicking it

describe('Test suite for the chat modal', () => {
    beforeAll(() => {
        // Ensuring a modal will be forced
        window.innerWidth = 640;
    });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can render the exit chat button and properly interact with it when in a modal', async () => {
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
        await waitFor(() => screen.getByTestId('chat-list'));

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        mockFetches(get200(mockChatData(1, 1, 'Test One', [], false, true)));

        await user.click(item);

        // This also ensures the modal appears when window.innerWidth < 768
        const chatModal = screen.getByTestId('chat-modal');

        const chatAction = within(chatModal).getByRole('button', {
            name: /chat actions/i,
        });

        await user.click(chatAction);

        const menu = await screen.findByRole('menu', { hidden: true });
        menu.style.display = 'block';

        const exitChat = screen.getByRole('menuitem', {
            name: /exit chat/i,
        });

        await user.click(exitChat);

        await waitFor(() =>
            expect(screen.queryByTestId('chat-modal')).not.toBeInTheDocument()
        );
    });

    it('Can properly render the menu when users are not friends', async () => {
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
        await waitFor(() => screen.getByTestId('chat-list'));

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        mockFetches(get200(mockChatData(1, 1, 'Test One', [], false, false)));

        await user.click(item);

        // This also ensures the modal appears when window.innerWidth < 768
        const chatModal = screen.getByTestId('chat-modal');

        const chatAction = within(chatModal).getByRole('button', {
            name: /chat actions/i,
        });

        await user.click(chatAction);

        const menu = await screen.findByRole('menu', { hidden: true });
        menu.style.display = 'block';

        expect(
            screen.getByRole('menuitem', {
                name: /exit chat/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole('menuitem', {
                name: /remove friend/i,
            })
        ).not.toBeInTheDocument();
    });
});
