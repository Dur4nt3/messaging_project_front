import { Link } from 'react-router';
import { MoveRight } from 'lucide-react';

import './stylesheets/HomeNav.css';

function AuthenticatedNavAction({ name }) {
    return (
        <>
            <p className='user-name'>{name}</p>
            <Link to='/chats' className='nav-chats-link ghost-button-design'>
                <span>Your Chats</span>
                <MoveRight strokeWidth={1.5} />
            </Link>
        </>
    );
}

function UnauthenticatedNavAction() {
    return (
        <>
            <Link to='/login' className='login-link ghost-button-design'>
                Log in
            </Link>
            <Link to='/signup' className='signup-link primary-button-design'>
                Sign up
            </Link>
        </>
    );
}

export default function HomeNav({ name }) {
    return (
        <nav className='home-navbar'>
            <span className='site-name'>
                Quick <span>Talk</span>
            </span>
            <div className='nav-actions'>
                {name !== null ? (
                    <AuthenticatedNavAction name={name} />
                ) : (
                    <UnauthenticatedNavAction />
                )}
            </div>
        </nav>
    );
}
