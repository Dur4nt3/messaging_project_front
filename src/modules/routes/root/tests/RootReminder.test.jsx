import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import renderApp from '../../../../../tests/utilities/renderApp';

import AppShell from '../../../../AppShell';

import ErrorPage from '../../error/ErrorPage';

import AppOverview from '../AppOverview';
import HomeFooter from '../HomeFooter';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: (
                    <>
                        <AppOverview />
                        <HomeFooter />
                    </>
                ),
            },
        ],
    },
];

// The remaining elements don't have any meaningful functionality
// This is just a snapshot test to ensure content is as expected
describe('Test Suite For The Remaining Elements In Root', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Renders the remaining elements', async () => {
        const { container } = renderApp(buildRoutes());
        // This is the footer
        await waitFor(() => screen.getByRole('contentinfo'));

        expect(container).toMatchSnapshot();
    });
});
