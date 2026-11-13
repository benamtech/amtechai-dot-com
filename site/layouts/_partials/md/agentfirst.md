{{- /* The Markdown twin of the agent-first home (layouts/agentfirst.html): every section in the page's order, every word
       from the page's content file. (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $o := site.BaseURL | strings.TrimSuffix "/" }}{{ $app := hugo.Data.w.app -}}
# {{ $m.h1 }}

{{ $P.hero.sub }}

{{ $P.answer }}

{{ $P.hero.label }}: {{ $app }}/start ({{ $P.hero.button }}). {{ $P.hero.free }}
{{ range $P.hero.chips }}
- [{{ . }}]({{ $app }}/start?business={{ . | urlquery }})
{{- end }}

## {{ $P.how.h }}

{{ $P.how.p }}
{{ range $P.how.items }}
### {{ .h }}

{{ .p }}
{{ end }}
### {{ $P.how.morning.h }}

{{ $P.how.morning.p }}

## {{ $P.tech.h }}
{{ range $P.tech.items }}
### {{ .h }}

{{ .p }}
{{ end }}
## {{ $P.examples.h }}

{{ $P.examples.p }}
{{ $ex := $P.examples }}{{ range $ex.cards }}
### {{ .name }}

{{ .s }} {{ $ex.seconds }}. {{ $ex.team_k }}: {{ .team }}. {{ $ex.job_k }}: {{ .job }}
{{ end }}
{{ $ex.note }}

## {{ $P.live.h }}

{{ $P.live.p }} {{ $P.live.source }} [{{ $P.live.link_text }}]({{ $o }}{{ $P.live.link }})

## {{ $P.for.h }}

{{ $P.for.p }}
{{ range $P.for.cols }}
- **{{ .h }}:** {{ .p }}
{{- end }}

[{{ $P.for.link_text }}]({{ $o }}{{ $P.for.link }})

## {{ $P.price.h }}
{{ range $P.price.cols }}
- **{{ .h }}:** {{ .big }} {{ with .placeholder }}{{ . }} {{ end }}{{ .p }}
{{- end }}

## {{ $P.questions_h }}
{{ range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
## {{ $P.close.h }}

{{ $P.close.p }} {{ $P.close.talk }} [{{ $P.close.talk_link }}]({{ $o }}/schedule-demo)

## Sources
{{ range $i, $x := $P.sources }}
{{ add $i 1 }}. {{ $x }}
{{- end }}
