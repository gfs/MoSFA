# MoSFA Metadata Style

Use this reference when writing or revising website metadata for artwork data.

Always inspect nearby existing records before editing metadata. Preserve established spellings for eras, categories, and image paths.

## Parallel Accession Workflow

For new artwork accessions, create one YAML file per artwork in
`src/data/artworks/`, named after the accession slug, such as
`src/data/artworks/shrimp-with-a-pearl-earring.yaml`. Each drop-in file may
contain a single artwork record without a top-level list marker.

Do not create shared multi-record artwork files. Collection, gallery, era, and
category ordering is handled by page code and metadata fields rather than YAML
position.


## Museum Name Style

Use **MoSFA** as the canonical short-form styling in curator-facing guidance and editorial copy.

- First mention in formal prose: **Museum of Shrimp-Folk Art (MoSFA)**.
- Later mentions: **MoSFA**.
- Keep the full name when legal/institutional clarity is needed.

Avoid legacy all-caps **MOSFA** in new or revised style-guide text unless reproducing historical source material verbatim.

## Required Fields

Each artwork record should include:

```yaml
title:
slug:
artistReference:
sourceWork:
yearOrPeriod:
era:
categories:
  -
image:
imageAlt:
summary:
description:
featured: false
published: true
```

`featuredRank` is optional and should only be used for homepage-featured works.

`generation` is optional and private. Use it to keep artwork-generation provenance
with the accession record without exposing it on public pages. Public pages should
only render this field if the prompt history is intentionally part of the artwork.

## Field Guidance

- `title`: Museum-ready title. It may echo the source work and can carry a quiet in-world wink, as with "The Metamoltosis," but should still sound like an accession rather than a joke explained to the visitor.
- `slug`: Lowercase kebab-case, stable, descriptive.
- `artistReference`: Artist, movement, school, or historical style being translated.
- `sourceWork`: Specific source work when relevant, otherwise a movement or study type.
- `yearOrPeriod`: Source date or broad period plus translation context.
- `era`: One museum wing.
- `categories`: Narrower tags. Use existing categories when possible.
- `image`: Public path under `/images/artworks/`.
- `imageAlt`: Plain visual description. Include style and composition. Do not over-explain the concept.
- `summary`: One sentence that makes a curatorial argument.
- `description`: One or two sentences for the detail page. Keep public labels focused on what the work does, not on internal tier language.
- `featured`: Use `true` only when intentionally placing on the homepage.
- `published`: Use `true` for live accessions and `false` for drafts.
- `generation`: Private prompt provenance and iteration history. Prefer `successfulPrompt`, `selectionNotes`, `criticDecision`, `variations`, and `lessons` so future contributors can reuse what worked without maintaining a separate source of truth. Include `contactSheet` only when the review sheet is intentionally retained somewhere durable; omit scratch-only contact sheets from committed metadata.

## Style

Use serious museum language with a little imaginative specificity. Prefer:

- "translation" over "parody."
- "accession" over "upload."
- "shrimp-folk anatomy" over "shrimp person."
- "source structure" over "reference picture."
- "worldbuilding" only when it describes visible cultural logic.

Avoid:

- Food jokes.
- Meme phrasing.
- Claims that overstate quality without evidence.
- Repeating "shrimp-folk" in every sentence.
- Repeating the same summary formula across accessions, especially "A [form] where [elements]..."
- Placeholder title formulas such as "Artist + Shrimp + Form." Prefer a title that could belong to the work inside the collection, with the source relationship carried by `artistReference` and `sourceWork`.
- Treating the work as merely cute or funny.
- Explaining the joke, inversion, or generation premise in public copy. Titles may contain a subtle wink, but summaries and descriptions should stay straight-faced and in universe; if they echo the wink at all, they should do so quietly rather than announcing the premise.
- Public-facing tier labels such as "Gallery Tier" or "Masterpiece Tier." Reserve collection rankings for curatorial review notes unless the user specifically asks to expose them.
- Public-facing process language about generation, regeneration, variants, prompt attempts, image fixes, or replacement history. Website copy should treat the displayed work as the canonical accession unless the artwork itself is explicitly meta-commentary.

## Good Metadata Pattern

```yaml
title: Shrimp with a Pearl Earring
slug: shrimp-with-a-pearl-earring
artistReference: Johannes Vermeer
sourceWork: Girl with a Pearl Earring
yearOrPeriod: c. 1665 Dutch Golden Age translation
era: Baroque & Dramatic Realism
categories:
  - Dutch Golden Age Portraiture
  - Chiaroscuro Ceremonies
image: /images/artworks/shrimp-with-a-pearl-earring.jpeg
imageAlt: A Vermeer-like shrimp-folk portrait with a blue and gold head wrap, dark background, turned gaze, and luminous pearl earring.
summary: Shell, gaze, cloth, and pearl resolve into one intimate Dutch Golden Age stillness.
description: The portrait preserves Vermeer's dark ground, turned pose, luminous earring, and hushed psychological presence while translating the sitter into coherent shrimp-folk anatomy.
featured: true
featuredRank: 4
published: true
generation:
  successfulPrompt: |
    Detailed image-generation prompt that produced the canonical accession.
  selectionNotes:
    - Candidate B was approved by the user after contact sheet review.
  criticDecision: Gallery
  variations:
    - result: rejected
      reason: Anatomy became decorative instead of structural.
      prompt: |
        Earlier prompt variation retained for future learning.
  lessons:
    - Name the source composition before adding shrimp-folk details.
    - Preserve museum lighting, material realism, and coherent anatomy.
```
