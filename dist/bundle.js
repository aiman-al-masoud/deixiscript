/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/actuator/actions/ConceptAction.ts":
/*!***************************************************!*\
  !*** ./app/src/actuator/actions/ConceptAction.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ConceptAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (this.clause.args && this.clause.predicate) {
            const adj = this.topLevel.theme.describe(this.clause.args[0])[0].root;
            context.config.setLexeme({
                root: adj,
                type: 'adjective',
                concepts: [this.clause.predicate.root],
            });
        }
    }
}
exports["default"] = ConceptAction;


/***/ }),

/***/ "./app/src/actuator/actions/CreateAction.ts":
/*!**************************************************!*\
  !*** ./app/src/actuator/actions/CreateAction.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../id/functions/getIncrementalId */ "./app/src/id/functions/getIncrementalId.ts");
const getProto_1 = __webpack_require__(/*! ../../lexer/functions/getProto */ "./app/src/lexer/functions/getProto.ts");
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
const newInstance_1 = __webpack_require__(/*! ../../utils/newInstance */ "./app/src/utils/newInstance.ts");
class CreateAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d;
        const localId = (_b = (_a = this.clause) === null || _a === void 0 ? void 0 : _a.args) === null || _b === void 0 ? void 0 : _b[0];
        const id = (_c = (0, getAction_1.lookup)(localId, context, this.topLevel)) !== null && _c !== void 0 ? _c : (0, getIncrementalId_1.getIncrementalId)();
        const predicate = this.clause.predicate;
        if (!predicate) {
            return;
        }
        if ((_d = context.enviro.get(id)) === null || _d === void 0 ? void 0 : _d.is(predicate)) { //  existence check prior to creating
            return;
        }
        const proto = (0, getProto_1.getProto)(predicate);
        if (!proto) {
            return;
        }
        const o = (0, newInstance_1.newInstance)(proto);
        init(o, context, id);
        context.enviro.set(id, o).set(predicate);
    }
}
exports["default"] = CreateAction;
function init(o, context, id) {
    var _a;
    if (o instanceof HTMLElement) {
        o.id = id + '';
        o.textContent = 'default';
        (_a = context === null || context === void 0 ? void 0 : context.enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
    }
}


/***/ }),

/***/ "./app/src/actuator/actions/EditAction.ts":
/*!************************************************!*\
  !*** ./app/src/actuator/actions/EditAction.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getIncrementalId_1 = __webpack_require__(/*! ../../id/functions/getIncrementalId */ "./app/src/id/functions/getIncrementalId.ts");
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../../clauses/functions/getOwnershipChain */ "./app/src/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../clauses/functions/topLevel */ "./app/src/clauses/functions/topLevel.ts");
const getTopLevelOwnerOf_1 = __webpack_require__(/*! ../../clauses/functions/getTopLevelOwnerOf */ "./app/src/clauses/functions/getTopLevelOwnerOf.ts");
class EditAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (this.clause.args && (0, topLevel_1.getTopLevel)(this.topLevel).includes(this.clause.args[0])) {
            this.forTopLevel(context);
        }
        else {
            this.forNonTopLevel(context);
        }
    }
    forTopLevel(context) {
        var _a;
        const localId = (_a = this.clause.args) === null || _a === void 0 ? void 0 : _a[0];
        const predicate = this.clause.predicate;
        if (!localId || !predicate) {
            return;
        }
        this.set(localId, predicate, [], context);
    }
    forNonTopLevel(context) {
        var _a;
        const localId = (_a = this.clause.args) === null || _a === void 0 ? void 0 : _a[0];
        const predicate = this.clause.predicate;
        if (!localId || !predicate) {
            return;
        }
        const ownerLocalId = (0, getTopLevelOwnerOf_1.getTopLevelOwnerOf)(localId, this.topLevel);
        if (!ownerLocalId) {
            return;
        }
        this.set(ownerLocalId, predicate, this.getProps(ownerLocalId), context);
    }
    set(localId, predicate, props, context) {
        var _a, _b;
        const id = (_a = (0, getAction_1.lookup)(localId, context, this.topLevel)) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
        const obj = (_b = context.enviro.get(id)) !== null && _b !== void 0 ? _b : context.enviro.set(id);
        obj.set(predicate, { props, negated: this.clause.negated });
    }
    getProps(topLevelEntity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this.topLevel, topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]); // ASSUME at least one
    }
}
exports["default"] = EditAction;


/***/ }),

/***/ "./app/src/actuator/actions/IfAction.ts":
/*!**********************************************!*\
  !*** ./app/src/actuator/actions/IfAction.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class IfAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        if (context.enviro.query(this.clause.theme).length > 0) {
            this.clause.rheme.flatList().forEach(c => {
                (0, getAction_1.getAction)(c, this.clause.rheme).run(context);
            });
        }
    }
}
exports["default"] = IfAction;


/***/ }),

/***/ "./app/src/actuator/actions/MultiAction.ts":
/*!*************************************************!*\
  !*** ./app/src/actuator/actions/MultiAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class MultiAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        const condition = this.clause.theme;
        context.enviro.query(condition).forEach(m => {
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

/***/ "./app/src/actuator/actions/RelationAction.ts":
/*!****************************************************!*\
  !*** ./app/src/actuator/actions/RelationAction.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class RelationAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a;
        const args = ((_a = this.clause.args) !== null && _a !== void 0 ? _a : [])
            .map(a => (0, getAction_1.lookup)(a, context, this.topLevel));
        if (!this.clause.predicate) {
            return;
        }
        const subject = context.enviro.get(args[0]);
        const object = context.enviro.get(args[1]);
        return subject === null || subject === void 0 ? void 0 : subject.set(this.clause.predicate, { args: object ? [object] : [] });
    }
}
exports["default"] = RelationAction;


/***/ }),

/***/ "./app/src/actuator/actions/SetAliasAction.ts":
/*!****************************************************!*\
  !*** ./app/src/actuator/actions/SetAliasAction.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getOwnershipChain_1 = __webpack_require__(/*! ../../clauses/functions/getOwnershipChain */ "./app/src/clauses/functions/getOwnershipChain.ts");
const topLevel_1 = __webpack_require__(/*! ../../clauses/functions/topLevel */ "./app/src/clauses/functions/topLevel.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../../id/functions/getIncrementalId */ "./app/src/id/functions/getIncrementalId.ts");
const Wrapper_1 = __webpack_require__(/*! ../../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const getProto_1 = __webpack_require__(/*! ../../lexer/functions/getProto */ "./app/src/lexer/functions/getProto.ts");
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
        const proto = (0, getProto_1.getProto)(protoName);
        (0, Wrapper_1.wrap)((0, getIncrementalId_1.getIncrementalId)(), proto).set(conceptName[0], { aliasPath: propsNames });
    }
}
exports["default"] = SetAliasAction;


/***/ }),

/***/ "./app/src/actuator/actions/WhenAction.ts":
/*!************************************************!*\
  !*** ./app/src/actuator/actions/WhenAction.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class WhenAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        const interval = setInterval(() => {
            if (context.enviro.query(this.clause.theme).length > 0) {
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

/***/ "./app/src/actuator/actions/getAction.ts":
/*!***********************************************!*\
  !*** ./app/src/actuator/actions/getAction.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lookup = exports.getAction = void 0;
const isConcept_1 = __webpack_require__(/*! ../../lexer/functions/isConcept */ "./app/src/lexer/functions/isConcept.ts");
const ConceptAction_1 = __importDefault(__webpack_require__(/*! ./ConceptAction */ "./app/src/actuator/actions/ConceptAction.ts"));
const CreateAction_1 = __importDefault(__webpack_require__(/*! ./CreateAction */ "./app/src/actuator/actions/CreateAction.ts"));
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/actuator/actions/EditAction.ts"));
const RelationAction_1 = __importDefault(__webpack_require__(/*! ./RelationAction */ "./app/src/actuator/actions/RelationAction.ts"));
const Imply_1 = __importDefault(__webpack_require__(/*! ../../clauses/Imply */ "./app/src/clauses/Imply.ts"));
const SetAliasAction_1 = __importDefault(__webpack_require__(/*! ./SetAliasAction */ "./app/src/actuator/actions/SetAliasAction.ts"));
const MultiAction_1 = __importDefault(__webpack_require__(/*! ./MultiAction */ "./app/src/actuator/actions/MultiAction.ts"));
const IfAction_1 = __importDefault(__webpack_require__(/*! ./IfAction */ "./app/src/actuator/actions/IfAction.ts"));
const WhenAction_1 = __importDefault(__webpack_require__(/*! ./WhenAction */ "./app/src/actuator/actions/WhenAction.ts"));
function getAction(clause, topLevel) {
    var _a, _b, _c, _d, _e;
    // TODO: prepositions, and be beware of 'of' 
    if (((_a = clause.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'iverb' || ((_b = clause.predicate) === null || _b === void 0 ? void 0 : _b.type) === 'mverb') {
        return new RelationAction_1.default(clause, topLevel);
    }
    // to create new concept or new instance thereof
    if (clause.args && topLevel.rheme.describe(clause.args[0]).some(x => (0, isConcept_1.isConcept)(x))) { // 
        return new ConceptAction_1.default(clause, topLevel);
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
function lookup(id, context, topLevel) {
    var _a;
    const maps = context.enviro.query(topLevel.theme); // 
    return (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[id]; //TODO could be undefined
}
exports.lookup = lookup;


/***/ }),

/***/ "./app/src/actuator/actuator/Actuator.ts":
/*!***********************************************!*\
  !*** ./app/src/actuator/actuator/Actuator.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActuator = void 0;
const BaseActuator_1 = __importDefault(__webpack_require__(/*! ./BaseActuator */ "./app/src/actuator/actuator/BaseActuator.ts"));
function getActuator() {
    return new BaseActuator_1.default();
}
exports.getActuator = getActuator;


/***/ }),

/***/ "./app/src/actuator/actuator/BaseActuator.ts":
/*!***************************************************!*\
  !*** ./app/src/actuator/actuator/BaseActuator.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getAction_1 = __webpack_require__(/*! ../actions/getAction */ "./app/src/actuator/actions/getAction.ts");
class BaseActuator {
    takeAction(clause, context) {
        const actions = clause.flatList().map(x => (0, getAction_1.getAction)(x, clause));
        actions.forEach(a => a.run(context));
    }
}
exports["default"] = BaseActuator;


/***/ }),

/***/ "./app/src/brain/BasicBrain.ts":
/*!*************************************!*\
  !*** ./app/src/brain/BasicBrain.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Actuator_1 = __webpack_require__(/*! ../actuator/actuator/Actuator */ "./app/src/actuator/actuator/Actuator.ts");
const toClause_1 = __webpack_require__(/*! ./toClause */ "./app/src/brain/toClause.ts");
const Parser_1 = __webpack_require__(/*! ../parser/interfaces/Parser */ "./app/src/parser/interfaces/Parser.ts");
const pointOut_1 = __webpack_require__(/*! ./pointOut */ "./app/src/brain/pointOut.ts");
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
class BasicBrain {
    constructor(context, actuator = (0, Actuator_1.getActuator)()) {
        this.context = context;
        this.actuator = actuator;
        this.context.config.prelude.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
            if (ast.type === 'macro') {
                this.context.config.setSyntax(ast);
                return [];
            }
            const clause = (0, toClause_1.toClause)(ast).simple;
            // console.log(clause.toString())
            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.context);
                return [];
            }
            else {
                const maps = this.context.enviro.query(clause);
                const ids = maps.flatMap(m => Object.values(m));
                const wrappers = ids.map(id => this.context.enviro.get(id));
                this.context.enviro.values.forEach(w => (0, pointOut_1.pointOut)(w, { turnOff: true }));
                wrappers.forEach(w => w ? (0, pointOut_1.pointOut)(w) : 0);
                return wrappers.flatMap(o => o ? (0, Wrapper_1.unwrap)(o) : []);
            }
        }).flat();
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/brain/Brain.ts":
/*!********************************!*\
  !*** ./app/src/brain/Brain.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const Context_1 = __webpack_require__(/*! ./Context */ "./app/src/brain/Context.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
function getBrain(opts) {
    return new BasicBrain_1.default((0, Context_1.getNewContext)(opts));
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/brain/Context.ts":
/*!**********************************!*\
  !*** ./app/src/brain/Context.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNewContext = void 0;
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
function getNewContext(opts) {
    return {
        enviro: (0, Enviro_1.default)(opts),
        config: (0, Config_1.getConfig)()
    };
}
exports.getNewContext = getNewContext;


/***/ }),

/***/ "./app/src/brain/pointOut.ts":
/*!***********************************!*\
  !*** ./app/src/brain/pointOut.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pointOut = void 0;
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
function pointOut(wrapper, opts) {
    const object = (0, Wrapper_1.unwrap)(wrapper);
    if (object instanceof HTMLElement) {
        object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
    }
}
exports.pointOut = pointOut;


/***/ }),

/***/ "./app/src/brain/toClause.ts":
/*!***********************************!*\
  !*** ./app/src/brain/toClause.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toClause = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../id/functions/getIncrementalId */ "./app/src/id/functions/getIncrementalId.ts");
