import os
from lark import Lark

from parse.transform import ToDict
# from parse.transform import toDict

grammar_path=os.path.join(os.path.split(__file__)[0], 'grammar2.lark')
grammar = open(grammar_path).read()
parser = Lark(grammar, start='ast', ambiguity='explicit')

# x =parser.parse('the cat does be bad')
# # print(x.pretty())
# print(x)

parser = Lark(grammar, start='ast')#, ambiguity='explicit')
x = parser.parse('1 cat does run on floor')
x = parser.parse('a cat')
x = parser.parse('a cat which does run')
x = parser.parse('cat and dog')
x = parser.parse('cat does sit on table')
x = parser.parse('cat which does sit on table')
x = parser.parse('the new cat does eat?')
x = parser.parse('a new cat')
x = parser.parse('a new cat which does eat')
x = parser.parse('it when thing')

y = ToDict().transform(x)
print(y)

# x = parser.parse('the 1 cat')
# x = parser.parse('the 1 cat does run')
# x = parser.parse('the cat')
# print(x)
# realtypes={'noun', 'relative', 'simple_sentence', 'compound_sentence'}
# print(toDict(x, realtypes))
# y = BurufTransformer().transform(x)
# print(y)
# y = transform(x)
# print(y)

