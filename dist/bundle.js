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
class BaseActuator {
    takeAction(clause, enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const a of yield clause.toAction(clause)) {
                yield a.run(enviro);
            }
        });
    }
}
exports["default"] = BaseActuator;


/***/ }),

/***/ "./app/src/actuator/BasicAction.ts":
/*!*****************************************!*\
  !*** ./app/src/actuator/BasicAction.ts ***!
  \*****************************************/
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
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Create_1 = __importDefault(__webpack_require__(/*! ./Create */ "./app/src/actuator/Create.ts"));
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
class BasicAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clause.args.length > 1) { // not handling relations yet
                return;
            }
            if (this.clause.exactIds) {
                return yield new Edit_1.default(this.clause.args[0], this.clause.predicate.root, []).run(enviro);
            }
            if (this.topLevel.topLevel().includes(this.clause.args[0])) {
                yield this.forTopLevel(enviro);
            }
            else {
                yield this.forNonTopLevel(enviro);
            }
        });
    }
    getProps(topLevelEntity) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]);
    }
    forTopLevel(enviro) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const q = this.topLevel.theme.about(this.clause.args[0]);
            const maps = yield enviro.query(q);
            const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
            if (!(yield enviro.get(id))) {
                enviro.setPlaceholder(id);
            }
            if (isCreatorAction(this.clause.predicate.root)) {
                new Create_1.default(id, this.clause.predicate.root).run(enviro);
            }
            else {
                new Edit_1.default(id, this.clause.predicate.root, this.getProps(this.clause.args[0])).run(enviro);
            }
        });
    }
    forNonTopLevel(enviro) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const maps = yield enviro.query(q);
            const id = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[topLevelOwner]; //?? getRandomId()
            return new Edit_1.default(id, this.clause.predicate.root, this.getProps(topLevelOwner)).run(enviro);
        });
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
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
class Create {
    constructor(id, predicate, ...args) {
        this.id = id;
        this.predicate = predicate;
    }
    run(enviro) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                // console.log('Create runs!')
            }
        });
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
            const obj = (_a = yield enviro.get(this.id)) !== null && _a !== void 0 ? _a : enviro.setPlaceholder(this.id);
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
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
class ImplyAction {
    constructor(condition, conclusion) {
        this.condition = condition;
        this.conclusion = conclusion;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            const top = this.condition.topLevel()[0];
            const protoName = this.condition.describe(top)[0]; // assume one 
            const predicate = this.conclusion.describe(top)[0];
            const y = yield enviro.query((0, Clause_1.clauseOf)({ type: 'noun', root: protoName }, 'X'));
            const ids = y.map(m => m['X']);
            ids.forEach(id => new Edit_1.default(id, predicate).run(enviro));
        });
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
const Parser_1 = __webpack_require__(/*! ../parser/Parser */ "./app/src/parser/Parser.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
const toClause_1 = __webpack_require__(/*! ../parser/toClause */ "./app/src/parser/toClause.ts");
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
class BasicBrain {
    constructor(config, enviro = (0, Enviro_1.default)({ root: document.body }), actuator = (0, Actuator_1.getActuator)()) {
        this.config = config;
        this.enviro = enviro;
        this.actuator = actuator;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const s of this.config.startupCommands) {
                yield this.execute(s);
            }
        });
    }
    execute(natlang) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const ast of (0, Parser_1.getParser)(natlang, this.config).parseAll()) {
                if (!ast) {
                    continue;
                }
                if (ast.type == 'macro') {
                    (0, Config_1.handleMacro)(ast, this.config);
                    continue;
                }
                const clause = yield (0, toClause_1.toClause)(ast);
                if (clause.isSideEffecty) {
                    yield this.actuator.takeAction(clause, this.enviro);
                }
                else {
                    const maps = yield this.enviro.query(clause);
                    const ids = maps.flatMap(m => Object.values(m));
                    const objects = yield Promise.all(ids.map(id => this.enviro.get(id)));
                    this.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
                    objects.forEach(o => o === null || o === void 0 ? void 0 : o.pointOut());
                    objects.map(o => o === null || o === void 0 ? void 0 : o.object).forEach(o => results.push(o));
                }
            }
            return results;
        });
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/brain/Brain.ts":
/*!********************************!*\
  !*** ./app/src/brain/Brain.ts ***!
  \********************************/
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
exports.getBrain = void 0;
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
function getBrain(config = (0, Config_1.getConfig)()) {
    return __awaiter(this, void 0, void 0, function* () {
        const b = new BasicBrain_1.default(config);
        yield b.init();
        return b;
    });
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/clauses/And.ts":
/*!********************************!*\
  !*** ./app/src/clauses/And.ts ***!
  \********************************/
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
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.clause1.toAction(topLevel)).concat(yield this.clause2.toAction(topLevel));
        });
    }
}
exports["default"] = And;


/***/ }),

/***/ "./app/src/clauses/BasicClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/BasicClause.ts ***!
  \****************************************/
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
        return __awaiter(this, void 0, void 0, function* () {
            return [new BasicAction_1.default(this, topLevel)];
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error("Method not implemented.");
            return [];
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            return [new ImplyAction_1.default(this.condition, this.conclusion)];
        });
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

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleMacro = exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
const startupCommands_1 = __webpack_require__(/*! ./startupCommands */ "./app/src/config/startupCommands.ts");
const syntaxes_2 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
function getConfig() {
    return {
        lexemes: lexemes_1.lexemes,
        getSyntax: syntaxes_1.getSyntax,
        startupCommands: startupCommands_1.startupCommands,
        constituentTypes: syntaxes_2.constituentTypes,
        lexemeTypes: LexemeType_1.lexemeTypes,
        setSyntax: syntaxes_1.setSyntax,
    };
}
exports.getConfig = getConfig;
function handleMacro(macro, config) {
    const noun = macro.links.noun;
    const copula = macro.links.copula;
    const macroparts = macro.links.macropart.links;
    const members = macroparts.map(m => handleMacroPart(m));
    const name = noun.lexeme.root;
    name == 'caprascema' ? console.log({ members, name }) : 0;
    config.lexemes.push({ type: 'grammar', root: name }); //TODO: not working, also may need to remove old if reassigning!
    // config.constituentTypes.push(name)
    config.setSyntax(name, members);
}
exports.handleMacro = handleMacro;
function handleMacroPart(macroPart) {
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
        root: 'nounphrase',
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
    // {
    //     root :'article', //TODO: auto-add!
    //     type :'grammar' 
    // }
    {
        root: 'subclause',
        type: 'grammar'
    }
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
exports.setSyntax = exports.getSyntax = exports.constituentTypes = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./app/src/config/utils.ts");
exports.constituentTypes = (0, utils_1.stringLiterals)('macro', 'macropart', 
// 'complexsentence1',
// 'complexsentence2',
'copulasentence', 
// 'iverbsentence',
// 'mverbsentence',
'nounphrase', 'complement', 'copulasubclause', 'array', // an array of consecutive asts (tied to '*')
// 'quantifier',
// 'article',
'taggedunion', 'subclause');
const syntaxes = {
    // 'quantifier': [
    //     // { type: ['uniquant', 'existquant'], number: 1 }
    // ],
    // 'article': [
    //     // { type: ['indefart', 'defart'], number: 1 }
    // ],
    'subclause': [
        { type: ['copulasubclause', /*'iverbsubclause', 'mverbsubclause1', 'mverbsubclause2'*/], number: 1 }
    ],
    'nounphrase': [
    // { type: ['quantifier'], number: '1|0' },
    // { type: ['article'], number: '1|0' },
    // { type: ['adj'], number: '*' },
    // { type: ['noun'], number: '1|0' },
    // { type: ['subclause'], number: '1|0' },
    // { type: ['complement'], number: '*' },
    ],
    'complement': [
    // { type: ['preposition'], number: 1 },
    // { type: ['nounphrase'], number: 1 }
    ],
    'copulasubclause': [
        { type: ['relpron'], number: 1 },
        { type: ['copula'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasentence': [
    //     { type: ['nounphrase'], number: 1, role: 'subject' },
    //     { type: ['copula'], number: 1 },
    //     { type: ['negation'], number: '1|0' },
    //     { type: ['nounphrase'], number: 1, role: 'predicate' }
    ],
    // 'iverbsentence': [
    //     { type: ['nounphrase'], number: 1, role: 'subject' },
    //     { type: ['negation'], number: '1|0' },
    //     { type: ['iverb'], number: 1 },
    //     { type: ['complement'], number: '*' }
    // ],
    // 'complexsentence1': [
    //     { type: ['subconj'], number: 1 },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' },
    //     { type: ['then'], number: '1|0' },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' }
    // ],
    // 'complexsentence2': [
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' },
    //     { type: ['subconj'], number: 1 },
    //     { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' }
    // ],
    // 'mverbsentence': [
    //     { type: ['nounphrase'], number: 1, role: 'subject' },
    //     { type: ['negation'], number: '1|0' },
    //     { type: ['mverb'], number: 1 },
    //     { type: ['complement'], number: '*' },
    //     { type: ['nounphrase'], number: 1, role: 'object' },
    //     { type: ['complement'], number: '*' },
    // ],
    'array': [],
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
    ]
};
const getSyntax = (name) => {
    var _a;
    return (_a = syntaxes[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
};
exports.getSyntax = getSyntax;
const setSyntax = (name, members) => {
    syntaxes[name] = members;
};
exports.setSyntax = setSyntax;


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
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, Actuator_1.getActuator)().takeAction(clause.copy({ exactIds: true }), this.enviro);
        });
    }
    query(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.enviro.query(clause);
        });
    }
}


