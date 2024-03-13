import fse from "fs-extra";
import path from "path";

export function flatten<T>(arg: T[][]): T[] {
    const res: T[] = [];
    for (const x of arg) {
        res.push(...x);
    }

    return res;
}

export function chunk<T>(arr: T[], chunkSize: number): T[][] {
    const res: T[][] = [];
    let chunk: T[] = [];

    for (const x of arr) {
        if (chunk.length === chunkSize) {
            res.push(chunk);
            chunk = [];
        }

        chunk.push(x);
    }

    if (chunk.length > 0) {
        res.push(chunk);
    }

    return res;
}

export function searchRecursive(targetPath: string, filter: (entry: string) => boolean): string[] {
    const stat = fse.statSync(targetPath);
    const results: string[] = [];

    if (stat.isFile()) {
        if (filter(targetPath)) {
            results.push(path.resolve(targetPath));
        }

        return results;
    }

    for (const entry of fse.readdirSync(targetPath)) {
        const resolvedEntry = path.resolve(targetPath, entry);
        const stat = fse.statSync(resolvedEntry);

        if (stat.isDirectory()) {
            results.push(...searchRecursive(resolvedEntry, filter));
        } else if (stat.isFile() && filter(resolvedEntry)) {
            results.push(resolvedEntry);
        }
    }

    return results;
}
