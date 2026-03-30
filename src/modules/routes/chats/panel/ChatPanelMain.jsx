import ChatPanelMainMessages from './ChatPanelMainMessages';
import ChatPanelViewMore from './ChatPanelViewMore';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { CircleX } from 'lucide-react';

import './stylesheets/ChatPanelMain.css';

function ChatsMainAlt({ error }) {
    if (error) {
        return (
            <div className='loading-state'>
                <CircleX strokeWidth={1.5} className='error-icon' />
                <p className='loading-label'>Failed to fetch chat</p>
                <p className='loading-description'>
                    An unexpected error occurred.
                </p>
                <p className='loading-description'>
                    Exit the chat and try again.
                </p>
            </div>
        );
    }

    return (
        <div className='loading-state'>
            <FormLoader color='#00c2a8' size={48} />
            <p className='loading-label'>Fetching chat data</p>
            <p className='loading-description'>
                This should only take a moment.
            </p>
        </div>
    );
}

export default function ChatPanelMain({
    messages,
    scrollRef,
    more,
    preserveScrollOnChange,
}) {
    return (
        <div className='chat-panel-main' ref={scrollRef}>
            {more && (
                <ChatPanelViewMore
                    chatId={messages[0].chatId}
                    firstMessageId={messages[0].messageId}
                    preserveScrollOnChange={preserveScrollOnChange}
                />
            )}
            {messages ? (
                <ChatPanelMainMessages messages={messages} />
            ) : (
                <ChatsMainAlt error={messages === false} />
            )}
        </div>
    );
}