const toVar_1 = __webpack_require__(/*! ../id/functions/toVar */ "./app/src/id/functions/toVar.ts");
const isVar_1 = __webpack_require__(/*! ../id/functions/isVar */ "./app/src/id/functions/isVar.ts");
const makeAllVars_1 = __webpack_require__(/*! ../clauses/functions/makeAllVars */ "./app/src/clauses/functions/makeAllVars.ts");
const propagateVarsOwned_1 = __webpack_require__(/*! ../clauses/functions/propagateVarsOwned */ "./app/src/clauses/functions/propagateVarsOwned.ts");
const resolveAnaphora_1 = __webpack_require__(/*! ../clauses/functions/resolveAnaphora */ "./app/src/clauses/functions/resolveAnaphora.ts");
function toClause(ast, args) {
    var _a, _b, _c, _d, _e, _f;
    if (!ast) {
        throw new Error(`Ast is undefined!`);
    }
    let result;
    if (ast.type === 'noun phrase') {
        result = nounPhraseToClause(ast, args);
    }
    else if ((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.relpron) {
        result = copulaSubClauseToClause(ast, args);
    }
    else if ((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.preposition) {
        result = complementToClause(ast, args);
    }
    else if (((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.subject) && (ast === null || ast === void 0 ? void 0 : ast.links.predicate)) {
        result = copulaSentenceToClause(ast, args);
    }
    else if (ast.type === 'and sentence') {
        result = andSentenceToClause(ast, args);
    }
    else if (((_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject) && ast.links.object) {
        result = mverbSentenceToClause(ast, args);
    }
    else if (((_e = ast.links) === null || _e === void 0 ? void 0 : _e.subject) && !ast.links.object) {
        result = iverbSentenceToClause(ast, args);
    }
    else if ((_f = ast.links) === null || _f === void 0 ? void 0 : _f.subconj) {
        result = complexSentenceToClause(ast, args);
    }
    if (result) {
        const c1 = (0, makeAllVars_1.makeAllVars)(result);
        const c2 = (0, resolveAnaphora_1.resolveAnaphora)(c1);
        const c3 = (0, propagateVarsOwned_1.propagateVarsOwned)(c2);
        return c3;
    }
    console.log({ ast });
    throw new Error(`Idk what to do with '${ast.type}'!`);
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c, _d;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subject = toClause((_b = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId });
    const predicate = toClause((_c = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId }).copy({ negate: !!((_d = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _d === void 0 ? void 0 : _d.negation) });
    const entities = subject.entities.concat(predicate.entities);
    const result = entities.some(e => (0, isVar_1.isVar)(e)) ? // assume any sentence with any var is an implication
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true });
    return result.copy({ sideEffecty: true });
}
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    const predicate = (_a = copulaSubClause === null || copulaSubClause === void 0 ? void 0 : copulaSubClause.links) === null || _a === void 0 ? void 0 : _a.predicate;
    return toClause(predicate, { subject: args === null || args === void 0 ? void 0 : args.subject })
        .copy({ sideEffecty: false });
}
function complementToClause(complement, args) {
    var _a, _b, _c, _d;
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const newId = (0, getIncrementalId_1.getIncrementalId)();
    const preposition = (_c = (_b = complement === null || complement === void 0 ? void 0 : complement.links) === null || _b === void 0 ? void 0 : _b.preposition) === null || _c === void 0 ? void 0 : _c.lexeme;
    if (!preposition) {
        throw new Error('No preposition!');
    }
    const nounPhrase = (_d = complement === null || complement === void 0 ? void 0 : complement.links) === null || _d === void 0 ? void 0 : _d['noun phrase'];
    return (0, Clause_1.clauseOf)(preposition, subjId, newId)
        .and(toClause(nounPhrase, { subject: newId }))
        .copy({ sideEffecty: false });
}
function nounPhraseToClause(nounPhrase, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const maybeId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subjectId = ((_b = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _b === void 0 ? void 0 : _b.uniquant) ? (0, toVar_1.toVar)(maybeId) : maybeId;
    const adjectives = (_e = (_d = (_c = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _c === void 0 ? void 0 : _c.adjective) === null || _d === void 0 ? void 0 : _d.list) !== null && _e !== void 0 ? _e : [];
    const noun = (_f = nounPhrase.links) === null || _f === void 0 ? void 0 : _f.subject;
    const complements = (_j = (_h = (_g = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _g === void 0 ? void 0 : _g.complement) === null || _h === void 0 ? void 0 : _h.list) !== null && _j !== void 0 ? _j : [];
    const subClause = (_k = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _k === void 0 ? void 0 : _k.subclause;
    const res = adjectives.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; })
        .concat((noun === null || noun === void 0 ? void 0 : noun.lexeme) ? [noun.lexeme] : [])
        .map(p => (0, Clause_1.clauseOf)(p, subjectId))
        .reduce((c1, c2) => c1.and(c2), Clause_1.emptyClause)
        .and(complements.map(c => toClause(c, { subject: subjectId })).reduce((c1, c2) => c1.and(c2), Clause_1.emptyClause))
        .and(subClause ? toClause(subClause, { subject: subjectId }) : Clause_1.emptyClause)
        .copy({ sideEffecty: false });
    return res;
}
function andSentenceToClause(ast, args) {
    var _a, _b, _c, _d, _e, _f;
    const left = toClause((_a = ast.links) === null || _a === void 0 ? void 0 : _a.left, args);
    const right = toClause((_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.right) === null || _c === void 0 ? void 0 : _c.list) === null || _d === void 0 ? void 0 : _d[0], args);
    if (((_f = (_e = ast.links) === null || _e === void 0 ? void 0 : _e.left) === null || _f === void 0 ? void 0 : _f.type) === 'copula sentence') {
        return left.and(right).copy({ sideEffecty: true });
    }
    else {
        const m = { [right.entities[0]]: left.entities[0] };
        const theme = left.theme.and(right.theme);
        const rheme = right.rheme.and(right.rheme.copy({ map: m }));
        return theme.and(rheme, { asRheme: true }).copy({ sideEffecty: true });
    }
}
function mverbSentenceToClause(ast, args) {
    var _a, _b, _c, _d, _e;
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const objId = (0, getIncrementalId_1.getIncrementalId)();
    const subject = toClause((_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjId });
    const object = toClause((_c = ast.links) === null || _c === void 0 ? void 0 : _c.object, { subject: objId });
    const mverb = (_e = (_d = ast.links) === null || _d === void 0 ? void 0 : _d.mverb) === null || _e === void 0 ? void 0 : _e.lexeme;
    if (!mverb) {
        throw new Error('no mverb in mverb sentence!');
    }
    const rheme = (0, Clause_1.clauseOf)(mverb, subjId, objId)
        .copy({ negate: !!ast.links.negation });
    const res = subject
        .and(object)
        .and(rheme, { asRheme: true })
        .copy({ sideEffecty: true });
    return res;
}
function iverbSentenceToClause(ast, args) {
    var _a, _b, _c, _d;
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const subject = toClause((_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjId });
    const iverb = (_d = (_c = ast.links) === null || _c === void 0 ? void 0 : _c.iverb) === null || _d === void 0 ? void 0 : _d.lexeme;
    if (!iverb) {
        throw new Error('no iverb in iverb sentence!');
    }
    const rheme = (0, Clause_1.clauseOf)(iverb, subjId)
        .copy({ negate: !!ast.links.negation });
    const res = subject
        .and(rheme, { asRheme: true })
        .copy({ sideEffecty: true });
    return res;
}
function complexSentenceToClause(ast, args) {
    var _a, _b, _c, _d;
    const subconj = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subconj) === null || _b === void 0 ? void 0 : _b.lexeme;
    const condition = toClause((_c = ast.links) === null || _c === void 0 ? void 0 : _c.condition, args);
    const consequence = toClause((_d = ast.links) === null || _d === void 0 ? void 0 : _d.consequence, args);
    const c = condition.implies(consequence).copy({ subjconj: subconj, sideEffecty: true }).simple;
    // console.log(c.toString())
    // throw new Error('work in progress!')
    return c;
}


/***/ }),

/***/ "./app/src/clauses/And.ts":
/*!********************************!*\
  !*** ./app/src/clauses/And.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const hashString_1 = __webpack_require__(/*! ../utils/hashString */ "./app/src/utils/hashString.ts");
const sortIds_1 = __webpack_require__(/*! ../id/functions/sortIds */ "./app/src/id/functions/sortIds.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const mockMap_1 = __webpack_require__(/*! ./functions/mockMap */ "./app/src/clauses/functions/mockMap.ts");
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

/***/ "./app/src/clauses/BasicClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/BasicClause.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const hashString_1 = __webpack_require__(/*! ../utils/hashString */ "./app/src/utils/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
const mockMap_1 = __webpack_require__(/*! ./functions/mockMap */ "./app/src/clauses/functions/mockMap.ts");
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

/***/ "./app/src/clauses/Clause.ts":
/*!***********************************!*\
  !*** ./app/src/clauses/Clause.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const EmptyClause_1 = __importDefault(__webpack_require__(/*! ./EmptyClause */ "./app/src/clauses/EmptyClause.ts"));
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
exports.emptyClause = new EmptyClause_1.default();


/***/ }),

/***/ "./app/src/clauses/EmptyClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/EmptyClause.ts ***!
  \****************************************/
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

/***/ "./app/src/clauses/Imply.ts":
/*!**********************************!*\
  !*** ./app/src/clauses/Imply.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const hashString_1 = __webpack_require__(/*! ../utils/hashString */ "./app/src/utils/hashString.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
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

/***/ "./app/src/clauses/functions/getOwnershipChain.ts":
/*!********************************************************!*\
  !*** ./app/src/clauses/functions/getOwnershipChain.ts ***!
  \********************************************************/
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

/***/ "./app/src/clauses/functions/getTopLevelOwnerOf.ts":
/*!*********************************************************!*\
  !*** ./app/src/clauses/functions/getTopLevelOwnerOf.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTopLevelOwnerOf = void 0;
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/functions/topLevel.ts");
function getTopLevelOwnerOf(id, tl) {
    const owners = tl.ownersOf(id);
    const maybe = owners
        .filter(o => (0, topLevel_1.getTopLevel)(tl).includes(o)).at(0);
    if (!maybe && owners.length > 0) {
        return getTopLevelOwnerOf(owners[0], tl);
    }
    else {
        return maybe;
    }
}
exports.getTopLevelOwnerOf = getTopLevelOwnerOf;


/***/ }),

/***/ "./app/src/clauses/functions/makeAllVars.ts":
/*!**************************************************!*\
  !*** ./app/src/clauses/functions/makeAllVars.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeAllVars = void 0;
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/id/functions/isVar.ts");
const toConst_1 = __webpack_require__(/*! ../../id/functions/toConst */ "./app/src/id/functions/toConst.ts");
function makeAllVars(clause) {
    const m = clause.entities
        .filter(x => (0, isVar_1.isVar)(x))
        .map(e => ({ [(0, toConst_1.toConst)(e)]: e }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
}
exports.makeAllVars = makeAllVars;


/***/ }),

/***/ "./app/src/clauses/functions/mockMap.ts":
/*!**********************************************!*\
  !*** ./app/src/clauses/functions/mockMap.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mockMap = void 0;
function mockMap(clause) {
    return clause.entities.map(e => ({ [e]: e })).reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
}
exports.mockMap = mockMap;


/***/ }),

/***/ "./app/src/clauses/functions/propagateVarsOwned.ts":
/*!*********************************************************!*\
  !*** ./app/src/clauses/functions/propagateVarsOwned.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.propagateVarsOwned = void 0;
const toVar_1 = __webpack_require__(/*! ../../id/functions/toVar */ "./app/src/id/functions/toVar.ts");
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/id/functions/isVar.ts");
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

/***/ "./app/src/clauses/functions/resolveAnaphora.ts":
/*!******************************************************!*\
  !*** ./app/src/clauses/functions/resolveAnaphora.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveAnaphora = void 0;
function resolveAnaphora(clause) {
    const m = clause.theme.query(clause.rheme)[0];
    return clause.copy({ map: m !== null && m !== void 0 ? m : {} });
}
exports.resolveAnaphora = resolveAnaphora;


/***/ }),

/***/ "./app/src/clauses/functions/topLevel.ts":
/*!***********************************************!*\
  !*** ./app/src/clauses/functions/topLevel.ts ***!
  \***********************************************/
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

/***/ "./app/src/config/BasicConfig.ts":
/*!***************************************!*\
  !*** ./app/src/config/BasicConfig.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicConfig = void 0;
const macroToSyntax_1 = __webpack_require__(/*! ../parser/macroToSyntax */ "./app/src/parser/macroToSyntax.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../parser/maxPrecedence */ "./app/src/parser/maxPrecedence.ts");
class BasicConfig {
    constructor(lexemeTypes, _lexemes, syntaxMap, prelude, staticDescPrecedence) {
        this.lexemeTypes = lexemeTypes;
        this._lexemes = _lexemes;
        this.syntaxMap = syntaxMap;
        this.prelude = prelude;
        this.staticDescPrecedence = staticDescPrecedence;
        this._syntaxList = this.getSyntaxList();
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme({ type: 'grammar', root: syntax.name });
            this.syntaxMap[syntax.name] = syntax.syntax;
            this._syntaxList = this.getSyntaxList();
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
    }
    getSyntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.staticDescPrecedence.concat(z);
    }
    get syntaxList() {
        return this._syntaxList;
        // return [
        //     'macro',
        //     'macropart',
        //     'taggedunion',
        //     'complex sentence',
        //     'and sentence',
        //     'copula sentence',
        //     'iverb sentence',
        //     'mverb sentence',
        //     'complement',
        //     'subclause',
        //     'noun phrase',
        // ]
    }
    get lexemes() {
        return this._lexemes;
    }
    setLexeme(lexeme) {
        this._lexemes = this._lexemes.filter(x => x.root !== lexeme.root);
        this._lexemes.push(lexeme);
    }
}
exports.BasicConfig = BasicConfig;


