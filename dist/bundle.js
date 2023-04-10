/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __importDefault(__webpack_require__(/*! ./src/main/main */ "./app/src/main/main.ts"));
(0, main_1.default)();


/***/ }),

/***/ "./app/src/backend/BaseThing.ts":
/*!**************************************!*\
  !*** ./app/src/backend/BaseThing.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseThing = void 0;
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Clause_1 = __webpack_require__(/*! ../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
class BaseThing {
    constructor(id, bases = [], children = {}, lexemes = []) {
        this.id = id;
        this.bases = bases;
        this.children = children;
        this.lexemes = lexemes;
        this.extends = (thing) => {
            this.unextends(thing); // or avoid?
            this.bases.push(thing.clone());
        };
        this.get = (id) => {
            const parts = id.split('.');
            const p1 = parts[0];
            const child = this.children[p1];
            const res = parts.length > 1 ? child.get(parts.slice(1).join('.')) : child;
            return res !== null && res !== void 0 ? res : this.bases.find(x => x.get(id));
        };
        this.toClause = (query) => {
            const x = this.lexemes
                .flatMap(x => x.referents.map(r => (0, Clause_1.clauseOf)(x, r.getId())))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const y = Object
                .keys(this.children)
                .map(x => (0, Clause_1.clauseOf)({ root: 'of', type: 'preposition', referents: [] }, x, this.id)) // hardcoded english!
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const z = Object
                .values(this.children)
                .map(x => x.toClause(query))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            return x.and(y).and(z).simple;
        };
        this.setLexeme = (lexeme) => {
            const old = this.lexemes.filter(x => x.root === lexeme.root);
            const updated = old.map(x => (Object.assign(Object.assign(Object.assign({}, x), lexeme), { referents: [...x.referents, ...lexeme.referents] })));
            this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root);
            const toBeAdded = updated.length ? updated : [lexeme];
            this.lexemes.push(...toBeAdded);
            const extrapolated = toBeAdded.flatMap(x => (0, Lexeme_1.extrapolate)(x, this));
            this.lexemes.push(...extrapolated);
        };
        this.getLexeme = (rootOrToken) => {
            return this.lexemes
                .filter(x => rootOrToken === x.token || rootOrToken === x.root)
                .at(0);
        };
    }
    getId() {
        return this.id;
    }
    clone() {
        return new BaseThing(this.id, // clones have same id
        this.bases.map(x => x.clone()), Object.entries(this.children).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
    }
    unextends(thing) {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId());
    }
    set(id, thing) {
        this.children[id] = thing;
        this.setLexeme({ root: 'thing', type: 'noun', referents: [thing] }); // every thing is a thing
    }
    toJs() {
        return this; //TODOooooooooOO!
    }
    query(query) {
        return (0, uniq_1.uniq)(this.toClause(query).query(query, { /* it: this.lastReferenced  */}));
    }
}
exports.BaseThing = BaseThing;


/***/ }),

/***/ "./app/src/backend/BasicContext.ts":
/*!*****************************************!*\
  !*** ./app/src/backend/BasicContext.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicContext = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const macroToSyntax_1 = __webpack_require__(/*! ../frontend/parser/macroToSyntax */ "./app/src/frontend/parser/macroToSyntax.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../frontend/parser/maxPrecedence */ "./app/src/frontend/parser/maxPrecedence.ts");
class BasicContext extends BaseThing_1.BaseThing {
    constructor(id, config = (0, Config_1.getConfig)(), staticDescPrecedence = config.staticDescPrecedence, syntaxMap = config.syntaxes, lexemes = config.lexemes.flatMap(l => [l, ...(0, Lexeme_1.extrapolate)(l)]), bases = [], children = {}) {
        super(id, bases, children, lexemes);
        this.id = id;
        this.config = config;
        this.staticDescPrecedence = staticDescPrecedence;
        this.syntaxMap = syntaxMap;
        this.lexemes = lexemes;
        this.bases = bases;
        this.children = children;
        this.syntaxList = this.refreshSyntaxList();
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme((0, Lexeme_1.makeLexeme)({ type: 'noun', root: syntax.name, referents: [] }));
            this.syntaxMap[syntax.name] = syntax.syntax;
            this.syntaxList = this.refreshSyntaxList();
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
        this.astTypes.forEach(g => {
            this.setLexeme((0, Lexeme_1.makeLexeme)({
                root: g,
                type: 'noun',
                referents: [],
            }));
        });
    }
    getLexemeTypes() {
        return this.config.lexemeTypes;
    }
    getPrelude() {
        return this.config.prelude;
    }
    refreshSyntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.config.staticDescPrecedence.concat(z);
    }
    getSyntaxList() {
        return this.syntaxList;
    }
    get astTypes() {
        const res = this.config.lexemeTypes;
        res.push(...this.staticDescPrecedence);
        return res;
    }
    clone() {
        return new BasicContext(this.id, this.config, this.staticDescPrecedence, this.syntaxMap, this.lexemes, this.bases, this.children);
    }
}
exports.BasicContext = BasicContext;


/***/ }),

/***/ "./app/src/backend/Context.ts":
/*!************************************!*\
  !*** ./app/src/backend/Context.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContext = void 0;
const BasicContext_1 = __webpack_require__(/*! ./BasicContext */ "./app/src/backend/BasicContext.ts");
function getContext(opts) {
    return new BasicContext_1.BasicContext(opts.id);
}
exports.getContext = getContext;


/***/ }),

/***/ "./app/src/backend/InstructionThing.ts":
/*!*********************************************!*\
  !*** ./app/src/backend/InstructionThing.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstructionThing = void 0;
const getIncrementalId_1 = __webpack_require__(/*! ../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class InstructionThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super((0, getIncrementalId_1.getIncrementalId)());
        this.value = value;
    }
    toJs() {
        return this.value;
    }
}
exports.InstructionThing = InstructionThing;


/***/ }),

/***/ "./app/src/backend/NumberThing.ts":
/*!****************************************!*\
  !*** ./app/src/backend/NumberThing.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class NumberThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super(value + '');
        this.value = value;
    }
    toJs() {
        return this.value;
    }
}
exports.NumberThing = NumberThing;


/***/ }),

/***/ "./app/src/backend/StringThing.ts":
/*!****************************************!*\
  !*** ./app/src/backend/StringThing.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class StringThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super(value);
        this.value = value;
    }
    toJs() {
        return this.value; //js sucks
    }
}
exports.StringThing = StringThing;


/***/ }),

/***/ "./app/src/backend/Thing.ts":
/*!**********************************!*\
  !*** ./app/src/backend/Thing.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
function getThing(args) {
    return new BaseThing_1.BaseThing(args.id, args.bases);
}
exports.getThing = getThing;
// ...


/***/ }),

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
const prelude_1 = __webpack_require__(/*! ./prelude */ "./app/src/config/prelude.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
function getConfig() {
    return {
        lexemeTypes: LexemeType_1.lexemeTypes,
        lexemes: lexemes_1.lexemes,
        syntaxes: syntaxes_1.syntaxes,
        prelude: prelude_1.prelude,
        staticDescPrecedence: syntaxes_1.staticDescPrecedence,
        // things,
    };
}
exports.getConfig = getConfig;


/***/ }),

/***/ "./app/src/config/LexemeType.ts":
/*!**************************************!*\
  !*** ./app/src/config/LexemeType.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemeTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('adjective', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'verb', 'negation', 'existquant', 'uniquant', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'nonsubconj', // and ...
'disjunc', // or, but, however ...
'pronoun', 'filler', 'keyword', 'except-word', 'quote');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    { root: 'makro', type: 'keyword', referents: [] },
    { root: 'be', type: 'copula', referents: [] },
    { root: 'be', type: 'copula', token: 'is', cardinality: 1, referents: [] },
    { root: 'be', type: 'copula', token: 'are', cardinality: '*', referents: [] },
    { root: 'do', type: 'hverb', referents: [] },
    { root: 'do', type: 'hverb', token: 'does', cardinality: 1, referents: [] },
    { root: 'not', type: 'negation', referents: [] },
    { root: 'then', type: 'filler', referents: [] },
    { root: '.', type: 'fullstop', referents: [] },
    { root: 'optional', type: 'adjective', cardinality: '1|0', referents: [] },
    { root: 'one-or-more', type: 'adjective', cardinality: '+', referents: [] },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*', referents: [] },
    { root: 'or', type: 'disjunc', referents: [] },
    { root: 'subject', type: 'adjective', referents: [] },
    { root: 'predicate', type: 'adjective', referents: [] },
    { root: 'object', type: 'adjective', referents: [] },
    { root: 'and', type: 'nonsubconj', referents: [] },
    { root: 'left', type: 'adjective', referents: [] },
    { root: 'right', type: 'adjective', referents: [] },
    { root: 'condition', type: 'adjective', referents: [] },
    { root: 'consequence', type: 'adjective', referents: [] },
    { root: 'a', type: 'indefart', referents: [] },
    { root: 'an', type: 'indefart', referents: [] },
    { root: 'the', type: 'defart', referents: [] },
    { root: 'if', type: 'subconj', referents: [] },
    { root: 'when', type: 'subconj', referents: [] },
    { root: 'any', type: 'uniquant', referents: [] },
    { root: 'every', type: 'uniquant', referents: [] },
    { root: 'of', type: 'preposition', referents: [] },
    { root: 'that', type: 'relpron', referents: [] },
    { root: 'it', type: 'pronoun', referents: [] },
    { root: 'have', type: 'verb', referents: [] },
    { root: 'except', type: 'except-word', referents: [] },
    { root: '"', type: 'quote', referents: [] },
    { root: 'token', type: 'adjective', referents: [] },
];


/***/ }),

/***/ "./app/src/config/prelude.ts":
/*!***********************************!*\
  !*** ./app/src/config/prelude.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prelude = void 0;
exports.prelude = `
  makro 
    any-lexeme is adjective 
            or copula 
            or defart 
            or indefart 
            or fullstop 
            or hverb 
            or verb 
            or negation 
            or existquant 
            or uniquant 
            or relpron 
            or negation 
            or noun 
            or preposition 
            or subconj 
            or nonsubconj 
            or disjunc 
            or pronoun 
            or filler 
            or keyword 
            or except-word 
            or quote
  makro.
  
  makro 
    quantifier is uniquant or existquant 
  makro.

  makro 
    article is indefart or defart 
  makro.

  makro 
    complement is preposition then object noun-phrase 
  makro.

  makro 
    copula-sentence is subject noun-phrase 
      then copula 
      then optional negation 
      then predicate noun-phrase 
  makro.

  makro 
    noun-phrase is optional quantifier 
      then optional article 
      then zero-or-more adjectives 
      then zero-or-more subject noun or pronoun 
      then optional subclause 
      then zero-or-more complements 
  makro.

  makro 
    copulasubclause is relpron then copula then predicate noun-phrase 
  makro.

  makro 
    mverbsubclause is relpron then verb then object noun-phrase 
  makro.

  makro 
    subclause is copulasubclause or mverbsubclause 
  makro.

  makro 
    and-sentence is left copula-sentence or noun-phrase 
      then nonsubconj 
      then one-or-more right and-sentence or copula-sentence or noun-phrase
  makro.

  makro 
    verb-sentence is subject noun-phrase 
      then optional hverb then optional negation 
      then verb then optional object noun-phrase 
  makro.

  makro 
    simple-sentence is copula-sentence or verb-sentence 
  makro.

  makro 
    cs1 is subconj 
      then condition simple-sentence 
      then filler 
      then consequence simple-sentence
  makro.

  makro 
    cs2 is consequence simple-sentence 
      then subconj 
      then condition simple-sentence
  makro.

  makro 
    string is quote then one-or-more token any-lexeme except quote then quote 
  makro.

  `;


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.staticDescPrecedence = exports.constituentTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion', 'exceptunion');
exports.staticDescPrecedence = ['macro'];
exports.syntaxes = {
    'macro': [
        { type: ['keyword'], number: 1 },
        { type: ['noun'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' },
        { type: ['keyword'], number: 1 },
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['exceptunion'], number: '1|0' },
        { type: ['filler'], number: '1|0' },
    ],
    'taggedunion': [
        { type: ['noun'], number: 1 },
        { type: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { type: ['except-word'], number: 1 },
        { type: ['taggedunion'], number: '+' },
    ]
};


/***/ }),

/***/ "./app/src/facade/BasicBrain.ts":
/*!**************************************!*\
  !*** ./app/src/facade/BasicBrain.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Context_1 = __webpack_require__(/*! ../backend/Context */ "./app/src/backend/Context.ts");
const Parser_1 = __webpack_require__(/*! ../frontend/parser/interfaces/Parser */ "./app/src/frontend/parser/interfaces/Parser.ts");
const evalAst_1 = __webpack_require__(/*! ../middle/evalAst */ "./app/src/middle/evalAst.ts");
class BasicBrain {
    constructor() {
        this.context = (0, Context_1.getContext)({ id: 'global' });
        this.execute(this.context.getPrelude());
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
            if (ast.type === 'macro') {
                return [];
            }
            return (0, evalAst_1.evalAst)(this.context, ast);
        }).flat();
    }
    executeUnwrapped(natlang) {
        return this.execute(natlang).map(x => x.toJs());
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/facade/Brain.ts":
/*!*********************************!*\
  !*** ./app/src/facade/Brain.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/facade/BasicBrain.ts"));
function getBrain() {
    return new BasicBrain_1.default();
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/frontend/lexer/EagerLexer.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/EagerLexer.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.tokens = [];
        this._pos = 0;
        this.words =
            spaceOut(sourceCode, ['"', '.'])
                .trim()
                .split(/\s+/);
        console.log(this.words);
        this.refreshTokens();
    }
    refreshTokens() {
        this.tokens = this.words.map(w => { var _a; return (_a = this.context.getLexeme(w)) !== null && _a !== void 0 ? _a : (0, Lexeme_1.makeLexeme)({ root: w, token: w, type: 'noun', referents: [] }); });
    }
    next() {
        this.refreshTokens();
        this._pos++;
    }
    get pos() {
        return this._pos;
    }
    backTo(pos) {
        this._pos = pos;
    }
    get peek() {
        return this.tokens[this._pos];
    }
    croak(errorMsg) {
        throw new Error(`${errorMsg} at ${this._pos}`);
    }
    get isEnd() {
        return this.pos >= this.tokens.length;
    }
}
exports["default"] = EagerLexer;
function spaceOut(sourceCode, specialChars) {
    // let res = ''
    // for (const c of sourceCode) {
    // res += specialChars.includes(c) ? ' ' + c + ' ' : c
    // }
    return sourceCode
        .split('')
        .reduce((a, c) => a + (specialChars.includes(c) ? ' ' + c + ' ' : c), '');
    // return res
}


/***/ }),

