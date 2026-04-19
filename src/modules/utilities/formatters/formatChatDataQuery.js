export default function formatChatDataQuery(from, to, firstMessageId) {
    if (!from && !to && !firstMessageId) {
        return '';
    }

    let queryParams = '';

    if (from && !to) {
        queryParams = `?from=${from}`;
    } else if (!from && to) {
        queryParams = `?to=${to}`;
    } else if (from && to) {
        queryParams = `?from=${from}&to=${to}`;
    }

    if (firstMessageId) {
        if (queryParams === '') {
            queryParams = `?firstMessageId=${firstMessageId}`;
        } else {
            queryParams += `&firstMessageId=${firstMessageId}`;
        }
    }

    return queryParams;
}
