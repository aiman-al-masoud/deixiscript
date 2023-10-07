from parser.match import match
from parser.metalang import M, S, D
from parser.parse import parse, subst
from parser.tokenize import tokenize

def test1():
    m1 = match([M('x'), 'capra'], ['1', '2', 'capra'])
    assert m1 and m1['x'] == ['1', '2']

def test2():
    m2 = match([M('x'), 'capra', M('y')], ['1', '2', 'capra', '4'])
    assert m2 and m2['x'] == ['1', '2'] and m2['y'] == ['4']

def test3():
    m1 = match([int, str], [1, 'ciao'])
    m2 = match([int, str], [1, 1])

    assert m1 is not None
    assert m2 is None

def test4():
    m1 = match([M('x'), S('y', int)], ['capra', 'ciao', 1])
    assert m1 and m1['x'] == ['capra', 'ciao'] and m1['y'] == 1

def test5():
    m1 = match([M('x'), S('y', int|float)], ['capra', 'ciao', 1.0])
    assert m1 
    assert m1['x'] == ['capra', 'ciao'] 
    assert m1['y'] == 1.0

def test6():
    assert subst({'x':{'y':'z'}}, {'z':1}) == {'x':{'y':1}}

def test7():
    ds = [
        D([M('x'), 'and', M('y')], {'op':'and', 'l':'x', 'r':'y'}),
        D([S('x')], 'x'),
    ]
    ast = parse(ds, [1, 'and', 2, 'and', 3])
    assert ast == {'op':'and', 'l':1, 'r':{'op':'and', 'l':2, 'r':3}}


def test8():
    m1 = match([M('x', int)], [1,2,3])
    m2 = match([M('x', str)], [1,2,3])
    assert m1 and m1['x'] == [1,2,3]
    assert not m2

def test9():
    m1 = match([S('x', lambda x: 'c' in str(x) )], ['ciao'])
    assert m1 and m1['x'] == 'ciao'

# default values
def test_p11():
    m1 = match([M('x', int, 1)], ['ciao'])
    m2 = match([M('x', int, 1)], [999])
    m3 = match([M('x', int)], ['ciao'])
    m4 = match([M('x', int, 1)], [])
    
    assert not m1
    assert m2 and m2['x'] == [999]
    assert not m3
    assert m4 and m4['x'] == [1]

def test13():

    isThe = lambda x: isinstance(x, dict) and 'the' in x
    isWhich = lambda x: isinstance(x, dict) and 'which' in x

    ds = [
        D([M('h', isThe), 'which', M('w')], {'head':'h', 'which':'w'}),
        D(['the', M('h')], {'head':'h', 'the':True}),
        D([S('x')], 'x'),
    ]
    
    res = parse(ds, ['the', 'cat', 'which', 'eat'])
    assert isWhich(res)

    res = parse(ds, ['cat', 'which', 'eat'])
    assert not isWhich(res)

# tokenize
def test_p14():
    source = '"hello world" is a (string) and also " hello Buruf " 1 2 false true 300 1=1'
    ok = ['hello world', 'is', 'a', '(', 'string', ')', 'and', 'also', ' hello Buruf ', 1.0, 2.0, 'false', 'true', 300.0, 1.0, '=', 1.0]
    maybe = tokenize(source)
    assert ok == maybe

# TODO: tests
# D([M('l', isX)], 'l'),
# D([M('l')], 'l'),