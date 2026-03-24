# @dtcg-formulas/registry

Function declaration registry with built-in function support.

## `createRegistry(): Registry`

Create a new registry, pre-loaded with built-in functions (`round`, `clamp`, `min`, `max`).

### Returns

```ts
interface Registry {
  register(modulePath: string, functionName: string, declaration: FunctionDeclaration): void;
  resolve(definitionRef: string): FunctionDeclaration | null;
  list(): string[];
}
```

## `Registry.register(modulePath, functionName, declaration)`

Register a parsed function declaration under a `path#name` key.

| Param | Type | Description |
|-------|------|-------------|
| `modulePath` | `string` | File path of the `.module.scssdef` source |
| `functionName` | `string` | Function name |
| `declaration` | `FunctionDeclaration` | Parsed declaration from the parser |

**Throws** if the `path#name` combination is already registered (collision detection).

## `Registry.resolve(definitionRef)`

Look up a function by its definition reference string.

| Param | Type | Description |
|-------|------|-------------|
| `definitionRef` | `string` | Key in `"path#name"` format |

Returns `null` if not found.

## `Registry.list()`

Returns all registered definition reference keys, sorted alphabetically.

## Built-in Functions

Pre-registered at the `builtins#` namespace:

| Key | Function | Description |
|-----|----------|-------------|
| `builtins#round` | `round($value, $step, $mode)` | Round to nearest step |
| `builtins#clamp` | `clamp($min, $preferred, $max)` | Constrain to bounds |
| `builtins#min` | `min(...$values)` | Minimum value |
| `builtins#max` | `max(...$values)` | Maximum value |
