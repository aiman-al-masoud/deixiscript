/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/actuator/actions/BasicAction.ts":
/*!*************************************************!*\
  !*** ./app/src/actuator/actions/BasicAction.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const CreateAction_1 = __importDefault(__webpack_require__(/*! ./CreateAction */ "./app/src/actuator/actions/CreateAction.ts"));
const EditAction_1 = __importDefault(__webpack_require__(/*! ./EditAction */ "./app/src/actuator/actions/EditAction.ts"));
class BasicAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(enviro) {
        if (this.clause.args.length > 1) { // not handling relations yet
            return;
        }
        if (this.clause.exactIds) {
            return new EditAction_1.default(this.clause.args[0], this.clause.predicate, []).run(enviro);
        }
        if (this.topLevel.topLevel().includes(this.clause.args[0])) {
            this.forTopLevel(enviro);
        }
        else {
            this.forNonTopLevel(enviro);
        }
    }
    getProps(topLevelEntity) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]); // ASSUME at least one
    }
    forTopLevel(enviro) {
        var _a, _b;
        const q = this.topLevel.theme.about(this.clause.args[0]);
        const maps = enviro.query(q);
        const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
        if (!enviro.get(id)) {
            enviro.setPlaceholder(id);
        }
        // if (this.clause.predicate.isConcept) {
        //     console.log('new instance of concept:', this.topLevel.theme.describe(this.clause.args[0])[0].root.toUpperCase(), 'is a', this.clause.predicate.root.toUpperCase())
        // }
        // if (this.clause.predicate.root === 'concept') {
        //     console.log('new concept:', this.topLevel.theme.describe(this.clause.args[0])[0].root.toUpperCase())
        // }
        if (this.clause.predicate.proto) {
            new CreateAction_1.default(id, this.clause.predicate).run(enviro);
        }
        else {
            new EditAction_1.default(id, this.clause.predicate, this.getProps(this.clause.args[0])).run(enviro);
        }
    }
    forNonTopLevel(enviro) {
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
        const maps = enviro.query(q);
        const tLOwnerId = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[tLOwner]; //?? getRandomId()
        return new EditAction_1.default(tLOwnerId, this.clause.predicate, this.getProps(tLOwner)).run(enviro);
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
exports["default"] = BasicAction;


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
    run(enviro) {
        var _a;
        if (enviro.exists(this.id)) { //  existence check prior to creating
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
            enviro.set(this.id, newObj);
            (_a = enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
        }
        else {
            const o = new proto.constructor();
            const newObj = (0, Wrapper_1.wrap)(o);
            newObj.set(this.predicate);
            enviro.set(this.id, newObj);
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
    run(enviro) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const obj = (_a = enviro.get(this.id)) !== null && _a !== void 0 ? _a : enviro.setPlaceholder(this.id);
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
    run(enviro) {
        const isSetAliasCall = // assume if at least one owned entity that it's a set alias call
         this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
            || this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length;
        if (isSetAliasCall) {
            this.setAliasCall();
        }
        else {
            this.other(enviro);
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
    other(enviro) {
        const top = this.condition.topLevel()[0];
        const protoName = this.condition.describe(top)[0]; // assume one 
        const predicate = this.conclusion.describe(top)[0];
        const y = enviro.query((0, Clause_1.clauseOf)(protoName, 'X'));
        const ids = y.map(m => m['X']);
        ids.forEach(id => new EditAction_1.default(id, predicate).run(enviro));
    }
}
exports["default"] = ImplyAction;


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
    takeAction(clause, enviro) {
        clause.toAction(clause).forEach(a => a.run(enviro));
    }
}
exports["default"] = BaseActuator;


/***/ }),

/***/ "./app/src/brain/BasicBrain.ts":
/*!*************************************!*\
  !*** ./app/src/brain/BasicBrain.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
const Actuator_1 = __webpack_require__(/*! ../actuator/actuator/Actuator */ "./app/src/actuator/actuator/Actuator.ts");
const toClause_1 = __webpack_require__(/*! ./toClause */ "./app/src/brain/toClause.ts");
const Parser_1 = __webpack_require__(/*! ../parser/interfaces/Parser */ "./app/src/parser/interfaces/Parser.ts");
class BasicBrain {
    constructor(config, enviro = (0, Enviro_1.default)({ root: document.body }), actuator = (0, Actuator_1.getActuator)()) {
        this.config = config;
        this.enviro = enviro;
        this.actuator = actuator;
        this.config.startupCommands.forEach(c => this.execute(c));
    }
    execute(natlang) {
        return (0, Parser_1.getParser)(natlang, this.config).parseAll().map(ast => {
            if (ast.type == 'macro') {
                this.config.setSyntax(ast);
                return [];
            }
            const clause = (0, toClause_1.toClause)(ast);
            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.enviro);
                return [];
            }
            else {
                const maps = this.enviro.query(clause);
                const ids = maps.flatMap(m => Object.values(m));
                const objects = ids.map(id => this.enviro.get(id));
                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
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
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
function getBrain(config = (0, Config_1.getConfig)()) {
    return new BasicBrain_1.default(config);
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
    const cast = ast;
    if (cast.links.pronoun || cast.links.noun || cast.links.adj) {
        return nounPhraseToClause(ast, args);
    }
    else if (cast.links.relpron) {
        return copulaSubClauseToClause(ast, args);
    }
    else if (cast.links.preposition) {
        return complementToClause(ast, args);
    }
    else if (cast.links.subject && cast.links.predicate) {
        return copulaSentenceToClause(ast, args);
    }
    console.log({ ast });
    throw new Error(`Idk what to do with ${ast.type}!`);
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c;
    const subjectAst = copulaSentence.links.subject;
    const predicateAst = copulaSentence.links.predicate;
    const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: subjectAst.links.uniquant !== undefined });
    const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
    const subject = toClause(subjectAst, newArgs);
    const predicate = toClause(predicateAst, newArgs).copy({ negate: !!copulaSentence.links.negation });
    const entities = subject.entities.concat(predicate.entities);
    const result = entities // assume any sentence with any var is an implication
        .some(e => (0, Id_1.isVar)(e)) ?
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true });
    const m0 = result.entities // assume ids are case insensitive, assume if IDX is var all idx are var
        .filter(x => (0, Id_1.isVar)(x))
        .map(e => ({ [(0, Id_1.toConst)(e)]: e }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    const a = (0, Anaphora_1.getAnaphora)(); // get anaphora
    a.assert(subject);
    const m1 = (_c = (a.query(predicate))[0]) !== null && _c !== void 0 ? _c : {};
    const result2 = result.copy({ map: m0 }).copy({ sideEffecty: true, map: m1 });
    const m2 = result2.entities // assume anything owned by a variable is also a variable
        .filter(e => (0, Id_1.isVar)(e))
        .flatMap(e => result2.ownedBy(e))
        .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    return result2.copy({ map: m2 });
}
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    const predicate = copulaSubClause.links.predicate;
    return (toClause(predicate, Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } })))
        .copy({ sideEffecty: false });
}
function complementToClause(complement, args) {
    var _a, _b;
    const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
    const newId = (0, Id_1.getRandomId)();
    const preposition = complement.links.preposition;
    const nounPhrase = complement.links.nounphrase;
    return (0, Clause_1.clauseOf)(preposition.lexeme, subjId, newId)
        .and(toClause(nounPhrase, Object.assign(Object.assign({}, args), { roles: { subject: newId } })))
        .copy({ sideEffecty: false });
}
function nounPhraseToClause(nounPhrase, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const maybeId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
    const subjectId = nounPhrase.links.uniquant ? (0, Id_1.toVar)(maybeId) : maybeId;
    const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
    const adjectives = (_e = (_d = (_c = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _c === void 0 ? void 0 : _c.adj) === null || _d === void 0 ? void 0 : _d.links) !== null && _e !== void 0 ? _e : [];
    const noun = ((_f = nounPhrase.links.noun) !== null && _f !== void 0 ? _f : nounPhrase.links.pronoun);
    const complements = (_j = (_h = (_g = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _g === void 0 ? void 0 : _g.complement) === null || _h === void 0 ? void 0 : _h.links) !== null && _j !== void 0 ? _j : [];
    const subClause = nounPhrase.links.subclause;
    const res = adjectives.map(a => a.lexeme)
        .concat((noun === null || noun === void 0 ? void 0 : noun.lexeme) ? [noun.lexeme] : [])
        .map(p => (0, Clause_1.clauseOf)(p, subjectId))
        .reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)())
        .and(complements.map(c => c ? toClause(c, newArgs) : (0, Clause_1.emptyClause)()).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
        .and(subClause ? toClause(subClause, newArgs) : (0, Clause_1.emptyClause)())
        .copy({ sideEffecty: false });
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
const BasicAction_1 = __importDefault(__webpack_require__(/*! ../actuator/actions/BasicAction */ "./app/src/actuator/actions/BasicAction.ts"));
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
        return [new BasicAction_1.default(this, topLevel)];
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
    constructor(condition, conclusion, negated = false, exactIds = false, isSideEffecty = false, isImply = true, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = condition.theme) {
        this.condition = condition;
        this.conclusion = conclusion;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.theme = theme;
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return [this];
    }
    get entities() {
        return this.condition.entities.concat(this.conclusion.entities);
    }
    get rheme() {
        return this; // dunno what I'm doin'
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
    about(id) {
        return (0, Clause_1.emptyClause)(); ///TODO!!!!!!!!
    }
    toString() {
        const yes = `${this.condition.toString()} ---> ${this.conclusion.toString()}`;
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.condition.ownedBy(id).concat(this.conclusion.ownedBy(id));
    }
    ownersOf(id) {
        return this.condition.ownersOf(id).concat(this.conclusion.ownersOf(id));
    }
    describe(id) {
        return this.conclusion.describe(id).concat(this.condition.describe(id));
    }
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    toAction(topLevel) {
        return [new ImplyAction_1.default(this.condition, this.conclusion)];
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
        return this._syntaxList
            .slice()
            .sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap, this.staticAscendingPrecedence));
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
exports.lexemeTypes = (0, utils_1.stringLiterals)('adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'grammar', 'nonsubconj', // and ...
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
        type: 'adj',
        derivedFrom: 'click'
    },
    {
        root: 'pressed',
        type: 'adj',
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
        root: "red",
        type: "adj",
        concepts: ['color']
    },
    {
        root: "green",
        type: "adj",
        concepts: ['color']
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
        root: 'black',
        type: 'adj',
        concepts: ['color']
    },
    {
        root: 'blue',
        type: 'adj',
        concepts: ['color']
    },
    {
        root: 'subject',
        type: 'adj'
    },
    {
        root: 'predicate',
        type: 'adj'
    },
    {
        root: 'optional',
        type: 'adj',
        cardinality: '1|0'
    },
    {
        root: 'one-or-more',
        type: 'adj',
        cardinality: '+'
    },
    {
        root: 'zero-or-more',
        type: 'adj',
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
        root: 'color',
        type: 'noun',
        isConcept: true
    },
    {
        root: 'concept',
        type: 'noun',
        isConcept: true
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
    'quantifier is uniquant or existquant',
    'article is indefart or defart',
    'complement is preposition then nounphrase',
    'copulasentence is subject nounphrase then copula then optional negation then predicate nounphrase',
    'nounphrase is optional quantifier then optional article then zero-or-more adjs then optional noun or pronoun then optional subclause then zero-or-more complements ',
    'copulasubclause is relpron then copula then nounphrase',
    'subclause is copulasubclause',
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
'copulasentence', 'nounphrase', 'complement', 'subclause');
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
        { type: ['adj'], number: '*' },
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
    'nounphrase': [],
    'complement': [],
    'copulasentence': [],
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
        (0, Actuator_1.getActuator)().takeAction(clause.copy({ exactIds: true }), this.enviro);
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
        this.tokens = sourceCode
            // .toLowerCase()
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
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
}
exports["default"] = EagerLexer;


/***/ }),

