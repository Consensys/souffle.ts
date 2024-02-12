export function parseDatalog(content: string): unknown[] {
    // @ts-expect-error: Parser file is generated on build step.
    return parse(content);
}
