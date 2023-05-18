* Mind
* Long Term Memory
* Short Term Memory


nouns (entities), verbs (actions) and adjectives and adverbs (properties).

Dictionary stores lexical knowledge

Meaning and Semantic Knowledge — The Library and the Associative Net

there is an entry for each idea (template?) in the library, for example a condition is translated to an if statement.

this is also an example of an idea template:

```
((
(be, predicate),
(number, subject),
(smallness, comparative),
((number, than), object),
statement)
```


{
    type:'copula-sentence',
    subject : 'number',
    predicate : {
        type : 'comparative',
        property : 'smallness',
        comparedTo: 'number', 
    }
}

ideas are reteived and used to generate corresponding code, nested ideas are recursively converted to code.

long term memory stores semantic knowledge, for example is-a relationshipts etc...

short term memory for context and anaphora




