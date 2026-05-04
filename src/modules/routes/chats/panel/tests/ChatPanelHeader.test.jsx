import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import mockMessage from '../../../../../../tests/utilities/mockMessage';
import mockChatListItem from '../../../../../../tests/utilities/mockChatListItem';
import mockChatData from '../../../../../../tests/utilities/mockChatData';

import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatList from '../../ChatList';
import ChatPanel from '../../ChatPanel';

import deleteFriendAction from '../../../../utilities/actions/deleteFriendAction';

// Note: Any functionality related to the chat modal
// is tested at "../../modals/tests/ChatModal.test.jsx"

const buildRoutes = (activeChats) => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: (
                    <>
                        <ChatList
                            activeChats={activeChats}
                            markChatAsRead={vi.fn()}
                        />
                        <ChatPanel testEnv={true} />
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

describe('Test suite for the chat panel header', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate when the chat panel header is loading', async () => {
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
        await waitFor(() => screen.getByTestId('chat-panel'));

        stalledFetch();

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        await waitFor(() =>
            expect(
                within(chatPanel).getByTestId('loading-panel-header')
            ).toBeInTheDocument()
        );
        expect(
            within(chatPanel).queryByLabelText('chat actions')
        ).not.toBeInTheDocument();
    });

    it('Can render properly', async () => {
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
        await waitFor(() => screen.getByTestId('chat-panel'));

        mockFetches(get200(mockChatData(1, 1, 'Test One', [], false, true)));

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        await waitFor(() =>
            expect(within(chatPanel).getByText(/Test One/i)).toBeInTheDocument()
        );

        const chatAction = within(chatPanel).getByRole('button', {
            name: /chat actions/i,
        });

        await user.click(chatAction);

        // Same issue as with the logout popover
        // added to the dom upon clicking, but stays hidden
        // again, this is an issue due to poor browser emulation
        const menu = await screen.findByRole('menu', { hidden: true });
        menu.style.display = 'block';

        expect(
            screen.getByRole('menuitem', { name: /remove friend/i })
        ).toBeInTheDocument();
    });

    it('Can remove friends via the chat', async () => {
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
        await waitFor(() => screen.getByTestId('chat-panel'));

        mockFetches(
            get200(
                mockChatData(
                    1,
                    1,
                    'Test One',
                    [
                        mockMessage(
                            'Test One',
                            false,
                            1,
                            '1',
                            1,
                            new Date(),
                            1
                        ),
                        mockMessage(
                            'Test One',
                            false,
                            2,
                            '2',
                            1,
                            new Date(),
                            1
                        ),
                    ],
                    false,
                    true
                )
            ),
            get200({ success: true }),
            get200(mockChatData(1, 1, 'Test One', [], false, false))
        );

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        await waitFor(() =>
            expect(within(chatPanel).getByText(/Test One/i)).toBeInTheDocument()
        );

        const chatAction = within(chatPanel).getByRole('button', {
            name: /chat actions/i,
        });

        await user.click(chatAction);

        const menu = await screen.findByRole('menu', { hidden: true });
        menu.style.display = 'block';

        const removeButton = screen.getByRole('menuitem', {
            name: /remove friend/i,
        });

        await user.click(removeButton);

        await waitFor(() =>
            expect(fetch).toHaveBeenLastCalledWith(
                'http://localhost:8080/chats/1/messages?from=2&firstMessageId=1',
                {
                    headers: {
                        Authorization: true,
                    },
                    method: 'GET',
                }
            )
        );

        await waitFor(() =>
            expect(within(chatPanel).getByText(/Test One/i)).toBeInTheDocument()
        );
    });
});
