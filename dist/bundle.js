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

/***/ "./app/src/backend/actions/CreateLexemeAction.ts":
/*!*******************************************************!*\
  !*** ./app/src/backend/actions/CreateLexemeAction.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
class CreateLexemeAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b;
        if (!context.lexemeTypes.includes((_a = this.clause.predicate) === null || _a === void 0 ? void 0 : _a.root)) {
            return;
        }
        const name = this.topLevel.theme.describe(this.clause.args[0])[0].root; //TODO: could be undefined        
        const type = (_b = this.clause.predicate) === null || _b === void 0 ? void 0 : _b.root;
        const lexeme = (0, Lexeme_1.makeLexeme)({
            root: name,
            type,
        });
        context.setLexeme(lexeme);
    }
}
exports["default"] = CreateLexemeAction;


/***/ }),

/***/ "./app/src/backend/actions/IfAction.ts":
/*!*********************************************!*\
  !*** ./app/src/backend/actions/IfAction.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/backend/actions/getAction.ts");
class IfAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        if (context.query(this.clause.theme).length > 0) {
            this.clause.rheme.flatList().forEach(c => {
                (0, getAction_1.getAction)(c, this.clause.rheme).run(context);
            });
        }
    }
}
exports["default"] = IfAction;


/***/ }),

/***/ "./app/src/backend/actions/MultiAction.ts":
/*!************************************************!*\
  !*** ./app/src/backend/actions/MultiAction.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/backend/actions/getAction.ts");
class MultiAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        const maps = context.query(this.clause.theme); //.map(m => this.toMap(m))
        // console.log(this.clause.theme.toString())
        // console.log(this.clause.rheme.toString())
        // console.log('maps=', maps)
        maps.forEach(m => {
            const top = this.clause.copy({ map: m, exactIds: true });
            const conseq = top.rheme;
            const clauses = conseq.flatList();
            const actions = clauses.map(c => (0, getAction_1.getAction)(c, top));
            actions.forEach(a => a.run(context));
        });
    }
}
exports["default"] = MultiAction;


/***/ }),

/***/ "./app/src/backend/actions/SetAliasAction.ts":
/*!***************************************************!*\
  !*** ./app/src/backend/actions/SetAliasAction.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getOwnershipChain_1 = __webpack_require__(/*! ../../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../middle/clauses/functions/topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
class SetAliasAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        var _a;
        const condition = this.clause.theme;
        const consequence = this.clause.rheme;
        const top = (0, topLevel_1.getTopLevel)(condition)[0]; //TODO (!ASSUME!) same as top in conclusion
        const alias = (0, getOwnershipChain_1.getOwnershipChain)(condition, top).slice(1);
        const props = (0, getOwnershipChain_1.getOwnershipChain)(consequence, top).slice(1);
        const concept = alias.map(x => condition.describe(x)[0]); // assume at least one name
        const path = props.map(x => consequence.describe(x)[0]).map(x => x.root); // same ...
        const lexeme = condition.describe(top)[0]; // assume one 
        (_a = lexeme.referent) === null || _a === void 0 ? void 0 : _a.setAlias(concept[0].root, path);
    }
}
exports["default"] = SetAliasAction;


/***/ }),

/***/ "./app/src/backend/actions/SimpleAction.ts":
/*!*************************************************!*\
  !*** ./app/src/backend/actions/SimpleAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Wrapper_1 = __webpack_require__(/*! ../wrapper/Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
class SimpleAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b;
        var _c;
        if (!this.clause.args || !this.clause.predicate) {
            return;
        }
        const maps = context.query(this.topLevel.theme);
        const map = (_a = maps[0]) !== null && _a !== void 0 ? _a : {};
        const args = this.clause.args
            .map(id => map[id] ? context.get(map[id]) : context.set((0, Wrapper_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)() })));
        const subject = args[0];
        const res = subject === null || subject === void 0 ? void 0 : subject.set(this.clause.predicate, {
            args: args.slice(1),
            context,
            negated: this.clause.negated
        });
        if (!this.clause.predicate.referent && this.clause.predicate.type === 'noun') { // referent of "proper noun" is first to get it 
            (_b = (_c = this.clause.predicate).referent) !== null && _b !== void 0 ? _b : (_c.referent = subject);
            context.setLexeme(this.clause.predicate);
        }
        // if (res) {
        //     context.set({ wrapper: res, type: 2 })
        // }
        return res;
    }
}
exports["default"] = SimpleAction;


/***/ }),

/***/ "./app/src/backend/actions/WhenAction.ts":
/*!***********************************************!*\
  !*** ./app/src/backend/actions/WhenAction.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/backend/actions/getAction.ts");
class WhenAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        const interval = setInterval(() => {
            if (context.query(this.clause.theme).length > 0) {
                this.clause.rheme.flatList().forEach(c => {
                    (0, getAction_1.getAction)(c, this.clause.rheme).run(context);
                });
                clearInterval(interval);
            }
        }, 100);
    }
}
exports["default"] = WhenAction;


/***/ }),

/***/ "./app/src/backend/actions/getAction.ts":
/*!**********************************************!*\
  !*** ./app/src/backend/actions/getAction.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAction = void 0;
const SimpleAction_1 = __importDefault(__webpack_require__(/*! ./SimpleAction */ "./app/src/backend/actions/SimpleAction.ts"));
const SetAliasAction_1 = __importDefault(__webpack_require__(/*! ./SetAliasAction */ "./app/src/backend/actions/SetAliasAction.ts"));
const MultiAction_1 = __importDefault(__webpack_require__(/*! ./MultiAction */ "./app/src/backend/actions/MultiAction.ts"));
const IfAction_1 = __importDefault(__webpack_require__(/*! ./IfAction */ "./app/src/backend/actions/IfAction.ts"));
const WhenAction_1 = __importDefault(__webpack_require__(/*! ./WhenAction */ "./app/src/backend/actions/WhenAction.ts"));
const CreateLexemeAction_1 = __importDefault(__webpack_require__(/*! ./CreateLexemeAction */ "./app/src/backend/actions/CreateLexemeAction.ts"));
const Imply_1 = __importDefault(__webpack_require__(/*! ../../middle/clauses/Imply */ "./app/src/middle/clauses/Imply.ts"));
function getAction(clause, topLevel) {
    var _a, _b;
    if (clause instanceof Imply_1.default && clause.theme.entities.some(e => clause.theme.ownersOf(e).length) && clause.rheme.entities.some(e => clause.rheme.ownersOf(e).length)) {
        return new SetAliasAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default && ((_a = clause.subjconj) === null || _a === void 0 ? void 0 : _a.root) === 'if') {
        return new IfAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default && ((_b = clause.subjconj) === null || _b === void 0 ? void 0 : _b.root) === 'when') {
        return new WhenAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default) {
        return new MultiAction_1.default(clause);
    }
    if (topLevel.flatList().some(x => { var _a; return ((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'grammar'; })) {
        return new CreateLexemeAction_1.default(clause, topLevel);
    }
    return new SimpleAction_1.default(clause, topLevel);
}
exports.getAction = getAction;


/***/ }),

/***/ "./app/src/backend/actuator/Actuator.ts":
/*!**********************************************!*\
  !*** ./app/src/backend/actuator/Actuator.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActuator = void 0;
const BaseActuator_1 = __importDefault(__webpack_require__(/*! ./BaseActuator */ "./app/src/backend/actuator/BaseActuator.ts"));
function getActuator() {
    return new BaseActuator_1.default();
}
exports.getActuator = getActuator;


/***/ }),

/***/ "./app/src/backend/actuator/BaseActuator.ts":
/*!**************************************************!*\
  !*** ./app/src/backend/actuator/BaseActuator.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ../actions/getAction */ "./app/src/backend/actions/getAction.ts");
class BaseActuator {
    takeAction(clause, context) {
        const actions = clause.flatList().map(x => (0, getAction_1.getAction)(x, clause));
        return actions.flatMap(a => { var _a; return (_a = a.run(context)) !== null && _a !== void 0 ? _a : []; });
    }
}
exports["default"] = BaseActuator;


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

