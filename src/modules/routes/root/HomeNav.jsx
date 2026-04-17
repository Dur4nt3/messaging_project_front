import { Link, useNavigation } from 'react-router';
import { MoveRight } from 'lucide-react';

import FormLoader from '../../utilities/miscComponents/FormLoader';

import './stylesheets/HomeNav.css';

function AuthenticatedNavAction() {
    const navigation = useNavigation();

    if (
        navigation.state === 'loading' &&
        navigation.location.pathname === '/chats'
    ) {
        return (
            <>
                <span className='nav-chats-link ghost-button-design disabled-link'>
                    <span>Your Chats</span>
                    <FormLoader size={18} color='#e8eef5' type='bars' />
                </span>
            </>
        );
    }

    if (navigation.state === 'loading') {
        return (
            <>
                <span className='nav-chats-link ghost-button-design disabled-link'>
                    <span>Your Chats</span>
                    <MoveRight strokeWidth={1.5} />
                </span>
            </>
        );
    }

    return (
        <>
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

export default function HomeNav({ auth }) {
    return (
        <nav className='home-navbar'>
            <span className='site-name'>
                Quick <span>Talk</span>
            </span>
            <div className='nav-actions'>
                {auth ? (
                    <AuthenticatedNavAction />
                ) : (
                    <UnauthenticatedNavAction />
                )}
            </div>
        </nav>
    );
}
