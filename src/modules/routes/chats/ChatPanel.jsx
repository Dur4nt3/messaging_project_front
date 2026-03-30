import { useState } from 'react';

import useChatScroll from '../../utilities/hooks/useChatScroll';

import ChatPanelHeader from './panel/ChatPanelHeader';
import ChatPanelMain from './panel/ChatPanelMain';
import ChatPanelInput from './panel/ChatPanelInput';

import ScrollToChatBottom from './panel/ScrollToChatBottom';

import './stylesheets/ChatPanel.css';

function ChatNotSelected() {
    return (
        <div className='chat-not-selected'>
            <p className='not-selected-label'>No chat selected</p>
            <p className='not-selected-sub'>
                Pick a chat from the list to get started.
            </p>
        </div>
    );
}

export default function ChatPanel({ data }) {
    const [inputHeight, setInputHeight] = useState(0);

    const scrollThreshold = 200;

    const {
        scrollRef,
        showScrollButton,
        scrollToBottom,
        preserveScrollOnChange,
    } = useChatScroll(data?.messages, scrollThreshold);

    if (!data) {
        return (
            <div className='chat-panel'>
                <ChatNotSelected />
            </div>
        );
    }

    return (
        <div className='chat-panel'>
            <ChatPanelHeader
                recipientName={data !== false ? data?.name : false}
            />
            <ChatPanelMain
                messages={data !== false ? data?.messages : false}
                more={data !== false ? data?.more : false}
                preserveScrollOnChange={preserveScrollOnChange}
                scrollRef={scrollRef}
            />
            <ChatPanelInput
                loaded={!!data}
                setInputHeight={setInputHeight}
                preserveScrollOnChange={preserveScrollOnChange}
                data={data}
            />
            {showScrollButton && (
                <ScrollToChatBottom
                    inputHeight={inputHeight}
                    scrollToBottom={scrollToBottom}
                />
            )}
        </div>
    );
}
