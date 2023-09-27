from typing import Literal
from core.normalized import isNounPhrasish, isAst
from parser.parse import parse
from parser.metalang import L,V,D
from core.expbuilder import does, e
from core.language import BinExp

# TODO: implicit and idiomatic by default

ds = [
    D(['(', L('x', isAst), ')'], 'x'),
    D([L('l', isNounPhrasish), V('op', Literal['and', 'or']), L('r', isNounPhrasish)], BinExp('op', 'l', 'r')), # TODO: make also alternative derivation with both left and right NOT nounphrasish
    D([L('h', isNounPhrasish), 'which', L('w', isAst)],e('h').which('w').e),
    D([L('s', type=isNounPhrasish, default=''), 'does', V('v'), L('o', type=isNounPhrasish, default=False),], e('s').does('v')._('o').e),
    D([V('x')], 'x'),
]

# ------------------TESTS-------------------

def test_g1():
    x = parse(ds, [1, 'or', 2, 'and', 3])
    assert x == e(1).or_(e(2).and_(3)).e

def test_g2():
    x = parse(ds, ['cat', 'does', 'run'])
    assert x == e('cat').does('run').e

def test_g3():
    x = parse(ds, ['does', 'run'])
    assert x == does('run').e
    
def test_g4():
    x = parse(ds, ['cat', 'does', 'eat','mouse'])
    assert x == e('cat').does('eat')._('mouse').e

def test_g5():
    x = parse(ds, ['cat', 'which', 'does', 'run'])
    assert x == e('cat').which(does('run')).e

def test_g6():
    # x = parse(ds, ['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run' ])
    x = parse(ds, ['cat', 'which', 'does', 'exist',  'does', 'run' ])
    assert x == e('cat').which(does('exist')).does('run').e

def test_g7():
  x = parse(ds, ['cat', 'and', 'dog', 'does', 'run'])
  assert x == e('cat').and_('dog').does('run').e

def test_g8():
   x = parse(ds, ['(', 1, ')'])
   assert x == 1

def test_g9():
   x = parse(ds, ['(', 'cat', 'which', 'does', 'run', ')'])
   assert x == e('cat').which(does('run')).e

