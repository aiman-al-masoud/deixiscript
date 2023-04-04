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

/***/ "./app/src/backend/wrapper/BaseThing.ts":
/*!**********************************************!*\
  !*** ./app/src/backend/wrapper/BaseThing.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeGetter = void 0;
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Thing_1 = __webpack_require__(/*! ./Thing */ "./app/src/backend/wrapper/Thing.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const allKeys_1 = __webpack_require__(/*! ../../utils/allKeys */ "./app/src/utils/allKeys.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../middle/clauses/functions/topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
const typeOf_1 = __webpack_require__(/*! ./typeOf */ "./app/src/backend/wrapper/typeOf.ts");
const deepCopy_1 = __webpack_require__(/*! ../../utils/deepCopy */ "./app/src/utils/deepCopy.ts");
const makeSetter_1 = __webpack_require__(/*! ./makeSetter */ "./app/src/backend/wrapper/makeSetter.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
function relationsEqual(r1, r2) {
    return r1.predicate.root === r2.predicate.root
        && r1.args.length === r2.args.length
        && r1.args.every((x, i) => r2.args[i] === x);
}
class BaseThing {
    constructor(object, id, parent, name, heirlooms = [], relations = []) {
        this.object = object;
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.heirlooms = heirlooms;
        this.relations = relations;
        this.is = (predicate) => //TODO:remove
         this.relations.filter(x => x.args.length === 0).map(x => x.predicate).map(x => x.root).includes(predicate.root);
        this.inherit = (thing, context) => {
            var _a;
            const copy = thing.copy({ id: this.id }).unwrap();
            if (!copy || thing === this || Object.getPrototypeOf(this.object) === Object.getPrototypeOf(copy) /* don't recreate */) {
                return;
            }
            this.object = copy;
            if (this.object instanceof HTMLElement) {
                this.object.id = this.id + '';
                (_a = context === null || context === void 0 ? void 0 : context.root) === null || _a === void 0 ? void 0 : _a.appendChild(this.object);
            }
            if (this.object instanceof HTMLElement && !this.object.children.length) {
                this.object.textContent = 'default';
            }
            this.addHeirlooms(thing);
        };
        this.disinherit = (thing, context) => {
            this.removeHeirlooms(thing);
        };
        this.copy = (opts) => {
            var _a;
            return new BaseThing((0, deepCopy_1.deepCopy)(this.object), (_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id);
        };
        this.getLexemes = () => {
            const lexemes = (0, allKeys_1.allKeys)(this.object).map(x => {
                var _a;
                return (0, Lexeme_1.makeLexeme)({
                    type: (0, typeOf_1.typeOf)((_a = this.get(x)) === null || _a === void 0 ? void 0 : _a.unwrap()),
                    root: x
                });
            });
            return lexemes.concat(lexemes.flatMap(l => l.extrapolate()));
        };
        this.unwrap = () => this.object;
        this.setAlias = (name, path) => {
            this.heirlooms.push({
                name,
                set: (0, makeSetter_1.makeSetter)(path),
                get: makeGetter(path),
                configurable: true,
            });
        };
    }
    isAlready(relation) {
        return this.relations.some(x => relationsEqual(x, relation));
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
            removed.push(...this.getExcludedBy(added));
            unchanged = unchanged.filter(x => !removed.some(r => relationsEqual(x, r)));
        }
        added.forEach(r => this.addRelation(r));
        removed.forEach(r => this.removeRelation(r));
        return this.reinterpret(added, removed, unchanged, opts === null || opts === void 0 ? void 0 : opts.context);
    }
    getExcludedBy(added) {
        var _a;
        const newOne = added[0].predicate;
        if ((_a = newOne.referent) === null || _a === void 0 ? void 0 : _a.getConcepts().includes('color')) {
            return this.relations.filter(x => !x.args.length).filter(x => { var _a; return (x.predicate.referent !== this) && ((_a = x.predicate.referent) === null || _a === void 0 ? void 0 : _a.getConcepts().includes('color')) && (x.predicate.root !== newOne.root); });
        }
        return [];
    }
    addRelation(relation) {
        this.relations.push(relation);
    }
    removeRelation(relation) {
        this.relations = this.relations.filter(x => !relationsEqual(x, relation));
    }
    reinterpret(added, removed, unchanged, context) {
        // console.log('added=', added, 'removed=', removed, 'unchanged=', unchanged) 
        removed.forEach(p => {
            this.repeal(p, context);
        });
        added.forEach(p => {
            this.enact(p, context);
        });
        unchanged.forEach(p => {
            this.enact(p, context);
        });
        return undefined;
    }
    enact(relation, context) {
        var _a, _b, _c, _d;
        const prop = this.canHaveA(relation.predicate);
        if (relation.predicate.isVerb) {
            return this.call(relation.predicate, relation.args);
        }
        else if (prop) {
            this.object[prop] = typeof ((_a = this.get(relation.predicate.root)) === null || _a === void 0 ? void 0 : _a.unwrap()) === 'boolean' ? true : relation.predicate.root;
        }
        else if (this.parent) {
            const parent = (_d = (_c = (_b = this.parent).unwrap) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : this.parent;
            if (typeof this.object !== 'object')
                parent[this.name] = relation.predicate.root; //TODO bool
        }
        else if (relation.predicate.referent) {
            this.inherit(relation.predicate.referent, context); //undef?
        }
    }
    repeal(relation, context) {
        var _a, _b, _c, _d;
        const prop = this.canHaveA(relation.predicate);
        if (relation.predicate.isVerb) {
            //TODO: undo method call
        }
        else if (prop) {
            this.object[prop] = typeof ((_a = this.get(relation.predicate.root)) === null || _a === void 0 ? void 0 : _a.unwrap()) === 'boolean' ? false : '';
        }
        else if (this.parent) {
            const parent = (_d = (_c = (_b = this.parent).unwrap) === null || _c === void 0 ? void 0 : _c.call(_b)) !== null && _d !== void 0 ? _d : this.parent;
            if (typeof this.object !== 'object')
                parent[this.name] = ''; //TODO bool
        }
        else if (relation.predicate.referent) {
            this.disinherit(relation.predicate.referent, context); //undef?
        }
    }
    addHeirlooms(thing) {
        thing.getHeirlooms().forEach(h => {
            Object.defineProperty(this.object, h.name, h);
        });
    }
    removeHeirlooms(thing) {
        thing.getHeirlooms().forEach(h => {
            delete this.object[h.name];
        });
    }
    canHaveA(value) {
        var _a, _b;
        const concepts = [...(_b = (_a = value.referent) === null || _a === void 0 ? void 0 : _a.getConcepts()) !== null && _b !== void 0 ? _b : [], value.root];
        return concepts.find(x => { var _a; return ((_a = this.get(x)) === null || _a === void 0 ? void 0 : _a.unwrap()) !== undefined; });
    }
    //-----------------------------------------------------------
    getConcepts() {
        return (0, uniq_1.uniq)(this.relations.filter(x => !x.args.length).map(x => x.predicate).flatMap(x => {
            var _a, _b;
            return x.referent === this ? [x.root] : (_b = (_a = x.referent) === null || _a === void 0 ? void 0 : _a.getConcepts()) !== null && _b !== void 0 ? _b : [];
        }));
    }
    refreshHeirlooms() {
        this.relations.map(x => x.predicate.referent).filter(x => x).map(x => x).forEach(x => this.addHeirlooms(x));
    }
    getHeirlooms() {
        return this.heirlooms;
    }
    call(verb, args) {
        var _a;
        const method = (_a = this.get(verb.root)) === null || _a === void 0 ? void 0 : _a.unwrap();
        if (!method) {
            return;
        }
        const result = method.call(this.object, ...args.map(x => x.unwrap()));
        return (0, Thing_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)(), object: result });
    }
    // --------------------------------------------------------------------
    ownerInfo(q) {
        const maps = this.query(q);
        return (maps[0] && (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]).length > 1) ? q.copy({ map: maps[0] }) : Clause_1.emptyClause;
    }
    toClause(query) {
        const queryOrEmpty = query !== null && query !== void 0 ? query : Clause_1.emptyClause;
        const fillerClause = (0, Clause_1.clauseOf)((0, Lexeme_1.makeLexeme)({ root: this.id.toString(), type: 'noun' }), this.id); //TODO
        const nameClause = this.name ? (0, Clause_1.clauseOf)((0, Lexeme_1.makeLexeme)({ root: this.name, type: 'noun' }), this.id) : Clause_1.emptyClause; //TODO
        const relStuff = this.relations.filter(x => x.args.length > 0).map(x => (0, Clause_1.clauseOf)(x.predicate, ...[this.id, ...x.args.map(x => x.id)])).reduce((a, b) => a.and(b), Clause_1.emptyClause);
        const res = queryOrEmpty.flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => this.is(x.predicate))
            .map(x => x.copy({ map: { [x.args[0]]: this.id } }))
            .concat(fillerClause)
            .reduce((a, b) => a.and(b), Clause_1.emptyClause)
            .and(this.ownerInfo(queryOrEmpty))
            .and(relStuff)
            .and(nameClause);
        return res;
    }
    get(id) {
        // this.refreshHeirlooms() //TODO! 
        const parts = id.split('.');
        const p1 = parts[0];
        const o = this.object[p1];
        const w = o instanceof BaseThing ? o : new BaseThing(o, `${this.id}.${p1}`, this, p1); //TODO:check id!
        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'));
        }
        return w;
    }
    query(clause, parentMap = {}) {
        var _a;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause, (0, topLevel_1.getTopLevel)(clause)[0]);
        // console.log('clause=', clause.toString(), 'oc=', oc, 'name=', this.name)
        if (oc.length === 1) { //BASECASE: check yourself
            //TODO: also handle non-ownership non-intransitive relations!
            //TODO: handle non BasicClauses!!!! (that don't have ONE predicate!)
            if (clause.simple.predicate && (this.is(clause.simple.predicate) || this.name === ((_a = clause.simple.predicate) === null || _a === void 0 ? void 0 : _a.root))) {
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
        const children = (0, allKeys_1.allKeys)(this.object)
            .map(x => { var _a; return ({ name: x, obj: (_a = this.get(x)) === null || _a === void 0 ? void 0 : _a.unwrap() }); })
            .filter(x => relevantNames.includes(x.name)) // performance
            .filter(x => x.obj !== this.object)
            .map(x => new BaseThing(x.obj, `${this.id}.${x.name}`, this, x.name));
        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }));
        return res;
    }
}
exports["default"] = BaseThing;
function getNested(object, path) {
    if (!object[path[0]]) {
        return undefined;
    }
    let x = (0, Thing_1.wrap)({ object: object[path[0]], id: (0, getIncrementalId_1.getIncrementalId)(), parent: object, name: path[0] });
    path.slice(1).forEach(p => {
        const y = x.unwrap()[p];
        x = (0, Thing_1.wrap)({ object: y, id: (0, getIncrementalId_1.getIncrementalId)(), parent: x, name: p });
    });
    return x;
}
function makeGetter(path) {
    function f() {
        return getNested(this, path);
    }
    return f;
}
exports.makeGetter = makeGetter;
// ---------------------------------------------------------------


/***/ }),

/***/ "./app/src/backend/wrapper/Thing.ts":
/*!******************************************!*\
  !*** ./app/src/backend/wrapper/Thing.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrap = void 0;
const BaseThing_1 = __importDefault(__webpack_require__(/*! ./BaseThing */ "./app/src/backend/wrapper/BaseThing.ts"));
function wrap(args) {
    var _a;
    return new BaseThing_1.default((_a = args.object) !== null && _a !== void 0 ? _a : {}, args.id, args.parent, args.name);
}
exports.wrap = wrap;


/***/ }),

/***/ "./app/src/backend/wrapper/makeSetter.ts":
/*!***********************************************!*\
  !*** ./app/src/backend/wrapper/makeSetter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeSetter = void 0;
const setNested_1 = __webpack_require__(/*! ../../utils/setNested */ "./app/src/utils/setNested.ts");
function makeSetter(path) {
    function f(value) {
        (0, setNested_1.setNested)(this, path, value);
    }
    // Object.defineProperty(f, 'name', { value: `set_${alias}`, writable: true });
    // Object.defineProperty(f, 'name', { value: alias, writable: true });
    return f;
}
exports.makeSetter = makeSetter;


/***/ }),

