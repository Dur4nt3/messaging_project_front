export default async function updateChatVisibility(chatId, token) {
    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${chatId}`;
    const response = await fetch(serverUrl, {
        method: 'PATCH',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response.status !== 200) {
        return false;
    }

    return true;
}
