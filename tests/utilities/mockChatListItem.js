export default function mockChatListItem(
    chatId,
    lastMessageAt,
    userId,
    username,
    name,
    lastContent,
    sent,
    unread
) {
    return {
        chatId,
        createdAt: new Date(),
        lastMessageAt,
        isGroup: false,
        chatParticipant: {
            lastRead: new Date(),
            user: {
                userId,
                username,
                name,
            },
        },
        messages: {
            lastContent,
            sent,
            unread,
        },
    };
}
