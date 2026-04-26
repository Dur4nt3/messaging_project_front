import { useState, useEffect, useRef, useContext } from 'react';
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
    const loaderChatList = loaderData?.chats;

    const [chatList, setChatList] = useState(loaderChatList);
    const previousChatList = useRef(loaderChatList);

    useEffect(() => {
        const previousList = previousChatList.current;

        const hasServerUpdate = loaderChatList?.some(
            (chat, i) =>
                chat.chatId !== previousList?.[i]?.chatId ||
                chat.lastMessageAt !== previousList?.[i]?.lastMessageAt
        );

        if (hasServerUpdate || loaderChatList.length !== previousList.length) {
            previousChatList.current = loaderChatList;
            setChatList(loaderChatList);
        }
    }, [loaderChatList]);

    function markChatAsRead(chatId) {
        setChatList((prev) =>
            prev.map((chat) => {
                if (chat.chatId === chatId) {
                    const newChat = { ...chat };
                    newChat.messages.unread = 0;
                    return newChat;
                }
                return chat;
            })
        );
    }

    return (
        <>
            <ChatsRouteModals />
            <ChatsNav userInitials={getUserInitials(user.name)} />
            <ChatsMain>
                <ChatList
                    activeChats={chatList}
                    markChatAsRead={markChatAsRead}
                />
                {!currentlyMobile ? <ChatPanel /> : null}
            </ChatsMain>
            <ChatsFooter />
        </>
    );
}
