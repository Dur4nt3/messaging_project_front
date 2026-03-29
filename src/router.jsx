import { createBrowserRouter } from 'react-router';

import Root from './modules/routes/root/Root';
import Signup from './modules/routes/signup/Signup';

import signupAction from './modules/utilities/actions/signupAction';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <h1>Error WIP</h1>,
        hydrateFallbackElement: <h1>Hydrate Fallback</h1>
    },
    {
        path: '/signup',
        element: <Signup />,
        errorElement: <h1>Error WIP</h1>,
        hydrateFallbackElement: <h1>Hydrate Fallback</h1>,
        action: signupAction,
    },
]);

export default router;
