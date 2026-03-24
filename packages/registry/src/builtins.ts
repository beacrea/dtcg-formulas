import type { FunctionDeclaration } from '@dtcg-formulas/parser';

/** Pre-defined built-in function declarations (CSS/Sass intrinsics). */
export const BUILTINS: ReadonlyArray<{ key: string; declaration: FunctionDeclaration }> = [
  {
    key: 'builtins#round',
    declaration: {
      name: 'round',
      summary: 'Round a value to the nearest step with configurable mode.',
      parameters: [
        { name: 'value', type: 'number|dimension', default: null, description: 'The value to round.' },
        { name: 'step', type: 'number|dimension', default: '1', description: 'The rounding step.' },
        { name: 'mode', type: 'nearest|floor|ceil', default: 'nearest', description: 'Rounding mode.' },
      ],
      returnType: 'number|dimension',
      returnExpression: 'round($value, $step, $mode)',
    },
  },
  {
    key: 'builtins#clamp',
    declaration: {
      name: 'clamp',
      summary: 'Constrain a value between minimum and maximum bounds.',
      parameters: [
        { name: 'min', type: 'number|dimension', default: null, description: 'Lower bound.' },
        { name: 'preferred', type: 'number|dimension', default: null, description: 'Preferred value.' },
        { name: 'max', type: 'number|dimension', default: null, description: 'Upper bound.' },
      ],
      returnType: 'number|dimension',
      returnExpression: 'clamp($min, $preferred, $max)',
      constraints: ['$min <= $max'],
    },
  },
  {
    key: 'builtins#min',
    declaration: {
      name: 'min',
      summary: 'Return the smallest of the given values.',
      parameters: [
        { name: 'values', type: 'number|dimension', default: null, description: 'Values to compare.' },
      ],
      returnType: 'number|dimension',
      returnExpression: 'min(...$values)',
    },
  },
  {
    key: 'builtins#max',
    declaration: {
      name: 'max',
      summary: 'Return the largest of the given values.',
      parameters: [
        { name: 'values', type: 'number|dimension', default: null, description: 'Values to compare.' },
      ],
      returnType: 'number|dimension',
      returnExpression: 'max(...$values)',
    },
  },
];
