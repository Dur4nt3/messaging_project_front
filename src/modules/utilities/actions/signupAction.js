import { redirect } from 'react-router';
import validateSignup from '../validation/validateSignup';
import formatSignupResults from '../formatters/formatSignupResults';

export default async function signupAction({ request }) {
    const data = await request.formData();
    const jsonData = Object.fromEntries(data);

    const clientValidation = validateSignup(jsonData);
    if (clientValidation !== null) {
        return { errors: clientValidation };
    }

    const serverUrl = `${import.meta.env.VITE_API_URL}/users`;

    const response = await fetch(serverUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    }).catch(() => {
        throw new Response(null, { status: 502 });
    });

    const results = await response.json();

    const formattedResults = formatSignupResults(results, response.status);

    if (formattedResults === null) {
        return { errors: { serverError: 'An unexpected error occurred. Please try again later.' } };
    }

    if (formattedResults === true) {
        return redirect('/login');
    }

    return { errors: formattedResults };
}
