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

/***/ "./app/src/backend/enviro/BaseEnviro.ts":
/*!**********************************************!*\
  !*** ./app/src/backend/enviro/BaseEnviro.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
class BaseEnviro {
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
        this.get = (id) => {
            const parts = id.split('.');
            const p1 = parts[0];
            const w = this.dictionary[p1];
            if (!w) {
                return undefined;
            }
            if (parts.length > 1) {
                return w.get(parts.slice(1).join('.'));
            }
            this.setLastReferenced(p1);
            return w;
        };
        this.set = (wrapper) => {
            this.setLastReferenced(wrapper.id);
            return this.dictionary[wrapper.id] = wrapper;
        };
        this.query = (query) => {
            const universe = this.values
                .map(w => w.toClause(query))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const maps = universe
                .query(query, { it: this.lastReferenced });
            // console.log('query=', query.toString(), 'universe=', universe.toString(), 'maps=', maps)
            return maps;
        };
    }
    get values() {
        return Object.values(this.dictionary);
    }
    setLastReferenced(lastReferenced) {
        if (Object.keys(this.dictionary).includes(lastReferenced)) {
            this.lastReferenced = lastReferenced;
        }
    }
}
exports["default"] = BaseEnviro;


/***/ }),

/***/ "./app/src/backend/enviro/Enviro.ts":
/*!******************************************!*\
  !*** ./app/src/backend/enviro/Enviro.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BaseEnviro_1 = __importDefault(__webpack_require__(/*! ./BaseEnviro */ "./app/src/backend/enviro/BaseEnviro.ts"));
function getEnviro(opts) {
    return new BaseEnviro_1.default(opts === null || opts === void 0 ? void 0 : opts.root);
}
exports["default"] = getEnviro;


/***/ }),

/***/ "./app/src/backend/thing/BaseThing.ts":
/*!********************************************!*\
  !*** ./app/src/backend/thing/BaseThing.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseThing = void 0;
const things_1 = __webpack_require__(/*! ../../config/things */ "./app/src/config/things.ts");
const BasicContext_1 = __importDefault(__webpack_require__(/*! ../../facade/context/BasicContext */ "./app/src/facade/context/BasicContext.ts"));
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../middle/clauses/functions/topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
const allKeys_1 = __webpack_require__(/*! ../../utils/allKeys */ "./app/src/utils/allKeys.ts");
const deepCopy_1 = __webpack_require__(/*! ../../utils/deepCopy */ "./app/src/utils/deepCopy.ts");
const typeOf_1 = __webpack_require__(/*! ./typeOf */ "./app/src/backend/thing/typeOf.ts");
class BaseThing {
    constructor(args) {
        this.args = args;
        this.id = this.args.id;
        this.relations = [];
        this.parent = this.args.parent; //container
        this.object = this.args.object;
        this.superclass = this.args.superclass;
        this.base = this.args.base;
        this.getLexemes = () => {
            return this.getAllKeys().flatMap(x => {
                let child = this.get(x);
                if (!child) {
                    return [];
                }
                const lex = (0, Lexeme_1.makeLexeme)({
                    type: (0, typeOf_1.typeOf)(child.unwrap()),
                    root: x,
                    referent: child,
                });
                return [lex, ...lex.extrapolate()];
            });
        };
        this.getAllKeys = () => { var _a, _b, _c; return (0, allKeys_1.allKeys)((_a = this.object) !== null && _a !== void 0 ? _a : {}).concat((0, allKeys_1.allKeys)((_c = (_b = this.base) === null || _b === void 0 ? void 0 : _b.unwrap()) !== null && _c !== void 0 ? _c : {})).concat((0, allKeys_1.allKeys)(this)); };
    }
    get(id) {
        var _a, _b, _c, _d;
        const parts = id.split('.');
        const p1 = parts[0];
        let o;
        try {
            o = (_c = (_a = this[p1]) !== null && _a !== void 0 ? _a : (_b = this.object) === null || _b === void 0 ? void 0 : _b[p1]) !== null && _c !== void 0 ? _c : (_d = this.base) === null || _d === void 0 ? void 0 : _d.get(p1);
        }
        catch (_e) {
            return undefined;
        }
        if (!o) {
            return undefined;
        }
        const w = o instanceof BaseThing ? o : new BaseThing({ object: o, id: `${this.id}.${p1}`, parent: this });
        //memoize
        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'));
        }
        return w;
    }
    copy(opts) {
        var _a, _b;
        return new BaseThing({
            id: (_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id,
            object: this.object ? (0, deepCopy_1.deepCopy)(this.object) : undefined,
            superclass: this.superclass,
            base: (_b = this.base) === null || _b === void 0 ? void 0 : _b.copy(),
        });
    }
    unwrap() {
        var _a, _b;
        return (_a = this.object) !== null && _a !== void 0 ? _a : (_b = this.base) === null || _b === void 0 ? void 0 : _b.unwrap();
    }
    set(predicate, opts) {
        var _a;
        const relation = { predicate, args: (_a = opts === null || opts === void 0 ? void 0 : opts.args) !== null && _a !== void 0 ? _a : [] };
        let added = [];
        let removed = [];
        let unchanged = this.relations.filter(x => !relationsEqual(x, relation));
        if (opts === null || opts === void 0 ? void 0 : opts.negated) {
            removed = [relation];
        }
        else if (this.isAlready(relation)) {
            unchanged.push(relation);
        }
        else {
            added = [relation];
            removed.push(...this.getExcludedBy(relation));
            unchanged = unchanged.filter(x => !removed.some(r => relationsEqual(x, r)));
        }
        added.forEach(r => this.addRelation(r));
        removed.forEach(r => this.removeRelation(r));
        return this.reinterpret(added, removed, unchanged);
    }
    reinterpret(added, removed, kept) {
        removed.forEach(r => {
            this.undo(r);
        });
        added.forEach(r => {
            this.do(r);
        });
        kept.forEach(r => {
            this.keep(r);
        });
        return [];
    }
    getExcludedBy(relation) {
        return []; //TODO
    }
    do(relation) {
        // console.log((relation.predicate as BetterBaseThing).superclass === colorThing )
        if (relation.predicate.superclass === things_1.colorThing) {
            this.refreshColor(relation);
            return;
        }
        this.inherit(relation.predicate);
    }
    refreshColor(relation) {
        var _a;
        const style = (_a = this.get('style')) === null || _a === void 0 ? void 0 : _a.unwrap();
        style ? style.background = relation.predicate.unwrap() : 0;
        return;
    }
    undo(relation) {
        this.disinherit(relation.predicate);
    }
    keep(relation) {
        this.refreshColor(relation);
    }
    addRelation(relation) {
        this.relations.push(relation);
    }
    removeRelation(relation) {
        this.relations = this.relations.filter(x => !relationsEqual(relation, x));
    }
    isAlready(relation) {
        return (!relation.args.length && this.equals(relation.predicate))
            || this.relations.some(x => relationsEqual(x, relation));
    }
    inherit(added) {
        //TODO: prevent re-creation of existing DOM elements
        this.base = added.copy({ id: this.id });
        this.superclass = added;
    }
    disinherit(expelled) {
        var _a, _b;
        if (this.superclass === expelled) {
            if (((_a = this.base) === null || _a === void 0 ? void 0 : _a.unwrap()) instanceof HTMLElement && this.parent instanceof BasicContext_1.default) {
                (_b = this.parent.root) === null || _b === void 0 ? void 0 : _b.removeChild(this.base.unwrap());
            }
            this.base = things_1.thing.copy();
            this.superclass = things_1.thing;
        }
    }
    pointOut(doIt) {
        var _a;
        const x = (_a = this.base) === null || _a === void 0 ? void 0 : _a.unwrap();
        if (x instanceof HTMLElement) {
            x.style.outline = doIt ? '#f00 solid 2px' : '';
        }
    }
    // -----------------evil starts below------------------------------------
    toClause(query) {
        const queryOrEmpty = query !== null && query !== void 0 ? query : Clause_1.emptyClause;
        // const fillerClause = clauseOf(makeLexeme({ root: this.id.toString(), type: 'noun' }), this.id) //TODO
        const res = queryOrEmpty
            .flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => { var _a; return this.isAlready({ predicate: (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referent, args: [] }); })
            .map(x => x.copy({ map: { [x.args[0]]: this.id } }))
            // .concat(fillerClause)
            .reduce((a, b) => a.and(b), Clause_1.emptyClause)
            .and(this.ownerInfo(queryOrEmpty));
        // console.log(res.toString())
        return res;
    }
    ownerInfo(q) {
        //TODO: this unwittinlgy asserts wrong non-relational info about this object "parroting the query".
        const maps = this.query(q);
        const res = (maps[0] && (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]).length > 1) ?
            q.copy({ map: maps[0] })
            : Clause_1.emptyClause;
        // console.log(res.toString())
        return res;
    }
    query(clause, parentMap = {}) {
        var _a;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause, (0, topLevel_1.getTopLevel)(clause)[0]);
        if (oc.length === 1) { //BASECASE: check yourself
            if (this.isAlready({ predicate: (_a = clause.predicate) === null || _a === void 0 ? void 0 : _a.referent, args: [] })) { //TODO: also handle non-ownership non-intransitive relations!, TODO: handle non BasicClauses!!!! (that don't have ONE predicate!)
                return [Object.assign(Object.assign({}, parentMap), { [clause.entities[0]]: this.id })];
            }
            return []; //TODO
        }
        // check your children!
        const top = (0, topLevel_1.getTopLevel)(clause);
        const peeled = clause.flatList()
            .filter(x => x.entities.every(e => !top.includes(e)))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause);
        const relevantNames = peeled.flatList().flatMap(x => { var _a, _b; return [(_a = x.predicate) === null || _a === void 0 ? void 0 : _a.root, (_b = x.predicate) === null || _b === void 0 ? void 0 : _b.token]; }).filter(x => x).map(x => x);
        const children = this.getAllKeys()
            .filter(x => relevantNames.includes(x))
            .map(x => this.get(x)) // .filter(x=>x?.unwrap() !== this)
            .filter(x => x)
            .map(x => x);
        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }));
        return res;
    }
    // -----------evil ends ---------------------------------------
    equals(other) {
        return other && this.unwrap() === other.unwrap();
    }
    setParent(parent) {
        var _a, _b;
        this.parent = parent;
        if (((_a = this.base) === null || _a === void 0 ? void 0 : _a.unwrap()) instanceof HTMLElement && this.parent instanceof BasicContext_1.default) {
            (_b = this.parent.root) === null || _b === void 0 ? void 0 : _b.appendChild(this.base.unwrap());
        }
    }
}
exports.BaseThing = BaseThing;
function relationsEqual(r1, r2) {
    return r1.predicate.equals(r2.predicate)
        && r1.args.length === r2.args.length
        && r1.args.every((x, i) => r2.args[i] === x);
}


/***/ }),

/***/ "./app/src/backend/thing/Thing.ts":
/*!****************************************!*\
  !*** ./app/src/backend/thing/Thing.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrap = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/thing/BaseThing.ts");
function wrap(args) {
    return new BaseThing_1.BaseThing(args);
}
exports.wrap = wrap;


/***/ }),

/***/ "./app/src/backend/thing/typeOf.ts":
/*!*****************************************!*\
  !*** ./app/src/backend/thing/typeOf.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeOf = void 0;
function typeOf(o) {
    switch (typeof o) {
        case 'function':
            return o.length > 0 ? 'mverb' : 'iverb';
        case 'boolean':
            return 'adjective';
        case 'undefined':
            return undefined;
        default:
            return 'noun';
    }
}
exports.typeOf = typeOf;


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
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const things_1 = __webpack_require__(/*! ./things */ "./app/src/config/things.ts");
function getConfig() {
    return {
        lexemeTypes: LexemeType_1.lexemeTypes,
        lexemes: lexemes_1.lexemes.flatMap(x => {
            const l = (0, Lexeme_1.makeLexeme)(x);
            return [l, ...l.extrapolate()];
        }),
        syntaxes: syntaxes_1.syntaxes,
        prelude: prelude_1.prelude,
        staticDescPrecedence: syntaxes_1.staticDescPrecedence,
        things: things_1.things,
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
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('adjective', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'existquant', 'uniquant', 'filler', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'grammar', 'nonsubconj', // and ...
'disjunc', // or, but, however ...
'pronoun');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const things_1 = __webpack_require__(/*! ./things */ "./app/src/config/things.ts");
const being = (0, Lexeme_1.makeLexeme)({
    root: 'be',
    type: 'copula',
});
const doing = {
    root: 'do',
    type: 'hverb',
};
const not = (0, Lexeme_1.makeLexeme)({
    root: 'not',
    type: 'negation',
});
exports.lexemes = [
    being,
    doing,
    not,
    { _root: being, token: 'is', cardinality: 1 },
    { _root: being, token: 'are', cardinality: '*' },
    { _root: doing, token: 'does', cardinality: 1 },
    { root: 'then', type: 'filler' },
    { root: '.', type: 'fullstop' },
    { root: 'optional', type: 'adjective', cardinality: '1|0' },
    { root: 'one-or-more', type: 'adjective', cardinality: '+' },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*' },
    { root: 'or', type: 'disjunc' },
    { root: 'subject', type: 'adjective' },
    { root: 'predicate', type: 'adjective' },
    { root: 'object', type: 'adjective' },
    { root: "isn't", type: 'contraction', contractionFor: [being, not] },
    { root: 'and', type: 'nonsubconj' },
    { root: 'left', type: 'adjective' },
    { root: 'right', type: 'adjective' },
    { root: 'condition', type: 'adjective' },
    { root: 'consequence', type: 'adjective' },
    { root: 'a', type: 'indefart' },
    { root: 'an', type: 'indefart' },
    { root: 'the', type: 'defart' },
    { root: 'if', type: 'subconj' },
    { root: 'when', type: 'subconj' },
    { root: 'any', type: 'uniquant' },
    { root: 'every', type: 'uniquant' },
    { root: 'of', type: 'preposition' },
    { root: 'that', type: 'relpron' },
    { root: 'it', type: 'pronoun' },
    { root: 'thing', type: 'noun', referent: things_1.thing },
    { root: 'button', type: 'noun', referent: things_1.buttonThing },
    { root: 'div', type: 'noun', referent: things_1.divThing },
    { root: 'color', type: 'noun', referent: things_1.colorThing },
    { root: 'red', type: 'noun', referent: things_1.redThing },
    { root: 'green', type: 'noun', referent: things_1.greenThing },
];


/***/ }),

/***/ "./app/src/config/prelude.ts":
/*!***********************************!*\
  !*** ./app/src/config/prelude.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prelude = void 0;
exports.prelude = [
    // grammar
    'quantifier is uniquant or existquant',
    'article is indefart or defart',
    'complement is preposition then object noun-phrase',
    `copula-sentence is subject noun-phrase 
        then copula 
        then optional negation 
        then predicate noun-phrase`,
    `noun-phrase is optional quantifier 
        then optional article 
        then zero-or-more adjectives 
        then zero-or-more subject noun or pronoun or grammar
        then optional subclause 
        then zero-or-more complements `,
    'copulasubclause is relpron then copula then predicate noun-phrase',
    'mverbsubclause is relpron then mverb then object noun-phrase.',
    'subclause is copulasubclause or mverbsubclause',
    `and-sentence is left copula-sentence or noun-phrase 
        then nonsubconj
        then one-or-more right and-sentence or copula-sentence or noun-phrase`,
    `mverb-sentence is subject noun-phrase 
		then optional hverb
		then optional negation
		then mverb
		then object noun-phrase`,
    `iverb-sentence is subject noun-phrase 
		then optional hverb
		then optional negation
		then iverb`,
    `simple-sentence is copula-sentence or iverb-sentence or mverb-sentence`,
    `cs2 is consequence simple-sentence
      then subconj
      then condition simple-sentence`,
    `cs1 is subconj 
    then condition simple-sentence 
    then filler 
    then consequence simple-sentence`,
    // domain
    // 'color is a thing',
    // 'red and blue and black and green and purple are colors',
    // 'color of a button is background of style of it',
    // 'color of a div is background of style of it',
    // 'text of a button is textContent of it',
];


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.staticDescPrecedence = exports.constituentTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion');
exports.staticDescPrecedence = exports.constituentTypes.concat();
exports.syntaxes = {
    'macro': [
        { type: ['noun', 'grammar'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' }
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['filler'], number: '1|0' }
    ],
    'taggedunion': [
        { type: ['grammar'], number: 1 },
        { type: ['disjunc'], number: '1|0' }
    ],
};


/***/ }),

/***/ "./app/src/config/things.ts":
/*!**********************************!*\
  !*** ./app/src/config/things.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.things = exports.greenThing = exports.redThing = exports.colorThing = exports.divThing = exports.buttonThing = exports.thing = void 0;
const Thing_1 = __webpack_require__(/*! ../backend/thing/Thing */ "./app/src/backend/thing/Thing.ts");
exports.thing = (0, Thing_1.wrap)({ id: 'thing', object: {} /* BaseThing */ });
exports.buttonThing = (0, Thing_1.wrap)({ id: 'button', object: HTMLButtonElement.prototype });
exports.divThing = (0, Thing_1.wrap)({ id: 'div', object: HTMLDivElement.prototype });
exports.colorThing = (0, Thing_1.wrap)({ id: 'color', object: {} });
exports.redThing = (0, Thing_1.wrap)({ id: 'red', object: 'red' });
exports.greenThing = (0, Thing_1.wrap)({ id: 'green', object: 'green' });
exports.redThing.set(exports.colorThing);
exports.greenThing.set(exports.colorThing);
exports.things = [
    exports.thing,
    // buttonThing,
    // divThing,
    exports.colorThing,
    exports.redThing,
    exports.greenThing,
];


/***/ }),

/***/ "./app/src/facade/brain/BasicBrain.ts":
/*!********************************************!*\
  !*** ./app/src/facade/brain/BasicBrain.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Parser_1 = __webpack_require__(/*! ../../frontend/parser/interfaces/Parser */ "./app/src/frontend/parser/interfaces/Parser.ts");
const evalAst_1 = __webpack_require__(/*! ../../middle/evalAst */ "./app/src/middle/evalAst.ts");
class BasicBrain {
    constructor(context) {
        this.context = context;
        this.context.prelude.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
            if (ast.type === 'macro') {
                this.context.setSyntax(ast);
                return [];
            }
            const res = (0, evalAst_1.evalAst)(this.context, ast);
            this.context.values.forEach(x => x.pointOut(false));
            res.forEach(x => x.pointOut(true));
            return res;
        }).flat();
    }
    executeUnwrapped(natlang) {
        return this.execute(natlang).map(x => { var _a, _b; return (_b = (_a = x === null || x === void 0 ? void 0 : x.unwrap) === null || _a === void 0 ? void 0 : _a.call(x)) !== null && _b !== void 0 ? _b : x; });
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/facade/brain/Brain.ts":
/*!***************************************!*\
  !*** ./app/src/facade/brain/Brain.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const Context_1 = __webpack_require__(/*! ../context/Context */ "./app/src/facade/context/Context.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/facade/brain/BasicBrain.ts"));
function getBrain(opts) {
    return new BasicBrain_1.default((0, Context_1.getContext)(opts));
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/facade/context/BasicContext.ts":
/*!************************************************!*\
  !*** ./app/src/facade/context/BasicContext.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Config_1 = __webpack_require__(/*! ../../config/Config */ "./app/src/config/Config.ts");
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const macroToSyntax_1 = __webpack_require__(/*! ../../frontend/parser/macroToSyntax */ "./app/src/frontend/parser/macroToSyntax.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../../frontend/parser/maxPrecedence */ "./app/src/frontend/parser/maxPrecedence.ts");
class BasicContext {
    constructor(enviro) {
        this.enviro = enviro;
        this.config = (0, Config_1.getConfig)();
        this.staticDescPrecedence = this.config.staticDescPrecedence;
        this.syntaxMap = this.config.syntaxes;
        this._syntaxList = this.getSyntaxList();
        this._lexemes = this.config.lexemes;
        this.prelude = this.config.prelude;
        this.lexemeTypes = this.config.lexemeTypes;
        this.set = this.enviro.set;
        this.query = this.enviro.query;
        this.root = this.enviro.root;
        this.get = this.enviro.get;
        this.getLexeme = (rootOrToken) => {
            return this._lexemes
                .filter(x => rootOrToken === x.token || rootOrToken === x.root)
                .at(0);
        };
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme((0, Lexeme_1.makeLexeme)({ type: 'grammar', root: syntax.name }));
            this.syntaxMap[syntax.name] = syntax.syntax;
            this._syntaxList = this.getSyntaxList();
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
        this.setLexeme = (lexeme) => {
            if (lexeme.root && !lexeme.token && this._lexemes.some(x => x.root === lexeme.root)) {
                this._lexemes = this._lexemes.filter(x => x.root !== lexeme.root);
            }
            this._lexemes.push(lexeme);
            this._lexemes.push(...lexeme.extrapolate(this));
        };
        this.astTypes.forEach(g => {
            this.setLexeme((0, Lexeme_1.makeLexeme)({
                root: g,
                type: 'grammar'
            }));
        });
        this.config.things.forEach(t => {
            this.set(t);
        });
    }
    get values() {
        return this.enviro.values;
    }
    getSyntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.config.staticDescPrecedence.concat(z);
    }
    get syntaxList() {
        return this._syntaxList;
    }
    get lexemes() {
        return this._lexemes;
    }
    get astTypes() {
        const res = this.config.lexemeTypes;
        res.push(...this.staticDescPrecedence);
        return res;
    }
}
exports["default"] = BasicContext;


/***/ }),

/***/ "./app/src/facade/context/Context.ts":
/*!*******************************************!*\
  !*** ./app/src/facade/context/Context.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContext = void 0;
const Enviro_1 = __importDefault(__webpack_require__(/*! ../../backend/enviro/Enviro */ "./app/src/backend/enviro/Enviro.ts"));
const BasicContext_1 = __importDefault(__webpack_require__(/*! ./BasicContext */ "./app/src/facade/context/BasicContext.ts"));
function getContext(opts) {
    return new BasicContext_1.default((0, Enviro_1.default)(opts));
}
exports.getContext = getContext;


/***/ }),

