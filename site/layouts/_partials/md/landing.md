{{- /* The body of a landing page's Markdown twin (layouts/landing.html): every section in the page's order, every
       word from the page's content file or data/w.json. (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $W := hugo.Data.w }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
# {{ $m.h1 }}

{{ $P.sub }}

Start with your company's name: {{ $o }}/start?business=<your company's name>&industry=real-estate

{{ $P.prices }}

[{{ $P.call.text }}]({{ $o }}{{ $P.call.href }})

## {{ $P.systems_h }}

{{ delimit $P.systems ", " }}

## {{ $P.jobs_h }}

{{ $P.jobs_sub }}
{{ range $P.jobs }}
### {{ .h }}

{{ .p }}
{{ range .gets }}
- {{ . }}
{{- end }}
{{ end }}
## {{ $P.team_h }}

{{ $P.team_sub }}

## {{ $P.offer_h }}

{{ $P.offer_sub }}

### {{ $P.offer_includes_h }}
{{ range $P.offer_includes }}
- {{ . }}
{{- end }}

### {{ $P.offer_steps_h }}
{{ range $i, $s := $P.offer_steps }}
{{ add $i 1 }}. **{{ $s.h }}** {{ $s.p }}
{{- end }}

## {{ $P.scale_h }}

{{ $P.scale_sub }}
{{ range $P.scale }}
### {{ .h }}

{{ .p }}
{{ end }}
## {{ $P.yes_h }}
{{ range $P.yes }}
### {{ .h }}

{{ .p }}
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
