import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';

export class ViolatedAndSatisfiedConditionEvents implements ConditionEvents {
  private readonly allowedEvents: ConditionEvent[];
  private readonly violatingEvents: ConditionEvent[];

  constructor() {
    this.allowedEvents = [];
    this.violatingEvents = [];
  }

  add(event: ConditionEvent): void {
    if (event.isViolation()) {
      this.violatingEvents.push(event);
    } else {
      this.allowedEvents.push(event);
    }
  }

  getViolating(): ConditionEvent[] {
    return this.violatingEvents;
  }

  public getAllowed(): ConditionEvent[] {
    return this.allowedEvents;
  }

  containViolation(): boolean {
    return this.violatingEvents.length > 0;
  }
}
