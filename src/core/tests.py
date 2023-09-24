from typing import cast
from expbuilder import does, e, every, it_is_false_that, new, the, _
from language import Implicit
from matchAst import matchAst, sortByGenerality
from normalized import decompressed
from subst import subst
from findAsts import findAsts
from KnowledgeBase import KnowledgeBase

# 
# clear; pytest-3 tests.py
# pytest-3 tests.py -k test12   # filter out a test
# pytest-3 tests.py -s   # show all print messages
# pytest-3 tests.py -v   # verbose test results
# 

# %% subst tests
def test1():
    x = subst('capra', 'cat', e('capra').does('eat').e)
    y = e('cat').does('eat').e
    assert x == y

def test2():
    x = subst('capra', 'cat', e('capra').and_('cavallo').and_('capra').e)
    y = e('cat').and_('cavallo').and_('cat').e
    assert x == y

def test3():
    x = subst('capra', 'cat', ('capra', 'capra'))
    y = ('cat','cat')
    assert x == y

# %% expand negation tests
# def test4():
#     x = expandNegations(e('buruf').does_not('have')._('food').e)
#     y = it_is_false_that(e('buruf').does('have')._('food').e).e
#     assert x == y

# circular import tests (eval <-> expbuilder) 
def test5():
    x = e(1).get(KnowledgeBase.empty)
    assert x == 1

# %% findAsts tests
def test6():
    x = e('capra').and_(3).and_(1).and_('gatto').e
    assert findAsts(x, lambda x:isinstance(x, int)) == (3, 1)

