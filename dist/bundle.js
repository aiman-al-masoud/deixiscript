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
class CreateAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d, _e;
        const id = (_c = (0, getAction_1.lookup)((_b = (_a = this.clause) === null || _a === void 0 ? void 0 : _a.args) === null || _b === void 0 ? void 0 : _b[0], context, this.topLevel)) !== null && _c !== void 0 ? _c : (0, getIncrementalId_1.getIncrementalId)();
        const predicate = this.clause.predicate;
        if (!predicate || !id) {
            return;
        }
        if ((_d = context.enviro.get(id)) === null || _d === void 0 ? void 0 : _d.is(predicate)) { //  existence check prior to creating
            return;
        }
        const proto = (0, getProto_1.getProto)(predicate);
        if (proto instanceof HTMLElement) {
            const tagNameFromProto = (x) => x.constructor.name.replace('HTML', '').replace('Element', '').toLowerCase();
            const o = document.createElement(tagNameFromProto(proto));
            (_e = context.enviro.root) === null || _e === void 0 ? void 0 : _e.appendChild(o);
            o.id = id + '';
            o.textContent = 'default';
            context.enviro.set(id, o).set(predicate);
        }
        else {
            const o = new proto.constructor();
            context.enviro.set(id, o).set(predicate);
        }
    }
}
exports["default"] = CreateAction;


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

