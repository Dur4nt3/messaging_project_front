import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../tests/utilities/mockFetches';
import mockChatListItem from '../../../../../tests/utilities/mockChatListItem';
import mockChatData from '../../../../../tests/utilities/mockChatData';

import { get200 } from '../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../AppShell';

import ErrorPage from '../../error/ErrorPage';

import ChatList from '../ChatList';

import deleteChatAction from '../../../utilities/actions/deleteChatAction';

const buildRoutes = (activeChats, markChatAsRead) => [
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
                            markChatAsRead={markChatAsRead}
                        />
                    </>
                ),
            },
            {
                path: '/delete-chat/:chatId',
                action: deleteChatAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

const markChatAsReadMock = vi.fn();

describe('Test suite for the chat list', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate when the chatList is empty', async () => {
        renderApp(
            buildRoutes([], markChatAsReadMock),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByTestId('chat-list'));

        const chatList = screen.getByTestId('chat-list');
        expect(
            within(chatList).getByRole('heading', { name: /no chats yet/i })
        ).toBeInTheDocument();
        expect(
            within(chatList).getByText(/message a friend to get started/i)
        ).toBeInTheDocument();
    });

    it('Can render the chat list', async () => {
        renderApp(
            buildRoutes(
                [
                    mockChatListItem(
                        1,
                        // eslint-disable-next-line @stylistic/no-mixed-operators
                        new Date(new Date() - 1000 * 60 * 60 * 30),
                        1,
                        'test1',
                        'Test One',
                        'testing #1',
                        false,
                        10
                    ),
                    mockChatListItem(
                        2,
                        new Date(-1),
                        2,
                        'test2',
                        'Test Two',
                        'testing #2',
                        false,
                        2
                    ),
                    mockChatListItem(
                        3,
                        new Date(-1),
                        3,
                        'test3',
                        'Test Three',
                        'testing #3',
                        true,
                        0
                    ),
                ],
                markChatAsReadMock
            ),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByTestId('chat-list'));

        const chatList = screen.getByTestId('chat-list');
        const items = within(chatList).getAllByTestId('chat-list-item');

        // Correct recipients
        expect(within(items[0]).getByText(/Test One/i)).toBeInTheDocument();
        expect(within(items[1]).getByText(/Test Two/i)).toBeInTheDocument();
        expect(within(items[2]).getByText(/Test Three/i)).toBeInTheDocument();

        // Correct message times
        expect(within(items[0]).getByText(/yesterday/i)).toBeInTheDocument();
        expect(within(items[1]).getByText(/9\+ days ago/i)).toBeInTheDocument();
        expect(within(items[2]).getByText(/9\+ days ago/i)).toBeInTheDocument();

        // Correct message preview
        expect(within(items[0]).getByText(/testing #1/i)).toBeInTheDocument();
        expect(within(items[1]).getByText(/testing #2/i)).toBeInTheDocument();
        expect(
            within(items[2]).getByText(/you: testing #3/i)
        ).toBeInTheDocument();

        // Correct unread count
        expect(within(items[0]).getByTestId('unread-badge').textContent).toBe(
            '9+'
        );
        expect(within(items[1]).getByTestId('unread-badge').textContent).toBe(
            '2'
        );
        expect(
            within(items[2]).queryByTestId('unread-badge')
        ).not.toBeInTheDocument();

        // Have delete buttons
        expect(
            within(items[0]).getByRole('button', { name: /hide chat/i })
        ).toBeInTheDocument();
        expect(
            within(items[1]).getByRole('button', { name: /hide chat/i })
        ).toBeInTheDocument();
        expect(
            within(items[2]).getByRole('button', { name: /hide chat/i })
        ).toBeInTheDocument();
    });

    it('Can delete a chat', async () => {
        const { user } = renderApp(
            buildRoutes(
                [
                    mockChatListItem(
                        1,
                        // eslint-disable-next-line @stylistic/no-mixed-operators
                        new Date(new Date() - 1000 * 60 * 60 * 30),
                        1,
                        'test1',
                        'Test One',
                        'testing #1',
                        false,
                        10
                    ),
                ],
                markChatAsReadMock
            ),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByTestId('chat-list'));

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        const hideButton = within(item).getByRole('button', {
            name: /hide chat/i,
        });

        mockFetches(get200({ success: true }));

        await user.click(hideButton);

        expect(fetch).toHaveBeenCalled();
    });

    it('Can highlight a chat', async () => {
        const { user } = renderApp(
            buildRoutes(
                [
                    mockChatListItem(
                        1,
                        // eslint-disable-next-line @stylistic/no-mixed-operators
                        new Date(new Date() - 1000 * 60 * 60 * 30),
                        1,
                        'test1',
                        'Test One',
                        'testing #1',
                        false,
                        10
                    ),
                    mockChatListItem(
                        2,
                        new Date(-1),
                        2,
                        'test2',
                        'Test Two',
                        'testing #2',
                        false,
                        2
                    ),
                ],
                markChatAsReadMock
            ),
            true,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByTestId('chat-list'));

        mockFetches(
            get200(mockChatData(1, 1, 'Test One', [], false, true)),
            get200(mockChatData(2, 2, 'Test Two', [], false, true)),
            get200(mockChatData(1, 1, 'Test One', [], false, true))
        );

        const chatList = screen.getByTestId('chat-list');
        const items = within(chatList).getAllByTestId('chat-list-item');

        // Highlight
        await user.click(items[0]);

        expect(items[0]).toHaveClass('active');

        // Undo highlight
        await user.click(items[0]);

        expect(items[0]).not.toHaveClass('active');

        // Highlight
        await user.click(items[1]);

        expect(items[1]).toHaveClass('active');

        // Switch highlight
        await user.click(items[0]);
        expect(items[0]).toHaveClass('active');
        expect(items[1]).not.toHaveClass('active');
    });
});