/***/ "./app/src/frontend/lexer/Lexeme.ts":
/*!******************************************!*\
  !*** ./app/src/frontend/lexer/Lexeme.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extrapolate = exports.isPlural = exports.makeLexeme = void 0;
const Cardinality_1 = __webpack_require__(/*! ../parser/interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const pluralize_1 = __webpack_require__(/*! ./functions/pluralize */ "./app/src/frontend/lexer/functions/pluralize.ts");
const conjugate_1 = __webpack_require__(/*! ./functions/conjugate */ "./app/src/frontend/lexer/functions/conjugate.ts");
function makeLexeme(data) {
    return data;
}
exports.makeLexeme = makeLexeme;
function isPlural(lexeme) {
    return (0, Cardinality_1.isRepeatable)(lexeme.cardinality);
}
exports.isPlural = isPlural;
function extrapolate(lexeme, context) {
    if (lexeme.type === 'noun' && !isPlural(lexeme)) {
        return [makeLexeme({
                root: lexeme.root,
                type: lexeme.type,
                token: (0, pluralize_1.pluralize)(lexeme.root),
                cardinality: '*',
                referents: lexeme.referents
            })];
    }
    if (lexeme.type === 'verb') {
        return (0, conjugate_1.conjugate)(lexeme.root).map(x => makeLexeme({
            root: lexeme.root,
            type: lexeme.type,
            token: x,
            referents: lexeme.referents
        }));
    }
    return [];
}
exports.extrapolate = extrapolate;


/***/ }),

/***/ "./app/src/frontend/lexer/Lexer.ts":
/*!*****************************************!*\
  !*** ./app/src/frontend/lexer/Lexer.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexer = void 0;
const EagerLexer_1 = __importDefault(__webpack_require__(/*! ./EagerLexer */ "./app/src/frontend/lexer/EagerLexer.ts"));
function getLexer(sourceCode, context) {
    return new EagerLexer_1.default(sourceCode, context);
}
exports.getLexer = getLexer;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/conjugate.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/conjugate.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.conjugate = void 0;
function conjugate(verb) {
    return [verb + 's'];
}
exports.conjugate = conjugate;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/pluralize.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/pluralize.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pluralize = void 0;
function pluralize(root) {
    return root + 's';
}
exports.pluralize = pluralize;


/***/ }),

/***/ "./app/src/frontend/parser/KoolParser.ts":
/*!***********************************************!*\
  !*** ./app/src/frontend/parser/KoolParser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const Cardinality_1 = __webpack_require__(/*! ./interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/frontend/lexer/Lexer.ts");
class KoolParser {
    constructor(sourceCode, context, lexer = (0, Lexer_1.getLexer)(sourceCode, context)) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.lexer = lexer;
        this.knownParse = (name, role) => {
            const members = this.context.getSyntax(name);
            if (members.length === 1 && members[0].type.every(t => this.isLeaf(t))) {
                return this.parseLeaf(members[0]);
            }
            else {
                return this.parseComposite(name, role);
            }
        };
        this.parseLeaf = (m) => {
            if (m.type.includes(this.lexer.peek.type)) {
                const x = this.lexer.peek;
                this.lexer.next();
                return { type: x.type, lexeme: x };
            }
        };
        this.parseComposite = (name, role) => {
            var _a;
            const links = {};
            for (const m of this.context.getSyntax(name)) {
                const ast = this.parseMember(m);
                if (!ast && (0, Cardinality_1.isNecessary)(m.number)) {
                    return undefined;
                }
                if (!ast) {
                    continue;
                }
                links[(_a = m.role) !== null && _a !== void 0 ? _a : ast.type] = ast;
            }
            if (Object.keys(links).length <= 0) {
                return undefined;
            }
            return {
                type: name,
                role: role,
                links: links
            };
        };
        this.parseMember = (m, role) => {
            const list = [];
            while (!this.lexer.isEnd) {
                if (!(0, Cardinality_1.isRepeatable)(m.number) && list.length >= 1) {
                    break;
                }
                const x = this.tryParse(m.type, m.role, m.exceptType);
                if (!x) {
                    break;
                }
                list.push(x);
            }
            if (list.length === 0) {
                return undefined;
            }
            return (0, Cardinality_1.isRepeatable)(m.number) ? ({
                type: list[0].type,
                list: list
            }) : list[0];
        };
        this.isLeaf = (t) => {
            return this.context.getLexemeTypes().includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.context.getSyntaxList());
            if (!ast) {
                break;
            }
            const simpleAst = this.simplify(ast);
            results.push(simpleAst);
            if (simpleAst.type === 'macro') {
                this.context.setSyntax(ast);
            }
            if (((_a = this.lexer.peek) === null || _a === void 0 ? void 0 : _a.type) === 'fullstop') {
                this.lexer.next();
            }
        }
        return results;
    }
    tryParse(types, role, exceptTypes) {
        for (const t of types) {
            const memento = this.lexer.pos;
            const x = this.knownParse(t, role);
            if (x && !(exceptTypes === null || exceptTypes === void 0 ? void 0 : exceptTypes.includes(x.type))) {
                return x;
            }
            this.lexer.backTo(memento);
        }
    }
    simplify(ast) {
        if (!ast.links) {
            return ast;
        }
        const syntax = this.context.getSyntax(ast.type);
        if (syntax.length === 1 && Object.values(ast.links).length === 1) {
            return this.simplify(Object.values(ast.links)[0]);
        }
        const simpleLinks = Object
            .entries(ast.links)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        return Object.assign(Object.assign({}, ast), { links: simpleLinks });
    }
}
exports.KoolParser = KoolParser;


/***/ }),

/***/ "./app/src/frontend/parser/interfaces/Cardinality.ts":
/*!***********************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Cardinality.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRepeatable = exports.isNecessary = void 0;
const isNecessary = (c) => c === undefined // necessary by default
    || c == '+'
    || +c >= 1;
exports.isNecessary = isNecessary;
const isRepeatable = (c) => c == '+'
    || c == '*';
exports.isRepeatable = isRepeatable;


/***/ }),

/***/ "./app/src/frontend/parser/interfaces/Parser.ts":
/*!******************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Parser.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const KoolParser_1 = __webpack_require__(/*! ../KoolParser */ "./app/src/frontend/parser/KoolParser.ts");
function getParser(sourceCode, context) {
    return new KoolParser_1.KoolParser(sourceCode, context);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/frontend/parser/macroToSyntax.ts":
/*!**************************************************!*\
  !*** ./app/src/frontend/parser/macroToSyntax.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.macroToSyntax = void 0;
function macroToSyntax(macro) {
    var _a, _b, _c, _d, _e, _f;
    const macroparts = (_c = (_b = (_a = macro === null || macro === void 0 ? void 0 : macro.links) === null || _a === void 0 ? void 0 : _a.macropart) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = (_f = (_e = (_d = macro === null || macro === void 0 ? void 0 : macro.links) === null || _d === void 0 ? void 0 : _d.subject) === null || _e === void 0 ? void 0 : _e.lexeme) === null || _f === void 0 ? void 0 : _f.root;
    if (!name) {
        throw new Error('Anonymous syntax!');
    }
    return { name, syntax };
}
exports.macroToSyntax = macroToSyntax;
function macroPartToMember(macroPart) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const adjectiveNodes = (_c = (_b = (_a = macroPart.links) === null || _a === void 0 ? void 0 : _a.adjective) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const adjectives = adjectiveNodes.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; });
    const taggedUnions = (_f = (_e = (_d = macroPart.links) === null || _d === void 0 ? void 0 : _d.taggedunion) === null || _e === void 0 ? void 0 : _e.list) !== null && _f !== void 0 ? _f : [];
    const grammars = taggedUnions.map(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.noun; });
    const quantadjs = adjectives.filter(a => a.cardinality);
    const qualadjs = adjectives.filter(a => !a.cardinality);
    const exceptUnions = (_l = (_k = (_j = (_h = (_g = macroPart.links) === null || _g === void 0 ? void 0 : _g.exceptunion) === null || _h === void 0 ? void 0 : _h.links) === null || _j === void 0 ? void 0 : _j.taggedunion) === null || _k === void 0 ? void 0 : _k.list) !== null && _l !== void 0 ? _l : [];
    const notGrammars = exceptUnions.map(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.noun; });
    return {
        type: grammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
        role: (_m = qualadjs.at(0)) === null || _m === void 0 ? void 0 : _m.root,
        number: (_o = quantadjs.at(0)) === null || _o === void 0 ? void 0 : _o.cardinality,
        exceptType: notGrammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
    };
}


/***/ }),

/***/ "./app/src/frontend/parser/maxPrecedence.ts":
/*!**************************************************!*\
  !*** ./app/src/frontend/parser/maxPrecedence.ts ***!
  \**************************************************/
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
    return members.flatMap(m => m.type).flatMap(t => {
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

/***/ "./app/src/main/main.ts":
/*!******************************!*\
  !*** ./app/src/main/main.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Brain_1 = __webpack_require__(/*! ../facade/Brain */ "./app/src/facade/Brain.ts");
function main() {
    const state = {
        brain: (0, Brain_1.getBrain)(),
        promptVisible: false
    };
    const update = () => {
        textarea.hidden = !state.promptVisible;
        state.promptVisible ? textarea.focus() : 0;
    };
    const textarea = document.createElement('textarea');
    textarea.style.width = '50vw';
    textarea.style.height = '1em';
    textarea.hidden = true;
    textarea.style.position = 'sticky';
    textarea.style.top = '0';
    textarea.style.zIndex = '1000';
    document.body.appendChild(textarea);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    document.body.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.ctrlKey && e.code === 'Space') {
            state.promptVisible = !state.promptVisible;
        }
        else if (e.ctrlKey && e.code === 'Enter') {
            const result = state.brain.executeUnwrapped(textarea.value);
            console.log(result);
        }
        else if (e.ctrlKey && e.code === 'KeyY') {
            main();
        }
        update();
    }));
    window.brain = state.brain;
}
exports["default"] = main;


/***/ }),

/***/ "./app/src/middle/clauses/And.ts":
/*!***************************************!*\
  !*** ./app/src/middle/clauses/And.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const sortIds_1 = __webpack_require__(/*! ../id/functions/sortIds */ "./app/src/middle/id/functions/sortIds.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/middle/clauses/Imply.ts"));
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const solveMaps_1 = __webpack_require__(/*! ./functions/solveMaps */ "./app/src/middle/clauses/functions/solveMaps.ts");
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.hashCode = (0, hashString_1.hashString)(this.clause1.toString() + this.clause2.toString() + this.negated);
        this.entities = (0, uniq_1.uniq)(this.clause1.entities.concat(this.clause2.entities));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.implies = (conclusion) => new Imply_1.default(this, conclusion);
        this.ownedBy = (id) => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
        this.ownersOf = (id) => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
    }
    and(other, opts) {
        var _a;
        return new And(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b, _c;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated);
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return this.negated ? `not${yes}` : yes;
    }
    flatList() {
        return this.negated ? [this] : [...this.clause1.flatList(), ...this.clause2.flatList()];
    }
    get theme() {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme);
    }
    get rheme() {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme);
    }
    query(query, opts) {
        var _a;
        const universe = this.clause1.and(this.clause2);
        const it = (_a = opts === null || opts === void 0 ? void 0 : opts.it) !== null && _a !== void 0 ? _a : (0, sortIds_1.sortIds)(universe.entities).at(-1); //TODO!
        const universeList = universe.flatList();
        const queryList = query.flatList();
        const maps = (0, solveMaps_1.solveMaps)(queryList, universeList);
        const pronMap = queryList.filter(c => { var _a; return ((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'pronoun'; }).map(c => { var _a; return ({ [(_a = c.args) === null || _a === void 0 ? void 0 : _a.at(0)]: it }); }).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        const res = maps.concat(pronMap).filter(m => Object.keys(m).length); // empty maps cause problems all around the code!
        return res;
    }
    get simple() {
        const c1 = this.clause1.simple;
        const c2 = this.clause2.simple;
        if (c2.hashCode === Clause_1.emptyClause.hashCode) {
            return c1;
        }
        if (c1.hashCode === Clause_1.emptyClause.hashCode) {
            return c2;
        }
        return this.copy({ clause1: c1, clause2: c2 });
    }
}
exports["default"] = And;


/***/ }),

/***/ "./app/src/middle/clauses/AtomClause.ts":
/*!**********************************************!*\
  !*** ./app/src/middle/clauses/AtomClause.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AtomClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/middle/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
class AtomClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.simple = this;
        this.theme = this;
        this.rheme = Clause_1.emptyClause;
        this.entities = (0, uniq_1.uniq)(this.args);
        this.hashCode = (0, hashString_1.hashString)(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.copy = (opts) => {
            var _a;
            return new AtomClause(this.predicate, this.args.map(a => { var _a, _b; return (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.map) === null || _a === void 0 ? void 0 : _a[a]) !== null && _b !== void 0 ? _b : a; }), (_a = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _a !== void 0 ? _a : this.negated);
        };
        this.and = (other, opts) => { var _a; return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false); };
        this.implies = (conclusion) => new Imply_1.default(this, conclusion);
        this.flatList = () => [this];
        this.ownedBy = (id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
        this.ownersOf = (id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate.root}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    query(query) {
        if (!(query instanceof AtomClause)) {
            return [];
        }
        if (this.predicate.root !== query.predicate.root) {
            return [];
        }
        const map = query.args
            .map((x, i) => ({ [x]: this.args[i] }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        return [map];
    }
}
exports.AtomClause = AtomClause;


/***/ }),

