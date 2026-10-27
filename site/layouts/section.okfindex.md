{{- /* /okf/<section>/index.md: a section's list in the bundle. OKF v0.2 §8: a non-root index carries no frontmatter.
       Each concept's own file is /okf/<section>/<slug>.md; the section's own page is /okf/<section>.md. */ -}}
# {{ .Title }}

* [{{ .Title }}](/{{ .Section }}.md) - {{ .Description }}
{{- range .RegularPages.ByWeight }}
* [{{ .Title }}](/{{ .Section }}/{{ path.Base (strings.TrimSuffix "/" .RelPermalink) }}.md) - {{ .Description }}
{{- end }}
