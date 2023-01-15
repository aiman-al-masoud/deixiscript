rm report.pdf
cat report-14-01-2023.md > tmp.md
echo -e "\n" >> tmp.md
cat quotes.md >> tmp.md
sed -i -e 's/.\/quotes.md//g' tmp.md
pandoc tmp.md -o report.pdf
rm tmp.md