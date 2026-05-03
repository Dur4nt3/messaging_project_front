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

/*

{
    "type": "ADD_FRIEND",
    "friendships": [
        {
            "userId": 12,
            "username": "test2",
            "name": "Test Two",
            "type": "HUMAN",
            "status": "ACCEPTED",
            "searchTerm": "test"
        },
        {
            "userId": 13,
            "username": "test4",
            "name": "Test Four",
            "type": "HUMAN",
            "status": "PENDING",
            "searchTerm": "test"
        },
        {
            "userId": 14,
            "username": "test3",
            "name": "Test Three",
            "type": "HUMAN",
            "status": "DENIED",
            "searchTerm": "test"
        },
    ]
}
*/
