import { describe, it, expect } from 'vitest';
import { analyzeTeam } from './analyzeTeam';

describe('analyzeTeam', () => {
  it('renvoie null si l\'équipe n\'a pas encore joué', () => {
    expect(analyzeTeam('FRA', [])).toBeNull();
  });

  it('détecte une équipe invaincue et la mentionne comme leader', () => {
    const matches = [
      { phase: 'groups', group: 'I', status: 'finished', home: 'FRA', away: 'SEN', homeScore: 2, awayScore: 0 },
      { phase: 'groups', group: 'I', status: 'finished', home: 'NOR', away: 'FRA', homeScore: 0, awayScore: 1 },
    ];
    const analysis = analyzeTeam('FRA', matches);
    expect(analysis.W).toBe(2);
    expect(analysis.L).toBe(0);
    expect(analysis.rank).toBe(1);
    expect(analysis.txt).toContain('France');
    expect(analysis.txt).toContain('Leader de son groupe');
  });

  it('détecte une équipe en difficulté après des défaites', () => {
    const matches = [
      { phase: 'groups', group: 'I', status: 'finished', home: 'FRA', away: 'SEN', homeScore: 0, awayScore: 2 },
    ];
    const analysis = analyzeTeam('FRA', matches);
    expect(analysis.L).toBe(1);
    expect(analysis.txt).toContain('passe difficile');
  });

  it('calcule la forme sur les 3 derniers matchs (V/N/D)', () => {
    const matches = [
      { phase: 'groups', group: 'I', status: 'finished', home: 'FRA', away: 'SEN', homeScore: 1, awayScore: 1 },
      { phase: 'groups', group: 'I', status: 'finished', home: 'NOR', away: 'FRA', homeScore: 0, awayScore: 2 },
    ];
    const analysis = analyzeTeam('FRA', matches);
    expect(analysis.form).toEqual(['N', 'V']);
  });
});
