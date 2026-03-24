import { parseFrontmatter } from './parse-frontmatter.js';
import { parseFunctions } from './parse-functions.js';
import type { ParsedModule } from './types.js';

/**
 * Parse a `.module.scssdef` source string into a structured module definition.
 *
 * @param source - Full file content of a `.module.scssdef` file.
 * @returns Parsed module with frontmatter metadata and function declarations.
 * @throws If frontmatter is malformed or required tags are missing.
 */
export function parse(source: string): ParsedModule {
  const { frontmatter, body } = parseFrontmatter(source);
  const functions = parseFunctions(body);
  return { frontmatter, functions };
}
