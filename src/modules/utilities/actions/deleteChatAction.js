import { getToken } from '../session/manageToken';

import updateChatVisibility from '../misc/updateChatVisibility';

export default async function deleteChatAction({ params }) {
    const chatId = params?.chatId;
    if (!chatId || Number.isNaN(Number(chatId))) {
        return {
            success: false,
        };
    }

    const token = getToken();
    if (token === null) {
        return { success: false };
    }

    const visibilityUpdated = await updateChatVisibility(chatId, token);

    return visibilityUpdated;
}