/***/ "./app/src/backend/wrapper/typeOf.ts":
/*!*******************************************!*\
  !*** ./app/src/backend/wrapper/typeOf.ts ***!
  \*******************************************/
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
const Thing_1 = __webpack_require__(/*! ../backend/wrapper/Thing */ "./app/src/backend/wrapper/Thing.ts");
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
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
//TODO: put back in prelude!
const buttonThing = (0, Thing_1.wrap)({ id: 'button', object: HTMLButtonElement.prototype });
buttonThing.setAlias('color', ['style', 'background']);
buttonThing.setAlias('text', ['textContent']);
const divThing = (0, Thing_1.wrap)({ id: 'div', object: HTMLDivElement.prototype });
divThing.setAlias('color', ['style', 'background']);
exports.lexemes = [
    being,
    doing,
    not,
    { _root: being, token: 'is', cardinality: 1 },
    { _root: being, token: 'are', cardinality: '*' },
    { _root: doing, token: 'does', cardinality: 1 },
    {
        root: 'then',
        type: 'filler' // filler word, what about partial parsing?
    },
    {
        root: '.',
        type: 'fullstop'
    },
    {
        root: 'optional',
        type: 'adjective',
        cardinality: '1|0'
    },
    {
        root: 'one-or-more',
        type: 'adjective',
        cardinality: '+'
    },
    {
        root: 'zero-or-more',
        type: 'adjective',
        cardinality: '*'
    },
    {
        root: 'or',
        type: 'disjunc'
    },
    {
        root: 'subject',
        type: 'adjective'
    },
    {
        root: 'predicate',
        type: 'adjective'
    },
    {
        root: 'object',
        type: 'adjective'
    },
    {
        root: "isn't",
        type: 'contraction',
        contractionFor: [being, not]
    },
    {
        root: 'and',
        type: 'nonsubconj'
    },
    {
        root: 'left',
        type: 'adjective'
    },
    {
        root: 'right',
        type: 'adjective'
    },
    {
        root: 'condition',
        type: 'adjective'
    },
    {
        root: 'consequence',
        type: 'adjective'
    },
    {
        root: 'thing',
        type: 'noun',
        referent: (0, Thing_1.wrap)({ id: 'thing', object: {} })
    },
    {
        root: 'button',
        type: 'noun',
        referent: buttonThing
    },
    {
        root: 'div',
        type: 'noun',
        referent: divThing
    },
    //TODO: put back in prelude!
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
    'color is a thing',
    'red and blue and black and green and purple are colors',
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
        Object.defineProperty(Number.prototype, 'add', { writable: true, value: function (a) { return this + a; } });
        this.context.prelude.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
            if (ast.type === 'macro') {
                this.context.setSyntax(ast);
                return [];
            }
            const clause = (0, evalAst_1.evalAst)(this.context, ast).simple;
            return [];
            // console.log(clause.toString())
            // if (clause.hasSideEffects) {
            //     return this.actuator.takeAction(clause, this.context)
            // } else {
            //     const maps = this.context.query(clause)
            //     const wrappers = maps.flatMap(m=>Object.values(m)).map(id=>this.context.get(id))
            //     // const wrappers = clause.entities.flatMap(id => getKool(this.context, clause, id))
            //     this.context.values.forEach(w => pointOut(w, { turnOff: true }))
            //     wrappers.forEach(w => w ? pointOut(w) : 0)
            //     return wrappers
            // }
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
    return new BasicBrain_1.default((0, Context_1.getNewContext)(opts));
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/facade/context/BasicContext.ts":
/*!************************************************!*\
  !*** ./app/src/facade/context/BasicContext.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const macroToSyntax_1 = __webpack_require__(/*! ../../frontend/parser/macroToSyntax */ "./app/src/frontend/parser/macroToSyntax.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../../frontend/parser/maxPrecedence */ "./app/src/frontend/parser/maxPrecedence.ts");
class BasicContext {
    constructor(enviro, config) {
        this.enviro = enviro;
        this.config = config;
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

/***/ "./app/src/facade/context/Config.ts":
/*!******************************************!*\
  !*** ./app/src/facade/context/Config.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ../../config/lexemes */ "./app/src/config/lexemes.ts");
const LexemeType_1 = __webpack_require__(/*! ../../config/LexemeType */ "./app/src/config/LexemeType.ts");
const prelude_1 = __webpack_require__(/*! ../../config/prelude */ "./app/src/config/prelude.ts");
const syntaxes_1 = __webpack_require__(/*! ../../config/syntaxes */ "./app/src/config/syntaxes.ts");
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
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
    };
}
exports.getConfig = getConfig;


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
exports.getNewContext = void 0;
const Enviro_1 = __importDefault(__webpack_require__(/*! ../../backend/enviro/Enviro */ "./app/src/backend/enviro/Enviro.ts"));
const BasicContext_1 = __importDefault(__webpack_require__(/*! ./BasicContext */ "./app/src/facade/context/BasicContext.ts"));
const Config_1 = __webpack_require__(/*! ./Config */ "./app/src/facade/context/Config.ts");
function getNewContext(opts) {
    return new BasicContext_1.default((0, Enviro_1.default)(opts), (0, Config_1.getConfig)());
}
exports.getNewContext = getNewContext;


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
            return [(0, Lexeme_1.makeLexeme)({ _root: this, token: (0, pluralize_1.pluralize)(this.root), cardinality: '*' })];
        }
        if (this.isVerb) {
            return (0, conjugate_1.conjugate)(this.root).map(x => (0, Lexeme_1.makeLexeme)({ _root: this, token: x }));
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
const Clause_1 = __webpack_require__(/*! ../../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const Lexeme_1 = __webpack_require__(/*! ../Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
function dynamicLexeme(word, context, words) {
    var _a, _b, _c, _d;
    const relevant = words
        .map(w => (0, Clause_1.clauseOf)((0, Lexeme_1.makeLexeme)({ root: w, type: 'noun' }), 'X'))
        .flatMap(c => context.query(c))
        .flatMap(m => Object.values(m))
        .flatMap(id => { var _a; return (_a = context.get(id)) !== null && _a !== void 0 ? _a : []; })
        .flatMap(x => x.getLexemes())
        .filter(x => x.token === word || x.root === word);
    const isMacroContext = words.some(x => { var _a; return ((_a = context.getLexeme(x)) === null || _a === void 0 ? void 0 : _a.type) === 'grammar'; })
        && !words.some(x => { var _a; return ['defart', 'indefart', 'nonsubconj'].includes((_a = context.getLexeme(x)) === null || _a === void 0 ? void 0 : _a.type); }); //TODO: why dependencies('macro') doesn't work?!
    const type = (_b = (_a = relevant[0]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : (isMacroContext ?
        'grammar'
        : 'noun');
    return (0, Lexeme_1.makeLexeme)({ token: word, root: (_d = (_c = relevant === null || relevant === void 0 ? void 0 : relevant.at(0)) === null || _c === void 0 ? void 0 : _c.root) !== null && _d !== void 0 ? _d : word, type: type });
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
        this.about = (id) => this.clause1.about(id).and(this.clause2.about(id));
        this.ownedBy = (id) => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
        this.ownersOf = (id) => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
        this.describe = (id) => this.clause1.describe(id).concat(this.clause2.describe(id));
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
        this.about = (id) => this.entities.includes(id) ? this : Clause_1.emptyClause;
        this.ownedBy = (id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
        this.ownersOf = (id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
        this.describe = (id) => this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : [];
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
        this.about = (id) => this;
        this.ownedBy = (id) => [];
        this.ownersOf = (id) => [];
        this.describe = (id) => [];
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
        this.describe = (id) => this.consequence.describe(id).concat(this.condition.describe(id));
        this.about = (id) => this.condition.about(id).and(this.consequence.about(id));
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

/***/ "./app/src/middle/clauses/functions/invertEffect.ts":
/*!**********************************************************!*\
  !*** ./app/src/middle/clauses/functions/invertEffect.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.invertEffect = void 0;
function invertEffect(clause) {
    return clause.copy({
        clause1: clause.theme.simple,
        clause2: clause.rheme.simple.copy({ negate: true })
    });
}
exports.invertEffect = invertEffect;


/***/ }),

/***/ "./app/src/middle/clauses/functions/makeAllVars.ts":
/*!*********************************************************!*\
  !*** ./app/src/middle/clauses/functions/makeAllVars.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeAllVars = void 0;
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/middle/id/functions/isVar.ts");
const toConst_1 = __webpack_require__(/*! ../../id/functions/toConst */ "./app/src/middle/id/functions/toConst.ts");
function makeAllVars(clause) {
    const m = clause.entities
        .filter(x => (0, isVar_1.isVar)(x))
        .map(e => ({ [(0, toConst_1.toConst)(e)]: e }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
}
exports.makeAllVars = makeAllVars;


/***/ }),

/***/ "./app/src/middle/clauses/functions/makeImply.ts":
/*!*******************************************************!*\
  !*** ./app/src/middle/clauses/functions/makeImply.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeImply = void 0;
const Clause_1 = __webpack_require__(/*! ../Clause */ "./app/src/middle/clauses/Clause.ts");
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/middle/id/functions/isVar.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ../Imply */ "./app/src/middle/clauses/Imply.ts"));
function makeImply(clause) {
    if (clause instanceof Imply_1.default) {
        return clause;
    }
    if (clause.rheme === Clause_1.emptyClause) {
        return clause;
    }
    if (clause.entities.some(e => (0, isVar_1.isVar)(e))
        || clause.flatList().some(x => { var _a; return !!((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.isPlural); })) {
        return clause.theme.implies(clause.rheme);
    }
    return clause;
}
exports.makeImply = makeImply;


/***/ }),

/***/ "./app/src/middle/clauses/functions/propagateVarsOwned.ts":
/*!****************************************************************!*\
  !*** ./app/src/middle/clauses/functions/propagateVarsOwned.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.propagateVarsOwned = void 0;
const toVar_1 = __webpack_require__(/*! ../../id/functions/toVar */ "./app/src/middle/id/functions/toVar.ts");
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/middle/id/functions/isVar.ts");
function propagateVarsOwned(clause) {
    const m = clause.entities
        .filter(e => (0, isVar_1.isVar)(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: (0, toVar_1.toVar)(e) }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
}
exports.propagateVarsOwned = propagateVarsOwned;


/***/ }),

