/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/Context.ts":
/*!****************************!*\
  !*** ./app/src/Context.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNewContext = void 0;
const Config_1 = __webpack_require__(/*! ./config/Config */ "./app/src/config/Config.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ./enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
function getNewContext() {
    return {
        enviro: (0, Enviro_1.default)({ root: document.body }),
        config: (0, Config_1.getConfig)()
    };
}
exports.getNewContext = getNewContext;


/***/ }),

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
            o.id = this.id + '';
            o.textContent = 'default';
            const newObj = (0, Wrapper_1.wrap)(o);
            newObj.set(this.predicate);
            context.enviro.set(this.id, newObj);
            (_a = context.enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
        }
        else {
            const o = new proto.constructor();
            const newObj = (0, Wrapper_1.wrap)(o);
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
            this.setAliasCall();
        }
        else {
            this.other(context);
        }
    }
    setAliasCall() {
        const top = this.condition.topLevel()[0]; //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1);
        const props = this.conclusion.getOwnershipChain(top).slice(1);
        const conceptName = alias.map(x => this.condition.describe(x)[0]); // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]); // same ...
        const protoName = this.condition.describe(top)[0]; // assume one 
        const proto = (0, Lexeme_1.getProto)(protoName);
        (0, Wrapper_1.wrap)(proto).setAlias(conceptName[0], propsNames);
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
class RootAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(context) {
        if (this.clause.args.length > 1) { // not handling relations yet
            return;
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
const Context_1 = __webpack_require__(/*! ../Context */ "./app/src/Context.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
function getBrain() {
    return new BasicBrain_1.default((0, Context_1.getNewContext)());
}
exports.getBrain = getBrain;


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
    var _a, _b, _c, _d, _e, _f;
    if (!ast) {
        throw new Error(`Ast is undefined!`);
    }
    let result;
    if (((_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.pronoun) || ((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.noun) || ((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.adjective)) {
        result = nounPhraseToClause(ast, args);
    }
    else if ((_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.relpron) {
        result = copulaSubClauseToClause(ast, args);
    }
    else if ((_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.preposition) {
        result = complementToClause(ast, args);
    }
    else if (((_f = ast === null || ast === void 0 ? void 0 : ast.links) === null || _f === void 0 ? void 0 : _f.subject) && (ast === null || ast === void 0 ? void 0 : ast.links.predicate)) {
        result = copulaSentenceToClause(ast, args);
    }
    if (result) {
        return propagateVarsOwned(resolveAnaphora(makeAllVars(result)));
    }
    console.log({ ast });
    throw new Error(`Idk what to do with '${ast.type}'!`);
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c, _d;
    const subjectAst = (_a = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _a === void 0 ? void 0 : _a.subject;
    const predicateAst = (_b = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _b === void 0 ? void 0 : _b.predicate;
    const subjectId = (_c = args === null || args === void 0 ? void 0 : args.subject) !== null && _c !== void 0 ? _c : (0, Id_1.getRandomId)();
    const subject = toClause(subjectAst, { subject: subjectId });
    const predicate = toClause(predicateAst, { subject: subjectId }).copy({ negate: !!((_d = copulaSentence === null || copulaSentence === void 0 ? void 0 : copulaSentence.links) === null || _d === void 0 ? void 0 : _d.negation) });
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const maybeId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, Id_1.getRandomId)();
    const subjectId = nounPhrase.links.uniquant ? (0, Id_1.toVar)(maybeId) : maybeId;
    const adjectives = (_d = (_c = (_b = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _b === void 0 ? void 0 : _b.adjective) === null || _c === void 0 ? void 0 : _c.links) !== null && _d !== void 0 ? _d : [];
    const noun = (_e = nounPhrase.links.noun) !== null && _e !== void 0 ? _e : nounPhrase.links.pronoun;
    const complements = (_h = (_g = (_f = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _f === void 0 ? void 0 : _f.complement) === null || _g === void 0 ? void 0 : _g.links) !== null && _h !== void 0 ? _h : [];
    const subClause = nounPhrase.links.subclause;
    const res = adjectives.map(a => a.lexeme)
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
    var _a;
    if (clause.rheme.hashCode === (0, Clause_1.emptyClause)().hashCode) {
        return clause;
    }
    const a = (0, Anaphora_1.getAnaphora)();
    a.assert(clause.theme);
    return clause.copy({ map: (_a = a.query(clause.rheme)[0]) !== null && _a !== void 0 ? _a : {} });
}
function propagateVarsOwned(clause) {
    const m = clause.entities
        .filter(e => (0, Id_1.isVar)(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return clause.copy({ map: m });
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
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
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
        return this.clause2IsRheme ? this.clause1 : this;
    }
    get rheme() {
        return this.clause2IsRheme ? this.clause2 : (0, Clause_1.emptyClause)();
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
    constructor(lexemeTypes, _syntaxList, _lexemes, syntaxMap, startupCommands, staticAscendingPrecedence) {
        this.lexemeTypes = lexemeTypes;
        this._syntaxList = _syntaxList;
        this._lexemes = _lexemes;
        this.syntaxMap = syntaxMap;
        this.startupCommands = startupCommands;
        this.staticAscendingPrecedence = staticAscendingPrecedence;
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme({ type: 'grammar', root: syntax.name });
            this._syntaxList.push(syntax.name); //TODO: check duplicates?
            this.syntaxMap[syntax.name] = syntax.syntax;
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
    }
    get syntaxList() {
        const sl = this._syntaxList
            .slice()
            .sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap, this.staticAscendingPrecedence))
            .filter(x => x !== 'array');
        return [...new Set(sl)];
        // return [
        //     'macro',
        //     'macropart',
        //     'taggedunion',
        //     'andsentence',
        //     'copulasentence',
        //     'complement',
        //     'subclause',
        //     'nounphrase']
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
    return new BasicConfig_1.BasicConfig(LexemeType_1.lexemeTypes, syntaxes_1.constituentTypes, lexemes_1.lexemes, syntaxes_1.syntaxes, startupCommands_1.startupCommands, syntaxes_1.staticAscendingPrecedence);
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
'pronoun');
// 'quantadj',
// 'semantics' //?


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
    'copula sentence is subject noun phrase then copula then optional negation then predicate noun phrase',
    'noun phrase is optional quantifier then optional article then zero  or  more adjectives then optional noun or pronoun then optional subclause then zero or more complements ',
    'copulasubclause is relpron then copula then noun phrase',
    'subclause is copulasubclause',
    // domain
    'color is a concept',
    'red is a color',
    'blue is a color',
    'black is a color',
    'green is a color',
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
exports.syntaxes = exports.staticAscendingPrecedence = exports.constituentTypes = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.constituentTypes = (0, utils_1.stringLiterals)(
// permanent
'taggedunion', 'array', // consecutive asts
'macropart', 'macro', 
// extendible
'copula sentence', 'noun phrase', 'complement', 'subclause', 'and sentence');
exports.staticAscendingPrecedence = [
    'taggedunion',
    'array',
    'macropart',
    'macro'
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
    'array': [],
    // extendible
    'subclause': [],
    'noun phrase': [],
    'complement': [],
    'copula sentence': [],
    'and sentence': [
        { type: ['copula sentence', 'noun phrase'], number: 1, role: 'one' },
        { type: ['nonsubconj'], number: 1 },
        { type: ['and sentence', 'copula sentence', 'noun phrase'], number: '+', role: 'two' }
    ],
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
                .filter(u => q.desc.every(d => u.w.is(d)))
                // .concat(q.desc.includes('it') ? getIt() : []) //TODO: hardcoded bad
                .concat(q.desc.find(x => x.type == 'pronoun') ? getIt() : []);
            //TODO: after "every ..." sentence, "it" should be undefined
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
function wrap(o) {
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
            var _a, _b;
            const links = {};
            for (const m of this.config.getSyntax(name)) {
                const ast = this.parseMember(m);
                if (!ast && (0, Cardinality_1.isNecessary)(m.number)) {
                    return undefined;
                }
                if (!ast) {
                    continue;
                }
                const astType = ast.type !== 'array' ? ast.type : (_a = Object.values(ast.links).at(0)) === null || _a === void 0 ? void 0 : _a.type;
                if (astType) {
                    links[(_b = m.role) !== null && _b !== void 0 ? _b : astType] = ast;
                }
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
            if (list.length === 0 && (0, Cardinality_1.isNecessary)(m.number)) {
                return undefined;
            }
            return (0, Cardinality_1.isRepeatable)(m.number) ? ({
                type: 'array',
                links: list //TODO!!!!
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
    const macroparts = macro.links.macropart.links;
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = macro.links.noun.lexeme.root;
    return { name, syntax };
}
exports.macroToSyntax = macroToSyntax;
function macroPartToMember(macroPart) {
    var _a, _b, _c, _d, _e, _f;
    const adjectives = (_d = (_c = (_b = (_a = macroPart.links) === null || _a === void 0 ? void 0 : _a.adjective) === null || _b === void 0 ? void 0 : _b.links) === null || _c === void 0 ? void 0 : _c.map((a) => a.lexeme)) !== null && _d !== void 0 ? _d : [];
    const taggedUnions = macroPart.links.taggedunion.links;
    const grammars = taggedUnions.map(x => x.links.grammar);
    const quantadjs = adjectives.filter(a => a.cardinality);
    const qualadjs = adjectives.filter(a => !a.cardinality);
    return {
        type: grammars.map(g => g.lexeme.root),
        role: (_e = qualadjs.at(0)) === null || _e === void 0 ? void 0 : _e.root,
        number: (_f = quantadjs.at(0)) === null || _f === void 0 ? void 0 : _f.cardinality
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
const maxPrecedence = (a, b, syntaxes, staticAscendingPrecedence) => {
    var _a, _b, _c;
    return (_c = (_b = (_a = idCompare(a, b)) !== null && _a !== void 0 ? _a : staticCompare(a, b, staticAscendingPrecedence)) !== null && _b !== void 0 ? _b : dependencyCompare(a, b, syntaxes)) !== null && _c !== void 0 ? _c : lenCompare(a, b, syntaxes);
};
exports.maxPrecedence = maxPrecedence;
const idCompare = (a, b) => {
    return a == b ? 0 : undefined;
};
function staticCompare(a, b, staticByAscPrecedence) {
    const pa = staticByAscPrecedence.indexOf(a);
    const pb = staticByAscPrecedence.indexOf(b);
    if (pa === -1 || pb === -1) { // either one is custom
        return undefined;
    }
    return pa - pb;
}
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
    return ((_a = syntaxes[a]) !== null && _a !== void 0 ? _a : []).flatMap(m => m.type);
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
    test10
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUcsRUFBRSxFQUFFO1FBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO0lBQ3pDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLFFBQVE7SUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPO0FBQzVDLENBQUM7Ozs7Ozs7VUN2SEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvQ29uY2VwdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvQ3JlYXRlQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9FZGl0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9JbXBseUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvUm9vdEFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0Jhc2ljQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3RhcnR1cENvbW1hbmRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3V0aWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0FuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQ29uY3JldGVXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9QbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25maWcsIGdldENvbmZpZyB9IGZyb20gXCIuL2NvbmZpZy9Db25maWdcIjtcbmltcG9ydCBnZXRFbnZpcm8sIHsgRW52aXJvIH0gZnJvbSBcIi4vZW52aXJvL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQge1xuICAgIHJlYWRvbmx5IGVudmlybzogRW52aXJvXG4gICAgcmVhZG9ubHkgY29uZmlnOiBDb25maWdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NvbnRleHQoKTogQ29udGV4dCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZW52aXJvOiBnZXRFbnZpcm8oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLFxuICAgICAgICBjb25maWc6IGdldENvbmZpZygpXG4gICAgfVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9Db250ZXh0XCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jZXB0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgY29uY2VwdDogTGV4ZW1lLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGluc3QgPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuaWQpWzBdLnJvb3RcblxuICAgICAgICBjb250ZXh0LmNvbmZpZy5zZXRMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogaW5zdCxcbiAgICAgICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICAgICAgY29uY2VwdHM6IFt0aGlzLmNvbmNlcHQucm9vdF0sXG4gICAgICAgIH0pXG5cbiAgICB9XG5cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IExleGVtZSwgZ2V0UHJvdG8gfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSkge1xuXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQpOiBhbnkge1xuXG4gICAgICAgIGlmIChjb250ZXh0LmVudmlyby5leGlzdHModGhpcy5pZCkpIHsgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm90byA9IGdldFByb3RvKHRoaXMucHJlZGljYXRlKVxuXG4gICAgICAgIGlmIChwcm90byBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhZ05hbWVGcm9tUHJvdG8gPSAoeDogT2JqZWN0KSA9PiB4LmNvbnN0cnVjdG9yLm5hbWUucmVwbGFjZSgnSFRNTCcsICcnKS5yZXBsYWNlKCdFbGVtZW50JywgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIGNvbnN0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWVGcm9tUHJvdG8ocHJvdG8pKVxuICAgICAgICAgICAgby5pZCA9IHRoaXMuaWQgKyAnJ1xuICAgICAgICAgICAgby50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChvKVxuICAgICAgICAgICAgbmV3T2JqLnNldCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnNldCh0aGlzLmlkLCBuZXdPYmopXG4gICAgICAgICAgICBjb250ZXh0LmVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG8gPSBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoKVxuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChvKVxuICAgICAgICAgICAgbmV3T2JqLnNldCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGNvbnRleHQuZW52aXJvLnNldCh0aGlzLmlkLCBuZXdPYmopXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9Db250ZXh0XCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLCByZWFkb25seSBwcm9wcz86IExleGVtZVtdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oY29udGV4dDogQ29udGV4dCk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGNvbnRleHQuZW52aXJvLmdldCh0aGlzLmlkKSA/PyBjb250ZXh0LmVudmlyby5zZXRQbGFjZWhvbGRlcih0aGlzLmlkKVxuICAgICAgICBvYmouc2V0KHRoaXMucHJlZGljYXRlLCB0aGlzLnByb3BzKVxuICAgIH1cblxuXG59IiwiXG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL0NvbnRleHRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRQcm90byB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLCByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0KTogYW55IHtcblxuICAgICAgICBjb25zdCBpc1NldEFsaWFzQ2FsbCA9ICAvLyBhc3N1bWUgaWYgYXQgbGVhc3Qgb25lIG93bmVkIGVudGl0eSB0aGF0IGl0J3MgYSBzZXQgYWxpYXMgY2FsbFxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXSkuc2xpY2UoMSkubGVuZ3RoXG4gICAgICAgICAgICB8fCB0aGlzLmNvbmNsdXNpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25jbHVzaW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuXG4gICAgICAgIGlmIChpc1NldEFsaWFzQ2FsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBbGlhc0NhbGwoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vdGhlcihjb250ZXh0KVxuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIHNldEFsaWFzQ2FsbCgpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG4gICAgICAgIHdyYXAocHJvdG8pLnNldEFsaWFzKGNvbmNlcHROYW1lWzBdLCBwcm9wc05hbWVzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgd3JhcCgke3Byb3RvfSkuc2V0QWxpYXMoJHtjb25jZXB0TmFtZVswXX0sIFske3Byb3BzTmFtZXN9XSlgKVxuICAgIH1cblxuICAgIG90aGVyKGNvbnRleHQ6IENvbnRleHQpIHtcbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXVxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZSh0b3ApWzBdXG4gICAgICAgIGNvbnN0IHkgPSBjb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2VPZihwcm90b05hbWUsICdYJykpXG4gICAgICAgIGNvbnN0IGlkcyA9IHkubWFwKG0gPT4gbVsnWCddKVxuICAgICAgICBpZHMuZm9yRWFjaChpZCA9PiBuZXcgRWRpdEFjdGlvbihpZCwgcHJlZGljYXRlKS5ydW4oY29udGV4dCkpXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgaXNDb25jZXB0LCBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IENvbmNlcHRBY3Rpb24gZnJvbSBcIi4vQ29uY2VwdEFjdGlvblwiO1xuaW1wb3J0IENyZWF0ZUFjdGlvbiBmcm9tIFwiLi9DcmVhdGVBY3Rpb25cIjtcbmltcG9ydCBFZGl0QWN0aW9uIGZyb20gXCIuL0VkaXRBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9vdEFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IEJhc2ljQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCk6IGFueSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MubGVuZ3RoID4gMSkgeyAvLyBub3QgaGFuZGxpbmcgcmVsYXRpb25zIHlldFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRWRpdEFjdGlvbih0aGlzLmNsYXVzZS5hcmdzWzBdLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIFtdKS5ydW4oY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRvcExldmVsLnJoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pLnNvbWUoeCA9PiBpc0NvbmNlcHQoeCkpKSB7IC8vIFxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb25jZXB0QWN0aW9uKHRoaXMuY2xhdXNlLmFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgdGhpcy5jbGF1c2UucHJlZGljYXRlLFxuICAgICAgICAgICAgICAgIHRoaXMudG9wTGV2ZWwpLnJ1bihjb250ZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkge1xuICAgICAgICAgICAgdGhpcy5mb3JUb3BMZXZlbChjb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mb3JOb25Ub3BMZXZlbChjb250ZXh0KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0UHJvcHModG9wTGV2ZWxFbnRpdHk6IElkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvcExldmVsXG4gICAgICAgICAgICAuZ2V0T3duZXJzaGlwQ2hhaW4odG9wTGV2ZWxFbnRpdHkpXG4gICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKGUpWzBdKSAvLyBBU1NVTUUgYXQgbGVhc3Qgb25lXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvclRvcExldmVsKGNvbnRleHQ6IENvbnRleHQpIHsgLy8gdGhpcyBpZCBpcyBUTCBlbnRpdHlcblxuICAgICAgICBjb25zdCBxID0gdGhpcy50b3BMZXZlbC50aGVtZS5hYm91dCh0aGlzLmNsYXVzZS5hcmdzWzBdKVxuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5lbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgaWQgPSBtYXBzPy5bMF0/Llt0aGlzLmNsYXVzZS5hcmdzWzBdXSA/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgaWYgKCFjb250ZXh0LmVudmlyby5nZXQoaWQpKSB7XG4gICAgICAgICAgICBjb250ZXh0LmVudmlyby5zZXRQbGFjZWhvbGRlcihpZClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5wcmVkaWNhdGUucHJvdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ3JlYXRlQWN0aW9uKGlkLFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkucnVuKGNvbnRleHQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVkaXRBY3Rpb24oaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSxcbiAgICAgICAgICAgICAgICB0aGlzLmdldFByb3BzKHRoaXMuY2xhdXNlLmFyZ3NbMF0pKS5ydW4oY29udGV4dClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBmb3JOb25Ub3BMZXZlbChjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgdExPd25lciA9IHRoaXMuZ2V0VG9wTGV2ZWxPd25lck9mKHRoaXMuY2xhdXNlLmFyZ3NbMF0sIHRoaXMudG9wTGV2ZWwpXG5cbiAgICAgICAgaWYgKCF0TE93bmVyKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5hbWVPZlRoaXMgPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290ID09IG5hbWVPZlRoaXNbMF0ucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxID0gdGhpcy50b3BMZXZlbC50aGVtZS5hYm91dCh0TE93bmVyKVxuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5lbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgdExPd25lcklkID0gbWFwcz8uWzBdPy5bdExPd25lcl0gLy8/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKHRMT3duZXJJZCxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgdGhpcy5nZXRQcm9wcyh0TE93bmVyKSkucnVuKGNvbnRleHQpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFRvcExldmVsT3duZXJPZihpZDogSWQsIHRvcExldmVsOiBDbGF1c2UpOiBJZCB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3Qgb3duZXJzID0gdG9wTGV2ZWwub3duZXJzT2YoaWQpXG5cbiAgICAgICAgY29uc3QgbWF5YmUgPSBvd25lcnNcbiAgICAgICAgICAgIC5maWx0ZXIobyA9PiB0b3BMZXZlbC50b3BMZXZlbCgpLmluY2x1ZGVzKG8pKS5hdCgwKVxuXG4gICAgICAgIGlmICghbWF5YmUgJiYgb3duZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRvcExldmVsT3duZXJPZihvd25lcnNbMF0sIHRvcExldmVsKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9Db250ZXh0XCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0dWF0b3IoKTogQWN0dWF0b3Ige1xuICAgIHJldHVybiBuZXcgQmFzZUFjdHVhdG9yKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBjb250ZXh0OiBDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNsYXVzZS50b0FjdGlvbihjbGF1c2UpLmZvckVhY2goYSA9PiBhLnJ1bihjb250ZXh0KSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL0NvbnRleHRcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHRoaXMuY29udGV4dC5jb25maWcuc3RhcnR1cENvbW1hbmRzLmZvckVhY2goYyA9PiB0aGlzLmV4ZWN1dGUoYykpXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXSB7XG5cbiAgICAgICAgcmV0dXJuIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbnRleHQuY29uZmlnKS5wYXJzZUFsbCgpLm1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5jb25maWcuc2V0U3ludGF4KGFzdCBhcyBhbnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdClcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXBzID0gdGhpcy5jb250ZXh0LmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RzID0gaWRzLm1hcChpZCA9PiB0aGlzLmNvbnRleHQuZW52aXJvLmdldChpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gbz8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0cy5tYXAobyA9PiBvPy5vYmplY3QpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkuZmxhdCgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgZ2V0TmV3Q29udGV4dCB9IGZyb20gXCIuLi9Db250ZXh0XCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKCk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oZ2V0TmV3Q29udGV4dCgpKVxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCwgaXNWYXIsIHRvQ29uc3QsIHRvVmFyIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uL2Vudmlyby9BbmFwaG9yYVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgTGVhZk5vZGUsIENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5cblxuXG5pbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICBzdWJqZWN0PzogSWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdD86IEFzdE5vZGU8QXN0VHlwZT4sIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3QgaXMgdW5kZWZpbmVkIWApXG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGFzdD8ubGlua3M/LnByb25vdW4gfHwgYXN0Py5saW5rcz8ubm91biB8fCBhc3Q/LmxpbmtzPy5hZGplY3RpdmUpIHtcbiAgICAgICAgcmVzdWx0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5yZWxwcm9uKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5wcmVwb3NpdGlvbikge1xuICAgICAgICByZXN1bHQgPSBjb21wbGVtZW50VG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnN1YmplY3QgJiYgYXN0Py5saW5rcy5wcmVkaWNhdGUpIHtcbiAgICAgICAgcmVzdWx0ID0gY29wdWxhU2VudGVuY2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcHJvcGFnYXRlVmFyc093bmVkKHJlc29sdmVBbmFwaG9yYShtYWtlQWxsVmFycyhyZXN1bHQpKSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAnJHthc3QudHlwZX0nIWApXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU2VudGVuY2VUb0NsYXVzZShjb3B1bGFTZW50ZW5jZTogQXN0Tm9kZTxBc3RUeXBlPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0QXN0ID0gY29wdWxhU2VudGVuY2U/LmxpbmtzPy5zdWJqZWN0XG4gICAgY29uc3QgcHJlZGljYXRlQXN0ID0gY29wdWxhU2VudGVuY2U/LmxpbmtzPy5wcmVkaWNhdGVcbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2Uoc3ViamVjdEFzdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICBjb25zdCBwcmVkaWNhdGUgPSB0b0NsYXVzZShwcmVkaWNhdGVBc3QsIHsgc3ViamVjdDogc3ViamVjdElkIH0pLmNvcHkoeyBuZWdhdGU6ICEhY29wdWxhU2VudGVuY2U/LmxpbmtzPy5uZWdhdGlvbiB9KVxuICAgIGNvbnN0IGVudGl0aWVzID0gc3ViamVjdC5lbnRpdGllcy5jb25jYXQocHJlZGljYXRlLmVudGl0aWVzKVxuXG4gICAgY29uc3QgcmVzdWx0ID0gZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKSA/ICAvLyBhc3N1bWUgYW55IHNlbnRlbmNlIHdpdGggYW55IHZhciBpcyBhbiBpbXBsaWNhdGlvblxuICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0LmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGNvcHVsYVN1YkNsYXVzZTogQXN0Tm9kZTxBc3RUeXBlPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBwcmVkaWNhdGUgPSBjb3B1bGFTdWJDbGF1c2U/LmxpbmtzPy5wcmVkaWNhdGUgLy9hcyBDb21wb3NpdGVOb2RlPENvbXBvc2l0ZVR5cGU+XG5cbiAgICByZXR1cm4gdG9DbGF1c2UocHJlZGljYXRlLCB7IHN1YmplY3Q6IGFyZ3M/LnN1YmplY3QgfSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IEFzdE5vZGU8QXN0VHlwZT4sIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpIC8vPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGNvbXBsZW1lbnQ/LmxpbmtzPy5wcmVwb3NpdGlvbj8ubGV4ZW1lXG5cbiAgICBpZiAoIXByZXBvc2l0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcHJlcG9zaXRpb24hJylcbiAgICB9XG5cbiAgICBjb25zdCBub3VuUGhyYXNlID0gY29tcGxlbWVudD8ubGlua3M/Llsnbm91biBwaHJhc2UnXVxuXG4gICAgcmV0dXJuIGNsYXVzZU9mKHByZXBvc2l0aW9uLCBzdWJqSWQsIG5ld0lkKVxuICAgICAgICAuYW5kKHRvQ2xhdXNlKG5vdW5QaHJhc2UsIHsgc3ViamVjdDogbmV3SWQgfSkpXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG5cbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKG5vdW5QaHJhc2U6IENvbXBvc2l0ZU5vZGU8Q29tcG9zaXRlVHlwZT4sIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgbWF5YmVJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2UubGlua3MudW5pcXVhbnQgPyB0b1ZhcihtYXliZUlkKSA6IG1heWJlSWRcblxuICAgIGNvbnN0IGFkamVjdGl2ZXM6IExlYWZOb2RlPExleGVtZVR5cGU+W10gPSAobm91blBocmFzZT8ubGlua3M/LmFkamVjdGl2ZSBhcyBhbnkpPy5saW5rcyA/PyBbXVxuICAgIGNvbnN0IG5vdW4gPSBub3VuUGhyYXNlLmxpbmtzLm5vdW4gPz8gbm91blBocmFzZS5saW5rcy5wcm9ub3VuXG4gICAgY29uc3QgY29tcGxlbWVudHM6IExlYWZOb2RlPExleGVtZVR5cGU+W10gPSAobm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQgYXMgYW55KT8ubGlua3MgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlLmxpbmtzLnN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5tYXAoYSA9PiBhLmxleGVtZSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuYW5kKGNvbXBsZW1lbnRzLm1hcChjID0+IGMgPyB0b0NsYXVzZShjLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKCkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gdG9DbGF1c2Uoc3ViQ2xhdXNlLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KSA6IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBtYWtlQWxsVmFycyhjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7IC8vIGFzc3VtZSBpZHMgYXJlIGNhc2UgaW5zZW5zaXRpdmUsIGFzc3VtZSBpZiBJRFggaXMgdmFyIGFsbCBpZHggYXJlIHZhclxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbdG9Db25zdChlKV06IGUgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59XG5cbmZ1bmN0aW9uIHJlc29sdmVBbmFwaG9yYShjbGF1c2U6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICBpZiAoY2xhdXNlLnJoZW1lLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZSgpLmhhc2hDb2RlKSB7XG4gICAgICAgIHJldHVybiBjbGF1c2VcbiAgICB9XG5cbiAgICBjb25zdCBhID0gZ2V0QW5hcGhvcmEoKVxuICAgIGEuYXNzZXJ0KGNsYXVzZS50aGVtZSlcbiAgICByZXR1cm4gY2xhdXNlLmNvcHkoeyBtYXA6IGEucXVlcnkoY2xhdXNlLnJoZW1lKVswXSA/PyB7fSB9KVxufVxuXG5mdW5jdGlvbiBwcm9wYWdhdGVWYXJzT3duZWQoY2xhdXNlOiBDbGF1c2UpOiBDbGF1c2Ugey8vIGFzc3VtZSBhbnl0aGluZyBvd25lZCBieSBhIHZhcmlhYmxlIGlzIGFsc28gYSB2YXJpYWJsZVxuXG4gICAgY29uc3QgbSA9IGNsYXVzZS5lbnRpdGllc1xuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gY2xhdXNlLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiBjbGF1c2UuY29weSh7IG1hcDogbSB9KVxuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWU6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBBbmQge1xuXG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6XG4gICAgICAgICAgICBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcylcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHsgLy9UT0RPOiBpZiB0aGlzIGlzIG5lZ2F0ZWQhXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiBlbXB0eUNsYXVzZSgpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkuY29uY2F0KHRoaXMuY2xhdXNlMi50b0FjdGlvbih0b3BMZXZlbCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFJvb3RBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvUm9vdEFjdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IExleGVtZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbbmV3IFJvb3RBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCJcbmltcG9ydCB7IEVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICB0b3BMZXZlbCgpOiBJZFtdXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6IENsYXVzZSA9PiBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG90aGVyXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gY29uY2x1c2lvblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEltcGx5QWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0ltcGx5QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uc2VxdWVuY2U6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSB0cnVlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGNvbnNlcXVlbmNlKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25zZXF1ZW5jZS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5lbnRpdGllcylcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8vVE9ETyEhISEhISEhXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbnNlcXVlbmNlLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25zZXF1ZW5jZS5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zZXF1ZW5jZS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbbmV3IEltcGx5QWN0aW9uKHRoaXMuY29uZGl0aW9uLCB0aGlzLmNvbnNlcXVlbmNlKV1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29uZmlnIGltcGxlbWVudHMgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSxcbiAgICAgICAgcHJvdGVjdGVkIF9sZXhlbWVzOiBMZXhlbWVbXSxcbiAgICAgICAgcmVhZG9ubHkgc3ludGF4TWFwOiBTeW50YXhNYXAsXG4gICAgICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10sXG4gICAgICAgIHJlYWRvbmx5IHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSkge1xuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXSB7XG5cbiAgICAgICAgY29uc3Qgc2wgPSB0aGlzLl9zeW50YXhMaXN0XG4gICAgICAgICAgICAuc2xpY2UoKVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXAsIHRoaXMuc3RhdGljQXNjZW5kaW5nUHJlY2VkZW5jZSkpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geCAhPT0gJ2FycmF5JylcblxuICAgICAgICByZXR1cm4gWy4uLm5ldyBTZXQoc2wpXVxuXG4gICAgICAgIC8vIHJldHVybiBbXG4gICAgICAgIC8vICAgICAnbWFjcm8nLFxuICAgICAgICAvLyAgICAgJ21hY3JvcGFydCcsXG4gICAgICAgIC8vICAgICAndGFnZ2VkdW5pb24nLFxuICAgICAgICAvLyAgICAgJ2FuZHNlbnRlbmNlJyxcbiAgICAgICAgLy8gICAgICdjb3B1bGFzZW50ZW5jZScsXG4gICAgICAgIC8vICAgICAnY29tcGxlbWVudCcsXG4gICAgICAgIC8vICAgICAnc3ViY2xhdXNlJyxcbiAgICAgICAgLy8gICAgICdub3VucGhyYXNlJ11cbiAgICB9XG5cbiAgICBnZXQgbGV4ZW1lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xleGVtZXNcbiAgICB9XG5cbiAgICBzZXRTeW50YXggPSAobWFjcm86IENvbXBvc2l0ZU5vZGU8XCJtYWNyb1wiPikgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBzeW50YXgubmFtZSB9KVxuICAgICAgICB0aGlzLl9zeW50YXhMaXN0LnB1c2goc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZSkgLy9UT0RPOiBjaGVjayBkdXBsaWNhdGVzP1xuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcblxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgICAgIHRoaXMuX2xleGVtZXMgPSB0aGlzLl9sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIHRoaXMuX2xleGVtZXMucHVzaChsZXhlbWUpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVOb2RlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBCYXNpY0NvbmZpZyB9IGZyb20gXCIuL0Jhc2ljQ29uZmlnXCJcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUsIGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBzdGFydHVwQ29tbWFuZHMgfSBmcm9tIFwiLi9zdGFydHVwQ29tbWFuZHNcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSwgY29uc3RpdHVlbnRUeXBlcywgc3RhdGljQXNjZW5kaW5nUHJlY2VkZW5jZSwgc3ludGF4ZXMgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWVbXVxuICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW11cbiAgICByZWFkb25seSBzeW50YXhMaXN0OiBDb21wb3NpdGVUeXBlW11cbiAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IENvbXBvc2l0ZU5vZGU8J21hY3JvJz4pOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cbiAgICByZXR1cm4gbmV3IEJhc2ljQ29uZmlnKFxuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgY29uc3RpdHVlbnRUeXBlcyxcbiAgICAgICAgbGV4ZW1lcyxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHN0YXJ0dXBDb21tYW5kcyxcbiAgICAgICAgc3RhdGljQXNjZW5kaW5nUHJlY2VkZW5jZSlcbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAndGhlbicsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdncmFtbWFyJyxcbiAgJ25vbnN1YmNvbmonLCAvLyBhbmQgLi4uXG4gICdkaXNqdW5jJywgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbiAgJ3Byb25vdW4nXG4pXG4vLyAncXVhbnRhZGonLFxuLy8gJ3NlbWFudGljcycgLy8/XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IGNvbnN0aXR1ZW50VHlwZXMgfSBmcm9tIFwiLi9zeW50YXhlc1wiO1xuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdoYXZlJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnaGF2ZScsICdoYXMnXSxcbiAgICAgICAgaXJyZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcHJvdG86ICdIVE1MQnV0dG9uRWxlbWVudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbGlzdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcHJvdG86ICdBcnJheSdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqZWN0aXZlJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgaXJyZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZSxcbiAgICAgICAgZm9ybXM6IFsnZG8nLCAnZG9lcyddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3NvbWUnLFxuICAgICAgICB0eXBlOiAnZXhpc3RxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZXZlcnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FsbCcsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW55JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0bycsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2l0aCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZnJvbScsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb2YnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ292ZXInLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhdCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICd0aGVuJyAvLyBmaWxsZXIgd29yZFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc3ViamVjdCcsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZWRpY2F0ZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29wdGlvbmFsJyxcbiAgICAgICAgdHlwZTogJ2FkamVjdGl2ZScsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnMXwwJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbmUgb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJysnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3plcm8gb3IgbW9yZScsXG4gICAgICAgIHR5cGU6ICdhZGplY3RpdmUnLFxuICAgICAgICBjYXJkaW5hbGl0eTogJyonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29yJyxcbiAgICAgICAgdHlwZTogJ2Rpc2p1bmMnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2l0JyxcbiAgICAgICAgdHlwZTogJ3Byb25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGNvbmNlcHRzOiBbJ2NvbmNlcHQnXVxuICAgIH0sXG5dXG5cbi8qKlxuICogR3JhbW1hclxuICovXG5jb25zdGl0dWVudFR5cGVzLmNvbmNhdChsZXhlbWVUeXBlcyBhcyBhbnkpLmZvckVhY2goZyA9PiB7XG4gICAgbGV4ZW1lcy5wdXNoKHtcbiAgICAgICAgcm9vdDogZyxcbiAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgfSlcbn0pIiwiZXhwb3J0IGNvbnN0IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10gPSBbXG5cbiAgICAvLyBncmFtbWFyXG4gICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgJ2FydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0JyxcbiAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW4gcGhyYXNlJyxcbiAgICAnY29wdWxhIHNlbnRlbmNlIGlzIHN1YmplY3Qgbm91biBwaHJhc2UgdGhlbiBjb3B1bGEgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiB0aGVuIHByZWRpY2F0ZSBub3VuIHBocmFzZScsXG4gICAgJ25vdW4gcGhyYXNlIGlzIG9wdGlvbmFsIHF1YW50aWZpZXIgdGhlbiBvcHRpb25hbCBhcnRpY2xlIHRoZW4gemVybyAgb3IgIG1vcmUgYWRqZWN0aXZlcyB0aGVuIG9wdGlvbmFsIG5vdW4gb3IgcHJvbm91biB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSB0aGVuIHplcm8gb3IgbW9yZSBjb21wbGVtZW50cyAnLFxuICAgICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIG5vdW4gcGhyYXNlJyxcbiAgICAnc3ViY2xhdXNlIGlzIGNvcHVsYXN1YmNsYXVzZScsXG5cbiAgICAvLyBkb21haW5cbiAgICAnY29sb3IgaXMgYSBjb25jZXB0JyxcbiAgICAncmVkIGlzIGEgY29sb3InLFxuICAgICdibHVlIGlzIGEgY29sb3InLFxuICAgICdibGFjayBpcyBhIGNvbG9yJyxcbiAgICAnZ3JlZW4gaXMgYSBjb2xvcicsXG4gICAgJ2NvbG9yIG9mIGFueSBidXR0b24gaXMgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiBidXR0b24nLFxuICAgICd0ZXh0IG9mIGFueSBidXR0b24gaXMgdGV4dENvbnRlbnQgb2YgYnV0dG9uJyxcbl0iLCJpbXBvcnQgeyBSb2xlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCB7IEVsZW1lbnRUeXBlLCBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICd0YWdnZWR1bmlvbicsXG4gICAgJ2FycmF5JywgLy8gY29uc2VjdXRpdmUgYXN0c1xuICAgICdtYWNyb3BhcnQnLFxuICAgICdtYWNybycsXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ2NvcHVsYSBzZW50ZW5jZScsXG4gICAgJ25vdW4gcGhyYXNlJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ3N1YmNsYXVzZScsXG4gICAgJ2FuZCBzZW50ZW5jZScsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNBc2NlbmRpbmdQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW10gPSBbXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAnYXJyYXknLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICdtYWNybyddXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgLy8gcGVybWFuZW50XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bicsICdncmFtbWFyJ10sIG51bWJlcjogMSwgcm9sZTogJ25vdW4nIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2dyYW1tYXInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ2FycmF5JzogW1xuXG4gICAgXSxcblxuICAgIC8vIGV4dGVuZGlibGVcbiAgICAnc3ViY2xhdXNlJzogW1xuXG4gICAgXSxcbiAgICAnbm91biBwaHJhc2UnOiBbXG5cbiAgICBdLFxuICAgICdjb21wbGVtZW50JzogW1xuXG4gICAgXSxcblxuICAgICdjb3B1bGEgc2VudGVuY2UnOiBbXG5cbiAgICBdLFxuXG4gICAgJ2FuZCBzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSBzZW50ZW5jZScsICdub3VuIHBocmFzZSddLCBudW1iZXI6IDEsIHJvbGU6ICdvbmUnIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vbnN1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydhbmQgc2VudGVuY2UnLCAnY29wdWxhIHNlbnRlbmNlJywgJ25vdW4gcGhyYXNlJ10sIG51bWJlcjogJysnLCByb2xlOiAndHdvJyBhcyBSb2xlIH1cbiAgICBdLFxufVxuXG4iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbmV4cG9ydCB0eXBlIEVsZW1lbnRUeXBlPFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PHVua25vd24+PiA9IFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PGluZmVyIEVsZW1lbnRUeXBlPiA/IEVsZW1lbnRUeXBlIDogbmV2ZXI7XG4iLCJpbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgZ2V0RW52aXJvIGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuYXBob3JhIHtcbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5hcGhvcmEoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IHVuZGVmaW5lZCB9KSkge1xuXG4gICAgfVxuXG4gICAgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKSB7XG4gICAgICAgIGdldEFjdHVhdG9yKCkudGFrZUFjdGlvbihjbGF1c2UuY29weSh7IGV4YWN0SWRzOiB0cnVlIH0pLCB7IGVudmlybzogdGhpcy5lbnZpcm8sIGNvbmZpZzogey8qIFRPRE8gYXNzdW1pbmcgYW5hcGhvcmEgZG9udCBjYXJlIGFib3V0IGxleGVtZSBhbmQgc3ludGF4ZXMgY29uZmlnKi8gfSBhcyBhbnkgfSlcbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5pbXBvcnQgeyBQbGFjZWhvbGRlciB9IGZyb20gXCIuL1BsYWNlaG9sZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiBXcmFwcGVyIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG5ldyBQbGFjZWhvbGRlcigpXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cblxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgcGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBQbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5wcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnNldChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG5cbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHsgLy9UT0RPIHRoaXMgaXMgYSB0bXAgc29sdXRpb24sIGZvciBhbmFwaG9yYSByZXNvbHV0aW9uLCBidXQganVzdCB3aXRoIGRlc2NyaXB0aW9ucywgd2l0aG91dCB0YWtpbmcgKG11bHRpLWVudGl0eSkgcmVsYXRpb25zaGlwcyBpbnRvIGFjY291bnRcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IGU6IHhbMF0sIHc6IHhbMV0gfSkpXG5cbiAgICAgICAgY29uc3QgcXVlcnkgPSBjbGF1c2UgLy8gZGVzY3JpYmVkIGVudGl0aWVzXG4gICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgIC5tYXAoZSA9PiAoeyBlLCBkZXNjOiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSkgfSkpXG5cbiAgICAgICAgY29uc3QgZ2V0SXQgPSAoKSA9PiB0aGlzLmxhc3RSZWZlcmVuY2VkID8gW3sgZTogdGhpcy5sYXN0UmVmZXJlbmNlZCBhcyBzdHJpbmcsIHc6IHRoaXMuZGljdGlvbmFyeVt0aGlzLmxhc3RSZWZlcmVuY2VkXSB9XSA6IFtdXG5cbiAgICAgICAgY29uc3QgcmVzID0gcXVlcnlcbiAgICAgICAgICAgIC5mbGF0TWFwKHEgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSB1bml2ZXJzZVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHUgPT4gcS5kZXNjLmV2ZXJ5KGQgPT4gdS53LmlzKGQpKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gLmNvbmNhdChxLmRlc2MuaW5jbHVkZXMoJ2l0JykgPyBnZXRJdCgpIDogW10pIC8vVE9ETzogaGFyZGNvZGVkIGJhZFxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHEuZGVzYy5maW5kKHggPT4geC50eXBlID09ICdwcm9ub3VuJykgPyBnZXRJdCgpIDogW10pXG5cblxuICAgICAgICAgICAgICAgIC8vVE9ETzogYWZ0ZXIgXCJldmVyeSAuLi5cIiBzZW50ZW5jZSwgXCJpdFwiIHNob3VsZCBiZSB1bmRlZmluZWRcblxuICAgICAgICAgICAgICAgIHJldHVybiB7IGZyb206IHEuZSwgdG86IHRvIH1cblxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjb25zdCByZXNTaXplID0gTWF0aC5tYXgoLi4ucmVzLm1hcChxID0+IHEudG8ubGVuZ3RoKSk7XG4gICAgICAgIGNvbnN0IGZyb21Ub1RvID0gKGZyb206IElkKSA9PiByZXMuZmlsdGVyKHggPT4geC5mcm9tID09PSBmcm9tKVswXS50by5tYXAoeCA9PiB4LmUpO1xuICAgICAgICBjb25zdCByYW5nZSA9IChuOiBudW1iZXIpID0+IFsuLi5uZXcgQXJyYXkobikua2V5cygpXVxuXG4gICAgICAgIGNvbnN0IHJlczIgPSByYW5nZShyZXNTaXplKS5tYXAoaSA9PlxuICAgICAgICAgICAgY2xhdXNlXG4gICAgICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmcm9tID0+IGZyb21Ub1RvKGZyb20pLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgLm1hcChmcm9tID0+ICh7IFtmcm9tXTogZnJvbVRvVG8oZnJvbSlbaV0gPz8gZnJvbVRvVG8oZnJvbSlbMF0gfSkpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSkpXG5cbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IHJlczIuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpLmF0KC0xKSA/PyB0aGlzLmxhc3RSZWZlcmVuY2VkXG5cbiAgICAgICAgcmV0dXJuIHJlczIgLy8gcmV0dXJuIGxpc3Qgb2YgbWFwcywgd2hlcmUgZWFjaCBtYXAgc2hvdWxkIHNob3VsZCBoYXZlIEFMTCBpZHMgZnJvbSBjbGF1c2UgaW4gaXRzIGtleXMsIGVnOiBbe2lkMjppZDEsIGlkNDppZDN9LCB7aWQyOjEsIGlkNDozfV0uXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG9iamVjdDogYW55LFxuICAgICAgICByZWFkb25seSBzaW1wbGVDb25jZXB0czogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHN0cmluZ1tdIH0gPSBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPz8ge30pIHtcblxuICAgICAgICBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPSBzaW1wbGVDb25jZXB0c1xuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPiAxKSB7IC8vIGFzc3VtZSA+IDEgcHJvcHMgYXJlIGEgcGF0aFxuXG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcy5tYXAoeCA9PiB4LnRva2VuID8/IHgucm9vdCksIHByZWRpY2F0ZS5yb290KVxuXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID09PSAxKSB7IC8vIHNpbmdsZSBwcm9wXG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNpbXBsZUNvbmNlcHRzKS5pbmNsdWRlcyhwcm9wc1swXS5yb290KSkgeyAvLyBpcyBjb25jZXB0IFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF0ucm9vdF0sIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gLi4uIG5vdCBjb25jZXB0LCBqdXN0IHByb3BcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcy5tYXAoeCA9PiB4LnRva2VuID8/IHgucm9vdCksIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoIXByb3BzIHx8IHByb3BzLmxlbmd0aCA9PT0gMCkgeyAvLyBubyBwcm9wc1xuXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlLmNvbmNlcHRzICYmIHByZWRpY2F0ZS5jb25jZXB0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcmVkaWNhdGUuY29uY2VwdHNbMF1dLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlLnJvb3RdID0gdHJ1ZSAvLyBmYWxsYmFja1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMClcblxuICAgICAgICByZXR1cm4gY29uY2VwdCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRdKSA9PT0gcHJlZGljYXRlLnJvb3QgOlxuICAgICAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlLnJvb3RdICE9PSB1bmRlZmluZWRcblxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHROYW1lLnJvb3RdID0gcHJvcFBhdGgubWFwKHggPT4geC5yb290KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHhcblxuICAgIH1cblxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZFxuICAgIHNldFBsYWNlaG9sZGVyKGlkOiBJZCk6IFdyYXBwZXJcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxuICAgIC8vIGdldCBrZXlzKCk6IElkW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCJcblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGVzOiBMZXhlbWVbXSA9IFtdLCByZWFkb25seSBvYmplY3Q6IGFueSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIHByb3BzPzogTGV4ZW1lW10pIHtcbiAgICAgICAgdGhpcy5wcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKVxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZXMuc29tZSh4ID0+IHgucm9vdCA9PSBwcmVkaWNhdGUucm9vdClcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pIHsgfVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkgeyB9XG5cbn1cbiIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgQ29uY3JldGVXcmFwcGVyIGZyb20gXCIuL0NvbmNyZXRlV3JhcHBlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IG9iamVjdDogYW55XG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBwcm9wcz86IExleGVtZVtdKTogdm9pZFxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiAvLyBUT0RPIGFyZ3NcbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pOiB2b2lkXG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZFxuICAgIC8vIGdldChwcmVkaWNhdGU6IHN0cmluZyk6IGFueVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKG86IGFueSk6IFdyYXBwZXIge1xuICAgIHJldHVybiBuZXcgQ29uY3JldGVXcmFwcGVyKG8pXG59IiwiaW1wb3J0IG1haW4gZnJvbSBcIi4vbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcblxuXG4oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGF1dG90ZXN0ZXIoKVxuICAgIG1haW4oKVxufSkoKVxuXG4vLyBcbiIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcywgaXNNdWx0aVdvcmQsIExleGVtZSwgcmVzcGFjZSwgc3Rkc3BhY2UsIHVuc3BhY2UgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWVbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcpIHtcblxuXG5cbiAgICAgICAgdGhpcy50b2tlbnMgPVxuICAgICAgICAgICAgdGhpcy5qb2luTXVsdGlXb3JkTGV4ZW1lcyhzdGRzcGFjZShzb3VyY2VDb2RlKSwgY29uZmlnLmxleGVtZXMpXG4gICAgICAgICAgICAgICAgLy8gLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgICAgICAubWFwKHMgPT4gcmVzcGFjZShzKSlcbiAgICAgICAgICAgICAgICAuZmxhdE1hcChzID0+IGdldExleGVtZXMocywgY29uZmlnLmxleGVtZXMpKVxuXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgam9pbk11bHRpV29yZExleGVtZXMoc291cmNlQ29kZTogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWVbXSkge1xuXG4gICAgICAgIGxldCBuZXdTb3VyY2UgPSBzb3VyY2VDb2RlXG5cbiAgICAgICAgbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IGlzTXVsdGlXb3JkKHgpKVxuICAgICAgICAgICAgLmZvckVhY2goeCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGV4ZW1lID0gc3Rkc3BhY2UoeC5yb290KVxuICAgICAgICAgICAgICAgIG5ld1NvdXJjZSA9IG5ld1NvdXJjZS5yZXBsYWNlQWxsKGxleGVtZSwgdW5zcGFjZShsZXhlbWUpKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gbmV3U291cmNlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IExleGVtZVR5cGVcbiAgICAvKip1c2VmdWwgZm9yIGlycmVndWxhciBzdHVmZiovIHJlYWRvbmx5IGZvcm1zPzogc3RyaW5nW11cbiAgICAvKipyZWZlcnMgdG8gdmVyYiBjb25qdWdhdGlvbnMgb3IgcGx1cmFsIGZvcm1zLCBhc3N1bWUgcmVndWxhcml0eSovIHJlYWRvbmx5IGlycmVndWxhcj86IGJvb2xlYW5cbiAgICAvKipzZW1hbnRpY2FsIGRlcGVuZGVjZSovIHJlYWRvbmx5IGRlcml2ZWRGcm9tPzogc3RyaW5nXG4gICAgLyoqc2VtYW50aWNhbCBlcXVpdmFsZW5jZSovIHJlYWRvbmx5IGFsaWFzRm9yPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyByZWFkb25seSBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi9yZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIC8qKmZvciBxdWFudGFkaiAqLyByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVhZG9ubHkgY29uY2VwdHM/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHByb3RvPzogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3Jtc09mKGxleGVtZTogTGV4ZW1lKSB7XG5cbiAgICByZXR1cm4gW2xleGVtZS5yb290XS5jb25jYXQobGV4ZW1lPy5mb3JtcyA/PyBbXSlcbiAgICAgICAgLmNvbmNhdCghbGV4ZW1lLmlycmVndWxhciA/IFtgJHtsZXhlbWUucm9vdH1zYF0gOiBbXSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZVtdKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWUgPVxuICAgICAgICBsZXhlbWVzLmZpbHRlcih4ID0+IGZvcm1zT2YoeCkuaW5jbHVkZXMod29yZCkpLmF0KDApXG4gICAgICAgID8/IHsgcm9vdDogd29yZCwgdHlwZTogJ25vdW4nIH1cblxuICAgIGNvbnN0IGxleGVtZTI6IExleGVtZSA9IHsgLi4ubGV4ZW1lLCB0b2tlbjogd29yZCB9XG5cbiAgICByZXR1cm4gbGV4ZW1lMi5jb250cmFjdGlvbkZvciA/XG4gICAgICAgIGxleGVtZTIuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCwgbGV4ZW1lcykpIDpcbiAgICAgICAgW2xleGVtZTJdXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3RvKGxleGVtZTogTGV4ZW1lKTogT2JqZWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gKHdpbmRvdyBhcyBhbnkpPy5bbGV4ZW1lLnByb3RvIGFzIGFueV0/LnByb3RvdHlwZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb25jZXB0KGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGxleGVtZS5jb25jZXB0cz8uaW5jbHVkZXMoJ2NvbmNlcHQnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNNdWx0aVdvcmQobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICByZXR1cm4gbGV4ZW1lLnJvb3QuaW5jbHVkZXMoJyAnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5zcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgnICcsICctJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BhY2Uoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2VBbGwoJy0nLCAnICcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGRzcGFjZShzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZUFsbCgvXFxzKy9nLCAnICcpXG59IiwiaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOiBDb25maWcpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKCksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5oaWRkZW4gPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID8gdGV4dGFyZWEuZm9jdXMoKSA6IDBcbiAgICB9XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSlcblxufSIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUsIExlYWZOb2RlLCBDb21wb3NpdGVOb2RlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbmZpZykpIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGU8QXN0VHlwZT5bXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb25maWcuc3ludGF4TGlzdClcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goYXN0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkge1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmtub3duUGFyc2UodCwgcm9sZSlcblxuICAgICAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxleGVyLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga25vd25QYXJzZSA9IChuYW1lOiBBc3RUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBMZWFmTm9kZTxMZXhlbWVUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZS5pbmNsdWRlcyh0aGlzLmxleGVyLnBlZWsudHlwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB4LnR5cGUsIGxleGVtZTogeCB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb21wb3NpdGVUeXBlLCByb2xlPzogUm9sZSk6IENvbXBvc2l0ZU5vZGU8Q29tcG9zaXRlVHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXN0VHlwZSA9IGFzdC50eXBlICE9PSAnYXJyYXknID8gYXN0LnR5cGUgOiBPYmplY3QudmFsdWVzKChhc3QgYXMgQ29tcG9zaXRlTm9kZTwnYXJyYXknPikubGlua3MpLmF0KDApPy50eXBlXG5cbiAgICAgICAgICAgIGlmIChhc3RUeXBlKSB7XG4gICAgICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdFR5cGVdID0gYXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBhbnlbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5UGFyc2UobS50eXBlLCBtLnJvbGUpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIGxpbmtzOiAobGlzdCBhcyBhbnkpIC8vVE9ETyEhISFcbiAgICAgICAgfSkgOiBsaXN0WzBdXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi9TeW50YXhcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZTxBc3RUeXBlPltdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb25maWc6IENvbmZpZyk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn1cblxuXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENvbXBvc2l0ZU5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgU3ludGF4LCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBDb21wb3NpdGVOb2RlPCdtYWNybyc+KTogeyBuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4IH0ge1xuICAgIGNvbnN0IG1hY3JvcGFydHMgPSAobWFjcm8ubGlua3MubWFjcm9wYXJ0IGFzIGFueSkubGlua3MgYXMgQ29tcG9zaXRlTm9kZTwnbWFjcm9wYXJ0Jz5bXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IChtYWNyby5saW5rcy5ub3VuIGFzIGFueSkubGV4ZW1lLnJvb3RcbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IENvbXBvc2l0ZU5vZGU8J21hY3JvcGFydCc+KTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZXM6IExleGVtZVtdID0gKG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlIGFzIGFueSk/LmxpbmtzPy5tYXAoKGE6IGFueSkgPT4gYS5sZXhlbWUpID8/IFtdXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gKG1hY3JvUGFydC5saW5rcy50YWdnZWR1bmlvbiBhcyBhbnkpLmxpbmtzIGFzIENvbXBvc2l0ZU5vZGU8J3RhZ2dlZHVuaW9uJz5bXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3MuZ3JhbW1hcilcblxuICAgIGNvbnN0IHF1YW50YWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gYS5jYXJkaW5hbGl0eSlcbiAgICBjb25zdCBxdWFsYWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gIWEuY2FyZGluYWxpdHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5tYXAoZyA9PiAoZyBhcyBhbnkpLmxleGVtZS5yb290KSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2U6IEFzdFR5cGVbXSkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBzdGF0aWNDb21wYXJlKGEsIGIsIHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2UpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gc3RhdGljQ29tcGFyZShhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzdGF0aWNCeUFzY1ByZWNlZGVuY2U6IEFzdFR5cGVbXSkge1xuXG4gICAgY29uc3QgcGEgPSBzdGF0aWNCeUFzY1ByZWNlZGVuY2UuaW5kZXhPZihhKVxuICAgIGNvbnN0IHBiID0gc3RhdGljQnlBc2NQcmVjZWRlbmNlLmluZGV4T2YoYilcblxuICAgIGlmIChwYSA9PT0gLTEgfHwgcGIgPT09IC0xKSB7IC8vIGVpdGhlciBvbmUgaXMgY3VzdG9tXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGEgLSBwYlxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKTogQXN0VHlwZVtdIHtcbiAgICByZXR1cm4gKHN5bnRheGVzW2FdID8/IFtdKS5mbGF0TWFwKG0gPT4gbS50eXBlKVxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXN0KCkgPyAnc3VjY2VzcycgOiAnZmFpbCcsIHRlc3QubmFtZSlcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKVxuICAgICAgICBjbGVhckRvbSgpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5jb250ZXh0LmVudmlyby52YWx1ZXMubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneSBpcyBhIGJ1dHRvbi4geCBpcyByZWQuIHkgaXMgYSBncmVlbiBidXR0b24uIHggaXMgYSBidXR0b24uIHogaXMgYSBibGFjayBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gKGJyYWluLmV4ZWN1dGUoJ2EgYmxhY2sgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuXG5mdW5jdGlvbiB0ZXN0NSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgY29sb3Igb2YgeCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDYoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgeCBpcyBncmVlbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cblxuZnVuY3Rpb24gdGVzdDcoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4geSBpcyBhIGJ1dHRvbi4geiBpcyBhIGJ1dHRvbi4gZXZlcnkgYnV0dG9uIGlzIHJlZC4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYnJhaW4uZXhlY3V0ZSgneScpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDMgPSAoYnJhaW4uZXhlY3V0ZSgneicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5mdW5jdGlvbiB0ZXN0OCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0ZXh0IG9mIHggaXMgY2FwcmEuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpKVswXS50ZXh0Q29udGVudCA9PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ3JlZCcpKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ2dyZWVuJykpLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuZnVuY3Rpb24gdGVzdDEwKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB6IGlzIGEgYmx1ZSBidXR0b24uIHRoZSByZWQgYnV0dG9uLiBpdCBpcyBibGFjay4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSBicmFpbi5leGVjdXRlKCd4JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnYmxhY2snXG4gICAgY29uc3QgYXNzZXJ0MiA9IGJyYWluLmV4ZWN1dGUoJ3knKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gYnJhaW4uZXhlY3V0ZSgneicpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsdWUnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNzOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBvayh0cnVlKSwgbWlsbGlzZWNzKVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsZWFyRG9tKCkge1xuICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gJydcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnd2hpdGUnXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==