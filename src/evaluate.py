from src.expbuilder import e
from src.language import Ast, KnowledgeBase, Result
from src.prepareAst import prepareAst

def evaluate(ast:Ast, kb:KnowledgeBase)->Result:
    """
    TOP LEVEL ONLY!
    NOT supposed to be called recursively by any other function! 
    """
    r1 = prepareAst(ast, kb)
    r2 = e(r1.head).ask(r1.kb)
    return r2
