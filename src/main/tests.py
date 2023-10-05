from typing import Literal as L
from core.removeImplicit import isNounPhrasish as isNp, isAst
from core.expbuilder import e, it_is_false_that, the
from parser.parse import parse
from parser.metalang import M,S,D

# TODO: implicit, idiomatic and domino by default
# TODO: add numerality
# TODO: complements
# TODO: dot and sentence separation
# negation
# derivation clauses: done
# questions vs statements: for now with ? vs !, default is question

# p[m|'l'/isNp, v|'op'/L['and','or'], m|'r'/isNp] >> e('l').binop('op', 'r').e
# p[m|'s'/isNp//'', 'does', s|'v', m|'o'/isNp//False] >> e('s').does('v')._('o').e
# p['(', m|'x'/isAst, ')'] >> 'x'

ds = [
D(['(', M('x', isAst), ')'], 'x'),
D([M('x', isAst), '!'], e('x').domino.new.e),
D([M('x', isAst), '?'], 'x'),

D([M('l', isNp), S('op', L['and', 'or']), M('r', isNp)], e('l').binop('op', 'r').e), # TODO: make also alternative derivation with both left and right NOT nounphrasish
D([M('h', isNp), 'which', M('w', isAst)], e('h').which('w').e),
D([M('s', isNp, ''), 'does', 'not', S('v'), M('o', isNp, False)], it_is_false_that(e('s').does('v')._('o')).e),
D([M('s', isNp, ''), 'does', S('v'), M('o', isNp, False)], e('s').does('v')._('o').e),
D([M('e', isAst), 'after', M('c', isAst)], e('e').after('c').e),
D([M('d1', isAst), 'when', M('d2', isAst)], e('d1').when('d2').e),
D([S('x', str)], the('x').e),
D([S('x')], 'x'),
]

# ------------------TESTS-------------------

def test_g1():
    x = parse(ds, [1, 'or', 2, 'and', 3])
    assert x == e(1).or_(e(2).and_(3)).e

def test_g2():
    x = parse(ds, ['cat', 'does', 'run'])
    assert x == the('cat').does('run').e

def test_g3():
    x = parse(ds, ['does', 'run'])
    assert x == the('').does('run').e # UGLY
    
def test_g4():
    x = parse(ds, ['cat', 'does', 'eat','mouse'])
    assert x == the('cat').does('eat')._(the('mouse')).e

def test_g5():
    x = parse(ds, ['cat', 'which', 'does', 'run'])
    assert x == the('cat').which(the('').does('run')).e # UGLY

def test_g6():
    x1 = parse(ds, ['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run' ])
    x2 = parse(ds, ['cat', 'which', 'does', 'exist',  'does', 'run' ])
    assert x1 == x2
    assert x1 == the('cat').which(the('').does('exist')).does('run').e # UGLY

def test_g7():
  x = parse(ds, ['cat', 'and', 'dog', 'does', 'run'])
  assert x == the('cat').and_(the('dog')).does('run').e

def test_g8():
   x = parse(ds, ['(', 1, ')'])
   assert x == 1

def test_g9():
   x = parse(ds, ['(', 'cat', 'which', 'does', 'run', ')'])
   assert x == the('cat').which(the('').does('run')).e  #UGLY

def test_g10():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '!'])
    assert x == the('cat').does('eat')._(the('mouse')).domino.new.e

def test_g11():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '?'])
    y = parse(ds, ['cat', 'does', 'eat', 'mouse'])
    assert x == y

def test_g12():
    x = parse(ds, ['button', 'does', 'be', 'red', 'after', 'button', 'does', 'be', 'down'])
    assert x == the('button').does('be')._(the('red')).after(the('button').does('be')._(the('down'))).e

def test_g13():
    x = parse(ds, ['it', 'when', 'thing'])
    assert x == the('it').when(the('thing')).e

def test_g14():
    x = parse(ds, ['capra', 'does', 'not', 'jump'])
    assert x == it_is_false_that(the('capra').does('jump')).e

