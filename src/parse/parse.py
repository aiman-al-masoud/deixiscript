import os
from lark import Lark
from core.Ast import Ast
from parse.ToAst import ToAst

class Parser():
    
    def __init__(self):
        grammar_path=os.path.join(os.path.split(__file__)[0], 'grammar.lark')
        grammar = open(grammar_path).read()
        self.lark = Lark(grammar, start='ast')#, ambiguity='explicit')
        self.tr = ToAst()

    def parse(self, code:str)->Ast:
        st=self.lark.parse(code)
        # print('st=', st)
        ast=self.tr.transform(st)
        return ast

# parser = Lark(grammar, start='ast')#, ambiguity='explicit')
# x = parser.parse('1 cat does run on floor')
# x = parser.parse('a cat')
# x = parser.parse('a cat which does run')
# x = parser.parse('cat and dog')
# x = parser.parse('cat does sit on table')
# x = parser.parse('cat which does sit on table')
# x = parser.parse('the new cat does eat?')
# x = parser.parse('a new cat')
# x = parser.parse('a new cat which does eat')
# x = parser.parse('it when thing')
# y = ToAst().transform(x)

# parser = Parser()
# x=parser.parse('the 1 cat does run?')
