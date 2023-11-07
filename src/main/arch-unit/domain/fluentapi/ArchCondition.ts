import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';

export abstract class ArchCondition<T> {
  private readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract check(item: T, events: ConditionEvent[]): void;
}
