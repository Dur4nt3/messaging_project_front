import { Link, useNavigation } from 'react-router';

import FormLoader from '../../utilities/miscComponents/FormLoader';

import './stylesheets/HomeHeader.css';

function LoginButton() {
    const navigation = useNavigation();

    if (
        navigation.state === 'loading' &&
        navigation.location.pathname === '/login'
    ) {
        return (
            <span className='login-link ghost-button-design fake-link'>
                <FormLoader color='#e8eef5' />
            </span>
        );
    }

    if (navigation.state === 'loading') {
        return (
            <span className='login-link ghost-button-design fake-link'>
                Log in
            </span>
        );
    }

    return (
        <Link to='/login' className='login-link ghost-button-design'>
            Log in
        </Link>
    );
}

export default function HomeHeader() {
    return (
        <header className='home-header'>
            <h1 className='header-title'>
                Talk fast.
                <br />
                <span>Stay close.</span>
            </h1>
            <p className='header-sub'>
                QuickTalk is a no-fuss messaging app built for real
                conversations, lightweight and simple.
            </p>
            <div className='header-cta'>
                <Link
                    to='/signup'
                    className='signup-link primary-button-design'
                >
                    Get Started
                </Link>
                <LoginButton />
            </div>
        </header>
    );
}
