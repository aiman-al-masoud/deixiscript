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
console.log(1, x);
// EXAMPLE 2
const cs2 = (0, char_stream_1.getCharStream)('do not make '); // also try without not
const x2 = (0, parser_1.parseTry)(['do-verb'], cs2);
console.log(2, x2);
// EXAMPLE 3
const cs3 = (0, char_stream_1.getCharStream)('" ciao "xxx');
const x3 = (0, parser_1.parseTry)(['string-literal'], cs3);
console.log(3, x3);
// EXAMPLE 4
const cs4 = (0, char_stream_1.getCharStream)('ciao mondo buruf');
const x4 = (0, parser_1.parseSyntax)([{ types: ['identifier'], sep: 'space', number: 'all-but-last', role: 'anything' }], cs4);
const x40 = (0, parser_1.parseTry)(['identifier'], cs4);
console.log(4, x4, x40);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNaLE1BQU0sRUFBRSxHQUFHLCtCQUFhLEVBQUMsY0FBYyxDQUFDO0FBQ3hDLE1BQU0sQ0FBQyxHQUFHLHFCQUFRLEVBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsWUFBWTtBQUNaLE1BQU0sR0FBRyxHQUFHLCtCQUFhLEVBQUMsY0FBYyxDQUFDLHlCQUF1QjtBQUNoRSxNQUFNLEVBQUUsR0FBRyxxQkFBUSxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsQixZQUFZO0FBQ1osTUFBTSxHQUFHLEdBQUcsK0JBQWEsRUFBQyxhQUFhLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcscUJBQVEsRUFBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNsQixZQUFZO0FBQ1osTUFBTSxHQUFHLEdBQUcsK0JBQWEsRUFBQyxrQkFBa0IsQ0FBQztBQUM3QyxNQUFNLEVBQUUsR0FBRyx3QkFBVyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFVBQWlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUN2SCxNQUFNLEdBQUcsR0FBRyxxQkFBUSxFQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxDQUFDO0FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ZpcnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENoYXJTdHJlYW0ge1xuXG4gICAgLyoqXG4gICAgICogTW92ZSB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaWYgYW55LlxuICAgICAqL1xuICAgIG5leHQoKTogdm9pZFxuICAgIC8qKlxuICAgICAqIFJlYWQgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAqL1xuICAgIHBlZWsoKTogc3RyaW5nXG4gICAgLyoqXG4gICAgICogR28gYmFjay5cbiAgICAgKi9cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqL1xuICAgIGdldFBvcygpOiBudW1iZXJcbiAgICAvKipcbiAgICAgKiBSZWFjaGVkIGVuZCBvZiBjaGFyc3RyZWFtLlxuICAgICAqL1xuICAgIGlzRW5kKCk6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJTdHJlYW0oc291cmNlQ29kZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQ2hhclN0cmVhbShzb3VyY2VDb2RlKVxufVxuXG5jbGFzcyBCYXNlQ2hhclN0cmVhbSBpbXBsZW1lbnRzIENoYXJTdHJlYW0ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHBvcyA9IDAsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0VuZCgpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zKytcbiAgICB9XG5cbiAgICBwZWVrKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUNvZGVbdGhpcy5wb3NdXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0UG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc1xuICAgIH1cblxuICAgIGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy5zb3VyY2VDb2RlLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgU3ludGF4ID0gTWVtYmVyW10gLy8gQ3N0TW9kZWxcblxuXG5leHBvcnQgY29uc3Qgcm9sZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnaWQnLFxuICAgICdkaWdpdHMnLFxuICAgICdjaGFycycsXG4gICAgJ3BsdXJhbGl6ZXInLFxuICAgICdhbmFwaG9yYU9wZXJhdG9yJyxcbiAgICAnbmV3T3BlcmF0b3InLFxuICAgICdtb2RpZmllcnMnLFxuICAgICdoZWFkJyxcbiAgICAnbGltaXRLZXl3b3JkJyxcbiAgICAnbGltaXROdW1iZXInLFxuICAgICdsZWZ0T3BlcmFuZCcsXG4gICAgJ3JpZ2h0T3BlcmFuZCcsXG4gICAgJ29wZXJhdG9yJyxcbiAgICAnb3duZXInLFxuICAgICdvYmplY3QnLFxuICAgICdyZWNlaXZlcicsXG4gICAgJ2luc3RydW1lbnQnLFxuICAgICdzdWJqZWN0JyxcbiAgICAndmVyYicsXG4gICAgJ25lZ2F0aW9uJyxcbiAgICAnY29uZGl0aW9uJyxcbiAgICAnY29uc2VxdWVuY2UnLFxuICAgICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJywgLy8gQkFEXG4pXG5cbmV4cG9ydCB0eXBlIFJvbGUgPSBFbGVtZW50VHlwZTx0eXBlb2Ygcm9sZXM+XG5cblxudHlwZSBCYXNlTWVtYmVyID0ge1xuICAgIHJlYWRvbmx5IG51bWJlcj86IENhcmRpbmFsaXR5IC8vIG5vIG51bWJlciAtLS0+IDFcbiAgICByZWFkb25seSByb2xlPzogUm9sZSAvLyBubyByb2xlIC0tPiBleGNsdWRlIGZyb20gYXN0XG4gICAgcmVhZG9ubHkgc2VwPzogQXN0VHlwZVxufVxuXG5leHBvcnQgdHlwZSBMaXRlcmFsTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSBsaXRlcmFsczogc3RyaW5nW11cbiAgICByZWFkb25seSB0eXBlcz86IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGFueUNoYXJFeGNlcHRGb3I/OiBzdHJpbmdbXVxufVxuXG5leHBvcnQgdHlwZSBUeXBlTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSB0eXBlczogQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM/OiB1bmRlZmluZWRcbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IExpdGVyYWxNZW1iZXIgfCBUeXBlTWVtYmVyXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgYXN0VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBhc3RUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdzcGFjZScsXG4gICAgJ2lkZW50aWZpZXInLFxuICAgICdzdHJpbmctbGl0ZXJhbCcsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnZXhwcmVzc2lvbicsIC8vIGFuZC1leHByZXNzaW9uXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnbGltaXQtcGhyYXNlJyxcbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG4gICAgJ3NpbXBsZS1zZW50ZW5jZScsXG4gICAgJ2dlbml0aXZlJyxcbiAgICAnZGF0aXZlJyxcbiAgICAnaW5zdHJ1bWVudGFsJyxcbiAgICAnYWNjdXNhdGl2ZScsXG4gICAgJ3ZlcmInLFxuICAgICdjb3B1bGEnLFxuICAgICdkby12ZXJiJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nLFxuKVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8ICdhbGwtYnV0LWxhc3QnXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuICAgIHx8IGMgPT09ICdhbGwtYnV0LWxhc3QnXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0gPSB7XG5cbiAgICBzcGFjZTogW1xuICAgICAgICB7IG51bWJlcjogJysnLCBsaXRlcmFsczogWycgJywgJ1xcbicsICdcXHQnXSB9XG4gICAgXSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdpZCcsIGxpdGVyYWxzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsICdvJywgJ3AnLCAncScsICdyJywgJ3MnLCAndCcsICd1JywgJ3YnLCAndycsICd4JywgJ3knLCAneiddIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IGFueUNoYXJFeGNlcHRGb3I6IFsnXCInXSwgbGl0ZXJhbHM6IFtdLCByb2xlOiAnY2hhcnMnLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWycrJywgJy0nLCAnKicsICcvJ10sIHJvbGU6ICdvcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdhY2N1c2F0aXZlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvYmplY3QnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2RhdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWyd0byddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyZWNlaXZlcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnaW5zdHJ1bWVudGFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2J5J10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2luc3RydW1lbnQnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnYWNjdXNhdGl2ZScsICdkYXRpdmUnLCAnaW5zdHJ1bWVudGFsJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnKicgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ3N1YmplY3QnLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3ZlcmInXSwgZXhwYW5kOiB0cnVlIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicsIGV4cGFuZDogdHJ1ZSB9LFxuICAgIF0sXG5cbiAgICB2ZXJiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29wdWxhJywgJ2RvLXZlcmInXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2RvLXZlcmInOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZG8nLCAnZG9lcyddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ3ZlcmInIH1cbiAgICBdLFxuXG4gICAgY29wdWxhOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaXMnLCAnYmUnLCAnYXJlJ10sIHJvbGU6ICd2ZXJiJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZXgtc2VudGVuY2Utb25lJywgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZW4nLCAnLCddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICBdXG59IiwiaW1wb3J0IHsgZmlyc3QgfSBmcm9tIFwiLi4vdXRpbHMvZmlyc3RcIjtcbmltcG9ydCB7IENoYXJTdHJlYW0gfSBmcm9tIFwiLi9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSwgTGl0ZXJhbE1lbWJlciwgTWVtYmVyLCBSb2xlLCBTeW50YXgsIHN5bnRheGVzLCBBc3RUeXBlIH0gZnJvbSBcIi4vY3N0c1wiO1xuXG50eXBlIEFzdE5vZGUgPVxuICAgIHN0cmluZ1xuICAgIHwgc3RyaW5nW11cbiAgICB8IEFzdE5vZGVbXVxuICAgIHwgeyBbeCBpbiBSb2xlXT86IEFzdE5vZGUgfVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRyeShzeW50YXhMaXN0OiBBc3RUeXBlW10sIGNzOiBDaGFyU3RyZWFtKSB7XG5cbiAgICBmb3IgKGNvbnN0IHN5bnRheE5hbWUgb2Ygc3ludGF4TGlzdCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSBjcy5nZXRQb3MoKVxuICAgICAgICBjb25zdCBzeW50YXggPSBzeW50YXhlc1tzeW50YXhOYW1lXSAvLyBzdGF0ZSFcbiAgICAgICAgY29uc3QgdHJlZSA9IHBhcnNlU3ludGF4KHN5bnRheCwgY3MpXG5cbiAgICAgICAgaWYgKHRyZWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmVlIC8veyAuLi50cmVlLCB0eXBlOiBzeW50YXhOYW1lIH0gYXMgU3ludGF4VHJlZSAvLyByZW1vdmUgY2FzdCAvLyBUT0RPOiBhZGQgdHlwZVxuICAgICAgICB9XG5cbiAgICAgICAgY3MuYmFja1RvKG1lbWVudG8pXG4gICAgfVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVN5bnRheChzeW50YXg6IFN5bnRheCwgY3M6IENoYXJTdHJlYW0pOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IGFzdDogQXN0Tm9kZSA9IHt9XG5cbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuICAgICAgICBjb25zdCBub2RlID0gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIGNzKVxuXG4gICAgICAgIGlmICghbm9kZSAmJiBpc05lY2Vzc2FyeShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFub2RlKSB7IC8vIGFuZCBub3QgaXNOZWNlc3NhcnlcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvL1RPRE8gZXhwYW5kIHByb2JhYmx5IGdvZXMgaGVyZVxuXG4gICAgICAgIGlmIChtZW1iZXIucm9sZSkge1xuICAgICAgICAgICAgYXN0W21lbWJlci5yb2xlXSA9IG5vZGVcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIGFzdFxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlTWVtYmVyUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogQXN0Tm9kZSB8IEFzdE5vZGVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuICAgIGxldCBtZW1lbnRvID0gY3MuZ2V0UG9zKClcblxuICAgIHdoaWxlICghY3MuaXNFbmQoKSkge1xuXG4gICAgICAgIG1lbWVudG8gPSBjcy5nZXRQb3MoKVxuICAgICAgICBjb25zdCBzdCA9IHBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgY3MpXG5cbiAgICAgICAgaWYgKCFzdCAmJiAhbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3QpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnB1c2goc3QpXG5cbiAgICAgICAgaWYgKG1lbWJlci5zZXApIHtcbiAgICAgICAgICAgIHBhcnNlTWVtYmVyU2luZ2xlKHsgdHlwZXM6IFttZW1iZXIuc2VwXSB9LCBjcylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKG1lbWJlci5udW1iZXIgPT09ICdhbGwtYnV0LWxhc3QnKSB7XG4gICAgICAgIGxpc3QucG9wKClcbiAgICAgICAgY3MuYmFja1RvKG1lbWVudG8pXG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogQXN0Tm9kZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgIGlmIChtZW1iZXIubGl0ZXJhbHMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlTGl0ZXJhbChtZW1iZXIsIGNzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZVRyeShtZW1iZXIudHlwZXMsIGNzKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VMaXRlcmFsKG1lbWJlcjogTGl0ZXJhbE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmIChtZW1iZXIuYW55Q2hhckV4Y2VwdEZvcikge1xuICAgICAgICByZXR1cm4gcGFyc2VDaGFyKG1lbWJlciwgY3MpXG4gICAgfVxuXG4gICAgY29uc3Qgc2luZ2xlTGV0dGVyTGl0ZXJhbHMgPSBtZW1iZXIubGl0ZXJhbHMuZmlsdGVyKHggPT4geC5sZW5ndGggPD0gMSlcbiAgICBjb25zdCByMSA9IGZpcnN0KHNpbmdsZUxldHRlckxpdGVyYWxzLCB4ID0+IHBhcnNlQ2hhcih7IGxpdGVyYWxzOiBbeF0gfSwgY3MpKVxuXG4gICAgaWYgKHIxKSB7XG4gICAgICAgIHJldHVybiByMVxuICAgIH1cblxuICAgIGNvbnN0IG11bHRpTGV0dGVyTGl0ZXJhbHM6IFN5bnRheFtdID0gbWVtYmVyLmxpdGVyYWxzXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA+IDEpXG4gICAgICAgIC5tYXAoeCA9PiB4LnNwbGl0KCcnKS5tYXAoYyA9PiAoeyBsaXRlcmFsczogW2NdIH0pKSlcblxuICAgIGNvbnN0IHIyID0gZmlyc3QobXVsdGlMZXR0ZXJMaXRlcmFscywgeCA9PiBwYXJzZVN5bnRheCh4LCBjcykpXG5cbiAgICBpZiAocjIpIHtcbiAgICAgICAgcmV0dXJuIHIyXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlQ2hhcihsZWFmOiBPbWl0PExpdGVyYWxNZW1iZXIsICdudW1iZXInPiwgY3M6IENoYXJTdHJlYW0pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3QgY2hhciA9IGNzLnBlZWsoKVxuXG4gICAgaWYgKGxlYWYubGl0ZXJhbHMuaW5jbHVkZXMoY2hhcilcbiAgICAgICAgfHwgbGVhZi5hbnlDaGFyRXhjZXB0Rm9yICYmICFsZWFmLmFueUNoYXJFeGNlcHRGb3IuaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgY3MubmV4dCgpXG4gICAgICAgIHJldHVybiBjaGFyXG4gICAgfVxuXG59IiwiLyoqXG4gKiBcbiAqIEFwcGx5IHByZWRpY2F0ZSB0byBlYWNoIGVsZW1lbnQgZSBpbiB0aGUgaXRlcmFibGUsIHN0b3Agd2hlbiBcbiAqIHlvdSBmaW5kIGEgbm9uLW51bGxpc2ggaW1hZ2Ugb2YgZSwgYW5kIHJldHVybiB0aGUgaW1hZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdDxULCBVPihpdGVyYWJsZTogVFtdLCBwcmVkaWNhdGU6ICh4OiBUKSA9PiBVKTogVSB8IHVuZGVmaW5lZCB7XG5cbiAgICBmb3IgKGNvbnN0IGUgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3QgbWF5YmVSZXN1bHQgPSBwcmVkaWNhdGUoZSlcblxuICAgICAgICBpZiAobWF5YmVSZXN1bHQgIT09IHVuZGVmaW5lZCAmJiBtYXliZVJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlUmVzdWx0XG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgeyBnZXRDaGFyU3RyZWFtIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgcGFyc2VTeW50YXgsIHBhcnNlVHJ5IH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cbi8vIEVYQU1QTEUgMCBcbi8vIGNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbi8vIGNvbnN0IHggPSB0cnlQYXJzZShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuLy8gY29uc3QgeSA9IHRyeVBhcnNlKFsnc3BhY2UnXSwgY3MpXG4vLyBjb25zdCB6ID0gdHJ5UGFyc2UoWydpZGVudGlmaWVyJ10sIGNzKVxuLy8gY29uc29sZS5sb2coeCwgeSwgeilcblxuLy8gRVhBTVBMRSAxXG5jb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG5jb25zdCB4ID0gcGFyc2VUcnkoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbmNvbnNvbGUubG9nKDEsIHgpXG4vLyBFWEFNUExFIDJcbmNvbnN0IGNzMiA9IGdldENoYXJTdHJlYW0oJ2RvIG5vdCBtYWtlICcpLy8gYWxzbyB0cnkgd2l0aG91dCBub3RcbmNvbnN0IHgyID0gcGFyc2VUcnkoWydkby12ZXJiJ10sIGNzMilcbmNvbnNvbGUubG9nKDIsIHgyKVxuLy8gRVhBTVBMRSAzXG5jb25zdCBjczMgPSBnZXRDaGFyU3RyZWFtKCdcIiBjaWFvIFwieHh4JylcbmNvbnN0IHgzID0gcGFyc2VUcnkoWydzdHJpbmctbGl0ZXJhbCddLCBjczMpXG5jb25zb2xlLmxvZygzLCB4Mylcbi8vIEVYQU1QTEUgNFxuY29uc3QgY3M0ID0gZ2V0Q2hhclN0cmVhbSgnY2lhbyBtb25kbyBidXJ1ZicpXG5jb25zdCB4NCA9IHBhcnNlU3ludGF4KFt7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgc2VwOiAnc3BhY2UnLCBudW1iZXI6ICdhbGwtYnV0LWxhc3QnLCByb2xlOiAnYW55dGhpbmcnIGFzIGFueSB9XSwgY3M0KVxuY29uc3QgeDQwID0gcGFyc2VUcnkoWydpZGVudGlmaWVyJ10sIGNzNClcbmNvbnNvbGUubG9nKDQsIHg0LCB4NDApXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==