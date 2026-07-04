import { describe, it, expect } from 'vitest';
import { buildQuiz } from './quiz';

describe('buildQuiz', () => {
  it('génère 5 questions sans match d\'ouverture connu', () => {
    const quiz = buildQuiz([], 1);
    expect(quiz).toHaveLength(5);
  });

  it('génère 6 questions quand le match d\'ouverture est disponible', () => {
    const matches = [{ id: 'GA-1-02', home: 'MEX', away: 'KOR' }];
    const quiz = buildQuiz(matches, 1);
    expect(quiz).toHaveLength(6);
  });

  it('est déterministe pour une même graine', () => {
    const matches = [{ id: 'GA-1-02', home: 'MEX', away: 'KOR' }];
    expect(buildQuiz(matches, 123)).toEqual(buildQuiz(matches, 123));
  });

  it('chaque question a une réponse présente parmi ses options', () => {
    const quiz = buildQuiz([], 5);
    quiz.forEach(q => {
      expect(q.options).toContain(q.answer);
    });
  });
});
