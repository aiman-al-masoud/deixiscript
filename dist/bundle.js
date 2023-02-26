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
        return nested !== undefined ? q.copy({ map: { [oc[0]]: this.id } }) : Clause_1.emptyClause;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTTtJQUNYLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLO0FBQzNELENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxTQUFpQjtJQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO0lBQ3pDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLEtBQUs7SUFDVixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUN4QyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDckIsQ0FBQzs7Ozs7OztVQ2hVRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL0NyZWF0ZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9DcmVhdGVMZXhlbWVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdGlvbnMvRWRpdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9JZkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9NdWx0aUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9SZWxhdGlvbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9TZXRBbGlhc0FjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0aW9ucy9XaGVuQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvYWN0dWF0b3IvQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvQmFzZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3dyYXBwZXIvV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvd3JhcHBlci90eXBlT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9icmFpbi9wb2ludE91dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9jb250ZXh0L0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lT2JqZWN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2R5bmFtaWNMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvZ2V0TGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9udW1iZXJMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcGx1cmFsaXplLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3Jlc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvc3Rkc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvdW5zcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQW5kLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2wudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL21vY2tNYXAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvbmVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3Byb3BhZ2F0ZVZhcnNPd25lZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lzVmFyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy90b0NvbnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy90b1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS90b0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2FsbEtleXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9kZWVwQ29weS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2dldE5lc3RlZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9uZXdJbnN0YW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3NldE5lc3RlZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdGFnTmFtZUZyb21Qcm90by50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcblxuXG4oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGF1dG90ZXN0ZXIoKVxuICAgIG1haW4oKVxufSkoKSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBuZXdJbnN0YW5jZSB9IGZyb20gXCIuLi8uLi91dGlscy9uZXdJbnN0YW5jZVwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2U/LmFyZ3M/LlswXSBhcyBJZFxuICAgICAgICBjb25zdCBpZCA9IGNvbnRleHQucXVlcnkodGhpcy50b3BMZXZlbC50aGVtZSk/LlswXT8uW2xvY2FsSWRdID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcblxuICAgICAgICBpZiAoIXByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5nZXQoaWQpPy5pcyhwcmVkaWNhdGUpKSB7ICAvLyAgZXhpc3RlbmNlIGNoZWNrIHByaW9yIHRvIGNyZWF0aW5nXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3RvID0gcHJlZGljYXRlLmdldFByb3RvKClcblxuICAgICAgICBpZiAoIXByb3RvKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG8gPSBuZXdJbnN0YW5jZShwcm90bywgcHJlZGljYXRlLnJvb3QpXG4gICAgICAgIGluaXQobywgY29udGV4dCwgaWQpXG4gICAgICAgIGNvbnRleHQuc2V0KGlkLCBvKS5zZXQocHJlZGljYXRlKVxuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGluaXQobzogb2JqZWN0LCBjb250ZXh0OiBDb250ZXh0LCBpZDogSWQpIHtcblxuICAgIGlmIChvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgby5pZCA9IGlkICsgJydcbiAgICAgICAgby50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICBjb250ZXh0LnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgfVxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUxleGVtZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBpZiAoIWNvbnRleHQubGV4ZW1lVHlwZXMuaW5jbHVkZXModGhpcy5jbGF1c2UucHJlZGljYXRlPy5yb290IGFzIGFueSkgJiYgIXRoaXMudG9wTGV2ZWwucmhlbWUuZmxhdExpc3QoKS5zb21lKHggPT4geC5wcmVkaWNhdGU/LmlzQ29uY2VwdCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUoKHRoaXMuY2xhdXNlLmFyZ3MgYXMgYW55KVswXSlbMF0ucm9vdCAvL1RPRE86IGNvdWxkIGJlIHVuZGVmaW5lZCAgICAgICAgXG4gICAgICAgIGNvbnN0IHR5cGUgPSAoY29udGV4dC5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0aGlzLmNsYXVzZS5wcmVkaWNhdGU/LnJvb3QgYXMgYW55KSA/IHRoaXMuY2xhdXNlLnByZWRpY2F0ZT8ucm9vdCA6ICdhZGplY3RpdmUnKSBhcyBMZXhlbWVUeXBlXG4gICAgICAgIGNvbnN0IGNvbmNlcHRzID0gdHlwZSA9PT0gJ25vdW4nID8gW10gOiB0eXBlID09PSAnYWRqZWN0aXZlJyA/IFt0aGlzLmNsYXVzZS5wcmVkaWNhdGU/LnJvb3RdLmZsYXRNYXAoeCA9PiB4ID8/IFtdKS5maWx0ZXIoeCA9PiB4ICE9PSBuYW1lKS8qIEhFRUVFRUVFRVJFICovIDogdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IHJlcyA9IHRoaXMudG9wTGV2ZWwucXVlcnkoJCgncHJvdG8nLCAnWCcpKS5hdCgwKT8uWydYJ11cbiAgICAgICAgY29uc3QgcHJvdG8gPSByZXMgPyB0aGlzLnRvcExldmVsLmRlc2NyaWJlKHJlcykubWFwKHggPT4geC5yb290KS5maWx0ZXIoeCA9PiB4ICE9PSAncHJvdG8nKVswXSA6IHVuZGVmaW5lZFxuXG5cblxuICAgICAgICBjb25zdCBsZXhlbWUgPSBtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgcHJvdG86IHByb3RvLFxuICAgICAgICAgICAgY29uY2VwdHM6IGNvbmNlcHRzXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29udGV4dC5zZXRMZXhlbWUobGV4ZW1lKVxuXG4gICAgfVxuXG59XG5cblxuY29uc3QgJCA9IChwOiBzdHJpbmcsIC4uLmFyZ3M6IElkW10pID0+IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiBwLCB0eXBlOiAnbm91bicgfSksIC4uLmFyZ3MpIiwiaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRLb29sIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRLb29sXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuICAgICAgICBjb25zdCBzZWFyY2hTcGFjZSA9IHRoaXMudG9wTGV2ZWwudGhlbWVcblxuICAgICAgICBpZiAoIWxvY2FsSWQgfHwgIXByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gZ2V0S29vbChjb250ZXh0LCBzZWFyY2hTcGFjZSwgbG9jYWxJZClbMF0gPz8gY29udGV4dC5zZXQoZ2V0SW5jcmVtZW50YWxJZCgpKVxuICAgICAgICB3cmFwcGVyLnNldChwcmVkaWNhdGUsIHsgbmVnYXRlZDogdGhpcy5jbGF1c2UubmVnYXRlZCB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElmQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmIChjb250ZXh0LnF1ZXJ5KHRoaXMuY2xhdXNlLnRoZW1lKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2xhdXNlLnJoZW1lLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG5cblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuXG4gICAgICAgIGNvbnRleHQucXVlcnkoY29uZGl0aW9uKS5mb3JFYWNoKG0gPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNsYXVzZS5jb3B5KHsgbWFwOiBtLCBleGFjdElkczogdHJ1ZSB9KVxuICAgICAgICAgICAgY29uc3QgY29uc2VxID0gdG9wLnJoZW1lXG4gICAgICAgICAgICBjb25zdCBjbGF1c2VzID0gY29uc2VxLmZsYXRMaXN0KClcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2VzLm1hcChjID0+IGdldEFjdGlvbihjLCB0b3ApKVxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGEgPT4gYS5ydW4oY29udGV4dCkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0S29vbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aW9uQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSAodGhpcy5jbGF1c2UuYXJncyA/PyBbXSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiBnZXRLb29sKGNvbnRleHQsIHRoaXMudG9wTGV2ZWwudGhlbWUsIHgpWzBdKVxuXG4gICAgICAgIGlmICghdGhpcy5jbGF1c2UucHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhcmdzWzBdXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGFyZ3NbMV1cblxuICAgICAgICBjb25zdCByZXMgPSBzdWJqZWN0Py5zZXQodGhpcy5jbGF1c2UucHJlZGljYXRlLCB7IGFyZ3M6IG9iamVjdCA/IFtvYmplY3RdIDogW10gfSlcblxuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNldChnZXRJbmNyZW1lbnRhbElkKCksIHJlcylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi93cmFwcGVyL1dyYXBwZXJcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldEFsaWFzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5jbGF1c2UudGhlbWVcbiAgICAgICAgY29uc3QgY29uc2VxdWVuY2UgPSB0aGlzLmNsYXVzZS5yaGVtZVxuXG4gICAgICAgIGNvbnN0IHRvcCA9IGdldFRvcExldmVsKGNvbmRpdGlvbilbMF0gLy9UT0RPICghQVNTVU1FISkgc2FtZSBhcyB0b3AgaW4gY29uY2x1c2lvblxuICAgICAgICBjb25zdCBhbGlhcyA9IGdldE93bmVyc2hpcENoYWluKGNvbmRpdGlvbiwgdG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGdldE93bmVyc2hpcENoYWluKGNvbnNlcXVlbmNlLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IGNvbmNlcHROYW1lID0gYWxpYXMubWFwKHggPT4gY29uZGl0aW9uLmRlc2NyaWJlKHgpWzBdKSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lIG5hbWVcbiAgICAgICAgY29uc3QgcHJvcHNOYW1lcyA9IHByb3BzLm1hcCh4ID0+IGNvbnNlcXVlbmNlLmRlc2NyaWJlKHgpWzBdKSAvLyBzYW1lIC4uLlxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSBjb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuXG4gICAgICAgIHdyYXAoZ2V0SW5jcmVtZW50YWxJZCgpLCBwcm90b05hbWUuZ2V0UHJvdG8oKSkuc2V0KGNvbmNlcHROYW1lWzBdLCB7IGFsaWFzUGF0aDogcHJvcHNOYW1lcyB9KVxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaGVuQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoY29udGV4dC5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGF1c2UucmhlbWUuZmxhdExpc3QoKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIDEwMClcblxuICAgIH1cblxufSIsImltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCJcbmltcG9ydCBFZGl0QWN0aW9uIGZyb20gXCIuL0VkaXRBY3Rpb25cIlxuaW1wb3J0IFJlbGF0aW9uQWN0aW9uIGZyb20gXCIuL1JlbGF0aW9uQWN0aW9uXCJcbmltcG9ydCBTZXRBbGlhc0FjdGlvbiBmcm9tIFwiLi9TZXRBbGlhc0FjdGlvblwiXG5pbXBvcnQgTXVsdGlBY3Rpb24gZnJvbSBcIi4vTXVsdGlBY3Rpb25cIlxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIlxuaW1wb3J0IElmQWN0aW9uIGZyb20gXCIuL0lmQWN0aW9uXCJcbmltcG9ydCBXaGVuQWN0aW9uIGZyb20gXCIuL1doZW5BY3Rpb25cIlxuaW1wb3J0IENyZWF0ZUxleGVtZUFjdGlvbiBmcm9tIFwiLi9DcmVhdGVMZXhlbWVBY3Rpb25cIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0ltcGx5XCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9uKGNsYXVzZTogQ2xhdXNlLCB0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uIHtcblxuICAgIC8vIGNvbnNvbGUubG9nKHRvcExldmVsLnRvU3RyaW5nKCkpXG5cbiAgICBpZiAodG9wTGV2ZWwuZmxhdExpc3QoKS5zb21lKHggPT4geC5wcmVkaWNhdGU/LnR5cGUgPT09ICdncmFtbWFyJylcbiAgICAgICAgfHwgdG9wTGV2ZWwucmhlbWUuZmxhdExpc3QoKS5zb21lKHggPT4geC5wcmVkaWNhdGU/LmlzQ29uY2VwdCkpIHtcblxuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUxleGVtZUFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIC8vIFRPRE86IHByZXBvc2l0aW9ucywgYW5kIGJlIGJld2FyZSBvZiAnb2YnIFxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnaXZlcmInIHx8IGNsYXVzZS5wcmVkaWNhdGU/LnR5cGUgPT09ICdtdmVyYicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWxhdGlvbkFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy5wcm90bykge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2UudGhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS50aGVtZS5vd25lcnNPZihlKS5sZW5ndGgpICYmIGNsYXVzZS5yaGVtZS5lbnRpdGllcy5zb21lKGUgPT4gY2xhdXNlLnJoZW1lLm93bmVyc09mKGUpLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXRBbGlhc0FjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ2lmJykge1xuICAgICAgICByZXR1cm4gbmV3IElmQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnN1Ympjb25qPy5yb290ID09PSAnd2hlbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXaGVuQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogYW55W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9ucy9nZXRBY3Rpb25cIjtcbmltcG9ydCB7IEFjdHVhdG9yIH0gZnJvbSBcIi4vQWN0dWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IGFueVtdIHtcblxuICAgICAgICBjb25zdCBhY3Rpb25zID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4gZ2V0QWN0aW9uKHgsIGNsYXVzZSkpXG4gICAgICAgIHJldHVybiBhY3Rpb25zLmZsYXRNYXAoYSA9PiBhLnJ1bihjb250ZXh0KT8/W10pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgd3JhcCB9IGZyb20gXCIuLi93cmFwcGVyL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXQgPSAoaWQ6IElkLCBvYmplY3Q/OiBvYmplY3QpOiBXcmFwcGVyID0+IHtcbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IHBsYWNlaG9sZGVyPy5jb3B5KHsgb2JqZWN0OiBvYmplY3QgfSkgPz8gd3JhcChpZCwgb2JqZWN0KVxuICAgIH1cblxuICAgIHF1ZXJ5ID0gKHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLnZhbHVlc1xuICAgICAgICAgICAgLm1hcCh3ID0+IHcudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiB1bml2ZXJzZS5xdWVyeShxdWVyeSwgeyBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL3dyYXBwZXIvV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBvYmplY3QpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIHJlYWRvbmx5IHZhbHVlczogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgQ29weU9wdHMsIFNldE9wcyB9IGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBhbGxLZXlzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2FsbEtleXNcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWxcIjtcbmltcG9ydCB7IHR5cGVPZiB9IGZyb20gXCIuL3R5cGVPZlwiO1xuaW1wb3J0IHsgZGVlcENvcHkgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZGVlcENvcHlcIjtcbmltcG9ydCB7IHNldE5lc3RlZCB9IGZyb20gXCIuLi8uLi91dGlscy9zZXROZXN0ZWRcIjtcbmltcG9ydCB7IGdldE5lc3RlZCB9IGZyb20gXCIuLi8uLi91dGlscy9nZXROZXN0ZWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IGFsaWFzZXM6IHsgW2FsaWFzOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0gdGhpcy5vYmplY3Q/LmFsaWFzZXMgPz8ge31cbiAgICByZWFkb25seSBwcmVkaWNhdGVzOiBMZXhlbWVbXSA9IFtdXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgb2JqZWN0OiBhbnksXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcmVhZG9ubHkgaXNQbGFjZWhvbGRlcjogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgcGFyZW50PzogV3JhcHBlcixcbiAgICAgICAgcmVhZG9ubHkgbmFtZT86IHN0cmluZ1xuICAgICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5hbGlhc2VzID0gdGhpcy5hbGlhc2VzXG4gICAgICAgIH0gY2F0Y2ggeyB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmFsaWFzZXNbcHJlZGljYXRlLmNvbmNlcHRzPy5hdCgwKSA/PyAnJ11cblxuICAgICAgICByZXR1cm4gcGF0aCA/XG4gICAgICAgICAgICBnZXROZXN0ZWQodGhpcy5vYmplY3QsIHBhdGgpID09PSBwcmVkaWNhdGUucm9vdCA6XG4gICAgICAgICAgICB0aGlzLnByZWRpY2F0ZXMubWFwKHggPT4geC5yb290KS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdClcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRBbGlhcyhhbGlhczogTGV4ZW1lLCBwYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFsaWFzZXNbYWxpYXMucm9vdF0gPSBwYXRoLm1hcCh4ID0+IHgucm9vdClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgY2FsbCh2ZXJiOiBMZXhlbWUsIGFyZ3M6IFdyYXBwZXJbXSkgey8vVE9ETzogYWxpYXNcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0W3ZlcmIucm9vdF0oLi4uYXJncy5tYXAoeCA9PiB4LnVud3JhcCgpKSlcbiAgICB9XG5cbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSkge1xuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmFsaWFzZXMpXG4gICAgICAgICAgICAubWFwKGsgPT4gZ2V0TmVzdGVkKHRoaXMub2JqZWN0LCB0aGlzLmFsaWFzZXNba10pKVxuICAgICAgICAgICAgLm1hcCh4ID0+IG1ha2VMZXhlbWUoeyByb290OiB4LCB0eXBlOiAnYWRqZWN0aXZlJyB9KSlcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5wcmVkaWNhdGVzKVxuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHRoaXMuaWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmFuZCh0aGlzLmV4dHJhSW5mbyhxdWVyeSA/PyBlbXB0eUNsYXVzZSkpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZXh0cmFJbmZvKHE6IENsYXVzZSkge1xuXG4gICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4ocSwgZ2V0VG9wTGV2ZWwocSlbMF0pXG4gICAgICAgIGNvbnN0IHBhdGggPSBvYy5mbGF0TWFwKHggPT4gcS5kZXNjcmliZSh4KSkuZmlsdGVyKHggPT4geC50eXBlID09PSAnbm91bicpLm1hcCh4ID0+IHgucm9vdCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgbmVzdGVkID0gZ2V0TmVzdGVkKHRoaXMub2JqZWN0LCB0aGlzLmFsaWFzZXM/LltwYXRoPy5bMF1dID8/IHBhdGgpXG4gICAgICAgIHJldHVybiBuZXN0ZWQgIT09IHVuZGVmaW5lZCA/IHEuY29weSh7IG1hcDogeyBbb2NbMF1dOiB0aGlzLmlkIH0gfSkgOiBlbXB0eUNsYXVzZVxuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuICAgICAgICBpZiAob3B0cz8uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHMuYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzPy5hbGlhc1BhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEFsaWFzKHByZWRpY2F0ZSwgb3B0cy5hbGlhc1BhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdHlwZW9mIHRoaXMub2JqZWN0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnVud3JhcCgpW3RoaXMubmFtZSFdID0gcHJlZGljYXRlLnJvb3RcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TXVsdGlQcm9wKHByZWRpY2F0ZSwgb3B0cylcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRNdWx0aVByb3AodmFsdWU6IExleGVtZSwgb3B0cz86IFNldE9wcykge1xuXG4gICAgICAgIGNvbnN0IHByb3BzID0gb3B0cz8ucHJvcHMgPz8gW11cbiAgICAgICAgY29uc3QgbGFzdCA9IHByb3BzLmF0KC0xKSFcbiAgICAgICAgY29uc3QgcGF0aCA9IHByb3BzLmxlbmd0aCA+IDAgP1xuICAgICAgICAgICAgWy4uLnByb3BzLnNsaWNlKDAsIC0xKSwgLi4udGhpcy5hbGlhc2VzW2xhc3RdID8/IFtsYXN0XV0gOlxuICAgICAgICAgICAgdGhpcy5hbGlhc2VzW3ZhbHVlPy5jb25jZXB0cz8uWzBdIV1cbiAgICAgICAgICAgID8/ICh0aGlzLm9iamVjdFt2YWx1ZS5yb290XSAhPT0gdW5kZWZpbmVkID8gW3ZhbHVlLnJvb3RdIDogdW5kZWZpbmVkKVxuXG4gICAgICAgIGlmIChwYXRoKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSB0eXBlb2YgdGhpcy5vYmplY3RbdmFsdWUucm9vdF0gPT09ICdib29sZWFuJyA/ICFvcHRzPy5uZWdhdGVkIDogIW9wdHM/Lm5lZ2F0ZWQgPyB2YWx1ZS5yb290IDogb3B0cz8ubmVnYXRlZCAmJiB0aGlzLmlzKHZhbHVlKSA/ICcnIDogZ2V0TmVzdGVkKHRoaXMub2JqZWN0LCBwYXRoKVxuICAgICAgICAgICAgc2V0TmVzdGVkKHRoaXMub2JqZWN0LCBwYXRoLCB2YWwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaCh2YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBXcmFwcGVyIHtcblxuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IEJhc2VXcmFwcGVyKFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8/IGRlZXBDb3B5KHRoaXMub2JqZWN0KSxcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICBvcHRzPy5vYmplY3QgPyBmYWxzZSA6IHRoaXMuaXNQbGFjZWhvbGRlcixcbiAgICAgICAgKVxuXG4gICAgICAgIHRoaXMucHJlZGljYXRlcy5mb3JFYWNoKHggPT4gY29weS5zZXQoeCkpXG4gICAgICAgIHJldHVybiBjb3B5XG4gICAgfVxuXG4gICAgZ2V0KGNsYXVzZTogQ2xhdXNlKTogV3JhcHBlciB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgeCA9IGNsYXVzZS5lbnRpdGllcy5mbGF0TWFwKGUgPT4gY2xhdXNlLmRlc2NyaWJlKGUpKVswXVxuXG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzPy5beC5yb290XSA/PyBbeC5yb290XVxuICAgICAgICAgICAgbGV0IHBhcmVudDogV3JhcHBlciA9IHRoaXNcblxuICAgICAgICAgICAgcGF0aC5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG8gPSBwYXJlbnQudW53cmFwKClbcF1cbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBuZXcgQmFzZVdyYXBwZXIobywgZ2V0SW5jcmVtZW50YWxJZCgpLCBmYWxzZSwgcGFyZW50LCBwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudFxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGR5bmFtaWMgPSAoKSA9PiBhbGxLZXlzKHRoaXMub2JqZWN0KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgdHlwZTogdHlwZU9mKHRoaXMub2JqZWN0W3hdKSxcbiAgICAgICAgcm9vdDogeFxuICAgIH0pKVxuXG4gICAgdW53cmFwID0gKCkgPT4gdGhpcy5vYmplY3RcblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBCYXNlV3JhcHBlciBmcm9tIFwiLi9CYXNlV3JhcHBlclwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgcmVhZG9ubHkgcGFyZW50PzogV3JhcHBlclxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueVxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlclxuICAgIGdldChjbGF1c2U6IENsYXVzZSk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICAvKiogZGVzY3JpYmUgdGhlIG9iamVjdCAqLyB0b0NsYXVzZShjbGF1c2U/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICAvKiogaW5mZXIgZ3JhbW1hdGljYWwgdHlwZXMgb2YgcHJvcHMgKi8gZHluYW1pYygpOiBMZXhlbWVbXVxuICAgIHVud3JhcCgpOiBhbnkgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIHByb3BzPzogc3RyaW5nW11cbiAgICBuZWdhdGVkPzogYm9vbGVhblxuICAgIGFyZ3M/OiBXcmFwcGVyW11cbiAgICBhbGlhc1BhdGg/OiBMZXhlbWVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBvYmplY3Q/OiBvYmplY3Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoaWQ6IElkLCBvPzogT2JqZWN0KTogV3JhcHBlciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlV3JhcHBlcihvID8/IHt9LCBpZCwgbyA9PT0gdW5kZWZpbmVkKVxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZU9mKG86IG9iamVjdCk6IExleGVtZVR5cGUgfCB1bmRlZmluZWQge1xuXG4gICAgaWYgKHR5cGVvZiBvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBvLmxlbmd0aCA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG8gPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gJ2FkamVjdGl2ZSdcbiAgICB9IGVsc2UgaWYgKG8pIHtcbiAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxufSIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29udHJhY3Rpb24nLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICdpdmVyYicsXG4gICdtdmVyYicsXG4gICduZWdhdGlvbicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ2ZpbGxlcicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAvLyAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuXG5jb25zdCBiZTogUGFydGlhbDxMZXhlbWU+ID0ge1xuICAgIHJvb3Q6ICdiZScsXG4gICAgdHlwZTogJ2NvcHVsYScsXG59XG5cbmNvbnN0IF9kbzogUGFydGlhbDxMZXhlbWU+ID0ge1xuICAgIHJvb3Q6ICdkbycsXG4gICAgdHlwZTogJ2h2ZXJiJyxcbn1cblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IFBhcnRpYWw8TGV4ZW1lPltdID0gW1xuXG4gICAgYmUsXG4gICAgX2RvLFxuXG4gICAgeyBfcm9vdDogYmUsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSB9LFxuICAgIHsgX3Jvb3Q6IGJlLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicgfSwgLy9UT0RPISAyK1xuICAgIHsgX3Jvb3Q6IF9kbywgdG9rZW46ICdkb2VzJywgY2FyZGluYWxpdHk6IDEgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAnZmlsbGVyJyAvLyBmaWxsZXIgd29yZCwgd2hhdCBhYm91dCBwYXJ0aWFsIHBhcnNpbmc/XG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJy4nLFxuICAgICAgICB0eXBlOiAnZnVsbHN0b3AnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVkaWNhdGUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvYmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiaXNuJ3RcIixcbiAgICAgICAgdHlwZTogJ2NvbnRyYWN0aW9uJyxcbiAgICAgICAgY29udHJhY3Rpb25Gb3I6IFsnaXMnLCAnbm90J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xlZnQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdyaWdodCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmRpdGlvbicsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbnNlcXVlbmNlJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9XG5dXG4iLCJleHBvcnQgY29uc3QgcHJlbHVkZTogc3RyaW5nW10gPSBbXG5cbiAgLy8gZ3JhbW1hclxuICAncXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50JyxcbiAgJ2FydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0JyxcbiAgJ2NvbXBsZW1lbnQgaXMgcHJlcG9zaXRpb24gdGhlbiBvYmplY3Qgbm91bi1waHJhc2UnLFxuXG4gIGBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlYCxcblxuICBgbm91bi1waHJhc2UgaXMgb3B0aW9uYWwgcXVhbnRpZmllciBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBhcnRpY2xlIFxuICAgICAgICB0aGVuIHplcm8gIG9yICBtb3JlIGFkamVjdGl2ZXMgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3IgZ3JhbW1hclxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2UnLFxuICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZScsXG5cbiAgYGFuZC1zZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lIG9yIG1vcmUgcmlnaHQgYW5kLXNlbnRlbmNlIG9yIGNvcHVsYS1zZW50ZW5jZSBvciBub3VuLXBocmFzZWAsXG5cbiAgYG12ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIG12ZXJiXG5cdFx0dGhlbiBvYmplY3Qgbm91bi1waHJhc2VgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgYGl2ZXJiLXNlbnRlbmNlIGlzIHN1YmplY3Qgbm91bi1waHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gIGBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIGl2ZXJiLXNlbnRlbmNlIG9yIG12ZXJiLXNlbnRlbmNlYCxcblxuICBgY3MyIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICAgICAgdGhlbiBzdWJjb25qXG4gICAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2VgLFxuXG4gIGBjczEgaXMgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBmaWxsZXIgXG4gICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2VgLFxuXG4gICBgYSBhbmQgYW4gYXJlIGluZGVmYXJ0c2AsXG4gICBgdGhlIGlzIGEgZGVmYXJ0YCxcbiAgIGBpZiBhbmQgd2hlbiBhbmQgd2hpbGUgYXJlIHN1YmNvbmpzYCxcbiAgIGBhbnkgYW5kIGV2ZXJ5IGFuZCBhbGwgYXJlIHVuaXF1YW50c2AsXG4gICBgb2YgYW5kIG9uIGFuZCB0byBhbmQgZnJvbSBhcmUgcHJlcG9zaXRpb25zYCxcbiAgIGB0aGF0IGlzIGEgcmVscHJvbmAsXG4gICBgbm90IGlzIGEgbmVnYXRpb25gLFxuICAgYGl0IGlzIGEgcHJvbm91bmAsXG5cblxuICAvLyBkb21haW5cbiAgYGJ1dHRvbiBpcyBhIG5vdW4gYW5kIHByb3RvIG9mIGl0IGlzIEhUTUxCdXR0b25FbGVtZW50YCxcbiAgYGRpdiBpcyBhIG5vdW4gYW5kIHByb3RvIG9mIGl0IGlzIEhUTUxEaXZFbGVtZW50YCxcbiAgYGVsZW1lbnQgaXMgYSBub3VuIGFuZCBwcm90byBvZiBpdCBpcyBIVE1MRWxlbWVudGAsXG4gICdjb2xvciBpcyBhIG5vdW4nLFxuICAncmVkIGFuZCBibHVlIGFuZCBibGFjayBhbmQgZ3JlZW4gYXJlIGNvbG9ycycsXG4gICdjb2xvciBvZiBhbnkgZWxlbWVudCBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KClcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZmlsbGVyJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxufSIsImltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2xcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL21pZGRsZS90b0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9jb250ZXh0L0NvbnRleHRcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgcG9pbnRPdXQgfSBmcm9tIFwiLi9wb2ludE91dFwiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgICAgICAvL1RPRE86IG1vdmUgc29tZXdoZXJlIGVsc2VcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE51bWJlci5wcm90b3R5cGUsICdhZGQnLCB7IHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTogZnVuY3Rpb24gKGE6IGFueSkgeyByZXR1cm4gdGhpcyArIGEgfSB9KVxuXG4gICAgICAgIHRoaXMuY29udGV4dC5wcmVsdWRlLmZvckVhY2goYyA9PiB0aGlzLmV4ZWN1dGUoYykpXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXSB7XG5cbiAgICAgICAgcmV0dXJuIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbnRleHQpLnBhcnNlQWxsKCkubWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgIGlmIChhc3QudHlwZSA9PT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zZXRTeW50YXgoYXN0KVxuICAgICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjbGF1c2UgPSB0b0NsYXVzZShhc3QpLnNpbXBsZVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coY2xhdXNlLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgICAgIGlmIChjbGF1c2UuaXNTaWRlRWZmZWN0eSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0dWF0b3IudGFrZUFjdGlvbihjbGF1c2UsIHRoaXMuY29udGV4dClcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJzID0gY2xhdXNlLmVudGl0aWVzLmZsYXRNYXAoaWQgPT4gZ2V0S29vbCh0aGlzLmNvbnRleHQsIGNsYXVzZSwgaWQpKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnZhbHVlcy5mb3JFYWNoKHcgPT4gcG9pbnRPdXQodywgeyB0dXJuT2ZmOiB0cnVlIH0pKVxuICAgICAgICAgICAgICAgIHdyYXBwZXJzLmZvckVhY2godyA9PiB3ID8gcG9pbnRPdXQodykgOiAwKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXJzLmZsYXRNYXAobyA9PiBvID8gby51bndyYXAoKSA6IFtdKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pLmZsYXQoKVxuICAgIH1cblxufSIsImltcG9ydCB7IEdldENvbnRleHRPcHRzLCBnZXROZXdDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QnJhaW5PcHRzIGV4dGVuZHMgR2V0Q29udGV4dE9wdHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbihvcHRzOiBHZXRCcmFpbk9wdHMpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKGdldE5ld0NvbnRleHQob3B0cykpXG59XG4iLCJpbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vLi4vYmFja2VuZC93cmFwcGVyL1dyYXBwZXJcIlxuXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRPdXQod3JhcHBlcjogV3JhcHBlciwgb3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KSB7XG5cbiAgICBjb25zdCBvYmplY3QgPSB3cmFwcGVyLnVud3JhcCgpXG5cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgb2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvZW52aXJvL0Vudmlyb1wiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBBc3RUeXBlIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBtYWNyb1RvU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNDb250ZXh0IGltcGxlbWVudHMgQ29udGV4dCB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSB0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZVxuICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSB0aGlzLmNvbmZpZy5zeW50YXhlc1xuICAgIHByb3RlY3RlZCBfc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICBwcm90ZWN0ZWQgX2xleGVtZXMgPSB0aGlzLmNvbmZpZy5sZXhlbWVzXG4gICAgcmVhZG9ubHkgcHJlbHVkZSA9IHRoaXMuY29uZmlnLnByZWx1ZGVcbiAgICByZWFkb25seSBsZXhlbWVUeXBlcyA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgcmVhZG9ubHkgZ2V0ID0gdGhpcy5lbnZpcm8uZ2V0XG4gICAgcmVhZG9ubHkgc2V0ID0gdGhpcy5lbnZpcm8uc2V0XG4gICAgcmVhZG9ubHkgcXVlcnkgPSB0aGlzLmVudmlyby5xdWVyeVxuICAgIHJlYWRvbmx5IHJvb3QgPSB0aGlzLmVudmlyby5yb290XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBlbnZpcm86IEVudmlybywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcpIHtcblxuICAgICAgICB0aGlzLmFzdFR5cGVzLmZvckVhY2goZyA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgICAgIHJvb3Q6IGcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgICAgICAgICB9KSlcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnZhbHVlc1xuICAgIH1cblxuICAgIGdldExleGVtZSA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByb290T3JUb2tlbiA9PT0geC50b2tlbiB8fCByb290T3JUb2tlbiA9PT0geC5yb290KVxuICAgICAgICAgICAgLmF0KDApXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFN5bnRheExpc3QoKSB7XG4gICAgICAgIGNvbnN0IHggPSBPYmplY3Qua2V5cyh0aGlzLnN5bnRheE1hcCkgYXMgQ29tcG9zaXRlVHlwZVtdXG4gICAgICAgIGNvbnN0IHkgPSB4LmZpbHRlcihlID0+ICF0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5pbmNsdWRlcyhlKSlcbiAgICAgICAgY29uc3QgeiA9IHkuc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCB0aGlzLnN5bnRheE1hcCkpXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcbiAgICB9XG5cbiAgICBnZXQgc3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ludGF4TGlzdFxuICAgIH1cblxuICAgIGdldCBsZXhlbWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQXN0Tm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuX3N5bnRheExpc3QgPSB0aGlzLmdldFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lID0gKGxleGVtZTogTGV4ZW1lKSA9PiB7XG5cbiAgICAgICAgaWYgKGxleGVtZS5yb290ICYmICFsZXhlbWUudG9rZW4gJiYgdGhpcy5fbGV4ZW1lcy5zb21lKHggPT4geC5yb290ID09PSBsZXhlbWUucm9vdCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2xleGVtZXMgPSB0aGlzLl9sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2goLi4ubGV4ZW1lLmV4dHJhcG9sYXRlKHRoaXMpKVxuICAgIH1cblxuICAgIGdldCBhc3RUeXBlcygpOiBBc3RUeXBlW10ge1xuICAgICAgICBjb25zdCByZXM6IEFzdFR5cGVbXSA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgICAgIHJlcy5wdXNoKC4uLnRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UpXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2xleGVtZXNcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSwgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgcHJlbHVkZSB9IGZyb20gXCIuLi8uLi9jb25maWcvcHJlbHVkZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgc3RhdGljRGVzY1ByZWNlZGVuY2UgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHN5bnRheGVzOiBTeW50YXhNYXBcbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN0YXRpY0Rlc2NQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpOiBDb25maWcge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXM6IGxleGVtZXMubWFwKHggPT4gbWFrZUxleGVtZSh4KSksXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBwcmVsdWRlLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICB9XG59XG5cbiIsImltcG9ydCBnZXRFbnZpcm8sIHsgRW52aXJvLCBHZXRFbnZpcm9PcHMgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgQmFzaWNDb250ZXh0IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCBleHRlbmRzIEVudmlybyB7XG5cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG4gICAgZ2V0TGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWUgfCB1bmRlZmluZWRcblxuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgcHJlbHVkZTogc3RyaW5nW11cbiAgICByZWFkb25seSBzeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW11cbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dE9wdHMgZXh0ZW5kcyBHZXRFbnZpcm9PcHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDb250ZXh0KG9wdHM6IEdldENvbnRleHRPcHRzKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NvbnRleHQoZ2V0RW52aXJvKG9wdHMpLCBnZXRDb25maWcoKSlcbn0iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9nZXRMZXhlbWVzXCI7XG5pbXBvcnQgeyByZXNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3Jlc3BhY2VcIjtcbmltcG9ydCB7IHN0ZHNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyBqb2luTXVsdGlXb3JkTGV4ZW1lcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lc1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXIgPSAwXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQpIHsgLy8gVE9ETzogbWFrZSBjYXNlIGluc2Vuc2l0aXZlXG5cbiAgICAgICAgY29uc3Qgd29yZHMgPVxuICAgICAgICAgICAgam9pbk11bHRpV29yZExleGVtZXMoc3Rkc3BhY2Uoc291cmNlQ29kZSksIGNvbnRleHQubGV4ZW1lcylcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gcmVzcGFjZShzKSlcblxuICAgICAgICB0aGlzLnRva2VucyA9IHdvcmRzLmZsYXRNYXAodyA9PiBnZXRMZXhlbWVzKHcsIGNvbnRleHQsIHdvcmRzKSlcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgTGV4ZW1lT2JqZWN0IGZyb20gXCIuL0xleGVtZU9iamVjdFwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gIHJvb3Q6IHN0cmluZ1xuICAgIC8qKnRva2VuIHR5cGUqLyAgdHlwZTogTGV4ZW1lVHlwZVxuICAgIC8qKmZvcm0gb2YgdGhpcyBpbnN0YW5jZSovIHRva2VuPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyAgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxuICAgIC8qKmZvciBxdWFudGFkaiAqLyBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcHJvdG8/OiBzdHJpbmdcbiAgICBjb25jZXB0cz86IHN0cmluZ1tdXG4gICAgX3Jvb3Q/OiBQYXJ0aWFsPExleGVtZT5cbiAgICBleHRyYXBvbGF0ZShjb250ZXh0OiBDb250ZXh0KTogTGV4ZW1lW11cbiAgICBnZXRQcm90bygpOiBvYmplY3QgfCB1bmRlZmluZWRcbiAgICByZWFkb25seSBpc1BsdXJhbDogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzQ29uY2VwdDogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzTXVsdGlXb3JkOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IFBhcnRpYWw8TGV4ZW1lPik6IExleGVtZSB7XG5cbiAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIExleGVtZU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZGF0YVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgTGV4ZW1lT2JqZWN0KGRhdGEpXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgY29uanVnYXRlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBwbHVyYWxpemUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcGx1cmFsaXplXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExleGVtZU9iamVjdCBpbXBsZW1lbnRzIExleGVtZSAvKiwgV3JhcHBlciAqLyB7XG5cbiAgICBfcm9vdCA9IHRoaXMubmV3RGF0YT8uX3Jvb3RcbiAgICBjb250cmFjdGlvbkZvciA9IHRoaXMubmV3RGF0YT8uY29udHJhY3Rpb25Gb3IgPz8gdGhpcy5fcm9vdD8uY29udHJhY3Rpb25Gb3JcbiAgICB0b2tlbiA9IHRoaXMubmV3RGF0YT8udG9rZW4gPz8gdGhpcy5fcm9vdD8udG9rZW5cbiAgICBjYXJkaW5hbGl0eSA9IHRoaXMubmV3RGF0YT8uY2FyZGluYWxpdHkgPz8gdGhpcy5fcm9vdD8uY2FyZGluYWxpdHlcbiAgICBwcm90byA9IHRoaXMubmV3RGF0YT8ucHJvdG8gPz8gdGhpcy5fcm9vdD8ucHJvdG9cbiAgICBjb25jZXB0cyA9IHRoaXMubmV3RGF0YT8uY29uY2VwdHMgPz8gdGhpcy5fcm9vdD8uY29uY2VwdHNcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBuZXdEYXRhPzogUGFydGlhbDxMZXhlbWU+XG4gICAgKSB7XG4gICAgfVxuXG4gICAgZ2V0IHJvb3QoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Jvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yb290LnJvb3RcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm5ld0RhdGE/LnJvb3QgYXMgYW55XG4gICAgfVxuXG4gICAgZ2V0IHR5cGUoKTogTGV4ZW1lVHlwZSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Jvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fcm9vdCBhcyBMZXhlbWUpLnR5cGVcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm5ld0RhdGE/LnR5cGUgYXMgYW55XG4gICAgfVxuXG4gICAgZ2V0IGlzUGx1cmFsKCkge1xuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKHRoaXMubmV3RGF0YT8uY2FyZGluYWxpdHkpXG4gICAgfVxuXG4gICAgZ2V0IGlzQ29uY2VwdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM/LnR5cGUgPT09ICdub3VuJyAmJiAodGhpcyBhcyBhbnkpLmNvbmNlcHRzICYmICEodGhpcyBhcyBhbnkpLnByb3RvXG4gICAgfVxuXG4gICAgZXh0cmFwb2xhdGUoY29udGV4dDogQ29udGV4dCk6IExleGVtZVtdIHtcblxuICAgICAgICBpZiAoKHRoaXMudHlwZSA9PT0gJ25vdW4nIHx8IHRoaXMudHlwZSA9PT0gJ2dyYW1tYXInKSAmJiAhdGhpcy5pc1BsdXJhbCkge1xuICAgICAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHsgX3Jvb3Q6IHRoaXMsIHRva2VuOiBwbHVyYWxpemUodGhpcy5yb290KSwgY2FyZGluYWxpdHk6ICcqJyB9KV1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChbJ2l2ZXJiJywgJ212ZXJiJ10uaW5jbHVkZXModGhpcy50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZSh0aGlzLnJvb3QpLm1hcCh4ID0+IG1ha2VMZXhlbWUoeyBfcm9vdDogdGhpcywgdG9rZW46IHggfSkpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBnZXQgaXNNdWx0aVdvcmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJvb3QuaW5jbHVkZXMoJyAnKTtcbiAgICB9XG5cbiAgICBnZXRQcm90bygpOiBvYmplY3QgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpPy5bdGhpcy5wcm90byBhcyBhbnldPy5wcm90b3R5cGU7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkeW5hbWljTGV4ZW1lKHdvcmQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCwgd29yZHM6IHN0cmluZ1tdKTogTGV4ZW1lIHtcblxuICAgIGNvbnN0IHJlbGV2YW50ID0gd29yZHNcbiAgICAgICAgLm1hcCh3ID0+IGNsYXVzZU9mKG1ha2VMZXhlbWUoeyByb290OiB3LCB0eXBlOiAnbm91bicgfSksICdYJykpXG4gICAgICAgIC5mbGF0TWFwKGMgPT4gY29udGV4dC5xdWVyeShjKSlcbiAgICAgICAgLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAuZmxhdE1hcChpZCA9PiBjb250ZXh0LmdldChpZCkgPz8gW10pXG4gICAgICAgIC5mbGF0TWFwKHggPT4geD8uZHluYW1pYygpLmZsYXRNYXAoeCA9PiB4LmV4dHJhcG9sYXRlKGNvbnRleHQpKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgudG9rZW4gPT09IHdvcmQgfHwgeC5yb290ID09PSB3b3JkKVxuXG4gICAgY29uc3QgaXNNYWNyb0NvbnRleHQgPVxuICAgICAgICB3b3Jkcy5zb21lKHggPT4gY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgPT09ICdncmFtbWFyJylcbiAgICAgICAgJiYgIXdvcmRzLnNvbWUoeCA9PiBbJ2RlZmFydCcsICdpbmRlZmFydCcsICdub25zdWJjb25qJ10uaW5jbHVkZXMoY29udGV4dC5nZXRMZXhlbWUoeCk/LnR5cGUgYXMgYW55KSkvL1RPRE86IHdoeSBkZXBlbmRlbmNpZXMoJ21hY3JvJykgZG9lc24ndCB3b3JrPyFcblxuICAgIGNvbnN0IHR5cGUgPSByZWxldmFudFswXT8udHlwZSA/P1xuICAgICAgICAoaXNNYWNyb0NvbnRleHQgP1xuICAgICAgICAgICAgJ2dyYW1tYXInXG4gICAgICAgICAgICA6ICdub3VuJylcblxuICAgIHJldHVybiBtYWtlTGV4ZW1lKHsgdG9rZW46IHdvcmQsIHJvb3Q6IHJlbGV2YW50Py5hdCgwKT8ucm9vdCA/PyB3b3JkLCB0eXBlOiB0eXBlIH0pXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vZmFjYWRlL2NvbnRleHQvQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcbmltcG9ydCB7IGR5bmFtaWNMZXhlbWUgfSBmcm9tIFwiLi9keW5hbWljTGV4ZW1lXCJcbmltcG9ydCB7IG51bWJlckxleGVtZSB9IGZyb20gXCIuL251bWJlckxleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWVbXSB7XG5cbiAgICBjb25zdCBsZXggPSBjb250ZXh0LmdldExleGVtZSh3b3JkKSA/P1xuICAgICAgICBudW1iZXJMZXhlbWUod29yZCkgPz9cbiAgICAgICAgZHluYW1pY0xleGVtZSh3b3JkLCBjb250ZXh0LCB3b3JkcylcblxuICAgIHJldHVybiBsZXguY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXguY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgY29udGV4dCwgd29yZHMpKSA6XG4gICAgICAgIFtsZXhdXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBzdGRzcGFjZSB9IGZyb20gXCIuL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyB1bnNwYWNlIH0gZnJvbSBcIi4vdW5zcGFjZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gam9pbk11bHRpV29yZExleGVtZXMoc291cmNlQ29kZTogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWVbXSkge1xuXG4gICAgbGV0IG5ld1NvdXJjZSA9IHNvdXJjZUNvZGU7XG5cbiAgICBsZXhlbWVzXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LmlzTXVsdGlXb3JkKVxuICAgICAgICAuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxleGVtZSA9IHN0ZHNwYWNlKHgucm9vdCk7XG4gICAgICAgICAgICBuZXdTb3VyY2UgPSBuZXdTb3VyY2UucmVwbGFjZUFsbChsZXhlbWUsIHVuc3BhY2UobGV4ZW1lKSk7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ld1NvdXJjZTtcbn1cbiIsImltcG9ydCB7IG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyTGV4ZW1lKHdvcmQ6IHN0cmluZykge1xuXG4gICAgaWYgKHdvcmQubWF0Y2goL1xcZCsvKSkge1xuICAgICAgICByZXR1cm4gbWFrZUxleGVtZSh7IHJvb3Q6IHdvcmQsIHR5cGU6ICdub3VuJywgcHJvdG86ICdOdW1iZXInIH0pXG4gICAgfVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gcmVzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnLScsICcgJyk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBzdGRzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gdW5zcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnICcsICctJyk7XG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9mYWNhZGUvY29udGV4dC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoYXN0OiBBc3ROb2RlKTogQXN0Tm9kZSB7XG5cbiAgICAgICAgaWYgKCFhc3QubGlua3MpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8uc3ViamVjdD8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGUpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGUodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKVxuICAgIH0pO1xuXG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gc3RhdGUuYnJhaW5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyBtb2NrTWFwIH0gZnJvbSBcIi4vZnVuY3Rpb25zL21vY2tNYXBcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi91dGlscy91bmlxXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHllcyA/IHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzIDogJydcbiAgICB9XG5cbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBhYm91dCA9IChpZDogSWQpOiBDbGF1c2UgPT4gdGhpcy5jbGF1c2UxLmFib3V0KGlkKS5hbmQodGhpcy5jbGF1c2UyLmFib3V0KGlkKSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCk6IExleGVtZVtdID0+IHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdW5pZnkocWU6IElkLCByZTogSWQsIHJlc3VsdDogTWFwW10pIHtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zb21lKHggPT4geFtxZV0gPT09IHJlKSkgeyAvLyBpZiBhbHJlYWR5IHVuaWZpZWQgZG9uJ3QgZG8gaXQgYWdhaW5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaSA9IHJlc3VsdC5maW5kSW5kZXgoeCA9PiAheFtxZV0pXG4gICAgICAgICAgICBjb25zdCBtID0gcmVzdWx0W2ldID8/IHt9XG4gICAgICAgICAgICBtW3FlXSA9IHJlXG4gICAgICAgICAgICByZXN1bHRbaSA+IC0xID8gaSA6IHJlc3VsdC5sZW5ndGhdID0gbVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCByZXN1bHQ6IE1hcFtdID0gW11cbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSlcblxuICAgICAgICBxdWVyeS5lbnRpdGllcy5mb3JFYWNoKHFlID0+IHtcbiAgICAgICAgICAgIHVuaXZlcnNlLmVudGl0aWVzLmZvckVhY2gocmUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmQgPSB1bml2ZXJzZS5hYm91dChyZSkuZmxhdExpc3QoKVxuICAgICAgICAgICAgICAgIGNvbnN0IHFkID0gcXVlcnkuYWJvdXQocWUpLmZsYXRMaXN0KClcbiAgICAgICAgICAgICAgICBjb25zdCByZDIgPSByZC5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3JlXTogcWUgfSB9KSkgLy8gc3Vic2l0dXRlIHJlIGJ5IHFlIGluIHJlYWwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAvLyBjb25zdCByZDIgPSAgcmRcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBhcmUgZWFjaCByZDIgdG8gZWFjaCBxZCwgaWYgcHJlZGljYXRlIGlzIHNhbWUgcmVwbGFjZSByIGFyZ3Mgd2l0aCBxIGFyZ3NcbiAgICAgICAgICAgICAgICByZDIuZm9yRWFjaCgociwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBxZC5mb3JFYWNoKHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIucHJlZGljYXRlID09PSBxLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG06IE1hcCA9IChyLmFyZ3MgPz8gW10pLm1hcCgoYSwgaSkgPT4gKHsgW2FdOiBxLmFyZ3M/LltpXSA/PyBhIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJkMltpXSA9IHIuY29weSh7IG1hcDogbSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHIudG9TdHJpbmcoKSwgJ21heSBiZSAnLCBxLnRvU3RyaW5nKCksICdyIGJlY29tZXMnLCByZDJbaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcWhhc2hlcyA9IHFkLm1hcCh4ID0+IHguaGFzaENvZGUpXG4gICAgICAgICAgICAgICAgY29uc3QgcjJoYXNoZXMgPSByZDIubWFwKHggPT4geC5oYXNoQ29kZSlcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdVbmlmeSBvciBub3Q/JywgJ3FkPScsIHFkLm1hcCh4PT54LnRvU3RyaW5nKCkpLCAncmQyPScsIHJkMi5tYXAoeD0+eC50b1N0cmluZygpKSlcblxuICAgICAgICAgICAgICAgIGlmIChxaGFzaGVzLmV2ZXJ5KHggPT4gcjJoYXNoZXMuaW5jbHVkZXMoeCkpKSB7IC8vIHFlIHVuaWZpZXMgd2l0aCByZSFcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocWUsICdpcycsIHJlLCAnIScpXG4gICAgICAgICAgICAgICAgICAgIHVuaWZ5KHFlLCByZSwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdCAmJiBxZC5zb21lKHggPT4geC5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pZnkocWUsIGl0LCByZXN1bHQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBtb2NrTWFwIH0gZnJvbSBcIi4vZnVuY3Rpb25zL21vY2tNYXBcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmFyZ3MpXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KHsgcHJlZGljYXRlOiB0aGlzLnByZWRpY2F0ZS5yb290LCBhcmdzOiB0aGlzLmFyZ3MsIG5lZ2F0ZWQ6IHRoaXMubmVnYXRlZCB9KSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKFxuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSAmJiB0aGlzLmFyZ3MubGVuZ3RoID09PSAxID8gW3RoaXMucHJlZGljYXRlXSA6IFtdXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAocXVlcnkuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW9ja01hcChxdWVyeSldXG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LmZsYXRMaXN0KClbMF0gLy9UT0RPISE/Pz9cblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEJhc2ljQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocXVlcnkucHJlZGljYXRlLnJvb3QgIT09IHRoaXMucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkcz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXNcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXMuY29uZGl0aW9uXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzLmNvbnNlcXVlbmNlXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCkgKyB0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBzdWJqY29uaj86IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY29uc2VxdWVuY2UuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5zdWJqY29uaiA/PyB0aGlzLnN1Ympjb25qLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyAgIFxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLmVudGl0aWVzKSlcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGVtcHR5Q2xhdXNlIC8vL1RPRE8hISEhISEhIVxuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24uYWJvdXQoaWQpLmFuZCh0aGlzLmNvbnNlcXVlbmNlLmFib3V0KGlkKSlcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5zdWJqY29uaj8ucm9vdCA/PyAnJ30gJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uc2VxdWVuY2Uub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc2VxdWVuY2UuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNvbmRpdGlvbi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7Ly8gVE9ET1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7XG4gICAgICAgICAgICBjbGF1c2UxOiB0aGlzLmNvbmRpdGlvbi5zaW1wbGUsXG4gICAgICAgICAgICBjbGF1c2UyOiB0aGlzLmNvbnNlcXVlbmNlLnNpbXBsZVxuICAgICAgICB9KVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uLy4uLy4uL2JhY2tlbmQvd3JhcHBlci9XcmFwcGVyXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2ZhY2FkZS9jb250ZXh0L0NvbnRleHRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEtvb2woY29udGV4dDogQ29udGV4dCwgY2xhdXNlOiBDbGF1c2UsIGxvY2FsSWQ6IElkKTogV3JhcHBlcltdIHtcblxuICAgIGNvbnN0IG93bmVySWRzID0gY2xhdXNlLm93bmVyc09mKGxvY2FsSWQpIC8vIDAgb3IgMSBvd25lcihzKVxuXG4gICAgaWYgKG93bmVySWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5xdWVyeShjbGF1c2UpXG4gICAgICAgIHJldHVybiBtYXBzLm1hcCh4ID0+IHhbbG9jYWxJZF0pLmZsYXRNYXAoeCA9PiBjb250ZXh0LmdldCh4KSA/PyBbXSlcbiAgICB9XG5cbiAgICBjb25zdCBvd25lciA9IGdldEtvb2woY29udGV4dCwgY2xhdXNlLCBvd25lcklkc1swXSlcbiAgICByZXR1cm4gb3duZXIuZmxhdE1hcCh4ID0+IHguZ2V0KGNsYXVzZS5hYm91dChsb2NhbElkKSkgPz8gW10pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKTogSWRbXSB7XG5cbiAgICBjb25zdCBvd25lZEVudGl0aWVzID0gY2xhdXNlLm93bmVkQnkoZW50aXR5KVxuXG4gICAgcmV0dXJuIG93bmVkRW50aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgW2VudGl0eV0gOlxuICAgICAgICBbZW50aXR5XS5jb25jYXQoZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBvd25lZEVudGl0aWVzWzBdKSlcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCB7IHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvQ29uc3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBjYXNlIGluc2Vuc2l0aXZlIG5hbWVzLCBpZiBvbmUgdGltZSB2YXIgYWxsIHZhcnMhXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc1Zhcih4KSlcbiAgICAgICAgLm1hcChlID0+ICh7IFt0b0NvbnN0KGUpXTogZSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4uL0ltcGx5XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VJbXBseShjbGF1c2U6IENsYXVzZSkgeyAvLyBhbnkgY2xhdXNlIHdpdGggYW55IHZhciBpcyBhbiBpbXBseVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5KSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlLnJoZW1lID09PSBlbXB0eUNsYXVzZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5lbnRpdGllcy5zb21lKGUgPT4gaXNWYXIoZSkpIHx8IGNsYXVzZS5mbGF0TGlzdCgpLnNvbWUoeCA9PiB4LnByZWRpY2F0ZSA/IHgucHJlZGljYXRlLmlzUGx1cmFsIDogZmFsc2UpKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2UudGhlbWUuaW1wbGllcyhjbGF1c2UucmhlbWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXVzZVxufVxuIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbW9ja01hcChjbGF1c2U6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIGNsYXVzZS5lbnRpdGllcy5tYXAoZSA9PiAoeyBbZV06IGUgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuLy9UT0RPOiBjb25zaWRlciBtb3ZpbmcgdG8gQ2xhdXNlLmNvcHkoe25lZ2F0ZX0pICEhISEhXG5leHBvcnQgZnVuY3Rpb24gbmVnYXRlKGNsYXVzZTogQ2xhdXNlLCBuZWdhdGU6IGJvb2xlYW4pIHtcblxuICAgIGlmICghbmVnYXRlKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBjbGF1c2UxOiBjbGF1c2UudGhlbWUuc2ltcGxlLCBjbGF1c2UyOiBjbGF1c2UucmhlbWUuc2ltcGxlLmNvcHkoeyBuZWdhdGUgfSkgfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvdG9WYXJcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BhZ2F0ZVZhcnNPd25lZChjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7IC8vIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyIHNob3VsZCBiZSBhbHNvIGJlIGEgdmFyXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiBjbGF1c2Uub3duZWRCeShlKSlcbiAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUFuYXBob3JhKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UudGhlbWUucXVlcnkoY2xhdXNlLnJoZW1lKVswXVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSA/PyB7fSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuL3RvVmFyXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdldEluY3JlbWVudGFsSWRPcHRzIHtcbiAgICBhc1ZhcjogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZChvcHRzPzogR2V0SW5jcmVtZW50YWxJZE9wdHMpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBvcHRzPy5hc1ZhciA/IHRvVmFyKG5ld0lkKSA6IG5ld0lkO1xufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbnN0KGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXIoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvVXBwZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IG1ha2VBbGxWYXJzIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnNcIlxuaW1wb3J0IHsgbWFrZUltcGx5IH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUltcGx5XCJcbmltcG9ydCB7IG5lZ2F0ZSB9IGZyb20gXCIuL2NsYXVzZXMvZnVuY3Rpb25zL25lZ2F0ZVwiXG5pbXBvcnQgeyBwcm9wYWdhdGVWYXJzT3duZWQgfSBmcm9tIFwiLi9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWRcIlxuaW1wb3J0IHsgcmVzb2x2ZUFuYXBob3JhIH0gZnJvbSBcIi4vY2xhdXNlcy9mdW5jdGlvbnMvcmVzb2x2ZUFuYXBob3JhXCJcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiXG5pbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuL2lkL2Z1bmN0aW9ucy90b1ZhclwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL2lkL0lkXCJcblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKCdBc3QgaXMgdW5kZWZpbmVkIScpXG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIGlmIChhc3QubGV4ZW1lKSB7XG5cbiAgICAgICAgaWYgKGFzdC5sZXhlbWUudHlwZSA9PT0gJ25vdW4nIHx8IGFzdC5sZXhlbWUudHlwZSA9PT0gJ2FkamVjdGl2ZScgfHwgYXN0LmxleGVtZS50eXBlID09PSAncHJvbm91bicgfHwgYXN0LmxleGVtZS50eXBlID09PSAnZ3JhbW1hcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGF1c2VPZihhc3QubGV4ZW1lLCAuLi5hcmdzPy5zdWJqZWN0ID8gW2FyZ3M/LnN1YmplY3RdIDogW10pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcblxuICAgIH1cblxuICAgIGlmIChhc3QubGlzdCkge1xuICAgICAgICByZXR1cm4gYXN0Lmxpc3QubWFwKGMgPT4gdG9DbGF1c2UoYywgYXJncykpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSlcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0XG4gICAgbGV0IHJlbFxuXG4gICAgaWYgKGFzdD8ubGlua3M/LnJlbHByb24pIHtcbiAgICAgICAgcmVzdWx0ID0gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoaXNDb3B1bGFTZW50ZW5jZShhc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5ub25zdWJjb25qKSB7XG4gICAgICAgIHJlc3VsdCA9IGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAocmVsID0gYXN0LmxpbmtzPy5pdmVyYj8ubGV4ZW1lIHx8IGFzdC5saW5rcz8ubXZlcmI/LmxleGVtZSB8fCBhc3QubGlua3M/LnByZXBvc2l0aW9uPy5sZXhlbWUpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVsYXRpb25Ub0NsYXVzZShhc3QsIHJlbCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8uc3ViY29uaikge1xuICAgICAgICByZXN1bHQgPSBjb21wbGV4U2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGMwID0gYXN0LmxpbmtzPy5ub25zdWJjb25qID8gcmVzdWx0IDogbWFrZUltcGx5KHJlc3VsdClcbiAgICAgICAgY29uc3QgYzEgPSBtYWtlQWxsVmFycyhjMClcbiAgICAgICAgY29uc3QgYzIgPSByZXNvbHZlQW5hcGhvcmEoYzEpXG4gICAgICAgIGNvbnN0IGMzID0gcHJvcGFnYXRlVmFyc093bmVkKGMyKVxuICAgICAgICBjb25zdCBjNCA9IG5lZ2F0ZShjMywgISFhc3Q/LmxpbmtzPy5uZWdhdGlvbilcbiAgICAgICAgY29uc3QgYzUgPSBjNC5jb3B5KHsgc2lkZUVmZmVjdHk6IGM0LnJoZW1lICE9PSBlbXB0eUNsYXVzZSB9KVxuICAgICAgICByZXR1cm4gYzVcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3QudHlwZX0nIWApXG5cbn1cblxuY29uc3QgaXNDb3B1bGFTZW50ZW5jZSA9IChhc3Q/OiBBc3ROb2RlKSA9PiAhIWFzdD8ubGlua3M/LmNvcHVsYVxuXG5mdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlPy5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICBjb25zdCBwcmVkaWNhdGUgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnByZWRpY2F0ZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcblxuICAgIHJldHVybiBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxufVxuXG5mdW5jdGlvbiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShjb3B1bGFTdWJDbGF1c2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlPy5saW5rcz8ucHJlZGljYXRlXG4gICAgcmV0dXJuIHRvQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKG5vdW5QaHJhc2U6IEFzdE5vZGUsIG9wdHM/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbWF5YmVJZCA9IG9wdHM/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZT8ubGlua3M/LnVuaXF1YW50ID8gdG9WYXIobWF5YmVJZCkgOiBtYXliZUlkXG4gICAgY29uc3QgYXJncyA9IHsgc3ViamVjdDogc3ViamVjdElkIH1cblxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG5vdW5QaHJhc2UubGlua3MgPz8ge30pXG4gICAgICAgIC5tYXAoeCA9PiB0b0NsYXVzZSh4LCBhcmdzKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbn1cblxuZnVuY3Rpb24gcmVsYXRpb25Ub0NsYXVzZShhc3Q6IEFzdE5vZGUsIHJlbDogTGV4ZW1lLCBvcHRzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IG9wdHM/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgb2JqSWQgPSBnZXRJbmNyZW1lbnRhbElkKClcblxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViaklkIH0pXG4gICAgY29uc3Qgb2JqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqSWQgfSlcblxuICAgIGNvbnN0IGFyZ3MgPSBvYmplY3QgPT09IGVtcHR5Q2xhdXNlID8gW3N1YmpJZF0gOiBbc3ViaklkLCBvYmpJZF1cbiAgICBjb25zdCByZWxhdGlvbiA9IGNsYXVzZU9mKHJlbCwgLi4uYXJncylcbiAgICBjb25zdCByZWxhdGlvbklzUmhlbWUgPSBzdWJqZWN0ICE9PSBlbXB0eUNsYXVzZVxuXG4gICAgcmV0dXJuIHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmVsYXRpb24sIHsgYXNSaGVtZTogcmVsYXRpb25Jc1JoZW1lIH0pXG5cbn1cblxuZnVuY3Rpb24gY29tcGxleFNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmNvbmogPSBhc3QubGlua3M/LnN1YmNvbmo/LmxleGVtZVxuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uZGl0aW9uLCBhcmdzKVxuICAgIGNvbnN0IGNvbnNlcXVlbmNlID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5jb25zZXF1ZW5jZSwgYXJncylcbiAgICByZXR1cm4gY29uZGl0aW9uLmltcGxpZXMoY29uc2VxdWVuY2UpLmNvcHkoeyBzdWJqY29uajogc3ViY29uaiB9KVxuXG59XG5cbmZ1bmN0aW9uIGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IGxlZnQgPSB0b0NsYXVzZShhc3QubGlua3M/LmxlZnQsIGFyZ3MpXG4gICAgY29uc3QgcmlnaHQgPSB0b0NsYXVzZShhc3Q/LmxpbmtzPy5yaWdodD8ubGlzdD8uWzBdLCBhcmdzKVxuXG4gICAgaWYgKGFzdC5saW5rcz8ubGVmdD8udHlwZSA9PT0gYXN0LmxpbmtzPy5yaWdodD8udHlwZSkge1xuICAgICAgICByZXR1cm4gbGVmdC5hbmQocmlnaHQpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbSA9IHsgW3JpZ2h0LmVudGl0aWVzWzBdXTogbGVmdC5lbnRpdGllc1swXSB9XG4gICAgICAgIGNvbnN0IHRoZW1lID0gbGVmdC50aGVtZS5hbmQocmlnaHQudGhlbWUpXG4gICAgICAgIGNvbnN0IHJoZW1lID0gcmlnaHQucmhlbWUuYW5kKHJpZ2h0LnJoZW1lLmNvcHkoeyBtYXA6IG0gfSkpXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgIH1cblxufSIsIlxuXG5leHBvcnQgZnVuY3Rpb24gYWxsS2V5cyhvYmplY3Q6IG9iamVjdCwgaXRlciA9IDUpIHtcblxuICAgIGxldCBvYmogPSBvYmplY3RcbiAgICBsZXQgcmVzOiBzdHJpbmdbXSA9IFtdXG5cbiAgICB3aGlsZSAob2JqICYmIGl0ZXIpIHtcbiAgICAgICAgcmVzID0gWy4uLnJlcywgLi4uT2JqZWN0LmtleXMob2JqKV1cbiAgICAgICAgcmVzID0gWy4uLnJlcywgLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKV1cbiAgICAgICAgb2JqID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iailcbiAgICAgICAgaXRlci0tXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc1xufSIsImV4cG9ydCBmdW5jdGlvbiBkZWVwQ29weShvYmplY3Q6IG9iamVjdCkge1xuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWQgPSBvYmplY3QuY2xvbmVOb2RlKCkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgd3JhcHBlZC5pbm5lckhUTUwgPSBvYmplY3QuaW5uZXJIVE1MXG4gICAgICAgIHJldHVybiB3cmFwcGVkXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgLi4ub2JqZWN0IH1cbiAgICB9XG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXROZXN0ZWQob2JqZWN0OiBhbnksIHBhdGg6IHN0cmluZ1tdKSB7XG5cbiAgICBsZXQgeCA9IG9iamVjdFtwYXRoWzBdXSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lXG5cbiAgICBwYXRoLnNsaWNlKDEpLmZvckVhY2gocCA9PiB7XG4gICAgICAgIHggPSB4Py5bcF1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHhcblxufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHRhZ05hbWVGcm9tUHJvdG8gfSBmcm9tIFwiLi90YWdOYW1lRnJvbVByb3RvXCJcblxuLyoqXG4gKiBcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhbiBvYmplY3QgKGV2ZW4gSFRNTEVsZW1lbnQpIGZyb20gYSBwcm90b3R5cGUuXG4gKiBJbiBjYXNlIGl0J3MgYSBudW1iZXIsIG5vIG5ldyBpbnN0YW5jZSBpcyBtYWRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV3SW5zdGFuY2UocHJvdG86IG9iamVjdCwgLi4uYXJnczogYW55W10pIHtcblxuICAgIGlmIChwcm90byA9PT0gTnVtYmVyLnByb3RvdHlwZSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChhcmdzWzBdKVxuICAgIH1cblxuICAgIHJldHVybiBwcm90byBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID9cbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSkgOlxuICAgICAgICBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoLi4uYXJncylcblxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHNldE5lc3RlZChvYmplY3Q6IGFueSwgcGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgIGxldCB4ID0gb2JqZWN0XG5cbiAgICBwYXRoLnNsaWNlKDAsIC0xKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICB4ID0geFtwXVxuICAgIH0pXG5cbiAgICB4W3BhdGguYXQoLTEpIV0gPSB2YWx1ZVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCJcbi8qKlxuICogVHJ5IGdldHRpbmcgdGhlIG5hbWUgb2YgYW4gaHRtbCBlbGVtZW50IGZyb20gYSBwcm90b3R5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IHRhZ05hbWVGcm9tUHJvdG8gPSAoeDogb2JqZWN0KSA9PiB4LmNvbnN0cnVjdG9yLm5hbWVcbiAgICAucmVwbGFjZSgnSFRNTCcsICcnKVxuICAgIC5yZXBsYWNlKCdFbGVtZW50JywgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiIsIlxuLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCBvZiBwcmltaXRpdmVzIChudW1iZXJzLCBib29scywgc3RyaW5ncykuXG4gKiBDYXJlZnVsIHVzaW5nIHRoaXMgd2l0aCBvYmplY3RzLlxuICovXG5leHBvcnQgY29uc3QgdW5pcSA9ICh4OiBhbnlbXSkgPT4gQXJyYXkuZnJvbShuZXcgU2V0KHgpKVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL3NyYy9mYWNhZGUvYnJhaW4vQmFzaWNCcmFpblwiXG5pbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9zcmMvZmFjYWRlL2JyYWluL0JyYWluXCJcblxuY29uc3QgdGVzdHMgPSBbXG4gICAgdGVzdDEsXG4gICAgdGVzdDIsXG4gICAgdGVzdDMsXG4gICAgdGVzdDQsXG4gICAgdGVzdDUsXG4gICAgdGVzdDYsXG4gICAgdGVzdDcsXG4gICAgdGVzdDgsXG4gICAgdGVzdDksXG4gICAgdGVzdDEwLFxuICAgIHRlc3QxMSxcbiAgICB0ZXN0MTIsXG4gICAgdGVzdDEzLFxuICAgIHRlc3QxNCxcbiAgICB0ZXN0MTUsXG4gICAgdGVzdDE2LFxuICAgIHRlc3QxNyxcbiAgICB0ZXN0MTgsXG4gICAgdGVzdDE5LFxuICAgIHRlc3QyMCxcbiAgICB0ZXN0MjEsXG4gICAgdGVzdDIyLFxuICAgIHRlc3QyMyxcbiAgICB0ZXN0MjQsXG4gICAgdGVzdDI1LFxuICAgIHRlc3QyNixcbiAgICB0ZXN0MjcsXG4gICAgdGVzdDI4LFxuICAgIHRlc3QyOSxcbiAgICB0ZXN0MzAsXG5dXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0ZXN0KClcbiAgICAgICAgY29uc29sZS5sb2coYCVjJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnfSAke3Rlc3QubmFtZX1gLCBgY29sb3I6JHtzdWNjZXNzID8gJ2dyZWVuJyA6ICdyZWQnfWApXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwKS8vNzVcbiAgICAgICAgY2xlYXIoKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC52YWx1ZXMubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ2EgYmxhY2sgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpXG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIHRlc3Q1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0NigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuXG5mdW5jdGlvbiB0ZXN0NygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0udGV4dENvbnRlbnQgPT0gJ2NhcHJhJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgncmVkJykubGVuZ3RoID09PSAwXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2dyZWVuJykubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MTAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0MTEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFuZCB3IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3cgYW5kIHogYXJlIGJsYWNrJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDQgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0MyAmJiBhc3NlcnQ0XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhcHBlbmRDaGlsZHMgeScpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmNoaWxkcmVuKS5pbmNsdWRlcyhicmFpbi5leGVjdXRlKCd5JylbMF0pXG59XG5cbmZ1bmN0aW9uIHRlc3QxMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24gYW5kIGl0IGlzIGdyZWVuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDE0KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIHggYW5kIHkgYXJlIHJlZCBhbmQgeiBpcyBncmVlbi4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIG5vdCByZWQuJylcblxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG5cbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG5cbn1cblxuZnVuY3Rpb24gdGVzdDE1KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBldmVyeSBidXR0b24gaXMgYmx1ZS4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ogaXMgcmVkLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgYnV0dG9uIGlzIG5vdCBibHVlLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDE2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uaGlkZGVuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBub3QgaGlkZGVuJylcbiAgICBjb25zdCBhc3NlcnQyID0gIWJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxNygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbicpXG4gICAgY29uc3QgeCA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXVxuICAgIHgub25jbGljayA9ICgpID0+IGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGNsaWNrcycpXG4gICAgcmV0dXJuIHguc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTgoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkLiB4IGlzIGEgYnV0dG9uIGFuZCB5IGlzIGEgZGl2LicpXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgcmVkIGJ1dHRvbiBpcyBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZGl2JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG5cbn1cblxuZnVuY3Rpb24gdGVzdDE5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIGlmIHggaXMgcmVkIHRoZW4geSBpcyBhIGdyZWVuIGJ1dHRvbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDIwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24gaWYgeCBpcyByZWQnKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG59XG5cbmZ1bmN0aW9uIHRlc3QyMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGNvbG9yIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDIyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QyMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIHJlZC4gZXZlcnkgcmVkIGlzIGEgYnV0dG9uJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDI0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkIGJ1dHRvbnMnKVxuICAgIGxldCBjbGlja3MgPSAnJ1xuICAgIGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd4J1xuICAgIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5vbmNsaWNrID0gKCkgPT4gY2xpY2tzICs9ICd5J1xuICAgIGJyYWluLmV4ZWN1dGUoJ2V2ZXJ5IGJ1dHRvbiBjbGlja3MnKVxuICAgIHJldHVybiBjbGlja3MgPT09ICd4eSdcbn1cblxuZnVuY3Rpb24gdGVzdDI1KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucy4geCBpcyByZWQgYW5kIHkgaXMgYmx1ZScpXG4gICAgYnJhaW4uZXhlY3V0ZSgndGhlIGJ1dHRvbiB0aGF0IGlzIGJsdWUgaXMgYmxhY2snKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2J1dHRvbnMgYXJlIHJlZCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCcpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQuIHogaXMgYmx1ZS4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zIGFyZSBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmx1ZSdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYmxhY2snKS5sZW5ndGggPT09IDJcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyOCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCdib3JkZXIgb2Ygc3R5bGUgb2YgeCBpcyBkb3R0ZWQteWVsbG93JylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5ib3JkZXIuaW5jbHVkZXMoJ2RvdHRlZCB5ZWxsb3cnKVxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDI5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyAxIGFuZCB5IGlzIDInKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYWRkcyB5JylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnaXQnKVswXSA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MzAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCc9ICBpcyBhIGNvcHVsYScpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCA9IHJlZCBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbn1cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIGNvbnN0IHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib2R5JylcbiAgICBkb2N1bWVudC5ib2R5ID0geFxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==