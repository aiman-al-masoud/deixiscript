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
'math-expression', 'noun-phrase', 'limit-phrase', 'math-expression', 'complex-sentence', 'simple-sentence', 'genitive', 'dative', 'instrumental', 'verb', 'copula', 'do-verb', 'complement', 'complex-sentence-one', 'complex-sentence-two');
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
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], notEndWith: 's' }
    ],
    'number-literal': [
        { number: '+', role: 'digits', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'string-literal': [
        { literals: ['"'] },
        { anyCharExceptFor: ['"'], literals: [], role: 'chars', number: '*' },
        { literals: ['"'] },
    ],
    'noun-phrase': [
        { literals: ['every', 'any'], role: 'pluralizer', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { literals: ['the', 'old'], role: 'anaphoraOperator', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { literals: ['a', 'an', 'new'], role: 'newOperator', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['limit-phrase'], expand: true, number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'modifiers', sep: 'space', number: 'all-but-last' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier', 'string-literal', 'number-literal'], role: 'head', number: 1 },
        { literals: ['s'], role: 'pluralizer', number: '1|0' },
        { types: ['space'], number: '1|0' },
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
        { literals: ['+', '-', '*', '/'], role: 'operator', number: 1 },
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
        { types: ['dative', 'instrumental'], expand: true, number: 1 }
    ],
    'simple-sentence': [
        { types: ['noun-phrase'], role: 'subject', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['verb'], expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['complement'], number: '*', expand: true },
    ],
    verb: [
        { types: ['copula', 'do-verb'], expand: true }
    ],
    'do-verb': [
        { literals: ['does', 'do'] },
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

/***/ "./app/src/new-frontend/max-precedence.ts":
/*!************************************************!*\
  !*** ./app/src/new-frontend/max-precedence.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dependencies = exports.maxPrecedence = void 0;
const maxPrecedence = (a, b, syntaxes) => {
    var _a, _b;
    return (_b = (_a = idCompare(a, b)) !== null && _a !== void 0 ? _a : dependencyCompare(a, b, syntaxes)) !== null && _b !== void 0 ? _b : lenCompare(a, b, syntaxes);
};
exports.maxPrecedence = maxPrecedence;
const idCompare = (a, b) => {
    return a == b ? 0 : undefined;
};
const dependencyCompare = (a, b, syntaxes) => {
    const aDependsOnB = dependencies(a, syntaxes).includes(b);
    const bDependsOnA = dependencies(b, syntaxes).includes(a);
    if (aDependsOnB === bDependsOnA) {
        return undefined;
    }
    return aDependsOnB ? 1 : -1;
};
function dependencies(a, syntaxes, visited = []) {
    var _a;
    const members = (_a = syntaxes[a]) !== null && _a !== void 0 ? _a : [];
    return members.flatMap(m => { var _a; return (_a = m.types) !== null && _a !== void 0 ? _a : []; }).flatMap(t => {
        if (visited.includes(t)) {
            return [];
        }
        else {
            return [...visited, ...dependencies(t, syntaxes, [...visited, t])];
        }
    });
}
exports.dependencies = dependencies;
const lenCompare = (a, b, syntaxes) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length;
};


/***/ }),

/***/ "./app/src/new-frontend/parser.ts":
/*!****************************************!*\
  !*** ./app/src/new-frontend/parser.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const first_1 = __webpack_require__(/*! ../utils/first */ "./app/src/utils/first.ts");
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
const char_stream_1 = __webpack_require__(/*! ./char-stream */ "./app/src/new-frontend/char-stream.ts");
const csts_1 = __webpack_require__(/*! ./csts */ "./app/src/new-frontend/csts.ts");
const max_precedence_1 = __webpack_require__(/*! ./max-precedence */ "./app/src/new-frontend/max-precedence.ts");
function getParser(sourceCode, syntaxes) {
    return new KoolerParser(sourceCode, syntaxes);
}
exports.getParser = getParser;
class KoolerParser {
    constructor(sourceCode, syntaxes, cs = (0, char_stream_1.getCharStream)(sourceCode)) {
        this.sourceCode = sourceCode;
        this.syntaxes = syntaxes;
        this.cs = cs;
        this.syntaxList = Object.keys(this.syntaxes);
        this.keywords = (0, uniq_1.uniq)(Object.values(this.syntaxes).flatMap(x => x.flatMap(x => { var _a; return (_a = x.literals) !== null && _a !== void 0 ? _a : []; })));
        this.syntaxList.sort((a, b) => (0, max_precedence_1.maxPrecedence)(b, a, syntaxes));
    }
    parse() {
        return this.parseTry(this.syntaxList);
    }
    parseTry(syntaxList, top = 0) {
        for (const syntaxName of syntaxList) {
            console.log(top, 'try parsing syntaxName=', syntaxName);
            const memento = this.cs.getPos();
            const syntax = this.syntaxes[syntaxName];
            const ast = this.parseSyntax(syntax, syntaxName, top);
            if (ast && ast instanceof Object) {
                return Object.assign(Object.assign({}, ast), { type: syntaxName });
            }
            if (ast) {
                return ast;
            }
            this.cs.backTo(memento);
        }
    }
    parseSyntax(syntax, syntaxName, top = 0) {
        var _a, _b, _c, _d;
        const ast = {};
        for (const member of syntax) {
            const node = this.parseMemberMaybeRepeated(member, top);
            if (!node && (0, csts_1.isNecessary)(member.number)) {
                console.log(top, 'syntaxName=', syntaxName, 'failed because required', (_b = (_a = member.role) !== null && _a !== void 0 ? _a : member.literals) !== null && _b !== void 0 ? _b : member.types, 'is missing');
                return undefined;
            }
            if (!node) { // and isNecessary=false
                console.log(top, 'syntaxName=', syntaxName, 'unrequired', (_d = (_c = member.role) !== null && _c !== void 0 ? _c : member.literals) !== null && _d !== void 0 ? _d : member.types, 'not found, ignored', 'pos=', this.cs.getPos());
                continue;
            }
            if (member.role && member.expand) {
                throw new Error('expanding member with role currently not supported!');
            }
            if (member.reduce) {
                return node;
            }
            if (member.role) {
                ast[member.role] = node;
            }
            if (member.expand && !(node instanceof Array)) { // dictionary ast case
                const entries = Object.entries(node);
                entries.forEach(e => csts_1.roles.includes(e[0]) && (ast[e[0]] = e[1]));
            }
            if (member.expand && (node instanceof Array)) {
                console.log('EXPAND ARRAY!', node, 'on', ast);
            }
        }
        return ast;
    }
    parseMemberMaybeRepeated(member, top = 0) {
        // isNecessary has already been taken care of
        if ((0, csts_1.isRepeatable)(member.number)) {
            return this.parseMemberRepeated(member, top);
        }
        else {
            return this.parseMemberSingle(member, top);
        }
    }
    parseMemberRepeated(member, top = 0) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const list = [];
        let memento = this.cs.getPos();
        while (!this.cs.isEnd()) {
            const mementoBuf = this.cs.getPos();
            const node = this.parseMemberSingle(member, top);
            if (!node) {
                break;
            }
            if (node) {
                memento = mementoBuf;
            }
            list.push(node);
            if (member.sep) {
                console.log(top, 'parseMemberRepeated before skipping a separator=', 'pos=', this.cs.getPos());
                this.parseMemberSingle({ types: [member.sep] }, top);
                console.log(top, 'parseMemberRepeated skipped a separator=', (_b = (_a = member.role) !== null && _a !== void 0 ? _a : member.literals) !== null && _b !== void 0 ? _b : member.types, 'pos=', this.cs.getPos());
            }
        }
        if (member.number === 'all-but-last') {
            console.log(top, 'have to backtrack, old list len=', list.length, 'pos=', this.cs.getPos());
            list.pop();
            this.cs.backTo(memento);
            console.log(top, 'backtrack, parseMemberRepeated pop from list of=', (_d = (_c = member.role) !== null && _c !== void 0 ? _c : member.literals) !== null && _d !== void 0 ? _d : member.types, 'new list len=', list.length, 'pos=', this.cs.getPos());
        }
        if (!list.length) {
            console.log(top, 'parseMemberRepeated empty list for=', (_f = (_e = member.role) !== null && _e !== void 0 ? _e : member.literals) !== null && _f !== void 0 ? _f : member.types, 'pos=', this.cs.getPos());
            return undefined;
        }
        if (member.reduce) {
            console.log(top, 'parseMemberRepeated found ok list for=', (_h = (_g = member.role) !== null && _g !== void 0 ? _g : member.literals) !== null && _h !== void 0 ? _h : member.types, 'list=', list.toString(), 'pos=', this.cs.getPos());
            return list.map(x => x.toString()).reduce((a, b) => a + b);
        }
        return list;
    }
    parseMemberSingle(member, top = 0) {
        // doesn't have to take care about number
        var _a, _b;
        if (member.literals) {
            return this.parseLiteral(member, top);
        }
        else {
            const result = this.parseTry(member.types, top + 1);
            if (this.keywords.includes(result)) {
                console.log(top, 'returning undefined because a keyword is being trated as identifier! for=', (_b = (_a = member.role) !== null && _a !== void 0 ? _a : member.literals) !== null && _b !== void 0 ? _b : member.types, 'pos=', this.cs.getPos());
                return undefined;
            }
            return result;
        }
    }
    parseLiteral(member, top = 0) {
        const char = this.cs.peek();
        if (member.anyCharExceptFor && !member.anyCharExceptFor.includes(char)) {
            this.cs.next();
            return char;
        }
        const result = (0, first_1.first)(member.literals, x => this.parseLiteralSingle(x, member.notEndWith));
        return result;
    }
    parseLiteralSingle(literal, notEndWith) {
        const memento = this.cs.getPos();
        for (const x of literal) {
            if (x !== this.cs.peek()) {
                this.cs.backTo(memento);
                return undefined;
            }
            this.cs.next();
        }
        if (notEndWith && literal.endsWith(notEndWith)) {
            this.cs.backTo(memento);
            return undefined;
        }
        return literal;
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


/***/ }),

/***/ "./app/src/utils/uniq.ts":
/*!*******************************!*\
  !*** ./app/src/utils/uniq.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniq = void 0;
/**
 * Remove duplicates from an array. Equality by JSON.stringify.
 */
function uniq(seq) {
    const seen = {};
    return seq.filter(e => {
        const k = JSON.stringify(e);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}
exports.uniq = uniq;


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
const csts_1 = __webpack_require__(/*! ./src/new-frontend/csts */ "./app/src/new-frontend/csts.ts");
const parser_1 = __webpack_require__(/*! ./src/new-frontend/parser */ "./app/src/new-frontend/parser.ts");
// import { parseSyntax, parseTry } from "./src/new-frontend/parser";
// main()
// // EXAMPLE 0 
// const cs0 = getCharStream('12    mondo ')
// const x0 = parseTry(['number-literal'], cs0)
// const y0 = parseTry(['space'], cs0)
// const z0 = parseTry(['identifier'], cs0)
// console.log(0, x0, y0, z0)
// // EXAMPLE 1
// const cs = getCharStream('12    mondo ')
// const x = parseTry(['number-literal'], cs)
// console.log(1, x)
// // EXAMPLE 2
// const cs2 = getCharStream('do  make ')
// const x2 = parseTry(['do-verb'], cs2)
// console.log(2, x2)
// // EXAMPLE 3
// const cs3 = getCharStream('" ciao "xxx')
// const x3 = parseTry(['string-literal'], cs3)
// console.log(3, x3)
// // EXAMPLE 4
// const cs4 = getCharStream('ciao mondo buruf')
// const x4 = parseSyntax([{ types: ['identifier'], sep: 'space', number: 'all-but-last', role: 'anything' as any }], cs4)
// const x40 = parseTry(['identifier'], cs4)
// console.log(4, x4, x40)
// // EXAMPLE 5
// const cs5 = getCharStream('does not make ') // does not make // is not
// const x5 = parseTry(['verb'], cs5)
// console.log(5, x5)
// const parser = getParser('121', syntaxes)
// console.log(parser.parse())
// const syntaxList = Object.keys(syntaxes) as AstType[]
// syntaxList.sort((a, b) => maxPrecedence(b, a, syntaxes))
// console.log(syntaxList)
// ---------------------------
// const x = getParser('bad blue bird', syntaxes).parse()
// console.log(x)
// const x1 = getParser('every bad blue bird', syntaxes).parse()
// console.log(x1)
// const x2 = getParser('bad blue birds', syntaxes).parse() //PROBLEM!
// console.log(x2)
// const x3 = getParser('bad blue bird of the x ', syntaxes).parse() //PROBLEM!
// console.log(x3)
// const x1 = getParser('x of y', syntaxes).parseTry(['noun-phrase'])
// console.log(x1)
// console.log(x1)
// const x1 = getParser('bad buruf of house of me', syntaxes).parse()
// const x2 = getParser('bad person', syntaxes).parse()
// const x3 = getParser('every x is capra by y', syntaxes).parseTry(['simple-sentence'])
// console.log(x1)
// console.log(x2)
// console.log(x3)
// problem with multiple modifiers!
const x4 = (0, parser_1.getParser)('the bad capras of rivanazzano of lombardia are buruf', csts_1.syntaxes).parse();
console.log(x4);
// const x4 = getParser('xa + xb', syntaxes).parse()//.parseTry(['noun-phrase'])
// console.log(x4)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MkQ7QUFDM0QsMEJBQTBCO0FBRTFCLDhCQUE4QjtBQUM5Qix5REFBeUQ7QUFDekQsaUJBQWlCO0FBRWpCLGdFQUFnRTtBQUNoRSxrQkFBa0I7QUFFbEIsc0VBQXNFO0FBQ3RFLGtCQUFrQjtBQUVsQiwrRUFBK0U7QUFDL0Usa0JBQWtCO0FBRWxCLHFFQUFxRTtBQUNyRSxrQkFBa0I7QUFFbEIsa0JBQWtCO0FBR2xCLHFFQUFxRTtBQUNyRSx1REFBdUQ7QUFDdkQsd0ZBQXdGO0FBRXhGLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBR2xCLG1DQUFtQztBQUNuQyxNQUFNLEVBQUUsR0FBRyxzQkFBUyxFQUFDLHNEQUFzRCxFQUFFLGVBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUdmLGdGQUFnRjtBQUNoRixrQkFBa0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ZpcnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGhlIG5leHQgY2hhcmFjdGVyIGlmIGFueS5cbiAgICAgKi9cbiAgICBuZXh0KCk6IHZvaWRcbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBwZWVrKCk6IHN0cmluZ1xuICAgIC8qKlxuICAgICAqIEdvIGJhY2suXG4gICAgICovXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRQb3MoKTogbnVtYmVyXG4gICAgLyoqXG4gICAgICogUmVhY2hlZCBlbmQgb2YgY2hhcnN0cmVhbS5cbiAgICAgKi9cbiAgICBpc0VuZCgpOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgQmFzZUNoYXJTdHJlYW0oc291cmNlQ29kZSlcbn1cblxuY2xhc3MgQmFzZUNoYXJTdHJlYW0gaW1wbGVtZW50cyBDaGFyU3RyZWFtIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwb3MgPSAwLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmQoKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvcysrXG4gICAgfVxuXG4gICAgcGVlaygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VDb2RlW3RoaXMucG9zXVxuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldFBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NcbiAgICB9XG5cbiAgICBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMuc291cmNlQ29kZS5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIFN5bnRheCA9IE1lbWJlcltdIC8vIENzdE1vZGVsXG5cblxuZXhwb3J0IGNvbnN0IHJvbGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ2lkJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnY2hhcnMnLFxuICAgICdwbHVyYWxpemVyJyxcbiAgICAnYW5hcGhvcmFPcGVyYXRvcicsXG4gICAgJ25ld09wZXJhdG9yJyxcbiAgICAnbW9kaWZpZXJzJyxcbiAgICAnaGVhZCcsXG4gICAgJ2xpbWl0S2V5d29yZCcsXG4gICAgJ2xpbWl0TnVtYmVyJyxcbiAgICAnbGVmdE9wZXJhbmQnLFxuICAgICdyaWdodE9wZXJhbmQnLFxuICAgICdvcGVyYXRvcicsXG4gICAgJ293bmVyJyxcbiAgICAnb2JqZWN0JyxcbiAgICAncmVjZWl2ZXInLFxuICAgICdpbnN0cnVtZW50JyxcbiAgICAnc3ViamVjdCcsXG4gICAgJ3ZlcmInLFxuICAgICduZWdhdGlvbicsXG4gICAgJ2NvbmRpdGlvbicsXG4gICAgJ2NvbnNlcXVlbmNlJyxcbiAgICAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicsIC8vIEJBRFxuKVxuXG5leHBvcnQgdHlwZSBSb2xlID0gRWxlbWVudFR5cGU8dHlwZW9mIHJvbGVzPlxuXG5cbnR5cGUgQmFzZU1lbWJlciA9IHtcbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eSAvLyBubyBudW1iZXIgLS0tPiAxXG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGUgLy8gbm8gcm9sZSAtLT4gZXhjbHVkZSBmcm9tIGFzdFxuICAgIHJlYWRvbmx5IHNlcD86IEFzdFR5cGVcbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgcmVkdWNlPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IG5vdEVuZFdpdGg/OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgTGl0ZXJhbE1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgdHlwZXM/OiB1bmRlZmluZWRcbiAgICByZWFkb25seSBhbnlDaGFyRXhjZXB0Rm9yPzogc3RyaW5nW11cbiAgICByZWFkb25seSBleHBhbmQ/OiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgVHlwZU1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgdHlwZXM6IEFzdFR5cGVbXVxuICAgIHJlYWRvbmx5IGxpdGVyYWxzPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IExpdGVyYWxNZW1iZXIgfCBUeXBlTWVtYmVyXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgYXN0VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBhc3RUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdzcGFjZScsXG4gICAgJ2lkZW50aWZpZXInLFxuICAgICdzdHJpbmctbGl0ZXJhbCcsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnZXhwcmVzc2lvbicsIC8vIGFuZC1leHByZXNzaW9uXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnbGltaXQtcGhyYXNlJyxcbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG4gICAgJ3NpbXBsZS1zZW50ZW5jZScsXG4gICAgJ2dlbml0aXZlJyxcbiAgICAnZGF0aXZlJyxcbiAgICAnaW5zdHJ1bWVudGFsJyxcbiAgICAndmVyYicsXG4gICAgJ2NvcHVsYScsXG4gICAgJ2RvLXZlcmInLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLXR3bycsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4gICAgfHwgYyA9PT0gJ2FsbC1idXQtbGFzdCdcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgcmVkdWNlOiB0cnVlLCBsaXRlcmFsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JywgJ3cnLCAneCcsICd5JywgJ3onXSwgbm90RW5kV2l0aDogJ3MnIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIHJlZHVjZTogdHJ1ZSwgbGl0ZXJhbHM6IFsnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddIH1cbiAgICBdLFxuICAgICdzdHJpbmctbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgICAgIHsgYW55Q2hhckV4Y2VwdEZvcjogWydcIiddLCBsaXRlcmFsczogW10sIHJvbGU6ICdjaGFycycsIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgIF0sXG4gICAgJ25vdW4tcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2V2ZXJ5JywgJ2FueSddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlJywgJ29sZCddLCByb2xlOiAnYW5hcGhvcmFPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYScsICdhbicsICduZXcnXSwgcm9sZTogJ25ld09wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydsaW1pdC1waHJhc2UnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ21vZGlmaWVycycsIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJywgJ3N0cmluZy1saXRlcmFsJywgJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdoZWFkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsncyddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZ2VuaXRpdmUnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2ZpcnN0JywgJ2xhc3QnXSwgcm9sZTogJ2xpbWl0S2V5d29yZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnbGltaXROdW1iZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICBcImV4cHJlc3Npb25cIjogW1xuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2FuZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAnZ2VuaXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnb2YnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb3duZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdpbnN0cnVtZW50YWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYnknXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnaW5zdHJ1bWVudCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZGF0aXZlJywgJ2luc3RydW1lbnRhbCddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogMSB9XG4gICAgXSxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWyd2ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb2JqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG4gICAgJ2RvLXZlcmInOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZG9lcycsICdkbyddIH0sIC8vIG9yZGVyIG1hdHRlcnMhIHN1cGVyc3RyaW5nIGZpcnN0IVxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydub3QnXSwgcm9sZTogJ25lZ2F0aW9uJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICd2ZXJiJyB9XG4gICAgXSxcbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZXgtc2VudGVuY2Utb25lJywgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWyd0aGVuJywgJywnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF1cbn0iLCJpbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi9jc3RzXCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGVzID8/IFtdKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQXN0VHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgZmlyc3QgfSBmcm9tIFwiLi4vdXRpbHMvZmlyc3RcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgQXN0VHlwZSwgcm9sZXMgfSBmcm9tIFwiLi9jc3RzXCI7XG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4vbWF4LXByZWNlZGVuY2VcIjtcblxuXG50eXBlIEFzdE5vZGUgPVxuICAgIHN0cmluZ1xuICAgIHwgc3RyaW5nW11cbiAgICB8IEFzdE5vZGVbXVxuICAgIHwgeyBbeCBpbiBSb2xlXT86IEFzdE5vZGUgfSAmIHsgdHlwZT86IEFzdFR5cGUgfVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZShzb3VyY2VDb2RlOiBzdHJpbmcpOiBBc3ROb2RlIHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pIHtcbiAgICByZXR1cm4gbmV3IEtvb2xlclBhcnNlcihzb3VyY2VDb2RlLCBzeW50YXhlcylcbn1cblxuY2xhc3MgS29vbGVyUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHJlYWRvbmx5IHN5bnRheExpc3QgPSBPYmplY3Qua2V5cyh0aGlzLnN5bnRheGVzKSBhcyBBc3RUeXBlW11cbiAgICByZWFkb25seSBrZXl3b3JkcyA9IHVuaXEoT2JqZWN0LnZhbHVlcyh0aGlzLnN5bnRheGVzKS5mbGF0TWFwKHggPT4geC5mbGF0TWFwKHggPT4geC5saXRlcmFscyA/PyBbXSkpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LFxuICAgICAgICByZWFkb25seSBjcyA9IGdldENoYXJTdHJlYW0oc291cmNlQ29kZSksXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdC5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHN5bnRheGVzKSlcbiAgICB9XG5cbiAgICBwYXJzZSgpOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VUcnkodGhpcy5zeW50YXhMaXN0KVxuICAgIH1cblxuICAgIHBhcnNlVHJ5KHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgdG9wID0gMCkge1xuXG4gICAgICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3RyeSBwYXJzaW5nIHN5bnRheE5hbWU9Jywgc3ludGF4TmFtZSlcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuc3ludGF4ZXNbc3ludGF4TmFtZV1cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2VTeW50YXgoc3ludGF4LCBzeW50YXhOYW1lLCB0b3ApXG5cbiAgICAgICAgICAgIGlmIChhc3QgJiYgYXN0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCB0eXBlOiBzeW50YXhOYW1lIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcGFyc2VTeW50YXgoc3ludGF4OiBTeW50YXgsIHN5bnRheE5hbWU6IEFzdFR5cGUsIHRvcCA9IDApOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBhc3Q6IEFzdE5vZGUgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHN5bnRheCkge1xuXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5wYXJzZU1lbWJlck1heWJlUmVwZWF0ZWQobWVtYmVyLCB0b3ApXG5cbiAgICAgICAgICAgIGlmICghbm9kZSAmJiBpc05lY2Vzc2FyeShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3N5bnRheE5hbWU9Jywgc3ludGF4TmFtZSwgJ2ZhaWxlZCBiZWNhdXNlIHJlcXVpcmVkJywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ2lzIG1pc3NpbmcnKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGFuZCBpc05lY2Vzc2FyeT1mYWxzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3N5bnRheE5hbWU9Jywgc3ludGF4TmFtZSwgJ3VucmVxdWlyZWQnLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAnbm90IGZvdW5kLCBpZ25vcmVkJywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIucm9sZSAmJiBtZW1iZXIuZXhwYW5kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBhbmRpbmcgbWVtYmVyIHdpdGggcm9sZSBjdXJyZW50bHkgbm90IHN1cHBvcnRlZCEnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJlZHVjZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIucm9sZSkge1xuICAgICAgICAgICAgICAgIGFzdFttZW1iZXIucm9sZV0gPSBub2RlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuZXhwYW5kICYmICEobm9kZSBpbnN0YW5jZW9mIEFycmF5KSkgeyAvLyBkaWN0aW9uYXJ5IGFzdCBjYXNlXG4gICAgICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG5vZGUpXG4gICAgICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGUgPT4gcm9sZXMuaW5jbHVkZXMoZVswXSBhcyBSb2xlKSAmJiAoYXN0W2VbMF0gYXMgUm9sZV0gPSBlWzFdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lbWJlci5leHBhbmQgJiYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVhQQU5EIEFSUkFZIScsIG5vZGUsICdvbicsIGFzdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzdFxuICAgIH1cblxuICAgIHBhcnNlTWVtYmVyTWF5YmVSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgdG9wID0gMCkge1xuICAgICAgICAvLyBpc05lY2Vzc2FyeSBoYXMgYWxyZWFkeSBiZWVuIHRha2VuIGNhcmUgb2ZcblxuICAgICAgICBpZiAoaXNSZXBlYXRhYmxlKG1lbWJlci5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgdG9wKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyLCB0b3ApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlcjogTWVtYmVyLCB0b3AgPSAwKTogQXN0Tm9kZVtdIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuICAgICAgICBsZXQgbWVtZW50byA9IHRoaXMuY3MuZ2V0UG9zKClcblxuICAgICAgICB3aGlsZSAoIXRoaXMuY3MuaXNFbmQoKSkge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvQnVmID0gdGhpcy5jcy5nZXRQb3MoKVxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyLCB0b3ApXG5cbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgbWVtZW50byA9IG1lbWVudG9CdWZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKG5vZGUpXG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuc2VwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBiZWZvcmUgc2tpcHBpbmcgYSBzZXBhcmF0b3I9JywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VNZW1iZXJTaW5nbGUoeyB0eXBlczogW21lbWJlci5zZXBdIH0sIHRvcClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIHNraXBwZWQgYSBzZXBhcmF0b3I9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLm51bWJlciA9PT0gJ2FsbC1idXQtbGFzdCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ2hhdmUgdG8gYmFja3RyYWNrLCBvbGQgbGlzdCBsZW49JywgbGlzdC5sZW5ndGgsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIGxpc3QucG9wKClcbiAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdiYWNrdHJhY2ssIHBhcnNlTWVtYmVyUmVwZWF0ZWQgcG9wIGZyb20gbGlzdCBvZj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAnbmV3IGxpc3QgbGVuPScsIGxpc3QubGVuZ3RoLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIGVtcHR5IGxpc3QgZm9yPScsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZW1iZXIucmVkdWNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIGZvdW5kIG9rIGxpc3QgZm9yPScsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdsaXN0PScsIGxpc3QudG9TdHJpbmcoKSwgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgcmV0dXJuIGxpc3QubWFwKHggPT4geC50b1N0cmluZygpKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpc3RcbiAgICB9XG5cbiAgICBwYXJzZU1lbWJlclNpbmdsZShtZW1iZXI6IE1lbWJlciwgdG9wID0gMCk6IEFzdE5vZGUgfCBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyBkb2Vzbid0IGhhdmUgdG8gdGFrZSBjYXJlIGFib3V0IG51bWJlclxuXG4gICAgICAgIGlmIChtZW1iZXIubGl0ZXJhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbChtZW1iZXIsIHRvcClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucGFyc2VUcnkobWVtYmVyLnR5cGVzLCB0b3AgKyAxKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5rZXl3b3Jkcy5pbmNsdWRlcyhyZXN1bHQgYXMgc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3JldHVybmluZyB1bmRlZmluZWQgYmVjYXVzZSBhIGtleXdvcmQgaXMgYmVpbmcgdHJhdGVkIGFzIGlkZW50aWZpZXIhIGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbChtZW1iZXI6IExpdGVyYWxNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuY3MucGVlaygpXG5cbiAgICAgICAgaWYgKG1lbWJlci5hbnlDaGFyRXhjZXB0Rm9yICYmICFtZW1iZXIuYW55Q2hhckV4Y2VwdEZvci5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICAgICAgdGhpcy5jcy5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiBjaGFyXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBmaXJzdChtZW1iZXIubGl0ZXJhbHMsIHggPT4gdGhpcy5wYXJzZUxpdGVyYWxTaW5nbGUoeCwgbWVtYmVyLm5vdEVuZFdpdGgpKVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgcGFyc2VMaXRlcmFsU2luZ2xlKGxpdGVyYWw6IHN0cmluZywgbm90RW5kV2l0aD86IHN0cmluZykge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG5cbiAgICAgICAgZm9yIChjb25zdCB4IG9mIGxpdGVyYWwpIHtcblxuICAgICAgICAgICAgaWYgKHggIT09IHRoaXMuY3MucGVlaygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3MubmV4dCgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm90RW5kV2l0aCAmJiBsaXRlcmFsLmVuZHNXaXRoKG5vdEVuZFdpdGgpKSB7XG4gICAgICAgICAgICB0aGlzLmNzLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpdGVyYWxcbiAgICB9XG5cbn1cblxuIiwiLyoqXG4gKiBcbiAqIEFwcGx5IHByZWRpY2F0ZSB0byBlYWNoIGVsZW1lbnQgZSBpbiB0aGUgaXRlcmFibGUsIHN0b3Agd2hlbiBcbiAqIHlvdSBmaW5kIGEgbm9uLW51bGxpc2ggaW1hZ2Ugb2YgZSwgYW5kIHJldHVybiB0aGUgaW1hZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdDxULCBVPihpdGVyYWJsZTogVFtdLCBwcmVkaWNhdGU6ICh4OiBUKSA9PiBVKTogVSB8IHVuZGVmaW5lZCB7XG5cbiAgICBmb3IgKGNvbnN0IGUgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3QgbWF5YmVSZXN1bHQgPSBwcmVkaWNhdGUoZSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKG1heWJlUmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgbWF5YmVSZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXliZVJlc3VsdFxuICAgICAgICB9XG4gICAgfVxuXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgY29uc3Qgc2VlbjogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBzeW50YXhlcyB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvY3N0c1wiO1xuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvbWF4LXByZWNlZGVuY2VcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyXCI7XG4vLyBpbXBvcnQgeyBwYXJzZVN5bnRheCwgcGFyc2VUcnkgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuXG4vLyBtYWluKClcblxuXG5cbi8vIC8vIEVYQU1QTEUgMCBcbi8vIGNvbnN0IGNzMCA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4MCA9IHBhcnNlVHJ5KFsnbnVtYmVyLWxpdGVyYWwnXSwgY3MwKVxuLy8gY29uc3QgeTAgPSBwYXJzZVRyeShbJ3NwYWNlJ10sIGNzMClcbi8vIGNvbnN0IHowID0gcGFyc2VUcnkoWydpZGVudGlmaWVyJ10sIGNzMClcbi8vIGNvbnNvbGUubG9nKDAsIHgwLCB5MCwgejApXG4vLyAvLyBFWEFNUExFIDFcbi8vIGNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbi8vIGNvbnN0IHggPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuLy8gY29uc29sZS5sb2coMSwgeClcbi8vIC8vIEVYQU1QTEUgMlxuLy8gY29uc3QgY3MyID0gZ2V0Q2hhclN0cmVhbSgnZG8gIG1ha2UgJylcbi8vIGNvbnN0IHgyID0gcGFyc2VUcnkoWydkby12ZXJiJ10sIGNzMilcbi8vIGNvbnNvbGUubG9nKDIsIHgyKVxuLy8gLy8gRVhBTVBMRSAzXG4vLyBjb25zdCBjczMgPSBnZXRDaGFyU3RyZWFtKCdcIiBjaWFvIFwieHh4Jylcbi8vIGNvbnN0IHgzID0gcGFyc2VUcnkoWydzdHJpbmctbGl0ZXJhbCddLCBjczMpXG4vLyBjb25zb2xlLmxvZygzLCB4Mylcbi8vIC8vIEVYQU1QTEUgNFxuLy8gY29uc3QgY3M0ID0gZ2V0Q2hhclN0cmVhbSgnY2lhbyBtb25kbyBidXJ1ZicpXG4vLyBjb25zdCB4NCA9IHBhcnNlU3ludGF4KFt7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgc2VwOiAnc3BhY2UnLCBudW1iZXI6ICdhbGwtYnV0LWxhc3QnLCByb2xlOiAnYW55dGhpbmcnIGFzIGFueSB9XSwgY3M0KVxuLy8gY29uc3QgeDQwID0gcGFyc2VUcnkoWydpZGVudGlmaWVyJ10sIGNzNClcbi8vIGNvbnNvbGUubG9nKDQsIHg0LCB4NDApXG4vLyAvLyBFWEFNUExFIDVcbi8vIGNvbnN0IGNzNSA9IGdldENoYXJTdHJlYW0oJ2RvZXMgbm90IG1ha2UgJykgLy8gZG9lcyBub3QgbWFrZSAvLyBpcyBub3Rcbi8vIGNvbnN0IHg1ID0gcGFyc2VUcnkoWyd2ZXJiJ10sIGNzNSlcbi8vIGNvbnNvbGUubG9nKDUsIHg1KVxuXG5cbi8vIGNvbnN0IHBhcnNlciA9IGdldFBhcnNlcignMTIxJywgc3ludGF4ZXMpXG4vLyBjb25zb2xlLmxvZyhwYXJzZXIucGFyc2UoKSlcblxuLy8gY29uc3Qgc3ludGF4TGlzdCA9IE9iamVjdC5rZXlzKHN5bnRheGVzKSBhcyBBc3RUeXBlW11cbi8vIHN5bnRheExpc3Quc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCBzeW50YXhlcykpXG4vLyBjb25zb2xlLmxvZyhzeW50YXhMaXN0KVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0IHggPSBnZXRQYXJzZXIoJ2JhZCBibHVlIGJpcmQnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc29sZS5sb2coeClcblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ2V2ZXJ5IGJhZCBibHVlIGJpcmQnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc29sZS5sb2coeDEpXG5cbi8vIGNvbnN0IHgyID0gZ2V0UGFyc2VyKCdiYWQgYmx1ZSBiaXJkcycsIHN5bnRheGVzKS5wYXJzZSgpIC8vUFJPQkxFTSFcbi8vIGNvbnNvbGUubG9nKHgyKVxuXG4vLyBjb25zdCB4MyA9IGdldFBhcnNlcignYmFkIGJsdWUgYmlyZCBvZiB0aGUgeCAnLCBzeW50YXhlcykucGFyc2UoKSAvL1BST0JMRU0hXG4vLyBjb25zb2xlLmxvZyh4MylcblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ3ggb2YgeScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ25vdW4tcGhyYXNlJ10pXG4vLyBjb25zb2xlLmxvZyh4MSlcblxuLy8gY29uc29sZS5sb2coeDEpXG5cblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ2JhZCBidXJ1ZiBvZiBob3VzZSBvZiBtZScsIHN5bnRheGVzKS5wYXJzZSgpXG4vLyBjb25zdCB4MiA9IGdldFBhcnNlcignYmFkIHBlcnNvbicsIHN5bnRheGVzKS5wYXJzZSgpXG4vLyBjb25zdCB4MyA9IGdldFBhcnNlcignZXZlcnkgeCBpcyBjYXByYSBieSB5Jywgc3ludGF4ZXMpLnBhcnNlVHJ5KFsnc2ltcGxlLXNlbnRlbmNlJ10pXG5cbi8vIGNvbnNvbGUubG9nKHgxKVxuLy8gY29uc29sZS5sb2coeDIpXG4vLyBjb25zb2xlLmxvZyh4MylcblxuXG4vLyBwcm9ibGVtIHdpdGggbXVsdGlwbGUgbW9kaWZpZXJzIVxuY29uc3QgeDQgPSBnZXRQYXJzZXIoJ3RoZSBiYWQgY2FwcmFzIG9mIHJpdmFuYXp6YW5vIG9mIGxvbWJhcmRpYSBhcmUgYnVydWYnLCBzeW50YXhlcykucGFyc2UoKVxuY29uc29sZS5sb2coeDQpXG5cblxuLy8gY29uc3QgeDQgPSBnZXRQYXJzZXIoJ3hhICsgeGInLCBzeW50YXhlcykucGFyc2UoKS8vLnBhcnNlVHJ5KFsnbm91bi1waHJhc2UnXSlcbi8vIGNvbnNvbGUubG9nKHg0KSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==