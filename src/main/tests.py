from typing import Literal as L
from core.decompressed import isNounPhrasish as isNp, isAst, isSimpleSentenceish as isSm
from core.expbuilder import does, e, it_is_false_that
from parser.parse import parse
from parser.metalang import M,S,D

# TODO: implicit and idiomatic by default
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
D([M('x', isAst), '!'], e('x').new.e),
D([M('x', isAst), '?'], 'x'),
D([M('l', isSm), S('op', L['and', 'or']), M('r', isSm)], e('l').binop('op', 'r').e),
D([M('l', isNp), S('op', L['and', 'or']), M('r', isNp)], e('l').binop('op', 'r').e),
D([M('h', isNp), 'which', M('w', isAst)], e('h').which('w').e),
D([M('s', isNp, ''), 'does', 'not', S('v'), M('o', isNp, False)], it_is_false_that(e('s').does('v')._('o')).e),
D([M('s', isNp, ''), 'does', S('v'), M('o', isNp, False)], e('s').does('v')._('o').e),
D([M('e', isAst), 'after', M('c', isAst)], e('e').after('c').e),
D([M('d1', isAst), 'when', M('d2', isAst)], e('d1').when('d2').e),
D([S('x')], 'x'),
]

# ------------------TESTS-------------------

def test_g001():
    x = parse(ds, [1, 'or', 2, 'and', 3])
    assert x == e(1).or_(e(2).and_(3)).e

def test_g002():
    x = parse(ds, ['cat', 'does', 'run'])
    assert x == e('cat').does('run').e

def test_g003():
    x = parse(ds, ['does', 'run'])
    assert x == does('run').e
    
def test_g004():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse'])
    assert x == e('cat').does('eat')._('mouse').e

def test_g005():
    x = parse(ds, ['cat', 'which', 'does', 'run'])
    assert x == e('cat').which(does('run')).e

def test_g006():
    x1 = parse(ds, ['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run' ])
    x2 = parse(ds, ['cat', 'which', 'does', 'exist',  'does', 'run' ])
    assert x1 == x2
    assert x1 == e('cat').which(does('exist')).does('run').e

def test_g007():
  x = parse(ds, ['cat', 'and', 'dog', 'does', 'run'])
  assert x == e('cat').and_('dog').does('run').e

def test_g008():
   x = parse(ds, ['(', 1, ')'])
   assert x == 1

def test_g009():
   x = parse(ds, ['(', 'cat', 'which', 'does', 'run', ')'])
   assert x == e('cat').which(does('run')).e

def test_g010():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '!'])
    assert x == e('cat').does('eat')._('mouse').new.e

def test_g011():
    x = parse(ds, ['cat', 'does', 'eat', 'mouse', '?'])
    y = parse(ds, ['cat', 'does', 'eat', 'mouse'])
    assert x == y

def test_g012():
    x = parse(ds, ['button', 'does', 'be', 'red', 'after', 'button', 'does', 'be', 'down'])
    assert x == e('button').does('be')._('red').after(e('button').does('be')._('down')).e

def test_g013():
    x = parse(ds, ['it', 'when', 'thing'])
    assert x == e('it').when('thing').e

def test_g014():
    x = parse(ds, ['capra', 'does', 'not', 'jump'])
    assert x == it_is_false_that(e('capra').does('jump')).e

def test_g015():
    x = parse(ds, ['cat', 'does', 'eat', 'and', 'dog', 'does', 'drink'])
    assert x == e('cat').does('eat').and_(e('dog').does('drink')).e


# from parser.tokenize import tokenize
# while True:
#     x1 = input()
#     x2 = tokenize(x1)
#     x3 = parse(ds, x2)
#     assert isinstance(x3, Ast)
#     x4 = e(x3).p.e
#     print(x4)
#     # x4 = e(x3).p.e
#     # print(x4)