export function getDaysInMonth(
    year: number,
    month: number
): number {
    return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(
    year: number,
    month: number
): number {
    // Lunes = 0, domingo = 6
    return (new Date(year, month, 1).getDay() + 6) % 7;
}

export function isToday(
    year: number,
    month: number,
    day: number
): boolean {
    const today = new Date();

    return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    );
}