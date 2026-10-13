{{- /* A prompt in the Markdown twin and the knowledge bundle. */ -}}
### {{ .Get "title" }}

{{ with .Get "helper" }}{{ . }}

{{ end }}```text
{{ .Inner | strings.TrimSpace }}
```
