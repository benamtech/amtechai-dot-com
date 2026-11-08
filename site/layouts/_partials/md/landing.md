{{- /* The body of a landing page's Markdown twin (layouts/landing.html): every section in the page's order, every
       word from the page's content file. The sources live here only, never on the page (Ben, 2026-11-08).
       (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $o := site.BaseURL | strings.TrimSuffix "/" }}{{ $names := $P.names -}}
# {{ $m.h1 }}

{{ $P.sub }}

{{ $P.button }}: {{ $o }}/schedule-demo?business=<your firm's name>&industry={{ $P.book.industry | urlquery }}&topic={{ $P.book.topic | urlquery }}

{{ $P.prices }}

Works with: {{ delimit $P.systems ", " }}.

## {{ $P.orbit_h }}
{{ range $P.team }}
- {{ partial "w/name.html" (dict "id" . "names" $names) }}
{{- end }}

## {{ $P.bands_h }}
{{ range $P.bands }}
### {{ .h }}

{{ .p }}
{{ end }}
## {{ $P.frame_h }}
{{ range $P.frame }}
{{ .ask }}

{{ .reply }}
{{ range .steps }}
- {{ . }}
{{- end }}
{{ end }}
## {{ $P.lines_h }}
{{ range $P.lines }}
- {{ . }}
{{- end }}

## {{ $P.offer_h }}

{{ $P.offer_p }}
{{ range $P.options }}
- **{{ .h }}:** {{ .p }}
{{- end }}

{{ $P.guarantee }}

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
