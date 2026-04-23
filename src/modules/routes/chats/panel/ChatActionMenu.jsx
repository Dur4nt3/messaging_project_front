import { useState } from 'react';
import { Menu } from '@mantine/core';

import { Ellipsis, CornerDownLeft, UserX } from 'lucide-react';

import './stylesheets/ChatActionMenu.css';

function ChatMenuItems({ onClose, isModal }) {
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
