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

describe('Test suite for the chat panel main', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate when the chat panel main is loading', async () => {
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
                within(chatPanel).getByText(/fetching chat data/i)
            ).toBeInTheDocument()
        );
        expect(
            within(chatPanel).getByText(/this should only take a moment./i)
        ).toBeInTheDocument();
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
                            'message 1',
                            1,
                            new Date('2026-05-05T14:10:00'),
                            1
                        ),
                        mockMessage(
                            'Test One',
                            false,
                            2,
                            'message 2',
                            1,
                            new Date('2026-05-05T14:15:00'),
                            1
                        ),
                    ],
                    false,
                    true
                )
            )
        );

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        const message1 = await within(chatPanel).findByTestId('message-row-1');
        const message2 = within(chatPanel).getByTestId('message-row-2');

        expect(within(message1).getByText(/14:10/i)).toBeInTheDocument();
        expect(within(message1).getByText(/message 1/i)).toBeInTheDocument();

        expect(within(message2).getByText(/14:15/i)).toBeInTheDocument();
        expect(within(message2).getByText(/message 2/i)).toBeInTheDocument();

        // If the "more" property is set to false this button shouldn't appear
        expect(within(chatPanel).queryByRole('button', { name: /load older messages/i})).not.toBeInTheDocument();
    });

    it('Can load more messages', async () => {
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
                            2,
                            'message sent by user',
                            1,
                            new Date('2026-05-05T14:15:00'),
                            1
                        ),
                    ],
                    true,
                    true
                )
            ),
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
                            'message sent by user',
                            1,
                            new Date('2026-05-05T14:10:00'),
                            1
                        ),
                    ],
                    false,
                    true
                )
            )
        );

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        const viewMoreButton = await within(chatPanel).findByRole('button', { name: /load older messages/i});
        
        expect(within(chatPanel).getAllByText(/message sent by user/i)).toHaveLength(1);

        await user.click(viewMoreButton);
        
        await waitFor(() => expect(within(chatPanel).getAllByText(/message sent by user/i)).toHaveLength(2));
        expect(within(chatPanel).queryByRole('button', { name: /load older messages/i})).not.toBeInTheDocument();

        const allMessages = within(chatPanel).getAllByText(/message sent by user/i);

        // Ordered correctly
        expect(within(allMessages[0].parentNode).getByText(/14:10/i)).toBeInTheDocument();
        expect(within(allMessages[1].parentNode).getByText(/14:15/i)).toBeInTheDocument();
    });
});
