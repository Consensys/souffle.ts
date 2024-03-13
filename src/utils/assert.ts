export function assert(cond: boolean, msg: string): asserts cond {
    if (cond) {
        return;
    }

    throw new Error(msg);
}
