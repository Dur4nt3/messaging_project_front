import { getToken } from '../session/manageToken';

import doesChatExist from '../misc/doesChatExist';
import requestNewChat from '../misc/requestNewChat';

export default async function openChatAction({ params }) {
    const userId = params?.userId;
    if (!userId || Number.isNaN(Number(userId))) {
        return {
            success: false,
        };
    }

    const token = getToken();
    if (token === null) {
        return { success: false };
    }

    const chat = await doesChatExist(userId, token);

    if (chat === null) {
        return { success: false };
    }

    if (chat !== false) {
        return { success: true, chatId: chat };
    }

    const newChat = await requestNewChat(userId, token);

    if (newChat === null) {
        return { success: false };
    }

    return { success: true, chatId: newChat };
}
