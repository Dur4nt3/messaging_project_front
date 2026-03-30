import { Outlet } from 'react-router';
import ChatsModalProvider from './modules/utilities/context/ChatsModalProvider';
import IsMobileProvider from './modules/utilities/context/IsMobileProvider';

export default function AppShell() {
    return (
        <>
            <IsMobileProvider>
                <ChatsModalProvider>
                    <Outlet />
                </ChatsModalProvider>
            </IsMobileProvider>
        </>
    );
}
