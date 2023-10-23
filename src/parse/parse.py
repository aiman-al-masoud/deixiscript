import os
from lark import Lark
from parse.transform import transform

grammar_path=os.path.join(os.path.split(__file__)[0], 'grammar2.lark')
grammar = open(grammar_path).read()
parser = Lark(grammar, start='ast', ambiguity='explicit')

# x =parser.parse('the cat does be bad')
# print(x.pretty())

parser = Lark(grammar, start='ast', ambiguity='explicit')
x = parser.parse('the cat which does run to x as y')
# print(x.pretty())
y = transform(x)
print(y)
