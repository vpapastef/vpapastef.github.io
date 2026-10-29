"""merge-week.py OUT.pdf IN.pdf [IN.pdf ...] : a week's PDFs as one file.

Called by zip-lectures.sh for the «Όλα» menu of each week. Beamer links
point at named destinations (page.3, section.2), and every input has its own
set, so the names would clash once merged: each link is re-pointed at its
page in the merged file instead. The bookmarks get one entry per input, with
that input's own bookmarks under it.
"""
import io
import logging
import os
import re
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, FloatObject, NameObject, NullObject

# the part of each file name and its bookmark, in the order of KINDS in
# src/pages/teaching/[module].astro
PARTS = {'lecture': 'Θεωρία', 'summary': 'Σύνοψη', 'exercises': 'Ασκήσεις'}

# by type, the destination's numbers after the page and the type
PARAMS = {'/XYZ': ('left', 'top', 'zoom'), '/Fit': (), '/FitB': (),
          '/FitH': ('top',), '/FitBH': ('top',), '/FitV': ('left',),
          '/FitBV': ('left',), '/FitR': ('left', 'bottom', 'right', 'top')}

logging.getLogger('pypdf').setLevel(logging.ERROR)


def part(path):
    m = re.match(r'(.+)-\d+\.pdf$', os.path.basename(path))
    return m.group(1) if m else os.path.basename(path)


def explicit(ref, d):
    num = lambda v: NullObject() if v is None else FloatObject(v)
    return ArrayObject([ref, NameObject(d.typ)] + [num(getattr(d, k)) for k in PARAMS[d.typ]])


def bookmarks(r, items):
    # pypdf lists an item's children as a list right after it
    out = []
    for o in items:
        if isinstance(o, list):
            out[-1][2].extend(bookmarks(r, o))
        else:
            out.append((o.title, r.get_destination_page_number(o), []))
    return out


def add_bookmarks(w, items, start, parent):
    for title, page, kids in items:
        add_bookmarks(w, kids, start, w.add_outline_item(title, start + page, parent=parent))


def merge(out, inputs):
    order = list(PARTS)
    inputs = sorted(inputs, key=lambda p: order.index(part(p)) if part(p) in order else len(order))
    w = PdfWriter()
    dead = 0
    for path in inputs:
        r = PdfReader(path)
        dests = {name: (r.get_page_number(d.page), d) for name, d in r.named_destinations.items()}
        start = len(w.pages)
        w.append(r, import_outline=False)
        if start == 0 and r.metadata:
            w.add_metadata({k: str(v) for k, v in r.metadata.items() if k in ('/Title', '/Author')})
        for i, src in enumerate(r.pages):
            ours = [a.get_object() for a in w.pages[start + i].get('/Annots') or []]
            theirs = [a.get_object() for a in src.get('/Annots') or []]
            if len(ours) != len(theirs):
                sys.exit(f'merge-week: {path} page {i + 1}: annotations not copied one to one')
            for a, s in zip(ours, theirs):
                if s.get('/Subtype') != '/Link':
                    continue
                if '/Dest' in s:
                    holder, key, name = a, '/Dest', s['/Dest']
                elif '/A' in s and s['/A'].get_object().get('/S') == '/GoTo':
                    holder, key, name = a['/A'].get_object(), '/D', s['/A'].get_object()['/D']
                else:
                    continue
                if not isinstance(name, str):
                    continue
                if name not in dests or dests[name][0] is None:
                    dead += 1
                    continue
                page, d = dests[name]
                holder[NameObject(key)] = explicit(w.pages[start + page].indirect_reference, d)
        top = w.add_outline_item(PARTS.get(part(path), part(path)), start)
        add_bookmarks(w, bookmarks(r, r.outline), start, top)
    names = w._root_object.get('/Names')
    if names is not None:
        names.get_object().pop('/Dests', None)
    w.page_mode = '/UseOutlines'
    buf = io.BytesIO()
    w.write(buf)
    try:
        import pymupdf
    except ImportError:
        # pypdf writes no object streams, so the file is about 50% larger
        print('merge-week: pymupdf not installed, writing the file uncompacted', file=sys.stderr)
        open(out, 'wb').write(buf.getvalue())
    else:
        pymupdf.open(stream=buf.getvalue(), filetype='pdf').save(
            out, garbage=4, deflate=True, use_objstms=1)
    if dead:
        print(f'merge-week: {out}: {dead} link(s) with no destination left as they were', file=sys.stderr)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    merge(sys.argv[1], sys.argv[2:])
