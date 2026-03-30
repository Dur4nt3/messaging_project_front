import { Menu } from '@mantine/core';

import { UserCog } from 'lucide-react';

import './stylesheets/UserProfileMenu.css';

export default function UserProfileMenu({ opened, setOpened, userInitials }) {
    return (
        <Menu
            trapFocus
            opened={opened}
            onChange={setOpened}
            onDismiss={() => setOpened(false)}
            classNames={{
                dropdown: 'profile-menu-dropdown',
                arrow: 'profile-menu-arrow',
                overlay: 'profile-menu-overlay',
                item: 'profile-menu-item',
                itemLabel: 'profile-menu-item-label',
                itemSection: 'profile-menu-item-section',
            }}
            offset={6}
        >
            <Menu.Target>
                <button className='avatar-button'>{userInitials}</button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<UserCog size={14} />}>
                    Edit Profile
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
