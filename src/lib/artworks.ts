import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface ArtworkEntry {
	title: string;
	slug: string;
	artistReference: string;
	sourceWork: string;
	yearOrPeriod: string;
	era: string;
	categories: string[];
	image: string;
	imageAlt: string;
	summary: string;
	description: string;
	featured: boolean;
	featuredRank?: number;
	published: boolean;
	imageFileTimestamp?: string;
	imageFileTimestampMs?: number;
}

export type ArtworkSort = 'collection' | 'newest';

const FEATURED_ARTWORK_LIMIT = 8;
const ARTWORK_IMAGE_REPOSITORY_DIR = 'src/assets/images/artworks';
const ARTWORKS_DATA_DIR = 'src/data/artworks';

let imageGitTimestampCache: Map<string, number> | undefined;

interface GetPublishedArtworksOptions {
	sort?: ArtworkSort;
}

function byFeaturedRankThenTitle(a: ArtworkEntry, b: ArtworkEntry) {
	const leftRank = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
	const rightRank = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
	if (leftRank !== rightRank) {
		return leftRank - rightRank;
	}
	return a.title.localeCompare(b.title);
}

function byNewestImageTimestamp(a: ArtworkEntry, b: ArtworkEntry) {
	const leftTimestamp = a.imageFileTimestampMs ?? 0;
	const rightTimestamp = b.imageFileTimestampMs ?? 0;
	if (leftTimestamp !== rightTimestamp) {
		return rightTimestamp - leftTimestamp;
	}
	return 0;
}

function getNormalizedImagePath(imagePath: string): string {
	return imagePath.replace(/^\/?(images\/)?/, '');
}

function getImageFilePath(imagePath: string): string {
	return join(
		process.cwd(),
		'src',
		'assets',
		'images',
		getNormalizedImagePath(imagePath),
	);
}

function getImageRepositoryPath(imagePath: string): string {
	return `src/assets/images/${getNormalizedImagePath(imagePath)}`;
}

function getImageGitTimestamps(): Map<string, number> {
	if (imageGitTimestampCache) {
		return imageGitTimestampCache;
	}

	const timestamps = new Map<string, number>();
	try {
		const output = execFileSync(
			'git',
			[
				'log',
				'--diff-filter=A',
				'--name-only',
				'--format=@@%cI',
				'--',
				ARTWORK_IMAGE_REPOSITORY_DIR,
			],
			{
				cwd: process.cwd(),
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
			},
		);
		let currentTimestamp: number | undefined;
		for (const rawLine of output.split(/\r?\n/)) {
			const line = rawLine.trim();
			if (!line) {
				continue;
			}
			if (line.startsWith('@@')) {
				const parsedTimestamp = Date.parse(line.slice(2));
				currentTimestamp = Number.isFinite(parsedTimestamp)
					? parsedTimestamp
					: undefined;
				continue;
			}
			if (currentTimestamp !== undefined && !timestamps.has(line)) {
				timestamps.set(line, currentTimestamp);
			}
		}
	} catch {
		// Source archives and shallow checkouts may not have enough Git history.
	}

	imageGitTimestampCache = timestamps;
	return timestamps;
}

function getImageGitTimestamp(imagePath: string) {
	const repositoryPath = getImageRepositoryPath(imagePath);
	const timestampMs = getImageGitTimestamps().get(repositoryPath);
	if (timestampMs === undefined) {
		return undefined;
	}
	return {
		iso: new Date(timestampMs).toISOString(),
		ms: timestampMs,
	};
}

function getImageFileTimestamp(imagePath: string) {
	const gitTimestamp = getImageGitTimestamp(imagePath);
	if (gitTimestamp) {
		return gitTimestamp;
	}

	const filePath = getImageFilePath(imagePath);
	try {
		const stats = statSync(filePath);
		const timestampMs = Math.max(
			stats.birthtimeMs,
			stats.mtimeMs,
			stats.ctimeMs,
		);
		return {
			iso: new Date(timestampMs).toISOString(),
			ms: timestampMs,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(
			`Unable to read image file timestamp for ${imagePath} at ${filePath}: ${message}`,
		);
	}
}

function withImageFileTimestamp(artwork: ArtworkEntry): ArtworkEntry {
	const timestamp = getImageFileTimestamp(artwork.image);
	return {
		...artwork,
		imageFileTimestamp: timestamp.iso,
		imageFileTimestampMs: timestamp.ms,
	};
}

function parseArtworkEntries(raw: string, sourcePath: string): ArtworkEntry[] {
	const parsed = parse(raw) as ArtworkEntry | ArtworkEntry[] | null;
	if (Array.isArray(parsed)) {
		return parsed;
	}
	if (parsed && typeof parsed === 'object') {
		return [parsed];
	}
	throw new Error(
		`${sourcePath} must contain an artwork record or a top-level array.`,
	);
}

function getArtworkDataFiles(): string[] {
	const dataDir = join(process.cwd(), ARTWORKS_DATA_DIR);
	if (!existsSync(dataDir)) {
		return [];
	}
	return readdirSync(dataDir)
		.filter((fileName) => /\.ya?ml$/.test(fileName))
		.sort()
		.map((fileName) => join(dataDir, fileName));
}

function addArtworkEntries(
	artworks: ArtworkEntry[],
	seenSlugs: Map<string, string>,
	entries: ArtworkEntry[],
	sourcePath: string,
) {
	for (const artwork of entries) {
		const duplicate = seenSlugs.get(artwork.slug);
		if (duplicate) {
			throw new Error(
				`Duplicate artwork slug "${artwork.slug}" in ${sourcePath}; already defined in ${duplicate}.`,
			);
		}
		seenSlugs.set(artwork.slug, sourcePath);
		artworks.push(artwork);
	}
}

function getArtworkEntries(): ArtworkEntry[] {
	const artworks: ArtworkEntry[] = [];
	const seenSlugs = new Map<string, string>();

	for (const filePath of getArtworkDataFiles()) {
		addArtworkEntries(
			artworks,
			seenSlugs,
			parseArtworkEntries(readFileSync(filePath, 'utf8'), filePath),
			filePath,
		);
	}

	return artworks;
}

export async function getPublishedArtworks(
	options: GetPublishedArtworksOptions = {},
): Promise<ArtworkEntry[]> {
	const artworks = getArtworkEntries();
	const sort = options.sort ?? 'collection';
	return artworks
		.filter((artwork) => artwork.published)
			.map(withImageFileTimestamp)
			.sort(
				sort === 'newest'
					? byNewestImageTimestamp
					: byFeaturedRankThenTitle,
			);
}

export function getFeaturedArtworks(artworks: ArtworkEntry[]): ArtworkEntry[] {
	return artworks
		.filter((artwork) => artwork.published && artwork.featured)
		.sort(byFeaturedRankThenTitle)
		.slice(0, FEATURED_ARTWORK_LIMIT);
}
