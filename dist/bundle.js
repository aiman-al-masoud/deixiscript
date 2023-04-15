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
            var _a;
            const parts = id.split('.');
            const p1 = parts[0];
            const child = (_a = this.children[p1]) !== null && _a !== void 0 ? _a : this.children[id];
            const res = /* parts.length > 1 */ child.getId() !== id ? child.get(id /* parts.slice(1).join('.') */) : child;
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
        this.getLexemes = (rootOrToken) => {
            return this.lexemes
                .filter(x => rootOrToken === x.token || rootOrToken === x.root);
        };
    }
    getId() {
        return this.id;
    }
    clone(opts) {
        var _a;
        return new BaseThing((_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id, // clones have same id
        this.bases.map(x => x.clone()), Object.entries(this.children).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
    }
    unextends(thing) {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId());
    }
    set(id, thing) {
        this.children[id] = thing;
        this.setLexeme({ root: 'thing', type: 'noun', referents: [thing] }); // every thing is a thing
        //TODO
        if (typeof thing.toJs() === 'string') { //TODO make this polymorphic
            this.setLexeme({ root: 'string', type: 'noun', referents: [thing] });
        }
        else if (typeof thing.toJs() === 'number') {
            this.setLexeme({ root: 'number', type: 'noun', referents: [thing] });
        }
    }
    toJs() {
        return this; //TODOooooooooOO!
    }
    query(query) {
        return (0, uniq_1.uniq)(this.toClause(query).query(query, { /* it: this.lastReferenced  */}));
    }
    removeLexeme(rootOrToken) {
        const garbage = this.getLexemes(rootOrToken).flatMap(x => x.referents);
        garbage.forEach(x => delete this.children[x.getId()]);
        this.lexemes = this.lexemes.filter(x => rootOrToken !== x.token && rootOrToken !== x.root);
    }
    equals(other) {
        return this.toJs() === (other === null || other === void 0 ? void 0 : other.toJs());
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
    constructor(value, id = value) {
        super(id);
        this.value = value;
    }
    toJs() {
        return this.value; //js sucks
    }
    clone(opts) {
        // const x = super.clone(opts)
        return new StringThing(this.value, opts === null || opts === void 0 ? void 0 : opts.id);
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
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('adjective', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'verb', 'negation', 'existquant', 'uniquant', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'nonsubconj', // and
'disjunc', // or
'pronoun', 'quote', 'makro-keyword', 'except-keyword', 'then-keyword', 'end-keyword', 'genitive-particle', 'dative-particle', 'ablative-particle', 'locative-particle', 'instrumental-particle', 'comitative-particle');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    { root: 'be', type: 'copula', referents: [] },
    { root: 'be', type: 'copula', token: 'is', cardinality: 1, referents: [] },
    { root: 'be', type: 'copula', token: 'are', cardinality: '*', referents: [] },
    { root: 'do', type: 'hverb', referents: [] },
    { root: 'do', type: 'hverb', token: 'does', cardinality: 1, referents: [] },
    { root: 'have', type: 'verb', referents: [] },
    { root: 'not', type: 'negation', referents: [] },
    // logical roles of a constituent to abstract away word order
    { root: 'subject', type: 'adjective', referents: [] },
    { root: 'predicate', type: 'adjective', referents: [] },
    { root: 'object', type: 'adjective', referents: [] },
    { root: 'condition', type: 'adjective', referents: [] },
    { root: 'consequence', type: 'adjective', referents: [] },
    { root: 'owner', type: 'adjective', referents: [] },
    { root: 'receiver', type: 'adjective', referents: [] },
    { root: 'origin', type: 'adjective', referents: [] },
    { root: 'location', type: 'adjective', referents: [] },
    { root: 'instrument', type: 'adjective', referents: [] },
    { root: 'companion', type: 'adjective', referents: [] },
    // number of times a constituent can appear
    { root: 'optional', type: 'adjective', cardinality: '1|0', referents: [] },
    { root: 'one-or-more', type: 'adjective', cardinality: '+', referents: [] },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*', referents: [] },
    { root: 'or', type: 'disjunc', referents: [] },
    { root: 'and', type: 'nonsubconj', referents: [] },
    { root: 'a', type: 'indefart', referents: [] },
    { root: 'an', type: 'indefart', referents: [] },
    { root: 'the', type: 'defart', referents: [] },
    { root: 'if', type: 'subconj', referents: [] },
    { root: 'when', type: 'subconj', referents: [] },
    { root: 'every', type: 'uniquant', referents: [] },
    { root: 'any', type: 'uniquant', referents: [] },
    { root: 'that', type: 'relpron', referents: [] },
    { root: 'it', type: 'pronoun', referents: [] },
    { root: '"', type: 'quote', referents: [] },
    { root: '.', type: 'fullstop', referents: [] },
    { root: 'then', type: 'then-keyword', referents: [] },
    { root: 'except', type: 'except-keyword', referents: [] },
    { root: 'makro', type: 'makro-keyword', referents: [] },
    { root: 'end', type: 'end-keyword', referents: [] },
    { root: 'of', type: 'genitive-particle', referents: [] },
    { root: 'to', type: 'dative-particle', referents: [] },
    { root: 'from', type: 'ablative-particle', referents: [] },
    { root: 'on', type: 'locative-particle', referents: [] },
    { root: 'in', type: 'locative-particle', referents: [] },
    { root: 'at', type: 'locative-particle', referents: [] },
    { root: 'by', type: 'instrumental-particle', referents: [] },
    { root: 'with', type: 'comitative-particle', referents: [] },
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
            or then-keyword
            or makro-keyword 
            or except-keyword 
            or quote
  end.
  
  makro 
    quantifier is uniquant or existquant 
  end.

  makro 
    article is indefart or defart 
  end.

  makro
    genitive-complement is genitive-particle then owner noun-phrase
  end.

  makro
    dative-complement is dative-particle then receiver noun-phrase
  end.

  makro
    ablative-complement is ablative-particle then origin noun-phrase
  end.

  makro
    locative-complement is locative-particle then location noun-phrase
  end.

  makro
    instrumental-complement is instrumental-particle then instrument noun-phrase
  end.

  makro
    comitative-complement is comitative-particle then companion noun-phrase
  end.

  makro 
    complement is 
    genitive-complement or 
    dative-complement or
    ablative-complement or
    locative-complement or
    instrumental-complement or
    comitative-complement
  end.

  makro 
    copula-sentence is subject noun-phrase 
      then copula 
      then optional negation 
      then predicate noun-phrase 
  end.

  makro
    and-phrase is nonsubconj then noun-phrase
  end.

  makro 
    noun-phrase is optional quantifier 
      then optional article 
      then zero-or-more adjectives 
      then zero-or-more subject noun or pronoun or string
      then optional subclause
      then optional genitive-complement
      then optional and-phrase
  end.

  makro 
    copulasubclause is relpron then copula then predicate noun-phrase 
  end.

  makro 
    mverbsubclause is relpron then verb then object noun-phrase 
  end.

  makro 
    subclause is copulasubclause or mverbsubclause 
  end.

  makro 
    verb-sentence is subject noun-phrase 
      then optional hverb 
      then optional negation 
      then verb 
      then optional object noun-phrase
      then zero-or-more complements
  end.

  makro 
    simple-sentence is copula-sentence or verb-sentence 
  end.

  makro 
  complex-sentence-1 is subconj 
      then condition simple-sentence 
      then then-keyword
      then consequence simple-sentence
  end.

  makro 
    complex-sentence-2 is consequence simple-sentence 
      then subconj 
      then condition simple-sentence
  end.

  makro 
    string is quote then one-or-more any-lexeme except quote then quote 
  end.

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
        { type: ['makro-keyword'], number: 1 },
        { type: ['noun'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' },
        { type: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['exceptunion'], number: '1|0' },
        { type: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { type: ['noun'], number: 1 },
        { type: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { type: ['except-keyword'], number: 1 },
        { type: ['taggedunion'], number: '+' },
    ]
};


/***/ }),

/***/ "./app/src/draw-ast/AstCanvas.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/AstCanvas.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstCanvas = void 0;
const plotAst_1 = __webpack_require__(/*! ./plotAst */ "./app/src/draw-ast/plotAst.ts");
class AstCanvas {
    constructor() {
        this.div = document.createElement('div');
        this.canvas = document.createElement('canvas');
        this.cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.replot = () => {
            window.requestAnimationFrame(() => {
                var _a, _b, _c;
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.translate(window.innerWidth / 2, window.innerHeight / 2);
                (_b = this.context) === null || _b === void 0 ? void 0 : _b.translate(-window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y);
                (_c = this.context) === null || _c === void 0 ? void 0 : _c.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (!this.context) {
                    throw new Error('Canvas context is undefined!');
                }
                if (!this.ast) {
                    throw new Error('Ast is is undefined!');
                }
                (0, plotAst_1.plotAst)(this.context, this.ast);
            });
        };
        this.div.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', e => {
            this.isDragging = true;
            this.dragStart.x = e.x - this.cameraOffset.x;
            this.dragStart.y = e.y - this.cameraOffset.y;
        });
        this.canvas.addEventListener('mouseup', e => this.isDragging = false);
        this.canvas.addEventListener('mousemove', e => {
            if (this.isDragging) {
                this.cameraOffset.x = e.clientX - this.dragStart.x;
                this.cameraOffset.y = e.clientY - this.dragStart.y;
                this.replot();
            }
        });
    }
    onUpdate(ast, results) {
        this.ast = ast;
        this.replot();
    }
}
exports.AstCanvas = AstCanvas;


/***/ }),

/***/ "./app/src/draw-ast/astToEdgeList.ts":
/*!*******************************************!*\
  !*** ./app/src/draw-ast/astToEdgeList.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.astToEdgeList = void 0;
function astToEdgeList(ast, parentName, edges = []) {
    var _a, _b, _c;
    const astName = ((_c = (_a = ast.role) !== null && _a !== void 0 ? _a : (_b = ast.lexeme) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : ast.type) + random();
    const additions = [];
    if (parentName) {
        additions.push([parentName, astName]);
    }
    if (!ast.links && !ast.list) { // leaf!
        return [...edges, ...additions];
    }
    if (ast.links) {
        return Object
            .entries(ast.links)
            .flatMap(e => {
            const ezero = e[0] + random();
            return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)];
        });
    }
    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges));
        return [...additions, ...edges, ...list];
    }
    return [];
}
exports.astToEdgeList = astToEdgeList;
function random() {
    return parseInt(100000 * Math.random() + '');
}


/***/ }),

/***/ "./app/src/draw-ast/drawLine.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawLine.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawLine = void 0;
function drawLine(context, from, to) {
    context.beginPath();
    // context.strokeStyle = fromNode.strokeStyle
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}
exports.drawLine = drawLine;


/***/ }),

/***/ "./app/src/draw-ast/drawNode.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawNode.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawNode = void 0;
function drawNode(context, node) {
    context.beginPath();
    context.fillStyle = node.fillStyle;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    context.strokeStyle = node.strokeStyle;
    context.fillStyle = node.fillStyle;
    context.stroke();
    context.fill();
    context.fillStyle = "#FF0000";
    context.font = "10px Arial"; //20px
    const textOffset = 10 * node.label.length / 2; //some magic in here!
    context.fillText(node.label, node.x - textOffset, node.y);
}
exports.drawNode = drawNode;


/***/ }),

/***/ "./app/src/draw-ast/getCoords.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/getCoords.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCoords = void 0;
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
function getCoords(initialPos, data, oldCoords = {}, nestingFactor = 1) {
    var _a;
    const root = getRoot(data); // node w/out a parent
    if (!root) {
        return oldCoords;
    }
    const children = getChildrenOf(root, data);
    const rootPos = (_a = oldCoords[root]) !== null && _a !== void 0 ? _a : initialPos;
    const yOffset = 50;
    const xOffset = 200;
    const childCoords = children
        .map((c, i) => ({ [c]: { x: rootPos.x + i * nestingFactor * xOffset * (i % 2 == 0 ? 1 : -1), y: rootPos.y + yOffset * (nestingFactor + 1) } }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    const remainingData = data.filter(x => !x.includes(root));
    const partialResult = Object.assign(Object.assign(Object.assign({}, oldCoords), childCoords), { [root]: rootPos });
    return getCoords(initialPos, remainingData, partialResult, 0.9 * nestingFactor);
}
exports.getCoords = getCoords;
function getRoot(edges) {
    return edges
        .flat() // the nodes
        .filter(n => !edges.some(e => e[1] === n))[0];
}
function getChildrenOf(parent, edges) {
    return (0, uniq_1.uniq)(edges.filter(x => x[0] === parent).map(x => x[1])); //TODO duplicate children aren't plotted twice, but still make the graph uglier because they add "i" indeces in childCoords computation and make single child display NOT straight down.
}


/***/ }),

/***/ "./app/src/draw-ast/plotAst.ts":
/*!*************************************!*\
  !*** ./app/src/draw-ast/plotAst.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.plotAst = void 0;
const astToEdgeList_1 = __webpack_require__(/*! ./astToEdgeList */ "./app/src/draw-ast/astToEdgeList.ts");
const drawLine_1 = __webpack_require__(/*! ./drawLine */ "./app/src/draw-ast/drawLine.ts");
const drawNode_1 = __webpack_require__(/*! ./drawNode */ "./app/src/draw-ast/drawNode.ts");
const getCoords_1 = __webpack_require__(/*! ./getCoords */ "./app/src/draw-ast/getCoords.ts");
function plotAst(context, ast) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const rect = context.canvas.getBoundingClientRect();
    const edges = (0, astToEdgeList_1.astToEdgeList)(ast);
    const coords = (0, getCoords_1.getCoords)({ x: rect.x - rect.width / 2, y: rect.y }, edges);
    Object.entries(coords).forEach(c => {
        const name = c[0];
        const pos = c[1];
        (0, drawNode_1.drawNode)(context, {
            x: pos.x,
            y: pos.y,
            radius: 2,
            fillStyle: '#22cccc',
            strokeStyle: '#009999',
            label: name.replaceAll(/\d+/g, '')
        });
    });
    edges.forEach(e => {
        const from = coords[e[0]];
        const to = coords[e[1]];
        if (from && to) {
            (0, drawLine_1.drawLine)(context, from, to);
        }
    });
}
exports.plotAst = plotAst;


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
        this.listeners = [];
        this.execute(this.context.getPrelude());
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().flatMap(ast => {
            if (ast.type === 'macro') {
                return [];
            }
            let results = [];
            try {
                results = (0, evalAst_1.evalAst)(this.context, ast);
            }
            catch (e) {
                console.warn(e);
            }
            this.listeners.forEach(l => {
                l.onUpdate(ast, results);
            });
            return results;
        });
    }
    executeUnwrapped(natlang) {
        return this.execute(natlang).map(x => x.toJs());
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
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
        this.refreshTokens();
    }
    refreshTokens() {
        this.tokens = this.words.map(w => { var _a; return (_a = this.context.getLexemes(w).at(0)) !== null && _a !== void 0 ? _a : (0, Lexeme_1.makeLexeme)({ root: w, token: w, type: 'noun', referents: [] }); });
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
    return sourceCode
        .split('')
        .reduce((a, c) => a + (specialChars.includes(c) ? ' ' + c + ' ' : c), '');
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
const AstCanvas_1 = __webpack_require__(/*! ../draw-ast/AstCanvas */ "./app/src/draw-ast/AstCanvas.ts");
const Brain_1 = __webpack_require__(/*! ../facade/Brain */ "./app/src/facade/Brain.ts");
function main() {
    const brain = (0, Brain_1.getBrain)();
    window.brain = brain;
    const astCanvas = new AstCanvas_1.AstCanvas();
    brain.addListener(astCanvas);
    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');
    const split = 'height: 100%; width: 50%; position: fixed; z-index: 1; top: 0;  padding-top: 20px;';
    const left = 'left: 0; background-color: #111;';
    const right = 'right: 0; background-color: #000;';
    leftDiv.style.cssText = split + left;
    rightDiv.style.cssText = split + right + 'overflow:scroll;' + 'overflow-x:scroll;' + 'overflow-y:scroll;';
    document.body.appendChild(leftDiv);
    document.body.appendChild(rightDiv);
    rightDiv.appendChild(astCanvas.div);
    const textarea = document.createElement('textarea');
    textarea.style.width = '40vw';
    textarea.style.height = '40vh';
    leftDiv.appendChild(textarea);
    const consoleOutput = document.createElement('textarea');
    consoleOutput.style.width = '40vw';
    consoleOutput.style.height = '40vh';
    leftDiv.appendChild(consoleOutput);
    document.body.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.ctrlKey && e.code === 'Enter') {
            const result = brain.executeUnwrapped(textarea.value);
            consoleOutput.value = result.toString();
            console.log(result);
        }
        else if (e.ctrlKey && e.code === 'KeyY') {
            main();
        }
    }));
}
exports["default"] = main;


