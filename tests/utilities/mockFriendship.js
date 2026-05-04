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

export function mockAddFriend(
    userId,
    username,
    name,
    type,
    status,
    searchTerm
) {
    return {
        userId,
        username,
        name,
        type,
        status,
        searchTerm,
    };
}

export function mockFriendRequest(
    friendshipId,
    senderId,
    receiverId,
    username,
    name,
    sent
) {
    return {
        friendshipId,
        senderId,
        receiverId,
        friendshipStatus: 'PENDING',
        username,
        name,
        sent,
    };
}
