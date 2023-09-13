from typing import cast
from evaluate import evaluate
from expbuilder import does, e, every, i, it_is_false_that, new
from language import Implicit, KnowledgeBase, VerbSentence
from matchAst import matchAst
from prepareAst import decompress, expandNegations, removeImplicit
from subst import subst
from findAsts import findAsts

# 
# clear; pytest tests.py
# pytest tests.py -k test12   # filter out a test
# pytest tests.py -s   # show all print messages
# pytest tests.py -v   # verbose test results
# 

# subst tests
def test1():
    x = subst('capra')('cat')(e('capra').does('eat').e)
    y = e('cat').does('eat').e
    assert x == y

def test2():
    x =subst('capra')('cat')(e('capra')._and('cavallo')._and('capra').e)
    y  =e('cat')._and('cavallo')._and('cat').e
    assert x == y

def test3():
    x = subst('capra')('cat')(('capra', 'capra'))
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

# removeImplicit tests
def test14():
    r1 = e('cat#1').does('be')._('cat').tell()
    r2 = e('cat#2').does('be')._('cat').tell(r1.kb)
    x = every('cat').does('eat')._('mouse#1').e
    y = removeImplicit(x, r2.kb).head
    assert isinstance(y, VerbSentence)
    assert isinstance(y.subject, tuple)
    assert set(y.subject) == {'cat', 'cat#1', 'cat#2'}

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


def test17():
    temp = i('cat').e
    form = i('cat').which(does('have')._('mouse#1')).e
    m1 = matchAst(temp, form, KnowledgeBase.empty)
    m2 = matchAst(form, temp, KnowledgeBase.empty)
    assert m1
    assert not m2

def test18():
    temp = e('cat#1').does('have')._('mouse#1').e
    form = e('cat#1').does('have')._('mouse#1')._and(e('cat#1').does('have')._('mouse#2')).e
    m1 = matchAst(temp, form, KnowledgeBase.empty)
    m2 = matchAst(form, temp, KnowledgeBase.empty)
    assert m1
    assert not m2



# print(a(i('cat').which(does('have')._(a(i('tail'))))).e)

