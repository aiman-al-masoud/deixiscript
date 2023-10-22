from core.expbuilder import does, e, every, it_is_false_that, new, the
from core.isMatch import isMatch
from core.sortByGenerality import sortByGenerality
from core.decompress import decompress
from core.subst import subst
from core.findAsts import findAsts
from core.language import BinExp, Implicit, GAP, unroll


# %% subst tests
def test_c001():
    x = subst('capra', 'cat', e('capra').does('jump').e)
    assert x == e('cat').does('jump').e

def test_c002():
    x = subst('capra', 'cat', e('capra').and_('cavallo').and_('capra').e)
    assert x == e('cat').and_('cavallo').and_('cat').e

# %% findAsts tests
def test_c006():
    ast = e('capra').and_(3).and_(1).and_('gatto').e
    assert findAsts(ast, lambda x:isinstance(x, int) and not isinstance(x, bool)) == (3, 1)

def test_c007():
    ast = the('cat').does('jump').and_(the('dog').does('run')).e
    assert findAsts(ast, lambda x:isinstance(x, Implicit)) == (the('cat').e, the('dog').e)

def test_c008():
    x = the('cat').which(does('jump')).does('lick')._(the('cat')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (the('cat').which(does('jump')).e, the('cat').e)

# %% decompress tests
def test_c009():
    x1 = decompress(e('capra').and_('cavallo').does('jump').e)
    x2 = e('capra').does('jump').and_(e('cavallo').does('jump')).e
    assert x1 == x2

def test_c010():
    x1 = decompress(e('capra').and_('cavallo').and_('gatto').does('jump').e)
    x2 = e('capra').does('jump').and_(e('cavallo').does('jump')).and_(e('gatto').does('jump')).e
    assert x1 == x2

def test_c011(): #  with demorgan's rule I
    x = it_is_false_that(e(2).and_(3).equals(1)).e
    d = decompress(x)
    y = it_is_false_that(e(2).equals(1)).or_(it_is_false_that(e(3).equals(1))).e
    assert d == y

# %% nounphrases expressions as constructors with tell()
def test_c012():
    x1 = the('cat').tell()
    x2 = the('cat').tell(x1)
    x3 = the('cat').tell(x2)
    allCats = every('cat').get(x3)

    assert isinstance(allCats, BinExp)
    assert unroll(allCats) == ['cat#3', 'cat#2', 'cat#1']

def test_c013(): # which (relative clause)
    kb1 = the('cat').which(does('have')._('fish').as_('food')).tell()
    assert ('cat#1', 'fish', 'food') in kb1.wm

# %% negation with ask tests 
def test_c015():
    q = e('capra#1').does('have')._(1).as_('age')
    notQ = it_is_false_that(q)
    kb1 = q.tell()
    assert q.get(kb1)
    assert not notQ.get(kb1)

def test_c032(): # simple sentence
    q = e('man#1').does('ride').on('horse#1')
    kb1 = the('man').tell()
    kb2 = the('horse').tell(kb1)
    kb3 = q.tell(kb2)
    kb4 = it_is_false_that(q).tell(kb3)

    assert q.get(kb3)
    assert not q.get(kb4)

# %% matchAst tests
def test_c017():
    assert isMatch('it', 'it')
    assert not isMatch('buruf', 'it')

def test_c018():
    gen  = the('cat').e
    spec = the('cat').which(does('have')._('mouse#1').as_('prey')).e
    # print(spec)
    assert isMatch(spec, gen)
    assert not isMatch(gen, spec)

def test_c019():
    gen  = e('cat#1').does('have')._('mouse#1').e
    spec = e('cat#1').does('have')._('mouse#1').and_(e('cat#1').does('have')._('mouse#2')).e
    assert isMatch(spec, gen)
    assert not isMatch(gen, spec)

def test_c020():
    gen   = the('man').does('ride').on(the('horse')).e
    spec1 = the('man').does('ride').on(every('horse')).e
    spec2 = every('man').does('ride').on(the('horse')).e
    spec3 = every('man').does('ride').on(every('horse')).e

    # TODO: maybe a little wrong?
    assert isMatch(spec1, gen)
    assert isMatch(spec2, gen)
    assert isMatch(spec3, gen)
    ##### spec4 =  the('man').does('ride').on(the(0)('horse')).e # assert isMatch(spec1, general) # assert not isMatch(general, spec4)

def test_c040():
    gen = the('son').does('give')._(the('present')).to(the('mother')).e
    spec =the('son').does('give')._(the('present')).to(the('mother')).on(the('birthday')).e
    assert isMatch(spec, gen)
    assert not isMatch(gen, spec)

# def test_c021(): # with subconcepts
#     kb1 = e('stallion').does('be')._('horse').tell()
#     gen = the(1)('man').does('ride').on(the(1)('horse')).e
#     spec1 =  the(1)('man').does('ride').on(the(1)('stallion')).e
#     spec2 =  the(1)('man').does('ride').on(the('lama')).e
#     assert isMatch(gen, spec1, kb1)
#     assert not isMatch(spec1, gen, kb1)
#     assert not isMatch(gen, spec2, kb1)

# def test_c036():
#     kb1 = the('button').tell()
#     x1  = the(1)('button').does('be')._('down').e
#     assert isMatch(x1, e('button#1').does('be')._('down').e , kb1)
#     assert isMatch(x1, e('button#1').does('have')._('down').as_('super').e , kb1)

# %% sort nounphrases by generality tests
def test_c022():
    correct = (  # ascending generality
        the('cat').which(does('be')._('red').and_(does('be')._('black'))).e,
        the('cat').which(does('be')._('red')).e,
        the('cat').e,
    )
    wrong = [correct[2], correct[0], correct[1]]
    maybe = sortByGenerality(correct)
    assert correct != wrong
    assert maybe == correct

# %% simple-sentence understanding yes-no questions
def test_c023():
    kb1 = e('cat#1').does('run').to('fish#1').tell()
    assert e('cat#1').does('run').to('fish#1').get(kb1)
    assert e('cat#1').does('run').get(kb1)
    assert not e('cat#1').does('hide').get(kb1)
    assert not e('cat#1').does('run').to('hill#1').get(kb1)

# %% sort simple-sentences by generality tests
def test_c024():
    
    correct = (
        the('son').does('give')._(the('present')).to(the('mother')).on(the('birthday')).e,
        the('son').does('give')._(the('present')).to(the('mother')).e,
        the('son').does('give')._(the('present')).e,
        the('son').does('give').e,
    )
    wrong = [correct[1], correct[3], correct[0], correct[2]]
    maybe = sortByGenerality(wrong)
    assert maybe == correct

# %% sort analytic derivation clauses by generality tests
def test_c025():
    correct = (
        the('capra').does('run').on(the('hill')).to(the('food')).when(2).e,
        the('capra').does('run').on(the('hill')).when(2).e,
        the('capra').does('run').when(1).e,
    )
    wrong = [correct[2], correct[0], correct[1]]
    maybe = sortByGenerality(wrong)
    assert maybe == correct

# %% idiom tests
def test_c026():
    kb1 = the('it').when(the(1)('thing')).tell()
    kb2 = the('capra').tell(kb1)
    kb3 = the('it').ask(kb2)
    assert 'capra#1' == kb3.head

# def test_c027():
#     kb1 = the(1)('man').does('ride').on(the(1)('horse')).when(the(1)('man').does('sit').on(the(1)('horse')).and_(the(1)('horse').does('move'))).tell()
#     kb2 = the('man').tell(kb1)
#     kb3 = the('horse').tell(kb2)
#     kb4 = the(1)('man').does('ride').on(the(1)('horse')).idiom.tell(kb3)
#     assert e('man#1').does('sit').on('horse#1').and_(e('horse#1').does('move')).get(kb4)
#     assert not e('man#1').does('sit').on('horse').get(kb4) # TODO: test every('horse')

def test_c043():
    kb1 = the('dog').when(the('hund')).tell()
    kb2 = the('hund').when(the('cane')).tell(kb1)
    kb3 = the('cane').tell(kb2)
    x   = the('dog').get(kb3)
    assert x == 'cane#1'

# %% numerality tests
def test_c028():
    kb1 = the('capra').tell()
    kb2 = the('capra').tell(kb1)
    kb3 = the('capra').tell(kb2)
    multiple = every('capra').get(kb3)
    single   = the(1)('capra').get(kb3)

    assert isinstance(multiple, BinExp)
    assert unroll(multiple) == ['capra#3', 'capra#2', 'capra#1']
    assert isinstance(single, str)

# # %% or-operator ask test
# def test_c029():
#     assert e(1).equals(2).or_(e(3).equals(3)).get()
#     assert not e(1).equals(2).or_(e(3).equals(2)).get()

# # %% matching a general implicit sentence to a specific explicit sentence
# def test_c030():
#     gen = the('man').does('ride').on(the('horse'))
#     spec = e('man#1').does('ride').on('horse#1')
#     kb1 = the('man').tell()
#     kb2 = the('horse').tell(kb1)

#     assert isMatch(gen.e, spec.e, kb2)

# %% multiple executions of the same simple sentences are idempotent
def test_c033():
    x1 = e('man#1').does('ride').on('horse#1').tell()
    x2 = e('man#1').does('ride').on('horse#1').tell(x1)
    assert x1.wm == x2.wm

# # %% matchAst with other similar "noise" specific sentences in KB
# def test_c034():
#     kb1 = new(the('cat')).does('eat')._(new(the('mouse'))).tell()
#     kb2 = the('cat').tell(kb1)
#     kb3 = the('mouse').tell(kb2)
#     gen = every('cat').does('eat')._(every('mouse')).e
#     spec = e('cat#2').does('eat')._('mouse#2').e

#     assert isMatch(gen, spec, kb3)
#     assert not isMatch(spec, gen, kb3)

# %% logic and deictic dict test
def test_c035():

    kb1 = the('mouse').tell()
    kb2 = new(the('cat')).does('eat')._(new(the('mouse'))).tell(kb1) # also works with verb wrapped in implicit

    assert the(1)('cat').get(kb2) == 'cat#1'
    assert the(1)('mouse').get(kb2) == 'mouse#2'
    assert e('cat#1').does('eat')._('mouse#2').get(kb2)
    assert the('cat').does('eat')._(the('mouse')).get(kb2)
    assert not e('cat#1').does('eat')._('mouse#1').get(kb2)
    assert the('mouse').which(the('cat').does('eat')._(GAP)).get(kb2) == 'mouse#2'
    # assert the(the('mouse').which(e('cat#1').does('eat')._(_)).e).get(kb2)=='mouse#2'

# %% cause and effect w/ synthetic derivation
def test_c038():
    kb0 = the('button').does('be')._('red').after(the('button').does('be')._('down')).tell()
    kb1 = the('button').tell(kb0)
    kb2 = the('button').tell(kb1)
    kb3 = the('button').does('be')._('down').tell(kb2)
    assert the('button').does('be')._('red').get(kb3)
    assert not e('button#1').does('be')._('red').get(kb3)

def test_c044():
    kb1 = the('domino').does('fall').after(the('wind').does('blow')).tell()
    kb2 = the('domino').does('break').after(the('domino').does('fall')).tell(kb1)
    kb3 = the('domino').tell(kb2)
    kb4 = the('wind').tell(kb3)
    kb5 = the('wind').does('blow').tell(kb4)
    assert ('event#3','break','verb') in kb5.wm
    assert ('event#3','domino#1','subject') in kb5.wm

# def test_c045(): # TODO: cause vanish, effect vanish
#     kb1 = the(1)('capra').does('sing').after(the(1)('capra').does('eat')).tell()
#     kb2 = the('capra').tell(kb1)
#     kb3 = the('capra').does('eat').idiom.tell(kb2)    
#     kb4 = it_is_false_that(the('capra').does('eat')).idiom.tell(kb3)

#     assert the('capra').does('sing').get(kb3)
#     assert not the('capra').does('sing').get(kb4)

# %% ordinality (first/last) test
def test_c039():
    kb0 = the(1)('cat').tell()
    kb1 = the(1)('cat').tell(kb0)

    x1 = the(1)('cat').get(kb1)
    x2 = the('first')(1)('cat').get(kb1) # 1 first -> card should wrap around everything
    x3 = the('last')(1)('cat').get(kb1)
    assert x1 == 'cat#2'
    assert x1 == x3
    assert x2 == 'cat#1'

# TODO
# # %% referring to concepts
# def test_c042():
#     kb0 = the(1)('cat').tell()
#     kb1 = the(1)('dog').tell(kb0)

#     allConcepts = every('concept').get(kb1)
#     # print(allConcepts)

#     assert isinstance(allConcepts, tuple)
#     assert set(allConcepts) == {'cat', 'dog', 'super'} 

#     catConcept = every('concept').which(does('be')._('cat')).get(kb1)
#     assert catConcept == 'cat'

# %% and-phrases
def test_c048():
    x1 = the('capra').tell()
    x2 = the('gatto').tell(x1)
    x3 = the('gatto').and_(the('capra')).ask(x2)
    x4 = the('gatto').and_(the('capra')).and_(the('capra')).ask(x2)
    assert x3.head == e('gatto#1').and_('capra#1').e
    assert x4.head == e('gatto#1').and_('capra#1').and_('capra#1').e

# # TODO
# def test_c049():
#     x1 = the('capra').p.tell()
#     # problem: 'quiet' resolves to entity, it shouldn't 
#     x2 = the('capra').does('be')._('quiet').p.tell(x1)
#     # print(x2.wm)

# TODO: GAP substitution in which needs fixing
# # # TODO: to be fixed with isMatch()->map on define
# def test_c50():
#     x1 = the('capra').which(does('run')).tell()
#     x2 = the('capra').tell(x1)
#     x3 = the('capra').does('jump').when(the('capra').does('hop')).tell(x2)    
#     x4 = the('capra').which(does('run')).does('jump').tell(x3) # WRONG! should be capra#1

# # TODO: fix: capra#1 should still exist at the end, negation problem
# def test_51():
#     x1 = the('capra').tell()
#     x2 = the('capra').does('have')._(0).as_('experience').tell(x1)
#     x3 = it_is_false_that(the('capra').does('have')._(0).as_('experience')).tell(x2)
#     print(x3.wm) # WRONNNG!!!

# TODO: fix have-sentence specific negation problem!
# %% negation with tell tests
# def test_c016():
#     kb1 = new(the('cat')).does('have')._(new(the('mouse'))).as_('food').tell()
#     kb2 = it_is_false_that(the('cat').does('have')._(the('mouse')).as_('food')).tell(kb1)
#     assert ('cat#1', 'mouse#1', 'food') in kb1.wm
#     assert ('cat#1', 'mouse#1', 'food') not in kb2.wm
