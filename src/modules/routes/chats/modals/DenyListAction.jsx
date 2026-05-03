import { useContext, useEffect } from 'react';
import { useFetcher } from 'react-router';
import ChatsModal from '../../../utilities/context/ChatsModal';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { Minus, CloudAlert } from 'lucide-react';

export default function DenyListAction({ data }) {
    const { runRefresher } = useContext(ChatsModal);

    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success === true) {
            runRefresher('DENY_LIST');
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
            action={`/remove-from-deny/${data.sent ? data.receiverId : data.senderId}`}
            method='PATCH'
        >
            <button
                type='submit'
                className='reply-to-request delete'
                aria-label='Remove from deny list'
                disabled={fetcher.state !== 'idle'}
            >
                {fetcher.state !== 'idle' ? (
                    <FormLoader type='dots' size={14} />
                ) : (
                    <Minus strokeWidth={1.5} />
                )}
            </button>
        </fetcher.Form>
    );
}