/***/ "./app/src/middle/clauses/functions/resolveAnaphora.ts":
/*!*************************************************************!*\
  !*** ./app/src/middle/clauses/functions/resolveAnaphora.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveAnaphora = void 0;
function resolveAnaphora(clause) {
    const m = clause.theme.query(clause.rheme)[0];
    return clause.copy({ map: m !== null && m !== void 0 ? m : {} });
}
exports.resolveAnaphora = resolveAnaphora;


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
const Clause_1 = __webpack_require__(/*! ./clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const makeAllVars_1 = __webpack_require__(/*! ./clauses/functions/makeAllVars */ "./app/src/middle/clauses/functions/makeAllVars.ts");
const makeImply_1 = __webpack_require__(/*! ./clauses/functions/makeImply */ "./app/src/middle/clauses/functions/makeImply.ts");
const invertEffect_1 = __webpack_require__(/*! ./clauses/functions/invertEffect */ "./app/src/middle/clauses/functions/invertEffect.ts");
const propagateVarsOwned_1 = __webpack_require__(/*! ./clauses/functions/propagateVarsOwned */ "./app/src/middle/clauses/functions/propagateVarsOwned.ts");
const resolveAnaphora_1 = __webpack_require__(/*! ./clauses/functions/resolveAnaphora */ "./app/src/middle/clauses/functions/resolveAnaphora.ts");
const getIncrementalId_1 = __webpack_require__(/*! ./id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const toVar_1 = __webpack_require__(/*! ./id/functions/toVar */ "./app/src/middle/id/functions/toVar.ts");
const Thing_1 = __webpack_require__(/*! ../backend/wrapper/Thing */ "./app/src/backend/wrapper/Thing.ts");
function evalAst(context, ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    console.log(ast);
    let result;
    let rel;
    if (!ast) {
        result = Clause_1.emptyClause;
    }
    else if (ast.lexeme) {
        result = evalLexeme(context, ast.lexeme, args);
    }
    else if (ast.list) {
        result = evalAstList(context, ast.list, args);
    }
    else if (((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.relpron) && ast.links.copula) {
        result = evalCopulaSubClause(context, ast, args);
    }
    else if (((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.relpron) && ast.links.mverb) {
        result = evalMverbSubClause(context, ast, args);
    }
    else if ((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.copula) {
        result = evalCopulaSentence(context, ast, args);
    }
    else if ((_d = ast.links) === null || _d === void 0 ? void 0 : _d.nonsubconj) {
        result = evalAndSentence(context, ast, args);
    }
    else if (rel = ((_f = (_e = ast.links) === null || _e === void 0 ? void 0 : _e.iverb) === null || _f === void 0 ? void 0 : _f.lexeme) || ((_h = (_g = ast.links) === null || _g === void 0 ? void 0 : _g.mverb) === null || _h === void 0 ? void 0 : _h.lexeme) || ((_k = (_j = ast.links) === null || _j === void 0 ? void 0 : _j.preposition) === null || _k === void 0 ? void 0 : _k.lexeme)) {
        result = evalRelation(context, ast, rel, args);
    }
    else if ((_l = ast.links) === null || _l === void 0 ? void 0 : _l.subconj) {
        result = evalComplexSentence(context, ast, args);
    }
    else {
        result = evalNounPhrase(context, ast, args);
    }
    if (result) {
        return adjustClause(result, !!((_m = ast === null || ast === void 0 ? void 0 : ast.links) === null || _m === void 0 ? void 0 : _m.nonsubconj), !!((_o = ast === null || ast === void 0 ? void 0 : ast.links) === null || _o === void 0 ? void 0 : _o.negation));
    }
    console.log({ ast });
    throw new Error(`Idk what to do with '${ast === null || ast === void 0 ? void 0 : ast.type}'!`);
}
exports.evalAst = evalAst;
function adjustClause(clause, hasAnd, isNegated) {
    const c0 = hasAnd ? clause : (0, makeImply_1.makeImply)(clause);
    const c1 = (0, makeAllVars_1.makeAllVars)(c0);
    const c2 = (0, resolveAnaphora_1.resolveAnaphora)(c1);
    const c3 = (0, propagateVarsOwned_1.propagateVarsOwned)(c2);
    const c4 = isNegated ? (0, invertEffect_1.invertEffect)(c3) : c3;
    return c4;
}
function evalLexeme(context, lexeme, args) {
    if (lexeme.type === 'noun' || lexeme.type === 'adjective' || lexeme.type === 'pronoun' || lexeme.type === 'grammar') {
        return (0, Clause_1.clauseOf)(lexeme, ...(args === null || args === void 0 ? void 0 : args.subject) ? [args === null || args === void 0 ? void 0 : args.subject] : []);
    }
    else {
        return Clause_1.emptyClause;
    }
}
function evalAstList(context, asts, args) {
    return asts.map(c => evalAst(context, c, args)).reduce((c1, c2) => c1.and(c2), Clause_1.emptyClause);
}
function evalCopulaSentence(context, copulaSentence, args) {
    var _a, _b, _c;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subject = evalAst(context, (_b = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId });
    const predicate = evalAst(context, (_c = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId });
    const maps1 = context.query(subject);
    const maps = !maps1.length ? [{}] : maps1;
    const clause = predicate.flatList()[0]; //TODOOOOOOOOOOOOOOOOOO!!!!
    maps.forEach(m => {
        var _a;
        const argz = clause.args;
        const predicate = clause.predicate;
        const args = argz
            .map(id => m[id] ? context.get(m[id]) : context.set((0, Thing_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)() })));
        const subject = args[0];
        subject === null || subject === void 0 ? void 0 : subject.set(predicate, {
            args: args.slice(1),
            context,
            negated: clause.negated
        });
        if (!predicate.referent && predicate.type === 'noun') { // referent of "proper noun" is first to get it 
            (_a = predicate.referent) !== null && _a !== void 0 ? _a : (predicate.referent = subject);
            context.setLexeme(predicate);
        }
    });
    return subject.and(predicate, { asRheme: true });
}
function evalCopulaSubClause(context, copulaSubClause, args) {
    var _a;
    const predicate = (_a = copulaSubClause === null || copulaSubClause === void 0 ? void 0 : copulaSubClause.links) === null || _a === void 0 ? void 0 : _a.predicate;
    return evalAst(context, predicate, args);
}
function evalMverbSubClause(context, ast, args) {
    var _a, _b, _c;
    const mverb = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.mverb) === null || _b === void 0 ? void 0 : _b.lexeme;
    const subjectId = args === null || args === void 0 ? void 0 : args.subject;
    const objectId = (0, getIncrementalId_1.getIncrementalId)();
    const object = evalAst(context, (_c = ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objectId }); // 
    return object.and((0, Clause_1.clauseOf)(mverb, subjectId, objectId));
}
function evalNounPhrase(context, nounPhrase, opts) {
    var _a, _b, _c;
    const maybeId = (_a = opts === null || opts === void 0 ? void 0 : opts.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subjectId = ((_b = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _b === void 0 ? void 0 : _b.uniquant) ? (0, toVar_1.toVar)(maybeId) : maybeId;
    const args = { subject: subjectId };
    return Object.values((_c = nounPhrase.links) !== null && _c !== void 0 ? _c : {})
        .map(x => evalAst(context, x, args)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
}
function evalRelation(context, ast, rel, opts) {
    var _a, _b, _c;
    const subjId = (_a = opts === null || opts === void 0 ? void 0 : opts.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const objId = (0, getIncrementalId_1.getIncrementalId)();
    const subject = evalAst(context, (_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjId });
    const object = evalAst(context, (_c = ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objId });
    const args = object === Clause_1.emptyClause ? [subjId] : [subjId, objId];
    const relation = (0, Clause_1.clauseOf)(rel, ...args);
    const relationIsRheme = subject !== Clause_1.emptyClause;
    return subject
        .and(object)
        .and(relation, { asRheme: relationIsRheme });
}
function evalComplexSentence(context, ast, args) {
    var _a, _b, _c, _d;
    const subconj = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subconj) === null || _b === void 0 ? void 0 : _b.lexeme;
    const condition = evalAst(context, (_c = ast.links) === null || _c === void 0 ? void 0 : _c.condition, args);
    const consequence = evalAst(context, (_d = ast.links) === null || _d === void 0 ? void 0 : _d.consequence, args);
    return condition.implies(consequence).copy({ subjconj: subconj });
}
function evalAndSentence(context, ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const left = evalAst(context, (_a = ast.links) === null || _a === void 0 ? void 0 : _a.left, args);
    const right = evalAst(context, (_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.right) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d[0], args);
    if (((_f = (_e = ast.links) === null || _e === void 0 ? void 0 : _e.left) === null || _f === void 0 ? void 0 : _f.type) === ((_h = (_g = ast.links) === null || _g === void 0 ? void 0 : _g.right) === null || _h === void 0 ? void 0 : _h.type)) {
        return left.and(right);
    }
    else {
        const m = { [right.entities[0]]: left.entities[0] };
        const theme = left.theme.and(right.theme);
        const rheme = right.rheme.and(right.rheme.copy({ map: m }));
        return theme.and(rheme, { asRheme: true });
    }
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIncrementalId = void 0;
const toVar_1 = __webpack_require__(/*! ./toVar */ "./app/src/middle/id/functions/toVar.ts");
function getIncrementalId(opts) {
    const newId = `id${idGenerator.next().value}`;
    return (opts === null || opts === void 0 ? void 0 : opts.asVar) ? (0, toVar_1.toVar)(newId) : newId;
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

/***/ "./app/src/middle/id/functions/isVar.ts":
/*!**********************************************!*\
  !*** ./app/src/middle/id/functions/isVar.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVar = void 0;
function isVar(e) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase());
}
exports.isVar = isVar;


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

/***/ "./app/src/middle/id/functions/toConst.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/toConst.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toConst = void 0;
function toConst(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase();
}
exports.toConst = toConst;


/***/ }),

/***/ "./app/src/middle/id/functions/toVar.ts":
/*!**********************************************!*\
  !*** ./app/src/middle/id/functions/toVar.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toVar = void 0;
function toVar(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase();
}
exports.toVar = toVar;


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
        return undefined;
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

/***/ "./app/src/utils/setNested.ts":
/*!************************************!*\
  !*** ./app/src/utils/setNested.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setNested = void 0;
function setNested(object, path, value) {
    let x = object;
    path.slice(0, -1).forEach(p => {
        x = x[p];
    });
    x[path.at(-1)] = value;
}
exports.setNested = setNested;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci9CYXNlVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvbWFrZVNldHRlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci90eXBlT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9CYXNlTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQW5kLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQXRvbUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvaW52ZXJ0RWZmZWN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VBbGxWYXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VJbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvcmVzb2x2ZUFuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pc1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvc29ydElkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9Db25zdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9WYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9hbGxLZXlzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZGVlcENvcHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvbmV3SW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zZXROZXN0ZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3RhZ05hbWVGcm9tUHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxNS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyOS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzMS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDMzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzNy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0NC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0Ny50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy91dGlscy9jbGVhckRvbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdXRpbHMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5cblxubWFpbigpIiwiaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBUaGluZyBmcm9tIFwiLi4vd3JhcHBlci9UaGluZ1wiO1xuaW1wb3J0IHsgRW52aXJvLCB9IGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBUaGluZyB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLicpXG4gICAgICAgIGNvbnN0IHAxID0gcGFydHNbMF1cbiAgICAgICAgY29uc3QgdyA9IHRoaXMuZGljdGlvbmFyeVtwMV1cblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuZ2V0KHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TGFzdFJlZmVyZW5jZWQocDEpXG4gICAgICAgIHJldHVybiB3XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBUaGluZ1tdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldCA9ICh3cmFwcGVyOiBUaGluZyk6IFRoaW5nID0+IHtcbiAgICAgICAgdGhpcy5zZXRMYXN0UmVmZXJlbmNlZCh3cmFwcGVyLmlkKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W3dyYXBwZXIuaWRdID0gd3JhcHBlclxuICAgIH1cblxuICAgIHF1ZXJ5ID0gKHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLnZhbHVlc1xuICAgICAgICAgICAgLm1hcCh3ID0+IHcudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSB1bml2ZXJzZVxuICAgICAgICAgICAgLnF1ZXJ5KHF1ZXJ5LCB7IGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkIH0pXG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3F1ZXJ5PScsIHF1ZXJ5LnRvU3RyaW5nKCksICd1bml2ZXJzZT0nLCB1bml2ZXJzZS50b1N0cmluZygpLCAnbWFwcz0nLCBtYXBzKVxuICAgICAgICByZXR1cm4gbWFwc1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRMYXN0UmVmZXJlbmNlZChsYXN0UmVmZXJlbmNlZDogSWQpIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZGljdGlvbmFyeSkuaW5jbHVkZXMobGFzdFJlZmVyZW5jZWQpKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gbGFzdFJlZmVyZW5jZWRcbiAgICAgICAgfVxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi93cmFwcGVyL1RoaW5nXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KHdyYXBwZXI6IFRoaW5nKTogVGhpbmdcbiAgICByZWFkb25seSB2YWx1ZXM6IFRoaW5nW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBIZWlybG9vbSB9IGZyb20gXCIuL0hlaXJsb29tXCI7XG5pbXBvcnQgVGhpbmcsIHsgQ29weU9wdHMsIFNldE9wcywgd3JhcCB9IGZyb20gXCIuL1RoaW5nXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgYWxsS2V5cyB9IGZyb20gXCIuLi8uLi91dGlscy9hbGxLZXlzXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tIFwiLi90eXBlT2ZcIjtcbmltcG9ydCB7IGRlZXBDb3B5IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2RlZXBDb3B5XCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IHsgbWFrZVNldHRlciB9IGZyb20gXCIuL21ha2VTZXR0ZXJcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cblxudHlwZSBSZWxhdGlvbiA9IHsgcHJlZGljYXRlOiBMZXhlbWUsIGFyZ3M6IFRoaW5nW10gfSAvL2ltcGxpZWQgc3ViamVjdCA9IHRoaXMgb2JqZWN0XG5cblxuXG5mdW5jdGlvbiByZWxhdGlvbnNFcXVhbChyMTogUmVsYXRpb24sIHIyOiBSZWxhdGlvbikge1xuICAgIHJldHVybiByMS5wcmVkaWNhdGUucm9vdCA9PT0gcjIucHJlZGljYXRlLnJvb3RcbiAgICAgICAgJiYgcjEuYXJncy5sZW5ndGggPT09IHIyLmFyZ3MubGVuZ3RoXG4gICAgICAgICYmIHIxLmFyZ3MuZXZlcnkoKHgsIGkpID0+IHIyLmFyZ3NbaV0gPT09IHgpXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBwYXJlbnQ/OiBUaGluZyxcbiAgICAgICAgcmVhZG9ubHkgbmFtZT86IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgaGVpcmxvb21zOiBIZWlybG9vbVtdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCByZWxhdGlvbnM6IFJlbGF0aW9uW10gPSBbXSxcbiAgICApIHsgfVxuXG4gICAgcHJvdGVjdGVkIGlzID0gKHByZWRpY2F0ZTogTGV4ZW1lKSA9PiAvL1RPRE86cmVtb3ZlXG4gICAgICAgIHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+IHguYXJncy5sZW5ndGggPT09IDApLm1hcCh4ID0+IHgucHJlZGljYXRlKS5tYXAoeCA9PiB4LnJvb3QpLmluY2x1ZGVzKHByZWRpY2F0ZS5yb290KVxuXG4gICAgcHJvdGVjdGVkIGlzQWxyZWFkeShyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25zLnNvbWUoeCA9PiByZWxhdGlvbnNFcXVhbCh4LCByZWxhdGlvbikpXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogVGhpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uOiBSZWxhdGlvbiA9IHsgcHJlZGljYXRlLCBhcmdzOiBvcHRzPy5hcmdzID8/IFtdIH1cblxuICAgICAgICBsZXQgYWRkZWQ6IFJlbGF0aW9uW10gPSBbXVxuICAgICAgICBsZXQgcmVtb3ZlZDogUmVsYXRpb25bXSA9IFtdXG4gICAgICAgIGxldCB1bmNoYW5nZWQgPSB0aGlzLnJlbGF0aW9ucy5maWx0ZXIoeCA9PiAhcmVsYXRpb25zRXF1YWwoeCwgcmVsYXRpb24pKVxuXG4gICAgICAgIGlmIChvcHRzPy5uZWdhdGVkKSB7XG4gICAgICAgICAgICByZW1vdmVkID0gW3JlbGF0aW9uXVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBbHJlYWR5KHJlbGF0aW9uKSkge1xuICAgICAgICAgICAgdW5jaGFuZ2VkLnB1c2gocmVsYXRpb24pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhZGRlZCA9IFtyZWxhdGlvbl1cbiAgICAgICAgICAgIHJlbW92ZWQucHVzaCguLi50aGlzLmdldEV4Y2x1ZGVkQnkoYWRkZWQpKVxuICAgICAgICAgICAgdW5jaGFuZ2VkID0gdW5jaGFuZ2VkLmZpbHRlcih4ID0+ICFyZW1vdmVkLnNvbWUociA9PiByZWxhdGlvbnNFcXVhbCh4LCByKSkpXG4gICAgICAgIH1cblxuICAgICAgICBhZGRlZC5mb3JFYWNoKHIgPT4gdGhpcy5hZGRSZWxhdGlvbihyKSlcbiAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKHIgPT4gdGhpcy5yZW1vdmVSZWxhdGlvbihyKSlcblxuICAgICAgICByZXR1cm4gdGhpcy5yZWludGVycHJldChhZGRlZCwgcmVtb3ZlZCwgdW5jaGFuZ2VkLCBvcHRzPy5jb250ZXh0KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRFeGNsdWRlZEJ5KGFkZGVkOiBSZWxhdGlvbltdKTogUmVsYXRpb25bXSB7XG5cbiAgICAgICAgY29uc3QgbmV3T25lID0gYWRkZWRbMF0ucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKG5ld09uZS5yZWZlcmVudD8uZ2V0Q29uY2VwdHMoKS5pbmNsdWRlcygnY29sb3InKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+ICF4LmFyZ3MubGVuZ3RoKS5maWx0ZXIoeCA9PiAoeC5wcmVkaWNhdGUucmVmZXJlbnQgIT09IHRoaXMpICYmICh4LnByZWRpY2F0ZS5yZWZlcmVudD8uZ2V0Q29uY2VwdHMoKS5pbmNsdWRlcygnY29sb3InKSkgJiYgKHgucHJlZGljYXRlLnJvb3QgIT09IG5ld09uZS5yb290KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhZGRSZWxhdGlvbihyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMucHVzaChyZWxhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVtb3ZlUmVsYXRpb24ocmVsYXRpb246IFJlbGF0aW9uKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXJlbGF0aW9uc0VxdWFsKHgsIHJlbGF0aW9uKSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVpbnRlcnByZXQoYWRkZWQ6IFJlbGF0aW9uW10sIHJlbW92ZWQ6IFJlbGF0aW9uW10sIHVuY2hhbmdlZDogUmVsYXRpb25bXSwgY29udGV4dD86IENvbnRleHQpIHtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnYWRkZWQ9JywgYWRkZWQsICdyZW1vdmVkPScsIHJlbW92ZWQsICd1bmNoYW5nZWQ9JywgdW5jaGFuZ2VkKSBcblxuICAgICAgICByZW1vdmVkLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcGVhbChwLCBjb250ZXh0KVxuICAgICAgICB9KVxuXG4gICAgICAgIGFkZGVkLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuYWN0KHAsIGNvbnRleHQpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdW5jaGFuZ2VkLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB0aGlzLmVuYWN0KHAsIGNvbnRleHQpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlbmFjdChyZWxhdGlvbjogUmVsYXRpb24sIGNvbnRleHQ/OiBDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNhbkhhdmVBKHJlbGF0aW9uLnByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocmVsYXRpb24ucHJlZGljYXRlLmlzVmVyYikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChyZWxhdGlvbi5wcmVkaWNhdGUsIHJlbGF0aW9uLmFyZ3MpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbcHJvcF0gPSB0eXBlb2YgdGhpcy5nZXQocmVsYXRpb24ucHJlZGljYXRlLnJvb3QpPy51bndyYXAoKSA9PT0gJ2Jvb2xlYW4nID8gdHJ1ZSA6IHJlbGF0aW9uLnByZWRpY2F0ZS5yb290XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGFyZW50LnVud3JhcD8uKCkgPz8gdGhpcy5wYXJlbnRcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vYmplY3QgIT09ICdvYmplY3QnKSBwYXJlbnRbdGhpcy5uYW1lIV0gPSByZWxhdGlvbi5wcmVkaWNhdGUucm9vdCAvL1RPRE8gYm9vbFxuICAgICAgICB9IGVsc2UgaWYgKHJlbGF0aW9uLnByZWRpY2F0ZS5yZWZlcmVudCkge1xuICAgICAgICAgICAgdGhpcy5pbmhlcml0KHJlbGF0aW9uLnByZWRpY2F0ZS5yZWZlcmVudCwgY29udGV4dCkgLy91bmRlZj9cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXBlYWwocmVsYXRpb246IFJlbGF0aW9uLCBjb250ZXh0PzogQ29udGV4dCkge1xuICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5jYW5IYXZlQShyZWxhdGlvbi5wcmVkaWNhdGUpXG5cbiAgICAgICAgaWYgKHJlbGF0aW9uLnByZWRpY2F0ZS5pc1ZlcmIpIHtcbiAgICAgICAgICAgIC8vVE9ETzogdW5kbyBtZXRob2QgY2FsbFxuICAgICAgICB9IGVsc2UgaWYgKHByb3ApIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3Byb3BdID0gdHlwZW9mIHRoaXMuZ2V0KHJlbGF0aW9uLnByZWRpY2F0ZS5yb290KT8udW53cmFwKCkgPT09ICdib29sZWFuJyA/IGZhbHNlIDogJydcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnQudW53cmFwPy4oKSA/PyB0aGlzLnBhcmVudFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ29iamVjdCcpIHBhcmVudFt0aGlzLm5hbWUhXSA9ICcnIC8vVE9ETyBib29sXG4gICAgICAgIH0gZWxzZSBpZiAocmVsYXRpb24ucHJlZGljYXRlLnJlZmVyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmRpc2luaGVyaXQocmVsYXRpb24ucHJlZGljYXRlLnJlZmVyZW50LCBjb250ZXh0KS8vdW5kZWY/XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkSGVpcmxvb21zKHRoaW5nOiBUaGluZykge1xuICAgICAgICB0aGluZy5nZXRIZWlybG9vbXMoKS5mb3JFYWNoKGggPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMub2JqZWN0LCBoLm5hbWUsIGgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbW92ZUhlaXJsb29tcyh0aGluZzogVGhpbmcpIHtcbiAgICAgICAgdGhpbmcuZ2V0SGVpcmxvb21zKCkuZm9yRWFjaChoID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9iamVjdFtoLm5hbWVdXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaGVyaXQgPSAodGhpbmc6IFRoaW5nLCBjb250ZXh0PzogQ29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBjb3B5ID0gdGhpbmcuY29weSh7IGlkOiB0aGlzLmlkIH0pLnVud3JhcCgpXG5cbiAgICAgICAgaWYgKCFjb3B5IHx8IHRoaW5nID09PSB0aGlzIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLm9iamVjdCkgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb3B5KSAvKiBkb24ndCByZWNyZWF0ZSAqLykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9iamVjdCA9IGNvcHlcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QuaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIGNvbnRleHQ/LnJvb3Q/LmFwcGVuZENoaWxkKHRoaXMub2JqZWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMub2JqZWN0LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QudGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWRkSGVpcmxvb21zKHRoaW5nKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNpbmhlcml0ID0gKHRoaW5nOiBUaGluZywgY29udGV4dD86IENvbnRleHQpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVIZWlybG9vbXModGhpbmcpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbkhhdmVBKHZhbHVlOiBMZXhlbWUpIHsgLy9yZXR1cm5zIG5hbWUgb2YgcHJvcCBjb3JyZXNwb25kaW5nIHRvIExleGVtZSBpZiBhbnlcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSBbLi4udmFsdWUucmVmZXJlbnQ/LmdldENvbmNlcHRzKCkgPz8gW10sIHZhbHVlLnJvb3RdXG4gICAgICAgIHJldHVybiBjb25jZXB0cy5maW5kKHggPT4gdGhpcy5nZXQoeCk/LnVud3JhcCgpICE9PSB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgZ2V0Q29uY2VwdHMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLnJlbGF0aW9ucy5maWx0ZXIoeCA9PiAheC5hcmdzLmxlbmd0aCkubWFwKHggPT4geC5wcmVkaWNhdGUpLmZsYXRNYXAoeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4geC5yZWZlcmVudCA9PT0gdGhpcyA/IFt4LnJvb3RdIDogeC5yZWZlcmVudD8uZ2V0Q29uY2VwdHMoKSA/PyBbXVxuICAgICAgICB9KSlcbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEJhc2VUaGluZyhcbiAgICAgICAgZGVlcENvcHkodGhpcy5vYmplY3QpLFxuICAgICAgICBvcHRzPy5pZCA/PyB0aGlzLmlkLCAvL1RPRE86IGtlZXAgb2xkIGJ5IGRlZmF1bHQ/XG4gICAgKVxuXG4gICAgZ2V0TGV4ZW1lcyA9ICgpID0+IHtcblxuICAgICAgICBjb25zdCBsZXhlbWVzID0gYWxsS2V5cyh0aGlzLm9iamVjdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICB0eXBlOiB0eXBlT2YodGhpcy5nZXQoeCk/LnVud3JhcCgpKSxcbiAgICAgICAgICAgIHJvb3Q6IHhcbiAgICAgICAgfSkpXG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXMuY29uY2F0KGxleGVtZXMuZmxhdE1hcChsID0+IGwuZXh0cmFwb2xhdGUoKSkpXG4gICAgfVxuXG4gICAgdW53cmFwID0gKCkgPT4gdGhpcy5vYmplY3RcblxuICAgIHByb3RlY3RlZCByZWZyZXNoSGVpcmxvb21zKCkge1xuICAgICAgICB0aGlzLnJlbGF0aW9ucy5tYXAoeCA9PiB4LnByZWRpY2F0ZS5yZWZlcmVudCkuZmlsdGVyKHggPT4geCkubWFwKHggPT4geCEpLmZvckVhY2goeCA9PiB0aGlzLmFkZEhlaXJsb29tcyh4KSlcbiAgICB9XG5cbiAgICBnZXRIZWlybG9vbXMoKTogSGVpcmxvb21bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlaXJsb29tc1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxsKHZlcmI6IExleGVtZSwgYXJnczogVGhpbmdbXSkge1xuICAgICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmdldCh2ZXJiLnJvb3QpPy51bndyYXAoKSBhcyBGdW5jdGlvblxuXG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1ldGhvZC5jYWxsKHRoaXMub2JqZWN0LCAuLi5hcmdzLm1hcCh4ID0+IHgudW53cmFwKCkpKVxuICAgICAgICByZXR1cm4gd3JhcCh7IGlkOiBnZXRJbmNyZW1lbnRhbElkKCksIG9iamVjdDogcmVzdWx0IH0pXG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgcHJvdGVjdGVkIG93bmVySW5mbyhxOiBDbGF1c2UpIHtcbiAgICAgICAgY29uc3QgbWFwcyA9IHRoaXMucXVlcnkocSlcbiAgICAgICAgcmV0dXJuIChtYXBzWzBdICYmIGdldE93bmVyc2hpcENoYWluKHEsIGdldFRvcExldmVsKHEpWzBdKS5sZW5ndGggPiAxKSA/IHEuY29weSh7IG1hcDogbWFwc1swXSB9KSA6IGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpIHtcbiAgICAgICAgY29uc3QgcXVlcnlPckVtcHR5ID0gcXVlcnkgPz8gZW1wdHlDbGF1c2VcblxuICAgICAgICBjb25zdCBmaWxsZXJDbGF1c2UgPSBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogdGhpcy5pZC50b1N0cmluZygpLCB0eXBlOiAnbm91bicgfSksIHRoaXMuaWQpIC8vVE9ET1xuICAgICAgICBjb25zdCBuYW1lQ2xhdXNlID0gdGhpcy5uYW1lID8gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHRoaXMubmFtZSwgdHlwZTogJ25vdW4nIH0pLCB0aGlzLmlkKSA6IGVtcHR5Q2xhdXNlIC8vVE9ET1xuICAgICAgICBjb25zdCByZWxTdHVmZiA9IHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+IHguYXJncy5sZW5ndGggPiAwKS5tYXAoeCA9PiBjbGF1c2VPZih4LnByZWRpY2F0ZSwgLi4uW3RoaXMuaWQsIC4uLnguYXJncy5tYXAoeCA9PiB4LmlkKV0pKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeU9yRW1wdHkuZmxhdExpc3QoKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguZW50aXRpZXMubGVuZ3RoID09PSAxICYmIHgucHJlZGljYXRlKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHRoaXMuaXMoeC5wcmVkaWNhdGUgYXMgTGV4ZW1lKSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3guYXJncyFbMF1dOiB0aGlzLmlkIH0gfSkpXG4gICAgICAgICAgICAuY29uY2F0KGZpbGxlckNsYXVzZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICAgICAgICAgIC5hbmQodGhpcy5vd25lckluZm8ocXVlcnlPckVtcHR5KSlcbiAgICAgICAgICAgIC5hbmQocmVsU3R1ZmYpXG4gICAgICAgICAgICAuYW5kKG5hbWVDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIHNldEFsaWFzID0gKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nW10pID0+IHtcblxuICAgICAgICB0aGlzLmhlaXJsb29tcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBzZXQ6IG1ha2VTZXR0ZXIocGF0aCksXG4gICAgICAgICAgICBnZXQ6IG1ha2VHZXR0ZXIocGF0aCksXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXQoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIC8vIHRoaXMucmVmcmVzaEhlaXJsb29tcygpIC8vVE9ETyEgXG5cbiAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLicpXG4gICAgICAgIGNvbnN0IHAxID0gcGFydHNbMF1cbiAgICAgICAgY29uc3QgbyA9IHRoaXMub2JqZWN0W3AxXVxuICAgICAgICBjb25zdCB3ID0gbyBpbnN0YW5jZW9mIEJhc2VUaGluZyA/IG8gOiBuZXcgQmFzZVRoaW5nKG8sIGAke3RoaXMuaWR9LiR7cDF9YCwgdGhpcywgcDEpIC8vVE9ETzpjaGVjayBpZCFcblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuZ2V0KHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3XG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIHBhcmVudE1hcDogTWFwID0ge30pOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3Qgb2MgPSBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIGdldFRvcExldmVsKGNsYXVzZSlbMF0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGF1c2U9JywgY2xhdXNlLnRvU3RyaW5nKCksICdvYz0nLCBvYywgJ25hbWU9JywgdGhpcy5uYW1lKVxuXG4gICAgICAgIGlmIChvYy5sZW5ndGggPT09IDEpIHsgLy9CQVNFQ0FTRTogY2hlY2sgeW91cnNlbGZcbiAgICAgICAgICAgIC8vVE9ETzogYWxzbyBoYW5kbGUgbm9uLW93bmVyc2hpcCBub24taW50cmFuc2l0aXZlIHJlbGF0aW9ucyFcbiAgICAgICAgICAgIC8vVE9ETzogaGFuZGxlIG5vbiBCYXNpY0NsYXVzZXMhISEhICh0aGF0IGRvbid0IGhhdmUgT05FIHByZWRpY2F0ZSEpXG4gICAgICAgICAgICBpZiAoY2xhdXNlLnNpbXBsZS5wcmVkaWNhdGUgJiYgKHRoaXMuaXMoY2xhdXNlLnNpbXBsZS5wcmVkaWNhdGUpIHx8IHRoaXMubmFtZSA9PT0gY2xhdXNlLnNpbXBsZS5wcmVkaWNhdGU/LnJvb3QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt7IC4uLnBhcmVudE1hcCwgW2NsYXVzZS5lbnRpdGllc1swXV06IHRoaXMuaWQgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXSAvL1RPRE9cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHlvdXIgY2hpbGRyZW4hXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHBlZWxlZCA9IGNsYXVzZS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5lbnRpdGllcy5ldmVyeShlID0+ICF0b3AuaW5jbHVkZXMoZSkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHJlbGV2YW50TmFtZXMgPSAvKiBvciBjbGF1c2U/Pz8gKi9wZWVsZWQuZmxhdExpc3QoKS5mbGF0TWFwKHggPT4gW3gucHJlZGljYXRlPy5yb290LCB4LnByZWRpY2F0ZT8udG9rZW5dKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4IGFzIHN0cmluZylcblxuICAgICAgICBjb25zdCBjaGlsZHJlbjogVGhpbmdbXSA9IGFsbEtleXModGhpcy5vYmplY3QpXG4gICAgICAgICAgICAubWFwKHggPT4gKHsgbmFtZTogeCwgb2JqOiB0aGlzLmdldCh4KT8udW53cmFwKCkgfSkpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcmVsZXZhbnROYW1lcy5pbmNsdWRlcyh4Lm5hbWUpKSAvLyBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgub2JqICE9PSB0aGlzLm9iamVjdClcbiAgICAgICAgICAgIC5tYXAoeCA9PiBuZXcgQmFzZVRoaW5nKHgub2JqLCBgJHt0aGlzLmlkfS4ke3gubmFtZX1gLCB0aGlzLCB4Lm5hbWUpKVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IGNoaWxkcmVuLmZsYXRNYXAoeCA9PiB4LnF1ZXJ5KHBlZWxlZCwgeyBbdG9wWzBdXTogdGhpcy5pZCB9KSlcbiAgICAgICAgcmV0dXJuIHJlc1xuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGdldE5lc3RlZChvYmplY3Q6IGFueSwgcGF0aDogc3RyaW5nW10pIHtcblxuICAgIGlmICghb2JqZWN0W3BhdGhbMF1dKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBsZXQgeCA9IHdyYXAoeyBvYmplY3Q6IG9iamVjdFtwYXRoWzBdXSwgaWQ6IGdldEluY3JlbWVudGFsSWQoKSwgcGFyZW50OiBvYmplY3QsIG5hbWU6IHBhdGhbMF0gfSlcblxuICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY29uc3QgeSA9IHgudW53cmFwKClbcF1cbiAgICAgICAgeCA9IHdyYXAoeyBvYmplY3Q6IHksIGlkOiBnZXRJbmNyZW1lbnRhbElkKCksIHBhcmVudDogeCwgbmFtZTogcCB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4geFxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlR2V0dGVyKHBhdGg6IHN0cmluZ1tdKSB7XG5cbiAgICBmdW5jdGlvbiBmKHRoaXM6IGFueSkge1xuICAgICAgICByZXR1cm4gZ2V0TmVzdGVkKHRoaXMsIHBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgSGVpcmxvb20gfSBmcm9tIFwiLi9IZWlybG9vbVwiXG5pbXBvcnQgQmFzZVRoaW5nIGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBUaGluZyB7XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgcGFyZW50TWFwPzogTWFwKTogTWFwW11cbiAgICBnZXQoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWRcbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogVGhpbmdcbiAgICB1bndyYXAoKTogYW55XG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICBnZXRMZXhlbWVzKCk6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgcmVhZG9ubHkgcGFyZW50PzogVGhpbmdcblxuICAgIHNldEFsaWFzKGFsaWFzOiBzdHJpbmcsIHBhdGg6IHN0cmluZ1tdKTogdm9pZFxuICAgIGdldEhlaXJsb29tcygpOiBIZWlybG9vbVtdXG4gICAgZ2V0Q29uY2VwdHMoKTogc3RyaW5nW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFRoaW5nW11cbiAgICBjb250ZXh0PzogQ29udGV4dFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBpZD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGFyZ3M6IFdyYXBBcmdzKTogVGhpbmcge1xuICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKGFyZ3Mub2JqZWN0ID8/IHt9LCBhcmdzLmlkLCBhcmdzLnBhcmVudCwgYXJncy5uYW1lKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyYXBBcmdzIHtcbiAgICBpZDogSWQsXG4gICAgb2JqZWN0PzogT2JqZWN0LFxuICAgIHBhcmVudD86IFRoaW5nLFxuICAgIG5hbWU/OiBzdHJpbmdcbn1cbiIsImltcG9ydCB7IHNldE5lc3RlZCB9IGZyb20gXCIuLi8uLi91dGlscy9zZXROZXN0ZWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VTZXR0ZXIocGF0aDogc3RyaW5nW10pIHtcblxuICAgIGZ1bmN0aW9uIGYodGhpczogdW5rbm93biwgdmFsdWU6IGFueSkge1xuICAgICAgICBzZXROZXN0ZWQodGhpcywgcGF0aCwgdmFsdWUpXG4gICAgfVxuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsICduYW1lJywgeyB2YWx1ZTogYHNldF8ke2FsaWFzfWAsIHdyaXRhYmxlOiB0cnVlIH0pO1xuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsICduYW1lJywgeyB2YWx1ZTogYWxpYXMsIHdyaXRhYmxlOiB0cnVlIH0pO1xuXG5cbiAgICByZXR1cm4gZlxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2Yobzogb2JqZWN0KTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZCB7XG5cbiAgICBzd2l0Y2ggKHR5cGVvZiBvKSB7XG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiBvLmxlbmd0aCA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIHJldHVybiAnYWRqZWN0aXZlJ1xuICAgICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29udHJhY3Rpb24nLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICdpdmVyYicsXG4gICdtdmVyYicsXG4gICduZWdhdGlvbicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ2ZpbGxlcicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAvLyAnYW55J1xuKVxuIiwiaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi9iYWNrZW5kL3dyYXBwZXIvVGhpbmdcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuY29uc3QgYmVpbmc6IExleGVtZSA9IG1ha2VMZXhlbWUoe1xuICAgIHJvb3Q6ICdiZScsXG4gICAgdHlwZTogJ2NvcHVsYScsXG59KVxuXG5jb25zdCBkb2luZzogUGFydGlhbDxMZXhlbWU+ID0ge1xuICAgIHJvb3Q6ICdkbycsXG4gICAgdHlwZTogJ2h2ZXJiJyxcbn1cblxuY29uc3Qgbm90OiBMZXhlbWUgPSBtYWtlTGV4ZW1lKHtcbiAgICByb290OiAnbm90JyxcbiAgICB0eXBlOiAnbmVnYXRpb24nLFxufSlcblxuXG4vL1RPRE86IHB1dCBiYWNrIGluIHByZWx1ZGUhXG5jb25zdCBidXR0b25UaGluZyA9IHdyYXAoeyBpZDogJ2J1dHRvbicsIG9iamVjdDogSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlIH0pXG5idXR0b25UaGluZy5zZXRBbGlhcygnY29sb3InLCBbJ3N0eWxlJywgJ2JhY2tncm91bmQnXSlcbmJ1dHRvblRoaW5nLnNldEFsaWFzKCd0ZXh0JywgWyd0ZXh0Q29udGVudCddKVxuY29uc3QgZGl2VGhpbmcgPSB3cmFwKHsgaWQ6ICdkaXYnLCBvYmplY3Q6IEhUTUxEaXZFbGVtZW50LnByb3RvdHlwZSB9KVxuZGl2VGhpbmcuc2V0QWxpYXMoJ2NvbG9yJywgWydzdHlsZScsICdiYWNrZ3JvdW5kJ10pXG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiAoUGFydGlhbDxMZXhlbWU+IHwgTGV4ZW1lKVtdID0gW1xuXG4gICAgYmVpbmcsXG4gICAgZG9pbmcsXG4gICAgbm90LFxuXG4gICAgeyBfcm9vdDogYmVpbmcsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuICAgIHsgX3Jvb3Q6IGJlaW5nLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicgfSwgLy9UT0RPISAyK1xuICAgIHsgX3Jvb3Q6IGRvaW5nLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICdmaWxsZXInIC8vIGZpbGxlciB3b3JkLCB3aGF0IGFib3V0IHBhcnRpYWwgcGFyc2luZz9cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3B0aW9uYWwnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcxfDAnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uZS1vci1tb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnemVyby1vci1tb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3InLFxuICAgICAgICB0eXBlOiAnZGlzanVuYydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29iamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogW2JlaW5nLCBub3RdXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25kaXRpb24nLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25zZXF1ZW5jZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoaW5nJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICByZWZlcmVudDogd3JhcCh7IGlkOiAndGhpbmcnLCBvYmplY3Q6IHt9IH0pXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHJlZmVyZW50OiBidXR0b25UaGluZ1xuICAgIH0sXG4gICAge1xuICAgICAgICByb290OiAnZGl2JyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICByZWZlcmVudDogZGl2VGhpbmdcbiAgICB9LFxuXG5cbiAgICAvL1RPRE86IHB1dCBiYWNrIGluIHByZWx1ZGUhXG4gICAgeyByb290OiAnYScsIHR5cGU6ICdpbmRlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICdhbicsIHR5cGU6ICdpbmRlZmFydCcgfSxcbiAgICB7IHJvb3Q6ICd0aGUnLCB0eXBlOiAnZGVmYXJ0JyB9LFxuICAgIHsgcm9vdDogJ2lmJywgdHlwZTogJ3N1YmNvbmonIH0sXG4gICAgeyByb290OiAnd2hlbicsIHR5cGU6ICdzdWJjb25qJyB9LFxuICAgIHsgcm9vdDogJ2FueScsIHR5cGU6ICd1bmlxdWFudCcgfSxcbiAgICB7IHJvb3Q6ICdldmVyeScsIHR5cGU6ICd1bmlxdWFudCcgfSxcbiAgICB7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicgfSxcbiAgICB7IHJvb3Q6ICd0aGF0JywgdHlwZTogJ3JlbHByb24nIH0sXG4gICAgeyByb290OiAnaXQnLCB0eXBlOiAncHJvbm91bicgfSxcblxuXVxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZ1tdID0gW1xuXG4gICAgICAvLyBncmFtbWFyXG4gICAgICAncXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50JyxcbiAgICAgICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG9iamVjdCBub3VuLXBocmFzZScsXG5cbiAgICAgIGBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlYCxcblxuICAgICAgYG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgYWRqZWN0aXZlcyBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3IgZ3JhbW1hclxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHMgYCxcblxuICAgICAgJ2NvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlJyxcbiAgICAgICdtdmVyYnN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gbXZlcmIgdGhlbiBvYmplY3Qgbm91bi1waHJhc2UuJyxcbiAgICAgICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlIG9yIG12ZXJic3ViY2xhdXNlJyxcblxuICAgICAgYGFuZC1zZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lLW9yLW1vcmUgcmlnaHQgYW5kLXNlbnRlbmNlIG9yIGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZWAsXG5cbiAgICAgIGBtdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBtdmVyYlxuXHRcdHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgICBgaXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gaXZlcmJgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgICAgIGBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIGl2ZXJiLXNlbnRlbmNlIG9yIG12ZXJiLXNlbnRlbmNlYCxcblxuICAgICAgYGNzMiBpcyBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VcbiAgICAgIHRoZW4gc3ViY29ualxuICAgICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlYCxcblxuICAgICAgYGNzMSBpcyBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICB0aGVuIGZpbGxlciBcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgICAgIC8vIGRvbWFpblxuICAgICAgJ2NvbG9yIGlzIGEgdGhpbmcnLFxuICAgICAgJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFuZCBwdXJwbGUgYXJlIGNvbG9ycycsXG5cbiAgICAgIC8vICdjb2xvciBvZiBhIGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgICAgIC8vICdjb2xvciBvZiBhIGRpdiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgICAgIC8vICd0ZXh0IG9mIGEgYnV0dG9uIGlzIHRleHRDb250ZW50IG9mIGl0Jyxcbl0iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gY29uc3RpdHVlbnRUeXBlcy5jb25jYXQoKVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWydmaWxsZXInXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZTogWydncmFtbWFyJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnZGlzanVuYyddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG59IiwiLy8gaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3dyYXBwZXIvVGhpbmdcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2V2YWxBc3RcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IHBvaW50T3V0IH0gZnJvbSBcIi4vcG9pbnRPdXRcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICAvLyByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKClcbiAgICApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTnVtYmVyLnByb3RvdHlwZSwgJ2FkZCcsIHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiBmdW5jdGlvbiAoYTogYW55KSB7IHJldHVybiB0aGlzICsgYSB9IH0pXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnByZWx1ZGUuZm9yRWFjaChjID0+IHRoaXMuZXhlY3V0ZShjKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW10ge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QpLnNpbXBsZVxuICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpKVxuXG4gICAgICAgICAgICAvLyBpZiAoY2xhdXNlLmhhc1NpZGVFZmZlY3RzKSB7XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIHRoaXMuYWN0dWF0b3IudGFrZUFjdGlvbihjbGF1c2UsIHRoaXMuY29udGV4dClcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zdCB3cmFwcGVycyA9IG1hcHMuZmxhdE1hcChtPT5PYmplY3QudmFsdWVzKG0pKS5tYXAoaWQ9PnRoaXMuY29udGV4dC5nZXQoaWQpKVxuICAgICAgICAgICAgLy8gICAgIC8vIGNvbnN0IHdyYXBwZXJzID0gY2xhdXNlLmVudGl0aWVzLmZsYXRNYXAoaWQgPT4gZ2V0S29vbCh0aGlzLmNvbnRleHQsIGNsYXVzZSwgaWQpKVxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY29udGV4dC52YWx1ZXMuZm9yRWFjaCh3ID0+IHBvaW50T3V0KHcsIHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgIC8vICAgICB3cmFwcGVycy5mb3JFYWNoKHcgPT4gdyA/IHBvaW50T3V0KHcpIDogMClcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gd3JhcHBlcnNcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShuYXRsYW5nKS5tYXAoeCA9PiB4Py51bndyYXA/LigpID8/IHgpXG4gICAgfVxuXG59IiwiaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3dyYXBwZXIvVGhpbmdcIlxuaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXVxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQ29udGV4dCBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2VcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3ludGF4TWFwID0gdGhpcy5jb25maWcuc3ludGF4ZXNcbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgcHJvdGVjdGVkIF9sZXhlbWVzID0gdGhpcy5jb25maWcubGV4ZW1lc1xuICAgIHJlYWRvbmx5IHByZWx1ZGUgPSB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgIHJlYWRvbmx5IHNldCA9IHRoaXMuZW52aXJvLnNldFxuICAgIHJlYWRvbmx5IHF1ZXJ5ID0gdGhpcy5lbnZpcm8ucXVlcnlcbiAgICByZWFkb25seSByb290ID0gdGhpcy5lbnZpcm8ucm9vdFxuICAgIHJlYWRvbmx5IGdldCA9IHRoaXMuZW52aXJvLmdldFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvOiBFbnZpcm8sIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby52YWx1ZXNcbiAgICB9XG5cbiAgICBnZXRMZXhlbWUgPSAocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICAgICAgICAgIC5hdCgwKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0IHN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bnRheExpc3RcbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHR5cGU6ICdncmFtbWFyJywgcm9vdDogc3ludGF4Lm5hbWUgfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGlmIChsZXhlbWUucm9vdCAmJiAhbGV4ZW1lLnRva2VuICYmIHRoaXMuX2xleGVtZXMuc29tZSh4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpKSB7XG4gICAgICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKGxleGVtZSlcbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKC4uLmxleGVtZS5leHRyYXBvbGF0ZSh0aGlzKSlcbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUsIGxleGVtZVR5cGVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3ByZWx1ZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBzeW50YXhlczogU3ludGF4TWFwXG4gICAgcmVhZG9ubHkgcHJlbHVkZTogc3RyaW5nW11cbiAgICByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzOiBsZXhlbWVzLmZsYXRNYXAoeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsID0gbWFrZUxleGVtZSh4KVxuICAgICAgICAgICAgcmV0dXJuIFtsLCAuLi5sLmV4dHJhcG9sYXRlKCldXG4gICAgICAgIH0pLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IEJhc2ljQ29udGV4dCBmcm9tIFwiLi9CYXNpY0NvbnRleHRcIjtcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBFbnZpcm8ge1xuXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldExleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkXG5cbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRPcHRzIGV4dGVuZHMgR2V0RW52aXJvT3BzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3Q29udGV4dChvcHRzOiBHZXRDb250ZXh0T3B0cyk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KGdldEVudmlybyhvcHRzKSwgZ2V0Q29uZmlnKCkpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUxleGVtZSBpbXBsZW1lbnRzIExleGVtZSB7XG5cbiAgICBfcm9vdCA9IHRoaXMubmV3RGF0YT8uX3Jvb3RcbiAgICByZWFkb25seSByb290ID0gdGhpcy5uZXdEYXRhPy5yb290ID8/IHRoaXMuX3Jvb3Q/LnJvb3QhXG4gICAgcmVhZG9ubHkgdHlwZSA9IHRoaXMubmV3RGF0YT8udHlwZSA/PyB0aGlzLl9yb290Py50eXBlIVxuICAgIGNvbnRyYWN0aW9uRm9yID0gdGhpcy5uZXdEYXRhPy5jb250cmFjdGlvbkZvciA/PyB0aGlzLl9yb290Py5jb250cmFjdGlvbkZvclxuICAgIHRva2VuID0gdGhpcy5uZXdEYXRhPy50b2tlbiA/PyB0aGlzLl9yb290Py50b2tlblxuICAgIGNhcmRpbmFsaXR5ID0gdGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSA/PyB0aGlzLl9yb290Py5jYXJkaW5hbGl0eVxuICAgIHJlYWRvbmx5IGlzVmVyYiA9IHRoaXMudHlwZSA9PT0gJ212ZXJiJyB8fCB0aGlzLnR5cGUgPT09ICdpdmVyYidcbiAgICByZWFkb25seSBpc1BsdXJhbCA9IGlzUmVwZWF0YWJsZSh0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5KVxuICAgIHJlYWRvbmx5IHJlZmVyZW50ID0gdGhpcy5uZXdEYXRhPy5yZWZlcmVudCA/PyB0aGlzLl9yb290Py5yZWZlcmVudFxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG5ld0RhdGE/OiBQYXJ0aWFsPExleGVtZT5cbiAgICApIHsgfVxuXG4gICAgZXh0cmFwb2xhdGUoY29udGV4dD86IENvbnRleHQpOiBMZXhlbWVbXSB7XG5cbiAgICAgICAgaWYgKCh0aGlzLnR5cGUgPT09ICdub3VuJyB8fCB0aGlzLnR5cGUgPT09ICdncmFtbWFyJykgJiYgIXRoaXMuaXNQbHVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogcGx1cmFsaXplKHRoaXMucm9vdCksIGNhcmRpbmFsaXR5OiAnKicgfSldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZlcmIpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25qdWdhdGUodGhpcy5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiB4IH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG59IiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgZHluYW1pY0xleGVtZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXIgPSAwXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICBzb3VyY2VDb2RlXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSB3b3Jkcy5mbGF0TWFwKHcgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGV4ID0gY29udGV4dC5nZXRMZXhlbWUodykgPz8gZHluYW1pY0xleGVtZSh3LCBjb250ZXh0LCB3b3JkcylcbiAgICAgICAgICAgIHJldHVybiBsZXguY29udHJhY3Rpb25Gb3IgPz8gW2xleF1cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHkgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNlTGV4ZW1lIGZyb20gXCIuL0Jhc2VMZXhlbWVcIlxuaW1wb3J0IFRoaW5nIGZyb20gXCIuLi8uLi9iYWNrZW5kL3dyYXBwZXIvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovICByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gIHR5cGU6IExleGVtZVR5cGVcbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqLyB0b2tlbj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gIGNvbnRyYWN0aW9uRm9yPzogTGV4ZW1lW11cbiAgICAvKipmb3IgcXVhbnRhZGogKi8gY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxuICAgIF9yb290PzogUGFydGlhbDxMZXhlbWU+XG4gICAgZXh0cmFwb2xhdGUoY29udGV4dD86IENvbnRleHQpOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IGlzUGx1cmFsOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNWZXJiOiBib29sZWFuXG5cbiAgICByZWZlcmVudD86IFRoaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IFBhcnRpYWw8TGV4ZW1lPiB8IExleGVtZSk6IExleGVtZSB7XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIEJhc2VMZXhlbWUpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEJhc2VMZXhlbWUoZGF0YSlcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNMZXhlbWUod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWUge1xuXG4gICAgY29uc3QgcmVsZXZhbnQgPSB3b3Jkc1xuICAgICAgICAubWFwKHcgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHcsIHR5cGU6ICdub3VuJyB9KSwgJ1gnKSlcbiAgICAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LnF1ZXJ5KGMpKVxuICAgICAgICAuZmxhdE1hcChtID0+IE9iamVjdC52YWx1ZXMobSkpXG4gICAgICAgIC5mbGF0TWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSA/PyBbXSlcbiAgICAgICAgLmZsYXRNYXAoeCA9PiB4LmdldExleGVtZXMoKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgudG9rZW4gPT09IHdvcmQgfHwgeC5yb290ID09PSB3b3JkKVxuXG4gICAgY29uc3QgaXNNYWNyb0NvbnRleHQgPVxuICAgICAgICB3b3Jkcy5zb21lKHggPT4gY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgPT09ICdncmFtbWFyJylcbiAgICAgICAgJiYgIXdvcmRzLnNvbWUoeCA9PiBbJ2RlZmFydCcsICdpbmRlZmFydCcsICdub25zdWJjb25qJ10uaW5jbHVkZXMoY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgYXMgYW55KSkvL1RPRE86IHdoeSBkZXBlbmRlbmNpZXMoJ21hY3JvJykgZG9lc24ndCB3b3JrPyFcblxuICAgIGNvbnN0IHR5cGUgPSByZWxldmFudFswXT8udHlwZSA/P1xuICAgICAgICAoaXNNYWNyb0NvbnRleHQgP1xuICAgICAgICAgICAgJ2dyYW1tYXInXG4gICAgICAgICAgICA6ICdub3VuJylcblxuICAgIHJldHVybiBtYWtlTGV4ZW1lKHsgdG9rZW46IHdvcmQsIHJvb3Q6IHJlbGV2YW50Py5hdCgwKT8ucm9vdCA/PyB3b3JkLCB0eXBlOiB0eXBlIH0pXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoYXN0OiBBc3ROb2RlKTogQXN0Tm9kZSB7XG5cbiAgICAgICAgaWYgKCFhc3QubGlua3MpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGUpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4uLy4uL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGVVbndyYXBwZWQodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICAgICAgICAgIG1haW4oKVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcykpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNsYXVzZTEuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllc1xuICAgIH1cblxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGFib3V0ID0gKGlkOiBJZCk6IENsYXVzZSA9PiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lcnNPZihpZCkpXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gdGhpcy5jbGF1c2UxLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLmRlc2NyaWJlKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhYm91dCA9IChpZDogSWQpID0+IHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICBkZXNjcmliZSA9IChpZDogSWQpID0+IHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEF0b21DbGF1c2UgfSBmcm9tIFwiLi9BdG9tQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEFuIHVuYW1iaWd1b3VzIHByZWRpY2F0ZS1sb2dpYy1saWtlIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvblxuICogb2YgdGhlIHByb2dyYW1tZXIncyBpbnRlbnQuXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBzaW1wbGU6IENsYXVzZVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW11cblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXNcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBzdWJqY29uaj86IExleGVtZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgSW1wbHkoXG4gICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIG9wdHM/LnN1Ympjb25qID8/IHRoaXMuc3ViamNvbmosXG4gICAgKVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZXJzT2YoaWQpKVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCkgPT4gdGhpcy5jb25zZXF1ZW5jZS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICBhYm91dCA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHsvLyBUT0RPXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7XG4gICAgICAgICAgICBjbGF1c2UxOiB0aGlzLmNvbmRpdGlvbi5zaW1wbGUsXG4gICAgICAgICAgICBjbGF1c2UyOiB0aGlzLmNvbnNlcXVlbmNlLnNpbXBsZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy5jb25kaXRpb24uZW50aXRpZXMuY29uY2F0KHRoaXMuY29uc2VxdWVuY2UuZW50aXRpZXMpKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKTogSWRbXSB7XG5cbiAgICBjb25zdCBvd25lZEVudGl0aWVzID0gY2xhdXNlLm93bmVkQnkoZW50aXR5KVxuXG4gICAgcmV0dXJuIG93bmVkRW50aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgW2VudGl0eV0gOlxuICAgICAgICBbZW50aXR5XS5jb25jYXQoZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBvd25lZEVudGl0aWVzWzBdKSlcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJ0RWZmZWN0KGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoe1xuICAgICAgICBjbGF1c2UxOiBjbGF1c2UudGhlbWUuc2ltcGxlLFxuICAgICAgICBjbGF1c2UyOiBjbGF1c2UucmhlbWUuc2ltcGxlLmNvcHkoeyBuZWdhdGU6IHRydWUgfSlcbiAgICB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5pbXBvcnQgeyB0b0NvbnN0IH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy90b0NvbnN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBbGxWYXJzKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHsgLy8gY2FzZSBpbnNlbnNpdGl2ZSBuYW1lcywgaWYgb25lIHRpbWUgdmFyIGFsbCB2YXJzIVxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi9JbXBseVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbHkoY2xhdXNlOiBDbGF1c2UpIHsgLy8gYW55IGNsYXVzZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbHlcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5yaGVtZSA9PT0gZW1wdHlDbGF1c2UpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UuZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKVxuICAgICAgICB8fCBjbGF1c2UuZmxhdExpc3QoKS5zb21lKHggPT4gISF4LnByZWRpY2F0ZT8uaXNQbHVyYWwpKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2UudGhlbWUuaW1wbGllcyhjbGF1c2UucmhlbWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXVzZVxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvdG9WYXJcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZVZhcnNPd25lZChjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7IC8vIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyIHNob3VsZCBiZSBhbHNvIGJlIGEgdmFyXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiBjbGF1c2Uub3duZWRCeShlKSlcbiAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUFuYXBob3JhKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UudGhlbWUucXVlcnkoY2xhdXNlLnJoZW1lKVswXVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSA/PyB7fSB9KVxuXG59XG4iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGludGVyc2VjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9pbnRlcnNlY3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpYWxJZHMgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuLyoqXG4gKiBGaW5kcyBwb3NzaWJsZSBNYXAtaW5ncyBmcm9tIHF1ZXJ5TGlzdCB0byB1bml2ZXJzZUxpc3RcbiAqIHtAbGluayBcImZpbGU6Ly8uLy4uLy4uLy4uLy4uLy4uL2RvY3Mvbm90ZXMvdW5pZmljYXRpb24tYWxnby5tZFwifVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29sdmVNYXBzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMSwgaSkgPT4ge1xuICAgICAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMiwgaikgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWwxLmxlbmd0aCAmJiBtbDIubGVuZ3RoICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZShtbDEsIG1sMilcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2ldID0gW11cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2pdID0gbWVyZ2VkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXMuZmxhdCgpLmZpbHRlcih4ID0+ICFpc0ltcG9zaWJsZSh4KSlcbn1cblxuZnVuY3Rpb24gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdW10ge1xuICAgIHJldHVybiBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB1bml2ZXJzZUxpc3QuZmxhdE1hcCh1ID0+IHUucXVlcnkocSkpXG4gICAgICAgIHJldHVybiByZXMubGVuZ3RoID8gcmVzIDogW21ha2VJbXBvc3NpYmxlKHEpXVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1sMTogTWFwW10sIG1sMjogTWFwW10pIHtcblxuICAgIGNvbnN0IG1lcmdlZDogTWFwW10gPSBbXVxuXG4gICAgbWwxLmZvckVhY2gobTEgPT4ge1xuICAgICAgICBtbDIuZm9yRWFjaChtMiA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtYXBzQWdyZWUobTEsIG0yKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4ubTEsIC4uLm0yIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXEobWVyZ2VkKVxufVxuXG5mdW5jdGlvbiBtYXBzQWdyZWUobTE6IE1hcCwgbTI6IE1hcCkge1xuICAgIGNvbnN0IGNvbW1vbktleXMgPSBpbnRlcnNlY3Rpb24oT2JqZWN0LmtleXMobTEpLCBPYmplY3Qua2V5cyhtMikpXG4gICAgcmV0dXJuIGNvbW1vbktleXMuZXZlcnkoayA9PiBtMVtrXSA9PT0gbTJba10pXG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvc3NpYmxlKHE6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIHEuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IFt4XTogU3BlY2lhbElkcy5JTVBPU1NJQkxFIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbn1cblxuZnVuY3Rpb24gaXNJbXBvc2libGUobWFwOiBNYXApIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtYXApLmluY2x1ZGVzKFNwZWNpYWxJZHMuSU1QT1NTSUJMRSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IG1ha2VBbGxWYXJzIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnNcIlxuaW1wb3J0IHsgbWFrZUltcGx5IH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUltcGx5XCJcbmltcG9ydCB7IGludmVydEVmZmVjdCB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL2ludmVydEVmZmVjdFwiXG5pbXBvcnQgeyBwcm9wYWdhdGVWYXJzT3duZWQgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWRcIlxuaW1wb3J0IHsgcmVzb2x2ZUFuYXBob3JhIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvcmVzb2x2ZUFuYXBob3JhXCJcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiXG5pbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuL2lkL2Z1bmN0aW9ucy90b1ZhclwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL2lkL0lkXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vY2xhdXNlcy9JbXBseVwiXG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2JhY2tlbmQvd3JhcHBlci9UaGluZ1wiXG5cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBldmFsQXN0KGNvbnRleHQ6IENvbnRleHQsIGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc29sZS5sb2coYXN0KVxuXG4gICAgbGV0IHJlc3VsdFxuICAgIGxldCByZWxcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJlc3VsdCA9IGVtcHR5Q2xhdXNlXG4gICAgfSBlbHNlIGlmIChhc3QubGV4ZW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IGV2YWxMZXhlbWUoY29udGV4dCwgYXN0LmxleGVtZSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saXN0KSB7XG4gICAgICAgIHJlc3VsdCA9IGV2YWxBc3RMaXN0KGNvbnRleHQsIGFzdC5saXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8ucmVscHJvbiAmJiBhc3QubGlua3MuY29wdWxhKSB7XG4gICAgICAgIHJlc3VsdCA9IGV2YWxDb3B1bGFTdWJDbGF1c2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8ucmVscHJvbiAmJiBhc3QubGlua3MubXZlcmIpIHtcbiAgICAgICAgcmVzdWx0ID0gZXZhbE12ZXJiU3ViQ2xhdXNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LmNvcHVsYSkge1xuICAgICAgICByZXN1bHQgPSBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5ub25zdWJjb25qKSB7XG4gICAgICAgIHJlc3VsdCA9IGV2YWxBbmRTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChyZWwgPSBhc3QubGlua3M/Lml2ZXJiPy5sZXhlbWUgfHwgYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lIHx8IGFzdC5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZSkge1xuICAgICAgICByZXN1bHQgPSBldmFsUmVsYXRpb24oY29udGV4dCwgYXN0LCByZWwsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmVzdWx0ID0gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZXZhbE5vdW5QaHJhc2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIGFkanVzdENsYXVzZShyZXN1bHQsICEhYXN0Py5saW5rcz8ubm9uc3ViY29uaiwgISFhc3Q/LmxpbmtzPy5uZWdhdGlvbilcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3Q/LnR5cGV9JyFgKVxuXG59XG5cbmZ1bmN0aW9uIGFkanVzdENsYXVzZShjbGF1c2U6IENsYXVzZSwgaGFzQW5kPzogYm9vbGVhbiwgaXNOZWdhdGVkPzogYm9vbGVhbik6IENsYXVzZSB7XG4gICAgY29uc3QgYzAgPSBoYXNBbmQgPyBjbGF1c2UgOiBtYWtlSW1wbHkoY2xhdXNlKVxuICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMoYzApXG4gICAgY29uc3QgYzIgPSByZXNvbHZlQW5hcGhvcmEoYzEpXG4gICAgY29uc3QgYzMgPSBwcm9wYWdhdGVWYXJzT3duZWQoYzIpXG4gICAgY29uc3QgYzQgPSBpc05lZ2F0ZWQgPyBpbnZlcnRFZmZlY3QoYzMpIDogYzNcbiAgICByZXR1cm4gYzRcbn1cblxuZnVuY3Rpb24gZXZhbExleGVtZShjb250ZXh0OiBDb250ZXh0LCBsZXhlbWU6IExleGVtZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG4gICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicgfHwgbGV4ZW1lLnR5cGUgPT09ICdhZGplY3RpdmUnIHx8IGxleGVtZS50eXBlID09PSAncHJvbm91bicgfHwgbGV4ZW1lLnR5cGUgPT09ICdncmFtbWFyJykge1xuICAgICAgICByZXR1cm4gY2xhdXNlT2YobGV4ZW1lLCAuLi5hcmdzPy5zdWJqZWN0ID8gW2FyZ3M/LnN1YmplY3RdIDogW10pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxufVxuXG5mdW5jdGlvbiBldmFsQXN0TGlzdChjb250ZXh0OiBDb250ZXh0LCBhc3RzOiBBc3ROb2RlW10sIGFyZ3M/OiBUb0NsYXVzZU9wdHMpIHtcbiAgICByZXR1cm4gYXN0cy5tYXAoYyA9PiBldmFsQXN0KGNvbnRleHQsIGMsIGFyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UpXG59XG5cbmZ1bmN0aW9uIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGNvcHVsYVNlbnRlbmNlPy5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICBjb25zdCBwcmVkaWNhdGUgPSBldmFsQXN0KGNvbnRleHQsIGNvcHVsYVNlbnRlbmNlPy5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuXG5cbiAgICBjb25zdCBtYXBzMSA9IGNvbnRleHQucXVlcnkoc3ViamVjdClcbiAgICBjb25zdCBtYXBzID0gIW1hcHMxLmxlbmd0aCA/IFt7fV0gOiBtYXBzMVxuICAgIGNvbnN0IGNsYXVzZSA9IHByZWRpY2F0ZS5mbGF0TGlzdCgpWzBdIC8vVE9ET09PT09PT09PT09PT09PT09PISEhIVxuXG4gICAgbWFwcy5mb3JFYWNoKG0gPT4geyAvLyBUT0RPOiBpbXBseSB2cyBzaW5nbGVcblxuICAgICAgICBjb25zdCBhcmd6ID0gY2xhdXNlLmFyZ3MhXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNsYXVzZS5wcmVkaWNhdGUhXG5cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3pcbiAgICAgICAgICAgIC5tYXAoaWQgPT4gbVtpZF0gPyBjb250ZXh0LmdldChtW2lkXSkhIDogY29udGV4dC5zZXQod3JhcCh7IGlkOiBnZXRJbmNyZW1lbnRhbElkKCkgfSkpKVxuXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhcmdzWzBdXG5cbiAgICAgICAgc3ViamVjdD8uc2V0KHByZWRpY2F0ZSwge1xuICAgICAgICAgICAgYXJnczogYXJncy5zbGljZSgxKSxcbiAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICBuZWdhdGVkOiBjbGF1c2UubmVnYXRlZFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmICghcHJlZGljYXRlLnJlZmVyZW50ICYmIHByZWRpY2F0ZS50eXBlID09PSAnbm91bicpIHsgLy8gcmVmZXJlbnQgb2YgXCJwcm9wZXIgbm91blwiIGlzIGZpcnN0IHRvIGdldCBpdCBcbiAgICAgICAgICAgIHByZWRpY2F0ZS5yZWZlcmVudCA/Pz0gc3ViamVjdFxuICAgICAgICAgICAgY29udGV4dC5zZXRMZXhlbWUocHJlZGljYXRlKVxuICAgICAgICB9XG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxDb3B1bGFTdWJDbGF1c2UoY29udGV4dDogQ29udGV4dCwgY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuICAgIHJldHVybiBldmFsQXN0KGNvbnRleHQsIHByZWRpY2F0ZSwgYXJncylcbn1cblxuZnVuY3Rpb24gZXZhbE12ZXJiU3ViQ2xhdXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cykvKiA6Q2xhdXNlICovIHtcblxuICAgIGNvbnN0IG12ZXJiID0gYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lIVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb2JqZWN0SWQgPSBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBvYmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8ub2JqZWN0LCB7IHN1YmplY3Q6IG9iamVjdElkIH0pIC8vIFxuXG4gICAgcmV0dXJuIG9iamVjdC5hbmQoY2xhdXNlT2YobXZlcmIsIHN1YmplY3RJZCwgb2JqZWN0SWQpKVxuXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIG5vdW5QaHJhc2U6IEFzdE5vZGUsIG9wdHM/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbWF5YmVJZCA9IG9wdHM/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZT8ubGlua3M/LnVuaXF1YW50ID8gdG9WYXIobWF5YmVJZCkgOiBtYXliZUlkXG4gICAgY29uc3QgYXJncyA9IHsgc3ViamVjdDogc3ViamVjdElkIH1cblxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG5vdW5QaHJhc2UubGlua3MgPz8ge30pXG4gICAgICAgIC5tYXAoeCA9PiBldmFsQXN0KGNvbnRleHQsIHgsIGFyZ3MpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxufVxuXG5mdW5jdGlvbiBldmFsUmVsYXRpb24oY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCByZWw6IExleGVtZSwgb3B0cz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG5cbiAgICBjb25zdCBzdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViaklkIH0pXG4gICAgY29uc3Qgb2JqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmpJZCB9KVxuXG4gICAgY29uc3QgYXJncyA9IG9iamVjdCA9PT0gZW1wdHlDbGF1c2UgPyBbc3ViaklkXSA6IFtzdWJqSWQsIG9iaklkXVxuICAgIGNvbnN0IHJlbGF0aW9uID0gY2xhdXNlT2YocmVsLCAuLi5hcmdzKVxuICAgIGNvbnN0IHJlbGF0aW9uSXNSaGVtZSA9IHN1YmplY3QgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICByZXR1cm4gc3ViamVjdFxuICAgICAgICAuYW5kKG9iamVjdClcbiAgICAgICAgLmFuZChyZWxhdGlvbiwgeyBhc1JoZW1lOiByZWxhdGlvbklzUmhlbWUgfSlcblxufVxuXG5mdW5jdGlvbiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJjb25qID0gYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWVcbiAgICBjb25zdCBjb25kaXRpb24gPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8uY29uZGl0aW9uLCBhcmdzKVxuICAgIGNvbnN0IGNvbnNlcXVlbmNlID0gZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3M/LmNvbnNlcXVlbmNlLCBhcmdzKVxuICAgIHJldHVybiBjb25kaXRpb24uaW1wbGllcyhjb25zZXF1ZW5jZSkuY29weSh7IHN1Ympjb25qOiBzdWJjb25qIH0pXG5cbn1cblxuZnVuY3Rpb24gZXZhbEFuZFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3M/LmxlZnQsIGFyZ3MpXG4gICAgY29uc3QgcmlnaHQgPSBldmFsQXN0KGNvbnRleHQsIGFzdD8ubGlua3M/LnJpZ2h0Py5saXN0Py5bMF0sIGFyZ3MpXG5cbiAgICBpZiAoYXN0LmxpbmtzPy5sZWZ0Py50eXBlID09PSBhc3QubGlua3M/LnJpZ2h0Py50eXBlKSB7XG4gICAgICAgIHJldHVybiBsZWZ0LmFuZChyaWdodClcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtID0geyBbcmlnaHQuZW50aXRpZXNbMF1dOiBsZWZ0LmVudGl0aWVzWzBdIH1cbiAgICAgICAgY29uc3QgdGhlbWUgPSBsZWZ0LnRoZW1lLmFuZChyaWdodC50aGVtZSlcbiAgICAgICAgY29uc3QgcmhlbWUgPSByaWdodC5yaGVtZS5hbmQocmlnaHQucmhlbWUuY29weSh7IG1hcDogbSB9KSlcbiAgICAgICAgcmV0dXJuIHRoZW1lLmFuZChyaGVtZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG4gICAgfVxuXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi90b1ZhclwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZXRJbmNyZW1lbnRhbElkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQob3B0cz86IEdldEluY3JlbWVudGFsSWRPcHRzKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZDtcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpO1xufVxuIiwiXG5cbmV4cG9ydCBmdW5jdGlvbiBhbGxLZXlzKG9iamVjdDogb2JqZWN0LCBpdGVyID0gNSkge1xuXG4gICAgbGV0IG9iaiA9IG9iamVjdFxuICAgIGxldCByZXM6IHN0cmluZ1tdID0gW11cblxuICAgIHdoaWxlIChvYmogJiYgaXRlcikge1xuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3Qua2V5cyhvYmopXVxuICAgICAgICByZXMgPSBbLi4ucmVzLCAuLi5PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopXVxuICAgICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKVxuICAgICAgICBpdGVyLS1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IHsgbmV3SW5zdGFuY2UgfSBmcm9tIFwiLi9uZXdJbnN0YW5jZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ29weShvYmplY3Q6IG9iamVjdCkge1xuXG4gICAgaWYgKCEob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gb2JqZWN0LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudFxuICAgICAgICByZXR1cm4gd3JhcHBlZFxuICAgIH0gY2F0Y2gge1xuICAgICAgICByZXR1cm4gbmV3SW5zdGFuY2Uob2JqZWN0KVxuICAgIH1cblxuICAgIC8vIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIC8vICAgICBjb25zdCB3cmFwcGVkID0gb2JqZWN0LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudFxuICAgIC8vICAgICB3cmFwcGVkLmlubmVySFRNTCA9IG9iamVjdC5pbm5lckhUTUxcbiAgICAvLyAgICAgcmV0dXJuIHdyYXBwZWRcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICAvLyByZXR1cm4geyAuLi5vYmplY3QgfVxuICAgIC8vICAgICByZXR1cm4geyBfX3Byb3RvX186IG9iamVjdCB9XG4gICAgLy8gfVxuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuL3VuaXFcIlxuXG4vKipcbiAqIEludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byBsaXN0cyBvZiBzdHJpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHhzOiBzdHJpbmdbXSwgeXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHVuaXEoeHMuZmlsdGVyKHggPT4geXMuaW5jbHVkZXMoeCkpXG4gICAgICAgIC5jb25jYXQoeXMuZmlsdGVyKHkgPT4geHMuaW5jbHVkZXMoeSkpKSlcbn1cbiIsImltcG9ydCB7IHRhZ05hbWVGcm9tUHJvdG8gfSBmcm9tIFwiLi90YWdOYW1lRnJvbVByb3RvXCJcblxuLyoqXG4gKiBcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhbiBvYmplY3QgKGV2ZW4gSFRNTEVsZW1lbnQpIGZyb20gYSBwcm90b3R5cGUuXG4gKiBJbiBjYXNlIGl0J3MgYSBudW1iZXIsIG5vIG5ldyBpbnN0YW5jZSBpcyBtYWRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV3SW5zdGFuY2UocHJvdG86IG9iamVjdCwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGlmIChwcm90byA9PT0gTnVtYmVyLnByb3RvdHlwZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChhcmdzWzBdKVxuICAgIH1cblxuICAgIHJldHVybiBwcm90byBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID9cbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSkgOlxuICAgICAgICBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoLi4uYXJncylcblxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNldE5lc3RlZChvYmplY3Q6IGFueSwgcGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgIGxldCB4ID0gb2JqZWN0XG5cbiAgICBwYXRoLnNsaWNlKDAsIC0xKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICB4ID0geFtwXVxuICAgIH0pXG5cbiAgICB4W3BhdGguYXQoLTEpIV0gPSB2YWx1ZVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCJcbi8qKlxuICogVHJ5IGdldHRpbmcgdGhlIG5hbWUgb2YgYW4gaHRtbCBlbGVtZW50IGZyb20gYSBwcm90b3R5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IHRhZ05hbWVGcm9tUHJvdG8gPSAoeDogb2JqZWN0KSA9PiB4LmNvbnN0cnVjdG9yLm5hbWVcbiAgICAucmVwbGFjZSgnSFRNTCcsICcnKVxuICAgIC5yZXBsYWNlKCdFbGVtZW50JywgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiIsIi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS4gRXF1YWxpdHkgYnkgSlNPTi5zdHJpbmdpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHNlcTogVFtdKTogVFtdIHtcbiAgICBsZXQgc2VlbiA9IHt9IGFzIGFueVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiaW1wb3J0IHsgdGVzdDEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MVwiXG5pbXBvcnQgeyB0ZXN0MTAgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTBcIlxuaW1wb3J0IHsgdGVzdDExIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDExXCJcbmltcG9ydCB7IHRlc3QxMiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxMlwiXG5pbXBvcnQgeyB0ZXN0MTMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTNcIlxuaW1wb3J0IHsgdGVzdDE0IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE0XCJcbmltcG9ydCB7IHRlc3QxNSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxNVwiXG5pbXBvcnQgeyB0ZXN0MTYgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTZcIlxuaW1wb3J0IHsgdGVzdDE3IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE3XCJcbmltcG9ydCB7IHRlc3QxOCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxOFwiXG5pbXBvcnQgeyB0ZXN0MTkgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTlcIlxuaW1wb3J0IHsgdGVzdDIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MlwiXG5pbXBvcnQgeyB0ZXN0MjAgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjBcIlxuaW1wb3J0IHsgdGVzdDIxIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIxXCJcbmltcG9ydCB7IHRlc3QyMiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyMlwiXG5pbXBvcnQgeyB0ZXN0MjMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjNcIlxuaW1wb3J0IHsgdGVzdDI0IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI0XCJcbmltcG9ydCB7IHRlc3QyNSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyNVwiXG5pbXBvcnQgeyB0ZXN0MjYgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjZcIlxuaW1wb3J0IHsgdGVzdDI3IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI3XCJcbmltcG9ydCB7IHRlc3QyOCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyOFwiXG5pbXBvcnQgeyB0ZXN0MjkgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjlcIlxuaW1wb3J0IHsgdGVzdDMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0M1wiXG5pbXBvcnQgeyB0ZXN0MzAgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzBcIlxuaW1wb3J0IHsgdGVzdDMxIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMxXCJcbmltcG9ydCB7IHRlc3QzMiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzMlwiXG5pbXBvcnQgeyB0ZXN0MzMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzNcIlxuaW1wb3J0IHsgdGVzdDM0IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM0XCJcbmltcG9ydCB7IHRlc3QzNSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzNVwiXG5pbXBvcnQgeyB0ZXN0MzYgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzZcIlxuaW1wb3J0IHsgdGVzdDM3IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM3XCJcbmltcG9ydCB7IHRlc3QzOCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzOFwiXG5pbXBvcnQgeyB0ZXN0NCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q0XCJcbmltcG9ydCB7IHRlc3Q1IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDVcIlxuaW1wb3J0IHsgdGVzdDYgfSBmcm9tIFwiLi90ZXN0cy90ZXN0NlwiXG5pbXBvcnQgeyB0ZXN0NyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q3XCJcbmltcG9ydCB7IHRlc3Q4IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDhcIlxuaW1wb3J0IHsgdGVzdDkgfSBmcm9tIFwiLi90ZXN0cy90ZXN0OVwiXG5pbXBvcnQgeyBjbGVhckRvbSB9IGZyb20gXCIuL3V0aWxzL2NsZWFyRG9tXCJcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSBcIi4vdXRpbHMvc2xlZXBcIlxuXG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMCxcbiAgICB0ZXN0MTEsXG4gICAgdGVzdDEyLFxuICAgIHRlc3QxMyxcbiAgICB0ZXN0MTQsXG4gICAgdGVzdDE1LFxuICAgIHRlc3QxNixcbiAgICB0ZXN0MTcsXG4gICAgdGVzdDE4LFxuICAgIC8vIHRlc3QxOSwgLy8gdXNlcyBpZlxuICAgIHRlc3QyMCxcbiAgICB0ZXN0MjEsXG4gICAgdGVzdDIyLFxuICAgIHRlc3QyMyxcbiAgICB0ZXN0MjQsXG4gICAgdGVzdDI1LFxuICAgIHRlc3QyNixcbiAgICB0ZXN0MjcsXG4gICAgdGVzdDI4LFxuICAgIHRlc3QyOSxcbiAgICAvLyB0ZXN0MzAsLy8gZHluYW1pY2FsbHkgZGVmaW5pbmcgYSBjb3B1bGFcbiAgICB0ZXN0MzEsXG4gICAgLy8gdGVzdDMyLFxuICAgIHRlc3QzMyxcbiAgICAvLyB0ZXN0MzQsLy8gZHluYW1pY2FsbHkgZGVmaW5pbmcgYW4gYWxpYXNcbiAgICB0ZXN0MzUsXG4gICAgLy8gdGVzdDM2LCAvLyBkeW5hbWljYWxseSBkZWZpbmluZyBhbiBtdmVyYlxuICAgIHRlc3QzNyxcbiAgICB0ZXN0MzgsXG5dXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0ZXN0KClcbiAgICAgICAgY29uc29sZS5sb2coYCVjJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnfSAke3Rlc3QubmFtZX1gLCBgY29sb3I6JHtzdWNjZXNzID8gJ2dyZWVuJyA6ICdyZWQnfWApXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwKS8vNzVcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibGFjayc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbic7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhbmQgdyBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3cgYW5kIHogYXJlIGJsYWNrJyk7XG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQ7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQ0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDQ7XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSBidXR0b25zJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhcHBlbmRDaGlsZHMgeScpO1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5jaGlsZHJlbikuaW5jbHVkZXMoYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdKTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICAvLyBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uIGFuZCB0aGUgYnV0dG9uIGlzIGdyZWVuJylcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiBpdCBpcyBncmVlbicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpO1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBub3QgcmVkLicpO1xuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG5cbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBldmVyeSBidXR0b24gaXMgYmx1ZS4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6IGlzIHJlZC4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJyk7XG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcblxuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGhpZGRlbicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uaGlkZGVuO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgbm90IGhpZGRlbicpO1xuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLmhpZGRlbjtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbicpO1xuICAgIGNvbnN0IHggPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF07XG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyByZWQnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGNsaWNrcycpO1xuICAgIHJldHVybiB4LnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTgoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIHJlZC4geCBpcyBhIGJ1dHRvbiBhbmQgeSBpcyBhIGRpdi4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSByZWQgYnV0dG9uIGlzIGJsYWNrJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2RpdicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG5cbn1cbiIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGNvbnN0IHYxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQudmFsdWVzLmxlbmd0aDtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyByZWQuJyk7XG4gICAgY29uc3QgdjIgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoO1xuICAgIHJldHVybiB2MiAtIHYxID09PSAxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uIGlmIHggaXMgcmVkJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gY29sb3Igb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSByZWQuIHggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgcmVkIGJ1dHRvbnMnKTtcbiAgICBsZXQgY2xpY2tzID0gJyc7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3gnO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd5JztcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBidXR0b24gY2xpY2tzJyk7XG4gICAgcmV0dXJuIGNsaWNrcyA9PT0gJ3h5Jztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIHJlZCBhbmQgeSBpcyBibHVlJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndGhlIGJ1dHRvbiB0aGF0IGlzIGJsdWUgaXMgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b25zIGFyZSByZWQnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkLiB6IGlzIGJsdWUuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgncmVkIGJ1dHRvbnMgYXJlIGJsYWNrJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmx1ZSc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2JsYWNrIGJ1dHRvbnMnKS5sZW5ndGggPT09IDI7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyOCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGJ1dHRvbicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2JvcmRlciBvZiBzdHlsZSBvZiB4IGlzIGRvdHRlZC15ZWxsb3cnKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYm9yZGVyLmluY2x1ZGVzKCdkb3R0ZWQgeWVsbG93Jyk7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyOSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIDEgYW5kIHkgaXMgMicpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYWRkcyB5Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2l0JylbMF0gPT09IDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBibGFjayBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0Mztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIGdyZWVuIGFuZCB5IGlzIHJlZC4nKTtcbiAgICBjb25zdCByZXMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdjb2xvciBvZiB0aGUgcmVkIGJ1dHRvbicpO1xuICAgIHJldHVybiByZXMuaW5jbHVkZXMoJ3JlZCcpICYmICFyZXMuaW5jbHVkZXMoJ2dyZWVuJyk7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgLy8gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBkaXYgYW5kIHRoZSB3aWR0aCBvZiBzdHlsZSBvZiB0aGUgZGl2IGlzIDUwdncnKVxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgZGl2LiB0aGUgd2lkdGggb2Ygc3R5bGUgb2YgaXQgaXMgNTB2dycpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgZGl2JylbMF0uc3R5bGUud2lkdGggPT09ICc1MHZ3Jztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzNSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3NvbWV0aGluZyBidXR0b24nKS5sZW5ndGggPT09IDA7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzOCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJyk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHkgaXMgZ3JlZW4nKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5Jyk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyBhbiB4Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYnV0dG9uJyk7XG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0aGUgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKVswXS50ZXh0Q29udGVudCA9PT0gJ2NhcHJhJztcbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uLiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9uJykubGVuZ3RoID09PSAwO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdncmVlbiBidXR0b24nKS5sZW5ndGggPT09IDE7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBjb25zdCB4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpXG4gICAgZG9jdW1lbnQuYm9keSA9IHhcbn0iLCJleHBvcnQgZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9