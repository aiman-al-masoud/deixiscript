from core.KB import KB
from parse.Parser import Parser
from plot.show import save_png

kb=KB()
parser=Parser()

while True:
    # x=input('> ')
    # if x.startswith(':def'):
    #         y=x.lstrip(':def').strip()
    #         print(y)
    #         ast=parser.parse(y)
    #         print(ast.define(kb))
    #         continue
    x=input('> ')
    ast=parser.parse(x)
    kb=ast.eval(kb)
    save_png(kb)