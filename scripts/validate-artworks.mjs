#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { parse } from 'yaml';

const root = process.cwd();
const dropInDir = join(root, 'src/data/artworks');
const imageRoot = join(root, 'src/assets/images');

const requiredFields = [
	'title',
	'slug',
	'artistReference',
	'sourceWork',
	'yearOrPeriod',
	'era',
	'categories',
	'image',
	'imageAlt',
	'summary',
	'description',
	'featured',
	'published',
];

const knownEras = new Set([
	'Crustacean Renaissance Wing',
	'Baroque & Dramatic Realism',
	'Impressionist Reef',
	'Romantic Abyss',
	'Tidal Print Archive',
	'Modernist Tank',
	'Surrealist Depths',
	'Pop Art Aquarium',
	'Abstract Currents',
	'Comic & Mass Culture Pavilion',
	'Ancient Shrimp Civilization',
	'Reef Street Art Corridor',
]);

const errors = [];
const warnings = [];
const seenSlugs = new Map();
let recordCount = 0;
let fileCount = 0;

function displayPath(filePath) {
	return relative(root, filePath);
}

function addError(filePath, message) {
	errors.push(`${displayPath(filePath)}: ${message}`);
}

function addWarning(filePath, message) {
	warnings.push(`${displayPath(filePath)}: ${message}`);
}

function parseArtworkFile(filePath) {
	fileCount += 1;
	const raw = readFileSync(filePath, 'utf8');
	const parsed = parse(raw);
	if (Array.isArray(parsed)) {
		return parsed;
	}
	if (parsed && typeof parsed === 'object') {
		return [parsed];
	}
	addError(filePath, 'must contain an artwork record or a top-level array');
	return [];
}

function normalizeImagePath(imagePath) {
	return imagePath.replace(/^\/?(images\/)?/, '');
}

function imageExists(imagePath) {
	return existsSync(join(imageRoot, normalizeImagePath(imagePath)));
}

function checkString(record, field, filePath) {
	if (typeof record[field] !== 'string' || record[field].trim() === '') {
		addError(filePath, `${field} must be a non-empty string`);
	}
}

function checkBoolean(record, field, filePath) {
	if (typeof record[field] !== 'boolean') {
		addError(filePath, `${field} must be true or false`);
	}
}

function validateRecord(record, filePath, expectedSlug, options = {}) {
	recordCount += 1;

	for (const field of requiredFields) {
		if (!(field in record)) {
			addError(filePath, `missing required field ${field}`);
		}
	}

	for (const field of [
		'title',
		'slug',
		'artistReference',
		'sourceWork',
		'yearOrPeriod',
		'era',
		'image',
		'imageAlt',
		'summary',
		'description',
	]) {
		if (field in record) {
			checkString(record, field, filePath);
		}
	}

	for (const field of ['featured', 'published']) {
		if (field in record) {
			checkBoolean(record, field, filePath);
		}
	}

	if (typeof record.slug === 'string') {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
			addError(filePath, `slug "${record.slug}" must be lowercase kebab-case`);
		}
		if (expectedSlug && record.slug !== expectedSlug) {
			addError(
				filePath,
				`artwork filename expects slug "${expectedSlug}", found "${record.slug}"`,
			);
		}
		const previousPath = seenSlugs.get(record.slug);
		if (previousPath) {
			addError(
				filePath,
				`duplicate slug "${record.slug}", already defined in ${displayPath(previousPath)}`,
			);
		} else {
			seenSlugs.set(record.slug, filePath);
		}
	}

	if (Array.isArray(record.categories)) {
		if (record.categories.length === 0) {
			addError(filePath, 'categories must include at least one value');
		}
		for (const category of record.categories) {
			if (typeof category !== 'string' || category.trim() === '') {
				addError(filePath, 'categories must contain only non-empty strings');
			}
		}
	} else if ('categories' in record) {
		addError(filePath, 'categories must be an array');
	}

	if (typeof record.era === 'string' && !knownEras.has(record.era)) {
		addError(filePath, `era "${record.era}" is not a known MoSFA wing`);
	}

	if (typeof record.image === 'string' && record.image.trim() !== '') {
		if (!imageExists(record.image)) {
			const message = `image file not found for ${record.image}`;
			if (record.published === false) {
				addWarning(filePath, `${message} (allowed for unpublished drafts)`);
			} else {
				addError(filePath, message);
			}
		}
	}
}

function validateDropInFile(filePath) {
	const entries = parseArtworkFile(filePath);
	if (entries.length !== 1) {
		addError(filePath, 'artwork YAML files must contain exactly one record');
	}
	const expectedSlug = basename(filePath).replace(/\.ya?ml$/, '');
	for (const entry of entries) {
		validateRecord(entry, filePath, expectedSlug);
	}
}

if (existsSync(dropInDir)) {
	for (const fileName of readdirSync(dropInDir).sort()) {
		if (/\.ya?ml$/.test(fileName)) {
			validateDropInFile(join(dropInDir, fileName));
		}
	}
} else {
	addError(dropInDir, 'artwork data directory not found');
}

for (const warning of warnings) {
	console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
	for (const error of errors) {
		console.error(`Error: ${error}`);
	}
	process.exit(1);
}

console.log(`Validated ${recordCount} artwork records across ${fileCount} files.`);
