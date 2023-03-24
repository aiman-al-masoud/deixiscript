/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
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
const main_1 = __importDefault(__webpack_require__(/*! ./src/main/main */ "./app/src/main/main.ts"));
const autotester_1 = __importDefault(__webpack_require__(/*! ./tests/autotester */ "./app/tests/autotester.ts"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, autotester_1.default)();
    (0, main_1.default)();
}))();


/***/ }),

/***/ "./app/src/backend/actions/CreateLexemeAction.ts":
/*!*******************************************************!*\
  !*** ./app/src/backend/actions/CreateLexemeAction.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
class CreateLexemeAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d, _e;
        if (!context.lexemeTypes.includes((_a = this.clause.predicate) === null || _a === void 0 ? void 0 : _a.root) && !this.topLevel.rheme.flatList().some(x => { var _a; return (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.isConcept; })) {
            return;
        }
        const name = this.topLevel.theme.describe(this.clause.args[0])[0].root; //TODO: could be undefined        
        const type = (context.lexemeTypes.includes((_b = this.clause.predicate) === null || _b === void 0 ? void 0 : _b.root) ? (_c = this.clause.predicate) === null || _c === void 0 ? void 0 : _c.root : 'adjective');
        const concepts = type === 'noun' ? [] : type === 'adjective' ? [(_d = this.clause.predicate) === null || _d === void 0 ? void 0 : _d.root].flatMap(x => x !== null && x !== void 0 ? x : []).filter(x => x !== name) /* HEEEEEEEERE */ : undefined;
        const res = (_e = this.topLevel.query($('proto', 'X')).at(0)) === null || _e === void 0 ? void 0 : _e['X'];
        const proto = res ? this.topLevel.describe(res).map(x => x.root).filter(x => x !== 'proto')[0] : undefined;
        const lexeme = (0, Lexeme_1.makeLexeme)({
            root: name,
            type: type,
            proto: proto,
            concepts: concepts
        });
        context.setLexeme(lexeme);
    }
}
exports["default"] = CreateLexemeAction;
const $ = (p, ...args) => (0, Clause_1.clauseOf)((0, Lexeme_1.makeLexeme)({ root: p, type: 'noun' }), ...args);


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
        context.query(this.clause.theme).forEach(m => {
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
        const condition = this.clause.theme;
        const consequence = this.clause.rheme;
        const top = (0, topLevel_1.getTopLevel)(condition)[0]; //TODO (!ASSUME!) same as top in conclusion
        const alias = (0, getOwnershipChain_1.getOwnershipChain)(condition, top).slice(1);
        const props = (0, getOwnershipChain_1.getOwnershipChain)(consequence, top).slice(1);
        const concept = alias.map(x => condition.describe(x)[0]); // assume at least one name
        const path = props.map(x => consequence.describe(x)[0]).map(x => x.root); // same ...
        const lexeme = condition.describe(top)[0]; // assume one 
        lexeme.setAlias(concept[0].root, path);
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
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const getKool_1 = __webpack_require__(/*! ../../middle/clauses/functions/getKool */ "./app/src/middle/clauses/functions/getKool.ts");
class SimpleAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (!this.clause.args || !this.clause.predicate) {
            return;
        }
        const args = this.clause
            .args
            .map(x => { var _a; return (_a = (0, getKool_1.getKool)(context, this.topLevel.theme, x)[0]) !== null && _a !== void 0 ? _a : context.set((0, getIncrementalId_1.getIncrementalId)(), []); });
        const subject = args[0];
        const object = args[1];
        const res = subject === null || subject === void 0 ? void 0 : subject.set(this.clause.predicate, { args: object ? [object] : [], context, negated: this.clause.negated });
        if (res) {
            context.set((0, getIncrementalId_1.getIncrementalId)(), [], res);
        }
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
    if (topLevel.flatList().some(x => { var _a; return ((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'grammar'; })
        || topLevel.rheme.flatList().some(x => { var _a; return (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.isConcept; })) {
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
const Wrapper_1 = __webpack_require__(/*! ../wrapper/Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
class BaseEnviro {
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
        this.get = (id) => {
            this.lastReferenced = id;
            return this.dictionary[id];
        };
        this.set = (id, preds, object) => {
            this.lastReferenced = id;
            return this.dictionary[id] = (0, Wrapper_1.wrap)({ id, preds, object });
        };
        this.query = (query) => {
            const universe = this.values
                .map(w => w.toClause(query))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            return universe.query(query, { it: this.lastReferenced });
        };
    }
    get values() {
        return Object.values(this.dictionary);
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
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const allKeys_1 = __webpack_require__(/*! ../../utils/allKeys */ "./app/src/utils/allKeys.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../middle/clauses/functions/topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
const typeOf_1 = __webpack_require__(/*! ./typeOf */ "./app/src/backend/wrapper/typeOf.ts");
const deepCopy_1 = __webpack_require__(/*! ../../utils/deepCopy */ "./app/src/utils/deepCopy.ts");
const newInstance_1 = __webpack_require__(/*! ../../utils/newInstance */ "./app/src/utils/newInstance.ts");
class BaseWrapper {
    constructor(object, id, preds, parent, name) {
        this.object = object;
        this.id = id;
        this.parent = parent;
        this.name = name;
        this.predicates = [];
        this.is = (predicate) => {
            var _a;
            return this._get((_a = predicate === null || predicate === void 0 ? void 0 : predicate.concepts) === null || _a === void 0 ? void 0 : _a[0]) === predicate.root
                || this.predicates.map(x => x.root).includes(predicate.root);
        };
        this.copy = (opts) => {
            var _a, _b;
            return new BaseWrapper((_a = opts === null || opts === void 0 ? void 0 : opts.object) !== null && _a !== void 0 ? _a : (0, deepCopy_1.deepCopy)(this.object), this.id, ((_b = opts === null || opts === void 0 ? void 0 : opts.preds) !== null && _b !== void 0 ? _b : []).concat(this.predicates));
        };
        this.dynamic = () => (0, allKeys_1.allKeys)(this.object).map(x => (0, Lexeme_1.makeLexeme)({
            type: (0, typeOf_1.typeOf)(this._get(x)),
            root: x
        }));
        this.unwrap = () => this.object;
        preds.forEach(p => this.set(p));
    }
    call(verb, args) {
        const method = this._get(verb.root);
        return method.call(this.object, ...args.map(x => x.unwrap()));
    }
    toClause(query) {
        const ks = this.predicates.flatMap(x => x.heirlooms.flatMap(x => x.name));
        return ks
            .map(x => this._get(x))
            .map(x => (0, Lexeme_1.makeLexeme)({ root: x, type: 'adjective' }))
            .concat(this.predicates)
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause)
            .and(this.extraInfo(query !== null && query !== void 0 ? query : Clause_1.emptyClause));
    }
    extraInfo(q) {
        var _a, _b;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]);
        const lx = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').slice(1)[0];
        const nested = this._get((_b = (_a = lx === null || lx === void 0 ? void 0 : lx.concepts) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : lx === null || lx === void 0 ? void 0 : lx.root);
        const filteredq = q.flatList().filter(x => { var _a, _b; return !(((_a = x === null || x === void 0 ? void 0 : x.args) === null || _a === void 0 ? void 0 : _a[0]) === oc[0] && ((_b = x.args) === null || _b === void 0 ? void 0 : _b.length) === 1); }).reduce((a, b) => a.and(b), Clause_1.emptyClause); /* without filter, q.copy() ends up asserting wrong information about this object, you need to assert only ownership of given props if present, not everything else that may come with query q.  */
        return nested !== undefined ? filteredq.copy({ map: { [oc[0]]: this.id } }) : Clause_1.emptyClause;
    }
    set(predicate, opts) {
        if (predicate.isVerb) {
            return this.call(predicate, opts === null || opts === void 0 ? void 0 : opts.args);
        }
        this._set(predicate, opts);
    }
    _set(value, opts) {
        var _a, _b, _c, _d, _e;
        if (this.parent && typeof this.object !== 'object') { //has-a
            const parent = (_c = (_b = (_a = this.parent).unwrap) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : this.parent;
            return parent[this.name] = value.root; //TODO: negation
        }
        const prop = (_e = (_d = value === null || value === void 0 ? void 0 : value.concepts) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : value.root;
        if (this._get(prop) !== undefined) { // has-a
            const val = typeof this._get(value.root) === 'boolean' ? !(opts === null || opts === void 0 ? void 0 : opts.negated) : !(opts === null || opts === void 0 ? void 0 : opts.negated) ? value.root : (opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value) ? '' : this._get(prop);
            this.object[prop] = val;
        }
        else { // is-a
            (opts === null || opts === void 0 ? void 0 : opts.negated) ? this.disinherit(value, opts) : this.inherit(value, opts);
        }
    }
    inherit(value, opts) {
        var _a, _b;
        if (this.is(value)) {
            return;
        }
        this.predicates.push(value);
        const proto = value.getProto();
        if (!proto) {
            return;
        }
        this.object = (0, newInstance_1.newInstance)(proto, value.root);
        value.heirlooms.forEach(h => Object.defineProperty(this.object, h.name, h));
        const buffer = this.predicates.filter(x => x !== value);
        this.predicates = [];
        buffer.forEach(p => this.set(p));
        this.predicates.push(value);
        if (this.object instanceof HTMLElement) {
            this.object.id = this.id + '';
            this.object.textContent = 'default';
            (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.context) === null || _a === void 0 ? void 0 : _a.root) === null || _b === void 0 ? void 0 : _b.appendChild(this.object);
        }
    }
    disinherit(value, opts) {
        var _a, _b;
        this.predicates = this.predicates.filter(x => x !== value);
        if (this.object instanceof HTMLElement) {
            (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.context) === null || _a === void 0 ? void 0 : _a.root) === null || _b === void 0 ? void 0 : _b.removeChild(this.object);
            // TODO: remove this.object, but save predicates
        }
    }
    get(predicate) {
        const w = this.object[predicate.root];
        return w instanceof BaseWrapper ? w : new BaseWrapper(w, (0, getIncrementalId_1.getIncrementalId)(), [], this, predicate.root);
    }
    _get(key) {
        var _a, _b;
        const val = this.object[key];
        return (_b = (_a = val === null || val === void 0 ? void 0 : val.unwrap) === null || _a === void 0 ? void 0 : _a.call(val)) !== null && _b !== void 0 ? _b : val;
    }
}
exports["default"] = BaseWrapper;


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
    var _a, _b;
    return new BaseWrapper_1.default((_a = args.object) !== null && _a !== void 0 ? _a : {}, args.id, (_b = args.preds) !== null && _b !== void 0 ? _b : [], args.parent, args.name);
}
exports.wrap = wrap;


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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
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
    'subclause is copulasubclause',
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
    `button is a noun and proto of it is HTMLButtonElement`,
    `div is a noun and proto of it is HTMLDivElement`,
    `element is a noun and proto of it is HTMLElement`,
    'color is a noun',
    'red and blue and black and green are colors',
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
const getKool_1 = __webpack_require__(/*! ../../middle/clauses/functions/getKool */ "./app/src/middle/clauses/functions/getKool.ts");
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
                const wrappers = clause.entities.flatMap(id => (0, getKool_1.getKool)(this.context, clause, id));
                this.context.values.forEach(w => (0, pointOut_1.pointOut)(w, { turnOff: true }));
                wrappers.forEach(w => w ? (0, pointOut_1.pointOut)(w) : 0);
                return wrappers.flatMap(o => o ? o.unwrap() : []);
            }
        }).flat();
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
        this.get = this.enviro.get;
        this.set = this.enviro.set;
        this.query = this.enviro.query;
        this.root = this.enviro.root;
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
        lexemes: lexemes_1.lexemes.map(x => (0, Lexeme_1.makeLexeme)(x)),
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
const LexemeObject_1 = __importDefault(__webpack_require__(/*! ./LexemeObject */ "./app/src/frontend/lexer/LexemeObject.ts"));
function makeLexeme(data) {
    return new LexemeObject_1.default(data);
}
exports.makeLexeme = makeLexeme;


/***/ }),

/***/ "./app/src/frontend/lexer/LexemeObject.ts":
/*!************************************************!*\
  !*** ./app/src/frontend/lexer/LexemeObject.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Cardinality_1 = __webpack_require__(/*! ../parser/interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const conjugate_1 = __webpack_require__(/*! ./functions/conjugate */ "./app/src/frontend/lexer/functions/conjugate.ts");
