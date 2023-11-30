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
}
