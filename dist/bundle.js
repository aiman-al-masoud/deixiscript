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
const cs = (0, char_stream_1.getCharStream)('12    mondo ');
const x = (0, parser_1.tryParse)(['number-literal'], cs);
// console.log(cs, cs.isEnd())
const y = (0, parser_1.tryParse)(['space'], cs);
const z = (0, parser_1.tryParse)(['identifier'], cs);
console.log(x, y, z);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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T0FBTyxJQUFJO0tBQ2Q7QUFFTCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBcUMsRUFBRSxFQUFjO0lBQ3pFLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0FBQ3hDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDOUhELFNBQWdCLGNBQWMsQ0FBbUIsR0FBRyxJQUFTLElBQVMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQXBGLHdDQUFvRjs7Ozs7OztVQ0FwRjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUN0QkEsc0NBQXNDO0FBQ3RDLHlIQUErRDtBQUMvRCwwR0FBcUQ7QUFFckQsU0FBUztBQUVULCtDQUErQztBQUUvQyx5Q0FBeUM7QUFFekMsTUFBTSxFQUFFLEdBQUcsK0JBQWEsRUFBQyxjQUFjLENBQUM7QUFDeEMsTUFBTSxDQUFDLEdBQUcscUJBQVEsRUFBQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzFDLDhCQUE4QjtBQUM5QixNQUFNLENBQUMsR0FBRyxxQkFBUSxFQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxHQUFHLHFCQUFRLEVBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NzdC1hdHRlbXB0Mi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgQ2hhclN0cmVhbSB7XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpZiBhbnkuXG4gICAgICovXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgLyoqXG4gICAgICogUmVhZCB0aGUgY3VycmVudCBjaGFyYWN0ZXIuXG4gICAgICovXG4gICAgcGVlaygpOiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBHbyBiYWNrLlxuICAgICAqL1xuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0UG9zKCk6IG51bWJlclxuICAgIC8qKlxuICAgICAqIFJlYWNoZWQgZW5kIG9mIGNoYXJzdHJlYW0uXG4gICAgICovXG4gICAgaXNFbmQoKTogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhclN0cmVhbShzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEJhc2VDaGFyU3RyZWFtKHNvdXJjZUNvZGUpXG59XG5cbmNsYXNzIEJhc2VDaGFyU3RyZWFtIGltcGxlbWVudHMgQ2hhclN0cmVhbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcG9zID0gMCxcbiAgICApIHtcblxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5kKCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wb3MrK1xuICAgIH1cblxuICAgIHBlZWsoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlQ29kZVt0aGlzLnBvc11cbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXRQb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zXG4gICAgfVxuXG4gICAgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnNvdXJjZUNvZGUubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBTeW50YXggPSBNZW1iZXJbXSAvLyBDc3RNb2RlbFxuXG5cbmV4cG9ydCBjb25zdCByb2xlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdpZCcsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2NoYXJzJyxcbiAgICAncGx1cmFsaXplcicsXG4gICAgJ2FuYXBob3JhT3BlcmF0b3InLFxuICAgICduZXdPcGVyYXRvcicsXG4gICAgJ21vZGlmaWVycycsXG4gICAgJ2hlYWQnLFxuICAgICdsaW1pdEtleXdvcmQnLFxuICAgICdsaW1pdE51bWJlcicsXG4gICAgJ2xlZnRPcGVyYW5kJyxcbiAgICAncmlnaHRPcGVyYW5kJyxcbiAgICAnb3BlcmF0b3InLFxuICAgICdvd25lcicsXG4gICAgJ29iamVjdCcsXG4gICAgJ3JlY2VpdmVyJyxcbiAgICAnaW5zdHJ1bWVudCcsXG4gICAgJ3N1YmplY3QnLFxuICAgICd2ZXJiJyxcbiAgICAnbmVnYXRpb24nLFxuICAgICdjb25kaXRpb24nLFxuICAgICdjb25zZXF1ZW5jZScsXG4gICAgJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nLCAvLyBCQURcbilcblxuZXhwb3J0IHR5cGUgUm9sZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiByb2xlcz5cblxuXG50eXBlIEJhc2VNZW1iZXIgPSB7XG4gICAgcmVhZG9ubHkgbnVtYmVyPzogQ2FyZGluYWxpdHkgLy8gbm8gbnVtYmVyIC0tLT4gMVxuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlIC8vIG5vIHJvbGUgLS0+IGV4Y2x1ZGUgZnJvbSBhc3RcbiAgICByZWFkb25seSBzZXA/OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgTGl0ZXJhbE1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG5cbiAgICByZWFkb25seSBsaXRlcmFsczogc3RyaW5nW11cbiAgICByZWFkb25seSB0eXBlcz86IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBUeXBlTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSB0eXBlczogQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM/OiB1bmRlZmluZWRcbiAgICByZWFkb25seSBleGNlcHRGb3JMaXRlcmFscz86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgZXhwYW5kPzogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXIgPSBMaXRlcmFsTWVtYmVyIHwgVHlwZU1lbWJlclxuXG5leHBvcnQgdHlwZSBBc3RUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGFzdFR5cGVzPlxuXG5leHBvcnQgY29uc3QgYXN0VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnc3BhY2UnLFxuICAgICdpZGVudGlmaWVyJyxcbiAgICAnc3RyaW5nLWxpdGVyYWwnLFxuICAgICdudW1iZXItbGl0ZXJhbCcsXG4gICAgJ2V4cHJlc3Npb24nLCAvLyBhbmQtZXhwcmVzc2lvblxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnLFxuICAgICdzaW1wbGUtc2VudGVuY2UnLFxuICAgICdnZW5pdGl2ZScsXG4gICAgJ2RhdGl2ZScsXG4gICAgJ2luc3RydW1lbnRhbCcsXG4gICAgJ2FjY3VzYXRpdmUnLFxuICAgICd2ZXJiJyxcbiAgICAnY29wdWxhJyxcbiAgICAnZG8tdmVyYicsXG4gICAgJ2NvbXBsZW1lbnQnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZScsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJyxcbiAgICAnYW55LXN5bWJvbCcsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0gPSB7XG5cbiAgICBzcGFjZTogW1xuICAgICAgICB7IG51bWJlcjogJysnLCBsaXRlcmFsczogWycgJywgJ1xcbicsICdcXHQnXSB9XG4gICAgXSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdpZCcsIGxpdGVyYWxzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsICdvJywgJ3AnLCAncScsICdyJywgJ3MnLCAndCcsICd1JywgJ3YnLCAndycsICd4JywgJ3knLCAneiddIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2FueS1zeW1ib2wnXSwgZXhjZXB0Rm9yTGl0ZXJhbHM6IFsnXCInXSwgcm9sZTogJ2NoYXJzJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWycrJywgJy0nLCAnKicsICcvJ10sIHJvbGU6ICdvcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdhY2N1c2F0aXZlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvYmplY3QnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2RhdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWyd0byddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyZWNlaXZlcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnaW5zdHJ1bWVudGFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2J5J10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2luc3RydW1lbnQnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnYWNjdXNhdGl2ZScsICdkYXRpdmUnLCAnaW5zdHJ1bWVudGFsJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnKicgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ3N1YmplY3QnLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndmVyYiddLCBleHBhbmQ6IHRydWUgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuXG4gICAgdmVyYjogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYScsICdkby12ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvJywgJ2RvZXMnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF0sXG5cbiAgICAnYW55LXN5bWJvbCc6IFtdLFxuXG59IiwiaW1wb3J0IHsgQ2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgVHlwZU1lbWJlciwgc3ludGF4ZXMsIEFzdFR5cGUgfSBmcm9tIFwiLi9jc3QtYXR0ZW1wdDJcIjtcblxuLy9UT0RPIGFueS1zeW1ib2wgYW5kIGV4Y2VwdEZvckxpdGVyYWxzXG4vL1RPRE8gYWxsLWJ1dC1sYXN0XG4vL1RPRE8gZXhwYW5kXG5cblxudHlwZSBTeW50YXhUcmVlID1cbiAgICBzdHJpbmdcbiAgICB8IHN0cmluZ1tdXG4gICAgfCBTeW50YXhUcmVlW11cbiAgICB8IHsgW3ggaW4gUm9sZV0/OiBTeW50YXhUcmVlIH1cblxuXG5leHBvcnQgZnVuY3Rpb24gdHJ5UGFyc2Uoc3ludGF4TGlzdDogQXN0VHlwZVtdLCBjczogQ2hhclN0cmVhbSkge1xuXG4gICAgZm9yIChjb25zdCBzeW50YXhOYW1lIG9mIHN5bnRheExpc3QpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gY3MuZ2V0UG9zKClcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gc3ludGF4ZXNbc3ludGF4TmFtZV0gLy8gc3RhdGUhXG4gICAgICAgIGNvbnN0IHRyZWUgPSBrbm93blBhcnNlKHN5bnRheCwgY3MpXG5cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjcy5pc0VuZCgpKVxuICAgICAgICAvLyBjb25zb2xlLmxvZygndHJlZT0nLCB0cmVlKVxuXG4gICAgICAgIGlmICh0cmVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJlZVxuICAgICAgICB9XG5cbiAgICAgICAgY3MuYmFja1RvKG1lbWVudG8pXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGtub3duUGFyc2Uoc3ludGF4OiBTeW50YXgsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHVuZGVmaW5lZCB7XG5cblxuICAgIGNvbnN0IHN0OiBTeW50YXhUcmVlID0ge31cblxuICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHN5bnRheCkge1xuXG5cbiAgICAgICAgY29uc3Qgbm9kZSA9IHBhcnNlTWVtYmVyUmVwZWF0ZWQobWVtYmVyLCBjcylcblxuXG4gICAgICAgIGlmICghbm9kZSAmJiBpc05lY2Vzc2FyeShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFub2RlKSB7IC8vIGFuZCBub3QgbmVjZXNzYXJ5XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbWJlci5yb2xlKSB7XG4gICAgICAgICAgICBzdFttZW1iZXIucm9sZV0gPSBub2RlXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBzdFxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlTWVtYmVyUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IFN5bnRheFRyZWVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICBjb25zdCBsaXN0OiBTeW50YXhUcmVlW10gPSBbXVxuXG4gICAgd2hpbGUgKCFjcy5pc0VuZCgpKSB7XG5cbiAgICAgICAgY29uc3Qgc3QgPSBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXIsIGNzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ21lbWJlcj0nLCBtZW1iZXIsICAnaXNFbmQ9JywgY3MuaXNFbmQoKSwgJ3N0PScsIHN0LCAnbGlzdD0nLCBsaXN0IClcblxuICAgICAgICBpZiAoIXN0ICYmICFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdCkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3QucHVzaChzdClcbiAgICAgICAgLy8gbWVtYmVyLnNlcCA/Pz8/Pz9cbiAgICB9XG5cbiAgICByZXR1cm4gbGlzdFxufVxuXG5mdW5jdGlvbiBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXI6IE1lbWJlciwgY3M6IENoYXJTdHJlYW0pOiBTeW50YXhUcmVlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBkb2Vzbid0IGhhdmUgdG8gdGFrZSBjYXJlIGFib3V0IG51bWJlclxuXG4gICAgaWYgKG1lbWJlci5saXRlcmFscykge1xuICAgICAgICByZXR1cm4gcGFyc2VMaXRlcmFsKG1lbWJlciwgY3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQ29tcG9zaXRlKG1lbWJlciwgY3MpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlTGl0ZXJhbChtZW1iZXI6IExpdGVyYWxNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAobWVtYmVyLmxpdGVyYWxzLmV2ZXJ5KHggPT4geC5sZW5ndGggPD0gMSkpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlQ2hhcihtZW1iZXIsIGNzKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZUNoYXIobGVhZjogT21pdDxMaXRlcmFsTWVtYmVyLCAnbnVtYmVyJz4sIGNzOiBDaGFyU3RyZWFtKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IGNoYXIgPSBjcy5wZWVrKClcblxuICAgIGlmIChsZWFmLmxpdGVyYWxzLmluY2x1ZGVzKGNoYXIpKSB7XG4gICAgICAgIGNzLm5leHQoKVxuICAgICAgICByZXR1cm4gY2hhclxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZUNvbXBvc2l0ZShjb21wb3NpdGU6IE9taXQ8VHlwZU1lbWJlciwgJ251bWJlcic+LCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0cnlQYXJzZShjb21wb3NpdGUudHlwZXMsIGNzKVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW1cIjtcbmltcG9ydCB7IHRyeVBhcnNlIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cbi8vIGNvbnNvbGUubG9nKGNzdE1vZGVsVG9Bc3RNb2RlbChOT1VOX1BIUkFTRSkpXG5cbi8vIGNvbnN0IHggPSB0cnlQYXJzZShbJ2lkZW50aWZpZXInXSwgY3MpXG5cbmNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbmNvbnN0IHggPSB0cnlQYXJzZShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuLy8gY29uc29sZS5sb2coY3MsIGNzLmlzRW5kKCkpXG5jb25zdCB5ID0gdHJ5UGFyc2UoWydzcGFjZSddLCBjcylcbmNvbnN0IHogPSB0cnlQYXJzZShbJ2lkZW50aWZpZXInXSwgY3MpXG5jb25zb2xlLmxvZyh4LCB5LCB6KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9