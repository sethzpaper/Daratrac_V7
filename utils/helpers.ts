
export const formatThaiDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
