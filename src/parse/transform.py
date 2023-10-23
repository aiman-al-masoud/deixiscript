from typing import Sequence, Set
from lark import ParseTree, Token
from core.expbuilder import does, e, the
from core.Ast import Ast

def transform(st:ParseTree|Token)->Ast:

    match st:

        case Token():
            return e(int(st) if st.isnumeric() else st).e

        case _ if st.data=='noun':
            head=transform(getChild(st, 'noun_head'))
            return the('').e.copy(head=head)

        case _ if st.data=='relative':
            head=transform(getChild(st, 'relative_head'))
            subo=transform(getChild(st, 'subordinate'))
            return head.copy(which=subo)
        
        case _ if st.data=='simple_sentence':
            verb=transform(getChild(st, 'verb'))
            return does(str(verb)).e
        
        case _ if st.data=='compound_sentence':
            pass

     # # raise Exception()


def getChild(st:ParseTree, name:str):
    x1=st.find_data(name)
    x2=next(x1)
    x3=x2.children[0]
    return x3

# def getChildren(st:ParseTree, names:Set[str]):
#     return {k:list(st.find_data(k)) for k in names}



