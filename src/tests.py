from typing import cast
from evaluate import evaluate
from expbuilder import does, e, every, i, it_is_false_that, new
from language import  BinExp, Implicit
from matchAst import matchAst, sortByGenerality#, compareGenerality
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
    # print(expandNegations(e('buruf').does_not('have')._('food')._and('capra').e))

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

def test8(): # sub-nounphrase problem: need to sort by specificity before using subst
    x = i('cat').which(does('jump')).does('lick')._(i('cat')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (i('cat').which(does('jump')).e, i('cat').e)

# decompress tests
def test9():
    pass

    x = decompress(e('capra')._and('cavallo').does('jump').e)
    y = e('capra').does('jump')._and(e('cavallo').does('jump')).e
    assert x==y

def test10():
    x = decompress(e(('capra', 'cavallo', 'gatto')).does('jump').e)
    y = e('capra').does('jump')._and(e('cavallo').does('jump'))._and(e('gatto').does('jump')).e
    assert x == y

def test11():
    pass
    # x = it_is_false_that(e('cat')._and('dog').does('jump').e).e
    # y = decompress(x)
    # print(linearize(x))
    # print(linearize(y))
    # pass

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

# negation ask tests 
def test15():
    q = e('capra#1').does('have')._(1).as_('age')
    qn = it_is_false_that(q)
    kb = q.tell().kb
    assert q.get(kb)
    assert not qn.get(kb)

# negation with tell tests
def test16():

    q = new(new(i('cat')).does('have')._(new(i('mouse'))).as_('food')).e
    kb = evaluate(q).kb
    q2 = new(i('cat').does_not('have')._(i('mouse')).as_('food')).e
    kb2 = evaluate(q2, kb).kb

    assert ('cat', 'mouse', 'food') not in kb2.wm

# matchAst and match tests
def test17():
    genr = i('cat').e
    spec = i('cat').which(does('have')._('mouse#1')).e
    m1 = matchAst(genr, spec, KnowledgeBase.empty)
    m2 = matchAst(spec, genr, KnowledgeBase.empty)
    assert m1
    assert not m2

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

# tell insert new constant into WM tests
def test21():
    kb = e(1).tellKb()
    assert (1, 'int', 'super') in kb.wm
    assert 1 in kb.dd

# sort nounphrases by generality tests
# LATER!!sort analytic derivation clauses by generality tests, maybe need to introduce default "action" for even un-defined verbs
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

    # print([linearize(x) for x in nps])
    # print([linearize(x) for x in nps2])


