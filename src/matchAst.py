from expbuilder import e
from language import KnowledgeBase, NounPhrase


def matchNp(template:NounPhrase, ast:NounPhrase, kb:KnowledgeBase):
    r1 = e(template).tell(kb)
    r2 = e(ast).ask(r1.kb) # TODO: only one (latest) result!! cardinality
    return r1.head == r2.head

