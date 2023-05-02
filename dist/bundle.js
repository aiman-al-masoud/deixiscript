/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/new-frontend/char-stream.ts":
/*!*********************************************!*\
  !*** ./app/src/new-frontend/char-stream.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCharStream = void 0;
function getCharStream(sourceCode) {
    return new BaseCharStream(sourceCode);
}
exports.getCharStream = getCharStream;
class BaseCharStream {
    constructor(sourceCode, pos = 0) {
        this.sourceCode = sourceCode;
        this.pos = pos;
    }
    next() {
        if (this.isEnd()) {
            return;
        }
        this.pos++;
    }
    peek() {
        return this.sourceCode[this.pos];
    }
    backTo(pos) {
        this.pos = pos;
    }
    getPos() {
        return this.pos;
    }
    isEnd() {
        return this.pos >= this.sourceCode.length;
    }
}


/***/ }),

/***/ "./app/src/new-frontend/csts.ts":
/*!**************************************!*\
  !*** ./app/src/new-frontend/csts.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.isRepeatable = exports.isNecessary = exports.astTypes = exports.roles = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.roles = (0, stringLiterals_1.stringLiterals)('id', 'digits', 'chars', 'pluralizer', 'anaphoraOperator', 'newOperator', 'modifiers', 'head', 'limitKeyword', 'limitNumber', 'leftOperand', 'rightOperand', 'operator', 'owner', 'object', 'receiver', 'instrument', 'subject', 'verb', 'negation', 'condition', 'consequence', 'subordinating-conjunction');
exports.astTypes = (0, stringLiterals_1.stringLiterals)('space', 'identifier', 'string-literal', 'number-literal', 'expression', // and-expression
'math-expression', 'noun-phrase', 'limit-phrase', 'math-expression', 'complex-sentence', 'simple-sentence', 'genitive', 'dative', 'instrumental', 'accusative', 'verb', 'copula', 'do-verb', 'complement', 'complex-sentence-one', 'complex-sentence-two');
const isNecessary = (c) => c === undefined // necessary by default
    || c == '+'
    || +c >= 1;
exports.isNecessary = isNecessary;
const isRepeatable = (c) => c == '+'
    || c == '*'
    || c === 'all-but-last';
exports.isRepeatable = isRepeatable;
exports.syntaxes = {
    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
    ],
    'number-literal': [
        { number: '+', role: 'digits', literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'string-literal': [
        { literals: ['"'] },
        { anyCharExceptFor: ['"'], literals: [], role: 'chars', number: '*' },
        { literals: ['"'] },
    ],
    'noun-phrase': [
        { literals: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        { types: ['space'] },
        { literals: ['the', 'old'], role: 'anaphoraOperator', number: '1|0' },
        { types: ['space'] },
        { literals: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        { types: ['space'] },
        { types: ['limit-phrase'], expand: true, number: '1|0' },
        { types: ['space'] },
        { types: ['identifier'], role: 'modifiers', sep: 'space', number: 'all-but-last' },
        { types: ['space'] },
        { types: ['identifier', 'string-literal', 'number-literal'], role: 'head', number: 1 },
        { literals: ['s'], role: 'pluralizer', number: '1|0' },
        { types: ['space'] },
        { types: ['genitive'], expand: true, number: '1|0' },
    ],
    'limit-phrase': [
        { literals: ['first', 'last'], role: 'limitKeyword', number: 1 },
        { types: ['space'] },
        { types: ['number-literal'], role: 'limitNumber', number: '1|0' },
    ],
    'math-expression': [
        { types: ['noun-phrase'], role: 'leftOperand' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/'], role: 'operator', number: '1|0' },
        { types: ['space'], number: '*' },
        { types: ['noun-phrase'], role: 'rightOperand', number: '1|0' }
    ],
    "expression": [
        { types: ['math-expression'], role: 'leftOperand' },
        { types: ['space'] },
        { literals: ['and'], number: '1|0' },
        { types: ['space'] },
        { types: ['math-expression'], role: 'rightOperand', number: '1|0' }
    ],
    'genitive': [
        { literals: ['of'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'owner', number: 1 },
    ],
    'accusative': [
        { types: ['noun-phrase'], role: 'object', number: 1 },
    ],
    'dative': [
        { literals: ['to'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'receiver', number: 1 },
    ],
    'instrumental': [
        { literals: ['by'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'instrument', number: 1 },
    ],
    'complement': [
        { types: ['accusative', 'dative', 'instrumental'], expand: true, number: '*' }
    ],
    'simple-sentence': [
        { types: ['expression'], role: 'subject', number: '1|0' },
        { types: ['space'] },
        { types: ['verb'], expand: true },
        { types: ['space'] },
        { types: ['complement'], number: '*', expand: true },
    ],
    verb: [
        { types: ['copula', 'do-verb'], expand: true }
    ],
    'do-verb': [
        { literals: ['do', 'does'] },
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'verb' }
    ],
    copula: [
        { literals: ['is', 'be', 'are'], role: 'verb' },
        { literals: ['not'], role: 'negation', number: '1|0' },
    ],
    'complex-sentence': [
        { types: ['complex-sentence-one', 'complex-sentence-two'], expand: true }
    ],
    'complex-sentence-one': [
        { literals: ['if', 'when'], role: 'subordinating-conjunction' },
        { types: ['simple-sentence'], role: 'condition' },
        { literals: ['then', ','] },
        { types: ['simple-sentence'], role: 'consequence' },
    ],
    'complex-sentence-two': [
        { types: ['simple-sentence'], role: 'consequence' },
        { literals: ['if', 'when'], role: 'subordinating-conjunction' },
        { types: ['simple-sentence'], role: 'condition' },
    ]
};


/***/ }),

