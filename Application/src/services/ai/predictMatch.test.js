import { describe, it, expect } from 'vitest';
import { predictMatch } from './predictMatch';

describe('predictMatch', () => {
  it('renvoie null si une des deux équipes est inconnue (non tirée au sort)', () => {
    expect(predictMatch({ home: null, away: 'FRA' }, [])).toBeNull();
    expect(predictMatch({ home: 'FRA', away: null }, [])).toBeNull();
  });

  it('renvoie une prédiction par défaut si une équipe ne joue dans aucun groupe recensé', () => {
    const pred = predictMatch({ home: 'XXX', away: 'YYY' }, []);
    expect(pred).toEqual({ home: 40, draw: 22, away: 38 });
  });

  it('renvoie des pourcentages dont la somme fait 100', () => {
    const pred = predictMatch({ home: 'FRA', away: 'SEN' }, []);
    expect(pred.home + pred.draw + pred.away).toBe(100);
    expect(pred.home).toBeGreaterThanOrEqual(5);
    expect(pred.away).toBeGreaterThanOrEqual(5);
  });

  it('favorise l\'équipe la mieux classée dans son groupe', () => {
    const matches = [
      { phase: 'groups', group: 'I', status: 'finished', home: 'FRA', away: 'IRQ', homeScore: 3, awayScore: 0 },
    ];
    const pred = predictMatch({ home: 'FRA', away: 'SEN' }, matches);
    expect(pred.home).toBeGreaterThan(pred.away);
  });
});
