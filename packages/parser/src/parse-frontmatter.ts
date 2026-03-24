import { parse as parseYaml } from 'yaml';
import type { ModuleFrontmatter } from './types.js';

const FENCE = '---';

/**
 * Extract and parse YAML frontmatter from source.
 * Returns the parsed frontmatter and the remaining body after the closing fence.
 */
export function parseFrontmatter(source: string): {
  frontmatter: ModuleFrontmatter;
  body: string;
} {
  const lines = source.split('\n');

  // First non-empty line must be a fence
  const firstFenceIdx = lines.findIndex((l) => l.trim() === FENCE);
  if (firstFenceIdx === -1) {
    throw new Error('Missing opening frontmatter fence (---)');
  }

  // Find closing fence
  const closingFenceIdx = lines.findIndex(
    (l, i) => i > firstFenceIdx && l.trim() === FENCE,
  );
  if (closingFenceIdx === -1) {
    throw new Error('Missing closing frontmatter fence (---)');
  }

  const yamlBlock = lines.slice(firstFenceIdx + 1, closingFenceIdx).join('\n');
  const raw = parseYaml(yamlBlock) as Record<string, unknown>;

  // Validate required fields
  for (const field of ['module', 'title', 'summary'] as const) {
    if (typeof raw[field] !== 'string' || raw[field].length === 0) {
      throw new Error(`Frontmatter missing required field: ${field}`);
    }
  }

  const frontmatter: ModuleFrontmatter = {
    module: raw.module as string,
    title: raw.title as string,
    summary: raw.summary as string,
    category: typeof raw.category === 'string' ? raw.category : undefined,
    since: typeof raw.since === 'string' ? raw.since : undefined,
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : undefined,
    see: Array.isArray(raw.see) ? raw.see.map(String) : undefined,
  };

  const body = lines.slice(closingFenceIdx + 1).join('\n');
  return { frontmatter, body };
}
