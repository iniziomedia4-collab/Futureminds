# -*- coding: utf-8 -*-
import re, glob, io

files = sorted(set(glob.glob('data/*.json') + ['assets/js/app.js', 'assets/js/hero3d.js'] + glob.glob('*.html')))

def process(text):
    n = [0]
    def count(pattern, repl, t):
        new, c = re.subn(pattern, repl, t)
        n[0] += c
        return new
    # 1) possessive: Futureminds' / Futureminds’  ->  Futureminds India's / India’s
    text = count(r"Futureminds(['’])", r"Futureminds India\1s", text)
    # 2) title-case, not already followed by " India"
    text = count(r"Futureminds(?! India)", "Futureminds India", text)
    # 3) ALL CAPS, not already followed by " INDIA"
    text = count(r"FUTUREMINDS(?! INDIA)", "FUTUREMINDS INDIA", text)
    # 4) stylised logo wordmark (split by <b> tag)
    text, c = re.subn(re.escape("Future<b>minds</b>") + r"(?! India)", "Future<b>minds</b> India", text)
    n[0] += c
    return text, n[0]

total = 0
for f in files:
    with io.open(f, 'r', encoding='utf-8') as fh:
        src = fh.read()
    out, c = process(src)
    if c:
        with io.open(f, 'w', encoding='utf-8') as fh:
            fh.write(out)
        total += c
        print(f"{c:3d}  {f}")
print("TOTAL replacements:", total)
