import { useContext, useState, useEffect, useCallback } from 'react';
import ChatsModal from './ChatsModal';
import IsMobile from './IsMobile';
import useFetchChatData from '../hooks/useFetchChatData';

import ChatHighlight from './ChatHighlight';

export default function ChatHighlightProvider({ children }) {
    const [highlightedChat, setHighlightedChat] = useState(null);

    const { currentChatModal, openModal, setRefresher } =
        useContext(ChatsModal);
    const { currentlyMobile } = useContext(IsMobile);

    const {
        fetchChatDataRunner,
        fetchingChatData,
        currentChatData,
        setCurrentChatData,
    } = useFetchChatData();

    const handleChatHighlight = useCallback(
        (chatId) => {
            if (fetchingChatData) {
                return;
            }

            setHighlightedChat(chatId);

            if (chatId === null) {
                setCurrentChatData(null);
                setRefresher(() => () => null);
                return;
            }

            if (currentlyMobile) {
                openModal('CHAT_WINDOW', null);
            }

            fetchChatDataRunner(chatId);
            setRefresher(() => fetchChatDataRunner);
        },
        [
            currentlyMobile,
            fetchChatDataRunner,
            fetchingChatData,
            openModal,
            setCurrentChatData,
            setRefresher,
        ]
    );

    // If "currentChatData" changed
    // Assign the new value to the modal's context
    useEffect(() => {
        if (currentChatModal.modal === 'CHAT_WINDOW') {
            openModal('CHAT_WINDOW', currentChatData);
        }
    }, [currentChatData, currentChatModal.modal, openModal]);

    // Remove highlight and chat data when exiting chat modal
    useEffect(() => {
        if (currentlyMobile && currentChatModal.modal !== 'CHAT_WINDOW') {
            setCurrentChatData(null);
            setHighlightedChat(null);
        }
    }, [currentlyMobile, currentChatModal.modal, setCurrentChatData]);

    return (
        <ChatHighlight.Provider
            value={{
                highlightedChat,
                handleChatHighlight,
                fetchingChatData,
                currentChatData,
            }}
        >
            {children}
        </ChatHighlight.Provider>
    );
}
