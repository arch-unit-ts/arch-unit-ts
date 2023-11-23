import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';

export class SimpleConditionEvents implements ConditionEvents {
  private readonly violations: ConditionEvent[] = [];

  add(event: ConditionEvent): void {
    if (event.isViolation()) {
      this.violations.push(event);
    }
  }

  getViolating(): ConditionEvent[] {
    return this.violations;
  }

  containViolation(): boolean {
    return this.violations.length > 0;
  }
}
