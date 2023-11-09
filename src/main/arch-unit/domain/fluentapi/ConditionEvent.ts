export class ConditionEvent {
  readonly description: string;
  readonly violation: boolean;

  // FIXME Value object et assertions
  constructor(description: string, violation: boolean) {
    this.description = description;
    this.violation = violation;
  }

  invert(): ConditionEvent {
    return new ConditionEvent(this.description, !this.violation);
  }
}
