import { describe, it, expect } from 'vitest';
import { createRegistry } from '../src/index.js';
import type { FunctionDeclaration } from '@dtcg-formulas/parser';

const mockDeclaration: FunctionDeclaration = {
  name: 'snap',
  summary: 'Snap a value to a step.',
  parameters: [
    { name: 'value', type: 'number|dimension|ref', default: null, description: 'The value to snap.' },
    { name: 'step', type: 'number|dimension|ref', default: '1px', description: 'The snap interval.' },
    { name: 'mode', type: 'nearest|floor|ceil', default: 'nearest', description: 'The rounding mode.' },
  ],
  returnType: 'number|dimension',
  returnExpression: 'round($value, $step, $mode)',
  examples: ['snap(15.6px, 1px, nearest) → 16px'],
};

describe('createRegistry()', () => {
  it('pre-registers built-in functions', () => {
    const reg = createRegistry();
    const builtins = reg.list().filter((k) => k.startsWith('builtins#'));
    expect(builtins).toEqual([
      'builtins#clamp',
      'builtins#max',
      'builtins#min',
      'builtins#round',
    ]);
  });

  it('resolves built-in round', () => {
    const reg = createRegistry();
    const round = reg.resolve('builtins#round');
    expect(round).not.toBeNull();
    expect(round!.name).toBe('round');
    expect(round!.parameters).toHaveLength(3);
  });

  it('resolves built-in clamp with constraints', () => {
    const reg = createRegistry();
    const clamp = reg.resolve('builtins#clamp');
    expect(clamp).not.toBeNull();
    expect(clamp!.constraints).toEqual(['$min <= $max']);
  });

  it('registers and resolves custom declarations', () => {
    const reg = createRegistry();
    reg.register('tokens/functions/math.module.scssdef', 'snap', mockDeclaration);

    const result = reg.resolve('tokens/functions/math.module.scssdef#snap');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('snap');
    expect(result!.returnExpression).toBe('round($value, $step, $mode)');
  });

  it('returns null for unknown refs', () => {
    const reg = createRegistry();
    expect(reg.resolve('nonexistent#foo')).toBeNull();
  });

  it('throws on duplicate registration', () => {
    const reg = createRegistry();
    reg.register('path', 'fn', mockDeclaration);
    expect(() => reg.register('path', 'fn', mockDeclaration)).toThrow(
      'Duplicate registration: "path#fn" is already registered',
    );
  });

  it('lists all registered refs sorted', () => {
    const reg = createRegistry();
    reg.register('z-path', 'zeta', mockDeclaration);
    reg.register('a-path', 'alpha', mockDeclaration);

    const all = reg.list();
    expect(all[0]).toBe('a-path#alpha');
    expect(all[all.length - 1]).toBe('z-path#zeta');
  });
});
