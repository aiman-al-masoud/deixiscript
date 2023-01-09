import { clauseOf } from "../clauses/Clause";
import { wrap } from "../enviro/Wrapper";
import getEnviro from "../enviro/Enviro";

export async function wrapperTest() {

    const enviro = getEnviro()

    enviro.set(0, wrap({}));

    (await enviro.get(0)).set('cat');
    (await enviro.get(0)).set('red')

    const res = await enviro.query(clauseOf('cat', 1).and(clauseOf('red', 1)))

    console.log(res)

}