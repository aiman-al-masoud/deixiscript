from core.EB import does, e, every, the
from core.SimpleSentence import decompress
from core.Str import Str
from core.KB import sortByGenerality


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
    sup = the('cat').e
    sub = the('cat').which(does('have')._('mouse#1').as_('prey')).e
    assert sup.isMatch(sub)
    assert not sub.isMatch(sup)

def test_c019():
    sup = e('cat#1').does('have')._('mouse#1').e
    sub = e('cat#1').does('have')._('mouse#1').and_(e('cat#1').does('have')._('mouse#2')).e
    assert sup.isMatch(sub)
    assert not sub.isMatch(sup)

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

def test_c059(): # with negation
    assert not the('cat').e.isMatch(the('cat').not_.e)
    assert the('cat').not_.e.isMatch(the('cat').not_.e)
    assert not the('cat').does('run').e.isMatch(the('cat').does('run').not_.e)
    assert the('cat').does('run').e.isMatch(the('cat').does('run').e)

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
    kb1 = the('it').when(the(1, 'event').not_).tell()
    kb2 = the('capra').tell(kb1)
    kb3 = the('it').eval(kb2)
    assert 'capra#1' == kb3.it

def test_c027():
    kb1 = the('man').does('ride')._(the('horse')).when(the('man').does('sit').on(the('horse')).and_(the('horse').does('move'))).tell()
    kb2 = the('man').tell(kb1)
    kb3 = the('horse').tell(kb2)
    kb4 = the('man').does('ride')._(the('horse')).tell(kb3)
    assert e('man#1').does('sit').on('horse#1').and_(e('horse#1').does('move')).get(kb4)
    # print(kb4.dd)
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
    single   = the(1, 'capra').get(kb3)

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

    assert the(1,'cat').get(kb2) == 'cat#1'
    assert the(1,'mouse').get(kb2) == 'mouse#2'
    assert e('cat#1').does('eat')._('mouse#2').get(kb2)
    assert the('cat').does('eat')._(the('mouse')).get(kb2)
    assert not e('cat#1').does('eat')._('mouse#1').get(kb2)
    assert the('mouse').which(the('cat').does('eat')._(Str.GAP)).get(kb2) == 'mouse#2'

# %% cause and effect w/ synthetic derivation
def test_c038():
    kb0 = the('button').does('be')._('red').after(the('button').does('be')._('down')).tell()
    kb1 = the('button').tell(kb0)
    kb2 = the('button').tell(kb1)
    kb3 = the('button').does('be')._('down').tell(kb2)
    assert the('button').does('be')._('red').get(kb3)
    assert not e('button#1').does('be')._('red').get(kb3)

def test_c044(): # w/ domino effect
    kb1 = the('domino').does('fall').after(the('wind').does('blow')).tell()
    kb2 = the('domino').does('break').after(the('domino').does('fall')).tell(kb1)
    kb3 = the('domino').tell(kb2)
    kb4 = the('wind').tell(kb3)
    kb5 = the('wind').does('blow').tell(kb4)
    assert ('event#3','break','verb') in kb5.wm
    assert ('event#3','domino#1','subject') in kb5.wm

def test_c045(): # cause vanish => effect vanish
    kb1 = the('capra').does('sing').after(the('capra').does('eat')).tell()
    kb2 = the('capra').tell(kb1)
    kb3 = the('capra').does('eat').tell(kb2)    
    kb4 = the('capra').does('eat').not_.tell(kb3)

    assert the('capra').does('sing').get(kb3)
    assert not the('capra').does('sing').get(kb4)
    assert not the('capra').does('eat').get(kb4)
    # print(kb4.wm)

