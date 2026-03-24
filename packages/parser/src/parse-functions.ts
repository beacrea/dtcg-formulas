import type { FunctionDeclaration, Parameter } from './types.js';

/**
 * Parse the body (everything after frontmatter) into FunctionDeclaration[].
 *
 * Strategy:
 * 1. Split into blocks by `/// @name` boundaries
 * 2. Each block has a doc comment (/// lines) followed by `@function ... { ... }`
 * 3. Extract SassDoc tags from the comment
 * 4. Extract name, params (with defaults), and @return expression from the function body
 */
export function parseFunctions(body: string): FunctionDeclaration[] {
  const blocks = splitIntoFunctionBlocks(body);
  return blocks.map(parseBlock);
}

// ---------------------------------------------------------------------------
// Block splitting
// ---------------------------------------------------------------------------

interface RawBlock {
  docLines: string[];
  funcSource: string;
}

function splitIntoFunctionBlocks(body: string): RawBlock[] {
  const lines = body.split('\n');
  const blocks: RawBlock[] = [];
  let currentDoc: string[] = [];
  let inFunction = false;
  let funcLines: string[] = [];
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('/// @name') && !inFunction) {
      // If we already accumulated a block, something's wrong — ignore it
      currentDoc = [trimmed];
      continue;
    }

    if (trimmed.startsWith('///') && !inFunction) {
      currentDoc.push(trimmed);
      continue;
    }

    if (trimmed.startsWith('@function') && !inFunction) {
      inFunction = true;
      funcLines = [trimmed];
      braceDepth = countBraces(trimmed);
      if (braceDepth === 0) {
        // Single-line function or opening brace on same line
        blocks.push({ docLines: currentDoc, funcSource: funcLines.join('\n') });
        currentDoc = [];
        inFunction = false;
        funcLines = [];
      }
      continue;
    }

    if (inFunction) {
      funcLines.push(trimmed);
      braceDepth += countBraces(trimmed);
      if (braceDepth === 0) {
        blocks.push({ docLines: currentDoc, funcSource: funcLines.join('\n') });
        currentDoc = [];
        inFunction = false;
        funcLines = [];
      }
    }
  }

  return blocks;
}

function countBraces(line: string): number {
  let depth = 0;
  for (const ch of line) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
  }
  return depth;
}

// ---------------------------------------------------------------------------
// Block parsing
// ---------------------------------------------------------------------------

