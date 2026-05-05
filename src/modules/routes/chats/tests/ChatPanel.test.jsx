import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';

import AppShell from '../../../../AppShell';

import ErrorPage from '../../error/ErrorPage';

import ChatList from '../ChatList';
import ChatPanel from '../ChatPanel';

import deleteChatAction from '../../../utilities/actions/deleteChatAction';

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
                        <ChatPanel />
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

describe('Test suite for the chat panel', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can indicate when the chat panel is empty', async () => {
        renderApp(buildRoutes([]), true, memoryRouterOptions);
        await waitFor(() => screen.getByTestId('chat-panel'));

        const chatPanel = screen.getByTestId('chat-panel');
        expect(
            within(chatPanel).getByText(/No chat selected/i)
        ).toBeInTheDocument();
        expect(
            within(chatPanel).getByText(
                /Pick a chat from the list to get started./i
            )
        ).toBeInTheDocument();
    });
});
