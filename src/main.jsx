import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import './index.css';
import './assets/stylesheets/reset.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './router';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MantineProvider>
            <Notifications />
            <RouterProvider router={router} />
        </MantineProvider>
    </StrictMode>
);
