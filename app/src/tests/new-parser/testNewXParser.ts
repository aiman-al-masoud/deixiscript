import { getParser } from "./Parser";

//////////////////////////////////////

export default function testNewXParser() {
    // const x = new KoolParser().parseAll()
    const x = getParser('the cat that is black is red. cat is red if cat is green').parseAll();
    // const x = parse('copulasentence', getLexer('the cat that is black is red'))
    // const x = parse('complexsentence1', getLexer('if the cat is red then the cat is black'))
    console.log(x);

}
