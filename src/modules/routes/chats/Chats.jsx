import { useContext } from 'react';
import IsMobile from '../../utilities/context/IsMobile';

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

    const loaderData = useLoaderData();
    const user = loaderData?.user;
    const dashboardChatData = loaderData?.chats;

    return (
        <>
            <ChatsRouteModals />
            <ChatsNav userInitials={getUserInitials(user.name)} />
            <ChatsMain>
                <ChatList activeChats={dashboardChatData} />
                {!currentlyMobile ? <ChatPanel /> : null}
            </ChatsMain>
            <ChatsFooter />
        </>
    );
}
