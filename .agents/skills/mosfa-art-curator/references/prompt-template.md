# MOSFA Generation Director

For full acquisition requests, compress the curatorial development pass internally, then proceed to candidate generation, critique, revision when needed, contact sheet review, and user approval. Only stop after a written prompt when the user explicitly asks for ideation, prompt drafting, or no image generation.

## Development Pass

### 1. Intent Interpretation

Expand the user's idea into a clear artistic direction:

- Identify the referenced artwork, artist, or movement.
- Determine the museum wing.
- Clarify the conceptual angle of the reinterpretation.
- State what must remain recognizable.

### 2. Compositional Planning

Analyze the original composition or movement:

- Primary focal point.
- Secondary focal points.
- Visual hierarchy.
- Major geometry, balance, framing, and gesture.
- Lighting and color logic.
- Elements that must be preserved for fidelity.

### 3. Shrimp-Folk Integration Strategy

Plan how shrimp-folk aesthetics enter the work:

- Anatomy, silhouette, posture, antennae, shell segmentation, claws, eyes.
- How manipulator claws or hybrid hands affect gesture.
- Where crustacean influence should be explicit.
- Where it should remain subtle.
- How culture, costume, architecture, ritual, or tools support the world.

Avoid overloading compositions with unnecessary shrimp motifs.

### 4. Masterpiece Potential

Evaluate the concept before generation:

- Does it have a singular visual idea?
- Does the source structure survive?
- Does shrimp-folk integration feel inevitable?
- Is there emotional or conceptual weight?
- Is the concept restrained?

If the concept is weak, critique it honestly and suggest improvements before generation.

### 5. Prompt Crafting

Write a detailed image-generation prompt that includes:

- Subject and source reference.
- Composition and camera/framing.
- Lighting.
- Style references and period language.
- Color palette.
- Texture, surface, brushwork, print quality, or materiality.
- Shrimp-folk anatomical guidance.
- Cultural or symbolic details.
- Mood and atmosphere.
- Negative constraints: no humans, no food joke, no shrimp pasted onto human bodies.

For physical cultural objects and archaeological accessions:

- Prompt them as real museum objects first: single focal artifact, conservation lighting, plinth or archival support, and inspectable material construction.
- Specify how the object fits shrimp-folk anatomy or civic use instead of relying on decorative shrimp motifs.
- Prefer abstract tide, claw, molt, pearl, knot, and current notation over repeated literal shrimp drawings unless figural imagery is curatorially necessary.
- Guard against human-object defaults by naming the construction logic that makes the object non-human: antenna clearance, claw-friendly grips, shell hinges, current-resistant textiles, exoskeleton care, or water-current acoustics.
- Avoid fantasy treasure, magical glow, souvenir styling, and generic human ceremonial forms.

For New Atlantis Times or other civic newspaper accessions:

- Prompt the page as a photographed physical newsprint artifact, not a flat layout mockup.
- Specify an ornate engraved civic masthead for The New Atlantis Times, with custom high-contrast serif lettering, swashes, hairlines, ink spread, and imperfect letterpress texture.
- Use period newspaper serif or slab-serif display type for headlines and classic newspaper serif type for subheads; avoid modern UI fonts, geometric sans-serif defaults, clean vector edges, and computer-perfect alignment.
- Keep stable newspaper conventions visible: dated folio line, low-tide edition, pearlmark price line, standing motto, halftone press photograph, shell-script body columns, narrow column rules, and aged paper.
- If a newspaper appears inside a press photograph, style that nested paper as its own miniature newspaper with masthead, folio, motto, headline hierarchy, columns, and physical folds rather than as a plain sign.
- A gridded archival mat or conservation table can help the page feel like a handled museum object, but avoid incidental measuring equipment around the page, including rulers, numbered cutting mats, metric scales, and calibration strips, unless the numbers are essential and can be checked manually.
- If generated numeric or ordered systems appear anyway, review them at full size before accessioning; crop, remove, or regenerate any malformed sequences rather than treating them as background texture.
- For nested newspaper images, define the chronology explicitly: e.g. an earlier low-tide extra held inside a later high-tide correction. Keep masthead, date, folio, motto, and layout conventions consistent across papers printed by the same institution on the same day.

For meta-modernist or process-embedded works:

- Treat visible prompt fragments, revision marks, accession language, or studio instructions as in-world formal material rather than external AI disclosure.
- Make commentary answer visible evidence in the image. If a label says "antenna drift," "borrowed hand," "blocked clearance," or "grid breach," the depicted work should visibly contain that exact problem.
- For audit labels over dark or detailed image areas, separate the mark language from the readable language: use red arrows, crop lines, or borders for curator presence, and pale callout boxes with dark type for the words.
- For dossier-style process plates, use a two-panel layout with a large artwork on one side and a formal museum text panel on the other. Keep the full prompt short enough to fit, typeset it as a numbered curatorial document, and make the artwork visibly execute or resist that prompt.

## Prompt Output Template

```markdown
Curatorial intent:
[One concise paragraph.]

Museum placement:
[Wing and likely categories.]

Composition plan:
[How the image should be structured.]

Shrimp-folk integration:
[How anatomy and culture enter the work.]

Masterpiece potential:
[Honest assessment and any changes needed.]

Generation prompt:
[Detailed prompt.]

Avoid:
- Humans.
- Food framing.
- Meme humor.
- Human bodies with shrimp parts attached.
- Generic imitation that loses the source composition.
```

## Candidate Production

For default acquisition mode:

- Generate more than one candidate when tool limits and time allow, usually two to four.
- Vary candidates by visual strategy, composition, or prompt emphasis rather than trivial wording.
- Keep candidates in `/scratch/` or another temporary path until the user approves a finalist.
- Assemble a labeled contact sheet when more than one candidate exists.
- Review candidates against `rubric.md` before recommending a finalist.
- If no candidate reaches Gallery or Masterpiece standard, revise the strongest candidate once with a narrow correction target before asking for approval.

## Immediate Generation Exception

If the user explicitly asks for immediate generation, compress the development pass internally and proceed, but still preserve the canon and negative constraints in the generated prompt.
