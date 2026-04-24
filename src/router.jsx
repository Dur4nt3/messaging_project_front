import { createBrowserRouter } from 'react-router';

import AppShell from './AppShell';

import ErrorPage from './modules/routes/error/ErrorPage';
import PageLoading from './modules/utilities/miscComponents/PageLoading';

import Root from './modules/routes/root/Root';
import Signup from './modules/routes/signup/Signup';
import Login from './modules/routes/login/Login';
import Chats from './modules/routes/chats/Chats';

import redirectToChats from './modules/utilities/loaders/redirectToChats';

import rootLoader from './modules/utilities/loaders/rootLoader';
import loginLoader from './modules/utilities/loaders/loginLoader';
import chatsLoader from './modules/utilities/loaders/chatsLoader';

import signupAction from './modules/utilities/actions/signupAction';
import loginAction from './modules/utilities/actions/loginAction';
import logoutAction from './modules/utilities/actions/logoutAction';

import openChatAction from './modules/utilities/actions/openChatAction';
import deleteChatAction from './modules/utilities/actions/deleteChatAction';

import sendMessageAction from './modules/utilities/actions/sendMessageAction';

import addFriendAction from './modules/utilities/actions/addFriendAction';
import handleFriendRequestAction from './modules/utilities/actions/handleFriendRequestAction';
import removeFromDenyAction from './modules/utilities/actions/removeFromDenyAction';
import deleteFriendAction from './modules/utilities/actions/deleteFriendAction';

const router = createBrowserRouter([
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        hydrateFallbackElement: <PageLoading />,
        children: [
            {
                path: '/',
                element: <Root />,
                loader: rootLoader,
            },
            {
                path: '/signup',
                element: <Signup />,
                action: signupAction,
            },
            {
                path: '/login',
                element: <Login />,
                loader: loginLoader,
                action: loginAction,
            },
            {
                path: '/chats',
                element: <Chats />,
                loader: chatsLoader,
            },
            {
                path: '/error',
                element: <ErrorPage />,
            },

            {
                path: '/logout',
                loader: redirectToChats,
                action: logoutAction,
            },

            {
                path: '/open-chat/:userId',
                loader: redirectToChats,
                action: openChatAction,
            },
            {
                path: '/delete-chat/:chatId',
                loader: redirectToChats,
                action: deleteChatAction,
            },

            {
                path: '/send-message/:chatId',
                loader: redirectToChats,
                action: sendMessageAction,
            },

            {
                path: '/send-friend-request/:userId',
                loader: redirectToChats,
                action: addFriendAction,
            },
            {
                path: '/handle-friend-request/:userId',
                loader: redirectToChats,
                action: handleFriendRequestAction,
            },
            {
                path: '/remove-from-deny/:userId',
                loader: redirectToChats,
                action: removeFromDenyAction,
            },
            {
                path: '/delete-friend/:userId',
                loader: redirectToChats,
                action: deleteFriendAction,
            },
        ],
    },
]);
export default router;
