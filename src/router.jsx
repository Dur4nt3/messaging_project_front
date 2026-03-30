import { createBrowserRouter } from 'react-router';

import ErrorPage from './modules/routes/error/ErrorPage';

import Root from './modules/routes/root/Root';
import Signup from './modules/routes/signup/Signup';
import Login from './modules/routes/login/Login';

import rootLoader from './modules/utilities/loaders/rootLoader';

import signupAction from './modules/utilities/actions/signupAction';
import loginAction from './modules/utilities/actions/loginAction';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        hydrateFallbackElement: <h1>Hydrate Fallback</h1>,
        loader: rootLoader,
    },
    {
        path: '/signup',
        element: <Signup />,
        errorElement: <ErrorPage />,
        hydrateFallbackElement: <h1>Hydrate Fallback</h1>,
        action: signupAction,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <ErrorPage />,
        hydrateFallbackElement: <h1>Hydrate Fallback</h1>,
        action: loginAction,
    },
]);

export default router;
