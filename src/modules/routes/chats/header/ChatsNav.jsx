import { useState } from 'react';
import { Link } from 'react-router';

import UserProfileMenu from './UserProfileMenu';

import './stylesheets/ChatsNav.css';

export default function ChatsNav({ userInitials }) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    return (
        <nav className='chats-navbar'>
            <Link to='/' className='site-name'>
                Quick <span>Talk</span>
            </Link>
            <div className='nav-actions'>
                <UserProfileMenu
                    opened={profileMenuOpen}
                    setOpened={setProfileMenuOpen}
                    userInitials={userInitials}
                />
            </div>
        </nav>
    );
}
