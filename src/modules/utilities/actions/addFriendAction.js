import { getToken } from '../session/manageToken';

export default async function addFriendAction({ params }) {
    const userId = params?.userId;
    if (!userId || Number.isNaN(Number(userId))) {
        return {
            success: false,
        };
    }

    const token = getToken();
    if (token === null) {
        throw new Response(null, { status: 401 });
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/users/friendships/${userId}`;
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response.status === 401) {
        throw new Response(null, { status: 401 });
    }

    const results = await response.json();

    if (results.success === true) {
        return {
            success: true,
        };
    }

    return { success: false };
}
