import { Outlet } from 'react-router';
import ChatsModalProvider from './modules/utilities/context/ChatsModalProvider';
import IsMobileProvider from './modules/utilities/context/IsMobileProvider';
import ChatHighlightProvider from './modules/utilities/context/ChatHighlightProvider';

export default function AppShell() {
    return (
        <>
            <IsMobileProvider>
                <ChatsModalProvider>
                    <ChatHighlightProvider>
                        <Outlet />
                    </ChatHighlightProvider>
                </ChatsModalProvider>
            </IsMobileProvider>
        </>
    );
}
