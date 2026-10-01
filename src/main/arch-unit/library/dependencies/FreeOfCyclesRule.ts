import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClasses } from '../../core/domain/TypeScriptClass';
import { AllowEmptyShould } from '../../lang/AllowEmptyShould';
import { ArchRule } from '../../lang/ArchRule';
import { EvaluationResult } from '../../lang/EvaluationResult';
import { SimpleConditionEvent } from '../../lang/SimpleConditionEvent';
import { SimpleConditionEvents } from '../../lang/SimpleConditionEvents';

import { CycleDetector } from './CycleDetector';
import { SliceAssignment } from './SliceAssignment';
import { SliceDependencyGraph } from './SliceDependencyGraph';
import { Slices } from './Slices';

export class FreeOfCyclesRule implements ArchRule {
  static readonly MAX_NUMBER_OF_CYCLES: number = 100;
  static readonly MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE: number = 20;

  private readonly assignment: SliceAssignment;
  private readonly reason: Optional<string>;
  private readonly allowEmptyShouldValue: AllowEmptyShould;

  constructor(
    assignment: SliceAssignment,
    reason: Optional<string> = Optional.empty(),
    allowEmptyShould = AllowEmptyShould.asConfigured()
  ) {
    this.assignment = assignment;
    this.reason = reason;
    this.allowEmptyShouldValue = allowEmptyShould;
  }

  because(reason: string): FreeOfCyclesRule {
    return new FreeOfCyclesRule(this.assignment, Optional.of(reason), this.allowEmptyShouldValue);
  }

  allowEmptyShould(allowEmptyShould: boolean): FreeOfCyclesRule {
    return new FreeOfCyclesRule(this.assignment, this.reason, AllowEmptyShould.fromBoolean(allowEmptyShould));
  }

  getDescription(): string {
    return `${this.assignment.getDescription()} should be free of cycles${this.reason.map(reason => ` because ${reason}`).orElse('')}`;
  }

  check(classes: TypeScriptClasses): void {
    const evaluationResult = this.evaluate(classes);
    if (evaluationResult.hasErrors()) {
      throw new Error(`Architecture violation : Rule ${this.getDescription()}.\nErrors : ${evaluationResult.violationReport()}`);
    }
  }

  evaluate(classes: TypeScriptClasses): EvaluationResult {
    const slices = Slices.of(classes, this.assignment);
    this.verifyNoEmptyShouldIfEnabled(slices);

    const graph = SliceDependencyGraph.of(slices);
    const detectedCycles = CycleDetector.detect(graph.toAdjacency(), FreeOfCyclesRule.MAX_NUMBER_OF_CYCLES);

    const conditionEvents = new SimpleConditionEvents();
    detectedCycles.cycles.forEach(cycle => conditionEvents.add(SimpleConditionEvent.violated(this.describeCycle(cycle, graph))));
    if (detectedCycles.limitReached) {
      conditionEvents.add(
        SimpleConditionEvent.violated(
          `The search stops after ${FreeOfCyclesRule.MAX_NUMBER_OF_CYCLES} cycles, more cycles exist between these slices`
        )
      );
    }
    return new EvaluationResult(conditionEvents);
  }

  private describeCycle(cycle: string[], graph: SliceDependencyGraph): string {
    const edges = cycle.map((origin, index) => ({ origin, target: cycle[(index + 1) % cycle.length] }));
    const lines = [`Cycle detected: ${[...cycle, cycle[0]].join(' -> ')}`];

    edges.forEach(({ origin, target }) => {
      const dependencies = graph.dependenciesBetween(origin, target);
      lines.push(`  Dependencies of Slice ${origin} on Slice ${target}:`);
      dependencies
        .slice(0, FreeOfCyclesRule.MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE)
        .forEach(dependency => lines.push(`    - ${dependency.getDescription()}`));
      if (dependencies.length > FreeOfCyclesRule.MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE) {
        lines.push(`    - ... and ${dependencies.length - FreeOfCyclesRule.MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE} more`);
      }
    });

    return lines.join('\n');
  }

  private verifyNoEmptyShouldIfEnabled(slices: Slices): void {
    if (slices.isEmpty() && !this.allowEmptyShouldValue.isAllowed()) {
      throw new Error(
        `Rule '${this.getDescription()}' failed to check any slices. ` +
          'This means either that no classes have been passed to the rule at all, ' +
          'or that no classes passed to the rule were assigned to a slice. ' +
          'To allow rules being evaluated without checking any slices you can ' +
          "use '.allowEmptyShould(true)' on a single rule or use the default configuration."
      );
    }
  }
}
