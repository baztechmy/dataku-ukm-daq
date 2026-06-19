export function cleanObject(
    obj: unknown,
    keysToRemove: string[]
): void {
    const keySet = new Set(keysToRemove);

    function visit(node: unknown): void {
        if (!node || typeof node !== "object") return;

        if (Array.isArray(node)) {
            for (const item of node) {
                visit(item);
            }
            return;
        }

        const record = node as Record<string, unknown>;

        for (const key of Object.keys(record)) {
            const value = record[key];
            if (keySet.has(key)) {
                delete record[key];
                continue;
            }

            visit(value);
        }
    }

    visit(obj);
}
export function hasKey(obj: any, targetKey: string): boolean {
    if (obj == null || typeof obj !== "object") return false;

    for (const key of Object.keys(obj)) {
        if (key === targetKey) return true;

        const value = obj[key];

        if (typeof value === "object" && value !== null) {
            if (hasKey(value, targetKey)) {
                return true;
            }
        }
    }

    return false;
}
