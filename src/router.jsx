import { createBrowserRouter } from 'react-router';

import Root from './modules/routes/root/Root';
import Signup from './modules/routes/signup/Signup';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
]);

export default router;
