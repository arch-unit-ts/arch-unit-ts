import { CycleDetector } from '../../../../../../main/arch-unit/library/dependencies/CycleDetector';

describe('CycleDetector', () => {
  const graphOf = (edges: Record<string, string[]>): Map<string, string[]> => new Map(Object.entries(edges));

  it('should find no cycle in an acyclic graph', () => {
    const result = CycleDetector.detect(graphOf({ a: ['b', 'c'], b: ['c'], c: [] }), 100);

    expect(result).toEqual({ cycles: [], limitReached: false });
  });

  it('should find no cycle in an empty graph', () => {
    expect(CycleDetector.detect(new Map(), 100)).toEqual({ cycles: [], limitReached: false });
  });

  it('should find a cycle between two nodes', () => {
    expect(CycleDetector.detect(graphOf({ a: ['b'], b: ['a'] }), 100).cycles).toEqual([['a', 'b']]);
  });

  it('should find a cycle between three nodes starting with its smallest node', () => {
    expect(CycleDetector.detect(graphOf({ c: ['a'], a: ['b'], b: ['c'] }), 100).cycles).toEqual([['a', 'b', 'c']]);
  });

  it('should find independent cycles', () => {
    const result = CycleDetector.detect(graphOf({ a: ['b'], b: ['a'], c: ['d'], d: ['c'], e: [] }), 100);

    expect(result.cycles).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('should find every elementary cycle of a complete graph, shortest first', () => {
    const result = CycleDetector.detect(graphOf({ a: ['b', 'c'], b: ['a', 'c'], c: ['a', 'b'] }), 100);

    expect(result.cycles).toEqual([
      ['a', 'b'],
      ['a', 'c'],
      ['b', 'c'],
      ['a', 'b', 'c'],
      ['a', 'c', 'b'],
    ]);
    expect(result.limitReached).toEqual(false);
  });

  it('should ignore nodes that are reachable from a cycle without coming back', () => {
    expect(CycleDetector.detect(graphOf({ a: ['b'], b: ['a', 'c'], c: ['d'], d: [] }), 100).cycles).toEqual([['a', 'b']]);
  });

  it('should ignore self loops, duplicated edges and edges to unknown nodes', () => {
    const result = CycleDetector.detect(graphOf({ a: ['a', 'b', 'b', 'unknown'], b: ['a'] }), 100);

    expect(result.cycles).toEqual([['a', 'b']]);
  });

  it('should not depend on the insertion order of the graph', () => {
    const first = CycleDetector.detect(graphOf({ a: ['b', 'c'], b: ['c', 'a'], c: ['b', 'a'] }), 100);
    const second = CycleDetector.detect(graphOf({ c: ['a', 'b'], b: ['a', 'c'], a: ['c', 'b'] }), 100);

    expect(first).toEqual(second);
  });

  it('should stop at the maximum number of cycles and tell that the limit is reached', () => {
    const result = CycleDetector.detect(graphOf({ a: ['b', 'c'], b: ['a', 'c'], c: ['a', 'b'] }), 2);

    expect(result.cycles).toHaveLength(2);
    expect(result.limitReached).toEqual(true);
  });

  it('should not tell that the limit is reached when the cycles fit exactly in it', () => {
    const result = CycleDetector.detect(graphOf({ a: ['b'], b: ['a'], c: ['d'], d: ['c'] }), 2);

    expect(result.cycles).toHaveLength(2);
    expect(result.limitReached).toEqual(false);
  });

  it('should reject a maximum number of cycles below one', () => {
    expect(() => CycleDetector.detect(new Map(), 0)).toThrow('maxNumberOfCycles should not be less than 1');
  });

  it('should order cycles by code unit order, whatever the locale', () => {
    const result = CycleDetector.detect(graphOf({ Billing: ['api'], api: ['Billing', 'orders'], orders: ['api'] }), 100);

    expect(result.cycles).toEqual([
      ['Billing', 'api'],
      ['api', 'orders'],
    ]);
  });
});
