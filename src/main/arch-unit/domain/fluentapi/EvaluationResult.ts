import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';

export class EvaluationResult {
  private readonly conditionEvents: ConditionEvent[];

  constructor(conditionsEvents: ConditionEvent[]) {
    this.conditionEvents = conditionsEvents;
  }

  errorMessage(): string {
    return this.conditionEvents
      .filter(conditionEvent => conditionEvent.violation)
      .map(conditionEvent => conditionEvent.description)
      .join('\n');
  }

  hasErrors() {
    return this.conditionEvents.filter(conditionEvent => conditionEvent.violation).length > 0;
  }
}
