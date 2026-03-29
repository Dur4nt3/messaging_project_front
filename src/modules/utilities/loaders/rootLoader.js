import getUserData from '../session/getUserData';

export default async function rootLoader() {
    const userData = await getUserData();
    return userData;
}
