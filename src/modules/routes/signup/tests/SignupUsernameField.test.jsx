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

describe('Test suite for the username field within the signup form', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // This test will fail if a "fetch" is executed
    // This also serves to test the fact that a fetch isn't sent unless all fields are valid
    it('Can properly validate the username field', async () => {
        const { user } = renderApp(buildRoutes(), null, memoryRouterOptions);
        await waitFor(() => screen.getByRole('form'));

        const signupForm = screen.getByRole('form');
        const usernameField = within(signupForm).getByLabelText(/username/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        // Empty field
        await user.click(submitButton);
        await waitFor(() =>
            expect(
                within(signupForm).getByText(/username must not be empty/i)
            ).toBeInTheDocument()
        );

        // Too short
        await user.type(usernameField, '1');
        await user.click(submitButton);
        await waitFor(() =>
            expect(
                within(signupForm).getByText(
                    /username must be between 3 and 30 characters/i
                )
            ).toBeInTheDocument()
        );

        await user.clear(usernameField);
        expect(usernameField).toHaveValue('');

        // Too long (anything past 30 characters is redacted)
        await user.type(usernameField, '012345678901234567890123456789null');
        expect(usernameField).toHaveValue('012345678901234567890123456789');

        await user.clear(usernameField);
        expect(usernameField).toHaveValue('');

        // Not matching regex
        await user.type(usernameField, 'Test!');
        await user.click(submitButton);
        await waitFor(() =>
            expect(
                within(signupForm).getByText(
                    'Username must only contain letters and numbers (lowercase only)'
                )
            ).toBeInTheDocument()
        );

        await user.clear(usernameField);
        expect(usernameField).toHaveValue('');

        // Valid username
        await user.type(usernameField, 'test');
        await user.click(submitButton);

        // Username field should be error-free
        await waitFor(() =>
            expect(
                within(signupForm).queryByTestId('username-inline-error')
            ).not.toBeInTheDocument()
        );
    });
});
