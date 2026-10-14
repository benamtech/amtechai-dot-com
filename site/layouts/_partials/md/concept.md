{{- $c := .c -}}
---
type: {{ $c.type | jsonify }}
title: {{ $c.title | jsonify }}
description: {{ $c.description | jsonify }}
tags:
{{- range $c.tags }}
  - {{ . | jsonify }}
{{- end }}
status: {{ $c.status | jsonify }}
---
# {{ $c.title }}

{{ $c.description }}

- **Kind:** {{ $c.type }}
- **Status:** {{ $c.status }}
{{ with $c.related }}
# Related concepts
{{ range . }}{{ $r := . }}{{ with index $.concepts .key }}
- [{{ .title }}](/entities/{{ $r.key }}.md) — {{ $r.reason }}
{{- end }}{{ end }}
{{ end }}
{{- with .by }}
# Referenced by
{{ range . }}
- [{{ .title }}]({{ .path }}) — {{ .why }}
{{- end }}
{{ end }}