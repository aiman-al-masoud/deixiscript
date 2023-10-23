from lark import Lark

# grammar = open('./grammar.lark').read()
# parser = Lark(grammar, start='ast') #  ambiguity='explicit'
# x = parser.parse('capra which does be red does not jump')
# # print(x.pretty())
# # transform...

grammar = open('./grammar2.lark').read()
parser = Lark(grammar, start='ast', ambiguity='explicit')
x = parser.parse('not cat does run')
print(x.pretty())
