export default function formatTestId(labelText) {
    const lower = String(labelText).toLowerCase();
    const split = lower.split(' ');

    const final = split.join('-');

    return final;
}