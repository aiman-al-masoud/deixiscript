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
     * Get the current position
     */
    getPost(): number
}


// class BaseCharStream implements CharStream {

// }