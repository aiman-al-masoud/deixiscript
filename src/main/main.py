from core.KnowledgeBase import KnowledgeBase
from parser.parse import parse
from parser.tokenize import tokenize
from core.expbuilder import e
from plot.show import save_png

kb = KnowledgeBase()

while True:
    x1 = input()
    x2 = tokenize(x1)
    x3 = parse(x2)
    kb = e(x3).p.ask(kb)
    save_png(kb.wm)
    # print(kb.wm)
