from functools import partial
from typing import Callable, List
from match import match
from metalang import L, V, D, MetaAst, Derivation
from parse import parse, subst

def test1():
    m1 = match([L('x'), 'capra'], ['1', '2', 'capra'])
    assert m1 and m1['x'] == ['1', '2']

def test2():
    m2 = match([L('x'), 'capra', L('y')], ['1', '2', 'capra', '4'])
    assert m2 and m2['x'] == ['1', '2'] and m2['y'] == ['4']

def test3():
    m1 = match([int, str], [1, 'ciao'])
    m2 = match([int, str], [1, 1])

    assert m1 is not None
    assert m2 is None

def test4():
    m1 = match([L('x'), V('y', int)], ['capra', 'ciao', 1])
    assert m1 and m1['x'] == ['capra', 'ciao'] and m1['y'] == 1

def test5():
    m1 = match([L('x'), V('y', int|float)], ['capra', 'ciao', 1.0])
    assert m1 
    assert m1['x'] == ['capra', 'ciao'] 
    assert m1['y'] == 1.0

def test6():
    assert subst({'x':{'y':'z'}}, {'z':1}) == {'x':{'y':1}}

def test7():
    ds = [
        D([L('x'), 'and', L('y')], {'op':'and', 'l':'x', 'r':'y'}),
        D([V('x')], 'x'),
    ]
    ast = parse(ds, [1, 'and', 2, 'and', 3])
    assert ast == {'op':'and', 'l':1, 'r':{'op':'and', 'l':2, 'r':3}}


def test8():
    m1 = match([L('x', int)], [1,2,3])
    m2 = match([L('x', str)], [1,2,3])
    assert m1 and m1['x'] == [1,2,3]
    assert not m2

def test9():
    m1 = match([V('x', lambda x: 'c' in str(x) )], ['ciao'])
    assert m1 and m1['x'] == 'ciao'

def test10():
    addsUpToSix = lambda x: sum(x) == 6
    m1 = match([L('x', addsUpToSix)], [1,2,3])
    assert m1 and m1['x'] == [1,2,3]
    m2 = match([L('x', addsUpToSix)], [1,2])
    assert not m2

def test11():
    ds = [
        D([L('x'), 'and', L('y')], {'op':'and', 'l':'x', 'r':'y'}),
        D([V('x')], 'x'),
    ]

    def parsesTo(ds:List[Derivation],f:Callable[[MetaAst], object], x:MetaAst):
        ast = parse(ds, x)
        return f(ast)

    binExp = partial(parsesTo, ds, lambda x:isinstance(x, dict) and 'op' in x)

    m1 = match([L('x'), 'and', L('y', binExp)], [1, 'and', 2, 'and', 3])
    assert m1

    m2 = match([L('x'), 'and', L('y', binExp)], [1, 'and', 2])
    assert not m2

def test12():
    m1 = match([L('x', int, 1)], ['ciao'])
    m2 = match([L('x', int, 1)], [999])
    m3 = match([L('x', int)], ['ciao'])
    
    assert m1 and m1['x'] == [1]
    assert m2 and m2['x'] == [999]
    assert not m3
