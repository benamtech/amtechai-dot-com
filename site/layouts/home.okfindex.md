{{- /* /okf/index.md, the knowledge bundle's root (OKF v0.2: frontmatter is exactly okf_version), and from the same pass:
       - every new indexable page's Markdown twin (/<route>.md, home /index.md) and bundle concept (/okf/<route>.md,
         home /okf/home.md): one document, md/w-doc.md, from the page's content file (lane SEARCH, 2026-10-27);
       - /okf/log.md: one line per concept under the date of its last change, newest first (OKF §9);
       - /content-hashes.json: each indexable page's visible-words hash and lastmod, which tools/indexnow.mjs compares
         with what it last submitted, so a deploy tells IndexNow only the pages whose words changed;
       - the reading pages' twins and concepts (w/reading.html: the articles hub, legal pages, contact; md/read-doc.md);
       - the concept files /okf/entities/<key>.md from data/concepts.yaml (a concept has no page of its own).
       Links are relative to the bundle's root, /okf/. */ -}}
{{- $articles := (where site.RegularPages "Section" "articles").ByDate.Reverse -}}
{{- $concepts := hugo.Data.concepts -}}
{{- range $key, $c := $concepts }}
  {{- $by := slice }}
  {{- range $k2, $c2 := $concepts }}{{ range $c2.related }}{{ if eq .key $key }}{{ $by = $by | append (dict "title" $c2.title "path" (printf "/entities/%s.md" $k2) "why" (printf "%s." $c2.type)) }}{{ end }}{{ end }}{{ end }}
  {{- range $articles }}{{ if in .Params.related $key }}{{ $by = $by | append (dict "title" .Title "path" (printf "/articles/%s.md" .File.ContentBaseName) "why" "Article.") }}{{ end }}{{ end }}
  {{- $md := partial "md/concept.md" (dict "key" $key "c" $c "concepts" $concepts "by" $by) }}
  {{- with (resources.FromString (printf "okf/entities/%s.md" $key) $md) }}{{ with .Publish }}{{ end }}{{ end }}
{{- end -}}
{{- $new := partial "w/pages.html" . -}}
{{- $log := slice }}{{ $hashes := dict -}}
{{- range $new }}
  {{- $m := partial "w/meta.html" . }}
  {{- $doc := partial "md/w-doc.md" (dict "p" . "m" $m) }}
  {{- with (resources.FromString (strings.TrimPrefix "/" $m.twin) $doc) }}{{ with .Publish }}{{ end }}{{ end }}
  {{- with (resources.FromString (printf "okf%s" $m.okf) $doc) }}{{ with .Publish }}{{ end }}{{ end }}
  {{- $body := partial "md/w-body.md" (dict "p" . "m" $m) }}
  {{- $hashes = merge $hashes (dict $m.url (dict "hash" (crypto.SHA256 (printf "%s\n%s\n%s" .Title .Description $body)) "lastmod" (cond $m.lastmod.IsZero "" ($m.lastmod.Format "2006-01-02")))) }}
  {{- if not $m.lastmod.IsZero }}{{ $log = $log | append (dict "date" ($m.lastmod.Format "2006-01-02") "title" $m.h1 "path" $m.okf) }}{{ end }}
{{- end }}
{{- $reading := partial "w/reading.html" . -}}
{{- range $reading }}
  {{- $m := partial "w/meta.html" . }}
  {{- $doc := partial "md/read-doc.md" (dict "p" . "m" $m) }}
  {{- with (resources.FromString (strings.TrimPrefix "/" $m.twin) $doc) }}{{ with .Publish }}{{ end }}{{ end }}
  {{- with (resources.FromString (printf "okf%s" $m.okf) $doc) }}{{ with .Publish }}{{ end }}{{ end }}
{{- end }}
{{- range partial "w/older.html" . }}
  {{- $u := printf "https://amtechai.com%s" (.Params.route | default (strings.TrimSuffix "/" .RelPermalink)) }}
  {{- $c := printf "---\ntype: \"Web Page\"\ntitle: %s\ndescription: %s\nresource: %s\nstatus: stable\n---\n# %s\n\n%s\n\nThe page: %s\n" (.Title | jsonify) (.Description | jsonify) ($u | jsonify) .Title .Description $u }}
  {{- if not (in $reading .) }}{{ with (resources.FromString (printf "okf/pages/%s.md" (path.Base $u)) $c) }}{{ with .Publish }}{{ end }}{{ end }}{{ end }}
  {{- /* Their words live in their layouts, not their content files: the hash is of the content file only. */}}
  {{- $t := partial "w/lastmod.html" . }}
  {{- $hashes = merge $hashes (dict $u (dict "hash" (crypto.SHA256 (printf "%s\n%s\n%s" .Title .Description .Plain)) "lastmod" (cond $t.IsZero "" ($t.Format "2006-01-02")))) }}
{{- end }}
{{- range $articles }}
  {{- $u := printf "https://amtechai.com/articles/%s" .File.ContentBaseName }}
  {{- $hashes = merge $hashes (dict $u (dict "hash" (crypto.SHA256 (printf "%s\n%s\n%s" .Title .Description .Plain)) "lastmod" (.Lastmod.Format "2006-01-02"))) }}
  {{- $log = $log | append (dict "date" (.Lastmod.Format "2006-01-02") "title" .Title "path" (printf "/articles/%s.md" .File.ContentBaseName)) }}
{{- end }}
{{- with (resources.FromString "content-hashes.json" ($hashes | jsonify (dict "indent" " "))) }}{{ with .Publish }}{{ end }}{{ end }}
{{- $lines := slice "# AMTECH knowledge bundle: update log" "" "Each concept under the date of its last change (the commit that last touched its content file), newest first." }}
{{- range $d := (sort (uniq (apply $log "index" "." "date")) "value" "desc") }}
  {{- $lines = $lines | append "" (printf "## %s" $d) "" }}
  {{- range where $log "date" $d }}{{ $lines = $lines | append (printf "* **Update** [%s](%s)" .title .path) }}{{ end }}
{{- end }}
{{- with (resources.FromString "okf/log.md" (delimit $lines "\n")) }}{{ with .Publish }}{{ end }}{{ end -}}
---
okf_version: "0.2"
---
# AMTECH AI Knowledge Bundle

