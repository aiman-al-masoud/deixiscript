MAIN_FILE="$1"
QUOTES_FILE="$2"

if [ -z "$MAIN_FILE" ]; then echo 'specify main file!'; exit; fi
if [ -z "$QUOTES_FILE" ]; then echo 'specify quotes file too!'; exit; fi

rm report.pdf
cat "$MAIN_FILE" > tmp.md
echo -e "\n" >> tmp.md
cat "$QUOTES_FILE" >> tmp.md
sed -i -e "s/.\/$QUOTES_FILE//g" tmp.md
pandoc  tmp.md -o report.pdf
rm tmp.md