/***/ "./app/src/middle/clauses/Clause.ts":
/*!******************************************!*\
  !*** ./app/src/middle/clauses/Clause.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const AtomClause_1 = __webpack_require__(/*! ./AtomClause */ "./app/src/middle/clauses/AtomClause.ts");
const EmptyClause_1 = __importDefault(__webpack_require__(/*! ./EmptyClause */ "./app/src/middle/clauses/EmptyClause.ts"));
function clauseOf(predicate, ...args) {
    return new AtomClause_1.AtomClause(predicate, args);
}
exports.clauseOf = clauseOf;
exports.emptyClause = new EmptyClause_1.default();


/***/ }),

/***/ "./app/src/middle/clauses/EmptyClause.ts":
/*!***********************************************!*\
  !*** ./app/src/middle/clauses/EmptyClause.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class EmptyClause {
    constructor() {
        this.hashCode = 0;
        this.entities = [];
        this.theme = this;
        this.rheme = this;
        this.simple = this;
        this.hasSideEffects = false;
        this.copy = (opts) => this;
        this.and = (other, opts) => other;
        this.implies = (conclusion) => conclusion;
        this.flatList = () => [];
        this.ownedBy = (id) => [];
        this.ownersOf = (id) => [];
        this.query = (clause) => [];
        this.toString = () => '';
    }
}
exports["default"] = EmptyClause;


/***/ }),

/***/ "./app/src/middle/clauses/Imply.ts":
/*!*****************************************!*\
  !*** ./app/src/middle/clauses/Imply.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
class Imply {
    constructor(condition, consequence, negated = false, subjconj) {
        this.condition = condition;
        this.consequence = consequence;
        this.negated = negated;
        this.subjconj = subjconj;
        this.theme = this.condition;
        this.rheme = this.consequence;
        this.hashCode = (0, hashString_1.hashString)(this.condition.toString() + this.consequence.toString() + this.negated);
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.copy = (opts) => {
            var _a, _b, _c, _d;
            return new Imply((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.condition.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.consequence.copy(opts), (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated, (_d = opts === null || opts === void 0 ? void 0 : opts.subjconj) !== null && _d !== void 0 ? _d : this.subjconj);
        };
        this.flatList = () => [this];
        this.and = (other, opts) => { var _a; return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false); };
        this.ownedBy = (id) => this.condition.ownedBy(id).concat(this.consequence.ownedBy(id));
        this.ownersOf = (id) => this.condition.ownersOf(id).concat(this.consequence.ownersOf(id));
    }
    toString() {
        var _a, _b;
        const yes = `${(_b = (_a = this.subjconj) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : ''} ${this.condition.toString()} ---> ${this.consequence.toString()}`;
        return this.negated ? `not(${yes})` : yes;
    }
    query(clause) {
        throw new Error('not implemented!');
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
    get simple() {
        return this.copy({
            clause1: this.condition.simple,
            clause2: this.consequence.simple
        });
    }
    get entities() {
        return (0, uniq_1.uniq)(this.condition.entities.concat(this.consequence.entities));
    }
}
exports["default"] = Imply;


/***/ }),

/***/ "./app/src/middle/clauses/functions/solveMaps.ts":
/*!*******************************************************!*\
  !*** ./app/src/middle/clauses/functions/solveMaps.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.solveMaps = void 0;
const uniq_1 = __webpack_require__(/*! ../../../utils/uniq */ "./app/src/utils/uniq.ts");
const intersection_1 = __webpack_require__(/*! ../../../utils/intersection */ "./app/src/utils/intersection.ts");
const Id_1 = __webpack_require__(/*! ../../id/Id */ "./app/src/middle/id/Id.ts");
/**
 * Finds possible Map-ings from queryList to universeList
 * {@link "file://./../../../../../docs/notes/unification-algo.md"}
 */
function solveMaps(queryList, universeList) {
    const candidates = findCandidates(queryList, universeList);
    candidates.forEach((ml1, i) => {
        candidates.forEach((ml2, j) => {
            if (ml1.length && ml2.length && i !== j) {
                const merged = merge(ml1, ml2);
                candidates[i] = [];
                candidates[j] = merged;
            }
        });
    });
    return candidates.flat().filter(x => !isImposible(x));
}
exports.solveMaps = solveMaps;
function findCandidates(queryList, universeList) {
    return queryList.map(q => {
        const res = universeList.flatMap(u => u.query(q));
        return res.length ? res : [makeImpossible(q)];
    });
}
function merge(ml1, ml2) {
    const merged = [];
    ml1.forEach(m1 => {
        ml2.forEach(m2 => {
            if (mapsAgree(m1, m2)) {
                merged.push(Object.assign(Object.assign({}, m1), m2));
            }
        });
    });
    return (0, uniq_1.uniq)(merged);
}
function mapsAgree(m1, m2) {
    const commonKeys = (0, intersection_1.intersection)(Object.keys(m1), Object.keys(m2));
    return commonKeys.every(k => m1[k] === m2[k]);
}
function makeImpossible(q) {
    return q.entities
        .map(x => ({ [x]: Id_1.SpecialIds.IMPOSSIBLE }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
}
function isImposible(map) {
    return Object.values(map).includes(Id_1.SpecialIds.IMPOSSIBLE);
}


/***/ }),

/***/ "./app/src/middle/evalAst.ts":
/*!***********************************!*\
  !*** ./app/src/middle/evalAst.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evalAst = void 0;
const InstructionThing_1 = __webpack_require__(/*! ../backend/InstructionThing */ "./app/src/backend/InstructionThing.ts");
const NumberThing_1 = __webpack_require__(/*! ../backend/NumberThing */ "./app/src/backend/NumberThing.ts");
const StringThing_1 = __webpack_require__(/*! ../backend/StringThing */ "./app/src/backend/StringThing.ts");
const Thing_1 = __webpack_require__(/*! ../backend/Thing */ "./app/src/backend/Thing.ts");
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const parseNumber_1 = __webpack_require__(/*! ../utils/parseNumber */ "./app/src/utils/parseNumber.ts");
const Clause_1 = __webpack_require__(/*! ./clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getIncrementalId_1 = __webpack_require__(/*! ./id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
function evalAst(context, ast, args = {}) {
    var _a, _b, _c, _d, _e, _f;
    (_a = args.sideEffects) !== null && _a !== void 0 ? _a : (args.sideEffects = couldHaveSideEffects(ast));
    if (args.sideEffects) { // only cache instructions with side effects
        const instruction = new InstructionThing_1.InstructionThing(ast);
        context.set(instruction.getId(), instruction);
        context.setLexeme((0, Lexeme_1.makeLexeme)({ root: 'instruction', type: 'noun', referents: [instruction] }));
    }
    if ((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.copula) {
        return evalCopulaSentence(context, ast, args);
    }
    else if ((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.verb) {
        return evalVerbSentence(context, ast, args);
    }
    else if ((_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.subconj) {
        return evalComplexSentence(context, ast, args);
    }
    else if ((_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.nonsubconj) {
        return evalCompoundSentence(context, ast, args);
    }
    else if ((_f = ast === null || ast === void 0 ? void 0 : ast.links) === null || _f === void 0 ? void 0 : _f.quote) {
        return evalString(context, ast, args);
    }
    else {
        return evalNounPhrase(context, ast, args);
    }
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    //TODO assigment or comparison, based on args.sideEffects
    if (args === null || args === void 0 ? void 0 : args.sideEffects) {
        // assign the right value to the left value
    }
    else {
        // compare the right and left values
    }
    throw new Error('copula sentence!');
    // const subjectId = args?.subject ?? getIncrementalId()
    // const maybeSubject = evalAst(context, ast?.links?.subject)
    // const subject = nounPhraseToClause(ast?.links?.subject)
    // const predicate = evalAst(context, ast?.links?.predicate, { subject: subjectId, autovivification: true, sideEffects: false })
    // if (maybeSubject.length) {
    //     return maybeSubject // TODO
    // }
    // const newThing = predicate[0]
    // const lexemes: Lexeme[] = subject.flatList().filter(x => x.predicate).map(x => x.predicate!).map(x => ({ ...x, referents: [newThing] }))
    // context.set(newThing.getId(), newThing)
    // lexemes.forEach(x => context.setLexeme(x))
    // return [newThing]
}
function evalVerbSentence(context, ast, args) {
    throw new Error('verb sentence!'); // context.getLexeme(ast?.links?.mverb?.lexeme?.root!)
}
function evalComplexSentence(context, ast, args) {
    throw new Error('complex sentence!');
}
function evalCompoundSentence(context, ast, args) {
    throw new Error('compound sentence!');
}
function evalNounPhrase(context, ast, args) {
    var _a;
    const np = nounPhraseToClause(ast, args);
    // checks for Things that match given nounphrase
    // 1. in current sentence scope
    // 2. in broader context
    const currentScope = (_a = context.currentScope) !== null && _a !== void 0 ? _a : Clause_1.emptyClause;
    const maps = currentScope.query(np).concat(context.query(np)); // const np2 = np.copy({map : maps[0] ?? {}});
    const interestingIds = getInterestingIds(maps);
    // TMP (only) use context to pass around data about "currrent sentence", yuck! POSSIBLE BUGS!
    context.currentScope = np;
    const things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x);
    if (isAstPlural(ast)) { // if universal quantified, I don't care if there's no match
        return things;
    }
    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1);
    }
    // or else create and returns the Thing
    return (args === null || args === void 0 ? void 0 : args.autovivification) ? [createThing(np)] : [];
}
function nounPhraseToClause(ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const adjectives = ((_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.adjective) === null || _c === void 0 ? void 0 : _c.list) !== null && _d !== void 0 ? _d : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const nouns = ((_g = (_f = (_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.subject) === null || _f === void 0 ? void 0 : _f.list) !== null && _g !== void 0 ? _g : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const complements = Object.values((_h = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _h !== void 0 ? _h : {}).filter(x => x.list).flatMap(x => x.list).filter(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.preposition; }).map(x => complementToClause(x, { subject: subjectId, autovivification: false, sideEffects: false })).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    return adjectives.and(nouns).and(complements);
    //TODO: subclause
}
function complementToClause(ast, args) {
    var _a, _b, _c;
    const subjectId = args === null || args === void 0 ? void 0 : args.subject;
    const objectId = (0, getIncrementalId_1.getIncrementalId)();
    const preposition = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.preposition) === null || _b === void 0 ? void 0 : _b.lexeme;
    const object = nounPhraseToClause((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objectId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)(preposition, subjectId, objectId).and(object);
}
function relativeClauseToClause(ast, args) {
    return Clause_1.emptyClause; //TODO!
}
function isAstPlural(ast) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const x = ((_c = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.noun) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_f = (_e = (_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.adjective) === null || _e === void 0 ? void 0 : _e.list) === null || _f === void 0 ? void 0 : _f.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_j = (_h = (_g = ast === null || ast === void 0 ? void 0 : ast.links) === null || _g === void 0 ? void 0 : _g.subject) === null || _h === void 0 ? void 0 : _h.list) === null || _j === void 0 ? void 0 : _j.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_k = ast === null || ast === void 0 ? void 0 : ast.links) === null || _k === void 0 ? void 0 : _k.uniquant);
    if (x) {
        return true;
    }
    return Object.values((_l = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _l !== void 0 ? _l : {}).concat((_m = ast === null || ast === void 0 ? void 0 : ast.list) !== null && _m !== void 0 ? _m : []).some(x => isAstPlural(x));
}
function getInterestingIds(maps) {
    // the ones with most dots, because "color of style of button" 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if "color of button AND button"
    const ids = maps.flatMap(x => Object.values(x));
    const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)));
    return ids.filter(x => getNumberOfDots(x) === maxLen);
}
const getNumberOfDots = (id) => id.split('.').length; //-1
function createThing(clause) {
    const bases = clause.flatList().map(x => { var _a, _b; return (_b = (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referents) === null || _b === void 0 ? void 0 : _b[0]; }) /* ONLY FIRST? */.filter(x => x);
    const id = (0, getIncrementalId_1.getIncrementalId)();
    return (0, Thing_1.getThing)({ id, bases });
}
function evalString(context, ast, args) {
    var _a, _b, _c;
    const x = (_c = (_b = (_a = Object.values(Object.assign(Object.assign({}, ast === null || ast === void 0 ? void 0 : ast.links), { 'quote': undefined })).filter(x => x).at(0)) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.map(x => { var _a; return (_a = x.lexeme) === null || _a === void 0 ? void 0 : _a.token; })) !== null && _c !== void 0 ? _c : [];
    const y = x.join(' ');
    const z = (0, parseNumber_1.parseNumber)(y);
    if (z) {
        return [new NumberThing_1.NumberThing(z)];
    }
    if (!y.length) {
        return [];
    }
    return [new StringThing_1.StringThing(y)];
}
function couldHaveSideEffects(ast) {
    var _a, _b, _c;
    return !!(((_a = ast.links) === null || _a === void 0 ? void 0 : _a.copula) || ((_b = ast.links) === null || _b === void 0 ? void 0 : _b.verb) || ((_c = ast.links) === null || _c === void 0 ? void 0 : _c.subconj));
}


/***/ }),

/***/ "./app/src/middle/id/Id.ts":
/*!*********************************!*\
  !*** ./app/src/middle/id/Id.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpecialIds = void 0;
/**
 * Some special Ids
 */
exports.SpecialIds = {
    IMPOSSIBLE: 'IMPOSSIBLE'
};


/***/ }),

/***/ "./app/src/middle/id/functions/getIncrementalId.ts":
/*!*********************************************************!*\
  !*** ./app/src/middle/id/functions/getIncrementalId.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIncrementalId = void 0;
function getIncrementalId() {
    const newId = `id${idGenerator.next().value}`;
    return newId;
}
exports.getIncrementalId = getIncrementalId;
const idGenerator = getIncrementalIdGenerator();
function* getIncrementalIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}


/***/ }),

/***/ "./app/src/middle/id/functions/idToNum.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/idToNum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idToNum = void 0;
function idToNum(id) {
    return parseInt(id.toString().replaceAll(/\D+/g, ''));
}
exports.idToNum = idToNum;


/***/ }),

/***/ "./app/src/middle/id/functions/sortIds.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/sortIds.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sortIds = void 0;
const idToNum_1 = __webpack_require__(/*! ./idToNum */ "./app/src/middle/id/functions/idToNum.ts");
/**
 * Sort ids in ascending order.
 */
