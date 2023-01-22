/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/actuator/Actuator.ts":
/*!**************************************!*\
  !*** ./app/src/actuator/Actuator.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActuator = void 0;
const BaseActuator_1 = __importDefault(__webpack_require__(/*! ./BaseActuator */ "./app/src/actuator/BaseActuator.ts"));
function getActuator() {
    return new BaseActuator_1.default();
}
exports.getActuator = getActuator;


/***/ }),

/***/ "./app/src/actuator/BaseActuator.ts":
/*!******************************************!*\
  !*** ./app/src/actuator/BaseActuator.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BaseActuator {
    takeAction(clause, enviro) {
        clause.toAction(clause).forEach(a => a.run(enviro));
    }
}
exports["default"] = BaseActuator;


/***/ }),

/***/ "./app/src/actuator/BasicAction.ts":
/*!*****************************************!*\
  !*** ./app/src/actuator/BasicAction.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Create_1 = __importDefault(__webpack_require__(/*! ./Create */ "./app/src/actuator/Create.ts"));
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
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
            return new Edit_1.default(this.clause.args[0], this.clause.predicate.root, []).run(enviro);
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
            .map(e => this.topLevel.theme.describe(e)[0]);
    }
    forTopLevel(enviro) {
        var _a, _b;
        const q = this.topLevel.theme.about(this.clause.args[0]);
        const maps = enviro.query(q);
        const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
        if (!enviro.get(id)) {
            enviro.setPlaceholder(id);
        }
        if (isCreatorAction(this.clause.predicate.root)) {
            new Create_1.default(id, this.clause.predicate.root).run(enviro);
        }
        else {
            new Edit_1.default(id, this.clause.predicate.root, this.getProps(this.clause.args[0])).run(enviro);
        }
    }
    forNonTopLevel(enviro) {
        var _a;
        // assuming max x.y.z nesting
        const owners = this.topLevel.ownersOf(this.clause.args[0]);
        const hasTopLevel = owners.filter(x => this.topLevel.topLevel().includes(x))[0];
        const topLevelOwner = hasTopLevel ? hasTopLevel : this.topLevel.ownersOf(owners[0])[0];
        if (topLevelOwner === undefined) {
            return;
        }
        const nameOfThis = this.topLevel.theme.describe(this.clause.args[0]);
        if (this.clause.predicate.root === nameOfThis[0]) {
            return;
        }
        const q = this.topLevel.theme.about(topLevelOwner);
        const maps = enviro.query(q);
        const id = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[topLevelOwner]; //?? getRandomId()
        return new Edit_1.default(id, this.clause.predicate.root, this.getProps(topLevelOwner)).run(enviro);
    }
}
exports["default"] = BasicAction;
function isCreatorAction(predicate) {
    return predicate === 'button';
}


/***/ }),

/***/ "./app/src/actuator/Create.ts":
/*!************************************!*\
  !*** ./app/src/actuator/Create.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
class Create {
    constructor(id, predicate) {
        this.id = id;
        this.predicate = predicate;
    }
    run(enviro) {
        var _a;
        if (enviro.exists(this.id)) { //  existence check prior to creating
            return;
        }
        if (isDomElem(this.predicate)) {
            const o = document.createElement(this.predicate);
            o.id = this.id + '';
            o.textContent = 'default';
            const newObj = (0, Wrapper_1.wrap)(o);
            newObj.set(this.predicate);
            enviro.set(this.id, newObj);
            (_a = enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
        }
    }
}
exports["default"] = Create;
function isDomElem(predicate) {
    return ['button'].includes(predicate);
}


/***/ }),

/***/ "./app/src/actuator/Edit.ts":
/*!**********************************!*\
  !*** ./app/src/actuator/Edit.ts ***!
  \**********************************/
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
class Edit {
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
exports["default"] = Edit;


/***/ }),

