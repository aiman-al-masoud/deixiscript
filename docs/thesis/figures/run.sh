# dot -Tpng graph2.dot -Kdot  > output.png

# dot -Tpng -Gsize=5,4\! "$1" -Kdot  > "$1.png"
dot -Tpng  "$1" -Kdot  > "$1.png"

# images=$(ls | grep dot)
# for i in "$images"
# do
#     dot -Tpng -Gsize=5,4\! "$i" -Kdot  > "$i.png"
# done
