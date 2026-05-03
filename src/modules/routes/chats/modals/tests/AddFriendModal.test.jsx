import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

import renderApp from '../../../../../../tests/utilities/renderApp';
import mockFetches from '../../../../../../tests/utilities/mockFetches';
import { stalledFetch } from '../../../../../../tests/utilities/stalledFetch';
import { mockAddFriend } from '../../../../../../tests/utilities/mockFriendship';
import openMenuAndGetButton from '../../../../../../tests/utilities/openMenuAndGetButton';

import { get200 } from '../../../../../../tests/utilities/serverResponses';

import AppShell from '../../../../../AppShell';

import ErrorPage from '../../../error/ErrorPage';

import ChatsRouteModals from '../../ChatsRouteModals';
import ChatsFooter from '../../footer/ChatsFooter';

import addFriendAction from '../../../../utilities/actions/addFriendAction';

const buildRoutes = () => [
    {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/chats',
                element: (
                    <>
                        <ChatsRouteModals />
                        <ChatsFooter />
                    </>
                ),
            },
            {
                path: '/send-friend-request/:userId',
                action: addFriendAction,
            },
        ],
    },
];

const memoryRouterOptions = {
    initialEntries: ['/chats'],
    initialIndex: 0,
};

describe('Test suite for the add friends modal', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('Can open the add friends modal', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /add friends/i);

        stalledFetch();

        await user.click(button);

        const addFriendsModal = screen.getByRole('dialog');

        expect(
            within(addFriendsModal).getByRole('heading', {
                name: /add friends/i,
            })
        );
        expect(
            within(addFriendsModal).getByRole('heading', {
                name: /find friends/i,
            })
        );
        expect(
            within(addFriendsModal).getByText(
                /search by username above and add new friends/i
            )
        );
    });

    it('Can search within the modal', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /add friends/i);

        mockFetches(
            get200({
                type: 'ADD_FRIEND',
                friendships: [
                    mockAddFriend(
                        1,
                        'test1',
                        'Test One',
                        'HUMAN',
                        null,
                        'test'
                    ),
                    mockAddFriend(
                        2,
                        'test2',
                        'Test Two',
                        'HUMAN',
                        'PENDING',
                        'test'
                    ),
                    mockAddFriend(
                        3,
                        'test3',
                        'Test Three',
                        'HUMAN',
                        'ACCEPTED',
                        'test'
                    ),
                    mockAddFriend(
                        4,
                        'test4',
                        'Test Four',
                        'HUMAN',
                        'DENIED',
                        'test'
                    ),
                    mockAddFriend(5, 'test5', 'Test Five', 'BOT', null, 'test'),
                ],
            }),
            get200({
                type: 'ADD_FRIEND',
                friendships: [],
            })
        );

        await user.click(button);

        const addFriendsModal = screen.getByRole('dialog');

        const searchBar = within(addFriendsModal).getByRole('textbox');

        await user.type(searchBar, 'test{Enter}');

        // Renders correctly
        const test1Action =
            await within(addFriendsModal).findByTestId('action-on-1');
        const test2Action = within(addFriendsModal).getByTestId('action-on-2');
        const test3Action = within(addFriendsModal).getByTestId('action-on-3');
        const test4Action = within(addFriendsModal).getByTestId('action-on-4');
        const test5Action = within(addFriendsModal).getByTestId('action-on-5');

        // Correct actions for each result
        expect(
            within(test1Action).getByRole('button', {
                name: /send friend request/i,
            })
        ).toBeInTheDocument();
        expect(
            within(addFriendsModal).getByLabelText(
                /A friend request to this user already exists/i
            )
        ).toEqual(test2Action);
        expect(
            within(addFriendsModal).getByLabelText(
                /You are already a friend of this user/i
            )
        ).toEqual(test3Action);
        expect(
            within(addFriendsModal).getByLabelText(/You blocked this user/i)
        ).toEqual(test4Action);
        expect(
            within(test5Action).getByRole('button', {
                name: /send friend request/i,
            })
        ).toBeInTheDocument();

        // Bot has clear indication
        const botRow = within(addFriendsModal).getByText('test5');
        expect(
            within(botRow.parentNode).getByTestId('bot-account')
        ).toBeInTheDocument();

        await user.clear(searchBar);
        await user.type(searchBar, 'nothing{Enter}');

        // Clear indication of no results
        expect(
            within(addFriendsModal).getByRole('heading', {
                name: /no matches found/i,
            })
        );
        expect(
            within(addFriendsModal).getByText(
                /we couldn't find any users with that name. try again with a different term./i
            )
        );
    });

    it('Can receive errors when adding a user', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /add friends/i);

        mockFetches(
            get200({
                type: 'ADD_FRIEND',
                friendships: [
                    mockAddFriend(
                        1,
                        'test1',
                        'Test One',
                        'HUMAN',
                        null,
                        'test'
                    ),
                ],
            }),
            get200({
                success: false,
            })
        );

        await user.click(button);

        const addFriendsModal = screen.getByRole('dialog');

        const searchBar = within(addFriendsModal).getByRole('textbox');

        await user.type(searchBar, 'test{Enter}');

        const sendRequest = await screen.findByRole('button', {
            name: /send friend request/i,
        });

        await user.click(sendRequest);

        await waitFor(() =>
            expect(
                within(addFriendsModal).getByTestId('request-denied-error')
            ).toBeInTheDocument()
        );
    });

    it('Can add friends via the modal', async () => {
        const { user } = renderApp(buildRoutes(), true, memoryRouterOptions);
        await waitFor(() => screen.getByRole('contentinfo'));

        const { button } = await openMenuAndGetButton(user, /add friends/i);

        mockFetches(
            get200({
                type: 'ADD_FRIEND',
                friendships: [
                    mockAddFriend(
                        1,
                        'test1',
                        'Test One',
                        'HUMAN',
                        null,
                        'test'
                    ),
                ],
            }),
            get200({
                success: true,
            }),
            get200({
                type: 'ADD_FRIEND',
                friendships: [
                    mockAddFriend(
                        1,
                        'test1',
                        'Test One',
                        'HUMAN',
                        'ACCEPTED',
                        'test'
                    ),
                ],
            })
        );

        await user.click(button);

        const addFriendsModal = screen.getByRole('dialog');

        const searchBar = within(addFriendsModal).getByRole('textbox');

        await user.type(searchBar, 'test{Enter}');

        const sendRequest = await screen.findByRole('button', {
            name: /send friend request/i,
        });

        await user.click(sendRequest);

        const changed = await within(addFriendsModal).findByLabelText(
            /You are already a friend of this user/i
        );
        expect(changed).toBeInTheDocument();
    });
});
