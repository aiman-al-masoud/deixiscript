/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __importDefault(__webpack_require__(/*! ./src/main/main */ "./app/src/main/main.ts"));
(0, main_1.default)();


/***/ }),

/***/ "./app/src/backend/eval/evalAst.ts":
/*!*****************************************!*\
  !*** ./app/src/backend/eval/evalAst.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evalMacro = exports.evalAst = void 0;
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const parseNumber_1 = __webpack_require__(/*! ../../utils/parseNumber */ "./app/src/utils/parseNumber.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const InstructionThing_1 = __webpack_require__(/*! ../things/InstructionThing */ "./app/src/backend/things/InstructionThing.ts");
const NumberThing_1 = __webpack_require__(/*! ../things/NumberThing */ "./app/src/backend/things/NumberThing.ts");
const StringThing_1 = __webpack_require__(/*! ../things/StringThing */ "./app/src/backend/things/StringThing.ts");
const Thing_1 = __webpack_require__(/*! ../things/Thing */ "./app/src/backend/things/Thing.ts");
const VerbThing_1 = __webpack_require__(/*! ../things/VerbThing */ "./app/src/backend/things/VerbThing.ts");
function evalAst(context, ast, args = {}) {
    var _a;
    (_a = args.sideEffects) !== null && _a !== void 0 ? _a : (args.sideEffects = couldHaveSideEffects(ast));
    if (args.sideEffects) { // only cache instructions with side effects
        const instruction = new InstructionThing_1.InstructionThing(ast);
        context.set(instruction.getId(), instruction);
        context.setLexeme((0, Lexeme_1.makeLexeme)({ root: 'instruction', type: 'noun', referents: [instruction] }));
    }
    if (ast.type === 'macro') {
        return evalMacro(context, ast);
    }
    else if (ast.type === 'simple-sentence' && ast.verborcopula.type === 'copula') {
        return evalCopulaSentence(context, ast, args);
    }
    else if (ast.type === 'simple-sentence' && ast.verborcopula.type === 'verb') {
        return evalVerbSentence(context, ast, args);
    }
    else if (ast.type === 'complex-sentence') {
        return evalComplexSentence(context, ast, args);
    }
    else if (ast.type === 'noun-phrase') {
        return evalNounPhrase(context, ast, args);
    }
    console.warn(ast);
    throw new Error('evalAst() got unexpected ast type: ' + ast.type);
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    var _a;
    if (args === null || args === void 0 ? void 0 : args.sideEffects) { // assign the right value to the left value
        const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
        const subject = nounPhraseToClause(ast.subject, { subject: subjectId }).simple;
        const rVal = evalAst(context, ast.object, { subject: subjectId });
        const ownerChain = (0, getOwnershipChain_1.getOwnershipChain)(subject);
        const maps = context.query(subject);
        const lexemes = subject.flatList().map(x => x.predicate).filter(x => x);
        const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rVal })));
        if (rVal.every(x => x instanceof InstructionThing_1.InstructionThing)) { // make verb from instructions
            const verb = new VerbThing_1.VerbThing((0, getIncrementalId_1.getIncrementalId)(), rVal);
            context.set(verb.getId(), verb);
            const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: [verb], type: 'verb' })));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            return [verb];
        }
        if (!maps.length && ownerChain.length <= 1) { // lVal is completely new
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (maps.length && ownerChain.length <= 1) { // reassignment
            lexemes.forEach(x => context.removeLexeme(x.root));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (ownerChain.length > 1) { // lVal is property of existing object
            const aboutOwner = about(subject, ownerChain.at(-2));
            const owners = getInterestingIds(context.query(aboutOwner), aboutOwner).map(id => context.get(id)).filter(x => x);
            const owner = owners.at(0);
            const rValClone = rVal.map(x => x.clone({ id: (owner === null || owner === void 0 ? void 0 : owner.getId()) + '.' + x.getId() }));
            const lexemesWithCloneReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rValClone })));
            lexemesWithCloneReferent.forEach(x => context.setLexeme(x));
            rValClone.forEach(x => owner === null || owner === void 0 ? void 0 : owner.set(x.getId(), x));
            return rValClone;
        }
    }
    else { // compare the right and left values
        const subject = evalAst(context, ast.subject, args).at(0);
        const predicate = evalAst(context, ast.object, args).at(0);
        return (subject === null || subject === void 0 ? void 0 : subject.equals(predicate)) && (!ast.negation) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.warn('problem with copula sentence!');
    return [];
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
function evalVerbSentence(context, ast, args) {
    const verb = ast.verborcopula.referents.at(0);
    const subject = ast.subject ? evalAst(context, ast.subject).at(0) : undefined;
    const object = ast.object ? evalAst(context, ast.object).at(0) : undefined;
    // console.log('verb=', verb)
    // console.log('subject=', subject)
    // console.log('object=', object)
    // console.log('complements=', complements)
    if (!verb) {
        throw new Error('no such verb ' + ast.verborcopula.root);
    }
    return verb.run(context, { subject: subject !== null && subject !== void 0 ? subject : context, object: object !== null && object !== void 0 ? object : context });
}
function evalComplexSentence(context, ast, args) {
    if (ast.subconj.root === 'if') {
        if (evalAst(context, ast.condition, Object.assign(Object.assign({}, args), { sideEffects: false })).length) {
            evalAst(context, ast.consequence, Object.assign(Object.assign({}, args), { sideEffects: true }));
        }
    }
    return [];
}
function evalNounPhrase(context, ast, args) {
    var _a, _b, _c, _d, _e;
    const np = nounPhraseToClause(ast, args);
    const maps = context.query(np); // TODO: intra-sentence anaphora resolution
    const interestingIds = getInterestingIds(maps, np);
    let things;
    const andPhrase = ast['and-phrase'] ? evalAst(context, (_a = ast['and-phrase']) === null || _a === void 0 ? void 0 : _a['noun-phrase'], args) : [];
    if (ast.subject.type === 'number-literal') {
        things = andPhrase.concat(evalNumberLiteral(ast.subject));
    }
    else if (ast.subject.type === 'string') {
        things = evalString(context, ast.subject, args).concat(andPhrase);
    }
    else {
        things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x); // TODO sort by id
    }
    if (ast['math-expression']) {
        const left = things;
        const op = ast['math-expression'].operator;
        const right = evalAst(context, (_b = ast['math-expression']) === null || _b === void 0 ? void 0 : _b['noun-phrase']);
        return evalOperation(left, right, op);
    }
    if (isAstPlural(ast) || ast['and-phrase']) { // if universal quantified, I don't care if there's no match
        const limit = (_c = ast['limit-phrase']) === null || _c === void 0 ? void 0 : _c['number-literal'];
        const limitNum = (_e = (_d = evalNumberLiteral(limit).at(0)) === null || _d === void 0 ? void 0 : _d.toJs()) !== null && _e !== void 0 ? _e : things.length;
        return things.slice(0, limitNum);
    }
    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1);
    }
    // or else create and returns the Thing
    return (args === null || args === void 0 ? void 0 : args.autovivification) ? [createThing(np)] : [];
}
function evalNumberLiteral(ast) {
    var _a;
    if (!ast) {
        return [];
    }
    const digits = (_a = ast.digit.list.map(x => x.root)) !== null && _a !== void 0 ? _a : [];
    const literal = digits.reduce((a, b) => a + b, '');
    const z = (0, parseNumber_1.parseNumber)(literal);
    if (z) {
        return [new NumberThing_1.NumberThing(z)];
    }
    return [];
}
function evalOperation(left, right, op) {
    const sums = left.map(x => { var _a; return x.toJs() + ((_a = right.at(0)) === null || _a === void 0 ? void 0 : _a.toJs()); });
    return sums.map(x => new NumberThing_1.NumberThing(x));
}
function nounPhraseToClause(ast, args) {
    var _a, _b, _c;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const adjectives = ((_c = (_b = ast === null || ast === void 0 ? void 0 : ast.adjective) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : []).map(x => x).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    let noun = Clause_1.emptyClause;
    if ((ast === null || ast === void 0 ? void 0 : ast.subject.type) === 'noun' || (ast === null || ast === void 0 ? void 0 : ast.subject.type) === 'pronoun') {
        noun = (0, Clause_1.clauseOf)(ast.subject, subjectId);
    }
    const genitiveComplement = genitiveToClause(ast === null || ast === void 0 ? void 0 : ast.owner, { subject: subjectId, autovivification: false, sideEffects: false });
    const andPhrase = evalAndPhrase(ast === null || ast === void 0 ? void 0 : ast['and-phrase'], args);
    return adjectives.and(noun).and(genitiveComplement).and(andPhrase);
}
function evalAndPhrase(andPhrase, args) {
    if (!andPhrase) {
        return Clause_1.emptyClause;
    }
    return nounPhraseToClause(andPhrase['noun-phrase'] /* TODO! args */); // maybe problem if multiple things have same id, query is not gonna find them
}
function genitiveToClause(ast, args) {
    if (!ast) {
        return Clause_1.emptyClause;
    }
    const ownedId = args === null || args === void 0 ? void 0 : args.subject;
    const ownerId = (0, getIncrementalId_1.getIncrementalId)();
    const owner = nounPhraseToClause(ast.owner, { subject: ownerId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)({ root: 'of', type: 'genitive-particle', referents: [] } /* genitiveParticle */, ownedId, ownerId).and(owner);
}
function isAstPlural(ast) {
    if (!ast) {
        return false;
    }
    if (ast.type === 'noun-phrase') {
        return !!ast.uniquant || Object.values(ast).some(x => isAstPlural(x));
    }
    if (ast.type === 'pronoun' || ast.type === 'noun') {
        return (0, Lexeme_1.isPlural)(ast);
    }
    return false;
}
function getInterestingIds(maps, clause) {
    // const getNumberOfDots = (id: Id) => id.split('.').length //-1
    // the ones with most dots, because 'color of style of button' 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if 'color of button AND button'
    // const ids = maps.flatMap(x => Object.values(x))
    // const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    // return ids.filter(x => getNumberOfDots(x) === maxLen)
    const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause);
    if (oc.length <= 1) {
        return maps.flatMap(x => Object.values(x)); //all
    }
    // TODO: problem not returning everything because of getOwnershipChain()
    return maps.flatMap(m => m[oc.at(-1)]); // owned leaf
}
function createThing(clause) {
    const bases = clause.flatList().map(x => { var _a, _b; return (_b = (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referents) === null || _b === void 0 ? void 0 : _b[0]; }) /* ONLY FIRST? */.filter(x => x);
    const id = (0, getIncrementalId_1.getIncrementalId)();
    return (0, Thing_1.getThing)({ id, bases });
}
function evalString(context, ast, args) {
    if (!ast) {
        return [];
    }
    const x = ast['string-token'].list.map(x => x.token);
    const y = x.join(' ');
    return [new StringThing_1.StringThing(y)];
}
function couldHaveSideEffects(ast) {
    if (ast.type === 'macro') { // this is not ok, it's here just for performance reasons (saving all of the macros is currently expensive) 
        return false;
    }
    return !!(ast.type === 'simple-sentence' || ast.type === 'complex-sentence');
}
function evalMacro(context, macro) {
    var _a;
    const macroparts = (_a = macro.macropart.list) !== null && _a !== void 0 ? _a : [];
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = macro.subject.root;
    if (!name) {
        throw new Error('Anonymous syntax!');
    }
    context.setSyntax(name, syntax);
    return [];
}
exports.evalMacro = evalMacro;
function macroPartToMember(macroPart) {
    var _a, _b, _c, _d, _e, _f, _g;
    const taggedUnions = (_b = (_a = macroPart === null || macroPart === void 0 ? void 0 : macroPart.taggedunion) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0 ? _b : [];
    const grammars = taggedUnions.map(x => x === null || x === void 0 ? void 0 : x.noun);
    const exceptUnions = (_e = (_d = (_c = macroPart === null || macroPart === void 0 ? void 0 : macroPart.exceptunion) === null || _c === void 0 ? void 0 : _c.taggedunion) === null || _d === void 0 ? void 0 : _d.list) !== null && _e !== void 0 ? _e : [];
    const notGrammars = exceptUnions.map(x => x === null || x === void 0 ? void 0 : x.noun);
    return {
        types: grammars.flatMap(g => { var _a; return (_a = g === null || g === void 0 ? void 0 : g.root) !== null && _a !== void 0 ? _a : []; }),
        role: (_f = macroPart["grammar-role"]) === null || _f === void 0 ? void 0 : _f.root,
        number: (_g = macroPart.cardinality) === null || _g === void 0 ? void 0 : _g.cardinality,
        exceptTypes: notGrammars.flatMap(g => { var _a; return (_a = g === null || g === void 0 ? void 0 : g.root) !== null && _a !== void 0 ? _a : []; }),
        notAst: !!macroPart['not-ast-keyword'],
        expand: !!macroPart['expand-keyword'],
    };
}


/***/ }),

/***/ "./app/src/backend/things/BaseThing.ts":
/*!*********************************************!*\
  !*** ./app/src/backend/things/BaseThing.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseThing = void 0;
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Clause_1 = __webpack_require__(/*! ../../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
class BaseThing {
    constructor(id, bases = [], children = {}, lexemes = []) {
        this.id = id;
        this.bases = bases;
        this.children = children;
        this.lexemes = lexemes;
        this.extends = (thing) => {
            this.unextends(thing); // or avoid?
            this.bases.push(thing.clone());
        };
        this.get = (id) => {
            var _a;
            const parts = id.split('.');
            const p1 = parts[0];
            const child = (_a = this.children[p1]) !== null && _a !== void 0 ? _a : this.children[id];
            const res = /* parts.length > 1 */ child.getId() !== id ? child.get(id /* parts.slice(1).join('.') */) : child;
            return res !== null && res !== void 0 ? res : this.bases.find(x => x.get(id));
        };
        this.toClause = (query) => {
            const x = this.lexemes
                .flatMap(x => x.referents.map(r => (0, Clause_1.clauseOf)(x, r.getId())))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const y = Object
                .keys(this.children)
                .map(x => (0, Clause_1.clauseOf)({ root: 'of', type: 'preposition', referents: [] }, x, this.id)) // hardcoded english!
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const z = Object
                .values(this.children)
                .map(x => x.toClause(query))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            return x.and(y).and(z).simple;
        };
        this.setLexeme = (lexeme) => {
            const old = this.lexemes.filter(x => x.root === lexeme.root);
            const updated = old.map(x => (Object.assign(Object.assign(Object.assign({}, x), lexeme), { referents: [...x.referents, ...lexeme.referents] })));
            this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root);
            const toBeAdded = updated.length ? updated : [lexeme];
            this.lexemes.push(...toBeAdded);
            const extrapolated = toBeAdded.flatMap(x => (0, Lexeme_1.extrapolate)(x, this));
            this.lexemes.push(...extrapolated);
        };
        this.getLexemes = (rootOrToken) => {
            return this.lexemes
                .filter(x => rootOrToken === x.token || rootOrToken === x.root);
        };
    }
    getId() {
        return this.id;
    }
    clone(opts) {
        var _a;
        return new BaseThing((_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id, // clones have same id
        this.bases.map(x => x.clone()), Object.entries(this.children).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
    }
    unextends(thing) {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId());
    }
    set(id, thing) {
        this.children[id] = thing;
        this.setLexeme({ root: 'thing', type: 'noun', referents: [thing] }); // every thing is a thing
        //TODO
        if (typeof thing.toJs() === 'string') { //TODO make this polymorphic
            this.setLexeme({ root: 'string', type: 'noun', referents: [thing] });
        }
        else if (typeof thing.toJs() === 'number') {
            this.setLexeme({ root: 'number', type: 'noun', referents: [thing] });
        }
    }
    toJs() {
        return this; //TODOooooooooOO!
    }
    query(query) {
        return (0, uniq_1.uniq)(this.toClause(query).query(query, { /* it: this.lastReferenced  */}));
    }
    removeLexeme(rootOrToken) {
        const garbage = this.getLexemes(rootOrToken).flatMap(x => x.referents);
        garbage.forEach(x => delete this.children[x.getId()]);
        this.lexemes = this.lexemes.filter(x => rootOrToken !== x.token && rootOrToken !== x.root);
    }
    equals(other) {
        return this.toJs() === (other === null || other === void 0 ? void 0 : other.toJs());
    }
}
exports.BaseThing = BaseThing;


/***/ }),

/***/ "./app/src/backend/things/BasicContext.ts":
/*!************************************************!*\
  !*** ./app/src/backend/things/BasicContext.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicContext = void 0;
const Config_1 = __webpack_require__(/*! ../../config/Config */ "./app/src/config/Config.ts");
const Lexeme_1 = __webpack_require__(/*! ../../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../../frontend/parser/maxPrecedence */ "./app/src/frontend/parser/maxPrecedence.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
class BasicContext extends BaseThing_1.BaseThing {
    constructor(id, config = (0, Config_1.getConfig)(), staticDescPrecedence = config.staticDescPrecedence, syntaxMap = config.syntaxes, lexemes = config.lexemes.flatMap(l => [l, ...(0, Lexeme_1.extrapolate)(l)]), bases = [], children = {}) {
        super(id, bases, children, lexemes);
        this.id = id;
        this.config = config;
        this.staticDescPrecedence = staticDescPrecedence;
        this.syntaxMap = syntaxMap;
        this.lexemes = lexemes;
        this.bases = bases;
        this.children = children;
        this.syntaxList = this.refreshSyntaxList();
        this.setSyntax = (name, syntax) => {
            this.setLexeme((0, Lexeme_1.makeLexeme)({ type: 'noun', root: name, referents: [] }));
            this.syntaxMap[name] = syntax;
            this.syntaxList = this.refreshSyntaxList();
        };
        this.getSyntax = (name) => {
            return this.syntaxMap[name];
        };
        this.astTypes.forEach(g => {
            this.setLexeme((0, Lexeme_1.makeLexeme)({
                root: g,
                type: 'noun',
                referents: [],
            }));
        });
    }
    getLexemeTypes() {
        return this.config.lexemeTypes;
    }
    getPrelude() {
        return this.config.prelude;
    }
    refreshSyntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.config.staticDescPrecedence.concat(z);
    }
    getSyntaxList() {
        return this.syntaxList;
    }
    get astTypes() {
        const res = this.config.lexemeTypes.slice(); //copy!
        res.push(...this.staticDescPrecedence);
        return res;
    }
    clone() {
        return new BasicContext(this.id, this.config, this.staticDescPrecedence, this.syntaxMap, this.lexemes, this.bases, this.children);
    }
}
exports.BasicContext = BasicContext;


/***/ }),

/***/ "./app/src/backend/things/Context.ts":
/*!*******************************************!*\
  !*** ./app/src/backend/things/Context.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContext = void 0;
const BasicContext_1 = __webpack_require__(/*! ./BasicContext */ "./app/src/backend/things/BasicContext.ts");
function getContext(opts) {
    return new BasicContext_1.BasicContext(opts.id);
}
exports.getContext = getContext;


/***/ }),

/***/ "./app/src/backend/things/InstructionThing.ts":
/*!****************************************************!*\
  !*** ./app/src/backend/things/InstructionThing.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstructionThing = void 0;
const getIncrementalId_1 = __webpack_require__(/*! ../../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
class InstructionThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super((0, getIncrementalId_1.getIncrementalId)());
        this.value = value;
    }
    toJs() {
        return this.value;
    }
}
exports.InstructionThing = InstructionThing;


/***/ }),

/***/ "./app/src/backend/things/NumberThing.ts":
/*!***********************************************!*\
  !*** ./app/src/backend/things/NumberThing.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
class NumberThing extends BaseThing_1.BaseThing {
    constructor(value, id = value + '') {
        super(id);
        this.value = value;
    }
    toJs() {
        return this.value;
    }
    clone(opts) {
        return new NumberThing(this.value, opts === null || opts === void 0 ? void 0 : opts.id);
    }
}
exports.NumberThing = NumberThing;


/***/ }),

/***/ "./app/src/backend/things/StringThing.ts":
/*!***********************************************!*\
  !*** ./app/src/backend/things/StringThing.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
class StringThing extends BaseThing_1.BaseThing {
    constructor(value, id = value) {
        super(id);
        this.value = value;
    }
    toJs() {
        return this.value;
    }
    clone(opts) {
        return new StringThing(this.value, opts === null || opts === void 0 ? void 0 : opts.id);
    }
}
exports.StringThing = StringThing;


/***/ }),

