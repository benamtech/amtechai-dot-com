{{- /* A set-apart note in the Markdown twin and the knowledge bundle. */ -}}
> **{{ if eq (.Get "tone") "warning" }}Warning: {{ end }}{{ .Get "title" }}**
>
> {{ .Inner | strings.TrimSpace }}
