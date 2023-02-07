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
            const newObj = (0, Wrapper_1.wrap)(id, o);
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
        obj.set(predicate, { props, negated: this.clause.negated });
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
    constructor(clause, condition = clause.theme, conclusion = clause.rheme) {
        this.clause = clause;
        this.condition = condition;
        this.conclusion = conclusion;
    }
    run(context) {
        const isSetAliasCall = // assume if "of" in condition AND conclusion that it's a set alias call
         this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
            && this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length;
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
        (0, Wrapper_1.wrap)((0, Id_1.getRandomId)(), proto).setAlias(conceptName[0], propsNames);
    }
    other(context) {
        const top = this.condition.topLevel()[0];
        const protoName = this.condition.describe(top)[0]; // assume one 
        const predicate = this.conclusion.describe(top)[0];
        const y = context.enviro.query((0, Clause_1.clauseOf)(protoName, 'X'));
        const ids = y.map(m => m['X']);
        ids.forEach(id => { var _a; return (_a = context.enviro.get(id)) === null || _a === void 0 ? void 0 : _a.set(predicate, { negated: this.conclusion.negated }); });
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
        return subject === null || subject === void 0 ? void 0 : subject.set(predicate, { args: object ? [object] : [] });
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
const Imply_1 = __importDefault(__webpack_require__(/*! ../../clauses/Imply */ "./app/src/clauses/Imply.ts"));
const ImplyAction_1 = __importDefault(__webpack_require__(/*! ./ImplyAction */ "./app/src/actuator/actions/ImplyAction.ts"));
function getAction(clause, topLevel) {
    var _a, _b, _c;
    if (clause instanceof Imply_1.default) {
        return new ImplyAction_1.default(clause);
    }
    // TODO: prepositions, and be beware of 'of' 
    if (((_a = clause.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'iverb' || ((_b = clause.predicate) === null || _b === void 0 ? void 0 : _b.type) === 'mverb') {
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
    if ((_c = clause.predicate) === null || _c === void 0 ? void 0 : _c.proto) {
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
        return (0, Parser_1.getParser)(natlang, this.context).parseAll().map(ast => {
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
    const res = clause.copy({ map: m !== null && m !== void 0 ? m : {} });
    return res;
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
function iverbSentenceToClause(ast, args) {
    var _a, _b, _c, _d;
    const subjId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
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
        const universe = this.clause1.and(this.clause2);
        const result = [];
        query.entities.forEach(qe => {
            universe.entities.forEach(re => {
                var _a;
                const rd = universe.about(re).flatList();
                const qd = query.about(qe).flatList().filter(x => { var _a; return ((_a = x.predicate) === null || _a === void 0 ? void 0 : _a.root) !== 'of'; }); /* TODO remove filter eventually!  */
                const rd2 = rd.map(x => x.copy({ map: { [re]: qe } })); // subsitute re by qe in real description
                const qhashes = qd.map(x => x.hashCode);
                const r2hashes = rd2.map(x => x.hashCode);
                if (qhashes.every(x => r2hashes.includes(x))) { // qe unifies with re!
                    const i = result.findIndex(x => !x[qe]);
                    const m = (_a = result[i]) !== null && _a !== void 0 ? _a : {};
                    m[qe] = re;
                    result[i > -1 ? i : result.length] = m;
                }
            });
        });
        return result;
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
    constructor(predicate, args, negated = false, exactIds = false, isSideEffecty = false, hashCode = (0, hashString_1.hashString)(JSON.stringify({ predicate: predicate.root, args, negated })), rheme = (0, Clause_1.emptyClause)()) {
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
        // clause.flatList().length > 1?  console.log('BasicClause, some problem!', clause.toString()) : 0
        clause = clause.flatList()[0]; //TODO!
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
const getTopLevelOwnerOf_1 = __webpack_require__(/*! ./getTopLevelOwnerOf */ "./app/src/clauses/getTopLevelOwnerOf.ts");
const getAction_1 = __webpack_require__(/*! ../actuator/actions/getAction */ "./app/src/actuator/actions/getAction.ts");
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
        return [(0, getAction_1.getAction)(this, topLevel)];
    }
    getTopLevelOwnerOf(id) {
        return (0, getTopLevelOwnerOf_1.getTopLevelOwnerOf)(id, this);
    }
    query(clause) {
        throw new Error('not implemented!');
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
    'color of any button is background of style of it',
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
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.constituentTypes = (0, utils_1.stringLiterals)(
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
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ./Wrapper */ "./app/src/enviro/Wrapper.ts");
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
        return this.dictionary[id] && !this.dictionary[id].isPlaceholder;
    }
    set(id, object) {
        this.lastReferenced = id;
        if (!object) {
            return this.dictionary[id] = (0, Wrapper_1.wrap)(id);
        }
        else {
            const placeholder = this.dictionary[id];
            if (placeholder === null || placeholder === void 0 ? void 0 : placeholder.isPlaceholder) {
                placeholder.simplePredicates.forEach(p => {
                    object.set(p); //TODO: maybe better placeholder.copy({object:object})
                });
                this.dictionary[id] = object;
            }
            return object;
        }
    }
    query(clause) {
        var _a;
        const universe = this.values
            .map(x => x.clause)
            .reduce((a, b) => a.and(b), (0, Clause_1.emptyClause)());
        const maps = universe.query(clause);
        const pronentities = clause.entities.filter(e => clause.describe(e).some(x => x.type === 'pronoun'));
        const pronextras = pronentities
            .map(e => { var _a; return ({ [e]: (_a = this.lastReferenced) !== null && _a !== void 0 ? _a : '' }); })
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        const maps2 = maps.map(m => (Object.assign(Object.assign({}, m), pronextras))).concat([pronextras]);
        this.lastReferenced = (_a = maps2.flatMap(x => Object.values(x)).at(-1)) !== null && _a !== void 0 ? _a : this.lastReferenced;
        return maps2; // return list of maps, where each map should should have ALL ids from clause in its keys, eg: [{id2:id1, id4:id3}, {id2:1, id4:3}].
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
class BaseWrapper {
    constructor(object, id, isPlaceholder, aliases, simplePredicates) {
        var _a;
        if (aliases === void 0) { aliases = (_a = object.simpleConcepts) !== null && _a !== void 0 ? _a : {}; }
        if (simplePredicates === void 0) { simplePredicates = []; }
        this.object = object;
        this.id = id;
        this.isPlaceholder = isPlaceholder;
        this.aliases = aliases;
        this.simplePredicates = simplePredicates;
        object.simpleConcepts = aliases;
        object.simplePredicates = simplePredicates;
    }
    set(predicate, opts) {
        var _a;
        if (opts === null || opts === void 0 ? void 0 : opts.args) {
            return this.call(predicate, opts.args);
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
    pointOut(opts) {
        if (this.object instanceof HTMLElement) {
            this.object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
        }
    }
    call(verb, args) {
        var _a, _b;
        const concept = (_a = this.aliases[verb.root]) === null || _a === void 0 ? void 0 : _a.path;
        const methodName = (_b = concept === null || concept === void 0 ? void 0 : concept[0]) !== null && _b !== void 0 ? _b : verb.root;
        return this === null || this === void 0 ? void 0 : this.object[methodName](...args.map(x => x.object));
    }
    get clause() {
        const preds = Object.keys(this.aliases)
            .map(k => this.getNested(this.aliases[k].path))
            .map((x) => ({ root: x, type: 'adjective' }))
            .concat(this.simplePredicates);
        return preds
            .map(x => (0, Clause_1.clauseOf)(x, this.id))
            .reduce((a, b) => a.and(b), (0, Clause_1.emptyClause)());
    }
    setSingleProp(value, prop, opts) {
        var _a, _b;
        const path = (_b = (_a = this.aliases[prop.root]) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : [prop.root];
        const val = (opts === null || opts === void 0 ? void 0 : opts.negated) && this.is(value) ? '' : value.root;
        this.setNested(path, val);
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
            x = x[p];
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
exports.wrap = void 0;
const BaseWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseWrapper */ "./app/src/enviro/BaseWrapper.ts"));
function wrap(id, o) {
    return new BaseWrapper_1.default(o !== null && o !== void 0 ? o : {}, id, o === undefined);
}
exports.wrap = wrap;


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
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        const words = this.joinMultiWordLexemes((0, Lexeme_1.stdspace)(sourceCode), context.config.lexemes)
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .map(s => (0, Lexeme_1.respace)(s));
        this.tokens = words.flatMap(w => (0, Lexeme_1.getLexemes)(w, context, words));
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stdspace = exports.respace = exports.unspace = exports.isMultiWord = exports.isConcept = exports.getProto = exports.getLexemes = exports.formsOf = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
function formsOf(lexeme) {
    var _a;
    return [lexeme.root].concat((_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.forms) !== null && _a !== void 0 ? _a : [])
        .concat(!lexeme.irregular ? [`${lexeme.root}s`] : []);
}
exports.formsOf = formsOf;
function getLexemes(word, context, words) {
    var _a;
    const lexeme = (_a = context.config.lexemes.filter(x => formsOf(x).includes(word)).at(0)) !== null && _a !== void 0 ? _a : getLexeme(word, context, words);
    const lexeme2 = Object.assign(Object.assign({}, lexeme), { token: word });
    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, context, words)) :
        [lexeme2];
}
exports.getLexemes = getLexemes;
function getLexeme(word, context, words) {
    var _a;
    const types = words
        .map(w => (0, Clause_1.clauseOf)({ root: w, type: 'any' }, 'X'))
        .flatMap(c => context.enviro.query(c))
        .flatMap(m => Object.values(m))
        .map(id => context.enviro.get(id))
        .map(x => x === null || x === void 0 ? void 0 : x.typeOf(word))
        .filter(x => x !== undefined);
    const isVerb = types[0] === 'mverb' || types[0] === 'iverb';
    if (!isVerb && word.at(-1) === 's') {
        return getLexeme(word.slice(0, -1), context, words);
    }
    return { root: word, type: (_a = types[0]) !== null && _a !== void 0 ? _a : 'noun' };
}
function getProto(lexeme) {
    var _a, _b;
    return (_b = (_a = window) === null || _a === void 0 ? void 0 : _a[lexeme.proto]) === null || _b === void 0 ? void 0 : _b.prototype;
}
exports.getProto = getProto;
function isConcept(lexeme) {
    var _a;
    return (_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.concepts) === null || _a === void 0 ? void 0 : _a.includes('concept');
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
function getLexer(sourceCode, context) {
    return new EagerLexer_1.default(sourceCode, context);
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
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log(test() ? 'success' : 'fail', test.name);
            yield sleep(75);
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
function sleep(millisecs) {
    return new Promise((ok, err) => {
        setTimeout(() => ok(true), millisecs);
    });
}
function clearDom() {
    document.body.innerHTML = '';
    document.body.style.background = 'white';
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
/******/ 	var __webpack_exports__ = __webpack_require__("./app/src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUlBLE1BQXFCLGFBQWE7SUFFOUIsWUFBcUIsTUFBYyxFQUFXLFFBQWdCO1FBQXpDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBRTlELENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0I7UUFFaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBRXJFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUNyQixJQUFJLEVBQUUsR0FBRztnQkFDVCxJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2FBQ3pDLENBQUM7U0FDTDtJQUVMLENBQUM7Q0FHSjtBQXRCRCxtQ0FzQkM7Ozs7Ozs7Ozs7Ozs7QUMxQkQsb0ZBQStDO0FBRS9DLGlHQUE0QztBQUM1Qyw0RkFBOEM7QUFHOUMsc0dBQXFDO0FBRXJDLE1BQXFCLFlBQVk7SUFFN0IsWUFBcUIsTUFBYyxFQUFXLFFBQWdCO1FBQXpDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBRTlELENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0I7O1FBRWhCLE1BQU0sRUFBRSxHQUFHLDRCQUFNLEVBQUMsZ0JBQUksQ0FBQyxNQUFNLDBDQUFFLElBQUksMENBQUcsQ0FBQyxDQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUNBQUksb0JBQVcsR0FBRTtRQUMvRyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7UUFFdkMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNuQixPQUFNO1NBQ1Q7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUscUNBQXFDO1lBQ2xFLE9BQU07U0FDVDtRQUVELE1BQU0sS0FBSyxHQUFHLHFCQUFRLEVBQUMsU0FBUyxDQUFDO1FBRWpDLElBQUksS0FBSyxZQUFZLFdBQVcsRUFBRTtZQUU5QixNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ25ILE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsYUFBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtZQUNkLENBQUMsQ0FBQyxXQUFXLEdBQUcsU0FBUztZQUN6QixNQUFNLE1BQU0sR0FBRyxrQkFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztTQUVqQzthQUFNO1lBRUgsTUFBTSxDQUFDLEdBQUcsSUFBSyxLQUFhLENBQUMsV0FBVyxFQUFFO1lBQzFDLE1BQU0sTUFBTSxHQUFHLGtCQUFJLEVBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztZQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDO1NBRWpDO0lBRUwsQ0FBQztDQUVKO0FBM0NELGtDQTJDQzs7Ozs7Ozs7Ozs7OztBQ25ERCxvRkFBbUQ7QUFLbkQsc0dBQXFDO0FBRXJDLE1BQXFCLFVBQVU7SUFFM0IsWUFBcUIsTUFBYyxFQUFXLFFBQWdCO1FBQXpDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBRTlELENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0I7UUFFaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO1NBQzVCO2FBQU07WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztTQUMvQjtJQUVMLENBQUM7SUFFUyxXQUFXLENBQUMsT0FBZ0I7O1FBRWxDLE1BQU0sT0FBTyxHQUFHLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSwwQ0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO1FBRXZDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsT0FBTTtTQUNUO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDO0lBQ2pFLENBQUM7SUFFUyxjQUFjLENBQUMsT0FBZ0I7O1FBRXJDLE1BQU0sT0FBTyxHQUFHLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSwwQ0FBRyxDQUFDLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO1FBRXZDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsT0FBTTtTQUNUO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7UUFDOUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUV0RCxJQUFJLENBQUMsWUFBWSxJQUFJLGlCQUFJLENBQUMsTUFBTSwwQ0FBRSxTQUFTLDBDQUFFLElBQUksTUFBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ3BFLE9BQU07U0FDVDtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sQ0FBQztJQUMzRSxDQUFDO0lBRVMsR0FBRyxDQUFDLE9BQVcsRUFBRSxTQUFpQixFQUFFLEtBQWUsRUFBRSxPQUFnQjs7UUFDM0UsTUFBTSxFQUFFLEdBQUcsNEJBQU0sRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUNBQUksb0JBQVcsR0FBRTtRQUN6RixNQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsbUNBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzVELEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFUyxRQUFRLENBQUMsY0FBa0I7UUFDakMsT0FBTyxJQUFJLENBQUMsUUFBUTthQUNmLGlCQUFpQixDQUFDLGNBQWMsQ0FBQzthQUNqQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsc0JBQXNCO0lBQzVFLENBQUM7Q0FFSjtBQTVERCxnQ0E0REM7Ozs7Ozs7Ozs7Ozs7QUNuRUQsZ0dBQWdEO0FBRWhELGlHQUE0QztBQUM1Qyw0RkFBOEM7QUFFOUMsb0ZBQStDO0FBRy9DLE1BQXFCLFdBQVc7SUFFNUIsWUFDYSxNQUFhLEVBQ0gsWUFBWSxNQUFNLENBQUMsS0FBSyxFQUN4QixhQUFhLE1BQU0sQ0FBQyxLQUFLO1FBRm5DLFdBQU0sR0FBTixNQUFNLENBQU87UUFDSCxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGVBQVUsR0FBVixVQUFVLENBQWU7SUFFaEQsQ0FBQztJQUVELEdBQUcsQ0FBQyxPQUFnQjtRQUVoQixNQUFNLGNBQWMsR0FBSSx3RUFBd0U7U0FDNUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07ZUFDM0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07UUFFdkYsSUFBSSxjQUFjLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7U0FDN0I7YUFBTTtZQUNILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ3RCO0lBRUwsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFnQjtRQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLDJDQUEyQztRQUNwRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLDJCQUEyQjtRQUM3RixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXO1FBQzdFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGNBQWM7UUFDaEUsTUFBTSxLQUFLLEdBQUcscUJBQVEsRUFBQyxTQUFTLENBQUM7UUFFakMsa0JBQUksRUFBQyxvQkFBVyxHQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUM7SUFDbkUsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFnQjtRQUNsQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxjQUFjO1FBQ2hFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBUSxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4RCxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBQyxvQkFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLDBDQUFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFDO0lBQ25HLENBQUM7Q0FFSjtBQTdDRCxpQ0E2Q0M7Ozs7Ozs7Ozs7Ozs7QUNsREQsc0dBQXFDO0FBRXJDLE1BQXFCLGNBQWM7SUFFL0IsWUFBcUIsTUFBYyxFQUFXLFFBQWdCO1FBQXpDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBRTlELENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0I7O1FBRWhCLE1BQU0sSUFBSSxHQUFHLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1DQUFJLEVBQUUsQ0FBQzthQUNoQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxzQkFBTSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUztRQUV2QyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3JCLE9BQU07U0FDVDtRQUVELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUMsT0FBTyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ3BFLENBQUM7Q0FFSjtBQXZCRCxvQ0F1QkM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJELDRGQUE4QztBQUM5QyxtSUFBMkM7QUFDM0MsZ0lBQXlDO0FBQ3pDLDBIQUFxQztBQUNyQyxzSUFBNkM7QUFDN0MsOEdBQXVDO0FBQ3ZDLDZIQUF1QztBQUd2QyxTQUFnQixTQUFTLENBQUMsTUFBYyxFQUFFLFFBQWdCOztJQUV0RCxJQUFJLE1BQU0sWUFBWSxlQUFLLEVBQUU7UUFDekIsT0FBTyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2pDO0lBRUQsNkNBQTZDO0lBQzdDLElBQUksYUFBTSxDQUFDLFNBQVMsMENBQUUsSUFBSSxNQUFLLE9BQU8sSUFBSSxhQUFNLENBQUMsU0FBUywwQ0FBRSxJQUFJLE1BQUssT0FBTyxFQUFFO1FBQzFFLE9BQU8sSUFBSSx3QkFBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7S0FDOUM7SUFFRCx5Q0FBeUM7SUFDekMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO1FBQ2pCLE9BQU8sSUFBSSxvQkFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7S0FDMUM7SUFFRCxnREFBZ0Q7SUFDaEQsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxzQkFBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHO1FBQ3JGLE9BQU8sSUFBSSx1QkFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7S0FDN0M7SUFFRCxJQUFJLFlBQU0sQ0FBQyxTQUFTLDBDQUFFLEtBQUssRUFBRTtRQUN6QixPQUFPLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO0tBQzVDO0lBRUQsT0FBTyxJQUFJLG9CQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztBQUMzQyxDQUFDO0FBMUJELDhCQTBCQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxFQUFNLEVBQUUsT0FBZ0IsRUFBRSxRQUFnQixFQUFFLFFBQWlCOztJQUVoRixJQUFJLFFBQVEsRUFBRTtRQUNWLE9BQU8sRUFBRTtLQUNaO0lBRUQsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwQyxNQUFNLEdBQUcsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUcsQ0FBQyxDQUFDLDBDQUFHLEVBQUUsQ0FBQyxFQUFDLHlCQUF5QjtJQUNyRCxPQUFPLEdBQUc7QUFDZCxDQUFDO0FBVkQsd0JBVUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaERELGlJQUEwQztBQU0xQyxTQUFnQixXQUFXO0lBQ3ZCLE9BQU8sSUFBSSxzQkFBWSxFQUFFO0FBQzdCLENBQUM7QUFGRCxrQ0FFQzs7Ozs7Ozs7Ozs7OztBQ05ELE1BQXFCLFlBQVk7SUFFN0IsVUFBVSxDQUFDLE1BQWMsRUFBRSxPQUFnQjtRQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUVKO0FBTkQsa0NBTUM7Ozs7Ozs7Ozs7Ozs7QUNURCx1SEFBNEQ7QUFDNUQsd0ZBQXNDO0FBQ3RDLGlIQUF3RDtBQUl4RCxNQUFxQixVQUFVO0lBRTNCLFlBQ2EsT0FBZ0IsRUFDaEIsV0FBVywwQkFBVyxHQUFFO1FBRHhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFFakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFlO1FBRW5CLE9BQU8sc0JBQVMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUV6RCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO2dCQUNsQyxPQUFPLEVBQUU7YUFDWjtZQUVELE1BQU0sTUFBTSxHQUFHLHVCQUFRLEVBQUMsR0FBRyxDQUFDO1lBRTVCLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTtnQkFFdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzlDLE9BQU8sRUFBRTthQUVaO2lCQUFNO2dCQUVILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUUxRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFFLFFBQVEsRUFBRSxDQUFDO2dCQUNuQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsTUFBTSxDQUFDO2FBQ3JDO1FBRUwsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQ2IsQ0FBQztDQUVKO0FBdkNELGdDQXVDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q0QscUZBQXlEO0FBQ3pELCtHQUFxQztBQVdyQyxTQUFnQixRQUFRLENBQUMsSUFBa0I7SUFDdkMsT0FBTyxJQUFJLG9CQUFVLENBQUMsMkJBQWEsRUFBQyxJQUFJLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRkQsNEJBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZEQsMkZBQXFEO0FBQ3JELDRHQUFtRTtBQVNuRSxTQUFnQixhQUFhLENBQUMsSUFBb0I7SUFDOUMsT0FBTztRQUNILE1BQU0sRUFBRSxvQkFBUyxFQUFDLElBQUksQ0FBQztRQUN2QixNQUFNLEVBQUUsc0JBQVMsR0FBRTtLQUN0QjtBQUNMLENBQUM7QUFMRCxzQ0FLQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCw2RkFBa0U7QUFDbEUsaUZBQXVFO0FBQ3ZFLGlHQUFpRDtBQVNqRCxTQUFnQixRQUFRLENBQUMsR0FBYSxFQUFFLElBQW1COztJQUV2RCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztLQUN2QztJQUVELElBQUksTUFBTTtJQUVWLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7UUFDNUIsTUFBTSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDekM7U0FBTSxJQUFJLFNBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRTtRQUM1QixNQUFNLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM5QztTQUFNLElBQUksU0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsV0FBVyxFQUFFO1FBQ2hDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ3pDO1NBQU0sSUFBSSxVQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSywwQ0FBRSxPQUFPLE1BQUksR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssQ0FBQyxTQUFTLEdBQUU7UUFDcEQsTUFBTSxHQUFHLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDN0M7U0FBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssY0FBYyxFQUFFO1FBQ3BDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzFDO1NBQU0sSUFBSSxVQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLEtBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDL0MsTUFBTSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7S0FDNUM7U0FBTSxJQUFJLFVBQUcsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sS0FBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ2hELE1BQU0sR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQzVDO0lBRUQsSUFBSSxNQUFNLEVBQUU7UUFDUixNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQzlCLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxFQUFFLENBQUM7UUFDOUIsTUFBTSxFQUFFLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sRUFBRTtLQUNaO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUV6RCxDQUFDO0FBbENELDRCQWtDQztBQUVELFNBQVMsc0JBQXNCLENBQUMsY0FBdUIsRUFBRSxJQUFtQjs7SUFFeEUsTUFBTSxTQUFTLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksb0JBQVcsR0FBRTtJQUNoRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsb0JBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxLQUFLLDBDQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNoRixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsb0JBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxLQUFLLDBDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMscUJBQWMsYUFBZCxjQUFjLHVCQUFkLGNBQWMsQ0FBRSxLQUFLLDBDQUFFLFFBQVEsR0FBRSxDQUFDO0lBQ3hJLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFFNUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGNBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxxREFBcUQ7UUFDaEcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0lBRTdDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztBQUU3QyxDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxlQUF3QixFQUFFLElBQW1COztJQUUxRSxNQUFNLFNBQVMsR0FBRyxxQkFBZSxhQUFmLGVBQWUsdUJBQWYsZUFBZSxDQUFFLEtBQUssMENBQUUsU0FBUyxFQUFDLGlDQUFpQztJQUVyRixPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sRUFBRSxDQUFDO1NBQ2pELElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNyQyxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxVQUFtQixFQUFFLElBQW1COztJQUVoRSxNQUFNLE1BQU0sR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxvQkFBVyxHQUFFLEVBQUMsOERBQThEO0lBQzVHLE1BQU0sS0FBSyxHQUFHLG9CQUFXLEdBQUU7SUFFM0IsTUFBTSxXQUFXLEdBQUcsc0JBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLDBDQUFFLFdBQVcsMENBQUUsTUFBTTtJQUUxRCxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztLQUNyQztJQUVELE1BQU0sVUFBVSxHQUFHLGdCQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsS0FBSywwQ0FBRyxhQUFhLENBQUM7SUFFckQsT0FBTyxxQkFBUSxFQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDO1NBQ3RDLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDN0MsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBRXJDLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLFVBQW1CLEVBQUUsSUFBbUI7O0lBRWhFLE1BQU0sT0FBTyxHQUFHLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLG9CQUFXLEdBQUU7SUFDOUMsTUFBTSxTQUFTLEdBQUcsaUJBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLDBDQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsY0FBSyxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO0lBRXhFLE1BQU0sVUFBVSxHQUFHLDRCQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsS0FBSywwQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRTtJQUMzRCxNQUFNLElBQUksR0FBRyxnQkFBVSxDQUFDLEtBQUssMENBQUUsT0FBTztJQUN0QyxNQUFNLFdBQVcsR0FBRyw0QkFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLEtBQUssMENBQUUsVUFBVSwwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDN0QsTUFBTSxTQUFTLEdBQUcsZ0JBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLDBDQUFFLFNBQVM7SUFFOUMsTUFBTSxHQUFHLEdBQ0wsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGNBQUMsQ0FBQyxNQUFNLG1DQUFJLEVBQUUsSUFBQztTQUNsQyxNQUFNLENBQUMsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUN6QyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxFQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNoQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHdCQUFXLEdBQUUsQ0FBQztTQUM3QyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBVyxHQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHdCQUFXLEdBQUUsQ0FBQyxDQUFDO1NBQ2hJLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQVcsR0FBRSxDQUFDO1NBQzVFLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUVyQyxPQUFPLEdBQUc7QUFDZCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBYztJQUUvQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUTtTQUNwQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUNBQU0sQ0FBQyxHQUFLLENBQUMsRUFBRyxFQUFFLEVBQUUsQ0FBQztJQUMzQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFFbEMsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLE1BQWM7SUFFbkMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyx3QkFBVyxHQUFFLENBQUMsUUFBUSxFQUFFO1FBQ2xELE9BQU8sTUFBTTtLQUNoQjtJQUVELE1BQU0sQ0FBQyxHQUFHLDBCQUFXLEdBQUU7SUFDdkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsYUFBRCxDQUFDLGNBQUQsQ0FBQyxHQUFJLEVBQUUsRUFBRSxDQUFDO0lBRXpDLE9BQU8sR0FBRztBQUNkLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLE1BQWM7SUFFdEMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVE7U0FDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsY0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBSyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLEVBQUUsRUFBRSxDQUFDO0lBRTNDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUVsQyxDQUFDO0FBR0QsU0FBUyxtQkFBbUIsQ0FBQyxHQUFZLEVBQUUsSUFBbUI7O0lBRTFELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFHLENBQUMsS0FBSywwQ0FBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxxQkFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLEtBQUssMENBQUUsS0FBSywwQ0FBRSxJQUFJLDBDQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUUxRCxJQUFJLGdCQUFHLENBQUMsS0FBSywwQ0FBRSxJQUFJLDBDQUFFLElBQUksTUFBSyxpQkFBaUIsRUFBRTtRQUM3QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO0tBQ3JEO1NBQU07UUFDSCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDekU7QUFFTCxDQUFDO0FBR0QsU0FBUyxxQkFBcUIsQ0FBQyxHQUFZLEVBQUUsSUFBbUI7O0lBRTVELE1BQU0sTUFBTSxHQUFHLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLG9CQUFXLEdBQUU7SUFDN0MsTUFBTSxLQUFLLEdBQUcsb0JBQVcsR0FBRTtJQUUzQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQ2pFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFHLENBQUMsS0FBSywwQ0FBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDOUQsTUFBTSxLQUFLLEdBQUcsZUFBRyxDQUFDLEtBQUssMENBQUUsS0FBSywwQ0FBRSxNQUFNO0lBRXRDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDO0tBQ2pEO0lBRUQsTUFBTSxLQUFLLEdBQUcscUJBQVEsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQztTQUN2QyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFM0MsTUFBTSxHQUFHLEdBQUcsT0FBTztTQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUM7U0FDWCxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQzdCLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUVoQyxPQUFPLEdBQUc7QUFDZCxDQUFDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxHQUFZLEVBQUUsSUFBbUI7O0lBRTVELE1BQU0sTUFBTSxHQUFHLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLG9CQUFXLEdBQUU7SUFDN0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFNBQUcsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUNqRSxNQUFNLEtBQUssR0FBRyxlQUFHLENBQUMsS0FBSywwQ0FBRSxLQUFLLDBDQUFFLE1BQU07SUFFdEMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUM7S0FDakQ7SUFFRCxNQUFNLEtBQUssR0FBRyxxQkFBUSxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7U0FDaEMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTNDLE1BQU0sR0FBRyxHQUFHLE9BQU87U0FDZCxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQzdCLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUVoQyxPQUFPLEdBQUc7QUFFZCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN01ELHFIQUF3RDtBQUN4RCx3SEFBMEQ7QUFDMUQsZ0dBQTBDO0FBRTFDLGtHQUE0QjtBQUM1QiwwRkFBc0M7QUFFdEMsTUFBcUIsR0FBRztJQUVwQixZQUFxQixPQUFlLEVBQ3ZCLE9BQWUsRUFDZixjQUF1QixFQUN2QixVQUFVLEtBQUssRUFDZixXQUFXLEtBQUssRUFDaEIsZ0JBQWdCLEtBQUssRUFDckIsV0FBVywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFOeEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUN2QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBd0M7SUFFN0QsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYzs7UUFDN0IsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLG1DQUFJLEtBQUssQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQWU7O1FBRWhCLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN2QixJQUFJLENBQUMsY0FBYyxFQUNuQixLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQzNDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxRQUFRLG1DQUFJLElBQUksQ0FBQyxRQUFRLEVBQy9CLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXLG1DQUFJLElBQUksQ0FBQyxhQUFhLENBQUM7SUFFaEQsQ0FBQztJQUVELFFBQVE7UUFFSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFaEUsQ0FBQztJQUVELElBQUksUUFBUTtRQUVSLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FDYixJQUFJLEdBQUcsQ0FDSCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FDdEQsQ0FDSjtJQUVMLENBQUM7SUFFRCxPQUFPLENBQUMsVUFBa0I7UUFDdEIsT0FBTyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxRQUFRO1FBQ0osTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7UUFDbkUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFFRCxPQUFPLENBQUMsRUFBTTtRQUNWLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyx1QkFBUSxFQUFDLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsTUFBVTtRQUN4QixPQUFPLHlDQUFpQixFQUFDLElBQUksRUFBRSxNQUFNLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzFGLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxRixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxFQUFNO1FBQ3JCLE9BQU8sMkNBQWtCLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQztJQUN2QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFFZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQy9DLE1BQU0sTUFBTSxHQUFVLEVBQUU7UUFFeEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7O2dCQUUzQixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDeEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxlQUFDLENBQUMsU0FBUywwQ0FBRSxJQUFJLE1BQUssSUFBSSxJQUFDLEVBQUMscUNBQXFDO2dCQUVuSCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMseUNBQXlDO2dCQUVoRyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBRXpDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLHNCQUFzQjtvQkFFbEUsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN2QyxNQUFNLENBQUMsR0FBRyxZQUFNLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUU7b0JBQ3pCLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO29CQUNWLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBRXpDO1lBRUwsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDO1FBRUYsT0FBTyxNQUFNO0lBQ2pCLENBQUM7Q0FFSjtBQTVIRCx5QkE0SEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdElELG9GQUFrRTtBQUNsRSxnR0FBMEM7QUFFMUMsa0dBQTRCO0FBQzVCLDRGQUF3QjtBQUV4QiwwRkFBc0M7QUFDdEMscUhBQXdEO0FBRXhELHdIQUEwRDtBQUMxRCx3SEFBMEQ7QUFFMUQsTUFBYSxXQUFXO0lBRXBCLFlBQXFCLFNBQWlCLEVBQ3pCLElBQVUsRUFDVixVQUFVLEtBQUssRUFDZixXQUFXLEtBQUssRUFDaEIsZ0JBQWdCLEtBQUssRUFDckIsV0FBVywyQkFBVSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUNuRixRQUFRLHdCQUFXLEdBQUU7UUFOYixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3pCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUNyQixhQUFRLEdBQVIsUUFBUSxDQUEyRTtRQUNuRixVQUFLLEdBQUwsS0FBSyxDQUFnQjtJQUVsQyxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjOztRQUM3QixPQUFPLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksS0FBSyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBZTs7UUFDaEIsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLFlBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLFVBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLG1DQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFDLEVBQ3JELEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFDM0MsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFFBQVEsbUNBQUksSUFBSSxDQUFDLFFBQVEsRUFDL0IsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsbUNBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNoRCxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDakIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixPQUFPLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7SUFDdEMsQ0FBQztJQUVELEtBQUssQ0FBQyxFQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyx3QkFBVyxHQUFFO0lBQzVELENBQUM7SUFFRCxPQUFPLENBQUMsRUFBTTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwRixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDcEYsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUc7UUFDbEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO0lBQzdDLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN2RixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sdUJBQVEsRUFBQyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQVU7UUFDeEIsT0FBTyx5Q0FBaUIsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQzFDLENBQUM7SUFFRCxRQUFRLENBQUMsUUFBZ0I7UUFDckIsT0FBTyxDQUFDLHlCQUFTLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUk7SUFDZixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsRUFBTTtRQUNyQixPQUFPLDJDQUFrQixFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7SUFDdkMsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBR2hCLGtHQUFrRztRQUVsRyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLE9BQU87UUFHckMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFdBQVcsQ0FBQyxFQUFFLEVBQUUsMkNBQTJDO1lBQy9FLE9BQU8sRUFBRTtTQUNaO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtZQUMvQyxPQUFPLEVBQUU7U0FDWjtRQUVELDZCQUE2QjtRQUU3QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSTthQUNsQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEdBQUssQ0FBQyxFQUFHLENBQUM7UUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUNoQixDQUFDO0NBRUo7QUF0R0Qsa0NBc0dDOzs7Ozs7Ozs7Ozs7OztBQ2xIRCxtR0FBMkM7QUFHM0MsbUdBQTJDO0FBa0MzQyxTQUFnQixRQUFRLENBQUMsU0FBaUIsRUFBRSxHQUFHLElBQVU7SUFDckQsT0FBTyxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztBQUMzQyxDQUFDO0FBRkQsNEJBRUM7QUFFTSxNQUFNLFdBQVcsR0FBRyxHQUFXLEVBQUUsQ0FBQyxJQUFJLHlCQUFXLEVBQUU7QUFBN0MsbUJBQVcsZUFBa0M7Ozs7Ozs7Ozs7Ozs7O0FDcEMxRCxNQUFhLFdBQVc7SUFFcEIsWUFBcUIsVUFBVSxLQUFLLEVBQ3ZCLFdBQVcsUUFBUSxFQUNuQixXQUFXLEVBQUUsRUFDYixnQkFBZ0IsS0FBSyxFQUNyQixXQUFXLEtBQUs7UUFKUixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3ZCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUNiLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7SUFFN0IsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlO1FBQ2hCLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUk7SUFDZixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYztRQUM3QixPQUFPLEtBQUs7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixPQUFPLFVBQVU7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQU07UUFDUixPQUFPLElBQUk7SUFDZixDQUFDO0lBRUQsT0FBTyxDQUFDLEVBQU07UUFDVixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sRUFBRTtJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxNQUFVO1FBQ3hCLE9BQU8sRUFBRTtJQUNiLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxFQUFFO0lBQ2IsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFnQjtRQUNyQixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsa0JBQWtCLENBQUMsRUFBTTtRQUNyQixPQUFPLFNBQVM7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE9BQU8sRUFBRTtJQUNiLENBQUM7Q0FFSjtBQXpFRCxrQ0F5RUM7Ozs7Ozs7Ozs7Ozs7O0FDbkVELFFBQVEsQ0FBQyxDQUFDLGNBQWM7SUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNULE9BQU8sSUFBSSxFQUFFO1FBQ1QsQ0FBQyxFQUFFO1FBQ0gsTUFBTSxDQUFDO0tBQ1Y7QUFDTCxDQUFDO0FBRUQsTUFBTSxXQUFXLEdBQUcsY0FBYyxFQUFFO0FBRXBDLFNBQWdCLFdBQVcsQ0FBQyxJQUFzQjtJQUU5QywyREFBMkQ7SUFFM0QsTUFBTSxLQUFLLEdBQUcsS0FBSyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO0lBRTdDLE9BQU8sS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO0FBQzdDLENBQUM7QUFQRCxrQ0FPQztBQU1ELFNBQWdCLEtBQUssQ0FBQyxFQUFNO0lBQ3hCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDMUUsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLENBQUs7SUFDdkIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN6RixDQUFDO0FBRkQsc0JBRUM7QUFFRCxTQUFnQixPQUFPLENBQUMsRUFBTTtJQUMxQixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO0FBQzFFLENBQUM7QUFGRCwwQkFFQzs7Ozs7Ozs7Ozs7Ozs7OztBQzVDRCxvRkFBa0U7QUFDbEUsZ0dBQTBDO0FBRTFDLDRGQUF3QjtBQUV4QiwwRkFBc0M7QUFDdEMscUhBQXdEO0FBRXhELHdIQUEwRDtBQUMxRCx3SEFBMEQ7QUFFMUQsTUFBcUIsS0FBSztJQUV0QixZQUNhLFNBQWlCLEVBQ2pCLFdBQW1CLEVBQ25CLFVBQVUsS0FBSyxFQUNmLFdBQVcsS0FBSyxFQUNoQixnQkFBZ0IsS0FBSyxFQUNyQixXQUFXLDJCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUNoRCxRQUFRLFNBQVMsRUFDakIsUUFBUSxXQUFXO1FBUG5CLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFDakIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBd0M7UUFDaEQsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixVQUFLLEdBQUwsS0FBSyxDQUFjO0lBRWhDLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUVoQixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDM0IsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUMzQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxFQUMvQixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxtQ0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBRWhELENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7SUFDcEUsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3ZDLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBTTtRQUNSLE9BQU8sd0JBQVcsR0FBRSxFQUFDLGVBQWU7SUFDeEMsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtRQUM5RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFNO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLHVCQUFRLEVBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFVO1FBQ3hCLE9BQU8seUNBQWlCLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCO1FBQ3JCLE9BQU8sQ0FBQyx5QkFBUyxFQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsRUFBTTtRQUNyQixPQUFPLDJDQUFrQixFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUM7SUFDdkMsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFjO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFDdkMsQ0FBQztDQUNKO0FBaEZELDJCQWdGQzs7Ozs7Ozs7Ozs7Ozs7QUN4RkQsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE1BQVU7SUFFeEQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFFNUMsT0FBTyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVwRSxDQUFDO0FBUkQsOENBUUM7Ozs7Ozs7Ozs7Ozs7O0FDUkQsU0FBZ0Isa0JBQWtCLENBQUMsRUFBTSxFQUFFLFFBQWdCO0lBRXZELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0lBRXBDLE1BQU0sS0FBSyxHQUFHLE1BQU07U0FDZixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV2RCxJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQztLQUNqRDtTQUFNO1FBQ0gsT0FBTyxLQUFLO0tBQ2Y7QUFFTCxDQUFDO0FBYkQsZ0RBYUM7Ozs7Ozs7Ozs7Ozs7O0FDZkQsU0FBZ0IsVUFBVSxDQUFDLE1BQWM7SUFDckMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsMkJBQTJCO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUxELGdDQUtDOzs7Ozs7Ozs7Ozs7OztBQ0pELFNBQWdCLFFBQVEsQ0FBQyxNQUFjO0lBQ25DLE9BQU8sTUFBTTtTQUNSLFFBQVE7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7U0FDbEMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBTkQsNEJBTUM7Ozs7Ozs7Ozs7Ozs7O0FDSEQsZ0hBQXVEO0FBQ3ZELGdIQUF1RDtBQUd2RCxNQUFhLFdBQVc7SUFFcEIsWUFDYSxXQUF5QixFQUN4QixRQUFrQixFQUNuQixTQUFvQixFQUNwQixlQUF5QixFQUN6QixvQkFBcUM7UUFKckMsZ0JBQVcsR0FBWCxXQUFXLENBQWM7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNuQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLG9CQUFlLEdBQWYsZUFBZSxDQUFVO1FBQ3pCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBaUI7UUF5QmxELGNBQVMsR0FBRyxDQUFDLEtBQWMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sTUFBTSxHQUFHLGlDQUFhLEVBQUMsS0FBSyxDQUFDO1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBcUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ2hFLENBQUM7UUFFRCxjQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTs7WUFDMUIsT0FBTyxVQUFJLENBQUMsU0FBUyxDQUFDLElBQXFCLENBQUMsbUNBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLDRDQUE0QztRQUM5SCxDQUFDO0lBaENELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFFVixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQW9CO1FBQ3hELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFhLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUUxQyxXQUFXO1FBQ1gsZUFBZTtRQUNmLG1CQUFtQjtRQUNuQixxQkFBcUI7UUFDckIsc0JBQXNCO1FBQ3RCLHlCQUF5QjtRQUN6QixvQkFBb0I7UUFDcEIsbUJBQW1CO1FBQ25CLHFCQUFxQjtJQUN6QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUTtJQUN4QixDQUFDO0lBWUQsU0FBUyxDQUFDLE1BQWM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDOUIsQ0FBQztDQUVKO0FBL0NELGtDQStDQzs7Ozs7Ozs7Ozs7Ozs7QUNyREQsa0dBQTJDO0FBQzNDLHNGQUFtQztBQUNuQywrRkFBc0Q7QUFDdEQsOEdBQW1EO0FBQ25ELHlGQUEwRTtBQVkxRSxTQUFnQixTQUFTO0lBRXJCLE9BQU8sSUFBSSx5QkFBVyxDQUNsQix3QkFBVyxFQUNYLGlCQUFPLEVBQ1AsbUJBQVEsRUFDUixpQ0FBZSxFQUNmLCtCQUFvQixDQUFDO0FBQzdCLENBQUM7QUFSRCw4QkFRQzs7Ozs7Ozs7Ozs7Ozs7QUMzQkQsZ0ZBQXFEO0FBSXhDLG1CQUFXLEdBQUcsMEJBQWMsRUFDdkMsV0FBVyxFQUNYLGFBQWEsRUFDYixRQUFRLEVBQ1IsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGFBQWEsRUFDYixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFBRSxVQUFVO0FBQ3hCLFNBQVMsRUFBRSx1QkFBdUI7QUFDbEMsU0FBUyxFQUNULEtBQUssQ0FDTjs7Ozs7Ozs7Ozs7Ozs7QUMzQkQsK0ZBQTJDO0FBQzNDLHlGQUE4QztBQUVqQyxlQUFPLEdBQWE7SUFFN0I7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztRQUN0QixTQUFTLEVBQUUsSUFBSTtLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxtQkFBbUI7S0FDN0I7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLE1BQU07UUFDWixLQUFLLEVBQUUsT0FBTztLQUNqQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsTUFBTTtLQUNmO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUNwQixTQUFTLEVBQUUsSUFBSTtLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0tBQ2hDO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0tBQ3hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxZQUFZO0tBQ3JCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNLENBQUMsY0FBYztLQUM5QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7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QixDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ3pCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSztBQUV2QyxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsU0FBaUI7SUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQztJQUN6QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxRQUFRO0lBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtJQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsT0FBTztBQUM1QyxDQUFDOzs7Ozs7O1VDOU1EO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvQ29uY2VwdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvQ3JlYXRlQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9FZGl0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9JbXBseUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvUmVsYXRpb25BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL2dldEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9nZXRUb3BMZXZlbE93bmVyT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0Jhc2ljQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3RhcnR1cENvbW1hbmRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3V0aWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0FuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQmFzZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jZXB0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuYXJncyAmJiB0aGlzLmNsYXVzZS5wcmVkaWNhdGUpIHtcblxuICAgICAgICAgICAgY29uc3QgYWRqID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSh0aGlzLmNsYXVzZS5hcmdzWzBdKVswXS5yb290XG5cbiAgICAgICAgICAgIGNvbnRleHQuY29uZmlnLnNldExleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogYWRqLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICAgICAgICAgIGNvbmNlcHRzOiBbdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3RdLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldFByb3RvIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgbG9va3VwIH0gZnJvbSBcIi4vZ2V0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBpZCA9IGxvb2t1cCh0aGlzLmNsYXVzZT8uYXJncz8uWzBdIGFzIGFueSwgY29udGV4dCwgdGhpcy50b3BMZXZlbCwgdGhpcy5jbGF1c2UuZXhhY3RJZHMpID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKCFwcmVkaWNhdGUgfHwgIWlkKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0LmVudmlyby5leGlzdHMoaWQpKSB7IC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcmVkaWNhdGUpXG5cbiAgICAgICAgaWYgKHByb3RvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblxuICAgICAgICAgICAgY29uc3QgdGFnTmFtZUZyb21Qcm90byA9ICh4OiBPYmplY3QpID0+IHguY29uc3RydWN0b3IubmFtZS5yZXBsYWNlKCdIVE1MJywgJycpLnJlcGxhY2UoJ0VsZW1lbnQnLCAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgY29uc3QgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZUZyb21Qcm90byhwcm90bykpXG4gICAgICAgICAgICBjb250ZXh0LmVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuICAgICAgICAgICAgby5pZCA9IGlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAoaWQsIG8pXG4gICAgICAgICAgICBuZXdPYmouc2V0KHByZWRpY2F0ZSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnNldChpZCwgbmV3T2JqKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG8gPSBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoKVxuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChvLCBjb250ZXh0KVxuICAgICAgICAgICAgbmV3T2JqLnNldChwcmVkaWNhdGUpXG4gICAgICAgICAgICBjb250ZXh0LmVudmlyby5zZXQoaWQsIG5ld09iailcblxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBsb29rdXAgfSBmcm9tIFwiLi9nZXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuYXJncyAmJiB0aGlzLnRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXModGhpcy5jbGF1c2UuYXJnc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yTm9uVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvclRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBsb2NhbElkID0gdGhpcy5jbGF1c2UuYXJncz8uWzBdXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY2xhdXNlLnByZWRpY2F0ZVxuXG4gICAgICAgIGlmICghbG9jYWxJZCB8fCAhcHJlZGljYXRlKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KGxvY2FsSWQsIHByZWRpY2F0ZSwgdGhpcy5nZXRQcm9wcyhsb2NhbElkKSwgY29udGV4dClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZm9yTm9uVG9wTGV2ZWwoY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGxvY2FsSWQgPSB0aGlzLmNsYXVzZS5hcmdzPy5bMF1cbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jbGF1c2UucHJlZGljYXRlXG5cbiAgICAgICAgaWYgKCFsb2NhbElkIHx8ICFwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3duZXJMb2NhbElkID0gdGhpcy50b3BMZXZlbC5nZXRUb3BMZXZlbE93bmVyT2YobG9jYWxJZClcbiAgICAgICAgY29uc3QgcHJvcE5hbWUgPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKGxvY2FsSWQpXG5cbiAgICAgICAgaWYgKCFvd25lckxvY2FsSWQgfHwgdGhpcy5jbGF1c2U/LnByZWRpY2F0ZT8ucm9vdCA9PT0gcHJvcE5hbWVbMF0ucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldChvd25lckxvY2FsSWQsIHByZWRpY2F0ZSwgdGhpcy5nZXRQcm9wcyhvd25lckxvY2FsSWQpLCBjb250ZXh0KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXQobG9jYWxJZDogSWQsIHByZWRpY2F0ZTogTGV4ZW1lLCBwcm9wczogTGV4ZW1lW10sIGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBsb29rdXAobG9jYWxJZCwgY29udGV4dCwgdGhpcy50b3BMZXZlbCwgdGhpcy5jbGF1c2UuZXhhY3RJZHMpID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3Qgb2JqID0gY29udGV4dC5lbnZpcm8uZ2V0KGlkKSA/PyBjb250ZXh0LmVudmlyby5zZXQoaWQpXG4gICAgICAgIG9iai5zZXQocHJlZGljYXRlLCB7IHByb3BzLCBuZWdhdGVkOiB0aGlzLmNsYXVzZS5uZWdhdGVkIH0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3BMZXZlbFxuICAgICAgICAgICAgLmdldE93bmVyc2hpcENoYWluKHRvcExldmVsRW50aXR5KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSkgLy8gQVNTVU1FIGF0IGxlYXN0IG9uZVxuICAgIH1cblxufSIsImltcG9ydCB7IGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IGdldFByb3RvIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlOiBJbXBseSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmRpdGlvbiA9IGNsYXVzZS50aGVtZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmNsdXNpb24gPSBjbGF1c2UucmhlbWUpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KTogYW55IHtcblxuICAgICAgICBjb25zdCBpc1NldEFsaWFzQ2FsbCA9ICAvLyBhc3N1bWUgaWYgXCJvZlwiIGluIGNvbmRpdGlvbiBBTkQgY29uY2x1c2lvbiB0aGF0IGl0J3MgYSBzZXQgYWxpYXMgY2FsbFxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXSkuc2xpY2UoMSkubGVuZ3RoXG4gICAgICAgICAgICAmJiB0aGlzLmNvbmNsdXNpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25jbHVzaW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuXG4gICAgICAgIGlmIChpc1NldEFsaWFzQ2FsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBbGlhc0NhbGwoY29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3RoZXIoY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgc2V0QWxpYXNDYWxsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG5cbiAgICAgICAgd3JhcChnZXRSYW5kb21JZCgpLCBwcm90bykuc2V0QWxpYXMoY29uY2VwdE5hbWVbMF0sIHByb3BzTmFtZXMpXG4gICAgfVxuXG4gICAgb3RoZXIoY29udGV4dDogQ29udGV4dCkge1xuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5jb25jbHVzaW9uLmRlc2NyaWJlKHRvcClbMF1cbiAgICAgICAgY29uc3QgeSA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KGNsYXVzZU9mKHByb3RvTmFtZSwgJ1gnKSlcbiAgICAgICAgY29uc3QgaWRzID0geS5tYXAobSA9PiBtWydYJ10pXG4gICAgICAgIGlkcy5mb3JFYWNoKGlkID0+IGNvbnRleHQuZW52aXJvLmdldChpZCk/LnNldChwcmVkaWNhdGUsIHsgbmVnYXRlZDogdGhpcy5jb25jbHVzaW9uLm5lZ2F0ZWQgfSkpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCB7IGxvb2t1cCB9IGZyb20gXCIuL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGlvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IENsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCBhcmdzID0gKHRoaXMuY2xhdXNlLmFyZ3MgPz8gW10pXG4gICAgICAgICAgICAubWFwKGEgPT4gbG9va3VwKGEsIGNvbnRleHQsIHRoaXMudG9wTGV2ZWwsIHRoaXMuY2xhdXNlLmV4YWN0SWRzKSlcblxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNsYXVzZS5wcmVkaWNhdGVcblxuICAgICAgICBpZiAoIWFyZ3MgfHwgIXByZWRpY2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gY29udGV4dC5lbnZpcm8uZ2V0KGFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGNvbnRleHQuZW52aXJvLmdldChhcmdzWzFdKVxuXG4gICAgICAgIHJldHVybiBzdWJqZWN0Py5zZXQocHJlZGljYXRlLCB7IGFyZ3M6IG9iamVjdCA/IFtvYmplY3RdIDogW10gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIlxuaW1wb3J0IHsgaXNDb25jZXB0IH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgQ29uY2VwdEFjdGlvbiBmcm9tIFwiLi9Db25jZXB0QWN0aW9uXCJcbmltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCJcbmltcG9ydCBFZGl0QWN0aW9uIGZyb20gXCIuL0VkaXRBY3Rpb25cIlxuaW1wb3J0IFJlbGF0aW9uQWN0aW9uIGZyb20gXCIuL1JlbGF0aW9uQWN0aW9uXCJcbmltcG9ydCBJbXBseSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JbXBseVwiXG5pbXBvcnQgSW1wbHlBY3Rpb24gZnJvbSBcIi4vSW1wbHlBY3Rpb25cIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIGlmIChjbGF1c2UgaW5zdGFuY2VvZiBJbXBseSkge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5QWN0aW9uKGNsYXVzZSlcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBwcmVwb3NpdGlvbnMsIGFuZCBiZSBiZXdhcmUgb2YgJ29mJyBcbiAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZT8udHlwZSA9PT0gJ2l2ZXJiJyB8fCBjbGF1c2UucHJlZGljYXRlPy50eXBlID09PSAnbXZlcmInKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpb25BY3Rpb24oY2xhdXNlLCB0b3BMZXZlbClcbiAgICB9XG5cbiAgICAvLyBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiAoVE9ETzogcmVtb3ZlKVxuICAgIGlmIChjbGF1c2UuZXhhY3RJZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgLy8gdG8gY3JlYXRlIG5ldyBjb25jZXB0IG9yIG5ldyBpbnN0YW5jZSB0aGVyZW9mXG4gICAgaWYgKGNsYXVzZS5hcmdzICYmIHRvcExldmVsLnJoZW1lLmRlc2NyaWJlKGNsYXVzZS5hcmdzWzBdKS5zb21lKHggPT4gaXNDb25jZXB0KHgpKSkgeyAvLyBcbiAgICAgICAgcmV0dXJuIG5ldyBDb25jZXB0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgaWYgKGNsYXVzZS5wcmVkaWNhdGU/LnByb3RvKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGNsYXVzZSwgdG9wTGV2ZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAoaWQ6IElkLCBjb250ZXh0OiBDb250ZXh0LCB0b3BMZXZlbDogQ2xhdXNlLCBleGFjdElkczogYm9vbGVhbikgeyAvLyBiYXNlZCBvbiB0aGVtZSBpbmZvIG9ubHlcblxuICAgIGlmIChleGFjdElkcykge1xuICAgICAgICByZXR1cm4gaWRcbiAgICB9XG5cbiAgICBjb25zdCBxID0gdG9wTGV2ZWwudGhlbWUuYWJvdXQoaWQpXG4gICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KHEpXG4gICAgY29uc3QgcmVzID0gbWFwcz8uWzBdPy5baWRdIC8vVE9ETyBjb3VsZCBiZSB1bmRlZmluZWRcbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBY3R1YXRvciBpbXBsZW1lbnRzIEFjdHVhdG9yIHtcblxuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGNvbnRleHQ6IENvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgY2xhdXNlLnRvQWN0aW9uKGNsYXVzZSkuZm9yRWFjaChhID0+IGEucnVuKGNvbnRleHQpKVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4vdG9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnN0YXJ0dXBDb21tYW5kcy5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuY29uZmlnLnNldFN5bnRheChhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdClcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RzID0gaWRzLm1hcChpZCA9PiB0aGlzLmNvbnRleHQuZW52aXJvLmdldChpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gbz8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0cy5tYXAobyA9PiBvPy5vYmplY3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgR2V0Q29udGV4dE9wdHMsIGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRCcmFpbk9wdHMgZXh0ZW5kcyBHZXRDb250ZXh0T3B0cyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKG9wdHM6IEdldEJyYWluT3B0cyk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dChvcHRzKSlcbn1cbiIsImltcG9ydCB7IENvbmZpZywgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcbmltcG9ydCBnZXRFbnZpcm8sIHsgRW52aXJvLCBHZXRFbnZpcm9PcHMgfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQge1xuICAgIHJlYWRvbmx5IGVudmlybzogRW52aXJvXG4gICAgcmVhZG9ubHkgY29uZmlnOiBDb25maWdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0T3B0cyBleHRlbmRzIEdldEVudmlyb09wcyB7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NvbnRleHQob3B0czogR2V0Q29udGV4dE9wdHMpOiBDb250ZXh0IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlbnZpcm86IGdldEVudmlybyhvcHRzKSxcbiAgICAgICAgY29uZmlnOiBnZXRDb25maWcoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkLCBpc1ZhciwgdG9Db25zdCwgdG9WYXIgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgZ2V0QW5hcGhvcmEgfSBmcm9tIFwiLi4vZW52aXJvL0FuYXBob3JhXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcblxuXG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzdCBpcyB1bmRlZmluZWQhYClcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdub3VuIHBocmFzZScpIHtcbiAgICAgICAgcmVzdWx0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnJlbHByb24pIHtcbiAgICAgICAgcmVzdWx0ID0gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8ucHJlcG9zaXRpb24pIHtcbiAgICAgICAgcmVzdWx0ID0gY29tcGxlbWVudFRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnN1YmplY3QgJiYgYXN0Py5saW5rcy5wcmVkaWNhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gY29wdWxhU2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ2FuZCBzZW50ZW5jZScpIHtcbiAgICAgICAgcmVzdWx0ID0gYW5kU2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QubGlua3M/LnN1YmplY3QgJiYgYXN0LmxpbmtzLm9iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBtdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJqZWN0ICYmICFhc3QubGlua3Mub2JqZWN0KSB7XG4gICAgICAgIHJlc3VsdCA9IGl2ZXJiU2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjMSA9IG1ha2VBbGxWYXJzKHJlc3VsdClcbiAgICAgICAgY29uc3QgYzIgPSByZXNvbHZlQW5hcGhvcmEoYzEpXG4gICAgICAgIGNvbnN0IGMzID0gcHJvcGFnYXRlVmFyc093bmVkKGMyKVxuICAgICAgICByZXR1cm4gYzNcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3QudHlwZX0nIWApXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlPy5saW5rcz8ucHJlZGljYXRlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5jb3B5KHsgbmVnYXRlOiAhIWNvcHVsYVNlbnRlbmNlPy5saW5rcz8ubmVnYXRpb24gfSlcbiAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLnNvbWUoZSA9PiBpc1ZhcihlKSkgPyAgLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgc3ViamVjdC5pbXBsaWVzKHByZWRpY2F0ZSkgOlxuICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdC5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShjb3B1bGFTdWJDbGF1c2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlPy5saW5rcz8ucHJlZGljYXRlIC8vYXMgQ29tcG9zaXRlTm9kZTxDb21wb3NpdGVUeXBlPlxuXG4gICAgcmV0dXJuIHRvQ2xhdXNlKHByZWRpY2F0ZSwgeyBzdWJqZWN0OiBhcmdzPy5zdWJqZWN0IH0pXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShjb21wbGVtZW50OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKSAvLz8/ICgoKTogSWQgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBzdWJqZWN0IGlkJykgfSkoKVxuICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBjb21wbGVtZW50Py5saW5rcz8ucHJlcG9zaXRpb24/LmxleGVtZVxuXG4gICAgaWYgKCFwcmVwb3NpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHByZXBvc2l0aW9uIScpXG4gICAgfVxuXG4gICAgY29uc3Qgbm91blBocmFzZSA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5bJ25vdW4gcGhyYXNlJ11cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbiwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZCh0b0NsYXVzZShub3VuUGhyYXNlLCB7IHN1YmplY3Q6IG5ld0lkIH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBub3VuUGhyYXNlPy5saW5rcz8udW5pcXVhbnQgPyB0b1ZhcihtYXliZUlkKSA6IG1heWJlSWRcblxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSBub3VuUGhyYXNlPy5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3Qgbm91biA9IG5vdW5QaHJhc2UubGlua3M/LnN1YmplY3RcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5jb21wbGVtZW50Py5saXN0ID8/IFtdXG4gICAgY29uc3Qgc3ViQ2xhdXNlID0gbm91blBocmFzZT8ubGlua3M/LnN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5mbGF0TWFwKGEgPT4gYS5sZXhlbWUgPz8gW10pXG4gICAgICAgICAgICAuY29uY2F0KG5vdW4/LmxleGVtZSA/IFtub3VuLmxleGVtZV0gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZChjb21wbGVtZW50cy5tYXAoYyA9PiBjID8gdG9DbGF1c2UoYywgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkgOiBlbXB0eUNsYXVzZSgpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKHN1YkNsYXVzZSA/IHRvQ2xhdXNlKHN1YkNsYXVzZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkgOiBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gbWFrZUFsbFZhcnMoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2UgeyAvLyBhc3N1bWUgaWRzIGFyZSBjYXNlIGluc2Vuc2l0aXZlLCBhc3N1bWUgaWYgSURYIGlzIHZhciBhbGwgaWR4IGFyZSB2YXJcblxuICAgIGNvbnN0IG0gPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IG0gfSlcblxufVxuXG5mdW5jdGlvbiByZXNvbHZlQW5hcGhvcmEoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Uge1xuXG4gICAgaWYgKGNsYXVzZS5yaGVtZS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UoKS5oYXNoQ29kZSkge1xuICAgICAgICByZXR1cm4gY2xhdXNlXG4gICAgfVxuXG4gICAgY29uc3QgYSA9IGdldEFuYXBob3JhKClcbiAgICBhLmFzc2VydChjbGF1c2UudGhlbWUpXG4gICAgY29uc3QgbSA9IGEucXVlcnkoY2xhdXNlLnJoZW1lKVswXVxuICAgIGNvbnN0IHJlcyA9IGNsYXVzZS5jb3B5KHsgbWFwOiBtID8/IHt9IH0pXG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHByb3BhZ2F0ZVZhcnNPd25lZChjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7Ly8gYXNzdW1lIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyaWFibGUgaXMgYWxzbyBhIHZhcmlhYmxlXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiBjbGF1c2Uub3duZWRCeShlKSlcbiAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cblxuXG5mdW5jdGlvbiBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5sZWZ0LCBhcmdzKVxuICAgIGNvbnN0IHJpZ2h0ID0gdG9DbGF1c2UoYXN0Py5saW5rcz8ucmlnaHQ/Lmxpc3Q/LlswXSwgYXJncylcblxuICAgIGlmIChhc3QubGlua3M/LmxlZnQ/LnR5cGUgPT09ICdjb3B1bGEgc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBsZWZ0LmFuZChyaWdodCkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbSA9IHsgW3JpZ2h0LmVudGl0aWVzWzBdXTogbGVmdC5lbnRpdGllc1swXSB9XG4gICAgICAgIGNvbnN0IHRoZW1lID0gbGVmdC50aGVtZS5hbmQocmlnaHQudGhlbWUpXG4gICAgICAgIGNvbnN0IHJoZW1lID0gcmlnaHQucmhlbWUuYW5kKHJpZ2h0LnJoZW1lLmNvcHkoeyBtYXA6IG0gfSkpXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9XG5cbn1cblxuXG5mdW5jdGlvbiBtdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBvYmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmpJZCB9KVxuICAgIGNvbnN0IG12ZXJiID0gYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIW12ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gbXZlcmIgaW4gbXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKG12ZXJiLCBzdWJqSWQsIG9iaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGl2ZXJiU2VudGVuY2VUb0NsYXVzZShhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBpdmVyYiA9IGFzdC5saW5rcz8uaXZlcmI/LmxleGVtZVxuXG4gICAgaWYgKCFpdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGl2ZXJiIGluIGl2ZXJiIHNlbnRlbmNlIScpXG4gICAgfVxuXG4gICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZihpdmVyYiwgc3ViaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChyaGVtZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcblxuICAgIHJldHVybiByZXNcblxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi9nZXRUb3BMZXZlbE93bmVyT2ZcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkuY29uY2F0KHRoaXMuY2xhdXNlMi50b0FjdGlvbih0b3BMZXZlbCkpXG4gICAgfVxuXG4gICAgZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCk6IElkIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIGdldFRvcExldmVsT3duZXJPZihpZCwgdGhpcylcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy5jbGF1c2UxLmFuZCh0aGlzLmNsYXVzZTIpXG4gICAgICAgIGNvbnN0IHJlc3VsdDogTWFwW10gPSBbXVxuXG4gICAgICAgIHF1ZXJ5LmVudGl0aWVzLmZvckVhY2gocWUgPT4ge1xuICAgICAgICAgICAgdW5pdmVyc2UuZW50aXRpZXMuZm9yRWFjaChyZSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZCA9IHVuaXZlcnNlLmFib3V0KHJlKS5mbGF0TGlzdCgpXG4gICAgICAgICAgICAgICAgY29uc3QgcWQgPSBxdWVyeS5hYm91dChxZSkuZmxhdExpc3QoKS5maWx0ZXIoeCA9PiB4LnByZWRpY2F0ZT8ucm9vdCAhPT0gJ29mJykgLyogVE9ETyByZW1vdmUgZmlsdGVyIGV2ZW50dWFsbHkhICAqL1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmQyID0gcmQubWFwKHggPT4geC5jb3B5KHsgbWFwOiB7IFtyZV06IHFlIH0gfSkpIC8vIHN1YnNpdHV0ZSByZSBieSBxZSBpbiByZWFsIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgICAgICAgICBjb25zdCBxaGFzaGVzID0gcWQubWFwKHggPT4geC5oYXNoQ29kZSlcbiAgICAgICAgICAgICAgICBjb25zdCByMmhhc2hlcyA9IHJkMi5tYXAoeCA9PiB4Lmhhc2hDb2RlKVxuXG4gICAgICAgICAgICAgICAgaWYgKHFoYXNoZXMuZXZlcnkoeCA9PiByMmhhc2hlcy5pbmNsdWRlcyh4KSkpIHsgLy8gcWUgdW5pZmllcyB3aXRoIHJlIVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGkgPSByZXN1bHQuZmluZEluZGV4KHggPT4gIXhbcWVdKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtID0gcmVzdWx0W2ldID8/IHt9XG4gICAgICAgICAgICAgICAgICAgIG1bcWVdID0gcmVcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2kgPiAtMSA/IGkgOiByZXN1bHQubGVuZ3RoXSA9IG1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi9nZXRUb3BMZXZlbE93bmVyT2ZcIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL2dldEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHByZWRpY2F0ZS5yb290LCBhcmdzLCBuZWdhdGVkIH0pKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbZ2V0QWN0aW9uKHRoaXMsIHRvcExldmVsKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzKSlcbiAgICB9XG5cbiAgICBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkKTogSWQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gZ2V0VG9wTGV2ZWxPd25lck9mKGlkLCB0aGlzKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10geyAvLyBhbGwgaWRzIHRyZWF0ZWQgYXMgdmFyc1xuXG5cbiAgICAgICAgLy8gY2xhdXNlLmZsYXRMaXN0KCkubGVuZ3RoID4gMT8gIGNvbnNvbGUubG9nKCdCYXNpY0NsYXVzZSwgc29tZSBwcm9ibGVtIScsIGNsYXVzZS50b1N0cmluZygpKSA6IDBcblxuICAgICAgICBjbGF1c2UgPSBjbGF1c2UuZmxhdExpc3QoKVswXSAvL1RPRE8hXG5cblxuICAgICAgICBpZiAoIShjbGF1c2UgaW5zdGFuY2VvZiBCYXNpY0NsYXVzZSkpIHsgLy8gVE9ETzogd2hhdCBhYm91dCBBbmQgb2Ygc2FtZSBCYXNpY0NsYXVzZVxuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xhdXNlLnByZWRpY2F0ZS5yb290ICE9PSB0aGlzLnByZWRpY2F0ZS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8gd2hhdCBhYm91dCBleGFjdCBpZHM/XG5cbiAgICAgICAgY29uc3QgbWFwID0gY2xhdXNlLmFyZ3NcbiAgICAgICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi9JZFwiXG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiXG5pbXBvcnQgeyBFbXB0eUNsYXVzZSB9IGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICB0b3BMZXZlbCgpOiBJZFtdXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW11cbiAgICBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkKTogSWQgfCB1bmRlZmluZWRcblxuXG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpOiBDbGF1c2UgPT4gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIGV4YWN0SWRzPzogYm9vbGVhblxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IDk5OTk5OTk5LFxuICAgICAgICByZWFkb25seSBlbnRpdGllcyA9IFtdLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2UpIHtcblxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBvdGhlclxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGNvbmNsdXNpb25cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkKTogSWQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBnZXRUb3BMZXZlbE93bmVyT2YgfSBmcm9tIFwiLi9nZXRUb3BMZXZlbE93bmVyT2ZcIjtcbmltcG9ydCB7IGdldEFjdGlvbiB9IGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL2dldEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbnNlcXVlbmNlOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGNvbnNlcXVlbmNlKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8vVE9ETyEhISEhISEhXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zZXF1ZW5jZS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbZ2V0QWN0aW9uKHRoaXMsIHRvcExldmVsKV1cbiAgICB9XG5cbiAgICBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkKTogSWQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gZ2V0VG9wTGV2ZWxPd25lck9mKGlkLCB0aGlzKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10gey8vIFRPRE9cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWxPd25lck9mKGlkOiBJZCwgdG9wTGV2ZWw6IENsYXVzZSk6IElkIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG93bmVycyA9IHRvcExldmVsLm93bmVyc09mKGlkKVxuXG4gICAgY29uc3QgbWF5YmUgPSBvd25lcnNcbiAgICAgICAgLmZpbHRlcihvID0+IHRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXMobykpLmF0KDApXG5cbiAgICBpZiAoIW1heWJlICYmIG93bmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBnZXRUb3BMZXZlbE93bmVyT2Yob3duZXJzWzBdLCB0b3BMZXZlbClcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbWF5YmVcbiAgICB9XG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29uZmlnIGltcGxlbWVudHMgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICBwcm90ZWN0ZWQgX2xleGVtZXM6IExleGVtZVtdLFxuICAgICAgICByZWFkb25seSBzeW50YXhNYXA6IFN5bnRheE1hcCxcbiAgICAgICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSxcbiAgICAgICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSkge1xuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG5cbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcblxuICAgICAgICAvLyByZXR1cm4gW1xuICAgICAgICAvLyAgICAgJ21hY3JvJyxcbiAgICAgICAgLy8gICAgICdtYWNyb3BhcnQnLFxuICAgICAgICAvLyAgICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAgICAgLy8gICAgICdhbmQgc2VudGVuY2UnLFxuICAgICAgICAvLyAgICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgIC8vICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgLy8gICAgICdub3VuIHBocmFzZSddXG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSkge1xuICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgc3RhcnR1cENvbW1hbmRzIH0gZnJvbSBcIi4vc3RhcnR1cENvbW1hbmRzXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLCBzeW50YXhlcyB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSlcbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAndGhlbicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAge1xuICAgICAgICByb290OiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEJ1dHRvbkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xpc3QnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnQXJyYXknXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgaXJyZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZSxcbiAgICAgICAgZm9ybXM6IFsnZG8nLCAnZG9lcyddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3NvbWUnLFxuICAgICAgICB0eXBlOiAnZXhpc3RxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZXZlcnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FsbCcsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW55JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0bycsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2l0aCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZnJvbScsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb2YnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ292ZXInLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhdCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICd0aGVuJyAvLyBmaWxsZXIgd29yZFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2l0JyxcbiAgICAgICAgdHlwZTogJ3Byb25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGNvbmNlcHRzOiBbJ2NvbmNlcHQnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsZWZ0JyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmlnaHQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvYmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH1cbl1cblxuLyoqXG4gKiBHcmFtbWFyXG4gKi9cbmNvbnN0aXR1ZW50VHlwZXMuY29uY2F0KGxleGVtZVR5cGVzIGFzIGFueSkuZm9yRWFjaChnID0+IHtcbiAgICBsZXhlbWVzLnB1c2goe1xuICAgICAgICByb290OiBnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9KVxufSkiLCJleHBvcnQgY29uc3Qgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSA9IFtcblxuICAgIC8vIGdyYW1tYXJcbiAgICAncXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50JyxcbiAgICAnYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQnLFxuICAgICdjb21wbGVtZW50IGlzIHByZXBvc2l0aW9uIHRoZW4gbm91biBwaHJhc2UnLFxuXG4gICAgYGNvcHVsYSBzZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4gcGhyYXNlIFxuICAgICAgICB0aGVuIGNvcHVsYSBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICAgICAgdGhlbiBwcmVkaWNhdGUgbm91biBwaHJhc2VgLFxuXG4gICAgYG5vdW4gcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICAgICAgdGhlbiB6ZXJvICBvciAgbW9yZSBhZGplY3RpdmVzIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIG12ZXJiIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSBcbiAgICAgICAgdGhlbiB6ZXJvIG9yIG1vcmUgY29tcGxlbWVudHMgYCxcblxuICAgICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIG5vdW4gcGhyYXNlJyxcbiAgICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZScsXG5cbiAgICBgYW5kIHNlbnRlbmNlIGlzIGxlZnQgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlIFxuICAgICAgICB0aGVuIG5vbnN1YmNvbmpcbiAgICAgICAgdGhlbiBvbmUgb3IgbW9yZSByaWdodCBhbmQgc2VudGVuY2Ugb3IgY29wdWxhIHNlbnRlbmNlIG9yIG5vdW4gcGhyYXNlYCxcblxuICAgIGBtdmVyYiBzZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4gcGhyYXNlIFxuXHRcdHRoZW4gb3B0aW9uYWwgaHZlcmJcblx0XHR0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uXG5cdFx0dGhlbiBtdmVyYlxuXHRcdHRoZW4gb2JqZWN0IG5vdW4gcGhyYXNlYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgYGl2ZXJiIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG5cdFx0dGhlbiBvcHRpb25hbCBodmVyYlxuXHRcdHRoZW4gb3B0aW9uYWwgbmVnYXRpb25cblx0XHR0aGVuIGl2ZXJiYCwgLy8gVE9ETyBjb21wbGVtZW50c1xuXG4gICAgLy8gZG9tYWluXG4gICAgJ2NvbG9yIGlzIGEgY29uY2VwdCcsXG4gICAgJ3JlZCBhbmQgYmx1ZSBhbmQgYmxhY2sgYW5kIGdyZWVuIGFyZSBjb2xvcnMnLFxuICAgICdjb2xvciBvZiBhbnkgYnV0dG9uIGlzIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgaXQnLFxuICAgICd0ZXh0IG9mIGFueSBidXR0b24gaXMgdGV4dENvbnRlbnQgb2YgaXQnLFxuXSIsImltcG9ydCB7IFJvbGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnY29wdWxhIHNlbnRlbmNlJyxcbiAgICAnbm91biBwaHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnc3ViY2xhdXNlJyxcbiAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAnbXZlcmIgc2VudGVuY2UnLFxuICAgICdpdmVyYiBzZW50ZW5jZScsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gW1xuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbl1cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnbm91bicgYXMgUm9sZSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWyd0aGVuJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnc3ViY2xhdXNlJzogW1xuXG4gICAgXSxcblxuICAgICdub3VuIHBocmFzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcblxuICAgIF0sXG5cbiAgICAnY29wdWxhIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdhbmQgc2VudGVuY2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ212ZXJiIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdpdmVyYiBzZW50ZW5jZSc6IFtcblxuICAgIF1cbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG5leHBvcnQgdHlwZSBFbGVtZW50VHlwZTxUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTx1bmtub3duPj4gPSBUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTxpbmZlciBFbGVtZW50VHlwZT4gPyBFbGVtZW50VHlwZSA6IG5ldmVyO1xuIiwiaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IGdldE5ld0NvbnRleHQgfSBmcm9tIFwiLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5hcGhvcmEge1xuICAgIGFzc2VydChjbGF1c2U6IENsYXVzZSk6IHZvaWRcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbmFwaG9yYSgpOiBBbmFwaG9yYSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQgPSBnZXROZXdDb250ZXh0KHsgcm9vdDogdW5kZWZpbmVkIH0pKSB7XG5cbiAgICB9XG5cbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICAgICAgZ2V0QWN0dWF0b3IoKS50YWtlQWN0aW9uKGNsYXVzZS5jb3B5KHsgZXhhY3RJZHM6IHRydWUgfSksIHRoaXMuY29udGV4dClcbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5lbnZpcm8ucXVlcnkoY2xhdXNlKVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgd3JhcCB9IGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gJiYgIXRoaXMuZGljdGlvbmFyeVtpZF0uaXNQbGFjZWhvbGRlclxuXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0PzogV3JhcHBlcik6IFdyYXBwZXIge1xuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuXG4gICAgICAgIGlmICghb2JqZWN0KSB7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdID0gd3JhcChpZClcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cblxuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyPy5pc1BsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5zaW1wbGVQcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5zZXQocCkgLy9UT0RPOiBtYXliZSBiZXR0ZXIgcGxhY2Vob2xkZXIuY29weSh7b2JqZWN0Om9iamVjdH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBvYmplY3RcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9iamVjdFxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10geyAvLyBUT0RPOiByZWZhY3RvciBhbmQgaGFuZGxlIHByb25vdW5zIGJldHRlclxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gdGhpcy52YWx1ZXNcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LmNsYXVzZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSgpKVxuXG4gICAgICAgIGNvbnN0IG1hcHMgPSB1bml2ZXJzZS5xdWVyeShjbGF1c2UpXG4gICAgICAgIGNvbnN0IHByb25lbnRpdGllcyA9IGNsYXVzZS5lbnRpdGllcy5maWx0ZXIoZSA9PiBjbGF1c2UuZGVzY3JpYmUoZSkuc29tZSh4ID0+IHgudHlwZSA9PT0gJ3Byb25vdW4nKSlcblxuICAgICAgICBjb25zdCBwcm9uZXh0cmFzID0gcHJvbmVudGl0aWVzXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgW2VdOiB0aGlzLmxhc3RSZWZlcmVuY2VkID8/ICcnIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgY29uc3QgbWFwczIgPSBtYXBzLm1hcChtID0+ICh7IC4uLm0sIC4uLnByb25leHRyYXMgfSkpLmNvbmNhdChbcHJvbmV4dHJhc10pXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBtYXBzMi5mbGF0TWFwKHggPT4gT2JqZWN0LnZhbHVlcyh4KSkuYXQoLTEpID8/IHRoaXMubGFzdFJlZmVyZW5jZWRcblxuICAgICAgICByZXR1cm4gbWFwczIgIC8vIHJldHVybiBsaXN0IG9mIG1hcHMsIHdoZXJlIGVhY2ggbWFwIHNob3VsZCBzaG91bGQgaGF2ZSBBTEwgaWRzIGZyb20gY2xhdXNlIGluIGl0cyBrZXlzLCBlZzogW3tpZDI6aWQxLCBpZDQ6aWQzfSwge2lkMjoxLCBpZDQ6M31dLlxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgV3JhcHBlciwgeyBTZXRPcHMgfSBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgb2JqZWN0OiBhbnksXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcmVhZG9ubHkgaXNQbGFjZWhvbGRlcjogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgYWxpYXNlczogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHsgcGF0aDogc3RyaW5nW10sIGxleGVtZTogTGV4ZW1lIH0gfSA9IG9iamVjdC5zaW1wbGVDb25jZXB0cyA/PyB7fSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlUHJlZGljYXRlczogTGV4ZW1lW10gPSBbXSkge1xuXG4gICAgICAgIG9iamVjdC5zaW1wbGVDb25jZXB0cyA9IGFsaWFzZXNcbiAgICAgICAgb2JqZWN0LnNpbXBsZVByZWRpY2F0ZXMgPSBzaW1wbGVQcmVkaWNhdGVzXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKTogYW55IHtcblxuICAgICAgICBpZiAob3B0cz8uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbChwcmVkaWNhdGUsIG9wdHMuYXJncylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb3BzID0gb3B0cz8ucHJvcHMgPz8gW11cblxuICAgICAgICBpZiAodGhpcy5pc1BsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGUpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID4gMSkgeyAvLyBhc3N1bWUgPiAxIHByb3BzIGFyZSBhIHBhdGhcbiAgICAgICAgICAgIHRoaXMuc2V0TXVsdGlQcm9wKHByb3BzLCBwcmVkaWNhdGUsIG9wdHMpXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpbmdsZVByb3AocHJlZGljYXRlLCBwcm9wc1swXSwgb3B0cylcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0WmVyb1Byb3BzKHByZWRpY2F0ZSwgb3B0cylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldE11bHRpUHJvcChwYXRoOiBMZXhlbWVbXSwgdmFsdWU6IExleGVtZSwgb3B0cz86IFNldE9wcykge1xuXG4gICAgICAgIGlmIChvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXModmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLm1hcCh4ID0+IHgucm9vdCksICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocGF0aC5tYXAoeCA9PiB4LnJvb3QpLCB2YWx1ZS5yb290KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmFsaWFzZXNbcHJlZGljYXRlLmNvbmNlcHRzPy5hdCgwKSA/PyAnJ10/LnBhdGhcblxuICAgICAgICByZXR1cm4gcGF0aCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZChwYXRoKSA9PT0gcHJlZGljYXRlLnJvb3QgOlxuICAgICAgICAgICAgdGhpcy5pc1NpbXBsZVByZWRpY2F0ZShwcmVkaWNhdGUpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlOiBMZXhlbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5tYXAoeCA9PiB4LnJvb3QpLmluY2x1ZGVzKHByZWRpY2F0ZS5yb290KVxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFsaWFzZXNbY29uY2VwdE5hbWUucm9vdF0gPSB7IHBhdGg6IHByb3BQYXRoLm1hcCh4ID0+IHgucm9vdCksIGxleGVtZTogY29uY2VwdE5hbWUgfVxuICAgIH1cblxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHtcbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHRoaXMuYWxpYXNlc1t2ZXJiLnJvb3RdPy5wYXRoXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBjb25jZXB0Py5bMF0gPz8gdmVyYi5yb290XG4gICAgICAgIHJldHVybiB0aGlzPy5vYmplY3RbbWV0aG9kTmFtZV0oLi4uYXJncy5tYXAoeCA9PiB4Lm9iamVjdCkpXG4gICAgfVxuXG4gICAgZ2V0IGNsYXVzZSgpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHByZWRzOiBMZXhlbWVbXSA9XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmFsaWFzZXMpXG4gICAgICAgICAgICAgICAgLm1hcChrID0+IHRoaXMuZ2V0TmVzdGVkKHRoaXMuYWxpYXNlc1trXS5wYXRoKSlcbiAgICAgICAgICAgICAgICAubWFwKCh4KTogTGV4ZW1lID0+ICh7IHJvb3Q6IHgsIHR5cGU6ICdhZGplY3RpdmUnIH0pKVxuICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5zaW1wbGVQcmVkaWNhdGVzKVxuXG4gICAgICAgIHJldHVybiBwcmVkc1xuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHgsIHRoaXMuaWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKCkpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2luZ2xlUHJvcCh2YWx1ZTogTGV4ZW1lLCBwcm9wOiBMZXhlbWUsIG9wdHM/OiBTZXRPcHMpIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3Byb3Aucm9vdF0/LnBhdGggPz8gW3Byb3Aucm9vdF1cbiAgICAgICAgY29uc3QgdmFsID0gb3B0cz8ubmVnYXRlZCAmJiB0aGlzLmlzKHZhbHVlKSA/ICcnIDogdmFsdWUucm9vdFxuICAgICAgICB0aGlzLnNldE5lc3RlZChwYXRoLCB2YWwpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0WmVyb1Byb3BzKHByZWRpY2F0ZTogTGV4ZW1lLCBvcHRzPzogU2V0T3BzKSB7XG5cbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuYWxpYXNlc1twcmVkaWNhdGU/LmNvbmNlcHRzPy5bMF0gYXMgYW55XT8ucGF0aFxuXG4gICAgICAgIGlmIChwYXRoKSB7XG5cbiAgICAgICAgICAgIGlmICghb3B0cz8ubmVnYXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRzPy5uZWdhdGVkICYmIHRoaXMuaXMocHJlZGljYXRlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHBhdGgsICcnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMub2JqZWN0W3ByZWRpY2F0ZS5yb290XSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwcmVkaWNhdGUucm9vdF0gPSAhb3B0cz8ubmVnYXRlZFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRTaW1wbGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0U2ltcGxlUHJlZGljYXRlKHByZWRpY2F0ZTogTGV4ZW1lKSB7XG4gICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSkgLy9UT0RPOiBjaGVjayBkdXBsaWNhdGVzIVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHhcblxuICAgIH1cblxuICAgIHR5cGVPZih3b3JkOiBzdHJpbmcpOiBMZXhlbWVUeXBlIHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5hbGlhc2VzW3dvcmRdPy5wYXRoID8/IFt3b3JkXVxuICAgICAgICBjb25zdCB3ID0gdGhpcy5nZXROZXN0ZWQocGF0aClcblxuICAgICAgICBpZiAodHlwZW9mIHcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiAody5sZW5ndGggPz8gMCkgPiAwID8gJ212ZXJiJyA6ICdpdmVyYidcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnbm91bidcbiAgICB9XG5cbiAgICAvLyBwcm90ZWN0ZWQgY29weSgpOiBXcmFwcGVyIHtcblxuICAgIC8vICAgICBsZXQgd3JhcHBlZFxuXG4gICAgLy8gICAgIGlmICh0aGlzLm9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgLy8gICAgICAgICB3cmFwcGVkID0gdGhpcy5vYmplY3QuY2xvbmVOb2RlKCkgYXMgSFRNTEVsZW1lbnRcbiAgICAvLyAgICAgICAgIHdyYXBwZWQuaW5uZXJIVE1MID0gdGhpcy5vYmplY3QuaW5uZXJIVE1MXG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICB3cmFwcGVkID0geyAuLi50aGlzLm9iamVjdCB9XG4gICAgLy8gICAgIH1cblxuICAgIC8vICAgICByZXR1cm4gbmV3IEJhc2VXcmFwcGVyKHdyYXBwZWQsXG4gICAgLy8gICAgICAgICB0aGlzLmlkLFxuICAgIC8vICAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyLFxuICAgIC8vICAgICAgICAgdGhpcy5zaW1wbGVDb25jZXB0cyxcbiAgICAvLyAgICAgICAgIHRoaXMuc2ltcGxlUHJlZGljYXRlcylcbiAgICAvLyB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q/OiBXcmFwcGVyKTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhblxuICAgIHJlYWRvbmx5IHZhbHVlczogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgQmFzZVdyYXBwZXIgZnJvbSBcIi4vQmFzZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBpZDogSWRcbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHJlYWRvbmx5IGNsYXVzZTogQ2xhdXNlXG5cbiAgICByZWFkb25seSBzaW1wbGVQcmVkaWNhdGVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IGlzUGxhY2Vob2xkZXI6IGJvb2xlYW5cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgb3B0cz86IFNldE9wcyk6IGFueVxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWRcbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pOiB2b2lkXG4gICAgdHlwZU9mKHdvcmQ6IHN0cmluZyk6IExleGVtZVR5cGUgfCB1bmRlZmluZWRcblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNldE9wcyB7XG4gICAgcHJvcHM/OiBMZXhlbWVbXVxuICAgIG5lZ2F0ZWQ/OiBib29sZWFuXG4gICAgYXJncz86IFdyYXBwZXJbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChpZDogSWQsIG8/OiBPYmplY3QpOiBXcmFwcGVyIHtcbiAgICByZXR1cm4gbmV3IEJhc2VXcmFwcGVyKG8gPz8ge30sIGlkLCBvID09PSB1bmRlZmluZWQpXG59XG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpIiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBnZXRMZXhlbWVzLCBpc011bHRpV29yZCwgTGV4ZW1lLCByZXNwYWNlLCBzdGRzcGFjZSwgdW5zcGFjZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkgeyAvLyBUT0RPOiBtYWtlIGNhc2UgaW5zZW5zaXRpdmVcblxuICAgICAgICBjb25zdCB3b3JkcyA9XG4gICAgICAgICAgICB0aGlzLmpvaW5NdWx0aVdvcmRMZXhlbWVzKHN0ZHNwYWNlKHNvdXJjZUNvZGUpLCBjb250ZXh0LmNvbmZpZy5sZXhlbWVzKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiByZXNwYWNlKHMpKVxuXG4gICAgICAgIHRoaXMudG9rZW5zID0gd29yZHMuZmxhdE1hcCh3ID0+IGdldExleGVtZXModywgY29udGV4dCwgd29yZHMpKVxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGpvaW5NdWx0aVdvcmRMZXhlbWVzKHNvdXJjZUNvZGU6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pIHtcblxuICAgICAgICBsZXQgbmV3U291cmNlID0gc291cmNlQ29kZVxuXG4gICAgICAgIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiBpc011bHRpV29yZCh4KSlcbiAgICAgICAgICAgIC5mb3JFYWNoKHggPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxleGVtZSA9IHN0ZHNwYWNlKHgucm9vdClcbiAgICAgICAgICAgICAgICBuZXdTb3VyY2UgPSBuZXdTb3VyY2UucmVwbGFjZUFsbChsZXhlbWUsIHVuc3BhY2UobGV4ZW1lKSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIG5ld1NvdXJjZVxuICAgIH1cblxufSIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vYnJhaW4vQ29udGV4dFwiXG5pbXBvcnQgeyBjbGF1c2VPZiB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyByZWFkb25seSByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogTGV4ZW1lVHlwZVxuICAgIC8qKnVzZWZ1bCBmb3IgaXJyZWd1bGFyIHN0dWZmKi8gcmVhZG9ubHkgZm9ybXM/OiBzdHJpbmdbXVxuICAgIC8qKnJlZmVycyB0byB2ZXJiIGNvbmp1Z2F0aW9ucyBvciBwbHVyYWwgZm9ybXMsIGFzc3VtZSByZWd1bGFyaXR5Ki8gcmVhZG9ubHkgaXJyZWd1bGFyPzogYm9vbGVhblxuICAgIC8qKnNlbWFudGljYWwgZGVwZW5kZWNlKi8gcmVhZG9ubHkgZGVyaXZlZEZyb20/OiBzdHJpbmdcbiAgICAvKipzZW1hbnRpY2FsIGVxdWl2YWxlbmNlKi8gcmVhZG9ubHkgYWxpYXNGb3I/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovIHJlYWRvbmx5IGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW11cbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqL3JlYWRvbmx5IHRva2VuPzogc3RyaW5nXG4gICAgLyoqZm9yIHF1YW50YWRqICovIHJlYWRvbmx5IGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICByZWFkb25seSBjb25jZXB0cz86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgcHJvdG8/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1zT2YobGV4ZW1lOiBMZXhlbWUpIHtcblxuICAgIHJldHVybiBbbGV4ZW1lLnJvb3RdLmNvbmNhdChsZXhlbWU/LmZvcm1zID8/IFtdKVxuICAgICAgICAuY29uY2F0KCFsZXhlbWUuaXJyZWd1bGFyID8gW2Ake2xleGVtZS5yb290fXNgXSA6IFtdKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgY29udGV4dDogQ29udGV4dCwgd29yZHM6IHN0cmluZ1tdKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWUgPVxuICAgICAgICBjb250ZXh0LmNvbmZpZy5sZXhlbWVzLmZpbHRlcih4ID0+IGZvcm1zT2YoeCkuaW5jbHVkZXMod29yZCkpLmF0KDApXG4gICAgICAgID8/IGdldExleGVtZSh3b3JkLCBjb250ZXh0LCB3b3JkcylcblxuICAgIGNvbnN0IGxleGVtZTI6IExleGVtZSA9IHsgLi4ubGV4ZW1lLCB0b2tlbjogd29yZCB9XG5cbiAgICByZXR1cm4gbGV4ZW1lMi5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleGVtZTIuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgY29udGV4dCwgd29yZHMpKSA6XG4gICAgICAgIFtsZXhlbWUyXVxuXG59XG5cbmZ1bmN0aW9uIGdldExleGVtZSh3b3JkOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQsIHdvcmRzOiBzdHJpbmdbXSk6IExleGVtZSB7XG5cbiAgICBjb25zdCB0eXBlcyA9IHdvcmRzXG4gICAgICAgIC5tYXAodyA9PiBjbGF1c2VPZih7IHJvb3Q6IHcsIHR5cGU6ICdhbnknIH0sICdYJykpXG4gICAgICAgIC5mbGF0TWFwKGMgPT4gY29udGV4dC5lbnZpcm8ucXVlcnkoYykpXG4gICAgICAgIC5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgLm1hcChpZCA9PiBjb250ZXh0LmVudmlyby5nZXQoaWQpKVxuICAgICAgICAubWFwKHggPT4geD8udHlwZU9mKHdvcmQpKVxuICAgICAgICAuZmlsdGVyKHggPT4geCAhPT0gdW5kZWZpbmVkKVxuXG4gICAgY29uc3QgaXNWZXJiID0gdHlwZXNbMF0gPT09ICdtdmVyYicgfHwgdHlwZXNbMF0gPT09ICdpdmVyYidcblxuICAgIGlmICghaXNWZXJiICYmIHdvcmQuYXQoLTEpID09PSAncycpIHtcbiAgICAgICAgcmV0dXJuIGdldExleGVtZSh3b3JkLnNsaWNlKDAsIC0xKSwgY29udGV4dCwgd29yZHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcm9vdDogd29yZCwgdHlwZTogdHlwZXNbMF0gPz8gJ25vdW4nIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3RvKGxleGVtZTogTGV4ZW1lKTogT2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpPy5bbGV4ZW1lLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25jZXB0KGxleGVtZT86IExleGVtZSkge1xuICAgIHJldHVybiBsZXhlbWU/LmNvbmNlcHRzPy5pbmNsdWRlcygnY29uY2VwdCcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc011bHRpV29yZChsZXhlbWU6IExleGVtZSkge1xuICAgIHJldHVybiBsZXhlbWUucm9vdC5pbmNsdWRlcygnICcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCcgJywgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnLScsICcgJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJylcbn0iLCJpbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2JyYWluL0NvbnRleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vYnJhaW4vQ29udGV4dFwiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuY29uZmlnLnN5bnRheExpc3QpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUpIHtcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb250ZXh0LmNvbmZpZy5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5jb25maWcuZ2V0U3ludGF4KG5hbWUpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2VNZW1iZXIobSlcblxuICAgICAgICAgICAgaWYgKCFhc3QgJiYgaXNOZWNlc3NhcnkobS5udW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpbmtzW20ucm9sZSA/PyBhc3QudHlwZV0gPSBhc3RcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGxpbmtzKS5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IG5hbWUsXG4gICAgICAgICAgICByb2xlOiByb2xlLFxuICAgICAgICAgICAgbGlua3M6IGxpbmtzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNZW1iZXIgPSAobTogTWVtYmVyLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpc3Q6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5UGFyc2UobS50eXBlLCBtLnJvbGUpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiBsaXN0WzBdLnR5cGUsXG4gICAgICAgICAgICBsaXN0OiBsaXN0XG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzTGVhZiA9ICh0OiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY29uZmlnLmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBTeW50YXgsIE1lbWJlciwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGZ1bmN0aW9uIG1hY3JvVG9TeW50YXgobWFjcm86IEFzdE5vZGUpOiB7IG5hbWU6IHN0cmluZywgc3ludGF4OiBTeW50YXggfSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/Lm5vdW4/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ncmFtbWFyKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKTogQXN0VHlwZVtdIHtcblxuICAgIGNvbnN0IHggPSAoc3ludGF4ZXNbYV0gPz8gW10pLmZsYXRNYXAobSA9PiBtLnR5cGUpXG4gICAgcmV0dXJuIHhcbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuLi9icmFpbi9CYXNpY0JyYWluXCI7XG5pbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiO1xuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbiAgICB0ZXN0MTAsXG4gICAgdGVzdDExLFxuICAgIHRlc3QxMixcbiAgICB0ZXN0MTMsXG4gICAgdGVzdDE0LFxuICAgIHRlc3QxNSxcbiAgICB0ZXN0MTYsXG4gICAgdGVzdDE3LFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXN0KCkgPyAnc3VjY2VzcycgOiAnZmFpbCcsIHRlc3QubmFtZSlcbiAgICAgICAgYXdhaXQgc2xlZXAoNzUpXG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmNvbnRleHQuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgneScpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdidXR0b24nKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCdyZWQnKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3QxMSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYW5kIHcgYXJlIGJ1dHRvbnMnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYXJlIHJlZCcpXG4gICAgYnJhaW4uZXhlY3V0ZSgndyBhbmQgeiBhcmUgYmxhY2snKVxuXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd3JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmRcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0NCA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzICYmIGFzc2VydDRcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGFuZCB5IGFyZSBidXR0b25zJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGFwcGVuZENoaWxkcyB5JylcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhicmFpbi5leGVjdXRlKCd4JylbMF0uY2hpbGRyZW4pLmluY2x1ZGVzKGJyYWluLmV4ZWN1dGUoJ3knKVswXSlcbn1cblxuZnVuY3Rpb24gdGVzdDEzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbiBhbmQgaXQgaXMgZ3JlZW4nKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xufVxuXG5mdW5jdGlvbiB0ZXN0MTQoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgYnV0dG9ucy4geCBhbmQgeSBhcmUgcmVkIGFuZCB6IGlzIGdyZWVuLicpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd6JylbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhcmUgbm90IHJlZC4nKVxuXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAncmVkJ1xuICAgICAgICAmJiBicmFpbi5leGVjdXRlKCd5JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ3JlZCdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcblxufVxuXG5mdW5jdGlvbiB0ZXN0MTUoKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggYW5kIHkgYW5kIHogYXJlIGJ1dHRvbnMuIGV2ZXJ5IGJ1dHRvbiBpcyBibHVlLicpXG4gICAgYnJhaW4uZXhlY3V0ZSgneiBpcyByZWQuJylcbiAgICBicmFpbi5leGVjdXRlKCdldmVyeSBidXR0b24gaXMgbm90IGJsdWUuJylcblxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JylbMF0uc3R5bGUuYmFja2dyb3VuZCAhPT0gJ2JsdWUnXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGUoJ3knKVswXS5zdHlsZS5iYWNrZ3JvdW5kICE9PSAnYmx1ZSdcbiAgICAgICAgJiYgYnJhaW4uZXhlY3V0ZSgneicpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG5cbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5mdW5jdGlvbiB0ZXN0MTYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbih7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSlcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGhpZGRlbicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IGJyYWluLmV4ZWN1dGUoJ3gnKVswXS5oaWRkZW5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIG5vdCBoaWRkZW4nKVxuICAgIGNvbnN0IGFzc2VydDIgPSAhYnJhaW4uZXhlY3V0ZSgneCcpWzBdLmhpZGRlblxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDE3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oeyByb290OiBkb2N1bWVudC5ib2R5IH0pXG5cbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uJylcbiAgICBjb25zdCB4ID0gYnJhaW4uZXhlY3V0ZSgneCcpWzBdXG4gICAgeC5vbmNsaWNrID0gKCkgPT4gYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggY2xpY2tzJylcbiAgICByZXR1cm4geC5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuXG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=