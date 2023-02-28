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

/***/ "./app/src/backend/actions/CreateAction.ts":
/*!*************************************************!*\
  !*** ./app/src/backend/actions/CreateAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const newInstance_1 = __webpack_require__(/*! ../../utils/newInstance */ "./app/src/utils/newInstance.ts");
class CreateAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d, _e, _f;
        const localId = (_b = (_a = this.clause) === null || _a === void 0 ? void 0 : _a.args) === null || _b === void 0 ? void 0 : _b[0];
        const id = (_e = (_d = (_c = context.query(this.topLevel.theme)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d[localId]) !== null && _e !== void 0 ? _e : (0, getIncrementalId_1.getIncrementalId)();
        const predicate = this.clause.predicate;
        if (!predicate) {
            return;
        }
        if ((_f = context.get(id)) === null || _f === void 0 ? void 0 : _f.is(predicate)) { //  existence check prior to creating
            return;
        }
        const proto = predicate.getProto();
        if (!proto) {
            return;
        }
        const o = (0, newInstance_1.newInstance)(proto, predicate.root);
        init(o, context, id);
        context.set(id, o).set(predicate);
    }
}
exports["default"] = CreateAction;
function init(o, context, id) {
    var _a;
    if (o instanceof HTMLElement) {
        o.id = id + '';
        o.textContent = 'default';
        (_a = context.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
    }
}


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

/***/ "./app/src/backend/actions/EditAction.ts":
/*!***********************************************!*\
  !*** ./app/src/backend/actions/EditAction.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const getKool_1 = __webpack_require__(/*! ../../middle/clauses/functions/getKool */ "./app/src/middle/clauses/functions/getKool.ts");
class EditAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b;
        const localId = (_a = this.clause.args) === null || _a === void 0 ? void 0 : _a[0];
        const predicate = this.clause.predicate;
        const searchSpace = this.topLevel.theme;
        if (!localId || !predicate) {
            return;
        }
        const wrapper = (_b = (0, getKool_1.getKool)(context, searchSpace, localId)[0]) !== null && _b !== void 0 ? _b : context.set((0, getIncrementalId_1.getIncrementalId)());
        wrapper.set(predicate, { negated: this.clause.negated });
    }
}
exports["default"] = EditAction;


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
        const condition = this.clause.theme;
        context.query(condition).forEach(m => {
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

/***/ "./app/src/backend/actions/RelationAction.ts":
/*!***************************************************!*\
  !*** ./app/src/backend/actions/RelationAction.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const getKool_1 = __webpack_require__(/*! ../../middle/clauses/functions/getKool */ "./app/src/middle/clauses/functions/getKool.ts");
class RelationAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a;
        const args = ((_a = this.clause.args) !== null && _a !== void 0 ? _a : [])
            .map(x => (0, getKool_1.getKool)(context, this.topLevel.theme, x)[0]);
        if (!this.clause.predicate) {
            return;
        }
        const subject = args[0];
        const object = args[1];
        const res = subject === null || subject === void 0 ? void 0 : subject.set(this.clause.predicate, { args: object ? [object] : [] });
        if (res) {
            context.set((0, getIncrementalId_1.getIncrementalId)(), res);
        }
        return res;
    }
}
exports["default"] = RelationAction;


/***/ }),

