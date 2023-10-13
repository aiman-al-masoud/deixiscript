from core.expbuilder import e, the
from core.language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Implicit, Negation, Noun, Numerality, SimpleSentence, SyntheticDerivation, Which

def prepare(ast:Ast)->Ast:
    match ast:
        case str(x):
            return the('last')(1)(x).idiom.e if x else x
        case int(x)|float(x)|bool(x):
            return x
        case Noun():
            return e(ast).idiom.e
        case Which(h,w):
            return Idiom(Which(prepare(h), prepare(w)))
        case Numerality(h, c, o):
            return Idiom(Numerality(prepare(h), c, o))
        case SimpleSentence():
            x1={k: prepare(v) if k!='verb' else v for k,v in ast.args}
            x2=SimpleSentence(**x1)
            return Idiom(x2)
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
