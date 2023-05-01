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
        this.next();
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
        return parseLeaf(member, cs);
    }
    else {
        return parseComposite(member, cs);
    }
}
function parseLeaf(leaf, cs) {
    const tok = cs.peekAcc();
    if (leaf.literals.includes(tok)) {
        cs.clearAcc();
        cs.next();
        return tok;
    }
    // while (!cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
    //     cs.next()
    //     // console.log('acc=', cs.peekAcc(), 'literals=', leaf.literals)
    // }
    // if (cs.isEnd() && !leaf.literals.includes(cs.peekAcc())) {
    //     return undefined
    // }
    // const result = cs.peekAcc()
    // // console.log('result=', result)
    // cs.clearAcc()
    // return result
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Y2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY3N0LWF0dGVtcHQyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgbmV4dCBjaGFyIHRvIHRoZSBhY2N1bXVsYXRvclxuICAgICAqL1xuICAgIG5leHQoKTogdm9pZFxuICAgIC8qKlxuICAgICAqIFJlYWQgdGhlIGFjY3VtdWxhdGVkIHZhbHVlXG4gICAgICovXG4gICAgcGVla0FjYygpOiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBDbGVhciB0aGUgYWNjdW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBjbGVhckFjYygpOiB2b2lkXG4gICAgLyoqXG4gICAgICogR28gYmFjayBBTkQgY2xlYXIgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqL1xuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0UG9zKCk6IG51bWJlclxuICAgIC8qKlxuICAgICAqIFJlYWNoZWQgZW5kIG9mIGNoYXJzdHJlYW0uXG4gICAgICovXG4gICAgaXNFbmQoKTogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhclN0cmVhbShzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEJhc2VDaGFyU3RyZWFtKHNvdXJjZUNvZGUpXG59XG5cbmNsYXNzIEJhc2VDaGFyU3RyZWFtIGltcGxlbWVudHMgQ2hhclN0cmVhbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcG9zID0gMCxcbiAgICAgICAgcHJvdGVjdGVkIGFjYyA9ICcnLFxuICAgICkge1xuICAgICAgICB0aGlzLm5leHQoKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5kKCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY2MgKz0gdGhpcy5zb3VyY2VDb2RlW3RoaXMucG9zXVxuICAgICAgICB0aGlzLnBvcysrXG4gICAgfVxuXG4gICAgY2xlYXJBY2MoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWNjID0gJydcbiAgICB9XG5cbiAgICBwZWVrQWNjKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgICAgICB0aGlzLmNsZWFyQWNjKClcbiAgICB9XG5cbiAgICBnZXRQb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zXG4gICAgfVxuXG4gICAgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnNvdXJjZUNvZGUubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBTeW50YXggPSBNZW1iZXJbXSAvLyBDc3RNb2RlbFxuXG5cbmV4cG9ydCBjb25zdCByb2xlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdpZCcsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2NoYXJzJyxcbiAgICAncGx1cmFsaXplcicsXG4gICAgJ2FuYXBob3JhT3BlcmF0b3InLFxuICAgICduZXdPcGVyYXRvcicsXG4gICAgJ21vZGlmaWVycycsXG4gICAgJ2hlYWQnLFxuICAgICdsaW1pdEtleXdvcmQnLFxuICAgICdsaW1pdE51bWJlcicsXG4gICAgJ2xlZnRPcGVyYW5kJyxcbiAgICAncmlnaHRPcGVyYW5kJyxcbiAgICAnb3BlcmF0b3InLFxuICAgICdvd25lcicsXG4gICAgJ29iamVjdCcsXG4gICAgJ3JlY2VpdmVyJyxcbiAgICAnaW5zdHJ1bWVudCcsXG4gICAgJ3N1YmplY3QnLFxuICAgICd2ZXJiJyxcbiAgICAnbmVnYXRpb24nLFxuICAgICdjb25kaXRpb24nLFxuICAgICdjb25zZXF1ZW5jZScsXG4gICAgJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nLCAvLyBCQURcbilcblxuZXhwb3J0IHR5cGUgUm9sZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiByb2xlcz5cblxuXG50eXBlIEJhc2VNZW1iZXIgPSB7XG4gICAgcmVhZG9ubHkgbnVtYmVyPzogQ2FyZGluYWxpdHkgLy8gbm8gbnVtYmVyIC0tLT4gMVxuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlIC8vIG5vIHJvbGUgLS0+IGV4Y2x1ZGUgZnJvbSBhc3RcbiAgICByZWFkb25seSBzZXA/OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgTGl0ZXJhbE1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG5cbiAgICByZWFkb25seSBsaXRlcmFsczogc3RyaW5nW11cbiAgICByZWFkb25seSB0eXBlcz86IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBUeXBlTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSB0eXBlczogQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM/OiB1bmRlZmluZWRcbiAgICByZWFkb25seSBleGNlcHRGb3JMaXRlcmFscz86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgZXhwYW5kPzogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXIgPSBMaXRlcmFsTWVtYmVyIHwgVHlwZU1lbWJlclxuXG5leHBvcnQgdHlwZSBBc3RUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGFzdFR5cGVzPlxuXG5leHBvcnQgY29uc3QgYXN0VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnc3BhY2UnLFxuICAgICdpZGVudGlmaWVyJyxcbiAgICAnc3RyaW5nLWxpdGVyYWwnLFxuICAgICdudW1iZXItbGl0ZXJhbCcsXG4gICAgJ2V4cHJlc3Npb24nLCAvLyBhbmQtZXhwcmVzc2lvblxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnLFxuICAgICdzaW1wbGUtc2VudGVuY2UnLFxuICAgICdnZW5pdGl2ZScsXG4gICAgJ2RhdGl2ZScsXG4gICAgJ2luc3RydW1lbnRhbCcsXG4gICAgJ2FjY3VzYXRpdmUnLFxuICAgICd2ZXJiJyxcbiAgICAnY29wdWxhJyxcbiAgICAnZG8tdmVyYicsXG4gICAgJ2NvbXBsZW1lbnQnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZScsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJyxcbiAgICAnYW55LXN5bWJvbCcsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0gPSB7XG5cbiAgICBzcGFjZTogW1xuICAgICAgICB7IG51bWJlcjogJysnLCBsaXRlcmFsczogWycgJywgJ1xcbicsICdcXHQnXSB9XG4gICAgXSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdpZCcsIGxpdGVyYWxzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsICdvJywgJ3AnLCAncScsICdyJywgJ3MnLCAndCcsICd1JywgJ3YnLCAndycsICd4JywgJ3knLCAneiddIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2FueS1zeW1ib2wnXSwgZXhjZXB0Rm9yTGl0ZXJhbHM6IFsnXCInXSwgcm9sZTogJ2NoYXJzJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWycrJywgJy0nLCAnKicsICcvJ10sIHJvbGU6ICdvcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdhY2N1c2F0aXZlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvYmplY3QnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2RhdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWyd0byddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyZWNlaXZlcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG5cbiAgICAnaW5zdHJ1bWVudGFsJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2J5J10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ2luc3RydW1lbnQnLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnYWNjdXNhdGl2ZScsICdkYXRpdmUnLCAnaW5zdHJ1bWVudGFsJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnKicgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ3N1YmplY3QnLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndmVyYiddLCBleHBhbmQ6IHRydWUgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuXG4gICAgdmVyYjogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYScsICdkby12ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvJywgJ2RvZXMnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF0sXG5cbiAgICAnYW55LXN5bWJvbCc6IFtdLFxuXG59IiwiaW1wb3J0IHsgQ2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgVHlwZU1lbWJlciwgc3ludGF4ZXMsIEFzdFR5cGUgfSBmcm9tIFwiLi9jc3QtYXR0ZW1wdDJcIjtcblxuLy9UT0RPIGFueS1zeW1ib2wgYW5kIGV4Y2VwdEZvckxpdGVyYWxzXG4vL1RPRE8gYWxsLWJ1dC1sYXN0XG5cbnR5cGUgU3ludGF4VHJlZSA9XG4gICAgc3RyaW5nXG4gICAgfCBzdHJpbmdbXVxuICAgIHwgU3ludGF4VHJlZVtdXG4gICAgfCB7IFt4IGluIFJvbGVdPzogU3ludGF4VHJlZSB9XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlKHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgY3M6IENoYXJTdHJlYW0pIHtcblxuICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IGNzLmdldFBvcygpXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHN5bnRheGVzW3N5bnRheE5hbWVdIC8vIHN0YXRlIVxuICAgICAgICBjb25zdCB0cmVlID0ga25vd25QYXJzZShzeW50YXgsIGNzKVxuXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coY3MuaXNFbmQoKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyZWU9JywgdHJlZSlcblxuICAgICAgICBpZiAodHJlZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRyZWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNzLmJhY2tUbyhtZW1lbnRvKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBrbm93blBhcnNlKHN5bnRheDogU3ludGF4LCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCB1bmRlZmluZWQge1xuXG5cbiAgICBjb25zdCBzdDogU3ludGF4VHJlZSA9IHt9XG5cbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgY3MpXG5cblxuICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgbm90IG5lY2Vzc2FyeVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZW1iZXIucm9sZSkge1xuICAgICAgICAgICAgc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gc3RcblxufVxuXG5mdW5jdGlvbiBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlcjogTWVtYmVyLCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCBTeW50YXhUcmVlW10gfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIC8vIGlzTmVjZXNzYXJ5IGhhcyBhbHJlYWR5IGJlZW4gdGFrZW4gY2FyZSBvZlxuXG4gICAgY29uc3QgbGlzdDogU3ludGF4VHJlZVtdID0gW11cblxuICAgIHdoaWxlICghY3MuaXNFbmQoKSkge1xuXG4gICAgICAgIGNvbnN0IHN0ID0gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyLCBjcylcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdtZW1iZXI9JywgbWVtYmVyLCAgJ2lzRW5kPScsIGNzLmlzRW5kKCksICdzdD0nLCBzdCwgJ2xpc3Q9JywgbGlzdCApXG5cbiAgICAgICAgaWYgKCFzdCAmJiAhbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3QpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnB1c2goc3QpXG4gICAgICAgIC8vIG1lbWJlci5zZXAgPz8/Pz8/XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3Rcbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIGNzOiBDaGFyU3RyZWFtKTogU3ludGF4VHJlZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgIGlmIChtZW1iZXIubGl0ZXJhbHMpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlTGVhZihtZW1iZXIsIGNzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXJzZUNvbXBvc2l0ZShtZW1iZXIsIGNzKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBwYXJzZUxlYWYobGVhZjogT21pdDxMaXRlcmFsTWVtYmVyLCAnbnVtYmVyJz4sIGNzOiBDaGFyU3RyZWFtKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IHRvayA9IGNzLnBlZWtBY2MoKVxuXG4gICAgaWYgKGxlYWYubGl0ZXJhbHMuaW5jbHVkZXModG9rKSkge1xuICAgICAgICBjcy5jbGVhckFjYygpXG4gICAgICAgIGNzLm5leHQoKVxuICAgICAgICByZXR1cm4gdG9rXG4gICAgfVxuXG4gICAgLy8gd2hpbGUgKCFjcy5pc0VuZCgpICYmICFsZWFmLmxpdGVyYWxzLmluY2x1ZGVzKGNzLnBlZWtBY2MoKSkpIHtcbiAgICAvLyAgICAgY3MubmV4dCgpXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdhY2M9JywgY3MucGVla0FjYygpLCAnbGl0ZXJhbHM9JywgbGVhZi5saXRlcmFscylcbiAgICAvLyB9XG5cbiAgICAvLyBpZiAoY3MuaXNFbmQoKSAmJiAhbGVhZi5saXRlcmFscy5pbmNsdWRlcyhjcy5wZWVrQWNjKCkpKSB7XG4gICAgLy8gICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAvLyB9XG5cbiAgICAvLyBjb25zdCByZXN1bHQgPSBjcy5wZWVrQWNjKClcbiAgICAvLyAvLyBjb25zb2xlLmxvZygncmVzdWx0PScsIHJlc3VsdClcbiAgICAvLyBjcy5jbGVhckFjYygpXG4gICAgLy8gcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBwYXJzZUNvbXBvc2l0ZShjb21wb3NpdGU6IE9taXQ8VHlwZU1lbWJlciwgJ251bWJlcic+LCBjczogQ2hhclN0cmVhbSk6IFN5bnRheFRyZWUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0cnlQYXJzZShjb21wb3NpdGUudHlwZXMsIGNzKVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW1cIjtcbmltcG9ydCB7IHRyeVBhcnNlIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cbi8vIGNvbnNvbGUubG9nKGNzdE1vZGVsVG9Bc3RNb2RlbChOT1VOX1BIUkFTRSkpXG5cbi8vIGNvbnN0IHggPSB0cnlQYXJzZShbJ2lkZW50aWZpZXInXSwgY3MpXG5cbmNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbmNvbnN0IHggPSB0cnlQYXJzZShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuLy8gY29uc29sZS5sb2coY3MsIGNzLmlzRW5kKCkpXG5jb25zdCB5ID0gdHJ5UGFyc2UoWydzcGFjZSddLCBjcylcbmNvbnN0IHogPSB0cnlQYXJzZShbJ2lkZW50aWZpZXInXSwgY3MpXG5jb25zb2xlLmxvZyh4LCB5LCB6KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9