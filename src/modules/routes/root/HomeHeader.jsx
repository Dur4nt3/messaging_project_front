import { Link } from 'react-router';

import './stylesheets/HomeHeader.css';

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
                <Link to='/login' className='login-link ghost-button-design'>
                    Log in
                </Link>
            </div>
        </header>
    );
}
