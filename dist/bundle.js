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
    // 'genitive-expression' : [
    //     {types : ['noun-phrase'], role : 'id'},//TODOOOOO!
    //     { types: ['space'] },
    //     {literals : ['of'] },
    //     { types: ['space'] },
    //     {types : ['noun-phrase'], role : 'owner'},
    // ],
    'math-expression': [
        // { types: ['genitive-expression'], role: 'leftOperand' },
        { types: ['noun-phrase'], role: 'leftOperand' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/'], role: 'operator', number: 1 },
        { types: ['space'], number: '*' },
        // { types: ['genitive-expression'], role: 'rightOperand', number: '1|0' }
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
            const syntax = this.syntaxes[syntaxName]; // state!
            const tree = this.parseSyntax(syntax, syntaxName, top);
            if (tree) {
                return tree; //{ ...tree, type: syntaxName } as SyntaxTree // remove cast // TODO: add type
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUdyQiw0Q0FBNEM7QUFDNUMsOEJBQThCO0FBRTlCLHdEQUF3RDtBQUN4RCwyREFBMkQ7QUFDM0QsMEJBQTBCO0FBRTFCLDhCQUE4QjtBQUM5Qix5REFBeUQ7QUFDekQsaUJBQWlCO0FBRWpCLGdFQUFnRTtBQUNoRSxrQkFBa0I7QUFFbEIsc0VBQXNFO0FBQ3RFLGtCQUFrQjtBQUVsQiwrRUFBK0U7QUFDL0Usa0JBQWtCO0FBRWxCLHFFQUFxRTtBQUNyRSxrQkFBa0I7QUFFbEIsa0JBQWtCO0FBR2xCLHFFQUFxRTtBQUNyRSx1REFBdUQ7QUFDdkQsd0ZBQXdGO0FBRXhGLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBR2xCLG1DQUFtQztBQUNuQyxNQUFNLEVBQUUsR0FBRyxzQkFBUyxFQUFDLHNEQUFzRCxFQUFFLGVBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL2NzdHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvbWF4LXByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZmlyc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIENoYXJTdHJlYW0ge1xuXG4gICAgLyoqXG4gICAgICogTW92ZSB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaWYgYW55LlxuICAgICAqL1xuICAgIG5leHQoKTogdm9pZFxuICAgIC8qKlxuICAgICAqIFJlYWQgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAqL1xuICAgIHBlZWsoKTogc3RyaW5nXG4gICAgLyoqXG4gICAgICogR28gYmFjay5cbiAgICAgKi9cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgICAqL1xuICAgIGdldFBvcygpOiBudW1iZXJcbiAgICAvKipcbiAgICAgKiBSZWFjaGVkIGVuZCBvZiBjaGFyc3RyZWFtLlxuICAgICAqL1xuICAgIGlzRW5kKCk6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYXJTdHJlYW0oc291cmNlQ29kZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQ2hhclN0cmVhbShzb3VyY2VDb2RlKVxufVxuXG5jbGFzcyBCYXNlQ2hhclN0cmVhbSBpbXBsZW1lbnRzIENoYXJTdHJlYW0ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHBvcyA9IDAsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0VuZCgpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9zKytcbiAgICB9XG5cbiAgICBwZWVrKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUNvZGVbdGhpcy5wb3NdXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0UG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc1xuICAgIH1cblxuICAgIGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy5zb3VyY2VDb2RlLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgU3ludGF4ID0gTWVtYmVyW10gLy8gQ3N0TW9kZWxcblxuXG5leHBvcnQgY29uc3Qgcm9sZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnaWQnLFxuICAgICdkaWdpdHMnLFxuICAgICdjaGFycycsXG4gICAgJ3BsdXJhbGl6ZXInLFxuICAgICdhbmFwaG9yYU9wZXJhdG9yJyxcbiAgICAnbmV3T3BlcmF0b3InLFxuICAgICdtb2RpZmllcnMnLFxuICAgICdoZWFkJyxcbiAgICAnbGltaXRLZXl3b3JkJyxcbiAgICAnbGltaXROdW1iZXInLFxuICAgICdsZWZ0T3BlcmFuZCcsXG4gICAgJ3JpZ2h0T3BlcmFuZCcsXG4gICAgJ29wZXJhdG9yJyxcbiAgICAnb3duZXInLFxuICAgICdvYmplY3QnLFxuICAgICdyZWNlaXZlcicsXG4gICAgJ2luc3RydW1lbnQnLFxuICAgICdzdWJqZWN0JyxcbiAgICAndmVyYicsXG4gICAgJ25lZ2F0aW9uJyxcbiAgICAnY29uZGl0aW9uJyxcbiAgICAnY29uc2VxdWVuY2UnLFxuICAgICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJywgLy8gQkFEXG4pXG5cbmV4cG9ydCB0eXBlIFJvbGUgPSBFbGVtZW50VHlwZTx0eXBlb2Ygcm9sZXM+XG5cblxudHlwZSBCYXNlTWVtYmVyID0ge1xuICAgIHJlYWRvbmx5IG51bWJlcj86IENhcmRpbmFsaXR5IC8vIG5vIG51bWJlciAtLS0+IDFcbiAgICByZWFkb25seSByb2xlPzogUm9sZSAvLyBubyByb2xlIC0tPiBleGNsdWRlIGZyb20gYXN0XG4gICAgcmVhZG9ubHkgc2VwPzogQXN0VHlwZVxuICAgIHJlYWRvbmx5IGV4cGFuZD86IGJvb2xlYW5cbiAgICByZWFkb25seSByZWR1Y2U/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgbm90RW5kV2l0aD86IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBMaXRlcmFsTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSBsaXRlcmFsczogc3RyaW5nW11cbiAgICByZWFkb25seSB0eXBlcz86IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGFueUNoYXJFeGNlcHRGb3I/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IGV4cGFuZD86IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBUeXBlTWVtYmVyID0gQmFzZU1lbWJlciAmIHtcbiAgICByZWFkb25seSB0eXBlczogQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM/OiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgTWVtYmVyID0gTGl0ZXJhbE1lbWJlciB8IFR5cGVNZW1iZXJcblxuZXhwb3J0IHR5cGUgQXN0VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBhc3RUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGFzdFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ3NwYWNlJyxcbiAgICAnaWRlbnRpZmllcicsXG4gICAgJ3N0cmluZy1saXRlcmFsJyxcbiAgICAnbnVtYmVyLWxpdGVyYWwnLFxuICAgICdleHByZXNzaW9uJywgLy8gYW5kLWV4cHJlc3Npb25cbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnbm91bi1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJyxcbiAgICAnZ2VuaXRpdmUnLFxuICAgICdkYXRpdmUnLFxuICAgICdpbnN0cnVtZW50YWwnLFxuICAgICd2ZXJiJyxcbiAgICAnY29wdWxhJyxcbiAgICAnZG8tdmVyYicsXG4gICAgJ2NvbXBsZW1lbnQnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLW9uZScsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJyxcblxuXG4gICAgLy8gJ2dlbml0aXZlLWV4cHJlc3Npb24nLFxuKVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8ICdhbGwtYnV0LWxhc3QnXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuICAgIHx8IGMgPT09ICdhbGwtYnV0LWxhc3QnXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0gPSB7XG5cbiAgICBzcGFjZTogW1xuICAgICAgICB7IG51bWJlcjogJysnLCBsaXRlcmFsczogWycgJywgJ1xcbicsICdcXHQnXSB9XG4gICAgXSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdpZCcsIHJlZHVjZTogdHJ1ZSwgbGl0ZXJhbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJywgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsICd3JywgJ3gnLCAneScsICd6J10sIG5vdEVuZFdpdGg6ICdzJyB9XG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdkaWdpdHMnLCByZWR1Y2U6IHRydWUsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IGFueUNoYXJFeGNlcHRGb3I6IFsnXCInXSwgbGl0ZXJhbHM6IFtdLCByb2xlOiAnY2hhcnMnLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG5cbiAgICAvLyAnZ2VuaXRpdmUtZXhwcmVzc2lvbicgOiBbXG4gICAgLy8gICAgIHt0eXBlcyA6IFsnbm91bi1waHJhc2UnXSwgcm9sZSA6ICdpZCd9LC8vVE9ET09PT08hXG4gICAgLy8gICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgIC8vICAgICB7bGl0ZXJhbHMgOiBbJ29mJ10gfSxcbiAgICAvLyAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgLy8gICAgIHt0eXBlcyA6IFsnbm91bi1waHJhc2UnXSwgcm9sZSA6ICdvd25lcid9LFxuICAgIC8vIF0sXG5cbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICAvLyB7IHR5cGVzOiBbJ2dlbml0aXZlLWV4cHJlc3Npb24nXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgLy8geyB0eXBlczogWydnZW5pdGl2ZS1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG5cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2luc3RydW1lbnRhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydieSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdpbnN0cnVtZW50JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2RhdGl2ZScsICdpbnN0cnVtZW50YWwnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6IDEgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWyd2ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb2JqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuXG4gICAgdmVyYjogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYScsICdkby12ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvZXMnLCAnZG8nXSB9LCAvLyBvcmRlciBtYXR0ZXJzISBzdXBlcnN0cmluZyBmaXJzdCFcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF1cbn0iLCJpbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi9jc3RzXCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGVzID8/IFtdKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQXN0VHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgZmlyc3QgfSBmcm9tIFwiLi4vdXRpbHMvZmlyc3RcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgQXN0VHlwZSwgcm9sZXMgfSBmcm9tIFwiLi9jc3RzXCI7XG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4vbWF4LXByZWNlZGVuY2VcIjtcblxudHlwZSBBc3ROb2RlID1cbiAgICBzdHJpbmdcbiAgICB8IHN0cmluZ1tdXG4gICAgfCBBc3ROb2RlW11cbiAgICB8IHsgW3ggaW4gUm9sZV0/OiBBc3ROb2RlIH1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2Uoc291cmNlQ29kZTogc3RyaW5nKTogQXN0Tm9kZSB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSB7XG4gICAgcmV0dXJuIG5ldyBLb29sZXJQYXJzZXIoc291cmNlQ29kZSwgc3ludGF4ZXMpXG59XG5cbmNsYXNzIEtvb2xlclBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICByZWFkb25seSBzeW50YXhMaXN0ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhlcykgYXMgQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkga2V5d29yZHMgPSB1bmlxKE9iamVjdC52YWx1ZXModGhpcy5zeW50YXhlcykuZmxhdE1hcCh4ID0+IHguZmxhdE1hcCh4ID0+IHgubGl0ZXJhbHMgPz8gW10pKSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSxcbiAgICAgICAgcmVhZG9ubHkgY3MgPSBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGUpLFxuICAgICkge1xuICAgICAgICB0aGlzLnN5bnRheExpc3Quc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCBzeW50YXhlcykpXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVHJ5KHRoaXMuc3ludGF4TGlzdClcbiAgICB9XG5cbiAgICBwYXJzZVRyeShzeW50YXhMaXN0OiBBc3RUeXBlW10sIHRvcCA9IDApIHtcblxuICAgICAgICBmb3IgKGNvbnN0IHN5bnRheE5hbWUgb2Ygc3ludGF4TGlzdCkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICd0cnkgcGFyc2luZyBzeW50YXhOYW1lPScsIHN5bnRheE5hbWUpXG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG4gICAgICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLnN5bnRheGVzW3N5bnRheE5hbWVdIC8vIHN0YXRlIVxuICAgICAgICAgICAgY29uc3QgdHJlZSA9IHRoaXMucGFyc2VTeW50YXgoc3ludGF4LCBzeW50YXhOYW1lLCB0b3ApXG5cbiAgICAgICAgICAgIGlmICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyZWUgLy97IC4uLnRyZWUsIHR5cGU6IHN5bnRheE5hbWUgfSBhcyBTeW50YXhUcmVlIC8vIHJlbW92ZSBjYXN0IC8vIFRPRE86IGFkZCB0eXBlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHBhcnNlU3ludGF4KHN5bnRheDogU3ludGF4LCBzeW50YXhOYW1lOiBBc3RUeXBlLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgYXN0OiBBc3ROb2RlID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGFyc2VNZW1iZXJNYXliZVJlcGVhdGVkKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICdmYWlsZWQgYmVjYXVzZSByZXF1aXJlZCcsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdpcyBtaXNzaW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgaXNOZWNlc3Nhcnk9ZmFsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICd1bnJlcXVpcmVkJywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25vdCBmb3VuZCwgaWdub3JlZCcsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUgJiYgbWVtYmVyLmV4cGFuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwYW5kaW5nIG1lbWJlciB3aXRoIHJvbGUgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lbWJlci5yZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUpIHtcbiAgICAgICAgICAgICAgICBhc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLmV4cGFuZCAmJiAhKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkpIHsgLy8gZGljdGlvbmFyeSBhc3QgY2FzZVxuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhub2RlKVxuICAgICAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChlID0+IHJvbGVzLmluY2x1ZGVzKGVbMF0gYXMgUm9sZSkgJiYgKGFzdFtlWzBdIGFzIFJvbGVdID0gZVsxXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuZXhwYW5kICYmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VYUEFORCBBUlJBWSEnLCBub2RlLCAnb24nLCBhc3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3RcbiAgICB9XG5cbiAgICBwYXJzZU1lbWJlck1heWJlUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApIHtcbiAgICAgICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICAgICAgaWYgKGlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIHRvcClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgdG9wID0gMCk6IEFzdE5vZGVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cbiAgICAgICAgbGV0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmNzLmlzRW5kKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50b0J1ZiA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIG1lbWVudG8gPSBtZW1lbnRvQnVmXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaChub2RlKVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnNlcCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3BhcnNlTWVtYmVyUmVwZWF0ZWQgYmVmb3JlIHNraXBwaW5nIGEgc2VwYXJhdG9yPScsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKHsgdHlwZXM6IFttZW1iZXIuc2VwXSB9LCB0b3ApXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBza2lwcGVkIGEgc2VwYXJhdG9yPScsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbWJlci5udW1iZXIgPT09ICdhbGwtYnV0LWxhc3QnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdoYXZlIHRvIGJhY2t0cmFjaywgb2xkIGxpc3QgbGVuPScsIGxpc3QubGVuZ3RoLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICBsaXN0LnBvcCgpXG4gICAgICAgICAgICB0aGlzLmNzLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAnYmFja3RyYWNrLCBwYXJzZU1lbWJlclJlcGVhdGVkIHBvcCBmcm9tIGxpc3Qgb2Y9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25ldyBsaXN0IGxlbj0nLCBsaXN0Lmxlbmd0aCwgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBlbXB0eSBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLnJlZHVjZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBmb3VuZCBvayBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAnbGlzdD0nLCBsaXN0LnRvU3RyaW5nKCksICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIHJldHVybiBsaXN0Lm1hcCh4ID0+IHgudG9TdHJpbmcoKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgICAgICBpZiAobWVtYmVyLmxpdGVyYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWwobWVtYmVyLCB0b3ApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnBhcnNlVHJ5KG1lbWJlci50eXBlcywgdG9wICsgMSlcblxuICAgICAgICAgICAgaWYgKHRoaXMua2V5d29yZHMuaW5jbHVkZXMocmVzdWx0IGFzIHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdyZXR1cm5pbmcgdW5kZWZpbmVkIGJlY2F1c2UgYSBrZXl3b3JkIGlzIGJlaW5nIHRyYXRlZCBhcyBpZGVudGlmaWVyISBmb3I9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwYXJzZUxpdGVyYWwobWVtYmVyOiBMaXRlcmFsTWVtYmVyLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmNzLnBlZWsoKVxuXG4gICAgICAgIGlmIChtZW1iZXIuYW55Q2hhckV4Y2VwdEZvciAmJiAhbWVtYmVyLmFueUNoYXJFeGNlcHRGb3IuaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3MubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY2hhclxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmlyc3QobWVtYmVyLmxpdGVyYWxzLCB4ID0+IHRoaXMucGFyc2VMaXRlcmFsU2luZ2xlKHgsIG1lbWJlci5ub3RFbmRXaXRoKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbFNpbmdsZShsaXRlcmFsOiBzdHJpbmcsIG5vdEVuZFdpdGg/OiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5jcy5nZXRQb3MoKVxuXG4gICAgICAgIGZvciAoY29uc3QgeCBvZiBsaXRlcmFsKSB7XG5cbiAgICAgICAgICAgIGlmICh4ICE9PSB0aGlzLmNzLnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNzLm5leHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdEVuZFdpdGggJiYgbGl0ZXJhbC5lbmRzV2l0aChub3RFbmRXaXRoKSkge1xuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXRlcmFsXG4gICAgfVxuXG59XG5cbiIsIi8qKlxuICogXG4gKiBBcHBseSBwcmVkaWNhdGUgdG8gZWFjaCBlbGVtZW50IGUgaW4gdGhlIGl0ZXJhYmxlLCBzdG9wIHdoZW4gXG4gKiB5b3UgZmluZCBhIG5vbi1udWxsaXNoIGltYWdlIG9mIGUsIGFuZCByZXR1cm4gdGhlIGltYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3Q8VCwgVT4oaXRlcmFibGU6IFRbXSwgcHJlZGljYXRlOiAoeDogVCkgPT4gVSk6IFUgfCB1bmRlZmluZWQge1xuXG4gICAgZm9yIChjb25zdCBlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IG1heWJlUmVzdWx0ID0gcHJlZGljYXRlKGUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChtYXliZVJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIG1heWJlUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVSZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGNvbnN0IHNlZW46IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge31cblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgeyBnZXRDaGFyU3RyZWFtIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgc3ludGF4ZXMgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NzdHNcIjtcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuLy8gaW1wb3J0IHsgcGFyc2VTeW50YXgsIHBhcnNlVHJ5IH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cblxuXG4vLyAvLyBFWEFNUExFIDAgXG4vLyBjb25zdCBjczAgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeDAgPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzMClcbi8vIGNvbnN0IHkwID0gcGFyc2VUcnkoWydzcGFjZSddLCBjczApXG4vLyBjb25zdCB6MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczApXG4vLyBjb25zb2xlLmxvZygwLCB4MCwgeTAsIHowKVxuLy8gLy8gRVhBTVBMRSAxXG4vLyBjb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4ID0gcGFyc2VUcnkoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbi8vIGNvbnNvbGUubG9nKDEsIHgpXG4vLyAvLyBFWEFNUExFIDJcbi8vIGNvbnN0IGNzMiA9IGdldENoYXJTdHJlYW0oJ2RvICBtYWtlICcpXG4vLyBjb25zdCB4MiA9IHBhcnNlVHJ5KFsnZG8tdmVyYiddLCBjczIpXG4vLyBjb25zb2xlLmxvZygyLCB4Milcbi8vIC8vIEVYQU1QTEUgM1xuLy8gY29uc3QgY3MzID0gZ2V0Q2hhclN0cmVhbSgnXCIgY2lhbyBcInh4eCcpXG4vLyBjb25zdCB4MyA9IHBhcnNlVHJ5KFsnc3RyaW5nLWxpdGVyYWwnXSwgY3MzKVxuLy8gY29uc29sZS5sb2coMywgeDMpXG4vLyAvLyBFWEFNUExFIDRcbi8vIGNvbnN0IGNzNCA9IGdldENoYXJTdHJlYW0oJ2NpYW8gbW9uZG8gYnVydWYnKVxuLy8gY29uc3QgeDQgPSBwYXJzZVN5bnRheChbeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0Jywgcm9sZTogJ2FueXRoaW5nJyBhcyBhbnkgfV0sIGNzNClcbi8vIGNvbnN0IHg0MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczQpXG4vLyBjb25zb2xlLmxvZyg0LCB4NCwgeDQwKVxuLy8gLy8gRVhBTVBMRSA1XG4vLyBjb25zdCBjczUgPSBnZXRDaGFyU3RyZWFtKCdkb2VzIG5vdCBtYWtlICcpIC8vIGRvZXMgbm90IG1ha2UgLy8gaXMgbm90XG4vLyBjb25zdCB4NSA9IHBhcnNlVHJ5KFsndmVyYiddLCBjczUpXG4vLyBjb25zb2xlLmxvZyg1LCB4NSlcblxuXG4vLyBjb25zdCBwYXJzZXIgPSBnZXRQYXJzZXIoJzEyMScsIHN5bnRheGVzKVxuLy8gY29uc29sZS5sb2cocGFyc2VyLnBhcnNlKCkpXG5cbi8vIGNvbnN0IHN5bnRheExpc3QgPSBPYmplY3Qua2V5cyhzeW50YXhlcykgYXMgQXN0VHlwZVtdXG4vLyBzeW50YXhMaXN0LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgc3ludGF4ZXMpKVxuLy8gY29uc29sZS5sb2coc3ludGF4TGlzdClcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdCB4ID0gZ2V0UGFyc2VyKCdiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdldmVyeSBiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgxKVxuXG4vLyBjb25zdCB4MiA9IGdldFBhcnNlcignYmFkIGJsdWUgYmlyZHMnLCBzeW50YXhlcykucGFyc2UoKSAvL1BST0JMRU0hXG4vLyBjb25zb2xlLmxvZyh4MilcblxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2JhZCBibHVlIGJpcmQgb2YgdGhlIHggJywgc3ludGF4ZXMpLnBhcnNlKCkgLy9QUk9CTEVNIVxuLy8gY29uc29sZS5sb2coeDMpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCd4IG9mIHknLCBzeW50YXhlcykucGFyc2VUcnkoWydub3VuLXBocmFzZSddKVxuLy8gY29uc29sZS5sb2coeDEpXG5cbi8vIGNvbnNvbGUubG9nKHgxKVxuXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdiYWQgYnVydWYgb2YgaG91c2Ugb2YgbWUnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDIgPSBnZXRQYXJzZXIoJ2JhZCBwZXJzb24nLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2V2ZXJ5IHggaXMgY2FwcmEgYnkgeScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ3NpbXBsZS1zZW50ZW5jZSddKVxuXG4vLyBjb25zb2xlLmxvZyh4MSlcbi8vIGNvbnNvbGUubG9nKHgyKVxuLy8gY29uc29sZS5sb2coeDMpXG5cblxuLy8gcHJvYmxlbSB3aXRoIG11bHRpcGxlIG1vZGlmaWVycyFcbmNvbnN0IHg0ID0gZ2V0UGFyc2VyKCd0aGUgYmFkIGNhcHJhcyBvZiByaXZhbmF6emFubyBvZiBsb21iYXJkaWEgYXJlIGJ1cnVmJywgc3ludGF4ZXMpLnBhcnNlKClcbmNvbnNvbGUubG9nKHg0KSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==