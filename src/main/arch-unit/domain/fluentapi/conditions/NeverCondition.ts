import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';
import { InvertingConditionEvents } from '@/arch-unit/domain/fluentapi/InvertingConditionEvents';

export class NeverCondition<T> extends ArchCondition<T> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>) {
    super('never ' + condition.description);
    this.condition = condition;
  }

  check(item: T, events: ConditionEvents): void {
    this.condition.check(item, new InvertingConditionEvents(events));
  }
}
