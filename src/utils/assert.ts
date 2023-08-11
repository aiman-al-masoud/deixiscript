/**
 * My own assert().
 * To be used instead of deno assert() in normal code (outside tests).
 */
export function assert(expr: unknown, msg?: string): asserts expr {
    if (!expr) throw new Error('Assertion Error: ' + msg ?? '')
}