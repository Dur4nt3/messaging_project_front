import { createBrowserRouter } from 'react-router';

import Root from './modules/routes/root/Root';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
    },
]);

export default router;
