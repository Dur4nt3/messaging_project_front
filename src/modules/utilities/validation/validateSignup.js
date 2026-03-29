import SignupError from '../classes/SignupError';

function validateIdentifierString(value, fieldName, regex, error) {
    if (value === undefined) {
        return `${fieldName} must not be empty`;
    }

    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return `${fieldName} must not be empty`;
    }

    if (trimmedValue.length < 3 || trimmedValue.length > 30) {
        return `${fieldName} must be between 3 and 30 characters`;
    }

    if (!regex.test(trimmedValue)) {
        return `${fieldName} ${error}`;
    }

    return null;
}

function validatePassword(value) {
    if (value === undefined) {
        return 'Password must not be empty';
    }

    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return 'Password must not be empty';
    }

    if (trimmedValue.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    return null;
}

function validateCPassword(value, passwordValue) {
    if (value === undefined) {
        return 'Password confirmation must not be empty';
    }

    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return 'Password confirmation must not be empty';
    }

    if (value !== passwordValue) {
        return 'Passwords do not match';
    }

    return null;
}

export default function validateSignup(jsonData) {
    const usernameValid = validateIdentifierString(
        jsonData.username,
        'Username',
        /^[a-z0-9]+$/,
        'must only contain letters and numbers (lowercase only)'
    );

    const nameValid = validateIdentifierString(
        jsonData.name,
        'Name',
        /^[A-Za-z0-9 ]+$/,
        'must only contain letters and numbers'
    );

    const passwordValid = validatePassword(jsonData.password);

    const cpasswordValid = validateCPassword(
        jsonData.cpassword,
        jsonData.password
    );

    const errorsPresent = [
        usernameValid,
        nameValid,
        passwordValid,
        cpasswordValid,
    ].some((field) => field !== null);

    if (errorsPresent) {
        return new SignupError(
            usernameValid,
            nameValid,
            passwordValid,
            cpasswordValid
        );
    }

    return null;
}
