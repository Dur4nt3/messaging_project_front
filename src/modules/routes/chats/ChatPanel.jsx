import { useState, useContext } from 'react';
import ChatHighlight from '../../utilities/context/ChatHighlight';

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

export default function ChatPanel() {
    const { fetchingChatData, currentChatData } = useContext(ChatHighlight);

    const [inputHeight, setInputHeight] = useState(0);

    const scrollThreshold = 200;

    const {
        scrollRef,
        showScrollButton,
        scrollToBottom,
        preserveScrollOnChange,
    } = useChatScroll(currentChatData?.messages, scrollThreshold);

    if (!currentChatData && !fetchingChatData) {
        return (
            <div className='chat-panel'>
                <ChatNotSelected />
            </div>
        );
    }

    return (
        <div className='chat-panel'>
            <ChatPanelHeader />
            <ChatPanelMain
                preserveScrollOnChange={preserveScrollOnChange}
                scrollRef={scrollRef}
            />
            <ChatPanelInput
                setInputHeight={setInputHeight}
                preserveScrollOnChange={preserveScrollOnChange}
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
