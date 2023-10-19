# from core.expbuilder import e, does, it_is_false_that
# from parser.parse import parse
# from parser.tokenize import tokenize

# def test_g001():
#     x = parse([1, 'or', 2, 'and', 3])
#     assert x == e(1).or_(e(2).and_(3)).e

# def test_g002():
#     x = parse(['cat', 'does', 'run'])
#     assert x == e('cat').does('run').e

# def test_g003():
#     x = parse(['does', 'run'])
#     assert x == does('run').e
    
# def test_g004():
#     x = parse(['cat', 'does', 'eat', 'mouse'])
#     assert x == e('cat').does('eat')._('mouse').e

# def test_g005():
#     x = parse(['cat', 'which', 'does', 'run'])
#     assert x == e('cat').which(does('run')).e

# # TODO
# # def test_g006():
# #     # x1 = par(['(', 'cat', 'which', 'does', 'exist', ')', 'does', 'run' ])
# #     x2 = par(['cat', 'which', 'does', 'exist',  'does', 'run' ])
# #     print(x2)
# #     # assert x1 == x2
# #     # assert x1 == e('cat').which(does('exist')).does('run').e

# def test_g007():
#   x = parse(['cat', 'and', 'dog', 'does', 'run'])
#   assert x == e('cat').and_('dog').does('run').e

# def test_g008():
#    x = parse(['(', 1, ')'])
#    assert x == 1

# def test_g009():
#    x = parse(['(', 'cat', 'which', 'does', 'run', ')'])
#    assert x == e('cat').which(does('run')).e

# def test_g010():
#     x = parse(['cat', 'does', 'eat', 'mouse', '!'])
#     assert x == e('cat').does('eat')._('mouse').new.e

# def test_g011():
#     x = parse(['cat', 'does', 'eat', 'mouse', '?'])
#     y = parse(['cat', 'does', 'eat', 'mouse'])
#     assert x == y

# def test_g012():
#     x = parse(['button', 'does', 'be', 'red', 'after', 'button', 'does', 'be', 'down'])
#     assert x == e('button').does('be')._('red').after(e('button').does('be')._('down')).e

# def test_g013():
#     x = parse(['it', 'when', 'thing', '!'])
#     assert x == e('it').when('thing').new.e

# def test_g014():
#     x = parse( ['capra', 'does', 'not', 'jump'])
#     assert x == it_is_false_that(e('capra').does('jump')).e

# # TODO
# # def test_g015():
# #     x = par(['cat', 'does', 'eat', 'and', 'dog', 'does', 'drink'])
# #     assert x == e('cat').does('eat').and_(e('dog').does('drink')).e

# #TODO
# # def test_g016():
# #     from core.expbuilder import _
# #     x = par(['cat', 'does'])
# #     assert x == e('cat').does(_).e

# def test_g017():
#     x = parse(['cat', 'does', 'run', 'to', 'food'])
#     assert x == e('cat').does('run').to('food').e

# # tokenize
# def test_g018():
#     source = '"hello world" is a (string) and also " hello Buruf " 1 2 false true 300 1=1 ciao?'
#     ok = ['hello world', 'is', 'a', '(', 'string', ')', 'and', 'also', ' hello Buruf ', 1.0, 2.0, 'false', 'true', 300.0, 1.0, '=', 1.0, 'ciao', '?']
#     maybe = tokenize(source)
#     assert ok == maybe

# def test_g019():
#     x = parse(['cat', 'does', 'eat', '(', 'mouse', 'which','does', 'run', ')'])
#     assert x == e('cat').does('eat')._(e('mouse').which(does('run'))).e
