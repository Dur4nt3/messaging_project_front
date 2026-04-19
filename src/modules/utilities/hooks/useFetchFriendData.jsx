import { useNavigate } from 'react-router';
import { useState, useContext } from 'react';
import ChatsModal from '../../utilities/context/ChatsModal';

import fetchFriendData from '../misc/fetchFriendData';

export default function useFetchFriendData() {
    const navigate = useNavigate();

    const { setRunningRefresher } = useContext(ChatsModal);

    const [fetchingFriendData, setFetchingFriendData] = useState(false);
    const [currentFriendData, setCurrentFriendData] = useState(null);

    const handleSetFriendData = (data) => {
        if (data?.success === false) {
            return navigate(`/error?code=${data?.code}`);
        }

        setCurrentFriendData(data);
    };

    const fetchFriendDataRunner = async (type, data = '') => {
        if (fetchingFriendData) {
            return;
        }

        setFetchingFriendData(true);
        setRunningRefresher(true);

        const friendships = await fetchFriendData(type, data);

        setFetchingFriendData(false);
        setRunningRefresher(false);

        handleSetFriendData(friendships);
    };

    return {
        fetchFriendDataRunner,
        fetchingFriendData,
        currentFriendData,
        setCurrentFriendData,
    };
}
