# Artwork Drop-In Records

Add new artwork accessions in this directory as one YAML file per artwork:

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

Name files after the slug, such as `example-title.yaml`. New accession tasks should create a new file here instead of inserting records into `src/data/artworks.yaml`; that keeps parallel threads from fighting over the same shared hunk.

Use `src/data/artworks.yaml` only when revising records that already live there or when doing a deliberate data migration.

Run `npm run validate:artworks` before committing. The validator checks required
fields, duplicate slugs, filename / slug agreement, known museum wings, and
published image existence.
