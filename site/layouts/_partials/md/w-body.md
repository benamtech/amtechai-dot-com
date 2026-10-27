{{- /* The body of a new page's Markdown twin and OKF concept (the same document): every heading the HTML carries, in
       its order, with the words under each, from the page's content file. Links are absolute URLs, so the document
       reads the same at /<route>.md and in /okf/. (dict "p" page "m" (partial "w/meta.html" page)) */ -}}
{{- $p := .p }}{{ $m := .m }}{{ $P := $p.Params }}{{ $W := hugo.Data.w }}{{ $o := site.BaseURL | strings.TrimSuffix "/" -}}
{{- $names := $P.names -}}
# {{ $m.h1 }}

{{ with $P.sub }}{{ . }}{{ end }}
{{- if $p.IsHome }}

## {{ $P.start_h }}

{{ $P.start_sub }} Start with your business's name: {{ $o }}/start?business=<your business's name>

{{ $W.prices }}

## {{ $P.industries_h }}

{{ $P.industries_sub }}
{{ range (where site.RegularPages "Section" "industries").ByWeight }}
### {{ .Params.label }}

{{ .Params.card_line }} [The {{ lower .Params.label }} page]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }})
{{ end }}

## {{ $P.services_h }}

{{ $P.services_sub }}
{{ range $P.services_featured }}{{ $s := index (where hugo.Data.services "slug" .) 0 }}
### {{ $s.name }}

