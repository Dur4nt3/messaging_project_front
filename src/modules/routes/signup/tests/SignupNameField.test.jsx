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

describe('Test suite for the name field within the signup form', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    // This test will fail if a "fetch" is executed
    // This also serves to test the fact that a fetch isn't sent unless all fields are valid
    it('Can properly validate the name field', async () => {
        const { user } = renderApp(buildRoutes(), null, memoryRouterOptions);
        await waitFor(() => screen.getByRole('form'));

        const signupForm = screen.getByRole('form');
        const nameField = within(signupForm).getByLabelText(/^name$/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        // Empty field
        await user.click(submitButton);
        expect(
            within(signupForm).getByText(/^name must not be empty$/i)
        ).toBeInTheDocument();

        // Too short
        await user.type(nameField, '1');
        await user.click(submitButton);
        expect(
            within(signupForm).getByText(
                /^name must be between 3 and 30 characters$/i
            )
        ).toBeInTheDocument();

        await user.clear(nameField);
        expect(nameField).toHaveValue('');

        // Too long (anything past 30 characters is redacted)
        await user.type(nameField, '012345678901234567890123456789null');
        expect(nameField).toHaveValue('012345678901234567890123456789');

        await user.clear(nameField);
        expect(nameField).toHaveValue('');

        // Not matching regex
        await user.type(nameField, 'Test!');
        await user.click(submitButton);
        expect(
            within(signupForm).getByText(
                'Name must only contain letters and numbers'
            )
        ).toBeInTheDocument();

        await user.clear(nameField);
        expect(nameField).toHaveValue('');

        // Valid name
        await user.type(nameField, 'Test');
        await user.click(submitButton);

        // name field should be error-free
        expect(
            within(signupForm).queryByTestId('name-inline-error')
        ).not.toBeInTheDocument();
    });
});
