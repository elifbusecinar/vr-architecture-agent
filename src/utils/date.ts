export const formatDate = (iosString: string): string => {
    return new Date(iosString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
