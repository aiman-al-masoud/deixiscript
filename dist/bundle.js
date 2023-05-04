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
        { types: ['math-expression'], role: 'rightOperand', number: '1|0' }
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
        { types: ['math-expression', 'noun-phrase'], role: 'subject', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['verb'], expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['math-expression', 'noun-phrase'], role: 'object', number: '1|0' },
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
const x2 = (0, parser_1.getParser)('the bad capras of rivanazzano of lombardia are buruf', csts_1.syntaxes).parse();
const x3 = (0, parser_1.getParser)('xa + xb', csts_1.syntaxes).parse(); //.parseTry(['noun-phrase'])
const x4 = (0, parser_1.getParser)('xa + xb + yt', csts_1.syntaxes).parse(); //.parseTry(['noun-phrase'])
console.log(x2);
console.log(x3);
console.log(x4);
// const x6 = getParser('xa  is rt + uy', syntaxes).parseTry(['simple-sentence'])//.parseTry(['noun-phrase'])
// console.log(x6)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OEI7QUFFOUIsd0RBQXdEO0FBQ3hELDJEQUEyRDtBQUMzRCwwQkFBMEI7QUFFMUIsOEJBQThCO0FBQzlCLHlEQUF5RDtBQUN6RCxpQkFBaUI7QUFFakIsZ0VBQWdFO0FBQ2hFLGtCQUFrQjtBQUVsQixzRUFBc0U7QUFDdEUsa0JBQWtCO0FBRWxCLCtFQUErRTtBQUMvRSxrQkFBa0I7QUFFbEIscUVBQXFFO0FBQ3JFLGtCQUFrQjtBQUVsQixrQkFBa0I7QUFHbEIscUVBQXFFO0FBQ3JFLHVEQUF1RDtBQUN2RCx3RkFBd0Y7QUFFeEYsa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFHbEIsbUNBQW1DO0FBQ25DLE1BQU0sRUFBRSxHQUFHLHNCQUFTLEVBQUMsc0RBQXNELEVBQUUsZUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQzlGLE1BQU0sRUFBRSxHQUFHLHNCQUFTLEVBQUMsU0FBUyxFQUFFLGVBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSw4QkFBNEI7QUFDN0UsTUFBTSxFQUFFLEdBQUcsc0JBQVMsRUFBQyxjQUFjLEVBQUUsZUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLDhCQUE0QjtBQUdsRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFHZiw2R0FBNkc7QUFDN0csa0JBQWtCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY2hhci1zdHJlYW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9uZXctZnJvbnRlbmQvY3N0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9tYXgtcHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9maXJzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgQ2hhclN0cmVhbSB7XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHRvIHRoZSBuZXh0IGNoYXJhY3RlciBpZiBhbnkuXG4gICAgICovXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgLyoqXG4gICAgICogUmVhZCB0aGUgY3VycmVudCBjaGFyYWN0ZXIuXG4gICAgICovXG4gICAgcGVlaygpOiBzdHJpbmdcbiAgICAvKipcbiAgICAgKiBHbyBiYWNrLlxuICAgICAqL1xuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0UG9zKCk6IG51bWJlclxuICAgIC8qKlxuICAgICAqIFJlYWNoZWQgZW5kIG9mIGNoYXJzdHJlYW0uXG4gICAgICovXG4gICAgaXNFbmQoKTogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhclN0cmVhbShzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IEJhc2VDaGFyU3RyZWFtKHNvdXJjZUNvZGUpXG59XG5cbmNsYXNzIEJhc2VDaGFyU3RyZWFtIGltcGxlbWVudHMgQ2hhclN0cmVhbSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcG9zID0gMCxcbiAgICApIHtcblxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRW5kKCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wb3MrK1xuICAgIH1cblxuICAgIHBlZWsoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlQ29kZVt0aGlzLnBvc11cbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXRQb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zXG4gICAgfVxuXG4gICAgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnNvdXJjZUNvZGUubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBTeW50YXggPSBNZW1iZXJbXSAvLyBDc3RNb2RlbFxuXG5cbmV4cG9ydCBjb25zdCByb2xlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdpZCcsXG4gICAgJ2RpZ2l0cycsXG4gICAgJ2NoYXJzJyxcbiAgICAncGx1cmFsaXplcicsXG4gICAgJ2FuYXBob3JhT3BlcmF0b3InLFxuICAgICduZXdPcGVyYXRvcicsXG4gICAgJ21vZGlmaWVycycsXG4gICAgJ2hlYWQnLFxuICAgICdsaW1pdEtleXdvcmQnLFxuICAgICdsaW1pdE51bWJlcicsXG4gICAgJ2xlZnRPcGVyYW5kJyxcbiAgICAncmlnaHRPcGVyYW5kJyxcbiAgICAnb3BlcmF0b3InLFxuICAgICdvd25lcicsXG4gICAgJ29iamVjdCcsXG4gICAgJ3JlY2VpdmVyJyxcbiAgICAnaW5zdHJ1bWVudCcsXG4gICAgJ3N1YmplY3QnLFxuICAgICd2ZXJiJyxcbiAgICAnbmVnYXRpb24nLFxuICAgICdjb25kaXRpb24nLFxuICAgICdjb25zZXF1ZW5jZScsXG4gICAgJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nLCAvLyBCQURcbilcblxuZXhwb3J0IHR5cGUgUm9sZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiByb2xlcz5cblxuXG50eXBlIEJhc2VNZW1iZXIgPSB7XG4gICAgcmVhZG9ubHkgbnVtYmVyPzogQ2FyZGluYWxpdHkgLy8gbm8gbnVtYmVyIC0tLT4gMVxuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlIC8vIG5vIHJvbGUgLS0+IGV4Y2x1ZGUgZnJvbSBhc3RcbiAgICByZWFkb25seSBzZXA/OiBBc3RUeXBlXG4gICAgcmVhZG9ubHkgZXhwYW5kPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IHJlZHVjZT86IGJvb2xlYW5cbiAgICByZWFkb25seSBub3RFbmRXaXRoPzogc3RyaW5nXG59XG5cbmV4cG9ydCB0eXBlIExpdGVyYWxNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IGxpdGVyYWxzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHR5cGVzPzogdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgYW55Q2hhckV4Y2VwdEZvcj86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgZXhwYW5kPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIFR5cGVNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IHR5cGVzOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBsaXRlcmFscz86IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXIgPSBMaXRlcmFsTWVtYmVyIHwgVHlwZU1lbWJlclxuXG5leHBvcnQgdHlwZSBBc3RUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGFzdFR5cGVzPlxuXG5leHBvcnQgY29uc3QgYXN0VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnc3BhY2UnLFxuICAgICdpZGVudGlmaWVyJyxcbiAgICAnc3RyaW5nLWxpdGVyYWwnLFxuICAgICdudW1iZXItbGl0ZXJhbCcsXG4gICAgJ2V4cHJlc3Npb24nLCAvLyBhbmQtZXhwcmVzc2lvblxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnLFxuICAgICdzaW1wbGUtc2VudGVuY2UnLFxuICAgICdnZW5pdGl2ZScsXG4gICAgJ2RhdGl2ZScsXG4gICAgJ2luc3RydW1lbnRhbCcsXG4gICAgJ3ZlcmInLFxuICAgICdjb3B1bGEnLFxuICAgICdkby12ZXJiJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nLFxuKVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8ICdhbGwtYnV0LWxhc3QnXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuICAgIHx8IGMgPT09ICdhbGwtYnV0LWxhc3QnXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0gPSB7XG5cbiAgICBzcGFjZTogW1xuICAgICAgICB7IG51bWJlcjogJysnLCBsaXRlcmFsczogWycgJywgJ1xcbicsICdcXHQnXSB9XG4gICAgXSxcbiAgICBpZGVudGlmaWVyOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdpZCcsIHJlZHVjZTogdHJ1ZSwgbGl0ZXJhbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJywgJ28nLCAncCcsICdxJywgJ3InLCAncycsICd0JywgJ3UnLCAndicsICd3JywgJ3gnLCAneScsICd6J10sIG5vdEVuZFdpdGg6ICdzJyB9XG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdkaWdpdHMnLCByZWR1Y2U6IHRydWUsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IGFueUNoYXJFeGNlcHRGb3I6IFsnXCInXSwgbGl0ZXJhbHM6IFtdLCByb2xlOiAnY2hhcnMnLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWycrJywgJy0nLCAnKicsICcvJ10sIHJvbGU6ICdvcGVyYXRvcicsIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICdnZW5pdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydvZiddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdvd25lcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG4gICAgJ2RhdGl2ZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWyd0byddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdyZWNlaXZlcicsIG51bWJlcjogMSB9LFxuICAgIF0sXG4gICAgJ2luc3RydW1lbnRhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydieSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdpbnN0cnVtZW50JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcbiAgICAnY29tcGxlbWVudCc6IFtcbiAgICAgICAgeyB0eXBlczogWydkYXRpdmUnLCAnaW5zdHJ1bWVudGFsJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAxIH1cbiAgICBdLFxuICAgICdzaW1wbGUtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJywgJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWyd2ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydtYXRoLWV4cHJlc3Npb24nLCAnbm91bi1waHJhc2UnXSwgcm9sZTogJ29iamVjdCcsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJywgZXhwYW5kOiB0cnVlIH0sXG4gICAgXSxcbiAgICB2ZXJiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29wdWxhJywgJ2RvLXZlcmInXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvZXMnLCAnZG8nXSB9LCAvLyBvcmRlciBtYXR0ZXJzISBzdXBlcnN0cmluZyBmaXJzdCFcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG4gICAgY29wdWxhOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaXMnLCAnYmUnLCAnYXJlJ10sIHJvbGU6ICd2ZXJiJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ25vdCddLCByb2xlOiAnbmVnYXRpb24nLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlczogWydjb21wbGV4LXNlbnRlbmNlLW9uZScsICdjb21wbGV4LXNlbnRlbmNlLXR3byddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICBdXG59IiwiaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4vY3N0c1wiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUsIHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUsIHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IEFzdFR5cGUsIHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlcyA/PyBbXSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIEFzdFR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCB7IGZpcnN0IH0gZnJvbSBcIi4uL3V0aWxzL2ZpcnN0XCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSwgTGl0ZXJhbE1lbWJlciwgTWVtYmVyLCBSb2xlLCBTeW50YXgsIEFzdFR5cGUsIHJvbGVzIH0gZnJvbSBcIi4vY3N0c1wiO1xuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuL21heC1wcmVjZWRlbmNlXCI7XG5cblxudHlwZSBBc3ROb2RlID1cbiAgICBzdHJpbmdcbiAgICB8IHN0cmluZ1tdXG4gICAgfCBBc3ROb2RlW11cbiAgICB8IHsgW3ggaW4gUm9sZV0/OiBBc3ROb2RlIH0gJiB7IHR5cGU/OiBBc3RUeXBlIH1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2Uoc291cmNlQ29kZTogc3RyaW5nKTogQXN0Tm9kZSB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSB7XG4gICAgcmV0dXJuIG5ldyBLb29sZXJQYXJzZXIoc291cmNlQ29kZSwgc3ludGF4ZXMpXG59XG5cbmNsYXNzIEtvb2xlclBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICByZWFkb25seSBzeW50YXhMaXN0ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhlcykgYXMgQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkga2V5d29yZHMgPSB1bmlxKE9iamVjdC52YWx1ZXModGhpcy5zeW50YXhlcykuZmxhdE1hcCh4ID0+IHguZmxhdE1hcCh4ID0+IHgubGl0ZXJhbHMgPz8gW10pKSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSxcbiAgICAgICAgcmVhZG9ubHkgY3MgPSBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGUpLFxuICAgICkge1xuICAgICAgICB0aGlzLnN5bnRheExpc3Quc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCBzeW50YXhlcykpXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVHJ5KHRoaXMuc3ludGF4TGlzdClcbiAgICB9XG5cbiAgICBwYXJzZVRyeShzeW50YXhMaXN0OiBBc3RUeXBlW10sIHRvcCA9IDApIHtcblxuICAgICAgICBmb3IgKGNvbnN0IHN5bnRheE5hbWUgb2Ygc3ludGF4TGlzdCkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICd0cnkgcGFyc2luZyBzeW50YXhOYW1lPScsIHN5bnRheE5hbWUpXG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG4gICAgICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLnN5bnRheGVzW3N5bnRheE5hbWVdXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlU3ludGF4KHN5bnRheCwgc3ludGF4TmFtZSwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoYXN0ICYmIGFzdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLmFzdCwgdHlwZTogc3ludGF4TmFtZSB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHBhcnNlU3ludGF4KHN5bnRheDogU3ludGF4LCBzeW50YXhOYW1lOiBBc3RUeXBlLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgYXN0OiBBc3ROb2RlID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGFyc2VNZW1iZXJNYXliZVJlcGVhdGVkKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICdmYWlsZWQgYmVjYXVzZSByZXF1aXJlZCcsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdpcyBtaXNzaW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgaXNOZWNlc3Nhcnk9ZmFsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICd1bnJlcXVpcmVkJywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25vdCBmb3VuZCwgaWdub3JlZCcsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUgJiYgbWVtYmVyLmV4cGFuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwYW5kaW5nIG1lbWJlciB3aXRoIHJvbGUgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lbWJlci5yZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUpIHtcbiAgICAgICAgICAgICAgICBhc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLmV4cGFuZCAmJiAhKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkpIHsgLy8gZGljdGlvbmFyeSBhc3QgY2FzZVxuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhub2RlKVxuICAgICAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChlID0+IHJvbGVzLmluY2x1ZGVzKGVbMF0gYXMgUm9sZSkgJiYgKGFzdFtlWzBdIGFzIFJvbGVdID0gZVsxXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuZXhwYW5kICYmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VYUEFORCBBUlJBWSEnLCBub2RlLCAnb24nLCBhc3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3RcbiAgICB9XG5cbiAgICBwYXJzZU1lbWJlck1heWJlUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApIHtcbiAgICAgICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICAgICAgaWYgKGlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIHRvcClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgdG9wID0gMCk6IEFzdE5vZGVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cbiAgICAgICAgbGV0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmNzLmlzRW5kKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50b0J1ZiA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIG1lbWVudG8gPSBtZW1lbnRvQnVmXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaChub2RlKVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnNlcCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3BhcnNlTWVtYmVyUmVwZWF0ZWQgYmVmb3JlIHNraXBwaW5nIGEgc2VwYXJhdG9yPScsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKHsgdHlwZXM6IFttZW1iZXIuc2VwXSB9LCB0b3ApXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBza2lwcGVkIGEgc2VwYXJhdG9yPScsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbWJlci5udW1iZXIgPT09ICdhbGwtYnV0LWxhc3QnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdoYXZlIHRvIGJhY2t0cmFjaywgb2xkIGxpc3QgbGVuPScsIGxpc3QubGVuZ3RoLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICBsaXN0LnBvcCgpXG4gICAgICAgICAgICB0aGlzLmNzLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAnYmFja3RyYWNrLCBwYXJzZU1lbWJlclJlcGVhdGVkIHBvcCBmcm9tIGxpc3Qgb2Y9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25ldyBsaXN0IGxlbj0nLCBsaXN0Lmxlbmd0aCwgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBlbXB0eSBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLnJlZHVjZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBmb3VuZCBvayBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAnbGlzdD0nLCBsaXN0LnRvU3RyaW5nKCksICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIHJldHVybiBsaXN0Lm1hcCh4ID0+IHgudG9TdHJpbmcoKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgICAgICBpZiAobWVtYmVyLmxpdGVyYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWwobWVtYmVyLCB0b3ApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnBhcnNlVHJ5KG1lbWJlci50eXBlcywgdG9wICsgMSlcblxuICAgICAgICAgICAgaWYgKHRoaXMua2V5d29yZHMuaW5jbHVkZXMocmVzdWx0IGFzIHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdyZXR1cm5pbmcgdW5kZWZpbmVkIGJlY2F1c2UgYSBrZXl3b3JkIGlzIGJlaW5nIHRyYXRlZCBhcyBpZGVudGlmaWVyISBmb3I9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwYXJzZUxpdGVyYWwobWVtYmVyOiBMaXRlcmFsTWVtYmVyLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmNzLnBlZWsoKVxuXG4gICAgICAgIGlmIChtZW1iZXIuYW55Q2hhckV4Y2VwdEZvciAmJiAhbWVtYmVyLmFueUNoYXJFeGNlcHRGb3IuaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3MubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY2hhclxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmlyc3QobWVtYmVyLmxpdGVyYWxzLCB4ID0+IHRoaXMucGFyc2VMaXRlcmFsU2luZ2xlKHgsIG1lbWJlci5ub3RFbmRXaXRoKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbFNpbmdsZShsaXRlcmFsOiBzdHJpbmcsIG5vdEVuZFdpdGg/OiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5jcy5nZXRQb3MoKVxuXG4gICAgICAgIGZvciAoY29uc3QgeCBvZiBsaXRlcmFsKSB7XG5cbiAgICAgICAgICAgIGlmICh4ICE9PSB0aGlzLmNzLnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNzLm5leHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdEVuZFdpdGggJiYgbGl0ZXJhbC5lbmRzV2l0aChub3RFbmRXaXRoKSkge1xuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXRlcmFsXG4gICAgfVxuXG59XG5cbiIsIi8qKlxuICogXG4gKiBBcHBseSBwcmVkaWNhdGUgdG8gZWFjaCBlbGVtZW50IGUgaW4gdGhlIGl0ZXJhYmxlLCBzdG9wIHdoZW4gXG4gKiB5b3UgZmluZCBhIG5vbi1udWxsaXNoIGltYWdlIG9mIGUsIGFuZCByZXR1cm4gdGhlIGltYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3Q8VCwgVT4oaXRlcmFibGU6IFRbXSwgcHJlZGljYXRlOiAoeDogVCkgPT4gVSk6IFUgfCB1bmRlZmluZWQge1xuXG4gICAgZm9yIChjb25zdCBlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IG1heWJlUmVzdWx0ID0gcHJlZGljYXRlKGUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChtYXliZVJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIG1heWJlUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVSZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGNvbnN0IHNlZW46IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge31cblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgeyBnZXRDaGFyU3RyZWFtIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgc3ludGF4ZXMgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NzdHNcIjtcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuLy8gaW1wb3J0IHsgcGFyc2VTeW50YXgsIHBhcnNlVHJ5IH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cblxuXG4vLyAvLyBFWEFNUExFIDAgXG4vLyBjb25zdCBjczAgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeDAgPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzMClcbi8vIGNvbnN0IHkwID0gcGFyc2VUcnkoWydzcGFjZSddLCBjczApXG4vLyBjb25zdCB6MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczApXG4vLyBjb25zb2xlLmxvZygwLCB4MCwgeTAsIHowKVxuLy8gLy8gRVhBTVBMRSAxXG4vLyBjb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4ID0gcGFyc2VUcnkoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbi8vIGNvbnNvbGUubG9nKDEsIHgpXG4vLyAvLyBFWEFNUExFIDJcbi8vIGNvbnN0IGNzMiA9IGdldENoYXJTdHJlYW0oJ2RvICBtYWtlICcpXG4vLyBjb25zdCB4MiA9IHBhcnNlVHJ5KFsnZG8tdmVyYiddLCBjczIpXG4vLyBjb25zb2xlLmxvZygyLCB4Milcbi8vIC8vIEVYQU1QTEUgM1xuLy8gY29uc3QgY3MzID0gZ2V0Q2hhclN0cmVhbSgnXCIgY2lhbyBcInh4eCcpXG4vLyBjb25zdCB4MyA9IHBhcnNlVHJ5KFsnc3RyaW5nLWxpdGVyYWwnXSwgY3MzKVxuLy8gY29uc29sZS5sb2coMywgeDMpXG4vLyAvLyBFWEFNUExFIDRcbi8vIGNvbnN0IGNzNCA9IGdldENoYXJTdHJlYW0oJ2NpYW8gbW9uZG8gYnVydWYnKVxuLy8gY29uc3QgeDQgPSBwYXJzZVN5bnRheChbeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0Jywgcm9sZTogJ2FueXRoaW5nJyBhcyBhbnkgfV0sIGNzNClcbi8vIGNvbnN0IHg0MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczQpXG4vLyBjb25zb2xlLmxvZyg0LCB4NCwgeDQwKVxuLy8gLy8gRVhBTVBMRSA1XG4vLyBjb25zdCBjczUgPSBnZXRDaGFyU3RyZWFtKCdkb2VzIG5vdCBtYWtlICcpIC8vIGRvZXMgbm90IG1ha2UgLy8gaXMgbm90XG4vLyBjb25zdCB4NSA9IHBhcnNlVHJ5KFsndmVyYiddLCBjczUpXG4vLyBjb25zb2xlLmxvZyg1LCB4NSlcblxuXG4vLyBjb25zdCBwYXJzZXIgPSBnZXRQYXJzZXIoJzEyMScsIHN5bnRheGVzKVxuLy8gY29uc29sZS5sb2cocGFyc2VyLnBhcnNlKCkpXG5cbi8vIGNvbnN0IHN5bnRheExpc3QgPSBPYmplY3Qua2V5cyhzeW50YXhlcykgYXMgQXN0VHlwZVtdXG4vLyBzeW50YXhMaXN0LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgc3ludGF4ZXMpKVxuLy8gY29uc29sZS5sb2coc3ludGF4TGlzdClcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdCB4ID0gZ2V0UGFyc2VyKCdiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdldmVyeSBiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgxKVxuXG4vLyBjb25zdCB4MiA9IGdldFBhcnNlcignYmFkIGJsdWUgYmlyZHMnLCBzeW50YXhlcykucGFyc2UoKSAvL1BST0JMRU0hXG4vLyBjb25zb2xlLmxvZyh4MilcblxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2JhZCBibHVlIGJpcmQgb2YgdGhlIHggJywgc3ludGF4ZXMpLnBhcnNlKCkgLy9QUk9CTEVNIVxuLy8gY29uc29sZS5sb2coeDMpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCd4IG9mIHknLCBzeW50YXhlcykucGFyc2VUcnkoWydub3VuLXBocmFzZSddKVxuLy8gY29uc29sZS5sb2coeDEpXG5cbi8vIGNvbnNvbGUubG9nKHgxKVxuXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdiYWQgYnVydWYgb2YgaG91c2Ugb2YgbWUnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDIgPSBnZXRQYXJzZXIoJ2JhZCBwZXJzb24nLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2V2ZXJ5IHggaXMgY2FwcmEgYnkgeScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ3NpbXBsZS1zZW50ZW5jZSddKVxuXG4vLyBjb25zb2xlLmxvZyh4MSlcbi8vIGNvbnNvbGUubG9nKHgyKVxuLy8gY29uc29sZS5sb2coeDMpXG5cblxuLy8gcHJvYmxlbSB3aXRoIG11bHRpcGxlIG1vZGlmaWVycyFcbmNvbnN0IHgyID0gZ2V0UGFyc2VyKCd0aGUgYmFkIGNhcHJhcyBvZiByaXZhbmF6emFubyBvZiBsb21iYXJkaWEgYXJlIGJ1cnVmJywgc3ludGF4ZXMpLnBhcnNlKClcbmNvbnN0IHgzID0gZ2V0UGFyc2VyKCd4YSArIHhiJywgc3ludGF4ZXMpLnBhcnNlKCkvLy5wYXJzZVRyeShbJ25vdW4tcGhyYXNlJ10pXG5jb25zdCB4NCA9IGdldFBhcnNlcigneGEgKyB4YiArIHl0Jywgc3ludGF4ZXMpLnBhcnNlKCkvLy5wYXJzZVRyeShbJ25vdW4tcGhyYXNlJ10pXG5cblxuY29uc29sZS5sb2coeDIpXG5jb25zb2xlLmxvZyh4MylcbmNvbnNvbGUubG9nKHg0KVxuXG5cbi8vIGNvbnN0IHg2ID0gZ2V0UGFyc2VyKCd4YSAgaXMgcnQgKyB1eScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ3NpbXBsZS1zZW50ZW5jZSddKS8vLnBhcnNlVHJ5KFsnbm91bi1waHJhc2UnXSlcbi8vIGNvbnNvbGUubG9nKHg2KSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==