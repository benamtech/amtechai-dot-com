{{- /* One new page as one Markdown document with OKF v0.2 frontmatter: published as its twin (/<route>.md, home
       /index.md) and as its bundle concept (/okf/<route>.md, home /okf/home.md). (dict "p" page "m" meta)
       generated.by names the writer the page's foot names (an AMTECH AI employee); verified carries a human: actor
       only when the page's `reviewed` field records a person (page-spec 2.11: never human: on an unreviewed page). */ -}}
{{- $p := .p }}{{ $m := .m -}}
---
type: {{ $m.type | jsonify }}
title: {{ $m.h1 | jsonify }}
description: {{ $p.Description | jsonify }}
resource: {{ $m.url | jsonify }}
tags:
  - {{ lower $m.type | jsonify }}
{{- with $p.Params.label }}
  - {{ lower . | jsonify }}
{{- end }}
status: stable
{{- with $m.lastmod }}{{ if not .IsZero }}
generated: { by: amtech-employee/website, at: "{{ .UTC.Format "2006-01-02T15:04:05Z" }}" }
{{- end }}{{ end }}
{{- with $p.Params.reviewed }}
verified:
  - { by: "human:{{ index (split (lower .by) " ") 0 }}", at: "{{ (time .date).UTC.Format "2006-01-02T15:04:05Z" }}" }
{{- end }}
---
{{ partial "md/w-body.md" . }}
---

Alternate views: [HTML]({{ $m.url }}) · [Markdown]({{ site.BaseURL | strings.TrimSuffix "/" }}{{ $m.twin }}) · [Knowledge bundle entry](https://amtechai.com/okf{{ $m.okf }}) · [llms.txt](https://amtechai.com/llms.txt)