/***/ "./app/src/backend/things/Thing.ts":
/*!*****************************************!*\
  !*** ./app/src/backend/things/Thing.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
function getThing(args) {
    return new BaseThing_1.BaseThing(args.id, args.bases);
}
exports.getThing = getThing;


/***/ }),

/***/ "./app/src/backend/things/VerbThing.ts":
/*!*********************************************!*\
  !*** ./app/src/backend/things/VerbThing.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logVerb = exports.VerbThing = void 0;
const evalAst_1 = __webpack_require__(/*! ../eval/evalAst */ "./app/src/backend/eval/evalAst.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/things/BaseThing.ts");
class VerbThing extends BaseThing_1.BaseThing {
    constructor(id, instructions) {
        super(id);
        this.id = id;
        this.instructions = instructions;
    }
    run(context, args) {
        const clonedContext = context.clone();
        // inject args, remove harcoded english!
        //TOO I guess setting context on context subject results in an inf loop/max too much recursion error
        // clonedContext.set(args.subject.getId(), args.subject)
        clonedContext.set(args.object.getId(), args.object);
        clonedContext.setLexeme({ root: 'subject', type: 'adjective', referents: [args.subject] });
        clonedContext.setLexeme({ root: 'object', type: 'adjective', referents: [args.object] });
        let results = [];
        this.instructions.forEach(istruction => {
            results = (0, evalAst_1.evalAst)(clonedContext, istruction.value);
        });
        return results;
    }
}
exports.VerbThing = VerbThing;
// x is "ciao"
// y is "mondo"
// you log x and y
// you log "capra!"
// stupidize is the previous "2" instructions
// you stupidize
exports.logVerb = new (class extends VerbThing {
    run(context, args) {
        console.log(args.object.toJs());
        return [];
    }
})('log', []);


/***/ }),

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
const prelude_1 = __webpack_require__(/*! ./prelude */ "./app/src/config/prelude.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
function getConfig() {
    return {
        lexemeTypes: LexemeType_1.lexemeTypes,
        lexemes: lexemes_1.lexemes,
        syntaxes: syntaxes_1.syntaxes,
        prelude: prelude_1.prelude,
        staticDescPrecedence: syntaxes_1.staticDescPrecedence,
        // things,
    };
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
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('any-lexeme', 'adjective', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'verb', 'negation', 'existquant', 'uniquant', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'nonsubconj', // and
'disjunc', // or
'pronoun', 'quote', 'makro-keyword', 'except-keyword', 'then-keyword', 'end-keyword', 'genitive-particle', 'dative-particle', 'ablative-particle', 'locative-particle', 'instrumental-particle', 'comitative-particle', 'next-keyword', 'previous-keyword', 'plus-operator', 'digit', 'cardinality', 'grammar-role', 'not-ast-keyword', 'expand-keyword');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    { root: 'be', type: 'copula', referents: [] },
    { root: 'be', type: 'copula', token: 'is', cardinality: 1, referents: [] },
    { root: 'be', type: 'copula', token: '=', cardinality: '*', referents: [] },
    { root: 'be', type: 'copula', token: 'are', cardinality: '*', referents: [] },
    { root: 'do', type: 'hverb', referents: [] },
    { root: 'do', type: 'hverb', token: 'does', cardinality: 1, referents: [] },
    { root: 'have', type: 'verb', referents: [] },
    { root: 'not', type: 'negation', referents: [] },
    // logical roles of a constituent to abstract away word order
    { root: 'subject', type: 'grammar-role', referents: [] },
    { root: 'predicate', type: 'grammar-role', referents: [] },
    { root: 'object', type: 'grammar-role', referents: [] },
    { root: 'condition', type: 'grammar-role', referents: [] },
    { root: 'consequence', type: 'grammar-role', referents: [] },
    { root: 'owner', type: 'grammar-role', referents: [] },
    { root: 'receiver', type: 'grammar-role', referents: [] },
    { root: 'origin', type: 'grammar-role', referents: [] },
    { root: 'location', type: 'grammar-role', referents: [] },
    { root: 'instrument', type: 'grammar-role', referents: [] },
    { root: 'companion', type: 'grammar-role', referents: [] },
    { root: 'string-token', type: 'grammar-role', referents: [] },
    { root: 'operator', type: 'grammar-role', referents: [] },
    { root: 'verborcopula', type: 'grammar-role', referents: [] },
    // number of times a constituent can appear
    { root: 'optional', type: 'cardinality', cardinality: '1|0', referents: [] },
    { root: 'one-or-more', type: 'cardinality', cardinality: '+', referents: [] },
    { root: 'zero-or-more', type: 'cardinality', cardinality: '*', referents: [] },
    // for use in a part of noun-phrase
    { root: 'next', type: 'next-keyword', referents: [] },
    { root: 'previous', type: 'previous-keyword', referents: [] },
    { root: 'or', type: 'disjunc', referents: [] },
    { root: 'and', type: 'nonsubconj', referents: [] },
    { root: 'a', type: 'indefart', referents: [] },
    { root: 'an', type: 'indefart', referents: [] },
    { root: 'the', type: 'defart', referents: [] },
    { root: 'if', type: 'subconj', referents: [] },
    { root: 'when', type: 'subconj', referents: [] },
    { root: 'every', type: 'uniquant', referents: [] },
    { root: 'any', type: 'uniquant', referents: [] },
    { root: 'that', type: 'relpron', referents: [] },
    { root: 'it', type: 'pronoun', referents: [] },
    { root: '"', type: 'quote', referents: [] },
    { root: '.', type: 'fullstop', referents: [] },
    { root: 'then', type: 'then-keyword', referents: [] },
    { root: 'except', type: 'except-keyword', referents: [] },
    { root: 'makro', type: 'makro-keyword', referents: [] },
    { root: 'end', type: 'end-keyword', referents: [] },
    { root: 'of', type: 'genitive-particle', referents: [] },
    { root: 'to', type: 'dative-particle', referents: [] },
    { root: 'from', type: 'ablative-particle', referents: [] },
    { root: 'on', type: 'locative-particle', referents: [] },
    { root: 'in', type: 'locative-particle', referents: [] },
    { root: 'at', type: 'locative-particle', referents: [] },
    { root: 'by', type: 'instrumental-particle', referents: [] },
    { root: 'with', type: 'comitative-particle', referents: [] },
    { root: '+', type: 'plus-operator', referents: [] },
    { root: '0', type: 'digit', referents: [] },
    { root: '1', type: 'digit', referents: [] },
    { root: '2', type: 'digit', referents: [] },
    { root: '3', type: 'digit', referents: [] },
    { root: '4', type: 'digit', referents: [] },
    { root: '5', type: 'digit', referents: [] },
    { root: '6', type: 'digit', referents: [] },
    { root: '7', type: 'digit', referents: [] },
    { root: '8', type: 'digit', referents: [] },
    { root: '9', type: 'digit', referents: [] },
    { root: 'not-ast', type: 'not-ast-keyword', referents: [] },
    { root: 'expand', type: 'expand-keyword', referents: [] },
];


/***/ }),

/***/ "./app/src/config/prelude.ts":
/*!***********************************!*\
  !*** ./app/src/config/prelude.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prelude = void 0;
exports.prelude = ` 
  makro
    genitive is not-ast genitive-particle then owner noun-phrase
  end.

  makro
    dative is not-ast dative-particle then receiver noun-phrase
  end.

  makro
    ablative is not-ast ablative-particle then origin noun-phrase
  end.

  makro
    locative is not-ast locative-particle then location noun-phrase
  end.

  makro
    instrumental is not-ast instrumental-particle then instrument noun-phrase
  end.

  makro
    comitative is not-ast comitative-particle then companion noun-phrase
  end.
  
  makro
    and-phrase is nonsubconj then noun-phrase
  end.

  makro
    limit-phrase is next-keyword or previous-keyword then optional number-literal
  end.

  makro
    math-expression is operator plus-operator then noun-phrase
  end.

  makro 
    noun-phrase is 
    optional uniquant
    then optional existquant
    then optional indefart
    then optional defart
    then zero-or-more adjectives
    then optional limit-phrase 
    then subject noun or pronoun or string or number-literal
    then optional math-expression
    then optional subordinate-clause
    then expand optional genitive
    then optional and-phrase
  end.

  makro 
    simple-sentence is 
    optional subject noun-phrase 
    then not-ast optional hverb 
    then optional negation 
    then verborcopula verb or copula 
    then optional negation 
    then optional object noun-phrase
    then expand zero-or-more dative or ablative or locative or instrumental or comitative
  end.

  makro 
    complex-sentence-one is 
    subconj 
    then condition simple-sentence 
    then not-ast then-keyword
    then consequence simple-sentence
  end.

  makro 
    complex-sentence-two is 
    consequence simple-sentence 
    then subconj 
    then condition simple-sentence
  end.

  makro 
    complex-sentence is expand complex-sentence-one or complex-sentence-two
  end.

  makro 
    string is 
    not-ast quote 
    then one-or-more string-token any-lexeme except quote 
    then not-ast quote 
  end.

  makro
    number-literal is one-or-more digits
  end.

  `;


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.staticDescPrecedence = exports.constituentTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion', 'exceptunion', 'noun-phrase', 'and-phrase', 'limit-phrase', 'math-expression', 'complex-sentence', 'subordinate-clause', 'string', 'number-literal', 'simple-sentence');
exports.staticDescPrecedence = ['macro'];
exports.syntaxes = {
    'macro': [
        { types: ['makro-keyword'], number: 1 },
        { types: ['noun'], number: 1, role: 'subject' },
        { types: ['copula'], number: 1 },
        { types: ['macropart'], number: '+' },
        { types: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { types: ['expand-keyword'], number: '1|0' },
        { types: ['not-ast-keyword'], number: '1|0' },
        { types: ['cardinality'], number: '1|0' },
        { types: ['grammar-role'], number: '1|0' },
        { types: ['taggedunion'], number: '+' },
        { types: ['exceptunion'], number: '1|0' },
        { types: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { types: ['noun'], number: 1 },
        { types: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { types: ['except-keyword'], number: 1 },
        { types: ['taggedunion'], number: '+' },
    ],
    'number-literal': [],
    'noun-phrase': [],
    'and-phrase': [],
    'limit-phrase': [],
    'math-expression': [],
    'simple-sentence': [],
    'string': [],
    'complex-sentence': [],
    'subordinate-clause': [],
};


/***/ }),

/***/ "./app/src/draw-ast/AstCanvas.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/AstCanvas.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstCanvas = void 0;
const plotAst_1 = __webpack_require__(/*! ./plotAst */ "./app/src/draw-ast/plotAst.ts");
class AstCanvas {
    constructor() {
        this.div = document.createElement('div');
        this.canvas = document.createElement('canvas');
        this.cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.replot = () => {
            window.requestAnimationFrame(() => {
                var _a, _b, _c;
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.translate(window.innerWidth / 2, window.innerHeight / 2);
                (_b = this.context) === null || _b === void 0 ? void 0 : _b.translate(-window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y);
                (_c = this.context) === null || _c === void 0 ? void 0 : _c.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (!this.context) {
                    throw new Error('Canvas context is undefined!');
                }
                if (!this.ast) {
                    throw new Error('Ast is is undefined!');
                }
                (0, plotAst_1.plotAst)(this.context, this.ast);
            });
        };
        this.div.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', e => {
            this.isDragging = true;
            this.dragStart.x = e.x - this.cameraOffset.x;
            this.dragStart.y = e.y - this.cameraOffset.y;
        });
        this.canvas.addEventListener('mouseup', e => this.isDragging = false);
        this.canvas.addEventListener('mousemove', e => {
            if (this.isDragging) {
                this.cameraOffset.x = e.clientX - this.dragStart.x;
                this.cameraOffset.y = e.clientY - this.dragStart.y;
                this.replot();
            }
        });
    }
    onUpdate(ast, results) {
        this.ast = ast;
        this.replot();
    }
}
exports.AstCanvas = AstCanvas;


/***/ }),

/***/ "./app/src/draw-ast/astToEdgeList.ts":
/*!*******************************************!*\
  !*** ./app/src/draw-ast/astToEdgeList.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.astToEdgeList = void 0;
function astToEdgeList(ast, parentName, edges = []) {
    var _a, _b;
    const links = Object.entries(ast).filter(e => e[1] && e[1].type);
    const astName = ((_a = ast.root) !== null && _a !== void 0 ? _a : ast.type) + random();
    const additions = [];
    if (parentName) {
        additions.push([parentName, astName]);
    }
    if (!links.length && !ast.list) { // leaf!
        return [...edges, ...additions];
    }
    if (links.length) {
        return links
            .flatMap(e => {
            const ezero = e[0] + random();
            return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)];
        });
    }
    if (ast.list) {
        const list = (_b = ast.list) === null || _b === void 0 ? void 0 : _b.flatMap(x => astToEdgeList(x, astName, edges));
        return [...additions, ...edges, ...list !== null && list !== void 0 ? list : []];
    }
    return [];
}
exports.astToEdgeList = astToEdgeList;
function random() {
    return parseInt(100000 * Math.random() + '');
}


/***/ }),

/***/ "./app/src/draw-ast/drawLine.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawLine.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawLine = void 0;
function drawLine(context, from, to) {
    context.beginPath();
    // context.strokeStyle = fromNode.strokeStyle
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}
exports.drawLine = drawLine;


/***/ }),

/***/ "./app/src/draw-ast/drawNode.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawNode.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawNode = void 0;
function drawNode(context, node) {
    context.beginPath();
    context.fillStyle = node.fillStyle;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    context.strokeStyle = node.strokeStyle;
    context.fillStyle = node.fillStyle;
    context.stroke();
    context.fill();
    context.fillStyle = "#FF0000";
    context.font = "10px Arial"; //20px
    const textOffset = 10 * node.label.length / 2; //some magic in here!
    context.fillText(node.label, node.x - textOffset, node.y);
}
exports.drawNode = drawNode;


/***/ }),

/***/ "./app/src/draw-ast/getCoords.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/getCoords.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCoords = void 0;
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
function getCoords(initialPos, data, oldCoords = {}, nestingFactor = 1) {
    var _a;
    const root = getRoot(data); // node w/out a parent
    if (!root) {
        return oldCoords;
    }
    const children = getChildrenOf(root, data);
    const rootPos = (_a = oldCoords[root]) !== null && _a !== void 0 ? _a : initialPos;
    const yOffset = 50;
    const xOffset = 200;
    const childCoords = children
        .map((c, i) => ({ [c]: { x: rootPos.x + i * nestingFactor * xOffset * (i % 2 == 0 ? 1 : -1), y: rootPos.y + yOffset * (nestingFactor + 1) } }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    const remainingData = data.filter(x => !x.includes(root));
    const partialResult = Object.assign(Object.assign(Object.assign({}, oldCoords), childCoords), { [root]: rootPos });
    return getCoords(initialPos, remainingData, partialResult, 0.9 * nestingFactor);
}
exports.getCoords = getCoords;
function getRoot(edges) {
    return edges
        .flat() // the nodes
        .filter(n => !edges.some(e => e[1] === n))[0];
}
function getChildrenOf(parent, edges) {
    return (0, uniq_1.uniq)(edges.filter(x => x[0] === parent).map(x => x[1])); //TODO duplicate children aren't plotted twice, but still make the graph uglier because they add "i" indeces in childCoords computation and make single child display NOT straight down.
}


/***/ }),

/***/ "./app/src/draw-ast/plotAst.ts":
/*!*************************************!*\
  !*** ./app/src/draw-ast/plotAst.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.plotAst = void 0;
const astToEdgeList_1 = __webpack_require__(/*! ./astToEdgeList */ "./app/src/draw-ast/astToEdgeList.ts");
const drawLine_1 = __webpack_require__(/*! ./drawLine */ "./app/src/draw-ast/drawLine.ts");
const drawNode_1 = __webpack_require__(/*! ./drawNode */ "./app/src/draw-ast/drawNode.ts");
const getCoords_1 = __webpack_require__(/*! ./getCoords */ "./app/src/draw-ast/getCoords.ts");
function plotAst(context, ast) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const rect = context.canvas.getBoundingClientRect();
    const edges = (0, astToEdgeList_1.astToEdgeList)(ast);
    const coords = (0, getCoords_1.getCoords)({ x: rect.x - rect.width / 2, y: rect.y }, edges);
    Object.entries(coords).forEach(c => {
        const name = c[0];
        const pos = c[1];
        (0, drawNode_1.drawNode)(context, {
            x: pos.x,
            y: pos.y,
            radius: 2,
            fillStyle: '#22cccc',
            strokeStyle: '#009999',
            label: name.replaceAll(/\d+/g, '')
        });
    });
    edges.forEach(e => {
        const from = coords[e[0]];
        const to = coords[e[1]];
        if (from && to) {
            (0, drawLine_1.drawLine)(context, from, to);
        }
    });
}
exports.plotAst = plotAst;


/***/ }),

/***/ "./app/src/facade/BasicBrain.ts":
/*!**************************************!*\
  !*** ./app/src/facade/BasicBrain.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Parser_1 = __webpack_require__(/*! ../frontend/parser/interfaces/Parser */ "./app/src/frontend/parser/interfaces/Parser.ts");
const evalAst_1 = __webpack_require__(/*! ../backend/eval/evalAst */ "./app/src/backend/eval/evalAst.ts");
const Context_1 = __webpack_require__(/*! ../backend/things/Context */ "./app/src/backend/things/Context.ts");
const VerbThing_1 = __webpack_require__(/*! ../backend/things/VerbThing */ "./app/src/backend/things/VerbThing.ts");
class BasicBrain {
    constructor() {
        this.context = (0, Context_1.getContext)({ id: 'global' });
        this.listeners = [];
        this.execute(this.context.getPrelude());
        this.context.set(VerbThing_1.logVerb.getId(), VerbThing_1.logVerb);
        this.context.setLexeme({ root: 'log', type: 'verb', referents: [VerbThing_1.logVerb] });
    }
    execute(natlang) {
        return natlang.split('.').flatMap(x => {
            return (0, Parser_1.getParser)(x, this.context).parseAll().flatMap(ast => {
                let results = [];
                try {
                    results = (0, evalAst_1.evalAst)(this.context, ast);
                }
                catch (e) {
                    console.warn(e);
                }
                this.listeners.forEach(l => {
                    l.onUpdate(ast, results);
                });
                return results;
            });
        });
    }
    executeUnwrapped(natlang) {
        return this.execute(natlang).map(x => x.toJs());
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/facade/Brain.ts":
/*!*********************************!*\
  !*** ./app/src/facade/Brain.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/facade/BasicBrain.ts"));
function getBrain() {
    return new BasicBrain_1.default();
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/frontend/lexer/EagerLexer.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/EagerLexer.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.tokens = [];
        this._pos = 0;
        this.words =
            spaceOut(sourceCode, ['"', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
                .trim()
                .split(/\s+/);
        this.refreshTokens();
    }
    refreshTokens() {
        this.tokens = this.words.map(w => { var _a; return (_a = this.context.getLexemes(w).at(0)) !== null && _a !== void 0 ? _a : (0, Lexeme_1.makeLexeme)({ root: w, token: w, type: 'noun', referents: [] }); });
    }
    next() {
        this.refreshTokens();
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
function spaceOut(sourceCode, specialChars) {
    return sourceCode
        .split('')
        .reduce((a, c) => a + (specialChars.includes(c) ? ' ' + c + ' ' : c), '');
}


/***/ }),

