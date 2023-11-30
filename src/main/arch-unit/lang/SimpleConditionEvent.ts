import { ConditionEvent } from './ConditionEvent';

export class SimpleConditionEvent implements ConditionEvent {
  readonly description: string;
  private readonly violation: boolean;

  // FIXME Value object et assertions
  constructor(description: string, violation: boolean) {
    this.description = description;
    this.violation = violation;
  }

  invert(): ConditionEvent {
    return new SimpleConditionEvent(this.description, !this.violation);
  }

  isViolation(): boolean {
    return this.violation;
  }

  getDescriptionLines(): string[] {
    return [this.description];
  }
}
