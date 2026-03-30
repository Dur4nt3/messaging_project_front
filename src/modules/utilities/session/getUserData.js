import { getToken } from './manageToken';

// NOTE: This can be used to check authentication
export default async function getUserData() {
    const token = getToken();

    if (token === null) {
        return null;
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/users/me`;

    const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response === null) {
        return null;
    }

    const results = await response.json();

    if (response.status !== 200) {
        return null;
    }

    return { username: results.username, name: results.name };
}
