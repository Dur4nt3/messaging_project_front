export default async function deleteChatAction({ params }) {
    console.log('attempting to delete chat!', params);
    await new Promise(resolve => setTimeout(() => resolve(), 2000));
}