const pluralize_1 = __webpack_require__(/*! ./functions/pluralize */ "./app/src/frontend/lexer/functions/pluralize.ts");
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const makeGetter_1 = __webpack_require__(/*! ./makeGetter */ "./app/src/frontend/lexer/makeGetter.ts");
const makeSetter_1 = __webpack_require__(/*! ./makeSetter */ "./app/src/frontend/lexer/makeSetter.ts");
class LexemeObject {
    constructor(newData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
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
        this.proto = (_u = (_t = this.newData) === null || _t === void 0 ? void 0 : _t.proto) !== null && _u !== void 0 ? _u : (_v = this._root) === null || _v === void 0 ? void 0 : _v.proto;
        this.concepts = (_x = (_w = this.newData) === null || _w === void 0 ? void 0 : _w.concepts) !== null && _x !== void 0 ? _x : (_y = this._root) === null || _y === void 0 ? void 0 : _y.concepts;
        this.heirlooms = (_2 = (_0 = (_z = this === null || this === void 0 ? void 0 : this.newData) === null || _z === void 0 ? void 0 : _z.heirlooms) !== null && _0 !== void 0 ? _0 : (_1 = this._root) === null || _1 === void 0 ? void 0 : _1.heirlooms) !== null && _2 !== void 0 ? _2 : [];
        this.setAlias = (name, path) => {
            this.heirlooms.push({
                name,
                set: (0, makeSetter_1.makeSetter)(path),
                get: (0, makeGetter_1.makeGetter)(path),
            });
        };
    }
    get isConcept() {
        return (this === null || this === void 0 ? void 0 : this.type) === 'noun' && this.concepts && !this.proto;
    }
    getProto() {
        var _a, _b;
        return (_b = (_a = window) === null || _a === void 0 ? void 0 : _a[this.proto]) === null || _b === void 0 ? void 0 : _b.prototype;
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
exports["default"] = LexemeObject;


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
        .flatMap(x => x === null || x === void 0 ? void 0 : x.dynamic().flatMap(x => x.extrapolate(context)))
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
const numberLexeme_1 = __webpack_require__(/*! ./numberLexeme */ "./app/src/frontend/lexer/functions/numberLexeme.ts");
function getLexemes(word, context, words) {
    var _a, _b;
    const lex = (_b = (_a = context.getLexeme(word)) !== null && _a !== void 0 ? _a : (0, numberLexeme_1.numberLexeme)(word)) !== null && _b !== void 0 ? _b : (0, dynamicLexeme_1.dynamicLexeme)(word, context, words);
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

/***/ "./app/src/frontend/lexer/functions/numberLexeme.ts":
/*!**********************************************************!*\
  !*** ./app/src/frontend/lexer/functions/numberLexeme.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.numberLexeme = void 0;
const Lexeme_1 = __webpack_require__(/*! ../Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
function numberLexeme(word) {
    if (word.match(/\d+/)) {
        return (0, Lexeme_1.makeLexeme)({ root: word, type: 'noun', proto: 'Number' });
    }
}
exports.numberLexeme = numberLexeme;


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

/***/ "./app/src/frontend/lexer/makeGetter.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/makeGetter.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeGetter = void 0;
const getNested_1 = __webpack_require__(/*! ../../utils/getNested */ "./app/src/utils/getNested.ts");
function makeGetter(path) {
    function f() {
        return (0, getNested_1.getNested)(this, path);
    }
    return f;
}
exports.makeGetter = makeGetter;


/***/ }),

/***/ "./app/src/frontend/lexer/makeSetter.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/makeSetter.ts ***!
  \**********************************************/
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
    document.body.addEventListener('keydown', e => {
        if (e.ctrlKey && e.code === 'Space') {
            state.promptVisible = !state.promptVisible;
        }
        else if (e.ctrlKey && e.code === 'Enter') {
            const result = state.brain.execute(textarea.value);
            console.log(result);
        }
        update();
    });
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
const newUnification_1 = __webpack_require__(/*! ./functions/newUnification */ "./app/src/middle/clauses/functions/newUnification.ts");
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
        const candidates = queryList.map(q => {
            return universeList.flatMap(u => {
                return u.query(q);
            });
        });
        const maps = (0, newUnification_1.solveMaps)(candidates);
        const pronMap = queryList.filter(c => { var _a; return ((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'pronoun'; }).map(c => { var _a; return ({ [(_a = c.args) === null || _a === void 0 ? void 0 : _a.at(0)]: it }); }).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        return maps.concat(pronMap);
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

/***/ "./app/src/middle/clauses/functions/getKool.ts":
/*!*****************************************************!*\
  !*** ./app/src/middle/clauses/functions/getKool.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getKool = void 0;
function getKool(context, clause, localId) {
    const ownerIds = clause.ownersOf(localId); // 0 or 1 owner(s)
    if (ownerIds.length === 0) {
        const maps = context.query(clause);
        return maps
            .map(x => x[localId])
            .filter(x => x)
            .flatMap(x => { var _a; return (_a = context.get(x)) !== null && _a !== void 0 ? _a : []; });
    }
    const owner = getKool(context, clause, ownerIds[0]);
    return owner.flatMap(x => { var _a; return (_a = x.get(clause.describe(localId)[0])) !== null && _a !== void 0 ? _a : []; });
}
exports.getKool = getKool;


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

/***/ "./app/src/middle/clauses/functions/newUnification.ts":
/*!************************************************************!*\
  !*** ./app/src/middle/clauses/functions/newUnification.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.newUnification = exports.solveMaps = void 0;
const uniq_1 = __webpack_require__(/*! ../../../utils/uniq */ "./app/src/utils/uniq.ts");
function solveMaps(data) {
    // console.log({data})
    const maps = removeLongest(data).flat();
    // console.log({ maps })
    const oneEntryMaps = maps.filter(m => Object.values(m).length <= 1);
    // console.log({ oneEntryMaps })
    const allVarz = allVars(maps);
    // console.log({ allVarz })
    const allVals = allVarz.map(x => ({ [x]: allValsOf(oneEntryMaps, x) })).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    // console.log({ allValsOfMem })
    const valid = maps.filter(m => !isInvalid(m, allVals));
    // console.log({ valid })
    valid.forEach((m1, i) => {
        valid.forEach((m2, j) => {
            if (i !== j && Object.entries(m1).some(e => m2[e[0]] === e[1])) {
                valid[j] = Object.assign(Object.assign({}, m2), m1);
                valid[i] = {};
            }
        });
    });
    const maxLen = Math.max(...valid.map(m => Object.values(m).length));
    return valid.filter(m => Object.values(m).length === maxLen);
}
exports.solveMaps = solveMaps;
const testData = [
    [{ x: 1 }, { x: 10 }],
    [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 }],
    [{ y: 2 }, { y: 11 }],
    [{ y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 }],
    [{ z: 3 }, { z: 12 }],
    [{ x: 1 }, { x: 10 }],
];
const testData2 = [
    [{ x: 1 }, { x: 10 }],
    [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },],
    [{ y: 2 }, { y: 11 },],
    [{ y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },],
    [{ z: 3 }, { z: 12 },],
    [{ x: 1 }],
];
const testData3 = [
    [{ x: 1 }, { x: 2 }, { x: 3 }]
];
const testData4 = [
    [{ x: 1 }, { x: 2 }, { x: 3 }],
    [{ y: 1 }, { y: 2 }, { y: 3 }],
];
// const testData5: Map[][] = [ //FAIL, but never happens, since all vars should have a name, so there should be a 1-arg predicate for each var
//     [{ x: 1, y: 2 }],
//     [{ x: 3, y: 4 }],
// ]
function equals(l1, l2) {
    return l1.length === l2.length && l1.every(x => l2.includes(x));
}
function removeLongest(maps) {
    const mapsCopy = maps.slice();
    mapsCopy.forEach((ml1, i) => {
        mapsCopy.forEach((ml2, j) => {
            if (i !== j && equals(allVars(ml1), allVars(ml2))) {
                const longest = ml1.length > ml2.length ? i : j;
                mapsCopy[longest] = [];
            }
        });
    });
    return mapsCopy;
}
function allValsOf(maps, variable) {
    return (0, uniq_1.uniq)(maps.flatMap(m => { var _a; return (_a = m[variable]) !== null && _a !== void 0 ? _a : []; }));
}
function allVars(maps) {
    return (0, uniq_1.uniq)(maps.flatMap(x => Object.keys(x)));
}
function isInvalid(map, allValsOfMem) {
    return Object.entries(map).some(x => !allValsOfMem[x[0]].includes(x[1]));
}
function newUnification() {
    const assert1 = JSON.stringify(solveMaps(testData)) === JSON.stringify([{ x: 1, y: 2, z: 3 }, { x: 10, y: 11, z: 12 }]);
    const assert2 = JSON.stringify(solveMaps(testData2)) === JSON.stringify([{ x: 1, y: 2, z: 3 }]);
    const assert3 = JSON.stringify(solveMaps(testData3)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }]);
    const assert4 = JSON.stringify(solveMaps(testData4)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }, { y: 1 }, { y: 2 }, { y: 3 }]);
    console.log(assert1, assert2, assert3, assert4);
}
exports.newUnification = newUnification;


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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
    if ((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.relpron) {
        result = copulaSubClauseToClause(ast, args);
    }
    else if (isCopulaSentence(ast)) {
        result = copulaSentenceToClause(ast, args);
    }
    else if ((_b = ast.links) === null || _b === void 0 ? void 0 : _b.nonsubconj) {
        result = andSentenceToClause(ast, args);
    }
    else if (rel = ((_d = (_c = ast.links) === null || _c === void 0 ? void 0 : _c.iverb) === null || _d === void 0 ? void 0 : _d.lexeme) || ((_f = (_e = ast.links) === null || _e === void 0 ? void 0 : _e.mverb) === null || _f === void 0 ? void 0 : _f.lexeme) || ((_h = (_g = ast.links) === null || _g === void 0 ? void 0 : _g.preposition) === null || _h === void 0 ? void 0 : _h.lexeme)) {
        result = relationToClause(ast, rel, args);
    }
    else if ((_j = ast.links) === null || _j === void 0 ? void 0 : _j.subconj) {
        result = complexSentenceToClause(ast, args);
    }
    else {
        result = nounPhraseToClause(ast, args);
    }
    if (result) {
        const c0 = ((_k = ast.links) === null || _k === void 0 ? void 0 : _k.nonsubconj) ? result : (0, makeImply_1.makeImply)(result);
        const c1 = (0, makeAllVars_1.makeAllVars)(c0);
        const c2 = (0, resolveAnaphora_1.resolveAnaphora)(c1);
        const c3 = (0, propagateVarsOwned_1.propagateVarsOwned)(c2);
        const c4 = (0, negate_1.negate)(c3, !!((_l = ast === null || ast === void 0 ? void 0 : ast.links) === null || _l === void 0 ? void 0 : _l.negation));
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deepCopy = void 0;
function deepCopy(object) {
    if (object instanceof HTMLElement) {
        const wrapped = object.cloneNode();
        wrapped.innerHTML = object.innerHTML;
        return wrapped;
    }
    else {
        return Object.assign({}, object);
    }
}
exports.deepCopy = deepCopy;


/***/ }),