/***/ }),

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const BasicConfig_1 = __webpack_require__(/*! ./BasicConfig */ "./app/src/config/BasicConfig.ts");
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
const prelude_1 = __webpack_require__(/*! ./prelude */ "./app/src/config/prelude.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
function getConfig() {
    return new BasicConfig_1.BasicConfig(LexemeType_1.lexemeTypes, lexemes_1.lexemes, syntaxes_1.syntaxes, prelude_1.prelude, syntaxes_1.staticDescPrecedence);
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
'pronoun', 'any');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
exports.lexemes = [
    {
        root: 'have',
        type: 'mverb',
        irregularForms: ['have', 'has']
    },
    {
        root: 'button',
        type: 'noun',
        proto: 'HTMLButtonElement'
    },
    {
        root: 'div',
        type: 'noun',
        proto: 'HTMLDivElement'
    },
    {
        root: 'element',
        type: 'noun',
        proto: 'HTMLElement'
    },
    {
        root: 'list',
        type: 'noun',
        proto: 'Array'
    },
    {
        root: 'cat',
        type: 'noun'
    },
    {
        root: 'be',
        type: 'copula',
        irregularForms: ['is', 'are']
    },
    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },
    {
        root: 'do',
        type: 'hverb',
        irregularForms: ['do', 'does']
    },
    {
        root: 'some',
        type: 'existquant'
    },
    {
        root: 'every',
        type: 'uniquant'
    },
    {
        root: 'all',
        type: 'uniquant'
    },
    {
        root: 'any',
        type: 'uniquant'
    },
    {
        root: 'to',
        type: 'preposition'
    },
    {
        root: 'with',
        type: 'preposition'
    },
    {
        root: 'from',
        type: 'preposition'
    },
    {
        root: 'of',
        type: 'preposition'
    },
    {
        root: 'over',
        type: 'preposition'
    },
    {
        root: 'on',
        type: 'preposition'
    },
    {
        root: 'at',
        type: 'preposition'
    },
    {
        root: 'then',
        type: 'filler' // filler word, what about partial parsing?
    },
    {
        root: 'if',
        type: 'subconj'
    },
    {
        root: 'when',
        type: 'subconj'
    },
    {
        root: 'because',
        type: 'subconj'
    },
    {
        root: 'while',
        type: 'subconj'
    },
    {
        root: 'that',
        type: 'relpron'
    },
    {
        root: 'not',
        type: 'negation'
    },
    {
        root: 'the',
        type: 'defart'
    },
    {
        root: 'a',
        type: 'indefart'
    },
    {
        root: 'an',
        type: 'indefart'
    },
    {
        root: '.',
        type: 'fullstop'
    },
    {
        root: 'and',
        type: 'nonsubconj'
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
        root: 'it',
        type: 'pronoun'
    },
    {
        root: 'concept',
        type: 'noun',
        concepts: ['concept']
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
        root: 'object',
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
/**
 * Grammar
 */
syntaxes_1.constituentTypes.concat(LexemeType_1.lexemeTypes).forEach(g => {
    exports.lexemes.push({
        root: g,
        type: 'grammar'
    });
});


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
    'complement is preposition then noun phrase',
    `copula sentence is subject noun phrase 
        then copula 
        then optional negation 
        then predicate noun phrase`,
    `noun phrase is optional quantifier 
        then optional article 
        then zero  or  more adjectives 
        then optional subject noun or pronoun or mverb 
        then optional subclause 
        then zero or more complements `,
    'copulasubclause is relpron then copula then noun phrase',
    'subclause is copulasubclause',
    `and sentence is left copula sentence or noun phrase 
        then nonsubconj
        then one or more right and sentence or copula sentence or noun phrase`,
    `mverb sentence is subject noun phrase 
		then optional hverb
		then optional negation
		then mverb
		then object noun phrase`,
    `iverb sentence is subject noun phrase 
		then optional hverb
		then optional negation
		then iverb`,
    `simple sentence is copula sentence or iverb sentence or mverb sentence`,
    `cs2 is consequence simple sentence
      then subconj
      then condition simple sentence`,
    `cs1 is subconj 
    then condition simple sentence 
    then filler 
    then consequence simple sentence`,
    // domain
    'color is a concept',
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
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)(
// permanent
'macro', 'macropart', 'taggedunion', 
// extendible
'copula sentence', 'noun phrase', 'complement', 'subclause', 'and sentence', 'mverb sentence', 'iverb sentence', 'simple sentence', 'complex sentence', 'cs1');
exports.staticDescPrecedence = [
    'macro',
    'macropart',
    'taggedunion',
];
exports.syntaxes = {
    // permanent
    'macro': [
        { type: ['noun', 'grammar'], number: 1, role: 'noun' },
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
    // extendible
    'subclause': [],
    'noun phrase': [],
    'complement': [],
    'copula sentence': [],
    'and sentence': [],
    'mverb sentence': [],
    'iverb sentence': [],
    'simple sentence': [],
    'complex sentence': [],
    'cs1': []
};


/***/ }),

/***/ "./app/src/enviro/BaseEnviro.ts":
/*!**************************************!*\
  !*** ./app/src/enviro/BaseEnviro.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ./Wrapper */ "./app/src/enviro/Wrapper.ts");
class BaseEnviro {
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
    }
    get(id) {
        this.lastReferenced = id;
        return this.dictionary[id];
    }
    get values() {
        return Object.values(this.dictionary);
    }
    set(id, object) {
        var _a;
        this.lastReferenced = id;
        const placeholder = this.dictionary[id];
        return this.dictionary[id] = (_a = placeholder === null || placeholder === void 0 ? void 0 : placeholder.copy({ object: object })) !== null && _a !== void 0 ? _a : (0, Wrapper_1.wrap)(id, object);
    }
    query(query) {
        const universe = this.values
            .map(w => w.clause(query))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause);
        return universe.query(query, { it: this.lastReferenced });
    }
}
exports["default"] = BaseEnviro;


/***/ }),

/***/ "./app/src/enviro/BaseWrapper.ts":
/*!***************************************!*\
  !*** ./app/src/enviro/BaseWrapper.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ./Wrapper */ "./app/src/enviro/Wrapper.ts");
const topLevel_1 = __webpack_require__(/*! ../clauses/functions/topLevel */ "./app/src/clauses/functions/topLevel.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../clauses/functions/getOwnershipChain */ "./app/src/clauses/functions/getOwnershipChain.ts");
class BaseWrapper {
    constructor(object, id, isPlaceholder, aliases, simplePredicates) {
        var _a;
        if (aliases === void 0) { aliases = (_a = object.aliases) !== null && _a !== void 0 ? _a : {}; }
        if (simplePredicates === void 0) { simplePredicates = []; }
        this.object = object;
        this.id = id;
        this.isPlaceholder = isPlaceholder;
        this.aliases = aliases;
        this.simplePredicates = simplePredicates;
        object.aliases = aliases;
        object.simplePredicates = simplePredicates;
    }
    set(predicate, opts) {
        var _a;
        if (opts === null || opts === void 0 ? void 0 : opts.args) {
            return this.call(predicate, opts.args);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath);
        }
        const props = (_a = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _a !== void 0 ? _a : [];
        if (this.isPlaceholder) {
            this.setSimplePredicate(predicate);
        }
        else if (props.length > 1) { // assume > 1 props are a path
            this.setMultiProp(props, predicate, opts);
        }
        else if (props.length === 1) {
            this.setSingleProp(predicate, props[0], opts);
        }
        else if (props.length === 0) {
            this.setZeroProps(predicate, opts);
        }
    }
    setMultiProp(path, value, opts) {
        if ((opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value)) {
            this.setNested(path.map(x => x.root), '');
        }
        else {
            this.setNested(path.map(x => x.root), value.root);
        }
    }
    is(predicate) {
        var _a, _b, _c;
        const path = (_c = this.aliases[(_b = (_a = predicate.concepts) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : '']) === null || _c === void 0 ? void 0 : _c.path;
        return path ?
            this.getNested(path) === predicate.root :
            this.isSimplePredicate(predicate);
    }
    isSimplePredicate(predicate) {
        return this.simplePredicates.map(x => x.root).includes(predicate.root);
    }
    setAlias(conceptName, propPath) {
        this.aliases[conceptName.root] = { path: propPath.map(x => x.root), lexeme: conceptName };
    }
    call(verb, args) {
        var _a, _b;
        const concept = (_a = this.aliases[verb.root]) === null || _a === void 0 ? void 0 : _a.path;
        const methodName = (_b = concept === null || concept === void 0 ? void 0 : concept[0]) !== null && _b !== void 0 ? _b : verb.root;
        return this === null || this === void 0 ? void 0 : this.object[methodName](...args.map(x => (0, Wrapper_1.unwrap)(x)));
    }
    clause(query) {
        const preds = Object.keys(this.aliases)
            .map(k => this.getNested(this.aliases[k].path))
            .map((x) => ({ root: x, type: 'adjective' }))
            .concat(this.simplePredicates);
        let res = preds
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), Clause_1.emptyClause);
        return res.and(this.extraInfo(query));
    }
    extraInfo(query) {
        var _a, _b, _c;
        if (query) {
            const oc = (0, getOwnershipChain_1.getOwnershipChain)(query, (0, topLevel_1.getTopLevel)(query)[0]);
            const path = oc.map(x => { var _a, _b; return (_b = (_a = query.describe(x)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.root; }).slice(1);
            const nested = this.getNested((_c = (_b = (_a = this.aliases) === null || _a === void 0 ? void 0 : _a[path === null || path === void 0 ? void 0 : path[0]]) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : path);
            if (nested !== undefined) {
                const data = query.copy({ map: { [oc[0]]: this.id } });
                return data;
            }
        }
        return Clause_1.emptyClause;
    }
    setSingleProp(value, prop, opts) {
        var _a, _b;
        const path = (_b = (_a = this.aliases[prop.root]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : [prop.root];
        if (!(opts === null || opts === void 0 ? void 0 : opts.negated)) {
            this.setNested(path, value.root);
        }
        else if ((opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value)) {
            this.setNested(path, '');
        }
    }
    setZeroProps(predicate, opts) {
        var _a, _b;
        const path = (_b = this.aliases[(_a = predicate === null || predicate === void 0 ? void 0 : predicate.concepts) === null || _a === void 0 ? void 0 : _a[0]]) === null || _b === void 0 ? void 0 : _b.path;
        if (path) {
            if (!(opts === null || opts === void 0 ? void 0 : opts.negated)) {
                this.setNested(path, predicate.root);
            }
            else if ((opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(predicate)) {
                this.setNested(path, '');
            }
        }
        else if (typeof this.object[predicate.root] === 'boolean') {
            this.object[predicate.root] = !(opts === null || opts === void 0 ? void 0 : opts.negated);
        }
        else {
            this.setSimplePredicate(predicate);
        }
    }
    setSimplePredicate(predicate) {
        this.simplePredicates.push(predicate); //TODO: check duplicates!
    }
    setNested(path, value) {
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
    typeOf(word) {
        var _a, _b, _c;
        const path = (_b = (_a = this.aliases[word]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : [word];
        const w = this.getNested(path);
        if (typeof w === 'function') {
            return ((_c = w.length) !== null && _c !== void 0 ? _c : 0) > 0 ? 'mverb' : 'iverb';
        }
        if (w === undefined) {
            return undefined;
        }
        return 'noun';
    }
    copy(opts) {
        var _a;
        const copy = new BaseWrapper((_a = opts === null || opts === void 0 ? void 0 : opts.object) !== null && _a !== void 0 ? _a : this.copyWrapped(), this.id, (opts === null || opts === void 0 ? void 0 : opts.object) ? false : this.isPlaceholder);
        this.simplePredicates.forEach(x => copy.set(x));
        return copy;
    }
    copyWrapped() {
        if (this.object instanceof HTMLElement) {
            const wrapped = this.object.cloneNode();
            wrapped.innerHTML = this.object.innerHTML;
            return wrapped;
        }
        else {
            return Object.assign({}, this.object);
        }
    }
}
exports["default"] = BaseWrapper;


/***/ }),

/***/ "./app/src/enviro/Enviro.ts":
/*!**********************************!*\
  !*** ./app/src/enviro/Enviro.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BaseEnviro_1 = __importDefault(__webpack_require__(/*! ./BaseEnviro */ "./app/src/enviro/BaseEnviro.ts"));
function getEnviro(opts) {
    return new BaseEnviro_1.default(opts === null || opts === void 0 ? void 0 : opts.root);
}
exports["default"] = getEnviro;


/***/ }),

/***/ "./app/src/enviro/Wrapper.ts":
/*!***********************************!*\
  !*** ./app/src/enviro/Wrapper.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unwrap = exports.wrap = void 0;
const BaseWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseWrapper */ "./app/src/enviro/BaseWrapper.ts"));
function wrap(id, o) {
    return new BaseWrapper_1.default(o !== null && o !== void 0 ? o : {}, id, o === undefined);
}
exports.wrap = wrap;
function unwrap(wrapper) {
    return wrapper.object;
}
exports.unwrap = unwrap;


/***/ }),

/***/ "./app/src/id/functions/getIncrementalId.ts":
/*!**************************************************!*\
  !*** ./app/src/id/functions/getIncrementalId.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIncrementalId = void 0;
const toVar_1 = __webpack_require__(/*! ./toVar */ "./app/src/id/functions/toVar.ts");
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

/***/ "./app/src/id/functions/idToNum.ts":
/*!*****************************************!*\
  !*** ./app/src/id/functions/idToNum.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idToNum = void 0;
function idToNum(id) {
    return parseInt(id.toString().replaceAll(/\D+/g, ''));
}
exports.idToNum = idToNum;


/***/ }),

/***/ "./app/src/id/functions/isVar.ts":
/*!***************************************!*\
  !*** ./app/src/id/functions/isVar.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVar = void 0;
function isVar(e) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase());
}
exports.isVar = isVar;


/***/ }),

/***/ "./app/src/id/functions/sortIds.ts":
/*!*****************************************!*\
  !*** ./app/src/id/functions/sortIds.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sortIds = void 0;
const idToNum_1 = __webpack_require__(/*! ./idToNum */ "./app/src/id/functions/idToNum.ts");
/**
 * Sort ids in ascending order.
 */
function sortIds(ids) {
    return ids.sort((a, b) => (0, idToNum_1.idToNum)(a) - (0, idToNum_1.idToNum)(b));
}
exports.sortIds = sortIds;


/***/ }),

/***/ "./app/src/id/functions/toConst.ts":
/*!*****************************************!*\
  !*** ./app/src/id/functions/toConst.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toConst = void 0;
function toConst(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase();
}
exports.toConst = toConst;


/***/ }),

