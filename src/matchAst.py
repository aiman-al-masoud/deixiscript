from expbuilder import e
from language import KnowledgeBase, NounPhrase


def matchNp(template:NounPhrase, ast:NounPhrase, kb:KnowledgeBase):
    r1 = e(template).tell(kb)
    r2 = e(ast).ask(r1.kb)
    return r1.head == r2.head

