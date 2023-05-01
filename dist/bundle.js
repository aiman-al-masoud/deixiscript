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
    constructor(sourceCode, pos = 0, acc = '') {
        this.sourceCode = sourceCode;
        this.pos = pos;
        this.acc = acc;
    }
    next() {
        if (this.isEnd()) {
            return;
        }
        this.acc += this.sourceCode[this.pos];
        this.pos++;
    }
    clearAcc() {
        this.acc = '';
    }
    peekAcc() {
        return this.acc;
    }
    backTo(pos) {
        this.pos = pos;
        this.clearAcc();
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
        return parseLeaf(member, cs);
    }
    else {
        return parseComposite(member, cs);
    }
}
function parseLeaf(leaf, cs) {
    while (!cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
        cs.next();
    }
    if (cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
        return undefined;
    }
    const result = cs.peekAcc();
    cs.clearAcc();
    return result;
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
const cs = (0, char_stream_1.getCharStream)('ciao ');
const x = (0, parser_1.tryParse)(['identifier'], cs);
console.log(x);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7UUFDckQsT0FBTyxTQUFTO0tBQ25CO0lBRUQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRTtJQUMzQixFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ2IsT0FBTyxNQUFNO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxTQUFxQyxFQUFFLEVBQWM7SUFDekUsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7QUFDeEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNsSEQsU0FBZ0IsY0FBYyxDQUFtQixHQUFHLElBQVMsSUFBUyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFBcEYsd0NBQW9GOzs7Ozs7O1VDQXBGO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSxzQ0FBc0M7QUFDdEMseUhBQStEO0FBQy9ELDBHQUFxRDtBQUVyRCxTQUFTO0FBRVQsK0NBQStDO0FBRS9DLE1BQU0sRUFBRSxHQUFHLCtCQUFhLEVBQUMsT0FBTyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxHQUFHLHFCQUFRLEVBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3QtYXR0ZW1wdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENoYXJTdHJlYW0ge1xuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBuZXh0IGNoYXIgdG8gdGhlIGFjY3VtdWxhdG9yXG4gICAgICovXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgLyoqXG4gICAgICogUmVhZCB0aGUgYWNjdW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBwZWVrQWNjKCk6IHN0cmluZ1xuICAgIC8qKlxuICAgICAqIENsZWFyIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZVxuICAgICAqL1xuICAgIGNsZWFyQWNjKCk6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHbyBiYWNrIEFORCBjbGVhciB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICovXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRQb3MoKTogbnVtYmVyXG4gICAgLyoqXG4gICAgICogUmVhY2hlZCBlbmQgb2YgY2hhcnN0cmVhbS5cbiAgICAgKi9cbiAgICBpc0VuZCgpOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgQmFzZUNoYXJTdHJlYW0oc291cmNlQ29kZSlcbn1cblxuY2xhc3MgQmFzZUNoYXJTdHJlYW0gaW1wbGVtZW50cyBDaGFyU3RyZWFtIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwb3MgPSAwLFxuICAgICAgICBwcm90ZWN0ZWQgYWNjID0gJycsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0VuZCgpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWNjICs9IHRoaXMuc291cmNlQ29kZVt0aGlzLnBvc11cbiAgICAgICAgdGhpcy5wb3MrK1xuICAgIH1cblxuICAgIGNsZWFyQWNjKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFjYyA9ICcnXG4gICAgfVxuXG4gICAgcGVla0FjYygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NcbiAgICAgICAgdGhpcy5jbGVhckFjYygpXG4gICAgfVxuXG4gICAgZ2V0UG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc1xuICAgIH1cblxuICAgIGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy5zb3VyY2VDb2RlLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgU3ludGF4ID0gTWVtYmVyW10gLy8gQ3N0TW9kZWxcblxuXG5leHBvcnQgY29uc3Qgcm9sZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnaWQnLFxuICAgICdkaWdpdHMnLFxuICAgICdjaGFycycsXG4gICAgJ3BsdXJhbGl6ZXInLFxuICAgICdhbmFwaG9yYU9wZXJhdG9yJyxcbiAgICAnbmV3T3BlcmF0b3InLFxuICAgICdtb2RpZmllcnMnLFxuICAgICdoZWFkJyxcbiAgICAnbGltaXRLZXl3b3JkJyxcbiAgICAnbGltaXROdW1iZXInLFxuICAgICdsZWZ0T3BlcmFuZCcsXG4gICAgJ3JpZ2h0T3BlcmFuZCcsXG4gICAgJ29wZXJhdG9yJyxcbiAgICAnb3duZXInLFxuICAgICdvYmplY3QnLFxuICAgICdyZWNlaXZlcicsXG4gICAgJ2luc3RydW1lbnQnLFxuICAgICdzdWJqZWN0JyxcbiAgICAndmVyYicsXG4gICAgJ25lZ2F0aW9uJyxcbiAgICAnY29uZGl0aW9uJyxcbiAgICAnY29uc2VxdWVuY2UnLFxuICAgICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJywgLy8gQkFEXG4pXG5cbmV4cG9ydCB0eXBlIFJvbGUgPSBFbGVtZW50VHlwZTx0eXBlb2Ygcm9sZXM+XG5cblxudHlwZSBCYXNlTWVtYmVyID0ge1xuICAgIHJlYWRvbmx5IG51bWJlcj86IENhcmRpbmFsaXR5IC8vIG5vIG51bWJlciAtLS0+IDFcbiAgICByZWFkb25seSByb2xlPzogUm9sZSAvLyBubyByb2xlIC0tPiBleGNsdWRlIGZyb20gYXN0XG4gICAgcmVhZG9ubHkgc2VwPzogc3RyaW5nXG59XG5cbmV4cG9ydCB0eXBlIExpdGVyYWxNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgdHlwZXM/OiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgVHlwZU1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgdHlwZXM6IEFzdFR5cGVbXVxuICAgIHJlYWRvbmx5IGxpdGVyYWxzPzogdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgZXhjZXB0Rm9yTGl0ZXJhbHM/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IGV4cGFuZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgTWVtYmVyID0gTGl0ZXJhbE1lbWJlciB8IFR5cGVNZW1iZXJcblxuZXhwb3J0IHR5cGUgQXN0VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBhc3RUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGFzdFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ3NwYWNlJyxcbiAgICAnaWRlbnRpZmllcicsXG4gICAgJ3N0cmluZy1saXRlcmFsJyxcbiAgICAnbnVtYmVyLWxpdGVyYWwnLFxuICAgICdleHByZXNzaW9uJywgLy8gYW5kLWV4cHJlc3Npb25cbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnbm91bi1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJyxcbiAgICAnZ2VuaXRpdmUnLFxuICAgICdkYXRpdmUnLFxuICAgICdpbnN0cnVtZW50YWwnLFxuICAgICdhY2N1c2F0aXZlJyxcbiAgICAndmVyYicsXG4gICAgJ2NvcHVsYScsXG4gICAgJ2RvLXZlcmInLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLXR3bycsXG4gICAgJ2FueS1zeW1ib2wnLFxuKVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8ICdhbGwtYnV0LWxhc3QnXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9ID0ge1xuXG4gICAgc3BhY2U6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgbGl0ZXJhbHM6IFsnICcsICdcXG4nLCAnXFx0J10gfVxuICAgIF0sXG4gICAgaWRlbnRpZmllcjogW1xuICAgICAgICB7IG51bWJlcjogJysnLCByb2xlOiAnaWQnLCBsaXRlcmFsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JywgJ3cnLCAneCcsICd5JywgJ3onXSB9XG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdkaWdpdHMnLCBsaXRlcmFsczogWycwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5J10gfVxuICAgIF0sXG4gICAgJ3N0cmluZy1saXRlcmFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydhbnktc3ltYm9sJ10sIGV4Y2VwdEZvckxpdGVyYWxzOiBbJ1wiJ10sIHJvbGU6ICdjaGFycycgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgXSxcbiAgICAnbm91bi1waHJhc2UnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZXZlcnknLCAnYW55J10sIHJvbGU6ICdwbHVyYWxpemVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWyd0aGUnLCAnb2xkJ10sIHJvbGU6ICdhbmFwaG9yYU9wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydhJywgJ2FuJywgJ25ldyddLCByb2xlOiAnbmV3T3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2xpbWl0LXBocmFzZSddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAnbW9kaWZpZXJzJywgc2VwOiAnc3BhY2UnLCBudW1iZXI6ICdhbGwtYnV0LWxhc3QnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInLCAnc3RyaW5nLWxpdGVyYWwnLCAnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2hlYWQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydzJ10sIHJvbGU6ICdwbHVyYWxpemVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydnZW5pdGl2ZSddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdsaW1pdC1waHJhc2UnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZmlyc3QnLCAnbGFzdCddLCByb2xlOiAnbGltaXRLZXl3b3JkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdsaW1pdE51bWJlcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdtYXRoLWV4cHJlc3Npb24nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnKycsICctJywgJyonLCAnLyddLCByb2xlOiAnb3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICBcImV4cHJlc3Npb25cIjogW1xuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2FuZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgICdnZW5pdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydvZiddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvd25lcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnYWNjdXNhdGl2ZSc6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb2JqZWN0JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2luc3RydW1lbnRhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydieSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdpbnN0cnVtZW50JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2FjY3VzYXRpdmUnLCAnZGF0aXZlJywgJ2luc3RydW1lbnRhbCddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogJyonIH1cbiAgICBdLFxuXG4gICAgJ3NpbXBsZS1zZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlczogWydleHByZXNzaW9uJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3ZlcmInXSwgZXhwYW5kOiB0cnVlIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJywgZXhwYW5kOiB0cnVlIH0sXG4gICAgXSxcblxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG5cbiAgICAnZG8tdmVyYic6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydkbycsICdkb2VzJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydub3QnXSwgcm9sZTogJ25lZ2F0aW9uJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ3ZlcmInIH1cbiAgICBdLFxuXG4gICAgY29wdWxhOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaXMnLCAnYmUnLCAnYXJlJ10sIHJvbGU6ICd2ZXJiJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZXgtc2VudGVuY2Utb25lJywgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZW4nLCAnLCddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICBdLFxuXG4gICAgJ2FueS1zeW1ib2wnOiBbXSxcblxufSIsImltcG9ydCB7IENoYXJTdHJlYW0gfSBmcm9tIFwiLi9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSwgTGl0ZXJhbE1lbWJlciwgTWVtYmVyLCBSb2xlLCBTeW50YXgsIFR5cGVNZW1iZXIsIHN5bnRheGVzLCBBc3RUeXBlIH0gZnJvbSBcIi4vY3N0LWF0dGVtcHQyXCI7XG5cbi8vVE9ETyBhbnktc3ltYm9sIGFuZCBleGNlcHRGb3JMaXRlcmFsc1xuLy9UT0RPIGFsbC1idXQtbGFzdFxuXG50eXBlIFN5bnRheFRyZWUgPVxuICAgIHN0cmluZ1xuICAgIHwgc3RyaW5nW11cbiAgICB8IFN5bnRheFRyZWVbXVxuICAgIHwgeyBbeCBpbiBSb2xlXT86IFN5bnRheFRyZWUgfVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB0cnlQYXJzZShzeW50YXhMaXN0OiBBc3RUeXBlW10sIGNzOiBDaGFyU3RyZWFtKSB7XG5cbiAgICBmb3IgKGNvbnN0IHN5bnRheE5hbWUgb2Ygc3ludGF4TGlzdCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSBjcy5nZXRQb3MoKVxuICAgICAgICBjb25zdCBzeW50YXggPSBzeW50YXhlc1tzeW50YXhOYW1lXSAvLyBzdGF0ZSFcbiAgICAgICAgY29uc3QgdHJlZSA9IGtub3duUGFyc2Uoc3ludGF4LCBjcylcblxuICAgICAgICBpZiAodHJlZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRyZWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNzLmJhY2tUbyhtZW1lbnRvKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBrbm93blBhcnNlKHN5bnRheDogU3ludGF4LCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCB1bmRlZmluZWQge1xuXG4gICAgXG4gICAgY29uc3Qgc3Q6IFN5bnRheFRyZWUgPSB7fVxuICAgIFxuICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHN5bnRheCkge1xuICAgICAgICBcblxuICAgICAgICBjb25zdCBub2RlID0gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIGNzKVxuXG4gICAgICAgIGlmICghbm9kZSAmJiBpc05lY2Vzc2FyeShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFub2RlKSB7IC8vIGFuZCBub3QgbmVjZXNzYXJ5XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbWJlci5yb2xlKSB7XG4gICAgICAgICAgICBzdFttZW1iZXIucm9sZV0gPSBub2RlXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBzdFxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlTWVtYmVyUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IFN5bnRheFRyZWVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICBjb25zdCBsaXN0OiBTeW50YXhUcmVlW10gPSBbXVxuXG4gICAgd2hpbGUgKCFjcy5pc0VuZCgpKSB7XG5cbiAgICAgICAgY29uc3Qgc3QgPSBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXIsIGNzKVxuXG4gICAgICAgIGlmICghc3QgJiYgIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0KXtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnB1c2goc3QpXG4gICAgICAgIC8vIG1lbWJlci5zZXAgPz8/Pz8/XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgIGlmIChtZW1iZXIubGl0ZXJhbHMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlTGVhZihtZW1iZXIsIGNzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZUNvbXBvc2l0ZShtZW1iZXIsIGNzKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZUxlYWYobGVhZjogT21pdDxMaXRlcmFsTWVtYmVyLCAnbnVtYmVyJz4sIGNzOiBDaGFyU3RyZWFtKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIHdoaWxlICghY3MuaXNFbmQoKSAmJiAhbGVhZi5saXRlcmFscy5pbmNsdWRlcyhjcy5wZWVrQWNjKCkpKSB7XG4gICAgICAgIGNzLm5leHQoKVxuICAgIH1cblxuICAgIGlmIChjcy5pc0VuZCgpICYmICFsZWFmLmxpdGVyYWxzLmluY2x1ZGVzKGNzLnBlZWtBY2MoKSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGNzLnBlZWtBY2MoKVxuICAgIGNzLmNsZWFyQWNjKClcbiAgICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ29tcG9zaXRlKGNvbXBvc2l0ZTogT21pdDxUeXBlTWVtYmVyLCAnbnVtYmVyJz4sIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRyeVBhcnNlKGNvbXBvc2l0ZS50eXBlcywgY3MpXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgeyBnZXRDaGFyU3RyZWFtIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgdHJ5UGFyc2UgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuXG4vLyBtYWluKClcblxuLy8gY29uc29sZS5sb2coY3N0TW9kZWxUb0FzdE1vZGVsKE5PVU5fUEhSQVNFKSlcblxuY29uc3QgY3MgPSBnZXRDaGFyU3RyZWFtKCdjaWFvICcpXG5jb25zdCB4ID0gdHJ5UGFyc2UoWydpZGVudGlmaWVyJ10sIGNzKVxuY29uc29sZS5sb2coeClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==