from typing import cast
from evaluate import evaluate
from expbuilder import does, e, every, i, it_is_false_that, new
from language import  BinExp, Implicit
from matchAst import matchAst, sortByGenerality
from normalized import decompress, expandNegations, normalized
from subst import subst
from findAsts import findAsts
from KnowledgeBase import KnowledgeBase
from linearize import linearize

# 
# clear; pytest tests.py
# pytest tests.py -k test12   # filter out a test
# pytest tests.py -s   # show all print messages
# pytest tests.py -v   # verbose test results
# 

# subst tests
def test1():
    x = subst('capra', 'cat', e('capra').does('eat').e)
    y = e('cat').does('eat').e
    assert x == y

def test2():
    x =subst('capra', 'cat', e('capra')._and('cavallo')._and('capra').e)
    y  =e('cat')._and('cavallo')._and('cat').e
    assert x == y

def test3():
    x = subst('capra', 'cat', ('capra', 'capra'))
    y = ('cat','cat')
    assert x == y

# expand negation tests
def test4():
    x = expandNegations(e('buruf').does_not('have')._('food').e)
    y = it_is_false_that(e('buruf').does('have')._('food').e).e
    assert x == y

# circular import tests (eval <-> expbuilder) 
def test5():
    x = e(1).get(KnowledgeBase.empty)
    assert x == 1

# findAsts tests
def test6():
    x = e('capra')._and(3)._and(1)._and('gatto').e
    assert findAsts(x, lambda x:isinstance(x, int)) == (3, 1)

def test7():
    x = i('cat').does('jump')._and(i('dog').does('run')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (i('cat').e, i('dog').e)

def test8():
    x = i('cat').which(does('jump')).does('lick')._(i('cat')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (i('cat').which(does('jump')).e, i('cat').e)

# decompress tests
def test9():
    x = decompress(e('capra')._and('cavallo').does('jump').e)
    y = e('capra').does('jump')._and(e('cavallo').does('jump')).e
    assert x==y

def test10():
    x = decompress(e(('capra', 'cavallo', 'gatto')).does('jump').e)
    y = e('capra').does('jump')._and(e('cavallo').does('jump'))._and(e('gatto').does('jump')).e
    assert x == y

def test11():
    pass  # TODO: with demorgan

# tell (create) new entities tests 
def test12():
    x = i('cat').tell()
    y = i('cat').tell(x.kb)
    z = i('cat').tell(y.kb)    
    assert set(cast(tuple, every('cat').get(z.kb))) == {'cat', 'cat#1', 'cat#2'}

def test13():
    x = i('cat').tell()
    y = i('cat').which(does('have')._('fish').as_('food')).tell(x.kb)
    assert ('cat#1', 'fish', 'food') in y.kb.wm

def test21():
    kb = e(1).tellKb() # new constant
    assert (1, 'int', 'super') in kb.wm
    assert 1 in kb.dd

# negation ask tests 
def test15():
    q = e('capra#1').does('have')._(1).as_('age')
    qn = it_is_false_that(q)
    kb = q.tell().kb
    assert q.get(kb)
    assert not qn.get(kb)

# negation with tell tests
def test16():
    kb = new(i('cat')).does('have')._(new(i('mouse'))).as_('food').tellKb()
    q2 = new(i('cat').does_not('have')._(i('mouse')).as_('food')).e
    kb2 = evaluate(q2, kb).kb
    assert ('cat', 'mouse', 'food') not in kb2.wm

# matchAst tests
def test17():
    genr = i('cat').e
    spec = i('cat').which(does('have')._('mouse#1')).e
    assert matchAst(genr, spec, KnowledgeBase.empty)
    assert not matchAst(spec, genr, KnowledgeBase.empty)

def test18():
    genr = e('cat#1').does('have')._('mouse#1').e
    spec = e('cat#1').does('have')._('mouse#1')._and(e('cat#1').does('have')._('mouse#2')).e
    assert matchAst(genr, spec)
    assert not matchAst(spec, genr)

def test19():
    assert matchAst('it', 'it')
    assert not matchAst('it', 'buruf')

# normalized tests
def test20():
    kb = i('cat').tell().kb
    kb1 = i('cat').tell(kb).kb

    x = every('cat').does('jump').e
    y = normalized(x, kb1).head

    assert isinstance(y, BinExp)
    assert e('cat#1').does('jump').e == y.left or e('cat').does('jump').e == y.left
    assert e('cat#1').does('jump').e == y.right or e('cat').does('jump').e == y.right

# sort nounphrases by generality tests
def test22():

    nps = [
        i('cat').which(does('be')._('red')).e,
        i('cat').e,
        i('cat').which(does('be')._('red')._and(does('be')._('black'))).e,
    ]

    npsOracle = [nps[2], nps[0], nps[1]] # ascending generality
    nps2 = sortByGenerality(KnowledgeBase.empty, nps)
    assert nps2 == npsOracle 
    assert nps != npsOracle

# default (w/o analytic clauses) simple-sentence "understanding" tests
def test23():
    kb = i('capra').does('run').to(i('cibo')).tellKb()
    assert i('capra').does('run').get(kb)
    assert i('capra').does('run').to(i('cibo')).get(kb)
    assert not i('capra').does('hide').get(kb)
    assert not i('capra').does('run').to(i('hill')).get(kb)

# sort simple-sentences by generality tests
def test24():
    s1 = i('capra').does('give')._(i('present')).to(i('pecora')).on(i('collina')).e
    s2 = i('capra').does('give')._(i('present')).to(i('pecora')).e
    s3 = i('capra').does('give')._(i('present')).e
    s4 = i('capra').does('give').e
    correct = [s1,s2,s3,s4]
    shuffled = [s4,s2,s3,s1]
    maybeSorted = sortByGenerality(KnowledgeBase.empty, shuffled)
    assert correct == maybeSorted

# sort analytic derivation clauses by generality tests
def test25():
    s1 = i('capra').does('run').on(i('hill')).to(i('food')).when(2).e
    s2 = i('capra').does('run').on(i('hill')).when(2).e
    s3 = i('capra').does('run').when(1).e
    correct = [s1,s2,s3]
    shuffled = [s2,s1,s3]
    maybeSorted = sortByGenerality(KnowledgeBase.empty, shuffled)
    assert correct == maybeSorted 

def test26():
    kb1 = i('man').does('ride').on(i('horse')).when(i('man').does('sit').on(i('horse'))._and(i('horse').does('move'))).tellKb()
    x = normalized(new(new(i('man')).does('ride').on(new(i('horse')))).e, kb1)
    assert x.head == e('man').does('sit').on('horse')._and(e('horse').does('move')).e
    # print(x.head)
    # print(x.kb.wm)
    # print(linearize(x.head))
    # assert x.head == e('man').does('sit').on('horse')._and(e('horse').does('move'))

