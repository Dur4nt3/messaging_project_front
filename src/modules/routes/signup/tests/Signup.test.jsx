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

import loginLoader from '../../../utilities/loaders/loginLoader';

import signupAction from '../../../utilities/actions/signupAction';

// I've decided to split up the tests to make them more readable

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
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/signup'],
    initialIndex: 0,
};

describe('Test suite for the signup form', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the form', async () => {
        const { container } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        expect(container).toMatchSnapshot();
    });

    it('Can navigate back home via the return button', async () => {
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

    it('Can navigate to the login page via the form', async () => {
        const { user, router } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        mockFetches({ ...error401 });

        const loginLink = screen.getByRole('link', { name: /log in./i });
        await user.click(loginLink);

        expect(router.state.location.pathname).toBe('/login');

        expect(
            screen.getByRole('heading', { name: /Log in/i })
        ).toBeInTheDocument();
    });

    it('Can signup', async () => {
        const { user, router } = renderApp(
            buildRoutes(),
            null,
            memoryRouterOptions
        );
        await waitFor(() => screen.getByRole('form'));

        mockFetches(get200({ success: true }), { ...error401 });

        const signupForm = screen.getByRole('form');

        const usernameField = within(signupForm).getByLabelText(/username/i);
        const nameField = within(signupForm).getByLabelText(/^name$/i);
        const passwordField = within(signupForm).getByLabelText(/^password$/i);
        const cPasswordField =
            within(signupForm).getByLabelText(/^confirm password$/i);

        const submitButton = screen.getByRole('button', { name: /sign up/i });

        await user.type(usernameField, 'test');
        await user.type(nameField, 'Test');
        await user.type(passwordField, 'qw12qw34');
        await user.type(cPasswordField, 'qw12qw34');

        await user.click(submitButton);

        expect(router.state.location.pathname).toBe('/login');
        expect(
            screen.getByRole('heading', { name: /Log in/i })
        ).toBeInTheDocument();
    });
});
