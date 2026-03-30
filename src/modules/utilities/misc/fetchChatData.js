import formatChatDataQuery from '../formatters/formatChatDataQuery';
import { getToken } from '../session/manageToken';

export default async function fetchChatData(chatId, from, to) {
    const token = getToken();

    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages${formatChatDataQuery(from, to)}`;

    const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    const results = await response.json();

    if (response.status !== 200) {
        // "false" indicates an error
        return false;
    }
    
    return {
        name: results.name,
        messages: results.messages,
        more: results.more,
    };
}
