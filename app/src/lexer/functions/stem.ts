
export function stem(word: string): string {
    return word.endsWith('s') ? word.slice(0, -1) : word
}

export function pluralize(root: string) {
    return root + 's'
}