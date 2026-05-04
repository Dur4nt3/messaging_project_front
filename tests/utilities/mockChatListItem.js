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

/*
[
    {
        "chatId": 29,
        "createdAt": "2026-04-29T07:59:39.877Z",
        "lastMessageAt": "2026-04-29T07:59:46.650Z",
        "isGroup": false,
        "chatParticipant": {
            "lastReadAt": "2026-04-29T07:59:46.724Z",
            "user": {
                "userId": 12,
                "username": "test2",
                "name": "Test Two"
            }
        },
        "messages": {
            "lastContent": "testing after chat changes",
            "sent": false,
            "unread": 0
        }
    }
]
*/
