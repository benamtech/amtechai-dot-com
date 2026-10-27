{{- /* A reading page (lane PORT, 2026-10-27) as one Markdown document with OKF v0.2 frontmatter, published as its twin
       (/<route>.md) and its bundle concept (/okf/<route>.md), as md/w-doc.md does for the new pages: the articles hub
       (each article, linked), a legal page (its words verbatim) and contact (the ways to reach AMTECH). Links are
       absolute URLs, so the document reads the same at both addresses. (dict "p" page "m" (partial "w/meta.html" page)) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $W := hugo.Data.w }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
---
type: {{ $m.type | jsonify }}
title: {{ $m.h1 | jsonify }}
description: {{ $p.Description | jsonify }}
resource: {{ $m.url | jsonify }}
tags:
  - {{ lower $m.type | jsonify }}
status: stable
{{- with $m.lastmod }}{{ if not .IsZero }}
generated: { by: amtech/website, at: "{{ .UTC.Format "2006-01-02T15:04:05Z" }}" }
{{- end }}{{ end }}
---
# {{ $m.h1 }}
{{ if eq $p.Section "articles" }}
{{ $P.intro }}
{{ range $p.Pages.ByDate.Reverse }}
## [{{ .Title }}]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }})

{{ .Date.Format "2 January 2006" }}. {{ .Params.dek | default .Description }} Markdown: {{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}.md
{{ end }}
{{- else if eq $p.Layout "legal" }}
{{ $P.intro }}

{{ $W.prose.effective }} {{ $P.effective }}

{{ $p.RenderShortcodes | replaceRE `\]\((/[^)]*)\)` (printf "](%s$1)" $o) | strings.TrimSpace }}
{{ else if eq $p.Layout "schedule-demo" }}
{{ $P.sub }}

{{ $P.twin_p }} {{ $o }}/schedule-demo
{{ else if eq $p.Layout "contact" }}
{{ $P.sub }}
{{ range $P.ways }}
## {{ .title }}

{{ .body }} [{{ .label }}]({{ cond (hasPrefix .to "/") (printf "%s%s" $o .to) (replaceRE `^app:` site.Params.app .to) }})
{{ end }}
## {{ $P.try_h }}

{{ $P.try_p }} [{{ $P.try_button }}]({{ $o }}{{ $P.try_to }})
{{ end }}
---

Alternate views: [HTML]({{ $m.url }}) · [Markdown]({{ $o }}{{ $m.twin }}) · [Knowledge bundle entry]({{ $o }}/okf{{ $m.okf }}) · [llms.txt]({{ $o }}/llms.txt)
