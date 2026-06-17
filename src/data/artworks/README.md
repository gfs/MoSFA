# Artwork Records

Artwork accessions live in this directory as one YAML file per artwork:

Use `npm run new:artwork -- --slug example-title` to scaffold an unpublished
draft record, then fill the metadata after the user approves the final image.

```yaml
title: Example Title
slug: example-title
artistReference: Artist or movement
sourceWork: Source work or study type
yearOrPeriod: Period translation
era: Museum Wing
categories:
  - Category
image: artworks/example-title.png
imageAlt: Plain visual description.
summary: One-sentence curatorial argument.
description: One or two public-facing label sentences.
featured: false
published: true
```

Name files after the slug, such as `example-title.yaml`. Keep one accession per
file so broad curatorial audits can skim the collection and parallel branches do
not fight over one shared data file.

Run `npm run validate:artworks` before committing. The validator checks required
fields, duplicate slugs, filename / slug agreement, known museum wings, and
published image existence.
