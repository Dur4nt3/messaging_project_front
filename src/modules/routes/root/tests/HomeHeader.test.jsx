import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../tests/utilities/mockFetches';

import { error401 } from '../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../AppShell';

import ErrorPage from '../../error/ErrorPage';

import HomeHeader from '../HomeHeader';
import Login from '../../login/Login';
import Signup from '../../signup/Signup';

import loginLoader from '../../../utilities/loaders/loginLoader';

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
            },
            {
                path: '/login',
                element: <Login />,
                loader: loginLoader,
            },
        ],
    },
];

describe('Test suite for the homepage header', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the header', async () => {
        const { container } = renderApp(buildRoutes());
        await waitFor(() => screen.getByRole('banner'));

        expect(container).toMatchSnapshot();
    });

    it('Can navigate the user to the signup page', async () => {
        const { user, router } = renderApp(buildRoutes());
        await waitFor(() => screen.getByRole('banner'));

        const signupLink = screen.getByRole('link', { name: /get started/i });
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
        await waitFor(() => screen.getByRole('banner'));

        mockFetches({ ...error401 });

        const loginLink = screen.getByRole('link', { name: /log in/i });
        await user.click(loginLink);

        await waitFor(() =>
            expect(router.state.location.pathname).toBe('/login')
        );

        const loginForm = screen.getByRole('form');
        expect(loginForm).toBeInTheDocument();

        expect(
            within(loginForm).getByRole('heading', { name: /log in/i })
        ).toBeInTheDocument();
    });
});
