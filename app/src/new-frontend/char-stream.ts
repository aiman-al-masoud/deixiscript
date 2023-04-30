export interface CharStream {
    next(): void
    peekAcc(): string
    clearAcc(): void
    backTo(pos: number): void
}


// class BaseCharStream implements CharStream {

// }