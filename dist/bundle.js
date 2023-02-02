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
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const Wrapper_1 = __webpack_require__(/*! ../../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class CreateAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        var _a, _b, _c, _d;
        const id = (_c = (0, getAction_1.lookup)((_b = (_a = this.clause) === null || _a === void 0 ? void 0 : _a.args) === null || _b === void 0 ? void 0 : _b[0], context, this.topLevel, this.clause.exactIds)) !== null && _c !== void 0 ? _c : (0, Id_1.getRandomId)();
        const predicate = this.clause.predicate;
        if (!predicate || !id) {
            return;
        }
        if (context.enviro.exists(id)) { //  existence check prior to creating
            return;
        }
        const proto = (0, Lexeme_1.getProto)(predicate);
        if (proto instanceof HTMLElement) {
            const tagNameFromProto = (x) => x.constructor.name.replace('HTML', '').replace('Element', '').toLowerCase();
            const o = document.createElement(tagNameFromProto(proto));
            (_d = context.enviro.root) === null || _d === void 0 ? void 0 : _d.appendChild(o);
            o.id = id + '';
            o.textContent = 'default';
            const newObj = (0, Wrapper_1.wrap)(id, o, context);
            newObj.set(predicate);
            context.enviro.set(id, newObj);
        }
        else {
            const o = new proto.constructor();
            const newObj = (0, Wrapper_1.wrap)(o, context);
            newObj.set(predicate);
            context.enviro.set(id, newObj);
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
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const getAction_1 = __webpack_require__(/*! ./getAction */ "./app/src/actuator/actions/getAction.ts");
class EditAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (this.clause.args && this.topLevel.topLevel().includes(this.clause.args[0])) {
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
        this.set(localId, predicate, this.getProps(localId), context);
    }
    forNonTopLevel(context) {
        var _a, _b, _c;
        const localId = (_a = this.clause.args) === null || _a === void 0 ? void 0 : _a[0];
        const predicate = this.clause.predicate;
        if (!localId || !predicate) {
            return;
        }
        const ownerLocalId = this.topLevel.getTopLevelOwnerOf(localId);
        const propName = this.topLevel.theme.describe(localId);
        if (!ownerLocalId || ((_c = (_b = this.clause) === null || _b === void 0 ? void 0 : _b.predicate) === null || _c === void 0 ? void 0 : _c.root) === propName[0].root) {
            return;
        }
        this.set(ownerLocalId, predicate, this.getProps(ownerLocalId), context);
    }
    set(localId, predicate, props, context) {
        var _a, _b;
        const id = (_a = (0, getAction_1.lookup)(localId, context, this.topLevel, this.clause.exactIds)) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
        const obj = (_b = context.enviro.get(id)) !== null && _b !== void 0 ? _b : context.enviro.set(id);
        obj.set(predicate, props);
    }
    getProps(topLevelEntity) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]); // ASSUME at least one
    }
}
exports["default"] = EditAction;


/***/ }),

/***/ "./app/src/actuator/actions/ImplyAction.ts":
/*!*************************************************!*\
  !*** ./app/src/actuator/actions/ImplyAction.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ../../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
class ImplyAction {
    constructor(condition, conclusion) {
        this.condition = condition;
        this.conclusion = conclusion;
    }
    run(context) {
        const isSetAliasCall = // assume if at least one owned entity that it's a set alias call
         this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
            || this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length;
        if (isSetAliasCall) {
            this.setAliasCall(context);
        }
        else {
            this.other(context);
        }
    }
    setAliasCall(context) {
        const top = this.condition.topLevel()[0]; //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1);
        const props = this.conclusion.getOwnershipChain(top).slice(1);
        const conceptName = alias.map(x => this.condition.describe(x)[0]); // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]); // same ...
        const protoName = this.condition.describe(top)[0]; // assume one 
        const proto = (0, Lexeme_1.getProto)(protoName);
        const oldType = propsNames[0].type;
        const type = oldType !== null && oldType !== void 0 ? oldType : 'noun';
        const newLexeme = Object.assign(Object.assign({}, conceptName[0]), { type: type });
        context.config.setLexeme(newLexeme);
        (0, Wrapper_1.wrap)((0, Id_1.getRandomId)(), proto).setAlias(newLexeme, propsNames);
    }
    other(context) {
        const top = this.condition.topLevel()[0];
        const protoName = this.condition.describe(top)[0]; // assume one 
        const predicate = this.conclusion.describe(top)[0];
        const y = context.enviro.query((0, Clause_1.clauseOf)(protoName, 'X'));
        const ids = y.map(m => m['X']);
        ids.forEach(id => { var _a; return (_a = context.enviro.get(id)) === null || _a === void 0 ? void 0 : _a.set(predicate); });
    }
}
exports["default"] = ImplyAction;


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
            .map(a => (0, getAction_1.lookup)(a, context, this.topLevel, this.clause.exactIds));
        const predicate = this.clause.predicate;
        if (!args || !predicate) {
            return;
        }
        const subject = context.enviro.get(args[0]);
        const object = context.enviro.get(args[1]);
        return subject === null || subject === void 0 ? void 0 : subject.call(predicate, [object]);
    }
}
exports["default"] = RelationAction;


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
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const ConceptAction_1 = __importDefault(__webpack_require__(/*! ./ConceptAction */ "./app/src/actuator/actions/ConceptAction.ts"));
const CreateAction_1 = __importDefault(__webpack_require__(/*! ./CreateAction */ "./app/src/actuator/actions/CreateAction.ts"));
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/actuator/actions/EditAction.ts"));
const RelationAction_1 = __importDefault(__webpack_require__(/*! ./RelationAction */ "./app/src/actuator/actions/RelationAction.ts"));
function getAction(clause, topLevel) {
    var _a;
    // relations (multi arg predicates) except for 'of' 
    if (clause.args && clause.args.length > 1 && clause.predicate && clause.predicate.root !== 'of') {
        return new RelationAction_1.default(clause, topLevel);
    }
    // for anaphora resolution (TODO: remove)
    if (clause.exactIds) {
        return new EditAction_1.default(clause, topLevel);
    }
    // to create new concept or new instance thereof
    if (clause.args && topLevel.rheme.describe(clause.args[0]).some(x => (0, Lexeme_1.isConcept)(x))) { // 
        return new ConceptAction_1.default(clause, topLevel);
    }
    if ((_a = clause.predicate) === null || _a === void 0 ? void 0 : _a.proto) {
        return new CreateAction_1.default(clause, topLevel);
    }
    return new EditAction_1.default(clause, topLevel);
}
exports.getAction = getAction;
function lookup(id, context, topLevel, exactIds) {
    var _a;
    if (exactIds) {
        return id;
    }
    const q = topLevel.theme.about(id);
    const maps = context.enviro.query(q);
    const res = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[id]; //TODO could be undefined
    return res;
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BaseActuator {
    takeAction(clause, context) {
        clause.toAction(clause).forEach(a => a.run(context));
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
class BasicBrain {
    constructor(context, actuator = (0, Actuator_1.getActuator)()) {
        this.context = context;
        this.actuator = actuator;
        this.context.config.startupCommands.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.context.config).parseAll().map(ast => {
            if (ast.type === 'macro') {
                this.context.config.setSyntax(ast);
                return [];
            }
            const clause = (0, toClause_1.toClause)(ast);
            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.context);
                return [];
            }
            else {
                const maps = this.context.enviro.query(clause);
                const ids = maps.flatMap(m => Object.values(m));
                const objects = ids.map(id => this.context.enviro.get(id));
                this.context.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
                objects.forEach(o => o === null || o === void 0 ? void 0 : o.pointOut());
                return objects.map(o => o === null || o === void 0 ? void 0 : o.object);
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

/***/ "./app/src/brain/toClause.ts":
/*!***********************************!*\
  !*** ./app/src/brain/toClause.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toClause = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Anaphora_1 = __webpack_require__(/*! ../enviro/Anaphora */ "./app/src/enviro/Anaphora.ts");
function toClause(ast, args) {
    var _a, _b, _c, _d;
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
    if (result) {
        const c1 = makeAllVars(result);
        const c2 = resolveAnaphora(c1);
        const c3 = propagateVarsOwned(c2);
        return c3;
    }
    console.log({ ast });
    throw new Error(`Idk what to do with '${ast.type}'!`);
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c, _d;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
    const subject = toClause((_b = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId });
    const predicate = toClause((_c = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId }).copy({ negate: !!((_d = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _d === void 0 ? void 0 : _d.negation) });
    const entities = subject.entities.concat(predicate.entities);
    const result = entities.some(e => (0, Id_1.isVar)(e)) ? // assume any sentence with any var is an implication
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true });
    return result.copy({ sideEffecty: true });
}
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    const predicate = (_a = copulaSubClause === null || copulaSubClause === void 0 ? void 0 : copulaSubClause.links) === null || _a === void 0 ? void 0 : _a.predicate; //as CompositeNode<CompositeType>
    return toClause(predicate, { subject: args === null || args === void 0 ? void 0 : args.subject })
        .copy({ sideEffecty: false });
}
function complementToClause(complement, args) {
    var _a, _b, _c, _d;
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)(); //?? ((): Id => { throw new Error('undefined subject id') })()
    const newId = (0, Id_1.getRandomId)();
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
    const maybeId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
    const subjectId = ((_b = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _b === void 0 ? void 0 : _b.uniquant) ? (0, Id_1.toVar)(maybeId) : maybeId;
    const adjectives = (_e = (_d = (_c = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _c === void 0 ? void 0 : _c.adjective) === null || _d === void 0 ? void 0 : _d.list) !== null && _e !== void 0 ? _e : [];
    const noun = (_f = nounPhrase.links) === null || _f === void 0 ? void 0 : _f.subject;
    const complements = (_j = (_h = (_g = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _g === void 0 ? void 0 : _g.complement) === null || _h === void 0 ? void 0 : _h.list) !== null && _j !== void 0 ? _j : [];
    const subClause = (_k = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _k === void 0 ? void 0 : _k.subclause;
    const res = adjectives.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; })
        .concat((noun === null || noun === void 0 ? void 0 : noun.lexeme) ? [noun.lexeme] : [])
        .map(p => (0, Clause_1.clauseOf)(p, subjectId))
        .reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)())
        .and(complements.map(c => c ? toClause(c, { subject: subjectId }) : (0, Clause_1.emptyClause)()).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
        .and(subClause ? toClause(subClause, { subject: subjectId }) : (0, Clause_1.emptyClause)())
        .copy({ sideEffecty: false });
    return res;
}
function makeAllVars(clause) {
    const m = clause.entities
        .filter(x => (0, Id_1.isVar)(x))
        .map(e => ({ [(0, Id_1.toConst)(e)]: e }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
}
function resolveAnaphora(clause) {
    if (clause.rheme.hashCode === (0, Clause_1.emptyClause)().hashCode) {
        return clause;
    }
    const a = (0, Anaphora_1.getAnaphora)();
    a.assert(clause.theme);
    const m = a.query(clause.rheme)[0];
    return clause.copy({ map: m !== null && m !== void 0 ? m : {} });
}
function propagateVarsOwned(clause) {
    const m = clause.entities
        .filter(e => (0, Id_1.isVar)(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
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
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
    const objId = (0, Id_1.getRandomId)();
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
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
const getTopLevelOwnerOf_1 = __webpack_require__(/*! ./getTopLevelOwnerOf */ "./app/src/clauses/getTopLevelOwnerOf.ts");
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
class And {
    constructor(clause1, clause2, clause2IsRheme, negated = false, exactIds = false, isSideEffecty = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments))) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.hashCode = hashCode;
    }
    and(other, opts) {
        var _a;
        return new And(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new And(this.clause1.copy(opts), this.clause2.copy(opts), this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return this.negated ? [this] :
            [...this.clause1.flatList(), ...this.clause2.flatList()];
    }
    get entities() {
        return Array.from(new Set(this.clause1.entities.concat(this.clause2.entities)));
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        return this.clause1.about(id).and(this.clause2.about(id));
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
    }
    ownersOf(id) {
        return this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
    }
    describe(id) {
        return this.clause1.describe(id).concat(this.clause2.describe(id));
    }
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    get theme() {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme);
    }
    get rheme() {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme);
    }
    toAction(topLevel) {
        return this.clause1.toAction(topLevel).concat(this.clause2.toAction(topLevel));
    }
    getTopLevelOwnerOf(id) {
        return (0, getTopLevelOwnerOf_1.getTopLevelOwnerOf)(id, this);
    }
    query(query) {
        var _a;
        // utility funcs
        const range = (n) => [...new Array(n).keys()];
        const uniq = (x) => Array.from(new Set(x));
        // each entity in the query should find its full description,
        // otherwise it does not exist in this
        const multiMap = {};
        for (const e of query.entities) {
            for (const d of query.about(e).flatList()) {
                const r1 = this.clause1.query(d);
                const r2 = this.clause2.query(d);
                if (!r1.length && !r2.length) { // e doesn't exist
                    multiMap[e] = [];
                    break;
                }
                else { // problem: (x,y,z) and (a,b,c) !-> (x,b,c)
                    const cands = r1.map(m => m[e]).concat(r2.map(m => m[e])).filter(id => id !== undefined);
                    multiMap[e] = uniq([...(_a = multiMap[e]) !== null && _a !== void 0 ? _a : [], ...cands]);
                }
            }
        }
        const maxSize = Math.max(...Object.values(multiMap).map(x => x.length));
        const res = range(maxSize).map(i => {
            const m = query.entities
                .filter(e => multiMap[e][i] !== undefined)
                .map(e => ({ [e]: multiMap[e][i] }))
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            return m;
        });
        return res;
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
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
const getTopLevelOwnerOf_1 = __webpack_require__(/*! ./getTopLevelOwnerOf */ "./app/src/clauses/getTopLevelOwnerOf.ts");
const getAction_1 = __webpack_require__(/*! ../actuator/actions/getAction */ "./app/src/actuator/actions/getAction.ts");
class BasicClause {
    constructor(predicate, args, negated = false, exactIds = false, isSideEffecty = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), rheme = (0, Clause_1.emptyClause)()) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.hashCode = hashCode;
        this.rheme = rheme;
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return [this];
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        return this.entities.includes(id) ? this : (0, Clause_1.emptyClause)();
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
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    toAction(topLevel) {
        return [(0, getAction_1.getAction)(this, topLevel)];
    }
    get theme() {
        return this;
    }
    get entities() {
        return Array.from(new Set(this.args));
    }
    getTopLevelOwnerOf(id) {
        return (0, getTopLevelOwnerOf_1.getTopLevelOwnerOf)(id, this);
    }
    query(clause) {
        if (!(clause instanceof BasicClause)) { // TODO: what about And of same BasicClause
            return [];
        }
        if (clause.predicate.root !== this.predicate.root) {
            return [];
        }
        // TODO what about exact ids?
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const EmptyClause_1 = __webpack_require__(/*! ./EmptyClause */ "./app/src/clauses/EmptyClause.ts");
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
const emptyClause = () => new EmptyClause_1.EmptyClause();
exports.emptyClause = emptyClause;


/***/ }),

/***/ "./app/src/clauses/EmptyClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/EmptyClause.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmptyClause = void 0;
class EmptyClause {
    constructor(negated = false, hashCode = 99999999, entities = [], isSideEffecty = false, exactIds = false) {
        this.negated = negated;
        this.hashCode = hashCode;
        this.entities = entities;
        this.isSideEffecty = isSideEffecty;
        this.exactIds = exactIds;
    }
    copy(opts) {
        return this;
    }
    get theme() {
        return this;
    }
    get rheme() {
        return this;
    }
    and(other, opts) {
        return other;
    }
    implies(conclusion) {
        return conclusion;
    }
    flatList() {
        return [];
    }
    about(id) {
        return this;
    }
    ownedBy(id) {
        return [];
    }
    ownersOf(id) {
        return [];
    }
    describe(id) {
        return [];
    }
    topLevel() {
        return [];
    }
    getOwnershipChain(entity) {
        return [];
    }
    toString() {
        return '';
    }
    toAction(topLevel) {
        return [];
    }
    getTopLevelOwnerOf(id) {
        return undefined;
    }
    query(clause) {
        return [];
    }
}
exports.EmptyClause = EmptyClause;


/***/ }),

/***/ "./app/src/clauses/Id.ts":
/*!*******************************!*\
  !*** ./app/src/clauses/Id.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toConst = exports.isVar = exports.toVar = exports.getRandomId = void 0;
function* getIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}
const idGenerator = getIdGenerator();
function getRandomId(opts) {
    // const newId = `id${parseInt(1000 * Math.random() + '')}`
    const newId = `id${idGenerator.next().value}`;
    return (opts === null || opts === void 0 ? void 0 : opts.asVar) ? toVar(newId) : newId;
}
exports.getRandomId = getRandomId;
function toVar(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase();
}
exports.toVar = toVar;
function isVar(e) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase());
}
exports.isVar = isVar;
function toConst(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase();
}
exports.toConst = toConst;


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
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
const ImplyAction_1 = __importDefault(__webpack_require__(/*! ../actuator/actions/ImplyAction */ "./app/src/actuator/actions/ImplyAction.ts"));
const getTopLevelOwnerOf_1 = __webpack_require__(/*! ./getTopLevelOwnerOf */ "./app/src/clauses/getTopLevelOwnerOf.ts");
class Imply {
    constructor(condition, consequence, negated = false, exactIds = false, isSideEffecty = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = condition, rheme = consequence) {
        this.condition = condition;
        this.consequence = consequence;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.hashCode = hashCode;
        this.theme = theme;
        this.rheme = rheme;
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new Imply(this.condition.copy(opts), this.consequence.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return [this];
    }
    get entities() {
        return this.condition.entities.concat(this.consequence.entities);
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
    about(id) {
        return (0, Clause_1.emptyClause)(); ///TODO!!!!!!!!
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
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    toAction(topLevel) {
        return [new ImplyAction_1.default(this.condition, this.consequence)];
    }
    getTopLevelOwnerOf(id) {
        return (0, getTopLevelOwnerOf_1.getTopLevelOwnerOf)(id, this);
    }
    query(clause) {
        // if (!(clause instanceof Imply)) {
        //     return []
        // }
        // if (clause.condition.predicate !== this.condition.predicate ||
        //     clause.consequence.predicate !== this.consequence.predicate) {
        //     return []
        // }
        // // this.condition.query(clause.condition)
        //TODO!
        return [];
    }
}
exports["default"] = Imply;


/***/ }),

/***/ "./app/src/clauses/getOwnershipChain.ts":
/*!**********************************************!*\
  !*** ./app/src/clauses/getOwnershipChain.ts ***!
  \**********************************************/
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

/***/ "./app/src/clauses/getTopLevelOwnerOf.ts":
/*!***********************************************!*\
  !*** ./app/src/clauses/getTopLevelOwnerOf.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTopLevelOwnerOf = void 0;
function getTopLevelOwnerOf(id, topLevel) {
    const owners = topLevel.ownersOf(id);
    const maybe = owners
        .filter(o => topLevel.topLevel().includes(o)).at(0);
    if (!maybe && owners.length > 0) {
        return getTopLevelOwnerOf(owners[0], topLevel);
    }
    else {
        return maybe;
    }
}
exports.getTopLevelOwnerOf = getTopLevelOwnerOf;


/***/ }),

