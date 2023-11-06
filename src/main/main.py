from core.KB import KB
from parse.Parser import Parser
from plot.show import save_png

kb=KB()
parser=Parser()

while True:
    ast=parser.parse(input('> '))
    kb=ast.eval(kb)
    save_png(kb)