#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';

const root = process.cwd();

function usage() {
	console.error(`Usage: npm run contact-sheet -- [options] image-a.png image-b.png

Options:
  --title "Artwork Candidates"
  --out scratch/contact-sheets/artwork-candidates.html
  --candidate "A=path/to/image.png"    May be repeated
  --note "A=Reviewer note"             May be repeated
`);
	process.exit(1);
}

function parsePair(raw, flag) {
	const separator = raw.indexOf('=');
	if (separator === -1) {
		console.error(`${flag} expects LABEL=value`);
		usage();
	}
	return [raw.slice(0, separator), raw.slice(separator + 1)];
}

function parseArgs(argv) {
	const args = {
		candidates: [],
		notes: new Map(),
		title: 'MoSFA Candidate Contact Sheet',
	};

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		if (token === '--help' || token === '-h') {
			usage();
		}
		if (token === '--title' || token === '--out') {
			const value = argv[index + 1];
			if (!value || value.startsWith('--')) {
				console.error(`Missing value for ${token}`);
				usage();
			}
			args[token.slice(2)] = value;
			index += 1;
			continue;
		}
		if (token === '--candidate') {
			const value = argv[index + 1];
			if (!value || value.startsWith('--')) {
				console.error('Missing value for --candidate');
				usage();
			}
			const [label, imagePath] = parsePair(value, '--candidate');
			args.candidates.push({ label, imagePath });
			index += 1;
			continue;
		}
		if (token === '--note') {
			const value = argv[index + 1];
			if (!value || value.startsWith('--')) {
				console.error('Missing value for --note');
				usage();
			}
			const [label, note] = parsePair(value, '--note');
			args.notes.set(label, note);
			index += 1;
			continue;
		}
		if (token.startsWith('--')) {
			console.error(`Unknown option: ${token}`);
			usage();
		}
		const label = `Candidate ${String.fromCharCode(65 + args.candidates.length)}`;
		args.candidates.push({ label, imagePath: token });
	}

	return args;
}

function defaultOutputPath() {
	const stamp = new Date().toISOString().replace(/[:.]/g, '-');
	return `scratch/contact-sheets/contact-sheet-${stamp}.html`;
}

function escapeHtml(value) {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function toBrowserPath(fromDir, targetPath) {
	const absolutePath = isAbsolute(targetPath) ? targetPath : resolve(root, targetPath);
	return relative(fromDir, absolutePath).split(sep).join('/');
}

const args = parseArgs(process.argv.slice(2));
if (args.candidates.length === 0) {
	console.error('At least one candidate image is required.');
	usage();
}

const outputPath = resolve(root, args.out ?? defaultOutputPath());
const outputDir = dirname(outputPath);
mkdirSync(outputDir, { recursive: true });

const missing = [];
const cards = args.candidates
	.map((candidate) => {
		const absolutePath = isAbsolute(candidate.imagePath)
			? candidate.imagePath
			: resolve(root, candidate.imagePath);
		if (!existsSync(absolutePath)) {
			missing.push(candidate.imagePath);
		}
		const label = escapeHtml(candidate.label);
		const note = escapeHtml(args.notes.get(candidate.label) ?? '');
		const imageSrc = escapeHtml(toBrowserPath(outputDir, candidate.imagePath));
		const fileName = escapeHtml(basename(candidate.imagePath));
		return `<article class="candidate">
			<header>
				<h2>${label}</h2>
				<p>${fileName}</p>
			</header>
			<img src="${imageSrc}" alt="${label}" />
			${note ? `<p class="note">${note}</p>` : ''}
		</article>`;
	})
	.join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${escapeHtml(args.title)}</title>
	<style>
		:root {
			color-scheme: light;
			font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			background: #f5f2ec;
			color: #1f2933;
		}
		body {
			margin: 0;
			padding: 32px;
		}
		h1 {
			margin: 0 0 20px;
			font-size: 28px;
			font-weight: 700;
		}
		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: 18px;
		}
		.candidate {
			border: 1px solid #d1c7b8;
			background: #fffdf8;
			padding: 12px;
		}
		.candidate header {
			display: flex;
			justify-content: space-between;
			gap: 12px;
			align-items: baseline;
			margin-bottom: 10px;
		}
		.candidate h2 {
			margin: 0;
			font-size: 16px;
		}
		.candidate p {
			margin: 0;
			color: #667085;
			font-size: 12px;
		}
		.candidate img {
			display: block;
			width: 100%;
			height: auto;
			background: #ebe4d8;
		}
		.candidate .note {
			margin-top: 10px;
			color: #344054;
			font-size: 14px;
			line-height: 1.45;
		}
	</style>
</head>
<body>
	<h1>${escapeHtml(args.title)}</h1>
	<main class="grid">
		${cards}
	</main>
</body>
</html>
`;

writeFileSync(outputPath, html, 'utf8');

for (const imagePath of missing) {
	console.warn(`Warning: candidate image not found: ${imagePath}`);
}

console.log(`Created contact sheet: ${outputPath}`);
