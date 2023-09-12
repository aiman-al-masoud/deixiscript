from src.expbuilder import e
from src.language import Ast, KnowledgeBase, Result
from src.prepareAst import decompress, expandCommands, expandNegations, removeImplicit

def evaluate(ast:Ast, kb:KnowledgeBase)->Result:
    """
    TOP LEVEL ONLY!
    NOT supposed to be called recursively by any other function! 
    """
    # TODO: check for match in analytic derivaton clauses
    x1 = expandNegations(ast)
    x2 = expandCommands(x1)
    x3 = removeImplicit(x2, kb)
    x4 = decompress(x3.head)
    x5 = e(x4).ask(x3.kb)
    return x5