# %% ordinality (first/last) test
def test_c039():
    kb0 = the(1, 'cat').tell()
    kb1 = the(1, 'cat').tell(kb0)

    x1 = the(1, 'cat').get(kb1)
    x2 = the('first', 1, 'cat').get(kb1) # 1 first -> card should wrap around everything
    x3 = the('last', 1, 'cat').get(kb1)
    assert x1 == 'cat#2'
    assert x1 == x3
    assert x2 == 'cat#1'

# %% and-phrases
def test_c048():
    x1 = the('capra').tell()
    x2 = the('gatto').tell(x1)
    x3 = the('gatto').and_(the('capra')).eval(x2)
    x4 = the('gatto').and_(the('capra')).and_(the('capra')).eval(x2)
    assert x3.it == e('gatto#1').and_('capra#1').e
    assert x4.it == e('gatto#1').and_('capra#1').and_('capra#1').e

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
def test_c051():
    x1=the('cat').tell()
    x2=the('it').when(the('event').not_).tell(x1)
    x3=the('it').does('run').tell(x2)
    assert the('event').does('have')._('cat#1').as_('subject').get(x3)

# %% simple arithmetics with anaphors
def test_c055():
    x1 = e(1).binop('+', 1).eval()
    assert the('number').get(x1) == 2
    assert the('number').binop('+', 1).get(x1) == 3

# TODO: too big, split it up
# %% using definitions to do create /search for instances of specialized concepts
def test_c053():
    x1=the('stallion').when(the('horse').which(does('be')._('expensive'))).tell() 
    x2=the('horse').which(does('be')._('expensive')).tell(x1)
    x3=the('horse').tell(x2)
    assert the('stallion').get(x3)=='horse#1'
    x4=the('stallion').tell(x3)
    assert every('stallion').get(x4).unroll() == ['horse#3', 'horse#1']

    #  bottom up define:
    ast1=the('stallion').does('run').e.define(x1)
    ast2=the('horse').does('run').e.define(x1)
    assert ast2.isMatch(ast1)
    assert not ast1.isMatch(ast2)

# %% concepts vs attributes ("a cat REALLY is a cat" vs "a cat 'is' red")
def test_c054():
    x1=the('cat').which(does('be')._('red')).tell()
    assert the('cat').which(does('be')._('red')).get(x1) == 'cat#1'
    assert not the('red').which(does('be')._('cat')).get(x1)

def test_c056():
    kb1=the('cat').tell()
    kb2=the('red').tell(kb1)
    kb3=the('cat').does('be')._(the('red')).tell(kb2)
    assert ('cat#1', 'red#1', 'attribute') in kb3.wm
    # print(kb3.wm)
    # new cat which does run 
    # the cat does be quiet

# %% negation with tell
def test_c057():
    kb1=the('cat').new.does('run').tell()
    kb2=the('cat').does('run').not_.tell(kb1)
    assert the('cat').get(kb2)
    assert the('cat').does('run').not_.get(kb2)

def test_c058(): # special case: negating a has-sentence
    x1 = the('capra').tell()
    x2 = the('capra').does('have')._(2).as_('experience').tell(x1)
    x3 = the('capra').does('have')._(2).as_('experience').not_.tell(x2)
    assert the('capra').get(x3)
    assert the('capra').does('have')._(2).as_('experience').not_.get(x3)
    # print('res=', x3.wm)

def test_c060():
    x1 = the('cat').tell()
    x2 = the('cat').does('be')._('red').tell(x1)
    x3 = the('cat').does('be')._('red').not_.tell(x2)
    assert the('cat').does('be')._('red').get(x2)
    assert the('cat').does('be')._('red').not_.get(x3)

# which using gapped object, and negated head
def test_c061():
    x1 = the('out').new.does('be')._('ciao mondo').tell()
    x2 = the('nothing').not_.which(the('out').does('have')._(Str.GAP).as_('attribute')).get(x1)
    assert x2 == 'ciao mondo'

# negation types 
def test_c062():
    x1 = the('cat').tell()
    x2 = the('cat').tell(x1)
    assert not the('cat').not_.get(x2)
