
const formatDate = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const d = date.getDay().toString().padStart(2, '0');
    const m = date.getMonth().toString().padStart(2, '0');
    const y = date.getFullYear();

    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');

    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export { formatDate };