import { useState, useContext, useEffect } from 'react';
import ChatHighlight from '../../../utilities/context/ChatHighlight';
import ChatsModal from '../../../utilities/context/ChatsModal';

import { useFetcher } from 'react-router';

import { Menu } from '@mantine/core';

import { Ellipsis, CornerDownLeft, UserX } from 'lucide-react';

import './stylesheets/ChatActionMenu.css';

function ChatMenuItems({ onClose, isModal }) {
    const { currentChatData } = useContext(ChatHighlight);
    const { runRefresher } = useContext(ChatsModal);

    const fetcher = useFetcher();

    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data?.success) {
            console.log('refresh');
        }
    }, [fetcher.state, fetcher.data, runRefresher]);

    if (currentChatData?.chatId) {
        if (isModal) {
            return (
                <>
                    <Menu.Item
                        leftSection={<CornerDownLeft size={14} />}
                        onClick={onClose}
                    >
                        Exit Chat
                    </Menu.Item>
                    <Menu.Divider />
                    <fetcher.Form action='' method='DELETE'>
                        <Menu.Item
                            leftSection={<UserX size={14} />}
                            className='chat-menu-remove-friend'
                        >
                            Remove Friend
                        </Menu.Item>
                    </fetcher.Form>
                </>
            );
        }

        return (
            <>
                <fetcher.Form action='' method='DELETE'>
                    <Menu.Item
                        leftSection={<UserX size={14} />}
                        className='chat-menu-remove-friend'
                    >
                        Remove Friend
                    </Menu.Item>
                </fetcher.Form>
            </>
        );
    }

    if (isModal) {
        return (
            <>
                <Menu.Item
                    leftSection={<CornerDownLeft size={14} />}
                    onClick={onClose}
                >
                    Exit Chat
                </Menu.Item>
            </>
        );
    }

    return (
        <>
            <Menu.Item>
                <span className='loading-indicator'>Loading</span>
            </Menu.Item>
        </>
    );
}

export default function ChatActionMenu({ onClose, isModal }) {
    const [opened, setOpened] = useState(false);

    return (
        <Menu
            trapFocus
            opened={opened}
            onChange={setOpened}
            onDismiss={() => setOpened(false)}
            classNames={{
                dropdown: 'chat-menu-dropdown',
                arrow: 'chat-menu-arrow',
                overlay: 'chat-menu-overlay',
                divider: 'chat-menu-divider',
                item: 'chat-menu-item',
                itemLabel: 'chat-menu-item-label',
                itemSection: 'chat-menu-item-section',
            }}
            offset={4}
        >
            <Menu.Target>
                <button
                    className='chat-actions'
                    onClick={() => setOpened(true)}
                >
                    <Ellipsis strokeWidth={1.5} />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <ChatMenuItems onClose={onClose} isModal={isModal} />
            </Menu.Dropdown>
        </Menu>
    );
}
