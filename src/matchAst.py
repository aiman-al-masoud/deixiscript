from expbuilder import e, it_is_false_that
from language import Ast, KnowledgeBase, NounPhrase


#
# Two sentences are synonymous in a context kb, when
# their truth values co-vary in kb.
#
def matchFm(template:Ast, ast:Ast, kb:KnowledgeBase):
    r1 = e(template).tell(kb)
    r2 = it_is_false_that(template).tell(kb)
    return e(ast).get(r1.kb)==r1.head and it_is_false_that(ast).get(r2.kb)==r2.head


# def matchNp(template:NounPhrase, ast:NounPhrase, kb:KnowledgeBase):
#     r1 = e(template).tell(kb)
#     r2 = e(ast).ask(r1.kb) # TODO: only one (latest) result!! cardinality
#     return r1.head == r2.head
