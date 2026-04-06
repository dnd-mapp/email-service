export function parseInteger(fallback: number, value?: string) {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) return fallback;
    return parsed;
}
