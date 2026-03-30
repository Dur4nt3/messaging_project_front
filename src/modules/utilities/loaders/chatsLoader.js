import getUserData from '../session/getUserData';
import { getToken } from '../session/manageToken';

export default async function chatsLoader() {
    const userData = await getUserData();
    if (userData === null) {
        throw new Response(null, { status: 401 });
    }

    const token = getToken();

    const serverUrl = `${import.meta.env.VITE_API_URL}/chats`;

    const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).catch(() => {throw new Response(null, { status: 502 });});

    if (response.status !== 200) {
        throw new Response(null, { status: response.status });
    }

    const results = await response.json();

    return { user: userData, chats: results.data };
}
