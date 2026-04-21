import { useContext, useEffect } from 'react';
import { useFetcher } from 'react-router';
import ChatsModal from '../../../utilities/context/ChatsModal';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { UserPlus, Check, Clock, CircleSlash, CloudAlert } from 'lucide-react';

export default function AddFriendAction({ data }) {
    const { runRefresher } = useContext(ChatsModal);
    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success === true) {
            runRefresher('ADD_FRIEND', data?.searchTerm || null);
        }
    }, [fetcher.state, fetcher.data, runRefresher, data?.searchTerm]);

    if (fetcher.data?.success === false) {
        return (
            <div className='request-denied error' aria-label='Could not send the request'>
                <CloudAlert strokeWidth={1.5} />
            </div>
        );
    }

    if (data?.status === 'ACCEPTED') {
        return (
            <div className='already-friends' aria-label='You are already a friend of this user'>
                <Check strokeWidth={1.5} />
            </div>
        );
    }

    if (data?.status === 'PENDING') {
        return (
            <div className='request-pending' aria-label='A friend request to this user already exists'>
                <Clock strokeWidth={1.5} />
            </div>
        );
    }

    if (data?.status === 'DENIED') {
        return (
            <div className='request-denied' aria-label='You blocked this user'>
                <CircleSlash strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <fetcher.Form
            action={`/send-friend-request/${data.userId}`}
            method='POST'
        >
            <button
                type='submit'
                className='send-friend-request'
                aria-label='Send friend request'
                disabled={fetcher.state !== 'idle'}
            >
                {fetcher.state === 'idle' ? (
                    <UserPlus strokeWidth={1.5} />
                ) : (
                    <FormLoader type='dots' size={14} />
                )}
            </button>
        </fetcher.Form>
    );
}
