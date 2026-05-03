export function mockDeniedFriendship(
    friendshipId,
    senderId,
    receiverId,
    username,
    name
) {
    return {
        friendshipId,
        senderId,
        receiverId,
        friendshipStatus: 'DENIED',
        username,
        name,
        sent: false,
    };
}
