// #set heading(numbering: "1.")
// #set text(font:"Times New Roman", size:13pt)

// #set par(
//     justify: true, 
//     leading: 1.5em, 
//     first-line-indent: 1em, 
//     linebreaks: "simple",
// )

// #set page(
//         paper: "a4",   
//         margin: 3cm, 
//         numbering: "1 / 1", 
//         number-align: right,
//         // header: [], 
//         // footer: [],
//         // margin: (right:3cm, left:3cm, top:4.5cm, bottom:4.5cm), 
// )

// #show heading.where(level:1): it => [
//     #pagebreak()
//     #set align(center)
//     #set text(size:13pt, weight: "bold")
//     #block(it) //.body
// ]

// #outline()


#let buildMainHeader(mainHeadingContent) = {
  [
    #align(center, smallcaps(mainHeadingContent)) 
    #line(length: 100%)
  ]
}

#let buildSecondaryHeader(mainHeadingContent, secondaryHeadingContent) = {
  [
    #smallcaps(mainHeadingContent)  #h(1fr)  #emph(secondaryHeadingContent) 
    #line(length: 100%)
  ]
}

// To know if the secondary heading appears after the main heading
#let isAfter(secondaryHeading, mainHeading) = {
  let secHeadPos = secondaryHeading.location().position()
  let mainHeadPos = mainHeading.location().position()
  if (secHeadPos.at("page") > mainHeadPos.at("page")) {
    return true
  }
  if (secHeadPos.at("page") == mainHeadPos.at("page")) {
    return secHeadPos.at("y") > mainHeadPos.at("y")
  }
  return false
}

#let getHeader() = {
  locate(loc => {
    // Find if there is a level 1 heading on the current page
    let nextMainHeading = query(selector(heading).after(loc), loc).find(headIt => {
     headIt.location().page() == loc.page() and headIt.level == 1
    })
    if (nextMainHeading != none) {
      return buildMainHeader(nextMainHeading.body)
    }
    // Find the last previous level 1 heading -- at this point surely there's one :-)
    let lastMainHeading = query(selector(heading).before(loc), loc).filter(headIt => {
      headIt.level == 1
    }).last()
    // Find if the last level > 1 heading in previous pages
    let previousSecondaryHeadingArray = query(selector(heading).before(loc), loc).filter(headIt => {
      headIt.level > 1
    })
    let lastSecondaryHeading = if (previousSecondaryHeadingArray.len() != 0) {previousSecondaryHeadingArray.last()} else {none}
    // Find if the last secondary heading exists and if it's after the last main heading
    if (lastSecondaryHeading != none and isAfter(lastSecondaryHeading, lastMainHeading)) {
      return buildSecondaryHeader(lastMainHeading.body, lastSecondaryHeading.body)
    }
    return buildMainHeader(lastMainHeading.body)
  })
}

#let project(
  title: "",
  abstract: [],
  authors: (),
  logo: none,
  body
) = { 

  // Set the document's basic properties.
  set document(author: authors.map(a => a.name), title: title)
  set text(font: "New Computer Modern", lang: "en", size: 13pt)
  show math.equation: set text(weight: 400)
  show figure.caption: emph
  set heading(numbering: "1.1")
  set par(justify: true, linebreaks: "simple")
  set quote(block: true)

  show quote: set text(font: "FreeSans", size: 11pt)

  // Title page.

  // Logo
  // if logo != none {
    // v(0.25fr)
    align(center, image("./figures/logo.png", width: 26%))
    // v(0.50fr)
  // } else {
    // v(0.75fr)
  // }

  // title
  // v(0.25fr)
  align(center)[
    #text(1.5em, weight: 550, title)
  ]

  // Author information.
  pad(
    top: 0.7em,
    grid(
      columns: (1fr),
      gutter: 1em,
      ..authors.map(author => align(center)[
        *#author.name* \
        #author.email \
        #author.affiliation \
        #author.postal \
        #author.phone
      ]),
    ),
  )
  
  pagebreak()

  // Abstract page.
  set page(numbering: "I", number-align: center)
  v(1fr)
  align(center)[
    #heading(
      outlined: false,
      numbering: none,
      text(0.85em, smallcaps[Abstract]),
    )
  ]
  abstract
  v(1.618fr)
  counter(page).update(1)
  pagebreak()

  // Table of contents.
  outline(depth: 3, indent: true)
  pagebreak()



  // Main body.
  set page(numbering: "1", number-align: center, margin: (right:3cm, left:3cm, top:4.5cm, bottom:4.5cm))
  set par(first-line-indent: 20pt, leading: 1em)
  set page(header: getHeader(), paper:"a4")
  counter(page).update(1)
  
  // show heading: it => [#it]
  show heading: set block(above: 3em, below: 2em)
  show figure: set block(above: 4em, below: 4em)


  body
}