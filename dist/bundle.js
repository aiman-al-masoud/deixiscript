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
'pronoun', 'makro-keyword', 'except-keyword', 'then-keyword', 'quote');


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
    { root: 'optional', type: 'adjective', cardinality: '1|0', referents: [] },
    { root: 'one-or-more', type: 'adjective', cardinality: '+', referents: [] },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*', referents: [] },
    { root: 'subject', type: 'adjective', referents: [] },
    { root: 'predicate', type: 'adjective', referents: [] },
    { root: 'object', type: 'adjective', referents: [] },
    { root: 'left', type: 'adjective', referents: [] },
    { root: 'right', type: 'adjective', referents: [] },
    { root: 'condition', type: 'adjective', referents: [] },
    { root: 'consequence', type: 'adjective', referents: [] },
    { root: 'token', type: 'adjective', referents: [] },
    { root: 'or', type: 'disjunc', referents: [] },
    { root: 'and', type: 'nonsubconj', referents: [] },
    { root: 'a', type: 'indefart', referents: [] },
    { root: 'an', type: 'indefart', referents: [] },
    { root: 'the', type: 'defart', referents: [] },
    { root: 'if', type: 'subconj', referents: [] },
    { root: 'when', type: 'subconj', referents: [] },
    { root: 'every', type: 'uniquant', referents: [] },
    { root: 'any', type: 'uniquant', referents: [] },
    { root: 'of', type: 'preposition', referents: [] },
    { root: 'that', type: 'relpron', referents: [] },
    { root: 'it', type: 'pronoun', referents: [] },
    { root: '"', type: 'quote', referents: [] },
    { root: '.', type: 'fullstop', referents: [] },
    { root: 'then', type: 'then-keyword', referents: [] },
    { root: 'except', type: 'except-keyword', referents: [] },
    { root: 'makro', type: 'makro-keyword', referents: [] },
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
    and-phrase is nonsubconj then noun-phrase
  makro.

  makro 
    noun-phrase is optional quantifier 
      then optional article 
      then zero-or-more adjectives 
      then zero-or-more subject noun or pronoun or string
      then optional subclause
      then zero-or-more complements
      then optional and-phrase
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
      then then-keyword
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
        { type: ['makro-keyword'], number: 1 },
        { type: ['noun'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' },
        { type: ['makro-keyword'], number: 1 },
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
        this.div.appendChild(this.canvas);
        this.canvas.width = window.innerWidth / 2;
        this.canvas.height = window.innerHeight; /// 2
        this.context = this.canvas.getContext('2d');
    }
    onUpdate(ast, results) {
        if (!this.context) {
            throw new Error('Canvas context is undefined!');
        }
        (0, plotAst_1.plotAst)(this.context, ast);
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
    const astName = (((_c = (_a = ast.role) !== null && _a !== void 0 ? _a : (_b = ast.lexeme) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : ast.type).replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote")) + random();
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
            const ezero = e[0].replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote") + random();
            return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)];
        });
    }
    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges));
        return [...additions, ...edges, [astName, list.toString().replaceAll(',', '')]];
    }
    return [];
}
exports.astToEdgeList = astToEdgeList;
function random() {
    return parseInt(1000 * Math.random() + '');
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
    // context.font = "20px Arial";
    context.font = "10px Arial";
    const offset = 10 * node.label.length / 2; //some magic in here!
    context.fillText(node.label, node.x - offset, node.y);
}
exports.drawNode = drawNode;


/***/ }),

/***/ "./app/src/draw-ast/getPos.ts":
/*!************************************!*\
  !*** ./app/src/draw-ast/getPos.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPos = void 0;
/**
 * get root node ie: node such that it has no parents.
 * get all of its children.
 * plot them.
 * remove affected tuples.
 * repeat until there are no more tuples.
 */
