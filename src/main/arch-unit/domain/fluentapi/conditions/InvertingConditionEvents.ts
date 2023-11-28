import { ConditionEvent } from './ConditionEvent';
import { ConditionEvents } from './ConditionEvents';

export class InvertingConditionEvents implements ConditionEvents {
  readonly delegate: ConditionEvents;

  constructor(delegate: ConditionEvents) {
    this.delegate = delegate;
  }

  add(event: ConditionEvent): void {
    this.delegate.add(event.invert());
  }

  getViolating(): ConditionEvent[] {
    return this.delegate.getViolating();
  }

  containViolation(): boolean {
    return this.delegate.containViolation();
  }
}
