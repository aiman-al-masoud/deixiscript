import BasicBrain from "../brain/BasicBrain";
import { getBrain } from "../brain/Brain";
import { clauseOf } from "../clauses/Clause";
import { getKool } from "../clauses/functions/getKool";

export function wrapperGetTester() {

    const brain = getBrain({ root: document.body }) as BasicBrain

    brain.execute('x is a red button')

    const x = brain.context.enviro.get('id16')

    const style = x?.get(clauseOf({ root: 'style', type: 'noun' }, 1))

    console.log(style)

    const bg = style?.get(clauseOf({ root: 'background', type: 'noun' }, 1))

    console.log(bg)

    bg?.set({ root: 'green', type: 'adjective', concepts: ['color'] })

    // bg?.set({ root: 'green', type: 'adjective', concepts: ['color'] }, {negated:true})


    const query = clauseOf({ root: 'button', type: 'noun' }, 1)
        .and(clauseOf({ root: 'style', type: 'noun' }, 2))
        .and(clauseOf({ root: 'of', type: 'preposition' }, 2, 1))
        .and(clauseOf({ root: 'background', type: 'noun' }, 3))
        .and(clauseOf({ root: 'of', type: 'preposition' }, 3, 2))


    console.log(query.toString())
    const y = getKool(brain.context, query, 3)
    console.log(y)

}