import type { FunctionDeclaration } from '@dtcg-formulas/parser';
import { BUILTINS } from './builtins.js';

export type { FunctionDeclaration } from '@dtcg-formulas/parser';

/** Function registry interface. */
export interface Registry {
  /** Register a function declaration from a specific module path. */
  register(modulePath: string, functionName: string, declaration: FunctionDeclaration): void;
  /** Resolve a definition reference like `"path#name"`. Returns null if not found. */
  resolve(definitionRef: string): FunctionDeclaration | null;
  /** List all registered definition refs. */
  list(): string[];
}

/**
 * Create a new function registry, pre-loaded with built-in functions
 * (`round`, `clamp`, `min`, `max`) at the `builtins#` namespace.
 */
export function createRegistry(): Registry {
  const store = new Map<string, FunctionDeclaration>();

  // Pre-register built-ins
  for (const { key, declaration } of BUILTINS) {
    store.set(key, declaration);
  }

  return {
    register(modulePath: string, functionName: string, declaration: FunctionDeclaration): void {
      const key = `${modulePath}#${functionName}`;
      if (store.has(key)) {
        throw new Error(`Duplicate registration: "${key}" is already registered`);
      }
      store.set(key, declaration);
    },

    resolve(definitionRef: string): FunctionDeclaration | null {
      return store.get(definitionRef) ?? null;
    },

    list(): string[] {
      return [...store.keys()].sort();
    },
  };
}
