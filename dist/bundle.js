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
    // protected name = this.args.name
    constructor(args) {
        this.args = args;
        this.id = this.args.id;
        this.relations = [];
        this.parent = this.args.parent; //container
        this.object = this.args.object;
        this.superclass = this.args.superclass;
        this.base = this.args.base;
        this.getLexemes = () => {
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
            .map(x => new BaseThing({ object: x.obj, id: `${this.id}.${x.name}`, parent: this /* , name: x.name */ }));
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
    // buttonThing,
    // divThing,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFHQUFtQztBQUduQyxrQkFBSSxHQUFFOzs7Ozs7Ozs7Ozs7O0FDSE4sOEdBQWtFO0FBTWxFLE1BQXFCLFVBQVU7SUFJM0IsWUFDYSxJQUFrQixFQUNsQixhQUFrQyxFQUFFO1FBRHBDLFNBQUksR0FBSixJQUFJLENBQWM7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBMEI7UUFJakQsUUFBRyxHQUFHLENBQUMsRUFBTSxFQUFxQixFQUFFO1lBRWhDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFFN0IsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pDO1lBRUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztZQUMxQixPQUFPLENBQUM7UUFDWixDQUFDO1FBTUQsUUFBRyxHQUFHLENBQUMsT0FBYyxFQUFTLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDbEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPO1FBQ2hELENBQUM7UUFFRCxVQUFLLEdBQUcsQ0FBQyxLQUFhLEVBQVMsRUFBRTtZQUU3QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTTtpQkFDdkIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO1lBRTVDLE1BQU0sSUFBSSxHQUFHLFFBQVE7aUJBQ2hCLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRTlDLDJGQUEyRjtZQUMzRixPQUFPLElBQUk7UUFDZixDQUFDO0lBcENELENBQUM7SUFnQkQsSUFBSSxNQUFNO1FBQ04sT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekMsQ0FBQztJQW9CUyxpQkFBaUIsQ0FBQyxjQUFrQjtRQUMxQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWM7U0FDdkM7SUFDTCxDQUFDO0NBR0o7QUFyREQsZ0NBcURDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkRELHdIQUFzQztBQVV0QyxTQUF3QixTQUFTLENBQUMsSUFBbUI7SUFDakQsT0FBTyxJQUFJLG9CQUFVLENBQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksQ0FBQztBQUNyQyxDQUFDO0FBRkQsK0JBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJELDhGQUF3RDtBQUN4RCxpSkFBNkQ7QUFDN0QsOEdBQXlEO0FBQ3pELDhHQUE0RTtBQUM1RSxtS0FBcUY7QUFDckYsd0lBQXNFO0FBR3RFLCtGQUE4QztBQUM5QyxrR0FBZ0Q7QUFFaEQsMEZBQWtDO0FBR2xDLE1BQWEsU0FBUztJQVFsQixrQ0FBa0M7SUFHbEMsWUFBcUIsSUFBYztRQUFkLFNBQUksR0FBSixJQUFJLENBQVU7UUFUMUIsT0FBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoQixjQUFTLEdBQWUsRUFBRTtRQUMzQixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsV0FBVztRQUNyQyxXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1FBQ3hCLGVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7UUFDakMsU0FBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtRQTREL0IsZUFBVSxHQUFHLEdBQUcsRUFBRTtZQUVkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBRTFDLElBQUk7b0JBRUEsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRXJCLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTt3QkFDakIsT0FBTyxFQUFFO3FCQUNaO29CQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxNQUFNLEVBQUU7b0JBRTdCLE1BQU0sR0FBRyxHQUFHLHVCQUFVLEVBQUM7d0JBQ25CLElBQUksRUFBRSxtQkFBTSxFQUFDLFNBQVMsQ0FBQzt3QkFDdkIsSUFBSSxFQUFFLENBQUM7d0JBQ1AsUUFBUSxFQUFFLENBQUM7cUJBQ2QsQ0FBQztvQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDO2lCQUNmO2dCQUFDLFdBQU07b0JBQ0osT0FBTyxFQUFFO2lCQUNaO1lBR0wsQ0FBQyxDQUFDO1lBRUYsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBaUhELGVBQVUsR0FBRyxHQUFHLEVBQUUsbUJBQUMsNEJBQU8sRUFBQyxVQUFJLENBQUMsTUFBTSxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQU8sRUFBQyxnQkFBSSxDQUFDLElBQUksMENBQUUsTUFBTSxFQUFFLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFPLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFwTTlHLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBTTs7UUFFTixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUMzQixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRW5CLElBQUksQ0FBQztRQUVMLElBQUk7WUFDQSxDQUFDLEdBQUcsWUFBQyxJQUFZLENBQUMsRUFBRSxDQUFDLG1DQUFJLE1BQUMsSUFBSSxDQUFDLE1BQWMsMENBQUcsRUFBRSxDQUFDLG1DQUFJLFVBQUksQ0FBQyxJQUFJLDBDQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7U0FDNUU7UUFBQyxXQUFNO1lBQ0osT0FBTyxTQUFTO1NBQ25CO1FBRUQsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNKLE9BQU8sU0FBUztTQUNuQjtRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3pHLFNBQVM7UUFFVCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU8sQ0FBQztJQUVaLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBZTs7UUFFaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsT0FBTyxJQUFJLFNBQVMsQ0FBQztnQkFDakIsRUFBRSxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLG1DQUFJLElBQUksQ0FBQyxFQUFFO2dCQUN2QixNQUFNLEVBQUUsdUJBQVEsRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ2hDLENBQUM7U0FDTDtRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLE9BQU8sSUFBSSxTQUFTLENBQUM7Z0JBQ2pCLEVBQUUsRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsRUFBRSxtQ0FBSSxJQUFJLENBQUMsRUFBRTtnQkFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUMzQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7YUFDekIsQ0FBQztTQUNMO1FBRUQsTUFBTSxPQUFPO0lBQ2pCLENBQUM7SUFFRCxNQUFNOztRQUNGLE9BQU8sVUFBSSxDQUFDLE1BQU0sbUNBQUksVUFBSSxDQUFDLElBQUksMENBQUUsTUFBTSxFQUFFO0lBQzdDLENBQUM7SUFpQ0QsR0FBRyxDQUFDLFNBQWdCLEVBQUUsSUFBYztRQUVoQyx5QkFBeUI7O1FBRXpCLE1BQU0sUUFBUSxHQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxtQ0FBSSxFQUFFLEVBQUU7UUFFaEUsSUFBSSxLQUFLLEdBQWUsRUFBRTtRQUMxQixJQUFJLE9BQU8sR0FBZSxFQUFFO1FBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXhFLElBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sRUFBRTtZQUNmLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQztTQUN2QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUMzQjthQUFNO1lBQ0gsS0FBSyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlFO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO0lBQ3RELENBQUM7SUFFUyxXQUFXLENBQUMsS0FBaUIsRUFBRSxPQUFtQixFQUFFLElBQWdCO1FBRTFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDO1FBRUYsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQztRQUVGLE9BQU8sRUFBRTtJQUNiLENBQUM7SUFFUyxhQUFhLENBQUMsUUFBa0I7UUFDdEMsT0FBTyxFQUFFLEVBQUMsTUFBTTtJQUNwQixDQUFDO0lBRVMsRUFBRSxDQUFDLFFBQWtCO1FBQzNCLGtGQUFrRjtRQUVsRixJQUFLLFFBQVEsQ0FBQyxTQUF1QixDQUFDLFVBQVUsS0FBSyxtQkFBVSxFQUFFO1lBQzdELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1lBQzNCLE9BQU07U0FDVDtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUNwQyxDQUFDO0lBRVMsWUFBWSxDQUFDLFFBQWtCOztRQUNyQyxNQUFNLEtBQUssR0FBRyxVQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywwQ0FBRSxNQUFNLEVBQUU7UUFDekMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUQsT0FBTTtJQUNWLENBQUM7SUFFUyxJQUFJLENBQUMsUUFBa0I7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0lBQ3ZDLENBQUM7SUFFUyxJQUFJLENBQUMsUUFBa0I7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVTLFdBQVcsQ0FBQyxRQUFrQjtRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVTLGNBQWMsQ0FBQyxRQUFrQjtRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFUyxTQUFTLENBQUMsUUFBa0I7UUFDbEMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUM7ZUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFUyxPQUFPLENBQUMsS0FBWTtRQUUxQixvREFBb0Q7O1FBRXBELElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRTtRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFFdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxZQUFZLHNCQUFZLEVBQUU7WUFDbEYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3BEO0lBRUwsQ0FBQztJQUVTLFVBQVUsQ0FBQyxRQUFlOztRQUNoQyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFO1lBRTlCLElBQUksV0FBSSxDQUFDLElBQUksMENBQUUsTUFBTSxFQUFFLGFBQVksV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLFlBQVksc0JBQVksRUFBRTtnQkFDbkYsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3BEO1lBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFLLENBQUMsSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBSztTQUUxQjtJQUNMLENBQUM7SUFJRCxRQUFRLENBQUMsSUFBYTs7UUFDbEIsTUFBTSxDQUFDLEdBQUcsVUFBSSxDQUFDLElBQUksMENBQUUsTUFBTSxFQUFFO1FBQzdCLElBQUksQ0FBQyxZQUFZLFdBQVcsRUFBRTtZQUMxQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQ2pEO0lBQ0wsQ0FBQztJQUdELHlFQUF5RTtJQUN6RSxRQUFRLENBQUMsS0FBYztRQUVuQixNQUFNLFlBQVksR0FBRyxLQUFLLGFBQUwsS0FBSyxjQUFMLEtBQUssR0FBSSxvQkFBVztRQUV6QyxNQUFNLFlBQVksR0FBRyxxQkFBUSxFQUFDLHVCQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTTtRQUVyRyxNQUFNLEdBQUcsR0FBRyxZQUFZO2FBQ25CLFFBQVEsRUFBRTthQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQ25ELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLFdBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBQyxDQUFDLFNBQVMsMENBQUUsUUFBUyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFDO2FBQzVFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3BELE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBR3RDLDhCQUE4QjtRQUM5QixPQUFPLEdBQUc7SUFDZCxDQUFDO0lBRVMsU0FBUyxDQUFDLENBQVM7UUFFekIsbUdBQW1HO1FBRW5HLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLHlDQUFpQixFQUFDLENBQUMsRUFBRSwwQkFBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsb0JBQVc7UUFFakIsOEJBQThCO1FBQzlCLE9BQU8sR0FBRztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYyxFQUFFLFlBQWlCLEVBQUU7O1FBRXJDLE1BQU0sRUFBRSxHQUFHLHlDQUFpQixFQUFDLE1BQU0sRUFBRSwwQkFBVyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELDJFQUEyRTtRQUUzRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLEVBQUUsMEJBQTBCO1lBQzdDLDZEQUE2RDtZQUM3RCxvRUFBb0U7WUFDcEUsc0hBQXNIO1lBRXRILElBQUksSUFBSSxDQUFDLE1BQU0sTUFBSyxrQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLDBDQUFFLFFBQVEsMENBQUUsTUFBTSxFQUFFLEdBQUUsRUFBRSxpREFBaUQ7Z0JBQ2hILE9BQU8saUNBQU0sU0FBUyxLQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUc7YUFDM0Q7WUFFRCxPQUFPLEVBQUUsRUFBQyxNQUFNO1NBQ25CO1FBRUQsdUJBQXVCO1FBRXZCLE1BQU0sR0FBRyxHQUFHLDBCQUFXLEVBQUMsTUFBTSxDQUFDO1FBRS9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUU7YUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7UUFFNUMsTUFBTSxhQUFhLEdBQUcsa0JBQWtCLE9BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBQyxRQUFDLE9BQUMsQ0FBQyxTQUFTLDBDQUFFLElBQUksRUFBRSxPQUFDLENBQUMsU0FBUywwQ0FBRSxLQUFLLENBQUMsSUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQVcsQ0FBQztRQUVwSixNQUFNLFFBQVEsR0FBWSxJQUFJLENBQUMsVUFBVSxFQUFFO2FBQ3RDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLFFBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLElBQUM7YUFDbkQsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjO2FBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLHFCQUFvQixFQUFFLENBQUMsQ0FBQztRQUc3RyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR3pFLE9BQU8sR0FBRztJQUVkLENBQUM7Q0FJSjtBQXhTRCw4QkF3U0M7QUFRRCxTQUFTLGNBQWMsQ0FBQyxFQUFZLEVBQUUsRUFBWTtJQUM5QyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEtBQUssRUFBRSxDQUFDLFNBQVM7V0FDN0IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNO1dBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUM3VEQsbUdBQXVDO0FBMEJ2QyxTQUFnQixJQUFJLENBQUMsSUFBYztJQUMvQixPQUFPLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUM7QUFDOUIsQ0FBQztBQUZELG9CQUVDOzs7Ozs7Ozs7Ozs7OztBQy9CRCxTQUFnQixNQUFNLENBQUMsQ0FBUztJQUU1QixRQUFRLE9BQU8sQ0FBQyxFQUFFO1FBQ2QsS0FBSyxVQUFVO1lBQ1gsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPO1FBQzNDLEtBQUssU0FBUztZQUNWLE9BQU8sV0FBVztRQUN0QixLQUFLLFdBQVc7WUFDWixPQUFPLFNBQVM7UUFDcEI7WUFDSSxPQUFPLE1BQU07S0FDcEI7QUFFTCxDQUFDO0FBYkQsd0JBYUM7Ozs7Ozs7Ozs7Ozs7O0FDZkQsc0ZBQW1DO0FBQ25DLCtGQUEwQztBQUMxQyxzRkFBbUM7QUFDbkMseUZBQTJEO0FBQzNELDJHQUFxRDtBQUNyRCxtRkFBaUM7QUFHakMsU0FBZ0IsU0FBUztJQUVyQixPQUFPO1FBQ0gsV0FBVyxFQUFYLHdCQUFXO1FBQ1gsT0FBTyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxHQUFHLHVCQUFVLEVBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsQ0FBQyxDQUFDO1FBQ0YsUUFBUSxFQUFSLG1CQUFRO1FBQ1IsT0FBTyxFQUFQLGlCQUFPO1FBQ1Asb0JBQW9CLEVBQXBCLCtCQUFvQjtRQUNwQixNQUFNLEVBQU4sZUFBTTtLQUNUO0FBQ0wsQ0FBQztBQWJELDhCQWFDOzs7Ozs7Ozs7Ozs7OztBQ3BCRCxpSEFBd0Q7QUFJM0MsbUJBQVcsR0FBRyxtQ0FBYyxFQUN2QyxXQUFXLEVBQ1gsYUFBYSxFQUNiLFFBQVEsRUFDUixRQUFRLEVBQ1IsVUFBVSxFQUNWLFVBQVUsRUFDVixPQUFPLEVBQ1AsT0FBTyxFQUNQLE9BQU8sRUFDUCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixRQUFRLEVBQ1IsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sYUFBYSxFQUNiLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUFFLFVBQVU7QUFDeEIsU0FBUyxFQUFFLHVCQUF1QjtBQUNsQyxTQUFTLENBRVY7Ozs7Ozs7Ozs7Ozs7O0FDN0JELDJHQUE4RDtBQUM5RCxtRkFBOEU7QUFFOUUsTUFBTSxLQUFLLEdBQVcsdUJBQVUsRUFBQztJQUM3QixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxRQUFRO0NBQ2pCLENBQUM7QUFFRixNQUFNLEtBQUssR0FBb0I7SUFDM0IsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsT0FBTztDQUNoQjtBQUVELE1BQU0sR0FBRyxHQUFXLHVCQUFVLEVBQUM7SUFDM0IsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsVUFBVTtDQUNuQixDQUFDO0FBR1csZUFBTyxHQUFpQztJQUVqRCxLQUFLO0lBQ0wsS0FBSztJQUNMLEdBQUc7SUFFSCxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFO0lBQzdDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDaEQsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRTtJQUUvQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUNoQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFO0lBQzNELEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUM3RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtJQUMvQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUN0QyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUN4QyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUNyQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUU7SUFDbkMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDbkMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDcEMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDeEMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDMUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDaEMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDakMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDakMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7SUFDbkMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUU7SUFDbkMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDakMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7SUFDL0IsRUFBRSxJQUFJLEVBQUUsT0FBTyxF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LElBQUksR0FBRyxDQUFDO0FBQ3JCLENBQUM7QUFIRCw0QkFHQzs7Ozs7Ozs7Ozs7Ozs7QUNIRCxTQUFnQixLQUFLLENBQUMsU0FBaUI7SUFDbkMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQztJQUN6QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBSkQsc0JBSUM7Ozs7Ozs7VUNKRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmcvQmFzZVRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZy9UaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmcvdHlwZU9mLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy90aGluZ3MudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9CYXNlTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQW5kLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQXRvbUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvc29sdmVNYXBzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2V2YWxBc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9hbGxLZXlzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZGVlcENvcHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvbmV3SW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3RhZ05hbWVGcm9tUHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxNS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyOS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzMS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDMzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzNy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0NC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0Ny50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy91dGlscy9jbGVhckRvbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdXRpbHMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5cblxubWFpbigpIiwiaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBUaGluZyBmcm9tIFwiLi4vdGhpbmcvVGhpbmdcIjtcbmltcG9ydCB7IEVudmlybywgfSBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUVudmlybyBpbXBsZW1lbnRzIEVudmlybyB7XG5cbiAgICBwcm90ZWN0ZWQgbGFzdFJlZmVyZW5jZWQ/OiBJZFxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgPSAoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLmRpY3Rpb25hcnlbcDFdXG5cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB3LmdldChwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldExhc3RSZWZlcmVuY2VkKHAxKVxuICAgICAgICByZXR1cm4gd1xuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogVGhpbmdbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXQgPSAod3JhcHBlcjogVGhpbmcpOiBUaGluZyA9PiB7XG4gICAgICAgIHRoaXMuc2V0TGFzdFJlZmVyZW5jZWQod3JhcHBlci5pZClcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVt3cmFwcGVyLmlkXSA9IHdyYXBwZXJcbiAgICB9XG5cbiAgICBxdWVyeSA9IChxdWVyeTogQ2xhdXNlKTogTWFwW10gPT4ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy52YWx1ZXNcbiAgICAgICAgICAgIC5tYXAodyA9PiB3LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCBtYXBzID0gdW5pdmVyc2VcbiAgICAgICAgICAgIC5xdWVyeShxdWVyeSwgeyBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCB9KVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdxdWVyeT0nLCBxdWVyeS50b1N0cmluZygpLCAndW5pdmVyc2U9JywgdW5pdmVyc2UudG9TdHJpbmcoKSwgJ21hcHM9JywgbWFwcylcbiAgICAgICAgcmV0dXJuIG1hcHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TGFzdFJlZmVyZW5jZWQobGFzdFJlZmVyZW5jZWQ6IElkKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRpY3Rpb25hcnkpLmluY2x1ZGVzKGxhc3RSZWZlcmVuY2VkKSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGxhc3RSZWZlcmVuY2VkXG4gICAgICAgIH1cbiAgICB9XG5cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBUaGluZyBmcm9tIFwiLi4vdGhpbmcvVGhpbmdcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBnZXQoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWRcbiAgICBzZXQod3JhcHBlcjogVGhpbmcpOiBUaGluZ1xuICAgIHJlYWRvbmx5IHZhbHVlczogVGhpbmdbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgeyB0aGluZywgY29sb3JUaGluZyB9IGZyb20gJy4uLy4uL2NvbmZpZy90aGluZ3MnO1xuaW1wb3J0IEJhc2ljQ29udGV4dCBmcm9tICcuLi8uLi9mYWNhZGUvY29udGV4dC9CYXNpY0NvbnRleHQnO1xuaW1wb3J0IHsgbWFrZUxleGVtZSB9IGZyb20gJy4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZSc7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gJy4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZSc7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gJy4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpbic7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gJy4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbCc7XG5pbXBvcnQgeyBJZCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9JZCc7XG5pbXBvcnQgeyBNYXAgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvTWFwJztcbmltcG9ydCB7IGFsbEtleXMgfSBmcm9tICcuLi8uLi91dGlscy9hbGxLZXlzJztcbmltcG9ydCB7IGRlZXBDb3B5IH0gZnJvbSAnLi4vLi4vdXRpbHMvZGVlcENvcHknO1xuaW1wb3J0IFRoaW5nLCB7IENvcHlPcHRzLCBTZXRBcmdzLCBXcmFwQXJncyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSAnLi90eXBlT2YnO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XG5cbiAgICByZWFkb25seSBpZCA9IHRoaXMuYXJncy5pZFxuICAgIHByb3RlY3RlZCByZWxhdGlvbnM6IFJlbGF0aW9uW10gPSBbXVxuICAgIHJlYWRvbmx5IHBhcmVudCA9IHRoaXMuYXJncy5wYXJlbnQgLy9jb250YWluZXJcbiAgICByZWFkb25seSBvYmplY3QgPSB0aGlzLmFyZ3Mub2JqZWN0XG4gICAgcHJvdGVjdGVkIHN1cGVyY2xhc3MgPSB0aGlzLmFyZ3Muc3VwZXJjbGFzc1xuICAgIHByb3RlY3RlZCBiYXNlID0gdGhpcy5hcmdzLmJhc2VcbiAgICAvLyBwcm90ZWN0ZWQgbmFtZSA9IHRoaXMuYXJncy5uYW1lXG5cblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFyZ3M6IFdyYXBBcmdzKSB7XG5cbiAgICB9XG5cbiAgICBnZXQoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG5cbiAgICAgICAgbGV0IG9cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbyA9ICh0aGlzIGFzIGFueSlbcDFdID8/ICh0aGlzLm9iamVjdCBhcyBhbnkpPy5bcDFdID8/IHRoaXMuYmFzZT8uZ2V0KHAxKVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbykge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdyA9IG8gaW5zdGFuY2VvZiBCYXNlVGhpbmcgPyBvIDogbmV3IEJhc2VUaGluZyh7IG9iamVjdDogbywgaWQ6IGAke3RoaXMuaWR9LiR7cDF9YCwgcGFyZW50OiB0aGlzIH0pXG4gICAgICAgIC8vbWVtb2l6ZVxuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdy5nZXQocGFydHMuc2xpY2UoMSkuam9pbignLicpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdcblxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogVGhpbmcge1xuXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoe1xuICAgICAgICAgICAgICAgIGlkOiBvcHRzPy5pZCA/PyB0aGlzLmlkLFxuICAgICAgICAgICAgICAgIG9iamVjdDogZGVlcENvcHkodGhpcy5vYmplY3QpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmJhc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKHtcbiAgICAgICAgICAgICAgICBpZDogb3B0cz8uaWQgPz8gdGhpcy5pZCxcbiAgICAgICAgICAgICAgICBzdXBlcmNsYXNzOiB0aGlzLnN1cGVyY2xhc3MsXG4gICAgICAgICAgICAgICAgYmFzZTogdGhpcy5iYXNlLmNvcHkoKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyAnVE9ETyEnXG4gICAgfVxuXG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3QgPz8gdGhpcy5iYXNlPy51bndyYXAoKVxuICAgIH1cblxuICAgIGdldExleGVtZXMgPSAoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbGV4ZW1lcyA9IHRoaXMuZ2V0QWxsS2V5cygpLmZsYXRNYXAoeCA9PiB7XG5cbiAgICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvID0gdGhpcy5nZXQoeClcblxuICAgICAgICAgICAgICAgIGlmIChvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdW53cmFwcGVkID0gbz8udW53cmFwKClcblxuICAgICAgICAgICAgICAgIGNvbnN0IGxleCA9IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiB0eXBlT2YodW53cmFwcGVkKSxcbiAgICAgICAgICAgICAgICAgICAgcm9vdDogeCxcbiAgICAgICAgICAgICAgICAgICAgcmVmZXJlbnQ6IG8sXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJldHVybiBbbGV4XVxuICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBsZXhlbWVzLmNvbmNhdChsZXhlbWVzLmZsYXRNYXAobCA9PiBsLmV4dHJhcG9sYXRlKCkpKVxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IFRoaW5nLCBvcHRzPzogU2V0QXJncyk6IFRoaW5nW10ge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHByZWRpY2F0ZSlcblxuICAgICAgICBjb25zdCByZWxhdGlvbjogUmVsYXRpb24gPSB7IHByZWRpY2F0ZSwgYXJnczogb3B0cz8uYXJncyA/PyBbXSB9XG5cbiAgICAgICAgbGV0IGFkZGVkOiBSZWxhdGlvbltdID0gW11cbiAgICAgICAgbGV0IHJlbW92ZWQ6IFJlbGF0aW9uW10gPSBbXVxuICAgICAgICBsZXQgdW5jaGFuZ2VkID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXJlbGF0aW9uc0VxdWFsKHgsIHJlbGF0aW9uKSlcblxuICAgICAgICBpZiAob3B0cz8ubmVnYXRlZCkge1xuICAgICAgICAgICAgcmVtb3ZlZCA9IFtyZWxhdGlvbl1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQWxyZWFkeShyZWxhdGlvbikpIHtcbiAgICAgICAgICAgIHVuY2hhbmdlZC5wdXNoKHJlbGF0aW9uKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkZWQgPSBbcmVsYXRpb25dXG4gICAgICAgICAgICByZW1vdmVkLnB1c2goLi4udGhpcy5nZXRFeGNsdWRlZEJ5KHJlbGF0aW9uKSlcbiAgICAgICAgICAgIHVuY2hhbmdlZCA9IHVuY2hhbmdlZC5maWx0ZXIoeCA9PiAhcmVtb3ZlZC5zb21lKHIgPT4gcmVsYXRpb25zRXF1YWwoeCwgcikpKVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkZWQuZm9yRWFjaChyID0+IHRoaXMuYWRkUmVsYXRpb24ocikpXG4gICAgICAgIHJlbW92ZWQuZm9yRWFjaChyID0+IHRoaXMucmVtb3ZlUmVsYXRpb24ocikpXG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVpbnRlcnByZXQoYWRkZWQsIHJlbW92ZWQsIHVuY2hhbmdlZClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVpbnRlcnByZXQoYWRkZWQ6IFJlbGF0aW9uW10sIHJlbW92ZWQ6IFJlbGF0aW9uW10sIGtlcHQ6IFJlbGF0aW9uW10pOiBUaGluZ1tdIHtcblxuICAgICAgICByZW1vdmVkLmZvckVhY2gociA9PiB7XG4gICAgICAgICAgICB0aGlzLnVuZG8ocilcbiAgICAgICAgfSlcblxuICAgICAgICBhZGRlZC5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgdGhpcy5kbyhyKVxuICAgICAgICB9KVxuXG4gICAgICAgIGtlcHQuZm9yRWFjaChyID0+IHtcbiAgICAgICAgICAgIHRoaXMua2VlcChyKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRFeGNsdWRlZEJ5KHJlbGF0aW9uOiBSZWxhdGlvbik6IFJlbGF0aW9uW10ge1xuICAgICAgICByZXR1cm4gW10gLy9UT0RPXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRvKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygocmVsYXRpb24ucHJlZGljYXRlIGFzIEJldHRlckJhc2VUaGluZykuc3VwZXJjbGFzcyA9PT0gY29sb3JUaGluZyApXG5cbiAgICAgICAgaWYgKChyZWxhdGlvbi5wcmVkaWNhdGUgYXMgQmFzZVRoaW5nKS5zdXBlcmNsYXNzID09PSBjb2xvclRoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb2xvcihyZWxhdGlvbilcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbmhlcml0KHJlbGF0aW9uLnByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVmcmVzaENvbG9yKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICBjb25zdCBzdHlsZSA9IHRoaXMuZ2V0KCdzdHlsZScpPy51bndyYXAoKVxuICAgICAgICBzdHlsZSA/IHN0eWxlLmJhY2tncm91bmQgPSByZWxhdGlvbi5wcmVkaWNhdGUudW53cmFwKCkgOiAwXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHByb3RlY3RlZCB1bmRvKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICB0aGlzLmRpc2luaGVyaXQocmVsYXRpb24ucHJlZGljYXRlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrZWVwKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICB0aGlzLnJlZnJlc2hDb2xvcihyZWxhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkUmVsYXRpb24ocmVsYXRpb246IFJlbGF0aW9uKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zLnB1c2gocmVsYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbW92ZVJlbGF0aW9uKHJlbGF0aW9uOiBSZWxhdGlvbikge1xuICAgICAgICB0aGlzLnJlbGF0aW9ucyA9IHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+ICFyZWxhdGlvbnNFcXVhbChyZWxhdGlvbiwgeCkpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzQWxyZWFkeShyZWxhdGlvbjogUmVsYXRpb24pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICghcmVsYXRpb24uYXJncy5sZW5ndGggJiYgcmVsYXRpb24ucHJlZGljYXRlID09PSB0aGlzKVxuICAgICAgICAgICAgfHwgdGhpcy5yZWxhdGlvbnMuc29tZSh4ID0+IHJlbGF0aW9uc0VxdWFsKHgsIHJlbGF0aW9uKSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5oZXJpdChhZGRlZDogVGhpbmcpIHtcblxuICAgICAgICAvL1RPRE86IHByZXZlbnQgcmUtY3JlYXRpb24gb2YgZXhpc3RpbmcgRE9NIGVsZW1lbnRzXG5cbiAgICAgICAgdGhpcy5iYXNlID0gYWRkZWQuY29weSgpXG4gICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IGFkZGVkXG5cbiAgICAgICAgaWYgKHRoaXMuYmFzZS51bndyYXAoKSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzaWNDb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yb290Py5hcHBlbmRDaGlsZCh0aGlzLmJhc2UudW53cmFwKCkpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNpbmhlcml0KGV4cGVsbGVkOiBUaGluZykge1xuICAgICAgICBpZiAodGhpcy5zdXBlcmNsYXNzID09PSBleHBlbGxlZCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlPy51bndyYXAoKSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIHRoaXMucGFyZW50IGluc3RhbmNlb2YgQmFzaWNDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQucm9vdD8ucmVtb3ZlQ2hpbGQodGhpcy5iYXNlLnVud3JhcCgpKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhc2UgPSB0aGluZy5jb3B5KClcbiAgICAgICAgICAgIHRoaXMuc3VwZXJjbGFzcyA9IHRoaW5nXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFsbEtleXMgPSAoKSA9PiBhbGxLZXlzKHRoaXMub2JqZWN0ID8/IHt9KS5jb25jYXQoYWxsS2V5cyh0aGlzLmJhc2U/LnVud3JhcCgpID8/IHt9KSkuY29uY2F0KGFsbEtleXModGhpcykpXG5cbiAgICBwb2ludE91dChkb0l0OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmJhc2U/LnVud3JhcCgpXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHguc3R5bGUub3V0bGluZSA9IGRvSXQgPyAnI2YwMCBzb2xpZCAycHgnIDogJydcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1ldmlsIHN0YXJ0cyBiZWxvdy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRvQ2xhdXNlKHF1ZXJ5PzogQ2xhdXNlKSB7XG5cbiAgICAgICAgY29uc3QgcXVlcnlPckVtcHR5ID0gcXVlcnkgPz8gZW1wdHlDbGF1c2VcblxuICAgICAgICBjb25zdCBmaWxsZXJDbGF1c2UgPSBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogdGhpcy5pZC50b1N0cmluZygpLCB0eXBlOiAnbm91bicgfSksIHRoaXMuaWQpIC8vVE9ET1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IHF1ZXJ5T3JFbXB0eVxuICAgICAgICAgICAgLmZsYXRMaXN0KClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmVudGl0aWVzLmxlbmd0aCA9PT0gMSAmJiB4LnByZWRpY2F0ZSlcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB0aGlzLmlzQWxyZWFkeSh7IHByZWRpY2F0ZTogeC5wcmVkaWNhdGU/LnJlZmVyZW50ISwgYXJnczogW10gfSkpXG4gICAgICAgICAgICAubWFwKHggPT4geC5jb3B5KHsgbWFwOiB7IFt4LmFyZ3MhWzBdXTogdGhpcy5pZCB9IH0pKVxuICAgICAgICAgICAgLmNvbmNhdChmaWxsZXJDbGF1c2UpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgICAgICAgICAuYW5kKHRoaXMub3duZXJJbmZvKHF1ZXJ5T3JFbXB0eSkpXG5cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMudG9TdHJpbmcoKSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBvd25lckluZm8ocTogQ2xhdXNlKSB7XG5cbiAgICAgICAgLy9UT0RPOiB0aGlzIHVud2l0dGlubGd5IGFzc2VydHMgd3Jvbmcgbm9uLXJlbGF0aW9uYWwgaW5mbyBhYm91dCB0aGlzIG9iamVjdCBcInBhcnJvdGluZyB0aGUgcXVlcnlcIi5cblxuICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5xdWVyeShxKVxuICAgICAgICBjb25zdCByZXMgPSAobWFwc1swXSAmJiBnZXRPd25lcnNoaXBDaGFpbihxLCBnZXRUb3BMZXZlbChxKVswXSkubGVuZ3RoID4gMSkgP1xuICAgICAgICAgICAgcS5jb3B5KHsgbWFwOiBtYXBzWzBdIH0pXG4gICAgICAgICAgICA6IGVtcHR5Q2xhdXNlXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLnRvU3RyaW5nKCkpXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgcGFyZW50TWFwOiBNYXAgPSB7fSk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCBvYyA9IGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsYXVzZT0nLCBjbGF1c2UudG9TdHJpbmcoKSwgJ29jPScsIG9jLCAnbmFtZT0nLCB0aGlzLm5hbWUpXG5cbiAgICAgICAgaWYgKG9jLmxlbmd0aCA9PT0gMSkgeyAvL0JBU0VDQVNFOiBjaGVjayB5b3Vyc2VsZlxuICAgICAgICAgICAgLy9UT0RPOiBhbHNvIGhhbmRsZSBub24tb3duZXJzaGlwIG5vbi1pbnRyYW5zaXRpdmUgcmVsYXRpb25zIVxuICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgbm9uIEJhc2ljQ2xhdXNlcyEhISEgKHRoYXQgZG9uJ3QgaGF2ZSBPTkUgcHJlZGljYXRlISlcbiAgICAgICAgICAgIC8vIGlmIChjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZSAmJiAodGhpcy5pcyhjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZSkgfHwgdGhpcy5uYW1lID09PSBjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZT8ucm9vdCkpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0ID09PSBjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZT8ucmVmZXJlbnQ/LnVud3JhcCgpKSB7IC8vdGhpcy5uYW1lID09PSBjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZT8ucm9vdCAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gW3sgLi4ucGFyZW50TWFwLCBbY2xhdXNlLmVudGl0aWVzWzBdXTogdGhpcy5pZCB9XVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW10gLy9UT0RPXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayB5b3VyIGNoaWxkcmVuIVxuXG4gICAgICAgIGNvbnN0IHRvcCA9IGdldFRvcExldmVsKGNsYXVzZSlcblxuICAgICAgICBjb25zdCBwZWVsZWQgPSBjbGF1c2UuZmxhdExpc3QoKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguZW50aXRpZXMuZXZlcnkoZSA9PiAhdG9wLmluY2x1ZGVzKGUpKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCByZWxldmFudE5hbWVzID0gLyogb3IgY2xhdXNlPz8/ICovcGVlbGVkLmZsYXRMaXN0KCkuZmxhdE1hcCh4ID0+IFt4LnByZWRpY2F0ZT8ucm9vdCwgeC5wcmVkaWNhdGU/LnRva2VuXSkuZmlsdGVyKHggPT4geCkubWFwKHggPT4geCBhcyBzdHJpbmcpXG5cbiAgICAgICAgY29uc3QgY2hpbGRyZW46IFRoaW5nW10gPSB0aGlzLmdldEFsbEtleXMoKVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IG5hbWU6IHgsIG9iajogdGhpcy5nZXQoeCk/LnVud3JhcCgpIH0pKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJlbGV2YW50TmFtZXMuaW5jbHVkZXMoeC5uYW1lKSkgLy8gcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4Lm9iaiAhPT0gdGhpcy5vYmplY3QpXG4gICAgICAgICAgICAubWFwKHggPT4gbmV3IEJhc2VUaGluZyh7IG9iamVjdDogeC5vYmosIGlkOiBgJHt0aGlzLmlkfS4ke3gubmFtZX1gLCBwYXJlbnQ6IHRoaXMvKiAsIG5hbWU6IHgubmFtZSAqLyB9KSlcblxuXG4gICAgICAgIGNvbnN0IHJlcyA9IGNoaWxkcmVuLmZsYXRNYXAoeCA9PiB4LnF1ZXJ5KHBlZWxlZCwgeyBbdG9wWzBdXTogdGhpcy5pZCB9KSlcblxuXG4gICAgICAgIHJldHVybiByZXNcblxuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLWV2aWwgZW5kcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG59XG5cblxudHlwZSBSZWxhdGlvbiA9IHtcbiAgICBwcmVkaWNhdGU6IFRoaW5nLFxuICAgIGFyZ3M6IFRoaW5nW10sLy9pbXBsaWVkIHN1YmplY3QgPSB0aGlzIG9iamVjdFxufVxuXG5mdW5jdGlvbiByZWxhdGlvbnNFcXVhbChyMTogUmVsYXRpb24sIHIyOiBSZWxhdGlvbikge1xuICAgIHJldHVybiByMS5wcmVkaWNhdGUgPT09IHIyLnByZWRpY2F0ZVxuICAgICAgICAmJiByMS5hcmdzLmxlbmd0aCA9PT0gcjIuYXJncy5sZW5ndGhcbiAgICAgICAgJiYgcjEuYXJncy5ldmVyeSgoeCwgaSkgPT4gcjIuYXJnc1tpXSA9PT0geClcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgVGhpbmcge1xuXG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KHByZWRpY2F0ZTogVGhpbmcsIG9wdHM/OiBTZXRBcmdzKTogVGhpbmdbXVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogVGhpbmdcbiAgICB1bndyYXAoKTogYW55XG4gICAgZ2V0TGV4ZW1lcygpOiBMZXhlbWVbXVxuICAgIHRvQ2xhdXNlKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIHBhcmVudE1hcD86IE1hcCk6IE1hcFtdXG4gICAgcG9pbnRPdXQoZG9JdDogYm9vbGVhbik6IHZvaWRcbiAgICByZWFkb25seSBpZDogSWRcbiAgICByZWFkb25seSBwYXJlbnQ/OiBUaGluZyB8IENvbnRleHRcblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNldEFyZ3Mge1xuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFRoaW5nW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgaWQ/OiBJZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChhcmdzOiBXcmFwQXJncyk6IFRoaW5nIHtcbiAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhhcmdzKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyYXBBcmdzIHtcbiAgICBpZDogSWQsXG4gICAgb2JqZWN0PzogT2JqZWN0LFxuICAgIHBhcmVudD86IFRoaW5nIHwgQ29udGV4dCxcbiAgICBiYXNlPzogVGhpbmcsXG4gICAgc3VwZXJjbGFzcz86IFRoaW5nLFxuICAgIC8vIG5hbWU/OiBzdHJpbmcsXG59XG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZihvOiBvYmplY3QpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkIHtcblxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gMCA/ICdtdmVyYicgOiAnaXZlcmInXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgcmV0dXJuICdhZGplY3RpdmUnXG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJ25vdW4nXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi9wcmVsdWRlXCJcbmltcG9ydCB7IHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcbmltcG9ydCB7IG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IHRoaW5ncyB9IGZyb20gXCIuL3RoaW5nc1wiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzOiBsZXhlbWVzLmZsYXRNYXAoeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsID0gbWFrZUxleGVtZSh4KVxuICAgICAgICAgICAgcmV0dXJuIFtsLCAuLi5sLmV4dHJhcG9sYXRlKCldXG4gICAgICAgIH0pLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHRoaW5ncyxcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29udHJhY3Rpb24nLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICdpdmVyYicsXG4gICdtdmVyYicsXG4gICduZWdhdGlvbicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ2ZpbGxlcicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAvLyAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgYnV0dG9uVGhpbmcsIGNvbG9yVGhpbmcsIGRpdlRoaW5nLCByZWRUaGluZywgdGhpbmcgfSBmcm9tIFwiLi90aGluZ3NcIjtcblxuY29uc3QgYmVpbmc6IExleGVtZSA9IG1ha2VMZXhlbWUoe1xuICAgIHJvb3Q6ICdiZScsXG4gICAgdHlwZTogJ2NvcHVsYScsXG59KVxuXG5jb25zdCBkb2luZzogUGFydGlhbDxMZXhlbWU+ID0ge1xuICAgIHJvb3Q6ICdkbycsXG4gICAgdHlwZTogJ2h2ZXJiJyxcbn1cblxuY29uc3Qgbm90OiBMZXhlbWUgPSBtYWtlTGV4ZW1lKHtcbiAgICByb290OiAnbm90JyxcbiAgICB0eXBlOiAnbmVnYXRpb24nLFxufSlcblxuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogKFBhcnRpYWw8TGV4ZW1lPiB8IExleGVtZSlbXSA9IFtcblxuICAgIGJlaW5nLFxuICAgIGRvaW5nLFxuICAgIG5vdCxcblxuICAgIHsgX3Jvb3Q6IGJlaW5nLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEgfSxcbiAgICB7IF9yb290OiBiZWluZywgdG9rZW46ICdhcmUnLCBjYXJkaW5hbGl0eTogJyonIH0sIC8vVE9ETyEgMitcbiAgICB7IF9yb290OiBkb2luZywgdG9rZW46ICdkb2VzJywgY2FyZGluYWxpdHk6IDEgfSxcblxuICAgIHsgcm9vdDogJ3RoZW4nLCB0eXBlOiAnZmlsbGVyJyB9LFxuICAgIHsgcm9vdDogJy4nLCB0eXBlOiAnZnVsbHN0b3AnIH0sXG4gICAgeyByb290OiAnb3B0aW9uYWwnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcxfDAnIH0sXG4gICAgeyByb290OiAnb25lLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcrJyB9LFxuICAgIHsgcm9vdDogJ3plcm8tb3ItbW9yZScsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJyonIH0sXG4gICAgeyByb290OiAnb3InLCB0eXBlOiAnZGlzanVuYycgfSxcbiAgICB7IHJvb3Q6ICdzdWJqZWN0JywgdHlwZTogJ2FkamVjdGl2ZScgfSxcbiAgICB7IHJvb3Q6ICdwcmVkaWNhdGUnLCB0eXBlOiAnYWRqZWN0aXZlJyB9LFxuICAgIHsgcm9vdDogJ29iamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiBcImlzbid0XCIsIHR5cGU6ICdjb250cmFjdGlvbicsIGNvbnRyYWN0aW9uRm9yOiBbYmVpbmcsIG5vdF0gfSxcbiAgICB7IHJvb3Q6ICdhbmQnLCB0eXBlOiAnbm9uc3ViY29uaicgfSxcbiAgICB7IHJvb3Q6ICdsZWZ0JywgdHlwZTogJ2FkamVjdGl2ZScgfSxcbiAgICB7IHJvb3Q6ICdyaWdodCcsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAnY29uZGl0aW9uJywgdHlwZTogJ2FkamVjdGl2ZScgfSxcbiAgICB7IHJvb3Q6ICdjb25zZXF1ZW5jZScsIHR5cGU6ICdhZGplY3RpdmUnIH0sXG4gICAgeyByb290OiAnYScsIHR5cGU6ICdpbmRlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICdhbicsIHR5cGU6ICdpbmRlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICd0aGUnLCB0eXBlOiAnZGVmYXJ0JyB9LFxuICAgIHsgcm9vdDogJ2lmJywgdHlwZTogJ3N1YmNvbmonIH0sXG4gICAgeyByb290OiAnd2hlbicsIHR5cGU6ICdzdWJjb25qJyB9LFxuICAgIHsgcm9vdDogJ2FueScsIHR5cGU6ICd1bmlxdWFudCcgfSxcbiAgICB7IHJvb3Q6ICdldmVyeScsIHR5cGU6ICd1bmlxdWFudCcgfSxcbiAgICB7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicgfSxcbiAgICB7IHJvb3Q6ICd0aGF0JywgdHlwZTogJ3JlbHByb24nIH0sXG4gICAgeyByb290OiAnaXQnLCB0eXBlOiAncHJvbm91bicgfSxcbiAgICB7IHJvb3Q6ICd0aGluZycsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IHRoaW5nIH0sXG4gICAgeyByb290OiAnYnV0dG9uJywgdHlwZTogJ25vdW4nLCByZWZlcmVudDogYnV0dG9uVGhpbmcgfSxcbiAgICB7IHJvb3Q6ICdkaXYnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50OiBkaXZUaGluZyB9LFxuICAgIHsgcm9vdDogJ2NvbG9yJywgdHlwZTogJ25vdW4nLCByZWZlcmVudDogY29sb3JUaGluZyB9LFxuICAgIHsgcm9vdDogJ3JlZCcsIHR5cGU6ICdub3VuJywgcmVmZXJlbnQ6IHJlZFRoaW5nIH0sXG5cbl1cblxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZ1tdID0gW1xuXG4gICAgICAvLyBncmFtbWFyXG4gICAgICAncXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50JyxcbiAgICAgICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG9iamVjdCBub3VuLXBocmFzZScsXG5cbiAgICAgIGBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlYCxcblxuICAgICAgYG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgYWRqZWN0aXZlcyBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3IgZ3JhbW1hclxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHMgYCxcblxuICAgICAgJ2NvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlJyxcbiAgICAgICdtdmVyYnN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gbXZlcmIgdGhlbiBvYmplY3Qgbm91bi1waHJhc2UuJyxcbiAgICAgICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlIG9yIG12ZXJic3ViY2xhdXNlJyxcblxuICAgICAgYGFuZC1zZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lLW9yLW1vcmUgcmlnaHQgYW5kLXNlbnRlbmNlIG9yIGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZWAsXG5cbiAgICAgIGBtdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBtdmVyYlxuXHRcdHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgICBgaXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gaXZlcmJgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgICAgIGBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIGl2ZXJiLXNlbnRlbmNlIG9yIG12ZXJiLXNlbnRlbmNlYCxcblxuICAgICAgYGNzMiBpcyBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VcbiAgICAgIHRoZW4gc3ViY29ualxuICAgICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlYCxcblxuICAgICAgYGNzMSBpcyBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICB0aGVuIGZpbGxlciBcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgICAgIC8vIGRvbWFpblxuICAgICAgLy8gJ2NvbG9yIGlzIGEgdGhpbmcnLFxuICAgICAgLy8gJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFuZCBwdXJwbGUgYXJlIGNvbG9ycycsXG5cbiAgICAgIC8vICdjb2xvciBvZiBhIGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgICAgIC8vICdjb2xvciBvZiBhIGRpdiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgICAgIC8vICd0ZXh0IG9mIGEgYnV0dG9uIGlzIHRleHRDb250ZW50IG9mIGl0Jyxcbl0iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gY29uc3RpdHVlbnRUeXBlcy5jb25jYXQoKVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWydmaWxsZXInXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZTogWydncmFtbWFyJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnZGlzanVuYyddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG59IiwiaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmcvQmFzZVRoaW5nXCJcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZy9UaGluZ1wiXG5cbmV4cG9ydCBjb25zdCB0aGluZyA9IHdyYXAoeyBpZDogJ3RoaW5nJywgb2JqZWN0OiB7fSAvKiBCYXNlVGhpbmcgKi8gfSlcbmV4cG9ydCBjb25zdCBidXR0b25UaGluZyA9IHdyYXAoeyBpZDogJ2J1dHRvbicsIG9iamVjdDogSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlIH0pXG5leHBvcnQgY29uc3QgZGl2VGhpbmcgPSB3cmFwKHsgaWQ6ICdkaXYnLCBvYmplY3Q6IEhUTUxEaXZFbGVtZW50LnByb3RvdHlwZSB9KVxuZXhwb3J0IGNvbnN0IGNvbG9yVGhpbmcgPSB3cmFwKHsgaWQ6ICdjb2xvcicsIG9iamVjdDoge30gfSlcbmV4cG9ydCBjb25zdCByZWRUaGluZyA9IHdyYXAoeyBpZDogJ3JlZCcsIG9iamVjdDogJ3JlZCcgfSlcbnJlZFRoaW5nLnNldChjb2xvclRoaW5nKVxuXG5cbmV4cG9ydCBjb25zdCB0aGluZ3MgPSBbIC8vZmluZCBhIGJldHRlciBzb2x1dGlvbiB0byBhdm9pZCBjYXB0dXJpbmcgYmFzZS1idXR0b25zIGluIHF1ZXJ5IHJlc3VsdHNcbiAgICB0aGluZyxcbiAgICAvLyBidXR0b25UaGluZyxcbiAgICAvLyBkaXZUaGluZyxcbiAgICBjb2xvclRoaW5nLFxuICAgIHJlZFRoaW5nLFxuXVxuIiwiaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uLy4uL21pZGRsZS9ldmFsQXN0XCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICkge1xuICAgICAgICB0aGlzLmNvbnRleHQucHJlbHVkZS5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2V0U3ludGF4KGFzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzID0gZXZhbEFzdCh0aGlzLmNvbnRleHQsIGFzdClcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC52YWx1ZXMuZm9yRWFjaCh4ID0+IHgucG9pbnRPdXQoZmFsc2UpKVxuICAgICAgICAgICAgcmVzLmZvckVhY2goeCA9PiB4LnBvaW50T3V0KHRydWUpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc1xuXG4gICAgICAgIH0pLmZsYXQoKVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHg/LnVud3JhcD8uKCkgPz8geClcbiAgICB9XG5cbn0iLCJpbXBvcnQgVGhpbmcgZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmcvVGhpbmdcIlxuaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXVxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIlxuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNDb250ZXh0IGltcGxlbWVudHMgQ29udGV4dCB7XG5cbiAgICByZWFkb25seSBjb25maWcgPSBnZXRDb25maWcoKVxuICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IHRoaXMuY29uZmlnLnN5bnRheGVzXG4gICAgcHJvdGVjdGVkIF9zeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW10gPSB0aGlzLmdldFN5bnRheExpc3QoKVxuICAgIHByb3RlY3RlZCBfbGV4ZW1lcyA9IHRoaXMuY29uZmlnLmxleGVtZXNcbiAgICByZWFkb25seSBwcmVsdWRlID0gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICByZWFkb25seSBzZXQgPSB0aGlzLmVudmlyby5zZXRcbiAgICByZWFkb25seSBxdWVyeSA9IHRoaXMuZW52aXJvLnF1ZXJ5XG4gICAgcmVhZG9ubHkgcm9vdCA9IHRoaXMuZW52aXJvLnJvb3RcbiAgICByZWFkb25seSBnZXQgPSB0aGlzLmVudmlyby5nZXRcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVudmlybzogRW52aXJvKSB7XG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNvbmZpZy50aGluZ3MuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHQpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm8udmFsdWVzXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lID0gKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWUgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgICAgICAgICAuYXQoMClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pKVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICAgICAgdGhpcy5fc3ludGF4TGlzdCA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBpZiAobGV4ZW1lLnJvb3QgJiYgIWxleGVtZS50b2tlbiAmJiB0aGlzLl9sZXhlbWVzLnNvbWUoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KSkge1xuICAgICAgICAgICAgdGhpcy5fbGV4ZW1lcyA9IHRoaXMuX2xleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaChsZXhlbWUpXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaCguLi5sZXhlbWUuZXh0cmFwb2xhdGUodGhpcykpXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxufVxuIiwiaW1wb3J0IGdldEVudmlybywgeyBFbnZpcm8sIEdldEVudmlyb09wcyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCBCYXNpY0NvbnRleHQgZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCBleHRlbmRzIEVudmlybyB7XG5cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG4gICAgZ2V0TGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWUgfCB1bmRlZmluZWRcblxuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgcHJlbHVkZTogc3RyaW5nW11cbiAgICByZWFkb25seSBzeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW11cbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dE9wdHMgZXh0ZW5kcyBHZXRFbnZpcm9PcHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0KG9wdHM6IEdldENvbnRleHRPcHRzKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NvbnRleHQoZ2V0RW52aXJvKG9wdHMpKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgY29uanVnYXRlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBwbHVyYWxpemUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcGx1cmFsaXplXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VMZXhlbWUgaW1wbGVtZW50cyBMZXhlbWUge1xuXG4gICAgX3Jvb3QgPSB0aGlzLm5ld0RhdGE/Ll9yb290XG4gICAgcmVhZG9ubHkgcm9vdCA9IHRoaXMubmV3RGF0YT8ucm9vdCA/PyB0aGlzLl9yb290Py5yb290IVxuICAgIHJlYWRvbmx5IHR5cGUgPSB0aGlzLm5ld0RhdGE/LnR5cGUgPz8gdGhpcy5fcm9vdD8udHlwZSFcbiAgICBjb250cmFjdGlvbkZvciA9IHRoaXMubmV3RGF0YT8uY29udHJhY3Rpb25Gb3IgPz8gdGhpcy5fcm9vdD8uY29udHJhY3Rpb25Gb3JcbiAgICB0b2tlbiA9IHRoaXMubmV3RGF0YT8udG9rZW4gPz8gdGhpcy5fcm9vdD8udG9rZW5cbiAgICBjYXJkaW5hbGl0eSA9IHRoaXMubmV3RGF0YT8uY2FyZGluYWxpdHkgPz8gdGhpcy5fcm9vdD8uY2FyZGluYWxpdHlcbiAgICByZWFkb25seSBpc1ZlcmIgPSB0aGlzLnR5cGUgPT09ICdtdmVyYicgfHwgdGhpcy50eXBlID09PSAnaXZlcmInXG4gICAgcmVhZG9ubHkgaXNQbHVyYWwgPSBpc1JlcGVhdGFibGUodGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSlcbiAgICByZWFkb25seSByZWZlcmVudCA9IHRoaXMubmV3RGF0YT8ucmVmZXJlbnQgPz8gdGhpcy5fcm9vdD8ucmVmZXJlbnRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBuZXdEYXRhPzogUGFydGlhbDxMZXhlbWU+XG4gICAgKSB7IH1cblxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ/OiBDb250ZXh0KTogTGV4ZW1lW10ge1xuXG4gICAgICAgIGlmICgodGhpcy50eXBlID09PSAnbm91bicgfHwgdGhpcy50eXBlID09PSAnZ3JhbW1hcicpICYmICF0aGlzLmlzUGx1cmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW21ha2VMZXhlbWUoeyBfcm9vdDogdGhpcywgdG9rZW46IHBsdXJhbGl6ZSh0aGlzLnJvb3QpLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudDogdGhpcy5yZWZlcmVudCB9KV1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVmVyYikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZSh0aGlzLnJvb3QpLm1hcCh4ID0+IG1ha2VMZXhlbWUoeyBfcm9vdDogdGhpcywgdG9rZW46IHgsIHJlZmVyZW50OiB0aGlzLnJlZmVyZW50IH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG59IiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgZHluYW1pY0xleGVtZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXIgPSAwXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICBzb3VyY2VDb2RlXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSB3b3Jkcy5mbGF0TWFwKHcgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGV4ID0gY29udGV4dC5nZXRMZXhlbWUodykgPz8gZHluYW1pY0xleGVtZSh3LCBjb250ZXh0LCB3b3JkcylcbiAgICAgICAgICAgIHJldHVybiBsZXguY29udHJhY3Rpb25Gb3IgPz8gW2xleF1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHkgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNlTGV4ZW1lIGZyb20gXCIuL0Jhc2VMZXhlbWVcIlxuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5nL1RoaW5nXCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyAgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovICB0eXBlOiBMZXhlbWVUeXBlXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi8gdG9rZW4/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovICBjb250cmFjdGlvbkZvcj86IExleGVtZVtdXG4gICAgLyoqZm9yIHF1YW50YWRqICovIGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICBfcm9vdD86IFBhcnRpYWw8TGV4ZW1lPlxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ/OiBDb250ZXh0KTogTGV4ZW1lW11cbiAgICByZWFkb25seSBpc1BsdXJhbDogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzVmVyYjogYm9vbGVhblxuXG4gICAgcmVmZXJlbnQ/OiBUaGluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxleGVtZShkYXRhOiBQYXJ0aWFsPExleGVtZT4gfCBMZXhlbWUpOiBMZXhlbWUge1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBCYXNlTGV4ZW1lKSB7XG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBCYXNlTGV4ZW1lKGRhdGEpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljTGV4ZW1lKHdvcmQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCwgd29yZHM6IHN0cmluZ1tdKTogTGV4ZW1lIHtcblxuXG4gICAgY29uc3QgcmVsZXZhbnQgPVxuICAgICAgICAvLyB3b3Jkc1xuICAgICAgICAvLyAgICAgLm1hcCh3ID0+IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiB3LCB0eXBlOiAnbm91bicgfSksICdYJykpXG4gICAgICAgIC8vICAgICAuZmxhdE1hcChjID0+IGNvbnRleHQucXVlcnkoYykpXG4gICAgICAgIC8vICAgICAuZmxhdE1hcChtID0+IE9iamVjdC52YWx1ZXMobSkpXG4gICAgICAgIC8vICAgICAuZmxhdE1hcChpZCA9PiBjb250ZXh0LmdldChpZCkgPz8gW10pXG4gICAgICAgIGNvbnRleHQudmFsdWVzXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IHguZ2V0TGV4ZW1lcygpKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudG9rZW4gPT09IHdvcmQgfHwgeC5yb290ID09PSB3b3JkKVxuXG4gICAgLy8gY29uc29sZS5sb2coJ2R5bmFtaWNMZXhlbWVzIScsIHdvcmQsICdyZWxldmFudD0nLCByZWxldmFudClcblxuICAgIGNvbnN0IGlzTWFjcm9Db250ZXh0ID1cbiAgICAgICAgd29yZHMuc29tZSh4ID0+IGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlID09PSAnZ3JhbW1hcicpXG4gICAgICAgICYmICF3b3Jkcy5zb21lKHggPT4gWydkZWZhcnQnLCAnaW5kZWZhcnQnLCAnbm9uc3ViY29uaiddLmluY2x1ZGVzKGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlIGFzIGFueSkpLy9UT0RPOiB3aHkgZGVwZW5kZW5jaWVzKCdtYWNybycpIGRvZXNuJ3Qgd29yaz8hXG5cbiAgICBjb25zdCB0eXBlID0gcmVsZXZhbnRbMF0/LnR5cGUgPz9cbiAgICAgICAgKGlzTWFjcm9Db250ZXh0ID9cbiAgICAgICAgICAgICdncmFtbWFyJ1xuICAgICAgICAgICAgOiAnbm91bicpXG5cbiAgICAvLyBjb25zb2xlLmxvZygnZHluYW1pY0xleGVtZScsIHJlbGV2YW50LmF0KDApPy5yZWZlcmVudClcblxuICAgIHJldHVybiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgdG9rZW46IHdvcmQsXG4gICAgICAgIHJvb3Q6IHJlbGV2YW50Py5hdCgwKT8ucm9vdCA/PyB3b3JkLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICByZWZlcmVudDogcmVsZXZhbnQuYXQoMCk/LnJlZmVyZW50LFxuICAgIH0pXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoYXN0OiBBc3ROb2RlKTogQXN0Tm9kZSB7XG5cbiAgICAgICAgaWYgKCFhc3QubGlua3MpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGUpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4uLy4uL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGVVbndyYXBwZWQodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICAgICAgICAgIG1haW4oKVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcykpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNsYXVzZTEuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllc1xuICAgIH1cblxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lcnNPZihpZCkpXG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2UgeyAvLyBjYW4ndCBiZSBwcm9wLCBiZWNhdXNlIHdvdWxkIGJlIGNhbGxlZCBpbiBBbmQncyBjb25zLCBCYXNpY0NsdXNlLmFuZCgpIGNhbGxzIEFuZCdzIGNvbnMsIFxcaW5mIHJlY3Vyc2lvbiBlbnN1ZXNcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiB0aGlzLmNsYXVzZTEucmhlbWUuYW5kKHRoaXMuY2xhdXNlMi5yaGVtZSlcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy5jbGF1c2UxLmFuZCh0aGlzLmNsYXVzZTIpXG4gICAgICAgIGNvbnN0IGl0ID0gb3B0cz8uaXQgPz8gc29ydElkcyh1bml2ZXJzZS5lbnRpdGllcykuYXQoLTEpISAvL1RPRE8hXG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2VMaXN0ID0gdW5pdmVyc2UuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBxdWVyeUxpc3QgPSBxdWVyeS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBzb2x2ZU1hcHMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICAgICAgY29uc3QgcHJvbk1hcDogTWFwID0gcXVlcnlMaXN0LmZpbHRlcihjID0+IGMucHJlZGljYXRlPy50eXBlID09PSAncHJvbm91bicpLm1hcChjID0+ICh7IFtjLmFyZ3M/LmF0KDApIV06IGl0IH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICBjb25zdCByZXMgPSBtYXBzLmNvbmNhdChwcm9uTWFwKS5maWx0ZXIobSA9PiBPYmplY3Qua2V5cyhtKS5sZW5ndGgpIC8vIGVtcHR5IG1hcHMgY2F1c2UgcHJvYmxlbXMgYWxsIGFyb3VuZCB0aGUgY29kZSFcblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpIHtcblxuICAgICAgICBjb25zdCBjMSA9IHRoaXMuY2xhdXNlMS5zaW1wbGVcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLmNsYXVzZTIuc2ltcGxlXG5cbiAgICAgICAgaWYgKGMyLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMxXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYzEuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzJcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoeyBjbGF1c2UxOiBjMSwgY2xhdXNlMjogYzIgfSlcblxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuXG5leHBvcnQgY2xhc3MgQXRvbUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmFyZ3MpXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KHsgcHJlZGljYXRlOiB0aGlzLnByZWRpY2F0ZS5yb290LCBhcmdzOiB0aGlzLmFyZ3MsIG5lZ2F0ZWQ6IHRoaXMubmVnYXRlZCB9KSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBBdG9tQ2xhdXNlKFxuICAgICAgICB0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcD8uW2FdID8/IGEpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgIClcblxuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW3RoaXNdXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEF0b21DbGF1c2UgfSBmcm9tIFwiLi9BdG9tQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEFuIHVuYW1iaWd1b3VzIHByZWRpY2F0ZS1sb2dpYy1saWtlIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvblxuICogb2YgdGhlIHByb2dyYW1tZXIncyBpbnRlbnQuXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBzaW1wbGU6IENsYXVzZVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHM/OiBib29sZWFuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEF0b21DbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gZmFsc2VcblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlID0+IHRoaXNcbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gb3RoZXJcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBjb25jbHVzaW9uXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBzdWJqY29uaj86IExleGVtZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgSW1wbHkoXG4gICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIG9wdHM/LnN1Ympjb25qID8/IHRoaXMuc3ViamNvbmosXG4gICAgKVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZXJzT2YoaWQpKVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7Ly8gVE9ET1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLmVudGl0aWVzKSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGludGVyc2VjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9pbnRlcnNlY3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpYWxJZHMgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuLyoqXG4gKiBGaW5kcyBwb3NzaWJsZSBNYXAtaW5ncyBmcm9tIHF1ZXJ5TGlzdCB0byB1bml2ZXJzZUxpc3RcbiAqIHtAbGluayBcImZpbGU6Ly8uLy4uLy4uLy4uLy4uLy4uL2RvY3Mvbm90ZXMvdW5pZmljYXRpb24tYWxnby5tZFwifVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29sdmVNYXBzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMSwgaSkgPT4ge1xuICAgICAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMiwgaikgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWwxLmxlbmd0aCAmJiBtbDIubGVuZ3RoICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZShtbDEsIG1sMilcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2ldID0gW11cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2pdID0gbWVyZ2VkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXMuZmxhdCgpLmZpbHRlcih4ID0+ICFpc0ltcG9zaWJsZSh4KSlcbn1cblxuZnVuY3Rpb24gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdW10ge1xuICAgIHJldHVybiBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB1bml2ZXJzZUxpc3QuZmxhdE1hcCh1ID0+IHUucXVlcnkocSkpXG4gICAgICAgIHJldHVybiByZXMubGVuZ3RoID8gcmVzIDogW21ha2VJbXBvc3NpYmxlKHEpXVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1sMTogTWFwW10sIG1sMjogTWFwW10pIHtcblxuICAgIGNvbnN0IG1lcmdlZDogTWFwW10gPSBbXVxuXG4gICAgbWwxLmZvckVhY2gobTEgPT4ge1xuICAgICAgICBtbDIuZm9yRWFjaChtMiA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtYXBzQWdyZWUobTEsIG0yKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4ubTEsIC4uLm0yIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXEobWVyZ2VkKVxufVxuXG5mdW5jdGlvbiBtYXBzQWdyZWUobTE6IE1hcCwgbTI6IE1hcCkge1xuICAgIGNvbnN0IGNvbW1vbktleXMgPSBpbnRlcnNlY3Rpb24oT2JqZWN0LmtleXMobTEpLCBPYmplY3Qua2V5cyhtMikpXG4gICAgcmV0dXJuIGNvbW1vbktleXMuZXZlcnkoayA9PiBtMVtrXSA9PT0gbTJba10pXG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvc3NpYmxlKHE6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIHEuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IFt4XTogU3BlY2lhbElkcy5JTVBPU1NJQkxFIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbn1cblxuZnVuY3Rpb24gaXNJbXBvc2libGUobWFwOiBNYXApIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtYXApLmluY2x1ZGVzKFNwZWNpYWxJZHMuSU1QT1NTSUJMRSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgVGhpbmcsIHsgd3JhcCB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5nL1RoaW5nXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi9pZC9NYXBcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxBc3QoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKGFzdD8ubGlua3M/LmNvcHVsYSkge1xuICAgICAgICByZXR1cm4gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/Lml2ZXJiPy5sZXhlbWUgfHwgYXN0Py5saW5rcz8ubXZlcmI/LmxleGVtZSkge1xuICAgICAgICByZXR1cm4gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/Lm5vbnN1YmNvbmopIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb21wb3VuZFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZhbE5vdW5QaHJhc2UoY29udGV4dCwgYXN0LCBhcmdzKSAgLy9ub3VucGhyYXNlIGlzIHRoZSBcImF0b21cIlxuICAgIH1cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3Q/LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogdHJ1ZSB9KVxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSB9KS8vLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSlcblxuICAgIHN1YmplY3QuZm9yRWFjaChzID0+IHtcbiAgICAgICAgcHJlZGljYXRlLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIHMuc2V0KGMucHJlZGljYXRlPy5yZWZlcmVudCEsIHsgbmVnYXRlZDogISFhc3Q/LmxpbmtzPy5uZWdhdGlvbiB9KVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICBzdWJqZWN0LmZvckVhY2gocyA9PiBjb250ZXh0LnNldChzKSlcblxuICAgIHJldHVybiBbXS8vVE9ET1xufVxuXG5mdW5jdGlvbiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyAnVE9ETyEnXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93ICdUT0RPISdcbn1cblxuZnVuY3Rpb24gZXZhbENvbXBvdW5kU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuICAgIHRocm93ICdUT0RPISdcbn1cblxuZnVuY3Rpb24gZXZhbE5vdW5QaHJhc2UoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuXG4gICAgLy8gY2hlY2tzIGZvciBUaGluZ3MgdGhhdCBtYXRjaCBnaXZlbiBub3VucGhyYXNlXG4gICAgLy8gMS4gaW4gY3VycmVudCBzZW50ZW5jZSBzY29wZVxuICAgIC8vIDIuIGluIGJyb2FkZXIgY29udGV4dFxuICAgIGNvbnN0IGN1cnJlbnRTY29wZSA9ICgoY29udGV4dCBhcyBhbnkpLmN1cnJlbnRTY29wZSBhcyBDbGF1c2UpID8/IGVtcHR5Q2xhdXNlXG4gICAgY29uc3QgbWFwcyA9IGN1cnJlbnRTY29wZS5xdWVyeShucCkuY29uY2F0KGNvbnRleHQucXVlcnkobnApKTsgICAgICAgICAgICAgICAgICAvLyBjb25zdCBucDIgPSBucC5jb3B5KHttYXAgOiBtYXBzWzBdID8/IHt9fSk7XG5cbiAgICBjb25zdCBpbnRlcmVzdGluZ0lkcyA9IGdldEludGVyZXN0aW5nSWRzKG1hcHMpO1xuXG4gICAgLy8gVE1QIChvbmx5KSB1c2UgY29udGV4dCB0byBwYXNzIGFyb3VuZCBkYXRhIGFib3V0IFwiY3VycnJlbnQgc2VudGVuY2VcIiwgeXVjayEgUE9TU0lCTEUgQlVHUyFcbiAgICAoY29udGV4dCBhcyBhbnkpLmN1cnJlbnRTY29wZSA9IG5wXG5cbiAgICBjb25zdCB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4IGFzIFRoaW5nKTtcblxuICAgIGlmIChpc1BsdXJhbChhc3QpKSB7IC8vIGlmIHVuaXZlcnNhbCBxdWFudGlmaWVkLCBJIGRvbid0IGNhcmUgaWYgdGhlcmUncyBubyBtYXRjaFxuICAgICAgICByZXR1cm4gdGhpbmdzXG4gICAgfVxuXG4gICAgaWYgKHRoaW5ncy5sZW5ndGgpIHsgLy8gbm9uLXBsdXJhbCwgcmV0dXJuIHNpbmdsZSBleGlzdGluZyBUaGluZ1xuICAgICAgICByZXR1cm4gdGhpbmdzLnNsaWNlKDAsIDEpXG4gICAgfVxuXG4gICAgLy8gb3IgZWxzZSBjcmVhdGUgYW5kIHJldHVybnMgdGhlIFRoaW5nXG4gICAgcmV0dXJuIGFyZ3M/LmF1dG92aXZpZmljYXRpb24gPyBbY3JlYXRlVGhpbmcoY29udGV4dCwgbnApXSA6IFtdXG5cbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBhZGplY3RpdmVzID0gKGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBub3VucyA9IChhc3Q/LmxpbmtzPy5zdWJqZWN0Py5saXN0ID8/IFtdKS5tYXAoeCA9PiB4LmxleGVtZSEpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHN1YmplY3RJZCkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhc3Q/LmxpbmtzID8/IHt9KS5maWx0ZXIoeCA9PiB4Lmxpc3QpLmZsYXRNYXAoeCA9PiB4Lmxpc3QhKS5maWx0ZXIoeCA9PiB4LmxpbmtzPy5wcmVwb3NpdGlvbikubWFwKHggPT4gY29tcGxlbWVudFRvQ2xhdXNlKHgsIHsgc3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSB9KSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICByZXR1cm4gYWRqZWN0aXZlcy5hbmQobm91bnMpLmFuZChjb21wbGVtZW50cylcbiAgICAvL1RPRE86IHN1YmNsYXVzZVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb2JqZWN0SWQgPSBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGFzdD8ubGlua3M/LnByZXBvc2l0aW9uPy5sZXhlbWUhXG4gICAgY29uc3Qgb2JqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdD8ubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UgfSlcblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViamVjdElkLCBvYmplY3RJZCkuYW5kKG9iamVjdClcblxufVxuXG5mdW5jdGlvbiByZWxhdGl2ZUNsYXVzZVRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuICAgIHJldHVybiBlbXB0eUNsYXVzZSAvL1RPRE8hXG59XG5cbmZ1bmN0aW9uIGlzUGx1cmFsKGFzdD86IEFzdE5vZGUpIHtcblxuICAgIHJldHVybiBhc3Q/LmxpbmtzPy5ub3VuPy5sZXhlbWU/LmlzUGx1cmFsXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGV4ZW1lPy5pc1BsdXJhbFxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5ub3VuPy5saXN0Py5zb21lKHggPT4geC5sZXhlbWU/LmlzUGx1cmFsKVxuICAgICAgICB8fCBhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZT8uaXNQbHVyYWwpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnN1YmplY3Q/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZT8uaXNQbHVyYWwpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LnVuaXF1YW50XG5cbn1cblxuZnVuY3Rpb24gZ2V0SW50ZXJlc3RpbmdJZHMobWFwczogTWFwW10pOiBJZFtdIHtcblxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlIFwiY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uXCIgXG4gICAgLy8gaGFzIGJ1dHRvbklkLnN0eWxlLmNvbG9yIGFuZCB0aGF0J3MgdGhlIG9iamVjdCB0aGUgc2VudGVuY2Ugc2hvdWxkIHJlc29sdmUgdG9cbiAgICAvLyBwb3NzaWJsZSBwcm9ibGVtIGlmIFwiY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b25cIlxuICAgIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxufVxuXG5jb25zdCBnZXROdW1iZXJPZkRvdHMgPSAoaWQ6IElkKSA9PiBpZC5zcGxpdCgnLicpLmxlbmd0aCAvLy0xXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNvbnRleHQ6IENvbnRleHQsIGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuXG4gICAgY29uc3QgdGhpbmcgPSB3cmFwKHsgaWQ6IGdldEluY3JlbWVudGFsSWQoKSwgcGFyZW50OiBjb250ZXh0IH0pIC8vVE9ETzogZG9uJ3QgYWRkIHRvIGNvbnRleHQ/IGltcGxpY2l0bHkgYWRkZWQgYnkgdGhpbmcuc2V0KCkgaW5oZXJpdFxuXG4gICAgY2xhdXNlLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcblxuICAgICAgICBjb25zdCBsZXhlbWUgPSBjLnByZWRpY2F0ZSFcblxuICAgICAgICBpZiAoIWxleGVtZS5yZWZlcmVudCkge1xuICAgICAgICAgICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicpIGxleGVtZS5yZWZlcmVudCA9IHRoaW5nXG4gICAgICAgICAgICBjb250ZXh0LnNldExleGVtZShsZXhlbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGluZy5zZXQobGV4ZW1lLnJlZmVyZW50LCB7IG5lZ2F0ZWQ6IGNsYXVzZS5uZWdhdGVkIH0pXG4gICAgICAgIH1cblxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpbmdcbn1cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkLFxuICAgIGF1dG92aXZpZmljYXRpb246IGJvb2xlYW4sXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxLZXlzKG9iamVjdDogb2JqZWN0LCBpdGVyID0gNSkge1xuXG4gICAgbGV0IG9iaiA9IG9iamVjdFxuICAgIGxldCByZXM6IHN0cmluZ1tdID0gW11cblxuICAgIHdoaWxlIChvYmogJiYgaXRlcikge1xuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3Qua2V5cyhvYmopXVxuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopXVxuICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKVxuICAgICAgICBpdGVyLS1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IHsgbmV3SW5zdGFuY2UgfSBmcm9tIFwiLi9uZXdJbnN0YW5jZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ29weShvYmplY3Q6IG9iamVjdCkge1xuXG4gICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIC8vIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgcmV0dXJuIHsgX19wcm90b19fOiBvYmplY3QgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWQgPSBvYmplY3QuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIHJldHVybiB3cmFwcGVkXG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBuZXdJbnN0YW5jZShvYmplY3QpXG4gICAgfVxuXG4gICAgLy8gaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgLy8gICAgIGNvbnN0IHdyYXBwZWQgPSBvYmplY3QuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50XG4gICAgLy8gICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gb2JqZWN0LmlubmVySFRNTFxuICAgIC8vICAgICByZXR1cm4gd3JhcHBlZFxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAgIC8vIHJldHVybiB7IC4uLm9iamVjdCB9XG4gICAgLy8gICAgIHJldHVybiB7IF9fcHJvdG9fXzogb2JqZWN0IH1cbiAgICAvLyB9XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjXG4gICAgICAgIHJldHVybiBoMSAmIGgxIC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pXG59XG4iLCJpbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4vdW5pcVwiXG5cbi8qKlxuICogSW50ZXJzZWN0aW9uIGJldHdlZW4gdHdvIGxpc3RzIG9mIHN0cmluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3Rpb24oeHM6IHN0cmluZ1tdLCB5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gdW5pcSh4cy5maWx0ZXIoeCA9PiB5cy5pbmNsdWRlcyh4KSlcbiAgICAgICAgLmNvbmNhdCh5cy5maWx0ZXIoeSA9PiB4cy5pbmNsdWRlcyh5KSkpKVxufVxuIiwiaW1wb3J0IHsgdGFnTmFtZUZyb21Qcm90byB9IGZyb20gXCIuL3RhZ05hbWVGcm9tUHJvdG9cIlxuXG4vKipcbiAqIFxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGFuIG9iamVjdCAoZXZlbiBIVE1MRWxlbWVudCkgZnJvbSBhIHByb3RvdHlwZS5cbiAqIEluIGNhc2UgaXQncyBhIG51bWJlciwgbm8gbmV3IGluc3RhbmNlIGlzIG1hZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdJbnN0YW5jZShwcm90bzogb2JqZWN0LCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgaWYgKHByb3RvID09PSBOdW1iZXIucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFyZ3NbMF0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKSA6XG4gICAgICAgIG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvciguLi5hcmdzKVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIlxuLyoqXG4gKiBUcnkgZ2V0dGluZyB0aGUgbmFtZSBvZiBhbiBodG1sIGVsZW1lbnQgZnJvbSBhIHByb3RvdHlwZVxuICovXG5leHBvcnQgY29uc3QgdGFnTmFtZUZyb21Qcm90byA9ICh4OiBvYmplY3QpID0+IHguY29uc3RydWN0b3IubmFtZVxuICAgIC5yZXBsYWNlKCdIVE1MJywgJycpXG4gICAgLnJlcGxhY2UoJ0VsZW1lbnQnLCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGxldCBzZWVuID0ge30gYXMgYW55XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCJpbXBvcnQgeyB0ZXN0MSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxXCJcbmltcG9ydCB7IHRlc3QxMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxMFwiXG5pbXBvcnQgeyB0ZXN0MTEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTFcIlxuaW1wb3J0IHsgdGVzdDEyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEyXCJcbmltcG9ydCB7IHRlc3QxMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxM1wiXG5pbXBvcnQgeyB0ZXN0MTQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTRcIlxuaW1wb3J0IHsgdGVzdDE1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE1XCJcbmltcG9ydCB7IHRlc3QxNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxNlwiXG5pbXBvcnQgeyB0ZXN0MTcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTdcIlxuaW1wb3J0IHsgdGVzdDE4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE4XCJcbmltcG9ydCB7IHRlc3QxOSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxOVwiXG5pbXBvcnQgeyB0ZXN0MiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyXCJcbmltcG9ydCB7IHRlc3QyMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyMFwiXG5pbXBvcnQgeyB0ZXN0MjEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjFcIlxuaW1wb3J0IHsgdGVzdDIyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIyXCJcbmltcG9ydCB7IHRlc3QyMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyM1wiXG5pbXBvcnQgeyB0ZXN0MjQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjRcIlxuaW1wb3J0IHsgdGVzdDI1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI1XCJcbmltcG9ydCB7IHRlc3QyNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyNlwiXG5pbXBvcnQgeyB0ZXN0MjcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjdcIlxuaW1wb3J0IHsgdGVzdDI4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI4XCJcbmltcG9ydCB7IHRlc3QyOSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyOVwiXG5pbXBvcnQgeyB0ZXN0MyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzXCJcbmltcG9ydCB7IHRlc3QzMCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzMFwiXG5pbXBvcnQgeyB0ZXN0MzEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzFcIlxuaW1wb3J0IHsgdGVzdDMyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMyXCJcbmltcG9ydCB7IHRlc3QzMyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzM1wiXG5pbXBvcnQgeyB0ZXN0MzQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzRcIlxuaW1wb3J0IHsgdGVzdDM1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM1XCJcbmltcG9ydCB7IHRlc3QzNiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzNlwiXG5pbXBvcnQgeyB0ZXN0MzcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzdcIlxuaW1wb3J0IHsgdGVzdDM4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM4XCJcbmltcG9ydCB7IHRlc3Q0IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDRcIlxuaW1wb3J0IHsgdGVzdDUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0NVwiXG5pbXBvcnQgeyB0ZXN0NiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q2XCJcbmltcG9ydCB7IHRlc3Q3IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDdcIlxuaW1wb3J0IHsgdGVzdDggfSBmcm9tIFwiLi90ZXN0cy90ZXN0OFwiXG5pbXBvcnQgeyB0ZXN0OSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q5XCJcbmltcG9ydCB7IGNsZWFyRG9tIH0gZnJvbSBcIi4vdXRpbHMvY2xlYXJEb21cIlxuaW1wb3J0IHsgc2xlZXAgfSBmcm9tIFwiLi91dGlscy9zbGVlcFwiXG5cblxuY29uc3QgdGVzdHMgPSBbXG4gICAgdGVzdDEsXG4gICAgdGVzdDIsXG4gICAgdGVzdDMsXG4gICAgdGVzdDQsXG4gICAgdGVzdDUsXG4gICAgdGVzdDYsXG4gICAgdGVzdDcsXG4gICAgdGVzdDgsXG4gICAgdGVzdDksXG4gICAgdGVzdDEwLFxuICAgIHRlc3QxMSxcbiAgICB0ZXN0MTIsXG4gICAgdGVzdDEzLFxuICAgIHRlc3QxNCxcbiAgICB0ZXN0MTUsXG4gICAgdGVzdDE2LFxuICAgIHRlc3QxNyxcbiAgICB0ZXN0MTgsXG4gICAgLy8gdGVzdDE5LCAvLyB1c2VzIGlmXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG4gICAgdGVzdDI2LFxuICAgIHRlc3QyNyxcbiAgICB0ZXN0MjgsXG4gICAgdGVzdDI5LFxuICAgIC8vIHRlc3QzMCwvLyBkeW5hbWljYWxseSBkZWZpbmluZyBhIGNvcHVsYVxuICAgIHRlc3QzMSxcbiAgICAvLyB0ZXN0MzIsXG4gICAgdGVzdDMzLFxuICAgIC8vIHRlc3QzNCwvLyBkeW5hbWljYWxseSBkZWZpbmluZyBhbiBhbGlhc1xuICAgIHRlc3QzNSxcbiAgICAvLyB0ZXN0MzYsIC8vIGR5bmFtaWNhbGx5IGRlZmluaW5nIGFuIG12ZXJiXG4gICAgdGVzdDM3LFxuICAgIHRlc3QzOCxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHRlc3QoKVxuICAgICAgICBjb25zb2xlLmxvZyhgJWMke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbCd9ICR7dGVzdC5uYW1lfWAsIGBjb2xvcjoke3N1Y2Nlc3MgPyAnZ3JlZW4nIDogJ3JlZCd9YClcbiAgICAgICAgYXdhaXQgc2xlZXAoMTApLy83NVxuICAgICAgICBjbGVhckRvbSgpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2dyZWVuJztcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0Mztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFuZCB3IGFyZSBidXR0b25zJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgcmVkJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndyBhbmQgeiBhcmUgYmxhY2snKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmQ7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZDtcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDQgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDMgJiYgYXNzZXJ0NDtcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFwcGVuZENoaWxkcyB5Jyk7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLmNoaWxkcmVuKS5pbmNsdWRlcyhicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0pO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIC8vIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24gYW5kIHRoZSBidXR0b24gaXMgZ3JlZW4nKVxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIGl0IGlzIGdyZWVuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE0KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQgYW5kIHogaXMgZ3JlZW4uJyk7XG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIG5vdCByZWQuJyk7XG5cbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNSgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ogaXMgcmVkLicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IGJ1dHRvbiBpcyBub3QgYmx1ZS4nKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuXG4gICAgcmV0dXJuIGFzc2VydDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgaGlkZGVuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5oaWRkZW47XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBub3QgaGlkZGVuJyk7XG4gICAgY29uc3QgYXNzZXJ0MiA9ICFicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uaGlkZGVuO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgY29uc3QgeCA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXTtcbiAgICB4Lm9uY2xpY2sgPSAoKSA9PiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggY2xpY2tzJyk7XG4gICAgcmV0dXJuIHguc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgcmVkLiB4IGlzIGEgYnV0dG9uIGFuZCB5IGlzIGEgZGl2LicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IHJlZCBidXR0b24gaXMgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZGl2JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MjtcblxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgY29uc3QgdjEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCB2MiA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LnZhbHVlcy5sZW5ndGg7XG4gICAgcmV0dXJuIHYyIC0gdjEgPT09IDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24gaWYgeCBpcyByZWQnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBjb2xvciBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIHJlZC4geCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpO1xuICAgIGxldCBjbGlja3MgPSAnJztcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0ub25jbGljayA9ICgpID0+IGNsaWNrcyArPSAneCc7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IGJ1dHRvbiBjbGlja3MnKTtcbiAgICByZXR1cm4gY2xpY2tzID09PSAneHknO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgcmVkIGFuZCB5IGlzIGJsdWUnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbnMgYXJlIHJlZCcpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQuIHogaXMgYmx1ZS4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucyBhcmUgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibHVlJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYmxhY2sgYnV0dG9ucycpLmxlbmd0aCA9PT0gMjtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYm9yZGVyIG9mIHN0eWxlIG9mIHggaXMgZG90dGVkLXllbGxvdycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5ib3JkZXIuaW5jbHVkZXMoJ2RvdHRlZCB5ZWxsb3cnKTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgMSBhbmQgeSBpcyAyJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhZGRzIHknKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnaXQnKVswXSA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJsYWNrIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgZ3JlZW4gYW5kIHkgaXMgcmVkLicpO1xuICAgIGNvbnN0IHJlcyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2NvbG9yIG9mIHRoZSByZWQgYnV0dG9uJyk7XG4gICAgcmV0dXJuIHJlcy5pbmNsdWRlcygncmVkJykgJiYgIXJlcy5pbmNsdWRlcygnZ3JlZW4nKTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICAvLyBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGRpdiBhbmQgdGhlIHdpZHRoIG9mIHN0eWxlIG9mIHRoZSBkaXYgaXMgNTB2dycpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBkaXYuIHRoZSB3aWR0aCBvZiBzdHlsZSBvZiBpdCBpcyA1MHZ3Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBkaXYnKVswXS5zdHlsZS53aWR0aCA9PT0gJzUwdncnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnc29tZXRoaW5nIGJ1dHRvbicpLmxlbmd0aCA9PT0gMDtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geSBpcyBncmVlbicpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYXBwZW5kQ2hpbGRzIHknKTtcbiAgICBicmFpbi5leGVjdXRlKCd6IGlzIGFuIHgnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKTtcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWQ7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbicpWzBdLnRleHRDb250ZW50ID09PSAnY2FwcmEnO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b24nKS5sZW5ndGggPT09IDA7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2dyZWVuIGJ1dHRvbicpLmxlbmd0aCA9PT0gMTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGNvbnN0IHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JylcbiAgICBkb2N1bWVudC5ib2R5ID0geFxufSIsImV4cG9ydCBmdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=