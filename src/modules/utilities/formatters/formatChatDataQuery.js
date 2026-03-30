export default function formatChatDataQuery(from, to) {
    if (!from && !to) {
        return '';
    }

    if (from && !to) {
        return `?from=${from}`;
    }

    if (!from && to) {
        return `?to=${to}`;
    }

    return `?from=${from}&to=${to}`;
}
