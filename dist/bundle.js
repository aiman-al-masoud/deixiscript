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
const newInstance_1 = __webpack_require__(/*! ../../utils/newInstance */ "./app/src/utils/newInstance.ts");
class CreateAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d, _e, _f;
        const localId = (_b = (_a = this.clause) === null || _a === void 0 ? void 0 : _a.args) === null || _b === void 0 ? void 0 : _b[0];
        const id = (_e = (_d = (_c = context.enviro.query(this.topLevel.theme)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d[localId]) !== null && _e !== void 0 ? _e : (0, getIncrementalId_1.getIncrementalId)();
        const predicate = this.clause.predicate;
        if (!predicate) {
            return;
        }
        if ((_f = context.enviro.get(id)) === null || _f === void 0 ? void 0 : _f.is(predicate)) { //  existence check prior to creating
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
const getKool_1 = __webpack_require__(/*! ../../clauses/functions/getKool */ "./app/src/clauses/functions/getKool.ts");
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
        const wrapper = (_b = (0, getKool_1.getKool)(context, searchSpace, localId)[0]) !== null && _b !== void 0 ? _b : context.enviro.set((0, getIncrementalId_1.getIncrementalId)());
        wrapper === null || wrapper === void 0 ? void 0 : wrapper.set(predicate, { negated: this.clause.negated });
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
        // this.clause.toString().includes('click') ? console.log(this.clause.toString()) : 0
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
const getKool_1 = __webpack_require__(/*! ../../clauses/functions/getKool */ "./app/src/clauses/functions/getKool.ts");
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
exports.getAction = void 0;
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
const getKool_1 = __webpack_require__(/*! ../clauses/functions/getKool */ "./app/src/clauses/functions/getKool.ts");
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
            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.context);
                return [];
            }
            else {
                const wrappers = clause.entities.flatMap(id => (0, getKool_1.getKool)(this.context, clause, id));
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
const makeAllVars_1 = __webpack_require__(/*! ../clauses/functions/makeAllVars */ "./app/src/clauses/functions/makeAllVars.ts");
const propagateVarsOwned_1 = __webpack_require__(/*! ../clauses/functions/propagateVarsOwned */ "./app/src/clauses/functions/propagateVarsOwned.ts");
const resolveAnaphora_1 = __webpack_require__(/*! ../clauses/functions/resolveAnaphora */ "./app/src/clauses/functions/resolveAnaphora.ts");
const makeImply_1 = __webpack_require__(/*! ../clauses/functions/makeImply */ "./app/src/clauses/functions/makeImply.ts");
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
        const c0 = (0, makeImply_1.makeImply)(result);
        const c1 = (0, makeAllVars_1.makeAllVars)(c0);
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
    return subject.and(predicate, { asRheme: true }).copy({ sideEffecty: true });
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

/***/ "./app/src/clauses/functions/getKool.ts":
/*!**********************************************!*\
  !*** ./app/src/clauses/functions/getKool.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getKool = void 0;
function getKool(context, clause, localId) {
    const ownerIds = clause.ownersOf(localId); // 0 or 1 owner(s)
    if (ownerIds.length === 0) {
        const maps = context.enviro.query(clause);
        return maps.map(x => x[localId]).flatMap(x => { var _a; return (_a = context.enviro.get(x)) !== null && _a !== void 0 ? _a : []; });
    }
    const owner = getKool(context, clause, ownerIds[0]);
    return owner.flatMap(x => { var _a; return (_a = x.get(clause.about(localId))) !== null && _a !== void 0 ? _a : []; });
}
exports.getKool = getKool;


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

/***/ "./app/src/clauses/functions/makeImply.ts":
/*!************************************************!*\
  !*** ./app/src/clauses/functions/makeImply.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeImply = void 0;
const Clause_1 = __webpack_require__(/*! ../Clause */ "./app/src/clauses/Clause.ts");
const isVar_1 = __webpack_require__(/*! ../../id/functions/isVar */ "./app/src/id/functions/isVar.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ../Imply */ "./app/src/clauses/Imply.ts"));
function makeImply(clause) {
    if (clause instanceof Imply_1.default) {
        return clause;
    }
    if (clause.rheme === Clause_1.emptyClause) {
        return clause;
    }
    if (clause.entities.some(e => (0, isVar_1.isVar)(e))) {
        const r = clause.theme.implies(clause.rheme).copy({ sideEffecty: clause.isSideEffecty });
        return r;
    }
    return clause;
}
exports.makeImply = makeImply;


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
    'copulasubclause is relpron then copula then predicate noun phrase',
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
const getIncrementalId_1 = __webpack_require__(/*! ../id/functions/getIncrementalId */ "./app/src/id/functions/getIncrementalId.ts");
class BaseWrapper {
    constructor(object, id, isPlaceholder, parent) {
        var _a;
        this.object = object;
        this.id = id;
        this.isPlaceholder = isPlaceholder;
        this.parent = parent;
        this.aliases = (_a = this.object.aliases) !== null && _a !== void 0 ? _a : {};
        this.simplePredicates = [];
        try {
            this.object.aliases = this.aliases;
            this.object.simplePredicates = this.simplePredicates;
        }
        catch (_b) { }
    }
    set(predicate, opts) {
        var _a, _b;
        if (this.parent) {
            //TODO: problem when this wrapper is textContent because predicate has no concept and path is unknown (not passed) to parent
            return this.parent.set(predicate, Object.assign(Object.assign({}, opts), { props: [...(_a = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _a !== void 0 ? _a : []] }));
        }
        if (opts === null || opts === void 0 ? void 0 : opts.args) {
            return this.call(predicate, opts.args);
        }
        if (opts === null || opts === void 0 ? void 0 : opts.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath);
        }
        const props = (_b = opts === null || opts === void 0 ? void 0 : opts.props) !== null && _b !== void 0 ? _b : [];
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
    get(clause) {
        var _a;
        const x = clause.entities.flatMap(e => clause.describe(e))[0];
        if (x) {
            const path = (_a = this.aliases[x.root]) === null || _a === void 0 ? void 0 : _a.path;
            // x.root === 'text' ? console.log(path) : 0
            const object = path ? this.getNested(path) : this.object[x.root];
            return new BaseWrapper(object, (0, getIncrementalId_1.getIncrementalId)(), false, this);
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
        this._pos = 0;
        const words = (0, joinMultiWordLexemes_1.joinMultiWordLexemes)((0, stdspace_1.stdspace)(sourceCode), context.config.lexemes)
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
    test24,
    test25,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLEVBQUUsYUFBYTtRQUNuQixjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0tBQ2hDO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsY0FBYyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztLQUNqQztJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsWUFBWTtLQUNyQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsUUFBUSxDQUFDLDJDQUEyQztLQUM3RDtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFNB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QUFFO0FBRXhDLENBQUM7QUFORCxrQ0FNQzs7Ozs7Ozs7Ozs7Ozs7QUNaRCxTQUFnQixjQUFjLENBQW1CLEdBQUcsSUFBUyxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFwRix3Q0FBb0Y7Ozs7Ozs7Ozs7Ozs7O0FDQ3BGOztHQUVHO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJO0tBQzVELE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0tBQ25CLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0tBQ3RCLFdBQVcsRUFBRTtBQUhMLHdCQUFnQixvQkFHWDs7Ozs7Ozs7Ozs7Ozs7QUNObEI7OztHQUdHO0FBQ0ksTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFRLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBM0MsWUFBSSxRQUF1Qzs7Ozs7OztVQ0x4RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0NvbmNlcHRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0NyZWF0ZUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvRWRpdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvSWZBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL011bHRpQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9SZWxhdGlvbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvU2V0QWxpYXNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL1doZW5BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL3BvaW50T3V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9tb2NrTWFwLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvcHJvcGFnYXRlVmFyc093bmVkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvcmVzb2x2ZUFuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQmFzaWNDb25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9wcmVsdWRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQmFzZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL2lzVmFyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvdG9Db25zdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy90b1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9keW5hbWljTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2dldExleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvZ2V0UHJvdG8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvaXNDb25jZXB0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2lzTXVsdGlXb3JkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2pvaW5NdWx0aVdvcmRMZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL3Jlc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvc3Rkc3BhY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvc3RlbS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy91bnNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL25ld0luc3RhbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy90YWdOYW1lRnJvbVByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jZXB0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuYXJncyAmJiB0aGlzLmNsYXVzZS5wcmVkaWNhdGUpIHtcblxuICAgICAgICAgICAgY29uc3QgYWRqID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSh0aGlzLmNsYXVzZS5hcmdzWzBdKVswXS5yb290XG5cbiAgICAgICAgICAgIGNvbnRleHQuY29uZmlnLnNldExleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogYWRqLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLCAvL1RPRE86IGJlIGFibGUgdG8gZGVjbGFyZSBhbnkga2luZCBvZiBsZXhlbWUgbGlrZSB0aGlzXG4gICAgICAgICAgICAgICAgY29uY2VwdHM6IFt0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdF0sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cblxufSIsImltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvZnVuY3Rpb25zL2dldFByb3RvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiO1xuaW1wb3J0IHsgbmV3SW5zdGFuY2UgfSBmcm9tIFwiLi4vLi4vdXRpbHMvbmV3SW5zdGFuY2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgbG9jYWxJZCA9IHRoaXMuY2xhdXNlPy5hcmdzPy5bMF0gYXMgSWRcbiAgICAgICAgY29uc3QgaWQgPSBjb250ZXh0LmVudmlyby5xdWVyeSh0aGlzLnRvcExldmVsLnRoZW1lKT8uWzBdPy5bbG9jYWxJZF0gPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0LmVudmlyby5nZXQoaWQpPy5pcyhwcmVkaWNhdGUpKSB7ICAvLyAgZXhpc3RlbmNlIGNoZWNrIHByaW9yIHRvIGNyZWF0aW5nXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3RvID0gZ2V0UHJvdG8ocHJlZGljYXRlKVxuXG4gICAgICAgIGlmICghcHJvdG8pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbyA9IG5ld0luc3RhbmNlKHByb3RvKVxuICAgICAgICBpbml0KG8sIGNvbnRleHQsIGlkKVxuICAgICAgICBjb250ZXh0LmVudmlyby5zZXQoaWQsIG8pLnNldChwcmVkaWNhdGUpXG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaW5pdChvOiBvYmplY3QsIGNvbnRleHQ6IENvbnRleHQsIGlkOiBJZCkge1xuXG4gICAgaWYgKG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBvLmlkID0gaWQgKyAnJ1xuICAgICAgICBvLnRleHRDb250ZW50ID0gJ2RlZmF1bHQnXG4gICAgICAgIGNvbnRleHQ/LmVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGxvY2FsSWQgPSB0aGlzLmNsYXVzZS5hcmdzPy5bMF1cbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG4gICAgICAgIGNvbnN0IHNlYXJjaFNwYWNlID0gdGhpcy50b3BMZXZlbC50aGVtZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBnZXRLb29sKGNvbnRleHQsIHNlYXJjaFNwYWNlLCBsb2NhbElkKVswXSA/PyBjb250ZXh0LmVudmlyby5zZXQoZ2V0SW5jcmVtZW50YWxJZCgpKVxuICAgICAgICB3cmFwcGVyPy5zZXQocHJlZGljYXRlLCB7IG5lZ2F0ZWQ6IHRoaXMuY2xhdXNlLm5lZ2F0ZWQgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElmQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmIChjb250ZXh0LmVudmlyby5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB0aGlzLmNsYXVzZS5yaGVtZS5mbGF0TGlzdCgpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgZ2V0QWN0aW9uKGMsIHRoaXMuY2xhdXNlLnJoZW1lKS5ydW4oY29udGV4dClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICAvLyB0aGlzLmNsYXVzZS50b1N0cmluZygpLmluY2x1ZGVzKCdjbGljaycpID8gY29uc29sZS5sb2codGhpcy5jbGF1c2UudG9TdHJpbmcoKSkgOiAwXG5cblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuXG4gICAgICAgIGNvbnRleHQuZW52aXJvLnF1ZXJ5KGNvbmRpdGlvbikuZm9yRWFjaChtID0+IHtcblxuICAgICAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jbGF1c2UuY29weSh7IG1hcDogbSwgZXhhY3RJZHM6IHRydWUgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbnNlcSA9IHRvcC5yaGVtZVxuICAgICAgICAgICAgY29uc3QgY2xhdXNlcyA9IGNvbnNlcS5mbGF0TGlzdCgpXG4gICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gY2xhdXNlcy5tYXAoYyA9PiBnZXRBY3Rpb24oYywgdG9wKSlcbiAgICAgICAgICAgIGFjdGlvbnMuZm9yRWFjaChhID0+IGEucnVuKGNvbnRleHQpKVxuXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldEtvb2wgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0S29vbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGlvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBhcmdzID0gKHRoaXMuY2xhdXNlLmFyZ3MgPz8gW10pXG4gICAgICAgICAgICAubWFwKHggPT4gZ2V0S29vbChjb250ZXh0LCB0aGlzLnRvcExldmVsLnRoZW1lLCB4KVswXSlcblxuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gYXJnc1swXVxuICAgICAgICBjb25zdCBvYmplY3QgPSBhcmdzWzFdXG5cbiAgICAgICAgcmV0dXJuIHN1YmplY3Q/LnNldCh0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIHsgYXJnczogb2JqZWN0ID8gW29iamVjdF0gOiBbXSB9KVxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldFByb3RvIH0gZnJvbSBcIi4uLy4uL2xleGVyL2Z1bmN0aW9ucy9nZXRQcm90b1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0QWxpYXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuICAgICAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRoaXMuY2xhdXNlLnJoZW1lXG5cbiAgICAgICAgY29uc3QgdG9wID0gZ2V0VG9wTGV2ZWwoY29uZGl0aW9uKVswXSAvL1RPRE8gKCFBU1NVTUUhKSBzYW1lIGFzIHRvcCBpbiBjb25jbHVzaW9uXG4gICAgICAgIGNvbnN0IGFsaWFzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uZGl0aW9uLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gZ2V0T3duZXJzaGlwQ2hhaW4oY29uc2VxdWVuY2UsIHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiBjb25kaXRpb24uZGVzY3JpYmUoeClbMF0pIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmUgbmFtZVxuICAgICAgICBjb25zdCBwcm9wc05hbWVzID0gcHJvcHMubWFwKHggPT4gY29uc2VxdWVuY2UuZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IGNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG4gICAgICAgIGNvbnN0IHByb3RvID0gZ2V0UHJvdG8ocHJvdG9OYW1lKVxuXG4gICAgICAgIHdyYXAoZ2V0SW5jcmVtZW50YWxJZCgpLCBwcm90bykuc2V0KGNvbmNlcHROYW1lWzBdLCB7IGFsaWFzUGF0aDogcHJvcHNOYW1lcyB9KVxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdoZW5BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChjb250ZXh0LmVudmlyby5xdWVyeSh0aGlzLmNsYXVzZS50aGVtZSkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGF1c2UucmhlbWUuZmxhdExpc3QoKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRBY3Rpb24oYywgdGhpcy5jbGF1c2UucmhlbWUpLnJ1bihjb250ZXh0KVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIDEwMClcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBpc0NvbmNlcHQgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvZnVuY3Rpb25zL2lzQ29uY2VwdFwiXG5pbXBvcnQgQ29uY2VwdEFjdGlvbiBmcm9tIFwiLi9Db25jZXB0QWN0aW9uXCJcbmltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCJcbmltcG9ydCBFZGl0QWN0aW9uIGZyb20gXCIuL0VkaXRBY3Rpb25cIlxuaW1wb3J0IFJlbGF0aW9uQWN0aW9uIGZyb20gXCIuL1JlbGF0aW9uQWN0aW9uXCJcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JbXBseVwiXG5pbXBvcnQgU2V0QWxpYXNBY3Rpb24gZnJvbSBcIi4vU2V0QWxpYXNBY3Rpb25cIlxuaW1wb3J0IE11bHRpQWN0aW9uIGZyb20gXCIuL011bHRpQWN0aW9uXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCJcbmltcG9ydCBJZkFjdGlvbiBmcm9tIFwiLi9JZkFjdGlvblwiXG5pbXBvcnQgV2hlbkFjdGlvbiBmcm9tIFwiLi9XaGVuQWN0aW9uXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9uKGNsYXVzZTogQ2xhdXNlLCB0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uIHtcblxuICAgIC8vIFRPRE86IHByZXBvc2l0aW9ucywgYW5kIGJlIGJld2FyZSBvZiAnb2YnIFxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnaXZlcmInIHx8IGNsYXVzZS5wcmVkaWNhdGU/LnR5cGUgPT09ICdtdmVyYicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWxhdGlvbkFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIC8vIHRvIGNyZWF0ZSBuZXcgY29uY2VwdCBvciBuZXcgaW5zdGFuY2UgdGhlcmVvZlxuICAgIGlmIChjbGF1c2UuYXJncyAmJiB0b3BMZXZlbC5yaGVtZS5kZXNjcmliZShjbGF1c2UuYXJnc1swXSkuc29tZSh4ID0+IGlzQ29uY2VwdCh4KSkpIHsgLy8gXG4gICAgICAgIHJldHVybiBuZXcgQ29uY2VwdEFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UucHJlZGljYXRlPy5wcm90bykge1xuICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxuICAgIH1cblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSAmJiBjbGF1c2UudGhlbWUuZW50aXRpZXMuc29tZShlID0+IGNsYXVzZS50aGVtZS5vd25lcnNPZihlKS5sZW5ndGgpICYmIGNsYXVzZS5yaGVtZS5lbnRpdGllcy5zb21lKGUgPT4gY2xhdXNlLnJoZW1lLm93bmVyc09mKGUpLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXRBbGlhc0FjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZSBpbnN0YW5jZW9mIEltcGx5ICYmIGNsYXVzZS5zdWJqY29uaj8ucm9vdCA9PT0gJ2lmJykge1xuICAgICAgICByZXR1cm4gbmV3IElmQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLnN1Ympjb25qPy5yb290ID09PSAnd2hlbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXaGVuQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUFjdGlvbihjbGF1c2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9ucy9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2UuZmxhdExpc3QoKS5tYXAoeCA9PiBnZXRBY3Rpb24oeCwgY2xhdXNlKSlcbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGEgPT4gYS5ydW4oY29udGV4dCkpXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgcG9pbnRPdXQgfSBmcm9tIFwiLi9wb2ludE91dFwiO1xuaW1wb3J0IHsgdW53cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRLb29sIH0gZnJvbSBcIi4uL2NsYXVzZXMvZnVuY3Rpb25zL2dldEtvb2xcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jb25maWcucHJlbHVkZS5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdCkuc2ltcGxlXG5cbiAgICAgICAgICAgIGlmIChjbGF1c2UuaXNTaWRlRWZmZWN0eSkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hY3R1YXRvci50YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5jb250ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiBbXVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlcnMgPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChpZCA9PiBnZXRLb29sKHRoaXMuY29udGV4dCwgY2xhdXNlLCBpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvLnZhbHVlcy5mb3JFYWNoKHcgPT4gcG9pbnRPdXQodywgeyB0dXJuT2ZmOiB0cnVlIH0pKVxuICAgICAgICAgICAgICAgIHdyYXBwZXJzLmZvckVhY2godyA9PiB3ID8gcG9pbnRPdXQodykgOiAwKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXJzLmZsYXRNYXAobyA9PiBvID8gdW53cmFwKG8pIDogW10pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCB7IENvbmZpZywgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcbmltcG9ydCBnZXRFbnZpcm8sIHsgRW52aXJvLCBHZXRFbnZpcm9PcHMgfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQge1xuICAgIHJlYWRvbmx5IGVudmlybzogRW52aXJvXG4gICAgcmVhZG9ubHkgY29uZmlnOiBDb25maWdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0T3B0cyBleHRlbmRzIEdldEVudmlyb09wcyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NvbnRleHQob3B0czogR2V0Q29udGV4dE9wdHMpOiBDb250ZXh0IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlbnZpcm86IGdldEVudmlybyhvcHRzKSxcbiAgICAgICAgY29uZmlnOiBnZXRDb25maWcoKVxuICAgIH1cbn0iLCJpbXBvcnQgV3JhcHBlciwgeyB1bndyYXAgfSBmcm9tIFwiLi4vZW52aXJvL1dyYXBwZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHBvaW50T3V0KHdyYXBwZXI6IFdyYXBwZXIsIG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkge1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gdW53cmFwKHdyYXBwZXIpXG5cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgb2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvdG9WYXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgbWFrZUFsbFZhcnMgfSBmcm9tIFwiLi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnNcIjtcbmltcG9ydCB7IHByb3BhZ2F0ZVZhcnNPd25lZCB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWRcIjtcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmFcIjtcbmltcG9ydCB7IG1ha2VJbXBseSB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9tYWtlSW1wbHlcIjtcblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3QgaXMgdW5kZWZpbmVkIWApXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbm91biBwaHJhc2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnByZXBvc2l0aW9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZW1lbnRUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJqZWN0ICYmIGFzdD8ubGlua3MucHJlZGljYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdhbmQgc2VudGVuY2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJqZWN0ICYmIGFzdC5saW5rcy5vYmplY3QpIHtcbiAgICAgICAgcmVzdWx0ID0gbXZlcmJTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8uc3ViamVjdCAmJiAhYXN0LmxpbmtzLm9iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBpdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJjb25qKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGMwID0gbWFrZUltcGx5KHJlc3VsdClcbiAgICAgICAgY29uc3QgYzEgPSBtYWtlQWxsVmFycyhjMClcbiAgICAgICAgY29uc3QgYzIgPSByZXNvbHZlQW5hcGhvcmEoYzEpXG4gICAgICAgIGNvbnN0IGMzID0gcHJvcGFnYXRlVmFyc093bmVkKGMyKVxuICAgICAgICByZXR1cm4gYzNcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3QudHlwZX0nIWApXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pLmNvcHkoeyBuZWdhdGU6ICEhY29wdWxhU2VudGVuY2U/LmxpbmtzPy5uZWdhdGlvbiB9KVxuXG4gICAgcmV0dXJuIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxufVxuXG5mdW5jdGlvbiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShjb3B1bGFTdWJDbGF1c2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlPy5saW5rcz8ucHJlZGljYXRlXG5cbiAgICByZXR1cm4gdG9DbGF1c2UocHJlZGljYXRlLCB7IHN1YmplY3Q6IGFyZ3M/LnN1YmplY3QgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBuZXdJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBjb21wbGVtZW50Py5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZVxuXG4gICAgaWYgKCFwcmVwb3NpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHByZXBvc2l0aW9uIScpXG4gICAgfVxuXG4gICAgY29uc3Qgbm91blBocmFzZSA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5bJ25vdW4gcGhyYXNlJ11cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZCh0b0NsYXVzZShub3VuUGhyYXNlLCB7IHN1YmplY3Q6IG5ld0lkIH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBub3VuID0gbm91blBocmFzZS5saW5rcz8uc3ViamVjdFxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gbm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlPy5saW5rcz8uc3ViY2xhdXNlXG5cbiAgICBjb25zdCByZXMgPVxuICAgICAgICBhZGplY3RpdmVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmFuZChjb21wbGVtZW50cy5tYXAoYyA9PiB0b0NsYXVzZShjLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSkucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gdG9DbGF1c2Uoc3ViQ2xhdXNlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYW5kU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbGVmdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ubGVmdCwgYXJncylcbiAgICBjb25zdCByaWdodCA9IHRvQ2xhdXNlKGFzdD8ubGlua3M/LnJpZ2h0Py5saXN0Py5bMF0sIGFyZ3MpXG5cbiAgICBpZiAoYXN0LmxpbmtzPy5sZWZ0Py50eXBlID09PSAnY29wdWxhIHNlbnRlbmNlJykge1xuICAgICAgICByZXR1cm4gbGVmdC5hbmQocmlnaHQpLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIG12ZXJiU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBvYmpJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBvYmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmpJZCB9KVxuICAgIGNvbnN0IG12ZXJiID0gYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIW12ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gbXZlcmIgaW4gbXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKG12ZXJiLCBzdWJqSWQsIG9iaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGl2ZXJiU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmpJZCB9KVxuICAgIGNvbnN0IGl2ZXJiID0gYXN0LmxpbmtzPy5pdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIWl2ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gaXZlcmIgaW4gaXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKGl2ZXJiLCBzdWJqSWQpXG4gICAgICAgIC5jb3B5KHsgbmVnYXRlOiAhIWFzdC5saW5rcy5uZWdhdGlvbiB9KVxuXG4gICAgY29uc3QgcmVzID0gc3ViamVjdFxuICAgICAgICAuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xuXG59XG5cbmZ1bmN0aW9uIGNvbXBsZXhTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJjb25qID0gYXN0LmxpbmtzPy5zdWJjb25qPy5sZXhlbWVcbiAgICBjb25zdCBjb25kaXRpb24gPSB0b0NsYXVzZShhc3QubGlua3M/LmNvbmRpdGlvbiwgYXJncylcbiAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uY29uc2VxdWVuY2UsIGFyZ3MpXG4gICAgY29uc3QgYyA9IGNvbmRpdGlvbi5pbXBsaWVzKGNvbnNlcXVlbmNlKS5jb3B5KHsgc3ViamNvbmo6IHN1YmNvbmosIHNpZGVFZmZlY3R5OiB0cnVlIH0pLnNpbXBsZVxuXG4gICAgcmV0dXJuIGNcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IHNvcnRJZHMgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3NvcnRJZHNcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZVxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHllcyA/IHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzIDogJydcbiAgICB9XG5cbiAgICBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBhYm91dCA9IChpZDogSWQpOiBDbGF1c2UgPT4gdGhpcy5jbGF1c2UxLmFib3V0KGlkKS5hbmQodGhpcy5jbGF1c2UyLmFib3V0KGlkKSlcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIGRlc2NyaWJlID0gKGlkOiBJZCk6IExleGVtZVtdID0+IHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKHF1ZXJ5LmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gW21vY2tNYXAocXVlcnkpXVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdW5pZnkocWU6IElkLCByZTogSWQsIHJlc3VsdDogTWFwW10pIHtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zb21lKHggPT4geFtxZV0gPT09IHJlKSkgeyAvLyBpZiBhbHJlYWR5IHVuaWZpZWQgZG9uJ3QgZG8gaXQgYWdhaW5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaSA9IHJlc3VsdC5maW5kSW5kZXgoeCA9PiAheFtxZV0pXG4gICAgICAgICAgICBjb25zdCBtID0gcmVzdWx0W2ldID8/IHt9XG4gICAgICAgICAgICBtW3FlXSA9IHJlXG4gICAgICAgICAgICByZXN1bHRbaSA+IC0xID8gaSA6IHJlc3VsdC5sZW5ndGhdID0gbVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCByZXN1bHQ6IE1hcFtdID0gW11cbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSlcblxuICAgICAgICBxdWVyeS5lbnRpdGllcy5mb3JFYWNoKHFlID0+IHtcbiAgICAgICAgICAgIHVuaXZlcnNlLmVudGl0aWVzLmZvckVhY2gocmUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmQgPSB1bml2ZXJzZS5hYm91dChyZSkuZmxhdExpc3QoKVxuICAgICAgICAgICAgICAgIGNvbnN0IHFkID0gcXVlcnkuYWJvdXQocWUpLmZsYXRMaXN0KClcbiAgICAgICAgICAgICAgICBjb25zdCByZDIgPSByZC5tYXAoeCA9PiB4LmNvcHkoeyBtYXA6IHsgW3JlXTogcWUgfSB9KSkgLy8gc3Vic2l0dXRlIHJlIGJ5IHFlIGluIHJlYWwgZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAvLyBjb25zdCByZDIgPSAgcmRcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBhcmUgZWFjaCByZDIgdG8gZWFjaCBxZCwgaWYgcHJlZGljYXRlIGlzIHNhbWUgcmVwbGFjZSByIGFyZ3Mgd2l0aCBxIGFyZ3NcbiAgICAgICAgICAgICAgICByZDIuZm9yRWFjaCgociwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBxZC5mb3JFYWNoKHEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHIucHJlZGljYXRlID09PSBxLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG06IE1hcCA9IChyLmFyZ3MgPz8gW10pLm1hcCgoYSwgaSkgPT4gKHsgW2FdOiBxLmFyZ3M/LltpXSA/PyBhIH0pKS5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJkMltpXSA9IHIuY29weSh7IG1hcDogbSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHIudG9TdHJpbmcoKSwgJ21heSBiZSAnLCBxLnRvU3RyaW5nKCksICdyIGJlY29tZXMnLCByZDJbaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgY29uc3QgcWhhc2hlcyA9IHFkLm1hcCh4ID0+IHguaGFzaENvZGUpXG4gICAgICAgICAgICAgICAgY29uc3QgcjJoYXNoZXMgPSByZDIubWFwKHggPT4geC5oYXNoQ29kZSlcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdVbmlmeSBvciBub3Q/JywgJ3FkPScsIHFkLm1hcCh4PT54LnRvU3RyaW5nKCkpLCAncmQyPScsIHJkMi5tYXAoeD0+eC50b1N0cmluZygpKSlcblxuICAgICAgICAgICAgICAgIGlmIChxaGFzaGVzLmV2ZXJ5KHggPT4gcjJoYXNoZXMuaW5jbHVkZXMoeCkpKSB7IC8vIHFlIHVuaWZpZXMgd2l0aCByZSFcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocWUsICdpcycsIHJlLCAnIScpXG4gICAgICAgICAgICAgICAgICAgIHVuaWZ5KHFlLCByZSwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdCAmJiBxZC5zb21lKHggPT4geC5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pZnkocWUsIGl0LCByZXN1bHQpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgbW9ja01hcCB9IGZyb20gXCIuL2Z1bmN0aW9ucy9tb2NrTWFwXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmFyZ3MpXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KHsgcHJlZGljYXRlOiB0aGlzLnByZWRpY2F0ZS5yb290LCBhcmdzOiB0aGlzLmFyZ3MsIG5lZ2F0ZWQ6IHRoaXMubmVnYXRlZCB9KSlcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKFxuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHksXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlLnJvb3QgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGUucm9vdH0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSAmJiB0aGlzLmFyZ3MubGVuZ3RoID09PSAxID8gW3RoaXMucHJlZGljYXRlXSA6IFtdXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAocXVlcnkuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW9ja01hcChxdWVyeSldXG4gICAgICAgIH1cblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LmZsYXRMaXN0KClbMF0gLy9UT0RPISE/Pz9cblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEJhc2ljQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocXVlcnkucHJlZGljYXRlLnJvb3QgIT09IHRoaXMucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG5cbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkcz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2U6IENsYXVzZSA9IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbiAgICBjbGF1c2UxPzogQ2xhdXNlXG4gICAgY2xhdXNlMj86IENsYXVzZVxuICAgIHN1Ympjb25qPzogTGV4ZW1lXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWVyeU9wdHMge1xuICAgIGl0PzogSWRcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IDBcbiAgICByZWFkb25seSBlbnRpdGllcyA9IFtdXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXNcbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgZGVzY3JpYmUgPSAoaWQ6IElkKTogTGV4ZW1lW10gPT4gW11cbiAgICBxdWVyeSA9IChjbGF1c2U6IENsYXVzZSk6IE1hcFtdID0+IFtdXG4gICAgdG9TdHJpbmcgPSAoKSA9PiAnJ1xuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgdGhlbWUgPSB0aGlzLmNvbmRpdGlvblxuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpcy5jb25zZXF1ZW5jZVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpICsgdGhpcy5jb25zZXF1ZW5jZS50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25zZXF1ZW5jZTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViamNvbmo/OiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2VcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMSA/PyB0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5LFxuICAgICAgICAgICAgb3B0cz8uc3ViamNvbmogPz8gdGhpcy5zdWJqY29uaixcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMgICBcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIC8vIHJldHVybiBlbXB0eUNsYXVzZSAvLy9UT0RPISEhISEhISFcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmFib3V0KGlkKS5hbmQodGhpcy5jb25zZXF1ZW5jZS5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuc3ViamNvbmo/LnJvb3QgPz8gJyd9ICR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRLb29sKGNvbnRleHQ6IENvbnRleHQsIGNsYXVzZTogQ2xhdXNlLCBsb2NhbElkOiBJZCk6IFdyYXBwZXJbXSB7XG5cbiAgICBjb25zdCBvd25lcklkcyA9IGNsYXVzZS5vd25lcnNPZihsb2NhbElkKSAvLyAwIG9yIDEgb3duZXIocylcblxuICAgIGlmIChvd25lcklkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgcmV0dXJuIG1hcHMubWFwKHggPT4geFtsb2NhbElkXSkuZmxhdE1hcCh4ID0+IGNvbnRleHQuZW52aXJvLmdldCh4KSA/PyBbXSlcbiAgICB9XG5cbiAgICBjb25zdCBvd25lciA9IGdldEtvb2woY29udGV4dCwgY2xhdXNlLCBvd25lcklkc1swXSlcbiAgICByZXR1cm4gb3duZXIuZmxhdE1hcCh4ID0+IHguZ2V0KGNsYXVzZS5hYm91dChsb2NhbElkKSkgPz8gW10pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKTogSWRbXSB7XG5cbiAgICBjb25zdCBvd25lZEVudGl0aWVzID0gY2xhdXNlLm93bmVkQnkoZW50aXR5KVxuXG4gICAgcmV0dXJuIG93bmVkRW50aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgW2VudGl0eV0gOlxuICAgICAgICBbZW50aXR5XS5jb25jYXQoZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBvd25lZEVudGl0aWVzWzBdKSlcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCB7IHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvQ29uc3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4uL0ltcGx5XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlSW1wbHkoY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlO1xuICAgIH1cblxuICAgIGlmIChjbGF1c2UucmhlbWUgPT09IGVtcHR5Q2xhdXNlKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2U7XG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5lbnRpdGllcy5zb21lKGUgPT4gaXNWYXIoZSkpKSB7XG4gICAgICAgIGNvbnN0IHIgPSBjbGF1c2UudGhlbWUuaW1wbGllcyhjbGF1c2UucmhlbWUpLmNvcHkoeyBzaWRlRWZmZWN0eTogY2xhdXNlLmlzU2lkZUVmZmVjdHkgfSk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIHJldHVybiBjbGF1c2U7XG59XG4iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2NrTWFwKGNsYXVzZTogQ2xhdXNlKTogTWFwIHtcbiAgICByZXR1cm4gY2xhdXNlLmVudGl0aWVzLm1hcChlID0+ICh7IFtlXTogZSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCJcbmltcG9ydCB7IGlzVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9pc1ZhclwiXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtID0gY2xhdXNlLnRoZW1lLnF1ZXJ5KGNsYXVzZS5yaGVtZSlbMF1cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gPz8ge30gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuL0NvbmZpZ1wiXG5pbXBvcnQgeyBtYWNyb1RvU3ludGF4IH0gZnJvbSBcIi4uL3BhcnNlci9tYWNyb1RvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NvbmZpZyBpbXBsZW1lbnRzIENvbmZpZyB7XG5cbiAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3QgPSB0aGlzLmdldFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW10sXG4gICAgICAgIHByb3RlY3RlZCBfbGV4ZW1lczogTGV4ZW1lW10sXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheE1hcDogU3ludGF4TWFwLFxuICAgICAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXSxcbiAgICAgICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSxcbiAgICApIHtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0U3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcbiAgICB9XG5cbiAgICBnZXQgc3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10geyAvL1RPRE86IHJlLXNvcnQgb25seSB3aGVuIG5lZWRlZFxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zeW50YXhMaXN0XG5cbiAgICAgICAgLy8gcmV0dXJuIFtcbiAgICAgICAgLy8gICAgICdtYWNybycsXG4gICAgICAgIC8vICAgICAnbWFjcm9wYXJ0JyxcbiAgICAgICAgLy8gICAgICd0YWdnZWR1bmlvbicsXG4gICAgICAgIC8vICAgICAnY29tcGxleCBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdjb3B1bGEgc2VudGVuY2UnLFxuICAgICAgICAvLyAgICAgJ2l2ZXJiIHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdtdmVyYiBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgIC8vICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgLy8gICAgICdub3VuIHBocmFzZScsXG4gICAgICAgIC8vIF1cbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0ID0gdGhpcy5nZXRTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSkge1xuICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgcHJlbHVkZSB9IGZyb20gXCIuL3ByZWx1ZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3RhdGljRGVzY1ByZWNlZGVuY2UsIHN5bnRheGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBwcmVsdWRlOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgcHJlbHVkZSxcbiAgICAgICAgc3RhdGljRGVzY1ByZWNlZGVuY2UpXG59XG5cbiIsImltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgTGV4ZW1lVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBsZXhlbWVUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGxleGVtZVR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICdhZGplY3RpdmUnLFxuICAnY29udHJhY3Rpb24nLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICdpdmVyYicsXG4gICdtdmVyYicsXG4gICduZWdhdGlvbicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ2ZpbGxlcicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAge1xuICAgICAgICByb290OiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGlycmVndWxhckZvcm1zOiBbJ2hhdmUnLCAnaGFzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBwcm90bzogJ0hUTUxCdXR0b25FbGVtZW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkaXYnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTERpdkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2VsZW1lbnQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xpc3QnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnQXJyYXknXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBpcnJlZ3VsYXJGb3JtczogWydpcycsICdhcmUnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiaXNuJ3RcIixcbiAgICAgICAgdHlwZTogJ2NvbnRyYWN0aW9uJyxcbiAgICAgICAgY29udHJhY3Rpb25Gb3I6IFsnaXMnLCAnbm90J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXJGb3JtczogWydkbycsICdkb2VzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc29tZScsXG4gICAgICAgIHR5cGU6ICdleGlzdHF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdldmVyeScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYWxsJyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RvJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aXRoJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdmcm9tJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvZicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3ZlcicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb24nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2F0JyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ2ZpbGxlcicgLy8gZmlsbGVyIHdvcmQsIHdoYXQgYWJvdXQgcGFydGlhbCBwYXJzaW5nP1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2l0JyxcbiAgICAgICAgdHlwZTogJ3Byb25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGNvbmNlcHRzOiBbJ2NvbmNlcHQnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvYmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25kaXRpb24nLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25zZXF1ZW5jZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfVxuXVxuXG4vKipcbiAqIEdyYW1tYXJcbiAqL1xuY29uc3RpdHVlbnRUeXBlcy5jb25jYXQobGV4ZW1lVHlwZXMgYXMgYW55KS5mb3JFYWNoKGcgPT4ge1xuICAgIGxleGVtZXMucHVzaCh7XG4gICAgICAgIHJvb3Q6IGcsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0pXG59KSIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmdbXSA9IFtcblxuICAvLyBncmFtbWFyXG4gICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW4gcGhyYXNlJyxcblxuICBgY29wdWxhIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuIHBocmFzZWAsXG5cbiAgYG5vdW4gcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIG12ZXJiIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBwcmVkaWNhdGUgbm91biBwaHJhc2UnLFxuICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZScsXG5cbiAgYGFuZCBzZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYSBzZW50ZW5jZSBvciBub3VuIHBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lIG9yIG1vcmUgcmlnaHQgYW5kIHNlbnRlbmNlIG9yIGNvcHVsYSBzZW50ZW5jZSBvciBub3VuIHBocmFzZWAsXG5cbiAgYG12ZXJiIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIG12ZXJiXG5cdFx0dGhlbiBvYmplY3Qgbm91biBwaHJhc2VgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgYGl2ZXJiIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gIGBzaW1wbGUgc2VudGVuY2UgaXMgY29wdWxhIHNlbnRlbmNlIG9yIGl2ZXJiIHNlbnRlbmNlIG9yIG12ZXJiIHNlbnRlbmNlYCxcblxuICBgY3MyIGlzIGNvbnNlcXVlbmNlIHNpbXBsZSBzZW50ZW5jZVxuICAgICAgdGhlbiBzdWJjb25qXG4gICAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUgc2VudGVuY2VgLFxuXG4gIGBjczEgaXMgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUgc2VudGVuY2UgXG4gICAgdGhlbiBmaWxsZXIgXG4gICAgdGhlbiBjb25zZXF1ZW5jZSBzaW1wbGUgc2VudGVuY2VgLFxuXG4gIC8vIGRvbWFpblxuICAnY29sb3IgaXMgYSBjb25jZXB0JyxcbiAgJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFyZSBjb2xvcnMnLFxuICAnY29sb3Igb2YgYW55IGVsZW1lbnQgaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBpdCcsXG4gICd0ZXh0IG9mIGFueSBidXR0b24gaXMgdGV4dENvbnRlbnQgb2YgaXQnLFxuXSIsImltcG9ydCB7IFJvbGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIjtcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCI7XG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz47XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgJ25vdW4gcGhyYXNlJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ3N1YmNsYXVzZScsXG4gICAgJ2FuZCBzZW50ZW5jZScsXG4gICAgJ212ZXJiIHNlbnRlbmNlJyxcbiAgICAnaXZlcmIgc2VudGVuY2UnLFxuICAgICdzaW1wbGUgc2VudGVuY2UnLFxuICAgICdjb21wbGV4IHNlbnRlbmNlJyxcbiAgICAnY3MxJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW10gPSBbXG4gICAgJ21hY3JvJyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAndGFnZ2VkdW5pb24nLFxuXVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdub3VuJyBhcyBSb2xlIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfVxuICAgIF0sXG4gICAgJ21hY3JvcGFydCc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2FkamVjdGl2ZSddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2ZpbGxlciddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2dyYW1tYXInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ3N1YmNsYXVzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnbm91biBwaHJhc2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG5cbiAgICBdLFxuXG4gICAgJ2NvcHVsYSBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnYW5kIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdtdmVyYiBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnaXZlcmIgc2VudGVuY2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ3NpbXBsZSBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY29tcGxleCBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY3MxJzogW1xuXG4gICAgXVxufVxuXG4iLCJpbXBvcnQgeyBDbGF1c2UsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgd3JhcCB9IGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBvYmplY3QpOiBXcmFwcGVyIHtcbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IHBsYWNlaG9sZGVyPy5jb3B5KHsgb2JqZWN0OiBvYmplY3QgfSkgPz8gd3JhcChpZCwgb2JqZWN0KVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLnZhbHVlc1xuICAgICAgICAgICAgLm1hcCh3ID0+IHcuY2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICByZXR1cm4gdW5pdmVyc2UucXVlcnkocXVlcnksIHsgaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgQ29weU9wdHMsIFNldE9wcywgdW53cmFwIH0gZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi4vY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4uL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBhbGlhc2VzOiB7IFthbGlhczogc3RyaW5nXTogeyBwYXRoOiBzdHJpbmdbXSwgbGV4ZW1lOiBMZXhlbWUgfSB9ID0gdGhpcy5vYmplY3QuYWxpYXNlcyA/PyB7fVxuICAgIHJlYWRvbmx5IHNpbXBsZVByZWRpY2F0ZXM6IExleGVtZVtdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBpc1BsYWNlaG9sZGVyOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBwYXJlbnQ/OiBXcmFwcGVyXG4gICAgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LmFsaWFzZXMgPSB0aGlzLmFsaWFzZXNcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnNpbXBsZVByZWRpY2F0ZXMgPSB0aGlzLnNpbXBsZVByZWRpY2F0ZXNcbiAgICAgICAgfSBjYXRjaCB7IH1cblxuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgLy9UT0RPOiBwcm9ibGVtIHdoZW4gdGhpcyB3cmFwcGVyIGlzIHRleHRDb250ZW50IGJlY2F1c2UgcHJlZGljYXRlIGhhcyBubyBjb25jZXB0IGFuZCBwYXRoIGlzIHVua25vd24gKG5vdCBwYXNzZWQpIHRvIHBhcmVudFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnNldChwcmVkaWNhdGUsIHsgLi4ub3B0cywgcHJvcHM6IFsuLi5vcHRzPy5wcm9wcyA/PyBbXV0gfSlcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBpZiAob3B0cz8uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHMuYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzPy5hbGlhc1BhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEFsaWFzKHByZWRpY2F0ZSwgb3B0cy5hbGlhc1BhdGgpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wcyA9IG9wdHM/LnByb3BzID8/IFtdXG5cbiAgICAgICAgaWYgKHRoaXMuaXNQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLmxlbmd0aCA+IDEpIHsgLy8gYXNzdW1lID4gMSBwcm9wcyBhcmUgYSBwYXRoXG4gICAgICAgICAgICB0aGlzLnNldE11bHRpUHJvcChwcm9wcywgcHJlZGljYXRlLCBvcHRzKVxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW5nbGVQcm9wKHByZWRpY2F0ZSwgcHJvcHNbMF0sIG9wdHMpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFplcm9Qcm9wcyhwcmVkaWNhdGUsIG9wdHMpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRNdWx0aVByb3AocGF0aDogTGV4ZW1lW10sIHZhbHVlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHsgLy8gYXNzdW1lIG5vdCBjb25jZXB0XG5cbiAgICAgICAgaWYgKG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgubWFwKHggPT4geC5yb290KSwgJycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLm1hcCh4ID0+IHgucm9vdCksIHZhbHVlLnJvb3QpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcmVkaWNhdGUuY29uY2VwdHM/LmF0KDApID8/ICcnXT8ucGF0aFxuXG4gICAgICAgIHJldHVybiBwYXRoID9cbiAgICAgICAgICAgIHRoaXMuZ2V0TmVzdGVkKHBhdGgpID09PSBwcmVkaWNhdGUucm9vdCA6XG4gICAgICAgICAgICB0aGlzLmlzU2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc1NpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGU6IExleGVtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGVQcmVkaWNhdGVzLm1hcCh4ID0+IHgucm9vdCkuaW5jbHVkZXMocHJlZGljYXRlLnJvb3QpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFsaWFzZXNbY29uY2VwdE5hbWUucm9vdF0gPSB7IHBhdGg6IHByb3BQYXRoLm1hcCh4ID0+IHgucm9vdCksIGxleGVtZTogY29uY2VwdE5hbWUgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjYWxsKHZlcmI6IExleGVtZSwgYXJnczogV3JhcHBlcltdKSB7XG4gICAgICAgIGNvbnN0IGNvbmNlcHQgPSB0aGlzLmFsaWFzZXNbdmVyYi5yb290XT8ucGF0aFxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gY29uY2VwdD8uWzBdID8/IHZlcmIucm9vdFxuICAgICAgICByZXR1cm4gdGhpcz8ub2JqZWN0W21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKHggPT4gdW53cmFwKHgpKSlcbiAgICB9XG5cbiAgICBjbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHByZWRzOiBMZXhlbWVbXSA9XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmFsaWFzZXMpXG4gICAgICAgICAgICAgICAgLm1hcChrID0+IHRoaXMuZ2V0TmVzdGVkKHRoaXMuYWxpYXNlc1trXS5wYXRoKSlcbiAgICAgICAgICAgICAgICAubWFwKCh4KTogTGV4ZW1lID0+ICh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5zaW1wbGVQcmVkaWNhdGVzKVxuXG4gICAgICAgIGxldCByZXMgPSBwcmVkc1xuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHRoaXMuaWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiByZXMuYW5kKHRoaXMuZXh0cmFJbmZvKHF1ZXJ5KSlcblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBleHRyYUluZm8ocXVlcnk/OiBDbGF1c2UpIHtcblxuICAgICAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4ocXVlcnksIGdldFRvcExldmVsKHF1ZXJ5KVswXSlcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBvYy5tYXAoeCA9PiBxdWVyeS5kZXNjcmliZSh4KT8uWzBdPy5yb290KS5zbGljZSgxKVxuICAgICAgICAgICAgY29uc3QgbmVzdGVkID0gdGhpcy5nZXROZXN0ZWQodGhpcy5hbGlhc2VzPy5bcGF0aD8uWzBdXT8ucGF0aCA/PyBwYXRoKVxuXG4gICAgICAgICAgICBpZiAobmVzdGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcXVlcnkuY29weSh7IG1hcDogeyBbb2NbMF1dOiB0aGlzLmlkIH0gfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldFNpbmdsZVByb3AodmFsdWU6IExleGVtZSwgcHJvcDogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcm9wLnJvb3RdPy5wYXRoID8/IFtwcm9wLnJvb3RdXG5cbiAgICAgICAgaWYgKCFvcHRzPy5uZWdhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLCB2YWx1ZS5yb290KVxuICAgICAgICB9IGVsc2UgaWYgKG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsICcnKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0WmVyb1Byb3BzKHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcmVkaWNhdGU/LmNvbmNlcHRzPy5bMF0gYXMgYW55XT8ucGF0aFxuXG4gICAgICAgIGlmIChwYXRoKSB7XG5cbiAgICAgICAgICAgIGlmICghb3B0cz8ubmVnYXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXMocHJlZGljYXRlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub2JqZWN0W3ByZWRpY2F0ZS5yb290XSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwcmVkaWNhdGUucm9vdF0gPSAhb3B0cz8ubmVnYXRlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSkgLy9UT0RPOiBjaGVjayBkdXBsaWNhdGVzIVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4Py5bcF1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4geFxuXG4gICAgfVxuXG4gICAgdHlwZU9mKHdvcmQ6IHN0cmluZyk6IExleGVtZVR5cGUgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmFsaWFzZXNbd29yZF0/LnBhdGggPz8gW3dvcmRdXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLmdldE5lc3RlZChwYXRoKVxuXG4gICAgICAgIGlmICh0eXBlb2YgdyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuICh3Lmxlbmd0aCA/PyAwKSA+IDAgPyAnbXZlcmInIDogJ2l2ZXJiJ1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICdub3VuJ1xuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogV3JhcHBlciB7XG5cbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBCYXNlV3JhcHBlcihcbiAgICAgICAgICAgIG9wdHM/Lm9iamVjdCA/PyB0aGlzLmNvcHlXcmFwcGVkKCksXG4gICAgICAgICAgICB0aGlzLmlkLFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8gZmFsc2UgOiB0aGlzLmlzUGxhY2Vob2xkZXIsXG4gICAgICAgIClcblxuICAgICAgICB0aGlzLnNpbXBsZVByZWRpY2F0ZXMuZm9yRWFjaCh4ID0+IGNvcHkuc2V0KHgpKVxuICAgICAgICByZXR1cm4gY29weVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBjb3B5V3JhcHBlZCgpIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlZCA9IHRoaXMub2JqZWN0LmNsb25lTm9kZSgpIGFzIEhUTUxFbGVtZW50XG4gICAgICAgICAgICB3cmFwcGVkLmlubmVySFRNTCA9IHRoaXMub2JqZWN0LmlubmVySFRNTFxuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnRoaXMub2JqZWN0IH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldChjbGF1c2U6IENsYXVzZSk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IHggPSBjbGF1c2UuZW50aXRpZXMuZmxhdE1hcChlID0+IGNsYXVzZS5kZXNjcmliZShlKSlbMF1cblxuICAgICAgICBpZiAoeCkge1xuXG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3gucm9vdF0/LnBhdGhcbiAgICAgICAgICAgIC8vIHgucm9vdCA9PT0gJ3RleHQnID8gY29uc29sZS5sb2cocGF0aCkgOiAwXG4gICAgICAgICAgICBjb25zdCBvYmplY3QgPSBwYXRoID8gdGhpcy5nZXROZXN0ZWQocGF0aCkgOiB0aGlzLm9iamVjdFt4LnJvb3RdXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJhc2VXcmFwcGVyKG9iamVjdCwgZ2V0SW5jcmVtZW50YWxJZCgpLCBmYWxzZSwgdGhpcylcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBvYmplY3QpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIHJlYWRvbmx5IHZhbHVlczogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IEJhc2VXcmFwcGVyIGZyb20gXCIuL0Jhc2VXcmFwcGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgY2xhdXNlKGNsYXVzZT86IENsYXVzZSk6IENsYXVzZVxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueVxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhblxuICAgIHR5cGVPZih3b3JkOiBzdHJpbmcpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBXcmFwcGVyXG5cbiAgICBnZXQoY2xhdXNlOiBDbGF1c2UpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgcGFyZW50PzogV3JhcHBlclxuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0T3BzIHtcbiAgICBwcm9wcz86IExleGVtZVtdXG4gICAgbmVnYXRlZD86IGJvb2xlYW5cbiAgICBhcmdzPzogV3JhcHBlcltdXG4gICAgYWxpYXNQYXRoPzogTGV4ZW1lW11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgb2JqZWN0Pzogb2JqZWN0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKGlkOiBJZCwgbz86IE9iamVjdCk6IFdyYXBwZXIge1xuICAgIHJldHVybiBuZXcgQmFzZVdyYXBwZXIobyA/PyB7fSwgaWQsIG8gPT09IHVuZGVmaW5lZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcCh3cmFwcGVyOiBXcmFwcGVyKTogb2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdyYXBwZXIgYXMgYW55KS5vYmplY3Rcbn0iLCJpbXBvcnQgeyB0b1ZhciB9IGZyb20gXCIuL3RvVmFyXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdldEluY3JlbWVudGFsSWRPcHRzIHtcbiAgICBhc1ZhcjogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZChvcHRzPzogR2V0SW5jcmVtZW50YWxJZE9wdHMpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBvcHRzPy5hc1ZhciA/IHRvVmFyKG5ld0lkKSA6IG5ld0lkO1xufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbnN0KGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b0xvd2VyQ2FzZSgpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXIoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvVXBwZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpIiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IGdldExleGVtZXMgfSBmcm9tIFwiLi9mdW5jdGlvbnMvZ2V0TGV4ZW1lc1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyByZXNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3Jlc3BhY2VcIjtcbmltcG9ydCB7IHN0ZHNwYWNlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyBqb2luTXVsdGlXb3JkTGV4ZW1lcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7IC8vIFRPRE86IG1ha2UgY2FzZSBpbnNlbnNpdGl2ZVxuXG4gICAgICAgIGNvbnN0IHdvcmRzID1cbiAgICAgICAgICAgIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHN0ZHNwYWNlKHNvdXJjZUNvZGUpLCBjb250ZXh0LmNvbmZpZy5sZXhlbWVzKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiByZXNwYWNlKHMpKVxuXG4gICAgICAgIHRoaXMudG9rZW5zID0gd29yZHMuZmxhdE1hcCh3ID0+IGdldExleGVtZXModywgY29udGV4dCwgd29yZHMpKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vYnJhaW4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUobGV4ZW1lOiBMZXhlbWUpOiBzdHJpbmdbXSB7XG5cbiAgICBjb25zdCB3b3JkID0gbGV4ZW1lLnRva2VuID8/IGxleGVtZS5yb290XG5cbiAgICBpZiAobGV4ZW1lLmlycmVndWxhckZvcm1zKSB7XG4gICAgICAgIHJldHVybiBbd29yZCwgLi4ubGV4ZW1lLmlycmVndWxhckZvcm1zXVxuICAgIH1cblxuICAgIHJldHVybiBbd29yZCwgYCR7d29yZH1zYF1cblxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuaW1wb3J0IHsgc3RlbSB9IGZyb20gXCIuL3N0ZW1cIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY0xleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cbiAgICBjb25zdCBzdGVtbWVkV29yZCA9IHN0ZW0oeyByb290OiB3b3JkLCB0eXBlOiAnYW55JyB9KTtcblxuICAgIGNvbnN0IHR5cGVzID0gd29yZHNcbiAgICAgICAgLm1hcCh3ID0+IGNsYXVzZU9mKHsgcm9vdDogdywgdHlwZTogJ2FueScgfSwgJ1gnKSlcbiAgICAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LmVudmlyby5xdWVyeShjKSlcbiAgICAgICAgLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAubWFwKGlkID0+IGNvbnRleHQuZW52aXJvLmdldChpZCkpXG4gICAgICAgIC5tYXAoeCA9PiB4Py50eXBlT2Yoc3RlbW1lZFdvcmQpKVxuICAgICAgICAuZmlsdGVyKHggPT4geCAhPT0gdW5kZWZpbmVkKTtcblxuICAgIHJldHVybiB7IHJvb3Q6IHN0ZW1tZWRXb3JkLCB0eXBlOiB0eXBlc1swXSA/PyAnbm91bicgfTtcbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBkeW5hbWljTGV4ZW1lIH0gZnJvbSBcIi4vZHluYW1pY0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWVbXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZSA9IGNvbnRleHRcbiAgICAgICAgLmNvbmZpZ1xuICAgICAgICAubGV4ZW1lc1xuICAgICAgICAuZmlsdGVyKHggPT4gY29uanVnYXRlKHgpLmluY2x1ZGVzKHdvcmQpKVxuICAgICAgICAuYXQoMCkgPz8gZHluYW1pY0xleGVtZSh3b3JkLCBjb250ZXh0LCB3b3JkcylcblxuICAgIGNvbnN0IGxleGVtZTI6IExleGVtZSA9IHsgLi4ubGV4ZW1lLCB0b2tlbjogd29yZCB9XG5cbiAgICByZXR1cm4gbGV4ZW1lMi5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleGVtZTIuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgY29udGV4dCwgd29yZHMpKSA6XG4gICAgICAgIFtsZXhlbWUyXVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdG8obGV4ZW1lOiBMZXhlbWUpOiBPYmplY3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSk/LltsZXhlbWUucHJvdG8gYXMgYW55XT8ucHJvdG90eXBlO1xufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNlcHQobGV4ZW1lPzogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZT8uY29uY2VwdHM/LmluY2x1ZGVzKCdjb25jZXB0Jyk7XG59XG4iLCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTXVsdGlXb3JkKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZS5yb290LmluY2x1ZGVzKCcgJyk7XG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBpc011bHRpV29yZCB9IGZyb20gXCIuL2lzTXVsdGlXb3JkXCI7XG5pbXBvcnQgeyBzdGRzcGFjZSB9IGZyb20gXCIuL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyB1bnNwYWNlIH0gZnJvbSBcIi4vdW5zcGFjZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gam9pbk11bHRpV29yZExleGVtZXMoc291cmNlQ29kZTogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWVbXSkge1xuXG4gICAgbGV0IG5ld1NvdXJjZSA9IHNvdXJjZUNvZGU7XG5cbiAgICBsZXhlbWVzXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc011bHRpV29yZCh4KSlcbiAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXhlbWUgPSBzdGRzcGFjZSh4LnJvb3QpO1xuICAgICAgICAgICAgbmV3U291cmNlID0gbmV3U291cmNlLnJlcGxhY2VBbGwobGV4ZW1lLCB1bnNwYWNlKGxleGVtZSkpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBuZXdTb3VyY2U7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiByZXNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCctJywgJyAnKTtcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJyk7XG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHN0ZW0obGV4ZW1lOiBMZXhlbWUpOiBzdHJpbmcge1xuXG4gICAgY29uc3Qgd29yZCA9IGxleGVtZS50b2tlbiA/PyBsZXhlbWUucm9vdDtcblxuICAgIGlmIChsZXhlbWUuaXJyZWd1bGFyRm9ybXMpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgaWYgKHdvcmQuZW5kc1dpdGgoJ3MnKSkge1xuICAgICAgICByZXR1cm4gd29yZC5zbGljZSgwLCAtMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHVuc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJyAnLCAnLScpO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIGJyYWluOiBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5oaWRkZW4gPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID8gdGV4dGFyZWEuZm9jdXMoKSA6IDBcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICB0ZXh0YXJlYS5zdHlsZS53aWR0aCA9ICc1MHZ3J1xuICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9ICcxZW0nXG4gICAgdGV4dGFyZWEuaGlkZGVuID0gdHJ1ZVxuICAgIHRleHRhcmVhLnN0eWxlLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICB0ZXh0YXJlYS5zdHlsZS50b3AgPSAnMCdcbiAgICB0ZXh0YXJlYS5zdHlsZS56SW5kZXggPSAnMTAwMCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSk7XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxufSIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2JyYWluL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29udGV4dCkpIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb250ZXh0LmNvbmZpZy5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnNpbXBsaWZ5KGFzdCkpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5jb25maWcuZ2V0U3ludGF4KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNMZWFmKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG1lbWJlcnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbnRleHQuY29uZmlnLmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvbmZpZy5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICghYXN0LmxpbmtzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXN0XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzeW50YXggPSB0aGlzLmNvbnRleHQuY29uZmlnLmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSAmJiBPYmplY3QudmFsdWVzKGFzdC5saW5rcykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShPYmplY3QudmFsdWVzKGFzdC5saW5rcylbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLm1hcChsID0+ICh7IFtsWzBdXTogdGhpcy5zaW1wbGlmeShsWzFdKSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCBsaW5rczogc2ltcGxlTGlua3MgfVxuXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4uL0tvb2xQYXJzZXJcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuL0FzdE5vZGVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IEtvb2xQYXJzZXIoc291cmNlQ29kZSwgY29udGV4dClcbn1cbiIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgU3ludGF4LCBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKTogeyBuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4IH0ge1xuXG4gICAgY29uc3QgbWFjcm9wYXJ0cyA9IG1hY3JvPy5saW5rcz8ubWFjcm9wYXJ0Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ludGF4ID0gbWFjcm9wYXJ0cy5tYXAobSA9PiBtYWNyb1BhcnRUb01lbWJlcihtKSlcbiAgICBjb25zdCBuYW1lID0gbWFjcm8/LmxpbmtzPy5ub3VuPy5sZXhlbWU/LnJvb3RcblxuICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub255bW91cyBzeW50YXghJylcbiAgICB9XG5cbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IEFzdE5vZGUpOiBNZW1iZXIge1xuXG4gICAgY29uc3QgYWRqZWN0aXZlTm9kZXMgPSBtYWNyb1BhcnQubGlua3M/LmFkamVjdGl2ZT8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBhZGplY3RpdmVOb2Rlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG5cbiAgICBjb25zdCB0YWdnZWRVbmlvbnMgPSBtYWNyb1BhcnQubGlua3M/LnRhZ2dlZHVuaW9uPy5saXN0ID8/IFtdXG4gICAgY29uc3QgZ3JhbW1hcnMgPSB0YWdnZWRVbmlvbnMubWFwKHggPT4geC5saW5rcz8uZ3JhbW1hcilcblxuICAgIGNvbnN0IHF1YW50YWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gYS5jYXJkaW5hbGl0eSlcbiAgICBjb25zdCBxdWFsYWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gIWEuY2FyZGluYWxpdHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5mdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuLi9icmFpbi9CYXNpY0JyYWluXCI7XG5pbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiO1xuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuICAgIHRlc3QxOCxcbiAgICB0ZXN0MTksXG4gICAgdGVzdDIwLFxuICAgIHRlc3QyMSxcbiAgICB0ZXN0MjIsXG4gICAgdGVzdDIzLFxuICAgIHRlc3QyNCxcbiAgICB0ZXN0MjUsXG5dXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRlc3QoKSA/ICdzdWNjZXNzJyA6ICdmYWlsJywgdGVzdC5uYW1lKVxuICAgICAgICBhd2FpdCBzbGVlcCgxMCkvLzc1XG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdyZWQnKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgndyBhbmQgeiBhcmUgYmxhY2snKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDRcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5JylcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGUoJ3knKVswXSlcbn1cblxuZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbiBhbmQgaXQgaXMgZ3JlZW4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyByZWQuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIG5vdCBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdXG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggY2xpY2tzJylcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG59XG5cbmZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSByZWQgYnV0dG9uIGlzIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4gaWYgeCBpcyByZWQgdGhlbiB5IGlzIGEgZ3JlZW4gYnV0dG9uJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4gYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MjAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbiBpZiB4IGlzIHJlZCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGUoJ2dyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gdGVzdDIxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4gY29sb3Igb2YgZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFyZSBidXR0b25zLiBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgncmVkIGJ1dHRvbnMnKS5sZW5ndGggPT09IDNcbn1cblxuZnVuY3Rpb24gdGVzdDIzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgcmVkLiBldmVyeSByZWQgaXMgYSBidXR0b24nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCdyZWQgYnV0dG9ucycpLmxlbmd0aCA9PT0gM1xufVxuXG5mdW5jdGlvbiB0ZXN0MjQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQgYnV0dG9ucycpXG4gICAgbGV0IGNsaWNrcyA9ICcnXG4gICAgYnJhaW4uZXhlY3V0ZSgneCcpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3gnXG4gICAgYnJhaW4uZXhlY3V0ZSgneScpWzBdLm9uY2xpY2sgPSAoKSA9PiBjbGlja3MgKz0gJ3knXG4gICAgYnJhaW4uZXhlY3V0ZSgnZXZlcnkgYnV0dG9uIGNsaWNrcycpXG4gICAgcmV0dXJuIGNsaWNrcyA9PT0gJ3h5J1xufVxuXG5mdW5jdGlvbiB0ZXN0MjUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zLiB4IGlzIHJlZCBhbmQgeSBpcyBibHVlJylcbiAgICBicmFpbi5leGVjdXRlKCd0aGUgYnV0dG9uIHRoYXQgaXMgYmx1ZSBpcyBibGFjaycpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJydcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnd2hpdGUnXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHRhZ05hbWVGcm9tUHJvdG8gfSBmcm9tIFwiLi90YWdOYW1lRnJvbVByb3RvXCJcblxuLyoqXG4gKiBcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhbiBvYmplY3QgKGV2ZW4gSFRNTEVsZW1lbnQpIGZyb20gYSBwcm90b3R5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdJbnN0YW5jZShwcm90bzogb2JqZWN0KSB7XG5cbiAgICByZXR1cm4gcHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/XG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZUZyb21Qcm90byhwcm90bykpIDpcbiAgICAgICAgbmV3IChwcm90byBhcyBhbnkpLmNvbnN0cnVjdG9yKClcblxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCJcbi8qKlxuICogVHJ5IGdldHRpbmcgdGhlIG5hbWUgb2YgYW4gaHRtbCBlbGVtZW50IGZyb20gYSBwcm90b3R5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IHRhZ05hbWVGcm9tUHJvdG8gPSAoeDogb2JqZWN0KSA9PiB4LmNvbnN0cnVjdG9yLm5hbWVcbiAgICAucmVwbGFjZSgnSFRNTCcsICcnKVxuICAgIC5yZXBsYWNlKCdFbGVtZW50JywgJycpXG4gICAgLnRvTG93ZXJDYXNlKClcbiIsIlxuLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGEgbGlzdCBvZiBwcmltaXRpdmVzIChudW1iZXJzLCBib29scywgc3RyaW5ncykuXG4gKiBDYXJlZnVsIHVzaW5nIHRoaXMgd2l0aCBvYmplY3RzLlxuICovXG5leHBvcnQgY29uc3QgdW5pcSA9ICh4OiBhbnlbXSkgPT4gQXJyYXkuZnJvbShuZXcgU2V0KHgpKVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==