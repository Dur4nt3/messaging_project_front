import { useState, useContext, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import ChatsModal from '../../utilities/context/ChatsModal';
import IsMobile from '../../utilities/context/IsMobile';
import useFetchChatData from '../../utilities/hooks/useFetchChatData';

import getUserInitials from '../../utilities/formatters/getUserInitials';

import ChatsRouteModals from './ChatsRouteModals';

import ChatsNav from './header/ChatsNav';
import ChatsMain from './ChatsMain';
import ChatList from './ChatList';
import ChatPanel from './ChatPanel';
import ChatsFooter from './footer/ChatsFooter';

export default function Chats() {
    const { currentChatModal, openModal, setRefresher } =
        useContext(ChatsModal);
    const { currentlyMobile } = useContext(IsMobile);

    const {
        fetchChatDataRunner,
        fetchingChatData,
        currentChatData,
        setCurrentChatData,
    } = useFetchChatData();

    const loaderData = useLoaderData();
    const user = loaderData?.user;
    const dashboardChatData = loaderData?.chats;

    const [highlightedChat, setHighlightedChat] = useState(null);

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

    function handleChatHighlight(chatId) {
        if (fetchingChatData) {
            return;
        }

        setHighlightedChat(chatId);

        if (chatId === null) {
            setCurrentChatData(null);
            return;
        }

        if (currentlyMobile) {
            openModal('CHAT_WINDOW', null);
        }

        fetchChatDataRunner(chatId);
        setRefresher(() => fetchChatDataRunner);
    }

    return (
        <>
            <ChatsRouteModals />
            <ChatsNav userInitials={getUserInitials(user.name)} />
            <ChatsMain>
                <ChatList
                    activeChats={dashboardChatData}
                    highlightedChat={highlightedChat}
                    handleChatHighlight={handleChatHighlight}
                />
                {!currentlyMobile ? (
                    <ChatPanel
                        data={currentChatData}
                        loading={fetchingChatData}
                    />
                ) : null}
            </ChatsMain>
            <ChatsFooter />
        </>
    );
}
