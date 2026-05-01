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

import HomeNav from '../HomeNav';
import Login from '../../login/Login';
import Signup from '../../signup/Signup';
import Chats from '../../chats/Chats';

import loginLoader from '../../../utilities/loaders/loginLoader';
import chatsLoader from '../../../utilities/loaders/chatsLoader';

const buildRoutes = (auth) => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <HomeNav auth={auth} />,
            },
            {
                path: '/signup',
                element: <Signup />,
            },
            {
                path: '/login',
                element: <Login />,
                loader: loginLoader,
            },
            {
                path: '/chats',
                element: <Chats />,
                loader: chatsLoader,
            },
        ],
    },
];

describe('Test suite for the homepage navbar', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Contains signup and login links when the user is not authenticated', async () => {
        renderApp(buildRoutes(false));
        await waitFor(() => screen.getByRole('navigation'));

        expect(
            screen.getByRole('link', { name: /sign up/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /log in/i })
        ).toBeInTheDocument();
    });

    it('Contains chat navigation when the user is authenticated', async () => {
        renderApp(buildRoutes(true));
        await waitFor(() => screen.getByRole('navigation'));

        expect(
            screen.getByRole('link', { name: /your chats/i })
        ).toBeInTheDocument();
    });

    it('Can navigate the user to the signup page', async () => {
        const { user, router } = renderApp(buildRoutes(false));
        await waitFor(() => screen.getByRole('navigation'));

        const signupLink = screen.getByRole('link', { name: /sign up/i });
        await user.click(signupLink);

        expect(router.state.location.pathname).toBe('/signup');

        const signupForm = screen.getByRole('form');
        expect(signupForm).toBeInTheDocument();

        expect(
            within(signupForm).getByRole('heading', { name: /sign up/i })
        ).toBeInTheDocument();
    });

    it('Can navigate the user to the login page (not authenticated)', async () => {
        const { user, router } = renderApp(buildRoutes(false));
        await waitFor(() => screen.getByRole('navigation'));

        mockFetches({ ...error401 });

        const loginLink = screen.getByRole('link', { name: /log in/i });
        await user.click(loginLink);

        expect(router.state.location.pathname).toBe('/login');

        const loginForm = screen.getByRole('form');
        expect(loginForm).toBeInTheDocument();

        expect(
            within(loginForm).getByRole('heading', { name: /log in/i })
        ).toBeInTheDocument();
    });

    // Because the root loader just checks for a token
    // A user can have a token but not be authenticated
    it('Can navigate the user to the chats page (not authenticated, redirected to error page)', async () => {
        const { user, router } = renderApp(buildRoutes(true));
        await waitFor(() => screen.getByRole('navigation'));

        mockFetches({ ...error401 }, { ...error401 });

        const chatsButton = screen.getByRole('link', { name: /your chats/i });
        await user.click(chatsButton);

        // Initially navigate to /chats
        expect(router.state.location.pathname).toBe('/chats');

        // Get redirected to the error page
        await waitFor(() => screen.getByRole('heading', { name: /401/i }));
        expect(
            screen.getByRole('heading', { name: /unauthorized/i })
        ).toBeInTheDocument();
    });

    it('Can navigate the user to the chats page (authenticated, dashboard renders)', async () => {
        const { user, router } = renderApp(buildRoutes(true), true);
        await waitFor(() => screen.getByRole('navigation'));

        const userData = { username: 'test', name: 'Test' };

        const chatData = { data: [] };

        mockFetches(get200(userData), get200(chatData));

        const chatsButton = screen.getByRole('link', { name: /your chats/i });
        await user.click(chatsButton);

        expect(router.state.location.pathname).toBe('/chats');

        await waitFor(() =>
            screen.getByRole('heading', { name: /no chats yet/i })
        );
        await waitFor(() => screen.getByText(/no chat selected/i));
    });
});
