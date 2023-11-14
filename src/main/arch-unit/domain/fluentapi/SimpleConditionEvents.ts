import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';

export class SimpleConditionEvents implements ConditionEvents {
  private readonly violating: ConditionEvent[] = [];

  add(event: ConditionEvent): void {
    if (event.violation) {
      this.violating.push(event);
    }
  }

  getViolating(): ConditionEvent[] {
    return this.violating;
  }
}
