```
<sentence> ::= <declaration>
              |<question>
```

```
<declaration> ::= <simple>
                 |<complex>
```

```
<simple> ::= <copula_sentence>
            |<verb_sentence>           
```

```
<complex> ::= <subordination>
             |<conjunction>
```

```
<subordination> ::=  <subord_conj> <simple> ['then'] <simple>
                    |<simple> <subord_conj> <simple>
```

```
<conjunction> ::= <simple> <conj_conj> <simple>
                 |<simple> <conj_conj> <iverb> <complement>*
                 |<simple> <conj_conj> <mverb> <object> <complement>*
                 |<conjunction> <conj_conj> <conjunction>
```

```
<copula_sentence> ::= <subject> <copula> [<negation>] <subject>
```

```
<verb_sentence> ::= <intransitive_sentence> 
                   |<monotransitive_sentence>
```

```
<intransitive_sentence> ::= <subject> [<negation>] <iverb> <complement>*
```

```
<monotransitive_sentence> ::= <subject> [<negation>] <mverb> <complement>* <object> <complement>*
```

```
<question> ::= <binary_question>
              |<wh_question>
```

```
<binary_question> ::= <copula> <subject> <subject>
                     |<hverb> <verb_sentence>
```

```
<subject> ::= <noun_phrase>
```

```
<noun_phrase> ::= [<quantifier>] [<article>] <adjective>* <noun> [<subordinate_clause>] <complement>*
```

```
<complement> ::= <preposition> <noun_phrase>
```

```
<subordinate_clause> ::= <rel_pro> <copula> <subject>
                        |<rel_pro> <iverb> <complement>*
                        |<rel_pro> <mverb> <object> <complement>*
                        |<rel_pro> <subject> <mverb> <complement>*
```

```
<quantifier> ::= 'every'
				|'all'
				|'each'
				|'some'
```

```
<article> ::= 'a'
			 |'an'
			 |'the'
```

```
<rel_pro>  ::= 'that'
```

```
<copula> ::= 'is'
			|'are'
			|'be'
```

```
<negation> ::= "doesn't"
              |"does not"
              |'not'
              |"don't"
              |'do not'
```

```
<subord_conj> ::= 'if'
                 |'when'
                 |'because'
```

```
<hverb> ::= 'do'
           |'does'
```

```
<iverb> ::= [a-z]+
```

```
<mverb> ::= [a-z]+
```

```
<noun> ::= [a-z]+
```

```
<adjective> ::= [a-z]+
```

```
<preposition> ::= 'to'
                 |'with'
                 |'from' ...
```
