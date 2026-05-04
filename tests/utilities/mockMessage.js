export default function mockMessage(
    name,
    sent,
    messageId,
    content,
    senderId,
    sentAt,
    chatId
) {
    return {
        name,
        sent,
        messageId,
        content,
        senderId,
        sentAt,
        edited: false,
        chatId,
        chat: {
            isGroup: false,
        },
    };
}
