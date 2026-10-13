{{- /* /okf/index.md, and the concept files /okf/entities/<key>.md (written from data/concepts.yaml here, because a
       concept has no page of its own). Links are relative to the bundle's root, /okf/. */ -}}
{{- $articles := (where site.RegularPages "Section" "articles").ByDate.Reverse -}}
{{- $concepts := hugo.Data.concepts -}}
{{- range $key, $c := $concepts }}
  {{- $by := slice }}
  {{- range $k2, $c2 := $concepts }}{{ range $c2.related }}{{ if eq .key $key }}{{ $by = $by | append (dict "title" $c2.title "path" (printf "/entities/%s.md" $k2) "why" (printf "%s." $c2.type)) }}{{ end }}{{ end }}{{ end }}
  {{- range $articles }}{{ if in .Params.related $key }}{{ $by = $by | append (dict "title" .Title "path" (printf "/articles/%s.md" .File.ContentBaseName) "why" "Article.") }}{{ end }}{{ end }}
  {{- $md := partial "md/concept.md" (dict "key" $key "c" $c "concepts" $concepts "by" $by) }}
  {{- (resources.FromString (printf "okf/entities/%s.md" $key) $md).Publish }}
{{- end -}}
---
okf_version: "0.1"
title: "AMTECH AI Knowledge Bundle"
description: "AMTECH's published articles, as an Open Knowledge Format bundle."
---
# AMTECH AI Knowledge Bundle

AMTECH's published articles, as an Open Knowledge Format bundle. Each article's page is at https://amtechai.com/articles/<slug>; its plain Markdown twin is at https://amtechai.com/articles/<slug>.md.

## Articles
{{ range $articles }}
* [{{ .Title }}](/articles/{{ .File.ContentBaseName }}.md) - {{ .Description }}
{{- end }}

{{- with $concepts }}

## Concepts
{{ range $key, $c := . }}
* [{{ $c.title }}](/entities/{{ $key }}.md) - {{ $c.description }}
{{- end }}
{{- end }}
