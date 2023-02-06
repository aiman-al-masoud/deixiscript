import { biblios } from "./bib";

biblios.forEach(x => {
        console.log('#', x.title)
        console.log('## Year:', x.year)
        x.link.forEach(l => {
                console.log('-', l.url)
        })
        console.log('\n')
})