# MoSFA Curatorial Skill

The original curatorial instructions have been restructured as a project-local Codex skill package:

`.agents/skills/mosfa-art-curator/`

Use this package when generating, evaluating, curating, accessioning, or writing metadata for Museum of Shrimp-Folk Art (MoSFA) artworks.

## Structure

- `SKILL.md`: Trigger metadata and the core workflow.
- `references/canon.md`: Shrimp-folk anatomy, world rules, artistic fidelity, tone, and flexibility.
- `references/wings.md`: Museum wings, categories, and placement guidance.
- `references/rubric.md`: Masterpiece, Gallery, and Reject/Revise evaluation criteria.
- `references/prompt-template.md`: Generation Director workflow and prompt structure.
- `references/metadata-style.md`: Accession metadata style for per-artwork YAML records in `src/data/artworks/`.

Keeping the skill under `.agents/skills/` makes it available with the repository without installing it into a user's global Codex skills directory.

## Continuous Improvement Policy

The MoSFA skill package should be actively improved during normal delivery work. It is **not frozen in time**.

When contributors discover stronger image-generation techniques, recurring consistency requirements, or broadly reusable lessons from curator guidance, they should update the corresponding skill references under `.agents/skills/mosfa-art-curator/` so future agents inherit those improvements.
