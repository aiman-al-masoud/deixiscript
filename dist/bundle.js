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
        { types: ['space'] },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'] },
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
    const singleLetterLiterals = member
        .literals
        .filter(x => x.length <= 1);
    for (const x of singleLetterLiterals) {
        const r = parseChar({ literals: [x] }, cs);
        if (r) {
            return r;
        }
    }
    const multiLetterLiterals = member
        .literals
        .filter(x => x.length > 1)
        .map(x => x.split('').map(c => ({ literals: [c] })));
    // console.log('must go to', 'multiLetterLiterals=', multiLetterLiterals)
    for (const x of multiLetterLiterals) {
        const r = knownParse(x, cs);
        if (r) {
            return r;
        }
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
// EXAMPLE 0 
// const cs = getCharStream('12    mondo ')
// const x = tryParse(['number-literal'], cs)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEsc0NBQXNDO0FBQ3RDLHlIQUErRDtBQUMvRCwwR0FBcUQ7QUFFckQsU0FBUztBQUVULGFBQWE7QUFDYiwyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDLG9DQUFvQztBQUNwQyx5Q0FBeUM7QUFDekMsdUJBQXVCO0FBRXZCLFlBQVk7QUFDWiwyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDLFlBQVk7QUFDWixNQUFNLEVBQUUsR0FBRywrQkFBYSxFQUFDLGNBQWMsQ0FBQztBQUN4QyxNQUFNLENBQUMsR0FBRyxxQkFBUSxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY3N0LWF0dGVtcHQyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGhlIG5leHQgY2hhcmFjdGVyIGlmIGFueS5cbiAgICAgKi9cbiAgICBuZXh0KCk6IHZvaWRcbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBwZWVrKCk6IHN0cmluZ1xuICAgIC8qKlxuICAgICAqIEdvIGJhY2suXG4gICAgICovXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRQb3MoKTogbnVtYmVyXG4gICAgLyoqXG4gICAgICogUmVhY2hlZCBlbmQgb2YgY2hhcnN0cmVhbS5cbiAgICAgKi9cbiAgICBpc0VuZCgpOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgQmFzZUNoYXJTdHJlYW0oc291cmNlQ29kZSlcbn1cblxuY2xhc3MgQmFzZUNoYXJTdHJlYW0gaW1wbGVtZW50cyBDaGFyU3RyZWFtIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwb3MgPSAwLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmQoKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvcysrXG4gICAgfVxuXG4gICAgcGVlaygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VDb2RlW3RoaXMucG9zXVxuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldFBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NcbiAgICB9XG5cbiAgICBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMuc291cmNlQ29kZS5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIFN5bnRheCA9IE1lbWJlcltdIC8vIENzdE1vZGVsXG5cblxuZXhwb3J0IGNvbnN0IHJvbGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ2lkJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnY2hhcnMnLFxuICAgICdwbHVyYWxpemVyJyxcbiAgICAnYW5hcGhvcmFPcGVyYXRvcicsXG4gICAgJ25ld09wZXJhdG9yJyxcbiAgICAnbW9kaWZpZXJzJyxcbiAgICAnaGVhZCcsXG4gICAgJ2xpbWl0S2V5d29yZCcsXG4gICAgJ2xpbWl0TnVtYmVyJyxcbiAgICAnbGVmdE9wZXJhbmQnLFxuICAgICdyaWdodE9wZXJhbmQnLFxuICAgICdvcGVyYXRvcicsXG4gICAgJ293bmVyJyxcbiAgICAnb2JqZWN0JyxcbiAgICAncmVjZWl2ZXInLFxuICAgICdpbnN0cnVtZW50JyxcbiAgICAnc3ViamVjdCcsXG4gICAgJ3ZlcmInLFxuICAgICduZWdhdGlvbicsXG4gICAgJ2NvbmRpdGlvbicsXG4gICAgJ2NvbnNlcXVlbmNlJyxcbiAgICAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicsIC8vIEJBRFxuKVxuXG5leHBvcnQgdHlwZSBSb2xlID0gRWxlbWVudFR5cGU8dHlwZW9mIHJvbGVzPlxuXG5cbnR5cGUgQmFzZU1lbWJlciA9IHtcbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eSAvLyBubyBudW1iZXIgLS0tPiAxXG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGUgLy8gbm8gcm9sZSAtLT4gZXhjbHVkZSBmcm9tIGFzdFxuICAgIHJlYWRvbmx5IHNlcD86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBMaXRlcmFsTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcblxuICAgIHJlYWRvbmx5IGxpdGVyYWxzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHR5cGVzPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIFR5cGVNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IHR5cGVzOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBsaXRlcmFscz86IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGV4Y2VwdEZvckxpdGVyYWxzPzogc3RyaW5nW11cbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IExpdGVyYWxNZW1iZXIgfCBUeXBlTWVtYmVyXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgYXN0VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBhc3RUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdzcGFjZScsXG4gICAgJ2lkZW50aWZpZXInLFxuICAgICdzdHJpbmctbGl0ZXJhbCcsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnZXhwcmVzc2lvbicsIC8vIGFuZC1leHByZXNzaW9uXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnbGltaXQtcGhyYXNlJyxcbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG4gICAgJ3NpbXBsZS1zZW50ZW5jZScsXG4gICAgJ2dlbml0aXZlJyxcbiAgICAnZGF0aXZlJyxcbiAgICAnaW5zdHJ1bWVudGFsJyxcbiAgICAnYWNjdXNhdGl2ZScsXG4gICAgJ3ZlcmInLFxuICAgICdjb3B1bGEnLFxuICAgICdkby12ZXJiJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nLFxuICAgICdhbnktc3ltYm9sJyxcbilcblxuZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCAnYWxsLWJ1dC1sYXN0J1xuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgbGl0ZXJhbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJywgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsICd3JywgJ3gnLCAneScsICd6J10gfVxuICAgIF0sXG4gICAgJ251bWJlci1saXRlcmFsJzogW1xuICAgICAgICB7IG51bWJlcjogJysnLCByb2xlOiAnZGlnaXRzJywgbGl0ZXJhbHM6IFsnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddIH1cbiAgICBdLFxuICAgICdzdHJpbmctbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnYW55LXN5bWJvbCddLCBleGNlcHRGb3JMaXRlcmFsczogWydcIiddLCByb2xlOiAnY2hhcnMnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgIF0sXG4gICAgJ25vdW4tcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2V2ZXJ5JywgJ2FueSddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlJywgJ29sZCddLCByb2xlOiAnYW5hcGhvcmFPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYScsICdhbicsICduZXcnXSwgcm9sZTogJ25ld09wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydsaW1pdC1waHJhc2UnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ21vZGlmaWVycycsIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJywgJ3N0cmluZy1saXRlcmFsJywgJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdoZWFkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsncyddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZ2VuaXRpdmUnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2ZpcnN0JywgJ2xhc3QnXSwgcm9sZTogJ2xpbWl0S2V5d29yZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnbGltaXROdW1iZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ3JpZ2h0T3BlcmFuZCcsIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgXCJleHByZXNzaW9uXCI6IFtcbiAgICAgICAgeyB0eXBlczogWydtYXRoLWV4cHJlc3Npb24nXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydhbmQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydtYXRoLWV4cHJlc3Npb24nXSwgcm9sZTogJ3JpZ2h0T3BlcmFuZCcsIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG5cbiAgICAnZ2VuaXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnb2YnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb3duZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2FjY3VzYXRpdmUnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ29iamVjdCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnZGF0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RvJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ3JlY2VpdmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdpbnN0cnVtZW50YWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYnknXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnaW5zdHJ1bWVudCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcbiAgICAgICAgeyB0eXBlczogWydhY2N1c2F0aXZlJywgJ2RhdGl2ZScsICdpbnN0cnVtZW50YWwnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcqJyB9XG4gICAgXSxcblxuICAgICdzaW1wbGUtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZXhwcmVzc2lvbiddLCByb2xlOiAnc3ViamVjdCcsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndmVyYiddLCBleHBhbmQ6IHRydWUgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJywgZXhwYW5kOiB0cnVlIH0sXG4gICAgXSxcblxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG5cbiAgICAnZG8tdmVyYic6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydkbycsICdkb2VzJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF0sXG5cbiAgICAnYW55LXN5bWJvbCc6IFtdLFxuXG59IiwiaW1wb3J0IHsgQ2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgVHlwZU1lbWJlciwgc3ludGF4ZXMsIEFzdFR5cGUgfSBmcm9tIFwiLi9jc3QtYXR0ZW1wdDJcIjtcblxuLy9UT0RPIGFueS1zeW1ib2wgYW5kIGV4Y2VwdEZvckxpdGVyYWxzXG4vL1RPRE8gYWxsLWJ1dC1sYXN0XG4vL1RPRE8gZXhwYW5kXG5cblxudHlwZSBTeW50YXhUcmVlID1cbiAgICBzdHJpbmdcbiAgICB8IHN0cmluZ1tdXG4gICAgfCBTeW50YXhUcmVlW11cbiAgICB8IHsgW3ggaW4gUm9sZV0/OiBTeW50YXhUcmVlIH1cblxuXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2Uoc3ludGF4TGlzdDogQXN0VHlwZVtdLCBjczogQ2hhclN0cmVhbSkge1xuXG4gICAgZm9yIChjb25zdCBzeW50YXhOYW1lIG9mIHN5bnRheExpc3QpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gY3MuZ2V0UG9zKClcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gc3ludGF4ZXNbc3ludGF4TmFtZV0gLy8gc3RhdGUhXG4gICAgICAgIGNvbnN0IHRyZWUgPSBrbm93blBhcnNlKHN5bnRheCwgY3MpXG5cbiAgICAgICAgaWYgKHRyZWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmVlXG4gICAgICAgIH1cblxuICAgICAgICBjcy5iYWNrVG8obWVtZW50bylcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24ga25vd25QYXJzZShzeW50YXg6IFN5bnRheCwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgdW5kZWZpbmVkIHtcblxuXG4gICAgY29uc3Qgc3Q6IFN5bnRheFRyZWUgPSB7fVxuXG4gICAgZm9yIChjb25zdCBtZW1iZXIgb2Ygc3ludGF4KSB7XG5cblxuICAgICAgICBjb25zdCBub2RlID0gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIGNzKVxuXG5cbiAgICAgICAgaWYgKCFub2RlICYmIGlzTmVjZXNzYXJ5KG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW5vZGUpIHsgLy8gYW5kIG5vdCBuZWNlc3NhcnlcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLnJvbGUpIHtcbiAgICAgICAgICAgIHN0W21lbWJlci5yb2xlXSA9IG5vZGVcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgU3ludGF4VHJlZVtdIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBpc05lY2Vzc2FyeSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuIGNhcmUgb2ZcblxuICAgIGNvbnN0IGxpc3Q6IFN5bnRheFRyZWVbXSA9IFtdXG5cbiAgICB3aGlsZSAoIWNzLmlzRW5kKCkpIHtcblxuICAgICAgICBjb25zdCBzdCA9IHBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgY3MpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnbWVtYmVyPScsIG1lbWJlciwgICdpc0VuZD0nLCBjcy5pc0VuZCgpLCAnc3Q9Jywgc3QsICdsaXN0PScsIGxpc3QgKVxuXG4gICAgICAgIGlmICghc3QgJiYgIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0KSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybiBzdFxuICAgICAgICB9XG5cbiAgICAgICAgbGlzdC5wdXNoKHN0KVxuICAgICAgICAvLyBtZW1iZXIuc2VwID8/Pz8/P1xuICAgIH1cblxuICAgIHJldHVybiBsaXN0XG59XG5cbmZ1bmN0aW9uIHBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlcjogTWVtYmVyLCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIC8vIGRvZXNuJ3QgaGF2ZSB0byB0YWtlIGNhcmUgYWJvdXQgbnVtYmVyXG5cbiAgICBpZiAobWVtYmVyLmxpdGVyYWxzKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUxpdGVyYWwobWVtYmVyLCBjcylcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VDb21wb3NpdGUobWVtYmVyLCBjcylcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VMaXRlcmFsKG1lbWJlcjogTGl0ZXJhbE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IHNpbmdsZUxldHRlckxpdGVyYWxzID1cbiAgICAgICAgbWVtYmVyXG4gICAgICAgICAgICAubGl0ZXJhbHNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA8PSAxKVxuXG4gICAgZm9yIChjb25zdCB4IG9mIHNpbmdsZUxldHRlckxpdGVyYWxzKSB7XG4gICAgICAgIGNvbnN0IHIgPSBwYXJzZUNoYXIoeyBsaXRlcmFsczogW3hdIH0sIGNzKVxuICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG11bHRpTGV0dGVyTGl0ZXJhbHM6IFN5bnRheFtdID0gbWVtYmVyXG4gICAgICAgIC5saXRlcmFsc1xuICAgICAgICAuZmlsdGVyKHggPT4geC5sZW5ndGggPiAxKVxuICAgICAgICAubWFwKHggPT4geC5zcGxpdCgnJykubWFwKGMgPT4gKHsgbGl0ZXJhbHM6IFtjXSB9KSkpXG5cbiAgICAvLyBjb25zb2xlLmxvZygnbXVzdCBnbyB0bycsICdtdWx0aUxldHRlckxpdGVyYWxzPScsIG11bHRpTGV0dGVyTGl0ZXJhbHMpXG5cbiAgICBmb3IgKGNvbnN0IHggb2YgbXVsdGlMZXR0ZXJMaXRlcmFscykge1xuICAgICAgICBjb25zdCByID0ga25vd25QYXJzZSh4LCBjcylcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgIHJldHVybiByXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VDaGFyKGxlYWY6IE9taXQ8TGl0ZXJhbE1lbWJlciwgJ251bWJlcic+LCBjczogQ2hhclN0cmVhbSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBjaGFyID0gY3MucGVlaygpXG5cbiAgICBpZiAobGVhZi5saXRlcmFscy5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICBjcy5uZXh0KClcbiAgICAgICAgcmV0dXJuIGNoYXJcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VDb21wb3NpdGUoY29tcG9zaXRlOiBPbWl0PFR5cGVNZW1iZXIsICdudW1iZXInPiwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdHJ5UGFyc2UoY29tcG9zaXRlLnR5cGVzLCBjcylcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyB0cnlQYXJzZSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyXCI7XG5cbi8vIG1haW4oKVxuXG4vLyBFWEFNUExFIDAgXG4vLyBjb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4ID0gdHJ5UGFyc2UoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbi8vIGNvbnN0IHkgPSB0cnlQYXJzZShbJ3NwYWNlJ10sIGNzKVxuLy8gY29uc3QgeiA9IHRyeVBhcnNlKFsnaWRlbnRpZmllciddLCBjcylcbi8vIGNvbnNvbGUubG9nKHgsIHksIHopXG5cbi8vIEVYQU1QTEUgMVxuLy8gY29uc3QgY3MgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeCA9IHRyeVBhcnNlKFsnbnVtYmVyLWxpdGVyYWwnXSwgY3MpXG4vLyBFWEFNUExFIDJcbmNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnZG8gbm90IG1ha2UgJylcbmNvbnN0IHggPSB0cnlQYXJzZShbJ2RvLXZlcmInXSwgY3MpXG5jb25zb2xlLmxvZyh4KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9