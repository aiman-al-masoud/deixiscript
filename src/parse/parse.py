from lark import Lark

grammar = open('grammar.lark').read()
parser = Lark(grammar, start='ast', ambiguity='explicit')

# transform...