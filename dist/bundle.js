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
    constructor(id, concept, topLevel) {
        this.id = id;
        this.concept = concept;
        this.topLevel = topLevel;
    }
    run(context) {
        const inst = this.topLevel.theme.describe(this.id)[0].root;
        context.config.setLexeme({
            root: inst,
            type: 'adjective',
            concepts: [this.concept.root],
        });
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
const Wrapper_1 = __webpack_require__(/*! ../../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
class CreateAction {
    constructor(id, predicate) {
        this.id = id;
        this.predicate = predicate;
    }
    run(context) {
        var _a;
        if (context.enviro.exists(this.id)) { //  existence check prior to creating
            return;
        }
        const proto = (0, Lexeme_1.getProto)(this.predicate);
        if (proto instanceof HTMLElement) {
            const tagNameFromProto = (x) => x.constructor.name.replace('HTML', '').replace('Element', '').toLowerCase();
            const o = document.createElement(tagNameFromProto(proto));
            (_a = context.enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
            o.id = this.id + '';
            o.textContent = 'default';
            const newObj = (0, Wrapper_1.wrap)(o, context);
            newObj.set(this.predicate);
            context.enviro.set(this.id, newObj);
        }
        else {
            const o = new proto.constructor();
            const newObj = (0, Wrapper_1.wrap)(o, context);
            newObj.set(this.predicate);
            context.enviro.set(this.id, newObj);
        }
    }
}
exports["default"] = CreateAction;


/***/ }),

/***/ "./app/src/actuator/actions/EditAction.ts":
/*!************************************************!*\
  !*** ./app/src/actuator/actions/EditAction.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
class EditAction {
    constructor(id, predicate, props) {
        this.id = id;
        this.predicate = predicate;
        this.props = props;
    }
    run(context) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const obj = (_a = context.enviro.get(this.id)) !== null && _a !== void 0 ? _a : context.enviro.setPlaceholder(this.id);
            obj.set(this.predicate, this.props);
        });
    }
}
exports["default"] = EditAction;


/***/ }),

/***/ "./app/src/actuator/actions/ImplyAction.ts":
/*!*************************************************!*\
  !*** ./app/src/actuator/actions/ImplyAction.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ../../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/actuator/actions/EditAction.ts"));
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
        (0, Wrapper_1.wrap)(proto).setAlias(newLexeme, propsNames);
        // console.log(`wrap(${proto}).setAlias(${conceptName[0]}, [${propsNames}])`)
    }
    other(context) {
        const top = this.condition.topLevel()[0];
        const protoName = this.condition.describe(top)[0]; // assume one 
        const predicate = this.conclusion.describe(top)[0];
        const y = context.enviro.query((0, Clause_1.clauseOf)(protoName, 'X'));
        const ids = y.map(m => m['X']);
        ids.forEach(id => new EditAction_1.default(id, predicate).run(context));
    }
}
exports["default"] = ImplyAction;


/***/ }),

/***/ "./app/src/actuator/actions/RelationAction.ts":
/*!****************************************************!*\
  !*** ./app/src/actuator/actions/RelationAction.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class RelationAction {
    constructor(topLevel, verb, args, negated) {
        this.topLevel = topLevel;
        this.verb = verb;
        this.args = args;
        this.negated = negated;
    }
    run(context) {
        var _a, _b;
        const subjectId = (_a = context
            .enviro
            .query(this.topLevel.theme.about(this.args[0]))
            .at(0)) === null || _a === void 0 ? void 0 : _a[this.args[0]];
        const objectId = (_b = context
            .enviro
            .query(this.topLevel.theme.about(this.args[1]))
            .at(0)) === null || _b === void 0 ? void 0 : _b[this.args[1]];
        const subject = context.enviro.get(subjectId !== null && subjectId !== void 0 ? subjectId : '');
        const object = context.enviro.get(objectId !== null && objectId !== void 0 ? objectId : '');
        // const concept = (subject as any).simpleConcepts[this.verb.root]
        // const methodName = concept?.[0] ?? this.verb.root
        // return subject?.object[methodName](object?.object)
        subject === null || subject === void 0 ? void 0 : subject.call(this.verb, [object]);
    }
}
exports["default"] = RelationAction;


/***/ }),

/***/ "./app/src/actuator/actions/RootAction.ts":
/*!************************************************!*\
  !*** ./app/src/actuator/actions/RootAction.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const ConceptAction_1 = __importDefault(__webpack_require__(/*! ./ConceptAction */ "./app/src/actuator/actions/ConceptAction.ts"));
