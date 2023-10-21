from core.language import Def, Ast, BinExp, Implicit, SimpleSentence, Law

# TODO: return map
def isMatch(sup:Ast, sub:Ast)->bool:

    match sup, sub:
        case str()|int()|float(), str()|int()|float():
            return sub==sup
        case Implicit(), Implicit():
            
            # if sup.card > sub.card: return False
            return isMatch(sup.head, sub.head) and isMatch(sup.which, sub.which)

        case SimpleSentence(), SimpleSentence():

            if sup.verb != sub.verb: return False
            
            return isMatch(sup.subject, sub.subject)                   and\
                   (not sup.object or isMatch(sup.object, sub.object)) and\
                   (not sup.as_    or isMatch(sup.as_, sub.as_))       and\
                   (not sup.to     or isMatch(sup.to, sub.to))         and\
                   (not sup.on     or isMatch(sup.on, sub.on))

        case SimpleSentence(), BinExp(op='and'):          
            return isMatch(sup, sub.left) or isMatch(sup, sub.right)

        case SimpleSentence(), BinExp(op='or'):
            raise Exception()

        case BinExp(op='and'), SimpleSentence():
            return isMatch(sup.left, sub) and isMatch(sup.right, sub)

        case BinExp(op='or'), SimpleSentence():
            return isMatch(sup.left, sub) or isMatch(sup.right, sub)

        case BinExp(op='and'|'or'), BinExp(op='and'|'or'):

            # wrong (and)
            return isMatch(sup.left,  sub.left) and\
            isMatch(sup.right, sub.right)       and\
            isMatch(sup.left,  sub.right)       and\
            isMatch(sup.right, sub.left)


        case Def(definendum=d1), Def(definendum=d2):
            return isMatch(d1, d2)
        case Law(cause=c1), Law(cause=c2):
            return isMatch(c1, c2)
        case True, _:
            return True
        case _:
            return False
            # raise Exception(sup, sub)