/***/ "./app/src/frontend/lexer/Lexeme.ts":
/*!******************************************!*\
  !*** ./app/src/frontend/lexer/Lexeme.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extrapolate = exports.isPlural = exports.makeLexeme = void 0;
const Cardinality_1 = __webpack_require__(/*! ../parser/interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const pluralize_1 = __webpack_require__(/*! ./functions/pluralize */ "./app/src/frontend/lexer/functions/pluralize.ts");
const conjugate_1 = __webpack_require__(/*! ./functions/conjugate */ "./app/src/frontend/lexer/functions/conjugate.ts");
function makeLexeme(data) {
    return data;
}
exports.makeLexeme = makeLexeme;
function isPlural(lexeme) {
    return (0, Cardinality_1.isRepeatable)(lexeme.cardinality);
}
exports.isPlural = isPlural;
function extrapolate(lexeme, context) {
    if (lexeme.type === 'noun' && !isPlural(lexeme)) {
        return [makeLexeme({
                root: lexeme.root,
                type: lexeme.type,
                token: (0, pluralize_1.pluralize)(lexeme.root),
                cardinality: '*',
                referents: lexeme.referents
            })];
    }
    if (lexeme.type === 'verb') {
        return (0, conjugate_1.conjugate)(lexeme.root).map(x => makeLexeme({
            root: lexeme.root,
            type: lexeme.type,
            token: x,
            referents: lexeme.referents
        }));
    }
    return [];
}
exports.extrapolate = extrapolate;


/***/ }),

/***/ "./app/src/frontend/lexer/Lexer.ts":
/*!*****************************************!*\
  !*** ./app/src/frontend/lexer/Lexer.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexer = void 0;
const EagerLexer_1 = __importDefault(__webpack_require__(/*! ./EagerLexer */ "./app/src/frontend/lexer/EagerLexer.ts"));
function getLexer(sourceCode, context) {
    return new EagerLexer_1.default(sourceCode, context);
}
exports.getLexer = getLexer;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/conjugate.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/conjugate.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.conjugate = void 0;
function conjugate(verb) {
    return [verb + 's'];
}
exports.conjugate = conjugate;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/pluralize.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/pluralize.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pluralize = void 0;
function pluralize(root) {
    return root + 's';
}
exports.pluralize = pluralize;


/***/ }),

/***/ "./app/src/frontend/parser/KoolParser.ts":
/*!***********************************************!*\
  !*** ./app/src/frontend/parser/KoolParser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const Cardinality_1 = __webpack_require__(/*! ./interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/frontend/lexer/Lexer.ts");
class KoolParser {
    constructor(sourceCode, context, lexer = (0, Lexer_1.getLexer)(sourceCode, context)) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.lexer = lexer;
        this.knownParse = (name) => {
            const syntax = this.context.getSyntax(name);
            // if the syntax is an "unofficial" AST, aka a CST, get the name of the 
            // actual AST and pass it down to parse composite
            if (this.isLeaf(name)) {
                return this.parseLeaf(name);
            }
            else {
                return this.parseComposite(name, syntax);
            }
        };
        this.parseLeaf = (name) => {
            if (name === this.lexer.peek.type || name === 'any-lexeme') {
                const x = this.lexer.peek;
                this.lexer.next();
                return x;
            }
        };
        this.parseComposite = (name, syntax) => {
            var _a;
            const links = {};
            for (const m of syntax) {
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
            return Object.assign({ type: name }, links); // TODO!
        };
        this.parseMember = (m) => {
            const list = []; // TODO!
            while (!this.lexer.isEnd) {
                if (!(0, Cardinality_1.isRepeatable)(m.number) && list.length >= 1) {
                    break;
                }
                const x = this.tryParse(m.types, m.exceptTypes);
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
                list: list,
                notAst: m.notAst,
                expand: m.expand,
            }) : Object.assign(Object.assign({}, list[0]), { notAst: m.notAst, expand: m.expand });
        };
        this.isLeaf = (t) => {
            return this.context.getLexemeTypes().includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const cst = this.tryParse(this.context.getSyntaxList());
            if (!cst) {
                break;
            }
            const ast = this.simplify(cst);
            results.push(ast);
            if (((_a = this.lexer.peek) === null || _a === void 0 ? void 0 : _a.type) === 'fullstop') {
                this.lexer.next();
            }
        }
        return results;
    }
    tryParse(types, exceptTypes) {
        for (const t of types) {
            const memento = this.lexer.pos;
            const x = this.knownParse(t);
            if (x && !(exceptTypes === null || exceptTypes === void 0 ? void 0 : exceptTypes.includes(x.type))) {
                return x;
            }
            this.lexer.backTo(memento);
        }
    }
    simplify(cst) {
        if (cst.type === 'macro') {
            return cst;
        }
        if (this.isLeaf(cst.type)) {
            return cst;
        }
        const type = cst.type;
        const links = linksOf(cst);
        console.log(type, 'links=', links);
        const expanded = links.flatMap(e => e[1].expand ? linksOf(e[1]) : [e]);
        console.log(type, 'expanded=', expanded);
        const simplified = expanded.map(e => [e[0], this.simplify(e[1])]);
        console.log(type, 'simplified=', simplified);
        const astLinks = simplified.filter(e => !e[1].notAst);
        console.log(type, 'astLinks=', astLinks);
        const ast = Object.fromEntries(astLinks);
        console.log(type, 'ast=', ast);
        const astWithType = Object.assign(Object.assign({}, ast), { type });
        console.log(type, 'astWithType=', astWithType);
        return astWithType;
    }
}
exports.KoolParser = KoolParser;
function linksOf(cst) {
    const list = cst.list;
    if (list) {
        const flattened = list.flatMap(x => linksOf(x));
        console.log('trying to expand list!', list, flattened);
        return flattened;
    }
    return Object.entries(cst).filter(e => e[1] && e[1].type);
}


/***/ }),

/***/ "./app/src/frontend/parser/interfaces/Cardinality.ts":
/*!***********************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Cardinality.ts ***!
  \***********************************************************/
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

/***/ "./app/src/frontend/parser/interfaces/Parser.ts":
/*!******************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Parser.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const KoolParser_1 = __webpack_require__(/*! ../KoolParser */ "./app/src/frontend/parser/KoolParser.ts");
function getParser(sourceCode, context) {
    return new KoolParser_1.KoolParser(sourceCode, context);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/frontend/parser/maxPrecedence.ts":
/*!**************************************************!*\
  !*** ./app/src/frontend/parser/maxPrecedence.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dependencies = exports.maxPrecedence = void 0;
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
    return members.flatMap(m => m.types).flatMap(t => {
        if (visited.includes(t)) {
            return [];
        }
        else {
            return [...visited, ...dependencies(t, syntaxes, [...visited, t])];
        }
    });
}
exports.dependencies = dependencies;
const lenCompare = (a, b, syntaxes) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length;
};


/***/ }),

/***/ "./app/src/main/main.ts":
/*!******************************!*\
  !*** ./app/src/main/main.ts ***!
  \******************************/
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
const runTests_1 = __webpack_require__(/*! ../../tests/runTests */ "./app/tests/runTests.ts");
const AstCanvas_1 = __webpack_require__(/*! ../draw-ast/AstCanvas */ "./app/src/draw-ast/AstCanvas.ts");
const Brain_1 = __webpack_require__(/*! ../facade/Brain */ "./app/src/facade/Brain.ts");
function main() {
    const brain = (0, Brain_1.getBrain)();
    window.brain = brain;
    const astCanvas = new AstCanvas_1.AstCanvas();
    brain.addListener(astCanvas);
    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');
    const split = 'height: 100%; width: 50%; position: fixed; z-index: 1; top: 0;  padding-top: 20px;';
    const left = 'left: 0; background-color: #111;';
    const right = 'right: 0; background-color: #000;';
    leftDiv.style.cssText = split + left;
    rightDiv.style.cssText = split + right + 'overflow:scroll;' + 'overflow-x:scroll;' + 'overflow-y:scroll;';
    document.body.appendChild(leftDiv);
    document.body.appendChild(rightDiv);
    rightDiv.appendChild(astCanvas.div);
    const textarea = document.createElement('textarea');
    textarea.style.width = '40vw';
    textarea.style.height = '40vh';
    leftDiv.appendChild(textarea);
    const consoleOutput = document.createElement('textarea');
    consoleOutput.style.width = '40vw';
    consoleOutput.style.height = '40vh';
    leftDiv.appendChild(consoleOutput);
    document.body.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.ctrlKey && e.code === 'Enter') {
            const result = brain.executeUnwrapped(textarea.value);
            consoleOutput.value = result.toString();
            console.log(result);
        }
        else if (e.ctrlKey && e.code === 'KeyY') {
            yield (0, runTests_1.runTests)();
            main();
        }
    }));
}
exports["default"] = main;


/***/ }),

/***/ "./app/src/middle/clauses/And.ts":
/*!***************************************!*\
  !*** ./app/src/middle/clauses/And.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const sortIds_1 = __webpack_require__(/*! ../id/functions/sortIds */ "./app/src/middle/id/functions/sortIds.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const solveMaps_1 = __webpack_require__(/*! ./functions/solveMaps */ "./app/src/middle/clauses/functions/solveMaps.ts");
// import Imply from "./Imply";
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.hashCode = (0, hashString_1.hashString)(this.clause1.toString() + this.clause2.toString() + this.negated);
        this.entities = (0, uniq_1.uniq)(this.clause1.entities.concat(this.clause2.entities));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.ownedBy = (id) => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
        this.ownersOf = (id) => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
    }
    and(other, opts) {
        var _a;
        return new And(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b, _c;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated);
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return this.negated ? `not${yes}` : yes;
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
        const universe = this.clause1.and(this.clause2);
        const it = (_a = opts === null || opts === void 0 ? void 0 : opts.it) !== null && _a !== void 0 ? _a : (0, sortIds_1.sortIds)(universe.entities).at(-1); //TODO!
        const universeList = universe.flatList();
        const queryList = query.flatList();
        const maps = (0, solveMaps_1.solveMaps)(queryList, universeList);
        const pronMap = queryList.filter(c => { var _a; return ((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'pronoun'; }).map(c => { var _a; return ({ [(_a = c.args) === null || _a === void 0 ? void 0 : _a.at(0)]: it }); }).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        const res = maps.concat(pronMap).filter(m => Object.keys(m).length); // empty maps cause problems all around the code!
        return res;
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

/***/ "./app/src/middle/clauses/AtomClause.ts":
/*!**********************************************!*\
  !*** ./app/src/middle/clauses/AtomClause.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AtomClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
// import Imply from "./Imply";
class AtomClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.simple = this;
        this.theme = this;
        this.rheme = Clause_1.emptyClause;
        this.entities = (0, uniq_1.uniq)(this.args);
        this.hashCode = (0, hashString_1.hashString)(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.copy = (opts) => {
            var _a;
            return new AtomClause(this.predicate, this.args.map(a => { var _a, _b; return (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.map) === null || _a === void 0 ? void 0 : _a[a]) !== null && _b !== void 0 ? _b : a; }), (_a = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _a !== void 0 ? _a : this.negated);
        };
        this.and = (other, opts) => { var _a; return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false); };
        this.flatList = () => [this];
        this.ownedBy = (id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
        this.ownersOf = (id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate.root}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    query(query) {
        if (!(query instanceof AtomClause)) {
            return [];
        }
        if (this.predicate.root !== query.predicate.root) {
            return [];
        }
        const map = query.args
            .map((x, i) => ({ [x]: this.args[i] }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        return [map];
    }
}
exports.AtomClause = AtomClause;


/***/ }),

/***/ "./app/src/middle/clauses/Clause.ts":
/*!******************************************!*\
  !*** ./app/src/middle/clauses/Clause.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const AtomClause_1 = __webpack_require__(/*! ./AtomClause */ "./app/src/middle/clauses/AtomClause.ts");
const EmptyClause_1 = __importDefault(__webpack_require__(/*! ./EmptyClause */ "./app/src/middle/clauses/EmptyClause.ts"));
function clauseOf(predicate, ...args) {
    return new AtomClause_1.AtomClause(predicate, args);
}
exports.clauseOf = clauseOf;
exports.emptyClause = new EmptyClause_1.default();


/***/ }),

/***/ "./app/src/middle/clauses/EmptyClause.ts":
/*!***********************************************!*\
  !*** ./app/src/middle/clauses/EmptyClause.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class EmptyClause {
    constructor() {
        this.hashCode = 0;
        this.entities = [];
        this.theme = this;
        this.rheme = this;
        this.simple = this;
        this.hasSideEffects = false;
        this.copy = (opts) => this;
        this.and = (other, opts) => other;
        this.implies = (conclusion) => conclusion;
        this.flatList = () => [];
        this.ownedBy = (id) => [];
        this.ownersOf = (id) => [];
        this.query = (clause) => [];
        this.toString = () => '';
    }
}
exports["default"] = EmptyClause;


/***/ }),

/***/ "./app/src/middle/clauses/functions/getOwnershipChain.ts":
/*!***************************************************************!*\
  !*** ./app/src/middle/clauses/functions/getOwnershipChain.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOwnershipChain = void 0;
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
function getOwnershipChain(clause, entity = (0, topLevel_1.getTopLevel)(clause)[0]) {
    // const ownedEntities = clause.ownedBy(entity)
    // const topLevel = getTopLevel(clause)[0]
    if (!entity) {
        return [];
    }
    const ownedEntities = clause.ownedBy(entity);
    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]));
}
exports.getOwnershipChain = getOwnershipChain;


/***/ }),

/***/ "./app/src/middle/clauses/functions/solveMaps.ts":
/*!*******************************************************!*\
  !*** ./app/src/middle/clauses/functions/solveMaps.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.solveMaps = void 0;
const uniq_1 = __webpack_require__(/*! ../../../utils/uniq */ "./app/src/utils/uniq.ts");
const intersection_1 = __webpack_require__(/*! ../../../utils/intersection */ "./app/src/utils/intersection.ts");
const Id_1 = __webpack_require__(/*! ../../id/Id */ "./app/src/middle/id/Id.ts");
/**
 * Finds possible Map-ings from queryList to universeList
 * {@link "file://./../../../../../docs/notes/unification-algo.md"}
 */
function solveMaps(queryList, universeList) {
    const candidates = findCandidates(queryList, universeList);
    candidates.forEach((ml1, i) => {
        candidates.forEach((ml2, j) => {
            if (ml1.length && ml2.length && i !== j) {
                const merged = merge(ml1, ml2);
                candidates[i] = [];
                candidates[j] = merged;
            }
        });
    });
    return candidates.flat().filter(x => !isImposible(x));
}
exports.solveMaps = solveMaps;
function findCandidates(queryList, universeList) {
    return queryList.map(q => {
        const res = universeList.flatMap(u => u.query(q));
        return res.length ? res : [makeImpossible(q)];
    });
}
function merge(ml1, ml2) {
    const merged = [];
    ml1.forEach(m1 => {
        ml2.forEach(m2 => {
            if (mapsAgree(m1, m2)) {
                merged.push(Object.assign(Object.assign({}, m1), m2));
            }
        });
    });
    return (0, uniq_1.uniq)(merged);
}
function mapsAgree(m1, m2) {
    const commonKeys = (0, intersection_1.intersection)(Object.keys(m1), Object.keys(m2));
    return commonKeys.every(k => m1[k] === m2[k]);
}
function makeImpossible(q) {
    return q.entities
        .map(x => ({ [x]: Id_1.SpecialIds.IMPOSSIBLE }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
}
function isImposible(map) {
    return Object.values(map).includes(Id_1.SpecialIds.IMPOSSIBLE);
}


/***/ }),

/***/ "./app/src/middle/clauses/functions/topLevel.ts":
/*!******************************************************!*\
  !*** ./app/src/middle/clauses/functions/topLevel.ts ***!
  \******************************************************/
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

/***/ "./app/src/middle/id/Id.ts":
/*!*********************************!*\
  !*** ./app/src/middle/id/Id.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpecialIds = void 0;
/**
 * Some special Ids
 */
exports.SpecialIds = {
    IMPOSSIBLE: 'IMPOSSIBLE'
};


/***/ }),

/***/ "./app/src/middle/id/functions/getIncrementalId.ts":
/*!*********************************************************!*\
  !*** ./app/src/middle/id/functions/getIncrementalId.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIncrementalId = void 0;
function getIncrementalId() {
    const newId = `id${idGenerator.next().value}`;
    return newId;
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

/***/ "./app/src/middle/id/functions/idToNum.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/idToNum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idToNum = void 0;
function idToNum(id) {
    return parseInt(id.toString().replaceAll(/\D+/g, ''));
}
exports.idToNum = idToNum;


/***/ }),

/***/ "./app/src/middle/id/functions/sortIds.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/sortIds.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sortIds = void 0;
const idToNum_1 = __webpack_require__(/*! ./idToNum */ "./app/src/middle/id/functions/idToNum.ts");
/**
 * Sort ids in ascending order.
 */
function sortIds(ids) {
    return ids.sort((a, b) => (0, idToNum_1.idToNum)(a) - (0, idToNum_1.idToNum)(b));
}
exports.sortIds = sortIds;


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

/***/ "./app/src/utils/intersection.ts":
/*!***************************************!*\
  !*** ./app/src/utils/intersection.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intersection = void 0;
const uniq_1 = __webpack_require__(/*! ./uniq */ "./app/src/utils/uniq.ts");
/**
 * Intersection between two lists of strings.
 */
function intersection(xs, ys) {
    return (0, uniq_1.uniq)(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))));
}
exports.intersection = intersection;


/***/ }),

/***/ "./app/src/utils/parseNumber.ts":
/*!**************************************!*\
  !*** ./app/src/utils/parseNumber.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseNumber = void 0;
/**
 * Checks if string has some non-digit char (except for ".") before
 * converting to number.
 */
function parseNumber(string) {
    var _a;
    const nonDig = (_a = string.match(/\D/g)) === null || _a === void 0 ? void 0 : _a.at(0);
    if (nonDig && nonDig !== '.') {
        return undefined;
    }
    return parseFloat(string);
}
exports.parseNumber = parseNumber;


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
 * Remove duplicates from an array. Equality by JSON.stringify.
 */
function uniq(seq) {
    const seen = {};
    return seq.filter(e => {
        const k = JSON.stringify(e);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}
exports.uniq = uniq;


/***/ }),

/***/ "./app/tests/runTests.ts":
/*!*******************************!*\
  !*** ./app/tests/runTests.ts ***!
  \*******************************/
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
exports.runTests = void 0;
const test1_1 = __webpack_require__(/*! ./tests/test1 */ "./app/tests/tests/test1.ts");
const test2_1 = __webpack_require__(/*! ./tests/test2 */ "./app/tests/tests/test2.ts");
const test3_1 = __webpack_require__(/*! ./tests/test3 */ "./app/tests/tests/test3.ts");
const tests = [
    test1_1.test1,
    test2_1.test2,
    test3_1.test3,
];
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            const success = test();
            console.log(`%c${success ? 'success' : 'fail'} ${test.name}`, `color:${success ? 'green' : 'red'}`);
        }
    });
}
exports.runTests = runTests;


/***/ }),

/***/ "./app/tests/tests/test1.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test1.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test1 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/Brain */ "./app/src/facade/Brain.ts");
function test1() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x is 1');
    brain.execute('y is 2');
    return brain.executeUnwrapped('every number').every(x => [1, 2].includes(x));
}
exports.test1 = test1;


/***/ }),

/***/ "./app/tests/tests/test2.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test2.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test2 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/Brain */ "./app/src/facade/Brain.ts");
function test2() {
    const brain = (0, Brain_1.getBrain)();
    brain.executeUnwrapped('x = 1 + 3 + 4');
    return brain.executeUnwrapped('x').includes(8)
        && brain.executeUnwrapped('the number').includes(8);
}
exports.test2 = test2;


/***/ }),