/***/ }),

/***/ "./app/src/middle/clauses/And.ts":
/*!***************************************!*\
  !*** ./app/src/middle/clauses/And.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const sortIds_1 = __webpack_require__(/*! ../id/functions/sortIds */ "./app/src/middle/id/functions/sortIds.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const solveMaps_1 = __webpack_require__(/*! ./functions/solveMaps */ "./app/src/middle/clauses/functions/solveMaps.ts");
// import Imply from "./Imply";
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.hashCode = (0, hashString_1.hashString)(this.clause1.toString() + this.clause2.toString() + this.negated);
        this.entities = (0, uniq_1.uniq)(this.clause1.entities.concat(this.clause2.entities));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
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
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
// import Imply from "./Imply";
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

/***/ "./app/src/middle/clauses/functions/getOwnershipChain.ts":
/*!***************************************************************!*\
  !*** ./app/src/middle/clauses/functions/getOwnershipChain.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOwnershipChain = void 0;
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
function getOwnershipChain(clause, entity = (0, topLevel_1.getTopLevel)(clause)[0]) {
    // const ownedEntities = clause.ownedBy(entity)
    // const topLevel = getTopLevel(clause)[0]
    if (!entity) {
        return [];
    }
    const ownedEntities = clause.ownedBy(entity);
    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]));
}
exports.getOwnershipChain = getOwnershipChain;


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

/***/ "./app/src/middle/clauses/functions/topLevel.ts":
/*!******************************************************!*\
  !*** ./app/src/middle/clauses/functions/topLevel.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTopLevel = void 0;
function getTopLevel(clause) {
    return clause
        .entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
}
exports.getTopLevel = getTopLevel;


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
const getOwnershipChain_1 = __webpack_require__(/*! ./clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const getIncrementalId_1 = __webpack_require__(/*! ./id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
function evalAst(context, ast, args = {}) {
    var _a, _b, _c, _d, _e;
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
    else {
        return evalNounPhrase(context, ast, args);
    }
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    var _a, _b, _c, _d, _e, _f;
    if (args === null || args === void 0 ? void 0 : args.sideEffects) { // assign the right value to the left value
        const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
        const subject = nounPhraseToClause((_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId }).simple;
        const rVal = evalAst(context, (_c = ast.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId });
        const ownerChain = (0, getOwnershipChain_1.getOwnershipChain)(subject);
        const maps = context.query(subject);
        const lexemes = subject.flatList().map(x => x.predicate).filter(x => x);
        const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rVal })));
        // console.log('subject=', subject.toString(), 'rVal=', rVal, 'ownerChain=', ownerChain, 'maps=', maps)
        if (!maps.length && ownerChain.length <= 1) { // lVal is completely new
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (maps.length && ownerChain.length <= 1) { // reassignment
            lexemes.forEach(x => context.removeLexeme(x.root));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (ownerChain.length > 1) { // lVal is property of existing object
            const aboutOwner = about(subject, ownerChain.at(-2));
            const owners = getInterestingIds(context.query(aboutOwner), aboutOwner).map(id => context.get(id)).filter(x => x);
            const owner = owners.at(0);
            const rValClone = rVal.map(x => x.clone({ id: (owner === null || owner === void 0 ? void 0 : owner.getId()) + '.' + x.getId() }));
            const lexemesWithCloneReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rValClone })));
            lexemesWithCloneReferent.forEach(x => context.setLexeme(x));
            rValClone.forEach(x => owner === null || owner === void 0 ? void 0 : owner.set(x.getId(), x));
            return rValClone;
        }
    }
    else { // compare the right and left values
        const subject = evalAst(context, (_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject, args).at(0);
        const predicate = evalAst(context, (_e = ast.links) === null || _e === void 0 ? void 0 : _e.predicate, args).at(0);
        return (subject === null || subject === void 0 ? void 0 : subject.equals(predicate)) && (!((_f = ast.links) === null || _f === void 0 ? void 0 : _f.negation)) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.log('problem with copula sentence!');
    return [];
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
function evalVerbSentence(context, ast, args) {
    // const complements = (ast.links as any)?.['complement']
    console.log(ast);
    throw new Error('verb sentence!'); // context.getLexeme(ast?.links?.mverb?.lexeme?.root!)
}
function evalComplexSentence(context, ast, args) {
    var _a, _b, _c;
    if (((_c = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subconj) === null || _b === void 0 ? void 0 : _b.lexeme) === null || _c === void 0 ? void 0 : _c.root) === 'if') {
        if (evalAst(context, ast.links.condition, Object.assign(Object.assign({}, args), { sideEffects: false })).length) {
            evalAst(context, ast.links.consequence, Object.assign(Object.assign({}, args), { sideEffects: true }));
        }
    }
    return [];
}
function evalCompoundSentence(context, ast, args) {
    throw new Error('compound sentence!');
}
function evalNounPhrase(context, ast, args) {
    var _a, _b, _c, _d, _e;
    if ((_c = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subject) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.some(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.quote; })) {
        return evalString(context, (_e = (_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject) === null || _e === void 0 ? void 0 : _e.list[0], args);
    }
    const np = nounPhraseToClause(ast, args);
    const maps = context.query(np); // TODO: intra-sentence anaphora resolution
    const interestingIds = getInterestingIds(maps, np);
    const things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x);
    // console.log('maps=', maps, 'interestingIds=', interestingIds, 'things=', things)
    if (isAstPlural(ast) || getAndPhrase(ast)) { // if universal quantified, I don't care if there's no match
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
    const genitiveComplement = Object.values((_h = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _h !== void 0 ? _h : {}).filter(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.owner; }).at(0);
    const genitiveComplementClause = genitiveToClause(genitiveComplement, { subject: subjectId, autovivification: false, sideEffects: false });
    const andPhrase = evalAndPhrase(getAndPhrase(ast), args);
    //TODO: relative clauses
    return adjectives.and(nouns).and(genitiveComplementClause).and(andPhrase);
}
function getAndPhrase(np) {
    var _a;
    return (_a = np === null || np === void 0 ? void 0 : np.links) === null || _a === void 0 ? void 0 : _a['and-phrase']; //TODO!
}
function evalAndPhrase(andPhrase, args) {
    var _a;
    if (!andPhrase) {
        return Clause_1.emptyClause;
    }
    return nounPhraseToClause((_a = andPhrase === null || andPhrase === void 0 ? void 0 : andPhrase.links) === null || _a === void 0 ? void 0 : _a['noun-phrase'] /* TODO! */); // maybe problem if multiple things have same id, query is not gonna find them
}
function genitiveToClause(ast, args) {
    var _a, _b, _c;
    if (!ast) {
        return Clause_1.emptyClause;
    }
    const ownedId = args === null || args === void 0 ? void 0 : args.subject;
    const ownerId = (0, getIncrementalId_1.getIncrementalId)();
    const genitiveParticle = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a["genitive-particle"]) === null || _b === void 0 ? void 0 : _b.lexeme;
    const owner = nounPhraseToClause((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.owner, { subject: ownerId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)(genitiveParticle, ownedId, ownerId).and(owner);
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
function getInterestingIds(maps, clause) {
    // the ones with most dots, because "color of style of button" 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if "color of button AND button"
    // const ids = maps.flatMap(x => Object.values(x))
    // const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    // return ids.filter(x => getNumberOfDots(x) === maxLen)
    const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause);
    if (oc.length <= 1) {
        return maps.flatMap(x => Object.values(x)); //all
    }
    // TODO: problem not returning everything because of getOwnershipChain()
    return maps.flatMap(m => m[oc.at(-1)]); // owned leaf
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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T0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0UsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM3QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRWhELDZEQUE2RDtJQUM3RCxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNwRCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNuRCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDcEQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN0RCxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFdkQsMkNBQTJDO0lBQzNDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0UsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRzVFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDL0MsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUU5QyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFOUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBR25ELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzFELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1RCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7Q0FJL0Q7Ozs7Ozs7Ozs7Ozs7O0FDL0RZLGVBQU8sR0FFbEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUlDOzs7Ozs7Ozs7Ozs7OztBQ25JSCxpSEFBd0Q7QUFJM0Msd0JBQWdCLEdBQUcsbUNBQWMsRUFDMUMsT0FBTyxFQUNQLFdBQVcsRUFDWCxhQUFhLEVBQ2IsYUFBYSxDQUNoQjtBQUVZLDRCQUFvQixHQUFvQixDQUFDLE9BQU8sQ0FBQztBQUVqRCxnQkFBUSxHQUFjO0lBRS9CLE9BQU8sRUFBRTtRQUNMLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUN0QyxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUM5QyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDL0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtLQUN2QztJQUNELFdBQVcsRUFBRTtRQUNULEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDdEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1FBQ3hDLEVBQUUsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtLQUM1QztJQUNELGFBQWEsRUFBRTtRQUNYLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUM3QixFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7S0FDdkM7SUFDRCxhQUFhLEVBQUU7UUFDWCxFQUFFLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtRQUN2QyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7S0FDekM7Q0FFSjs7Ozs7Ozs7Ozs7Ozs7QUNwQ0Qsd0ZBQW9DO0FBRXBDLE1BQWEsU0FBUztJQVVsQjtRQVJTLFFBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUNsQyxXQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFFekMsaUJBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7UUFDdEUsZUFBVSxHQUFHLEtBQUs7UUFDbEIsY0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBNkIxQixXQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7O2dCQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVTtnQkFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVc7Z0JBQ3ZDLFVBQUksQ0FBQyxPQUFPLDBDQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDdEUsVUFBSSxDQUFDLE9BQU8sMENBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDcEgsVUFBSSxDQUFDLE9BQU8sMENBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUVwRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDZixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDO2lCQUNsRDtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDO2lCQUMxQztnQkFFRCxxQkFBTyxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNuQyxDQUFDLENBQUM7UUFDTixDQUFDO1FBM0NHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFFM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJO1lBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFckUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNqQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxNQUFNLEVBQUU7YUFDaEI7UUFDTCxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQVksRUFBRSxPQUFnQjtRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7UUFDZCxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ2pCLENBQUM7Q0FzQko7QUF4REQsOEJBd0RDOzs7Ozs7Ozs7Ozs7OztBQzNERCxTQUFnQixhQUFhLENBQ3pCLEdBQVksRUFDWixVQUFtQixFQUNuQixRQUFrQixFQUFFOztJQUdwQixNQUFNLE9BQU8sR0FBRyxDQUFDLGVBQUcsQ0FBQyxJQUFJLG1DQUFJLFNBQUcsQ0FBQyxNQUFNLDBDQUFFLElBQUksbUNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRTtJQUVyRSxNQUFNLFNBQVMsR0FBYSxFQUFFO0lBRTlCLElBQUksVUFBVSxFQUFFO1FBQ1osU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN4QztJQUVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVE7UUFDbkMsT0FBTyxDQUFDLEdBQUcsS0FBSyxFQUFFLEdBQUcsU0FBUyxDQUFDO0tBQ2xDO0lBRUQsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ1gsT0FBTyxNQUFNO2FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1QsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRTtZQUM3QixPQUFPLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUM7S0FDVDtJQUVELElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtRQUNWLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEUsT0FBTyxDQUFDLEdBQUcsU0FBUyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO0tBQzNDO0lBRUQsT0FBTyxFQUFFO0FBQ2IsQ0FBQztBQWpDRCxzQ0FpQ0M7QUFFRCxTQUFTLE1BQU07SUFDWCxPQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoRCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3JDRCxTQUFnQixRQUFRLENBQUMsT0FBaUMsRUFBRSxJQUE4QixFQUFFLEVBQTRCO0lBQ3BILE9BQU8sQ0FBQyxTQUFTLEVBQUU7SUFDbkIsNkNBQTZDO0lBQzdDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsQ0FBQztBQU5ELDRCQU1DOzs7Ozs7Ozs7Ozs7OztBQ05ELFNBQWdCLFFBQVEsQ0FBQyxPQUFpQyxFQUFFLElBQWU7SUFDdkUsT0FBTyxDQUFDLFNBQVMsRUFBRTtJQUNuQixPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTO0lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUM5RCxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXO0lBQ3RDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7SUFDbEMsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUNoQixPQUFPLENBQUMsSUFBSSxFQUFFO0lBQ2QsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTO0lBQzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsWUFBWSxRQUFNO0lBQ2pDLE1BQU0sVUFBVSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUMscUJBQXFCO0lBQ25FLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFaRCw0QkFZQzs7Ozs7Ozs7Ozs7Ozs7QUNkRCxtRkFBb0M7QUFFcEMsU0FBZ0IsU0FBUyxDQUNyQixVQUFzQixFQUN0QixJQUFjLEVBQ2QsWUFBeUMsRUFBRSxFQUMzQyxhQUFhLEdBQUcsQ0FBQzs7SUFHakIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLHNCQUFzQjtJQUVqRCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsT0FBTyxTQUFTO0tBQ25CO0lBRUQsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7SUFDMUMsTUFBTSxPQUFPLEdBQUcsZUFBUyxDQUFDLElBQUksQ0FBQyxtQ0FBSSxVQUFVO0lBRTdDLE1BQU0sT0FBTyxHQUFHLEVBQUU7SUFDbEIsTUFBTSxPQUFPLEdBQUcsR0FBRztJQUVuQixNQUFNLFdBQVcsR0FBRyxRQUFRO1NBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUM5SSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLEVBQUUsRUFBRSxDQUFDO0lBRTNDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsTUFBTSxhQUFhLGlEQUFRLFNBQVMsR0FBSyxXQUFXLEdBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFFO0lBRTlFLE9BQU8sU0FBUyxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsR0FBRyxhQUFhLENBQUM7QUFDbkYsQ0FBQztBQTNCRCw4QkEyQkM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFlO0lBQzVCLE9BQU8sS0FBSztTQUNQLElBQUksRUFBRSxDQUFDLFlBQVk7U0FDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxNQUFjLEVBQUUsS0FBZTtJQUNsRCxPQUFPLGVBQUksRUFBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsd0xBQXdMO0FBQzNQLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdENELDBHQUErQztBQUMvQywyRkFBcUM7QUFDckMsMkZBQXFDO0FBQ3JDLDhGQUF1QztBQUV2QyxTQUFnQixPQUFPLENBQUMsT0FBaUMsRUFBRSxHQUFZO0lBRW5FLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVwRSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFO0lBRW5ELE1BQU0sS0FBSyxHQUFHLGlDQUFhLEVBQUMsR0FBRyxDQUFDO0lBQ2hDLE1BQU0sTUFBTSxHQUFHLHlCQUFTLEVBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQztJQUUxRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUUvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEIsdUJBQVEsRUFBQyxPQUFPLEVBQUU7WUFDZCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDUixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztZQUNULFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFdBQVcsRUFBRSxTQUFTO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7U0FDckMsQ0FBQztJQUVOLENBQUMsQ0FBQztJQUVGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFFZCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkIsSUFBSSxJQUFJLElBQUksRUFBRSxFQUFFO1lBQ1osdUJBQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztTQUM5QjtJQUVMLENBQUMsQ0FBQztBQUNOLENBQUM7QUFuQ0QsMEJBbUNDOzs7Ozs7Ozs7Ozs7O0FDekNELGdHQUFnRDtBQUVoRCxtSUFBaUU7QUFDakUsOEZBQTRDO0FBSzVDLE1BQXFCLFVBQVU7SUFLM0I7UUFIUyxZQUFPLEdBQUcsd0JBQVUsRUFBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUNyQyxjQUFTLEdBQW9CLEVBQUU7UUFHckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZTtRQUNuQixPQUFPLHNCQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFFN0QsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDdEIsT0FBTyxFQUFFO2FBQ1o7WUFFRCxJQUFJLE9BQU8sR0FBWSxFQUFFO1lBQ3pCLElBQUk7Z0JBQ0EsT0FBTyxHQUFHLHFCQUFPLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7YUFDdkM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNsQjtZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7WUFDNUIsQ0FBQyxDQUFDO1lBRUYsT0FBTyxPQUFPO1FBQ2xCLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxPQUFlO1FBQzVCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUF1QjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztDQUVKO0FBekNELGdDQXlDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoREQsZ0hBQXFDO0FBWXJDLFNBQWdCLFFBQVE7SUFDcEIsT0FBTyxJQUFJLG9CQUFVLEVBQUU7QUFDM0IsQ0FBQztBQUZELDRCQUVDOzs7Ozs7Ozs7Ozs7O0FDZEQsMkZBQThDO0FBRzlDLE1BQXFCLFVBQVU7SUFNM0IsWUFBcUIsVUFBa0IsRUFBVyxPQUFnQjtRQUE3QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVcsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUp4RCxXQUFNLEdBQWEsRUFBRTtRQUVyQixTQUFJLEdBQVcsQ0FBQztRQUl0QixJQUFJLENBQUMsS0FBSztZQUNOLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzNCLElBQUksRUFBRTtpQkFDTixLQUFLLENBQUMsS0FBSyxDQUFDO1FBRXJCLElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDeEIsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsaUJBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUNBQUksdUJBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFDO0lBQ3pJLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNwQixJQUFJLENBQUMsSUFBSSxFQUFFO0lBQ2YsQ0FBQztJQUVELElBQUksR0FBRztRQUNILE9BQU8sSUFBSSxDQUFDLElBQUk7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHO0lBQ25CLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQWdCO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07SUFDekMsQ0FBQztDQUVKO0FBN0NELGdDQTZDQztBQUVELFNBQVMsUUFBUSxDQUFDLFVBQWtCLEVBQUUsWUFBc0I7SUFFeEQsT0FBTyxVQUFVO1NBQ1osS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFakYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN4REQseUlBQTRFO0FBQzVFLHdIQUFpRDtBQUNqRCx3SEFBaUQ7QUFZakQsU0FBZ0IsVUFBVSxDQUFDLElBQVk7SUFDbkMsT0FBTyxJQUFJO0FBQ2YsQ0FBQztBQUZELGdDQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLE1BQWM7SUFDbkMsT0FBTyw4QkFBWSxFQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDM0MsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE1BQWMsRUFBRSxPQUFlO0lBRXZELElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDN0MsT0FBTyxDQUFDLFVBQVUsQ0FBQztnQkFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtnQkFDakIsS0FBSyxFQUFFLHlCQUFTLEVBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDN0IsV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUzthQUM5QixDQUFDLENBQUM7S0FDTjtJQUVELElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDeEIsT0FBTyx5QkFBUyxFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDOUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixLQUFLLEVBQUUsQ0FBQztZQUNSLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUztTQUM5QixDQUFDLENBQUM7S0FDTjtJQUVELE9BQU8sRUFBRTtBQUNiLENBQUM7QUF0QkQsa0NBc0JDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVDRCx3SEFBcUM7QUFZckMsU0FBZ0IsUUFBUSxDQUFDLFVBQWtCLEVBQUUsT0FBZ0I7SUFDekQsT0FBTyxJQUFJLG9CQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztBQUM5QyxDQUFDO0FBRkQsNEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDZkQsU0FBZ0IsU0FBUyxDQUFDLElBQVc7SUFDakMsT0FBTyxDQUFDLElBQUksR0FBQyxHQUFHLENBQUM7QUFDckIsQ0FBQztBQUZELDhCQUVDOzs7Ozs7Ozs7Ozs7OztBQ0ZELFNBQWdCLFNBQVMsQ0FBQyxJQUFZO0lBQ2xDLE9BQU8sSUFBSSxHQUFHLEdBQUc7QUFDckIsQ0FBQztBQUZELDhCQUVDOzs7Ozs7Ozs7Ozs7OztBQ0FELGlJQUFvRTtBQUlwRSwrRkFBeUM7QUFJekMsTUFBYSxVQUFVO0lBRW5CLFlBQ3VCLFVBQWtCLEVBQ2xCLE9BQWdCLEVBQ2hCLFFBQVEsb0JBQVEsRUFBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO1FBRnJDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixVQUFLLEdBQUwsS0FBSyxDQUFnQztRQWlEbEQsZUFBVSxHQUFHLENBQUMsSUFBYSxFQUFFLElBQVcsRUFBdUIsRUFBRTtZQUV2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFFNUMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwQztpQkFBTTtnQkFDSCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBcUIsRUFBRSxJQUFJLENBQUM7YUFDMUQ7UUFFTCxDQUFDO1FBRVMsY0FBUyxHQUFHLENBQUMsQ0FBUyxFQUF1QixFQUFFO1lBRXJELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtnQkFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pCLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO2FBQ3JDO1FBRUwsQ0FBQztRQUVTLG1CQUFjLEdBQUcsQ0FBQyxJQUFtQixFQUFFLElBQVcsRUFBdUIsRUFBRTs7WUFFakYsTUFBTSxLQUFLLEdBQVEsRUFBRTtZQUVyQixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUUxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSw2QkFBVyxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDL0IsT0FBTyxTQUFTO2lCQUNuQjtnQkFFRCxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNOLFNBQVE7aUJBQ1g7Z0JBRUQsS0FBSyxDQUFDLE9BQUMsQ0FBQyxJQUFJLG1DQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHO2FBRWxDO1lBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sU0FBUzthQUNuQjtZQUVELE9BQU87Z0JBQ0gsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLEtBQUs7YUFDZjtRQUNMLENBQUM7UUFFUyxnQkFBVyxHQUFHLENBQUMsQ0FBUyxFQUFFLElBQVcsRUFBdUIsRUFBRTtZQUVwRSxNQUFNLElBQUksR0FBYyxFQUFFO1lBRTFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFFdEIsSUFBSSxDQUFDLDhCQUFZLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO29CQUM3QyxNQUFLO2lCQUNSO2dCQUVELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUM7Z0JBRXJELElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQ0osTUFBSztpQkFDUjtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNmO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDbkIsT0FBTyxTQUFTO2FBQ25CO1lBRUQsT0FBTyw4QkFBWSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUNsQixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVoQixDQUFDO1FBRVMsV0FBTSxHQUFHLENBQUMsQ0FBVSxFQUFFLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFlLENBQUM7UUFDbEUsQ0FBQztJQXBJRCxDQUFDO0lBRUQsUUFBUTs7UUFFSixNQUFNLE9BQU8sR0FBYyxFQUFFO1FBRTdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUV0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFdkQsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDTixNQUFLO2FBQ1I7WUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUV2QixJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7YUFDOUI7WUFFRCxJQUFJLFdBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSwwQ0FBRSxJQUFJLE1BQUssVUFBVSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTthQUNwQjtTQUVKO1FBRUQsT0FBTyxPQUFPO0lBQ2xCLENBQUM7SUFHUyxRQUFRLENBQUMsS0FBZ0IsRUFBRSxJQUFXLEVBQUUsV0FBdUI7UUFFckUsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7WUFFbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztZQUVsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFFO2dCQUNyQyxPQUFPLENBQUM7YUFDWDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUM3QjtJQUVMLENBQUM7SUF5RlMsUUFBUSxDQUFDLEdBQVk7UUFFM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPLEdBQUc7U0FDYjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFL0MsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU07YUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxDQUFDO1FBRXZDLHVDQUFZLEdBQUcsS0FBRSxLQUFLLEVBQUUsV0FBVyxJQUFFO0lBRXpDLENBQUM7Q0FFSjtBQWxLRCxnQ0FrS0M7Ozs7Ozs7Ozs7Ozs7O0FDdktNLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLHVCQUF1QjtPQUNoRixDQUFDLElBQUksR0FBRztPQUNSLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFGRCxtQkFBVyxlQUVWO0FBRVAsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHO09BQ2xELENBQUMsSUFBSSxHQUFHO0FBREYsb0JBQVksZ0JBQ1Y7Ozs7Ozs7Ozs7Ozs7O0FDVGYseUdBQTBDO0FBTzFDLFNBQWdCLFNBQVMsQ0FBQyxVQUFrQixFQUFFLE9BQWdCO0lBQzFELE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUZELDhCQUVDOzs7Ozs7Ozs7Ozs7OztBQ1BELFNBQWdCLGFBQWEsQ0FBQyxLQUFjOztJQUV4QyxNQUFNLFVBQVUsR0FBRyx1QkFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDdEQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sSUFBSSxHQUFHLHVCQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLE1BQU0sMENBQUUsSUFBSTtJQUVoRCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztLQUN2QztJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNCLENBQUM7QUFYRCxzQ0FXQztBQUVELFNBQVMsaUJBQWlCLENBQUMsU0FBa0I7O0lBRXpDLE1BQU0sY0FBYyxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sbUNBQUksRUFBRSxJQUFDO0lBRTlELE1BQU0sWUFBWSxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLEtBQUssMENBQUUsSUFBSSxJQUFDO0lBRXJELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFFdkQsTUFBTSxZQUFZLEdBQUcsdUNBQVMsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsMENBQUUsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUNqRixNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLEtBQUssMENBQUUsSUFBSSxJQUFDO0lBRXhELE9BQU87UUFDSCxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLGFBQUMsT0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFFLE1BQU0sMENBQUUsSUFBZ0IsbUNBQUksRUFBRSxJQUFDO1FBQy9ELElBQUksRUFBRSxjQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFZO1FBQ2xDLE1BQU0sRUFBRSxlQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxXQUFXO1FBQ3BDLFVBQVUsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsYUFBQyxPQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSwwQ0FBRSxJQUFnQixtQ0FBSSxFQUFFLElBQUM7S0FDM0U7QUFFTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2xDTSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7O0lBRXJGLE9BQU8scUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1DQUNsQixpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxtQ0FDakMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO0FBRWxDLENBQUM7QUFOWSxxQkFBYSxpQkFNekI7QUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQVUsRUFBRSxDQUFVLEVBQUUsRUFBRTtJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqQyxDQUFDO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFFbEYsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUV6RCxJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7UUFDN0IsT0FBTyxTQUFTO0tBQ25CO0lBRUQsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRS9CLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLFVBQXFCLEVBQUU7O0lBRXZGLE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQUksRUFBRTtJQUVqQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRTVDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixPQUFPLEVBQUU7U0FDWjthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQWtCLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RjtJQUVMLENBQUMsQ0FBQztBQUVOLENBQUM7QUFkRCxvQ0FjQztBQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUMzRSxPQUFPLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTTtBQUM5RSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNELHdHQUFpRDtBQUNqRCx3RkFBMEM7QUFFMUMsU0FBd0IsSUFBSTtJQUV4QixNQUFNLEtBQUssR0FBRyxvQkFBUSxHQUFFLENBQUM7SUFDeEIsTUFBYyxDQUFDLEtBQUssR0FBRyxLQUFLO0lBRTdCLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsRUFBRTtJQUNqQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUU1QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM3QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUU5QyxNQUFNLEtBQUssR0FBRyxvRkFBb0Y7SUFDbEcsTUFBTSxJQUFJLEdBQUcsa0NBQWtDO0lBQy9DLE1BQU0sS0FBSyxHQUFHLG1DQUFtQztJQUVqRCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsSUFBSTtJQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLGtCQUFrQixHQUFHLG9CQUFvQixHQUFHLG9CQUFvQjtJQUV6RyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7SUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBRW5DLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUVuQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNuRCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU07SUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFFN0IsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7SUFDeEQsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTTtJQUNsQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQ25DLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO0lBR2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQU0sQ0FBQyxFQUFDLEVBQUU7UUFFaEQsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ2pDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQ3JELGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUN0QjthQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN2QyxJQUFJLEVBQUU7U0FDVDtJQUVMLENBQUMsRUFBQztBQUVOLENBQUM7QUE5Q0QsMEJBOENDOzs7Ozs7Ozs7Ozs7O0FDakRELDJGQUE2RTtBQUU3RSxpSEFBa0Q7QUFFbEQsd0dBQW9EO0FBQ3BELHNGQUF3QztBQUN4Qyx3SEFBa0Q7QUFDbEQsK0JBQStCO0FBRS9CLE1BQXFCLEdBQUc7SUFNcEIsWUFDYSxPQUFlLEVBQ2YsT0FBZSxFQUNmLGlCQUFpQixLQUFLLEVBQ3RCLFVBQVUsS0FBSztRQUhmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQVJuQixhQUFRLEdBQUcsMkJBQVUsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN2RixhQUFRLEdBQUcsZUFBSSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLG1CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBVztRQTZCcEQsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckYsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFyQnhGLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUNoQixPQUFPLElBQUksR0FBRyxDQUNWLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN4QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDeEMsSUFBSSxDQUFDLGNBQWMsRUFDbkIsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FDL0I7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ25FLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUMzQyxDQUFDO0lBS0QsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNGLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDMUYsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhLEVBQUUsSUFBZ0I7O1FBRWpDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDL0MsTUFBTSxFQUFFLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEVBQUUsbUNBQUkscUJBQU8sRUFBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLEVBQUMsT0FBTztRQUVqRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEdBQUcseUJBQVMsRUFBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO1FBRS9DLE1BQU0sT0FBTyxHQUFRLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxlQUFDLENBQUMsU0FBUywwQ0FBRSxJQUFJLE1BQUssU0FBUyxJQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsUUFBQyxFQUFFLENBQUMsT0FBQyxDQUFDLElBQUksMENBQUUsRUFBRSxDQUFDLENBQUMsQ0FBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsRUFBRSxFQUFFLENBQUM7UUFDdkosTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLGlEQUFpRDtRQUVySCxPQUFPLEdBQUc7SUFDZCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBRU4sTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUU5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssb0JBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdEMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEtBQUssb0JBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDdEMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0NBSUo7QUFqRkQseUJBaUZDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFGRCwyRkFBa0U7QUFHbEUsbUdBQXdCO0FBRXhCLHNGQUF3QztBQUN4Qyx3R0FBb0Q7QUFDcEQsK0JBQStCO0FBRS9CLE1BQWEsVUFBVTtJQVVuQixZQUNhLFNBQWlCLEVBQ2pCLElBQVUsRUFDVixVQUFVLEtBQUs7UUFGZixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBWG5CLFdBQU0sR0FBRyxJQUFJO1FBQ2IsVUFBSyxHQUFHLElBQUk7UUFDWixVQUFLLEdBQUcsb0JBQVc7UUFDbkIsYUFBUSxHQUFHLGVBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2pILG1CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBVztRQVdwRCxTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQUUsRUFBRTs7WUFBQyxXQUFJLFVBQVUsQ0FDdEMsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLHVCQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsR0FBRywwQ0FBRyxDQUFDLENBQUMsbUNBQUksQ0FBQyxJQUFDLEVBQ3ZDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQy9CO1NBQUE7UUFFRCxRQUFHLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYyxFQUFVLEVBQUUsV0FBQyxXQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztRQUM3RixhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkIsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9GLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQVhoRyxDQUFDO0lBYUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRztRQUNsRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhO1FBRWYsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFVBQVUsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sRUFBRTtTQUNaO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUU7U0FDWjtRQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJO2FBQ3JCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsQ0FBQztRQUV2QyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2hCLENBQUM7Q0FJSjtBQXJERCxnQ0FxREM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOURELHVHQUF5QztBQUd6QywySEFBdUM7QUE2QnZDLFNBQWdCLFFBQVEsQ0FBQyxTQUFpQixFQUFFLEdBQUcsSUFBVTtJQUNyRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzFDLENBQUM7QUFGRCw0QkFFQztBQUVZLG1CQUFXLEdBQVcsSUFBSSxxQkFBVyxFQUFFOzs7Ozs7Ozs7Ozs7O0FDaENwRCxNQUFxQixXQUFXO0lBQWhDO1FBRWEsYUFBUSxHQUFHLENBQUM7UUFDWixhQUFRLEdBQUcsRUFBRTtRQUNiLFVBQUssR0FBRyxJQUFJO1FBQ1osVUFBSyxHQUFHLElBQUk7UUFDWixXQUFNLEdBQUcsSUFBSTtRQUNiLG1CQUFjLEdBQUcsS0FBSztRQUUvQixTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQVUsRUFBRSxDQUFDLElBQUk7UUFDeEMsUUFBRyxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWMsRUFBVSxFQUFFLENBQUMsS0FBSztRQUN0RCxZQUFPLEdBQUcsQ0FBQyxVQUFrQixFQUFVLEVBQUUsQ0FBQyxVQUFVO1FBQ3BELGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ25CLFlBQU8sR0FBRyxDQUFDLEVBQU0sRUFBUSxFQUFFLENBQUMsRUFBRTtRQUM5QixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLEVBQUU7UUFDL0IsVUFBSyxHQUFHLENBQUMsTUFBYyxFQUFTLEVBQUUsQ0FBQyxFQUFFO1FBQ3JDLGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0lBRXZCLENBQUM7Q0FBQTtBQWxCRCxpQ0FrQkM7Ozs7Ozs7Ozs7Ozs7O0FDcEJELDJHQUF3QztBQUV4QyxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsU0FBd0IsMEJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUYsK0NBQStDO0lBRS9DLDBDQUEwQztJQUUxQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1QsT0FBTyxFQUFFO0tBQ1o7SUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUU1QyxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXBFLENBQUM7QUFoQkQsOENBZ0JDOzs7Ozs7Ozs7Ozs7OztBQ25CRCx5RkFBMkM7QUFDM0MsaUhBQTJEO0FBQzNELGlGQUF5QztBQUd6Qzs7O0dBR0c7QUFDSCxTQUFnQixTQUFTLENBQUMsU0FBbUIsRUFBRSxZQUFzQjtJQUVqRSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztJQUUxRCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFMUIsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQzlCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNsQixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTTthQUN6QjtRQUVMLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFqQkQsOEJBaUJDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBbUIsRUFBRSxZQUFzQjtJQUMvRCxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckIsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxHQUFVLEVBQUUsR0FBVTtJQUVqQyxNQUFNLE1BQU0sR0FBVSxFQUFFO0lBRXhCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDYixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBRWIsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxpQ0FBTSxFQUFFLEdBQUssRUFBRSxFQUFHO2FBQ2hDO1FBRUwsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsT0FBTyxlQUFJLEVBQUMsTUFBTSxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxFQUFPLEVBQUUsRUFBTztJQUMvQixNQUFNLFVBQVUsR0FBRywrQkFBWSxFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqRSxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxDQUFTO0lBQzdCLE9BQU8sQ0FBQyxDQUFDLFFBQVE7U0FDWixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLEVBQUUsRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFRO0lBQ3pCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBVSxDQUFDLFVBQVUsQ0FBQztBQUM3RCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2hFRCxTQUFnQixXQUFXLENBQUMsTUFBYztJQUN0QyxPQUFPLE1BQU07U0FDUixRQUFRO1NBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ2xDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQU5ELGtDQU1DOzs7Ozs7Ozs7Ozs7OztBQ1BELDJIQUErRDtBQUMvRCw0R0FBcUQ7QUFDckQsNEdBQXFEO0FBQ3JELDBGQUFtRDtBQUNuRCwyR0FBZ0U7QUFFaEUsd0dBQW1EO0FBQ25ELG1HQUFpRTtBQUNqRSx3SkFBMEU7QUFDMUUsMklBQW1FO0FBSW5FLFNBQWdCLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEdBQVksRUFBRSxPQUFxQixFQUFFOztJQUUzRSxVQUFJLENBQUMsV0FBVyxvQ0FBaEIsSUFBSSxDQUFDLFdBQVcsR0FBSyxvQkFBb0IsQ0FBQyxHQUFHLENBQUM7SUFFOUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsNENBQTRDO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLElBQUksbUNBQWdCLENBQUMsR0FBRyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxFQUFFLFdBQVcsQ0FBQztRQUM3QyxPQUFPLENBQUMsU0FBUyxDQUFDLHVCQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2pHO0lBRUQsSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxNQUFNLEVBQUU7UUFDcEIsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNoRDtTQUFNLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsSUFBSSxFQUFFO1FBQ3pCLE9BQU8sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDOUM7U0FBTSxJQUFJLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRTtRQUM1QixPQUFPLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ2pEO1NBQU0sSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxVQUFVLEVBQUU7UUFDL0IsT0FBTyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNsRDtTQUFNO1FBQ0gsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDNUM7QUFFTCxDQUFDO0FBdEJELDBCQXNCQztBQUdELFNBQVMsa0JBQWtCLENBQUMsT0FBZ0IsRUFBRSxHQUFZLEVBQUUsSUFBbUI7O0lBRTNFLElBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsRUFBRSxFQUFFLDJDQUEyQztRQUVoRSxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtRQUNyRCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxTQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNO1FBQ3JGLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBRyxDQUFDLEtBQUssMENBQUUsU0FBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQzVFLE1BQU0sVUFBVSxHQUFHLHlDQUFpQixFQUFDLE9BQU8sQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEtBQUUsU0FBUyxFQUFFLElBQUksSUFBRyxDQUFDO1FBRXpFLHVHQUF1RztRQUV2RyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxFQUFFLHlCQUF5QjtZQUNuRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUk7U0FDZDtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxFQUFFLGVBQWU7WUFDeEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE9BQU8sSUFBSTtTQUNkO1FBRUQsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLHNDQUFzQztZQUMvRCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztZQUNyRCxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEgsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxJQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xGLE1BQU0sd0JBQXdCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlDQUFNLENBQUMsS0FBRSxTQUFTLEVBQUUsU0FBUyxJQUFHLENBQUM7WUFDbkYsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEQsT0FBTyxTQUFTO1NBQ25CO0tBRUo7U0FBTSxFQUFFLG9DQUFvQztRQUN6QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLE9BQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBRyxDQUFDLEtBQUssMENBQUUsU0FBVSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsT0FBTyxRQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTSxDQUFDLFNBQVUsQ0FBQyxLQUFJLENBQUMsQ0FBQyxVQUFHLENBQUMsS0FBSywwQ0FBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLHlCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUMzRjtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7SUFDNUMsT0FBTyxFQUFFO0FBQ2IsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLE1BQWMsRUFBRSxNQUFVO0lBQ3JDLE9BQU8sTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQyxDQUFDLE1BQU07QUFDOUksQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsT0FBZ0IsRUFBRSxHQUFZLEVBQUUsSUFBbUI7SUFDekUseURBQXlEO0lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsd0RBQXNEO0FBQzNGLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE9BQWdCLEVBQUUsR0FBWSxFQUFFLElBQW1COztJQUU1RSxJQUFJLHNCQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLE1BQU0sMENBQUUsSUFBSSxNQUFLLElBQUksRUFBRTtRQUUzQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFVLGtDQUFPLElBQUksS0FBRSxXQUFXLEVBQUUsS0FBSyxJQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2hGLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFZLGtDQUFPLElBQUksS0FBRSxXQUFXLEVBQUUsSUFBSSxJQUFHO1NBQzNFO0tBRUo7SUFFRCxPQUFPLEVBQUU7QUFDYixDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxPQUFnQixFQUFFLEdBQVksRUFBRSxJQUFtQjtJQUM3RSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO0FBQ3pDLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFnQixFQUFFLEdBQVksRUFBRSxJQUFtQjs7SUFHdkUsSUFBSSxxQkFBRyxDQUFDLEtBQUssMENBQUUsT0FBTywwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxLQUFLLDBDQUFFLEtBQUssSUFBQyxFQUFFO1FBQ3JELE9BQU8sVUFBVSxDQUFDLE9BQU8sRUFBRSxlQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7S0FDaEU7SUFFRCxNQUFNLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0lBRXhDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUMsMkNBQTJDO0lBRTFFLE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7SUFDbEQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7SUFDcEYsbUZBQW1GO0lBRW5GLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLDREQUE0RDtRQUNyRyxPQUFPLE1BQU07S0FDaEI7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSwyQ0FBMkM7UUFDNUQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFFMUQsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsR0FBYSxFQUFFLElBQW1COztJQUUxRCxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNyRCxNQUFNLFVBQVUsR0FBRyxDQUFDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO0lBQ2xLLE1BQU0sS0FBSyxHQUFHLENBQUMscUJBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sMENBQUUsSUFBSSxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVEsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7SUFDM0osTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxLQUFLLDBDQUFFLEtBQUssSUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUUxSSxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUN4RCx3QkFBd0I7SUFFeEIsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7QUFDN0UsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEVBQVk7O0lBQzlCLE9BQU8sTUFBQyxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsS0FBYSwwQ0FBRyxZQUFZLENBQUMsRUFBRSxPQUFPO0FBQ3RELENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxTQUFtQixFQUFFLElBQW1COztJQUUzRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osT0FBTyxvQkFBVztLQUNyQjtJQUVELE9BQU8sa0JBQWtCLENBQUMsTUFBQyxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsS0FBYSwwQ0FBRyxhQUFhLENBQUMsWUFBVyxDQUFhLEVBQUMsOEVBQThFO0FBQy9LLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEdBQWEsRUFBRSxJQUFtQjs7SUFFeEQsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNOLE9BQU8sb0JBQVc7S0FDckI7SUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBUTtJQUM5QixNQUFNLE9BQU8sR0FBRyx1Q0FBZ0IsR0FBRTtJQUNsQyxNQUFNLGdCQUFnQixHQUFHLGVBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFHLG1CQUFtQixDQUFDLDBDQUFFLE1BQU07SUFDbEUsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ3RILE9BQU8scUJBQVEsRUFBQyxnQkFBaUIsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNuRSxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxHQUFhLEVBQUUsSUFBbUI7O0lBQzFELE1BQU0sU0FBUyxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFRO0lBQ2hDLE1BQU0sUUFBUSxHQUFHLHVDQUFnQixHQUFFO0lBQ25DLE1BQU0sV0FBVyxHQUFHLGVBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFdBQVcsMENBQUUsTUFBTztJQUNwRCxNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDekgsT0FBTyxxQkFBUSxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUNqRSxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFhLEVBQUUsSUFBbUI7SUFDOUQsT0FBTyxvQkFBVyxFQUFDLE9BQU87QUFDOUIsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEdBQWE7O0lBRTlCLE1BQU0sQ0FBQyxHQUNILHNCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxJQUFJLDBDQUFFLElBQUksMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxxQkFBUSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RCxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUkscUJBQVEsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEUscUJBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sMENBQUUsSUFBSSwwQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLHFCQUFRLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BFLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFFBQVE7SUFFM0IsSUFBSSxDQUFDLEVBQUU7UUFDSCxPQUFPLElBQUk7S0FDZDtJQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSyxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVGLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLElBQVcsRUFBRSxNQUFjO0lBRWxELCtEQUErRDtJQUMvRCxnRkFBZ0Y7SUFDaEYsbURBQW1EO0lBQ25ELGtEQUFrRDtJQUNsRCwrREFBK0Q7SUFDL0Qsd0RBQXdEO0lBRXhELE1BQU0sRUFBRSxHQUFHLHlDQUFpQixFQUFDLE1BQU0sQ0FBQztJQUVwQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLO0tBQ25EO0lBRUQsd0VBQXdFO0lBQ3hFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxFQUFDLGFBQWE7QUFFekQsQ0FBQztBQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBQyxJQUFJO0FBRzdELFNBQVMsV0FBVyxDQUFDLE1BQWM7SUFDL0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLG9CQUFDLENBQUMsU0FBUywwQ0FBRSxTQUFTLDBDQUFHLENBQUMsQ0FBRSxJQUFDLGtCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RyxNQUFNLEVBQUUsR0FBRyx1Q0FBZ0IsR0FBRTtJQUM3QixPQUFPLG9CQUFRLEVBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDbEMsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLE9BQWdCLEVBQUUsR0FBYSxFQUFFLElBQW1COztJQUNwRSxNQUFNLENBQUMsR0FBRyx3QkFBTSxDQUFDLE1BQU0saUNBQU0sR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssS0FBRSxPQUFPLEVBQUUsU0FBUyxJQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLDBDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLDBDQUFFLEtBQUssSUFBQyxtQ0FBSSxFQUFFO0lBQzFILE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLDZCQUFXLEVBQUMsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxFQUFFO1FBQ0gsT0FBTyxDQUFDLElBQUkseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QjtJQUVELElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ1gsT0FBTyxFQUFFO0tBQ1o7SUFFRCxPQUFPLENBQUMsSUFBSSx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEdBQVk7O0lBQ3RDLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBRyxDQUFDLEtBQUssMENBQUUsTUFBTSxNQUFJLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLElBQUksTUFBSSxTQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLEVBQUM7QUFDekUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUMxUEQ7O0dBRUc7QUFDVSxrQkFBVSxHQUFHO0lBQ3RCLFVBQVUsRUFBRSxZQUFZO0NBQzNCOzs7Ozs7Ozs7Ozs7OztBQ1RELFNBQWdCLGdCQUFnQjtJQUM1QixNQUFNLEtBQUssR0FBRyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QyxPQUFPLEtBQUs7QUFDaEIsQ0FBQztBQUhELDRDQUdDO0FBRUQsTUFBTSxXQUFXLEdBQUcseUJBQXlCLEVBQUUsQ0FBQztBQUVoRCxRQUFRLENBQUMsQ0FBQyx5QkFBeUI7SUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsT0FBTyxJQUFJLEVBQUU7UUFDVCxDQUFDLEVBQUUsQ0FBQztRQUNKLE1BQU0sQ0FBQyxDQUFDO0tBQ1g7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ1ZELFNBQWdCLE9BQU8sQ0FBQyxFQUFNO0lBQzFCLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ05ELG1HQUFvQztBQUVwQzs7R0FFRztBQUVILFNBQWdCLE9BQU8sQ0FBQyxHQUFTO0lBQzdCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLHFCQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCxTQUFnQixVQUFVLENBQUMsTUFBYztJQUNyQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLDJCQUEyQjtJQUM5QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBTEQsZ0NBS0M7Ozs7Ozs7Ozs7Ozs7O0FDTkQsNEVBQTZCO0FBRTdCOztHQUVHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLEVBQVksRUFBRSxFQUFZO0lBQ25ELE9BQU8sZUFBSSxFQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUhELG9DQUdDOzs7Ozs7Ozs7Ozs7OztBQ1BEOzs7R0FHRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxNQUFjOztJQUV0QyxNQUFNLE1BQU0sR0FBRyxZQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQywwQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXpDLElBQUksTUFBTSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUU7UUFDMUIsT0FBTyxTQUFTO0tBQ25CO0lBRUQsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBRTdCLENBQUM7QUFWRCxrQ0FVQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxTQUFnQixjQUFjLENBQW1CLEdBQUcsSUFBUyxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFwRix3Q0FBb0Y7Ozs7Ozs7Ozs7Ozs7O0FDQXBGOztHQUVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFJLEdBQVE7SUFDNUIsSUFBSSxJQUFJLEdBQUcsRUFBUztJQUVwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM1RCxDQUFDLENBQUM7QUFDTixDQUFDO0FBUEQsb0JBT0M7Ozs7Ozs7VUNWRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9CYXNlVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvSW5zdHJ1Y3Rpb25UaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvTnVtYmVyVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL1N0cmluZ1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9UaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9Bc3RDYW52YXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9hc3RUb0VkZ2VMaXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZHJhd0xpbmUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9kcmF3Tm9kZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2dldENvb3Jkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L3Bsb3RBc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcGx1cmFsaXplLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BdG9tQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvc29sdmVNYXBzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2V2YWxBc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvcGFyc2VOdW1iZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5cblxubWFpbigpIiwiaW1wb3J0IHsgZXh0cmFwb2xhdGUsIExleGVtZSB9IGZyb20gJy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZSc7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gJy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZSc7XG5pbXBvcnQgeyBJZCB9IGZyb20gJy4uL21pZGRsZS9pZC9JZCc7XG5pbXBvcnQgeyBNYXAgfSBmcm9tICcuLi9taWRkbGUvaWQvTWFwJztcbmltcG9ydCB7IHVuaXEgfSBmcm9tICcuLi91dGlscy91bmlxJztcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSAnLi9UaGluZyc7XG5cblxuZXhwb3J0IGNsYXNzIEJhc2VUaGluZyBpbXBsZW1lbnRzIFRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZXM6IFRoaW5nW10gPSBbXSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNoaWxkcmVuOiB7IFtpZDogSWRdOiBUaGluZyB9ID0ge30sXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtdLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgZ2V0SWQoKTogSWQge1xuICAgICAgICByZXR1cm4gdGhpcy5pZFxuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBJZCB9KTogVGhpbmcge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhcbiAgICAgICAgICAgIG9wdHM/LmlkID8/IHRoaXMuaWQsIC8vIGNsb25lcyBoYXZlIHNhbWUgaWRcbiAgICAgICAgICAgIHRoaXMuYmFzZXMubWFwKHggPT4geC5jbG9uZSgpKSxcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuY2hpbGRyZW4pLm1hcChlID0+ICh7IFtlWzBdXTogZVsxXS5jbG9uZSgpIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgZXh0ZW5kcyA9ICh0aGluZzogVGhpbmcpID0+IHtcbiAgICAgICAgdGhpcy51bmV4dGVuZHModGhpbmcpIC8vIG9yIGF2b2lkP1xuICAgICAgICB0aGlzLmJhc2VzLnB1c2godGhpbmcuY2xvbmUoKSlcbiAgICB9XG5cbiAgICB1bmV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYmFzZXMgPSB0aGlzLmJhc2VzLmZpbHRlcih4ID0+IHguZ2V0SWQoKSAhPT0gdGhpbmcuZ2V0SWQoKSlcbiAgICB9XG5cbiAgICBnZXQgPSAoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcuJylcbiAgICAgICAgY29uc3QgcDEgPSBwYXJ0c1swXVxuICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5bcDFdID8/IHRoaXMuY2hpbGRyZW5baWRdXG4gICAgICAgIGNvbnN0IHJlcyA9IC8qIHBhcnRzLmxlbmd0aCA+IDEgKi8gY2hpbGQuZ2V0SWQoKSAhPT0gaWQgPyBjaGlsZC5nZXQoaWQgLyogcGFydHMuc2xpY2UoMSkuam9pbignLicpICovKSA6IGNoaWxkXG4gICAgICAgIHJldHVybiByZXMgPz8gdGhpcy5iYXNlcy5maW5kKHggPT4geC5nZXQoaWQpKVxuICAgIH1cblxuICAgIHNldChpZDogSWQsIHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoaWxkcmVuW2lkXSA9IHRoaW5nXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgcm9vdDogJ3RoaW5nJywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFt0aGluZ10gfSkgLy8gZXZlcnkgdGhpbmcgaXMgYSB0aGluZ1xuXG4gICAgICAgIC8vVE9ET1xuICAgICAgICBpZiAodHlwZW9mIHRoaW5nLnRvSnMoKSA9PT0gJ3N0cmluZycpIHsgLy9UT0RPIG1ha2UgdGhpcyBwb2x5bW9ycGhpY1xuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAnc3RyaW5nJywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFt0aGluZ10gfSkgXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaW5nLnRvSnMoKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgcm9vdDogJ251bWJlcicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHRvSnMoKTogb2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMgLy9UT0RPb29vb29vb29PTyFcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLnRvQ2xhdXNlKHF1ZXJ5KS5xdWVyeShxdWVyeSwgey8qIGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkICAqLyB9KSlcbiAgICB9XG5cbiAgICB0b0NsYXVzZSA9IChxdWVyeT86IENsYXVzZSk6IENsYXVzZSA9PiB7XG5cbiAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZW1lc1xuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiB4LnJlZmVyZW50cy5tYXAociA9PiBjbGF1c2VPZih4LCByLmdldElkKCkpKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCB5ID0gT2JqZWN0XG4gICAgICAgICAgICAua2V5cyh0aGlzLmNoaWxkcmVuKVxuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHsgcm9vdDogJ29mJywgdHlwZTogJ3ByZXBvc2l0aW9uJywgcmVmZXJlbnRzOiBbXSB9LCB4LCB0aGlzLmlkKSkgLy8gaGFyZGNvZGVkIGVuZ2xpc2ghXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgeiA9IE9iamVjdFxuICAgICAgICAgICAgLnZhbHVlcyh0aGlzLmNoaWxkcmVuKVxuICAgICAgICAgICAgLm1hcCh4ID0+IHgudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiB4LmFuZCh5KS5hbmQoeikuc2ltcGxlXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lID0gKGxleGVtZTogTGV4ZW1lKSA9PiB7XG5cbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQ6IExleGVtZVtdID0gb2xkLm1hcCh4ID0+ICh7IC4uLngsIC4uLmxleGVtZSwgcmVmZXJlbnRzOiBbLi4ueC5yZWZlcmVudHMsIC4uLmxleGVtZS5yZWZlcmVudHNdIH0pKVxuICAgICAgICB0aGlzLmxleGVtZXMgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgY29uc3QgdG9CZUFkZGVkID0gdXBkYXRlZC5sZW5ndGggPyB1cGRhdGVkIDogW2xleGVtZV1cbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goLi4udG9CZUFkZGVkKVxuICAgICAgICBjb25zdCBleHRyYXBvbGF0ZWQgPSB0b0JlQWRkZWQuZmxhdE1hcCh4ID0+IGV4dHJhcG9sYXRlKHgsIHRoaXMpKVxuICAgICAgICB0aGlzLmxleGVtZXMucHVzaCguLi5leHRyYXBvbGF0ZWQpXG5cbiAgICB9XG5cbiAgICBnZXRMZXhlbWVzID0gKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWVbXSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByb290T3JUb2tlbiA9PT0geC50b2tlbiB8fCByb290T3JUb2tlbiA9PT0geC5yb290KVxuICAgIH1cblxuICAgIHJlbW92ZUxleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdhcmJhZ2UgPSB0aGlzLmdldExleGVtZXMocm9vdE9yVG9rZW4pLmZsYXRNYXAoeCA9PiB4LnJlZmVyZW50cylcbiAgICAgICAgZ2FyYmFnZS5mb3JFYWNoKHggPT4gZGVsZXRlIHRoaXMuY2hpbGRyZW5beC5nZXRJZCgpXSlcbiAgICAgICAgdGhpcy5sZXhlbWVzID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHJvb3RPclRva2VuICE9PSB4LnRva2VuICYmIHJvb3RPclRva2VuICE9PSB4LnJvb3QpXG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyOiBUaGluZyk6IGJvb2xlYW4geyAvL1RPRE86IGltcGxlbWVudCBuZXN0ZWQgc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgICAgICByZXR1cm4gdGhpcy50b0pzKCkgPT09IG90aGVyPy50b0pzKClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZXh0cmFwb2xhdGUsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29udGV4dCBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSBjb25maWcuc3ludGF4ZXMsXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IGNvbmZpZy5sZXhlbWVzLmZsYXRNYXAobCA9PiBbbCwgLi4uZXh0cmFwb2xhdGUobCldKSxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICkge1xuICAgICAgICBzdXBlcihpZCwgYmFzZXMsIGNoaWxkcmVuLCBsZXhlbWVzKVxuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHsgLy9UT0RPIVxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRzOiBbXSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgfVxuXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWZyZXNoU3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TGlzdFxuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQXN0Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ25vdW4nLCByb290OiBzeW50YXgubmFtZSwgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdCA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGNsb25lKCk6IENvbnRleHQge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgICAgICB0aGlzLnN5bnRheE1hcCxcbiAgICAgICAgICAgIHRoaXMubGV4ZW1lcyxcbiAgICAgICAgICAgIHRoaXMuYmFzZXMsXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLCAvL3NoYWxsb3cgb3IgZGVlcD9cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IEJhc2ljQ29udGV4dCB9IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBUaGluZyB7XG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW11cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW11cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZ1xuICAgIGNsb25lKCk6IENvbnRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQob3B0czogeyBpZDogSWQgfSk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KG9wdHMuaWQpXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvblRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBBc3ROb2RlKSB7XG4gICAgICAgIHN1cGVyKGdldEluY3JlbWVudGFsSWQoKSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHZhbHVlICsgJycpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSBhcyBhbnlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZywgaWQ6IElkID0gdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSBhcyBhbnkgLy9qcyBzdWNrc1xuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCk6IFRoaW5nIHsgLy9UT0RPIVxuICAgICAgICAvLyBjb25zdCB4ID0gc3VwZXIuY2xvbmUob3B0cylcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUaGluZyh0aGlzLnZhbHVlLCBvcHRzPy5pZClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9taWRkbGUvaWQvTWFwXCJcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBUaGluZyB7XG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCAvL3RoaW5nLmlkPz8/XG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IElkIH0pOiBUaGluZ1xuICAgIHRvSnMoKTogb2JqZWN0XG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICBleHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICB1bmV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBnZXRMZXhlbWVzKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWVbXVxuICAgIHJlbW92ZUxleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRJZCgpOiBJZFxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyYiBleHRlbmRzIFRoaW5nIHtcbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBbcm9sZSBpbiBWZXJiQXJnc106IFRoaW5nIH0pOiBUaGluZ1tdIC8vIGNhbGxlZCBkaXJlY3RseSBpbiBldmFsVmVyYlNlbnRlbmNlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoaW5nKGFyZ3M6IHsgaWQ6IElkLCBiYXNlczogVGhpbmdbXSB9KSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoYXJncy5pZCwgYXJncy5iYXNlcylcbn1cblxudHlwZSBWZXJiQXJncyA9ICdzdWJqZWN0J1xuICAgIHwgJ2RpcmVjdE9iamVjdCdcbiAgICB8ICdpbmRpcmVjdE9iamVjdCdcbiAgICAvLyAuLi5cbiIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4vcHJlbHVkZVwiXG5pbXBvcnQgeyBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIC8vIHRoaW5ncyxcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICd2ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZFxuICAnZGlzanVuYycsIC8vIG9yXG4gICdwcm9ub3VuJyxcbiAgJ3F1b3RlJyxcblxuICAnbWFrcm8ta2V5d29yZCcsXG4gICdleGNlcHQta2V5d29yZCcsXG4gICd0aGVuLWtleXdvcmQnLFxuICAnZW5kLWtleXdvcmQnLFxuXG4gICdnZW5pdGl2ZS1wYXJ0aWNsZScsXG4gICdkYXRpdmUtcGFydGljbGUnLFxuICAnYWJsYXRpdmUtcGFydGljbGUnLFxuICAnbG9jYXRpdmUtcGFydGljbGUnLFxuICAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJyxcbiAgJ2NvbWl0YXRpdmUtcGFydGljbGUnLFxuXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtcblxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSwgLy9UT0RPISAyK1xuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgdG9rZW46ICdkb2VzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdoYXZlJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtdIH0sLy90ZXN0XG4gICAgeyByb290OiAnbm90JywgdHlwZTogJ25lZ2F0aW9uJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gbG9naWNhbCByb2xlcyBvZiBhIGNvbnN0aXR1ZW50IHRvIGFic3RyYWN0IGF3YXkgd29yZCBvcmRlclxuICAgIHsgcm9vdDogJ3N1YmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3ByZWRpY2F0ZScsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb2JqZWN0JywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdjb25kaXRpb24nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbnNlcXVlbmNlJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvd25lcicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncmVjZWl2ZXInLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29yaWdpbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnbG9jYXRpb24nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2luc3RydW1lbnQnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LCAvL21lYW5zXG4gICAgeyByb290OiAnY29tcGFuaW9uJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcblxuICAgIC8vIG51bWJlciBvZiB0aW1lcyBhIGNvbnN0aXR1ZW50IGNhbiBhcHBlYXJcbiAgICB7IHJvb3Q6ICdvcHRpb25hbCcsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJzF8MCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbmUtb3ItbW9yZScsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJysnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnemVyby1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnb3InLCB0eXBlOiAnZGlzanVuYycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbmQnLCB0eXBlOiAnbm9uc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoZScsIHR5cGU6ICdkZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaWYnLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd3aGVuJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXZlcnknLCB0eXBlOiAndW5pcXVhbnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW55JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoYXQnLCB0eXBlOiAncmVscHJvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpdCcsIHR5cGU6ICdwcm9ub3VuJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnXCInLCB0eXBlOiAncXVvdGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnLicsIHR5cGU6ICdmdWxsc3RvcCcsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ3RoZW4nLCB0eXBlOiAndGhlbi1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V4Y2VwdCcsIHR5cGU6ICdleGNlcHQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdtYWtybycsIHR5cGU6ICdtYWtyby1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2VuZCcsIHR5cGU6ICdlbmQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnb2YnLCB0eXBlOiAnZ2VuaXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndG8nLCB0eXBlOiAnZGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2Zyb20nLCB0eXBlOiAnYWJsYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb24nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW4nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYXQnLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYnknLCB0eXBlOiAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3dpdGgnLCB0eXBlOiAnY29taXRhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcblxuXG5cbl1cblxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZyA9XG5cbiAgYFxuICBtYWtybyBcbiAgICBhbnktbGV4ZW1lIGlzIGFkamVjdGl2ZSBcbiAgICAgICAgICAgIG9yIGNvcHVsYSBcbiAgICAgICAgICAgIG9yIGRlZmFydCBcbiAgICAgICAgICAgIG9yIGluZGVmYXJ0IFxuICAgICAgICAgICAgb3IgZnVsbHN0b3AgXG4gICAgICAgICAgICBvciBodmVyYiBcbiAgICAgICAgICAgIG9yIHZlcmIgXG4gICAgICAgICAgICBvciBuZWdhdGlvbiBcbiAgICAgICAgICAgIG9yIGV4aXN0cXVhbnQgXG4gICAgICAgICAgICBvciB1bmlxdWFudCBcbiAgICAgICAgICAgIG9yIHJlbHByb24gXG4gICAgICAgICAgICBvciBuZWdhdGlvbiBcbiAgICAgICAgICAgIG9yIG5vdW4gXG4gICAgICAgICAgICBvciBwcmVwb3NpdGlvbiBcbiAgICAgICAgICAgIG9yIHN1YmNvbmogXG4gICAgICAgICAgICBvciBub25zdWJjb25qIFxuICAgICAgICAgICAgb3IgZGlzanVuYyBcbiAgICAgICAgICAgIG9yIHByb25vdW4gXG4gICAgICAgICAgICBvciB0aGVuLWtleXdvcmRcbiAgICAgICAgICAgIG9yIG1ha3JvLWtleXdvcmQgXG4gICAgICAgICAgICBvciBleGNlcHQta2V5d29yZCBcbiAgICAgICAgICAgIG9yIHF1b3RlXG4gIGVuZC5cbiAgXG4gIG1ha3JvIFxuICAgIHF1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCBcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGFydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0IFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBnZW5pdGl2ZS1jb21wbGVtZW50IGlzIGdlbml0aXZlLXBhcnRpY2xlIHRoZW4gb3duZXIgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgZGF0aXZlLWNvbXBsZW1lbnQgaXMgZGF0aXZlLXBhcnRpY2xlIHRoZW4gcmVjZWl2ZXIgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgYWJsYXRpdmUtY29tcGxlbWVudCBpcyBhYmxhdGl2ZS1wYXJ0aWNsZSB0aGVuIG9yaWdpbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBsb2NhdGl2ZS1jb21wbGVtZW50IGlzIGxvY2F0aXZlLXBhcnRpY2xlIHRoZW4gbG9jYXRpb24gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgaW5zdHJ1bWVudGFsLWNvbXBsZW1lbnQgaXMgaW5zdHJ1bWVudGFsLXBhcnRpY2xlIHRoZW4gaW5zdHJ1bWVudCBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBjb21pdGF0aXZlLWNvbXBsZW1lbnQgaXMgY29taXRhdGl2ZS1wYXJ0aWNsZSB0aGVuIGNvbXBhbmlvbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxlbWVudCBpcyBcbiAgICBnZW5pdGl2ZS1jb21wbGVtZW50IG9yIFxuICAgIGRhdGl2ZS1jb21wbGVtZW50IG9yXG4gICAgYWJsYXRpdmUtY29tcGxlbWVudCBvclxuICAgIGxvY2F0aXZlLWNvbXBsZW1lbnQgb3JcbiAgICBpbnN0cnVtZW50YWwtY29tcGxlbWVudCBvclxuICAgIGNvbWl0YXRpdmUtY29tcGxlbWVudFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29wdWxhLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICB0aGVuIGNvcHVsYSBcbiAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZSBcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgYW5kLXBocmFzZSBpcyBub25zdWJjb25qIHRoZW4gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICB0aGVuIHplcm8tb3ItbW9yZSBhZGplY3RpdmVzIFxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3Igc3RyaW5nXG4gICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZVxuICAgICAgdGhlbiBvcHRpb25hbCBnZW5pdGl2ZS1jb21wbGVtZW50XG4gICAgICB0aGVuIG9wdGlvbmFsIGFuZC1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgbXZlcmJzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIHZlcmIgdGhlbiBvYmplY3Qgbm91bi1waHJhc2UgXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlIG9yIG12ZXJic3ViY2xhdXNlIFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgICAgdGhlbiBvcHRpb25hbCBodmVyYiBcbiAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICB0aGVuIHZlcmIgXG4gICAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHNcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgdmVyYi1zZW50ZW5jZSBcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICBjb21wbGV4LXNlbnRlbmNlLTEgaXMgc3ViY29uaiBcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICAgIHRoZW4gdGhlbi1rZXl3b3JkXG4gICAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZS0yIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZSBcbiAgICAgIHRoZW4gc3ViY29uaiBcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgc3RyaW5nIGlzIHF1b3RlIHRoZW4gb25lLW9yLW1vcmUgYW55LWxleGVtZSBleGNlcHQgcXVvdGUgdGhlbiBxdW90ZSBcbiAgZW5kLlxuXG4gIGBcbiIsImltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBDb21wb3NpdGVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGNvbnN0aXR1ZW50VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ21hY3JvJyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAndGFnZ2VkdW5pb24nLFxuICAgICdleGNlcHR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gWydtYWNybyddXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbWFrcm8ta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZW5kLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZXhjZXB0dW5pb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdleGNlcHR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICBdXG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpbkxpc3RlbmVyXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBsb3RBc3QgfSBmcm9tIFwiLi9wbG90QXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBBc3RDYW52YXMgaW1wbGVtZW50cyBCcmFpbkxpc3RlbmVyIHtcblxuICAgIHJlYWRvbmx5IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcHJvdGVjdGVkIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgICBwcm90ZWN0ZWQgY2FtZXJhT2Zmc2V0ID0geyB4OiB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6IHdpbmRvdy5pbm5lckhlaWdodCAvIDIgfVxuICAgIHByb3RlY3RlZCBpc0RyYWdnaW5nID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgZHJhZ1N0YXJ0ID0geyB4OiAwLCB5OiAwIH1cbiAgICBwcm90ZWN0ZWQgYXN0PzogQXN0Tm9kZVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC54ID0gZS54IC0gdGhpcy5jYW1lcmFPZmZzZXQueFxuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQueSA9IGUueSAtIHRoaXMuY2FtZXJhT2Zmc2V0LnlcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZSA9PiB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYU9mZnNldC54ID0gZS5jbGllbnRYIC0gdGhpcy5kcmFnU3RhcnQueFxuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhT2Zmc2V0LnkgPSBlLmNsaWVudFkgLSB0aGlzLmRyYWdTdGFydC55XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBsb3QoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG9uVXBkYXRlKGFzdDogQXN0Tm9kZSwgcmVzdWx0czogVGhpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFzdCA9IGFzdFxuICAgICAgICB0aGlzLnJlcGxvdCgpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlcGxvdCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMilcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKC13aW5kb3cuaW5uZXJXaWR0aCAvIDIgKyB0aGlzLmNhbWVyYU9mZnNldC54LCAtd2luZG93LmlubmVySGVpZ2h0IC8gMiArIHRoaXMuY2FtZXJhT2Zmc2V0LnkpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQ/LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIGNvbnRleHQgaXMgdW5kZWZpbmVkIScpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hc3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzdCBpcyBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxvdEFzdCh0aGlzLmNvbnRleHQsIHRoaXMuYXN0KVxuICAgICAgICB9KVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3RUb0VkZ2VMaXN0KFxuICAgIGFzdDogQXN0Tm9kZSxcbiAgICBwYXJlbnROYW1lPzogc3RyaW5nLFxuICAgIGVkZ2VzOiBFZGdlTGlzdCA9IFtdLFxuKTogRWRnZUxpc3Qge1xuXG4gICAgY29uc3QgYXN0TmFtZSA9IChhc3Qucm9sZSA/PyBhc3QubGV4ZW1lPy5yb290ID8/IGFzdC50eXBlKSArIHJhbmRvbSgpXG5cbiAgICBjb25zdCBhZGRpdGlvbnM6IEVkZ2VMaXN0ID0gW11cblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICAgIGFkZGl0aW9ucy5wdXNoKFtwYXJlbnROYW1lLCBhc3ROYW1lXSlcbiAgICB9XG5cbiAgICBpZiAoIWFzdC5saW5rcyAmJiAhYXN0Lmxpc3QpIHsgLy8gbGVhZiFcbiAgICAgICAgcmV0dXJuIFsuLi5lZGdlcywgLi4uYWRkaXRpb25zXVxuICAgIH1cblxuICAgIGlmIChhc3QubGlua3MpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLmZsYXRNYXAoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXplcm8gPSBlWzBdICsgcmFuZG9tKClcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFkZGl0aW9ucywgW2FzdE5hbWUsIGV6ZXJvXSwgLi4uYXN0VG9FZGdlTGlzdChlWzFdLCBlemVybywgZWRnZXMpXVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGFzdC5saXN0LmZsYXRNYXAoeCA9PiBhc3RUb0VkZ2VMaXN0KHgsIGFzdE5hbWUsIGVkZ2VzKSlcbiAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIC4uLmVkZ2VzLCAuLi5saXN0XVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiByYW5kb20oKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KDEwMDAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJylcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdMaW5lKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZnJvbTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBmcm9tTm9kZS5zdHJva2VTdHlsZVxuICAgIGNvbnRleHQubW92ZVRvKGZyb20ueCwgZnJvbS55KVxuICAgIGNvbnRleHQubGluZVRvKHRvLngsIHRvLnkpXG4gICAgY29udGV4dC5zdHJva2UoKVxufSIsImltcG9ydCB7IEdyYXBoTm9kZSB9IGZyb20gXCIuL05vZGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd05vZGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBub2RlOiBHcmFwaE5vZGUpIHtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuYXJjKG5vZGUueCwgbm9kZS55LCBub2RlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IG5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG5vZGUuZmlsbFN0eWxlXG4gICAgY29udGV4dC5zdHJva2UoKVxuICAgIGNvbnRleHQuZmlsbCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNGRjAwMDBcIlxuICAgIGNvbnRleHQuZm9udCA9IFwiMTBweCBBcmlhbFwiLy8yMHB4XG4gICAgY29uc3QgdGV4dE9mZnNldCA9IDEwICogbm9kZS5sYWJlbC5sZW5ndGggLyAyIC8vc29tZSBtYWdpYyBpbiBoZXJlIVxuICAgIGNvbnRleHQuZmlsbFRleHQobm9kZS5sYWJlbCwgbm9kZS54IC0gdGV4dE9mZnNldCwgbm9kZS55KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi91dGlscy91bmlxXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb3JkcyhcbiAgICBpbml0aWFsUG9zOiBDb29yZGluYXRlLFxuICAgIGRhdGE6IEVkZ2VMaXN0LFxuICAgIG9sZENvb3JkczogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9ID0ge30sXG4gICAgbmVzdGluZ0ZhY3RvciA9IDEsXG4pOiB7IFt4OiBzdHJpbmddOiBDb29yZGluYXRlIH0ge1xuXG4gICAgY29uc3Qgcm9vdCA9IGdldFJvb3QoZGF0YSkgLy8gbm9kZSB3L291dCBhIHBhcmVudFxuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJldHVybiBvbGRDb29yZHNcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuT2Yocm9vdCwgZGF0YSlcbiAgICBjb25zdCByb290UG9zID0gb2xkQ29vcmRzW3Jvb3RdID8/IGluaXRpYWxQb3NcblxuICAgIGNvbnN0IHlPZmZzZXQgPSA1MFxuICAgIGNvbnN0IHhPZmZzZXQgPSAyMDBcblxuICAgIGNvbnN0IGNoaWxkQ29vcmRzID0gY2hpbGRyZW5cbiAgICAgICAgLm1hcCgoYywgaSkgPT4gKHsgW2NdOiB7IHg6IHJvb3RQb3MueCArIGkgKiBuZXN0aW5nRmFjdG9yICogeE9mZnNldCAqIChpICUgMiA9PSAwID8gMSA6IC0xKSwgeTogcm9vdFBvcy55ICsgeU9mZnNldCAqIChuZXN0aW5nRmFjdG9yICsgMSkgfSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCByZW1haW5pbmdEYXRhID0gZGF0YS5maWx0ZXIoeCA9PiAheC5pbmNsdWRlcyhyb290KSlcbiAgICBjb25zdCBwYXJ0aWFsUmVzdWx0ID0geyAuLi5vbGRDb29yZHMsIC4uLmNoaWxkQ29vcmRzLCAuLi57IFtyb290XTogcm9vdFBvcyB9IH1cblxuICAgIHJldHVybiBnZXRDb29yZHMoaW5pdGlhbFBvcywgcmVtYWluaW5nRGF0YSwgcGFydGlhbFJlc3VsdCwgMC45ICogbmVzdGluZ0ZhY3Rvcilcbn1cblxuZnVuY3Rpb24gZ2V0Um9vdChlZGdlczogRWRnZUxpc3QpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBlZGdlc1xuICAgICAgICAuZmxhdCgpIC8vIHRoZSBub2Rlc1xuICAgICAgICAuZmlsdGVyKG4gPT4gIWVkZ2VzLnNvbWUoZSA9PiBlWzFdID09PSBuKSlbMF1cbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRyZW5PZihwYXJlbnQ6IHN0cmluZywgZWRnZXM6IEVkZ2VMaXN0KSB7XG4gICAgcmV0dXJuIHVuaXEoZWRnZXMuZmlsdGVyKHggPT4geFswXSA9PT0gcGFyZW50KS5tYXAoeCA9PiB4WzFdKSkgLy9UT0RPIGR1cGxpY2F0ZSBjaGlsZHJlbiBhcmVuJ3QgcGxvdHRlZCB0d2ljZSwgYnV0IHN0aWxsIG1ha2UgdGhlIGdyYXBoIHVnbGllciBiZWNhdXNlIHRoZXkgYWRkIFwiaVwiIGluZGVjZXMgaW4gY2hpbGRDb29yZHMgY29tcHV0YXRpb24gYW5kIG1ha2Ugc2luZ2xlIGNoaWxkIGRpc3BsYXkgTk9UIHN0cmFpZ2h0IGRvd24uXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgYXN0VG9FZGdlTGlzdCB9IGZyb20gXCIuL2FzdFRvRWRnZUxpc3RcIlxuaW1wb3J0IHsgZHJhd0xpbmUgfSBmcm9tIFwiLi9kcmF3TGluZVwiXG5pbXBvcnQgeyBkcmF3Tm9kZSB9IGZyb20gXCIuL2RyYXdOb2RlXCJcbmltcG9ydCB7IGdldENvb3JkcyB9IGZyb20gXCIuL2dldENvb3Jkc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBwbG90QXN0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgYXN0OiBBc3ROb2RlKSB7XG5cbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgY29uc3QgcmVjdCA9IGNvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBjb25zdCBlZGdlcyA9IGFzdFRvRWRnZUxpc3QoYXN0KVxuICAgIGNvbnN0IGNvb3JkcyA9IGdldENvb3Jkcyh7IHg6IHJlY3QueCAtIHJlY3Qud2lkdGggLyAyLCB5OiByZWN0LnkgfSwgZWRnZXMpXG5cbiAgICBPYmplY3QuZW50cmllcyhjb29yZHMpLmZvckVhY2goYyA9PiB7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNbMF1cbiAgICAgICAgY29uc3QgcG9zID0gY1sxXVxuXG4gICAgICAgIGRyYXdOb2RlKGNvbnRleHQsIHtcbiAgICAgICAgICAgIHg6IHBvcy54LFxuICAgICAgICAgICAgeTogcG9zLnksXG4gICAgICAgICAgICByYWRpdXM6IDIsIC8vMTBcbiAgICAgICAgICAgIGZpbGxTdHlsZTogJyMyMmNjY2MnLFxuICAgICAgICAgICAgc3Ryb2tlU3R5bGU6ICcjMDA5OTk5JyxcbiAgICAgICAgICAgIGxhYmVsOiBuYW1lLnJlcGxhY2VBbGwoL1xcZCsvZywgJycpXG4gICAgICAgIH0pXG5cbiAgICB9KVxuXG4gICAgZWRnZXMuZm9yRWFjaChlID0+IHtcblxuICAgICAgICBjb25zdCBmcm9tID0gY29vcmRzW2VbMF1dXG4gICAgICAgIGNvbnN0IHRvID0gY29vcmRzW2VbMV1dXG5cbiAgICAgICAgaWYgKGZyb20gJiYgdG8pIHtcbiAgICAgICAgICAgIGRyYXdMaW5lKGNvbnRleHQsIGZyb20sIHRvKVxuICAgICAgICB9XG5cbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gXCIuLi9iYWNrZW5kL0NvbnRleHRcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvVGhpbmdcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vbWlkZGxlL2V2YWxBc3RcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgQnJhaW5MaXN0ZW5lciB9IGZyb20gXCIuL0JyYWluTGlzdGVuZXJcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgcmVhZG9ubHkgY29udGV4dCA9IGdldENvbnRleHQoeyBpZDogJ2dsb2JhbCcgfSlcbiAgICBwcm90ZWN0ZWQgbGlzdGVuZXJzOiBCcmFpbkxpc3RlbmVyW10gPSBbXVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZSh0aGlzLmNvbnRleHQuZ2V0UHJlbHVkZSgpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLmZsYXRNYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCByZXN1bHRzOiBUaGluZ1tdID0gW11cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgbC5vblVwZGF0ZShhc3QsIHJlc3VsdHMpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogb2JqZWN0W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHgudG9KcygpKVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaW5jbHVkZXMobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCJcblxuLyoqXG4gKiBBIGZhY2FkZSB0byB0aGUgRGVpeGlzY3JpcHQgaW50ZXJwcmV0ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBvYmplY3RbXVxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCB0b2tlbnM6IExleGVtZVtdID0gW11cbiAgICBwcm90ZWN0ZWQgd29yZHM6IHN0cmluZ1tdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIHRoaXMud29yZHMgPVxuICAgICAgICAgICAgc3BhY2VPdXQoc291cmNlQ29kZSwgWydcIicsICcuJ10pXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICB9XG5cbiAgICByZWZyZXNoVG9rZW5zKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMud29yZHMubWFwKHcgPT4gdGhpcy5jb250ZXh0LmdldExleGVtZXModykuYXQoMCkgPz8gbWFrZUxleGVtZSh7IHJvb3Q6IHcsIHRva2VuOiB3LCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW10gfSkpXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHNwYWNlT3V0KHNvdXJjZUNvZGU6IHN0cmluZywgc3BlY2lhbENoYXJzOiBzdHJpbmdbXSkge1xuXG4gICAgcmV0dXJuIHNvdXJjZUNvZGVcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAucmVkdWNlKChhLCBjKSA9PiBhICsgKHNwZWNpYWxDaGFycy5pbmNsdWRlcyhjKSA/ICcgJyArIGMgKyAnICcgOiBjKSwgJycpXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICByZWFkb25seSByb290OiBzdHJpbmdcbiAgICByZWFkb25seSB0eXBlOiBMZXhlbWVUeXBlXG4gICAgcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbiAgICByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVmZXJlbnRzOiBUaGluZ1tdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IExleGVtZSk6IExleGVtZSB7XG4gICAgcmV0dXJuIGRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGx1cmFsKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGlzUmVwZWF0YWJsZShsZXhlbWUuY2FyZGluYWxpdHkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYXBvbGF0ZShsZXhlbWU6IExleGVtZSwgY29udGV4dD86IFRoaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicgJiYgIWlzUGx1cmFsKGxleGVtZSkpIHtcbiAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogcGx1cmFsaXplKGxleGVtZS5yb290KSxcbiAgICAgICAgICAgIGNhcmRpbmFsaXR5OiAnKicsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSldXG4gICAgfVxuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAndmVyYicpIHtcbiAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZShsZXhlbWUucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHgsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5nZXRTeW50YXhMaXN0KCkpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2ltcGxlQXN0ID0gdGhpcy5zaW1wbGlmeShhc3QpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc2ltcGxlQXN0KVxuXG4gICAgICAgICAgICBpZiAoc2ltcGxlQXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2V0U3ludGF4KGFzdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUsIGV4Y2VwdFR5cGVzPzogQXN0VHlwZVtdKSB7IC8vcHJvYmxlbWF0aWNcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4ICYmICFleGNlcHRUeXBlcz8uaW5jbHVkZXMoeC50eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSwgbS5leGNlcHRUeXBlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldExleGVtZVR5cGVzKCkuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoIWFzdC5saW5rcykge1xuICAgICAgICAgICAgcmV0dXJuIGFzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSAmJiBPYmplY3QudmFsdWVzKGFzdC5saW5rcykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShPYmplY3QudmFsdWVzKGFzdC5saW5rcylbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLm1hcChsID0+ICh7IFtsWzBdXTogdGhpcy5zaW1wbGlmeShsWzFdKSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCBsaW5rczogc2ltcGxlTGlua3MgfVxuXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ub3VuKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIGNvbnN0IGV4Y2VwdFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8uZXhjZXB0dW5pb24/LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IG5vdEdyYW1tYXJzID0gZXhjZXB0VW5pb25zLm1hcCh4ID0+IHgubGlua3M/Lm5vdW4pXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eSxcbiAgICAgICAgZXhjZXB0VHlwZTogbm90R3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgeyBBc3RDYW52YXMgfSBmcm9tIFwiLi4vZHJhdy1hc3QvQXN0Q2FudmFzXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gYnJhaW5cblxuICAgIGNvbnN0IGFzdENhbnZhcyA9IG5ldyBBc3RDYW52YXMoKVxuICAgIGJyYWluLmFkZExpc3RlbmVyKGFzdENhbnZhcylcblxuICAgIGNvbnN0IGxlZnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHJpZ2h0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGNvbnN0IHNwbGl0ID0gJ2hlaWdodDogMTAwJTsgd2lkdGg6IDUwJTsgcG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyB0b3A6IDA7ICBwYWRkaW5nLXRvcDogMjBweDsnXG4gICAgY29uc3QgbGVmdCA9ICdsZWZ0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExOydcbiAgICBjb25zdCByaWdodCA9ICdyaWdodDogMDsgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsnXG5cbiAgICBsZWZ0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIGxlZnRcbiAgICByaWdodERpdi5zdHlsZS5jc3NUZXh0ID0gc3BsaXQgKyByaWdodCArICdvdmVyZmxvdzpzY3JvbGw7JyArICdvdmVyZmxvdy14OnNjcm9sbDsnICsgJ292ZXJmbG93LXk6c2Nyb2xsOydcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGVmdERpdilcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJpZ2h0RGl2KVxuXG4gICAgcmlnaHREaXYuYXBwZW5kQ2hpbGQoYXN0Q2FudmFzLmRpdilcblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcblxuICAgIGNvbnN0IGNvbnNvbGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS53aWR0aCA9ICc0MHZ3J1xuICAgIGNvbnNvbGVPdXRwdXQuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZChjb25zb2xlT3V0cHV0KVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGVPdXRwdXQudmFsdWUgPSByZXN1bHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgbWFpbigpXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcbi8vIGltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuICAgIH1cblxuICAgIC8vIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgXG59IiwiaW1wb3J0IHsgQXRvbUNsYXVzZSB9IGZyb20gXCIuL0F0b21DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQW4gdW5hbWJpZ3VvdXMgcHJlZGljYXRlLWxvZ2ljLWxpa2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgcHJvZ3JhbW1lcidzIGludGVudC5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG4gICAgLy8gaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQgfHVuZGVmaW5lZCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF0pOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF1cblxuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9iYWNrZW5kL0NvbnRleHRcIjtcbmltcG9ydCB7IEluc3RydWN0aW9uVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9JbnN0cnVjdGlvblRoaW5nXCI7XG5pbXBvcnQgeyBOdW1iZXJUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL051bWJlclRoaW5nXCI7XG5pbXBvcnQgeyBTdHJpbmdUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1N0cmluZ1RoaW5nXCI7XG5pbXBvcnQgeyBUaGluZywgZ2V0VGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiO1xuaW1wb3J0IHsgaXNQbHVyYWwsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSBcIi4uL3V0aWxzL3BhcnNlTnVtYmVyXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuL2lkL01hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7XG5cbiAgICBhcmdzLnNpZGVFZmZlY3RzID8/PSBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3QpXG5cbiAgICBpZiAoYXJncy5zaWRlRWZmZWN0cykgeyAvLyBvbmx5IGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIHNpZGUgZWZmZWN0c1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IG5ldyBJbnN0cnVjdGlvblRoaW5nKGFzdClcbiAgICAgICAgY29udGV4dC5zZXQoaW5zdHJ1Y3Rpb24uZ2V0SWQoKSwgaW5zdHJ1Y3Rpb24pXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyByb290OiAnaW5zdHJ1Y3Rpb24nLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW2luc3RydWN0aW9uXSB9KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0Py5saW5rcz8uY29wdWxhKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8udmVyYikge1xuICAgICAgICByZXR1cm4gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/Lm5vbnN1YmNvbmopIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZhbE5vdW5QaHJhc2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH1cblxufVxuXG5cbmZ1bmN0aW9uIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhcmdzPy5zaWRlRWZmZWN0cykgeyAvLyBhc3NpZ24gdGhlIHJpZ2h0IHZhbHVlIHRvIHRoZSBsZWZ0IHZhbHVlXG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pLnNpbXBsZVxuICAgICAgICBjb25zdCByVmFsID0gZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3M/LnByZWRpY2F0ZSEsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgICAgIGNvbnN0IG93bmVyQ2hhaW4gPSBnZXRPd25lcnNoaXBDaGFpbihzdWJqZWN0KVxuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5xdWVyeShzdWJqZWN0KVxuICAgICAgICBjb25zdCBsZXhlbWVzID0gc3ViamVjdC5mbGF0TGlzdCgpLm1hcCh4ID0+IHgucHJlZGljYXRlISkuZmlsdGVyKHggPT4geClcbiAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhSZWZlcmVudCA9IGxleGVtZXMubWFwKHggPT4gKHsgLi4ueCwgcmVmZXJlbnRzOiByVmFsIH0pKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWJqZWN0PScsIHN1YmplY3QudG9TdHJpbmcoKSwgJ3JWYWw9JywgclZhbCwgJ293bmVyQ2hhaW49Jywgb3duZXJDaGFpbiwgJ21hcHM9JywgbWFwcylcblxuICAgICAgICBpZiAoIW1hcHMubGVuZ3RoICYmIG93bmVyQ2hhaW4ubGVuZ3RoIDw9IDEpIHsgLy8gbFZhbCBpcyBjb21wbGV0ZWx5IG5ld1xuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsLmZvckVhY2goeCA9PiBjb250ZXh0LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBzLmxlbmd0aCAmJiBvd25lckNoYWluLmxlbmd0aCA8PSAxKSB7IC8vIHJlYXNzaWdubWVudFxuICAgICAgICAgICAgbGV4ZW1lcy5mb3JFYWNoKHggPT4gY29udGV4dC5yZW1vdmVMZXhlbWUoeC5yb290KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgclZhbC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3duZXJDaGFpbi5sZW5ndGggPiAxKSB7IC8vIGxWYWwgaXMgcHJvcGVydHkgb2YgZXhpc3Rpbmcgb2JqZWN0XG4gICAgICAgICAgICBjb25zdCBhYm91dE93bmVyID0gYWJvdXQoc3ViamVjdCwgb3duZXJDaGFpbi5hdCgtMikhKVxuICAgICAgICAgICAgY29uc3Qgb3duZXJzID0gZ2V0SW50ZXJlc3RpbmdJZHMoY29udGV4dC5xdWVyeShhYm91dE93bmVyKSwgYWJvdXRPd25lcikubWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSEpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IG93bmVycy5hdCgwKVxuICAgICAgICAgICAgY29uc3QgclZhbENsb25lID0gclZhbC5tYXAoeCA9PiB4LmNsb25lKHsgaWQ6IG93bmVyPy5nZXRJZCgpICsgJy4nICsgeC5nZXRJZCgpIH0pKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhDbG9uZVJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWxDbG9uZSB9KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoQ2xvbmVSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsQ2xvbmUuZm9yRWFjaCh4ID0+IG93bmVyPy5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsQ2xvbmVcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHsgLy8gY29tcGFyZSB0aGUgcmlnaHQgYW5kIGxlZnQgdmFsdWVzXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8uc3ViamVjdCEsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5wcmVkaWNhdGUhLCBhcmdzKS5hdCgwKVxuICAgICAgICByZXR1cm4gc3ViamVjdD8uZXF1YWxzKHByZWRpY2F0ZSEpICYmICghYXN0LmxpbmtzPy5uZWdhdGlvbikgPyBbbmV3IE51bWJlclRoaW5nKDEpXSA6IFtdXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ3Byb2JsZW0gd2l0aCBjb3B1bGEgc2VudGVuY2UhJylcbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gYWJvdXQoY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpIHtcbiAgICByZXR1cm4gY2xhdXNlLmZsYXRMaXN0KCkuZmlsdGVyKHggPT4geC5lbnRpdGllcy5pbmNsdWRlcyhlbnRpdHkpICYmIHguZW50aXRpZXMubGVuZ3RoIDw9IDEpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKS5zaW1wbGVcbn1cblxuZnVuY3Rpb24gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICAvLyBjb25zdCBjb21wbGVtZW50cyA9IChhc3QubGlua3MgYXMgYW55KT8uWydjb21wbGVtZW50J11cbiAgICBjb25zb2xlLmxvZyhhc3QpXG4gICAgdGhyb3cgbmV3IEVycm9yKCd2ZXJiIHNlbnRlbmNlIScpLy8gY29udGV4dC5nZXRMZXhlbWUoYXN0Py5saW5rcz8ubXZlcmI/LmxleGVtZT8ucm9vdCEpXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBpZiAoYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWU/LnJvb3QgPT09ICdpZicpIHtcblxuICAgICAgICBpZiAoZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3MuY29uZGl0aW9uISwgeyAuLi5hcmdzLCBzaWRlRWZmZWN0czogZmFsc2UgfSkubGVuZ3RoKSB7XG4gICAgICAgICAgICBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcy5jb25zZXF1ZW5jZSEsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93IG5ldyBFcnJvcignY29tcG91bmQgc2VudGVuY2UhJylcbn1cblxuZnVuY3Rpb24gZXZhbE5vdW5QaHJhc2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cblxuICAgIGlmIChhc3QubGlua3M/LnN1YmplY3Q/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxpbmtzPy5xdW90ZSkpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxTdHJpbmcoY29udGV4dCwgYXN0LmxpbmtzPy5zdWJqZWN0Py5saXN0WzBdLCBhcmdzKVxuICAgIH1cblxuICAgIGNvbnN0IG5wID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdCwgYXJncylcblxuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KG5wKSAvLyBUT0RPOiBpbnRyYS1zZW50ZW5jZSBhbmFwaG9yYSByZXNvbHV0aW9uXG5cbiAgICBjb25zdCBpbnRlcmVzdGluZ0lkcyA9IGdldEludGVyZXN0aW5nSWRzKG1hcHMsIG5wKVxuICAgIGNvbnN0IHRoaW5ncyA9IGludGVyZXN0aW5nSWRzLm1hcChpZCA9PiBjb250ZXh0LmdldChpZCkpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IHghKVxuICAgIC8vIGNvbnNvbGUubG9nKCdtYXBzPScsIG1hcHMsICdpbnRlcmVzdGluZ0lkcz0nLCBpbnRlcmVzdGluZ0lkcywgJ3RoaW5ncz0nLCB0aGluZ3MpXG5cbiAgICBpZiAoaXNBc3RQbHVyYWwoYXN0KSB8fCBnZXRBbmRQaHJhc2UoYXN0KSkgeyAvLyBpZiB1bml2ZXJzYWwgcXVhbnRpZmllZCwgSSBkb24ndCBjYXJlIGlmIHRoZXJlJ3Mgbm8gbWF0Y2hcbiAgICAgICAgcmV0dXJuIHRoaW5nc1xuICAgIH1cblxuICAgIGlmICh0aGluZ3MubGVuZ3RoKSB7IC8vIG5vbi1wbHVyYWwsIHJldHVybiBzaW5nbGUgZXhpc3RpbmcgVGhpbmdcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCAxKVxuICAgIH1cblxuICAgIC8vIG9yIGVsc2UgY3JlYXRlIGFuZCByZXR1cm5zIHRoZSBUaGluZ1xuICAgIHJldHVybiBhcmdzPy5hdXRvdml2aWZpY2F0aW9uID8gW2NyZWF0ZVRoaW5nKG5wKV0gOiBbXVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IChhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3Qgbm91bnMgPSAoYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBnZW5pdGl2ZUNvbXBsZW1lbnQgPSBPYmplY3QudmFsdWVzKGFzdD8ubGlua3MgPz8ge30pLmZpbHRlcih4ID0+IHgubGlua3M/Lm93bmVyKS5hdCgwKVxuICAgIGNvbnN0IGdlbml0aXZlQ29tcGxlbWVudENsYXVzZSA9IGdlbml0aXZlVG9DbGF1c2UoZ2VuaXRpdmVDb21wbGVtZW50LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UsIHNpZGVFZmZlY3RzOiBmYWxzZSB9KVxuXG4gICAgY29uc3QgYW5kUGhyYXNlID0gZXZhbEFuZFBocmFzZShnZXRBbmRQaHJhc2UoYXN0KSwgYXJncylcbiAgICAvL1RPRE86IHJlbGF0aXZlIGNsYXVzZXNcblxuICAgIHJldHVybiBhZGplY3RpdmVzLmFuZChub3VucykuYW5kKGdlbml0aXZlQ29tcGxlbWVudENsYXVzZSkuYW5kKGFuZFBocmFzZSlcbn1cblxuZnVuY3Rpb24gZ2V0QW5kUGhyYXNlKG5wPzogQXN0Tm9kZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAobnA/LmxpbmtzIGFzIGFueSk/LlsnYW5kLXBocmFzZSddICAvL1RPRE8hXG59XG5cbmZ1bmN0aW9uIGV2YWxBbmRQaHJhc2UoYW5kUGhyYXNlPzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cykge1xuXG4gICAgaWYgKCFhbmRQaHJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdW5QaHJhc2VUb0NsYXVzZSgoYW5kUGhyYXNlPy5saW5rcyBhcyBhbnkpPy5bJ25vdW4tcGhyYXNlJ10vKiBUT0RPISAqLywgLyogYXJncyAqLykgLy8gbWF5YmUgcHJvYmxlbSBpZiBtdWx0aXBsZSB0aGluZ3MgaGF2ZSBzYW1lIGlkLCBxdWVyeSBpcyBub3QgZ29ubmEgZmluZCB0aGVtXG59XG5cbmZ1bmN0aW9uIGdlbml0aXZlVG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBjb25zdCBvd25lZElkID0gYXJncz8uc3ViamVjdCFcbiAgICBjb25zdCBvd25lcklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgZ2VuaXRpdmVQYXJ0aWNsZSA9IGFzdD8ubGlua3M/LltcImdlbml0aXZlLXBhcnRpY2xlXCJdPy5sZXhlbWVcbiAgICBjb25zdCBvd25lciA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5vd25lciwgeyBzdWJqZWN0OiBvd25lcklkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG4gICAgcmV0dXJuIGNsYXVzZU9mKGdlbml0aXZlUGFydGljbGUhLCBvd25lZElkLCBvd25lcklkKS5hbmQob3duZXIpXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0IVxuICAgIGNvbnN0IG9iamVjdElkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBhc3Q/LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lIVxuICAgIGNvbnN0IG9iamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcbiAgICByZXR1cm4gY2xhdXNlT2YocHJlcG9zaXRpb24sIHN1YmplY3RJZCwgb2JqZWN0SWQpLmFuZChvYmplY3QpXG59XG5cbmZ1bmN0aW9uIHJlbGF0aXZlQ2xhdXNlVG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG4gICAgcmV0dXJuIGVtcHR5Q2xhdXNlIC8vVE9ETyFcbn1cblxuZnVuY3Rpb24gaXNBc3RQbHVyYWwoYXN0PzogQXN0Tm9kZSk6IGJvb2xlYW4ge1xuXG4gICAgY29uc3QgeCA9XG4gICAgICAgIGFzdD8ubGlua3M/Lm5vdW4/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZSAmJiBpc1BsdXJhbCh4LmxleGVtZSkpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lICYmIGlzUGx1cmFsKHgubGV4ZW1lKSlcbiAgICAgICAgfHwgYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lICYmIGlzUGx1cmFsKHgubGV4ZW1lKSlcbiAgICAgICAgfHwgYXN0Py5saW5rcz8udW5pcXVhbnRcblxuICAgIGlmICh4KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYXN0Py5saW5rcyA/PyB7fSkuY29uY2F0KGFzdD8ubGlzdCA/PyBbXSkuc29tZSh4ID0+IGlzQXN0UGx1cmFsKHgpKVxufVxuXG5mdW5jdGlvbiBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzOiBNYXBbXSwgY2xhdXNlOiBDbGF1c2UpOiBJZFtdIHtcblxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlIFwiY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uXCIgXG4gICAgLy8gaGFzIGJ1dHRvbklkLnN0eWxlLmNvbG9yIGFuZCB0aGF0J3MgdGhlIG9iamVjdCB0aGUgc2VudGVuY2Ugc2hvdWxkIHJlc29sdmUgdG9cbiAgICAvLyBwb3NzaWJsZSBwcm9ibGVtIGlmIFwiY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b25cIlxuICAgIC8vIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgLy8gY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgLy8gcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxuICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuXG4gICAgaWYgKG9jLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKSAvL2FsbFxuICAgIH1cblxuICAgIC8vIFRPRE86IHByb2JsZW0gbm90IHJldHVybmluZyBldmVyeXRoaW5nIGJlY2F1c2Ugb2YgZ2V0T3duZXJzaGlwQ2hhaW4oKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBvd25lZCBsZWFmXG5cbn1cblxuY29uc3QgZ2V0TnVtYmVyT2ZEb3RzID0gKGlkOiBJZCkgPT4gaWQuc3BsaXQoJy4nKS5sZW5ndGggLy8tMVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuICAgIGNvbnN0IGJhc2VzID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGU/LnJlZmVyZW50cz8uWzBdISkvKiBPTkxZIEZJUlNUPyAqLy5maWx0ZXIoeCA9PiB4KVxuICAgIGNvbnN0IGlkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgcmV0dXJuIGdldFRoaW5nKHsgaWQsIGJhc2VzIH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxTdHJpbmcoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIGNvbnN0IHggPSBPYmplY3QudmFsdWVzKHsgLi4uYXN0Py5saW5rcywgJ3F1b3RlJzogdW5kZWZpbmVkIH0pLmZpbHRlcih4ID0+IHgpLmF0KDApPy5saXN0Py5tYXAoeCA9PiB4LmxleGVtZT8udG9rZW4pID8/IFtdXG4gICAgY29uc3QgeSA9IHguam9pbignICcpXG4gICAgY29uc3QgeiA9IHBhcnNlTnVtYmVyKHkpXG5cbiAgICBpZiAoeikge1xuICAgICAgICByZXR1cm4gW25ldyBOdW1iZXJUaGluZyh6KV1cbiAgICB9XG5cbiAgICBpZiAoIXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHJldHVybiBbbmV3IFN0cmluZ1RoaW5nKHkpXVxufVxuXG5mdW5jdGlvbiBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3Q6IEFzdE5vZGUpIHsgLy8gYW55dGhpbmcgdGhhdCBpcyBub3QgYSBub3VucGhyYXNlIENPVUxEIGhhdmUgc2lkZSBlZmZlY3RzXG4gICAgcmV0dXJuICEhKGFzdC5saW5rcz8uY29wdWxhIHx8IGFzdC5saW5rcz8udmVyYiB8fCBhc3QubGlua3M/LnN1YmNvbmopXG59XG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBhdXRvdml2aWZpY2F0aW9uPzogYm9vbGVhbixcbiAgICBzaWRlRWZmZWN0cz86IGJvb2xlYW4sXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJcbi8qKlxuICogQ2hlY2tzIGlmIHN0cmluZyBoYXMgYW55IG5vbi1kaWdpdCBjaGFyIChleGNlcHQgZm9yIFwiLlwiKSBiZWZvcmVcbiAqIGNvbnZlcnRpbmcgdG8gbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOdW1iZXIoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3Qgbm9uRGlnID0gc3RyaW5nLm1hdGNoKC9cXEQvZyk/LmF0KDApXG5cbiAgICBpZiAobm9uRGlnICYmIG5vbkRpZyAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHJpbmcpXG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS4gRXF1YWxpdHkgYnkgSlNPTi5zdHJpbmdpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHNlcTogVFtdKTogVFtdIHtcbiAgICBsZXQgc2VlbiA9IHt9IGFzIGFueVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9