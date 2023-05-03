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
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
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
        { types: ['expression'], role: 'subject', number: '1|0' },
        { types: ['space'] },
        { types: ['verb'], expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['expression'], role: 'object', number: '1|0' },
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
        this.keywords = (0, uniq_1.uniq)(Object.values(this.syntaxes).flatMap(x => x.flatMap(x => { var _a; return (_a = x.literals) !== null && _a !== void 0 ? _a : []; })).filter(x => x.length > 1));
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
            const node = this.parseMemberRepeated(member, top);
            if (!node && (0, csts_1.isNecessary)(member.number)) {
                // console.log(syntaxName, 'failed because', member, 'was not found!')
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
        }
        return ast;
    }
    parseMemberRepeated(member, top = 0) {
        // isNecessary has already been taken care of
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const list = [];
        let memento = this.cs.getPos();
        while (!this.cs.isEnd()) {
            // memento = this.cs.getPos()
            const st = this.parseMemberSingle(member, top);
            if (!st && !list.length) {
                // console.log(top, 'parseMemberRepeated did not find=', member.role??member.literals??member.types, 'pos=', this.cs.getPos())
                return undefined;
            }
            if (!st) {
                break;
            }
            if (!(0, csts_1.isRepeatable)(member.number)) {
                console.log(top, 'parseMemberRepeated found a single=', (_b = (_a = member.role) !== null && _a !== void 0 ? _a : member.literals) !== null && _b !== void 0 ? _b : member.types, 'pos=', this.cs.getPos());
                return st;
            }
            list.push(st);
            // if (member.sep) {
            //     console.log(top, 'parseMemberRepeated before skipping a separator=','pos=', this.cs.getPos())
            //     this.parseMemberSingle({ types: [member.sep] }, top)
            //     console.log(top, 'parseMemberRepeated skipped a separator=', member.role??member.literals??member.types, 'pos=', this.cs.getPos())
            // }
        }
        if (member.number === 'all-but-last' /* && (list.length > 1) */) { // 
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
        // const result = list.length ? list : undefined
        // return result
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
        const result = (0, first_1.first)(member.literals, x => this.parseLiteralSingle(x, top));
        return result;
    }
    parseLiteralSingle(literal, top = 0) {
        const memento = this.cs.getPos();
        for (const x of literal) {
            if (x !== this.cs.peek()) {
                this.cs.backTo(memento);
                return undefined;
            }
            this.cs.next();
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
// const x1 = getParser('buruf of house of me', syntaxes).parseTry(['noun-phrase'])
const x1 = (0, parser_1.getParser)('bad person', csts_1.syntaxes).parseTry(['noun-phrase']);
console.log(x1);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MEdBQXNEO0FBQ3RELHFFQUFxRTtBQUVyRSxTQUFTO0FBSVQsZ0JBQWdCO0FBQ2hCLDRDQUE0QztBQUM1QywrQ0FBK0M7QUFDL0Msc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUMzQyw2QkFBNkI7QUFDN0IsZUFBZTtBQUNmLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCLGVBQWU7QUFDZix5Q0FBeUM7QUFDekMsd0NBQXdDO0FBQ3hDLHFCQUFxQjtBQUNyQixlQUFlO0FBQ2YsMkNBQTJDO0FBQzNDLCtDQUErQztBQUMvQyxxQkFBcUI7QUFDckIsZUFBZTtBQUNmLGdEQUFnRDtBQUNoRCwwSEFBMEg7QUFDMUgsNENBQTRDO0FBQzVDLDBCQUEwQjtBQUMxQixlQUFlO0FBQ2YseUVBQXlFO0FBQ3pFLHFDQUFxQztBQUNyQyxxQkFBcUI7QUFHckIsNENBQTRDO0FBQzVDLDhCQUE4QjtBQUU5Qix3REFBd0Q7QUFDeEQsMkRBQTJEO0FBQzNELDBCQUEwQjtBQUUxQiw4QkFBOEI7QUFDOUIseURBQXlEO0FBQ3pELGlCQUFpQjtBQUVqQixnRUFBZ0U7QUFDaEUsa0JBQWtCO0FBRWxCLHNFQUFzRTtBQUN0RSxrQkFBa0I7QUFFbEIsK0VBQStFO0FBQy9FLGtCQUFrQjtBQUVsQixxRUFBcUU7QUFDckUsa0JBQWtCO0FBRWxCLGtCQUFrQjtBQUdsQixtRkFBbUY7QUFDbkYsTUFBTSxFQUFFLEdBQUcsc0JBQVMsRUFBQyxZQUFZLEVBQUUsZUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jaGFyLXN0cmVhbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL25ldy1mcm9udGVuZC9jc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL21heC1wcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbmV3LWZyb250ZW5kL3BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ZpcnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBDaGFyU3RyZWFtIHtcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGhlIG5leHQgY2hhcmFjdGVyIGlmIGFueS5cbiAgICAgKi9cbiAgICBuZXh0KCk6IHZvaWRcbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBwZWVrKCk6IHN0cmluZ1xuICAgIC8qKlxuICAgICAqIEdvIGJhY2suXG4gICAgICovXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRQb3MoKTogbnVtYmVyXG4gICAgLyoqXG4gICAgICogUmVhY2hlZCBlbmQgb2YgY2hhcnN0cmVhbS5cbiAgICAgKi9cbiAgICBpc0VuZCgpOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaGFyU3RyZWFtKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgQmFzZUNoYXJTdHJlYW0oc291cmNlQ29kZSlcbn1cblxuY2xhc3MgQmFzZUNoYXJTdHJlYW0gaW1wbGVtZW50cyBDaGFyU3RyZWFtIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCBwb3MgPSAwLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFbmQoKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBvcysrXG4gICAgfVxuXG4gICAgcGVlaygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VDb2RlW3RoaXMucG9zXVxuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldFBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NcbiAgICB9XG5cbiAgICBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMuc291cmNlQ29kZS5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIFN5bnRheCA9IE1lbWJlcltdIC8vIENzdE1vZGVsXG5cblxuZXhwb3J0IGNvbnN0IHJvbGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ2lkJyxcbiAgICAnZGlnaXRzJyxcbiAgICAnY2hhcnMnLFxuICAgICdwbHVyYWxpemVyJyxcbiAgICAnYW5hcGhvcmFPcGVyYXRvcicsXG4gICAgJ25ld09wZXJhdG9yJyxcbiAgICAnbW9kaWZpZXJzJyxcbiAgICAnaGVhZCcsXG4gICAgJ2xpbWl0S2V5d29yZCcsXG4gICAgJ2xpbWl0TnVtYmVyJyxcbiAgICAnbGVmdE9wZXJhbmQnLFxuICAgICdyaWdodE9wZXJhbmQnLFxuICAgICdvcGVyYXRvcicsXG4gICAgJ293bmVyJyxcbiAgICAnb2JqZWN0JyxcbiAgICAncmVjZWl2ZXInLFxuICAgICdpbnN0cnVtZW50JyxcbiAgICAnc3ViamVjdCcsXG4gICAgJ3ZlcmInLFxuICAgICduZWdhdGlvbicsXG4gICAgJ2NvbmRpdGlvbicsXG4gICAgJ2NvbnNlcXVlbmNlJyxcbiAgICAnc3Vib3JkaW5hdGluZy1jb25qdW5jdGlvbicsIC8vIEJBRFxuKVxuXG5leHBvcnQgdHlwZSBSb2xlID0gRWxlbWVudFR5cGU8dHlwZW9mIHJvbGVzPlxuXG5cbnR5cGUgQmFzZU1lbWJlciA9IHtcbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eSAvLyBubyBudW1iZXIgLS0tPiAxXG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGUgLy8gbm8gcm9sZSAtLT4gZXhjbHVkZSBmcm9tIGFzdFxuICAgIHJlYWRvbmx5IHNlcD86IEFzdFR5cGVcbiAgICByZWFkb25seSBleHBhbmQ/OiBib29sZWFuXG5cbiAgICByZWFkb25seSByZWR1Y2U/OiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIExpdGVyYWxNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IGxpdGVyYWxzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHR5cGVzPzogdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgYW55Q2hhckV4Y2VwdEZvcj86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgZXhwYW5kPzogdW5kZWZpbmVkXG59XG5cbmV4cG9ydCB0eXBlIFR5cGVNZW1iZXIgPSBCYXNlTWVtYmVyICYge1xuICAgIHJlYWRvbmx5IHR5cGVzOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBsaXRlcmFscz86IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXIgPSBMaXRlcmFsTWVtYmVyIHwgVHlwZU1lbWJlclxuXG5leHBvcnQgdHlwZSBBc3RUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGFzdFR5cGVzPlxuXG5leHBvcnQgY29uc3QgYXN0VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnc3BhY2UnLFxuICAgICdpZGVudGlmaWVyJyxcbiAgICAnc3RyaW5nLWxpdGVyYWwnLFxuICAgICdudW1iZXItbGl0ZXJhbCcsXG4gICAgJ2V4cHJlc3Npb24nLCAvLyBhbmQtZXhwcmVzc2lvblxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnLFxuICAgICdzaW1wbGUtc2VudGVuY2UnLFxuICAgICdnZW5pdGl2ZScsXG4gICAgJ2RhdGl2ZScsXG4gICAgJ2luc3RydW1lbnRhbCcsXG4gICAgJ3ZlcmInLFxuICAgICdjb3B1bGEnLFxuICAgICdkby12ZXJiJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nLFxuXG5cbiAgICAvLyAnZ2VuaXRpdmUtZXhwcmVzc2lvbicsXG4pXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgJ2FsbC1idXQtbGFzdCdcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4gICAgfHwgYyA9PT0gJ2FsbC1idXQtbGFzdCdcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFt4IGluIEFzdFR5cGVdOiBTeW50YXggfSA9IHtcblxuICAgIHNwYWNlOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIGxpdGVyYWxzOiBbJyAnLCAnXFxuJywgJ1xcdCddIH1cbiAgICBdLFxuICAgIGlkZW50aWZpZXI6IFtcbiAgICAgICAgeyBudW1iZXI6ICcrJywgcm9sZTogJ2lkJywgcmVkdWNlOiB0cnVlLCBsaXRlcmFsczogWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JywgJ3cnLCAneCcsICd5JywgJ3onXSB9XG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbnVtYmVyOiAnKycsIHJvbGU6ICdkaWdpdHMnLCByZWR1Y2U6IHRydWUsIGxpdGVyYWxzOiBbJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSB9XG4gICAgXSxcbiAgICAnc3RyaW5nLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnXCInXSB9LFxuICAgICAgICB7IGFueUNoYXJFeGNlcHRGb3I6IFsnXCInXSwgbGl0ZXJhbHM6IFtdLCByb2xlOiAnY2hhcnMnLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ1wiJ10gfSxcbiAgICBdLFxuICAgICdub3VuLXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydldmVyeScsICdhbnknXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3RoZScsICdvbGQnXSwgcm9sZTogJ2FuYXBob3JhT3BlcmF0b3InLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ2EnLCAnYW4nLCAnbmV3J10sIHJvbGU6ICduZXdPcGVyYXRvcicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbGltaXQtcGhyYXNlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydpZGVudGlmaWVyJ10sIHJvbGU6ICdtb2RpZmllcnMnLCBzZXA6ICdzcGFjZScsIG51bWJlcjogJ2FsbC1idXQtbGFzdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllcicsICdzdHJpbmctbGl0ZXJhbCcsICdudW1iZXItbGl0ZXJhbCddLCByb2xlOiAnaGVhZCcsIG51bWJlcjogMSB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJ3MnXSwgcm9sZTogJ3BsdXJhbGl6ZXInLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dlbml0aXZlJ10sIGV4cGFuZDogdHJ1ZSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2xpbWl0LXBocmFzZSc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydmaXJzdCcsICdsYXN0J10sIHJvbGU6ICdsaW1pdEtleXdvcmQnLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbnVtYmVyLWxpdGVyYWwnXSwgcm9sZTogJ2xpbWl0TnVtYmVyJywgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG5cbiAgICAvLyAnZ2VuaXRpdmUtZXhwcmVzc2lvbicgOiBbXG4gICAgLy8gICAgIHt0eXBlcyA6IFsnbm91bi1waHJhc2UnXSwgcm9sZSA6ICdpZCd9LC8vVE9ET09PT08hXG4gICAgLy8gICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgIC8vICAgICB7bGl0ZXJhbHMgOiBbJ29mJ10gfSxcbiAgICAvLyAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgLy8gICAgIHt0eXBlcyA6IFsnbm91bi1waHJhc2UnXSwgcm9sZSA6ICdvd25lcid9LFxuICAgIC8vIF0sXG5cbiAgICAnbWF0aC1leHByZXNzaW9uJzogW1xuICAgICAgICAvLyB7IHR5cGVzOiBbJ2dlbml0aXZlLWV4cHJlc3Npb24nXSwgcm9sZTogJ2xlZnRPcGVyYW5kJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IGxpdGVyYWxzOiBbJysnLCAnLScsICcqJywgJy8nXSwgcm9sZTogJ29wZXJhdG9yJywgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgLy8geyB0eXBlczogWydnZW5pdGl2ZS1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmlnaHRPcGVyYW5kJywgbnVtYmVyOiAnMXwwJyB9XG5cbiAgICBdLFxuICAgIFwiZXhwcmVzc2lvblwiOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdsZWZ0T3BlcmFuZCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnYW5kJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWF0aC1leHByZXNzaW9uJ10sIHJvbGU6ICdyaWdodE9wZXJhbmQnLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG4gICAgJ2dlbml0aXZlJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ29mJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91bi1waHJhc2UnXSwgcm9sZTogJ293bmVyJywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdkYXRpdmUnOiBbXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndG8nXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NwYWNlJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydub3VuLXBocmFzZSddLCByb2xlOiAncmVjZWl2ZXInLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuXG4gICAgJ2luc3RydW1lbnRhbCc6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydieSddIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4tcGhyYXNlJ10sIHJvbGU6ICdpbnN0cnVtZW50JywgbnVtYmVyOiAxIH0sXG4gICAgXSxcblxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2RhdGl2ZScsICdpbnN0cnVtZW50YWwnXSwgZXhwYW5kOiB0cnVlLCBudW1iZXI6IDEgfVxuICAgIF0sXG5cbiAgICAnc2ltcGxlLXNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ3N1YmplY3QnLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3ZlcmInXSwgZXhwYW5kOiB0cnVlIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc3BhY2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2V4cHJlc3Npb24nXSwgcm9sZTogJ29iamVjdCcsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonLCBleHBhbmQ6IHRydWUgfSxcbiAgICBdLFxuXG4gICAgdmVyYjogW1xuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYScsICdkby12ZXJiJ10sIGV4cGFuZDogdHJ1ZSB9XG4gICAgXSxcblxuICAgICdkby12ZXJiJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2RvZXMnLCAnZG8nXSB9LCAvLyBvcmRlciBtYXR0ZXJzISBzdXBlcnN0cmluZyBmaXJzdCFcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydzcGFjZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnaWRlbnRpZmllciddLCByb2xlOiAndmVyYicgfVxuICAgIF0sXG5cbiAgICBjb3B1bGE6IFtcbiAgICAgICAgeyBsaXRlcmFsczogWydpcycsICdiZScsICdhcmUnXSwgcm9sZTogJ3ZlcmInIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsnbm90J10sIHJvbGU6ICduZWdhdGlvbicsIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnY29tcGxleC1zZW50ZW5jZS1vbmUnLCAnY29tcGxleC1zZW50ZW5jZS10d28nXSwgZXhwYW5kOiB0cnVlIH1cbiAgICBdLFxuXG4gICAgJ2NvbXBsZXgtc2VudGVuY2Utb25lJzogW1xuICAgICAgICB7IGxpdGVyYWxzOiBbJ2lmJywgJ3doZW4nXSwgcm9sZTogJ3N1Ym9yZGluYXRpbmctY29uanVuY3Rpb24nIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25kaXRpb24nIH0sXG4gICAgICAgIHsgbGl0ZXJhbHM6IFsndGhlbicsICcsJ10gfSxcbiAgICAgICAgeyB0eXBlczogWydzaW1wbGUtc2VudGVuY2UnXSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIF0sXG5cbiAgICAnY29tcGxleC1zZW50ZW5jZS10d28nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnc2ltcGxlLXNlbnRlbmNlJ10sIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyBsaXRlcmFsczogWydpZicsICd3aGVuJ10sIHJvbGU6ICdzdWJvcmRpbmF0aW5nLWNvbmp1bmN0aW9uJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3NpbXBsZS1zZW50ZW5jZSddLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIF1cbn0iLCJpbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi9jc3RzXCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQXN0VHlwZSwgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGVzID8/IFtdKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQXN0VHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzeW50YXhlczogeyBbeCBpbiBBc3RUeXBlXTogU3ludGF4IH0pID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgZmlyc3QgfSBmcm9tIFwiLi4vdXRpbHMvZmlyc3RcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgZ2V0Q2hhclN0cmVhbSB9IGZyb20gXCIuL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlLCBMaXRlcmFsTWVtYmVyLCBNZW1iZXIsIFJvbGUsIFN5bnRheCwgQXN0VHlwZSwgcm9sZXMgfSBmcm9tIFwiLi9jc3RzXCI7XG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4vbWF4LXByZWNlZGVuY2VcIjtcblxudHlwZSBBc3ROb2RlID1cbiAgICBzdHJpbmdcbiAgICB8IHN0cmluZ1tdXG4gICAgfCBBc3ROb2RlW11cbiAgICB8IHsgW3ggaW4gUm9sZV0/OiBBc3ROb2RlIH1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2Uoc291cmNlQ29kZTogc3RyaW5nKTogQXN0Tm9kZSB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9KSB7XG4gICAgcmV0dXJuIG5ldyBLb29sZXJQYXJzZXIoc291cmNlQ29kZSwgc3ludGF4ZXMpXG59XG5cbmNsYXNzIEtvb2xlclBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICByZWFkb25seSBzeW50YXhMaXN0ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhlcykgYXMgQXN0VHlwZVtdXG4gICAgcmVhZG9ubHkga2V5d29yZHMgPSB1bmlxKE9iamVjdC52YWx1ZXModGhpcy5zeW50YXhlcykuZmxhdE1hcCh4ID0+IHguZmxhdE1hcCh4ID0+IHgubGl0ZXJhbHMgPz8gW10pKS5maWx0ZXIoeCA9PiB4Lmxlbmd0aCA+IDEpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgc3ludGF4ZXM6IHsgW3ggaW4gQXN0VHlwZV06IFN5bnRheCB9LFxuICAgICAgICByZWFkb25seSBjcyA9IGdldENoYXJTdHJlYW0oc291cmNlQ29kZSksXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdC5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHN5bnRheGVzKSlcbiAgICB9XG5cbiAgICBwYXJzZSgpOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VUcnkodGhpcy5zeW50YXhMaXN0KVxuICAgIH1cblxuICAgIHBhcnNlVHJ5KHN5bnRheExpc3Q6IEFzdFR5cGVbXSwgdG9wID0gMCkge1xuXG4gICAgICAgIGZvciAoY29uc3Qgc3ludGF4TmFtZSBvZiBzeW50YXhMaXN0KSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3RyeSBwYXJzaW5nIHN5bnRheE5hbWU9Jywgc3ludGF4TmFtZSlcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuc3ludGF4ZXNbc3ludGF4TmFtZV0gLy8gc3RhdGUhXG4gICAgICAgICAgICBjb25zdCB0cmVlID0gdGhpcy5wYXJzZVN5bnRheChzeW50YXgsIHN5bnRheE5hbWUsIHRvcClcblxuICAgICAgICAgICAgaWYgKHRyZWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJlZSAvL3sgLi4udHJlZSwgdHlwZTogc3ludGF4TmFtZSB9IGFzIFN5bnRheFRyZWUgLy8gcmVtb3ZlIGNhc3QgLy8gVE9ETzogYWRkIHR5cGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcGFyc2VTeW50YXgoc3ludGF4OiBTeW50YXgsIHN5bnRheE5hbWU6IEFzdFR5cGUsIHRvcCA9IDApOiBBc3ROb2RlIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBhc3Q6IEFzdE5vZGUgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIHN5bnRheCkge1xuXG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5wYXJzZU1lbWJlclJlcGVhdGVkKG1lbWJlciwgdG9wKVxuXG4gICAgICAgICAgICBpZiAoIW5vZGUgJiYgaXNOZWNlc3NhcnkobWVtYmVyLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzeW50YXhOYW1lLCAnZmFpbGVkIGJlY2F1c2UnLCBtZW1iZXIsICd3YXMgbm90IGZvdW5kIScpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAnc3ludGF4TmFtZT0nLCBzeW50YXhOYW1lLCAnZmFpbGVkIGJlY2F1c2UgcmVxdWlyZWQnLCBtZW1iZXIucm9sZT8/bWVtYmVyLmxpdGVyYWxzPz9tZW1iZXIudHlwZXMsICdpcyBtaXNzaW5nJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBhbmQgaXNOZWNlc3Nhcnk9ZmFsc2VcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdzeW50YXhOYW1lPScsIHN5bnRheE5hbWUsICd1bnJlcXVpcmVkJywgbWVtYmVyLnJvbGU/P21lbWJlci5saXRlcmFscz8/bWVtYmVyLnR5cGVzLCAnbm90IGZvdW5kLCBpZ25vcmVkJywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIucm9sZSAmJiBtZW1iZXIuZXhwYW5kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBhbmRpbmcgbWVtYmVyIHdpdGggcm9sZSBjdXJyZW50bHkgbm90IHN1cHBvcnRlZCEnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVtYmVyLnJlZHVjZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIucm9sZSkge1xuICAgICAgICAgICAgICAgIGFzdFttZW1iZXIucm9sZV0gPSBub2RlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZW1iZXIuZXhwYW5kICYmICEobm9kZSBpbnN0YW5jZW9mIEFycmF5KSkgeyAvLyBkaWN0aW9uYXJ5IGFzdCBjYXNlXG4gICAgICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG5vZGUpXG4gICAgICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGUgPT4gcm9sZXMuaW5jbHVkZXMoZVswXSBhcyBSb2xlKSAmJiAoYXN0W2VbMF0gYXMgUm9sZV0gPSBlWzFdKSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzdFxuICAgIH1cblxuICAgIHBhcnNlTWVtYmVyUmVwZWF0ZWQobWVtYmVyOiBNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgQXN0Tm9kZVtdIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gaXNOZWNlc3NhcnkgaGFzIGFscmVhZHkgYmVlbiB0YWtlbiBjYXJlIG9mXG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cbiAgICAgICAgbGV0IG1lbWVudG8gPSB0aGlzLmNzLmdldFBvcygpXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmNzLmlzRW5kKCkpIHtcblxuICAgICAgICAgICAgLy8gbWVtZW50byA9IHRoaXMuY3MuZ2V0UG9zKClcbiAgICAgICAgICAgIGNvbnN0IHN0ID0gdGhpcy5wYXJzZU1lbWJlclNpbmdsZShtZW1iZXIsIHRvcClcblxuICAgICAgICAgICAgaWYgKCFzdCAmJiAhbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIGRpZCBub3QgZmluZD0nLCBtZW1iZXIucm9sZT8/bWVtYmVyLmxpdGVyYWxzPz9tZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtZW1iZXIubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ3BhcnNlTWVtYmVyUmVwZWF0ZWQgZm91bmQgYSBzaW5nbGU9JywgbWVtYmVyLnJvbGU/P21lbWJlci5saXRlcmFscz8/bWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaChzdClcblxuICAgICAgICAgICAgLy8gaWYgKG1lbWJlci5zZXApIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIGJlZm9yZSBza2lwcGluZyBhIHNlcGFyYXRvcj0nLCdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnBhcnNlTWVtYmVyU2luZ2xlKHsgdHlwZXM6IFttZW1iZXIuc2VwXSB9LCB0b3ApXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBza2lwcGVkIGEgc2VwYXJhdG9yPScsIG1lbWJlci5yb2xlPz9tZW1iZXIubGl0ZXJhbHM/P21lbWJlci50eXBlcywgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWVtYmVyLm51bWJlciA9PT0gJ2FsbC1idXQtbGFzdCcgLyogJiYgKGxpc3QubGVuZ3RoID4gMSkgKi8pIHsgLy8gXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ2hhdmUgdG8gYmFja3RyYWNrLCBvbGQgbGlzdCBsZW49JywgbGlzdC5sZW5ndGgsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcblxuICAgICAgICAgICAgbGlzdC5wb3AoKVxuICAgICAgICAgICAgdGhpcy5jcy5iYWNrVG8obWVtZW50bylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvcCwgJ2JhY2t0cmFjaywgcGFyc2VNZW1iZXJSZXBlYXRlZCBwb3AgZnJvbSBsaXN0IG9mPScsIG1lbWJlci5yb2xlPz9tZW1iZXIubGl0ZXJhbHM/P21lbWJlci50eXBlcywgJ25ldyBsaXN0IGxlbj0nLCBsaXN0Lmxlbmd0aCwgJ3Bvcz0nLCB0aGlzLmNzLmdldFBvcygpKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codG9wLCAncGFyc2VNZW1iZXJSZXBlYXRlZCBlbXB0eSBsaXN0IGZvcj0nLCBtZW1iZXIucm9sZT8/bWVtYmVyLmxpdGVyYWxzPz9tZW1iZXIudHlwZXMsICdwb3M9JywgdGhpcy5jcy5nZXRQb3MoKSlcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZW1iZXIucmVkdWNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdwYXJzZU1lbWJlclJlcGVhdGVkIGZvdW5kIG9rIGxpc3QgZm9yPScsIG1lbWJlci5yb2xlPz9tZW1iZXIubGl0ZXJhbHM/P21lbWJlci50eXBlcywgJ2xpc3Q9JywgbGlzdC50b1N0cmluZygpICwncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICByZXR1cm4gbGlzdC5tYXAoeCA9PiB4LnRvU3RyaW5nKCkpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zdCByZXN1bHQgPSBsaXN0Lmxlbmd0aCA/IGxpc3QgOiB1bmRlZmluZWRcbiAgICAgICAgLy8gcmV0dXJuIHJlc3VsdFxuICAgICAgICByZXR1cm4gbGlzdFxuICAgIH1cblxuICAgIHBhcnNlTWVtYmVyU2luZ2xlKG1lbWJlcjogTWVtYmVyLCB0b3AgPSAwKTogQXN0Tm9kZSB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIGRvZXNuJ3QgaGF2ZSB0byB0YWtlIGNhcmUgYWJvdXQgbnVtYmVyXG5cbiAgICAgICAgaWYgKG1lbWJlci5saXRlcmFscykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaXRlcmFsKG1lbWJlciwgdG9wKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5wYXJzZVRyeShtZW1iZXIudHlwZXMsIHRvcCArIDEpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmtleXdvcmRzLmluY2x1ZGVzKHJlc3VsdCBhcyBzdHJpbmcpKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b3AsICdyZXR1cm5pbmcgdW5kZWZpbmVkIGJlY2F1c2UgYSBrZXl3b3JkIGlzIGJlaW5nIHRyYXRlZCBhcyBpZGVudGlmaWVyISBmb3I9JywgbWVtYmVyLnJvbGU/P21lbWJlci5saXRlcmFscz8/bWVtYmVyLnR5cGVzLCAncG9zPScsIHRoaXMuY3MuZ2V0UG9zKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbChtZW1iZXI6IExpdGVyYWxNZW1iZXIsIHRvcCA9IDApOiBBc3ROb2RlIHwgc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgY2hhciA9IHRoaXMuY3MucGVlaygpXG5cbiAgICAgICAgaWYgKG1lbWJlci5hbnlDaGFyRXhjZXB0Rm9yICYmICFtZW1iZXIuYW55Q2hhckV4Y2VwdEZvci5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICAgICAgdGhpcy5jcy5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiBjaGFyXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBmaXJzdChtZW1iZXIubGl0ZXJhbHMsIHggPT4gdGhpcy5wYXJzZUxpdGVyYWxTaW5nbGUoeCwgdG9wKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHBhcnNlTGl0ZXJhbFNpbmdsZShsaXRlcmFsOiBzdHJpbmcsIHRvcCA9IDApIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5jcy5nZXRQb3MoKVxuXG4gICAgICAgIGZvciAoY29uc3QgeCBvZiBsaXRlcmFsKSB7XG5cbiAgICAgICAgICAgIGlmICh4ICE9PSB0aGlzLmNzLnBlZWsoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3MuYmFja1RvKG1lbWVudG8pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNzLm5leHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpdGVyYWxcbiAgICB9XG5cbn1cblxuIiwiLyoqXG4gKiBcbiAqIEFwcGx5IHByZWRpY2F0ZSB0byBlYWNoIGVsZW1lbnQgZSBpbiB0aGUgaXRlcmFibGUsIHN0b3Agd2hlbiBcbiAqIHlvdSBmaW5kIGEgbm9uLW51bGxpc2ggaW1hZ2Ugb2YgZSwgYW5kIHJldHVybiB0aGUgaW1hZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdDxULCBVPihpdGVyYWJsZTogVFtdLCBwcmVkaWNhdGU6ICh4OiBUKSA9PiBVKTogVSB8IHVuZGVmaW5lZCB7XG5cbiAgICBmb3IgKGNvbnN0IGUgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgY29uc3QgbWF5YmVSZXN1bHQgPSBwcmVkaWNhdGUoZSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKG1heWJlUmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgbWF5YmVSZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXliZVJlc3VsdFxuICAgICAgICB9XG4gICAgfVxuXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgY29uc3Qgc2VlbjogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCB7IGdldENoYXJTdHJlYW0gfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL2NoYXItc3RyZWFtXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBzeW50YXhlcyB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvY3N0c1wiO1xuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvbWF4LXByZWNlZGVuY2VcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuL3NyYy9uZXctZnJvbnRlbmQvcGFyc2VyXCI7XG4vLyBpbXBvcnQgeyBwYXJzZVN5bnRheCwgcGFyc2VUcnkgfSBmcm9tIFwiLi9zcmMvbmV3LWZyb250ZW5kL3BhcnNlclwiO1xuXG4vLyBtYWluKClcblxuXG5cbi8vIC8vIEVYQU1QTEUgMCBcbi8vIGNvbnN0IGNzMCA9IGdldENoYXJTdHJlYW0oJzEyICAgIG1vbmRvICcpXG4vLyBjb25zdCB4MCA9IHBhcnNlVHJ5KFsnbnVtYmVyLWxpdGVyYWwnXSwgY3MwKVxuLy8gY29uc3QgeTAgPSBwYXJzZVRyeShbJ3NwYWNlJ10sIGNzMClcbi8vIGNvbnN0IHowID0gcGFyc2VUcnkoWydpZGVudGlmaWVyJ10sIGNzMClcbi8vIGNvbnNvbGUubG9nKDAsIHgwLCB5MCwgejApXG4vLyAvLyBFWEFNUExFIDFcbi8vIGNvbnN0IGNzID0gZ2V0Q2hhclN0cmVhbSgnMTIgICAgbW9uZG8gJylcbi8vIGNvbnN0IHggPSBwYXJzZVRyeShbJ251bWJlci1saXRlcmFsJ10sIGNzKVxuLy8gY29uc29sZS5sb2coMSwgeClcbi8vIC8vIEVYQU1QTEUgMlxuLy8gY29uc3QgY3MyID0gZ2V0Q2hhclN0cmVhbSgnZG8gIG1ha2UgJylcbi8vIGNvbnN0IHgyID0gcGFyc2VUcnkoWydkby12ZXJiJ10sIGNzMilcbi8vIGNvbnNvbGUubG9nKDIsIHgyKVxuLy8gLy8gRVhBTVBMRSAzXG4vLyBjb25zdCBjczMgPSBnZXRDaGFyU3RyZWFtKCdcIiBjaWFvIFwieHh4Jylcbi8vIGNvbnN0IHgzID0gcGFyc2VUcnkoWydzdHJpbmctbGl0ZXJhbCddLCBjczMpXG4vLyBjb25zb2xlLmxvZygzLCB4Mylcbi8vIC8vIEVYQU1QTEUgNFxuLy8gY29uc3QgY3M0ID0gZ2V0Q2hhclN0cmVhbSgnY2lhbyBtb25kbyBidXJ1ZicpXG4vLyBjb25zdCB4NCA9IHBhcnNlU3ludGF4KFt7IHR5cGVzOiBbJ2lkZW50aWZpZXInXSwgc2VwOiAnc3BhY2UnLCBudW1iZXI6ICdhbGwtYnV0LWxhc3QnLCByb2xlOiAnYW55dGhpbmcnIGFzIGFueSB9XSwgY3M0KVxuLy8gY29uc3QgeDQwID0gcGFyc2VUcnkoWydpZGVudGlmaWVyJ10sIGNzNClcbi8vIGNvbnNvbGUubG9nKDQsIHg0LCB4NDApXG4vLyAvLyBFWEFNUExFIDVcbi8vIGNvbnN0IGNzNSA9IGdldENoYXJTdHJlYW0oJ2RvZXMgbm90IG1ha2UgJykgLy8gZG9lcyBub3QgbWFrZSAvLyBpcyBub3Rcbi8vIGNvbnN0IHg1ID0gcGFyc2VUcnkoWyd2ZXJiJ10sIGNzNSlcbi8vIGNvbnNvbGUubG9nKDUsIHg1KVxuXG5cbi8vIGNvbnN0IHBhcnNlciA9IGdldFBhcnNlcignMTIxJywgc3ludGF4ZXMpXG4vLyBjb25zb2xlLmxvZyhwYXJzZXIucGFyc2UoKSlcblxuLy8gY29uc3Qgc3ludGF4TGlzdCA9IE9iamVjdC5rZXlzKHN5bnRheGVzKSBhcyBBc3RUeXBlW11cbi8vIHN5bnRheExpc3Quc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCBzeW50YXhlcykpXG4vLyBjb25zb2xlLmxvZyhzeW50YXhMaXN0KVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGNvbnN0IHggPSBnZXRQYXJzZXIoJ2JhZCBibHVlIGJpcmQnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc29sZS5sb2coeClcblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ2V2ZXJ5IGJhZCBibHVlIGJpcmQnLCBzeW50YXhlcykucGFyc2UoKVxuLy8gY29uc29sZS5sb2coeDEpXG5cbi8vIGNvbnN0IHgyID0gZ2V0UGFyc2VyKCdiYWQgYmx1ZSBiaXJkcycsIHN5bnRheGVzKS5wYXJzZSgpIC8vUFJPQkxFTSFcbi8vIGNvbnNvbGUubG9nKHgyKVxuXG4vLyBjb25zdCB4MyA9IGdldFBhcnNlcignYmFkIGJsdWUgYmlyZCBvZiB0aGUgeCAnLCBzeW50YXhlcykucGFyc2UoKSAvL1BST0JMRU0hXG4vLyBjb25zb2xlLmxvZyh4MylcblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ3ggb2YgeScsIHN5bnRheGVzKS5wYXJzZVRyeShbJ25vdW4tcGhyYXNlJ10pXG4vLyBjb25zb2xlLmxvZyh4MSlcblxuLy8gY29uc29sZS5sb2coeDEpXG5cblxuLy8gY29uc3QgeDEgPSBnZXRQYXJzZXIoJ2J1cnVmIG9mIGhvdXNlIG9mIG1lJywgc3ludGF4ZXMpLnBhcnNlVHJ5KFsnbm91bi1waHJhc2UnXSlcbmNvbnN0IHgxID0gZ2V0UGFyc2VyKCdiYWQgcGVyc29uJywgc3ludGF4ZXMpLnBhcnNlVHJ5KFsnbm91bi1waHJhc2UnXSlcbmNvbnNvbGUubG9nKHgxKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9