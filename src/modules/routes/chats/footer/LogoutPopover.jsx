import { useFetcher } from 'react-router';
import { Popover } from '@mantine/core';

import { LogOut } from 'lucide-react';

import './stylesheets/LogoutPopover.css';

export default function LogoutPopover({ opened, setOpened }) {
    const fetcher = useFetcher();

    return (
        <Popover
            trapFocus
            opened={opened}
            onChange={setOpened}
            onDismiss={() => setOpened(false)}
            classNames={{
                dropdown: 'footer-popover-dropdown',
                arrow: 'footer-popover-arrow',
                overlay: 'footer-popover-overlay',
            }}
            offset={4}
        >
            <Popover.Target>
                <button
                    className='logout-button'
                    onClick={() => setOpened(true)}
                >
                    <LogOut strokeWidth={1.5} />
                    Logout
                </button>
            </Popover.Target>
            <Popover.Dropdown>
                <div className='logout-popover-content'>
                    <h3>Log out?</h3>
                    <p>You'll need to sign back in to access your chats.</p>
                    <div className='logout-popover-actions'>
                        <button
                            className='cancel-logout ghost-button-design'
                            onClick={() => setOpened(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='confirm-logout ghost-button-design'
                            onClick={() => setOpened(false)}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Popover.Dropdown>
        </Popover>
    );
}