function parseBlock(block: RawBlock): FunctionDeclaration {
  const tags = extractTags(block.docLines);
  const { name: funcName, params, returnExpression } = parseFunction(block.funcSource);

  const name = tags.name ?? funcName;
  const summary = tags.summary;
  if (!summary) {
    throw new Error(`Function "${name}" missing @summary`);
  }

  // Merge doc params with function signature params
  const parameters = mergeParams(tags.params, params);

  // Validate: every param in the signature should have a @param doc
  for (const p of parameters) {
    if (!p.description) {
      throw new Error(`Function "${name}": parameter $${p.name} missing @param documentation`);
    }
  }

  const returnType = tags.returns;
  if (!returnType) {
    throw new Error(`Function "${name}" missing @returns`);
  }

  return {
    name,
    summary,
    description: tags.description ?? undefined,
    parameters,
    returnType,
    returnExpression,
    constraints: tags.constraints.length > 0 ? tags.constraints : undefined,
    examples: tags.examples.length > 0 ? tags.examples : undefined,
    since: tags.since ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// SassDoc tag extraction
// ---------------------------------------------------------------------------

interface ExtractedTags {
  name: string | null;
  summary: string | null;
  description: string | null;
  returns: string | null;
  since: string | null;
  params: Map<string, { type: string | null; description: string }>;
  constraints: string[];
  examples: string[];
}

function extractTags(docLines: string[]): ExtractedTags {
  const result: ExtractedTags = {
    name: null,
    summary: null,
    description: null,
    returns: null,
    since: null,
    params: new Map(),
    constraints: [],
    examples: [],
  };

  // Track which multi-line field is currently accumulating continuations.
  // Only @description and @summary support continuation lines.
  let currentTag: 'summary' | 'description' | null = null;

  for (const raw of docLines) {
    // Strip leading `/// ` or `///`
    const line = raw.replace(/^\/\/\/\s?/, '');

    if (line.startsWith('@name ')) {
      currentTag = null;
      result.name = line.slice(6).trim();
    } else if (line.startsWith('@summary ')) {
      result.summary = line.slice(9).trim();
      currentTag = 'summary';
    } else if (line.startsWith('@description ')) {
      result.description = line.slice(13).trim();
      currentTag = 'description';
    } else if (line.startsWith('@param ')) {
      currentTag = null;
      const param = parseParamTag(line.slice(7).trim());
      if (param) {
        result.params.set(param.name, { type: param.type, description: param.description });
      }
    } else if (line.startsWith('@returns ')) {
      currentTag = null;
      // Extract type from <type> notation
      const match = line.slice(9).trim().match(/^<([^>]+)>/);
      result.returns = match ? match[1] : line.slice(9).trim();
    } else if (line.startsWith('@constraints ')) {
      currentTag = null;
      result.constraints.push(line.slice(13).trim());
    } else if (line.startsWith('@example ')) {
      currentTag = null;
      result.examples.push(line.slice(9).trim());
    } else if (line.startsWith('@since ')) {
      currentTag = null;
      result.since = line.slice(7).trim();
    } else if (line.startsWith('@')) {
      // Unknown tag — stop accumulating
      currentTag = null;
    } else if (currentTag && line.trim()) {
      // Continuation line for @summary or @description
      result[currentTag] += ' ' + line.trim();
    }
  }

  return result;
}

/**
 * Parse a @param tag: `$name <type> Description text.`
 * Type annotation is optional.
 */
function parseParamTag(
  text: string,
): { name: string; type: string | null; description: string } | null {
  // Pattern: $name <type> Description
  // or:      $name Description (no type)
  const match = text.match(
    /^\$([\w-]+)\s+(?:<([^>]+)>\s+)?(.+)$/,
  );
  if (!match) return null;

  return {
    name: match[1],
    type: match[2] ?? null,
    description: match[3].trim(),
  };
}

// ---------------------------------------------------------------------------
// @function signature parsing
// ---------------------------------------------------------------------------

interface ParsedFunction {
  name: string;
  params: Map<string, string | null>; // name → default
  returnExpression: string;
}

function parseFunction(source: string): ParsedFunction {
  // Extract function name and param list
  const sigMatch = source.match(/@function\s+(\w[\w-]*)\(([^)]*)\)/);
  if (!sigMatch) {
    throw new Error(`Could not parse @function signature from: ${source.slice(0, 80)}…`);
  }

  const name = sigMatch[1];
  const rawParams = sigMatch[2].trim();

  // Parse parameters
  const params = new Map<string, string | null>();
  if (rawParams.length > 0) {
    for (const segment of splitParams(rawParams)) {
      const trimmed = segment.trim();
      if (!trimmed) continue;

      // Handle rest params: ...$values
      if (trimmed.startsWith('...')) {
        const restName = trimmed.replace(/^\.+\$?/, '');
        params.set(restName, null);
        continue;
      }

      // Handle $name: default or $name
      const pMatch = trimmed.match(/^\$([\w-]+)(?:\s*:\s*(.+))?$/);
      if (pMatch) {
        params.set(pMatch[1], pMatch[2]?.trim() ?? null);
      }
    }
  }

  // Extract @return expression
  const returnMatch = source.match(/@return\s+(.+?);/);
  const returnExpression = returnMatch ? returnMatch[1].trim() : '';

  return { name, params, returnExpression };
}

/** Split parameter list on commas, respecting nested parens. */
function splitParams(raw: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;

  for (const ch of raw) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

// ---------------------------------------------------------------------------
// Merge doc params with signature params
// ---------------------------------------------------------------------------

function mergeParams(
  docParams: Map<string, { type: string | null; description: string }>,
  sigParams: Map<string, string | null>,
): Parameter[] {
  const result: Parameter[] = [];

  for (const [name, defaultValue] of sigParams) {
    const doc = docParams.get(name);
    result.push({
      name,
      type: doc?.type ?? null,
      default: defaultValue,
      description: doc?.description ?? '',
    });
  }

  return result;
}
