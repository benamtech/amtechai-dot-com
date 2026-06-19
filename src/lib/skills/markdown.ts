/**
 * Minimal, dependency-free Markdown -> HTML renderer for skill content (use.md and reference files).
 * React-free so the prerenderer (Node) and the SkillDetail page (React, via dangerouslySetInnerHTML)
 * produce identical output. Supported subset: #..#### headings, unordered lists, fenced code blocks,
 * inline code, bold, links, and paragraphs. Everything is HTML-escaped first (safe for our own content).
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s: string): string {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, '<code class="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.85em]">$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-black">$1</strong>');
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, txt, url) => `<a class="font-semibold text-red underline underline-offset-2" href="${url}">${txt}</a>`);
  return t;
}

const HEADING_CLASS = ['', 'mt-8 text-2xl font-black', 'mt-7 text-xl font-bold', 'mt-6 text-lg font-bold', 'mt-5 text-base font-bold'];

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let i = 0;
  let inList = false;
  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line.trim())) {
      closeList();
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      out.push(`<pre class="my-4 overflow-x-auto border border-black/15 bg-black/[0.04] p-4 text-sm leading-6"><code class="font-mono">${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      out.push(`<h${level} class="${HEADING_CLASS[level]} tracking-[-0.02em] text-black">${inline(h[2])}</h${level}>`);
      i += 1;
      continue;
    }

    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) {
      if (!inList) {
        out.push('<ul class="my-3 ml-5 list-disc space-y-1.5 text-black/75">');
        inList = true;
      }
      out.push(`<li class="leading-7">${inline(li[1])}</li>`);
      i += 1;
      continue;
    }

    if (line.trim() === '') {
      closeList();
      i += 1;
      continue;
    }

    closeList();
    const para: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|[-*]\s|```)/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(`<p class="my-3 leading-7 text-black/75">${inline(para.join(' '))}</p>`);
  }

  closeList();
  return out.join('\n');
}
