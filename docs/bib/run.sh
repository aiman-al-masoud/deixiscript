MAIN='repr.ts'

tsc --skipLibCheck repr.ts 2> trash.txt > trash.txt
node repr.js > bib.md
rm *.js trash.txt

