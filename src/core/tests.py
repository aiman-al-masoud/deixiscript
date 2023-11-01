from core.expbuilder import does, e, every, the
from core.sortByGenerality import sortByGenerality
from core.decompress import decompress
from core.Str import Str


# %% subst tests
def test_c001():
    x = e('capra').does('jump').e.subst({Str('capra'):Str('cat')})
    assert x == e('cat').does('jump').e

def test_c002():
    x = e('capra').and_('cavallo').and_('capra').e.subst({Str('capra'):Str('cat')})
    assert x == e('cat').and_('cavallo').and_('cat').e

def test_49(): # nested-which GAP substitution
    x  = the('event').which(does('have')._(the('capra').which(does('be')._('red')))).e
    y  = x.which.subst({Str.GAP: Str('EVENT#1')})
    ok = e('EVENT#1').does('have')._(the('capra').which(does('be')._('red'))).e
    assert y == ok

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
    x = e(2).and_(3).does('be')._(1).not_.e
    d = decompress(x)
    y = e(2).does('be')._(1).not_.or_(e(3).does('be')._(1).not_).e
    assert d == y

# %% nounphrases expressions as constructors with tell()
def test_c012():
    x1 = the('cat').tell()
    x2 = the('cat').tell(x1)
    x3 = the('cat').tell(x2)
    allCats = every('cat').get(x3)

    assert allCats.unroll() == ['cat#3', 'cat#2', 'cat#1']

def test_c013(): # which (relative clause)
    kb1 = the('cat').which(does('have')._('fish').as_('food')).tell()
    assert ('cat#1', 'fish', 'food') in kb1.wm

# %% negation with ask tests 
def test_c015():
    q = e('capra#1').does('have')._(1).as_('age')
    notQ = q.not_
    kb1 = q.tell()
    assert q.get(kb1)
    assert not notQ.get(kb1)

def test_c032(): # simple sentence
    q = e('man#1').does('ride').on('horse#1')
    kb1 = the('man').tell()
    kb2 = the('horse').tell(kb1)
    kb3 = q.tell(kb2)
    kb4 = q.not_.tell(kb3)

    assert q.get(kb3)
    assert not q.get(kb4)

# %% matchAst tests
def test_c017():
    assert Str('it').isMatch(Str('it'))
    assert not Str('it').isMatch(Str('buruf'))

def test_c018():
    gen  = the('cat').e
    spec = the('cat').which(does('have')._('mouse#1').as_('prey')).e
    assert gen.isMatch(spec)
    assert not spec.isMatch(gen)

def test_c019():
    gen  = e('cat#1').does('have')._('mouse#1').e
    spec = e('cat#1').does('have')._('mouse#1').and_(e('cat#1').does('have')._('mouse#2')).e
    assert gen.isMatch(spec)
    assert not spec.isMatch(gen)

def test_c020():
    gen   = the('man').does('ride').on(the('horse')).e
    spec1 = the('man').does('ride').on(every('horse')).e
    spec2 = every('man').does('ride').on(the('horse')).e
    spec3 = every('man').does('ride').on(every('horse')).e

    # TODO: maybe a little wrong?
    assert gen.isMatch(spec1)
    assert gen.isMatch(spec2)
    assert gen.isMatch(spec3)

def test_c040():
    gen = the('son').does('give')._(the('present')).to(the('mother')).e
    spec =the('son').does('give')._(the('present')).to(the('mother')).on(the('birthday')).e
    assert gen.isMatch(spec)
    assert not spec.isMatch(gen)

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

# %% def (analytic derivation) tests
def test_c026():
    kb1 = the('it').when(the(1)('thing')).tell()
    kb2 = the('capra').tell(kb1)
    kb3 = the('it').eval(kb2)
    assert 'capra#1' == kb3.head

def test_c027():
    kb1 = the('man').does('ride')._(the('horse')).when(the('man').does('sit').on(the('horse')).and_(the('horse').does('move'))).tell()
    kb2 = the('man').tell(kb1)
    kb3 = the('horse').tell(kb2)
    kb4 = the('man').does('ride')._(the('horse')).tell(kb3)
    assert e('man#1').does('sit').on('horse#1').and_(e('horse#1').does('move')).get(kb4)
    assert not e('man#1').does('sit').on('horse').get(kb4) # TODO: test every('horse')

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

    assert multiple.unroll() == ['capra#3', 'capra#2', 'capra#1']
    assert single == 'capra#3'