/***/ "./app/src/frontend/lexer/BaseLexeme.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/BaseLexeme.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Cardinality_1 = __webpack_require__(/*! ../parser/interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const conjugate_1 = __webpack_require__(/*! ./functions/conjugate */ "./app/src/frontend/lexer/functions/conjugate.ts");
const pluralize_1 = __webpack_require__(/*! ./functions/pluralize */ "./app/src/frontend/lexer/functions/pluralize.ts");
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
class BaseLexeme {
    constructor(newData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        this.newData = newData;
        this._root = (_a = this.newData) === null || _a === void 0 ? void 0 : _a._root;
        this.root = (_c = (_b = this.newData) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : (_d = this._root) === null || _d === void 0 ? void 0 : _d.root;
        this.type = (_f = (_e = this.newData) === null || _e === void 0 ? void 0 : _e.type) !== null && _f !== void 0 ? _f : (_g = this._root) === null || _g === void 0 ? void 0 : _g.type;
        this.contractionFor = (_j = (_h = this.newData) === null || _h === void 0 ? void 0 : _h.contractionFor) !== null && _j !== void 0 ? _j : (_k = this._root) === null || _k === void 0 ? void 0 : _k.contractionFor;
        this.token = (_m = (_l = this.newData) === null || _l === void 0 ? void 0 : _l.token) !== null && _m !== void 0 ? _m : (_o = this._root) === null || _o === void 0 ? void 0 : _o.token;
        this.cardinality = (_q = (_p = this.newData) === null || _p === void 0 ? void 0 : _p.cardinality) !== null && _q !== void 0 ? _q : (_r = this._root) === null || _r === void 0 ? void 0 : _r.cardinality;
        this.isVerb = this.type === 'mverb' || this.type === 'iverb';
        this.isPlural = (0, Cardinality_1.isRepeatable)((_s = this.newData) === null || _s === void 0 ? void 0 : _s.cardinality);
        this.referent = (_u = (_t = this.newData) === null || _t === void 0 ? void 0 : _t.referent) !== null && _u !== void 0 ? _u : (_v = this._root) === null || _v === void 0 ? void 0 : _v.referent;
    }
    extrapolate(context) {
        if ((this.type === 'noun' || this.type === 'grammar') && !this.isPlural) {
            return [(0, Lexeme_1.makeLexeme)({ _root: this, token: (0, pluralize_1.pluralize)(this.root), cardinality: '*', referent: this.referent })];
        }
        if (this.isVerb) {
            return (0, conjugate_1.conjugate)(this.root).map(x => (0, Lexeme_1.makeLexeme)({ _root: this, token: x, referent: this.referent }));
        }
        return [];
    }
}
exports["default"] = BaseLexeme;


/***/ }),

/***/ "./app/src/frontend/lexer/EagerLexer.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/EagerLexer.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const dynamicLexeme_1 = __webpack_require__(/*! ./functions/dynamicLexeme */ "./app/src/frontend/lexer/functions/dynamicLexeme.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        this._pos = 0;
        const words = sourceCode
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s);
        this.tokens = words.flatMap(w => {
            var _a, _b;
            const lex = (_a = context.getLexeme(w)) !== null && _a !== void 0 ? _a : (0, dynamicLexeme_1.dynamicLexeme)(w, context, words);
            return (_b = lex.contractionFor) !== null && _b !== void 0 ? _b : [lex];
        });
    }
    next() {
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


/***/ }),

/***/ "./app/src/frontend/lexer/Lexeme.ts":
/*!******************************************!*\
  !*** ./app/src/frontend/lexer/Lexeme.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeLexeme = void 0;
const BaseLexeme_1 = __importDefault(__webpack_require__(/*! ./BaseLexeme */ "./app/src/frontend/lexer/BaseLexeme.ts"));
function makeLexeme(data) {
    if (data instanceof BaseLexeme_1.default) {
        return data;
    }
    return new BaseLexeme_1.default(data);
}
exports.makeLexeme = makeLexeme;


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

/***/ "./app/src/frontend/lexer/functions/dynamicLexeme.ts":
/*!***********************************************************!*\
  !*** ./app/src/frontend/lexer/functions/dynamicLexeme.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dynamicLexeme = void 0;
const Lexeme_1 = __webpack_require__(/*! ../Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
function dynamicLexeme(word, context, words) {
    var _a, _b, _c, _d, _e;
    const relevant = 
    // words
    //     .map(w => clauseOf(makeLexeme({ root: w, type: 'noun' }), 'X'))
    //     .flatMap(c => context.query(c))
    //     .flatMap(m => Object.values(m))
    //     .flatMap(id => context.get(id) ?? [])
    context.values
        .flatMap(x => x.getLexemes())
        .filter(x => x.token === word || x.root === word);
    // console.log('dynamicLexemes!', word, 'relevant=', relevant)
    const isMacroContext = words.some(x => { var _a; return ((_a = context.getLexeme(x)) === null || _a === void 0 ? void 0 : _a.type) === 'grammar'; })
        && !words.some(x => { var _a; return ['defart', 'indefart', 'nonsubconj'].includes((_a = context.getLexeme(x)) === null || _a === void 0 ? void 0 : _a.type); }); //TODO: why dependencies('macro') doesn't work?!
    const type = (_b = (_a = relevant[0]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : (isMacroContext ?
        'grammar'
        : 'noun');
    // console.log('dynamicLexeme', relevant.at(0)?.referent)
    return (0, Lexeme_1.makeLexeme)({
        token: word,
        root: (_d = (_c = relevant === null || relevant === void 0 ? void 0 : relevant.at(0)) === null || _c === void 0 ? void 0 : _c.root) !== null && _d !== void 0 ? _d : word,
        type: type,
        referent: (_e = relevant.at(0)) === null || _e === void 0 ? void 0 : _e.referent,
    });
}
exports.dynamicLexeme = dynamicLexeme;


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
                const x = this.tryParse(m.type, m.role);
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
            return this.context.lexemeTypes.includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.context.syntaxList);
            if (!ast) {
                break;
            }
            results.push(this.simplify(ast));
            if (((_a = this.lexer.peek) === null || _a === void 0 ? void 0 : _a.type) === 'fullstop') {
                this.lexer.next();
            }
        }
        return results;
    }
    tryParse(types, role) {
        for (const t of types) {
            const memento = this.lexer.pos;
            const x = this.knownParse(t, role);
            if (x) {
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const adjectiveNodes = (_c = (_b = (_a = macroPart.links) === null || _a === void 0 ? void 0 : _a.adjective) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const adjectives = adjectiveNodes.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; });
    const taggedUnions = (_f = (_e = (_d = macroPart.links) === null || _d === void 0 ? void 0 : _d.taggedunion) === null || _e === void 0 ? void 0 : _e.list) !== null && _f !== void 0 ? _f : [];
    const grammars = taggedUnions.map(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.grammar; });
    const quantadjs = adjectives.filter(a => a.cardinality);
    const qualadjs = adjectives.filter(a => !a.cardinality);
    return {
        type: grammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
        role: (_g = qualadjs.at(0)) === null || _g === void 0 ? void 0 : _g.root,
        number: (_h = quantadjs.at(0)) === null || _h === void 0 ? void 0 : _h.cardinality
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const autotester_1 = __importDefault(__webpack_require__(/*! ../../tests/autotester */ "./app/tests/autotester.ts"));
const Brain_1 = __webpack_require__(/*! ../facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function main() {
    const state = {
        brain: (0, Brain_1.getBrain)({ root: document.body }),
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
            yield (0, autotester_1.default)();
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

/***/ "./app/src/middle/clauses/functions/getOwnershipChain.ts":
/*!***************************************************************!*\
  !*** ./app/src/middle/clauses/functions/getOwnershipChain.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOwnershipChain = void 0;
function getOwnershipChain(clause, entity) {
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
const Thing_1 = __webpack_require__(/*! ../backend/thing/Thing */ "./app/src/backend/thing/Thing.ts");
const Clause_1 = __webpack_require__(/*! ./clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getIncrementalId_1 = __webpack_require__(/*! ./id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
function evalAst(context, ast, args) {
    var _a, _b, _c, _d, _e, _f, _g;
    if ((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.copula) {
        return evalCopulaSentence(context, ast, args);
    }
    else if (((_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.iverb) === null || _c === void 0 ? void 0 : _c.lexeme) || ((_e = (_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.mverb) === null || _e === void 0 ? void 0 : _e.lexeme)) {
        return evalVerbSentence(context, ast, args);
    }
    else if ((_f = ast === null || ast === void 0 ? void 0 : ast.links) === null || _f === void 0 ? void 0 : _f.subconj) {
        return evalComplexSentence(context, ast, args);
    }
    else if ((_g = ast === null || ast === void 0 ? void 0 : ast.links) === null || _g === void 0 ? void 0 : _g.nonsubconj) {
        return evalCompoundSentence(context, ast, args);
    }
    else {
        return evalNounPhrase(context, ast, args); //nounphrase is the "atom"
    }
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    var _a, _b, _c;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subject = evalAst(context, (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId, autovivification: true });
    const predicate = nounPhraseToClause((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId, autovivification: false }); //, { subject: subjectId, autovivification: false })
    // const test = evalAst(context,  ast?.links?.predicate, {subject: subjectId, autovivification:true})
    // console.log(test)
    subject.forEach(s => {
        predicate.flatList().forEach(c => {
            var _a, _b;
            s.set((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.referent, { negated: !!((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.negation) });
        });
    });
    subject.forEach(s => {
        context.set(s);
        s.setParent(context);
    });
    return []; //TODO
}
function evalVerbSentence(context, ast, args) {
    throw 'TODO!';
}
function evalComplexSentence(context, ast, args) {
    throw 'TODO!';
}
function evalCompoundSentence(context, ast, args) {
    throw 'TODO!';
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
    if (isPlural(ast)) { // if universal quantified, I don't care if there's no match
        return things;
    }
    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1);
    }
    // or else create and returns the Thing
    return (args === null || args === void 0 ? void 0 : args.autovivification) ? [createThing(context, np)] : [];
}
function nounPhraseToClause(ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const adjectives = ((_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.adjective) === null || _c === void 0 ? void 0 : _c.list) !== null && _d !== void 0 ? _d : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const nouns = ((_g = (_f = (_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.subject) === null || _f === void 0 ? void 0 : _f.list) !== null && _g !== void 0 ? _g : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const complements = Object.values((_h = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _h !== void 0 ? _h : {}).filter(x => x.list).flatMap(x => x.list).filter(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.preposition; }).map(x => complementToClause(x, { subject: subjectId, autovivification: false })).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    return adjectives.and(nouns).and(complements);
    //TODO: subclause
}
function complementToClause(ast, args) {
    var _a, _b, _c;
    const subjectId = args === null || args === void 0 ? void 0 : args.subject;
    const objectId = (0, getIncrementalId_1.getIncrementalId)();
    const preposition = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.preposition) === null || _b === void 0 ? void 0 : _b.lexeme;
    const object = nounPhraseToClause((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objectId, autovivification: false });
    return (0, Clause_1.clauseOf)(preposition, subjectId, objectId).and(object);
}
function relativeClauseToClause(ast, args) {
    return Clause_1.emptyClause; //TODO!
}
function isPlural(ast) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return ((_c = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.noun) === null || _b === void 0 ? void 0 : _b.lexeme) === null || _c === void 0 ? void 0 : _c.isPlural)
        || ((_f = (_e = (_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.adjective) === null || _e === void 0 ? void 0 : _e.lexeme) === null || _f === void 0 ? void 0 : _f.isPlural)
        || ((_j = (_h = (_g = ast === null || ast === void 0 ? void 0 : ast.links) === null || _g === void 0 ? void 0 : _g.noun) === null || _h === void 0 ? void 0 : _h.list) === null || _j === void 0 ? void 0 : _j.some(x => { var _a; return (_a = x.lexeme) === null || _a === void 0 ? void 0 : _a.isPlural; }))
        || ((_m = (_l = (_k = ast === null || ast === void 0 ? void 0 : ast.links) === null || _k === void 0 ? void 0 : _k.adjective) === null || _l === void 0 ? void 0 : _l.list) === null || _m === void 0 ? void 0 : _m.some(x => { var _a; return (_a = x.lexeme) === null || _a === void 0 ? void 0 : _a.isPlural; }))
        || ((_q = (_p = (_o = ast === null || ast === void 0 ? void 0 : ast.links) === null || _o === void 0 ? void 0 : _o.subject) === null || _p === void 0 ? void 0 : _p.list) === null || _q === void 0 ? void 0 : _q.some(x => { var _a; return (_a = x.lexeme) === null || _a === void 0 ? void 0 : _a.isPlural; }))
        || ((_r = ast === null || ast === void 0 ? void 0 : ast.links) === null || _r === void 0 ? void 0 : _r.uniquant);
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
function createThing(context, clause) {
    const thing = (0, Thing_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)() });
    clause.flatList().forEach(c => {
        const lexeme = c.predicate;
        if (!lexeme.referent) {
            if (lexeme.type === 'noun')
                lexeme.referent = thing;
            context.setLexeme(lexeme); // TODO: no side effects on context!!!!
        }
        else {
            thing.set(lexeme.referent, { negated: clause.negated });
        }
    });
    return thing;
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

/***/ "./app/src/utils/allKeys.ts":
/*!**********************************!*\
  !*** ./app/src/utils/allKeys.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.allKeys = void 0;
function allKeys(object, iter = 5) {
    let obj = object;
    let res = [];
    while (obj && iter) {
        res = [...res, ...Object.keys(obj)];
        res = [...res, ...Object.getOwnPropertyNames(obj)];
        obj = Object.getPrototypeOf(obj);
        iter--;
    }
    return res;
}
exports.allKeys = allKeys;


/***/ }),

/***/ "./app/src/utils/deepCopy.ts":
/*!***********************************!*\
  !*** ./app/src/utils/deepCopy.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deepCopy = void 0;
const newInstance_1 = __webpack_require__(/*! ./newInstance */ "./app/src/utils/newInstance.ts");
function deepCopy(object) {
    if (!(object instanceof HTMLElement)) {
        // return undefined
        return { __proto__: object };
    }
    try {
        const wrapped = object.cloneNode(true);
        return wrapped;
    }
    catch (_a) {
        return (0, newInstance_1.newInstance)(object);
    }
    // if (object instanceof HTMLElement) {
    //     const wrapped = object.cloneNode(true) as HTMLElement
    //     wrapped.innerHTML = object.innerHTML
    //     return wrapped
    // } else {
    //     // return { ...object }
    //     return { __proto__: object }
    // }
}
exports.deepCopy = deepCopy;


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

/***/ "./app/src/utils/newInstance.ts":
/*!**************************************!*\
  !*** ./app/src/utils/newInstance.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.newInstance = void 0;
const tagNameFromProto_1 = __webpack_require__(/*! ./tagNameFromProto */ "./app/src/utils/tagNameFromProto.ts");
/**
 *
 * Create a new instance of an object (even HTMLElement) from a prototype.
 * In case it's a number, no new instance is made.
 */
function newInstance(proto, ...args) {
    if (proto === Number.prototype) {
        return parseFloat(args[0]);
    }
    if (proto instanceof HTMLElement) {
        const tagName = (0, tagNameFromProto_1.tagNameFromProto)(proto);
        const elem = document.createElement(tagName);
        elem.textContent = tagName;
        return elem;
    }
    return new proto.constructor(...args);
}
exports.newInstance = newInstance;


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

/***/ "./app/src/utils/tagNameFromProto.ts":
/*!*******************************************!*\
  !*** ./app/src/utils/tagNameFromProto.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tagNameFromProto = void 0;
/**
 * Try getting the name of an html element from a prototype
 */
const tagNameFromProto = (x) => x.constructor.name
    .replace('HTML', '')
    .replace('Element', '')
    .toLowerCase();
exports.tagNameFromProto = tagNameFromProto;


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


/***/ }),

