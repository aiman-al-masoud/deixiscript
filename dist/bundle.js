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
    return !!(ast.type === 'copula-sentence' || ast.type === 'verb-sentence' || ast.type === 'complex-sentence');
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
    then expand optional genitive
    then optional and-phrase
  end.

  makro 
    verb-sentence is 
    optional subject noun-phrase 
    then not-ast optional hverb 
    then optional negation 
    then verb 
    then optional object noun-phrase
    then expand zero-or-more dative or ablative or locative or instrumental or comitative
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsYUFBYSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1RCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0QsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzdELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFekQsMkNBQTJDO0lBQzNDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM1RSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0UsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTlFLG1DQUFtQztJQUNuQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUU3RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQy9DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFOUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTlDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDckQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUduRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFHbkQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElB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QUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQVcsQ0FBQyxDQUFDO0FBQzFGLENBQUM7QUFMRCxzQkFLQzs7Ozs7Ozs7Ozs7Ozs7QUNQRCwrRkFBa0Q7QUFFbEQsU0FBZ0IsS0FBSztJQUNqQixNQUFNLEtBQUssR0FBRyxvQkFBUSxHQUFFO0lBQ3hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUM7SUFDdkMsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztXQUN2QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBTEQsc0JBS0M7Ozs7Ozs7Ozs7Ozs7O0FDUEQsK0ZBQWtEO0FBRWxELFNBQWdCLEtBQUs7SUFDakIsTUFBTSxLQUFLLEdBQUcsb0JBQVEsR0FBRTtJQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUM3QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDMUQsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFMRCxzQkFLQzs7Ozs7OztVQ1BEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2V2YWwvZXZhbEFzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL0Jhc2ljQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9JbnN0cnVjdGlvblRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvTnVtYmVyVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL3RoaW5ncy9TdHJpbmdUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvdGhpbmdzL1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC90aGluZ3MvVmVyYlRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9MZXhlbWVUeXBlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvcHJlbHVkZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L0FzdENhbnZhcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2FzdFRvRWRnZUxpc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9kcmF3TGluZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2RyYXdOb2RlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZ2V0Q29vcmRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvcGxvdEFzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL2Nvbmp1Z2F0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9wbHVyYWxpemUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvS29vbFBhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BdG9tQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvc29sdmVNYXBzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3BhcnNlTnVtYmVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy9ydW5UZXN0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvdGVzdHMvdGVzdDEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3Rlc3RzL3Rlc3RzL3Rlc3QyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC90ZXN0cy90ZXN0cy90ZXN0My50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcblxuXG5tYWluKCkiLCJcbmltcG9ydCB7IGlzUGx1cmFsLCBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tICcuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQW5kUGhyYXNlLCBBc3ROb2RlLCBDb21wbGV4U2VudGVuY2UsIENvcHVsYVNlbnRlbmNlLCBNYWNybywgTWFjcm9wYXJ0LCBOb3VuUGhyYXNlLCBOdW1iZXJMaXRlcmFsLCBTdHJpbmdMaXRlcmFsLCBWZXJiU2VudGVuY2UgfSBmcm9tICcuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlJztcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvcGFyc2VOdW1iZXInO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4nO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZCc7XG5pbXBvcnQgeyBJZCB9IGZyb20gJy4uLy4uL21pZGRsZS9pZC9JZCc7XG5pbXBvcnQgeyBNYXAgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvTWFwJztcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuLi90aGluZ3MvQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0cnVjdGlvblRoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL0luc3RydWN0aW9uVGhpbmcnO1xuaW1wb3J0IHsgTnVtYmVyVGhpbmcgfSBmcm9tICcuLi90aGluZ3MvTnVtYmVyVGhpbmcnO1xuaW1wb3J0IHsgU3RyaW5nVGhpbmcgfSBmcm9tICcuLi90aGluZ3MvU3RyaW5nVGhpbmcnO1xuaW1wb3J0IHsgVGhpbmcsIGdldFRoaW5nIH0gZnJvbSAnLi4vdGhpbmdzL1RoaW5nJztcbmltcG9ydCB7IFZlcmJUaGluZyB9IGZyb20gJy4uL3RoaW5ncy9WZXJiVGhpbmcnO1xuaW1wb3J0IHsgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSAnLi4vLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4JztcblxuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7XG5cbiAgICBhcmdzLnNpZGVFZmZlY3RzID8/PSBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3QpXG5cbiAgICBpZiAoYXJncy5zaWRlRWZmZWN0cykgeyAvLyBvbmx5IGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIHNpZGUgZWZmZWN0c1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IG5ldyBJbnN0cnVjdGlvblRoaW5nKGFzdClcbiAgICAgICAgY29udGV4dC5zZXQoaW5zdHJ1Y3Rpb24uZ2V0SWQoKSwgaW5zdHJ1Y3Rpb24pXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyByb290OiAnaW5zdHJ1Y3Rpb24nLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW2luc3RydWN0aW9uXSB9KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxNYWNybyhjb250ZXh0LCBhc3QpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ2NvcHVsYS1zZW50ZW5jZScpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ3ZlcmItc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSAnY29tcGxleC1zZW50ZW5jZScpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dCwgYXN0IGFzIENvbXBsZXhTZW50ZW5jZSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSAnbm91bi1waHJhc2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsTm91blBocmFzZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfVxuXG4gICAgY29uc29sZS53YXJuKGFzdClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2V2YWxBc3QoKSBnb3QgdW5leHBlY3RlZCBhc3QgdHlwZTogJyArIGFzdC50eXBlKVxuXG59XG5cblxuZnVuY3Rpb24gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQ29wdWxhU2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhcmdzPy5zaWRlRWZmZWN0cykgeyAvLyBhc3NpZ24gdGhlIHJpZ2h0IHZhbHVlIHRvIHRoZSBsZWZ0IHZhbHVlXG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Quc3ViamVjdCwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSkuc2ltcGxlXG4gICAgICAgIGNvbnN0IHJWYWwgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5wcmVkaWNhdGUsIHsgc3ViamVjdDogc3ViamVjdElkIH0pXG4gICAgICAgIGNvbnN0IG93bmVyQ2hhaW4gPSBnZXRPd25lcnNoaXBDaGFpbihzdWJqZWN0KVxuICAgICAgICBjb25zdCBtYXBzID0gY29udGV4dC5xdWVyeShzdWJqZWN0KVxuICAgICAgICBjb25zdCBsZXhlbWVzID0gc3ViamVjdC5mbGF0TGlzdCgpLm1hcCh4ID0+IHgucHJlZGljYXRlISkuZmlsdGVyKHggPT4geClcbiAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhSZWZlcmVudCA9IGxleGVtZXMubWFwKHggPT4gKHsgLi4ueCwgcmVmZXJlbnRzOiByVmFsIH0pKVxuXG4gICAgICAgIGlmIChyVmFsLmV2ZXJ5KHggPT4geCBpbnN0YW5jZW9mIEluc3RydWN0aW9uVGhpbmcpKSB7IC8vIG1ha2UgdmVyYiBmcm9tIGluc3RydWN0aW9uc1xuICAgICAgICAgICAgY29uc3QgdmVyYiA9IG5ldyBWZXJiVGhpbmcoZ2V0SW5jcmVtZW50YWxJZCgpLCByVmFsIGFzIEluc3RydWN0aW9uVGhpbmdbXSlcbiAgICAgICAgICAgIGNvbnRleHQuc2V0KHZlcmIuZ2V0SWQoKSwgdmVyYilcbiAgICAgICAgICAgIGNvbnN0IGxleGVtZXNXaXRoUmVmZXJlbnQ6IExleGVtZVtdID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IFt2ZXJiXSwgdHlwZTogJ3ZlcmInIH0pKVxuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByZXR1cm4gW3ZlcmJdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hcHMubGVuZ3RoICYmIG93bmVyQ2hhaW4ubGVuZ3RoIDw9IDEpIHsgLy8gbFZhbCBpcyBjb21wbGV0ZWx5IG5ld1xuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsLmZvckVhY2goeCA9PiBjb250ZXh0LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBzLmxlbmd0aCAmJiBvd25lckNoYWluLmxlbmd0aCA8PSAxKSB7IC8vIHJlYXNzaWdubWVudFxuICAgICAgICAgICAgbGV4ZW1lcy5mb3JFYWNoKHggPT4gY29udGV4dC5yZW1vdmVMZXhlbWUoeC5yb290KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgclZhbC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3duZXJDaGFpbi5sZW5ndGggPiAxKSB7IC8vIGxWYWwgaXMgcHJvcGVydHkgb2YgZXhpc3Rpbmcgb2JqZWN0XG4gICAgICAgICAgICBjb25zdCBhYm91dE93bmVyID0gYWJvdXQoc3ViamVjdCwgb3duZXJDaGFpbi5hdCgtMikhKVxuICAgICAgICAgICAgY29uc3Qgb3duZXJzID0gZ2V0SW50ZXJlc3RpbmdJZHMoY29udGV4dC5xdWVyeShhYm91dE93bmVyKSwgYWJvdXRPd25lcikubWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSEpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IG93bmVycy5hdCgwKVxuICAgICAgICAgICAgY29uc3QgclZhbENsb25lID0gclZhbC5tYXAoeCA9PiB4LmNsb25lKHsgaWQ6IG93bmVyPy5nZXRJZCgpICsgJy4nICsgeC5nZXRJZCgpIH0pKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhDbG9uZVJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWxDbG9uZSB9KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoQ2xvbmVSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsQ2xvbmUuZm9yRWFjaCh4ID0+IG93bmVyPy5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsQ2xvbmVcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHsgLy8gY29tcGFyZSB0aGUgcmlnaHQgYW5kIGxlZnQgdmFsdWVzXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5zdWJqZWN0LCBhcmdzKS5hdCgwKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5wcmVkaWNhdGUsIGFyZ3MpLmF0KDApXG4gICAgICAgIHJldHVybiBzdWJqZWN0Py5lcXVhbHMocHJlZGljYXRlISkgJiYgKCFhc3QubmVnYXRpb24pID8gW25ldyBOdW1iZXJUaGluZygxKV0gOiBbXVxuICAgIH1cblxuICAgIGNvbnNvbGUud2FybigncHJvYmxlbSB3aXRoIGNvcHVsYSBzZW50ZW5jZSEnKVxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBhYm91dChjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCkge1xuICAgIHJldHVybiBjbGF1c2UuZmxhdExpc3QoKS5maWx0ZXIoeCA9PiB4LmVudGl0aWVzLmluY2x1ZGVzKGVudGl0eSkgJiYgeC5lbnRpdGllcy5sZW5ndGggPD0gMSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpLnNpbXBsZVxufVxuXG5mdW5jdGlvbiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogVmVyYlNlbnRlbmNlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7IC8vVE9ETzogbXVsdGlwbGUgc3ViamVjdHMvb2JqZWN0c1xuXG4gICAgY29uc3QgdmVyYiA9IGFzdC52ZXJiLnJlZmVyZW50cy5hdCgwKSBhcyBWZXJiVGhpbmcgfCB1bmRlZmluZWRcbiAgICBjb25zdCBzdWJqZWN0ID0gYXN0LnN1YmplY3QgPyBldmFsQXN0KGNvbnRleHQsIGFzdC5zdWJqZWN0KS5hdCgwKSA6IHVuZGVmaW5lZFxuICAgIGNvbnN0IG9iamVjdCA9IGFzdC5vYmplY3QgPyBldmFsQXN0KGNvbnRleHQsIGFzdC5vYmplY3QpLmF0KDApIDogdW5kZWZpbmVkXG5cbiAgICAvLyBjb25zb2xlLmxvZygndmVyYj0nLCB2ZXJiKVxuICAgIC8vIGNvbnNvbGUubG9nKCdzdWJqZWN0PScsIHN1YmplY3QpXG4gICAgLy8gY29uc29sZS5sb2coJ29iamVjdD0nLCBvYmplY3QpXG4gICAgLy8gY29uc29sZS5sb2coJ2NvbXBsZW1lbnRzPScsIGNvbXBsZW1lbnRzKVxuXG4gICAgaWYgKCF2ZXJiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCB2ZXJiICcgKyBhc3QudmVyYi5yb290KVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJiLnJ1bihjb250ZXh0LCB7IHN1YmplY3Q6IHN1YmplY3QgPz8gY29udGV4dCwgb2JqZWN0OiBvYmplY3QgPz8gY29udGV4dCB9KVxufVxuXG5mdW5jdGlvbiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQ29tcGxleFNlbnRlbmNlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBpZiAoYXN0LnN1YmNvbmoucm9vdCA9PT0gJ2lmJykge1xuXG4gICAgICAgIGlmIChldmFsQXN0KGNvbnRleHQsIGFzdC5jb25kaXRpb24sIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IGZhbHNlIH0pLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZhbEFzdChjb250ZXh0LCBhc3QuY29uc2VxdWVuY2UsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogTm91blBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KG5wKSAvLyBUT0RPOiBpbnRyYS1zZW50ZW5jZSBhbmFwaG9yYSByZXNvbHV0aW9uXG4gICAgY29uc3QgaW50ZXJlc3RpbmdJZHMgPSBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzLCBucClcbiAgICBsZXQgdGhpbmdzOiBUaGluZ1tdXG4gICAgY29uc3QgYW5kUGhyYXNlID0gYXN0WydhbmQtcGhyYXNlJ10gPyBldmFsQXN0KGNvbnRleHQsIGFzdFsnYW5kLXBocmFzZSddPy5bJ25vdW4tcGhyYXNlJ10sIGFyZ3MpIDogW11cblxuICAgIGlmIChhc3Quc3ViamVjdC50eXBlID09PSAnbnVtYmVyLWxpdGVyYWwnKSB7XG4gICAgICAgIHRoaW5ncyA9IGFuZFBocmFzZS5jb25jYXQoZXZhbE51bWJlckxpdGVyYWwoYXN0LnN1YmplY3QpKVxuICAgIH0gZWxzZSBpZiAoYXN0LnN1YmplY3QudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpbmdzID0gZXZhbFN0cmluZyhjb250ZXh0LCBhc3Quc3ViamVjdCwgYXJncykuY29uY2F0KGFuZFBocmFzZSlcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4ISkgLy8gVE9ETyBzb3J0IGJ5IGlkXG4gICAgfVxuXG4gICAgaWYgKGFzdFsnbWF0aC1leHByZXNzaW9uJ10pIHtcbiAgICAgICAgY29uc3QgbGVmdCA9IHRoaW5nc1xuICAgICAgICBjb25zdCBvcCA9IGFzdFsnbWF0aC1leHByZXNzaW9uJ10ub3BlcmF0b3JcbiAgICAgICAgY29uc3QgcmlnaHQgPSBldmFsQXN0KGNvbnRleHQsIGFzdFsnbWF0aC1leHByZXNzaW9uJ10/Llsnbm91bi1waHJhc2UnXSlcbiAgICAgICAgcmV0dXJuIGV2YWxPcGVyYXRpb24obGVmdCwgcmlnaHQsIG9wKVxuICAgIH1cblxuICAgIGlmIChpc0FzdFBsdXJhbChhc3QpIHx8IGFzdFsnYW5kLXBocmFzZSddKSB7IC8vIGlmIHVuaXZlcnNhbCBxdWFudGlmaWVkLCBJIGRvbid0IGNhcmUgaWYgdGhlcmUncyBubyBtYXRjaFxuICAgICAgICBjb25zdCBsaW1pdCA9IGFzdFsnbGltaXQtcGhyYXNlJ10/LlsnbnVtYmVyLWxpdGVyYWwnXVxuICAgICAgICBjb25zdCBsaW1pdE51bSA9IGV2YWxOdW1iZXJMaXRlcmFsKGxpbWl0KS5hdCgwKT8udG9KcygpID8/IHRoaW5ncy5sZW5ndGhcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCBsaW1pdE51bSlcbiAgICB9XG5cbiAgICBpZiAodGhpbmdzLmxlbmd0aCkgeyAvLyBub24tcGx1cmFsLCByZXR1cm4gc2luZ2xlIGV4aXN0aW5nIFRoaW5nXG4gICAgICAgIHJldHVybiB0aGluZ3Muc2xpY2UoMCwgMSlcbiAgICB9XG5cbiAgICAvLyBvciBlbHNlIGNyZWF0ZSBhbmQgcmV0dXJucyB0aGUgVGhpbmdcbiAgICByZXR1cm4gYXJncz8uYXV0b3ZpdmlmaWNhdGlvbiA/IFtjcmVhdGVUaGluZyhucCldIDogW11cblxufVxuXG5mdW5jdGlvbiBldmFsTnVtYmVyTGl0ZXJhbChhc3Q/OiBOdW1iZXJMaXRlcmFsKTogTnVtYmVyVGhpbmdbXSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBkaWdpdHMgPSBhc3QuZGlnaXQubGlzdC5tYXAoeCA9PiB4LnJvb3QpID8/IFtdXG4gICAgY29uc3QgbGl0ZXJhbCA9IGRpZ2l0cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAnJylcblxuICAgIGNvbnN0IHogPSBwYXJzZU51bWJlcihsaXRlcmFsKVxuXG4gICAgaWYgKHopIHtcbiAgICAgICAgcmV0dXJuIFtuZXcgTnVtYmVyVGhpbmcoeildXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cblxuZnVuY3Rpb24gZXZhbE9wZXJhdGlvbihsZWZ0OiBUaGluZ1tdLCByaWdodDogVGhpbmdbXSwgb3A/OiBMZXhlbWUpIHtcbiAgICBjb25zdCBzdW1zID0gbGVmdC5tYXAoeCA9PiB4LnRvSnMoKSBhcyBhbnkgKyByaWdodC5hdCgwKT8udG9KcygpKVxuICAgIHJldHVybiBzdW1zLm1hcCh4ID0+IG5ldyBOdW1iZXJUaGluZyh4KSlcbn1cblxuZnVuY3Rpb24gbm91blBocmFzZVRvQ2xhdXNlKGFzdD86IE5vdW5QaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8uc3ViamVjdCA/PyBnZXRJbmNyZW1lbnRhbElkKClcbiAgICBjb25zdCBhZGplY3RpdmVzID0gKGFzdD8uYWRqZWN0aXZlPy5saXN0ID8/IFtdKS5tYXAoeCA9PiB4ISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICBsZXQgbm91biA9IGVtcHR5Q2xhdXNlXG5cbiAgICBpZiAoYXN0Py5zdWJqZWN0LnR5cGUgPT09ICdub3VuJyB8fCBhc3Q/LnN1YmplY3QudHlwZSA9PT0gJ3Byb25vdW4nKSB7XG4gICAgICAgIG5vdW4gPSBjbGF1c2VPZihhc3Quc3ViamVjdCwgc3ViamVjdElkKVxuICAgIH1cblxuICAgIGNvbnN0IGdlbml0aXZlQ29tcGxlbWVudCA9IGdlbml0aXZlVG9DbGF1c2UoYXN0Py5vd25lciwgeyBzdWJqZWN0OiBzdWJqZWN0SWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcbiAgICBjb25zdCBhbmRQaHJhc2UgPSBldmFsQW5kUGhyYXNlKGFzdD8uWydhbmQtcGhyYXNlJ10sIGFyZ3MpXG5cbiAgICByZXR1cm4gYWRqZWN0aXZlcy5hbmQobm91bikuYW5kKGdlbml0aXZlQ29tcGxlbWVudCkuYW5kKGFuZFBocmFzZSlcbn1cblxuZnVuY3Rpb24gZXZhbEFuZFBocmFzZShhbmRQaHJhc2U/OiBBbmRQaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpIHtcblxuICAgIGlmICghYW5kUGhyYXNlKSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZVxuICAgIH1cblxuICAgIHJldHVybiBub3VuUGhyYXNlVG9DbGF1c2UoYW5kUGhyYXNlWydub3VuLXBocmFzZSddIC8qIFRPRE8hIGFyZ3MgKi8pIC8vIG1heWJlIHByb2JsZW0gaWYgbXVsdGlwbGUgdGhpbmdzIGhhdmUgc2FtZSBpZCwgcXVlcnkgaXMgbm90IGdvbm5hIGZpbmQgdGhlbVxufVxuXG5mdW5jdGlvbiBnZW5pdGl2ZVRvQ2xhdXNlKGFzdD86IE5vdW5QaHJhc2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZWRJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb3duZXJJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IG93bmVyID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdC5vd25lciwgeyBzdWJqZWN0OiBvd25lcklkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG4gICAgcmV0dXJuIGNsYXVzZU9mKHsgcm9vdDogJ29mJywgdHlwZTogJ2dlbml0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9IC8qIGdlbml0aXZlUGFydGljbGUgKi8sIG93bmVkSWQsIG93bmVySWQpLmFuZChvd25lcilcbn1cblxuZnVuY3Rpb24gaXNBc3RQbHVyYWwoYXN0OiBBc3ROb2RlKTogYm9vbGVhbiB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdub3VuLXBocmFzZScpIHtcbiAgICAgICAgcmV0dXJuICEhYXN0LnVuaXF1YW50IHx8IE9iamVjdC52YWx1ZXMoYXN0KS5zb21lKHggPT4gaXNBc3RQbHVyYWwoeCkpXG4gICAgfVxuXG4gICAgaWYgKGFzdC50eXBlID09PSAncHJvbm91bicgfHwgYXN0LnR5cGUgPT09ICdub3VuJykge1xuICAgICAgICByZXR1cm4gaXNQbHVyYWwoYXN0KVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzOiBNYXBbXSwgY2xhdXNlOiBDbGF1c2UpOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IGdldE51bWJlck9mRG90cyA9IChpZDogSWQpID0+IGlkLnNwbGl0KCcuJykubGVuZ3RoIC8vLTFcbiAgICAvLyB0aGUgb25lcyB3aXRoIG1vc3QgZG90cywgYmVjYXVzZSAnY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uJyBcbiAgICAvLyBoYXMgYnV0dG9uSWQuc3R5bGUuY29sb3IgYW5kIHRoYXQncyB0aGUgb2JqZWN0IHRoZSBzZW50ZW5jZSBzaG91bGQgcmVzb2x2ZSB0b1xuICAgIC8vIHBvc3NpYmxlIHByb2JsZW0gaWYgJ2NvbG9yIG9mIGJ1dHRvbiBBTkQgYnV0dG9uJ1xuICAgIC8vIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgLy8gY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgLy8gcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxuICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuXG4gICAgaWYgKG9jLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKSAvL2FsbFxuICAgIH1cblxuICAgIC8vIFRPRE86IHByb2JsZW0gbm90IHJldHVybmluZyBldmVyeXRoaW5nIGJlY2F1c2Ugb2YgZ2V0T3duZXJzaGlwQ2hhaW4oKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBvd25lZCBsZWFmXG5cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVUaGluZyhjbGF1c2U6IENsYXVzZSk6IFRoaW5nIHtcbiAgICBjb25zdCBiYXNlcyA9IGNsYXVzZS5mbGF0TGlzdCgpLm1hcCh4ID0+IHgucHJlZGljYXRlPy5yZWZlcmVudHM/LlswXSEpLyogT05MWSBGSVJTVD8gKi8uZmlsdGVyKHggPT4geClcbiAgICBjb25zdCBpZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIHJldHVybiBnZXRUaGluZyh7IGlkLCBiYXNlcyB9KVxufVxuXG5mdW5jdGlvbiBldmFsU3RyaW5nKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IFN0cmluZ0xpdGVyYWwsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHggPSBhc3RbJ3N0cmluZy10b2tlbiddLmxpc3QubWFwKHggPT4geC50b2tlbilcbiAgICBjb25zdCB5ID0geC5qb2luKCcgJylcbiAgICByZXR1cm4gW25ldyBTdHJpbmdUaGluZyh5KV1cbn1cblxuZnVuY3Rpb24gY291bGRIYXZlU2lkZUVmZmVjdHMoYXN0OiBBc3ROb2RlKSB7IC8vIGFueXRoaW5nIHRoYXQgaXMgbm90IGEgbm91bnBocmFzZSBDT1VMRCBoYXZlIHNpZGUgZWZmZWN0c1xuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7IC8vIHRoaXMgaXMgbm90IG9rLCBpdCdzIGhlcmUganVzdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucyAoc2F2aW5nIGFsbCBvZiB0aGUgbWFjcm9zIGlzIGN1cnJlbnRseSBleHBlbnNpdmUpIFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gISEoYXN0LnR5cGUgPT09ICdjb3B1bGEtc2VudGVuY2UnIHx8IGFzdC50eXBlID09PSAndmVyYi1zZW50ZW5jZScgfHwgYXN0LnR5cGUgPT09ICdjb21wbGV4LXNlbnRlbmNlJylcbn1cblxuaW50ZXJmYWNlIFRvQ2xhdXNlT3B0cyB7XG4gICAgc3ViamVjdD86IElkLFxuICAgIGF1dG92aXZpZmljYXRpb24/OiBib29sZWFuLFxuICAgIHNpZGVFZmZlY3RzPzogYm9vbGVhbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWxNYWNybyhjb250ZXh0OiBDb250ZXh0LCBtYWNybzogTWFjcm8pOiBUaGluZ1tdIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNyby5tYWNyb3BhcnQubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvLnN1YmplY3Qucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIGNvbnRleHQuc2V0U3ludGF4KG5hbWUsIHN5bnRheClcbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gbWFjcm9QYXJ0VG9NZW1iZXIobWFjcm9QYXJ0OiBNYWNyb3BhcnQpOiBNZW1iZXIge1xuXG4gICAgY29uc3QgdGFnZ2VkVW5pb25zID0gbWFjcm9QYXJ0Py50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IGdyYW1tYXJzID0gdGFnZ2VkVW5pb25zLm1hcCh4ID0+IHg/Lm5vdW4pXG5cbiAgICBjb25zdCBleGNlcHRVbmlvbnMgPSBtYWNyb1BhcnQ/LmV4Y2VwdHVuaW9uPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IG5vdEdyYW1tYXJzID0gZXhjZXB0VW5pb25zLm1hcCh4ID0+IHg/Lm5vdW4pXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlczogZ3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICAgICAgcm9sZTogbWFjcm9QYXJ0W1wiZ3JhbW1hci1yb2xlXCJdPy5yb290LFxuICAgICAgICBudW1iZXI6IG1hY3JvUGFydC5jYXJkaW5hbGl0eT8uY2FyZGluYWxpdHksXG4gICAgICAgIGV4Y2VwdFR5cGVzOiBub3RHcmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgICAgICBub3RBc3Q6ICEhbWFjcm9QYXJ0Wydub3QtYXN0LWtleXdvcmQnXSxcbiAgICAgICAgZXhwYW5kOiAhIW1hY3JvUGFydFsnZXhwYW5kLWtleXdvcmQnXSxcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IGV4dHJhcG9sYXRlLCBMZXhlbWUgfSBmcm9tICcuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi8uLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnLi4vLi4vdXRpbHMvdW5pcSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICAgICBwcm90ZWN0ZWQgbGV4ZW1lczogTGV4ZW1lW10gPSBbXSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGdldElkKCk6IElkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRcbiAgICB9XG5cbiAgICBjbG9uZShvcHRzPzogeyBpZDogSWQgfSk6IFRoaW5nIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoXG4gICAgICAgICAgICBvcHRzPy5pZCA/PyB0aGlzLmlkLCAvLyBjbG9uZXMgaGF2ZSBzYW1lIGlkXG4gICAgICAgICAgICB0aGlzLmJhc2VzLm1hcCh4ID0+IHguY2xvbmUoKSksXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLmNoaWxkcmVuKS5tYXAoZSA9PiAoeyBbZVswXV06IGVbMV0uY2xvbmUoKSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKSxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGV4dGVuZHMgPSAodGhpbmc6IFRoaW5nKSA9PiB7XG4gICAgICAgIHRoaXMudW5leHRlbmRzKHRoaW5nKSAvLyBvciBhdm9pZD9cbiAgICAgICAgdGhpcy5iYXNlcy5wdXNoKHRoaW5nLmNsb25lKCkpXG4gICAgfVxuXG4gICAgdW5leHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmJhc2VzID0gdGhpcy5iYXNlcy5maWx0ZXIoeCA9PiB4LmdldElkKCkgIT09IHRoaW5nLmdldElkKCkpXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLicpXG4gICAgICAgIGNvbnN0IHAxID0gcGFydHNbMF1cbiAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW3AxXSA/PyB0aGlzLmNoaWxkcmVuW2lkXVxuICAgICAgICBjb25zdCByZXMgPSAvKiBwYXJ0cy5sZW5ndGggPiAxICovIGNoaWxkLmdldElkKCkgIT09IGlkID8gY2hpbGQuZ2V0KGlkIC8qIHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSAqLykgOiBjaGlsZFxuICAgICAgICByZXR1cm4gcmVzID8/IHRoaXMuYmFzZXMuZmluZCh4ID0+IHguZ2V0KGlkKSlcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCB0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpZF0gPSB0aGluZ1xuICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICd0aGluZycsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pIC8vIGV2ZXJ5IHRoaW5nIGlzIGEgdGhpbmdcblxuICAgICAgICAvL1RPRE9cbiAgICAgICAgaWYgKHR5cGVvZiB0aGluZy50b0pzKCkgPT09ICdzdHJpbmcnKSB7IC8vVE9ETyBtYWtlIHRoaXMgcG9seW1vcnBoaWNcbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgcm9vdDogJ3N0cmluZycsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaW5nLnRvSnMoKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgcm9vdDogJ251bWJlcicsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHRvSnMoKTogb2JqZWN0IHwgbnVtYmVyIHwgc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgLy9UT0RPb29vb29vb29PTyFcbiAgICB9XG5cbiAgICBxdWVyeShxdWVyeTogQ2xhdXNlKTogTWFwW10ge1xuICAgICAgICByZXR1cm4gdW5pcSh0aGlzLnRvQ2xhdXNlKHF1ZXJ5KS5xdWVyeShxdWVyeSwgey8qIGl0OiB0aGlzLmxhc3RSZWZlcmVuY2VkICAqLyB9KSlcbiAgICB9XG5cbiAgICB0b0NsYXVzZSA9IChxdWVyeT86IENsYXVzZSk6IENsYXVzZSA9PiB7XG5cbiAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZW1lc1xuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiB4LnJlZmVyZW50cy5tYXAociA9PiBjbGF1c2VPZih4LCByLmdldElkKCkpKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCB5ID0gT2JqZWN0XG4gICAgICAgICAgICAua2V5cyh0aGlzLmNoaWxkcmVuKVxuICAgICAgICAgICAgLm1hcCh4ID0+IGNsYXVzZU9mKHsgcm9vdDogJ29mJywgdHlwZTogJ3ByZXBvc2l0aW9uJywgcmVmZXJlbnRzOiBbXSB9LCB4LCB0aGlzLmlkKSkgLy8gaGFyZGNvZGVkIGVuZ2xpc2ghXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgeiA9IE9iamVjdFxuICAgICAgICAgICAgLnZhbHVlcyh0aGlzLmNoaWxkcmVuKVxuICAgICAgICAgICAgLm1hcCh4ID0+IHgudG9DbGF1c2UocXVlcnkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIHJldHVybiB4LmFuZCh5KS5hbmQoeikuc2ltcGxlXG4gICAgfVxuXG4gICAgc2V0TGV4ZW1lID0gKGxleGVtZTogTGV4ZW1lKSA9PiB7XG5cbiAgICAgICAgY29uc3Qgb2xkID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCA9PT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIGNvbnN0IHVwZGF0ZWQ6IExleGVtZVtdID0gb2xkLm1hcCh4ID0+ICh7IC4uLngsIC4uLmxleGVtZSwgcmVmZXJlbnRzOiBbLi4ueC5yZWZlcmVudHMsIC4uLmxleGVtZS5yZWZlcmVudHNdIH0pKVxuICAgICAgICB0aGlzLmxleGVtZXMgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4geC5yb290ICE9PSBsZXhlbWUucm9vdClcbiAgICAgICAgY29uc3QgdG9CZUFkZGVkID0gdXBkYXRlZC5sZW5ndGggPyB1cGRhdGVkIDogW2xleGVtZV1cbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goLi4udG9CZUFkZGVkKVxuICAgICAgICBjb25zdCBleHRyYXBvbGF0ZWQgPSB0b0JlQWRkZWQuZmxhdE1hcCh4ID0+IGV4dHJhcG9sYXRlKHgsIHRoaXMpKVxuICAgICAgICB0aGlzLmxleGVtZXMucHVzaCguLi5leHRyYXBvbGF0ZWQpXG5cbiAgICB9XG5cbiAgICBnZXRMZXhlbWVzID0gKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWVbXSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiByb290T3JUb2tlbiA9PT0geC50b2tlbiB8fCByb290T3JUb2tlbiA9PT0geC5yb290KVxuICAgIH1cblxuICAgIHJlbW92ZUxleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGdhcmJhZ2UgPSB0aGlzLmdldExleGVtZXMocm9vdE9yVG9rZW4pLmZsYXRNYXAoeCA9PiB4LnJlZmVyZW50cylcbiAgICAgICAgZ2FyYmFnZS5mb3JFYWNoKHggPT4gZGVsZXRlIHRoaXMuY2hpbGRyZW5beC5nZXRJZCgpXSlcbiAgICAgICAgdGhpcy5sZXhlbWVzID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHJvb3RPclRva2VuICE9PSB4LnRva2VuICYmIHJvb3RPclRva2VuICE9PSB4LnJvb3QpXG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyOiBUaGluZyk6IGJvb2xlYW4geyAvL1RPRE86IGltcGxlbWVudCBuZXN0ZWQgc3RydWN0dXJhbCBlcXVhbGl0eVxuICAgICAgICByZXR1cm4gdGhpcy50b0pzKCkgPT09IG90aGVyPy50b0pzKClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0NvbmZpZ1wiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IExleGVtZSwgZXh0cmFwb2xhdGUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWF4UHJlY2VkZW5jZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvbWF4UHJlY2VkZW5jZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgQmFzaWNDb250ZXh0IGV4dGVuZHMgQmFzZVRoaW5nIGltcGxlbWVudHMgQ29udGV4dCB7XG5cbiAgICBwcm90ZWN0ZWQgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnID0gZ2V0Q29uZmlnKCksXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IGNvbmZpZy5zeW50YXhlcyxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gY29uZmlnLmxleGVtZXMuZmxhdE1hcChsID0+IFtsLCAuLi5leHRyYXBvbGF0ZShsKV0pLFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZXM6IFRoaW5nW10gPSBbXSxcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOiB7IFtpZDogSWRdOiBUaGluZyB9ID0ge30sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGlkLCBiYXNlcywgY2hpbGRyZW4sIGxleGVtZXMpXG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4geyAvL1RPRE8hXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgICAgICAgICByZWZlcmVudHM6IFtdLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICB9XG5cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlZnJlc2hTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG5hbWU6IHN0cmluZywgc3ludGF4OiBTeW50YXgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUobWFrZUxleGVtZSh7IHR5cGU6ICdub3VuJywgcm9vdDogbmFtZSwgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheFxuICAgICAgICB0aGlzLnN5bnRheExpc3QgPSB0aGlzLnJlZnJlc2hTeW50YXhMaXN0KClcbiAgICB9XG5cbiAgICBnZXRTeW50YXggPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhNYXBbbmFtZSBhcyBDb21wb3NpdGVUeXBlXVxuICAgIH1cblxuICAgIGdldCBhc3RUeXBlcygpOiBBc3RUeXBlW10ge1xuICAgICAgICBjb25zdCByZXM6IEFzdFR5cGVbXSA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLnNsaWNlKCkgLy9jb3B5IVxuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgY2xvbmUoKTogQ29udGV4dCB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KFxuICAgICAgICAgICAgdGhpcy5pZCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgICAgIHRoaXMuc3ludGF4TWFwLFxuICAgICAgICAgICAgdGhpcy5sZXhlbWVzLFxuICAgICAgICAgICAgdGhpcy5iYXNlcyxcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4sIC8vc2hhbGxvdyBvciBkZWVwP1xuICAgICAgICApXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgQXN0VHlwZSwgU3ludGF4IH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBCYXNpY0NvbnRleHQgfSBmcm9tIFwiLi9CYXNpY0NvbnRleHRcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IGV4dGVuZHMgVGhpbmcge1xuICAgIGdldFN5bnRheChuYW1lOiBBc3RUeXBlKTogU3ludGF4XG4gICAgc2V0U3ludGF4KG5hbWU6IHN0cmluZywgc3ludGF4OiBTeW50YXgpOiB2b2lkXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW11cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW11cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZ1xuICAgIGNsb25lKCk6IENvbnRleHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQob3B0czogeyBpZDogSWQgfSk6IENvbnRleHQge1xuICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KG9wdHMuaWQpXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvblRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBBc3ROb2RlKSB7XG4gICAgICAgIHN1cGVyKGdldEluY3JlbWVudGFsSWQoKSlcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcblxuZXhwb3J0IGNsYXNzIE51bWJlclRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBudW1iZXIsIGlkOiBJZCA9IHZhbHVlICsgJycpIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgdG9KcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCk6IFRoaW5nIHsgLy9UT0RPIVxuICAgICAgICByZXR1cm4gbmV3IE51bWJlclRoaW5nKHRoaXMudmFsdWUsIG9wdHM/LmlkKVxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiXG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogc3RyaW5nLCBpZDogSWQgPSB2YWx1ZSkge1xuICAgICAgICBzdXBlcihpZClcbiAgICB9XG5cbiAgICBvdmVycmlkZSB0b0pzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXG4gICAgfVxuXG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IHN0cmluZyB9IHwgdW5kZWZpbmVkKTogVGhpbmcgeyAvL1RPRE8hXG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nVGhpbmcodGhpcy52YWx1ZSwgb3B0cz8uaWQpXG4gICAgfVxuXG59IiwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvTWFwXCJcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBUaGluZyB7XG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBJZCB9KTogVGhpbmdcbiAgICB0b0pzKCk6IG9iamVjdCB8IG51bWJlciB8IHN0cmluZ1xuICAgIHRvQ2xhdXNlKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgdW5leHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IE1hcFtdXG4gICAgZ2V0TGV4ZW1lcyhyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lW11cbiAgICByZW1vdmVMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IHZvaWRcbiAgICBzZXRMZXhlbWUobGV4ZW1lOiBMZXhlbWUpOiB2b2lkXG4gICAgZ2V0SWQoKTogSWRcbiAgICBlcXVhbHMob3RoZXI6IFRoaW5nKTogYm9vbGVhblxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGluZyhhcmdzOiB7IGlkOiBJZCwgYmFzZXM6IFRoaW5nW10gfSkge1xuICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKGFyZ3MuaWQsIGFyZ3MuYmFzZXMpXG59IiwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi8uLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vZXZhbC9ldmFsQXN0XCI7XG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCI7XG5pbXBvcnQgeyBJbnN0cnVjdGlvblRoaW5nIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25UaGluZ1wiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZlcmIgZXh0ZW5kcyBUaGluZyB7XG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgW3JvbGUgaW4gVmVyYkFyZ3NdOiBUaGluZyB9KTogVGhpbmdbXSAvLyBjYWxsZWQgZGlyZWN0bHkgaW4gZXZhbFZlcmJTZW50ZW5jZSgpXG59XG5cbnR5cGUgVmVyYkFyZ3MgPSAnc3ViamVjdCcgLy9UT0RPXG4gICAgfCAnb2JqZWN0J1xuXG5leHBvcnQgY2xhc3MgVmVyYlRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIGltcGxlbWVudHMgVmVyYiB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICByZWFkb25seSBpbnN0cnVjdGlvbnM6IEluc3RydWN0aW9uVGhpbmdbXSwgLy9vciBJbnN0cnVjdGlvblRoaW5nP1xuICAgICkge1xuICAgICAgICBzdXBlcihpZClcbiAgICB9XG5cbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBzdWJqZWN0OiBUaGluZywgb2JqZWN0OiBUaGluZywgfSk6IFRoaW5nW10ge1xuXG4gICAgICAgIGNvbnN0IGNsb25lZENvbnRleHQgPSBjb250ZXh0LmNsb25lKClcbiAgICAgICAgLy8gaW5qZWN0IGFyZ3MsIHJlbW92ZSBoYXJjb2RlZCBlbmdsaXNoIVxuICAgICAgICAvL1RPTyBJIGd1ZXNzIHNldHRpbmcgY29udGV4dCBvbiBjb250ZXh0IHN1YmplY3QgcmVzdWx0cyBpbiBhbiBpbmYgbG9vcC9tYXggdG9vIG11Y2ggcmVjdXJzaW9uIGVycm9yXG4gICAgICAgIC8vIGNsb25lZENvbnRleHQuc2V0KGFyZ3Muc3ViamVjdC5nZXRJZCgpLCBhcmdzLnN1YmplY3QpXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0KGFyZ3Mub2JqZWN0LmdldElkKCksIGFyZ3Mub2JqZWN0KVxuICAgICAgICBjbG9uZWRDb250ZXh0LnNldExleGVtZSh7IHJvb3Q6ICdzdWJqZWN0JywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW2FyZ3Muc3ViamVjdF0gfSlcbiAgICAgICAgY2xvbmVkQ29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnb2JqZWN0JywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW2FyZ3Mub2JqZWN0XSB9KVxuXG4gICAgICAgIGxldCByZXN1bHRzOiBUaGluZ1tdID0gW11cblxuICAgICAgICB0aGlzLmluc3RydWN0aW9ucy5mb3JFYWNoKGlzdHJ1Y3Rpb24gPT4ge1xuICAgICAgICAgICAgcmVzdWx0cyA9IGV2YWxBc3QoY2xvbmVkQ29udGV4dCwgaXN0cnVjdGlvbi52YWx1ZSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxufVxuXG5cbi8vIHggaXMgXCJjaWFvXCJcbi8vIHkgaXMgXCJtb25kb1wiXG4vLyB5b3UgbG9nIHggYW5kIHlcbi8vIHlvdSBsb2cgXCJjYXByYSFcIlxuLy8gc3R1cGlkaXplIGlzIHRoZSBwcmV2aW91cyBcIjJcIiBpbnN0cnVjdGlvbnNcbi8vIHlvdSBzdHVwaWRpemVcbmV4cG9ydCBjb25zdCBsb2dWZXJiID0gbmV3IChjbGFzcyBleHRlbmRzIFZlcmJUaGluZyB7IC8vVE9ETzogdGFrZSBsb2NhdGlvbiBjb21wbGVtZW50LCBlaXRoZXIgY29uc29sZSBvciBcInN0ZG91dFwiICFcbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBzdWJqZWN0OiBUaGluZzsgb2JqZWN0OiBUaGluZzsgfSk6IFRoaW5nW10ge1xuICAgICAgICBjb25zb2xlLmxvZyhhcmdzLm9iamVjdC50b0pzKCkpXG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cbn0pKCdsb2cnLCBbXSlcblxuXG4iLCJpbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5pbXBvcnQgeyBsZXhlbWVUeXBlcyB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgcHJlbHVkZSB9IGZyb20gXCIuL3ByZWx1ZGVcIlxuaW1wb3J0IHsgc3ludGF4ZXMsIHN0YXRpY0Rlc2NQcmVjZWRlbmNlIH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWcoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsZXhlbWVUeXBlcyxcbiAgICAgICAgbGV4ZW1lcyxcbiAgICAgICAgc3ludGF4ZXMsXG4gICAgICAgIHByZWx1ZGUsXG4gICAgICAgIHN0YXRpY0Rlc2NQcmVjZWRlbmNlLFxuICAgICAgICAvLyB0aGluZ3MsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIExleGVtZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgbGV4ZW1lVHlwZXM+XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuXG4gICdhbnktbGV4ZW1lJyxcbiAgJ2FkamVjdGl2ZScsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ3ZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdub25zdWJjb25qJywgLy8gYW5kXG4gICdkaXNqdW5jJywgLy8gb3JcbiAgJ3Byb25vdW4nLFxuICAncXVvdGUnLFxuXG4gICdtYWtyby1rZXl3b3JkJyxcbiAgJ2V4Y2VwdC1rZXl3b3JkJyxcbiAgJ3RoZW4ta2V5d29yZCcsXG4gICdlbmQta2V5d29yZCcsXG5cbiAgJ2dlbml0aXZlLXBhcnRpY2xlJyxcbiAgJ2RhdGl2ZS1wYXJ0aWNsZScsXG4gICdhYmxhdGl2ZS1wYXJ0aWNsZScsXG4gICdsb2NhdGl2ZS1wYXJ0aWNsZScsXG4gICdpbnN0cnVtZW50YWwtcGFydGljbGUnLFxuICAnY29taXRhdGl2ZS1wYXJ0aWNsZScsXG5cbiAgJ25leHQta2V5d29yZCcsXG4gICdwcmV2aW91cy1rZXl3b3JkJyxcblxuICAncGx1cy1vcGVyYXRvcicsXG5cbiAgJ2RpZ2l0JyxcblxuXG4gICdjYXJkaW5hbGl0eScsXG4gICdncmFtbWFyLXJvbGUnLFxuXG5cbiAgJ25vdC1hc3Qta2V5d29yZCcsXG4gICdleHBhbmQta2V5d29yZCcsXG5cblxuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG5cbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgdG9rZW46ICdpcycsIGNhcmRpbmFsaXR5OiAxLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgdG9rZW46ICc9JywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LCAvL1RPRE8hIDIrXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2hhdmUnLCB0eXBlOiAndmVyYicsIHJlZmVyZW50czogW10gfSwvL3Rlc3RcbiAgICB7IHJvb3Q6ICdub3QnLCB0eXBlOiAnbmVnYXRpb24nLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBsb2dpY2FsIHJvbGVzIG9mIGEgY29uc3RpdHVlbnQgdG8gYWJzdHJhY3QgYXdheSB3b3JkIG9yZGVyXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ293bmVyJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdyZWNlaXZlcicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3JpZ2luJywgdHlwZTogJ2dyYW1tYXItcm9sZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdsb2NhdGlvbicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW5zdHJ1bWVudCcsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sIC8vbWVhbnNcbiAgICB7IHJvb3Q6ICdjb21wYW5pb24nLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3N0cmluZy10b2tlbicsIHR5cGU6ICdncmFtbWFyLXJvbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3BlcmF0b3InLCB0eXBlOiAnZ3JhbW1hci1yb2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gbnVtYmVyIG9mIHRpbWVzIGEgY29uc3RpdHVlbnQgY2FuIGFwcGVhclxuICAgIHsgcm9vdDogJ29wdGlvbmFsJywgdHlwZTogJ2NhcmRpbmFsaXR5JywgY2FyZGluYWxpdHk6ICcxfDAnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb25lLW9yLW1vcmUnLCB0eXBlOiAnY2FyZGluYWxpdHknLCBjYXJkaW5hbGl0eTogJysnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnemVyby1vci1tb3JlJywgdHlwZTogJ2NhcmRpbmFsaXR5JywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gZm9yIHVzZSBpbiBhIHBhcnQgb2Ygbm91bi1waHJhc2VcbiAgICB7IHJvb3Q6ICduZXh0JywgdHlwZTogJ25leHQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdwcmV2aW91cycsIHR5cGU6ICdwcmV2aW91cy1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnb3InLCB0eXBlOiAnZGlzanVuYycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbmQnLCB0eXBlOiAnbm9uc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoZScsIHR5cGU6ICdkZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaWYnLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd3aGVuJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXZlcnknLCB0eXBlOiAndW5pcXVhbnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW55JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoYXQnLCB0eXBlOiAncmVscHJvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpdCcsIHR5cGU6ICdwcm9ub3VuJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnXCInLCB0eXBlOiAncXVvdGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnLicsIHR5cGU6ICdmdWxsc3RvcCcsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ3RoZW4nLCB0eXBlOiAndGhlbi1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V4Y2VwdCcsIHR5cGU6ICdleGNlcHQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdtYWtybycsIHR5cGU6ICdtYWtyby1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2VuZCcsIHR5cGU6ICdlbmQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnb2YnLCB0eXBlOiAnZ2VuaXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndG8nLCB0eXBlOiAnZGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2Zyb20nLCB0eXBlOiAnYWJsYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb24nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW4nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYXQnLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYnknLCB0eXBlOiAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3dpdGgnLCB0eXBlOiAnY29taXRhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcrJywgdHlwZTogJ3BsdXMtb3BlcmF0b3InLCByZWZlcmVudHM6IFtdIH0sXG4gICAgXG5cbiAgICB7IHJvb3Q6ICcwJywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzEnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnMicsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICczJywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzQnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNScsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc2JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzcnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnOCcsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc5JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuXG5cbiAgICB7IHJvb3Q6ICdub3QtYXN0JywgdHlwZTogJ25vdC1hc3Qta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdleHBhbmQnLCB0eXBlOiAnZXhwYW5kLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG5cblxuXVxuXG4iLCJleHBvcnQgY29uc3QgcHJlbHVkZTogc3RyaW5nID1cblxuICBgIFxuICBtYWtyb1xuICAgIGdlbml0aXZlIGlzIG5vdC1hc3QgZ2VuaXRpdmUtcGFydGljbGUgdGhlbiBvd25lciBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBkYXRpdmUgaXMgbm90LWFzdCBkYXRpdmUtcGFydGljbGUgdGhlbiByZWNlaXZlciBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBhYmxhdGl2ZSBpcyBub3QtYXN0IGFibGF0aXZlLXBhcnRpY2xlIHRoZW4gb3JpZ2luIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGxvY2F0aXZlIGlzIG5vdC1hc3QgbG9jYXRpdmUtcGFydGljbGUgdGhlbiBsb2NhdGlvbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBpbnN0cnVtZW50YWwgaXMgbm90LWFzdCBpbnN0cnVtZW50YWwtcGFydGljbGUgdGhlbiBpbnN0cnVtZW50IG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGNvbWl0YXRpdmUgaXMgbm90LWFzdCBjb21pdGF0aXZlLXBhcnRpY2xlIHRoZW4gY29tcGFuaW9uIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb3B1bGEtc2VudGVuY2UgaXMgXG4gICAgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICB0aGVuIGNvcHVsYSBcbiAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBhbmQtcGhyYXNlIGlzIG5vbnN1YmNvbmogdGhlbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBsaW1pdC1waHJhc2UgaXMgbmV4dC1rZXl3b3JkIG9yIHByZXZpb3VzLWtleXdvcmQgdGhlbiBvcHRpb25hbCBudW1iZXItbGl0ZXJhbFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBtYXRoLWV4cHJlc3Npb24gaXMgb3BlcmF0b3IgcGx1cy1vcGVyYXRvciB0aGVuIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBub3VuLXBocmFzZSBpcyBcbiAgICBvcHRpb25hbCB1bmlxdWFudFxuICAgIHRoZW4gb3B0aW9uYWwgZXhpc3RxdWFudFxuICAgIHRoZW4gb3B0aW9uYWwgaW5kZWZhcnRcbiAgICB0aGVuIG9wdGlvbmFsIGRlZmFydFxuICAgIHRoZW4gemVyby1vci1tb3JlIGFkamVjdGl2ZXNcbiAgICB0aGVuIG9wdGlvbmFsIGxpbWl0LXBocmFzZSBcbiAgICB0aGVuIHN1YmplY3Qgbm91biBvciBwcm9ub3VuIG9yIHN0cmluZyBvciBudW1iZXItbGl0ZXJhbFxuICAgIHRoZW4gb3B0aW9uYWwgbWF0aC1leHByZXNzaW9uXG4gICAgdGhlbiBvcHRpb25hbCBzdWJvcmRpbmF0ZS1jbGF1c2VcbiAgICB0aGVuIGV4cGFuZCBvcHRpb25hbCBnZW5pdGl2ZVxuICAgIHRoZW4gb3B0aW9uYWwgYW5kLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgdmVyYi1zZW50ZW5jZSBpcyBcbiAgICBvcHRpb25hbCBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgIHRoZW4gbm90LWFzdCBvcHRpb25hbCBodmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgIHRoZW4gdmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgIHRoZW4gZXhwYW5kIHplcm8tb3ItbW9yZSBkYXRpdmUgb3IgYWJsYXRpdmUgb3IgbG9jYXRpdmUgb3IgaW5zdHJ1bWVudGFsIG9yIGNvbWl0YXRpdmVcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgdmVyYi1zZW50ZW5jZSBcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvbXBsZXgtc2VudGVuY2Utb25lIGlzIFxuICAgIHN1YmNvbmogXG4gICAgdGhlbiBjb25kaXRpb24gc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gbm90LWFzdCB0aGVuLWtleXdvcmRcbiAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZS10d28gaXMgXG4gICAgY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlIFxuICAgIHRoZW4gc3ViY29uaiBcbiAgICB0aGVuIGNvbmRpdGlvbiBzaW1wbGUtc2VudGVuY2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvbXBsZXgtc2VudGVuY2UgaXMgZXhwYW5kIGNvbXBsZXgtc2VudGVuY2Utb25lIG9yIGNvbXBsZXgtc2VudGVuY2UtdHdvXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBzdHJpbmcgaXMgXG4gICAgbm90LWFzdCBxdW90ZSBcbiAgICB0aGVuIG9uZS1vci1tb3JlIHN0cmluZy10b2tlbiBhbnktbGV4ZW1lIGV4Y2VwdCBxdW90ZSBcbiAgICB0aGVuIG5vdC1hc3QgcXVvdGUgXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIG51bWJlci1saXRlcmFsIGlzIG9uZS1vci1tb3JlIGRpZ2l0c1xuICBlbmQuXG5cbiAgYFxuIiwiaW1wb3J0IHsgU3ludGF4TWFwIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBFbGVtZW50VHlwZSB9IGZyb20gXCIuLi91dGlscy9FbGVtZW50VHlwZVwiXG5pbXBvcnQgeyBzdHJpbmdMaXRlcmFscyB9IGZyb20gXCIuLi91dGlscy9zdHJpbmdMaXRlcmFsc1wiXG5cbmV4cG9ydCB0eXBlIENvbXBvc2l0ZVR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgY29uc3RpdHVlbnRUeXBlcz5cblxuZXhwb3J0IGNvbnN0IGNvbnN0aXR1ZW50VHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgICAnbWFjcm8nLFxuICAgICdtYWNyb3BhcnQnLFxuICAgICd0YWdnZWR1bmlvbicsXG4gICAgJ2V4Y2VwdHVuaW9uJyxcblxuICAgICdub3VuLXBocmFzZScsXG4gICAgJ2FuZC1waHJhc2UnLFxuICAgICdsaW1pdC1waHJhc2UnLFxuICAgICdtYXRoLWV4cHJlc3Npb24nLFxuICAgICdjb3B1bGEtc2VudGVuY2UnLFxuICAgICd2ZXJiLXNlbnRlbmNlJyxcbiAgICAnY29tcGxleC1zZW50ZW5jZScsXG5cbiAgICAnZ2VuaXRpdmUtY29tcGxlbWVudCcsXG4gICAgJ2RhdGl2ZS1jb21wbGVtZW50JyxcbiAgICAnYWJsYXRpdmUtY29tcGxlbWVudCcsXG4gICAgJ2xvY2F0aXZlLWNvbXBsZW1lbnQnLFxuICAgICdpbnN0cnVtZW50YWwtY29tcGxlbWVudCcsXG4gICAgJ2NvbWl0YXRpdmUtY29tcGxlbWVudCcsXG5cbiAgICAnc3Vib3JkaW5hdGUtY2xhdXNlJyxcblxuICAgICdzdHJpbmcnLFxuICAgICdudW1iZXItbGl0ZXJhbCcsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gWydtYWNybyddXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuICAgICdtYWNybyc6IFtcbiAgICAgICAgeyB0eXBlczogWydtYWtyby1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ25vdW4nXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlczogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbWFjcm9wYXJ0J10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZW5kLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4cGFuZC1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydub3QtYXN0LWtleXdvcmQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2NhcmRpbmFsaXR5J10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlczogWydncmFtbWFyLXJvbGUnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnZXhjZXB0dW5pb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3RoZW4ta2V5d29yZCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgXSxcbiAgICAndGFnZ2VkdW5pb24nOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnbm91biddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdleGNlcHR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydleGNlcHQta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgIF0sXG4gICAgJ251bWJlci1saXRlcmFsJzogW10sXG4gICAgJ25vdW4tcGhyYXNlJzogW10sXG4gICAgJ2FuZC1waHJhc2UnOiBbXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW10sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtdLFxuICAgICdnZW5pdGl2ZS1jb21wbGVtZW50JzogW10sXG4gICAgJ2NvcHVsYS1zZW50ZW5jZSc6IFtdLFxuICAgICd2ZXJiLXNlbnRlbmNlJzogW10sXG4gICAgJ3N0cmluZyc6IFtdLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW10sXG4gICAgXCJkYXRpdmUtY29tcGxlbWVudFwiOiBbXSxcbiAgICBcImFibGF0aXZlLWNvbXBsZW1lbnRcIjogW10sXG4gICAgXCJsb2NhdGl2ZS1jb21wbGVtZW50XCI6IFtdLFxuICAgIFwiaW5zdHJ1bWVudGFsLWNvbXBsZW1lbnRcIjogW10sXG4gICAgXCJjb21pdGF0aXZlLWNvbXBsZW1lbnRcIjogW10sXG4gICAgJ3N1Ym9yZGluYXRlLWNsYXVzZSc6IFtdLFxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmdzL1RoaW5nXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpbkxpc3RlbmVyXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBsb3RBc3QgfSBmcm9tIFwiLi9wbG90QXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBBc3RDYW52YXMgaW1wbGVtZW50cyBCcmFpbkxpc3RlbmVyIHtcblxuICAgIHJlYWRvbmx5IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcHJvdGVjdGVkIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgICBwcm90ZWN0ZWQgY2FtZXJhT2Zmc2V0ID0geyB4OiB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6IHdpbmRvdy5pbm5lckhlaWdodCAvIDIgfVxuICAgIHByb3RlY3RlZCBpc0RyYWdnaW5nID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgZHJhZ1N0YXJ0ID0geyB4OiAwLCB5OiAwIH1cbiAgICBwcm90ZWN0ZWQgYXN0PzogQXN0Tm9kZVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC54ID0gZS54IC0gdGhpcy5jYW1lcmFPZmZzZXQueFxuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQueSA9IGUueSAtIHRoaXMuY2FtZXJhT2Zmc2V0LnlcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZSA9PiB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYU9mZnNldC54ID0gZS5jbGllbnRYIC0gdGhpcy5kcmFnU3RhcnQueFxuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhT2Zmc2V0LnkgPSBlLmNsaWVudFkgLSB0aGlzLmRyYWdTdGFydC55XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBsb3QoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG9uVXBkYXRlKGFzdDogQXN0Tm9kZSwgcmVzdWx0czogVGhpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFzdCA9IGFzdFxuICAgICAgICB0aGlzLnJlcGxvdCgpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlcGxvdCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMilcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKC13aW5kb3cuaW5uZXJXaWR0aCAvIDIgKyB0aGlzLmNhbWVyYU9mZnNldC54LCAtd2luZG93LmlubmVySGVpZ2h0IC8gMiArIHRoaXMuY2FtZXJhT2Zmc2V0LnkpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQ/LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIGNvbnRleHQgaXMgdW5kZWZpbmVkIScpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hc3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzdCBpcyBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxvdEFzdCh0aGlzLmNvbnRleHQsIHRoaXMuYXN0KVxuICAgICAgICB9KVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgQ29tcG9zaXRlTm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3RUb0VkZ2VMaXN0KFxuICAgIGFzdDogQXN0Tm9kZSxcbiAgICBwYXJlbnROYW1lPzogc3RyaW5nLFxuICAgIGVkZ2VzOiBFZGdlTGlzdCA9IFtdLFxuKTogRWRnZUxpc3Qge1xuXG4gICAgY29uc3QgbGlua3MgPSBPYmplY3QuZW50cmllcyhhc3QpLmZpbHRlcihlID0+IGVbMV0gJiYgZVsxXS50eXBlKVxuXG4gICAgY29uc3QgYXN0TmFtZSA9ICgoYXN0IGFzIExleGVtZSkucm9vdCA/PyBhc3QudHlwZSkgKyByYW5kb20oKVxuXG4gICAgY29uc3QgYWRkaXRpb25zOiBFZGdlTGlzdCA9IFtdXG5cbiAgICBpZiAocGFyZW50TmFtZSkge1xuICAgICAgICBhZGRpdGlvbnMucHVzaChbcGFyZW50TmFtZSwgYXN0TmFtZV0pXG4gICAgfVxuXG4gICAgaWYgKCFsaW5rcy5sZW5ndGggJiYgIShhc3QgYXMgQ29tcG9zaXRlTm9kZSkubGlzdCkgeyAvLyBsZWFmIVxuICAgICAgICByZXR1cm4gWy4uLmVkZ2VzLCAuLi5hZGRpdGlvbnNdXG4gICAgfVxuXG4gICAgaWYgKGxpbmtzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbGlua3NcbiAgICAgICAgICAgIC5mbGF0TWFwKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV6ZXJvID0gZVswXSArIHJhbmRvbSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIFthc3ROYW1lLCBlemVyb10sIC4uLmFzdFRvRWRnZUxpc3QoZVsxXSwgZXplcm8sIGVkZ2VzKV1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKChhc3QgYXMgQ29tcG9zaXRlTm9kZSkubGlzdCkge1xuICAgICAgICBjb25zdCBsaXN0ID0gKGFzdCBhcyBDb21wb3NpdGVOb2RlKS5saXN0Py5mbGF0TWFwKHggPT4gYXN0VG9FZGdlTGlzdCh4LCBhc3ROYW1lLCBlZGdlcykpXG4gICAgICAgIHJldHVybiBbLi4uYWRkaXRpb25zLCAuLi5lZGdlcywgLi4ubGlzdCA/PyBbXV1cbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcmFuZG9tKCkge1xuICAgIHJldHVybiBwYXJzZUludCgxMDAwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpXG59IiwiaW1wb3J0IHsgR3JhcGhOb2RlIH0gZnJvbSBcIi4vTm9kZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3TGluZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZyb206IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gZnJvbU5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0Lm1vdmVUbyhmcm9tLngsIGZyb20ueSlcbiAgICBjb250ZXh0LmxpbmVUbyh0by54LCB0by55KVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdOb2RlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbm9kZTogR3JhcGhOb2RlKSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gbm9kZS5maWxsU3R5bGVcbiAgICBjb250ZXh0LmFyYyhub2RlLngsIG5vZGUueSwgbm9kZS5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBub2RlLnN0cm9rZVN0eWxlXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbiAgICBjb250ZXh0LmZpbGwoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjRkYwMDAwXCJcbiAgICBjb250ZXh0LmZvbnQgPSBcIjEwcHggQXJpYWxcIi8vMjBweFxuICAgIGNvbnN0IHRleHRPZmZzZXQgPSAxMCAqIG5vZGUubGFiZWwubGVuZ3RoIC8gMiAvL3NvbWUgbWFnaWMgaW4gaGVyZSFcbiAgICBjb250ZXh0LmZpbGxUZXh0KG5vZGUubGFiZWwsIG5vZGUueCAtIHRleHRPZmZzZXQsIG5vZGUueSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHMoXG4gICAgaW5pdGlhbFBvczogQ29vcmRpbmF0ZSxcbiAgICBkYXRhOiBFZGdlTGlzdCxcbiAgICBvbGRDb29yZHM6IHsgW3g6IHN0cmluZ106IENvb3JkaW5hdGUgfSA9IHt9LFxuICAgIG5lc3RpbmdGYWN0b3IgPSAxLFxuKTogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9IHtcblxuICAgIGNvbnN0IHJvb3QgPSBnZXRSb290KGRhdGEpIC8vIG5vZGUgdy9vdXQgYSBwYXJlbnRcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgICByZXR1cm4gb2xkQ29vcmRzXG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbk9mKHJvb3QsIGRhdGEpXG4gICAgY29uc3Qgcm9vdFBvcyA9IG9sZENvb3Jkc1tyb290XSA/PyBpbml0aWFsUG9zXG5cbiAgICBjb25zdCB5T2Zmc2V0ID0gNTBcbiAgICBjb25zdCB4T2Zmc2V0ID0gMjAwXG5cbiAgICBjb25zdCBjaGlsZENvb3JkcyA9IGNoaWxkcmVuXG4gICAgICAgIC5tYXAoKGMsIGkpID0+ICh7IFtjXTogeyB4OiByb290UG9zLnggKyBpICogbmVzdGluZ0ZhY3RvciAqIHhPZmZzZXQgKiAoaSAlIDIgPT0gMCA/IDEgOiAtMSksIHk6IHJvb3RQb3MueSArIHlPZmZzZXQgKiAobmVzdGluZ0ZhY3RvciArIDEpIH0gfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgY29uc3QgcmVtYWluaW5nRGF0YSA9IGRhdGEuZmlsdGVyKHggPT4gIXguaW5jbHVkZXMocm9vdCkpXG4gICAgY29uc3QgcGFydGlhbFJlc3VsdCA9IHsgLi4ub2xkQ29vcmRzLCAuLi5jaGlsZENvb3JkcywgLi4ueyBbcm9vdF06IHJvb3RQb3MgfSB9XG5cbiAgICByZXR1cm4gZ2V0Q29vcmRzKGluaXRpYWxQb3MsIHJlbWFpbmluZ0RhdGEsIHBhcnRpYWxSZXN1bHQsIDAuOSAqIG5lc3RpbmdGYWN0b3IpXG59XG5cbmZ1bmN0aW9uIGdldFJvb3QoZWRnZXM6IEVkZ2VMaXN0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gZWRnZXNcbiAgICAgICAgLmZsYXQoKSAvLyB0aGUgbm9kZXNcbiAgICAgICAgLmZpbHRlcihuID0+ICFlZGdlcy5zb21lKGUgPT4gZVsxXSA9PT0gbikpWzBdXG59XG5cbmZ1bmN0aW9uIGdldENoaWxkcmVuT2YocGFyZW50OiBzdHJpbmcsIGVkZ2VzOiBFZGdlTGlzdCkge1xuICAgIHJldHVybiB1bmlxKGVkZ2VzLmZpbHRlcih4ID0+IHhbMF0gPT09IHBhcmVudCkubWFwKHggPT4geFsxXSkpIC8vVE9ETyBkdXBsaWNhdGUgY2hpbGRyZW4gYXJlbid0IHBsb3R0ZWQgdHdpY2UsIGJ1dCBzdGlsbCBtYWtlIHRoZSBncmFwaCB1Z2xpZXIgYmVjYXVzZSB0aGV5IGFkZCBcImlcIiBpbmRlY2VzIGluIGNoaWxkQ29vcmRzIGNvbXB1dGF0aW9uIGFuZCBtYWtlIHNpbmdsZSBjaGlsZCBkaXNwbGF5IE5PVCBzdHJhaWdodCBkb3duLlxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IGFzdFRvRWRnZUxpc3QgfSBmcm9tIFwiLi9hc3RUb0VkZ2VMaXN0XCJcbmltcG9ydCB7IGRyYXdMaW5lIH0gZnJvbSBcIi4vZHJhd0xpbmVcIlxuaW1wb3J0IHsgZHJhd05vZGUgfSBmcm9tIFwiLi9kcmF3Tm9kZVwiXG5pbXBvcnQgeyBnZXRDb29yZHMgfSBmcm9tIFwiLi9nZXRDb29yZHNcIlxuXG5leHBvcnQgZnVuY3Rpb24gcGxvdEFzdChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGFzdDogQXN0Tm9kZSkge1xuXG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodClcblxuICAgIGNvbnN0IHJlY3QgPSBjb250ZXh0LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgZWRnZXMgPSBhc3RUb0VkZ2VMaXN0KGFzdClcbiAgICBjb25zdCBjb29yZHMgPSBnZXRDb29yZHMoeyB4OiByZWN0LnggLSByZWN0LndpZHRoIC8gMiwgeTogcmVjdC55IH0sIGVkZ2VzKVxuXG4gICAgT2JqZWN0LmVudHJpZXMoY29vcmRzKS5mb3JFYWNoKGMgPT4ge1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjWzBdXG4gICAgICAgIGNvbnN0IHBvcyA9IGNbMV1cblxuICAgICAgICBkcmF3Tm9kZShjb250ZXh0LCB7XG4gICAgICAgICAgICB4OiBwb3MueCxcbiAgICAgICAgICAgIHk6IHBvcy55LFxuICAgICAgICAgICAgcmFkaXVzOiAyLCAvLzEwXG4gICAgICAgICAgICBmaWxsU3R5bGU6ICcjMjJjY2NjJyxcbiAgICAgICAgICAgIHN0cm9rZVN0eWxlOiAnIzAwOTk5OScsXG4gICAgICAgICAgICBsYWJlbDogbmFtZS5yZXBsYWNlQWxsKC9cXGQrL2csICcnKVxuICAgICAgICB9KVxuXG4gICAgfSlcblxuICAgIGVkZ2VzLmZvckVhY2goZSA9PiB7XG5cbiAgICAgICAgY29uc3QgZnJvbSA9IGNvb3Jkc1tlWzBdXVxuICAgICAgICBjb25zdCB0byA9IGNvb3Jkc1tlWzFdXVxuXG4gICAgICAgIGlmIChmcm9tICYmIHRvKSB7XG4gICAgICAgICAgICBkcmF3TGluZShjb250ZXh0LCBmcm9tLCB0bylcbiAgICAgICAgfVxuXG4gICAgfSlcbn1cbiIsIlxuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlclwiO1xuaW1wb3J0IHsgZXZhbEFzdCB9IGZyb20gXCIuLi9iYWNrZW5kL2V2YWwvZXZhbEFzdFwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4vQnJhaW5MaXN0ZW5lclwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBnZXRDb250ZXh0IH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmdzL0NvbnRleHRcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmdzL1RoaW5nXCI7XG5pbXBvcnQgeyBsb2dWZXJiIH0gZnJvbSBcIi4uL2JhY2tlbmQvdGhpbmdzL1ZlcmJUaGluZ1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICByZWFkb25seSBjb250ZXh0ID0gZ2V0Q29udGV4dCh7IGlkOiAnZ2xvYmFsJyB9KVxuICAgIHByb3RlY3RlZCBsaXN0ZW5lcnM6IEJyYWluTGlzdGVuZXJbXSA9IFtdXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlKHRoaXMuY29udGV4dC5nZXRQcmVsdWRlKCkpXG4gICAgICAgIHRoaXMuY29udGV4dC5zZXQobG9nVmVyYi5nZXRJZCgpLCBsb2dWZXJiKVxuICAgICAgICB0aGlzLmNvbnRleHQuc2V0TGV4ZW1lKHsgcm9vdDogJ2xvZycsIHR5cGU6ICd2ZXJiJywgcmVmZXJlbnRzOiBbbG9nVmVyYl0gfSlcbiAgICB9XG5cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW10ge1xuXG4gICAgICAgIHJldHVybiBuYXRsYW5nLnNwbGl0KCcuJykuZmxhdE1hcCh4ID0+IHtcblxuICAgICAgICAgICAgcmV0dXJuIGdldFBhcnNlcih4LCB0aGlzLmNvbnRleHQpLnBhcnNlQWxsKCkuZmxhdE1hcChhc3QgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdHM6IFRoaW5nW10gPSBbXVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBldmFsQXN0KHRoaXMuY29udGV4dCwgYXN0IGFzIEFzdE5vZGUpXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsLm9uVXBkYXRlKGFzdCwgcmVzdWx0cylcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcblxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogKG9iamVjdCB8IG51bWJlciB8IHN0cmluZylbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGUobmF0bGFuZykubWFwKHggPT4geC50b0pzKCkpXG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IEJyYWluTGlzdGVuZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVycy5pbmNsdWRlcyhsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL3RoaW5ncy9UaGluZ1wiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCJcblxuLyoqXG4gKiBBIGZhY2FkZSB0byB0aGUgRGVpeGlzY3JpcHQgaW50ZXJwcmV0ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiAob2JqZWN0IHwgbnVtYmVyIHwgc3RyaW5nKVtdXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IEJyYWluTGlzdGVuZXIpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbigpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKClcbn1cbiIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvdGhpbmdzL0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCB0b2tlbnM6IExleGVtZVtdID0gW11cbiAgICBwcm90ZWN0ZWQgd29yZHM6IHN0cmluZ1tdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIHRoaXMud29yZHMgPVxuICAgICAgICAgICAgc3BhY2VPdXQoc291cmNlQ29kZSwgWydcIicsICcuJywgJzAnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXSlcbiAgICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgICAgLnNwbGl0KC9cXHMrLylcblxuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbnMoKVxuICAgIH1cblxuICAgIHJlZnJlc2hUb2tlbnMoKSB7XG4gICAgICAgIHRoaXMudG9rZW5zID0gdGhpcy53b3Jkcy5tYXAodyA9PiB0aGlzLmNvbnRleHQuZ2V0TGV4ZW1lcyh3KS5hdCgwKSA/PyBtYWtlTGV4ZW1lKHsgcm9vdDogdywgdG9rZW46IHcsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlZnJlc2hUb2tlbnMoKVxuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWUge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gc3BhY2VPdXQoc291cmNlQ29kZTogc3RyaW5nLCBzcGVjaWFsQ2hhcnM6IHN0cmluZ1tdKSB7XG5cbiAgICByZXR1cm4gc291cmNlQ29kZVxuICAgICAgICAuc3BsaXQoJycpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGMpID0+IGEgKyAoc3BlY2lhbENoYXJzLmluY2x1ZGVzKGMpID8gJyAnICsgYyArICcgJyA6IGMpLCAnJylcblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ2FyZGluYWxpdHksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuLi9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBwbHVyYWxpemUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvcGx1cmFsaXplXCJcbmltcG9ydCB7IGNvbmp1Z2F0ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9jb25qdWdhdGVcIlxuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC90aGluZ3MvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lPFQgZXh0ZW5kcyBMZXhlbWVUeXBlID0gTGV4ZW1lVHlwZT4ge1xuICAgIHJlYWRvbmx5IHJvb3Q6IHN0cmluZ1xuICAgIHJlYWRvbmx5IHR5cGU6IFRcbiAgICByZWFkb25seSB0b2tlbj86IHN0cmluZ1xuICAgIHJlYWRvbmx5IGNhcmRpbmFsaXR5PzogQ2FyZGluYWxpdHlcbiAgICByZWZlcmVudHM6IFRoaW5nW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VMZXhlbWUoZGF0YTogTGV4ZW1lKTogTGV4ZW1lIHtcbiAgICByZXR1cm4gZGF0YVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbHVyYWwobGV4ZW1lOiBMZXhlbWUpIHtcbiAgICByZXR1cm4gaXNSZXBlYXRhYmxlKGxleGVtZS5jYXJkaW5hbGl0eSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhcG9sYXRlKGxleGVtZTogTGV4ZW1lLCBjb250ZXh0PzogVGhpbmcpOiBMZXhlbWVbXSB7XG5cbiAgICBpZiAobGV4ZW1lLnR5cGUgPT09ICdub3VuJyAmJiAhaXNQbHVyYWwobGV4ZW1lKSkge1xuICAgICAgICByZXR1cm4gW21ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbGV4ZW1lLnJvb3QsXG4gICAgICAgICAgICB0eXBlOiBsZXhlbWUudHlwZSxcbiAgICAgICAgICAgIHRva2VuOiBwbHVyYWxpemUobGV4ZW1lLnJvb3QpLFxuICAgICAgICAgICAgY2FyZGluYWxpdHk6ICcqJyxcbiAgICAgICAgICAgIHJlZmVyZW50czogbGV4ZW1lLnJlZmVyZW50c1xuICAgICAgICB9KV1cbiAgICB9XG5cbiAgICBpZiAobGV4ZW1lLnR5cGUgPT09ICd2ZXJiJykge1xuICAgICAgICByZXR1cm4gY29uanVnYXRlKGxleGVtZS5yb290KS5tYXAoeCA9PiBtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogeCxcbiAgICAgICAgICAgIHJlZmVyZW50czogbGV4ZW1lLnJlZmVyZW50c1xuICAgICAgICB9KSlcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuIiwiaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgQ29tcG9zaXRlTm9kZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIsIFN5bnRheCB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL3RoaW5ncy9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuZ2V0U3ludGF4TGlzdCgpKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNpbXBsZUFzdCA9IHRoaXMuc2ltcGxpZnkoYXN0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNpbXBsZUFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgZXhjZXB0VHlwZXM/OiBBc3RUeXBlW10pIHsgLy9wcm9ibGVtYXRpY1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlcykge1xuXG4gICAgICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5sZXhlci5wb3NcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmtub3duUGFyc2UodClcblxuICAgICAgICAgICAgaWYgKHggJiYgIWV4Y2VwdFR5cGVzPy5pbmNsdWRlcyh4LnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGtub3duUGFyc2UgPSAobmFtZTogQXN0VHlwZSk6IENzdCB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuICAgICAgICAvLyBpZiB0aGUgc3ludGF4IGlzIGFuIFwidW5vZmZpY2lhbFwiIEFTVCwgYWthIGEgQ1NULCBnZXQgdGhlIG5hbWUgb2YgdGhlIFxuICAgICAgICAvLyBhY3R1YWwgQVNUIGFuZCBwYXNzIGl0IGRvd24gdG8gcGFyc2UgY29tcG9zaXRlXG5cbiAgICAgICAgaWYgKHRoaXMuaXNMZWFmKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobmFtZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VMZWFmID0gKG5hbWU6IEFzdFR5cGUpOiBDc3QgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGlmIChuYW1lID09PSB0aGlzLmxleGVyLnBlZWsudHlwZSB8fCBuYW1lID09PSAnYW55LWxleGVtZScpIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4geFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgc3ludGF4OiBTeW50YXgpOiBDc3QgfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmtzOiB7IFt4OiBzdHJpbmddOiBDc3QgfSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHN5bnRheCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgLi4ubGlua3NcbiAgICAgICAgfSBhcyBhbnkgLy8gVE9ETyFcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNZW1iZXIgPSAobTogTWVtYmVyKTogQ3N0IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBhbnlbXSA9IFtdIC8vIFRPRE8hXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5UGFyc2UobS50eXBlcywgbS5leGNlcHRUeXBlcylcblxuICAgICAgICAgICAgaWYgKCF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5wdXNoKHgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpc1JlcGVhdGFibGUobS5udW1iZXIpID8gKHtcbiAgICAgICAgICAgIHR5cGU6IGxpc3RbMF0udHlwZSxcbiAgICAgICAgICAgIGxpc3Q6IGxpc3QsXG4gICAgICAgICAgICBub3RBc3Q6IG0ubm90QXN0LFxuICAgICAgICAgICAgZXhwYW5kOiBtLmV4cGFuZCxcbiAgICAgICAgfSkgOiB7XG4gICAgICAgICAgICAuLi5saXN0WzBdLFxuICAgICAgICAgICAgbm90QXN0OiBtLm5vdEFzdCxcbiAgICAgICAgICAgIGV4cGFuZDogbS5leHBhbmQsXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldExleGVtZVR5cGVzKCkuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShjc3Q6IENzdCk6IEFzdE5vZGUge1xuXG4gICAgICAgIGlmIChjc3QudHlwZSA9PT0gJ21hY3JvJykge1xuICAgICAgICAgICAgcmV0dXJuIGNzdFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNMZWFmKGNzdC50eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZSA9IGNzdC50eXBlXG4gICAgICAgIGNvbnN0IGxpbmtzID0gbGlua3NPZihjc3QpXG4gICAgICAgIGNvbnNvbGUubG9nKHR5cGUsICdsaW5rcz0nLCBsaW5rcylcbiAgICAgICAgY29uc3QgZXhwYW5kZWQgPSBsaW5rcy5mbGF0TWFwKGUgPT4gZVsxXS5leHBhbmQgPyBsaW5rc09mKGVbMV0pIDogW2VdKVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnZXhwYW5kZWQ9JywgZXhwYW5kZWQpXG4gICAgICAgIGNvbnN0IHNpbXBsaWZpZWQgPSBleHBhbmRlZC5tYXAoZSA9PiBbZVswXSwgdGhpcy5zaW1wbGlmeShlWzFdKSBhcyBDc3RdIGFzIGNvbnN0KVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnc2ltcGxpZmllZD0nLCBzaW1wbGlmaWVkKVxuICAgICAgICBjb25zdCBhc3RMaW5rcyA9IHNpbXBsaWZpZWQuZmlsdGVyKGUgPT4gIWVbMV0ubm90QXN0KVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnYXN0TGlua3M9JywgYXN0TGlua3MpXG4gICAgICAgIGNvbnN0IGFzdDogQXN0Tm9kZSA9IE9iamVjdC5mcm9tRW50cmllcyhhc3RMaW5rcykgYXMgYW55XG4gICAgICAgIGNvbnNvbGUubG9nKHR5cGUsICdhc3Q9JywgYXN0KVxuICAgICAgICBjb25zdCBhc3RXaXRoVHlwZSA9IHsgLi4uYXN0LCB0eXBlIH0gYXMgQXN0Tm9kZVxuICAgICAgICBjb25zb2xlLmxvZyh0eXBlLCAnYXN0V2l0aFR5cGU9JywgYXN0V2l0aFR5cGUpXG5cbiAgICAgICAgcmV0dXJuIGFzdFdpdGhUeXBlXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGxpbmtzT2YoY3N0OiBDc3QpOiBbc3RyaW5nLCBDc3RdW10ge1xuXG4gICAgY29uc3QgbGlzdCA9IChjc3QgYXMgQ29tcG9zaXRlTm9kZSkubGlzdCBhcyBDc3RbXSB8IHVuZGVmaW5lZFxuXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkID0gbGlzdC5mbGF0TWFwKHggPT4gbGlua3NPZih4KSlcbiAgICAgICAgY29uc29sZS5sb2coJ3RyeWluZyB0byBleHBhbmQgbGlzdCEnLCBsaXN0LCBmbGF0dGVuZWQpXG4gICAgICAgIHJldHVybiBmbGF0dGVuZWRcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoY3N0KS5maWx0ZXIoZSA9PiBlWzFdICYmIGVbMV0udHlwZSlcbn1cblxuXG50eXBlIENzdCA9IEFzdE5vZGUgJiB7IG5vdEFzdD86IGJvb2xlYW4sIGV4cGFuZD86IGJvb2xlYW4gfVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2JhY2tlbmQvdGhpbmdzL0NvbnRleHRcIlxuaW1wb3J0IHsgS29vbFBhcnNlciB9IGZyb20gXCIuLi9Lb29sUGFyc2VyXCJcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi9Bc3ROb2RlXCJcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZXIge1xuICAgIHBhcnNlQWxsKCk6IEFzdE5vZGVbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29udGV4dDogQ29udGV4dCk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59XG4iLCJpbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBTeW50YXhNYXAsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBjb25zdCBtYXhQcmVjZWRlbmNlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIHJldHVybiBpZENvbXBhcmUoYSwgYikgPz9cbiAgICAgICAgZGVwZW5kZW5jeUNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpID8/XG4gICAgICAgIGxlbkNvbXBhcmUoYSwgYiwgc3ludGF4ZXMpXG5cbn1cblxuY29uc3QgaWRDb21wYXJlID0gKGE6IEFzdFR5cGUsIGI6IEFzdFR5cGUpID0+IHtcbiAgICByZXR1cm4gYSA9PSBiID8gMCA6IHVuZGVmaW5lZFxufVxuXG5jb25zdCBkZXBlbmRlbmN5Q29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICBjb25zdCBhRGVwZW5kc09uQiA9IGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykuaW5jbHVkZXMoYilcbiAgICBjb25zdCBiRGVwZW5kc09uQSA9IGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykuaW5jbHVkZXMoYSlcblxuICAgIGlmIChhRGVwZW5kc09uQiA9PT0gYkRlcGVuZHNPbkEpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBhRGVwZW5kc09uQiA/IDEgOiAtMVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXBlbmRlbmNpZXMoYTogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCwgdmlzaXRlZDogQXN0VHlwZVtdID0gW10pOiBBc3RUeXBlW10geyAvL0RGU1xuXG4gICAgY29uc3QgbWVtYmVycyA9IHN5bnRheGVzW2FdID8/IFtdXG5cbiAgICByZXR1cm4gbWVtYmVycy5mbGF0TWFwKG0gPT4gbS50eXBlcykuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgeyBydW5UZXN0cyB9IGZyb20gXCIuLi8uLi90ZXN0cy9ydW5UZXN0c1wiO1xuaW1wb3J0IHsgY2xlYXJEb20gfSBmcm9tIFwiLi4vLi4vdGVzdHMvdXRpbHMvY2xlYXJEb21cIjtcbmltcG9ydCB7IEFzdENhbnZhcyB9IGZyb20gXCIuLi9kcmF3LWFzdC9Bc3RDYW52YXNcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKTtcbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBicmFpblxuXG4gICAgY29uc3QgYXN0Q2FudmFzID0gbmV3IEFzdENhbnZhcygpXG4gICAgYnJhaW4uYWRkTGlzdGVuZXIoYXN0Q2FudmFzKVxuXG4gICAgY29uc3QgbGVmdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcmlnaHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgY29uc3Qgc3BsaXQgPSAnaGVpZ2h0OiAxMDAlOyB3aWR0aDogNTAlOyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDE7IHRvcDogMDsgIHBhZGRpbmctdG9wOiAyMHB4OydcbiAgICBjb25zdCBsZWZ0ID0gJ2xlZnQ6IDA7IGJhY2tncm91bmQtY29sb3I6ICMxMTE7J1xuICAgIGNvbnN0IHJpZ2h0ID0gJ3JpZ2h0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOydcblxuICAgIGxlZnREaXYuc3R5bGUuY3NzVGV4dCA9IHNwbGl0ICsgbGVmdFxuICAgIHJpZ2h0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIHJpZ2h0ICsgJ292ZXJmbG93OnNjcm9sbDsnICsgJ292ZXJmbG93LXg6c2Nyb2xsOycgKyAnb3ZlcmZsb3cteTpzY3JvbGw7J1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsZWZ0RGl2KVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmlnaHREaXYpXG5cbiAgICByaWdodERpdi5hcHBlbmRDaGlsZChhc3RDYW52YXMuZGl2KVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNDB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuXG4gICAgY29uc3QgY29uc29sZU91dHB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICBjb25zb2xlT3V0cHV0LnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKGNvbnNvbGVPdXRwdXQpXG5cblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZU91dHB1dC52YWx1ZSA9IHJlc3VsdC50b1N0cmluZygpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBhd2FpdCBydW5UZXN0cygpXG4gICAgICAgICAgICBtYWluKClcbiAgICAgICAgfVxuXG4gICAgfSlcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgc29sdmVNYXBzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3NvbHZlTWFwc1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIClcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCR7eWVzfWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHsgLy8gY2FuJ3QgYmUgcHJvcCwgYmVjYXVzZSB3b3VsZCBiZSBjYWxsZWQgaW4gQW5kJ3MgY29ucywgQmFzaWNDbHVzZS5hbmQoKSBjYWxscyBBbmQncyBjb25zLCBcXGluZiByZWN1cnNpb24gZW5zdWVzXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCBpdCA9IG9wdHM/Lml0ID8/IHNvcnRJZHModW5pdmVyc2UuZW50aXRpZXMpLmF0KC0xKSEgLy9UT0RPIVxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlTGlzdCA9IHVuaXZlcnNlLmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgcXVlcnlMaXN0ID0gcXVlcnkuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBtYXBzID0gc29sdmVNYXBzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgICAgIGNvbnN0IHByb25NYXA6IE1hcCA9IHF1ZXJ5TGlzdC5maWx0ZXIoYyA9PiBjLnByZWRpY2F0ZT8udHlwZSA9PT0gJ3Byb25vdW4nKS5tYXAoYyA9PiAoeyBbYy5hcmdzPy5hdCgwKSFdOiBpdCB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgY29uc3QgcmVzID0gbWFwcy5jb25jYXQocHJvbk1hcCkuZmlsdGVyKG0gPT4gT2JqZWN0LmtleXMobSkubGVuZ3RoKSAvLyBlbXB0eSBtYXBzIGNhdXNlIHByb2JsZW1zIGFsbCBhcm91bmQgdGhlIGNvZGUhXG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG4vLyBpbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcblxuZXhwb3J0IGNsYXNzIEF0b21DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgQXRvbUNsYXVzZShcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXA/LlthXSA/PyBhKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICApXG5cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEF0b21DbGF1c2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZWRpY2F0ZS5yb290ICE9PSBxdWVyeS5wcmVkaWNhdGUucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXAgPSBxdWVyeS5hcmdzXG4gICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbiAgICAvLyBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBcbn0iLCJpbXBvcnQgeyBBdG9tQ2xhdXNlIH0gZnJvbSBcIi4vQXRvbUNsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcblxuLyoqXG4gKiBBbiB1bmFtYmlndW91cyBwcmVkaWNhdGUtbG9naWMtbGlrZSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBwcm9ncmFtbWVyJ3MgaW50ZW50LlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW11cbiAgICAvLyBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzPzogYm9vbGVhblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBBdG9tQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IGZhbHNlXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIlxuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCB8dW5kZWZpbmVkID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXSk6IElkW10ge1xuXG4gICAgLy8gY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIC8vIGNvbnN0IHRvcExldmVsID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXVxuXG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGludGVyc2VjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9pbnRlcnNlY3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpYWxJZHMgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuLyoqXG4gKiBGaW5kcyBwb3NzaWJsZSBNYXAtaW5ncyBmcm9tIHF1ZXJ5TGlzdCB0byB1bml2ZXJzZUxpc3RcbiAqIHtAbGluayBcImZpbGU6Ly8uLy4uLy4uLy4uLy4uLy4uL2RvY3Mvbm90ZXMvdW5pZmljYXRpb24tYWxnby5tZFwifVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29sdmVNYXBzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMSwgaSkgPT4ge1xuICAgICAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMiwgaikgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWwxLmxlbmd0aCAmJiBtbDIubGVuZ3RoICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZShtbDEsIG1sMilcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2ldID0gW11cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2pdID0gbWVyZ2VkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXMuZmxhdCgpLmZpbHRlcih4ID0+ICFpc0ltcG9zaWJsZSh4KSlcbn1cblxuZnVuY3Rpb24gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdW10ge1xuICAgIHJldHVybiBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB1bml2ZXJzZUxpc3QuZmxhdE1hcCh1ID0+IHUucXVlcnkocSkpXG4gICAgICAgIHJldHVybiByZXMubGVuZ3RoID8gcmVzIDogW21ha2VJbXBvc3NpYmxlKHEpXVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1sMTogTWFwW10sIG1sMjogTWFwW10pIHtcblxuICAgIGNvbnN0IG1lcmdlZDogTWFwW10gPSBbXVxuXG4gICAgbWwxLmZvckVhY2gobTEgPT4ge1xuICAgICAgICBtbDIuZm9yRWFjaChtMiA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtYXBzQWdyZWUobTEsIG0yKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4ubTEsIC4uLm0yIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXEobWVyZ2VkKVxufVxuXG5mdW5jdGlvbiBtYXBzQWdyZWUobTE6IE1hcCwgbTI6IE1hcCkge1xuICAgIGNvbnN0IGNvbW1vbktleXMgPSBpbnRlcnNlY3Rpb24oT2JqZWN0LmtleXMobTEpLCBPYmplY3Qua2V5cyhtMikpXG4gICAgcmV0dXJuIGNvbW1vbktleXMuZXZlcnkoayA9PiBtMVtrXSA9PT0gbTJba10pXG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvc3NpYmxlKHE6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIHEuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IFt4XTogU3BlY2lhbElkcy5JTVBPU1NJQkxFIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbn1cblxuZnVuY3Rpb24gaXNJbXBvc2libGUobWFwOiBNYXApIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtYXApLmluY2x1ZGVzKFNwZWNpYWxJZHMuSU1QT1NTSUJMRSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJcbi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IHN0cmluZ1xuXG4vKipcbiAqIFNvbWUgc3BlY2lhbCBJZHNcbiAqL1xuZXhwb3J0IGNvbnN0IFNwZWNpYWxJZHMgPSB7XG4gICAgSU1QT1NTSUJMRTogJ0lNUE9TU0lCTEUnXG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZCgpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBuZXdJZFxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuL3VuaXFcIlxuXG4vKipcbiAqIEludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byBsaXN0cyBvZiBzdHJpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHhzOiBzdHJpbmdbXSwgeXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHVuaXEoeHMuZmlsdGVyKHggPT4geXMuaW5jbHVkZXMoeCkpXG4gICAgICAgIC5jb25jYXQoeXMuZmlsdGVyKHkgPT4geHMuaW5jbHVkZXMoeSkpKSlcbn1cbiIsIlxuLyoqXG4gKiBDaGVja3MgaWYgc3RyaW5nIGhhcyBzb21lIG5vbi1kaWdpdCBjaGFyIChleGNlcHQgZm9yIFwiLlwiKSBiZWZvcmVcbiAqIGNvbnZlcnRpbmcgdG8gbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOdW1iZXIoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3Qgbm9uRGlnID0gc3RyaW5nLm1hdGNoKC9cXEQvZyk/LmF0KDApXG5cbiAgICBpZiAobm9uRGlnICYmIG5vbkRpZyAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHJpbmcpXG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS4gRXF1YWxpdHkgYnkgSlNPTi5zdHJpbmdpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHNlcTogVFtdKTogVFtdIHtcbiAgICBjb25zdCBzZWVuOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCJpbXBvcnQgeyB0ZXN0MSB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QxXCI7XG5pbXBvcnQgeyB0ZXN0MiB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QyXCI7XG5pbXBvcnQgeyB0ZXN0MyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3QzXCI7XG5cbmNvbnN0IHRlc3RzID0gW1xuICAgIHRlc3QxLFxuICAgIHRlc3QyLFxuICAgIHRlc3QzLFxuXVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuVGVzdHMoKSB7XG5cbiAgICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IHRlc3QoKVxuICAgICAgICBjb25zb2xlLmxvZyhgJWMke3N1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZmFpbCd9ICR7dGVzdC5uYW1lfWAsIGBjb2xvcjoke3N1Y2Nlc3MgPyAnZ3JlZW4nIDogJ3JlZCd9YClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlKCd4IGlzIDEnKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3kgaXMgMicpXG4gICAgcmV0dXJuIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IG51bWJlcicpLmV2ZXJ5KHggPT4gWzEsIDJdLmluY2x1ZGVzKHggYXMgbnVtYmVyKSlcbn0iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi8uLi9zcmMvZmFjYWRlL0JyYWluXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MigpIHtcbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKClcbiAgICBicmFpbi5leGVjdXRlVW53cmFwcGVkKCd4ID0gMSArIDMgKyA0JylcbiAgICByZXR1cm4gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCgneCcpLmluY2x1ZGVzKDgpXG4gICAgICAgICYmIGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ3RoZSBudW1iZXInKS5pbmNsdWRlcyg4KVxufSIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uLy4uL3NyYy9mYWNhZGUvQnJhaW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzKCkge1xuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKVxuICAgIGJyYWluLmV4ZWN1dGUoJ3ggPSAxLiB5ID0yLicpXG4gICAgY29uc3QgbnVtYmVycyA9IGJyYWluLmV4ZWN1dGVVbndyYXBwZWQoJ2V2ZXJ5IG51bWJlciArIDMnKVxuICAgIHJldHVybiBudW1iZXJzLmluY2x1ZGVzKDQpICYmIG51bWJlcnMuaW5jbHVkZXMoNSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=