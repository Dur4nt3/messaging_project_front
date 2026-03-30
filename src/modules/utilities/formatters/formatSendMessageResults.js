import getErrorsObject from './getErrorsObject';

export default function formatSendMessageResults(results, status) {
    if (results.success === true) {
        return true;
    }

    if (results.errors === undefined || status === 500) {
        return null;
    }

    const errorsObject = getErrorsObject(results.errors);

    return errorsObject.message;
}
