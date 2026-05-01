import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';

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

describe('Test suite for the confirm password field within the signup form', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // This test will fail if a "fetch" is executed
    // This also serves to test the fact that a fetch isn't sent unless all fields are valid
    it('Can properly validate the username field', async () => {
        const { user } = renderApp(buildRoutes(), null, memoryRouterOptions);
        await waitFor(() => screen.getByRole('form'));

        const signupForm = screen.getByRole('form');
        const cPasswordField =
            within(signupForm).getByLabelText(/^confirm password$/i);
        const passwordField = within(signupForm).getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        // Empty field
        await user.click(submitButton);
        expect(
            within(signupForm).getByText(
                /Password confirmation must not be empty/i
            )
        ).toBeInTheDocument();

        // Not matching
        await user.type(passwordField, '12345678');
        await user.type(cPasswordField, '87654321');
        await user.click(submitButton);
        expect(
            within(signupForm).getByText(
                /passwords do not match/i
            )
        ).toBeInTheDocument();

        await user.clear(passwordField);
        await user.clear(cPasswordField);
        expect(passwordField).toHaveValue('');
        expect(cPasswordField).toHaveValue('');

        // Valid passwords
        await user.type(passwordField, 'qw12qw34');
        await user.type(cPasswordField, 'qw12qw34');
        await user.click(submitButton);

        // Password field and confirm password field should be error-free
        expect(
            within(signupForm).queryByTestId('password-inline-error')
        ).not.toBeInTheDocument();
        expect(
            within(signupForm).queryByTestId('cpassword-inline-error')
        ).not.toBeInTheDocument();
    });
});
