/** Parsed output of a `.module.scssdef` file. */
export interface ParsedModule {
  frontmatter: ModuleFrontmatter;
  functions: FunctionDeclaration[];
}

/** YAML frontmatter block. */
export interface ModuleFrontmatter {
  module: string;
  title: string;
  summary: string;
  category?: string;
  since?: string;
  tags?: string[];
  see?: string[];
}

/** A single function declaration extracted from a definition file. */
export interface FunctionDeclaration {
  name: string;
  summary: string;
  description?: string;
  parameters: Parameter[];
  returnType: string;
  returnExpression: string;
  constraints?: string[];
  examples?: string[];
  since?: string;
}

/** A function parameter. */
export interface Parameter {
  /** Parameter name without leading `$`. */
  name: string;
  /** Type annotation from `<type>` in the doc comment, e.g. `"number|dimension|ref"`. */
  type: string | null;
  /** Default value from the `@function` signature, e.g. `"1px"`. */
  default: string | null;
  /** Description text from the `@param` tag. */
  description: string;
}