/***/ "./app/src/backend/wrapper/BaseWrapper.ts":
/*!************************************************!*\
  !*** ./app/src/backend/wrapper/BaseWrapper.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeGetter = void 0;
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Wrapper_1 = __webpack_require__(/*! ./Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
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
class BaseWrapper {
    constructor(object, id, parent, name, heirlooms = [], relations = []) {
        this.object = object;
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.heirlooms = heirlooms;
        this.relations = relations;
        this.is = (predicate) => 
        // this.predicates.map(x => x.root).includes(predicate.root)
        // this.getConcepts().includes(predicate.root) //TODO also from supers
        this.relations.filter(x => x.args.length === 0).map(x => x.predicate).map(x => x.root).includes(predicate.root);
        this.inherit = (value, opts) => {
            var _a, _b, _c;
            const copy = (_a = value.referent) === null || _a === void 0 ? void 0 : _a.copy({ id: this.id }).unwrap();
            if (!copy || value.referent === this || Object.getPrototypeOf(this.object) === Object.getPrototypeOf(copy) /* don't recreate */) {
                return;
            }
            this.object = copy;
            if (this.object instanceof HTMLElement) {
                this.object.id = this.id + '';
                (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.context) === null || _b === void 0 ? void 0 : _b.root) === null || _c === void 0 ? void 0 : _c.appendChild(this.object);
            }
            if (this.object instanceof HTMLElement && !this.object.children.length) {
                this.object.textContent = 'default';
            }
        };
        this.disinherit = (value, opts) => {
        };
        this.copy = (opts) => {
            var _a, _b;
            return new BaseWrapper((_a = opts === null || opts === void 0 ? void 0 : opts.object) !== null && _a !== void 0 ? _a : (0, deepCopy_1.deepCopy)(this.object), (_b = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _b !== void 0 ? _b : this.id);
        };
        this.dynamic = () => (0, allKeys_1.allKeys)(this.object).map(x => (0, Lexeme_1.makeLexeme)({
            type: (0, typeOf_1.typeOf)(this._get(x)),
            root: x
        }));
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
    set(predicate, opts) {
        var _a;
        const relation = { predicate, args: (_a = opts === null || opts === void 0 ? void 0 : opts.args) !== null && _a !== void 0 ? _a : [] };
        if (!(opts === null || opts === void 0 ? void 0 : opts.negated) && this.relations.filter(x => relationsEqual(x, relation)).length) {
            return this.reinterpret([], [], [relation], opts);
        }
        let added = [];
        let removed = [];
        let unchanged = this.relations.filter(x => !relationsEqual(x, relation));
        if (opts === null || opts === void 0 ? void 0 : opts.negated) {
            this.removeRelation(relation);
            removed = [relation];
        }
        else {
            added = [relation];
            removed.push(...this.getMutex(added));
            unchanged = unchanged.filter(x => !removed.some(r => relationsEqual(x, r)));
            this.addRelation(relation);
            removed.forEach(x => this.removeRelation(x));
        }
        // console.log('added=', added, 'removed=', removed, 'unchanged=', unchanged) 
        return this.reinterpret(added, removed, unchanged, opts);
    }
    getMutex(added) {
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
    reinterpret(added, removed, unchanged, opts) {
        removed.forEach(p => {
            this.doSideEffects(p.predicate, opts);
            this.removeHeirlooms(p.predicate);
        });
        added.forEach(p => {
            this.doSideEffects(p.predicate, opts);
            this.addHeirlooms(p.predicate);
        });
        unchanged.forEach(p => {
            this.doSideEffects(p.predicate, opts); //TODO! restore heirlooms
        });
        return undefined;
    }
    doSideEffects(predicate, opts) {
        var _a, _b, _c;
        const prop = this.canHaveA(predicate);
        if (predicate.isVerb) {
            return this.call(predicate, opts === null || opts === void 0 ? void 0 : opts.args); //TODO
        }
        else if (prop) { // has-a
            const val = typeof this._get(predicate.root) === 'boolean' ? !(opts === null || opts === void 0 ? void 0 : opts.negated) : !(opts === null || opts === void 0 ? void 0 : opts.negated) ? predicate.root : (opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(predicate) ? '' : this._get(prop);
            this.object[prop] = val;
        }
        else if (this.parent) { // child is-a, parent has-a
            const parent = (_c = (_b = (_a = this.parent).unwrap) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : this.parent;
            if (typeof this.object !== 'object')
                parent[this.name] = predicate.root; //TODO: negation
            // this.parent?.set(predicate, opts) // TODO: set predicate on parent? 
        }
        else { // is-a
            this.beA(predicate, opts);
        }
    }
    addHeirlooms(predicate) {
        var _a;
        (_a = predicate.referent) === null || _a === void 0 ? void 0 : _a.getHeirlooms().forEach(h => {
            Object.defineProperty(this.object, h.name, h);
        });
    }
    removeHeirlooms(predicate) {
        var _a;
        (_a = predicate.referent) === null || _a === void 0 ? void 0 : _a.getHeirlooms().forEach(h => {
            delete this.object[h.name];
        });
    }
    canHaveA(value) {
        var _a, _b;
        const concepts = [...(_b = (_a = value.referent) === null || _a === void 0 ? void 0 : _a.getConcepts()) !== null && _b !== void 0 ? _b : [], value.root];
        return concepts.find(x => this._get(x) !== undefined);
    }
    beA(value, opts) {
        (opts === null || opts === void 0 ? void 0 : opts.negated) ? this.disinherit(value, opts) : this.inherit(value, opts);
    }
    //-----------------------------------------------------------
    getConcepts() {
        return (0, uniq_1.uniq)(this.relations.filter(x => !x.args.length).map(x => x.predicate).flatMap(x => {
            var _a, _b;
            return x.referent === this ? [x.root] : (_b = (_a = x.referent) === null || _a === void 0 ? void 0 : _a.getConcepts()) !== null && _b !== void 0 ? _b : [];
        }));
    }
    refreshHeirlooms() {
        this.relations.map(x => x.predicate).forEach(p => {
            var _a;
            return (_a = p.referent) === null || _a === void 0 ? void 0 : _a.getHeirlooms().forEach(h => {
                Object.defineProperty(this.object, h.name, h);
            });
        });
    }
    getHeirlooms() {
        return this.heirlooms;
    }
    call(verb, args) {
        const method = this._get(verb.root);
        if (!method) {
            return;
        }
        const result = method.call(this.object, ...args.map(x => x.unwrap()));
        return (0, Wrapper_1.wrap)({ id: (0, getIncrementalId_1.getIncrementalId)(), object: result });
    }
    // --------------------------------------------------------------------
    ownerInfo(q) {
        const maps = this.query(q).map(m => Object.entries(m).map(e => ({ [e[0]]: e[1] })).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {}));
        const newClause = q.copy({ map: maps[0] });
        return (maps[0] && (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]).length > 1) ? newClause : Clause_1.emptyClause;
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
        const parts = id.split('.');
        const p1 = parts[0];
        const o = this.object[p1];
        const w = o instanceof BaseWrapper ? o : new BaseWrapper(o, `${this.id}.${p1}`, this, p1); //TODO:check id!
        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'));
        }
        return w;
    }
    _get(key) {
        var _a, _b, _c;
        try {
            this.refreshHeirlooms(); //TODO!
            const val = (_a = this.object) === null || _a === void 0 ? void 0 : _a[key];
            return (_c = (_b = val === null || val === void 0 ? void 0 : val.unwrap) === null || _b === void 0 ? void 0 : _b.call(val)) !== null && _c !== void 0 ? _c : val;
        }
        catch (_d) {
        }
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
            .map(x => ({ name: x, obj: this._get(x) }))
            .filter(x => relevantNames.includes(x.name)) // performance
            .filter(x => x.obj !== this.object)
            .map(x => new BaseWrapper(x.obj, `${this.id}.${x.name}`, this, x.name));
        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }));
        return res;
    }
}
exports["default"] = BaseWrapper;
function getNested(object, path) {
    if (!object[path[0]]) {
        return undefined;
    }
    let x = (0, Wrapper_1.wrap)({ object: object[path[0]], id: (0, getIncrementalId_1.getIncrementalId)(), parent: object, name: path[0] });
    path.slice(1).forEach(p => {
        const y = x.unwrap()[p];
        x = (0, Wrapper_1.wrap)({ object: y, id: (0, getIncrementalId_1.getIncrementalId)(), parent: x, name: p });
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

/***/ "./app/src/backend/wrapper/Wrapper.ts":
/*!********************************************!*\
  !*** ./app/src/backend/wrapper/Wrapper.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrap = void 0;
const BaseWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseWrapper */ "./app/src/backend/wrapper/BaseWrapper.ts"));
function wrap(args) {
    var _a;
    return new BaseWrapper_1.default((_a = args.object) !== null && _a !== void 0 ? _a : {}, args.id /* , args.preds ?? [] */, args.parent, args.name);
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
const Wrapper_1 = __webpack_require__(/*! ../backend/wrapper/Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
const being = {
    root: 'be',
    type: 'copula',
};
const doing = {
    root: 'do',
    type: 'hverb',
};
exports.lexemes = [
    being,
    doing,
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
        root: 'one or more',
        type: 'adjective',
        cardinality: '+'
    },
    {
        root: 'zero or more',
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
        contractionFor: ['is', 'not']
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
        referent: (0, Wrapper_1.wrap)({ id: 'thing', object: {} })
    },
    {
        root: 'button',
        type: 'noun',
        referent: (0, Wrapper_1.wrap)({ id: 'button', object: HTMLButtonElement.prototype })
    },
    {
        root: 'div',
        type: 'noun',
        referent: (0, Wrapper_1.wrap)({ id: 'div', object: HTMLDivElement.prototype })
    }
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
        then zero  or  more adjectives 
        then zero or more subject noun or pronoun or grammar
        then optional subclause 
        then zero or more complements `,
    'copulasubclause is relpron then copula then predicate noun-phrase',
    'mverbsubclause is relpron then mverb then object noun-phrase.',
    'subclause is copulasubclause or mverbsubclause',
    `and-sentence is left copula-sentence or noun-phrase 
        then nonsubconj
        then one or more right and-sentence or copula-sentence or noun-phrase`,
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
    `a and an are indefarts`,
    `the is a defart`,
    `if and when and while are subconjs`,
    `any and every and all are uniquants`,
    `of and on and to and from are prepositions`,
    `that is a relpron`,
    `not is a negation`,
    `it is a pronoun`,
    // domain
    'color is a thing',
    'red and blue and black and green and purple are colors',
    'color of any button is background of style of it',
    'color of any div is background of style of it',
    'text of any button is textContent of it',
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
const Actuator_1 = __webpack_require__(/*! ../../backend/actuator/Actuator */ "./app/src/backend/actuator/Actuator.ts");
const Parser_1 = __webpack_require__(/*! ../../frontend/parser/interfaces/Parser */ "./app/src/frontend/parser/interfaces/Parser.ts");
const toClause_1 = __webpack_require__(/*! ../../middle/toClause */ "./app/src/middle/toClause.ts");
const pointOut_1 = __webpack_require__(/*! ./pointOut */ "./app/src/facade/brain/pointOut.ts");
class BasicBrain {
    constructor(context, actuator = (0, Actuator_1.getActuator)()) {
        this.context = context;
        this.actuator = actuator;
        Object.defineProperty(Number.prototype, 'add', { writable: true, value: function (a) { return this + a; } });
        this.context.prelude.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
            if (ast.type === 'macro') {
                this.context.setSyntax(ast);
                return [];
            }
            const clause = (0, toClause_1.toClause)(ast).simple;
            // console.log(clause.toString())
            if (clause.isSideEffecty) {
                return this.actuator.takeAction(clause, this.context);
            }
            else {
                const maps = this.context.query(clause);
                const wrappers = maps.flatMap(m => Object.values(m)).map(id => this.context.get(id));
                // const wrappers = clause.entities.flatMap(id => getKool(this.context, clause, id))
                this.context.values.forEach(w => (0, pointOut_1.pointOut)(w, { turnOff: true }));
                wrappers.forEach(w => w ? (0, pointOut_1.pointOut)(w) : 0);
                return wrappers;
            }
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

/***/ "./app/src/facade/brain/pointOut.ts":
/*!******************************************!*\
  !*** ./app/src/facade/brain/pointOut.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pointOut = void 0;
function pointOut(wrapper, opts) {
    const object = wrapper.unwrap();
    if (object instanceof HTMLElement) {
        object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
    }
}
exports.pointOut = pointOut;


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
            return [l, ...l.extrapolate({})];
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
        this.isMultiWord = this.root.includes(' ');
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
const getLexemes_1 = __webpack_require__(/*! ./functions/getLexemes */ "./app/src/frontend/lexer/functions/getLexemes.ts");
const respace_1 = __webpack_require__(/*! ./functions/respace */ "./app/src/frontend/lexer/functions/respace.ts");
const stdspace_1 = __webpack_require__(/*! ./functions/stdspace */ "./app/src/frontend/lexer/functions/stdspace.ts");
const joinMultiWordLexemes_1 = __webpack_require__(/*! ./functions/joinMultiWordLexemes */ "./app/src/frontend/lexer/functions/joinMultiWordLexemes.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        this._pos = 0;
        const words = (0, joinMultiWordLexemes_1.joinMultiWordLexemes)((0, stdspace_1.stdspace)(sourceCode), context.lexemes)
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .map(s => (0, respace_1.respace)(s));
        this.tokens = words.flatMap(w => (0, getLexemes_1.getLexemes)(w, context, words));
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
        .flatMap(x => x === null || x === void 0 ? void 0 : x.dynamic().flatMap(x => [...x.extrapolate(context), x]))
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

/***/ "./app/src/frontend/lexer/functions/getLexemes.ts":
/*!********************************************************!*\
  !*** ./app/src/frontend/lexer/functions/getLexemes.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexemes = void 0;
const dynamicLexeme_1 = __webpack_require__(/*! ./dynamicLexeme */ "./app/src/frontend/lexer/functions/dynamicLexeme.ts");
function getLexemes(word, context, words) {
    var _a;
    const lex = (_a = context.getLexeme(word)) !== null && _a !== void 0 ? _a : (0, dynamicLexeme_1.dynamicLexeme)(word, context, words);
    return lex.contractionFor ?
        lex.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lex];
}
exports.getLexemes = getLexemes;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/joinMultiWordLexemes.ts":
/*!******************************************************************!*\
  !*** ./app/src/frontend/lexer/functions/joinMultiWordLexemes.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.joinMultiWordLexemes = void 0;
const stdspace_1 = __webpack_require__(/*! ./stdspace */ "./app/src/frontend/lexer/functions/stdspace.ts");
const unspace_1 = __webpack_require__(/*! ./unspace */ "./app/src/frontend/lexer/functions/unspace.ts");
function joinMultiWordLexemes(sourceCode, lexemes) {
    let newSource = sourceCode;
    lexemes
        .filter(x => x.isMultiWord)
        .forEach(x => {
        const lexeme = (0, stdspace_1.stdspace)(x.root);
        newSource = newSource.replaceAll(lexeme, (0, unspace_1.unspace)(lexeme));
    });
    return newSource;
}
exports.joinMultiWordLexemes = joinMultiWordLexemes;


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

/***/ "./app/src/frontend/lexer/functions/respace.ts":
/*!*****************************************************!*\
  !*** ./app/src/frontend/lexer/functions/respace.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.respace = void 0;
function respace(string) {
    return string.replaceAll('-', ' ');
}
exports.respace = respace;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/stdspace.ts":
/*!******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/stdspace.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stdspace = void 0;
function stdspace(string) {
    return string.replaceAll(/\s+/g, ' ');
}
exports.stdspace = stdspace;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/unspace.ts":
/*!*****************************************************!*\
  !*** ./app/src/frontend/lexer/functions/unspace.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unspace = void 0;
function unspace(string) {
    return string.replaceAll(' ', '-');
}
exports.unspace = unspace;


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
const mockMap_1 = __webpack_require__(/*! ./functions/mockMap */ "./app/src/middle/clauses/functions/mockMap.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const solveMaps_1 = __webpack_require__(/*! ./functions/solveMaps */ "./app/src/middle/clauses/functions/solveMaps.ts");
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false, isSideEffecty = false, exactIds = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
        this.exactIds = exactIds;
        this.hashCode = (0, hashString_1.hashString)(this.clause1.toString() + this.clause2.toString() + this.negated);
        this.entities = (0, uniq_1.uniq)(this.clause1.entities.concat(this.clause2.entities));
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
        var _a, _b, _c, _d, _e;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated, (_d = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _d !== void 0 ? _d : this.isSideEffecty, (_e = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _e !== void 0 ? _e : this.exactIds);
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
        if (query.exactIds) {
            return [(0, mockMap_1.mockMap)(query)];
        }
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

/***/ "./app/src/middle/clauses/BasicClause.ts":
/*!***********************************************!*\
  !*** ./app/src/middle/clauses/BasicClause.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/middle/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const mockMap_1 = __webpack_require__(/*! ./functions/mockMap */ "./app/src/middle/clauses/functions/mockMap.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
class BasicClause {
    constructor(predicate, args, negated = false, isSideEffecty = false, exactIds = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
        this.exactIds = exactIds;
        this.simple = this;
        this.theme = this;
        this.rheme = Clause_1.emptyClause;
        this.entities = (0, uniq_1.uniq)(this.args);
        this.hashCode = (0, hashString_1.hashString)(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }));
        this.copy = (opts) => {
            var _a, _b, _c;
            return new BasicClause(this.predicate, this.args.map(a => { var _a, _b; return (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.map) === null || _a === void 0 ? void 0 : _a[a]) !== null && _b !== void 0 ? _b : a; }), (_a = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _a !== void 0 ? _a : this.negated, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty, (_c = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _c !== void 0 ? _c : this.exactIds);
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
        if (query.exactIds) {
            return [(0, mockMap_1.mockMap)(query)];
        }
        if (!(query instanceof BasicClause)) {
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
exports.BasicClause = BasicClause;


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
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/middle/clauses/BasicClause.ts");
const EmptyClause_1 = __importDefault(__webpack_require__(/*! ./EmptyClause */ "./app/src/middle/clauses/EmptyClause.ts"));
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
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
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
class Imply {
    constructor(condition, consequence, negated = false, isSideEffecty = false, subjconj, exactIds = false) {
        this.condition = condition;
        this.consequence = consequence;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
        this.subjconj = subjconj;
        this.exactIds = exactIds;
        this.theme = this.condition;
        this.rheme = this.consequence;
        this.hashCode = (0, hashString_1.hashString)(this.condition.toString() + this.consequence.toString() + this.negated);
        this.copy = (opts) => {
            var _a, _b, _c, _d, _e, _f;
            return new Imply((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.condition.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.consequence.copy(opts), (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated, (_d = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _d !== void 0 ? _d : this.isSideEffecty, (_e = opts === null || opts === void 0 ? void 0 : opts.subjconj) !== null && _e !== void 0 ? _e : this.subjconj, (_f = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _f !== void 0 ? _f : this.exactIds);
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

/***/ "./app/src/middle/clauses/functions/mockMap.ts":
/*!*****************************************************!*\
  !*** ./app/src/middle/clauses/functions/mockMap.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mockMap = void 0;
function mockMap(clause) {
    return clause.entities.map(e => ({ [e]: e })).reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
}
exports.mockMap = mockMap;


/***/ }),

/***/ "./app/src/middle/clauses/functions/negate.ts":
/*!****************************************************!*\
  !*** ./app/src/middle/clauses/functions/negate.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.negate = void 0;
//TODO: consider moving to Clause.copy({negate}) !!!!!
function negate(clause, negate) {
    if (!negate) {
        return clause;
    }
    return clause.copy({ clause1: clause.theme.simple, clause2: clause.rheme.simple.copy({ negate }) });
}
exports.negate = negate;


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

/***/ "./app/src/middle/toClause.ts":
/*!************************************!*\
  !*** ./app/src/middle/toClause.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toClause = void 0;
const Clause_1 = __webpack_require__(/*! ./clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const makeAllVars_1 = __webpack_require__(/*! ./clauses/functions/makeAllVars */ "./app/src/middle/clauses/functions/makeAllVars.ts");
const makeImply_1 = __webpack_require__(/*! ./clauses/functions/makeImply */ "./app/src/middle/clauses/functions/makeImply.ts");
const negate_1 = __webpack_require__(/*! ./clauses/functions/negate */ "./app/src/middle/clauses/functions/negate.ts");
const propagateVarsOwned_1 = __webpack_require__(/*! ./clauses/functions/propagateVarsOwned */ "./app/src/middle/clauses/functions/propagateVarsOwned.ts");
const resolveAnaphora_1 = __webpack_require__(/*! ./clauses/functions/resolveAnaphora */ "./app/src/middle/clauses/functions/resolveAnaphora.ts");
const getIncrementalId_1 = __webpack_require__(/*! ./id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const toVar_1 = __webpack_require__(/*! ./id/functions/toVar */ "./app/src/middle/id/functions/toVar.ts");
function toClause(ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (!ast) {
        // console.warn('Ast is undefined!')
        return Clause_1.emptyClause;
    }
    if (ast.lexeme) {
        if (ast.lexeme.type === 'noun' || ast.lexeme.type === 'adjective' || ast.lexeme.type === 'pronoun' || ast.lexeme.type === 'grammar') {
            return (0, Clause_1.clauseOf)(ast.lexeme, ...(args === null || args === void 0 ? void 0 : args.subject) ? [args === null || args === void 0 ? void 0 : args.subject] : []);
        }
        return Clause_1.emptyClause;
    }
    if (ast.list) {
        return ast.list.map(c => toClause(c, args)).reduce((c1, c2) => c1.and(c2), Clause_1.emptyClause);
    }
    let result;
    let rel;
    if (((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.relpron) && ast.links.copula) {
        result = copulaSubClauseToClause(ast, args);
    }
    else if (((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.relpron) && ast.links.mverb) {
        result = mverbSubClauseToClause(ast, args);
    }
    else if (isCopulaSentence(ast)) {
        result = copulaSentenceToClause(ast, args);
    }
    else if ((_c = ast.links) === null || _c === void 0 ? void 0 : _c.nonsubconj) {
        result = andSentenceToClause(ast, args);
    }
    else if (rel = ((_e = (_d = ast.links) === null || _d === void 0 ? void 0 : _d.iverb) === null || _e === void 0 ? void 0 : _e.lexeme) || ((_g = (_f = ast.links) === null || _f === void 0 ? void 0 : _f.mverb) === null || _g === void 0 ? void 0 : _g.lexeme) || ((_j = (_h = ast.links) === null || _h === void 0 ? void 0 : _h.preposition) === null || _j === void 0 ? void 0 : _j.lexeme)) {
        result = relationToClause(ast, rel, args);
    }
    else if ((_k = ast.links) === null || _k === void 0 ? void 0 : _k.subconj) {
        result = complexSentenceToClause(ast, args);
    }
    else {
        result = nounPhraseToClause(ast, args);
    }
    if (result) {
        const c0 = ((_l = ast.links) === null || _l === void 0 ? void 0 : _l.nonsubconj) ? result : (0, makeImply_1.makeImply)(result);
        const c1 = (0, makeAllVars_1.makeAllVars)(c0);
        const c2 = (0, resolveAnaphora_1.resolveAnaphora)(c1);
        const c3 = (0, propagateVarsOwned_1.propagateVarsOwned)(c2);
        const c4 = (0, negate_1.negate)(c3, !!((_m = ast === null || ast === void 0 ? void 0 : ast.links) === null || _m === void 0 ? void 0 : _m.negation));
        const c5 = c4.copy({ sideEffecty: c4.rheme !== Clause_1.emptyClause });
        return c5;
    }
    console.log({ ast });
    throw new Error(`Idk what to do with '${ast.type}'!`);
}
exports.toClause = toClause;
const isCopulaSentence = (ast) => { var _a; return !!((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.copula); };
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subject = toClause((_b = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId });
    const predicate = toClause((_c = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId });
    return subject.and(predicate, { asRheme: true });
}
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    const predicate = (_a = copulaSubClause === null || copulaSubClause === void 0 ? void 0 : copulaSubClause.links) === null || _a === void 0 ? void 0 : _a.predicate;
    return toClause(predicate, args);
}
function mverbSubClauseToClause(ast, args) {
    var _a, _b, _c;
    const mverb = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.mverb) === null || _b === void 0 ? void 0 : _b.lexeme;
    const subjectId = args === null || args === void 0 ? void 0 : args.subject;
    const objectId = (0, getIncrementalId_1.getIncrementalId)();
    const object = toClause((_c = ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objectId }); // 
    return object.and((0, Clause_1.clauseOf)(mverb, subjectId, objectId));
}
function nounPhraseToClause(nounPhrase, opts) {
    var _a, _b, _c;
    const maybeId = (_a = opts === null || opts === void 0 ? void 0 : opts.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subjectId = ((_b = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _b === void 0 ? void 0 : _b.uniquant) ? (0, toVar_1.toVar)(maybeId) : maybeId;
    const args = { subject: subjectId };
    return Object.values((_c = nounPhrase.links) !== null && _c !== void 0 ? _c : {})
        .map(x => toClause(x, args)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
}
function relationToClause(ast, rel, opts) {
    var _a, _b, _c;
    const subjId = (_a = opts === null || opts === void 0 ? void 0 : opts.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const objId = (0, getIncrementalId_1.getIncrementalId)();
    const subject = toClause((_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjId });
    const object = toClause((_c = ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objId });
    const args = object === Clause_1.emptyClause ? [subjId] : [subjId, objId];
    const relation = (0, Clause_1.clauseOf)(rel, ...args);
    const relationIsRheme = subject !== Clause_1.emptyClause;
    return subject
        .and(object)
        .and(relation, { asRheme: relationIsRheme });
}
function complexSentenceToClause(ast, args) {
    var _a, _b, _c, _d;
    const subconj = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subconj) === null || _b === void 0 ? void 0 : _b.lexeme;
    const condition = toClause((_c = ast.links) === null || _c === void 0 ? void 0 : _c.condition, args);
    const consequence = toClause((_d = ast.links) === null || _d === void 0 ? void 0 : _d.consequence, args);
    return condition.implies(consequence).copy({ subjconj: subconj });
}
function andSentenceToClause(ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const left = toClause((_a = ast.links) === null || _a === void 0 ? void 0 : _a.left, args);
    const right = toClause((_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.right) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d[0], args);
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
const test19_1 = __webpack_require__(/*! ./tests/test19 */ "./app/tests/tests/test19.ts");
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
const test30_1 = __webpack_require__(/*! ./tests/test30 */ "./app/tests/tests/test30.ts");
const test31_1 = __webpack_require__(/*! ./tests/test31 */ "./app/tests/tests/test31.ts");
const test33_1 = __webpack_require__(/*! ./tests/test33 */ "./app/tests/tests/test33.ts");
const test34_1 = __webpack_require__(/*! ./tests/test34 */ "./app/tests/tests/test34.ts");
const test35_1 = __webpack_require__(/*! ./tests/test35 */ "./app/tests/tests/test35.ts");
const test36_1 = __webpack_require__(/*! ./tests/test36 */ "./app/tests/tests/test36.ts");
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
    test19_1.test19,
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
    test30_1.test30,
    test31_1.test31,
    // test32,
    test33_1.test33,
    test34_1.test34,
    test35_1.test35,
    test36_1.test36,
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

/***/ "./app/tests/tests/test19.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test19.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test19 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test19() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button. if x is red then y is a green button');
    return brain.executeUnwrapped('green button')[0].style.background === 'green';
}
exports.test19 = test19;


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

/***/ "./app/tests/tests/test30.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test30.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test30 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test30() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('=  is a copula');
    brain.executeUnwrapped('x = red button');
    return brain.executeUnwrapped('x')[0].style.background === 'red';
}
exports.test30 = test30;


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

/***/ "./app/tests/tests/test34.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test34.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test34 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test34() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.executeUnwrapped('x is a red button');
    brain.executeUnwrapped('fg of any button is color of style of it');
    brain.executeUnwrapped('fg of x is yellow');
    return brain.executeUnwrapped('x')[0].style.color === 'yellow';
}
exports.test34 = test34;


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

/***/ "./app/tests/tests/test36.ts":
/*!***********************************!*\
  !*** ./app/tests/tests/test36.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test36 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
function test36() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('a car is a thing');
    brain.execute('x and y are cars');
    brain.execute('overtake is an mverb');
    brain.execute('x overtakes y');
    const firstIntension = brain.execute('the car that overtakes y')[0];
    const secondIntension = brain.execute('x')[0];
    const falseSecondIntension = brain.execute('y')[0];
    return firstIntension === secondIntension
        && firstIntension !== falseSecondIntension;
}
exports.test36 = test36;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQjtJQUNuQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO0lBQ3pDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFKRCxzQkFJQzs7Ozs7OztVQ0pEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvQ3JlYXRlTGV4ZW1lQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0lmQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL011bHRpQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1NldEFsaWFzQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1NpbXBsZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9XaGVuQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0dWF0b3IvQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvQmFzZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci9tYWtlU2V0dGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC93cmFwcGVyL3R5cGVPZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL3BvaW50T3V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0Jhc2VMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2R5bmFtaWNMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZ2V0TGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcmVzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9zdGRzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy91bnNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9CYXNpY0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21vY2tNYXAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbmVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3Byb3BhZ2F0ZVZhcnNPd25lZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvc29sdmVNYXBzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pc1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvc29ydElkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9Db25zdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9WYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9hbGxLZXlzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZGVlcENvcHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvbmV3SW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zZXROZXN0ZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3RhZ05hbWVGcm9tUHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxMi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxNS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MTcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QxOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDE5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0Mi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyMi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyNS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI2LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MjcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyOC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDI5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0My50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDMwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzMy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzNi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDM3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MzgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0NS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDYudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3Q3LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0OC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3V0aWxzL2NsZWFyRG9tLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy91dGlscy9zbGVlcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcblxuXG5tYWluKCkiLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVMZXhlbWVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKCFjb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCBhcyBMZXhlbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSgodGhpcy5jbGF1c2UuYXJncyBhcyBhbnkpWzBdKVswXS5yb290IC8vVE9ETzogY291bGQgYmUgdW5kZWZpbmVkICAgICAgICBcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCBhcyBMZXhlbWVUeXBlXG5cbiAgICAgICAgY29uc3QgbGV4ZW1lID0gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBuYW1lLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZXh0LnNldExleGVtZShsZXhlbWUpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElmQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmIChjb250ZXh0LnF1ZXJ5KHRoaXMuY2xhdXNlLnRoZW1lKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2xhdXNlLnJoZW1lLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG5cblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkvLy5tYXAobSA9PiB0aGlzLnRvTWFwKG0pKVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2xhdXNlLnRoZW1lLnRvU3RyaW5nKCkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2xhdXNlLnJoZW1lLnRvU3RyaW5nKCkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtYXBzPScsIG1hcHMpXG5cbiAgICAgICAgbWFwcy5mb3JFYWNoKG0gPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNsYXVzZS5jb3B5KHsgbWFwOiBtLCBleGFjdElkczogdHJ1ZSB9KVxuICAgICAgICAgICAgY29uc3QgY29uc2VxID0gdG9wLnJoZW1lXG4gICAgICAgICAgICBjb25zdCBjbGF1c2VzID0gY29uc2VxLmZsYXRMaXN0KClcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2VzLm1hcChjID0+IGdldEFjdGlvbihjLCB0b3ApKVxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGEgPT4gYS5ydW4oY29udGV4dCkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIC8vIHByb3RlY3RlZCB0b01hcChtOiB7IFt4OiBJZF06IFdyYXBwZXIgfSk6IE1hcCB7XG4gICAgLy8gICAgIHJldHVybiBPYmplY3QuZW50cmllcyhtKS5tYXAoZSA9PiAoeyBbZVswXV06IGVbMV0/LmlkIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG4gICAgLy8gfVxuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0QWxpYXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuICAgICAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRoaXMuY2xhdXNlLnJoZW1lXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY29uZGl0aW9uKVswXSAvL1RPRE8gKCFBU1NVTUUhKSBzYW1lIGFzIHRvcCBpbiBjb25jbHVzaW9uXG4gICAgICAgIGNvbnN0IGFsaWFzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uZGl0aW9uLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uc2VxdWVuY2UsIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdCA9IGFsaWFzLm1hcCh4ID0+IGNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHBhdGggPSBwcm9wcy5tYXAoeCA9PiBjb25zZXF1ZW5jZS5kZXNjcmliZSh4KVswXSkubWFwKHggPT4geC5yb290KSAvLyBzYW1lIC4uLlxuICAgICAgICBjb25zdCBsZXhlbWUgPSBjb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuXG4gICAgICAgIGxleGVtZS5yZWZlcmVudD8uc2V0QWxpYXMoY29uY2VwdFswXS5yb290LCBwYXRoKVxuICAgIH1cblxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNsYXVzZS5hcmdzIHx8ICF0aGlzLmNsYXVzZS5wcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkodGhpcy50b3BMZXZlbC50aGVtZSlcblxuICAgICAgICBjb25zdCBtYXAgPSBtYXBzWzBdID8/IHt9XG5cbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuY2xhdXNlLmFyZ3NcbiAgICAgICAgICAgIC5tYXAoaWQgPT4gbWFwW2lkXSA/IGNvbnRleHQuZ2V0KG1hcFtpZF0pISA6IGNvbnRleHQuc2V0KHdyYXAoeyBpZDogZ2V0SW5jcmVtZW50YWxJZCgpIH0pKSlcblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gYXJnc1swXVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHN1YmplY3Q/LnNldCh0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIHtcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3Muc2xpY2UoMSksXG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgbmVnYXRlZDogdGhpcy5jbGF1c2UubmVnYXRlZFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmICghdGhpcy5jbGF1c2UucHJlZGljYXRlLnJlZmVyZW50ICYmIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS50eXBlID09PSAnbm91bicpIHsgLy8gcmVmZXJlbnQgb2YgXCJwcm9wZXIgbm91blwiIGlzIGZpcnN0IHRvIGdldCBpdCBcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yZWZlcmVudCA/Pz0gc3ViamVjdFxuICAgICAgICAgICAgY29udGV4dC5zZXRMZXhlbWUodGhpcy5jbGF1c2UucHJlZGljYXRlKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKHJlcykge1xuICAgICAgICAvLyAgICAgY29udGV4dC5zZXQoeyB3cmFwcGVyOiByZXMsIHR5cGU6IDIgfSlcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2hlbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgICAgICAgICAgaWYgKGNvbnRleHQucXVlcnkodGhpcy5jbGF1c2UudGhlbWUpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlLnJoZW1lLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aW9uKGMsIHRoaXMuY2xhdXNlLnJoZW1lKS5ydW4oY29udGV4dClcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCAxMDApXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgU2ltcGxlQWN0aW9uIGZyb20gXCIuL1NpbXBsZUFjdGlvblwiXG5pbXBvcnQgU2V0QWxpYXNBY3Rpb24gZnJvbSBcIi4vU2V0QWxpYXNBY3Rpb25cIlxuaW1wb3J0IE11bHRpQWN0aW9uIGZyb20gXCIuL011bHRpQWN0aW9uXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCJcbmltcG9ydCBJZkFjdGlvbiBmcm9tIFwiLi9JZkFjdGlvblwiXG5pbXBvcnQgV2hlbkFjdGlvbiBmcm9tIFwiLi9XaGVuQWN0aW9uXCJcbmltcG9ydCBDcmVhdGVMZXhlbWVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlTGV4ZW1lQWN0aW9uXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9JbXBseVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbihjbGF1c2U6IENsYXVzZSwgdG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbiB7XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnRoZW1lLmVudGl0aWVzLnNvbWUoZSA9PiBjbGF1c2UudGhlbWUub3duZXJzT2YoZSkubGVuZ3RoKSAmJiBjbGF1c2UucmhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS5yaGVtZS5vd25lcnNPZihlKS5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0QWxpYXNBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2Uuc3ViamNvbmo/LnJvb3QgPT09ICdpZicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJZkFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ3doZW4nKSB7XG4gICAgICAgIHJldHVybiBuZXcgV2hlbkFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5KSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIGlmICh0b3BMZXZlbC5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8udHlwZSA9PT0gJ2dyYW1tYXInKSkge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUxleGVtZUFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgU2ltcGxlQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogYW55W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9ucy9nZXRBY3Rpb25cIjtcbmltcG9ydCB7IEFjdHVhdG9yIH0gZnJvbSBcIi4vQWN0dWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IGFueVtdIHtcblxuICAgICAgICBjb25zdCBhY3Rpb25zID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4gZ2V0QWN0aW9uKHgsIGNsYXVzZSkpXG4gICAgICAgIHJldHVybiBhY3Rpb25zLmZsYXRNYXAoYSA9PiBhLnJ1bihjb250ZXh0KT8/W10pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvLCB9IGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLmRpY3Rpb25hcnlbcDFdXG5cbiAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB3LmdldChwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldExhc3RSZWZlcmVuY2VkKHAxKVxuICAgICAgICByZXR1cm4gd1xuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldCA9ICh3cmFwcGVyOiBXcmFwcGVyKTogV3JhcHBlciA9PiB7XG4gICAgICAgIHRoaXMuc2V0TGFzdFJlZmVyZW5jZWQod3JhcHBlci5pZClcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVt3cmFwcGVyLmlkXSA9IHdyYXBwZXJcbiAgICB9XG5cbiAgICBxdWVyeSA9IChxdWVyeTogQ2xhdXNlKTogTWFwW10gPT4ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy52YWx1ZXNcbiAgICAgICAgICAgIC5tYXAodyA9PiB3LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCBtYXBzID0gdW5pdmVyc2VcbiAgICAgICAgICAgIC5xdWVyeShxdWVyeSwgeyBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCB9KVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdxdWVyeT0nLCBxdWVyeS50b1N0cmluZygpLCAndW5pdmVyc2U9JywgdW5pdmVyc2UudG9TdHJpbmcoKSwgJ21hcHM9JywgbWFwcylcbiAgICAgICAgcmV0dXJuIG1hcHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TGFzdFJlZmVyZW5jZWQobGFzdFJlZmVyZW5jZWQ6IElkKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmRpY3Rpb25hcnkpLmluY2x1ZGVzKGxhc3RSZWZlcmVuY2VkKSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGxhc3RSZWZlcmVuY2VkXG4gICAgICAgIH1cbiAgICB9XG5cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi93cmFwcGVyL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZFxuICAgIHNldCh3cmFwcGVyOiBXcmFwcGVyKTogV3JhcHBlclxuICAgIHJlYWRvbmx5IHZhbHVlczogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgSGVpcmxvb20gfSBmcm9tIFwiLi9IZWlybG9vbVwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgQ29weU9wdHMsIFNldE9wcywgd3JhcCB9IGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBhbGxLZXlzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2FsbEtleXNcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWxcIjtcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gXCIuL3R5cGVPZlwiO1xuaW1wb3J0IHsgZGVlcENvcHkgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZGVlcENvcHlcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgeyBtYWtlU2V0dGVyIH0gZnJvbSBcIi4vbWFrZVNldHRlclwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5cblxudHlwZSBSZWxhdGlvbiA9IHsgcHJlZGljYXRlOiBMZXhlbWUsIGFyZ3M6IFdyYXBwZXJbXSB9IC8vaW1wbGllZCBzdWJqZWN0ID0gdGhpcyBvYmplY3RcblxuXG5cbmZ1bmN0aW9uIHJlbGF0aW9uc0VxdWFsKHIxOiBSZWxhdGlvbiwgcjI6IFJlbGF0aW9uKSB7XG4gICAgcmV0dXJuIHIxLnByZWRpY2F0ZS5yb290ID09PSByMi5wcmVkaWNhdGUucm9vdFxuICAgICAgICAmJiByMS5hcmdzLmxlbmd0aCA9PT0gcjIuYXJncy5sZW5ndGhcbiAgICAgICAgJiYgcjEuYXJncy5ldmVyeSgoeCwgaSkgPT4gcjIuYXJnc1tpXSA9PT0geClcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBwYXJlbnQ/OiBXcmFwcGVyLFxuICAgICAgICByZWFkb25seSBuYW1lPzogc3RyaW5nLFxuICAgICAgICByZWFkb25seSBoZWlybG9vbXM6IEhlaXJsb29tW10gPSBbXSxcbiAgICAgICAgcHJvdGVjdGVkIHJlbGF0aW9uczogUmVsYXRpb25bXSA9IFtdXG4gICAgKSB7IH1cblxuICAgIHByb3RlY3RlZCBpcyA9IChwcmVkaWNhdGU6IExleGVtZSkgPT5cbiAgICAgICAgLy8gdGhpcy5wcmVkaWNhdGVzLm1hcCh4ID0+IHgucm9vdCkuaW5jbHVkZXMocHJlZGljYXRlLnJvb3QpXG4gICAgICAgIC8vIHRoaXMuZ2V0Q29uY2VwdHMoKS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdCkgLy9UT0RPIGFsc28gZnJvbSBzdXBlcnNcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4geC5hcmdzLmxlbmd0aCA9PT0gMCkubWFwKHggPT4geC5wcmVkaWNhdGUpLm1hcCh4ID0+IHgucm9vdCkuaW5jbHVkZXMocHJlZGljYXRlLnJvb3QpXG5cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHJlbGF0aW9uOiBSZWxhdGlvbiA9IHsgcHJlZGljYXRlLCBhcmdzOiBvcHRzPy5hcmdzID8/IFtdIH1cblxuICAgICAgICBpZiAoIW9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gcmVsYXRpb25zRXF1YWwoeCwgcmVsYXRpb24pKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlaW50ZXJwcmV0KFtdLCBbXSwgW3JlbGF0aW9uXSwgb3B0cylcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhZGRlZDogUmVsYXRpb25bXSA9IFtdXG4gICAgICAgIGxldCByZW1vdmVkOiBSZWxhdGlvbltdID0gW11cbiAgICAgICAgbGV0IHVuY2hhbmdlZCA9IHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+ICFyZWxhdGlvbnNFcXVhbCh4LCByZWxhdGlvbikpXG5cbiAgICAgICAgaWYgKG9wdHM/Lm5lZ2F0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUmVsYXRpb24ocmVsYXRpb24pXG4gICAgICAgICAgICByZW1vdmVkID0gW3JlbGF0aW9uXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkZWQgPSBbcmVsYXRpb25dXG4gICAgICAgICAgICByZW1vdmVkLnB1c2goLi4udGhpcy5nZXRNdXRleChhZGRlZCkpXG4gICAgICAgICAgICB1bmNoYW5nZWQgPSB1bmNoYW5nZWQuZmlsdGVyKHggPT4gIXJlbW92ZWQuc29tZShyID0+IHJlbGF0aW9uc0VxdWFsKHgsIHIpKSlcbiAgICAgICAgICAgIHRoaXMuYWRkUmVsYXRpb24ocmVsYXRpb24pXG4gICAgICAgICAgICByZW1vdmVkLmZvckVhY2goeCA9PiB0aGlzLnJlbW92ZVJlbGF0aW9uKHgpKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2FkZGVkPScsIGFkZGVkLCAncmVtb3ZlZD0nLCByZW1vdmVkLCAndW5jaGFuZ2VkPScsIHVuY2hhbmdlZCkgXG4gICAgICAgIHJldHVybiB0aGlzLnJlaW50ZXJwcmV0KGFkZGVkLCByZW1vdmVkLCB1bmNoYW5nZWQsIG9wdHMpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE11dGV4KGFkZGVkOiBSZWxhdGlvbltdKTogUmVsYXRpb25bXSB7XG5cbiAgICAgICAgY29uc3QgbmV3T25lID0gYWRkZWRbMF0ucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKG5ld09uZS5yZWZlcmVudD8uZ2V0Q29uY2VwdHMoKS5pbmNsdWRlcygnY29sb3InKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRpb25zLmZpbHRlcih4ID0+ICF4LmFyZ3MubGVuZ3RoKS5maWx0ZXIoeCA9PiAoeC5wcmVkaWNhdGUucmVmZXJlbnQgIT09IHRoaXMpICYmICh4LnByZWRpY2F0ZS5yZWZlcmVudD8uZ2V0Q29uY2VwdHMoKS5pbmNsdWRlcygnY29sb3InKSkgJiYgKHgucHJlZGljYXRlLnJvb3QgIT09IG5ld09uZS5yb290KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhZGRSZWxhdGlvbihyZWxhdGlvbjogUmVsYXRpb24pIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMucHVzaChyZWxhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVtb3ZlUmVsYXRpb24ocmVsYXRpb246IFJlbGF0aW9uKSB7XG4gICAgICAgIHRoaXMucmVsYXRpb25zID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXJlbGF0aW9uc0VxdWFsKHgsIHJlbGF0aW9uKSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVpbnRlcnByZXQoYWRkZWQ6IFJlbGF0aW9uW10sIHJlbW92ZWQ6IFJlbGF0aW9uW10sIHVuY2hhbmdlZDogUmVsYXRpb25bXSwgb3B0cz86IFNldE9wcykge1xuXG4gICAgICAgIHJlbW92ZWQuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9TaWRlRWZmZWN0cyhwLnByZWRpY2F0ZSwgb3B0cylcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSGVpcmxvb21zKHAucHJlZGljYXRlKVxuICAgICAgICB9KVxuXG4gICAgICAgIGFkZGVkLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvU2lkZUVmZmVjdHMocC5wcmVkaWNhdGUsIG9wdHMpXG4gICAgICAgICAgICB0aGlzLmFkZEhlaXJsb29tcyhwLnByZWRpY2F0ZSlcbiAgICAgICAgfSlcblxuICAgICAgICB1bmNoYW5nZWQuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9TaWRlRWZmZWN0cyhwLnByZWRpY2F0ZSwgb3B0cykgLy9UT0RPISByZXN0b3JlIGhlaXJsb29tc1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZG9TaWRlRWZmZWN0cyhwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcykge1xuXG4gICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLmNhbkhhdmVBKHByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocHJlZGljYXRlLmlzVmVyYikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHM/LmFyZ3MhKS8vVE9ET1xuICAgICAgICB9IGVsc2UgaWYgKHByb3ApIHsgLy8gaGFzLWFcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHR5cGVvZiB0aGlzLl9nZXQocHJlZGljYXRlLnJvb3QpID09PSAnYm9vbGVhbicgPyAhb3B0cz8ubmVnYXRlZCA6ICFvcHRzPy5uZWdhdGVkID8gcHJlZGljYXRlLnJvb3QgOiBvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXMocHJlZGljYXRlKSA/ICcnIDogdGhpcy5fZ2V0KHByb3ApXG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwcm9wXSA9IHZhbFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGFyZW50KSB7IC8vIGNoaWxkIGlzLWEsIHBhcmVudCBoYXMtYVxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wYXJlbnQudW53cmFwPy4oKSA/PyB0aGlzLnBhcmVudFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ29iamVjdCcpIHBhcmVudFt0aGlzLm5hbWUhXSA9IHByZWRpY2F0ZS5yb290IC8vVE9ETzogbmVnYXRpb25cbiAgICAgICAgICAgIC8vIHRoaXMucGFyZW50Py5zZXQocHJlZGljYXRlLCBvcHRzKSAvLyBUT0RPOiBzZXQgcHJlZGljYXRlIG9uIHBhcmVudD8gXG4gICAgICAgIH0gZWxzZSB7IC8vIGlzLWFcbiAgICAgICAgICAgIHRoaXMuYmVBKHByZWRpY2F0ZSwgb3B0cylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFkZEhlaXJsb29tcyhwcmVkaWNhdGU6IExleGVtZSkge1xuICAgICAgICBwcmVkaWNhdGUucmVmZXJlbnQ/LmdldEhlaXJsb29tcygpLmZvckVhY2goaCA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5vYmplY3QsIGgubmFtZSwgaClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVtb3ZlSGVpcmxvb21zKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHByZWRpY2F0ZS5yZWZlcmVudD8uZ2V0SGVpcmxvb21zKCkuZm9yRWFjaChoID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9iamVjdFtoLm5hbWVdXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGluaGVyaXQgPSAodmFsdWU6IExleGVtZSwgb3B0cz86IFNldE9wcykgPT4ge1xuXG4gICAgICAgIGNvbnN0IGNvcHkgPSB2YWx1ZS5yZWZlcmVudD8uY29weSh7IGlkOiB0aGlzLmlkIH0pLnVud3JhcCgpXG5cbiAgICAgICAgaWYgKCFjb3B5IHx8IHZhbHVlLnJlZmVyZW50ID09PSB0aGlzIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLm9iamVjdCkgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihjb3B5KSAvKiBkb24ndCByZWNyZWF0ZSAqLykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9iamVjdCA9IGNvcHlcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QuaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG9wdHM/LmNvbnRleHQ/LnJvb3Q/LmFwcGVuZENoaWxkKHRoaXMub2JqZWN0KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMub2JqZWN0LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QudGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRpc2luaGVyaXQgPSAodmFsdWU6IExleGVtZSwgb3B0cz86IFNldE9wcykgPT4ge1xuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbkhhdmVBKHZhbHVlOiBMZXhlbWUpIHsgLy9yZXR1cm5zIG5hbWUgb2YgcHJvcCBjb3JyZXNwb25kaW5nIHRvIExleGVtZSBpZiBhbnlcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSBbLi4udmFsdWUucmVmZXJlbnQ/LmdldENvbmNlcHRzKCkgPz8gW10sIHZhbHVlLnJvb3RdXG4gICAgICAgIHJldHVybiBjb25jZXB0cy5maW5kKHggPT4gdGhpcy5fZ2V0KHgpICE9PSB1bmRlZmluZWQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGJlQSh2YWx1ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG4gICAgICAgIG9wdHM/Lm5lZ2F0ZWQgPyB0aGlzLmRpc2luaGVyaXQodmFsdWUsIG9wdHMpIDogdGhpcy5pbmhlcml0KHZhbHVlLCBvcHRzKVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGdldENvbmNlcHRzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4gIXguYXJncy5sZW5ndGgpLm1hcCh4ID0+IHgucHJlZGljYXRlKS5mbGF0TWFwKHggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHgucmVmZXJlbnQgPT09IHRoaXMgPyBbeC5yb290XSA6IHgucmVmZXJlbnQ/LmdldENvbmNlcHRzKCkgPz8gW11cbiAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBCYXNlV3JhcHBlcihcbiAgICAgICAgb3B0cz8ub2JqZWN0ID8/IGRlZXBDb3B5KHRoaXMub2JqZWN0KSxcbiAgICAgICAgb3B0cz8uaWQgPz8gdGhpcy5pZCwgLy9UT0RPOiBrZWVwIG9sZCBieSBkZWZhdWx0P1xuICAgIClcblxuICAgIGR5bmFtaWMgPSAoKSA9PiBhbGxLZXlzKHRoaXMub2JqZWN0KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgdHlwZTogdHlwZU9mKHRoaXMuX2dldCh4KSksXG4gICAgICAgIHJvb3Q6IHhcbiAgICB9KSlcblxuICAgIHVud3JhcCA9ICgpID0+IHRoaXMub2JqZWN0XG5cbiAgICBwcm90ZWN0ZWQgcmVmcmVzaEhlaXJsb29tcygpIHtcbiAgICAgICAgdGhpcy5yZWxhdGlvbnMubWFwKHggPT4geC5wcmVkaWNhdGUpLmZvckVhY2gocCA9PiBwLnJlZmVyZW50Py5nZXRIZWlybG9vbXMoKS5mb3JFYWNoKGggPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMub2JqZWN0LCBoLm5hbWUsIGgpXG4gICAgICAgIH0pKVxuICAgIH1cblxuICAgIGdldEhlaXJsb29tcygpOiBIZWlybG9vbVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVpcmxvb21zXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5fZ2V0KHZlcmIucm9vdCkgYXMgRnVuY3Rpb25cblxuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBtZXRob2QuY2FsbCh0aGlzLm9iamVjdCwgLi4uYXJncy5tYXAoeCA9PiB4LnVud3JhcCgpKSlcbiAgICAgICAgcmV0dXJuIHdyYXAoeyBpZDogZ2V0SW5jcmVtZW50YWxJZCgpLCBvYmplY3Q6IHJlc3VsdCB9KVxuICAgIH1cblxuXG5cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgcHJvdGVjdGVkIG93bmVySW5mbyhxOiBDbGF1c2UpIHtcbiAgICAgICAgY29uc3QgbWFwczogTWFwW10gPSB0aGlzLnF1ZXJ5KHEpLm1hcChtID0+IE9iamVjdC5lbnRyaWVzKG0pLm1hcChlID0+ICh7IFtlWzBdXTogZVsxXSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSkpXG4gICAgICAgIGNvbnN0IG5ld0NsYXVzZSA9IHEuY29weSh7IG1hcDogbWFwc1swXSB9KVxuICAgICAgICByZXR1cm4gKG1hcHNbMF0gJiYgZ2V0T3duZXJzaGlwQ2hhaW4ocSwgZ2V0VG9wTGV2ZWwocSlbMF0pLmxlbmd0aCA+IDEpID8gbmV3Q2xhdXNlIDogZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSkge1xuICAgICAgICBjb25zdCBxdWVyeU9yRW1wdHkgPSBxdWVyeSA/PyBlbXB0eUNsYXVzZVxuXG4gICAgICAgIGNvbnN0IGZpbGxlckNsYXVzZSA9IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiB0aGlzLmlkLnRvU3RyaW5nKCksIHR5cGU6ICdub3VuJyB9KSwgdGhpcy5pZCkgLy9UT0RPXG4gICAgICAgIGNvbnN0IG5hbWVDbGF1c2UgPSB0aGlzLm5hbWUgPyBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogdGhpcy5uYW1lLCB0eXBlOiAnbm91bicgfSksIHRoaXMuaWQpIDogZW1wdHlDbGF1c2UgLy9UT0RPXG4gICAgICAgIGNvbnN0IHJlbFN0dWZmID0gdGhpcy5yZWxhdGlvbnMuZmlsdGVyKHggPT4geC5hcmdzLmxlbmd0aCA+IDApLm1hcCh4ID0+IGNsYXVzZU9mKHgucHJlZGljYXRlLCAuLi5bdGhpcy5pZCwgLi4ueC5hcmdzLm1hcCh4ID0+IHguaWQpXSkpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHF1ZXJ5T3JFbXB0eS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5lbnRpdGllcy5sZW5ndGggPT09IDEgJiYgeC5wcmVkaWNhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gdGhpcy5pcyh4LnByZWRpY2F0ZSBhcyBMZXhlbWUpKVxuICAgICAgICAgICAgLm1hcCh4ID0+IHguY29weSh7IG1hcDogeyBbeC5hcmdzIVswXV06IHRoaXMuaWQgfSB9KSlcbiAgICAgICAgICAgIC5jb25jYXQoZmlsbGVyQ2xhdXNlKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmFuZCh0aGlzLm93bmVySW5mbyhxdWVyeU9yRW1wdHkpKVxuICAgICAgICAgICAgLmFuZChyZWxTdHVmZilcbiAgICAgICAgICAgIC5hbmQobmFtZUNsYXVzZSlcblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgc2V0QWxpYXMgPSAobmFtZTogc3RyaW5nLCBwYXRoOiBzdHJpbmdbXSkgPT4ge1xuXG4gICAgICAgIHRoaXMuaGVpcmxvb21zLnB1c2goe1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHNldDogbWFrZVNldHRlcihwYXRoKSxcbiAgICAgICAgICAgIGdldDogbWFrZUdldHRlcihwYXRoKSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcuJylcbiAgICAgICAgY29uc3QgcDEgPSBwYXJ0c1swXVxuICAgICAgICBjb25zdCBvID0gdGhpcy5vYmplY3RbcDFdXG4gICAgICAgIGNvbnN0IHcgPSBvIGluc3RhbmNlb2YgQmFzZVdyYXBwZXIgPyBvIDogbmV3IEJhc2VXcmFwcGVyKG8sIGAke3RoaXMuaWR9LiR7cDF9YCwgdGhpcywgcDEpIC8vVE9ETzpjaGVjayBpZCFcblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHcuZ2V0KHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF9nZXQoa2V5OiBzdHJpbmcpIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoSGVpcmxvb21zKCkgLy9UT0RPIVxuICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5vYmplY3Q/LltrZXldXG4gICAgICAgICAgICByZXR1cm4gdmFsPy51bndyYXA/LigpID8/IHZhbFxuICAgICAgICB9IGNhdGNoIHtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgcGFyZW50TWFwOiBNYXAgPSB7fSk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCBvYyA9IGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsYXVzZT0nLCBjbGF1c2UudG9TdHJpbmcoKSwgJ29jPScsIG9jLCAnbmFtZT0nLCB0aGlzLm5hbWUpXG5cbiAgICAgICAgaWYgKG9jLmxlbmd0aCA9PT0gMSkgeyAvL0JBU0VDQVNFOiBjaGVjayB5b3Vyc2VsZlxuICAgICAgICAgICAgLy9UT0RPOiBhbHNvIGhhbmRsZSBub24tb3duZXJzaGlwIG5vbi1pbnRyYW5zaXRpdmUgcmVsYXRpb25zIVxuICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgbm9uIEJhc2ljQ2xhdXNlcyEhISEgKHRoYXQgZG9uJ3QgaGF2ZSBPTkUgcHJlZGljYXRlISlcbiAgICAgICAgICAgIGlmIChjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZSAmJiAodGhpcy5pcyhjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZSkgfHwgdGhpcy5uYW1lID09PSBjbGF1c2Uuc2ltcGxlLnByZWRpY2F0ZT8ucm9vdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3sgLi4ucGFyZW50TWFwLCBbY2xhdXNlLmVudGl0aWVzWzBdXTogdGhpcy5pZCB9XVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtdIC8vVE9ET1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgeW91ciBjaGlsZHJlbiFcblxuICAgICAgICBjb25zdCB0b3AgPSBnZXRUb3BMZXZlbChjbGF1c2UpXG5cbiAgICAgICAgY29uc3QgcGVlbGVkID0gY2xhdXNlLmZsYXRMaXN0KClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmVudGl0aWVzLmV2ZXJ5KGUgPT4gIXRvcC5pbmNsdWRlcyhlKSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgcmVsZXZhbnROYW1lcyA9IC8qIG9yIGNsYXVzZT8/PyAqL3BlZWxlZC5mbGF0TGlzdCgpLmZsYXRNYXAoeCA9PiBbeC5wcmVkaWNhdGU/LnJvb3QsIHgucHJlZGljYXRlPy50b2tlbl0pLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IHggYXMgc3RyaW5nKVxuXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuOiBXcmFwcGVyW10gPSBhbGxLZXlzKHRoaXMub2JqZWN0KVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IG5hbWU6IHgsIG9iajogdGhpcy5fZ2V0KHgpIH0pKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJlbGV2YW50TmFtZXMuaW5jbHVkZXMoeC5uYW1lKSkgLy8gcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4Lm9iaiAhPT0gdGhpcy5vYmplY3QpXG4gICAgICAgICAgICAubWFwKHggPT4gbmV3IEJhc2VXcmFwcGVyKHgub2JqLCBgJHt0aGlzLmlkfS4ke3gubmFtZX1gLCB0aGlzLCB4Lm5hbWUpKVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IGNoaWxkcmVuLmZsYXRNYXAoeCA9PiB4LnF1ZXJ5KHBlZWxlZCwgeyBbdG9wWzBdXTogdGhpcy5pZCB9KSlcbiAgICAgICAgcmV0dXJuIHJlc1xuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGdldE5lc3RlZChvYmplY3Q6IGFueSwgcGF0aDogc3RyaW5nW10pIHtcblxuICAgIGlmICghb2JqZWN0W3BhdGhbMF1dKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBsZXQgeCA9IHdyYXAoeyBvYmplY3Q6IG9iamVjdFtwYXRoWzBdXSwgaWQ6IGdldEluY3JlbWVudGFsSWQoKSwgcGFyZW50OiBvYmplY3QsIG5hbWU6IHBhdGhbMF0gfSlcblxuICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY29uc3QgeSA9IHgudW53cmFwKClbcF1cbiAgICAgICAgeCA9IHdyYXAoeyBvYmplY3Q6IHksIGlkOiBnZXRJbmNyZW1lbnRhbElkKCksIHBhcmVudDogeCwgbmFtZTogcCB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4geFxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlR2V0dGVyKHBhdGg6IHN0cmluZ1tdKSB7XG5cbiAgICBmdW5jdGlvbiBmKHRoaXM6IGFueSkge1xuICAgICAgICByZXR1cm4gZ2V0TmVzdGVkKHRoaXMsIHBhdGgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgSGVpcmxvb20gfSBmcm9tIFwiLi9IZWlybG9vbVwiXG5pbXBvcnQgQmFzZVdyYXBwZXIgZnJvbSBcIi4vQmFzZVdyYXBwZXJcIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgcGFyZW50TWFwPzogTWFwKTogTWFwW11cbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZFxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IFdyYXBwZXJcbiAgICB1bndyYXAoKTogYW55XG4gICAgLyoqIGRlc2NyaWJlIHRoZSBvYmplY3QgKi8gdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICAvKiogaW5mZXIgZ3JhbW1hdGljYWwgdHlwZXMgb2YgcHJvcHMgKi8gZHluYW1pYygpOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IGlkOiBJZFxuICAgIHJlYWRvbmx5IHBhcmVudD86IFdyYXBwZXJcblxuICAgIHNldEFsaWFzKGFsaWFzOiBzdHJpbmcsIHBhdGg6IHN0cmluZ1tdKTogdm9pZFxuICAgIGdldEhlaXJsb29tcygpOiBIZWlybG9vbVtdXG4gICAgZ2V0Q29uY2VwdHMoKTogc3RyaW5nW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFdyYXBwZXJbXVxuICAgIGNvbnRleHQ/OiBDb250ZXh0XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG9iamVjdD86IG9iamVjdFxuICAgIHByZWRzPzogTGV4ZW1lW11cbiAgICBpZD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGFyZ3M6IFdyYXBBcmdzKTogV3JhcHBlciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlV3JhcHBlcihhcmdzLm9iamVjdCA/PyB7fSwgYXJncy5pZC8qICwgYXJncy5wcmVkcyA/PyBbXSAqLywgYXJncy5wYXJlbnQsIGFyZ3MubmFtZSlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBXcmFwQXJncyB7XG4gICAgaWQ6IElkLFxuICAgIHByZWRzPzogTGV4ZW1lW10sXG4gICAgb2JqZWN0PzogT2JqZWN0LFxuICAgIHBhcmVudD86IFdyYXBwZXIsXG4gICAgbmFtZT86IHN0cmluZ1xufVxuIiwiaW1wb3J0IHsgc2V0TmVzdGVkIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3NldE5lc3RlZFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZVNldHRlcihwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgZnVuY3Rpb24gZih0aGlzOiB1bmtub3duLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIHNldE5lc3RlZCh0aGlzLCBwYXRoLCB2YWx1ZSlcbiAgICB9XG5cbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgJ25hbWUnLCB7IHZhbHVlOiBgc2V0XyR7YWxpYXN9YCwgd3JpdGFibGU6IHRydWUgfSk7XG5cbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkoZiwgJ25hbWUnLCB7IHZhbHVlOiBhbGlhcywgd3JpdGFibGU6IHRydWUgfSk7XG5cblxuICAgIHJldHVybiBmXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZihvOiBvYmplY3QpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkIHtcblxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gMCA/ICdtdmVyYicgOiAnaXZlcmInXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgcmV0dXJuICdhZGplY3RpdmUnXG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJ25vdW4nXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAnZmlsbGVyJyxcbiAgJ3JlbHByb24nLFxuICAnbmVnYXRpb24nLFxuICAnbm91bicsXG4gICdwcmVwb3NpdGlvbicsXG4gICdzdWJjb25qJyxcbiAgJ2dyYW1tYXInLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bicsXG4gIC8vICdhbnknXG4pXG4iLCJpbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmNvbnN0IGJlaW5nOiBQYXJ0aWFsPExleGVtZT4gPSB7XG4gICAgcm9vdDogJ2JlJyxcbiAgICB0eXBlOiAnY29wdWxhJyxcbn1cblxuY29uc3QgZG9pbmc6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBQYXJ0aWFsPExleGVtZT5bXSA9IFtcblxuICAgIGJlaW5nLFxuICAgIGRvaW5nLFxuXG4gICAgeyBfcm9vdDogYmVpbmcsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuICAgIHsgX3Jvb3Q6IGJlaW5nLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicgfSwgLy9UT0RPISAyK1xuICAgIHsgX3Jvb3Q6IGRvaW5nLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICdmaWxsZXInIC8vIGZpbGxlciB3b3JkLCB3aGF0IGFib3V0IHBhcnRpYWwgcGFyc2luZz9cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3B0aW9uYWwnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcxfDAnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uZSBvciBtb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnemVybyBvciBtb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3InLFxuICAgICAgICB0eXBlOiAnZGlzanVuYydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29iamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbGVmdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3JpZ2h0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY29uZGl0aW9uJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY29uc2VxdWVuY2UnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGluZycsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVmZXJlbnQgOiB3cmFwKHtpZDondGhpbmcnLCBvYmplY3Q6IHt9fSlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcm9vdDogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVmZXJlbnQ6IHdyYXAoeyBpZDogJ2J1dHRvbicsIG9iamVjdDogSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlIH0pXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkaXYnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHJlZmVyZW50OiB3cmFwKHsgaWQ6ICdkaXYnLCBvYmplY3Q6IEhUTUxEaXZFbGVtZW50LnByb3RvdHlwZSB9KVxuICAgIH1cblxuXVxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZ1tdID0gW1xuXG4gICAgICAvLyBncmFtbWFyXG4gICAgICAncXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50JyxcbiAgICAgICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG9iamVjdCBub3VuLXBocmFzZScsXG5cbiAgICAgIGBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlYCxcblxuICAgICAgYG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIHplcm8gb3IgbW9yZSBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBncmFtbWFyXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgc3ViY2xhdXNlIFxuICAgICAgICB0aGVuIHplcm8gb3IgbW9yZSBjb21wbGVtZW50cyBgLFxuXG4gICAgICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2UnLFxuICAgICAgJ212ZXJic3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBtdmVyYiB0aGVuIG9iamVjdCBub3VuLXBocmFzZS4nLFxuICAgICAgJ3N1YmNsYXVzZSBpcyBjb3B1bGFzdWJjbGF1c2Ugb3IgbXZlcmJzdWJjbGF1c2UnLFxuXG4gICAgICBgYW5kLXNlbnRlbmNlIGlzIGxlZnQgY29wdWxhLXNlbnRlbmNlIG9yIG5vdW4tcGhyYXNlIFxuICAgICAgICB0aGVuIG5vbnN1YmNvbmpcbiAgICAgICAgdGhlbiBvbmUgb3IgbW9yZSByaWdodCBhbmQtc2VudGVuY2Ugb3IgY29wdWxhLXNlbnRlbmNlIG9yIG5vdW4tcGhyYXNlYCxcblxuICAgICAgYG12ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIG12ZXJiXG5cdFx0dGhlbiBvYmplY3Qgbm91bi1waHJhc2VgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgICAgIGBpdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBpdmVyYmAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICAgICAgYHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgaXZlcmItc2VudGVuY2Ugb3IgbXZlcmItc2VudGVuY2VgLFxuXG4gICAgICBgY3MyIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICAgICAgdGhlbiBzdWJjb25qXG4gICAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2VgLFxuXG4gICAgICBgY3MxIGlzIHN1YmNvbmogXG4gICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gZmlsbGVyIFxuICAgIHRoZW4gY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlYCxcblxuICAgICAgYGEgYW5kIGFuIGFyZSBpbmRlZmFydHNgLFxuICAgICAgYHRoZSBpcyBhIGRlZmFydGAsXG4gICAgICBgaWYgYW5kIHdoZW4gYW5kIHdoaWxlIGFyZSBzdWJjb25qc2AsXG4gICAgICBgYW55IGFuZCBldmVyeSBhbmQgYWxsIGFyZSB1bmlxdWFudHNgLFxuICAgICAgYG9mIGFuZCBvbiBhbmQgdG8gYW5kIGZyb20gYXJlIHByZXBvc2l0aW9uc2AsXG4gICAgICBgdGhhdCBpcyBhIHJlbHByb25gLFxuICAgICAgYG5vdCBpcyBhIG5lZ2F0aW9uYCxcbiAgICAgIGBpdCBpcyBhIHByb25vdW5gLFxuXG5cbiAgICAgIC8vIGRvbWFpblxuICAgICAgJ2NvbG9yIGlzIGEgdGhpbmcnLFxuICAgICAgJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFuZCBwdXJwbGUgYXJlIGNvbG9ycycsXG5cbiAgICAgICdjb2xvciBvZiBhbnkgYnV0dG9uIGlzIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgaXQnLFxuICAgICAgJ2NvbG9yIG9mIGFueSBkaXYgaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICAgICAndGV4dCBvZiBhbnkgYnV0dG9uIGlzIHRleHRDb250ZW50IG9mIGl0Jyxcbl0iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gY29uc3RpdHVlbnRUeXBlcy5jb25jYXQoKVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWydmaWxsZXInXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZTogWydncmFtbWFyJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnZGlzanVuYyddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG59IiwiaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uLy4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvdG9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IHBvaW50T3V0IH0gZnJvbSBcIi4vcG9pbnRPdXRcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKClcbiAgICApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTnVtYmVyLnByb3RvdHlwZSwgJ2FkZCcsIHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiBmdW5jdGlvbiAoYTogYW55KSB7IHJldHVybiB0aGlzICsgYSB9IH0pXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnByZWx1ZGUuZm9yRWFjaChjID0+IHRoaXMuZXhlY3V0ZShjKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2V0U3ludGF4KGFzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gdG9DbGF1c2UoYXN0KS5zaW1wbGVcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpKVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3R1YXRvci50YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5jb250ZXh0KVxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLmNvbnRleHQucXVlcnkoY2xhdXNlKVxuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJzID0gbWFwcy5mbGF0TWFwKG09Pk9iamVjdC52YWx1ZXMobSkpLm1hcChpZD0+dGhpcy5jb250ZXh0LmdldChpZCkpXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgd3JhcHBlcnMgPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChpZCA9PiBnZXRLb29sKHRoaXMuY29udGV4dCwgY2xhdXNlLCBpZCkpXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnZhbHVlcy5mb3JFYWNoKHcgPT4gcG9pbnRPdXQodywgeyB0dXJuT2ZmOiB0cnVlIH0pKVxuICAgICAgICAgICAgICAgIHdyYXBwZXJzLmZvckVhY2godyA9PiB3ID8gcG9pbnRPdXQodykgOiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVyc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pLmZsYXQoKVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHg/LnVud3JhcD8uKCkgPz8geClcbiAgICB9XG5cbn0iLCJpbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vLi4vYmFja2VuZC93cmFwcGVyL1dyYXBwZXJcIlxuaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogV3JhcHBlcltdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEJyYWluT3B0cyBleHRlbmRzIEdldENvbnRleHRPcHRzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4ob3B0czogR2V0QnJhaW5PcHRzKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbihnZXROZXdDb250ZXh0KG9wdHMpKVxufVxuIiwiaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uLy4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50T3V0KHdyYXBwZXI6IFdyYXBwZXIsIG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkge1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gd3JhcHBlci51bndyYXAoKVxuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgIH1cblxufSIsImltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQ29udGV4dCBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2VcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3ludGF4TWFwID0gdGhpcy5jb25maWcuc3ludGF4ZXNcbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgcHJvdGVjdGVkIF9sZXhlbWVzID0gdGhpcy5jb25maWcubGV4ZW1lc1xuICAgIHJlYWRvbmx5IHByZWx1ZGUgPSB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgIHJlYWRvbmx5IHNldCA9IHRoaXMuZW52aXJvLnNldFxuICAgIHJlYWRvbmx5IHF1ZXJ5ID0gdGhpcy5lbnZpcm8ucXVlcnlcbiAgICByZWFkb25seSByb290ID0gdGhpcy5lbnZpcm8ucm9vdFxuICAgIHJlYWRvbmx5IGdldCA9IHRoaXMuZW52aXJvLmdldFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvOiBFbnZpcm8sIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby52YWx1ZXNcbiAgICB9XG5cbiAgICBnZXRMZXhlbWUgPSAocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICAgICAgICAgIC5hdCgwKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0IHN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bnRheExpc3RcbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHR5cGU6ICdncmFtbWFyJywgcm9vdDogc3ludGF4Lm5hbWUgfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGlmIChsZXhlbWUucm9vdCAmJiAhbGV4ZW1lLnRva2VuICYmIHRoaXMuX2xleGVtZXMuc29tZSh4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpKSB7XG4gICAgICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKGxleGVtZSlcbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKC4uLmxleGVtZS5leHRyYXBvbGF0ZSh0aGlzKSlcbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUsIGxleGVtZVR5cGVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3ByZWx1ZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBzeW50YXhlczogU3ludGF4TWFwXG4gICAgcmVhZG9ubHkgcHJlbHVkZTogc3RyaW5nW11cbiAgICByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzOiBsZXhlbWVzLmZsYXRNYXAoeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsID0gbWFrZUxleGVtZSh4KVxuICAgICAgICAgICAgcmV0dXJuIFtsLCAuLi5sLmV4dHJhcG9sYXRlKHt9IGFzIGFueSldXG4gICAgICAgIH0pLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IEJhc2ljQ29udGV4dCBmcm9tIFwiLi9CYXNpY0NvbnRleHRcIjtcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBFbnZpcm8ge1xuXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldExleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkXG5cbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRPcHRzIGV4dGVuZHMgR2V0RW52aXJvT3BzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3Q29udGV4dChvcHRzOiBHZXRDb250ZXh0T3B0cyk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KGdldEVudmlybyhvcHRzKSwgZ2V0Q29uZmlnKCkpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUxleGVtZSBpbXBsZW1lbnRzIExleGVtZSB7XG5cbiAgICBfcm9vdCA9IHRoaXMubmV3RGF0YT8uX3Jvb3RcbiAgICByZWFkb25seSByb290ID0gdGhpcy5uZXdEYXRhPy5yb290ID8/IHRoaXMuX3Jvb3Q/LnJvb3QhXG4gICAgcmVhZG9ubHkgdHlwZSA9IHRoaXMubmV3RGF0YT8udHlwZSA/PyB0aGlzLl9yb290Py50eXBlIVxuICAgIGNvbnRyYWN0aW9uRm9yID0gdGhpcy5uZXdEYXRhPy5jb250cmFjdGlvbkZvciA/PyB0aGlzLl9yb290Py5jb250cmFjdGlvbkZvclxuICAgIHRva2VuID0gdGhpcy5uZXdEYXRhPy50b2tlbiA/PyB0aGlzLl9yb290Py50b2tlblxuICAgIGNhcmRpbmFsaXR5ID0gdGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSA/PyB0aGlzLl9yb290Py5jYXJkaW5hbGl0eVxuICAgIHJlYWRvbmx5IGlzVmVyYiA9IHRoaXMudHlwZSA9PT0gJ212ZXJiJyB8fCB0aGlzLnR5cGUgPT09ICdpdmVyYidcbiAgICByZWFkb25seSBpc1BsdXJhbCA9IGlzUmVwZWF0YWJsZSh0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5KVxuICAgIHJlYWRvbmx5IGlzTXVsdGlXb3JkID0gdGhpcy5yb290LmluY2x1ZGVzKCcgJylcbiAgICByZWFkb25seSByZWZlcmVudCA9IHRoaXMubmV3RGF0YT8ucmVmZXJlbnQgPz8gdGhpcy5fcm9vdD8ucmVmZXJlbnRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBuZXdEYXRhPzogUGFydGlhbDxMZXhlbWU+XG4gICAgKSB7IH1cblxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ6IENvbnRleHQpOiBMZXhlbWVbXSB7XG5cbiAgICAgICAgaWYgKCh0aGlzLnR5cGUgPT09ICdub3VuJyB8fCB0aGlzLnR5cGUgPT09ICdncmFtbWFyJykgJiYgIXRoaXMuaXNQbHVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogcGx1cmFsaXplKHRoaXMucm9vdCksIGNhcmRpbmFsaXR5OiAnKicgfSldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZlcmIpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25qdWdhdGUodGhpcy5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiB4IH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG59IiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IGdldExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZ2V0TGV4ZW1lc1wiO1xuaW1wb3J0IHsgcmVzcGFjZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9yZXNwYWNlXCI7XG5pbXBvcnQgeyBzdGRzcGFjZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zdGRzcGFjZVwiO1xuaW1wb3J0IHsgam9pbk11bHRpV29yZExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvam9pbk11bHRpV29yZExleGVtZXNcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7IC8vIFRPRE86IG1ha2UgY2FzZSBpbnNlbnNpdGl2ZVxuXG4gICAgICAgIGNvbnN0IHdvcmRzID1cbiAgICAgICAgICAgIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHN0ZHNwYWNlKHNvdXJjZUNvZGUpLCBjb250ZXh0LmxleGVtZXMpXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG4gICAgICAgICAgICAgICAgLm1hcChzID0+IHJlc3BhY2UocykpXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSB3b3Jkcy5mbGF0TWFwKHcgPT4gZ2V0TGV4ZW1lcyh3LCBjb250ZXh0LCB3b3JkcykpXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEJhc2VMZXhlbWUgZnJvbSBcIi4vQmFzZUxleGVtZVwiXG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vLi4vYmFja2VuZC93cmFwcGVyL1dyYXBwZXJcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovICByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gIHR5cGU6IExleGVtZVR5cGVcbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqLyB0b2tlbj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gIGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW10gLy9UT0RPOiBMZXhlbWVbXVxuICAgIC8qKmZvciBxdWFudGFkaiAqLyBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgX3Jvb3Q/OiBQYXJ0aWFsPExleGVtZT5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0OiBDb250ZXh0KTogTGV4ZW1lW10gLy9UT0RPOiBvcHRpb25hbCBDb250ZXh0P1xuICAgIHJlYWRvbmx5IGlzUGx1cmFsOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNNdWx0aVdvcmQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc1ZlcmI6IGJvb2xlYW5cblxuICAgIHJlZmVyZW50PzogV3JhcHBlclxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxleGVtZShkYXRhOiBQYXJ0aWFsPExleGVtZT4pOiBMZXhlbWUge1xuICAgIHJldHVybiBuZXcgQmFzZUxleGVtZShkYXRhKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUodmVyYjpzdHJpbmcpe1xuICAgIHJldHVybiBbdmVyYisncyddXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY0xleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cbiAgICBjb25zdCByZWxldmFudCA9IHdvcmRzXG4gICAgLm1hcCh3ID0+IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiB3LCB0eXBlOiAnbm91bicgfSksICdYJykpXG4gICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LnF1ZXJ5KGMpKVxuICAgIC5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAuZmxhdE1hcChpZCA9PiBjb250ZXh0LmdldChpZCkgPz8gW10pXG4gICAgLmZsYXRNYXAoeCA9PiB4Py5keW5hbWljKCkuZmxhdE1hcCh4ID0+IFsuLi54LmV4dHJhcG9sYXRlKGNvbnRleHQpLCB4XSkpXG4gICAgLmZpbHRlcih4ID0+IHgudG9rZW4gPT09IHdvcmQgfHwgeC5yb290ID09PSB3b3JkKVxuXG4gICAgY29uc3QgaXNNYWNyb0NvbnRleHQgPVxuICAgICAgICB3b3Jkcy5zb21lKHggPT4gY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgPT09ICdncmFtbWFyJylcbiAgICAgICAgJiYgIXdvcmRzLnNvbWUoeCA9PiBbJ2RlZmFydCcsICdpbmRlZmFydCcsICdub25zdWJjb25qJ10uaW5jbHVkZXMoY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgYXMgYW55KSkvL1RPRE86IHdoeSBkZXBlbmRlbmNpZXMoJ21hY3JvJykgZG9lc24ndCB3b3JrPyFcblxuICAgIGNvbnN0IHR5cGUgPSByZWxldmFudFswXT8udHlwZSA/P1xuICAgICAgICAoaXNNYWNyb0NvbnRleHQgP1xuICAgICAgICAgICAgJ2dyYW1tYXInXG4gICAgICAgICAgICA6ICdub3VuJylcblxuICAgIHJldHVybiBtYWtlTGV4ZW1lKHsgdG9rZW46IHdvcmQsIHJvb3Q6IHJlbGV2YW50Py5hdCgwKT8ucm9vdCA/PyB3b3JkLCB0eXBlOiB0eXBlIH0pXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcbmltcG9ydCB7IGR5bmFtaWNMZXhlbWUgfSBmcm9tIFwiLi9keW5hbWljTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZVtdIHtcblxuICAgIGNvbnN0IGxleCA9IGNvbnRleHQuZ2V0TGV4ZW1lKHdvcmQpID8/XG4gICAgICAgIGR5bmFtaWNMZXhlbWUod29yZCwgY29udGV4dCwgd29yZHMpXG5cbiAgICByZXR1cm4gbGV4LmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4LmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgsIGNvbnRleHQsIHdvcmRzKSkgOlxuICAgICAgICBbbGV4XVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9zdGRzcGFjZVwiO1xuaW1wb3J0IHsgdW5zcGFjZSB9IGZyb20gXCIuL3Vuc3BhY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHNvdXJjZUNvZGU6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pIHtcblxuICAgIGxldCBuZXdTb3VyY2UgPSBzb3VyY2VDb2RlO1xuXG4gICAgbGV4ZW1lc1xuICAgICAgICAuZmlsdGVyKHggPT4geC5pc011bHRpV29yZClcbiAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXhlbWUgPSBzdGRzcGFjZSh4LnJvb3QpO1xuICAgICAgICAgICAgbmV3U291cmNlID0gbmV3U291cmNlLnJlcGxhY2VBbGwobGV4ZW1lLCB1bnNwYWNlKGxleGVtZSkpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBuZXdTb3VyY2U7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gcmVzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnLScsICcgJyk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBzdGRzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gdW5zcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnICcsICctJyk7XG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoYXN0OiBBc3ROb2RlKTogQXN0Tm9kZSB7XG5cbiAgICAgICAgaWYgKCFhc3QubGlua3MpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGUpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4uLy4uL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGVVbndyYXBwZWQodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICAgICAgICAgIG1haW4oKVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgc29sdmVNYXBzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3NvbHZlTWFwc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllc1xuICAgIH1cblxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGFib3V0ID0gKGlkOiBJZCk6IENsYXVzZSA9PiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lcnNPZihpZCkpXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gdGhpcy5jbGF1c2UxLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLmRlc2NyaWJlKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IG1vY2tNYXAgfSBmcm9tIFwiLi9mdW5jdGlvbnMvbW9ja01hcFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBCYXNpY0NsYXVzZShcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXA/LlthXSA/PyBhKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgIClcblxuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW3RoaXNdXG4gICAgYWJvdXQgPSAoaWQ6IElkKSA9PiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSA/IHRoaXMgOiBlbXB0eUNsYXVzZVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKSA9PiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSAmJiB0aGlzLmFyZ3MubGVuZ3RoID09PSAxID8gW3RoaXMucHJlZGljYXRlXSA6IFtdXG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGlmIChxdWVyeS5leGFjdElkcykge1xuICAgICAgICAgICAgcmV0dXJuIFttb2NrTWFwKHF1ZXJ5KV1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKHF1ZXJ5IGluc3RhbmNlb2YgQmFzaWNDbGF1c2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZWRpY2F0ZS5yb290ICE9PSBxdWVyeS5wcmVkaWNhdGUucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXAgPSBxdWVyeS5hcmdzXG4gICAgICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcblxuLyoqXG4gKiBBbiB1bmFtYmlndW91cyBwcmVkaWNhdGUtbG9naWMtbGlrZSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBwcm9ncmFtbWVyJ3MgaW50ZW50LlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkcz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXNcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXMuY29uZGl0aW9uXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzLmNvbnNlcXVlbmNlXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCkgKyB0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBzdWJqY29uaj86IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpID0+IG5ldyBJbXBseShcbiAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY29uc2VxdWVuY2UuY29weShvcHRzKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICBvcHRzPy5zdWJqY29uaiA/PyB0aGlzLnN1Ympjb25qLFxuICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzXG4gICAgKVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZXJzT2YoaWQpKVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCkgPT4gdGhpcy5jb25zZXF1ZW5jZS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICBhYm91dCA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHsvLyBUT0RPXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7XG4gICAgICAgICAgICBjbGF1c2UxOiB0aGlzLmNvbmRpdGlvbi5zaW1wbGUsXG4gICAgICAgICAgICBjbGF1c2UyOiB0aGlzLmNvbnNlcXVlbmNlLnNpbXBsZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy5jb25kaXRpb24uZW50aXRpZXMuY29uY2F0KHRoaXMuY29uc2VxdWVuY2UuZW50aXRpZXMpKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKTogSWRbXSB7XG5cbiAgICBjb25zdCBvd25lZEVudGl0aWVzID0gY2xhdXNlLm93bmVkQnkoZW50aXR5KVxuXG4gICAgcmV0dXJuIG93bmVkRW50aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgW2VudGl0eV0gOlxuICAgICAgICBbZW50aXR5XS5jb25jYXQoZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBvd25lZEVudGl0aWVzWzBdKSlcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCB7IHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvQ29uc3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBjYXNlIGluc2Vuc2l0aXZlIG5hbWVzLCBpZiBvbmUgdGltZSB2YXIgYWxsIHZhcnMhXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc1Zhcih4KSlcbiAgICAgICAgLm1hcChlID0+ICh7IFt0b0NvbnN0KGUpXTogZSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4uL0ltcGx5XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VJbXBseShjbGF1c2U6IENsYXVzZSkgeyAvLyBhbnkgY2xhdXNlIHdpdGggYW55IHZhciBpcyBhbiBpbXBseVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5KSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlLnJoZW1lID09PSBlbXB0eUNsYXVzZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5lbnRpdGllcy5zb21lKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIHx8IGNsYXVzZS5mbGF0TGlzdCgpLnNvbWUoeCA9PiAhIXgucHJlZGljYXRlPy5pc1BsdXJhbCkpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZS50aGVtZS5pbXBsaWVzKGNsYXVzZS5yaGVtZSlcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhdXNlXG59XG4iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2NrTWFwKGNsYXVzZTogQ2xhdXNlKTogTWFwIHtcbiAgICByZXR1cm4gY2xhdXNlLmVudGl0aWVzLm1hcChlID0+ICh7IFtlXTogZSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuXG4vL1RPRE86IGNvbnNpZGVyIG1vdmluZyB0byBDbGF1c2UuY29weSh7bmVnYXRlfSkgISEhISFcbmV4cG9ydCBmdW5jdGlvbiBuZWdhdGUoY2xhdXNlOiBDbGF1c2UsIG5lZ2F0ZTogYm9vbGVhbikge1xuXG4gICAgaWYgKCFuZWdhdGUpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZVxuICAgIH1cblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IGNsYXVzZTE6IGNsYXVzZS50aGVtZS5zaW1wbGUsIGNsYXVzZTI6IGNsYXVzZS5yaGVtZS5zaW1wbGUuY29weSh7IG5lZ2F0ZSB9KSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IHRvVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy90b1ZhclwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGFnYXRlVmFyc093bmVkKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHsgLy8gYW55dGhpbmcgb3duZWQgYnkgYSB2YXIgc2hvdWxkIGJlIGFsc28gYmUgYSB2YXJcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLmZpbHRlcihlID0+IGlzVmFyKGUpKVxuICAgICAgICAuZmxhdE1hcChlID0+IGNsYXVzZS5vd25lZEJ5KGUpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW2VdOiB0b1ZhcihlKSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQW5hcGhvcmEoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS50aGVtZS5xdWVyeShjbGF1c2UucmhlbWUpWzBdXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtID8/IHt9IH0pXG5cbn1cbiIsImltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9pZC9NYXBcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaW50ZXJzZWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2ludGVyc2VjdGlvblwiO1xuaW1wb3J0IHsgU3BlY2lhbElkcyB9IGZyb20gXCIuLi8uLi9pZC9JZFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG4vKipcbiAqIEZpbmRzIHBvc3NpYmxlIE1hcC1pbmdzIGZyb20gcXVlcnlMaXN0IHRvIHVuaXZlcnNlTGlzdFxuICoge0BsaW5rIFwiZmlsZTovLy4vLi4vLi4vLi4vLi4vLi4vZG9jcy9ub3Rlcy91bmlmaWNhdGlvbi1hbGdvLm1kXCJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb2x2ZU1hcHMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdIHtcblxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBmaW5kQ2FuZGlkYXRlcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgIGNhbmRpZGF0ZXMuZm9yRWFjaCgobWwxLCBpKSA9PiB7XG4gICAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaCgobWwyLCBqKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtbDEubGVuZ3RoICYmIG1sMi5sZW5ndGggJiYgaSAhPT0gaikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlKG1sMSwgbWwyKVxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbaV0gPSBbXVxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXNbal0gPSBtZXJnZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gY2FuZGlkYXRlcy5mbGF0KCkuZmlsdGVyKHggPT4gIWlzSW1wb3NpYmxlKHgpKVxufVxuXG5mdW5jdGlvbiBmaW5kQ2FuZGlkYXRlcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW11bXSB7XG4gICAgcmV0dXJuIHF1ZXJ5TGlzdC5tYXAocSA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHVuaXZlcnNlTGlzdC5mbGF0TWFwKHUgPT4gdS5xdWVyeShxKSlcbiAgICAgICAgcmV0dXJuIHJlcy5sZW5ndGggPyByZXMgOiBbbWFrZUltcG9zc2libGUocSldXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gbWVyZ2UobWwxOiBNYXBbXSwgbWwyOiBNYXBbXSkge1xuXG4gICAgY29uc3QgbWVyZ2VkOiBNYXBbXSA9IFtdXG5cbiAgICBtbDEuZm9yRWFjaChtMSA9PiB7XG4gICAgICAgIG1sMi5mb3JFYWNoKG0yID0+IHtcblxuICAgICAgICAgICAgaWYgKG1hcHNBZ3JlZShtMSwgbTIpKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkLnB1c2goeyAuLi5tMSwgLi4ubTIgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gdW5pcShtZXJnZWQpXG59XG5cbmZ1bmN0aW9uIG1hcHNBZ3JlZShtMTogTWFwLCBtMjogTWFwKSB7XG4gICAgY29uc3QgY29tbW9uS2V5cyA9IGludGVyc2VjdGlvbihPYmplY3Qua2V5cyhtMSksIE9iamVjdC5rZXlzKG0yKSlcbiAgICByZXR1cm4gY29tbW9uS2V5cy5ldmVyeShrID0+IG0xW2tdID09PSBtMltrXSlcbn1cblxuZnVuY3Rpb24gbWFrZUltcG9zc2libGUocTogQ2xhdXNlKTogTWFwIHtcbiAgICByZXR1cm4gcS5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgW3hdOiBTcGVjaWFsSWRzLklNUE9TU0lCTEUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxufVxuXG5mdW5jdGlvbiBpc0ltcG9zaWJsZShtYXA6IE1hcCkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG1hcCkuaW5jbHVkZXMoU3BlY2lhbElkcy5JTVBPU1NJQkxFKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRvcExldmVsKGNsYXVzZTogQ2xhdXNlKSB7XG4gICAgcmV0dXJuIGNsYXVzZVxuICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IHgsIG93bmVyczogY2xhdXNlLm93bmVyc09mKHgpIH0pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5vd25lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAubWFwKHggPT4geC54KVxufSIsIlxuLyoqXG4gKiBJZCBvZiBhbiBlbnRpdHkuXG4gKi9cbmV4cG9ydCB0eXBlIElkID0gc3RyaW5nXG5cbi8qKlxuICogU29tZSBzcGVjaWFsIElkc1xuICovXG5leHBvcnQgY29uc3QgU3BlY2lhbElkcyA9IHtcbiAgICBJTVBPU1NJQkxFOiAnSU1QT1NTSUJMRSdcbn1cbiIsImltcG9ydCB7IHRvVmFyIH0gZnJvbSBcIi4vdG9WYXJcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0SW5jcmVtZW50YWxJZE9wdHMge1xuICAgIGFzVmFyOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmNyZW1lbnRhbElkKG9wdHM/OiBHZXRJbmNyZW1lbnRhbElkT3B0cyk6IElkIHtcbiAgICBjb25zdCBuZXdJZCA9IGBpZCR7aWRHZW5lcmF0b3IubmV4dCgpLnZhbHVlfWA7XG4gICAgcmV0dXJuIG9wdHM/LmFzVmFyID8gdG9WYXIobmV3SWQpIDogbmV3SWQ7XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SW5jcmVtZW50YWxJZEdlbmVyYXRvcigpO1xuXG5mdW5jdGlvbiogZ2V0SW5jcmVtZW50YWxJZEdlbmVyYXRvcigpIHtcbiAgICBsZXQgeCA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrO1xuICAgICAgICB5aWVsZCB4O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpZFRvTnVtKGlkOiBJZCkge1xuICAgIHJldHVybiBwYXJzZUludChpZC50b1N0cmluZygpLnJlcGxhY2VBbGwoL1xcRCsvZywgJycpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFyKGU6IElkKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIoZSkpICYmIChlLnRvU3RyaW5nKClbMF0gPT09IGUudG9TdHJpbmcoKVswXS50b1VwcGVyQ2FzZSgpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5pbXBvcnQgeyBpZFRvTnVtIH0gZnJvbSBcIi4vaWRUb051bVwiO1xuXG4vKipcbiAqIFNvcnQgaWRzIGluIGFzY2VuZGluZyBvcmRlci5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc29ydElkcyhpZHM6IElkW10pIHtcbiAgICByZXR1cm4gaWRzLnNvcnQoKGEsIGIpID0+IGlkVG9OdW0oYSkgLSBpZFRvTnVtKGIpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcihpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9VcHBlckNhc2UoKTtcbn1cbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgbWFrZUFsbFZhcnMgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlQWxsVmFyc1wiXG5pbXBvcnQgeyBtYWtlSW1wbHkgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlSW1wbHlcIlxuaW1wb3J0IHsgbmVnYXRlIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvbmVnYXRlXCJcbmltcG9ydCB7IHByb3BhZ2F0ZVZhcnNPd25lZCB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL3Byb3BhZ2F0ZVZhcnNPd25lZFwiXG5pbXBvcnQgeyByZXNvbHZlQW5hcGhvcmEgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmFcIlxuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCJcbmltcG9ydCB7IHRvVmFyIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vaWQvSWRcIlxuXG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oJ0FzdCBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuICAgIFxuICAgIGlmIChhc3QubGV4ZW1lKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXN0LmxleGVtZS50eXBlID09PSAnbm91bicgfHwgYXN0LmxleGVtZS50eXBlID09PSAnYWRqZWN0aXZlJyB8fCBhc3QubGV4ZW1lLnR5cGUgPT09ICdwcm9ub3VuJyB8fCBhc3QubGV4ZW1lLnR5cGUgPT09ICdncmFtbWFyJykge1xuICAgICAgICAgICAgcmV0dXJuIGNsYXVzZU9mKGFzdC5sZXhlbWUsIC4uLmFyZ3M/LnN1YmplY3QgPyBbYXJncz8uc3ViamVjdF0gOiBbXSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGFzdC5saXN0Lm1hcChjID0+IHRvQ2xhdXNlKGMsIGFyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UpXG4gICAgfVxuICAgIFxuICAgIFxuICAgIGxldCByZXN1bHRcbiAgICBsZXQgcmVsXG5cbiAgICBpZiAoYXN0Py5saW5rcz8ucmVscHJvbiAmJiBhc3QubGlua3MuY29wdWxhKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9ZWxzZSBpZiAoYXN0Py5saW5rcz8ucmVscHJvbiAmJiBhc3QubGlua3MubXZlcmIpe1xuICAgICAgICByZXN1bHQgPSBtdmVyYlN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGlzQ29wdWxhU2VudGVuY2UoYXN0KSkge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8ubm9uc3ViY29uaikge1xuICAgICAgICByZXN1bHQgPSBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKHJlbCA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZSB8fCBhc3QubGlua3M/Lm12ZXJiPy5sZXhlbWUgfHwgYXN0LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlbGF0aW9uVG9DbGF1c2UoYXN0LCByZWwsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMCA9IGFzdC5saW5rcz8ubm9uc3ViY29uaiA/IHJlc3VsdCA6IG1ha2VJbXBseShyZXN1bHQpXG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMoYzApXG4gICAgICAgIGNvbnN0IGMyID0gcmVzb2x2ZUFuYXBob3JhKGMxKVxuICAgICAgICBjb25zdCBjMyA9IHByb3BhZ2F0ZVZhcnNPd25lZChjMilcbiAgICAgICAgY29uc3QgYzQgPSBuZWdhdGUoYzMsICEhYXN0Py5saW5rcz8ubmVnYXRpb24pXG4gICAgICAgIGNvbnN0IGM1ID0gYzQuY29weSh7IHNpZGVFZmZlY3R5OiBjNC5yaGVtZSAhPT0gZW1wdHlDbGF1c2UgfSlcbiAgICAgICAgcmV0dXJuIGM1XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJyR7YXN0LnR5cGV9JyFgKVxuXG59XG5cbmNvbnN0IGlzQ29wdWxhU2VudGVuY2UgPSAoYXN0PzogQXN0Tm9kZSkgPT4gISFhc3Q/LmxpbmtzPy5jb3B1bGFcblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG5cbiAgICByZXR1cm4gc3ViamVjdC5hbmQocHJlZGljYXRlLCB7IGFzUmhlbWU6IHRydWUgfSlcbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuICAgIHJldHVybiB0b0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIG12ZXJiU3ViQ2xhdXNlVG9DbGF1c2UoYXN0OkFzdE5vZGUsIGFyZ3M/OlRvQ2xhdXNlT3B0cykvKiA6Q2xhdXNlICoveyBcbiAgICBcbiAgICBjb25zdCBtdmVyYiA9IGFzdC5saW5rcz8ubXZlcmI/LmxleGVtZSFcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0IVxuICAgIGNvbnN0IG9iamVjdElkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgb2JqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5vYmplY3QsIHtzdWJqZWN0IDogb2JqZWN0SWR9KSAvLyBcbiAgICBcbiAgICByZXR1cm4gb2JqZWN0LmFuZChjbGF1c2VPZihtdmVyYiwgc3ViamVjdElkLCBvYmplY3RJZCkpXG5cbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKG5vdW5QaHJhc2U6IEFzdE5vZGUsIG9wdHM/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbWF5YmVJZCA9IG9wdHM/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZT8ubGlua3M/LnVuaXF1YW50ID8gdG9WYXIobWF5YmVJZCkgOiBtYXliZUlkXG4gICAgY29uc3QgYXJncyA9IHsgc3ViamVjdDogc3ViamVjdElkIH1cblxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG5vdW5QaHJhc2UubGlua3MgPz8ge30pXG4gICAgICAgIC5tYXAoeCA9PiB0b0NsYXVzZSh4LCBhcmdzKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbn1cblxuZnVuY3Rpb24gcmVsYXRpb25Ub0NsYXVzZShhc3Q6IEFzdE5vZGUsIHJlbDogTGV4ZW1lLCBvcHRzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IG9wdHM/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgb2JqSWQgPSBnZXRJbmNyZW1lbnRhbElkKClcblxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViaklkIH0pXG4gICAgY29uc3Qgb2JqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqSWQgfSlcblxuICAgIGNvbnN0IGFyZ3MgPSBvYmplY3QgPT09IGVtcHR5Q2xhdXNlID8gW3N1YmpJZF0gOiBbc3ViaklkLCBvYmpJZF1cbiAgICBjb25zdCByZWxhdGlvbiA9IGNsYXVzZU9mKHJlbCwgLi4uYXJncylcbiAgICBjb25zdCByZWxhdGlvbklzUmhlbWUgPSBzdWJqZWN0ICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgcmV0dXJuIHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmVsYXRpb24sIHsgYXNSaGVtZTogcmVsYXRpb25Jc1JoZW1lIH0pXG5cbn1cblxuZnVuY3Rpb24gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmNvbmogPSBhc3QubGlua3M/LnN1YmNvbmo/LmxleGVtZVxuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uZGl0aW9uLCBhcmdzKVxuICAgIGNvbnN0IGNvbnNlcXVlbmNlID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5jb25zZXF1ZW5jZSwgYXJncylcbiAgICByZXR1cm4gY29uZGl0aW9uLmltcGxpZXMoY29uc2VxdWVuY2UpLmNvcHkoeyBzdWJqY29uajogc3ViY29uaiB9KVxuXG59XG5cbmZ1bmN0aW9uIGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IGxlZnQgPSB0b0NsYXVzZShhc3QubGlua3M/LmxlZnQsIGFyZ3MpXG4gICAgY29uc3QgcmlnaHQgPSB0b0NsYXVzZShhc3Q/LmxpbmtzPy5yaWdodD8ubGlzdD8uWzBdLCBhcmdzKVxuXG4gICAgaWYgKGFzdC5saW5rcz8ubGVmdD8udHlwZSA9PT0gYXN0LmxpbmtzPy5yaWdodD8udHlwZSkge1xuICAgICAgICByZXR1cm4gbGVmdC5hbmQocmlnaHQpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbSA9IHsgW3JpZ2h0LmVudGl0aWVzWzBdXTogbGVmdC5lbnRpdGllc1swXSB9XG4gICAgICAgIGNvbnN0IHRoZW1lID0gbGVmdC50aGVtZS5hbmQocmlnaHQudGhlbWUpXG4gICAgICAgIGNvbnN0IHJoZW1lID0gcmlnaHQucmhlbWUuYW5kKHJpZ2h0LnJoZW1lLmNvcHkoeyBtYXA6IG0gfSkpXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgIH1cblxufSIsIlxuXG5leHBvcnQgZnVuY3Rpb24gYWxsS2V5cyhvYmplY3Q6IG9iamVjdCwgaXRlciA9IDUpIHtcblxuICAgIGxldCBvYmogPSBvYmplY3RcbiAgICBsZXQgcmVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICB3aGlsZSAob2JqICYmIGl0ZXIpIHtcbiAgICAgICAgcmVzID0gWy4uLnJlcywgLi4uT2JqZWN0LmtleXMob2JqKV1cbiAgICAgICAgcmVzID0gWy4uLnJlcywgLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKV1cbiAgICAgICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iailcbiAgICAgICAgaXRlci0tXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xufSIsImltcG9ydCB7IG5ld0luc3RhbmNlIH0gZnJvbSBcIi4vbmV3SW5zdGFuY2VcIlxuXG5leHBvcnQgZnVuY3Rpb24gZGVlcENvcHkob2JqZWN0OiBvYmplY3QpIHtcblxuICAgIGlmICghKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZCA9IG9iamVjdC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgcmV0dXJuIHdyYXBwZWRcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG5ld0luc3RhbmNlKG9iamVjdClcbiAgICB9XG5cbiAgICAvLyBpZiAob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAvLyAgICAgY29uc3Qgd3JhcHBlZCA9IG9iamVjdC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnRcbiAgICAvLyAgICAgd3JhcHBlZC5pbm5lckhUTUwgPSBvYmplY3QuaW5uZXJIVE1MXG4gICAgLy8gICAgIHJldHVybiB3cmFwcGVkXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgLy8gcmV0dXJuIHsgLi4ub2JqZWN0IH1cbiAgICAvLyAgICAgcmV0dXJuIHsgX19wcm90b19fOiBvYmplY3QgfVxuICAgIC8vIH1cblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJpbXBvcnQgeyB0YWdOYW1lRnJvbVByb3RvIH0gZnJvbSBcIi4vdGFnTmFtZUZyb21Qcm90b1wiXG5cbi8qKlxuICogXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYW4gb2JqZWN0IChldmVuIEhUTUxFbGVtZW50KSBmcm9tIGEgcHJvdG90eXBlLlxuICogSW4gY2FzZSBpdCdzIGEgbnVtYmVyLCBubyBuZXcgaW5zdGFuY2UgaXMgbWFkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ld0luc3RhbmNlKHByb3RvOiBvYmplY3QsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBpZiAocHJvdG8gPT09IE51bWJlci5wcm90b3R5cGUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXJnc1swXSlcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/XG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZUZyb21Qcm90byhwcm90bykpIDpcbiAgICAgICAgbmV3IChwcm90byBhcyBhbnkpLmNvbnN0cnVjdG9yKC4uLmFyZ3MpXG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzZXROZXN0ZWQob2JqZWN0OiBhbnksIHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICBsZXQgeCA9IG9iamVjdFxuXG4gICAgcGF0aC5zbGljZSgwLCAtMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgeCA9IHhbcF1cbiAgICB9KVxuXG4gICAgeFtwYXRoLmF0KC0xKSFdID0gdmFsdWVcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiXG4vKipcbiAqIFRyeSBnZXR0aW5nIHRoZSBuYW1lIG9mIGFuIGh0bWwgZWxlbWVudCBmcm9tIGEgcHJvdG90eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IG9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgLnJlcGxhY2UoJ0hUTUwnLCAnJylcbiAgICAucmVwbGFjZSgnRWxlbWVudCcsICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgbGV0IHNlZW4gPSB7fSBhcyBhbnlcblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsImltcG9ydCB7IHRlc3QxIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDFcIlxuaW1wb3J0IHsgdGVzdDEwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEwXCJcbmltcG9ydCB7IHRlc3QxMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxMVwiXG5pbXBvcnQgeyB0ZXN0MTIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTJcIlxuaW1wb3J0IHsgdGVzdDEzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDEzXCJcbmltcG9ydCB7IHRlc3QxNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxNFwiXG5pbXBvcnQgeyB0ZXN0MTUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MTVcIlxuaW1wb3J0IHsgdGVzdDE2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE2XCJcbmltcG9ydCB7IHRlc3QxNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxN1wiXG5pbXBvcnQgeyB0ZXN0MTggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MThcIlxuaW1wb3J0IHsgdGVzdDE5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDE5XCJcbmltcG9ydCB7IHRlc3QyIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDJcIlxuaW1wb3J0IHsgdGVzdDIwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIwXCJcbmltcG9ydCB7IHRlc3QyMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyMVwiXG5pbXBvcnQgeyB0ZXN0MjIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjJcIlxuaW1wb3J0IHsgdGVzdDIzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDIzXCJcbmltcG9ydCB7IHRlc3QyNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyNFwiXG5pbXBvcnQgeyB0ZXN0MjUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjVcIlxuaW1wb3J0IHsgdGVzdDI2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI2XCJcbmltcG9ydCB7IHRlc3QyNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyN1wiXG5pbXBvcnQgeyB0ZXN0MjggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MjhcIlxuaW1wb3J0IHsgdGVzdDI5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDI5XCJcbmltcG9ydCB7IHRlc3QzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDNcIlxuaW1wb3J0IHsgdGVzdDMwIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMwXCJcbmltcG9ydCB7IHRlc3QzMSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzMVwiXG5pbXBvcnQgeyB0ZXN0MzIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzJcIlxuaW1wb3J0IHsgdGVzdDMzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdDMzXCJcbmltcG9ydCB7IHRlc3QzNCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzNFwiXG5pbXBvcnQgeyB0ZXN0MzUgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzVcIlxuaW1wb3J0IHsgdGVzdDM2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDM2XCJcbmltcG9ydCB7IHRlc3QzNyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzN1wiXG5pbXBvcnQgeyB0ZXN0MzggfSBmcm9tIFwiLi90ZXN0cy90ZXN0MzhcIlxuaW1wb3J0IHsgdGVzdDQgfSBmcm9tIFwiLi90ZXN0cy90ZXN0NFwiXG5pbXBvcnQgeyB0ZXN0NSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q1XCJcbmltcG9ydCB7IHRlc3Q2IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDZcIlxuaW1wb3J0IHsgdGVzdDcgfSBmcm9tIFwiLi90ZXN0cy90ZXN0N1wiXG5pbXBvcnQgeyB0ZXN0OCB9IGZyb20gXCIuL3Rlc3RzL3Rlc3Q4XCJcbmltcG9ydCB7IHRlc3Q5IH0gZnJvbSBcIi4vdGVzdHMvdGVzdDlcIlxuaW1wb3J0IHsgY2xlYXJEb20gfSBmcm9tIFwiLi91dGlscy9jbGVhckRvbVwiXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gXCIuL3V0aWxzL3NsZWVwXCJcblxuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuICAgIHRlc3QxOCxcbiAgICB0ZXN0MTksXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG4gICAgdGVzdDI2LFxuICAgIHRlc3QyNyxcbiAgICB0ZXN0MjgsXG4gICAgdGVzdDI5LFxuICAgIHRlc3QzMCxcbiAgICB0ZXN0MzEsXG4gICAgLy8gdGVzdDMyLFxuICAgIHRlc3QzMyxcbiAgICB0ZXN0MzQsXG4gICAgdGVzdDM1LFxuICAgIHRlc3QzNixcbiAgICB0ZXN0MzcsXG4gICAgdGVzdDM4LFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gdGVzdCgpXG4gICAgICAgIGNvbnNvbGUubG9nKGAlYyR7c3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsJ30gJHt0ZXN0Lm5hbWV9YCwgYGNvbG9yOiR7c3VjY2VzcyA/ICdncmVlbicgOiAncmVkJ31gKVxuICAgICAgICBhd2FpdCBzbGVlcCgxMCkvLzc1XG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uIHogaXMgYSBibHVlIGJ1dHRvbi4gdGhlIHJlZCBidXR0b24uIGl0IGlzIGJsYWNrLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmx1ZSc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDExKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd3IGFuZCB6IGFyZSBibGFjaycpO1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZDtcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0MyAmJiBhc3NlcnQ0O1xuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYXBwZW5kQ2hpbGRzIHknKTtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3knKVswXSk7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgLy8gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbiBhbmQgdGhlIGJ1dHRvbiBpcyBncmVlbicpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4gaXQgaXMgZ3JlZW4nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZCBhbmQgeiBpcyBncmVlbi4nKTtcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKTtcblxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MjtcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE1KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gZXZlcnkgYnV0dG9uIGlzIGJsdWUuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneiBpcyByZWQuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZXZlcnkgYnV0dG9uIGlzIG5vdCBibHVlLicpO1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG5cbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBoaWRkZW4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLmhpZGRlbjtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIG5vdCBoaWRkZW4nKTtcbiAgICBjb25zdCBhc3NlcnQyID0gIWJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5oaWRkZW47XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0Mjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QxNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcblxuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24nKTtcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdO1xuICAgIHgub25jbGljayA9ICgpID0+IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBjbGlja3MnKTtcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcblxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDE4KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG5cbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZXZlcnkgcmVkIGJ1dHRvbiBpcyBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xuXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MTkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIGlmIHggaXMgcmVkIHRoZW4geSBpcyBhIGdyZWVuIGJ1dHRvbicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgY29uc3QgdjEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCB2MiA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LnZhbHVlcy5sZW5ndGg7XG4gICAgcmV0dXJuIHYyIC0gdjEgPT09IDE7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24gaWYgeCBpcyByZWQnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBjb2xvciBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYW5kIHogYXJlIHJlZC4geCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpO1xuICAgIGxldCBjbGlja3MgPSAnJztcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0ub25jbGljayA9ICgpID0+IGNsaWNrcyArPSAneCc7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IGJ1dHRvbiBjbGlja3MnKTtcbiAgICByZXR1cm4gY2xpY2tzID09PSAneHknO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgcmVkIGFuZCB5IGlzIGJsdWUnKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDI7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MjYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbnMgYXJlIHJlZCcpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QyNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQuIHogaXMgYmx1ZS4nKTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdyZWQgYnV0dG9ucyBhcmUgYmxhY2snKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibHVlJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYmxhY2sgYnV0dG9ucycpLmxlbmd0aCA9PT0gMjtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYm9yZGVyIG9mIHN0eWxlIG9mIHggaXMgZG90dGVkLXllbGxvdycpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5ib3JkZXIuaW5jbHVkZXMoJ2RvdHRlZCB5ZWxsb3cnKTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDI5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgMSBhbmQgeSBpcyAyJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBhZGRzIHknKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnaXQnKVswXSA9PT0gMztcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJsYWNrIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjayc7XG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJz0gIGlzIGEgY29wdWxhJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCA9IHJlZCBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDMxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMuIHggaXMgZ3JlZW4gYW5kIHkgaXMgcmVkLicpO1xuICAgIGNvbnN0IHJlcyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2NvbG9yIG9mIHRoZSByZWQgYnV0dG9uJyk7XG4gICAgcmV0dXJuIHJlcy5pbmNsdWRlcygncmVkJykgJiYgIXJlcy5pbmNsdWRlcygnZ3JlZW4nKTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICAvLyBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgcmVkIGRpdiBhbmQgdGhlIHdpZHRoIG9mIHN0eWxlIG9mIHRoZSBkaXYgaXMgNTB2dycpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBkaXYuIHRoZSB3aWR0aCBvZiBzdHlsZSBvZiBpdCBpcyA1MHZ3Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBkaXYnKVswXS5zdHlsZS53aWR0aCA9PT0gJzUwdncnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSByZWQgYnV0dG9uJyk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgnZmcgb2YgYW55IGJ1dHRvbiBpcyBjb2xvciBvZiBzdHlsZSBvZiBpdCcpO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2ZnIG9mIHggaXMgeWVsbG93Jyk7XG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5jb2xvciA9PT0gJ3llbGxvdyc7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MzUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpO1xuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdzb21ldGhpbmcgYnV0dG9uJykubGVuZ3RoID09PSAwO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ2EgY2FyIGlzIGEgdGhpbmcnKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBjYXJzJyk7XG4gICAgYnJhaW4uZXhlY3V0ZSgnb3ZlcnRha2UgaXMgYW4gbXZlcmInKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IG92ZXJ0YWtlcyB5Jyk7XG5cbiAgICBjb25zdCBmaXJzdEludGVuc2lvbiA9IGJyYWluLmV4ZWN1dGUoJ3RoZSBjYXIgdGhhdCBvdmVydGFrZXMgeScpWzBdO1xuICAgIGNvbnN0IHNlY29uZEludGVuc2lvbiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXTtcbiAgICBjb25zdCBmYWxzZVNlY29uZEludGVuc2lvbiA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXTtcblxuICAgIHJldHVybiBmaXJzdEludGVuc2lvbiA9PT0gc2Vjb25kSW50ZW5zaW9uXG4gICAgICAgICYmIGZpcnN0SW50ZW5zaW9uICE9PSBmYWxzZVNlY29uZEludGVuc2lvbjtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZCcpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDM4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKTtcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geSBpcyBncmVlbicpO1xuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYXBwZW5kQ2hpbGRzIHknKTtcbiAgICBicmFpbi5leGVjdXRlKCd6IGlzIGFuIHgnKTtcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneicpWzBdLmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbic7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdidXR0b24nKTtcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWQ7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pO1xuICAgIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnO1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCc7XG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJztcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDM7XG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KTtcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2J1dHRvbicpWzBdLnRleHRDb250ZW50ID09PSAnY2FwcmEnO1xuICAgIHJldHVybiBhc3NlcnQxO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSk7XG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3JlZCBidXR0b24nKS5sZW5ndGggPT09IDA7XG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2dyZWVuIGJ1dHRvbicpLmxlbmd0aCA9PT0gMTtcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGNvbnN0IHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JylcbiAgICBkb2N1bWVudC5ib2R5ID0geFxufSIsImV4cG9ydCBmdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=