/***/ "./app/src/lexer/Lexeme.ts":
/*!*********************************!*\
  !*** ./app/src/lexer/Lexeme.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProto = exports.getLexemes = exports.formsOf = void 0;
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
        this.topParse = (name, role) => {
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
            var _a, _b, _c;
            const links = {};
            for (const m of this.config.getSyntax(name)) {
                const ast = this.parseMember(m);
                if (!ast && (0, Cardinality_1.isNecessary)(m.number)) {
                    return undefined;
                }
                if (ast) {
                    const astType = ast.type != 'array' ? ast.type : (_b = (_a = Object.values(ast.links).at(0)) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : 'array';
                    links[(_c = m.role) !== null && _c !== void 0 ? _c : astType] = ast;
                }
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
                // const x = this.try(this.parseOneMember, m.type, m.number, m.role) // --------
                const memento = this.lexer.pos;
                const x = this.parseOneMember(m.type, m.role);
                if (!x) {
                    this.lexer.backTo(memento);
                }
                // ----------
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
        this.parseOneMember = (types, role) => {
            for (const t of types) {
                const x = this.topParse(t, role);
                if (x) {
                    return x;
                }
            }
        };
        this.try = (method, ...args) => {
            const memento = this.lexer.pos;
            const x = method(args);
            if (!x) {
                this.lexer.backTo(memento);
            }
            return x;
        };
        this.isLeaf = (t) => {
            return this.config.lexemeTypes.includes(t);
        };
    }
    parseAll() {
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.parse();
            if (!ast) {
                return results;
            }
            results.push(ast);
            if (this.lexer.peek && this.lexer.peek.type == 'fullstop') {
                this.lexer.next();
            }
        }
        return results;
    }
    parse() {
        for (const t of this.config.syntaxList) {
            const x = this.try(this.topParse, t);
            if (x) {
                return x;
            }
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
    const adjectives = (_d = (_c = (_b = (_a = macroPart.links) === null || _a === void 0 ? void 0 : _a.adj) === null || _b === void 0 ? void 0 : _b.links) === null || _c === void 0 ? void 0 : _c.map((a) => a.lexeme)) !== null && _d !== void 0 ? _d : [];
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
    const assert1 = brain.enviro.values.length === 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFDYixJQUFJLEVBQUUsT0FBTztLQUNoQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsT0FBTztRQUNiLFNBQVMsRUFBRSxJQUFJO1FBQ2YsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztLQUN4QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsWUFBWTtLQUNyQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsVUFBVTtLQUNuQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsYUFBYTtLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsTUFBTSxDQUFDLGNBQWM7S0FDOUI7SUFFRDtRQUNJLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFNBQVM7S0FDbEI7SUFFRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFF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QUFDO0lBQ3pHLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTztJQUNwRSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLE9BQU87SUFDcEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxNQUFNO0lBQ25FLE9BQU8sT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPO0FBQ3hDLENBQUM7QUFHRCxTQUFTLEtBQUssQ0FBQyxTQUFpQjtJQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO0lBQ3pDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLFFBQVE7SUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPO0FBQzVDLENBQUM7Ozs7Ozs7VUN2SEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9CYXNpY0FjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdGlvbnMvQ3JlYXRlQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9FZGl0QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0aW9ucy9JbXBseUFjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vdG9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0Jhc2ljQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3RhcnR1cENvbW1hbmRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3V0aWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0FuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQ29uY3JldGVXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9QbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL21hY3JvVG9TeW50YXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCBDcmVhdGVBY3Rpb24gZnJvbSBcIi4vQ3JlYXRlQWN0aW9uXCI7XG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQmFzaWNDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihlbnZpcm86IEVudmlybyk6IGFueSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MubGVuZ3RoID4gMSkgeyAvLyBub3QgaGFuZGxpbmcgcmVsYXRpb25zIHlldFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRWRpdEFjdGlvbih0aGlzLmNsYXVzZS5hcmdzWzBdLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIFtdKS5ydW4oZW52aXJvKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkge1xuICAgICAgICAgICAgdGhpcy5mb3JUb3BMZXZlbChlbnZpcm8pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZvck5vblRvcExldmVsKGVudmlybylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3BMZXZlbFxuICAgICAgICAgICAgLmdldE93bmVyc2hpcENoYWluKHRvcExldmVsRW50aXR5KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSkgLy8gQVNTVU1FIGF0IGxlYXN0IG9uZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBmb3JUb3BMZXZlbChlbnZpcm86IEVudmlybykgeyAvLyB0aGlzIGlkIGlzIFRMIGVudGl0eVxuXG4gICAgICAgIGNvbnN0IHEgPSB0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG1hcHMgPSBlbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgaWQgPSBtYXBzPy5bMF0/Llt0aGlzLmNsYXVzZS5hcmdzWzBdXSA/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgaWYgKCFlbnZpcm8uZ2V0KGlkKSkge1xuICAgICAgICAgICAgZW52aXJvLnNldFBsYWNlaG9sZGVyKGlkKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5pc0NvbmNlcHQpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCduZXcgaW5zdGFuY2Ugb2YgY29uY2VwdDonLCB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pWzBdLnJvb3QudG9VcHBlckNhc2UoKSwgJ2lzIGEnLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdC50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gaWYgKHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290ID09PSAnY29uY2VwdCcpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCduZXcgY29uY2VwdDonLCB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pWzBdLnJvb3QudG9VcHBlckNhc2UoKSlcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5wcmVkaWNhdGUucHJvdG8pIHtcbiAgICAgICAgICAgIG5ldyBDcmVhdGVBY3Rpb24oaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkucnVuKGVudmlybylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBFZGl0QWN0aW9uKGlkLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUsIHRoaXMuZ2V0UHJvcHModGhpcy5jbGF1c2UuYXJnc1swXSkpLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZm9yTm9uVG9wTGV2ZWwoZW52aXJvOiBFbnZpcm8pIHtcblxuICAgICAgICBjb25zdCB0TE93bmVyID0gdGhpcy5nZXRUb3BMZXZlbE93bmVyT2YodGhpcy5jbGF1c2UuYXJnc1swXSwgdGhpcy50b3BMZXZlbClcblxuICAgICAgICBpZiAoIXRMT3duZXIpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmFtZU9mVGhpcyA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUodGhpcy5jbGF1c2UuYXJnc1swXSlcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QgPT0gbmFtZU9mVGhpc1swXS5yb290KSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHEgPSB0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRMT3duZXIpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBlbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgdExPd25lcklkID0gbWFwcz8uWzBdPy5bdExPd25lcl0gLy8/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBFZGl0QWN0aW9uKHRMT3duZXJJZCwgdGhpcy5jbGF1c2UucHJlZGljYXRlLCB0aGlzLmdldFByb3BzKHRMT3duZXIpKS5ydW4oZW52aXJvKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRUb3BMZXZlbE93bmVyT2YoaWQ6IElkLCB0b3BMZXZlbDogQ2xhdXNlKTogSWQgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IG93bmVycyA9IHRvcExldmVsLm93bmVyc09mKGlkKVxuXG4gICAgICAgIGNvbnN0IG1heWJlID0gb3duZXJzXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gdG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyhvKSkuYXQoMClcblxuICAgICAgICBpZiAoIW1heWJlICYmIG93bmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRUb3BMZXZlbE93bmVyT2Yob3duZXJzWzBdLCB0b3BMZXZlbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtYXliZVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi8uLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgTGV4ZW1lLCBnZXRQcm90byB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lKSB7XG5cbiAgICB9XG5cbiAgICBydW4oZW52aXJvOiBFbnZpcm8pOiBhbnkge1xuXG4gICAgICAgIGlmIChlbnZpcm8uZXhpc3RzKHRoaXMuaWQpKSB7IC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0aGlzLnByZWRpY2F0ZSlcblxuICAgICAgICBpZiAocHJvdG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuXG4gICAgICAgICAgICBjb25zdCB0YWdOYW1lRnJvbVByb3RvID0gKHg6IE9iamVjdCkgPT4geC5jb25zdHJ1Y3Rvci5uYW1lLnJlcGxhY2UoJ0hUTUwnLCAnJykucmVwbGFjZSgnRWxlbWVudCcsICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lRnJvbVByb3RvKHByb3RvKSlcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIGVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG8gPSBuZXcgKHByb3RvIGFzIGFueSkuY29uc3RydWN0b3IoKVxuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChvKVxuICAgICAgICAgICAgbmV3T2JqLnNldCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGVudmlyby5zZXQodGhpcy5pZCwgbmV3T2JqKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsIHJlYWRvbmx5IHByb3BzPzogTGV4ZW1lW10pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHJ1bihlbnZpcm86IEVudmlybyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGVudmlyby5nZXQodGhpcy5pZCkgPz8gZW52aXJvLnNldFBsYWNlaG9sZGVyKHRoaXMuaWQpXG4gICAgICAgIG9iai5zZXQodGhpcy5wcmVkaWNhdGUsIHRoaXMucHJvcHMpXG4gICAgfVxuXG5cbn0iLCJcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uLy4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRQcm90byB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgRWRpdEFjdGlvbiBmcm9tIFwiLi9FZGl0QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLCByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihlbnZpcm86IEVudmlybyk6IGFueSB7XG5cbiAgICAgICAgY29uc3QgaXNTZXRBbGlhc0NhbGwgPSAgLy8gYXNzdW1lIGlmIGF0IGxlYXN0IG9uZSBvd25lZCBlbnRpdHkgdGhhdCBpdCdzIGEgc2V0IGFsaWFzIGNhbGxcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuICAgICAgICAgICAgfHwgdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uY2x1c2lvbi50b3BMZXZlbCgpWzBdKS5zbGljZSgxKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXNTZXRBbGlhc0NhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXNDYWxsKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3RoZXIoZW52aXJvKVxuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIHNldEFsaWFzQ2FsbCgpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG4gICAgICAgIHdyYXAocHJvdG8pLnNldEFsaWFzKGNvbmNlcHROYW1lWzBdLCBwcm9wc05hbWVzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgd3JhcCgke3Byb3RvfSkuc2V0QWxpYXMoJHtjb25jZXB0TmFtZVswXX0sIFske3Byb3BzTmFtZXN9XSlgKVxuICAgIH1cblxuICAgIG90aGVyKGVudmlybzogRW52aXJvKSB7XG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF1cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUodG9wKVswXVxuICAgICAgICBjb25zdCB5ID0gZW52aXJvLnF1ZXJ5KGNsYXVzZU9mKHByb3RvTmFtZSwgJ1gnKSlcbiAgICAgICAgY29uc3QgaWRzID0geS5tYXAobSA9PiBtWydYJ10pXG4gICAgICAgIGlkcy5mb3JFYWNoKGlkID0+IG5ldyBFZGl0QWN0aW9uKGlkLCBwcmVkaWNhdGUpLnJ1bihlbnZpcm8pKVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi8uLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IHZvaWQge1xuICAgICAgICBjbGF1c2UudG9BY3Rpb24oY2xhdXNlKS5mb3JFYWNoKGEgPT4gYS5ydW4oZW52aXJvKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuL3RvQ2xhdXNlXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsXG4gICAgICAgIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksXG4gICAgICAgIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLnN0YXJ0dXBDb21tYW5kcy5mb3JFYWNoKGMgPT4gdGhpcy5leGVjdXRlKGMpKVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogYW55W10ge1xuXG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb25maWcpLnBhcnNlQWxsKCkubWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgIGlmIChhc3QudHlwZSA9PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2V0U3ludGF4KGFzdCBhcyBhbnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IHRvQ2xhdXNlKGFzdClcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmVudmlybylcbiAgICAgICAgICAgICAgICByZXR1cm4gW11cblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHMgPSB0aGlzLmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RzID0gaWRzLm1hcChpZCA9PiB0aGlzLmVudmlyby5nZXQoaWQpKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm8udmFsdWVzLmZvckVhY2gobyA9PiBvLnBvaW50T3V0KHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICBvYmplY3RzLmZvckVhY2gobyA9PiBvPy5wb2ludE91dCgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RzLm1hcChvID0+IG8/Lm9iamVjdClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KS5mbGF0KClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IGFueVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbihjb25maWcgPSBnZXRDb25maWcoKSk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oY29uZmlnKVxufVxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCwgaXNWYXIsIHRvQ29uc3QsIHRvVmFyIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uL2Vudmlyby9BbmFwaG9yYVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgTGVhZk5vZGUsIENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5cblxuaW50ZXJmYWNlIFJvbGVzIHtcbiAgICBzdWJqZWN0PzogSWRcbiAgICBvYmplY3Q/OiBJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgcm9sZXM/OiBSb2xlcyxcbiAgICBhbmFwaG9yYT86IENsYXVzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DbGF1c2UoYXN0OiBBc3ROb2RlPEFzdFR5cGU+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IGNhc3QgPSBhc3QgYXMgQ29tcG9zaXRlTm9kZTxDb21wb3NpdGVUeXBlPlxuXG4gICAgaWYgKGNhc3QubGlua3MucHJvbm91biB8fCBjYXN0LmxpbmtzLm5vdW4gfHwgY2FzdC5saW5rcy5hZGopIHtcbiAgICAgICAgcmV0dXJuIG5vdW5QaHJhc2VUb0NsYXVzZShhc3QgYXMgYW55LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoY2FzdC5saW5rcy5yZWxwcm9uKSB7XG4gICAgICAgIHJldHVybiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShhc3QgYXMgYW55LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoY2FzdC5saW5rcy5wcmVwb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gY29tcGxlbWVudFRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChjYXN0LmxpbmtzLnN1YmplY3QgJiYgY2FzdC5saW5rcy5wcmVkaWNhdGUpIHtcbiAgICAgICAgcmV0dXJuIGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyh7IGFzdCB9KVxuICAgIHRocm93IG5ldyBFcnJvcihgSWRrIHdoYXQgdG8gZG8gd2l0aCAke2FzdC50eXBlfSFgKVxuXG59XG5cbmZ1bmN0aW9uIGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoY29wdWxhU2VudGVuY2U6IGFueSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0QXN0ID0gY29wdWxhU2VudGVuY2UubGlua3Muc3ViamVjdCBhcyBDb21wb3NpdGVOb2RlPENvbXBvc2l0ZVR5cGU+XG4gICAgY29uc3QgcHJlZGljYXRlQXN0ID0gY29wdWxhU2VudGVuY2UubGlua3MucHJlZGljYXRlIGFzIENvbXBvc2l0ZU5vZGU8Q29tcG9zaXRlVHlwZT5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiBzdWJqZWN0QXN0LmxpbmtzLnVuaXF1YW50ICE9PSB1bmRlZmluZWQgfSlcbiAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG4gICAgY29uc3Qgc3ViamVjdCA9IHRvQ2xhdXNlKHN1YmplY3RBc3QsIG5ld0FyZ3MpXG4gICAgY29uc3QgcHJlZGljYXRlID0gdG9DbGF1c2UocHJlZGljYXRlQXN0LCBuZXdBcmdzKS5jb3B5KHsgbmVnYXRlOiAhIWNvcHVsYVNlbnRlbmNlLmxpbmtzLm5lZ2F0aW9uIH0pXG4gICAgY29uc3QgZW50aXRpZXMgPSBzdWJqZWN0LmVudGl0aWVzLmNvbmNhdChwcmVkaWNhdGUuZW50aXRpZXMpXG5cbiAgICBjb25zdCByZXN1bHQgPSBlbnRpdGllcy8vIGFzc3VtZSBhbnkgc2VudGVuY2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGxpY2F0aW9uXG4gICAgICAgIC5zb21lKGUgPT4gaXNWYXIoZSkpID9cbiAgICAgICAgc3ViamVjdC5pbXBsaWVzKHByZWRpY2F0ZSkgOlxuICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgY29uc3QgbTAgPSByZXN1bHQuZW50aXRpZXMgLy8gYXNzdW1lIGlkcyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgYXNzdW1lIGlmIElEWCBpcyB2YXIgYWxsIGlkeCBhcmUgdmFyXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc1Zhcih4KSlcbiAgICAgICAgLm1hcChlID0+ICh7IFt0b0NvbnN0KGUpXTogZSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCBhID0gZ2V0QW5hcGhvcmEoKSAvLyBnZXQgYW5hcGhvcmFcbiAgICBhLmFzc2VydChzdWJqZWN0KVxuICAgIGNvbnN0IG0xID0gKGEucXVlcnkocHJlZGljYXRlKSlbMF0gPz8ge31cbiAgICBjb25zdCByZXN1bHQyID0gcmVzdWx0LmNvcHkoeyBtYXA6IG0wIH0pLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSwgbWFwOiBtMSB9KVxuXG4gICAgY29uc3QgbTIgPSByZXN1bHQyLmVudGl0aWVzIC8vIGFzc3VtZSBhbnl0aGluZyBvd25lZCBieSBhIHZhcmlhYmxlIGlzIGFsc28gYSB2YXJpYWJsZVxuICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgIC5mbGF0TWFwKGUgPT4gcmVzdWx0Mi5vd25lZEJ5KGUpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW2VdOiB0b1ZhcihlKSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICByZXR1cm4gcmVzdWx0Mi5jb3B5KHsgbWFwOiBtMiB9KVxuXG59XG5cbmZ1bmN0aW9uIGNvcHVsYVN1YkNsYXVzZVRvQ2xhdXNlKGNvcHVsYVN1YkNsYXVzZTogYW55LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHByZWRpY2F0ZSA9IGNvcHVsYVN1YkNsYXVzZS5saW5rcy5wcmVkaWNhdGUgYXMgQ29tcG9zaXRlTm9kZTxDb21wb3NpdGVUeXBlPlxuXG4gICAgcmV0dXJuICh0b0NsYXVzZShwcmVkaWNhdGUsIHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogYXJncz8ucm9sZXM/LnN1YmplY3QgfSB9KSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IGFueSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGNvbXBsZW1lbnQubGlua3MucHJlcG9zaXRpb24gYXMgTGVhZk5vZGU8J3ByZXBvc2l0aW9uJz5cbiAgICBjb25zdCBub3VuUGhyYXNlID0gY29tcGxlbWVudC5saW5rcy5ub3VucGhyYXNlIGFzIENvbXBvc2l0ZU5vZGU8Q29tcG9zaXRlVHlwZT5cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbi5sZXhlbWUsIHN1YmpJZCwgbmV3SWQpXG4gICAgICAgIC5hbmQodG9DbGF1c2Uobm91blBocmFzZSwgeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBuZXdJZCB9IH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShub3VuUGhyYXNlOiBDb21wb3NpdGVOb2RlPENvbXBvc2l0ZVR5cGU+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZS5saW5rcy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH07XG5cbiAgICBjb25zdCBhZGplY3RpdmVzOiBMZWFmTm9kZTxMZXhlbWVUeXBlPltdID0gKG5vdW5QaHJhc2U/LmxpbmtzPy5hZGogYXMgYW55KT8ubGlua3MgPz8gW11cbiAgICBjb25zdCBub3VuID0gKG5vdW5QaHJhc2UubGlua3Mubm91biA/PyBub3VuUGhyYXNlLmxpbmtzLnByb25vdW4pIGFzIExlYWZOb2RlPExleGVtZVR5cGU+IHwgdW5kZWZpbmVkXG4gICAgY29uc3QgY29tcGxlbWVudHM6IExlYWZOb2RlPExleGVtZVR5cGU+W10gPSAobm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQgYXMgYW55KT8ubGlua3MgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlLmxpbmtzLnN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5tYXAoYSA9PiBhLmxleGVtZSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuYW5kKGNvbXBsZW1lbnRzLm1hcChjID0+IGMgPyB0b0NsYXVzZShjLCBuZXdBcmdzKSA6IGVtcHR5Q2xhdXNlKCkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gdG9DbGF1c2Uoc3ViQ2xhdXNlLCBuZXdBcmdzKSA6IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufVxuIiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvYWN0aW9ucy9BY3Rpb25cIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWU6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBBbmQge1xuXG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6XG4gICAgICAgICAgICBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcylcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHsgLy9UT0RPOiBpZiB0aGlzIGlzIG5lZ2F0ZWQhXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiBlbXB0eUNsYXVzZSgpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkuY29uY2F0KHRoaXMuY2xhdXNlMi50b0FjdGlvbih0b3BMZXZlbCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IEJhc2ljQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0Jhc2ljQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IExleGVtZSxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlKCkpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgPyB0aGlzIDogZW1wdHlDbGF1c2UoKVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgQmFzaWNBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdGlvbnMvQWN0aW9uXCJcbmltcG9ydCB7IEVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgZXhhY3RJZHM6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW11cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW11cbiAgICB0b3BMZXZlbCgpOiBJZFtdXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogTGV4ZW1lLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6IENsYXVzZSA9PiBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgZXhhY3RJZHM/OiBib29sZWFuXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG90aGVyXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gY29uY2x1c2lvblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogTGV4ZW1lW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBBY3Rpb25bXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IEltcGx5QWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9hY3Rpb25zL0ltcGx5QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gdHJ1ZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSB0aGVtZSA9IGNvbmRpdGlvbi50aGVtZSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY29uY2x1c2lvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25jbHVzaW9uLmVudGl0aWVzKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcyAvLyBkdW5ubyB3aGF0IEknbSBkb2luJ1xuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uY2x1c2lvbi50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBMZXhlbWVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNvbmRpdGlvbi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW10ge1xuICAgICAgICByZXR1cm4gW25ldyBJbXBseUFjdGlvbih0aGlzLmNvbmRpdGlvbiwgdGhpcy5jb25jbHVzaW9uKV1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4vQ29uZmlnXCJcbmltcG9ydCB7IG1hY3JvVG9TeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL21hY3JvVG9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29uZmlnIGltcGxlbWVudHMgQ29uZmlnIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICBwcm90ZWN0ZWQgX3N5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSxcbiAgICAgICAgcHJvdGVjdGVkIF9sZXhlbWVzOiBMZXhlbWVbXSxcbiAgICAgICAgcmVhZG9ubHkgc3ludGF4TWFwOiBTeW50YXhNYXAsXG4gICAgICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10sXG4gICAgICAgIHJlYWRvbmx5IHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2U6IENvbXBvc2l0ZVR5cGVbXSkge1xuICAgIH1cblxuICAgIGdldCBzeW50YXhMaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3ludGF4TGlzdFxuICAgICAgICAgICAgLnNsaWNlKClcbiAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwLCB0aGlzLnN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2UpKVxuICAgIH1cblxuICAgIGdldCBsZXhlbWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGV4ZW1lc1xuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChtYWNybzogQ29tcG9zaXRlTm9kZTxcIm1hY3JvXCI+KSA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gbWFjcm9Ub1N5bnRheChtYWNybylcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IHN5bnRheC5uYW1lIH0pXG4gICAgICAgIHRoaXMuX3N5bnRheExpc3QucHVzaChzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlKSAvL1RPRE86IGNoZWNrIGR1cGxpY2F0ZXM/XG4gICAgICAgIHRoaXMuc3ludGF4TWFwW3N5bnRheC5uYW1lIGFzIENvbXBvc2l0ZVR5cGVdID0gc3ludGF4LnN5bnRheFxuXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICAgICAgdGhpcy5fbGV4ZW1lcyA9IHRoaXMuX2xleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgdGhpcy5fbGV4ZW1lcy5wdXNoKGxleGVtZSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEJhc2ljQ29uZmlnIH0gZnJvbSBcIi4vQmFzaWNDb25maWdcIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSwgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHN0YXJ0dXBDb21tYW5kcyB9IGZyb20gXCIuL3N0YXJ0dXBDb21tYW5kc1wiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlLCBjb25zdGl0dWVudFR5cGVzLCBzdGF0aWNBc2NlbmRpbmdQcmVjZWRlbmNlLCBzeW50YXhlcyB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZVtdXG4gICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQ29tcG9zaXRlTm9kZTwnbWFjcm8nPik6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKTogQ29uZmlnIHtcblxuICAgIHJldHVybiBuZXcgQmFzaWNDb25maWcoXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBjb25zdGl0dWVudFR5cGVzLFxuICAgICAgICBsZXhlbWVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzLFxuICAgICAgICBzdGF0aWNBc2NlbmRpbmdQcmVjZWRlbmNlKVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSwgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICd0aGVuJyxcbiAgJ3JlbHByb24nLFxuICAnbmVnYXRpb24nLFxuICAnbm91bicsXG4gICdwcmVwb3NpdGlvbicsXG4gICdzdWJjb25qJyxcbiAgJ2dyYW1tYXInLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZCAuLi5cbiAgJ2Rpc2p1bmMnLCAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuICAncHJvbm91bidcbilcbi8vICdxdWFudGFkaicsXG4vLyAnc2VtYW50aWNzJyAvLz9cbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZVR5cGVzIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgY29uc3RpdHVlbnRUeXBlcyB9IGZyb20gXCIuL3N5bnRheGVzXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2hhdmUnLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydoYXZlJywgJ2hhcyddLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBwcm90bzogJ0hUTUxCdXR0b25FbGVtZW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdsaXN0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICBwcm90bzogJ0FycmF5J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGljaycsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2NsaWNrJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2xpY2tlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBkZXJpdmVkRnJvbTogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVzc2VkJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGFsaWFzRm9yOiAnY2xpY2tlZCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2F0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlJyxcbiAgICAgICAgdHlwZTogJ2NvcHVsYScsXG4gICAgICAgIGZvcm1zOiBbJ2lzJywgJ2FyZSddLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIixcbiAgICAgICAgY29uY2VwdHM6IFsnY29sb3InXVxuXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJncmVlblwiLFxuICAgICAgICB0eXBlOiBcImFkalwiLFxuICAgICAgICBjb25jZXB0czogWydjb2xvciddXG5cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWUsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdibGFjaycsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBjb25jZXB0czogWydjb2xvciddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JsdWUnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY29uY2VwdHM6IFsnY29sb3InXVxuXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVkaWNhdGUnLFxuICAgICAgICB0eXBlOiAnYWRqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lLW9yLW1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpdCcsXG4gICAgICAgIHR5cGU6ICdwcm9ub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb2xvcicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgaXNDb25jZXB0OiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NvbmNlcHQnLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIGlzQ29uY2VwdDogdHJ1ZVxuICAgIH0sXG5dXG5cbi8qKlxuICogR3JhbW1hclxuICovXG5jb25zdGl0dWVudFR5cGVzLmNvbmNhdChsZXhlbWVUeXBlcyBhcyBhbnkpLmZvckVhY2goZyA9PiB7XG4gICAgbGV4ZW1lcy5wdXNoKHtcbiAgICAgICAgcm9vdDogZyxcbiAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgfSlcbn0pIiwiZXhwb3J0IGNvbnN0IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10gPSBbXG4gICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgJ2FydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0JyxcbiAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW5waHJhc2UnLFxuICAgICdjb3B1bGFzZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW5waHJhc2UgdGhlbiBjb3B1bGEgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiB0aGVuIHByZWRpY2F0ZSBub3VucGhyYXNlJyxcbiAgICAnbm91bnBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSB0aGVuIHplcm8tb3ItbW9yZSBhZGpzIHRoZW4gb3B0aW9uYWwgbm91biBvciBwcm9ub3VuIHRoZW4gb3B0aW9uYWwgc3ViY2xhdXNlIHRoZW4gemVyby1vci1tb3JlIGNvbXBsZW1lbnRzICcsXG4gICAgJ2NvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gbm91bnBocmFzZScsXG4gICAgJ3N1YmNsYXVzZSBpcyBjb3B1bGFzdWJjbGF1c2UnLFxuICAgICdjb2xvciBvZiBhbnkgYnV0dG9uIGlzIGJhY2tncm91bmQgb2Ygc3R5bGUgb2YgYnV0dG9uJyxcbiAgICAndGV4dCBvZiBhbnkgYnV0dG9uIGlzIHRleHRDb250ZW50IG9mIGJ1dHRvbicsXG5dIiwiaW1wb3J0IHsgUm9sZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBFbGVtZW50VHlwZSwgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz47XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAndGFnZ2VkdW5pb24nLFxuICAgICdhcnJheScsIC8vIGNvbnNlY3V0aXZlIGFzdHNcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAnbWFjcm8nLFxuXG4gICAgLy8gZXh0ZW5kaWJsZVxuICAgICdjb3B1bGFzZW50ZW5jZScsXG4gICAgJ25vdW5waHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnc3ViY2xhdXNlJyxcblxuKVxuXG5leHBvcnQgY29uc3Qgc3RhdGljQXNjZW5kaW5nUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gW1xuICAgICd0YWdnZWR1bmlvbicsXG4gICAgJ2FycmF5JyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAnbWFjcm8nXVxuXG5leHBvcnQgY29uc3Qgc3ludGF4ZXM6IFN5bnRheE1hcCA9IHtcblxuICAgIC8vIHBlcm1hbmVudFxuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nLCAnZ3JhbW1hciddLCBudW1iZXI6IDEsIHJvbGU6ICdub3VuJyBhcyBSb2xlIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfVxuICAgIF0sXG4gICAgJ21hY3JvcGFydCc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2FkaiddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RoZW4nXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZTogWydncmFtbWFyJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnZGlzanVuYyddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICdhcnJheSc6IFtcblxuICAgIF0sXG5cbiAgICAvLyBleHRlbmRpYmxlXG4gICAgJ3N1YmNsYXVzZSc6IFtcblxuICAgIF0sXG4gICAgJ25vdW5waHJhc2UnOiBbXG5cbiAgICBdLFxuICAgICdjb21wbGVtZW50JzogW1xuXG4gICAgXSxcblxuICAgICdjb3B1bGFzZW50ZW5jZSc6IFtcblxuICAgIF0sXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuZXhwb3J0IHR5cGUgRWxlbWVudFR5cGU8VCBleHRlbmRzIFJlYWRvbmx5QXJyYXk8dW5rbm93bj4+ID0gVCBleHRlbmRzIFJlYWRvbmx5QXJyYXk8aW5mZXIgRWxlbWVudFR5cGU+ID8gRWxlbWVudFR5cGUgOiBuZXZlcjtcbiIsImltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCJcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5hcGhvcmEge1xuICAgIGFzc2VydChjbGF1c2U6IENsYXVzZSk6IHZvaWRcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbmFwaG9yYSgpIHtcbiAgICByZXR1cm4gbmV3IEVudmlyb0FuYXBob3JhKClcbn1cblxuY2xhc3MgRW52aXJvQW5hcGhvcmEgaW1wbGVtZW50cyBBbmFwaG9yYSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKHsgcm9vdDogdW5kZWZpbmVkIH0pKSB7XG5cbiAgICB9XG5cbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICAgICAgZ2V0QWN0dWF0b3IoKS50YWtlQWN0aW9uKGNsYXVzZS5jb3B5KHsgZXhhY3RJZHM6IHRydWUgfSksIHRoaXMuZW52aXJvKVxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm8ucXVlcnkoY2xhdXNlKVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5pbXBvcnQgeyBQbGFjZWhvbGRlciB9IGZyb20gXCIuL1BsYWNlaG9sZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgcHJvdGVjdGVkIGxhc3RSZWZlcmVuY2VkPzogSWRcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiBXcmFwcGVyIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG5ldyBQbGFjZWhvbGRlcigpXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cblxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgcGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBQbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5wcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnNldChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IGlkXG5cbiAgICB9XG5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdIHsgLy9UT0RPIHRoaXMgaXMgYSB0bXAgc29sdXRpb24sIGZvciBhbmFwaG9yYSByZXNvbHV0aW9uLCBidXQganVzdCB3aXRoIGRlc2NyaXB0aW9ucywgd2l0aG91dCB0YWtpbmcgKG11bHRpLWVudGl0eSkgcmVsYXRpb25zaGlwcyBpbnRvIGFjY291bnRcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IGU6IHhbMF0sIHc6IHhbMV0gfSkpXG5cbiAgICAgICAgY29uc3QgcXVlcnkgPSBjbGF1c2UgLy8gZGVzY3JpYmVkIGVudGl0aWVzXG4gICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgIC5tYXAoZSA9PiAoeyBlLCBkZXNjOiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSkgfSkpXG5cbiAgICAgICAgY29uc3QgZ2V0SXQgPSAoKSA9PiB0aGlzLmxhc3RSZWZlcmVuY2VkID8gW3sgZTogdGhpcy5sYXN0UmVmZXJlbmNlZCBhcyBzdHJpbmcsIHc6IHRoaXMuZGljdGlvbmFyeVt0aGlzLmxhc3RSZWZlcmVuY2VkXSB9XSA6IFtdXG5cbiAgICAgICAgY29uc3QgcmVzID0gcXVlcnlcbiAgICAgICAgICAgIC5mbGF0TWFwKHEgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSB1bml2ZXJzZVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHUgPT4gcS5kZXNjLmV2ZXJ5KGQgPT4gdS53LmlzKGQpKSlcbiAgICAgICAgICAgICAgICAgICAgLy8gLmNvbmNhdChxLmRlc2MuaW5jbHVkZXMoJ2l0JykgPyBnZXRJdCgpIDogW10pIC8vVE9ETzogaGFyZGNvZGVkIGJhZFxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHEuZGVzYy5maW5kKHggPT4geC50eXBlID09ICdwcm9ub3VuJykgPyBnZXRJdCgpIDogW10pXG5cblxuICAgICAgICAgICAgICAgIC8vVE9ETzogYWZ0ZXIgXCJldmVyeSAuLi5cIiBzZW50ZW5jZSwgXCJpdFwiIHNob3VsZCBiZSB1bmRlZmluZWRcblxuICAgICAgICAgICAgICAgIHJldHVybiB7IGZyb206IHEuZSwgdG86IHRvIH1cblxuICAgICAgICAgICAgfSlcblxuICAgICAgICBjb25zdCByZXNTaXplID0gTWF0aC5tYXgoLi4ucmVzLm1hcChxID0+IHEudG8ubGVuZ3RoKSk7XG4gICAgICAgIGNvbnN0IGZyb21Ub1RvID0gKGZyb206IElkKSA9PiByZXMuZmlsdGVyKHggPT4geC5mcm9tID09PSBmcm9tKVswXS50by5tYXAoeCA9PiB4LmUpO1xuICAgICAgICBjb25zdCByYW5nZSA9IChuOiBudW1iZXIpID0+IFsuLi5uZXcgQXJyYXkobikua2V5cygpXVxuXG4gICAgICAgIGNvbnN0IHJlczIgPSByYW5nZShyZXNTaXplKS5tYXAoaSA9PlxuICAgICAgICAgICAgY2xhdXNlXG4gICAgICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmcm9tID0+IGZyb21Ub1RvKGZyb20pLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgLm1hcChmcm9tID0+ICh7IFtmcm9tXTogZnJvbVRvVG8oZnJvbSlbaV0gPz8gZnJvbVRvVG8oZnJvbSlbMF0gfSkpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSkpXG5cbiAgICAgICAgdGhpcy5sYXN0UmVmZXJlbmNlZCA9IHJlczIuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpLmF0KC0xKSA/PyB0aGlzLmxhc3RSZWZlcmVuY2VkXG5cbiAgICAgICAgcmV0dXJuIHJlczIgLy8gcmV0dXJuIGxpc3Qgb2YgbWFwcywgd2hlcmUgZWFjaCBtYXAgc2hvdWxkIHNob3VsZCBoYXZlIEFMTCBpZHMgZnJvbSBjbGF1c2UgaW4gaXRzIGtleXMsIGVnOiBbe2lkMjppZDEsIGlkNDppZDN9LCB7aWQyOjEsIGlkNDozfV0uXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG9iamVjdDogYW55LFxuICAgICAgICByZWFkb25seSBzaW1wbGVDb25jZXB0czogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHN0cmluZ1tdIH0gPSBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPz8ge30pIHtcblxuICAgICAgICBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPSBzaW1wbGVDb25jZXB0c1xuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IExleGVtZSwgcHJvcHM/OiBMZXhlbWVbXSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPiAxKSB7IC8vIGFzc3VtZSA+IDEgcHJvcHMgYXJlIGEgcGF0aFxuXG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcy5tYXAoeCA9PiB4LnRva2VuID8/IHgucm9vdCksIHByZWRpY2F0ZS5yb290KVxuXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID09PSAxKSB7IC8vIHNpbmdsZSBwcm9wXG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNpbXBsZUNvbmNlcHRzKS5pbmNsdWRlcyhwcm9wc1swXS5yb290KSkgeyAvLyBpcyBjb25jZXB0IFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF0ucm9vdF0sIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gLi4uIG5vdCBjb25jZXB0LCBqdXN0IHByb3BcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcy5tYXAoeCA9PiB4LnRva2VuID8/IHgucm9vdCksIHByZWRpY2F0ZS5yb290KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoIXByb3BzIHx8IHByb3BzLmxlbmd0aCA9PT0gMCkgeyAvLyBubyBwcm9wc1xuXG4gICAgICAgICAgICBpZiAocHJlZGljYXRlLmNvbmNlcHRzICYmIHByZWRpY2F0ZS5jb25jZXB0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcmVkaWNhdGUuY29uY2VwdHNbMF1dLCBwcmVkaWNhdGUucm9vdClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlLnJvb3RdID0gdHJ1ZSAvLyBmYWxsYmFja1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgY29uY2VwdCA9IHByZWRpY2F0ZS5jb25jZXB0cz8uYXQoMClcblxuICAgICAgICByZXR1cm4gY29uY2VwdCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRdKSA9PT0gcHJlZGljYXRlLnJvb3QgOlxuICAgICAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlLnJvb3RdICE9PSB1bmRlZmluZWRcblxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBMZXhlbWUsIHByb3BQYXRoOiBMZXhlbWVbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHROYW1lLnJvb3RdID0gcHJvcFBhdGgubWFwKHggPT4geC5yb290KVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3BhdGhbMF1dID0gdmFsdWVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHhbcGF0aC5hdCgtMSkgYXMgc3RyaW5nXSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChwYXRoOiBzdHJpbmdbXSkge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV0gLy8gYXNzdW1lIGF0IGxlYXN0IG9uZVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHhcblxuICAgIH1cblxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBXcmFwcGVyIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZFxuICAgIHNldFBsYWNlaG9sZGVyKGlkOiBJZCk6IFdyYXBwZXJcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXVxuICAgIHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudFxuICAgIC8vIGdldCBrZXlzKCk6IElkW11cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKG9wdHM/OiBHZXRFbnZpcm9PcHMpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybyhvcHRzPy5yb290KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldEVudmlyb09wcyB7XG4gICAgcm9vdD86IEhUTUxFbGVtZW50XG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCJcblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGVzOiBMZXhlbWVbXSA9IFtdLCByZWFkb25seSBvYmplY3Q6IGFueSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBMZXhlbWUsIHByb3BzPzogTGV4ZW1lW10pIHtcbiAgICAgICAgdGhpcy5wcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKVxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZXMuc29tZSh4ID0+IHgucm9vdCA9PSBwcmVkaWNhdGUucm9vdClcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pIHsgfVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSkgeyB9XG5cbn1cbiIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgQ29uY3JldGVXcmFwcGVyIGZyb20gXCIuL0NvbmNyZXRlV3JhcHBlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHJlYWRvbmx5IG9iamVjdDogYW55XG4gICAgc2V0KHByZWRpY2F0ZTogTGV4ZW1lLCBwcm9wcz86IExleGVtZVtdKTogdm9pZFxuICAgIGlzKHByZWRpY2F0ZTogTGV4ZW1lKTogYm9vbGVhbiAvLyBUT0RPIGFyZ3NcbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogTGV4ZW1lLCBwcm9wUGF0aDogTGV4ZW1lW10pOiB2b2lkXG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZFxuICAgIC8vIGdldChwcmVkaWNhdGU6IHN0cmluZyk6IGFueVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKG86IGFueSk6IFdyYXBwZXIge1xuICAgIHJldHVybiBuZXcgQ29uY3JldGVXcmFwcGVyKG8pXG59IiwiaW1wb3J0IG1haW4gZnJvbSBcIi4vbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcblxuXG4oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGF1dG90ZXN0ZXIoKVxuICAgIG1haW4oKVxufSkoKVxuXG4vLyBcbiIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcywgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSBzb3VyY2VDb2RlXG4gICAgICAgICAgICAvLyAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgLmZsYXRNYXAocyA9PiBnZXRMZXhlbWVzKHMsIGNvbmZpZy5sZXhlbWVzKSlcblxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IExleGVtZVR5cGVcbiAgICAvKip1c2VmdWwgZm9yIGlycmVndWxhciBzdHVmZiovIHJlYWRvbmx5IGZvcm1zPzogc3RyaW5nW11cbiAgICAvKipyZWZlcnMgdG8gdmVyYiBjb25qdWdhdGlvbnMgb3IgcGx1cmFsIGZvcm1zLCBhc3N1bWUgcmVndWxhcml0eSovIHJlYWRvbmx5IGlycmVndWxhcj86IGJvb2xlYW5cbiAgICAvKipzZW1hbnRpY2FsIGRlcGVuZGVjZSovIHJlYWRvbmx5IGRlcml2ZWRGcm9tPzogc3RyaW5nXG4gICAgLyoqc2VtYW50aWNhbCBlcXVpdmFsZW5jZSovIHJlYWRvbmx5IGFsaWFzRm9yPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyByZWFkb25seSBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi9yZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIC8qKmZvciBxdWFudGFkaiAqLyByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVhZG9ubHkgY29uY2VwdHM/OiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IHByb3RvPzogc3RyaW5nXG5cbiAgICByZWFkb25seSBpc0NvbmNlcHQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1zT2YobGV4ZW1lOiBMZXhlbWUpIHtcblxuICAgIHJldHVybiBbbGV4ZW1lLnJvb3RdLmNvbmNhdChsZXhlbWU/LmZvcm1zID8/IFtdKVxuICAgICAgICAuY29uY2F0KCFsZXhlbWUuaXJyZWd1bGFyID8gW2Ake2xleGVtZS5yb290fXNgXSA6IFtdKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lW10pOiBMZXhlbWVbXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZSA9XG4gICAgICAgIGxleGVtZXMuZmlsdGVyKHggPT4gZm9ybXNPZih4KS5pbmNsdWRlcyh3b3JkKSkuYXQoMClcbiAgICAgICAgPz8geyByb290OiB3b3JkLCB0eXBlOiAnbm91bicgfVxuXG4gICAgY29uc3QgbGV4ZW1lMjogTGV4ZW1lID0geyAuLi5sZXhlbWUsIHRva2VuOiB3b3JkIH1cblxuICAgIHJldHVybiBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lMi5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBsZXhlbWVzKSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdG8obGV4ZW1lOiBMZXhlbWUpOiBPYmplY3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAod2luZG93IGFzIGFueSk/LltsZXhlbWUucHJvdG8gYXMgYW55XT8ucHJvdG90eXBlXG59IiwiaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOiBDb25maWcpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGdldEJyYWluKCksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5oaWRkZW4gPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICBzdGF0ZS5wcm9tcHRWaXNpYmxlID8gdGV4dGFyZWEuZm9jdXMoKSA6IDBcbiAgICB9XG5cbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBzdGF0ZS5icmFpblxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSlcblxufSIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUsIExlYWZOb2RlLCBDb21wb3NpdGVOb2RlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29uZmlnKSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZTxBc3RUeXBlPltdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZSgpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlayAmJiB0aGlzLmxleGVyLnBlZWsudHlwZSA9PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2UoKSB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHRoaXMuY29uZmlnLnN5bnRheExpc3QpIHtcblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5KHRoaXMudG9wUGFyc2UsIHQpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRvcFBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29uZmlnLmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzTGVhZih0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGVhZihtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG06IE1lbWJlcik6IExlYWZOb2RlPExleGVtZVR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQ29tcG9zaXRlTm9kZTxDb21wb3NpdGVUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29uZmlnLmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFzdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzdFR5cGUgPSBhc3QudHlwZSAhPSAnYXJyYXknID8gYXN0LnR5cGUgOiBPYmplY3QudmFsdWVzKChhc3QgYXMgQ29tcG9zaXRlTm9kZTwnYXJyYXknPikubGlua3MpLmF0KDApPy50eXBlID8/ICdhcnJheSc7XG4gICAgICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdFR5cGVdID0gYXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBhbnlbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc3QgeCA9IHRoaXMudHJ5KHRoaXMucGFyc2VPbmVNZW1iZXIsIG0udHlwZSwgbS5udW1iZXIsIG0ucm9sZSkgLy8gLS0tLS0tLS1cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucGFyc2VPbmVNZW1iZXIobS50eXBlLCBtLnJvbGUpXG4gICAgICAgICAgICBpZiAoIXgpIHsgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bykgfVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBsaW5rczogKGxpc3QgYXMgYW55KSAvL1RPRE8hISEhXG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlT25lTWVtYmVyID0gKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSA9PiB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRvcFBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeSA9IChtZXRob2Q6IChhcmdzOiBhbnkpID0+IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQsIC4uLmFyZ3M6IGFueVtdKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgIGNvbnN0IHggPSBtZXRob2QoYXJncylcblxuICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGV4ZW1lVHlwZXMuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcbmltcG9ydCB7IEFzdFR5cGUgfSBmcm9tIFwiLi9TeW50YXhcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZTxBc3RUeXBlPltdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb25maWc6IENvbmZpZyk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn1cblxuXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENvbXBvc2l0ZU5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgU3ludGF4LCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBDb21wb3NpdGVOb2RlPCdtYWNybyc+KTogeyBuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4IH0ge1xuICAgIGNvbnN0IG1hY3JvcGFydHMgPSAobWFjcm8ubGlua3MubWFjcm9wYXJ0IGFzIGFueSkubGlua3MgYXMgQ29tcG9zaXRlTm9kZTwnbWFjcm9wYXJ0Jz5bXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IChtYWNyby5saW5rcy5ub3VuIGFzIGFueSkubGV4ZW1lLnJvb3RcbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IENvbXBvc2l0ZU5vZGU8J21hY3JvcGFydCc+KTogTWVtYmVyIHtcblxuICAgIGNvbnN0IGFkamVjdGl2ZXM6IExleGVtZVtdID0gKG1hY3JvUGFydC5saW5rcz8uYWRqIGFzIGFueSk/LmxpbmtzPy5tYXAoKGE6IGFueSkgPT4gYS5sZXhlbWUpID8/IFtdXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gKG1hY3JvUGFydC5saW5rcy50YWdnZWR1bmlvbiBhcyBhbnkpLmxpbmtzIGFzIENvbXBvc2l0ZU5vZGU8J3RhZ2dlZHVuaW9uJz5bXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHgubGlua3MuZ3JhbW1hcilcblxuICAgIGNvbnN0IHF1YW50YWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gYS5jYXJkaW5hbGl0eSlcbiAgICBjb25zdCBxdWFsYWRqcyA9IGFkamVjdGl2ZXMuZmlsdGVyKGEgPT4gIWEuY2FyZGluYWxpdHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5tYXAoZyA9PiAoZyBhcyBhbnkpLmxleGVtZS5yb290KSxcbiAgICAgICAgcm9sZTogcXVhbGFkanMuYXQoMCk/LnJvb3QgYXMgUm9sZSxcbiAgICAgICAgbnVtYmVyOiBxdWFudGFkanMuYXQoMCk/LmNhcmRpbmFsaXR5XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2U6IEFzdFR5cGVbXSkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBzdGF0aWNDb21wYXJlKGEsIGIsIHN0YXRpY0FzY2VuZGluZ1ByZWNlZGVuY2UpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gc3RhdGljQ29tcGFyZShhOiBBc3RUeXBlLCBiOiBBc3RUeXBlLCBzdGF0aWNCeUFzY1ByZWNlZGVuY2U6IEFzdFR5cGVbXSkge1xuXG4gICAgY29uc3QgcGEgPSBzdGF0aWNCeUFzY1ByZWNlZGVuY2UuaW5kZXhPZihhKVxuICAgIGNvbnN0IHBiID0gc3RhdGljQnlBc2NQcmVjZWRlbmNlLmluZGV4T2YoYilcblxuICAgIGlmIChwYSA9PT0gLTEgfHwgcGIgPT09IC0xKSB7IC8vIGVpdGhlciBvbmUgaXMgY3VzdG9tXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGEgLSBwYlxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKTogQXN0VHlwZVtdIHtcbiAgICByZXR1cm4gKHN5bnRheGVzW2FdID8/IFtdKS5mbGF0TWFwKG0gPT4gbS50eXBlKVxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuICAgIHRlc3QxMFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXN0KCkgPyAnc3VjY2VzcycgOiAnZmFpbCcsIHRlc3QubmFtZSlcbiAgICAgICAgYXdhaXQgc2xlZXAoMTAwKVxuICAgICAgICBjbGVhckRvbSgpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5lbnZpcm8udmFsdWVzLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IChicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IChicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpXG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkXG59XG5cblxuZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGJyYWluLmV4ZWN1dGUoJ3knKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gKGJyYWluLmV4ZWN1dGUoJ3onKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCdidXR0b24nKSlbMF0udGV4dENvbnRlbnQgPT0gJ2NhcHJhJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmZ1bmN0aW9uIHRlc3Q5KCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSByZWQgYnV0dG9uLiB4IGlzIGdyZWVuLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbi5leGVjdXRlKCdyZWQnKSkubGVuZ3RoID09PSAwXG4gICAgY29uc3QgYXNzZXJ0MiA9IChicmFpbi5leGVjdXRlKCdncmVlbicpKS5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmZ1bmN0aW9uIHRlc3QxMCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geiBpcyBhIGJsdWUgYnV0dG9uLiB0aGUgcmVkIGJ1dHRvbi4gaXQgaXMgYmxhY2suJylcbiAgICBjb25zdCBhc3NlcnQxID0gYnJhaW4uZXhlY3V0ZSgneCcpLmF0KDApLnN0eWxlLmJhY2tncm91bmQgPT0gJ2JsYWNrJ1xuICAgIGNvbnN0IGFzc2VydDIgPSBicmFpbi5leGVjdXRlKCd5JykuYXQoMCkuc3R5bGUuYmFja2dyb3VuZCA9PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IGJyYWluLmV4ZWN1dGUoJ3onKS5hdCgwKS5zdHlsZS5iYWNrZ3JvdW5kID09ICdibHVlJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5cbmZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=