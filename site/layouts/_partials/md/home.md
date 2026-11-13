{{- /* The body of the home page's Markdown twin (layouts/home.html): every section in the page's order, every word
       from content/_index.md. (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
# {{ $m.h1 }}

{{ $P.sub }}

{{ $P.answer }}

{{ $P.button }}: {{ hugo.Data.w.app }}/start

{{ $P.under }} {{ $P.book }}: {{ $o }}/schedule-demo

## {{ $P.kinds_h }}
{{ range $P.kinds }}
### {{ .tab }}

{{ $P.kinds_you }}: "{{ .say }}"
{{ range .team }}
- **{{ .name }}:** {{ .job }}
{{- end }}
{{ end }}
{{ range $P.figures }}
- **{{ .n }}** {{ .what }}
{{- end }}

## {{ $P.not_h }}

{{ $P.yes }}

## {{ $P.industries_h }}
{{ range $P.industries }}
- [{{ .label }}]({{ $o }}{{ .href }}): {{ .line }}
{{- end }}

## {{ $P.ops_h }}

{{ $P.ops_p }}

## {{ $P.customers_h }}
{{ range $P.customers }}
- **{{ .kind }}:** {{ .line }}
{{- end }}

## {{ $P.price_h }}
{{ range $P.options }}
- **{{ .h }}:** {{ .big }} {{ .per }}. {{ .p }}
{{- end }}

## {{ $P.questions_h }}
{{ range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
## {{ $P.closing_h }}

{{ $P.closing_sub }}

## Sources
{{ range $P.sources }}
- {{ . }}
{{- end }}
{{ with $P.reviewed }}
Reviewed by {{ .by }}, {{ (time .date).Format "2 January 2006" }}.
{{- end }}