/***/ "./app/src/clauses/hashString.ts":
/*!***************************************!*\
  !*** ./app/src/clauses/hashString.ts ***!
  \***************************************/
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

/***/ "./app/src/clauses/topLevel.ts":
/*!*************************************!*\
  !*** ./app/src/clauses/topLevel.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.topLevel = void 0;
function topLevel(clause) {
    return clause
        .entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
}
exports.topLevel = topLevel;


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
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.lexemeTypes = (0, utils_1.stringLiterals)('adjective', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'grammar', 'nonsubconj', // and ...
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
        forms: ['have', 'has'],
        irregular: true
    },
    {
        root: 'button',
        type: 'noun',
        proto: 'HTMLButtonElement'
    },
    {
        root: 'list',
        type: 'noun',
        proto: 'Array'
    },
    {
        root: 'click',
        type: 'mverb',
        forms: ['click']
    },
    {
        root: 'clicked',
        type: 'adjective',
        derivedFrom: 'click'
    },
    {
        root: 'pressed',
        type: 'adjective',
        aliasFor: 'clicked'
    },
    {
        root: 'cat',
        type: 'noun'
    },
    {
        root: 'be',
        type: 'copula',
        forms: ['is', 'are'],
        irregular: true
    },
    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },
    {
        root: "exist",
        type: "iverb",
    },
    {
        root: 'do',
        type: 'hverb',
        irregular: true,
        forms: ['do', 'does']
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
        type: 'then' // filler word
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
    // domain
    'color is a concept',
    'red and blue and black and green are colors',
    'color of any button is background of style of button',
    'text of any button is textContent of button',
];


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.staticDescPrecedence = exports.constituentTypes = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.constituentTypes = (0, utils_1.stringLiterals)(
// permanent
'macro', 'macropart', 'taggedunion', 
// extendible
'copula sentence', 'noun phrase', 'complement', 'subclause', 'and sentence', 'mverb sentence');
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
    'mverb sentence': [
        { type: ['noun phrase'], number: 1, role: 'subject' },
        { type: ['hverb'], number: '1|0' },
        { type: ['negation'], number: '1|0' },
        { type: ['mverb'], number: 1 },
        { type: ['noun phrase'], number: 1, role: 'object' }
    ]
};


/***/ }),

/***/ "./app/src/config/utils.ts":
/*!*********************************!*\
  !*** ./app/src/config/utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringLiterals = void 0;
function stringLiterals(...args) { return args; }
exports.stringLiterals = stringLiterals;


/***/ }),

/***/ "./app/src/enviro/Anaphora.ts":
/*!************************************!*\
  !*** ./app/src/enviro/Anaphora.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAnaphora = void 0;
const Actuator_1 = __webpack_require__(/*! ../actuator/actuator/Actuator */ "./app/src/actuator/actuator/Actuator.ts");
const Context_1 = __webpack_require__(/*! ../brain/Context */ "./app/src/brain/Context.ts");
function getAnaphora() {
    return new EnviroAnaphora();
}
exports.getAnaphora = getAnaphora;
class EnviroAnaphora {
    constructor(context = (0, Context_1.getNewContext)({ root: undefined })) {
        this.context = context;
    }
    assert(clause) {
        (0, Actuator_1.getActuator)().takeAction(clause.copy({ exactIds: true }), this.context);
    }
    query(clause) {
        return this.context.enviro.query(clause);
    }
}


/***/ }),

/***/ "./app/src/enviro/BaseEnviro.ts":
/*!**************************************!*\
  !*** ./app/src/enviro/BaseEnviro.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Placeholder_1 = __webpack_require__(/*! ./Placeholder */ "./app/src/enviro/Placeholder.ts");
