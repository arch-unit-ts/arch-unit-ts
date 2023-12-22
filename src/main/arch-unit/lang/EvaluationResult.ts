import { ConditionEvents } from './ConditionEvents';

export class EvaluationResult {
  private readonly conditionEvents: ConditionEvents;

  constructor(conditionsEvents: ConditionEvents) {
    this.conditionEvents = conditionsEvents;
  }

  violationReport(): string {
    return this.conditionEvents
      .getViolating()
      .flatMap(conditionEvent => conditionEvent.getDescriptionLines())
      .join('\n');
  }

  hasErrors(): boolean {
    return this.conditionEvents.getViolating().length > 0;
  }

  add(part: EvaluationResult): void {
    part.conditionEvents.getViolating().forEach(violation => this.conditionEvents.add(violation));
  }
}
