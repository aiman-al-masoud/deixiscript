from expbuilder import e
from language import Ast
from normalized import normalized
from KnowledgeBase import KnowledgeBase, Result


def evaluate(ast:Ast, kb:KnowledgeBase=KnowledgeBase.empty)->Result:
    """
    TOP LEVEL ONLY!
    NOT supposed to be called by any other function! 
    """ 
    x1 = normalized(ast, kb)
    x2 = e(x1.head).ask(x1.kb)
    return x2

