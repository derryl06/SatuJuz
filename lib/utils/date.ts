export const formatDateId = (date: Date = new Date()) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export const parseDateId = (dateId: string) => {
    const [yyyy, mm, dd] = dateId.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
};

export const getTodayDateId = () => formatDateId(new Date());
