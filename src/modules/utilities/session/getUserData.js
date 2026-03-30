import { getToken } from './manageToken';

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
    }).catch(() => null);

    if (response === null) {
        return null;
    }

    const results = await response.json();

    if (response.status !== 200) {
        return null;
    }

    return { username: results.username, name: results.name };
}