AMTECH AI is a platform that gives a business AI employees: each connects itself to the systems the business already runs, makes its own team for the work, and improves as it works. Each page of https://amtechai.com is here as Markdown, with who wrote it, who reviewed it and when. Each page's plain Markdown twin is also at its own URL with `.md` added (home: https://amtechai.com/index.md). Changes: [log](/log.md).

## AMTECH
{{ range $new }}{{ if or .IsHome (and (eq .Section "services") .IsSection) }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Services
{{ range $new }}{{ if and (eq .Section "services") .IsPage }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Answers
{{ range $new }}{{ if eq .Section "questions" }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Industries
{{ range $new }}{{ if eq .Section "industries" }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Departments
{{ range $new }}{{ if eq .Section "departments" }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Customers
{{ range $new }}{{ if eq .Section "customers" }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Company
{{ range $new }}{{ if eq .Layout "company" }}{{ $m := partial "w/meta.html" . }}
* [{{ $m.h1 }}]({{ $m.okf }}) - {{ .Description }}
{{- end }}{{ end }}

## Articles
{{ range $articles }}
* [{{ .Title }}](/articles/{{ .File.ContentBaseName }}.md) - {{ .Description }}
{{- end }}


## Other pages
{{ range partial "w/older.html" . }}{{ $u := .Params.route | default (strings.TrimSuffix "/" .RelPermalink) }}
* [{{ .Title }}]({{ if in $reading . }}{{ $u }}.md{{ else }}/pages/{{ path.Base $u }}.md{{ end }}) - {{ .Description }}
{{- end }}

{{- with $concepts }}

## Concepts
{{ range $key, $c := . }}
* [{{ $c.title }}](/entities/{{ $key }}.md) - {{ $c.description }}
{{- end }}
{{- end }}
