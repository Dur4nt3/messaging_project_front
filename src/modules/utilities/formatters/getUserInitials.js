export default function getUserInitials(name) {
    const words = name.split(' ');
    const letters = [];
    for (const word of words) {
        letters.push(word.charAt(0).toUpperCase());
    }

    const letterCount = letters.length;

    if (letterCount > 2) {
        return `${letters[0]}${letters[letterCount - 1]}`
    }

    let initials = '';
    for (const letter of letters) {
        initials += letter;
    }

    return initials;
}