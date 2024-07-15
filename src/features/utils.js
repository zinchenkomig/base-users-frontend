
export function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function FormatISODate(isoDateString) {
    const date = new Date(isoDateString);

    // Options for formatting
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    // Format the date according to options
    return date.toLocaleDateString('en-US', options);
}