def test7():
    x = the('cat').does('jump').and_(the('dog').does('run')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (the('cat').e, the('dog').e)

def test8():
    x = the('cat').which(does('jump')).does('lick')._(the('cat')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (the('cat').which(does('jump')).e, the('cat').e)

# %% decompress tests
def test9():
    x = decompressed(e('capra').and_('cavallo').does('jump').e)
    y = e('capra').does('jump').and_(e('cavallo').does('jump')).e
    assert x==y

def test10():
    x = decompressed(e('capra').and_('cavallo').and_('gatto').does('jump').e)
    y = e('capra').does('jump').and_(e('cavallo').does('jump')).and_(e('gatto').does('jump')).e
    assert x == y

def test11(): #  with demorgan's rule I
    x = it_is_false_that(e(2).and_(3).equals(1)).e
    d = decompressed(x)
    y = it_is_false_that(e(2).equals(1)).or_(it_is_false_that(e(3).equals(1))).e
    assert d == y

# %% tell (create) new entities tests 
def test12():
    x = the('cat').tell()
    y = the('cat').tell(x.kb)
    z = the('cat').tell(y.kb)  
    assert set(cast(tuple, every('cat').get(z.kb))) == {'cat', 'cat#1', 'cat#2', 'cat#3'}

def test13(): # create from which (relative clause)
    kb1 = the('cat').which(does('have')._('fish').as_('food')).tellKb()
    assert ('cat#1', 'fish', 'food') in kb1.wm

def test21():
    kb = e(1).tellKb() # new constant
    assert (1, 'int', 'super') in kb.wm
    assert 1 in kb.dd

# %% negation ask tests 
def test15():
    q = e('capra#1').does('have')._(1).as_('age')
    qn = it_is_false_that(q)
    kb = q.tell().kb
    assert q.get(kb)
    assert not qn.get(kb)

# %% negation with tell tests
def test16():
    kb1 = new(the('cat')).does('have')._(new(the('mouse'))).as_('food').tellKb()

    #TODO: broken!
    kb2 = it_is_false_that(the('cat').does('have')._(the('mouse')).as_('food')).tellKb(kb1)

    # kb2 = the('cat').does_not('have')._(the('mouse')).as_('food').tellKb(kb1)
    assert ('cat#1', 'mouse#1', 'food') in kb1.wm
    assert ('cat#1', 'mouse#1', 'food') not in kb2.wm

# %% matchAst tests
def test17():
    genr = the('cat').e
    spec = the('cat').which(does('have')._('mouse#1').as_('prey')).e
    assert matchAst(genr, spec)
    assert not matchAst(spec, genr)

def test18():
    genr = e('cat#1').does('have')._('mouse#1').e
    spec = e('cat#1').does('have')._('mouse#1').and_(e('cat#1').does('have')._('mouse#2')).e
    assert matchAst(genr, spec)
    assert not matchAst(spec, genr)

def test19():
    assert matchAst('it', 'it')
    assert not matchAst('it', 'buruf')

# %% sort nounphrases by generality tests
def test22():
    correct = [  # ascending generality
        the('cat').which(does('be')._('red').and_(does('be')._('black'))).e,
        the('cat').which(does('be')._('red')).e,
        the('cat').e,
    ]
    wrong = [correct[2], correct[0], correct[1]]
    maybe = sortByGenerality(KnowledgeBase.empty, correct)
    assert correct != wrong
    assert maybe == correct

# %% simple-sentence understanding yes-no questions
def test23():
    kb = e('cat#1').does('run').to('fish#1').tellKb()

    assert e('cat#1').does('run').get(kb)
    assert e('cat#1').does('run').to('fish#1').get(kb)
    assert not e('cat#1').does('hide').get(kb)
    assert not e('cat#1').does('run').to('hill#1').get(kb)

# %% sort simple-sentences by generality tests
def test24():
    correct = [
        the('son').does('give')._(the('present')).to(the('mother')).on(the('birthday')).e,
        the('son').does('give')._(the('present')).to(the('mother')).e,
        the('son').does('give')._(the('present')).e,
        the('son').does('give').e,
    ]
    wrong = [correct[1], correct[3], correct[0], correct[2]]
    maybe = sortByGenerality(KnowledgeBase.empty, wrong)
    assert maybe == correct

# %% sort analytic derivation clauses by generality tests
def test25():
    correct = [
        the('capra').does('run').on(the('hill')).to(the('food')).when(2).e,
        the('capra').does('run').on(the('hill')).when(2).e,
        the('capra').does('run').when(1).e,
    ]
    wrong = [correct[2], correct[0], correct[1]]
    maybe = sortByGenerality(KnowledgeBase.empty, wrong)
    assert maybe == correct

# %% normalization tests
# def test20():
#     kb = the('cat').tellKb()
#     n = normalized(every('cat').does('jump').e, kb).head
#     # PROBLEM: cat concept also included in expansion!
#     assert isinstance(n, BinExp)
#     assert isinstance(n.left, SimpleSentence)
#     assert isinstance(n.right, SimpleSentence)
#     assert len(findAsts(n, lambda x: isinstance(x, str) and 'cat' in x)) == 2

# def test26(): # with analytic derivation clause
#     kb1 = the('man').does('ride').on(the('horse')).when(the('man').does('sit').on(the('horse')).and_(the('horse').does('move'))).tellKb()
#     x = normalized(new(new(the('man')).does('ride').on(new(the('horse')))).e, kb1).head
#     # TODO problem: how does derivation know that sentence was called with singular? Re-consider subst at every step?
#     assert findAsts(x, lambda x:x == e('man#1').does('sit').on('horse#1').e) # partial check

def test27(): # TODO: numerality for "it", and super,thing don't need to be DD-incremented
    kb1 = the('they').when(the('thing')).tellKb()
    kb2 = the('capra').tellKb(kb1)

    r = the('they').idiom.run(kb2)
    assert isinstance(r.head, tuple)
    assert 'capra#1' in set(r.head)

# %% numerality tests
def test28():
    kb1 = the('capra').tellKb()
    kb2 = the('capra').tellKb(kb1)
    kb3 = the('capra').tellKb(kb2)

    multiple = the('capra').get(kb3)
    single   = the(1)('capra').get(kb3)

    assert isinstance(multiple, tuple)
    assert isinstance(single, str)

# %% or-operator ask test
def test29():
    assert e(1).equals(2).or_(e(3).equals(3)).get()
    assert not e(1).equals(2).or_(e(3).equals(2)).get()

# matching a general implicit sentence to a specific explicit sentence
def test30():
   
    specific = e('man#1').does('ride').on('horse#1') # specific
    general = the('man').does('ride').on(the('horse')) # general

    kb1 = the('man').tellKb()
    kb2 = the('horse').tellKb(kb1)

    assert matchAst(general.e, specific.e, kb2)

# multiple additions with and  
def test31():
    
    r = e('cat#1').does('have')._('mouse#1').as_('food') \
    .and_(e('cat#2').does('have')._('mouse#2').as_('food')) \
    .and_(e('cat#3').does('have')._('mouse#3').as_('food')) \
    .tell()

    assert len(r.addition) == 3
    
# negate tell simple sentence
def test32():
    kb1 = the('man').tellKb()
    kb2 = the('horse').tellKb(kb1)
    s = e('man#1').does('ride').on('horse#1')
    kb3 = s.tellKb(kb2)
    kb4 = it_is_false_that(s).tellKb(kb3)

    assert s.get(kb3)
    assert not s.get(kb4)

# multiple executions of the same simple sentences are idempotent
def test33():
    r1 = e('man#1').does('ride').on('horse#1').tell()
    r2 = e('man#1').does('ride').on('horse#1').tell(r1.kb)
    assert r1.kb.wm == r2.kb.wm
    assert r1.addition == r2.addition

# matchAst with other similar "noise" specific sentences in KB
def test34():
    kb1 = new(the('cat')).does('eat')._(new(the('mouse'))).tellKb()
    kb2 = the('cat').tellKb(kb1)
    kb3 = the('mouse').tellKb(kb2)

    spec = e('cat#2').does('eat')._('mouse#2').e
    gen = the('cat').does('eat')._(the('mouse')).e

    assert matchAst(gen, spec, kb3)
    assert not matchAst(spec, gen, kb3)

def test35():

    kb1 = the('mouse').tellKb()
    kb2 = new(the('cat')).does('eat')._(new(the('mouse'))).tellKb(kb1)

    # print(kb2.wm)
    # assert ('mouse#2', 'mouse', 'super') in kb2.wm

    assert e('cat#1').does('eat')._('mouse#2').get(kb2)
    assert not e('cat#1').does('eat')._('mouse#1').get(kb2)
    assert the('mouse').which(e('cat#1').does('eat')._(_)).get(kb2) == 'mouse#2'


    # the(1)( the('mouse').which(e('cat#1').does('eat')._(_)) )