{{- /* /okf/articles/index.md. OKF v0.2 §8: a non-root index carries no frontmatter. */ -}}
# AMTECH AI articles

Every published AMTECH article in the knowledge bundle.
{{ range .Pages.ByDate.Reverse }}
* [{{ .Title }}](/articles/{{ .File.ContentBaseName }}.md) - {{ .Description }}
{{- end }}
