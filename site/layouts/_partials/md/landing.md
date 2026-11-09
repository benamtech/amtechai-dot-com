{{- /* The body of a landing page's Markdown twin (layouts/landing.html): every section in the page's order, every
       word from the page's content file. The sources live here only, never on the page (Ben, 2026-11-08). Serves home
       and the trade pages too (2026-11-08, `lena`): the action line follows `start` or `book`, and the industries,
       grid and proof appear only where the page has them. (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $o := site.BaseURL | strings.TrimSuffix "/" }}{{ $names := $P.names -}}
# {{ $m.h1 }}

{{ $P.sub }}
{{ with $P.answer }}
{{ . }}
{{ end }}
{{ if $P.start -}}
{{ $P.button }}: {{ $o }}/start?business=<your business's name>{{ with $P.start.industry }}&industry={{ . | urlquery }}{{ end }}
{{- else -}}
{{ $P.button }}: {{ $o }}/schedule-demo?business=<your firm's name>&industry={{ $P.book.industry | urlquery }}&topic={{ $P.book.topic | urlquery }}
{{- end }}

{{ $P.prices }}

Works with: {{ delimit $P.systems ", " }}.

{{ with $P.frame }}
## {{ $P.frame_h }}
{{ range . }}
{{ .ask }}

{{ .reply }}
{{ range .steps }}
- {{ . }}
{{- end }}
{{ end }}
{{ end }}
{{- with $P.bands }}
## {{ $P.bands_h }}
{{ range . }}
### {{ .h }}

{{ .p }}
{{ end }}
{{ end }}
{{- with $P.orbit_h }}
## {{ . }}
{{ range $P.team }}
- {{ partial "w/name.html" (dict "id" . "names" $names) }}
{{- end }}
{{ end }}
{{- with $P.service_groups }}
## {{ $P.service_groups_h }}
{{ range . }}{{ $g := . }}
### {{ $g }}
{{ range where hugo.Data.services "group" $g }}
- {{ .name }}: {{ .instead }}
{{- end }}
{{ end }}
{{ end }}
{{- with $P.cards }}
## {{ $P.cards_h }}
{{ with $P.cards_sub }}
{{ . }}
{{ end }}
{{ range . }}
- [{{ .h }}]({{ $o }}{{ .href }}): {{ .p }}
{{- end }}
{{ end }}
{{ with $P.industries }}
## {{ $P.industries_h }}
{{ range . }}
- [{{ .label }}]({{ $o }}{{ .href }}): {{ .line }}
{{- end }}
{{ end }}
{{- with $P.grid }}
## {{ $P.grid_h }}

{{ delimit .offices ", " }}.
{{ end }}
{{- with $P.proof }}
## {{ .h }}

{{ .p }}
{{ end }}
## {{ $P.offer_h }}

{{ $P.offer_p }}
{{ range $P.options }}
- **{{ .h }}:** {{ .p }}
{{- end }}
{{ with $P.guarantee }}
{{ . }}
{{ end }}
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
