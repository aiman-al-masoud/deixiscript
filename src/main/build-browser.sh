echo "
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeixiScript</title>
</head>
<body>
<script>
" > index.html

deno bundle browser-main.ts >>  index.html

echo "
</script>
</body>
</html>
" >> index.html