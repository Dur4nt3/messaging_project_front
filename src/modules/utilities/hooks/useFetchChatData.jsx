import { useNavigate } from 'react-router';
import { useState, useContext } from 'react';
import ChatsModal from '../../utilities/context/ChatsModal';

import fetchChatData from '../misc/fetchChatData';

export default function useFetchChatData() {
    const navigate = useNavigate();

    const { setRunningRefresher } = useContext(ChatsModal);

    const [fetchingChatData, setFetchingChatData] = useState(false);
    const [currentChatData, setCurrentChatData] = useState(null);

    const handleSetChatData = (data, from, to) => {
        if (data?.success === false) {
            return navigate(`/error?code=${data?.code}`);
        }

        setCurrentChatData((prev) => {
            if (prev !== null) {
                if (from) {
                    return {
                        id: data?.id,
                        name: prev.name,
                        messages: [...prev.messages, ...data.messages],
                        more: data.more,
                    };
                }
                if (to) {
                    return {
                        id: data?.id,
                        name: prev.name,
                        messages: [...data.messages, ...prev.messages],
                        more: data.more,
                    };
                }
            }
            return data;
        });
    };

    const fetchChatDataRunner = async (
        chatId,
        from = null,
        to = null,
        firstMessageId = null
    ) => {
        if (fetchingChatData) {
            return;
        }

        setFetchingChatData(true);
        setRunningRefresher(true);

        const data = await fetchChatData(chatId, from, to, firstMessageId);

        setFetchingChatData(false);
        setRunningRefresher(false);

        handleSetChatData(data, from, to);
    };

    return {
        fetchChatDataRunner,
        fetchingChatData,
        currentChatData,
        setCurrentChatData,
    };
}
