# MoSFA — Museum of Shrimp-Folk Art

This repository contains the website for the **Museum of Shrimp-Folk Art**
at **https://mosfa.art**.

MoSFA is also a surrealist worldbuilding and experimental art project. The site
presents the museum as if it exists inside a coherent shrimp-folk civilization,
with its own civic geography, collection history, curatorial standards, and
institutional voice. This README can break that frame, but the project itself
takes the premise seriously: the humor works best when the museum feels real.

The public site is driven mostly by YAML metadata, with artwork images stored in
the repository and processed by Astro during the build.

## Stack

- Astro static site, built as static HTML
- Metadata-driven artwork and exhibition content in YAML
- Astro image handling for local collection assets
- Auto-generated sitemap via `@astrojs/sitemap`
- GitHub Actions deployment to GitHub Pages

## Routes

- `/` homepage with featured works
- `/about/` museum setting and identity
- `/gallery/` full gallery
- `/gallery/newest/` gallery sorted by newest artwork image timestamp
- `/artworks/[slug]/` per-piece detail pages
- `/eras/` and `/eras/[era]/` era listings
- `/categories/` and `/categories/[category]/` category listings
- `/exhibitions/` and `/exhibitions/[slug]/` exhibition view pages

Artwork detail, gallery, era, and category pages are generated from artwork
metadata. Exhibition pages are generated from `src/data/exhibition-views.yaml`.

## Local development

```bash
npm ci
npm run dev
```

This project targets Node 22. The package manager is pinned in `package.json`,
and `.node-version` is provided for local version managers.

Project npm scripts set `ASTRO_TELEMETRY_DISABLED=1` explicitly. Keep that
environment variable on any new Astro script so Codex worktrees do not fail when
Astro tries to write telemetry state under a user Library path.

## Codex worktrees

Codex task isolation is enforced in two places:

- `.codex/environments/environment.toml` runs `scripts/codex-setup.sh`, which
  creates a `codex/...` branch automatically when setup begins from a shared
  branch or detached `HEAD`.
- `AGENTS.md` tells every newly dispatched agent to verify that setup already
  placed the checkout on an isolated task branch before doing deliverable work.

For mobile or remote dispatch, treat task isolation as mandatory startup work,
not a handoff step. A new task should begin by checking the current branch:

```bash
git status --short --branch
```

If setup already placed the checkout on a non-shared `codex/...` branch, continue
there. Do not run `--new-task` again, because that creates an unnecessary second
task branch.

If a session is still on `main`, `master`, `trunk`, `develop`, `dev`, or detached
`HEAD`, create the task branch manually before doing deliverable work:

```bash
./scripts/codex-task-start.sh --new-task
```

If that command reports a dirty worktree, stop and resolve the existing changes
instead of layering a new task on top of them.

Fresh task branches are based on `main` by default. Set `CODEX_TASK_BASE_REF` in
the environment only when a task should intentionally start from another ref.
These helper scripts are tailored to this repository’s branch layout and workflows.

Do not run simultaneous Codex tasks in the same checkout. Branches separate git
history, but parallel agents need separate worktrees or sessions to avoid
file-level interference.

For any task with a deliverable, assume the normal handoff is user review through
a pull request unless the user explicitly asks for a different workflow. Commit
the deliverable on the task branch, push the branch, and open a PR against
`main`. The PR should summarize the change, call out validation performed, and
note any known follow-up or unverified behavior.

Use the repo-local Codex environment at `.codex/environments/environment.toml`
for deterministic setup.

For parallel development, run the normal dev server unless another worktree is
already using the default Astro port:

```bash
npm run dev -- --port 4322
```

## Agents and skills

MoSFA keeps project-specific Codex guidance in two places:

- `AGENTS.md` defines repository workflow rules, including mandatory task branch
  isolation, PR labeling, image generation expectations, and the rule that
  artwork accessions live as separate files in `src/data/artworks/`.
- `.agents/skills/mosfa-art-curator/` is the local curator skill package. It
  carries the museum canon, worldbuilding references, artwork rubric, wing and
  category guidance, generation prompt structure, metadata style, and staff-role
  workflow.

Use the curator skill for artwork concepts, image generation briefs, accession
review, artwork metadata, exhibition copy, institutional copy, and canon-sensitive
worldbuilding. The skill treats MoSFA as a serious museum inside New Atlantis,
while still allowing repository docs and implementation work to describe how the
fiction is constructed.

The intended accession workflow is:

1. Chief Curator sets the brief and collection intent.
2. Acquisition Team develops candidate artwork and production notes.
3. Critic / Accession Reviewer evaluates the result against the rubric.
4. Registrar writes compatible YAML metadata after acceptance.
5. Copy Editor polishes public-facing prose.
6. Historian reviews any new civic, institutional, or canon facts.

Small tasks can compress those roles, but keep the responsibilities distinct
when quality judgment, metadata compatibility, or world continuity matter.

## Add a new artwork

1. During candidate development, keep temporary images and contact sheets in
   `scratch/`. Use `npm run contact-sheet -- ...` to assemble an HTML review
   sheet for generated candidates.
2. After user approval, add the image file in `src/assets/images/artworks/`.
3. Add a new YAML record in `src/data/artworks/`, named after the artwork slug
   (for example `src/data/artworks/my-piece.yaml`).
   `npm run new:artwork -- --slug my-piece` can scaffold an unpublished draft.
4. Fill all metadata fields:
   - `title`
   - `slug`
   - `artistReference`
   - `sourceWork`
   - `yearOrPeriod`
   - `era`
   - `categories` (array)
   - `image` (asset path, e.g. `artworks/my-piece.png`)
   - `imageAlt`
   - `summary`
   - `description` (used on detail pages)
   - `featured` (`true`/`false`)
   - `featuredRank` (number, optional)
   - `published` (`true`/`false`)

The homepage, gallery, era pages, category pages, and detail page are created automatically.

Run `npm run validate:artworks` before committing accession metadata. `npm run
build` runs the same validation before Astro builds the site.

Keep one accession record per file in `src/data/artworks/`. This keeps broad
curatorial audits skimmable and parallel artwork branches easy to merge.

## Deployment

The workflow lives at `.github/workflows/deploy.yml` and runs on pushes to `main`.
It installs dependencies with `npm ci`, builds with `npm run build`, and deploys
the generated `dist` directory through GitHub Pages.

Default repository variables:

- `SITE_URL` defaults to `https://mosfa.art`
- `BASE_PATH` defaults to `/`

If you move to another custom domain or back to a repo subpath deployment:

1. Set `SITE_URL` to the canonical domain (for example `https://mosfa.art`).
2. Set `BASE_PATH` to the repo path (for example `/mosfa`).
3. Add or update `public/CNAME` when GitHub Pages should publish a custom
   domain from the built site.
