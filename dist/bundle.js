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
        this.name = this.args.name;
        this.getLexemes = () => {
            // console.log('getLexemes!')
            const lexemes = this.getAllKeys().flatMap(x => {
                try {
                    const o = this.get(x);
                    if (o === undefined) {
                        return [];
                    }
                    const unwrapped = o === null || o === void 0 ? void 0 : o.unwrap();
                    const lex = (0, Lexeme_1.makeLexeme)({
                        type: (0, typeOf_1.typeOf)(unwrapped),
                        root: x,
                        referent: o,
                    });
                    return [lex];
                }
                catch (_a) {
                    return [];
                }
            });
            return lexemes.concat(lexemes.flatMap(l => l.extrapolate()));
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
        if (this.object) {
            return new BaseThing({
                id: (_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id,
                object: (0, deepCopy_1.deepCopy)(this.object),
            });
        }
        if (this.base) {
            return new BaseThing({
                id: (_b = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _b !== void 0 ? _b : this.id,
                superclass: this.superclass,
                base: this.base.copy(),
            });
        }
        throw 'TODO!';
    }
    unwrap() {
        var _a, _b;
        return (_a = this.object) !== null && _a !== void 0 ? _a : (_b = this.base) === null || _b === void 0 ? void 0 : _b.unwrap();
    }
    set(predicate, opts) {
        // console.log(predicate)
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
        var _a;
        if (relation.predicate.superclass === things_1.colorThing) {
            const style = (_a = this.get('style')) === null || _a === void 0 ? void 0 : _a.unwrap();
            style.background = relation.predicate.unwrap();
        }
        this.inherit(relation.predicate);
    }
    undo(relation) {
        this.disinherit(relation.predicate);
    }
    keep(relation) {
    }
    addRelation(relation) {
        this.relations.push(relation);
    }
    removeRelation(relation) {
        this.relations = this.relations.filter(x => !relationsEqual(relation, x));
    }
    isAlready(relation) {
        return (!relation.args.length && relation.predicate === this)
            || this.relations.some(x => relationsEqual(x, relation));
    }
    inherit(added) {
        //TODO: prevent re-creation of existing DOM elements
        var _a;
        this.base = added.copy();
        this.superclass = added;
        if (this.base.unwrap() instanceof HTMLElement && this.parent instanceof BasicContext_1.default) {
            (_a = this.parent.root) === null || _a === void 0 ? void 0 : _a.appendChild(this.base.unwrap());
        }
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
        const fillerClause = (0, Clause_1.clauseOf)((0, Lexeme_1.makeLexeme)({ root: this.id.toString(), type: 'noun' }), this.id); //TODO
        const res = queryOrEmpty
            .flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => { var _a; return this.isAlready({ predicate: (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referent, args: [] }); })
            .map(x => x.copy({ map: { [x.args[0]]: this.id } }))
            .concat(fillerClause)
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
        var _a, _b;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause, (0, topLevel_1.getTopLevel)(clause)[0]);
        // console.log('clause=', clause.toString(), 'oc=', oc, 'name=', this.name)
        if (oc.length === 1) { //BASECASE: check yourself
            //TODO: also handle non-ownership non-intransitive relations!
            //TODO: handle non BasicClauses!!!! (that don't have ONE predicate!)
            // if (clause.simple.predicate && (this.is(clause.simple.predicate) || this.name === clause.simple.predicate?.root)) {
            if (this.object === ((_b = (_a = clause.simple.predicate) === null || _a === void 0 ? void 0 : _a.referent) === null || _b === void 0 ? void 0 : _b.unwrap())) { //this.name === clause.simple.predicate?.root    
                return [Object.assign(Object.assign({}, parentMap), { [clause.entities[0]]: this.id })];
            }
            return []; //TODO
        }
        // check your children!
        const top = (0, topLevel_1.getTopLevel)(clause);
        const peeled = clause.flatList()
            .filter(x => x.entities.every(e => !top.includes(e)))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause);
        const relevantNames = /* or clause??? */ peeled.flatList().flatMap(x => { var _a, _b; return [(_a = x.predicate) === null || _a === void 0 ? void 0 : _a.root, (_b = x.predicate) === null || _b === void 0 ? void 0 : _b.token]; }).filter(x => x).map(x => x);
        const children = this.getAllKeys()
            .map(x => { var _a; return ({ name: x, obj: (_a = this.get(x)) === null || _a === void 0 ? void 0 : _a.unwrap() }); })
            .filter(x => relevantNames.includes(x.name)) // performance
            .filter(x => x.obj !== this.object)
            .map(x => new BaseThing({ object: x.obj, id: `${this.id}.${x.name}`, parent: this, name: x.name }));
        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }));
        return res;
    }
}
exports.BaseThing = BaseThing;
function relationsEqual(r1, r2) {
    return r1.predicate === r2.predicate
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
exports.things = exports.redThing = exports.colorThing = exports.divThing = exports.buttonThing = exports.thing = void 0;
const Thing_1 = __webpack_require__(/*! ../backend/thing/Thing */ "./app/src/backend/thing/Thing.ts");
exports.thing = (0, Thing_1.wrap)({ id: 'thing', object: {} /* BaseThing */ });
exports.buttonThing = (0, Thing_1.wrap)({ id: 'button', object: HTMLButtonElement.prototype });
exports.divThing = (0, Thing_1.wrap)({ id: 'div', object: HTMLDivElement.prototype });
exports.colorThing = (0, Thing_1.wrap)({ id: 'color', object: {} });
exports.redThing = (0, Thing_1.wrap)({ id: 'red', object: 'red' });
exports.redThing.set(exports.colorThing);
exports.things = [
    exports.thing,
    exports.buttonThing,
    exports.divThing,
    exports.colorThing,
    exports.redThing,
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
    subject.forEach(s => {
        predicate.flatList().forEach(c => {
            var _a, _b;
            s.set((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.referent, { negated: !!((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.negation) });
        });
    });
    subject.forEach(s => context.set(s));
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
    const thing = (0, Thing_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)(), parent: context }); //TODO: don't add to context? implicitly added by thing.set() inherit
    clause.flatList().forEach(c => {
        const lexeme = c.predicate;
        if (!lexeme.referent) {
            if (lexeme.type === 'noun')
                lexeme.referent = thing;
            context.setLexeme(lexeme);
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
    return proto instanceof HTMLElement ?
        document.createElement((0, tagNameFromProto_1.tagNameFromProto)(proto)) :
        new proto.constructor(...args);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsRUFBRTtJQUNwRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRTtJQUNuQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUNuQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUNwQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUN4QyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUMxQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUNoQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtJQUNqQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUNqQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUNuQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRTtJQUNuQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtJQUNqQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsY0FBSyxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxvQkFBVyxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBUSxFQUFFO0lBQ2pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxtQkFBVSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBUSxFQUFFO0NBRXBEOzs7Ozs7Ozs7Ozs7OztBQzVEWSxlQUFPLEdBQWE7SUFFM0IsVUFBVTtJQUNWLHNDQUFzQztJQUN0QywrQkFBK0I7SUFDL0IsbURBQW1EO0lBRW5EOzs7bUNBRzZCO0lBRTdCOzs7Ozt1Q0FLaUM7SUFFakMsbUVBQW1FO0lBQ25FLCtEQUErRDtJQUMvRCxnREFBZ0Q7SUFFaEQ7OzhFQUV3RTtJQUV4RTs7OzswQkFJb0I7SUFFcEI7OzthQUdPO0lBRVAsd0VBQXdFO0lBRXhFOztxQ0FFK0I7SUFFL0I7OztxQ0FHK0I7SUFFL0IsU0FBUztJQUNULHNCQUFzQjtJQUN0Qiw0REFBNEQ7SUFFNUQsb0RBQW9EO0lBQ3BELGlEQUFpRDtJQUNqRCwyQ0FBMkM7Q0FDaEQ7Ozs7Ozs7Ozs7Ozs7O0FDdERELGlIQUF3RDtBQUkzQyx3QkFBZ0IsR0FBRyxtQ0FBYyxFQUMxQyxPQUFPLEVBQ1AsV0FBVyxFQUNYLGFBQWEsQ0FDaEI7QUFFWSw0QkFBb0IsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFFaEQsZ0JBQVEsR0FBYztJQUUvQixPQUFPLEVBQUU7UUFDTCxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDekQsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtLQUN2QztJQUNELFdBQVcsRUFBRTtRQUNULEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDdEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ3RDO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQ2hDLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtLQUN2QztDQUVKOzs7Ozs7Ozs7Ozs7OztBQzlCRCxzR0FBNkM7QUFFaEMsYUFBSyxHQUFHLGdCQUFJLEVBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDekQsbUJBQVcsR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDekUsZ0JBQVEsR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hFLGtCQUFVLEdBQUcsZ0JBQUksRUFBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQzlDLGdCQUFRLEdBQUcsZ0JBQUksRUFBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQzFELGdCQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFVLENBQUM7QUFHWCxjQUFNLEdBQUc7SUFDbEIsYUFBSztJQUNMLG1CQUFXO0lBQ1gsZ0JBQVE7SUFDUixrQkFBVTtJQUNWLGdCQUFRO0NBQ1g7Ozs7Ozs7Ozs7Ozs7QUNoQkQsc0lBQW9FO0FBQ3BFLGlHQUErQztBQUsvQyxNQUFxQixVQUFVO0lBRTNCLFlBQ2EsT0FBZ0I7UUFBaEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUV6QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxPQUFPLENBQUMsT0FBZTtRQUNuQixPQUFPLHNCQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFFekQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO2dCQUMzQixPQUFPLEVBQUU7YUFDWjtZQUVELE1BQU0sR0FBRyxHQUFHLHFCQUFPLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7WUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxPQUFPLEdBQUc7UUFFZCxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7SUFDYixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsT0FBZTtRQUM1QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsb0JBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxNQUFNLCtDQUFULENBQUMsQ0FBWSxtQ0FBSSxDQUFDLElBQUM7SUFDN0QsQ0FBQztDQUVKO0FBNUJELGdDQTRCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0QsdUdBQStEO0FBQy9ELHNIQUFxQztBQVlyQyxTQUFnQixRQUFRLENBQUMsSUFBa0I7SUFDdkMsT0FBTyxJQUFJLG9CQUFVLENBQUMsd0JBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRkQsNEJBRUM7Ozs7Ozs7Ozs7Ozs7QUNmRCw4RkFBK0M7QUFFL0MsOEdBQWdFO0FBR2hFLHFJQUFtRTtBQUNuRSxxSUFBbUU7QUFHbkUsTUFBcUIsWUFBWTtJQWM3QixZQUFxQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVoxQixXQUFNLEdBQUcsc0JBQVMsR0FBRTtRQUNWLHlCQUFvQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CO1FBQ3ZELGNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFDekMsZ0JBQVcsR0FBb0IsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNuRCxhQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO1FBQy9CLFlBQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87UUFDN0IsZ0JBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7UUFDckMsUUFBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztRQUNyQixVQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO1FBQ3pCLFNBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7UUFDdkIsUUFBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztRQXVCOUIsY0FBUyxHQUFHLENBQUMsV0FBbUIsRUFBc0IsRUFBRTtZQUNwRCxPQUFPLElBQUksQ0FBQyxRQUFRO2lCQUNmLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUM5RCxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQztRQWlCRCxjQUFTLEdBQUcsQ0FBQyxLQUFjLEVBQUUsRUFBRTtZQUMzQixNQUFNLE1BQU0sR0FBRyxpQ0FBYSxFQUFDLEtBQUssQ0FBQztZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFxQixDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU07WUFDNUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQzNDLENBQUM7UUFFRCxjQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTs7WUFDMUIsT0FBTyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQXFCLENBQUMsbUNBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLDRDQUE0QztRQUM5SCxDQUFDO1FBRUQsY0FBUyxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7WUFFM0IsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQ3BFO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBM0RHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBRXRCLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQVUsRUFBQztnQkFDdEIsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsSUFBSSxFQUFFLFNBQVM7YUFDbEIsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO0lBRU4sQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO0lBQzdCLENBQUM7SUFRUyxhQUFhO1FBQ25CLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBb0I7UUFDeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFhLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVc7SUFDM0IsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVE7SUFDeEIsQ0FBQztJQXVCRCxJQUFJLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7UUFDOUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUN0QyxPQUFPLEdBQUc7SUFDZCxDQUFDO0NBRUo7QUFuRkQsa0NBbUZDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdGRCwrSEFBOEU7QUFNOUUsOEhBQTBDO0FBaUIxQyxTQUFnQixVQUFVLENBQUMsSUFBb0I7SUFDM0MsT0FBTyxJQUFJLHNCQUFZLENBQUMsb0JBQVMsRUFBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRkQsZ0NBRUM7Ozs7Ozs7Ozs7Ozs7QUN4QkQseUlBQStEO0FBQy9ELHdIQUFpRDtBQUNqRCx3SEFBaUQ7QUFDakQsMkZBQTZDO0FBRTdDLE1BQXFCLFVBQVU7SUFZM0IsWUFDYSxPQUF5Qjs7UUFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFYdEMsVUFBSyxHQUFHLFVBQUksQ0FBQyxPQUFPLDBDQUFFLEtBQUs7UUFDbEIsU0FBSSxHQUFHLGdCQUFJLENBQUMsT0FBTywwQ0FBRSxJQUFJLG1DQUFJLFVBQUksQ0FBQyxLQUFLLDBDQUFFLElBQUs7UUFDOUMsU0FBSSxHQUFHLGdCQUFJLENBQUMsT0FBTywwQ0FBRSxJQUFJLG1DQUFJLFVBQUksQ0FBQyxLQUFLLDBDQUFFLElBQUs7UUFDdkQsbUJBQWMsR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsY0FBYyxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxjQUFjO1FBQzNFLFVBQUssR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsS0FBSyxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxLQUFLO1FBQ2hELGdCQUFXLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLFdBQVcsbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsV0FBVztRQUN6RCxXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPO1FBQ3ZELGFBQVEsR0FBRyw4QkFBWSxFQUFDLFVBQUksQ0FBQyxPQUFPLDBDQUFFLFdBQVcsQ0FBQztRQUNsRCxhQUFRLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLFFBQVEsbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsUUFBUTtJQUk5RCxDQUFDO0lBRUwsV0FBVyxDQUFDLE9BQWlCO1FBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyRSxPQUFPLENBQUMsdUJBQVUsRUFBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLHlCQUFTLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQy9HO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsT0FBTyx5QkFBUyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx1QkFBVSxFQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN2RztRQUVELE9BQU8sRUFBRTtJQUNiLENBQUM7Q0FFSjtBQTdCRCxnQ0E2QkM7Ozs7Ozs7Ozs7Ozs7QUNoQ0Qsb0lBQTBEO0FBRTFELE1BQXFCLFVBQVU7SUFLM0IsWUFBcUIsVUFBa0IsRUFBVyxPQUFnQjtRQUE3QyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVcsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUZ4RCxTQUFJLEdBQVcsQ0FBQztRQUl0QixNQUFNLEtBQUssR0FDUCxVQUFVO2FBQ0wsSUFBSSxFQUFFO2FBQ04sS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUNmLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7O1lBQzVCLE1BQU0sR0FBRyxHQUFHLGFBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1DQUFJLGlDQUFhLEVBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUM7WUFDcEUsT0FBTyxTQUFHLENBQUMsY0FBYyxtQ0FBSSxDQUFDLEdBQUcsQ0FBQztRQUN0QyxDQUFDLENBQUM7SUFFTixDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxJQUFJLEVBQUU7SUFDZixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSTtJQUNwQixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVc7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUc7SUFDbkIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBZ0I7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtJQUN6QyxDQUFDO0NBRUo7QUE1Q0QsZ0NBNENDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzlDRCx3SEFBcUM7QUFrQnJDLFNBQWdCLFVBQVUsQ0FBQyxJQUE4QjtJQUVyRCxJQUFJLElBQUksWUFBWSxvQkFBVSxFQUFFO1FBQzVCLE9BQU8sSUFBSTtLQUNkO0lBRUQsT0FBTyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDO0FBQy9CLENBQUM7QUFQRCxnQ0FPQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzQkQsd0hBQXFDO0FBWXJDLFNBQWdCLFFBQVEsQ0FBQyxVQUFrQixFQUFFLE9BQWdCO0lBQ3pELE9BQU8sSUFBSSxvQkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUZELDRCQUVDOzs7Ozs7Ozs7Ozs7OztBQ2ZELFNBQWdCLFNBQVMsQ0FBQyxJQUFXO0lBQ2pDLE9BQU8sQ0FBQyxJQUFJLEdBQUMsR0FBRyxDQUFDO0FBQ3JCLENBQUM7QUFGRCw4QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNBRCw0RkFBOEM7QUFHOUMsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxPQUFnQixFQUFFLEtBQWU7O0lBR3pFLE1BQU0sUUFBUTtJQUNWLFFBQVE7SUFDUixzRUFBc0U7SUFDdEUsc0NBQXNDO0lBQ3RDLHNDQUFzQztJQUN0Qyw0Q0FBNEM7SUFDeEMsT0FBTyxDQUFDLE1BQU07U0FDYixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFFekQsOERBQThEO0lBRTlELE1BQU0sY0FBYyxHQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMscUJBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksTUFBSyxTQUFTLElBQUM7V0FDdEQsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsUUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFXLENBQUMsSUFBQyxrREFBZ0Q7SUFFekosTUFBTSxJQUFJLEdBQUcsb0JBQVEsQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBSSxtQ0FDMUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNiLFNBQVM7UUFDVCxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRWpCLHlEQUF5RDtJQUV6RCxPQUFPLHVCQUFVLEVBQUM7UUFDZCxLQUFLLEVBQUUsSUFBSTtRQUNYLElBQUksRUFBRSxvQkFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBSSxtQ0FBSSxJQUFJO1FBQ25DLElBQUksRUFBRSxJQUFJO1FBQ1YsUUFBUSxFQUFFLGNBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFFBQVE7S0FDckMsQ0FBQztBQUNOLENBQUM7QUFoQ0Qsc0NBZ0NDOzs7Ozs7Ozs7Ozs7OztBQ3JDRCxTQUFnQixTQUFTLENBQUMsSUFBWTtJQUNsQyxPQUFPLElBQUksR0FBRyxHQUFHO0FBQ3JCLENBQUM7QUFGRCw4QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNBRCxpSUFBb0U7QUFJcEUsK0ZBQXlDO0FBSXpDLE1BQWEsVUFBVTtJQUVuQixZQUN1QixVQUFrQixFQUNsQixPQUFnQixFQUNoQixRQUFRLG9CQUFRLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztRQUZyQyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0M7UUE0Q2xELGVBQVUsR0FBRyxDQUFDLElBQWEsRUFBRSxJQUFXLEVBQXVCLEVBQUU7WUFFdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBRTVDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQXFCLEVBQUUsSUFBSSxDQUFDO2FBQzFEO1FBRUwsQ0FBQztRQUVTLGNBQVMsR0FBRyxDQUFDLENBQVMsRUFBdUIsRUFBRTtZQUVyRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNqQixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTthQUNyQztRQUVMLENBQUM7UUFFUyxtQkFBYyxHQUFHLENBQUMsSUFBbUIsRUFBRSxJQUFXLEVBQXVCLEVBQUU7O1lBRWpGLE1BQU0sS0FBSyxHQUFRLEVBQUU7WUFFckIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFFMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBRS9CLElBQUksQ0FBQyxHQUFHLElBQUksNkJBQVcsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQy9CLE9BQU8sU0FBUztpQkFDbkI7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDTixTQUFRO2lCQUNYO2dCQUVELEtBQUssQ0FBQyxPQUFDLENBQUMsSUFBSSxtQ0FBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRzthQUVsQztZQUVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLFNBQVM7YUFDbkI7WUFFRCxPQUFPO2dCQUNILElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUssRUFBRSxLQUFLO2FBQ2Y7UUFDTCxDQUFDO1FBRVMsZ0JBQVcsR0FBRyxDQUFDLENBQVMsRUFBRSxJQUFXLEVBQXVCLEVBQUU7WUFFcEUsTUFBTSxJQUFJLEdBQWMsRUFBRTtZQUUxQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBRXRCLElBQUksQ0FBQyw4QkFBWSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDN0MsTUFBSztpQkFDUjtnQkFFRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFFdkMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDSixNQUFLO2lCQUNSO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixPQUFPLFNBQVM7YUFDbkI7WUFFRCxPQUFPLDhCQUFZLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ2xCLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhCLENBQUM7UUFFUyxXQUFNLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFlLENBQUM7UUFDN0QsQ0FBQztJQS9IRCxDQUFDO0lBRUQsUUFBUTs7UUFFSixNQUFNLE9BQU8sR0FBYyxFQUFFO1FBRTdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUV0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBRWxELElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ04sTUFBSzthQUNSO1lBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLElBQUksV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLDBDQUFFLElBQUksTUFBSyxVQUFVLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2FBQ3BCO1NBRUo7UUFFRCxPQUFPLE9BQU87SUFDbEIsQ0FBQztJQUdTLFFBQVEsQ0FBQyxLQUFnQixFQUFFLElBQVc7UUFFNUMsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7WUFFbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztZQUVsQyxJQUFJLENBQUMsRUFBRTtnQkFDSCxPQUFPLENBQUM7YUFDWDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUM3QjtJQUVMLENBQUM7SUF5RlMsUUFBUSxDQUFDLEdBQVk7UUFFM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPLEdBQUc7U0FDYjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFL0MsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU07YUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxDQUFDO1FBRXZDLHVDQUFZLEdBQUcsS0FBRSxLQUFLLEVBQUUsV0FBVyxJQUFFO0lBRXpDLENBQUM7Q0FFSjtBQTdKRCxnQ0E2SkM7Ozs7Ozs7Ozs7Ozs7O0FDbEtNLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLHVCQUF1QjtPQUNoRixDQUFDLElBQUksR0FBRztPQUNSLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFGRCxtQkFBVyxlQUVWO0FBRVAsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHO09BQ2xELENBQUMsSUFBSSxHQUFHO0FBREYsb0JBQVksZ0JBQ1Y7Ozs7Ozs7Ozs7Ozs7O0FDVGYseUdBQTBDO0FBTzFDLFNBQWdCLFNBQVMsQ0FBQyxVQUFrQixFQUFFLE9BQWdCO0lBQzFELE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUZELDhCQUVDOzs7Ozs7Ozs7Ozs7OztBQ1BELFNBQWdCLGFBQWEsQ0FBQyxLQUFjOztJQUV4QyxNQUFNLFVBQVUsR0FBRyx1QkFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDdEQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sSUFBSSxHQUFHLHVCQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLE1BQU0sMENBQUUsSUFBSTtJQUVoRCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztLQUN2QztJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNCLENBQUM7QUFYRCxzQ0FXQztBQUVELFNBQVMsaUJBQWlCLENBQUMsU0FBa0I7O0lBRXpDLE1BQU0sY0FBYyxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sbUNBQUksRUFBRSxJQUFDO0lBRTlELE1BQU0sWUFBWSxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLEtBQUssMENBQUUsT0FBTyxJQUFDO0lBRXhELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFFdkQsT0FBTztRQUNILElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsYUFBQyxPQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSwwQ0FBRSxJQUFnQixtQ0FBSSxFQUFFLElBQUM7UUFDL0QsSUFBSSxFQUFFLGNBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQVk7UUFDbEMsTUFBTSxFQUFFLGVBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFdBQVc7S0FDdkM7QUFFTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzlCTSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7O0lBRXJGLE9BQU8scUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1DQUNsQixpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxtQ0FDakMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO0FBRWxDLENBQUM7QUFOWSxxQkFBYSxpQkFNekI7QUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQVUsRUFBRSxDQUFVLEVBQUUsRUFBRTtJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqQyxDQUFDO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFFbEYsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUV6RCxJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7UUFDN0IsT0FBTyxTQUFTO0tBQ25CO0lBRUQsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRS9CLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLFVBQXFCLEVBQUU7O0lBRXZGLE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQUksRUFBRTtJQUVqQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRTVDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixPQUFPLEVBQUU7U0FDWjthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQWtCLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RjtJQUVMLENBQUMsQ0FBQztBQUVOLENBQUM7QUFkRCxvQ0FjQztBQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUMzRSxPQUFPLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTTtBQUM5RSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNELHFIQUErQztBQUMvQyxvR0FBZ0Q7QUFFaEQsU0FBd0IsSUFBSTtJQUV4QixNQUFNLEtBQUssR0FBRztRQUNWLEtBQUssRUFBRSxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxhQUFhLEVBQUUsS0FBSztLQUN2QjtJQUVELE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUNoQixRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLGFBQWE7UUFDdEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNuRCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNO0lBQzdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUs7SUFDN0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJO0lBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVE7SUFDbEMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUN4QixRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNO0lBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBTSxDQUFDLEVBQUMsRUFBRTtRQUVoRCxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDakMsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhO1NBQzdDO2FBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3hDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUN0QjthQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN2QyxNQUFNLHdCQUFVLEdBQUU7WUFDbEIsSUFBSSxFQUFFO1NBQ1Q7UUFFRCxNQUFNLEVBQUU7SUFDWixDQUFDLEVBQUMsQ0FBQztJQUVGLE1BQWMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUs7QUFDdkMsQ0FBQztBQXZDRCwwQkF1Q0M7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQ0QsMkZBQTZFO0FBRTdFLGlIQUFrRDtBQUVsRCx5R0FBNEI7QUFDNUIsd0dBQW9EO0FBQ3BELHNGQUF3QztBQUN4Qyx3SEFBa0Q7QUFFbEQsTUFBcUIsR0FBRztJQU1wQixZQUNhLE9BQWUsRUFDZixPQUFlLEVBQ2YsaUJBQWlCLEtBQUssRUFDdEIsVUFBVSxLQUFLO1FBSGYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixtQkFBYyxHQUFkLGNBQWMsQ0FBUTtRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBUm5CLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3ZGLGFBQVEsR0FBRyxlQUFJLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEUsbUJBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLG9CQUFXO1FBNkJwRCxZQUFPLEdBQUcsQ0FBQyxVQUFrQixFQUFVLEVBQUUsQ0FBQyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO1FBQ3JFLFlBQU8sR0FBRyxDQUFDLEVBQU0sRUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JGLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBdEJ4RixDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjOztRQUM3QixPQUFPLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksS0FBSyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBZTs7UUFDaEIsT0FBTyxJQUFJLEdBQUcsQ0FDVixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDeEMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3hDLElBQUksQ0FBQyxjQUFjLEVBQ25CLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQy9CO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNuRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDM0MsQ0FBQztJQU1ELFFBQVE7UUFDSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzRixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDMUYsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzFGLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYSxFQUFFLElBQWdCOztRQUVqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQy9DLE1BQU0sRUFBRSxHQUFHLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLG1DQUFJLHFCQUFPLEVBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBRSxFQUFDLE9BQU87UUFFakUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUN4QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO1FBQ2xDLE1BQU0sSUFBSSxHQUFHLHlCQUFTLEVBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztRQUUvQyxNQUFNLE9BQU8sR0FBUSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsZUFBQyxDQUFDLFNBQVMsMENBQUUsSUFBSSxNQUFLLFNBQVMsSUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLFFBQUMsRUFBRSxDQUFDLE9BQUMsQ0FBQyxJQUFJLDBDQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLEVBQUUsRUFBRSxDQUFDO1FBQ3ZKLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxpREFBaUQ7UUFFckgsT0FBTyxHQUFHO0lBQ2QsQ0FBQztJQUVELElBQUksTUFBTTtRQUVOLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07UUFFOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxLQUFLLG9CQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3RDLE9BQU8sRUFBRTtTQUNaO1FBRUQsSUFBSSxFQUFFLENBQUMsUUFBUSxLQUFLLG9CQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3RDLE9BQU8sRUFBRTtTQUNaO1FBRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFbEQsQ0FBQztDQUVKO0FBakZELHlCQWlGQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRkQsMkZBQWtFO0FBR2xFLHlHQUE0QjtBQUM1QixtR0FBd0I7QUFFeEIsc0ZBQXdDO0FBQ3hDLHdHQUFvRDtBQUVwRCxNQUFhLFVBQVU7SUFVbkIsWUFDYSxTQUFpQixFQUNqQixJQUFVLEVBQ1YsVUFBVSxLQUFLO1FBRmYsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQVhuQixXQUFNLEdBQUcsSUFBSTtRQUNiLFVBQUssR0FBRyxJQUFJO1FBQ1osVUFBSyxHQUFHLG9CQUFXO1FBQ25CLGFBQVEsR0FBRyxlQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUMxQixhQUFRLEdBQUcsMkJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNqSCxtQkFBYyxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssb0JBQVc7UUFXcEQsU0FBSSxHQUFHLENBQUMsSUFBZSxFQUFFLEVBQUU7O1lBQUMsV0FBSSxVQUFVLENBQ3RDLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBQyx1QkFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsMENBQUcsQ0FBQyxDQUFDLG1DQUFJLENBQUMsSUFBQyxFQUN2QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUMvQjtTQUFBO1FBRUQsUUFBRyxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWMsRUFBVSxFQUFFLFdBQUMsV0FBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7UUFDN0YsWUFBTyxHQUFHLENBQUMsVUFBa0IsRUFBVSxFQUFFLENBQUMsSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztRQUNyRSxhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkIsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9GLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQVpoRyxDQUFDO0lBY0QsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRztRQUNsRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhO1FBRWYsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFVBQVUsQ0FBQyxFQUFFO1lBQ2hDLE9BQU8sRUFBRTtTQUNaO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUU7U0FDWjtRQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJO2FBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsQ0FBQztRQUV2QyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2hCLENBQUM7Q0FFSjtBQXBERCxnQ0FvREM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RELHVHQUF5QztBQUd6QywySEFBdUM7QUE2QnZDLFNBQWdCLFFBQVEsQ0FBQyxTQUFpQixFQUFFLEdBQUcsSUFBVTtJQUNyRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzFDLENBQUM7QUFGRCw0QkFFQztBQUVZLG1CQUFXLEdBQVcsSUFBSSxxQkFBVyxFQUFFOzs7Ozs7Ozs7Ozs7O0FDaENwRCxNQUFxQixXQUFXO0lBQWhDO1FBRWEsYUFBUSxHQUFHLENBQUM7UUFDWixhQUFRLEdBQUcsRUFBRTtRQUNiLFVBQUssR0FBRyxJQUFJO1FBQ1osVUFBSyxHQUFHLElBQUk7UUFDWixXQUFNLEdBQUcsSUFBSTtRQUNiLG1CQUFjLEdBQUcsS0FBSztRQUUvQixTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQVUsRUFBRSxDQUFDLElBQUk7UUFDeEMsUUFBRyxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWMsRUFBVSxFQUFFLENBQUMsS0FBSztRQUN0RCxZQUFPLEdBQUcsQ0FBQyxVQUFrQixFQUFVLEVBQUUsQ0FBQyxVQUFVO1FBQ3BELGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ25CLFlBQU8sR0FBRyxDQUFDLEVBQU0sRUFBUSxFQUFFLENBQUMsRUFBRTtRQUM5QixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLEVBQUU7UUFDL0IsVUFBSyxHQUFHLENBQUMsTUFBYyxFQUFTLEVBQUUsQ0FBQyxFQUFFO1FBQ3JDLGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0lBRXZCLENBQUM7Q0FBQTtBQWxCRCxpQ0FrQkM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkQsMkZBQWtFO0FBR2xFLG1HQUF3QjtBQUV4Qix3R0FBb0Q7QUFDcEQsc0ZBQXdDO0FBRXhDLE1BQXFCLEtBQUs7SUFPdEIsWUFDYSxTQUFpQixFQUNqQixXQUFtQixFQUNuQixVQUFVLEtBQUssRUFDZixRQUFpQjtRQUhqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBVHJCLFVBQUssR0FBRyxJQUFJLENBQUMsU0FBUztRQUN0QixVQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVc7UUFDeEIsYUFBUSxHQUFHLDJCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0YsbUJBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLG9CQUFXO1FBV3BELFNBQUksR0FBRyxDQUFDLElBQWUsRUFBRSxFQUFFOztZQUFDLFdBQUksS0FBSyxDQUNqQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDMUMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQzVDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLG1DQUFJLElBQUksQ0FBQyxPQUFPLEVBQzVCLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxRQUFRLG1DQUFJLElBQUksQ0FBQyxRQUFRLENBQ2xDO1NBQUE7UUFPRCxhQUFRLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkIsUUFBRyxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWMsRUFBVSxFQUFFLFdBQUMsV0FBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7UUFDN0YsWUFBTyxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckYsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFqQnhGLENBQUM7SUFTRCxRQUFROztRQUNKLE1BQU0sR0FBRyxHQUFHLEdBQUcsZ0JBQUksQ0FBQyxRQUFRLDBDQUFFLElBQUksbUNBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUMzRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQU9ELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFDdkMsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQzlCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07U0FDbkMsQ0FBQztJQUNOLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLGVBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBQ0o7QUFuREQsMkJBbURDOzs7Ozs7Ozs7Ozs7OztBQ3hERCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsTUFBVTtJQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUU1QyxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXBFLENBQUM7QUFSRCw4Q0FRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCx5RkFBMkM7QUFDM0MsaUhBQTJEO0FBQzNELGlGQUF5QztBQUd6Qzs7O0dBR0c7QUFDSCxTQUFnQixTQUFTLENBQUMsU0FBbUIsRUFBRSxZQUFzQjtJQUVqRSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztJQUUxRCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFMUIsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQzlCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNsQixVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTTthQUN6QjtRQUVMLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFqQkQsOEJBaUJDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBbUIsRUFBRSxZQUFzQjtJQUMvRCxPQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDckIsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxHQUFVLEVBQUUsR0FBVTtJQUVqQyxNQUFNLE1BQU0sR0FBVSxFQUFFO0lBRXhCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDYixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBRWIsSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQixNQUFNLENBQUMsSUFBSSxpQ0FBTSxFQUFFLEdBQUssRUFBRSxFQUFHO2FBQ2hDO1FBRUwsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsT0FBTyxlQUFJLEVBQUMsTUFBTSxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxFQUFPLEVBQUUsRUFBTztJQUMvQixNQUFNLFVBQVUsR0FBRywrQkFBWSxFQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqRSxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxDQUFTO0lBQzdCLE9BQU8sQ0FBQyxDQUFDLFFBQVE7U0FDWixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLEVBQUUsRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFRO0lBQ3pCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsZUFBVSxDQUFDLFVBQVUsQ0FBQztBQUM3RCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2hFRCxTQUFnQixXQUFXLENBQUMsTUFBYztJQUN0QyxPQUFPLE1BQU07U0FDUixRQUFRO1NBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1NBQ2xDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQU5ELGtDQU1DOzs7Ozs7Ozs7Ozs7OztBQ1JELHNHQUFxRDtBQUdyRCxtR0FBaUU7QUFDakUsMklBQW1FO0FBSW5FLFNBQWdCLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEdBQWEsRUFBRSxJQUFtQjs7SUFFeEUsSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxNQUFNLEVBQUU7UUFDcEIsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNoRDtTQUFNLElBQUksZ0JBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLEtBQUssMENBQUUsTUFBTSxNQUFJLGVBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLEtBQUssMENBQUUsTUFBTSxHQUFFO1FBQy9ELE9BQU8sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDOUM7U0FBTSxJQUFJLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRTtRQUM1QixPQUFPLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ2pEO1NBQU0sSUFBSSxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxVQUFVLEVBQUU7UUFDL0IsT0FBTyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNsRDtTQUFNO1FBQ0gsT0FBTyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSwwQkFBMEI7S0FDeEU7QUFDTCxDQUFDO0FBYkQsMEJBYUM7QUFHRCxTQUFTLGtCQUFrQixDQUFDLE9BQWdCLEVBQUUsR0FBYSxFQUFFLElBQW1COztJQUU1RSxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNyRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDckcsTUFBTSxTQUFTLEdBQUcsa0JBQWtCLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsQ0FBQyxzREFBb0Q7SUFFaEssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNoQixTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOztZQUM3QixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQUMsQ0FBQyxTQUFTLDBDQUFFLFFBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsUUFBUSxHQUFFLENBQUM7UUFDdEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEMsT0FBTyxFQUFFLFFBQU07QUFDbkIsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsT0FBZ0IsRUFBRSxHQUFhLEVBQUUsSUFBbUI7SUFDMUUsTUFBTSxPQUFPO0FBQ2pCLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLE9BQWdCLEVBQUUsR0FBYSxFQUFFLElBQW1CO0lBQzdFLE1BQU0sT0FBTztBQUNqQixDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxPQUFnQixFQUFFLEdBQWEsRUFBRSxJQUFtQjtJQUM5RSxNQUFNLE9BQU87QUFDakIsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLE9BQWdCLEVBQUUsR0FBYSxFQUFFLElBQW1COztJQUV4RSxNQUFNLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0lBRXhDLGdEQUFnRDtJQUNoRCwrQkFBK0I7SUFDL0Isd0JBQXdCO0lBQ3hCLE1BQU0sWUFBWSxHQUFHLE1BQUUsT0FBZSxDQUFDLFlBQXVCLG1DQUFJLG9CQUFXO0lBQzdFLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFrQiw4Q0FBOEM7SUFFOUgsTUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFL0MsNkZBQTZGO0lBQzVGLE9BQWUsQ0FBQyxZQUFZLEdBQUcsRUFBRTtJQUVsQyxNQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQVUsQ0FBQyxDQUFDO0lBRTdGLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsNERBQTREO1FBQzdFLE9BQU8sTUFBTTtLQUNoQjtJQUVELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLDJDQUEyQztRQUM1RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM1QjtJQUVELHVDQUF1QztJQUN2QyxPQUFPLEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxnQkFBZ0IsRUFBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFFbkUsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsR0FBYSxFQUFFLElBQW1COztJQUUxRCxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNyRCxNQUFNLFVBQVUsR0FBRyxDQUFDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO0lBQ2xLLE1BQU0sS0FBSyxHQUFHLENBQUMscUJBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sMENBQUUsSUFBSSxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVEsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7SUFDM0osTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSyxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsSUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztJQUV4UCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUM3QyxpQkFBaUI7QUFFckIsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsR0FBYSxFQUFFLElBQW1COztJQUUxRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBUTtJQUNoQyxNQUFNLFFBQVEsR0FBRyx1Q0FBZ0IsR0FBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxlQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLE1BQU87SUFDcEQsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUMsU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUVyRyxPQUFPLHFCQUFRLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBRWpFLENBQUM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLEdBQWEsRUFBRSxJQUFtQjtJQUM5RCxPQUFPLG9CQUFXLEVBQUMsT0FBTztBQUM5QixDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsR0FBYTs7SUFFM0IsT0FBTyxzQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsSUFBSSwwQ0FBRSxNQUFNLDBDQUFFLFFBQVE7WUFDbEMscUJBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFNBQVMsMENBQUUsTUFBTSwwQ0FBRSxRQUFRO1lBQ3ZDLHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxJQUFJLDBDQUFFLElBQUksMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sMENBQUUsUUFBUSxJQUFDO1lBQ3JELHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sMENBQUUsUUFBUSxJQUFDO1lBQzFELHFCQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLElBQUksMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sMENBQUUsUUFBUSxJQUFDO1lBQ3hELFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLFFBQVE7QUFFL0IsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsSUFBVztJQUVsQywrREFBK0Q7SUFDL0QsZ0ZBQWdGO0lBQ2hGLG1EQUFtRDtJQUNuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUM7QUFFekQsQ0FBQztBQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsRUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBQyxJQUFJO0FBRTdELFNBQVMsV0FBVyxDQUFDLE9BQWdCLEVBQUUsTUFBYztJQUVqRCxNQUFNLEtBQUssR0FBRyxnQkFBSSxFQUFDLEVBQUUsRUFBRSxFQUFFLHVDQUFnQixHQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUMscUVBQXFFO0lBRXJJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFFMUIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVU7UUFFM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU07Z0JBQUUsTUFBTSxDQUFDLFFBQVEsR0FBRyxLQUFLO1lBQ25ELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1NBQzVCO2FBQU07WUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQzFEO0lBRUwsQ0FBQyxDQUFDO0lBRUYsT0FBTyxLQUFLO0FBQ2hCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbEpEOztHQUVHO0FBQ1Usa0JBQVUsR0FBRztJQUN0QixVQUFVLEVBQUUsWUFBWTtDQUMzQjs7Ozs7Ozs7Ozs7Ozs7QUNURCxTQUFnQixnQkFBZ0I7SUFDNUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsT0FBTyxLQUFLO0FBQ2hCLENBQUM7QUFIRCw0Q0FHQztBQUVELE1BQU0sV0FBVyxHQUFHLHlCQUF5QixFQUFFLENBQUM7QUFFaEQsUUFBUSxDQUFDLENBQUMseUJBQXlCO0lBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLE9BQU8sSUFBSSxFQUFFO1FBQ1QsQ0FBQyxFQUFFLENBQUM7UUFDSixNQUFNLENBQUMsQ0FBQztLQUNYO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCxTQUFnQixPQUFPLENBQUMsRUFBTTtJQUMxQixPQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNORCxtR0FBb0M7QUFFcEM7O0dBRUc7QUFFSCxTQUFnQixPQUFPLENBQUMsR0FBUztJQUM3QixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxxQkFBTyxFQUFDLENBQUMsQ0FBQyxHQUFHLHFCQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsMEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDUEQsU0FBZ0IsT0FBTyxDQUFDLE1BQWMsRUFBRSxJQUFJLEdBQUcsQ0FBQztJQUU1QyxJQUFJLEdBQUcsR0FBRyxNQUFNO0lBQ2hCLElBQUksR0FBRyxHQUFhLEVBQUU7SUFFdEIsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ2hCLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRCxHQUFHLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFDaEMsSUFBSSxFQUFFO0tBQ1Q7SUFFRCxPQUFPLEdBQUc7QUFDZCxDQUFDO0FBYkQsMEJBYUM7Ozs7Ozs7Ozs7Ozs7O0FDZkQsaUdBQTJDO0FBRTNDLFNBQWdCLFFBQVEsQ0FBQyxNQUFjO0lBRW5DLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUMsRUFBRTtRQUNsQyxtQkFBbUI7UUFDbkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7S0FDL0I7SUFFRCxJQUFJO1FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWdCO1FBQ3JELE9BQU8sT0FBTztLQUNqQjtJQUFDLFdBQU07UUFDSixPQUFPLDZCQUFXLEVBQUMsTUFBTSxDQUFDO0tBQzdCO0lBRUQsdUNBQXVDO0lBQ3ZDLDREQUE0RDtJQUM1RCwyQ0FBMkM7SUFDM0MscUJBQXFCO0lBQ3JCLFdBQVc7SUFDWCw4QkFBOEI7SUFDOUIsbUNBQW1DO0lBQ25DLElBQUk7QUFFUixDQUFDO0FBdkJELDRCQXVCQzs7Ozs7Ozs7Ozs7Ozs7QUN4QkQsU0FBZ0IsVUFBVSxDQUFDLE1BQWM7SUFDckMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBQywyQkFBMkI7SUFDOUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUxELGdDQUtDOzs7Ozs7Ozs7Ozs7OztBQ05ELDRFQUE2QjtBQUU3Qjs7R0FFRztBQUNILFNBQWdCLFlBQVksQ0FBQyxFQUFZLEVBQUUsRUFBWTtJQUNuRCxPQUFPLGVBQUksRUFBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFIRCxvQ0FHQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCxnSEFBcUQ7QUFFckQ7Ozs7R0FJRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxJQUFXO0lBRXJELElBQUksS0FBSyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDNUIsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0lBRUQsT0FBTyxLQUFLLFlBQVksV0FBVyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLGFBQWEsQ0FBQyx1Q0FBZ0IsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSyxLQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBRS9DLENBQUM7QUFWRCxrQ0FVQzs7Ozs7Ozs7Ozs7Ozs7QUNqQkQsU0FBZ0IsY0FBYyxDQUFtQixHQUFHLElBQVMsSUFBUyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFBcEYsd0NBQW9GOzs7Ozs7Ozs7Ozs7OztBQ0NwRjs7R0FFRztBQUNJLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSTtLQUM1RCxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztLQUNuQixPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztLQUN0QixXQUFXLEVBQUU7QUFITCx3QkFBZ0Isb0JBR1g7Ozs7Ozs7Ozs7Ozs7O0FDUGxCOztHQUVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFJLEdBQVE7SUFDNUIsSUFBSSxJQUFJLEdBQUcsRUFBUztJQUVwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM1RCxDQUFDLENBQUM7QUFDTixDQUFDO0FBUEQsb0JBT0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRCx1RkFBcUM7QUFDckMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFFdkMsdUZBQXFDO0FBQ3JDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2QywwRkFBdUM7QUFDdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2Qyx1RkFBcUM7QUFFckMsMEZBQXVDO0FBRXZDLDBGQUF1QztBQUV2QywwRkFBdUM7QUFFdkMsMEZBQXVDO0FBQ3ZDLDBGQUF1QztBQUN2Qyx1RkFBcUM7QUFDckMsdUZBQXFDO0FBQ3JDLHVGQUFxQztBQUNyQyx1RkFBcUM7QUFDckMsdUZBQXFDO0FBQ3JDLHVGQUFxQztBQUNyQyxnR0FBMkM7QUFDM0MsdUZBQXFDO0FBR3JDLE1BQU0sS0FBSyxHQUFHO0lBQ1YsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsYUFBSztJQUNMLGFBQUs7SUFDTCxhQUFLO0lBQ0wsZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04scUJBQXFCO0lBQ3JCLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTixlQUFNO0lBQ04sZUFBTTtJQUNOLGVBQU07SUFDTiwwQ0FBMEM7SUFDMUMsZUFBTTtJQUNOLFVBQVU7SUFDVixlQUFNO0lBQ04sMENBQTBDO0lBQzFDLGVBQU07SUFDTiwyQ0FBMkM7SUFDM0MsZUFBTTtJQUNOLGVBQU07Q0FDVDtBQUVEOztFQUVFO0FBQ0YsU0FBOEIsVUFBVTs7UUFFcEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuRyxNQUFNLGlCQUFLLEVBQUMsRUFBRSxDQUFDLE1BQUk7WUFDbkIsdUJBQVEsR0FBRTtTQUNiO0lBRUwsQ0FBQztDQUFBO0FBVEQsZ0NBU0M7Ozs7Ozs7Ozs7Ozs7O0FDL0ZELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDeEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFDekYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQ3JGLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBTkQsc0JBTUM7Ozs7Ozs7Ozs7Ozs7O0FDUkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsMEZBQTBGLENBQUMsQ0FBQztJQUNuSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDO0lBQzlFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUM7SUFDOUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQztJQUM3RSxPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDO0FBQ3pDLENBQUM7QUFQRCx3QkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzFELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTVDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDMUgsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztJQUMxSCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQzdFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFDL0UsT0FBTyxPQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFcEQsQ0FBQztBQVpELHdCQVlDOzs7Ozs7Ozs7Ozs7OztBQ2RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0csQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsa0VBQWtFO0lBQ2xFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0FBQ3ZFLENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUVsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWhELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0lBRXJGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUs7V0FDbEUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUN6RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7SUFFbkUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFFckQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUNsRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO1dBQ3pELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUVuRSxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFOUIsQ0FBQztBQWxCRCx3QkFrQkM7Ozs7Ozs7Ozs7Ozs7O0FDcEJELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBRWxCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGtEQUFrRCxDQUFDLENBQUM7SUFDM0UsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRXBELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE1BQU07V0FDbkUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTTtXQUMxRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFFakUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQVpELHdCQVlDOzs7Ozs7Ozs7Ozs7OztBQ2RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3hDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN2RCxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFDOUIsQ0FBQztBQVJELHdCQVFDOzs7Ozs7Ozs7Ozs7OztBQ1ZELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7QUFFeEMsQ0FBQztBQVRELHdCQVNDOzs7Ozs7Ozs7Ozs7OztBQ1hELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBRWxCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdEQUFnRCxDQUFDLENBQUM7SUFDekUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDcEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0lBQ2pGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUM1RSxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFFOUIsQ0FBQztBQVZELHdCQVVDOzs7Ozs7Ozs7Ozs7OztBQ1hELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsTUFBTSxFQUFFLEdBQUksS0FBb0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0VBQWtFLENBQUMsQ0FBQztJQUMzRixNQUFNLEVBQUUsR0FBSSxLQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ3ZELE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQU5ELHNCQU1DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDN0UsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7QUFDbEYsQ0FBQztBQUpELHdCQUlDOzs7Ozs7Ozs7Ozs7OztBQ05ELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLDBEQUEwRCxDQUFDLENBQUM7SUFDbkYsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBSkQsd0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsd0VBQXdFLENBQUMsQ0FBQztJQUNqRyxPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFKRCx3QkFJQzs7Ozs7Ozs7Ozs7Ozs7QUNORCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUpELHdCQUlDOzs7Ozs7Ozs7Ozs7OztBQ05ELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDbEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztJQUM3RCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7SUFDN0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUMsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQzNCLENBQUM7QUFSRCx3QkFRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBQ3RFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQzNELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUM1RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDO0FBQzlCLENBQUM7QUFQRCx3QkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQ3BELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHdEQUF3RCxDQUFDLENBQUM7SUFDakYsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDaEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDO0lBQzNFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBUEQsd0JBT0M7Ozs7Ozs7Ozs7Ozs7O0FDVEQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUM5QixDQUFDO0FBUEQsd0JBT0M7Ozs7Ozs7Ozs7Ozs7O0FDVEQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO0lBQzVHLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUNyRixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUN6RixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztJQUN6RixPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDO0FBQ3pDLENBQUM7QUFQRCxzQkFPQzs7Ozs7Ozs7Ozs7Ozs7QUNURCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3hFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzlELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQscUZBQXFGO0lBQ3JGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBQzNFLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDO0FBQ3ZFLENBQUM7QUFMRCx3QkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsTUFBTTtJQUNsQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBSkQsd0JBSUM7Ozs7Ozs7Ozs7Ozs7O0FDTkQsMkdBQXdEO0FBRXhELFNBQWdCLE1BQU07SUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFCLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7QUFDckUsQ0FBQztBQUxELHdCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixNQUFNO0lBQ2xCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN0QyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMzQixPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7QUFDbkYsQ0FBQztBQVBELHdCQU9DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sTUFBTSxLQUFLLFNBQVMsQ0FBQztBQUNoQyxDQUFDO0FBTEQsc0JBS0M7Ozs7Ozs7Ozs7Ozs7O0FDUEQsMkdBQXdEO0FBRXhELFNBQWdCLEtBQUs7SUFDakIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUxELHNCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFDaEYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0lBQzVFLE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFMRCxzQkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwyR0FBd0Q7QUFFeEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO0lBQzVGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQztJQUMxRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7SUFDMUUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDO0lBQzFFLE9BQU8sT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFDekMsQ0FBQztBQVBELHNCQU9DOzs7Ozs7Ozs7Ozs7OztBQ1RELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDN0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxPQUFPLENBQUM7SUFDNUUsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUxELHNCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELDJHQUF3RDtBQUV4RCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDbEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDcEUsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDO0FBQzlCLENBQUM7QUFORCxzQkFNQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCxTQUFnQixRQUFRO0lBQ3BCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ3hDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNyQixDQUFDO0FBSEQsNEJBR0M7Ozs7Ozs7Ozs7Ozs7O0FDSEQsU0FBZ0IsS0FBSyxDQUFDLFNBQWlCO0lBQ25DLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUM7SUFDekMsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUpELHNCQUlDOzs7Ozs7O1VDSkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5nL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmcvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5nL3R5cGVPZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvdGhpbmdzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9CYXNpY0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvQmFzZUxleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZHluYW1pY0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvYWxsS2V5cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2RlZXBDb3B5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL25ld0luc3RhbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy90YWdOYW1lRnJvbVByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDExLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxNi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjYudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q1LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0Ni50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0OS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdXRpbHMvY2xlYXJEb20udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3V0aWxzL3NsZWVwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgVGhpbmcgZnJvbSBcIi4uL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgeyBFbnZpcm8sIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFRoaW5nIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcuJylcbiAgICAgICAgY29uc3QgcDEgPSBwYXJ0c1swXVxuICAgICAgICBjb25zdCB3ID0gdGhpcy5kaWN0aW9uYXJ5W3AxXVxuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdy5nZXQocGFydHMuc2xpY2UoMSkuam9pbignLicpKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRMYXN0UmVmZXJlbmNlZChwMSlcbiAgICAgICAgcmV0dXJuIHdcbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFRoaW5nW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2V0ID0gKHdyYXBwZXI6IFRoaW5nKTogVGhpbmcgPT4ge1xuICAgICAgICB0aGlzLnNldExhc3RSZWZlcmVuY2VkKHdyYXBwZXIuaWQpXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbd3JhcHBlci5pZF0gPSB3cmFwcGVyXG4gICAgfVxuXG4gICAgcXVlcnkgPSAocXVlcnk6IENsYXVzZSk6IE1hcFtdID0+IHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMudmFsdWVzXG4gICAgICAgICAgICAubWFwKHcgPT4gdy50b0NsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgbWFwcyA9IHVuaXZlcnNlXG4gICAgICAgICAgICAucXVlcnkocXVlcnksIHsgaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgfSlcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygncXVlcnk9JywgcXVlcnkudG9TdHJpbmcoKSwgJ3VuaXZlcnNlPScsIHVuaXZlcnNlLnRvU3RyaW5nKCksICdtYXBzPScsIG1hcHMpXG4gICAgICAgIHJldHVybiBtYXBzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldExhc3RSZWZlcmVuY2VkKGxhc3RSZWZlcmVuY2VkOiBJZCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kaWN0aW9uYXJ5KS5pbmNsdWRlcyhsYXN0UmVmZXJlbmNlZCkpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBsYXN0UmVmZXJlbmNlZFxuICAgICAgICB9XG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgVGhpbmcgZnJvbSBcIi4uL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KHdyYXBwZXI6IFRoaW5nKTogVGhpbmdcbiAgICByZWFkb25seSB2YWx1ZXM6IFRoaW5nW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgdGhpbmcsIGNvbG9yVGhpbmcgfSBmcm9tICcuLi8uLi9jb25maWcvdGhpbmdzJztcbmltcG9ydCBCYXNpY0NvbnRleHQgZnJvbSAnLi4vLi4vZmFjYWRlL2NvbnRleHQvQmFzaWNDb250ZXh0JztcbmltcG9ydCB7IG1ha2VMZXhlbWUgfSBmcm9tICcuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4nO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWwnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyBhbGxLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvYWxsS2V5cyc7XG5pbXBvcnQgeyBkZWVwQ29weSB9IGZyb20gJy4uLy4uL3V0aWxzL2RlZXBDb3B5JztcbmltcG9ydCBUaGluZywgeyBDb3B5T3B0cywgU2V0QXJncywgV3JhcEFyZ3MgfSBmcm9tICcuL1RoaW5nJztcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gJy4vdHlwZU9mJztcblxuXG5leHBvcnQgY2xhc3MgQmFzZVRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xuXG4gICAgcmVhZG9ubHkgaWQgPSB0aGlzLmFyZ3MuaWRcbiAgICBwcm90ZWN0ZWQgcmVsYXRpb25zOiBSZWxhdGlvbltdID0gW11cbiAgICByZWFkb25seSBwYXJlbnQgPSB0aGlzLmFyZ3MucGFyZW50IC8vY29udGFpbmVyXG4gICAgcmVhZG9ubHkgb2JqZWN0ID0gdGhpcy5hcmdzLm9iamVjdFxuICAgIHByb3RlY3RlZCBzdXBlcmNsYXNzID0gdGhpcy5hcmdzLnN1cGVyY2xhc3NcbiAgICBwcm90ZWN0ZWQgYmFzZSA9IHRoaXMuYXJncy5iYXNlXG4gICAgcHJvdGVjdGVkIG5hbWUgPSB0aGlzLmFyZ3MubmFtZVxuXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBhcmdzOiBXcmFwQXJncykge1xuXG4gICAgfVxuXG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcuJylcbiAgICAgICAgY29uc3QgcDEgPSBwYXJ0c1swXVxuXG4gICAgICAgIGxldCBvXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG8gPSAodGhpcyBhcyBhbnkpW3AxXSA/PyAodGhpcy5vYmplY3QgYXMgYW55KT8uW3AxXSA/PyB0aGlzLmJhc2U/LmdldChwMSlcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW8pIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHcgPSBvIGluc3RhbmNlb2YgQmFzZVRoaW5nID8gbyA6IG5ldyBCYXNlVGhpbmcoeyBvYmplY3Q6IG8sIGlkOiBgJHt0aGlzLmlkfS4ke3AxfWAsIHBhcmVudDogdGhpcyB9KVxuICAgICAgICAvL21lbW9pemVcblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuZ2V0KHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3XG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IFRoaW5nIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKHtcbiAgICAgICAgICAgICAgICBpZDogb3B0cz8uaWQgPz8gdGhpcy5pZCxcbiAgICAgICAgICAgICAgICBvYmplY3Q6IGRlZXBDb3B5KHRoaXMub2JqZWN0KSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5iYXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEJhc2VUaGluZyh7XG4gICAgICAgICAgICAgICAgaWQ6IG9wdHM/LmlkID8/IHRoaXMuaWQsXG4gICAgICAgICAgICAgICAgc3VwZXJjbGFzczogdGhpcy5zdXBlcmNsYXNzLFxuICAgICAgICAgICAgICAgIGJhc2U6IHRoaXMuYmFzZS5jb3B5KCksXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgJ1RPRE8hJ1xuICAgIH1cblxuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0ID8/IHRoaXMuYmFzZT8udW53cmFwKClcbiAgICB9XG5cbiAgICBnZXRMZXhlbWVzID0gKCkgPT4ge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdnZXRMZXhlbWVzIScpXG5cbiAgICAgICAgY29uc3QgbGV4ZW1lcyA9IHRoaXMuZ2V0QWxsS2V5cygpLmZsYXRNYXAoeCA9PiB7XG5cbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvID0gdGhpcy5nZXQoeClcblxuICAgICAgICAgICAgICAgIGlmIChvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdW53cmFwcGVkID0gbz8udW53cmFwKClcblxuICAgICAgICAgICAgICAgIGNvbnN0IGxleCA9IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlT2YodW53cmFwcGVkKSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdDogeCxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbnQ6IG8sXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJldHVybiBbbGV4XVxuICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBsZXhlbWVzLmNvbmNhdChsZXhlbWVzLmZsYXRNYXAobCA9PiBsLmV4dHJhcG9sYXRlKCkpKVxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IFRoaW5nLCBvcHRzPzogU2V0QXJncyk6IFRoaW5nW10ge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHByZWRpY2F0ZSlcblxuICAgICAgICBjb25zdCByZWxhdGlvbjogUmVsYXRpb24gPSB7IHByZWRpY2F0ZSwgYXJnczogb3B0cz8uYXJncyA/PyBbXSB9XG5cbiAgICAgICAgbGV0IGFkZGVkOiBSZWxhdGlvbltdID0gW11cbiAgICAgICAgbGV0IHJlbW92ZWQ6IFJlbGF0aW9uW10gPSBbXVxuICAgICAgICBsZXQgdW5jaGFuZ2VkID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXJlbGF0aW9uc0VxdWFsKHgsIHJlbGF0aW9uKSlcblxuICAgICAgICBpZiAob3B0cz8ubmVnYXRlZCkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IFtyZWxhdGlvbl1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQWxyZWFkeShyZWxhdGlvbikpIHtcbiAgICAgICAgICAgIHVuY2hhbmdlZC5wdXNoKHJlbGF0aW9uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkZWQgPSBbcmVsYXRpb25dXG4gICAgICAgICAgICByZW1vdmVkLnB1c2goLi4udGhpcy5nZXRFeGNsdWRlZEJ5KHJlbGF0aW9uKSlcbiAgICAgICAgICAgIHVuY2hhbmdlZCA9IHVuY2hhbmdlZC5maWx0ZXIoeCA9PiAhcmVtb3ZlZC5zb21lKHIgPT4gcmVsYXRpb25zRXF1YWwoeCwgcikpKVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkZWQuZm9yRWFjaChyID0+IHRoaXMuYWRkUmVsYXRpb24ocikpXG4gICAgICAgIHJlbW92ZWQuZm9yRWFjaChyID0+IHRoaXMucmVtb3ZlUmVsYXRpb24ocikpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVpbnRlcnByZXQoYWRkZWQsIHJlbW92ZWQsIHVuY2hhbmdlZClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVpbnRlcnByZXQoYWRkZWQ6IFJlbGF0aW9uW10sIHJlbW92ZWQ6IFJlbGF0aW9uW10sIGtlcHQ6IFJlbGF0aW9uW10pOiBUaGluZ1tdIHtcblxuICAgICAgICByZW1vdmVkLmZvckVhY2gociA9PiB7XG4gICAgICAgICAgICB0aGlzLnVuZG8ocilcbiAgICAgICAgfSlcblxuICAgICAgICBhZGRlZC5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5kbyhyKVxuICAgICAgICB9KVxuXG4gICAgICAgIGtlcHQuZm9yRWFjaChyID0+IHtcbiAgICAgICAgICAgIHRoaXMua2VlcChyKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRFeGNsdWRlZEJ5KHJlbGF0aW9uOiBSZWxhdGlvbik6IFJlbGF0aW9uW10ge1xuICAgICAgICByZXR1cm4gW10gLy9UT0RPXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRvKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygocmVsYXRpb24ucHJlZGljYXRlIGFzIEJldHRlckJhc2VUaGluZykuc3VwZXJjbGFzcyA9PT0gY29sb3JUaGluZyApXG5cbiAgICAgICAgaWYgKChyZWxhdGlvbi5wcmVkaWNhdGUgYXMgQmFzZVRoaW5nKS5zdXBlcmNsYXNzID09PSBjb2xvclRoaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IHRoaXMuZ2V0KCdzdHlsZScpPy51bndyYXAoKVxuICAgICAgICAgICAgc3R5bGUuYmFja2dyb3VuZCA9IHJlbGF0aW9uLnByZWRpY2F0ZS51bndyYXAoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbmhlcml0KHJlbGF0aW9uLnByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdW5kbyhyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5kaXNpbmhlcml0KHJlbGF0aW9uLnByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga2VlcChyZWxhdGlvbjogUmVsYXRpb24pIHtcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhZGRSZWxhdGlvbihyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMucHVzaChyZWxhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVtb3ZlUmVsYXRpb24ocmVsYXRpb246IFJlbGF0aW9uKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXJlbGF0aW9uc0VxdWFsKHJlbGF0aW9uLCB4KSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNBbHJlYWR5KHJlbGF0aW9uOiBSZWxhdGlvbik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKCFyZWxhdGlvbi5hcmdzLmxlbmd0aCAmJiByZWxhdGlvbi5wcmVkaWNhdGUgPT09IHRoaXMpXG4gICAgICAgICAgICB8fCB0aGlzLnJlbGF0aW9ucy5zb21lKHggPT4gcmVsYXRpb25zRXF1YWwoeCwgcmVsYXRpb24pKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpbmhlcml0KGFkZGVkOiBUaGluZykge1xuXG4gICAgICAgIC8vVE9ETzogcHJldmVudCByZS1jcmVhdGlvbiBvZiBleGlzdGluZyBET00gZWxlbWVudHNcblxuICAgICAgICB0aGlzLmJhc2UgPSBhZGRlZC5jb3B5KClcbiAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gYWRkZWRcblxuICAgICAgICBpZiAodGhpcy5iYXNlLnVud3JhcCgpIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNpY0NvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJvb3Q/LmFwcGVuZENoaWxkKHRoaXMuYmFzZS51bndyYXAoKSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRpc2luaGVyaXQoZXhwZWxsZWQ6IFRoaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLnN1cGVyY2xhc3MgPT09IGV4cGVsbGVkKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2U/LnVud3JhcCgpIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgdGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBCYXNpY0NvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5yb290Py5yZW1vdmVDaGlsZCh0aGlzLmJhc2UudW53cmFwKCkpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYmFzZSA9IHRoaW5nLmNvcHkoKVxuICAgICAgICAgICAgdGhpcy5zdXBlcmNsYXNzID0gdGhpbmdcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QWxsS2V5cyA9ICgpID0+IGFsbEtleXModGhpcy5vYmplY3QgPz8ge30pLmNvbmNhdChhbGxLZXlzKHRoaXMuYmFzZT8udW53cmFwKCkgPz8ge30pKS5jb25jYXQoYWxsS2V5cyh0aGlzKSlcblxuICAgIHBvaW50T3V0KGRvSXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuYmFzZT8udW53cmFwKClcbiAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgeC5zdHlsZS5vdXRsaW5lID0gZG9JdCA/ICcjZjAwIHNvbGlkIDJweCcgOiAnJ1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLWV2aWwgc3RhcnRzIGJlbG93LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpIHtcblxuICAgICAgICBjb25zdCBxdWVyeU9yRW1wdHkgPSBxdWVyeSA/PyBlbXB0eUNsYXVzZVxuXG4gICAgICAgIGNvbnN0IGZpbGxlckNsYXVzZSA9IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiB0aGlzLmlkLnRvU3RyaW5nKCksIHR5cGU6ICdub3VuJyB9KSwgdGhpcy5pZCkgLy9UT0RPXG5cbiAgICAgICAgY29uc3QgcmVzID0gcXVlcnlPckVtcHR5XG4gICAgICAgICAgICAuZmxhdExpc3QoKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguZW50aXRpZXMubGVuZ3RoID09PSAxICYmIHgucHJlZGljYXRlKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHRoaXMuaXNBbHJlYWR5KHsgcHJlZGljYXRlOiB4LnByZWRpY2F0ZT8ucmVmZXJlbnQhLCBhcmdzOiBbXSB9KSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3guYXJncyFbMF1dOiB0aGlzLmlkIH0gfSkpXG4gICAgICAgICAgICAuY29uY2F0KGZpbGxlckNsYXVzZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICAgICAgICAgIC5hbmQodGhpcy5vd25lckluZm8ocXVlcnlPckVtcHR5KSlcblxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy50b1N0cmluZygpKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG93bmVySW5mbyhxOiBDbGF1c2UpIHtcblxuICAgICAgICAvL1RPRE86IHRoaXMgdW53aXR0aW5sZ3kgYXNzZXJ0cyB3cm9uZyBub24tcmVsYXRpb25hbCBpbmZvIGFib3V0IHRoaXMgb2JqZWN0IFwicGFycm90aW5nIHRoZSBxdWVyeVwiLlxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IHJlcyA9IChtYXBzWzBdICYmIGdldE93bmVyc2hpcENoYWluKHEsIGdldFRvcExldmVsKHEpWzBdKS5sZW5ndGggPiAxKSA/XG4gICAgICAgICAgICBxLmNvcHkoeyBtYXA6IG1hcHNbMF0gfSlcbiAgICAgICAgICAgIDogZW1wdHlDbGF1c2VcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMudG9TdHJpbmcoKSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBwYXJlbnRNYXA6IE1hcCA9IHt9KTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBnZXRUb3BMZXZlbChjbGF1c2UpWzBdKVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2xhdXNlPScsIGNsYXVzZS50b1N0cmluZygpLCAnb2M9Jywgb2MsICduYW1lPScsIHRoaXMubmFtZSlcblxuICAgICAgICBpZiAob2MubGVuZ3RoID09PSAxKSB7IC8vQkFTRUNBU0U6IGNoZWNrIHlvdXJzZWxmXG4gICAgICAgICAgICAvL1RPRE86IGFsc28gaGFuZGxlIG5vbi1vd25lcnNoaXAgbm9uLWludHJhbnNpdGl2ZSByZWxhdGlvbnMhXG4gICAgICAgICAgICAvL1RPRE86IGhhbmRsZSBub24gQmFzaWNDbGF1c2VzISEhISAodGhhdCBkb24ndCBoYXZlIE9ORSBwcmVkaWNhdGUhKVxuICAgICAgICAgICAgLy8gaWYgKGNsYXVzZS5zaW1wbGUucHJlZGljYXRlICYmICh0aGlzLmlzKGNsYXVzZS5zaW1wbGUucHJlZGljYXRlKSB8fCB0aGlzLm5hbWUgPT09IGNsYXVzZS5zaW1wbGUucHJlZGljYXRlPy5yb290KSkge1xuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9iamVjdCA9PT0gY2xhdXNlLnNpbXBsZS5wcmVkaWNhdGU/LnJlZmVyZW50Py51bndyYXAoKSkgeyAvL3RoaXMubmFtZSA9PT0gY2xhdXNlLnNpbXBsZS5wcmVkaWNhdGU/LnJvb3QgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7IC4uLnBhcmVudE1hcCwgW2NsYXVzZS5lbnRpdGllc1swXV06IHRoaXMuaWQgfV1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtdIC8vVE9ET1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgeW91ciBjaGlsZHJlbiFcblxuICAgICAgICBjb25zdCB0b3AgPSBnZXRUb3BMZXZlbChjbGF1c2UpXG5cbiAgICAgICAgY29uc3QgcGVlbGVkID0gY2xhdXNlLmZsYXRMaXN0KClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmVudGl0aWVzLmV2ZXJ5KGUgPT4gIXRvcC5pbmNsdWRlcyhlKSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgcmVsZXZhbnROYW1lcyA9IC8qIG9yIGNsYXVzZT8/PyAqL3BlZWxlZC5mbGF0TGlzdCgpLmZsYXRNYXAoeCA9PiBbeC5wcmVkaWNhdGU/LnJvb3QsIHgucHJlZGljYXRlPy50b2tlbl0pLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IHggYXMgc3RyaW5nKVxuXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBUaGluZ1tdID0gdGhpcy5nZXRBbGxLZXlzKClcbiAgICAgICAgICAgIC5tYXAoeCA9PiAoeyBuYW1lOiB4LCBvYmo6IHRoaXMuZ2V0KHgpPy51bndyYXAoKSB9KSlcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByZWxldmFudE5hbWVzLmluY2x1ZGVzKHgubmFtZSkpIC8vIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5vYmogIT09IHRoaXMub2JqZWN0KVxuICAgICAgICAgICAgLm1hcCh4ID0+IG5ldyBCYXNlVGhpbmcoeyBvYmplY3Q6IHgub2JqLCBpZDogYCR7dGhpcy5pZH0uJHt4Lm5hbWV9YCwgcGFyZW50OiB0aGlzLCBuYW1lOiB4Lm5hbWUgfSkpXG5cblxuICAgICAgICBjb25zdCByZXMgPSBjaGlsZHJlbi5mbGF0TWFwKHggPT4geC5xdWVyeShwZWVsZWQsIHsgW3RvcFswXV06IHRoaXMuaWQgfSkpXG5cblxuICAgICAgICByZXR1cm4gcmVzXG5cbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS1ldmlsIGVuZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxufVxuXG5cbnR5cGUgUmVsYXRpb24gPSB7XG4gICAgcHJlZGljYXRlOiBUaGluZyxcbiAgICBhcmdzOiBUaGluZ1tdLC8vaW1wbGllZCBzdWJqZWN0ID0gdGhpcyBvYmplY3Rcbn1cblxuZnVuY3Rpb24gcmVsYXRpb25zRXF1YWwocjE6IFJlbGF0aW9uLCByMjogUmVsYXRpb24pIHtcbiAgICByZXR1cm4gcjEucHJlZGljYXRlID09PSByMi5wcmVkaWNhdGVcbiAgICAgICAgJiYgcjEuYXJncy5sZW5ndGggPT09IHIyLmFyZ3MubGVuZ3RoXG4gICAgICAgICYmIHIxLmFyZ3MuZXZlcnkoKHgsIGkpID0+IHIyLmFyZ3NbaV0gPT09IHgpXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFRoaW5nIHtcblxuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldChwcmVkaWNhdGU6IFRoaW5nLCBvcHRzPzogU2V0QXJncyk6IFRoaW5nW11cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IFRoaW5nXG4gICAgdW53cmFwKCk6IGFueVxuICAgIGdldExleGVtZXMoKTogTGV4ZW1lW11cbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBwYXJlbnRNYXA/OiBNYXApOiBNYXBbXVxuICAgIHBvaW50T3V0KGRvSXQ6IGJvb2xlYW4pOiB2b2lkXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgcmVhZG9ubHkgcGFyZW50PzogVGhpbmcgfCBDb250ZXh0XG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRBcmdzIHtcbiAgICBuZWdhdGVkPzogYm9vbGVhblxuICAgIGFyZ3M/OiBUaGluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIGlkPzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoYXJnczogV3JhcEFyZ3MpOiBUaGluZyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoYXJncylcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXcmFwQXJncyB7XG4gICAgaWQ6IElkLFxuICAgIG9iamVjdD86IE9iamVjdCxcbiAgICBwYXJlbnQ/OiBUaGluZyB8IENvbnRleHQsXG4gICAgYmFzZT86IFRoaW5nLFxuICAgIHN1cGVyY2xhc3M/OiBUaGluZyxcbiAgICBuYW1lPzogc3RyaW5nLFxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2Yobzogb2JqZWN0KTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZCB7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiBvLmxlbmd0aCA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIHJldHVybiAnYWRqZWN0aXZlJ1xuICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxufSIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4vcHJlbHVkZVwiXG5pbXBvcnQgeyBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5pbXBvcnQgeyBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyB0aGluZ3MgfSBmcm9tIFwiLi90aGluZ3NcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgbGV4ZW1lczogbGV4ZW1lcy5mbGF0TWFwKHggPT4ge1xuICAgICAgICAgICAgY29uc3QgbCA9IG1ha2VMZXhlbWUoeClcbiAgICAgICAgICAgIHJldHVybiBbbCwgLi4ubC5leHRyYXBvbGF0ZSgpXVxuICAgICAgICB9KSxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHByZWx1ZGUsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLFxuICAgICAgICB0aGluZ3MsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqZWN0aXZlJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdmaWxsZXInLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnZ3JhbW1hcicsXG4gICdub25zdWJjb25qJywgLy8gYW5kIC4uLlxuICAnZGlzanVuYycsIC8vIG9yLCBidXQsIGhvd2V2ZXIgLi4uXG4gICdwcm9ub3VuJyxcbiAgLy8gJ2FueSdcbilcbiIsImltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGJ1dHRvblRoaW5nLCBjb2xvclRoaW5nLCBkaXZUaGluZywgcmVkVGhpbmcsIHRoaW5nIH0gZnJvbSBcIi4vdGhpbmdzXCI7XG5cbmNvbnN0IGJlaW5nOiBMZXhlbWUgPSBtYWtlTGV4ZW1lKHtcbiAgICByb290OiAnYmUnLFxuICAgIHR5cGU6ICdjb3B1bGEnLFxufSlcblxuY29uc3QgZG9pbmc6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmNvbnN0IG5vdDogTGV4ZW1lID0gbWFrZUxleGVtZSh7XG4gICAgcm9vdDogJ25vdCcsXG4gICAgdHlwZTogJ25lZ2F0aW9uJyxcbn0pXG5cblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IChQYXJ0aWFsPExleGVtZT4gfCBMZXhlbWUpW10gPSBbXG5cbiAgICBiZWluZyxcbiAgICBkb2luZyxcbiAgICBub3QsXG5cbiAgICB7IF9yb290OiBiZWluZywgdG9rZW46ICdpcycsIGNhcmRpbmFsaXR5OiAxIH0sXG4gICAgeyBfcm9vdDogYmVpbmcsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJyB9LCAvL1RPRE8hIDIrXG4gICAgeyBfcm9vdDogZG9pbmcsIHRva2VuOiAnZG9lcycsIGNhcmRpbmFsaXR5OiAxIH0sXG5cbiAgICB7IHJvb3Q6ICd0aGVuJywgdHlwZTogJ2ZpbGxlcicgfSxcbiAgICB7IHJvb3Q6ICcuJywgdHlwZTogJ2Z1bGxzdG9wJyB9LFxuICAgIHsgcm9vdDogJ29wdGlvbmFsJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnMXwwJyB9LFxuICAgIHsgcm9vdDogJ29uZS1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKycgfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcqJyB9LFxuICAgIHsgcm9vdDogJ29yJywgdHlwZTogJ2Rpc2p1bmMnIH0sXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2FkamVjdGl2ZScgfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogXCJpc24ndFwiLCB0eXBlOiAnY29udHJhY3Rpb24nLCBjb250cmFjdGlvbkZvcjogW2JlaW5nLCBub3RdIH0sXG4gICAgeyByb290OiAnYW5kJywgdHlwZTogJ25vbnN1YmNvbmonIH0sXG4gICAgeyByb290OiAnbGVmdCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAncmlnaHQnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogJ2EnLCB0eXBlOiAnaW5kZWZhcnQnIH0sXG4gICAgeyByb290OiAnYW4nLCB0eXBlOiAnaW5kZWZhcnQnIH0sXG4gICAgeyByb290OiAndGhlJywgdHlwZTogJ2RlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICdpZicsIHR5cGU6ICdzdWJjb25qJyB9LFxuICAgIHsgcm9vdDogJ3doZW4nLCB0eXBlOiAnc3ViY29uaicgfSxcbiAgICB7IHJvb3Q6ICdhbnknLCB0eXBlOiAndW5pcXVhbnQnIH0sXG4gICAgeyByb290OiAnZXZlcnknLCB0eXBlOiAndW5pcXVhbnQnIH0sXG4gICAgeyByb290OiAnb2YnLCB0eXBlOiAncHJlcG9zaXRpb24nIH0sXG4gICAgeyByb290OiAndGhhdCcsIHR5cGU6ICdyZWxwcm9uJyB9LFxuICAgIHsgcm9vdDogJ2l0JywgdHlwZTogJ3Byb25vdW4nIH0sXG4gICAgeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50OiB0aGluZyB9LFxuICAgIHsgcm9vdDogJ2J1dHRvbicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IGJ1dHRvblRoaW5nIH0sXG4gICAgeyByb290OiAnZGl2JywgdHlwZTogJ25vdW4nLCByZWZlcmVudDogZGl2VGhpbmcgfSxcbiAgICB7IHJvb3Q6ICdjb2xvcicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IGNvbG9yVGhpbmcgfSxcbiAgICB7IHJvb3Q6ICdyZWQnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50OiByZWRUaGluZyB9LFxuXG5dXG5cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmdbXSA9IFtcblxuICAgICAgLy8gZ3JhbW1hclxuICAgICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAgICAgJ2NvbXBsZW1lbnQgaXMgcHJlcG9zaXRpb24gdGhlbiBvYmplY3Qgbm91bi1waHJhc2UnLFxuXG4gICAgICBgY29wdWxhLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZWAsXG5cbiAgICAgIGBub3VuLXBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIGFkamVjdGl2ZXMgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIGdyYW1tYXJcbiAgICAgICAgdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgXG4gICAgICAgIHRoZW4gemVyby1vci1tb3JlIGNvbXBsZW1lbnRzIGAsXG5cbiAgICAgICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZScsXG4gICAgICAnbXZlcmJzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIG12ZXJiIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlLicsXG4gICAgICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZSBvciBtdmVyYnN1YmNsYXVzZScsXG5cbiAgICAgIGBhbmQtc2VudGVuY2UgaXMgbGVmdCBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gbm9uc3ViY29ualxuICAgICAgICB0aGVuIG9uZS1vci1tb3JlIHJpZ2h0IGFuZC1zZW50ZW5jZSBvciBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2VgLFxuXG4gICAgICBgbXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gbXZlcmJcblx0XHR0aGVuIG9iamVjdCBub3VuLXBocmFzZWAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICAgICAgYGl2ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgICBgc2ltcGxlLXNlbnRlbmNlIGlzIGNvcHVsYS1zZW50ZW5jZSBvciBpdmVyYi1zZW50ZW5jZSBvciBtdmVyYi1zZW50ZW5jZWAsXG5cbiAgICAgIGBjczIgaXMgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlXG4gICAgICB0aGVuIHN1YmNvbmpcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgICAgIGBjczEgaXMgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBmaWxsZXIgXG4gICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VgLFxuXG4gICAgICAvLyBkb21haW5cbiAgICAgIC8vICdjb2xvciBpcyBhIHRoaW5nJyxcbiAgICAgIC8vICdyZWQgYW5kIGJsdWUgYW5kIGJsYWNrIGFuZCBncmVlbiBhbmQgcHVycGxlIGFyZSBjb2xvcnMnLFxuXG4gICAgICAvLyAnY29sb3Igb2YgYSBidXR0b24gaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICAgICAvLyAnY29sb3Igb2YgYSBkaXYgaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICAgICAvLyAndGV4dCBvZiBhIGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KClcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZmlsbGVyJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxufSIsImltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5nL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmcvVGhpbmdcIlxuXG5leHBvcnQgY29uc3QgdGhpbmcgPSB3cmFwKHsgaWQ6ICd0aGluZycsIG9iamVjdDoge30gLyogQmFzZVRoaW5nICovIH0pXG5leHBvcnQgY29uc3QgYnV0dG9uVGhpbmcgPSB3cmFwKHsgaWQ6ICdidXR0b24nLCBvYmplY3Q6IEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZSB9KVxuZXhwb3J0IGNvbnN0IGRpdlRoaW5nID0gd3JhcCh7IGlkOiAnZGl2Jywgb2JqZWN0OiBIVE1MRGl2RWxlbWVudC5wcm90b3R5cGUgfSlcbmV4cG9ydCBjb25zdCBjb2xvclRoaW5nID0gd3JhcCh7IGlkOiAnY29sb3InLCBvYmplY3Q6IHt9IH0pXG5leHBvcnQgY29uc3QgcmVkVGhpbmcgPSB3cmFwKHsgaWQ6ICdyZWQnLCBvYmplY3Q6ICdyZWQnIH0pXG5yZWRUaGluZy5zZXQoY29sb3JUaGluZylcblxuXG5leHBvcnQgY29uc3QgdGhpbmdzID0gW1xuICAgIHRoaW5nLFxuICAgIGJ1dHRvblRoaW5nLFxuICAgIGRpdlRoaW5nLFxuICAgIGNvbG9yVGhpbmcsXG4gICAgcmVkVGhpbmcsXG5dXG4iLCJpbXBvcnQgVGhpbmcgZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmcvVGhpbmdcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2V2YWxBc3RcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5wcmVsdWRlLmZvckVhY2goYyA9PiB0aGlzLmV4ZWN1dGUoYykpXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbnRleHQpLnBhcnNlQWxsKCkubWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgIGlmIChhc3QudHlwZSA9PT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zZXRTeW50YXgoYXN0KVxuICAgICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXMgPSBldmFsQXN0KHRoaXMuY29udGV4dCwgYXN0KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnZhbHVlcy5mb3JFYWNoKHggPT4geC5wb2ludE91dChmYWxzZSkpXG4gICAgICAgICAgICByZXMuZm9yRWFjaCh4ID0+IHgucG9pbnRPdXQodHJ1ZSkpXG4gICAgICAgICAgICByZXR1cm4gcmVzXG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGUobmF0bGFuZykubWFwKHggPT4geD8udW53cmFwPy4oKSA/PyB4KVxuICAgIH1cblxufSIsImltcG9ydCBUaGluZyBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZy9UaGluZ1wiXG5pbXBvcnQgeyBHZXRDb250ZXh0T3B0cywgZ2V0Q29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEJyYWluT3B0cyBleHRlbmRzIEdldENvbnRleHRPcHRzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4ob3B0czogR2V0QnJhaW5PcHRzKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbihnZXRDb250ZXh0KG9wdHMpKVxufVxuIiwiaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiXG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0NvbmZpZ1wiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBBc3RUeXBlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBtYWNyb1RvU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0NvbnRleHQgaW1wbGVtZW50cyBDb250ZXh0IHtcblxuICAgIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2VcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3ludGF4TWFwID0gdGhpcy5jb25maWcuc3ludGF4ZXNcbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgcHJvdGVjdGVkIF9sZXhlbWVzID0gdGhpcy5jb25maWcubGV4ZW1lc1xuICAgIHJlYWRvbmx5IHByZWx1ZGUgPSB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgIHJlYWRvbmx5IHNldCA9IHRoaXMuZW52aXJvLnNldFxuICAgIHJlYWRvbmx5IHF1ZXJ5ID0gdGhpcy5lbnZpcm8ucXVlcnlcbiAgICByZWFkb25seSByb290ID0gdGhpcy5lbnZpcm8ucm9vdFxuICAgIHJlYWRvbmx5IGdldCA9IHRoaXMuZW52aXJvLmdldFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvOiBFbnZpcm8pIHtcblxuICAgICAgICB0aGlzLmFzdFR5cGVzLmZvckVhY2goZyA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgICAgIHJvb3Q6IGcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgICAgICAgICB9KSlcblxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY29uZmlnLnRoaW5ncy5mb3JFYWNoKHQgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXQodClcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby52YWx1ZXNcbiAgICB9XG5cbiAgICBnZXRMZXhlbWUgPSAocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICAgICAgICAgIC5hdCgwKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0IHN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bnRheExpc3RcbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHR5cGU6ICdncmFtbWFyJywgcm9vdDogc3ludGF4Lm5hbWUgfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGlmIChsZXhlbWUucm9vdCAmJiAhbGV4ZW1lLnRva2VuICYmIHRoaXMuX2xleGVtZXMuc29tZSh4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpKSB7XG4gICAgICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKGxleGVtZSlcbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKC4uLmxleGVtZS5leHRyYXBvbGF0ZSh0aGlzKSlcbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IEJhc2ljQ29udGV4dCBmcm9tIFwiLi9CYXNpY0NvbnRleHRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IGV4dGVuZHMgRW52aXJvIHtcblxuICAgIGdldFN5bnRheChuYW1lOiBBc3RUeXBlKTogU3ludGF4XG4gICAgc2V0U3ludGF4KG1hY3JvOiBBc3ROb2RlKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZFxuXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0T3B0cyBleHRlbmRzIEdldEVudmlyb09wcyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQob3B0czogR2V0Q29udGV4dE9wdHMpOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChnZXRFbnZpcm8ob3B0cykpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUxleGVtZSBpbXBsZW1lbnRzIExleGVtZSB7XG5cbiAgICBfcm9vdCA9IHRoaXMubmV3RGF0YT8uX3Jvb3RcbiAgICByZWFkb25seSByb290ID0gdGhpcy5uZXdEYXRhPy5yb290ID8/IHRoaXMuX3Jvb3Q/LnJvb3QhXG4gICAgcmVhZG9ubHkgdHlwZSA9IHRoaXMubmV3RGF0YT8udHlwZSA/PyB0aGlzLl9yb290Py50eXBlIVxuICAgIGNvbnRyYWN0aW9uRm9yID0gdGhpcy5uZXdEYXRhPy5jb250cmFjdGlvbkZvciA/PyB0aGlzLl9yb290Py5jb250cmFjdGlvbkZvclxuICAgIHRva2VuID0gdGhpcy5uZXdEYXRhPy50b2tlbiA/PyB0aGlzLl9yb290Py50b2tlblxuICAgIGNhcmRpbmFsaXR5ID0gdGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSA/PyB0aGlzLl9yb290Py5jYXJkaW5hbGl0eVxuICAgIHJlYWRvbmx5IGlzVmVyYiA9IHRoaXMudHlwZSA9PT0gJ212ZXJiJyB8fCB0aGlzLnR5cGUgPT09ICdpdmVyYidcbiAgICByZWFkb25seSBpc1BsdXJhbCA9IGlzUmVwZWF0YWJsZSh0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5KVxuICAgIHJlYWRvbmx5IHJlZmVyZW50ID0gdGhpcy5uZXdEYXRhPy5yZWZlcmVudCA/PyB0aGlzLl9yb290Py5yZWZlcmVudFxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG5ld0RhdGE/OiBQYXJ0aWFsPExleGVtZT5cbiAgICApIHsgfVxuXG4gICAgZXh0cmFwb2xhdGUoY29udGV4dD86IENvbnRleHQpOiBMZXhlbWVbXSB7XG5cbiAgICAgICAgaWYgKCh0aGlzLnR5cGUgPT09ICdub3VuJyB8fCB0aGlzLnR5cGUgPT09ICdncmFtbWFyJykgJiYgIXRoaXMuaXNQbHVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogcGx1cmFsaXplKHRoaXMucm9vdCksIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50OiB0aGlzLnJlZmVyZW50IH0pXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWZXJiKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uanVnYXRlKHRoaXMucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogeCwgcmVmZXJlbnQ6IHRoaXMucmVmZXJlbnQgfSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbn0iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBkeW5hbWljTGV4ZW1lIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2R5bmFtaWNMZXhlbWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZVtdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IHdvcmRzID1cbiAgICAgICAgICAgIHNvdXJjZUNvZGVcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcblxuICAgICAgICB0aGlzLnRva2VucyA9IHdvcmRzLmZsYXRNYXAodyA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXggPSBjb250ZXh0LmdldExleGVtZSh3KSA/PyBkeW5hbWljTGV4ZW1lKHcsIGNvbnRleHQsIHdvcmRzKVxuICAgICAgICAgICAgcmV0dXJuIGxleC5jb250cmFjdGlvbkZvciA/PyBbbGV4XVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEJhc2VMZXhlbWUgZnJvbSBcIi4vQmFzZUxleGVtZVwiXG5pbXBvcnQgVGhpbmcgZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmcvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovICByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gIHR5cGU6IExleGVtZVR5cGVcbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqLyB0b2tlbj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gIGNvbnRyYWN0aW9uRm9yPzogTGV4ZW1lW11cbiAgICAvKipmb3IgcXVhbnRhZGogKi8gY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxuICAgIF9yb290PzogUGFydGlhbDxMZXhlbWU+XG4gICAgZXh0cmFwb2xhdGUoY29udGV4dD86IENvbnRleHQpOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IGlzUGx1cmFsOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNWZXJiOiBib29sZWFuXG5cbiAgICByZWZlcmVudD86IFRoaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IFBhcnRpYWw8TGV4ZW1lPiB8IExleGVtZSk6IExleGVtZSB7XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEJhc2VMZXhlbWUpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJhc2VMZXhlbWUoZGF0YSlcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNMZXhlbWUod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWUge1xuXG5cbiAgICBjb25zdCByZWxldmFudCA9XG4gICAgICAgIC8vIHdvcmRzXG4gICAgICAgIC8vICAgICAubWFwKHcgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHcsIHR5cGU6ICdub3VuJyB9KSwgJ1gnKSlcbiAgICAgICAgLy8gICAgIC5mbGF0TWFwKGMgPT4gY29udGV4dC5xdWVyeShjKSlcbiAgICAgICAgLy8gICAgIC5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgLy8gICAgIC5mbGF0TWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSA/PyBbXSlcbiAgICAgICAgICAgIGNvbnRleHQudmFsdWVzXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IHguZ2V0TGV4ZW1lcygpKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudG9rZW4gPT09IHdvcmQgfHwgeC5yb290ID09PSB3b3JkKVxuXG4gICAgLy8gY29uc29sZS5sb2coJ2R5bmFtaWNMZXhlbWVzIScsIHdvcmQsICdyZWxldmFudD0nLCByZWxldmFudClcblxuICAgIGNvbnN0IGlzTWFjcm9Db250ZXh0ID1cbiAgICAgICAgd29yZHMuc29tZSh4ID0+IGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlID09PSAnZ3JhbW1hcicpXG4gICAgICAgICYmICF3b3Jkcy5zb21lKHggPT4gWydkZWZhcnQnLCAnaW5kZWZhcnQnLCAnbm9uc3ViY29uaiddLmluY2x1ZGVzKGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlIGFzIGFueSkpLy9UT0RPOiB3aHkgZGVwZW5kZW5jaWVzKCdtYWNybycpIGRvZXNuJ3Qgd29yaz8hXG5cbiAgICBjb25zdCB0eXBlID0gcmVsZXZhbnRbMF0/LnR5cGUgPz9cbiAgICAgICAgKGlzTWFjcm9Db250ZXh0ID9cbiAgICAgICAgICAgICdncmFtbWFyJ1xuICAgICAgICAgICAgOiAnbm91bicpXG5cbiAgICAvLyBjb25zb2xlLmxvZygnZHluYW1pY0xleGVtZScsIHJlbGV2YW50LmF0KDApPy5yZWZlcmVudClcblxuICAgIHJldHVybiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgdG9rZW46IHdvcmQsXG4gICAgICAgIHJvb3Q6IHJlbGV2YW50Py5hdCgwKT8ucm9vdCA/PyB3b3JkLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICByZWZlcmVudDogcmVsZXZhbnQuYXQoMCk/LnJlZmVyZW50LFxuICAgIH0pXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoYXN0OiBBc3ROb2RlKTogQXN0Tm9kZSB7XG5cbiAgICAgICAgaWYgKCFhc3QubGlua3MpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGUpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4uLy4uL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGVVbndyYXBwZWQodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICAgICAgICAgIG1haW4oKVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcykpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNsYXVzZTEuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllc1xuICAgIH1cblxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lcnNPZihpZCkpXG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2UgeyAvLyBjYW4ndCBiZSBwcm9wLCBiZWNhdXNlIHdvdWxkIGJlIGNhbGxlZCBpbiBBbmQncyBjb25zLCBCYXNpY0NsdXNlLmFuZCgpIGNhbGxzIEFuZCdzIGNvbnMsIFxcaW5mIHJlY3Vyc2lvbiBlbnN1ZXNcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiB0aGlzLmNsYXVzZTEucmhlbWUuYW5kKHRoaXMuY2xhdXNlMi5yaGVtZSlcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy5jbGF1c2UxLmFuZCh0aGlzLmNsYXVzZTIpXG4gICAgICAgIGNvbnN0IGl0ID0gb3B0cz8uaXQgPz8gc29ydElkcyh1bml2ZXJzZS5lbnRpdGllcykuYXQoLTEpISAvL1RPRE8hXG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2VMaXN0ID0gdW5pdmVyc2UuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBxdWVyeUxpc3QgPSBxdWVyeS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBzb2x2ZU1hcHMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICAgICAgY29uc3QgcHJvbk1hcDogTWFwID0gcXVlcnlMaXN0LmZpbHRlcihjID0+IGMucHJlZGljYXRlPy50eXBlID09PSAncHJvbm91bicpLm1hcChjID0+ICh7IFtjLmFyZ3M/LmF0KDApIV06IGl0IH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICBjb25zdCByZXMgPSBtYXBzLmNvbmNhdChwcm9uTWFwKS5maWx0ZXIobSA9PiBPYmplY3Qua2V5cyhtKS5sZW5ndGgpIC8vIGVtcHR5IG1hcHMgY2F1c2UgcHJvYmxlbXMgYWxsIGFyb3VuZCB0aGUgY29kZSFcblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpIHtcblxuICAgICAgICBjb25zdCBjMSA9IHRoaXMuY2xhdXNlMS5zaW1wbGVcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLmNsYXVzZTIuc2ltcGxlXG5cbiAgICAgICAgaWYgKGMyLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMxXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYzEuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzJcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoeyBjbGF1c2UxOiBjMSwgY2xhdXNlMjogYzIgfSlcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuXG5leHBvcnQgY2xhc3MgQXRvbUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmFyZ3MpXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KHsgcHJlZGljYXRlOiB0aGlzLnByZWRpY2F0ZS5yb290LCBhcmdzOiB0aGlzLmFyZ3MsIG5lZ2F0ZWQ6IHRoaXMubmVnYXRlZCB9KSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBBdG9tQ2xhdXNlKFxuICAgICAgICB0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcD8uW2FdID8/IGEpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgIClcblxuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW3RoaXNdXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEF0b21DbGF1c2UgfSBmcm9tIFwiLi9BdG9tQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEFuIHVuYW1iaWd1b3VzIHByZWRpY2F0ZS1sb2dpYy1saWtlIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvblxuICogb2YgdGhlIHByb2dyYW1tZXIncyBpbnRlbnQuXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBzaW1wbGU6IENsYXVzZVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHM/OiBib29sZWFuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEF0b21DbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gZmFsc2VcblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlID0+IHRoaXNcbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gb3RoZXJcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBjb25jbHVzaW9uXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBzdWJqY29uaj86IExleGVtZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgSW1wbHkoXG4gICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIG9wdHM/LnN1Ympjb25qID8/IHRoaXMuc3ViamNvbmosXG4gICAgKVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZXJzT2YoaWQpKVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7Ly8gVE9ET1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLmVudGl0aWVzKSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGludGVyc2VjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9pbnRlcnNlY3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpYWxJZHMgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuLyoqXG4gKiBGaW5kcyBwb3NzaWJsZSBNYXAtaW5ncyBmcm9tIHF1ZXJ5TGlzdCB0byB1bml2ZXJzZUxpc3RcbiAqIHtAbGluayBcImZpbGU6Ly8uLy4uLy4uLy4uLy4uLy4uL2RvY3Mvbm90ZXMvdW5pZmljYXRpb24tYWxnby5tZFwifVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29sdmVNYXBzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMSwgaSkgPT4ge1xuICAgICAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMiwgaikgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWwxLmxlbmd0aCAmJiBtbDIubGVuZ3RoICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZShtbDEsIG1sMilcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2ldID0gW11cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2pdID0gbWVyZ2VkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXMuZmxhdCgpLmZpbHRlcih4ID0+ICFpc0ltcG9zaWJsZSh4KSlcbn1cblxuZnVuY3Rpb24gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdW10ge1xuICAgIHJldHVybiBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB1bml2ZXJzZUxpc3QuZmxhdE1hcCh1ID0+IHUucXVlcnkocSkpXG4gICAgICAgIHJldHVybiByZXMubGVuZ3RoID8gcmVzIDogW21ha2VJbXBvc3NpYmxlKHEpXVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1sMTogTWFwW10sIG1sMjogTWFwW10pIHtcblxuICAgIGNvbnN0IG1lcmdlZDogTWFwW10gPSBbXVxuXG4gICAgbWwxLmZvckVhY2gobTEgPT4ge1xuICAgICAgICBtbDIuZm9yRWFjaChtMiA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtYXBzQWdyZWUobTEsIG0yKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4ubTEsIC4uLm0yIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXEobWVyZ2VkKVxufVxuXG5mdW5jdGlvbiBtYXBzQWdyZWUobTE6IE1hcCwgbTI6IE1hcCkge1xuICAgIGNvbnN0IGNvbW1vbktleXMgPSBpbnRlcnNlY3Rpb24oT2JqZWN0LmtleXMobTEpLCBPYmplY3Qua2V5cyhtMikpXG4gICAgcmV0dXJuIGNvbW1vbktleXMuZXZlcnkoayA9PiBtMVtrXSA9PT0gbTJba10pXG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvc3NpYmxlKHE6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIHEuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IFt4XTogU3BlY2lhbElkcy5JTVBPU1NJQkxFIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbn1cblxuZnVuY3Rpb24gaXNJbXBvc2libGUobWFwOiBNYXApIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtYXApLmluY2x1ZGVzKFNwZWNpYWxJZHMuSU1QT1NTSUJMRSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgVGhpbmcsIHsgd3JhcCB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi9pZC9NYXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxBc3QoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKGFzdD8ubGlua3M/LmNvcHVsYSkge1xuICAgICAgICByZXR1cm4gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/Lml2ZXJiPy5sZXhlbWUgfHwgYXN0Py5saW5rcz8ubXZlcmI/LmxleGVtZSkge1xuICAgICAgICByZXR1cm4gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/Lm5vbnN1YmNvbmopIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZhbE5vdW5QaHJhc2UoY29udGV4dCwgYXN0LCBhcmdzKSAgLy9ub3VucGhyYXNlIGlzIHRoZSBcImF0b21cIlxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3Q/LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogdHJ1ZSB9KVxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSB9KS8vLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSlcblxuICAgIHN1YmplY3QuZm9yRWFjaChzID0+IHtcbiAgICAgICAgcHJlZGljYXRlLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIHMuc2V0KGMucHJlZGljYXRlPy5yZWZlcmVudCEsIHsgbmVnYXRlZDogISFhc3Q/LmxpbmtzPy5uZWdhdGlvbiB9KVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICBzdWJqZWN0LmZvckVhY2gocyA9PiBjb250ZXh0LnNldChzKSlcblxuICAgIHJldHVybiBbXS8vVE9ET1xufVxuXG5mdW5jdGlvbiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyAnVE9ETyEnXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93ICdUT0RPISdcbn1cblxuZnVuY3Rpb24gZXZhbENvbXBvdW5kU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93ICdUT0RPISdcbn1cblxuZnVuY3Rpb24gZXZhbE5vdW5QaHJhc2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuXG4gICAgLy8gY2hlY2tzIGZvciBUaGluZ3MgdGhhdCBtYXRjaCBnaXZlbiBub3VucGhyYXNlXG4gICAgLy8gMS4gaW4gY3VycmVudCBzZW50ZW5jZSBzY29wZVxuICAgIC8vIDIuIGluIGJyb2FkZXIgY29udGV4dFxuICAgIGNvbnN0IGN1cnJlbnRTY29wZSA9ICgoY29udGV4dCBhcyBhbnkpLmN1cnJlbnRTY29wZSBhcyBDbGF1c2UpID8/IGVtcHR5Q2xhdXNlXG4gICAgY29uc3QgbWFwcyA9IGN1cnJlbnRTY29wZS5xdWVyeShucCkuY29uY2F0KGNvbnRleHQucXVlcnkobnApKTsgICAgICAgICAgICAgICAgICAvLyBjb25zdCBucDIgPSBucC5jb3B5KHttYXAgOiBtYXBzWzBdID8/IHt9fSk7XG5cbiAgICBjb25zdCBpbnRlcmVzdGluZ0lkcyA9IGdldEludGVyZXN0aW5nSWRzKG1hcHMpO1xuXG4gICAgLy8gVE1QIChvbmx5KSB1c2UgY29udGV4dCB0byBwYXNzIGFyb3VuZCBkYXRhIGFib3V0IFwiY3VycnJlbnQgc2VudGVuY2VcIiwgeXVjayEgUE9TU0lCTEUgQlVHUyFcbiAgICAoY29udGV4dCBhcyBhbnkpLmN1cnJlbnRTY29wZSA9IG5wXG5cbiAgICBjb25zdCB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4IGFzIFRoaW5nKTtcblxuICAgIGlmIChpc1BsdXJhbChhc3QpKSB7IC8vIGlmIHVuaXZlcnNhbCBxdWFudGlmaWVkLCBJIGRvbid0IGNhcmUgaWYgdGhlcmUncyBubyBtYXRjaFxuICAgICAgICByZXR1cm4gdGhpbmdzXG4gICAgfVxuXG4gICAgaWYgKHRoaW5ncy5sZW5ndGgpIHsgLy8gbm9uLXBsdXJhbCwgcmV0dXJuIHNpbmdsZSBleGlzdGluZyBUaGluZ1xuICAgICAgICByZXR1cm4gdGhpbmdzLnNsaWNlKDAsIDEpXG4gICAgfVxuXG4gICAgLy8gb3IgZWxzZSBjcmVhdGUgYW5kIHJldHVybnMgdGhlIFRoaW5nXG4gICAgcmV0dXJuIGFyZ3M/LmF1dG92aXZpZmljYXRpb24gPyBbY3JlYXRlVGhpbmcoY29udGV4dCwgbnApXSA6IFtdXG5cbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBhZGplY3RpdmVzID0gKGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBub3VucyA9IChhc3Q/LmxpbmtzPy5zdWJqZWN0Py5saXN0ID8/IFtdKS5tYXAoeCA9PiB4LmxleGVtZSEpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHN1YmplY3RJZCkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhc3Q/LmxpbmtzID8/IHt9KS5maWx0ZXIoeCA9PiB4Lmxpc3QpLmZsYXRNYXAoeCA9PiB4Lmxpc3QhKS5maWx0ZXIoeCA9PiB4LmxpbmtzPy5wcmVwb3NpdGlvbikubWFwKHggPT4gY29tcGxlbWVudFRvQ2xhdXNlKHgsIHsgc3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSB9KSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICByZXR1cm4gYWRqZWN0aXZlcy5hbmQobm91bnMpLmFuZChjb21wbGVtZW50cylcbiAgICAvL1RPRE86IHN1YmNsYXVzZVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb2JqZWN0SWQgPSBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGFzdD8ubGlua3M/LnByZXBvc2l0aW9uPy5sZXhlbWUhXG4gICAgY29uc3Qgb2JqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdD8ubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSlcblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViamVjdElkLCBvYmplY3RJZCkuYW5kKG9iamVjdClcblxufVxuXG5mdW5jdGlvbiByZWxhdGl2ZUNsYXVzZVRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuICAgIHJldHVybiBlbXB0eUNsYXVzZSAvL1RPRE8hXG59XG5cbmZ1bmN0aW9uIGlzUGx1cmFsKGFzdD86IEFzdE5vZGUpIHtcblxuICAgIHJldHVybiBhc3Q/LmxpbmtzPy5ub3VuPy5sZXhlbWU/LmlzUGx1cmFsXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGV4ZW1lPy5pc1BsdXJhbFxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5ub3VuPy5saXN0Py5zb21lKHggPT4geC5sZXhlbWU/LmlzUGx1cmFsKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZT8uaXNQbHVyYWwpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnN1YmplY3Q/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZT8uaXNQbHVyYWwpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnVuaXF1YW50XG5cbn1cblxuZnVuY3Rpb24gZ2V0SW50ZXJlc3RpbmdJZHMobWFwczogTWFwW10pOiBJZFtdIHtcblxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlIFwiY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uXCIgXG4gICAgLy8gaGFzIGJ1dHRvbklkLnN0eWxlLmNvbG9yIGFuZCB0aGF0J3MgdGhlIG9iamVjdCB0aGUgc2VudGVuY2Ugc2hvdWxkIHJlc29sdmUgdG9cbiAgICAvLyBwb3NzaWJsZSBwcm9ibGVtIGlmIFwiY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b25cIlxuICAgIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxufVxuXG5jb25zdCBnZXROdW1iZXJPZkRvdHMgPSAoaWQ6IElkKSA9PiBpZC5zcGxpdCgnLicpLmxlbmd0aCAvLy0xXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNvbnRleHQ6IENvbnRleHQsIGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuXG4gICAgY29uc3QgdGhpbmcgPSB3cmFwKHsgaWQ6IGdldEluY3JlbWVudGFsSWQoKSwgcGFyZW50OiBjb250ZXh0IH0pIC8vVE9ETzogZG9uJ3QgYWRkIHRvIGNvbnRleHQ/IGltcGxpY2l0bHkgYWRkZWQgYnkgdGhpbmcuc2V0KCkgaW5oZXJpdFxuXG4gICAgY2xhdXNlLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcblxuICAgICAgICBjb25zdCBsZXhlbWUgPSBjLnByZWRpY2F0ZSFcblxuICAgICAgICBpZiAoIWxleGVtZS5yZWZlcmVudCkge1xuICAgICAgICAgICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicpIGxleGVtZS5yZWZlcmVudCA9IHRoaW5nXG4gICAgICAgICAgICBjb250ZXh0LnNldExleGVtZShsZXhlbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGluZy5zZXQobGV4ZW1lLnJlZmVyZW50LCB7IG5lZ2F0ZWQ6IGNsYXVzZS5uZWdhdGVkIH0pXG4gICAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpbmdcbn1cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkLFxuICAgIGF1dG92aXZpZmljYXRpb246IGJvb2xlYW4sXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxLZXlzKG9iamVjdDogb2JqZWN0LCBpdGVyID0gNSkge1xuXG4gICAgbGV0IG9iaiA9IG9iamVjdFxuICAgIGxldCByZXM6IHN0cmluZ1tdID0gW11cblxuICAgIHdoaWxlIChvYmogJiYgaXRlcikge1xuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3Qua2V5cyhvYmopXVxuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopXVxuICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKVxuICAgICAgICBpdGVyLS1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IHsgbmV3SW5zdGFuY2UgfSBmcm9tIFwiLi9uZXdJbnN0YW5jZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ29weShvYmplY3Q6IG9iamVjdCkge1xuXG4gICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgcmV0dXJuIHsgX19wcm90b19fOiBvYmplY3QgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWQgPSBvYmplY3QuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIHJldHVybiB3cmFwcGVkXG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBuZXdJbnN0YW5jZShvYmplY3QpXG4gICAgfVxuXG4gICAgLy8gaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgLy8gICAgIGNvbnN0IHdyYXBwZWQgPSBvYmplY3QuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50XG4gICAgLy8gICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gb2JqZWN0LmlubmVySFRNTFxuICAgIC8vICAgICByZXR1cm4gd3JhcHBlZFxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIC8vIHJldHVybiB7IC4uLm9iamVjdCB9XG4gICAgLy8gICAgIHJldHVybiB7IF9fcHJvdG9fXzogb2JqZWN0IH1cbiAgICAvLyB9XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjXG4gICAgICAgIHJldHVybiBoMSAmIGgxIC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pXG59XG4iLCJpbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4vdW5pcVwiXG5cbi8qKlxuICogSW50ZXJzZWN0aW9uIGJldHdlZW4gdHdvIGxpc3RzIG9mIHN0cmluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3Rpb24oeHM6IHN0cmluZ1tdLCB5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdW5pcSh4cy5maWx0ZXIoeCA9PiB5cy5pbmNsdWRlcyh4KSlcbiAgICAgICAgLmNvbmNhdCh5cy5maWx0ZXIoeSA9PiB4cy5pbmNsdWRlcyh5KSkpKVxufVxuIiwiaW1wb3J0IHsgdGFnTmFtZUZyb21Qcm90byB9IGZyb20gXCIuL3RhZ05hbWVGcm9tUHJvdG9cIlxuXG4vKipcbiAqIFxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGFuIG9iamVjdCAoZXZlbiBIVE1MRWxlbWVudCkgZnJvbSBhIHByb3RvdHlwZS5cbiAqIEluIGNhc2UgaXQncyBhIG51bWJlciwgbm8gbmV3IGluc3RhbmNlIGlzIG1hZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdJbnN0YW5jZShwcm90bzogb2JqZWN0LCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgaWYgKHByb3RvID09PSBOdW1iZXIucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFyZ3NbMF0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKSA6XG4gICAgICAgIG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvciguLi5hcmdzKVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIlxuLyoqXG4gKiBUcnkgZ2V0dGluZyB0aGUgbmFtZSBvZiBhbiBodG1sIGVsZW1lbnQgZnJvbSBhIHByb3RvdHlwZVxuICovXG5leHBvcnQgY29uc3QgdGFnTmFtZUZyb21Qcm90byA9ICh4OiBvYmplY3QpID0+IHguY29uc3RydWN0b3IubmFtZVxuICAgIC5yZXBsYWNlKCdIVE1MJywgJycpXG4gICAgLnJlcGxhY2UoJ0VsZW1lbnQnLCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGxldCBzZWVuID0ge30gYXMgYW55XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCJpbXBvcnQgeyB0ZXN0MSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxXCJcbmltcG9ydCB7IHRlc3QxMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxMFwiXG5pbXBvcnQgeyB0ZXN0MTEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTFcIlxuaW1wb3J0IHsgdGVzdDEyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEyXCJcbmltcG9ydCB7IHRlc3QxMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxM1wiXG5pbXBvcnQgeyB0ZXN0MTQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTRcIlxuaW1wb3J0IHsgdGVzdDE1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE1XCJcbmltcG9ydCB7IHRlc3QxNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxNlwiXG5pbXBvcnQgeyB0ZXN0MTcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTdcIlxuaW1wb3J0IHsgdGVzdDE4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE4XCJcbmltcG9ydCB7IHRlc3QxOSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxOVwiXG5pbXBvcnQgeyB0ZXN0MiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyXCJcbmltcG9ydCB7IHRlc3QyMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyMFwiXG5pbXBvcnQgeyB0ZXN0MjEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjFcIlxuaW1wb3J0IHsgdGVzdDIyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIyXCJcbmltcG9ydCB7IHRlc3QyMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyM1wiXG5pbXBvcnQgeyB0ZXN0MjQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjRcIlxuaW1wb3J0IHsgdGVzdDI1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI1XCJcbmltcG9ydCB7IHRlc3QyNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyNlwiXG5pbXBvcnQgeyB0ZXN0MjcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjdcIlxuaW1wb3J0IHsgdGVzdDI4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI4XCJcbmltcG9ydCB7IHRlc3QyOSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyOVwiXG5pbXBvcnQgeyB0ZXN0MyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzXCJcbmltcG9ydCB7IHRlc3QzMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzMFwiXG5pbXBvcnQgeyB0ZXN0MzEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzFcIlxuaW1wb3J0IHsgdGVzdDMyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMyXCJcbmltcG9ydCB7IHRlc3QzMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzM1wiXG5pbXBvcnQgeyB0ZXN0MzQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzRcIlxuaW1wb3J0IHsgdGVzdDM1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM1XCJcbmltcG9ydCB7IHRlc3QzNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzNlwiXG5pbXBvcnQgeyB0ZXN0MzcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzdcIlxuaW1wb3J0IHsgdGVzdDM4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM4XCJcbmltcG9ydCB7IHRlc3Q0IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDRcIlxuaW1wb3J0IHsgdGVzdDUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0NVwiXG5pbXBvcnQgeyB0ZXN0NiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q2XCJcbmltcG9ydCB7IHRlc3Q3IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDdcIlxuaW1wb3J0IHsgdGVzdDggfSBmcm9tIFwiLi90ZXN0cy90ZXN0OFwiXG5pbXBvcnQgeyB0ZXN0OSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q5XCJcbmltcG9ydCB7IGNsZWFyRG9tIH0gZnJvbSBcIi4vdXRpbHMvY2xlYXJEb21cIlxuaW1wb3J0IHsgc2xlZXAgfSBmcm9tIFwiLi91dGlscy9zbGVlcFwiXG5cblxuY29uc3QgdGVzdHMgPSBbXG4gICAgdGVzdDEsXG4gICAgdGVzdDIsXG4gICAgdGVzdDMsXG4gICAgdGVzdDQsXG4gICAgdGVzdDUsXG4gICAgdGVzdDYsXG4gICAgdGVzdDcsXG4gICAgdGVzdDgsXG4gICAgdGVzdDksXG4gICAgdGVzdDEwLFxuICAgIHRlc3QxMSxcbiAgICB0ZXN0MTIsXG4gICAgdGVzdDEzLFxuICAgIHRlc3QxNCxcbiAgICB0ZXN0MTUsXG4gICAgdGVzdDE2LFxuICAgIHRlc3QxNyxcbiAgICB0ZXN0MTgsXG4gICAgLy8gdGVzdDE5LCAvLyB1c2VzIGlmXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG4gICAgdGVzdDI2LFxuICAgIHRlc3QyNyxcbiAgICB0ZXN0MjgsXG4gICAgdGVzdDI5LFxuICAgIC8vIHRlc3QzMCwvLyBkeW5hbWljYWxseSBkZWZpbmluZyBhIGNvcHVsYVxuICAgIHRlc3QzMSxcbiAgICAvLyB0ZXN0MzIsXG4gICAgdGVzdDMzLFxuICAgIC8vIHRlc3QzNCwvLyBkeW5hbWljYWxseSBkZWZpbmluZyBhbiBhbGlhc1xuICAgIHRlc3QzNSxcbiAgICAvLyB0ZXN0MzYsIC8vIGR5bmFtaWNhbGx5IGRlZmluaW5nIGFuIG12ZXJiXG4gICAgdGVzdDM3LFxuICAgIHRlc3QzOCxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHRlc3QoKVxuICAgICAgICBjb25zb2xlLmxvZyhgJWMke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbCd9ICR7dGVzdC5uYW1lfWAsIGBjb2xvcjoke3N1Y2Nlc3MgPyAnZ3JlZW4nIDogJ3JlZCd9YClcbiAgICAgICAgYXdhaXQgc2xlZXAoMTApLy83NVxuICAgICAgICBjbGVhckRvbSgpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2dyZWVuJztcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0Mztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFuZCB3IGFyZSBidXR0b25zJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgcmVkJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndyBhbmQgeiBhcmUgYmxhY2snKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmQ7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZDtcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDQgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDMgJiYgYXNzZXJ0NDtcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFwcGVuZENoaWxkcyB5Jyk7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLmNoaWxkcmVuKS5pbmNsdWRlcyhicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0pO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIC8vIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24gYW5kIHRoZSBidXR0b24gaXMgZ3JlZW4nKVxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIGl0IGlzIGdyZWVuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE0KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQgYW5kIHogaXMgZ3JlZW4uJyk7XG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIG5vdCByZWQuJyk7XG5cbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNSgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ogaXMgcmVkLicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IGJ1dHRvbiBpcyBub3QgYmx1ZS4nKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuXG4gICAgcmV0dXJuIGFzc2VydDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgaGlkZGVuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5oaWRkZW47XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBub3QgaGlkZGVuJyk7XG4gICAgY29uc3QgYXNzZXJ0MiA9ICFicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uaGlkZGVuO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgY29uc3QgeCA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXTtcbiAgICB4Lm9uY2xpY2sgPSAoKSA9PiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggY2xpY2tzJyk7XG4gICAgcmV0dXJuIHguc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgcmVkLiB4IGlzIGEgYnV0dG9uIGFuZCB5IGlzIGEgZGl2LicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IHJlZCBidXR0b24gaXMgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZGl2JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MjtcblxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgY29uc3QgdjEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCB2MiA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LnZhbHVlcy5sZW5ndGg7XG4gICAgcmV0dXJuIHYyIC0gdjEgPT09IDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24gaWYgeCBpcyByZWQnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBjb2xvciBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIHJlZC4geCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpO1xuICAgIGxldCBjbGlja3MgPSAnJztcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0ub25jbGljayA9ICgpID0+IGNsaWNrcyArPSAneCc7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IGJ1dHRvbiBjbGlja3MnKTtcbiAgICByZXR1cm4gY2xpY2tzID09PSAneHknO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgcmVkIGFuZCB5IGlzIGJsdWUnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbnMgYXJlIHJlZCcpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQuIHogaXMgYmx1ZS4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucyBhcmUgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibHVlJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYmxhY2sgYnV0dG9ucycpLmxlbmd0aCA9PT0gMjtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYm9yZGVyIG9mIHN0eWxlIG9mIHggaXMgZG90dGVkLXllbGxvdycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5ib3JkZXIuaW5jbHVkZXMoJ2RvdHRlZCB5ZWxsb3cnKTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgMSBhbmQgeSBpcyAyJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhZGRzIHknKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnaXQnKVswXSA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJsYWNrIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgZ3JlZW4gYW5kIHkgaXMgcmVkLicpO1xuICAgIGNvbnN0IHJlcyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2NvbG9yIG9mIHRoZSByZWQgYnV0dG9uJyk7XG4gICAgcmV0dXJuIHJlcy5pbmNsdWRlcygncmVkJykgJiYgIXJlcy5pbmNsdWRlcygnZ3JlZW4nKTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICAvLyBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGRpdiBhbmQgdGhlIHdpZHRoIG9mIHN0eWxlIG9mIHRoZSBkaXYgaXMgNTB2dycpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBkaXYuIHRoZSB3aWR0aCBvZiBzdHlsZSBvZiBpdCBpcyA1MHZ3Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBkaXYnKVswXS5zdHlsZS53aWR0aCA9PT0gJzUwdncnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnc29tZXRoaW5nIGJ1dHRvbicpLmxlbmd0aCA9PT0gMDtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geSBpcyBncmVlbicpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYXBwZW5kQ2hpbGRzIHknKTtcbiAgICBicmFpbi5leGVjdXRlKCd6IGlzIGFuIHgnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKTtcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWQ7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbicpWzBdLnRleHRDb250ZW50ID09PSAnY2FwcmEnO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b24nKS5sZW5ndGggPT09IDA7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2dyZWVuIGJ1dHRvbicpLmxlbmd0aCA9PT0gMTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGNvbnN0IHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JylcbiAgICBkb2N1bWVudC5ib2R5ID0geFxufSIsImV4cG9ydCBmdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=