class BaseEnviro {
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
    }
    get(id) {
        return this.dictionary[id];
    }
    get values() {
        return Object.values(this.dictionary);
    }
    exists(id) {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder_1.Placeholder);
    }
    set(id, object) {
        if (!object) {
            return this.dictionary[id] = new Placeholder_1.Placeholder(id);
        }
        else {
            const placeholder = this.dictionary[id];
            if (placeholder && placeholder instanceof Placeholder_1.Placeholder) {
                placeholder.predicates.forEach(p => {
                    object.set(p);
                });
                this.dictionary[id] = object;
            }
            this.lastReferenced = id;
            return object;
        }
    }
    query(clause) {
        //TODO this is a tmp solution, for anaphora resolution, but just with descriptions, without taking (multi-entity) relationships into account
        //TODO: after "every ..." sentence, "it" should be undefined
        var _a;
        const universe = Object
            .entries(this.dictionary)
            .map(x => ({ e: x[0], w: x[1] }));
        const query = clause // described entities
            .entities
            .map(e => ({ e, desc: clause.theme.describe(e) }));
        const getIt = () => this.lastReferenced ? [{ e: this.lastReferenced, w: this.dictionary[this.lastReferenced] }] : [];
        const res = query
            .flatMap(q => {
            const to = universe
                .filter(u => q.desc.length > 0 && q.desc.every(d => u.w.is(d)))
                .concat(q.desc.find(x => x.type == 'pronoun') ? getIt() : []);
            return { from: q.e, to: to };
        });
        const resSize = Math.max(...res.map(q => q.to.length));
        const fromToTo = (from) => res.filter(x => x.from === from)[0].to.map(x => x.e);
        const range = (n) => [...new Array(n).keys()];
        const res2 = range(resSize).map(i => clause
            .entities
            .filter(from => fromToTo(from).length > 0)
            .map(from => { var _a; return ({ [from]: (_a = fromToTo(from)[i]) !== null && _a !== void 0 ? _a : fromToTo(from)[0] }); })
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
        this.lastReferenced = (_a = res2.flatMap(x => Object.values(x)).at(-1)) !== null && _a !== void 0 ? _a : this.lastReferenced;
        return res2; // return list of maps, where each map should should have ALL ids from clause in its keys, eg: [{id2:id1, id4:id3}, {id2:1, id4:3}].
    }
}
exports["default"] = BaseEnviro;


/***/ }),

/***/ "./app/src/enviro/ConcreteWrapper.ts":
/*!*******************************************!*\
  !*** ./app/src/enviro/ConcreteWrapper.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
class ConcreteWrapper {
    constructor(object, id, simpleConcepts, simplePredicates) {
        var _a;
        if (simpleConcepts === void 0) { simpleConcepts = (_a = object.simpleConcepts) !== null && _a !== void 0 ? _a : {}; }
        if (simplePredicates === void 0) { simplePredicates = []; }
        this.object = object;
        this.id = id;
        this.simpleConcepts = simpleConcepts;
        this.simplePredicates = simplePredicates;
        object.simpleConcepts = simpleConcepts;
        object.simplePredicates = simplePredicates;
    }
    set(predicate, props) {
        if (props && props.length > 1) { // assume > 1 props are a path
            this.setNested(props.map(x => x.root), predicate.root);
        }
        else if (props && props.length === 1) {
            this.setSingleProp(predicate, props);
        }
        else if (!props || props.length === 0) {
            this.setZeroProps(predicate);
        }
    }
    is(predicate) {
        var _a;
        const concept = (_a = predicate.concepts) === null || _a === void 0 ? void 0 : _a.at(0);
        return concept ?
            this.getNested(this.simpleConcepts[concept].path) === predicate.root :
            this.simplePredicates.map(x => x.root).includes(predicate.root);
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName.root] = { path: propPath.map(x => x.root), lexeme: conceptName };
    }
    pointOut(opts) {
        if (this.object instanceof HTMLElement) {
            this.object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
        }
    }
    call(verb, args) {
        var _a, _b;
        const concept = (_a = this.simpleConcepts[verb.root]) === null || _a === void 0 ? void 0 : _a.path;
        const methodName = (_b = concept === null || concept === void 0 ? void 0 : concept[0]) !== null && _b !== void 0 ? _b : verb.root;
        return this === null || this === void 0 ? void 0 : this.object[methodName](...args.map(x => x.object));
    }
    get clause() {
        const preds = Object.keys(this.simpleConcepts)
            .map(k => this.getNested(this.simpleConcepts[k].path))
            .map((x) => ({ root: x, type: 'adjective' }))
            .concat(this.simplePredicates);
        const clause = preds
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), (0, Clause_1.emptyClause)());
        return clause;
    }
    setSingleProp(predicate, props) {
        const path = this.simpleConcepts[props[0].root].path;
        if (path) { // is concept 
            this.setNested(path, predicate.root);
        }
        else { // not concept
            this.setNested(props.map(x => x.root), predicate.root);
        }
    }
    setZeroProps(predicate) {
        if (predicate.concepts && predicate.concepts.length > 0) {
            this.setNested(this.simpleConcepts[predicate.concepts[0]].path, predicate.root);
        }
        else {
            this.simplePredicates.push(predicate); //TODO: check duplicates!
        }
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
            x = x[p];
        });
        return x;
    }
}
exports["default"] = ConcreteWrapper;


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

/***/ "./app/src/enviro/Placeholder.ts":
/*!***************************************!*\
  !*** ./app/src/enviro/Placeholder.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Placeholder = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
class Placeholder {
    constructor(id, predicates = [], object = {}) {
        this.id = id;
        this.predicates = predicates;
        this.object = object;
    }
    set(predicate, props) {
        this.predicates.push(predicate);
    }
    is(predicate) {
        return this.predicates.some(x => x.root == predicate.root);
    }
    get clause() {
        return this.predicates
            .map(p => (0, Clause_1.clauseOf)(p, this.id))
            .reduce((a, b) => a.and(b), (0, Clause_1.emptyClause)());
    }
    setAlias(conceptName, propPath) { }
    pointOut(opts) { }
    call(verb, args) { }
}
exports.Placeholder = Placeholder;


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
exports.wrap = void 0;
const ConcreteWrapper_1 = __importDefault(__webpack_require__(/*! ./ConcreteWrapper */ "./app/src/enviro/ConcreteWrapper.ts"));
function wrap(id, o, context) {
    addNewVerbs(o, context);
    return new ConcreteWrapper_1.default(o, id);
}
exports.wrap = wrap;
function addNewVerbs(object, context) {
    if (context) {
        const props = allPropsOf(object);
        props.forEach(x => {
            if (!context.config.lexemes.map(l => l.root).includes(x)) {
                context.config.setLexeme({ root: x, type: 'mverb' });
            }
        });
    }
}
function allPropsOf(x) {
    const result = [];
    let y = x;
    do {
        result.push(...Object.getOwnPropertyNames(y));
    } while ((y = Object.getPrototypeOf(y)));
    return result;
}


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
const queryTester_1 = __importDefault(__webpack_require__(/*! ./tests/queryTester */ "./app/src/tests/queryTester.ts"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, autotester_1.default)();
    (0, queryTester_1.default)();
    (0, main_1.default)();
}))();
// 


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, config) {
        this.sourceCode = sourceCode;
        this.config = config;
        this.tokens =
            this.joinMultiWordLexemes((0, Lexeme_1.stdspace)(sourceCode), config.lexemes)
                // .toLowerCase()
                .trim()
                .split(/\s+|\./)
                .map(s => !s ? '.' : s)
                .map(s => (0, Lexeme_1.respace)(s))
                .flatMap(s => (0, Lexeme_1.getLexemes)(s, config.lexemes));
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
    joinMultiWordLexemes(sourceCode, lexemes) {
        let newSource = sourceCode;
        lexemes
            .filter(x => (0, Lexeme_1.isMultiWord)(x))
            .forEach(x => {
            const lexeme = (0, Lexeme_1.stdspace)(x.root);
            newSource = newSource.replaceAll(lexeme, (0, Lexeme_1.unspace)(lexeme));
        });
        return newSource;
    }
}
exports["default"] = EagerLexer;


/***/ }),

