export interface CharStream {

    /**
     * Add the next char to the accumulator
     */
    next(): void
    /**
     * Read the accumulated value
     */
    peekAcc(): string
    /**
     * Clear the accumulated value
     */
    clearAcc(): void
    /**
     * Go back AND clear the accumulated value.
     */
    backTo(pos: number): void
    /**
     * Get the current position.
     */
    getPos(): number
    /**
     * Reached end of charstream.
     */
    isEnd(): boolean
}

function getCharStream(sourceCode: string) {
    return new BaseCharStream(sourceCode)
}

class BaseCharStream implements CharStream {

    constructor(
        readonly sourceCode: string,
        protected pos = 0,
        protected acc = '',
    ) {

    }

    next(): void {
        throw new Error("Method not implemented.")
    }

    peekAcc(): string {
        throw new Error("Method not implemented.")
    }

    clearAcc(): void {
        throw new Error("Method not implemented.")
    }
    backTo(pos: number): void {
        throw new Error("Method not implemented.")
    }
    getPos(): number {
        throw new Error("Method not implemented.")
    }
    isEnd(): boolean {
        throw new Error("Method not implemented.")
    }

}