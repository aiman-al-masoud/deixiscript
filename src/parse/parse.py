import os
from lark import Lark
from parse.transform import BurufTransformer

grammar_path=os.path.join(os.path.split(__file__)[0], 'grammar2.lark')
grammar = open(grammar_path).read()
parser = Lark(grammar, start='ast', ambiguity='explicit')

# x =parser.parse('the cat does be bad')
# # print(x.pretty())
# print(x)

parser = Lark(grammar, start='ast', ambiguity='explicit')
x = parser.parse('the 1 cat')
y = BurufTransformer().transform(x)
print(y)
# y = transform(x)
# print(y)

