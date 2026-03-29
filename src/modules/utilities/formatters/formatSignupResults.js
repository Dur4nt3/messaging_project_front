import SignupError from '../classes/SignupError';
import getErrorsObject from './getErrorsObject';

export default function formatSignupResults(results, status) {
    if (results.success === true) {
        return true;
    }

    if (results.errors === undefined || status === 500) {
        return null;
    }

    const errorsObject = getErrorsObject(results.errors);

    return new SignupError(
        errorsObject.username,
        errorsObject.name,
        errorsObject.password,
        errorsObject.cpassword
    );
}
