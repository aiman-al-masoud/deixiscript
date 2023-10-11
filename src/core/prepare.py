from core.expbuilder import e, the
from core.language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Implicit, Negation, Noun, Numerality, SimpleSentence, SyntheticDerivation, Which
from core.subst import subst


def prepare(ast:Ast)->Ast:
    x1 = __step1(ast)
    x2 = __step2(x1)
    return x2

def __step1(ast:Ast)->Ast:
    match ast:
        case str(x):
            return the(x).e if x else x
        case int(x)|float(x)|bool(x):
            return x
        case Noun():
            return ast
        case Which(h,w):
            return Which(prepare(h), prepare(w))
        case Numerality(h, c, o):
            return Numerality(prepare(h), prepare(c), prepare(o))
        case SimpleSentence():
            x1={k: prepare(v) if k!='verb' else v for k,v in ast.args}
            x2=SimpleSentence(**x1)
            return x2
        case Command(v):
            return Command(prepare(v))
        case BinExp(op, l, r):
            return BinExp(op,prepare(l),prepare(r))
        case Negation(v):
            return Negation(prepare(v))
        case AnalyticDerivation(d1, d2) | SyntheticDerivation(d1,d2):
            return ast.__class__(prepare(d1), prepare(d2))
        case Idiom(v):
            return Idiom(prepare(v))
        case _:
            raise Exception()

def __step2(ast:Ast)->Ast:
    return ast if isinstance(ast, Idiom) else Idiom(ast)


# x = prepare(e('capra').does('eat')._('grass').e)
# print(x)
# y = prepare('it')
# print(y)

# x = e('capra').does('eat').p
# print(x)

