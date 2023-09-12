from dataclasses import dataclass
from typing import Generic, TypeVar
from language import Ast, BinExp, Command, KnowledgeBase, Negation, Noun, VerbSentence, Which

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

    def do(self, verb:'Ast|ExpBuilder', negation:bool):
        return ExpBuilder(VerbSentence(makeAst(verb), self.e, _, negation, False, _, _))

    def does(self, verb:'Ast|ExpBuilder'):        
        return self.do(verb, False)

    def does_not(self, verb:'Ast|ExpBuilder'):
        return self.do(verb, True)

    def complement(self, name:str, thing:'Ast|ExpBuilder'):
        if not isinstance(self.e, VerbSentence): raise Exception()

        v = VerbSentence(**{**self.e.__dict__, name : makeAst(thing)})
        return ExpBuilder(v)

    def _(self, object:'Ast|ExpBuilder'):
        return self.complement('object', object)
      
    def _as(self, _as:'Ast|ExpBuilder'):
        return self.complement('_as', _as)

    def which(self, which:'Ast|ExpBuilder'):
        return ExpBuilder(Which(self.e, makeAst(which)))

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
        

def e(x:'Ast|ExpBuilder'):
    return ExpBuilder(makeAst(x))

def the(x:Ast):
    return ExpBuilder(Noun(x))

def a(x:Ast):
    return the(x)

def every(x:Ast):
    return the(x)

def does(v:Ast):
    return e(_).does(v)

def it_is_false_that(x:Ast|ExpBuilder):
    return ExpBuilder(Negation(makeAst(x)))

def makeAst(x:Ast|ExpBuilder)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|ExpBuilder)->Ast:
    return Command(makeAst(x))