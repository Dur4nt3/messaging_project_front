export default function getErrorsObject(errors) {
    const errorsObject = {};
    for (const error of errors) {
        errorsObject[error.path] = error.msg;
    }

    return errorsObject;
}
