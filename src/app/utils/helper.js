export const formatDateAgo = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - date.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
        return 'Today';
    } else if (daysDiff === 1) {
        return 'Yesterday';
    } else {
        return `${daysDiff} days ago`;
    }
}

export const formatDateFull = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