# %% multiple executions of the same simple sentence are idempotent
def test_c033():
    x1 = e('man#1').does('ride').on('horse#1').tell()
    x2 = e('man#1').does('ride').on('horse#1').tell(x1)
    assert x1.wm == x2.wm

# %% logic and deictic dict test
def test_c035():

    kb1 = the('mouse').tell()
    kb2 = the('cat').new.does('eat')._(the('mouse').new).tell(kb1) # also works with verb wrapped in implicit

    assert the(1)('cat').get(kb2) == 'cat#1'
    assert the(1)('mouse').get(kb2) == 'mouse#2'
    assert e('cat#1').does('eat')._('mouse#2').get(kb2)
    assert the('cat').does('eat')._(the('mouse')).get(kb2)
    assert not e('cat#1').does('eat')._('mouse#1').get(kb2)
    assert the('mouse').which(the('cat').does('eat')._(Str.GAP)).get(kb2) == 'mouse#2'
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

# %% and-phrases
def test_c048():
    x1 = the('capra').tell()
    x2 = the('gatto').tell(x1)
    x3 = the('gatto').and_(the('capra')).eval(x2)
    x4 = the('gatto').and_(the('capra')).and_(the('capra')).eval(x2)
    assert x3.head == e('gatto#1').and_('capra#1').e
    assert x4.head == e('gatto#1').and_('capra#1').and_('capra#1').e

# %% substitution of nounphrases into derivation
def test_c050():
    x1 = the('capra').which(does('run')).tell()
    x2 = the('capra').tell(x1)
    x3 = the('capra').does('jump').when(the('capra').does('hop')).tell(x2)    
    x4 = the('capra').which(does('run')).does('jump').tell(x3)
    assert e('capra#1').does('hop').get(x4)

# similar problem: new cat which does run
# %% events get in the way. you can fix it with "not event" negation type.
# or maybe "an event isn't a thing", or maybe different name or yadda yadda...
def test_c51():
    x1=the('cat').tell()
    x2=the('it').when(the('event').not_).tell(x1)
    x3=the('it').does('run').tell(x2)
    assert the('event').does('have')._('cat#1').as_('subject').get(x3)

# TODO
# %% using definitions to do create /search for instances of specialized concepts
def test_c53():
    x1=the('stallion').when(the('horse').which(does('be')._('expensive'))).tell() 
    x2=the('horse').which(does('be')._('expensive')).tell(x1)
    x3=the('horse').tell(x2)
    assert the('stallion').get(x3)=='horse#1'
    x4=the('stallion').tell(x3)
    # TODO: every required in when for every here  BAD! Specialized Implicit
    # define overload to deal with cadinality/ordinality
    # print(every('stallion').get(x4)) 

    # TODO recusive define? bottom up define?
    # print('-------------------------')
    # x1=the('stallion').does('run').e.define(x3)
    # x2=the('horse').does('run').e.define(x5)
    # print(x1)
    # print(x2)

# TODO: wrong, "red which is cat" should be wrong,
# # foundamentally different relationship
# def test_c54():
#     x1=the('cat').which(does('be')._('red')).tell()
#     y1=the('cat').which(does('be')._('red')).get(x1)
#     y2=the('red').which(does('be')._('cat')).get(x1)
#     # print(y1, y2)
#     # print(x1.wm)

# TODO: cause vanish, effect vanish
# def test_c045():
#     kb1 = the(1)('capra').does('sing').after(the(1)('capra').does('eat')).tell()
#     kb2 = the('capra').tell(kb1)
#     kb3 = the('capra').does('eat').idiom.tell(kb2)    
#     kb4 = it_is_false_that(the('capra').does('eat')).idiom.tell(kb3)

#     assert the('capra').does('sing').get(kb3)
#     assert not the('capra').does('sing').get(kb4)

# TODO
# # new cat which does run ---> doesn't work in repl!!!
# def test_c52():
#     x1=the('cat').which(does('run')).tell()
#     assert ('event#1', 'cat#1', 'subject') in x1.wm
#     print(x1.wm)

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

# # TODO
# def test_c049():
#     x1 = the('capra').p.tell()
#     # problem: 'quiet' resolves to entity, it shouldn't 
#     x2 = the('capra').does('be')._('quiet').p.tell(x1)
#     # print(x2.wm)

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