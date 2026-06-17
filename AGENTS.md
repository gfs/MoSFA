# Repository Instructions

## Mandatory Task Isolation

Task isolation is mandatory, but branch creation is normally handled by the
repo-local setup hook in `.codex/environments/environment.toml`. The hook runs
`scripts/codex-setup.sh`, which calls `scripts/codex-task-start.sh --setup` and
creates a task branch automatically when the environment begins on a shared
branch or detached `HEAD`.

At the start of every newly dispatched Codex task in this repository, first
confirm that the current checkout is already isolated:

```sh
git status --short --branch
```

If the checkout is already on a non-shared task branch, usually `codex/...`,
continue on that branch. Do not run `--new-task` again, because doing so creates
an unnecessary second task branch.

If the checkout is on `main`, `master`, `trunk`, `develop`, `dev`, or detached
`HEAD`, create the task branch before reading broadly, editing files, generating
assets, running formatters, or starting a dev server:

```sh
./scripts/codex-task-start.sh --new-task
```

The task branch is the workspace boundary. Do not perform deliverable work on
`main`, `master`, `trunk`, `develop`, `dev`, or detached `HEAD`.

Fresh task branches start from `main` by default. Set `CODEX_TASK_BASE_REF` only
when the user explicitly asks to base work on another ref.

If the script refuses to create a task branch because the worktree is dirty, stop
and report the dirty files instead of continuing. Starting a new task on top of
uncommitted changes from another task will mix workflows.

Do not run concurrent Codex tasks in the same filesystem checkout. Branches
separate history, but only separate worktrees or sessions separate simultaneous
file edits.

For follow-up messages that are clearly continuing the same task, stay on the
existing task branch. If there is any ambiguity, create a fresh task branch from a
clean state or ask the user which branch/worktree should own the work.

Use the repo-local setup hook in `.codex/environments/environment.toml`; it also
creates a task branch automatically when the environment begins on a shared branch
or detached `HEAD`.

## Pull Requests

When opening a pull request, add every appropriate GitHub label from the
repository label set. Relevant labels include `accession`, `agents`, `bug`,
`enhancement`, `documentation`, and `worldbuilding`.

Choose labels based on the actual scope of the work, and apply multiple labels
when a PR spans categories:

- Use `accession` for new or revised artwork accession records, generated
  artwork assets, collection metadata, or gallery entries.
- Use `agents` for changes to Codex, agent, automation, setup, or repository
  instruction workflows.
- Use `bug` for defect fixes or regressions.
- Use `enhancement` for feature work, UX improvements, and non-bug behavior
  changes.
- Use `documentation` for docs-only changes or documentation updates bundled
  with implementation work.
- Use `worldbuilding` for canon, lore, museum setting, cultural context, or
  shrimp-folk world details.

## Image Generation

When generating images, artwork, or visual assets, use the `imagegen` skill so the
result is produced as a high-quality raster image. Do not substitute hand-authored
SVG, HTML/CSS, canvas, or placeholder graphics unless the user specifically asks
for SVG.

## Artwork Metadata Workflow

For artwork accessions, create or revise one YAML file per artwork in
`src/data/artworks/`, named after the accession slug. Keep one record per file so
future broad curatorial audits can skim the collection and parallel Codex tasks
avoid shared-file merge conflicts.

Do not create shared multi-record artwork files or reintroduce
`src/data/artworks.yaml` as incidental cleanup. Do not reorder, group, or sort
existing records as incidental cleanup during accession work.
