export default async function requestNewChat(userId, token) {
    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${userId}`;
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response.status === 401) {
        return null;
    }

    const results = await response.json();

    if (results.success === true) {
        return results?.chat?.chatId;
    }

    return null;
}