/***/ "./app/src/new-frontend/parser.ts":
/*!****************************************!*\
  !*** ./app/src/new-frontend/parser.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseSyntax = exports.parseTry = void 0;
const first_1 = __webpack_require__(/*! ../utils/first */ "./app/src/utils/first.ts");
const csts_1 = __webpack_require__(/*! ./csts */ "./app/src/new-frontend/csts.ts");
function parseTry(syntaxList, cs) {
    for (const syntaxName of syntaxList) {
        const memento = cs.getPos();
        const syntax = csts_1.syntaxes[syntaxName]; // state!
        const tree = parseSyntax(syntax, cs);
        if (tree) {
            return tree; //{ ...tree, type: syntaxName } as SyntaxTree // remove cast // TODO: add type
        }
        cs.backTo(memento);
    }
}
exports.parseTry = parseTry;
function parseSyntax(syntax, cs) {
    const ast = {};
    for (const member of syntax) {
        const node = parseMemberRepeated(member, cs);
        if (!node && (0, csts_1.isNecessary)(member.number)) {
            return undefined;
        }
        if (!node) { // and not isNecessary
            continue;
        }
        //TODO expand probably goes here
        if (member.role) {
            ast[member.role] = node;
        }
    }
    return ast;
}
exports.parseSyntax = parseSyntax;
function parseMemberRepeated(member, cs) {
    // isNecessary has already been taken care of
    const list = [];
    let memento = cs.getPos();
    while (!cs.isEnd()) {
        memento = cs.getPos();
        const st = parseMemberSingle(member, cs);
        if (!st && !list.length) {
            return undefined;
        }
        if (!st) {
            break;
        }
        if (!(0, csts_1.isRepeatable)(member.number)) {
            return st;
        }
        list.push(st);
        if (member.sep) {
            parseMemberSingle({ types: [member.sep] }, cs);
        }
    }
    if (member.number === 'all-but-last') {
        list.pop();
        cs.backTo(memento);
    }
    return list;
}
function parseMemberSingle(member, cs) {
    // doesn't have to take care about number
    if (member.literals) {
        return parseLiteral(member, cs);
    }
    else {
        return parseTry(member.types, cs);
    }
}
function parseLiteral(member, cs) {
    if (member.anyCharExceptFor) {
        return parseChar(member, cs);
    }
    const singleLetterLiterals = member.literals.filter(x => x.length <= 1);
    const r1 = (0, first_1.first)(singleLetterLiterals, x => parseChar({ literals: [x] }, cs));
    if (r1) {
        return r1;
    }
    const multiLetterLiterals = member.literals
        .filter(x => x.length > 1)
        .map(x => x.split('').map(c => ({ literals: [c] })));
    const r2 = (0, first_1.first)(multiLetterLiterals, x => parseSyntax(x, cs));
    if (r2) {
        return r2;
    }
}
function parseChar(leaf, cs) {
    const char = cs.peek();
    if (leaf.literals.includes(char)
        || leaf.anyCharExceptFor && !leaf.anyCharExceptFor.includes(char)) {
        cs.next();
        return char;
    }
}


/***/ }),

/***/ "./app/src/utils/first.ts":
/*!********************************!*\
  !*** ./app/src/utils/first.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.first = void 0;
/**
 *
 * Apply predicate to each element e in the iterable, stop when
 * you find a non-nullish image of e, and return the image.
 */
function first(iterable, predicate) {
    for (const e of iterable) {
        const maybeResult = predicate(e);
        if (maybeResult !== undefined && maybeResult !== null) {
            return maybeResult;
        }
    }
}
exports.first = first;


/***/ }),