function sortIds(ids) {
    return ids.sort((a, b) => (0, idToNum_1.idToNum)(a) - (0, idToNum_1.idToNum)(b));
}
exports.sortIds = sortIds;


/***/ }),

/***/ "./app/src/utils/hashString.ts":
/*!*************************************!*\
  !*** ./app/src/utils/hashString.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashString = void 0;
function hashString(string) {
    return string.split('').map(c => c.charCodeAt(0)).reduce((hash, cc) => {
        const h1 = ((hash << 5) - hash) + cc;
        return h1 & h1; // Convert to 32bit integer
    });
}
exports.hashString = hashString;


/***/ }),

/***/ "./app/src/utils/intersection.ts":
/*!***************************************!*\
  !*** ./app/src/utils/intersection.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intersection = void 0;
const uniq_1 = __webpack_require__(/*! ./uniq */ "./app/src/utils/uniq.ts");
/**
 * Intersection between two lists of strings.
 */
function intersection(xs, ys) {
    return (0, uniq_1.uniq)(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))));
}
exports.intersection = intersection;


/***/ }),

/***/ "./app/src/utils/parseNumber.ts":
/*!**************************************!*\
  !*** ./app/src/utils/parseNumber.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseNumber = void 0;
/**
 * Checks if string has any non-digit char (except for ".") before
 * converting to number.
 */
