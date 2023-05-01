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
        { number: '+', role: 'id', literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
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
const cs = (0, char_stream_1.getCharStream)('12 ');
const x = (0, parser_1.tryParse)(['number-literal'], cs);
console.log(x);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtRQUNyRCxPQUFPLFNBQVM7S0FDbkI7SUFFRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFO0lBQzNCLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDYixPQUFPLE1BQU07QUFDakIsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLFNBQXFDLEVBQUUsRUFBYztJQUN6RSxPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUN4QyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2xIRCxTQUFnQixjQUFjLENBQW1CLEdBQUcsSUFBUyxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFwRix3Q0FBb0Y7Ozs7Ozs7VUNBcEY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7O0FDdEJBLHNDQUFzQztBQUN0Qyx5SEFBK0Q7QUFDL0QsMEdBQXFEO0FBRXJELFNBQVM7QUFFVCwrQ0FBK0M7QUFFL0MsTUFBTSxFQUFFLEdBQUcsK0JBQWEsRUFBQyxLQUFLLENBQUM7QUFDL0IsTUFBTSxDQUFDLEdBQUcscUJBQVEsRUFBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY3N0LWF0dGVtcHQyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgbmV4dCBjaGFyIHRvIHRoZSBhY2N1bXVsYXRvclxuICAgICAqL1xuICAgIG5leHQoKTogdm9pZFxuICAgIC8qKlxuICAgICAqIFJlYWQgdGhlIGFjY3VtdWxhdGVkIHZhbHVlXG4gICAgICovXG4gICAgcGVla0FjYygpOiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBDbGVhciB0aGUgYWNjdW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBjbGVhckFjYygpOiB2b2lkXG4gICAgLyoqXG4gICAgICogR28gYmFjayBBTkQgY2xlYXIgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqL1xuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0UG9zKCk6IG51bWJlclxuICAgIC8qKlxuICAgICAqIFJlYWNoZWQgZW5kIG9mIGNoYXJzdHJlYW0uXG4gICAgICovXG4gICAgaXNFbmQoKTogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhclN0cmVhbShzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEJhc2VDaGFyU3RyZWFtKHNvdXJjZUNvZGUpXG59XG5cbmNsYXNzIEJhc2VDaGFyU3RyZWFtIGltcGxlbWVudHMgQ2hhclN0cmVhbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcG9zID0gMCxcbiAgICAgICAgcHJvdGVjdGVkIGFjYyA9ICcnLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmQoKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjYyArPSB0aGlzLnNvdXJjZUNvZGVbdGhpcy5wb3NdXG4gICAgICAgIHRoaXMucG9zKytcbiAgICB9XG5cbiAgICBjbGVhckFjYygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hY2MgPSAnJ1xuICAgIH1cblxuICAgIHBlZWtBY2MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zXG4gICAgICAgIHRoaXMuY2xlYXJBY2MoKVxuICAgIH1cblxuICAgIGdldFBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NcbiAgICB9XG5cbiAgICBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMuc291cmNlQ29kZS5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIFN5bnRheCA9IE1lbWJlcltdIC8vIENzdE1vZGVsXG5cblxuZXhwb3J0IGNvbnN0IHJvbGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ2lkJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnY2hhcnMnLFxuICAgICdwbHVyYWxpemVyJyxcbiAgICAnYW5hcGhvcmFPcGVyYXRvcicsXG4gICAgJ25ld09wZXJhdG9yJyxcbiAgICAnbW9kaWZpZXJzJyxcbiAgICAnaGVhZCcsXG4gICAgJ2xpbWl0S2V5d29yZCcsXG4gICAgJ2xpbWl0TnVtYmVyJyxcbiAgICAnbGVmdE9wZXJhbmQnLFxuICAgICdyaWdodE9wZXJhbmQnLFxuICAgICdvcGVyYXRvcicsXG4gICAgJ293bmVyJyxcbiAgICAnb2JqZWN0JyxcbiAgICAncmVjZWl2ZXInLFxuICAgICdpbnN0cnVtZW50JyxcbiAgICAnc3ViamVjdCcsXG4gICAgJ3ZlcmInLFxuICAgICduZWdhdGlvbicsXG4gICAgJ2NvbmRpdGlvbicsXG4gICAgJ2NvbnNlcXVlbmNlJyxcbiAgICAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicsIC8vIEJBRFxuKVxuXG5leHBvcnQgdHlwZSBSb2xlID0gRWxlbWVudFR5cGU8dHlwZW9mIHJvbGVzPlxuXG5cbnR5cGUgQmFzZU1lbWJlciA9IHtcbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eSAvLyBubyBudW1iZXIgLS0tPiAxXG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGUgLy8gbm8gcm9sZSAtLT4gZXhjbHVkZSBmcm9tIGFzdFxuICAgIHJlYWRvbmx5IHNlcD86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBMaXRlcmFsTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcblxuICAgIHJlYWRvbmx5IGxpdGVyYWxzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHR5cGVzPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIFR5cGVNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IHR5cGVzOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBsaXRlcmFscz86IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGV4Y2VwdEZvckxpdGVyYWxzPzogc3RyaW5nW11cbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IExpdGVyYWxNZW1iZXIgfCBUeXBlTWVtYmVyXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgYXN0VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBhc3RUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdzcGFjZScsXG4gICAgJ2lkZW50aWZpZXInLFxuICAgICdzdHJpbmctbGl0ZXJhbCcsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnZXhwcmVzc2lvbicsIC8vIGFuZC1leHByZXNzaW9uXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnbGltaXQtcGhyYXNlJyxcbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG4gICAgJ3NpbXBsZS1zZW50ZW5jZScsXG4gICAgJ2dlbml0aXZlJyxcbiAgICAnZGF0aXZlJyxcbiAgICAnaW5zdHJ1bWVudGFsJyxcbiAgICAnYWNjdXNhdGl2ZScsXG4gICAgJ3ZlcmInLFxuICAgICdjb3B1bGEnLFxuICAgICdkby12ZXJiJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nLFxuICAgICdhbnktc3ltYm9sJyxcbilcblxuZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCAnYWxsLWJ1dC1sYXN0J1xuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgbGl0ZXJhbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsICdvJywgJ3AnLCAncScsICdyJywgJ3MnLCAndCcsICd1JywgJ3YnLCAndycsICd4JywgJ3knLCAneiddIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2FueS1zeW1ib2wnXSwgZXhjZXB0Rm9yTGl0ZXJhbHM6IFsnXCInXSwgcm9sZTogJ2NoYXJzJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWycrJywgJy0nLCAnKicsICcvJ10sIHJvbGU6ICdvcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdhY2N1c2F0aXZlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvYmplY3QnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2RhdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWyd0byddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyZWNlaXZlcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnaW5zdHJ1bWVudGFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2J5J10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2luc3RydW1lbnQnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnYWNjdXNhdGl2ZScsICdkYXRpdmUnLCAnaW5zdHJ1bWVudGFsJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnKicgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ3N1YmplY3QnLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndmVyYiddLCBleHBhbmQ6IHRydWUgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuXG4gICAgdmVyYjogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYScsICdkby12ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvJywgJ2RvZXMnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF0sXG5cbiAgICAnYW55LXN5bWJvbCc6IFtdLFxuXG59IiwiaW1wb3J0IHsgQ2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgVHlwZU1lbWJlciwgc3ludGF4ZXMsIEFzdFR5cGUgfSBmcm9tIFwiLi9jc3QtYXR0ZW1wdDJcIjtcblxuLy9UT0RPIGFueS1zeW1ib2wgYW5kIGV4Y2VwdEZvckxpdGVyYWxzXG4vL1RPRE8gYWxsLWJ1dC1sYXN0XG5cbnR5cGUgU3ludGF4VHJlZSA9XG4gICAgc3RyaW5nXG4gICAgfCBzdHJpbmdbXVxuICAgIHwgU3ludGF4VHJlZVtdXG4gICAgfCB7IFt4IGluIFJvbGVdPzogU3ludGF4VHJlZSB9XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlKHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgY3M6IENoYXJTdHJlYW0pIHtcblxuICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IGNzLmdldFBvcygpXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHN5bnRheGVzW3N5bnRheE5hbWVdIC8vIHN0YXRlIVxuICAgICAgICBjb25zdCB0cmVlID0ga25vd25QYXJzZShzeW50YXgsIGNzKVxuXG4gICAgICAgIGlmICh0cmVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJlZVxuICAgICAgICB9XG5cbiAgICAgICAgY3MuYmFja1RvKG1lbWVudG8pXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGtub3duUGFyc2Uoc3ludGF4OiBTeW50YXgsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHVuZGVmaW5lZCB7XG5cbiAgICBcbiAgICBjb25zdCBzdDogU3ludGF4VHJlZSA9IHt9XG4gICAgXG4gICAgZm9yIChjb25zdCBtZW1iZXIgb2Ygc3ludGF4KSB7XG4gICAgICAgIFxuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgY3MpXG5cbiAgICAgICAgaWYgKCFub2RlICYmIGlzTmVjZXNzYXJ5KG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW5vZGUpIHsgLy8gYW5kIG5vdCBuZWNlc3NhcnlcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLnJvbGUpIHtcbiAgICAgICAgICAgIHN0W21lbWJlci5yb2xlXSA9IG5vZGVcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0XG5cbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgU3ludGF4VHJlZVtdIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBpc05lY2Vzc2FyeSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuIGNhcmUgb2ZcblxuICAgIGNvbnN0IGxpc3Q6IFN5bnRheFRyZWVbXSA9IFtdXG5cbiAgICB3aGlsZSAoIWNzLmlzRW5kKCkpIHtcblxuICAgICAgICBjb25zdCBzdCA9IHBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgY3MpXG5cbiAgICAgICAgaWYgKCFzdCAmJiAhbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3Qpe1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3QucHVzaChzdClcbiAgICAgICAgLy8gbWVtYmVyLnNlcCA/Pz8/Pz9cbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFxufVxuXG5mdW5jdGlvbiBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBkb2Vzbid0IGhhdmUgdG8gdGFrZSBjYXJlIGFib3V0IG51bWJlclxuXG4gICAgaWYgKG1lbWJlci5saXRlcmFscykge1xuICAgICAgICByZXR1cm4gcGFyc2VMZWFmKG1lbWJlciwgY3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQ29tcG9zaXRlKG1lbWJlciwgY3MpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlTGVhZihsZWFmOiBPbWl0PExpdGVyYWxNZW1iZXIsICdudW1iZXInPiwgY3M6IENoYXJTdHJlYW0pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgd2hpbGUgKCFjcy5pc0VuZCgpICYmICFsZWFmLmxpdGVyYWxzLmluY2x1ZGVzKGNzLnBlZWtBY2MoKSkpIHtcbiAgICAgICAgY3MubmV4dCgpXG4gICAgfVxuXG4gICAgaWYgKGNzLmlzRW5kKCkgJiYgIWxlYWYubGl0ZXJhbHMuaW5jbHVkZXMoY3MucGVla0FjYygpKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gY3MucGVla0FjYygpXG4gICAgY3MuY2xlYXJBY2MoKVxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gcGFyc2VDb21wb3NpdGUoY29tcG9zaXRlOiBPbWl0PFR5cGVNZW1iZXIsICdudW1iZXInPiwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdHJ5UGFyc2UoY29tcG9zaXRlLnR5cGVzLCBjcylcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyB0cnlQYXJzZSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyXCI7XG5cbi8vIG1haW4oKVxuXG4vLyBjb25zb2xlLmxvZyhjc3RNb2RlbFRvQXN0TW9kZWwoTk9VTl9QSFJBU0UpKVxuXG5jb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICcpXG5jb25zdCB4ID0gdHJ5UGFyc2UoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbmNvbnNvbGUubG9nKHgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=