import { useFetcher } from 'react-router';

import FormLoader from '../../utilities/miscComponents/FormLoader';

import getUserInitials from '../../utilities/formatters/getUserInitials';
import { formatDate } from '../../utilities/formatters/formatDate';

import { X } from 'lucide-react';

import './stylesheets/ChatList.css';

function ChatListItem({ chatRecord, highlighted, handleChatHighlight }) {
    const fetcher = useFetcher();

    const handleChatClick = () => {
        // Don't highlight a chat that is being removed
        if (fetcher.state !== 'idle') {
            return;
        }

        if (highlighted) {
            return handleChatHighlight(null);
        }
        return handleChatHighlight(chatRecord.chatId);
    };

    return (
        <div
            className={highlighted ? 'chat-list-item active' : 'chat-list-item'}
            onClick={handleChatClick}
            tabIndex={0}
        >
            <div className='chat-avatar'>
                {getUserInitials(chatRecord.chatParticipant.user.name)}
            </div>
            <div className='chat-data'>
                <div className='chat-data-top'>
                    <p className='recipient'>
                        {chatRecord.chatParticipant.user.name}
                    </p>
                    <p className='last-message-time'>
                        {formatDate(chatRecord.lastMessageAt, true)}
                    </p>
                </div>
                <div className='chat-data-bottom'>
                    <p className='message-preview'>
                        {chatRecord.messages.sent && 'You: '}
                        {chatRecord.messages.lastContent}
                    </p>
                    {chatRecord.messages.unread > 0 ? (
                        <p className='unread-badge'>
                            {chatRecord.messages.unread > 9
                                ? '9+'
                                : chatRecord.messages.unread}
                        </p>
                    ) : null}
                </div>
            </div>
            <fetcher.Form
                action={`/delete-chat/${chatRecord.chatId}`}
                method='DELETE'
                className='remove-chat-form'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='remove-chat'
                    disabled={fetcher.state !== 'idle'}
                    onClick={(e) => e.stopPropagation()}
                >
                    {fetcher.state === 'idle' ? (
                        <X strokeWidth={1.5} />
                    ) : (
                        <FormLoader color='#4a6078' size={14} />
                    )}
                </button>
            </fetcher.Form>
        </div>
    );
}

export default function ChatList({
    activeChats,
    highlightedChat,
    handleChatHighlight,
}) {
    if (activeChats.length === 0) {
        return (
            <div className='chat-list'>
                <h2 className='no-chats-title'>No chats yet</h2>
                <p className='no-chats-description'>
                    Message a friend to get started
                </p>
            </div>
        );
    }

    return (
        <div className='chat-list'>
            {activeChats.map((chat) => (
                <ChatListItem
                    key={chat.chatId}
                    chatRecord={chat}
                    highlighted={highlightedChat === chat.chatId}
                    handleChatHighlight={handleChatHighlight}
                />
            ))}
        </div>
    );
}
