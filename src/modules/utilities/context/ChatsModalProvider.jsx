import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';

import ChatsModal from './ChatsModal';

import ChatsModalContext from '../classes/ChatsModalContext';

export default function ChatsModalProvider({ children }) {
    const [currentChatModal, setCurrentChatModal] = useState(
        new ChatsModalContext(null, null)
    );

    // YOU MUST SET refreshData to a function that returns the function you want to call
    // Otherwise you will attempt to set a state whilst another component is rendering (ERROR)
    const [refreshData, setRefresher] = useState(() => () => null);
    const [runningRefresher, setRunningRefresher] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setRefresher(() => null);
        setCurrentChatModal(new ChatsModalContext(null, null));
    }, [location.pathname]);

    const openModal = useCallback((modal, data) => {
        setCurrentChatModal(new ChatsModalContext(modal, data));
    }, []);

    const closeModal = useCallback(() => {
        setRefresher(() => null);
        setCurrentChatModal(new ChatsModalContext(null, null));
    }, []);

    const runRefresher = useCallback(
        (...args) => refreshData(...args),
        [refreshData]
    );

    return (
        <ChatsModal.Provider
            value={{
                currentChatModal,
                setRefresher,
                openModal,
                closeModal,
                runRefresher,
                runningRefresher,
                setRunningRefresher
            }}
        >
            {children}
        </ChatsModal.Provider>
    );
}
