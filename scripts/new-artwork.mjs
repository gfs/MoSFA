#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';

const root = process.cwd();
const dataDir = join(root, 'src/data/artworks');
const monolithPath = join(root, 'src/data/artworks.yaml');

function usage() {
	console.error(`Usage: npm run new:artwork -- --slug example-title [options]

Options:
  --title "Example Title"
  --artist-reference "Artist or movement"
  --source-work "Source work or study type"
  --year-or-period "Period translation"
  --era "Museum Wing"
  --category "Category"        May be repeated
  --image "artworks/example-title.png"
  --dry-run                    Print the draft instead of writing a file
`);
	process.exit(1);
}

function parseArgs(argv) {
	const args = { categories: [] };
	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		if (token === '--help' || token === '-h') {
			usage();
		}
		if (token === '--dry-run') {
			args.dryRun = true;
			continue;
		}
		if (!token.startsWith('--')) {
			console.error(`Unexpected argument: ${token}`);
			usage();
		}
		const key = token.slice(2);
		const value = argv[index + 1];
		if (!value || value.startsWith('--')) {
			console.error(`Missing value for ${token}`);
			usage();
		}
		index += 1;
		if (key === 'category') {
			args.categories.push(value);
		} else {
			args[key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] =
				value;
		}
	}
	return args;
}

function parseArtworkFile(filePath) {
	const parsed = parse(readFileSync(filePath, 'utf8'));
	if (Array.isArray(parsed)) {
		return parsed;
	}
	if (parsed && typeof parsed === 'object') {
		return [parsed];
	}
	return [];
}

function existingSlugs() {
	const slugs = new Set();
	for (const entry of parseArtworkFile(monolithPath)) {
		if (typeof entry.slug === 'string') {
			slugs.add(entry.slug);
		}
	}
	if (existsSync(dataDir)) {
		for (const fileName of readdirSync(dataDir)) {
			if (/\.ya?ml$/.test(fileName)) {
				for (const entry of parseArtworkFile(join(dataDir, fileName))) {
					if (typeof entry.slug === 'string') {
						slugs.add(entry.slug);
					}
				}
			}
		}
	}
	return slugs;
}

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
	console.error('A lowercase kebab-case --slug is required.');
	usage();
}

const outputPath = join(dataDir, `${slug}.yaml`);
if (!args.dryRun && existsSync(outputPath)) {
	console.error(`Refusing to overwrite existing file: ${outputPath}`);
	process.exit(1);
}

if (existingSlugs().has(slug)) {
	console.error(`Refusing to create duplicate artwork slug: ${slug}`);
	process.exit(1);
}

mkdirSync(dataDir, { recursive: true });

const record = {
	title: args.title ?? 'TODO Title',
	slug,
	artistReference: args.artistReference ?? 'TODO artist or movement',
	sourceWork: args.sourceWork ?? 'TODO source work or study type',
	yearOrPeriod: args.yearOrPeriod ?? 'TODO period translation',
	era: args.era ?? 'TODO Museum Wing',
	categories: args.categories.length > 0 ? args.categories : ['TODO Category'],
	image: args.image ?? `artworks/${slug}.png`,
	imageAlt: 'TODO plain visual description.',
	summary: 'TODO one-sentence curatorial argument.',
	description: 'TODO one or two public-facing label sentences.',
	featured: false,
	published: false,
	generation: {
		successfulPrompt: 'TODO add final accepted prompt after user approval.',
		selectionNotes: ['TODO note approved candidate and approval context.'],
		criticDecision: 'TODO Masterpiece / Gallery / Reject or Revise',
		variations: [],
		lessons: [],
	},
};

if (args.dryRun) {
	console.log(stringify(record));
} else {
	writeFileSync(outputPath, stringify(record), 'utf8');
	console.log(`Created draft artwork record: ${outputPath}`);
}
