export interface CharStream {

    /**
     * Move to the next character if any.
     */
    next(): void
    /**
     * Read the current character.
     */
    peek(): string
    /**
     * Go back.
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

export function getCharStream(sourceCode: string) {
    return new BaseCharStream(sourceCode)
}

class BaseCharStream implements CharStream {

    constructor(
        readonly sourceCode: string,
        protected pos = 0,
    ) {

    }

    next(): void {
        if (this.isEnd()) {
            return
        }

        this.pos++
    }

    peek(): string {
        return this.sourceCode[this.pos]
    }

    backTo(pos: number): void {
        this.pos = pos
    }

    getPos(): number {
        return this.pos
    }

    isEnd(): boolean {
        return this.pos >= this.sourceCode.length
    }

}