/***/ "./app/src/backend/actions/SetAliasAction.ts":
/*!***************************************************!*\
  !*** ./app/src/backend/actions/SetAliasAction.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const Wrapper_1 = __webpack_require__(/*! ../wrapper/Wrapper */ "./app/src/backend/wrapper/Wrapper.ts");
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
        const conceptName = alias.map(x => condition.describe(x)[0]); // assume at least one name
        const propsNames = props.map(x => consequence.describe(x)[0]); // same ...
        const protoName = condition.describe(top)[0]; // assume one 
        (0, Wrapper_1.wrap)((0, getIncrementalId_1.getIncrementalId)(), protoName.getProto()).set(conceptName[0], { aliasPath: propsNames });
    }
}
exports["default"] = SetAliasAction;


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
const CreateAction_1 = __importDefault(__webpack_require__(/*! ./CreateAction */ "./app/src/backend/actions/CreateAction.ts"));
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/backend/actions/EditAction.ts"));
const RelationAction_1 = __importDefault(__webpack_require__(/*! ./RelationAction */ "./app/src/backend/actions/RelationAction.ts"));
const SetAliasAction_1 = __importDefault(__webpack_require__(/*! ./SetAliasAction */ "./app/src/backend/actions/SetAliasAction.ts"));
const MultiAction_1 = __importDefault(__webpack_require__(/*! ./MultiAction */ "./app/src/backend/actions/MultiAction.ts"));
const IfAction_1 = __importDefault(__webpack_require__(/*! ./IfAction */ "./app/src/backend/actions/IfAction.ts"));
const WhenAction_1 = __importDefault(__webpack_require__(/*! ./WhenAction */ "./app/src/backend/actions/WhenAction.ts"));
const CreateLexemeAction_1 = __importDefault(__webpack_require__(/*! ./CreateLexemeAction */ "./app/src/backend/actions/CreateLexemeAction.ts"));
const Imply_1 = __importDefault(__webpack_require__(/*! ../../middle/clauses/Imply */ "./app/src/middle/clauses/Imply.ts"));
function getAction(clause, topLevel) {
    // console.log(topLevel.toString())
    var _a, _b, _c, _d, _e;
    if (topLevel.flatList().some(x => { var _a; return ((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'grammar'; })
        || topLevel.rheme.flatList().some(x => { var _a; return (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.isConcept; })) {
        return new CreateLexemeAction_1.default(clause, topLevel);
    }
    // TODO: prepositions, and be beware of 'of' 
    if (((_a = clause.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'iverb' || ((_b = clause.predicate) === null || _b === void 0 ? void 0 : _b.type) === 'mverb') {
        return new RelationAction_1.default(clause, topLevel);
    }
    if ((_c = clause.predicate) === null || _c === void 0 ? void 0 : _c.proto) {
        return new CreateAction_1.default(clause, topLevel);
    }
    if (clause instanceof Imply_1.default && clause.theme.entities.some(e => clause.theme.ownersOf(e).length) && clause.rheme.entities.some(e => clause.rheme.ownersOf(e).length)) {
        return new SetAliasAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default && ((_d = clause.subjconj) === null || _d === void 0 ? void 0 : _d.root) === 'if') {
        return new IfAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default && ((_e = clause.subjconj) === null || _e === void 0 ? void 0 : _e.root) === 'when') {
        return new WhenAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default) {
        return new MultiAction_1.default(clause);
    }
    return new EditAction_1.default(clause, topLevel);
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
        this.set = (id, object) => {
            var _a;
            this.lastReferenced = id;
            const placeholder = this.dictionary[id];
            return this.dictionary[id] = (_a = placeholder === null || placeholder === void 0 ? void 0 : placeholder.copy({ object: object })) !== null && _a !== void 0 ? _a : (0, Wrapper_1.wrap)(id, object);
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
const setNested_1 = __webpack_require__(/*! ../../utils/setNested */ "./app/src/utils/setNested.ts");
const getNested_1 = __webpack_require__(/*! ../../utils/getNested */ "./app/src/utils/getNested.ts");
class BaseWrapper {
    constructor(object, id, isPlaceholder, parent, name) {
        var _a, _b;
        this.object = object;
        this.id = id;
        this.isPlaceholder = isPlaceholder;
        this.parent = parent;
        this.name = name;
        this.aliases = (_b = (_a = this.object) === null || _a === void 0 ? void 0 : _a.aliases) !== null && _b !== void 0 ? _b : {};
        this.predicates = [];
        this.dynamic = () => (0, allKeys_1.allKeys)(this.object).map(x => (0, Lexeme_1.makeLexeme)({
            type: (0, typeOf_1.typeOf)(this.object[x]),
            root: x
        }));
        this.unwrap = () => this.object;
        try {
            this.object.aliases = this.aliases;
        }
        catch (_c) { }
    }
    is(predicate) {
        var _a, _b;
        const path = this.aliases[(_b = (_a = predicate.concepts) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : ''];
        return path ?
            (0, getNested_1.getNested)(this.object, path) === predicate.root :
            this.predicates.map(x => x.root).includes(predicate.root);
    }
    setAlias(alias, path) {
        this.aliases[alias.root] = path.map(x => x.root);
    }
    call(verb, args) {
        return this.object[verb.root](...args.map(x => x.unwrap()));
    }
    toClause(query) {
        return Object.keys(this.aliases)
            .map(k => (0, getNested_1.getNested)(this.object, this.aliases[k]))
            .map(x => (0, Lexeme_1.makeLexeme)({ root: x, type: 'adjective' }))
            .concat(this.predicates)
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause)
            .and(this.extraInfo(query !== null && query !== void 0 ? query : Clause_1.emptyClause));
    }
    extraInfo(q) {
        var _a, _b;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]);
        const path = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').map(x => x.root).slice(1);
        const nested = (0, getNested_1.getNested)(this.object, (_b = (_a = this.aliases) === null || _a === void 0 ? void 0 : _a[path === null || path === void 0 ? void 0 : path[0]]) !== null && _b !== void 0 ? _b : path);
        //without filter, q.copy() ends up asserting wrong information about this object,
        //you need to assert only ownership of given props if present,
        //not everything else that may come with query q. 
        const filteredq = q.flatList().filter(x => { var _a, _b; return !(((_a = x === null || x === void 0 ? void 0 : x.args) === null || _a === void 0 ? void 0 : _a[0]) === oc[0] && ((_b = x.args) === null || _b === void 0 ? void 0 : _b.length) === 1); }).reduce((a, b) => a.and(b), Clause_1.emptyClause);
        return nested !== undefined ? filteredq.copy({ map: { [oc[0]]: this.id } }) : Clause_1.emptyClause;
    }
    set(predicate, opts) {
        if (opts === null || opts === void 0 ? void 0 : opts.args) {
            return this.call(predicate, opts.args);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath);
        }
        if (this.parent && typeof this.object !== 'object') {
            return this.parent.unwrap()[this.name] = predicate.root;
        }
        this.setMultiProp(predicate, opts);
    }
    setMultiProp(value, opts) {
        var _a, _b, _c, _d;
        const props = (_a = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _a !== void 0 ? _a : [];
        const last = props.at(-1);
        const path = props.length > 0 ?
            [...props.slice(0, -1), ...(_b = this.aliases[last]) !== null && _b !== void 0 ? _b : [last]] :
            (_d = this.aliases[(_c = value === null || value === void 0 ? void 0 : value.concepts) === null || _c === void 0 ? void 0 : _c[0]]) !== null && _d !== void 0 ? _d : (this.object[value.root] !== undefined ? [value.root] : undefined);
        if (path) {
            const val = typeof this.object[value.root] === 'boolean' ? !(opts === null || opts === void 0 ? void 0 : opts.negated) : !(opts === null || opts === void 0 ? void 0 : opts.negated) ? value.root : (opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value) ? '' : (0, getNested_1.getNested)(this.object, path);
            (0, setNested_1.setNested)(this.object, path, val);
        }
        else {
            this.predicates.push(value);
        }
    }
    copy(opts) {
        var _a;
        const copy = new BaseWrapper((_a = opts === null || opts === void 0 ? void 0 : opts.object) !== null && _a !== void 0 ? _a : (0, deepCopy_1.deepCopy)(this.object), this.id, (opts === null || opts === void 0 ? void 0 : opts.object) ? false : this.isPlaceholder);
        this.predicates.forEach(x => copy.set(x));
        return copy;
    }
    get(clause) {
        var _a, _b;
        const x = clause.entities.flatMap(e => clause.describe(e))[0];
        if (x) {
            const path = (_b = (_a = this.aliases) === null || _a === void 0 ? void 0 : _a[x.root]) !== null && _b !== void 0 ? _b : [x.root];
            let parent = this;
            path.forEach(p => {
                const o = parent.unwrap()[p];
                parent = new BaseWrapper(o, (0, getIncrementalId_1.getIncrementalId)(), false, parent, p);
            });
            return parent;
        }
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
function wrap(id, o) {
    return new BaseWrapper_1.default(o !== null && o !== void 0 ? o : {}, id, o === undefined);
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
    if (typeof o === 'function') {
        return o.length > 0 ? 'mverb' : 'iverb';
    }
    else if (typeof o === 'boolean') {
        return 'adjective';
    }
    else if (o) {
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
const be = {
    root: 'be',
    type: 'copula',
};
const _do = {
    root: 'do',
    type: 'hverb',
};
exports.lexemes = [
    be,
    _do,
    { _root: be, token: 'is', cardinality: 1 },
    { _root: be, token: 'are', cardinality: '*' },
    { _root: _do, token: 'does', cardinality: 1 },
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
    'color of any element is background of style of it',
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
        //TODO: move somewhere else
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
class LexemeObject {
    constructor(newData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.newData = newData;
        this._root = (_a = this.newData) === null || _a === void 0 ? void 0 : _a._root;
        this.contractionFor = (_c = (_b = this.newData) === null || _b === void 0 ? void 0 : _b.contractionFor) !== null && _c !== void 0 ? _c : (_d = this._root) === null || _d === void 0 ? void 0 : _d.contractionFor;
        this.token = (_f = (_e = this.newData) === null || _e === void 0 ? void 0 : _e.token) !== null && _f !== void 0 ? _f : (_g = this._root) === null || _g === void 0 ? void 0 : _g.token;
        this.cardinality = (_j = (_h = this.newData) === null || _h === void 0 ? void 0 : _h.cardinality) !== null && _j !== void 0 ? _j : (_k = this._root) === null || _k === void 0 ? void 0 : _k.cardinality;
        this.proto = (_m = (_l = this.newData) === null || _l === void 0 ? void 0 : _l.proto) !== null && _m !== void 0 ? _m : (_o = this._root) === null || _o === void 0 ? void 0 : _o.proto;
        this.concepts = (_q = (_p = this.newData) === null || _p === void 0 ? void 0 : _p.concepts) !== null && _q !== void 0 ? _q : (_r = this._root) === null || _r === void 0 ? void 0 : _r.concepts;
    }
    get root() {
        var _a;
        if (this._root) {
            return this._root.root;
        }
        return (_a = this.newData) === null || _a === void 0 ? void 0 : _a.root;
    }
    get type() {
        var _a;
        if (this._root) {
            return this._root.type;
        }
        return (_a = this.newData) === null || _a === void 0 ? void 0 : _a.type;
    }
    get isPlural() {
        var _a;
        return (0, Cardinality_1.isRepeatable)((_a = this.newData) === null || _a === void 0 ? void 0 : _a.cardinality);
    }
    get isConcept() {
        return (this === null || this === void 0 ? void 0 : this.type) === 'noun' && this.concepts && !this.proto;
    }
    extrapolate(context) {
        if ((this.type === 'noun' || this.type === 'grammar') && !this.isPlural) {
            return [(0, Lexeme_1.makeLexeme)({ _root: this, token: (0, pluralize_1.pluralize)(this.root), cardinality: '*' })];
        }
        if (['iverb', 'mverb'].includes(this.type)) {
            return (0, conjugate_1.conjugate)(this.root).map(x => (0, Lexeme_1.makeLexeme)({ _root: this, token: x }));
        }
        return [];
    }
    get isMultiWord() {
        return this.root.includes(' ');
    }
    getProto() {
        var _a, _b;
        return (_b = (_a = window) === null || _a === void 0 ? void 0 : _a[this.proto]) === null || _b === void 0 ? void 0 : _b.prototype;
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
        var _a, _b, _c, _d;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_c = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _c !== void 0 ? _c : this.isSideEffecty, (_d = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _d !== void 0 ? _d : this.exactIds);
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return yes ? this.negated ? `not${yes}` : yes : '';
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
        const result = [];
        const it = (_a = opts === null || opts === void 0 ? void 0 : opts.it) !== null && _a !== void 0 ? _a : (0, sortIds_1.sortIds)(universe.entities).at(-1);
        query.entities.forEach(qe => {
            universe.entities.forEach(re => {
                const rd = universe.about(re).flatList().map(x => x.copy({ map: { [re]: qe } })); // subsitute re by qe in real description
                const qd = query.about(qe).flatList();
                const qhashes = qd.map(x => x.hashCode);
                const rhashes = rd.map(x => x.hashCode);
                if (qhashes.every(x => rhashes.includes(x))) { // qe unifies with re!
                    // const qds = qd.map(x => x.toString())
                    // const rds = rd.map(x => x.toString())
                    // console.log('qds=',qds, 'rds=',rds)
                    unify(qe, re, result);
                }
                if (it && qd.some(x => { var _a; return ((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'pronoun'; })) {
                    unify(qe, it, result);
                }
            });
        });
        return result;
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
function unify(qe, re, result) {
    var _a;
    if (result.some(x => x[qe] === re)) { // if already unified don't do it again
        return;
    }
    const i = result.findIndex(x => !x[qe]);
    const m = (_a = result[i]) !== null && _a !== void 0 ? _a : {};
    m[qe] = re;
    result[i > -1 ? i : result.length] = m;
}


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
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _a !== void 0 ? _a : this.isSideEffecty, (_b = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _b !== void 0 ? _b : this.exactIds);
    }
    flatList() {
        return [this];
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        return this.entities.includes(id) ? this : Clause_1.emptyClause;
    }
    ownedBy(id) {
        return this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
    }
    ownersOf(id) {
        return this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate.root}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    describe(id) {
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : [];
    }
    query(query) {
        if (query.exactIds) {
            return [(0, mockMap_1.mockMap)(query)];
        }
        query = query.flatList()[0]; //TODO!!???
        if (!(query instanceof BasicClause)) {
            return [];
        }
        if (query.predicate.root !== this.predicate.root) {
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
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b, _c, _d, _e;
        return new Imply((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.condition.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.consequence.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_c = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _c !== void 0 ? _c : this.isSideEffecty, (_d = opts === null || opts === void 0 ? void 0 : opts.subjconj) !== null && _d !== void 0 ? _d : this.subjconj, (_e = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _e !== void 0 ? _e : this.exactIds);
    }
    flatList() {
        return [this];
    }
    get entities() {
        return (0, uniq_1.uniq)(this.condition.entities.concat(this.consequence.entities));
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
    about(id) {
        // return emptyClause ///TODO!!!!!!!!
        return this.condition.about(id).and(this.consequence.about(id));
    }
    toString() {
        var _a, _b;
        const yes = `${(_b = (_a = this.subjconj) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : ''} ${this.condition.toString()} ---> ${this.consequence.toString()}`;
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.condition.ownedBy(id).concat(this.consequence.ownedBy(id));
    }
    ownersOf(id) {
        return this.condition.ownersOf(id).concat(this.consequence.ownersOf(id));
    }
    describe(id) {
        return this.consequence.describe(id).concat(this.condition.describe(id));
    }
    query(clause) {
        throw new Error('not implemented!');
    }
    get simple() {
        return this.copy({
            clause1: this.condition.simple,
            clause2: this.consequence.simple
        });
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
        return maps.map(x => x[localId]).flatMap(x => { var _a; return (_a = context.get(x)) !== null && _a !== void 0 ? _a : []; });
    }
    const owner = getKool(context, clause, ownerIds[0]);
    return owner.flatMap(x => { var _a; return (_a = x.get(clause.about(localId))) !== null && _a !== void 0 ? _a : []; });
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
    if (clause.entities.some(e => (0, isVar_1.isVar)(e)) || clause.flatList().some(x => x.predicate ? x.predicate.isPlural : false)) {
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNested = void 0;
function getNested(object, path) {
    let x = object[path[0]]; // assume at least one
    path.slice(1).forEach(p => {
        x = x === null || x === void 0 ? void 0 : x[p];
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
 * Remove duplicates from a list of primitives (numbers, bools, strings).
 * Careful using this with objects.
 */
const uniq = (x) => Array.from(new Set(x));
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
    test24,
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
    const assert1 = brain.execute('button')[0].textContent == 'capra';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFHQUFtQztBQUNuQyxpSEFBMkM7QUFHM0MsQ0FBQyxHQUFTLEVBQUU7SUFDUixNQUFNLHdCQUFVLEdBQUU7SUFDbEIsa0JBQUksR0FBRTtBQUNWLENBQUMsRUFBQyxFQUFFOzs7Ozs7Ozs7Ozs7O0FDTkosc0pBQThFO0FBRTlFLDJHQUFzRDtBQUl0RCxNQUFxQixZQUFZO0lBRTdCLFlBQXFCLE1BQWMsRUFBVyxRQUFnQjtRQUF6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUU5RCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCOztRQUVoQixNQUFNLE9BQU8sR0FBRyxnQkFBSSxDQUFDLE1BQU0sMENBQUUsSUFBSSwwQ0FBRyxDQUFDLENBQU87UUFDNUMsTUFBTSxFQUFFLEdBQUcseUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsMENBQUcsQ0FBQyxDQUFDLDBDQUFHLE9BQU8sQ0FBQyxtQ0FBSSx1Q0FBZ0IsR0FBRTtRQUNuRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7UUFFdkMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE9BQU07U0FDVDtRQUVELElBQUksYUFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsMENBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUcscUNBQXFDO1lBQ3hFLE9BQU07U0FDVDtRQUVELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFFbEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE9BQU07U0FDVDtRQUVELE1BQU0sQ0FBQyxHQUFHLDZCQUFXLEVBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7SUFFckMsQ0FBQztDQUVKO0FBaENELGtDQWdDQztBQUVELFNBQVMsSUFBSSxDQUFDLENBQVMsRUFBRSxPQUFnQixFQUFFLEVBQU07O0lBRTdDLElBQUksQ0FBQyxZQUFZLFdBQVcsRUFBRTtRQUMxQixDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO1FBQ2QsQ0FBQyxDQUFDLFdBQVcsR0FBRyxTQUFTO1FBQ3pCLGFBQU8sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDL0I7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDL0NELDhHQUF5RDtBQUd6RCw4R0FBK0Q7QUFHL0QsTUFBcUIsa0JBQWtCO0lBRW5DLFlBQXFCLE1BQWMsRUFBVyxRQUFnQjtRQUF6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUU5RCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCOztRQUVoQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLDBDQUFFLElBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLFNBQVMsMENBQUUsU0FBUyxJQUFDLEVBQUU7WUFDeEksT0FBTTtTQUNUO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLGtDQUFrQztRQUNsSCxNQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFVBQUksQ0FBQyxNQUFNLENBQUMsU0FBUywwQ0FBRSxJQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLDBDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFlO1FBQ3pJLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsMENBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFELENBQUMsY0FBRCxDQUFDLEdBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxrQkFBaUIsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUN2SyxNQUFNLEdBQUcsR0FBRyxVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRyxHQUFHLENBQUM7UUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBSTFHLE1BQU0sTUFBTSxHQUFHLHVCQUFVLEVBQUM7WUFDdEIsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsSUFBSTtZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLFFBQVE7U0FDckIsQ0FBQztRQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRTdCLENBQUM7Q0FFSjtBQS9CRCx3Q0ErQkM7QUFHRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQVMsRUFBRSxHQUFHLElBQVUsRUFBRSxFQUFFLENBQUMscUJBQVEsRUFBQyx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3pDaEcsc0pBQThFO0FBRzlFLHFJQUFpRTtBQUdqRSxNQUFxQixVQUFVO0lBRTNCLFlBQXFCLE1BQWMsRUFBVyxRQUFnQjtRQUF6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUU5RCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCOztRQUVoQixNQUFNLE9BQU8sR0FBRyxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksMENBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztRQUN2QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUs7UUFFdkMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN4QixPQUFNO1NBQ1Q7UUFFRCxNQUFNLE9BQU8sR0FBRywyQkFBTyxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1DQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQWdCLEdBQUUsQ0FBQztRQUM1RixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTVELENBQUM7Q0FFSjtBQXJCRCxnQ0FxQkM7Ozs7Ozs7Ozs7Ozs7QUN4QkQscUdBQXdDO0FBRXhDLE1BQXFCLFFBQVE7SUFFekIsWUFBcUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7SUFFbkMsQ0FBQztJQUVELEdBQUcsQ0FBQyxPQUFnQjtRQUVoQixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBRTdDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckMseUJBQVMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ2hELENBQUMsQ0FBQztTQUVMO0lBR0wsQ0FBQztDQUVKO0FBbkJELDhCQW1CQzs7Ozs7Ozs7Ozs7OztBQ3JCRCxxR0FBd0M7QUFFeEMsTUFBcUIsV0FBVztJQUU1QixZQUFxQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUVuQyxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCO1FBRWhCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztRQUVuQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUVqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ3hELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDakMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFTLEVBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLENBQUMsQ0FBQztJQUVOLENBQUM7Q0FFSjtBQXRCRCxpQ0FzQkM7Ozs7Ozs7Ozs7Ozs7QUMxQkQsc0pBQThFO0FBRTlFLHFJQUFpRTtBQUdqRSxNQUFxQixjQUFjO0lBRS9CLFlBQXFCLE1BQWMsRUFBVyxRQUFnQjtRQUF6QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUU5RCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCOztRQUVoQixNQUFNLElBQUksR0FBRyxDQUFDLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxtQ0FBSSxFQUFFLENBQUM7YUFDaEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQU8sRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3hCLE9BQU07U0FDVDtRQUVELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV0QixNQUFNLEdBQUcsR0FBRyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFFakYsSUFBSSxHQUFHLEVBQUU7WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUFnQixHQUFFLEVBQUUsR0FBRyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxHQUFHO0lBQ2QsQ0FBQztDQUVKO0FBM0JELG9DQTJCQzs7Ozs7Ozs7Ozs7OztBQ2pDRCxzSkFBOEU7QUFDOUUsd0dBQTBDO0FBRzFDLG1LQUFxRjtBQUNyRix3SUFBc0U7QUFHdEUsTUFBcUIsY0FBYztJQUcvQixZQUFxQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUVuQyxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWdCO1FBRWhCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztRQUNuQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7UUFFckMsTUFBTSxHQUFHLEdBQUcsMEJBQVcsRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQywyQ0FBMkM7UUFDakYsTUFBTSxLQUFLLEdBQUcseUNBQWlCLEVBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxLQUFLLEdBQUcseUNBQWlCLEVBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQywyQkFBMkI7UUFDeEYsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXO1FBQ3pFLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsY0FBYztRQUUzRCxrQkFBSSxFQUFDLHVDQUFnQixHQUFFLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQztJQUNqRyxDQUFDO0NBRUo7QUF0QkQsb0NBc0JDOzs7Ozs7Ozs7Ozs7O0FDM0JELHFHQUF3QztBQUV4QyxNQUFxQixVQUFVO0lBRTNCLFlBQXFCLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBRW5DLENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0I7UUFFaEIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUU5QixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3JDLHlCQUFTLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDaEQsQ0FBQyxDQUFDO2dCQUVGLGFBQWEsQ0FBQyxRQUFRLENBQUM7YUFDMUI7UUFFTCxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBRVgsQ0FBQztDQUVKO0FBdkJELGdDQXVCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1QkQsK0hBQXlDO0FBQ3pDLHlIQUFxQztBQUNyQyxxSUFBNkM7QUFDN0MscUlBQTZDO0FBQzdDLDRIQUF1QztBQUV2QyxtSEFBaUM7QUFDakMseUhBQXFDO0FBQ3JDLGlKQUFxRDtBQUVyRCw0SEFBOEM7QUFHOUMsU0FBZ0IsU0FBUyxDQUFDLE1BQWMsRUFBRSxRQUFnQjtJQUV0RCxtQ0FBbUM7O0lBRW5DLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGVBQUMsQ0FBQyxTQUFTLDBDQUFFLElBQUksTUFBSyxTQUFTLElBQUM7V0FDM0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsU0FBUywwQ0FBRSxTQUFTLElBQUMsRUFBRTtRQUVoRSxPQUFPLElBQUksNEJBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztLQUNsRDtJQUVELDZDQUE2QztJQUM3QyxJQUFJLGFBQU0sQ0FBQyxTQUFTLDBDQUFFLElBQUksTUFBSyxPQUFPLElBQUksYUFBTSxDQUFDLFNBQVMsMENBQUUsSUFBSSxNQUFLLE9BQU8sRUFBRTtRQUMxRSxPQUFPLElBQUksd0JBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO0tBQzlDO0lBRUQsSUFBSSxZQUFNLENBQUMsU0FBUywwQ0FBRSxLQUFLLEVBQUU7UUFDekIsT0FBTyxJQUFJLHNCQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztLQUM1QztJQUVELElBQUksTUFBTSxZQUFZLGVBQUssSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNqSyxPQUFPLElBQUksd0JBQWMsQ0FBQyxNQUFNLENBQUM7S0FDcEM7SUFFRCxJQUFJLE1BQU0sWUFBWSxlQUFLLElBQUksYUFBTSxDQUFDLFFBQVEsMENBQUUsSUFBSSxNQUFLLElBQUksRUFBRTtRQUMzRCxPQUFPLElBQUksa0JBQVEsQ0FBQyxNQUFNLENBQUM7S0FDOUI7SUFFRCxJQUFJLE1BQU0sWUFBWSxlQUFLLElBQUksYUFBTSxDQUFDLFFBQVEsMENBQUUsSUFBSSxNQUFLLE1BQU0sRUFBRTtRQUM3RCxPQUFPLElBQUksb0JBQVUsQ0FBQyxNQUFNLENBQUM7S0FDaEM7SUFFRCxJQUFJLE1BQU0sWUFBWSxlQUFLLEVBQUU7UUFDekIsT0FBTyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2pDO0lBRUQsT0FBTyxJQUFJLG9CQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUMzQyxDQUFDO0FBcENELDhCQW9DQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQ0QsZ0lBQTBDO0FBTTFDLFNBQWdCLFdBQVc7SUFDdkIsT0FBTyxJQUFJLHNCQUFZLEVBQUU7QUFDN0IsQ0FBQztBQUZELGtDQUVDOzs7Ozs7Ozs7Ozs7O0FDUkQsOEdBQWlEO0FBR2pELE1BQXFCLFlBQVk7SUFFN0IsVUFBVSxDQUFDLE1BQWMsRUFBRSxPQUFnQjtRQUV2QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQVMsRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUNBQUUsRUFBRSxJQUFDO0lBRW5ELENBQUM7Q0FFSjtBQVRELGtDQVNDOzs7Ozs7Ozs7Ozs7O0FDZEQsOEdBQWtFO0FBR2xFLHdHQUFtRDtBQUduRCxNQUFxQixVQUFVO0lBSTNCLFlBQ2EsSUFBa0IsRUFDbEIsYUFBb0MsRUFBRTtRQUR0QyxTQUFJLEdBQUosSUFBSSxDQUFjO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQTRCO1FBSW5ELFFBQUcsR0FBRyxDQUFDLEVBQU0sRUFBdUIsRUFBRTtZQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBTUQsUUFBRyxHQUFHLENBQUMsRUFBTSxFQUFFLE1BQWUsRUFBVyxFQUFFOztZQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUU7WUFDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDdkMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLG1DQUFJLGtCQUFJLEVBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztRQUMxRixDQUFDO1FBRUQsVUFBSyxHQUFHLENBQUMsS0FBYSxFQUFTLEVBQUU7WUFFN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU07aUJBQ3ZCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztZQUU1QyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU3RCxDQUFDO0lBekJELENBQUM7SUFPRCxJQUFJLE1BQU07UUFDTixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QyxDQUFDO0NBa0JKO0FBbkNELGdDQW1DQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDRCx3SEFBc0M7QUFVdEMsU0FBd0IsU0FBUyxDQUFDLElBQW1CO0lBQ2pELE9BQU8sSUFBSSxvQkFBVSxDQUFDLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLENBQUM7QUFDckMsQ0FBQztBQUZELCtCQUVDOzs7Ozs7Ozs7Ozs7O0FDZkQsOEdBQWlFO0FBRWpFLHNKQUE4RTtBQUM5RSwrRkFBOEM7QUFDOUMsOEdBQTRFO0FBQzVFLG1LQUFxRjtBQUNyRix3SUFBc0U7QUFDdEUsNEZBQWtDO0FBQ2xDLGtHQUFnRDtBQUNoRCxxR0FBa0Q7QUFDbEQscUdBQWtEO0FBRWxELE1BQXFCLFdBQVc7SUFLNUIsWUFDYSxNQUFXLEVBQ1gsRUFBTSxFQUNOLGFBQXNCLEVBQ3RCLE1BQWdCLEVBQ2hCLElBQWE7O1FBSmIsV0FBTSxHQUFOLE1BQU0sQ0FBSztRQUNYLE9BQUUsR0FBRixFQUFFLENBQUk7UUFDTixrQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUFVO1FBQ2hCLFNBQUksR0FBSixJQUFJLENBQVM7UUFSakIsWUFBTyxHQUFrQyxnQkFBSSxDQUFDLE1BQU0sMENBQUUsT0FBTyxtQ0FBSSxFQUFFO1FBQ25FLGVBQVUsR0FBYSxFQUFFO1FBZ0lsQyxZQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQU8sRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQVUsRUFBQztZQUNyRCxJQUFJLEVBQUUsbUJBQU0sRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksRUFBRSxDQUFDO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsV0FBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNO1FBM0h0QixJQUFJO1lBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU87U0FDckM7UUFBQyxXQUFNLEdBQUc7SUFFZixDQUFDO0lBRUQsRUFBRSxDQUFDLFNBQWlCOztRQUVoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFTLENBQUMsUUFBUSwwQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztRQUUxRCxPQUFPLElBQUksQ0FBQyxDQUFDO1lBQ1QseUJBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztJQUVqRSxDQUFDO0lBRVMsUUFBUSxDQUFDLEtBQWEsRUFBRSxJQUFjO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BELENBQUM7SUFFUyxJQUFJLENBQUMsSUFBWSxFQUFFLElBQWU7UUFDeEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWM7UUFFbkIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDM0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzthQUN2QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLG9CQUFXLENBQUMsQ0FBQztJQUVsRCxDQUFDO0lBRVMsU0FBUyxDQUFDLENBQVM7O1FBRXpCLE1BQU0sRUFBRSxHQUFHLHlDQUFpQixFQUFDLENBQUMsRUFBRSwwQkFBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRyxNQUFNLE1BQU0sR0FBRyx5QkFBUyxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQUksQ0FBQyxPQUFPLDBDQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRyxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxJQUFJLENBQUM7UUFFeEUsaUZBQWlGO1FBQ2pGLDhEQUE4RDtRQUM5RCxrREFBa0Q7UUFFbEQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFDLFFBQUMsQ0FBQyxRQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsSUFBSSwwQ0FBRyxDQUFDLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBQyxDQUFDLElBQUksMENBQUUsTUFBTSxNQUFLLENBQUMsQ0FBQyxJQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO1FBQ3JJLE9BQU8sTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQVc7SUFFN0YsQ0FBQztJQUVELEdBQUcsQ0FBQyxTQUFpQixFQUFFLElBQWE7UUFFaEMsSUFBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxFQUFFO1lBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ3pDO1FBRUQsSUFBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNsRDtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ2hELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUk7U0FDM0Q7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFFdEMsQ0FBQztJQUVTLFlBQVksQ0FBQyxLQUFhLEVBQUUsSUFBYTs7UUFFL0MsTUFBTSxLQUFLLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEtBQUssbUNBQUksRUFBRTtRQUMvQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFO1FBQzFCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLDBDQUFHLENBQUMsQ0FBRSxDQUFDLG1DQUNoQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUV6RSxJQUFJLElBQUksRUFBRTtZQUNOLE1BQU0sR0FBRyxHQUFHLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sS0FBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHlCQUFTLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7WUFDN0sseUJBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7U0FDcEM7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM5QjtJQUVMLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBZTs7UUFFaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQ3hCLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLG1DQUFJLHVCQUFRLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUNyQyxJQUFJLENBQUMsRUFBRSxFQUNQLEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FDNUM7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFjOztRQUVkLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsRUFBRTtZQUNILE1BQU0sSUFBSSxHQUFHLGdCQUFJLENBQUMsT0FBTywwQ0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG1DQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMvQyxJQUFJLE1BQU0sR0FBWSxJQUFJO1lBRTFCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2IsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsRUFBRSx1Q0FBZ0IsR0FBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQztZQUVGLE9BQU8sTUFBTTtTQUVoQjtJQUVMLENBQUM7Q0FTSjtBQTFJRCxpQ0EwSUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckpELDRIQUF1QztBQTJCdkMsU0FBZ0IsSUFBSSxDQUFDLEVBQU0sRUFBRSxDQUFVO0lBQ25DLE9BQU8sSUFBSSxxQkFBVyxDQUFDLENBQUMsYUFBRCxDQUFDLGNBQUQsQ0FBQyxHQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUN4RCxDQUFDO0FBRkQsb0JBRUM7Ozs7Ozs7Ozs7Ozs7O0FDN0JELFNBQWdCLE1BQU0sQ0FBQyxDQUFTO0lBRTVCLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztLQUMxQztTQUFNLElBQUksT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQy9CLE9BQU8sV0FBVztLQUNyQjtTQUFNLElBQUksQ0FBQyxFQUFFO1FBQ1YsT0FBTyxNQUFNO0tBQ2hCO0FBRUwsQ0FBQztBQVZELHdCQVVDOzs7Ozs7Ozs7Ozs7OztBQ1hELGlIQUF3RDtBQUkzQyxtQkFBVyxHQUFHLG1DQUFjLEVBQ3ZDLFdBQVcsRUFDWCxhQUFhLEVBQ2IsUUFBUSxFQUNSLFFBQVEsRUFDUixVQUFVLEVBQ1YsVUFBVSxFQUNWLE9BQU8sRUFDUCxPQUFPLEVBQ1AsT0FBTyxFQUNQLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLFFBQVEsRUFDUixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixhQUFhLEVBQ2IsU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBQUUsVUFBVTtBQUN4QixTQUFTLEVBQUUsdUJBQXVCO0FBQ2xDLFNBQVMsQ0FFVjs7Ozs7Ozs7Ozs7Ozs7QUMzQkQsTUFBTSxFQUFFLEdBQW9CO0lBQ3hCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLFFBQVE7Q0FDakI7QUFFRCxNQUFNLEdBQUcsR0FBb0I7SUFDekIsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsT0FBTztDQUNoQjtBQUVZLGVBQU8sR0FBc0I7SUFFdEMsRUFBRTtJQUNGLEdBQUc7SUFFSCxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFO0lBQzFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDN0MsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRTtJQUU3QztRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFFBQVEsQ0FBQywyQ0FBMkM7S0FDN0Q7SUFFRDtRQUNJLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxVQUFVO1FBQ2hCLElBQUksRUFBRSxXQUFXO1FBQ2pCLFdBQVcsRUFBRSxLQUFLO0tBQ3JCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsYUFBYTtRQUNuQixJQUFJLEVBQUUsV0FBVztRQUNqQixXQUFXLEVBQUUsR0FBRztLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLFdBQVc7UUFDakIsV0FBVyxFQUFFLEdBQUc7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLFdBQVc7S0FDcEI7SUFFRDtRQUNJLElBQUksRUFBRSxXQUFXO1FBQ2pCLElBQUksRUFBRSxXQUFXO0tBQ3BCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSxXQUFXO0tBQ3BCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7S0FDaEM7SUFFRDtRQUNJLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFlBQVk7S0FDckI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFdBQVc7S0FDcEI7SUFFRDtRQUNJLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLFdBQVc7S0FDcEI7SUFFRDtRQUNJLElBQUksRUFBRSxXQUFXO1FBQ2pCLElBQUksRUFBRSxXQUFXO0tBQ3BCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsYUFBYTtRQUNuQixJQUFJLEVBQUUsV0FBVztLQUNwQjtDQUNKOzs7Ozs7Ozs7Ozs7OztBQ25HWSxlQUFPLEdBQWE7SUFFL0IsVUFBVTtJQUNWLHNDQUFzQztJQUN0QywrQkFBK0I7SUFDL0IsbURBQW1EO0lBRW5EOzs7bUNBR2lDO0lBRWpDOzs7Ozt1Q0FLcUM7SUFFckMsbUVBQW1FO0lBQ25FLDhCQUE4QjtJQUU5Qjs7OEVBRTRFO0lBRTVFOzs7OzBCQUl3QjtJQUV4Qjs7O2FBR1c7SUFFWCx3RUFBd0U7SUFFeEU7O3FDQUVtQztJQUVuQzs7O3FDQUdtQztJQUVsQyx3QkFBd0I7SUFDeEIsaUJBQWlCO0lBQ2pCLG9DQUFvQztJQUNwQyxxQ0FBcUM7SUFDckMsNENBQTRDO0lBQzVDLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsaUJBQWlCO0lBR2xCLFNBQVM7SUFDVCx1REFBdUQ7SUFDdkQsaURBQWlEO0lBQ2pELGtEQUFrRDtJQUNsRCxpQkFBaUI7SUFDakIsNkNBQTZDO0lBQzdDLG1EQUFtRDtJQUNuRCx5Q0FBeUM7Q0FDMUM7Ozs7Ozs7Ozs7Ozs7O0FDaEVELGlIQUF3RDtBQUkzQyx3QkFBZ0IsR0FBRyxtQ0FBYyxFQUMxQyxPQUFPLEVBQ1AsV0FBVyxFQUNYLGFBQWEsQ0FDaEI7QUFFWSw0QkFBb0IsR0FBRyx3QkFBZ0IsQ0FBQyxNQUFNLEVBQUU7QUFFaEQsZ0JBQVEsR0FBYztJQUUvQixPQUFPLEVBQUU7UUFDTCxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDekQsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtLQUN2QztJQUNELFdBQVcsRUFBRTtRQUNULEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDdEMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0tBQ3RDO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1FBQ2hDLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtLQUN2QztDQUVKOzs7Ozs7Ozs7Ozs7O0FDL0JELHdIQUE4RDtBQUM5RCxzSUFBb0U7QUFDcEUscUlBQWlFO0FBQ2pFLG9HQUFpRDtBQUdqRCwrRkFBc0M7QUFJdEMsTUFBcUIsVUFBVTtJQUUzQixZQUNhLE9BQWdCLEVBQ2hCLFdBQVcsMEJBQVcsR0FBRTtRQUR4QixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBRWpDLDJCQUEyQjtRQUMzQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFNLElBQUksT0FBTyxJQUFJLEdBQUcsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDO1FBRWhILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFlO1FBRW5CLE9BQU8sc0JBQVMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUV6RCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLE9BQU8sRUFBRTthQUNaO1lBRUQsTUFBTSxNQUFNLEdBQUcsdUJBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQyxNQUFNO1lBQ25DLGlDQUFpQztZQUVqQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUU7Z0JBRXRCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7YUFFeEQ7aUJBQU07Z0JBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxxQkFBTyxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVqRixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx1QkFBUSxFQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNoRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTFDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDcEQ7UUFFTCxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7SUFDYixDQUFDO0NBRUo7QUF6Q0QsZ0NBeUNDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25ERCx1R0FBa0U7QUFDbEUsc0hBQXFDO0FBV3JDLFNBQWdCLFFBQVEsQ0FBQyxJQUFrQjtJQUN2QyxPQUFPLElBQUksb0JBQVUsQ0FBQywyQkFBYSxFQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFGRCw0QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNaRCxTQUFnQixRQUFRLENBQUMsT0FBZ0IsRUFBRSxJQUEyQjtJQUVsRSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO0lBRS9CLElBQUksTUFBTSxZQUFZLFdBQVcsRUFBRTtRQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtLQUMvRDtBQUVMLENBQUM7QUFSRCw0QkFRQzs7Ozs7Ozs7Ozs7OztBQ1JELDhHQUFnRTtBQUdoRSxxSUFBbUU7QUFDbkUscUlBQW1FO0FBSW5FLE1BQXFCLFlBQVk7SUFhN0IsWUFBcUIsTUFBYyxFQUFXLE1BQWM7UUFBdkMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFXLFdBQU0sR0FBTixNQUFNLENBQVE7UUFYekMseUJBQW9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0I7UUFDdkQsY0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUN6QyxnQkFBVyxHQUFvQixJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ25ELGFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87UUFDL0IsWUFBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztRQUM3QixnQkFBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVztRQUNyQyxRQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHO1FBQ3JCLFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDckIsVUFBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztRQUN6QixTQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1FBbUJoQyxjQUFTLEdBQUcsQ0FBQyxXQUFtQixFQUFzQixFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDLFFBQVE7aUJBQ2YsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7aUJBQzlELEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDO1FBaUJELGNBQVMsR0FBRyxDQUFDLEtBQWMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sTUFBTSxHQUFHLGlDQUFhLEVBQUMsS0FBSyxDQUFDO1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQXFCLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTTtZQUM1RCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDM0MsQ0FBQztRQUVELGNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFOztZQUMxQixPQUFPLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBcUIsQ0FBQyxtQ0FBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsNENBQTRDO1FBQzlILENBQUM7UUFFRCxjQUFTLEdBQUcsQ0FBQyxNQUFjLEVBQUUsRUFBRTtZQUUzQixJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDcEU7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUF2REcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFFdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBVSxFQUFDO2dCQUN0QixJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLEVBQUUsU0FBUzthQUNsQixDQUFDLENBQUM7UUFFUCxDQUFDLENBQUM7SUFFTixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07SUFDN0IsQ0FBQztJQVFTLGFBQWE7UUFDbkIsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFvQjtRQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQWEsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVztJQUMzQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUTtJQUN4QixDQUFDO0lBdUJELElBQUksUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVztRQUM5QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQ3RDLE9BQU8sR0FBRztJQUNkLENBQUM7Q0FFSjtBQTlFRCxrQ0E4RUM7Ozs7Ozs7Ozs7Ozs7O0FDeEZELGlHQUE4QztBQUM5QywwR0FBaUU7QUFDakUsaUdBQThDO0FBQzlDLG9HQUFxRjtBQUNyRiw4R0FBZ0U7QUFZaEUsU0FBZ0IsU0FBUztJQUVyQixPQUFPO1FBQ0gsV0FBVyxFQUFYLHdCQUFXO1FBQ1gsT0FBTyxFQUFFLGlCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsdUJBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxRQUFRLEVBQVIsbUJBQVE7UUFDUixPQUFPLEVBQVAsaUJBQU87UUFDUCxvQkFBb0IsRUFBcEIsK0JBQW9CO0tBQ3ZCO0FBQ0wsQ0FBQztBQVRELDhCQVNDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCRCwrSEFBOEU7QUFNOUUsOEhBQTBDO0FBQzFDLDJGQUFxQztBQWlCckMsU0FBZ0IsYUFBYSxDQUFDLElBQW9CO0lBQzlDLE9BQU8sSUFBSSxzQkFBWSxDQUFDLG9CQUFTLEVBQUMsSUFBSSxDQUFDLEVBQUUsc0JBQVMsR0FBRSxDQUFDO0FBQ3pELENBQUM7QUFGRCxzQ0FFQzs7Ozs7Ozs7Ozs7OztBQ3hCRCwySEFBb0Q7QUFDcEQsa0hBQThDO0FBQzlDLHFIQUFnRDtBQUNoRCx5SkFBd0U7QUFHeEUsTUFBcUIsVUFBVTtJQUszQixZQUFxQixVQUFrQixFQUFXLE9BQWdCO1FBQTdDLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRnhELFNBQUksR0FBVyxDQUFDO1FBSXRCLE1BQU0sS0FBSyxHQUNQLCtDQUFvQixFQUFDLHVCQUFRLEVBQUMsVUFBVSxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUN0RCxJQUFJLEVBQUU7YUFDTixLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ2YsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsMkJBQVUsRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLElBQUksRUFBRTtJQUNmLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJO0lBQ3BCLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBVztRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRztJQUNuQixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFnQjtRQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO0lBQ3pDLENBQUM7Q0FFSjtBQXpDRCxnQ0F5Q0M7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNELDhIQUF5QztBQW1CekMsU0FBZ0IsVUFBVSxDQUFDLElBQXFCO0lBQzVDLE9BQU8sSUFBSSxzQkFBWSxDQUFDLElBQUksQ0FBQztBQUNqQyxDQUFDO0FBRkQsZ0NBRUM7Ozs7Ozs7Ozs7Ozs7QUN0QkQseUlBQStEO0FBQy9ELHdIQUFpRDtBQUNqRCx3SEFBaUQ7QUFDakQsMkZBQTZDO0FBRTdDLE1BQXFCLFlBQVk7SUFTN0IsWUFDYSxPQUF5Qjs7UUFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFSdEMsVUFBSyxHQUFHLFVBQUksQ0FBQyxPQUFPLDBDQUFFLEtBQUs7UUFDM0IsbUJBQWMsR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsY0FBYyxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxjQUFjO1FBQzNFLFVBQUssR0FBRyxnQkFBSSxDQUFDLE9BQU8sMENBQUUsS0FBSyxtQ0FBSSxVQUFJLENBQUMsS0FBSywwQ0FBRSxLQUFLO1FBQ2hELGdCQUFXLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLFdBQVcsbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsV0FBVztRQUNsRSxVQUFLLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLEtBQUssbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsS0FBSztRQUNoRCxhQUFRLEdBQUcsZ0JBQUksQ0FBQyxPQUFPLDBDQUFFLFFBQVEsbUNBQUksVUFBSSxDQUFDLEtBQUssMENBQUUsUUFBUTtJQUt6RCxDQUFDO0lBRUQsSUFBSSxJQUFJOztRQUVKLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1NBQ3pCO1FBRUQsT0FBTyxVQUFJLENBQUMsT0FBTywwQ0FBRSxJQUFXO0lBQ3BDLENBQUM7SUFFRCxJQUFJLElBQUk7O1FBRUosSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osT0FBUSxJQUFJLENBQUMsS0FBZ0IsQ0FBQyxJQUFJO1NBQ3JDO1FBRUQsT0FBTyxVQUFJLENBQUMsT0FBTywwQ0FBRSxJQUFXO0lBQ3BDLENBQUM7SUFFRCxJQUFJLFFBQVE7O1FBQ1IsT0FBTyw4QkFBWSxFQUFDLFVBQUksQ0FBQyxPQUFPLDBDQUFFLFdBQVcsQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1QsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxNQUFLLE1BQU0sSUFBSyxJQUFZLENBQUMsUUFBUSxJQUFJLENBQUUsSUFBWSxDQUFDLEtBQUs7SUFDbEYsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFnQjtRQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDckUsT0FBTyxDQUFDLHVCQUFVLEVBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSx5QkFBUyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUN0RjtRQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QyxPQUFPLHlCQUFTLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHVCQUFVLEVBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzlFO1FBRUQsT0FBTyxFQUFFO0lBQ2IsQ0FBQztJQUVELElBQUksV0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVE7O1FBQ0osT0FBTyxZQUFDLE1BQWMsMENBQUcsSUFBSSxDQUFDLEtBQVksQ0FBQywwQ0FBRSxTQUFTLENBQUM7SUFDM0QsQ0FBQztDQUVKO0FBN0RELGtDQTZEQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRUQsd0hBQXFDO0FBWXJDLFNBQWdCLFFBQVEsQ0FBQyxVQUFrQixFQUFFLE9BQWdCO0lBQ3pELE9BQU8sSUFBSSxvQkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUZELDRCQUVDOzs7Ozs7Ozs7Ozs7OztBQ2ZELFNBQWdCLFNBQVMsQ0FBQyxJQUFXO0lBQ2pDLE9BQU8sQ0FBQyxJQUFJLEdBQUMsR0FBRyxDQUFDO0FBQ3JCLENBQUM7QUFGRCw4QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNERCxpSEFBeUQ7QUFDekQsNEZBQThDO0FBRzlDLFNBQWdCLGFBQWEsQ0FBQyxJQUFZLEVBQUUsT0FBZ0IsRUFBRSxLQUFlOztJQUV6RSxNQUFNLFFBQVEsR0FBRyxLQUFLO1NBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsdUJBQVUsRUFBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDOUQsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxXQUFDLG9CQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxtQ0FBSSxFQUFFLElBQUM7U0FDcEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDL0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7SUFFckQsTUFBTSxjQUFjLEdBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxxQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBSSxNQUFLLFNBQVMsSUFBQztXQUN0RCxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxRQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQVcsQ0FBQyxJQUFDLGtEQUFnRDtJQUV6SixNQUFNLElBQUksR0FBRyxvQkFBUSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLG1DQUMxQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2IsU0FBUztRQUNULENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFakIsT0FBTyx1QkFBVSxFQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsb0JBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksbUNBQUksSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUN2RixDQUFDO0FBcEJELHNDQW9CQzs7Ozs7Ozs7Ozs7Ozs7QUN2QkQsMEhBQStDO0FBQy9DLHVIQUE2QztBQUc3QyxTQUFnQixVQUFVLENBQUMsSUFBWSxFQUFFLE9BQWdCLEVBQUUsS0FBZTs7SUFFdEUsTUFBTSxHQUFHLEdBQUcsbUJBQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1DQUMvQiwrQkFBWSxFQUFDLElBQUksQ0FBQyxtQ0FDbEIsaUNBQWEsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUV2QyxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLEdBQUcsQ0FBQztBQUViLENBQUM7QUFWRCxnQ0FVQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCwyR0FBc0M7QUFDdEMsd0dBQW9DO0FBRXBDLFNBQWdCLG9CQUFvQixDQUFDLFVBQWtCLEVBQUUsT0FBaUI7SUFFdEUsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBRTNCLE9BQU87U0FDRixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1NBQzFCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNULE1BQU0sTUFBTSxHQUFHLHVCQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxxQkFBTyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFUCxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBWkQsb0RBWUM7Ozs7Ozs7Ozs7Ozs7O0FDaEJELDRGQUFzQztBQUd0QyxTQUFnQixZQUFZLENBQUMsSUFBWTtJQUVyQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDbkIsT0FBTyx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQztLQUNuRTtBQUVMLENBQUM7QUFORCxvQ0FNQzs7Ozs7Ozs7Ozs7Ozs7QUNURCxTQUFnQixTQUFTLENBQUMsSUFBWTtJQUNsQyxPQUFPLElBQUksR0FBRyxHQUFHO0FBQ3JCLENBQUM7QUFGRCw4QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNERCxTQUFnQixPQUFPLENBQUMsTUFBYztJQUNsQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNGRCxTQUFnQixRQUFRLENBQUMsTUFBYztJQUNuQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFGRCw0QkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNGRCxTQUFnQixPQUFPLENBQUMsTUFBYztJQUNsQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNERCxpSUFBb0U7QUFJcEUsK0ZBQXlDO0FBSXpDLE1BQWEsVUFBVTtJQUVuQixZQUN1QixVQUFrQixFQUNsQixPQUFnQixFQUNoQixRQUFRLG9CQUFRLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztRQUZyQyxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsVUFBSyxHQUFMLEtBQUssQ0FBZ0M7UUE0Q2xELGVBQVUsR0FBRyxDQUFDLElBQWEsRUFBRSxJQUFXLEVBQXVCLEVBQUU7WUFFdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBRTVDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEM7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQXFCLEVBQUUsSUFBSSxDQUFDO2FBQzFEO1FBRUwsQ0FBQztRQUVTLGNBQVMsR0FBRyxDQUFDLENBQVMsRUFBdUIsRUFBRTtZQUVyRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7Z0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNqQixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTthQUNyQztRQUVMLENBQUM7UUFFUyxtQkFBYyxHQUFHLENBQUMsSUFBbUIsRUFBRSxJQUFXLEVBQXVCLEVBQUU7O1lBRWpGLE1BQU0sS0FBSyxHQUFRLEVBQUU7WUFFckIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFFMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBRS9CLElBQUksQ0FBQyxHQUFHLElBQUksNkJBQVcsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQy9CLE9BQU8sU0FBUztpQkFDbkI7Z0JBRUQsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDTixTQUFRO2lCQUNYO2dCQUVELEtBQUssQ0FBQyxPQUFDLENBQUMsSUFBSSxtQ0FBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRzthQUVsQztZQUVELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLFNBQVM7YUFDbkI7WUFFRCxPQUFPO2dCQUNILElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUssRUFBRSxLQUFLO2FBQ2Y7UUFDTCxDQUFDO1FBRVMsZ0JBQVcsR0FBRyxDQUFDLENBQVMsRUFBRSxJQUFXLEVBQXVCLEVBQUU7WUFFcEUsTUFBTSxJQUFJLEdBQWMsRUFBRTtZQUUxQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBRXRCLElBQUksQ0FBQyw4QkFBWSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDN0MsTUFBSztpQkFDUjtnQkFFRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFFdkMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDSixNQUFLO2lCQUNSO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixPQUFPLFNBQVM7YUFDbkI7WUFFRCxPQUFPLDhCQUFZLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ2xCLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhCLENBQUM7UUFFUyxXQUFNLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFlLENBQUM7UUFDN0QsQ0FBQztJQS9IRCxDQUFDO0lBRUQsUUFBUTs7UUFFSixNQUFNLE9BQU8sR0FBYyxFQUFFO1FBRTdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtZQUV0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBRWxELElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ04sTUFBSzthQUNSO1lBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLElBQUksV0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLDBDQUFFLElBQUksTUFBSyxVQUFVLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2FBQ3BCO1NBRUo7UUFFRCxPQUFPLE9BQU87SUFDbEIsQ0FBQztJQUdTLFFBQVEsQ0FBQyxLQUFnQixFQUFFLElBQVc7UUFFNUMsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7WUFFbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztZQUVsQyxJQUFJLENBQUMsRUFBRTtnQkFDSCxPQUFPLENBQUM7YUFDWDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztTQUM3QjtJQUVMLENBQUM7SUF5RlMsUUFBUSxDQUFDLEdBQVk7UUFFM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDWixPQUFPLEdBQUc7U0FDYjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFL0MsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRDtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU07YUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxDQUFDO1FBRXZDLHVDQUFZLEdBQUcsS0FBRSxLQUFLLEVBQUUsV0FBVyxJQUFFO0lBRXpDLENBQUM7Q0FFSjtBQTdKRCxnQ0E2SkM7Ozs7Ozs7Ozs7Ozs7O0FDbEtNLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLHVCQUF1QjtPQUNoRixDQUFDLElBQUksR0FBRztPQUNSLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFGRCxtQkFBVyxlQUVWO0FBRVAsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHO09BQ2xELENBQUMsSUFBSSxHQUFHO0FBREYsb0JBQVksZ0JBQ1Y7Ozs7Ozs7Ozs7Ozs7O0FDVGYseUdBQTBDO0FBTzFDLFNBQWdCLFNBQVMsQ0FBQyxVQUFrQixFQUFFLE9BQWdCO0lBQzFELE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDOUMsQ0FBQztBQUZELDhCQUVDOzs7Ozs7Ozs7Ozs7OztBQ1BELFNBQWdCLGFBQWEsQ0FBQyxLQUFjOztJQUV4QyxNQUFNLFVBQVUsR0FBRyx1QkFBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssMENBQUUsU0FBUywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDdEQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sSUFBSSxHQUFHLHVCQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLE1BQU0sMENBQUUsSUFBSTtJQUVoRCxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztLQUN2QztJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNCLENBQUM7QUFYRCxzQ0FXQztBQUVELFNBQVMsaUJBQWlCLENBQUMsU0FBa0I7O0lBRXpDLE1BQU0sY0FBYyxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLE1BQU0sbUNBQUksRUFBRSxJQUFDO0lBRTlELE1BQU0sWUFBWSxHQUFHLDJCQUFTLENBQUMsS0FBSywwQ0FBRSxXQUFXLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsY0FBQyxDQUFDLEtBQUssMENBQUUsT0FBTyxJQUFDO0lBRXhELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFFdkQsT0FBTztRQUNILElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsYUFBQyxPQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSwwQ0FBRSxJQUFnQixtQ0FBSSxFQUFFLElBQUM7UUFDL0QsSUFBSSxFQUFFLGNBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQVk7UUFDbEMsTUFBTSxFQUFFLGVBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFdBQVc7S0FDdkM7QUFFTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQzlCTSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7O0lBRXJGLE9BQU8scUJBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG1DQUNsQixpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxtQ0FDakMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO0FBRWxDLENBQUM7QUFOWSxxQkFBYSxpQkFNekI7QUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQVUsRUFBRSxDQUFVLEVBQUUsRUFBRTtJQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqQyxDQUFDO0FBRUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQWdCLEVBQUUsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLEVBQUU7SUFFbEYsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUV6RCxJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7UUFDN0IsT0FBTyxTQUFTO0tBQ25CO0lBRUQsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRS9CLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsQ0FBZ0IsRUFBRSxRQUFtQixFQUFFLFVBQXFCLEVBQUU7O0lBRXZGLE1BQU0sT0FBTyxHQUFHLGNBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQUksRUFBRTtJQUVqQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBRTVDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixPQUFPLEVBQUU7U0FDWjthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQWtCLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RjtJQUVMLENBQUMsQ0FBQztBQUVOLENBQUM7QUFkRCxvQ0FjQztBQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxDQUFnQixFQUFFLFFBQW1CLEVBQUUsRUFBRTtJQUMzRSxPQUFPLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTTtBQUM5RSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDOUNELG9HQUFnRDtBQUVoRCxTQUF3QixJQUFJO0lBRXhCLE1BQU0sS0FBSyxHQUFHO1FBQ1YsS0FBSyxFQUFFLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hDLGFBQWEsRUFBRSxLQUFLO0tBQ3ZCO0lBRUQsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO1FBQ2hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYTtRQUN0QyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ25ELFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU07SUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSztJQUM3QixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUk7SUFDdEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUTtJQUNsQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHO0lBQ3hCLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU07SUFDOUIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2RCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRTtRQUUxQyxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFDakMsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhO1NBQzdDO2FBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3hDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDdEI7UUFFRCxNQUFNLEVBQUU7SUFDWixDQUFDLENBQUMsQ0FBQztJQUVGLE1BQWMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUs7QUFDdkMsQ0FBQztBQXBDRCwwQkFvQ0M7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0QsMkZBQTZFO0FBRTdFLGlIQUFrRDtBQUVsRCx5R0FBNEI7QUFDNUIsa0hBQThDO0FBRTlDLHdHQUFvRDtBQUNwRCxzRkFBd0M7QUFFeEMsTUFBcUIsR0FBRztJQUtwQixZQUNhLE9BQWUsRUFDZixPQUFlLEVBQ2YsaUJBQWlCLEtBQUssRUFDdEIsVUFBVSxLQUFLLEVBQ2YsZ0JBQWdCLEtBQUssRUFDckIsV0FBVyxLQUFLO1FBTGhCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsbUJBQWMsR0FBZCxjQUFjLENBQVE7UUFDdEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFUcEIsYUFBUSxHQUFHLDJCQUFVLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkYsYUFBUSxHQUFHLGVBQUksRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQWlDN0UsWUFBTyxHQUFHLENBQUMsVUFBa0IsRUFBVSxFQUFFLENBQUMsSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztRQUNyRSxVQUFLLEdBQUcsQ0FBQyxFQUFNLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5RSxZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RixhQUFRLEdBQUcsQ0FBQyxFQUFNLEVBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQTFCNUYsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYzs7UUFDN0IsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQWU7O1FBQ2hCLE9BQU8sSUFBSSxHQUFHLENBQ1YsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3hDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN4QyxJQUFJLENBQUMsY0FBYyxFQUNuQixLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQzNDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXLG1DQUFJLElBQUksQ0FBQyxhQUFhLEVBQ3ZDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxRQUFRLG1DQUFJLElBQUksQ0FBQyxRQUFRLENBQ2xDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNuRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ3RELENBQUM7SUFRRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0YsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzFGLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWEsRUFBRSxJQUFnQjs7UUFFakMsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxxQkFBTyxFQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFCO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBVSxFQUFFO1FBQ3hCLE1BQU0sRUFBRSxHQUFHLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLG1DQUFJLHFCQUFPLEVBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN4QixRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFFM0IsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQyx5Q0FBeUM7Z0JBQzFILE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUVyQyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBRXZDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLHNCQUFzQjtvQkFDakUsd0NBQXdDO29CQUN4Qyx3Q0FBd0M7b0JBQ3hDLHNDQUFzQztvQkFDdEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDO2lCQUN4QjtnQkFFRCxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsZUFBQyxDQUFDLFNBQVMsMENBQUUsSUFBSSxNQUFLLFNBQVMsSUFBQyxFQUFFO29CQUNyRCxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUM7aUJBQ3hCO1lBRUwsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDO1FBRUYsT0FBTyxNQUFNO0lBQ2pCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFFTixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDOUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBRTlCLElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxvQkFBVyxDQUFDLFFBQVEsRUFBRTtZQUN0QyxPQUFPLEVBQUU7U0FDWjtRQUVELElBQUksRUFBRSxDQUFDLFFBQVEsS0FBSyxvQkFBVyxDQUFDLFFBQVEsRUFBRTtZQUN0QyxPQUFPLEVBQUU7U0FDWjtRQUVELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBRWxELENBQUM7Q0FFSjtBQTNHRCx5QkEyR0M7QUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFNLEVBQUUsRUFBTSxFQUFFLE1BQWE7O0lBRXhDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLHVDQUF1QztRQUN6RSxPQUFNO0tBQ1Q7SUFFRCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkMsTUFBTSxDQUFDLEdBQUcsWUFBTSxDQUFDLENBQUMsQ0FBQyxtQ0FBSSxFQUFFO0lBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO0lBQ1YsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUUxQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xJRCwyRkFBa0U7QUFHbEUseUdBQTRCO0FBQzVCLG1HQUF3QjtBQUN4QixrSEFBOEM7QUFFOUMsc0ZBQXdDO0FBQ3hDLHdHQUFvRDtBQUVwRCxNQUFhLFdBQVc7SUFRcEIsWUFDYSxTQUFpQixFQUNqQixJQUFVLEVBQ1YsVUFBVSxLQUFLLEVBQ2YsZ0JBQWdCLEtBQUssRUFDckIsV0FBVyxLQUFLO1FBSmhCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNWLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUNyQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBWHBCLFdBQU0sR0FBRyxJQUFJO1FBQ2IsVUFBSyxHQUFHLElBQUk7UUFDWixVQUFLLEdBQUcsb0JBQVc7UUFDbkIsYUFBUSxHQUFHLGVBQUksRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFCLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBVTFILENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUNoQixPQUFPLElBQUksV0FBVyxDQUNsQixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsWUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsbUNBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUMsRUFDckQsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUMzQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxtQ0FBSSxJQUFJLENBQUMsYUFBYSxFQUN2QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxDQUNsQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQWtCO1FBQ3RCLE9BQU8sSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQU07UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9CQUFXO0lBQzFELENBQUM7SUFFRCxPQUFPLENBQUMsRUFBTTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwRixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDcEYsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUc7UUFDbEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN2RixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFFZixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDaEIsT0FBTyxDQUFDLHFCQUFPLEVBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7UUFFRCxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLFdBQVc7UUFFdkMsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLFdBQVcsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sRUFBRTtTQUNaO1FBRUQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUM5QyxPQUFPLEVBQUU7U0FDWjtRQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJO2FBQ2pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsQ0FBQztRQUV2QyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2hCLENBQUM7Q0FFSjtBQXBGRCxrQ0FvRkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUZELDBHQUEyQztBQUczQywySEFBdUM7QUErQnZDLFNBQWdCLFFBQVEsQ0FBQyxTQUFpQixFQUFFLEdBQUcsSUFBVTtJQUNyRCxPQUFPLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzNDLENBQUM7QUFGRCw0QkFFQztBQUVZLG1CQUFXLEdBQVcsSUFBSSxxQkFBVyxFQUFFOzs7Ozs7Ozs7Ozs7O0FDakNwRCxNQUFxQixXQUFXO0lBQWhDO1FBRWEsYUFBUSxHQUFHLENBQUM7UUFDWixhQUFRLEdBQUcsRUFBRTtRQUNiLFVBQUssR0FBRyxJQUFJO1FBQ1osVUFBSyxHQUFHLElBQUk7UUFDWixXQUFNLEdBQUcsSUFBSTtRQUV0QixTQUFJLEdBQUcsQ0FBQyxJQUFlLEVBQVUsRUFBRSxDQUFDLElBQUk7UUFDeEMsUUFBRyxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWMsRUFBVSxFQUFFLENBQUMsS0FBSztRQUN0RCxZQUFPLEdBQUcsQ0FBQyxVQUFrQixFQUFVLEVBQUUsQ0FBQyxVQUFVO1FBQ3BELGFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ25CLFVBQUssR0FBRyxDQUFDLEVBQU0sRUFBVSxFQUFFLENBQUMsSUFBSTtRQUNoQyxZQUFPLEdBQUcsQ0FBQyxFQUFNLEVBQVEsRUFBRSxDQUFDLEVBQUU7UUFDOUIsYUFBUSxHQUFHLENBQUMsRUFBTSxFQUFRLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLGFBQVEsR0FBRyxDQUFDLEVBQU0sRUFBWSxFQUFFLENBQUMsRUFBRTtRQUNuQyxVQUFLLEdBQUcsQ0FBQyxNQUFjLEVBQVMsRUFBRSxDQUFDLEVBQUU7UUFDckMsYUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUU7SUFFdkIsQ0FBQztDQUFBO0FBbkJELGlDQW1CQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCRCxtR0FBd0I7QUFFeEIsd0dBQW9EO0FBQ3BELHNGQUF3QztBQUV4QyxNQUFxQixLQUFLO0lBTXRCLFlBQ2EsU0FBaUIsRUFDakIsV0FBbUIsRUFDbkIsVUFBVSxLQUFLLEVBQ2YsZ0JBQWdCLEtBQUssRUFDckIsUUFBaUIsRUFDakIsV0FBVyxLQUFLO1FBTGhCLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQVZwQixVQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVM7UUFDdEIsVUFBSyxHQUFHLElBQUksQ0FBQyxXQUFXO1FBQ3hCLGFBQVEsR0FBRywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBV3RHLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUVoQixPQUFPLElBQUksS0FBSyxDQUNaLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUMxQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDNUMsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUMzQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxtQ0FBSSxJQUFJLENBQUMsYUFBYSxFQUN2QyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxFQUMvQixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxDQUNsQztJQUVMLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxlQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBTTtRQUNSLHFDQUFxQztRQUNyQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsUUFBUTs7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLGdCQUFJLENBQUMsUUFBUSwwQ0FBRSxJQUFJLG1DQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDM0csT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBTTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1lBQzlCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU07U0FDbkMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQTlFRCwyQkE4RUM7Ozs7Ozs7Ozs7Ozs7O0FDakZELFNBQWdCLE9BQU8sQ0FBQyxPQUFnQixFQUFFLE1BQWMsRUFBRSxPQUFXO0lBRWpFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUMsa0JBQWtCO0lBRTVELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsSUFBQztLQUN0RTtJQUVELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxjQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsbUNBQUksRUFBRSxJQUFDO0FBRWpFLENBQUM7QUFaRCwwQkFZQzs7Ozs7Ozs7Ozs7Ozs7QUNkRCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsTUFBVTtJQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUU1QyxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXBFLENBQUM7QUFSRCw4Q0FRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCw4R0FBZ0Q7QUFDaEQsb0hBQW9EO0FBRXBELFNBQWdCLFdBQVcsQ0FBQyxNQUFjO0lBRXRDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRO1NBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFFbEMsQ0FBQztBQVJELGtDQVFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1pELDRGQUErQztBQUMvQyw4R0FBZ0Q7QUFDaEQsMEdBQTRCO0FBRTVCLFNBQWdCLFNBQVMsQ0FBQyxNQUFjO0lBRXBDLElBQUksTUFBTSxZQUFZLGVBQUssRUFBRTtRQUN6QixPQUFPLE1BQU07S0FDaEI7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssb0JBQVcsRUFBRTtRQUM5QixPQUFPLE1BQU07S0FDaEI7SUFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEgsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQzVDO0lBRUQsT0FBTyxNQUFNO0FBQ2pCLENBQUM7QUFmRCw4QkFlQzs7Ozs7Ozs7Ozs7Ozs7QUNoQkQsU0FBZ0IsT0FBTyxDQUFDLE1BQWM7SUFDbEMsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLENBQUM7QUFDcEYsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ0hELHNEQUFzRDtBQUN0RCxTQUFnQixNQUFNLENBQUMsTUFBYyxFQUFFLE1BQWU7SUFFbEQsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE9BQU8sTUFBTTtLQUNoQjtJQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO0FBRXZHLENBQUM7QUFSRCx3QkFRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCw4R0FBZ0Q7QUFDaEQsOEdBQWdEO0FBRWhELFNBQWdCLGtCQUFrQixDQUFDLE1BQWM7SUFFN0MsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVE7U0FDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztTQUNyQixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9CLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsRUFBRSxFQUFFLENBQUM7SUFFM0MsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBRWxDLENBQUM7QUFWRCxnREFVQzs7Ozs7Ozs7Ozs7Ozs7QUNaRCxTQUFnQixlQUFlLENBQUMsTUFBYztJQUUxQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLGFBQUQsQ0FBQyxjQUFELENBQUMsR0FBSSxFQUFFLEVBQUUsQ0FBQztBQUV4QyxDQUFDO0FBTEQsMENBS0M7Ozs7Ozs7Ozs7Ozs7O0FDTEQsU0FBZ0IsV0FBVyxDQUFDLE1BQWM7SUFDdEMsT0FBTyxNQUFNO1NBQ1IsUUFBUTtTQUNSLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFORCxrQ0FNQzs7Ozs7Ozs7Ozs7Ozs7QUNSRCw2RkFBZ0M7QUFPaEMsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBMkI7SUFDeEQsTUFBTSxLQUFLLEdBQUcsS0FBSyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxpQkFBSyxFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDOUMsQ0FBQztBQUhELDRDQUdDO0FBRUQsTUFBTSxXQUFXLEdBQUcseUJBQXlCLEVBQUUsQ0FBQztBQUVoRCxRQUFRLENBQUMsQ0FBQyx5QkFBeUI7SUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsT0FBTyxJQUFJLEVBQUU7UUFDVCxDQUFDLEVBQUUsQ0FBQztRQUNKLE1BQU0sQ0FBQyxDQUFDO0tBQ1g7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2ZELFNBQWdCLE9BQU8sQ0FBQyxFQUFNO0lBQzFCLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ0pELFNBQWdCLEtBQUssQ0FBQyxDQUFLO0lBQ3ZCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUMxRixDQUFDO0FBRkQsc0JBRUM7Ozs7Ozs7Ozs7Ozs7O0FDSkQsbUdBQW9DO0FBRXBDOztHQUVHO0FBRUgsU0FBZ0IsT0FBTyxDQUFDLEdBQVM7SUFDN0IsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMscUJBQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxxQkFBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ05ELFNBQWdCLE9BQU8sQ0FBQyxFQUFNO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUMzRSxDQUFDO0FBRkQsMEJBRUM7Ozs7Ozs7Ozs7Ozs7O0FDRkQsU0FBZ0IsS0FBSyxDQUFDLEVBQU07SUFDeEIsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzNFLENBQUM7QUFGRCxzQkFFQzs7Ozs7Ozs7Ozs7Ozs7QUNIRCxtR0FBZ0U7QUFDaEUsc0lBQTZEO0FBQzdELGdJQUF5RDtBQUN6RCx1SEFBbUQ7QUFDbkQsMkpBQTJFO0FBQzNFLGtKQUFxRTtBQUNyRSwySUFBa0U7QUFDbEUsMEdBQTRDO0FBUTVDLFNBQWdCLFFBQVEsQ0FBQyxHQUFhLEVBQUUsSUFBbUI7O0lBRXZELElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixvQ0FBb0M7UUFDcEMsT0FBTyxvQkFBVztLQUNyQjtJQUVELElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtRQUVaLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQ2pJLE9BQU8scUJBQVEsRUFBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUN2RTtRQUVELE9BQU8sb0JBQVc7S0FFckI7SUFFRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDVixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsb0JBQVcsQ0FBQztLQUMxRjtJQUVELElBQUksTUFBTTtJQUNWLElBQUksR0FBRztJQUVQLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsT0FBTyxFQUFFO1FBQ3JCLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzlDO1NBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM5QixNQUFNLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM3QztTQUFNLElBQUksU0FBRyxDQUFDLEtBQUssMENBQUUsVUFBVSxFQUFFO1FBQzlCLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzFDO1NBQU0sSUFBSSxHQUFHLEdBQUcsZ0JBQUcsQ0FBQyxLQUFLLDBDQUFFLEtBQUssMENBQUUsTUFBTSxNQUFJLGVBQUcsQ0FBQyxLQUFLLDBDQUFFLEtBQUssMENBQUUsTUFBTSxNQUFJLGVBQUcsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsMENBQUUsTUFBTSxHQUFFO1FBQ3JHLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM1QztTQUFNLElBQUksU0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxFQUFFO1FBQzNCLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzlDO1NBQU07UUFDSCxNQUFNLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztLQUN6QztJQUVELElBQUksTUFBTSxFQUFFO1FBQ1IsTUFBTSxFQUFFLEdBQUcsVUFBRyxDQUFDLEtBQUssMENBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHlCQUFTLEVBQUMsTUFBTSxDQUFDO1FBQzdELE1BQU0sRUFBRSxHQUFHLDZCQUFXLEVBQUMsRUFBRSxDQUFDO1FBQzFCLE1BQU0sRUFBRSxHQUFHLHFDQUFlLEVBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLDJDQUFrQixFQUFDLEVBQUUsQ0FBQztRQUNqQyxNQUFNLEVBQUUsR0FBRyxtQkFBTSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsUUFBUSxFQUFDO1FBQzdDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxvQkFBVyxFQUFFLENBQUM7UUFDN0QsT0FBTyxFQUFFO0tBQ1o7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0FBRXpELENBQUM7QUFuREQsNEJBbURDO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQWEsRUFBRSxFQUFFLFdBQUMsUUFBQyxDQUFDLFVBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE1BQU07QUFFaEUsU0FBUyxzQkFBc0IsQ0FBQyxjQUF1QixFQUFFLElBQW1COztJQUV4RSxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNyRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsb0JBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsb0JBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxLQUFLLDBDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUVwRixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3BELENBQUM7QUFFRCxTQUFTLHVCQUF1QixDQUFDLGVBQXdCLEVBQUUsSUFBbUI7O0lBRTFFLE1BQU0sU0FBUyxHQUFHLHFCQUFlLGFBQWYsZUFBZSx1QkFBZixlQUFlLENBQUUsS0FBSywwQ0FBRSxTQUFTO0lBQ25ELE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7QUFDcEMsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsVUFBbUIsRUFBRSxJQUFtQjs7SUFFaEUsTUFBTSxPQUFPLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksdUNBQWdCLEdBQUU7SUFDbkQsTUFBTSxTQUFTLEdBQUcsaUJBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLDBDQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsaUJBQUssRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztJQUN4RSxNQUFNLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7SUFFbkMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFVLENBQUMsS0FBSyxtQ0FBSSxFQUFFLENBQUM7U0FDdkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztBQUU1RSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFZLEVBQUUsR0FBVyxFQUFFLElBQW1COztJQUVwRSxNQUFNLE1BQU0sR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNsRCxNQUFNLEtBQUssR0FBRyx1Q0FBZ0IsR0FBRTtJQUVoQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2pFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFHLENBQUMsS0FBSywwQ0FBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFFOUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLG9CQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztJQUNoRSxNQUFNLFFBQVEsR0FBRyxxQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztJQUN2QyxNQUFNLGVBQWUsR0FBRyxPQUFPLEtBQUssb0JBQVc7SUFFL0MsT0FBTyxPQUFPO1NBQ1QsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUNYLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLENBQUM7QUFFcEQsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsR0FBWSxFQUFFLElBQW1COztJQUU5RCxNQUFNLE9BQU8sR0FBRyxlQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLDBDQUFFLE1BQU07SUFDMUMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsRUFBRSxJQUFJLENBQUM7SUFDMUQsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUVyRSxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsSUFBbUI7O0lBRTFELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFHLENBQUMsS0FBSywwQ0FBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsS0FBSywwQ0FBRSxJQUFJLDBDQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUUxRCxJQUFJLGdCQUFHLENBQUMsS0FBSywwQ0FBRSxJQUFJLDBDQUFFLElBQUksT0FBSyxlQUFHLENBQUMsS0FBSywwQ0FBRSxLQUFLLDBDQUFFLElBQUksR0FBRTtRQUNsRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0tBQ3pCO1NBQU07UUFDSCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDN0M7QUFFTCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3pJRCxTQUFnQixPQUFPLENBQUMsTUFBYyxFQUFFLElBQUksR0FBRyxDQUFDO0lBRTVDLElBQUksR0FBRyxHQUFHLE1BQU07SUFDaEIsSUFBSSxHQUFHLEdBQWEsRUFBRTtJQUV0QixPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDaEIsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELEdBQUcsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztRQUNoQyxJQUFJLEVBQUU7S0FDVDtJQUVELE9BQU8sR0FBRztBQUNkLENBQUM7QUFiRCwwQkFhQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxTQUFnQixRQUFRLENBQUMsTUFBYztJQUVuQyxJQUFJLE1BQU0sWUFBWSxXQUFXLEVBQUU7UUFDL0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBaUI7UUFDakQsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUztRQUNwQyxPQUFPLE9BQU87S0FDakI7U0FBTTtRQUNILHlCQUFZLE1BQU0sRUFBRTtLQUN2QjtBQUVMLENBQUM7QUFWRCw0QkFVQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCxTQUFnQixTQUFTLENBQUMsTUFBVyxFQUFFLElBQWM7SUFFakQsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLHNCQUFzQjtJQUU5QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN0QixDQUFDLEdBQUcsQ0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFHLENBQUMsQ0FBQztJQUNkLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQztBQUVaLENBQUM7QUFWRCw4QkFVQzs7Ozs7Ozs7Ozs7Ozs7QUNURCxTQUFnQixVQUFVLENBQUMsTUFBYztJQUNyQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDcEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFDLDJCQUEyQjtJQUM5QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBTEQsZ0NBS0M7Ozs7Ozs7Ozs7Ozs7O0FDTkQsZ0hBQXFEO0FBRXJEOzs7O0dBSUc7QUFDSCxTQUFnQixXQUFXLENBQUMsS0FBYSxFQUFFLEdBQUcsSUFBVztJQUVyRCxJQUFJLEtBQUssS0FBSyxNQUFNLENBQUMsU0FBUyxFQUFFO1FBQzVCLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM3QjtJQUVELE9BQU8sS0FBSyxZQUFZLFdBQVcsQ0FBQyxDQUFDO1FBQ2pDLFFBQVEsQ0FBQyxhQUFhLENBQUMsdUNBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUssS0FBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUUvQyxDQUFDO0FBVkQsa0NBVUM7Ozs7Ozs7Ozs7Ozs7O0FDakJELFNBQWdCLFNBQVMsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEtBQWE7SUFFaEUsSUFBSSxDQUFDLEdBQUcsTUFBTTtJQUVkLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzFCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxHQUFHLEtBQUs7QUFDM0IsQ0FBQztBQVRELDhCQVNDOzs7Ozs7Ozs7Ozs7OztBQ1RELFNBQWdCLGNBQWMsQ0FBbUIsR0FBRyxJQUFTLElBQVMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQXBGLHdDQUFvRjs7Ozs7Ozs7Ozs7Ozs7QUNDcEY7O0dBRUc7QUFDSSxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUk7S0FDNUQsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7S0FDbkIsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7S0FDdEIsV0FBVyxFQUFFO0FBSEwsd0JBQWdCLG9CQUdYOzs7Ozs7Ozs7Ozs7OztBQ05sQjs7O0dBR0c7QUFDSSxNQUFNLElBQUksR0FBRyxDQUFDLENBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUEzQyxZQUFJLFFBQXVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSnhELHdHQUFvRDtBQUVwRCxNQUFNLEtBQUssR0FBRztJQUNWLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLE1BQU07SUFDTixNQUFNO0NBQ1Q7QUFFRDs7RUFFRTtBQUNGLFNBQThCLFVBQVU7O1FBRXBDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLE1BQU0sT0FBTyxHQUFHLElBQUksRUFBRTtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkcsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQUk7WUFDbkIsS0FBSyxFQUFFO1NBQ1Y7SUFFTCxDQUFDO0NBQUE7QUFURCxnQ0FTQztBQUVELFNBQVMsS0FBSztJQUNWLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUMvRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0lBQy9FLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO0lBQzNFLE9BQU8sT0FBTyxJQUFJLE9BQU87QUFDN0IsQ0FBQztBQUVELFNBQVMsS0FBSztJQUNWLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsa0VBQWtFLENBQUMsQ0FBQztJQUNsRixNQUFNLE9BQU8sR0FBSSxLQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUM7SUFDakUsT0FBTyxPQUFPO0FBQ2xCLENBQUM7QUFFRCxTQUFTLEtBQUs7SUFDVixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1GQUFtRixDQUFDLENBQUM7SUFDbkcsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUs7SUFDM0UsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTztJQUMvRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0lBQy9FLE9BQU8sT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPO0FBQ3hDLENBQUM7QUFFRCxTQUFTLEtBQUs7SUFDVixNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDdEMsT0FBTyxNQUFNLEtBQUssU0FBUztBQUMvQixDQUFDO0FBRUQsU0FBUyxLQUFLO0lBQ1YsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO0lBQ2hFLE9BQU8sT0FBTztBQUNsQixDQUFDO0FBRUQsU0FBUyxLQUFLO0lBQ1YsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0lBQ2xFLE9BQU8sT0FBTztBQUNsQixDQUFDO0FBR0QsU0FBUyxLQUFLO0lBQ1YsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtRUFBbUUsQ0FBQztJQUNsRixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUNoRSxPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTztBQUN4QyxDQUFDO0FBRUQsU0FBUyxLQUFLO0lBQ1YsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQztJQUNuRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxPQUFPO0lBQ2pFLE9BQU8sT0FBTztBQUNsQixDQUFDO0FBRUQsU0FBUyxLQUFLO0lBQ1YsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQztJQUMvQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO0lBQ2pELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7SUFDbkQsT0FBTyxPQUFPLElBQUksT0FBTztBQUM3QixDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQywwRkFBMEYsQ0FBQztJQUN6RyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE9BQU87SUFDcEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxPQUFPO0lBQ3BFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksTUFBTTtJQUNuRSxPQUFPLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTztBQUN4QyxDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQztJQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7SUFFbEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVTtJQUN2RyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVO0lBQ3ZHLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUNuRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU87SUFDckUsT0FBTyxPQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPO0FBRW5ELENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0lBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFDakMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUM7SUFDOUMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTztBQUM3RCxDQUFDO0FBRUQsU0FBUyxNQUFNO0lBRVgsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyw0REFBNEQsQ0FBQztJQUUzRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUN6RCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztXQUNoRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTztJQUV6RCxLQUFLLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDO0lBRTNDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO1dBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO1dBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0lBRXpELE9BQU8sT0FBTyxJQUFJLE9BQU87QUFFN0IsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUVYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsa0RBQWtELENBQUM7SUFDakUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQztJQUUxQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTTtXQUMxRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTTtXQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUV2RCxPQUFPLE9BQU87QUFDbEIsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQzVCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtJQUM1QyxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQzdDLE9BQU8sT0FBTyxJQUFJLE9BQU87QUFDN0IsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBRS9DLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDM0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDekIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO0FBRXZDLENBQUM7QUFFRCxTQUFTLE1BQU07SUFFWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUvQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdEQUFnRCxDQUFDO0lBQy9ELEtBQUssQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUM7SUFDMUMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU87SUFDdkUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEtBQUs7SUFDbEUsT0FBTyxPQUFPLElBQUksT0FBTztBQUU3QixDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyx5REFBeUQsQ0FBQztJQUN4RSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0FBQ3hFLENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLG9EQUFvRCxDQUFDO0lBQ25FLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU87QUFDeEUsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsMERBQTBELENBQUM7SUFDekUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQ3BELENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLHdFQUF3RSxDQUFDO0lBQ3ZGLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUNwRCxDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQztJQUM3RCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7QUFDcEQsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUM7SUFDeEMsSUFBSSxNQUFNLEdBQUcsRUFBRTtJQUNmLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxHQUFHO0lBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxHQUFHO0lBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7SUFDcEMsT0FBTyxNQUFNLEtBQUssSUFBSTtBQUMxQixDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQztJQUM1RCxLQUFLLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDO0lBQ2pELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPO0lBQ2xFLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO0lBQ2hFLE9BQU8sT0FBTyxJQUFJLE9BQU87QUFDN0IsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUM7SUFDMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7QUFDNUMsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsd0RBQXdELENBQUM7SUFDdkUsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTTtJQUNqRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO0lBQ25ELE9BQU8sT0FBTyxJQUFJLE9BQU87QUFDN0IsQ0FBQztBQUVELFNBQVMsTUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7SUFDbEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQztJQUN0RCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztJQUNoRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUM1RSxPQUFPLE9BQU8sSUFBSSxPQUFPO0FBQzdCLENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0lBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ3pCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0lBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztBQUMzRCxDQUFDO0FBRUQsU0FBUyxNQUFNO0lBQ1gsTUFBTSxLQUFLLEdBQUcsb0JBQVEsRUFBQyxFQUFDLElBQUksRUFBQyxRQUFRLENBQUMsSUFBSSxFQUFDLENBQUM7SUFDNUMsS0FBSyxDQUFDLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQztJQUM5RCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO0lBQ3BELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQ3hELENBQUM7QUFFRCxTQUFTLE1BQU07SUFDWCxNQUFNLEtBQUssR0FBRyxvQkFBUSxFQUFDLEVBQUMsSUFBSSxFQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsT0FBTyxDQUFDLGlFQUFpRSxDQUFDO0lBQ2hGLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0lBQzFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssUUFBUTtBQUNuRSxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsU0FBaUI7SUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQztJQUN6QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxLQUFLO0lBQ1YsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDeEMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3JCLENBQUM7Ozs7Ozs7VUNoVkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9DcmVhdGVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvQ3JlYXRlTGV4ZW1lQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0VkaXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvSWZBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvTXVsdGlBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvUmVsYXRpb25BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvU2V0QWxpYXNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvV2hlbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9nZXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3R1YXRvci9CYXNlQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9lbnZpcm8vRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC93cmFwcGVyL0Jhc2VXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC93cmFwcGVyL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvdHlwZU9mLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9wcmVsdWRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vcG9pbnRPdXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9CYXNpY0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvY29udGV4dC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZU9iamVjdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2dldExleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvam9pbk11bHRpV29yZExleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvbnVtYmVyTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9yZXNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3N0ZHNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3Vuc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRLb29sLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VBbGxWYXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VJbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9tb2NrTWFwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL25lZ2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvcmVzb2x2ZUFuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pc1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvc29ydElkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9Db25zdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvdG9WYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9hbGxLZXlzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvZGVlcENvcHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9nZXROZXN0ZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvbmV3SW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zZXROZXN0ZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3RhZ05hbWVGcm9tUHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4vdGVzdHMvYXV0b3Rlc3RlclwiXG5cblxuKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICBtYWluKClcbn0pKCkiLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgbmV3SW5zdGFuY2UgfSBmcm9tIFwiLi4vLi4vdXRpbHMvbmV3SW5zdGFuY2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgbG9jYWxJZCA9IHRoaXMuY2xhdXNlPy5hcmdzPy5bMF0gYXMgSWRcbiAgICAgICAgY29uc3QgaWQgPSBjb250ZXh0LnF1ZXJ5KHRoaXMudG9wTGV2ZWwudGhlbWUpPy5bMF0/Lltsb2NhbElkXSA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQuZ2V0KGlkKT8uaXMocHJlZGljYXRlKSkgeyAgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90byA9IHByZWRpY2F0ZS5nZXRQcm90bygpXG5cbiAgICAgICAgaWYgKCFwcm90bykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvID0gbmV3SW5zdGFuY2UocHJvdG8sIHByZWRpY2F0ZS5yb290KVxuICAgICAgICBpbml0KG8sIGNvbnRleHQsIGlkKVxuICAgICAgICBjb250ZXh0LnNldChpZCwgbykuc2V0KHByZWRpY2F0ZSlcblxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpbml0KG86IG9iamVjdCwgY29udGV4dDogQ29udGV4dCwgaWQ6IElkKSB7XG5cbiAgICBpZiAobyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG8uaWQgPSBpZCArICcnXG4gICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgY29udGV4dC5yb290Py5hcHBlbmRDaGlsZChvKVxuICAgIH1cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVMZXhlbWVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKCFjb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCBhcyBhbnkpICYmICF0aGlzLnRvcExldmVsLnJoZW1lLmZsYXRMaXN0KCkuc29tZSh4ID0+IHgucHJlZGljYXRlPy5pc0NvbmNlcHQpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKCh0aGlzLmNsYXVzZS5hcmdzIGFzIGFueSlbMF0pWzBdLnJvb3QgLy9UT0RPOiBjb3VsZCBiZSB1bmRlZmluZWQgICAgICAgIFxuICAgICAgICBjb25zdCB0eXBlID0gKGNvbnRleHQubGV4ZW1lVHlwZXMuaW5jbHVkZXModGhpcy5jbGF1c2UucHJlZGljYXRlPy5yb290IGFzIGFueSkgPyB0aGlzLmNsYXVzZS5wcmVkaWNhdGU/LnJvb3QgOiAnYWRqZWN0aXZlJykgYXMgTGV4ZW1lVHlwZVxuICAgICAgICBjb25zdCBjb25jZXB0cyA9IHR5cGUgPT09ICdub3VuJyA/IFtdIDogdHlwZSA9PT0gJ2FkamVjdGl2ZScgPyBbdGhpcy5jbGF1c2UucHJlZGljYXRlPy5yb290XS5mbGF0TWFwKHggPT4geCA/PyBbXSkuZmlsdGVyKHggPT4geCAhPT0gbmFtZSkvKiBIRUVFRUVFRUVSRSAqLyA6IHVuZGVmaW5lZFxuICAgICAgICBjb25zdCByZXMgPSB0aGlzLnRvcExldmVsLnF1ZXJ5KCQoJ3Byb3RvJywgJ1gnKSkuYXQoMCk/LlsnWCddXG4gICAgICAgIGNvbnN0IHByb3RvID0gcmVzID8gdGhpcy50b3BMZXZlbC5kZXNjcmliZShyZXMpLm1hcCh4ID0+IHgucm9vdCkuZmlsdGVyKHggPT4geCAhPT0gJ3Byb3RvJylbMF0gOiB1bmRlZmluZWRcblxuXG5cbiAgICAgICAgY29uc3QgbGV4ZW1lID0gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBuYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHByb3RvOiBwcm90byxcbiAgICAgICAgICAgIGNvbmNlcHRzOiBjb25jZXB0c1xuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKGxleGVtZSlcblxuICAgIH1cblxufVxuXG5cbmNvbnN0ICQgPSAocDogc3RyaW5nLCAuLi5hcmdzOiBJZFtdKSA9PiBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogcCwgdHlwZTogJ25vdW4nIH0pLCAuLi5hcmdzKSIsImltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0S29vbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgbG9jYWxJZCA9IHRoaXMuY2xhdXNlLmFyZ3M/LlswXVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcbiAgICAgICAgY29uc3Qgc2VhcmNoU3BhY2UgPSB0aGlzLnRvcExldmVsLnRoZW1lXG5cbiAgICAgICAgaWYgKCFsb2NhbElkIHx8ICFwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IGdldEtvb2woY29udGV4dCwgc2VhcmNoU3BhY2UsIGxvY2FsSWQpWzBdID8/IGNvbnRleHQuc2V0KGdldEluY3JlbWVudGFsSWQoKSlcbiAgICAgICAgd3JhcHBlci5zZXQocHJlZGljYXRlLCB7IG5lZ2F0ZWQ6IHRoaXMuY2xhdXNlLm5lZ2F0ZWQgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJZkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBpZiAoY29udGV4dC5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB0aGlzLmNsYXVzZS5yaGVtZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgZ2V0QWN0aW9uKGMsIHRoaXMuY2xhdXNlLnJoZW1lKS5ydW4oY29udGV4dClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5jbGF1c2UudGhlbWVcblxuICAgICAgICBjb250ZXh0LnF1ZXJ5KGNvbmRpdGlvbikuZm9yRWFjaChtID0+IHtcblxuICAgICAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jbGF1c2UuY29weSh7IG1hcDogbSwgZXhhY3RJZHM6IHRydWUgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbnNlcSA9IHRvcC5yaGVtZVxuICAgICAgICAgICAgY29uc3QgY2xhdXNlcyA9IGNvbnNlcS5mbGF0TGlzdCgpXG4gICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY2xhdXNlcy5tYXAoYyA9PiBnZXRBY3Rpb24oYywgdG9wKSlcbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaChhID0+IGEucnVuKGNvbnRleHQpKVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2xcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGlvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBhcmdzID0gKHRoaXMuY2xhdXNlLmFyZ3MgPz8gW10pXG4gICAgICAgICAgICAubWFwKHggPT4gZ2V0S29vbChjb250ZXh0LCB0aGlzLnRvcExldmVsLnRoZW1lLCB4KVswXSlcblxuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gYXJnc1swXVxuICAgICAgICBjb25zdCBvYmplY3QgPSBhcmdzWzFdXG5cbiAgICAgICAgY29uc3QgcmVzID0gc3ViamVjdD8uc2V0KHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgeyBhcmdzOiBvYmplY3QgPyBbb2JqZWN0XSA6IFtdIH0pXG5cbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgY29udGV4dC5zZXQoZ2V0SW5jcmVtZW50YWxJZCgpLCByZXMpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWxcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXRBbGlhc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY2xhdXNlLnRoZW1lXG4gICAgICAgIGNvbnN0IGNvbnNlcXVlbmNlID0gdGhpcy5jbGF1c2UucmhlbWVcblxuICAgICAgICBjb25zdCB0b3AgPSBnZXRUb3BMZXZlbChjb25kaXRpb24pWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSBnZXRPd25lcnNoaXBDaGFpbihjb25kaXRpb24sIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBnZXRPd25lcnNoaXBDaGFpbihjb25zZXF1ZW5jZSwgdG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBjb25jZXB0TmFtZSA9IGFsaWFzLm1hcCh4ID0+IGNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiBjb25zZXF1ZW5jZS5kZXNjcmliZSh4KVswXSkgLy8gc2FtZSAuLi5cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcblxuICAgICAgICB3cmFwKGdldEluY3JlbWVudGFsSWQoKSwgcHJvdG9OYW1lLmdldFByb3RvKCkpLnNldChjb25jZXB0TmFtZVswXSwgeyBhbGlhc1BhdGg6IHByb3BzTmFtZXMgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2hlbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgICAgICAgICAgaWYgKGNvbnRleHQucXVlcnkodGhpcy5jbGF1c2UudGhlbWUpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlLnJoZW1lLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0QWN0aW9uKGMsIHRoaXMuY2xhdXNlLnJoZW1lKS5ydW4oY29udGV4dClcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCAxMDApXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ3JlYXRlQWN0aW9uIGZyb20gXCIuL0NyZWF0ZUFjdGlvblwiXG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCJcbmltcG9ydCBSZWxhdGlvbkFjdGlvbiBmcm9tIFwiLi9SZWxhdGlvbkFjdGlvblwiXG5pbXBvcnQgU2V0QWxpYXNBY3Rpb24gZnJvbSBcIi4vU2V0QWxpYXNBY3Rpb25cIlxuaW1wb3J0IE11bHRpQWN0aW9uIGZyb20gXCIuL011bHRpQWN0aW9uXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCJcbmltcG9ydCBJZkFjdGlvbiBmcm9tIFwiLi9JZkFjdGlvblwiXG5pbXBvcnQgV2hlbkFjdGlvbiBmcm9tIFwiLi9XaGVuQWN0aW9uXCJcbmltcG9ydCBDcmVhdGVMZXhlbWVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlTGV4ZW1lQWN0aW9uXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9JbXBseVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbihjbGF1c2U6IENsYXVzZSwgdG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbiB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh0b3BMZXZlbC50b1N0cmluZygpKVxuXG4gICAgaWYgKHRvcExldmVsLmZsYXRMaXN0KCkuc29tZSh4ID0+IHgucHJlZGljYXRlPy50eXBlID09PSAnZ3JhbW1hcicpXG4gICAgICAgIHx8IHRvcExldmVsLnJoZW1lLmZsYXRMaXN0KCkuc29tZSh4ID0+IHgucHJlZGljYXRlPy5pc0NvbmNlcHQpKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVMZXhlbWVBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBwcmVwb3NpdGlvbnMsIGFuZCBiZSBiZXdhcmUgb2YgJ29mJyBcbiAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZT8udHlwZSA9PT0gJ2l2ZXJiJyB8fCBjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnbXZlcmInKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpb25BY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZT8ucHJvdG8pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnRoZW1lLmVudGl0aWVzLnNvbWUoZSA9PiBjbGF1c2UudGhlbWUub3duZXJzT2YoZSkubGVuZ3RoKSAmJiBjbGF1c2UucmhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS5yaGVtZS5vd25lcnNPZihlKS5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0QWxpYXNBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2Uuc3ViamNvbmo/LnJvb3QgPT09ICdpZicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJZkFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ3doZW4nKSB7XG4gICAgICAgIHJldHVybiBuZXcgV2hlbkFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5KSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRWRpdEFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IGFueVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbnMvZ2V0QWN0aW9uXCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBY3R1YXRvciBpbXBsZW1lbnRzIEFjdHVhdG9yIHtcblxuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiBhbnlbXSB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZS5mbGF0TGlzdCgpLm1hcCh4ID0+IGdldEFjdGlvbih4LCBjbGF1c2UpKVxuICAgICAgICByZXR1cm4gYWN0aW9ucy5mbGF0TWFwKGEgPT4gYS5ydW4oY29udGV4dCk/P1tdKVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBXcmFwcGVyLCB7IHdyYXAgfSBmcm9tIFwiLi4vd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUVudmlybyBpbXBsZW1lbnRzIEVudmlybyB7XG5cbiAgICBwcm90ZWN0ZWQgbGFzdFJlZmVyZW5jZWQ/OiBJZFxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2V0ID0gKGlkOiBJZCwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlciA9PiB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBwbGFjZWhvbGRlcj8uY29weSh7IG9iamVjdDogb2JqZWN0IH0pID8/IHdyYXAoaWQsIG9iamVjdClcbiAgICB9XG5cbiAgICBxdWVyeSA9IChxdWVyeTogQ2xhdXNlKTogTWFwW10gPT4ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy52YWx1ZXNcbiAgICAgICAgICAgIC5tYXAodyA9PiB3LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICByZXR1cm4gdW5pdmVyc2UucXVlcnkocXVlcnksIHsgaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9NYXBcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi93cmFwcGVyL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICByZWFkb25seSB2YWx1ZXM6IFdyYXBwZXJbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBXcmFwcGVyLCB7IENvcHlPcHRzLCBTZXRPcHMgfSBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgYWxsS2V5cyB9IGZyb20gXCIuLi8uLi91dGlscy9hbGxLZXlzXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyB0eXBlT2YgfSBmcm9tIFwiLi90eXBlT2ZcIjtcbmltcG9ydCB7IGRlZXBDb3B5IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2RlZXBDb3B5XCI7XG5pbXBvcnQgeyBzZXROZXN0ZWQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2V0TmVzdGVkXCI7XG5pbXBvcnQgeyBnZXROZXN0ZWQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZ2V0TmVzdGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBhbGlhc2VzOiB7IFthbGlhczogc3RyaW5nXTogc3RyaW5nW10gfSA9IHRoaXMub2JqZWN0Py5hbGlhc2VzID8/IHt9XG4gICAgcmVhZG9ubHkgcHJlZGljYXRlczogTGV4ZW1lW10gPSBbXVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG9iamVjdDogYW55LFxuICAgICAgICByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHJlYWRvbmx5IGlzUGxhY2Vob2xkZXI6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IHBhcmVudD86IFdyYXBwZXIsXG4gICAgICAgIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmdcbiAgICApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QuYWxpYXNlcyA9IHRoaXMuYWxpYXNlc1xuICAgICAgICB9IGNhdGNoIHsgfVxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3ByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMCkgPz8gJyddXG5cbiAgICAgICAgcmV0dXJuIHBhdGggP1xuICAgICAgICAgICAgZ2V0TmVzdGVkKHRoaXMub2JqZWN0LCBwYXRoKSA9PT0gcHJlZGljYXRlLnJvb3QgOlxuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGVzLm1hcCh4ID0+IHgucm9vdCkuaW5jbHVkZXMocHJlZGljYXRlLnJvb3QpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0QWxpYXMoYWxpYXM6IExleGVtZSwgcGF0aDogTGV4ZW1lW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbGlhc2VzW2FsaWFzLnJvb3RdID0gcGF0aC5tYXAoeCA9PiB4LnJvb3QpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHsvL1RPRE86IGFsaWFzXG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdFt2ZXJiLnJvb3RdKC4uLmFyZ3MubWFwKHggPT4geC51bndyYXAoKSkpXG4gICAgfVxuXG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpIHtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5hbGlhc2VzKVxuICAgICAgICAgICAgLm1hcChrID0+IGdldE5lc3RlZCh0aGlzLm9iamVjdCwgdGhpcy5hbGlhc2VzW2tdKSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiBtYWtlTGV4ZW1lKHsgcm9vdDogeCwgdHlwZTogJ2FkamVjdGl2ZScgfSkpXG4gICAgICAgICAgICAuY29uY2F0KHRoaXMucHJlZGljYXRlcylcbiAgICAgICAgICAgIC5tYXAoeCA9PiBjbGF1c2VPZih4LCB0aGlzLmlkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICAgICAgICAgIC5hbmQodGhpcy5leHRyYUluZm8ocXVlcnkgPz8gZW1wdHlDbGF1c2UpKVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGV4dHJhSW5mbyhxOiBDbGF1c2UpIHtcblxuICAgICAgICBjb25zdCBvYyA9IGdldE93bmVyc2hpcENoYWluKHEsIGdldFRvcExldmVsKHEpWzBdKVxuICAgICAgICBjb25zdCBwYXRoID0gb2MuZmxhdE1hcCh4ID0+IHEuZGVzY3JpYmUoeCkpLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ25vdW4nKS5tYXAoeCA9PiB4LnJvb3QpLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IG5lc3RlZCA9IGdldE5lc3RlZCh0aGlzLm9iamVjdCwgdGhpcy5hbGlhc2VzPy5bcGF0aD8uWzBdXSA/PyBwYXRoKVxuXG4gICAgICAgIC8vd2l0aG91dCBmaWx0ZXIsIHEuY29weSgpIGVuZHMgdXAgYXNzZXJ0aW5nIHdyb25nIGluZm9ybWF0aW9uIGFib3V0IHRoaXMgb2JqZWN0LFxuICAgICAgICAvL3lvdSBuZWVkIHRvIGFzc2VydCBvbmx5IG93bmVyc2hpcCBvZiBnaXZlbiBwcm9wcyBpZiBwcmVzZW50LFxuICAgICAgICAvL25vdCBldmVyeXRoaW5nIGVsc2UgdGhhdCBtYXkgY29tZSB3aXRoIHF1ZXJ5IHEuIFxuXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkcSA9IHEuZmxhdExpc3QoKS5maWx0ZXIoeCA9PiAhKHg/LmFyZ3M/LlswXSA9PT0gb2NbMF0gJiYgeC5hcmdzPy5sZW5ndGggPT09IDEpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICAgICAgcmV0dXJuIG5lc3RlZCAhPT0gdW5kZWZpbmVkID8gZmlsdGVyZWRxLmNvcHkoeyBtYXA6IHsgW29jWzBdXTogdGhpcy5pZCB9IH0pIDogZW1wdHlDbGF1c2VcblxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueSB7XG5cbiAgICAgICAgaWYgKG9wdHM/LmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwocHJlZGljYXRlLCBvcHRzLmFyZ3MpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0cz8uYWxpYXNQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRBbGlhcyhwcmVkaWNhdGUsIG9wdHMuYWxpYXNQYXRoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC51bndyYXAoKVt0aGlzLm5hbWUhXSA9IHByZWRpY2F0ZS5yb290XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE11bHRpUHJvcChwcmVkaWNhdGUsIG9wdHMpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TXVsdGlQcm9wKHZhbHVlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICBjb25zdCBwcm9wcyA9IG9wdHM/LnByb3BzID8/IFtdXG4gICAgICAgIGNvbnN0IGxhc3QgPSBwcm9wcy5hdCgtMSkhXG4gICAgICAgIGNvbnN0IHBhdGggPSBwcm9wcy5sZW5ndGggPiAwID9cbiAgICAgICAgICAgIFsuLi5wcm9wcy5zbGljZSgwLCAtMSksIC4uLnRoaXMuYWxpYXNlc1tsYXN0XSA/PyBbbGFzdF1dIDpcbiAgICAgICAgICAgIHRoaXMuYWxpYXNlc1t2YWx1ZT8uY29uY2VwdHM/LlswXSFdXG4gICAgICAgICAgICA/PyAodGhpcy5vYmplY3RbdmFsdWUucm9vdF0gIT09IHVuZGVmaW5lZCA/IFt2YWx1ZS5yb290XSA6IHVuZGVmaW5lZClcblxuICAgICAgICBpZiAocGF0aCkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdHlwZW9mIHRoaXMub2JqZWN0W3ZhbHVlLnJvb3RdID09PSAnYm9vbGVhbicgPyAhb3B0cz8ubmVnYXRlZCA6ICFvcHRzPy5uZWdhdGVkID8gdmFsdWUucm9vdCA6IG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyh2YWx1ZSkgPyAnJyA6IGdldE5lc3RlZCh0aGlzLm9iamVjdCwgcGF0aClcbiAgICAgICAgICAgIHNldE5lc3RlZCh0aGlzLm9iamVjdCwgcGF0aCwgdmFsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGVzLnB1c2godmFsdWUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlciB7XG5cbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBCYXNlV3JhcHBlcihcbiAgICAgICAgICAgIG9wdHM/Lm9iamVjdCA/PyBkZWVwQ29weSh0aGlzLm9iamVjdCksXG4gICAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8gZmFsc2UgOiB0aGlzLmlzUGxhY2Vob2xkZXIsXG4gICAgICAgIClcblxuICAgICAgICB0aGlzLnByZWRpY2F0ZXMuZm9yRWFjaCh4ID0+IGNvcHkuc2V0KHgpKVxuICAgICAgICByZXR1cm4gY29weVxuICAgIH1cblxuICAgIGdldChjbGF1c2U6IENsYXVzZSk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHggPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChlID0+IGNsYXVzZS5kZXNjcmliZShlKSlbMF1cblxuICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlcz8uW3gucm9vdF0gPz8gW3gucm9vdF1cbiAgICAgICAgICAgIGxldCBwYXJlbnQ6IFdyYXBwZXIgPSB0aGlzXG5cbiAgICAgICAgICAgIHBhdGguZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvID0gcGFyZW50LnVud3JhcCgpW3BdXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gbmV3IEJhc2VXcmFwcGVyKG8sIGdldEluY3JlbWVudGFsSWQoKSwgZmFsc2UsIHBhcmVudCwgcClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBkeW5hbWljID0gKCkgPT4gYWxsS2V5cyh0aGlzLm9iamVjdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgIHR5cGU6IHR5cGVPZih0aGlzLm9iamVjdFt4XSksXG4gICAgICAgIHJvb3Q6IHhcbiAgICB9KSlcblxuICAgIHVud3JhcCA9ICgpID0+IHRoaXMub2JqZWN0XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgQmFzZVdyYXBwZXIgZnJvbSBcIi4vQmFzZVdyYXBwZXJcIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IGlkOiBJZFxuICAgIHJlYWRvbmx5IHBhcmVudD86IFdyYXBwZXJcbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpOiBhbnlcbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IFdyYXBwZXJcbiAgICBnZXQoY2xhdXNlOiBDbGF1c2UpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgLyoqIGRlc2NyaWJlIHRoZSBvYmplY3QgKi8gdG9DbGF1c2UoY2xhdXNlPzogQ2xhdXNlKTogQ2xhdXNlXG4gICAgLyoqIGluZmVyIGdyYW1tYXRpY2FsIHR5cGVzIG9mIHByb3BzICovIGR5bmFtaWMoKTogTGV4ZW1lW11cbiAgICB1bndyYXAoKTogYW55IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0T3BzIHtcbiAgICBwcm9wcz86IHN0cmluZ1tdXG4gICAgbmVnYXRlZD86IGJvb2xlYW5cbiAgICBhcmdzPzogV3JhcHBlcltdXG4gICAgYWxpYXNQYXRoPzogTGV4ZW1lW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgb2JqZWN0Pzogb2JqZWN0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGlkOiBJZCwgbz86IE9iamVjdCk6IFdyYXBwZXIge1xuICAgIHJldHVybiBuZXcgQmFzZVdyYXBwZXIobyA/PyB7fSwgaWQsIG8gPT09IHVuZGVmaW5lZClcbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZihvOiBvYmplY3QpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkIHtcblxuICAgIGlmICh0eXBlb2YgbyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gby5sZW5ndGggPiAwID8gJ212ZXJiJyA6ICdpdmVyYidcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuICdhZGplY3RpdmUnXG4gICAgfSBlbHNlIGlmIChvKSB7XG4gICAgICAgIHJldHVybiAnbm91bidcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqZWN0aXZlJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdmaWxsZXInLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnZ3JhbW1hcicsXG4gICdub25zdWJjb25qJywgLy8gYW5kIC4uLlxuICAnZGlzanVuYycsIC8vIG9yLCBidXQsIGhvd2V2ZXIgLi4uXG4gICdwcm9ub3VuJyxcbiAgLy8gJ2FueSdcbilcbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuY29uc3QgYmU6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnYmUnLFxuICAgIHR5cGU6ICdjb3B1bGEnLFxufVxuXG5jb25zdCBfZG86IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBQYXJ0aWFsPExleGVtZT5bXSA9IFtcblxuICAgIGJlLFxuICAgIF9kbyxcblxuICAgIHsgX3Jvb3Q6IGJlLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEgfSxcbiAgICB7IF9yb290OiBiZSwgdG9rZW46ICdhcmUnLCBjYXJkaW5hbGl0eTogJyonIH0sIC8vVE9ETyEgMitcbiAgICB7IF9yb290OiBfZG8sIHRva2VuOiAnZG9lcycsIGNhcmRpbmFsaXR5OiAxIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ2ZpbGxlcicgLy8gZmlsbGVyIHdvcmQsIHdoYXQgYWJvdXQgcGFydGlhbCBwYXJzaW5nP1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzdWJqZWN0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlZGljYXRlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb2JqZWN0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25kaXRpb24nLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25zZXF1ZW5jZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfVxuXVxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZ1tdID0gW1xuXG4gIC8vIGdyYW1tYXJcbiAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICdjb21wbGVtZW50IGlzIHByZXBvc2l0aW9uIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlJyxcblxuICBgY29wdWxhLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZWAsXG5cbiAgYG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIHplcm8gb3IgbW9yZSBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBncmFtbWFyXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgc3ViY2xhdXNlIFxuICAgICAgICB0aGVuIHplcm8gb3IgbW9yZSBjb21wbGVtZW50cyBgLFxuXG4gICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZScsXG4gICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlJyxcblxuICBgYW5kLXNlbnRlbmNlIGlzIGxlZnQgY29wdWxhLXNlbnRlbmNlIG9yIG5vdW4tcGhyYXNlIFxuICAgICAgICB0aGVuIG5vbnN1YmNvbmpcbiAgICAgICAgdGhlbiBvbmUgb3IgbW9yZSByaWdodCBhbmQtc2VudGVuY2Ugb3IgY29wdWxhLXNlbnRlbmNlIG9yIG5vdW4tcGhyYXNlYCxcblxuICBgbXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gbXZlcmJcblx0XHR0aGVuIG9iamVjdCBub3VuLXBocmFzZWAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICBgaXZlcmItc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gaXZlcmJgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgYHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgaXZlcmItc2VudGVuY2Ugb3IgbXZlcmItc2VudGVuY2VgLFxuXG4gIGBjczIgaXMgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlXG4gICAgICB0aGVuIHN1YmNvbmpcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgYGNzMSBpcyBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICB0aGVuIGZpbGxlciBcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZWAsXG5cbiAgIGBhIGFuZCBhbiBhcmUgaW5kZWZhcnRzYCxcbiAgIGB0aGUgaXMgYSBkZWZhcnRgLFxuICAgYGlmIGFuZCB3aGVuIGFuZCB3aGlsZSBhcmUgc3ViY29uanNgLFxuICAgYGFueSBhbmQgZXZlcnkgYW5kIGFsbCBhcmUgdW5pcXVhbnRzYCxcbiAgIGBvZiBhbmQgb24gYW5kIHRvIGFuZCBmcm9tIGFyZSBwcmVwb3NpdGlvbnNgLFxuICAgYHRoYXQgaXMgYSByZWxwcm9uYCxcbiAgIGBub3QgaXMgYSBuZWdhdGlvbmAsXG4gICBgaXQgaXMgYSBwcm9ub3VuYCxcblxuXG4gIC8vIGRvbWFpblxuICBgYnV0dG9uIGlzIGEgbm91biBhbmQgcHJvdG8gb2YgaXQgaXMgSFRNTEJ1dHRvbkVsZW1lbnRgLFxuICBgZGl2IGlzIGEgbm91biBhbmQgcHJvdG8gb2YgaXQgaXMgSFRNTERpdkVsZW1lbnRgLFxuICBgZWxlbWVudCBpcyBhIG5vdW4gYW5kIHByb3RvIG9mIGl0IGlzIEhUTUxFbGVtZW50YCxcbiAgJ2NvbG9yIGlzIGEgbm91bicsXG4gICdyZWQgYW5kIGJsdWUgYW5kIGJsYWNrIGFuZCBncmVlbiBhcmUgY29sb3JzJyxcbiAgJ2NvbG9yIG9mIGFueSBlbGVtZW50IGlzIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgaXQnLFxuICAndGV4dCBvZiBhbnkgYnV0dG9uIGlzIHRleHRDb250ZW50IG9mIGl0Jyxcbl0iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gY29uc3RpdHVlbnRUeXBlcy5jb25jYXQoKVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWydmaWxsZXInXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZTogWydncmFtbWFyJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnZGlzanVuYyddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuXG59IiwiaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuaW1wb3J0IHsgZ2V0S29vbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbFwiO1xuaW1wb3J0IHsgdG9DbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgeyBwb2ludE91dCB9IGZyb20gXCIuL3BvaW50T3V0XCI7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIC8vVE9ETzogbW92ZSBzb21ld2hlcmUgZWxzZVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTnVtYmVyLnByb3RvdHlwZSwgJ2FkZCcsIHsgd3JpdGFibGU6IHRydWUsIHZhbHVlOiBmdW5jdGlvbiAoYTogYW55KSB7IHJldHVybiB0aGlzICsgYSB9IH0pXG5cbiAgICAgICAgdGhpcy5jb250ZXh0LnByZWx1ZGUuZm9yRWFjaChjID0+IHRoaXMuZXhlY3V0ZShjKSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdIHtcblxuICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdCkuc2ltcGxlXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSlcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hY3R1YXRvci50YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5jb250ZXh0KVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlcnMgPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChpZCA9PiBnZXRLb29sKHRoaXMuY29udGV4dCwgY2xhdXNlLCBpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQudmFsdWVzLmZvckVhY2godyA9PiBwb2ludE91dCh3LCB7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgd3JhcHBlcnMuZm9yRWFjaCh3ID0+IHcgPyBwb2ludE91dCh3KSA6IDApXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gd3JhcHBlcnMuZmxhdE1hcChvID0+IG8gPyBvLnVud3JhcCgpIDogW10pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi8uLi9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludE91dCh3cmFwcGVyOiBXcmFwcGVyLCBvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pIHtcblxuICAgIGNvbnN0IG9iamVjdCA9IHdyYXBwZXIudW53cmFwKClcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBvYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9lbnZpcm8vRW52aXJvXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0NvbnRleHQgaW1wbGVtZW50cyBDb250ZXh0IHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IHRoaXMuY29uZmlnLnN5bnRheGVzXG4gICAgcHJvdGVjdGVkIF9zeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW10gPSB0aGlzLmdldFN5bnRheExpc3QoKVxuICAgIHByb3RlY3RlZCBfbGV4ZW1lcyA9IHRoaXMuY29uZmlnLmxleGVtZXNcbiAgICByZWFkb25seSBwcmVsdWRlID0gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICByZWFkb25seSBnZXQgPSB0aGlzLmVudmlyby5nZXRcbiAgICByZWFkb25seSBzZXQgPSB0aGlzLmVudmlyby5zZXRcbiAgICByZWFkb25seSBxdWVyeSA9IHRoaXMuZW52aXJvLnF1ZXJ5XG4gICAgcmVhZG9ubHkgcm9vdCA9IHRoaXMuZW52aXJvLnJvb3RcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVudmlybzogRW52aXJvLCByZWFkb25seSBjb25maWc6IENvbmZpZykge1xuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHtcblxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICAgICAgICAgIH0pKVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm8udmFsdWVzXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lID0gKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWUgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgICAgICAgICAuYXQoMClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pKVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICAgICAgdGhpcy5fc3ludGF4TGlzdCA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBpZiAobGV4ZW1lLnJvb3QgJiYgIWxleGVtZS50b2tlbiAmJiB0aGlzLl9sZXhlbWVzLnNvbWUoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KSkge1xuICAgICAgICAgICAgdGhpcy5fbGV4ZW1lcyA9IHRoaXMuX2xleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaChsZXhlbWUpXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaCguLi5sZXhlbWUuZXh0cmFwb2xhdGUodGhpcykpXG4gICAgfVxuXG4gICAgZ2V0IGFzdFR5cGVzKCk6IEFzdFR5cGVbXSB7XG4gICAgICAgIGNvbnN0IHJlczogQXN0VHlwZVtdID0gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuLi8uLi9jb25maWcvbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBwcmVsdWRlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9wcmVsdWRlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3ludGF4ZXM6IFN5bnRheE1hcFxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgbGV4ZW1lczogbGV4ZW1lcy5tYXAoeCA9PiBtYWtlTGV4ZW1lKHgpKSxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHByZWx1ZGUsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IGdldEVudmlybywgeyBFbnZpcm8sIEdldEVudmlyb09wcyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCBCYXNpY0NvbnRleHQgZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IGV4dGVuZHMgRW52aXJvIHtcblxuICAgIGdldFN5bnRheChuYW1lOiBBc3RUeXBlKTogU3ludGF4XG4gICAgc2V0U3ludGF4KG1hY3JvOiBBc3ROb2RlKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZFxuXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0T3B0cyBleHRlbmRzIEdldEVudmlyb09wcyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NvbnRleHQob3B0czogR2V0Q29udGV4dE9wdHMpOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChnZXRFbnZpcm8ob3B0cyksIGdldENvbmZpZygpKVxufSIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBnZXRMZXhlbWVzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2dldExleGVtZXNcIjtcbmltcG9ydCB7IHJlc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcmVzcGFjZVwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvc3Rkc3BhY2VcIjtcbmltcG9ydCB7IGpvaW5NdWx0aVdvcmRMZXhlbWVzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2pvaW5NdWx0aVdvcmRMZXhlbWVzXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZVtdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkgeyAvLyBUT0RPOiBtYWtlIGNhc2UgaW5zZW5zaXRpdmVcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzdGRzcGFjZShzb3VyY2VDb2RlKSwgY29udGV4dC5sZXhlbWVzKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiByZXNwYWNlKHMpKVxuXG4gICAgICAgIHRoaXMudG9rZW5zID0gd29yZHMuZmxhdE1hcCh3ID0+IGdldExleGVtZXModywgY29udGV4dCwgd29yZHMpKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHkgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBMZXhlbWVPYmplY3QgZnJvbSBcIi4vTGV4ZW1lT2JqZWN0XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyAgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovICB0eXBlOiBMZXhlbWVUeXBlXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi8gdG9rZW4/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovICBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9yIHF1YW50YWRqICovIGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICBwcm90bz86IHN0cmluZ1xuICAgIGNvbmNlcHRzPzogc3RyaW5nW11cbiAgICBfcm9vdD86IFBhcnRpYWw8TGV4ZW1lPlxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ6IENvbnRleHQpOiBMZXhlbWVbXVxuICAgIGdldFByb3RvKCk6IG9iamVjdCB8IHVuZGVmaW5lZFxuICAgIHJlYWRvbmx5IGlzUGx1cmFsOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNDb25jZXB0OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNNdWx0aVdvcmQ6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMZXhlbWUoZGF0YTogUGFydGlhbDxMZXhlbWU+KTogTGV4ZW1lIHtcbiAgICByZXR1cm4gbmV3IExleGVtZU9iamVjdChkYXRhKVxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV4ZW1lT2JqZWN0IGltcGxlbWVudHMgTGV4ZW1lIC8qLCBXcmFwcGVyICovIHtcblxuICAgIF9yb290ID0gdGhpcy5uZXdEYXRhPy5fcm9vdFxuICAgIGNvbnRyYWN0aW9uRm9yID0gdGhpcy5uZXdEYXRhPy5jb250cmFjdGlvbkZvciA/PyB0aGlzLl9yb290Py5jb250cmFjdGlvbkZvclxuICAgIHRva2VuID0gdGhpcy5uZXdEYXRhPy50b2tlbiA/PyB0aGlzLl9yb290Py50b2tlblxuICAgIGNhcmRpbmFsaXR5ID0gdGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSA/PyB0aGlzLl9yb290Py5jYXJkaW5hbGl0eVxuICAgIHByb3RvID0gdGhpcy5uZXdEYXRhPy5wcm90byA/PyB0aGlzLl9yb290Py5wcm90b1xuICAgIGNvbmNlcHRzID0gdGhpcy5uZXdEYXRhPy5jb25jZXB0cyA/PyB0aGlzLl9yb290Py5jb25jZXB0c1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG5ld0RhdGE/OiBQYXJ0aWFsPExleGVtZT5cbiAgICApIHtcbiAgICB9XG5cbiAgICBnZXQgcm9vdCgpIHtcblxuICAgICAgICBpZiAodGhpcy5fcm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Qucm9vdFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmV3RGF0YT8ucm9vdCBhcyBhbnlcbiAgICB9XG5cbiAgICBnZXQgdHlwZSgpOiBMZXhlbWVUeXBlIHtcblxuICAgICAgICBpZiAodGhpcy5fcm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLl9yb290IGFzIExleGVtZSkudHlwZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmV3RGF0YT8udHlwZSBhcyBhbnlcbiAgICB9XG5cbiAgICBnZXQgaXNQbHVyYWwoKSB7XG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUodGhpcy5uZXdEYXRhPy5jYXJkaW5hbGl0eSlcbiAgICB9XG5cbiAgICBnZXQgaXNDb25jZXB0KCkge1xuICAgICAgICByZXR1cm4gdGhpcz8udHlwZSA9PT0gJ25vdW4nICYmICh0aGlzIGFzIGFueSkuY29uY2VwdHMgJiYgISh0aGlzIGFzIGFueSkucHJvdG9cbiAgICB9XG5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0OiBDb250ZXh0KTogTGV4ZW1lW10ge1xuXG4gICAgICAgIGlmICgodGhpcy50eXBlID09PSAnbm91bicgfHwgdGhpcy50eXBlID09PSAnZ3JhbW1hcicpICYmICF0aGlzLmlzUGx1cmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gW21ha2VMZXhlbWUoeyBfcm9vdDogdGhpcywgdG9rZW46IHBsdXJhbGl6ZSh0aGlzLnJvb3QpLCBjYXJkaW5hbGl0eTogJyonIH0pXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFsnaXZlcmInLCAnbXZlcmInXS5pbmNsdWRlcyh0aGlzLnR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uanVnYXRlKHRoaXMucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogeCB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGdldCBpc011bHRpV29yZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5pbmNsdWRlcygnICcpO1xuICAgIH1cblxuICAgIGdldFByb3RvKCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSk/Llt0aGlzLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNMZXhlbWUod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWUge1xuXG4gICAgY29uc3QgcmVsZXZhbnQgPSB3b3Jkc1xuICAgICAgICAubWFwKHcgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHcsIHR5cGU6ICdub3VuJyB9KSwgJ1gnKSlcbiAgICAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LnF1ZXJ5KGMpKVxuICAgICAgICAuZmxhdE1hcChtID0+IE9iamVjdC52YWx1ZXMobSkpXG4gICAgICAgIC5mbGF0TWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSA/PyBbXSlcbiAgICAgICAgLmZsYXRNYXAoeCA9PiB4Py5keW5hbWljKCkuZmxhdE1hcCh4ID0+IHguZXh0cmFwb2xhdGUoY29udGV4dCkpKVxuICAgICAgICAuZmlsdGVyKHggPT4geC50b2tlbiA9PT0gd29yZCB8fCB4LnJvb3QgPT09IHdvcmQpXG5cbiAgICBjb25zdCBpc01hY3JvQ29udGV4dCA9XG4gICAgICAgIHdvcmRzLnNvbWUoeCA9PiBjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSA9PT0gJ2dyYW1tYXInKVxuICAgICAgICAmJiAhd29yZHMuc29tZSh4ID0+IFsnZGVmYXJ0JywgJ2luZGVmYXJ0JywgJ25vbnN1YmNvbmonXS5pbmNsdWRlcyhjb250ZXh0LmdldExleGVtZSh4KT8udHlwZSBhcyBhbnkpKS8vVE9ETzogd2h5IGRlcGVuZGVuY2llcygnbWFjcm8nKSBkb2Vzbid0IHdvcms/IVxuXG4gICAgY29uc3QgdHlwZSA9IHJlbGV2YW50WzBdPy50eXBlID8/XG4gICAgICAgIChpc01hY3JvQ29udGV4dCA/XG4gICAgICAgICAgICAnZ3JhbW1hcidcbiAgICAgICAgICAgIDogJ25vdW4nKVxuXG4gICAgcmV0dXJuIG1ha2VMZXhlbWUoeyB0b2tlbjogd29yZCwgcm9vdDogcmVsZXZhbnQ/LmF0KDApPy5yb290ID8/IHdvcmQsIHR5cGU6IHR5cGUgfSlcbn1cblxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuaW1wb3J0IHsgZHluYW1pY0xleGVtZSB9IGZyb20gXCIuL2R5bmFtaWNMZXhlbWVcIlxuaW1wb3J0IHsgbnVtYmVyTGV4ZW1lIH0gZnJvbSBcIi4vbnVtYmVyTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZVtdIHtcblxuICAgIGNvbnN0IGxleCA9IGNvbnRleHQuZ2V0TGV4ZW1lKHdvcmQpID8/XG4gICAgICAgIG51bWJlckxleGVtZSh3b3JkKSA/P1xuICAgICAgICBkeW5hbWljTGV4ZW1lKHdvcmQsIGNvbnRleHQsIHdvcmRzKVxuXG4gICAgcmV0dXJuIGxleC5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleC5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBjb250ZXh0LCB3b3JkcykpIDpcbiAgICAgICAgW2xleF1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcbmltcG9ydCB7IHN0ZHNwYWNlIH0gZnJvbSBcIi4vc3Rkc3BhY2VcIjtcbmltcG9ydCB7IHVuc3BhY2UgfSBmcm9tIFwiLi91bnNwYWNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzb3VyY2VDb2RlOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZVtdKSB7XG5cbiAgICBsZXQgbmV3U291cmNlID0gc291cmNlQ29kZTtcblxuICAgIGxleGVtZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IHguaXNNdWx0aVdvcmQpXG4gICAgICAgIC5mb3JFYWNoKHggPT4ge1xuICAgICAgICAgICAgY29uc3QgbGV4ZW1lID0gc3Rkc3BhY2UoeC5yb290KTtcbiAgICAgICAgICAgIG5ld1NvdXJjZSA9IG5ld1NvdXJjZS5yZXBsYWNlQWxsKGxleGVtZSwgdW5zcGFjZShsZXhlbWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbmV3U291cmNlO1xufVxuIiwiaW1wb3J0IHsgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJMZXhlbWUod29yZDogc3RyaW5nKSB7XG5cbiAgICBpZiAod29yZC5tYXRjaCgvXFxkKy8pKSB7XG4gICAgICAgIHJldHVybiBtYWtlTGV4ZW1lKHsgcm9vdDogd29yZCwgdHlwZTogJ25vdW4nLCBwcm90bzogJ051bWJlcicgfSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiByZXNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCctJywgJyAnKTtcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJyk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiB1bnNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCcgJywgJy0nKTtcbn1cbiIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29udGV4dCkpIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb250ZXh0LnN5bnRheExpc3QpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuc2ltcGxpZnkoYXN0KSlcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUpIHtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmtub3duUGFyc2UodCwgcm9sZSlcblxuICAgICAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxleGVyLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga25vd25QYXJzZSA9IChuYW1lOiBBc3RUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNMZWFmKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG1lbWJlcnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KG5hbWUpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2VNZW1iZXIobSlcblxuICAgICAgICAgICAgaWYgKCFhc3QgJiYgaXNOZWNlc3NhcnkobS5udW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpbmtzW20ucm9sZSA/PyBhc3QudHlwZV0gPSBhc3RcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbmtzKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IG5hbWUsXG4gICAgICAgICAgICByb2xlOiByb2xlLFxuICAgICAgICAgICAgbGlua3M6IGxpbmtzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNZW1iZXIgPSAobTogTWVtYmVyLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpc3Q6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5UGFyc2UobS50eXBlLCBtLnJvbGUpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiBsaXN0WzBdLnR5cGUsXG4gICAgICAgICAgICBsaXN0OiBsaXN0XG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzTGVhZiA9ICh0OiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQubGV4ZW1lVHlwZXMuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoIWFzdC5saW5rcykge1xuICAgICAgICAgICAgcmV0dXJuIGFzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSAmJiBPYmplY3QudmFsdWVzKGFzdC5saW5rcykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShPYmplY3QudmFsdWVzKGFzdC5saW5rcylbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLm1hcChsID0+ICh7IFtsWzBdXTogdGhpcy5zaW1wbGlmeShsWzFdKSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCBsaW5rczogc2ltcGxlTGlua3MgfVxuXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4uL0tvb2xQYXJzZXJcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuL0FzdE5vZGVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IEtvb2xQYXJzZXIoc291cmNlQ29kZSwgY29udGV4dClcbn1cbiIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFjcm9Ub1N5bnRheChtYWNybzogQXN0Tm9kZSkge1xuXG4gICAgY29uc3QgbWFjcm9wYXJ0cyA9IG1hY3JvPy5saW5rcz8ubWFjcm9wYXJ0Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ludGF4ID0gbWFjcm9wYXJ0cy5tYXAobSA9PiBtYWNyb1BhcnRUb01lbWJlcihtKSlcbiAgICBjb25zdCBuYW1lID0gbWFjcm8/LmxpbmtzPy5zdWJqZWN0Py5sZXhlbWU/LnJvb3RcblxuICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub255bW91cyBzeW50YXghJylcbiAgICB9XG5cbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IEFzdE5vZGUpOiBNZW1iZXIge1xuXG4gICAgY29uc3QgYWRqZWN0aXZlTm9kZXMgPSBtYWNyb1BhcnQubGlua3M/LmFkamVjdGl2ZT8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBhZGplY3RpdmVOb2Rlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG5cbiAgICBjb25zdCB0YWdnZWRVbmlvbnMgPSBtYWNyb1BhcnQubGlua3M/LnRhZ2dlZHVuaW9uPy5saXN0ID8/IFtdXG4gICAgY29uc3QgZ3JhbW1hcnMgPSB0YWdnZWRVbmlvbnMubWFwKHggPT4geC5saW5rcz8uZ3JhbW1hcilcblxuICAgIGNvbnN0IHF1YW50YWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gYS5jYXJkaW5hbGl0eSlcbiAgICBjb25zdCBxdWFsYWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gIWEuY2FyZGluYWxpdHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9mYWNhZGUvYnJhaW4vQnJhaW5cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIGJyYWluOiBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5oaWRkZW4gPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID8gdGV4dGFyZWEuZm9jdXMoKSA6IDBcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICB0ZXh0YXJlYS5zdHlsZS53aWR0aCA9ICc1MHZ3J1xuICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9ICcxZW0nXG4gICAgdGV4dGFyZWEuaGlkZGVuID0gdHJ1ZVxuICAgIHRleHRhcmVhLnN0eWxlLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICB0ZXh0YXJlYS5zdHlsZS50b3AgPSAnMCdcbiAgICB0ZXh0YXJlYS5zdHlsZS56SW5kZXggPSAnMTAwMCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSk7XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IG1vY2tNYXAgfSBmcm9tIFwiLi9mdW5jdGlvbnMvbW9ja01hcFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcykpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNsYXVzZTEuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTIgPz8gdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgIClcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4geWVzID8gdGhpcy5uZWdhdGVkID8gYG5vdCR7eWVzfWAgOiB5ZXMgOiAnJ1xuICAgIH1cblxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIGFib3V0ID0gKGlkOiBJZCk6IENsYXVzZSA9PiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lZEJ5KGlkKSlcbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5vd25lcnNPZihpZCkpXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gdGhpcy5jbGF1c2UxLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLmRlc2NyaWJlKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBpZiAocXVlcnkuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW9ja01hcChxdWVyeSldXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCByZXN1bHQ6IE1hcFtdID0gW11cbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSlcblxuICAgICAgICBxdWVyeS5lbnRpdGllcy5mb3JFYWNoKHFlID0+IHtcbiAgICAgICAgICAgIHVuaXZlcnNlLmVudGl0aWVzLmZvckVhY2gocmUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmQgPSB1bml2ZXJzZS5hYm91dChyZSkuZmxhdExpc3QoKS5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3JlXTogcWUgfSB9KSkgLy8gc3Vic2l0dXRlIHJlIGJ5IHFlIGluIHJlYWwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICBjb25zdCBxZCA9IHF1ZXJ5LmFib3V0KHFlKS5mbGF0TGlzdCgpXG5cbiAgICAgICAgICAgICAgICBjb25zdCBxaGFzaGVzID0gcWQubWFwKHggPT4geC5oYXNoQ29kZSlcbiAgICAgICAgICAgICAgICBjb25zdCByaGFzaGVzID0gcmQubWFwKHggPT4geC5oYXNoQ29kZSlcblxuICAgICAgICAgICAgICAgIGlmIChxaGFzaGVzLmV2ZXJ5KHggPT4gcmhhc2hlcy5pbmNsdWRlcyh4KSkpIHsgLy8gcWUgdW5pZmllcyB3aXRoIHJlIVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBxZHMgPSBxZC5tYXAoeCA9PiB4LnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IHJkcyA9IHJkLm1hcCh4ID0+IHgudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Fkcz0nLHFkcywgJ3Jkcz0nLHJkcylcbiAgICAgICAgICAgICAgICAgICAgdW5pZnkocWUsIHJlLCByZXN1bHQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0ICYmIHFkLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8udHlwZSA9PT0gJ3Byb25vdW4nKSkge1xuICAgICAgICAgICAgICAgICAgICB1bmlmeShxZSwgaXQsIHJlc3VsdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gdW5pZnkocWU6IElkLCByZTogSWQsIHJlc3VsdDogTWFwW10pIHtcblxuICAgIGlmIChyZXN1bHQuc29tZSh4ID0+IHhbcWVdID09PSByZSkpIHsgLy8gaWYgYWxyZWFkeSB1bmlmaWVkIGRvbid0IGRvIGl0IGFnYWluXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGkgPSByZXN1bHQuZmluZEluZGV4KHggPT4gIXhbcWVdKVxuICAgIGNvbnN0IG0gPSByZXN1bHRbaV0gPz8ge31cbiAgICBtW3FlXSA9IHJlXG4gICAgcmVzdWx0W2kgPiAtMSA/IGkgOiByZXN1bHQubGVuZ3RoXSA9IG1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShcbiAgICAgICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSA/IHRoaXMgOiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkgPSBxdWVyeS5mbGF0TGlzdCgpWzBdIC8vVE9ETyEhPz8/XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBCYXNpY0NsYXVzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHF1ZXJ5LnByZWRpY2F0ZS5yb290ICE9PSB0aGlzLnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHF1ZXJ5LmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM/OiBib29sZWFuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxuICAgIGV4YWN0SWRzPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlID0+IHRoaXNcbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gb3RoZXJcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBjb25jbHVzaW9uXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbXVxuICAgIGFib3V0ID0gKGlkOiBJZCk6IENsYXVzZSA9PiB0aGlzXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCk6IExleGVtZVtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25zZXF1ZW5jZTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uc3ViamNvbmogPz8gdGhpcy5zdWJqY29uaixcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMgICBcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIC8vIHJldHVybiBlbXB0eUNsYXVzZSAvLy9UT0RPISEhISEhISFcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi8uLi8uLi9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLb29sKGNvbnRleHQ6IENvbnRleHQsIGNsYXVzZTogQ2xhdXNlLCBsb2NhbElkOiBJZCk6IFdyYXBwZXJbXSB7XG5cbiAgICBjb25zdCBvd25lcklkcyA9IGNsYXVzZS5vd25lcnNPZihsb2NhbElkKSAvLyAwIG9yIDEgb3duZXIocylcblxuICAgIGlmIChvd25lcklkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkoY2xhdXNlKVxuICAgICAgICByZXR1cm4gbWFwcy5tYXAoeCA9PiB4W2xvY2FsSWRdKS5mbGF0TWFwKHggPT4gY29udGV4dC5nZXQoeCkgPz8gW10pXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZXIgPSBnZXRLb29sKGNvbnRleHQsIGNsYXVzZSwgb3duZXJJZHNbMF0pXG4gICAgcmV0dXJuIG93bmVyLmZsYXRNYXAoeCA9PiB4LmdldChjbGF1c2UuYWJvdXQobG9jYWxJZCkpID8/IFtdKVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5pbXBvcnQgeyB0b0NvbnN0IH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy90b0NvbnN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBbGxWYXJzKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHsgLy8gY2FzZSBpbnNlbnNpdGl2ZSBuYW1lcywgaWYgb25lIHRpbWUgdmFyIGFsbCB2YXJzIVxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi9JbXBseVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbHkoY2xhdXNlOiBDbGF1c2UpIHsgLy8gYW55IGNsYXVzZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbHlcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5yaGVtZSA9PT0gZW1wdHlDbGF1c2UpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UuZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKSB8fCBjbGF1c2UuZmxhdExpc3QoKS5zb21lKHggPT4geC5wcmVkaWNhdGUgPyB4LnByZWRpY2F0ZS5pc1BsdXJhbCA6IGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlLnRoZW1lLmltcGxpZXMoY2xhdXNlLnJoZW1lKVxuICAgIH1cblxuICAgIHJldHVybiBjbGF1c2Vcbn1cbiIsImltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9pZC9NYXBcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1vY2tNYXAoY2xhdXNlOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBjbGF1c2UuZW50aXRpZXMubWFwKGUgPT4gKHsgW2VdOiBlIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5cbi8vVE9ETzogY29uc2lkZXIgbW92aW5nIHRvIENsYXVzZS5jb3B5KHtuZWdhdGV9KSAhISEhIVxuZXhwb3J0IGZ1bmN0aW9uIG5lZ2F0ZShjbGF1c2U6IENsYXVzZSwgbmVnYXRlOiBib29sZWFuKSB7XG5cbiAgICBpZiAoIW5lZ2F0ZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgY2xhdXNlMTogY2xhdXNlLnRoZW1lLnNpbXBsZSwgY2xhdXNlMjogY2xhdXNlLnJoZW1lLnNpbXBsZS5jb3B5KHsgbmVnYXRlIH0pIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBhbnl0aGluZyBvd25lZCBieSBhIHZhciBzaG91bGQgYmUgYWxzbyBiZSBhIHZhclxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtID0gY2xhdXNlLnRoZW1lLnF1ZXJ5KGNsYXVzZS5yaGVtZSlbMF1cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gPz8ge30gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi90b1ZhclwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZXRJbmNyZW1lbnRhbElkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQob3B0cz86IEdldEluY3JlbWVudGFsSWRPcHRzKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZDtcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBtYWtlQWxsVmFycyB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VBbGxWYXJzXCJcbmltcG9ydCB7IG1ha2VJbXBseSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VJbXBseVwiXG5pbXBvcnQgeyBuZWdhdGUgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9uZWdhdGVcIlxuaW1wb3J0IHsgcHJvcGFnYXRlVmFyc093bmVkIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkXCJcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL3Jlc29sdmVBbmFwaG9yYVwiXG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvdG9WYXJcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9pZC9JZFwiXG5cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignQXN0IGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoYXN0LmxleGVtZSkge1xuXG4gICAgICAgIGlmIChhc3QubGV4ZW1lLnR5cGUgPT09ICdub3VuJyB8fCBhc3QubGV4ZW1lLnR5cGUgPT09ICdhZGplY3RpdmUnIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ3Byb25vdW4nIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ2dyYW1tYXInKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xhdXNlT2YoYXN0LmxleGVtZSwgLi4uYXJncz8uc3ViamVjdCA/IFthcmdzPy5zdWJqZWN0XSA6IFtdKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG5cbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGFzdC5saXN0Lm1hcChjID0+IHRvQ2xhdXNlKGMsIGFyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UpXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuICAgIGxldCByZWxcblxuICAgIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGlzQ29wdWxhU2VudGVuY2UoYXN0KSkge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8ubm9uc3ViY29uaikge1xuICAgICAgICByZXN1bHQgPSBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKHJlbCA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZSB8fCBhc3QubGlua3M/Lm12ZXJiPy5sZXhlbWUgfHwgYXN0LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlbGF0aW9uVG9DbGF1c2UoYXN0LCByZWwsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMCA9IGFzdC5saW5rcz8ubm9uc3ViY29uaiA/IHJlc3VsdCA6IG1ha2VJbXBseShyZXN1bHQpXG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMoYzApXG4gICAgICAgIGNvbnN0IGMyID0gcmVzb2x2ZUFuYXBob3JhKGMxKVxuICAgICAgICBjb25zdCBjMyA9IHByb3BhZ2F0ZVZhcnNPd25lZChjMilcbiAgICAgICAgY29uc3QgYzQgPSBuZWdhdGUoYzMsICEhYXN0Py5saW5rcz8ubmVnYXRpb24pXG4gICAgICAgIGNvbnN0IGM1ID0gYzQuY29weSh7IHNpZGVFZmZlY3R5OiBjNC5yaGVtZSAhPT0gZW1wdHlDbGF1c2UgfSlcbiAgICAgICAgcmV0dXJuIGM1XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJyR7YXN0LnR5cGV9JyFgKVxuXG59XG5cbmNvbnN0IGlzQ29wdWxhU2VudGVuY2UgPSAoYXN0PzogQXN0Tm9kZSkgPT4gISFhc3Q/LmxpbmtzPy5jb3B1bGFcblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG5cbiAgICByZXR1cm4gc3ViamVjdC5hbmQocHJlZGljYXRlLCB7IGFzUmhlbWU6IHRydWUgfSlcbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuICAgIHJldHVybiB0b0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBvcHRzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IGFyZ3MgPSB7IHN1YmplY3Q6IHN1YmplY3RJZCB9XG5cbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhub3VuUGhyYXNlLmxpbmtzID8/IHt9KVxuICAgICAgICAubWFwKHggPT4gdG9DbGF1c2UoeCwgYXJncykpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG59XG5cbmZ1bmN0aW9uIHJlbGF0aW9uVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCByZWw6IExleGVtZSwgb3B0cz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmpJZCB9KVxuICAgIGNvbnN0IG9iamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ub2JqZWN0LCB7IHN1YmplY3Q6IG9iaklkIH0pXG5cbiAgICBjb25zdCBhcmdzID0gb2JqZWN0ID09PSBlbXB0eUNsYXVzZSA/IFtzdWJqSWRdIDogW3N1YmpJZCwgb2JqSWRdXG4gICAgY29uc3QgcmVsYXRpb24gPSBjbGF1c2VPZihyZWwsIC4uLmFyZ3MpXG4gICAgY29uc3QgcmVsYXRpb25Jc1JoZW1lID0gc3ViamVjdCAhPT0gZW1wdHlDbGF1c2VcblxuICAgIHJldHVybiBzdWJqZWN0XG4gICAgICAgIC5hbmQob2JqZWN0KVxuICAgICAgICAuYW5kKHJlbGF0aW9uLCB7IGFzUmhlbWU6IHJlbGF0aW9uSXNSaGVtZSB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJjb25qID0gYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWVcbiAgICBjb25zdCBjb25kaXRpb24gPSB0b0NsYXVzZShhc3QubGlua3M/LmNvbmRpdGlvbiwgYXJncylcbiAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uc2VxdWVuY2UsIGFyZ3MpXG4gICAgcmV0dXJuIGNvbmRpdGlvbi5pbXBsaWVzKGNvbnNlcXVlbmNlKS5jb3B5KHsgc3ViamNvbmo6IHN1YmNvbmogfSlcblxufVxuXG5mdW5jdGlvbiBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5sZWZ0LCBhcmdzKVxuICAgIGNvbnN0IHJpZ2h0ID0gdG9DbGF1c2UoYXN0Py5saW5rcz8ucmlnaHQ/Lmxpc3Q/LlswXSwgYXJncylcblxuICAgIGlmIChhc3QubGlua3M/LmxlZnQ/LnR5cGUgPT09IGFzdC5saW5rcz8ucmlnaHQ/LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQuYW5kKHJpZ2h0KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEtleXMob2JqZWN0OiBvYmplY3QsIGl0ZXIgPSA1KSB7XG5cbiAgICBsZXQgb2JqID0gb2JqZWN0XG4gICAgbGV0IHJlczogc3RyaW5nW10gPSBbXVxuXG4gICAgd2hpbGUgKG9iaiAmJiBpdGVyKSB7XG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5rZXlzKG9iaildXG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaildXG4gICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopXG4gICAgICAgIGl0ZXItLVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbn0iLCJleHBvcnQgZnVuY3Rpb24gZGVlcENvcHkob2JqZWN0OiBvYmplY3QpIHtcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gb2JqZWN0LmNsb25lTm9kZSgpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gb2JqZWN0LmlubmVySFRNTFxuICAgICAgICByZXR1cm4gd3JhcHBlZFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm9iamVjdCB9XG4gICAgfVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TmVzdGVkKG9iamVjdDogYW55LCBwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgbGV0IHggPSBvYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgcGF0aC5zbGljZSgxKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICB4ID0geD8uW3BdXG4gICAgfSlcblxuICAgIHJldHVybiB4XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjXG4gICAgICAgIHJldHVybiBoMSAmIGgxIC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pXG59XG4iLCJpbXBvcnQgeyB0YWdOYW1lRnJvbVByb3RvIH0gZnJvbSBcIi4vdGFnTmFtZUZyb21Qcm90b1wiXG5cbi8qKlxuICogXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYW4gb2JqZWN0IChldmVuIEhUTUxFbGVtZW50KSBmcm9tIGEgcHJvdG90eXBlLlxuICogSW4gY2FzZSBpdCdzIGEgbnVtYmVyLCBubyBuZXcgaW5zdGFuY2UgaXMgbWFkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ld0luc3RhbmNlKHByb3RvOiBvYmplY3QsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBpZiAocHJvdG8gPT09IE51bWJlci5wcm90b3R5cGUpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoYXJnc1swXSlcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/XG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZUZyb21Qcm90byhwcm90bykpIDpcbiAgICAgICAgbmV3IChwcm90byBhcyBhbnkpLmNvbnN0cnVjdG9yKC4uLmFyZ3MpXG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzZXROZXN0ZWQob2JqZWN0OiBhbnksIHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICBsZXQgeCA9IG9iamVjdFxuXG4gICAgcGF0aC5zbGljZSgwLCAtMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgeCA9IHhbcF1cbiAgICB9KVxuXG4gICAgeFtwYXRoLmF0KC0xKSFdID0gdmFsdWVcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiXG4vKipcbiAqIFRyeSBnZXR0aW5nIHRoZSBuYW1lIG9mIGFuIGh0bWwgZWxlbWVudCBmcm9tIGEgcHJvdG90eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IG9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgLnJlcGxhY2UoJ0hUTUwnLCAnJylcbiAgICAucmVwbGFjZSgnRWxlbWVudCcsICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4iLCJcbi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgb2YgcHJpbWl0aXZlcyAobnVtYmVycywgYm9vbHMsIHN0cmluZ3MpLlxuICogQ2FyZWZ1bCB1c2luZyB0aGlzIHdpdGggb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVuaXEgPSAoeDogYW55W10pID0+IEFycmF5LmZyb20obmV3IFNldCh4KSlcbiIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuLi9zcmMvZmFjYWRlL2JyYWluL0Jhc2ljQnJhaW5cIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vc3JjL2ZhY2FkZS9icmFpbi9CcmFpblwiXG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMCxcbiAgICB0ZXN0MTEsXG4gICAgdGVzdDEyLFxuICAgIHRlc3QxMyxcbiAgICB0ZXN0MTQsXG4gICAgdGVzdDE1LFxuICAgIHRlc3QxNixcbiAgICB0ZXN0MTcsXG4gICAgdGVzdDE4LFxuICAgIHRlc3QxOSxcbiAgICB0ZXN0MjAsXG4gICAgdGVzdDIxLFxuICAgIHRlc3QyMixcbiAgICB0ZXN0MjMsXG4gICAgdGVzdDI0LFxuICAgIHRlc3QyNSxcbiAgICB0ZXN0MjYsXG4gICAgdGVzdDI3LFxuICAgIHRlc3QyOCxcbiAgICB0ZXN0MjksXG4gICAgdGVzdDMwLFxuICAgIHRlc3QzMSxcbiAgICB0ZXN0MzIsXG5dXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0ZXN0KClcbiAgICAgICAgY29uc29sZS5sb2coYCVjJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnfSAke3Rlc3QubmFtZX1gLCBgY29sb3I6JHtzdWNjZXNzID8gJ2dyZWVuJyA6ICdyZWQnfWApXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwKS8vNzVcbiAgICAgICAgY2xlYXIoKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ2EgYmxhY2sgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpXG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIHRlc3Q1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0NigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuXG5mdW5jdGlvbiB0ZXN0NygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0udGV4dENvbnRlbnQgPT0gJ2NhcHJhJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgncmVkJykubGVuZ3RoID09PSAwXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2dyZWVuJykubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MTAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0MTEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFuZCB3IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3cgYW5kIHogYXJlIGJsYWNrJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDQgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0MyAmJiBhc3NlcnQ0XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhcHBlbmRDaGlsZHMgeScpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmNoaWxkcmVuKS5pbmNsdWRlcyhicmFpbi5leGVjdXRlKCd5JylbMF0pXG59XG5cbmZ1bmN0aW9uIHRlc3QxMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24gYW5kIGl0IGlzIGdyZWVuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDE0KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZCBhbmQgeiBpcyBncmVlbi4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIG5vdCByZWQuJylcblxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG5cbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG5cbn1cblxuZnVuY3Rpb24gdGVzdDE1KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBldmVyeSBidXR0b24gaXMgYmx1ZS4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ogaXMgcmVkLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgYnV0dG9uIGlzIG5vdCBibHVlLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDE2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uaGlkZGVuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBub3QgaGlkZGVuJylcbiAgICBjb25zdCBhc3NlcnQyID0gIWJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpXG4gICAgY29uc3QgeCA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXVxuICAgIHgub25jbGljayA9ICgpID0+IGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGNsaWNrcycpXG4gICAgcmV0dXJuIHguc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTgoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkLiB4IGlzIGEgYnV0dG9uIGFuZCB5IGlzIGEgZGl2LicpXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgcmVkIGJ1dHRvbiBpcyBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZGl2JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG5cbn1cblxuZnVuY3Rpb24gdGVzdDE5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIGlmIHggaXMgcmVkIHRoZW4geSBpcyBhIGdyZWVuIGJ1dHRvbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDIwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24gaWYgeCBpcyByZWQnKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG59XG5cbmZ1bmN0aW9uIHRlc3QyMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGNvbG9yIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDIyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QyMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIHJlZC4gZXZlcnkgcmVkIGlzIGEgYnV0dG9uJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDI0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkIGJ1dHRvbnMnKVxuICAgIGxldCBjbGlja3MgPSAnJ1xuICAgIGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd4J1xuICAgIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd5J1xuICAgIGJyYWluLmV4ZWN1dGUoJ2V2ZXJ5IGJ1dHRvbiBjbGlja3MnKVxuICAgIHJldHVybiBjbGlja3MgPT09ICd4eSdcbn1cblxuZnVuY3Rpb24gdGVzdDI1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucy4geCBpcyByZWQgYW5kIHkgaXMgYmx1ZScpXG4gICAgYnJhaW4uZXhlY3V0ZSgndGhlIGJ1dHRvbiB0aGF0IGlzIGJsdWUgaXMgYmxhY2snKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2J1dHRvbnMgYXJlIHJlZCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCcpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQuIHogaXMgYmx1ZS4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zIGFyZSBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmx1ZSdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYmxhY2snKS5sZW5ndGggPT09IDJcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyOCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCdib3JkZXIgb2Ygc3R5bGUgb2YgeCBpcyBkb3R0ZWQteWVsbG93JylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5ib3JkZXIuaW5jbHVkZXMoJ2RvdHRlZCB5ZWxsb3cnKVxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyAxIGFuZCB5IGlzIDInKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYWRkcyB5JylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnaXQnKVswXSA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MzAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCc9ICBpcyBhIGNvcHVsYScpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCA9IHJlZCBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbn1cblxuZnVuY3Rpb24gdGVzdDMxKCl7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7cm9vdDpkb2N1bWVudC5ib2R5fSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIGdyZWVuIGFuZCB5IGlzIHJlZC4nKVxuICAgIGNvbnN0IHJlcyA9IGJyYWluLmV4ZWN1dGUoJ2NvbG9yIG9mIHRoZSByZWQgYnV0dG9uJylcbiAgICByZXR1cm4gcmVzLmluY2x1ZGVzKCdyZWQnKSAmJiAhcmVzLmluY2x1ZGVzKCdncmVlbicpXG59XG5cbmZ1bmN0aW9uIHRlc3QzMigpe1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oe3Jvb3Q6ZG9jdW1lbnQuYm9keX0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBidXR0b24gYW5kIHRoZSBjb2xvciBvZiBpdCBpcyBwdXJwbGUuJylcbiAgICBjb25zdCByZXMgPSBicmFpbi5leGVjdXRlKCdwdXJwbGUgYnV0dG9uJylcbiAgICByZXR1cm4gcmVzLmxlbmd0aCA9PT0gMSAmJiByZXNbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3B1cnBsZSdcbn1cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIGNvbnN0IHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JylcbiAgICBkb2N1bWVudC5ib2R5ID0geFxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==