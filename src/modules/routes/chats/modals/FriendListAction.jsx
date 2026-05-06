import { useContext, useEffect } from 'react';
import ChatsModal from '../../../utilities/context/ChatsModal';
import ChatHighlight from '../../../utilities/context/ChatHighlight';

import { Form, useFetcher } from 'react-router';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { MessageSquare, UserMinus, CloudAlert } from 'lucide-react';

export default function FriendListAction({ data }) {
    const { runRefresher, closeModal } = useContext(ChatsModal);
    const { handleChatHighlight } = useContext(ChatHighlight);

    const openChatFetcher = useFetcher();
    const removeFriendFetcher = useFetcher();

    const disableButtons =
        openChatFetcher.state !== 'idle' ||
        removeFriendFetcher.state !== 'idle';

    useEffect(() => {
        if (
            removeFriendFetcher.state === 'idle' &&
            removeFriendFetcher.data?.success === true
        ) {
            runRefresher('FRIEND_LIST', data?.searchTerm || null);
        }
    }, [
        removeFriendFetcher.state,
        removeFriendFetcher.data,
        runRefresher,
        data?.searchTerm,
    ]);

    useEffect(() => {
        if (
            openChatFetcher.state === 'idle' &&
            openChatFetcher.data?.success === true
        ) {
            closeModal();
            handleChatHighlight(openChatFetcher.data.chatId);
        }
    }, [
        openChatFetcher.state,
        openChatFetcher.data,
        handleChatHighlight,
        closeModal,
    ]);

    if (
        removeFriendFetcher.data?.success === false ||
        openChatFetcher.data?.success === false
    ) {
        return (
            <div
                className='request-denied error'
                aria-label='Could not send the request'
                data-testid='request-denied-error'
            >
                <CloudAlert strokeWidth={1.5} />
            </div>
        );
    }

    return (
        <div className='friend-list-action-forms'>
            <openChatFetcher.Form
                method='POST'
                action={`/open-chat/${data.sent ? data.receiverId : data.senderId}`}
            >
                <button className='open-chat-button' disabled={disableButtons} aria-label={`open chat with ${data.name}`}>
                    {openChatFetcher.state === 'idle' ? (
                        <MessageSquare strokeWidth={1.5} />
                    ) : (
                        <FormLoader type='dots' size={14} />
                    )}
                </button>
            </openChatFetcher.Form>

            <removeFriendFetcher.Form
                method='DELETE'
                action={`/delete-friend/${data.sent ? data.receiverId : data.senderId}`}
            >
                <button
                    className='remove-friend-button'
                    disabled={disableButtons}
                    aria-label={`remove ${data.name} from friend list`}
                >
                    {removeFriendFetcher.state === 'idle' ? (
                        <UserMinus strokeWidth={1.5} />
                    ) : (
                        <FormLoader type='dots' size={14} />
                    )}
                </button>
            </removeFriendFetcher.Form>
        </div>
    );
}
