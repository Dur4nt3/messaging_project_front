import { redirect } from 'react-router';
import { getToken, deleteToken } from '../session/manageToken';

export default async function logoutAction() {
    const token = getToken();
    if (token === null) {
        throw new Response(null, { status: 401 });
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/auth/token`;

    await fetch(serverUrl, {
        method: 'DELETE',
        headers: {
            Authorization: token,
        },
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    deleteToken();

    return redirect('/');
}
