rm *.pdf
typst c 0-main.typ
pdftk 0-main.pdf cat 1-8 10-end output aiman-al-masoud-thesis-deixiscript.pdf
rm 0-main.pdf