const CreateAction_1 = __importDefault(__webpack_require__(/*! ./CreateAction */ "./app/src/actuator/actions/CreateAction.ts"));
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/actuator/actions/EditAction.ts"));
const RelationAction_1 = __importDefault(__webpack_require__(/*! ./RelationAction */ "./app/src/actuator/actions/RelationAction.ts"));
class RootAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (this.clause.args.length > 1 && this.clause.predicate.root !== 'of') { // relations 
            return new RelationAction_1.default(this.topLevel, this.clause.predicate, this.clause.args, this.clause.negated).run(context);
        }
        if (this.clause.exactIds) {
            return new EditAction_1.default(this.clause.args[0], this.clause.predicate, []).run(context);
        }
        if (this.topLevel.rheme.describe(this.clause.args[0]).some(x => (0, Lexeme_1.isConcept)(x))) { // 
            return new ConceptAction_1.default(this.clause.args[0], this.clause.predicate, this.topLevel).run(context);
        }
        if (this.topLevel.topLevel().includes(this.clause.args[0])) {
            this.forTopLevel(context);
        }
        else {
            this.forNonTopLevel(context);
        }
    }
    getProps(topLevelEntity) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]); // ASSUME at least one
    }
    forTopLevel(context) {
        var _a, _b;
        const q = this.topLevel.theme.about(this.clause.args[0]);
        const maps = context.enviro.query(q);
        const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
        if (!context.enviro.get(id)) {
            context.enviro.setPlaceholder(id);
        }
        if (this.clause.predicate.proto) {
            return new CreateAction_1.default(id, this.clause.predicate).run(context);
        }
        else {
            return new EditAction_1.default(id, this.clause.predicate, this.getProps(this.clause.args[0])).run(context);
        }
    }
    forNonTopLevel(context) {
        var _a;
        const tLOwner = this.getTopLevelOwnerOf(this.clause.args[0], this.topLevel);
        if (!tLOwner) {
            return;
        }
        const nameOfThis = this.topLevel.theme.describe(this.clause.args[0]);
        if (this.clause.predicate.root == nameOfThis[0].root) {
            return;
        }
        const q = this.topLevel.theme.about(tLOwner);
        const maps = context.enviro.query(q);
        const tLOwnerId = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[tLOwner]; //?? getRandomId()
        return new EditAction_1.default(tLOwnerId, this.clause.predicate, this.getProps(tLOwner)).run(context);
    }
    getTopLevelOwnerOf(id, topLevel) {
        const owners = topLevel.ownersOf(id);
        const maybe = owners
            .filter(o => topLevel.topLevel().includes(o)).at(0);
        if (!maybe && owners.length > 0) {
            return this.getTopLevelOwnerOf(owners[0], topLevel);
        }
        else {
            return maybe;
        }
    }
}
exports["default"] = RootAction;


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
            if (ast.type == 'macro') {
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
function getBrain() {
    return new BasicBrain_1.default((0, Context_1.getNewContext)());
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
function getNewContext() {
    return {
        enviro: (0, Enviro_1.default)({ root: document.body }),
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
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
class And {
    constructor(clause1, clause2, clause2IsRheme, negated = false, exactIds = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments))) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
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
const RootAction_1 = __importDefault(__webpack_require__(/*! ../actuator/actions/RootAction */ "./app/src/actuator/actions/RootAction.ts"));
class BasicClause {
    constructor(predicate, args, negated = false, exactIds = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), rheme = (0, Clause_1.emptyClause)()) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
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
        return [new RootAction_1.default(this, topLevel)];
    }
    get theme() {
        return this;
    }
    get entities() {
        return Array.from(new Set(this.args));
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
    constructor(negated = false, isImply = false, hashCode = 99999999, entities = [], isSideEffecty = false, exactIds = false) {
        this.negated = negated;
        this.isImply = isImply;
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
class Imply {
    constructor(condition, consequence, negated = false, exactIds = false, isSideEffecty = false, isImply = true, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = condition, rheme = consequence) {
        this.condition = condition;
        this.consequence = consequence;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
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
        return [
            'macro',
            'macropart',
            'taggedunion',
            'and sentence',
            'copula sentence',
            'complement',
            'subclause',
            'noun phrase'
        ];
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
    // {
    //     root: 'contain',
    //     type: 'mverb'
    // }
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
    'and sentence': [
        { type: ['copula sentence', 'noun phrase'], number: 1, role: 'left' },
        { type: ['nonsubconj'], number: 1 },
        { type: ['and sentence', 'copula sentence', 'noun phrase'], number: '+', role: 'right' }
    ],
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAnaphora = void 0;
const Actuator_1 = __webpack_require__(/*! ../actuator/actuator/Actuator */ "./app/src/actuator/actuator/Actuator.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ./Enviro */ "./app/src/enviro/Enviro.ts"));
function getAnaphora() {
    return new EnviroAnaphora();
}
exports.getAnaphora = getAnaphora;
class EnviroAnaphora {
    constructor(enviro = (0, Enviro_1.default)({ root: undefined })) {
        this.enviro = enviro;
    }
    assert(clause) {
        (0, Actuator_1.getActuator)().takeAction(clause.copy({ exactIds: true }), { enviro: this.enviro, config: { /* TODO assuming anaphora dont care about lexeme and syntaxes config*/} });
    }
    query(clause) {
        return this.enviro.query(clause);
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
    setPlaceholder(id) {
        this.dictionary[id] = new Placeholder_1.Placeholder();
        return this.dictionary[id];
    }
    exists(id) {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder_1.Placeholder);
    }
    set(id, object) {
        const placeholder = this.dictionary[id];
        if (placeholder && placeholder instanceof Placeholder_1.Placeholder) {
            placeholder.predicates.forEach(p => {
                object.set(p);
            });
            this.dictionary[id] = object;
        }
        this.lastReferenced = id;
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ConcreteWrapper {
    constructor(object, simpleConcepts) {
        var _a;
        if (simpleConcepts === void 0) { simpleConcepts = (_a = object.simpleConcepts) !== null && _a !== void 0 ? _a : {}; }
        this.object = object;
        this.simpleConcepts = simpleConcepts;
        object.simpleConcepts = simpleConcepts;
    }
    set(predicate, props) {
        if (props && props.length > 1) { // assume > 1 props are a path
            this.setNested(props.map(x => { var _a; return (_a = x.token) !== null && _a !== void 0 ? _a : x.root; }), predicate.root);
        }
        else if (props && props.length === 1) { // single prop
            if (Object.keys(this.simpleConcepts).includes(props[0].root)) { // is concept 
                this.setNested(this.simpleConcepts[props[0].root], predicate.root);
            }
            else { // ... not concept, just prop
                this.setNested(props.map(x => { var _a; return (_a = x.token) !== null && _a !== void 0 ? _a : x.root; }), predicate.root);
            }
        }
        else if (!props || props.length === 0) { // no props
            if (predicate.concepts && predicate.concepts.length > 0) {
                this.setNested(this.simpleConcepts[predicate.concepts[0]], predicate.root);
            }
            else {
                this.object[predicate.root] = true; // fallback
            }
        }
    }
    is(predicate) {
        var _a;
        const concept = (_a = predicate.concepts) === null || _a === void 0 ? void 0 : _a.at(0);
        return concept ?
            this.getNested(this.simpleConcepts[concept]) === predicate.root :
            this.object[predicate.root] !== undefined;
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName.root] = propPath.map(x => x.root);
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
    pointOut(opts) {
        if (this.object instanceof HTMLElement) {
            this.object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
        }
    }
    call(verb, args) {
        var _a;
        // throw new Error("Method not implemented.");
        const concept = this.simpleConcepts[verb.root];
        const methodName = (_a = concept === null || concept === void 0 ? void 0 : concept[0]) !== null && _a !== void 0 ? _a : verb.root;
        return this === null || this === void 0 ? void 0 : this.object[methodName](...args.map(x => x.object));
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Placeholder = void 0;
class Placeholder {
    constructor(predicates = [], object = {}) {
        this.predicates = predicates;
        this.object = object;
    }
    set(predicate, props) {
        this.predicates.push(predicate);
    }
    is(predicate) {
        return this.predicates.some(x => x.root == predicate.root);
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
function wrap(o, context) {
    const allPropsOf = (x) => {
        const result = [];
        let y = x;
        do {
            result.push(...Object.getOwnPropertyNames(y));
        } while ((y = Object.getPrototypeOf(y)));
        return result;
    };
    if (context) {
        const props = allPropsOf(o);
        props.forEach(x => {
            if (!context.config.lexemes.map(l => l.root).includes(x)) {
                context.config.setLexeme({ root: x, type: 'mverb' });
            }
        });
    }
    return new ConcreteWrapper_1.default(o);
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
        brain: (0, Brain_1.getBrain)(),
        promptVisible: false
    };
    const update = () => {
        textarea.hidden = !state.promptVisible;
        state.promptVisible ? textarea.focus() : 0;
    };
    window.brain = state.brain;
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
    test11
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
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is red. x is a button. y is a green button.');
    const assert1 = (brain.execute('a green button'))[0].style.background === 'green';
    const assert2 = (brain.execute('a red button'))[0].style.background === 'red';
    return assert1 && assert2;
}
function test2() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
    const assert1 = brain.context.enviro.values.length === 1;
    return assert1;
}
function test3() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
    const assert1 = (brain.execute('a red button'))[0].style.background === 'red';
    const assert2 = (brain.execute('a green button'))[0].style.background === 'green';
    const assert3 = (brain.execute('a black button'))[0].style.background === 'black';
    return assert1 && assert2 && assert3;
}
function test4() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('a button is a button.');
    const button = brain.execute('button');
    return button !== undefined;
}
function test5() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a button. the color of x is red.');
    const assert1 = (brain.execute('x'))[0].style.background === 'red';
    return assert1;
}
function test6() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a button. the background of style of x is green.');
    const assert1 = (brain.execute('x'))[0].style.background === 'green';
    return assert1;
}
function test7() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a button. y is a button. z is a button. every button is red.');
    const assert1 = (brain.execute('x'))[0].style.background === 'red';
    const assert2 = (brain.execute('y'))[0].style.background === 'red';
    const assert3 = (brain.execute('z'))[0].style.background === 'red';
    return assert1 && assert2 && assert3;
}
function test8() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a button. text of x is capra.');
    const assert1 = (brain.execute('button'))[0].textContent == 'capra';
    return assert1;
}
function test9() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a red button. x is green.');
    const assert1 = (brain.execute('red')).length === 0;
    const assert2 = (brain.execute('green')).length === 1;
    return assert1 && assert2;
}
function test10() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is a red button. y is a green button. z is a blue button. the red button. it is black.');
    const assert1 = brain.execute('x').at(0).style.background == 'black';
    const assert2 = brain.execute('y').at(0).style.background == 'green';
    const assert3 = brain.execute('z').at(0).style.background == 'blue';
    return assert1 && assert2 && assert3;
}
function test11() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x and y and z and w are buttons');
    brain.execute('x and y are red');
    brain.execute('w and z are black');
    const assert1 = brain.execute('x').at(0).style.background === brain.execute('y').at(0).style.background;
    const assert2 = brain.execute('w').at(0).style.background === brain.execute('z').at(0).style.background;
    const assert3 = brain.execute('x').at(0).style.background === 'red';
    const assert4 = brain.execute('w').at(0).style.background === 'black';
    return assert1 && assert2 && assert3 && assert4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9Db25jZXB0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9DcmVhdGVBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0VkaXRBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9hY3Rpb25zL0ltcGx5QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9SZWxhdGlvbkFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvUm9vdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9CYXNpY0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N0YXJ0dXBDb21tYW5kcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy91dGlscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9BbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0NvbmNyZXRlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vUGxhY2Vob2xkZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNlcHRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBjb25jZXB0OiBMZXhlbWUsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgaW5zdCA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUodGhpcy5pZClbMF0ucm9vdFxuXG4gICAgICAgIGNvbnRleHQuY29uZmlnLnNldExleGVtZSh7XG4gICAgICAgICAgICByb290OiBpbnN0LFxuICAgICAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgICAgICBjb25jZXB0czogW3RoaXMuY29uY2VwdC5yb290XSxcbiAgICAgICAgfSlcblxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9icmFpbi9Db250ZXh0XCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUsIGdldFByb3RvIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KTogYW55IHtcblxuICAgICAgICBpZiAoY29udGV4dC5lbnZpcm8uZXhpc3RzKHRoaXMuaWQpKSB7IC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0aGlzLnByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgICAgICBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IE9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lLnJlcGxhY2UoJ0hUTUwnLCAnJykucmVwbGFjZSgnRWxlbWVudCcsICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICBvLmlkID0gdGhpcy5pZCArICcnXG4gICAgICAgICAgICBvLnRleHRDb250ZW50ID0gJ2RlZmF1bHQnXG4gICAgICAgICAgICBjb25zdCBuZXdPYmogPSB3cmFwKG8sIGNvbnRleHQpXG4gICAgICAgICAgICBuZXdPYmouc2V0KHRoaXMucHJlZGljYXRlKVxuICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gbmV3IChwcm90byBhcyBhbnkpLmNvbnN0cnVjdG9yKClcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobywgY29udGV4dClcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBjb250ZXh0LmVudmlyby5zZXQodGhpcy5pZCwgbmV3T2JqKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSwgcmVhZG9ubHkgcHJvcHM/OiBMZXhlbWVbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGNvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvYmogPSBjb250ZXh0LmVudmlyby5nZXQodGhpcy5pZCkgPz8gY29udGV4dC5lbnZpcm8uc2V0UGxhY2Vob2xkZXIodGhpcy5pZClcbiAgICAgICAgb2JqLnNldCh0aGlzLnByZWRpY2F0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG5cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi8uLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IEVkaXRBY3Rpb24gZnJvbSBcIi4vRWRpdEFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSwgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCk6IGFueSB7XG5cbiAgICAgICAgY29uc3QgaXNTZXRBbGlhc0NhbGwgPSAgLy8gYXNzdW1lIGlmIGF0IGxlYXN0IG9uZSBvd25lZCBlbnRpdHkgdGhhdCBpdCdzIGEgc2V0IGFsaWFzIGNhbGxcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuICAgICAgICAgICAgfHwgdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uY2x1c2lvbi50b3BMZXZlbCgpWzBdKS5zbGljZSgxKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXNTZXRBbGlhc0NhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXNDYWxsKGNvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm90aGVyKGNvbnRleHQpXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2V0QWxpYXNDYWxsKGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG5cbiAgICAgICAgY29uc3Qgb2xkVHlwZSA9IHByb3BzTmFtZXNbMF0udHlwZVxuICAgICAgICBjb25zdCB0eXBlID0gb2xkVHlwZSA/PyAnbm91bidcbiAgICAgICAgY29uc3QgbmV3TGV4ZW1lID0geyAuLi5jb25jZXB0TmFtZVswXSwgdHlwZTogdHlwZSB9XG5cbiAgICAgICAgY29udGV4dC5jb25maWcuc2V0TGV4ZW1lKG5ld0xleGVtZSlcbiAgICAgICAgd3JhcChwcm90bykuc2V0QWxpYXMobmV3TGV4ZW1lLCBwcm9wc05hbWVzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgd3JhcCgke3Byb3RvfSkuc2V0QWxpYXMoJHtjb25jZXB0TmFtZVswXX0sIFske3Byb3BzTmFtZXN9XSlgKVxuICAgIH1cblxuICAgIG90aGVyKGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXVxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZSh0b3ApWzBdXG4gICAgICAgIGNvbnN0IHkgPSBjb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2VPZihwcm90b05hbWUsICdYJykpXG4gICAgICAgIGNvbnN0IGlkcyA9IHkubWFwKG0gPT4gbVsnWCddKVxuICAgICAgICBpZHMuZm9yRWFjaChpZCA9PiBuZXcgRWRpdEFjdGlvbihpZCwgcHJlZGljYXRlKS5ydW4oY29udGV4dCkpXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGlvbkFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgdmVyYjogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhbikge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpIHtcblxuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGNvbnRleHRcbiAgICAgICAgICAgIC5lbnZpcm9cbiAgICAgICAgICAgIC5xdWVyeSh0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRoaXMuYXJnc1swXSkpXG4gICAgICAgICAgICAuYXQoMClcbiAgICAgICAgICAgID8uW3RoaXMuYXJnc1swXV1cblxuICAgICAgICBjb25zdCBvYmplY3RJZCA9IGNvbnRleHRcbiAgICAgICAgICAgIC5lbnZpcm9cbiAgICAgICAgICAgIC5xdWVyeSh0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRoaXMuYXJnc1sxXSkpXG4gICAgICAgICAgICAuYXQoMClcbiAgICAgICAgICAgID8uW3RoaXMuYXJnc1sxXV1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gY29udGV4dC5lbnZpcm8uZ2V0KHN1YmplY3RJZCA/PyAnJylcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gY29udGV4dC5lbnZpcm8uZ2V0KG9iamVjdElkID8/ICcnKTtcblxuICAgICAgICAvLyBjb25zdCBjb25jZXB0ID0gKHN1YmplY3QgYXMgYW55KS5zaW1wbGVDb25jZXB0c1t0aGlzLnZlcmIucm9vdF1cbiAgICAgICAgLy8gY29uc3QgbWV0aG9kTmFtZSA9IGNvbmNlcHQ/LlswXSA/PyB0aGlzLnZlcmIucm9vdFxuICAgICAgICAvLyByZXR1cm4gc3ViamVjdD8ub2JqZWN0W21ldGhvZE5hbWVdKG9iamVjdD8ub2JqZWN0KVxuXG4gICAgICAgIHN1YmplY3Q/LmNhbGwodGhpcy52ZXJiLCBbb2JqZWN0XSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IHsgaXNDb25jZXB0IH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCBDb25jZXB0QWN0aW9uIGZyb20gXCIuL0NvbmNlcHRBY3Rpb25cIjtcbmltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCI7XG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCI7XG5pbXBvcnQgUmVsYXRpb25BY3Rpb24gZnJvbSBcIi4vUmVsYXRpb25BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IEJhc2ljQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCk6IGFueSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MubGVuZ3RoID4gMSAmJiB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCAhPT0gJ29mJykgeyAvLyByZWxhdGlvbnMgXG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVsYXRpb25BY3Rpb24odGhpcy50b3BMZXZlbCxcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgdGhpcy5jbGF1c2UuYXJncyxcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZS5uZWdhdGVkKS5ydW4oY29udGV4dClcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVkaXRBY3Rpb24odGhpcy5jbGF1c2UuYXJnc1swXSwgdGhpcy5jbGF1c2UucHJlZGljYXRlLCBbXSkucnVuKGNvbnRleHQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50b3BMZXZlbC5yaGVtZS5kZXNjcmliZSh0aGlzLmNsYXVzZS5hcmdzWzBdKS5zb21lKHggPT4gaXNDb25jZXB0KHgpKSkgeyAvLyBcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29uY2VwdEFjdGlvbih0aGlzLmNsYXVzZS5hcmdzWzBdLFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgICB0aGlzLnRvcExldmVsKS5ydW4oY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXModGhpcy5jbGF1c2UuYXJnc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yTm9uVG9wTGV2ZWwoY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3BMZXZlbFxuICAgICAgICAgICAgLmdldE93bmVyc2hpcENoYWluKHRvcExldmVsRW50aXR5KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSkgLy8gQVNTVU1FIGF0IGxlYXN0IG9uZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBmb3JUb3BMZXZlbChjb250ZXh0OiBDb250ZXh0KSB7IC8vIHRoaXMgaWQgaXMgVEwgZW50aXR5XG5cbiAgICAgICAgY29uc3QgcSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuYWJvdXQodGhpcy5jbGF1c2UuYXJnc1swXSlcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IGlkID0gbWFwcz8uWzBdPy5bdGhpcy5jbGF1c2UuYXJnc1swXV0gPz8gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIGlmICghY29udGV4dC5lbnZpcm8uZ2V0KGlkKSkge1xuICAgICAgICAgICAgY29udGV4dC5lbnZpcm8uc2V0UGxhY2Vob2xkZXIoaWQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UucHJlZGljYXRlLnByb3RvKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENyZWF0ZUFjdGlvbihpZCxcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZS5wcmVkaWNhdGUpLnJ1bihjb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKGlkLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRQcm9wcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkucnVuKGNvbnRleHQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZm9yTm9uVG9wTGV2ZWwoY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IHRMT3duZXIgPSB0aGlzLmdldFRvcExldmVsT3duZXJPZih0aGlzLmNsYXVzZS5hcmdzWzBdLCB0aGlzLnRvcExldmVsKVxuXG4gICAgICAgIGlmICghdExPd25lcikge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuYW1lT2ZUaGlzID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSh0aGlzLmNsYXVzZS5hcmdzWzBdKVxuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCA9PSBuYW1lT2ZUaGlzWzBdLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuYWJvdXQodExPd25lcilcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQuZW52aXJvLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IHRMT3duZXJJZCA9IG1hcHM/LlswXT8uW3RMT3duZXJdIC8vPz8gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBuZXcgRWRpdEFjdGlvbih0TE93bmVySWQsXG4gICAgICAgICAgICB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIHRoaXMuZ2V0UHJvcHModExPd25lcikpLnJ1bihjb250ZXh0KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkLCB0b3BMZXZlbDogQ2xhdXNlKTogSWQgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IG93bmVycyA9IHRvcExldmVsLm93bmVyc09mKGlkKVxuXG4gICAgICAgIGNvbnN0IG1heWJlID0gb3duZXJzXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gdG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyhvKSkuYXQoMClcblxuICAgICAgICBpZiAoIW1heWJlICYmIG93bmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3BMZXZlbE93bmVyT2Yob3duZXJzWzBdLCB0b3BMZXZlbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtYXliZVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQ29udGV4dFwiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JyYWluL0NvbnRleHRcIjtcbmltcG9ydCB7IEFjdHVhdG9yIH0gZnJvbSBcIi4vQWN0dWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgY29udGV4dDogQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBjbGF1c2UudG9BY3Rpb24oY2xhdXNlKS5mb3JFYWNoKGEgPT4gYS5ydW4oY29udGV4dCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgdG9DbGF1c2UgfSBmcm9tIFwiLi90b0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jb25maWcuc3RhcnR1cENvbW1hbmRzLmZvckVhY2goYyA9PiB0aGlzLmV4ZWN1dGUoYykpXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXSB7XG5cbiAgICAgICAgcmV0dXJuIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbnRleHQuY29uZmlnKS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5jb25maWcuc2V0U3ludGF4KGFzdCBhcyBhbnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdClcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RzID0gaWRzLm1hcChpZCA9PiB0aGlzLmNvbnRleHQuZW52aXJvLmdldChpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gbz8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0cy5tYXAobyA9PiBvPy5vYmplY3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgZ2V0TmV3Q29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbihnZXROZXdDb250ZXh0KCkpXG59XG4iLCJpbXBvcnQgeyBDb25maWcsIGdldENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5pbXBvcnQgZ2V0RW52aXJvLCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCB7XG4gICAgcmVhZG9ubHkgZW52aXJvOiBFbnZpcm9cbiAgICByZWFkb25seSBjb25maWc6IENvbmZpZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3Q29udGV4dCgpOiBDb250ZXh0IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlbnZpcm86IGdldEVudmlybyh7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksXG4gICAgICAgIGNvbmZpZzogZ2V0Q29uZmlnKClcbiAgICB9XG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCwgaXNWYXIsIHRvQ29uc3QsIHRvVmFyIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uL2Vudmlyby9BbmFwaG9yYVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3QgaXMgdW5kZWZpbmVkIWApXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbm91biBwaHJhc2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnByZXBvc2l0aW9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBsZW1lbnRUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5zdWJqZWN0ICYmIGFzdD8ubGlua3MucHJlZGljYXRlKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdhbmQgc2VudGVuY2UnKSB7XG4gICAgICAgIHJlc3VsdCA9IGFuZFNlbnRlbmNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LmxpbmtzPy5zdWJqZWN0ICYmIGFzdC5saW5rcy5vYmplY3QpIHtcbiAgICAgICAgcmVzdWx0ID0gbXZlcmJTZW50ZW5jZVRvQ2xhdXNlKGFzdCwgYXJncylcbiAgICB9XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGMxID0gbWFrZUFsbFZhcnMocmVzdWx0KVxuICAgICAgICBjb25zdCBjMiA9IHJlc29sdmVBbmFwaG9yYShjMSlcbiAgICAgICAgY29uc3QgYzMgPSBwcm9wYWdhdGVWYXJzT3duZWQoYzIpXG4gICAgICAgIHJldHVybiBjM1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHsgYXN0IH0pXG4gICAgdGhyb3cgbmV3IEVycm9yKGBJZGsgd2hhdCB0byBkbyB3aXRoICcke2FzdC50eXBlfSchYClcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IHN1YmplY3QgPSB0b0NsYXVzZShjb3B1bGFTZW50ZW5jZT8ubGlua3M/LnN1YmplY3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UoY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pLmNvcHkoeyBuZWdhdGU6ICEhY29wdWxhU2VudGVuY2U/LmxpbmtzPy5uZWdhdGlvbiB9KVxuICAgIGNvbnN0IGVudGl0aWVzID0gc3ViamVjdC5lbnRpdGllcy5jb25jYXQocHJlZGljYXRlLmVudGl0aWVzKVxuXG4gICAgY29uc3QgcmVzdWx0ID0gZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKSA/ICAvLyBhc3N1bWUgYW55IHNlbnRlbmNlIHdpdGggYW55IHZhciBpcyBhbiBpbXBsaWNhdGlvblxuICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0LmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGNvcHVsYVN1YkNsYXVzZTogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBwcmVkaWNhdGUgPSBjb3B1bGFTdWJDbGF1c2U/LmxpbmtzPy5wcmVkaWNhdGUgLy9hcyBDb21wb3NpdGVOb2RlPENvbXBvc2l0ZVR5cGU+XG5cbiAgICByZXR1cm4gdG9DbGF1c2UocHJlZGljYXRlLCB7IHN1YmplY3Q6IGFyZ3M/LnN1YmplY3QgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpIC8vPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lXG5cbiAgICBpZiAoIXByZXBvc2l0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcHJlcG9zaXRpb24hJylcbiAgICB9XG5cbiAgICBjb25zdCBub3VuUGhyYXNlID0gY29tcGxlbWVudD8ubGlua3M/Llsnbm91biBwaHJhc2UnXVxuXG4gICAgcmV0dXJuIGNsYXVzZU9mKHByZXBvc2l0aW9uLCBzdWJqSWQsIG5ld0lkKVxuICAgICAgICAuYW5kKHRvQ2xhdXNlKG5vdW5QaHJhc2UsIHsgc3ViamVjdDogbmV3SWQgfSkpXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG5cbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKG5vdW5QaHJhc2U6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbWF5YmVJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2U/LmxpbmtzPy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IG5vdW5QaHJhc2U/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBub3VuID0gbm91blBocmFzZS5saW5rcz8uc3ViamVjdFxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gbm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlPy5saW5rcz8uc3ViY2xhdXNlXG5cbiAgICBjb25zdCByZXMgPVxuICAgICAgICBhZGplY3RpdmVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuYW5kKGNvbXBsZW1lbnRzLm1hcChjID0+IGMgPyB0b0NsYXVzZShjLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKCkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gdG9DbGF1c2Uoc3ViQ2xhdXNlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBtYWtlQWxsVmFycyhjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7IC8vIGFzc3VtZSBpZHMgYXJlIGNhc2UgaW5zZW5zaXRpdmUsIGFzc3VtZSBpZiBJRFggaXMgdmFyIGFsbCBpZHggYXJlIHZhclxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7Ly9jb2xwZXZvbGUhXG5cbiAgICBpZiAoY2xhdXNlLnJoZW1lLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZSgpLmhhc2hDb2RlKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBjb25zdCBhID0gZ2V0QW5hcGhvcmEoKVxuICAgIGEuYXNzZXJ0KGNsYXVzZS50aGVtZSlcbiAgICBjb25zdCBtID0gYS5xdWVyeShjbGF1c2UucmhlbWUpWzBdXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtID8/IHt9IH0pXG59XG5cbmZ1bmN0aW9uIHByb3BhZ2F0ZVZhcnNPd25lZChjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7Ly8gYXNzdW1lIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyaWFibGUgaXMgYWxzbyBhIHZhcmlhYmxlXG5cbiAgICBjb25zdCBtID0gY2xhdXNlLmVudGl0aWVzXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiBjbGF1c2Uub3duZWRCeShlKSlcbiAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgcmV0dXJuIGNsYXVzZS5jb3B5KHsgbWFwOiBtIH0pXG5cbn1cblxuXG5mdW5jdGlvbiBhbmRTZW50ZW5jZVRvQ2xhdXNlKGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBsZWZ0ID0gdG9DbGF1c2UoYXN0LmxpbmtzPy5sZWZ0LCBhcmdzKVxuICAgIGNvbnN0IHJpZ2h0ID0gdG9DbGF1c2UoYXN0Py5saW5rcz8ucmlnaHQ/Lmxpc3Q/LlswXSwgYXJncylcblxuICAgIGlmIChhc3QubGlua3M/LmxlZnQ/LnR5cGUgPT09ICdjb3B1bGEgc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBsZWZ0LmFuZChyaWdodCkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbSA9IHsgW3JpZ2h0LmVudGl0aWVzWzBdXTogbGVmdC5lbnRpdGllc1swXSB9XG4gICAgICAgIGNvbnN0IHRoZW1lID0gbGVmdC50aGVtZS5hbmQocmlnaHQudGhlbWUpXG4gICAgICAgIGNvbnN0IHJoZW1lID0gcmlnaHQucmhlbWUuYW5kKHJpZ2h0LnJoZW1lLmNvcHkoeyBtYXA6IG0gfSkpXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9XG5cbn1cblxuXG5mdW5jdGlvbiBtdmVyYlNlbnRlbmNlVG9DbGF1c2UoYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IG9iaklkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKGFzdC5saW5rcz8uc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqSWQgfSlcbiAgICBjb25zdCBvYmplY3QgPSB0b0NsYXVzZShhc3QubGlua3M/Lm9iamVjdCwgeyBzdWJqZWN0OiBvYmpJZCB9KVxuICAgIGNvbnN0IG12ZXJiID0gYXN0LmxpbmtzPy5tdmVyYj8ubGV4ZW1lXG5cbiAgICBpZiAoIW12ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gbXZlcmIgaW4gbXZlcmIgc2VudGVuY2UhJylcbiAgICB9XG5cbiAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKG12ZXJiLCBzdWJqSWQsIG9iaklkKVxuICAgICAgICAuY29weSh7IG5lZ2F0ZTogISFhc3QubGlua3MubmVnYXRpb24gfSlcblxuICAgIGNvbnN0IHJlcyA9IHN1YmplY3RcbiAgICAgICAgLmFuZChvYmplY3QpXG4gICAgICAgIC5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZTogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzLmNsYXVzZTEudGhlbWUuYW5kKHRoaXMuY2xhdXNlMi50aGVtZSlcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkuY29uY2F0KHRoaXMuY2xhdXNlMi50b0FjdGlvbih0b3BMZXZlbCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFJvb3RBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvUm9vdEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbbmV3IFJvb3RBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCJcbmltcG9ydCB7IEVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICB0b3BMZXZlbCgpOiBJZFtdXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6IENsYXVzZSA9PiBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG90aGVyXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gY29uY2x1c2lvblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEltcGx5QWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0ltcGx5QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSB0cnVlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGNvbnNlcXVlbmNlKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8vVE9ETyEhISEhISEhXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zZXF1ZW5jZS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbbmV3IEltcGx5QWN0aW9uKHRoaXMuY29uZGl0aW9uLCB0aGlzLmNvbnNlcXVlbmNlKV1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29uZmlnIGltcGxlbWVudHMgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICBwcm90ZWN0ZWQgX2xleGVtZXM6IExleGVtZVtdLFxuICAgICAgICByZWFkb25seSBzeW50YXhNYXA6IFN5bnRheE1hcCxcbiAgICAgICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSxcbiAgICAgICAgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSkge1xuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG5cbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZS5jb25jYXQoeilcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgJ21hY3JvJyxcbiAgICAgICAgICAgICdtYWNyb3BhcnQnLFxuICAgICAgICAgICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAgICAgICAgICdhbmQgc2VudGVuY2UnLFxuICAgICAgICAgICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgICAgICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgICAgICdub3VuIHBocmFzZSddXG4gICAgfVxuXG4gICAgZ2V0IGxleGVtZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZXhlbWVzXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSkge1xuICAgICAgICB0aGlzLl9sZXhlbWVzID0gdGhpcy5fbGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICB0aGlzLl9sZXhlbWVzLnB1c2gobGV4ZW1lKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgc3RhcnR1cENvbW1hbmRzIH0gZnJvbSBcIi4vc3RhcnR1cENvbW1hbmRzXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLCBzeW50YXhlcyB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSlcbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAndGhlbicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nLFxuICAnYW55J1xuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzIH0gZnJvbSBcIi4vc3ludGF4ZXNcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAge1xuICAgICAgICByb290OiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnSFRNTEJ1dHRvbkVsZW1lbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2xpc3QnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHByb3RvOiAnQXJyYXknXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnY2xpY2snXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGlja2VkJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGRlcml2ZWRGcm9tOiAnY2xpY2snXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZXNzZWQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgYWxpYXNGb3I6ICdjbGlja2VkJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjYXQnLFxuICAgICAgICB0eXBlOiAnbm91bidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmUnLFxuICAgICAgICB0eXBlOiAnY29wdWxhJyxcbiAgICAgICAgZm9ybXM6IFsnaXMnLCAnYXJlJ10sXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiaXNuJ3RcIixcbiAgICAgICAgdHlwZTogJ2NvbnRyYWN0aW9uJyxcbiAgICAgICAgY29udHJhY3Rpb25Gb3I6IFsnaXMnLCAnbm90J11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWUsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVkaWNhdGUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvIG9yIG1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpdCcsXG4gICAgICAgIHR5cGU6ICdwcm9ub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb25jZXB0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBjb25jZXB0czogWydjb25jZXB0J11cbiAgICB9LFxuICAgIFxuICAgIC8vIHtcbiAgICAvLyAgICAgcm9vdDogJ2NvbnRhaW4nLFxuICAgIC8vICAgICB0eXBlOiAnbXZlcmInXG4gICAgLy8gfVxuXVxuXG4vKipcbiAqIEdyYW1tYXJcbiAqL1xuY29uc3RpdHVlbnRUeXBlcy5jb25jYXQobGV4ZW1lVHlwZXMgYXMgYW55KS5mb3JFYWNoKGcgPT4ge1xuICAgIGxleGVtZXMucHVzaCh7XG4gICAgICAgIHJvb3Q6IGcsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0pXG59KSIsImV4cG9ydCBjb25zdCBzdGFydHVwQ29tbWFuZHM6IHN0cmluZ1tdID0gW1xuXG4gICAgLy8gZ3JhbW1hclxuICAgICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAgICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICAgJ2NvbXBsZW1lbnQgaXMgcHJlcG9zaXRpb24gdGhlbiBub3VuIHBocmFzZScsXG5cbiAgICBgY29wdWxhIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgXG4gICAgICAgIHRoZW4gY29wdWxhIFxuICAgICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgICB0aGVuIHByZWRpY2F0ZSBub3VuIHBocmFzZWAsXG5cbiAgICBgbm91biBwaHJhc2UgaXMgb3B0aW9uYWwgcXVhbnRpZmllciBcbiAgICAgICAgdGhlbiBvcHRpb25hbCBhcnRpY2xlIFxuICAgICAgICB0aGVuIHplcm8gIG9yICBtb3JlIGFkamVjdGl2ZXMgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgc3ViamVjdCBub3VuIG9yIHByb25vdW4gb3IgbXZlcmIgXG4gICAgICAgIHRoZW4gb3B0aW9uYWwgc3ViY2xhdXNlIFxuICAgICAgICB0aGVuIHplcm8gb3IgbW9yZSBjb21wbGVtZW50cyBgLFxuXG4gICAgJ2NvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gbm91biBwaHJhc2UnLFxuICAgICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlJyxcblxuICAgIC8vIGRvbWFpblxuICAgICdjb2xvciBpcyBhIGNvbmNlcHQnLFxuICAgICdyZWQgYW5kIGJsdWUgYW5kIGJsYWNrIGFuZCBncmVlbiBhcmUgY29sb3JzJyxcbiAgICAnY29sb3Igb2YgYW55IGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGJ1dHRvbicsXG4gICAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBidXR0b24nLFxuXSIsImltcG9ydCB7IFJvbGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnY29wdWxhIHNlbnRlbmNlJyxcbiAgICAnbm91biBwaHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnc3ViY2xhdXNlJyxcbiAgICAnYW5kIHNlbnRlbmNlJyxcbiAgICAnbXZlcmIgc2VudGVuY2UnXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gW1xuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbl1cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnbm91bicgYXMgUm9sZSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGplY3RpdmUnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWyd0aGVuJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnc3ViY2xhdXNlJzogW1xuXG4gICAgXSxcblxuICAgICdub3VuIHBocmFzZSc6IFtcblxuICAgIF0sXG5cbiAgICAnY29tcGxlbWVudCc6IFtcblxuICAgIF0sXG5cbiAgICAnY29wdWxhIHNlbnRlbmNlJzogW1xuXG4gICAgXSxcblxuICAgICdhbmQgc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEgc2VudGVuY2UnLCAnbm91biBwaHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnbGVmdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vbnN1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydhbmQgc2VudGVuY2UnLCAnY29wdWxhIHNlbnRlbmNlJywgJ25vdW4gcGhyYXNlJ10sIG51bWJlcjogJysnLCByb2xlOiAncmlnaHQnIH1cbiAgICBdLFxuXG4gICAgJ212ZXJiIHNlbnRlbmNlJzogWy8vVE9ETzogY29tcGxlbWVudHNcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4gcGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ3N1YmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWydodmVyYiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWyduZWdhdGlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydtdmVyYiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4gcGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ29iamVjdCcgfVxuICAgIF1cbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG5leHBvcnQgdHlwZSBFbGVtZW50VHlwZTxUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTx1bmtub3duPj4gPSBUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTxpbmZlciBFbGVtZW50VHlwZT4gPyBFbGVtZW50VHlwZSA6IG5ldmVyO1xuIiwiaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIlxuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBBbmFwaG9yYSB7XG4gICAgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogdm9pZFxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFuYXBob3JhKCkge1xuICAgIHJldHVybiBuZXcgRW52aXJvQW5hcGhvcmEoKVxufVxuXG5jbGFzcyBFbnZpcm9BbmFwaG9yYSBpbXBsZW1lbnRzIEFuYXBob3JhIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBlbnZpcm8gPSBnZXRFbnZpcm8oeyByb290OiB1bmRlZmluZWQgfSkpIHtcblxuICAgIH1cblxuICAgIGFzc2VydChjbGF1c2U6IENsYXVzZSkge1xuICAgICAgICBnZXRBY3R1YXRvcigpLnRha2VBY3Rpb24oY2xhdXNlLmNvcHkoeyBleGFjdElkczogdHJ1ZSB9KSwgeyBlbnZpcm86IHRoaXMuZW52aXJvLCBjb25maWc6IHsvKiBUT0RPIGFzc3VtaW5nIGFuYXBob3JhIGRvbnQgY2FyZSBhYm91dCBsZXhlbWUgYW5kIHN5bnRheGVzIGNvbmZpZyovIH0gYXMgYW55IH0pXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuaW1wb3J0IHsgUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LFxuICAgICAgICByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldFBsYWNlaG9sZGVyKGlkOiBJZCk6IFdyYXBwZXIge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gbmV3IFBsYWNlaG9sZGVyKClcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdICYmICEodGhpcy5kaWN0aW9uYXJ5W2lkXSBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKVxuICAgIH1cblxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAmJiBwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnByZWRpY2F0ZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBvYmplY3Quc2V0KHApXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gb2JqZWN0XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcblxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10ge1xuXG4gICAgICAgIC8vVE9ETyB0aGlzIGlzIGEgdG1wIHNvbHV0aW9uLCBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiwgYnV0IGp1c3Qgd2l0aCBkZXNjcmlwdGlvbnMsIHdpdGhvdXQgdGFraW5nIChtdWx0aS1lbnRpdHkpIHJlbGF0aW9uc2hpcHMgaW50byBhY2NvdW50XG4gICAgICAgIC8vVE9ETzogYWZ0ZXIgXCJldmVyeSAuLi5cIiBzZW50ZW5jZSwgXCJpdFwiIHNob3VsZCBiZSB1bmRlZmluZWRcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IGU6IHhbMF0sIHc6IHhbMV0gfSkpXG5cblxuICAgICAgICBjb25zdCBxdWVyeSA9IGNsYXVzZSAvLyBkZXNjcmliZWQgZW50aXRpZXNcbiAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgLm1hcChlID0+ICh7IGUsIGRlc2M6IGNsYXVzZS50aGVtZS5kZXNjcmliZShlKSB9KSlcblxuICAgICAgICBjb25zdCBnZXRJdCA9ICgpID0+IHRoaXMubGFzdFJlZmVyZW5jZWQgPyBbeyBlOiB0aGlzLmxhc3RSZWZlcmVuY2VkIGFzIHN0cmluZywgdzogdGhpcy5kaWN0aW9uYXJ5W3RoaXMubGFzdFJlZmVyZW5jZWRdIH1dIDogW11cblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeVxuICAgICAgICAgICAgLmZsYXRNYXAocSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IHVuaXZlcnNlXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodSA9PiBxLmRlc2MubGVuZ3RoID4gMCAmJiBxLmRlc2MuZXZlcnkoZCA9PiB1LncuaXMoZCkpKVxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHEuZGVzYy5maW5kKHggPT4geC50eXBlID09ICdwcm9ub3VuJykgPyBnZXRJdCgpIDogW10pXG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBmcm9tOiBxLmUsIHRvOiB0byB9XG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgcmVzU2l6ZSA9IE1hdGgubWF4KC4uLnJlcy5tYXAocSA9PiBxLnRvLmxlbmd0aCkpO1xuICAgICAgICBjb25zdCBmcm9tVG9UbyA9IChmcm9tOiBJZCkgPT4gcmVzLmZpbHRlcih4ID0+IHguZnJvbSA9PT0gZnJvbSlbMF0udG8ubWFwKHggPT4geC5lKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSAobjogbnVtYmVyKSA9PiBbLi4ubmV3IEFycmF5KG4pLmtleXMoKV1cblxuICAgICAgICBjb25zdCByZXMyID0gcmFuZ2UocmVzU2l6ZSkubWFwKGkgPT5cbiAgICAgICAgICAgIGNsYXVzZVxuICAgICAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnJvbSA9PiBmcm9tVG9Ubyhmcm9tKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJvbSA9PiAoeyBbZnJvbV06IGZyb21Ub1RvKGZyb20pW2ldID8/IGZyb21Ub1RvKGZyb20pWzBdIH0pKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpKVxuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSByZXMyLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKS5hdCgtMSkgPz8gdGhpcy5sYXN0UmVmZXJlbmNlZFxuXG4gICAgICAgIHJldHVybiByZXMyIC8vIHJldHVybiBsaXN0IG9mIG1hcHMsIHdoZXJlIGVhY2ggbWFwIHNob3VsZCBzaG91bGQgaGF2ZSBBTEwgaWRzIGZyb20gY2xhdXNlIGluIGl0cyBrZXlzLCBlZzogW3tpZDI6aWQxLCBpZDQ6aWQzfSwge2lkMjoxLCBpZDQ6M31dLlxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY3JldGVXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlQ29uY2VwdHM6IHsgW2NvbmNlcHROYW1lOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0gb2JqZWN0LnNpbXBsZUNvbmNlcHRzID8/IHt9KSB7XG5cbiAgICAgICAgb2JqZWN0LnNpbXBsZUNvbmNlcHRzID0gc2ltcGxlQ29uY2VwdHNcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIHByb3BzPzogTGV4ZW1lW10pOiB2b2lkIHtcblxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID4gMSkgeyAvLyBhc3N1bWUgPiAxIHByb3BzIGFyZSBhIHBhdGhcblxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMubWFwKHggPT4geC50b2tlbiA/PyB4LnJvb3QpLCBwcmVkaWNhdGUucm9vdClcblxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA9PT0gMSkgeyAvLyBzaW5nbGUgcHJvcFxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaW1wbGVDb25jZXB0cykuaW5jbHVkZXMocHJvcHNbMF0ucm9vdCkpIHsgLy8gaXMgY29uY2VwdCBcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW3Byb3BzWzBdLnJvb3RdLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIC4uLiBub3QgY29uY2VwdCwganVzdCBwcm9wXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMubWFwKHggPT4geC50b2tlbiA/PyB4LnJvb3QpLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKCFwcm9wcyB8fCBwcm9wcy5sZW5ndGggPT09IDApIHsgLy8gbm8gcHJvcHNcblxuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jb25jZXB0cyAmJiBwcmVkaWNhdGUuY29uY2VwdHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJlZGljYXRlLmNvbmNlcHRzWzBdXSwgcHJlZGljYXRlLnJvb3QpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZS5yb290XSA9IHRydWUgLy8gZmFsbGJhY2tcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IGNvbmNlcHQgPSBwcmVkaWNhdGUuY29uY2VwdHM/LmF0KDApXG5cbiAgICAgICAgcmV0dXJuIGNvbmNlcHQgP1xuICAgICAgICAgICAgdGhpcy5nZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0XSkgPT09IHByZWRpY2F0ZS5yb290IDpcbiAgICAgICAgICAgICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZS5yb290XSAhPT0gdW5kZWZpbmVkXG5cbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0TmFtZS5yb290XSA9IHByb3BQYXRoLm1hcCh4ID0+IHgucm9vdClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwYXRoWzBdXSA9IHZhbHVlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV1cblxuICAgICAgICBwYXRoLnNsaWNlKDEsIC0yKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHhbcF1cbiAgICAgICAgfSlcblxuICAgICAgICB4W3BhdGguYXQoLTEpIGFzIHN0cmluZ10gPSB2YWx1ZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXROZXN0ZWQocGF0aDogc3RyaW5nW10pIHtcblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmVcblxuICAgICAgICBwYXRoLnNsaWNlKDEpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB4XG5cbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuOyB9KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNhbGwodmVyYjogTGV4ZW1lLCBhcmdzOiBXcmFwcGVyW10pIHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgIGNvbnN0IGNvbmNlcHQgPSB0aGlzLnNpbXBsZUNvbmNlcHRzW3ZlcmIucm9vdF1cbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IGNvbmNlcHQ/LlswXSA/PyB2ZXJiLnJvb3RcbiAgICAgICAgcmV0dXJuIHRoaXM/Lm9iamVjdFttZXRob2ROYW1lXSguLi5hcmdzLm1hcCh4ID0+IHgub2JqZWN0KSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG4gICAgLy8gZ2V0IGtleXMoKTogSWRbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIlxuXG5leHBvcnQgY2xhc3MgUGxhY2Vob2xkZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZXM6IExleGVtZVtdID0gW10sIHJlYWRvbmx5IG9iamVjdDogYW55ID0ge30pIHtcblxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSkge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBMZXhlbWUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5zb21lKHggPT4geC5yb290ID09IHByZWRpY2F0ZS5yb290KVxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSkgeyB9XG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KSB7IH1cbiAgICBjYWxsKHZlcmI6IExleGVtZSwgYXJnczogV3JhcHBlcltdKSB7IH1cblxufVxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9icmFpbi9Db250ZXh0XCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IENvbmNyZXRlV3JhcHBlciBmcm9tIFwiLi9Db25jcmV0ZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSk6IHZvaWRcbiAgICBpcyhwcmVkaWNhdGU6IExleGVtZSk6IGJvb2xlYW4gLy8gVE9ETyBhcmdzXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IExleGVtZSwgcHJvcFBhdGg6IExleGVtZVtdKTogdm9pZFxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSk6IHZvaWRcbiAgICAvLyBnZXQocHJlZGljYXRlOiBzdHJpbmcpOiBhbnlcbiAgICBjYWxsKHZlcmI6TGV4ZW1lLCBhcmdzOihXcmFwcGVyfHVuZGVmaW5lZClbXSk6YW55XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAobz86IE9iamVjdCwgY29udGV4dD86IENvbnRleHQpOiBXcmFwcGVyIHtcblxuICAgIGNvbnN0IGFsbFByb3BzT2YgPSAoeDogYW55KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICAgICAgbGV0IHkgPSB4XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goLi4uT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoeSkpXG4gICAgICAgIH0gd2hpbGUgKCh5ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHkpKSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBhbGxQcm9wc09mKG8pXG4gICAgICAgIHByb3BzLmZvckVhY2goeCA9PiB7XG5cbiAgICAgICAgICAgIGlmICghY29udGV4dC5jb25maWcubGV4ZW1lcy5tYXAobCA9PiBsLnJvb3QpLmluY2x1ZGVzKHgpKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jb25maWcuc2V0TGV4ZW1lKHsgcm9vdDogeCwgdHlwZTogJ212ZXJiJyB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb25jcmV0ZVdyYXBwZXIobylcbn0iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG5cbihhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4gICAgbWFpbigpXG59KSgpXG5cbi8vIFxuIiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBnZXRMZXhlbWVzLCBpc011bHRpV29yZCwgTGV4ZW1lLCByZXNwYWNlLCBzdGRzcGFjZSwgdW5zcGFjZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZVtdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlclxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb25maWc6IENvbmZpZykge1xuXG5cblxuICAgICAgICB0aGlzLnRva2VucyA9XG4gICAgICAgICAgICB0aGlzLmpvaW5NdWx0aVdvcmRMZXhlbWVzKHN0ZHNwYWNlKHNvdXJjZUNvZGUpLCBjb25maWcubGV4ZW1lcylcbiAgICAgICAgICAgICAgICAvLyAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgICAgIC5tYXAocyA9PiByZXNwYWNlKHMpKVxuICAgICAgICAgICAgICAgIC5mbGF0TWFwKHMgPT4gZ2V0TGV4ZW1lcyhzLCBjb25maWcubGV4ZW1lcykpXG5cbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBqb2luTXVsdGlXb3JkTGV4ZW1lcyhzb3VyY2VDb2RlOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZVtdKSB7XG5cbiAgICAgICAgbGV0IG5ld1NvdXJjZSA9IHNvdXJjZUNvZGVcblxuICAgICAgICBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gaXNNdWx0aVdvcmQoeCkpXG4gICAgICAgICAgICAuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZXhlbWUgPSBzdGRzcGFjZSh4LnJvb3QpXG4gICAgICAgICAgICAgICAgbmV3U291cmNlID0gbmV3U291cmNlLnJlcGxhY2VBbGwobGV4ZW1lLCB1bnNwYWNlKGxleGVtZSkpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBuZXdTb3VyY2VcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyByZWFkb25seSByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogTGV4ZW1lVHlwZVxuICAgIC8qKnVzZWZ1bCBmb3IgaXJyZWd1bGFyIHN0dWZmKi8gcmVhZG9ubHkgZm9ybXM/OiBzdHJpbmdbXVxuICAgIC8qKnJlZmVycyB0byB2ZXJiIGNvbmp1Z2F0aW9ucyBvciBwbHVyYWwgZm9ybXMsIGFzc3VtZSByZWd1bGFyaXR5Ki8gcmVhZG9ubHkgaXJyZWd1bGFyPzogYm9vbGVhblxuICAgIC8qKnNlbWFudGljYWwgZGVwZW5kZWNlKi8gcmVhZG9ubHkgZGVyaXZlZEZyb20/OiBzdHJpbmdcbiAgICAvKipzZW1hbnRpY2FsIGVxdWl2YWxlbmNlKi8gcmVhZG9ubHkgYWxpYXNGb3I/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovIHJlYWRvbmx5IGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW11cbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqL3JlYWRvbmx5IHRva2VuPzogc3RyaW5nXG4gICAgLyoqZm9yIHF1YW50YWRqICovIHJlYWRvbmx5IGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICByZWFkb25seSBjb25jZXB0cz86IHN0cmluZ1tdXG4gICAgcmVhZG9ubHkgcHJvdG8/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1zT2YobGV4ZW1lOiBMZXhlbWUpIHtcblxuICAgIHJldHVybiBbbGV4ZW1lLnJvb3RdLmNvbmNhdChsZXhlbWU/LmZvcm1zID8/IFtdKVxuICAgICAgICAuY29uY2F0KCFsZXhlbWUuaXJyZWd1bGFyID8gW2Ake2xleGVtZS5yb290fXNgXSA6IFtdKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pOiBMZXhlbWVbXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZSA9XG4gICAgICAgIGxleGVtZXMuZmlsdGVyKHggPT4gZm9ybXNPZih4KS5pbmNsdWRlcyh3b3JkKSkuYXQoMClcbiAgICAgICAgPz8geyByb290OiB3b3JkLCB0eXBlOiAnbm91bicgfVxuICAgIC8vID8/IHsgcm9vdDogd29yZCwgdHlwZTogJ2FueScgfVxuXG4gICAgY29uc3QgbGV4ZW1lMjogTGV4ZW1lID0geyAuLi5sZXhlbWUsIHRva2VuOiB3b3JkIH1cblxuICAgIHJldHVybiBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lMi5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBsZXhlbWVzKSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdG8obGV4ZW1lOiBMZXhlbWUpOiBPYmplY3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSk/LltsZXhlbWUucHJvdG8gYXMgYW55XT8ucHJvdG90eXBlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbmNlcHQobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICByZXR1cm4gbGV4ZW1lLmNvbmNlcHRzPy5pbmNsdWRlcygnY29uY2VwdCcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc011bHRpV29yZChsZXhlbWU6IExleGVtZSkge1xuICAgIHJldHVybiBsZXhlbWUucm9vdC5pbmNsdWRlcygnICcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKCcgJywgJy0nKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnLScsICcgJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0ZHNwYWNlKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlQWxsKC9cXHMrL2csICcgJylcbn0iLCJpbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb25maWc6IENvbmZpZyk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29uZmlnKVxufSIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogZ2V0QnJhaW4oKSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICB0ZXh0YXJlYS5zdHlsZS53aWR0aCA9ICc1MHZ3J1xuICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9ICcxZW0nXG4gICAgdGV4dGFyZWEuaGlkZGVuID0gdHJ1ZVxuICAgIHRleHRhcmVhLnN0eWxlLnBvc2l0aW9uID0gJ3N0aWNreSdcbiAgICB0ZXh0YXJlYS5zdHlsZS50b3AgPSAnMCdcbiAgICB0ZXh0YXJlYS5zdHlsZS56SW5kZXggPSAnMTAwMCdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG5cblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgfSBlbHNlIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdGF0ZS5icmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlKClcbiAgICB9KVxuXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb25maWcpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29uZmlnLnN5bnRheExpc3QpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUpIHtcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5jb25maWcuZ2V0U3ludGF4KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNMZWFmKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG1lbWJlcnNbMF0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSlcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3RcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOiBDb25maWcpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb25maWcpXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBSb2xlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFN5bnRheCwgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFjcm9Ub1N5bnRheChtYWNybzogQXN0Tm9kZSk6IHsgbmFtZTogc3RyaW5nLCBzeW50YXg6IFN5bnRheCB9IHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNybz8ubGlua3M/Lm1hY3JvcGFydD8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvPy5saW5rcz8ubm91bj8ubGV4ZW1lPy5yb290XG5cbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm9ueW1vdXMgc3ludGF4IScpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmFtZSwgc3ludGF4IH1cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBBc3ROb2RlKTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZU5vZGVzID0gbWFjcm9QYXJ0LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBhZGplY3RpdmVzID0gYWRqZWN0aXZlTm9kZXMuZmxhdE1hcChhID0+IGEubGV4ZW1lID8/IFtdKVxuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3M/LmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApOiBBc3RUeXBlW10ge1xuXG4gICAgY29uc3QgeCA9IChzeW50YXhlc1thXSA/PyBbXSkuZmxhdE1hcChtID0+IG0udHlwZSlcbiAgICByZXR1cm4geFxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMCxcbiAgICB0ZXN0MTFcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2codGVzdCgpID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnLCB0ZXN0Lm5hbWUpXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMClcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuY29udGV4dC5lbnZpcm8udmFsdWVzLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IChicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IChicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpXG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkXG59XG5cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ3knKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gKGJyYWluLmV4ZWN1dGUoJ3onKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCdidXR0b24nKSlbMF0udGV4dENvbnRlbnQgPT0gJ2NhcHJhJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB4IGlzIGdyZWVuLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCdyZWQnKSkubGVuZ3RoID09PSAwXG4gICAgY29uc3QgYXNzZXJ0MiA9IChicmFpbi5leGVjdXRlKCdncmVlbicpKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0MTEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhbmQgeiBhbmQgdyBhcmUgYnV0dG9ucycpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBhbmQgeSBhcmUgcmVkJylcbiAgICBicmFpbi5leGVjdXRlKCd3IGFuZCB6IGFyZSBibGFjaycpXG5cbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3cnKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09PSBicmFpbi5leGVjdXRlKCd6JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZFxuICAgIGNvbnN0IGFzc2VydDMgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQ0ID0gYnJhaW4uZXhlY3V0ZSgndycpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDMgJiYgYXNzZXJ0NFxuXG59XG5cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJydcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnd2hpdGUnXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==