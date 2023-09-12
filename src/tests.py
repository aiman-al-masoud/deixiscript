from typing import cast
from expbuilder import does, e, every, it_is_false_that, the
from language import Implicit, KnowledgeBase, VerbSentence
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
    x = the('cat').does('jump')._and(the('dog').does('run')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (the('cat').e, the('dog').e)

def test8(): # sub-nounphrase problem: need to sort by specificity before using subst
    x = the('cat').which(does('jump')).does('lick')._(the('cat')).e
    assert findAsts(x, lambda x:isinstance(x, Implicit)) == (the('cat').which(does('jump')).e, the('cat').e)

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
    x = the('cat').tell()
    y = the('cat').tell(x.kb)
    z = the('cat').tell(y.kb)    
    assert set(cast(tuple, the('cat').get(z.kb))) == {'cat', 'cat#1', 'cat#2'}

def test13():
    x = the('cat').tell()
    y = the('cat').which(does('have')._('fish')._as('food')).tell(x.kb)
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

    # x = prepareAst(x, r2.kb)
    # # print(x.kb.dd)
    # print(linearize(x.head))

# negation ask tests 
def test15():
    q = e('capra').does('have')._(1)._as('age')
    qn = it_is_false_that(q)
    kb = q.tell().kb
    assert q.get(kb)
    assert not qn.get(kb)
    
