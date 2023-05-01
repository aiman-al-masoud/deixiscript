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
        if (this.isEnd()) {
            return
        }

        this.acc += this.sourceCode[this.pos]
        this.pos++
    }

    clearAcc(): void {
        this.acc = ''
    }

    peekAcc(): string {
        return this.acc
    }

    backTo(pos: number): void {
        this.pos = pos
        this.clearAcc()
    }

    getPos(): number {
        return this.pos
    }

    isEnd(): boolean {
        return this.pos >= this.sourceCode.length
    }

}