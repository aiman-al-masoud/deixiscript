// import { ask } from "./ask.ts";
// import { $ } from "./exp-builder.ts";
// import { removeImplicit } from "./removeImplicit.ts";
// import { tell } from "./tell.ts";
// import { ArbitraryType } from "./types.ts";

// //this has the potential to be used in removeImplicit() (as well as maxSpecificity sort of derivation clauses)

// // get all anaphors in AST, start with first, convert to ArbitraryType,
// // go to second, check if it matches, etc...

// // what about match()

// export function isADerivableFromB(a: ArbitraryType, b: ArbitraryType) {
//     const kb = tell($(b).exists.$, $.emptyKb).kb
//     return !!ask($(a).exists.$, kb).result.value
// }

// const x = isADerivableFromB(
//     removeImplicit($.the('cat').whose($('fur').has('red').as('color')).$),
//     removeImplicit($.the('cat').$),
// )

// const y = isADerivableFromB(
//     removeImplicit($.the('cat').$),
//     removeImplicit($.the('cat').whose($('fur').has('red').as('color')).$),
// )


// console.log(x)
// console.log(y)





