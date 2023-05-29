import { schema } from "./schema.ts";

export const biblios: schema[] =

    [
        {
            "title": "The Pragmatic Programmer: From Journeyman to Master",
            "author": [
                { "name": "Andrew Hunt" },
                { "name": "David Thomas" }
            ],
            "type": "book",
            "year": "1999",
            "publisher": {
                "name": "Addison Wesley"
            },
            "link": [
                { "url": "https://www.cin.ufpe.br/~cavmj/104The%20Pragmatic%20Programmer,%20From%20Journeyman%20To%20Master%20-%20Andrew%20Hunt,%20David%20Thomas%20-%20Addison%20Wesley%20-%201999.pdf" },
                { "url": "./attachments/pragmatic-programmer.pdf" }
            ],
            "identifier": [
                { "type": "isbn", "id": "0-201-61622-X" }
            ]
        },
        {
            "title": "Translating OWL and Semantic Web Rules into Prolog: Moving Toward Description Logic Programs",
            "author": [
                { "name": "Ken Samuel" },
                { "name": "Leo Obrst" },
                { "name": "Suzette Stoutenberg" },
                { "name": "Karen Fox" },
                { "name": "Paul Franklin" },
                { "name": "Adrian Johnson" },
                { "name": "Ken Laskey" },
                { "name": "Deborah Nichols" },
                { "name": "Steve Lopez" },
                { "name": "Jason Peterson" }
            ],
            "type": "article",
            "year": "2007",
            "publisher": {
                "name": "The MITRE Corporation"
            },
            "link": [
                { "url": "https://arxiv.org/pdf/0711.3419.pdf" },
                { "url": "./attachments/sworier-owl-to-prolog.pdf" }
            ],
            "identifier": [
                { "type": "doi", "id": "10.48550/arXiv.0711.3419" }
            ]
        },

        {
            "title": "Topic and comment",
            "type": "wikipedia",
            "year": "",
            "link": [
                { "url": "https://en.wikipedia.org/wiki/Topic_and_comment" }
            ]
        },

        {
            "title": "Reconciliation",
            "type": "documentation",
            "year": "",
            "link": [
                { "url": "https://reactjs.org/docs/reconciliation.html" }
            ]
        },

        {
            "title": "Beyond AOP: Toward Naturalistic Programming",
            "author": [
                { "name": "Cristina Videira Lopes" },
                { "name": "Paul Dourish" },
                { "name": "David H. Lorenz" },
                { "name": "Karl Lieberherr" }
            ],
            "type": "article",
            "year": "2003",
            "publisher": {
                "name": "OOPSLA Onward!"
            },
            "link": [
                { "url": "https://www2.ccs.neu.edu/research/demeter/papers/oopsla-onward/beyondAOP.pdf" }
            ],
            "identifier": [
                { "type": "doi", "id": "10.1145/966051.966058" }
            ]
        },

        {
            "title": "NaturalJava: A Natural Language Interface for Programming in Java",
            "author": [
                { "name": "David Price" },
                { "name": "Ellen Riloff" },
                { "name": "Joseph Zachary" },
                { "name": "Brandon Harvey" }
            ],
            "type": "article",
            "year": "2000",
            "publisher": {
                "name": "Department of Computer Science University of Utah"
            },
            "link": [
                { "url": "https://www.cs.utah.edu/~riloff/pdfs/iui2000.pdf" }
            ],
            "identifier": [
                { "type": "doi", "id": "10.1145/325737.325845" }
            ]
        },

        {
            "title": "The End of Programming",
            "author": [{ "name": "Matt Welsh" }],
            "type": "article",
            "year": "2023",
            "link": [
                { "url": "https://dl.acm.org/doi/10.1145/3570220" }
            ],
            "identifier": [
                { "type": "doi", "id": "10.1145/3570220" }
            ]
        },

        {
            "title": "Robopsychology",
            "type": "wikipedia",
            "link": [{ url: "https://en.wikipedia.org/wiki/Robopsychology" }]
        },

        {
            "title": "A Model for Naturalistic Programming with Implementation",
            "author": [
                { "name": "Oscar Pulido-Prieto" },
                { "name": "Ulises Juárez-Martínez" }
            ],
            "type": "article",
            "year": "2019",
            "publisher": {
                "name": "Division of Research and Postgraduate Studies, Tecnológico Nacional de México"
            },
            "link": [
                { "url": "https://www.mdpi.com/2076-3417/9/18/3936" },
                { "url": "file:///home/aiman/Downloads/applsci-09-03936-v2.pdf" }
            ],
            "identifier": [
                { "type": "doi", "id": "10.3390/app9183936" }
            ]
        },

        {
            "title": "Pegasus – First Steps Toward a Naturalistic Programming Language",
            "year": "2006",
            "type": "article",
            "link": [
                { "url": "https://dl.acm.org/doi/abs/10.1145/1176617.1176628" },
                { "url": "file:///home/aiman/Desktop/ideas-voice-programming/pegasus-paper.pdf" }

            ],
            "identifier": [
                { "type": "doi", "id": "10.1145/1176617.1176628" }
            ]
        },

        {
            "title": "Evolution of Naturalistic Programming: A Need",
            "year": "2020",
            "type": "article",
            "link": [
                { "url": "https://link.springer.com/chapter/10.1007/978-3-030-63329-5_13" },
                { "url": "file:///home/aiman/Desktop/ideas-voice-programming/evolution-of-naturalistic-programming-a-need.pdf" }
            ]
        },

        {
            "title": "Osmosian",
            "type": "webpage",
            "link": [{ "url": "http://www.osmosian.com" }]
        },

        {
            "title": "Pegasus",
            "type": "webpage",
            "link": [{ "url": "http://www.pegasus-project.org/en/Welcome.html" }]
        },

        {
            "title": "Plain English Programming",
            "type": "documentation",
            "link": [
                { "url": "http://www.osmosian.com/instructions.pdf" },
                { "url": "file:///home/aiman/Desktop/ideas-voice-programming/osmosian.pdf" }
            ]
        },

        {
            "title": "Language and Communication Problems in Formalization: A Natural Language Approach",
            "type": "article",
            "year": "2021",
            "identifier": [
                { "type": "doi", "id": "10.1007/978-3-030-76020-5_7" }
            ],
            "link": [
                { "url": "https://link.springer.com/chapter/10.1007/978-3-030-76020-5_7" },
                { "url": "file:///home/aiman/Desktop/ideas-voice-programming/978-3-030-76020-5.pdf" }
            ]
        }
    ]