/***/ "./app/src/actuator/actions/MultiEditAction.ts":
/*!*****************************************************!*\
  !*** ./app/src/actuator/actions/MultiEditAction.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class MultiEditAction {
    constructor(clause) {
        this.clause = clause;
    }
    run(context) {
        const condition = this.clause.theme;
        const consequence = this.clause.rheme;
        context.enviro.query(condition).forEach(m => {
            Object.keys(m).forEach(e => {
                consequence.describe(e).forEach(p => {
                    var _a;
                    (_a = context.enviro.get(m[e])) === null || _a === void 0 ? void 0 : _a.set(p, { negated: consequence.negated });
                });
            });
        });
    }
}
exports["default"] = MultiEditAction;


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
const MultiEditAction_1 = __importDefault(__webpack_require__(/*! ./MultiEditAction */ "./app/src/actuator/actions/MultiEditAction.ts"));
function getAction(clause, topLevel) {
    var _a, _b, _c;
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
    if (clause instanceof Imply_1.default && clause.entities.some(e => clause.ownersOf(e).length)) {
        return new SetAliasAction_1.default(clause);
    }
    if (clause instanceof Imply_1.default) {
        return new MultiEditAction_1.default(clause);
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
        clause.flatList().forEach(x => (0, getAction_1.getAction)(x, clause).run(context));
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
        this.context.config.startupCommands.forEach(c => this.execute(c));
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
    var _a, _b, _c, _d, _e;
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
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false, isSideEffecty = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
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
        var _a, _b, _c;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_c = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _c !== void 0 ? _c : this.isSideEffecty);
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
class BasicClause {
    constructor(predicate, args, negated = false, isSideEffecty = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
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
        var _a;
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _a !== void 0 ? _a : this.isSideEffecty);
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
    query(clause) {
        clause = clause.flatList()[0]; //TODO!!???
        if (!(clause instanceof BasicClause)) {
            return [];
        }
        if (clause.predicate.root !== this.predicate.root) {
            return [];
        }
        const map = clause.args
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
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const hashString_1 = __webpack_require__(/*! ../utils/hashString */ "./app/src/utils/hashString.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
class Imply {
    constructor(condition, consequence, negated = false, isSideEffecty = false) {
        this.condition = condition;
        this.consequence = consequence;
        this.negated = negated;
        this.isSideEffecty = isSideEffecty;
        this.theme = this.condition;
        this.rheme = this.consequence;
        this.hashCode = (0, hashString_1.hashString)(this.condition.toString() + this.consequence.toString() + this.negated);
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b, _c;
        return new Imply((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.condition.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.consequence.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_c = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _c !== void 0 ? _c : this.isSideEffecty);
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
        return Clause_1.emptyClause; ///TODO!!!!!!!!
    }
    toString() {
        const yes = `${this.condition.toString()} ---> ${this.consequence.toString()}`;
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
    constructor(lexemeTypes, _lexemes, syntaxMap, startupCommands, staticDescPrecedence) {
        this.lexemeTypes = lexemeTypes;
        this._lexemes = _lexemes;
        this.syntaxMap = syntaxMap;
        this.startupCommands = startupCommands;
        this.staticDescPrecedence = staticDescPrecedence;
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme({ type: 'grammar', root: syntax.name });
            this.syntaxMap[syntax.name] = syntax.syntax;
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
    }
    get syntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.staticDescPrecedence.concat(z);
        // return [
        //     'macro',
        //     'macropart',
        //     'taggedunion',
        //     'and sentence',
        //     'copula sentence',
        //     'complement',
        //     'subclause',
        //     'noun phrase']
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
const startupCommands_1 = __webpack_require__(/*! ./startupCommands */ "./app/src/config/startupCommands.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
function getConfig() {
    return new BasicConfig_1.BasicConfig(LexemeType_1.lexemeTypes, lexemes_1.lexemes, syntaxes_1.syntaxes, startupCommands_1.startupCommands, syntaxes_1.staticDescPrecedence);
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
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('adjective', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'grammar', 'nonsubconj', // and ...
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
        type: 'then' // filler word, what about partial parsing?
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

/***/ "./app/src/config/startupCommands.ts":
/*!*******************************************!*\
  !*** ./app/src/config/startupCommands.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startupCommands = void 0;
exports.startupCommands = [
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
'copula sentence', 'noun phrase', 'complement', 'subclause', 'and sentence', 'mverb sentence', 'iverb sentence');
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
        { type: ['then'], number: '1|0' }
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
    'iverb sentence': []
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
            results.push(ast);
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
function dependencies(a, syntaxes) {
    var _a;
    const x = ((_a = syntaxes[a]) !== null && _a !== void 0 ? _a : []).flatMap(m => m.type);
    return x;
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
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log(test() ? 'success' : 'fail', test.name);
            yield sleep(50); //75
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLGFBQWE7S0FDdEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLE1BQU0sQ0FBQywyQ0FBMkM7S0FDM0Q7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFFBQVE7S0FDakI7SUFFRDtRQUNJLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLFVBQVU7S0FDbkI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFB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QUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2xFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUMsMkJBQTJCO0lBQzlDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFMRCxnQ0FLQzs7Ozs7Ozs7Ozs7Ozs7QUNORCxTQUFnQixjQUFjLENBQW1CLEdBQUcsSUFBUyxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztBQUFwRix3Q0FBb0Y7Ozs7Ozs7Ozs7Ozs7O0FDQ3BGOzs7R0FHRztBQUNJLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQTNDLFlBQUksUUFBdUM7Ozs7Ozs7VUNMeEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9Db25jZXB0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9DcmVhdGVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0VkaXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL011bHRpRWRpdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvUmVsYXRpb25BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL1NldEFsaWFzQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9nZXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3R1YXRvci9BY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9wb2ludE91dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0VG9wTGV2ZWxPd25lck9mLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9CYXNpY0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N0YXJ0dXBDb21tYW5kcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvaWRUb051bS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy9pc1Zhci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaWQvZnVuY3Rpb25zL3RvQ29uc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pZC9mdW5jdGlvbnMvdG9WYXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvZHluYW1pY0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9nZXRMZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2dldFByb3RvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL2lzQ29uY2VwdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9pc011bHRpV29yZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9qb2luTXVsdGlXb3JkTGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2Z1bmN0aW9ucy9yZXNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL3N0ZHNwYWNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvZnVuY3Rpb25zL3N0ZW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9mdW5jdGlvbnMvdW5zcGFjZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY2VwdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gICAgXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MgJiYgdGhpcy5jbGF1c2UucHJlZGljYXRlKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFkaiA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUodGhpcy5jbGF1c2UuYXJnc1swXSlbMF0ucm9vdFxuXG4gICAgICAgICAgICBjb250ZXh0LmNvbmZpZy5zZXRMZXhlbWUoe1xuICAgICAgICAgICAgICAgIHJvb3Q6IGFkaixcbiAgICAgICAgICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJywgLy9UT0RPOiBiZSBhYmxlIHRvIGRlY2xhcmUgYW55IGtpbmQgb2YgbGV4ZW1lIGxpa2UgdGhpc1xuICAgICAgICAgICAgICAgIGNvbmNlcHRzOiBbdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3RdLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IGdldFByb3RvIH0gZnJvbSBcIi4uLy4uL2xleGVyL2Z1bmN0aW9ucy9nZXRQcm90b1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgbG9va3VwIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBpZCA9IGxvb2t1cCh0aGlzLmNsYXVzZT8uYXJncz8uWzBdIGFzIGFueSwgY29udGV4dCwgdGhpcy50b3BMZXZlbCkgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghcHJlZGljYXRlIHx8ICFpZCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5lbnZpcm8uZ2V0KGlkKT8uaXMocHJlZGljYXRlKSkgeyAgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90byA9IGdldFByb3RvKHByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgICAgICBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IE9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lLnJlcGxhY2UoJ0hUTUwnLCAnJykucmVwbGFjZSgnRWxlbWVudCcsICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICBvLmlkID0gaWQgKyAnJ1xuICAgICAgICAgICAgby50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uc2V0KGlkLCBvKS5zZXQocHJlZGljYXRlKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG8gPSBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoKVxuICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uc2V0KGlkLCBvKS5zZXQocHJlZGljYXRlKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0VG9wTGV2ZWxPd25lck9mXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MgJiYgZ2V0VG9wTGV2ZWwodGhpcy50b3BMZXZlbCkuaW5jbHVkZXModGhpcy5jbGF1c2UuYXJnc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yTm9uVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvclRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KGxvY2FsSWQsIHByZWRpY2F0ZSwgW10sIGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvck5vblRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG93bmVyTG9jYWxJZCA9IGdldFRvcExldmVsT3duZXJPZihsb2NhbElkLCB0aGlzLnRvcExldmVsKVxuXG4gICAgICAgIGlmICghb3duZXJMb2NhbElkKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KG93bmVyTG9jYWxJZCwgcHJlZGljYXRlLCB0aGlzLmdldFByb3BzKG93bmVyTG9jYWxJZCksIGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldChsb2NhbElkOiBJZCwgcHJlZGljYXRlOiBMZXhlbWUsIHByb3BzOiBMZXhlbWVbXSwgY29udGV4dDogQ29udGV4dCkge1xuICAgICAgICBjb25zdCBpZCA9IGxvb2t1cChsb2NhbElkLCBjb250ZXh0LCB0aGlzLnRvcExldmVsKSA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3Qgb2JqID0gY29udGV4dC5lbnZpcm8uZ2V0KGlkKSA/PyBjb250ZXh0LmVudmlyby5zZXQoaWQpXG4gICAgICAgIG9iai5zZXQocHJlZGljYXRlLCB7IHByb3BzLCBuZWdhdGVkOiB0aGlzLmNsYXVzZS5uZWdhdGVkIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy50b3BMZXZlbCwgdG9wTGV2ZWxFbnRpdHkpXG4gICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKGUpWzBdKSAvLyBBU1NVTUUgYXQgbGVhc3Qgb25lXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpRWRpdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLmNsYXVzZS50aGVtZVxuICAgICAgICBjb25zdCBjb25zZXF1ZW5jZSA9IHRoaXMuY2xhdXNlLnJoZW1lXG5cbiAgICAgICAgY29udGV4dC5lbnZpcm8ucXVlcnkoY29uZGl0aW9uKS5mb3JFYWNoKG0gPT4ge1xuXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhtKS5mb3JFYWNoKGUgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc2VxdWVuY2UuZGVzY3JpYmUoZSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uZ2V0KG1bZV0pPy5zZXQocCwgeyBuZWdhdGVkOiBjb25zZXF1ZW5jZS5uZWdhdGVkIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBsb29rdXAgfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpb25BY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgYXJncyA9ICh0aGlzLmNsYXVzZS5hcmdzID8/IFtdKVxuICAgICAgICAgICAgLm1hcChhID0+IGxvb2t1cChhLCBjb250ZXh0LCB0aGlzLnRvcExldmVsKSlcblxuICAgICAgICBpZiAoIXRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gY29udGV4dC5lbnZpcm8uZ2V0KGFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGNvbnRleHQuZW52aXJvLmdldChhcmdzWzFdKVxuXG4gICAgICAgIHJldHVybiBzdWJqZWN0Py5zZXQodGhpcy5jbGF1c2UucHJlZGljYXRlLCB7IGFyZ3M6IG9iamVjdCA/IFtvYmplY3RdIDogW10gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRQcm90byB9IGZyb20gXCIuLi8uLi9sZXhlci9mdW5jdGlvbnMvZ2V0UHJvdG9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldEFsaWFzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5jbGF1c2UudGhlbWVcbiAgICAgICAgY29uc3QgY29uc2VxdWVuY2UgPSB0aGlzLmNsYXVzZS5yaGVtZVxuXG4gICAgICAgIGNvbnN0IHRvcCA9IGdldFRvcExldmVsKGNvbmRpdGlvbilbMF0gLy9UT0RPICghQVNTVU1FISkgc2FtZSBhcyB0b3AgaW4gY29uY2x1c2lvblxuICAgICAgICBjb25zdCBhbGlhcyA9IGdldE93bmVyc2hpcENoYWluKGNvbmRpdGlvbiwgdG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGdldE93bmVyc2hpcENoYWluKGNvbnNlcXVlbmNlLCB0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IGNvbmNlcHROYW1lID0gYWxpYXMubWFwKHggPT4gY29uZGl0aW9uLmRlc2NyaWJlKHgpWzBdKSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lIG5hbWVcbiAgICAgICAgY29uc3QgcHJvcHNOYW1lcyA9IHByb3BzLm1hcCh4ID0+IGNvbnNlcXVlbmNlLmRlc2NyaWJlKHgpWzBdKSAvLyBzYW1lIC4uLlxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSBjb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcm90byA9IGdldFByb3RvKHByb3RvTmFtZSlcblxuICAgICAgICB3cmFwKGdldEluY3JlbWVudGFsSWQoKSwgcHJvdG8pLnNldChjb25jZXB0TmFtZVswXSwgeyBhbGlhc1BhdGg6IHByb3BzTmFtZXMgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCJcbmltcG9ydCB7IGlzQ29uY2VwdCB9IGZyb20gXCIuLi8uLi9sZXhlci9mdW5jdGlvbnMvaXNDb25jZXB0XCJcbmltcG9ydCBDb25jZXB0QWN0aW9uIGZyb20gXCIuL0NvbmNlcHRBY3Rpb25cIlxuaW1wb3J0IENyZWF0ZUFjdGlvbiBmcm9tIFwiLi9DcmVhdGVBY3Rpb25cIlxuaW1wb3J0IEVkaXRBY3Rpb24gZnJvbSBcIi4vRWRpdEFjdGlvblwiXG5pbXBvcnQgUmVsYXRpb25BY3Rpb24gZnJvbSBcIi4vUmVsYXRpb25BY3Rpb25cIlxuaW1wb3J0IEltcGx5IGZyb20gXCIuLi8uLi9jbGF1c2VzL0ltcGx5XCJcbmltcG9ydCBTZXRBbGlhc0FjdGlvbiBmcm9tIFwiLi9TZXRBbGlhc0FjdGlvblwiXG5pbXBvcnQgTXVsdGlFZGl0QWN0aW9uIGZyb20gXCIuL011bHRpRWRpdEFjdGlvblwiXG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9mdW5jdGlvbnMvZ2V0VG9wTGV2ZWxPd25lck9mXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9uKGNsYXVzZTogQ2xhdXNlLCB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICAvLyBUT0RPOiBwcmVwb3NpdGlvbnMsIGFuZCBiZSBiZXdhcmUgb2YgJ29mJyBcbiAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZT8udHlwZSA9PT0gJ2l2ZXJiJyB8fCBjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnbXZlcmInKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpb25BY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICAvLyB0byBjcmVhdGUgbmV3IGNvbmNlcHQgb3IgbmV3IGluc3RhbmNlIHRoZXJlb2ZcbiAgICBpZiAoY2xhdXNlLmFyZ3MgJiYgdG9wTGV2ZWwucmhlbWUuZGVzY3JpYmUoY2xhdXNlLmFyZ3NbMF0pLnNvbWUoeCA9PiBpc0NvbmNlcHQoeCkpKSB7IC8vIFxuICAgICAgICByZXR1cm4gbmV3IENvbmNlcHRBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZT8ucHJvdG8pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDcmVhdGVBY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkgJiYgY2xhdXNlLmVudGl0aWVzLnNvbWUoZSA9PiBjbGF1c2Uub3duZXJzT2YoZSkubGVuZ3RoKSkge1xuICAgICAgICByZXR1cm4gbmV3IFNldEFsaWFzQWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICBpZiAoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aUVkaXRBY3Rpb24oY2xhdXNlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRWRpdEFjdGlvbihjbGF1c2UsIHRvcExldmVsKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9va3VwKGlkOiBJZCwgY29udGV4dDogQ29udGV4dCwgdG9wTGV2ZWw6IENsYXVzZSkge1xuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LmVudmlyby5xdWVyeSh0b3BMZXZlbC50aGVtZSkgLy8gXG4gICAgcmV0dXJuIG1hcHM/LlswXT8uW2lkXSAvL1RPRE8gY291bGQgYmUgdW5kZWZpbmVkXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyBnZXRBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9ucy9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IHZvaWQge1xuXG4gICAgICAgIGNsYXVzZS5mbGF0TGlzdCgpLmZvckVhY2goeCA9PiBnZXRBY3Rpb24oeCwgY2xhdXNlKS5ydW4oY29udGV4dCkpXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgcG9pbnRPdXQgfSBmcm9tIFwiLi9wb2ludE91dFwiO1xuaW1wb3J0IHsgdW53cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnN0YXJ0dXBDb21tYW5kcy5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdCkuc2ltcGxlXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSlcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCB3cmFwcGVycyA9IGlkcy5tYXAoaWQgPT4gdGhpcy5jb250ZXh0LmVudmlyby5nZXQoaWQpKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmVudmlyby52YWx1ZXMuZm9yRWFjaCh3ID0+IHBvaW50T3V0KHcsIHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICB3cmFwcGVycy5mb3JFYWNoKHcgPT4gdyA/IHBvaW50T3V0KHcpIDogMClcblxuICAgICAgICAgICAgICAgIHJldHVybiB3cmFwcGVycy5mbGF0TWFwKG8gPT4gbyA/IHVud3JhcChvKSA6IFtdKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pLmZsYXQoKVxuICAgIH1cblxufSIsImltcG9ydCB7IEdldENvbnRleHRPcHRzLCBnZXROZXdDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QnJhaW5PcHRzIGV4dGVuZHMgR2V0Q29udGV4dE9wdHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbihvcHRzOiBHZXRCcmFpbk9wdHMpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKGdldE5ld0NvbnRleHQob3B0cykpXG59XG4iLCJpbXBvcnQgeyBDb25maWcsIGdldENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5pbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybywgR2V0RW52aXJvT3BzIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IHtcbiAgICByZWFkb25seSBlbnZpcm86IEVudmlyb1xuICAgIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dE9wdHMgZXh0ZW5kcyBHZXRFbnZpcm9PcHMgeyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdDb250ZXh0KG9wdHM6IEdldENvbnRleHRPcHRzKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW52aXJvOiBnZXRFbnZpcm8ob3B0cyksXG4gICAgICAgIGNvbmZpZzogZ2V0Q29uZmlnKClcbiAgICB9XG59IiwiaW1wb3J0IFdyYXBwZXIsIHsgdW53cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2ludE91dCh3cmFwcGVyOiBXcmFwcGVyLCBvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pIHtcblxuICAgIGNvbnN0IG9iamVjdCA9IHVud3JhcCh3cmFwcGVyKVxuXG4gICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIG9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgdG9WYXIgfSBmcm9tIFwiLi4vaWQvZnVuY3Rpb25zL3RvVmFyXCI7XG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvaXNWYXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgbWFrZUFsbFZhcnMgfSBmcm9tIFwiLi4vY2xhdXNlcy9mdW5jdGlvbnMvbWFrZUFsbFZhcnNcIjtcbmltcG9ydCB7IHByb3BhZ2F0ZVZhcnNPd25lZCB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9wcm9wYWdhdGVWYXJzT3duZWRcIjtcbmltcG9ydCB7IHJlc29sdmVBbmFwaG9yYSB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9yZXNvbHZlQW5hcGhvcmFcIjtcblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3QgaXMgdW5kZWZpbmVkIWApXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbm91biBwaHJhc2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnByZXBvc2l0aW9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZW1lbnRUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJqZWN0ICYmIGFzdD8ubGlua3MucHJlZGljYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdhbmQgc2VudGVuY2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJqZWN0ICYmIGFzdC5saW5rcy5vYmplY3QpIHtcbiAgICAgICAgcmVzdWx0ID0gbXZlcmJTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8uc3ViamVjdCAmJiAhYXN0LmxpbmtzLm9iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBpdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgYzEgPSBtYWtlQWxsVmFycyhyZXN1bHQpXG4gICAgICAgIGNvbnN0IGMyID0gcmVzb2x2ZUFuYXBob3JhKGMxKVxuICAgICAgICBjb25zdCBjMyA9IHByb3BhZ2F0ZVZhcnNPd25lZChjMilcbiAgICAgICAgcmV0dXJuIGMzXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJyR7YXN0LnR5cGV9JyFgKVxuXG59XG5cbmZ1bmN0aW9uIGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoY29wdWxhU2VudGVuY2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlPy5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5jb3B5KHsgbmVnYXRlOiAhIWNvcHVsYVNlbnRlbmNlPy5saW5rcz8ubmVnYXRpb24gfSlcbiAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLnNvbWUoZSA9PiBpc1ZhcihlKSkgPyAgLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgc3ViamVjdC5pbXBsaWVzKHByZWRpY2F0ZSkgOlxuICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdC5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShjb3B1bGFTdWJDbGF1c2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlPy5saW5rcz8ucHJlZGljYXRlXG5cbiAgICByZXR1cm4gdG9DbGF1c2UocHJlZGljYXRlLCB7IHN1YmplY3Q6IGFyZ3M/LnN1YmplY3QgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBuZXdJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBjb21wbGVtZW50Py5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZVxuXG4gICAgaWYgKCFwcmVwb3NpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHByZXBvc2l0aW9uIScpXG4gICAgfVxuXG4gICAgY29uc3Qgbm91blBocmFzZSA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5bJ25vdW4gcGhyYXNlJ11cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZCh0b0NsYXVzZShub3VuUGhyYXNlLCB7IHN1YmplY3Q6IG5ld0lkIH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBub3VuID0gbm91blBocmFzZS5saW5rcz8uc3ViamVjdFxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gbm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlPy5saW5rcz8uc3ViY2xhdXNlXG5cbiAgICBjb25zdCByZXMgPVxuICAgICAgICBhZGplY3RpdmVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmFuZChjb21wbGVtZW50cy5tYXAoYyA9PiB0b0NsYXVzZShjLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSkucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gdG9DbGF1c2Uoc3ViQ2xhdXNlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYW5kU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbGVmdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ubGVmdCwgYXJncylcbiAgICBjb25zdCByaWdodCA9IHRvQ2xhdXNlKGFzdD8ubGlua3M/LnJpZ2h0Py5saXN0Py5bMF0sIGFyZ3MpXG5cbiAgICBpZiAoYXN0LmxpbmtzPy5sZWZ0Py50eXBlID09PSAnY29wdWxhIHNlbnRlbmNlJykge1xuICAgICAgICByZXR1cm4gbGVmdC5hbmQocmlnaHQpLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIG12ZXJiU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBvYmpJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBvYmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmpJZCB9KVxuICAgIGNvbnN0IG12ZXJiID0gYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIW12ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gbXZlcmIgaW4gbXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKG12ZXJiLCBzdWJqSWQsIG9iaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGl2ZXJiU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmpJZCB9KVxuICAgIGNvbnN0IGl2ZXJiID0gYXN0LmxpbmtzPy5pdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIWl2ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gaXZlcmIgaW4gaXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKGl2ZXJiLCBzdWJqSWQpXG4gICAgICAgIC5jb3B5KHsgbmVnYXRlOiAhIWFzdC5saW5rcy5uZWdhdGlvbiB9KVxuXG4gICAgY29uc3QgcmVzID0gc3ViamVjdFxuICAgICAgICAuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyh0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpICsgdGhpcy5uZWdhdGVkKVxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gdW5pcSh0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcykpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHlcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB5ZXMgPyB0aGlzLm5lZ2F0ZWQgPyBgbm90JHt5ZXN9YCA6IHllcyA6ICcnXG4gICAgfVxuXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgYWJvdXQgPSAoaWQ6IElkKTogQ2xhdXNlID0+IHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICBkZXNjcmliZSA9IChpZDogSWQpOiBMZXhlbWVbXSA9PiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiB0aGlzLmNsYXVzZTEucmhlbWUuYW5kKHRoaXMuY2xhdXNlMi5yaGVtZSlcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW10ge1xuXG4gICAgICAgIGZ1bmN0aW9uIHVuaWZ5KHFlOiBJZCwgcmU6IElkLCByZXN1bHQ6IE1hcFtdKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGkgPSByZXN1bHQuZmluZEluZGV4KHggPT4gIXhbcWVdKVxuICAgICAgICAgICAgY29uc3QgbSA9IHJlc3VsdFtpXSA/PyB7fVxuICAgICAgICAgICAgbVtxZV0gPSByZVxuICAgICAgICAgICAgcmVzdWx0W2kgPiAtMSA/IGkgOiByZXN1bHQubGVuZ3RoXSA9IG1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgcmVzdWx0OiBNYXBbXSA9IFtdXG4gICAgICAgIGNvbnN0IGl0ID0gb3B0cz8uaXQgPz8gc29ydElkcyh1bml2ZXJzZS5lbnRpdGllcykuYXQoLTEpXG5cbiAgICAgICAgcXVlcnkuZW50aXRpZXMuZm9yRWFjaChxZSA9PiB7XG4gICAgICAgICAgICB1bml2ZXJzZS5lbnRpdGllcy5mb3JFYWNoKHJlID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJkID0gdW5pdmVyc2UuYWJvdXQocmUpLmZsYXRMaXN0KClcbiAgICAgICAgICAgICAgICBjb25zdCBxZCA9IHF1ZXJ5LmFib3V0KHFlKS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAgICAgY29uc3QgcmQyID0gcmQubWFwKHggPT4geC5jb3B5KHsgbWFwOiB7IFtyZV06IHFlIH0gfSkpIC8vIHN1YnNpdHV0ZSByZSBieSBxZSBpbiByZWFsIGRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcmQyID0gIHJkXG5cbiAgICAgICAgICAgICAgICAvLyBjb21wYXJlIGVhY2ggcmQyIHRvIGVhY2ggcWQsIGlmIHByZWRpY2F0ZSBpcyBzYW1lIHJlcGxhY2UgciBhcmdzIHdpdGggcSBhcmdzXG4gICAgICAgICAgICAgICAgcmQyLmZvckVhY2goKHIsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcWQuZm9yRWFjaChxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyLnByZWRpY2F0ZSA9PT0gcS5wcmVkaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtOiBNYXAgPSAoci5hcmdzID8/IFtdKS5tYXAoKGEsIGkpID0+ICh7IFthXTogcS5hcmdzPy5baV0gPz8gYSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZDJbaV0gPSByLmNvcHkoeyBtYXA6IG0gfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyLnRvU3RyaW5nKCksICdtYXkgYmUgJywgcS50b1N0cmluZygpLCAnciBiZWNvbWVzJywgcmQyW2ldLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIGNvbnN0IHFoYXNoZXMgPSBxZC5tYXAoeCA9PiB4Lmhhc2hDb2RlKVxuICAgICAgICAgICAgICAgIGNvbnN0IHIyaGFzaGVzID0gcmQyLm1hcCh4ID0+IHguaGFzaENvZGUpXG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVW5pZnkgb3Igbm90PycsICdxZD0nLCBxZC5tYXAoeD0+eC50b1N0cmluZygpKSwgJ3JkMj0nLCByZDIubWFwKHg9PngudG9TdHJpbmcoKSkpXG5cbiAgICAgICAgICAgICAgICBpZiAocWhhc2hlcy5ldmVyeSh4ID0+IHIyaGFzaGVzLmluY2x1ZGVzKHgpKSkgeyAvLyBxZSB1bmlmaWVzIHdpdGggcmUhXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHFlLCAnaXMnLCByZSwgJyEnKVxuICAgICAgICAgICAgICAgICAgICB1bmlmeShxZSwgcmUsIHJlc3VsdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXQgJiYgcWQuc29tZSh4ID0+IHgucHJlZGljYXRlPy50eXBlID09PSAncHJvbm91bicpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaWZ5KHFlLCBpdCwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgZ2V0IHNpbXBsZSgpIHtcblxuICAgICAgICBjb25zdCBjMSA9IHRoaXMuY2xhdXNlMS5zaW1wbGVcbiAgICAgICAgY29uc3QgYzIgPSB0aGlzLmNsYXVzZTIuc2ltcGxlXG5cbiAgICAgICAgaWYgKGMyLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMxXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYzEuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzJcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoeyBjbGF1c2UxOiBjMSwgY2xhdXNlMjogYzIgfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIjtcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKFxuICAgICAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHlcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSA/IHRoaXMgOiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGNsYXVzZSA9IGNsYXVzZS5mbGF0TGlzdCgpWzBdIC8vVE9ETyEhPz8/XG5cbiAgICAgICAgaWYgKCEoY2xhdXNlIGluc3RhbmNlb2YgQmFzaWNDbGF1c2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGF1c2UucHJlZGljYXRlLnJvb3QgIT09IHRoaXMucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gY2xhdXNlLmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHk/OiBib29sZWFuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2Vcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBhYm91dCA9IChpZDogSWQpOiBDbGF1c2UgPT4gdGhpc1xuICAgIG93bmVkQnkgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBkZXNjcmliZSA9IChpZDogSWQpOiBMZXhlbWVbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXMuY29uZGl0aW9uXG4gICAgcmVhZG9ubHkgcmhlbWUgPSB0aGlzLmNvbnNlcXVlbmNlXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCkgKyB0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY29uc2VxdWVuY2UuY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHlcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcykpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcHkoe1xuICAgICAgICAgICAgY2xhdXNlMTogdGhpcy5jb25kaXRpb24uc2ltcGxlLFxuICAgICAgICAgICAgY2xhdXNlMjogdGhpcy5jb25zZXF1ZW5jZS5zaW1wbGVcbiAgICAgICAgfSlcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9pZC9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCwgdGw6IENsYXVzZSk6IElkIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG93bmVycyA9IHRsLm93bmVyc09mKGlkKVxuXG4gICAgY29uc3QgbWF5YmUgPSBvd25lcnNcbiAgICAgICAgLmZpbHRlcihvID0+IGdldFRvcExldmVsKHRsKS5pbmNsdWRlcyhvKSkuYXQoMClcblxuICAgIGlmICghbWF5YmUgJiYgb3duZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIGdldFRvcExldmVsT3duZXJPZihvd25lcnNbMF0sIHRsKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBtYXliZVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgaXNWYXIgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL2lzVmFyXCJcbmltcG9ydCB7IHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vaWQvZnVuY3Rpb25zL3RvQ29uc3RcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IHRvVmFyIH0gZnJvbSBcIi4uLy4uL2lkL2Z1bmN0aW9ucy90b1ZhclwiXG5pbXBvcnQgeyBpc1ZhciB9IGZyb20gXCIuLi8uLi9pZC9mdW5jdGlvbnMvaXNWYXJcIlxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGFnYXRlVmFyc093bmVkKGNsYXVzZTogQ2xhdXNlKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLmZpbHRlcihlID0+IGlzVmFyKGUpKVxuICAgICAgICAuZmxhdE1hcChlID0+IGNsYXVzZS5vd25lZEJ5KGUpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW2VdOiB0b1ZhcihlKSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gfSlcblxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQW5hcGhvcmEoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbSA9IGNsYXVzZS50aGVtZS5xdWVyeShjbGF1c2UucmhlbWUpWzBdXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtID8/IHt9IH0pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRvcExldmVsKGNsYXVzZTogQ2xhdXNlKSB7XG4gICAgcmV0dXJuIGNsYXVzZVxuICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IHgsIG93bmVyczogY2xhdXNlLm93bmVyc09mKHgpIH0pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5vd25lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAubWFwKHggPT4geC54KVxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY2xhc3MgQmFzaWNDb25maWcgaW1wbGVtZW50cyBDb25maWcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW10sXG4gICAgICAgIHByb3RlY3RlZCBfbGV4ZW1lczogTGV4ZW1lW10sXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheE1hcDogU3ludGF4TWFwLFxuICAgICAgICByZWFkb25seSBzdGFydHVwQ29tbWFuZHM6IHN0cmluZ1tdLFxuICAgICAgICByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdKSB7XG4gICAgfVxuXG4gICAgZ2V0IHN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcblxuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5pbmNsdWRlcyhlKSlcbiAgICAgICAgY29uc3QgeiA9IHkuc29ydCgoYSwgYikgPT4gbWF4UHJlY2VkZW5jZShiLCBhLCB0aGlzLnN5bnRheE1hcCkpXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuXG4gICAgICAgIC8vIHJldHVybiBbXG4gICAgICAgIC8vICAgICAnbWFjcm8nLFxuICAgICAgICAvLyAgICAgJ21hY3JvcGFydCcsXG4gICAgICAgIC8vICAgICAndGFnZ2VkdW5pb24nLFxuICAgICAgICAvLyAgICAgJ2FuZCBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29wdWxhIHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdjb21wbGVtZW50JyxcbiAgICAgICAgLy8gICAgICdzdWJjbGF1c2UnLFxuICAgICAgICAvLyAgICAgJ25vdW4gcGhyYXNlJ11cbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IEFzdE5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgICAgIHRoaXMuX2xleGVtZXMgPSB0aGlzLl9sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaChsZXhlbWUpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBCYXNpY0NvbmZpZyB9IGZyb20gXCIuL0Jhc2ljQ29uZmlnXCJcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUsIGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBzdGFydHVwQ29tbWFuZHMgfSBmcm9tIFwiLi9zdGFydHVwQ29tbWFuZHNcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgc3RhdGljRGVzY1ByZWNlZGVuY2UsIHN5bnRheGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lW11cbiAgICByZWFkb25seSBzdGFydHVwQ29tbWFuZHM6IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxuICAgIGdldFN5bnRheChuYW1lOiBBc3RUeXBlKTogU3ludGF4XG4gICAgc2V0U3ludGF4KG1hY3JvOiBBc3ROb2RlKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpOiBDb25maWcge1xuXG4gICAgcmV0dXJuIG5ldyBCYXNpY0NvbmZpZyhcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBzdGFydHVwQ29tbWFuZHMsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqZWN0aXZlJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICd0aGVuJyxcbiAgJ3JlbHByb24nLFxuICAnbmVnYXRpb24nLFxuICAnbm91bicsXG4gICdwcmVwb3NpdGlvbicsXG4gICdzdWJjb25qJyxcbiAgJ2dyYW1tYXInLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bicsXG4gICdhbnknXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IGNvbnN0aXR1ZW50VHlwZXMgfSBmcm9tIFwiLi9zeW50YXhlc1wiO1xuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdoYXZlJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgaXJyZWd1bGFyRm9ybXM6IFsnaGF2ZScsICdoYXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEJ1dHRvbkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2RpdicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcHJvdG86ICdIVE1MRGl2RWxlbWVudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZWxlbWVudCcsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcHJvdG86ICdIVE1MRWxlbWVudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbGlzdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcHJvdG86ICdBcnJheSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2F0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlJyxcbiAgICAgICAgdHlwZTogJ2NvcHVsYScsXG4gICAgICAgIGlycmVndWxhckZvcm1zOiBbJ2lzJywgJ2FyZSddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIGlycmVndWxhckZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmQsIHdoYXQgYWJvdXQgcGFydGlhbCBwYXJzaW5nP1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2l0JyxcbiAgICAgICAgdHlwZTogJ3Byb25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGNvbmNlcHRzOiBbJ2NvbmNlcHQnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvYmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH1cbl1cblxuLyoqXG4gKiBHcmFtbWFyXG4gKi9cbmNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KGxleGVtZVR5cGVzIGFzIGFueSkuZm9yRWFjaChnID0+IHtcbiAgICBsZXhlbWVzLnB1c2goe1xuICAgICAgICByb290OiBnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9KVxufSkiLCJleHBvcnQgY29uc3Qgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSA9IFtcblxuICAvLyBncmFtbWFyXG4gICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW4gcGhyYXNlJyxcblxuICBgY29wdWxhIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuIHBocmFzZWAsXG5cbiAgYG5vdW4gcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIG12ZXJiIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBub3VuIHBocmFzZScsXG4gICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlJyxcblxuICBgYW5kIHNlbnRlbmNlIGlzIGxlZnQgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlIFxuICAgICAgICB0aGVuIG5vbnN1YmNvbmpcbiAgICAgICAgdGhlbiBvbmUgb3IgbW9yZSByaWdodCBhbmQgc2VudGVuY2Ugb3IgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlYCxcblxuICBgbXZlcmIgc2VudGVuY2UgaXMgc3ViamVjdCBub3VuIHBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gbXZlcmJcblx0XHR0aGVuIG9iamVjdCBub3VuIHBocmFzZWAsIC8vIFRPRE8gY29tcGxlbWVudHNcblxuICBgaXZlcmIgc2VudGVuY2UgaXMgc3ViamVjdCBub3VuIHBocmFzZSBcblx0XHR0aGVuIG9wdGlvbmFsIGh2ZXJiXG5cdFx0dGhlbiBvcHRpb25hbCBuZWdhdGlvblxuXHRcdHRoZW4gaXZlcmJgLCAvLyBUT0RPIGNvbXBsZW1lbnRzXG5cbiAgLy8gZG9tYWluXG4gICdjb2xvciBpcyBhIGNvbmNlcHQnLFxuICAncmVkIGFuZCBibHVlIGFuZCBibGFjayBhbmQgZ3JlZW4gYXJlIGNvbG9ycycsXG4gICdjb2xvciBvZiBhbnkgZWxlbWVudCBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGl0JyxcbiAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBpdCcsXG5dIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiO1xuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnY29wdWxhIHNlbnRlbmNlJyxcbiAgICAnbm91biBwaHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnc3ViY2xhdXNlJyxcbiAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAnbXZlcmIgc2VudGVuY2UnLFxuICAgICdpdmVyYiBzZW50ZW5jZScsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gW1xuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbl1cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnbm91bicgYXMgUm9sZSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWyd0aGVuJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnc3ViY2xhdXNlJzogW1xuXG4gICAgXSxcblxuICAgICdub3VuIHBocmFzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcblxuICAgIF0sXG5cbiAgICAnY29wdWxhIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdhbmQgc2VudGVuY2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ212ZXJiIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdpdmVyYiBzZW50ZW5jZSc6IFtcblxuICAgIF1cbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBXcmFwcGVyLCB7IHdyYXAgfSBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUVudmlybyBpbXBsZW1lbnRzIEVudmlybyB7XG5cbiAgICBwcm90ZWN0ZWQgbGFzdFJlZmVyZW5jZWQ/OiBJZFxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0Pzogb2JqZWN0KTogV3JhcHBlciB7XG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBwbGFjZWhvbGRlcj8uY29weSh7IG9iamVjdDogb2JqZWN0IH0pID8/IHdyYXAoaWQsIG9iamVjdClcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy52YWx1ZXNcbiAgICAgICAgICAgIC5tYXAodyA9PiB3LmNsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHVuaXZlcnNlLnF1ZXJ5KHF1ZXJ5LCB7IGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBXcmFwcGVyLCB7IENvcHlPcHRzLCBTZXRPcHMsIHVud3JhcCB9IGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4uL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuLi9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG9iamVjdDogYW55LFxuICAgICAgICByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHJlYWRvbmx5IGlzUGxhY2Vob2xkZXI6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IGFsaWFzZXM6IHsgW2FsaWFzOiBzdHJpbmddOiB7IHBhdGg6IHN0cmluZ1tdLCBsZXhlbWU6IExleGVtZSB9IH0gPSBvYmplY3QuYWxpYXNlcyA/PyB7fSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlUHJlZGljYXRlczogTGV4ZW1lW10gPSBbXSkge1xuXG4gICAgICAgIG9iamVjdC5hbGlhc2VzID0gYWxpYXNlc1xuICAgICAgICBvYmplY3Quc2ltcGxlUHJlZGljYXRlcyA9IHNpbXBsZVByZWRpY2F0ZXNcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpOiBhbnkge1xuXG4gICAgICAgIGlmIChvcHRzPy5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHByZWRpY2F0ZSwgb3B0cy5hcmdzKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdHM/LmFsaWFzUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0QWxpYXMocHJlZGljYXRlLCBvcHRzLmFsaWFzUGF0aClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3BzID0gb3B0cz8ucHJvcHMgPz8gW11cblxuICAgICAgICBpZiAodGhpcy5pc1BsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGUpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID4gMSkgeyAvLyBhc3N1bWUgPiAxIHByb3BzIGFyZSBhIHBhdGhcbiAgICAgICAgICAgIHRoaXMuc2V0TXVsdGlQcm9wKHByb3BzLCBwcmVkaWNhdGUsIG9wdHMpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbmdsZVByb3AocHJlZGljYXRlLCBwcm9wc1swXSwgb3B0cylcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0WmVyb1Byb3BzKHByZWRpY2F0ZSwgb3B0cylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldE11bHRpUHJvcChwYXRoOiBMZXhlbWVbXSwgdmFsdWU6IExleGVtZSwgb3B0cz86IFNldE9wcykgeyAvLyBhc3N1bWUgbm90IGNvbmNlcHRcblxuICAgICAgICBpZiAob3B0cz8ubmVnYXRlZCAmJiB0aGlzLmlzKHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aC5tYXAoeCA9PiB4LnJvb3QpLCAnJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgubWFwKHggPT4geC5yb290KSwgdmFsdWUucm9vdClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3ByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMCkgPz8gJyddPy5wYXRoXG5cbiAgICAgICAgcmV0dXJuIHBhdGggP1xuICAgICAgICAgICAgdGhpcy5nZXROZXN0ZWQocGF0aCkgPT09IHByZWRpY2F0ZS5yb290IDpcbiAgICAgICAgICAgIHRoaXMuaXNTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzU2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbXBsZVByZWRpY2F0ZXMubWFwKHggPT4geC5yb290KS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0QWxpYXMoY29uY2VwdE5hbWU6IExleGVtZSwgcHJvcFBhdGg6IExleGVtZVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWxpYXNlc1tjb25jZXB0TmFtZS5yb290XSA9IHsgcGF0aDogcHJvcFBhdGgubWFwKHggPT4geC5yb290KSwgbGV4ZW1lOiBjb25jZXB0TmFtZSB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHtcbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHRoaXMuYWxpYXNlc1t2ZXJiLnJvb3RdPy5wYXRoXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBjb25jZXB0Py5bMF0gPz8gdmVyYi5yb290XG4gICAgICAgIHJldHVybiB0aGlzPy5vYmplY3RbbWV0aG9kTmFtZV0oLi4uYXJncy5tYXAoeCA9PiB1bndyYXAoeCkpKVxuICAgIH1cblxuICAgIGNsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICAgICAgY29uc3QgcHJlZHM6IExleGVtZVtdID1cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuYWxpYXNlcylcbiAgICAgICAgICAgICAgICAubWFwKGsgPT4gdGhpcy5nZXROZXN0ZWQodGhpcy5hbGlhc2VzW2tdLnBhdGgpKVxuICAgICAgICAgICAgICAgIC5tYXAoKHgpOiBMZXhlbWUgPT4gKHsgcm9vdDogeCwgdHlwZTogJ2FkamVjdGl2ZScgfSkpXG4gICAgICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnNpbXBsZVByZWRpY2F0ZXMpXG5cbiAgICAgICAgbGV0IHJlcyA9IHByZWRzXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeCwgdGhpcy5pZCkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHJlcy5hbmQodGhpcy5leHRyYUluZm8ocXVlcnkpKVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGV4dHJhSW5mbyhxdWVyeT86IENsYXVzZSkge1xuXG4gICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgY29uc3Qgb2MgPSBnZXRPd25lcnNoaXBDaGFpbihxdWVyeSwgZ2V0VG9wTGV2ZWwocXVlcnkpWzBdKVxuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG9jLm1hcCh4ID0+IHF1ZXJ5LmRlc2NyaWJlKHgpPy5bMF0/LnJvb3QpLnNsaWNlKDEpXG4gICAgICAgICAgICBjb25zdCBuZXN0ZWQgPSB0aGlzLmdldE5lc3RlZCh0aGlzLmFsaWFzZXM/LltwYXRoPy5bMF1dPy5wYXRoID8/IHBhdGgpXG5cbiAgICAgICAgICAgIGlmIChuZXN0ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBxdWVyeS5jb3B5KHsgbWFwOiB7IFtvY1swXV06IHRoaXMuaWQgfSB9KVxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2luZ2xlUHJvcCh2YWx1ZTogTGV4ZW1lLCBwcm9wOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3Byb3Aucm9vdF0/LnBhdGggPz8gW3Byb3Aucm9vdF1cblxuICAgICAgICBpZiAoIW9wdHM/Lm5lZ2F0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsIHZhbHVlLnJvb3QpXG4gICAgICAgIH0gZWxzZSBpZiAob3B0cz8ubmVnYXRlZCAmJiB0aGlzLmlzKHZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aCwgJycpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRaZXJvUHJvcHMocHJlZGljYXRlOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3ByZWRpY2F0ZT8uY29uY2VwdHM/LlswXSBhcyBhbnldPy5wYXRoXG5cbiAgICAgICAgaWYgKHBhdGgpIHtcblxuICAgICAgICAgICAgaWYgKCFvcHRzPy5uZWdhdGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aCwgcHJlZGljYXRlLnJvb3QpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdHM/Lm5lZ2F0ZWQgJiYgdGhpcy5pcyhwcmVkaWNhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aCwgJycpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5vYmplY3RbcHJlZGljYXRlLnJvb3RdID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3ByZWRpY2F0ZS5yb290XSA9ICFvcHRzPy5uZWdhdGVkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlOiBMZXhlbWUpIHtcbiAgICAgICAgdGhpcy5zaW1wbGVQcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKSAvL1RPRE86IGNoZWNrIGR1cGxpY2F0ZXMhXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldE5lc3RlZChwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbcGF0aFswXV0gPSB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dXG5cbiAgICAgICAgcGF0aC5zbGljZSgxLCAtMikuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgeFtwYXRoLmF0KC0xKSBhcyBzdHJpbmddID0gdmFsdWVcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdKSB7XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lXG5cbiAgICAgICAgcGF0aC5zbGljZSgxKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHg/LltwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB4XG5cbiAgICB9XG5cbiAgICB0eXBlT2Yod29yZDogc3RyaW5nKTogTGV4ZW1lVHlwZSB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1t3b3JkXT8ucGF0aCA/PyBbd29yZF1cbiAgICAgICAgY29uc3QgdyA9IHRoaXMuZ2V0TmVzdGVkKHBhdGgpXG5cbiAgICAgICAgaWYgKHR5cGVvZiB3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gKHcubGVuZ3RoID8/IDApID4gMCA/ICdtdmVyYicgOiAnaXZlcmInXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJ25vdW4nXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBXcmFwcGVyIHtcblxuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IEJhc2VXcmFwcGVyKFxuICAgICAgICAgICAgb3B0cz8ub2JqZWN0ID8/IHRoaXMuY29weVdyYXBwZWQoKSxcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICBvcHRzPy5vYmplY3QgPyBmYWxzZSA6IHRoaXMuaXNQbGFjZWhvbGRlcixcbiAgICAgICAgKVxuXG4gICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5mb3JFYWNoKHggPT4gY29weS5zZXQoeCkpXG4gICAgICAgIHJldHVybiBjb3B5XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNvcHlXcmFwcGVkKCkge1xuXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkID0gdGhpcy5vYmplY3QuY2xvbmVOb2RlKCkgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gdGhpcy5vYmplY3QuaW5uZXJIVE1MXG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5vYmplY3QgfVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBvYmplY3QpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIHJlYWRvbmx5IHZhbHVlczogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IEJhc2VXcmFwcGVyIGZyb20gXCIuL0Jhc2VXcmFwcGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgaWQ6IElkXG4gICAgY2xhdXNlKGNsYXVzZT86IENsYXVzZSk6IENsYXVzZVxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueVxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhblxuICAgIHR5cGVPZih3b3JkOiBzdHJpbmcpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBXcmFwcGVyXG5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXRPcHMge1xuICAgIHByb3BzPzogTGV4ZW1lW11cbiAgICBuZWdhdGVkPzogYm9vbGVhblxuICAgIGFyZ3M/OiBXcmFwcGVyW11cbiAgICBhbGlhc1BhdGg/OiBMZXhlbWVbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBvYmplY3Q/OiBvYmplY3Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoaWQ6IElkLCBvPzogT2JqZWN0KTogV3JhcHBlciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlV3JhcHBlcihvID8/IHt9LCBpZCwgbyA9PT0gdW5kZWZpbmVkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwKHdyYXBwZXI6IFdyYXBwZXIpOiBvYmplY3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAod3JhcHBlciBhcyBhbnkpLm9iamVjdFxufSIsImltcG9ydCB7IHRvVmFyIH0gZnJvbSBcIi4vdG9WYXJcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0SW5jcmVtZW50YWxJZE9wdHMge1xuICAgIGFzVmFyOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmNyZW1lbnRhbElkKG9wdHM/OiBHZXRJbmNyZW1lbnRhbElkT3B0cyk6IElkIHtcbiAgICBjb25zdCBuZXdJZCA9IGBpZCR7aWRHZW5lcmF0b3IubmV4dCgpLnZhbHVlfWA7XG4gICAgcmV0dXJuIG9wdHM/LmFzVmFyID8gdG9WYXIobmV3SWQpIDogbmV3SWQ7XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SW5jcmVtZW50YWxJZEdlbmVyYXRvcigpO1xuXG5mdW5jdGlvbiogZ2V0SW5jcmVtZW50YWxJZEdlbmVyYXRvcigpIHtcbiAgICBsZXQgeCA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrO1xuICAgICAgICB5aWVsZCB4O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpZFRvTnVtKGlkOiBJZCkge1xuICAgIHJldHVybiBwYXJzZUludChpZC50b1N0cmluZygpLnJlcGxhY2VBbGwoL1xcRCsvZywgJycpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFyKGU6IElkKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIoZSkpICYmIChlLnRvU3RyaW5nKClbMF0gPT09IGUudG9TdHJpbmcoKVswXS50b1VwcGVyQ2FzZSgpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5pbXBvcnQgeyBpZFRvTnVtIH0gZnJvbSBcIi4vaWRUb051bVwiO1xuXG4vKipcbiAqIFNvcnQgaWRzIGluIGFzY2VuZGluZyBvcmRlci5cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc29ydElkcyhpZHM6IElkW10pIHtcbiAgICByZXR1cm4gaWRzLnNvcnQoKGEsIGIpID0+IGlkVG9OdW0oYSkgLSBpZFRvTnVtKGIpKTtcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL0lkXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcihpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9VcHBlckNhc2UoKTtcbn1cbiIsImltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4vdGVzdHMvYXV0b3Rlc3RlclwiXG5cblxuKGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBhdXRvdGVzdGVyKClcbiAgICBtYWluKClcbn0pKCkiLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9nZXRMZXhlbWVzXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IHJlc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcmVzcGFjZVwiO1xuaW1wb3J0IHsgc3Rkc3BhY2UgfSBmcm9tIFwiLi9mdW5jdGlvbnMvc3Rkc3BhY2VcIjtcbmltcG9ydCB7IGpvaW5NdWx0aVdvcmRMZXhlbWVzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2pvaW5NdWx0aVdvcmRMZXhlbWVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkgeyAvLyBUT0RPOiBtYWtlIGNhc2UgaW5zZW5zaXRpdmVcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzdGRzcGFjZShzb3VyY2VDb2RlKSwgY29udGV4dC5jb25maWcubGV4ZW1lcylcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gcmVzcGFjZShzKSlcblxuICAgICAgICB0aGlzLnRva2VucyA9IHdvcmRzLmZsYXRNYXAodyA9PiBnZXRMZXhlbWVzKHcsIGNvbnRleHQsIHdvcmRzKSlcbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vYnJhaW4vQ29udGV4dFwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUobGV4ZW1lOiBMZXhlbWUpOiBzdHJpbmdbXSB7XG5cbiAgICBjb25zdCB3b3JkID0gbGV4ZW1lLnRva2VuID8/IGxleGVtZS5yb290XG5cbiAgICBpZiAobGV4ZW1lLmlycmVndWxhckZvcm1zKSB7XG4gICAgICAgIHJldHVybiBbd29yZCwgLi4ubGV4ZW1lLmlycmVndWxhckZvcm1zXVxuICAgIH1cblxuICAgIHJldHVybiBbd29yZCwgYCR7d29yZH1zYF1cblxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuaW1wb3J0IHsgc3RlbSB9IGZyb20gXCIuL3N0ZW1cIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gZHluYW1pY0xleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cbiAgICBjb25zdCBzdGVtbWVkV29yZCA9IHN0ZW0oeyByb290OiB3b3JkLCB0eXBlOiAnYW55JyB9KTtcblxuICAgIGNvbnN0IHR5cGVzID0gd29yZHNcbiAgICAgICAgLm1hcCh3ID0+IGNsYXVzZU9mKHsgcm9vdDogdywgdHlwZTogJ2FueScgfSwgJ1gnKSlcbiAgICAgICAgLmZsYXRNYXAoYyA9PiBjb250ZXh0LmVudmlyby5xdWVyeShjKSlcbiAgICAgICAgLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAubWFwKGlkID0+IGNvbnRleHQuZW52aXJvLmdldChpZCkpXG4gICAgICAgIC5tYXAoeCA9PiB4Py50eXBlT2Yoc3RlbW1lZFdvcmQpKVxuICAgICAgICAuZmlsdGVyKHggPT4geCAhPT0gdW5kZWZpbmVkKTtcblxuICAgIHJldHVybiB7IHJvb3Q6IHN0ZW1tZWRXb3JkLCB0eXBlOiB0eXBlc1swXSA/PyAnbm91bicgfTtcbn1cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBkeW5hbWljTGV4ZW1lIH0gZnJvbSBcIi4vZHluYW1pY0xleGVtZVwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0LCB3b3Jkczogc3RyaW5nW10pOiBMZXhlbWVbXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZSA9IGNvbnRleHRcbiAgICAgICAgLmNvbmZpZ1xuICAgICAgICAubGV4ZW1lc1xuICAgICAgICAuZmlsdGVyKHggPT4gY29uanVnYXRlKHgpLmluY2x1ZGVzKHdvcmQpKVxuICAgICAgICAuYXQoMCkgPz8gZHluYW1pY0xleGVtZSh3b3JkLCBjb250ZXh0LCB3b3JkcylcblxuICAgIGNvbnN0IGxleGVtZTI6IExleGVtZSA9IHsgLi4ubGV4ZW1lLCB0b2tlbjogd29yZCB9XG5cbiAgICByZXR1cm4gbGV4ZW1lMi5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleGVtZTIuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgY29udGV4dCwgd29yZHMpKSA6XG4gICAgICAgIFtsZXhlbWUyXVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL0xleGVtZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdG8obGV4ZW1lOiBMZXhlbWUpOiBPYmplY3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSk/LltsZXhlbWUucHJvdG8gYXMgYW55XT8ucHJvdG90eXBlO1xufVxuIiwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNlcHQobGV4ZW1lPzogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZT8uY29uY2VwdHM/LmluY2x1ZGVzKCdjb25jZXB0Jyk7XG59XG4iLCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9MZXhlbWVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTXVsdGlXb3JkKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZS5yb290LmluY2x1ZGVzKCcgJyk7XG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBpc011bHRpV29yZCB9IGZyb20gXCIuL2lzTXVsdGlXb3JkXCI7XG5pbXBvcnQgeyBzdGRzcGFjZSB9IGZyb20gXCIuL3N0ZHNwYWNlXCI7XG5pbXBvcnQgeyB1bnNwYWNlIH0gZnJvbSBcIi4vdW5zcGFjZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gam9pbk11bHRpV29yZExleGVtZXMoc291cmNlQ29kZTogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWVbXSkge1xuXG4gICAgbGV0IG5ld1NvdXJjZSA9IHNvdXJjZUNvZGU7XG5cbiAgICBsZXhlbWVzXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc011bHRpV29yZCh4KSlcbiAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsZXhlbWUgPSBzdGRzcGFjZSh4LnJvb3QpO1xuICAgICAgICAgICAgbmV3U291cmNlID0gbmV3U291cmNlLnJlcGxhY2VBbGwobGV4ZW1lLCB1bnNwYWNlKGxleGVtZSkpO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBuZXdTb3VyY2U7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiByZXNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCctJywgJyAnKTtcbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJyk7XG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vTGV4ZW1lXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHN0ZW0obGV4ZW1lOiBMZXhlbWUpOiBzdHJpbmcge1xuXG4gICAgY29uc3Qgd29yZCA9IGxleGVtZS50b2tlbiA/PyBsZXhlbWUucm9vdDtcblxuICAgIGlmIChsZXhlbWUuaXJyZWd1bGFyRm9ybXMpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgaWYgKHdvcmQuZW5kc1dpdGgoJ3MnKSkge1xuICAgICAgICByZXR1cm4gd29yZC5zbGljZSgwLCAtMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG5cbn1cbiIsIlxuZXhwb3J0IGZ1bmN0aW9uIHVuc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJyAnLCAnLScpO1xufVxuIiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWluKCkge1xuXG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIGJyYWluOiBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5oaWRkZW4gPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID8gdGV4dGFyZWEuZm9jdXMoKSA6IDBcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICB0ZXh0YXJlYS5zdHlsZS53aWR0aCA9ICc1MHZ3J1xuICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9ICcxZW0nXG4gICAgdGV4dGFyZWEuaGlkZGVuID0gdHJ1ZVxuICAgIHRleHRhcmVhLnN0eWxlLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICB0ZXh0YXJlYS5zdHlsZS50b3AgPSAnMCdcbiAgICB0ZXh0YXJlYS5zdHlsZS56SW5kZXggPSAnMTAwMCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSk7XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxufSIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2JyYWluL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29udGV4dCkpIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb250ZXh0LmNvbmZpZy5zeW50YXhMaXN0KVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChhc3QpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5jb25maWcuZ2V0U3ludGF4KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNMZWFmKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG1lbWJlcnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbnRleHQuY29uZmlnLmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZSwgbS5yb2xlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNvbmZpZy5sZXhlbWVUeXBlcy5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4uL0tvb2xQYXJzZXJcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuL0FzdE5vZGVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IEtvb2xQYXJzZXIoc291cmNlQ29kZSwgY29udGV4dClcbn1cbiIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgU3ludGF4LCBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKTogeyBuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4IH0ge1xuXG4gICAgY29uc3QgbWFjcm9wYXJ0cyA9IG1hY3JvPy5saW5rcz8ubWFjcm9wYXJ0Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ludGF4ID0gbWFjcm9wYXJ0cy5tYXAobSA9PiBtYWNyb1BhcnRUb01lbWJlcihtKSlcbiAgICBjb25zdCBuYW1lID0gbWFjcm8/LmxpbmtzPy5ub3VuPy5sZXhlbWU/LnJvb3RcblxuICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub255bW91cyBzeW50YXghJylcbiAgICB9XG5cbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IEFzdE5vZGUpOiBNZW1iZXIge1xuXG4gICAgY29uc3QgYWRqZWN0aXZlTm9kZXMgPSBtYWNyb1BhcnQubGlua3M/LmFkamVjdGl2ZT8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBhZGplY3RpdmVOb2Rlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG5cbiAgICBjb25zdCB0YWdnZWRVbmlvbnMgPSBtYWNyb1BhcnQubGlua3M/LnRhZ2dlZHVuaW9uPy5saXN0ID8/IFtdXG4gICAgY29uc3QgZ3JhbW1hcnMgPSB0YWdnZWRVbmlvbnMubWFwKHggPT4geC5saW5rcz8uZ3JhbW1hcilcblxuICAgIGNvbnN0IHF1YW50YWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gYS5jYXJkaW5hbGl0eSlcbiAgICBjb25zdCBxdWFsYWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gIWEuY2FyZGluYWxpdHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5mdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCk6IEFzdFR5cGVbXSB7XG5cbiAgICBjb25zdCB4ID0gKHN5bnRheGVzW2FdID8/IFtdKS5mbGF0TWFwKG0gPT4gbS50eXBlKVxuICAgIHJldHVybiB4XG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcblxuY29uc3QgdGVzdHMgPSBbXG4gICAgdGVzdDEsXG4gICAgdGVzdDIsXG4gICAgdGVzdDMsXG4gICAgdGVzdDQsXG4gICAgdGVzdDUsXG4gICAgdGVzdDYsXG4gICAgdGVzdDcsXG4gICAgdGVzdDgsXG4gICAgdGVzdDksXG4gICAgdGVzdDEwLFxuICAgIHRlc3QxMSxcbiAgICB0ZXN0MTIsXG4gICAgdGVzdDEzLFxuICAgIHRlc3QxNCxcbiAgICB0ZXN0MTUsXG4gICAgdGVzdDE2LFxuICAgIHRlc3QxNyxcbiAgICB0ZXN0MTgsXG5dXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRlc3QoKSA/ICdzdWNjZXNzJyA6ICdmYWlsJywgdGVzdC5uYW1lKVxuICAgICAgICBhd2FpdCBzbGVlcCg1MCkvLzc1XG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdyZWQnKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgndyBhbmQgeiBhcmUgYmxhY2snKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDRcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5JylcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGUoJ3knKVswXSlcbn1cblxuZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbiBhbmQgaXQgaXMgZ3JlZW4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyByZWQuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIG5vdCBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdXG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggY2xpY2tzJylcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG59XG5cbmZ1bmN0aW9uIHRlc3QxOCgpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQuIHggaXMgYSBidXR0b24gYW5kIHkgaXMgYSBkaXYuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSByZWQgYnV0dG9uIGlzIGJsYWNrJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdkaXYnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xlYXJEb20oKSB7XG4gICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnJ1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSdcbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCJcbi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhIGxpc3Qgb2YgcHJpbWl0aXZlcyAobnVtYmVycywgYm9vbHMsIHN0cmluZ3MpLlxuICogQ2FyZWZ1bCB1c2luZyB0aGlzIHdpdGggb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVuaXEgPSAoeDogYW55W10pID0+IEFycmF5LmZyb20obmV3IFNldCh4KSlcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=