/***/ "./app/src/lexer/Lexeme.ts":
/*!*********************************!*\
  !*** ./app/src/lexer/Lexeme.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stdspace = exports.respace = exports.unspace = exports.isMultiWord = exports.isConcept = exports.getProto = exports.getLexemes = exports.formsOf = void 0;
function formsOf(lexeme) {
    var _a;
    return [lexeme.root].concat((_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.forms) !== null && _a !== void 0 ? _a : [])
        .concat(!lexeme.irregular ? [`${lexeme.root}s`] : []);
}
exports.formsOf = formsOf;
function getLexemes(word, lexemes) {
    var _a;
    const lexeme = (_a = lexemes.filter(x => formsOf(x).includes(word)).at(0)) !== null && _a !== void 0 ? _a : { root: word, type: 'noun' };
    // ?? { root: word, type: 'any' }
    const lexeme2 = Object.assign(Object.assign({}, lexeme), { token: word });
    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, lexemes)) :
        [lexeme2];
}
exports.getLexemes = getLexemes;
function getProto(lexeme) {
    var _a, _b;
    return (_b = (_a = window) === null || _a === void 0 ? void 0 : _a[lexeme.proto]) === null || _b === void 0 ? void 0 : _b.prototype;
}
exports.getProto = getProto;
function isConcept(lexeme) {
    var _a;
    return (_a = lexeme.concepts) === null || _a === void 0 ? void 0 : _a.includes('concept');
}
exports.isConcept = isConcept;
function isMultiWord(lexeme) {
    return lexeme.root.includes(' ');
}
exports.isMultiWord = isMultiWord;
function unspace(string) {
    return string.replaceAll(' ', '-');
}
exports.unspace = unspace;
function respace(string) {
    return string.replaceAll('-', ' ');
}
exports.respace = respace;
function stdspace(string) {
    return string.replaceAll(/\s+/g, ' ');
}
exports.stdspace = stdspace;


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
function getLexer(sourceCode, config) {
    return new EagerLexer_1.default(sourceCode, config);
}
exports.getLexer = getLexer;


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
    constructor(sourceCode, config, lexer = (0, Lexer_1.getLexer)(sourceCode, config)) {
        this.sourceCode = sourceCode;
        this.config = config;
        this.lexer = lexer;
        this.knownParse = (name, role) => {
            const members = this.config.getSyntax(name);
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
            for (const m of this.config.getSyntax(name)) {
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
            return this.config.lexemeTypes.includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.config.syntaxList);
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
function getParser(sourceCode, config) {
    return new KoolParser_1.KoolParser(sourceCode, config);
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
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log(test() ? 'success' : 'fail', test.name);
            yield sleep(100);
            clearDom();
        }
    });
}
exports["default"] = autotester;
function test1() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is red. x is a button. y is a green button.');
    const assert1 = (brain.execute('a green button'))[0].style.background === 'green';
    const assert2 = (brain.execute('a red button'))[0].style.background === 'red';
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
    const assert1 = (brain.execute('a red button'))[0].style.background === 'red';
    const assert2 = (brain.execute('a green button'))[0].style.background === 'green';
    const assert3 = (brain.execute('a black button'))[0].style.background === 'black';
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
    const assert1 = (brain.execute('x'))[0].style.background === 'red';
    return assert1;
}
function test6() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. the background of style of x is green.');
    const assert1 = (brain.execute('x'))[0].style.background === 'green';
    return assert1;
}
function test7() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. y is a button. z is a button. every button is red.');
    const assert1 = (brain.execute('x'))[0].style.background === 'red';
    const assert2 = (brain.execute('y'))[0].style.background === 'red';
    const assert3 = (brain.execute('z'))[0].style.background === 'red';
    return assert1 && assert2 && assert3;
}
function test8() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a button. text of x is capra.');
    const assert1 = (brain.execute('button'))[0].textContent == 'capra';
    return assert1;
}
function test9() {
    const brain = (0, Brain_1.getBrain)({ root: document.body });
    brain.execute('x is a red button. x is green.');
    const assert1 = (brain.execute('red')).length === 0;
    const assert2 = (brain.execute('green')).length === 1;
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

/***/ "./app/src/tests/queryTester.ts":
/*!**************************************!*\
  !*** ./app/src/tests/queryTester.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
function queryTester() {
    const $ = (s) => ({ root: s, type: 'noun' });
    // let kb = clauseOf($('cat'), 0)
    //     .and(clauseOf($('black'), 0), { asRheme: true })
    // kb = kb
    //     .and(kb.copy({ map: { 0: 1 } }))
    //     .and(clauseOf($('capra'), 200))
    // const query = clauseOf($('cat'), 'ID100')
    //     .and(clauseOf($('black'), 'ID100'), { asRheme: true })
    //     .and(clauseOf($('capra'), 600))
    let kb = (0, Clause_1.clauseOf)($('of'), 0, 1)
        .and((0, Clause_1.clauseOf)($('of'), 2, 3));
    const query = (0, Clause_1.clauseOf)($('of'), 'OWNED', 'OWNER');
    console.log(kb.toString());
    console.log(query.toString());
    const res = kb.query(query);
    console.log(res);
}
exports["default"] = queryTester;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RWpDLE1BQU0sS0FBSyxHQUFHLHFCQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFFakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFFcEIsQ0FBQztBQTFCRCxpQ0EwQkM7Ozs7Ozs7VUNqQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9Db25jZXB0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9DcmVhdGVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0VkaXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0ltcGx5QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9SZWxhdGlvbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvZ2V0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3R1YXRvci9CYXNlQWN0dWF0b3IudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2dldFRvcExldmVsT3duZXJPZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQmFzaWNDb25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zdGFydHVwQ29tbWFuZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9Db25jcmV0ZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL1BsYWNlaG9sZGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3Rlc3RzL3F1ZXJ5VGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNlcHRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5hcmdzICYmIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkge1xuXG4gICAgICAgICAgICBjb25zdCBhZGogPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pWzBdLnJvb3RcblxuICAgICAgICAgICAgY29udGV4dC5jb25maWcuc2V0TGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBhZGosXG4gICAgICAgICAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgICAgICAgICAgY29uY2VwdHM6IFt0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdF0sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cblxufSIsImltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi8uLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBsb29rdXAgfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGlkID0gbG9va3VwKHRoaXMuY2xhdXNlPy5hcmdzPy5bMF0gYXMgYW55LCBjb250ZXh0LCB0aGlzLnRvcExldmVsLCB0aGlzLmNsYXVzZS5leGFjdElkcykgPz8gZ2V0UmFuZG9tSWQoKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcblxuICAgICAgICBpZiAoIXByZWRpY2F0ZSB8fCAhaWQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQuZW52aXJvLmV4aXN0cyhpZCkpIHsgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90byA9IGdldFByb3RvKHByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgICAgICBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IE9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lLnJlcGxhY2UoJ0hUTUwnLCAnJykucmVwbGFjZSgnRWxlbWVudCcsICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICBvLmlkID0gaWQgKyAnJ1xuICAgICAgICAgICAgby50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChpZCwgbywgY29udGV4dClcbiAgICAgICAgICAgIG5ld09iai5zZXQocHJlZGljYXRlKVxuICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uc2V0KGlkLCBuZXdPYmopXG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgbyA9IG5ldyAocHJvdG8gYXMgYW55KS5jb25zdHJ1Y3RvcigpXG4gICAgICAgICAgICBjb25zdCBuZXdPYmogPSB3cmFwKG8sIGNvbnRleHQpXG4gICAgICAgICAgICBuZXdPYmouc2V0KHByZWRpY2F0ZSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnNldChpZCwgbmV3T2JqKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5hcmdzICYmIHRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkge1xuICAgICAgICAgICAgdGhpcy5mb3JUb3BMZXZlbChjb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JOb25Ub3BMZXZlbChjb250ZXh0KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZm9yVG9wTGV2ZWwoY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGxvY2FsSWQgPSB0aGlzLmNsYXVzZS5hcmdzPy5bMF1cbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKCFsb2NhbElkIHx8ICFwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXQobG9jYWxJZCwgcHJlZGljYXRlLCB0aGlzLmdldFByb3BzKGxvY2FsSWQpLCBjb250ZXh0KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBmb3JOb25Ub3BMZXZlbChjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgbG9jYWxJZCA9IHRoaXMuY2xhdXNlLmFyZ3M/LlswXVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcblxuICAgICAgICBpZiAoIWxvY2FsSWQgfHwgIXByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvd25lckxvY2FsSWQgPSB0aGlzLnRvcExldmVsLmdldFRvcExldmVsT3duZXJPZihsb2NhbElkKVxuICAgICAgICBjb25zdCBwcm9wTmFtZSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUobG9jYWxJZClcblxuICAgICAgICBpZiAoIW93bmVyTG9jYWxJZCB8fCB0aGlzLmNsYXVzZT8ucHJlZGljYXRlPy5yb290ID09PSBwcm9wTmFtZVswXS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KG93bmVyTG9jYWxJZCwgcHJlZGljYXRlLCB0aGlzLmdldFByb3BzKG93bmVyTG9jYWxJZCksIGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldChsb2NhbElkOiBJZCwgcHJlZGljYXRlOiBMZXhlbWUsIHByb3BzOiBMZXhlbWVbXSwgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGlkID0gbG9va3VwKGxvY2FsSWQsIGNvbnRleHQsIHRoaXMudG9wTGV2ZWwsIHRoaXMuY2xhdXNlLmV4YWN0SWRzKSA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG9iaiA9IGNvbnRleHQuZW52aXJvLmdldChpZCkgPz8gY29udGV4dC5lbnZpcm8uc2V0KGlkKVxuICAgICAgICBvYmouc2V0KHByZWRpY2F0ZSwgcHJvcHMpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3BMZXZlbFxuICAgICAgICAgICAgLmdldE93bmVyc2hpcENoYWluKHRvcExldmVsRW50aXR5KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSkgLy8gQVNTVU1FIGF0IGxlYXN0IG9uZVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi8uLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSwgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCk6IGFueSB7XG5cbiAgICAgICAgY29uc3QgaXNTZXRBbGlhc0NhbGwgPSAgLy8gYXNzdW1lIGlmIGF0IGxlYXN0IG9uZSBvd25lZCBlbnRpdHkgdGhhdCBpdCdzIGEgc2V0IGFsaWFzIGNhbGxcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuICAgICAgICAgICAgfHwgdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uY2x1c2lvbi50b3BMZXZlbCgpWzBdKS5zbGljZSgxKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXNTZXRBbGlhc0NhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXNDYWxsKGNvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm90aGVyKGNvbnRleHQpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHNldEFsaWFzQ2FsbChjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXSAvL1RPRE8gKCFBU1NVTUUhKSBzYW1lIGFzIHRvcCBpbiBjb25jbHVzaW9uXG4gICAgICAgIGNvbnN0IGFsaWFzID0gdGhpcy5jb25kaXRpb24uZ2V0T3duZXJzaGlwQ2hhaW4odG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMuY29uY2x1c2lvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IGNvbmNlcHROYW1lID0gYWxpYXMubWFwKHggPT4gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUoeClbMF0pIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmUgbmFtZVxuICAgICAgICBjb25zdCBwcm9wc05hbWVzID0gcHJvcHMubWFwKHggPT4gdGhpcy5jb25jbHVzaW9uLmRlc2NyaWJlKHgpWzBdKSAvLyBzYW1lIC4uLlxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG4gICAgICAgIGNvbnN0IHByb3RvID0gZ2V0UHJvdG8ocHJvdG9OYW1lKVxuXG4gICAgICAgIGNvbnN0IG9sZFR5cGUgPSBwcm9wc05hbWVzWzBdLnR5cGVcbiAgICAgICAgY29uc3QgdHlwZSA9IG9sZFR5cGUgPz8gJ25vdW4nXG4gICAgICAgIGNvbnN0IG5ld0xleGVtZSA9IHsgLi4uY29uY2VwdE5hbWVbMF0sIHR5cGU6IHR5cGUgfVxuXG4gICAgICAgIGNvbnRleHQuY29uZmlnLnNldExleGVtZShuZXdMZXhlbWUpXG4gICAgICAgIHdyYXAoZ2V0UmFuZG9tSWQoKSwgcHJvdG8pLnNldEFsaWFzKG5ld0xleGVtZSwgcHJvcHNOYW1lcylcbiAgICB9XG5cbiAgICBvdGhlcihjb250ZXh0OiBDb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF1cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUodG9wKVswXVxuICAgICAgICBjb25zdCB5ID0gY29udGV4dC5lbnZpcm8ucXVlcnkoY2xhdXNlT2YocHJvdG9OYW1lLCAnWCcpKVxuICAgICAgICBjb25zdCBpZHMgPSB5Lm1hcChtID0+IG1bJ1gnXSlcbiAgICAgICAgaWRzLmZvckVhY2goaWQgPT4gY29udGV4dC5lbnZpcm8uZ2V0KGlkKT8uc2V0KHByZWRpY2F0ZSkpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGlvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBhcmdzID0gKHRoaXMuY2xhdXNlLmFyZ3MgPz8gW10pXG4gICAgICAgICAgICAubWFwKGEgPT4gbG9va3VwKGEsIGNvbnRleHQsIHRoaXMudG9wTGV2ZWwsIHRoaXMuY2xhdXNlLmV4YWN0SWRzKSlcblxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcblxuICAgICAgICBpZiAoIWFyZ3MgfHwgIXByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gY29udGV4dC5lbnZpcm8uZ2V0KGFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGNvbnRleHQuZW52aXJvLmdldChhcmdzWzFdKVxuXG4gICAgICAgIHJldHVybiBzdWJqZWN0Py5jYWxsKHByZWRpY2F0ZSwgW29iamVjdF0pXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCJcbmltcG9ydCB7IGlzQ29uY2VwdCB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IENvbmNlcHRBY3Rpb24gZnJvbSBcIi4vQ29uY2VwdEFjdGlvblwiXG5pbXBvcnQgQ3JlYXRlQWN0aW9uIGZyb20gXCIuL0NyZWF0ZUFjdGlvblwiXG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCJcbmltcG9ydCBSZWxhdGlvbkFjdGlvbiBmcm9tIFwiLi9SZWxhdGlvbkFjdGlvblwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbihjbGF1c2U6IENsYXVzZSwgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgLy8gcmVsYXRpb25zIChtdWx0aSBhcmcgcHJlZGljYXRlcykgZXhjZXB0IGZvciAnb2YnIFxuICAgIGlmIChjbGF1c2UuYXJncyAmJiBjbGF1c2UuYXJncy5sZW5ndGggPiAxICYmIGNsYXVzZS5wcmVkaWNhdGUgJiYgY2xhdXNlLnByZWRpY2F0ZS5yb290ICE9PSAnb2YnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpb25BY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICAvLyBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiAoVE9ETzogcmVtb3ZlKVxuICAgIGlmIChjbGF1c2UuZXhhY3RJZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgLy8gdG8gY3JlYXRlIG5ldyBjb25jZXB0IG9yIG5ldyBpbnN0YW5jZSB0aGVyZW9mXG4gICAgaWYgKGNsYXVzZS5hcmdzICYmIHRvcExldmVsLnJoZW1lLmRlc2NyaWJlKGNsYXVzZS5hcmdzWzBdKS5zb21lKHggPT4gaXNDb25jZXB0KHgpKSkgeyAvLyBcbiAgICAgICAgcmV0dXJuIG5ldyBDb25jZXB0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5wcmVkaWNhdGU/LnByb3RvKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAoaWQ6IElkLCBjb250ZXh0OiBDb250ZXh0LCB0b3BMZXZlbDogQ2xhdXNlLCBleGFjdElkczogYm9vbGVhbikgeyAvLyBiYXNlZCBvbiB0aGVtZSBpbmZvIG9ubHlcblxuICAgIGlmIChleGFjdElkcykge1xuICAgICAgICByZXR1cm4gaWRcbiAgICB9XG5cbiAgICBjb25zdCBxID0gdG9wTGV2ZWwudGhlbWUuYWJvdXQoaWQpXG4gICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KHEpXG4gICAgY29uc3QgcmVzID0gbWFwcz8uWzBdPy5baWRdIC8vVE9ETyBjb3VsZCBiZSB1bmRlZmluZWRcbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBY3R1YXRvciBpbXBsZW1lbnRzIEFjdHVhdG9yIHtcblxuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgY2xhdXNlLnRvQWN0aW9uKGNsYXVzZSkuZm9yRWFjaChhID0+IGEucnVuKGNvbnRleHQpKVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4vdG9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnN0YXJ0dXBDb21tYW5kcy5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0LmNvbmZpZykucGFyc2VBbGwoKS5tYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmNvbmZpZy5zZXRTeW50YXgoYXN0IGFzIGFueSlcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gdG9DbGF1c2UoYXN0KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWN0dWF0b3IudGFrZUFjdGlvbihjbGF1c2UsIHRoaXMuY29udGV4dClcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLmNvbnRleHQuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBtYXBzLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdHMgPSBpZHMubWFwKGlkID0+IHRoaXMuY29udGV4dC5lbnZpcm8uZ2V0KGlkKSlcblxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5lbnZpcm8udmFsdWVzLmZvckVhY2gobyA9PiBvLnBvaW50T3V0KHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICBvYmplY3RzLmZvckVhY2gobyA9PiBvPy5wb2ludE91dCgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RzLm1hcChvID0+IG8/Lm9iamVjdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBHZXRDb250ZXh0T3B0cywgZ2V0TmV3Q29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEJyYWluT3B0cyBleHRlbmRzIEdldENvbnRleHRPcHRzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4ob3B0czogR2V0QnJhaW5PcHRzKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbihnZXROZXdDb250ZXh0KG9wdHMpKVxufVxuIiwiaW1wb3J0IHsgQ29uZmlnLCBnZXRDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuaW1wb3J0IGdldEVudmlybywgeyBFbnZpcm8sIEdldEVudmlyb09wcyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCB7XG4gICAgcmVhZG9ubHkgZW52aXJvOiBFbnZpcm9cbiAgICByZWFkb25seSBjb25maWc6IENvbmZpZ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRPcHRzIGV4dGVuZHMgR2V0RW52aXJvT3BzIHsgfVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3Q29udGV4dChvcHRzOiBHZXRDb250ZXh0T3B0cyk6IENvbnRleHQge1xuICAgIHJldHVybiB7XG4gICAgICAgIGVudmlybzogZ2V0RW52aXJvKG9wdHMpLFxuICAgICAgICBjb25maWc6IGdldENvbmZpZygpXG4gICAgfVxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQsIGlzVmFyLCB0b0NvbnN0LCB0b1ZhciB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBnZXRBbmFwaG9yYSB9IGZyb20gXCIuLi9lbnZpcm8vQW5hcGhvcmFcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuXG5cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXN0IGlzIHVuZGVmaW5lZCFgKVxuICAgIH1cblxuICAgIGxldCByZXN1bHRcblxuICAgIGlmIChhc3QudHlwZSA9PT0gJ25vdW4gcGhyYXNlJykge1xuICAgICAgICByZXN1bHQgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8ucmVscHJvbikge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5wcmVwb3NpdGlvbikge1xuICAgICAgICByZXN1bHQgPSBjb21wbGVtZW50VG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8uc3ViamVjdCAmJiBhc3Q/LmxpbmtzLnByZWRpY2F0ZSkge1xuICAgICAgICByZXN1bHQgPSBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSAnYW5kIHNlbnRlbmNlJykge1xuICAgICAgICByZXN1bHQgPSBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC5saW5rcz8uc3ViamVjdCAmJiBhc3QubGlua3Mub2JqZWN0KSB7XG4gICAgICAgIHJlc3VsdCA9IG12ZXJiU2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMSA9IG1ha2VBbGxWYXJzKHJlc3VsdClcbiAgICAgICAgY29uc3QgYzIgPSByZXNvbHZlQW5hcGhvcmEoYzEpXG4gICAgICAgIGNvbnN0IGMzID0gcHJvcGFnYXRlVmFyc093bmVkKGMyKVxuICAgICAgICByZXR1cm4gYzNcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3QudHlwZX0nIWApXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlPy5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5jb3B5KHsgbmVnYXRlOiAhIWNvcHVsYVNlbnRlbmNlPy5saW5rcz8ubmVnYXRpb24gfSlcbiAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLnNvbWUoZSA9PiBpc1ZhcihlKSkgPyAgLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgc3ViamVjdC5pbXBsaWVzKHByZWRpY2F0ZSkgOlxuICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdC5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShjb3B1bGFTdWJDbGF1c2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlPy5saW5rcz8ucHJlZGljYXRlIC8vYXMgQ29tcG9zaXRlTm9kZTxDb21wb3NpdGVUeXBlPlxuXG4gICAgcmV0dXJuIHRvQ2xhdXNlKHByZWRpY2F0ZSwgeyBzdWJqZWN0OiBhcmdzPy5zdWJqZWN0IH0pXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShjb21wbGVtZW50OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKSAvLz8/ICgoKTogSWQgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBzdWJqZWN0IGlkJykgfSkoKVxuICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBjb21wbGVtZW50Py5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZVxuXG4gICAgaWYgKCFwcmVwb3NpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHByZXBvc2l0aW9uIScpXG4gICAgfVxuXG4gICAgY29uc3Qgbm91blBocmFzZSA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5bJ25vdW4gcGhyYXNlJ11cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZCh0b0NsYXVzZShub3VuUGhyYXNlLCB7IHN1YmplY3Q6IG5ld0lkIH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBub3VuUGhyYXNlPy5saW5rcz8udW5pcXVhbnQgPyB0b1ZhcihtYXliZUlkKSA6IG1heWJlSWRcblxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBub3VuUGhyYXNlPy5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3Qgbm91biA9IG5vdW5QaHJhc2UubGlua3M/LnN1YmplY3RcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5jb21wbGVtZW50Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ViQ2xhdXNlID0gbm91blBocmFzZT8ubGlua3M/LnN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG4gICAgICAgICAgICAuY29uY2F0KG5vdW4/LmxleGVtZSA/IFtub3VuLmxleGVtZV0gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZChjb21wbGVtZW50cy5tYXAoYyA9PiBjID8gdG9DbGF1c2UoYywgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkgOiBlbXB0eUNsYXVzZSgpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKHN1YkNsYXVzZSA/IHRvQ2xhdXNlKHN1YkNsYXVzZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkgOiBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBhc3N1bWUgaWRzIGFyZSBjYXNlIGluc2Vuc2l0aXZlLCBhc3N1bWUgaWYgSURYIGlzIHZhciBhbGwgaWR4IGFyZSB2YXJcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gfSlcblxufVxuXG5mdW5jdGlvbiByZXNvbHZlQW5hcGhvcmEoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgaWYgKGNsYXVzZS5yaGVtZS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UoKS5oYXNoQ29kZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgY29uc3QgYSA9IGdldEFuYXBob3JhKClcbiAgICBhLmFzc2VydChjbGF1c2UudGhlbWUpXG4gICAgY29uc3QgbSA9IGEucXVlcnkoY2xhdXNlLnJoZW1lKVswXVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSA/PyB7fSB9KVxufVxuXG5mdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Ugey8vIGFzc3VtZSBhbnl0aGluZyBvd25lZCBieSBhIHZhcmlhYmxlIGlzIGFsc28gYSB2YXJpYWJsZVxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG5cblxuZnVuY3Rpb24gYW5kU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbGVmdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8ubGVmdCwgYXJncylcbiAgICBjb25zdCByaWdodCA9IHRvQ2xhdXNlKGFzdD8ubGlua3M/LnJpZ2h0Py5saXN0Py5bMF0sIGFyZ3MpXG5cbiAgICBpZiAoYXN0LmxpbmtzPy5sZWZ0Py50eXBlID09PSAnY29wdWxhIHNlbnRlbmNlJykge1xuICAgICAgICByZXR1cm4gbGVmdC5hbmQocmlnaHQpLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG0gPSB7IFtyaWdodC5lbnRpdGllc1swXV06IGxlZnQuZW50aXRpZXNbMF0gfVxuICAgICAgICBjb25zdCB0aGVtZSA9IGxlZnQudGhlbWUuYW5kKHJpZ2h0LnRoZW1lKVxuICAgICAgICBjb25zdCByaGVtZSA9IHJpZ2h0LnJoZW1lLmFuZChyaWdodC5yaGVtZS5jb3B5KHsgbWFwOiBtIH0pKVxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG4gICAgfVxuXG59XG5cblxuZnVuY3Rpb24gbXZlcmJTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqSWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBvYmpJZCA9IGdldFJhbmRvbUlkKClcblxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViaklkIH0pXG4gICAgY29uc3Qgb2JqZWN0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5vYmplY3QsIHsgc3ViamVjdDogb2JqSWQgfSlcbiAgICBjb25zdCBtdmVyYiA9IGFzdC5saW5rcz8ubXZlcmI/LmxleGVtZVxuXG4gICAgaWYgKCFtdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIG12ZXJiIGluIG12ZXJiIHNlbnRlbmNlIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZihtdmVyYiwgc3ViaklkLCBvYmpJZClcbiAgICAgICAgLmNvcHkoeyBuZWdhdGU6ICEhYXN0LmxpbmtzLm5lZ2F0aW9uIH0pXG5cbiAgICBjb25zdCByZXMgPSBzdWJqZWN0XG4gICAgICAgIC5hbmQob2JqZWN0KVxuICAgICAgICAuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi9nZXRUb3BMZXZlbE93bmVyT2ZcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkuY29uY2F0KHRoaXMuY2xhdXNlMi50b0FjdGlvbih0b3BMZXZlbCkpXG4gICAgfVxuXG4gICAgZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCk6IElkIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIGdldFRvcExldmVsT3duZXJPZihpZCwgdGhpcylcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIC8vIHV0aWxpdHkgZnVuY3NcbiAgICAgICAgY29uc3QgcmFuZ2UgPSAobjogbnVtYmVyKSA9PiBbLi4ubmV3IEFycmF5KG4pLmtleXMoKV1cbiAgICAgICAgY29uc3QgdW5pcSA9ICh4OiBhbnlbXSkgPT4gQXJyYXkuZnJvbShuZXcgU2V0KHgpKVxuXG4gICAgICAgIC8vIGVhY2ggZW50aXR5IGluIHRoZSBxdWVyeSBzaG91bGQgZmluZCBpdHMgZnVsbCBkZXNjcmlwdGlvbixcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoaXNcblxuICAgICAgICBjb25zdCBtdWx0aU1hcDogeyBbaWQ6IElkXTogSWRbXSAvKiBjYW5kaWRhdGVzICovIH0gPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgZSBvZiBxdWVyeS5lbnRpdGllcykge1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGQgb2YgcXVlcnkuYWJvdXQoZSkuZmxhdExpc3QoKSkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcjEgPSB0aGlzLmNsYXVzZTEucXVlcnkoZClcbiAgICAgICAgICAgICAgICBjb25zdCByMiA9IHRoaXMuY2xhdXNlMi5xdWVyeShkKVxuXG4gICAgICAgICAgICAgICAgaWYgKCFyMS5sZW5ndGggJiYgIXIyLmxlbmd0aCkgeyAvLyBlIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlNYXBbZV0gPSBbXVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly8gcHJvYmxlbTogKHgseSx6KSBhbmQgKGEsYixjKSAhLT4gKHgsYixjKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW5kcyA9IHIxLm1hcChtID0+IG1bZV0pLmNvbmNhdChyMi5tYXAobSA9PiBtW2VdKSkuZmlsdGVyKGlkID0+IGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIG11bHRpTWFwW2VdID0gdW5pcShbLi4ubXVsdGlNYXBbZV0gPz8gW10sIC4uLmNhbmRzXSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF4U2l6ZSA9IE1hdGgubWF4KC4uLk9iamVjdC52YWx1ZXMobXVsdGlNYXApLm1hcCh4ID0+IHgubGVuZ3RoKSlcblxuICAgICAgICBjb25zdCByZXMgPSByYW5nZShtYXhTaXplKS5tYXAoaSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IG06IE1hcCA9IHF1ZXJ5LmVudGl0aWVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IG11bHRpTWFwW2VdW2ldICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgLm1hcChlID0+ICh7IFtlXTogbXVsdGlNYXBbZV1baV0gfSkpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgICAgIHJldHVybiBtXG5cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGdldFRvcExldmVsT3duZXJPZiB9IGZyb20gXCIuL2dldFRvcExldmVsT3duZXJPZlwiO1xuaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbZ2V0QWN0aW9uKHRoaXMsIHRvcExldmVsKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzKSlcbiAgICB9XG5cbiAgICBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkKTogSWQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gZ2V0VG9wTGV2ZWxPd25lck9mKGlkLCB0aGlzKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10geyAvLyBhbGwgaWRzIHRyZWF0ZWQgYXMgdmFyc1xuXG4gICAgICAgIGlmICghKGNsYXVzZSBpbnN0YW5jZW9mIEJhc2ljQ2xhdXNlKSkgeyAvLyBUT0RPOiB3aGF0IGFib3V0IEFuZCBvZiBzYW1lIEJhc2ljQ2xhdXNlXG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGF1c2UucHJlZGljYXRlLnJvb3QgIT09IHRoaXMucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETyB3aGF0IGFib3V0IGV4YWN0IGlkcz9cblxuICAgICAgICBjb25zdCBtYXAgPSBjbGF1c2UuYXJnc1xuICAgICAgICAgICAgLm1hcCgoeCwgaSkgPT4gKHsgW3hdOiB0aGlzLmFyZ3NbaV0gfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKVxuXG4gICAgICAgIHJldHVybiBbbWFwXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCJcbmltcG9ydCB7IEVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcbiAgICByZWFkb25seSBwcmVkaWNhdGU/OiBMZXhlbWVcbiAgICByZWFkb25seSBhcmdzPzogSWRbXVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHk6IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkczogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXVxuICAgIHRvcExldmVsKCk6IElkW11cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXVxuICAgIGdldFRvcExldmVsT3duZXJPZihpZDogSWQpOiBJZCB8IHVuZGVmaW5lZFxuXG5cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6IENsYXVzZSA9PiBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCI7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG90aGVyXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gY29uY2x1c2lvblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGdldFRvcExldmVsT3duZXJPZihpZDogSWQpOiBJZCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG59IiwiLyoqXG4gKiBJZCBvZiBhbiBlbnRpdHkuXG4gKi9cbmV4cG9ydCB0eXBlIElkID0gbnVtYmVyIHwgc3RyaW5nXG5cbi8qKlxuICogSWQgdG8gSWQgbWFwcGluZywgZnJvbSBvbmUgXCJ1bml2ZXJzZVwiIHRvIGFub3RoZXIuXG4gKi9cbmV4cG9ydCB0eXBlIE1hcCA9IHsgW2E6IElkXTogSWQgfVxuXG5cbmZ1bmN0aW9uKiBnZXRJZEdlbmVyYXRvcigpIHtcbiAgICBsZXQgeCA9IDBcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4KytcbiAgICAgICAgeWllbGQgeFxuICAgIH1cbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJZEdlbmVyYXRvcigpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JZChvcHRzPzogR2V0UmFuZG9tSWRPcHRzKTogSWQge1xuICAgIFxuICAgIC8vIGNvbnN0IG5ld0lkID0gYGlkJHtwYXJzZUludCgxMDAwICogTWF0aC5yYW5kb20oKSArICcnKX1gXG5cbiAgICBjb25zdCBuZXdJZCA9IGBpZCR7aWRHZW5lcmF0b3IubmV4dCgpLnZhbHVlfWBcblxuICAgIHJldHVybiBvcHRzPy5hc1ZhciA/IHRvVmFyKG5ld0lkKSA6IG5ld0lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0UmFuZG9tSWRPcHRzIHtcbiAgICBhc1ZhcjogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXIoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvVXBwZXJDYXNlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFyKGU6IElkKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIoZSkpICYmIChlLnRvU3RyaW5nKClbMF0gPT09IGUudG9TdHJpbmcoKVswXS50b1VwcGVyQ2FzZSgpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKVxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBJbXBseUFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9JbXBseUFjdGlvblwiO1xuaW1wb3J0IHsgZ2V0VG9wTGV2ZWxPd25lck9mIH0gZnJvbSBcIi4vZ2V0VG9wTGV2ZWxPd25lck9mXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgdGhlbWUgPSBjb25kaXRpb24sXG4gICAgICAgIHJlYWRvbmx5IHJoZW1lID0gY29uc2VxdWVuY2UpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNvbnNlcXVlbmNlLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLmVudGl0aWVzKVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uc2VxdWVuY2UudG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbnNlcXVlbmNlLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnNlcXVlbmNlLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgSW1wbHlBY3Rpb24odGhpcy5jb25kaXRpb24sIHRoaXMuY29uc2VxdWVuY2UpXVxuICAgIH1cblxuICAgIGdldFRvcExldmVsT3duZXJPZihpZDogSWQpOiBJZCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBnZXRUb3BMZXZlbE93bmVyT2YoaWQsIHRoaXMpXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgLy8gaWYgKCEoY2xhdXNlIGluc3RhbmNlb2YgSW1wbHkpKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gW11cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIGlmIChjbGF1c2UuY29uZGl0aW9uLnByZWRpY2F0ZSAhPT0gdGhpcy5jb25kaXRpb24ucHJlZGljYXRlIHx8XG4gICAgICAgIC8vICAgICBjbGF1c2UuY29uc2VxdWVuY2UucHJlZGljYXRlICE9PSB0aGlzLmNvbnNlcXVlbmNlLnByZWRpY2F0ZSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIFtdXG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyAvLyB0aGlzLmNvbmRpdGlvbi5xdWVyeShjbGF1c2UuY29uZGl0aW9uKVxuXG4gICAgICAgIC8vVE9ETyFcblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCwgdG9wTGV2ZWw6IENsYXVzZSk6IElkIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG93bmVycyA9IHRvcExldmVsLm93bmVyc09mKGlkKVxuXG4gICAgY29uc3QgbWF5YmUgPSBvd25lcnNcbiAgICAgICAgLmZpbHRlcihvID0+IHRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXMobykpLmF0KDApXG5cbiAgICBpZiAoIW1heWJlICYmIG93bmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBnZXRUb3BMZXZlbE93bmVyT2Yob3duZXJzWzBdLCB0b3BMZXZlbClcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWF5YmVcbiAgICB9XG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29uZmlnIGltcGxlbWVudHMgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICBwcm90ZWN0ZWQgX2xleGVtZXM6IExleGVtZVtdLFxuICAgICAgICByZWFkb25seSBzeW50YXhNYXA6IFN5bnRheE1hcCxcbiAgICAgICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSxcbiAgICAgICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSkge1xuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG5cbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcblxuICAgICAgICAvLyByZXR1cm4gW1xuICAgICAgICAvLyAgICAgJ21hY3JvJyxcbiAgICAgICAgLy8gICAgICdtYWNyb3BhcnQnLFxuICAgICAgICAvLyAgICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAgICAgLy8gICAgICdhbmQgc2VudGVuY2UnLFxuICAgICAgICAvLyAgICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgIC8vICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgLy8gICAgICdub3VuIHBocmFzZSddXG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSkge1xuICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgc3RhcnR1cENvbW1hbmRzIH0gZnJvbSBcIi4vc3RhcnR1cENvbW1hbmRzXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLCBzeW50YXhlcyB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSlcbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAndGhlbicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAge1xuICAgICAgICByb290OiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEJ1dHRvbkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xpc3QnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnQXJyYXknXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnY2xpY2snXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGlja2VkJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGRlcml2ZWRGcm9tOiAnY2xpY2snXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZXNzZWQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgYWxpYXNGb3I6ICdjbGlja2VkJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjYXQnLFxuICAgICAgICB0eXBlOiAnbm91bidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmUnLFxuICAgICAgICB0eXBlOiAnY29wdWxhJyxcbiAgICAgICAgZm9ybXM6IFsnaXMnLCAnYXJlJ10sXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiaXNuJ3RcIixcbiAgICAgICAgdHlwZTogJ2NvbnRyYWN0aW9uJyxcbiAgICAgICAgY29udHJhY3Rpb25Gb3I6IFsnaXMnLCAnbm90J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWUsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVkaWNhdGUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpdCcsXG4gICAgICAgIHR5cGU6ICdwcm9ub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25jZXB0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBjb25jZXB0czogWydjb25jZXB0J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbGVmdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3JpZ2h0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9XG5dXG5cbi8qKlxuICogR3JhbW1hclxuICovXG5jb25zdGl0dWVudFR5cGVzLmNvbmNhdChsZXhlbWVUeXBlcyBhcyBhbnkpLmZvckVhY2goZyA9PiB7XG4gICAgbGV4ZW1lcy5wdXNoKHtcbiAgICAgICAgcm9vdDogZyxcbiAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgfSlcbn0pIiwiZXhwb3J0IGNvbnN0IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10gPSBbXG5cbiAgICAvLyBncmFtbWFyXG4gICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgJ2FydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0JyxcbiAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW4gcGhyYXNlJyxcblxuICAgIGBjb3B1bGEgc2VudGVuY2UgaXMgc3ViamVjdCBub3VuIHBocmFzZSBcbiAgICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICAgIHRoZW4gcHJlZGljYXRlIG5vdW4gcGhyYXNlYCxcblxuICAgIGBub3VuIHBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIGFydGljbGUgXG4gICAgICAgIHRoZW4gemVybyAgb3IgIG1vcmUgYWRqZWN0aXZlcyBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBtdmVyYiBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgXG4gICAgICAgIHRoZW4gemVybyBvciBtb3JlIGNvbXBsZW1lbnRzIGAsXG5cbiAgICAnY29wdWxhc3ViY2xhdXNlIGlzIHJlbHByb24gdGhlbiBjb3B1bGEgdGhlbiBub3VuIHBocmFzZScsXG4gICAgJ3N1YmNsYXVzZSBpcyBjb3B1bGFzdWJjbGF1c2UnLFxuXG4gICAgYGFuZCBzZW50ZW5jZSBpcyBsZWZ0IGNvcHVsYSBzZW50ZW5jZSBvciBub3VuIHBocmFzZSBcbiAgICAgICAgdGhlbiBub25zdWJjb25qXG4gICAgICAgIHRoZW4gb25lIG9yIG1vcmUgcmlnaHQgYW5kIHNlbnRlbmNlIG9yIGNvcHVsYSBzZW50ZW5jZSBvciBub3VuIHBocmFzZWAsXG5cbiAgICAvLyBkb21haW5cbiAgICAnY29sb3IgaXMgYSBjb25jZXB0JyxcbiAgICAncmVkIGFuZCBibHVlIGFuZCBibGFjayBhbmQgZ3JlZW4gYXJlIGNvbG9ycycsXG4gICAgJ2NvbG9yIG9mIGFueSBidXR0b24gaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBidXR0b24nLFxuICAgICd0ZXh0IG9mIGFueSBidXR0b24gaXMgdGV4dENvbnRlbnQgb2YgYnV0dG9uJyxcbl0iLCJpbXBvcnQgeyBSb2xlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCB7IEVsZW1lbnRUeXBlLCBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz47XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgJ25vdW4gcGhyYXNlJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ3N1YmNsYXVzZScsXG4gICAgJ2FuZCBzZW50ZW5jZScsXG4gICAgJ212ZXJiIHNlbnRlbmNlJ1xuKVxuXG5leHBvcnQgY29uc3Qgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSA9IFtcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG5dXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgLy8gcGVybWFuZW50XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bicsICdncmFtbWFyJ10sIG51bWJlcjogMSwgcm9sZTogJ25vdW4nIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2dyYW1tYXInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ3N1YmNsYXVzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnbm91biBwaHJhc2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG5cbiAgICBdLFxuXG4gICAgJ2NvcHVsYSBzZW50ZW5jZSc6IFtcblxuICAgIF0sXG5cbiAgICAnYW5kIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdtdmVyYiBzZW50ZW5jZSc6IFsgLy9UT0RPOiBjb21wbGVtZW50c1xuICAgICAgICB7IHR5cGU6IFsnbm91biBwaHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2h2ZXJiJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ212ZXJiJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91biBwaHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnb2JqZWN0JyB9XG4gICAgXVxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbmV4cG9ydCB0eXBlIEVsZW1lbnRUeXBlPFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PHVua25vd24+PiA9IFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PGluZmVyIEVsZW1lbnRUeXBlPiA/IEVsZW1lbnRUeXBlIDogbmV2ZXI7XG4iLCJpbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgZ2V0TmV3Q29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCJcblxuZXhwb3J0IGludGVyZmFjZSBBbmFwaG9yYSB7XG4gICAgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogdm9pZFxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFuYXBob3JhKCkge1xuICAgIHJldHVybiBuZXcgRW52aXJvQW5hcGhvcmEoKVxufVxuXG5jbGFzcyBFbnZpcm9BbmFwaG9yYSBpbXBsZW1lbnRzIEFuYXBob3JhIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0ID0gZ2V0TmV3Q29udGV4dCh7IHJvb3Q6IHVuZGVmaW5lZCB9KSkge1xuXG4gICAgfVxuXG4gICAgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKSB7XG4gICAgICAgIGdldEFjdHVhdG9yKCkudGFrZUFjdGlvbihjbGF1c2UuY29weSh7IGV4YWN0SWRzOiB0cnVlIH0pLCB0aGlzLmNvbnRleHQpXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5pbXBvcnQgeyBQbGFjZWhvbGRlciB9IGZyb20gXCIuL1BsYWNlaG9sZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsXG4gICAgICAgIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBXcmFwcGVyKTogV3JhcHBlciB7XG5cbiAgICAgICAgaWYgKCFvYmplY3QpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBuZXcgUGxhY2Vob2xkZXIoaWQpXG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG5cbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlciAmJiBwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5wcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zZXQocClcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICAvL1RPRE8gdGhpcyBpcyBhIHRtcCBzb2x1dGlvbiwgZm9yIGFuYXBob3JhIHJlc29sdXRpb24sIGJ1dCBqdXN0IHdpdGggZGVzY3JpcHRpb25zLCB3aXRob3V0IHRha2luZyAobXVsdGktZW50aXR5KSByZWxhdGlvbnNoaXBzIGludG8gYWNjb3VudFxuICAgICAgICAvL1RPRE86IGFmdGVyIFwiZXZlcnkgLi4uXCIgc2VudGVuY2UsIFwiaXRcIiBzaG91bGQgYmUgdW5kZWZpbmVkXG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiAoeyBlOiB4WzBdLCB3OiB4WzFdIH0pKVxuXG5cbiAgICAgICAgY29uc3QgcXVlcnkgPSBjbGF1c2UgLy8gZGVzY3JpYmVkIGVudGl0aWVzXG4gICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgIC5tYXAoZSA9PiAoeyBlLCBkZXNjOiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSkgfSkpXG5cbiAgICAgICAgY29uc3QgZ2V0SXQgPSAoKSA9PiB0aGlzLmxhc3RSZWZlcmVuY2VkID8gW3sgZTogdGhpcy5sYXN0UmVmZXJlbmNlZCBhcyBzdHJpbmcsIHc6IHRoaXMuZGljdGlvbmFyeVt0aGlzLmxhc3RSZWZlcmVuY2VkXSB9XSA6IFtdXG5cbiAgICAgICAgY29uc3QgcmVzID0gcXVlcnlcbiAgICAgICAgICAgIC5mbGF0TWFwKHEgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSB1bml2ZXJzZVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHUgPT4gcS5kZXNjLmxlbmd0aCA+IDAgJiYgcS5kZXNjLmV2ZXJ5KGQgPT4gdS53LmlzKGQpKSlcbiAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChxLmRlc2MuZmluZCh4ID0+IHgudHlwZSA9PSAncHJvbm91bicpID8gZ2V0SXQoKSA6IFtdKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZnJvbTogcS5lLCB0bzogdG8gfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHJlc1NpemUgPSBNYXRoLm1heCguLi5yZXMubWFwKHEgPT4gcS50by5sZW5ndGgpKTtcbiAgICAgICAgY29uc3QgZnJvbVRvVG8gPSAoZnJvbTogSWQpID0+IHJlcy5maWx0ZXIoeCA9PiB4LmZyb20gPT09IGZyb20pWzBdLnRvLm1hcCh4ID0+IHguZSk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gKG46IG51bWJlcikgPT4gWy4uLm5ldyBBcnJheShuKS5rZXlzKCldXG5cbiAgICAgICAgY29uc3QgcmVzMiA9IHJhbmdlKHJlc1NpemUpLm1hcChpID0+XG4gICAgICAgICAgICBjbGF1c2VcbiAgICAgICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZyb20gPT4gZnJvbVRvVG8oZnJvbSkubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAubWFwKGZyb20gPT4gKHsgW2Zyb21dOiBmcm9tVG9Ubyhmcm9tKVtpXSA/PyBmcm9tVG9Ubyhmcm9tKVswXSB9KSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKSlcblxuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gcmVzMi5mbGF0TWFwKHggPT4gT2JqZWN0LnZhbHVlcyh4KSkuYXQoLTEpID8/IHRoaXMubGFzdFJlZmVyZW5jZWRcblxuICAgICAgICByZXR1cm4gcmVzMiAvLyByZXR1cm4gbGlzdCBvZiBtYXBzLCB3aGVyZSBlYWNoIG1hcCBzaG91bGQgc2hvdWxkIGhhdmUgQUxMIGlkcyBmcm9tIGNsYXVzZSBpbiBpdHMga2V5cywgZWc6IFt7aWQyOmlkMSwgaWQ0OmlkM30sIHtpZDI6MSwgaWQ0OjN9XS5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBzaW1wbGVDb25jZXB0czogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHsgcGF0aDogc3RyaW5nW10sIGxleGVtZTogTGV4ZW1lIH0gfSA9IG9iamVjdC5zaW1wbGVDb25jZXB0cyA/PyB7fSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlUHJlZGljYXRlczogTGV4ZW1lW10gPSBbXSkge1xuXG4gICAgICAgIG9iamVjdC5zaW1wbGVDb25jZXB0cyA9IHNpbXBsZUNvbmNlcHRzXG4gICAgICAgIG9iamVjdC5zaW1wbGVQcmVkaWNhdGVzID0gc2ltcGxlUHJlZGljYXRlc1xuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPiAxKSB7IC8vIGFzc3VtZSA+IDEgcHJvcHMgYXJlIGEgcGF0aFxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMubWFwKHggPT4geC5yb290KSwgcHJlZGljYXRlLnJvb3QpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbmdsZVByb3AocHJlZGljYXRlLCBwcm9wcylcbiAgICAgICAgfSBlbHNlIGlmICghcHJvcHMgfHwgcHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFplcm9Qcm9wcyhwcmVkaWNhdGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMClcblxuICAgICAgICByZXR1cm4gY29uY2VwdCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRdLnBhdGgpID09PSBwcmVkaWNhdGUucm9vdCA6XG4gICAgICAgICAgICB0aGlzLnNpbXBsZVByZWRpY2F0ZXMubWFwKHggPT4geC5yb290KS5pbmNsdWRlcyhwcmVkaWNhdGUucm9vdClcblxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHROYW1lLnJvb3RdID0geyBwYXRoOiBwcm9wUGF0aC5tYXAoeCA9PiB4LnJvb3QpLCBsZXhlbWU6IGNvbmNlcHROYW1lIH1cbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuOyB9KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHtcbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHRoaXMuc2ltcGxlQ29uY2VwdHNbdmVyYi5yb290XT8ucGF0aFxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gY29uY2VwdD8uWzBdID8/IHZlcmIucm9vdFxuICAgICAgICByZXR1cm4gdGhpcz8ub2JqZWN0W21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKHggPT4geC5vYmplY3QpKVxuICAgIH1cblxuICAgIGdldCBjbGF1c2UoKTogQ2xhdXNlIHtcblxuICAgICAgICBjb25zdCBwcmVkczogTGV4ZW1lW10gPSBPYmplY3Qua2V5cyh0aGlzLnNpbXBsZUNvbmNlcHRzKVxuICAgICAgICAgICAgLm1hcChrID0+IHRoaXMuZ2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNba10ucGF0aCkpXG4gICAgICAgICAgICAubWFwKCh4KTogTGV4ZW1lID0+ICh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnNpbXBsZVByZWRpY2F0ZXMpXG5cbiAgICAgICAgY29uc3QgY2xhdXNlID0gcHJlZHNcbiAgICAgICAgICAgIC5tYXAoeCA9PiBjbGF1c2VPZih4LCB0aGlzLmlkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSgpKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2luZ2xlUHJvcChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM6IExleGVtZVtdKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF0ucm9vdF0ucGF0aFxuXG4gICAgICAgIGlmIChwYXRoKSB7IC8vIGlzIGNvbmNlcHQgXG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgfSBlbHNlIHsgLy8gbm90IGNvbmNlcHRcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLm1hcCh4ID0+IHgucm9vdCksIHByZWRpY2F0ZS5yb290KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0WmVyb1Byb3BzKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG5cbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jb25jZXB0cyAmJiBwcmVkaWNhdGUuY29uY2VwdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcmVkaWNhdGUuY29uY2VwdHNbMF1dLnBhdGgsIHByZWRpY2F0ZS5yb290KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaW1wbGVQcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKSAvL1RPRE86IGNoZWNrIGR1cGxpY2F0ZXMhXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHhcblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBnZXQoaWQ6IElkKTogV3JhcHBlciB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIG9iamVjdD86IFdyYXBwZXIpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuXG4gICAgcmVhZG9ubHkgdmFsdWVzOiBXcmFwcGVyW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIlxuXG5leHBvcnQgY2xhc3MgUGxhY2Vob2xkZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZXM6IExleGVtZVtdID0gW10sXG4gICAgICAgIHJlYWRvbmx5IG9iamVjdDogYW55ID0ge30pIHtcblxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSkge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5zb21lKHggPT4geC5yb290ID09IHByZWRpY2F0ZS5yb290KVxuICAgIH1cblxuXG4gICAgZ2V0IGNsYXVzZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGVzXG4gICAgICAgICAgICAubWFwKHAgPT4gY2xhdXNlT2YocCwgdGhpcy5pZCkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UoKSlcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pIHsgfVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkgeyB9XG4gICAgY2FsbCh2ZXJiOiBMZXhlbWUsIGFyZ3M6IFdyYXBwZXJbXSkgeyB9XG5cblxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IENvbmNyZXRlV3JhcHBlciBmcm9tIFwiLi9Db25jcmV0ZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBpZDogSWRcbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHJlYWRvbmx5IGNsYXVzZTpDbGF1c2VcbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIHByb3BzPzogTGV4ZW1lW10pOiB2b2lkXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIC8vIFRPRE8gYXJnc1xuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWRcbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pOiB2b2lkXG4gICAgY2FsbCh2ZXJiOiBMZXhlbWUsIGFyZ3M6IChXcmFwcGVyIHwgdW5kZWZpbmVkKVtdKTogYW55XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAoaWQ6IElkLCBvPzogT2JqZWN0LCBjb250ZXh0PzogQ29udGV4dCk6IFdyYXBwZXIge1xuICAgIGFkZE5ld1ZlcmJzKG8sIGNvbnRleHQpXG4gICAgcmV0dXJuIG5ldyBDb25jcmV0ZVdyYXBwZXIobywgaWQpXG59XG5cblxuZnVuY3Rpb24gYWRkTmV3VmVyYnMob2JqZWN0Pzogb2JqZWN0LCBjb250ZXh0PzogQ29udGV4dCkge1xuXG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBhbGxQcm9wc09mKG9iamVjdClcbiAgICAgICAgcHJvcHMuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgICAgIGlmICghY29udGV4dC5jb25maWcubGV4ZW1lcy5tYXAobCA9PiBsLnJvb3QpLmluY2x1ZGVzKHgpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jb25maWcuc2V0TGV4ZW1lKHsgcm9vdDogeCwgdHlwZTogJ212ZXJiJyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBhbGxQcm9wc09mKHg6IGFueSkge1xuXG4gICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICBsZXQgeSA9IHhcblxuICAgIGRvIHtcbiAgICAgICAgcmVzdWx0LnB1c2goLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoeSkpXG4gICAgfSB3aGlsZSAoKHkgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoeSkpKVxuXG4gICAgcmV0dXJuIHJlc3VsdFxufVxuIiwiaW1wb3J0IG1haW4gZnJvbSBcIi4vbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcbmltcG9ydCBxdWVyeVRlc3RlciBmcm9tIFwiLi90ZXN0cy9xdWVyeVRlc3RlclwiO1xuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgcXVlcnlUZXN0ZXIoKVxuICAgIG1haW4oKVxufSkoKVxuXG4vLyBcbiIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcywgaXNNdWx0aVdvcmQsIExleGVtZSwgcmVzcGFjZSwgc3Rkc3BhY2UsIHVuc3BhY2UgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcpIHtcblxuXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPVxuICAgICAgICAgICAgdGhpcy5qb2luTXVsdGlXb3JkTGV4ZW1lcyhzdGRzcGFjZShzb3VyY2VDb2RlKSwgY29uZmlnLmxleGVtZXMpXG4gICAgICAgICAgICAgICAgLy8gLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gcmVzcGFjZShzKSlcbiAgICAgICAgICAgICAgICAuZmxhdE1hcChzID0+IGdldExleGVtZXMocywgY29uZmlnLmxleGVtZXMpKVxuXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgam9pbk11bHRpV29yZExleGVtZXMoc291cmNlQ29kZTogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWVbXSkge1xuXG4gICAgICAgIGxldCBuZXdTb3VyY2UgPSBzb3VyY2VDb2RlXG5cbiAgICAgICAgbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IGlzTXVsdGlXb3JkKHgpKVxuICAgICAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGV4ZW1lID0gc3Rkc3BhY2UoeC5yb290KVxuICAgICAgICAgICAgICAgIG5ld1NvdXJjZSA9IG5ld1NvdXJjZS5yZXBsYWNlQWxsKGxleGVtZSwgdW5zcGFjZShsZXhlbWUpKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gbmV3U291cmNlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IExleGVtZVR5cGVcbiAgICAvKip1c2VmdWwgZm9yIGlycmVndWxhciBzdHVmZiovIHJlYWRvbmx5IGZvcm1zPzogc3RyaW5nW11cbiAgICAvKipyZWZlcnMgdG8gdmVyYiBjb25qdWdhdGlvbnMgb3IgcGx1cmFsIGZvcm1zLCBhc3N1bWUgcmVndWxhcml0eSovIHJlYWRvbmx5IGlycmVndWxhcj86IGJvb2xlYW5cbiAgICAvKipzZW1hbnRpY2FsIGRlcGVuZGVjZSovIHJlYWRvbmx5IGRlcml2ZWRGcm9tPzogc3RyaW5nXG4gICAgLyoqc2VtYW50aWNhbCBlcXVpdmFsZW5jZSovIHJlYWRvbmx5IGFsaWFzRm9yPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyByZWFkb25seSBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi9yZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIC8qKmZvciBxdWFudGFkaiAqLyByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVhZG9ubHkgY29uY2VwdHM/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHByb3RvPzogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3Jtc09mKGxleGVtZTogTGV4ZW1lKSB7XG5cbiAgICByZXR1cm4gW2xleGVtZS5yb290XS5jb25jYXQobGV4ZW1lPy5mb3JtcyA/PyBbXSlcbiAgICAgICAgLmNvbmNhdCghbGV4ZW1lLmlycmVndWxhciA/IFtgJHtsZXhlbWUucm9vdH1zYF0gOiBbXSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZVtdKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWUgPVxuICAgICAgICBsZXhlbWVzLmZpbHRlcih4ID0+IGZvcm1zT2YoeCkuaW5jbHVkZXMod29yZCkpLmF0KDApXG4gICAgICAgID8/IHsgcm9vdDogd29yZCwgdHlwZTogJ25vdW4nIH1cbiAgICAvLyA/PyB7IHJvb3Q6IHdvcmQsIHR5cGU6ICdhbnknIH1cblxuICAgIGNvbnN0IGxleGVtZTI6IExleGVtZSA9IHsgLi4ubGV4ZW1lLCB0b2tlbjogd29yZCB9XG5cbiAgICByZXR1cm4gbGV4ZW1lMi5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleGVtZTIuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgbGV4ZW1lcykpIDpcbiAgICAgICAgW2xleGVtZTJdXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3RvKGxleGVtZTogTGV4ZW1lKTogT2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpPy5bbGV4ZW1lLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25jZXB0KGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZS5jb25jZXB0cz8uaW5jbHVkZXMoJ2NvbmNlcHQnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNNdWx0aVdvcmQobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICByZXR1cm4gbGV4ZW1lLnJvb3QuaW5jbHVkZXMoJyAnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5zcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnICcsICctJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJy0nLCAnICcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGRzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpXG59IiwiaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOiBDb25maWcpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb25maWcpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29uZmlnLnN5bnRheExpc3QpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUpIHtcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb25maWcuZ2V0U3ludGF4KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNMZWFmKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG1lbWJlcnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOiBDb25maWcpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb25maWcpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFN5bnRheCwgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFjcm9Ub1N5bnRheChtYWNybzogQXN0Tm9kZSk6IHsgbmFtZTogc3RyaW5nLCBzeW50YXg6IFN5bnRheCB9IHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8ubm91bj8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApOiBBc3RUeXBlW10ge1xuXG4gICAgY29uc3QgeCA9IChzeW50YXhlc1thXSA/PyBbXSkuZmxhdE1hcChtID0+IG0udHlwZSlcbiAgICByZXR1cm4geFxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMCxcbiAgICB0ZXN0MTEsXG4gICAgdGVzdDEyLFxuICAgIHRlc3QxMyxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2codGVzdCgpID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnLCB0ZXN0Lm5hbWUpXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMClcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IChicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IChicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuXG5mdW5jdGlvbiB0ZXN0NygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ3knKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gKGJyYWluLmV4ZWN1dGUoJ3onKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgncmVkJykpLmxlbmd0aCA9PT0gMFxuICAgIGNvbnN0IGFzc2VydDIgPSAoYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKSkubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MTAoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0MTEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFuZCB6IGFuZCB3IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3cgYW5kIHogYXJlIGJsYWNrJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneScpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDQgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0MyAmJiBhc3NlcnQ0XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEyKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhcHBlbmRDaGlsZHMgeScpXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmNoaWxkcmVuKS5pbmNsdWRlcyhicmFpbi5leGVjdXRlKCd5JylbMF0pXG59XG5cbmZ1bmN0aW9uIHRlc3QxMygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24gYW5kIGl0IGlzIGdyZWVuJylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbn1cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJydcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnd2hpdGUnXG59IiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4uL2JyYWluL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcXVlcnlUZXN0ZXIoKSB7XG5cbiAgICBjb25zdCAkID0gKHM6IHN0cmluZyk6IExleGVtZSA9PiAoeyByb290OiBzLCB0eXBlOiAnbm91bicgfSlcblxuICAgIC8vIGxldCBrYiA9IGNsYXVzZU9mKCQoJ2NhdCcpLCAwKVxuICAgIC8vICAgICAuYW5kKGNsYXVzZU9mKCQoJ2JsYWNrJyksIDApLCB7IGFzUmhlbWU6IHRydWUgfSlcblxuICAgIC8vIGtiID0ga2JcbiAgICAvLyAgICAgLmFuZChrYi5jb3B5KHsgbWFwOiB7IDA6IDEgfSB9KSlcbiAgICAvLyAgICAgLmFuZChjbGF1c2VPZigkKCdjYXByYScpLCAyMDApKVxuXG4gICAgLy8gY29uc3QgcXVlcnkgPSBjbGF1c2VPZigkKCdjYXQnKSwgJ0lEMTAwJylcbiAgICAvLyAgICAgLmFuZChjbGF1c2VPZigkKCdibGFjaycpLCAnSUQxMDAnKSwgeyBhc1JoZW1lOiB0cnVlIH0pXG4gICAgLy8gICAgIC5hbmQoY2xhdXNlT2YoJCgnY2FwcmEnKSwgNjAwKSlcblxuXG4gICAgbGV0IGtiID0gY2xhdXNlT2YoJCgnb2YnKSwgMCwgMSlcbiAgICAgICAgLmFuZChjbGF1c2VPZigkKCdvZicpLCAyLCAzKSlcblxuICAgIGNvbnN0IHF1ZXJ5ID0gY2xhdXNlT2YoJCgnb2YnKSwgJ09XTkVEJywgJ09XTkVSJylcblxuICAgIGNvbnNvbGUubG9nKGtiLnRvU3RyaW5nKCkpXG4gICAgY29uc29sZS5sb2cocXVlcnkudG9TdHJpbmcoKSlcbiAgICBjb25zdCByZXMgPSBrYi5xdWVyeShxdWVyeSlcbiAgICBjb25zb2xlLmxvZyhyZXMpXG5cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9