/***/ "./app/src/id/functions/toVar.ts":
/*!***************************************!*\
  !*** ./app/src/id/functions/toVar.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toVar = void 0;
function toVar(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase();
}
exports.toVar = toVar;


/***/ }),

/***/ "./app/src/index.ts":
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/
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
const main_1 = __importDefault(__webpack_require__(/*! ./main/main */ "./app/src/main/main.ts"));
const autotester_1 = __importDefault(__webpack_require__(/*! ./tests/autotester */ "./app/src/tests/autotester.ts"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, autotester_1.default)();
    (0, main_1.default)();
}))();


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getLexemes_1 = __webpack_require__(/*! ./functions/getLexemes */ "./app/src/lexer/functions/getLexemes.ts");
const respace_1 = __webpack_require__(/*! ./functions/respace */ "./app/src/lexer/functions/respace.ts");
const stdspace_1 = __webpack_require__(/*! ./functions/stdspace */ "./app/src/lexer/functions/stdspace.ts");
const joinMultiWordLexemes_1 = __webpack_require__(/*! ./functions/joinMultiWordLexemes */ "./app/src/lexer/functions/joinMultiWordLexemes.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        const words = (0, joinMultiWordLexemes_1.joinMultiWordLexemes)((0, stdspace_1.stdspace)(sourceCode), context.config.lexemes)
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .map(s => (0, respace_1.respace)(s));
        this.tokens = words.flatMap(w => (0, getLexemes_1.getLexemes)(w, context, words));
        this._pos = 0;
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

/***/ "./app/src/lexer/Lexer.ts":
/*!********************************!*\
  !*** ./app/src/lexer/Lexer.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexer = void 0;
const EagerLexer_1 = __importDefault(__webpack_require__(/*! ./EagerLexer */ "./app/src/lexer/EagerLexer.ts"));
function getLexer(sourceCode, context) {
    return new EagerLexer_1.default(sourceCode, context);
}
exports.getLexer = getLexer;


/***/ }),

/***/ "./app/src/lexer/functions/conjugate.ts":
/*!**********************************************!*\
  !*** ./app/src/lexer/functions/conjugate.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.conjugate = void 0;
function conjugate(lexeme) {
    var _a;
    const word = (_a = lexeme.token) !== null && _a !== void 0 ? _a : lexeme.root;
    if (lexeme.irregularForms) {
        return [word, ...lexeme.irregularForms];
    }
    return [word, `${word}s`];
}
exports.conjugate = conjugate;


/***/ }),

/***/ "./app/src/lexer/functions/dynamicLexeme.ts":
/*!**************************************************!*\
  !*** ./app/src/lexer/functions/dynamicLexeme.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dynamicLexeme = void 0;
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const stem_1 = __webpack_require__(/*! ./stem */ "./app/src/lexer/functions/stem.ts");
function dynamicLexeme(word, context, words) {
    var _a;
    const stemmedWord = (0, stem_1.stem)({ root: word, type: 'any' });
    const types = words
        .map(w => (0, Clause_1.clauseOf)({ root: w, type: 'any' }, 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x === null || x === void 0 ? void 0 : x.typeOf(stemmedWord))
        .filter(x => x !== undefined);
    return { root: stemmedWord, type: (_a = types[0]) !== null && _a !== void 0 ? _a : 'noun' };
}
exports.dynamicLexeme = dynamicLexeme;


/***/ }),

/***/ "./app/src/lexer/functions/getLexemes.ts":
/*!***********************************************!*\
  !*** ./app/src/lexer/functions/getLexemes.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexemes = void 0;
const conjugate_1 = __webpack_require__(/*! ./conjugate */ "./app/src/lexer/functions/conjugate.ts");
const dynamicLexeme_1 = __webpack_require__(/*! ./dynamicLexeme */ "./app/src/lexer/functions/dynamicLexeme.ts");
function getLexemes(word, context, words) {
    var _a;
    const lexeme = (_a = context
        .config
        .lexemes
        .filter(x => (0, conjugate_1.conjugate)(x).includes(word))
        .at(0)) !== null && _a !== void 0 ? _a : (0, dynamicLexeme_1.dynamicLexeme)(word, context, words);
    const lexeme2 = Object.assign(Object.assign({}, lexeme), { token: word });
    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lexeme2];
}
exports.getLexemes = getLexemes;


/***/ }),

/***/ "./app/src/lexer/functions/getProto.ts":
/*!*********************************************!*\
  !*** ./app/src/lexer/functions/getProto.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProto = void 0;
function getProto(lexeme) {
    var _a, _b;
    return (_b = (_a = window) === null || _a === void 0 ? void 0 : _a[lexeme.proto]) === null || _b === void 0 ? void 0 : _b.prototype;
}
exports.getProto = getProto;


/***/ }),

/***/ "./app/src/lexer/functions/isConcept.ts":
/*!**********************************************!*\
  !*** ./app/src/lexer/functions/isConcept.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isConcept = void 0;
function isConcept(lexeme) {
    var _a;
    return (_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.concepts) === null || _a === void 0 ? void 0 : _a.includes('concept');
}
exports.isConcept = isConcept;


/***/ }),

/***/ "./app/src/lexer/functions/isMultiWord.ts":
/*!************************************************!*\
  !*** ./app/src/lexer/functions/isMultiWord.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isMultiWord = void 0;
function isMultiWord(lexeme) {
    return lexeme.root.includes(' ');
}
exports.isMultiWord = isMultiWord;


/***/ }),

/***/ "./app/src/lexer/functions/joinMultiWordLexemes.ts":
/*!*********************************************************!*\
  !*** ./app/src/lexer/functions/joinMultiWordLexemes.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.joinMultiWordLexemes = void 0;
const isMultiWord_1 = __webpack_require__(/*! ./isMultiWord */ "./app/src/lexer/functions/isMultiWord.ts");
const stdspace_1 = __webpack_require__(/*! ./stdspace */ "./app/src/lexer/functions/stdspace.ts");
const unspace_1 = __webpack_require__(/*! ./unspace */ "./app/src/lexer/functions/unspace.ts");
function joinMultiWordLexemes(sourceCode, lexemes) {
    let newSource = sourceCode;
    lexemes
        .filter(x => (0, isMultiWord_1.isMultiWord)(x))
        .forEach(x => {
        const lexeme = (0, stdspace_1.stdspace)(x.root);
        newSource = newSource.replaceAll(lexeme, (0, unspace_1.unspace)(lexeme));
    });
    return newSource;
}
exports.joinMultiWordLexemes = joinMultiWordLexemes;


/***/ }),

/***/ "./app/src/lexer/functions/respace.ts":
/*!********************************************!*\
  !*** ./app/src/lexer/functions/respace.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.respace = void 0;
function respace(string) {
    return string.replaceAll('-', ' ');
}
exports.respace = respace;


/***/ }),

/***/ "./app/src/lexer/functions/stdspace.ts":
/*!*********************************************!*\
  !*** ./app/src/lexer/functions/stdspace.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stdspace = void 0;
function stdspace(string) {
    return string.replaceAll(/\s+/g, ' ');
}
exports.stdspace = stdspace;


/***/ }),

/***/ "./app/src/lexer/functions/stem.ts":
/*!*****************************************!*\
  !*** ./app/src/lexer/functions/stem.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stem = void 0;
function stem(lexeme) {
    var _a;
    const word = (_a = lexeme.token) !== null && _a !== void 0 ? _a : lexeme.root;
    if (lexeme.irregularForms) {
        return word;
    }
    if (word.endsWith('s')) {
        return word.slice(0, -1);
    }
    return word;
}
exports.stem = stem;


/***/ }),

/***/ "./app/src/lexer/functions/unspace.ts":
/*!********************************************!*\
  !*** ./app/src/lexer/functions/unspace.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unspace = void 0;
function unspace(string) {
    return string.replaceAll(' ', '-');
}
exports.unspace = unspace;


/***/ }),

/***/ "./app/src/main/main.ts":
/*!******************************!*\
  !*** ./app/src/main/main.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Brain_1 = __webpack_require__(/*! ../brain/Brain */ "./app/src/brain/Brain.ts");
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

/***/ "./app/src/parser/KoolParser.ts":
/*!**************************************!*\
  !*** ./app/src/parser/KoolParser.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/lexer/Lexer.ts");
const Cardinality_1 = __webpack_require__(/*! ./interfaces/Cardinality */ "./app/src/parser/interfaces/Cardinality.ts");
class KoolParser {
    constructor(sourceCode, context, lexer = (0, Lexer_1.getLexer)(sourceCode, context)) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.lexer = lexer;
        this.knownParse = (name, role) => {
            const members = this.context.config.getSyntax(name);
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
            for (const m of this.context.config.getSyntax(name)) {
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
            return this.context.config.lexemeTypes.includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.context.config.syntaxList);
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
        const syntax = this.context.config.getSyntax(ast.type);
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

/***/ "./app/src/parser/interfaces/Cardinality.ts":
/*!**************************************************!*\
  !*** ./app/src/parser/interfaces/Cardinality.ts ***!
  \**************************************************/
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

/***/ "./app/src/parser/interfaces/Parser.ts":
/*!*********************************************!*\
  !*** ./app/src/parser/interfaces/Parser.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const KoolParser_1 = __webpack_require__(/*! ../KoolParser */ "./app/src/parser/KoolParser.ts");
function getParser(sourceCode, context) {
    return new KoolParser_1.KoolParser(sourceCode, context);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/parser/macroToSyntax.ts":
/*!*****************************************!*\
  !*** ./app/src/parser/macroToSyntax.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.macroToSyntax = void 0;
function macroToSyntax(macro) {
    var _a, _b, _c, _d, _e, _f;
    const macroparts = (_c = (_b = (_a = macro === null || macro === void 0 ? void 0 : macro.links) === null || _a === void 0 ? void 0 : _a.macropart) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = (_f = (_e = (_d = macro === null || macro === void 0 ? void 0 : macro.links) === null || _d === void 0 ? void 0 : _d.noun) === null || _e === void 0 ? void 0 : _e.lexeme) === null || _f === void 0 ? void 0 : _f.root;
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

/***/ "./app/src/parser/maxPrecedence.ts":
/*!*****************************************!*\
  !*** ./app/src/parser/maxPrecedence.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.maxPrecedence = void 0;
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
const lenCompare = (a, b, syntaxes) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length;
};


/***/ }),

/***/ "./app/src/tests/autotester.ts":
/*!*************************************!*\
  !*** ./app/src/tests/autotester.ts ***!
  \*************************************/
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
const Brain_1 = __webpack_require__(/*! ../brain/Brain */ "./app/src/brain/Brain.ts");
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
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log(test() ? 'success' : 'fail', test.name);
            yield sleep(10); //75
            clearDom();
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
    const assert1 = brain.context.enviro.values.length === 1;
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
function sleep(millisecs) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs);
    });
}
function clearDom() {
    document.body.innerHTML = '';
    document.body.style.background = 'white';
}


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
 */
