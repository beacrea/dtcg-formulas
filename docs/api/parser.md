# @dtcg-formulas/parser

Parse `.module.scssdef` definition files into structured `ParsedModule` objects.

## `parse(source: string): ParsedModule`

Main entry point. Takes the full file content of a `.module.scssdef` file and returns a structured module definition.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `source` | `string` | Full file content |

### Returns

```ts
interface ParsedModule {
  frontmatter: ModuleFrontmatter;
  functions: FunctionDeclaration[];
}
```

### Throws

- If frontmatter fences are missing
- If required frontmatter fields (`module`, `title`, `summary`) are missing
- If a function is missing `@summary`, `@param`, or `@returns` tags

## Types

### `ModuleFrontmatter`

```ts
interface ModuleFrontmatter {
  module: string;    // Required
  title: string;     // Required
  summary: string;   // Required
  category?: string;
  since?: string;
  tags?: string[];
  see?: string[];
}
```

### `FunctionDeclaration`

```ts
interface FunctionDeclaration {
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
```

### `Parameter`

```ts
interface Parameter {
  name: string;          // Without leading $
  type: string | null;   // From <type> annotation
  default: string | null; // From @function signature
  description: string;   // From @param tag
}
```
