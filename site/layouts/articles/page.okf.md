{{- /* OKF v0.2 (lane SEARCH 2026-10-27: no v0.1 `timestamp`, status stable; no `generated`, since who wrote each article is not recorded). This article's entry in the knowledge bundle (/okf/articles/<slug>.md). Links are relative to the bundle's root. */ -}}
{{- $slug := .File.ContentBaseName -}}
{{- $concepts := hugo.Data.concepts -}}
---
type: "Article"
title: {{ .Title | jsonify }}
description: {{ .Description | jsonify }}
resource: "https://amtechai.com/articles/{{ $slug }}"
tags:
{{- range .Params.about }}
  - {{ .name | jsonify }}
{{- end }}
status: stable
---
# {{ .Title }}

{{ .Description }}

{{ partial "md/article-body.md" . }}
{{- with .Params.related }}
# Related concepts
{{ range $k := . }}{{ with index $concepts $k }}
- [{{ .title }}](/entities/{{ $k }}.md) — {{ .type }}.
{{- end }}{{ end }}
{{ end }}
{{- $here := printf "/articles/%s" $slug -}}
{{- $by := slice -}}
{{- range where site.RegularPages "Section" "articles" }}{{ $p := . }}{{ range .Params.next }}{{ if eq .href $here }}{{ $by = $by | append $p }}{{ end }}{{ end }}{{ end }}
{{- with $by | uniq }}
# Referenced by
{{ range . }}
- [{{ .Title }}](/articles/{{ .File.ContentBaseName }}.md)
{{- end }}
{{ end }}