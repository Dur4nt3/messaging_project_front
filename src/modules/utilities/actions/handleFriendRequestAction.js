import { getToken } from '../session/manageToken';
import validateHandleFriendRequest from '../validation/validateHandleFriendRequest';

export default async function handleFriendRequestAction({ request, params }) {
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

    const data = await request.formData();
    const jsonData = Object.fromEntries(data);

    const intent = String(jsonData.intent).toUpperCase();

    const clientValidation = validateHandleFriendRequest(intent);
    if (clientValidation !== null) {
        return {
            success: false,
        };
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/users/friendships/${userId}`;

    const response = await fetch(serverUrl, {
        method: intent === 'DELETED' ? 'DELETE' : 'PATCH',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
        body:
            intent === 'DELETED'
                ? undefined
                : JSON.stringify({
                      status: String(jsonData.intent).toUpperCase(),
                  }),
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
