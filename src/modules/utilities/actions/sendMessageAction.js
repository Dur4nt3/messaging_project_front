import { getToken } from '../session/manageToken';
import validateMessage from '../validation/validateMessage';
import formatSendMessageResults from '../formatters/formatSendMessageResults';

export default async function sendMessageAction({ request, params }) {
    const chatId = params?.chatId;
    if (!chatId || Number.isNaN(Number(chatId))) {
        return {
            errors: 'An unexpected error occurred. Please try again later.',
        };
    }

    const data = await request.formData();
    const jsonData = Object.fromEntries(data);

    const clientValidation = validateMessage(jsonData);
    if (clientValidation !== null) {
        return { errors: clientValidation };
    }

    const token = getToken();
    if (token === null) {
        throw new Response(null, { status: 401 });
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`;
    const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            Authorization: token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    if (response.status === 401) {
        throw new Response(null, { status: 401 });
    }

    const results = await response.json();

    const formattedResults = formatSendMessageResults(results, response.status);

    if (formattedResults === null) {
        return {
            errors: 'An unexpected error occurred. Please try again later.',
        };
    }

    if (formattedResults === true) {
        return { success: true };
    }

    return { errors: formattedResults };
}
