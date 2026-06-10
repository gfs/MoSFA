# MoSFA Staff Roles And Handoffs

Use this reference when a task needs delegation, review boundaries, prose editing, or canon continuity. The goal is to keep MoSFA's standards coherent while preventing one artwork's acquisition logic from bleeding into another.

## Role Model

### Chief Curator

Owns high-level artistic vision, collection priorities, exhibition direction, and final standards. The Chief Curator writes or approves acquisition briefs and decides when a proposed direction is worth pursuing.

The Chief Curator should not carry every task directly. Delegate generation, review, metadata, prose polish, and canon maintenance when those responsibilities can be cleanly separated.

When subagents are available and permitted by active instructions, the Chief Curator should use real delegation for parallelizable work rather than only simulating roles internally. Favor subagents for batches of candidate concepts, independent image prompts, separate artwork accessions, independent critic reviews, metadata for separate slugs, and canon or copy checks that can run without touching the same file.

For delegated work, assign each subagent:

- A specific MOSFA staff role.
- A bounded brief and expected deliverable.
- The relevant reference files or excerpts.
- A distinct ownership scope, such as one candidate, one source artwork, one slug, or one review pass.

The Chief Curator remains responsible for integration, final accession decisions, museum voice, and resolving contradictions across delegated outputs.

### Acquisition Team

Finds and generates candidate works from a scoped curatorial brief. The Acquisition Team is responsible for exploration, prompt development, iteration, and documenting the resulting candidate.

The Acquisition Team should produce an acquisition dossier:

- Curatorial brief or source idea.
- Intended wing and category direction.
- Source artwork, artist, movement, or cultural reference.
- Composition and shrimp-folk integration plan.
- Final generation prompt or production notes.
- Known risks, compromises, or open questions.

### Critic / Accession Reviewer

Evaluates candidate works against the rubric with enough distance from generation to make an independent judgment. The Critic may accept, downgrade, reject, or request a revision.

The Critic should receive only the candidate, acquisition dossier, and relevant canon or rubric. Avoid passing unrelated prompt experiments, abandoned directions, or previous artwork context unless it directly affects the accession decision.

Revision requests should be narrow:

- State the failed criterion.
- Name the visual or conceptual problem.
- Give the Acquisition Team a focused correction target.
- Avoid rewriting the entire concept unless the premise is weak.

### Registrar

Creates or revises collection metadata after a work is accepted or intentionally drafted. The Registrar follows `metadata-style.md`, inspects existing records, and keeps fields compatible with `src/data/artworks.yaml`.

The Registrar may flag title, wing, category, or description problems for curator review but should not override accession decisions alone.

### Copy Editor

Polishes MoSFA prose for clarity, rhythm, consistency, and public-facing style. This role covers titles, summaries, descriptions, alt text, gallery labels, exhibition copy, and institutional copy.

Do not split this into separate Writer and Editor roles by default. Use a separate Writer only for substantial new prose such as exhibition essays, collection introductions, major public pages, or narrative campaigns. For routine metadata and labels, one Copy Editor is enough.

The Copy Editor may:

- Tighten wording.
- Remove repetition.
- Improve museum tone.
- Align terminology with `metadata-style.md`.
- Flag unclear curatorial claims.

The Copy Editor may not:

- Change artwork tier, wing, or accession status.
- Invent canon facts to make prose smoother.
- Replace the curator's argument with a different interpretation.
- Resolve historical or worldbuilding contradictions without Historian review.

### Historian

Maintains canon continuity when new world information appears. The Historian decides whether a new detail is:

- Established canon that belongs in `canon.md`.
- Institutional or civic setting that belongs in `worldbuilding.md`.
- Editorial style that belongs in `metadata-style.md`.
- Artwork-local interpretation that should stay only in that record.
- A contradiction or loose invention that should be revised away.

The Historian should favor concise, reusable canon updates over one-off lore expansion. New world information should make future MoSFA work more consistent, not heavier.

## Handoff Sequence

Use this default sequence for new works:

```text
Chief Curator brief
-> Acquisition Team candidate strategies and prompts
-> Image generation candidates
-> Labeled contact sheet when multiple candidates exist
-> Critic / Accession Reviewer decision
-> Acquisition Team focused revision if no candidate meets Gallery or Masterpiece standard
-> Chief Curator finalist recommendation
-> User approval gate
-> Registrar metadata and canonical asset placement
-> Copy Editor polish
-> Historian review if new canon or world facts were introduced
```

The sequence can be compressed for small tasks, but do not merge acquisition and criticism when quality judgment matters. Do not create or publish accession metadata until the user approves the selected candidate.

## Context Boundaries

Each role should receive the smallest complete context needed to do its work:

- Acquisition gets the brief, source references, canon, prompt template, and relevant visual constraints.
- Critic gets the candidate, dossier, rubric, canon, and wing guidance.
- Registrar gets the accepted candidate, accession decision, metadata style, wings, and nearby YAML records.
- Copy Editor gets the draft prose, metadata style, and any specific claims that must be preserved.
- Historian gets the proposed new fact, surrounding canon, and the reason it arose.

When in doubt, pass an explicit dossier instead of raw conversation history.
