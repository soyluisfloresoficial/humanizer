import re
head = open('head.html', encoding='utf-8').read()
engine = open('engine.js', encoding='utf-8').read()
posts = open('posts-a.js', encoding='utf-8').read() + '\n' + open('posts-b.js', encoding='utf-8').read()
marker = 'const POSTS = [...POSTS_A, ...POSTS_B];'
assert marker in engine
engine = engine.replace(marker, posts + '\n' + marker)
open('../calendario-30-dias.html', 'w', encoding='utf-8').write(head + '<script>\n' + engine + '\n</script>\n</body>\n</html>\n')
print('posts:', len(re.findall(r"\bP\('c\d+'", posts)))
