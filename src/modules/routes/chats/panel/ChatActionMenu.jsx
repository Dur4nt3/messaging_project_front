import { useState } from 'react';
import { Menu } from '@mantine/core';

import { Ellipsis, CornerDownLeft, UserX } from 'lucide-react';

import './stylesheets/ChatActionMenu.css';

function ChatMenuItems({ populated, onClose, isModal }) {
    if (populated) {
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
                    <Menu.Item
                        leftSection={<UserX size={14} />}
                        className='chat-menu-remove-friend'
                    >
                        Remove Friend
                    </Menu.Item>
                </>
            );
        }
        return (
            <>
                <Menu.Item
                    leftSection={<UserX size={14} />}
                    className='chat-menu-remove-friend'
                >
                    Remove Friend
                </Menu.Item>
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

export default function ChatActionMenu({
    populated = false,
    onClose,
    isModal,
}) {
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
                <ChatMenuItems
                    populated={populated}
                    onClose={onClose}
                    isModal={isModal}
                />
            </Menu.Dropdown>
        </Menu>
    );
}
