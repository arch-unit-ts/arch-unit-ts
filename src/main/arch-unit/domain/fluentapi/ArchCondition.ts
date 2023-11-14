import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';

export abstract class ArchCondition<T> {
  readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract check(item: T, events: ConditionEvents): void;
}
