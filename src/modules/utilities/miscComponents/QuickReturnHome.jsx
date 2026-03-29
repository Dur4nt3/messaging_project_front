import { Link } from 'react-router';

import { ChevronLeft } from 'lucide-react';

import './stylesheets/QuickReturnHome.css';

export default function QuickReturnHome() {
    return (
        <div className='return-home-cont'>
            <Link to='/'>
                <ChevronLeft strokeWidth={1.5} />
                Home
            </Link>
        </div>
    );
}
