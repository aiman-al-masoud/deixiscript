import { biblios } from "./bib.ts";

biblios.forEach(x => {
        console.log('#', x.title)
        console.log('## Year:', x.year)
        x.link.forEach((l,i) => {
                console.log('-', l.url)
        })
        console.log('\n')
})