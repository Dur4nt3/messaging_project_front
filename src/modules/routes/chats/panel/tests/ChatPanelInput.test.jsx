import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import mockMessage from '../../../../../../tests/utilities/mockMessage';
import mockChatListItem from '../../../../../../tests/utilities/mockChatListItem';
import mockChatData from '../../../../../../tests/utilities/mockChatData';

import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';

import {
    get200,
    get400,
} from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatList from '../../ChatList';
import ChatPanel from '../../ChatPanel';

import sendMessageAction from '../../../../utilities/actions/sendMessageAction';

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
                path: '/send-message/:chatId',
                action: sendMessageAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

// TODO: Test input and button are disabled when loading
// TODO: Test renders properly
// TODO: Test error notification on an invalid message
// TODO: Test sending a message
// TODO: Test input and button are disabled when users aren't friends + notice shown

describe('Test suite for the chat panel input', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Disabled the chat panel input when it is loading', async () => {
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

        const messageInput = await within(chatPanel).findByRole('textbox', {
            name: /write a message/i,
        });
        const sendButton = within(chatPanel).getByRole('button', {
            name: /send message/i,
        });

        expect(messageInput).toBeDisabled();
        expect(sendButton).toBeDisabled();
    });

    it('Renders properly', async () => {
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

        const messageInput = await within(chatPanel).findByRole('textbox', {
            name: /write a message/i,
        });
        const sendButton = within(chatPanel).getByRole('button', {
            name: /send message/i,
        });

        expect(messageInput).not.toBeDisabled();
        expect(sendButton).not.toBeDisabled();
    });

    it('Can properly invalidate messages', async () => {
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
            get200(mockChatData(1, 1, 'Test One', [], false, true)),
            get400({
                success: false,
                errors: [{ path: 'message', msg: 'Message must not be empty' }],
            }),
            get400({
                success: false,
                errors: [
                    {
                        path: 'message',
                        msg: 'Message must not exceed 5000 characters',
                    },
                ],
            }),
            get400({
                success: false,
            })
        );

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        const messageInput = await within(chatPanel).findByRole('textbox', {
            name: /write a message/i,
        });
        const sendButton = within(chatPanel).getByRole('button', {
            name: /send message/i,
        });

        await user.click(sendButton);

        // Client-side validation
        let errorNotification = await screen.findByText(
            /Failed to send message/i
        );
        expect(
            within(errorNotification.parentNode).getByText(
                /message must not be empty/i
            )
        ).toBeInTheDocument();

        // Dismissing the error
        await user.click(
            within(errorNotification.parentNode.parentNode).getByRole('button')
        );

        await waitFor(() =>
            expect(
                screen.queryByText(/Failed to send message/i)
            ).not.toBeInTheDocument()
        );

        // This is just to bypass the client-side errors
        await user.type(messageInput, 'test');

        // Although server-side responses are mocked
        // these checks serve to verify the component properly renders errors returned from the server
        await user.click(sendButton);

        errorNotification = await screen.findByText(/Failed to send message/i);
        expect(
            within(errorNotification.parentNode).getByText(
                /message must not be empty/i
            )
        ).toBeInTheDocument();
        await user.click(
            within(errorNotification.parentNode.parentNode).getByRole('button')
        );
        await waitFor(() =>
            expect(
                screen.queryByText(/Failed to send message/i)
            ).not.toBeInTheDocument()
        );

        await user.click(sendButton);

        errorNotification = await screen.findByText(/Failed to send message/i);
        expect(
            within(errorNotification.parentNode).getByText(
                /message must not exceed 5000 characters/i
            )
        ).toBeInTheDocument();
        await user.click(
            within(errorNotification.parentNode.parentNode).getByRole('button')
        );
        await waitFor(() =>
            expect(
                screen.queryByText(/Failed to send message/i)
            ).not.toBeInTheDocument()
        );

        await user.click(sendButton);

        errorNotification = await screen.findByText(/Failed to send message/i);
        expect(
            within(errorNotification.parentNode).getByText(
                /an unexpected error occurred. please try again later./i
            )
        ).toBeInTheDocument();
    });

    it('Can send a message', async () => {
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
            get200(mockChatData(1, 1, 'Test One', [], false, true)),
            get200({
                success: true,
            }),
            get200(
                mockChatData(
                    1,
                    1,
                    'Test One',
                    [
                        mockMessage(
                            'Test Two',
                            true,
                            1,
                            'message sent',
                            1,
                            new Date(),
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

        const messageInput = await within(chatPanel).findByRole('textbox', {
            name: /write a message/i,
        });
        const sendButton = within(chatPanel).getByRole('button', {
            name: /send message/i,
        });

        await user.type(messageInput, 'message sent');
        await user.click(sendButton);

        await waitFor(() =>
            expect(within(chatPanel).getByText(/message sent/i))
        );
    });

    it('Can indicate when users are not friends', async () => {
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
            get200(mockChatData(1, 1, 'Test One', [], false, false)),
        );

        const chatList = screen.getByTestId('chat-list');
        const item = within(chatList).getByTestId('chat-list-item');

        await user.click(item);

        const chatPanel = screen.getByTestId('chat-panel');

        const messageInput = await within(chatPanel).findByRole('textbox', {
            name: /write a message/i,
        });
        const sendButton = within(chatPanel).getByRole('button', {
            name: /send message/i,
        });

        expect(messageInput).toBeDisabled();
        expect(sendButton).toBeDisabled();

        // The indicator banner is a ::before element
        // It won't appear in the test but if the form has the class it will show up
        expect(within(chatPanel).getByTestId('send-message-form')).toHaveClass('not-friends');
        expect(within(chatPanel).getByText(/you're no a longer friend of this user! non-friends cannot chat./i)).toBeInTheDocument();
        
    });
});
