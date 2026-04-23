import { useContext } from 'react';
import ChatHighlight from '../../../utilities/context/ChatHighlight';

import ChatPanelMainMessages from './ChatPanelMainMessages';
import ChatPanelViewMore from './ChatPanelViewMore';

import FormLoader from '../../../utilities/miscComponents/FormLoader';

import { CircleX } from 'lucide-react';

import './stylesheets/ChatPanelMain.css';

function ChatsMainAlt() {
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

export default function ChatPanelMain({ scrollRef, preserveScrollOnChange }) {
    const { currentChatData } = useContext(ChatHighlight);

    const messages = currentChatData?.messages;
    const more = currentChatData?.more;

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
                <ChatsMainAlt />
            )}
        </div>
    );
}
