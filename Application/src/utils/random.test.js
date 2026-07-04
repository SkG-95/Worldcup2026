import { describe, it, expect } from 'vitest';
import { seeded, seededShuffle } from './random';

describe('seeded', () => {
  it('produit toujours la même séquence pour une même graine', () => {
    const a = seeded(2026);
    const b = seeded(2026);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('renvoie des valeurs dans [0,1)', () => {
    const rnd = seeded(42);
    for (let i = 0; i < 20; i++) {
      const v = rnd();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('seededShuffle', () => {
  it('conserve les mêmes éléments (permutation)', () => {
    const arr = ['A', 'B', 'C', 'D', 'E'];
    const shuffled = seededShuffle(arr, 7);
    expect(shuffled).toHaveLength(arr.length);
    expect([...shuffled].sort()).toEqual([...arr].sort());
  });

  it('est déterministe pour une même graine', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    expect(seededShuffle(arr, 99)).toEqual(seededShuffle(arr, 99));
  });

  it('ne modifie pas le tableau d\'origine', () => {
    const arr = ['A', 'B', 'C'];
    const copy = [...arr];
    seededShuffle(arr, 3);
    expect(arr).toEqual(copy);
  });
});
