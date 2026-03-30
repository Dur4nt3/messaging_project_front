import { Menu } from '@mantine/core';

import { Ellipsis, UserPlus, UserPen, User, UserX } from 'lucide-react';

import './stylesheets/FooterActionMenu.css';

export default function FooterActionMenu({ opened, setOpened }) {
    return (
        <Menu
            trapFocus
            opened={opened}
            onChange={setOpened}
            onDismiss={() => setOpened(false)}
            classNames={{
                dropdown: 'footer-menu-dropdown',
                arrow: 'footer-menu-arrow',
                overlay: 'footer-menu-overlay',
                item: 'footer-menu-item',
                itemLabel: 'footer-menu-item-label',
                itemSection: 'footer-menu-item-section',
            }}
            offset={4}
        >
            <Menu.Target>
                <button
                    className='misc-actions'
                    onClick={() => setOpened(true)}
                >
                    <Ellipsis strokeWidth={1.5} />
                </button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<User size={14} />}>
                    Friend List
                </Menu.Item>

                <Menu.Item leftSection={<UserPen size={14} />}>
                    Friend Requests
                </Menu.Item>

                <Menu.Item leftSection={<UserPlus size={14} />}>
                    Add Friends
                </Menu.Item>

                <Menu.Item leftSection={<UserX size={14} />}>
                    Denied Users
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
