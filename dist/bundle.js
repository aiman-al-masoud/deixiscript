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
    else if (ast.type === 'copula-sentence') {
        return evalCopulaSentence(context, ast, args);
    }
    else if (ast.type === 'verb-sentence') {
        return evalVerbSentence(context, ast, args);
    }
    else if (ast.subconj) {
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
        const rVal = evalAst(context, ast.predicate, { subject: subjectId });
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
        const predicate = evalAst(context, ast.predicate, args).at(0);
        return (subject === null || subject === void 0 ? void 0 : subject.equals(predicate)) && (!ast.negation) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.warn('problem with copula sentence!');
    return [];
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
function evalVerbSentence(context, ast, args) {
    const verb = ast.verb.referents.at(0);
    const subject = ast.subject ? evalAst(context, ast.subject).at(0) : undefined;
    const object = ast.object ? evalAst(context, ast.object).at(0) : undefined;
    // console.log('verb=', verb)
    // console.log('subject=', subject)
    // console.log('object=', object)
    // console.log('complements=', complements)
    if (!verb) {
        throw new Error('no such verb ' + ast.verb.root);
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
    const genitiveComplement = genitiveToClause(ast === null || ast === void 0 ? void 0 : ast['genitive-complement'], { subject: subjectId, autovivification: false, sideEffects: false });
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
    const genitiveParticle = ast['genitive-particle'];
    const owner = nounPhraseToClause(ast.owner, { subject: ownerId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)(genitiveParticle, ownedId, ownerId).and(owner);
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
    return !!(ast.type === 'copula-sentence' || ast.type === 'verb-sentence' || ast.subconj);
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
    genitive-complement is genitive-particle then owner noun-phrase
  end.

  makro
    dative-complement is dative-particle then receiver noun-phrase
  end.

  makro
    ablative-complement is ablative-particle then origin noun-phrase
  end.

  makro
    locative-complement is locative-particle then location noun-phrase
  end.

  makro
    instrumental-complement is instrumental-particle then instrument noun-phrase
  end.

  makro
    comitative-complement is comitative-particle then companion noun-phrase
  end.

  makro 
    complement is 
    genitive-complement or 
    dative-complement or
    ablative-complement or
    locative-complement or
    instrumental-complement or
    comitative-complement
  end.

  makro 
    copula-sentence is 
    subject noun-phrase 
    then copula 
    then optional negation 
    then predicate noun-phrase 
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
    then optional genitive-complement
    then optional and-phrase
  end.

  makro 
    verb-sentence is 
    optional subject noun-phrase 
    then optional hverb 
    then optional negation 
    then verb 
    then optional object noun-phrase
    then expand zero-or-more complements
  end.

  makro 
    simple-sentence is copula-sentence or verb-sentence 
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
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion', 'exceptunion', 'noun-phrase', 'and-phrase', 'limit-phrase', 'math-expression', 'copula-sentence', 'verb-sentence', 'complex-sentence', 'genitive-complement', 'dative-complement', 'ablative-complement', 'locative-complement', 'instrumental-complement', 'comitative-complement', 'subordinate-clause', 'string', 'number-literal');
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
    'genitive-complement': [],
    'copula-sentence': [],
    'verb-sentence': [],
    'string': [],
    'complex-sentence': [],
    "dative-complement": [],
    "ablative-complement": [],
    "locative-complement": [],
    "instrumental-complement": [],
    "comitative-complement": [],
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
                list: list
            }) : list[0];
        };
        this.isLeaf = (t) => {
            return this.context.getLexemeTypes().includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.context.getSyntaxList());
            if (!ast) {
                break;
            }
            const simpleAst = this.simplify(ast);
            results.push(simpleAst);
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
    simplify(ast) {
        if (this.isLeaf(ast.type) || ast.list) { // if no links return ast
            return ast;
        }
        const syntax = this.context.getSyntax(ast.type);
        if (syntax.length === 1) {
            const v = Object.values(ast).filter(x => x && x.type).filter(x => x);
            return v[0];
        }
        const simpleLinks = Object
            .entries(ast)
            .filter(x => x.type)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        return Object.assign(Object.assign({}, ast), simpleLinks);
    }
}
exports.KoolParser = KoolParser;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUU3RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQy9DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFOUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTlDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDckQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUduRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFHbkQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUcz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Q0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBVyxDQUFDLENBQUM7QUFDMUYsQ0FBQztBQUxELHNCQUtDOzs7Ozs7Ozs7Ozs7OztBQ1BELCtGQUFrRDtBQUVsRCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sS0FBSyxHQUFHLG9CQUFRLEdBQUU7SUFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQztJQUN2QyxPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1dBQ3ZDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFMRCxzQkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwrRkFBa0Q7QUFFbEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxHQUFFO0lBQ3hCLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQzdCLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUMxRCxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUxELHNCQUtDOzs7Ozs7O1VDUEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZXZhbC9ldmFsQXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQmFzZVRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL0luc3RydWN0aW9uVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9OdW1iZXJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL1N0cmluZ1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9WZXJiVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9wcmVsdWRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvQXN0Q2FudmFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvYXN0VG9FZGdlTGlzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2RyYXdMaW5lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZHJhd05vZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9nZXRDb29yZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9wbG90QXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0F0b21DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9FbXB0eUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9nZXRPd25lcnNoaXBDaGFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy9zb2x2ZU1hcHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL2lkVG9OdW0udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvaWQvZnVuY3Rpb25zL3NvcnRJZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaW50ZXJzZWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvcGFyc2VOdW1iZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9zdHJpbmdMaXRlcmFscy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3VuaXEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3J1blRlc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0MS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsIlxuaW1wb3J0IHsgaXNQbHVyYWwsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gJy4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZSc7XG5pbXBvcnQgeyBBbmRQaHJhc2UsIEFzdE5vZGUsIENvbXBsZXhTZW50ZW5jZSwgQ29wdWxhU2VudGVuY2UsIEdlbml0aXZlQ29tcGxlbWVudCwgTWFjcm8sIE1hY3JvcGFydCwgTm91blBocmFzZSwgTnVtYmVyTGl0ZXJhbCwgU3RyaW5nTGl0ZXJhbCwgVmVyYlNlbnRlbmNlIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZSc7XG5pbXBvcnQgeyBwYXJzZU51bWJlciB9IGZyb20gJy4uLy4uL3V0aWxzL3BhcnNlTnVtYmVyJztcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluJztcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWQnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSAnLi4vdGhpbmdzL0NvbnRleHQnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb25UaGluZyB9IGZyb20gJy4uL3RoaW5ncy9JbnN0cnVjdGlvblRoaW5nJztcbmltcG9ydCB7IE51bWJlclRoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL051bWJlclRoaW5nJztcbmltcG9ydCB7IFN0cmluZ1RoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL1N0cmluZ1RoaW5nJztcbmltcG9ydCB7IFRoaW5nLCBnZXRUaGluZyB9IGZyb20gJy4uL3RoaW5ncy9UaGluZyc7XG5pbXBvcnQgeyBWZXJiVGhpbmcgfSBmcm9tICcuLi90aGluZ3MvVmVyYlRoaW5nJztcbmltcG9ydCB7IE1lbWJlciwgQXN0VHlwZSB9IGZyb20gJy4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxBc3QoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzOiBUb0NsYXVzZU9wdHMgPSB7fSk6IFRoaW5nW10ge1xuXG4gICAgYXJncy5zaWRlRWZmZWN0cyA/Pz0gY291bGRIYXZlU2lkZUVmZmVjdHMoYXN0KVxuXG4gICAgaWYgKGFyZ3Muc2lkZUVmZmVjdHMpIHsgLy8gb25seSBjYWNoZSBpbnN0cnVjdGlvbnMgd2l0aCBzaWRlIGVmZmVjdHNcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBuZXcgSW5zdHJ1Y3Rpb25UaGluZyhhc3QpXG4gICAgICAgIGNvbnRleHQuc2V0KGluc3RydWN0aW9uLmdldElkKCksIGluc3RydWN0aW9uKVxuICAgICAgICBjb250ZXh0LnNldExleGVtZShtYWtlTGV4ZW1lKHsgcm9vdDogJ2luc3RydWN0aW9uJywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFtpbnN0cnVjdGlvbl0gfSkpXG4gICAgfVxuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7XG4gICAgICAgIHJldHVybiBldmFsTWFjcm8oY29udGV4dCwgYXN0KVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdjb3B1bGEtc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICd2ZXJiLXNlbnRlbmNlJykge1xuICAgICAgICByZXR1cm4gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmICgoYXN0IGFzIENvbXBsZXhTZW50ZW5jZSkuc3ViY29uaikge1xuICAgICAgICByZXR1cm4gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0LCBhc3QgYXMgQ29tcGxleFNlbnRlbmNlLCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09ICdub3VuLXBocmFzZScpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9XG5cbiAgICBjb25zb2xlLndhcm4oYXN0KVxuICAgIHRocm93IG5ldyBFcnJvcignZXZhbEFzdCgpIGdvdCB1bmV4cGVjdGVkIGFzdCB0eXBlOiAnICsgYXN0LnR5cGUpXG5cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBDb3B1bGFTZW50ZW5jZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKGFyZ3M/LnNpZGVFZmZlY3RzKSB7IC8vIGFzc2lnbiB0aGUgcmlnaHQgdmFsdWUgdG8gdGhlIGxlZnQgdmFsdWVcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdC5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5zaW1wbGVcbiAgICAgICAgY29uc3QgclZhbCA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnByZWRpY2F0ZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICAgICAgY29uc3Qgb3duZXJDaGFpbiA9IGdldE93bmVyc2hpcENoYWluKHN1YmplY3QpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KHN1YmplY3QpXG4gICAgICAgIGNvbnN0IGxleGVtZXMgPSBzdWJqZWN0LmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGUhKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICBjb25zdCBsZXhlbWVzV2l0aFJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWwgfSkpXG5cbiAgICAgICAgaWYgKHJWYWwuZXZlcnkoeCA9PiB4IGluc3RhbmNlb2YgSW5zdHJ1Y3Rpb25UaGluZykpIHsgLy8gbWFrZSB2ZXJiIGZyb20gaW5zdHJ1Y3Rpb25zXG4gICAgICAgICAgICBjb25zdCB2ZXJiID0gbmV3IFZlcmJUaGluZyhnZXRJbmNyZW1lbnRhbElkKCksIHJWYWwgYXMgSW5zdHJ1Y3Rpb25UaGluZ1tdKVxuICAgICAgICAgICAgY29udGV4dC5zZXQodmVyYi5nZXRJZCgpLCB2ZXJiKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhSZWZlcmVudDogTGV4ZW1lW10gPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogW3ZlcmJdLCB0eXBlOiAndmVyYicgfSkpXG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJldHVybiBbdmVyYl1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWFwcy5sZW5ndGggJiYgb3duZXJDaGFpbi5sZW5ndGggPD0gMSkgeyAvLyBsVmFsIGlzIGNvbXBsZXRlbHkgbmV3XG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWwuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0KHguZ2V0SWQoKSwgeCkpXG4gICAgICAgICAgICByZXR1cm4gclZhbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hcHMubGVuZ3RoICYmIG93bmVyQ2hhaW4ubGVuZ3RoIDw9IDEpIHsgLy8gcmVhc3NpZ25tZW50XG4gICAgICAgICAgICBsZXhlbWVzLmZvckVhY2goeCA9PiBjb250ZXh0LnJlbW92ZUxleGVtZSh4LnJvb3QpKVxuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsLmZvckVhY2goeCA9PiBjb250ZXh0LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvd25lckNoYWluLmxlbmd0aCA+IDEpIHsgLy8gbFZhbCBpcyBwcm9wZXJ0eSBvZiBleGlzdGluZyBvYmplY3RcbiAgICAgICAgICAgIGNvbnN0IGFib3V0T3duZXIgPSBhYm91dChzdWJqZWN0LCBvd25lckNoYWluLmF0KC0yKSEpXG4gICAgICAgICAgICBjb25zdCBvd25lcnMgPSBnZXRJbnRlcmVzdGluZ0lkcyhjb250ZXh0LnF1ZXJ5KGFib3V0T3duZXIpLCBhYm91dE93bmVyKS5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpISkuZmlsdGVyKHggPT4geClcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gb3duZXJzLmF0KDApXG4gICAgICAgICAgICBjb25zdCByVmFsQ2xvbmUgPSByVmFsLm1hcCh4ID0+IHguY2xvbmUoeyBpZDogb3duZXI/LmdldElkKCkgKyAnLicgKyB4LmdldElkKCkgfSkpXG4gICAgICAgICAgICBjb25zdCBsZXhlbWVzV2l0aENsb25lUmVmZXJlbnQgPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogclZhbENsb25lIH0pKVxuICAgICAgICAgICAgbGV4ZW1lc1dpdGhDbG9uZVJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWxDbG9uZS5mb3JFYWNoKHggPT4gb3duZXI/LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxDbG9uZVxuICAgICAgICB9XG5cbiAgICB9IGVsc2UgeyAvLyBjb21wYXJlIHRoZSByaWdodCBhbmQgbGVmdCB2YWx1ZXNcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnN1YmplY3QsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnByZWRpY2F0ZSwgYXJncykuYXQoMClcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q/LmVxdWFscyhwcmVkaWNhdGUhKSAmJiAoIWFzdC5uZWdhdGlvbikgPyBbbmV3IE51bWJlclRoaW5nKDEpXSA6IFtdXG4gICAgfVxuXG4gICAgY29uc29sZS53YXJuKCdwcm9ibGVtIHdpdGggY29wdWxhIHNlbnRlbmNlIScpXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGFib3V0KGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKSB7XG4gICAgcmV0dXJuIGNsYXVzZS5mbGF0TGlzdCgpLmZpbHRlcih4ID0+IHguZW50aXRpZXMuaW5jbHVkZXMoZW50aXR5KSAmJiB4LmVudGl0aWVzLmxlbmd0aCA8PSAxKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSkuc2ltcGxlXG59XG5cbmZ1bmN0aW9uIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBWZXJiU2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHsgLy9UT0RPOiBtdWx0aXBsZSBzdWJqZWN0cy9vYmplY3RzXG5cbiAgICBjb25zdCB2ZXJiID0gYXN0LnZlcmIucmVmZXJlbnRzLmF0KDApIGFzIFZlcmJUaGluZyB8IHVuZGVmaW5lZFxuICAgIGNvbnN0IHN1YmplY3QgPSBhc3Quc3ViamVjdCA/IGV2YWxBc3QoY29udGV4dCwgYXN0LnN1YmplY3QpLmF0KDApIDogdW5kZWZpbmVkXG4gICAgY29uc3Qgb2JqZWN0ID0gYXN0Lm9iamVjdCA/IGV2YWxBc3QoY29udGV4dCwgYXN0Lm9iamVjdCkuYXQoMCkgOiB1bmRlZmluZWRcblxuICAgIC8vIGNvbnNvbGUubG9nKCd2ZXJiPScsIHZlcmIpXG4gICAgLy8gY29uc29sZS5sb2coJ3N1YmplY3Q9Jywgc3ViamVjdClcbiAgICAvLyBjb25zb2xlLmxvZygnb2JqZWN0PScsIG9iamVjdClcbiAgICAvLyBjb25zb2xlLmxvZygnY29tcGxlbWVudHM9JywgY29tcGxlbWVudHMpXG5cbiAgICBpZiAoIXZlcmIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIHZlcmIgJyArIGFzdC52ZXJiLnJvb3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcmIucnVuKGNvbnRleHQsIHsgc3ViamVjdDogc3ViamVjdCA/PyBjb250ZXh0LCBvYmplY3Q6IG9iamVjdCA/PyBjb250ZXh0IH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBDb21wbGV4U2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhc3Quc3ViY29uai5yb290ID09PSAnaWYnKSB7XG5cbiAgICAgICAgaWYgKGV2YWxBc3QoY29udGV4dCwgYXN0LmNvbmRpdGlvbiwgeyAuLi5hcmdzLCBzaWRlRWZmZWN0czogZmFsc2UgfSkubGVuZ3RoKSB7XG4gICAgICAgICAgICBldmFsQXN0KGNvbnRleHQsIGFzdC5jb25zZXF1ZW5jZSwgeyAuLi5hcmdzLCBzaWRlRWZmZWN0czogdHJ1ZSB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gZXZhbE5vdW5QaHJhc2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBOb3VuUGhyYXNlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBjb25zdCBucCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3QsIGFyZ3MpXG4gICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkobnApIC8vIFRPRE86IGludHJhLXNlbnRlbmNlIGFuYXBob3JhIHJlc29sdXRpb25cbiAgICBjb25zdCBpbnRlcmVzdGluZ0lkcyA9IGdldEludGVyZXN0aW5nSWRzKG1hcHMsIG5wKVxuICAgIGxldCB0aGluZ3M6IFRoaW5nW11cbiAgICBjb25zdCBhbmRQaHJhc2UgPSBhc3RbJ2FuZC1waHJhc2UnXSA/IGV2YWxBc3QoY29udGV4dCwgYXN0WydhbmQtcGhyYXNlJ10/Llsnbm91bi1waHJhc2UnXSwgYXJncykgOiBbXVxuXG4gICAgaWYgKGFzdC5zdWJqZWN0LnR5cGUgPT09ICdudW1iZXItbGl0ZXJhbCcpIHtcbiAgICAgICAgdGhpbmdzID0gYW5kUGhyYXNlLmNvbmNhdChldmFsTnVtYmVyTGl0ZXJhbChhc3Quc3ViamVjdCkpXG4gICAgfSBlbHNlIGlmIChhc3Quc3ViamVjdC50eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGluZ3MgPSBldmFsU3RyaW5nKGNvbnRleHQsIGFzdC5zdWJqZWN0LCBhcmdzKS5jb25jYXQoYW5kUGhyYXNlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaW5ncyA9IGludGVyZXN0aW5nSWRzLm1hcChpZCA9PiBjb250ZXh0LmdldChpZCkpLmZpbHRlcih4ID0+IHgpLm1hcCh4ID0+IHghKSAvLyBUT0RPIHNvcnQgYnkgaWRcbiAgICB9XG5cbiAgICBpZiAoYXN0WydtYXRoLWV4cHJlc3Npb24nXSkge1xuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpbmdzXG4gICAgICAgIGNvbnN0IG9wID0gYXN0WydtYXRoLWV4cHJlc3Npb24nXS5vcGVyYXRvclxuICAgICAgICBjb25zdCByaWdodCA9IGV2YWxBc3QoY29udGV4dCwgYXN0WydtYXRoLWV4cHJlc3Npb24nXT8uWydub3VuLXBocmFzZSddKVxuICAgICAgICByZXR1cm4gZXZhbE9wZXJhdGlvbihsZWZ0LCByaWdodCwgb3ApXG4gICAgfVxuXG4gICAgaWYgKGlzQXN0UGx1cmFsKGFzdCkgfHwgYXN0WydhbmQtcGhyYXNlJ10pIHsgLy8gaWYgdW5pdmVyc2FsIHF1YW50aWZpZWQsIEkgZG9uJ3QgY2FyZSBpZiB0aGVyZSdzIG5vIG1hdGNoXG4gICAgICAgIGNvbnN0IGxpbWl0ID0gYXN0WydsaW1pdC1waHJhc2UnXT8uWydudW1iZXItbGl0ZXJhbCddXG4gICAgICAgIGNvbnN0IGxpbWl0TnVtID0gZXZhbE51bWJlckxpdGVyYWwobGltaXQpLmF0KDApPy50b0pzKCkgPz8gdGhpbmdzLmxlbmd0aFxuICAgICAgICByZXR1cm4gdGhpbmdzLnNsaWNlKDAsIGxpbWl0TnVtKVxuICAgIH1cblxuICAgIGlmICh0aGluZ3MubGVuZ3RoKSB7IC8vIG5vbi1wbHVyYWwsIHJldHVybiBzaW5nbGUgZXhpc3RpbmcgVGhpbmdcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCAxKVxuICAgIH1cblxuICAgIC8vIG9yIGVsc2UgY3JlYXRlIGFuZCByZXR1cm5zIHRoZSBUaGluZ1xuICAgIHJldHVybiBhcmdzPy5hdXRvdml2aWZpY2F0aW9uID8gW2NyZWF0ZVRoaW5nKG5wKV0gOiBbXVxuXG59XG5cbmZ1bmN0aW9uIGV2YWxOdW1iZXJMaXRlcmFsKGFzdD86IE51bWJlckxpdGVyYWwpOiBOdW1iZXJUaGluZ1tdIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IGRpZ2l0cyA9IGFzdC5kaWdpdC5saXN0Lm1hcCh4ID0+IHgucm9vdCkgPz8gW11cbiAgICBjb25zdCBsaXRlcmFsID0gZGlnaXRzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsICcnKVxuXG4gICAgY29uc3QgeiA9IHBhcnNlTnVtYmVyKGxpdGVyYWwpXG5cbiAgICBpZiAoeikge1xuICAgICAgICByZXR1cm4gW25ldyBOdW1iZXJUaGluZyh6KV1cbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuXG5mdW5jdGlvbiBldmFsT3BlcmF0aW9uKGxlZnQ6IFRoaW5nW10sIHJpZ2h0OiBUaGluZ1tdLCBvcD86IExleGVtZSkge1xuICAgIGNvbnN0IHN1bXMgPSBsZWZ0Lm1hcCh4ID0+IHgudG9KcygpIGFzIGFueSArIHJpZ2h0LmF0KDApPy50b0pzKCkpXG4gICAgcmV0dXJuIHN1bXMubWFwKHggPT4gbmV3IE51bWJlclRoaW5nKHgpKVxufVxuXG5mdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2UoYXN0PzogTm91blBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSAoYXN0Py5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHghKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgIGxldCBub3VuID0gZW1wdHlDbGF1c2VcblxuICAgIGlmIChhc3Q/LnN1YmplY3QudHlwZSA9PT0gJ25vdW4nIHx8IGFzdD8uc3ViamVjdC50eXBlID09PSAncHJvbm91bicpIHtcbiAgICAgICAgbm91biA9IGNsYXVzZU9mKGFzdC5zdWJqZWN0LCBzdWJqZWN0SWQpXG4gICAgfVxuXG4gICAgY29uc3QgZ2VuaXRpdmVDb21wbGVtZW50ID0gZ2VuaXRpdmVUb0NsYXVzZShhc3Q/LlsnZ2VuaXRpdmUtY29tcGxlbWVudCddLCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UsIHNpZGVFZmZlY3RzOiBmYWxzZSB9KVxuICAgIGNvbnN0IGFuZFBocmFzZSA9IGV2YWxBbmRQaHJhc2UoYXN0Py5bJ2FuZC1waHJhc2UnXSwgYXJncylcblxuICAgIHJldHVybiBhZGplY3RpdmVzLmFuZChub3VuKS5hbmQoZ2VuaXRpdmVDb21wbGVtZW50KS5hbmQoYW5kUGhyYXNlKVxufVxuXG5mdW5jdGlvbiBldmFsQW5kUGhyYXNlKGFuZFBocmFzZT86IEFuZFBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cykge1xuXG4gICAgaWYgKCFhbmRQaHJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdW5QaHJhc2VUb0NsYXVzZShhbmRQaHJhc2VbJ25vdW4tcGhyYXNlJ10gLyogVE9ETyEgYXJncyAqLykgLy8gbWF5YmUgcHJvYmxlbSBpZiBtdWx0aXBsZSB0aGluZ3MgaGF2ZSBzYW1lIGlkLCBxdWVyeSBpcyBub3QgZ29ubmEgZmluZCB0aGVtXG59XG5cbmZ1bmN0aW9uIGdlbml0aXZlVG9DbGF1c2UoYXN0PzogR2VuaXRpdmVDb21wbGVtZW50LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkSWQgPSBhcmdzPy5zdWJqZWN0IVxuICAgIGNvbnN0IG93bmVySWQgPSBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBnZW5pdGl2ZVBhcnRpY2xlID0gYXN0WydnZW5pdGl2ZS1wYXJ0aWNsZSddXG4gICAgY29uc3Qgb3duZXIgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0Lm93bmVyLCB7IHN1YmplY3Q6IG93bmVySWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcbiAgICByZXR1cm4gY2xhdXNlT2YoZ2VuaXRpdmVQYXJ0aWNsZSwgb3duZWRJZCwgb3duZXJJZCkuYW5kKG93bmVyKVxufVxuXG5mdW5jdGlvbiBpc0FzdFBsdXJhbChhc3Q6IEFzdE5vZGUpOiBib29sZWFuIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChhc3QudHlwZSA9PT0gJ25vdW4tcGhyYXNlJykge1xuICAgICAgICByZXR1cm4gISFhc3QudW5pcXVhbnQgfHwgT2JqZWN0LnZhbHVlcyhhc3QpLnNvbWUoeCA9PiBpc0FzdFBsdXJhbCh4KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdwcm9ub3VuJyB8fCBhc3QudHlwZSA9PT0gJ25vdW4nKSB7XG4gICAgICAgIHJldHVybiBpc1BsdXJhbChhc3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbmZ1bmN0aW9uIGdldEludGVyZXN0aW5nSWRzKG1hcHM6IE1hcFtdLCBjbGF1c2U6IENsYXVzZSk6IElkW10ge1xuXG4gICAgLy8gY29uc3QgZ2V0TnVtYmVyT2ZEb3RzID0gKGlkOiBJZCkgPT4gaWQuc3BsaXQoJy4nKS5sZW5ndGggLy8tMVxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlICdjb2xvciBvZiBzdHlsZSBvZiBidXR0b24nIFxuICAgIC8vIGhhcyBidXR0b25JZC5zdHlsZS5jb2xvciBhbmQgdGhhdCdzIHRoZSBvYmplY3QgdGhlIHNlbnRlbmNlIHNob3VsZCByZXNvbHZlIHRvXG4gICAgLy8gcG9zc2libGUgcHJvYmxlbSBpZiAnY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b24nXG4gICAgLy8gY29uc3QgaWRzID0gbWFwcy5mbGF0TWFwKHggPT4gT2JqZWN0LnZhbHVlcyh4KSlcbiAgICAvLyBjb25zdCBtYXhMZW4gPSBNYXRoLm1heCguLi5pZHMubWFwKHggPT4gZ2V0TnVtYmVyT2ZEb3RzKHgpKSlcbiAgICAvLyByZXR1cm4gaWRzLmZpbHRlcih4ID0+IGdldE51bWJlck9mRG90cyh4KSA9PT0gbWF4TGVuKVxuXG4gICAgY29uc3Qgb2MgPSBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UpXG5cbiAgICBpZiAob2MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuIG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpIC8vYWxsXG4gICAgfVxuXG4gICAgLy8gVE9ETzogcHJvYmxlbSBub3QgcmV0dXJuaW5nIGV2ZXJ5dGhpbmcgYmVjYXVzZSBvZiBnZXRPd25lcnNoaXBDaGFpbigpXG4gICAgcmV0dXJuIG1hcHMuZmxhdE1hcChtID0+IG1bb2MuYXQoLTEpIV0pIC8vIG93bmVkIGxlYWZcblxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuICAgIGNvbnN0IGJhc2VzID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGU/LnJlZmVyZW50cz8uWzBdISkvKiBPTkxZIEZJUlNUPyAqLy5maWx0ZXIoeCA9PiB4KVxuICAgIGNvbnN0IGlkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgcmV0dXJuIGdldFRoaW5nKHsgaWQsIGJhc2VzIH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxTdHJpbmcoY29udGV4dDogQ29udGV4dCwgYXN0PzogU3RyaW5nTGl0ZXJhbCwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3QgeCA9IGFzdFsnc3RyaW5nLXRva2VuJ10ubGlzdC5tYXAoeCA9PiB4LnRva2VuKVxuICAgIGNvbnN0IHkgPSB4LmpvaW4oJyAnKVxuICAgIHJldHVybiBbbmV3IFN0cmluZ1RoaW5nKHkpXVxufVxuXG5mdW5jdGlvbiBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3Q6IEFzdE5vZGUpIHsgLy8gYW55dGhpbmcgdGhhdCBpcyBub3QgYSBub3VucGhyYXNlIENPVUxEIGhhdmUgc2lkZSBlZmZlY3RzXG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHsgLy8gdGhpcyBpcyBub3Qgb2ssIGl0J3MgaGVyZSBqdXN0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zIChzYXZpbmcgYWxsIG9mIHRoZSBtYWNyb3MgaXMgY3VycmVudGx5IGV4cGVuc2l2ZSkgXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiAhIShhc3QudHlwZSA9PT0gJ2NvcHVsYS1zZW50ZW5jZScgfHwgYXN0LnR5cGUgPT09ICd2ZXJiLXNlbnRlbmNlJyB8fCAoYXN0IGFzIENvbXBsZXhTZW50ZW5jZSkuc3ViY29uailcbn1cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkLFxuICAgIGF1dG92aXZpZmljYXRpb24/OiBib29sZWFuLFxuICAgIHNpZGVFZmZlY3RzPzogYm9vbGVhbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxNYWNybyhjb250ZXh0OiBDb250ZXh0LCBtYWNybzogTWFjcm8pOiBUaGluZ1tdIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNyby5tYWNyb3BhcnQubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvLnN1YmplY3Qucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIGNvbnRleHQuc2V0U3ludGF4KG5hbWUsIHN5bnRheClcbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBNYWNyb3BhcnQpOiBNZW1iZXIge1xuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0Py50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHg/Lm5vdW4pXG5cbiAgICBjb25zdCBleGNlcHRVbmlvbnMgPSBtYWNyb1BhcnQ/LmV4Y2VwdHVuaW9uPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IG5vdEdyYW1tYXJzID0gZXhjZXB0VW5pb25zLm1hcCh4ID0+IHg/Lm5vdW4pXG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZXM6IGdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IG1hY3JvUGFydFtcImdyYW1tYXItcm9sZVwiXT8ucm9vdCxcbiAgICAgICAgbnVtYmVyOiBtYWNyb1BhcnQuY2FyZGluYWxpdHk/LmNhcmRpbmFsaXR5LFxuICAgICAgICBleGNlcHRUeXBlczogbm90R3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgbm90QXN0OiAhIW1hY3JvUGFydFsnbm90LWFzdC1rZXl3b3JkJ10sXG4gICAgICAgIGV4cGFuZDogISFtYWNyb1BhcnRbJ2V4cGFuZC1rZXl3b3JkJ10sXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBleHRyYXBvbGF0ZSwgTGV4ZW1lIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lJztcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IElkIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL0lkJztcbmltcG9ydCB7IE1hcCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9NYXAnO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gJy4uLy4uL3V0aWxzL3VuaXEnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuXG5leHBvcnQgY2xhc3MgQmFzZVRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHByb3RlY3RlZCBiYXNlczogVGhpbmdbXSA9IFtdLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2hpbGRyZW46IHsgW2lkOiBJZF06IFRoaW5nIH0gPSB7fSxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gW10sXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBnZXRJZCgpOiBJZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkXG4gICAgfVxuXG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IElkIH0pOiBUaGluZyB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKFxuICAgICAgICAgICAgb3B0cz8uaWQgPz8gdGhpcy5pZCwgLy8gY2xvbmVzIGhhdmUgc2FtZSBpZFxuICAgICAgICAgICAgdGhpcy5iYXNlcy5tYXAoeCA9PiB4LmNsb25lKCkpLFxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jaGlsZHJlbikubWFwKGUgPT4gKHsgW2VbMF1dOiBlWzFdLmNsb25lKCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSksXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHRlbmRzID0gKHRoaW5nOiBUaGluZykgPT4ge1xuICAgICAgICB0aGlzLnVuZXh0ZW5kcyh0aGluZykgLy8gb3IgYXZvaWQ/XG4gICAgICAgIHRoaXMuYmFzZXMucHVzaCh0aGluZy5jbG9uZSgpKVxuICAgIH1cblxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNlcyA9IHRoaXMuYmFzZXMuZmlsdGVyKHggPT4geC5nZXRJZCgpICE9PSB0aGluZy5nZXRJZCgpKVxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltwMV0gPz8gdGhpcy5jaGlsZHJlbltpZF1cbiAgICAgICAgY29uc3QgcmVzID0gLyogcGFydHMubGVuZ3RoID4gMSAqLyBjaGlsZC5nZXRJZCgpICE9PSBpZCA/IGNoaWxkLmdldChpZCAvKiBwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykgKi8pIDogY2hpbGRcbiAgICAgICAgcmV0dXJuIHJlcyA/PyB0aGlzLmJhc2VzLmZpbmQoeCA9PiB4LmdldChpZCkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baWRdID0gdGhpbmdcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSAvLyBldmVyeSB0aGluZyBpcyBhIHRoaW5nXG5cbiAgICAgICAgLy9UT0RPXG4gICAgICAgIGlmICh0eXBlb2YgdGhpbmcudG9KcygpID09PSAnc3RyaW5nJykgeyAvL1RPRE8gbWFrZSB0aGlzIHBvbHltb3JwaGljXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdzdHJpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGluZy50b0pzKCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdudW1iZXInLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB8IG51bWJlciB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vVE9ET29vb29vb29vT08hXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy50b0NsYXVzZShxdWVyeSkucXVlcnkocXVlcnksIHsvKiBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCAgKi8gfSkpXG4gICAgfVxuXG4gICAgdG9DbGF1c2UgPSAocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVtZXNcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMubWFwKHIgPT4gY2xhdXNlT2YoeCwgci5nZXRJZCgpKSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgeSA9IE9iamVjdFxuICAgICAgICAgICAgLmtleXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiBjbGF1c2VPZih7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicsIHJlZmVyZW50czogW10gfSwgeCwgdGhpcy5pZCkpIC8vIGhhcmRjb2RlZCBlbmdsaXNoIVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHogPSBPYmplY3RcbiAgICAgICAgICAgIC52YWx1ZXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICByZXR1cm4geC5hbmQoeSkuYW5kKHopLnNpbXBsZVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB1cGRhdGVkOiBMZXhlbWVbXSA9IG9sZC5tYXAoeCA9PiAoeyAuLi54LCAuLi5sZXhlbWUsIHJlZmVyZW50czogWy4uLngucmVmZXJlbnRzLCAuLi5sZXhlbWUucmVmZXJlbnRzXSB9KSlcbiAgICAgICAgdGhpcy5sZXhlbWVzID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIGNvbnN0IHRvQmVBZGRlZCA9IHVwZGF0ZWQubGVuZ3RoID8gdXBkYXRlZCA6IFtsZXhlbWVdXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLnRvQmVBZGRlZClcbiAgICAgICAgY29uc3QgZXh0cmFwb2xhdGVkID0gdG9CZUFkZGVkLmZsYXRNYXAoeCA9PiBleHRyYXBvbGF0ZSh4LCB0aGlzKSlcbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goLi4uZXh0cmFwb2xhdGVkKVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lcyA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lW10gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICB9XG5cbiAgICByZW1vdmVMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBnYXJiYWdlID0gdGhpcy5nZXRMZXhlbWVzKHJvb3RPclRva2VuKS5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMpXG4gICAgICAgIGdhcmJhZ2UuZm9yRWFjaCh4ID0+IGRlbGV0ZSB0aGlzLmNoaWxkcmVuW3guZ2V0SWQoKV0pXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiByb290T3JUb2tlbiAhPT0geC50b2tlbiAmJiByb290T3JUb2tlbiAhPT0geC5yb290KVxuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuIHsgLy9UT0RPOiBpbXBsZW1lbnQgbmVzdGVkIHN0cnVjdHVyYWwgZXF1YWxpdHlcbiAgICAgICAgcmV0dXJuIHRoaXMudG9KcygpID09PSBvdGhlcj8udG9KcygpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBMZXhlbWUsIGV4dHJhcG9sYXRlLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IG1heFByZWNlZGVuY2UgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCJcblxuZXhwb3J0IGNsYXNzIEJhc2ljQ29udGV4dCBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIENvbnRleHQge1xuXG4gICAgcHJvdGVjdGVkIHN5bnRheExpc3Q6IENvbXBvc2l0ZVR5cGVbXSA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbmZpZyA9IGdldENvbmZpZygpLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGljRGVzY1ByZWNlZGVuY2UgPSBjb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzeW50YXhNYXAgPSBjb25maWcuc3ludGF4ZXMsXG4gICAgICAgIHByb3RlY3RlZCBsZXhlbWVzOiBMZXhlbWVbXSA9IGNvbmZpZy5sZXhlbWVzLmZsYXRNYXAobCA9PiBbbCwgLi4uZXh0cmFwb2xhdGUobCldKSxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICkge1xuICAgICAgICBzdXBlcihpZCwgYmFzZXMsIGNoaWxkcmVuLCBsZXhlbWVzKVxuXG4gICAgICAgIHRoaXMuYXN0VHlwZXMuZm9yRWFjaChnID0+IHsgLy9UT0RPIVxuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7XG4gICAgICAgICAgICAgICAgcm9vdDogZyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgICAgICAgICAgcmVmZXJlbnRzOiBbXSxcbiAgICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmxleGVtZVR5cGVzXG4gICAgfVxuXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcucHJlbHVkZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCByZWZyZXNoU3ludGF4TGlzdCgpIHtcbiAgICAgICAgY29uc3QgeCA9IE9iamVjdC5rZXlzKHRoaXMuc3ludGF4TWFwKSBhcyBDb21wb3NpdGVUeXBlW11cbiAgICAgICAgY29uc3QgeSA9IHguZmlsdGVyKGUgPT4gIXRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmluY2x1ZGVzKGUpKVxuICAgICAgICBjb25zdCB6ID0geS5zb3J0KChhLCBiKSA9PiBtYXhQcmVjZWRlbmNlKGIsIGEsIHRoaXMuc3ludGF4TWFwKSlcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnN0YXRpY0Rlc2NQcmVjZWRlbmNlLmNvbmNhdCh6KVxuICAgIH1cblxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TGlzdFxuICAgIH1cblxuICAgIHNldFN5bnRheCA9IChuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4KSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnbm91bicsIHJvb3Q6IG5hbWUsIHJlZmVyZW50czogW10gfSkpXG4gICAgICAgIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXhcbiAgICAgICAgdGhpcy5zeW50YXhMaXN0ID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV1cbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlcy5zbGljZSgpIC8vY29weSFcbiAgICAgICAgcmVzLnB1c2goLi4udGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSlcbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIG92ZXJyaWRlIGNsb25lKCk6IENvbnRleHQge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGljRGVzY1ByZWNlZGVuY2UsXG4gICAgICAgICAgICB0aGlzLnN5bnRheE1hcCxcbiAgICAgICAgICAgIHRoaXMubGV4ZW1lcyxcbiAgICAgICAgICAgIHRoaXMuYmFzZXMsXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLCAvL3NoYWxsb3cgb3IgZGVlcD9cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0IH0gZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCBleHRlbmRzIFRoaW5nIHtcbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChuYW1lOiBzdHJpbmcsIHN5bnRheDogU3ludGF4KTogdm9pZFxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmdcbiAgICBjbG9uZSgpOiBDb250ZXh0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0KG9wdHM6IHsgaWQ6IElkIH0pOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChvcHRzLmlkKVxufSIsImltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiO1xuXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb25UaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogQXN0Tm9kZSkge1xuICAgICAgICBzdXBlcihnZXRJbmNyZW1lbnRhbElkKCkpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyLCBpZDogSWQgPSB2YWx1ZSArICcnKSB7XG4gICAgICAgIHN1cGVyKGlkKVxuICAgIH1cblxuICAgIG92ZXJyaWRlIHRvSnMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG5cbiAgICBjbG9uZShvcHRzPzogeyBpZDogc3RyaW5nIH0gfCB1bmRlZmluZWQpOiBUaGluZyB7IC8vVE9ETyFcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJUaGluZyh0aGlzLnZhbHVlLCBvcHRzPy5pZClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZywgaWQ6IElkID0gdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdG9KcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCk6IFRoaW5nIHsgLy9UT0RPIVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RoaW5nKHRoaXMudmFsdWUsIG9wdHM/LmlkKVxuICAgIH1cblxufSIsIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL01hcFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgVGhpbmcge1xuICAgIGdldChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZFxuICAgIHNldChpZDogSWQsIHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICBjbG9uZShvcHRzPzogeyBpZDogSWQgfSk6IFRoaW5nXG4gICAgdG9KcygpOiBvYmplY3QgfCBudW1iZXIgfCBzdHJpbmdcbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIGV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIGdldExleGVtZXMocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZVtdXG4gICAgcmVtb3ZlTGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldElkKCk6IElkXG4gICAgZXF1YWxzKG90aGVyOiBUaGluZyk6IGJvb2xlYW5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhpbmcoYXJnczogeyBpZDogSWQsIGJhc2VzOiBUaGluZ1tdIH0pIHtcbiAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhhcmdzLmlkLCBhcmdzLmJhc2VzKVxufSIsIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uL2V2YWwvZXZhbEFzdFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb25UaGluZyB9IGZyb20gXCIuL0luc3RydWN0aW9uVGhpbmdcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBWZXJiIGV4dGVuZHMgVGhpbmcge1xuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IFtyb2xlIGluIFZlcmJBcmdzXTogVGhpbmcgfSk6IFRoaW5nW10gLy8gY2FsbGVkIGRpcmVjdGx5IGluIGV2YWxWZXJiU2VudGVuY2UoKVxufVxuXG50eXBlIFZlcmJBcmdzID0gJ3N1YmplY3QnIC8vVE9ET1xuICAgIHwgJ29iamVjdCdcblxuZXhwb3J0IGNsYXNzIFZlcmJUaGluZyBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIFZlcmIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcmVhZG9ubHkgaW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvblRoaW5nW10sIC8vb3IgSW5zdHJ1Y3Rpb25UaGluZz9cbiAgICApIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgc3ViamVjdDogVGhpbmcsIG9iamVjdDogVGhpbmcsIH0pOiBUaGluZ1tdIHtcblxuICAgICAgICBjb25zdCBjbG9uZWRDb250ZXh0ID0gY29udGV4dC5jbG9uZSgpXG4gICAgICAgIC8vIGluamVjdCBhcmdzLCByZW1vdmUgaGFyY29kZWQgZW5nbGlzaCFcbiAgICAgICAgLy9UT08gSSBndWVzcyBzZXR0aW5nIGNvbnRleHQgb24gY29udGV4dCBzdWJqZWN0IHJlc3VsdHMgaW4gYW4gaW5mIGxvb3AvbWF4IHRvbyBtdWNoIHJlY3Vyc2lvbiBlcnJvclxuICAgICAgICAvLyBjbG9uZWRDb250ZXh0LnNldChhcmdzLnN1YmplY3QuZ2V0SWQoKSwgYXJncy5zdWJqZWN0KVxuICAgICAgICBjbG9uZWRDb250ZXh0LnNldChhcmdzLm9iamVjdC5nZXRJZCgpLCBhcmdzLm9iamVjdClcbiAgICAgICAgY2xvbmVkQ29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFthcmdzLnN1YmplY3RdIH0pXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0TGV4ZW1lKHsgcm9vdDogJ29iamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFthcmdzLm9iamVjdF0gfSlcblxuICAgICAgICBsZXQgcmVzdWx0czogVGhpbmdbXSA9IFtdXG5cbiAgICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuZm9yRWFjaChpc3RydWN0aW9uID0+IHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSBldmFsQXN0KGNsb25lZENvbnRleHQsIGlzdHJ1Y3Rpb24udmFsdWUpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbn1cblxuXG4vLyB4IGlzIFwiY2lhb1wiXG4vLyB5IGlzIFwibW9uZG9cIlxuLy8geW91IGxvZyB4IGFuZCB5XG4vLyB5b3UgbG9nIFwiY2FwcmEhXCJcbi8vIHN0dXBpZGl6ZSBpcyB0aGUgcHJldmlvdXMgXCIyXCIgaW5zdHJ1Y3Rpb25zXG4vLyB5b3Ugc3R1cGlkaXplXG5leHBvcnQgY29uc3QgbG9nVmVyYiA9IG5ldyAoY2xhc3MgZXh0ZW5kcyBWZXJiVGhpbmcgeyAvL1RPRE86IHRha2UgbG9jYXRpb24gY29tcGxlbWVudCwgZWl0aGVyIGNvbnNvbGUgb3IgXCJzdGRvdXRcIiAhXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgc3ViamVjdDogVGhpbmc7IG9iamVjdDogVGhpbmc7IH0pOiBUaGluZ1tdIHtcbiAgICAgICAgY29uc29sZS5sb2coYXJncy5vYmplY3QudG9KcygpKVxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG59KSgnbG9nJywgW10pXG5cblxuIiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi9wcmVsdWRlXCJcbmltcG9ydCB7IHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBwcmVsdWRlLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgLy8gdGhpbmdzLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcblxuICAnYW55LWxleGVtZScsXG4gICdhZGplY3RpdmUnLFxuICAnY29wdWxhJyxcbiAgJ2RlZmFydCcsXG4gICdpbmRlZmFydCcsXG4gICdmdWxsc3RvcCcsXG4gICdodmVyYicsXG4gICd2ZXJiJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ2V4aXN0cXVhbnQnLFxuICAndW5pcXVhbnQnLFxuICAncmVscHJvbicsXG4gICduZWdhdGlvbicsXG4gICdub3VuJyxcbiAgJ3ByZXBvc2l0aW9uJyxcbiAgJ3N1YmNvbmonLFxuICAnbm9uc3ViY29uaicsIC8vIGFuZFxuICAnZGlzanVuYycsIC8vIG9yXG4gICdwcm9ub3VuJyxcbiAgJ3F1b3RlJyxcblxuICAnbWFrcm8ta2V5d29yZCcsXG4gICdleGNlcHQta2V5d29yZCcsXG4gICd0aGVuLWtleXdvcmQnLFxuICAnZW5kLWtleXdvcmQnLFxuXG4gICdnZW5pdGl2ZS1wYXJ0aWNsZScsXG4gICdkYXRpdmUtcGFydGljbGUnLFxuICAnYWJsYXRpdmUtcGFydGljbGUnLFxuICAnbG9jYXRpdmUtcGFydGljbGUnLFxuICAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJyxcbiAgJ2NvbWl0YXRpdmUtcGFydGljbGUnLFxuXG4gICduZXh0LWtleXdvcmQnLFxuICAncHJldmlvdXMta2V5d29yZCcsXG5cbiAgJ3BsdXMtb3BlcmF0b3InLFxuXG4gICdkaWdpdCcsXG5cblxuICAnY2FyZGluYWxpdHknLFxuICAnZ3JhbW1hci1yb2xlJyxcblxuXG4gICdub3QtYXN0LWtleXdvcmQnLFxuICAnZXhwYW5kLWtleXdvcmQnLFxuXG4pXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWVbXSA9IFtcblxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJ2lzJywgY2FyZGluYWxpdHk6IDEsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCB0b2tlbjogJz0nLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgdG9rZW46ICdhcmUnLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudHM6IFtdIH0sIC8vVE9ETyEgMitcbiAgICB7IHJvb3Q6ICdkbycsIHR5cGU6ICdodmVyYicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdkbycsIHR5cGU6ICdodmVyYicsIHRva2VuOiAnZG9lcycsIGNhcmRpbmFsaXR5OiAxLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaGF2ZScsIHR5cGU6ICd2ZXJiJywgcmVmZXJlbnRzOiBbXSB9LC8vdGVzdFxuICAgIHsgcm9vdDogJ25vdCcsIHR5cGU6ICduZWdhdGlvbicsIHJlZmVyZW50czogW10gfSxcblxuICAgIC8vIGxvZ2ljYWwgcm9sZXMgb2YgYSBjb25zdGl0dWVudCB0byBhYnN0cmFjdCBhd2F5IHdvcmQgb3JkZXJcbiAgICB7IHJvb3Q6ICdzdWJqZWN0JywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdwcmVkaWNhdGUnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29iamVjdCcsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnY29uZGl0aW9uJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdjb25zZXF1ZW5jZScsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3duZXInLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3JlY2VpdmVyJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvcmlnaW4nLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2xvY2F0aW9uJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpbnN0cnVtZW50JywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSwgLy9tZWFuc1xuICAgIHsgcm9vdDogJ2NvbXBhbmlvbicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnc3RyaW5nLXRva2VuJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvcGVyYXRvcicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBudW1iZXIgb2YgdGltZXMgYSBjb25zdGl0dWVudCBjYW4gYXBwZWFyXG4gICAgeyByb290OiAnb3B0aW9uYWwnLCB0eXBlOiAnY2FyZGluYWxpdHknLCBjYXJkaW5hbGl0eTogJzF8MCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbmUtb3ItbW9yZScsIHR5cGU6ICdjYXJkaW5hbGl0eScsIGNhcmRpbmFsaXR5OiAnKycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnY2FyZGluYWxpdHknLCBjYXJkaW5hbGl0eTogJyonLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBmb3IgdXNlIGluIGEgcGFydCBvZiBub3VuLXBocmFzZVxuICAgIHsgcm9vdDogJ25leHQnLCB0eXBlOiAnbmV4dC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3ByZXZpb3VzJywgdHlwZTogJ3ByZXZpb3VzLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICdvcicsIHR5cGU6ICdkaXNqdW5jJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuZCcsIHR5cGU6ICdub25zdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2EnLCB0eXBlOiAnaW5kZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW4nLCB0eXBlOiAnaW5kZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndGhlJywgdHlwZTogJ2RlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpZicsIHR5cGU6ICdzdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3doZW4nLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdldmVyeScsIHR5cGU6ICd1bmlxdWFudCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbnknLCB0eXBlOiAndW5pcXVhbnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndGhhdCcsIHR5cGU6ICdyZWxwcm9uJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2l0JywgdHlwZTogJ3Byb25vdW4nLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICdcIicsIHR5cGU6ICdxdW90ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcuJywgdHlwZTogJ2Z1bGxzdG9wJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAndGhlbicsIHR5cGU6ICd0aGVuLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXhjZXB0JywgdHlwZTogJ2V4Y2VwdC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ21ha3JvJywgdHlwZTogJ21ha3JvLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZW5kJywgdHlwZTogJ2VuZC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuXG5cbiAgICB7IHJvb3Q6ICdvZicsIHR5cGU6ICdnZW5pdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0bycsIHR5cGU6ICdkYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZnJvbScsIHR5cGU6ICdhYmxhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbicsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpbicsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhdCcsIHR5cGU6ICdsb2NhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdieScsIHR5cGU6ICdpbnN0cnVtZW50YWwtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnd2l0aCcsIHR5cGU6ICdjb21pdGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJysnLCB0eXBlOiAncGx1cy1vcGVyYXRvcicsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnMCcsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcxJywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzInLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnMycsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc0JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzUnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNicsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc3JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzgnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnOScsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnbm90LWFzdCcsIHR5cGU6ICdub3QtYXN0LWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXhwYW5kJywgdHlwZTogJ2V4cGFuZC1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuXG5cbl1cblxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZyA9XG5cbiAgYCBcbiAgbWFrcm9cbiAgICBnZW5pdGl2ZS1jb21wbGVtZW50IGlzIGdlbml0aXZlLXBhcnRpY2xlIHRoZW4gb3duZXIgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgZGF0aXZlLWNvbXBsZW1lbnQgaXMgZGF0aXZlLXBhcnRpY2xlIHRoZW4gcmVjZWl2ZXIgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgYWJsYXRpdmUtY29tcGxlbWVudCBpcyBhYmxhdGl2ZS1wYXJ0aWNsZSB0aGVuIG9yaWdpbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBsb2NhdGl2ZS1jb21wbGVtZW50IGlzIGxvY2F0aXZlLXBhcnRpY2xlIHRoZW4gbG9jYXRpb24gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgaW5zdHJ1bWVudGFsLWNvbXBsZW1lbnQgaXMgaW5zdHJ1bWVudGFsLXBhcnRpY2xlIHRoZW4gaW5zdHJ1bWVudCBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBjb21pdGF0aXZlLWNvbXBsZW1lbnQgaXMgY29taXRhdGl2ZS1wYXJ0aWNsZSB0aGVuIGNvbXBhbmlvbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxlbWVudCBpcyBcbiAgICBnZW5pdGl2ZS1jb21wbGVtZW50IG9yIFxuICAgIGRhdGl2ZS1jb21wbGVtZW50IG9yXG4gICAgYWJsYXRpdmUtY29tcGxlbWVudCBvclxuICAgIGxvY2F0aXZlLWNvbXBsZW1lbnQgb3JcbiAgICBpbnN0cnVtZW50YWwtY29tcGxlbWVudCBvclxuICAgIGNvbWl0YXRpdmUtY29tcGxlbWVudFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29wdWxhLXNlbnRlbmNlIGlzIFxuICAgIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgdGhlbiBjb3B1bGEgXG4gICAgdGhlbiBvcHRpb25hbCBuZWdhdGlvbiBcbiAgICB0aGVuIHByZWRpY2F0ZSBub3VuLXBocmFzZSBcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgYW5kLXBocmFzZSBpcyBub25zdWJjb25qIHRoZW4gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgbGltaXQtcGhyYXNlIGlzIG5leHQta2V5d29yZCBvciBwcmV2aW91cy1rZXl3b3JkIHRoZW4gb3B0aW9uYWwgbnVtYmVyLWxpdGVyYWxcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgbWF0aC1leHByZXNzaW9uIGlzIG9wZXJhdG9yIHBsdXMtb3BlcmF0b3IgdGhlbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgbm91bi1waHJhc2UgaXMgXG4gICAgb3B0aW9uYWwgdW5pcXVhbnRcbiAgICB0aGVuIG9wdGlvbmFsIGV4aXN0cXVhbnRcbiAgICB0aGVuIG9wdGlvbmFsIGluZGVmYXJ0XG4gICAgdGhlbiBvcHRpb25hbCBkZWZhcnRcbiAgICB0aGVuIHplcm8tb3ItbW9yZSBhZGplY3RpdmVzXG4gICAgdGhlbiBvcHRpb25hbCBsaW1pdC1waHJhc2UgXG4gICAgdGhlbiBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBzdHJpbmcgb3IgbnVtYmVyLWxpdGVyYWxcbiAgICB0aGVuIG9wdGlvbmFsIG1hdGgtZXhwcmVzc2lvblxuICAgIHRoZW4gb3B0aW9uYWwgc3Vib3JkaW5hdGUtY2xhdXNlXG4gICAgdGhlbiBvcHRpb25hbCBnZW5pdGl2ZS1jb21wbGVtZW50XG4gICAgdGhlbiBvcHRpb25hbCBhbmQtcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICB2ZXJiLXNlbnRlbmNlIGlzIFxuICAgIG9wdGlvbmFsIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgdGhlbiBvcHRpb25hbCBodmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgIHRoZW4gdmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgIHRoZW4gZXhwYW5kIHplcm8tb3ItbW9yZSBjb21wbGVtZW50c1xuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgc2ltcGxlLXNlbnRlbmNlIGlzIGNvcHVsYS1zZW50ZW5jZSBvciB2ZXJiLXNlbnRlbmNlIFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZS1vbmUgaXMgXG4gICAgc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBub3QtYXN0IHRoZW4ta2V5d29yZFxuICAgIHRoZW4gY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb21wbGV4LXNlbnRlbmNlLXR3byBpcyBcbiAgICBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZSBpcyBleHBhbmQgY29tcGxleC1zZW50ZW5jZS1vbmUgb3IgY29tcGxleC1zZW50ZW5jZS10d29cbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIHN0cmluZyBpcyBcbiAgICBub3QtYXN0IHF1b3RlIFxuICAgIHRoZW4gb25lLW9yLW1vcmUgc3RyaW5nLXRva2VuIGFueS1sZXhlbWUgZXhjZXB0IHF1b3RlIFxuICAgIHRoZW4gbm90LWFzdCBxdW90ZSBcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgbnVtYmVyLWxpdGVyYWwgaXMgb25lLW9yLW1vcmUgZGlnaXRzXG4gIGVuZC5cblxuICBgXG4iLCJpbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAnZXhjZXB0dW5pb24nLFxuXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnYW5kLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvcHVsYS1zZW50ZW5jZScsXG4gICAgJ3ZlcmItc2VudGVuY2UnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcblxuICAgICdnZW5pdGl2ZS1jb21wbGVtZW50JyxcbiAgICAnZGF0aXZlLWNvbXBsZW1lbnQnLFxuICAgICdhYmxhdGl2ZS1jb21wbGVtZW50JyxcbiAgICAnbG9jYXRpdmUtY29tcGxlbWVudCcsXG4gICAgJ2luc3RydW1lbnRhbC1jb21wbGVtZW50JyxcbiAgICAnY29taXRhdGl2ZS1jb21wbGVtZW50JyxcblxuICAgICdzdWJvcmRpbmF0ZS1jbGF1c2UnLFxuXG4gICAgJ3N0cmluZycsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW10gPSBbJ21hY3JvJ11cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ21ha3JvLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91biddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydlbmQta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZXhwYW5kLWtleXdvcmQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdC1hc3Qta2V5d29yZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnY2FyZGluYWxpdHknXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2dyYW1tYXItcm9sZSddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydleGNlcHR1bmlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2V4Y2VwdHVuaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXSxcbiAgICAnbm91bi1waHJhc2UnOiBbXSxcbiAgICAnYW5kLXBocmFzZSc6IFtdLFxuICAgICdsaW1pdC1waHJhc2UnOiBbXSxcbiAgICAnbWF0aC1leHByZXNzaW9uJzogW10sXG4gICAgJ2dlbml0aXZlLWNvbXBsZW1lbnQnOiBbXSxcbiAgICAnY29wdWxhLXNlbnRlbmNlJzogW10sXG4gICAgJ3ZlcmItc2VudGVuY2UnOiBbXSxcbiAgICAnc3RyaW5nJzogW10sXG4gICAgJ2NvbXBsZXgtc2VudGVuY2UnOiBbXSxcbiAgICBcImRhdGl2ZS1jb21wbGVtZW50XCI6IFtdLFxuICAgIFwiYWJsYXRpdmUtY29tcGxlbWVudFwiOiBbXSxcbiAgICBcImxvY2F0aXZlLWNvbXBsZW1lbnRcIjogW10sXG4gICAgXCJpbnN0cnVtZW50YWwtY29tcGxlbWVudFwiOiBbXSxcbiAgICBcImNvbWl0YXRpdmUtY29tcGxlbWVudFwiOiBbXSxcbiAgICAnc3Vib3JkaW5hdGUtY2xhdXNlJzogW10sXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZ3MvVGhpbmdcIjtcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi4vZmFjYWRlL0JyYWluTGlzdGVuZXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgcGxvdEFzdCB9IGZyb20gXCIuL3Bsb3RBc3RcIjtcblxuZXhwb3J0IGNsYXNzIEFzdENhbnZhcyBpbXBsZW1lbnRzIEJyYWluTGlzdGVuZXIge1xuXG4gICAgcmVhZG9ubHkgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBwcm90ZWN0ZWQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICBwcm90ZWN0ZWQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbFxuICAgIHByb3RlY3RlZCBjYW1lcmFPZmZzZXQgPSB7IHg6IHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgeTogd2luZG93LmlubmVySGVpZ2h0IC8gMiB9XG4gICAgcHJvdGVjdGVkIGlzRHJhZ2dpbmcgPSBmYWxzZVxuICAgIHByb3RlY3RlZCBkcmFnU3RhcnQgPSB7IHg6IDAsIHk6IDAgfVxuICAgIHByb3RlY3RlZCBhc3Q/OiBBc3ROb2RlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0LnggPSBlLnggLSB0aGlzLmNhbWVyYU9mZnNldC54XG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC55ID0gZS55IC0gdGhpcy5jYW1lcmFPZmZzZXQueVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlID0+IHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlKVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhT2Zmc2V0LnggPSBlLmNsaWVudFggLSB0aGlzLmRyYWdTdGFydC54XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmFPZmZzZXQueSA9IGUuY2xpZW50WSAtIHRoaXMuZHJhZ1N0YXJ0LnlcbiAgICAgICAgICAgICAgICB0aGlzLnJlcGxvdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgb25VcGRhdGUoYXN0OiBBc3ROb2RlLCByZXN1bHRzOiBUaGluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXN0ID0gYXN0XG4gICAgICAgIHRoaXMucmVwbG90KClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVwbG90ID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Py50cmFuc2xhdGUod2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Py50cmFuc2xhdGUoLXdpbmRvdy5pbm5lcldpZHRoIC8gMiArIHRoaXMuY2FtZXJhT2Zmc2V0LngsIC13aW5kb3cuaW5uZXJIZWlnaHQgLyAyICsgdGhpcy5jYW1lcmFPZmZzZXQueSlcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8uY2xlYXJSZWN0KDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG5cbiAgICAgICAgICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgY29udGV4dCBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmFzdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN0IGlzIGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbG90QXN0KHRoaXMuY29udGV4dCwgdGhpcy5hc3QpXG4gICAgICAgIH0pXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBBc3ROb2RlLCBDb21wb3NpdGVOb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzdFRvRWRnZUxpc3QoXG4gICAgYXN0OiBBc3ROb2RlLFxuICAgIHBhcmVudE5hbWU/OiBzdHJpbmcsXG4gICAgZWRnZXM6IEVkZ2VMaXN0ID0gW10sXG4pOiBFZGdlTGlzdCB7XG5cbiAgICBjb25zdCBsaW5rcyA9IE9iamVjdC5lbnRyaWVzKGFzdCkuZmlsdGVyKGUgPT4gZVsxXSAmJiBlWzFdLnR5cGUpXG5cbiAgICBjb25zdCBhc3ROYW1lID0gKChhc3QgYXMgTGV4ZW1lKS5yb290ID8/IGFzdC50eXBlKSArIHJhbmRvbSgpXG5cbiAgICBjb25zdCBhZGRpdGlvbnM6IEVkZ2VMaXN0ID0gW11cblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICAgIGFkZGl0aW9ucy5wdXNoKFtwYXJlbnROYW1lLCBhc3ROYW1lXSlcbiAgICB9XG5cbiAgICBpZiAoIWxpbmtzLmxlbmd0aCAmJiAhKGFzdCBhcyBDb21wb3NpdGVOb2RlKS5saXN0KSB7IC8vIGxlYWYhXG4gICAgICAgIHJldHVybiBbLi4uZWRnZXMsIC4uLmFkZGl0aW9uc11cbiAgICB9XG5cbiAgICBpZiAobGlua3MubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBsaW5rc1xuICAgICAgICAgICAgLmZsYXRNYXAoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXplcm8gPSBlWzBdICsgcmFuZG9tKClcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFkZGl0aW9ucywgW2FzdE5hbWUsIGV6ZXJvXSwgLi4uYXN0VG9FZGdlTGlzdChlWzFdLCBlemVybywgZWRnZXMpXVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoKGFzdCBhcyBDb21wb3NpdGVOb2RlKS5saXN0KSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSAoYXN0IGFzIENvbXBvc2l0ZU5vZGUpLmxpc3Q/LmZsYXRNYXAoeCA9PiBhc3RUb0VkZ2VMaXN0KHgsIGFzdE5hbWUsIGVkZ2VzKSlcbiAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIC4uLmVkZ2VzLCAuLi5saXN0ID8/IFtdXVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiByYW5kb20oKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KDEwMDAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJylcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdMaW5lKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZnJvbTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBmcm9tTm9kZS5zdHJva2VTdHlsZVxuICAgIGNvbnRleHQubW92ZVRvKGZyb20ueCwgZnJvbS55KVxuICAgIGNvbnRleHQubGluZVRvKHRvLngsIHRvLnkpXG4gICAgY29udGV4dC5zdHJva2UoKVxufSIsImltcG9ydCB7IEdyYXBoTm9kZSB9IGZyb20gXCIuL05vZGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd05vZGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBub2RlOiBHcmFwaE5vZGUpIHtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuYXJjKG5vZGUueCwgbm9kZS55LCBub2RlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IG5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG5vZGUuZmlsbFN0eWxlXG4gICAgY29udGV4dC5zdHJva2UoKVxuICAgIGNvbnRleHQuZmlsbCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNGRjAwMDBcIlxuICAgIGNvbnRleHQuZm9udCA9IFwiMTBweCBBcmlhbFwiLy8yMHB4XG4gICAgY29uc3QgdGV4dE9mZnNldCA9IDEwICogbm9kZS5sYWJlbC5sZW5ndGggLyAyIC8vc29tZSBtYWdpYyBpbiBoZXJlIVxuICAgIGNvbnRleHQuZmlsbFRleHQobm9kZS5sYWJlbCwgbm9kZS54IC0gdGV4dE9mZnNldCwgbm9kZS55KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi91dGlscy91bmlxXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb3JkcyhcbiAgICBpbml0aWFsUG9zOiBDb29yZGluYXRlLFxuICAgIGRhdGE6IEVkZ2VMaXN0LFxuICAgIG9sZENvb3JkczogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9ID0ge30sXG4gICAgbmVzdGluZ0ZhY3RvciA9IDEsXG4pOiB7IFt4OiBzdHJpbmddOiBDb29yZGluYXRlIH0ge1xuXG4gICAgY29uc3Qgcm9vdCA9IGdldFJvb3QoZGF0YSkgLy8gbm9kZSB3L291dCBhIHBhcmVudFxuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJldHVybiBvbGRDb29yZHNcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuT2Yocm9vdCwgZGF0YSlcbiAgICBjb25zdCByb290UG9zID0gb2xkQ29vcmRzW3Jvb3RdID8/IGluaXRpYWxQb3NcblxuICAgIGNvbnN0IHlPZmZzZXQgPSA1MFxuICAgIGNvbnN0IHhPZmZzZXQgPSAyMDBcblxuICAgIGNvbnN0IGNoaWxkQ29vcmRzID0gY2hpbGRyZW5cbiAgICAgICAgLm1hcCgoYywgaSkgPT4gKHsgW2NdOiB7IHg6IHJvb3RQb3MueCArIGkgKiBuZXN0aW5nRmFjdG9yICogeE9mZnNldCAqIChpICUgMiA9PSAwID8gMSA6IC0xKSwgeTogcm9vdFBvcy55ICsgeU9mZnNldCAqIChuZXN0aW5nRmFjdG9yICsgMSkgfSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCByZW1haW5pbmdEYXRhID0gZGF0YS5maWx0ZXIoeCA9PiAheC5pbmNsdWRlcyhyb290KSlcbiAgICBjb25zdCBwYXJ0aWFsUmVzdWx0ID0geyAuLi5vbGRDb29yZHMsIC4uLmNoaWxkQ29vcmRzLCAuLi57IFtyb290XTogcm9vdFBvcyB9IH1cblxuICAgIHJldHVybiBnZXRDb29yZHMoaW5pdGlhbFBvcywgcmVtYWluaW5nRGF0YSwgcGFydGlhbFJlc3VsdCwgMC45ICogbmVzdGluZ0ZhY3Rvcilcbn1cblxuZnVuY3Rpb24gZ2V0Um9vdChlZGdlczogRWRnZUxpc3QpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBlZGdlc1xuICAgICAgICAuZmxhdCgpIC8vIHRoZSBub2Rlc1xuICAgICAgICAuZmlsdGVyKG4gPT4gIWVkZ2VzLnNvbWUoZSA9PiBlWzFdID09PSBuKSlbMF1cbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRyZW5PZihwYXJlbnQ6IHN0cmluZywgZWRnZXM6IEVkZ2VMaXN0KSB7XG4gICAgcmV0dXJuIHVuaXEoZWRnZXMuZmlsdGVyKHggPT4geFswXSA9PT0gcGFyZW50KS5tYXAoeCA9PiB4WzFdKSkgLy9UT0RPIGR1cGxpY2F0ZSBjaGlsZHJlbiBhcmVuJ3QgcGxvdHRlZCB0d2ljZSwgYnV0IHN0aWxsIG1ha2UgdGhlIGdyYXBoIHVnbGllciBiZWNhdXNlIHRoZXkgYWRkIFwiaVwiIGluZGVjZXMgaW4gY2hpbGRDb29yZHMgY29tcHV0YXRpb24gYW5kIG1ha2Ugc2luZ2xlIGNoaWxkIGRpc3BsYXkgTk9UIHN0cmFpZ2h0IGRvd24uXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgYXN0VG9FZGdlTGlzdCB9IGZyb20gXCIuL2FzdFRvRWRnZUxpc3RcIlxuaW1wb3J0IHsgZHJhd0xpbmUgfSBmcm9tIFwiLi9kcmF3TGluZVwiXG5pbXBvcnQgeyBkcmF3Tm9kZSB9IGZyb20gXCIuL2RyYXdOb2RlXCJcbmltcG9ydCB7IGdldENvb3JkcyB9IGZyb20gXCIuL2dldENvb3Jkc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBwbG90QXN0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgYXN0OiBBc3ROb2RlKSB7XG5cbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgY29uc3QgcmVjdCA9IGNvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBjb25zdCBlZGdlcyA9IGFzdFRvRWRnZUxpc3QoYXN0KVxuICAgIGNvbnN0IGNvb3JkcyA9IGdldENvb3Jkcyh7IHg6IHJlY3QueCAtIHJlY3Qud2lkdGggLyAyLCB5OiByZWN0LnkgfSwgZWRnZXMpXG5cbiAgICBPYmplY3QuZW50cmllcyhjb29yZHMpLmZvckVhY2goYyA9PiB7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNbMF1cbiAgICAgICAgY29uc3QgcG9zID0gY1sxXVxuXG4gICAgICAgIGRyYXdOb2RlKGNvbnRleHQsIHtcbiAgICAgICAgICAgIHg6IHBvcy54LFxuICAgICAgICAgICAgeTogcG9zLnksXG4gICAgICAgICAgICByYWRpdXM6IDIsIC8vMTBcbiAgICAgICAgICAgIGZpbGxTdHlsZTogJyMyMmNjY2MnLFxuICAgICAgICAgICAgc3Ryb2tlU3R5bGU6ICcjMDA5OTk5JyxcbiAgICAgICAgICAgIGxhYmVsOiBuYW1lLnJlcGxhY2VBbGwoL1xcZCsvZywgJycpXG4gICAgICAgIH0pXG5cbiAgICB9KVxuXG4gICAgZWRnZXMuZm9yRWFjaChlID0+IHtcblxuICAgICAgICBjb25zdCBmcm9tID0gY29vcmRzW2VbMF1dXG4gICAgICAgIGNvbnN0IHRvID0gY29vcmRzW2VbMV1dXG5cbiAgICAgICAgaWYgKGZyb20gJiYgdG8pIHtcbiAgICAgICAgICAgIGRyYXdMaW5lKGNvbnRleHQsIGZyb20sIHRvKVxuICAgICAgICB9XG5cbiAgICB9KVxufVxuIiwiXG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uL2JhY2tlbmQvZXZhbC9ldmFsQXN0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZ3MvQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZ3MvVGhpbmdcIjtcbmltcG9ydCB7IGxvZ1ZlcmIgfSBmcm9tIFwiLi4vYmFja2VuZC90aGluZ3MvVmVyYlRoaW5nXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIHJlYWRvbmx5IGNvbnRleHQgPSBnZXRDb250ZXh0KHsgaWQ6ICdnbG9iYWwnIH0pXG4gICAgcHJvdGVjdGVkIGxpc3RlbmVyczogQnJhaW5MaXN0ZW5lcltdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGUodGhpcy5jb250ZXh0LmdldFByZWx1ZGUoKSlcbiAgICAgICAgdGhpcy5jb250ZXh0LnNldChsb2dWZXJiLmdldElkKCksIGxvZ1ZlcmIpXG4gICAgICAgIHRoaXMuY29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnbG9nJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtsb2dWZXJiXSB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXSB7XG5cbiAgICAgICAgcmV0dXJuIG5hdGxhbmcuc3BsaXQoJy4nKS5mbGF0TWFwKHggPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKHgsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5mbGF0TWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0czogVGhpbmdbXSA9IFtdXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QgYXMgQXN0Tm9kZSlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGwub25VcGRhdGUoYXN0LCByZXN1bHRzKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiAob2JqZWN0IHwgbnVtYmVyIHwgc3RyaW5nKVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShuYXRsYW5nKS5tYXAoeCA9PiB4LnRvSnMoKSlcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogQnJhaW5MaXN0ZW5lcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMubGlzdGVuZXJzLmluY2x1ZGVzKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcilcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmdzL1RoaW5nXCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuaW1wb3J0IHsgQnJhaW5MaXN0ZW5lciB9IGZyb20gXCIuL0JyYWluTGlzdGVuZXJcIlxuXG4vKipcbiAqIEEgZmFjYWRlIHRvIHRoZSBEZWl4aXNjcmlwdCBpbnRlcnByZXRlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW11cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IChvYmplY3QgfCBudW1iZXIgfCBzdHJpbmcpW11cbiAgICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogQnJhaW5MaXN0ZW5lcik6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWluKCk6IEJyYWluIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oKVxufVxuIiwiaW1wb3J0IExleGVyIGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgeyBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZ3MvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHRva2VuczogTGV4ZW1lW10gPSBbXVxuICAgIHByb3RlY3RlZCB3b3Jkczogc3RyaW5nW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy53b3JkcyA9XG4gICAgICAgICAgICBzcGFjZU91dChzb3VyY2VDb2RlLCBbJ1wiJywgJy4nLCAnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuXG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VucygpXG4gICAgfVxuXG4gICAgcmVmcmVzaFRva2VucygpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSB0aGlzLndvcmRzLm1hcCh3ID0+IHRoaXMuY29udGV4dC5nZXRMZXhlbWVzKHcpLmF0KDApID8/IG1ha2VMZXhlbWUoeyByb290OiB3LCB0b2tlbjogdywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFtdIH0pKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VucygpXG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBzcGFjZU91dChzb3VyY2VDb2RlOiBzdHJpbmcsIHNwZWNpYWxDaGFyczogc3RyaW5nW10pIHtcblxuICAgIHJldHVybiBzb3VyY2VDb2RlXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gYSArIChzcGVjaWFsQ2hhcnMuaW5jbHVkZXMoYykgPyAnICcgKyBjICsgJyAnIDogYyksICcnKVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgY29uanVnYXRlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5ncy9UaGluZ1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWU8VCBleHRlbmRzIExleGVtZVR5cGUgPSBMZXhlbWVUeXBlPiB7XG4gICAgcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgcmVhZG9ubHkgdHlwZTogVFxuICAgIHJlYWRvbmx5IHRva2VuPzogc3RyaW5nXG4gICAgcmVhZG9ubHkgY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxuICAgIHJlZmVyZW50czogVGhpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxleGVtZShkYXRhOiBMZXhlbWUpOiBMZXhlbWUge1xuICAgIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsdXJhbChsZXhlbWU6IExleGVtZSkge1xuICAgIHJldHVybiBpc1JlcGVhdGFibGUobGV4ZW1lLmNhcmRpbmFsaXR5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFwb2xhdGUobGV4ZW1lOiBMZXhlbWUsIGNvbnRleHQ/OiBUaGluZyk6IExleGVtZVtdIHtcblxuICAgIGlmIChsZXhlbWUudHlwZSA9PT0gJ25vdW4nICYmICFpc1BsdXJhbChsZXhlbWUpKSB7XG4gICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHBsdXJhbGl6ZShsZXhlbWUucm9vdCksXG4gICAgICAgICAgICBjYXJkaW5hbGl0eTogJyonLFxuICAgICAgICAgICAgcmVmZXJlbnRzOiBsZXhlbWUucmVmZXJlbnRzXG4gICAgICAgIH0pXVxuICAgIH1cblxuICAgIGlmIChsZXhlbWUudHlwZSA9PT0gJ3ZlcmInKSB7XG4gICAgICAgIHJldHVybiBjb25qdWdhdGUobGV4ZW1lLnJvb3QpLm1hcCh4ID0+IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbGV4ZW1lLnJvb3QsXG4gICAgICAgICAgICB0eXBlOiBsZXhlbWUudHlwZSxcbiAgICAgICAgICAgIHRva2VuOiB4LFxuICAgICAgICAgICAgcmVmZXJlbnRzOiBsZXhlbWUucmVmZXJlbnRzXG4gICAgICAgIH0pKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmdzL0NvbnRleHRcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZVxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSwgY29udGV4dClcbn0iLCJleHBvcnQgZnVuY3Rpb24gY29uanVnYXRlKHZlcmI6c3RyaW5nKXtcbiAgICByZXR1cm4gW3ZlcmIrJ3MnXVxufSIsImV4cG9ydCBmdW5jdGlvbiBwbHVyYWxpemUocm9vdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJvb3QgKyAncydcbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBDb21wb3NpdGVOb2RlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL2ludGVyZmFjZXMvUGFyc2VyXCJcbmltcG9ydCB7IGlzTmVjZXNzYXJ5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IEFzdFR5cGUsIE1lbWJlciwgU3ludGF4IH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmdzL0NvbnRleHRcIlxuXG5cbmV4cG9ydCBjbGFzcyBLb29sUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGxleGVyID0gZ2V0TGV4ZXIoc291cmNlQ29kZSwgY29udGV4dCksXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBBc3ROb2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnRyeVBhcnNlKHRoaXMuY29udGV4dC5nZXRTeW50YXhMaXN0KCkpXG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2ltcGxlQXN0ID0gdGhpcy5zaW1wbGlmeShhc3QpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc2ltcGxlQXN0KVxuXG4gICAgICAgICAgICBpZiAodGhpcy5sZXhlci5wZWVrPy50eXBlID09PSAnZnVsbHN0b3AnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCB0cnlQYXJzZSh0eXBlczogQXN0VHlwZVtdLCBleGNlcHRUeXBlcz86IEFzdFR5cGVbXSkgeyAvL3Byb2JsZW1hdGljXG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIHR5cGVzKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmxleGVyLnBvc1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMua25vd25QYXJzZSh0KVxuXG4gICAgICAgICAgICBpZiAoeCAmJiAhZXhjZXB0VHlwZXM/LmluY2x1ZGVzKHgudHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmxleGVyLmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQga25vd25QYXJzZSA9IChuYW1lOiBBc3RUeXBlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuICAgICAgICAvLyBpZiB0aGUgc3ludGF4IGlzIGFuIFwidW5vZmZpY2lhbFwiIEFTVCwgYWthIGEgQ1NULCBnZXQgdGhlIG5hbWUgb2YgdGhlIFxuICAgICAgICAvLyBhY3R1YWwgQVNUIGFuZCBwYXNzIGl0IGRvd24gdG8gcGFyc2UgY29tcG9zaXRlXG5cbiAgICAgICAgaWYgKHRoaXMuaXNMZWFmKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobmFtZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG5hbWU6IEFzdFR5cGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobmFtZSA9PT0gdGhpcy5sZXhlci5wZWVrLnR5cGUgfHwgbmFtZSA9PT0gJ2FueS1sZXhlbWUnKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHN5bnRheDogU3ludGF4KTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IHsgW3g6IHN0cmluZ106IEFzdE5vZGUgfSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHN5bnRheCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgLi4ubGlua3NcbiAgICAgICAgfSBhcyBhbnkgLy8gVE9ETyFcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNZW1iZXIgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogYW55W10gPSBbXSAvLyBUT0RPIVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuXG4gICAgICAgICAgICBpZiAoIWlzUmVwZWF0YWJsZShtLm51bWJlcikgJiYgbGlzdC5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyeVBhcnNlKG0udHlwZXMsIG0uZXhjZXB0VHlwZXMpXG5cbiAgICAgICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3QucHVzaCh4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSA/ICh7XG4gICAgICAgICAgICB0eXBlOiBsaXN0WzBdLnR5cGUsXG4gICAgICAgICAgICBsaXN0OiBsaXN0XG4gICAgICAgIH0pIDogbGlzdFswXVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzTGVhZiA9ICh0OiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuZ2V0TGV4ZW1lVHlwZXMoKS5pbmNsdWRlcyh0IGFzIExleGVtZVR5cGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNpbXBsaWZ5KGFzdDogQXN0Tm9kZSk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmICh0aGlzLmlzTGVhZihhc3QudHlwZSkgfHwgKGFzdCBhcyBDb21wb3NpdGVOb2RlKS5saXN0KSB7IC8vIGlmIG5vIGxpbmtzIHJldHVybiBhc3RcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN5bnRheCA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgoYXN0LnR5cGUpXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBPYmplY3QudmFsdWVzKGFzdCkuZmlsdGVyKHggPT4geCAmJiB4LnR5cGUpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgICAgICByZXR1cm4gdlswXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ltcGxlTGlua3MgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKGFzdClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAoeCBhcyBhbnkpLnR5cGUpXG4gICAgICAgICAgICAubWFwKGwgPT4gKHsgW2xbMF1dOiB0aGlzLnNpbXBsaWZ5KGxbMV0pIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCAuLi5zaW1wbGVMaW5rcyB9XG5cbiAgICB9XG5cbn1cbiIsImV4cG9ydCB0eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8ICcrJyAvLyBvbmUgb3IgbW9yZVxuICAgIHwgbnVtYmVyIC8vIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzID0xXG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT09IHVuZGVmaW5lZCAvLyBuZWNlc3NhcnkgYnkgZGVmYXVsdFxuICAgIHx8IGMgPT0gJysnXG4gICAgfHwgK2MgPj0gMVxuXG5leHBvcnQgY29uc3QgaXNSZXBlYXRhYmxlID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PSAnKydcbiAgICB8fCBjID09ICcqJ1xuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi8uLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZXMpLmZsYXRNYXAodCA9PiB7XG5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaW5jbHVkZXModCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFsuLi52aXNpdGVkLCAuLi5kZXBlbmRlbmNpZXModCBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXhlcywgWy4uLnZpc2l0ZWQsIHRdKV1cbiAgICAgICAgfVxuXG4gICAgfSlcblxufVxuXG5jb25zdCBsZW5Db21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcbiAgICByZXR1cm4gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5sZW5ndGggLSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmxlbmd0aFxufVxuIiwiaW1wb3J0IHsgcnVuVGVzdHMgfSBmcm9tIFwiLi4vLi4vdGVzdHMvcnVuVGVzdHNcIjtcbmltcG9ydCB7IGNsZWFyRG9tIH0gZnJvbSBcIi4uLy4uL3Rlc3RzL3V0aWxzL2NsZWFyRG9tXCI7XG5pbXBvcnQgeyBBc3RDYW52YXMgfSBmcm9tIFwiLi4vZHJhdy1hc3QvQXN0Q2FudmFzXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gYnJhaW5cblxuICAgIGNvbnN0IGFzdENhbnZhcyA9IG5ldyBBc3RDYW52YXMoKVxuICAgIGJyYWluLmFkZExpc3RlbmVyKGFzdENhbnZhcylcblxuICAgIGNvbnN0IGxlZnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHJpZ2h0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGNvbnN0IHNwbGl0ID0gJ2hlaWdodDogMTAwJTsgd2lkdGg6IDUwJTsgcG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyB0b3A6IDA7ICBwYWRkaW5nLXRvcDogMjBweDsnXG4gICAgY29uc3QgbGVmdCA9ICdsZWZ0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExOydcbiAgICBjb25zdCByaWdodCA9ICdyaWdodDogMDsgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsnXG5cbiAgICBsZWZ0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIGxlZnRcbiAgICByaWdodERpdi5zdHlsZS5jc3NUZXh0ID0gc3BsaXQgKyByaWdodCArICdvdmVyZmxvdzpzY3JvbGw7JyArICdvdmVyZmxvdy14OnNjcm9sbDsnICsgJ292ZXJmbG93LXk6c2Nyb2xsOydcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGVmdERpdilcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJpZ2h0RGl2KVxuXG4gICAgcmlnaHREaXYuYXBwZW5kQ2hpbGQoYXN0Q2FudmFzLmRpdilcblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcblxuICAgIGNvbnN0IGNvbnNvbGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS53aWR0aCA9ICc0MHZ3J1xuICAgIGNvbnNvbGVPdXRwdXQuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZChjb25zb2xlT3V0cHV0KVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGVPdXRwdXQudmFsdWUgPSByZXN1bHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgYXdhaXQgcnVuVGVzdHMoKVxuICAgICAgICAgICAgbWFpbigpXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcbi8vIGltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuICAgIH1cblxuICAgIC8vIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgXG59IiwiaW1wb3J0IHsgQXRvbUNsYXVzZSB9IGZyb20gXCIuL0F0b21DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQW4gdW5hbWJpZ3VvdXMgcHJlZGljYXRlLWxvZ2ljLWxpa2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgcHJvZ3JhbW1lcidzIGludGVudC5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG4gICAgLy8gaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQgfHVuZGVmaW5lZCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF0pOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF1cblxuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJcbi8qKlxuICogQ2hlY2tzIGlmIHN0cmluZyBoYXMgc29tZSBub24tZGlnaXQgY2hhciAoZXhjZXB0IGZvciBcIi5cIikgYmVmb3JlXG4gKiBjb252ZXJ0aW5nIHRvIG51bWJlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTnVtYmVyKHN0cmluZzogc3RyaW5nKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG5vbkRpZyA9IHN0cmluZy5tYXRjaCgvXFxEL2cpPy5hdCgwKVxuXG4gICAgaWYgKG5vbkRpZyAmJiBub25EaWcgIT09ICcuJykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoc3RyaW5nKVxuXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG4iLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgY29uc3Qgc2VlbjogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7fVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiaW1wb3J0IHsgdGVzdDEgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MVwiO1xuaW1wb3J0IHsgdGVzdDIgfSBmcm9tIFwiLi90ZXN0cy90ZXN0MlwiO1xuaW1wb3J0IHsgdGVzdDMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0M1wiO1xuXG5jb25zdCB0ZXN0cyA9IFtcbiAgICB0ZXN0MSxcbiAgICB0ZXN0MixcbiAgICB0ZXN0Myxcbl1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blRlc3RzKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0ZXN0KClcbiAgICAgICAgY29uc29sZS5sb2coYCVjJHtzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2ZhaWwnfSAke3Rlc3QubmFtZX1gLCBgY29sb3I6JHtzdWNjZXNzID8gJ2dyZWVuJyA6ICdyZWQnfWApXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZSgneCBpcyAxJylcbiAgICBicmFpbi5leGVjdXRlKCd5IGlzIDInKVxuICAgIHJldHVybiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBudW1iZXInKS5ldmVyeSh4ID0+IFsxLCAyXS5pbmNsdWRlcyh4IGFzIG51bWJlcikpXG59IiwiaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vLi4vc3JjL2ZhY2FkZS9CcmFpblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBnZXRCcmFpbigpXG4gICAgYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCA9IDEgKyAzICsgNCcpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3gnKS5pbmNsdWRlcyg4KVxuICAgICAgICAmJiBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd0aGUgbnVtYmVyJykuaW5jbHVkZXMoOClcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4ID0gMS4geSA9Mi4nKVxuICAgIGNvbnN0IG51bWJlcnMgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKCdldmVyeSBudW1iZXIgKyAzJylcbiAgICByZXR1cm4gbnVtYmVycy5pbmNsdWRlcyg0KSAmJiBudW1iZXJzLmluY2x1ZGVzKDUpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9