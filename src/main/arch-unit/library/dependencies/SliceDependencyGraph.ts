import { Comparators } from '../../../common/domain/Comparators';
import { Dependency } from '../../core/domain/TypeScriptClass';

import { Slices } from './Slices';

export class SliceDependencyGraph {
  private readonly dependenciesBySlices: Map<string, Map<string, Dependency[]>>;

  private constructor(dependenciesBySlices: Map<string, Map<string, Dependency[]>>) {
    this.dependenciesBySlices = dependenciesBySlices;
  }

  /**
   * An edge goes from a slice to another one when a class of the first slice imports a class of the second one.
   * Dependencies inside a slice, and dependencies on classes that belong to no slice, are ignored.
   */
  static of(slices: Slices): SliceDependencyGraph {
    const dependenciesBySlices = new Map<string, Map<string, Dependency[]>>();
    slices.getSlices().forEach(slice => dependenciesBySlices.set(slice.getName(), new Map<string, Dependency[]>()));

    slices.getSlices().forEach(slice =>
      slice.classes
        .flatMap(typeScriptClass => typeScriptClass.dependencies)
        .forEach(dependency =>
          slices
            .sliceOf(dependency.typeScriptClass)
            .filter(target => target.getName() !== slice.getName())
            .ifPresent(target => {
              const edges = dependenciesBySlices.get(slice.getName())!;
              edges.set(target.getName(), [...(edges.get(target.getName()) ?? []), dependency]);
            })
        )
    );

    return new SliceDependencyGraph(dependenciesBySlices);
  }

  toAdjacency(): Map<string, string[]> {
    return new Map([...this.dependenciesBySlices].map(([slice, edges]) => [slice, [...edges.keys()]]));
  }

  dependenciesBetween(origin: string, target: string): Dependency[] {
    const dependencies = this.dependenciesBySlices.get(origin)?.get(target) ?? [];
    const distinctDependencies = new Map(dependencies.map(dependency => [dependency.getDescription(), dependency]));
    return [...distinctDependencies.values()].sort((first, second) =>
      Comparators.compareStrings(first.getDescription(), second.getDescription())
    );
  }
}
