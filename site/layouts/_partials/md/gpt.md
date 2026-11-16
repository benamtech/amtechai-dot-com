{{- /* The body of a ChatGPT page's Markdown twin (layouts/gpt.html, gala 2026-11-16): every section in the page's order,
       every word from the page's content file or data/w.json `gpt`, links absolute. (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $W := hugo.Data.w.gpt }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
{{- $abs := `](/` }}{{ $absTo := printf "](%s/" $o -}}
# {{ $m.h1 }}

{{ $P.answer }}

**{{ $W.labels.check_btn }}:** {{ $W.labels.check_action }}?name=<business name>&town=<city>&state=<two-letter state>&trade={{ with $P.check }}{{ .trade }}{{ else }}<trade>{{ end }}
{{ with $P.mock }}
> **{{ .q }}** ({{ .k }})
>
> {{ .intro }}
{{- range $i, $n := .names }}
> {{ add $i 1 }}. {{ $n.n }}: {{ $n.meta }}
{{- end }}
{{- with .you }}
>
> {{ . }}: {{ $.mock.verdict }}
{{- end }}
{{ end }}
{{- with $P.outcomes }}
## {{ $P.outcomes_h }}
{{ range . }}
### {{ .h }}

{{ .k }}. {{ .p }}{{ with .link }} [{{ .label }}]({{ if hasPrefix .href "/" }}{{ $o }}{{ end }}{{ .href }}){{ end }}
{{ end }}
{{- end }}
{{- range $P.blocks }}
## {{ .h }}
{{ range .p }}
{{ replace . $abs $absTo }}
{{ end }}
{{- with .list }}
{{ range . }}- {{ replace . $abs $absTo }}
{{ end }}{{ end }}
{{- with .ol }}
{{ range $i, $x := . }}{{ add $i 1 }}. {{ replace $x $abs $absTo }}
{{ end }}{{ end }}
{{- with .table }}
| {{ delimit .cols " | " }} |
|{{ range .cols }} --- |{{ end }}
{{ range .rows }}| {{ delimit . " | " }} |
{{ end }}{{ end }}
{{- with .after }}
{{ replace . $abs $absTo }}
{{ end }}
{{- with .link }}
[{{ .label }}]({{ if hasPrefix .href "/" }}{{ $o }}{{ end }}{{ .href }})
{{ end }}
{{- end }}
{{- $offer := $P.offer | default $W.offer }}
## {{ $offer.h }}

{{ $offer.p }}
{{ range $i, $s := $offer.steps }}
{{ add $i 1 }}. **{{ $s.h }}** ({{ $s.k }}). {{ $s.p }}
{{- end }}

{{ $W.labels.book }}: {{ $o }}{{ $W.labels.book_href }}. {{ $W.labels.phone_line }} {{ $W.labels.phone }}.
{{ with $P.addon }}
### {{ .h }}

{{ .k }}. {{ .p }}{{ with .link }} [{{ .label }}]({{ if hasPrefix .href "/" }}{{ $o }}{{ end }}{{ .href }}){{ end }}
{{ end }}
{{- $lad := $P.ladder | default $W.ladder }}
## {{ $lad.h }}

{{ $lad.p }}
{{ range $lad.items }}
- **{{ .h }}** ({{ .price }}). {{ .p }} [{{ .label }}]({{ if hasPrefix .href "/" }}{{ $o }}{{ end }}{{ .href }})
{{- end }}

## {{ $W.four.h }}

{{ $W.four.p }}
{{ range $W.four.items }}
- [{{ .h }}]({{ $o }}{{ .href }}): {{ .p }}
{{- end }}

## {{ $W.niches.h }}
{{ range $W.niches.items }}
- [{{ .label }}]({{ $o }}{{ .href }}): {{ .line }}
{{- end }}

## {{ $P.questions_h | default $W.labels.questions_h }}
{{ range $P.questions }}
### {{ .q }}

{{ replace .a $abs $absTo }}
{{ end }}
## {{ $P.closing_h }}

{{ $P.closing_sub }} {{ $W.labels.check_action }}
