from core.language import Def, Ast, BinExp, Implicit, SimpleSentence, Law

# TODO: return map
def isMatch(sub:Ast, sup:Ast)->bool:

    match sub, sup:
        case str()|int()|float(), str()|int()|float():
            return sub==sup

        case Implicit(), Implicit():
            # if sup.card > sub.card: return False
            return isMatch(sub.head, sup.head) and isMatch(sub.which, sup.which)

        case SimpleSentence(), SimpleSentence():
            sub_keys=sub.args.keys()
            sup_keys=sup.args.keys()
            com_keys=sub_keys&sup_keys
            if com_keys!=sup_keys: return False
            return all([isMatch(sub.args[k], sup.args[k]) for k in com_keys])

        case BinExp(op='and'), SimpleSentence():                
            return isMatch(sub.left, sup) or isMatch(sub.right, sup)

        case BinExp(op='or'), SimpleSentence():
            raise Exception()

        case SimpleSentence(), BinExp(op='and'):
            return isMatch(sub, sup.left) and isMatch(sub, sup.right)

        case SimpleSentence(), BinExp(op='or'):
            return isMatch(sub, sup.left) or isMatch(sub, sup.right)

        case BinExp(op='and'|'or'), BinExp(op='and'|'or'):
            raise Exception()

        case Def(definendum=d1), Def(definendum=d2):
            return isMatch(d1, d2)

        case Law(cause=c1), Law(cause=c2):
            return isMatch(c1, c2)

        case _, True:
            return True

        case _:
            return False
            # raise Exception(sub, sup)