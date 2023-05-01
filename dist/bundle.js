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

/***/ "./app/src/new-frontend/cst-attempt2.ts":
/*!**********************************************!*\
  !*** ./app/src/new-frontend/cst-attempt2.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.isRepeatable = exports.isNecessary = exports.astTypes = exports.roles = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.roles = (0, stringLiterals_1.stringLiterals)('id', 'digits', 'chars', 'pluralizer', 'anaphoraOperator', 'newOperator', 'modifiers', 'head', 'limitKeyword', 'limitNumber', 'leftOperand', 'rightOperand', 'operator', 'owner', 'object', 'receiver', 'instrument', 'subject', 'verb', 'negation', 'condition', 'consequence', 'subordinating-conjunction');
exports.astTypes = (0, stringLiterals_1.stringLiterals)('space', 'identifier', 'string-literal', 'number-literal', 'expression', // and-expression
'math-expression', 'noun-phrase', 'limit-phrase', 'math-expression', 'complex-sentence', 'simple-sentence', 'genitive', 'dative', 'instrumental', 'accusative', 'verb', 'copula', 'do-verb', 'complement', 'complex-sentence-one', 'complex-sentence-two', 'any-symbol');
const isNecessary = (c) => c === undefined // necessary by default
    || c == '+'
    || +c >= 1;
exports.isNecessary = isNecessary;
const isRepeatable = (c) => c == '+'
    || c == '*';
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
        { types: ['any-symbol'], exceptForLiterals: ['"'], role: 'chars' },
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
        { types: ['verb'], expand: true },
        { types: ['complement'], number: '*', expand: true },
    ],
    verb: [
        { types: ['copula', 'do-verb'], expand: true }
    ],
    'do-verb': [
        { literals: ['do', 'does'] },
        { literals: ['not'], role: 'negation', number: '1|0' },
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
    ],
    'any-symbol': [],
};


/***/ }),