{{ $s.instead }}. [{{ $s.name }}]({{ $o }}/services#{{ $s.slug }})
{{ end }}

[{{ $P.services_more }}]({{ $o }}/services)

## {{ $P.how_h }}
{{ range $i, $s := $P.how }}
### {{ add $i 1 }}. {{ $s.h }}

{{ $s.p }}
{{ end }}
{{- else if and (eq $p.Section "services") $p.IsPage }}{{ $slug := path.Base $p.File.Dir }}{{ $d := index (where hugo.Data.services "slug" $slug) 0 }}{{ $sys := $d.connects }}{{ range $P.systems_more }}{{ $sys = $sys | append . }}{{ end }}

Start it with your business's name: {{ $o }}/start?business=<your business's name>&config={{ $slug }}

{{ $W.prices }}

## {{ $P.manifest_h }}

### 1. The team

- **Your AI employee:** {{ $P.employee_does }}
{{- range $P.team_detail }}
- **{{ partial "w/name.html" (dict "id" .id "names" $names) }}:** {{ .does }}
{{- end }}

### 2. Connects to

{{ delimit $sys ", " }}.{{ with $P.connects_note }} {{ . }}{{ end }}

### 3. Routines
{{ range $P.routines }}
- {{ . }}
{{- end }}

### 4. First jobs
{{ range $i, $j := $P.first_jobs }}
{{ add $i 1 }}. {{ $j }}
{{- end }}

## {{ $P.for_h }}

{{ $P.for_sub }}
{{ range $P.industries }}{{ $ip := site.GetPage (printf "/industries/%s" .slug) }}
- {{ if $ip }}[{{ $ip.Params.label }}]({{ $o }}{{ strings.TrimSuffix "/" $ip.RelPermalink }}){{ else }}{{ .label }}{{ end }}: {{ .line }}
{{- end }}

## {{ $P.questions_h }}
{{ range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
{{- range $P.asked }}
- [{{ .text }}]({{ $o }}{{ .href }})
{{- end }}
{{- else if and (eq $p.Section "questions") $p.IsPage }}

{{ $P.yes }} {{ $P.answer }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

{{ $W.prices }}

## {{ $P.steps_h }}
{{ range $i, $s := $P.steps }}
### {{ add $i 1 }}. {{ $s.h }}

{{ $s.p }}
{{ end }}
## {{ $P.team_h }}

### Your AI employee

{{ $P.employee_does }}
{{ range $P.team_detail }}
### {{ partial "w/name.html" (dict "id" .id "names" $names) }}

{{ .does }}
{{ end }}
- **Connects to:** {{ delimit $P.systems ", " }}

## {{ $P.questions_h }}
{{ with $P.questions_sub }}
{{ . }}
{{ end }}
{{- range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
## {{ $P.related_h }}
{{ range $P.related }}
- [{{ .text }}]({{ $o }}{{ .href }}){{ with .why }}: {{ . }}{{ end }}
{{- end }}
{{- else if and (eq $p.Section "questions") $p.IsSection }}

{{ $W.prices }}
{{ range $p.RegularPages.ByWeight }}
## {{ .Params.h1 }}

{{ .Params.yes }} {{ .Params.card_line }} [The answer]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}) ([Markdown]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}.md))
{{ end }}
{{- else if eq $p.Section "services" }}

Start any one at {{ $o }}/start?config=<service>. {{ $W.prices }}
{{ range hugo.Data.services }}
## {{ .name }}

{{ .for }}.{{ with .instead }} {{ . }}.{{ end }} Connects to {{ delimit .connects ", " }}. Group: {{ .group }}. Start it: {{ $o }}/start?config={{ .slug }}
{{ end }}
{{- else if and (eq $p.Section "customers") $p.IsPage }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

{{ $W.prices }}

[{{ $P.site_link.text }}]({{ $P.site_link.url }})

## {{ $P.facts_h }}
{{ range $P.facts }}
- **{{ .k }}:** {{ .v }}
{{- end }}
{{ range $P.figures }}
- **{{ .big }}** {{ .line }} ({{ .when }})
{{- end }}

## {{ $P.gallery_h }}

{{ $P.gallery_sub }}
{{ range $P.gallery }}
### {{ .h }}
{{ range .shots }}
- [{{ .cap }}]({{ $o }}{{ .src }}.webp)
{{- end }}
{{ end }}
{{- if or $P.chatgpt.answer $P.chatgpt.src $P.google_search.src }}
### {{ $P.answers_h }}
{{ with $P.chatgpt }}{{ if or .answer .src }}
{{ .cap }}. Asked: "{{ .prompt }}"{{ with .answer }} Answer: {{ . }}{{ end }}
{{ end }}{{ end }}
{{- with $P.google_search }}{{ if .src }}
- [{{ .cap }}]({{ $o }}{{ .src }})
{{ end }}{{ end }}
{{- end }}
## {{ $P.did_h }}

{{ $P.did_sub }}
{{ range $i, $d := $P.did }}
### {{ add $i 1 }}. {{ $d.h }}

{{ $d.p }}
{{ end }}
## {{ $P.timeline_h }}
{{ range $P.timeline }}
### {{ .h }}

{{ .when }}: {{ .p }}
{{ end }}
## {{ $P.week_h }}

{{ $P.week_sub }}
{{ range $P.week }}
- **{{ .day }}:** {{ delimit .lines "; " }}.
{{- end }}

## {{ $P.words_h }}
{{ range $P.words }}
> "{{ .q }}" ({{ .who }}, {{ .when }})
{{ end }}
{{- with $P.josue }}{{ if .q }}
> "{{ .q }}" ({{ .who }}{{ with .when }}, {{ . }}{{ end }})
{{ end }}{{ end }}
## {{ $P.how_h }}

{{ $P.how_p }} [{{ $P.how_link.text }}]({{ $o }}{{ $P.how_link.url }})

## {{ $P.trades_h }}

{{ $P.trades_sub }}
{{ range $P.trades }}{{ $ip := site.GetPage (printf "/industries/%s" .slug) }}
- [{{ $ip.Params.label }}]({{ $o }}{{ strings.TrimSuffix "/" $ip.RelPermalink }}): {{ .line }}
{{- end }}

## {{ $P.start2_h }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

## {{ $P.ask_h }}

{{ $P.ask_sub }} "{{ $P.ask_prompt }}"
{{- else if and (eq $p.Section "customers") $p.IsSection }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

{{ $W.prices }}

## {{ $P.proof_h }}

{{ $P.proof }}
{{ range hugo.Data.w.proof2.figures }}
- **{{ .big }}** {{ .line }} ({{ .when }})
{{- end }}

[{{ hugo.Data.w.proof2.story_text }}]({{ $o }}{{ hugo.Data.w.proof2.story }}) · [{{ hugo.Data.w.proof2.site_text }}]({{ $W.proof.link }})
{{ range $p.RegularPages.ByWeight }}
## {{ .Params.label }}

{{ .Description }} [The story]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}) ([Markdown]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}.md))
{{ end }}
## {{ $P.start2_h }}

