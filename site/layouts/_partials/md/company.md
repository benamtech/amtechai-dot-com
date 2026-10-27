{{- /* The body of a company page's Markdown twin (/pricing, /about, /security; lane PAGES2): the hero, then each block in
       the page's order, then the close and the sources, every word from the page's content file or data/w.json.
       (dict "p" page "m" meta) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $W := hugo.Data.w }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
# {{ $m.h1 }}

{{ $P.sub }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

{{ $W.prices }}
{{- with $P.hero }}{{ if eq .kind "prices" }}

- **{{ $W.price2.free_h }}:** {{ .free }}
- **{{ $W.price2.custom_h }}:** {{ .custom }}
{{- end }}{{ end }}
{{- range $P.blocks }}
{{- if eq .kind "ways" }}

## {{ .h }}
{{ with .sub }}
{{ . }}
{{ end }}
{{- range .cols }}
### {{ .h }}

{{ .lead }}
{{ range .items }}
- {{ . }}
{{- end }}
{{ with .link }}
[{{ .text }}]({{ $o }}{{ .url }})
{{ end }}
{{- end }}
{{- else if eq .kind "points" }}

## {{ .h }}
{{ with .sub }}
{{ . }}
{{ end }}
{{- range $i, $r := .rows }}
### {{ $r.h }}

{{ $r.p }}
{{ end }}
{{- else if eq .kind "prose" }}

## {{ .h }}
{{ range .paras }}
{{ . }}
{{ end }}
{{- range .facts }}
- **{{ .k }}:** {{ .v }}
{{- end }}
{{- else if eq .kind "reach" }}

## {{ .h }}
{{ range .rows }}
### {{ .title }}

{{ .body }} [{{ .label }}]({{ cond (hasPrefix .to "/") (printf "%s%s" $o .to) (replaceRE `^app:` site.Params.app .to) }})
{{ end }}
{{- else if eq .kind "instead" }}

## {{ .h }}
{{ with .sub }}
{{ . }}
{{ end }}
| {{ $W.instead.today }} | {{ $W.instead.now }} |
| --- | --- |
{{- range .rows }}
| {{ .today }} | {{ .now }} |
{{- end }}
{{- else if eq .kind "yes" }}

## {{ .h }}
{{ with .sub }}
{{ . }}
{{ end }}
### {{ $W.yes.own_h }}
{{ range .own }}
- {{ . }}
{{- end }}

### {{ $W.yes.waits_h }}
{{ range .waits }}
- {{ . }}
{{- end }}
{{ range $W.yes.trust }}
- {{ . }}
{{- end }}
{{- else if eq .kind "proof" }}

## {{ .h }}

{{ .p }} [{{ $W.proof2.story_text }}]({{ $o }}{{ $W.proof2.story }})
{{- else if eq .kind "faq" }}

## {{ .h }}
{{ range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
{{- else if eq .kind "next" }}

## {{ .h }}
{{ range .rows }}
- [{{ .label }}]({{ $o }}{{ .url }}): {{ .line }}
{{- end }}
{{- end }}
{{- end }}

## {{ $P.closing_h }}

{{ $P.closing_sub }}

## Sources
{{ $n := 0 }}{{ if ne $P.site_sources false }}{{ range $W.sources }}{{ $n = add $n 1 }}
{{ $n }}. {{ . }}
{{- end }}{{ end }}{{ range $P.sources }}{{ $n = add $n 1 }}
{{ $n }}. {{ . }}
{{- end }}
{{ with $P.reviewed }}
Written by an AMTECH AI employee from AMTECH's records; reviewed by {{ .by }}, {{ (time .date).Format "2 January 2006" }}.
{{ end }}