/***/ "./app/src/utils/stringLiterals.ts":
/*!*****************************************!*\
  !*** ./app/src/utils/stringLiterals.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringLiterals = void 0;
function stringLiterals(...args) { return args; }
exports.stringLiterals = stringLiterals;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
// import main from "./src/main/main";
const char_stream_1 = __webpack_require__(/*! ./src/new-frontend/char-stream */ "./app/src/new-frontend/char-stream.ts");
const parser_1 = __webpack_require__(/*! ./src/new-frontend/parser */ "./app/src/new-frontend/parser.ts");
// main()
// EXAMPLE 0 
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
// const y = tryParse(['space'], cs)
// const z = tryParse(['identifier'], cs)
// console.log(x, y, z)
// EXAMPLE 1
const cs = (0, char_stream_1.getCharStream)('12    mondo ');
const x = (0, parser_1.parseTry)(['number-literal'], cs);
console.log(x);
// EXAMPLE 2
const cs2 = (0, char_stream_1.getCharStream)('do not make '); // also try without not
const x2 = (0, parser_1.parseTry)(['do-verb'], cs2);
console.log(x2);
// EXAMPLE 3
const cs3 = (0, char_stream_1.getCharStream)('" ciao "xxx');
const x3 = (0, parser_1.parseTry)(['string-literal'], cs3);
console.log(x3);
// EXAMPLE 4
const cs4 = (0, char_stream_1.getCharStream)('ciao mondo buruf');
const x4 = (0, parser_1.parseSyntax)([{ types: ['identifier'], sep: 'space', number: 'all-but-last', role: 'anything' }], cs4);
const x40 = (0, parser_1.parseTry)(['identifier'], cs4);
console.log(x4, x40);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUF3QkEsU0FBZ0IsYUFBYSxDQUFDLFVBQWtCO0lBQzVDLE9BQU8sSUFBSSxjQUFjLENBQUMsVUFBVSxDQUFDO0FBQ3pDLENBQUM7QUFGRCxzQ0FFQztBQUVELE1BQU0sY0FBYztJQUVoQixZQUNhLFVBQWtCLEVBQ2pCLE1BQU0sQ0FBQztRQURSLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDakIsUUFBRyxHQUFILEdBQUcsQ0FBSTtJQUdyQixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ2QsT0FBTTtTQUNUO1FBRUQsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUNkLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDcEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0lBQ2xCLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsR0FBRztJQUNuQixDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU07SUFDN0MsQ0FBQztDQUVKOzs7Ozs7Ozs7Ozs7OztBQzVERCxpSEFBd0Q7QUFLM0MsYUFBSyxHQUFHLG1DQUFjLEVBQy9CLElBQUksRUFDSixRQUFRLEVBQ1IsT0FBTyxFQUNQLFlBQVksRUFDWixrQkFBa0IsRUFDbEIsYUFBYSxFQUNiLFdBQVcsRUFDWCxNQUFNLEVBQ04sY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQ2IsY0FBYyxFQUNkLFVBQVUsRUFDVixPQUFPLEVBQ1AsUUFBUSxFQUNSLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEVBQ1YsV0FBVyxFQUNYLGFBQWEsRUFDYiwyQkFBMkIsQ0FDOUI7QUEyQlksZ0JBQVEsR0FBRyxtQ0FBYyxFQUNsQyxPQUFPLEVBQ1AsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsWUFBWSxFQUFFLGlCQUFpQjtBQUMvQixpQkFBaUIsRUFDakIsYUFBYSxFQUNiLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixVQUFVLEVBQ1YsUUFBUSxFQUNSLGNBQWMsRUFDZCxZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsWUFBWSxFQUNaLHNCQUFzQixFQUN0QixzQkFBc0IsQ0FDekI7QUFRTSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQzNDLENBQUMsS0FBSyxTQUFTLENBQUMsdUJBQXVCO09BQ3BDLENBQUMsSUFBSSxHQUFHO09BQ1IsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUhELG1CQUFXLGVBR1Y7QUFFUCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQzVDLENBQUMsSUFBSSxHQUFHO09BQ0wsQ0FBQyxJQUFJLEdBQUc7T0FDUixDQUFDLEtBQUssY0FBYztBQUhkLG9CQUFZLGdCQUdFO0FBRWQsZ0JBQVEsR0FBK0I7SUFFaEQsS0FBSyxFQUFFO1FBQ0gsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7S0FDL0M7SUFDRCxVQUFVLEVBQUU7UUFDUixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7S0FDNUs7SUFDRCxnQkFBZ0IsRUFBRTtRQUNkLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0tBQ2hHO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDZCxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNyRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0tBQ3RCO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsRUFBRSxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1FBQ2pFLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDckUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQixFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1FBQ3BFLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDeEQsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQixFQUFFLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFO1FBQ2xGLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDdEYsRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDdEQsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQixFQUFFLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtLQUN2RDtJQUNELGNBQWMsRUFBRTtRQUNaLEVBQUUsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUNoRSxFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7S0FDcEU7SUFDRCxpQkFBaUIsRUFBRTtRQUNmLEVBQUUsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTtRQUMvQyxFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDbkUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLEVBQUUsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ2xFO0lBQ0QsWUFBWSxFQUFFO1FBQ1YsRUFBRSxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7UUFDbkQsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQixFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDcEMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNwQixFQUFFLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ3RFO0lBRUQsVUFBVSxFQUFFO1FBQ1IsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQixFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0tBQ3ZEO0lBRUQsWUFBWSxFQUFFO1FBQ1YsRUFBRSxLQUFLLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7S0FDeEQ7SUFFRCxRQUFRLEVBQUU7UUFDTixFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7S0FDMUQ7SUFFRCxjQUFjLEVBQUU7UUFDWixFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7S0FDNUQ7SUFFRCxZQUFZLEVBQUU7UUFDVixFQUFFLEtBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0tBQ2pGO0lBRUQsaUJBQWlCLEVBQUU7UUFDZixFQUFFLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtRQUN6RCxFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtRQUNqQyxFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO0tBQ3ZEO0lBRUQsSUFBSSxFQUFFO1FBQ0YsRUFBRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtLQUNqRDtJQUVELFNBQVMsRUFBRTtRQUNQLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQzVCLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtRQUNuQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtRQUN0RCxFQUFFLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDbkMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0tBQzFDO0lBRUQsTUFBTSxFQUFFO1FBQ0osRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDL0MsRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7S0FDekQ7SUFFRCxrQkFBa0IsRUFBRTtRQUNoQixFQUFFLEtBQUssRUFBRSxDQUFDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtLQUM1RTtJQUVELHNCQUFzQixFQUFFO1FBQ3BCLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRTtRQUMvRCxFQUFFLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtRQUNqRCxFQUFFLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtRQUMzQixFQUFFLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTtLQUN0RDtJQUVELHNCQUFzQixFQUFFO1FBQ3BCLEVBQUUsS0FBSyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO1FBQ25ELEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSwyQkFBMkIsRUFBRTtRQUMvRCxFQUFFLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtLQUNwRDtDQUNKOzs7Ozs7Ozs7Ozs7OztBQ3hORCxzRkFBdUM7QUFFdkMsbUZBQTJHO0FBUzNHLFNBQWdCLFFBQVEsQ0FBQyxVQUFxQixFQUFFLEVBQWM7SUFFMUQsS0FBSyxNQUFNLFVBQVUsSUFBSSxVQUFVLEVBQUU7UUFFakMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUMzQixNQUFNLE1BQU0sR0FBRyxlQUFRLENBQUMsVUFBVSxDQUFDLEVBQUMsU0FBUztRQUM3QyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUVwQyxJQUFJLElBQUksRUFBRTtZQUNOLE9BQU8sSUFBSSxFQUFDLDhFQUE4RTtTQUM3RjtRQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0tBQ3JCO0FBRUwsQ0FBQztBQWZELDRCQWVDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE1BQWMsRUFBRSxFQUFjO0lBRXRELE1BQU0sR0FBRyxHQUFZLEVBQUU7SUFFdkIsS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLEVBQUU7UUFFekIsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUU1QyxJQUFJLENBQUMsSUFBSSxJQUFJLHNCQUFXLEVBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sU0FBUztTQUNuQjtRQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxzQkFBc0I7WUFDL0IsU0FBUTtTQUNYO1FBRUQsZ0NBQWdDO1FBRWhDLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTtZQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtTQUMxQjtLQUVKO0lBRUQsT0FBTyxHQUFHO0FBRWQsQ0FBQztBQTFCRCxrQ0EwQkM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE1BQWMsRUFBRSxFQUFjO0lBQ3ZELDZDQUE2QztJQUU3QyxNQUFNLElBQUksR0FBYyxFQUFFO0lBQzFCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFFekIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUVoQixPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUNyQixNQUFNLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1FBRXhDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JCLE9BQU8sU0FBUztTQUNuQjtRQUVELElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDTCxNQUFLO1NBQ1I7UUFFRCxJQUFJLENBQUMsdUJBQVksRUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDOUIsT0FBTyxFQUFFO1NBQ1o7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUViLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNaLGlCQUFpQixDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1NBQ2pEO0tBRUo7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssY0FBYyxFQUFFO1FBQ2xDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDVixFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztLQUNyQjtJQUVELE9BQU8sSUFBSTtBQUNmLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxFQUFjO0lBQ3JELHlDQUF5QztJQUV6QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDakIsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztLQUNsQztTQUFNO1FBQ0gsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7S0FDcEM7QUFDTCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBcUIsRUFBRSxFQUFjO0lBRXZELElBQUksTUFBTSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7S0FDL0I7SUFFRCxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDdkUsTUFBTSxFQUFFLEdBQUcsaUJBQUssRUFBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFN0UsSUFBSSxFQUFFLEVBQUU7UUFDSixPQUFPLEVBQUU7S0FDWjtJQUVELE1BQU0sbUJBQW1CLEdBQWEsTUFBTSxDQUFDLFFBQVE7U0FDaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDekIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFeEQsTUFBTSxFQUFFLEdBQUcsaUJBQUssRUFBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFOUQsSUFBSSxFQUFFLEVBQUU7UUFDSixPQUFPLEVBQUU7S0FDWjtBQUVMLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFtQyxFQUFFLEVBQWM7SUFFbEUsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRTtJQUV0QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUN6QixJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25FLEVBQUUsQ0FBQyxJQUFJLEVBQUU7UUFDVCxPQUFPLElBQUk7S0FDZDtBQUVMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDNUlEOzs7O0dBSUc7QUFDSCxTQUFnQixLQUFLLENBQU8sUUFBYSxFQUFFLFNBQXNCO0lBRTdELEtBQUssTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFaEMsSUFBSSxXQUFXLEtBQUssU0FBUyxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDbkQsT0FBTyxXQUFXO1NBQ3JCO0tBQ0o7QUFFTCxDQUFDO0FBVkQsc0JBVUM7Ozs7Ozs7Ozs7Ozs7O0FDZkQsU0FBZ0IsY0FBYyxDQUFtQixHQUFHLElBQVMsSUFBUyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFBcEYsd0NBQW9GOzs7Ozs7O1VDQXBGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSxzQ0FBc0M7QUFDdEMseUhBQStEO0FBQy9ELDBHQUFrRTtBQUVsRSxTQUFTO0FBRVQsYUFBYTtBQUNiLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0Msb0NBQW9DO0FBQ3BDLHlDQUF5QztBQUN6Qyx1QkFBdUI7QUFFdkIsWUFBWTtBQUNaLE1BQU0sRUFBRSxHQUFHLCtCQUFhLEVBQUMsY0FBYyxDQUFDO0FBQ3hDLE1BQU0sQ0FBQyxHQUFHLHFCQUFRLEVBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNkLFlBQVk7QUFDWixNQUFNLEdBQUcsR0FBRywrQkFBYSxFQUFDLGNBQWMsQ0FBQyx5QkFBdUI7QUFDaEUsTUFBTSxFQUFFLEdBQUcscUJBQVEsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNmLFlBQVk7QUFDWixNQUFNLEdBQUcsR0FBRywrQkFBYSxFQUFDLGFBQWEsQ0FBQztBQUN4QyxNQUFNLEVBQUUsR0FBRyxxQkFBUSxFQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLENBQUM7QUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDZixZQUFZO0FBQ1osTUFBTSxHQUFHLEdBQUcsK0JBQWEsRUFBQyxrQkFBa0IsQ0FBQztBQUM3QyxNQUFNLEVBQUUsR0FBRyx3QkFBVyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQWlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUN2SCxNQUFNLEdBQUcsR0FBRyxxQkFBUSxFQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NzdHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZmlyc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgQ2hhclN0cmVhbSB7XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpZiBhbnkuXG4gICAgICovXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgLyoqXG4gICAgICogUmVhZCB0aGUgY3VycmVudCBjaGFyYWN0ZXIuXG4gICAgICovXG4gICAgcGVlaygpOiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBHbyBiYWNrLlxuICAgICAqL1xuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0UG9zKCk6IG51bWJlclxuICAgIC8qKlxuICAgICAqIFJlYWNoZWQgZW5kIG9mIGNoYXJzdHJlYW0uXG4gICAgICovXG4gICAgaXNFbmQoKTogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhclN0cmVhbShzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEJhc2VDaGFyU3RyZWFtKHNvdXJjZUNvZGUpXG59XG5cbmNsYXNzIEJhc2VDaGFyU3RyZWFtIGltcGxlbWVudHMgQ2hhclN0cmVhbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcG9zID0gMCxcbiAgICApIHtcblxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5kKCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wb3MrK1xuICAgIH1cblxuICAgIHBlZWsoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlQ29kZVt0aGlzLnBvc11cbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXRQb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zXG4gICAgfVxuXG4gICAgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnNvdXJjZUNvZGUubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBTeW50YXggPSBNZW1iZXJbXSAvLyBDc3RNb2RlbFxuXG5cbmV4cG9ydCBjb25zdCByb2xlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdpZCcsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2NoYXJzJyxcbiAgICAncGx1cmFsaXplcicsXG4gICAgJ2FuYXBob3JhT3BlcmF0b3InLFxuICAgICduZXdPcGVyYXRvcicsXG4gICAgJ21vZGlmaWVycycsXG4gICAgJ2hlYWQnLFxuICAgICdsaW1pdEtleXdvcmQnLFxuICAgICdsaW1pdE51bWJlcicsXG4gICAgJ2xlZnRPcGVyYW5kJyxcbiAgICAncmlnaHRPcGVyYW5kJyxcbiAgICAnb3BlcmF0b3InLFxuICAgICdvd25lcicsXG4gICAgJ29iamVjdCcsXG4gICAgJ3JlY2VpdmVyJyxcbiAgICAnaW5zdHJ1bWVudCcsXG4gICAgJ3N1YmplY3QnLFxuICAgICd2ZXJiJyxcbiAgICAnbmVnYXRpb24nLFxuICAgICdjb25kaXRpb24nLFxuICAgICdjb25zZXF1ZW5jZScsXG4gICAgJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nLCAvLyBCQURcbilcblxuZXhwb3J0IHR5cGUgUm9sZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiByb2xlcz5cblxuXG50eXBlIEJhc2VNZW1iZXIgPSB7XG4gICAgcmVhZG9ubHkgbnVtYmVyPzogQ2FyZGluYWxpdHkgLy8gbm8gbnVtYmVyIC0tLT4gMVxuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlIC8vIG5vIHJvbGUgLS0+IGV4Y2x1ZGUgZnJvbSBhc3RcbiAgICByZWFkb25seSBzZXA/OiBBc3RUeXBlXG59XG5cbmV4cG9ydCB0eXBlIExpdGVyYWxNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IGxpdGVyYWxzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHR5cGVzPzogdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgYW55Q2hhckV4Y2VwdEZvcj86IHN0cmluZ1tdXG59XG5cbmV4cG9ydCB0eXBlIFR5cGVNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IHR5cGVzOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBsaXRlcmFscz86IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGV4cGFuZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgTWVtYmVyID0gTGl0ZXJhbE1lbWJlciB8IFR5cGVNZW1iZXJcblxuZXhwb3J0IHR5cGUgQXN0VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBhc3RUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGFzdFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ3NwYWNlJyxcbiAgICAnaWRlbnRpZmllcicsXG4gICAgJ3N0cmluZy1saXRlcmFsJyxcbiAgICAnbnVtYmVyLWxpdGVyYWwnLFxuICAgICdleHByZXNzaW9uJywgLy8gYW5kLWV4cHJlc3Npb25cbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnbm91bi1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJyxcbiAgICAnZ2VuaXRpdmUnLFxuICAgICdkYXRpdmUnLFxuICAgICdpbnN0cnVtZW50YWwnLFxuICAgICdhY2N1c2F0aXZlJyxcbiAgICAndmVyYicsXG4gICAgJ2NvcHVsYScsXG4gICAgJ2RvLXZlcmInLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLXR3bycsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4gICAgfHwgYyA9PT0gJ2FsbC1idXQtbGFzdCdcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgbGl0ZXJhbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJywgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsICd3JywgJ3gnLCAneScsICd6J10gfVxuICAgIF0sXG4gICAgJ251bWJlci1saXRlcmFsJzogW1xuICAgICAgICB7IG51bWJlcjogJysnLCByb2xlOiAnZGlnaXRzJywgbGl0ZXJhbHM6IFsnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddIH1cbiAgICBdLFxuICAgICdzdHJpbmctbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgICAgIHsgYW55Q2hhckV4Y2VwdEZvcjogWydcIiddLCBsaXRlcmFsczogW10sIHJvbGU6ICdjaGFycycsIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgIF0sXG4gICAgJ25vdW4tcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2V2ZXJ5JywgJ2FueSddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlJywgJ29sZCddLCByb2xlOiAnYW5hcGhvcmFPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYScsICdhbicsICduZXcnXSwgcm9sZTogJ25ld09wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydsaW1pdC1waHJhc2UnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ21vZGlmaWVycycsIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJywgJ3N0cmluZy1saXRlcmFsJywgJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdoZWFkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsncyddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZ2VuaXRpdmUnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2ZpcnN0JywgJ2xhc3QnXSwgcm9sZTogJ2xpbWl0S2V5d29yZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnbGltaXROdW1iZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ3JpZ2h0T3BlcmFuZCcsIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgXCJleHByZXNzaW9uXCI6IFtcbiAgICAgICAgeyB0eXBlczogWydtYXRoLWV4cHJlc3Npb24nXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydhbmQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydtYXRoLWV4cHJlc3Npb24nXSwgcm9sZTogJ3JpZ2h0T3BlcmFuZCcsIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG5cbiAgICAnZ2VuaXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnb2YnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb3duZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2FjY3VzYXRpdmUnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ29iamVjdCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnZGF0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RvJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ3JlY2VpdmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdpbnN0cnVtZW50YWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYnknXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnaW5zdHJ1bWVudCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcbiAgICAgICAgeyB0eXBlczogWydhY2N1c2F0aXZlJywgJ2RhdGl2ZScsICdpbnN0cnVtZW50YWwnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcqJyB9XG4gICAgXSxcblxuICAgICdzaW1wbGUtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZXhwcmVzc2lvbiddLCByb2xlOiAnc3ViamVjdCcsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndmVyYiddLCBleHBhbmQ6IHRydWUgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJywgZXhwYW5kOiB0cnVlIH0sXG4gICAgXSxcblxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG5cbiAgICAnZG8tdmVyYic6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydkbycsICdkb2VzJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF1cbn0iLCJpbXBvcnQgeyBmaXJzdCB9IGZyb20gXCIuLi91dGlscy9maXJzdFwiO1xuaW1wb3J0IHsgQ2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgc3ludGF4ZXMsIEFzdFR5cGUgfSBmcm9tIFwiLi9jc3RzXCI7XG5cbnR5cGUgQXN0Tm9kZSA9XG4gICAgc3RyaW5nXG4gICAgfCBzdHJpbmdbXVxuICAgIHwgQXN0Tm9kZVtdXG4gICAgfCB7IFt4IGluIFJvbGVdPzogQXN0Tm9kZSB9XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJ5KHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgY3M6IENoYXJTdHJlYW0pIHtcblxuICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IGNzLmdldFBvcygpXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHN5bnRheGVzW3N5bnRheE5hbWVdIC8vIHN0YXRlIVxuICAgICAgICBjb25zdCB0cmVlID0gcGFyc2VTeW50YXgoc3ludGF4LCBjcylcblxuICAgICAgICBpZiAodHJlZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRyZWUgLy97IC4uLnRyZWUsIHR5cGU6IHN5bnRheE5hbWUgfSBhcyBTeW50YXhUcmVlIC8vIHJlbW92ZSBjYXN0IC8vIFRPRE86IGFkZCB0eXBlXG4gICAgICAgIH1cblxuICAgICAgICBjcy5iYWNrVG8obWVtZW50bylcbiAgICB9XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3ludGF4KHN5bnRheDogU3ludGF4LCBjczogQ2hhclN0cmVhbSk6IEFzdE5vZGUgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3QgYXN0OiBBc3ROb2RlID0ge31cblxuICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHN5bnRheCkge1xuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgY3MpXG5cbiAgICAgICAgaWYgKCFub2RlICYmIGlzTmVjZXNzYXJ5KG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW5vZGUpIHsgLy8gYW5kIG5vdCBpc05lY2Vzc2FyeVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETyBleHBhbmQgcHJvYmFibHkgZ29lcyBoZXJlXG5cbiAgICAgICAgaWYgKG1lbWJlci5yb2xlKSB7XG4gICAgICAgICAgICBhc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gYXN0XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBBc3ROb2RlIHwgQXN0Tm9kZVtdIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBpc05lY2Vzc2FyeSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuIGNhcmUgb2ZcblxuICAgIGNvbnN0IGxpc3Q6IEFzdE5vZGVbXSA9IFtdXG4gICAgbGV0IG1lbWVudG8gPSBjcy5nZXRQb3MoKVxuXG4gICAgd2hpbGUgKCFjcy5pc0VuZCgpKSB7XG5cbiAgICAgICAgbWVtZW50byA9IGNzLmdldFBvcygpXG4gICAgICAgIGNvbnN0IHN0ID0gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyLCBjcylcblxuICAgICAgICBpZiAoIXN0ICYmICFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdCkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3QucHVzaChzdClcblxuICAgICAgICBpZiAobWVtYmVyLnNlcCkge1xuICAgICAgICAgICAgcGFyc2VNZW1iZXJTaW5nbGUoeyB0eXBlczogW21lbWJlci5zZXBdIH0sIGNzKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpZiAobWVtYmVyLm51bWJlciA9PT0gJ2FsbC1idXQtbGFzdCcpIHtcbiAgICAgICAgbGlzdC5wb3AoKVxuICAgICAgICBjcy5iYWNrVG8obWVtZW50bylcbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFxufVxuXG5mdW5jdGlvbiBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBkb2Vzbid0IGhhdmUgdG8gdGFrZSBjYXJlIGFib3V0IG51bWJlclxuXG4gICAgaWYgKG1lbWJlci5saXRlcmFscykge1xuICAgICAgICByZXR1cm4gcGFyc2VMaXRlcmFsKG1lbWJlciwgY3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlVHJ5KG1lbWJlci50eXBlcywgY3MpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZUxpdGVyYWwobWVtYmVyOiBMaXRlcmFsTWVtYmVyLCBjczogQ2hhclN0cmVhbSk6IEFzdE5vZGUgfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKG1lbWJlci5hbnlDaGFyRXhjZXB0Rm9yKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUNoYXIobWVtYmVyLCBjcylcbiAgICB9XG5cbiAgICBjb25zdCBzaW5nbGVMZXR0ZXJMaXRlcmFscyA9IG1lbWJlci5saXRlcmFscy5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA8PSAxKVxuICAgIGNvbnN0IHIxID0gZmlyc3Qoc2luZ2xlTGV0dGVyTGl0ZXJhbHMsIHggPT4gcGFyc2VDaGFyKHsgbGl0ZXJhbHM6IFt4XSB9LCBjcykpXG5cbiAgICBpZiAocjEpIHtcbiAgICAgICAgcmV0dXJuIHIxXG4gICAgfVxuXG4gICAgY29uc3QgbXVsdGlMZXR0ZXJMaXRlcmFsczogU3ludGF4W10gPSBtZW1iZXIubGl0ZXJhbHNcbiAgICAgICAgLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMSlcbiAgICAgICAgLm1hcCh4ID0+IHguc3BsaXQoJycpLm1hcChjID0+ICh7IGxpdGVyYWxzOiBbY10gfSkpKVxuXG4gICAgY29uc3QgcjIgPSBmaXJzdChtdWx0aUxldHRlckxpdGVyYWxzLCB4ID0+IHBhcnNlU3ludGF4KHgsIGNzKSlcblxuICAgIGlmIChyMikge1xuICAgICAgICByZXR1cm4gcjJcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VDaGFyKGxlYWY6IE9taXQ8TGl0ZXJhbE1lbWJlciwgJ251bWJlcic+LCBjczogQ2hhclN0cmVhbSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBjaGFyID0gY3MucGVlaygpXG5cbiAgICBpZiAobGVhZi5saXRlcmFscy5pbmNsdWRlcyhjaGFyKVxuICAgICAgICB8fCBsZWFmLmFueUNoYXJFeGNlcHRGb3IgJiYgIWxlYWYuYW55Q2hhckV4Y2VwdEZvci5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICBjcy5uZXh0KClcbiAgICAgICAgcmV0dXJuIGNoYXJcbiAgICB9XG5cbn0iLCIvKipcbiAqIFxuICogQXBwbHkgcHJlZGljYXRlIHRvIGVhY2ggZWxlbWVudCBlIGluIHRoZSBpdGVyYWJsZSwgc3RvcCB3aGVuIFxuICogeW91IGZpbmQgYSBub24tbnVsbGlzaCBpbWFnZSBvZiBlLCBhbmQgcmV0dXJuIHRoZSBpbWFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0PFQsIFU+KGl0ZXJhYmxlOiBUW10sIHByZWRpY2F0ZTogKHg6IFQpID0+IFUpOiBVIHwgdW5kZWZpbmVkIHtcblxuICAgIGZvciAoY29uc3QgZSBvZiBpdGVyYWJsZSkge1xuICAgICAgICBjb25zdCBtYXliZVJlc3VsdCA9IHByZWRpY2F0ZShlKVxuXG4gICAgICAgIGlmIChtYXliZVJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIG1heWJlUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVSZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBwYXJzZVN5bnRheCwgcGFyc2VUcnkgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuXG4vLyBtYWluKClcblxuLy8gRVhBTVBMRSAwIFxuLy8gY29uc3QgY3MgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeCA9IHRyeVBhcnNlKFsnbnVtYmVyLWxpdGVyYWwnXSwgY3MpXG4vLyBjb25zdCB5ID0gdHJ5UGFyc2UoWydzcGFjZSddLCBjcylcbi8vIGNvbnN0IHogPSB0cnlQYXJzZShbJ2lkZW50aWZpZXInXSwgY3MpXG4vLyBjb25zb2xlLmxvZyh4LCB5LCB6KVxuXG4vLyBFWEFNUExFIDFcbmNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbmNvbnN0IHggPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuY29uc29sZS5sb2coeClcbi8vIEVYQU1QTEUgMlxuY29uc3QgY3MyID0gZ2V0Q2hhclN0cmVhbSgnZG8gbm90IG1ha2UgJykvLyBhbHNvIHRyeSB3aXRob3V0IG5vdFxuY29uc3QgeDIgPSBwYXJzZVRyeShbJ2RvLXZlcmInXSwgY3MyKVxuY29uc29sZS5sb2coeDIpXG4vLyBFWEFNUExFIDNcbmNvbnN0IGNzMyA9IGdldENoYXJTdHJlYW0oJ1wiIGNpYW8gXCJ4eHgnKVxuY29uc3QgeDMgPSBwYXJzZVRyeShbJ3N0cmluZy1saXRlcmFsJ10sIGNzMylcbmNvbnNvbGUubG9nKHgzKVxuLy8gRVhBTVBMRSA0XG5jb25zdCBjczQgPSBnZXRDaGFyU3RyZWFtKCdjaWFvIG1vbmRvIGJ1cnVmJylcbmNvbnN0IHg0ID0gcGFyc2VTeW50YXgoW3sgdHlwZXM6IFsnaWRlbnRpZmllciddLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcsIHJvbGU6ICdhbnl0aGluZycgYXMgYW55IH1dLCBjczQpXG5jb25zdCB4NDAgPSBwYXJzZVRyeShbJ2lkZW50aWZpZXInXSwgY3M0KVxuY29uc29sZS5sb2coeDQsIHg0MClcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9