Start with your business's name: {{ $o }}/start?business=<your business's name>

## {{ $P.next_h }}
{{ range $P.next }}
- [{{ .label }}]({{ $o }}{{ .url }}): {{ .line }}
{{- end }}
{{- else if $p.IsSection }}

{{ $W.prices }}
{{ range $p.RegularPages.ByWeight }}
## {{ .Params.label }}

{{ .Params.card_line }} Connects to {{ delimit .Params.systems ", " }}. [{{ .Params.label }}: the page]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}) ([Markdown]({{ $o }}{{ strings.TrimSuffix "/" .RelPermalink }}.md))
{{ end }}
{{- else }}

Start with your business's name: {{ $o }}/start?business=<your business's name>{{ with $P.config }}&industry={{ . }}{{ end }}

{{ $W.prices }}
{{- if eq $p.Section "departments" }}

## {{ $P.proof_h }}

{{ $P.proof }} [{{ $W.proof.link_text }}]({{ $P.proof_link | default $W.proof.link }})
{{- end }}

- **The team:** {{ $t := slice }}{{ range $P.team }}{{ $t = $t | append (partial "w/name.html" (dict "id" . "names" $names)) }}{{ end }}{{ delimit $t ", " }}
- **Connects to:** {{ delimit $P.systems ", " }}

## {{ $P.team_h | default (cond (eq $p.Section "industries") (printf "The team for %s" (lower ($P.label | default ""))) "The team") }}

### Your AI employee

{{ $P.employee_does | default "Learns your business, makes the team, and answers to you. Every teammate's work comes back through your employee, in one conversation." }}
{{ range $P.team_detail }}
### {{ partial "w/name.html" (dict "id" .id "names" $names) }}

{{ .does }}
{{ end }}
## First jobs
{{ range $i, $j := $P.first_jobs }}
{{ add $i 1 }}. {{ $j }}
{{- end }}

## Routines
{{ range $P.routines }}
- {{ . }}
{{- end }}
{{- if eq $p.Section "departments" }}

## Connects to

{{ delimit $P.systems ", " }}
{{- end }}

## {{ $P.services_h | default (cond (eq $p.Section "departments") "Services that use this department" "Made for your kind of business") }}
{{ range $P.services }}{{ $s := index (where hugo.Data.services "slug" .) 0 }}
### {{ $s.name }}

{{ $s.instead }}. For {{ lower (substr $s.for 0 1) }}{{ substr $s.for 1 }}. [{{ $s.name }}]({{ $o }}/services#{{ $s.slug }})
{{ end }}

## {{ $P.questions_h }}
{{ range $P.questions }}
### {{ .q }}

{{ .a }}
{{ end }}
{{- end }}
{{- if $P.proof_p }}

## {{ $P.proof_h }}

{{ $P.proof_p }} [{{ $W.proof.link_text }}]({{ $W.proof.link }})
{{- else if not (eq $p.Section "departments" "services" "questions" "customers") }}

## {{ $W.proof.h }}

{{ $W.proof.p }} [{{ $W.proof.link_text }}]({{ $W.proof.link }})
{{- end }}

## {{ $P.closing_h | default $W.closing_h }}

{{ $P.closing_sub | default $W.late }}

## Sources
{{ range $i, $x := $W.sources }}
{{ add $i 1 }}. {{ $x }}
{{- end }}
{{- range $i, $x := $P.sources }}
{{ add $i 1 (len $W.sources) }}. {{ $x }}
{{- end }}
{{ with $P.reviewed }}
Written by an AMTECH AI employee from AMTECH's records; reviewed by {{ .by }}, {{ (time .date).Format "2 January 2006" }}.
{{ end }}
