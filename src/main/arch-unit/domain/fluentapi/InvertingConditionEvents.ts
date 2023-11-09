import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';
import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';

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
}
