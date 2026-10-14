{{- /* An article as Markdown, for its twin (/articles/<slug>.md) and its knowledge-bundle entry: the same words as the
       page, with the questions and sources after them. */ -}}
{{ with .Params.dek }}{{ . }}

{{ end }}{{ with .Params.audience }}For {{ . }}.

{{ end -}}
{{ .RenderShortcodes | replaceRE ` \{#[^}\n]+\}` "" | replaceRE `(?m)^\{\.[a-z-]+\}\n` "" | replaceRE `\n{3,}` "\n\n" | strings.TrimSpace }}
{{ with .Params.faqs }}
## Questions
{{ range . }}
### {{ .q }}

{{ .a }}
{{ end }}{{ end }}
{{- with .Params.citations }}
## Sources
{{ range . }}
- [{{ .label }}]({{ .url }}){{ with .publisher }} — {{ . }}{{ end }}
{{- end }}
{{ end }}
