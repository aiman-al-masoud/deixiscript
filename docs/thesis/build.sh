NAME='0-book'
clear
rm *.aux *.pdf *.log *.blg *.bbl

if [ "$1" = 'clean' ] 
then
    exit
fi

pdflatex "$NAME"
bibtex "$NAME"
pdflatex "$NAME"
pdflatex "$NAME"