import { getToken } from '../session/manageToken';

export default function rootLoader() {
    // DO NOT check the session against the server
    // The return on said action is minimal
    // In the case were the token is invalid
    // The user will know that once they navigate to the chats
    return getToken() !== null;
}
