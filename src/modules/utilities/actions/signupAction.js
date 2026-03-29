export default async function signupAction({ request }) {
    console.log('running signup action');
    await new Promise(resolve => setTimeout(() => resolve(), 2000));
}