from typing import Dict
from lang import *


def match(super:Ast, sub:Ast)->Dict[Ast, Ast]:

    match super, sub:

        case Ast(), Ast() if super==sub:
            return {super:sub}

        case ImplicitPhrase(), Genitive() if sub.prop == super.head:
            return {super:sub}

        case ImplicitPhrase(), ImplicitPhrase() if super.head==sub.head:
            supers=set(super.adjectives)
            subs=set(sub.adjectives)
            common=supers&subs
            if common!=supers: return {}
            return {super:sub}
        
        case Genitive(), Genitive() if super.prop==sub.prop and match(super.owner, sub.owner):
            return {super:sub}

        case Idea(), Idea() if super.predicate==sub.predicate:
            m1=match(super.subject, sub.subject)        
            if not m1: return {}
            m2=match(super.object, sub.object)
            if not m2: return {}
            return {**m1, **m2}

        case OrExp(), Ast() if match(super.left, sub) or match(super.right, sub):
            return {super:sub}

        case Ast(), OrExp() if match(super, sub.left) or match(super, sub.right):
            return {super:sub}

        case AndExp(), Ast() if match(super.left, sub) and match(super.right, sub):
            return {super:sub}

        case Ast(), AndExp() if match(super, sub.left) or match(super, sub.right):
            return {super:sub}

        case NounPhrase(), Pronoun():
            return {super:sub}

        case Def(), Def() if match(super.definendum, sub.definendum):
            return {super:sub}

        case Ast(), TypeCast() if match(super, sub.asType):
            return {super:sub}

    return {}