function parseNumber(string) {
    var _a;
    const nonDig = (_a = string.match(/\D/g)) === null || _a === void 0 ? void 0 : _a.at(0);
    if (nonDig && nonDig !== '.') {
        return undefined;
    }
    return parseFloat(string);
}
exports.parseNumber = parseNumber;


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
    let seen = {};
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./app/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUU7SUFDM0UsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQy9DLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNwRCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNuRCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQy9DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzdDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0NBRXREOzs7Ozs7Ozs7Ozs7OztBQ3hDWSxlQUFPLEdBRWxCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtR0M7Ozs7Ozs7Ozs7Ozs7O0FDbkdILGlIQUF3RDtBQUkzQyx3QkFBZ0IsR0FBRyxtQ0FBYyxFQUMxQyxPQUFPLEVBQ1AsV0FBVyxFQUNYLGFBQWEsRUFDYixhQUFhLENBQ2hCO0FBRVksNEJBQW9CLEdBQW9CLENBQUMsT0FBTyxDQUFDO0FBRWpELGdCQUFRLEdBQWM7SUFFL0IsT0FBTyxFQUFFO1FBQ0wsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQ2hDLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1FBQzlDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUMvQixFQUFFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDcEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO0tBQ25DO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUN0QyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7UUFDeEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ3RDO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtLQUN2QztJQUNELGFBQWEsRUFBRTtRQUNYLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUNwQyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7S0FDekM7Q0FFSjs7Ozs7Ozs7Ozs7OztBQ3ZDRCxnR0FBZ0Q7QUFFaEQsbUlBQWlFO0FBQ2pFLDhGQUE0QztBQUk1QyxNQUFxQixVQUFVO0lBSTNCO1FBRlMsWUFBTyxHQUFHLHdCQUFVLEVBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7UUFHM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZTtRQUNuQixPQUFPLHNCQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFFekQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDdEIsT0FBTyxFQUFFO2FBQ1o7WUFFRCxPQUFPLHFCQUFPLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2IsQ0FBQztJQUVELGdCQUFnQixDQUFDLE9BQWU7UUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0NBRUo7QUF2QkQsZ0NBdUJDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdCRCxnSEFBcUM7QUFXckMsU0FBZ0IsUUFBUTtJQUNwQixPQUFPLElBQUksb0JBQVUsRUFBRTtBQUMzQixDQUFDO0FBRkQsNEJBRUM7Ozs7Ozs7Ozs7Ozs7QUNiRCwyRkFBOEM7QUFHOUMsTUFBcUIsVUFBVTtJQU0zQixZQUFxQixVQUFrQixFQUFXLE9BQWdCO1FBQTdDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBSnhELFdBQU0sR0FBYSxFQUFFO1FBRXJCLFNBQUksR0FBVyxDQUFDO1FBR3RCLElBQUksQ0FBQyxLQUFLO1lBQ04sUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDM0IsSUFBSSxFQUFFO2lCQUNOLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXZCLElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDeEIsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsaUJBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQ0FBSSx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUM7SUFDbEksQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEVBQUU7SUFDZixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSTtJQUNwQixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVc7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUc7SUFDbkIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBZ0I7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtJQUN6QyxDQUFDO0NBRUo7QUE5Q0QsZ0NBOENDO0FBRUQsU0FBUyxRQUFRLENBQUMsVUFBa0IsRUFBRSxZQUFzQjtJQUN4RCxlQUFlO0lBRWYsZ0NBQWdDO0lBQ2hDLHNEQUFzRDtJQUN0RCxJQUFJO0lBRUosT0FBTyxVQUFVO1NBQ1osS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFJN0UsYUFBYTtBQUNqQixDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2pFRCx5SUFBNEU7QUFDNUUsd0hBQWlEO0FBQ2pELHdIQUFpRDtBQVlqRCxTQUFnQixVQUFVLENBQUMsSUFBWTtJQUNuQyxPQUFPLElBQUk7QUFDZixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxTQUFnQixRQUFRLENBQUMsTUFBYztJQUNuQyxPQUFPLDhCQUFZLEVBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUMzQyxDQUFDO0FBRkQsNEJBRUM7QUFFRCxTQUFnQixXQUFXLENBQUMsTUFBYyxFQUFFLE9BQWU7SUFFdkQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM3QyxPQUFPLENBQUMsVUFBVSxDQUFDO2dCQUNmLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixLQUFLLEVBQUUseUJBQVMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUM3QixXQUFXLEVBQUUsR0FBRztnQkFDaEIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO2FBQzlCLENBQUMsQ0FBQztLQUNOO0lBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUN4QixPQUFPLHlCQUFTLEVBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLEtBQUssRUFBRSxDQUFDO1lBQ1IsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztLQUNOO0lBRUQsT0FBTyxFQUFFO0FBQ2IsQ0FBQztBQXRCRCxrQ0FzQkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUNELHdIQUFxQztBQVlyQyxTQUFnQixRQUFRLENBQUMsVUFBa0IsRUFBRSxPQUFnQjtJQUN6RCxPQUFPLElBQUksb0JBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0FBQzlDLENBQUM7QUFGRCw0QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxTQUFnQixTQUFTLENBQUMsSUFBVztJQUNqQyxPQUFPLENBQUMsSUFBSSxHQUFDLEdBQUcsQ0FBQztBQUNyQixDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDRkQsU0FBZ0IsU0FBUyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLEdBQUcsR0FBRztBQUNyQixDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDQUQsaUlBQW9FO0FBSXBFLCtGQUF5QztBQUl6QyxNQUFhLFVBQVU7SUFFbkIsWUFDdUIsVUFBa0IsRUFDbEIsT0FBZ0IsRUFDaEIsUUFBUSxvQkFBUSxFQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7UUFGckMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFVBQUssR0FBTCxLQUFLLENBQWdDO1FBaURsRCxlQUFVLEdBQUcsQ0FBQyxJQUFhLEVBQUUsSUFBVyxFQUF1QixFQUFFO1lBRXZFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUU1QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFxQixFQUFFLElBQUksQ0FBQzthQUMxRDtRQUVMLENBQUM7UUFFUyxjQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQXVCLEVBQUU7WUFFckQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDakIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7YUFDckM7UUFFTCxDQUFDO1FBRVMsbUJBQWMsR0FBRyxDQUFDLElBQW1CLEVBQUUsSUFBVyxFQUF1QixFQUFFOztZQUVqRixNQUFNLEtBQUssR0FBUSxFQUFFO1lBRXJCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUUvQixJQUFJLENBQUMsR0FBRyxJQUFJLDZCQUFXLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUMvQixPQUFPLFNBQVM7aUJBQ25CO2dCQUVELElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ04sU0FBUTtpQkFDWDtnQkFFRCxLQUFLLENBQUMsT0FBQyxDQUFDLElBQUksbUNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUc7YUFFbEM7WUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxTQUFTO2FBQ25CO1lBRUQsT0FBTztnQkFDSCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsS0FBSzthQUNmO1FBQ0wsQ0FBQztRQUVTLGdCQUFXLEdBQUcsQ0FBQyxDQUFTLEVBQUUsSUFBVyxFQUF1QixFQUFFO1lBRXBFLE1BQU0sSUFBSSxHQUFjLEVBQUU7WUFFMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUV0QixJQUFJLENBQUMsOEJBQVksRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQzdDLE1BQUs7aUJBQ1I7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFFckQsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDSixNQUFLO2lCQUNSO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixPQUFPLFNBQVM7YUFDbkI7WUFFRCxPQUFPLDhCQUFZLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ2xCLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhCLENBQUM7UUFFUyxXQUFNLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQWUsQ0FBQztRQUNsRSxDQUFDO0lBcElELENBQUM7SUFFRCxRQUFROztRQUVKLE1BQU0sT0FBTyxHQUFjLEVBQUU7UUFFN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBRXRCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV2RCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNOLE1BQUs7YUFDUjtZQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRXZCLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQzthQUM5QjtZQUVELElBQUksV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLDBDQUFFLElBQUksTUFBSyxVQUFVLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2FBQ3BCO1NBRUo7UUFFRCxPQUFPLE9BQU87SUFDbEIsQ0FBQztJQUdTLFFBQVEsQ0FBQyxLQUFnQixFQUFFLElBQVcsRUFBRSxXQUF1QjtRQUVyRSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUVuQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7WUFDOUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO1lBRWxDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUU7Z0JBQ3JDLE9BQU8sQ0FBQzthQUNYO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQzdCO0lBRUwsQ0FBQztJQXlGUyxRQUFRLENBQUMsR0FBWTtRQUUzQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNaLE9BQU8sR0FBRztTQUNiO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUUvQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTTthQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUNsQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLENBQUM7UUFFdkMsdUNBQVksR0FBRyxLQUFFLEtBQUssRUFBRSxXQUFXLElBQUU7SUFFekMsQ0FBQztDQUVKO0FBbEtELGdDQWtLQzs7Ozs7Ozs7Ozs7Ozs7QUN2S00sTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsdUJBQXVCO09BQ2hGLENBQUMsSUFBSSxHQUFHO09BQ1IsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUZELG1CQUFXLGVBRVY7QUFFUCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUc7T0FDbEQsQ0FBQyxJQUFJLEdBQUc7QUFERixvQkFBWSxnQkFDVjs7Ozs7Ozs7Ozs7Ozs7QUNUZix5R0FBMEM7QUFPMUMsU0FBZ0IsU0FBUyxDQUFDLFVBQWtCLEVBQUUsT0FBZ0I7SUFDMUQsT0FBTyxJQUFJLHVCQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztBQUM5QyxDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDUEQsU0FBZ0IsYUFBYSxDQUFDLEtBQWM7O0lBRXhDLE1BQU0sVUFBVSxHQUFHLHVCQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUN0RCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxJQUFJLEdBQUcsdUJBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLDBDQUFFLE9BQU8sMENBQUUsTUFBTSwwQ0FBRSxJQUFJO0lBRWhELElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDO0tBQ3ZDO0lBRUQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDM0IsQ0FBQztBQVhELHNDQVdDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxTQUFrQjs7SUFFekMsTUFBTSxjQUFjLEdBQUcsMkJBQVMsQ0FBQyxLQUFLLDBDQUFFLFNBQVMsMENBQUUsSUFBSSxtQ0FBSSxFQUFFO0lBQzdELE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsTUFBTSxtQ0FBSSxFQUFFLElBQUM7SUFFOUQsTUFBTSxZQUFZLEdBQUcsMkJBQVMsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsMENBQUUsSUFBSSxtQ0FBSSxFQUFFO0lBQzdELE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsS0FBSywwQ0FBRSxJQUFJLElBQUM7SUFFckQsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDdkQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUV2RCxNQUFNLFlBQVksR0FBRyx1Q0FBUyxDQUFDLEtBQUssMENBQUUsV0FBVywwQ0FBRSxLQUFLLDBDQUFFLFdBQVcsMENBQUUsSUFBSSxtQ0FBSSxFQUFFO0lBQ2pGLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsS0FBSywwQ0FBRSxJQUFJLElBQUM7SUFFeEQsT0FBTztRQUNILElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsYUFBQyxPQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSwwQ0FBRSxJQUFnQixtQ0FBSSxFQUFFLElBQUM7UUFDL0QsSUFBSSxFQUFFLGNBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQVk7UUFDbEMsTUFBTSxFQUFFLGVBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFdBQVc7UUFDcEMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBQyxhQUFDLE9BQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxNQUFNLDBDQUFFLElBQWdCLG1DQUFJLEVBQUUsSUFBQztLQUMzRTtBQUVMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbENNLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBRTs7SUFFckYsT0FBTyxxQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsbUNBQ2xCLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLG1DQUNqQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7QUFFbEMsQ0FBQztBQU5ZLHFCQUFhLGlCQU16QjtBQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBVSxFQUFFLENBQVUsRUFBRSxFQUFFO0lBQ3pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pDLENBQUM7QUFFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUVsRixNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekQsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRXpELElBQUksV0FBVyxLQUFLLFdBQVcsRUFBRTtRQUM3QixPQUFPLFNBQVM7S0FDbkI7SUFFRCxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFL0IsQ0FBQztBQUVELFNBQWdCLFlBQVksQ0FBQyxDQUFnQixFQUFFLFFBQW1CLEVBQUUsVUFBcUIsRUFBRTs7SUFFdkYsTUFBTSxPQUFPLEdBQUcsY0FBUSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxFQUFFO0lBRWpDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFFNUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sRUFBRTtTQUNaO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBa0IsRUFBRSxRQUFRLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RGO0lBRUwsQ0FBQyxDQUFDO0FBRU4sQ0FBQztBQWRELG9DQWNDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFnQixFQUFFLENBQWdCLEVBQUUsUUFBbUIsRUFBRSxFQUFFO0lBQzNFLE9BQU8sWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxNQUFNO0FBQzlFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q0Qsd0ZBQTBDO0FBRTFDLFNBQXdCLElBQUk7SUFFeEIsTUFBTSxLQUFLLEdBQUc7UUFDVixLQUFLLEVBQUUsb0JBQVEsR0FBRTtRQUNqQixhQUFhLEVBQUUsS0FBSztLQUN2QjtJQUVELE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUNoQixRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWE7UUFDdEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNuRCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUs7SUFDN0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJO0lBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVE7SUFDbEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUN4QixRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBTSxDQUFDLEVBQUMsRUFBRTtRQUVoRCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDakMsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhO1NBQzdDO2FBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3hDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUN0QjthQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN2QyxJQUFJLEVBQUU7U0FDVDtRQUVELE1BQU0sRUFBRTtJQUNaLENBQUMsRUFBQyxDQUFDO0lBRUYsTUFBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSztBQUN2QyxDQUFDO0FBdENELDBCQXNDQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDRCwyRkFBNkU7QUFFN0UsaUhBQWtEO0FBRWxELHlHQUE0QjtBQUM1Qix3R0FBb0Q7QUFDcEQsc0ZBQXdDO0FBQ3hDLHdIQUFrRDtBQUVsRCxNQUFxQixHQUFHO0lBTXBCLFlBQ2EsT0FBZSxFQUNmLE9BQWUsRUFDZixpQkFBaUIsS0FBSyxFQUN0QixVQUFVLEtBQUs7UUFIZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG1CQUFjLEdBQWQsY0FBYyxDQUFRO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFSbkIsYUFBUSxHQUFHLDJCQUFVLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkYsYUFBUSxHQUFHLGVBQUksRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRSxtQkFBYyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssb0JBQVc7UUE2QnBELFlBQU8sR0FBRyxDQUFDLFVBQWtCLEVBQVUsRUFBRSxDQUFDLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7UUFDckUsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckYsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUF0QnhGLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUNoQixPQUFPLElBQUksR0FBRyxDQUNWLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN4QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FDL0I7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ25FLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUMzQyxDQUFDO0lBTUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNGLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDMUYsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhLEVBQUUsSUFBZ0I7O1FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDL0MsTUFBTSxFQUFFLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEVBQUUsbUNBQUkscUJBQU8sRUFBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQUMsT0FBTztRQUVqRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEdBQUcseUJBQVMsRUFBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO1FBRS9DLE1BQU0sT0FBTyxHQUFRLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxlQUFDLENBQUMsU0FBUywwQ0FBRSxJQUFJLE1BQUssU0FBUyxJQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsUUFBQyxFQUFFLENBQUMsT0FBQyxDQUFDLElBQUksMENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsRUFBRSxFQUFFLENBQUM7UUFDdkosTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLGlEQUFpRDtRQUVySCxPQUFPLEdBQUc7SUFDZCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBRU4sTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUU5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssb0JBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdEMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssb0JBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdEMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUVsRCxDQUFDO0NBRUo7QUFqRkQseUJBaUZDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFGRCwyRkFBa0U7QUFHbEUseUdBQTRCO0FBQzVCLG1HQUF3QjtBQUV4QixzRkFBd0M7QUFDeEMsd0dBQW9EO0FBRXBELE1BQWEsVUFBVTtJQVVuQixZQUNhLFNBQWlCLEVBQ2pCLElBQVUsRUFDVixVQUFVLEtBQUs7UUFGZixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBWG5CLFdBQU0sR0FBRyxJQUFJO1FBQ2IsVUFBSyxHQUFHLElBQUk7UUFDWixVQUFLLEdBQUcsb0JBQVc7UUFDbkIsYUFBUSxHQUFHLGVBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pILG1CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBVztRQVdwRCxTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQUUsRUFBRTs7WUFBQyxXQUFJLFVBQVUsQ0FDdEMsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLHVCQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsR0FBRywwQ0FBRyxDQUFDLENBQUMsbUNBQUksQ0FBQyxJQUFDLEVBQ3ZDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQy9CO1NBQUE7UUFFRCxRQUFHLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYyxFQUFVLEVBQUUsV0FBQyxXQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztRQUM3RixZQUFPLEdBQUcsQ0FBQyxVQUFrQixFQUFVLEVBQUUsQ0FBQyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO1FBQ3JFLGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN2QixZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDL0YsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBWmhHLENBQUM7SUFjRCxRQUFRO1FBQ0osTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHO1FBQ2xELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFFZixJQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksVUFBVSxDQUFDLEVBQUU7WUFDaEMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQzlDLE9BQU8sRUFBRTtTQUNaO1FBRUQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUk7YUFDakIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxDQUFDO1FBRXZDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDaEIsQ0FBQztDQUVKO0FBcERELGdDQW9EQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REQsdUdBQXlDO0FBR3pDLDJIQUF1QztBQTZCdkMsU0FBZ0IsUUFBUSxDQUFDLFNBQWlCLEVBQUUsR0FBRyxJQUFVO0lBQ3JELE9BQU8sSUFBSSx1QkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7QUFDMUMsQ0FBQztBQUZELDRCQUVDO0FBRVksbUJBQVcsR0FBVyxJQUFJLHFCQUFXLEVBQUU7Ozs7Ozs7Ozs7Ozs7QUNoQ3BELE1BQXFCLFdBQVc7SUFBaEM7UUFFYSxhQUFRLEdBQUcsQ0FBQztRQUNaLGFBQVEsR0FBRyxFQUFFO1FBQ2IsVUFBSyxHQUFHLElBQUk7UUFDWixVQUFLLEdBQUcsSUFBSTtRQUNaLFdBQU0sR0FBRyxJQUFJO1FBQ2IsbUJBQWMsR0FBRyxLQUFLO1FBRS9CLFNBQUksR0FBRyxDQUFDLElBQWUsRUFBVSxFQUFFLENBQUMsSUFBSTtRQUN4QyxRQUFHLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYyxFQUFVLEVBQUUsQ0FBQyxLQUFLO1FBQ3RELFlBQU8sR0FBRyxDQUFDLFVBQWtCLEVBQVUsRUFBRSxDQUFDLFVBQVU7UUFDcEQsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUU7UUFDbkIsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxFQUFFO1FBQzlCLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBUSxFQUFFLENBQUMsRUFBRTtRQUMvQixVQUFLLEdBQUcsQ0FBQyxNQUFjLEVBQVMsRUFBRSxDQUFDLEVBQUU7UUFDckMsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUU7SUFFdkIsQ0FBQztDQUFBO0FBbEJELGlDQWtCQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCRCwyRkFBa0U7QUFHbEUsbUdBQXdCO0FBRXhCLHdHQUFvRDtBQUNwRCxzRkFBd0M7QUFFeEMsTUFBcUIsS0FBSztJQU90QixZQUNhLFNBQWlCLEVBQ2pCLFdBQW1CLEVBQ25CLFVBQVUsS0FBSyxFQUNmLFFBQWlCO1FBSGpCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVM7UUFUckIsVUFBSyxHQUFHLElBQUksQ0FBQyxTQUFTO1FBQ3RCLFVBQUssR0FBRyxJQUFJLENBQUMsV0FBVztRQUN4QixhQUFRLEdBQUcsMkJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM3RixtQkFBYyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssb0JBQVc7UUFXcEQsU0FBSSxHQUFHLENBQUMsSUFBZSxFQUFFLEVBQUU7O1lBQUMsV0FBSSxLQUFLLENBQ2pDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUMxQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDNUMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLE9BQU8sRUFDNUIsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFFBQVEsbUNBQUksSUFBSSxDQUFDLFFBQVEsQ0FDbEM7U0FBQTtRQU9ELGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN2QixRQUFHLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYyxFQUFVLEVBQUUsV0FBQyxXQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztRQUM3RixZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQWpCeEYsQ0FBQztJQVNELFFBQVE7O1FBQ0osTUFBTSxHQUFHLEdBQUcsR0FBRyxnQkFBSSxDQUFDLFFBQVEsMENBQUUsSUFBSSxtQ0FBSSxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzNHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUM3QyxDQUFDO0lBT0QsS0FBSyxDQUFDLE1BQWM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUN2QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQWtCO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDOUIsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTTtTQUNuQyxDQUFDO0lBQ04sQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sZUFBSSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7Q0FDSjtBQW5ERCwyQkFtREM7Ozs7Ozs7Ozs7Ozs7O0FDMURELHlGQUEyQztBQUMzQyxpSEFBMkQ7QUFDM0QsaUZBQXlDO0FBR3pDOzs7R0FHRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxTQUFtQixFQUFFLFlBQXNCO0lBRWpFLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0lBRTFELFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUUxQixJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDOUIsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNO2FBQ3pCO1FBRUwsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQWpCRCw4QkFpQkM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxTQUFtQixFQUFFLFlBQXNCO0lBQy9ELE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNyQixNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLEdBQVUsRUFBRSxHQUFVO0lBRWpDLE1BQU0sTUFBTSxHQUFVLEVBQUU7SUFFeEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNiLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFFYixJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLGlDQUFNLEVBQUUsR0FBSyxFQUFFLEVBQUc7YUFDaEM7UUFFTCxDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixPQUFPLGVBQUksRUFBQyxNQUFNLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEVBQU8sRUFBRSxFQUFPO0lBQy9CLE1BQU0sVUFBVSxHQUFHLCtCQUFZLEVBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLENBQVM7SUFDN0IsT0FBTyxDQUFDLENBQUMsUUFBUTtTQUNaLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1NBQzFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsRUFBRSxFQUFFLENBQUM7QUFDL0MsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEdBQVE7SUFDekIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFVLENBQUMsVUFBVSxDQUFDO0FBQzdELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDakVELDJIQUErRDtBQUMvRCw0R0FBcUQ7QUFDckQsNEdBQXFEO0FBQ3JELDBGQUFtRDtBQUNuRCwyR0FBd0U7QUFFeEUsd0dBQW1EO0FBQ25ELG1HQUFpRTtBQUNqRSwySUFBbUU7QUFJbkUsU0FBZ0IsT0FBTyxDQUFDLE9BQWdCLEVBQUUsR0FBWSxFQUFFLE9BQXFCLEVBQUU7O0lBRTNFLFVBQUksQ0FBQyxXQUFXLG9DQUFoQixJQUFJLENBQUMsV0FBVyxHQUFLLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztJQUU5QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSw0Q0FBNEM7UUFDaEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxHQUFHLENBQUM7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsdUJBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDakc7SUFFRCxJQUFJLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE1BQU0sRUFBRTtRQUNwQixPQUFPLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ2hEO1NBQU0sSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxJQUFJLEVBQUU7UUFDekIsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM5QztTQUFNLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsT0FBTyxFQUFFO1FBQzVCLE9BQU8sbUJBQW1CLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDakQ7U0FBTSxJQUFJLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFVBQVUsRUFBRTtRQUMvQixPQUFPLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ2xEO1NBQU0sSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxLQUFLLEVBQUU7UUFDMUIsT0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDeEM7U0FBTTtRQUNILE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzVDO0FBRUwsQ0FBQztBQXhCRCwwQkF3QkM7QUFHRCxTQUFTLGtCQUFrQixDQUFDLE9BQWdCLEVBQUUsR0FBWSxFQUFFLElBQW1CO0lBRTNFLHlEQUF5RDtJQUV6RCxJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXLEVBQUU7UUFDbkIsMkNBQTJDO0tBQzlDO1NBQU07UUFDSCxvQ0FBb0M7S0FDdkM7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBRW5DLHdEQUF3RDtJQUV4RCw2REFBNkQ7SUFDN0QsMERBQTBEO0lBQzFELGdJQUFnSTtJQUVoSSw2QkFBNkI7SUFDN0Isa0NBQWtDO0lBQ2xDLElBQUk7SUFFSixnQ0FBZ0M7SUFDaEMsMklBQTJJO0lBQzNJLDBDQUEwQztJQUMxQyw2Q0FBNkM7SUFFN0Msb0JBQW9CO0FBQ3hCLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWdCLEVBQUUsR0FBWSxFQUFFLElBQW1CO0lBQ3pFLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsd0RBQXNEO0FBQzNGLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE9BQWdCLEVBQUUsR0FBWSxFQUFFLElBQW1CO0lBQzVFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsT0FBZ0IsRUFBRSxHQUFZLEVBQUUsSUFBbUI7SUFDN0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztBQUN6QyxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsT0FBZ0IsRUFBRSxHQUFZLEVBQUUsSUFBbUI7O0lBRXZFLE1BQU0sRUFBRSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFFeEMsZ0RBQWdEO0lBQ2hELCtCQUErQjtJQUMvQix3QkFBd0I7SUFDeEIsTUFBTSxZQUFZLEdBQUcsTUFBRSxPQUFlLENBQUMsWUFBdUIsbUNBQUksb0JBQVc7SUFDN0UsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQWtCLDhDQUE4QztJQUU5SCxNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUvQyw2RkFBNkY7SUFDNUYsT0FBZSxDQUFDLFlBQVksR0FBRyxFQUFFO0lBRWxDLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBVSxDQUFDLENBQUM7SUFFN0YsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSw0REFBNEQ7UUFDaEYsT0FBTyxNQUFNO0tBQ2hCO0lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsMkNBQTJDO1FBQzVELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCO0lBRUQsdUNBQXVDO0lBQ3ZDLE9BQU8sS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBRTFELENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEdBQWEsRUFBRSxJQUFtQjs7SUFFMUQsTUFBTSxTQUFTLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksdUNBQWdCLEdBQUU7SUFDckQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztJQUNsSyxNQUFNLEtBQUssR0FBRyxDQUFDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO0lBQzNKLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssbUNBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsS0FBSywwQ0FBRSxXQUFXLElBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztJQUU1USxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUM3QyxpQkFBaUI7QUFFckIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsR0FBYSxFQUFFLElBQW1COztJQUUxRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBUTtJQUNoQyxNQUFNLFFBQVEsR0FBRyx1Q0FBZ0IsR0FBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxlQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLE1BQU87SUFDcEQsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBRXpILE9BQU8scUJBQVEsRUFBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFFakUsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUMsR0FBYSxFQUFFLElBQW1CO0lBQzlELE9BQU8sb0JBQVcsRUFBQyxPQUFPO0FBQzlCLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFhOztJQUU5QixNQUFNLENBQUMsR0FDSCxzQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsSUFBSSwwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUkscUJBQVEsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUQscUJBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFNBQVMsMENBQUUsSUFBSSwwQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLHFCQUFRLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RFLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLElBQUksMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxxQkFBUSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxRQUFRO0lBRTNCLElBQUksQ0FBQyxFQUFFO1FBQ0gsT0FBTyxJQUFJO0tBQ2Q7SUFFRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssbUNBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxJQUFJLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFXO0lBRWxDLCtEQUErRDtJQUMvRCxnRkFBZ0Y7SUFDaEYsbURBQW1EO0lBQ25ELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQztBQUV6RCxDQUFDO0FBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDLElBQUk7QUFFN0QsU0FBUyxXQUFXLENBQUMsTUFBYztJQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsb0JBQUMsQ0FBQyxTQUFTLDBDQUFFLFNBQVMsMENBQUcsQ0FBQyxDQUFFLElBQUMsa0JBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sRUFBRSxHQUFHLHVDQUFnQixHQUFFO0lBQzdCLE9BQU8sb0JBQVEsRUFBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNsQyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsT0FBZ0IsRUFBRSxHQUFhLEVBQUUsSUFBbUI7O0lBQ3BFLE1BQU0sQ0FBQyxHQUFHLHdCQUFNLENBQUMsTUFBTSxpQ0FBTSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSyxLQUFFLE9BQU8sRUFBRSxTQUFTLElBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksMENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sMENBQUUsS0FBSyxJQUFDLG1DQUFJLEVBQUU7SUFDMUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDckIsTUFBTSxDQUFDLEdBQUcsNkJBQVcsRUFBQyxDQUFDLENBQUM7SUFFeEIsSUFBSSxDQUFDLEVBQUU7UUFDSCxPQUFPLENBQUMsSUFBSSx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDWCxPQUFPLEVBQUU7S0FDWjtJQUVELE9BQU8sQ0FBQyxJQUFJLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsR0FBWTs7SUFDdEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFHLENBQUMsS0FBSywwQ0FBRSxNQUFNLE1BQUksU0FBRyxDQUFDLEtBQUssMENBQUUsSUFBSSxNQUFJLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sRUFBQztBQUN6RSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3pMRDs7R0FFRztBQUNVLGtCQUFVLEdBQUc7SUFDdEIsVUFBVSxFQUFFLFlBQVk7Q0FDM0I7Ozs7Ozs7Ozs7Ozs7O0FDVEQsU0FBZ0IsZ0JBQWdCO0lBQzVCLE1BQU0sS0FBSyxHQUFHLEtBQUssV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlDLE9BQU8sS0FBSztBQUNoQixDQUFDO0FBSEQsNENBR0M7QUFFRCxNQUFNLFdBQVcsR0FBRyx5QkFBeUIsRUFBRSxDQUFDO0FBRWhELFFBQVEsQ0FBQyxDQUFDLHlCQUF5QjtJQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDVixPQUFPLElBQUksRUFBRTtRQUNULENBQUMsRUFBRSxDQUFDO1FBQ0osTUFBTSxDQUFDLENBQUM7S0FDWDtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDVkQsU0FBZ0IsT0FBTyxDQUFDLEVBQU07SUFDMUIsT0FBTyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRkQsMEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsbUdBQW9DO0FBRXBDOztHQUVHO0FBRUgsU0FBZ0IsT0FBTyxDQUFDLEdBQVM7SUFDN0IsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMscUJBQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxxQkFBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ1JELFNBQWdCLFVBQVUsQ0FBQyxNQUFjO0lBQ3JDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2xFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUMsMkJBQTJCO0lBQzlDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFMRCxnQ0FLQzs7Ozs7Ozs7Ozs7Ozs7QUNORCw0RUFBNkI7QUFFN0I7O0dBRUc7QUFDSCxTQUFnQixZQUFZLENBQUMsRUFBWSxFQUFFLEVBQVk7SUFDbkQsT0FBTyxlQUFJLEVBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBSEQsb0NBR0M7Ozs7Ozs7Ozs7Ozs7O0FDUEQ7OztHQUdHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLE1BQWM7O0lBRXRDLE1BQU0sTUFBTSxHQUFHLFlBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLDBDQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFekMsSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtRQUMxQixPQUFPLFNBQVM7S0FDbkI7SUFFRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFFN0IsQ0FBQztBQVZELGtDQVVDOzs7Ozs7Ozs7Ozs7OztBQ2ZELFNBQWdCLGNBQWMsQ0FBbUIsR0FBRyxJQUFTLElBQVMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQXBGLHdDQUFvRjs7Ozs7Ozs7Ozs7Ozs7QUNBcEY7O0dBRUc7QUFDSCxTQUFnQixJQUFJLENBQUksR0FBUTtJQUM1QixJQUFJLElBQUksR0FBRyxFQUFTO0lBRXBCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzVELENBQUMsQ0FBQztBQUNOLENBQUM7QUFQRCxvQkFPQzs7Ozs7OztVQ1ZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9JbnN0cnVjdGlvblRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9OdW1iZXJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvU3RyaW5nVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3BhcnNlTnVtYmVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsImltcG9ydCB7IGV4dHJhcG9sYXRlLCBMZXhlbWUgfSBmcm9tICcuLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnLi4vdXRpbHMvdW5pcSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICAgICBwcm90ZWN0ZWQgbGV4ZW1lczogTGV4ZW1lW10gPSBbXSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGdldElkKCk6IElkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBUaGluZyB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKFxuICAgICAgICAgICAgdGhpcy5pZCwgLy8gY2xvbmVzIGhhdmUgc2FtZSBpZFxuICAgICAgICAgICAgdGhpcy5iYXNlcy5tYXAoeCA9PiB4LmNsb25lKCkpLFxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jaGlsZHJlbikubWFwKGUgPT4gKHsgW2VbMF1dOiBlWzFdLmNsb25lKCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSksXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHRlbmRzID0gKHRoaW5nOiBUaGluZykgPT4ge1xuICAgICAgICB0aGlzLnVuZXh0ZW5kcyh0aGluZykgLy8gb3IgYXZvaWQ/XG4gICAgICAgIHRoaXMuYmFzZXMucHVzaCh0aGluZy5jbG9uZSgpKVxuICAgIH1cblxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNlcyA9IHRoaXMuYmFzZXMuZmlsdGVyKHggPT4geC5nZXRJZCgpICE9PSB0aGluZy5nZXRJZCgpKVxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltwMV1cbiAgICAgICAgY29uc3QgcmVzID0gcGFydHMubGVuZ3RoID4gMSA/IGNoaWxkLmdldChwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykpIDogY2hpbGRcbiAgICAgICAgcmV0dXJuIHJlcyA/PyB0aGlzLmJhc2VzLmZpbmQoeCA9PiB4LmdldChpZCkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baWRdID0gdGhpbmdcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSAvLyBldmVyeSB0aGluZyBpcyBhIHRoaW5nXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcyAvL1RPRE9vb29vb29vb09PIVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMudG9DbGF1c2UocXVlcnkpLnF1ZXJ5KHF1ZXJ5LCB7LyogaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgICovIH0pKVxuICAgIH1cblxuICAgIHRvQ2xhdXNlID0gKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlID0+IHtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IHgucmVmZXJlbnRzLm1hcChyID0+IGNsYXVzZU9mKHgsIHIuZ2V0SWQoKSkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHkgPSBPYmplY3RcbiAgICAgICAgICAgIC5rZXlzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeyByb290OiAnb2YnLCB0eXBlOiAncHJlcG9zaXRpb24nLCByZWZlcmVudHM6IFtdIH0sIHgsIHRoaXMuaWQpKSAvLyBoYXJkY29kZWQgZW5nbGlzaCFcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCB6ID0gT2JqZWN0XG4gICAgICAgICAgICAudmFsdWVzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4geC50b0NsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHguYW5kKHkpLmFuZCh6KS5zaW1wbGVcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4geC5yb290ID09PSBsZXhlbWUucm9vdClcbiAgICAgICAgY29uc3QgdXBkYXRlZDogTGV4ZW1lW10gPSBvbGQubWFwKHggPT4gKHsgLi4ueCwgLi4ubGV4ZW1lLCByZWZlcmVudHM6IFsuLi54LnJlZmVyZW50cywgLi4ubGV4ZW1lLnJlZmVyZW50c10gfSkpXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB0b0JlQWRkZWQgPSB1cGRhdGVkLmxlbmd0aCA/IHVwZGF0ZWQgOiBbbGV4ZW1lXVxuICAgICAgICB0aGlzLmxleGVtZXMucHVzaCguLi50b0JlQWRkZWQpXG4gICAgICAgIGNvbnN0IGV4dHJhcG9sYXRlZCA9IHRvQmVBZGRlZC5mbGF0TWFwKHggPT4gZXh0cmFwb2xhdGUoeCwgdGhpcykpXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLmV4dHJhcG9sYXRlZClcblxuICAgIH1cblxuICAgIGdldExleGVtZSA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgICAgICAgICAuYXQoMClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZXh0cmFwb2xhdGUsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29udGV4dCBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSBjb25maWcuc3ludGF4ZXMsXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IGNvbmZpZy5sZXhlbWVzLmZsYXRNYXAobCA9PiBbbCwgLi4uZXh0cmFwb2xhdGUobCldKSxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICkge1xuICAgICAgICBzdXBlcihpZCwgYmFzZXMsIGNoaWxkcmVuLCBsZXhlbWVzKVxuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHsgLy9UT0RPIVxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRzOiBbXSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgfVxuXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWZyZXNoU3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TGlzdFxuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQXN0Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ25vdW4nLCByb290OiBzeW50YXgubmFtZSwgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdCA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGNsb25lKCk6IENvbnRleHQge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgICAgICB0aGlzLnN5bnRheE1hcCxcbiAgICAgICAgICAgIHRoaXMubGV4ZW1lcyxcbiAgICAgICAgICAgIHRoaXMuYmFzZXMsXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLCAvL3NoYWxsb3cgb3IgZGVlcD9cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IEJhc2ljQ29udGV4dCB9IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBUaGluZyB7XG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW11cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW11cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZ1xuICAgIGNsb25lKCk6IENvbnRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQob3B0czogeyBpZDogSWQgfSk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KG9wdHMuaWQpXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvblRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBBc3ROb2RlKSB7XG4gICAgICAgIHN1cGVyKGdldEluY3JlbWVudGFsSWQoKSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHZhbHVlICsgJycpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSBhcyBhbnlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcih2YWx1ZSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlIGFzIGFueSAvL2pzIHN1Y2tzXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGhpbmcge1xuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIHRoaW5nOiBUaGluZyk6IHZvaWQgLy90aGluZy5pZD8/P1xuICAgIGNsb25lKCk6IFRoaW5nXG4gICAgdG9KcygpOiBvYmplY3RcbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIGdldElkKCk6IElkXG4gICAgZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgdW5leHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldExleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyYiBleHRlbmRzIFRoaW5nIHtcbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBbcm9sZSBpbiBWZXJiQXJnc106IFRoaW5nIH0pOiBUaGluZ1tdIC8vIGNhbGxlZCBkaXJlY3RseSBpbiBldmFsVmVyYlNlbnRlbmNlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoaW5nKGFyZ3M6IHsgaWQ6IElkLCBiYXNlczogVGhpbmdbXSB9KSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoYXJncy5pZCwgYXJncy5iYXNlcylcbn1cblxudHlwZSBWZXJiQXJncyA9ICdzdWJqZWN0J1xuICAgIHwgJ2RpcmVjdE9iamVjdCdcbiAgICB8ICdpbmRpcmVjdE9iamVjdCdcbiAgICAvLyAuLi5cbiIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4vcHJlbHVkZVwiXG5pbXBvcnQgeyBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIC8vIHRoaW5ncyxcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICd2ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bicsXG4gICdmaWxsZXInLFxuICAna2V5d29yZCcsXG4gICdleGNlcHQtd29yZCcsXG4gICdxdW90ZScsXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtcblxuICAgIHsgcm9vdDogJ21ha3JvJywgdHlwZTogJ2tleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LCAvL1RPRE8hIDIrXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ25vdCcsIHR5cGU6ICduZWdhdGlvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0aGVuJywgdHlwZTogJ2ZpbGxlcicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcuJywgdHlwZTogJ2Z1bGxzdG9wJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29wdGlvbmFsJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnMXwwJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29uZS1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29yJywgdHlwZTogJ2Rpc2p1bmMnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuZCcsIHR5cGU6ICdub25zdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2xlZnQnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3JpZ2h0JywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdjb25kaXRpb24nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbnNlcXVlbmNlJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoZScsIHR5cGU6ICdkZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaWYnLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd3aGVuJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW55JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V2ZXJ5JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29mJywgdHlwZTogJ3ByZXBvc2l0aW9uJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoYXQnLCB0eXBlOiAncmVscHJvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpdCcsIHR5cGU6ICdwcm9ub3VuJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2hhdmUnLCB0eXBlOiAndmVyYicsIHJlZmVyZW50czogW10gfSwvL3Rlc3RcbiAgICB7IHJvb3Q6ICdleGNlcHQnLCB0eXBlOiAnZXhjZXB0LXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnXCInLCB0eXBlOiAncXVvdGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndG9rZW4nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG5dXG5cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmcgPVxuXG4gIGBcbiAgbWFrcm8gXG4gICAgYW55LWxleGVtZSBpcyBhZGplY3RpdmUgXG4gICAgICAgICAgICBvciBjb3B1bGEgXG4gICAgICAgICAgICBvciBkZWZhcnQgXG4gICAgICAgICAgICBvciBpbmRlZmFydCBcbiAgICAgICAgICAgIG9yIGZ1bGxzdG9wIFxuICAgICAgICAgICAgb3IgaHZlcmIgXG4gICAgICAgICAgICBvciB2ZXJiIFxuICAgICAgICAgICAgb3IgbmVnYXRpb24gXG4gICAgICAgICAgICBvciBleGlzdHF1YW50IFxuICAgICAgICAgICAgb3IgdW5pcXVhbnQgXG4gICAgICAgICAgICBvciByZWxwcm9uIFxuICAgICAgICAgICAgb3IgbmVnYXRpb24gXG4gICAgICAgICAgICBvciBub3VuIFxuICAgICAgICAgICAgb3IgcHJlcG9zaXRpb24gXG4gICAgICAgICAgICBvciBzdWJjb25qIFxuICAgICAgICAgICAgb3Igbm9uc3ViY29uaiBcbiAgICAgICAgICAgIG9yIGRpc2p1bmMgXG4gICAgICAgICAgICBvciBwcm9ub3VuIFxuICAgICAgICAgICAgb3IgZmlsbGVyIFxuICAgICAgICAgICAgb3Iga2V5d29yZCBcbiAgICAgICAgICAgIG9yIGV4Y2VwdC13b3JkIFxuICAgICAgICAgICAgb3IgcXVvdGVcbiAgbWFrcm8uXG4gIFxuICBtYWtybyBcbiAgICBxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIGFydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0IFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjb21wbGVtZW50IGlzIHByZXBvc2l0aW9uIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBub3VuLXBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgdGhlbiBvcHRpb25hbCBhcnRpY2xlIFxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgYWRqZWN0aXZlcyBcbiAgICAgIHRoZW4gemVyby1vci1tb3JlIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIFxuICAgICAgdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgXG4gICAgICB0aGVuIHplcm8tb3ItbW9yZSBjb21wbGVtZW50cyBcbiAgbWFrcm8uXG5cbiAgbWFrcm8gXG4gICAgY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2UgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIG12ZXJic3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiB2ZXJiIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlIG9yIG12ZXJic3ViY2xhdXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBhbmQtc2VudGVuY2UgaXMgbGVmdCBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2UgXG4gICAgICB0aGVuIG5vbnN1YmNvbmogXG4gICAgICB0aGVuIG9uZS1vci1tb3JlIHJpZ2h0IGFuZC1zZW50ZW5jZSBvciBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2VcbiAgbWFrcm8uXG5cbiAgbWFrcm8gXG4gICAgdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgICAgdGhlbiBvcHRpb25hbCBodmVyYiB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgdGhlbiB2ZXJiIHRoZW4gb3B0aW9uYWwgb2JqZWN0IG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIHZlcmItc2VudGVuY2UgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIGNzMSBpcyBzdWJjb25qIFxuICAgICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlIFxuICAgICAgdGhlbiBmaWxsZXIgXG4gICAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjczIgaXMgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlIFxuICAgICAgdGhlbiBzdWJjb25qIFxuICAgICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIHN0cmluZyBpcyBxdW90ZSB0aGVuIG9uZS1vci1tb3JlIHRva2VuIGFueS1sZXhlbWUgZXhjZXB0IHF1b3RlIHRoZW4gcXVvdGUgXG4gIG1ha3JvLlxuXG4gIGBcbiIsImltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBDb21wb3NpdGVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGNvbnN0aXR1ZW50VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ21hY3JvJyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAndGFnZ2VkdW5pb24nLFxuICAgICdleGNlcHR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gWydtYWNybyddXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsna2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsna2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWydleGNlcHR1bmlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydmaWxsZXInXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91biddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2V4Y2VwdHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZXhjZXB0LXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgIF1cblxufSIsImltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tIFwiLi4vYmFja2VuZC9Db250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uL21pZGRsZS9ldmFsQXN0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgcmVhZG9ubHkgY29udGV4dCA9IGdldENvbnRleHQoeyBpZDogJ2dsb2JhbCcgfSlcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGUodGhpcy5jb250ZXh0LmdldFByZWx1ZGUoKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW10ge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBldmFsQXN0KHRoaXMuY29udGV4dCwgYXN0KVxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IG9iamVjdFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShuYXRsYW5nKS5tYXAoeCA9PiB4LnRvSnMoKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXVxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogb2JqZWN0W11cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCB0b2tlbnM6IExleGVtZVtdID0gW11cbiAgICBwcm90ZWN0ZWQgd29yZHM6IHN0cmluZ1tdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuICAgICAgICB0aGlzLndvcmRzID1cbiAgICAgICAgICAgIHNwYWNlT3V0KHNvdXJjZUNvZGUsIFsnXCInLCAnLiddKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMud29yZHMpXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICB9XG5cbiAgICByZWZyZXNoVG9rZW5zKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMud29yZHMubWFwKHcgPT4gdGhpcy5jb250ZXh0LmdldExleGVtZSh3KSA/PyBtYWtlTGV4ZW1lKHsgcm9vdDogdywgdG9rZW46IHcsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbnMoKVxuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gc3BhY2VPdXQoc291cmNlQ29kZTogc3RyaW5nLCBzcGVjaWFsQ2hhcnM6IHN0cmluZ1tdKSB7XG4gICAgLy8gbGV0IHJlcyA9ICcnXG5cbiAgICAvLyBmb3IgKGNvbnN0IGMgb2Ygc291cmNlQ29kZSkge1xuICAgIC8vIHJlcyArPSBzcGVjaWFsQ2hhcnMuaW5jbHVkZXMoYykgPyAnICcgKyBjICsgJyAnIDogY1xuICAgIC8vIH1cblxuICAgIHJldHVybiBzb3VyY2VDb2RlXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gYSArIChzcGVjaWFsQ2hhcnMuaW5jbHVkZXMoYykgPyAnICcgKyBjICsgJyAnIDogYyksICcnKVxuXG5cblxuICAgIC8vIHJldHVybiByZXNcbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICByZWFkb25seSByb290OiBzdHJpbmdcbiAgICByZWFkb25seSB0eXBlOiBMZXhlbWVUeXBlXG4gICAgcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbiAgICByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVmZXJlbnRzOiBUaGluZ1tdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IExleGVtZSk6IExleGVtZSB7XG4gICAgcmV0dXJuIGRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGx1cmFsKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGlzUmVwZWF0YWJsZShsZXhlbWUuY2FyZGluYWxpdHkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYXBvbGF0ZShsZXhlbWU6IExleGVtZSwgY29udGV4dD86IFRoaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicgJiYgIWlzUGx1cmFsKGxleGVtZSkpIHtcbiAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogcGx1cmFsaXplKGxleGVtZS5yb290KSxcbiAgICAgICAgICAgIGNhcmRpbmFsaXR5OiAnKicsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSldXG4gICAgfVxuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAndmVyYicpIHtcbiAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZShsZXhlbWUucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHgsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5nZXRTeW50YXhMaXN0KCkpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2ltcGxlQXN0ID0gdGhpcy5zaW1wbGlmeShhc3QpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc2ltcGxlQXN0KVxuXG4gICAgICAgICAgICBpZiAoc2ltcGxlQXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2V0U3ludGF4KGFzdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUsIGV4Y2VwdFR5cGVzPzogQXN0VHlwZVtdKSB7IC8vcHJvYmxlbWF0aWNcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4ICYmICFleGNlcHRUeXBlcz8uaW5jbHVkZXMoeC50eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSwgbS5leGNlcHRUeXBlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldExleGVtZVR5cGVzKCkuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoIWFzdC5saW5rcykge1xuICAgICAgICAgICAgcmV0dXJuIGFzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSAmJiBPYmplY3QudmFsdWVzKGFzdC5saW5rcykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShPYmplY3QudmFsdWVzKGFzdC5saW5rcylbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLm1hcChsID0+ICh7IFtsWzBdXTogdGhpcy5zaW1wbGlmeShsWzFdKSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCBsaW5rczogc2ltcGxlTGlua3MgfVxuXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ub3VuKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIGNvbnN0IGV4Y2VwdFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8uZXhjZXB0dW5pb24/LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IG5vdEdyYW1tYXJzID0gZXhjZXB0VW5pb25zLm1hcCh4ID0+IHgubGlua3M/Lm5vdW4pXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eSxcbiAgICAgICAgZXhjZXB0VHlwZTogbm90R3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9mYWNhZGUvQnJhaW5cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIGJyYWluOiBnZXRCcmFpbigpLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGVVbndyYXBwZWQodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBtYWluKClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSk7XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBzb2x2ZU1hcHMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvc29sdmVNYXBzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIClcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCR7eWVzfWAgOiB5ZXNcbiAgICB9XG5cbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHsgLy8gY2FuJ3QgYmUgcHJvcCwgYmVjYXVzZSB3b3VsZCBiZSBjYWxsZWQgaW4gQW5kJ3MgY29ucywgQmFzaWNDbHVzZS5hbmQoKSBjYWxscyBBbmQncyBjb25zLCBcXGluZiByZWN1cnNpb24gZW5zdWVzXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCBpdCA9IG9wdHM/Lml0ID8/IHNvcnRJZHModW5pdmVyc2UuZW50aXRpZXMpLmF0KC0xKSEgLy9UT0RPIVxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlTGlzdCA9IHVuaXZlcnNlLmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgcXVlcnlMaXN0ID0gcXVlcnkuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBtYXBzID0gc29sdmVNYXBzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgICAgIGNvbnN0IHByb25NYXA6IE1hcCA9IHF1ZXJ5TGlzdC5maWx0ZXIoYyA9PiBjLnByZWRpY2F0ZT8udHlwZSA9PT0gJ3Byb25vdW4nKS5tYXAoYyA9PiAoeyBbYy5hcmdzPy5hdCgwKSFdOiBpdCB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgY29uc3QgcmVzID0gbWFwcy5jb25jYXQocHJvbk1hcCkuZmlsdGVyKG0gPT4gT2JqZWN0LmtleXMobSkubGVuZ3RoKSAvLyBlbXB0eSBtYXBzIGNhdXNlIHByb2JsZW1zIGFsbCBhcm91bmQgdGhlIGNvZGUhXG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcblxuZXhwb3J0IGNsYXNzIEF0b21DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgQXRvbUNsYXVzZShcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXA/LlthXSA/PyBhKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICApXG5cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGlmICghKHF1ZXJ5IGluc3RhbmNlb2YgQXRvbUNsYXVzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJlZGljYXRlLnJvb3QgIT09IHF1ZXJ5LnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHF1ZXJ5LmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBBdG9tQ2xhdXNlIH0gZnJvbSBcIi4vQXRvbUNsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcblxuLyoqXG4gKiBBbiB1bmFtYmlndW91cyBwcmVkaWNhdGUtbG9naWMtbGlrZSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBwcm9ncmFtbWVyJ3MgaW50ZW50LlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzPzogYm9vbGVhblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBBdG9tQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IGZhbHNlXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpcy5jb25kaXRpb25cbiAgICByZWFkb25seSByaGVtZSA9IHRoaXMuY29uc2VxdWVuY2VcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jb25kaXRpb24udG9TdHJpbmcoKSArIHRoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEltcGx5KFxuICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICBvcHRzPy5zdWJqY29uaiA/PyB0aGlzLnN1Ympjb25qLFxuICAgIClcblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnN1Ympjb25qPy5yb290ID8/ICcnfSAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW3RoaXNdXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHtcbiAgICAgICAgICAgIGNsYXVzZTE6IHRoaXMuY29uZGl0aW9uLnNpbXBsZSxcbiAgICAgICAgICAgIGNsYXVzZTI6IHRoaXMuY29uc2VxdWVuY2Uuc2ltcGxlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxufSIsImltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9pZC9NYXBcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaW50ZXJzZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2ludGVyc2VjdGlvblwiO1xuaW1wb3J0IHsgU3BlY2lhbElkcyB9IGZyb20gXCIuLi8uLi9pZC9JZFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG4vKipcbiAqIEZpbmRzIHBvc3NpYmxlIE1hcC1pbmdzIGZyb20gcXVlcnlMaXN0IHRvIHVuaXZlcnNlTGlzdFxuICoge0BsaW5rIFwiZmlsZTovLy4vLi4vLi4vLi4vLi4vLi4vZG9jcy9ub3Rlcy91bmlmaWNhdGlvbi1hbGdvLm1kXCJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb2x2ZU1hcHMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdIHtcblxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBmaW5kQ2FuZGlkYXRlcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgIGNhbmRpZGF0ZXMuZm9yRWFjaCgobWwxLCBpKSA9PiB7XG4gICAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaCgobWwyLCBqKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtbDEubGVuZ3RoICYmIG1sMi5sZW5ndGggJiYgaSAhPT0gaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlKG1sMSwgbWwyKVxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbaV0gPSBbXVxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbal0gPSBtZXJnZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gY2FuZGlkYXRlcy5mbGF0KCkuZmlsdGVyKHggPT4gIWlzSW1wb3NpYmxlKHgpKVxufVxuXG5mdW5jdGlvbiBmaW5kQ2FuZGlkYXRlcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW11bXSB7XG4gICAgcmV0dXJuIHF1ZXJ5TGlzdC5tYXAocSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHVuaXZlcnNlTGlzdC5mbGF0TWFwKHUgPT4gdS5xdWVyeShxKSlcbiAgICAgICAgcmV0dXJuIHJlcy5sZW5ndGggPyByZXMgOiBbbWFrZUltcG9zc2libGUocSldXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbWVyZ2UobWwxOiBNYXBbXSwgbWwyOiBNYXBbXSkge1xuXG4gICAgY29uc3QgbWVyZ2VkOiBNYXBbXSA9IFtdXG5cbiAgICBtbDEuZm9yRWFjaChtMSA9PiB7XG4gICAgICAgIG1sMi5mb3JFYWNoKG0yID0+IHtcblxuICAgICAgICAgICAgaWYgKG1hcHNBZ3JlZShtMSwgbTIpKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5tMSwgLi4ubTIgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gdW5pcShtZXJnZWQpXG59XG5cbmZ1bmN0aW9uIG1hcHNBZ3JlZShtMTogTWFwLCBtMjogTWFwKSB7XG4gICAgY29uc3QgY29tbW9uS2V5cyA9IGludGVyc2VjdGlvbihPYmplY3Qua2V5cyhtMSksIE9iamVjdC5rZXlzKG0yKSlcbiAgICByZXR1cm4gY29tbW9uS2V5cy5ldmVyeShrID0+IG0xW2tdID09PSBtMltrXSlcbn1cblxuZnVuY3Rpb24gbWFrZUltcG9zc2libGUocTogQ2xhdXNlKTogTWFwIHtcbiAgICByZXR1cm4gcS5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgW3hdOiBTcGVjaWFsSWRzLklNUE9TU0lCTEUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxufVxuXG5mdW5jdGlvbiBpc0ltcG9zaWJsZShtYXA6IE1hcCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG1hcCkuaW5jbHVkZXMoU3BlY2lhbElkcy5JTVBPU1NJQkxFKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vYmFja2VuZC9Db250ZXh0XCI7XG5pbXBvcnQgeyBJbnN0cnVjdGlvblRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvSW5zdHJ1Y3Rpb25UaGluZ1wiO1xuaW1wb3J0IHsgTnVtYmVyVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9OdW1iZXJUaGluZ1wiO1xuaW1wb3J0IHsgU3RyaW5nVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9TdHJpbmdUaGluZ1wiO1xuaW1wb3J0IHsgVGhpbmcsIGdldFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvVGhpbmdcIjtcbmltcG9ydCB7IGlzUGx1cmFsLCBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSBcIi4uL3V0aWxzL3BhcnNlTnVtYmVyXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuL2lkL01hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7IC8vVE9ETzogb3B0aW9uIHRvIGRpc2FibGUgc2lkZSBlZmZlY3RzIChmb3IgZXhhbXBsZSBmb3IgaWYgY29uZGl0aW9uKVxuXG4gICAgYXJncy5zaWRlRWZmZWN0cyA/Pz0gY291bGRIYXZlU2lkZUVmZmVjdHMoYXN0KVxuXG4gICAgaWYgKGFyZ3Muc2lkZUVmZmVjdHMpIHsgLy8gb25seSBjYWNoZSBpbnN0cnVjdGlvbnMgd2l0aCBzaWRlIGVmZmVjdHNcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBuZXcgSW5zdHJ1Y3Rpb25UaGluZyhhc3QpXG4gICAgICAgIGNvbnRleHQuc2V0KGluc3RydWN0aW9uLmdldElkKCksIGluc3RydWN0aW9uKVxuICAgICAgICBjb250ZXh0LnNldExleGVtZShtYWtlTGV4ZW1lKHsgcm9vdDogJ2luc3RydWN0aW9uJywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFtpbnN0cnVjdGlvbl0gfSkpXG4gICAgfVxuXG4gICAgaWYgKGFzdD8ubGlua3M/LmNvcHVsYSkge1xuICAgICAgICByZXR1cm4gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnZlcmIpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8uc3ViY29uaikge1xuICAgICAgICByZXR1cm4gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5ub25zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcG91bmRTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5xdW90ZSkge1xuICAgICAgICByZXR1cm4gZXZhbFN0cmluZyhjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9XG5cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICAvL1RPRE8gYXNzaWdtZW50IG9yIGNvbXBhcmlzb24sIGJhc2VkIG9uIGFyZ3Muc2lkZUVmZmVjdHNcblxuICAgIGlmIChhcmdzPy5zaWRlRWZmZWN0cykge1xuICAgICAgICAvLyBhc3NpZ24gdGhlIHJpZ2h0IHZhbHVlIHRvIHRoZSBsZWZ0IHZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29tcGFyZSB0aGUgcmlnaHQgYW5kIGxlZnQgdmFsdWVzXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb3B1bGEgc2VudGVuY2UhJylcblxuICAgIC8vIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG5cbiAgICAvLyBjb25zdCBtYXliZVN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdD8ubGlua3M/LnN1YmplY3QpXG4gICAgLy8gY29uc3Qgc3ViamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5zdWJqZWN0KVxuICAgIC8vIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0Py5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogdHJ1ZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG5cbiAgICAvLyBpZiAobWF5YmVTdWJqZWN0Lmxlbmd0aCkge1xuICAgIC8vICAgICByZXR1cm4gbWF5YmVTdWJqZWN0IC8vIFRPRE9cbiAgICAvLyB9XG5cbiAgICAvLyBjb25zdCBuZXdUaGluZyA9IHByZWRpY2F0ZVswXVxuICAgIC8vIGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gc3ViamVjdC5mbGF0TGlzdCgpLmZpbHRlcih4ID0+IHgucHJlZGljYXRlKS5tYXAoeCA9PiB4LnByZWRpY2F0ZSEpLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogW25ld1RoaW5nXSB9KSlcbiAgICAvLyBjb250ZXh0LnNldChuZXdUaGluZy5nZXRJZCgpLCBuZXdUaGluZylcbiAgICAvLyBsZXhlbWVzLmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcblxuICAgIC8vIHJldHVybiBbbmV3VGhpbmddXG59XG5cbmZ1bmN0aW9uIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2ZXJiIHNlbnRlbmNlIScpLy8gY29udGV4dC5nZXRMZXhlbWUoYXN0Py5saW5rcz8ubXZlcmI/LmxleGVtZT8ucm9vdCEpXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb21wbGV4IHNlbnRlbmNlIScpXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93IG5ldyBFcnJvcignY29tcG91bmQgc2VudGVuY2UhJylcbn1cblxuZnVuY3Rpb24gZXZhbE5vdW5QaHJhc2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBjb25zdCBucCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG5cbiAgICAvLyBjaGVja3MgZm9yIFRoaW5ncyB0aGF0IG1hdGNoIGdpdmVuIG5vdW5waHJhc2VcbiAgICAvLyAxLiBpbiBjdXJyZW50IHNlbnRlbmNlIHNjb3BlXG4gICAgLy8gMi4gaW4gYnJvYWRlciBjb250ZXh0XG4gICAgY29uc3QgY3VycmVudFNjb3BlID0gKChjb250ZXh0IGFzIGFueSkuY3VycmVudFNjb3BlIGFzIENsYXVzZSkgPz8gZW1wdHlDbGF1c2VcbiAgICBjb25zdCBtYXBzID0gY3VycmVudFNjb3BlLnF1ZXJ5KG5wKS5jb25jYXQoY29udGV4dC5xdWVyeShucCkpOyAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5wMiA9IG5wLmNvcHkoe21hcCA6IG1hcHNbMF0gPz8ge319KTtcblxuICAgIGNvbnN0IGludGVyZXN0aW5nSWRzID0gZ2V0SW50ZXJlc3RpbmdJZHMobWFwcyk7XG5cbiAgICAvLyBUTVAgKG9ubHkpIHVzZSBjb250ZXh0IHRvIHBhc3MgYXJvdW5kIGRhdGEgYWJvdXQgXCJjdXJycmVudCBzZW50ZW5jZVwiLCB5dWNrISBQT1NTSUJMRSBCVUdTIVxuICAgIChjb250ZXh0IGFzIGFueSkuY3VycmVudFNjb3BlID0gbnBcblxuICAgIGNvbnN0IHRoaW5ncyA9IGludGVyZXN0aW5nSWRzLm1hcChpZCA9PiBjb250ZXh0LmdldChpZCkpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IHggYXMgVGhpbmcpO1xuXG4gICAgaWYgKGlzQXN0UGx1cmFsKGFzdCkpIHsgLy8gaWYgdW5pdmVyc2FsIHF1YW50aWZpZWQsIEkgZG9uJ3QgY2FyZSBpZiB0aGVyZSdzIG5vIG1hdGNoXG4gICAgICAgIHJldHVybiB0aGluZ3NcbiAgICB9XG5cbiAgICBpZiAodGhpbmdzLmxlbmd0aCkgeyAvLyBub24tcGx1cmFsLCByZXR1cm4gc2luZ2xlIGV4aXN0aW5nIFRoaW5nXG4gICAgICAgIHJldHVybiB0aGluZ3Muc2xpY2UoMCwgMSlcbiAgICB9XG5cbiAgICAvLyBvciBlbHNlIGNyZWF0ZSBhbmQgcmV0dXJucyB0aGUgVGhpbmdcbiAgICByZXR1cm4gYXJncz8uYXV0b3ZpdmlmaWNhdGlvbiA/IFtjcmVhdGVUaGluZyhucCldIDogW11cblxufVxuXG5mdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSAoYXN0Py5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdKS5tYXAoeCA9PiB4LmxleGVtZSEpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHN1YmplY3RJZCkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgIGNvbnN0IG5vdW5zID0gKGFzdD8ubGlua3M/LnN1YmplY3Q/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3QgY29tcGxlbWVudHMgPSBPYmplY3QudmFsdWVzKGFzdD8ubGlua3MgPz8ge30pLmZpbHRlcih4ID0+IHgubGlzdCkuZmxhdE1hcCh4ID0+IHgubGlzdCEpLmZpbHRlcih4ID0+IHgubGlua3M/LnByZXBvc2l0aW9uKS5tYXAoeCA9PiBjb21wbGVtZW50VG9DbGF1c2UoeCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgcmV0dXJuIGFkamVjdGl2ZXMuYW5kKG5vdW5zKS5hbmQoY29tcGxlbWVudHMpXG4gICAgLy9UT0RPOiBzdWJjbGF1c2VcblxufVxuXG5mdW5jdGlvbiBjb21wbGVtZW50VG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0IVxuICAgIGNvbnN0IG9iamVjdElkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBhc3Q/LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lIVxuICAgIGNvbnN0IG9iamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViamVjdElkLCBvYmplY3RJZCkuYW5kKG9iamVjdClcblxufVxuXG5mdW5jdGlvbiByZWxhdGl2ZUNsYXVzZVRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuICAgIHJldHVybiBlbXB0eUNsYXVzZSAvL1RPRE8hXG59XG5cbmZ1bmN0aW9uIGlzQXN0UGx1cmFsKGFzdD86IEFzdE5vZGUpOiBib29sZWFuIHtcblxuICAgIGNvbnN0IHggPVxuICAgICAgICBhc3Q/LmxpbmtzPy5ub3VuPy5saXN0Py5zb21lKHggPT4geC5sZXhlbWUgJiYgaXNQbHVyYWwoeC5sZXhlbWUpKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZSAmJiBpc1BsdXJhbCh4LmxleGVtZSkpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnN1YmplY3Q/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZSAmJiBpc1BsdXJhbCh4LmxleGVtZSkpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnVuaXF1YW50XG5cbiAgICBpZiAoeCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGFzdD8ubGlua3MgPz8ge30pLmNvbmNhdChhc3Q/Lmxpc3QgPz8gW10pLnNvbWUoeCA9PiBpc0FzdFBsdXJhbCh4KSlcbn1cblxuZnVuY3Rpb24gZ2V0SW50ZXJlc3RpbmdJZHMobWFwczogTWFwW10pOiBJZFtdIHtcblxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlIFwiY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uXCIgXG4gICAgLy8gaGFzIGJ1dHRvbklkLnN0eWxlLmNvbG9yIGFuZCB0aGF0J3MgdGhlIG9iamVjdCB0aGUgc2VudGVuY2Ugc2hvdWxkIHJlc29sdmUgdG9cbiAgICAvLyBwb3NzaWJsZSBwcm9ibGVtIGlmIFwiY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b25cIlxuICAgIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxufVxuXG5jb25zdCBnZXROdW1iZXJPZkRvdHMgPSAoaWQ6IElkKSA9PiBpZC5zcGxpdCgnLicpLmxlbmd0aCAvLy0xXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuICAgIGNvbnN0IGJhc2VzID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGU/LnJlZmVyZW50cz8uWzBdISkvKiBPTkxZIEZJUlNUPyAqLy5maWx0ZXIoeCA9PiB4KVxuICAgIGNvbnN0IGlkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgcmV0dXJuIGdldFRoaW5nKHsgaWQsIGJhc2VzIH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxTdHJpbmcoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIGNvbnN0IHggPSBPYmplY3QudmFsdWVzKHsgLi4uYXN0Py5saW5rcywgJ3F1b3RlJzogdW5kZWZpbmVkIH0pLmZpbHRlcih4ID0+IHgpLmF0KDApPy5saXN0Py5tYXAoeCA9PiB4LmxleGVtZT8udG9rZW4pID8/IFtdXG4gICAgY29uc3QgeSA9IHguam9pbignICcpXG4gICAgY29uc3QgeiA9IHBhcnNlTnVtYmVyKHkpXG5cbiAgICBpZiAoeikge1xuICAgICAgICByZXR1cm4gW25ldyBOdW1iZXJUaGluZyh6KV1cbiAgICB9XG5cbiAgICBpZiAoIXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHJldHVybiBbbmV3IFN0cmluZ1RoaW5nKHkpXVxufVxuXG5mdW5jdGlvbiBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3Q6IEFzdE5vZGUpIHsgLy8gYW55dGhpbmcgdGhhdCBpcyBub3QgYSBub3VucGhyYXNlIENPVUxEIGhhdmUgc2lkZSBlZmZlY3RzXG4gICAgcmV0dXJuICEhKGFzdC5saW5rcz8uY29wdWxhIHx8IGFzdC5saW5rcz8udmVyYiB8fCBhc3QubGlua3M/LnN1YmNvbmopXG59XG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBhdXRvdml2aWZpY2F0aW9uPzogYm9vbGVhbixcbiAgICBzaWRlRWZmZWN0cz86IGJvb2xlYW4sXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJcbi8qKlxuICogQ2hlY2tzIGlmIHN0cmluZyBoYXMgYW55IG5vbi1kaWdpdCBjaGFyIChleGNlcHQgZm9yIFwiLlwiKSBiZWZvcmVcbiAqIGNvbnZlcnRpbmcgdG8gbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOdW1iZXIoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3Qgbm9uRGlnID0gc3RyaW5nLm1hdGNoKC9cXEQvZyk/LmF0KDApXG5cbiAgICBpZiAobm9uRGlnICYmIG5vbkRpZyAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHJpbmcpXG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS4gRXF1YWxpdHkgYnkgSlNPTi5zdHJpbmdpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHNlcTogVFtdKTogVFtdIHtcbiAgICBsZXQgc2VlbiA9IHt9IGFzIGFueVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9