/***/ "./app/src/actuator/ImplyAction.ts":
/*!*****************************************!*\
  !*** ./app/src/actuator/ImplyAction.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
class ImplyAction {
    constructor(condition, conclusion) {
        this.condition = condition;
        this.conclusion = conclusion;
    }
    run(enviro) {
        // console.log('ImplyAction.run()', this.condition.toString(), '--->', this.conclusion.toString())
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
        const proto = getProto(protoName);
        (0, Wrapper_1.wrap)(proto).setAlias(conceptName[0], propsNames);
        // console.log(`wrap(${proto}).setAlias(${conceptName[0]}, [${propsNames}])`)
    }
    other(enviro) {
        const top = this.condition.topLevel()[0];
        const protoName = this.condition.describe(top)[0]; // assume one 
        const predicate = this.conclusion.describe(top)[0];
        const y = enviro.query((0, Clause_1.clauseOf)({ type: 'noun', root: protoName }, 'X'));
        const ids = y.map(m => m['X']);
        ids.forEach(id => new Edit_1.default(id, predicate).run(enviro));
    }
}
exports["default"] = ImplyAction;
const getProto = (name) => ({
    'button': HTMLButtonElement.prototype
}[name]);


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
const Parser_1 = __webpack_require__(/*! ../parser/Parser */ "./app/src/parser/Parser.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
const toClause_1 = __webpack_require__(/*! ../parser/toClause */ "./app/src/parser/toClause.ts");
class BasicBrain {
    constructor(config, enviro = (0, Enviro_1.default)({ root: document.body }), actuator = (0, Actuator_1.getActuator)()) {
        this.config = config;
        this.enviro = enviro;
        this.actuator = actuator;
    }
    init() {
        for (const s of this.config.startupCommands) {
            this.execute(s);
        }
    }
    execute(natlang) {
        const results = [];
        for (const ast of (0, Parser_1.getParser)(natlang, this.config).parseAll()) {
            if (!ast) {
                continue;
            }
            if (ast.type == 'macro') {
                this.config.setSyntax(ast);
                continue;
            }
            const clause = (0, toClause_1.toClause)(ast);
            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.enviro);
            }
            else {
                const maps = this.enviro.query(clause);
                const ids = maps.flatMap(m => Object.values(m));
                const objects = ids.map(id => this.enviro.get(id));
                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
                objects.forEach(o => o === null || o === void 0 ? void 0 : o.pointOut());
                objects.map(o => o === null || o === void 0 ? void 0 : o.object).forEach(o => results.push(o));
            }
        }
        return results;
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
    const b = new BasicBrain_1.default(config);
    b.init();
    return b;
}
exports.getBrain = getBrain;


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
const BasicAction_1 = __importDefault(__webpack_require__(/*! ../actuator/BasicAction */ "./app/src/actuator/BasicAction.ts"));
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
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate.root] : [];
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
const ImplyAction_1 = __importDefault(__webpack_require__(/*! ../actuator/ImplyAction */ "./app/src/actuator/ImplyAction.ts"));
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicConfig = void 0;
class BasicConfig {
    constructor(lexemes, lexemeTypes, _constituentTypes, syntaxes, startupCommands) {
        this.lexemes = lexemes;
        this.lexemeTypes = lexemeTypes;
        this._constituentTypes = _constituentTypes;
        this.syntaxes = syntaxes;
        this.startupCommands = startupCommands;
        this.setSyntax = (macro) => {
            const noun = macro.links.noun;
            const macroparts = macro.links.macropart.links;
            const members = macroparts.map(m => macroPartToMember(m));
            const name = noun.lexeme.root;
            this.lexemes.push({ type: 'grammar', root: name }); //TODO: may need to remove old if reassigning! 
            this._constituentTypes.push(name); //TODO: check duplicates?
            this.syntaxes[name] = members;
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxes[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
        this.lenCompare = (a, b) => {
            return this.dependencies(a).length - this.dependencies(b).length;
        };
        this.idCompare = (a, b) => {
            return a == b ? 0 : undefined;
        };
        this.dependencyCompare = (a, b) => {
            const aDependsOnB = this.dependencies(a).includes(b);
            const bDependsOnA = this.dependencies(b).includes(a);
            if (aDependsOnB === bDependsOnA) {
                return undefined;
            }
            return aDependsOnB ? 1 : -1;
        };
        this.maxPrecedence = (a, b) => {
            var _a, _b, _c;
            const sp = (_c = (_b = (_a = this.idCompare(a, b)) !== null && _a !== void 0 ? _a : this.staticCompare(a, b)) !== null && _b !== void 0 ? _b : this.dependencyCompare(a, b)) !== null && _c !== void 0 ? _c : this.lenCompare(a, b);
            return sp;
        };
    }
    get constituentTypes() {
        return this._constituentTypes.slice().sort((a, b) => this.maxPrecedence(b, a));
    }
    dependencies(a) {
        var _a;
        return ((_a = this.syntaxes[a]) !== null && _a !== void 0 ? _a : []).flatMap(m => m.type);
    }
    staticCompare(a, b) {
        const ascendingPrecedence = this._constituentTypes.slice(0, 4);
        const pa = ascendingPrecedence.indexOf(a);
        const pb = ascendingPrecedence.indexOf(b);
        if (pa === -1 || pb === -1) { // either one is custom
            return undefined;
        }
        return pa - pb;
    }
}
exports.BasicConfig = BasicConfig;
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
    return new BasicConfig_1.BasicConfig(lexemes_1.lexemes, LexemeType_1.lexemeTypes, syntaxes_1.constituentTypes, syntaxes_1.syntaxes, startupCommands_1.startupCommands);
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
exports.lexemeTypes = (0, utils_1.stringLiterals)('adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'grammar', 
// 'quantadj',
'disjunc' // or, but, however ...
);


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
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
        type: "adj"
    },
    {
        root: "green",
        type: "adj"
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
        type: 'adj'
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
    // grammar
    {
        root: 'negation',
        type: 'grammar'
    },
    {
        root: 'iverb',
        type: 'grammar'
    },
    {
        root: 'noun',
        type: 'grammar'
    },
    {
        root: 'adj',
        type: 'grammar'
    },
    {
        root: 'copula',
        type: 'grammar'
    },
    {
        root: 'preposition',
        type: 'grammar'
    },
    {
        root: 'uniquant',
        type: 'grammar'
    },
    {
        root: 'existquant',
        type: 'grammar'
    },
    {
        root: 'defart',
        type: 'grammar'
    },
    {
        root: 'indefart',
        type: 'grammar'
    },
    {
        root: 'relpron',
        type: 'grammar'
    },
    {
        root: 'subclause',
        type: 'grammar'
    },
    {
        root: 'nounphrase',
        type: 'grammar'
    },
];


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
    'nounphrase is optional quantifier then optional article then zero-or-more adjs then optional noun then optional subclause then zero-or-more complements ',
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
exports.syntaxes = exports.constituentTypes = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.constituentTypes = (0, utils_1.stringLiterals)(
// permanent
'taggedunion', 'array', // an array of consecutive asts (tied to '*')
'macropart', 'macro', 
// to be removed
'copulasentence', 'nounphrase', 'complement', 'copulasubclause', 'subclause');
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
    // to be removed
    'subclause': [],
    'nounphrase': [],
    'complement': [],
    'copulasubclause': [],
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
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
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
                .concat(q.desc.includes('it') ? getIt() : []); //TODO: hardcoded bad
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/enviro/getConcepts.ts");
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
            this.setNested(props, predicate);
        }
        else if (props && props.length === 1) { // single prop
            if (Object.keys(this.simpleConcepts).includes(props[0])) { // is concept 
                this.setNested(this.simpleConcepts[props[0]], predicate);
            }
            else { // ... not concept, just prop
                this.setNested(props, predicate);
            }
        }
        else if (!props || props.length === 0) { // no props
            const concepts = (0, getConcepts_1.getConcepts)(predicate);
            if (concepts.length === 0) {
                this.object[predicate] = true;
            }
            else {
                this.setNested(this.simpleConcepts[concepts[0]], predicate);
            }
        }
    }
    is(predicate, ...args) {
        const concept = (0, getConcepts_1.getConcepts)(predicate).at(0);
        return concept ?
            this.getNested(this.simpleConcepts[concept]) === predicate :
            this.object[predicate] !== undefined;
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName] = propPath;
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
    is(predicate, ...args) {
        return this.predicates.includes(predicate);
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

/***/ "./app/src/enviro/getConcepts.ts":
/*!***************************************!*\
  !*** ./app/src/enviro/getConcepts.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConceptName = exports.getGetterName = exports.getIsName = exports.getSetterName = exports.getConcepts = exports.getterPrefix = exports.isPrefix = exports.setterPrefix = void 0;
exports.setterPrefix = 'set';
exports.isPrefix = 'is';
exports.getterPrefix = 'get';
function getConcepts(object) {
    // TODO: try getting a concept from a string object with a 
    // special dictionary, like {red:color, green:color, blue:color}
    const stringConcepts = {
        'green': 'color',
        'red': 'color',
        'blue': 'color',
        'black': 'color',
        'big': 'size'
    };
    const maybeConcept = stringConcepts[object.toString()];
    if (maybeConcept) {
        return [maybeConcept];
    }
    return Object
        .getOwnPropertyNames(object)
        .concat(Object.getOwnPropertyNames(object.__proto__))
        .filter(x => x.includes(exports.setterPrefix) || x.includes(exports.isPrefix))
        .map(x => getConceptName(x));
}
exports.getConcepts = getConcepts;
function getSetterName(concept) {
    return `${exports.setterPrefix}_${concept}`;
}
exports.getSetterName = getSetterName;
function getIsName(concept) {
    return `${exports.isPrefix}_${concept}`;
}
exports.getIsName = getIsName;
function getGetterName(concept) {
    return `${exports.getterPrefix}_${concept}`;
}
exports.getGetterName = getGetterName;
function getConceptName(method) {
    return method
        .replace(exports.isPrefix, '')
        .replace(exports.setterPrefix, '')
        .replace(exports.getterPrefix, '')
        .replace('_', '');
}
exports.getConceptName = getConceptName;


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
const autotester_1 = __importDefault(__webpack_require__(/*! ./tests/autotester */ "./app/src/tests/autotester.ts"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, autotester_1.default)();
}))();
// main()
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
    /**
     * Return current token iff of given type and move to next;
     * else return undefined and don't move.
     * @param args
     * @returns
     */
    assert(type, args) {
        var _a, _b;
        const current = this.peek;
        if (current && current.type === type) {
            this.next();
            return current;
        }
        else if ((_a = args.errorOut) !== null && _a !== void 0 ? _a : true) {
            this.croak((_b = args.errorMsg) !== null && _b !== void 0 ? _b : '');
        }
        else {
            return undefined;
        }
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
exports.getLexemes = exports.formsOf = void 0;
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

/***/ "./app/src/parser/KoolParser.ts":
/*!**************************************!*\
  !*** ./app/src/parser/KoolParser.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const ast_types_1 = __webpack_require__(/*! ./ast-types */ "./app/src/parser/ast-types.ts");
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/lexer/Lexer.ts");
class KoolParser {
    constructor(sourceCode, config, lexer = (0, Lexer_1.getLexer)(sourceCode, config)) {
        this.sourceCode = sourceCode;
        this.config = config;
        this.lexer = lexer;
        this.topParse = (name, role) => {
            const members = this.config.getSyntax(name);
            if (members.length === 1 && members[0].type.every(t => this.isAtom(t))) {
                return this.parseAtom(members[0]);
            }
            else {
                return this.parseComposite(name, role);
            }
        };
        this.parseAtom = (m) => {
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
                if (!ast && (0, ast_types_1.isNecessary)(m.number)) {
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
                if (!(0, ast_types_1.isRepeatable)(m.number) && list.length >= 1) {
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
            if (list.length === 0 && (0, ast_types_1.isNecessary)(m.number)) {
                return undefined;
            }
            return (0, ast_types_1.isRepeatable)(m.number) ? ({
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
        this.isAtom = (t) => {
            return this.config.lexemeTypes.includes(t);
        };
    }
    parseAll() {
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.parse();
            results.push(ast);
            this.lexer.assert('fullstop', { errorOut: false });
        }
        return results;
    }
    parse() {
        for (const t of this.config.constituentTypes) {
            const x = this.try(this.topParse, t);
            if (x) {
                return x;
            }
        }
    }
}
exports.KoolParser = KoolParser;


/***/ }),

/***/ "./app/src/parser/Parser.ts":
/*!**********************************!*\
  !*** ./app/src/parser/Parser.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
// import { LexemeType } from "../../ast/interfaces/LexemeType";
const KoolParser_1 = __webpack_require__(/*! ./KoolParser */ "./app/src/parser/KoolParser.ts");
function getParser(sourceCode, config) {
    return new KoolParser_1.KoolParser(sourceCode, config);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/parser/ast-types.ts":
/*!*************************************!*\
  !*** ./app/src/parser/ast-types.ts ***!
  \*************************************/
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

/***/ "./app/src/parser/toClause.ts":
/*!************************************!*\
  !*** ./app/src/parser/toClause.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toClause = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Anaphora_1 = __webpack_require__(/*! ../enviro/Anaphora */ "./app/src/enviro/Anaphora.ts");
function toClause(ast, args) {
    const cast = ast;
    if (cast.links.noun || cast.links.adj) {
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const maybeId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
    const subjectId = nounPhrase.links.uniquant ? (0, Id_1.toVar)(maybeId) : maybeId;
    const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
    const adjectives = (_e = (_d = (_c = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _c === void 0 ? void 0 : _c.adj) === null || _d === void 0 ? void 0 : _d.links) !== null && _e !== void 0 ? _e : [];
    const noun = nounPhrase.links.noun;
    const complements = (_h = (_g = (_f = nounPhrase === null || nounPhrase === void 0 ? void 0 : nounPhrase.links) === null || _f === void 0 ? void 0 : _f.complement) === null || _g === void 0 ? void 0 : _g.links) !== null && _h !== void 0 ? _h : [];
    const subClause = nounPhrase.links.copulasubclause;
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
];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log((yield test()) ? 'success' : 'fail', test.name);
            yield sleep(200);
            clearDom();
        }
    });
}
exports["default"] = autotester;
function test1() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is red. x is a button. y is a green button.');
        const assert1 = (yield brain.execute('a green button'))[0].style.background === 'green';
        const assert2 = (yield brain.execute('a red button'))[0].style.background === 'red';
        return assert1 && assert2;
    });
}
function test2() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
        const assert1 = brain.enviro.values.length === 1;
        return assert1;
    });
}
function test3() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
        const assert1 = (yield brain.execute('a red button'))[0].style.background === 'red';
        const assert2 = (yield brain.execute('a green button'))[0].style.background === 'green';
        const assert3 = (yield brain.execute('a black button'))[0].style.background === 'black';
        return assert1 && assert2 && assert3;
    });
}
function test4() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('a button is a button.');
        const button = yield brain.execute('button');
        return button !== undefined;
    });
}
function test5() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is a button. the color of x is red.');
        const assert1 = (yield brain.execute('x'))[0].style.background === 'red';
        return assert1;
    });
}
function test6() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is a button. the background of style of x is green.');
        const assert1 = (yield brain.execute('x'))[0].style.background === 'green';
        return assert1;
    });
}
function test7() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is a button. y is a button. z is a button. every button is red.');
        const assert1 = (yield brain.execute('x'))[0].style.background === 'red';
        const assert2 = (yield brain.execute('y'))[0].style.background === 'red';
        const assert3 = (yield brain.execute('z'))[0].style.background === 'red';
        return assert1 && assert2 && assert3;
    });
}
function test8() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is a button. text of x is capra.');
        const assert1 = (yield brain.execute('button'))[0].textContent === 'capra';
        return assert1;
    });
}
function test9() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is a red button. x is green.');
        const assert1 = (yield brain.execute('red')).length === 0;
        const assert2 = (yield brain.execute('green')).length === 1;
        return assert1 && assert2;
    });
}
function sleep(millisecs) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((ok, err) => {
            setTimeout(() => ok(true), millisecs);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMzRCxPQUFPLE9BQU8sSUFBSSxPQUFPO0lBQzdCLENBQUM7Q0FBQTtBQUdELFNBQWUsS0FBSyxDQUFDLFNBQWlCOztRQUNsQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FBQTtBQUVELFNBQVMsUUFBUTtJQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUU7SUFDNUIsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE9BQU87QUFDNUMsQ0FBQzs7Ozs7OztVQzdHRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9BY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL0Jhc2ljQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvQ3JlYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvRWRpdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL0ltcGx5QWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9CYXNpY0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N0YXJ0dXBDb21tYW5kcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy91dGlscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9BbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0NvbmNyZXRlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vUGxhY2Vob2xkZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL2FzdC10eXBlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci90b0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IHZvaWQge1xuICAgICAgICBjbGF1c2UudG9BY3Rpb24oY2xhdXNlKS5mb3JFYWNoKGEgPT4gYS5ydW4oZW52aXJvKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcbmltcG9ydCBDcmVhdGUgZnJvbSBcIi4vQ3JlYXRlXCI7XG5pbXBvcnQgRWRpdCBmcm9tIFwiLi9FZGl0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTogQmFzaWNDbGF1c2UsIHJlYWRvbmx5IHRvcExldmVsOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIHJ1bihlbnZpcm86IEVudmlybyk6IGFueSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmFyZ3MubGVuZ3RoID4gMSkgeyAvLyBub3QgaGFuZGxpbmcgcmVsYXRpb25zIHlldFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuZXhhY3RJZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRWRpdCh0aGlzLmNsYXVzZS5hcmdzWzBdLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCwgW10pLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50b3BMZXZlbC50b3BMZXZlbCgpLmluY2x1ZGVzKHRoaXMuY2xhdXNlLmFyZ3NbMF0pKSB7XG4gICAgICAgICAgICB0aGlzLmZvclRvcExldmVsKGVudmlybylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZm9yTm9uVG9wTGV2ZWwoZW52aXJvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0UHJvcHModG9wTGV2ZWxFbnRpdHk6IElkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvcExldmVsXG4gICAgICAgICAgICAuZ2V0T3duZXJzaGlwQ2hhaW4odG9wTGV2ZWxFbnRpdHkpXG4gICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKGUpWzBdKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBmb3JUb3BMZXZlbChlbnZpcm86IEVudmlybykge1xuXG4gICAgICAgIGNvbnN0IHEgPSB0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG1hcHMgPSBlbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgaWQgPSBtYXBzPy5bMF0/Llt0aGlzLmNsYXVzZS5hcmdzWzBdXSA/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgaWYgKCFlbnZpcm8uZ2V0KGlkKSkge1xuICAgICAgICAgICAgZW52aXJvLnNldFBsYWNlaG9sZGVyKGlkKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ3JlYXRvckFjdGlvbih0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCkpIHtcbiAgICAgICAgICAgIG5ldyBDcmVhdGUoaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290KS5ydW4oZW52aXJvKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IEVkaXQoaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290LCB0aGlzLmdldFByb3BzKHRoaXMuY2xhdXNlLmFyZ3NbMF0pKS5ydW4oZW52aXJvKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGZvck5vblRvcExldmVsKGVudmlybzogRW52aXJvKSB7XG5cbiAgICAgICAgLy8gYXNzdW1pbmcgbWF4IHgueS56IG5lc3RpbmdcbiAgICAgICAgY29uc3Qgb3duZXJzID0gdGhpcy50b3BMZXZlbC5vd25lcnNPZih0aGlzLmNsYXVzZS5hcmdzWzBdKVxuICAgICAgICBjb25zdCBoYXNUb3BMZXZlbCA9IG93bmVycy5maWx0ZXIoeCA9PiB0aGlzLnRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXMoeCkpWzBdXG4gICAgICAgIGNvbnN0IHRvcExldmVsT3duZXIgPSBoYXNUb3BMZXZlbCA/IGhhc1RvcExldmVsIDogdGhpcy50b3BMZXZlbC5vd25lcnNPZihvd25lcnNbMF0pWzBdXG5cbiAgICAgICAgaWYgKHRvcExldmVsT3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuYW1lT2ZUaGlzID0gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZSh0aGlzLmNsYXVzZS5hcmdzWzBdKVxuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCA9PT0gbmFtZU9mVGhpc1swXSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBxID0gdGhpcy50b3BMZXZlbC50aGVtZS5hYm91dCh0b3BMZXZlbE93bmVyKVxuICAgICAgICBjb25zdCBtYXBzID0gZW52aXJvLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IGlkID0gbWFwcz8uWzBdPy5bdG9wTGV2ZWxPd25lcl0gLy8/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBFZGl0KGlkLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCwgdGhpcy5nZXRQcm9wcyh0b3BMZXZlbE93bmVyKSkucnVuKGVudmlybylcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNDcmVhdG9yQWN0aW9uKHByZWRpY2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gJ2J1dHRvbidcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcpIHtcblxuICAgIH1cblxuICAgIHJ1bihlbnZpcm86IEVudmlybyk6IGFueSB7XG5cbiAgICAgICAgaWYgKGVudmlyby5leGlzdHModGhpcy5pZCkpIHsgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEb21FbGVtKHRoaXMucHJlZGljYXRlKSkge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIGVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpc0RvbUVsZW0ocHJlZGljYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gWydidXR0b24nXS5pbmNsdWRlcyhwcmVkaWNhdGUpXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgcmVhZG9ubHkgcHJvcHM/OiBzdHJpbmdbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gZW52aXJvLmdldCh0aGlzLmlkKSA/PyBlbnZpcm8uc2V0UGxhY2Vob2xkZXIodGhpcy5pZClcbiAgICAgICAgb2JqLnNldCh0aGlzLnByZWRpY2F0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG5cblxufSIsImltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IEVkaXQgZnJvbSBcIi4vRWRpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSwgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBydW4oZW52aXJvOiBFbnZpcm8pOiBhbnkge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdJbXBseUFjdGlvbi5ydW4oKScsIHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCksICctLS0+JywgdGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgY29uc3QgaXNTZXRBbGlhc0NhbGwgPSAgLy8gYXNzdW1lIGlmIGF0IGxlYXN0IG9uZSBvd25lZCBlbnRpdHkgdGhhdCBpdCdzIGEgc2V0IGFsaWFzIGNhbGxcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuICAgICAgICAgICAgfHwgdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uY2x1c2lvbi50b3BMZXZlbCgpWzBdKS5zbGljZSgxKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXNTZXRBbGlhc0NhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXNDYWxsKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3RoZXIoZW52aXJvKVxuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIHNldEFsaWFzQ2FsbCgpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG4gICAgICAgIHdyYXAocHJvdG8pLnNldEFsaWFzKGNvbmNlcHROYW1lWzBdLCBwcm9wc05hbWVzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgd3JhcCgke3Byb3RvfSkuc2V0QWxpYXMoJHtjb25jZXB0TmFtZVswXX0sIFske3Byb3BzTmFtZXN9XSlgKVxuICAgIH1cblxuICAgIG90aGVyKGVudmlybzogRW52aXJvKSB7XG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF1cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUodG9wKVswXVxuICAgICAgICBjb25zdCB5ID0gZW52aXJvLnF1ZXJ5KGNsYXVzZU9mKHsgdHlwZTogJ25vdW4nLCByb290OiBwcm90b05hbWUgfSwgJ1gnKSlcbiAgICAgICAgY29uc3QgaWRzID0geS5tYXAobSA9PiBtWydYJ10pXG4gICAgICAgIGlkcy5mb3JFYWNoKGlkID0+IG5ldyBFZGl0KGlkLCBwcmVkaWNhdGUpLnJ1bihlbnZpcm8pKVxuICAgIH1cblxufVxuXG5cbmNvbnN0IGdldFByb3RvID0gKG5hbWU6IHN0cmluZykgPT5cbih7XG4gICAgJ2J1dHRvbic6IEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZVxufVtuYW1lXSlcbiIsImltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvUGFyc2VyXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuLi9wYXJzZXIvdG9DbGF1c2VcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLCByZWFkb25seSBlbnZpcm8gPSBnZXRFbnZpcm8oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLCByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiB0aGlzLmNvbmZpZy5zdGFydHVwQ29tbWFuZHMpIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZShzKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogYW55W10gPSBbXVxuXG4gICAgICAgIGZvciAoY29uc3QgYXN0IG9mIGdldFBhcnNlcihuYXRsYW5nLCB0aGlzLmNvbmZpZykucGFyc2VBbGwoKSkge1xuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhc3QudHlwZSA9PSAnbWFjcm8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2V0U3ludGF4KGFzdCBhcyBhbnkpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gdG9DbGF1c2UoYXN0KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmVudmlybylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwcyA9IHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBtYXBzLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdHMgPSBpZHMubWFwKGlkID0+IHRoaXMuZW52aXJvLmdldChpZCkpXG5cbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyby52YWx1ZXMuZm9yRWFjaChvID0+IG8ucG9pbnRPdXQoeyB0dXJuT2ZmOiB0cnVlIH0pKVxuICAgICAgICAgICAgICAgIG9iamVjdHMuZm9yRWFjaChvID0+IG8/LnBvaW50T3V0KCkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5tYXAobyA9PiBvPy5vYmplY3QpLmZvckVhY2gobyA9PiByZXN1bHRzLnB1c2gobykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBhbnlbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oY29uZmlnID0gZ2V0Q29uZmlnKCkpOiBCcmFpbiB7XG5cbiAgICBjb25zdCBiID0gbmV3IEJhc2ljQnJhaW4oY29uZmlnKVxuICAgIGIuaW5pdCgpXG4gICAgcmV0dXJuIGJcbn1cbiIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZTogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogQWN0aW9uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLnRvQWN0aW9uKHRvcExldmVsKS5jb25jYXQodGhpcy5jbGF1c2UyLnRvQWN0aW9uKHRvcExldmVsKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IEJhc2ljQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9CYXNpY0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWU8TGV4ZW1lVHlwZT4sXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGUucm9vdF0gOiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgQmFzaWNBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiXG5pbXBvcnQgeyBFbXB0eUNsYXVzZSB9IGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcbiAgICByZWFkb25seSBuZWdhdGVkOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNJbXBseTogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eTogYm9vbGVhblxuICAgIHJlYWRvbmx5IGV4YWN0SWRzOiBib29sZWFuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdXG4gICAgdG9wTGV2ZWwoKTogSWRbXVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZTxMZXhlbWVUeXBlPiwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpOiBDbGF1c2UgPT4gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIGV4YWN0SWRzPzogYm9vbGVhblxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSA5OTk5OTk5OSxcbiAgICAgICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gb3RoZXJcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBjb25jbHVzaW9uXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG59IiwiLyoqXG4gKiBJZCBvZiBhbiBlbnRpdHkuXG4gKi9cbmV4cG9ydCB0eXBlIElkID0gbnVtYmVyIHwgc3RyaW5nXG5cbi8qKlxuICogSWQgdG8gSWQgbWFwcGluZywgZnJvbSBvbmUgXCJ1bml2ZXJzZVwiIHRvIGFub3RoZXIuXG4gKi9cbmV4cG9ydCB0eXBlIE1hcCA9IHsgW2E6IElkXTogSWQgfVxuXG5cbmZ1bmN0aW9uKiBnZXRJZEdlbmVyYXRvcigpIHtcbiAgICBsZXQgeCA9IDBcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4KytcbiAgICAgICAgeWllbGQgeFxuICAgIH1cbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJZEdlbmVyYXRvcigpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JZChvcHRzPzogR2V0UmFuZG9tSWRPcHRzKTogSWQge1xuICAgIFxuICAgIC8vIGNvbnN0IG5ld0lkID0gYGlkJHtwYXJzZUludCgxMDAwICogTWF0aC5yYW5kb20oKSArICcnKX1gXG5cbiAgICBjb25zdCBuZXdJZCA9IGBpZCR7aWRHZW5lcmF0b3IubmV4dCgpLnZhbHVlfWBcblxuICAgIHJldHVybiBvcHRzPy5hc1ZhciA/IHRvVmFyKG5ld0lkKSA6IG5ld0lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0UmFuZG9tSWRPcHRzIHtcbiAgICBhc1ZhcjogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXIoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvVXBwZXJDYXNlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFyKGU6IElkKSB7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIoZSkpICYmIChlLnRvU3RyaW5nKClbMF0gPT09IGUudG9TdHJpbmcoKVswXS50b1VwcGVyQ2FzZSgpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db25zdChpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9Mb3dlckNhc2UoKVxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IEltcGx5QWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9JbXBseUFjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGV4YWN0SWRzID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IHRydWUsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgdGhlbWUgPSBjb25kaXRpb24udGhlbWUpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNvbmNsdXNpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5leGFjdElkcyA/PyB0aGlzLmV4YWN0SWRzLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5KVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24uZW50aXRpZXMuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5lbnRpdGllcylcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgLy8gZHVubm8gd2hhdCBJJ20gZG9pbidcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8vVE9ETyEhISEhISEhXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbmNsdXNpb24udG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24ub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25jbHVzaW9uLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IEFjdGlvbltdIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgSW1wbHlBY3Rpb24odGhpcy5jb25kaXRpb24sIHRoaXMuY29uY2x1c2lvbildXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2M7XG4gICAgICAgIHJldHVybiBoMSAmIGgxOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBDb21wb3NpdGVOb2RlLCBNZW1iZXIsIFJvbGUgfSBmcm9tIFwiLi4vcGFyc2VyL2FzdC10eXBlc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb25zdGl0dWVudFR5cGUgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi9Db25maWdcIlxuXG5leHBvcnQgY2xhc3MgQmFzaWNDb25maWcgaW1wbGVtZW50cyBDb25maWcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZTxMZXhlbWVUeXBlPltdLFxuICAgICAgICByZWFkb25seSBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdLFxuICAgICAgICByZWFkb25seSBfY29uc3RpdHVlbnRUeXBlczogQ29uc3RpdHVlbnRUeXBlW10sXG4gICAgICAgIHJlYWRvbmx5IHN5bnRheGVzOiB7IFtuYW1lIGluIENvbnN0aXR1ZW50VHlwZV06IE1lbWJlcltdIH0sXG4gICAgICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10pIHtcbiAgICB9XG5cbiAgICBnZXQgY29uc3RpdHVlbnRUeXBlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnN0aXR1ZW50VHlwZXMuc2xpY2UoKS5zb3J0KChhLCBiKSA9PiB0aGlzLm1heFByZWNlZGVuY2UoYiwgYSkpXG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBDb21wb3NpdGVOb2RlPFwibWFjcm9cIj4pOiB2b2lkID0+IHtcblxuICAgICAgICBjb25zdCBub3VuID0gbWFjcm8ubGlua3Mubm91blxuICAgICAgICBjb25zdCBtYWNyb3BhcnRzID0gKG1hY3JvLmxpbmtzLm1hY3JvcGFydCBhcyBhbnkpLmxpbmtzIGFzIENvbXBvc2l0ZU5vZGU8J21hY3JvcGFydCc+W11cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgICAgIGNvbnN0IG5hbWUgPSAobm91biBhcyBhbnkpLmxleGVtZS5yb290XG5cbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goeyB0eXBlOiAnZ3JhbW1hcicsIHJvb3Q6IG5hbWUgfSkgLy9UT0RPOiBtYXkgbmVlZCB0byByZW1vdmUgb2xkIGlmIHJlYXNzaWduaW5nISBcbiAgICAgICAgdGhpcy5fY29uc3RpdHVlbnRUeXBlcy5wdXNoKG5hbWUpIC8vVE9ETzogY2hlY2sgZHVwbGljYXRlcz9cbiAgICAgICAgdGhpcy5zeW50YXhlc1tuYW1lIGFzIENvbnN0aXR1ZW50VHlwZV0gPSBtZW1iZXJzXG5cbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSk6IE1lbWJlcltdID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4ZXNbbmFtZSBhcyBDb25zdGl0dWVudFR5cGVdID8/IFt7IHR5cGU6IFtuYW1lXSwgbnVtYmVyOiAxIH1dIC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGRlcGVuZGVuY2llcyhhOiBBc3RUeXBlKTogQXN0VHlwZVtdIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN5bnRheGVzW2EgYXMgQ29uc3RpdHVlbnRUeXBlXSA/PyBbXSkuZmxhdE1hcChtID0+IG0udHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc3RhdGljQ29tcGFyZShhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSB7XG5cbiAgICAgICAgY29uc3QgYXNjZW5kaW5nUHJlY2VkZW5jZSA9IHRoaXMuX2NvbnN0aXR1ZW50VHlwZXMuc2xpY2UoMCwgNCkgYXMgYW55XG5cbiAgICAgICAgY29uc3QgcGEgPSBhc2NlbmRpbmdQcmVjZWRlbmNlLmluZGV4T2YoYSlcbiAgICAgICAgY29uc3QgcGIgPSBhc2NlbmRpbmdQcmVjZWRlbmNlLmluZGV4T2YoYilcblxuICAgICAgICBpZiAocGEgPT09IC0xIHx8IHBiID09PSAtMSkgeyAvLyBlaXRoZXIgb25lIGlzIGN1c3RvbVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhIC0gcGJcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbGVuQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlcGVuZGVuY2llcyhhKS5sZW5ndGggLSB0aGlzLmRlcGVuZGVuY2llcyhiKS5sZW5ndGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGFEZXBlbmRzT25CID0gdGhpcy5kZXBlbmRlbmNpZXMoYSkuaW5jbHVkZXMoYilcbiAgICAgICAgY29uc3QgYkRlcGVuZHNPbkEgPSB0aGlzLmRlcGVuZGVuY2llcyhiKS5pbmNsdWRlcyhhKVxuXG4gICAgICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIG1heFByZWNlZGVuY2UgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHNwID0gdGhpcy5pZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgICAgIHRoaXMuc3RhdGljQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmN5Q29tcGFyZShhLCBiKSA/P1xuICAgICAgICAgICAgdGhpcy5sZW5Db21wYXJlKGEsIGIpXG5cbiAgICAgICAgcmV0dXJuIHNwXG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBDb21wb3NpdGVOb2RlPCdtYWNyb3BhcnQnPik6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSA9IChtYWNyb1BhcnQubGlua3M/LmFkaiBhcyBhbnkpPy5saW5rcz8ubWFwKChhOiBhbnkpID0+IGEubGV4ZW1lKSA/PyBbXVxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IChtYWNyb1BhcnQubGlua3MudGFnZ2VkdW5pb24gYXMgYW55KS5saW5rcyBhcyBDb21wb3NpdGVOb2RlPCd0YWdnZWR1bmlvbic+W11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzLmdyYW1tYXIpXG5cbiAgICBjb25zdCBxdWFudGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+IGEuY2FyZGluYWxpdHkpXG4gICAgY29uc3QgcXVhbGFkanMgPSBhZGplY3RpdmVzLmZpbHRlcihhID0+ICFhLmNhcmRpbmFsaXR5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZ3JhbW1hcnMubWFwKGcgPT4gKGcgYXMgYW55KS5sZXhlbWUucm9vdCksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0VHlwZSwgQ29tcG9zaXRlTm9kZSwgTWVtYmVyIH0gZnJvbSBcIi4uL3BhcnNlci9hc3QtdHlwZXNcIlxuaW1wb3J0IHsgQmFzaWNDb25maWcgfSBmcm9tIFwiLi9CYXNpY0NvbmZpZ1wiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlLCBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgc3RhcnR1cENvbW1hbmRzIH0gZnJvbSBcIi4vc3RhcnR1cENvbW1hbmRzXCJcbmltcG9ydCB7IENvbnN0aXR1ZW50VHlwZSwgY29uc3RpdHVlbnRUeXBlcywgc3ludGF4ZXMgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgICByZWFkb25seSBsZXhlbWVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXVxuICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW11cbiAgICByZWFkb25seSBjb25zdGl0dWVudFR5cGVzOiBDb25zdGl0dWVudFR5cGVbXVxuICAgIHJlYWRvbmx5IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IE1lbWJlcltdXG4gICAgc2V0U3ludGF4KG1hY3JvOiBDb21wb3NpdGVOb2RlPCdtYWNybyc+KTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG5cbiAgICByZXR1cm4gbmV3IEJhc2ljQ29uZmlnKGxleGVtZXMsXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBjb25zdGl0dWVudFR5cGVzLFxuICAgICAgICBzeW50YXhlcyxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzKVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSwgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAnYWRqJyxcbiAgJ2NvbnRyYWN0aW9uJyxcbiAgJ2NvcHVsYScsXG4gICdkZWZhcnQnLFxuICAnaW5kZWZhcnQnLFxuICAnZnVsbHN0b3AnLFxuICAnaHZlcmInLFxuICAnaXZlcmInLFxuICAnbXZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnbm9uc3ViY29uaicsXG4gICdleGlzdHF1YW50JyxcbiAgJ3VuaXF1YW50JyxcbiAgJ3RoZW4nLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnZ3JhbW1hcicsXG4gIC8vICdxdWFudGFkaicsXG4gICdkaXNqdW5jJyAvLyBvciwgYnV0LCBob3dldmVyIC4uLlxuKVxuLy8gJ3NlbWFudGljcycgLy8/XG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZTxMZXhlbWVUeXBlPltdID0gW1xuICAgIHtcbiAgICAgICAgcm9vdDogJ2hhdmUnLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydoYXZlJywgJ2hhcyddLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGljaycsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2NsaWNrJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2xpY2tlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBkZXJpdmVkRnJvbTogJ2NsaWNrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVzc2VkJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGFsaWFzRm9yOiAnY2xpY2tlZCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2F0JyxcbiAgICAgICAgdHlwZTogJ25vdW4nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlJyxcbiAgICAgICAgdHlwZTogJ2NvcHVsYScsXG4gICAgICAgIGZvcm1zOiBbJ2lzJywgJ2FyZSddLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIGlycmVndWxhcjogdHJ1ZSxcbiAgICAgICAgZm9ybXM6IFsnZG8nLCAnZG9lcyddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3NvbWUnLFxuICAgICAgICB0eXBlOiAnZXhpc3RxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZXZlcnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FsbCcsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW55JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0bycsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2l0aCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZnJvbScsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb2YnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ292ZXInLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhdCcsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlbicsXG4gICAgICAgIHR5cGU6ICd0aGVuJyAvLyBmaWxsZXIgd29yZFxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpZicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGVuJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JlY2F1c2UnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hpbGUnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhhdCcsXG4gICAgICAgIHR5cGU6ICdyZWxwcm9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3QnLFxuICAgICAgICB0eXBlOiAnbmVnYXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZScsXG4gICAgICAgIHR5cGU6ICdkZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2EnLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICcuJyxcbiAgICAgICAgdHlwZTogJ2Z1bGxzdG9wJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbmQnLFxuICAgICAgICB0eXBlOiAnbm9uc3ViY29uaidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcm9vdDogJ2JsYWNrJyxcbiAgICAgICAgdHlwZTogJ2FkaidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmplY3QnLFxuICAgICAgICB0eXBlOiAnYWRqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdwcmVkaWNhdGUnLFxuICAgICAgICB0eXBlOiAnYWRqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcHRpb25hbCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBjYXJkaW5hbGl0eTogJzF8MCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb25lLW9yLW1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcrJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcqJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvcicsXG4gICAgICAgIHR5cGU6ICdkaXNqdW5jJ1xuICAgIH0sXG5cbiAgICAvLyBncmFtbWFyXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICduZWdhdGlvbicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdpdmVyYicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3VuJyxcbiAgICAgICAgdHlwZTogJ2dyYW1tYXInXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FkaicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb3B1bGEnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlcG9zaXRpb24nLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndW5pcXVhbnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZXhpc3RxdWFudCcsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkZWZhcnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaW5kZWZhcnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmVscHJvbicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzdWJjbGF1c2UnLCAvLyBUT0RPOiByZW1vdmUhXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdub3VucGhyYXNlJywgLy8gVE9ETzogcmVtb3ZlIVxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG5dIiwiZXhwb3J0IGNvbnN0IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW10gPSBbXG4gICAgJ3F1YW50aWZpZXIgaXMgdW5pcXVhbnQgb3IgZXhpc3RxdWFudCcsXG4gICAgJ2FydGljbGUgaXMgaW5kZWZhcnQgb3IgZGVmYXJ0JyxcbiAgICAnY29tcGxlbWVudCBpcyBwcmVwb3NpdGlvbiB0aGVuIG5vdW5waHJhc2UnLFxuICAgICdjb3B1bGFzZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW5waHJhc2UgdGhlbiBjb3B1bGEgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiB0aGVuIHByZWRpY2F0ZSBub3VucGhyYXNlJyxcbiAgICAnbm91bnBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSB0aGVuIHplcm8tb3ItbW9yZSBhZGpzIHRoZW4gb3B0aW9uYWwgbm91biB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZSB0aGVuIHplcm8tb3ItbW9yZSBjb21wbGVtZW50cyAnLFxuICAgICdjb3B1bGFzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIGNvcHVsYSB0aGVuIG5vdW5waHJhc2UnLFxuICAgICdzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlJyxcbiAgICAnY29sb3Igb2YgYW55IGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGJ1dHRvbicsXG4gICAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBidXR0b24nLFxuXSIsImltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSwgUm9sZSB9IGZyb20gXCIuLi9wYXJzZXIvYXN0LXR5cGVzXCI7XG5pbXBvcnQgeyBFbGVtZW50VHlwZSwgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAndGFnZ2VkdW5pb24nLFxuICAgICdhcnJheScsIC8vIGFuIGFycmF5IG9mIGNvbnNlY3V0aXZlIGFzdHMgKHRpZWQgdG8gJyonKVxuICAgICdtYWNyb3BhcnQnLFxuICAgICdtYWNybycsXG5cbiAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgJ2NvcHVsYXNlbnRlbmNlJyxcbiAgICAnbm91bnBocmFzZScsXG4gICAgJ2NvbXBsZW1lbnQnLFxuICAgICdjb3B1bGFzdWJjbGF1c2UnLFxuICAgICdzdWJjbGF1c2UnLFxuXG4pXG5cbmV4cG9ydCB0eXBlIENvbnN0aXR1ZW50VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiB7IFtuYW1lIGluIENvbnN0aXR1ZW50VHlwZV06IE1lbWJlcltdIH0gPSB7XG5cbiAgICAvLyBwZXJtYW5lbnRcbiAgICAnbWFjcm8nOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VuJywgJ2dyYW1tYXInXSwgbnVtYmVyOiAxLCByb2xlOiAnbm91bicgYXMgUm9sZSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH1cbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZTogWydhZGonXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZTogWyd0aGVuJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF0sXG4gICAgJ3RhZ2dlZHVuaW9uJzogW1xuICAgICAgICB7IHR5cGU6IFsnZ3JhbW1hciddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9XG4gICAgXSxcbiAgICAnYXJyYXknOiBbXG5cbiAgICBdLFxuXG4gICAgLy8gdG8gYmUgcmVtb3ZlZFxuICAgICdzdWJjbGF1c2UnOiBbXG5cbiAgICBdLFxuICAgICdub3VucGhyYXNlJzogW1xuXG4gICAgXSxcbiAgICAnY29tcGxlbWVudCc6IFtcblxuICAgIF0sXG4gICAgJ2NvcHVsYXN1YmNsYXVzZSc6IFtcblxuICAgIF0sXG4gICAgJ2NvcHVsYXNlbnRlbmNlJzogW1xuXG4gICAgXSxcbn1cblxuIiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG5leHBvcnQgdHlwZSBFbGVtZW50VHlwZTxUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTx1bmtub3duPj4gPSBUIGV4dGVuZHMgUmVhZG9ubHlBcnJheTxpbmZlciBFbGVtZW50VHlwZT4gPyBFbGVtZW50VHlwZSA6IG5ldmVyO1xuIiwiaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIlxuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBBbmFwaG9yYSB7XG4gICAgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogdm9pZFxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFuYXBob3JhKCkge1xuICAgIHJldHVybiBuZXcgRW52aXJvQW5hcGhvcmEoKVxufVxuXG5jbGFzcyBFbnZpcm9BbmFwaG9yYSBpbXBsZW1lbnRzIEFuYXBob3JhIHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBlbnZpcm8gPSBnZXRFbnZpcm8oeyByb290OiB1bmRlZmluZWQgfSkpIHtcblxuICAgIH1cblxuICAgIGFzc2VydChjbGF1c2U6IENsYXVzZSkge1xuICAgICAgICBnZXRBY3R1YXRvcigpLnRha2VBY3Rpb24oY2xhdXNlLmNvcHkoeyBleGFjdElkczogdHJ1ZSB9KSwgdGhpcy5lbnZpcm8pXG4gICAgfVxuXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi9FbnZpcm9cIjtcbmltcG9ydCB7IFBsYWNlaG9sZGVyIH0gZnJvbSBcIi4vUGxhY2Vob2xkZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUVudmlybyBpbXBsZW1lbnRzIEVudmlybyB7XG5cbiAgICBwcm90ZWN0ZWQgbGFzdFJlZmVyZW5jZWQ/OiBJZFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50LCByZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgIH1cblxuICAgIHNldFBsYWNlaG9sZGVyKGlkOiBJZCk6IFdyYXBwZXIge1xuICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gbmV3IFBsYWNlaG9sZGVyKClcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdICYmICEodGhpcy5kaWN0aW9uYXJ5W2lkXSBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKVxuICAgIH1cblxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAmJiBwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnByZWRpY2F0ZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBvYmplY3Quc2V0KHApXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gb2JqZWN0XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gaWRcblxuICAgIH1cblxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW10geyAvL1RPRE8gdGhpcyBpcyBhIHRtcCBzb2x1dGlvbiwgZm9yIGFuYXBob3JhIHJlc29sdXRpb24sIGJ1dCBqdXN0IHdpdGggZGVzY3JpcHRpb25zLCB3aXRob3V0IHRha2luZyAobXVsdGktZW50aXR5KSByZWxhdGlvbnNoaXBzIGludG8gYWNjb3VudFxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgICAgICAgICAubWFwKHggPT4gKHsgZTogeFswXSwgdzogeFsxXSB9KSlcblxuICAgICAgICBjb25zdCBxdWVyeSA9IGNsYXVzZSAvLyBkZXNjcmliZWQgZW50aXRpZXNcbiAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgLm1hcChlID0+ICh7IGUsIGRlc2M6IGNsYXVzZS50aGVtZS5kZXNjcmliZShlKSB9KSlcblxuICAgICAgICBjb25zdCBnZXRJdCA9ICgpID0+IHRoaXMubGFzdFJlZmVyZW5jZWQgPyBbeyBlOiB0aGlzLmxhc3RSZWZlcmVuY2VkIGFzIHN0cmluZywgdzogdGhpcy5kaWN0aW9uYXJ5W3RoaXMubGFzdFJlZmVyZW5jZWRdIH1dIDogW11cblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeVxuICAgICAgICAgICAgLmZsYXRNYXAocSA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IHVuaXZlcnNlXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodSA9PiBxLmRlc2MuZXZlcnkoZCA9PiB1LncuaXMoZCkpKVxuICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHEuZGVzYy5pbmNsdWRlcygnaXQnKSA/IGdldEl0KCkgOiBbXSkgLy9UT0RPOiBoYXJkY29kZWQgYmFkXG4gICAgICAgICAgICAgICAgLy9UT0RPOiBhZnRlciBcImV2ZXJ5IC4uLlwiIHNlbnRlbmNlLCBcIml0XCIgc2hvdWxkIGJlIHVuZGVmaW5lZFxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZnJvbTogcS5lLCB0bzogdG8gfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHJlc1NpemUgPSBNYXRoLm1heCguLi5yZXMubWFwKHEgPT4gcS50by5sZW5ndGgpKTtcbiAgICAgICAgY29uc3QgZnJvbVRvVG8gPSAoZnJvbTogSWQpID0+IHJlcy5maWx0ZXIoeCA9PiB4LmZyb20gPT09IGZyb20pWzBdLnRvLm1hcCh4ID0+IHguZSk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gKG46IG51bWJlcikgPT4gWy4uLm5ldyBBcnJheShuKS5rZXlzKCldXG5cbiAgICAgICAgY29uc3QgcmVzMiA9IHJhbmdlKHJlc1NpemUpLm1hcChpID0+XG4gICAgICAgICAgICBjbGF1c2VcbiAgICAgICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZyb20gPT4gZnJvbVRvVG8oZnJvbSkubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAubWFwKGZyb20gPT4gKHsgW2Zyb21dOiBmcm9tVG9Ubyhmcm9tKVtpXSA/PyBmcm9tVG9Ubyhmcm9tKVswXSB9KSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKSlcblxuICAgICAgICB0aGlzLmxhc3RSZWZlcmVuY2VkID0gcmVzMi5mbGF0TWFwKHggPT4gT2JqZWN0LnZhbHVlcyh4KSkuYXQoLTEpID8/IHRoaXMubGFzdFJlZmVyZW5jZWRcblxuICAgICAgICByZXR1cm4gcmVzMiAvLyByZXR1cm4gbGlzdCBvZiBtYXBzLCB3aGVyZSBlYWNoIG1hcCBzaG91bGQgc2hvdWxkIGhhdmUgQUxMIGlkcyBmcm9tIGNsYXVzZSBpbiBpdHMga2V5cywgZWc6IFt7aWQyOmlkMSwgaWQ0OmlkM30sIHtpZDI6MSwgaWQ0OjN9XS5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRDb25jZXB0cyB9IGZyb20gXCIuL2dldENvbmNlcHRzXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNyZXRlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgb2JqZWN0OiBhbnksXG4gICAgICAgIHJlYWRvbmx5IHNpbXBsZUNvbmNlcHRzOiB7IFtjb25jZXB0TmFtZTogc3RyaW5nXTogc3RyaW5nW10gfSA9IG9iamVjdC5zaW1wbGVDb25jZXB0cyA/PyB7fSkge1xuXG4gICAgICAgIG9iamVjdC5zaW1wbGVDb25jZXB0cyA9IHNpbXBsZUNvbmNlcHRzXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wcz86IHN0cmluZ1tdKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA+IDEpIHsgLy8gYXNzdW1lID4gMSBwcm9wcyBhcmUgYSBwYXRoXG5cbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG5cbiAgICAgICAgfSBlbHNlIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPT09IDEpIHsgLy8gc2luZ2xlIHByb3BcblxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc2ltcGxlQ29uY2VwdHMpLmluY2x1ZGVzKHByb3BzWzBdKSkgeyAvLyBpcyBjb25jZXB0IFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF1dLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9IGVsc2UgeyAvLyAuLi4gbm90IGNvbmNlcHQsIGp1c3QgcHJvcFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmICghcHJvcHMgfHwgcHJvcHMubGVuZ3RoID09PSAwKSB7IC8vIG5vIHByb3BzXG5cbiAgICAgICAgICAgIGNvbnN0IGNvbmNlcHRzID0gZ2V0Q29uY2VwdHMocHJlZGljYXRlKVxuXG4gICAgICAgICAgICBpZiAoY29uY2VwdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlXSA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0c1swXV0sIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGNvbnN0IGNvbmNlcHQgPSBnZXRDb25jZXB0cyhwcmVkaWNhdGUpLmF0KDApXG5cbiAgICAgICAgcmV0dXJuIGNvbmNlcHQgP1xuICAgICAgICAgICAgdGhpcy5nZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0XSkgPT09IHByZWRpY2F0ZSA6XG4gICAgICAgICAgICAodGhpcy5vYmplY3QgYXMgYW55KVtwcmVkaWNhdGVdICE9PSB1bmRlZmluZWRcblxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHROYW1lXSA9IHByb3BQYXRoXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldE5lc3RlZChwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbcGF0aFswXV0gPSB2YWx1ZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dXG5cbiAgICAgICAgcGF0aC5zbGljZSgxLCAtMikuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB4W3BdXG4gICAgICAgIH0pXG5cbiAgICAgICAgeFtwYXRoLmF0KC0xKSBhcyBzdHJpbmddID0gdmFsdWVcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdKSB7XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lXG5cbiAgICAgICAgcGF0aC5zbGljZSgxKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHhbcF1cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4geFxuXG4gICAgfVxuXG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbjsgfSk6IHZvaWQge1xuXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFdyYXBwZXIgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG4gICAgLy8gZ2V0IGtleXMoKTogSWRbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGFjZWhvbGRlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlczogc3RyaW5nW10gPSBbXSwgcmVhZG9ubHkgb2JqZWN0OiBhbnkgPSB7fSkge1xuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmVkaWNhdGVzLnB1c2gocHJlZGljYXRlKTtcbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZXMuaW5jbHVkZXMocHJlZGljYXRlKTtcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wUGF0aDogc3RyaW5nW10pOiB2b2lkIHsgfVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSk6IHZvaWQgeyB9XG5cbn1cbiIsImltcG9ydCBDb25jcmV0ZVdyYXBwZXIgZnJvbSBcIi4vQ29uY3JldGVXcmFwcGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgcmVhZG9ubHkgb2JqZWN0OiBhbnlcbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzPzogc3RyaW5nW10pOiB2b2lkXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wUGF0aDogc3RyaW5nW10pOiB2b2lkXG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZFxuICAgIC8vIGdldChwcmVkaWNhdGU6IHN0cmluZyk6IGFueVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKG86IGFueSkge1xuICAgIHJldHVybiBuZXcgQ29uY3JldGVXcmFwcGVyKG8pXG59IiwiZXhwb3J0IGNvbnN0IHNldHRlclByZWZpeCA9ICdzZXQnXG5leHBvcnQgY29uc3QgaXNQcmVmaXggPSAnaXMnXG5leHBvcnQgY29uc3QgZ2V0dGVyUHJlZml4ID0gJ2dldCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHRzKG9iamVjdDogYW55KTogc3RyaW5nW10ge1xuXG4gICAgLy8gVE9ETzogdHJ5IGdldHRpbmcgYSBjb25jZXB0IGZyb20gYSBzdHJpbmcgb2JqZWN0IHdpdGggYSBcbiAgICAvLyBzcGVjaWFsIGRpY3Rpb25hcnksIGxpa2Uge3JlZDpjb2xvciwgZ3JlZW46Y29sb3IsIGJsdWU6Y29sb3J9XG4gICAgY29uc3Qgc3RyaW5nQ29uY2VwdHM6IHsgW3g6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgICAgICAnZ3JlZW4nOiAnY29sb3InLFxuICAgICAgICAncmVkJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JsdWUnOiAnY29sb3InLFxuICAgICAgICAnYmxhY2snOiAnY29sb3InLFxuICAgICAgICAnYmlnJzogJ3NpemUnXG4gICAgfVxuICAgIGNvbnN0IG1heWJlQ29uY2VwdDogc3RyaW5nIHwgdW5kZWZpbmVkID0gc3RyaW5nQ29uY2VwdHNbb2JqZWN0LnRvU3RyaW5nKCldXG5cbiAgICBpZiAobWF5YmVDb25jZXB0KSB7XG4gICAgICAgIHJldHVybiBbbWF5YmVDb25jZXB0XVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3RcbiAgICAgICAgLmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KVxuICAgICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdC5fX3Byb3RvX18pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5pbmNsdWRlcyhzZXR0ZXJQcmVmaXgpIHx8IHguaW5jbHVkZXMoaXNQcmVmaXgpKVxuICAgICAgICAubWFwKHggPT4gZ2V0Q29uY2VwdE5hbWUoeCkpXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3NldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElzTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7aXNQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZXR0ZXJOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtnZXR0ZXJQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0TmFtZShtZXRob2Q6IHN0cmluZykge1xuICAgIHJldHVybiBtZXRob2RcbiAgICAgICAgLnJlcGxhY2UoaXNQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShzZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShnZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZSgnXycsICcnKVxufVxuIiwiaW1wb3J0IG1haW4gZnJvbSBcIi4vbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcblxuKGFzeW5jICgpPT57XG4gICAgYXdhaXQgYXV0b3Rlc3RlcigpXG59KSgpXG5cbi8vIG1haW4oKVxuLy8gXG4iLCJpbXBvcnQgeyBnZXRMZXhlbWVzLCBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCBMZXhlciwgeyBBc3NlcnRBcmdzIH0gZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC8vIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgIC5tYXAocyA9PiAhcyA/ICcuJyA6IHMpXG4gICAgICAgICAgICAuZmxhdE1hcChzID0+IGdldExleGVtZXMocywgY29uZmlnLmxleGVtZXMpKVxuXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWU8TGV4ZW1lVHlwZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB0b2tlbiBpZmYgb2YgZ2l2ZW4gdHlwZSBhbmQgbW92ZSB0byBuZXh0OyBcbiAgICAgKiBlbHNlIHJldHVybiB1bmRlZmluZWQgYW5kIGRvbid0IG1vdmUuXG4gICAgICogQHBhcmFtIGFyZ3MgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgYXNzZXJ0PFQgZXh0ZW5kcyBMZXhlbWVUeXBlPih0eXBlOiBULCBhcmdzOiBBc3NlcnRBcmdzKTogTGV4ZW1lPFQ+IHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5wZWVrXG5cbiAgICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQgYXMgTGV4ZW1lPFQ+XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5lcnJvck91dCA/PyB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyb2FrKGFyZ3MuZXJyb3JNc2cgPz8gJycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHkgfSBmcm9tIFwiLi4vcGFyc2VyL2FzdC10eXBlc1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWU8VCBleHRlbmRzIExleGVtZVR5cGU+IHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovIHJlYWRvbmx5IHJvb3Q6IHN0cmluZ1xuICAgIC8qKnRva2VuIHR5cGUqLyByZWFkb25seSB0eXBlOiBUXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcywgYXNzdW1lIHJlZ3VsYXJpdHkqLyByZWFkb25seSBpcnJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxuICAgIC8qKmZvcm0gb2YgdGhpcyBpbnN0YW5jZSovcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbiAgICAvKipmb3IgcXVhbnRhZGogKi8gcmVhZG9ubHkgY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPikge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUucm9vdF0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQoIWxleGVtZS5pcnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLnJvb3R9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nLCBsZXhlbWVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSk6IExleGVtZTxMZXhlbWVUeXBlPltdIHtcblxuICAgIGNvbnN0IGxleGVtZTogTGV4ZW1lPExleGVtZVR5cGU+ID1cbiAgICAgICAgbGV4ZW1lcy5maWx0ZXIoeCA9PiBmb3Jtc09mKHgpLmluY2x1ZGVzKHdvcmQpKS5hdCgwKVxuICAgICAgICA/PyB7IHJvb3Q6IHdvcmQsIHR5cGU6ICdub3VuJyB9XG4gICAgXG4gICAgY29uc3QgbGV4ZW1lMjogTGV4ZW1lPExleGVtZVR5cGU+ID0geyAuLi5sZXhlbWUsIHRva2VuOiB3b3JkIH1cblxuICAgIHJldHVybiBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lMi5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBsZXhlbWVzKSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufVxuIiwiaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lPExleGVtZVR5cGU+XG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxuICAgIGFzc2VydDxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4odHlwZTogVCwgYXJnczogQXNzZXJ0QXJncyk6IExleGVtZTxUPiB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzc2VydEFyZ3Mge1xuICAgIGVycm9yTXNnPzogc3RyaW5nXG4gICAgZXJyb3JPdXQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbmZpZzpDb25maWcpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBBc3ROb2RlLCBBc3RUeXBlLCBSb2xlLCBNZW1iZXIsIEF0b21Ob2RlLCBDb21wb3NpdGVOb2RlLCBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vYXN0LXR5cGVzXCJcbmltcG9ydCB7IENvbnN0aXR1ZW50VHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vUGFyc2VyXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29uZmlnOiBDb25maWcsIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29uZmlnKSkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogKEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQpW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlKClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChhc3QpXG4gICAgICAgICAgICB0aGlzLmxleGVyLmFzc2VydCgnZnVsbHN0b3AnLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIHBhcnNlKCkge1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0aGlzLmNvbmZpZy5jb25zdGl0dWVudFR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeSh0aGlzLnRvcFBhcnNlLCB0KVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCB0b3BQYXJzZSA9IChuYW1lOiBBc3RUeXBlLCByb2xlPzogUm9sZSk6IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0F0b20odCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUF0b20obWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29uc3RpdHVlbnRUeXBlLCByb2xlKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VBdG9tID0gKG06IE1lbWJlcik6IEF0b21Ob2RlPExleGVtZVR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbnN0aXR1ZW50VHlwZSwgcm9sZT86IFJvbGUpOiBDb21wb3NpdGVOb2RlPENvbnN0aXR1ZW50VHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiBhbnkgPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhc3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3RUeXBlID0gYXN0LnR5cGUgIT0gJ2FycmF5JyA/IGFzdC50eXBlIDogT2JqZWN0LnZhbHVlcygoYXN0IGFzIENvbXBvc2l0ZU5vZGU8J2FycmF5Jz4pLmxpbmtzKS5hdCgwKT8udHlwZSA/PyAnYXJyYXknO1xuICAgICAgICAgICAgICAgIGxpbmtzW20ucm9sZSA/PyBhc3RUeXBlXSA9IGFzdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogYW55W10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IHggPSB0aGlzLnRyeSh0aGlzLnBhcnNlT25lTWVtYmVyLCBtLnR5cGUsIG0ubnVtYmVyLCBtLnJvbGUpIC8vIC0tLS0tLS0tXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnBhcnNlT25lTWVtYmVyKG0udHlwZSwgbS5yb2xlKVxuICAgICAgICAgICAgaWYgKCF4KSB7IHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pIH1cbiAgICAgICAgICAgIC8vIC0tLS0tLS0tLS1cblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDAgJiYgaXNOZWNlc3NhcnkobS5udW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgbGlua3M6IChsaXN0IGFzIGFueSkgLy9UT0RPISEhIVxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU9uZU1lbWJlciA9ICh0eXBlczogQXN0VHlwZVtdLCByb2xlPzogUm9sZSkgPT4ge1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50b3BQYXJzZSh0LCByb2xlKVxuXG4gICAgICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB0cnkgPSAobWV0aG9kOiAoYXJnczogYW55KSA9PiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICBjb25zdCB4ID0gbWV0aG9kKGFyZ3MpXG5cbiAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICB0aGlzLmxleGVyLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNBdG9tID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG59XG4iLCIvLyBpbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiO1xuLy8gaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgQXN0VHlwZSB9IGZyb20gXCIuL2FzdC10eXBlc1wiO1xuLy8gaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4vS29vbFBhcnNlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2UoKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZDtcbiAgICBwYXJzZUFsbCgpOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOkNvbmZpZyk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbmZpZyk7XG59XG5cblxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbnN0aXR1ZW50VHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIlxuXG5leHBvcnQgdHlwZSBBc3RUeXBlID0gTGV4ZW1lVHlwZSB8IENvbnN0aXR1ZW50VHlwZVxuXG5leHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgdHlwZSBSb2xlID0gJ3N1YmplY3QnXG4gICAgfCAnb2JqZWN0J1xuICAgIHwgJ3ByZWRpY2F0ZSdcbiAgICB8ICdjb25kaXRpb24nXG4gICAgfCAnY29uc2VxdWVuY2UnXG5cbmV4cG9ydCB0eXBlIE1lbWJlciA9IHtcbiAgICByZWFkb25seSB0eXBlOiBBc3RUeXBlW11cbiAgICByZWFkb25seSBudW1iZXI/OiBDYXJkaW5hbGl0eVxuICAgIHJlYWRvbmx5IHJvbGU/OiBSb2xlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXN0Tm9kZTxUIGV4dGVuZHMgQXN0VHlwZT4ge1xuICAgIHJlYWRvbmx5IHR5cGU6IFRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdG9tTm9kZTxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4gZXh0ZW5kcyBBc3ROb2RlPFQ+IHtcbiAgICByZWFkb25seSBsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvc2l0ZU5vZGU8VCBleHRlbmRzIENvbnN0aXR1ZW50VHlwZT4gZXh0ZW5kcyBBc3ROb2RlPFQ+IHtcbiAgICByZWFkb25seSBsaW5rczogeyBbaW5kZXggaW4gQXN0VHlwZSB8IFJvbGVdPzogQXN0Tm9kZTxBc3RUeXBlPiB9XG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGVcbn1cblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+XG4gICAgYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCwgaXNWYXIsIHRvQ29uc3QsIHRvVmFyIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uL2Vudmlyby9BbmFwaG9yYVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgQXN0VHlwZSwgQXRvbU5vZGUsIENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi9hc3QtdHlwZXNcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbnN0aXR1ZW50VHlwZSB9IGZyb20gXCIuLi9jb25maWcvc3ludGF4ZXNcIjtcblxuLy8gc3RhcnQgc2ltcGxlIGJ5IGFzc3VtaW5nIGhhcmRjb2RlZCB0eXBlcywgdGhlbiB0cnkgdG8gZGVwZW5kIHNvbGVseSBvbiByb2xlIChzZW1hbnRpYyByb2xlKVxuXG5leHBvcnQgaW50ZXJmYWNlIFJvbGVzIHtcbiAgICBzdWJqZWN0PzogSWRcbiAgICBvYmplY3Q/OiBJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgcm9sZXM/OiBSb2xlcyxcbiAgICBhbmFwaG9yYT86IENsYXVzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9DbGF1c2UoYXN0OiBBc3ROb2RlPEFzdFR5cGU+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IGNhc3QgPSBhc3QgYXMgQ29tcG9zaXRlTm9kZTxDb25zdGl0dWVudFR5cGU+XG5cbiAgICBpZiAoY2FzdC5saW5rcy5ub3VuIHx8IGNhc3QubGlua3MuYWRqKSB7XG4gICAgICAgIHJldHVybiBub3VuUGhyYXNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGNhc3QubGlua3MucmVscHJvbikge1xuICAgICAgICByZXR1cm4gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGNhc3QubGlua3MucHJlcG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIGNvbXBsZW1lbnRUb0NsYXVzZShhc3QgYXMgYW55LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoY2FzdC5saW5rcy5zdWJqZWN0ICYmIGNhc3QubGlua3MucHJlZGljYXRlKSB7XG4gICAgICAgIHJldHVybiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJHthc3QudHlwZX0hYClcblxufVxuXG5mdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBhbnksIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdEFzdCA9IGNvcHVsYVNlbnRlbmNlLmxpbmtzLnN1YmplY3QgYXMgQ29tcG9zaXRlTm9kZTxDb25zdGl0dWVudFR5cGU+XG4gICAgY29uc3QgcHJlZGljYXRlQXN0ID0gY29wdWxhU2VudGVuY2UubGlua3MucHJlZGljYXRlIGFzIENvbXBvc2l0ZU5vZGU8Q29uc3RpdHVlbnRUeXBlPlxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHN1YmplY3RBc3QubGlua3MudW5pcXVhbnQgIT09IHVuZGVmaW5lZCB9KVxuICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cbiAgICBjb25zdCBzdWJqZWN0ID0gdG9DbGF1c2Uoc3ViamVjdEFzdCwgbmV3QXJncylcbiAgICBjb25zdCBwcmVkaWNhdGUgPSB0b0NsYXVzZShwcmVkaWNhdGVBc3QsIG5ld0FyZ3MpLmNvcHkoeyBuZWdhdGU6ICEhY29wdWxhU2VudGVuY2UubGlua3MubmVnYXRpb24gfSlcbiAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgLnNvbWUoZSA9PiBpc1ZhcihlKSkgP1xuICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICBjb25zdCBtMCA9IHJlc3VsdC5lbnRpdGllcyAvLyBhc3N1bWUgaWRzIGFyZSBjYXNlIGluc2Vuc2l0aXZlLCBhc3N1bWUgaWYgSURYIGlzIHZhciBhbGwgaWR4IGFyZSB2YXJcbiAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIGNvbnN0IGEgPSBnZXRBbmFwaG9yYSgpIC8vIGdldCBhbmFwaG9yYVxuICAgIGEuYXNzZXJ0KHN1YmplY3QpXG4gICAgY29uc3QgbTEgPSAoYS5xdWVyeShwcmVkaWNhdGUpKVswXSA/PyB7fVxuICAgIGNvbnN0IHJlc3VsdDIgPSByZXN1bHQuY29weSh7IG1hcDogbTAgfSkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlLCBtYXA6IG0xIH0pXG5cbiAgICBjb25zdCBtMiA9IHJlc3VsdDIuZW50aXRpZXMgLy8gYXNzdW1lIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyaWFibGUgaXMgYWxzbyBhIHZhcmlhYmxlXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiByZXN1bHQyLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiByZXN1bHQyLmNvcHkoeyBtYXA6IG0yIH0pXG5cbn1cblxuZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBhbnksIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3QgcHJlZGljYXRlID0gY29wdWxhU3ViQ2xhdXNlLmxpbmtzLnByZWRpY2F0ZSBhcyBDb21wb3NpdGVOb2RlPENvbnN0aXR1ZW50VHlwZT5cblxuICAgIHJldHVybiAodG9DbGF1c2UocHJlZGljYXRlLCB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSkpXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG59XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnRUb0NsYXVzZShjb21wbGVtZW50OiBhbnksIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/ICgoKTogSWQgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBzdWJqZWN0IGlkJykgfSkoKVxuICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgY29uc3QgcHJlcG9zaXRpb24gPSBjb21wbGVtZW50LmxpbmtzLnByZXBvc2l0aW9uIGFzIEF0b21Ob2RlPCdwcmVwb3NpdGlvbic+XG4gICAgY29uc3Qgbm91blBocmFzZSA9IGNvbXBsZW1lbnQubGlua3Mubm91bnBocmFzZSBhcyBDb21wb3NpdGVOb2RlPENvbnN0aXR1ZW50VHlwZT5cblxuICAgIHJldHVybiBjbGF1c2VPZihwcmVwb3NpdGlvbi5sZXhlbWUsIHN1YmpJZCwgbmV3SWQpXG4gICAgICAgIC5hbmQodG9DbGF1c2Uobm91blBocmFzZSwgeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBuZXdJZCB9IH0pKVxuICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG59XG5cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKG5vdW5QaHJhc2U6IGFueSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBtYXliZUlkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgIGNvbnN0IHN1YmplY3RJZCA9IG5vdW5QaHJhc2UubGlua3MudW5pcXVhbnQgPyB0b1ZhcihtYXliZUlkKSA6IG1heWJlSWRcbiAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9O1xuXG4gICAgY29uc3QgYWRqZWN0aXZlczogQXRvbU5vZGU8TGV4ZW1lVHlwZT5bXSA9IChub3VuUGhyYXNlPy5saW5rcz8uYWRqIGFzIGFueSk/LmxpbmtzID8/IFtdXG4gICAgY29uc3Qgbm91biA9IG5vdW5QaHJhc2UubGlua3Mubm91biBhcyBBdG9tTm9kZTxMZXhlbWVUeXBlPiB8IHVuZGVmaW5lZFxuICAgIGNvbnN0IGNvbXBsZW1lbnRzOiBBdG9tTm9kZTxMZXhlbWVUeXBlPltdID0gKG5vdW5QaHJhc2U/LmxpbmtzPy5jb21wbGVtZW50IGFzIGFueSk/LmxpbmtzID8/IFtdXG4gICAgY29uc3Qgc3ViQ2xhdXNlID0gbm91blBocmFzZS5saW5rcy5jb3B1bGFzdWJjbGF1c2VcblxuICAgIGNvbnN0IHJlcyA9XG4gICAgICAgIGFkamVjdGl2ZXMubWFwKGEgPT4gYS5sZXhlbWUpXG4gICAgICAgICAgICAuY29uY2F0KG5vdW4/LmxleGVtZSA/IFtub3VuLmxleGVtZV0gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZChjb21wbGVtZW50cy5tYXAoYyA9PiBjID8gdG9DbGF1c2UoYywgbmV3QXJncykgOiBlbXB0eUNsYXVzZSgpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKHN1YkNsYXVzZSA/IHRvQ2xhdXNlKHN1YkNsYXVzZSwgbmV3QXJncykgOiBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cbiIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuLi9icmFpbi9CYXNpY0JyYWluXCI7XG5pbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiO1xuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0MyxcbiAgICB0ZXN0NCxcbiAgICB0ZXN0NSxcbiAgICB0ZXN0NixcbiAgICB0ZXN0NyxcbiAgICB0ZXN0OCxcbiAgICB0ZXN0OSxcbl1cblxuLyoqXG4gKiBJbnRlZ3JhdGlvbiB0ZXN0c1xuKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGF1dG90ZXN0ZXIoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXdhaXQgdGVzdCgpID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnLCB0ZXN0Lm5hbWUpXG4gICAgICAgIGF3YWl0IHNsZWVwKDIwMClcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCBicmFpbi5leGVjdXRlKCdidXR0b24nKVxuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZFxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3Q1KCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBjb2xvciBvZiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0NigpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB0aGUgYmFja2dyb3VuZCBvZiBzdHlsZSBvZiB4IGlzIGdyZWVuLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0NygpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIGEgYnV0dG9uLiB5IGlzIGEgYnV0dG9uLiB6IGlzIGEgYnV0dG9uLiBldmVyeSBidXR0b24gaXMgcmVkLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChhd2FpdCBicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IChhd2FpdCBicmFpbi5leGVjdXRlKCd5JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MyA9IChhd2FpdCBicmFpbi5leGVjdXRlKCd6JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3Q4KCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRleHQgb2YgeCBpcyBjYXByYS4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJykpWzBdLnRleHRDb250ZW50ID09PSAnY2FwcmEnXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDkoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIHJlZCBidXR0b24uIHggaXMgZ3JlZW4uJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3JlZCcpKS5sZW5ndGggPT09IDBcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2dyZWVuJykpLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuXG5hc3luYyBmdW5jdGlvbiBzbGVlcChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xlYXJEb20oKSB7XG4gICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnJ1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSdcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9