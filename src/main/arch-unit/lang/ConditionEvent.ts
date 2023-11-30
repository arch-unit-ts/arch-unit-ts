export interface ConditionEvent {
  isViolation(): boolean;
  invert(): ConditionEvent;
  getDescriptionLines(): string[];
}
