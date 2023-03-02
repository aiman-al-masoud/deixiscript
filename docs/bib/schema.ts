export interface schema {

    title: string
    type: 'article' | 'book' | 'documentation' | 'wikipedia' | 'webpage'
    link: { url: string }[]
    year?: string
    publisher?: { name: string }
    author?: { name: string }[]
    identifier?: { type: 'isbn' | 'doi', id: string }[]

}