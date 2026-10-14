{{- $url := printf "https://amtechai.com/articles/%s" .File.ContentBaseName -}}
---
title: {{ .Title | jsonify }}
description: {{ .Description | jsonify }}
canonical: "{{ $url }}"
date_published: "{{ .Date.Format "2006-01-02" }}"
date_modified: "{{ .Lastmod.Format "2006-01-02" }}"
author: {{ .Params.author | default "AMTECH AI" | jsonify }}
---
# {{ .Title }}

> {{ .Description }}

{{ partial "md/article-body.md" . }}
---

Alternate views: [HTML]({{ $url }}) · [Knowledge bundle entry](https://amtechai.com/okf/articles/{{ .File.ContentBaseName }}.md) · [llms.txt](https://amtechai.com/llms.txt)
