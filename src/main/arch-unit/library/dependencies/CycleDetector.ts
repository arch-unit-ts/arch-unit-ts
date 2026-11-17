import { Comparators } from '../../../common/domain/Comparators';
import { Assert } from '../../../error/domain/Assert';

export interface DetectedCycles {
  readonly cycles: string[][];
  readonly limitReached: boolean;
}

/**
 * Finds the elementary cycles of a directed graph given as an adjacency map (node -> nodes it points to).
 *
 * Each cycle is listed once, starting with its smallest node, and cycles are sorted by length then node by node,
 * so that the result does not depend on the insertion order of the graph.
 * Nodes are compared by code unit, whatever the locale: uppercase letters come before lowercase ones.
 * Self loops and edges to unknown nodes are ignored.
 * At most `maxNumberOfCycles` cycles are returned, `limitReached` tells that more exist.
 * When the limit is reached, the cycles kept are the first ones found (searching from the smallest node), not the shortest ones:
 * they are sorted afterwards, but a shorter cycle starting from a larger node may be missing.
 * Paths that do not lead back to the starting node are not pruned: the search time can grow exponentially on a large, densely
 * connected group of slices whose smallest slice is on a small isolated cycle. Realistic graphs are not affected.
 */
export class CycleDetector {
  private readonly nodes: string[];
  private readonly successors: number[][];
  private readonly predecessors: number[][];
  private readonly maxNumberOfCycles: number;
  private readonly cycles: number[][] = [];
  private limitReached: boolean = false;

  private constructor(graph: Map<string, string[]>, maxNumberOfCycles: number) {
    this.maxNumberOfCycles = maxNumberOfCycles;
    this.nodes = [...graph.keys()].sort();
    const indexes = new Map(this.nodes.map((node, index) => [node, index]));

    this.successors = this.nodes.map(node => {
      const targets = graph
        .get(node)!
        .filter(target => indexes.has(target))
        .map(target => indexes.get(target)!)
        .filter(target => target !== indexes.get(node));
      return [...new Set(targets)].sort((first, second) => first - second);
    });
    this.predecessors = this.nodes.map(() => []);
    this.successors.forEach((targets, source) => targets.forEach(target => this.predecessors[target].push(source)));
  }

  static detect(graph: Map<string, string[]>, maxNumberOfCycles: number): DetectedCycles {
    Assert.min('maxNumberOfCycles', maxNumberOfCycles, 1);
    return new CycleDetector(graph, maxNumberOfCycles).detectCycles();
  }

  private detectCycles(): DetectedCycles {
    for (let start = 0; start < this.nodes.length && !this.limitReached; start++) {
      const component = this.componentOf(start);
      if (component.size > 1) {
        this.findCyclesThrough(start, component);
      }
    }

    return {
      cycles: this.cycles.map(cycle => cycle.map(node => this.nodes[node])).sort((first, second) => this.compare(first, second)),
      limitReached: this.limitReached,
    };
  }

  private compare(first: string[], second: string[]): number {
    return first.length - second.length || Comparators.compareStringArrays(first, second);
  }

  /** Nodes greater than start that are on a cycle through start, start included. */
  private componentOf(start: number): Set<number> {
    const reachable = this.walk(start, this.successors);
    const reaching = this.walk(start, this.predecessors);
    return new Set([...reachable].filter(node => reaching.has(node)));
  }

  private walk(start: number, edges: number[][]): Set<number> {
    const visited = new Set<number>([start]);
    const toVisit = [start];
    while (toVisit.length > 0) {
      edges[toVisit.pop()!]
        .filter(next => next > start && !visited.has(next))
        .forEach(next => {
          visited.add(next);
          toVisit.push(next);
        });
    }
    return visited;
  }

  private findCyclesThrough(start: number, component: Set<number>): void {
    const path = [start];
    const onPath = new Set<number>([start]);

    const explore = (node: number): void => {
      for (const next of this.successors[node]) {
        if (this.limitReached) {
          return;
        }
        if (next === start) {
          this.record(path);
        } else if (component.has(next) && !onPath.has(next)) {
          path.push(next);
          onPath.add(next);
          explore(next);
          onPath.delete(next);
          path.pop();
        }
      }
    };

    explore(start);
  }

  private record(path: number[]): void {
    if (this.cycles.length === this.maxNumberOfCycles) {
      this.limitReached = true;
    } else {
      this.cycles.push([...path]);
    }
  }
}
