import formatChatDataQuery from '../formatters/formatChatDataQuery';
import { getToken } from '../session/manageToken';

export default async function fetchChatData(chatId, from, to, firstMessageId) {
    const token = getToken();

    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages${formatChatDataQuery(from, to, firstMessageId)}`;

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
        chatId: results.chatId,
        userId: results.userId,
        name: results.name,
        messages: results.messages,
        more: results.more,
        friends: results.friends,
    };
}
