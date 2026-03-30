export function formatDate(dateString, trim = false) {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    if (diffHours < 48) {
        return 'yesterday';
    }

    const days = Math.floor(diffHours / 24);
    return `${trim && days > 9 ? '9+' : days} days ago`;
}

export function formatDateExtended(dateString) {
    if (!dateString) {
        return '';
    }

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (diffHours < 24) {
        return `${hours}:${minutes}`;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(2, '0');

    return `${day}/${month}/${year} @ ${hours}:${minutes}`;
}
