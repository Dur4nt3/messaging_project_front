import { getToken } from '../session/manageToken';

export default async function fetchFriendData(type, data) {
    const token = getToken();

    const typeMap = {
        FRIEND_LIST: '',
        FRIEND_REQUEST: '?status=pending',
        ADD_FRIEND: `?startsWith=${data}`,
        DENY_LIST: '?status=denied',
    };

    const serverUrl = `${import.meta.env.VITE_API_URL}/users/friendships${type ? typeMap[type] : ''}`;

    const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).catch(() => false);

    if (!response) {
        return { success: false, code: 502 };
    }

    if (response.status !== 200) {
        return { success: false, code: response.status };
    }

    const results = await response.json();

    return {
        type,
        friendships: results.friendships,
    };
}
