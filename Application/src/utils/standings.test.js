import { describe, it, expect } from 'vitest';
import { computeStandings } from './standings';

describe('computeStandings', () => {
  it('renvoie toutes les équipes du groupe à zéro sans match joué', () => {
    const rows = computeStandings([], 'A');
    expect(rows).toHaveLength(4);
    expect(rows.every(r => r.P === 0 && r.Pts === 0)).toBe(true);
  });

  it('ignore les matchs à venir (status "scheduled")', () => {
    const matches = [
      { phase: 'groups', group: 'A', status: 'scheduled', home: 'MEX', away: 'KOR', homeScore: null, awayScore: null },
    ];
    const rows = computeStandings(matches, 'A');
    expect(rows.every(r => r.P === 0)).toBe(true);
  });

  it('calcule correctement points, buts et classement après un match terminé', () => {
    const matches = [
      { phase: 'groups', group: 'A', status: 'finished', home: 'MEX', away: 'KOR', homeScore: 2, awayScore: 0 },
    ];
    const rows = computeStandings(matches, 'A');
    const mex = rows.find(r => r.team === 'MEX');
    const kor = rows.find(r => r.team === 'KOR');
    expect(mex).toMatchObject({ P: 1, W: 1, D: 0, L: 0, GF: 2, GA: 0, Pts: 3 });
    expect(kor).toMatchObject({ P: 1, W: 0, D: 0, L: 1, GF: 0, GA: 2, Pts: 0 });
    expect(rows[0].team).toBe('MEX');
  });

  it('trie par différence de buts puis par buts marqués en cas d\'égalité de points', () => {
    const matches = [
      { phase: 'groups', group: 'A', status: 'finished', home: 'MEX', away: 'KOR', homeScore: 1, awayScore: 1 },
      { phase: 'groups', group: 'A', status: 'finished', home: 'RSA', away: 'CZE', homeScore: 3, awayScore: 3 },
    ];
    const rows = computeStandings(matches, 'A');
    // RSA/CZE (3-3, diff 0, GF 3) doivent passer devant MEX/KOR (1-1, diff 0, GF 1)
    expect(['RSA', 'CZE']).toContain(rows[0].team);
    expect(['RSA', 'CZE']).toContain(rows[1].team);
  });
});
