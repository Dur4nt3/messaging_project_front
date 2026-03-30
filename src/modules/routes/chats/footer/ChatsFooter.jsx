import { useState } from 'react';

import LogoutPopover from './LogoutPopover';
import FooterActionMenu from './FooterActionMenu';

import './stylesheets/ChatsFooter.css';

export default function ChatsFooter() {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [actionsOpen, setActionsOpen] = useState(false);

    return (
        <footer className='chats-footer'>
            <FooterActionMenu opened={actionsOpen} setOpened={setActionsOpen} />

            <LogoutPopover opened={logoutOpen} setOpened={setLogoutOpen} />
        </footer>
    );
}
