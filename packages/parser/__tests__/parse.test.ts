import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const examplesDir = resolve(__dirname, '../../../examples');

function readExample(path: string): string {
  return readFileSync(resolve(examplesDir, path), 'utf-8');
}

describe('parse()', () => {
  describe('math.module.scssdef', () => {
    const result = parse(readExample('radius/math.module.scssdef'));

    it('parses frontmatter', () => {
      expect(result.frontmatter).toEqual({
        module: 'math',
        title: 'Math Utilities',
        summary: 'General-purpose snapping and rounding functions for token derivation.',
        category: 'foundations',
        since: '0.1.0',
        tags: ['math', 'rounding', 'tokens'],
        see: undefined,
      });
    });

    it('extracts the snap function', () => {
      expect(result.functions).toHaveLength(1);
      const snap = result.functions[0];
      expect(snap.name).toBe('snap');
      expect(snap.summary).toBe('Snap a value to a step.');
    });

    it('parses snap parameters with defaults', () => {
      const snap = result.functions[0];
      expect(snap.parameters).toHaveLength(3);

      expect(snap.parameters[0]).toEqual({
        name: 'value',
        type: 'number|dimension|ref',
        default: null,
        description: 'The value to snap.',
      });

      expect(snap.parameters[1]).toEqual({
        name: 'step',
        type: 'number|dimension|ref',
        default: '1px',
        description: 'The snap interval.',
      });

      expect(snap.parameters[2]).toEqual({
        name: 'mode',
        type: 'nearest|floor|ceil',
        default: 'nearest',
        description: 'The rounding mode.',
      });
    });

    it('parses return type and expression', () => {
      const snap = result.functions[0];
      expect(snap.returnType).toBe('number|dimension');
      expect(snap.returnExpression).toBe('round($value, $step, $mode)');
    });

    it('parses examples', () => {
      const snap = result.functions[0];
      expect(snap.examples).toEqual([
        'snap(15.6px, 1px, nearest) → 16px',
        'snap(16.86px, 1px, ceil) → 17px',
      ]);
    });
  });

  describe('radius.module.scssdef', () => {
    const result = parse(readExample('radius/radius.module.scssdef'));

    it('parses frontmatter with see field', () => {
      expect(result.frontmatter.module).toBe('radius');
      expect(result.frontmatter.see).toEqual(['math']);
    });

    it('extracts the radius function', () => {
      expect(result.functions).toHaveLength(1);
      const radius = result.functions[0];
      expect(radius.name).toBe('radius');
      expect(radius.summary).toBe('Compute a proportional radius from a size and ratio.');
    });

    it('parses constraints', () => {
      const radius = result.functions[0];
      expect(radius.constraints).toEqual(['$ratio > 0', '$ratio <= 1']);
    });

    it('parses return expression with nested call', () => {
      const radius = result.functions[0];
      expect(radius.returnExpression).toBe('snap($size * $ratio, $step, $mode)');
    });
  });

  describe('builtins/clamp.module.scssdef', () => {
    const result = parse(readExample('builtins/clamp.module.scssdef'));

    it('parses clamp function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('clamp');
      expect(result.functions[0].parameters).toHaveLength(3);
    });

    it('parses clamp constraints', () => {
      expect(result.functions[0].constraints).toEqual(['$min <= $max']);
    });

    it('parses clamp examples', () => {
      expect(result.functions[0].examples).toHaveLength(3);
    });
  });

  describe('builtins/mix.module.scssdef', () => {
    const result = parse(readExample('builtins/mix.module.scssdef'));

    it('parses mix function with default param', () => {
      const mix = result.functions[0];
      expect(mix.name).toBe('mix');
      expect(mix.parameters[2]).toEqual({
        name: 'weight',
        type: 'number|percentage',
        default: '0.5',
        description: 'Blend weight (0 = all $color2, 1 = all $color1). Default 0.5.',
      });
    });

    it('parses multiple constraints', () => {
      expect(result.functions[0].constraints).toEqual([
        '$weight >= 0',
        '$weight <= 1',
      ]);
    });
  });

  describe('error handling', () => {
    it('throws on missing frontmatter', () => {
      expect(() => parse('@function foo() { @return 1; }')).toThrow('Missing opening frontmatter fence');
    });

    it('throws on missing required frontmatter fields', () => {
      const bad = '---\nmodule: test\n---\n';
      expect(() => parse(bad)).toThrow('Frontmatter missing required field: title');
    });

    it('throws on missing @summary', () => {
      const source = [
        '---',
        'module: test',
        'title: Test',
        'summary: Test module.',
        '---',
        '/// @name foo',
        '/// @param $x <number> A number.',
        '/// @returns <number>',
        '@function foo($x) {',
        '  @return $x;',
        '}',
      ].join('\n');
      expect(() => parse(source)).toThrow('missing @summary');
    });
  });
});
