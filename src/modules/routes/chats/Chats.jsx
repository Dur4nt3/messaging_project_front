import { useContext } from 'react';
import ChatsModal from '../../utilities/context/ChatsModal';
import IsMobile from '../../utilities/context/IsMobile';
import ChatHighlight from '../../utilities/context/ChatHighlight';

import { useLoaderData } from 'react-router';

import getUserInitials from '../../utilities/formatters/getUserInitials';

import ChatsRouteModals from './ChatsRouteModals';

import ChatsNav from './header/ChatsNav';
import ChatsMain from './ChatsMain';
import ChatList from './ChatList';
import ChatPanel from './ChatPanel';
import ChatsFooter from './footer/ChatsFooter';

export default function Chats() {
    const { currentlyMobile } = useContext(IsMobile);

    const {
        highlightedChat,
        handleChatHighlight,
        fetchingChatData,
        currentChatData,
    } = useContext(ChatHighlight);

    const loaderData = useLoaderData();
    const user = loaderData?.user;
    const dashboardChatData = loaderData?.chats;

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