/***/ }),

/***/ "./app/src/enviro/BaseEnviro.ts":
/*!**************************************!*\
  !*** ./app/src/enviro/BaseEnviro.ts ***!
  \**************************************/
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
const Placeholder_1 = __webpack_require__(/*! ./Placeholder */ "./app/src/enviro/Placeholder.ts");
class BaseEnviro {
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dictionary[id];
        });
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
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
exports.toClause = void 0;
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Anaphora_1 = __webpack_require__(/*! ../enviro/Anaphora */ "./app/src/enviro/Anaphora.ts");
function toClause(ast, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ast.type == 'nounphrase') {
            return nounPhraseToClause(ast, args);
        }
        else if (ast.type == 'copulasubclause') {
            return copulaSubClauseToClause(ast, args);
        }
        else if (ast.type == 'complement') {
            return complementToClause(ast, args);
        }
        else if (ast.type == 'copulasentence') {
            return copulaSentenceToClause(ast, args);
        }
        console.log({ ast });
        throw new Error(`Idk what to do with ${ast.type}!`);
    });
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const subjectAst = copulaSentence.links.subject;
        const predicateAst = copulaSentence.links.predicate;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: subjectAst.links.uniquant !== undefined });
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const subject = yield toClause(subjectAst, newArgs);
        const predicate = (yield toClause(predicateAst, newArgs)).copy({ negate: !!copulaSentence.links.negation });
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
        yield a.assert(subject);
        const m1 = (_c = (yield a.query(predicate))[0]) !== null && _c !== void 0 ? _c : {};
        const result2 = result.copy({ map: m0 }).copy({ sideEffecty: true, map: m1 });
        const m2 = result2.entities // assume anything owned by a variable is also a variable
            .filter(e => (0, Id_1.isVar)(e))
            .flatMap(e => result2.ownedBy(e))
            .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        return result2.copy({ map: m2 });
    });
}
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const predicate = copulaSubClause.links.predicate;
        return (yield toClause(predicate, Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } })))
            .copy({ sideEffecty: false });
    });
}
function complementToClause(complement, args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
        const newId = (0, Id_1.getRandomId)();
        const preposition = complement.links.preposition;
        const nounPhrase = complement.links.nounphrase;
        return (0, Clause_1.clauseOf)(preposition.lexeme, subjId, newId)
            .and(yield toClause(nounPhrase, Object.assign(Object.assign({}, args), { roles: { subject: newId } })))
            .copy({ sideEffecty: false });
    });
}
function nounPhraseToClause(nounPhrase, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
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
            .and((yield Promise.all(complements.map(c => c ? toClause(c, newArgs) : (0, Clause_1.emptyClause)()))).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
            .and(subClause ? yield toClause(subClause, newArgs) : (0, Clause_1.emptyClause)())
            .copy({ sideEffecty: false });
        return res;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO0tBQ3hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxZQUFZO0tBQ3JCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNLENBQUMsY0FBYztLQUM5QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFB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O0lBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRTtJQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsT0FBTztBQUM1QyxDQUFDOzs7Ozs7O1VDN0dEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzaWNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9DcmVhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9FZGl0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvSW1wbHlBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3RhcnR1cENvbW1hbmRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3V0aWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0FuYXBob3JhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vQ29uY3JldGVXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9QbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL2dldENvbmNlcHRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvYXN0LXR5cGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBCYXNlQWN0dWF0b3IgZnJvbSBcIi4vQmFzZUFjdHVhdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWN0dWF0b3Ige1xuICAgIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGVudmlybzogRW52aXJvKTogUHJvbWlzZTx2b2lkPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0dWF0b3IoKTogQWN0dWF0b3Ige1xuICAgIHJldHVybiBuZXcgQmFzZUFjdHVhdG9yKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBY3R1YXRvciBpbXBsZW1lbnRzIEFjdHVhdG9yIHtcblxuICAgIGFzeW5jIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGVudmlybzogRW52aXJvKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgZm9yIChjb25zdCBhIG9mIGF3YWl0IGNsYXVzZS50b0FjdGlvbihjbGF1c2UpKSB7XG4gICAgICAgICAgICBhd2FpdCBhLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IENyZWF0ZSBmcm9tIFwiLi9DcmVhdGVcIjtcbmltcG9ydCBFZGl0IGZyb20gXCIuL0VkaXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBCYXNpY0NsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UuYXJncy5sZW5ndGggPiAxKSB7IC8vIG5vdCBoYW5kbGluZyByZWxhdGlvbnMgeWV0XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5leGFjdElkcykge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBFZGl0KHRoaXMuY2xhdXNlLmFyZ3NbMF0sIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290LCBbXSkucnVuKGVudmlybylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRvcExldmVsLnRvcExldmVsKCkuaW5jbHVkZXModGhpcy5jbGF1c2UuYXJnc1swXSkpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZm9yVG9wTGV2ZWwoZW52aXJvKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5mb3JOb25Ub3BMZXZlbChlbnZpcm8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXRQcm9wcyh0b3BMZXZlbEVudGl0eTogSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9wTGV2ZWxcbiAgICAgICAgICAgIC5nZXRPd25lcnNoaXBDaGFpbih0b3BMZXZlbEVudGl0eSlcbiAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgLm1hcChlID0+IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUoZSlbMF0pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFzeW5jIGZvclRvcExldmVsKGVudmlybzogRW52aXJvKSB7XG5cbiAgICAgICAgY29uc3QgcSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuYWJvdXQodGhpcy5jbGF1c2UuYXJnc1swXSlcbiAgICAgICAgY29uc3QgbWFwcyA9IGF3YWl0IGVudmlyby5xdWVyeShxKVxuICAgICAgICBjb25zdCBpZCA9IG1hcHM/LlswXT8uW3RoaXMuY2xhdXNlLmFyZ3NbMF1dID8/IGdldFJhbmRvbUlkKClcblxuICAgICAgICBpZiAoIWF3YWl0IGVudmlyby5nZXQoaWQpKSB7XG4gICAgICAgICAgICBlbnZpcm8uc2V0UGxhY2Vob2xkZXIoaWQpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDcmVhdG9yQWN0aW9uKHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290KSkge1xuICAgICAgICAgICAgbmV3IENyZWF0ZShpZCwgdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QpLnJ1bihlbnZpcm8pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgRWRpdChpZCwgdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QsIHRoaXMuZ2V0UHJvcHModGhpcy5jbGF1c2UuYXJnc1swXSkpLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZm9yTm9uVG9wTGV2ZWwoZW52aXJvOiBFbnZpcm8pIHtcblxuICAgICAgICAvLyBhc3N1bWluZyBtYXggeC55LnogbmVzdGluZ1xuICAgICAgICBjb25zdCBvd25lcnMgPSB0aGlzLnRvcExldmVsLm93bmVyc09mKHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IGhhc1RvcExldmVsID0gb3duZXJzLmZpbHRlcih4ID0+IHRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh4KSlbMF1cbiAgICAgICAgY29uc3QgdG9wTGV2ZWxPd25lciA9IGhhc1RvcExldmVsID8gaGFzVG9wTGV2ZWwgOiB0aGlzLnRvcExldmVsLm93bmVyc09mKG93bmVyc1swXSlbMF1cblxuICAgICAgICBpZiAodG9wTGV2ZWxPd25lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5hbWVPZlRoaXMgPSB0aGlzLnRvcExldmVsLnRoZW1lLmRlc2NyaWJlKHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290ID09PSBuYW1lT2ZUaGlzWzBdKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHEgPSB0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRvcExldmVsT3duZXIpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBhd2FpdCBlbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgaWQgPSBtYXBzPy5bMF0/Llt0b3BMZXZlbE93bmVyXSAvLz8/IGdldFJhbmRvbUlkKClcblxuICAgICAgICByZXR1cm4gbmV3IEVkaXQoaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZS5yb290LCB0aGlzLmdldFByb3BzKHRvcExldmVsT3duZXIpKS5ydW4oZW52aXJvKVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpc0NyZWF0b3JBY3Rpb24ocHJlZGljYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZGljYXRlID09PSAnYnV0dG9uJ1xufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHJ1bihlbnZpcm86IEVudmlybyk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgaWYgKGVudmlyby5leGlzdHModGhpcy5pZCkpIHsgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEb21FbGVtKHRoaXMucHJlZGljYXRlKSkge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIGVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0NyZWF0ZSBydW5zIScpXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzRG9tRWxlbShwcmVkaWNhdGU6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIFsnYnV0dG9uJ10uaW5jbHVkZXMocHJlZGljYXRlKVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgcmVhZG9ubHkgcHJvcHM/OiBzdHJpbmdbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgZW52aXJvLmdldCh0aGlzLmlkKSA/PyBlbnZpcm8uc2V0UGxhY2Vob2xkZXIodGhpcy5pZClcbiAgICAgICAgb2JqLnNldCh0aGlzLnByZWRpY2F0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG5cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IEVkaXQgZnJvbSBcIi4vRWRpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseUFjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSwgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdJbXBseUFjdGlvbi5ydW4oKScsIHRoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCksICctLS0+JywgdGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCkpXG5cbiAgICAgICAgY29uc3QgaXNTZXRBbGlhc0NhbGwgPSAgLy8gYXNzdW1lIGlmIGF0IGxlYXN0IG9uZSBvd25lZCBlbnRpdHkgdGhhdCBpdCdzIGEgc2V0IGFsaWFzIGNhbGxcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuICAgICAgICAgICAgfHwgdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRoaXMuY29uY2x1c2lvbi50b3BMZXZlbCgpWzBdKS5zbGljZSgxKS5sZW5ndGhcblxuICAgICAgICBpZiAoaXNTZXRBbGlhc0NhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QWxpYXNDYWxsKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3RoZXIoZW52aXJvKVxuICAgICAgICB9XG5cblxuICAgIH1cblxuICAgIHNldEFsaWFzQ2FsbCgpIHtcblxuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmNvbmRpdGlvbi50b3BMZXZlbCgpWzBdIC8vVE9ETyAoIUFTU1VNRSEpIHNhbWUgYXMgdG9wIGluIGNvbmNsdXNpb25cbiAgICAgICAgY29uc3QgYWxpYXMgPSB0aGlzLmNvbmRpdGlvbi5nZXRPd25lcnNoaXBDaGFpbih0b3ApLnNsaWNlKDEpXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jb25jbHVzaW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgY29uY2VwdE5hbWUgPSBhbGlhcy5tYXAoeCA9PiB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh4KVswXSkgLy8gYXNzdW1lIGF0IGxlYXN0IG9uZSBuYW1lXG4gICAgICAgIGNvbnN0IHByb3BzTmFtZXMgPSBwcm9wcy5tYXAoeCA9PiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoeClbMF0pIC8vIHNhbWUgLi4uXG4gICAgICAgIGNvbnN0IHByb3RvTmFtZSA9IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHRvcClbMF0gLy8gYXNzdW1lIG9uZSBcbiAgICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90byhwcm90b05hbWUpXG4gICAgICAgIHdyYXAocHJvdG8pLnNldEFsaWFzKGNvbmNlcHROYW1lWzBdLCBwcm9wc05hbWVzKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgd3JhcCgke3Byb3RvfSkuc2V0QWxpYXMoJHtjb25jZXB0TmFtZVswXX0sIFske3Byb3BzTmFtZXN9XSlgKVxuICAgIH1cblxuICAgIGFzeW5jIG90aGVyKGVudmlybzogRW52aXJvKSB7XG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF1cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUodG9wKVswXVxuICAgICAgICBjb25zdCB5ID0gYXdhaXQgZW52aXJvLnF1ZXJ5KGNsYXVzZU9mKHsgdHlwZTogJ25vdW4nLCByb290OiBwcm90b05hbWUgfSwgJ1gnKSlcbiAgICAgICAgY29uc3QgaWRzID0geS5tYXAobSA9PiBtWydYJ10pXG4gICAgICAgIGlkcy5mb3JFYWNoKGlkID0+IG5ldyBFZGl0KGlkLCBwcmVkaWNhdGUpLnJ1bihlbnZpcm8pKVxuICAgIH1cblxufVxuXG5cbmNvbnN0IGdldFByb3RvID0gKG5hbWU6IHN0cmluZykgPT5cbih7XG4gICAgJ2J1dHRvbic6IEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZVxufVtuYW1lXSlcbiIsImltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvUGFyc2VyXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdHVhdG9yXCI7XG5pbXBvcnQgeyB0b0NsYXVzZSB9IGZyb20gXCIuLi9wYXJzZXIvdG9DbGF1c2VcIjtcbmltcG9ydCB7IENvbmZpZywgaGFuZGxlTWFjcm8gfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25maWc6IENvbmZpZywgcmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKHsgcm9vdDogZG9jdW1lbnQuYm9keSB9KSwgcmVhZG9ubHkgYWN0dWF0b3IgPSBnZXRBY3R1YXRvcigpKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IHMgb2YgdGhpcy5jb25maWcuc3RhcnR1cENvbW1hbmRzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmV4ZWN1dGUocylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IGFueVtdID0gW11cblxuICAgICAgICBmb3IgKGNvbnN0IGFzdCBvZiBnZXRQYXJzZXIobmF0bGFuZywgdGhpcy5jb25maWcpLnBhcnNlQWxsKCkpIHtcblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXN0LnR5cGUgPT0gJ21hY3JvJykge1xuICAgICAgICAgICAgICAgIGhhbmRsZU1hY3JvKGFzdCBhcyBhbnksIHRoaXMuY29uZmlnKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IHRvQ2xhdXNlKGFzdClcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmVudmlybylcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHMgPSBhd2FpdCB0aGlzLmVudmlyby5xdWVyeShjbGF1c2UpXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKG0gPT4gT2JqZWN0LnZhbHVlcyhtKSlcbiAgICAgICAgICAgICAgICBjb25zdCBvYmplY3RzID0gYXdhaXQgUHJvbWlzZS5hbGwoaWRzLm1hcChpZCA9PiB0aGlzLmVudmlyby5nZXQoaWQpKSlcblxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gbz8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICBvYmplY3RzLm1hcChvID0+IG8/Lm9iamVjdCkuZm9yRWFjaChvID0+IHJlc3VsdHMucHVzaChvKSlcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxufSIsImltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT5cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJyYWluKGNvbmZpZyA9IGdldENvbmZpZygpKTogUHJvbWlzZTxCcmFpbj4ge1xuXG4gICAgY29uc3QgYiA9IG5ldyBCYXNpY0JyYWluKGNvbmZpZylcbiAgICBhd2FpdCBiLmluaXQoKVxuICAgIHJldHVybiBiXG59XG4iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9BY3Rpb25cIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWU6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBBbmQge1xuXG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UyLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTJJc1JoZW1lLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6XG4gICAgICAgICAgICBbLi4udGhpcy5jbGF1c2UxLmZsYXRMaXN0KCksIC4uLnRoaXMuY2xhdXNlMi5mbGF0TGlzdCgpXVxuXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXVzZTEuZW50aXRpZXMuY29uY2F0KHRoaXMuY2xhdXNlMi5lbnRpdGllcylcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHsgLy9UT0RPOiBpZiB0aGlzIGlzIG5lZ2F0ZWQhXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuYWJvdXQoaWQpLmFuZCh0aGlzLmNsYXVzZTIuYWJvdXQoaWQpKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZTEudG9TdHJpbmcoKSArICcsJyArIHRoaXMuY2xhdXNlMi50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEuZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIuZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTIgOiBlbXB0eUNsYXVzZSgpXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLmNsYXVzZTEudG9BY3Rpb24odG9wTGV2ZWwpKS5jb25jYXQoYXdhaXQgdGhpcy5jbGF1c2UyLnRvQWN0aW9uKHRvcExldmVsKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IEJhc2ljQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9CYXNpY0FjdGlvblwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWU8TGV4ZW1lVHlwZT4sXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBlbXB0eUNsYXVzZSgpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGUucm9vdF0gOiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIFtuZXcgQmFzaWNBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiXG5pbXBvcnQgeyBFbXB0eUNsYXVzZSB9IGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuLy8gaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuLi9sZXhlci9sZXhlbWVzXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG4gICAgcmVhZG9ubHkgbmVnYXRlZDogYm9vbGVhblxuICAgIHJlYWRvbmx5IGlzSW1wbHk6IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHk6IGJvb2xlYW5cbiAgICByZWFkb25seSBleGFjdElkczogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBQcm9taXNlPEFjdGlvbltdPlxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXVxuICAgIHRvcExldmVsKCk6IElkW11cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWU8TGV4ZW1lVHlwZT4sIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTogQ2xhdXNlID0+IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBleGFjdElkcz86IGJvb2xlYW5cbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSkge1xuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCB0aGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG90aGVyXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gY29uY2x1c2lvblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBQcm9taXNlPEFjdGlvbltdPiB7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbn0iLCIvKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBudW1iZXIgfCBzdHJpbmdcblxuLyoqXG4gKiBJZCB0byBJZCBtYXBwaW5nLCBmcm9tIG9uZSBcInVuaXZlcnNlXCIgdG8gYW5vdGhlci5cbiAqL1xuZXhwb3J0IHR5cGUgTWFwID0geyBbYTogSWRdOiBJZCB9XG5cblxuZnVuY3Rpb24qIGdldElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrK1xuICAgICAgICB5aWVsZCB4XG4gICAgfVxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldElkR2VuZXJhdG9yKClcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKG9wdHM/OiBHZXRSYW5kb21JZE9wdHMpOiBJZCB7XG4gICAgXG4gICAgLy8gY29uc3QgbmV3SWQgPSBgaWQke3BhcnNlSW50KDEwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpfWBcblxuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YFxuXG4gICAgcmV0dXJuIG9wdHM/LmFzVmFyID8gdG9WYXIobmV3SWQpIDogbmV3SWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRSYW5kb21JZE9wdHMge1xuICAgIGFzVmFyOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcihpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9VcHBlckNhc2UoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbnN0KGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b0xvd2VyQ2FzZSgpXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgSW1wbHlBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0ltcGx5QWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgZXhhY3RJZHMgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gdHJ1ZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSB0aGVtZSA9IGNvbmRpdGlvbi50aGVtZSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY29uY2x1c2lvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/LmV4YWN0SWRzID8/IHRoaXMuZXhhY3RJZHMsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25jbHVzaW9uLmVudGl0aWVzKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcyAvLyBkdW5ubyB3aGF0IEknbSBkb2luJ1xuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uY2x1c2lvbi50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNvbmRpdGlvbi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogUHJvbWlzZTxBY3Rpb25bXT4ge1xuICAgICAgICByZXR1cm4gW25ldyBJbXBseUFjdGlvbih0aGlzLmNvbmRpdGlvbiwgdGhpcy5jb25jbHVzaW9uKV1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdFR5cGUsIEF0b21Ob2RlLCBDb21wb3NpdGVOb2RlLCBNZW1iZXIsIFJvbGUgfSBmcm9tIFwiLi4vcGFyc2VyL2FzdC10eXBlc1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBnZXRTeW50YXgsIHNldFN5bnRheCB9IGZyb20gXCIuL3N5bnRheGVzXCJcbmltcG9ydCB7IHN0YXJ0dXBDb21tYW5kcyB9IGZyb20gXCIuL3N0YXJ0dXBDb21tYW5kc1wiXG5pbXBvcnQgeyBjb25zdGl0dWVudFR5cGVzLCBDb25zdGl0dWVudFR5cGUgfSBmcm9tIFwiLi9zeW50YXhlc1wiXG5pbXBvcnQgeyBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gICAgcmVhZG9ubHkgbGV4ZW1lczogTGV4ZW1lPExleGVtZVR5cGU+W11cbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IE1lbWJlcltdXG4gICAgcmVhZG9ubHkgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXVxuICAgIHJlYWRvbmx5IGNvbnN0aXR1ZW50VHlwZXM6IENvbnN0aXR1ZW50VHlwZVtdXG4gICAgcmVhZG9ubHkgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXVxuICAgIHNldFN5bnRheChuYW1lOiBzdHJpbmcsIG1lbWJlcnM6IE1lbWJlcltdKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCk6IENvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lcyxcbiAgICAgICAgZ2V0U3ludGF4LFxuICAgICAgICBzdGFydHVwQ29tbWFuZHMsXG4gICAgICAgIGNvbnN0aXR1ZW50VHlwZXMsXG4gICAgICAgIGxleGVtZVR5cGVzLFxuICAgICAgICBzZXRTeW50YXgsXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlTWFjcm8obWFjcm86IENvbXBvc2l0ZU5vZGU8J21hY3JvJz4sIGNvbmZpZzogQ29uZmlnKSB7XG5cbiAgICBjb25zdCBub3VuID0gbWFjcm8ubGlua3Mubm91blxuICAgIGNvbnN0IGNvcHVsYSA9IG1hY3JvLmxpbmtzLmNvcHVsYVxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSAobWFjcm8ubGlua3MubWFjcm9wYXJ0IGFzIGFueSkubGlua3MgYXMgQ29tcG9zaXRlTm9kZTwnbWFjcm9wYXJ0Jz5bXVxuXG4gICAgY29uc3QgbWVtYmVycyA9IG1hY3JvcGFydHMubWFwKG0gPT4gaGFuZGxlTWFjcm9QYXJ0KG0pKVxuICAgIGNvbnN0IG5hbWUgPSAobm91biBhcyBhbnkpLmxleGVtZS5yb290XG5cbiAgICBuYW1lID09ICdjYXByYXNjZW1hJyA/IGNvbnNvbGUubG9nKHsgbWVtYmVycywgbmFtZSB9KSA6IDBcbiAgICBjb25maWcubGV4ZW1lcy5wdXNoKHsgdHlwZTogJ2dyYW1tYXInLCByb290OiBuYW1lIH0pIC8vVE9ETzogbm90IHdvcmtpbmcsIGFsc28gbWF5IG5lZWQgdG8gcmVtb3ZlIG9sZCBpZiByZWFzc2lnbmluZyFcblxuICAgIC8vIGNvbmZpZy5jb25zdGl0dWVudFR5cGVzLnB1c2gobmFtZSlcbiAgICBjb25maWcuc2V0U3ludGF4KG5hbWUsIG1lbWJlcnMpXG5cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWFjcm9QYXJ0KG1hY3JvUGFydDogQ29tcG9zaXRlTm9kZTwnbWFjcm9wYXJ0Jz4pOiBNZW1iZXIge1xuXG4gICAgY29uc3QgYWRqZWN0aXZlczogTGV4ZW1lPExleGVtZVR5cGU+W10gPSAobWFjcm9QYXJ0LmxpbmtzPy5hZGogYXMgYW55KT8ubGlua3M/Lm1hcCgoYTogYW55KSA9PiBhLmxleGVtZSkgPz8gW11cbiAgICBjb25zdCB0YWdnZWRVbmlvbnMgPSAobWFjcm9QYXJ0LmxpbmtzLnRhZ2dlZHVuaW9uIGFzIGFueSkubGlua3MgYXMgQ29tcG9zaXRlTm9kZTwndGFnZ2VkdW5pb24nPltdXG4gICAgY29uc3QgZ3JhbW1hcnMgPSB0YWdnZWRVbmlvbnMubWFwKHggPT4geC5saW5rcy5ncmFtbWFyKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGdyYW1tYXJzLm1hcChnID0+IChnIGFzIGFueSkubGV4ZW1lLnJvb3QpLFxuICAgICAgICByb2xlOiBxdWFsYWRqcy5hdCgwKT8ucm9vdCBhcyBSb2xlLFxuICAgICAgICBudW1iZXI6IHF1YW50YWRqcy5hdCgwKT8uY2FyZGluYWxpdHlcbiAgICB9XG59IiwiaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkaicsXG4gICdjb250cmFjdGlvbicsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ2l2ZXJiJyxcbiAgJ212ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vbnN1YmNvbmonLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICd0aGVuJyxcbiAgJ3JlbHByb24nLFxuICAnbmVnYXRpb24nLFxuICAnbm91bicsXG4gICdwcmVwb3NpdGlvbicsXG4gICdzdWJjb25qJyxcbiAgJ2dyYW1tYXInLFxuICAvLyAncXVhbnRhZGonLFxuICAnZGlzanVuYycgLy8gb3IsIGJ1dCwgaG93ZXZlciAuLi5cbilcbi8vICdzZW1hbnRpY3MnIC8vP1xuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPiIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSA9IFtcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdoYXZlJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnaGF2ZScsICdoYXMnXSxcbiAgICAgICAgaXJyZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgaXJyZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwicmVkXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImdyZWVuXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZG8nLFxuICAgICAgICB0eXBlOiAnaHZlcmInLFxuICAgICAgICBpcnJlZ3VsYXI6IHRydWUsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdibGFjaycsXG4gICAgICAgIHR5cGU6ICdhZGonXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzdWJqZWN0JyxcbiAgICAgICAgdHlwZTogJ2FkaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlZGljYXRlJyxcbiAgICAgICAgdHlwZTogJ2FkaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3B0aW9uYWwnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgY2FyZGluYWxpdHk6ICcxfDAnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29uZS1vci1tb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnemVyby1vci1tb3JlJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGNhcmRpbmFsaXR5OiAnKidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3InLFxuICAgICAgICB0eXBlOiAnZGlzanVuYydcbiAgICB9LFxuXG4gICAgLy8gZ3JhbW1hclxuXG4gICAge1xuICAgICAgICByb290OiAnbmVnYXRpb24nLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaXZlcmInLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm91bicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhZGonLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm91bnBocmFzZScsIC8vb3Igbm91bi1waHJhc2U/XG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjb3B1bGEnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlcG9zaXRpb24nLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndW5pcXVhbnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnZXhpc3RxdWFudCcsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkZWZhcnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaW5kZWZhcnQnLFxuICAgICAgICB0eXBlOiAnZ3JhbW1hcidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncmVscHJvbicsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH0sXG5cbiAgICAvLyB7XG4gICAgLy8gICAgIHJvb3QgOidhcnRpY2xlJywgLy9UT0RPOiBhdXRvLWFkZCFcbiAgICAvLyAgICAgdHlwZSA6J2dyYW1tYXInIFxuICAgIC8vIH1cblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3N1YmNsYXVzZScsXG4gICAgICAgIHR5cGU6ICdncmFtbWFyJ1xuICAgIH1cblxuXSIsImV4cG9ydCBjb25zdCBzdGFydHVwQ29tbWFuZHM6IHN0cmluZ1tdID0gW1xuICAgICdxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQnLFxuICAgICdhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCcsXG4gICAgJ2NvbXBsZW1lbnQgaXMgcHJlcG9zaXRpb24gdGhlbiBub3VucGhyYXNlJyxcbiAgICAnY29wdWxhc2VudGVuY2UgaXMgc3ViamVjdCBub3VucGhyYXNlIHRoZW4gY29wdWxhIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gdGhlbiBwcmVkaWNhdGUgbm91bnBocmFzZScsXG4gICAgJ25vdW5waHJhc2UgaXMgb3B0aW9uYWwgcXVhbnRpZmllciB0aGVuIG9wdGlvbmFsIGFydGljbGUgdGhlbiB6ZXJvLW9yLW1vcmUgYWRqcyB0aGVuIG9wdGlvbmFsIG5vdW4gdGhlbiBvcHRpb25hbCBzdWJjbGF1c2UgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHMgJyxcbiAgICAnY29sb3Igb2YgYW55IGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGJ1dHRvbicsXG4gICAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBidXR0b24nLFxuXSIsImltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSwgUm9sZSB9IGZyb20gXCIuLi9wYXJzZXIvYXN0LXR5cGVzXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4vTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgRWxlbWVudFR5cGUsIHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgLy8gJ2NvbXBsZXhzZW50ZW5jZTEnLFxuICAgIC8vICdjb21wbGV4c2VudGVuY2UyJyxcbiAgICAnY29wdWxhc2VudGVuY2UnLFxuICAgIC8vICdpdmVyYnNlbnRlbmNlJyxcbiAgICAvLyAnbXZlcmJzZW50ZW5jZScsXG4gICAgJ25vdW5waHJhc2UnLFxuICAgICdjb21wbGVtZW50JyxcbiAgICAnY29wdWxhc3ViY2xhdXNlJyxcbiAgICAnYXJyYXknLCAvLyBhbiBhcnJheSBvZiBjb25zZWN1dGl2ZSBhc3RzICh0aWVkIHRvICcqJylcbiAgICAvLyAncXVhbnRpZmllcicsXG4gICAgLy8gJ2FydGljbGUnLFxuICAgICd0YWdnZWR1bmlvbicsXG4gICAgJ3N1YmNsYXVzZScsIC8vc3Vib3JkaW5hdGUgY2xhdXNlXG4pXG4vLyB8ICdpdmVyYnN1YmNsYXVzZSdcbi8vIHwgJ212ZXJic3ViY2xhdXNlMSdcbi8vIHwgJ212ZXJic3ViY2xhdXNlMidcbi8vIHwgJ2NvbmpzZW50ZWNlJ1xuLy8gfCAnY29wdWxhcXVlc3Rpb24nXG5cbmV4cG9ydCB0eXBlIENvbnN0aXR1ZW50VHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPjtcblxuY29uc3Qgc3ludGF4ZXM6IHsgW25hbWUgaW4gQ29uc3RpdHVlbnRUeXBlXTogTWVtYmVyW10gfSA9IHtcblxuICAgIC8vICdxdWFudGlmaWVyJzogW1xuICAgIC8vICAgICAvLyB7IHR5cGU6IFsndW5pcXVhbnQnLCAnZXhpc3RxdWFudCddLCBudW1iZXI6IDEgfVxuICAgIC8vIF0sXG4gICAgLy8gJ2FydGljbGUnOiBbXG4gICAgLy8gICAgIC8vIHsgdHlwZTogWydpbmRlZmFydCcsICdkZWZhcnQnXSwgbnVtYmVyOiAxIH1cbiAgICAvLyBdLFxuICAgICdzdWJjbGF1c2UnOiBbXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzdWJjbGF1c2UnLCAvKidpdmVyYnN1YmNsYXVzZScsICdtdmVyYnN1YmNsYXVzZTEnLCAnbXZlcmJzdWJjbGF1c2UyJyovXSwgbnVtYmVyOiAxIH1cbiAgICBdLFxuICAgICdub3VucGhyYXNlJzogW1xuICAgICAgICAvLyB7IHR5cGU6IFsncXVhbnRpZmllciddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIC8vIHsgdHlwZTogWydhcnRpY2xlJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgLy8geyB0eXBlOiBbJ2FkaiddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICAvLyB7IHR5cGU6IFsnbm91biddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIC8vIHsgdHlwZTogWydzdWJjbGF1c2UnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICAvLyB7IHR5cGU6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJyB9LFxuICAgIF0sXG4gICAgJ2NvbXBsZW1lbnQnOiBbXG4gICAgICAgIC8vIHsgdHlwZTogWydwcmVwb3NpdGlvbiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgLy8geyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxIH1cbiAgICBdLFxuICAgICdjb3B1bGFzdWJjbGF1c2UnOiBbXG4gICAgICAgIHsgdHlwZTogWydyZWxwcm9uJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEgfVxuICAgIF0sXG4gICAgJ2NvcHVsYXNlbnRlbmNlJzogW1xuICAgICAgICAvLyAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgLy8gICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIC8vICAgICB7IHR5cGU6IFsnbmVnYXRpb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICAvLyAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAncHJlZGljYXRlJyB9XG4gICAgXSxcbiAgICAvLyAnaXZlcmJzZW50ZW5jZSc6IFtcbiAgICAvLyAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAvLyAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAvLyAgICAgeyB0eXBlOiBbJ2l2ZXJiJ10sIG51bWJlcjogMSB9LFxuICAgIC8vICAgICB7IHR5cGU6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJyB9XG4gICAgLy8gXSxcbiAgICAvLyAnY29tcGxleHNlbnRlbmNlMSc6IFtcbiAgICAvLyAgICAgeyB0eXBlOiBbJ3N1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgLy8gICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgIC8vICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgLy8gICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uc2VxdWVuY2UnIH1cbiAgICAvLyBdLFxuICAgIC8vICdjb21wbGV4c2VudGVuY2UyJzogW1xuICAgIC8vICAgICB7IHR5cGU6IFsnY29wdWxhc2VudGVuY2UnLCAnbXZlcmJzZW50ZW5jZScsICdpdmVyYnNlbnRlbmNlJ10sIG51bWJlcjogMSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgIC8vICAgICB7IHR5cGU6IFsnc3ViY29uaiddLCBudW1iZXI6IDEgfSxcbiAgICAvLyAgICAgeyB0eXBlOiBbJ2NvcHVsYXNlbnRlbmNlJywgJ212ZXJic2VudGVuY2UnLCAnaXZlcmJzZW50ZW5jZSddLCBudW1iZXI6IDEsIHJvbGU6ICdjb25kaXRpb24nIH1cbiAgICAvLyBdLFxuICAgIC8vICdtdmVyYnNlbnRlbmNlJzogW1xuICAgIC8vICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgIC8vICAgICB7IHR5cGU6IFsnbmVnYXRpb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIC8vICAgICB7IHR5cGU6IFsnbXZlcmInXSwgbnVtYmVyOiAxIH0sXG4gICAgLy8gICAgIHsgdHlwZTogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonIH0sXG4gICAgLy8gICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ29iamVjdCcgfSxcbiAgICAvLyAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfSxcbiAgICAvLyBdLFxuICAgICdhcnJheSc6IFtcblxuICAgIF0sXG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bicgLCdncmFtbWFyJyBdLCBudW1iZXI6IDEgLCByb2xlIDogJ25vdW4nIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9XG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH1cbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2dyYW1tYXInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfVxuICAgIF1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKTogTWVtYmVyW10gPT4ge1xuICAgIHJldHVybiBzeW50YXhlc1tuYW1lIGFzIENvbnN0aXR1ZW50VHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV07IC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG59XG5cbmV4cG9ydCBjb25zdCBzZXRTeW50YXggPSAobmFtZTogc3RyaW5nLCBtZW1iZXJzOiBNZW1iZXJbXSkgPT4ge1xuICAgIHN5bnRheGVzW25hbWUgYXMgQ29uc3RpdHVlbnRUeXBlXSA9IG1lbWJlcnNcbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbmV4cG9ydCB0eXBlIEVsZW1lbnRUeXBlPFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PHVua25vd24+PiA9IFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PGluZmVyIEVsZW1lbnRUeXBlPiA/IEVsZW1lbnRUeXBlIDogbmV2ZXI7XG4iLCJpbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgZ2V0RW52aXJvIGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuYXBob3JhIHtcbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHZvaWQ+XG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5hcGhvcmEoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IHVuZGVmaW5lZCB9KSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IGdldEFjdHVhdG9yKCkudGFrZUFjdGlvbihjbGF1c2UuY29weSh7IGV4YWN0SWRzOiB0cnVlIH0pLCB0aGlzLmVudmlybylcbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuaW1wb3J0IHsgUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogV3JhcHBlciB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBuZXcgUGxhY2Vob2xkZXIoKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gJiYgISh0aGlzLmRpY3Rpb25hcnlbaWRdIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG5cbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyICYmIHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpIHtcblxuICAgICAgICAgICAgcGxhY2Vob2xkZXIucHJlZGljYXRlcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIG9iamVjdC5zZXQocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBvYmplY3RcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuXG4gICAgfVxuXG4gICAgYXN5bmMgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiB7IC8vVE9ETyB0aGlzIGlzIGEgdG1wIHNvbHV0aW9uLCBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiwgYnV0IGp1c3Qgd2l0aCBkZXNjcmlwdGlvbnMsIHdpdGhvdXQgdGFraW5nIChtdWx0aS1lbnRpdHkpIHJlbGF0aW9uc2hpcHMgaW50byBhY2NvdW50XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiAoeyBlOiB4WzBdLCB3OiB4WzFdIH0pKVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gY2xhdXNlIC8vIGRlc2NyaWJlZCBlbnRpdGllc1xuICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgZSwgZGVzYzogY2xhdXNlLnRoZW1lLmRlc2NyaWJlKGUpIH0pKVxuXG4gICAgICAgIGNvbnN0IGdldEl0ID0gKCkgPT4gdGhpcy5sYXN0UmVmZXJlbmNlZCA/IFt7IGU6IHRoaXMubGFzdFJlZmVyZW5jZWQgYXMgc3RyaW5nLCB3OiB0aGlzLmRpY3Rpb25hcnlbdGhpcy5sYXN0UmVmZXJlbmNlZF0gfV0gOiBbXVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHF1ZXJ5XG4gICAgICAgICAgICAuZmxhdE1hcChxID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvID0gdW5pdmVyc2VcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih1ID0+IHEuZGVzYy5ldmVyeShkID0+IHUudy5pcyhkKSkpXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQocS5kZXNjLmluY2x1ZGVzKCdpdCcpID8gZ2V0SXQoKSA6IFtdKSAvL1RPRE86IGhhcmRjb2RlZCBiYWRcbiAgICAgICAgICAgICAgICAvL1RPRE86IGFmdGVyIFwiZXZlcnkgLi4uXCIgc2VudGVuY2UsIFwiaXRcIiBzaG91bGQgYmUgdW5kZWZpbmVkXG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBmcm9tOiBxLmUsIHRvOiB0byB9XG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgcmVzU2l6ZSA9IE1hdGgubWF4KC4uLnJlcy5tYXAocSA9PiBxLnRvLmxlbmd0aCkpO1xuICAgICAgICBjb25zdCBmcm9tVG9UbyA9IChmcm9tOiBJZCkgPT4gcmVzLmZpbHRlcih4ID0+IHguZnJvbSA9PT0gZnJvbSlbMF0udG8ubWFwKHggPT4geC5lKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSAobjogbnVtYmVyKSA9PiBbLi4ubmV3IEFycmF5KG4pLmtleXMoKV1cblxuICAgICAgICBjb25zdCByZXMyID0gcmFuZ2UocmVzU2l6ZSkubWFwKGkgPT5cbiAgICAgICAgICAgIGNsYXVzZVxuICAgICAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnJvbSA9PiBmcm9tVG9Ubyhmcm9tKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJvbSA9PiAoeyBbZnJvbV06IGZyb21Ub1RvKGZyb20pW2ldID8/IGZyb21Ub1RvKGZyb20pWzBdIH0pKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpKVxuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSByZXMyLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKS5hdCgtMSkgPz8gdGhpcy5sYXN0UmVmZXJlbmNlZFxuXG4gICAgICAgIHJldHVybiByZXMyIC8vIHJldHVybiBsaXN0IG9mIG1hcHMsIHdoZXJlIGVhY2ggbWFwIHNob3VsZCBzaG91bGQgaGF2ZSBBTEwgaWRzIGZyb20gY2xhdXNlIGluIGl0cyBrZXlzLCBlZzogW3tpZDI6aWQxLCBpZDQ6aWQzfSwge2lkMjoxLCBpZDQ6M31dLlxuICAgIH1cblxufSIsImltcG9ydCB7IGdldENvbmNlcHRzIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY3JldGVXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlQ29uY2VwdHM6IHsgW2NvbmNlcHROYW1lOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0gb2JqZWN0LnNpbXBsZUNvbmNlcHRzID8/IHt9KSB7XG5cbiAgICAgICAgb2JqZWN0LnNpbXBsZUNvbmNlcHRzID0gc2ltcGxlQ29uY2VwdHNcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzPzogc3RyaW5nW10pOiB2b2lkIHtcblxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID4gMSkgeyAvLyBhc3N1bWUgPiAxIHByb3BzIGFyZSBhIHBhdGhcblxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcblxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA9PT0gMSkgeyAvLyBzaW5nbGUgcHJvcFxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaW1wbGVDb25jZXB0cykuaW5jbHVkZXMocHJvcHNbMF0pKSB7IC8vIGlzIGNvbmNlcHQgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcm9wc1swXV0sIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIC4uLiBub3QgY29uY2VwdCwganVzdCBwcm9wXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKCFwcm9wcyB8fCBwcm9wcy5sZW5ndGggPT09IDApIHsgLy8gbm8gcHJvcHNcblxuICAgICAgICAgICAgY29uc3QgY29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcmVkaWNhdGUpXG5cbiAgICAgICAgICAgIGlmIChjb25jZXB0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAodGhpcy5vYmplY3QgYXMgYW55KVtwcmVkaWNhdGVdID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRzWzBdXSwgcHJlZGljYXRlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgY29uY2VwdCA9IGdldENvbmNlcHRzKHByZWRpY2F0ZSkuYXQoMClcblxuICAgICAgICByZXR1cm4gY29uY2VwdCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRdKSA9PT0gcHJlZGljYXRlIDpcbiAgICAgICAgICAgICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZV0gIT09IHVuZGVmaW5lZFxuXG4gICAgfVxuXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IHN0cmluZywgcHJvcFBhdGg6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2ltcGxlQ29uY2VwdHNbY29uY2VwdE5hbWVdID0gcHJvcFBhdGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwYXRoWzBdXSA9IHZhbHVlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV1cblxuICAgICAgICBwYXRoLnNsaWNlKDEsIC0yKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHhbcF1cbiAgICAgICAgfSlcblxuICAgICAgICB4W3BhdGguYXQoLTEpIGFzIHN0cmluZ10gPSB2YWx1ZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXROZXN0ZWQocGF0aDogc3RyaW5nW10pIHtcblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmVcblxuICAgICAgICBwYXRoLnNsaWNlKDEpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB4XG5cbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuOyB9KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyIHwgdW5kZWZpbmVkPlxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWRcbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbiAgICAvLyBnZXQga2V5cygpOiBJZFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGVzOiBzdHJpbmdbXSA9IFtdLCByZWFkb25seSBvYmplY3Q6IGFueSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5pbmNsdWRlcyhwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWQgeyB9XG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZCB7IH1cblxufVxuIiwiaW1wb3J0IENvbmNyZXRlV3JhcHBlciBmcm9tIFwiLi9Db25jcmV0ZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgcHJvcHM/OiBzdHJpbmdbXSk6IHZvaWRcbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWRcbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pOiB2b2lkXG4gICAgLy8gZ2V0KHByZWRpY2F0ZTogc3RyaW5nKTogYW55XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAobzogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBDb25jcmV0ZVdyYXBwZXIobylcbn0iLCJleHBvcnQgY29uc3Qgc2V0dGVyUHJlZml4ID0gJ3NldCdcbmV4cG9ydCBjb25zdCBpc1ByZWZpeCA9ICdpcydcbmV4cG9ydCBjb25zdCBnZXR0ZXJQcmVmaXggPSAnZ2V0J1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdHMob2JqZWN0OiBhbnkpOiBzdHJpbmdbXSB7XG5cbiAgICAvLyBUT0RPOiB0cnkgZ2V0dGluZyBhIGNvbmNlcHQgZnJvbSBhIHN0cmluZyBvYmplY3Qgd2l0aCBhIFxuICAgIC8vIHNwZWNpYWwgZGljdGlvbmFyeSwgbGlrZSB7cmVkOmNvbG9yLCBncmVlbjpjb2xvciwgYmx1ZTpjb2xvcn1cbiAgICBjb25zdCBzdHJpbmdDb25jZXB0czogeyBbeDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAgICdncmVlbic6ICdjb2xvcicsXG4gICAgICAgICdyZWQnOiAnY29sb3InLFxuICAgICAgICAnYmx1ZSc6ICdjb2xvcicsXG4gICAgICAgICdibGFjayc6ICdjb2xvcicsXG4gICAgICAgICdiaWcnOiAnc2l6ZSdcbiAgICB9XG4gICAgY29uc3QgbWF5YmVDb25jZXB0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBzdHJpbmdDb25jZXB0c1tvYmplY3QudG9TdHJpbmcoKV1cblxuICAgIGlmIChtYXliZUNvbmNlcHQpIHtcbiAgICAgICAgcmV0dXJuIFttYXliZUNvbmNlcHRdXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpXG4gICAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0Ll9fcHJvdG9fXykpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LmluY2x1ZGVzKHNldHRlclByZWZpeCkgfHwgeC5pbmNsdWRlcyhpc1ByZWZpeCkpXG4gICAgICAgIC5tYXAoeCA9PiBnZXRDb25jZXB0TmFtZSh4KSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7c2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXNOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtpc1ByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2dldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHROYW1lKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1ldGhvZFxuICAgICAgICAucmVwbGFjZShpc1ByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKHNldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKGdldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKCdfJywgJycpXG59XG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIlxuXG4oYXN5bmMgKCk9PntcbiAgICBhd2FpdCBhdXRvdGVzdGVyKClcbn0pKClcblxuLy8gbWFpbigpXG4vLyBcbiIsImltcG9ydCB7IGdldExleGVtZXMsIExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MgfSBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZTxMZXhlbWVUeXBlPltdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlclxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb25maWc6IENvbmZpZykge1xuXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZVxuICAgICAgICAgICAgLy8gLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgIC5mbGF0TWFwKHMgPT4gZ2V0TGV4ZW1lcyhzLCBjb25maWcubGV4ZW1lcykpXG5cbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZTxMZXhlbWVUeXBlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VCBleHRlbmRzIExleGVtZVR5cGU+KHR5cGU6IFQsIGFyZ3M6IEFzc2VydEFyZ3MpOiBMZXhlbWU8VD4gfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnBlZWtcblxuICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudCBhcyBMZXhlbWU8VD5cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmVycm9yT3V0ID8/IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvYWsoYXJncy5lcnJvck1zZyA/PyAnJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSB9IGZyb20gXCIuLi9wYXJzZXIvYXN0LXR5cGVzXCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZTxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4ge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IFRcbiAgICAvKip1c2VmdWwgZm9yIGlycmVndWxhciBzdHVmZiovIHJlYWRvbmx5IGZvcm1zPzogc3RyaW5nW11cbiAgICAvKipyZWZlcnMgdG8gdmVyYiBjb25qdWdhdGlvbnMgb3IgcGx1cmFsIGZvcm1zLCBhc3N1bWUgcmVndWxhcml0eSovIHJlYWRvbmx5IGlycmVndWxhcj86IGJvb2xlYW5cbiAgICAvKipzZW1hbnRpY2FsIGRlcGVuZGVjZSovIHJlYWRvbmx5IGRlcml2ZWRGcm9tPzogc3RyaW5nXG4gICAgLyoqc2VtYW50aWNhbCBlcXVpdmFsZW5jZSovIHJlYWRvbmx5IGFsaWFzRm9yPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyByZWFkb25seSBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi9yZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIC8qKmZvciBxdWFudGFkaiAqLyByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3Jtc09mKGxleGVtZTogTGV4ZW1lPExleGVtZVR5cGU+KSB7XG5cbiAgICByZXR1cm4gW2xleGVtZS5yb290XS5jb25jYXQobGV4ZW1lPy5mb3JtcyA/PyBbXSlcbiAgICAgICAgLmNvbmNhdCghbGV4ZW1lLmlycmVndWxhciA/IFtgJHtsZXhlbWUucm9vdH1zYF0gOiBbXSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcsIGxleGVtZXM6IExleGVtZTxMZXhlbWVUeXBlPltdKTogTGV4ZW1lPExleGVtZVR5cGU+W10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWU8TGV4ZW1lVHlwZT4gPVxuICAgICAgICBsZXhlbWVzLmZpbHRlcih4ID0+IGZvcm1zT2YoeCkuaW5jbHVkZXMod29yZCkpLmF0KDApXG4gICAgICAgID8/IHsgcm9vdDogd29yZCwgdHlwZTogJ25vdW4nIH1cbiAgICBcbiAgICBjb25zdCBsZXhlbWUyOiBMZXhlbWU8TGV4ZW1lVHlwZT4gPSB7IC4uLmxleGVtZSwgdG9rZW46IHdvcmQgfVxuXG4gICAgcmV0dXJuIGxleGVtZTIuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgsIGxleGVtZXMpKSA6XG4gICAgICAgIFtsZXhlbWUyXVxuXG59XG4iLCJpbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWU8TGV4ZW1lVHlwZT5cbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG4gICAgYXNzZXJ0PFQgZXh0ZW5kcyBMZXhlbWVUeXBlPih0eXBlOiBULCBhcmdzOiBBc3NlcnRBcmdzKTogTGV4ZW1lPFQ+IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJncyB7XG4gICAgZXJyb3JNc2c/OiBzdHJpbmdcbiAgICBlcnJvck91dD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOkNvbmZpZyk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29uZmlnKVxufVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IFRcbiIsImltcG9ydCB7IEFzdE5vZGUsIEFzdFR5cGUsIFJvbGUsIE1lbWJlciwgQXRvbU5vZGUsIENvbXBvc2l0ZU5vZGUsIGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9hc3QtdHlwZXNcIlxuaW1wb3J0IHsgQ29uc3RpdHVlbnRUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9QYXJzZXJcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb25maWc6IENvbmZpZywgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb25maWcpKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2UoKVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGFzdClcbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYXNzZXJ0KCdmdWxsc3RvcCcsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgcGFyc2UoKSB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHRoaXMuY29uZmlnLmNvbnN0aXR1ZW50VHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5KHRoaXMudG9wUGFyc2UsIHQpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRvcFBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29uZmlnLmdldFN5bnRheChuYW1lKVxuXG4gICAgICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiB0aGlzLmlzQXRvbSh0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQXRvbShtZW1iZXJzWzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb25zdGl0dWVudFR5cGUsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUF0b20gPSAobTogTWVtYmVyKTogQXRvbU5vZGU8TGV4ZW1lVHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29uc3RpdHVlbnRUeXBlLCByb2xlPzogUm9sZSk6IENvbXBvc2l0ZU5vZGU8Q29uc3RpdHVlbnRUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29uZmlnLmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFzdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzdFR5cGUgPSBhc3QudHlwZSAhPSAnYXJyYXknID8gYXN0LnR5cGUgOiBPYmplY3QudmFsdWVzKChhc3QgYXMgQ29tcG9zaXRlTm9kZTwnYXJyYXknPikubGlua3MpLmF0KDApPy50eXBlID8/ICdhcnJheSc7XG4gICAgICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdFR5cGVdID0gYXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBhbnlbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc3QgeCA9IHRoaXMudHJ5KHRoaXMucGFyc2VPbmVNZW1iZXIsIG0udHlwZSwgbS5udW1iZXIsIG0ucm9sZSkgLy8gLS0tLS0tLS1cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMucGFyc2VPbmVNZW1iZXIobS50eXBlLCBtLnJvbGUpXG4gICAgICAgICAgICBpZiAoIXgpIHsgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bykgfVxuICAgICAgICAgICAgLy8gLS0tLS0tLS0tLVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBsaW5rczogKGxpc3QgYXMgYW55KSAvL1RPRE8hISEhXG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlT25lTWVtYmVyID0gKHR5cGVzOiBBc3RUeXBlW10sIHJvbGU/OiBSb2xlKSA9PiB7XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRvcFBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeSA9IChtZXRob2Q6IChhcmdzOiBhbnkpID0+IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQsIC4uLmFyZ3M6IGFueVtdKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgIGNvbnN0IHggPSBtZXRob2QoYXJncylcblxuICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0F0b20gPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGV4ZW1lVHlwZXMuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cbn1cbiIsIi8vIGltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCI7XG4vLyBpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlLCBBc3RUeXBlIH0gZnJvbSBcIi4vYXN0LXR5cGVzXCI7XG4vLyBpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi9Lb29sUGFyc2VyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZSgpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkO1xuICAgIHBhcnNlQWxsKCk6IChBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkKVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb25maWc6Q29uZmlnKTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IEtvb2xQYXJzZXIoc291cmNlQ29kZSwgY29uZmlnKTtcbn1cblxuXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29uc3RpdHVlbnRUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5cbmV4cG9ydCB0eXBlIEFzdFR5cGUgPSBMZXhlbWVUeXBlIHwgQ29uc3RpdHVlbnRUeXBlXG5cbmV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCB0eXBlIFJvbGUgPSAnc3ViamVjdCdcbiAgICB8ICdvYmplY3QnXG4gICAgfCAncHJlZGljYXRlJ1xuICAgIHwgJ2NvbmRpdGlvbidcbiAgICB8ICdjb25zZXF1ZW5jZSdcblxuZXhwb3J0IHR5cGUgTWVtYmVyID0ge1xuICAgIHJlYWRvbmx5IHR5cGU6IEFzdFR5cGVbXVxuICAgIHJlYWRvbmx5IG51bWJlcj86IENhcmRpbmFsaXR5XG4gICAgcmVhZG9ubHkgcm9sZT86IFJvbGVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3ROb2RlPFQgZXh0ZW5kcyBBc3RUeXBlPiB7XG4gICAgcmVhZG9ubHkgdHlwZTogVFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF0b21Ob2RlPFQgZXh0ZW5kcyBMZXhlbWVUeXBlPiBleHRlbmRzIEFzdE5vZGU8VD4ge1xuICAgIHJlYWRvbmx5IGxleGVtZTogTGV4ZW1lPExleGVtZVR5cGU+XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9zaXRlTm9kZTxUIGV4dGVuZHMgQ29uc3RpdHVlbnRUeXBlPiBleHRlbmRzIEFzdE5vZGU8VD4ge1xuICAgIHJlYWRvbmx5IGxpbmtzOiB7IFtpbmRleCBpbiBBc3RUeXBlIHwgUm9sZV0/OiBBc3ROb2RlPEFzdFR5cGU+IH1cbiAgICByZWFkb25seSByb2xlPzogUm9sZVxufVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PlxuICAgIGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT5cbiAgICBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkLCBpc1ZhciwgdG9Db25zdCwgdG9WYXIgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgZ2V0QW5hcGhvcmEgfSBmcm9tIFwiLi4vZW52aXJvL0FuYXBob3JhXCI7XG5pbXBvcnQgeyBBc3ROb2RlLCBBc3RUeXBlLCBBdG9tTm9kZSwgQ29tcG9zaXRlTm9kZSwgTWVtYmVyIH0gZnJvbSBcIi4vYXN0LXR5cGVzXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuXG4vLyBzdGFydCBzaW1wbGUgYnkgYXNzdW1pbmcgaGFyZGNvZGVkIHR5cGVzLCB0aGVuIHRyeSB0byBkZXBlbmQgc29sZWx5IG9uIHJvbGUgKHNlbWFudGljIHJvbGUpXG5cbmV4cG9ydCBpbnRlcmZhY2UgUm9sZXMge1xuICAgIHN1YmplY3Q/OiBJZFxuICAgIG9iamVjdD86IElkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9DbGF1c2VPcHRzIHtcbiAgICByb2xlcz86IFJvbGVzLFxuICAgIGFuYXBob3JhPzogQ2xhdXNlXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b0NsYXVzZShhc3Q6IEFzdE5vZGU8QXN0VHlwZT4sIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgaWYgKGFzdC50eXBlID09ICdub3VucGhyYXNlJykge1xuICAgICAgICByZXR1cm4gbm91blBocmFzZVRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PSAnY29wdWxhc3ViY2xhdXNlJykge1xuICAgICAgICByZXR1cm4gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09ICdjb21wbGVtZW50Jykge1xuICAgICAgICByZXR1cm4gY29tcGxlbWVudFRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PSAnY29wdWxhc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coeyBhc3QgfSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJHthc3QudHlwZX0hYClcblxufVxuXG5hc3luYyBmdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBDb21wb3NpdGVOb2RlPCdjb3B1bGFzZW50ZW5jZSc+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgIGNvbnN0IHN1YmplY3RBc3QgPSBjb3B1bGFTZW50ZW5jZS5saW5rcy5zdWJqZWN0IGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuICAgIGNvbnN0IHByZWRpY2F0ZUFzdCA9IGNvcHVsYVNlbnRlbmNlLmxpbmtzLnByZWRpY2F0ZSBhcyBDb21wb3NpdGVOb2RlPCdub3VucGhyYXNlJz5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiBzdWJqZWN0QXN0LmxpbmtzLnVuaXF1YW50ICE9PSB1bmRlZmluZWQgfSlcbiAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG4gICAgY29uc3Qgc3ViamVjdCA9IGF3YWl0IHRvQ2xhdXNlKHN1YmplY3RBc3QsIG5ld0FyZ3MpXG4gICAgY29uc3QgcHJlZGljYXRlID0gKGF3YWl0IHRvQ2xhdXNlKHByZWRpY2F0ZUFzdCwgbmV3QXJncykpLmNvcHkoeyBuZWdhdGU6ICEhY29wdWxhU2VudGVuY2UubGlua3MubmVnYXRpb24gfSlcbiAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgLnNvbWUoZSA9PiBpc1ZhcihlKSkgP1xuICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICBjb25zdCBtMCA9IHJlc3VsdC5lbnRpdGllcyAvLyBhc3N1bWUgaWRzIGFyZSBjYXNlIGluc2Vuc2l0aXZlLCBhc3N1bWUgaWYgSURYIGlzIHZhciBhbGwgaWR4IGFyZSB2YXJcbiAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIGNvbnN0IGEgPSBnZXRBbmFwaG9yYSgpIC8vIGdldCBhbmFwaG9yYVxuICAgIGF3YWl0IGEuYXNzZXJ0KHN1YmplY3QpXG4gICAgY29uc3QgbTEgPSAoYXdhaXQgYS5xdWVyeShwcmVkaWNhdGUpKVswXSA/PyB7fVxuICAgIGNvbnN0IHJlc3VsdDIgPSByZXN1bHQuY29weSh7IG1hcDogbTAgfSkuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlLCBtYXA6IG0xIH0pXG5cbiAgICBjb25zdCBtMiA9IHJlc3VsdDIuZW50aXRpZXMgLy8gYXNzdW1lIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyaWFibGUgaXMgYWxzbyBhIHZhcmlhYmxlXG4gICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgLmZsYXRNYXAoZSA9PiByZXN1bHQyLm93bmVkQnkoZSkpXG4gICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIHJldHVybiByZXN1bHQyLmNvcHkoeyBtYXA6IG0yIH0pXG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBDb21wb3NpdGVOb2RlPCdjb3B1bGFzdWJjbGF1c2UnPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICBjb25zdCBwcmVkaWNhdGUgPSBjb3B1bGFTdWJDbGF1c2UubGlua3MucHJlZGljYXRlIGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuXG4gICAgcmV0dXJuIChhd2FpdCB0b0NsYXVzZShwcmVkaWNhdGUsIHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogYXJncz8ucm9sZXM/LnN1YmplY3QgfSB9KSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IENvbXBvc2l0ZU5vZGU8J2NvbXBsZW1lbnQnPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGNvbXBsZW1lbnQubGlua3MucHJlcG9zaXRpb24gYXMgQXRvbU5vZGU8J3ByZXBvc2l0aW9uJz5cbiAgICBjb25zdCBub3VuUGhyYXNlID0gY29tcGxlbWVudC5saW5rcy5ub3VucGhyYXNlIGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuXG4gICAgcmV0dXJuIGNsYXVzZU9mKHByZXBvc2l0aW9uLmxleGVtZSwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZChhd2FpdCB0b0NsYXVzZShub3VuUGhyYXNlLCB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IG5ld0lkIH0gfSkpXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG5cbn1cblxuXG5hc3luYyBmdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2Uobm91blBocmFzZTogQ29tcG9zaXRlTm9kZTwnbm91bnBocmFzZSc+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZS5saW5rcy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH07XG5cbiAgICBjb25zdCBhZGplY3RpdmVzOiBBdG9tTm9kZTxMZXhlbWVUeXBlPltdID0gKG5vdW5QaHJhc2U/LmxpbmtzPy5hZGogYXMgYW55KT8ubGlua3MgPz8gW11cbiAgICBjb25zdCBub3VuID0gbm91blBocmFzZS5saW5rcy5ub3VuIGFzIEF0b21Ob2RlPExleGVtZVR5cGU+IHwgdW5kZWZpbmVkXG4gICAgY29uc3QgY29tcGxlbWVudHM6IEF0b21Ob2RlPExleGVtZVR5cGU+W10gPSAobm91blBocmFzZT8ubGlua3M/LmNvbXBsZW1lbnQgYXMgYW55KT8ubGlua3MgPz8gW11cbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlLmxpbmtzLmNvcHVsYXN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5tYXAoYSA9PiBhLmxleGVtZSlcbiAgICAgICAgICAgIC5jb25jYXQobm91bj8ubGV4ZW1lID8gW25vdW4ubGV4ZW1lXSA6IFtdKVxuICAgICAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKHAsIHN1YmplY3RJZCkpXG4gICAgICAgICAgICAucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuYW5kKChhd2FpdCBQcm9taXNlLmFsbChjb21wbGVtZW50cy5tYXAoYyA9PiBjID8gdG9DbGF1c2UoYywgbmV3QXJncykgOiBlbXB0eUNsYXVzZSgpKSkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoc3ViQ2xhdXNlID8gYXdhaXQgdG9DbGF1c2Uoc3ViQ2xhdXNlLCBuZXdBcmdzKSA6IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgcmV0dXJuIHJlc1xufVxuIiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuICAgIHRlc3Q0LFxuICAgIHRlc3Q1LFxuICAgIHRlc3Q2LFxuICAgIHRlc3Q3LFxuICAgIHRlc3Q4LFxuICAgIHRlc3Q5LFxuXVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCB0ZXN0KCkgPyAnc3VjY2VzcycgOiAnZmFpbCcsIHRlc3QubmFtZSlcbiAgICAgICAgYXdhaXQgc2xlZXAoMjAwKVxuICAgICAgICBjbGVhckRvbSgpXG4gICAgfVxuXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3QxKCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geCBpcyByZWQuJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChicmFpbiBhcyBCYXNpY0JyYWluKS5lbnZpcm8udmFsdWVzLmxlbmd0aCA9PT0gMVxuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3kgaXMgYSBidXR0b24uIHggaXMgcmVkLiB5IGlzIGEgZ3JlZW4gYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB6IGlzIGEgYmxhY2sgYnV0dG9uLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSByZWQgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdyZWQnXG4gICAgY29uc3QgYXNzZXJ0MiA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MyA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdhIGJsYWNrIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnYmxhY2snXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MiAmJiBhc3NlcnQzXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3Q0KCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgYnV0dG9uIGlzIGEgYnV0dG9uLicpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2J1dHRvbicpXG4gICAgcmV0dXJuIGJ1dHRvbiAhPT0gdW5kZWZpbmVkXG59XG5cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDUoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGhlIGNvbG9yIG9mIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCcpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3Q2KCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHRoZSBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIHggaXMgZ3JlZW4uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChhd2FpdCBicmFpbi5leGVjdXRlKCd4JykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3Q3KCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgYSBidXR0b24uIHkgaXMgYSBidXR0b24uIHogaXMgYSBidXR0b24uIGV2ZXJ5IGJ1dHRvbiBpcyByZWQuJylcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3gnKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3knKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQzID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3onKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDgoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyBhIGJ1dHRvbi4gdGV4dCBvZiB4IGlzIGNhcHJhLicpXG4gICAgY29uc3QgYXNzZXJ0MSA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdidXR0b24nKSlbMF0udGV4dENvbnRlbnQgPT09ICdjYXByYSdcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0OSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIGEgcmVkIGJ1dHRvbi4geCBpcyBncmVlbi4nKVxuICAgIGNvbnN0IGFzc2VydDEgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgncmVkJykpLmxlbmd0aCA9PT0gMFxuICAgIGNvbnN0IGFzc2VydDIgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnZ3JlZW4nKSkubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDEgJiYgYXNzZXJ0MlxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIHNsZWVwKG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=