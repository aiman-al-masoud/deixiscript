from typing import Literal as L
from core.normalized import isNounPhrasish as isNp, isAst
from core.expbuilder import does, e
from parser.parse import parse
from parser.metalang import M,S,D

# TODO: implicit, idiomatic and domino by default
# TODO: add numerality
# TODO: derivation clauses
# TODO: questions vs statements: for now with ? vs !, default is question
# TODO: complements

# p[m|'l'/isNp, v|'op'/L['and','or'], m|'r'/isNp] >> e('l').binop('op', 'r').e
# p[m|'s'/isNp//'', 'does', s|'v', m|'o'/isNp//False] >> e('s').does('v')._('o').e
# p['(', m|'x'/isAst, ')'] >> 'x'

ds = [
D(['(', M('x', isAst), ')'], 'x'),
D([M('x', isAst), '!'], e('x').new.e),
D([M('x', isAst), '?'], 'x'),
D([M('l', isNp), S('op', L['and', 'or']), M('r', isNp)], e('l').binop('op', 'r').e), # TODO: make also alternative derivation with both left and right NOT nounphrasish
D([M('h', isNp), 'which', M('w', isAst)], e('h').which('w').e),
D([M('s', isNp, ''), 'does', S('v'), M('o', isNp, False),], e('s').does('v')._('o').e),



D([S('x')], 'x'),
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
    x1 = parse(ds, ['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run' ])
    x2 = parse(ds, ['cat', 'which', 'does', 'exist',  'does', 'run' ])
    assert x1 == x2
    assert x1 == e('cat').which(does('exist')).does('run').e

def test_g7():
  x = parse(ds, ['cat', 'and', 'dog', 'does', 'run'])
  assert x == e('cat').and_('dog').does('run').e

def test_g8():
   x = parse(ds, ['(', 1, ')'])
   assert x == 1

def test_g9():
   x = parse(ds, ['(', 'cat', 'which', 'does', 'run', ')'])
   assert x == e('cat').which(does('run')).e

def test_g10():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '!'])
    assert x == e('cat').does('eat')._('mouse').new.e

def test_g11():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '?'])
    y = parse(ds, ['cat', 'does', 'eat', 'mouse'])
    assert x == y