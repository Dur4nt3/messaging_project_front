import { Link } from 'react-router';

import './stylesheets/HomeNav.css';

export default function HomeNav() {
    return <nav className="home-navbar">
        <span className="site-name">Quick <span>Talk</span></span>
        <div className="nav-actions">
            <Link to='/login' className='login-link ghost-button-design'>Log in</Link>
            <Link to='/signup' className='signup-link primary-button-design'>Sign up</Link>
        </div>
    </nav>
}