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
