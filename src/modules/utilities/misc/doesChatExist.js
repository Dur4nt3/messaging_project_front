export default async function doesChatExist(userId, token) {
    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${userId}`;
    const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response.status !== 200) {
        return null;
    }

    const results = await response.json();

    if (results?.chat === null) {
        return false;
    }

    return results.chat.chatId;
}
