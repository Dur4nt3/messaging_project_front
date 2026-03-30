import { redirect } from 'react-router';
import { setToken } from '../session/manageToken';

export default async function loginAction({ request }) {
    const data = await request.formData();
    const jsonData = Object.fromEntries(data);

    const serverUrl = `${import.meta.env.VITE_API_URL}/auth/token`;

    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    const results = await response.json();

    if (response.status === 401) {
        return { errors: { serverError: 'Invalid credentials!' } };
    }

    if (response.status !== 200) {
        throw new Response(null, { status: response.status });
    }

    setToken(results.token);

    return redirect('/chats');
}
