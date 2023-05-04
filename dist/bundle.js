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
            const syntax = this.syntaxes[syntaxName]; // state!
            const tree = this.parseSyntax(syntax, syntaxName, top);
            if (tree && tree instanceof Object) {
                return Object.assign(Object.assign({}, tree), { type: syntaxName });
            }
            if (tree) {
                return tree;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDeEQsMkRBQTJEO0FBQzNELDBCQUEwQjtBQUUxQiw4QkFBOEI7QUFDOUIseURBQXlEO0FBQ3pELGlCQUFpQjtBQUVqQixnRUFBZ0U7QUFDaEUsa0JBQWtCO0FBRWxCLHNFQUFzRTtBQUN0RSxrQkFBa0I7QUFFbEIsK0VBQStFO0FBQy9FLGtCQUFrQjtBQUVsQixxRUFBcUU7QUFDckUsa0JBQWtCO0FBRWxCLGtCQUFrQjtBQUdsQixxRUFBcUU7QUFDckUsdURBQXVEO0FBQ3ZELHdGQUF3RjtBQUV4RixrQkFBa0I7QUFDbEIsa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUdsQixtQ0FBbUM7QUFDbkMsTUFBTSxFQUFFLEdBQUcsc0JBQVMsRUFBQyxzREFBc0QsRUFBRSxlQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUU7QUFDOUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ZpcnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGhlIG5leHQgY2hhcmFjdGVyIGlmIGFueS5cbiAgICAgKi9cbiAgICBuZXh0KCk6IHZvaWRcbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBwZWVrKCk6IHN0cmluZ1xuICAgIC8qKlxuICAgICAqIEdvIGJhY2suXG4gICAgICovXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRQb3MoKTogbnVtYmVyXG4gICAgLyoqXG4gICAgICogUmVhY2hlZCBlbmQgb2YgY2hhcnN0cmVhbS5cbiAgICAgKi9cbiAgICBpc0VuZCgpOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgQmFzZUNoYXJTdHJlYW0oc291cmNlQ29kZSlcbn1cblxuY2xhc3MgQmFzZUNoYXJTdHJlYW0gaW1wbGVtZW50cyBDaGFyU3RyZWFtIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwb3MgPSAwLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmQoKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvcysrXG4gICAgfVxuXG4gICAgcGVlaygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VDb2RlW3RoaXMucG9zXVxuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldFBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NcbiAgICB9XG5cbiAgICBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMuc291cmNlQ29kZS5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIFN5bnRheCA9IE1lbWJlcltdIC8vIENzdE1vZGVsXG5cblxuZXhwb3J0IGNvbnN0IHJvbGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ2lkJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnY2hhcnMnLFxuICAgICdwbHVyYWxpemVyJyxcbiAgICAnYW5hcGhvcmFPcGVyYXRvcicsXG4gICAgJ25ld09wZXJhdG9yJyxcbiAgICAnbW9kaWZpZXJzJyxcbiAgICAnaGVhZCcsXG4gICAgJ2xpbWl0S2V5d29yZCcsXG4gICAgJ2xpbWl0TnVtYmVyJyxcbiAgICAnbGVmdE9wZXJhbmQnLFxuICAgICdyaWdodE9wZXJhbmQnLFxuICAgICdvcGVyYXRvcicsXG4gICAgJ293bmVyJyxcbiAgICAnb2JqZWN0JyxcbiAgICAncmVjZWl2ZXInLFxuICAgICdpbnN0cnVtZW50JyxcbiAgICAnc3ViamVjdCcsXG4gICAgJ3ZlcmInLFxuICAgICduZWdhdGlvbicsXG4gICAgJ2NvbmRpdGlvbicsXG4gICAgJ2NvbnNlcXVlbmNlJyxcbiAgICAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicsIC8vIEJBRFxuKVxuXG5leHBvcnQgdHlwZSBSb2xlID0gRWxlbWVudFR5cGU8dHlwZW9mIHJvbGVzPlxuXG5cbnR5cGUgQmFzZU1lbWJlciA9IHtcbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eSAvLyBubyBudW1iZXIgLS0tPiAxXG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGUgLy8gbm8gcm9sZSAtLT4gZXhjbHVkZSBmcm9tIGFzdFxuICAgIHJlYWRvbmx5IHNlcD86IEFzdFR5cGVcbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgcmVkdWNlPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IG5vdEVuZFdpdGg/OiBzdHJpbmdcbn1cblxuZXhwb3J0IHR5cGUgTGl0ZXJhbE1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgbGl0ZXJhbHM6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgdHlwZXM/OiB1bmRlZmluZWRcbiAgICByZWFkb25seSBhbnlDaGFyRXhjZXB0Rm9yPzogc3RyaW5nW11cbiAgICByZWFkb25seSBleHBhbmQ/OiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IHR5cGUgVHlwZU1lbWJlciA9IEJhc2VNZW1iZXIgJiB7XG4gICAgcmVhZG9ubHkgdHlwZXM6IEFzdFR5cGVbXVxuICAgIHJlYWRvbmx5IGxpdGVyYWxzPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IExpdGVyYWxNZW1iZXIgfCBUeXBlTWVtYmVyXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgYXN0VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBhc3RUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdzcGFjZScsXG4gICAgJ2lkZW50aWZpZXInLFxuICAgICdzdHJpbmctbGl0ZXJhbCcsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnZXhwcmVzc2lvbicsIC8vIGFuZC1leHByZXNzaW9uXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnbGltaXQtcGhyYXNlJyxcbiAgICAnbWF0aC1leHByZXNzaW9uJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG4gICAgJ3NpbXBsZS1zZW50ZW5jZScsXG4gICAgJ2dlbml0aXZlJyxcbiAgICAnZGF0aXZlJyxcbiAgICAnaW5zdHJ1bWVudGFsJyxcbiAgICAndmVyYicsXG4gICAgJ2NvcHVsYScsXG4gICAgJ2RvLXZlcmInLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlLXR3bycsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4gICAgfHwgYyA9PT0gJ2FsbC1idXQtbGFzdCdcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgcmVkdWNlOiB0cnVlLCBsaXRlcmFsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JywgJ3cnLCAneCcsICd5JywgJ3onXSwgbm90RW5kV2l0aDogJ3MnIH1cbiAgICBdLFxuICAgICdudW1iZXItbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2RpZ2l0cycsIHJlZHVjZTogdHJ1ZSwgbGl0ZXJhbHM6IFsnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddIH1cbiAgICBdLFxuICAgICdzdHJpbmctbGl0ZXJhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydcIiddIH0sXG4gICAgICAgIHsgYW55Q2hhckV4Y2VwdEZvcjogWydcIiddLCBsaXRlcmFsczogW10sIHJvbGU6ICdjaGFycycsIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgIF0sXG4gICAgJ25vdW4tcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2V2ZXJ5JywgJ2FueSddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlJywgJ29sZCddLCByb2xlOiAnYW5hcGhvcmFPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYScsICdhbicsICduZXcnXSwgcm9sZTogJ25ld09wZXJhdG9yJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydsaW1pdC1waHJhc2UnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgcm9sZTogJ21vZGlmaWVycycsIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJywgJ3N0cmluZy1saXRlcmFsJywgJ251bWJlci1saXRlcmFsJ10sIHJvbGU6ICdoZWFkJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsncyddLCByb2xlOiAncGx1cmFsaXplcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZ2VuaXRpdmUnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2ZpcnN0JywgJ2xhc3QnXSwgcm9sZTogJ2xpbWl0S2V5d29yZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnbGltaXROdW1iZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICBcImV4cHJlc3Npb25cIjogW1xuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAnbGVmdE9wZXJhbmQnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2FuZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ21hdGgtZXhwcmVzc2lvbiddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAnZ2VuaXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnb2YnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb3duZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdpbnN0cnVtZW50YWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYnknXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnaW5zdHJ1bWVudCcsIG51bWJlcjogMSB9LFxuICAgIF0sXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZGF0aXZlJywgJ2luc3RydW1lbnRhbCddLCBleHBhbmQ6IHRydWUsIG51bWJlcjogMSB9XG4gICAgXSxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdzdWJqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWyd2ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAnb2JqZWN0JywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuICAgIHZlcmI6IFtcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnLCAnZG8tdmVyYiddLCBleHBhbmQ6IHRydWUgfVxuICAgIF0sXG4gICAgJ2RvLXZlcmInOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnZG9lcycsICdkbyddIH0sIC8vIG9yZGVyIG1hdHRlcnMhIHN1cGVyc3RyaW5nIGZpcnN0IVxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydub3QnXSwgcm9sZTogJ25lZ2F0aW9uJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICd2ZXJiJyB9XG4gICAgXSxcbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvbXBsZXgtc2VudGVuY2Utb25lJywgJ2NvbXBsZXgtc2VudGVuY2UtdHdvJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZS1vbmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnaWYnLCAnd2hlbiddLCByb2xlOiAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicgfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWyd0aGVuJywgJywnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uc2VxdWVuY2UnIH0sXG4gICAgXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF1cbn0iLCJpbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi9jc3RzXCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGVzID8/IFtdKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQXN0VHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgZmlyc3QgfSBmcm9tIFwiLi4vdXRpbHMvZmlyc3RcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgQXN0VHlwZSwgcm9sZXMgfSBmcm9tIFwiLi9jc3RzXCI7XG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4vbWF4LXByZWNlZGVuY2VcIjtcblxuXG50eXBlIEFzdE5vZGUgPVxuICAgIHN0cmluZ1xuICAgIHwgc3RyaW5nW11cbiAgICB8IEFzdE5vZGVbXVxuICAgIHwgeyBbeCBpbiBSb2xlXT86IEFzdE5vZGUgfSAmIHsgdHlwZT86IEFzdFR5cGUgfVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZShzb3VyY2VDb2RlOiBzdHJpbmcpOiBBc3ROb2RlIHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pIHtcbiAgICByZXR1cm4gbmV3IEtvb2xlclBhcnNlcihzb3VyY2VDb2RlLCBzeW50YXhlcylcbn1cblxuY2xhc3MgS29vbGVyUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHJlYWRvbmx5IHN5bnRheExpc3QgPSBPYmplY3Qua2V5cyh0aGlzLnN5bnRheGVzKSBhcyBBc3RUeXBlW11cbiAgICByZWFkb25seSBrZXl3b3JkcyA9IHVuaXEoT2JqZWN0LnZhbHVlcyh0aGlzLnN5bnRheGVzKS5mbGF0TWFwKHggPT4geC5mbGF0TWFwKHggPT4geC5saXRlcmFscyA/PyBbXSkpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LFxuICAgICAgICByZWFkb25seSBjcyA9IGdldENoYXJTdHJlYW0oc291cmNlQ29kZSksXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdC5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHN5bnRheGVzKSlcbiAgICB9XG5cbiAgICBwYXJzZSgpOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VUcnkodGhpcy5zeW50YXhMaXN0KVxuICAgIH1cblxuICAgIHBhcnNlVHJ5KHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgdG9wID0gMCkge1xuXG4gICAgICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3RyeSBwYXJzaW5nIHN5bnRheE5hbWU9Jywgc3ludGF4TmFtZSlcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuc3ludGF4ZXNbc3ludGF4TmFtZV0gLy8gc3RhdGUhXG4gICAgICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5wYXJzZVN5bnRheChzeW50YXgsIHN5bnRheE5hbWUsIHRvcClcblxuICAgICAgICAgICAgaWYgKHRyZWUgJiYgdHJlZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLnRyZWUsIHR5cGU6IHN5bnRheE5hbWUgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHJlZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHBhcnNlU3ludGF4KHN5bnRheDogU3ludGF4LCBzeW50YXhOYW1lOiBBc3RUeXBlLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgYXN0OiBBc3ROb2RlID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBzeW50YXgpIHtcblxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGFyc2VNZW1iZXJNYXliZVJlcGVhdGVkKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICdmYWlsZWQgYmVjYXVzZSByZXF1aXJlZCcsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdpcyBtaXNzaW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgaXNOZWNlc3Nhcnk9ZmFsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICd1bnJlcXVpcmVkJywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25vdCBmb3VuZCwgaWdub3JlZCcsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUgJiYgbWVtYmVyLmV4cGFuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXhwYW5kaW5nIG1lbWJlciB3aXRoIHJvbGUgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1lbWJlci5yZWR1Y2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJvbGUpIHtcbiAgICAgICAgICAgICAgICBhc3RbbWVtYmVyLnJvbGVdID0gbm9kZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLmV4cGFuZCAmJiAhKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkpIHsgLy8gZGljdGlvbmFyeSBhc3QgY2FzZVxuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhub2RlKVxuICAgICAgICAgICAgICAgIGVudHJpZXMuZm9yRWFjaChlID0+IHJvbGVzLmluY2x1ZGVzKGVbMF0gYXMgUm9sZSkgJiYgKGFzdFtlWzBdIGFzIFJvbGVdID0gZVsxXSkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuZXhwYW5kICYmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VYUEFORCBBUlJBWSEnLCBub2RlLCAnb24nLCBhc3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3RcbiAgICB9XG5cbiAgICBwYXJzZU1lbWJlck1heWJlUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApIHtcbiAgICAgICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICAgICAgaWYgKGlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXIsIHRvcClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJSZXBlYXRlZChtZW1iZXI6IE1lbWJlciwgdG9wID0gMCk6IEFzdE5vZGVbXSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cbiAgICAgICAgbGV0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmNzLmlzRW5kKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50b0J1ZiA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgICAgICAgIG1lbWVudG8gPSBtZW1lbnRvQnVmXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaChub2RlKVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnNlcCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3BhcnNlTWVtYmVyUmVwZWF0ZWQgYmVmb3JlIHNraXBwaW5nIGEgc2VwYXJhdG9yPScsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKHsgdHlwZXM6IFttZW1iZXIuc2VwXSB9LCB0b3ApXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBza2lwcGVkIGEgc2VwYXJhdG9yPScsIG1lbWJlci5yb2xlID8/IG1lbWJlci5saXRlcmFscyA/PyBtZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lbWJlci5udW1iZXIgPT09ICdhbGwtYnV0LWxhc3QnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdoYXZlIHRvIGJhY2t0cmFjaywgb2xkIGxpc3QgbGVuPScsIGxpc3QubGVuZ3RoLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICBsaXN0LnBvcCgpXG4gICAgICAgICAgICB0aGlzLmNzLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAnYmFja3RyYWNrLCBwYXJzZU1lbWJlclJlcGVhdGVkIHBvcCBmcm9tIGxpc3Qgb2Y9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ25ldyBsaXN0IGxlbj0nLCBsaXN0Lmxlbmd0aCwgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBlbXB0eSBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLnJlZHVjZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBmb3VuZCBvayBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZSA/PyBtZW1iZXIubGl0ZXJhbHMgPz8gbWVtYmVyLnR5cGVzLCAnbGlzdD0nLCBsaXN0LnRvU3RyaW5nKCksICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIHJldHVybiBsaXN0Lm1hcCh4ID0+IHgudG9TdHJpbmcoKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYilcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgcGFyc2VNZW1iZXJTaW5nbGUobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gZG9lc24ndCBoYXZlIHRvIHRha2UgY2FyZSBhYm91dCBudW1iZXJcblxuICAgICAgICBpZiAobWVtYmVyLmxpdGVyYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWwobWVtYmVyLCB0b3ApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnBhcnNlVHJ5KG1lbWJlci50eXBlcywgdG9wICsgMSlcblxuICAgICAgICAgICAgaWYgKHRoaXMua2V5d29yZHMuaW5jbHVkZXMocmVzdWx0IGFzIHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdyZXR1cm5pbmcgdW5kZWZpbmVkIGJlY2F1c2UgYSBrZXl3b3JkIGlzIGJlaW5nIHRyYXRlZCBhcyBpZGVudGlmaWVyISBmb3I9JywgbWVtYmVyLnJvbGUgPz8gbWVtYmVyLmxpdGVyYWxzID8/IG1lbWJlci50eXBlcywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwYXJzZUxpdGVyYWwobWVtYmVyOiBMaXRlcmFsTWVtYmVyLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmNzLnBlZWsoKVxuXG4gICAgICAgIGlmIChtZW1iZXIuYW55Q2hhckV4Y2VwdEZvciAmJiAhbWVtYmVyLmFueUNoYXJFeGNlcHRGb3IuaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3MubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY2hhclxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmlyc3QobWVtYmVyLmxpdGVyYWxzLCB4ID0+IHRoaXMucGFyc2VMaXRlcmFsU2luZ2xlKHgsIG1lbWJlci5ub3RFbmRXaXRoKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbFNpbmdsZShsaXRlcmFsOiBzdHJpbmcsIG5vdEVuZFdpdGg/OiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5jcy5nZXRQb3MoKVxuXG4gICAgICAgIGZvciAoY29uc3QgeCBvZiBsaXRlcmFsKSB7XG5cbiAgICAgICAgICAgIGlmICh4ICE9PSB0aGlzLmNzLnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNzLm5leHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vdEVuZFdpdGggJiYgbGl0ZXJhbC5lbmRzV2l0aChub3RFbmRXaXRoKSkge1xuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXRlcmFsXG4gICAgfVxuXG59XG5cbiIsIi8qKlxuICogXG4gKiBBcHBseSBwcmVkaWNhdGUgdG8gZWFjaCBlbGVtZW50IGUgaW4gdGhlIGl0ZXJhYmxlLCBzdG9wIHdoZW4gXG4gKiB5b3UgZmluZCBhIG5vbi1udWxsaXNoIGltYWdlIG9mIGUsIGFuZCByZXR1cm4gdGhlIGltYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3Q8VCwgVT4oaXRlcmFibGU6IFRbXSwgcHJlZGljYXRlOiAoeDogVCkgPT4gVSk6IFUgfCB1bmRlZmluZWQge1xuXG4gICAgZm9yIChjb25zdCBlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgIGNvbnN0IG1heWJlUmVzdWx0ID0gcHJlZGljYXRlKGUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIChtYXliZVJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIG1heWJlUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVSZXN1bHRcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGNvbnN0IHNlZW46IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge31cblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgeyBnZXRDaGFyU3RyZWFtIH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgc3ludGF4ZXMgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NzdHNcIjtcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuLy8gaW1wb3J0IHsgcGFyc2VTeW50YXgsIHBhcnNlVHJ5IH0gZnJvbSBcIi4vc3JjL25ldy1mcm9udGVuZC9wYXJzZXJcIjtcblxuLy8gbWFpbigpXG5cblxuXG4vLyAvLyBFWEFNUExFIDAgXG4vLyBjb25zdCBjczAgPSBnZXRDaGFyU3RyZWFtKCcxMiAgICBtb25kbyAnKVxuLy8gY29uc3QgeDAgPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzMClcbi8vIGNvbnN0IHkwID0gcGFyc2VUcnkoWydzcGFjZSddLCBjczApXG4vLyBjb25zdCB6MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczApXG4vLyBjb25zb2xlLmxvZygwLCB4MCwgeTAsIHowKVxuLy8gLy8gRVhBTVBMRSAxXG4vLyBjb25zdCBjcyA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4ID0gcGFyc2VUcnkoWydudW1iZXItbGl0ZXJhbCddLCBjcylcbi8vIGNvbnNvbGUubG9nKDEsIHgpXG4vLyAvLyBFWEFNUExFIDJcbi8vIGNvbnN0IGNzMiA9IGdldENoYXJTdHJlYW0oJ2RvICBtYWtlICcpXG4vLyBjb25zdCB4MiA9IHBhcnNlVHJ5KFsnZG8tdmVyYiddLCBjczIpXG4vLyBjb25zb2xlLmxvZygyLCB4Milcbi8vIC8vIEVYQU1QTEUgM1xuLy8gY29uc3QgY3MzID0gZ2V0Q2hhclN0cmVhbSgnXCIgY2lhbyBcInh4eCcpXG4vLyBjb25zdCB4MyA9IHBhcnNlVHJ5KFsnc3RyaW5nLWxpdGVyYWwnXSwgY3MzKVxuLy8gY29uc29sZS5sb2coMywgeDMpXG4vLyAvLyBFWEFNUExFIDRcbi8vIGNvbnN0IGNzNCA9IGdldENoYXJTdHJlYW0oJ2NpYW8gbW9uZG8gYnVydWYnKVxuLy8gY29uc3QgeDQgPSBwYXJzZVN5bnRheChbeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHNlcDogJ3NwYWNlJywgbnVtYmVyOiAnYWxsLWJ1dC1sYXN0Jywgcm9sZTogJ2FueXRoaW5nJyBhcyBhbnkgfV0sIGNzNClcbi8vIGNvbnN0IHg0MCA9IHBhcnNlVHJ5KFsnaWRlbnRpZmllciddLCBjczQpXG4vLyBjb25zb2xlLmxvZyg0LCB4NCwgeDQwKVxuLy8gLy8gRVhBTVBMRSA1XG4vLyBjb25zdCBjczUgPSBnZXRDaGFyU3RyZWFtKCdkb2VzIG5vdCBtYWtlICcpIC8vIGRvZXMgbm90IG1ha2UgLy8gaXMgbm90XG4vLyBjb25zdCB4NSA9IHBhcnNlVHJ5KFsndmVyYiddLCBjczUpXG4vLyBjb25zb2xlLmxvZyg1LCB4NSlcblxuXG4vLyBjb25zdCBwYXJzZXIgPSBnZXRQYXJzZXIoJzEyMScsIHN5bnRheGVzKVxuLy8gY29uc29sZS5sb2cocGFyc2VyLnBhcnNlKCkpXG5cbi8vIGNvbnN0IHN5bnRheExpc3QgPSBPYmplY3Qua2V5cyhzeW50YXhlcykgYXMgQXN0VHlwZVtdXG4vLyBzeW50YXhMaXN0LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgc3ludGF4ZXMpKVxuLy8gY29uc29sZS5sb2coc3ludGF4TGlzdClcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBjb25zdCB4ID0gZ2V0UGFyc2VyKCdiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdldmVyeSBiYWQgYmx1ZSBiaXJkJywgc3ludGF4ZXMpLnBhcnNlKClcbi8vIGNvbnNvbGUubG9nKHgxKVxuXG4vLyBjb25zdCB4MiA9IGdldFBhcnNlcignYmFkIGJsdWUgYmlyZHMnLCBzeW50YXhlcykucGFyc2UoKSAvL1BST0JMRU0hXG4vLyBjb25zb2xlLmxvZyh4MilcblxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2JhZCBibHVlIGJpcmQgb2YgdGhlIHggJywgc3ludGF4ZXMpLnBhcnNlKCkgLy9QUk9CTEVNIVxuLy8gY29uc29sZS5sb2coeDMpXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCd4IG9mIHknLCBzeW50YXhlcykucGFyc2VUcnkoWydub3VuLXBocmFzZSddKVxuLy8gY29uc29sZS5sb2coeDEpXG5cbi8vIGNvbnNvbGUubG9nKHgxKVxuXG5cbi8vIGNvbnN0IHgxID0gZ2V0UGFyc2VyKCdiYWQgYnVydWYgb2YgaG91c2Ugb2YgbWUnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDIgPSBnZXRQYXJzZXIoJ2JhZCBwZXJzb24nLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc3QgeDMgPSBnZXRQYXJzZXIoJ2V2ZXJ5IHggaXMgY2FwcmEgYnkgeScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ3NpbXBsZS1zZW50ZW5jZSddKVxuXG4vLyBjb25zb2xlLmxvZyh4MSlcbi8vIGNvbnNvbGUubG9nKHgyKVxuLy8gY29uc29sZS5sb2coeDMpXG5cblxuLy8gcHJvYmxlbSB3aXRoIG11bHRpcGxlIG1vZGlmaWVycyFcbmNvbnN0IHg0ID0gZ2V0UGFyc2VyKCd0aGUgYmFkIGNhcHJhcyBvZiByaXZhbmF6emFubyBvZiBsb21iYXJkaWEgYXJlIGJ1cnVmJywgc3ludGF4ZXMpLnBhcnNlKClcbmNvbnNvbGUubG9nKHg0KSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==