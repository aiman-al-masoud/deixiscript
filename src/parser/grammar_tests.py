from typing import Literal
from parse import parse
from metalang import L,V,D


ds = [
    D([V('x')], 'x'),
    D([L('h'), 'which', L('w')],{'head':'h', 'which':'w'}),
    D([L('l'), V('o', Literal['and', 'or']), L('r')],{'op':'o', 'left':'l', 'right':'r'}),
    D([L('s', default=''), 'does', V('v'), L('o', default=''),],{'subject':'s', 'verb':'v', 'object':'o' }),
    D(['(', L('x'), ')'], 'x')
]

# ------------------TESTS-------------------

def test_g1():
    x = parse(ds, [1, 'or', 2, 'and', 3])
    assert x == {'op' : 'or', 'left':1, 'right': {'op':'and', 'left':2, 'right':3} }

def test_g2():
    x = parse(ds, ['cat', 'does', 'run'])
    assert x == {'subject':'cat', 'verb':'run', 'object':''}

def test_g3():
    x = parse(ds, ['does', 'run'])
    assert x == {'subject':'', 'verb':'run', 'object':''}
    
def test_g4():
    x = parse(ds, ['cat', 'which', 'does', 'run'])
    assert x == {'head':'cat', 'which':{'subject':'', 'verb':'run', 'object':''}}

def test_g5():
    x = parse(ds, ['cat', 'does', 'eat','mouse'])
    assert x == {'subject':'cat', 'verb':'eat', 'object':'mouse'}

# def test_g6():
#     x = parse(ds, ['cat', 'which', 'does', 'be', 'red', 'does', 'eat','mouse'])
#     # WRONG!

# def test_g7():
#   x = parse(ds, ['cat', 'and', 'dog', 'does', 'run'])
#   #WRONG!

def test_g8():
   x = parse(ds, ['(', 1, ')'])
   assert x == 1

# def test_g9():
#    x = parse(ds, ['(', 'cat', 'which', 'does', 'run', ')'])
#    # WRONG!
