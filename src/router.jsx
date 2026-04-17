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
import deleteChatAction from './modules/utilities/actions/deleteChatAction';
import sendMessageAction from './modules/utilities/actions/sendMessageAction';

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
                path: '/logout',
                loader: redirectToChats,
                action: logoutAction,
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
        ],
    },
]);
export default router;