function getPos(initialPos, data, dict = {}) {
    var _a;
    const root = getRoot(data);
    const children = getChildrenOf(root, data);
    const rootPos = (_a = dict[root]) !== null && _a !== void 0 ? _a : initialPos;
    const yStep = 30;
    const xStep = 30;
    const xDisplacements = children.map((_, i) => i * xStep * (i < children.length / 2 ? -1 : 1)); //+ 30*Math.random()
    const childMap = children
        .map((c, i) => ({ [c]: { x: rootPos.x + xDisplacements[i], y: rootPos.y + yStep } }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    const remainingData = data.filter(x => !x.includes(root));
    const partialResult = Object.assign(Object.assign(Object.assign({}, dict), childMap), (root ? { [root]: rootPos } : {}));
    if (remainingData.length && root !== undefined) {
        return getPos(initialPos, remainingData, partialResult);
    }
    return partialResult;
}
exports.getPos = getPos;
function getRoot(edges) {
    const nodes = edges.flat();
    return nodes.filter(x => !edges.some(t => t[1] === x))[0];
}
function getChildrenOf(parent, edges) {
    return edges.filter(x => x[0] === parent).map(x => x[1]);
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
const getPos_1 = __webpack_require__(/*! ./getPos */ "./app/src/draw-ast/getPos.ts");
function plotAst(context, ast) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const rect = context.canvas.getBoundingClientRect();
    const edges = (0, astToEdgeList_1.astToEdgeList)(ast);
    const positions = (0, getPos_1.getPos)({ x: rect.x - rect.width / 2, y: rect.y }, edges);
    Object.entries(positions).forEach(e => {
        const name = e[0];
        const pos = e[1];
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
        const from = positions[e[0]];
        const to = positions[e[1]];
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
            const results = (0, evalAst_1.evalAst)(this.context, ast);
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
        // if (ownerChain.length > 1) { // lVal is property of existing object
        //     const aboutOwner = about(subject, ownerChain.at(-2)!)
        //     const owners = getInterestingIds(context.query(aboutOwner), aboutOwner).map(id => context.get(id)!).filter(x => x)
        //     lexemesWithReferent.forEach(x => owners.at(0)?.setLexeme(x))
        //     const owner = owners.at(0)
        //     rVal.forEach(x => owner?.set(x.getId(), x))
        //     return rVal
        // }
    }
    else { // compare the right and left values
        // console.log('must check condition!')
        const subject = evalAst(context, (_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject, args).at(0);
        const predicate = evalAst(context, (_e = ast.links) === null || _e === void 0 ? void 0 : _e.predicate, args).at(0);
        // console.log(subject, predicate)
        const areEqual = (subject === null || subject === void 0 ? void 0 : subject.toJs()) === (predicate === null || predicate === void 0 ? void 0 : predicate.toJs());
        return areEqual && (!((_f = ast.links) === null || _f === void 0 ? void 0 : _f.negation)) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.log('problem with copula sentence!');
    return [];
    // throw new Error('copula sentence!')
    // const subjectId = args?.subject ?? getIncrementalId()
    // const maybeSubject = evalAst(context, ast?.links?.subject!)
    // const subject = nounPhraseToClause(ast?.links?.subject)
    // const predicate = evalAst(context, ast?.links?.predicate!, { subject: subjectId, autovivification: true, sideEffects: false })
    // if (maybeSubject.length) {
    //     return maybeSubject // TODO
    // }
    // const newThing = predicate[0]
    // const lexemes: Lexeme[] = subject.flatList().filter(x => x.predicate).map(x => x.predicate!).map(x => ({ ...x, referents: [newThing] }))
    // context.set(newThing.getId(), newThing)
    // lexemes.forEach(x => context.setLexeme(x))
    // return [newThing]
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
// function getProximalOwner(context:Context, clause:Clause, ownerChain:Id[]){
//     const aboutOwner = about(clause, ownerChain[0])
//     const maps = context.query(aboutOwner)
//     // console.log('ownerMaps=', maps)
// }
function evalVerbSentence(context, ast, args) {
    throw new Error('verb sentence!'); // context.getLexeme(ast?.links?.mverb?.lexeme?.root!)
}
function evalComplexSentence(context, ast, args) {
    // throw new Error('complex sentence!')
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
    // console.log(np.toString(), 'maps=', maps, 'interestingIds=', interestingIds)
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
    const complements = Object.values((_h = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _h !== void 0 ? _h : {}).filter(x => x.list).flatMap(x => x.list).filter(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.preposition; }).map(x => complementToClause(x, { subject: subjectId, autovivification: false, sideEffects: false })).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const andPhrase = evalAndPhrase(getAndPhrase(ast), args);
    //TODO: relative clauses
    return adjectives.and(nouns).and(complements).and(andPhrase);
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
    // .at(-1)
    return maps.flatMap(m => m[oc.at(-1)]); // 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVMsRUFBRSxFQUFFLEVBQUU7SUFFbkQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMvQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNsRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFOUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFF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QTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9JbnN0cnVjdGlvblRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9OdW1iZXJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvU3RyaW5nVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L0FzdENhbnZhcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2FzdFRvRWRnZUxpc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9kcmF3TGluZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2RyYXdOb2RlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZ2V0UG9zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvcGxvdEFzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3BhcnNlTnVtYmVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsImltcG9ydCB7IGV4dHJhcG9sYXRlLCBMZXhlbWUgfSBmcm9tICcuLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnLi4vdXRpbHMvdW5pcSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICAgICBwcm90ZWN0ZWQgbGV4ZW1lczogTGV4ZW1lW10gPSBbXSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGdldElkKCk6IElkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBUaGluZyB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKFxuICAgICAgICAgICAgdGhpcy5pZCwgLy8gY2xvbmVzIGhhdmUgc2FtZSBpZFxuICAgICAgICAgICAgdGhpcy5iYXNlcy5tYXAoeCA9PiB4LmNsb25lKCkpLFxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jaGlsZHJlbikubWFwKGUgPT4gKHsgW2VbMF1dOiBlWzFdLmNsb25lKCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSksXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHRlbmRzID0gKHRoaW5nOiBUaGluZykgPT4ge1xuICAgICAgICB0aGlzLnVuZXh0ZW5kcyh0aGluZykgLy8gb3IgYXZvaWQ/XG4gICAgICAgIHRoaXMuYmFzZXMucHVzaCh0aGluZy5jbG9uZSgpKVxuICAgIH1cblxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNlcyA9IHRoaXMuYmFzZXMuZmlsdGVyKHggPT4geC5nZXRJZCgpICE9PSB0aGluZy5nZXRJZCgpKVxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltwMV1cbiAgICAgICAgY29uc3QgcmVzID0gcGFydHMubGVuZ3RoID4gMSA/IGNoaWxkLmdldChwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykpIDogY2hpbGRcbiAgICAgICAgcmV0dXJuIHJlcyA/PyB0aGlzLmJhc2VzLmZpbmQoeCA9PiB4LmdldChpZCkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baWRdID0gdGhpbmdcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSAvLyBldmVyeSB0aGluZyBpcyBhIHRoaW5nXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcyAvL1RPRE9vb29vb29vb09PIVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMudG9DbGF1c2UocXVlcnkpLnF1ZXJ5KHF1ZXJ5LCB7LyogaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgICovIH0pKVxuICAgIH1cblxuICAgIHRvQ2xhdXNlID0gKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlID0+IHtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IHgucmVmZXJlbnRzLm1hcChyID0+IGNsYXVzZU9mKHgsIHIuZ2V0SWQoKSkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHkgPSBPYmplY3RcbiAgICAgICAgICAgIC5rZXlzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeyByb290OiAnb2YnLCB0eXBlOiAncHJlcG9zaXRpb24nLCByZWZlcmVudHM6IFtdIH0sIHgsIHRoaXMuaWQpKSAvLyBoYXJkY29kZWQgZW5nbGlzaCFcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCB6ID0gT2JqZWN0XG4gICAgICAgICAgICAudmFsdWVzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4geC50b0NsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHguYW5kKHkpLmFuZCh6KS5zaW1wbGVcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4geC5yb290ID09PSBsZXhlbWUucm9vdClcbiAgICAgICAgY29uc3QgdXBkYXRlZDogTGV4ZW1lW10gPSBvbGQubWFwKHggPT4gKHsgLi4ueCwgLi4ubGV4ZW1lLCByZWZlcmVudHM6IFsuLi54LnJlZmVyZW50cywgLi4ubGV4ZW1lLnJlZmVyZW50c10gfSkpXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB0b0JlQWRkZWQgPSB1cGRhdGVkLmxlbmd0aCA/IHVwZGF0ZWQgOiBbbGV4ZW1lXVxuICAgICAgICB0aGlzLmxleGVtZXMucHVzaCguLi50b0JlQWRkZWQpXG4gICAgICAgIGNvbnN0IGV4dHJhcG9sYXRlZCA9IHRvQmVBZGRlZC5mbGF0TWFwKHggPT4gZXh0cmFwb2xhdGUoeCwgdGhpcykpXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLmV4dHJhcG9sYXRlZClcblxuICAgIH1cblxuICAgIGdldExleGVtZSA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgICAgICAgICAuYXQoMClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZXh0cmFwb2xhdGUsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29udGV4dCBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSBjb25maWcuc3ludGF4ZXMsXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IGNvbmZpZy5sZXhlbWVzLmZsYXRNYXAobCA9PiBbbCwgLi4uZXh0cmFwb2xhdGUobCldKSxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICkge1xuICAgICAgICBzdXBlcihpZCwgYmFzZXMsIGNoaWxkcmVuLCBsZXhlbWVzKVxuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHsgLy9UT0RPIVxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRzOiBbXSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgfVxuXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWZyZXNoU3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TGlzdFxuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQXN0Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ25vdW4nLCByb290OiBzeW50YXgubmFtZSwgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdCA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGNsb25lKCk6IENvbnRleHQge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgICAgICB0aGlzLnN5bnRheE1hcCxcbiAgICAgICAgICAgIHRoaXMubGV4ZW1lcyxcbiAgICAgICAgICAgIHRoaXMuYmFzZXMsXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLCAvL3NoYWxsb3cgb3IgZGVlcD9cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IEJhc2ljQ29udGV4dCB9IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBUaGluZyB7XG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW11cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW11cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZ1xuICAgIGNsb25lKCk6IENvbnRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQob3B0czogeyBpZDogSWQgfSk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KG9wdHMuaWQpXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvblRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBBc3ROb2RlKSB7XG4gICAgICAgIHN1cGVyKGdldEluY3JlbWVudGFsSWQoKSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHZhbHVlICsgJycpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSBhcyBhbnlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcih2YWx1ZSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlIGFzIGFueSAvL2pzIHN1Y2tzXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGhpbmcge1xuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIHRoaW5nOiBUaGluZyk6IHZvaWQgLy90aGluZy5pZD8/P1xuICAgIGNsb25lKCk6IFRoaW5nXG4gICAgdG9KcygpOiBvYmplY3RcbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIGV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZFxuICAgIGdldElkKCk6IElkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyYiBleHRlbmRzIFRoaW5nIHtcbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBbcm9sZSBpbiBWZXJiQXJnc106IFRoaW5nIH0pOiBUaGluZ1tdIC8vIGNhbGxlZCBkaXJlY3RseSBpbiBldmFsVmVyYlNlbnRlbmNlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoaW5nKGFyZ3M6IHsgaWQ6IElkLCBiYXNlczogVGhpbmdbXSB9KSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoYXJncy5pZCwgYXJncy5iYXNlcylcbn1cblxudHlwZSBWZXJiQXJncyA9ICdzdWJqZWN0J1xuICAgIHwgJ2RpcmVjdE9iamVjdCdcbiAgICB8ICdpbmRpcmVjdE9iamVjdCdcbiAgICAvLyAuLi5cbiIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4vcHJlbHVkZVwiXG5pbXBvcnQgeyBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIC8vIHRoaW5ncyxcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICd2ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bicsXG4gICdtYWtyby1rZXl3b3JkJyxcbiAgJ2V4Y2VwdC1rZXl3b3JkJyxcbiAgJ3RoZW4ta2V5d29yZCcsXG4gICdxdW90ZScsXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtcblxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSwgLy9UT0RPISAyK1xuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgdG9rZW46ICdkb2VzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdoYXZlJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtdIH0sLy90ZXN0XG5cbiAgICB7IHJvb3Q6ICdub3QnLCB0eXBlOiAnbmVnYXRpb24nLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3B0aW9uYWwnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcxfDAnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb25lLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcrJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3plcm8tb3ItbW9yZScsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICdzdWJqZWN0JywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdwcmVkaWNhdGUnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29iamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnbGVmdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncmlnaHQnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3Rva2VuJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ29yJywgdHlwZTogJ2Rpc2p1bmMnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW5kJywgdHlwZTogJ25vbnN1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYScsIHR5cGU6ICdpbmRlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbicsIHR5cGU6ICdpbmRlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0aGUnLCB0eXBlOiAnZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2lmJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnd2hlbicsIHR5cGU6ICdzdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V2ZXJ5JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FueScsIHR5cGU6ICd1bmlxdWFudCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0aGF0JywgdHlwZTogJ3JlbHByb24nLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaXQnLCB0eXBlOiAncHJvbm91bicsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ1wiJywgdHlwZTogJ3F1b3RlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJy4nLCB0eXBlOiAnZnVsbHN0b3AnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICd0aGVuJywgdHlwZTogJ3RoZW4ta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdleGNlcHQnLCB0eXBlOiAnZXhjZXB0LWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnbWFrcm8nLCB0eXBlOiAnbWFrcm8ta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuXVxuXG4iLCJleHBvcnQgY29uc3QgcHJlbHVkZTogc3RyaW5nID1cblxuICBgXG4gIG1ha3JvIFxuICAgIGFueS1sZXhlbWUgaXMgYWRqZWN0aXZlIFxuICAgICAgICAgICAgb3IgY29wdWxhIFxuICAgICAgICAgICAgb3IgZGVmYXJ0IFxuICAgICAgICAgICAgb3IgaW5kZWZhcnQgXG4gICAgICAgICAgICBvciBmdWxsc3RvcCBcbiAgICAgICAgICAgIG9yIGh2ZXJiIFxuICAgICAgICAgICAgb3IgdmVyYiBcbiAgICAgICAgICAgIG9yIG5lZ2F0aW9uIFxuICAgICAgICAgICAgb3IgZXhpc3RxdWFudCBcbiAgICAgICAgICAgIG9yIHVuaXF1YW50IFxuICAgICAgICAgICAgb3IgcmVscHJvbiBcbiAgICAgICAgICAgIG9yIG5lZ2F0aW9uIFxuICAgICAgICAgICAgb3Igbm91biBcbiAgICAgICAgICAgIG9yIHByZXBvc2l0aW9uIFxuICAgICAgICAgICAgb3Igc3ViY29uaiBcbiAgICAgICAgICAgIG9yIG5vbnN1YmNvbmogXG4gICAgICAgICAgICBvciBkaXNqdW5jIFxuICAgICAgICAgICAgb3IgcHJvbm91biBcbiAgICAgICAgICAgIG9yIHRoZW4ta2V5d29yZFxuICAgICAgICAgICAgb3IgbWFrcm8ta2V5d29yZCBcbiAgICAgICAgICAgIG9yIGV4Y2VwdC1rZXl3b3JkIFxuICAgICAgICAgICAgb3IgcXVvdGVcbiAgbWFrcm8uXG4gIFxuICBtYWtybyBcbiAgICBxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIGFydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0IFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjb21wbGVtZW50IGlzIHByZXBvc2l0aW9uIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBtYWtyby5cblxuICBtYWtyb1xuICAgIGFuZC1waHJhc2UgaXMgbm9uc3ViY29uaiB0aGVuIG5vdW4tcGhyYXNlXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICB0aGVuIHplcm8tb3ItbW9yZSBhZGplY3RpdmVzIFxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3Igc3RyaW5nXG4gICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZVxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHNcbiAgICAgIHRoZW4gb3B0aW9uYWwgYW5kLXBocmFzZVxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZSBcbiAgbWFrcm8uXG5cbiAgbWFrcm8gXG4gICAgbXZlcmJzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIHZlcmIgdGhlbiBvYmplY3Qgbm91bi1waHJhc2UgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIHN1YmNsYXVzZSBpcyBjb3B1bGFzdWJjbGF1c2Ugb3IgbXZlcmJzdWJjbGF1c2UgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIGFuZC1zZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZSBcbiAgICAgIHRoZW4gbm9uc3ViY29uaiBcbiAgICAgIHRoZW4gb25lLW9yLW1vcmUgcmlnaHQgYW5kLXNlbnRlbmNlIG9yIGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZVxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICB2ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICB0aGVuIG9wdGlvbmFsIGh2ZXJiIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICB0aGVuIHZlcmIgdGhlbiBvcHRpb25hbCBvYmplY3Qgbm91bi1waHJhc2UgXG4gIG1ha3JvLlxuXG4gIG1ha3JvIFxuICAgIHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgdmVyYi1zZW50ZW5jZSBcbiAgbWFrcm8uXG5cbiAgbWFrcm8gXG4gICAgY3MxIGlzIHN1YmNvbmogXG4gICAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgICB0aGVuIHRoZW4ta2V5d29yZFxuICAgICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VcbiAgbWFrcm8uXG5cbiAgbWFrcm8gXG4gICAgY3MyIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZSBcbiAgICAgIHRoZW4gc3ViY29uaiBcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZVxuICBtYWtyby5cblxuICBtYWtybyBcbiAgICBzdHJpbmcgaXMgcXVvdGUgdGhlbiBvbmUtb3ItbW9yZSB0b2tlbiBhbnktbGV4ZW1lIGV4Y2VwdCBxdW90ZSB0aGVuIHF1b3RlIFxuICBtYWtyby5cblxuICBgXG4iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAnZXhjZXB0dW5pb24nLFxuKVxuXG5leHBvcnQgY29uc3Qgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSA9IFsnbWFjcm8nXVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ21ha3JvLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VuJ10sIG51bWJlcjogMSwgcm9sZTogJ3N1YmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21ha3JvLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZXhjZXB0dW5pb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdleGNlcHR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICBdXG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpbkxpc3RlbmVyXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBsb3RBc3QgfSBmcm9tIFwiLi9wbG90QXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBBc3RDYW52YXMgaW1wbGVtZW50cyBCcmFpbkxpc3RlbmVyIHtcblxuICAgIHJlYWRvbmx5IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcHJvdGVjdGVkIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRpdi5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcylcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC8vLyAyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICB9XG5cbiAgICBvblVwZGF0ZShhc3Q6IEFzdE5vZGUsIHJlc3VsdHM6IFRoaW5nW10pOiB2b2lkIHtcblxuICAgICAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgY29udGV4dCBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgfVxuXG4gICAgICAgIHBsb3RBc3QodGhpcy5jb250ZXh0LCBhc3QpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3RUb0VkZ2VMaXN0KFxuICAgIGFzdDogQXN0Tm9kZSxcbiAgICBwYXJlbnROYW1lPzogc3RyaW5nLFxuICAgIGVkZ2VzOiBFZGdlTGlzdCA9IFtdLFxuKTogRWRnZUxpc3Qge1xuXG4gICAgY29uc3QgYXN0TmFtZSA9ICgoYXN0LnJvbGUgPz8gYXN0LmxleGVtZT8ucm9vdCA/PyBhc3QudHlwZSkucmVwbGFjZUFsbCgnLScsICdfJykucmVwbGFjZUFsbCgnOicsICdfYWthXycpLnJlcGxhY2VBbGwoJ1wiJywgXCJxdW90ZVwiKSkgKyByYW5kb20oKVxuXG4gICAgY29uc3QgYWRkaXRpb25zOiBFZGdlTGlzdCA9IFtdXG5cbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgICBhZGRpdGlvbnMucHVzaChbcGFyZW50TmFtZSwgYXN0TmFtZV0pXG4gICAgfVxuXG4gICAgaWYgKCFhc3QubGlua3MgJiYgIWFzdC5saXN0KSB7IC8vIGxlYWYhXG4gICAgICAgIHJldHVybiBbLi4uZWRnZXMsIC4uLmFkZGl0aW9uc11cbiAgICB9XG5cbiAgICBpZiAoYXN0LmxpbmtzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5mbGF0TWFwKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV6ZXJvID0gZVswXS5yZXBsYWNlQWxsKCctJywgJ18nKS5yZXBsYWNlQWxsKCc6JywgJ19ha2FfJykucmVwbGFjZUFsbCgnXCInLCBcInF1b3RlXCIpICsgcmFuZG9tKClcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFkZGl0aW9ucywgW2FzdE5hbWUsIGV6ZXJvXSwgLi4uYXN0VG9FZGdlTGlzdChlWzFdLCBlemVybywgZWRnZXMpXVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGFzdC5saXN0LmZsYXRNYXAoeCA9PiBhc3RUb0VkZ2VMaXN0KHgsIGFzdE5hbWUsIGVkZ2VzKSlcbiAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIC4uLmVkZ2VzLCBbYXN0TmFtZSwgbGlzdC50b1N0cmluZygpLnJlcGxhY2VBbGwoJywnLCAnJyldXVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiByYW5kb20oKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KDEwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpXG59IiwiaW1wb3J0IHsgR3JhcGhOb2RlIH0gZnJvbSBcIi4vTm9kZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3TGluZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZyb206IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gZnJvbU5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0Lm1vdmVUbyhmcm9tLngsIGZyb20ueSlcbiAgICBjb250ZXh0LmxpbmVUbyh0by54LCB0by55KVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdOb2RlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbm9kZTogR3JhcGhOb2RlKSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gbm9kZS5maWxsU3R5bGVcbiAgICBjb250ZXh0LmFyYyhub2RlLngsIG5vZGUueSwgbm9kZS5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBub2RlLnN0cm9rZVN0eWxlXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbiAgICBjb250ZXh0LmZpbGwoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjRkYwMDAwXCJcbiAgICAvLyBjb250ZXh0LmZvbnQgPSBcIjIwcHggQXJpYWxcIjtcbiAgICBjb250ZXh0LmZvbnQgPSBcIjEwcHggQXJpYWxcIjtcblxuICAgIGNvbnN0IG9mZnNldCA9IDEwICogbm9kZS5sYWJlbC5sZW5ndGggLyAyIC8vc29tZSBtYWdpYyBpbiBoZXJlIVxuICAgIGNvbnRleHQuZmlsbFRleHQobm9kZS5sYWJlbCwgbm9kZS54IC0gb2Zmc2V0LCBub2RlLnkpXG59XG4iLCIvKipcbiAqIGdldCByb290IG5vZGUgaWU6IG5vZGUgc3VjaCB0aGF0IGl0IGhhcyBubyBwYXJlbnRzLlxuICogZ2V0IGFsbCBvZiBpdHMgY2hpbGRyZW4uXG4gKiBwbG90IHRoZW0uXG4gKiByZW1vdmUgYWZmZWN0ZWQgdHVwbGVzLlxuICogcmVwZWF0IHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIHR1cGxlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvcyhpbml0aWFsUG9zOiBDb29yZGluYXRlLCBkYXRhOiBFZGdlTGlzdCwgZGljdDogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9ID0ge30pOiB7IFt4OiBzdHJpbmddOiBDb29yZGluYXRlIH0ge1xuXG4gICAgY29uc3Qgcm9vdCA9IGdldFJvb3QoZGF0YSlcbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuT2Yocm9vdCwgZGF0YSlcbiAgICBjb25zdCByb290UG9zID0gZGljdFtyb290XSA/PyBpbml0aWFsUG9zXG5cbiAgICBjb25zdCB5U3RlcCA9IDMwXG4gICAgY29uc3QgeFN0ZXAgPSAzMFxuXG4gICAgY29uc3QgeERpc3BsYWNlbWVudHMgPSBjaGlsZHJlbi5tYXAoKF8sIGkpID0+IGkgKiB4U3RlcCAqIChpIDwgY2hpbGRyZW4ubGVuZ3RoIC8gMiA/IC0xIDogMSkpIC8vKyAzMCpNYXRoLnJhbmRvbSgpXG5cbiAgICBjb25zdCBjaGlsZE1hcCA9IGNoaWxkcmVuXG4gICAgICAgIC5tYXAoKGMsIGkpID0+ICh7IFtjXTogeyB4OiByb290UG9zLnggKyB4RGlzcGxhY2VtZW50c1tpXSwgeTogcm9vdFBvcy55ICsgeVN0ZXAgfSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCByZW1haW5pbmdEYXRhID0gZGF0YS5maWx0ZXIoeCA9PiAheC5pbmNsdWRlcyhyb290KSlcbiAgICBjb25zdCBwYXJ0aWFsUmVzdWx0ID0geyAuLi5kaWN0LCAuLi5jaGlsZE1hcCwgLi4uKHJvb3QgPyB7IFtyb290XTogcm9vdFBvcyB9IDoge30pIH1cblxuICAgIGlmIChyZW1haW5pbmdEYXRhLmxlbmd0aCAmJiByb290ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGdldFBvcyhpbml0aWFsUG9zLCByZW1haW5pbmdEYXRhLCBwYXJ0aWFsUmVzdWx0KVxuICAgIH1cblxuICAgIHJldHVybiBwYXJ0aWFsUmVzdWx0XG59XG5cblxuZnVuY3Rpb24gZ2V0Um9vdChlZGdlczogRWRnZUxpc3QpIHtcbiAgICBjb25zdCBub2RlcyA9IGVkZ2VzLmZsYXQoKVxuICAgIHJldHVybiBub2Rlcy5maWx0ZXIoeCA9PiAhZWRnZXMuc29tZSh0ID0+IHRbMV0gPT09IHgpKVswXVxufVxuXG5mdW5jdGlvbiBnZXRDaGlsZHJlbk9mKHBhcmVudDogc3RyaW5nLCBlZGdlczogRWRnZUxpc3QpIHtcbiAgICByZXR1cm4gZWRnZXMuZmlsdGVyKHggPT4geFswXSA9PT0gcGFyZW50KS5tYXAoeCA9PiB4WzFdKVxufVxuXG5cbiIsImltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBhc3RUb0VkZ2VMaXN0IH0gZnJvbSBcIi4vYXN0VG9FZGdlTGlzdFwiXG5pbXBvcnQgeyBkcmF3TGluZSB9IGZyb20gXCIuL2RyYXdMaW5lXCJcbmltcG9ydCB7IGRyYXdOb2RlIH0gZnJvbSBcIi4vZHJhd05vZGVcIlxuaW1wb3J0IHsgZ2V0UG9zIH0gZnJvbSBcIi4vZ2V0UG9zXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHBsb3RBc3QoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBhc3Q6IEFzdE5vZGUpIHtcblxuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpXG5cbiAgICBjb25zdCByZWN0ID0gY29udGV4dC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGNvbnN0IGVkZ2VzID0gYXN0VG9FZGdlTGlzdChhc3QpXG4gICAgY29uc3QgcG9zaXRpb25zID0gZ2V0UG9zKHsgeDogcmVjdC54IC0gcmVjdC53aWR0aCAvIDIsIHk6IHJlY3QueSB9LCBlZGdlcylcblxuICAgIE9iamVjdC5lbnRyaWVzKHBvc2l0aW9ucykuZm9yRWFjaChlID0+IHtcblxuICAgICAgICBjb25zdCBuYW1lID0gZVswXVxuICAgICAgICBjb25zdCBwb3MgPSBlWzFdXG5cbiAgICAgICAgZHJhd05vZGUoY29udGV4dCwge1xuICAgICAgICAgICAgeDogcG9zLngsXG4gICAgICAgICAgICB5OiBwb3MueSxcbiAgICAgICAgICAgIHJhZGl1czogMiwgLy8xMFxuICAgICAgICAgICAgZmlsbFN0eWxlOiAnIzIyY2NjYycsXG4gICAgICAgICAgICBzdHJva2VTdHlsZTogJyMwMDk5OTknLFxuICAgICAgICAgICAgbGFiZWw6IG5hbWUucmVwbGFjZUFsbCgvXFxkKy9nLCAnJylcbiAgICAgICAgfSlcblxuICAgIH0pXG5cbiAgICBlZGdlcy5mb3JFYWNoKGUgPT4ge1xuXG4gICAgICAgIGNvbnN0IGZyb20gPSBwb3NpdGlvbnNbZVswXV1cbiAgICAgICAgY29uc3QgdG8gPSBwb3NpdGlvbnNbZVsxXV1cblxuICAgICAgICBpZiAoZnJvbSAmJiB0bykge1xuICAgICAgICAgICAgZHJhd0xpbmUoY29udGV4dCwgZnJvbSwgdG8pXG4gICAgICAgIH1cblxuICAgIH0pXG59XG4iLCJpbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSBcIi4uL2JhY2tlbmQvQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuaW1wb3J0IHsgZXZhbEFzdCB9IGZyb20gXCIuLi9taWRkbGUvZXZhbEFzdFwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4vQnJhaW5MaXN0ZW5lclwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICByZWFkb25seSBjb250ZXh0ID0gZ2V0Q29udGV4dCh7IGlkOiAnZ2xvYmFsJyB9KVxuICAgIHByb3RlY3RlZCBsaXN0ZW5lcnM6IEJyYWluTGlzdGVuZXJbXSA9IFtdXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlKHRoaXMuY29udGV4dC5nZXRQcmVsdWRlKCkpXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbnRleHQpLnBhcnNlQWxsKCkuZmxhdE1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QpXG5cbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgbC5vblVwZGF0ZShhc3QsIHJlc3VsdHMpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogb2JqZWN0W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHgudG9KcygpKVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaW5jbHVkZXMobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCJcblxuLyoqXG4gKiBBIGZhY2FkZSB0byB0aGUgRGVpeGlzY3JpcHQgaW50ZXJwcmV0ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBvYmplY3RbXVxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCB0b2tlbnM6IExleGVtZVtdID0gW11cbiAgICBwcm90ZWN0ZWQgd29yZHM6IHN0cmluZ1tdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIHRoaXMud29yZHMgPVxuICAgICAgICAgICAgc3BhY2VPdXQoc291cmNlQ29kZSwgWydcIicsICcuJ10pXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICB9XG5cbiAgICByZWZyZXNoVG9rZW5zKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMud29yZHMubWFwKHcgPT4gdGhpcy5jb250ZXh0LmdldExleGVtZSh3KSA/PyBtYWtlTGV4ZW1lKHsgcm9vdDogdywgdG9rZW46IHcsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbnMoKVxuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gc3BhY2VPdXQoc291cmNlQ29kZTogc3RyaW5nLCBzcGVjaWFsQ2hhcnM6IHN0cmluZ1tdKSB7XG5cbiAgICByZXR1cm4gc291cmNlQ29kZVxuICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+IGEgKyAoc3BlY2lhbENoYXJzLmluY2x1ZGVzKGMpID8gJyAnICsgYyArICcgJyA6IGMpLCAnJylcblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBwbHVyYWxpemUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcGx1cmFsaXplXCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9jb25qdWdhdGVcIlxuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9UaGluZ1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIHJlYWRvbmx5IHJvb3Q6IHN0cmluZ1xuICAgIHJlYWRvbmx5IHR5cGU6IExleGVtZVR5cGVcbiAgICByZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIHJlYWRvbmx5IGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICByZWZlcmVudHM6IFRoaW5nW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMZXhlbWUoZGF0YTogTGV4ZW1lKTogTGV4ZW1lIHtcbiAgICByZXR1cm4gZGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbHVyYWwobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICByZXR1cm4gaXNSZXBlYXRhYmxlKGxleGVtZS5jYXJkaW5hbGl0eSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhcG9sYXRlKGxleGVtZTogTGV4ZW1lLCBjb250ZXh0PzogVGhpbmcpOiBMZXhlbWVbXSB7XG5cbiAgICBpZiAobGV4ZW1lLnR5cGUgPT09ICdub3VuJyAmJiAhaXNQbHVyYWwobGV4ZW1lKSkge1xuICAgICAgICByZXR1cm4gW21ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbGV4ZW1lLnJvb3QsXG4gICAgICAgICAgICB0eXBlOiBsZXhlbWUudHlwZSxcbiAgICAgICAgICAgIHRva2VuOiBwbHVyYWxpemUobGV4ZW1lLnJvb3QpLFxuICAgICAgICAgICAgY2FyZGluYWxpdHk6ICcqJyxcbiAgICAgICAgICAgIHJlZmVyZW50czogbGV4ZW1lLnJlZmVyZW50c1xuICAgICAgICB9KV1cbiAgICB9XG5cbiAgICBpZiAobGV4ZW1lLnR5cGUgPT09ICd2ZXJiJykge1xuICAgICAgICByZXR1cm4gY29uanVnYXRlKGxleGVtZS5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogeCxcbiAgICAgICAgICAgIHJlZmVyZW50czogbGV4ZW1lLnJlZmVyZW50c1xuICAgICAgICB9KSlcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29udGV4dCkpIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb250ZXh0LmdldFN5bnRheExpc3QoKSlcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzaW1wbGVBc3QgPSB0aGlzLnNpbXBsaWZ5KGFzdClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChzaW1wbGVBc3QpXG5cbiAgICAgICAgICAgIGlmIChzaW1wbGVBc3QudHlwZSA9PT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zZXRTeW50YXgoYXN0KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSwgZXhjZXB0VHlwZXM/OiBBc3RUeXBlW10pIHsgLy9wcm9ibGVtYXRpY1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmtub3duUGFyc2UodCwgcm9sZSlcblxuICAgICAgICAgICAgaWYgKHggJiYgIWV4Y2VwdFR5cGVzPy5pbmNsdWRlcyh4LnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlLCBtLmV4Y2VwdFR5cGUpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiBsaXN0WzBdLnR5cGUsXG4gICAgICAgICAgICBsaXN0OiBsaXN0XG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzTGVhZiA9ICh0OiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZ2V0TGV4ZW1lVHlwZXMoKS5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICghYXN0LmxpbmtzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KGFzdC50eXBlKVxuXG4gICAgICAgIGlmIChzeW50YXgubGVuZ3RoID09PSAxICYmIE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKVswXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpbXBsZUxpbmtzID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyhhc3QubGlua3MpXG4gICAgICAgICAgICAubWFwKGwgPT4gKHsgW2xbMF1dOiB0aGlzLnNpbXBsaWZ5KGxbMV0pIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4geyAuLi5hc3QsIGxpbmtzOiBzaW1wbGVMaW5rcyB9XG5cbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9iYWNrZW5kL0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/Lm5vdW4pXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgY29uc3QgZXhjZXB0VW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy5leGNlcHR1bmlvbj8ubGlua3M/LnRhZ2dlZHVuaW9uPy5saXN0ID8/IFtdXG4gICAgY29uc3Qgbm90R3JhbW1hcnMgPSBleGNlcHRVbmlvbnMubWFwKHggPT4geC5saW5rcz8ubm91bilcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5LFxuICAgICAgICBleGNlcHRUeXBlOiBub3RHcmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCB7IEFzdENhbnZhcyB9IGZyb20gXCIuLi9kcmF3LWFzdC9Bc3RDYW52YXNcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKTtcbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBicmFpblxuXG4gICAgY29uc3QgYXN0Q2FudmFzID0gbmV3IEFzdENhbnZhcygpXG4gICAgYnJhaW4uYWRkTGlzdGVuZXIoYXN0Q2FudmFzKVxuXG4gICAgY29uc3QgbGVmdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcmlnaHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgY29uc3Qgc3BsaXQgPSAnaGVpZ2h0OiAxMDAlOyB3aWR0aDogNTAlOyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDE7IHRvcDogMDsgIHBhZGRpbmctdG9wOiAyMHB4OydcbiAgICBjb25zdCBsZWZ0ID0gJ2xlZnQ6IDA7IGJhY2tncm91bmQtY29sb3I6ICMxMTE7J1xuICAgIGNvbnN0IHJpZ2h0ID0gJ3JpZ2h0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOydcblxuICAgIGxlZnREaXYuc3R5bGUuY3NzVGV4dCA9IHNwbGl0ICsgbGVmdFxuICAgIHJpZ2h0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIHJpZ2h0ICsgJ292ZXJmbG93OnNjcm9sbDsnICsgJ292ZXJmbG93LXg6c2Nyb2xsOycgKyAnb3ZlcmZsb3cteTpzY3JvbGw7J1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsZWZ0RGl2KVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmlnaHREaXYpXG5cbiAgICByaWdodERpdi5hcHBlbmRDaGlsZChhc3RDYW52YXMuZGl2KVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNDB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuXG4gICAgY29uc3QgY29uc29sZU91dHB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICBjb25zb2xlT3V0cHV0LnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKGNvbnNvbGVPdXRwdXQpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGVPdXRwdXQudmFsdWUgPSByZXN1bHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgbWFpbigpXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgc29sdmVNYXBzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3NvbHZlTWFwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEF0b21DbGF1c2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZWRpY2F0ZS5yb290ICE9PSBxdWVyeS5wcmVkaWNhdGUucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXAgPSBxdWVyeS5hcmdzXG4gICAgICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQXRvbUNsYXVzZSB9IGZyb20gXCIuL0F0b21DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQW4gdW5hbWJpZ3VvdXMgcHJlZGljYXRlLWxvZ2ljLWxpa2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgcHJvZ3JhbW1lcidzIGludGVudC5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW11cblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXMuY29uZGl0aW9uXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzLmNvbnNlcXVlbmNlXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCkgKyB0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25zZXF1ZW5jZTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IHN1Ympjb25qPzogTGV4ZW1lLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBJbXBseShcbiAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY29uc2VxdWVuY2UuY29weShvcHRzKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgb3B0cz8uc3ViamNvbmogPz8gdGhpcy5zdWJqY29uaixcbiAgICApXG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5zdWJqY29uaj8ucm9vdCA/PyAnJ30gJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lcnNPZihpZCkpXG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHsvLyBUT0RPXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7XG4gICAgICAgICAgICBjbGF1c2UxOiB0aGlzLmNvbmRpdGlvbi5zaW1wbGUsXG4gICAgICAgICAgICBjbGF1c2UyOiB0aGlzLmNvbnNlcXVlbmNlLnNpbXBsZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy5jb25kaXRpb24uZW50aXRpZXMuY29uY2F0KHRoaXMuY29uc2VxdWVuY2UuZW50aXRpZXMpKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQgfHVuZGVmaW5lZCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF0pOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF1cblxuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9iYWNrZW5kL0NvbnRleHRcIjtcbmltcG9ydCB7IEluc3RydWN0aW9uVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9JbnN0cnVjdGlvblRoaW5nXCI7XG5pbXBvcnQgeyBOdW1iZXJUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL051bWJlclRoaW5nXCI7XG5pbXBvcnQgeyBTdHJpbmdUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1N0cmluZ1RoaW5nXCI7XG5pbXBvcnQgeyBUaGluZywgZ2V0VGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiO1xuaW1wb3J0IHsgaXNQbHVyYWwsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgcGFyc2VOdW1iZXIgfSBmcm9tIFwiLi4vdXRpbHMvcGFyc2VOdW1iZXJcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBldmFsQXN0KGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJnczogVG9DbGF1c2VPcHRzID0ge30pOiBUaGluZ1tdIHtcblxuICAgIGFyZ3Muc2lkZUVmZmVjdHMgPz89IGNvdWxkSGF2ZVNpZGVFZmZlY3RzKGFzdClcblxuICAgIGlmIChhcmdzLnNpZGVFZmZlY3RzKSB7IC8vIG9ubHkgY2FjaGUgaW5zdHJ1Y3Rpb25zIHdpdGggc2lkZSBlZmZlY3RzXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gbmV3IEluc3RydWN0aW9uVGhpbmcoYXN0KVxuICAgICAgICBjb250ZXh0LnNldChpbnN0cnVjdGlvbi5nZXRJZCgpLCBpbnN0cnVjdGlvbilcbiAgICAgICAgY29udGV4dC5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHJvb3Q6ICdpbnN0cnVjdGlvbicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbaW5zdHJ1Y3Rpb25dIH0pKVxuICAgIH1cblxuICAgIGlmIChhc3Q/LmxpbmtzPy5jb3B1bGEpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy52ZXJiKSB7XG4gICAgICAgIHJldHVybiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8ubm9uc3ViY29uaikge1xuICAgICAgICByZXR1cm4gZXZhbENvbXBvdW5kU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBldmFsTm91blBocmFzZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfVxuXG59XG5cblxuZnVuY3Rpb24gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG5cbiAgICBpZiAoYXJncz8uc2lkZUVmZmVjdHMpIHsgLy8gYXNzaWduIHRoZSByaWdodCB2YWx1ZSB0byB0aGUgbGVmdCB2YWx1ZVxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkuc2ltcGxlXG4gICAgICAgIGNvbnN0IHJWYWwgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8ucHJlZGljYXRlISwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICAgICAgY29uc3Qgb3duZXJDaGFpbiA9IGdldE93bmVyc2hpcENoYWluKHN1YmplY3QpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KHN1YmplY3QpXG4gICAgICAgIGNvbnN0IGxleGVtZXMgPSBzdWJqZWN0LmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGUhKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICBjb25zdCBsZXhlbWVzV2l0aFJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWwgfSkpXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N1YmplY3Q9Jywgc3ViamVjdC50b1N0cmluZygpLCAnclZhbD0nLCByVmFsLCAnb3duZXJDaGFpbj0nLCBvd25lckNoYWluLCAnbWFwcz0nLCBtYXBzKVxuXG4gICAgICAgIGlmICghbWFwcy5sZW5ndGggJiYgb3duZXJDaGFpbi5sZW5ndGggPD0gMSkgeyAvLyBsVmFsIGlzIGNvbXBsZXRlbHkgbmV3XG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWwuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0KHguZ2V0SWQoKSwgeCkpXG4gICAgICAgICAgICByZXR1cm4gclZhbFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKG93bmVyQ2hhaW4ubGVuZ3RoID4gMSkgeyAvLyBsVmFsIGlzIHByb3BlcnR5IG9mIGV4aXN0aW5nIG9iamVjdFxuICAgICAgICAvLyAgICAgY29uc3QgYWJvdXRPd25lciA9IGFib3V0KHN1YmplY3QsIG93bmVyQ2hhaW4uYXQoLTIpISlcbiAgICAgICAgLy8gICAgIGNvbnN0IG93bmVycyA9IGdldEludGVyZXN0aW5nSWRzKGNvbnRleHQucXVlcnkoYWJvdXRPd25lciksIGFib3V0T3duZXIpLm1hcChpZCA9PiBjb250ZXh0LmdldChpZCkhKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICAvLyAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gb3duZXJzLmF0KDApPy5zZXRMZXhlbWUoeCkpXG4gICAgICAgIC8vICAgICBjb25zdCBvd25lciA9IG93bmVycy5hdCgwKVxuICAgICAgICAvLyAgICAgclZhbC5mb3JFYWNoKHggPT4gb3duZXI/LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAvLyAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgLy8gfVxuXG5cbiAgICB9IGVsc2UgeyAvLyBjb21wYXJlIHRoZSByaWdodCBhbmQgbGVmdCB2YWx1ZXNcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ211c3QgY2hlY2sgY29uZGl0aW9uIScpXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8uc3ViamVjdCEsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5wcmVkaWNhdGUhLCBhcmdzKS5hdCgwKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzdWJqZWN0LCBwcmVkaWNhdGUpXG4gICAgICAgIGNvbnN0IGFyZUVxdWFsID0gc3ViamVjdD8udG9KcygpID09PSBwcmVkaWNhdGU/LnRvSnMoKVxuICAgICAgICByZXR1cm4gYXJlRXF1YWwgJiYgKCFhc3QubGlua3M/Lm5lZ2F0aW9uKSA/IFtuZXcgTnVtYmVyVGhpbmcoMSldIDogW11cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygncHJvYmxlbSB3aXRoIGNvcHVsYSBzZW50ZW5jZSEnKVxuICAgIHJldHVybiBbXVxuICAgIC8vIHRocm93IG5ldyBFcnJvcignY29wdWxhIHNlbnRlbmNlIScpXG5cbiAgICAvLyBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuXG4gICAgLy8gY29uc3QgbWF5YmVTdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3Q/LmxpbmtzPy5zdWJqZWN0ISlcbiAgICAvLyBjb25zdCBzdWJqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdD8ubGlua3M/LnN1YmplY3QpXG4gICAgLy8gY29uc3QgcHJlZGljYXRlID0gZXZhbEFzdChjb250ZXh0LCBhc3Q/LmxpbmtzPy5wcmVkaWNhdGUhLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogdHJ1ZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG5cbiAgICAvLyBpZiAobWF5YmVTdWJqZWN0Lmxlbmd0aCkge1xuICAgIC8vICAgICByZXR1cm4gbWF5YmVTdWJqZWN0IC8vIFRPRE9cbiAgICAvLyB9XG5cbiAgICAvLyBjb25zdCBuZXdUaGluZyA9IHByZWRpY2F0ZVswXVxuICAgIC8vIGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gc3ViamVjdC5mbGF0TGlzdCgpLmZpbHRlcih4ID0+IHgucHJlZGljYXRlKS5tYXAoeCA9PiB4LnByZWRpY2F0ZSEpLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogW25ld1RoaW5nXSB9KSlcbiAgICAvLyBjb250ZXh0LnNldChuZXdUaGluZy5nZXRJZCgpLCBuZXdUaGluZylcbiAgICAvLyBsZXhlbWVzLmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcblxuICAgIC8vIHJldHVybiBbbmV3VGhpbmddXG59XG5cbmZ1bmN0aW9uIGFib3V0KGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKSB7XG4gICAgcmV0dXJuIGNsYXVzZS5mbGF0TGlzdCgpLmZpbHRlcih4ID0+IHguZW50aXRpZXMuaW5jbHVkZXMoZW50aXR5KSAmJiB4LmVudGl0aWVzLmxlbmd0aCA8PSAxKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSkuc2ltcGxlXG59XG5cbi8vIGZ1bmN0aW9uIGdldFByb3hpbWFsT3duZXIoY29udGV4dDpDb250ZXh0LCBjbGF1c2U6Q2xhdXNlLCBvd25lckNoYWluOklkW10pe1xuXG4vLyAgICAgY29uc3QgYWJvdXRPd25lciA9IGFib3V0KGNsYXVzZSwgb3duZXJDaGFpblswXSlcbi8vICAgICBjb25zdCBtYXBzID0gY29udGV4dC5xdWVyeShhYm91dE93bmVyKVxuXG5cblxuLy8gICAgIC8vIGNvbnNvbGUubG9nKCdvd25lck1hcHM9JywgbWFwcylcblxuLy8gfVxuXG5cblxuZnVuY3Rpb24gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3ZlcmIgc2VudGVuY2UhJykvLyBjb250ZXh0LmdldExleGVtZShhc3Q/LmxpbmtzPy5tdmVyYj8ubGV4ZW1lPy5yb290ISlcbn1cblxuZnVuY3Rpb24gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICAvLyB0aHJvdyBuZXcgRXJyb3IoJ2NvbXBsZXggc2VudGVuY2UhJylcblxuXG4gICAgaWYgKGFzdC5saW5rcz8uc3ViY29uaj8ubGV4ZW1lPy5yb290ID09PSAnaWYnKSB7XG5cbiAgICAgICAgaWYgKGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzLmNvbmRpdGlvbiEsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IGZhbHNlIH0pLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3MuY29uc2VxdWVuY2UhLCB7IC4uLmFyZ3MsIHNpZGVFZmZlY3RzOiB0cnVlIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBldmFsQ29tcG91bmRTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbXBvdW5kIHNlbnRlbmNlIScpXG59XG5cblxuXG5mdW5jdGlvbiBldmFsTm91blBocmFzZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuXG4gICAgaWYgKGFzdC5saW5rcz8uc3ViamVjdD8ubGlzdD8uc29tZSh4ID0+IHgubGlua3M/LnF1b3RlKSkge1xuICAgICAgICByZXR1cm4gZXZhbFN0cmluZyhjb250ZXh0LCBhc3QubGlua3M/LnN1YmplY3Q/Lmxpc3RbMF0sIGFyZ3MpXG4gICAgfVxuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KG5wKSAvLyBUT0RPOiBpbnRyYS1zZW50ZW5jZSBhbmFwaG9yYSByZXNvbHV0aW9uXG4gICAgY29uc3QgaW50ZXJlc3RpbmdJZHMgPSBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzLCBucClcbiAgICBjb25zdCB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4ISlcbiAgICAvLyBjb25zb2xlLmxvZyhucC50b1N0cmluZygpLCAnbWFwcz0nLCBtYXBzLCAnaW50ZXJlc3RpbmdJZHM9JywgaW50ZXJlc3RpbmdJZHMpXG5cbiAgICBpZiAoaXNBc3RQbHVyYWwoYXN0KSB8fCBnZXRBbmRQaHJhc2UoYXN0KSkgeyAvLyBpZiB1bml2ZXJzYWwgcXVhbnRpZmllZCwgSSBkb24ndCBjYXJlIGlmIHRoZXJlJ3Mgbm8gbWF0Y2hcbiAgICAgICAgcmV0dXJuIHRoaW5nc1xuICAgIH1cblxuICAgIGlmICh0aGluZ3MubGVuZ3RoKSB7IC8vIG5vbi1wbHVyYWwsIHJldHVybiBzaW5nbGUgZXhpc3RpbmcgVGhpbmdcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCAxKVxuICAgIH1cblxuICAgIC8vIG9yIGVsc2UgY3JlYXRlIGFuZCByZXR1cm5zIHRoZSBUaGluZ1xuICAgIHJldHVybiBhcmdzPy5hdXRvdml2aWZpY2F0aW9uID8gW2NyZWF0ZVRoaW5nKG5wKV0gOiBbXVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IChhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3Qgbm91bnMgPSAoYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IE9iamVjdC52YWx1ZXMoYXN0Py5saW5rcyA/PyB7fSkuZmlsdGVyKHggPT4geC5saXN0KS5mbGF0TWFwKHggPT4geC5saXN0ISkuZmlsdGVyKHggPT4geC5saW5rcz8ucHJlcG9zaXRpb24pLm1hcCh4ID0+IGNvbXBsZW1lbnRUb0NsYXVzZSh4LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UsIHNpZGVFZmZlY3RzOiBmYWxzZSB9KSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3QgYW5kUGhyYXNlID0gZXZhbEFuZFBocmFzZShnZXRBbmRQaHJhc2UoYXN0KSwgYXJncylcbiAgICAvL1RPRE86IHJlbGF0aXZlIGNsYXVzZXNcblxuICAgIHJldHVybiBhZGplY3RpdmVzLmFuZChub3VucykuYW5kKGNvbXBsZW1lbnRzKS5hbmQoYW5kUGhyYXNlKVxufVxuXG5mdW5jdGlvbiBnZXRBbmRQaHJhc2UobnA/OiBBc3ROb2RlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIChucD8ubGlua3MgYXMgYW55KT8uWydhbmQtcGhyYXNlJ10gIC8vVE9ETyFcbn1cblxuZnVuY3Rpb24gZXZhbEFuZFBocmFzZShhbmRQaHJhc2U/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKSB7XG5cbiAgICBpZiAoIWFuZFBocmFzZSkge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICByZXR1cm4gbm91blBocmFzZVRvQ2xhdXNlKChhbmRQaHJhc2U/LmxpbmtzIGFzIGFueSk/Llsnbm91bi1waHJhc2UnXS8qIFRPRE8hICovLCAvKiBhcmdzICovKSAvLyBtYXliZSBwcm9ibGVtIGlmIG11bHRpcGxlIHRoaW5ncyBoYXZlIHNhbWUgaWQsIHF1ZXJ5IGlzIG5vdCBnb25uYSBmaW5kIHRoZW1cbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCFcbiAgICBjb25zdCBvYmplY3RJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHByZXBvc2l0aW9uID0gYXN0Py5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZSFcbiAgICBjb25zdCBvYmplY3QgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0Py5saW5rcz8ub2JqZWN0LCB7IHN1YmplY3Q6IG9iamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG5cbiAgICByZXR1cm4gY2xhdXNlT2YocHJlcG9zaXRpb24sIHN1YmplY3RJZCwgb2JqZWN0SWQpLmFuZChvYmplY3QpXG5cbn1cblxuZnVuY3Rpb24gcmVsYXRpdmVDbGF1c2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gZW1wdHlDbGF1c2UgLy9UT0RPIVxufVxuXG5mdW5jdGlvbiBpc0FzdFBsdXJhbChhc3Q/OiBBc3ROb2RlKTogYm9vbGVhbiB7XG5cbiAgICBjb25zdCB4ID1cbiAgICAgICAgYXN0Py5saW5rcz8ubm91bj8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lICYmIGlzUGx1cmFsKHgubGV4ZW1lKSlcbiAgICAgICAgfHwgYXN0Py5saW5rcz8uYWRqZWN0aXZlPy5saXN0Py5zb21lKHggPT4geC5sZXhlbWUgJiYgaXNQbHVyYWwoeC5sZXhlbWUpKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5zdWJqZWN0Py5saXN0Py5zb21lKHggPT4geC5sZXhlbWUgJiYgaXNQbHVyYWwoeC5sZXhlbWUpKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy51bmlxdWFudFxuXG4gICAgaWYgKHgpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhhc3Q/LmxpbmtzID8/IHt9KS5jb25jYXQoYXN0Py5saXN0ID8/IFtdKS5zb21lKHggPT4gaXNBc3RQbHVyYWwoeCkpXG59XG5cbmZ1bmN0aW9uIGdldEludGVyZXN0aW5nSWRzKG1hcHM6IE1hcFtdLCBjbGF1c2U6IENsYXVzZSk6IElkW10ge1xuXG4gICAgLy8gdGhlIG9uZXMgd2l0aCBtb3N0IGRvdHMsIGJlY2F1c2UgXCJjb2xvciBvZiBzdHlsZSBvZiBidXR0b25cIiBcbiAgICAvLyBoYXMgYnV0dG9uSWQuc3R5bGUuY29sb3IgYW5kIHRoYXQncyB0aGUgb2JqZWN0IHRoZSBzZW50ZW5jZSBzaG91bGQgcmVzb2x2ZSB0b1xuICAgIC8vIHBvc3NpYmxlIHByb2JsZW0gaWYgXCJjb2xvciBvZiBidXR0b24gQU5EIGJ1dHRvblwiXG4gICAgLy8gY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKHggPT4gT2JqZWN0LnZhbHVlcyh4KSlcbiAgICAvLyBjb25zdCBtYXhMZW4gPSBNYXRoLm1heCguLi5pZHMubWFwKHggPT4gZ2V0TnVtYmVyT2ZEb3RzKHgpKSlcbiAgICAvLyByZXR1cm4gaWRzLmZpbHRlcih4ID0+IGdldE51bWJlck9mRG90cyh4KSA9PT0gbWF4TGVuKVxuXG4gICAgY29uc3Qgb2MgPSBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UpXG5cbiAgICBpZiAob2MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuIG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpIC8vYWxsXG4gICAgfVxuXG4gICAgLy8gLmF0KC0xKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBcblxufVxuXG5jb25zdCBnZXROdW1iZXJPZkRvdHMgPSAoaWQ6IElkKSA9PiBpZC5zcGxpdCgnLicpLmxlbmd0aCAvLy0xXG5cblxuZnVuY3Rpb24gY3JlYXRlVGhpbmcoY2xhdXNlOiBDbGF1c2UpOiBUaGluZyB7XG4gICAgY29uc3QgYmFzZXMgPSBjbGF1c2UuZmxhdExpc3QoKS5tYXAoeCA9PiB4LnByZWRpY2F0ZT8ucmVmZXJlbnRzPy5bMF0hKS8qIE9OTFkgRklSU1Q/ICovLmZpbHRlcih4ID0+IHgpXG4gICAgY29uc3QgaWQgPSBnZXRJbmNyZW1lbnRhbElkKClcbiAgICByZXR1cm4gZ2V0VGhpbmcoeyBpZCwgYmFzZXMgfSlcbn1cblxuZnVuY3Rpb24gZXZhbFN0cmluZyhjb250ZXh0OiBDb250ZXh0LCBhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG4gICAgY29uc3QgeCA9IE9iamVjdC52YWx1ZXMoeyAuLi5hc3Q/LmxpbmtzLCAncXVvdGUnOiB1bmRlZmluZWQgfSkuZmlsdGVyKHggPT4geCkuYXQoMCk/Lmxpc3Q/Lm1hcCh4ID0+IHgubGV4ZW1lPy50b2tlbikgPz8gW11cbiAgICBjb25zdCB5ID0geC5qb2luKCcgJylcbiAgICBjb25zdCB6ID0gcGFyc2VOdW1iZXIoeSlcblxuICAgIGlmICh6KSB7XG4gICAgICAgIHJldHVybiBbbmV3IE51bWJlclRoaW5nKHopXVxuICAgIH1cblxuICAgIGlmICgheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIFtuZXcgU3RyaW5nVGhpbmcoeSldXG59XG5cbmZ1bmN0aW9uIGNvdWxkSGF2ZVNpZGVFZmZlY3RzKGFzdDogQXN0Tm9kZSkgeyAvLyBhbnl0aGluZyB0aGF0IGlzIG5vdCBhIG5vdW5waHJhc2UgQ09VTEQgaGF2ZSBzaWRlIGVmZmVjdHNcbiAgICByZXR1cm4gISEoYXN0LmxpbmtzPy5jb3B1bGEgfHwgYXN0LmxpbmtzPy52ZXJiIHx8IGFzdC5saW5rcz8uc3ViY29uailcbn1cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkLFxuICAgIGF1dG92aXZpZmljYXRpb24/OiBib29sZWFuLFxuICAgIHNpZGVFZmZlY3RzPzogYm9vbGVhbixcbn0iLCJcbi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IHN0cmluZ1xuXG4vKipcbiAqIFNvbWUgc3BlY2lhbCBJZHNcbiAqL1xuZXhwb3J0IGNvbnN0IFNwZWNpYWxJZHMgPSB7XG4gICAgSU1QT1NTSUJMRTogJ0lNUE9TU0lCTEUnXG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZCgpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBuZXdJZFxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuL3VuaXFcIlxuXG4vKipcbiAqIEludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byBsaXN0cyBvZiBzdHJpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHhzOiBzdHJpbmdbXSwgeXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHVuaXEoeHMuZmlsdGVyKHggPT4geXMuaW5jbHVkZXMoeCkpXG4gICAgICAgIC5jb25jYXQoeXMuZmlsdGVyKHkgPT4geHMuaW5jbHVkZXMoeSkpKSlcbn1cbiIsIlxuLyoqXG4gKiBDaGVja3MgaWYgc3RyaW5nIGhhcyBhbnkgbm9uLWRpZ2l0IGNoYXIgKGV4Y2VwdCBmb3IgXCIuXCIpIGJlZm9yZVxuICogY29udmVydGluZyB0byBudW1iZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU51bWJlcihzdHJpbmc6IHN0cmluZyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBub25EaWcgPSBzdHJpbmcubWF0Y2goL1xcRC9nKT8uYXQoMClcblxuICAgIGlmIChub25EaWcgJiYgbm9uRGlnICE9PSAnLicpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBwYXJzZUZsb2F0KHN0cmluZylcblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGxldCBzZWVuID0ge30gYXMgYW55XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=