/***/ "./app/src/utils/getNested.ts":
/*!************************************!*\
  !*** ./app/src/utils/getNested.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNested = void 0;
const Wrapper_1 = __webpack_require__(/*! ../backend/wrapper/Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
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
exports.getNested = getNested;


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
const Brain_1 = __webpack_require__(/*! ../src/facade/brain/Brain */ "./app/src/facade/brain/Brain.ts");
const tests = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
    test10,
    test11,
    test12,
    test13,
    test14,
    test15,
    test16,
    test17,
    test18,
    test19,
    test20,
    test21,
    test22,
    test23,
    // test24,
    test25,
    test26,
    test27,
    test28,
    test29,
    test30,
    test31,
    test32,
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            const success = test();
            console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`);
            yield sleep(10); //75
            clear();
        }
    });
}
exports["default"] = autotester;
function test1() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is red. x is a button. y is a green button.');
    const assert1 = brain.execute('a green button')[0].style.background === 'green';
    const assert2 = brain.execute('a red button')[0].style.background === 'red';
    return assert1 && assert2;
}
function test2() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
    const assert1 = brain.context.values.length === 1;
    return assert1;
}
function test3() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = brain.execute('a red button')[0].style.background === 'red';
    const assert2 = brain.execute('a green button')[0].style.background === 'green';
    const assert3 = brain.execute('a black button')[0].style.background === 'black';
    return assert1 && assert2 && assert3;
}
function test4() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('a button is a button.');
    const button = brain.execute('button');
    return button !== undefined;
}
function test5() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. the color of x is red.');
    const assert1 = brain.execute('x')[0].style.background === 'red';
    return assert1;
}
function test6() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. the background of style of x is green.');
    const assert1 = brain.execute('x')[0].style.background === 'green';
    return assert1;
}
function test7() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. y is a button. z is a button. every button is red.');
    const assert1 = brain.execute('x')[0].style.background === 'red';
    const assert2 = brain.execute('y')[0].style.background === 'red';
    const assert3 = brain.execute('z')[0].style.background === 'red';
    return assert1 && assert2 && assert3;
}
function test8() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. text of x is capra.');
    const assert1 = brain.execute('button')[0].textContent === 'capra';
    return assert1;
}
function test9() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. x is green.');
    const assert1 = brain.execute('red').length === 0;
    const assert2 = brain.execute('green').length === 1;
    return assert1 && assert2;
}
function test10() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. y is a green button. z is a blue button. the red button. it is black.');
    const assert1 = brain.execute('x').at(0).style.background == 'black';
    const assert2 = brain.execute('y').at(0).style.background == 'green';
    const assert3 = brain.execute('z').at(0).style.background == 'blue';
    return assert1 && assert2 && assert3;
}
function test11() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z and w are buttons');
    brain.execute('x and y are red');
    brain.execute('w and z are black');
    const assert1 = brain.execute('x').at(0).style.background === brain.execute('y').at(0).style.background;
    const assert2 = brain.execute('w').at(0).style.background === brain.execute('z').at(0).style.background;
    const assert3 = brain.execute('x').at(0).style.background === 'red';
    const assert4 = brain.execute('w').at(0).style.background === 'black';
    return assert1 && assert2 && assert3 && assert4;
}
function test12() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are buttons');
    brain.execute('x appendChilds y');
    return Object.values(brain.execute('x')[0].children).includes(brain.execute('y')[0]);
}
function test13() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button and it is green');
    return brain.execute('x')[0].style.background === 'green';
}
function test14() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons. x and y are red and z is green.');
    const assert1 = brain.execute('x')[0].style.background === 'red'
        && brain.execute('y')[0].style.background === 'red'
        && brain.execute('z')[0].style.background === 'green';
    brain.execute('x and y and z are not red.');
    const assert2 = brain.execute('x')[0].style.background !== 'red'
        && brain.execute('y')[0].style.background !== 'red'
        && brain.execute('z')[0].style.background === 'green';
    return assert1 && assert2;
}
function test15() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons. every button is blue.');
    brain.execute('z is red.');
    brain.execute('every button is not blue.');
    const assert1 = brain.execute('x')[0].style.background !== 'blue'
        && brain.execute('y')[0].style.background !== 'blue'
        && brain.execute('z')[0].style.background === 'red';
    return assert1;
}
function test16() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button');
    brain.execute('x is hidden');
    const assert1 = brain.execute('x')[0].hidden;
    brain.execute('x is not hidden');
    const assert2 = !brain.execute('x')[0].hidden;
    return assert1 && assert2;
}
function test17() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button');
    const x = brain.execute('x')[0];
    x.onclick = () => brain.execute('x is red');
    brain.execute('x clicks');
    return x.style.background === 'red';
}
function test18() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are red. x is a button and y is a div.');
    brain.execute('every red button is black');
    const assert1 = brain.execute('button')[0].style.background === 'black';
    const assert2 = brain.execute('div')[0].style.background === 'red';
    return assert1 && assert2;
}
function test19() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. if x is red then y is a green button');
    return brain.execute('green button')[0].style.background === 'green';
}
function test20() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. y is a green button if x is red');
    return brain.execute('green button')[0].style.background === 'green';
}
function test21() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons. color of every button is red.');
    return brain.execute('red buttons').length === 3;
}
function test22() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons. background of style of every button is red.');
    return brain.execute('red buttons').length === 3;
}
function test23() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are red. every red is a button');
    return brain.execute('red buttons').length === 3;
}
function test24() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are red buttons');
    let clicks = '';
    brain.execute('x')[0].onclick = () => clicks += 'x';
    brain.execute('y')[0].onclick = () => clicks += 'y';
    brain.execute('every button clicks');
    return clicks === 'xy';
}
function test25() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are buttons. x is red and y is blue');
    brain.execute('the button that is blue is black');
    const assert1 = brain.execute('y')[0].style.background === 'black';
    const assert2 = brain.execute('x')[0].style.background === 'red';
    return assert1 && assert2;
}
function test26() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons');
    brain.execute('buttons are red');
    return brain.execute('red').length === 3;
}
function test27() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y and z are buttons. x and y are red. z is blue.');
    brain.execute('red buttons are black');
    const assert1 = brain.execute('z')[0].style.background === 'blue';
    const assert2 = brain.execute('black').length === 2;
    return assert1 && assert2;
}
function test28() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button');
    brain.execute('border of style of x is dotted-yellow');
    const assert1 = brain.execute('x')[0].style.background === 'red';
    const assert2 = brain.execute('x')[0].style.border.includes('dotted yellow');
    return assert1 && assert2;
}
function test29() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is 1 and y is 2');
    brain.execute('x adds y');
    return brain.execute('it')[0] === 3;
}
function test30() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('=  is a copula');
    brain.execute('x = red button');
    return brain.execute('x')[0].style.background === 'red';
}
function test31() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x and y are buttons. x is green and y is red.');
    const res = brain.execute('color of the red button');
    return res.includes('red') && !res.includes('green');
}
function test32() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. y is a button and the color of it is purple.');
    const res = brain.execute('purple button');
    return res.length === 1 && res[0].style.background === 'purple';
}
function sleep(millisecs) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs);
    });
}
function clear() {
    const x = document.createElement('body');
    document.body = x;
}


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3BFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDckIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3BFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDckIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztDQUN4QjtBQUVELE1BQU0sU0FBUyxHQUFZO0lBQ3ZCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDckIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUs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TyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBRUQsU0FBZ0IsY0FBYztJQUUxQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkgsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENB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TSxDQUFDO0lBQ3hDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztBQUNyQixDQUFDOzs7Ozs7O1VDaFZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvQ3JlYXRlTGV4ZW1lQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0lmQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL011bHRpQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1NldEFsaWFzQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1NpbXBsZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9XaGVuQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0dWF0b3IvQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvQmFzZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci90eXBlT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9wb2ludE91dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lT2JqZWN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2R5bmFtaWNMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZ2V0TGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9udW1iZXJMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcGx1cmFsaXplLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3Jlc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvc3Rkc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvdW5zcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL21ha2VHZXR0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9tYWtlU2V0dGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9CYXNpY0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlQWxsVmFycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbW9ja01hcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9uZWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbmV3VW5pZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3Jlc29sdmVBbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvaWRUb051bS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvaXNWYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3RvQ29uc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3RvVmFyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvYWxsS2V5cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2RlZXBDb3B5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZ2V0TmVzdGVkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL25ld0luc3RhbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc2V0TmVzdGVkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy90YWdOYW1lRnJvbVByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpIiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlTGV4ZW1lQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICghY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0aGlzLmNsYXVzZS5wcmVkaWNhdGU/LnJvb3QgYXMgYW55KSAmJiAhdGhpcy50b3BMZXZlbC5yaGVtZS5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8uaXNDb25jZXB0KSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSgodGhpcy5jbGF1c2UuYXJncyBhcyBhbnkpWzBdKVswXS5yb290IC8vVE9ETzogY291bGQgYmUgdW5kZWZpbmVkICAgICAgICBcbiAgICAgICAgY29uc3QgdHlwZSA9IChjb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCBhcyBhbnkpID8gdGhpcy5jbGF1c2UucHJlZGljYXRlPy5yb290IDogJ2FkamVjdGl2ZScpIGFzIExleGVtZVR5cGVcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSB0eXBlID09PSAnbm91bicgPyBbXSA6IHR5cGUgPT09ICdhZGplY3RpdmUnID8gW3RoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdF0uZmxhdE1hcCh4ID0+IHggPz8gW10pLmZpbHRlcih4ID0+IHggIT09IG5hbWUpLyogSEVFRUVFRUVFUkUgKi8gOiB1bmRlZmluZWRcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy50b3BMZXZlbC5xdWVyeSgkKCdwcm90bycsICdYJykpLmF0KDApPy5bJ1gnXVxuICAgICAgICBjb25zdCBwcm90byA9IHJlcyA/IHRoaXMudG9wTGV2ZWwuZGVzY3JpYmUocmVzKS5tYXAoeCA9PiB4LnJvb3QpLmZpbHRlcih4ID0+IHggIT09ICdwcm90bycpWzBdIDogdW5kZWZpbmVkXG5cblxuXG4gICAgICAgIGNvbnN0IGxleGVtZSA9IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBwcm90bzogcHJvdG8sXG4gICAgICAgICAgICBjb25jZXB0czogY29uY2VwdHNcbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZXh0LnNldExleGVtZShsZXhlbWUpXG5cbiAgICB9XG5cbn1cblxuXG5jb25zdCAkID0gKHA6IHN0cmluZywgLi4uYXJnczogSWRbXSkgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHAsIHR5cGU6ICdub3VuJyB9KSwgLi4uYXJncykiLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWZBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKGNvbnRleHQucXVlcnkodGhpcy5jbGF1c2UudGhlbWUpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgdGhpcy5jbGF1c2UucmhlbWUuZmxhdExpc3QoKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgIGdldEFjdGlvbihjLCB0aGlzLmNsYXVzZS5yaGVtZSkucnVuKGNvbnRleHQpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnRleHQucXVlcnkodGhpcy5jbGF1c2UudGhlbWUpLmZvckVhY2gobSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY2xhdXNlLmNvcHkoeyBtYXA6IG0sIGV4YWN0SWRzOiB0cnVlIH0pXG4gICAgICAgICAgICBjb25zdCBjb25zZXEgPSB0b3AucmhlbWVcbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZXMgPSBjb25zZXEuZmxhdExpc3QoKVxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZXMubWFwKGMgPT4gZ2V0QWN0aW9uKGMsIHRvcCkpXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goYSA9PiBhLnJ1bihjb250ZXh0KSlcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0QWxpYXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuICAgICAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRoaXMuY2xhdXNlLnJoZW1lXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY29uZGl0aW9uKVswXSAvL1RPRE8gKCFBU1NVTUUhKSBzYW1lIGFzIHRvcCBpbiBjb25jbHVzaW9uXG4gICAgICAgIGNvbnN0IGFsaWFzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uZGl0aW9uLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uc2VxdWVuY2UsIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdCA9IGFsaWFzLm1hcCh4ID0+IGNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHBhdGggPSBwcm9wcy5tYXAoeCA9PiBjb25zZXF1ZW5jZS5kZXNjcmliZSh4KVswXSkubWFwKHggPT4geC5yb290KSAvLyBzYW1lIC4uLlxuICAgICAgICBjb25zdCBsZXhlbWUgPSBjb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuXG4gICAgICAgIGxleGVtZS5zZXRBbGlhcyhjb25jZXB0WzBdLnJvb3QsIHBhdGgpXG4gICAgfVxuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRLb29sIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRLb29sXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICghdGhpcy5jbGF1c2UuYXJncyB8fCAhIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5jbGF1c2VcbiAgICAgICAgICAgIC5hcmdzXG4gICAgICAgICAgICAubWFwKHggPT4gZ2V0S29vbChjb250ZXh0LCB0aGlzLnRvcExldmVsLnRoZW1lLCB4KVswXSA/PyBjb250ZXh0LnNldChnZXRJbmNyZW1lbnRhbElkKCksIFtdKSlcbiAgICAgICAgICAgIFxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gYXJnc1swXVxuICAgICAgICBjb25zdCBvYmplY3QgPSBhcmdzWzFdXG5cbiAgICAgICAgY29uc3QgcmVzID0gc3ViamVjdD8uc2V0KHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgeyBhcmdzOiBvYmplY3QgPyBbb2JqZWN0XSA6IFtdLCBjb250ZXh0LCBuZWdhdGVkOiB0aGlzLmNsYXVzZS5uZWdhdGVkIH0pXG5cbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgY29udGV4dC5zZXQoZ2V0SW5jcmVtZW50YWxJZCgpLCBbXSwgcmVzKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaGVuQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoY29udGV4dC5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGF1c2UucmhlbWUuZmxhdExpc3QoKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIDEwMClcblxuICAgIH1cblxufSIsImltcG9ydCBTaW1wbGVBY3Rpb24gZnJvbSBcIi4vU2ltcGxlQWN0aW9uXCJcbmltcG9ydCBTZXRBbGlhc0FjdGlvbiBmcm9tIFwiLi9TZXRBbGlhc0FjdGlvblwiXG5pbXBvcnQgTXVsdGlBY3Rpb24gZnJvbSBcIi4vTXVsdGlBY3Rpb25cIlxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIlxuaW1wb3J0IElmQWN0aW9uIGZyb20gXCIuL0lmQWN0aW9uXCJcbmltcG9ydCBXaGVuQWN0aW9uIGZyb20gXCIuL1doZW5BY3Rpb25cIlxuaW1wb3J0IENyZWF0ZUxleGVtZUFjdGlvbiBmcm9tIFwiLi9DcmVhdGVMZXhlbWVBY3Rpb25cIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0ltcGx5XCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9uKGNsYXVzZTogQ2xhdXNlLCB0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uIHtcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2UudGhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS50aGVtZS5vd25lcnNPZihlKS5sZW5ndGgpICYmIGNsYXVzZS5yaGVtZS5lbnRpdGllcy5zb21lKGUgPT4gY2xhdXNlLnJoZW1lLm93bmVyc09mKGUpLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXRBbGlhc0FjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ2lmJykge1xuICAgICAgICByZXR1cm4gbmV3IElmQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnN1Ympjb25qPy5yb290ID09PSAnd2hlbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXaGVuQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKHRvcExldmVsLmZsYXRMaXN0KCkuc29tZSh4ID0+IHgucHJlZGljYXRlPy50eXBlID09PSAnZ3JhbW1hcicpXG4gICAgICAgIHx8IHRvcExldmVsLnJoZW1lLmZsYXRMaXN0KCkuc29tZSh4ID0+IHgucHJlZGljYXRlPy5pc0NvbmNlcHQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlTGV4ZW1lQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTaW1wbGVBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiBhbnlbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0dWF0b3IoKTogQWN0dWF0b3Ige1xuICAgIHJldHVybiBuZXcgQmFzZUFjdHVhdG9yKClcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb25zL2dldEFjdGlvblwiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogYW55W10ge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2UuZmxhdExpc3QoKS5tYXAoeCA9PiBnZXRBY3Rpb24oeCwgY2xhdXNlKSlcbiAgICAgICAgcmV0dXJuIGFjdGlvbnMuZmxhdE1hcChhID0+IGEucnVuKGNvbnRleHQpPz9bXSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgV3JhcHBlciwgeyB3cmFwIH0gZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgPSAoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldCA9IChpZDogSWQsIHByZWRzOiBMZXhlbWVbXSwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlciA9PiB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IHdyYXAoeyBpZCwgcHJlZHMsIG9iamVjdCB9KVxuICAgIH1cblxuICAgIHF1ZXJ5ID0gKHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLnZhbHVlc1xuICAgICAgICAgICAgLm1hcCh3ID0+IHcudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiB1bml2ZXJzZS5xdWVyeShxdWVyeSwgeyBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBwcmVkczpMZXhlbWVbXSwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICByZWFkb25seSB2YWx1ZXM6IFdyYXBwZXJbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBXcmFwcGVyLCB7IENvcHlPcHRzLCBTZXRPcHMgfSBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgYWxsS2V5cyB9IGZyb20gXCIuLi8uLi91dGlscy9hbGxLZXlzXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tIFwiLi90eXBlT2ZcIjtcbmltcG9ydCB7IGRlZXBDb3B5IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2RlZXBDb3B5XCI7XG5pbXBvcnQgeyBuZXdJbnN0YW5jZSB9IGZyb20gXCIuLi8uLi91dGlscy9uZXdJbnN0YW5jZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgcHJvdGVjdGVkIHByZWRpY2F0ZXM6IExleGVtZVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgb2JqZWN0OiBhbnksXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJlZHM6IExleGVtZVtdLFxuICAgICAgICByZWFkb25seSBwYXJlbnQ/OiBXcmFwcGVyLFxuICAgICAgICByZWFkb25seSBuYW1lPzogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIHByZWRzLmZvckVhY2gocCA9PiB0aGlzLnNldChwKSlcbiAgICB9XG5cbiAgICBpcyA9IChwcmVkaWNhdGU6IExleGVtZSkgPT5cbiAgICAgICAgdGhpcy5fZ2V0KHByZWRpY2F0ZT8uY29uY2VwdHM/LlswXSEpID09PSBwcmVkaWNhdGUucm9vdFxuICAgICAgICB8fCB0aGlzLnByZWRpY2F0ZXMubWFwKHggPT4geC5yb290KS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdClcblxuICAgIHByb3RlY3RlZCBjYWxsKHZlcmI6IExleGVtZSwgYXJnczogV3JhcHBlcltdKSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX2dldCh2ZXJiLnJvb3QpIGFzIEZ1bmN0aW9uXG4gICAgICAgIHJldHVybiBtZXRob2QuY2FsbCh0aGlzLm9iamVjdCwgLi4uYXJncy5tYXAoeCA9PiB4LnVud3JhcCgpKSlcbiAgICB9XG5cbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSkge1xuXG4gICAgICAgIGNvbnN0IGtzID0gdGhpcy5wcmVkaWNhdGVzLmZsYXRNYXAoeCA9PiB4LmhlaXJsb29tcy5mbGF0TWFwKHggPT4geC5uYW1lKSlcblxuICAgICAgICByZXR1cm4ga3NcbiAgICAgICAgICAgIC5tYXAoeCA9PiB0aGlzLl9nZXQoeCkpXG4gICAgICAgICAgICAubWFwKHggPT4gbWFrZUxleGVtZSh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnByZWRpY2F0ZXMpXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeCwgdGhpcy5pZCkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgICAgICAgICAuYW5kKHRoaXMuZXh0cmFJbmZvKHF1ZXJ5ID8/IGVtcHR5Q2xhdXNlKSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHRyYUluZm8ocTogQ2xhdXNlKSB7XG4gICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4ocSwgZ2V0VG9wTGV2ZWwocSlbMF0pXG4gICAgICAgIGNvbnN0IGx4ID0gb2MuZmxhdE1hcCh4ID0+IHEuZGVzY3JpYmUoeCkpLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ25vdW4nKS5zbGljZSgxKVswXVxuICAgICAgICBjb25zdCBuZXN0ZWQgPSB0aGlzLl9nZXQobHg/LmNvbmNlcHRzPy5bMF0gPz8gbHg/LnJvb3QpXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkcSA9IHEuZmxhdExpc3QoKS5maWx0ZXIoeCA9PiAhKHg/LmFyZ3M/LlswXSA9PT0gb2NbMF0gJiYgeC5hcmdzPy5sZW5ndGggPT09IDEpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSkgLyogd2l0aG91dCBmaWx0ZXIsIHEuY29weSgpIGVuZHMgdXAgYXNzZXJ0aW5nIHdyb25nIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgb2JqZWN0LCB5b3UgbmVlZCB0byBhc3NlcnQgb25seSBvd25lcnNoaXAgb2YgZ2l2ZW4gcHJvcHMgaWYgcHJlc2VudCwgbm90IGV2ZXJ5dGhpbmcgZWxzZSB0aGF0IG1heSBjb21lIHdpdGggcXVlcnkgcS4gICovXG4gICAgICAgIHJldHVybiBuZXN0ZWQgIT09IHVuZGVmaW5lZCA/IGZpbHRlcmVkcS5jb3B5KHsgbWFwOiB7IFtvY1swXV06IHRoaXMuaWQgfSB9KSA6IGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuICAgICAgICBpZiAocHJlZGljYXRlLmlzVmVyYikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHM/LmFyZ3MhKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2V0KHByZWRpY2F0ZSwgb3B0cylcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBfc2V0KHZhbHVlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdHlwZW9mIHRoaXMub2JqZWN0ICE9PSAnb2JqZWN0JykgeyAvL2hhcy1hXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLnBhcmVudC51bndyYXA/LigpID8/IHRoaXMucGFyZW50XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50W3RoaXMubmFtZSFdID0gdmFsdWUucm9vdCAvL1RPRE86IG5lZ2F0aW9uXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wID0gdmFsdWU/LmNvbmNlcHRzPy5bMF0gPz8gdmFsdWUucm9vdFxuXG4gICAgICAgIGlmICh0aGlzLl9nZXQocHJvcCkgIT09IHVuZGVmaW5lZCkgeyAvLyBoYXMtYVxuICAgICAgICAgICAgY29uc3QgdmFsID0gdHlwZW9mIHRoaXMuX2dldCh2YWx1ZS5yb290KSA9PT0gJ2Jvb2xlYW4nID8gIW9wdHM/Lm5lZ2F0ZWQgOiAhb3B0cz8ubmVnYXRlZCA/IHZhbHVlLnJvb3QgOiBvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXModmFsdWUpID8gJycgOiB0aGlzLl9nZXQocHJvcClcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3Byb3BdID0gdmFsXG4gICAgICAgIH0gZWxzZSB7IC8vIGlzLWFcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZWQgPyB0aGlzLmRpc2luaGVyaXQodmFsdWUsIG9wdHMpIDogdGhpcy5pbmhlcml0KHZhbHVlLCBvcHRzKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5oZXJpdCh2YWx1ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuaXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJlZGljYXRlcy5wdXNoKHZhbHVlKVxuICAgICAgICBjb25zdCBwcm90byA9IHZhbHVlLmdldFByb3RvKClcblxuICAgICAgICBpZiAoIXByb3RvKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub2JqZWN0ID0gbmV3SW5zdGFuY2UocHJvdG8sIHZhbHVlLnJvb3QpXG4gICAgICAgIHZhbHVlLmhlaXJsb29tcy5mb3JFYWNoKGggPT4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMub2JqZWN0LCBoLm5hbWUsIGgpKVxuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMucHJlZGljYXRlcy5maWx0ZXIoeCA9PiB4ICE9PSB2YWx1ZSlcbiAgICAgICAgdGhpcy5wcmVkaWNhdGVzID0gW11cbiAgICAgICAgYnVmZmVyLmZvckVhY2gocCA9PiB0aGlzLnNldChwKSlcbiAgICAgICAgdGhpcy5wcmVkaWNhdGVzLnB1c2godmFsdWUpXG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LmlkID0gdGhpcy5pZCArICcnXG4gICAgICAgICAgICB0aGlzLm9iamVjdC50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgb3B0cz8uY29udGV4dD8ucm9vdD8uYXBwZW5kQ2hpbGQodGhpcy5vYmplY3QpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBkaXNpbmhlcml0KHZhbHVlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICB0aGlzLnByZWRpY2F0ZXMgPSB0aGlzLnByZWRpY2F0ZXMuZmlsdGVyKHggPT4geCAhPT0gdmFsdWUpXG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIG9wdHM/LmNvbnRleHQ/LnJvb3Q/LnJlbW92ZUNoaWxkKHRoaXMub2JqZWN0KVxuICAgICAgICAgICAgLy8gVE9ETzogcmVtb3ZlIHRoaXMub2JqZWN0LCBidXQgc2F2ZSBwcmVkaWNhdGVzXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgQmFzZVdyYXBwZXIoXG4gICAgICAgIG9wdHM/Lm9iamVjdCA/PyBkZWVwQ29weSh0aGlzLm9iamVjdCksXG4gICAgICAgIHRoaXMuaWQsXG4gICAgICAgIChvcHRzPy5wcmVkcyA/PyBbXSkuY29uY2F0KHRoaXMucHJlZGljYXRlcylcbiAgICApXG5cbiAgICBnZXQocHJlZGljYXRlOiBMZXhlbWUpOiBXcmFwcGVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgdyA9IHRoaXMub2JqZWN0W3ByZWRpY2F0ZS5yb290XVxuICAgICAgICByZXR1cm4gdyBpbnN0YW5jZW9mIEJhc2VXcmFwcGVyID8gdyA6IG5ldyBCYXNlV3JhcHBlcih3LCBnZXRJbmNyZW1lbnRhbElkKCksIFtdLCB0aGlzLCBwcmVkaWNhdGUucm9vdClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX2dldChrZXk6IHN0cmluZykge1xuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLm9iamVjdFtrZXldXG4gICAgICAgIHJldHVybiB2YWw/LnVud3JhcD8uKCkgPz8gdmFsXG4gICAgfVxuXG4gICAgZHluYW1pYyA9ICgpID0+IGFsbEtleXModGhpcy5vYmplY3QpLm1hcCh4ID0+IG1ha2VMZXhlbWUoe1xuICAgICAgICB0eXBlOiB0eXBlT2YodGhpcy5fZ2V0KHgpKSxcbiAgICAgICAgcm9vdDogeFxuICAgIH0pKVxuXG4gICAgdW53cmFwID0gKCkgPT4gdGhpcy5vYmplY3RcblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBCYXNlV3JhcHBlciBmcm9tIFwiLi9CYXNlV3JhcHBlclwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IGlkOiBJZFxuICAgIHJlYWRvbmx5IHBhcmVudD86IFdyYXBwZXJcbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpOiBhbnlcbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IFdyYXBwZXJcbiAgICBnZXQocHJlZGljYXRlOiBMZXhlbWUpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgLyoqIGRlc2NyaWJlIHRoZSBvYmplY3QgKi8gdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICAvKiogaW5mZXIgZ3JhbW1hdGljYWwgdHlwZXMgb2YgcHJvcHMgKi8gZHluYW1pYygpOiBMZXhlbWVbXVxuICAgIHVud3JhcCgpOiBhbnlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFdyYXBwZXJbXVxuICAgIGNvbnRleHQ/OiBDb250ZXh0XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG9iamVjdD86IG9iamVjdFxuICAgIHByZWRzPzogTGV4ZW1lW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoYXJnczogV3JhcEFyZ3MpOiBXcmFwcGVyIHtcbiAgICByZXR1cm4gbmV3IEJhc2VXcmFwcGVyKGFyZ3Mub2JqZWN0ID8/IHt9LCBhcmdzLmlkLCBhcmdzLnByZWRzID8/IFtdLCBhcmdzLnBhcmVudCwgYXJncy5uYW1lKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFdyYXBBcmdzIHtcbiAgICBpZDogSWQsXG4gICAgcHJlZHM/OiBMZXhlbWVbXSxcbiAgICBvYmplY3Q/OiBPYmplY3QsXG4gICAgcGFyZW50PzogV3JhcHBlcixcbiAgICBuYW1lPzogc3RyaW5nXG59XG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZihvOiBvYmplY3QpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkIHtcblxuICAgIHN3aXRjaCAodHlwZW9mIG8pIHtcbiAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gMCA/ICdtdmVyYicgOiAnaXZlcmInXG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgcmV0dXJuICdhZGplY3RpdmUnXG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gJ25vdW4nXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAnZmlsbGVyJyxcbiAgJ3JlbHByb24nLFxuICAnbmVnYXRpb24nLFxuICAnbm91bicsXG4gICdwcmVwb3NpdGlvbicsXG4gICdzdWJjb25qJyxcbiAgJ2dyYW1tYXInLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bicsXG4gIC8vICdhbnknXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmNvbnN0IGJlaW5nOiBQYXJ0aWFsPExleGVtZT4gPSB7XG4gICAgcm9vdDogJ2JlJyxcbiAgICB0eXBlOiAnY29wdWxhJyxcbn1cblxuY29uc3QgZG9pbmc6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBQYXJ0aWFsPExleGVtZT5bXSA9IFtcblxuICAgIGJlaW5nLFxuICAgIGRvaW5nLFxuXG4gICAgeyBfcm9vdDogYmVpbmcsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuICAgIHsgX3Jvb3Q6IGJlaW5nLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicgfSwgLy9UT0RPISAyK1xuICAgIHsgX3Jvb3Q6IGRvaW5nLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICdmaWxsZXInIC8vIGZpbGxlciB3b3JkLCB3aGF0IGFib3V0IHBhcnRpYWwgcGFyc2luZz9cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3B0aW9uYWwnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcxfDAnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uZSBvciBtb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnemVybyBvciBtb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3InLFxuICAgICAgICB0eXBlOiAnZGlzanVuYydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29iamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbGVmdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3JpZ2h0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY29uZGl0aW9uJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY29uc2VxdWVuY2UnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH1cbl1cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmdbXSA9IFtcblxuICAvLyBncmFtbWFyXG4gICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG9iamVjdCBub3VuLXBocmFzZScsXG5cbiAgYGNvcHVsYS1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgICAgICB0aGVuIGNvcHVsYSBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICAgICAgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2VgLFxuXG4gIGBub3VuLXBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICAgIHRoZW4gemVybyAgb3IgIG1vcmUgYWRqZWN0aXZlcyBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3IgZ3JhbW1hclxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2UnLFxuICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZScsXG5cbiAgYGFuZC1zZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lIG9yIG1vcmUgcmlnaHQgYW5kLXNlbnRlbmNlIG9yIGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZWAsXG5cbiAgYG12ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIG12ZXJiXG5cdFx0dGhlbiBvYmplY3Qgbm91bi1waHJhc2VgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgYGl2ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gIGBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIGl2ZXJiLXNlbnRlbmNlIG9yIG12ZXJiLXNlbnRlbmNlYCxcblxuICBgY3MyIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICAgICAgdGhlbiBzdWJjb25qXG4gICAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2VgLFxuXG4gIGBjczEgaXMgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBmaWxsZXIgXG4gICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VgLFxuXG4gICBgYSBhbmQgYW4gYXJlIGluZGVmYXJ0c2AsXG4gICBgdGhlIGlzIGEgZGVmYXJ0YCxcbiAgIGBpZiBhbmQgd2hlbiBhbmQgd2hpbGUgYXJlIHN1YmNvbmpzYCxcbiAgIGBhbnkgYW5kIGV2ZXJ5IGFuZCBhbGwgYXJlIHVuaXF1YW50c2AsXG4gICBgb2YgYW5kIG9uIGFuZCB0byBhbmQgZnJvbSBhcmUgcHJlcG9zaXRpb25zYCxcbiAgIGB0aGF0IGlzIGEgcmVscHJvbmAsXG4gICBgbm90IGlzIGEgbmVnYXRpb25gLFxuICAgYGl0IGlzIGEgcHJvbm91bmAsXG5cblxuICAvLyBkb21haW5cbiAgYGJ1dHRvbiBpcyBhIG5vdW4gYW5kIHByb3RvIG9mIGl0IGlzIEhUTUxCdXR0b25FbGVtZW50YCxcbiAgYGRpdiBpcyBhIG5vdW4gYW5kIHByb3RvIG9mIGl0IGlzIEhUTUxEaXZFbGVtZW50YCxcbiAgYGVsZW1lbnQgaXMgYSBub3VuIGFuZCBwcm90byBvZiBpdCBpcyBIVE1MRWxlbWVudGAsXG4gICdjb2xvciBpcyBhIG5vdW4nLFxuICAncmVkIGFuZCBibHVlIGFuZCBibGFjayBhbmQgZ3JlZW4gYXJlIGNvbG9ycycsXG4gICdjb2xvciBvZiBhbnkgYnV0dG9uIGlzIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgaXQnLFxuICAnY29sb3Igb2YgYW55IGRpdiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KClcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZmlsbGVyJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxufSIsImltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2xcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS90b0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgcG9pbnRPdXQgfSBmcm9tIFwiLi9wb2ludE91dFwiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKVxuICAgICkge1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOdW1iZXIucHJvdG90eXBlLCAnYWRkJywgeyB3cml0YWJsZSA6IHRydWUsIHZhbHVlOiBmdW5jdGlvbiAoYTogYW55KSB7IHJldHVybiB0aGlzICsgYSB9IH0pXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnByZWx1ZGUuZm9yRWFjaChjID0+IHRoaXMuZXhlY3V0ZShjKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdIHtcblxuICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdCkuc2ltcGxlXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSlcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3R1YXRvci50YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5jb250ZXh0KVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlcnMgPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChpZCA9PiBnZXRLb29sKHRoaXMuY29udGV4dCwgY2xhdXNlLCBpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQudmFsdWVzLmZvckVhY2godyA9PiBwb2ludE91dCh3LCB7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgd3JhcHBlcnMuZm9yRWFjaCh3ID0+IHcgPyBwb2ludE91dCh3KSA6IDApXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlcnMuZmxhdE1hcChvID0+IG8gPyBvLnVud3JhcCgpIDogW10pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi8uLi9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludE91dCh3cmFwcGVyOiBXcmFwcGVyLCBvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pIHtcblxuICAgIGNvbnN0IG9iamVjdCA9IHdyYXBwZXIudW53cmFwKClcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBvYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9lbnZpcm8vRW52aXJvXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0NvbnRleHQgaW1wbGVtZW50cyBDb250ZXh0IHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IHRoaXMuY29uZmlnLnN5bnRheGVzXG4gICAgcHJvdGVjdGVkIF9zeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW10gPSB0aGlzLmdldFN5bnRheExpc3QoKVxuICAgIHByb3RlY3RlZCBfbGV4ZW1lcyA9IHRoaXMuY29uZmlnLmxleGVtZXNcbiAgICByZWFkb25seSBwcmVsdWRlID0gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICByZWFkb25seSBnZXQgPSB0aGlzLmVudmlyby5nZXRcbiAgICByZWFkb25seSBzZXQgPSB0aGlzLmVudmlyby5zZXRcbiAgICByZWFkb25seSBxdWVyeSA9IHRoaXMuZW52aXJvLnF1ZXJ5XG4gICAgcmVhZG9ubHkgcm9vdCA9IHRoaXMuZW52aXJvLnJvb3RcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVudmlybzogRW52aXJvLCByZWFkb25seSBjb25maWc6IENvbmZpZykge1xuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHtcblxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm8udmFsdWVzXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lID0gKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWUgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgICAgICAgICAuYXQoMClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pKVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICAgICAgdGhpcy5fc3ludGF4TGlzdCA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBpZiAobGV4ZW1lLnJvb3QgJiYgIWxleGVtZS50b2tlbiAmJiB0aGlzLl9sZXhlbWVzLnNvbWUoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KSkge1xuICAgICAgICAgICAgdGhpcy5fbGV4ZW1lcyA9IHRoaXMuX2xleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaChsZXhlbWUpXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaCguLi5sZXhlbWUuZXh0cmFwb2xhdGUodGhpcykpXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuLi8uLi9jb25maWcvbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9wcmVsdWRlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3ludGF4ZXM6IFN5bnRheE1hcFxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgbGV4ZW1lczogbGV4ZW1lcy5tYXAoeCA9PiBtYWtlTGV4ZW1lKHgpKSxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHByZWx1ZGUsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IGdldEVudmlybywgeyBFbnZpcm8sIEdldEVudmlyb09wcyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCBCYXNpY0NvbnRleHQgZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IGV4dGVuZHMgRW52aXJvIHtcblxuICAgIGdldFN5bnRheChuYW1lOiBBc3RUeXBlKTogU3ludGF4XG4gICAgc2V0U3ludGF4KG1hY3JvOiBBc3ROb2RlKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZFxuXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0T3B0cyBleHRlbmRzIEdldEVudmlyb09wcyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NvbnRleHQob3B0czogR2V0Q29udGV4dE9wdHMpOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChnZXRFbnZpcm8ob3B0cyksIGdldENvbmZpZygpKVxufSIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBnZXRMZXhlbWVzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2dldExleGVtZXNcIjtcbmltcG9ydCB7IHJlc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcmVzcGFjZVwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvc3Rkc3BhY2VcIjtcbmltcG9ydCB7IGpvaW5NdWx0aVdvcmRMZXhlbWVzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2pvaW5NdWx0aVdvcmRMZXhlbWVzXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZVtdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkgeyAvLyBUT0RPOiBtYWtlIGNhc2UgaW5zZW5zaXRpdmVcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzdGRzcGFjZShzb3VyY2VDb2RlKSwgY29udGV4dC5sZXhlbWVzKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiByZXNwYWNlKHMpKVxuXG4gICAgICAgIHRoaXMudG9rZW5zID0gd29yZHMuZmxhdE1hcCh3ID0+IGdldExleGVtZXModywgY29udGV4dCwgd29yZHMpKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHkgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBMZXhlbWVPYmplY3QgZnJvbSBcIi4vTGV4ZW1lT2JqZWN0XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyAgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovICB0eXBlOiBMZXhlbWVUeXBlXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi8gdG9rZW4/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovICBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9yIHF1YW50YWRqICovIGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICBfcm9vdD86IFBhcnRpYWw8TGV4ZW1lPlxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ6IENvbnRleHQpOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IGlzUGx1cmFsOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNNdWx0aVdvcmQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc1ZlcmI6Ym9vbGVhblxuXG4gICAgcHJvdG8/OiBzdHJpbmdcbiAgICBjb25jZXB0cz86IHN0cmluZ1tdXG4gICAgaGVpcmxvb21zOiBIZWlybG9vbVtdXG4gICAgcmVhZG9ubHkgaXNDb25jZXB0OiBib29sZWFuXG4gICAgZ2V0UHJvdG8oKTogb2JqZWN0IHwgdW5kZWZpbmVkXG4gICAgc2V0QWxpYXMoYWxpYXM6IHN0cmluZywgcGF0aDogc3RyaW5nW10pOiB2b2lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVpcmxvb20geyBzZXQ/OiBhbnksIGdldD86IGFueSwgbmFtZTogc3RyaW5nLCB2YWx1ZT86IGFueSwgd3JpdGFibGU/OiBib29sZWFuIH1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMZXhlbWUoZGF0YTogUGFydGlhbDxMZXhlbWU+KTogTGV4ZW1lIHtcbiAgICByZXR1cm4gbmV3IExleGVtZU9iamVjdChkYXRhKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgY29uanVnYXRlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBwbHVyYWxpemUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcGx1cmFsaXplXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5pbXBvcnQgeyBtYWtlR2V0dGVyIH0gZnJvbSBcIi4vbWFrZUdldHRlclwiXG5pbXBvcnQgeyBtYWtlU2V0dGVyIH0gZnJvbSBcIi4vbWFrZVNldHRlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExleGVtZU9iamVjdCBpbXBsZW1lbnRzIExleGVtZSB7XG5cbiAgICBfcm9vdCA9IHRoaXMubmV3RGF0YT8uX3Jvb3RcbiAgICByZWFkb25seSByb290ID0gdGhpcy5uZXdEYXRhPy5yb290ID8/IHRoaXMuX3Jvb3Q/LnJvb3QhXG4gICAgcmVhZG9ubHkgdHlwZSA9IHRoaXMubmV3RGF0YT8udHlwZSA/PyB0aGlzLl9yb290Py50eXBlIVxuICAgIGNvbnRyYWN0aW9uRm9yID0gdGhpcy5uZXdEYXRhPy5jb250cmFjdGlvbkZvciA/PyB0aGlzLl9yb290Py5jb250cmFjdGlvbkZvclxuICAgIHRva2VuID0gdGhpcy5uZXdEYXRhPy50b2tlbiA/PyB0aGlzLl9yb290Py50b2tlblxuICAgIGNhcmRpbmFsaXR5ID0gdGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSA/PyB0aGlzLl9yb290Py5jYXJkaW5hbGl0eVxuICAgIHJlYWRvbmx5IGlzVmVyYiA9IHRoaXMudHlwZSA9PT0gJ212ZXJiJyB8fCB0aGlzLnR5cGUgPT09ICdpdmVyYidcbiAgICByZWFkb25seSBpc1BsdXJhbCA9IGlzUmVwZWF0YWJsZSh0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5KVxuICAgIHJlYWRvbmx5IGlzTXVsdGlXb3JkID0gdGhpcy5yb290LmluY2x1ZGVzKCcgJylcblxuICAgIHByb3RvID0gdGhpcy5uZXdEYXRhPy5wcm90byA/PyB0aGlzLl9yb290Py5wcm90b1xuICAgIGNvbmNlcHRzID0gdGhpcy5uZXdEYXRhPy5jb25jZXB0cyA/PyB0aGlzLl9yb290Py5jb25jZXB0c1xuICAgIGhlaXJsb29tcyA9IHRoaXM/Lm5ld0RhdGE/LmhlaXJsb29tcyA/PyB0aGlzLl9yb290Py5oZWlybG9vbXMgPz8gW11cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBuZXdEYXRhPzogUGFydGlhbDxMZXhlbWU+XG4gICAgKSB7IH1cblxuICAgIGdldCBpc0NvbmNlcHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzPy50eXBlID09PSAnbm91bicgJiYgKHRoaXMgYXMgYW55KS5jb25jZXB0cyAmJiAhKHRoaXMgYXMgYW55KS5wcm90b1xuICAgIH1cblxuICAgIGdldFByb3RvKCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7Ly9UT0RPOiBtYXliZSByZXR1cm4gT2JqZWN0LnByb3RvdHlwZSBieSBkZWZhdWx0XG4gICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSk/Llt0aGlzLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZTtcbiAgICB9XG5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0OiBDb250ZXh0KTogTGV4ZW1lW10ge1xuXG4gICAgICAgIGlmICgodGhpcy50eXBlID09PSAnbm91bicgfHwgdGhpcy50eXBlID09PSAnZ3JhbW1hcicpICYmICF0aGlzLmlzUGx1cmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW21ha2VMZXhlbWUoeyBfcm9vdDogdGhpcywgdG9rZW46IHBsdXJhbGl6ZSh0aGlzLnJvb3QpLCBjYXJkaW5hbGl0eTogJyonIH0pXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWZXJiKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uanVnYXRlKHRoaXMucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogeCB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHNldEFsaWFzID0gKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nW10pID0+IHtcblxuICAgICAgICB0aGlzLmhlaXJsb29tcy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBzZXQ6IG1ha2VTZXR0ZXIocGF0aCksXG4gICAgICAgICAgICBnZXQ6IG1ha2VHZXR0ZXIocGF0aCksXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNMZXhlbWUod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWUge1xuXG4gICAgY29uc3QgcmVsZXZhbnQgPSB3b3Jkc1xuICAgICAgICAubWFwKHcgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHcsIHR5cGU6ICdub3VuJyB9KSwgJ1gnKSlcbiAgICAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LnF1ZXJ5KGMpKVxuICAgICAgICAuZmxhdE1hcChtID0+IE9iamVjdC52YWx1ZXMobSkpXG4gICAgICAgIC5mbGF0TWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSA/PyBbXSlcbiAgICAgICAgLmZsYXRNYXAoeCA9PiB4Py5keW5hbWljKCkuZmxhdE1hcCh4ID0+IHguZXh0cmFwb2xhdGUoY29udGV4dCkpKVxuICAgICAgICAuZmlsdGVyKHggPT4geC50b2tlbiA9PT0gd29yZCB8fCB4LnJvb3QgPT09IHdvcmQpXG5cbiAgICBjb25zdCBpc01hY3JvQ29udGV4dCA9XG4gICAgICAgIHdvcmRzLnNvbWUoeCA9PiBjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSA9PT0gJ2dyYW1tYXInKVxuICAgICAgICAmJiAhd29yZHMuc29tZSh4ID0+IFsnZGVmYXJ0JywgJ2luZGVmYXJ0JywgJ25vbnN1YmNvbmonXS5pbmNsdWRlcyhjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSBhcyBhbnkpKS8vVE9ETzogd2h5IGRlcGVuZGVuY2llcygnbWFjcm8nKSBkb2Vzbid0IHdvcms/IVxuXG4gICAgY29uc3QgdHlwZSA9IHJlbGV2YW50WzBdPy50eXBlID8/XG4gICAgICAgIChpc01hY3JvQ29udGV4dCA/XG4gICAgICAgICAgICAnZ3JhbW1hcidcbiAgICAgICAgICAgIDogJ25vdW4nKVxuXG4gICAgcmV0dXJuIG1ha2VMZXhlbWUoeyB0b2tlbjogd29yZCwgcm9vdDogcmVsZXZhbnQ/LmF0KDApPy5yb290ID8/IHdvcmQsIHR5cGU6IHR5cGUgfSlcbn1cblxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuaW1wb3J0IHsgZHluYW1pY0xleGVtZSB9IGZyb20gXCIuL2R5bmFtaWNMZXhlbWVcIlxuaW1wb3J0IHsgbnVtYmVyTGV4ZW1lIH0gZnJvbSBcIi4vbnVtYmVyTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZVtdIHtcblxuICAgIGNvbnN0IGxleCA9IGNvbnRleHQuZ2V0TGV4ZW1lKHdvcmQpID8/XG4gICAgICAgIG51bWJlckxleGVtZSh3b3JkKSA/P1xuICAgICAgICBkeW5hbWljTGV4ZW1lKHdvcmQsIGNvbnRleHQsIHdvcmRzKVxuXG4gICAgcmV0dXJuIGxleC5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleC5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBjb250ZXh0LCB3b3JkcykpIDpcbiAgICAgICAgW2xleF1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcbmltcG9ydCB7IHN0ZHNwYWNlIH0gZnJvbSBcIi4vc3Rkc3BhY2VcIjtcbmltcG9ydCB7IHVuc3BhY2UgfSBmcm9tIFwiLi91bnNwYWNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzb3VyY2VDb2RlOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZVtdKSB7XG5cbiAgICBsZXQgbmV3U291cmNlID0gc291cmNlQ29kZTtcblxuICAgIGxleGVtZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IHguaXNNdWx0aVdvcmQpXG4gICAgICAgIC5mb3JFYWNoKHggPT4ge1xuICAgICAgICAgICAgY29uc3QgbGV4ZW1lID0gc3Rkc3BhY2UoeC5yb290KTtcbiAgICAgICAgICAgIG5ld1NvdXJjZSA9IG5ld1NvdXJjZS5yZXBsYWNlQWxsKGxleGVtZSwgdW5zcGFjZShsZXhlbWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbmV3U291cmNlO1xufVxuIiwiaW1wb3J0IHsgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJMZXhlbWUod29yZDogc3RyaW5nKSB7XG5cbiAgICBpZiAod29yZC5tYXRjaCgvXFxkKy8pKSB7XG4gICAgICAgIHJldHVybiBtYWtlTGV4ZW1lKHsgcm9vdDogd29yZCwgdHlwZTogJ25vdW4nLCBwcm90bzogJ051bWJlcicgfSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiByZXNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCctJywgJyAnKTtcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJyk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiB1bnNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCcgJywgJy0nKTtcbn1cbiIsImltcG9ydCB7IGdldE5lc3RlZCB9IGZyb20gXCIuLi8uLi91dGlscy9nZXROZXN0ZWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VHZXR0ZXIocGF0aDogc3RyaW5nW10pIHtcblxuICAgIGZ1bmN0aW9uIGYodGhpczogYW55KSB7XG4gICAgICAgIHJldHVybiBnZXROZXN0ZWQodGhpcywgcGF0aClcbiAgICB9XG5cbiAgICByZXR1cm4gZlxufSIsImltcG9ydCB7IHNldE5lc3RlZCB9IGZyb20gXCIuLi8uLi91dGlscy9zZXROZXN0ZWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VTZXR0ZXIocGF0aDogc3RyaW5nW10pIHtcblxuICAgIGZ1bmN0aW9uIGYodGhpczogdW5rbm93biwgdmFsdWU6IGFueSkge1xuICAgICAgICBzZXROZXN0ZWQodGhpcywgcGF0aCwgdmFsdWUpXG4gICAgfVxuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsICduYW1lJywgeyB2YWx1ZTogYHNldF8ke2FsaWFzfWAsIHdyaXRhYmxlOiB0cnVlIH0pO1xuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KGYsICduYW1lJywgeyB2YWx1ZTogYWxpYXMsIHdyaXRhYmxlOiB0cnVlIH0pO1xuXG5cbiAgICByZXR1cm4gZlxuXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuc3ludGF4TGlzdClcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zaW1wbGlmeShhc3QpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkge1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICghYXN0LmxpbmtzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KGFzdC50eXBlKVxuXG4gICAgICAgIGlmIChzeW50YXgubGVuZ3RoID09PSAxICYmIE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKVswXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpbXBsZUxpbmtzID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyhhc3QubGlua3MpXG4gICAgICAgICAgICAubWFwKGwgPT4gKHsgW2xbMF1dOiB0aGlzLnNpbXBsaWZ5KGxbMV0pIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4geyAuLi5hc3QsIGxpbmtzOiBzaW1wbGVMaW5rcyB9XG5cbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ncmFtbWFyKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgc29sdmVNYXBzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL25ld1VuaWZpY2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICBkZXNjcmliZSA9IChpZDogSWQpOiBMZXhlbWVbXSA9PiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHsgLy8gY2FuJ3QgYmUgcHJvcCwgYmVjYXVzZSB3b3VsZCBiZSBjYWxsZWQgaW4gQW5kJ3MgY29ucywgQmFzaWNDbHVzZS5hbmQoKSBjYWxscyBBbmQncyBjb25zLCBcXGluZiByZWN1cnNpb24gZW5zdWVzXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBpZiAocXVlcnkuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW9ja01hcChxdWVyeSldXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCBpdCA9IG9wdHM/Lml0ID8/IHNvcnRJZHModW5pdmVyc2UuZW50aXRpZXMpLmF0KC0xKSEgLy9UT0RPIVxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlTGlzdCA9IHVuaXZlcnNlLmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgcXVlcnlMaXN0ID0gcXVlcnkuZmxhdExpc3QoKVxuXG4gICAgICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHVuaXZlcnNlTGlzdC5mbGF0TWFwKHUgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB1LnF1ZXJ5KHEpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSBzb2x2ZU1hcHMoY2FuZGlkYXRlcylcbiAgICAgICAgY29uc3QgcHJvbk1hcDogTWFwID0gcXVlcnlMaXN0LmZpbHRlcihjID0+IGMucHJlZGljYXRlPy50eXBlID09PSAncHJvbm91bicpLm1hcChjID0+ICh7IFtjLmFyZ3M/LmF0KDApIV06IGl0IH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICByZXR1cm4gbWFwcy5jb25jYXQocHJvbk1hcClcblxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG5cbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEJhc2ljQ2xhdXNlKFxuICAgICAgICB0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcD8uW2FdID8/IGEpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBhYm91dCA9IChpZDogSWQpID0+IHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlXG4gICAgb3duZWRCeSA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICBkZXNjcmliZSA9IChpZDogSWQpID0+IHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBCYXNpY0NsYXVzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJlZGljYXRlLnJvb3QgIT09IHF1ZXJ5LnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHF1ZXJ5LmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEFuIHVuYW1iaWd1b3VzIHByZWRpY2F0ZS1sb2dpYy1saWtlIGludGVybWVkaWF0ZSByZXByZXNlbnRhdGlvblxuICogb2YgdGhlIHByb2dyYW1tZXIncyBpbnRlbnQuXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBzaW1wbGU6IENsYXVzZVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW11cblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGV4YWN0SWRzPzogYm9vbGVhblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbiAgICBleGFjdElkcz86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBhYm91dCA9IChpZDogSWQpOiBDbGF1c2UgPT4gdGhpc1xuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBkZXNjcmliZSA9IChpZDogSWQpOiBMZXhlbWVbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpcy5jb25kaXRpb25cbiAgICByZWFkb25seSByaGVtZSA9IHRoaXMuY29uc2VxdWVuY2VcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jb25kaXRpb24udG9TdHJpbmcoKSArIHRoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IHN1Ympjb25qPzogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEltcGx5KFxuICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgIG9wdHM/LnN1Ympjb25qID8/IHRoaXMuc3ViamNvbmosXG4gICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHNcbiAgICApXG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5zdWJqY29uaj8ucm9vdCA/PyAnJ30gJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpID0+IHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lcnNPZihpZCkpXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKSA9PiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIGFib3V0ID0gKGlkOiBJZCkgPT4gdGhpcy5jb25kaXRpb24uYWJvdXQoaWQpLmFuZCh0aGlzLmNvbnNlcXVlbmNlLmFib3V0KGlkKSlcblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHtcbiAgICAgICAgICAgIGNsYXVzZTE6IHRoaXMuY29uZGl0aW9uLnNpbXBsZSxcbiAgICAgICAgICAgIGNsYXVzZTI6IHRoaXMuY29uc2VxdWVuY2Uuc2ltcGxlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vLi4vLi4vYmFja2VuZC93cmFwcGVyL1dyYXBwZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0S29vbChjb250ZXh0OiBDb250ZXh0LCBjbGF1c2U6IENsYXVzZSwgbG9jYWxJZDogSWQpOiBXcmFwcGVyW10ge1xuXG4gICAgY29uc3Qgb3duZXJJZHMgPSBjbGF1c2Uub3duZXJzT2YobG9jYWxJZCkgLy8gMCBvciAxIG93bmVyKHMpXG5cbiAgICBpZiAob3duZXJJZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgcmV0dXJuIG1hcHNcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4W2xvY2FsSWRdKVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgpXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IGNvbnRleHQuZ2V0KHgpID8/IFtdKVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVyID0gZ2V0S29vbChjb250ZXh0LCBjbGF1c2UsIG93bmVySWRzWzBdKVxuICAgIHJldHVybiBvd25lci5mbGF0TWFwKHggPT4geC5nZXQoY2xhdXNlLmRlc2NyaWJlKGxvY2FsSWQpWzBdKSA/PyBbXSlcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuaW1wb3J0IHsgdG9Db25zdCB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvdG9Db25zdFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlQWxsVmFycyhjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7IC8vIGNhc2UgaW5zZW5zaXRpdmUgbmFtZXMsIGlmIG9uZSB0aW1lIHZhciBhbGwgdmFycyFcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vSW1wbHlcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUltcGx5KGNsYXVzZTogQ2xhdXNlKSB7IC8vIGFueSBjbGF1c2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGx5XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UucmhlbWUgPT09IGVtcHR5Q2xhdXNlKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlLmVudGl0aWVzLnNvbWUoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgfHwgY2xhdXNlLmZsYXRMaXN0KCkuc29tZSh4ID0+ICEheC5wcmVkaWNhdGU/LmlzUGx1cmFsKSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlLnRoZW1lLmltcGxpZXMoY2xhdXNlLnJoZW1lKVxuICAgIH1cblxuICAgIHJldHVybiBjbGF1c2Vcbn1cbiIsImltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9pZC9NYXBcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1vY2tNYXAoY2xhdXNlOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBjbGF1c2UuZW50aXRpZXMubWFwKGUgPT4gKHsgW2VdOiBlIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5cbi8vVE9ETzogY29uc2lkZXIgbW92aW5nIHRvIENsYXVzZS5jb3B5KHtuZWdhdGV9KSAhISEhIVxuZXhwb3J0IGZ1bmN0aW9uIG5lZ2F0ZShjbGF1c2U6IENsYXVzZSwgbmVnYXRlOiBib29sZWFuKSB7XG5cbiAgICBpZiAoIW5lZ2F0ZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgY2xhdXNlMTogY2xhdXNlLnRoZW1lLnNpbXBsZSwgY2xhdXNlMjogY2xhdXNlLnJoZW1lLnNpbXBsZS5jb3B5KHsgbmVnYXRlIH0pIH0pXG5cbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhkYXRhOiBNYXBbXVtdKTogTWFwW10ge1xuXG4gICAgLy8gY29uc29sZS5sb2coe2RhdGF9KVxuICAgIGNvbnN0IG1hcHMgPSByZW1vdmVMb25nZXN0KGRhdGEpLmZsYXQoKVxuICAgIC8vIGNvbnNvbGUubG9nKHsgbWFwcyB9KVxuICAgIGNvbnN0IG9uZUVudHJ5TWFwcyA9IG1hcHMuZmlsdGVyKG0gPT4gT2JqZWN0LnZhbHVlcyhtKS5sZW5ndGggPD0gMSlcbiAgICAvLyBjb25zb2xlLmxvZyh7IG9uZUVudHJ5TWFwcyB9KVxuICAgIGNvbnN0IGFsbFZhcnogPSBhbGxWYXJzKG1hcHMpXG4gICAgLy8gY29uc29sZS5sb2coeyBhbGxWYXJ6IH0pXG4gICAgY29uc3QgYWxsVmFscyA9IGFsbFZhcnoubWFwKHggPT4gKHsgW3hdOiBhbGxWYWxzT2Yob25lRW50cnlNYXBzLCB4KSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAvLyBjb25zb2xlLmxvZyh7IGFsbFZhbHNPZk1lbSB9KVxuICAgIGNvbnN0IHZhbGlkID0gbWFwcy5maWx0ZXIobSA9PiAhaXNJbnZhbGlkKG0sIGFsbFZhbHMpKVxuICAgIC8vIGNvbnNvbGUubG9nKHsgdmFsaWQgfSlcblxuICAgIHZhbGlkLmZvckVhY2goKG0xLCBpKSA9PiB7XG4gICAgICAgIHZhbGlkLmZvckVhY2goKG0yLCBqKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChpICE9PSBqICYmIE9iamVjdC5lbnRyaWVzKG0xKS5zb21lKGUgPT4gbTJbZVswXV0gPT09IGVbMV0pKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRbal0gPSB7IC4uLm0yLCAuLi5tMSB9XG4gICAgICAgICAgICAgICAgdmFsaWRbaV0gPSB7fVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIGNvbnN0IG1heExlbiA9IE1hdGgubWF4KC4uLnZhbGlkLm1hcChtID0+IE9iamVjdC52YWx1ZXMobSkubGVuZ3RoKSlcbiAgICByZXR1cm4gdmFsaWQuZmlsdGVyKG0gPT4gT2JqZWN0LnZhbHVlcyhtKS5sZW5ndGggPT09IG1heExlbilcbn1cblxuXG5jb25zdCB0ZXN0RGF0YTogTWFwW11bXSA9IFtcbiAgICBbeyB4OiAxIH0sIHsgeDogMTAgfV0sXG4gICAgW3sgeDogMSwgeTogMiB9LCB7IHg6IDIsIHk6IDMgfSwgeyB4OiAxMCwgeTogMTEgfSwgeyB4OiAxMSwgeTogMTIgfV0sXG4gICAgW3sgeTogMiB9LCB7IHk6IDExIH1dLFxuICAgIFt7IHk6IDEsIHo6IDIgfSwgeyB5OiAyLCB6OiAzIH0sIHsgeTogMTAsIHo6IDExIH0sIHsgeTogMTEsIHo6IDEyIH1dLFxuICAgIFt7IHo6IDMgfSwgeyB6OiAxMiB9XSxcbiAgICBbeyB4OiAxIH0sIHsgeDogMTAgfV0sXG5dXG5cbmNvbnN0IHRlc3REYXRhMjogTWFwW11bXSA9IFtcbiAgICBbeyB4OiAxIH0sIHsgeDogMTAgfV0sXG4gICAgW3sgeDogMSwgeTogMiB9LCB7IHg6IDIsIHk6IDMgfSwgeyB4OiAxMCwgeTogMTEgfSwgeyB4OiAxMSwgeTogMTIgfSxdLFxuICAgIFt7IHk6IDIgfSwgeyB5OiAxMSB9LF0sXG4gICAgW3sgeTogMSwgejogMiB9LCB7IHk6IDIsIHo6IDMgfSwgeyB5OiAxMCwgejogMTEgfSwgeyB5OiAxMSwgejogMTIgfSxdLFxuICAgIFt7IHo6IDMgfSwgeyB6OiAxMiB9LF0sXG4gICAgW3sgeDogMSB9XSxcbl1cblxuY29uc3QgdGVzdERhdGEzOiBNYXBbXVtdID0gW1xuICAgIFt7IHg6IDEgfSwgeyB4OiAyIH0sIHsgeDogMyB9XVxuXVxuXG5jb25zdCB0ZXN0RGF0YTQ6IE1hcFtdW10gPSBbXG4gICAgW3sgeDogMSB9LCB7IHg6IDIgfSwgeyB4OiAzIH1dLFxuICAgIFt7IHk6IDEgfSwgeyB5OiAyIH0sIHsgeTogMyB9XSxcbl1cblxuLy8gY29uc3QgdGVzdERhdGE1OiBNYXBbXVtdID0gWyAvL0ZBSUwsIGJ1dCBuZXZlciBoYXBwZW5zLCBzaW5jZSBhbGwgdmFycyBzaG91bGQgaGF2ZSBhIG5hbWUsIHNvIHRoZXJlIHNob3VsZCBiZSBhIDEtYXJnIHByZWRpY2F0ZSBmb3IgZWFjaCB2YXJcbi8vICAgICBbeyB4OiAxLCB5OiAyIH1dLFxuLy8gICAgIFt7IHg6IDMsIHk6IDQgfV0sXG4vLyBdXG5cbmZ1bmN0aW9uIGVxdWFscyhsMTogYW55W10sIGwyOiBhbnlbXSkge1xuICAgIHJldHVybiBsMS5sZW5ndGggPT09IGwyLmxlbmd0aCAmJiBsMS5ldmVyeSh4ID0+IGwyLmluY2x1ZGVzKHgpKVxufVxuXG5mdW5jdGlvbiByZW1vdmVMb25nZXN0KG1hcHM6IE1hcFtdW10pIHtcblxuICAgIGNvbnN0IG1hcHNDb3B5ID0gbWFwcy5zbGljZSgpXG5cbiAgICBtYXBzQ29weS5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgbWFwc0NvcHkuZm9yRWFjaCgobWwyLCBqKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSAhPT0gaiAmJiBlcXVhbHMoYWxsVmFycyhtbDEpLCBhbGxWYXJzKG1sMikpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uZ2VzdCA9IG1sMS5sZW5ndGggPiBtbDIubGVuZ3RoID8gaSA6IGpcbiAgICAgICAgICAgICAgICBtYXBzQ29weVtsb25nZXN0XSA9IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBtYXBzQ29weVxuXG59XG5cbmZ1bmN0aW9uIGFsbFZhbHNPZihtYXBzOiBNYXBbXSwgdmFyaWFibGU6IElkKSB7XG4gICAgcmV0dXJuIHVuaXEobWFwcy5mbGF0TWFwKG0gPT4gbVt2YXJpYWJsZV0gPz8gW10pKVxufVxuXG5mdW5jdGlvbiBhbGxWYXJzKG1hcHM6IE1hcFtdKSB7XG4gICAgcmV0dXJuIHVuaXEobWFwcy5mbGF0TWFwKHggPT4gT2JqZWN0LmtleXMoeCkpKVxufVxuXG5mdW5jdGlvbiBpc0ludmFsaWQobWFwOiBNYXAsIGFsbFZhbHNPZk1lbTogeyBbeDogSWRdOiBJZFtdIH0pIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMobWFwKS5zb21lKHggPT4gIWFsbFZhbHNPZk1lbVt4WzBdXS5pbmNsdWRlcyh4WzFdKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld1VuaWZpY2F0aW9uKCkge1xuXG4gICAgY29uc3QgYXNzZXJ0MSA9IEpTT04uc3RyaW5naWZ5KHNvbHZlTWFwcyh0ZXN0RGF0YSkpID09PSBKU09OLnN0cmluZ2lmeShbeyB4OiAxLCB5OiAyLCB6OiAzIH0sIHsgeDogMTAsIHk6IDExLCB6OiAxMiB9XSlcbiAgICBjb25zdCBhc3NlcnQyID0gSlNPTi5zdHJpbmdpZnkoc29sdmVNYXBzKHRlc3REYXRhMikpID09PSBKU09OLnN0cmluZ2lmeShbeyB4OiAxLCB5OiAyLCB6OiAzIH1dKVxuICAgIGNvbnN0IGFzc2VydDMgPSBKU09OLnN0cmluZ2lmeShzb2x2ZU1hcHModGVzdERhdGEzKSkgPT09IEpTT04uc3RyaW5naWZ5KFt7IHg6IDEgfSwgeyB4OiAyIH0sIHsgeDogMyB9XSlcbiAgICBjb25zdCBhc3NlcnQ0ID0gSlNPTi5zdHJpbmdpZnkoc29sdmVNYXBzKHRlc3REYXRhNCkpID09PSBKU09OLnN0cmluZ2lmeShbeyB4OiAxIH0sIHsgeDogMiB9LCB7IHg6IDMgfSwgeyB5OiAxIH0sIHsgeTogMiB9LCB7IHk6IDMgfV0pXG5cbiAgICBjb25zb2xlLmxvZyhhc3NlcnQxLCBhc3NlcnQyLCBhc3NlcnQzLCBhc3NlcnQ0KVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBhbnl0aGluZyBvd25lZCBieSBhIHZhciBzaG91bGQgYmUgYWxzbyBiZSBhIHZhclxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtID0gY2xhdXNlLnRoZW1lLnF1ZXJ5KGNsYXVzZS5yaGVtZSlbMF1cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gPz8ge30gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi90b1ZhclwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZXRJbmNyZW1lbnRhbElkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQob3B0cz86IEdldEluY3JlbWVudGFsSWRPcHRzKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZDtcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBtYWtlQWxsVmFycyB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VBbGxWYXJzXCJcbmltcG9ydCB7IG1ha2VJbXBseSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VJbXBseVwiXG5pbXBvcnQgeyBuZWdhdGUgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9uZWdhdGVcIlxuaW1wb3J0IHsgcHJvcGFnYXRlVmFyc093bmVkIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkXCJcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL3Jlc29sdmVBbmFwaG9yYVwiXG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvdG9WYXJcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9pZC9JZFwiXG5cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignQXN0IGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoYXN0LmxleGVtZSkge1xuXG4gICAgICAgIGlmIChhc3QubGV4ZW1lLnR5cGUgPT09ICdub3VuJyB8fCBhc3QubGV4ZW1lLnR5cGUgPT09ICdhZGplY3RpdmUnIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ3Byb25vdW4nIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ2dyYW1tYXInKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xhdXNlT2YoYXN0LmxleGVtZSwgLi4uYXJncz8uc3ViamVjdCA/IFthcmdzPy5zdWJqZWN0XSA6IFtdKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG5cbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGFzdC5saXN0Lm1hcChjID0+IHRvQ2xhdXNlKGMsIGFyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UpXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuICAgIGxldCByZWxcblxuICAgIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGlzQ29wdWxhU2VudGVuY2UoYXN0KSkge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8ubm9uc3ViY29uaikge1xuICAgICAgICByZXN1bHQgPSBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKHJlbCA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZSB8fCBhc3QubGlua3M/Lm12ZXJiPy5sZXhlbWUgfHwgYXN0LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlbGF0aW9uVG9DbGF1c2UoYXN0LCByZWwsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMCA9IGFzdC5saW5rcz8ubm9uc3ViY29uaiA/IHJlc3VsdCA6IG1ha2VJbXBseShyZXN1bHQpXG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMoYzApXG4gICAgICAgIGNvbnN0IGMyID0gcmVzb2x2ZUFuYXBob3JhKGMxKVxuICAgICAgICBjb25zdCBjMyA9IHByb3BhZ2F0ZVZhcnNPd25lZChjMilcbiAgICAgICAgY29uc3QgYzQgPSBuZWdhdGUoYzMsICEhYXN0Py5saW5rcz8ubmVnYXRpb24pXG4gICAgICAgIGNvbnN0IGM1ID0gYzQuY29weSh7IHNpZGVFZmZlY3R5OiBjNC5yaGVtZSAhPT0gZW1wdHlDbGF1c2UgfSlcbiAgICAgICAgcmV0dXJuIGM1XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJyR7YXN0LnR5cGV9JyFgKVxuXG59XG5cbmNvbnN0IGlzQ29wdWxhU2VudGVuY2UgPSAoYXN0PzogQXN0Tm9kZSkgPT4gISFhc3Q/LmxpbmtzPy5jb3B1bGFcblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG5cbiAgICByZXR1cm4gc3ViamVjdC5hbmQocHJlZGljYXRlLCB7IGFzUmhlbWU6IHRydWUgfSlcbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuICAgIHJldHVybiB0b0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBvcHRzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IGFyZ3MgPSB7IHN1YmplY3Q6IHN1YmplY3RJZCB9XG5cbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhub3VuUGhyYXNlLmxpbmtzID8/IHt9KVxuICAgICAgICAubWFwKHggPT4gdG9DbGF1c2UoeCwgYXJncykpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG59XG5cbmZ1bmN0aW9uIHJlbGF0aW9uVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCByZWw6IExleGVtZSwgb3B0cz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmpJZCB9KVxuICAgIGNvbnN0IG9iamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ub2JqZWN0LCB7IHN1YmplY3Q6IG9iaklkIH0pXG5cbiAgICBjb25zdCBhcmdzID0gb2JqZWN0ID09PSBlbXB0eUNsYXVzZSA/IFtzdWJqSWRdIDogW3N1YmpJZCwgb2JqSWRdXG4gICAgY29uc3QgcmVsYXRpb24gPSBjbGF1c2VPZihyZWwsIC4uLmFyZ3MpXG4gICAgY29uc3QgcmVsYXRpb25Jc1JoZW1lID0gc3ViamVjdCAhPT0gZW1wdHlDbGF1c2VcblxuICAgIHJldHVybiBzdWJqZWN0XG4gICAgICAgIC5hbmQob2JqZWN0KVxuICAgICAgICAuYW5kKHJlbGF0aW9uLCB7IGFzUmhlbWU6IHJlbGF0aW9uSXNSaGVtZSB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJjb25qID0gYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWVcbiAgICBjb25zdCBjb25kaXRpb24gPSB0b0NsYXVzZShhc3QubGlua3M/LmNvbmRpdGlvbiwgYXJncylcbiAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uc2VxdWVuY2UsIGFyZ3MpXG4gICAgcmV0dXJuIGNvbmRpdGlvbi5pbXBsaWVzKGNvbnNlcXVlbmNlKS5jb3B5KHsgc3ViamNvbmo6IHN1YmNvbmogfSlcblxufVxuXG5mdW5jdGlvbiBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5sZWZ0LCBhcmdzKVxuICAgIGNvbnN0IHJpZ2h0ID0gdG9DbGF1c2UoYXN0Py5saW5rcz8ucmlnaHQ/Lmxpc3Q/LlswXSwgYXJncylcblxuICAgIGlmIChhc3QubGlua3M/LmxlZnQ/LnR5cGUgPT09IGFzdC5saW5rcz8ucmlnaHQ/LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQuYW5kKHJpZ2h0KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEtleXMob2JqZWN0OiBvYmplY3QsIGl0ZXIgPSA1KSB7XG5cbiAgICBsZXQgb2JqID0gb2JqZWN0XG4gICAgbGV0IHJlczogc3RyaW5nW10gPSBbXVxuXG4gICAgd2hpbGUgKG9iaiAmJiBpdGVyKSB7XG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5rZXlzKG9iaildXG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaildXG4gICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopXG4gICAgICAgIGl0ZXItLVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbn0iLCJleHBvcnQgZnVuY3Rpb24gZGVlcENvcHkob2JqZWN0OiBvYmplY3QpIHtcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gb2JqZWN0LmNsb25lTm9kZSgpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gb2JqZWN0LmlubmVySFRNTFxuICAgICAgICByZXR1cm4gd3JhcHBlZFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm9iamVjdCB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCJcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5lc3RlZChvYmplY3Q6IGFueSwgcGF0aDogc3RyaW5nW10pIHtcblxuICAgIGlmICghb2JqZWN0W3BhdGhbMF1dKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBsZXQgeCA9IHdyYXAoeyBvYmplY3Q6IG9iamVjdFtwYXRoWzBdXSwgaWQ6IGdldEluY3JlbWVudGFsSWQoKSwgcGFyZW50OiBvYmplY3QsIG5hbWU6IHBhdGhbMF0gfSlcblxuICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY29uc3QgeSA9IHgudW53cmFwKClbcF1cbiAgICAgICAgeCA9IHdyYXAoeyBvYmplY3Q6IHksIGlkOiBnZXRJbmNyZW1lbnRhbElkKCksIHBhcmVudDogeCwgbmFtZTogcCB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4geFxuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdGFnTmFtZUZyb21Qcm90byB9IGZyb20gXCIuL3RhZ05hbWVGcm9tUHJvdG9cIlxuXG4vKipcbiAqIFxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGFuIG9iamVjdCAoZXZlbiBIVE1MRWxlbWVudCkgZnJvbSBhIHByb3RvdHlwZS5cbiAqIEluIGNhc2UgaXQncyBhIG51bWJlciwgbm8gbmV3IGluc3RhbmNlIGlzIG1hZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdJbnN0YW5jZShwcm90bzogb2JqZWN0LCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgaWYgKHByb3RvID09PSBOdW1iZXIucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFyZ3NbMF0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKSA6XG4gICAgICAgIG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvciguLi5hcmdzKVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2V0TmVzdGVkKG9iamVjdDogYW55LCBwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZykge1xuXG4gICAgbGV0IHggPSBvYmplY3RcblxuICAgIHBhdGguc2xpY2UoMCwgLTEpLmZvckVhY2gocCA9PiB7XG4gICAgICAgIHggPSB4W3BdXG4gICAgfSlcblxuICAgIHhbcGF0aC5hdCgtMSkhXSA9IHZhbHVlXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIlxuLyoqXG4gKiBUcnkgZ2V0dGluZyB0aGUgbmFtZSBvZiBhbiBodG1sIGVsZW1lbnQgZnJvbSBhIHByb3RvdHlwZVxuICovXG5leHBvcnQgY29uc3QgdGFnTmFtZUZyb21Qcm90byA9ICh4OiBvYmplY3QpID0+IHguY29uc3RydWN0b3IubmFtZVxuICAgIC5yZXBsYWNlKCdIVE1MJywgJycpXG4gICAgLnJlcGxhY2UoJ0VsZW1lbnQnLCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGxldCBzZWVuID0ge30gYXMgYW55XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vc3JjL2ZhY2FkZS9icmFpbi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIlxuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuICAgIHRlc3QxOCxcbiAgICB0ZXN0MTksXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIC8vIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG4gICAgdGVzdDI2LFxuICAgIHRlc3QyNyxcbiAgICB0ZXN0MjgsXG4gICAgdGVzdDI5LFxuICAgIHRlc3QzMCxcbiAgICB0ZXN0MzEsXG4gICAgdGVzdDMyLFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gdGVzdCgpXG4gICAgICAgIGNvbnNvbGUubG9nKGAlYyR7c3VjY2VzcyA/ICdzdWNjZXNzJyA6ICdmYWlsJ30gJHt0ZXN0Lm5hbWV9YCwgYGNvbG9yOiR7c3VjY2VzcyA/ICdncmVlbicgOiAncmVkJ31gKVxuICAgICAgICBhd2FpdCBzbGVlcCgxMCkvLzc1XG4gICAgICAgIGNsZWFyKClcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQudmFsdWVzLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneSBpcyBhIGJ1dHRvbi4geCBpcyByZWQuIHkgaXMgYSBncmVlbiBidXR0b24uIHggaXMgYSBidXR0b24uIHogaXMgYSBibGFjayBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVxuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBjb2xvciBvZiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cblxuZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB5IGlzIGEgYnV0dG9uLiB6IGlzIGEgYnV0dG9uLiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpWzBdLnRleHRDb250ZW50ID09PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdyZWQnKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgndyBhbmQgeiBhcmUgYmxhY2snKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDRcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5JylcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGUoJ3knKVswXSlcbn1cblxuZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbiBhbmQgaXQgaXMgZ3JlZW4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyByZWQuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIG5vdCBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdXG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggY2xpY2tzJylcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG59XG5cbmZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSByZWQgYnV0dG9uIGlzIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4gaWYgeCBpcyByZWQgdGhlbiB5IGlzIGEgZ3JlZW4gYnV0dG9uJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbiBpZiB4IGlzIHJlZCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDIxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gY29sb3Igb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgcmVkLiBldmVyeSByZWQgaXMgYSBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpXG4gICAgbGV0IGNsaWNrcyA9ICcnXG4gICAgYnJhaW4uZXhlY3V0ZSgneCcpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3gnXG4gICAgYnJhaW4uZXhlY3V0ZSgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgYnV0dG9uIGNsaWNrcycpXG4gICAgcmV0dXJuIGNsaWNrcyA9PT0gJ3h5J1xufVxuXG5mdW5jdGlvbiB0ZXN0MjUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIHJlZCBhbmQgeSBpcyBibHVlJylcbiAgICBicmFpbi5leGVjdXRlKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgnYnV0dG9ucyBhcmUgcmVkJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QyNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZC4geiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMgYXJlIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibHVlJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdibGFjaycpLmxlbmd0aCA9PT0gMlxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2JvcmRlciBvZiBzdHlsZSBvZiB4IGlzIGRvdHRlZC15ZWxsb3cnKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJvcmRlci5pbmNsdWRlcygnZG90dGVkIHllbGxvdycpXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MjkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIDEgYW5kIHkgaXMgMicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhZGRzIHknKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdpdCcpWzBdID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QzMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJz0gIGlzIGEgY29wdWxhJylcbiAgICBicmFpbi5leGVjdXRlKCd4ID0gcmVkIGJ1dHRvbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MzEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIGdyZWVuIGFuZCB5IGlzIHJlZC4nKVxuICAgIGNvbnN0IHJlcyA9IGJyYWluLmV4ZWN1dGUoJ2NvbG9yIG9mIHRoZSByZWQgYnV0dG9uJylcbiAgICByZXR1cm4gcmVzLmluY2x1ZGVzKCdyZWQnKSAmJiAhcmVzLmluY2x1ZGVzKCdncmVlbicpXG59XG5cbmZ1bmN0aW9uIHRlc3QzMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgYnV0dG9uIGFuZCB0aGUgY29sb3Igb2YgaXQgaXMgcHVycGxlLicpXG4gICAgY29uc3QgcmVzID0gYnJhaW4uZXhlY3V0ZSgncHVycGxlIGJ1dHRvbicpXG4gICAgcmV0dXJuIHJlcy5sZW5ndGggPT09IDEgJiYgcmVzWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdwdXJwbGUnXG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgICBjb25zdCB4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9keScpXG4gICAgZG9jdW1lbnQuYm9keSA9IHhcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=