export default function validateHandleFriendRequest(intent) {
    const validIntents = ['ACCEPTED', 'DENIED', 'DELETED'];

    if (!validIntents.includes(intent)) {
        return 'Invalid intent!';
    }

    return null;
}