/***/ "./app/tests/autotester.ts":
/*!*********************************!*\
  !*** ./app/tests/autotester.ts ***!
  \*********************************/
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
const test1_1 = __webpack_require__(/*! ./tests/test1 */ "./app/tests/tests/test1.ts");
const test10_1 = __webpack_require__(/*! ./tests/test10 */ "./app/tests/tests/test10.ts");
const test11_1 = __webpack_require__(/*! ./tests/test11 */ "./app/tests/tests/test11.ts");
const test12_1 = __webpack_require__(/*! ./tests/test12 */ "./app/tests/tests/test12.ts");
const test13_1 = __webpack_require__(/*! ./tests/test13 */ "./app/tests/tests/test13.ts");
const test14_1 = __webpack_require__(/*! ./tests/test14 */ "./app/tests/tests/test14.ts");
const test15_1 = __webpack_require__(/*! ./tests/test15 */ "./app/tests/tests/test15.ts");
const test16_1 = __webpack_require__(/*! ./tests/test16 */ "./app/tests/tests/test16.ts");
const test17_1 = __webpack_require__(/*! ./tests/test17 */ "./app/tests/tests/test17.ts");
const test18_1 = __webpack_require__(/*! ./tests/test18 */ "./app/tests/tests/test18.ts");
const test2_1 = __webpack_require__(/*! ./tests/test2 */ "./app/tests/tests/test2.ts");
const test20_1 = __webpack_require__(/*! ./tests/test20 */ "./app/tests/tests/test20.ts");
const test21_1 = __webpack_require__(/*! ./tests/test21 */ "./app/tests/tests/test21.ts");
const test22_1 = __webpack_require__(/*! ./tests/test22 */ "./app/tests/tests/test22.ts");
const test23_1 = __webpack_require__(/*! ./tests/test23 */ "./app/tests/tests/test23.ts");
const test24_1 = __webpack_require__(/*! ./tests/test24 */ "./app/tests/tests/test24.ts");
const test25_1 = __webpack_require__(/*! ./tests/test25 */ "./app/tests/tests/test25.ts");
const test26_1 = __webpack_require__(/*! ./tests/test26 */ "./app/tests/tests/test26.ts");
const test27_1 = __webpack_require__(/*! ./tests/test27 */ "./app/tests/tests/test27.ts");
const test28_1 = __webpack_require__(/*! ./tests/test28 */ "./app/tests/tests/test28.ts");
const test29_1 = __webpack_require__(/*! ./tests/test29 */ "./app/tests/tests/test29.ts");
const test3_1 = __webpack_require__(/*! ./tests/test3 */ "./app/tests/tests/test3.ts");
const test31_1 = __webpack_require__(/*! ./tests/test31 */ "./app/tests/tests/test31.ts");
const test33_1 = __webpack_require__(/*! ./tests/test33 */ "./app/tests/tests/test33.ts");
const test35_1 = __webpack_require__(/*! ./tests/test35 */ "./app/tests/tests/test35.ts");
const test37_1 = __webpack_require__(/*! ./tests/test37 */ "./app/tests/tests/test37.ts");
const test38_1 = __webpack_require__(/*! ./tests/test38 */ "./app/tests/tests/test38.ts");
const test4_1 = __webpack_require__(/*! ./tests/test4 */ "./app/tests/tests/test4.ts");
const test5_1 = __webpack_require__(/*! ./tests/test5 */ "./app/tests/tests/test5.ts");
const test6_1 = __webpack_require__(/*! ./tests/test6 */ "./app/tests/tests/test6.ts");
const test7_1 = __webpack_require__(/*! ./tests/test7 */ "./app/tests/tests/test7.ts");
const test8_1 = __webpack_require__(/*! ./tests/test8 */ "./app/tests/tests/test8.ts");
const test9_1 = __webpack_require__(/*! ./tests/test9 */ "./app/tests/tests/test9.ts");
const clearDom_1 = __webpack_require__(/*! ./utils/clearDom */ "./app/tests/utils/clearDom.ts");
const sleep_1 = __webpack_require__(/*! ./utils/sleep */ "./app/tests/utils/sleep.ts");
const tests = [
    test1_1.test1,
    test2_1.test2,
    test3_1.test3,
    test4_1.test4,
    test5_1.test5,
    test6_1.test6,
    test7_1.test7,
    test8_1.test8,
    test9_1.test9,
    test10_1.test10,
    test11_1.test11,
    test12_1.test12,
    test13_1.test13,
    test14_1.test14,
    test15_1.test15,
    test16_1.test16,
    test17_1.test17,
    test18_1.test18,
    // test19, // uses if
    test20_1.test20,
    test21_1.test21,
    test22_1.test22,
    test23_1.test23,
    test24_1.test24,
    test25_1.test25,
    test26_1.test26,
    test27_1.test27,
    test28_1.test28,
    test29_1.test29,
    // test30,// dynamically defining a copula
    test31_1.test31,
    // test32,
    test33_1.test33,
    // test34,// dynamically defining an alias
    test35_1.test35,
    // test36, // dynamically defining an mverb
    test37_1.test37,
    test38_1.test38,
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            const success = test();
            console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`);
            yield (0, sleep_1.sleep)(10); //75
            (0, clearDom_1.clearDom)();
        }
    });
}
exports["default"] = autotester;


/***/ }),

/***/ "./app/tests/tests/test1.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test1.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test1 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test1() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is red. x is a button. y is a green button.');
    const assert1 = brain.executeUnwrapped('a green button')[0].style.background === 'green';
    const assert2 = brain.executeUnwrapped('a red button')[0].style.background === 'red';
    return assert1 && assert2;
}
exports.test1 = test1;


/***/ }),

/***/ "./app/tests/tests/test10.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test10.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test10 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test10() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button. y is a green button. z is a blue button. the red button. it is black.');
    const assert1 = brain.executeUnwrapped('x').at(0).style.background == 'black';
    const assert2 = brain.executeUnwrapped('y').at(0).style.background == 'green';
    const assert3 = brain.executeUnwrapped('z').at(0).style.background == 'blue';
    return assert1 && assert2 && assert3;
}
exports.test10 = test10;


/***/ }),

/***/ "./app/tests/tests/test11.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test11.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test11 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test11() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z and w are buttons');
    brain.executeUnwrapped('x and y are red');
    brain.executeUnwrapped('w and z are black');
    const assert1 = brain.executeUnwrapped('x').at(0).style.background === brain.executeUnwrapped('y').at(0).style.background;
    const assert2 = brain.executeUnwrapped('w').at(0).style.background === brain.executeUnwrapped('z').at(0).style.background;
    const assert3 = brain.executeUnwrapped('x').at(0).style.background === 'red';
    const assert4 = brain.executeUnwrapped('w').at(0).style.background === 'black';
    return assert1 && assert2 && assert3 && assert4;
}
exports.test11 = test11;


/***/ }),

/***/ "./app/tests/tests/test12.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test12.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test12 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test12() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y are buttons');
    brain.executeUnwrapped('x appendChilds y');
    return Object.values(brain.executeUnwrapped('x')[0].children).includes(brain.executeUnwrapped('y')[0]);
}
exports.test12 = test12;


/***/ }),

/***/ "./app/tests/tests/test13.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test13.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test13 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test13() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    // brain.executeUnwrapped('x is a button and the button is green')
    brain.executeUnwrapped('x is a button. it is green');
    return brain.executeUnwrapped('x')[0].style.background === 'green';
}
exports.test13 = test13;


/***/ }),

/***/ "./app/tests/tests/test14.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test14.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test14 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test14() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. x and y are red and z is green.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red'
        && brain.executeUnwrapped('y')[0].style.background === 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green';
    brain.executeUnwrapped('x and y and z are not red.');
    const assert2 = brain.executeUnwrapped('x')[0].style.background !== 'red'
        && brain.executeUnwrapped('y')[0].style.background !== 'red'
        && brain.executeUnwrapped('z')[0].style.background === 'green';
    return assert1 && assert2;
}
exports.test14 = test14;


/***/ }),

/***/ "./app/tests/tests/test15.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test15.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test15 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test15() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. every button is blue.');
    brain.executeUnwrapped('z is red.');
    brain.executeUnwrapped('every button is not blue.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background !== 'blue'
        && brain.executeUnwrapped('y')[0].style.background !== 'blue'
        && brain.executeUnwrapped('z')[0].style.background === 'red';
    return assert1;
}
exports.test15 = test15;


/***/ }),

/***/ "./app/tests/tests/test16.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test16.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test16 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test16() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button');
    brain.executeUnwrapped('x is hidden');
    const assert1 = brain.executeUnwrapped('x')[0].hidden;
    brain.executeUnwrapped('x is not hidden');
    const assert2 = !brain.executeUnwrapped('x')[0].hidden;
    return assert1 && assert2;
}
exports.test16 = test16;


/***/ }),

/***/ "./app/tests/tests/test17.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test17.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test17 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test17() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button');
    const x = brain.executeUnwrapped('x')[0];
    x.onclick = () => brain.executeUnwrapped('x is red');
    brain.executeUnwrapped('x clicks');
    return x.style.background === 'red';
}
exports.test17 = test17;


/***/ }),

/***/ "./app/tests/tests/test18.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test18.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test18 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test18() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y are red. x is a button and y is a div.');
    brain.executeUnwrapped('every red button is black');
    const assert1 = brain.executeUnwrapped('button')[0].style.background === 'black';
    const assert2 = brain.executeUnwrapped('div')[0].style.background === 'red';
    return assert1 && assert2;
}
exports.test18 = test18;


/***/ }),

/***/ "./app/tests/tests/test2.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test2.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test2 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test2() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    const v1 = brain.context.values.length;
    brain.executeUnwrapped('x is red. x is a button. x is a button. x is a button. x is red.');
    const v2 = brain.context.values.length;
    return v2 - v1 === 1;
}
exports.test2 = test2;


/***/ }),

/***/ "./app/tests/tests/test20.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test20.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test20 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test20() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button. y is a green button if x is red');
    return brain.executeUnwrapped('green button')[0].style.background === 'green';
}
exports.test20 = test20;


/***/ }),

/***/ "./app/tests/tests/test21.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test21.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test21 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test21() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. color of every button is red.');
    return brain.executeUnwrapped('red buttons').length === 3;
}
exports.test21 = test21;


/***/ }),

/***/ "./app/tests/tests/test22.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test22.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test22 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test22() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. background of style of every button is red.');
    return brain.executeUnwrapped('red buttons').length === 3;
}
exports.test22 = test22;


/***/ }),

/***/ "./app/tests/tests/test23.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test23.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test23 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test23() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are red. x and y and z are buttons');
    return brain.executeUnwrapped('red buttons').length === 3;
}
exports.test23 = test23;


/***/ }),

/***/ "./app/tests/tests/test24.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test24.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test24 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test24() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y are red buttons');
    let clicks = '';
    brain.executeUnwrapped('x')[0].onclick = () => clicks += 'x';
    brain.executeUnwrapped('y')[0].onclick = () => clicks += 'y';
    brain.executeUnwrapped('every button clicks');
    return clicks === 'xy';
}
exports.test24 = test24;


/***/ }),

/***/ "./app/tests/tests/test25.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test25.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test25 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test25() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y are buttons. x is red and y is blue');
    brain.executeUnwrapped('the button that is blue is black');
    const assert1 = brain.executeUnwrapped('y')[0].style.background === 'black';
    const assert2 = brain.executeUnwrapped('x')[0].style.background === 'red';
    return assert1 && assert2;
}
exports.test25 = test25;


/***/ }),

/***/ "./app/tests/tests/test26.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test26.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test26 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test26() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons');
    brain.executeUnwrapped('buttons are red');
    return brain.executeUnwrapped('red buttons').length === 3;
}
exports.test26 = test26;


/***/ }),

/***/ "./app/tests/tests/test27.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test27.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test27 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test27() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y and z are buttons. x and y are red. z is blue.');
    brain.executeUnwrapped('red buttons are black');
    const assert1 = brain.executeUnwrapped('z')[0].style.background === 'blue';
    const assert2 = brain.executeUnwrapped('black buttons').length === 2;
    return assert1 && assert2;
}
exports.test27 = test27;


/***/ }),

/***/ "./app/tests/tests/test28.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test28.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test28 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test28() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button');
    brain.executeUnwrapped('border of style of x is dotted-yellow');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red';
    const assert2 = brain.executeUnwrapped('x')[0].style.border.includes('dotted yellow');
    return assert1 && assert2;
}
exports.test28 = test28;


/***/ }),

/***/ "./app/tests/tests/test29.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test29.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test29 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test29() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is 1 and y is 2');
    brain.executeUnwrapped('x adds y');
    return brain.executeUnwrapped('it')[0] === 3;
}
exports.test29 = test29;


/***/ }),

/***/ "./app/tests/tests/test3.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test3.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test3 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test3() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = brain.executeUnwrapped('a red button')[0].style.background === 'red';
    const assert2 = brain.executeUnwrapped('a green button')[0].style.background === 'green';
    const assert3 = brain.executeUnwrapped('a black button')[0].style.background === 'black';
    return assert1 && assert2 && assert3;
}
exports.test3 = test3;


/***/ }),

/***/ "./app/tests/tests/test31.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test31.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test31 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test31() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x and y are buttons. x is green and y is red.');
    const res = brain.executeUnwrapped('color of the red button');
    return res.includes('red') && !res.includes('green');
}
exports.test31 = test31;


/***/ }),

/***/ "./app/tests/tests/test33.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test33.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test33 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test33() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    // brain.executeUnwrapped('x is a red div and the width of style of the div is 50vw')
    brain.executeUnwrapped('x is a red div. the width of style of it is 50vw');
    return brain.executeUnwrapped('red div')[0].style.width === '50vw';
}
exports.test33 = test33;


/***/ }),

/***/ "./app/tests/tests/test35.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test35.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test35 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test35() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button');
    return brain.execute('something button').length === 0;
}
exports.test35 = test35;


/***/ }),

/***/ "./app/tests/tests/test37.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test37.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test37 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test37() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is red');
    brain.execute('x is a button');
    return brain.executeUnwrapped('x')[0].style.background === 'red';
}
exports.test37 = test37;


/***/ }),

/***/ "./app/tests/tests/test38.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test38.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test38 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test38() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are buttons');
    brain.execute('x is red. y is green');
    brain.execute('x appendChilds y');
    brain.execute('z is an x');
    return brain.executeUnwrapped('z')[0].children[0].style.background === 'green';
}
exports.test38 = test38;


/***/ }),

/***/ "./app/tests/tests/test4.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test4.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test4 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test4() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('a button is a button.');
    const button = brain.executeUnwrapped('button');
    return button !== undefined;
}
exports.test4 = test4;


/***/ }),

/***/ "./app/tests/tests/test5.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test5.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test5 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test5() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button. the color of x is red.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red';
    return assert1;
}
exports.test5 = test5;


/***/ }),

/***/ "./app/tests/tests/test6.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test6.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test6 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test6() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button. the background of style of x is green.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'green';
    return assert1;
}
exports.test6 = test6;


/***/ }),

/***/ "./app/tests/tests/test7.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test7.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test7 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test7() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button. y is a button. z is a button. every button is red.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red';
    const assert2 = brain.executeUnwrapped('y')[0].style.background === 'red';
    const assert3 = brain.executeUnwrapped('z')[0].style.background === 'red';
    return assert1 && assert2 && assert3;
}
exports.test7 = test7;


/***/ }),

/***/ "./app/tests/tests/test8.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test8.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test8 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test8() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a button. text of x is capra.');
    const assert1 = brain.executeUnwrapped('button')[0].textContent === 'capra';
    return assert1;
}
exports.test8 = test8;


/***/ }),

/***/ "./app/tests/tests/test9.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test9.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test9 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test9() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button. x is green.');
    const assert1 = brain.executeUnwrapped('red button').length === 0;
    const assert2 = brain.executeUnwrapped('green button').length === 1;
    return assert1 && assert2;
}
exports.test9 = test9;


/***/ }),

/***/ "./app/tests/utils/clearDom.ts":
/*!*************************************!*\
  !*** ./app/tests/utils/clearDom.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearDom = void 0;
function clearDom() {
    const x = document.createElement('body');
    document.body = x;
}
exports.clearDom = clearDom;


/***/ }),

/***/ "./app/tests/utils/sleep.ts":
/*!**********************************!*\
  !*** ./app/tests/utils/sleep.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sleep = void 0;
function sleep(millisecs) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs);
    });
}
exports.sleep = sleep;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFHQUFtQztBQUduQyxrQkFBSSxHQUFFOzs7Ozs7Ozs7Ozs7O0FDSE4sOEdBQWtFO0FBTWxFLE1BQXFCLFVBQVU7SUFJM0IsWUFDYSxJQUFrQixFQUNsQixhQUFrQyxFQUFFO1FBRHBDLFNBQUksR0FBSixJQUFJLENBQWM7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBMEI7UUFJakQsUUFBRyxHQUFHLENBQUMsRUFBTSxFQUFxQixFQUFFO1lBRWhDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFFN0IsSUFBSSxDQUFDLENBQUMsRUFBQztnQkFDSCxPQUFPLFNBQVM7YUFDbkI7WUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekM7WUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sQ0FBQztRQUNaLENBQUM7UUFNRCxRQUFHLEdBQUcsQ0FBQyxPQUFjLEVBQVMsRUFBRTtZQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU87UUFDaEQsQ0FBQztRQUVELFVBQUssR0FBRyxDQUFDLEtBQWEsRUFBUyxFQUFFO1lBRTdCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNO2lCQUN2QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMzQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7WUFFNUMsTUFBTSxJQUFJLEdBQUcsUUFBUTtpQkFDaEIsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFOUMsMkZBQTJGO1lBQzNGLE9BQU8sSUFBSTtRQUNmLENBQUM7SUF4Q0QsQ0FBQztJQW9CRCxJQUFJLE1BQU07UUFDTixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0lBb0JTLGlCQUFpQixDQUFDLGNBQWtCO1FBQzFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYztTQUN2QztJQUNMLENBQUM7Q0FHSjtBQXpERCxnQ0F5REM7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREQsd0hBQXNDO0FBVXRDLFNBQXdCLFNBQVMsQ0FBQyxJQUFtQjtJQUNqRCxPQUFPLElBQUksb0JBQVUsQ0FBQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxDQUFDO0FBQ3JDLENBQUM7QUFGRCwrQkFFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQkQsOEZBQXdEO0FBQ3hELGlKQUE2RDtBQUU3RCw4R0FBeUQ7QUFDekQsOEdBQTRFO0FBQzVFLG1LQUFxRjtBQUNyRix3SUFBc0U7QUFHdEUsK0ZBQThDO0FBQzlDLGtHQUFnRDtBQUVoRCwwRkFBa0M7QUFHbEMsTUFBYSxTQUFTO0lBVWxCLFlBQXFCLElBQWM7UUFBZCxTQUFJLEdBQUosSUFBSSxDQUFVO1FBUjFCLE9BQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsY0FBUyxHQUFlLEVBQUU7UUFDMUIsV0FBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDLFdBQVc7UUFDdEMsV0FBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtRQUN4QixlQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1FBQ2pDLFNBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7UUFrRC9CLGVBQVUsR0FBRyxHQUFHLEVBQUU7WUFFZCxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBRWpDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUV2QixJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNSLE9BQU8sRUFBRTtpQkFDWjtnQkFFRCxNQUFNLEdBQUcsR0FBRyx1QkFBVSxFQUFDO29CQUNuQixJQUFJLEVBQUUsbUJBQU0sRUFBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzVCLElBQUksRUFBRSxDQUFDO29CQUNQLFFBQVEsRUFBRSxLQUFLO2lCQUNsQixDQUFDO2dCQUVGLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEMsQ0FBQyxDQUFDO1FBRU4sQ0FBQztRQTJHRCxlQUFVLEdBQUcsR0FBRyxFQUFFLG1CQUFDLDRCQUFPLEVBQUMsVUFBSSxDQUFDLE1BQU0sbUNBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFPLEVBQUMsZ0JBQUksQ0FBQyxJQUFJLDBDQUFFLE1BQU0sRUFBRSxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBTyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBM0s5RyxDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQU07O1FBRU4sTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDM0IsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVuQixJQUFJLENBQUM7UUFFTCxJQUFJO1lBQ0EsQ0FBQyxHQUFHLFlBQUMsSUFBWSxDQUFDLEVBQUUsQ0FBQyxtQ0FBSSxNQUFDLElBQUksQ0FBQyxNQUFjLDBDQUFHLEVBQUUsQ0FBQyxtQ0FBSSxVQUFJLENBQUMsSUFBSSwwQ0FBRSxHQUFHLENBQUMsRUFBRSxDQUFDO1NBQzVFO1FBQUMsV0FBTTtZQUNKLE9BQU8sU0FBUztTQUNuQjtRQUVELElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDSixPQUFPLFNBQVM7U0FDbkI7UUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN6RyxTQUFTO1FBRVQsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekM7UUFFRCxPQUFPLENBQUM7SUFFWixDQUFDO0lBRUQsSUFBSSxDQUFDLElBQWU7O1FBRWhCLE9BQU8sSUFBSSxTQUFTLENBQUM7WUFDakIsRUFBRSxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLG1DQUFJLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBUSxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN2RCxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsSUFBSSxFQUFFLFVBQUksQ0FBQyxJQUFJLDBDQUFFLElBQUksRUFBRTtTQUMxQixDQUFDO0lBRU4sQ0FBQztJQUVELE1BQU07O1FBQ0YsT0FBTyxVQUFJLENBQUMsTUFBTSxtQ0FBSSxVQUFJLENBQUMsSUFBSSwwQ0FBRSxNQUFNLEVBQUU7SUFDN0MsQ0FBQztJQXVCRCxHQUFHLENBQUMsU0FBZ0IsRUFBRSxJQUFjOztRQUVoQyxNQUFNLFFBQVEsR0FBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksbUNBQUksRUFBRSxFQUFFO1FBRWhFLElBQUksS0FBSyxHQUFlLEVBQUU7UUFDMUIsSUFBSSxPQUFPLEdBQWUsRUFBRTtRQUM1QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV4RSxJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLEVBQUU7WUFDZixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUM7U0FDdkI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDakMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDM0I7YUFBTTtZQUNILEtBQUssR0FBRyxDQUFDLFFBQVEsQ0FBQztZQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RTtRQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUN0RCxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQWlCLEVBQUUsT0FBbUIsRUFBRSxJQUFnQjtRQUUxRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUM7UUFFRixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRVMsYUFBYSxDQUFDLFFBQWtCO1FBQ3RDLE9BQU8sRUFBRSxFQUFDLE1BQU07SUFDcEIsQ0FBQztJQUVTLEVBQUUsQ0FBQyxRQUFrQjtRQUMzQixrRkFBa0Y7UUFFbEYsSUFBSyxRQUFRLENBQUMsU0FBdUIsQ0FBQyxVQUFVLEtBQUssbUJBQVUsRUFBRTtZQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUMzQixPQUFNO1NBQ1Q7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDcEMsQ0FBQztJQUVTLFlBQVksQ0FBQyxRQUFrQjs7UUFDckMsTUFBTSxLQUFLLEdBQUcsVUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMENBQUUsTUFBTSxFQUFFO1FBQ3pDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU07SUFDVixDQUFDO0lBRVMsSUFBSSxDQUFDLFFBQWtCO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUN2QyxDQUFDO0lBRVMsSUFBSSxDQUFDLFFBQWtCO1FBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFUyxXQUFXLENBQUMsUUFBa0I7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFUyxjQUFjLENBQUMsUUFBa0I7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRVMsU0FBUyxDQUFDLFFBQWtCO1FBQ2xDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2VBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVMsT0FBTyxDQUFDLEtBQVk7UUFFMUIsb0RBQW9EO1FBRXBELElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLO0lBRTNCLENBQUM7SUFFUyxVQUFVLENBQUMsUUFBZTs7UUFDaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsRUFBRTtZQUU5QixJQUFJLFdBQUksQ0FBQyxJQUFJLDBDQUFFLE1BQU0sRUFBRSxhQUFZLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLHNCQUFZLEVBQUU7Z0JBQ25GLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSwwQ0FBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNwRDtZQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBSyxDQUFDLElBQUksRUFBRTtZQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLGNBQUs7U0FFMUI7SUFDTCxDQUFDO0lBSUQsUUFBUSxDQUFDLElBQWE7O1FBQ2xCLE1BQU0sQ0FBQyxHQUFHLFVBQUksQ0FBQyxJQUFJLDBDQUFFLE1BQU0sRUFBRTtRQUM3QixJQUFJLENBQUMsWUFBWSxXQUFXLEVBQUU7WUFDMUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUNqRDtJQUNMLENBQUM7SUFHRCx5RUFBeUU7SUFDekUsUUFBUSxDQUFDLEtBQWM7UUFFbkIsTUFBTSxZQUFZLEdBQUcsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksb0JBQVc7UUFDekMsd0dBQXdHO1FBRXhHLE1BQU0sR0FBRyxHQUFHLFlBQVk7YUFDbkIsUUFBUSxFQUFFO2FBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7YUFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsV0FBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFDLENBQUMsU0FBUywwQ0FBRSxRQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUM7YUFDNUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckQsd0JBQXdCO2FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQzthQUN2QyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV0Qyw4QkFBOEI7UUFDOUIsT0FBTyxHQUFHO0lBQ2QsQ0FBQztJQUVTLFNBQVMsQ0FBQyxDQUFTO1FBRXpCLG1HQUFtRztRQUVuRyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSx5Q0FBaUIsRUFBQyxDQUFDLEVBQUUsMEJBQVcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLG9CQUFXO1FBRWpCLDhCQUE4QjtRQUM5QixPQUFPLEdBQUc7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQWMsRUFBRSxZQUFpQixFQUFFOztRQUVyQyxNQUFNLEVBQUUsR0FBRyx5Q0FBaUIsRUFBQyxNQUFNLEVBQUUsMEJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLEVBQUUsMEJBQTBCO1lBRTdDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFNLENBQUMsU0FBUywwQ0FBRSxRQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxpSUFBaUk7Z0JBQ3pNLE9BQU8saUNBQU0sU0FBUyxLQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUc7YUFDM0Q7WUFFRCxPQUFPLEVBQUUsRUFBQyxNQUFNO1NBQ25CO1FBRUQsdUJBQXVCO1FBRXZCLE1BQU0sR0FBRyxHQUFHLDBCQUFXLEVBQUMsTUFBTSxDQUFDO1FBRS9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUU7YUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7UUFFNUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLFFBQUMsT0FBQyxDQUFDLFNBQVMsMENBQUUsSUFBSSxFQUFFLE9BQUMsQ0FBQyxTQUFTLDBDQUFFLEtBQUssQ0FBQyxJQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBVyxDQUFDO1FBRWxJLE1BQU0sUUFBUSxHQUNWLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDWixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7YUFDekQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2QsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBVSxDQUFDO1FBRTdCLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekUsT0FBTyxHQUFHO0lBRWQsQ0FBQztJQUVELCtEQUErRDtJQUcvRCxNQUFNLENBQUMsS0FBWTtRQUNmLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO0lBQ3BELENBQUM7SUFFRCxTQUFTLENBQUMsTUFBZTs7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNO1FBQ3BCLElBQUksV0FBSSxDQUFDLElBQUksMENBQUUsTUFBTSxFQUFFLGFBQVksV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLFlBQVksc0JBQVksRUFBRTtZQUNuRixVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksMENBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEQ7SUFDTCxDQUFDO0NBR0o7QUFuUkQsOEJBbVJDO0FBUUQsU0FBUyxjQUFjLENBQUMsRUFBWSxFQUFFLEVBQVk7SUFDOUMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO1dBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTTtXQUNqQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDelNELG1HQUF1QztBQTZCdkMsU0FBZ0IsSUFBSSxDQUFDLElBQWM7SUFDL0IsT0FBTyxJQUFJLHFCQUFTLENBQUMsSUFBSSxDQUFDO0FBQzlCLENBQUM7QUFGRCxvQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNsQ0QsU0FBZ0IsTUFBTSxDQUFDLENBQVM7SUFFNUIsUUFBUSxPQUFPLENBQUMsRUFBRTtRQUNkLEtBQUssVUFBVTtZQUNYLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztRQUMzQyxLQUFLLFNBQVM7WUFDVixPQUFPLFdBQVc7UUFDdEIsS0FBSyxXQUFXO1lBQ1osT0FBTyxTQUFTO1FBQ3BCO1lBQ0ksT0FBTyxNQUFNO0tBQ3BCO0FBRUwsQ0FBQztBQWJELHdCQWFDOzs7Ozs7Ozs7Ozs7OztBQ2ZELHNGQUFtQztBQUNuQywrRkFBMEM7QUFDMUMsc0ZBQW1DO0FBQ25DLHlGQUEyRDtBQUMzRCwyR0FBcUQ7QUFDckQsbUZBQWlDO0FBR2pDLFNBQWdCLFNBQVM7SUFFckIsT0FBTztRQUNILFdBQVcsRUFBWCx3QkFBVztRQUNYLE9BQU8sRUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QixNQUFNLENBQUMsR0FBRyx1QkFBVSxFQUFDLENBQUMsQ0FBQztZQUN2QixPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLENBQUMsQ0FBQztRQUNGLFFBQVEsRUFBUixtQkFBUTtRQUNSLE9BQU8sRUFBUCxpQkFBTztRQUNQLG9CQUFvQixFQUFwQiwrQkFBb0I7UUFDcEIsTUFBTSxFQUFOLGVBQU07S0FDVDtBQUNMLENBQUM7QUFiRCw4QkFhQzs7Ozs7Ozs7Ozs7Ozs7QUNwQkQsaUhBQXdEO0FBSTNDLG1CQUFXLEdBQUcsbUNBQWMsRUFDdkMsV0FBVyxFQUNYLGFBQWEsRUFDYixRQUFRLEVBQ1IsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGFBQWEsRUFDYixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFBRSxVQUFVO0FBQ3hCLFNBQVMsRUFBRSx1QkFBdUI7QUFDbEMsU0FBUyxDQUVWOzs7Ozs7Ozs7Ozs7OztBQzdCRCwyR0FBOEQ7QUFDOUQsbUZBQTBGO0FBRTFGLE1BQU0sS0FBSyxHQUFXLHVCQUFVLEVBQUM7SUFDN0IsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsTUFBTSxLQUFLLEdBQW9CO0lBQzNCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLE9BQU87Q0FDaEI7QUFFRCxNQUFNLEdBQUcsR0FBVyx1QkFBVSxFQUFDO0lBQzNCLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLFVBQVU7Q0FDbkIsQ0FBQztBQUdXLGVBQU8sR0FBaUM7SUFFakQsS0FBSztJQUNMLEtBQUs7SUFDTCxHQUFHO0lBRUgsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRTtJQUM3QyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ2hELEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUU7SUFFL0MsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDaEMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRTtJQUMzRCxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQzVELEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDN0QsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDdEMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDeEMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDckMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0lBQ3BFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFO0lBQ25DLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQ25DLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQ3BDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQ3hDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQzFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQy9CLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ2hDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0lBQy9CLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0lBQy9CLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0lBQ2pDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ2pDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ25DLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO0lBQ25DLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0lBQ2pDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO0lBQy9CLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxjQUFLLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG9CQUFXLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGlCQUFRLEVBQUU7SUFDakQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG1CQUFVLEVBQUU7SUFDckQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGlCQUFRLEVBQUU7SUFDakQsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG1CQUFVLEVBQUU7Q0FFeEQ7Ozs7Ozs7Ozs7Ozs7O0FDN0RZLGVBQU8sR0FBYTtJQUUzQixVQUFVO0lBQ1Ysc0NBQXNDO0lBQ3RDLCtCQUErQjtJQUMvQixtREFBbUQ7SUFFbkQ7OzttQ0FHNkI7SUFFN0I7Ozs7O3VDQUtpQztJQUVqQyxtRUFBbUU7SUFDbkUsK0RBQStEO0lBQy9ELGdEQUFnRDtJQUVoRDs7OEVBRXdFO0lBRXhFOzs7OzBCQUlvQjtJQUVwQjs7O2FBR087SUFFUCx3RUFBd0U7SUFFeEU7O3FDQUUrQjtJQUUvQjs7O3FDQUcrQjtJQUUvQixTQUFTO0lBQ1Qsc0JBQXNCO0lBQ3RCLDREQUE0RDtJQUU1RCxvREFBb0Q7SUFDcEQsaURBQWlEO0lBQ2pELDJDQUEyQztDQUNoRDs7Ozs7Ozs7Ozs7Ozs7QUN0REQsaUhBQXdEO0FBSTNDLHdCQUFnQixHQUFHLG1DQUFjLEVBQzFDLE9BQU8sRUFDUCxXQUFXLEVBQ1gsYUFBYSxDQUNoQjtBQUVZLDRCQUFvQixHQUFHLHdCQUFnQixDQUFDLE1BQU0sRUFBRTtBQUVoRCxnQkFBUSxHQUFjO0lBRS9CLE9BQU8sRUFBRTtRQUNMLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUN6RCxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDL0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0tBQ3ZDO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUN0QyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7S0FDdEM7SUFDRCxhQUFhLEVBQUU7UUFDWCxFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDaEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ3ZDO0NBRUo7Ozs7Ozs7Ozs7Ozs7O0FDOUJELHNHQUE2QztBQUVoQyxhQUFLLEdBQUcsZ0JBQUksRUFBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN6RCxtQkFBVyxHQUFHLGdCQUFJLEVBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN6RSxnQkFBUSxHQUFHLGdCQUFJLEVBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEUsa0JBQVUsR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDOUMsZ0JBQVEsR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDN0Msa0JBQVUsR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDaEUsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQVUsQ0FBQztBQUN4QixrQkFBVSxDQUFDLEdBQUcsQ0FBQyxrQkFBVSxDQUFDO0FBR2IsY0FBTSxHQUFHO0lBQ2xCLGFBQUs7SUFDTCxlQUFlO0lBQ2YsWUFBWTtJQUNaLGtCQUFVO0lBQ1YsZ0JBQVE7SUFDUixrQkFBVTtDQUNiOzs7Ozs7Ozs7Ozs7O0FDbkJELHNJQUFvRTtBQUNwRSxpR0FBK0M7QUFLL0MsTUFBcUIsVUFBVTtJQUUzQixZQUNhLE9BQWdCO1FBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFFekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQWU7UUFDbkIsT0FBTyxzQkFBUyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRXpELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsT0FBTyxFQUFFO2FBQ1o7WUFFRCxNQUFNLEdBQUcsR0FBRyxxQkFBTyxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsT0FBTyxHQUFHO1FBRWQsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2IsQ0FBQztJQUVELGdCQUFnQixDQUFDLE9BQWU7UUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLG9CQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSwrQ0FBVCxDQUFDLENBQVksbUNBQUksQ0FBQyxJQUFDO0lBQzdELENBQUM7Q0FFSjtBQTVCRCxnQ0E0QkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbENELHVHQUErRDtBQUMvRCxzSEFBcUM7QUFZckMsU0FBZ0IsUUFBUSxDQUFDLElBQWtCO0lBQ3ZDLE9BQU8sSUFBSSxvQkFBVSxDQUFDLHdCQUFVLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUZELDRCQUVDOzs7Ozs7Ozs7Ozs7O0FDZkQsOEZBQStDO0FBRS9DLDhHQUFnRTtBQUdoRSxxSUFBbUU7QUFDbkUscUlBQW1FO0FBR25FLE1BQXFCLFlBQVk7SUFjN0IsWUFBcUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFaMUIsV0FBTSxHQUFHLHNCQUFTLEdBQUU7UUFDVix5QkFBb0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQjtRQUN2RCxjQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1FBQ3pDLGdCQUFXLEdBQW9CLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDbkQsYUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztRQUMvQixZQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1FBQzdCLGdCQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1FBQ3JDLFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDckIsVUFBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztRQUN6QixTQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1FBQ3ZCLFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7UUF1QjlCLGNBQVMsR0FBRyxDQUFDLFdBQW1CLEVBQXNCLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUMsUUFBUTtpQkFDZixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztpQkFDOUQsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7UUFpQkQsY0FBUyxHQUFHLENBQUMsS0FBYyxFQUFFLEVBQUU7WUFDM0IsTUFBTSxNQUFNLEdBQUcsaUNBQWEsRUFBQyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBcUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNO1lBQzVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUMzQyxDQUFDO1FBRUQsY0FBUyxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7O1lBQzFCLE9BQU8sVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFxQixDQUFDLG1DQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyw0Q0FBNEM7UUFDOUgsQ0FBQztRQUVELGNBQVMsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBRTNCLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQzthQUNwRTtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQTNERyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUV0QixJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUFVLEVBQUM7Z0JBQ3RCLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxTQUFTO2FBQ2xCLENBQUMsQ0FBQztRQUVQLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLENBQUMsQ0FBQztJQUVOLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtJQUM3QixDQUFDO0lBUVMsYUFBYTtRQUNuQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQW9CO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBYSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXO0lBQzNCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRO0lBQ3hCLENBQUM7SUF1QkQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1FBQzlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDdEMsT0FBTyxHQUFHO0lBQ2QsQ0FBQztDQUVKO0FBbkZELGtDQW1GQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RkQsK0hBQThFO0FBTTlFLDhIQUEwQztBQWlCMUMsU0FBZ0IsVUFBVSxDQUFDLElBQW9CO0lBQzNDLE9BQU8sSUFBSSxzQkFBWSxDQUFDLG9CQUFTLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUZELGdDQUVDOzs7Ozs7Ozs7Ozs7O0FDeEJELHlJQUErRDtBQUMvRCx3SEFBaUQ7QUFDakQsd0hBQWlEO0FBQ2pELDJGQUE2QztBQUU3QyxNQUFxQixVQUFVO0lBWTNCLFlBQ2EsT0FBeUI7O1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBWHRDLFVBQUssR0FBRyxVQUFJLENBQUMsT0FBTywwQ0FBRSxLQUFLO1FBQ2xCLFNBQUksR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsSUFBSSxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxJQUFLO1FBQzlDLFNBQUksR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsSUFBSSxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxJQUFLO1FBQ3ZELG1CQUFjLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLGNBQWMsbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsY0FBYztRQUMzRSxVQUFLLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLEtBQUssbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsS0FBSztRQUNoRCxnQkFBVyxHQUFHLGdCQUFJLENBQUMsT0FBTywwQ0FBRSxXQUFXLG1DQUFJLFVBQUksQ0FBQyxLQUFLLDBDQUFFLFdBQVc7UUFDekQsV0FBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTztRQUN2RCxhQUFRLEdBQUcsOEJBQVksRUFBQyxVQUFJLENBQUMsT0FBTywwQ0FBRSxXQUFXLENBQUM7UUFDbEQsYUFBUSxHQUFHLGdCQUFJLENBQUMsT0FBTywwQ0FBRSxRQUFRLG1DQUFJLFVBQUksQ0FBQyxLQUFLLDBDQUFFLFFBQVE7SUFJOUQsQ0FBQztJQUVMLFdBQVcsQ0FBQyxPQUFpQjtRQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckUsT0FBTyxDQUFDLHVCQUFVLEVBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSx5QkFBUyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUMvRztRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8seUJBQVMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQVUsRUFBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDdkc7UUFFRCxPQUFPLEVBQUU7SUFDYixDQUFDO0NBRUo7QUE3QkQsZ0NBNkJDOzs7Ozs7Ozs7Ozs7O0FDaENELG9JQUEwRDtBQUUxRCxNQUFxQixVQUFVO0lBSzNCLFlBQXFCLFVBQWtCLEVBQVcsT0FBZ0I7UUFBN0MsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFXLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFGeEQsU0FBSSxHQUFXLENBQUM7UUFJdEIsTUFBTSxLQUFLLEdBQ1AsVUFBVTthQUNMLElBQUksRUFBRTthQUNOLEtBQUssQ0FBQyxRQUFRLENBQUM7YUFDZixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOztZQUM1QixNQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxpQ0FBYSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO1lBQ3BFLE9BQU8sU0FBRyxDQUFDLGNBQWMsbUNBQUksQ0FBQyxHQUFHLENBQUM7UUFDdEMsQ0FBQyxDQUFDO0lBRU4sQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsSUFBSSxFQUFFO0lBQ2YsQ0FBQztJQUVELElBQUksR0FBRztRQUNILE9BQU8sSUFBSSxDQUFDLElBQUk7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHO0lBQ25CLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQWdCO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxRQUFRLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07SUFDekMsQ0FBQztDQUVKO0FBNUNELGdDQTRDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q0Qsd0hBQXFDO0FBa0JyQyxTQUFnQixVQUFVLENBQUMsSUFBOEI7SUFFckQsSUFBSSxJQUFJLFlBQVksb0JBQVUsRUFBRTtRQUM1QixPQUFPLElBQUk7S0FDZDtJQUVELE9BQU8sSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQztBQUMvQixDQUFDO0FBUEQsZ0NBT0M7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0JELHdIQUFxQztBQVlyQyxTQUFnQixRQUFRLENBQUMsVUFBa0IsRUFBRSxPQUFnQjtJQUN6RCxPQUFPLElBQUksb0JBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0FBQzlDLENBQUM7QUFGRCw0QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxTQUFnQixTQUFTLENBQUMsSUFBVztJQUNqQyxPQUFPLENBQUMsSUFBSSxHQUFDLEdBQUcsQ0FBQztBQUNyQixDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDQUQsNEZBQThDO0FBRzlDLFNBQWdCLGFBQWEsQ0FBQyxJQUFZLEVBQUUsT0FBZ0IsRUFBRSxLQUFlOztJQUd6RSxNQUFNLFFBQVE7SUFDVixRQUFRO0lBQ1Isc0VBQXNFO0lBQ3RFLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsNENBQTRDO0lBQzVDLE9BQU8sQ0FBQyxNQUFNO1NBQ1QsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBRXpELDhEQUE4RDtJQUU5RCxNQUFNLGNBQWMsR0FDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLHFCQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLE1BQUssU0FBUyxJQUFDO1dBQ3RELENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLFFBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBVyxDQUFDLElBQUMsa0RBQWdEO0lBRXpKLE1BQU0sSUFBSSxHQUFHLG9CQUFRLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksbUNBQzFCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDYixTQUFTO1FBQ1QsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUVqQix5REFBeUQ7SUFFekQsT0FBTyx1QkFBVSxFQUFDO1FBQ2QsS0FBSyxFQUFFLElBQUk7UUFDWCxJQUFJLEVBQUUsb0JBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksbUNBQUksSUFBSTtRQUNuQyxJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxjQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxRQUFRO0tBQ3JDLENBQUM7QUFDTixDQUFDO0FBaENELHNDQWdDQzs7Ozs7Ozs7Ozs7Ozs7QUNyQ0QsU0FBZ0IsU0FBUyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLEdBQUcsR0FBRztBQUNyQixDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDQUQsaUlBQW9FO0FBSXBFLCtGQUF5QztBQUl6QyxNQUFhLFVBQVU7SUFFbkIsWUFDdUIsVUFBa0IsRUFDbEIsT0FBZ0IsRUFDaEIsUUFBUSxvQkFBUSxFQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7UUFGckMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFVBQUssR0FBTCxLQUFLLENBQWdDO1FBNENsRCxlQUFVLEdBQUcsQ0FBQyxJQUFhLEVBQUUsSUFBVyxFQUF1QixFQUFFO1lBRXZFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUU1QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFxQixFQUFFLElBQUksQ0FBQzthQUMxRDtRQUVMLENBQUM7UUFFUyxjQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQXVCLEVBQUU7WUFFckQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO2dCQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDakIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7YUFDckM7UUFFTCxDQUFDO1FBRVMsbUJBQWMsR0FBRyxDQUFDLElBQW1CLEVBQUUsSUFBVyxFQUF1QixFQUFFOztZQUVqRixNQUFNLEtBQUssR0FBUSxFQUFFO1lBRXJCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUUvQixJQUFJLENBQUMsR0FBRyxJQUFJLDZCQUFXLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUMvQixPQUFPLFNBQVM7aUJBQ25CO2dCQUVELElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ04sU0FBUTtpQkFDWDtnQkFFRCxLQUFLLENBQUMsT0FBQyxDQUFDLElBQUksbUNBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUc7YUFFbEM7WUFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxTQUFTO2FBQ25CO1lBRUQsT0FBTztnQkFDSCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsS0FBSzthQUNmO1FBQ0wsQ0FBQztRQUVTLGdCQUFXLEdBQUcsQ0FBQyxDQUFTLEVBQUUsSUFBVyxFQUF1QixFQUFFO1lBRXBFLE1BQU0sSUFBSSxHQUFjLEVBQUU7WUFFMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUV0QixJQUFJLENBQUMsOEJBQVksRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7b0JBQzdDLE1BQUs7aUJBQ1I7Z0JBRUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBRXZDLElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQ0osTUFBSztpQkFDUjtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNmO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDbkIsT0FBTyxTQUFTO2FBQ25CO1lBRUQsT0FBTyw4QkFBWSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUNsQixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVoQixDQUFDO1FBRVMsV0FBTSxHQUFHLENBQUMsQ0FBVSxFQUFFLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBZSxDQUFDO1FBQzdELENBQUM7SUEvSEQsQ0FBQztJQUVELFFBQVE7O1FBRUosTUFBTSxPQUFPLEdBQWMsRUFBRTtRQUU3QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFFdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztZQUVsRCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNOLE1BQUs7YUFDUjtZQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQyxJQUFJLFdBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSwwQ0FBRSxJQUFJLE1BQUssVUFBVSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTthQUNwQjtTQUVKO1FBRUQsT0FBTyxPQUFPO0lBQ2xCLENBQUM7SUFHUyxRQUFRLENBQUMsS0FBZ0IsRUFBRSxJQUFXO1FBRTVDLEtBQUssTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFO1lBRW5CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztZQUM5QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7WUFFbEMsSUFBSSxDQUFDLEVBQUU7Z0JBQ0gsT0FBTyxDQUFDO2FBQ1g7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7U0FDN0I7SUFFTCxDQUFDO0lBeUZTLFFBQVEsQ0FBQyxHQUFZO1FBRTNCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQ1osT0FBTyxHQUFHO1NBQ2I7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBRS9DLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM5RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEQ7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNO2FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO2FBQ2xCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsQ0FBQztRQUV2Qyx1Q0FBWSxHQUFHLEtBQUUsS0FBSyxFQUFFLFdBQVcsSUFBRTtJQUV6QyxDQUFDO0NBRUo7QUE3SkQsZ0NBNkpDOzs7Ozs7Ozs7Ozs7OztBQ2xLTSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyx1QkFBdUI7T0FDaEYsQ0FBQyxJQUFJLEdBQUc7T0FDUixDQUFDLENBQUMsSUFBSSxDQUFDO0FBRkQsbUJBQVcsZUFFVjtBQUVQLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRztPQUNsRCxDQUFDLElBQUksR0FBRztBQURGLG9CQUFZLGdCQUNWOzs7Ozs7Ozs7Ozs7OztBQ1RmLHlHQUEwQztBQU8xQyxTQUFnQixTQUFTLENBQUMsVUFBa0IsRUFBRSxPQUFnQjtJQUMxRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO0FBQzlDLENBQUM7QUFGRCw4QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCxTQUFnQixhQUFhLENBQUMsS0FBYzs7SUFFeEMsTUFBTSxVQUFVLEdBQUcsdUJBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLDBDQUFFLFNBQVMsMENBQUUsSUFBSSxtQ0FBSSxFQUFFO0lBQ3RELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxNQUFNLElBQUksR0FBRyx1QkFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssMENBQUUsT0FBTywwQ0FBRSxNQUFNLDBDQUFFLElBQUk7SUFFaEQsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUM7S0FDdkM7SUFFRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUMzQixDQUFDO0FBWEQsc0NBV0M7QUFFRCxTQUFTLGlCQUFpQixDQUFDLFNBQWtCOztJQUV6QyxNQUFNLGNBQWMsR0FBRywyQkFBUyxDQUFDLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDN0QsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLG1DQUFJLEVBQUUsSUFBQztJQUU5RCxNQUFNLFlBQVksR0FBRywyQkFBUyxDQUFDLEtBQUssMENBQUUsV0FBVywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDN0QsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sSUFBQztJQUV4RCxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUN2RCxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBRXZELE9BQU87UUFDSCxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLGFBQUMsT0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFFLE1BQU0sMENBQUUsSUFBZ0IsbUNBQUksRUFBRSxJQUFDO1FBQy9ELElBQUksRUFBRSxjQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFZO1FBQ2xDLE1BQU0sRUFBRSxlQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxXQUFXO0tBQ3ZDO0FBRUwsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUM5Qk0sTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFnQixFQUFFLENBQWdCLEVBQUUsUUFBbUIsRUFBRSxFQUFFOztJQUVyRixPQUFPLHFCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQ0FDbEIsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsbUNBQ2pDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztBQUVsQyxDQUFDO0FBTlkscUJBQWEsaUJBTXpCO0FBRUQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFVLEVBQUUsQ0FBVSxFQUFFLEVBQUU7SUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakMsQ0FBQztBQUVELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxDQUFnQixFQUFFLENBQWdCLEVBQUUsUUFBbUIsRUFBRSxFQUFFO0lBRWxGLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RCxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFekQsSUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO1FBQzdCLE9BQU8sU0FBUztLQUNuQjtJQUVELE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUvQixDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLENBQWdCLEVBQUUsUUFBbUIsRUFBRSxVQUFxQixFQUFFOztJQUV2RixNQUFNLE9BQU8sR0FBRyxjQUFRLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUU7SUFFakMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUU1QyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckIsT0FBTyxFQUFFO1NBQ1o7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFrQixFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdEY7SUFFTCxDQUFDLENBQUM7QUFFTixDQUFDO0FBZEQsb0NBY0M7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFDM0UsT0FBTyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE1BQU07QUFDOUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlDRCxxSEFBK0M7QUFDL0Msb0dBQWdEO0FBRWhELFNBQXdCLElBQUk7SUFFeEIsTUFBTSxLQUFLLEdBQUc7UUFDVixLQUFLLEVBQUUsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsYUFBYSxFQUFFLEtBQUs7S0FDdkI7SUFFRCxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUU7UUFDaEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhO1FBQ3RDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7SUFDbkQsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTTtJQUM3QixRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLO0lBQzdCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSTtJQUN0QixRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRO0lBQ2xDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUc7SUFDeEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTTtJQUM5QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXZELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQU0sQ0FBQyxFQUFDLEVBQUU7UUFFaEQsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ2pDLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYTtTQUM3QzthQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUN4QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDdEI7YUFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7WUFDdkMsTUFBTSx3QkFBVSxHQUFFO1lBQ2xCLElBQUksRUFBRTtTQUNUO1FBRUQsTUFBTSxFQUFFO0lBQ1osQ0FBQyxFQUFDLENBQUM7SUFFRixNQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLO0FBQ3ZDLENBQUM7QUF2Q0QsMEJBdUNDOzs7Ozs7Ozs7Ozs7Ozs7O0FDMUNELDJGQUE2RTtBQUU3RSxpSEFBa0Q7QUFFbEQseUdBQTRCO0FBQzVCLHdHQUFvRDtBQUNwRCxzRkFBd0M7QUFDeEMsd0hBQWtEO0FBRWxELE1BQXFCLEdBQUc7SUFNcEIsWUFDYSxPQUFlLEVBQ2YsT0FBZSxFQUNmLGlCQUFpQixLQUFLLEVBQ3RCLFVBQVUsS0FBSztRQUhmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQVJuQixhQUFRLEdBQUcsMkJBQVUsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN2RixhQUFRLEdBQUcsZUFBSSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLG1CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBVztRQTZCcEQsWUFBTyxHQUFHLENBQUMsVUFBa0IsRUFBVSxFQUFFLENBQUMsSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztRQUNyRSxZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQXRCeEYsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYzs7UUFDN0IsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQWU7O1FBQ2hCLE9BQU8sSUFBSSxHQUFHLENBQ1YsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3hDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN4QyxJQUFJLENBQUMsY0FBYyxFQUNuQixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUMvQjtJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ0osTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7UUFDbkUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzNDLENBQUM7SUFNRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0YsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzFGLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWEsRUFBRSxJQUFnQjs7UUFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvQyxNQUFNLEVBQUUsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsRUFBRSxtQ0FBSSxxQkFBTyxFQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsRUFBQyxPQUFPO1FBRWpFLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDeEMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRTtRQUNsQyxNQUFNLElBQUksR0FBRyx5QkFBUyxFQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7UUFFL0MsTUFBTSxPQUFPLEdBQVEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGVBQUMsQ0FBQyxTQUFTLDBDQUFFLElBQUksTUFBSyxTQUFTLElBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxRQUFDLEVBQUUsQ0FBQyxPQUFDLENBQUMsSUFBSSwwQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBQztRQUN2SixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsaURBQWlEO1FBRXJILE9BQU8sR0FBRztJQUNkLENBQUM7SUFFRCxJQUFJLE1BQU07UUFFTixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBRTlCLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxvQkFBVyxDQUFDLFFBQVEsRUFBRTtZQUN0QyxPQUFPLEVBQUU7U0FDWjtRQUVELElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxvQkFBVyxDQUFDLFFBQVEsRUFBRTtZQUN0QyxPQUFPLEVBQUU7U0FDWjtRQUVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBRWxELENBQUM7Q0FFSjtBQWpGRCx5QkFpRkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUZELDJGQUFrRTtBQUdsRSx5R0FBNEI7QUFDNUIsbUdBQXdCO0FBRXhCLHNGQUF3QztBQUN4Qyx3R0FBb0Q7QUFFcEQsTUFBYSxVQUFVO0lBVW5CLFlBQ2EsU0FBaUIsRUFDakIsSUFBVSxFQUNWLFVBQVUsS0FBSztRQUZmLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFYbkIsV0FBTSxHQUFHLElBQUk7UUFDYixVQUFLLEdBQUcsSUFBSTtRQUNaLFVBQUssR0FBRyxvQkFBVztRQUNuQixhQUFRLEdBQUcsZUFBSSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDMUIsYUFBUSxHQUFHLDJCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakgsbUJBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLG9CQUFXO1FBV3BELFNBQUksR0FBRyxDQUFDLElBQWUsRUFBRSxFQUFFOztZQUFDLFdBQUksVUFBVSxDQUN0QyxJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsdUJBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxHQUFHLDBDQUFHLENBQUMsQ0FBQyxtQ0FBSSxDQUFDLElBQUMsRUFDdkMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FDL0I7U0FBQTtRQUVELFFBQUcsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjLEVBQVUsRUFBRSxXQUFDLFdBQUksYUFBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksS0FBSyxDQUFDO1FBQzdGLFlBQU8sR0FBRyxDQUFDLFVBQWtCLEVBQVUsRUFBRSxDQUFDLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7UUFDckUsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLFlBQU8sR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMvRixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFaaEcsQ0FBQztJQWNELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUc7UUFDbEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYTtRQUVmLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxVQUFVLENBQUMsRUFBRTtZQUNoQyxPQUFPLEVBQUU7U0FDWjtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDOUMsT0FBTyxFQUFFO1NBQ1o7UUFFRCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSTthQUNqQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLENBQUM7UUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUNoQixDQUFDO0NBRUo7QUFwREQsZ0NBb0RDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdERCx1R0FBeUM7QUFHekMsMkhBQXVDO0FBNkJ2QyxTQUFnQixRQUFRLENBQUMsU0FBaUIsRUFBRSxHQUFHLElBQVU7SUFDckQsT0FBTyxJQUFJLHVCQUFVLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztBQUMxQyxDQUFDO0FBRkQsNEJBRUM7QUFFWSxtQkFBVyxHQUFXLElBQUkscUJBQVcsRUFBRTs7Ozs7Ozs7Ozs7OztBQ2hDcEQsTUFBcUIsV0FBVztJQUFoQztRQUVhLGFBQVEsR0FBRyxDQUFDO1FBQ1osYUFBUSxHQUFHLEVBQUU7UUFDYixVQUFLLEdBQUcsSUFBSTtRQUNaLFVBQUssR0FBRyxJQUFJO1FBQ1osV0FBTSxHQUFHLElBQUk7UUFDYixtQkFBYyxHQUFHLEtBQUs7UUFFL0IsU0FBSSxHQUFHLENBQUMsSUFBZSxFQUFVLEVBQUUsQ0FBQyxJQUFJO1FBQ3hDLFFBQUcsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjLEVBQVUsRUFBRSxDQUFDLEtBQUs7UUFDdEQsWUFBTyxHQUFHLENBQUMsVUFBa0IsRUFBVSxFQUFFLENBQUMsVUFBVTtRQUNwRCxhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTtRQUNuQixZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLEVBQUU7UUFDOUIsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLFVBQUssR0FBRyxDQUFDLE1BQWMsRUFBUyxFQUFFLENBQUMsRUFBRTtRQUNyQyxhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTtJQUV2QixDQUFDO0NBQUE7QUFsQkQsaUNBa0JDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdEJELDJGQUFrRTtBQUdsRSxtR0FBd0I7QUFFeEIsd0dBQW9EO0FBQ3BELHNGQUF3QztBQUV4QyxNQUFxQixLQUFLO0lBT3RCLFlBQ2EsU0FBaUIsRUFDakIsV0FBbUIsRUFDbkIsVUFBVSxLQUFLLEVBQ2YsUUFBaUI7UUFIakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQVRyQixVQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDdEIsVUFBSyxHQUFHLElBQUksQ0FBQyxXQUFXO1FBQ3hCLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdGLG1CQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBVztRQVdwRCxTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQUUsRUFBRTs7WUFBQyxXQUFJLEtBQUssQ0FDakMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzFDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM1QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxtQ0FBSSxJQUFJLENBQUMsT0FBTyxFQUM1QixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxDQUNsQztTQUFBO1FBT0QsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLFFBQUcsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjLEVBQVUsRUFBRSxXQUFDLFdBQUksYUFBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksS0FBSyxDQUFDO1FBQzdGLFlBQU8sR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBakJ4RixDQUFDO0lBU0QsUUFBUTs7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLGdCQUFJLENBQUMsUUFBUSwwQ0FBRSxJQUFJLG1DQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDM0csT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFPRCxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPLENBQUMsVUFBa0I7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtZQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNO1NBQ25DLENBQUM7SUFDTixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxlQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNKO0FBbkRELDJCQW1EQzs7Ozs7Ozs7Ozs7Ozs7QUN4REQsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE1BQVU7SUFFeEQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFNUMsT0FBTyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVwRSxDQUFDO0FBUkQsOENBUUM7Ozs7Ozs7Ozs7Ozs7O0FDVkQseUZBQTJDO0FBQzNDLGlIQUEyRDtBQUMzRCxpRkFBeUM7QUFHekM7OztHQUdHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLFNBQW1CLEVBQUUsWUFBc0I7SUFFakUsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUM7SUFFMUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBRTFCLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3JDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2dCQUM5QixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDbEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU07YUFDekI7UUFFTCxDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7SUFFRixPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBakJELDhCQWlCQztBQUVELFNBQVMsY0FBYyxDQUFDLFNBQW1CLEVBQUUsWUFBc0I7SUFDL0QsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsR0FBVSxFQUFFLEdBQVU7SUFFakMsTUFBTSxNQUFNLEdBQVUsRUFBRTtJQUV4QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUViLElBQUksU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDbkIsTUFBTSxDQUFDLElBQUksaUNBQU0sRUFBRSxHQUFLLEVBQUUsRUFBRzthQUNoQztRQUVMLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLE9BQU8sZUFBSSxFQUFDLE1BQU0sQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsRUFBTyxFQUFFLEVBQU87SUFDL0IsTUFBTSxVQUFVLEdBQUcsK0JBQVksRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakUsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsQ0FBUztJQUM3QixPQUFPLENBQUMsQ0FBQyxRQUFRO1NBQ1osR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDMUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBQztBQUMvQyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsR0FBUTtJQUN6QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQVUsQ0FBQyxVQUFVLENBQUM7QUFDN0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNoRUQsU0FBZ0IsV0FBVyxDQUFDLE1BQWM7SUFDdEMsT0FBTyxNQUFNO1NBQ1IsUUFBUTtTQUNSLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFORCxrQ0FNQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCxzR0FBcUQ7QUFHckQsbUdBQWlFO0FBQ2pFLDJJQUFtRTtBQUluRSxTQUFnQixPQUFPLENBQUMsT0FBZ0IsRUFBRSxHQUFhLEVBQUUsSUFBbUI7O0lBRXhFLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsTUFBTSxFQUFFO1FBQ3BCLE9BQU8sa0JBQWtCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDaEQ7U0FBTSxJQUFJLGdCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxLQUFLLDBDQUFFLE1BQU0sTUFBSSxlQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxLQUFLLDBDQUFFLE1BQU0sR0FBRTtRQUMvRCxPQUFPLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzlDO1NBQU0sSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLEVBQUU7UUFDNUIsT0FBTyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNqRDtTQUFNLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsVUFBVSxFQUFFO1FBQy9CLE9BQU8sb0JBQW9CLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDbEQ7U0FBTTtRQUNILE9BQU8sY0FBYyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsMEJBQTBCO0tBQ3hFO0FBQ0wsQ0FBQztBQWJELDBCQWFDO0FBR0QsU0FBUyxrQkFBa0IsQ0FBQyxPQUFnQixFQUFFLEdBQWEsRUFBRSxJQUFtQjs7SUFFNUUsTUFBTSxTQUFTLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksdUNBQWdCLEdBQUU7SUFDckQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3JHLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQUMsc0RBQW9EO0lBRWhLLHFHQUFxRztJQUNyRyxvQkFBb0I7SUFFcEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNoQixTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOztZQUM3QixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUMsQ0FBQyxTQUFTLDBDQUFFLFFBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsUUFBUSxHQUFFLENBQUM7UUFDdEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUMsQ0FBQztJQUVGLE9BQU8sRUFBRSxRQUFNO0FBQ25CLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWdCLEVBQUUsR0FBYSxFQUFFLElBQW1CO0lBQzFFLE1BQU0sT0FBTztBQUNqQixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLEdBQWEsRUFBRSxJQUFtQjtJQUM3RSxNQUFNLE9BQU87QUFDakIsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsT0FBZ0IsRUFBRSxHQUFhLEVBQUUsSUFBbUI7SUFDOUUsTUFBTSxPQUFPO0FBQ2pCLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFnQixFQUFFLEdBQWEsRUFBRSxJQUFtQjs7SUFFeEUsTUFBTSxFQUFFLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztJQUV4QyxnREFBZ0Q7SUFDaEQsK0JBQStCO0lBQy9CLHdCQUF3QjtJQUN4QixNQUFNLFlBQVksR0FBRyxNQUFFLE9BQWUsQ0FBQyxZQUF1QixtQ0FBSSxvQkFBVztJQUM3RSxNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBa0IsOENBQThDO0lBRTlILE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRS9DLDZGQUE2RjtJQUM1RixPQUFlLENBQUMsWUFBWSxHQUFHLEVBQUU7SUFFbEMsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFVLENBQUMsQ0FBQztJQUU3RixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLDREQUE0RDtRQUM3RSxPQUFPLE1BQU07S0FDaEI7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSwyQ0FBMkM7UUFDNUQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBRW5FLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEdBQWEsRUFBRSxJQUFtQjs7SUFFMUQsTUFBTSxTQUFTLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksdUNBQWdCLEdBQUU7SUFDckQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztJQUNsSyxNQUFNLEtBQUssR0FBRyxDQUFDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO0lBQzNKLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssbUNBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsS0FBSywwQ0FBRSxXQUFXLElBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7SUFFeFAsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDN0MsaUJBQWlCO0FBRXJCLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEdBQWEsRUFBRSxJQUFtQjs7SUFFMUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQVE7SUFDaEMsTUFBTSxRQUFRLEdBQUcsdUNBQWdCLEdBQUU7SUFDbkMsTUFBTSxXQUFXLEdBQUcsZUFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsV0FBVywwQ0FBRSxNQUFPO0lBQ3BELE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFFckcsT0FBTyxxQkFBUSxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUVqRSxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFhLEVBQUUsSUFBbUI7SUFDOUQsT0FBTyxvQkFBVyxFQUFDLE9BQU87QUFDOUIsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQWE7O0lBRTNCLE9BQU8sc0JBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLElBQUksMENBQUUsTUFBTSwwQ0FBRSxRQUFRO1lBQ2xDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLE1BQU0sMENBQUUsUUFBUTtZQUN2QyxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsSUFBSSwwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLDBDQUFFLFFBQVEsSUFBQztZQUNyRCxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLDBDQUFFLFFBQVEsSUFBQztZQUMxRCxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsT0FBTywwQ0FBRSxJQUFJLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLDBDQUFFLFFBQVEsSUFBQztZQUN4RCxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxRQUFRO0FBRS9CLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLElBQVc7SUFFbEMsK0RBQStEO0lBQy9ELGdGQUFnRjtJQUNoRixtREFBbUQ7SUFDbkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDO0FBRXpELENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUMsSUFBSTtBQUU3RCxTQUFTLFdBQVcsQ0FBQyxPQUFnQixFQUFFLE1BQWM7SUFFakQsTUFBTSxLQUFLLEdBQUcsZ0JBQUksRUFBQyxFQUFFLEVBQUUsRUFBRSx1Q0FBZ0IsR0FBRSxFQUFFLENBQUM7SUFFOUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUUxQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBVTtRQUUzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTTtnQkFBRSxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUs7WUFDbkQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQyx1Q0FBdUM7U0FDcEU7YUFBTTtZQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDMUQ7SUFFTCxDQUFDLENBQUM7SUFFRixPQUFPLEtBQUs7QUFDaEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN4SkQ7O0dBRUc7QUFDVSxrQkFBVSxHQUFHO0lBQ3RCLFVBQVUsRUFBRSxZQUFZO0NBQzNCOzs7Ozs7Ozs7Ozs7OztBQ1RELFNBQWdCLGdCQUFnQjtJQUM1QixNQUFNLEtBQUssR0FBRyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QyxPQUFPLEtBQUs7QUFDaEIsQ0FBQztBQUhELDRDQUdDO0FBRUQsTUFBTSxXQUFXLEdBQUcseUJBQXlCLEVBQUUsQ0FBQztBQUVoRCxRQUFRLENBQUMsQ0FBQyx5QkFBeUI7SUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsT0FBTyxJQUFJLEVBQUU7UUFDVCxDQUFDLEVBQUUsQ0FBQztRQUNKLE1BQU0sQ0FBQyxDQUFDO0tBQ1g7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ1ZELFNBQWdCLE9BQU8sQ0FBQyxFQUFNO0lBQzFCLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ05ELG1HQUFvQztBQUVwQzs7R0FFRztBQUVILFNBQWdCLE9BQU8sQ0FBQyxHQUFTO0lBQzdCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLHFCQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCxTQUFnQixPQUFPLENBQUMsTUFBYyxFQUFFLElBQUksR0FBRyxDQUFDO0lBRTVDLElBQUksR0FBRyxHQUFHLE1BQU07SUFDaEIsSUFBSSxHQUFHLEdBQWEsRUFBRTtJQUV0QixPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDaEIsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELEdBQUcsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztRQUNoQyxJQUFJLEVBQUU7S0FDVDtJQUVELE9BQU8sR0FBRztBQUNkLENBQUM7QUFiRCwwQkFhQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxpR0FBMkM7QUFFM0MsU0FBZ0IsUUFBUSxDQUFDLE1BQWM7SUFFbkMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQVcsQ0FBQyxFQUFFO1FBQ2xDLG1CQUFtQjtRQUNuQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtLQUMvQjtJQUVELElBQUk7UUFDQSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBZ0I7UUFDckQsT0FBTyxPQUFPO0tBQ2pCO0lBQUMsV0FBTTtRQUNKLE9BQU8sNkJBQVcsRUFBQyxNQUFNLENBQUM7S0FDN0I7SUFFRCx1Q0FBdUM7SUFDdkMsNERBQTREO0lBQzVELDJDQUEyQztJQUMzQyxxQkFBcUI7SUFDckIsV0FBVztJQUNYLDhCQUE4QjtJQUM5QixtQ0FBbUM7SUFDbkMsSUFBSTtBQUVSLENBQUM7QUF2QkQsNEJBdUJDOzs7Ozs7Ozs7Ozs7OztBQ3hCRCxTQUFnQixVQUFVLENBQUMsTUFBYztJQUNyQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLDJCQUEyQjtJQUM5QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBTEQsZ0NBS0M7Ozs7Ozs7Ozs7Ozs7O0FDTkQsNEVBQTZCO0FBRTdCOztHQUVHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLEVBQVksRUFBRSxFQUFZO0lBQ25ELE9BQU8sZUFBSSxFQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUhELG9DQUdDOzs7Ozs7Ozs7Ozs7OztBQ1JELGdIQUFxRDtBQUVyRDs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQVc7SUFFckQsSUFBSSxLQUFLLEtBQUssTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM1QixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0I7SUFFRCxJQUFJLEtBQUssWUFBWSxXQUFXLEVBQUU7UUFDOUIsTUFBTSxPQUFPLEdBQUcsdUNBQWdCLEVBQUMsS0FBSyxDQUFDO1FBQ3ZDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTztRQUMxQixPQUFPLElBQUk7S0FDZDtJQUVELE9BQU8sSUFBSyxLQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBRWxELENBQUM7QUFmRCxrQ0FlQzs7Ozs7Ozs7Ozs7Ozs7QUN0QkQsU0FBZ0IsY0FBYyxDQUFtQixHQUFHLElBQVMsSUFBUyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFBcEYsd0NBQW9GOzs7Ozs7Ozs7Ozs7OztBQ0NwRjs7R0FFRztBQUNJLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSTtLQUM1RCxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztLQUNuQixPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztLQUN0QixXQUFXLEVBQUU7QUFITCx3QkFBZ0Isb0JBR1g7Ozs7Ozs7Ozs7Ozs7O0FDUGxCOztHQUVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFJLEdBQVE7SUFDNUIsSUFBSSxJQUFJLEdBQUcsRUFBUztJQUVwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM1RCxDQUFDLENBQUM7QUFDTixDQUFDO0FBUEQsb0JBT0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRCx1RkFBcUM7QUFDckMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFFdkMsdUZBQXFDO0FBQ3JDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2Qyx1RkFBcUM7QUFFckMsMEZBQXVDO0FBRXZDLDBGQUF1QztBQUV2QywwRkFBdUM7QUFFdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2Qyx1RkFBcUM7QUFDckMsdUZBQXFDO0FBQ3JDLHVGQUFxQztBQUNyQyx1RkFBcUM7QUFDckMsdUZBQXFDO0FBQ3JDLHVGQUFxQztBQUNyQyxnR0FBMkM7QUFDM0MsdUZBQXFDO0FBR3JDLE1BQU0sS0FBSyxHQUFHO0lBQ1YsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04scUJBQXFCO0lBQ3JCLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTiwwQ0FBMEM7SUFDMUMsZUFBTTtJQUNOLFVBQVU7SUFDVixlQUFNO0lBQ04sMENBQTBDO0lBQzFDLGVBQU07SUFDTiwyQ0FBMkM7SUFDM0MsZUFBTTtJQUNOLGVBQU07Q0FDVDtBQUVEOztFQUVFO0FBQ0YsU0FBOEIsVUFBVTs7UUFFcEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuRyxNQUFNLGlCQUFLLEVBQUMsRUFBRSxDQUFDLE1BQUk7WUFDbkIsdUJBQVEsR0FBRTtTQUNiO0lBRUwsQ0FBQztDQUFBO0FBVEQsZ0NBU0M7Ozs7Ozs7Ozs7Ozs7O0FDL0ZELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDeEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFDekYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQ3JGLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBTkQsc0JBTUM7Ozs7Ozs7Ozs7Ozs7O0FDUkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsMEZBQTBGLENBQUMsQ0FBQztJQUNuSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO0lBQzlFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7SUFDOUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQztJQUM3RSxPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDO0FBQ3pDLENBQUM7QUFQRCx3QkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzFELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTVDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDMUgsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUMxSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQzdFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFDL0UsT0FBTyxPQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFcEQsQ0FBQztBQVpELHdCQVlDOzs7Ozs7Ozs7Ozs7OztBQ2RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0csQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsa0VBQWtFO0lBQ2xFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0FBQ3ZFLENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUVsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWhELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0lBRXJGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUs7V0FDbEUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUN6RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFFbkUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFFckQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUNsRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO1dBQ3pELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUVuRSxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFOUIsQ0FBQztBQWxCRCx3QkFrQkM7Ozs7Ozs7Ozs7Ozs7O0FDcEJELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBRWxCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGtEQUFrRCxDQUFDLENBQUM7SUFDM0UsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRXBELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE1BQU07V0FDbkUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTTtXQUMxRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFFakUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQVpELHdCQVlDOzs7Ozs7Ozs7Ozs7OztBQ2RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3hDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN2RCxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFDOUIsQ0FBQztBQVJELHdCQVFDOzs7Ozs7Ozs7Ozs7OztBQ1ZELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7QUFFeEMsQ0FBQztBQVRELHdCQVNDOzs7Ozs7Ozs7Ozs7OztBQ1hELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBRWxCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdEQUFnRCxDQUFDLENBQUM7SUFDekUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDcEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0lBQ2pGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUM1RSxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFOUIsQ0FBQztBQVZELHdCQVVDOzs7Ozs7Ozs7Ozs7OztBQ1hELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsTUFBTSxFQUFFLEdBQUksS0FBb0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0VBQWtFLENBQUMsQ0FBQztJQUMzRixNQUFNLEVBQUUsR0FBSSxLQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ3ZELE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQU5ELHNCQU1DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDN0UsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7QUFDbEYsQ0FBQztBQUpELHdCQUlDOzs7Ozs7Ozs7Ozs7OztBQ05ELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDbkYsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBSkQsd0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsd0VBQXdFLENBQUMsQ0FBQztJQUNqRyxPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFKRCx3QkFJQzs7Ozs7Ozs7Ozs7Ozs7QUNORCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUpELHdCQUlDOzs7Ozs7Ozs7Ozs7OztBQ05ELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDbEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztJQUM3RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7SUFDN0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUMsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQzNCLENBQUM7QUFSRCx3QkFRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBQ3RFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzNELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUM1RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDO0FBQzlCLENBQUM7QUFQRCx3QkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQ3BELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHdEQUF3RCxDQUFDLENBQUM7SUFDakYsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDaEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDO0lBQzNFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBUEQsd0JBT0M7Ozs7Ozs7Ozs7Ozs7O0FDVEQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBUEQsd0JBT0M7Ozs7Ozs7Ozs7Ozs7O0FDVEQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO0lBQzVHLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUNyRixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUN6RixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUN6RixPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDO0FBQ3pDLENBQUM7QUFQRCxzQkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzlELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQscUZBQXFGO0lBQ3JGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDO0FBQ3ZFLENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBSkQsd0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7QUFDckUsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMzQixPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7QUFDbkYsQ0FBQztBQVBELHdCQU9DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUNoQyxDQUFDO0FBTEQsc0JBS0M7Ozs7Ozs7Ozs7Ozs7O0FDUEQsMkdBQXdEO0FBRXhELFNBQWdCLEtBQUs7SUFDakIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUxELHNCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFDaEYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0lBQzVFLE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFMRCxzQkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO0lBQzVGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUMxRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQzFFLE9BQU8sT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFDekMsQ0FBQztBQVBELHNCQU9DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDN0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUM7SUFDNUUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUxELHNCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDcEUsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDO0FBQzlCLENBQUM7QUFORCxzQkFNQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCxTQUFnQixRQUFRO0lBQ3BCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ3hDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNyQixDQUFDO0FBSEQsNEJBR0M7Ozs7Ozs7Ozs7Ozs7O0FDSEQsU0FBZ0IsS0FBSyxDQUFDLFNBQWlCO0lBQ25DLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUM7SUFDekMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUpELHNCQUlDOzs7Ozs7O1VDSkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5nL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmcvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5nL3R5cGVPZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvdGhpbmdzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9CYXNpY0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvQmFzZUxleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZHluYW1pY0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvYWxsS2V5cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2RlZXBDb3B5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL25ld0luc3RhbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy90YWdOYW1lRnJvbVByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDExLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxNi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjYudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0Ni50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0OS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdXRpbHMvY2xlYXJEb20udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3V0aWxzL3NsZWVwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgVGhpbmcgZnJvbSBcIi4uL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgeyBFbnZpcm8sIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFRoaW5nIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcuJylcbiAgICAgICAgY29uc3QgcDEgPSBwYXJ0c1swXVxuICAgICAgICBjb25zdCB3ID0gdGhpcy5kaWN0aW9uYXJ5W3AxXVxuXG4gICAgICAgIGlmICghdyl7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuZ2V0KHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TGFzdFJlZmVyZW5jZWQocDEpXG4gICAgICAgIHJldHVybiB3XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBUaGluZ1tdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldCA9ICh3cmFwcGVyOiBUaGluZyk6IFRoaW5nID0+IHtcbiAgICAgICAgdGhpcy5zZXRMYXN0UmVmZXJlbmNlZCh3cmFwcGVyLmlkKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W3dyYXBwZXIuaWRdID0gd3JhcHBlclxuICAgIH1cblxuICAgIHF1ZXJ5ID0gKHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLnZhbHVlc1xuICAgICAgICAgICAgLm1hcCh3ID0+IHcudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSB1bml2ZXJzZVxuICAgICAgICAgICAgLnF1ZXJ5KHF1ZXJ5LCB7IGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkIH0pXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3F1ZXJ5PScsIHF1ZXJ5LnRvU3RyaW5nKCksICd1bml2ZXJzZT0nLCB1bml2ZXJzZS50b1N0cmluZygpLCAnbWFwcz0nLCBtYXBzKVxuICAgICAgICByZXR1cm4gbWFwc1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRMYXN0UmVmZXJlbmNlZChsYXN0UmVmZXJlbmNlZDogSWQpIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGljdGlvbmFyeSkuaW5jbHVkZXMobGFzdFJlZmVyZW5jZWQpKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gbGFzdFJlZmVyZW5jZWRcbiAgICAgICAgfVxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi90aGluZy9UaGluZ1wiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldCh3cmFwcGVyOiBUaGluZyk6IFRoaW5nXG4gICAgcmVhZG9ubHkgdmFsdWVzOiBUaGluZ1tdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IHRoaW5nLCBjb2xvclRoaW5nIH0gZnJvbSAnLi4vLi4vY29uZmlnL3RoaW5ncyc7XG5pbXBvcnQgQmFzaWNDb250ZXh0IGZyb20gJy4uLy4uL2ZhY2FkZS9jb250ZXh0L0Jhc2ljQ29udGV4dCc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dCc7XG5pbXBvcnQgeyBtYWtlTGV4ZW1lIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lJztcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluJztcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsJztcbmltcG9ydCB7IElkIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL0lkJztcbmltcG9ydCB7IE1hcCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9NYXAnO1xuaW1wb3J0IHsgYWxsS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2FsbEtleXMnO1xuaW1wb3J0IHsgZGVlcENvcHkgfSBmcm9tICcuLi8uLi91dGlscy9kZWVwQ29weSc7XG5pbXBvcnQgVGhpbmcsIHsgQ29weU9wdHMsIFNldEFyZ3MsIFdyYXBBcmdzIH0gZnJvbSAnLi9UaGluZyc7XG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tICcuL3R5cGVPZic7XG5cblxuZXhwb3J0IGNsYXNzIEJhc2VUaGluZyBpbXBsZW1lbnRzIFRoaW5nIHtcblxuICAgIHJlYWRvbmx5IGlkID0gdGhpcy5hcmdzLmlkXG4gICAgcHJvdGVjdGVkIHJlbGF0aW9uczogUmVsYXRpb25bXSA9IFtdXG4gICAgcHJvdGVjdGVkIHBhcmVudCA9IHRoaXMuYXJncy5wYXJlbnQgLy9jb250YWluZXJcbiAgICByZWFkb25seSBvYmplY3QgPSB0aGlzLmFyZ3Mub2JqZWN0XG4gICAgcHJvdGVjdGVkIHN1cGVyY2xhc3MgPSB0aGlzLmFyZ3Muc3VwZXJjbGFzc1xuICAgIHByb3RlY3RlZCBiYXNlID0gdGhpcy5hcmdzLmJhc2VcblxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYXJnczogV3JhcEFyZ3MpIHtcblxuICAgIH1cblxuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLicpXG4gICAgICAgIGNvbnN0IHAxID0gcGFydHNbMF1cblxuICAgICAgICBsZXQgb1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBvID0gKHRoaXMgYXMgYW55KVtwMV0gPz8gKHRoaXMub2JqZWN0IGFzIGFueSk/LltwMV0gPz8gdGhpcy5iYXNlPy5nZXQocDEpXG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3ID0gbyBpbnN0YW5jZW9mIEJhc2VUaGluZyA/IG8gOiBuZXcgQmFzZVRoaW5nKHsgb2JqZWN0OiBvLCBpZDogYCR7dGhpcy5pZH0uJHtwMX1gLCBwYXJlbnQ6IHRoaXMgfSlcbiAgICAgICAgLy9tZW1vaXplXG5cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB3LmdldChwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBUaGluZyB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoe1xuICAgICAgICAgICAgaWQ6IG9wdHM/LmlkID8/IHRoaXMuaWQsXG4gICAgICAgICAgICBvYmplY3Q6IHRoaXMub2JqZWN0ID8gZGVlcENvcHkodGhpcy5vYmplY3QpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3VwZXJjbGFzczogdGhpcy5zdXBlcmNsYXNzLFxuICAgICAgICAgICAgYmFzZTogdGhpcy5iYXNlPy5jb3B5KCksXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdCA/PyB0aGlzLmJhc2U/LnVud3JhcCgpXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lcyA9ICgpID0+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGxLZXlzKCkuZmxhdE1hcCh4ID0+IHtcblxuICAgICAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5nZXQoeClcblxuICAgICAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsZXggPSBtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlT2YoY2hpbGQudW53cmFwKCkpLFxuICAgICAgICAgICAgICAgIHJvb3Q6IHgsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnQ6IGNoaWxkLFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIFtsZXgsIC4uLmxleC5leHRyYXBvbGF0ZSgpXVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogVGhpbmcsIG9wdHM/OiBTZXRBcmdzKTogVGhpbmdbXSB7XG5cbiAgICAgICAgY29uc3QgcmVsYXRpb246IFJlbGF0aW9uID0geyBwcmVkaWNhdGUsIGFyZ3M6IG9wdHM/LmFyZ3MgPz8gW10gfVxuXG4gICAgICAgIGxldCBhZGRlZDogUmVsYXRpb25bXSA9IFtdXG4gICAgICAgIGxldCByZW1vdmVkOiBSZWxhdGlvbltdID0gW11cbiAgICAgICAgbGV0IHVuY2hhbmdlZCA9IHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+ICFyZWxhdGlvbnNFcXVhbCh4LCByZWxhdGlvbikpXG5cbiAgICAgICAgaWYgKG9wdHM/Lm5lZ2F0ZWQpIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSBbcmVsYXRpb25dXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FscmVhZHkocmVsYXRpb24pKSB7XG4gICAgICAgICAgICB1bmNoYW5nZWQucHVzaChyZWxhdGlvbilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFkZGVkID0gW3JlbGF0aW9uXVxuICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKC4uLnRoaXMuZ2V0RXhjbHVkZWRCeShyZWxhdGlvbikpXG4gICAgICAgICAgICB1bmNoYW5nZWQgPSB1bmNoYW5nZWQuZmlsdGVyKHggPT4gIXJlbW92ZWQuc29tZShyID0+IHJlbGF0aW9uc0VxdWFsKHgsIHIpKSlcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZGVkLmZvckVhY2gociA9PiB0aGlzLmFkZFJlbGF0aW9uKHIpKVxuICAgICAgICByZW1vdmVkLmZvckVhY2gociA9PiB0aGlzLnJlbW92ZVJlbGF0aW9uKHIpKVxuXG4gICAgICAgIHJldHVybiB0aGlzLnJlaW50ZXJwcmV0KGFkZGVkLCByZW1vdmVkLCB1bmNoYW5nZWQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlaW50ZXJwcmV0KGFkZGVkOiBSZWxhdGlvbltdLCByZW1vdmVkOiBSZWxhdGlvbltdLCBrZXB0OiBSZWxhdGlvbltdKTogVGhpbmdbXSB7XG5cbiAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy51bmRvKHIpXG4gICAgICAgIH0pXG5cbiAgICAgICAgYWRkZWQuZm9yRWFjaChyID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG8ocilcbiAgICAgICAgfSlcblxuICAgICAgICBrZXB0LmZvckVhY2gociA9PiB7XG4gICAgICAgICAgICB0aGlzLmtlZXAocilcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0RXhjbHVkZWRCeShyZWxhdGlvbjogUmVsYXRpb24pOiBSZWxhdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtdIC8vVE9ET1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBkbyhyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coKHJlbGF0aW9uLnByZWRpY2F0ZSBhcyBCZXR0ZXJCYXNlVGhpbmcpLnN1cGVyY2xhc3MgPT09IGNvbG9yVGhpbmcgKVxuXG4gICAgICAgIGlmICgocmVsYXRpb24ucHJlZGljYXRlIGFzIEJhc2VUaGluZykuc3VwZXJjbGFzcyA9PT0gY29sb3JUaGluZykge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29sb3IocmVsYXRpb24pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5oZXJpdChyZWxhdGlvbi5wcmVkaWNhdGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlZnJlc2hDb2xvcihyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLmdldCgnc3R5bGUnKT8udW53cmFwKClcbiAgICAgICAgc3R5bGUgPyBzdHlsZS5iYWNrZ3JvdW5kID0gcmVsYXRpb24ucHJlZGljYXRlLnVud3JhcCgpIDogMFxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdW5kbyhyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5kaXNpbmhlcml0KHJlbGF0aW9uLnByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga2VlcChyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29sb3IocmVsYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFkZFJlbGF0aW9uKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICB0aGlzLnJlbGF0aW9ucy5wdXNoKHJlbGF0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW1vdmVSZWxhdGlvbihyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMgPSB0aGlzLnJlbGF0aW9ucy5maWx0ZXIoeCA9PiAhcmVsYXRpb25zRXF1YWwocmVsYXRpb24sIHgpKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0FscmVhZHkocmVsYXRpb246IFJlbGF0aW9uKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoIXJlbGF0aW9uLmFyZ3MubGVuZ3RoICYmIHRoaXMuZXF1YWxzKHJlbGF0aW9uLnByZWRpY2F0ZSkpXG4gICAgICAgICAgICB8fCB0aGlzLnJlbGF0aW9ucy5zb21lKHggPT4gcmVsYXRpb25zRXF1YWwoeCwgcmVsYXRpb24pKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbmhlcml0KGFkZGVkOiBUaGluZykge1xuXG4gICAgICAgIC8vVE9ETzogcHJldmVudCByZS1jcmVhdGlvbiBvZiBleGlzdGluZyBET00gZWxlbWVudHNcblxuICAgICAgICB0aGlzLmJhc2UgPSBhZGRlZC5jb3B5KHsgaWQ6IHRoaXMuaWQgfSlcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gYWRkZWRcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNpbmhlcml0KGV4cGVsbGVkOiBUaGluZykge1xuICAgICAgICBpZiAodGhpcy5zdXBlcmNsYXNzID09PSBleHBlbGxlZCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlPy51bndyYXAoKSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzaWNDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucm9vdD8ucmVtb3ZlQ2hpbGQodGhpcy5iYXNlLnVud3JhcCgpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhc2UgPSB0aGluZy5jb3B5KClcbiAgICAgICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHRoaW5nXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFsbEtleXMgPSAoKSA9PiBhbGxLZXlzKHRoaXMub2JqZWN0ID8/IHt9KS5jb25jYXQoYWxsS2V5cyh0aGlzLmJhc2U/LnVud3JhcCgpID8/IHt9KSkuY29uY2F0KGFsbEtleXModGhpcykpXG5cbiAgICBwb2ludE91dChkb0l0OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmJhc2U/LnVud3JhcCgpXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHguc3R5bGUub3V0bGluZSA9IGRvSXQgPyAnI2YwMCBzb2xpZCAycHgnIDogJydcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1ldmlsIHN0YXJ0cyBiZWxvdy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRvQ2xhdXNlKHF1ZXJ5PzogQ2xhdXNlKSB7XG5cbiAgICAgICAgY29uc3QgcXVlcnlPckVtcHR5ID0gcXVlcnkgPz8gZW1wdHlDbGF1c2VcbiAgICAgICAgLy8gY29uc3QgZmlsbGVyQ2xhdXNlID0gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHRoaXMuaWQudG9TdHJpbmcoKSwgdHlwZTogJ25vdW4nIH0pLCB0aGlzLmlkKSAvL1RPRE9cblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeU9yRW1wdHlcbiAgICAgICAgICAgIC5mbGF0TGlzdCgpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5lbnRpdGllcy5sZW5ndGggPT09IDEgJiYgeC5wcmVkaWNhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gdGhpcy5pc0FscmVhZHkoeyBwcmVkaWNhdGU6IHgucHJlZGljYXRlPy5yZWZlcmVudCEsIGFyZ3M6IFtdIH0pKVxuICAgICAgICAgICAgLm1hcCh4ID0+IHguY29weSh7IG1hcDogeyBbeC5hcmdzIVswXV06IHRoaXMuaWQgfSB9KSlcbiAgICAgICAgICAgIC8vIC5jb25jYXQoZmlsbGVyQ2xhdXNlKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmFuZCh0aGlzLm93bmVySW5mbyhxdWVyeU9yRW1wdHkpKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy50b1N0cmluZygpKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG93bmVySW5mbyhxOiBDbGF1c2UpIHtcblxuICAgICAgICAvL1RPRE86IHRoaXMgdW53aXR0aW5sZ3kgYXNzZXJ0cyB3cm9uZyBub24tcmVsYXRpb25hbCBpbmZvIGFib3V0IHRoaXMgb2JqZWN0IFwicGFycm90aW5nIHRoZSBxdWVyeVwiLlxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IHJlcyA9IChtYXBzWzBdICYmIGdldE93bmVyc2hpcENoYWluKHEsIGdldFRvcExldmVsKHEpWzBdKS5sZW5ndGggPiAxKSA/XG4gICAgICAgICAgICBxLmNvcHkoeyBtYXA6IG1hcHNbMF0gfSlcbiAgICAgICAgICAgIDogZW1wdHlDbGF1c2VcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMudG9TdHJpbmcoKSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBwYXJlbnRNYXA6IE1hcCA9IHt9KTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBnZXRUb3BMZXZlbChjbGF1c2UpWzBdKVxuXG4gICAgICAgIGlmIChvYy5sZW5ndGggPT09IDEpIHsgLy9CQVNFQ0FTRTogY2hlY2sgeW91cnNlbGZcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBbHJlYWR5KHsgcHJlZGljYXRlOiBjbGF1c2UucHJlZGljYXRlPy5yZWZlcmVudCEsIGFyZ3M6IFtdIH0pKSB7IC8vVE9ETzogYWxzbyBoYW5kbGUgbm9uLW93bmVyc2hpcCBub24taW50cmFuc2l0aXZlIHJlbGF0aW9ucyEsIFRPRE86IGhhbmRsZSBub24gQmFzaWNDbGF1c2VzISEhISAodGhhdCBkb24ndCBoYXZlIE9ORSBwcmVkaWNhdGUhKVxuICAgICAgICAgICAgICAgIHJldHVybiBbeyAuLi5wYXJlbnRNYXAsIFtjbGF1c2UuZW50aXRpZXNbMF1dOiB0aGlzLmlkIH1dXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbXSAvL1RPRE9cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHlvdXIgY2hpbGRyZW4hXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHBlZWxlZCA9IGNsYXVzZS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5lbnRpdGllcy5ldmVyeShlID0+ICF0b3AuaW5jbHVkZXMoZSkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHJlbGV2YW50TmFtZXMgPSBwZWVsZWQuZmxhdExpc3QoKS5mbGF0TWFwKHggPT4gW3gucHJlZGljYXRlPy5yb290LCB4LnByZWRpY2F0ZT8udG9rZW5dKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4IGFzIHN0cmluZylcblxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9XG4gICAgICAgICAgICB0aGlzLmdldEFsbEtleXMoKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByZWxldmFudE5hbWVzLmluY2x1ZGVzKHgpKVxuICAgICAgICAgICAgICAgIC5tYXAoeCA9PiB0aGlzLmdldCh4KSkgLy8gLmZpbHRlcih4PT54Py51bndyYXAoKSAhPT0gdGhpcylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geClcbiAgICAgICAgICAgICAgICAubWFwKHggPT4geCBhcyBUaGluZylcblxuICAgICAgICBjb25zdCByZXMgPSBjaGlsZHJlbi5mbGF0TWFwKHggPT4geC5xdWVyeShwZWVsZWQsIHsgW3RvcFswXV06IHRoaXMuaWQgfSkpXG4gICAgICAgIHJldHVybiByZXNcblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tZXZpbCBlbmRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbiAgICBlcXVhbHMob3RoZXI6IFRoaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBvdGhlciAmJiB0aGlzLnVud3JhcCgpID09PSBvdGhlci51bndyYXAoKVxuICAgIH1cblxuICAgIHNldFBhcmVudChwYXJlbnQ6IENvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgaWYgKHRoaXMuYmFzZT8udW53cmFwKCkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiB0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEJhc2ljQ29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQucm9vdD8uYXBwZW5kQ2hpbGQodGhpcy5iYXNlLnVud3JhcCgpKVxuICAgICAgICB9XG4gICAgfVxuXG5cbn1cblxuXG50eXBlIFJlbGF0aW9uID0ge1xuICAgIHByZWRpY2F0ZTogVGhpbmcsXG4gICAgYXJnczogVGhpbmdbXSwvL2ltcGxpZWQgc3ViamVjdCA9IHRoaXMgb2JqZWN0XG59XG5cbmZ1bmN0aW9uIHJlbGF0aW9uc0VxdWFsKHIxOiBSZWxhdGlvbiwgcjI6IFJlbGF0aW9uKSB7XG4gICAgcmV0dXJuIHIxLnByZWRpY2F0ZS5lcXVhbHMocjIucHJlZGljYXRlKVxuICAgICAgICAmJiByMS5hcmdzLmxlbmd0aCA9PT0gcjIuYXJncy5sZW5ndGhcbiAgICAgICAgJiYgcjEuYXJncy5ldmVyeSgoeCwgaSkgPT4gcjIuYXJnc1tpXSA9PT0geClcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgVGhpbmcge1xuXG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KHByZWRpY2F0ZTogVGhpbmcsIG9wdHM/OiBTZXRBcmdzKTogVGhpbmdbXVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogVGhpbmdcbiAgICB1bndyYXAoKTogYW55XG4gICAgZ2V0TGV4ZW1lcygpOiBMZXhlbWVbXVxuICAgIHRvQ2xhdXNlKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIHBhcmVudE1hcD86IE1hcCk6IE1hcFtdXG4gICAgcG9pbnRPdXQoZG9JdDogYm9vbGVhbik6IHZvaWRcbiAgICByZWFkb25seSBpZDogSWRcblxuICAgIC8vIHJlYWRvbmx5IHBhcmVudD86IFRoaW5nIHwgQ29udGV4dFxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuXG4gICAgc2V0UGFyZW50KHBhcmVudDogQ29udGV4dCk6IHZvaWRcblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNldEFyZ3Mge1xuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFRoaW5nW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgaWQ/OiBJZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChhcmdzOiBXcmFwQXJncyk6IFRoaW5nIHtcbiAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhhcmdzKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyYXBBcmdzIHtcbiAgICBpZDogSWQsXG4gICAgb2JqZWN0PzogT2JqZWN0LFxuICAgIHBhcmVudD86IFRoaW5nIHwgQ29udGV4dCxcbiAgICBiYXNlPzogVGhpbmcsXG4gICAgc3VwZXJjbGFzcz86IFRoaW5nLFxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2Yobzogb2JqZWN0KTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZCB7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiBvLmxlbmd0aCA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIHJldHVybiAnYWRqZWN0aXZlJ1xuICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxufSIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4vcHJlbHVkZVwiXG5pbXBvcnQgeyBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5pbXBvcnQgeyBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyB0aGluZ3MgfSBmcm9tIFwiLi90aGluZ3NcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgbGV4ZW1lczogbGV4ZW1lcy5mbGF0TWFwKHggPT4ge1xuICAgICAgICAgICAgY29uc3QgbCA9IG1ha2VMZXhlbWUoeClcbiAgICAgICAgICAgIHJldHVybiBbbCwgLi4ubC5leHRyYXBvbGF0ZSgpXVxuICAgICAgICB9KSxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHByZWx1ZGUsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLFxuICAgICAgICB0aGluZ3MsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqZWN0aXZlJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdmaWxsZXInLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnZ3JhbW1hcicsXG4gICdub25zdWJjb25qJywgLy8gYW5kIC4uLlxuICAnZGlzanVuYycsIC8vIG9yLCBidXQsIGhvd2V2ZXIgLi4uXG4gICdwcm9ub3VuJyxcbiAgLy8gJ2FueSdcbilcbiIsImltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGJ1dHRvblRoaW5nLCBjb2xvclRoaW5nLCBkaXZUaGluZywgZ3JlZW5UaGluZywgcmVkVGhpbmcsIHRoaW5nIH0gZnJvbSBcIi4vdGhpbmdzXCI7XG5cbmNvbnN0IGJlaW5nOiBMZXhlbWUgPSBtYWtlTGV4ZW1lKHtcbiAgICByb290OiAnYmUnLFxuICAgIHR5cGU6ICdjb3B1bGEnLFxufSlcblxuY29uc3QgZG9pbmc6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmNvbnN0IG5vdDogTGV4ZW1lID0gbWFrZUxleGVtZSh7XG4gICAgcm9vdDogJ25vdCcsXG4gICAgdHlwZTogJ25lZ2F0aW9uJyxcbn0pXG5cblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IChQYXJ0aWFsPExleGVtZT4gfCBMZXhlbWUpW10gPSBbXG5cbiAgICBiZWluZyxcbiAgICBkb2luZyxcbiAgICBub3QsXG5cbiAgICB7IF9yb290OiBiZWluZywgdG9rZW46ICdpcycsIGNhcmRpbmFsaXR5OiAxIH0sXG4gICAgeyBfcm9vdDogYmVpbmcsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJyB9LCAvL1RPRE8hIDIrXG4gICAgeyBfcm9vdDogZG9pbmcsIHRva2VuOiAnZG9lcycsIGNhcmRpbmFsaXR5OiAxIH0sXG5cbiAgICB7IHJvb3Q6ICd0aGVuJywgdHlwZTogJ2ZpbGxlcicgfSxcbiAgICB7IHJvb3Q6ICcuJywgdHlwZTogJ2Z1bGxzdG9wJyB9LFxuICAgIHsgcm9vdDogJ29wdGlvbmFsJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnMXwwJyB9LFxuICAgIHsgcm9vdDogJ29uZS1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKycgfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcqJyB9LFxuICAgIHsgcm9vdDogJ29yJywgdHlwZTogJ2Rpc2p1bmMnIH0sXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2FkamVjdGl2ZScgfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogXCJpc24ndFwiLCB0eXBlOiAnY29udHJhY3Rpb24nLCBjb250cmFjdGlvbkZvcjogW2JlaW5nLCBub3RdIH0sXG4gICAgeyByb290OiAnYW5kJywgdHlwZTogJ25vbnN1YmNvbmonIH0sXG4gICAgeyByb290OiAnbGVmdCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAncmlnaHQnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogJ2EnLCB0eXBlOiAnaW5kZWZhcnQnIH0sXG4gICAgeyByb290OiAnYW4nLCB0eXBlOiAnaW5kZWZhcnQnIH0sXG4gICAgeyByb290OiAndGhlJywgdHlwZTogJ2RlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICdpZicsIHR5cGU6ICdzdWJjb25qJyB9LFxuICAgIHsgcm9vdDogJ3doZW4nLCB0eXBlOiAnc3ViY29uaicgfSxcbiAgICB7IHJvb3Q6ICdhbnknLCB0eXBlOiAndW5pcXVhbnQnIH0sXG4gICAgeyByb290OiAnZXZlcnknLCB0eXBlOiAndW5pcXVhbnQnIH0sXG4gICAgeyByb290OiAnb2YnLCB0eXBlOiAncHJlcG9zaXRpb24nIH0sXG4gICAgeyByb290OiAndGhhdCcsIHR5cGU6ICdyZWxwcm9uJyB9LFxuICAgIHsgcm9vdDogJ2l0JywgdHlwZTogJ3Byb25vdW4nIH0sXG4gICAgeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50OiB0aGluZyB9LFxuICAgIHsgcm9vdDogJ2J1dHRvbicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IGJ1dHRvblRoaW5nIH0sXG4gICAgeyByb290OiAnZGl2JywgdHlwZTogJ25vdW4nLCByZWZlcmVudDogZGl2VGhpbmcgfSxcbiAgICB7IHJvb3Q6ICdjb2xvcicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IGNvbG9yVGhpbmcgfSxcbiAgICB7IHJvb3Q6ICdyZWQnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50OiByZWRUaGluZyB9LFxuICAgIHsgcm9vdDogJ2dyZWVuJywgdHlwZTogJ25vdW4nLCByZWZlcmVudDogZ3JlZW5UaGluZyB9LFxuXG5dXG5cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmdbXSA9IFtcblxuICAgICAgLy8gZ3JhbW1hclxuICAgICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAgICAgJ2NvbXBsZW1lbnQgaXMgcHJlcG9zaXRpb24gdGhlbiBvYmplY3Qgbm91bi1waHJhc2UnLFxuXG4gICAgICBgY29wdWxhLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZWAsXG5cbiAgICAgIGBub3VuLXBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIGFkamVjdGl2ZXMgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIGdyYW1tYXJcbiAgICAgICAgdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIGNvbXBsZW1lbnRzIGAsXG5cbiAgICAgICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZScsXG4gICAgICAnbXZlcmJzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIG12ZXJiIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlLicsXG4gICAgICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZSBvciBtdmVyYnN1YmNsYXVzZScsXG5cbiAgICAgIGBhbmQtc2VudGVuY2UgaXMgbGVmdCBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gbm9uc3ViY29ualxuICAgICAgICB0aGVuIG9uZS1vci1tb3JlIHJpZ2h0IGFuZC1zZW50ZW5jZSBvciBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2VgLFxuXG4gICAgICBgbXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gbXZlcmJcblx0XHR0aGVuIG9iamVjdCBub3VuLXBocmFzZWAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICAgICAgYGl2ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgICBgc2ltcGxlLXNlbnRlbmNlIGlzIGNvcHVsYS1zZW50ZW5jZSBvciBpdmVyYi1zZW50ZW5jZSBvciBtdmVyYi1zZW50ZW5jZWAsXG5cbiAgICAgIGBjczIgaXMgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlXG4gICAgICB0aGVuIHN1YmNvbmpcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgICAgIGBjczEgaXMgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBmaWxsZXIgXG4gICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VgLFxuXG4gICAgICAvLyBkb21haW5cbiAgICAgIC8vICdjb2xvciBpcyBhIHRoaW5nJyxcbiAgICAgIC8vICdyZWQgYW5kIGJsdWUgYW5kIGJsYWNrIGFuZCBncmVlbiBhbmQgcHVycGxlIGFyZSBjb2xvcnMnLFxuXG4gICAgICAvLyAnY29sb3Igb2YgYSBidXR0b24gaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICAgICAvLyAnY29sb3Igb2YgYSBkaXYgaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICAgICAvLyAndGV4dCBvZiBhIGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KClcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZmlsbGVyJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxufSIsImltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5nL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmcvVGhpbmdcIlxuXG5leHBvcnQgY29uc3QgdGhpbmcgPSB3cmFwKHsgaWQ6ICd0aGluZycsIG9iamVjdDoge30gLyogQmFzZVRoaW5nICovIH0pXG5leHBvcnQgY29uc3QgYnV0dG9uVGhpbmcgPSB3cmFwKHsgaWQ6ICdidXR0b24nLCBvYmplY3Q6IEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZSB9KVxuZXhwb3J0IGNvbnN0IGRpdlRoaW5nID0gd3JhcCh7IGlkOiAnZGl2Jywgb2JqZWN0OiBIVE1MRGl2RWxlbWVudC5wcm90b3R5cGUgfSlcbmV4cG9ydCBjb25zdCBjb2xvclRoaW5nID0gd3JhcCh7IGlkOiAnY29sb3InLCBvYmplY3Q6IHt9IH0pXG5leHBvcnQgY29uc3QgcmVkVGhpbmcgPSB3cmFwKHsgaWQ6ICdyZWQnLCBvYmplY3Q6ICdyZWQnIH0pXG5leHBvcnQgY29uc3QgZ3JlZW5UaGluZyA9IHdyYXAoeyBpZDogJ2dyZWVuJywgb2JqZWN0OiAnZ3JlZW4nIH0pXG5yZWRUaGluZy5zZXQoY29sb3JUaGluZylcbmdyZWVuVGhpbmcuc2V0KGNvbG9yVGhpbmcpXG5cblxuZXhwb3J0IGNvbnN0IHRoaW5ncyA9IFsgLy9maW5kIGEgYmV0dGVyIHNvbHV0aW9uIHRvIGF2b2lkIGNhcHR1cmluZyBiYXNlLWJ1dHRvbnMgaW4gcXVlcnkgcmVzdWx0c1xuICAgIHRoaW5nLFxuICAgIC8vIGJ1dHRvblRoaW5nLFxuICAgIC8vIGRpdlRoaW5nLFxuICAgIGNvbG9yVGhpbmcsXG4gICAgcmVkVGhpbmcsXG4gICAgZ3JlZW5UaGluZyxcbl1cbiIsImltcG9ydCBUaGluZyBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZy9UaGluZ1wiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuaW1wb3J0IHsgZXZhbEFzdCB9IGZyb20gXCIuLi8uLi9taWRkbGUvZXZhbEFzdFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICApIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LnByZWx1ZGUuZm9yRWFjaChjID0+IHRoaXMuZXhlY3V0ZShjKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW10ge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQudmFsdWVzLmZvckVhY2goeCA9PiB4LnBvaW50T3V0KGZhbHNlKSlcbiAgICAgICAgICAgIHJlcy5mb3JFYWNoKHggPT4geC5wb2ludE91dCh0cnVlKSlcbiAgICAgICAgICAgIHJldHVybiByZXNcblxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShuYXRsYW5nKS5tYXAoeCA9PiB4Py51bndyYXA/LigpID8/IHgpXG4gICAgfVxuXG59IiwiaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5nL1RoaW5nXCJcbmltcG9ydCB7IEdldENvbnRleHRPcHRzLCBnZXRDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW11cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QnJhaW5PcHRzIGV4dGVuZHMgR2V0Q29udGV4dE9wdHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbihvcHRzOiBHZXRCcmFpbk9wdHMpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKGdldENvbnRleHQob3B0cykpXG59XG4iLCJpbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9lbnZpcm8vRW52aXJvXCJcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuLi8uLi9jb25maWcvQ29uZmlnXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQ29udGV4dCBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcmVhZG9ubHkgY29uZmlnID0gZ2V0Q29uZmlnKClcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSB0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZVxuICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSB0aGlzLmNvbmZpZy5zeW50YXhlc1xuICAgIHByb3RlY3RlZCBfc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICBwcm90ZWN0ZWQgX2xleGVtZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVzXG4gICAgcmVhZG9ubHkgcHJlbHVkZSA9IHRoaXMuY29uZmlnLnByZWx1ZGVcbiAgICByZWFkb25seSBsZXhlbWVUeXBlcyA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgcmVhZG9ubHkgc2V0ID0gdGhpcy5lbnZpcm8uc2V0XG4gICAgcmVhZG9ubHkgcXVlcnkgPSB0aGlzLmVudmlyby5xdWVyeVxuICAgIHJlYWRvbmx5IHJvb3QgPSB0aGlzLmVudmlyby5yb290XG4gICAgcmVhZG9ubHkgZ2V0ID0gdGhpcy5lbnZpcm8uZ2V0XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBlbnZpcm86IEVudmlybykge1xuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHtcblxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jb25maWcudGhpbmdzLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldCh0KVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnZhbHVlc1xuICAgIH1cblxuICAgIGdldExleGVtZSA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByb290T3JUb2tlbiA9PT0geC50b2tlbiB8fCByb290T3JUb2tlbiA9PT0geC5yb290KVxuICAgICAgICAgICAgLmF0KDApXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN5bnRheExpc3QoKSB7XG4gICAgICAgIGNvbnN0IHggPSBPYmplY3Qua2V5cyh0aGlzLnN5bnRheE1hcCkgYXMgQ29tcG9zaXRlVHlwZVtdXG4gICAgICAgIGNvbnN0IHkgPSB4LmZpbHRlcihlID0+ICF0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5pbmNsdWRlcyhlKSlcbiAgICAgICAgY29uc3QgeiA9IHkuc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCB0aGlzLnN5bnRheE1hcCkpXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcbiAgICB9XG5cbiAgICBnZXQgc3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ludGF4TGlzdFxuICAgIH1cblxuICAgIGdldCBsZXhlbWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQXN0Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuX3N5bnRheExpc3QgPSB0aGlzLmdldFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lID0gKGxleGVtZTogTGV4ZW1lKSA9PiB7XG5cbiAgICAgICAgaWYgKGxleGVtZS5yb290ICYmICFsZXhlbWUudG9rZW4gJiYgdGhpcy5fbGV4ZW1lcy5zb21lKHggPT4geC5yb290ID09PSBsZXhlbWUucm9vdCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xleGVtZXMgPSB0aGlzLl9sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2goLi4ubGV4ZW1lLmV4dHJhcG9sYXRlKHRoaXMpKVxuICAgIH1cblxuICAgIGdldCBhc3RUeXBlcygpOiBBc3RUeXBlW10ge1xuICAgICAgICBjb25zdCByZXM6IEFzdFR5cGVbXSA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgICAgIHJlcy5wdXNoKC4uLnRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UpXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbn1cbiIsImltcG9ydCBnZXRFbnZpcm8sIHsgRW52aXJvLCBHZXRFbnZpcm9PcHMgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgQmFzaWNDb250ZXh0IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBFbnZpcm8ge1xuXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldExleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkXG5cbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRPcHRzIGV4dGVuZHMgR2V0RW52aXJvT3BzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGV4dChvcHRzOiBHZXRDb250ZXh0T3B0cyk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KGdldEVudmlybyhvcHRzKSlcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9jb25qdWdhdGVcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlTGV4ZW1lIGltcGxlbWVudHMgTGV4ZW1lIHtcblxuICAgIF9yb290ID0gdGhpcy5uZXdEYXRhPy5fcm9vdFxuICAgIHJlYWRvbmx5IHJvb3QgPSB0aGlzLm5ld0RhdGE/LnJvb3QgPz8gdGhpcy5fcm9vdD8ucm9vdCFcbiAgICByZWFkb25seSB0eXBlID0gdGhpcy5uZXdEYXRhPy50eXBlID8/IHRoaXMuX3Jvb3Q/LnR5cGUhXG4gICAgY29udHJhY3Rpb25Gb3IgPSB0aGlzLm5ld0RhdGE/LmNvbnRyYWN0aW9uRm9yID8/IHRoaXMuX3Jvb3Q/LmNvbnRyYWN0aW9uRm9yXG4gICAgdG9rZW4gPSB0aGlzLm5ld0RhdGE/LnRva2VuID8/IHRoaXMuX3Jvb3Q/LnRva2VuXG4gICAgY2FyZGluYWxpdHkgPSB0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5ID8/IHRoaXMuX3Jvb3Q/LmNhcmRpbmFsaXR5XG4gICAgcmVhZG9ubHkgaXNWZXJiID0gdGhpcy50eXBlID09PSAnbXZlcmInIHx8IHRoaXMudHlwZSA9PT0gJ2l2ZXJiJ1xuICAgIHJlYWRvbmx5IGlzUGx1cmFsID0gaXNSZXBlYXRhYmxlKHRoaXMubmV3RGF0YT8uY2FyZGluYWxpdHkpXG4gICAgcmVhZG9ubHkgcmVmZXJlbnQgPSB0aGlzLm5ld0RhdGE/LnJlZmVyZW50ID8/IHRoaXMuX3Jvb3Q/LnJlZmVyZW50XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgbmV3RGF0YT86IFBhcnRpYWw8TGV4ZW1lPlxuICAgICkgeyB9XG5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0PzogQ29udGV4dCk6IExleGVtZVtdIHtcblxuICAgICAgICBpZiAoKHRoaXMudHlwZSA9PT0gJ25vdW4nIHx8IHRoaXMudHlwZSA9PT0gJ2dyYW1tYXInKSAmJiAhdGhpcy5pc1BsdXJhbCkge1xuICAgICAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiBwbHVyYWxpemUodGhpcy5yb290KSwgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnQ6IHRoaXMucmVmZXJlbnQgfSldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZlcmIpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25qdWdhdGUodGhpcy5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiB4LCByZWZlcmVudDogdGhpcy5yZWZlcmVudCB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IGR5bmFtaWNMZXhlbWUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZHluYW1pY0xleGVtZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3Qgd29yZHMgPVxuICAgICAgICAgICAgc291cmNlQ29kZVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuXG4gICAgICAgIHRoaXMudG9rZW5zID0gd29yZHMuZmxhdE1hcCh3ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxleCA9IGNvbnRleHQuZ2V0TGV4ZW1lKHcpID8/IGR5bmFtaWNMZXhlbWUodywgY29udGV4dCwgd29yZHMpXG4gICAgICAgICAgICByZXR1cm4gbGV4LmNvbnRyYWN0aW9uRm9yID8/IFtsZXhdXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgQmFzZUxleGVtZSBmcm9tIFwiLi9CYXNlTGV4ZW1lXCJcbmltcG9ydCBUaGluZyBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZy9UaGluZ1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gIHJvb3Q6IHN0cmluZ1xuICAgIC8qKnRva2VuIHR5cGUqLyAgdHlwZTogTGV4ZW1lVHlwZVxuICAgIC8qKmZvcm0gb2YgdGhpcyBpbnN0YW5jZSovIHRva2VuPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyAgY29udHJhY3Rpb25Gb3I/OiBMZXhlbWVbXVxuICAgIC8qKmZvciBxdWFudGFkaiAqLyBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgX3Jvb3Q/OiBQYXJ0aWFsPExleGVtZT5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0PzogQ29udGV4dCk6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgaXNQbHVyYWw6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc1ZlcmI6IGJvb2xlYW5cblxuICAgIHJlZmVyZW50PzogVGhpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMZXhlbWUoZGF0YTogUGFydGlhbDxMZXhlbWU+IHwgTGV4ZW1lKTogTGV4ZW1lIHtcblxuICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQmFzZUxleGVtZSkge1xuICAgICAgICByZXR1cm4gZGF0YVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQmFzZUxleGVtZShkYXRhKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUodmVyYjpzdHJpbmcpe1xuICAgIHJldHVybiBbdmVyYisncyddXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY0xleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cblxuICAgIGNvbnN0IHJlbGV2YW50ID1cbiAgICAgICAgLy8gd29yZHNcbiAgICAgICAgLy8gICAgIC5tYXAodyA9PiBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogdywgdHlwZTogJ25vdW4nIH0pLCAnWCcpKVxuICAgICAgICAvLyAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LnF1ZXJ5KGMpKVxuICAgICAgICAvLyAgICAgLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAvLyAgICAgLmZsYXRNYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpID8/IFtdKVxuICAgICAgICBjb250ZXh0LnZhbHVlc1xuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiB4LmdldExleGVtZXMoKSlcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnRva2VuID09PSB3b3JkIHx8IHgucm9vdCA9PT0gd29yZClcblxuICAgIC8vIGNvbnNvbGUubG9nKCdkeW5hbWljTGV4ZW1lcyEnLCB3b3JkLCAncmVsZXZhbnQ9JywgcmVsZXZhbnQpXG5cbiAgICBjb25zdCBpc01hY3JvQ29udGV4dCA9XG4gICAgICAgIHdvcmRzLnNvbWUoeCA9PiBjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSA9PT0gJ2dyYW1tYXInKVxuICAgICAgICAmJiAhd29yZHMuc29tZSh4ID0+IFsnZGVmYXJ0JywgJ2luZGVmYXJ0JywgJ25vbnN1YmNvbmonXS5pbmNsdWRlcyhjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSBhcyBhbnkpKS8vVE9ETzogd2h5IGRlcGVuZGVuY2llcygnbWFjcm8nKSBkb2Vzbid0IHdvcms/IVxuXG4gICAgY29uc3QgdHlwZSA9IHJlbGV2YW50WzBdPy50eXBlID8/XG4gICAgICAgIChpc01hY3JvQ29udGV4dCA/XG4gICAgICAgICAgICAnZ3JhbW1hcidcbiAgICAgICAgICAgIDogJ25vdW4nKVxuXG4gICAgLy8gY29uc29sZS5sb2coJ2R5bmFtaWNMZXhlbWUnLCByZWxldmFudC5hdCgwKT8ucmVmZXJlbnQpXG5cbiAgICByZXR1cm4gbWFrZUxleGVtZSh7XG4gICAgICAgIHRva2VuOiB3b3JkLFxuICAgICAgICByb290OiByZWxldmFudD8uYXQoMCk/LnJvb3QgPz8gd29yZCxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgcmVmZXJlbnQ6IHJlbGV2YW50LmF0KDApPy5yZWZlcmVudCxcbiAgICB9KVxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuc3ludGF4TGlzdClcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zaW1wbGlmeShhc3QpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkge1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICghYXN0LmxpbmtzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KGFzdC50eXBlKVxuXG4gICAgICAgIGlmIChzeW50YXgubGVuZ3RoID09PSAxICYmIE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKVswXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpbXBsZUxpbmtzID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyhhc3QubGlua3MpXG4gICAgICAgICAgICAubWFwKGwgPT4gKHsgW2xbMF1dOiB0aGlzLnNpbXBsaWZ5KGxbMV0pIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4geyAuLi5hc3QsIGxpbmtzOiBzaW1wbGVMaW5rcyB9XG5cbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ncmFtbWFyKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuLi8uLi90ZXN0cy9hdXRvdGVzdGVyXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlVW53cmFwcGVkKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgICAgICAgICBtYWluKClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSk7XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBzb2x2ZU1hcHMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvc29sdmVNYXBzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIClcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCR7eWVzfWAgOiB5ZXNcbiAgICB9XG5cbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHsgLy8gY2FuJ3QgYmUgcHJvcCwgYmVjYXVzZSB3b3VsZCBiZSBjYWxsZWQgaW4gQW5kJ3MgY29ucywgQmFzaWNDbHVzZS5hbmQoKSBjYWxscyBBbmQncyBjb25zLCBcXGluZiByZWN1cnNpb24gZW5zdWVzXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCBpdCA9IG9wdHM/Lml0ID8/IHNvcnRJZHModW5pdmVyc2UuZW50aXRpZXMpLmF0KC0xKSEgLy9UT0RPIVxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlTGlzdCA9IHVuaXZlcnNlLmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgcXVlcnlMaXN0ID0gcXVlcnkuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBtYXBzID0gc29sdmVNYXBzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgICAgIGNvbnN0IHByb25NYXA6IE1hcCA9IHF1ZXJ5TGlzdC5maWx0ZXIoYyA9PiBjLnByZWRpY2F0ZT8udHlwZSA9PT0gJ3Byb25vdW4nKS5tYXAoYyA9PiAoeyBbYy5hcmdzPy5hdCgwKSFdOiBpdCB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgY29uc3QgcmVzID0gbWFwcy5jb25jYXQocHJvbk1hcCkuZmlsdGVyKG0gPT4gT2JqZWN0LmtleXMobSkubGVuZ3RoKSAvLyBlbXB0eSBtYXBzIGNhdXNlIHByb2JsZW1zIGFsbCBhcm91bmQgdGhlIGNvZGUhXG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcblxuZXhwb3J0IGNsYXNzIEF0b21DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgQXRvbUNsYXVzZShcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXA/LlthXSA/PyBhKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICApXG5cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGlmICghKHF1ZXJ5IGluc3RhbmNlb2YgQXRvbUNsYXVzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJlZGljYXRlLnJvb3QgIT09IHF1ZXJ5LnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHF1ZXJ5LmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBBdG9tQ2xhdXNlIH0gZnJvbSBcIi4vQXRvbUNsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcblxuLyoqXG4gKiBBbiB1bmFtYmlndW91cyBwcmVkaWNhdGUtbG9naWMtbGlrZSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBwcm9ncmFtbWVyJ3MgaW50ZW50LlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzPzogYm9vbGVhblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBBdG9tQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IGZhbHNlXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpcy5jb25kaXRpb25cbiAgICByZWFkb25seSByaGVtZSA9IHRoaXMuY29uc2VxdWVuY2VcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jb25kaXRpb24udG9TdHJpbmcoKSArIHRoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEltcGx5KFxuICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICBvcHRzPy5zdWJqY29uaiA/PyB0aGlzLnN1Ympjb25qLFxuICAgIClcblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnN1Ympjb25qPy5yb290ID8/ICcnfSAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW3RoaXNdXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHtcbiAgICAgICAgICAgIGNsYXVzZTE6IHRoaXMuY29uZGl0aW9uLnNpbXBsZSxcbiAgICAgICAgICAgIGNsYXVzZTI6IHRoaXMuY29uc2VxdWVuY2Uuc2ltcGxlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IFRoaW5nLCB7IHdyYXAgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZy9UaGluZ1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBldmFsQXN0KGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhc3Q/LmxpbmtzPy5jb3B1bGEpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5pdmVyYj8ubGV4ZW1lIHx8IGFzdD8ubGlua3M/Lm12ZXJiPy5sZXhlbWUpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8uc3ViY29uaikge1xuICAgICAgICByZXR1cm4gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5ub25zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcG91bmRTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQsIGFzdCwgYXJncykgIC8vbm91bnBocmFzZSBpcyB0aGUgXCJhdG9tXCJcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdCA9IGV2YWxBc3QoY29udGV4dCwgYXN0Py5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IHRydWUgfSlcbiAgICBjb25zdCBwcmVkaWNhdGUgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0Py5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSkvLywgeyBzdWJqZWN0OiBzdWJqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlIH0pXG5cbiAgICAvLyBjb25zdCB0ZXN0ID0gZXZhbEFzdChjb250ZXh0LCAgYXN0Py5saW5rcz8ucHJlZGljYXRlLCB7c3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOnRydWV9KVxuICAgIC8vIGNvbnNvbGUubG9nKHRlc3QpXG5cbiAgICBzdWJqZWN0LmZvckVhY2gocyA9PiB7XG4gICAgICAgIHByZWRpY2F0ZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICBzLnNldChjLnByZWRpY2F0ZT8ucmVmZXJlbnQhLCB7IG5lZ2F0ZWQ6ICEhYXN0Py5saW5rcz8ubmVnYXRpb24gfSlcbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgc3ViamVjdC5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBjb250ZXh0LnNldChzKVxuICAgICAgICBzLnNldFBhcmVudChjb250ZXh0KVxuICAgIH0pXG5cbiAgICByZXR1cm4gW10vL1RPRE9cbn1cblxuZnVuY3Rpb24gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG4gICAgdGhyb3cgJ1RPRE8hJ1xufVxuXG5mdW5jdGlvbiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyAnVE9ETyEnXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyAnVE9ETyEnXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGNvbnN0IG5wID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdCwgYXJncylcblxuICAgIC8vIGNoZWNrcyBmb3IgVGhpbmdzIHRoYXQgbWF0Y2ggZ2l2ZW4gbm91bnBocmFzZVxuICAgIC8vIDEuIGluIGN1cnJlbnQgc2VudGVuY2Ugc2NvcGVcbiAgICAvLyAyLiBpbiBicm9hZGVyIGNvbnRleHRcbiAgICBjb25zdCBjdXJyZW50U2NvcGUgPSAoKGNvbnRleHQgYXMgYW55KS5jdXJyZW50U2NvcGUgYXMgQ2xhdXNlKSA/PyBlbXB0eUNsYXVzZVxuICAgIGNvbnN0IG1hcHMgPSBjdXJyZW50U2NvcGUucXVlcnkobnApLmNvbmNhdChjb250ZXh0LnF1ZXJ5KG5wKSk7ICAgICAgICAgICAgICAgICAgLy8gY29uc3QgbnAyID0gbnAuY29weSh7bWFwIDogbWFwc1swXSA/PyB7fX0pO1xuXG4gICAgY29uc3QgaW50ZXJlc3RpbmdJZHMgPSBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzKTtcblxuICAgIC8vIFRNUCAob25seSkgdXNlIGNvbnRleHQgdG8gcGFzcyBhcm91bmQgZGF0YSBhYm91dCBcImN1cnJyZW50IHNlbnRlbmNlXCIsIHl1Y2shIFBPU1NJQkxFIEJVR1MhXG4gICAgKGNvbnRleHQgYXMgYW55KS5jdXJyZW50U2NvcGUgPSBucFxuXG4gICAgY29uc3QgdGhpbmdzID0gaW50ZXJlc3RpbmdJZHMubWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSkuZmlsdGVyKHggPT4geCkubWFwKHggPT4geCBhcyBUaGluZyk7XG5cbiAgICBpZiAoaXNQbHVyYWwoYXN0KSkgeyAvLyBpZiB1bml2ZXJzYWwgcXVhbnRpZmllZCwgSSBkb24ndCBjYXJlIGlmIHRoZXJlJ3Mgbm8gbWF0Y2hcbiAgICAgICAgcmV0dXJuIHRoaW5nc1xuICAgIH1cblxuICAgIGlmICh0aGluZ3MubGVuZ3RoKSB7IC8vIG5vbi1wbHVyYWwsIHJldHVybiBzaW5nbGUgZXhpc3RpbmcgVGhpbmdcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCAxKVxuICAgIH1cblxuICAgIC8vIG9yIGVsc2UgY3JlYXRlIGFuZCByZXR1cm5zIHRoZSBUaGluZ1xuICAgIHJldHVybiBhcmdzPy5hdXRvdml2aWZpY2F0aW9uID8gW2NyZWF0ZVRoaW5nKGNvbnRleHQsIG5wKV0gOiBbXVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IChhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3Qgbm91bnMgPSAoYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IE9iamVjdC52YWx1ZXMoYXN0Py5saW5rcyA/PyB7fSkuZmlsdGVyKHggPT4geC5saXN0KS5mbGF0TWFwKHggPT4geC5saXN0ISkuZmlsdGVyKHggPT4geC5saW5rcz8ucHJlcG9zaXRpb24pLm1hcCh4ID0+IGNvbXBsZW1lbnRUb0NsYXVzZSh4LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgcmV0dXJuIGFkamVjdGl2ZXMuYW5kKG5vdW5zKS5hbmQoY29tcGxlbWVudHMpXG4gICAgLy9UT0RPOiBzdWJjbGF1c2VcblxufVxuXG5mdW5jdGlvbiBjb21wbGVtZW50VG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0IVxuICAgIGNvbnN0IG9iamVjdElkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBhc3Q/LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lIVxuICAgIGNvbnN0IG9iamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlIH0pXG5cbiAgICByZXR1cm4gY2xhdXNlT2YocHJlcG9zaXRpb24sIHN1YmplY3RJZCwgb2JqZWN0SWQpLmFuZChvYmplY3QpXG5cbn1cblxuZnVuY3Rpb24gcmVsYXRpdmVDbGF1c2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gZW1wdHlDbGF1c2UgLy9UT0RPIVxufVxuXG5mdW5jdGlvbiBpc1BsdXJhbChhc3Q/OiBBc3ROb2RlKSB7XG5cbiAgICByZXR1cm4gYXN0Py5saW5rcz8ubm91bj8ubGV4ZW1lPy5pc1BsdXJhbFxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5hZGplY3RpdmU/LmxleGVtZT8uaXNQbHVyYWxcbiAgICAgICAgfHwgYXN0Py5saW5rcz8ubm91bj8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lPy5pc1BsdXJhbClcbiAgICAgICAgfHwgYXN0Py5saW5rcz8uYWRqZWN0aXZlPy5saXN0Py5zb21lKHggPT4geC5sZXhlbWU/LmlzUGx1cmFsKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5zdWJqZWN0Py5saXN0Py5zb21lKHggPT4geC5sZXhlbWU/LmlzUGx1cmFsKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy51bmlxdWFudFxuXG59XG5cbmZ1bmN0aW9uIGdldEludGVyZXN0aW5nSWRzKG1hcHM6IE1hcFtdKTogSWRbXSB7XG5cbiAgICAvLyB0aGUgb25lcyB3aXRoIG1vc3QgZG90cywgYmVjYXVzZSBcImNvbG9yIG9mIHN0eWxlIG9mIGJ1dHRvblwiIFxuICAgIC8vIGhhcyBidXR0b25JZC5zdHlsZS5jb2xvciBhbmQgdGhhdCdzIHRoZSBvYmplY3QgdGhlIHNlbnRlbmNlIHNob3VsZCByZXNvbHZlIHRvXG4gICAgLy8gcG9zc2libGUgcHJvYmxlbSBpZiBcImNvbG9yIG9mIGJ1dHRvbiBBTkQgYnV0dG9uXCJcbiAgICBjb25zdCBpZHMgPSBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKVxuICAgIGNvbnN0IG1heExlbiA9IE1hdGgubWF4KC4uLmlkcy5tYXAoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkpKVxuICAgIHJldHVybiBpZHMuZmlsdGVyKHggPT4gZ2V0TnVtYmVyT2ZEb3RzKHgpID09PSBtYXhMZW4pXG5cbn1cblxuY29uc3QgZ2V0TnVtYmVyT2ZEb3RzID0gKGlkOiBJZCkgPT4gaWQuc3BsaXQoJy4nKS5sZW5ndGggLy8tMVxuXG5mdW5jdGlvbiBjcmVhdGVUaGluZyhjb250ZXh0OiBDb250ZXh0LCBjbGF1c2U6IENsYXVzZSk6IFRoaW5nIHtcblxuICAgIGNvbnN0IHRoaW5nID0gd3JhcCh7IGlkOiBnZXRJbmNyZW1lbnRhbElkKCkgfSlcblxuICAgIGNsYXVzZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG5cbiAgICAgICAgY29uc3QgbGV4ZW1lID0gYy5wcmVkaWNhdGUhXG5cbiAgICAgICAgaWYgKCFsZXhlbWUucmVmZXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChsZXhlbWUudHlwZSA9PT0gJ25vdW4nKSBsZXhlbWUucmVmZXJlbnQgPSB0aGluZ1xuICAgICAgICAgICAgY29udGV4dC5zZXRMZXhlbWUobGV4ZW1lKSAvLyBUT0RPOiBubyBzaWRlIGVmZmVjdHMgb24gY29udGV4dCEhISFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaW5nLnNldChsZXhlbWUucmVmZXJlbnQsIHsgbmVnYXRlZDogY2xhdXNlLm5lZ2F0ZWQgfSlcbiAgICAgICAgfVxuXG4gICAgfSlcblxuICAgIHJldHVybiB0aGluZ1xufVxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWQsXG4gICAgYXV0b3ZpdmlmaWNhdGlvbjogYm9vbGVhbixcbn0iLCJcbi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IHN0cmluZ1xuXG4vKipcbiAqIFNvbWUgc3BlY2lhbCBJZHNcbiAqL1xuZXhwb3J0IGNvbnN0IFNwZWNpYWxJZHMgPSB7XG4gICAgSU1QT1NTSUJMRTogJ0lNUE9TU0lCTEUnXG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZCgpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBuZXdJZFxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEtleXMob2JqZWN0OiBvYmplY3QsIGl0ZXIgPSA1KSB7XG5cbiAgICBsZXQgb2JqID0gb2JqZWN0XG4gICAgbGV0IHJlczogc3RyaW5nW10gPSBbXVxuXG4gICAgd2hpbGUgKG9iaiAmJiBpdGVyKSB7XG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5rZXlzKG9iaildXG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaildXG4gICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopXG4gICAgICAgIGl0ZXItLVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbn0iLCJpbXBvcnQgeyBuZXdJbnN0YW5jZSB9IGZyb20gXCIuL25ld0luc3RhbmNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDb3B5KG9iamVjdDogb2JqZWN0KSB7XG5cbiAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgLy8gcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4geyBfX3Byb3RvX186IG9iamVjdCB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZCA9IG9iamVjdC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgcmV0dXJuIHdyYXBwZWRcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG5ld0luc3RhbmNlKG9iamVjdClcbiAgICB9XG5cbiAgICAvLyBpZiAob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAvLyAgICAgY29uc3Qgd3JhcHBlZCA9IG9iamVjdC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnRcbiAgICAvLyAgICAgd3JhcHBlZC5pbm5lckhUTUwgPSBvYmplY3QuaW5uZXJIVE1MXG4gICAgLy8gICAgIHJldHVybiB3cmFwcGVkXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgLy8gcmV0dXJuIHsgLi4ub2JqZWN0IH1cbiAgICAvLyAgICAgcmV0dXJuIHsgX19wcm90b19fOiBvYmplY3QgfVxuICAgIC8vIH1cblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJpbXBvcnQgeyB0YWdOYW1lRnJvbVByb3RvIH0gZnJvbSBcIi4vdGFnTmFtZUZyb21Qcm90b1wiXG5cbi8qKlxuICogXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYW4gb2JqZWN0IChldmVuIEhUTUxFbGVtZW50KSBmcm9tIGEgcHJvdG90eXBlLlxuICogSW4gY2FzZSBpdCdzIGEgbnVtYmVyLCBubyBuZXcgaW5zdGFuY2UgaXMgbWFkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ld0luc3RhbmNlKHByb3RvOiBvYmplY3QsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBpZiAocHJvdG8gPT09IE51bWJlci5wcm90b3R5cGUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXJnc1swXSlcbiAgICB9XG5cbiAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB0YWdOYW1lID0gdGFnTmFtZUZyb21Qcm90byhwcm90bylcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHRhZ05hbWVcbiAgICAgICAgcmV0dXJuIGVsZW1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IChwcm90byBhcyBhbnkpLmNvbnN0cnVjdG9yKC4uLmFyZ3MpXG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiXG4vKipcbiAqIFRyeSBnZXR0aW5nIHRoZSBuYW1lIG9mIGFuIGh0bWwgZWxlbWVudCBmcm9tIGEgcHJvdG90eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IG9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgLnJlcGxhY2UoJ0hUTUwnLCAnJylcbiAgICAucmVwbGFjZSgnRWxlbWVudCcsICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgbGV0IHNlZW4gPSB7fSBhcyBhbnlcblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsImltcG9ydCB7IHRlc3QxIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDFcIlxuaW1wb3J0IHsgdGVzdDEwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEwXCJcbmltcG9ydCB7IHRlc3QxMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxMVwiXG5pbXBvcnQgeyB0ZXN0MTIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTJcIlxuaW1wb3J0IHsgdGVzdDEzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEzXCJcbmltcG9ydCB7IHRlc3QxNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxNFwiXG5pbXBvcnQgeyB0ZXN0MTUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTVcIlxuaW1wb3J0IHsgdGVzdDE2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE2XCJcbmltcG9ydCB7IHRlc3QxNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxN1wiXG5pbXBvcnQgeyB0ZXN0MTggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MThcIlxuaW1wb3J0IHsgdGVzdDE5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE5XCJcbmltcG9ydCB7IHRlc3QyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDJcIlxuaW1wb3J0IHsgdGVzdDIwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIwXCJcbmltcG9ydCB7IHRlc3QyMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyMVwiXG5pbXBvcnQgeyB0ZXN0MjIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjJcIlxuaW1wb3J0IHsgdGVzdDIzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIzXCJcbmltcG9ydCB7IHRlc3QyNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyNFwiXG5pbXBvcnQgeyB0ZXN0MjUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjVcIlxuaW1wb3J0IHsgdGVzdDI2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI2XCJcbmltcG9ydCB7IHRlc3QyNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyN1wiXG5pbXBvcnQgeyB0ZXN0MjggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjhcIlxuaW1wb3J0IHsgdGVzdDI5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI5XCJcbmltcG9ydCB7IHRlc3QzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDNcIlxuaW1wb3J0IHsgdGVzdDMwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMwXCJcbmltcG9ydCB7IHRlc3QzMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzMVwiXG5pbXBvcnQgeyB0ZXN0MzIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzJcIlxuaW1wb3J0IHsgdGVzdDMzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMzXCJcbmltcG9ydCB7IHRlc3QzNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzNFwiXG5pbXBvcnQgeyB0ZXN0MzUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzVcIlxuaW1wb3J0IHsgdGVzdDM2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM2XCJcbmltcG9ydCB7IHRlc3QzNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzN1wiXG5pbXBvcnQgeyB0ZXN0MzggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzhcIlxuaW1wb3J0IHsgdGVzdDQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0NFwiXG5pbXBvcnQgeyB0ZXN0NSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q1XCJcbmltcG9ydCB7IHRlc3Q2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDZcIlxuaW1wb3J0IHsgdGVzdDcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0N1wiXG5pbXBvcnQgeyB0ZXN0OCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q4XCJcbmltcG9ydCB7IHRlc3Q5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDlcIlxuaW1wb3J0IHsgY2xlYXJEb20gfSBmcm9tIFwiLi91dGlscy9jbGVhckRvbVwiXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gXCIuL3V0aWxzL3NsZWVwXCJcblxuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuICAgIHRlc3QxOCxcbiAgICAvLyB0ZXN0MTksIC8vIHVzZXMgaWZcbiAgICB0ZXN0MjAsXG4gICAgdGVzdDIxLFxuICAgIHRlc3QyMixcbiAgICB0ZXN0MjMsXG4gICAgdGVzdDI0LFxuICAgIHRlc3QyNSxcbiAgICB0ZXN0MjYsXG4gICAgdGVzdDI3LFxuICAgIHRlc3QyOCxcbiAgICB0ZXN0MjksXG4gICAgLy8gdGVzdDMwLC8vIGR5bmFtaWNhbGx5IGRlZmluaW5nIGEgY29wdWxhXG4gICAgdGVzdDMxLFxuICAgIC8vIHRlc3QzMixcbiAgICB0ZXN0MzMsXG4gICAgLy8gdGVzdDM0LC8vIGR5bmFtaWNhbGx5IGRlZmluaW5nIGFuIGFsaWFzXG4gICAgdGVzdDM1LFxuICAgIC8vIHRlc3QzNiwgLy8gZHluYW1pY2FsbHkgZGVmaW5pbmcgYW4gbXZlcmJcbiAgICB0ZXN0MzcsXG4gICAgdGVzdDM4LFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gdGVzdCgpXG4gICAgICAgIGNvbnNvbGUubG9nKGAlYyR7c3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsJ30gJHt0ZXN0Lm5hbWV9YCwgYGNvbG9yOiR7c3VjY2VzcyA/ICdncmVlbicgOiAncmVkJ31gKVxuICAgICAgICBhd2FpdCBzbGVlcCgxMCkvLzc1XG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uIHogaXMgYSBibHVlIGJ1dHRvbi4gdGhlIHJlZCBidXR0b24uIGl0IGlzIGJsYWNrLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmx1ZSc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDExKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd3IGFuZCB6IGFyZSBibGFjaycpO1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZDtcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0MyAmJiBhc3NlcnQ0O1xuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYXBwZW5kQ2hpbGRzIHknKTtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXSk7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgLy8gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbiBhbmQgdGhlIGJ1dHRvbiBpcyBncmVlbicpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4gaXQgaXMgZ3JlZW4nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZCBhbmQgeiBpcyBncmVlbi4nKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKTtcblxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MjtcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE1KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gZXZlcnkgYnV0dG9uIGlzIGJsdWUuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneiBpcyByZWQuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZXZlcnkgYnV0dG9uIGlzIG5vdCBibHVlLicpO1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG5cbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBoaWRkZW4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLmhpZGRlbjtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIG5vdCBoaWRkZW4nKTtcbiAgICBjb25zdCBhc3NlcnQyID0gIWJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5oaWRkZW47XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24nKTtcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdO1xuICAgIHgub25jbGljayA9ICgpID0+IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBjbGlja3MnKTtcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE4KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZXZlcnkgcmVkIGJ1dHRvbiBpcyBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xuXG59XG4iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CYXNpY0JyYWluXCI7XG5pbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBjb25zdCB2MSA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LnZhbHVlcy5sZW5ndGg7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IHYyID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQudmFsdWVzLmxlbmd0aDtcbiAgICByZXR1cm4gdjIgLSB2MSA9PT0gMTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbiBpZiB4IGlzIHJlZCcpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGNvbG9yIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgcmVkLiB4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIHJlZCBidXR0b25zJyk7XG4gICAgbGV0IGNsaWNrcyA9ICcnO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd4JztcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0ub25jbGljayA9ICgpID0+IGNsaWNrcyArPSAneSc7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZXZlcnkgYnV0dG9uIGNsaWNrcycpO1xuICAgIHJldHVybiBjbGlja3MgPT09ICd4eSc7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgYnV0dG9ucy4geCBpcyByZWQgYW5kIHkgaXMgYmx1ZScpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3RoZSBidXR0b24gdGhhdCBpcyBibHVlIGlzIGJsYWNrJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYnV0dG9ucyBhcmUgcmVkJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZC4geiBpcyBibHVlLicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zIGFyZSBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsdWUnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdibGFjayBidXR0b25zJykubGVuZ3RoID09PSAyO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdib3JkZXIgb2Ygc3R5bGUgb2YgeCBpcyBkb3R0ZWQteWVsbG93Jyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJvcmRlci5pbmNsdWRlcygnZG90dGVkIHllbGxvdycpO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyAxIGFuZCB5IGlzIDInKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFkZHMgeScpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdpdCcpWzBdID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneSBpcyBhIGJ1dHRvbi4geCBpcyByZWQuIHkgaXMgYSBncmVlbiBidXR0b24uIHggaXMgYSBidXR0b24uIHogaXMgYSBibGFjayBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgYmxhY2sgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgYnV0dG9ucy4geCBpcyBncmVlbiBhbmQgeSBpcyByZWQuJyk7XG4gICAgY29uc3QgcmVzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnY29sb3Igb2YgdGhlIHJlZCBidXR0b24nKTtcbiAgICByZXR1cm4gcmVzLmluY2x1ZGVzKCdyZWQnKSAmJiAhcmVzLmluY2x1ZGVzKCdncmVlbicpO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIC8vIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgZGl2IGFuZCB0aGUgd2lkdGggb2Ygc3R5bGUgb2YgdGhlIGRpdiBpcyA1MHZ3JylcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGRpdi4gdGhlIHdpZHRoIG9mIHN0eWxlIG9mIGl0IGlzIDUwdncnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGRpdicpWzBdLnN0eWxlLndpZHRoID09PSAnNTB2dyc7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdzb21ldGhpbmcgYnV0dG9uJykubGVuZ3RoID09PSAwO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkJyk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB5IGlzIGdyZWVuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhcHBlbmRDaGlsZHMgeScpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ogaXMgYW4geCcpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbicpO1xuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZDtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHRoZSBjb2xvciBvZiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG4gICAgcmV0dXJuIGFzc2VydDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB5IGlzIGEgYnV0dG9uLiB6IGlzIGEgYnV0dG9uLiBldmVyeSBidXR0b24gaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0Mztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYnV0dG9uJylbMF0udGV4dENvbnRlbnQgPT09ICdjYXByYSc7XG4gICAgcmV0dXJuIGFzc2VydDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0OSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbicpLmxlbmd0aCA9PT0gMDtcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZ3JlZW4gYnV0dG9uJykubGVuZ3RoID09PSAxO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY2xlYXJEb20oKSB7XG4gICAgY29uc3QgeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKVxuICAgIGRvY3VtZW50LmJvZHkgPSB4XG59IiwiZXhwb3J0IGZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==