from dataclasses import dataclass
from typing import Generic, TypeVar
from language import AnalyticDerivation, Ast, BinExp, Command, KnowledgeBase, Negation, Noun, Numerality, SimpleSentence, Which

T  =  TypeVar('T', bound='Ast')
_ = ''

@dataclass(frozen=True)
class ExpBuilder(Generic[T]):

    e:T

    def binop(self, op:Ast, right:'Ast|ExpBuilder'):
        return ExpBuilder(BinExp(op, self.e, makeAst(right)))

    def equals(self, x:'Ast|ExpBuilder'):
        return self.binop('=', x)

    def _and(self, x:'Ast|ExpBuilder'):
        return self.binop('and', x)
    
    def __add__(self, x:'ExpBuilder'):
        return self.binop('+', x)

    def verbSen(self, verb:'Ast|ExpBuilder', negation:bool):
        return ExpBuilder(SimpleSentence(makeAst(verb), self.e, _, negation, False, _, _))

    def does(self, verb:'Ast|ExpBuilder'):        
        return self.verbSen(verb, False)

    def does_not(self, verb:'Ast|ExpBuilder'):
        return self.verbSen(verb, True)

    def complement(self, name:str, thing:'Ast|ExpBuilder'):
        if not isinstance(self.e, SimpleSentence): raise Exception()

        v = SimpleSentence(**{**self.e.__dict__, name : makeAst(thing)})
        return ExpBuilder(v)

    def _(self, object:'Ast|ExpBuilder'):
        return self.complement('object', object)
      
    def as_(self, as_:'Ast|ExpBuilder'):
        return self.complement('as_', as_)

    def which(self, which:'Ast|ExpBuilder'):
        return ExpBuilder(Which(self.e, makeAst(which)))

    def when(self, definition:'Ast|ExpBuilder'):
        return ExpBuilder(AnalyticDerivation(self.e, makeAst(definition)))

    def ask(self, kb=KnowledgeBase.empty):
        from ask import ask
        return ask(self.e, kb)

    def get(self, kb=KnowledgeBase.empty):
        return self.ask(kb).head
    
    def count(self, kb=KnowledgeBase.empty):
        r = self.get(kb)
        return len(r) if isinstance(r, tuple) else 1
    
    def tell(self, kb=KnowledgeBase.empty):
        from ask import tell
        return tell(self.e, kb)
        

def i(x:Ast): # implicit
    return ExpBuilder(Noun(x))

def e(x:Ast|ExpBuilder): # explicit
    return ExpBuilder(makeAst(x))
    
def a(x:Ast|ExpBuilder):
    return ExpBuilder(Noun(makeAst(x)))
    # return ExpBuilder(Numerality(Noun(x), 1, -1))

def every(x:Ast):
    return ExpBuilder(Noun(x))

def does(v:Ast):
    return e(_).does(v)

def it_is_false_that(x:Ast|ExpBuilder):
    return ExpBuilder(Negation(makeAst(x)))

def makeAst(x:Ast|ExpBuilder)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|ExpBuilder):
    return ExpBuilder(Command(makeAst(x)))

