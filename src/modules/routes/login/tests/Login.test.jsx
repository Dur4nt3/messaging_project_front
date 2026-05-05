import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../tests/utilities/mockFetches';

import {
    error401,
    get200,
} from '../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../AppShell';

import ErrorPage from '../../error/ErrorPage';

import HomeHeader from '../../root/HomeHeader';
import Login from '../../login/Login';
import Signup from '../../signup/Signup';
import Chats from '../../chats/Chats';

import loginLoader from '../../../utilities/loaders/loginLoader';
import chatsLoader from '../../../utilities/loaders/chatsLoader';

import signupAction from '../../../utilities/actions/signupAction';
import loginAction from '../../../utilities/actions/loginAction';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomeHeader />,
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
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/login'],
    initialIndex: 0,
};

describe('Test suite for the login form', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the form', async () => {
        mockFetches({ ...error401 });

        const { container } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        expect(container).toMatchSnapshot();
    });

    it('Can navigate back home via the return button', async () => {
        mockFetches({ ...error401 });

        const { user, router } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        const returnHome = screen.getByRole('link', { name: /home/i });
        await user.click(returnHome);

        expect(router.state.location.pathname).toBe('/');

        expect(
            screen.getByRole('heading', { name: /talk fast. stay close./i })
        ).toBeInTheDocument();
    });

    it('Can navigate to the signup page via the form', async () => {
        mockFetches({ ...error401 });

        const { user, router } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        const signupLink = screen.getByRole('link', { name: /sign up./i });
        await user.click(signupLink);

        expect(router.state.location.pathname).toBe('/signup');

        expect(
            screen.getByRole('heading', { name: /sign up/i })
        ).toBeInTheDocument();
    });

    it('Can redirect the user to the chats page if they are already authenticated', async () => {
        const userData = { username: 'test', name: 'Test' };
        const chatData = { data: [] };

        // 1 - loginLoader 2 - chatsLoader 3 - chatsLoader
        mockFetches(get200(userData), get200(userData), get200(chatData));

        const { router } = renderApp(buildRoutes(), true, memoryRouterOptions);

        // The login doesn't have a navigation
        // The chats page does, when this passed we are in "/chats"
        await waitFor(() => screen.getByRole('navigation'));

        expect(router.state.location.pathname).toBe('/chats');

        await waitFor(() =>
            screen.getByRole('heading', { name: /no chats yet/i })
        );
        await waitFor(() => screen.getByText(/no chat selected/i));
    });

    it('Can invalidate logins', async () => {
        mockFetches({ ...error401 }, { ...error401 });

        const { user } = renderApp(buildRoutes(), null, memoryRouterOptions);

        await waitFor(() => screen.getByRole('form'));

        const loginForm = await waitFor(() => screen.getByRole('form'));
        const submitButton = screen.getByRole('button', { name: /log in/i });

        // Note: because the validation for the login is entirely server-side
        // it doesn't really matter whether the inputs are populated or not
        // as the response is mocked either way

        await user.click(submitButton);

        await waitFor(() =>
            expect(within(loginForm).getByText(/invalid credentials!/i))
        );
    });

    it('Can properly login', async () => {
        const userData = { username: 'test', name: 'Test' };

        const chatData = { data: [] };

        // 1 - loginLoader 2 - loginAction 3 - chatsLoader 4 - chatsLoader
        mockFetches(
            { ...error401 },
            get200({ success: true }),
            get200(userData),
            get200(chatData)
        );

        const { user, router } = renderApp(
            buildRoutes(),
            true,
            memoryRouterOptions
        );

        await waitFor(() => screen.getByRole('form'));

        const submitButton = screen.getByRole('button', { name: /log in/i });

        await user.click(submitButton);

        expect(router.state.location.pathname).toBe('/chats');

        await waitFor(() =>
            screen.getByRole('heading', { name: /no chats yet/i })
        );
        await waitFor(() => screen.getByText(/no chat selected/i));
    });
});
