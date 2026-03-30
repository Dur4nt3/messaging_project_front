import { redirect } from 'react-router';
import getUserData from '../session/getUserData';

export default async function loginLoader() {
    const userData = await getUserData();
    if (userData !== null) {
        return redirect('/chats');
    }
}
