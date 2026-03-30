import { useRouteError, Link } from 'react-router';

import { ArrowRight } from 'lucide-react';

import './stylesheets/ErrorPage.css';

const errorContent = {
    401: {
        title: <h2 className='error-title'>Unauthorized</h2>,
        description: (
            <div className='error-description-cont'>
                <p>
                    It seems your session has ended or is invalid. Return home
                    and login.
                </p>
            </div>
        ),
    },
    404: {
        title: <h2 className='error-title'>Page Not Found</h2>,
        description: (
            <div className='error-description-cont'>
                <p>
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
        ),
    },
    500: {
        title: <h2 className='error-title'>Internal Server Error</h2>,
        description: (
            <div className='error-description-cont'>
                <p>
                    Something went wrong while processing your request. Please
                    try again later.
                </p>
            </div>
        ),
    },
    502: {
        title: <h2 className='error-title'>Bad Gateway</h2>,
        description: (
            <div className='error-description-cont'>
                <p>
                    We're having trouble connecting to the service. Please try
                    again shortly.
                </p>
            </div>
        ),
    },
};

export default function ErrorPage() {
    const error = useRouteError();

    let status = error?.status || 404;

    if (errorContent[status] === undefined) {
        status = 404;
    }

    return (
        <>
            <div className='error-cont'>
                <h1 className='error-code'>{status}</h1>
                {errorContent[status].title}
                {errorContent[status].description}
                <Link to={error?.status === 401 ? '/login' : '/'} className='return-home-link'>
                    {error?.status === 401 ? 'Login' : 'Return Home'}
                    <ArrowRight strokeWidth='2' size='18' />
                </Link>
            </div>
        </>
    );
}
