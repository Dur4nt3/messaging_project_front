import { useContext, useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import ChatsModal from '../../../utilities/context/ChatsModal';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { Check, X, Minus, CloudAlert } from 'lucide-react';

function ActionInner({ sent, fetcherState, lastClick, setLastClick }) {
    if (!sent) {
        return (
            <>
                <button
                    type='submit'
                    name='intent'
                    value='accepted'
                    className='reply-to-request accept'
                    aria-label='Accept friend request'
                    onClick={() => setLastClick('accept')}
                    disabled={fetcherState !== 'idle'}
                >
                    {fetcherState !== 'idle' && lastClick === 'accept' ? (
                        <FormLoader type='dots' size={14} />
                    ) : (
                        <Check strokeWidth={1.5} />
                    )}
                </button>

                <button
                    type='submit'
                    name='intent'
                    value='denied'
                    className='reply-to-request deny'
                    aria-label='Deny friend request'
                    onClick={() => setLastClick('deny')}
                    disabled={fetcherState !== 'idle'}
                >
                    {fetcherState !== 'idle' && lastClick === 'deny' ? (
                        <FormLoader type='dots' size={14} />
                    ) : (
                        <X strokeWidth={1.5} />
                    )}
                </button>
            </>
        );
    }

    return (
        <>
            <span className='pending-indicator'>Pending</span>

            <button
                type='submit'
                name='intent'
                value='deleted'
                className='reply-to-request delete'
                aria-label='Undo friend request'
                onClick={() => setLastClick('delete')}
                disabled={fetcherState !== 'idle'}
            >
                {fetcherState !== 'idle' && lastClick === 'delete' ? (
                    <FormLoader type='dots' size={14} />
                ) : (
                    <Minus strokeWidth={1.5} />
                )}
            </button>
        </>
    );
}

export default function FriendRequestsAction({ data }) {
    const { runRefresher } = useContext(ChatsModal);

    const [lastClick, setLastClick] = useState(null);

    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success === true) {
            runRefresher('FRIEND_REQUEST');
        }
    }, [fetcher.state, fetcher.data, runRefresher]);

    if (fetcher.data?.success === false) {
        return (
            <div className='request-denied error' data-testid='request-denied-error'>
                <CloudAlert strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <fetcher.Form
            action={`/handle-friend-request/${data.sent ? data.receiverId : data.senderId}`}
            method='PATCH'
            className='reply-to-request-form'
        >
            <ActionInner
                sent={data.sent}
                fetcherState={fetcher.state}
                lastClick={lastClick}
                setLastClick={setLastClick}
            />
        </fetcher.Form>
    );
}
