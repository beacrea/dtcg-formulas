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

  describe('outline-radius/outline-radius.module.scssdef', () => {
    const result = parse(readExample('outline-radius/outline-radius.module.scssdef'));

    it('parses frontmatter with geometry category and see:[radius]', () => {
      expect(result.frontmatter.module).toBe('outline-radius');
      expect(result.frontmatter.category).toBe('geometry');
      expect(result.frontmatter.see).toEqual(['radius']);
    });

    it('extracts the outline-radius function', () => {
      expect(result.functions).toHaveLength(1);
      const fn = result.functions[0];
      expect(fn.name).toBe('outline-radius');
      expect(fn.summary).toBe("Outer-edge radius of an offset outline's visual silhouette.");
    });

    it('parses 3 positional parameters', () => {
      const fn = result.functions[0];
      expect(fn.parameters).toHaveLength(3);
      expect(fn.parameters[0].name).toBe('inner');
      expect(fn.parameters[1].name).toBe('offset');
      expect(fn.parameters[2].name).toBe('width');
      expect(fn.parameters.every((p) => p.default === null)).toBe(true);
    });

    it('parses non-negativity and positivity constraints', () => {
      expect(result.functions[0].constraints).toEqual([
        '$inner >= 0',
        '$offset >= 0',
        '$width > 0',
      ]);
    });

    it('parses return expression as the sum of all three params', () => {
      expect(result.functions[0].returnExpression).toBe('$inner + $offset + $width');
    });

    it('parses 3 examples covering friendly, rounded, and sharp shapes', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('outline-radius(20px, 4px, 2px) → 26px');
      expect(examples[1]).toBe('outline-radius(8px, 4px, 2px) → 14px');
      expect(examples[2]).toBe('outline-radius(0px, 4px, 2px) → 6px');
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

  describe('leonardo-color/color.module.scssdef', () => {
    const result = parse(readExample('leonardo-color/color.module.scssdef'));

    it('parses frontmatter with palette tag and see field', () => {
      expect(result.frontmatter).toEqual({
        module: 'leonardo',
        title: 'Leonardo Color',
        summary: 'Contrast-aware palette color generation via Adobe Leonardo.',
        category: 'color',
        since: '0.1.0',
        tags: ['color', 'contrast', 'accessibility', 'leonardo', 'palette'],
        see: ['builtins'],
      });
    });

    it('exports a single leo function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('leo');
    });

    it('parses 4 params with correct types and defaults', () => {
      const leo = result.functions[0];
      expect(leo.parameters).toHaveLength(4);

      expect(leo.parameters[0]).toEqual({
        name: 'color',
        type: 'ref|color',
        default: null,
        description: 'Color family ref or raw key color value.',
      });

      expect(leo.parameters[1]).toEqual({
        name: 'contrast',
        type: 'number',
        default: null,
        description: 'Target contrast ratio between generated color and background.',
      });

      expect(leo.parameters[2]).toEqual({
        name: 'background',
        type: 'color|ref',
        default: 'white',
        description: 'Contrast surface. Defaults to white when family background is unavailable.',
      });

      expect(leo.parameters[3]).toEqual({
        name: 'model',
        type: 'wcag2|apca|wcag3',
        default: 'wcag2',
        description: 'Contrast algorithm. Default wcag2.',
      });
    });

    it('parses multi-line @description', () => {
      const desc = result.functions[0].description!;
      expect(desc).toContain('Supports two modes');
      expect(desc).toContain('family mode');
      expect(desc).toContain('direct mode');
      expect(desc).toContain('Family mode:');
      expect(desc).toContain('Direct mode:');
    });

    it('parses @since', () => {
      expect(result.functions[0].since).toBe('0.1.0');
    });

    it('parses constraints', () => {
      expect(result.functions[0].constraints).toEqual(['$contrast > 0']);
    });

    it('parses return expression', () => {
      expect(result.functions[0].returnExpression).toBe(
        'leonardo($color, $contrast, $background, $model)',
      );
    });

    it('parses 3 examples: minimal family, background override, maximal direct', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('leo({palette.family.blue}, 4.5) → #4f6afc');
      expect(examples[1]).toContain('#1a1a2e');
      expect(examples[2]).toContain('apca');
    });
  });

  describe('color-names/color-names.module.scssdef', () => {
    const result = parse(readExample('color-names/color-names.module.scssdef'));

    it('parses frontmatter', () => {
      expect(result.frontmatter).toEqual({
        module: 'color-names',
        title: 'Color Names',
        summary: 'Human-readable color naming via nearest-match lookup.',
        category: 'color',
        since: '0.2.0',
        tags: ['color', 'naming', 'accessibility', 'semantics'],
        see: ['builtins'],
      });
    });

    it('exports a single color-name function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('color-name');
    });

    it('parses 1 param with no default', () => {
      const fn = result.functions[0];
      expect(fn.parameters).toHaveLength(1);
      expect(fn.parameters[0]).toEqual({
        name: 'color',
        type: 'color|ref',
        default: null,
        description: 'A hex color value or token reference.',
      });
    });

    it('returns <string>', () => {
      expect(result.functions[0].returnType).toBe('string');
    });

    it('parses 3 examples', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('color-name(#ff6347) → Tomato');
      expect(examples[1]).toContain('#bada55');
      expect(examples[2]).toContain('{palette.brand.primary}');
    });

    it('parses return expression', () => {
      expect(result.functions[0].returnExpression).toBe('color-name($color)');
    });

    it('has no constraints', () => {
      expect(result.functions[0].constraints).toBeUndefined();
    });
  });

  describe('builtins/modular-scale.module.scssdef', () => {
    const result = parse(readExample('builtins/modular-scale.module.scssdef'));

    it('parses frontmatter', () => {
      expect(result.frontmatter).toEqual({
        module: 'builtins',
        title: 'Built-in: modular-scale',
        summary: 'Compute a value at a step on a modular scale.',
        category: 'math',
        since: '0.2.0',
        tags: ['math', 'scale', 'typography', 'spacing'],
        see: undefined,
      });
    });

    it('exports a single modular-scale function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('modular-scale');
    });

    it('parses 3 params: $step (no default), $base (default 16px), $ratio (default 1.25)', () => {
      const fn = result.functions[0];
      expect(fn.parameters).toHaveLength(3);

      expect(fn.parameters[0]).toEqual({
        name: 'step',
        type: 'number',
        default: null,
        description: 'Scale step (0 = base, negative = smaller).',
      });

      expect(fn.parameters[1]).toEqual({
        name: 'base',
        type: 'number|dimension|ref',
        default: '16px',
        description: 'Base value. Default 16px.',
      });

      expect(fn.parameters[2]).toEqual({
        name: 'ratio',
        type: 'number',
        default: '1.25',
        description: 'Scale ratio. Default 1.25 (major third).',
      });
    });

    it('returns <number|dimension>', () => {
      expect(result.functions[0].returnType).toBe('number|dimension');
    });

    it('parses constraint $ratio > 0', () => {
      expect(result.functions[0].constraints).toEqual(['$ratio > 0']);
    });

    it('parses 3 examples', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('modular-scale(0, 16px, 1.25) → 16px');
      expect(examples[1]).toBe('modular-scale(3, 16px, 1.25) → 31.25px');
      expect(examples[2]).toBe('modular-scale(-1, 16px, 1.25) → 12.8px');
    });

    it('parses return expression with pow()', () => {
      expect(result.functions[0].returnExpression).toBe(
        '$base * pow($ratio, $step)',
      );
    });
  });

  describe('shade-tint/shade-tint.module.scssdef', () => {
    const result = parse(readExample('shade-tint/shade-tint.module.scssdef'));

    it('parses frontmatter with oklch tag and see field', () => {
      expect(result.frontmatter).toEqual({
        module: 'shade-tint',
        title: 'Shade & Tint',
        summary: 'Perceptually uniform darkening and lightening via OKLCH.',
        category: 'color',
        since: '0.2.0',
        tags: ['color', 'shade', 'tint', 'oklch', 'perceptual'],
        see: ['builtins'],
      });
    });

    it('exports 2 functions', () => {
      expect(result.functions).toHaveLength(2);
    });

    it('shade: name and summary', () => {
      const shade = result.functions[0];
      expect(shade.name).toBe('shade');
      expect(shade.summary).toBe(
        'Darken a color by reducing OKLCH lightness toward black.',
      );
    });

    it('shade: 2 params with no defaults', () => {
      const shade = result.functions[0];
      expect(shade.parameters).toHaveLength(2);

      expect(shade.parameters[0]).toEqual({
        name: 'color',
        type: 'color|ref',
        default: null,
        description: 'Color to darken.',
      });

      expect(shade.parameters[1]).toEqual({
        name: 'amount',
        type: 'number',
        default: null,
        description: '0 = unchanged, 1 = black.',
      });
    });

    it('shade: returns <color>', () => {
      expect(result.functions[0].returnType).toBe('color');
    });

    it('shade: 2 constraints', () => {
      expect(result.functions[0].constraints).toEqual([
        '$amount >= 0',
        '$amount <= 1',
      ]);
    });

    it('shade: 3 examples', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('shade(#4f6afc, 0.3) → #2a4ab1');
      expect(examples[1]).toContain('{color.blue.500}');
      expect(examples[2]).toBe('shade(#ff6347, 0) → #ff6347');
    });

    it('shade: return expression', () => {
      expect(result.functions[0].returnExpression).toBe(
        'shade($color, $amount)',
      );
    });

    it('tint: name and summary', () => {
      const tint = result.functions[1];
      expect(tint.name).toBe('tint');
      expect(tint.summary).toBe(
        'Lighten a color by increasing OKLCH lightness toward white.',
      );
    });

    it('tint: 2 params with no defaults', () => {
      const tint = result.functions[1];
      expect(tint.parameters).toHaveLength(2);

      expect(tint.parameters[0]).toEqual({
        name: 'color',
        type: 'color|ref',
        default: null,
        description: 'Color to lighten.',
      });

      expect(tint.parameters[1]).toEqual({
        name: 'amount',
        type: 'number',
        default: null,
        description: '0 = unchanged, 1 = white.',
      });
    });

    it('tint: returns <color>', () => {
      expect(result.functions[1].returnType).toBe('color');
    });

    it('tint: 2 constraints', () => {
      expect(result.functions[1].constraints).toEqual([
        '$amount >= 0',
        '$amount <= 1',
      ]);
    });

    it('tint: 3 examples', () => {
      const examples = result.functions[1].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('tint(#4f6afc, 0.3) → #8fa4ff');
      expect(examples[1]).toContain('{color.blue.500}');
      expect(examples[2]).toBe('tint(#ff6347, 0) → #ff6347');
    });

    it('tint: return expression', () => {
      expect(result.functions[1].returnExpression).toBe(
        'tint($color, $amount)',
      );
    });
  });

  describe('fluid-size/fluid-size.module.scssdef', () => {
    const result = parse(readExample('fluid-size/fluid-size.module.scssdef'));

    it('parses frontmatter with responsive category', () => {
      expect(result.frontmatter).toEqual({
        module: 'fluid-size',
        title: 'Fluid Size',
        summary: 'Viewport-responsive sizing via CSS clamp() generation.',
        category: 'responsive',
        since: '0.2.0',
        tags: ['responsive', 'typography', 'spacing', 'clamp', 'viewport'],
        see: undefined,
      });
    });

    it('exports a single fluid-size function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('fluid-size');
    });

    it('parses 4 params: 2 required, 2 with defaults', () => {
      const fn = result.functions[0];
      expect(fn.parameters).toHaveLength(4);

      expect(fn.parameters[0]).toEqual({
        name: 'min',
        type: 'dimension|ref',
        default: null,
        description: 'Size at or below min viewport.',
      });

      expect(fn.parameters[1]).toEqual({
        name: 'max',
        type: 'dimension|ref',
        default: null,
        description: 'Size at or above max viewport.',
      });

      expect(fn.parameters[2]).toEqual({
        name: 'minVP',
        type: 'dimension',
        default: '320px',
        description: 'Min viewport width. Default 320px.',
      });

      expect(fn.parameters[3]).toEqual({
        name: 'maxVP',
        type: 'dimension',
        default: '1200px',
        description: 'Max viewport width. Default 1200px.',
      });
    });

    it('returns <string>', () => {
      expect(result.functions[0].returnType).toBe('string');
    });

    it('parses 2 constraints', () => {
      expect(result.functions[0].constraints).toEqual([
        '$min < $max',
        '$minVP < $maxVP',
      ]);
    });

    it('parses 3 examples', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toContain('clamp(16px');
      expect(examples[1]).toContain('375px');
      expect(examples[2]).toContain('{type.size.min}');
    });

    it('parses return expression', () => {
      expect(result.functions[0].returnExpression).toBe(
        'fluid-size($min, $max, $minVP, $maxVP)',
      );
    });
  });

  describe('material-shadow/material-shadow.module.scssdef', () => {
    const result = parse(
      readExample('material-shadow/material-shadow.module.scssdef'),
    );

    it('parses frontmatter with elevation category', () => {
      expect(result.frontmatter).toEqual({
        module: 'material-shadow',
        title: 'Material Shadow',
        summary: 'Elevation-to-shadow mapping following Material Design 3.',
        category: 'elevation',
        since: '0.2.0',
        tags: ['elevation', 'shadow', 'material', 'depth'],
        see: undefined,
      });
    });

    it('exports a single material-shadow function', () => {
      expect(result.functions).toHaveLength(1);
      expect(result.functions[0].name).toBe('material-shadow');
    });

    it('parses 2 params: $elevation (required), $color (default)', () => {
      const fn = result.functions[0];
      expect(fn.parameters).toHaveLength(2);

      expect(fn.parameters[0]).toEqual({
        name: 'elevation',
        type: 'number',
        default: null,
        description: 'Material elevation level (0-5).',
      });

      expect(fn.parameters[1]).toEqual({
        name: 'color',
        type: 'color',
        default: '#000000',
        description: 'Shadow base color. Default #000000.',
      });
    });

    it('returns <string>', () => {
      expect(result.functions[0].returnType).toBe('string');
    });

    it('parses elevation bounds constraints', () => {
      expect(result.functions[0].constraints).toEqual([
        '$elevation >= 0',
        '$elevation <= 5',
      ]);
    });

    it('parses 3 examples', () => {
      const examples = result.functions[0].examples!;
      expect(examples).toHaveLength(3);
      expect(examples[0]).toBe('material-shadow(0) → none');
      expect(examples[1]).toContain('rgba(0,0,0,0.3)');
      expect(examples[2]).toContain('{color.shadow.base}');
    });

    it('parses return expression', () => {
      expect(result.functions[0].returnExpression).toBe(
        'material-shadow($elevation, $color)',
      );
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
