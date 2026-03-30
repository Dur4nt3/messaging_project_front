import { useState, useContext } from 'react';
import ChatsModal from '../../utilities/context/ChatsModal';

import fetchChatData from '../misc/fetchChatData';

export default function useFetchChatData() {
    const { setRunningRefresher } = useContext(ChatsModal);

    const [fetchingChatData, setFetchingChatData] = useState(false);
    const [currentChatData, setCurrentChatData] = useState(null);

    function handleSetChatData(data, from, to) {
        setCurrentChatData((prev) => {
            if (prev !== null) {
                if (from) {
                    return {
                        messages: [...prev.messages, ...data.messages],
                        name: prev.name,
                        more: data.more
                    };
                }
                if (to) {
                    return {
                        messages: [...data.messages, ...prev.messages],
                        name: prev.name,
                        more: data.more,
                    };
                }
            }
            return data;
        });
    }

    async function fetchChatDataRunner(chatId, from = null, to = null) {
        if (fetchingChatData) {
            return;
        }

        setFetchingChatData(true);
        setRunningRefresher(true);

        const data = await fetchChatData(chatId, from, to);

        setFetchingChatData(false);
        setRunningRefresher(false);

        handleSetChatData(data, from, to);
    }

    return {
        fetchChatDataRunner,
        fetchingChatData,
        currentChatData,
        setCurrentChatData,
    };
}
