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
class BaseWrapper {
    constructor(object, id, isPlaceholder, parent, name) {
        var _a, _b;
        this.object = object;
        this.id = id;
        this.isPlaceholder = isPlaceholder;
        this.parent = parent;
        this.name = name;
        this.aliases = (_b = (_a = this.object) === null || _a === void 0 ? void 0 : _a.aliases) !== null && _b !== void 0 ? _b : {};
        this.simplePredicates = [];
        try {
            this.object.aliases = this.aliases;
            this.object.simplePredicates = this.simplePredicates;
        }
        catch (_c) { }
    }
    is(predicate) {
        var _a, _b;
        const path = this.aliases[(_b = (_a = predicate.concepts) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : ''];
        return path ?
            this.getNested(path) === predicate.root :
            this.isSimplePredicate(predicate);
    }
    isSimplePredicate(predicate) {
        return this.simplePredicates.map(x => x.root).includes(predicate.root);
    }
    setAlias(alias, path) {
        this.aliases[alias.root] = path.map(x => x.root);
    }
    call(verb, args) {
        return this.object[verb.root](...args.map(x => x.unwrap()));
    }
    toClause(query) {
        return Object.keys(this.aliases)
            .map(k => this.getNested(this.aliases[k]))
            .map(x => (0, Lexeme_1.makeLexeme)({ root: x, type: 'adjective' }))
            .concat(this.simplePredicates)
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause)
            .and(this.extraInfo(query !== null && query !== void 0 ? query : Clause_1.emptyClause));
    }
    extraInfo(q) {
        var _a, _b;
        const oc = (0, getOwnershipChain_1.getOwnershipChain)(q, (0, topLevel_1.getTopLevel)(q)[0]);
        const path = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').map(x => x.root).slice(1);
        const nested = this.getNested((_b = (_a = this.aliases) === null || _a === void 0 ? void 0 : _a[path === null || path === void 0 ? void 0 : path[0]]) !== null && _b !== void 0 ? _b : path);
        return nested !== undefined ? q.copy({ map: { [oc[0]]: this.id } }) : Clause_1.emptyClause;
    }
    set(predicate, opts) {
        var _a, _b, _c, _d;
        if (opts === null || opts === void 0 ? void 0 : opts.args) {
            return this.call(predicate, opts.args);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath);
        }
        if (this.parent) {
            return this.parent.set(predicate, { props: [...(_a = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _a !== void 0 ? _a : [], this.name].reverse() });
        }
        const props = (_b = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _b !== void 0 ? _b : [];
        const last = props.at(-1);
        const path = props.length > 0 ?
            [...props.slice(0, -1), ...(_c = this.aliases[last]) !== null && _c !== void 0 ? _c : [last]] :
            this.aliases[(_d = predicate === null || predicate === void 0 ? void 0 : predicate.concepts) === null || _d === void 0 ? void 0 : _d[0]];
        this.setMultiProp(path, predicate, opts);
    }
    setMultiProp(path, value, opts) {
        if (!path) {
            const val = value.root;
            if (typeof this.object[val] === 'boolean') {
                this.object[val] = !(opts === null || opts === void 0 ? void 0 : opts.negated);
            }
            else {
                this.simplePredicates.push(value);
            }
        }
        else {
            const val = !(opts === null || opts === void 0 ? void 0 : opts.negated) ? value.root : (opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value) ? '' : this.getNested(path);
            this.setNested(path, val);
        }
    }
    setNested(path, value) {
        if (typeof this.getNested(path) !== typeof value) { //TODO: remove!
            return;
        }
        if (path.length === 1) {
            this.object[path[0]] = value;
            return;
        }
        let x = this.object[path[0]];
        path.slice(1, -2).forEach(p => {
            x = x[p];
        });
        x[path.at(-1)] = value;
    }
    getNested(path) {
        let x = this.object[path[0]]; // assume at least one
        path.slice(1).forEach(p => {
            x = x === null || x === void 0 ? void 0 : x[p];
        });
        return x;
    }
    copy(opts) {
        var _a;
        const copy = new BaseWrapper((_a = opts === null || opts === void 0 ? void 0 : opts.object) !== null && _a !== void 0 ? _a : (0, deepCopy_1.deepCopy)(this.object), this.id, (opts === null || opts === void 0 ? void 0 : opts.object) ? false : this.isPlaceholder);
        this.simplePredicates.forEach(x => copy.set(x));
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
    dynamic() {
        return (0, allKeys_1.allKeys)(this.object).map(x => {
            return (0, Lexeme_1.makeLexeme)({ type: (0, typeOf_1.typeOf)(this.object[x]), root: x });
        });
    }
    unwrap() {
        return this.object;
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
    var _a;
    if (typeof o === 'function') {
        return ((_a = o.length) !== null && _a !== void 0 ? _a : 0) > 0 ? 'mverb' : 'iverb';
    }
    if (typeof o === 'boolean') {
        return 'adjective';
    }
    if (o === undefined) {
        return undefined;
    }
    return 'noun';
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
        then optional subject noun or pronoun or grammar
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
    if (data instanceof LexemeObject_1.default) {
        return data;
    }
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
        const universe = this.clause1.and(this.clause2);
        const result = [];
        const it = (_a = opts === null || opts === void 0 ? void 0 : opts.it) !== null && _a !== void 0 ? _a : (0, sortIds_1.sortIds)(universe.entities).at(-1);
        query.entities.forEach(qe => {
            universe.entities.forEach(re => {
                const rd = universe.about(re).flatList();
                const qd = query.about(qe).flatList();
                const rd2 = rd.map(x => x.copy({ map: { [re]: qe } })); // subsitute re by qe in real description
                // const rd2 =  rd
                // compare each rd2 to each qd, if predicate is same replace r args with q args
                rd2.forEach((r, i) => {
                    qd.forEach(q => {
                        var _a;
                        if (r.predicate === q.predicate) {
                            const m = ((_a = r.args) !== null && _a !== void 0 ? _a : []).map((a, i) => { var _a, _b; return ({ [a]: (_b = (_a = q.args) === null || _a === void 0 ? void 0 : _a[i]) !== null && _b !== void 0 ? _b : a }); }).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
                            rd2[i] = r.copy({ map: m });
                            // console.log(r.toString(), 'may be ', q.toString(), 'r becomes', rd2[i].toString())
                        }
                    });
                });
                const qhashes = qd.map(x => x.hashCode);
                const r2hashes = rd2.map(x => x.hashCode);
                // console.log('Unify or not?', 'qd=', qd.map(x=>x.toString()), 'rd2=', rd2.map(x=>x.toString()))
                if (qhashes.every(x => r2hashes.includes(x))) { // qe unifies with re!
                    // console.log(qe, 'is', re, '!')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvQ3JlYXRlQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0NyZWF0ZUxleGVtZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9FZGl0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0lmQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL011bHRpQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1JlbGF0aW9uQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1NldEFsaWFzQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL1doZW5BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvZ2V0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3R1YXRvci9BY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci9CYXNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC93cmFwcGVyL3R5cGVPZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2JyYWluL3BvaW50T3V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL2NvbnRleHQvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWVPYmplY3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZHluYW1pY0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9nZXRMZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2pvaW5NdWx0aVdvcmRMZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL251bWJlckxleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcmVzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9zdGRzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy91bnNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9CYXNpY0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlQWxsVmFycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbW9ja01hcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9uZWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3Jlc29sdmVBbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvaWRUb051bS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvaXNWYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3RvQ29uc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3RvVmFyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvYWxsS2V5cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2RlZXBDb3B5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL25ld0luc3RhbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy90YWdOYW1lRnJvbVByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpIiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IG5ld0luc3RhbmNlIH0gZnJvbSBcIi4uLy4uL3V0aWxzL25ld0luc3RhbmNlXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGxvY2FsSWQgPSB0aGlzLmNsYXVzZT8uYXJncz8uWzBdIGFzIElkXG4gICAgICAgIGNvbnN0IGlkID0gY29udGV4dC5xdWVyeSh0aGlzLnRvcExldmVsLnRoZW1lKT8uWzBdPy5bbG9jYWxJZF0gPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0LmdldChpZCk/LmlzKHByZWRpY2F0ZSkpIHsgIC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdG8gPSBwcmVkaWNhdGUuZ2V0UHJvdG8oKVxuXG4gICAgICAgIGlmICghcHJvdG8pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbyA9IG5ld0luc3RhbmNlKHByb3RvLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgaW5pdChvLCBjb250ZXh0LCBpZClcbiAgICAgICAgY29udGV4dC5zZXQoaWQsIG8pLnNldChwcmVkaWNhdGUpXG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaW5pdChvOiBvYmplY3QsIGNvbnRleHQ6IENvbnRleHQsIGlkOiBJZCkge1xuXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBvLmlkID0gaWQgKyAnJ1xuICAgICAgICBvLnRleHRDb250ZW50ID0gJ2RlZmF1bHQnXG4gICAgICAgIGNvbnRleHQucm9vdD8uYXBwZW5kQ2hpbGQobylcbiAgICB9XG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlTGV4ZW1lQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICghY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0aGlzLmNsYXVzZS5wcmVkaWNhdGU/LnJvb3QgYXMgYW55KSAmJiAhdGhpcy50b3BMZXZlbC5yaGVtZS5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8uaXNDb25jZXB0KSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSgodGhpcy5jbGF1c2UuYXJncyBhcyBhbnkpWzBdKVswXS5yb290IC8vVE9ETzogY291bGQgYmUgdW5kZWZpbmVkICAgICAgICBcbiAgICAgICAgY29uc3QgdHlwZSA9IChjb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCBhcyBhbnkpID8gdGhpcy5jbGF1c2UucHJlZGljYXRlPy5yb290IDogJ2FkamVjdGl2ZScpIGFzIExleGVtZVR5cGVcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSB0eXBlID09PSAnbm91bicgPyBbXSA6IHR5cGUgPT09ICdhZGplY3RpdmUnID8gW3RoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdF0uZmxhdE1hcCh4ID0+IHggPz8gW10pLmZpbHRlcih4ID0+IHggIT09IG5hbWUpLyogSEVFRUVFRUVFUkUgKi8gOiB1bmRlZmluZWRcbiAgICAgICAgY29uc3QgcmVzID0gdGhpcy50b3BMZXZlbC5xdWVyeSgkKCdwcm90bycsICdYJykpLmF0KDApPy5bJ1gnXVxuICAgICAgICBjb25zdCBwcm90byA9IHJlcyA/IHRoaXMudG9wTGV2ZWwuZGVzY3JpYmUocmVzKS5tYXAoeCA9PiB4LnJvb3QpLmZpbHRlcih4ID0+IHggIT09ICdwcm90bycpWzBdIDogdW5kZWZpbmVkXG5cblxuXG4gICAgICAgIGNvbnN0IGxleGVtZSA9IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICBwcm90bzogcHJvdG8sXG4gICAgICAgICAgICBjb25jZXB0czogY29uY2VwdHNcbiAgICAgICAgfSlcblxuICAgICAgICBjb250ZXh0LnNldExleGVtZShsZXhlbWUpXG5cbiAgICB9XG5cbn1cblxuXG5jb25zdCAkID0gKHA6IHN0cmluZywgLi4uYXJnczogSWRbXSkgPT4gY2xhdXNlT2YobWFrZUxleGVtZSh7IHJvb3Q6IHAsIHR5cGU6ICdub3VuJyB9KSwgLi4uYXJncykiLCJpbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2xcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGxvY2FsSWQgPSB0aGlzLmNsYXVzZS5hcmdzPy5bMF1cbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG4gICAgICAgIGNvbnN0IHNlYXJjaFNwYWNlID0gdGhpcy50b3BMZXZlbC50aGVtZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBnZXRLb29sKGNvbnRleHQsIHNlYXJjaFNwYWNlLCBsb2NhbElkKVswXSA/PyBjb250ZXh0LnNldChnZXRJbmNyZW1lbnRhbElkKCkpXG4gICAgICAgIHdyYXBwZXIuc2V0KHByZWRpY2F0ZSwgeyBuZWdhdGVkOiB0aGlzLmNsYXVzZS5uZWdhdGVkIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWZBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKGNvbnRleHQucXVlcnkodGhpcy5jbGF1c2UudGhlbWUpLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgdGhpcy5jbGF1c2UucmhlbWUuZmxhdExpc3QoKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgIGdldEFjdGlvbihjLCB0aGlzLmNsYXVzZS5yaGVtZSkucnVuKGNvbnRleHQpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY2xhdXNlLnRoZW1lXG5cbiAgICAgICAgY29udGV4dC5xdWVyeShjb25kaXRpb24pLmZvckVhY2gobSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY2xhdXNlLmNvcHkoeyBtYXA6IG0sIGV4YWN0SWRzOiB0cnVlIH0pXG4gICAgICAgICAgICBjb25zdCBjb25zZXEgPSB0b3AucmhlbWVcbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZXMgPSBjb25zZXEuZmxhdExpc3QoKVxuICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZXMubWFwKGMgPT4gZ2V0QWN0aW9uKGMsIHRvcCkpXG4gICAgICAgICAgICBhY3Rpb25zLmZvckVhY2goYSA9PiBhLnJ1bihjb250ZXh0KSlcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRLb29sIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRLb29sXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpb25BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgYXJncyA9ICh0aGlzLmNsYXVzZS5hcmdzID8/IFtdKVxuICAgICAgICAgICAgLm1hcCh4ID0+IGdldEtvb2woY29udGV4dCwgdGhpcy50b3BMZXZlbC50aGVtZSwgeClbMF0pXG5cbiAgICAgICAgaWYgKCF0aGlzLmNsYXVzZS5wcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGFyZ3NbMF1cbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gYXJnc1sxXVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHN1YmplY3Q/LnNldCh0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIHsgYXJnczogb2JqZWN0ID8gW29iamVjdF0gOiBbXSB9KVxuXG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2V0KGdldEluY3JlbWVudGFsSWQoKSwgcmVzKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxufSIsImltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0QWxpYXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuICAgICAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRoaXMuY2xhdXNlLnJoZW1lXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY29uZGl0aW9uKVswXSAvL1RPRE8gKCFBU1NVTUUhKSBzYW1lIGFzIHRvcCBpbiBjb25jbHVzaW9uXG4gICAgICAgIGNvbnN0IGFsaWFzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uZGl0aW9uLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uc2VxdWVuY2UsIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiBjb25kaXRpb24uZGVzY3JpYmUoeClbMF0pIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmUgbmFtZVxuICAgICAgICBjb25zdCBwcm9wc05hbWVzID0gcHJvcHMubWFwKHggPT4gY29uc2VxdWVuY2UuZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IGNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG5cbiAgICAgICAgd3JhcChnZXRJbmNyZW1lbnRhbElkKCksIHByb3RvTmFtZS5nZXRQcm90bygpKS5zZXQoY29uY2VwdE5hbWVbMF0sIHsgYWxpYXNQYXRoOiBwcm9wc05hbWVzIH0pXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdoZW5BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChjb250ZXh0LnF1ZXJ5KHRoaXMuY2xhdXNlLnRoZW1lKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZS5yaGVtZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGlvbihjLCB0aGlzLmNsYXVzZS5yaGVtZSkucnVuKGNvbnRleHQpXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgMTAwKVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IENyZWF0ZUFjdGlvbiBmcm9tIFwiLi9DcmVhdGVBY3Rpb25cIlxuaW1wb3J0IEVkaXRBY3Rpb24gZnJvbSBcIi4vRWRpdEFjdGlvblwiXG5pbXBvcnQgUmVsYXRpb25BY3Rpb24gZnJvbSBcIi4vUmVsYXRpb25BY3Rpb25cIlxuaW1wb3J0IFNldEFsaWFzQWN0aW9uIGZyb20gXCIuL1NldEFsaWFzQWN0aW9uXCJcbmltcG9ydCBNdWx0aUFjdGlvbiBmcm9tIFwiLi9NdWx0aUFjdGlvblwiXG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiXG5pbXBvcnQgSWZBY3Rpb24gZnJvbSBcIi4vSWZBY3Rpb25cIlxuaW1wb3J0IFdoZW5BY3Rpb24gZnJvbSBcIi4vV2hlbkFjdGlvblwiXG5pbXBvcnQgQ3JlYXRlTGV4ZW1lQWN0aW9uIGZyb20gXCIuL0NyZWF0ZUxleGVtZUFjdGlvblwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvSW1wbHlcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb24ge1xuXG4gICAgLy8gY29uc29sZS5sb2codG9wTGV2ZWwudG9TdHJpbmcoKSlcblxuICAgIGlmICh0b3BMZXZlbC5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8udHlwZSA9PT0gJ2dyYW1tYXInKVxuICAgICAgICB8fCB0b3BMZXZlbC5yaGVtZS5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZT8uaXNDb25jZXB0KSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlTGV4ZW1lQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgLy8gVE9ETzogcHJlcG9zaXRpb25zLCBhbmQgYmUgYmV3YXJlIG9mICdvZicgXG4gICAgaWYgKGNsYXVzZS5wcmVkaWNhdGU/LnR5cGUgPT09ICdpdmVyYicgfHwgY2xhdXNlLnByZWRpY2F0ZT8udHlwZSA9PT0gJ212ZXJiJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlbGF0aW9uQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5wcmVkaWNhdGU/LnByb3RvKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS50aGVtZS5lbnRpdGllcy5zb21lKGUgPT4gY2xhdXNlLnRoZW1lLm93bmVyc09mKGUpLmxlbmd0aCkgJiYgY2xhdXNlLnJoZW1lLmVudGl0aWVzLnNvbWUoZSA9PiBjbGF1c2UucmhlbWUub3duZXJzT2YoZSkubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNldEFsaWFzQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnN1Ympjb25qPy5yb290ID09PSAnaWYnKSB7XG4gICAgICAgIHJldHVybiBuZXcgSWZBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2Uuc3ViamNvbmo/LnJvb3QgPT09ICd3aGVuJykge1xuICAgICAgICByZXR1cm4gbmV3IFdoZW5BY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gbmV3IE11bHRpQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEVkaXRBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiBhbnlbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0dWF0b3IoKTogQWN0dWF0b3Ige1xuICAgIHJldHVybiBuZXcgQmFzZUFjdHVhdG9yKClcbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb25zL2dldEFjdGlvblwiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogYW55W10ge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2UuZmxhdExpc3QoKS5tYXAoeCA9PiBnZXRBY3Rpb24oeCwgY2xhdXNlKSlcbiAgICAgICAgcmV0dXJuIGFjdGlvbnMuZmxhdE1hcChhID0+IGEucnVuKGNvbnRleHQpPz9bXSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgV3JhcHBlciwgeyB3cmFwIH0gZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBnZXQgPSAoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldCA9IChpZDogSWQsIG9iamVjdD86IG9iamVjdCk6IFdyYXBwZXIgPT4ge1xuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdID0gcGxhY2Vob2xkZXI/LmNvcHkoeyBvYmplY3Q6IG9iamVjdCB9KSA/PyB3cmFwKGlkLCBvYmplY3QpXG4gICAgfVxuXG4gICAgcXVlcnkgPSAocXVlcnk6IENsYXVzZSk6IE1hcFtdID0+IHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMudmFsdWVzXG4gICAgICAgICAgICAubWFwKHcgPT4gdy50b0NsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHVuaXZlcnNlLnF1ZXJ5KHF1ZXJ5LCB7IGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIG9iamVjdD86IG9iamVjdCk6IFdyYXBwZXJcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgcmVhZG9ubHkgdmFsdWVzOiBXcmFwcGVyW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgV3JhcHBlciwgeyBDb3B5T3B0cywgU2V0T3BzIH0gZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IGFsbEtleXMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvYWxsS2V5c1wiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbFwiO1xuaW1wb3J0IHsgdHlwZU9mIH0gZnJvbSBcIi4vdHlwZU9mXCI7XG5pbXBvcnQgeyBkZWVwQ29weSB9IGZyb20gXCIuLi8uLi91dGlscy9kZWVwQ29weVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgYWxpYXNlczogeyBbYWxpYXM6IHN0cmluZ106IHN0cmluZ1tdIH0gPSB0aGlzLm9iamVjdD8uYWxpYXNlcyA/PyB7fVxuICAgIHJlYWRvbmx5IHNpbXBsZVByZWRpY2F0ZXM6IExleGVtZVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBpc1BsYWNlaG9sZGVyOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBwYXJlbnQ/OiBXcmFwcGVyLFxuICAgICAgICByZWFkb25seSBuYW1lPzogc3RyaW5nXG4gICAgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LmFsaWFzZXMgPSB0aGlzLmFsaWFzZXNcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnNpbXBsZVByZWRpY2F0ZXMgPSB0aGlzLnNpbXBsZVByZWRpY2F0ZXNcbiAgICAgICAgfSBjYXRjaCB7IH1cblxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3ByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMCkgPz8gJyddXG5cbiAgICAgICAgcmV0dXJuIHBhdGggP1xuICAgICAgICAgICAgdGhpcy5nZXROZXN0ZWQocGF0aCkgPT09IHByZWRpY2F0ZS5yb290IDpcbiAgICAgICAgICAgIHRoaXMuaXNTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzU2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbXBsZVByZWRpY2F0ZXMubWFwKHggPT4geC5yb290KS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0QWxpYXMoYWxpYXM6IExleGVtZSwgcGF0aDogTGV4ZW1lW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hbGlhc2VzW2FsaWFzLnJvb3RdID0gcGF0aC5tYXAoeCA9PiB4LnJvb3QpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHsvL1RPRE86IGFsaWFzXG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdFt2ZXJiLnJvb3RdKC4uLmFyZ3MubWFwKHggPT4geC51bndyYXAoKSkpXG4gICAgfVxuXG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpIHtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5hbGlhc2VzKVxuICAgICAgICAgICAgLm1hcChrID0+IHRoaXMuZ2V0TmVzdGVkKHRoaXMuYWxpYXNlc1trXSkpXG4gICAgICAgICAgICAubWFwKHggPT4gbWFrZUxleGVtZSh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnNpbXBsZVByZWRpY2F0ZXMpXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeCwgdGhpcy5pZCkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgICAgICAgICAuYW5kKHRoaXMuZXh0cmFJbmZvKHF1ZXJ5ID8/IGVtcHR5Q2xhdXNlKSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHRyYUluZm8ocTogQ2xhdXNlKSB7XG5cbiAgICAgICAgY29uc3Qgb2MgPSBnZXRPd25lcnNoaXBDaGFpbihxLCBnZXRUb3BMZXZlbChxKVswXSlcbiAgICAgICAgY29uc3QgcGF0aCA9IG9jLmZsYXRNYXAoeCA9PiBxLmRlc2NyaWJlKHgpKS5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdub3VuJykubWFwKHggPT4geC5yb290KS5zbGljZSgxKVxuICAgICAgICBjb25zdCBuZXN0ZWQgPSB0aGlzLmdldE5lc3RlZCh0aGlzLmFsaWFzZXM/LltwYXRoPy5bMF1dID8/IHBhdGgpXG4gICAgICAgIHJldHVybiBuZXN0ZWQgIT09IHVuZGVmaW5lZCA/IHEuY29weSh7IG1hcDogeyBbb2NbMF1dOiB0aGlzLmlkIH0gfSkgOiBlbXB0eUNsYXVzZVxuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuICAgICAgICBpZiAob3B0cz8uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHMuYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzPy5hbGlhc1BhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEFsaWFzKHByZWRpY2F0ZSwgb3B0cy5hbGlhc1BhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5zZXQocHJlZGljYXRlLCB7IHByb3BzOiBbLi4ub3B0cz8ucHJvcHMgPz8gW10sIHRoaXMubmFtZSFdLnJldmVyc2UoKSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvcHMgPSBvcHRzPy5wcm9wcyA/PyBbXVxuICAgICAgICBjb25zdCBsYXN0ID0gcHJvcHMuYXQoLTEpIVxuICAgICAgICBjb25zdCBwYXRoID0gcHJvcHMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICBbLi4ucHJvcHMuc2xpY2UoMCwgLTEpLCAuLi50aGlzLmFsaWFzZXNbbGFzdF0gPz8gW2xhc3RdXSA6XG4gICAgICAgICAgICB0aGlzLmFsaWFzZXNbcHJlZGljYXRlPy5jb25jZXB0cz8uWzBdIV1cblxuICAgICAgICB0aGlzLnNldE11bHRpUHJvcChwYXRoLCBwcmVkaWNhdGUsIG9wdHMpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TXVsdGlQcm9wKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB2YWx1ZS5yb290XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vYmplY3RbdmFsXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RbdmFsXSA9ICFvcHRzPy5uZWdhdGVkXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5wdXNoKHZhbHVlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSAhb3B0cz8ubmVnYXRlZCA/IHZhbHVlLnJvb3QgOiBvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXModmFsdWUpID8gJycgOiB0aGlzLmdldE5lc3RlZChwYXRoKVxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aCwgdmFsKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmdldE5lc3RlZChwYXRoKSAhPT0gdHlwZW9mIHZhbHVlKSB7IC8vVE9ETzogcmVtb3ZlIVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4Py5bcF1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4geFxuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBXcmFwcGVyIHtcblxuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IEJhc2VXcmFwcGVyKFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8/IGRlZXBDb3B5KHRoaXMub2JqZWN0KSxcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICBvcHRzPy5vYmplY3QgPyBmYWxzZSA6IHRoaXMuaXNQbGFjZWhvbGRlcixcbiAgICAgICAgKVxuXG4gICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5mb3JFYWNoKHggPT4gY29weS5zZXQoeCkpXG4gICAgICAgIHJldHVybiBjb3B5XG4gICAgfVxuXG4gICAgZ2V0KGNsYXVzZTogQ2xhdXNlKTogV3JhcHBlciB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgeCA9IGNsYXVzZS5lbnRpdGllcy5mbGF0TWFwKGUgPT4gY2xhdXNlLmRlc2NyaWJlKGUpKVswXVxuXG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzPy5beC5yb290XSA/PyBbeC5yb290XVxuICAgICAgICAgICAgbGV0IHBhcmVudDogV3JhcHBlciA9IHRoaXNcblxuICAgICAgICAgICAgcGF0aC5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG8gPSBwYXJlbnQudW53cmFwKClbcF1cbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBuZXcgQmFzZVdyYXBwZXIobywgZ2V0SW5jcmVtZW50YWxJZCgpLCBmYWxzZSwgcGFyZW50LCBwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudFxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGR5bmFtaWMoKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gYWxsS2V5cyh0aGlzLm9iamVjdCkubWFwKHggPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VMZXhlbWUoeyB0eXBlOiB0eXBlT2YodGhpcy5vYmplY3RbeF0pLCByb290OiB4IH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdW53cmFwKCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdFxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBCYXNlV3JhcHBlciBmcm9tIFwiLi9CYXNlV3JhcHBlclwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgcmVhZG9ubHkgcGFyZW50PzogV3JhcHBlclxuICAgIHRvQ2xhdXNlKGNsYXVzZT86IENsYXVzZSk6IENsYXVzZVxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueVxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlclxuICAgIGdldChjbGF1c2U6IENsYXVzZSk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBkeW5hbWljKCk6IExleGVtZVtdIC8qIGV4dHJhcG9sYXRlZCBub3VucyBhbmQgdmVyYnMgYXNzb2NpYXRlZCB0byB0aGlzIG9iamVjdCAqL1xuICAgIHVud3JhcCgpOmFueXx1bmRlZmluZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIHByb3BzPzpzdHJpbmdbXVxuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFdyYXBwZXJbXVxuICAgIGFsaWFzUGF0aD86IExleGVtZVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG9iamVjdD86IG9iamVjdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChpZDogSWQsIG8/OiBPYmplY3QpOiBXcmFwcGVyIHtcbiAgICByZXR1cm4gbmV3IEJhc2VXcmFwcGVyKG8gPz8ge30sIGlkLCBvID09PSB1bmRlZmluZWQpXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiB0eXBlT2Yobzogb2JqZWN0KTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAodHlwZW9mIG8gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIChvLmxlbmd0aCA/PyAwKSA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiAnYWRqZWN0aXZlJ1xuICAgIH1cblxuICAgIGlmIChvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiAnbm91bidcbn0iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqZWN0aXZlJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdmaWxsZXInLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnZ3JhbW1hcicsXG4gICdub25zdWJjb25qJywgLy8gYW5kIC4uLlxuICAnZGlzanVuYycsIC8vIG9yLCBidXQsIGhvd2V2ZXIgLi4uXG4gICdwcm9ub3VuJyxcbiAgLy8gJ2FueSdcbilcbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuY29uc3QgYmU6IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnYmUnLFxuICAgIHR5cGU6ICdjb3B1bGEnLFxufVxuXG5jb25zdCBfZG86IFBhcnRpYWw8TGV4ZW1lPiA9IHtcbiAgICByb290OiAnZG8nLFxuICAgIHR5cGU6ICdodmVyYicsXG59XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBQYXJ0aWFsPExleGVtZT5bXSA9IFtcblxuICAgIGJlLFxuICAgIF9kbyxcblxuICAgIHsgX3Jvb3Q6IGJlLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEgfSxcbiAgICB7IF9yb290OiBiZSwgdG9rZW46ICdhcmUnLCBjYXJkaW5hbGl0eTogJyonIH0sIC8vVE9ETyEgMitcbiAgICB7IF9yb290OiBfZG8sIHRva2VuOiAnZG9lcycsIGNhcmRpbmFsaXR5OiAxIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ2ZpbGxlcicgLy8gZmlsbGVyIHdvcmQsIHdoYXQgYWJvdXQgcGFydGlhbCBwYXJzaW5nP1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzdWJqZWN0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlZGljYXRlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb2JqZWN0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25kaXRpb24nLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25zZXF1ZW5jZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfVxuXVxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZ1tdID0gW1xuXG4gIC8vIGdyYW1tYXJcbiAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICdjb21wbGVtZW50IGlzIHByZXBvc2l0aW9uIHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlJyxcblxuICBgY29wdWxhLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZWAsXG5cbiAgYG5vdW4tcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIGdyYW1tYXJcbiAgICAgICAgdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgXG4gICAgICAgIHRoZW4gemVybyBvciBtb3JlIGNvbXBsZW1lbnRzIGAsXG5cbiAgJ2NvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlJyxcbiAgJ3N1YmNsYXVzZSBpcyBjb3B1bGFzdWJjbGF1c2UnLFxuXG4gIGBhbmQtc2VudGVuY2UgaXMgbGVmdCBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2UgXG4gICAgICAgIHRoZW4gbm9uc3ViY29ualxuICAgICAgICB0aGVuIG9uZSBvciBtb3JlIHJpZ2h0IGFuZC1zZW50ZW5jZSBvciBjb3B1bGEtc2VudGVuY2Ugb3Igbm91bi1waHJhc2VgLFxuXG4gIGBtdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBtdmVyYlxuXHRcdHRoZW4gb2JqZWN0IG5vdW4tcGhyYXNlYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gIGBpdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBpdmVyYmAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICBgc2ltcGxlLXNlbnRlbmNlIGlzIGNvcHVsYS1zZW50ZW5jZSBvciBpdmVyYi1zZW50ZW5jZSBvciBtdmVyYi1zZW50ZW5jZWAsXG5cbiAgYGNzMiBpcyBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VcbiAgICAgIHRoZW4gc3ViY29ualxuICAgICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlYCxcblxuICBgY3MxIGlzIHN1YmNvbmogXG4gICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gZmlsbGVyIFxuICAgIHRoZW4gY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlYCxcblxuICAgYGEgYW5kIGFuIGFyZSBpbmRlZmFydHNgLFxuICAgYHRoZSBpcyBhIGRlZmFydGAsXG4gICBgaWYgYW5kIHdoZW4gYW5kIHdoaWxlIGFyZSBzdWJjb25qc2AsXG4gICBgYW55IGFuZCBldmVyeSBhbmQgYWxsIGFyZSB1bmlxdWFudHNgLFxuICAgYG9mIGFuZCBvbiBhbmQgdG8gYW5kIGZyb20gYXJlIHByZXBvc2l0aW9uc2AsXG4gICBgdGhhdCBpcyBhIHJlbHByb25gLFxuICAgYG5vdCBpcyBhIG5lZ2F0aW9uYCxcbiAgIGBpdCBpcyBhIHByb25vdW5gLFxuXG5cbiAgLy8gZG9tYWluXG4gIGBidXR0b24gaXMgYSBub3VuIGFuZCBwcm90byBvZiBpdCBpcyBIVE1MQnV0dG9uRWxlbWVudGAsXG4gIGBkaXYgaXMgYSBub3VuIGFuZCBwcm90byBvZiBpdCBpcyBIVE1MRGl2RWxlbWVudGAsXG4gIGBlbGVtZW50IGlzIGEgbm91biBhbmQgcHJvdG8gb2YgaXQgaXMgSFRNTEVsZW1lbnRgLFxuICAnY29sb3IgaXMgYSBub3VuJyxcbiAgJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFyZSBjb2xvcnMnLFxuICAnY29sb3Igb2YgYW55IGVsZW1lbnQgaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICd0ZXh0IG9mIGFueSBidXR0b24gaXMgdGV4dENvbnRlbnQgb2YgaXQnLFxuXSIsImltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBDb21wb3NpdGVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGNvbnN0aXR1ZW50VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ21hY3JvJyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAndGFnZ2VkdW5pb24nLFxuKVxuXG5leHBvcnQgY29uc3Qgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25zdGl0dWVudFR5cGVzLmNvbmNhdCgpXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bicsICdncmFtbWFyJ10sIG51bWJlcjogMSwgcm9sZTogJ3N1YmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfVxuICAgIF0sXG4gICAgJ21hY3JvcGFydCc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2FkamVjdGl2ZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2ZpbGxlciddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2dyYW1tYXInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG5cbn0iLCJpbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBnZXRLb29sIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRLb29sXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvdG9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IHBvaW50T3V0IH0gZnJvbSBcIi4vcG9pbnRPdXRcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcmVhZG9ubHkgYWN0dWF0b3IgPSBnZXRBY3R1YXRvcigpKSB7XG5cbiAgICAgICAgLy9UT0RPOiBtb3ZlIHNvbWV3aGVyZSBlbHNlXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOdW1iZXIucHJvdG90eXBlLCAnYWRkJywgeyB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IGZ1bmN0aW9uIChhOiBhbnkpIHsgcmV0dXJuIHRoaXMgKyBhIH0gfSlcblxuICAgICAgICB0aGlzLmNvbnRleHQucHJlbHVkZS5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2V0U3ludGF4KGFzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gdG9DbGF1c2UoYXN0KS5zaW1wbGVcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpKVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB3cmFwcGVycyA9IGNsYXVzZS5lbnRpdGllcy5mbGF0TWFwKGlkID0+IGdldEtvb2wodGhpcy5jb250ZXh0LCBjbGF1c2UsIGlkKSlcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC52YWx1ZXMuZm9yRWFjaCh3ID0+IHBvaW50T3V0KHcsIHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICB3cmFwcGVycy5mb3JFYWNoKHcgPT4gdyA/IHBvaW50T3V0KHcpIDogMClcblxuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVycy5mbGF0TWFwKG8gPT4gbyA/IG8udW53cmFwKCkgOiBbXSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBHZXRDb250ZXh0T3B0cywgZ2V0TmV3Q29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEJyYWluT3B0cyBleHRlbmRzIEdldENvbnRleHRPcHRzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4ob3B0czogR2V0QnJhaW5PcHRzKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbihnZXROZXdDb250ZXh0KG9wdHMpKVxufVxuIiwiaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uLy4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50T3V0KHdyYXBwZXI6IFdyYXBwZXIsIG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkge1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gd3JhcHBlci51bndyYXAoKVxuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgIH1cblxufSIsImltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL2Vudmlyby9FbnZpcm9cIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQ29udGV4dCBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN0YXRpY0Rlc2NQcmVjZWRlbmNlID0gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2VcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3ludGF4TWFwID0gdGhpcy5jb25maWcuc3ludGF4ZXNcbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMuZ2V0U3ludGF4TGlzdCgpXG4gICAgcHJvdGVjdGVkIF9sZXhlbWVzID0gdGhpcy5jb25maWcubGV4ZW1lc1xuICAgIHJlYWRvbmx5IHByZWx1ZGUgPSB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgIHJlYWRvbmx5IGdldCA9IHRoaXMuZW52aXJvLmdldFxuICAgIHJlYWRvbmx5IHNldCA9IHRoaXMuZW52aXJvLnNldFxuICAgIHJlYWRvbmx5IHF1ZXJ5ID0gdGhpcy5lbnZpcm8ucXVlcnlcbiAgICByZWFkb25seSByb290ID0gdGhpcy5lbnZpcm8ucm9vdFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvOiBFbnZpcm8sIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4ge1xuXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgICAgICAgICAgfSkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby52YWx1ZXNcbiAgICB9XG5cbiAgICBnZXRMZXhlbWUgPSAocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICAgICAgICAgIC5hdCgwKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0IHN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5bnRheExpc3RcbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHR5cGU6ICdncmFtbWFyJywgcm9vdDogc3ludGF4Lm5hbWUgfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGlmIChsZXhlbWUucm9vdCAmJiAhbGV4ZW1lLnRva2VuICYmIHRoaXMuX2xleGVtZXMuc29tZSh4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpKSB7XG4gICAgICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKGxleGVtZSlcbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKC4uLmxleGVtZS5leHRyYXBvbGF0ZSh0aGlzKSlcbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUsIGxleGVtZVR5cGVzIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3ByZWx1ZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBzeW50YXhlczogU3ludGF4TWFwXG4gICAgcmVhZG9ubHkgcHJlbHVkZTogc3RyaW5nW11cbiAgICByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzOiBsZXhlbWVzLm1hcCh4ID0+IG1ha2VMZXhlbWUoeCkpLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IEJhc2ljQ29udGV4dCBmcm9tIFwiLi9CYXNpY0NvbnRleHRcIjtcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBFbnZpcm8ge1xuXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IEFzdE5vZGUpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldExleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkXG5cbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHByZWx1ZGU6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRPcHRzIGV4dGVuZHMgR2V0RW52aXJvT3BzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3Q29udGV4dChvcHRzOiBHZXRDb250ZXh0T3B0cyk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KGdldEVudmlybyhvcHRzKSwgZ2V0Q29uZmlnKCkpXG59IiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IGdldExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZ2V0TGV4ZW1lc1wiO1xuaW1wb3J0IHsgcmVzcGFjZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9yZXNwYWNlXCI7XG5pbXBvcnQgeyBzdGRzcGFjZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zdGRzcGFjZVwiO1xuaW1wb3J0IHsgam9pbk11bHRpV29yZExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvam9pbk11bHRpV29yZExleGVtZXNcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7IC8vIFRPRE86IG1ha2UgY2FzZSBpbnNlbnNpdGl2ZVxuXG4gICAgICAgIGNvbnN0IHdvcmRzID1cbiAgICAgICAgICAgIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHN0ZHNwYWNlKHNvdXJjZUNvZGUpLCBjb250ZXh0LmxleGVtZXMpXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG4gICAgICAgICAgICAgICAgLm1hcChzID0+IHJlc3BhY2UocykpXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSB3b3Jkcy5mbGF0TWFwKHcgPT4gZ2V0TGV4ZW1lcyh3LCBjb250ZXh0LCB3b3JkcykpXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IExleGVtZU9iamVjdCBmcm9tIFwiLi9MZXhlbWVPYmplY3RcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovICByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gIHR5cGU6IExleGVtZVR5cGVcbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqLyB0b2tlbj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gIGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW11cbiAgICAvKipmb3IgcXVhbnRhZGogKi8gY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxuICAgIHByb3RvPzogc3RyaW5nXG4gICAgY29uY2VwdHM/OiBzdHJpbmdbXVxuICAgIF9yb290PzogUGFydGlhbDxMZXhlbWU+XG4gICAgZXh0cmFwb2xhdGUoY29udGV4dDogQ29udGV4dCk6IExleGVtZVtdXG4gICAgZ2V0UHJvdG8oKTogb2JqZWN0IHwgdW5kZWZpbmVkXG4gICAgcmVhZG9ubHkgaXNQbHVyYWw6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0NvbmNlcHQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc011bHRpV29yZDogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxleGVtZShkYXRhOiBQYXJ0aWFsPExleGVtZT4pOiBMZXhlbWUge1xuXG4gICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMZXhlbWVPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IExleGVtZU9iamVjdChkYXRhKVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9jb25qdWdhdGVcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXhlbWVPYmplY3QgaW1wbGVtZW50cyBMZXhlbWUgLyosIFdyYXBwZXIgKi8ge1xuXG4gICAgX3Jvb3QgPSB0aGlzLm5ld0RhdGE/Ll9yb290XG4gICAgY29udHJhY3Rpb25Gb3IgPSB0aGlzLm5ld0RhdGE/LmNvbnRyYWN0aW9uRm9yID8/IHRoaXMuX3Jvb3Q/LmNvbnRyYWN0aW9uRm9yXG4gICAgdG9rZW4gPSB0aGlzLm5ld0RhdGE/LnRva2VuID8/IHRoaXMuX3Jvb3Q/LnRva2VuXG4gICAgY2FyZGluYWxpdHkgPSB0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5ID8/IHRoaXMuX3Jvb3Q/LmNhcmRpbmFsaXR5XG4gICAgcHJvdG8gPSB0aGlzLm5ld0RhdGE/LnByb3RvID8/IHRoaXMuX3Jvb3Q/LnByb3RvXG4gICAgY29uY2VwdHMgPSB0aGlzLm5ld0RhdGE/LmNvbmNlcHRzID8/IHRoaXMuX3Jvb3Q/LmNvbmNlcHRzXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgbmV3RGF0YT86IFBhcnRpYWw8TGV4ZW1lPlxuICAgICkge1xuICAgIH1cblxuICAgIGdldCByb290KCkge1xuXG4gICAgICAgIGlmICh0aGlzLl9yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5yb290XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5uZXdEYXRhPy5yb290IGFzIGFueVxuICAgIH1cblxuICAgIGdldCB0eXBlKCk6IExleGVtZVR5cGUge1xuXG4gICAgICAgIGlmICh0aGlzLl9yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX3Jvb3QgYXMgTGV4ZW1lKS50eXBlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5uZXdEYXRhPy50eXBlIGFzIGFueVxuICAgIH1cblxuICAgIGdldCBpc1BsdXJhbCgpIHtcbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZSh0aGlzLm5ld0RhdGE/LmNhcmRpbmFsaXR5KVxuICAgIH1cblxuICAgIGdldCBpc0NvbmNlcHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzPy50eXBlID09PSAnbm91bicgJiYgKHRoaXMgYXMgYW55KS5jb25jZXB0cyAmJiAhKHRoaXMgYXMgYW55KS5wcm90b1xuICAgIH1cblxuICAgIGV4dHJhcG9sYXRlKGNvbnRleHQ6IENvbnRleHQpOiBMZXhlbWVbXSB7XG5cbiAgICAgICAgaWYgKCh0aGlzLnR5cGUgPT09ICdub3VuJyB8fCB0aGlzLnR5cGUgPT09ICdncmFtbWFyJykgJiYgIXRoaXMuaXNQbHVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7IF9yb290OiB0aGlzLCB0b2tlbjogcGx1cmFsaXplKHRoaXMucm9vdCksIGNhcmRpbmFsaXR5OiAnKicgfSldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoWydpdmVyYicsICdtdmVyYiddLmluY2x1ZGVzKHRoaXMudHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25qdWdhdGUodGhpcy5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiB4IH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZ2V0IGlzTXVsdGlXb3JkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb290LmluY2x1ZGVzKCcgJyk7XG4gICAgfVxuXG4gICAgZ2V0UHJvdG8oKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KT8uW3RoaXMucHJvdG8gYXMgYW55XT8ucHJvdG90eXBlO1xuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUodmVyYjpzdHJpbmcpe1xuICAgIHJldHVybiBbdmVyYisncyddXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY0xleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cbiAgICBjb25zdCByZWxldmFudCA9IHdvcmRzXG4gICAgICAgIC5tYXAodyA9PiBjbGF1c2VPZihtYWtlTGV4ZW1lKHsgcm9vdDogdywgdHlwZTogJ25vdW4nIH0pLCAnWCcpKVxuICAgICAgICAuZmxhdE1hcChjID0+IGNvbnRleHQucXVlcnkoYykpXG4gICAgICAgIC5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgLmZsYXRNYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpID8/IFtdKVxuICAgICAgICAuZmxhdE1hcCh4ID0+IHg/LmR5bmFtaWMoKS5mbGF0TWFwKHggPT4geC5leHRyYXBvbGF0ZShjb250ZXh0KSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LnRva2VuID09PSB3b3JkIHx8IHgucm9vdCA9PT0gd29yZClcblxuICAgIGNvbnN0IGlzTWFjcm9Db250ZXh0ID1cbiAgICAgICAgd29yZHMuc29tZSh4ID0+IGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlID09PSAnZ3JhbW1hcicpXG4gICAgICAgICYmICF3b3Jkcy5zb21lKHggPT4gWydkZWZhcnQnLCAnaW5kZWZhcnQnLCAnbm9uc3ViY29uaiddLmluY2x1ZGVzKGNvbnRleHQuZ2V0TGV4ZW1lKHgpPy50eXBlIGFzIGFueSkpLy9UT0RPOiB3aHkgZGVwZW5kZW5jaWVzKCdtYWNybycpIGRvZXNuJ3Qgd29yaz8hXG5cbiAgICBjb25zdCB0eXBlID0gcmVsZXZhbnRbMF0/LnR5cGUgPz9cbiAgICAgICAgKGlzTWFjcm9Db250ZXh0ID9cbiAgICAgICAgICAgICdncmFtbWFyJ1xuICAgICAgICAgICAgOiAnbm91bicpXG5cbiAgICByZXR1cm4gbWFrZUxleGVtZSh7IHRva2VuOiB3b3JkLCByb290OiByZWxldmFudD8uYXQoMCk/LnJvb3QgPz8gd29yZCwgdHlwZTogdHlwZSB9KVxufVxuXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5pbXBvcnQgeyBkeW5hbWljTGV4ZW1lIH0gZnJvbSBcIi4vZHluYW1pY0xleGVtZVwiXG5pbXBvcnQgeyBudW1iZXJMZXhlbWUgfSBmcm9tIFwiLi9udW1iZXJMZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCwgd29yZHM6IHN0cmluZ1tdKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ID0gY29udGV4dC5nZXRMZXhlbWUod29yZCkgPz9cbiAgICAgICAgbnVtYmVyTGV4ZW1lKHdvcmQpID8/XG4gICAgICAgIGR5bmFtaWNMZXhlbWUod29yZCwgY29udGV4dCwgd29yZHMpXG5cbiAgICByZXR1cm4gbGV4LmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4LmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgsIGNvbnRleHQsIHdvcmRzKSkgOlxuICAgICAgICBbbGV4XVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9zdGRzcGFjZVwiO1xuaW1wb3J0IHsgdW5zcGFjZSB9IGZyb20gXCIuL3Vuc3BhY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHNvdXJjZUNvZGU6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pIHtcblxuICAgIGxldCBuZXdTb3VyY2UgPSBzb3VyY2VDb2RlO1xuXG4gICAgbGV4ZW1lc1xuICAgICAgICAuZmlsdGVyKHggPT4geC5pc011bHRpV29yZClcbiAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXhlbWUgPSBzdGRzcGFjZSh4LnJvb3QpO1xuICAgICAgICAgICAgbmV3U291cmNlID0gbmV3U291cmNlLnJlcGxhY2VBbGwobGV4ZW1lLCB1bnNwYWNlKGxleGVtZSkpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBuZXdTb3VyY2U7XG59XG4iLCJpbXBvcnQgeyBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckxleGVtZSh3b3JkOiBzdHJpbmcpIHtcblxuICAgIGlmICh3b3JkLm1hdGNoKC9cXGQrLykpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VMZXhlbWUoeyByb290OiB3b3JkLCB0eXBlOiAnbm91bicsIHByb3RvOiAnTnVtYmVyJyB9KVxuICAgIH1cblxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBsdXJhbGl6ZShyb290OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcm9vdCArICdzJ1xufSIsIlxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJy0nLCAnICcpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gc3Rkc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoL1xccysvZywgJyAnKTtcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHVuc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJyAnLCAnLScpO1xufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuc3ludGF4TGlzdClcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zaW1wbGlmeShhc3QpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkge1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICghYXN0LmxpbmtzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLmNvbnRleHQuZ2V0U3ludGF4KGFzdC50eXBlKVxuXG4gICAgICAgIGlmIChzeW50YXgubGVuZ3RoID09PSAxICYmIE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNpbXBsaWZ5KE9iamVjdC52YWx1ZXMoYXN0LmxpbmtzKVswXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNpbXBsZUxpbmtzID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyhhc3QubGlua3MpXG4gICAgICAgICAgICAubWFwKGwgPT4gKHsgW2xbMF1dOiB0aGlzLnNpbXBsaWZ5KGxbMV0pIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4geyAuLi5hc3QsIGxpbmtzOiBzaW1wbGVMaW5rcyB9XG5cbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ncmFtbWFyKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIFF1ZXJ5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB5ZXMgPyB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllcyA6ICcnXG4gICAgfVxuXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICBkZXNjcmliZSA9IChpZDogSWQpOiBMZXhlbWVbXSA9PiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiB0aGlzLmNsYXVzZTEucmhlbWUuYW5kKHRoaXMuY2xhdXNlMi5yaGVtZSlcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW10ge1xuXG4gICAgICAgIGlmIChxdWVyeS5leGFjdElkcykge1xuICAgICAgICAgICAgcmV0dXJuIFttb2NrTWFwKHF1ZXJ5KV1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVuaWZ5KHFlOiBJZCwgcmU6IElkLCByZXN1bHQ6IE1hcFtdKSB7XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc29tZSh4ID0+IHhbcWVdID09PSByZSkpIHsgLy8gaWYgYWxyZWFkeSB1bmlmaWVkIGRvbid0IGRvIGl0IGFnYWluXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGkgPSByZXN1bHQuZmluZEluZGV4KHggPT4gIXhbcWVdKVxuICAgICAgICAgICAgY29uc3QgbSA9IHJlc3VsdFtpXSA/PyB7fVxuICAgICAgICAgICAgbVtxZV0gPSByZVxuICAgICAgICAgICAgcmVzdWx0W2kgPiAtMSA/IGkgOiByZXN1bHQubGVuZ3RoXSA9IG1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgcmVzdWx0OiBNYXBbXSA9IFtdXG4gICAgICAgIGNvbnN0IGl0ID0gb3B0cz8uaXQgPz8gc29ydElkcyh1bml2ZXJzZS5lbnRpdGllcykuYXQoLTEpXG5cbiAgICAgICAgcXVlcnkuZW50aXRpZXMuZm9yRWFjaChxZSA9PiB7XG4gICAgICAgICAgICB1bml2ZXJzZS5lbnRpdGllcy5mb3JFYWNoKHJlID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJkID0gdW5pdmVyc2UuYWJvdXQocmUpLmZsYXRMaXN0KClcbiAgICAgICAgICAgICAgICBjb25zdCBxZCA9IHF1ZXJ5LmFib3V0KHFlKS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAgICAgY29uc3QgcmQyID0gcmQubWFwKHggPT4geC5jb3B5KHsgbWFwOiB7IFtyZV06IHFlIH0gfSkpIC8vIHN1YnNpdHV0ZSByZSBieSBxZSBpbiByZWFsIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcmQyID0gIHJkXG5cbiAgICAgICAgICAgICAgICAvLyBjb21wYXJlIGVhY2ggcmQyIHRvIGVhY2ggcWQsIGlmIHByZWRpY2F0ZSBpcyBzYW1lIHJlcGxhY2UgciBhcmdzIHdpdGggcSBhcmdzXG4gICAgICAgICAgICAgICAgcmQyLmZvckVhY2goKHIsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcWQuZm9yRWFjaChxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLnByZWRpY2F0ZSA9PT0gcS5wcmVkaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtOiBNYXAgPSAoci5hcmdzID8/IFtdKS5tYXAoKGEsIGkpID0+ICh7IFthXTogcS5hcmdzPy5baV0gPz8gYSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZDJbaV0gPSByLmNvcHkoeyBtYXA6IG0gfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyLnRvU3RyaW5nKCksICdtYXkgYmUgJywgcS50b1N0cmluZygpLCAnciBiZWNvbWVzJywgcmQyW2ldLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGNvbnN0IHFoYXNoZXMgPSBxZC5tYXAoeCA9PiB4Lmhhc2hDb2RlKVxuICAgICAgICAgICAgICAgIGNvbnN0IHIyaGFzaGVzID0gcmQyLm1hcCh4ID0+IHguaGFzaENvZGUpXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVW5pZnkgb3Igbm90PycsICdxZD0nLCBxZC5tYXAoeD0+eC50b1N0cmluZygpKSwgJ3JkMj0nLCByZDIubWFwKHg9PngudG9TdHJpbmcoKSkpXG5cbiAgICAgICAgICAgICAgICBpZiAocWhhc2hlcy5ldmVyeSh4ID0+IHIyaGFzaGVzLmluY2x1ZGVzKHgpKSkgeyAvLyBxZSB1bmlmaWVzIHdpdGggcmUhXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHFlLCAnaXMnLCByZSwgJyEnKVxuICAgICAgICAgICAgICAgICAgICB1bmlmeShxZSwgcmUsIHJlc3VsdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXQgJiYgcWQuc29tZSh4ID0+IHgucHJlZGljYXRlPy50eXBlID09PSAncHJvbm91bicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaWZ5KHFlLCBpdCwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpIHtcblxuICAgICAgICBjb25zdCBjMSA9IHRoaXMuY2xhdXNlMS5zaW1wbGVcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLmNsYXVzZTIuc2ltcGxlXG5cbiAgICAgICAgaWYgKGMyLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMxXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYzEuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzJcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoeyBjbGF1c2UxOiBjMSwgY2xhdXNlMjogYzIgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShcbiAgICAgICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSA/IHRoaXMgOiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkgPSBxdWVyeS5mbGF0TGlzdCgpWzBdIC8vVE9ETyEhPz8/XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBCYXNpY0NsYXVzZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHF1ZXJ5LnByZWRpY2F0ZS5yb290ICE9PSB0aGlzLnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IHF1ZXJ5LmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IEVtcHR5Q2xhdXNlIGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM/OiBib29sZWFuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxuICAgIGV4YWN0SWRzPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlID0+IHRoaXNcbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gb3RoZXJcbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBjb25jbHVzaW9uXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbXVxuICAgIGFib3V0ID0gKGlkOiBJZCk6IENsYXVzZSA9PiB0aGlzXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCk6IExleGVtZVtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25zZXF1ZW5jZTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uc3ViamNvbmogPz8gdGhpcy5zdWJqY29uaixcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMgICBcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIC8vIHJldHVybiBlbXB0eUNsYXVzZSAvLy9UT0RPISEhISEhISFcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi8uLi8uLi9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLb29sKGNvbnRleHQ6IENvbnRleHQsIGNsYXVzZTogQ2xhdXNlLCBsb2NhbElkOiBJZCk6IFdyYXBwZXJbXSB7XG5cbiAgICBjb25zdCBvd25lcklkcyA9IGNsYXVzZS5vd25lcnNPZihsb2NhbElkKSAvLyAwIG9yIDEgb3duZXIocylcblxuICAgIGlmIChvd25lcklkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkoY2xhdXNlKVxuICAgICAgICByZXR1cm4gbWFwcy5tYXAoeCA9PiB4W2xvY2FsSWRdKS5mbGF0TWFwKHggPT4gY29udGV4dC5nZXQoeCkgPz8gW10pXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZXIgPSBnZXRLb29sKGNvbnRleHQsIGNsYXVzZSwgb3duZXJJZHNbMF0pXG4gICAgcmV0dXJuIG93bmVyLmZsYXRNYXAoeCA9PiB4LmdldChjbGF1c2UuYWJvdXQobG9jYWxJZCkpID8/IFtdKVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5pbXBvcnQgeyB0b0NvbnN0IH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy90b0NvbnN0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBbGxWYXJzKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHsgLy8gY2FzZSBpbnNlbnNpdGl2ZSBuYW1lcywgaWYgb25lIHRpbWUgdmFyIGFsbCB2YXJzIVxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi9JbXBseVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbHkoY2xhdXNlOiBDbGF1c2UpIHsgLy8gYW55IGNsYXVzZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbHlcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5yaGVtZSA9PT0gZW1wdHlDbGF1c2UpIHtcbiAgICAgICAgcmV0dXJuIGNsYXVzZVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UuZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKSB8fCBjbGF1c2UuZmxhdExpc3QoKS5zb21lKHggPT4geC5wcmVkaWNhdGUgPyB4LnByZWRpY2F0ZS5pc1BsdXJhbCA6IGZhbHNlKSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlLnRoZW1lLmltcGxpZXMoY2xhdXNlLnJoZW1lKVxuICAgIH1cblxuICAgIHJldHVybiBjbGF1c2Vcbn1cbiIsImltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9pZC9NYXBcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG1vY2tNYXAoY2xhdXNlOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBjbGF1c2UuZW50aXRpZXMubWFwKGUgPT4gKHsgW2VdOiBlIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5cbi8vVE9ETzogY29uc2lkZXIgbW92aW5nIHRvIENsYXVzZS5jb3B5KHtuZWdhdGV9KSAhISEhIVxuZXhwb3J0IGZ1bmN0aW9uIG5lZ2F0ZShjbGF1c2U6IENsYXVzZSwgbmVnYXRlOiBib29sZWFuKSB7XG5cbiAgICBpZiAoIW5lZ2F0ZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgY2xhdXNlMTogY2xhdXNlLnRoZW1lLnNpbXBsZSwgY2xhdXNlMjogY2xhdXNlLnJoZW1lLnNpbXBsZS5jb3B5KHsgbmVnYXRlIH0pIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBhbnl0aGluZyBvd25lZCBieSBhIHZhciBzaG91bGQgYmUgYWxzbyBiZSBhIHZhclxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtID0gY2xhdXNlLnRoZW1lLnF1ZXJ5KGNsYXVzZS5yaGVtZSlbMF1cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gPz8ge30gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi90b1ZhclwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBHZXRJbmNyZW1lbnRhbElkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQob3B0cz86IEdldEluY3JlbWVudGFsSWRPcHRzKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZDtcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBtYWtlQWxsVmFycyB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VBbGxWYXJzXCJcbmltcG9ydCB7IG1ha2VJbXBseSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL21ha2VJbXBseVwiXG5pbXBvcnQgeyBuZWdhdGUgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9uZWdhdGVcIlxuaW1wb3J0IHsgcHJvcGFnYXRlVmFyc093bmVkIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkXCJcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL3Jlc29sdmVBbmFwaG9yYVwiXG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvdG9WYXJcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9pZC9JZFwiXG5cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybignQXN0IGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoYXN0LmxleGVtZSkge1xuXG4gICAgICAgIGlmIChhc3QubGV4ZW1lLnR5cGUgPT09ICdub3VuJyB8fCBhc3QubGV4ZW1lLnR5cGUgPT09ICdhZGplY3RpdmUnIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ3Byb25vdW4nIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ2dyYW1tYXInKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xhdXNlT2YoYXN0LmxleGVtZSwgLi4uYXJncz8uc3ViamVjdCA/IFthcmdzPy5zdWJqZWN0XSA6IFtdKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG5cbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGFzdC5saXN0Lm1hcChjID0+IHRvQ2xhdXNlKGMsIGFyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UpXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuICAgIGxldCByZWxcblxuICAgIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGlzQ29wdWxhU2VudGVuY2UoYXN0KSkge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8ubm9uc3ViY29uaikge1xuICAgICAgICByZXN1bHQgPSBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKHJlbCA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZSB8fCBhc3QubGlua3M/Lm12ZXJiPy5sZXhlbWUgfHwgYXN0LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlbGF0aW9uVG9DbGF1c2UoYXN0LCByZWwsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmNvbmopIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMCA9IGFzdC5saW5rcz8ubm9uc3ViY29uaiA/IHJlc3VsdCA6IG1ha2VJbXBseShyZXN1bHQpXG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMoYzApXG4gICAgICAgIGNvbnN0IGMyID0gcmVzb2x2ZUFuYXBob3JhKGMxKVxuICAgICAgICBjb25zdCBjMyA9IHByb3BhZ2F0ZVZhcnNPd25lZChjMilcbiAgICAgICAgY29uc3QgYzQgPSBuZWdhdGUoYzMsICEhYXN0Py5saW5rcz8ubmVnYXRpb24pXG4gICAgICAgIGNvbnN0IGM1ID0gYzQuY29weSh7IHNpZGVFZmZlY3R5OiBjNC5yaGVtZSAhPT0gZW1wdHlDbGF1c2UgfSlcbiAgICAgICAgcmV0dXJuIGM1XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJyR7YXN0LnR5cGV9JyFgKVxuXG59XG5cbmNvbnN0IGlzQ29wdWxhU2VudGVuY2UgPSAoYXN0PzogQXN0Tm9kZSkgPT4gISFhc3Q/LmxpbmtzPy5jb3B1bGFcblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG5cbiAgICByZXR1cm4gc3ViamVjdC5hbmQocHJlZGljYXRlLCB7IGFzUmhlbWU6IHRydWUgfSlcbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuICAgIHJldHVybiB0b0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBvcHRzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IGFyZ3MgPSB7IHN1YmplY3Q6IHN1YmplY3RJZCB9XG5cbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhub3VuUGhyYXNlLmxpbmtzID8/IHt9KVxuICAgICAgICAubWFwKHggPT4gdG9DbGF1c2UoeCwgYXJncykpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG59XG5cbmZ1bmN0aW9uIHJlbGF0aW9uVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCByZWw6IExleGVtZSwgb3B0cz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqSWQgPSBvcHRzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG5cbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmpJZCB9KVxuICAgIGNvbnN0IG9iamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ub2JqZWN0LCB7IHN1YmplY3Q6IG9iaklkIH0pXG5cbiAgICBjb25zdCBhcmdzID0gb2JqZWN0ID09PSBlbXB0eUNsYXVzZSA/IFtzdWJqSWRdIDogW3N1YmpJZCwgb2JqSWRdXG4gICAgY29uc3QgcmVsYXRpb24gPSBjbGF1c2VPZihyZWwsIC4uLmFyZ3MpXG4gICAgY29uc3QgcmVsYXRpb25Jc1JoZW1lID0gc3ViamVjdCAhPT0gZW1wdHlDbGF1c2VcblxuICAgIHJldHVybiBzdWJqZWN0XG4gICAgICAgIC5hbmQob2JqZWN0KVxuICAgICAgICAuYW5kKHJlbGF0aW9uLCB7IGFzUmhlbWU6IHJlbGF0aW9uSXNSaGVtZSB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJjb25qID0gYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWVcbiAgICBjb25zdCBjb25kaXRpb24gPSB0b0NsYXVzZShhc3QubGlua3M/LmNvbmRpdGlvbiwgYXJncylcbiAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uc2VxdWVuY2UsIGFyZ3MpXG4gICAgcmV0dXJuIGNvbmRpdGlvbi5pbXBsaWVzKGNvbnNlcXVlbmNlKS5jb3B5KHsgc3ViamNvbmo6IHN1YmNvbmogfSlcblxufVxuXG5mdW5jdGlvbiBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5sZWZ0LCBhcmdzKVxuICAgIGNvbnN0IHJpZ2h0ID0gdG9DbGF1c2UoYXN0Py5saW5rcz8ucmlnaHQ/Lmxpc3Q/LlswXSwgYXJncylcblxuICAgIGlmIChhc3QubGlua3M/LmxlZnQ/LnR5cGUgPT09IGFzdC5saW5rcz8ucmlnaHQ/LnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQuYW5kKHJpZ2h0KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJcblxuZXhwb3J0IGZ1bmN0aW9uIGFsbEtleXMob2JqZWN0OiBvYmplY3QsIGl0ZXIgPSA1KSB7XG5cbiAgICBsZXQgb2JqID0gb2JqZWN0XG4gICAgbGV0IHJlczogc3RyaW5nW10gPSBbXVxuXG4gICAgd2hpbGUgKG9iaiAmJiBpdGVyKSB7XG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5rZXlzKG9iaildXG4gICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaildXG4gICAgICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopXG4gICAgICAgIGl0ZXItLVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbn0iLCJleHBvcnQgZnVuY3Rpb24gZGVlcENvcHkob2JqZWN0OiBvYmplY3QpIHtcblxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gb2JqZWN0LmNsb25lTm9kZSgpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gb2JqZWN0LmlubmVySFRNTFxuICAgICAgICByZXR1cm4gd3JhcHBlZFxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IC4uLm9iamVjdCB9XG4gICAgfVxuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdGFnTmFtZUZyb21Qcm90byB9IGZyb20gXCIuL3RhZ05hbWVGcm9tUHJvdG9cIlxuXG4vKipcbiAqIFxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGFuIG9iamVjdCAoZXZlbiBIVE1MRWxlbWVudCkgZnJvbSBhIHByb3RvdHlwZS5cbiAqIEluIGNhc2UgaXQncyBhIG51bWJlciwgbm8gbmV3IGluc3RhbmNlIGlzIG1hZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdJbnN0YW5jZShwcm90bzogb2JqZWN0LCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgaWYgKHByb3RvID09PSBOdW1iZXIucHJvdG90eXBlKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGFyZ3NbMF0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKSA6XG4gICAgICAgIG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvciguLi5hcmdzKVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIlxuLyoqXG4gKiBUcnkgZ2V0dGluZyB0aGUgbmFtZSBvZiBhbiBodG1sIGVsZW1lbnQgZnJvbSBhIHByb3RvdHlwZVxuICovXG5leHBvcnQgY29uc3QgdGFnTmFtZUZyb21Qcm90byA9ICh4OiBvYmplY3QpID0+IHguY29uc3RydWN0b3IubmFtZVxuICAgIC5yZXBsYWNlKCdIVE1MJywgJycpXG4gICAgLnJlcGxhY2UoJ0VsZW1lbnQnLCAnJylcbiAgICAudG9Mb3dlckNhc2UoKVxuIiwiXG4vKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYSBsaXN0IG9mIHByaW1pdGl2ZXMgKG51bWJlcnMsIGJvb2xzLCBzdHJpbmdzKS5cbiAqIENhcmVmdWwgdXNpbmcgdGhpcyB3aXRoIG9iamVjdHMuXG4gKi9cbmV4cG9ydCBjb25zdCB1bmlxID0gKHg6IGFueVtdKSA9PiBBcnJheS5mcm9tKG5ldyBTZXQoeCkpXG4iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vc3JjL2ZhY2FkZS9icmFpbi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL3NyYy9mYWNhZGUvYnJhaW4vQnJhaW5cIlxuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuICAgIHRlc3QxOCxcbiAgICB0ZXN0MTksXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG4gICAgdGVzdDI2LFxuICAgIHRlc3QyNyxcbiAgICB0ZXN0MjgsXG4gICAgdGVzdDI5LFxuICAgIHRlc3QzMCxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHRlc3QoKVxuICAgICAgICBjb25zb2xlLmxvZyhgJWMke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbCd9ICR7dGVzdC5uYW1lfWAsIGBjb2xvcjoke3N1Y2Nlc3MgPyAnZ3JlZW4nIDogJ3JlZCd9YClcbiAgICAgICAgYXdhaXQgc2xlZXAoMTApLy83NVxuICAgICAgICBjbGVhcigpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdyZWQnKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgndyBhbmQgeiBhcmUgYmxhY2snKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDRcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5JylcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGUoJ3knKVswXSlcbn1cblxuZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbiBhbmQgaXQgaXMgZ3JlZW4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyByZWQuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIG5vdCBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdXG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggY2xpY2tzJylcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG59XG5cbmZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSByZWQgYnV0dG9uIGlzIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4gaWYgeCBpcyByZWQgdGhlbiB5IGlzIGEgZ3JlZW4gYnV0dG9uJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbiBpZiB4IGlzIHJlZCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDIxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gY29sb3Igb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgcmVkLiBldmVyeSByZWQgaXMgYSBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpXG4gICAgbGV0IGNsaWNrcyA9ICcnXG4gICAgYnJhaW4uZXhlY3V0ZSgneCcpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3gnXG4gICAgYnJhaW4uZXhlY3V0ZSgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgYnV0dG9uIGNsaWNrcycpXG4gICAgcmV0dXJuIGNsaWNrcyA9PT0gJ3h5J1xufVxuXG5mdW5jdGlvbiB0ZXN0MjUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIHJlZCBhbmQgeSBpcyBibHVlJylcbiAgICBicmFpbi5leGVjdXRlKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgnYnV0dG9ucyBhcmUgcmVkJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QyNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZC4geiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMgYXJlIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibHVlJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdibGFjaycpLmxlbmd0aCA9PT0gMlxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2JvcmRlciBvZiBzdHlsZSBvZiB4IGlzIGRvdHRlZC15ZWxsb3cnKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJvcmRlci5pbmNsdWRlcygnZG90dGVkIHllbGxvdycpXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MjkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIDEgYW5kIHkgaXMgMicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhZGRzIHknKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdpdCcpWzBdID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QzMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJz0gIGlzIGEgY29wdWxhJylcbiAgICBicmFpbi5leGVjdXRlKCd4ID0gcmVkIGJ1dHRvbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xufVxuXG5mdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgY29uc3QgeCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JvZHknKVxuICAgIGRvY3VtZW50LmJvZHkgPSB4XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9