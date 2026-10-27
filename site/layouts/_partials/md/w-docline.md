{{- /* One N3 document (w/doc.html) as a line of the Markdown twin: its title, where it came from and its words, with
       the column labels the page uses (data/frame.json). No money figure, as on the page. (the doc) */ -}}
{{- $d := . }}{{ $F := hugo.Data.frame -}}
*{{ $d.title }}*{{ with $d.meta }} ({{ . }}){{ end }}:
{{- if eq $d.kind "estimate" }}{{ range $d.rows }} {{ .item }}{{ with .qty }}, {{ . }}{{ end }} ({{ .unit }});{{ end }} {{ $F.price }}: {{ $d.priced }}.
{{- else if eq $d.kind "email" }} {{ $F.to }}: {{ $d.to }}. {{ $F.subject }}: {{ $d.subject }}. {{ delimit $d.body " " }}
{{- else if eq $d.kind "invoice" }} {{ $F.to }}: {{ $d.to }}.{{ range $d.rows }} {{ .item }}: {{ .note }}.{{ end }} {{ $F.due }}: {{ $d.due }}.
{{- else if eq $d.kind "page" }} {{ $d.url }}: {{ $d.h }} {{ $d.p }}{{ with $d.rows }} ({{ delimit . " " }}){{ end }}
{{- else if eq $d.kind "sheet" }} {{ delimit $d.cols ", " }}.{{ range $d.rows }} {{ delimit . ", " }}.{{ end }}
{{- else if eq $d.kind "report" }}{{ range $d.rows }} {{ .label }}: {{ .value }}.{{ end }}
{{- end }}{{ with $d.foot }} {{ . }}{{ end }}
