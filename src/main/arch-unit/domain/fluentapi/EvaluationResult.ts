import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';

export class EvaluationResult {
  private readonly conditionEvents: ConditionEvents;

  constructor(conditionsEvents: ConditionEvents) {
    this.conditionEvents = conditionsEvents;
  }

  violationReport(): string {
    return this.conditionEvents
      .getViolating()
      .map(conditionEvent => conditionEvent.description)
      .join('\n');
  }

  hasErrors(): boolean {
    return this.conditionEvents.getViolating().length > 0;
  }
}