/***/ "./app/tests/tests/test3.ts":
/*!**********************************!*\
  !*** ./app/tests/tests/test3.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.test3 = void 0;
const Brain_1 = __webpack_require__(/*! ../../src/facade/Brain */ "./app/src/facade/Brain.ts");
function test3() {
    const brain = (0, Brain_1.getBrain)();
    brain.execute('x = 1. y =2.');
    const numbers = brain.executeUnwrapped('every number + 3');
    return numbers.includes(4) && numbers.includes(5);
}
exports.test3 = test3;


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
/******/ 	var __webpack_exports__ = __webpack_require__("./app/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFHQUFtQztBQUduQyxrQkFBSSxHQUFFOzs7Ozs7Ozs7Ozs7OztBQ0ZOLDhHQUEyRTtBQUUzRSwyR0FBc0Q7QUFDdEQsOEdBQTRFO0FBQzVFLG1LQUFxRjtBQUNyRixzSkFBOEU7QUFJOUUsaUlBQThEO0FBQzlELGtIQUFvRDtBQUNwRCxrSEFBb0Q7QUFDcEQsZ0dBQWtEO0FBQ2xELDRHQUFnRDtBQUloRCxTQUFnQixPQUFPLENBQUMsT0FBZ0IsRUFBRSxHQUFZLEVBQUUsT0FBcUIsRUFBRTs7SUFFM0UsVUFBSSxDQUFDLFdBQVcsb0NBQWhCLElBQUksQ0FBQyxXQUFXLEdBQUssb0JBQW9CLENBQUMsR0FBRyxDQUFDO0lBRTlDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLDRDQUE0QztRQUNoRSxNQUFNLFdBQVcsR0FBRyxJQUFJLG1DQUFnQixDQUFDLEdBQUcsQ0FBQztRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxXQUFXLENBQUM7UUFDN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBVSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNqRztJQUVELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7UUFDdEIsT0FBTyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQztLQUNqQztTQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDN0UsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUNoRDtTQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDM0UsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM5QztTQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxrQkFBa0IsRUFBRTtRQUN4QyxPQUFPLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ2pEO1NBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLGFBQWEsRUFBRTtRQUNuQyxPQUFPLGNBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztLQUM1QztJQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztBQUVyRSxDQUFDO0FBekJELDBCQXlCQztBQUdELFNBQVMsa0JBQWtCLENBQUMsT0FBZ0IsRUFBRSxHQUFtQixFQUFFLElBQW1COztJQUVsRixJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXLEVBQUUsRUFBRSwyQ0FBMkM7UUFFaEUsTUFBTSxTQUFTLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksdUNBQWdCLEdBQUU7UUFDckQsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE1BQU07UUFDOUUsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ2xFLE1BQU0sVUFBVSxHQUFHLHlDQUFpQixFQUFDLE9BQU8sQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEtBQUUsU0FBUyxFQUFFLElBQUksSUFBRyxDQUFDO1FBRXpFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxtQ0FBZ0IsQ0FBQyxFQUFFLEVBQUUsOEJBQThCO1lBQ2hGLE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVMsQ0FBQyx1Q0FBZ0IsR0FBRSxFQUFFLElBQTBCLENBQUM7WUFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDO1lBQy9CLE1BQU0sbUJBQW1CLEdBQWEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlDQUFNLENBQUMsS0FBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxJQUFHLENBQUM7WUFDbkcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsRUFBRSx5QkFBeUI7WUFDbkUsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJO1NBQ2Q7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsRUFBRSxlQUFlO1lBQ3hELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUk7U0FDZDtRQUVELElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBc0M7WUFDL0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDckQsTUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xILE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLEVBQUUsSUFBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsRixNQUFNLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxpQ0FBTSxDQUFDLEtBQUUsU0FBUyxFQUFFLFNBQVMsSUFBRyxDQUFDO1lBQ25GLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sU0FBUztTQUNuQjtLQUVKO1NBQU0sRUFBRSxvQ0FBb0M7UUFDekMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBUSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0QsT0FBTyxRQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTSxDQUFDLFNBQVUsQ0FBQyxLQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7S0FDcEY7SUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDO0lBQzdDLE9BQU8sRUFBRTtBQUNiLENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxNQUFjLEVBQUUsTUFBVTtJQUNyQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUMsQ0FBQyxNQUFNO0FBQzlJLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWdCLEVBQUUsR0FBbUIsRUFBRSxJQUFtQjtJQUVoRixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUEwQjtJQUN0RSxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7SUFDN0UsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0lBRTFFLDZCQUE2QjtJQUM3QixtQ0FBbUM7SUFDbkMsaUNBQWlDO0lBQ2pDLDJDQUEyQztJQUUzQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7S0FDM0Q7SUFFRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFOLE1BQU0sY0FBTixNQUFNLEdBQUksT0FBTyxFQUFFLENBQUM7QUFDeEYsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsT0FBZ0IsRUFBRSxHQUFvQixFQUFFLElBQW1CO0lBRXBGLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1FBRTNCLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsU0FBUyxrQ0FBTyxJQUFJLEtBQUUsV0FBVyxFQUFFLEtBQUssSUFBRyxDQUFDLE1BQU0sRUFBRTtZQUN6RSxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxXQUFXLGtDQUFPLElBQUksS0FBRSxXQUFXLEVBQUUsSUFBSSxJQUFHO1NBQ3BFO0tBRUo7SUFFRCxPQUFPLEVBQUU7QUFDYixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsT0FBZ0IsRUFBRSxHQUFlLEVBQUUsSUFBbUI7O0lBRTFFLE1BQU0sRUFBRSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7SUFDeEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBQywyQ0FBMkM7SUFDMUUsTUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztJQUNsRCxJQUFJLE1BQWU7SUFDbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQUcsQ0FBQyxZQUFZLENBQUMsMENBQUcsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFFckcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxnQkFBZ0IsRUFBRTtRQUN2QyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUQ7U0FBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUN0QyxNQUFNLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7S0FDcEU7U0FBTTtRQUNILE1BQU0sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFDLGtCQUFrQjtLQUNwRztJQUVELElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEdBQUcsTUFBTTtRQUNuQixNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRO1FBQzFDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBRyxDQUFDLGlCQUFpQixDQUFDLDBDQUFHLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO0tBQ3hDO0lBRUQsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsNERBQTREO1FBQ3JHLE1BQU0sS0FBSyxHQUFHLFNBQUcsQ0FBQyxjQUFjLENBQUMsMENBQUcsZ0JBQWdCLENBQUM7UUFDckQsTUFBTSxRQUFRLEdBQUcsNkJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLEVBQUUsbUNBQUksTUFBTSxDQUFDLE1BQU07UUFDeEUsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7S0FDbkM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSwyQ0FBMkM7UUFDNUQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFFMUQsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsR0FBbUI7O0lBRTFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixPQUFPLEVBQUU7S0FDWjtJQUVELE1BQU0sTUFBTSxHQUFHLFNBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUNBQUksRUFBRTtJQUNwRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7SUFFbEQsTUFBTSxDQUFDLEdBQUcsNkJBQVcsRUFBQyxPQUFPLENBQUM7SUFFOUIsSUFBSSxDQUFDLEVBQUU7UUFDSCxPQUFPLENBQUMsSUFBSSx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsT0FBTyxFQUFFO0FBQ2IsQ0FBQztBQUdELFNBQVMsYUFBYSxDQUFDLElBQWEsRUFBRSxLQUFjLEVBQUUsRUFBVztJQUM3RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsUUFBQyxDQUFDLElBQUksRUFBUyxJQUFHLFdBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksRUFBRSxLQUFDO0lBQ2pFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUkseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxHQUFnQixFQUFFLElBQW1COztJQUU3RCxNQUFNLFNBQVMsR0FBRyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSx1Q0FBZ0IsR0FBRTtJQUNyRCxNQUFNLFVBQVUsR0FBRyxDQUFDLGVBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxTQUFTLDBDQUFFLElBQUksbUNBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVEsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7SUFFcEosSUFBSSxJQUFJLEdBQUcsb0JBQVc7SUFFdEIsSUFBSSxJQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsT0FBTyxDQUFDLElBQUksTUFBSyxNQUFNLElBQUksSUFBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQUssU0FBUyxFQUFFO1FBQ2pFLElBQUksR0FBRyxxQkFBUSxFQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0tBQzFDO0lBRUQsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzVILE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUcsWUFBWSxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBRTFELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0FBQ3RFLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FBQyxTQUFxQixFQUFFLElBQW1CO0lBRTdELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDWixPQUFPLG9CQUFXO0tBQ3JCO0lBRUQsT0FBTyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsRUFBQyw4RUFBOEU7QUFDdkosQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsR0FBZ0IsRUFBRSxJQUFtQjtJQUUzRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sT0FBTyxvQkFBVztLQUNyQjtJQUVELE1BQU0sT0FBTyxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFRO0lBQzlCLE1BQU0sT0FBTyxHQUFHLHVDQUFnQixHQUFFO0lBQ2xDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDOUcsT0FBTyxxQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLHNCQUFzQixFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ2pJLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxHQUFZO0lBRTdCLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixPQUFPLEtBQUs7S0FDZjtJQUVELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7UUFDNUIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4RTtJQUVELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDL0MsT0FBTyxxQkFBUSxFQUFDLEdBQUcsQ0FBQztLQUN2QjtJQUVELE9BQU8sS0FBSztBQUNoQixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFXLEVBQUUsTUFBYztJQUVsRCxnRUFBZ0U7SUFDaEUsK0RBQStEO0lBQy9ELGdGQUFnRjtJQUNoRixtREFBbUQ7SUFDbkQsa0RBQWtEO0lBQ2xELCtEQUErRDtJQUMvRCx3REFBd0Q7SUFFeEQsTUFBTSxFQUFFLEdBQUcseUNBQWlCLEVBQUMsTUFBTSxDQUFDO0lBRXBDLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUs7S0FDbkQ7SUFFRCx3RUFBd0U7SUFDeEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLEVBQUMsYUFBYTtBQUV6RCxDQUFDO0FBR0QsU0FBUyxXQUFXLENBQUMsTUFBYztJQUMvQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQUMsb0JBQUMsQ0FBQyxTQUFTLDBDQUFFLFNBQVMsMENBQUcsQ0FBQyxDQUFFLElBQUMsa0JBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sRUFBRSxHQUFHLHVDQUFnQixHQUFFO0lBQzdCLE9BQU8sb0JBQVEsRUFBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNsQyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsT0FBZ0IsRUFBRSxHQUFtQixFQUFFLElBQW1CO0lBRTFFLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixPQUFPLEVBQUU7S0FDWjtJQUVELE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNwRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNyQixPQUFPLENBQUMsSUFBSSx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEdBQVk7SUFFdEMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxFQUFFLDRHQUE0RztRQUNwSSxPQUFPLEtBQUs7S0FDZjtJQUVELE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLGtCQUFrQixDQUFDO0FBQ2hGLENBQUM7QUFRRCxTQUFnQixTQUFTLENBQUMsT0FBZ0IsRUFBRSxLQUFZOztJQUVwRCxNQUFNLFVBQVUsR0FBRyxXQUFLLENBQUMsU0FBUyxDQUFDLElBQUksbUNBQUksRUFBRTtJQUM3QyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO0lBRS9CLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDO0tBQ3ZDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQy9CLE9BQU8sRUFBRTtBQUNiLENBQUM7QUFaRCw4QkFZQztBQUVELFNBQVMsaUJBQWlCLENBQUMsU0FBb0I7O0lBRTNDLE1BQU0sWUFBWSxHQUFHLHFCQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsV0FBVywwQ0FBRSxJQUFJLG1DQUFJLEVBQUU7SUFDdkQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxJQUFJLENBQUM7SUFFL0MsTUFBTSxZQUFZLEdBQUcsMkJBQVMsYUFBVCxTQUFTLHVCQUFULFNBQVMsQ0FBRSxXQUFXLDBDQUFFLFdBQVcsMENBQUUsSUFBSSxtQ0FBSSxFQUFFO0lBQ3BFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsSUFBSSxDQUFDO0lBRWxELE9BQU87UUFDSCxLQUFLLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFDLGFBQUMsQ0FBQyxhQUFELENBQUMsdUJBQUQsQ0FBQyxDQUFFLElBQWdCLG1DQUFJLEVBQUUsSUFBQztRQUN4RCxJQUFJLEVBQUUsZUFBUyxDQUFDLGNBQWMsQ0FBQywwQ0FBRSxJQUFJO1FBQ3JDLE1BQU0sRUFBRSxlQUFTLENBQUMsV0FBVywwQ0FBRSxXQUFXO1FBQzFDLFdBQVcsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsYUFBQyxDQUFDLGFBQUQsQ0FBQyx1QkFBRCxDQUFDLENBQUUsSUFBZ0IsbUNBQUksRUFBRSxJQUFDO1FBQ2pFLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1FBQ3RDLE1BQU0sRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO0tBQ3hDO0FBRUwsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNqVkQsOEdBQWtFO0FBQ2xFLDhHQUE0RTtBQUc1RSxzRkFBd0M7QUFJeEMsTUFBYSxTQUFTO0lBRWxCLFlBQ3VCLEVBQU0sRUFDZixRQUFpQixFQUFFLEVBQ1YsV0FBZ0MsRUFBRSxFQUMzQyxVQUFvQixFQUFFO1FBSGIsT0FBRSxHQUFGLEVBQUUsQ0FBSTtRQUNmLFVBQUssR0FBTCxLQUFLLENBQWM7UUFDVixhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUMzQyxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBaUJwQyxZQUFPLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLFlBQVk7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xDLENBQUM7UUFNRCxRQUFHLEdBQUcsQ0FBQyxFQUFNLEVBQXFCLEVBQUU7O1lBQ2hDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxLQUFLLEdBQUcsVUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsbUNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDcEQsTUFBTSxHQUFHLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztZQUM5RyxPQUFPLEdBQUcsYUFBSCxHQUFHLGNBQUgsR0FBRyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBdUJELGFBQVEsR0FBRyxDQUFDLEtBQWMsRUFBVSxFQUFFO1lBRWxDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPO2lCQUNqQixPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFRLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzFELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQVcsQ0FBQztZQUU1QyxNQUFNLENBQUMsR0FBRyxNQUFNO2lCQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUNuQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCO2lCQUN4RyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLG9CQUFXLENBQUM7WUFFNUMsTUFBTSxDQUFDLEdBQUcsTUFBTTtpQkFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBVyxDQUFDO1lBRTVDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtRQUNqQyxDQUFDO1FBRUQsY0FBUyxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUU7WUFFM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDNUQsTUFBTSxPQUFPLEdBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLCtDQUFNLENBQUMsR0FBSyxNQUFNLEtBQUUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFHLENBQUM7WUFDL0csSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQztZQUMvRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQy9CLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyx3QkFBVyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQztRQUV0QyxDQUFDO1FBRUQsZUFBVSxHQUFHLENBQUMsV0FBbUIsRUFBWSxFQUFFO1lBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU87aUJBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkUsQ0FBQztJQXRGRCxDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLEVBQUU7SUFDbEIsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFpQjs7UUFDbkIsT0FBTyxJQUFJLFNBQVMsQ0FDaEIsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEVBQUUsbUNBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxzQkFBc0I7UUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFNLENBQUMsR0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUN4RztJQUNMLENBQUM7SUFPRCxTQUFTLENBQUMsS0FBWTtRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwRSxDQUFDO0lBVUQsR0FBRyxDQUFDLEVBQU0sRUFBRSxLQUFZO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSztRQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBQyx5QkFBeUI7UUFFN0YsTUFBTTtRQUNOLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssUUFBUSxFQUFFLEVBQUUsNEJBQTRCO1lBQ2hFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUN2RTthQUFNLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssUUFBUSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztTQUN2RTtJQUVMLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLEVBQUMsaUJBQWlCO0lBQ2pDLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYTtRQUNmLE9BQU8sZUFBSSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFDLDhCQUE4QixDQUFFLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBc0NELFlBQVksQ0FBQyxXQUFtQjtRQUM1QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDOUYsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQUssS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksRUFBRTtJQUN4QyxDQUFDO0NBQ0o7QUExR0QsOEJBMEdDOzs7Ozs7Ozs7Ozs7OztBQ2xIRCw4RkFBK0M7QUFHL0MsOEdBQTZFO0FBRTdFLHFJQUFtRTtBQUVuRSxvR0FBdUM7QUFJdkMsTUFBYSxZQUFhLFNBQVEscUJBQVM7SUFJdkMsWUFDYSxFQUFNLEVBQ0ksU0FBUyxzQkFBUyxHQUFFLEVBQ3BCLHVCQUF1QixNQUFNLENBQUMsb0JBQW9CLEVBQ2xELFlBQVksTUFBTSxDQUFDLFFBQVEsRUFDcEMsVUFBb0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLHdCQUFXLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN2RSxRQUFpQixFQUFFLEVBQ25CLFdBQWdDLEVBQUU7UUFFNUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztRQVIxQixPQUFFLEdBQUYsRUFBRSxDQUFJO1FBQ0ksV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUNwQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQThCO1FBQ2xELGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQWdFO1FBQ3ZFLFVBQUssR0FBTCxLQUFLLENBQWM7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFUdEMsZUFBVSxHQUFvQixJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUEwQ2hFLGNBQVMsR0FBRyxDQUFDLElBQVksRUFBRSxNQUFjLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUFVLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFxQixDQUFDLEdBQUcsTUFBTTtZQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUM5QyxDQUFDO1FBRUQsY0FBUyxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXFCLENBQUM7UUFDaEQsQ0FBQztRQXJDRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUFVLEVBQUM7Z0JBQ3RCLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxNQUFNO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2FBQ2hCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztJQUVOLENBQUM7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7SUFDbEMsQ0FBQztJQUVELFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztJQUM5QixDQUFDO0lBRVMsaUJBQWlCO1FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBb0I7UUFDeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlDQUFhLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxVQUFVO0lBQzFCLENBQUM7SUFZRCxJQUFJLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBQyxPQUFPO1FBQzlELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDdEMsT0FBTyxHQUFHO0lBQ2QsQ0FBQztJQUVRLEtBQUs7UUFDVixPQUFPLElBQUksWUFBWSxDQUNuQixJQUFJLENBQUMsRUFBRSxFQUNQLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLG9CQUFvQixFQUN6QixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsUUFBUSxDQUNoQjtJQUNMLENBQUM7Q0FFSjtBQXhFRCxvQ0F3RUM7Ozs7Ozs7Ozs7Ozs7O0FDL0VELDZHQUE4QztBQVk5QyxTQUFnQixVQUFVLENBQUMsSUFBZ0I7SUFDdkMsT0FBTyxJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNwQyxDQUFDO0FBRkQsZ0NBRUM7Ozs7Ozs7Ozs7Ozs7O0FDakJELHNKQUE4RTtBQUM5RSxvR0FBd0M7QUFFeEMsTUFBYSxnQkFBaUIsU0FBUSxxQkFBUztJQUUzQyxZQUFxQixLQUFjO1FBQy9CLEtBQUssQ0FBQyx1Q0FBZ0IsR0FBRSxDQUFDO1FBRFIsVUFBSyxHQUFMLEtBQUssQ0FBUztJQUVuQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEtBQUs7SUFDckIsQ0FBQztDQUVKO0FBVkQsNENBVUM7Ozs7Ozs7Ozs7Ozs7O0FDYkQsb0dBQXdDO0FBR3hDLE1BQWEsV0FBWSxTQUFRLHFCQUFTO0lBRXRDLFlBQXFCLEtBQWEsRUFBRSxLQUFTLEtBQUssR0FBRyxFQUFFO1FBQ25ELEtBQUssQ0FBQyxFQUFFLENBQUM7UUFEUSxVQUFLLEdBQUwsS0FBSyxDQUFRO0lBRWxDLENBQUM7SUFFUSxJQUFJO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSztJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLElBQWlDO1FBQ25DLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsRUFBRSxDQUFDO0lBQ2hELENBQUM7Q0FFSjtBQWRELGtDQWNDOzs7Ozs7Ozs7Ozs7OztBQ2pCRCxvR0FBdUM7QUFHdkMsTUFBYSxXQUFZLFNBQVEscUJBQVM7SUFFdEMsWUFBcUIsS0FBYSxFQUFFLEtBQVMsS0FBSztRQUM5QyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBRFEsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUVsQyxDQUFDO0lBRVEsSUFBSTtRQUNULE9BQU8sSUFBSSxDQUFDLEtBQUs7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFpQztRQUNuQyxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0NBRUo7QUFkRCxrQ0FjQzs7Ozs7Ozs7Ozs7Ozs7QUNiRCxvR0FBdUM7QUFvQnZDLFNBQWdCLFFBQVEsQ0FBQyxJQUFnQztJQUNyRCxPQUFPLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDN0MsQ0FBQztBQUZELDRCQUVDOzs7Ozs7Ozs7Ozs7OztBQ3pCRCxrR0FBMEM7QUFDMUMsb0dBQXdDO0FBWXhDLE1BQWEsU0FBVSxTQUFRLHFCQUFTO0lBRXBDLFlBQ2EsRUFBTSxFQUNOLFlBQWdDO1FBRXpDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFIQSxPQUFFLEdBQUYsRUFBRSxDQUFJO1FBQ04saUJBQVksR0FBWixZQUFZLENBQW9CO0lBRzdDLENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZ0IsRUFBRSxJQUF3QztRQUUxRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFO1FBQ3JDLHdDQUF3QztRQUN4QyxvR0FBb0c7UUFDcEcsd0RBQXdEO1FBQ3hELGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ25ELGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDMUYsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUV4RixJQUFJLE9BQU8sR0FBWSxFQUFFO1FBRXpCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sR0FBRyxxQkFBTyxFQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQ3RELENBQUMsQ0FBQztRQUVGLE9BQU8sT0FBTztJQUNsQixDQUFDO0NBRUo7QUE1QkQsOEJBNEJDO0FBR0QsY0FBYztBQUNkLGVBQWU7QUFDZixrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxnQkFBZ0I7QUFDSCxlQUFPLEdBQUcsSUFBSSxDQUFDLEtBQU0sU0FBUSxTQUFTO0lBQy9DLEdBQUcsQ0FBQyxPQUFnQixFQUFFLElBQXdDO1FBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvQixPQUFPLEVBQUU7SUFDYixDQUFDO0NBQ0osQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDekRiLHNGQUFtQztBQUNuQywrRkFBMEM7QUFDMUMsc0ZBQW1DO0FBQ25DLHlGQUEyRDtBQUczRCxTQUFnQixTQUFTO0lBRXJCLE9BQU87UUFDSCxXQUFXLEVBQVgsd0JBQVc7UUFDWCxPQUFPLEVBQVAsaUJBQU87UUFDUCxRQUFRLEVBQVIsbUJBQVE7UUFDUixPQUFPLEVBQVAsaUJBQU87UUFDUCxvQkFBb0IsRUFBcEIsK0JBQW9CO1FBQ3BCLFVBQVU7S0FDYjtBQUNMLENBQUM7QUFWRCw4QkFVQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxpSEFBd0Q7QUFJM0MsbUJBQVcsR0FBRyxtQ0FBYyxFQUV2QyxZQUFZLEVBQ1osV0FBVyxFQUNYLFFBQVEsRUFDUixRQUFRLEVBQ1IsVUFBVSxFQUNWLFVBQVUsRUFDVixPQUFPLEVBQ1AsTUFBTSxFQUNOLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGFBQWEsRUFDYixTQUFTLEVBQ1QsWUFBWSxFQUFFLE1BQU07QUFDcEIsU0FBUyxFQUFFLEtBQUs7QUFDaEIsU0FBUyxFQUNULE9BQU8sRUFFUCxlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxhQUFhLEVBRWIsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsbUJBQW1CLEVBQ25CLHVCQUF1QixFQUN2QixxQkFBcUIsRUFFckIsY0FBYyxFQUNkLGtCQUFrQixFQUVsQixlQUFlLEVBRWYsT0FBTyxFQUdQLGFBQWEsRUFDYixjQUFjLEVBR2QsaUJBQWlCLEVBQ2pCLGdCQUFnQixDQUdqQjs7Ozs7Ozs7Ozs7Ozs7QUN0RFksZUFBTyxHQUFhO0lBRTdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0MsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDMUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0UsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0UsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzdDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFaEQsNkRBQTZEO0lBQzdELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDMUQsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0QsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzdELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUc3RCwyQ0FBMkM7SUFDM0MsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFdB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O0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEdBQUU7SUFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztJQUN2QyxPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1dBQ3ZDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFMRCxzQkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwrRkFBa0Q7QUFFbEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxHQUFFO0lBQ3hCLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQzdCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUMxRCxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUxELHNCQUtDOzs7Ozs7O1VDUEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZXZhbC9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQmFzZVRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL0luc3RydWN0aW9uVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9OdW1iZXJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL1N0cmluZ1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9WZXJiVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9wcmVsdWRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvQXN0Q2FudmFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvYXN0VG9FZGdlTGlzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2RyYXdMaW5lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZHJhd05vZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9nZXRDb29yZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9wbG90QXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9zb2x2ZU1hcHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvcGFyc2VOdW1iZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3J1blRlc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsIlxuaW1wb3J0IHsgaXNQbHVyYWwsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gJy4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZSc7XG5pbXBvcnQgeyBBbmRQaHJhc2UsIEFzdE5vZGUsIENvbXBsZXhTZW50ZW5jZSwgTWFjcm8sIE1hY3JvcGFydCwgTm91blBocmFzZSwgTnVtYmVyTGl0ZXJhbCwgU3RyaW5nTGl0ZXJhbCwgU2ltcGxlU2VudGVuY2UgfSBmcm9tICcuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlJztcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcGFyc2VOdW1iZXInO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4nO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZCc7XG5pbXBvcnQgeyBJZCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9JZCc7XG5pbXBvcnQgeyBNYXAgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvTWFwJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuLi90aGluZ3MvQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0cnVjdGlvblRoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL0luc3RydWN0aW9uVGhpbmcnO1xuaW1wb3J0IHsgTnVtYmVyVGhpbmcgfSBmcm9tICcuLi90aGluZ3MvTnVtYmVyVGhpbmcnO1xuaW1wb3J0IHsgU3RyaW5nVGhpbmcgfSBmcm9tICcuLi90aGluZ3MvU3RyaW5nVGhpbmcnO1xuaW1wb3J0IHsgVGhpbmcsIGdldFRoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL1RoaW5nJztcbmltcG9ydCB7IFZlcmJUaGluZyB9IGZyb20gJy4uL3RoaW5ncy9WZXJiVGhpbmcnO1xuaW1wb3J0IHsgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4JztcblxuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7XG5cbiAgICBhcmdzLnNpZGVFZmZlY3RzID8/PSBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3QpXG5cbiAgICBpZiAoYXJncy5zaWRlRWZmZWN0cykgeyAvLyBvbmx5IGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIHNpZGUgZWZmZWN0c1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IG5ldyBJbnN0cnVjdGlvblRoaW5nKGFzdClcbiAgICAgICAgY29udGV4dC5zZXQoaW5zdHJ1Y3Rpb24uZ2V0SWQoKSwgaW5zdHJ1Y3Rpb24pXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyByb290OiAnaW5zdHJ1Y3Rpb24nLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW2luc3RydWN0aW9uXSB9KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxNYWNybyhjb250ZXh0LCBhc3QpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ3NpbXBsZS1zZW50ZW5jZScgJiYgYXN0LnZlcmJvcmNvcHVsYS50eXBlID09PSAnY29wdWxhJykge1xuICAgICAgICByZXR1cm4gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSAnc2ltcGxlLXNlbnRlbmNlJyAmJiBhc3QudmVyYm9yY29wdWxhLnR5cGUgPT09ICd2ZXJiJykge1xuICAgICAgICByZXR1cm4gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ2NvbXBsZXgtc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSAnbm91bi1waHJhc2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsTm91blBocmFzZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgY29uc29sZS53YXJuKGFzdClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2V2YWxBc3QoKSBnb3QgdW5leHBlY3RlZCBhc3QgdHlwZTogJyArIGFzdC50eXBlKVxuXG59XG5cblxuZnVuY3Rpb24gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogU2ltcGxlU2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhcmdzPy5zaWRlRWZmZWN0cykgeyAvLyBhc3NpZ24gdGhlIHJpZ2h0IHZhbHVlIHRvIHRoZSBsZWZ0IHZhbHVlXG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Quc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkuc2ltcGxlXG4gICAgICAgIGNvbnN0IHJWYWwgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5vYmplY3QhLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuICAgICAgICBjb25zdCBvd25lckNoYWluID0gZ2V0T3duZXJzaGlwQ2hhaW4oc3ViamVjdClcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkoc3ViamVjdClcbiAgICAgICAgY29uc3QgbGV4ZW1lcyA9IHN1YmplY3QuZmxhdExpc3QoKS5tYXAoeCA9PiB4LnByZWRpY2F0ZSEpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgIGNvbnN0IGxleGVtZXNXaXRoUmVmZXJlbnQgPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogclZhbCB9KSlcblxuICAgICAgICBpZiAoclZhbC5ldmVyeSh4ID0+IHggaW5zdGFuY2VvZiBJbnN0cnVjdGlvblRoaW5nKSkgeyAvLyBtYWtlIHZlcmIgZnJvbSBpbnN0cnVjdGlvbnNcbiAgICAgICAgICAgIGNvbnN0IHZlcmIgPSBuZXcgVmVyYlRoaW5nKGdldEluY3JlbWVudGFsSWQoKSwgclZhbCBhcyBJbnN0cnVjdGlvblRoaW5nW10pXG4gICAgICAgICAgICBjb250ZXh0LnNldCh2ZXJiLmdldElkKCksIHZlcmIpXG4gICAgICAgICAgICBjb25zdCBsZXhlbWVzV2l0aFJlZmVyZW50OiBMZXhlbWVbXSA9IGxleGVtZXMubWFwKHggPT4gKHsgLi4ueCwgcmVmZXJlbnRzOiBbdmVyYl0sIHR5cGU6ICd2ZXJiJyB9KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgcmV0dXJuIFt2ZXJiXVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXBzLmxlbmd0aCAmJiBvd25lckNoYWluLmxlbmd0aCA8PSAxKSB7IC8vIGxWYWwgaXMgY29tcGxldGVseSBuZXdcbiAgICAgICAgICAgIGxleGVtZXNXaXRoUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgclZhbC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWFwcy5sZW5ndGggJiYgb3duZXJDaGFpbi5sZW5ndGggPD0gMSkgeyAvLyByZWFzc2lnbm1lbnRcbiAgICAgICAgICAgIGxleGVtZXMuZm9yRWFjaCh4ID0+IGNvbnRleHQucmVtb3ZlTGV4ZW1lKHgucm9vdCkpXG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWwuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0KHguZ2V0SWQoKSwgeCkpXG4gICAgICAgICAgICByZXR1cm4gclZhbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG93bmVyQ2hhaW4ubGVuZ3RoID4gMSkgeyAvLyBsVmFsIGlzIHByb3BlcnR5IG9mIGV4aXN0aW5nIG9iamVjdFxuICAgICAgICAgICAgY29uc3QgYWJvdXRPd25lciA9IGFib3V0KHN1YmplY3QsIG93bmVyQ2hhaW4uYXQoLTIpISlcbiAgICAgICAgICAgIGNvbnN0IG93bmVycyA9IGdldEludGVyZXN0aW5nSWRzKGNvbnRleHQucXVlcnkoYWJvdXRPd25lciksIGFib3V0T3duZXIpLm1hcChpZCA9PiBjb250ZXh0LmdldChpZCkhKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICAgICAgY29uc3Qgb3duZXIgPSBvd25lcnMuYXQoMClcbiAgICAgICAgICAgIGNvbnN0IHJWYWxDbG9uZSA9IHJWYWwubWFwKHggPT4geC5jbG9uZSh7IGlkOiBvd25lcj8uZ2V0SWQoKSArICcuJyArIHguZ2V0SWQoKSB9KSlcbiAgICAgICAgICAgIGNvbnN0IGxleGVtZXNXaXRoQ2xvbmVSZWZlcmVudCA9IGxleGVtZXMubWFwKHggPT4gKHsgLi4ueCwgcmVmZXJlbnRzOiByVmFsQ2xvbmUgfSkpXG4gICAgICAgICAgICBsZXhlbWVzV2l0aENsb25lUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgclZhbENsb25lLmZvckVhY2goeCA9PiBvd25lcj8uc2V0KHguZ2V0SWQoKSwgeCkpXG4gICAgICAgICAgICByZXR1cm4gclZhbENsb25lXG4gICAgICAgIH1cblxuICAgIH0gZWxzZSB7IC8vIGNvbXBhcmUgdGhlIHJpZ2h0IGFuZCBsZWZ0IHZhbHVlc1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3Quc3ViamVjdCEsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0Lm9iamVjdCEsIGFyZ3MpLmF0KDApXG4gICAgICAgIHJldHVybiBzdWJqZWN0Py5lcXVhbHMocHJlZGljYXRlISkgJiYgKCFhc3QubmVnYXRpb24pID8gW25ldyBOdW1iZXJUaGluZygxKV0gOiBbXVxuICAgIH1cblxuICAgIGNvbnNvbGUud2FybigncHJvYmxlbSB3aXRoIGNvcHVsYSBzZW50ZW5jZSEnKVxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBhYm91dChjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCkge1xuICAgIHJldHVybiBjbGF1c2UuZmxhdExpc3QoKS5maWx0ZXIoeCA9PiB4LmVudGl0aWVzLmluY2x1ZGVzKGVudGl0eSkgJiYgeC5lbnRpdGllcy5sZW5ndGggPD0gMSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpLnNpbXBsZVxufVxuXG5mdW5jdGlvbiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogU2ltcGxlU2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHsgLy9UT0RPOiBtdWx0aXBsZSBzdWJqZWN0cy9vYmplY3RzXG5cbiAgICBjb25zdCB2ZXJiID0gYXN0LnZlcmJvcmNvcHVsYS5yZWZlcmVudHMuYXQoMCkgYXMgVmVyYlRoaW5nIHwgdW5kZWZpbmVkXG4gICAgY29uc3Qgc3ViamVjdCA9IGFzdC5zdWJqZWN0ID8gZXZhbEFzdChjb250ZXh0LCBhc3Quc3ViamVjdCkuYXQoMCkgOiB1bmRlZmluZWRcbiAgICBjb25zdCBvYmplY3QgPSBhc3Qub2JqZWN0ID8gZXZhbEFzdChjb250ZXh0LCBhc3Qub2JqZWN0KS5hdCgwKSA6IHVuZGVmaW5lZFxuXG4gICAgLy8gY29uc29sZS5sb2coJ3ZlcmI9JywgdmVyYilcbiAgICAvLyBjb25zb2xlLmxvZygnc3ViamVjdD0nLCBzdWJqZWN0KVxuICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q9Jywgb2JqZWN0KVxuICAgIC8vIGNvbnNvbGUubG9nKCdjb21wbGVtZW50cz0nLCBjb21wbGVtZW50cylcblxuICAgIGlmICghdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggdmVyYiAnICsgYXN0LnZlcmJvcmNvcHVsYS5yb290KVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJiLnJ1bihjb250ZXh0LCB7IHN1YmplY3Q6IHN1YmplY3QgPz8gY29udGV4dCwgb2JqZWN0OiBvYmplY3QgPz8gY29udGV4dCB9KVxufVxuXG5mdW5jdGlvbiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQ29tcGxleFNlbnRlbmNlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBpZiAoYXN0LnN1YmNvbmoucm9vdCA9PT0gJ2lmJykge1xuXG4gICAgICAgIGlmIChldmFsQXN0KGNvbnRleHQsIGFzdC5jb25kaXRpb24sIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IGZhbHNlIH0pLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZhbEFzdChjb250ZXh0LCBhc3QuY29uc2VxdWVuY2UsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogTm91blBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KG5wKSAvLyBUT0RPOiBpbnRyYS1zZW50ZW5jZSBhbmFwaG9yYSByZXNvbHV0aW9uXG4gICAgY29uc3QgaW50ZXJlc3RpbmdJZHMgPSBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzLCBucClcbiAgICBsZXQgdGhpbmdzOiBUaGluZ1tdXG4gICAgY29uc3QgYW5kUGhyYXNlID0gYXN0WydhbmQtcGhyYXNlJ10gPyBldmFsQXN0KGNvbnRleHQsIGFzdFsnYW5kLXBocmFzZSddPy5bJ25vdW4tcGhyYXNlJ10sIGFyZ3MpIDogW11cblxuICAgIGlmIChhc3Quc3ViamVjdC50eXBlID09PSAnbnVtYmVyLWxpdGVyYWwnKSB7XG4gICAgICAgIHRoaW5ncyA9IGFuZFBocmFzZS5jb25jYXQoZXZhbE51bWJlckxpdGVyYWwoYXN0LnN1YmplY3QpKVxuICAgIH0gZWxzZSBpZiAoYXN0LnN1YmplY3QudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpbmdzID0gZXZhbFN0cmluZyhjb250ZXh0LCBhc3Quc3ViamVjdCwgYXJncykuY29uY2F0KGFuZFBocmFzZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4ISkgLy8gVE9ETyBzb3J0IGJ5IGlkXG4gICAgfVxuXG4gICAgaWYgKGFzdFsnbWF0aC1leHByZXNzaW9uJ10pIHtcbiAgICAgICAgY29uc3QgbGVmdCA9IHRoaW5nc1xuICAgICAgICBjb25zdCBvcCA9IGFzdFsnbWF0aC1leHByZXNzaW9uJ10ub3BlcmF0b3JcbiAgICAgICAgY29uc3QgcmlnaHQgPSBldmFsQXN0KGNvbnRleHQsIGFzdFsnbWF0aC1leHByZXNzaW9uJ10/Llsnbm91bi1waHJhc2UnXSlcbiAgICAgICAgcmV0dXJuIGV2YWxPcGVyYXRpb24obGVmdCwgcmlnaHQsIG9wKVxuICAgIH1cblxuICAgIGlmIChpc0FzdFBsdXJhbChhc3QpIHx8IGFzdFsnYW5kLXBocmFzZSddKSB7IC8vIGlmIHVuaXZlcnNhbCBxdWFudGlmaWVkLCBJIGRvbid0IGNhcmUgaWYgdGhlcmUncyBubyBtYXRjaFxuICAgICAgICBjb25zdCBsaW1pdCA9IGFzdFsnbGltaXQtcGhyYXNlJ10/LlsnbnVtYmVyLWxpdGVyYWwnXVxuICAgICAgICBjb25zdCBsaW1pdE51bSA9IGV2YWxOdW1iZXJMaXRlcmFsKGxpbWl0KS5hdCgwKT8udG9KcygpID8/IHRoaW5ncy5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCBsaW1pdE51bSlcbiAgICB9XG5cbiAgICBpZiAodGhpbmdzLmxlbmd0aCkgeyAvLyBub24tcGx1cmFsLCByZXR1cm4gc2luZ2xlIGV4aXN0aW5nIFRoaW5nXG4gICAgICAgIHJldHVybiB0aGluZ3Muc2xpY2UoMCwgMSlcbiAgICB9XG5cbiAgICAvLyBvciBlbHNlIGNyZWF0ZSBhbmQgcmV0dXJucyB0aGUgVGhpbmdcbiAgICByZXR1cm4gYXJncz8uYXV0b3ZpdmlmaWNhdGlvbiA/IFtjcmVhdGVUaGluZyhucCldIDogW11cblxufVxuXG5mdW5jdGlvbiBldmFsTnVtYmVyTGl0ZXJhbChhc3Q/OiBOdW1iZXJMaXRlcmFsKTogTnVtYmVyVGhpbmdbXSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBkaWdpdHMgPSBhc3QuZGlnaXQubGlzdC5tYXAoeCA9PiB4LnJvb3QpID8/IFtdXG4gICAgY29uc3QgbGl0ZXJhbCA9IGRpZ2l0cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAnJylcblxuICAgIGNvbnN0IHogPSBwYXJzZU51bWJlcihsaXRlcmFsKVxuXG4gICAgaWYgKHopIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgTnVtYmVyVGhpbmcoeildXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cblxuZnVuY3Rpb24gZXZhbE9wZXJhdGlvbihsZWZ0OiBUaGluZ1tdLCByaWdodDogVGhpbmdbXSwgb3A/OiBMZXhlbWUpIHtcbiAgICBjb25zdCBzdW1zID0gbGVmdC5tYXAoeCA9PiB4LnRvSnMoKSBhcyBhbnkgKyByaWdodC5hdCgwKT8udG9KcygpKVxuICAgIHJldHVybiBzdW1zLm1hcCh4ID0+IG5ldyBOdW1iZXJUaGluZyh4KSlcbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKGFzdD86IE5vdW5QaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBhZGplY3RpdmVzID0gKGFzdD8uYWRqZWN0aXZlPy5saXN0ID8/IFtdKS5tYXAoeCA9PiB4ISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICBsZXQgbm91biA9IGVtcHR5Q2xhdXNlXG5cbiAgICBpZiAoYXN0Py5zdWJqZWN0LnR5cGUgPT09ICdub3VuJyB8fCBhc3Q/LnN1YmplY3QudHlwZSA9PT0gJ3Byb25vdW4nKSB7XG4gICAgICAgIG5vdW4gPSBjbGF1c2VPZihhc3Quc3ViamVjdCwgc3ViamVjdElkKVxuICAgIH1cblxuICAgIGNvbnN0IGdlbml0aXZlQ29tcGxlbWVudCA9IGdlbml0aXZlVG9DbGF1c2UoYXN0Py5vd25lciwgeyBzdWJqZWN0OiBzdWJqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcbiAgICBjb25zdCBhbmRQaHJhc2UgPSBldmFsQW5kUGhyYXNlKGFzdD8uWydhbmQtcGhyYXNlJ10sIGFyZ3MpXG5cbiAgICByZXR1cm4gYWRqZWN0aXZlcy5hbmQobm91bikuYW5kKGdlbml0aXZlQ29tcGxlbWVudCkuYW5kKGFuZFBocmFzZSlcbn1cblxuZnVuY3Rpb24gZXZhbEFuZFBocmFzZShhbmRQaHJhc2U/OiBBbmRQaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpIHtcblxuICAgIGlmICghYW5kUGhyYXNlKSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIHJldHVybiBub3VuUGhyYXNlVG9DbGF1c2UoYW5kUGhyYXNlWydub3VuLXBocmFzZSddIC8qIFRPRE8hIGFyZ3MgKi8pIC8vIG1heWJlIHByb2JsZW0gaWYgbXVsdGlwbGUgdGhpbmdzIGhhdmUgc2FtZSBpZCwgcXVlcnkgaXMgbm90IGdvbm5hIGZpbmQgdGhlbVxufVxuXG5mdW5jdGlvbiBnZW5pdGl2ZVRvQ2xhdXNlKGFzdD86IE5vdW5QaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZWRJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb3duZXJJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG93bmVyID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdC5vd25lciwgeyBzdWJqZWN0OiBvd25lcklkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG4gICAgcmV0dXJuIGNsYXVzZU9mKHsgcm9vdDogJ29mJywgdHlwZTogJ2dlbml0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9IC8qIGdlbml0aXZlUGFydGljbGUgKi8sIG93bmVkSWQsIG93bmVySWQpLmFuZChvd25lcilcbn1cblxuZnVuY3Rpb24gaXNBc3RQbHVyYWwoYXN0OiBBc3ROb2RlKTogYm9vbGVhbiB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdub3VuLXBocmFzZScpIHtcbiAgICAgICAgcmV0dXJuICEhYXN0LnVuaXF1YW50IHx8IE9iamVjdC52YWx1ZXMoYXN0KS5zb21lKHggPT4gaXNBc3RQbHVyYWwoeCkpXG4gICAgfVxuXG4gICAgaWYgKGFzdC50eXBlID09PSAncHJvbm91bicgfHwgYXN0LnR5cGUgPT09ICdub3VuJykge1xuICAgICAgICByZXR1cm4gaXNQbHVyYWwoYXN0KVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzOiBNYXBbXSwgY2xhdXNlOiBDbGF1c2UpOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IGdldE51bWJlck9mRG90cyA9IChpZDogSWQpID0+IGlkLnNwbGl0KCcuJykubGVuZ3RoIC8vLTFcbiAgICAvLyB0aGUgb25lcyB3aXRoIG1vc3QgZG90cywgYmVjYXVzZSAnY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uJyBcbiAgICAvLyBoYXMgYnV0dG9uSWQuc3R5bGUuY29sb3IgYW5kIHRoYXQncyB0aGUgb2JqZWN0IHRoZSBzZW50ZW5jZSBzaG91bGQgcmVzb2x2ZSB0b1xuICAgIC8vIHBvc3NpYmxlIHByb2JsZW0gaWYgJ2NvbG9yIG9mIGJ1dHRvbiBBTkQgYnV0dG9uJ1xuICAgIC8vIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgLy8gY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgLy8gcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxuICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuXG4gICAgaWYgKG9jLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKSAvL2FsbFxuICAgIH1cblxuICAgIC8vIFRPRE86IHByb2JsZW0gbm90IHJldHVybmluZyBldmVyeXRoaW5nIGJlY2F1c2Ugb2YgZ2V0T3duZXJzaGlwQ2hhaW4oKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBvd25lZCBsZWFmXG5cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVUaGluZyhjbGF1c2U6IENsYXVzZSk6IFRoaW5nIHtcbiAgICBjb25zdCBiYXNlcyA9IGNsYXVzZS5mbGF0TGlzdCgpLm1hcCh4ID0+IHgucHJlZGljYXRlPy5yZWZlcmVudHM/LlswXSEpLyogT05MWSBGSVJTVD8gKi8uZmlsdGVyKHggPT4geClcbiAgICBjb25zdCBpZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIHJldHVybiBnZXRUaGluZyh7IGlkLCBiYXNlcyB9KVxufVxuXG5mdW5jdGlvbiBldmFsU3RyaW5nKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IFN0cmluZ0xpdGVyYWwsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHggPSBhc3RbJ3N0cmluZy10b2tlbiddLmxpc3QubWFwKHggPT4geC50b2tlbilcbiAgICBjb25zdCB5ID0geC5qb2luKCcgJylcbiAgICByZXR1cm4gW25ldyBTdHJpbmdUaGluZyh5KV1cbn1cblxuZnVuY3Rpb24gY291bGRIYXZlU2lkZUVmZmVjdHMoYXN0OiBBc3ROb2RlKSB7IC8vIGFueXRoaW5nIHRoYXQgaXMgbm90IGEgbm91bnBocmFzZSBDT1VMRCBoYXZlIHNpZGUgZWZmZWN0c1xuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7IC8vIHRoaXMgaXMgbm90IG9rLCBpdCdzIGhlcmUganVzdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucyAoc2F2aW5nIGFsbCBvZiB0aGUgbWFjcm9zIGlzIGN1cnJlbnRseSBleHBlbnNpdmUpIFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gISEoYXN0LnR5cGUgPT09ICdzaW1wbGUtc2VudGVuY2UnIHx8IGFzdC50eXBlID09PSAnY29tcGxleC1zZW50ZW5jZScpXG59XG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBhdXRvdml2aWZpY2F0aW9uPzogYm9vbGVhbixcbiAgICBzaWRlRWZmZWN0cz86IGJvb2xlYW4sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBldmFsTWFjcm8oY29udGV4dDogQ29udGV4dCwgbWFjcm86IE1hY3JvKTogVGhpbmdbXSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8ubWFjcm9wYXJ0Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNyby5zdWJqZWN0LnJvb3RcblxuICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub255bW91cyBzeW50YXghJylcbiAgICB9XG5cbiAgICBjb250ZXh0LnNldFN5bnRheChuYW1lLCBzeW50YXgpXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogTWFjcm9wYXJ0KTogTWVtYmVyIHtcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydD8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4Py5ub3VuKVxuXG4gICAgY29uc3QgZXhjZXB0VW5pb25zID0gbWFjcm9QYXJ0Py5leGNlcHR1bmlvbj8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBub3RHcmFtbWFycyA9IGV4Y2VwdFVuaW9ucy5tYXAoeCA9PiB4Py5ub3VuKVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZXM6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IG1hY3JvUGFydFtcImdyYW1tYXItcm9sZVwiXT8ucm9vdCxcbiAgICAgICAgbnVtYmVyOiBtYWNyb1BhcnQuY2FyZGluYWxpdHk/LmNhcmRpbmFsaXR5LFxuICAgICAgICBleGNlcHRUeXBlczogbm90R3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgbm90QXN0OiAhIW1hY3JvUGFydFsnbm90LWFzdC1rZXl3b3JkJ10sXG4gICAgICAgIGV4cGFuZDogISFtYWNyb1BhcnRbJ2V4cGFuZC1rZXl3b3JkJ10sXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBleHRyYXBvbGF0ZSwgTGV4ZW1lIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lJztcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IElkIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL0lkJztcbmltcG9ydCB7IE1hcCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9NYXAnO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gJy4uLy4uL3V0aWxzL3VuaXEnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuXG5leHBvcnQgY2xhc3MgQmFzZVRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHByb3RlY3RlZCBiYXNlczogVGhpbmdbXSA9IFtdLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2hpbGRyZW46IHsgW2lkOiBJZF06IFRoaW5nIH0gPSB7fSxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gW10sXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBnZXRJZCgpOiBJZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkXG4gICAgfVxuXG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IElkIH0pOiBUaGluZyB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKFxuICAgICAgICAgICAgb3B0cz8uaWQgPz8gdGhpcy5pZCwgLy8gY2xvbmVzIGhhdmUgc2FtZSBpZFxuICAgICAgICAgICAgdGhpcy5iYXNlcy5tYXAoeCA9PiB4LmNsb25lKCkpLFxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jaGlsZHJlbikubWFwKGUgPT4gKHsgW2VbMF1dOiBlWzFdLmNsb25lKCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSksXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHRlbmRzID0gKHRoaW5nOiBUaGluZykgPT4ge1xuICAgICAgICB0aGlzLnVuZXh0ZW5kcyh0aGluZykgLy8gb3IgYXZvaWQ/XG4gICAgICAgIHRoaXMuYmFzZXMucHVzaCh0aGluZy5jbG9uZSgpKVxuICAgIH1cblxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNlcyA9IHRoaXMuYmFzZXMuZmlsdGVyKHggPT4geC5nZXRJZCgpICE9PSB0aGluZy5nZXRJZCgpKVxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltwMV0gPz8gdGhpcy5jaGlsZHJlbltpZF1cbiAgICAgICAgY29uc3QgcmVzID0gLyogcGFydHMubGVuZ3RoID4gMSAqLyBjaGlsZC5nZXRJZCgpICE9PSBpZCA/IGNoaWxkLmdldChpZCAvKiBwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykgKi8pIDogY2hpbGRcbiAgICAgICAgcmV0dXJuIHJlcyA/PyB0aGlzLmJhc2VzLmZpbmQoeCA9PiB4LmdldChpZCkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baWRdID0gdGhpbmdcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSAvLyBldmVyeSB0aGluZyBpcyBhIHRoaW5nXG5cbiAgICAgICAgLy9UT0RPXG4gICAgICAgIGlmICh0eXBlb2YgdGhpbmcudG9KcygpID09PSAnc3RyaW5nJykgeyAvL1RPRE8gbWFrZSB0aGlzIHBvbHltb3JwaGljXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdzdHJpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGluZy50b0pzKCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdudW1iZXInLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB8IG51bWJlciB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vVE9ET29vb29vb29vT08hXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy50b0NsYXVzZShxdWVyeSkucXVlcnkocXVlcnksIHsvKiBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCAgKi8gfSkpXG4gICAgfVxuXG4gICAgdG9DbGF1c2UgPSAocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVtZXNcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMubWFwKHIgPT4gY2xhdXNlT2YoeCwgci5nZXRJZCgpKSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgeSA9IE9iamVjdFxuICAgICAgICAgICAgLmtleXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiBjbGF1c2VPZih7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicsIHJlZmVyZW50czogW10gfSwgeCwgdGhpcy5pZCkpIC8vIGhhcmRjb2RlZCBlbmdsaXNoIVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHogPSBPYmplY3RcbiAgICAgICAgICAgIC52YWx1ZXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICByZXR1cm4geC5hbmQoeSkuYW5kKHopLnNpbXBsZVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB1cGRhdGVkOiBMZXhlbWVbXSA9IG9sZC5tYXAoeCA9PiAoeyAuLi54LCAuLi5sZXhlbWUsIHJlZmVyZW50czogWy4uLngucmVmZXJlbnRzLCAuLi5sZXhlbWUucmVmZXJlbnRzXSB9KSlcbiAgICAgICAgdGhpcy5sZXhlbWVzID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIGNvbnN0IHRvQmVBZGRlZCA9IHVwZGF0ZWQubGVuZ3RoID8gdXBkYXRlZCA6IFtsZXhlbWVdXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLnRvQmVBZGRlZClcbiAgICAgICAgY29uc3QgZXh0cmFwb2xhdGVkID0gdG9CZUFkZGVkLmZsYXRNYXAoeCA9PiBleHRyYXBvbGF0ZSh4LCB0aGlzKSlcbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goLi4uZXh0cmFwb2xhdGVkKVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lcyA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lW10gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICB9XG5cbiAgICByZW1vdmVMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBnYXJiYWdlID0gdGhpcy5nZXRMZXhlbWVzKHJvb3RPclRva2VuKS5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMpXG4gICAgICAgIGdhcmJhZ2UuZm9yRWFjaCh4ID0+IGRlbGV0ZSB0aGlzLmNoaWxkcmVuW3guZ2V0SWQoKV0pXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiByb290T3JUb2tlbiAhPT0geC50b2tlbiAmJiByb290T3JUb2tlbiAhPT0geC5yb290KVxuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuIHsgLy9UT0RPOiBpbXBsZW1lbnQgbmVzdGVkIHN0cnVjdHVyYWwgZXF1YWxpdHlcbiAgICAgICAgcmV0dXJuIHRoaXMudG9KcygpID09PSBvdGhlcj8udG9KcygpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIGV4dHJhcG9sYXRlLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29udGV4dCBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSBjb25maWcuc3ludGF4ZXMsXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IGNvbmZpZy5sZXhlbWVzLmZsYXRNYXAobCA9PiBbbCwgLi4uZXh0cmFwb2xhdGUobCldKSxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICkge1xuICAgICAgICBzdXBlcihpZCwgYmFzZXMsIGNoaWxkcmVuLCBsZXhlbWVzKVxuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHsgLy9UT0RPIVxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRzOiBbXSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgfVxuXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWZyZXNoU3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TGlzdFxuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4KSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnbm91bicsIHJvb3Q6IG5hbWUsIHJlZmVyZW50czogW10gfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXhcbiAgICAgICAgdGhpcy5zeW50YXhMaXN0ID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV1cbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlcy5zbGljZSgpIC8vY29weSFcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGNsb25lKCk6IENvbnRleHQge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgICAgICB0aGlzLnN5bnRheE1hcCxcbiAgICAgICAgICAgIHRoaXMubGV4ZW1lcyxcbiAgICAgICAgICAgIHRoaXMuYmFzZXMsXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLCAvL3NoYWxsb3cgb3IgZGVlcD9cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0IH0gZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCBleHRlbmRzIFRoaW5nIHtcbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4KTogdm9pZFxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmdcbiAgICBjbG9uZSgpOiBDb250ZXh0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0KG9wdHM6IHsgaWQ6IElkIH0pOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChvcHRzLmlkKVxufSIsImltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiO1xuXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb25UaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogQXN0Tm9kZSkge1xuICAgICAgICBzdXBlcihnZXRJbmNyZW1lbnRhbElkKCkpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyLCBpZDogSWQgPSB2YWx1ZSArICcnKSB7XG4gICAgICAgIHN1cGVyKGlkKVxuICAgIH1cblxuICAgIG92ZXJyaWRlIHRvSnMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG5cbiAgICBjbG9uZShvcHRzPzogeyBpZDogc3RyaW5nIH0gfCB1bmRlZmluZWQpOiBUaGluZyB7IC8vVE9ETyFcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJUaGluZyh0aGlzLnZhbHVlLCBvcHRzPy5pZClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZywgaWQ6IElkID0gdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdG9KcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCk6IFRoaW5nIHsgLy9UT0RPIVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RoaW5nKHRoaXMudmFsdWUsIG9wdHM/LmlkKVxuICAgIH1cblxufSIsIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGhpbmcge1xuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICBjbG9uZShvcHRzPzogeyBpZDogSWQgfSk6IFRoaW5nXG4gICAgdG9KcygpOiBvYmplY3QgfCBudW1iZXIgfCBzdHJpbmdcbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIGV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIGdldExleGVtZXMocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZVtdXG4gICAgcmVtb3ZlTGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldElkKCk6IElkXG4gICAgZXF1YWxzKG90aGVyOiBUaGluZyk6IGJvb2xlYW5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhpbmcoYXJnczogeyBpZDogSWQsIGJhc2VzOiBUaGluZ1tdIH0pIHtcbiAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhhcmdzLmlkLCBhcmdzLmJhc2VzKVxufSIsIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uL2V2YWwvZXZhbEFzdFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb25UaGluZyB9IGZyb20gXCIuL0luc3RydWN0aW9uVGhpbmdcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBWZXJiIGV4dGVuZHMgVGhpbmcge1xuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IFtyb2xlIGluIFZlcmJBcmdzXTogVGhpbmcgfSk6IFRoaW5nW10gLy8gY2FsbGVkIGRpcmVjdGx5IGluIGV2YWxWZXJiU2VudGVuY2UoKVxufVxuXG50eXBlIFZlcmJBcmdzID0gJ3N1YmplY3QnIC8vVE9ET1xuICAgIHwgJ29iamVjdCdcblxuZXhwb3J0IGNsYXNzIFZlcmJUaGluZyBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIFZlcmIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcmVhZG9ubHkgaW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvblRoaW5nW10sIC8vb3IgSW5zdHJ1Y3Rpb25UaGluZz9cbiAgICApIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgc3ViamVjdDogVGhpbmcsIG9iamVjdDogVGhpbmcsIH0pOiBUaGluZ1tdIHtcblxuICAgICAgICBjb25zdCBjbG9uZWRDb250ZXh0ID0gY29udGV4dC5jbG9uZSgpXG4gICAgICAgIC8vIGluamVjdCBhcmdzLCByZW1vdmUgaGFyY29kZWQgZW5nbGlzaCFcbiAgICAgICAgLy9UT08gSSBndWVzcyBzZXR0aW5nIGNvbnRleHQgb24gY29udGV4dCBzdWJqZWN0IHJlc3VsdHMgaW4gYW4gaW5mIGxvb3AvbWF4IHRvbyBtdWNoIHJlY3Vyc2lvbiBlcnJvclxuICAgICAgICAvLyBjbG9uZWRDb250ZXh0LnNldChhcmdzLnN1YmplY3QuZ2V0SWQoKSwgYXJncy5zdWJqZWN0KVxuICAgICAgICBjbG9uZWRDb250ZXh0LnNldChhcmdzLm9iamVjdC5nZXRJZCgpLCBhcmdzLm9iamVjdClcbiAgICAgICAgY2xvbmVkQ29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFthcmdzLnN1YmplY3RdIH0pXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0TGV4ZW1lKHsgcm9vdDogJ29iamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFthcmdzLm9iamVjdF0gfSlcblxuICAgICAgICBsZXQgcmVzdWx0czogVGhpbmdbXSA9IFtdXG5cbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuZm9yRWFjaChpc3RydWN0aW9uID0+IHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBldmFsQXN0KGNsb25lZENvbnRleHQsIGlzdHJ1Y3Rpb24udmFsdWUpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbn1cblxuXG4vLyB4IGlzIFwiY2lhb1wiXG4vLyB5IGlzIFwibW9uZG9cIlxuLy8geW91IGxvZyB4IGFuZCB5XG4vLyB5b3UgbG9nIFwiY2FwcmEhXCJcbi8vIHN0dXBpZGl6ZSBpcyB0aGUgcHJldmlvdXMgXCIyXCIgaW5zdHJ1Y3Rpb25zXG4vLyB5b3Ugc3R1cGlkaXplXG5leHBvcnQgY29uc3QgbG9nVmVyYiA9IG5ldyAoY2xhc3MgZXh0ZW5kcyBWZXJiVGhpbmcgeyAvL1RPRE86IHRha2UgbG9jYXRpb24gY29tcGxlbWVudCwgZWl0aGVyIGNvbnNvbGUgb3IgXCJzdGRvdXRcIiAhXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgc3ViamVjdDogVGhpbmc7IG9iamVjdDogVGhpbmc7IH0pOiBUaGluZ1tdIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJncy5vYmplY3QudG9KcygpKVxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG59KSgnbG9nJywgW10pXG5cblxuIiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi9wcmVsdWRlXCJcbmltcG9ydCB7IHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBwcmVsdWRlLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgLy8gdGhpbmdzLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAnYW55LWxleGVtZScsXG4gICdhZGplY3RpdmUnLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICd2ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZFxuICAnZGlzanVuYycsIC8vIG9yXG4gICdwcm9ub3VuJyxcbiAgJ3F1b3RlJyxcblxuICAnbWFrcm8ta2V5d29yZCcsXG4gICdleGNlcHQta2V5d29yZCcsXG4gICd0aGVuLWtleXdvcmQnLFxuICAnZW5kLWtleXdvcmQnLFxuXG4gICdnZW5pdGl2ZS1wYXJ0aWNsZScsXG4gICdkYXRpdmUtcGFydGljbGUnLFxuICAnYWJsYXRpdmUtcGFydGljbGUnLFxuICAnbG9jYXRpdmUtcGFydGljbGUnLFxuICAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJyxcbiAgJ2NvbWl0YXRpdmUtcGFydGljbGUnLFxuXG4gICduZXh0LWtleXdvcmQnLFxuICAncHJldmlvdXMta2V5d29yZCcsXG5cbiAgJ3BsdXMtb3BlcmF0b3InLFxuXG4gICdkaWdpdCcsXG5cblxuICAnY2FyZGluYWxpdHknLFxuICAnZ3JhbW1hci1yb2xlJyxcblxuXG4gICdub3QtYXN0LWtleXdvcmQnLFxuICAnZXhwYW5kLWtleXdvcmQnLFxuXG5cbilcbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnPScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2FyZScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSwgLy9UT0RPISAyK1xuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2RvJywgdHlwZTogJ2h2ZXJiJywgdG9rZW46ICdkb2VzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdoYXZlJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtdIH0sLy90ZXN0XG4gICAgeyByb290OiAnbm90JywgdHlwZTogJ25lZ2F0aW9uJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gbG9naWNhbCByb2xlcyBvZiBhIGNvbnN0aXR1ZW50IHRvIGFic3RyYWN0IGF3YXkgd29yZCBvcmRlclxuICAgIHsgcm9vdDogJ3N1YmplY3QnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3ByZWRpY2F0ZScsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb2JqZWN0JywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdjb25kaXRpb24nLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbnNlcXVlbmNlJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvd25lcicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncmVjZWl2ZXInLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29yaWdpbicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnbG9jYXRpb24nLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2luc3RydW1lbnQnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LCAvL21lYW5zXG4gICAgeyByb290OiAnY29tcGFuaW9uJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdzdHJpbmctdG9rZW4nLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29wZXJhdG9yJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd2ZXJib3Jjb3B1bGEnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG5cbiAgICAvLyBudW1iZXIgb2YgdGltZXMgYSBjb25zdGl0dWVudCBjYW4gYXBwZWFyXG4gICAgeyByb290OiAnb3B0aW9uYWwnLCB0eXBlOiAnY2FyZGluYWxpdHknLCBjYXJkaW5hbGl0eTogJzF8MCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbmUtb3ItbW9yZScsIHR5cGU6ICdjYXJkaW5hbGl0eScsIGNhcmRpbmFsaXR5OiAnKycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnY2FyZGluYWxpdHknLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBmb3IgdXNlIGluIGEgcGFydCBvZiBub3VuLXBocmFzZVxuICAgIHsgcm9vdDogJ25leHQnLCB0eXBlOiAnbmV4dC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3ByZXZpb3VzJywgdHlwZTogJ3ByZXZpb3VzLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICdvcicsIHR5cGU6ICdkaXNqdW5jJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuZCcsIHR5cGU6ICdub25zdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2EnLCB0eXBlOiAnaW5kZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW4nLCB0eXBlOiAnaW5kZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndGhlJywgdHlwZTogJ2RlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpZicsIHR5cGU6ICdzdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3doZW4nLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdldmVyeScsIHR5cGU6ICd1bmlxdWFudCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbnknLCB0eXBlOiAndW5pcXVhbnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndGhhdCcsIHR5cGU6ICdyZWxwcm9uJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2l0JywgdHlwZTogJ3Byb25vdW4nLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICdcIicsIHR5cGU6ICdxdW90ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcuJywgdHlwZTogJ2Z1bGxzdG9wJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAndGhlbicsIHR5cGU6ICd0aGVuLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXhjZXB0JywgdHlwZTogJ2V4Y2VwdC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ21ha3JvJywgdHlwZTogJ21ha3JvLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZW5kJywgdHlwZTogJ2VuZC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuXG5cbiAgICB7IHJvb3Q6ICdvZicsIHR5cGU6ICdnZW5pdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0bycsIHR5cGU6ICdkYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZnJvbScsIHR5cGU6ICdhYmxhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbicsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpbicsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhdCcsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdieScsIHR5cGU6ICdpbnN0cnVtZW50YWwtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnd2l0aCcsIHR5cGU6ICdjb21pdGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJysnLCB0eXBlOiAncGx1cy1vcGVyYXRvcicsIHJlZmVyZW50czogW10gfSxcbiAgICBcblxuICAgIHsgcm9vdDogJzAnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnMScsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcyJywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzMnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNCcsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc1JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzYnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNycsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc4JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzknLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG5cblxuICAgIHsgcm9vdDogJ25vdC1hc3QnLCB0eXBlOiAnbm90LWFzdC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V4cGFuZCcsIHR5cGU6ICdleHBhbmQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuXG5dXG5cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmcgPVxuXG4gIGAgXG4gIG1ha3JvXG4gICAgZ2VuaXRpdmUgaXMgbm90LWFzdCBnZW5pdGl2ZS1wYXJ0aWNsZSB0aGVuIG93bmVyIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGRhdGl2ZSBpcyBub3QtYXN0IGRhdGl2ZS1wYXJ0aWNsZSB0aGVuIHJlY2VpdmVyIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGFibGF0aXZlIGlzIG5vdC1hc3QgYWJsYXRpdmUtcGFydGljbGUgdGhlbiBvcmlnaW4gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgbG9jYXRpdmUgaXMgbm90LWFzdCBsb2NhdGl2ZS1wYXJ0aWNsZSB0aGVuIGxvY2F0aW9uIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGluc3RydW1lbnRhbCBpcyBub3QtYXN0IGluc3RydW1lbnRhbC1wYXJ0aWNsZSB0aGVuIGluc3RydW1lbnQgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgY29taXRhdGl2ZSBpcyBub3QtYXN0IGNvbWl0YXRpdmUtcGFydGljbGUgdGhlbiBjb21wYW5pb24gbm91bi1waHJhc2VcbiAgZW5kLlxuICBcbiAgbWFrcm9cbiAgICBhbmQtcGhyYXNlIGlzIG5vbnN1YmNvbmogdGhlbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBsaW1pdC1waHJhc2UgaXMgbmV4dC1rZXl3b3JkIG9yIHByZXZpb3VzLWtleXdvcmQgdGhlbiBvcHRpb25hbCBudW1iZXItbGl0ZXJhbFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBtYXRoLWV4cHJlc3Npb24gaXMgb3BlcmF0b3IgcGx1cy1vcGVyYXRvciB0aGVuIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBub3VuLXBocmFzZSBpcyBcbiAgICBvcHRpb25hbCB1bmlxdWFudFxuICAgIHRoZW4gb3B0aW9uYWwgZXhpc3RxdWFudFxuICAgIHRoZW4gb3B0aW9uYWwgaW5kZWZhcnRcbiAgICB0aGVuIG9wdGlvbmFsIGRlZmFydFxuICAgIHRoZW4gemVyby1vci1tb3JlIGFkamVjdGl2ZXNcbiAgICB0aGVuIG9wdGlvbmFsIGxpbWl0LXBocmFzZSBcbiAgICB0aGVuIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIHN0cmluZyBvciBudW1iZXItbGl0ZXJhbFxuICAgIHRoZW4gb3B0aW9uYWwgbWF0aC1leHByZXNzaW9uXG4gICAgdGhlbiBvcHRpb25hbCBzdWJvcmRpbmF0ZS1jbGF1c2VcbiAgICB0aGVuIGV4cGFuZCBvcHRpb25hbCBnZW5pdGl2ZVxuICAgIHRoZW4gb3B0aW9uYWwgYW5kLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgc2ltcGxlLXNlbnRlbmNlIGlzIFxuICAgIG9wdGlvbmFsIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgdGhlbiBub3QtYXN0IG9wdGlvbmFsIGh2ZXJiIFxuICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgdGhlbiB2ZXJib3Jjb3B1bGEgdmVyYiBvciBjb3B1bGEgXG4gICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgIHRoZW4gZXhwYW5kIHplcm8tb3ItbW9yZSBkYXRpdmUgb3IgYWJsYXRpdmUgb3IgbG9jYXRpdmUgb3IgaW5zdHJ1bWVudGFsIG9yIGNvbWl0YXRpdmVcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvbXBsZXgtc2VudGVuY2Utb25lIGlzIFxuICAgIHN1YmNvbmogXG4gICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gbm90LWFzdCB0aGVuLWtleXdvcmRcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZS10d28gaXMgXG4gICAgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvbXBsZXgtc2VudGVuY2UgaXMgZXhwYW5kIGNvbXBsZXgtc2VudGVuY2Utb25lIG9yIGNvbXBsZXgtc2VudGVuY2UtdHdvXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBzdHJpbmcgaXMgXG4gICAgbm90LWFzdCBxdW90ZSBcbiAgICB0aGVuIG9uZS1vci1tb3JlIHN0cmluZy10b2tlbiBhbnktbGV4ZW1lIGV4Y2VwdCBxdW90ZSBcbiAgICB0aGVuIG5vdC1hc3QgcXVvdGUgXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIG51bWJlci1saXRlcmFsIGlzIG9uZS1vci1tb3JlIGRpZ2l0c1xuICBlbmQuXG5cbiAgYFxuIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4gICAgJ2V4Y2VwdHVuaW9uJyxcblxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2FuZC1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcblxuICAgICdzdWJvcmRpbmF0ZS1jbGF1c2UnLFxuXG4gICAgJ3N0cmluZycsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbiAgICAnc2ltcGxlLXNlbnRlbmNlJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW10gPSBbJ21hY3JvJ11cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ21ha3JvLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91biddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydlbmQta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZXhwYW5kLWtleXdvcmQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdC1hc3Qta2V5d29yZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY2FyZGluYWxpdHknXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dyYW1tYXItcm9sZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydleGNlcHR1bmlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2V4Y2VwdHVuaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXSxcbiAgICAnbm91bi1waHJhc2UnOiBbXSxcbiAgICAnYW5kLXBocmFzZSc6IFtdLFxuICAgICdsaW1pdC1waHJhc2UnOiBbXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW10sXG4gICAgJ3NpbXBsZS1zZW50ZW5jZSc6IFtdLFxuICAgICdzdHJpbmcnOiBbXSxcbiAgICAnY29tcGxleC1zZW50ZW5jZSc6IFtdLFxuICAgICdzdWJvcmRpbmF0ZS1jbGF1c2UnOiBbXSxcbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5ncy9UaGluZ1wiO1xuaW1wb3J0IHsgQnJhaW5MaXN0ZW5lciB9IGZyb20gXCIuLi9mYWNhZGUvQnJhaW5MaXN0ZW5lclwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBwbG90QXN0IH0gZnJvbSBcIi4vcGxvdEFzdFwiO1xuXG5leHBvcnQgY2xhc3MgQXN0Q2FudmFzIGltcGxlbWVudHMgQnJhaW5MaXN0ZW5lciB7XG5cbiAgICByZWFkb25seSBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHByb3RlY3RlZCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuICAgIHByb3RlY3RlZCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsXG4gICAgcHJvdGVjdGVkIGNhbWVyYU9mZnNldCA9IHsgeDogd2luZG93LmlubmVyV2lkdGggLyAyLCB5OiB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyIH1cbiAgICBwcm90ZWN0ZWQgaXNEcmFnZ2luZyA9IGZhbHNlXG4gICAgcHJvdGVjdGVkIGRyYWdTdGFydCA9IHsgeDogMCwgeTogMCB9XG4gICAgcHJvdGVjdGVkIGFzdD86IEFzdE5vZGVcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRpdi5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcylcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQueCA9IGUueCAtIHRoaXMuY2FtZXJhT2Zmc2V0LnhcbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0LnkgPSBlLnkgLSB0aGlzLmNhbWVyYU9mZnNldC55XG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGUgPT4gdGhpcy5pc0RyYWdnaW5nID0gZmFsc2UpXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmFPZmZzZXQueCA9IGUuY2xpZW50WCAtIHRoaXMuZHJhZ1N0YXJ0LnhcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYU9mZnNldC55ID0gZS5jbGllbnRZIC0gdGhpcy5kcmFnU3RhcnQueVxuICAgICAgICAgICAgICAgIHRoaXMucmVwbG90KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBvblVwZGF0ZShhc3Q6IEFzdE5vZGUsIHJlc3VsdHM6IFRoaW5nW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hc3QgPSBhc3RcbiAgICAgICAgdGhpcy5yZXBsb3QoKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZXBsb3QgPSAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQ/LnRyYW5zbGF0ZSh3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQ/LnRyYW5zbGF0ZSgtd2luZG93LmlubmVyV2lkdGggLyAyICsgdGhpcy5jYW1lcmFPZmZzZXQueCwgLXdpbmRvdy5pbm5lckhlaWdodCAvIDIgKyB0aGlzLmNhbWVyYU9mZnNldC55KVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Py5jbGVhclJlY3QoMCwgMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodClcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhcyBjb250ZXh0IGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYXN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3QgaXMgaXMgdW5kZWZpbmVkIScpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsb3RBc3QodGhpcy5jb250ZXh0LCB0aGlzLmFzdClcbiAgICAgICAgfSlcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUsIENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gYXN0VG9FZGdlTGlzdChcbiAgICBhc3Q6IEFzdE5vZGUsXG4gICAgcGFyZW50TmFtZT86IHN0cmluZyxcbiAgICBlZGdlczogRWRnZUxpc3QgPSBbXSxcbik6IEVkZ2VMaXN0IHtcblxuICAgIGNvbnN0IGxpbmtzID0gT2JqZWN0LmVudHJpZXMoYXN0KS5maWx0ZXIoZSA9PiBlWzFdICYmIGVbMV0udHlwZSlcblxuICAgIGNvbnN0IGFzdE5hbWUgPSAoKGFzdCBhcyBMZXhlbWUpLnJvb3QgPz8gYXN0LnR5cGUpICsgcmFuZG9tKClcblxuICAgIGNvbnN0IGFkZGl0aW9uczogRWRnZUxpc3QgPSBbXVxuXG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgICAgYWRkaXRpb25zLnB1c2goW3BhcmVudE5hbWUsIGFzdE5hbWVdKVxuICAgIH1cblxuICAgIGlmICghbGlua3MubGVuZ3RoICYmICEoYXN0IGFzIENvbXBvc2l0ZU5vZGUpLmxpc3QpIHsgLy8gbGVhZiFcbiAgICAgICAgcmV0dXJuIFsuLi5lZGdlcywgLi4uYWRkaXRpb25zXVxuICAgIH1cblxuICAgIGlmIChsaW5rcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGxpbmtzXG4gICAgICAgICAgICAuZmxhdE1hcChlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlemVybyA9IGVbMF0gKyByYW5kb20oKVxuICAgICAgICAgICAgICAgIHJldHVybiBbLi4uYWRkaXRpb25zLCBbYXN0TmFtZSwgZXplcm9dLCAuLi5hc3RUb0VkZ2VMaXN0KGVbMV0sIGV6ZXJvLCBlZGdlcyldXG4gICAgICAgICAgICB9KVxuICAgIH1cblxuICAgIGlmICgoYXN0IGFzIENvbXBvc2l0ZU5vZGUpLmxpc3QpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IChhc3QgYXMgQ29tcG9zaXRlTm9kZSkubGlzdD8uZmxhdE1hcCh4ID0+IGFzdFRvRWRnZUxpc3QoeCwgYXN0TmFtZSwgZWRnZXMpKVxuICAgICAgICByZXR1cm4gWy4uLmFkZGl0aW9ucywgLi4uZWRnZXMsIC4uLmxpc3QgPz8gW11dXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIHJhbmRvbSgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoMTAwMDAwICogTWF0aC5yYW5kb20oKSArICcnKVxufSIsImltcG9ydCB7IEdyYXBoTm9kZSB9IGZyb20gXCIuL05vZGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd0xpbmUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBmcm9tOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0sIHRvOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgLy8gY29udGV4dC5zdHJva2VTdHlsZSA9IGZyb21Ob2RlLnN0cm9rZVN0eWxlXG4gICAgY29udGV4dC5tb3ZlVG8oZnJvbS54LCBmcm9tLnkpXG4gICAgY29udGV4dC5saW5lVG8odG8ueCwgdG8ueSlcbiAgICBjb250ZXh0LnN0cm9rZSgpXG59IiwiaW1wb3J0IHsgR3JhcGhOb2RlIH0gZnJvbSBcIi4vTm9kZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3Tm9kZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5vZGU6IEdyYXBoTm9kZSkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG5vZGUuZmlsbFN0eWxlXG4gICAgY29udGV4dC5hcmMobm9kZS54LCBub2RlLnksIG5vZGUucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSlcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gbm9kZS5zdHJva2VTdHlsZVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gbm9kZS5maWxsU3R5bGVcbiAgICBjb250ZXh0LnN0cm9rZSgpXG4gICAgY29udGV4dC5maWxsKClcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiI0ZGMDAwMFwiXG4gICAgY29udGV4dC5mb250ID0gXCIxMHB4IEFyaWFsXCIvLzIwcHhcbiAgICBjb25zdCB0ZXh0T2Zmc2V0ID0gMTAgKiBub2RlLmxhYmVsLmxlbmd0aCAvIDIgLy9zb21lIG1hZ2ljIGluIGhlcmUhXG4gICAgY29udGV4dC5maWxsVGV4dChub2RlLmxhYmVsLCBub2RlLnggLSB0ZXh0T2Zmc2V0LCBub2RlLnkpXG59XG4iLCJpbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uL3V0aWxzL3VuaXFcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29vcmRzKFxuICAgIGluaXRpYWxQb3M6IENvb3JkaW5hdGUsXG4gICAgZGF0YTogRWRnZUxpc3QsXG4gICAgb2xkQ29vcmRzOiB7IFt4OiBzdHJpbmddOiBDb29yZGluYXRlIH0gPSB7fSxcbiAgICBuZXN0aW5nRmFjdG9yID0gMSxcbik6IHsgW3g6IHN0cmluZ106IENvb3JkaW5hdGUgfSB7XG5cbiAgICBjb25zdCByb290ID0gZ2V0Um9vdChkYXRhKSAvLyBub2RlIHcvb3V0IGEgcGFyZW50XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcmV0dXJuIG9sZENvb3Jkc1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkcmVuID0gZ2V0Q2hpbGRyZW5PZihyb290LCBkYXRhKVxuICAgIGNvbnN0IHJvb3RQb3MgPSBvbGRDb29yZHNbcm9vdF0gPz8gaW5pdGlhbFBvc1xuXG4gICAgY29uc3QgeU9mZnNldCA9IDUwXG4gICAgY29uc3QgeE9mZnNldCA9IDIwMFxuXG4gICAgY29uc3QgY2hpbGRDb29yZHMgPSBjaGlsZHJlblxuICAgICAgICAubWFwKChjLCBpKSA9PiAoeyBbY106IHsgeDogcm9vdFBvcy54ICsgaSAqIG5lc3RpbmdGYWN0b3IgKiB4T2Zmc2V0ICogKGkgJSAyID09IDAgPyAxIDogLTEpLCB5OiByb290UG9zLnkgKyB5T2Zmc2V0ICogKG5lc3RpbmdGYWN0b3IgKyAxKSB9IH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgIGNvbnN0IHJlbWFpbmluZ0RhdGEgPSBkYXRhLmZpbHRlcih4ID0+ICF4LmluY2x1ZGVzKHJvb3QpKVxuICAgIGNvbnN0IHBhcnRpYWxSZXN1bHQgPSB7IC4uLm9sZENvb3JkcywgLi4uY2hpbGRDb29yZHMsIC4uLnsgW3Jvb3RdOiByb290UG9zIH0gfVxuXG4gICAgcmV0dXJuIGdldENvb3Jkcyhpbml0aWFsUG9zLCByZW1haW5pbmdEYXRhLCBwYXJ0aWFsUmVzdWx0LCAwLjkgKiBuZXN0aW5nRmFjdG9yKVxufVxuXG5mdW5jdGlvbiBnZXRSb290KGVkZ2VzOiBFZGdlTGlzdCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGVkZ2VzXG4gICAgICAgIC5mbGF0KCkgLy8gdGhlIG5vZGVzXG4gICAgICAgIC5maWx0ZXIobiA9PiAhZWRnZXMuc29tZShlID0+IGVbMV0gPT09IG4pKVswXVxufVxuXG5mdW5jdGlvbiBnZXRDaGlsZHJlbk9mKHBhcmVudDogc3RyaW5nLCBlZGdlczogRWRnZUxpc3QpIHtcbiAgICByZXR1cm4gdW5pcShlZGdlcy5maWx0ZXIoeCA9PiB4WzBdID09PSBwYXJlbnQpLm1hcCh4ID0+IHhbMV0pKSAvL1RPRE8gZHVwbGljYXRlIGNoaWxkcmVuIGFyZW4ndCBwbG90dGVkIHR3aWNlLCBidXQgc3RpbGwgbWFrZSB0aGUgZ3JhcGggdWdsaWVyIGJlY2F1c2UgdGhleSBhZGQgXCJpXCIgaW5kZWNlcyBpbiBjaGlsZENvb3JkcyBjb21wdXRhdGlvbiBhbmQgbWFrZSBzaW5nbGUgY2hpbGQgZGlzcGxheSBOT1Qgc3RyYWlnaHQgZG93bi5cbn1cbiIsImltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBhc3RUb0VkZ2VMaXN0IH0gZnJvbSBcIi4vYXN0VG9FZGdlTGlzdFwiXG5pbXBvcnQgeyBkcmF3TGluZSB9IGZyb20gXCIuL2RyYXdMaW5lXCJcbmltcG9ydCB7IGRyYXdOb2RlIH0gZnJvbSBcIi4vZHJhd05vZGVcIlxuaW1wb3J0IHsgZ2V0Q29vcmRzIH0gZnJvbSBcIi4vZ2V0Q29vcmRzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHBsb3RBc3QoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBhc3Q6IEFzdE5vZGUpIHtcblxuICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpXG5cbiAgICBjb25zdCByZWN0ID0gY29udGV4dC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGNvbnN0IGVkZ2VzID0gYXN0VG9FZGdlTGlzdChhc3QpXG4gICAgY29uc3QgY29vcmRzID0gZ2V0Q29vcmRzKHsgeDogcmVjdC54IC0gcmVjdC53aWR0aCAvIDIsIHk6IHJlY3QueSB9LCBlZGdlcylcblxuICAgIE9iamVjdC5lbnRyaWVzKGNvb3JkcykuZm9yRWFjaChjID0+IHtcblxuICAgICAgICBjb25zdCBuYW1lID0gY1swXVxuICAgICAgICBjb25zdCBwb3MgPSBjWzFdXG5cbiAgICAgICAgZHJhd05vZGUoY29udGV4dCwge1xuICAgICAgICAgICAgeDogcG9zLngsXG4gICAgICAgICAgICB5OiBwb3MueSxcbiAgICAgICAgICAgIHJhZGl1czogMiwgLy8xMFxuICAgICAgICAgICAgZmlsbFN0eWxlOiAnIzIyY2NjYycsXG4gICAgICAgICAgICBzdHJva2VTdHlsZTogJyMwMDk5OTknLFxuICAgICAgICAgICAgbGFiZWw6IG5hbWUucmVwbGFjZUFsbCgvXFxkKy9nLCAnJylcbiAgICAgICAgfSlcblxuICAgIH0pXG5cbiAgICBlZGdlcy5mb3JFYWNoKGUgPT4ge1xuXG4gICAgICAgIGNvbnN0IGZyb20gPSBjb29yZHNbZVswXV1cbiAgICAgICAgY29uc3QgdG8gPSBjb29yZHNbZVsxXV1cblxuICAgICAgICBpZiAoZnJvbSAmJiB0bykge1xuICAgICAgICAgICAgZHJhd0xpbmUoY29udGV4dCwgZnJvbSwgdG8pXG4gICAgICAgIH1cblxuICAgIH0pXG59XG4iLCJcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vYmFja2VuZC9ldmFsL2V2YWxBc3RcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IHsgQnJhaW5MaXN0ZW5lciB9IGZyb20gXCIuL0JyYWluTGlzdGVuZXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5ncy9UaGluZ1wiO1xuaW1wb3J0IHsgbG9nVmVyYiB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5ncy9WZXJiVGhpbmdcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgcmVhZG9ubHkgY29udGV4dCA9IGdldENvbnRleHQoeyBpZDogJ2dsb2JhbCcgfSlcbiAgICBwcm90ZWN0ZWQgbGlzdGVuZXJzOiBCcmFpbkxpc3RlbmVyW10gPSBbXVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZSh0aGlzLmNvbnRleHQuZ2V0UHJlbHVkZSgpKVxuICAgICAgICB0aGlzLmNvbnRleHQuc2V0KGxvZ1ZlcmIuZ2V0SWQoKSwgbG9nVmVyYilcbiAgICAgICAgdGhpcy5jb250ZXh0LnNldExleGVtZSh7IHJvb3Q6ICdsb2cnLCB0eXBlOiAndmVyYicsIHJlZmVyZW50czogW2xvZ1ZlcmJdIH0pXG4gICAgfVxuXG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdIHtcblxuICAgICAgICByZXR1cm4gbmF0bGFuZy5zcGxpdCgnLicpLmZsYXRNYXAoeCA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBnZXRQYXJzZXIoeCwgdGhpcy5jb250ZXh0KS5wYXJzZUFsbCgpLmZsYXRNYXAoYXN0ID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCByZXN1bHRzOiBUaGluZ1tdID0gW11cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gZXZhbEFzdCh0aGlzLmNvbnRleHQsIGFzdCBhcyBBc3ROb2RlKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbC5vblVwZGF0ZShhc3QsIHJlc3VsdHMpXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzXG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IChvYmplY3QgfCBudW1iZXIgfCBzdHJpbmcpW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHgudG9KcygpKVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaW5jbHVkZXMobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZ3MvVGhpbmdcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4vQnJhaW5MaXN0ZW5lclwiXG5cbi8qKlxuICogQSBmYWNhZGUgdG8gdGhlIERlaXhpc2NyaXB0IGludGVycHJldGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXVxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogKG9iamVjdCB8IG51bWJlciB8IHN0cmluZylbXVxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgdG9rZW5zOiBMZXhlbWVbXSA9IFtdXG4gICAgcHJvdGVjdGVkIHdvcmRzOiBzdHJpbmdbXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXIgPSAwXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQpIHtcblxuICAgICAgICB0aGlzLndvcmRzID1cbiAgICAgICAgICAgIHNwYWNlT3V0KHNvdXJjZUNvZGUsIFsnXCInLCAnLicsICcwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5J10pXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICB9XG5cbiAgICByZWZyZXNoVG9rZW5zKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMud29yZHMubWFwKHcgPT4gdGhpcy5jb250ZXh0LmdldExleGVtZXModykuYXQoMCkgPz8gbWFrZUxleGVtZSh7IHJvb3Q6IHcsIHRva2VuOiB3LCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW10gfSkpXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHNwYWNlT3V0KHNvdXJjZUNvZGU6IHN0cmluZywgc3BlY2lhbENoYXJzOiBzdHJpbmdbXSkge1xuXG4gICAgcmV0dXJuIHNvdXJjZUNvZGVcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAucmVkdWNlKChhLCBjKSA9PiBhICsgKHNwZWNpYWxDaGFycy5pbmNsdWRlcyhjKSA/ICcgJyArIGMgKyAnICcgOiBjKSwgJycpXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmdzL1RoaW5nXCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZTxUIGV4dGVuZHMgTGV4ZW1lVHlwZSA9IExleGVtZVR5cGU+IHtcbiAgICByZWFkb25seSByb290OiBzdHJpbmdcbiAgICByZWFkb25seSB0eXBlOiBUXG4gICAgcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbiAgICByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVmZXJlbnRzOiBUaGluZ1tdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IExleGVtZSk6IExleGVtZSB7XG4gICAgcmV0dXJuIGRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGx1cmFsKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGlzUmVwZWF0YWJsZShsZXhlbWUuY2FyZGluYWxpdHkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYXBvbGF0ZShsZXhlbWU6IExleGVtZSwgY29udGV4dD86IFRoaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicgJiYgIWlzUGx1cmFsKGxleGVtZSkpIHtcbiAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogcGx1cmFsaXplKGxleGVtZS5yb290KSxcbiAgICAgICAgICAgIGNhcmRpbmFsaXR5OiAnKicsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSldXG4gICAgfVxuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAndmVyYicpIHtcbiAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZShsZXhlbWUucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHgsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZ3MvQ29udGV4dFwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUodmVyYjpzdHJpbmcpe1xuICAgIHJldHVybiBbdmVyYisncyddXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHBsdXJhbGl6ZShyb290OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcm9vdCArICdzJ1xufSIsImltcG9ydCB7IEFzdE5vZGUsIENvbXBvc2l0ZU5vZGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyLCBTeW50YXggfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZ3MvQ29udGV4dFwiXG5cblxuZXhwb3J0IGNsYXNzIEtvb2xQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbGV4ZXIgPSBnZXRMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IEFzdE5vZGVbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNzdCA9IHRoaXMudHJ5UGFyc2UodGhpcy5jb250ZXh0LmdldFN5bnRheExpc3QoKSlcblxuICAgICAgICAgICAgaWYgKCFjc3QpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnNpbXBsaWZ5KGNzdClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChhc3QpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxleGVyLnBlZWs/LnR5cGUgPT09ICdmdWxsc3RvcCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuXG4gICAgcHJvdGVjdGVkIHRyeVBhcnNlKHR5cGVzOiBBc3RUeXBlW10sIGV4Y2VwdFR5cGVzPzogQXN0VHlwZVtdKSB7IC8vcHJvYmxlbWF0aWNcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQpXG5cbiAgICAgICAgICAgIGlmICh4ICYmICFleGNlcHRUeXBlcz8uaW5jbHVkZXMoeC50eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUpOiBDc3QgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcbiAgICAgICAgLy8gaWYgdGhlIHN5bnRheCBpcyBhbiBcInVub2ZmaWNpYWxcIiBBU1QsIGFrYSBhIENTVCwgZ2V0IHRoZSBuYW1lIG9mIHRoZSBcbiAgICAgICAgLy8gYWN0dWFsIEFTVCBhbmQgcGFzcyBpdCBkb3duIHRvIHBhcnNlIGNvbXBvc2l0ZVxuXG4gICAgICAgIGlmICh0aGlzLmlzTGVhZihuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMZWFmKG5hbWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNvbXBvc2l0ZShuYW1lIGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheClcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChuYW1lOiBBc3RUeXBlKTogQ3N0IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobmFtZSA9PT0gdGhpcy5sZXhlci5wZWVrLnR5cGUgfHwgbmFtZSA9PT0gJ2FueS1sZXhlbWUnKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHN5bnRheDogU3ludGF4KTogQ3N0IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaW5rczogeyBbeDogc3RyaW5nXTogQ3N0IH0gPSB7fVxuXG4gICAgICAgIGZvciAoY29uc3QgbSBvZiBzeW50YXgpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIC4uLmxpbmtzXG4gICAgICAgIH0gYXMgYW55IC8vIFRPRE8hXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlcik6IENzdCB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogYW55W10gPSBbXSAvLyBUT0RPIVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZXMsIG0uZXhjZXB0VHlwZXMpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiBsaXN0WzBdLnR5cGUsXG4gICAgICAgICAgICBsaXN0OiBsaXN0LFxuICAgICAgICAgICAgbm90QXN0OiBtLm5vdEFzdCxcbiAgICAgICAgICAgIGV4cGFuZDogbS5leHBhbmQsXG4gICAgICAgIH0pIDoge1xuICAgICAgICAgICAgLi4ubGlzdFswXSxcbiAgICAgICAgICAgIG5vdEFzdDogbS5ub3RBc3QsXG4gICAgICAgICAgICBleHBhbmQ6IG0uZXhwYW5kLFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNMZWFmID0gKHQ6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5nZXRMZXhlbWVUeXBlcygpLmluY2x1ZGVzKHQgYXMgTGV4ZW1lVHlwZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2ltcGxpZnkoY3N0OiBDc3QpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoY3N0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgICAgIHJldHVybiBjc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzTGVhZihjc3QudHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSBjc3QudHlwZVxuICAgICAgICBjb25zdCBsaW5rcyA9IGxpbmtzT2YoY3N0KVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnbGlua3M9JywgbGlua3MpXG4gICAgICAgIGNvbnN0IGV4cGFuZGVkID0gbGlua3MuZmxhdE1hcChlID0+IGVbMV0uZXhwYW5kID8gbGlua3NPZihlWzFdKSA6IFtlXSlcbiAgICAgICAgY29uc29sZS5sb2codHlwZSwgJ2V4cGFuZGVkPScsIGV4cGFuZGVkKVxuICAgICAgICBjb25zdCBzaW1wbGlmaWVkID0gZXhwYW5kZWQubWFwKGUgPT4gW2VbMF0sIHRoaXMuc2ltcGxpZnkoZVsxXSkgYXMgQ3N0XSBhcyBjb25zdClcbiAgICAgICAgY29uc29sZS5sb2codHlwZSwgJ3NpbXBsaWZpZWQ9Jywgc2ltcGxpZmllZClcbiAgICAgICAgY29uc3QgYXN0TGlua3MgPSBzaW1wbGlmaWVkLmZpbHRlcihlID0+ICFlWzFdLm5vdEFzdClcbiAgICAgICAgY29uc29sZS5sb2codHlwZSwgJ2FzdExpbmtzPScsIGFzdExpbmtzKVxuICAgICAgICBjb25zdCBhc3Q6IEFzdE5vZGUgPSBPYmplY3QuZnJvbUVudHJpZXMoYXN0TGlua3MpIGFzIGFueVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnYXN0PScsIGFzdClcbiAgICAgICAgY29uc3QgYXN0V2l0aFR5cGUgPSB7IC4uLmFzdCwgdHlwZSB9IGFzIEFzdE5vZGVcbiAgICAgICAgY29uc29sZS5sb2codHlwZSwgJ2FzdFdpdGhUeXBlPScsIGFzdFdpdGhUeXBlKVxuXG4gICAgICAgIHJldHVybiBhc3RXaXRoVHlwZVxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBsaW5rc09mKGNzdDogQ3N0KTogW3N0cmluZywgQ3N0XVtdIHtcblxuICAgIGNvbnN0IGxpc3QgPSAoY3N0IGFzIENvbXBvc2l0ZU5vZGUpLmxpc3QgYXMgQ3N0W10gfCB1bmRlZmluZWRcblxuICAgIGlmIChsaXN0KSB7XG4gICAgICAgIGNvbnN0IGZsYXR0ZW5lZCA9IGxpc3QuZmxhdE1hcCh4ID0+IGxpbmtzT2YoeCkpXG4gICAgICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gZXhwYW5kIGxpc3QhJywgbGlzdCwgZmxhdHRlbmVkKVxuICAgICAgICByZXR1cm4gZmxhdHRlbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGNzdCkuZmlsdGVyKGUgPT4gZVsxXSAmJiBlWzFdLnR5cGUpXG59XG5cblxudHlwZSBDc3QgPSBBc3ROb2RlICYgeyBub3RBc3Q/OiBib29sZWFuLCBleHBhbmQ/OiBib29sZWFuIH1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZXMpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgcnVuVGVzdHMgfSBmcm9tIFwiLi4vLi4vdGVzdHMvcnVuVGVzdHNcIjtcbmltcG9ydCB7IGNsZWFyRG9tIH0gZnJvbSBcIi4uLy4uL3Rlc3RzL3V0aWxzL2NsZWFyRG9tXCI7XG5pbXBvcnQgeyBBc3RDYW52YXMgfSBmcm9tIFwiLi4vZHJhdy1hc3QvQXN0Q2FudmFzXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gYnJhaW5cblxuICAgIGNvbnN0IGFzdENhbnZhcyA9IG5ldyBBc3RDYW52YXMoKVxuICAgIGJyYWluLmFkZExpc3RlbmVyKGFzdENhbnZhcylcblxuICAgIGNvbnN0IGxlZnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHJpZ2h0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGNvbnN0IHNwbGl0ID0gJ2hlaWdodDogMTAwJTsgd2lkdGg6IDUwJTsgcG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyB0b3A6IDA7ICBwYWRkaW5nLXRvcDogMjBweDsnXG4gICAgY29uc3QgbGVmdCA9ICdsZWZ0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExOydcbiAgICBjb25zdCByaWdodCA9ICdyaWdodDogMDsgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsnXG5cbiAgICBsZWZ0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIGxlZnRcbiAgICByaWdodERpdi5zdHlsZS5jc3NUZXh0ID0gc3BsaXQgKyByaWdodCArICdvdmVyZmxvdzpzY3JvbGw7JyArICdvdmVyZmxvdy14OnNjcm9sbDsnICsgJ292ZXJmbG93LXk6c2Nyb2xsOydcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGVmdERpdilcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJpZ2h0RGl2KVxuXG4gICAgcmlnaHREaXYuYXBwZW5kQ2hpbGQoYXN0Q2FudmFzLmRpdilcblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcblxuICAgIGNvbnN0IGNvbnNvbGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS53aWR0aCA9ICc0MHZ3J1xuICAgIGNvbnNvbGVPdXRwdXQuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZChjb25zb2xlT3V0cHV0KVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGVPdXRwdXQudmFsdWUgPSByZXN1bHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgYXdhaXQgcnVuVGVzdHMoKVxuICAgICAgICAgICAgbWFpbigpXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcbi8vIGltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuICAgIH1cblxuICAgIC8vIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgXG59IiwiaW1wb3J0IHsgQXRvbUNsYXVzZSB9IGZyb20gXCIuL0F0b21DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQW4gdW5hbWJpZ3VvdXMgcHJlZGljYXRlLWxvZ2ljLWxpa2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgcHJvZ3JhbW1lcidzIGludGVudC5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG4gICAgLy8gaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQgfHVuZGVmaW5lZCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF0pOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF1cblxuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJcbi8qKlxuICogQ2hlY2tzIGlmIHN0cmluZyBoYXMgc29tZSBub24tZGlnaXQgY2hhciAoZXhjZXB0IGZvciBcIi5cIikgYmVmb3JlXG4gKiBjb252ZXJ0aW5nIHRvIG51bWJlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTnVtYmVyKHN0cmluZzogc3RyaW5nKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG5vbkRpZyA9IHN0cmluZy5tYXRjaCgvXFxEL2cpPy5hdCgwKVxuXG4gICAgaWYgKG5vbkRpZyAmJiBub25EaWcgIT09ICcuJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoc3RyaW5nKVxuXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgY29uc3Qgc2VlbjogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiaW1wb3J0IHsgdGVzdDEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MVwiO1xuaW1wb3J0IHsgdGVzdDIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MlwiO1xuaW1wb3J0IHsgdGVzdDMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0M1wiO1xuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0Myxcbl1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blRlc3RzKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0ZXN0KClcbiAgICAgICAgY29uc29sZS5sb2coYCVjJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnfSAke3Rlc3QubmFtZX1gLCBgY29sb3I6JHtzdWNjZXNzID8gJ2dyZWVuJyA6ICdyZWQnfWApXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyAxJylcbiAgICBicmFpbi5leGVjdXRlKCd5IGlzIDInKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBudW1iZXInKS5ldmVyeSh4ID0+IFsxLCAyXS5pbmNsdWRlcyh4IGFzIG51bWJlcikpXG59IiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCA9IDEgKyAzICsgNCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5pbmNsdWRlcyg4KVxuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd0aGUgbnVtYmVyJykuaW5jbHVkZXMoOClcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4ID0gMS4geSA9Mi4nKVxuICAgIGNvbnN0IG51bWJlcnMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBudW1iZXIgKyAzJylcbiAgICByZXR1cm4gbnVtYmVycy5pbmNsdWRlcyg0KSAmJiBudW1iZXJzLmluY2x1ZGVzKDUpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9