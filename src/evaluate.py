from src.expbuilder import e
from src.language import Ast, KnowledgeBase, Result
from src.prepareAst import decompress, expandCommands, expandNegations, removeImplicit

def evaluate(ast:Ast, kb:KnowledgeBase)->Result:
    """
    TOP LEVEL ONLY!
    NOT supposed to be called by any other function! 
    """
    # TODO: check for definitions in analytic derivaton clauses
    x1 = expandNegations(ast)
    x2 = expandCommands(x1)
    x3 = removeImplicit(x2, kb)
    x4 = decompress(x3.head)
    x5 = e(x4).ask(x3.kb)
    # TODO: check for consequences in synthetic derivation clauses
    return x5
