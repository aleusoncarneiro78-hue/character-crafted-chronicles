import { describe, expect, it } from 'vitest';
import { correctScore, wrongScore, medalFor, missions } from '../lib/explorer';
describe('Missão Instituto Aberto', () => {
  it('includes at least five different areas', () => { expect(new Set(missions.map(m => m.name)).size).toBeGreaterThanOrEqual(5); });
  it('gains points for correct answers', () => { expect(correctScore(100)).toBe(200); });
  it('loses points for wrong answers', () => { expect(wrongScore(100)).toBe(75); });
  it('does not go below zero', () => { expect(wrongScore(0)).toBe(0); });
  it('provides all four medal tiers', () => { expect([1000, 800, 600, 400].map(s => medalFor(s).name)).toEqual(['Ouro', 'Prata', 'Bronze', 'Madeira']); });
  it('requires daily mandatory uniform', () => { const q = missions[0].questions[1]; expect(q.options[q.answer]).toBe('Diariamente, de forma obrigatória'); });
});