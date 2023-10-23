from lark import ParseTree, Token
from core.expbuilder import does, e, the
from core.Ast import Ast

def transform(st:ParseTree|Token)->Ast:

    match st:

        case Token():
            return e(int(st) if st.isnumeric() else st).e

        case _ if st.data=='noun':
            # card
            # ord
            # negation
            # cmd
            # concept
            head=transform(getChild(st, 'noun_head'))
            return the('').e.copy(head=head)

        case _ if st.data=='relative':
            head=transform(getChild(st, 'relative_head'))
            subo=transform(getChild(st, 'subordinate'))
            return head.copy(which=subo)
        
        case _ if st.data=='simple_sentence':
            # verb
            # subject
            # object
            # as
            # to
            # on
            # negation
            # cmd
            print(getChild(st, 'complement'))

            verb=transform(getChild(st, 'verb'))
            return does(str(verb)).e
        
        case _ if st.data=='compound_sentence':
            # left
            # right
            # op
            pass

     # # raise Exception()


def getChild(st:ParseTree, name:str):
    x1=list(st.find_data(name))
    print(x1)
    # x2=next(x1)
    x2=x1[0]
    x3=x2.children[0]
    return x3