/***/ "./app/src/new-frontend/parser.ts":
/*!****************************************!*\
  !*** ./app/src/new-frontend/parser.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tryParse = void 0;
const cst_attempt2_1 = __webpack_require__(/*! ./cst-attempt2 */ "./app/src/new-frontend/cst-attempt2.ts");
function tryParse(syntaxList, cs) {
    for (const syntaxName of syntaxList) {
        const memento = cs.getPos();
        const syntax = cst_attempt2_1.syntaxes[syntaxName]; // state!
        const tree = knownParse(syntax, cs);
        // console.log(cs.isEnd())
        // console.log('tree=', tree)
        if (tree) {
            return tree;
        }
        cs.backTo(memento);
    }
}
exports.tryParse = tryParse;
function knownParse(syntax, cs) {
    const st = {};
    for (const member of syntax) {
        const node = parseMemberRepeated(member, cs);
        if (!node && (0, cst_attempt2_1.isNecessary)(member.number)) {
            return undefined;
        }
        if (!node) { // and not necessary
            continue;
        }
        if (member.role) {
            st[member.role] = node;
        }
    }
    return st;
}
function parseMemberRepeated(member, cs) {
    // isNecessary has already been taken care of
    const list = [];
    while (!cs.isEnd()) {
        const st = parseMemberSingle(member, cs);
        // console.log( 'member=', member,  'isEnd=', cs.isEnd(), 'st=', st, 'list=', list )
        if (!st && !list.length) {
            return undefined;
        }
        if (!st) {
            break;
        }
        if (!(0, cst_attempt2_1.isRepeatable)(member.number)) {
            return st;
        }
        list.push(st);
        // member.sep ??????
    }
    return list;
}
function parseMemberSingle(member, cs) {
    // doesn't have to take care about number
    if (member.literals) {
        return parseLiteral(member, cs);
    }
    else {
        return parseComposite(member, cs);
    }
}
function parseLiteral(member, cs) {
    const singleLetterLiterals = member.literals.filter(x => x.length <= 1);
    const multiLetterLiterals = member.literals.filter(x => x.length > 1);
    console.log('singleLetterLiterals=', singleLetterLiterals);
    console.log('multiLetterLiterals=', multiLetterLiterals);
    if (member.literals.every(x => x.length <= 1)) {
        return parseChar(member, cs);
    }
}
function parseChar(leaf, cs) {
    const char = cs.peek();
    if (leaf.literals.includes(char)) {
        cs.next();
        return char;
    }
}
function parseComposite(composite, cs) {
    return tryParse(composite.types, cs);
}


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
// console.log(cstModelToAstModel(NOUN_PHRASE))
// const x = tryParse(['identifier'], cs)
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
// // console.log(cs, cs.isEnd())
// const y = tryParse(['space'], cs)
// const z = tryParse(['identifier'], cs)
// console.log(x, y, z)
// EXAMPLE 1
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
// EXAMPLE 2
const cs = (0, char_stream_1.getCharStream)('do not make ');
const x = (0, parser_1.tryParse)(['do-verb'], cs);
console.log(x);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFCQUFRLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3QtYXR0ZW1wdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENoYXJTdHJlYW0ge1xuXG4gICAgLyoqXG4gICAgICogTW92ZSB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaWYgYW55LlxuICAgICAqL1xuICAgIG5leHQoKTogdm9pZFxuICAgIC8qKlxuICAgICAqIFJlYWQgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAqL1xuICAgIHBlZWsoKTogc3RyaW5nXG4gICAgLyoqXG4gICAgICogR28gYmFjay5cbiAgICAgKi9cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqL1xuICAgIGdldFBvcygpOiBudW1iZXJcbiAgICAvKipcbiAgICAgKiBSZWFjaGVkIGVuZCBvZiBjaGFyc3RyZWFtLlxuICAgICAqL1xuICAgIGlzRW5kKCk6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJTdHJlYW0oc291cmNlQ29kZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQ2hhclN0cmVhbShzb3VyY2VDb2RlKVxufVxuXG5jbGFzcyBCYXNlQ2hhclN0cmVhbSBpbXBsZW1lbnRzIENoYXJTdHJlYW0ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHBvcyA9IDAsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0VuZCgpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zKytcbiAgICB9XG5cbiAgICBwZWVrKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUNvZGVbdGhpcy5wb3NdXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0UG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc1xuICAgIH1cblxuICAgIGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy5zb3VyY2VDb2RlLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgU3ludGF4ID0gTWVtYmVyW10gLy8gQ3N0TW9kZWxcblxuXG5leHBvcnQgY29uc3Qgcm9sZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnaWQnLFxuICAgICdkaWdpdHMnLFxuICAgICdjaGFycycsXG4gICAgJ3BsdXJhbGl6ZXInLFxuICAgICdhbmFwaG9yYU9wZXJhdG9yJyxcbiAgICAnbmV3T3BlcmF0b3InLFxuICAgICdtb2RpZmllcnMnLFxuICAgICdoZWFkJyxcbiAgICAnbGltaXRLZXl3b3JkJyxcbiAgICAnbGltaXROdW1iZXInLFxuICAgICdsZWZ0T3BlcmFuZCcsXG4gICAgJ3JpZ2h0T3BlcmFuZCcsXG4gICAgJ29wZXJhdG9yJyxcbiAgICAnb3duZXInLFxuICAgICdvYmplY3QnLFxuICAgICdyZWNlaXZlcicsXG4gICAgJ2luc3RydW1lbnQnLFxuICAgICdzdWJqZWN0JyxcbiAgICAndmVyYicsXG4gICAgJ25lZ2F0aW9uJyxcbiAgICAnY29uZGl0aW9uJyxcbiAgICAnY29uc2VxdWVuY2UnLFxuICAgICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJywgLy8gQkFEXG4pXG5cbmV4cG9ydCB0eXBlIFJvbGUgPSBFbGVtZW50VHlwZTx0eXBlb2Ygcm9sZXM+XG5cblxudHlwZSBCYXNlTWVtYmVyID0ge1xuICAgIHJlYWRvbmx5IG51bWJlcj86IENhcmRpbmFsaXR5IC8vIG5vIG51bWJlciAtLS0+IDFcbiAgICByZWFkb25seSByb2xlPzogUm9sZSAvLyBubyByb2xlIC0tPiBleGNsdWRlIGZyb20gYXN0XG4gICAgcmVhZG9ubHkgc2VwPzogc3RyaW5nXG59XG5cbmV4cG9ydCB0eXBlIExpdGVyYWxNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgdHlwZXM/OiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgVHlwZU1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgdHlwZXM6IEFzdFR5cGVbXVxuICAgIHJlYWRvbmx5IGxpdGVyYWxzPzogdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgZXhjZXB0Rm9yTGl0ZXJhbHM/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IGV4cGFuZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgTWVtYmVyID0gTGl0ZXJhbE1lbWJlciB8IFR5cGVNZW1iZXJcblxuZXhwb3J0IHR5cGUgQXN0VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBhc3RUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGFzdFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ3NwYWNlJyxcbiAgICAnaWRlbnRpZmllcicsXG4gICAgJ3N0cmluZy1saXRlcmFsJyxcbiAgICAnbnVtYmVyLWxpdGVyYWwnLFxuICAgICdleHByZXNzaW9uJywgLy8gYW5kLWV4cHJlc3Npb25cbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnbm91bi1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJyxcbiAgICAnZ2VuaXRpdmUnLFxuICAgICdkYXRpdmUnLFxuICAgICdpbnN0cnVtZW50YWwnLFxuICAgICdhY2N1c2F0aXZlJyxcbiAgICAndmVyYicsXG4gICAgJ2NvcHVsYScsXG4gICAgJ2RvLXZlcmInLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLXR3bycsXG4gICAgJ2FueS1zeW1ib2wnLFxuKVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8ICdhbGwtYnV0LWxhc3QnXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9ID0ge1xuXG4gICAgc3BhY2U6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgbGl0ZXJhbHM6IFsnICcsICdcXG4nLCAnXFx0J10gfVxuICAgIF0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAgICB7IG51bWJlcjogJysnLCByb2xlOiAnaWQnLCBsaXRlcmFsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JywgJ3cnLCAneCcsICd5JywgJ3onXSB9XG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdkaWdpdHMnLCBsaXRlcmFsczogWycwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5J10gfVxuICAgIF0sXG4gICAgJ3N0cmluZy1saXRlcmFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydhbnktc3ltYm9sJ10sIGV4Y2VwdEZvckxpdGVyYWxzOiBbJ1wiJ10sIHJvbGU6ICdjaGFycycgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgXSxcbiAgICAnbm91bi1waHJhc2UnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZXZlcnknLCAnYW55J10sIHJvbGU6ICdwbHVyYWxpemVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWyd0aGUnLCAnb2xkJ10sIHJvbGU6ICdhbmFwaG9yYU9wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydhJywgJ2FuJywgJ25ldyddLCByb2xlOiAnbmV3T3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2xpbWl0LXBocmFzZSddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAnbW9kaWZpZXJzJywgc2VwOiAnc3BhY2UnLCBudW1iZXI6ICdhbGwtYnV0LWxhc3QnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInLCAnc3RyaW5nLWxpdGVyYWwnLCAnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2hlYWQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydzJ10sIHJvbGU6ICdwbHVyYWxpemVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydnZW5pdGl2ZSddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdsaW1pdC1waHJhc2UnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZmlyc3QnLCAnbGFzdCddLCByb2xlOiAnbGltaXRLZXl3b3JkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdsaW1pdE51bWJlcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdtYXRoLWV4cHJlc3Npb24nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnKycsICctJywgJyonLCAnLyddLCByb2xlOiAnb3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICBcImV4cHJlc3Npb25cIjogW1xuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2FuZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgICdnZW5pdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydvZiddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvd25lcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnYWNjdXNhdGl2ZSc6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb2JqZWN0JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2luc3RydW1lbnRhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydieSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdpbnN0cnVtZW50JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2FjY3VzYXRpdmUnLCAnZGF0aXZlJywgJ2luc3RydW1lbnRhbCddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJyonIH1cbiAgICBdLFxuXG4gICAgJ3NpbXBsZS1zZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlczogWydleHByZXNzaW9uJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3ZlcmInXSwgZXhwYW5kOiB0cnVlIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJywgZXhwYW5kOiB0cnVlIH0sXG4gICAgXSxcblxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG5cbiAgICAnZG8tdmVyYic6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydkbycsICdkb2VzJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydub3QnXSwgcm9sZTogJ25lZ2F0aW9uJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ3ZlcmInIH1cbiAgICBdLFxuXG4gICAgY29wdWxhOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaXMnLCAnYmUnLCAnYXJlJ10sIHJvbGU6ICd2ZXJiJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZXgtc2VudGVuY2Utb25lJywgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZW4nLCAnLCddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICBdLFxuXG4gICAgJ2FueS1zeW1ib2wnOiBbXSxcblxufSIsImltcG9ydCB7IENoYXJTdHJlYW0gfSBmcm9tIFwiLi9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSwgTGl0ZXJhbE1lbWJlciwgTWVtYmVyLCBSb2xlLCBTeW50YXgsIFR5cGVNZW1iZXIsIHN5bnRheGVzLCBBc3RUeXBlIH0gZnJvbSBcIi4vY3N0LWF0dGVtcHQyXCI7XG5cbi8vVE9ETyBhbnktc3ltYm9sIGFuZCBleGNlcHRGb3JMaXRlcmFsc1xuLy9UT0RPIGFsbC1idXQtbGFzdFxuLy9UT0RPIGV4cGFuZFxuXG5cbnR5cGUgU3ludGF4VHJlZSA9XG4gICAgc3RyaW5nXG4gICAgfCBzdHJpbmdbXVxuICAgIHwgU3ludGF4VHJlZVtdXG4gICAgfCB7IFt4IGluIFJvbGVdPzogU3ludGF4VHJlZSB9XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlKHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgY3M6IENoYXJTdHJlYW0pIHtcblxuICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IGNzLmdldFBvcygpXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHN5bnRheGVzW3N5bnRheE5hbWVdIC8vIHN0YXRlIVxuICAgICAgICBjb25zdCB0cmVlID0ga25vd25QYXJzZShzeW50YXgsIGNzKVxuXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coY3MuaXNFbmQoKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyZWU9JywgdHJlZSlcblxuICAgICAgICBpZiAodHJlZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRyZWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNzLmJhY2tUbyhtZW1lbnRvKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBrbm93blBhcnNlKHN5bnRheDogU3ludGF4LCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCB1bmRlZmluZWQge1xuXG5cbiAgICBjb25zdCBzdDogU3ludGF4VHJlZSA9IHt9XG5cbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgY3MpXG5cblxuICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgbm90IG5lY2Vzc2FyeVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZW1iZXIucm9sZSkge1xuICAgICAgICAgICAgc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gc3RcblxufVxuXG5mdW5jdGlvbiBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlcjogTWVtYmVyLCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCBTeW50YXhUcmVlW10gfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIC8vIGlzTmVjZXNzYXJ5IGhhcyBhbHJlYWR5IGJlZW4gdGFrZW4gY2FyZSBvZlxuXG4gICAgY29uc3QgbGlzdDogU3ludGF4VHJlZVtdID0gW11cblxuICAgIHdoaWxlICghY3MuaXNFbmQoKSkge1xuXG4gICAgICAgIGNvbnN0IHN0ID0gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyLCBjcylcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdtZW1iZXI9JywgbWVtYmVyLCAgJ2lzRW5kPScsIGNzLmlzRW5kKCksICdzdD0nLCBzdCwgJ2xpc3Q9JywgbGlzdCApXG5cbiAgICAgICAgaWYgKCFzdCAmJiAhbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3QpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnB1c2goc3QpXG4gICAgICAgIC8vIG1lbWJlci5zZXAgPz8/Pz8/XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgIGlmIChtZW1iZXIubGl0ZXJhbHMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlTGl0ZXJhbChtZW1iZXIsIGNzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZUNvbXBvc2l0ZShtZW1iZXIsIGNzKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZUxpdGVyYWwobWVtYmVyOiBMaXRlcmFsTWVtYmVyLCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3Qgc2luZ2xlTGV0dGVyTGl0ZXJhbHMgPSBtZW1iZXIubGl0ZXJhbHMuZmlsdGVyKHggPT4geC5sZW5ndGggPD0gMSlcbiAgICBjb25zdCBtdWx0aUxldHRlckxpdGVyYWxzID0gbWVtYmVyLmxpdGVyYWxzLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMSlcblxuICAgIGNvbnNvbGUubG9nKCdzaW5nbGVMZXR0ZXJMaXRlcmFscz0nLCBzaW5nbGVMZXR0ZXJMaXRlcmFscylcbiAgICBjb25zb2xlLmxvZygnbXVsdGlMZXR0ZXJMaXRlcmFscz0nLCBtdWx0aUxldHRlckxpdGVyYWxzKVxuXG4gICAgaWYgKG1lbWJlci5saXRlcmFscy5ldmVyeSh4ID0+IHgubGVuZ3RoIDw9IDEpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUNoYXIobWVtYmVyLCBjcylcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VDaGFyKGxlYWY6IE9taXQ8TGl0ZXJhbE1lbWJlciwgJ251bWJlcic+LCBjczogQ2hhclN0cmVhbSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBjaGFyID0gY3MucGVlaygpXG5cbiAgICBpZiAobGVhZi5saXRlcmFscy5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICBjcy5uZXh0KClcbiAgICAgICAgcmV0dXJuIGNoYXJcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VDb21wb3NpdGUoY29tcG9zaXRlOiBPbWl0PFR5cGVNZW1iZXIsICdudW1iZXInPiwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdHJ5UGFyc2UoY29tcG9zaXRlLnR5cGVzLCBjcylcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyB0cnlQYXJzZSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyXCI7XG5cbi8vIG1haW4oKVxuXG4vLyBjb25zb2xlLmxvZyhjc3RNb2RlbFRvQXN0TW9kZWwoTk9VTl9QSFJBU0UpKVxuXG4vLyBjb25zdCB4ID0gdHJ5UGFyc2UoWydpZGVudGlmaWVyJ10sIGNzKVxuXG4vLyBjb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4ID0gdHJ5UGFyc2UoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbi8vIC8vIGNvbnNvbGUubG9nKGNzLCBjcy5pc0VuZCgpKVxuLy8gY29uc3QgeSA9IHRyeVBhcnNlKFsnc3BhY2UnXSwgY3MpXG4vLyBjb25zdCB6ID0gdHJ5UGFyc2UoWydpZGVudGlmaWVyJ10sIGNzKVxuLy8gY29uc29sZS5sb2coeCwgeSwgeilcblxuXG5cbi8vIEVYQU1QTEUgMVxuLy8gY29uc3QgY3MgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeCA9IHRyeVBhcnNlKFsnbnVtYmVyLWxpdGVyYWwnXSwgY3MpXG4vLyBFWEFNUExFIDJcbmNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnZG8gbm90IG1ha2UgJylcbmNvbnN0IHggPSB0cnlQYXJzZShbJ2RvLXZlcmInXSwgY3MpXG5jb25zb2xlLmxvZyh4KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9