function newInstance(proto) {
    return proto instanceof HTMLElement ?
        document.createElement((0, tagNameFromProto_1.tagNameFromProto)(proto)) :
        new proto.constructor();
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
/******/ 	var __webpack_exports__ = __webpack_require__("./app/src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQztLQUNoQztJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsT0FBTztRQUNiLGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7S0FDakM7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFlBQVk7S0FDckI7SUFFRDtRQUNJLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFFBQVEsQ0FBQywyQ0FBMkM7S0FDN0Q7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxP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QzlDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFMRCxnQ0FLQzs7Ozs7Ozs7Ozs7Ozs7QUNORCxnSEFBcUQ7QUFFckQ7OztHQUdHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLEtBQWE7SUFFckMsT0FBTyxLQUFLLFlBQVksV0FBVyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLGFBQWEsQ0FBQyx1Q0FBZ0IsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSyxLQUFhLENBQUMsV0FBVyxFQUFFO0FBRXhDLENBQUM7QUFORCxrQ0FNQzs7Ozs7Ozs7Ozs7Ozs7QUNaRCxTQUFnQixjQUFjLENBQW1CLEdBQUcsSUFBUyxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFwRix3Q0FBb0Y7Ozs7Ozs7Ozs7Ozs7O0FDQ3BGOztHQUVHO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJO0tBQzVELE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0tBQ25CLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0tBQ3RCLFdBQVcsRUFBRTtBQUhMLHdCQUFnQixvQkFHWDs7Ozs7Ozs7Ozs7Ozs7QUNObEI7OztHQUdHO0FBQ0ksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFRLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBM0MsWUFBSSxRQUF1Qzs7Ozs7OztVQ0x4RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0NvbmNlcHRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0NyZWF0ZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvRWRpdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvSWZBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL011bHRpQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9SZWxhdGlvbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvU2V0QWxpYXNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL1doZW5BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL3BvaW50T3V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRUb3BMZXZlbE93bmVyT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlQWxsVmFycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZnVuY3Rpb25zL21vY2tNYXAudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9CYXNpY0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9CYXNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvaXNWYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvc29ydElkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy90b0NvbnN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL3RvVmFyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2R5bmFtaWNMZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvZ2V0TGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9nZXRQcm90by50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9pc0NvbmNlcHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvaXNNdWx0aVdvcmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvam9pbk11bHRpV29yZExleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvcmVzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9zdGRzcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9zdGVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL3Vuc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvbmV3SW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3RhZ05hbWVGcm9tUHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNlcHRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5hcmdzICYmIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuXG4gICAgICAgICAgICBjb25zdCBhZGogPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pWzBdLnJvb3RcblxuICAgICAgICAgICAgY29udGV4dC5jb25maWcuc2V0TGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBhZGosXG4gICAgICAgICAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsIC8vVE9ETzogYmUgYWJsZSB0byBkZWNsYXJlIGFueSBraW5kIG9mIGxleGVtZSBsaWtlIHRoaXNcbiAgICAgICAgICAgICAgICBjb25jZXB0czogW3RoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290XSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBnZXRQcm90byB9IGZyb20gXCIuLi8uLi9sZXhlci9mdW5jdGlvbnMvZ2V0UHJvdG9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IG5ld0luc3RhbmNlIH0gZnJvbSBcIi4uLy4uL3V0aWxzL25ld0luc3RhbmNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2U/LmFyZ3M/LlswXSBhcyBJZFxuICAgICAgICBjb25zdCBpZCA9IGxvb2t1cChsb2NhbElkLCBjb250ZXh0LCB0aGlzLnRvcExldmVsKSA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKCFwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQuZW52aXJvLmdldChpZCk/LmlzKHByZWRpY2F0ZSkpIHsgIC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcmVkaWNhdGUpXG5cbiAgICAgICAgaWYgKCFwcm90bykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvID0gbmV3SW5zdGFuY2UocHJvdG8pXG4gICAgICAgIGluaXQobywgY29udGV4dCwgaWQpXG4gICAgICAgIGNvbnRleHQuZW52aXJvLnNldChpZCwgbykuc2V0KHByZWRpY2F0ZSlcblxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpbml0KG86IG9iamVjdCwgY29udGV4dDogQ29udGV4dCwgaWQ6IElkKSB7XG5cbiAgICBpZiAobyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG8uaWQgPSBpZCArICcnXG4gICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgY29udGV4dD8uZW52aXJvLnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgfVxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0VG9wTGV2ZWxPd25lck9mXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MgJiYgZ2V0VG9wTGV2ZWwodGhpcy50b3BMZXZlbCkuaW5jbHVkZXModGhpcy5jbGF1c2UuYXJnc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yTm9uVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvclRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KGxvY2FsSWQsIHByZWRpY2F0ZSwgW10sIGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvck5vblRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG93bmVyTG9jYWxJZCA9IGdldFRvcExldmVsT3duZXJPZihsb2NhbElkLCB0aGlzLnRvcExldmVsKVxuXG4gICAgICAgIGlmICghb3duZXJMb2NhbElkKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KG93bmVyTG9jYWxJZCwgcHJlZGljYXRlLCB0aGlzLmdldFByb3BzKG93bmVyTG9jYWxJZCksIGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldChsb2NhbElkOiBJZCwgcHJlZGljYXRlOiBMZXhlbWUsIHByb3BzOiBMZXhlbWVbXSwgY29udGV4dDogQ29udGV4dCkge1xuICAgICAgICBjb25zdCBpZCA9IGxvb2t1cChsb2NhbElkLCBjb250ZXh0LCB0aGlzLnRvcExldmVsKSA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3Qgb2JqID0gY29udGV4dC5lbnZpcm8uZ2V0KGlkKSA/PyBjb250ZXh0LmVudmlyby5zZXQoaWQpXG4gICAgICAgIG9iai5zZXQocHJlZGljYXRlLCB7IHByb3BzLCBuZWdhdGVkOiB0aGlzLmNsYXVzZS5uZWdhdGVkIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy50b3BMZXZlbCwgdG9wTGV2ZWxFbnRpdHkpXG4gICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKGUpWzBdKSAvLyBBU1NVTUUgYXQgbGVhc3Qgb25lXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWZBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKGNvbnRleHQuZW52aXJvLnF1ZXJ5KHRoaXMuY2xhdXNlLnRoZW1lKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY2xhdXNlLnJoZW1lLmZsYXRMaXN0KCkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG5cblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY2xhdXNlLnRoZW1lXG5cbiAgICAgICAgY29udGV4dC5lbnZpcm8ucXVlcnkoY29uZGl0aW9uKS5mb3JFYWNoKG0gPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNsYXVzZS5jb3B5KHsgbWFwOiBtLCBleGFjdElkczogdHJ1ZSB9KVxuICAgICAgICAgICAgY29uc3QgY29uc2VxID0gdG9wLnJoZW1lXG4gICAgICAgICAgICBjb25zdCBjbGF1c2VzID0gY29uc2VxLmZsYXRMaXN0KClcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2VzLm1hcChjID0+IGdldEFjdGlvbihjLCB0b3ApKVxuICAgICAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGEgPT4gYS5ydW4oY29udGV4dCkpXG5cbiAgICAgICAgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgbG9va3VwIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aW9uQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSAodGhpcy5jbGF1c2UuYXJncyA/PyBbXSlcbiAgICAgICAgICAgIC5tYXAoYSA9PiBsb29rdXAoYSwgY29udGV4dCwgdGhpcy50b3BMZXZlbCkpXG5cbiAgICAgICAgaWYgKCF0aGlzLmNsYXVzZS5wcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGNvbnRleHQuZW52aXJvLmdldChhcmdzWzBdKVxuICAgICAgICBjb25zdCBvYmplY3QgPSBjb250ZXh0LmVudmlyby5nZXQoYXJnc1sxXSlcblxuICAgICAgICByZXR1cm4gc3ViamVjdD8uc2V0KHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgeyBhcmdzOiBvYmplY3QgPyBbb2JqZWN0XSA6IFtdIH0pXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi8uLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvZnVuY3Rpb25zL2dldFByb3RvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXRBbGlhc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY2xhdXNlLnRoZW1lXG4gICAgICAgIGNvbnN0IGNvbnNlcXVlbmNlID0gdGhpcy5jbGF1c2UucmhlbWVcblxuICAgICAgICBjb25zdCB0b3AgPSBnZXRUb3BMZXZlbChjb25kaXRpb24pWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSBnZXRPd25lcnNoaXBDaGFpbihjb25kaXRpb24sIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBnZXRPd25lcnNoaXBDaGFpbihjb25zZXF1ZW5jZSwgdG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBjb25jZXB0TmFtZSA9IGFsaWFzLm1hcCh4ID0+IGNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiBjb25zZXF1ZW5jZS5kZXNjcmliZSh4KVswXSkgLy8gc2FtZSAuLi5cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG5cbiAgICAgICAgd3JhcChnZXRJbmNyZW1lbnRhbElkKCksIHByb3RvKS5zZXQoY29uY2VwdE5hbWVbMF0sIHsgYWxpYXNQYXRoOiBwcm9wc05hbWVzIH0pXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2hlbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblxuICAgICAgICAgICAgaWYgKGNvbnRleHQuZW52aXJvLnF1ZXJ5KHRoaXMuY2xhdXNlLnRoZW1lKS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZS5yaGVtZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdldEFjdGlvbihjLCB0aGlzLmNsYXVzZS5yaGVtZSkucnVuKGNvbnRleHQpXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSwgMTAwKVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBpc0NvbmNlcHQgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvZnVuY3Rpb25zL2lzQ29uY2VwdFwiXG5pbXBvcnQgQ29uY2VwdEFjdGlvbiBmcm9tIFwiLi9Db25jZXB0QWN0aW9uXCJcbmltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCJcbmltcG9ydCBFZGl0QWN0aW9uIGZyb20gXCIuL0VkaXRBY3Rpb25cIlxuaW1wb3J0IFJlbGF0aW9uQWN0aW9uIGZyb20gXCIuL1JlbGF0aW9uQWN0aW9uXCJcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JbXBseVwiXG5pbXBvcnQgU2V0QWxpYXNBY3Rpb24gZnJvbSBcIi4vU2V0QWxpYXNBY3Rpb25cIlxuaW1wb3J0IE11bHRpQWN0aW9uIGZyb20gXCIuL011bHRpQWN0aW9uXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCJcbmltcG9ydCBJZkFjdGlvbiBmcm9tIFwiLi9JZkFjdGlvblwiXG5pbXBvcnQgV2hlbkFjdGlvbiBmcm9tIFwiLi9XaGVuQWN0aW9uXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9uKGNsYXVzZTogQ2xhdXNlLCB0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uIHtcblxuICAgIC8vIFRPRE86IHByZXBvc2l0aW9ucywgYW5kIGJlIGJld2FyZSBvZiAnb2YnIFxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnaXZlcmInIHx8IGNsYXVzZS5wcmVkaWNhdGU/LnR5cGUgPT09ICdtdmVyYicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWxhdGlvbkFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIC8vIHRvIGNyZWF0ZSBuZXcgY29uY2VwdCBvciBuZXcgaW5zdGFuY2UgdGhlcmVvZlxuICAgIGlmIChjbGF1c2UuYXJncyAmJiB0b3BMZXZlbC5yaGVtZS5kZXNjcmliZShjbGF1c2UuYXJnc1swXSkuc29tZSh4ID0+IGlzQ29uY2VwdCh4KSkpIHsgLy8gXG4gICAgICAgIHJldHVybiBuZXcgQ29uY2VwdEFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy5wcm90bykge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2UudGhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS50aGVtZS5vd25lcnNPZihlKS5sZW5ndGgpICYmIGNsYXVzZS5yaGVtZS5lbnRpdGllcy5zb21lKGUgPT4gY2xhdXNlLnJoZW1lLm93bmVyc09mKGUpLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXRBbGlhc0FjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ2lmJykge1xuICAgICAgICByZXR1cm4gbmV3IElmQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnN1Ympjb25qPy5yb290ID09PSAnd2hlbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXaGVuQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAoaWQ6IElkLCBjb250ZXh0OiBDb250ZXh0LCB0b3BMZXZlbDogQ2xhdXNlKSB7XG4gICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KHRvcExldmVsLnRoZW1lKSAvLyBcbiAgICByZXR1cm4gbWFwcz8uWzBdPy5baWRdIC8vVE9ETyBjb3VsZCBiZSB1bmRlZmluZWRcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IEFjdHVhdG9yIH0gZnJvbSBcIi4vQWN0dWF0b3JcIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuLi9hY3Rpb25zL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZS5mbGF0TGlzdCgpLm1hcCh4ID0+IGdldEFjdGlvbih4LCBjbGF1c2UpKVxuICAgICAgICBhY3Rpb25zLmZvckVhY2goYSA9PiBhLnJ1bihjb250ZXh0KSlcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4vdG9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCI7XG5pbXBvcnQgeyBwb2ludE91dCB9IGZyb20gXCIuL3BvaW50T3V0XCI7XG5pbXBvcnQgeyB1bndyYXAgfSBmcm9tIFwiLi4vZW52aXJvL1dyYXBwZXJcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jb25maWcucHJlbHVkZS5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdCkuc2ltcGxlXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSlcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCB3cmFwcGVycyA9IGlkcy5tYXAoaWQgPT4gdGhpcy5jb250ZXh0LmVudmlyby5nZXQoaWQpKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmVudmlyby52YWx1ZXMuZm9yRWFjaCh3ID0+IHBvaW50T3V0KHcsIHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICB3cmFwcGVycy5mb3JFYWNoKHcgPT4gdyA/IHBvaW50T3V0KHcpIDogMClcblxuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVycy5mbGF0TWFwKG8gPT4gbyA/IHVud3JhcChvKSA6IFtdKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pLmZsYXQoKVxuICAgIH1cblxufSIsImltcG9ydCB7IEdldENvbnRleHRPcHRzLCBnZXROZXdDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QnJhaW5PcHRzIGV4dGVuZHMgR2V0Q29udGV4dE9wdHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbihvcHRzOiBHZXRCcmFpbk9wdHMpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKGdldE5ld0NvbnRleHQob3B0cykpXG59XG4iLCJpbXBvcnQgeyBDb25maWcsIGdldENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5pbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IHtcbiAgICByZWFkb25seSBlbnZpcm86IEVudmlyb1xuICAgIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dE9wdHMgZXh0ZW5kcyBHZXRFbnZpcm9PcHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDb250ZXh0KG9wdHM6IEdldENvbnRleHRPcHRzKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW52aXJvOiBnZXRFbnZpcm8ob3B0cyksXG4gICAgICAgIGNvbmZpZzogZ2V0Q29uZmlnKClcbiAgICB9XG59IiwiaW1wb3J0IFdyYXBwZXIsIHsgdW53cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludE91dCh3cmFwcGVyOiBXcmFwcGVyLCBvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pIHtcblxuICAgIGNvbnN0IG9iamVjdCA9IHVud3JhcCh3cmFwcGVyKVxuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCI7XG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvaXNWYXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgbWFrZUFsbFZhcnMgfSBmcm9tIFwiLi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnNcIjtcbmltcG9ydCB7IHByb3BhZ2F0ZVZhcnNPd25lZCB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWRcIjtcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmFcIjtcblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3QgaXMgdW5kZWZpbmVkIWApXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbm91biBwaHJhc2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnByZXBvc2l0aW9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZW1lbnRUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJqZWN0ICYmIGFzdD8ubGlua3MucHJlZGljYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdhbmQgc2VudGVuY2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJqZWN0ICYmIGFzdC5saW5rcy5vYmplY3QpIHtcbiAgICAgICAgcmVzdWx0ID0gbXZlcmJTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8uc3ViamVjdCAmJiAhYXN0LmxpbmtzLm9iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBpdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJjb25qKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMocmVzdWx0KVxuICAgICAgICBjb25zdCBjMiA9IHJlc29sdmVBbmFwaG9yYShjMSlcbiAgICAgICAgY29uc3QgYzMgPSBwcm9wYWdhdGVWYXJzT3duZWQoYzIpXG4gICAgICAgIHJldHVybiBjM1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHsgYXN0IH0pXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJZGsgd2hhdCB0byBkbyB3aXRoICcke2FzdC50eXBlfSchYClcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlPy5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICBjb25zdCBwcmVkaWNhdGUgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnByZWRpY2F0ZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkuY29weSh7IG5lZ2F0ZTogISFjb3B1bGFTZW50ZW5jZT8ubGlua3M/Lm5lZ2F0aW9uIH0pXG4gICAgY29uc3QgZW50aXRpZXMgPSBzdWJqZWN0LmVudGl0aWVzLmNvbmNhdChwcmVkaWNhdGUuZW50aXRpZXMpXG5cbiAgICBjb25zdCByZXN1bHQgPSBlbnRpdGllcy5zb21lKGUgPT4gaXNWYXIoZSkpID8gIC8vIGFzc3VtZSBhbnkgc2VudGVuY2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGxpY2F0aW9uXG4gICAgICAgIHN1YmplY3QuaW1wbGllcyhwcmVkaWNhdGUpIDpcbiAgICAgICAgc3ViamVjdC5hbmQocHJlZGljYXRlLCB7IGFzUmhlbWU6IHRydWUgfSlcblxuICAgIHJldHVybiByZXN1bHQuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZT8ubGlua3M/LnByZWRpY2F0ZVxuXG4gICAgcmV0dXJuIHRvQ2xhdXNlKHByZWRpY2F0ZSwgeyBzdWJqZWN0OiBhcmdzPy5zdWJqZWN0IH0pXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShjb21wbGVtZW50OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRJbmNyZW1lbnRhbElkKClcblxuICAgIGNvbnN0IHByZXBvc2l0aW9uID0gY29tcGxlbWVudD8ubGlua3M/LnByZXBvc2l0aW9uPy5sZXhlbWVcblxuICAgIGlmICghcHJlcG9zaXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBwcmVwb3NpdGlvbiEnKVxuICAgIH1cblxuICAgIGNvbnN0IG5vdW5QaHJhc2UgPSBjb21wbGVtZW50Py5saW5rcz8uWydub3VuIHBocmFzZSddXG5cbiAgICByZXR1cm4gY2xhdXNlT2YocHJlcG9zaXRpb24sIHN1YmpJZCwgbmV3SWQpXG4gICAgICAgIC5hbmQodG9DbGF1c2Uobm91blBocmFzZSwgeyBzdWJqZWN0OiBuZXdJZCB9KSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxufVxuXG5mdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2Uobm91blBocmFzZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtYXliZUlkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBub3VuUGhyYXNlPy5saW5rcz8udW5pcXVhbnQgPyB0b1ZhcihtYXliZUlkKSA6IG1heWJlSWRcblxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBub3VuUGhyYXNlPy5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3Qgbm91biA9IG5vdW5QaHJhc2UubGlua3M/LnN1YmplY3RcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5jb21wbGVtZW50Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ViQ2xhdXNlID0gbm91blBocmFzZT8ubGlua3M/LnN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG4gICAgICAgICAgICAuY29uY2F0KG5vdW4/LmxleGVtZSA/IFtub3VuLmxleGVtZV0gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSlcbiAgICAgICAgICAgIC5hbmQoY29tcGxlbWVudHMubWFwKGMgPT4gdG9DbGF1c2UoYywgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSkpXG4gICAgICAgICAgICAuYW5kKHN1YkNsYXVzZSA/IHRvQ2xhdXNlKHN1YkNsYXVzZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkgOiBlbXB0eUNsYXVzZSlcbiAgICAgICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IGxlZnQgPSB0b0NsYXVzZShhc3QubGlua3M/LmxlZnQsIGFyZ3MpXG4gICAgY29uc3QgcmlnaHQgPSB0b0NsYXVzZShhc3Q/LmxpbmtzPy5yaWdodD8ubGlzdD8uWzBdLCBhcmdzKVxuXG4gICAgaWYgKGFzdC5saW5rcz8ubGVmdD8udHlwZSA9PT0gJ2NvcHVsYSBzZW50ZW5jZScpIHtcbiAgICAgICAgcmV0dXJuIGxlZnQuYW5kKHJpZ2h0KS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtID0geyBbcmlnaHQuZW50aXRpZXNbMF1dOiBsZWZ0LmVudGl0aWVzWzBdIH1cbiAgICAgICAgY29uc3QgdGhlbWUgPSBsZWZ0LnRoZW1lLmFuZChyaWdodC50aGVtZSlcbiAgICAgICAgY29uc3QgcmhlbWUgPSByaWdodC5yaGVtZS5hbmQocmlnaHQucmhlbWUuY29weSh7IG1hcDogbSB9KSlcbiAgICAgICAgcmV0dXJuIHRoZW1lLmFuZChyaGVtZSwgeyBhc1JoZW1lOiB0cnVlIH0pLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBtdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgb2JqSWQgPSBnZXRJbmNyZW1lbnRhbElkKClcblxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViaklkIH0pXG4gICAgY29uc3Qgb2JqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqSWQgfSlcbiAgICBjb25zdCBtdmVyYiA9IGFzdC5saW5rcz8ubXZlcmI/LmxleGVtZVxuXG4gICAgaWYgKCFtdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIG12ZXJiIGluIG12ZXJiIHNlbnRlbmNlIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZihtdmVyYiwgc3ViaklkLCBvYmpJZClcbiAgICAgICAgLmNvcHkoeyBuZWdhdGU6ICEhYXN0LmxpbmtzLm5lZ2F0aW9uIH0pXG5cbiAgICBjb25zdCByZXMgPSBzdWJqZWN0XG4gICAgICAgIC5hbmQob2JqZWN0KVxuICAgICAgICAuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBpdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBpdmVyYiA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZVxuXG4gICAgaWYgKCFpdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGl2ZXJiIGluIGl2ZXJiIHNlbnRlbmNlIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZihpdmVyYiwgc3ViaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChyaGVtZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcblxuICAgIHJldHVybiByZXNcblxufVxuXG5mdW5jdGlvbiBjb21wbGV4U2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViY29uaiA9IGFzdC5saW5rcz8uc3ViY29uaj8ubGV4ZW1lXG4gICAgY29uc3QgY29uZGl0aW9uID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5jb25kaXRpb24sIGFyZ3MpXG4gICAgY29uc3QgY29uc2VxdWVuY2UgPSB0b0NsYXVzZShhc3QubGlua3M/LmNvbnNlcXVlbmNlLCBhcmdzKVxuXG4gICAgY29uc3QgYyA9IGNvbmRpdGlvbi5pbXBsaWVzKGNvbnNlcXVlbmNlKS5jb3B5KHsgc3ViamNvbmo6IHN1YmNvbmosIHNpZGVFZmZlY3R5OiB0cnVlIH0pLnNpbXBsZVxuXG4gICAgLy8gY29uc29sZS5sb2coYy50b1N0cmluZygpKVxuICAgIC8vIHRocm93IG5ldyBFcnJvcignd29yayBpbiBwcm9ncmVzcyEnKVxuXG4gICAgcmV0dXJuIGNcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHllcyA/IHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzIDogJydcbiAgICB9XG5cbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBhYm91dCA9IChpZDogSWQpOiBDbGF1c2UgPT4gdGhpcy5jbGF1c2UxLmFib3V0KGlkKS5hbmQodGhpcy5jbGF1c2UyLmFib3V0KGlkKSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCk6IExleGVtZVtdID0+IHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdW5pZnkocWU6IElkLCByZTogSWQsIHJlc3VsdDogTWFwW10pIHtcblxuICAgICAgICAgICAgY29uc3QgaSA9IHJlc3VsdC5maW5kSW5kZXgoeCA9PiAheFtxZV0pXG4gICAgICAgICAgICBjb25zdCBtID0gcmVzdWx0W2ldID8/IHt9XG4gICAgICAgICAgICBtW3FlXSA9IHJlXG4gICAgICAgICAgICByZXN1bHRbaSA+IC0xID8gaSA6IHJlc3VsdC5sZW5ndGhdID0gbVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCByZXN1bHQ6IE1hcFtdID0gW11cbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSlcblxuICAgICAgICBxdWVyeS5lbnRpdGllcy5mb3JFYWNoKHFlID0+IHtcbiAgICAgICAgICAgIHVuaXZlcnNlLmVudGl0aWVzLmZvckVhY2gocmUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmQgPSB1bml2ZXJzZS5hYm91dChyZSkuZmxhdExpc3QoKVxuICAgICAgICAgICAgICAgIGNvbnN0IHFkID0gcXVlcnkuYWJvdXQocWUpLmZsYXRMaXN0KClcbiAgICAgICAgICAgICAgICBjb25zdCByZDIgPSByZC5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3JlXTogcWUgfSB9KSkgLy8gc3Vic2l0dXRlIHJlIGJ5IHFlIGluIHJlYWwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAvLyBjb25zdCByZDIgPSAgcmRcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBhcmUgZWFjaCByZDIgdG8gZWFjaCBxZCwgaWYgcHJlZGljYXRlIGlzIHNhbWUgcmVwbGFjZSByIGFyZ3Mgd2l0aCBxIGFyZ3NcbiAgICAgICAgICAgICAgICByZDIuZm9yRWFjaCgociwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBxZC5mb3JFYWNoKHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIucHJlZGljYXRlID09PSBxLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG06IE1hcCA9IChyLmFyZ3MgPz8gW10pLm1hcCgoYSwgaSkgPT4gKHsgW2FdOiBxLmFyZ3M/LltpXSA/PyBhIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJkMltpXSA9IHIuY29weSh7IG1hcDogbSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHIudG9TdHJpbmcoKSwgJ21heSBiZSAnLCBxLnRvU3RyaW5nKCksICdyIGJlY29tZXMnLCByZDJbaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcWhhc2hlcyA9IHFkLm1hcCh4ID0+IHguaGFzaENvZGUpXG4gICAgICAgICAgICAgICAgY29uc3QgcjJoYXNoZXMgPSByZDIubWFwKHggPT4geC5oYXNoQ29kZSlcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdVbmlmeSBvciBub3Q/JywgJ3FkPScsIHFkLm1hcCh4PT54LnRvU3RyaW5nKCkpLCAncmQyPScsIHJkMi5tYXAoeD0+eC50b1N0cmluZygpKSlcblxuICAgICAgICAgICAgICAgIGlmIChxaGFzaGVzLmV2ZXJ5KHggPT4gcjJoYXNoZXMuaW5jbHVkZXMoeCkpKSB7IC8vIHFlIHVuaWZpZXMgd2l0aCByZSFcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocWUsICdpcycsIHJlLCAnIScpXG4gICAgICAgICAgICAgICAgICAgIHVuaWZ5KHFlLCByZSwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdCAmJiBxZC5zb21lKHggPT4geC5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pZnkocWUsIGl0LCByZXN1bHQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmFyZ3MpXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KHsgcHJlZGljYXRlOiB0aGlzLnByZWRpY2F0ZS5yb290LCBhcmdzOiB0aGlzLmFyZ3MsIG5lZ2F0ZWQ6IHRoaXMubmVnYXRlZCB9KSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKFxuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSAmJiB0aGlzLmFyZ3MubGVuZ3RoID09PSAxID8gW3RoaXMucHJlZGljYXRlXSA6IFtdXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAocXVlcnkuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW9ja01hcChxdWVyeSldXG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LmZsYXRMaXN0KClbMF0gLy9UT0RPISE/Pz9cblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEJhc2ljQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocXVlcnkucHJlZGljYXRlLnJvb3QgIT09IHRoaXMucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkcz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXNcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25zZXF1ZW5jZTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uc3ViamNvbmogPz8gdGhpcy5zdWJqY29uaixcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMgICBcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIC8vIHJldHVybiBlbXB0eUNsYXVzZSAvLy9UT0RPISEhISEhISFcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCwgdGw6IENsYXVzZSk6IElkIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG93bmVycyA9IHRsLm93bmVyc09mKGlkKVxuXG4gICAgY29uc3QgbWF5YmUgPSBvd25lcnNcbiAgICAgICAgLmZpbHRlcihvID0+IGdldFRvcExldmVsKHRsKS5pbmNsdWRlcyhvKSkuYXQoMClcblxuICAgIGlmICghbWF5YmUgJiYgb3duZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGdldFRvcExldmVsT3duZXJPZihvd25lcnNbMF0sIHRsKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBtYXliZVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCB7IHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvQ29uc3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2NrTWFwKGNsYXVzZTogQ2xhdXNlKTogTWFwIHtcbiAgICByZXR1cm4gY2xhdXNlLmVudGl0aWVzLm1hcChlID0+ICh7IFtlXTogZSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtID0gY2xhdXNlLnRoZW1lLnF1ZXJ5KGNsYXVzZS5yaGVtZSlbMF1cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gPz8ge30gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiXG5pbXBvcnQgeyBtYWNyb1RvU3ludGF4IH0gZnJvbSBcIi4uL3BhcnNlci9tYWNyb1RvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NvbmZpZyBpbXBsZW1lbnRzIENvbmZpZyB7XG5cbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3QgPSB0aGlzLmdldFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW10sXG4gICAgICAgIHByb3RlY3RlZCBfbGV4ZW1lczogTGV4ZW1lW10sXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheE1hcDogU3ludGF4TWFwLFxuICAgICAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXSxcbiAgICAgICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSxcbiAgICApIHtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcbiAgICB9XG5cbiAgICBnZXQgc3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10geyAvL1RPRE86IHJlLXNvcnQgb25seSB3aGVuIG5lZWRlZFxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zeW50YXhMaXN0XG5cbiAgICAgICAgLy8gcmV0dXJuIFtcbiAgICAgICAgLy8gICAgICdtYWNybycsXG4gICAgICAgIC8vICAgICAnbWFjcm9wYXJ0JyxcbiAgICAgICAgLy8gICAgICd0YWdnZWR1bmlvbicsXG4gICAgICAgIC8vICAgICAnY29tcGxleCBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdjb3B1bGEgc2VudGVuY2UnLFxuICAgICAgICAvLyAgICAgJ2l2ZXJiIHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdtdmVyYiBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgIC8vICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgLy8gICAgICdub3VuIHBocmFzZScsXG4gICAgICAgIC8vIF1cbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSkge1xuICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgcHJlbHVkZSB9IGZyb20gXCIuL3ByZWx1ZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3RhdGljRGVzY1ByZWNlZGVuY2UsIHN5bnRheGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UpXG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29udHJhY3Rpb24nLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICdpdmVyYicsXG4gICdtdmVyYicsXG4gICduZWdhdGlvbicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ2ZpbGxlcicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAge1xuICAgICAgICByb290OiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGlycmVndWxhckZvcm1zOiBbJ2hhdmUnLCAnaGFzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBwcm90bzogJ0hUTUxCdXR0b25FbGVtZW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkaXYnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTERpdkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2VsZW1lbnQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xpc3QnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnQXJyYXknXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBpcnJlZ3VsYXJGb3JtczogWydpcycsICdhcmUnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiaXNuJ3RcIixcbiAgICAgICAgdHlwZTogJ2NvbnRyYWN0aW9uJyxcbiAgICAgICAgY29udHJhY3Rpb25Gb3I6IFsnaXMnLCAnbm90J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXJGb3JtczogWydkbycsICdkb2VzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc29tZScsXG4gICAgICAgIHR5cGU6ICdleGlzdHF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdldmVyeScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYWxsJyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RvJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aXRoJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdmcm9tJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvZicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3ZlcicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb24nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2F0JyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ2ZpbGxlcicgLy8gZmlsbGVyIHdvcmQsIHdoYXQgYWJvdXQgcGFydGlhbCBwYXJzaW5nP1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2l0JyxcbiAgICAgICAgdHlwZTogJ3Byb25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGNvbmNlcHRzOiBbJ2NvbmNlcHQnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvYmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25kaXRpb24nLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25zZXF1ZW5jZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfVxuXVxuXG4vKipcbiAqIEdyYW1tYXJcbiAqL1xuY29uc3RpdHVlbnRUeXBlcy5jb25jYXQobGV4ZW1lVHlwZXMgYXMgYW55KS5mb3JFYWNoKGcgPT4ge1xuICAgIGxleGVtZXMucHVzaCh7XG4gICAgICAgIHJvb3Q6IGcsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0pXG59KSIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmdbXSA9IFtcblxuICAvLyBncmFtbWFyXG4gICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW4gcGhyYXNlJyxcblxuICBgY29wdWxhIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuIHBocmFzZWAsXG5cbiAgYG5vdW4gcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIG12ZXJiIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBub3VuIHBocmFzZScsXG4gICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlJyxcblxuICBgYW5kIHNlbnRlbmNlIGlzIGxlZnQgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlIFxuICAgICAgICB0aGVuIG5vbnN1YmNvbmpcbiAgICAgICAgdGhlbiBvbmUgb3IgbW9yZSByaWdodCBhbmQgc2VudGVuY2Ugb3IgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlYCxcblxuICBgbXZlcmIgc2VudGVuY2UgaXMgc3ViamVjdCBub3VuIHBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gbXZlcmJcblx0XHR0aGVuIG9iamVjdCBub3VuIHBocmFzZWAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICBgaXZlcmIgc2VudGVuY2UgaXMgc3ViamVjdCBub3VuIHBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gaXZlcmJgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgYHNpbXBsZSBzZW50ZW5jZSBpcyBjb3B1bGEgc2VudGVuY2Ugb3IgaXZlcmIgc2VudGVuY2Ugb3IgbXZlcmIgc2VudGVuY2VgLFxuXG4gIGBjczIgaXMgY29uc2VxdWVuY2Ugc2ltcGxlIHNlbnRlbmNlXG4gICAgICB0aGVuIHN1YmNvbmpcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZSBzZW50ZW5jZWAsXG5cbiAgYGNzMSBpcyBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZSBzZW50ZW5jZSBcbiAgICB0aGVuIGZpbGxlciBcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZSBzZW50ZW5jZWAsXG5cbiAgLy8gZG9tYWluXG4gICdjb2xvciBpcyBhIGNvbmNlcHQnLFxuICAncmVkIGFuZCBibHVlIGFuZCBibGFjayBhbmQgZ3JlZW4gYXJlIGNvbG9ycycsXG4gICdjb2xvciBvZiBhbnkgZWxlbWVudCBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiO1xuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnY29wdWxhIHNlbnRlbmNlJyxcbiAgICAnbm91biBwaHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnc3ViY2xhdXNlJyxcbiAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAnbXZlcmIgc2VudGVuY2UnLFxuICAgICdpdmVyYiBzZW50ZW5jZScsXG4gICAgJ3NpbXBsZSBzZW50ZW5jZScsXG4gICAgJ2NvbXBsZXggc2VudGVuY2UnLFxuICAgICdjczEnLFxuKVxuXG5leHBvcnQgY29uc3Qgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSA9IFtcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG5dXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgLy8gcGVybWFuZW50XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bicsICdncmFtbWFyJ10sIG51bWJlcjogMSwgcm9sZTogJ25vdW4nIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZmlsbGVyJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnc3ViY2xhdXNlJzogW1xuXG4gICAgXSxcblxuICAgICdub3VuIHBocmFzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcblxuICAgIF0sXG5cbiAgICAnY29wdWxhIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdhbmQgc2VudGVuY2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ212ZXJiIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdpdmVyYiBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnc2ltcGxlIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdjb21wbGV4IHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdjczEnOiBbXG5cbiAgICBdXG59XG5cbiIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgV3JhcHBlciwgeyB3cmFwIH0gZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldChpZDogSWQsIG9iamVjdD86IG9iamVjdCk6IFdyYXBwZXIge1xuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdID0gcGxhY2Vob2xkZXI/LmNvcHkoeyBvYmplY3Q6IG9iamVjdCB9KSA/PyB3cmFwKGlkLCBvYmplY3QpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMudmFsdWVzXG4gICAgICAgICAgICAubWFwKHcgPT4gdy5jbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiB1bml2ZXJzZS5xdWVyeShxdWVyeSwgeyBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgV3JhcHBlciwgeyBDb3B5T3B0cywgU2V0T3BzLCB1bndyYXAgfSBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbCB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBpc1BsYWNlaG9sZGVyOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBhbGlhc2VzOiB7IFthbGlhczogc3RyaW5nXTogeyBwYXRoOiBzdHJpbmdbXSwgbGV4ZW1lOiBMZXhlbWUgfSB9ID0gb2JqZWN0LmFsaWFzZXMgPz8ge30sXG4gICAgICAgIHJlYWRvbmx5IHNpbXBsZVByZWRpY2F0ZXM6IExleGVtZVtdID0gW10pIHtcblxuICAgICAgICBvYmplY3QuYWxpYXNlcyA9IGFsaWFzZXNcbiAgICAgICAgb2JqZWN0LnNpbXBsZVByZWRpY2F0ZXMgPSBzaW1wbGVQcmVkaWNhdGVzXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuICAgICAgICBpZiAob3B0cz8uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHMuYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzPy5hbGlhc1BhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEFsaWFzKHByZWRpY2F0ZSwgb3B0cy5hbGlhc1BhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wcyA9IG9wdHM/LnByb3BzID8/IFtdXG5cbiAgICAgICAgaWYgKHRoaXMuaXNQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLmxlbmd0aCA+IDEpIHsgLy8gYXNzdW1lID4gMSBwcm9wcyBhcmUgYSBwYXRoXG4gICAgICAgICAgICB0aGlzLnNldE11bHRpUHJvcChwcm9wcywgcHJlZGljYXRlLCBvcHRzKVxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW5nbGVQcm9wKHByZWRpY2F0ZSwgcHJvcHNbMF0sIG9wdHMpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFplcm9Qcm9wcyhwcmVkaWNhdGUsIG9wdHMpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRNdWx0aVByb3AocGF0aDogTGV4ZW1lW10sIHZhbHVlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHsgLy8gYXNzdW1lIG5vdCBjb25jZXB0XG5cbiAgICAgICAgaWYgKG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgubWFwKHggPT4geC5yb290KSwgJycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLm1hcCh4ID0+IHgucm9vdCksIHZhbHVlLnJvb3QpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcmVkaWNhdGUuY29uY2VwdHM/LmF0KDApID8/ICcnXT8ucGF0aFxuXG4gICAgICAgIHJldHVybiBwYXRoID9cbiAgICAgICAgICAgIHRoaXMuZ2V0TmVzdGVkKHBhdGgpID09PSBwcmVkaWNhdGUucm9vdCA6XG4gICAgICAgICAgICB0aGlzLmlzU2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc1NpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGU6IExleGVtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGVQcmVkaWNhdGVzLm1hcCh4ID0+IHgucm9vdCkuaW5jbHVkZXMocHJlZGljYXRlLnJvb3QpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFsaWFzZXNbY29uY2VwdE5hbWUucm9vdF0gPSB7IHBhdGg6IHByb3BQYXRoLm1hcCh4ID0+IHgucm9vdCksIGxleGVtZTogY29uY2VwdE5hbWUgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxsKHZlcmI6IExleGVtZSwgYXJnczogV3JhcHBlcltdKSB7XG4gICAgICAgIGNvbnN0IGNvbmNlcHQgPSB0aGlzLmFsaWFzZXNbdmVyYi5yb290XT8ucGF0aFxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gY29uY2VwdD8uWzBdID8/IHZlcmIucm9vdFxuICAgICAgICByZXR1cm4gdGhpcz8ub2JqZWN0W21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKHggPT4gdW53cmFwKHgpKSlcbiAgICB9XG5cbiAgICBjbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHByZWRzOiBMZXhlbWVbXSA9XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmFsaWFzZXMpXG4gICAgICAgICAgICAgICAgLm1hcChrID0+IHRoaXMuZ2V0TmVzdGVkKHRoaXMuYWxpYXNlc1trXS5wYXRoKSlcbiAgICAgICAgICAgICAgICAubWFwKCh4KTogTGV4ZW1lID0+ICh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5zaW1wbGVQcmVkaWNhdGVzKVxuXG4gICAgICAgIGxldCByZXMgPSBwcmVkc1xuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHRoaXMuaWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiByZXMuYW5kKHRoaXMuZXh0cmFJbmZvKHF1ZXJ5KSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHRyYUluZm8ocXVlcnk/OiBDbGF1c2UpIHtcblxuICAgICAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4ocXVlcnksIGdldFRvcExldmVsKHF1ZXJ5KVswXSlcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBvYy5tYXAoeCA9PiBxdWVyeS5kZXNjcmliZSh4KT8uWzBdPy5yb290KS5zbGljZSgxKVxuICAgICAgICAgICAgY29uc3QgbmVzdGVkID0gdGhpcy5nZXROZXN0ZWQodGhpcy5hbGlhc2VzPy5bcGF0aD8uWzBdXT8ucGF0aCA/PyBwYXRoKVxuXG4gICAgICAgICAgICBpZiAobmVzdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcXVlcnkuY29weSh7IG1hcDogeyBbb2NbMF1dOiB0aGlzLmlkIH0gfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFNpbmdsZVByb3AodmFsdWU6IExleGVtZSwgcHJvcDogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcm9wLnJvb3RdPy5wYXRoID8/IFtwcm9wLnJvb3RdXG5cbiAgICAgICAgaWYgKCFvcHRzPy5uZWdhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLCB2YWx1ZS5yb290KVxuICAgICAgICB9IGVsc2UgaWYgKG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsICcnKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0WmVyb1Byb3BzKHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcmVkaWNhdGU/LmNvbmNlcHRzPy5bMF0gYXMgYW55XT8ucGF0aFxuXG4gICAgICAgIGlmIChwYXRoKSB7XG5cbiAgICAgICAgICAgIGlmICghb3B0cz8ubmVnYXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXMocHJlZGljYXRlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub2JqZWN0W3ByZWRpY2F0ZS5yb290XSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwcmVkaWNhdGUucm9vdF0gPSAhb3B0cz8ubmVnYXRlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSkgLy9UT0RPOiBjaGVjayBkdXBsaWNhdGVzIVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4Py5bcF1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4geFxuXG4gICAgfVxuXG4gICAgdHlwZU9mKHdvcmQ6IHN0cmluZyk6IExleGVtZVR5cGUgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmFsaWFzZXNbd29yZF0/LnBhdGggPz8gW3dvcmRdXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLmdldE5lc3RlZChwYXRoKVxuXG4gICAgICAgIGlmICh0eXBlb2YgdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICh3Lmxlbmd0aCA/PyAwKSA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlciB7XG5cbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBCYXNlV3JhcHBlcihcbiAgICAgICAgICAgIG9wdHM/Lm9iamVjdCA/PyB0aGlzLmNvcHlXcmFwcGVkKCksXG4gICAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8gZmFsc2UgOiB0aGlzLmlzUGxhY2Vob2xkZXIsXG4gICAgICAgIClcblxuICAgICAgICB0aGlzLnNpbXBsZVByZWRpY2F0ZXMuZm9yRWFjaCh4ID0+IGNvcHkuc2V0KHgpKVxuICAgICAgICByZXR1cm4gY29weVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjb3B5V3JhcHBlZCgpIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHRoaXMub2JqZWN0LmNsb25lTm9kZSgpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICB3cmFwcGVkLmlubmVySFRNTCA9IHRoaXMub2JqZWN0LmlubmVySFRNTFxuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnRoaXMub2JqZWN0IH1cbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICByZWFkb25seSB2YWx1ZXM6IFdyYXBwZXJbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBCYXNlV3JhcHBlciBmcm9tIFwiLi9CYXNlV3JhcHBlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IGlkOiBJZFxuICAgIGNsYXVzZShjbGF1c2U/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpOiBhbnlcbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW5cbiAgICB0eXBlT2Yod29yZDogc3RyaW5nKTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZFxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlclxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0T3BzIHtcbiAgICBwcm9wcz86IExleGVtZVtdXG4gICAgbmVnYXRlZD86IGJvb2xlYW5cbiAgICBhcmdzPzogV3JhcHBlcltdXG4gICAgYWxpYXNQYXRoPzogTGV4ZW1lW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgb2JqZWN0Pzogb2JqZWN0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGlkOiBJZCwgbz86IE9iamVjdCk6IFdyYXBwZXIge1xuICAgIHJldHVybiBuZXcgQmFzZVdyYXBwZXIobyA/PyB7fSwgaWQsIG8gPT09IHVuZGVmaW5lZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcCh3cmFwcGVyOiBXcmFwcGVyKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdyYXBwZXIgYXMgYW55KS5vYmplY3Rcbn0iLCJpbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuL3RvVmFyXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdldEluY3JlbWVudGFsSWRPcHRzIHtcbiAgICBhc1ZhcjogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZChvcHRzPzogR2V0SW5jcmVtZW50YWxJZE9wdHMpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBvcHRzPy5hc1ZhciA/IHRvVmFyKG5ld0lkKSA6IG5ld0lkO1xufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbnN0KGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXIoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvVXBwZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpIiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IGdldExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZ2V0TGV4ZW1lc1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyByZXNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3Jlc3BhY2VcIjtcbmltcG9ydCB7IHN0ZHNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyBqb2luTXVsdGlXb3JkTGV4ZW1lcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQpIHsgLy8gVE9ETzogbWFrZSBjYXNlIGluc2Vuc2l0aXZlXG5cbiAgICAgICAgY29uc3Qgd29yZHMgPVxuICAgICAgICAgICAgam9pbk11bHRpV29yZExleGVtZXMoc3Rkc3BhY2Uoc291cmNlQ29kZSksIGNvbnRleHQuY29uZmlnLmxleGVtZXMpXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG4gICAgICAgICAgICAgICAgLm1hcChzID0+IHJlc3BhY2UocykpXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSB3b3Jkcy5mbGF0TWFwKHcgPT4gZ2V0TGV4ZW1lcyh3LCBjb250ZXh0LCB3b3JkcykpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2JyYWluL0NvbnRleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKGxleGVtZTogTGV4ZW1lKTogc3RyaW5nW10ge1xuXG4gICAgY29uc3Qgd29yZCA9IGxleGVtZS50b2tlbiA/PyBsZXhlbWUucm9vdFxuXG4gICAgaWYgKGxleGVtZS5pcnJlZ3VsYXJGb3Jtcykge1xuICAgICAgICByZXR1cm4gW3dvcmQsIC4uLmxleGVtZS5pcnJlZ3VsYXJGb3Jtc11cbiAgICB9XG5cbiAgICByZXR1cm4gW3dvcmQsIGAke3dvcmR9c2BdXG5cbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcbmltcG9ydCB7IHN0ZW0gfSBmcm9tIFwiLi9zdGVtXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGR5bmFtaWNMZXhlbWUod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWUge1xuXG4gICAgY29uc3Qgc3RlbW1lZFdvcmQgPSBzdGVtKHsgcm9vdDogd29yZCwgdHlwZTogJ2FueScgfSk7XG5cbiAgICBjb25zdCB0eXBlcyA9IHdvcmRzXG4gICAgICAgIC5tYXAodyA9PiBjbGF1c2VPZih7IHJvb3Q6IHcsIHR5cGU6ICdhbnknIH0sICdYJykpXG4gICAgICAgIC5mbGF0TWFwKGMgPT4gY29udGV4dC5lbnZpcm8ucXVlcnkoYykpXG4gICAgICAgIC5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgLm1hcChpZCA9PiBjb250ZXh0LmVudmlyby5nZXQoaWQpKVxuICAgICAgICAubWFwKHggPT4geD8udHlwZU9mKHN0ZW1tZWRXb3JkKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZCk7XG5cbiAgICByZXR1cm4geyByb290OiBzdGVtbWVkV29yZCwgdHlwZTogdHlwZXNbMF0gPz8gJ25vdW4nIH07XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9jb25qdWdhdGVcIlxuaW1wb3J0IHsgZHluYW1pY0xleGVtZSB9IGZyb20gXCIuL2R5bmFtaWNMZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCwgd29yZHM6IHN0cmluZ1tdKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWUgPSBjb250ZXh0XG4gICAgICAgIC5jb25maWdcbiAgICAgICAgLmxleGVtZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IGNvbmp1Z2F0ZSh4KS5pbmNsdWRlcyh3b3JkKSlcbiAgICAgICAgLmF0KDApID8/IGR5bmFtaWNMZXhlbWUod29yZCwgY29udGV4dCwgd29yZHMpXG5cbiAgICBjb25zdCBsZXhlbWUyOiBMZXhlbWUgPSB7IC4uLmxleGVtZSwgdG9rZW46IHdvcmQgfVxuXG4gICAgcmV0dXJuIGxleGVtZTIuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgsIGNvbnRleHQsIHdvcmRzKSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3RvKGxleGVtZTogTGV4ZW1lKTogT2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpPy5bbGV4ZW1lLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZTtcbn1cbiIsIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25jZXB0KGxleGVtZT86IExleGVtZSkge1xuICAgIHJldHVybiBsZXhlbWU/LmNvbmNlcHRzPy5pbmNsdWRlcygnY29uY2VwdCcpO1xufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc011bHRpV29yZChsZXhlbWU6IExleGVtZSkge1xuICAgIHJldHVybiBsZXhlbWUucm9vdC5pbmNsdWRlcygnICcpO1xufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuaW1wb3J0IHsgaXNNdWx0aVdvcmQgfSBmcm9tIFwiLi9pc011bHRpV29yZFwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9zdGRzcGFjZVwiO1xuaW1wb3J0IHsgdW5zcGFjZSB9IGZyb20gXCIuL3Vuc3BhY2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHNvdXJjZUNvZGU6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pIHtcblxuICAgIGxldCBuZXdTb3VyY2UgPSBzb3VyY2VDb2RlO1xuXG4gICAgbGV4ZW1lc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNNdWx0aVdvcmQoeCkpXG4gICAgICAgIC5mb3JFYWNoKHggPT4ge1xuICAgICAgICAgICAgY29uc3QgbGV4ZW1lID0gc3Rkc3BhY2UoeC5yb290KTtcbiAgICAgICAgICAgIG5ld1NvdXJjZSA9IG5ld1NvdXJjZS5yZXBsYWNlQWxsKGxleGVtZSwgdW5zcGFjZShsZXhlbWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbmV3U291cmNlO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gcmVzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnLScsICcgJyk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBzdGRzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpO1xufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGVtKGxleGVtZTogTGV4ZW1lKTogc3RyaW5nIHtcblxuICAgIGNvbnN0IHdvcmQgPSBsZXhlbWUudG9rZW4gPz8gbGV4ZW1lLnJvb3Q7XG5cbiAgICBpZiAobGV4ZW1lLmlycmVndWxhckZvcm1zKSB7XG4gICAgICAgIHJldHVybiB3b3JkO1xuICAgIH1cblxuICAgIGlmICh3b3JkLmVuZHNXaXRoKCdzJykpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQuc2xpY2UoMCwgLTEpO1xuICAgIH1cblxuICAgIHJldHVybiB3b3JkO1xuXG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiB1bnNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCcgJywgJy0nKTtcbn1cbiIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBwcm9tcHRWaXNpYmxlOiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN0YXRlLmJyYWluLmV4ZWN1dGUodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKVxuICAgIH0pO1xuXG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gc3RhdGUuYnJhaW5cbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5jb25maWcuc3ludGF4TGlzdClcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5zaW1wbGlmeShhc3QpKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkge1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmtub3duUGFyc2UodCwgcm9sZSlcblxuICAgICAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxleGVyLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga25vd25QYXJzZSA9IChuYW1lOiBBc3RUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmNvbnRleHQuY29uZmlnLmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogYW55ID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5jb250ZXh0LmNvbmZpZy5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jb25maWcubGV4ZW1lVHlwZXMuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoIWFzdC5saW5rcykge1xuICAgICAgICAgICAgcmV0dXJuIGFzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmNvbmZpZy5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxpZnkoT2JqZWN0LnZhbHVlcyhhc3QubGlua3MpWzBdKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdC5saW5rcylcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiB7IC4uLmFzdCwgbGlua3M6IHNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFN5bnRheCwgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFjcm9Ub1N5bnRheChtYWNybzogQXN0Tm9kZSk6IHsgbmFtZTogc3RyaW5nLCBzeW50YXg6IFN5bnRheCB9IHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8ubm91bj8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcblxuY29uc3QgdGVzdHMgPSBbXG4gICAgdGVzdDEsXG4gICAgdGVzdDIsXG4gICAgdGVzdDMsXG4gICAgdGVzdDQsXG4gICAgdGVzdDUsXG4gICAgdGVzdDYsXG4gICAgdGVzdDcsXG4gICAgdGVzdDgsXG4gICAgdGVzdDksXG4gICAgdGVzdDEwLFxuICAgIHRlc3QxMSxcbiAgICB0ZXN0MTIsXG4gICAgdGVzdDEzLFxuICAgIHRlc3QxNCxcbiAgICB0ZXN0MTUsXG4gICAgdGVzdDE2LFxuICAgIHRlc3QxNyxcbiAgICB0ZXN0MTgsXG4gICAgdGVzdDE5LFxuICAgIHRlc3QyMCxcbiAgICB0ZXN0MjEsXG4gICAgdGVzdDIyLFxuICAgIHRlc3QyMyxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2codGVzdCgpID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnLCB0ZXN0Lm5hbWUpXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwKS8vNzVcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC5lbnZpcm8udmFsdWVzLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneSBpcyBhIGJ1dHRvbi4geCBpcyByZWQuIHkgaXMgYSBncmVlbiBidXR0b24uIHggaXMgYSBidXR0b24uIHogaXMgYSBibGFjayBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVxuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBjb2xvciBvZiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cblxuZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB5IGlzIGEgYnV0dG9uLiB6IGlzIGEgYnV0dG9uLiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q4KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpWzBdLnRleHRDb250ZW50ID09ICdjYXByYSdcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0OSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB4IGlzIGdyZWVuLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3JlZCcpLmxlbmd0aCA9PT0gMFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdncmVlbicpLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDEwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uIHogaXMgYSBibHVlIGJ1dHRvbi4gdGhlIHJlZCBidXR0b24uIGl0IGlzIGJsYWNrLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibGFjaydcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmx1ZSdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDExKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhbmQgdyBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkJylcbiAgICBicmFpbi5leGVjdXRlKCd3IGFuZCB6IGFyZSBibGFjaycpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQ0ID0gYnJhaW4uZXhlY3V0ZSgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDMgJiYgYXNzZXJ0NFxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYXBwZW5kQ2hpbGRzIHknKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5jaGlsZHJlbikuaW5jbHVkZXMoYnJhaW4uZXhlY3V0ZSgneScpWzBdKVxufVxuXG5mdW5jdGlvbiB0ZXN0MTMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uIGFuZCBpdCBpcyBncmVlbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG59XG5cbmZ1bmN0aW9uIHRlc3QxNCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiB4IGFuZCB5IGFyZSByZWQgYW5kIHogaXMgZ3JlZW4uJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBub3QgcmVkLicpXG5cbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxNSgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gZXZlcnkgYnV0dG9uIGlzIGJsdWUuJylcbiAgICBicmFpbi5leGVjdXRlKCd6IGlzIHJlZC4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2V2ZXJ5IGJ1dHRvbiBpcyBub3QgYmx1ZS4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgIT09ICdibHVlJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcblxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3QxNigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgaGlkZGVuJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgbm90IGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MiA9ICFicmFpbi5leGVjdXRlKCd4JylbMF0uaGlkZGVuXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MTcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24nKVxuICAgIGNvbnN0IHggPSBicmFpbi5leGVjdXRlKCd4JylbMF1cbiAgICB4Lm9uY2xpY2sgPSAoKSA9PiBicmFpbi5leGVjdXRlKCd4IGlzIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBjbGlja3MnKVxuICAgIHJldHVybiB4LnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbn1cblxuZnVuY3Rpb24gdGVzdDE4KCkge1xuXG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcblxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZC4geCBpcyBhIGJ1dHRvbiBhbmQgeSBpcyBhIGRpdi4nKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2V2ZXJ5IHJlZCBidXR0b24gaXMgYmxhY2snKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2RpdicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxOSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiBpZiB4IGlzIHJlZCB0aGVuIHkgaXMgYSBncmVlbiBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG59XG5cbmZ1bmN0aW9uIHRlc3QyMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uIGlmIHggaXMgcmVkJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MjEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBjb2xvciBvZiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHRlc3QyMigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSByZWQuIGV2ZXJ5IHJlZCBpcyBhIGJ1dHRvbicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ3JlZCBidXR0b25zJykubGVuZ3RoID09PSAzXG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsIlxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjXG4gICAgICAgIHJldHVybiBoMSAmIGgxIC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pXG59XG4iLCJpbXBvcnQgeyB0YWdOYW1lRnJvbVByb3RvIH0gZnJvbSBcIi4vdGFnTmFtZUZyb21Qcm90b1wiXG5cbi8qKlxuICogXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYW4gb2JqZWN0IChldmVuIEhUTUxFbGVtZW50KSBmcm9tIGEgcHJvdG90eXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV3SW5zdGFuY2UocHJvdG86IG9iamVjdCkge1xuXG4gICAgcmV0dXJuIHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgP1xuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKSA6XG4gICAgICAgIG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvcigpXG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiXG4vKipcbiAqIFRyeSBnZXR0aW5nIHRoZSBuYW1lIG9mIGFuIGh0bWwgZWxlbWVudCBmcm9tIGEgcHJvdG90eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IG9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgLnJlcGxhY2UoJ0hUTUwnLCAnJylcbiAgICAucmVwbGFjZSgnRWxlbWVudCcsICcnKVxuICAgIC50b0xvd2VyQ2FzZSgpXG4iLCJcbi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgb2YgcHJpbWl0aXZlcyAobnVtYmVycywgYm9vbHMsIHN0cmluZ3MpLlxuICogQ2FyZWZ1bCB1c2luZyB0aGlzIHdpdGggb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVuaXEgPSAoeDogYW55W10pID0+IEFycmF5LmZyb20obmV3IFNldCh4KSlcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=