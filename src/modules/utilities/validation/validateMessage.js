export default function validateMessage(jsonData) {
    const {message} = jsonData;

    if (message.length === 0) {
        return 'Message must not be empty';
    }

    if (message.length > 5000) {
        return 'Message must not exceed 5000 characters';
    }

    return null;
}