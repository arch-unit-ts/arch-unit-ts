import { Optional } from '../../../common/domain/Optional';
import { Assert } from '../../../error/domain/Assert';
import { HasDescription } from '../../base/HasDescription';
import { ArchCondition } from '../ArchCondition';

export class ConditionAggregator<T> implements HasDescription {
  private readonly addMode: AddMode<T>;
  private readonly condition: Optional<ArchCondition<T>>;

  private constructor(addMode: AddMode<T>, condition: Optional<ArchCondition<T>>) {
    Assert.notNullOrUndefined('addMode', addMode);
    this.addMode = addMode;
    this.condition = condition;
  }

  public static default() {
    return new ConditionAggregator(AddMode.and(), Optional.empty());
  }

  public getCondition(): Optional<ArchCondition<T>> {
    return this.condition;
  }

  public add(other: ArchCondition<T>): ConditionAggregator<T> {
    return new ConditionAggregator<T>(this.addMode, Optional.of(this.addMode.apply(this.condition, other)));
  }

  public thatANDs(): ConditionAggregator<T> {
    return new ConditionAggregator<T>(AddMode.and(), this.condition);
  }

  public thatORs(): ConditionAggregator<T> {
    return new ConditionAggregator<T>(AddMode.or(), this.condition);
  }

  getDescription(): string {
    return this.condition.map(condition => condition.description).orElse('(empty condition)');
  }
}

abstract class AddMode<T> {
  abstract apply(first: Optional<ArchCondition<T>>, other: ArchCondition<T>): ArchCondition<T>;

  static and() {
    return new AndMode();
  }

  static or() {
    return new OrMode();
  }
}

class AndMode<T> extends AddMode<T> {
  apply(first: Optional<ArchCondition<T>>, other: ArchCondition<T>): ArchCondition<T> {
    return first.isPresent() ? first.orElseThrow().and(other) : other;
  }
}

class OrMode<T> extends AddMode<T> {
  apply(first: Optional<ArchCondition<T>>, other: ArchCondition<T>): ArchCondition<T> {
    return first.isPresent() ? first.orElseThrow().or(other) : other;
  }
}
