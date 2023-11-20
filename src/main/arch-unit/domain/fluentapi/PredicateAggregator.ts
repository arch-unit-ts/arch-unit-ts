import { Optional } from '../../../common/domain/Optional';
import { Assert } from '../../../error/domain/Assert';

import { DescribedPredicate } from './DescribedPredicate';

export class PredicateAggregator<T> {
  private readonly addMode: AddMode<T>;
  private readonly predicate: Optional<DescribedPredicate<T>>;

  private constructor(addMode: AddMode<T>, predicate: Optional<DescribedPredicate<T>>) {
    Assert.notNullOrUndefined('addMode', addMode);
    this.addMode = addMode;
    this.predicate = predicate;
  }

  public static default() {
    return new PredicateAggregator(AddMode.and(), Optional.empty());
  }

  public getPredicate(): Optional<DescribedPredicate<T>> {
    return this.predicate;
  }

  public add(other: DescribedPredicate<T>): PredicateAggregator<T> {
    return new PredicateAggregator<T>(this.addMode, Optional.of(this.addMode.apply(this.predicate, other)));
  }

  public thatANDs(): PredicateAggregator<T> {
    return new PredicateAggregator<T>(AddMode.and(), this.predicate);
  }

  public thatORs(): PredicateAggregator<T> {
    return new PredicateAggregator<T>(AddMode.or(), this.predicate);
  }
}

abstract class AddMode<T> {
  abstract apply(first: Optional<DescribedPredicate<T>>, other: DescribedPredicate<T>): DescribedPredicate<T>;

  static and() {
    return new AndMode();
  }

  static or() {
    return new OrMode();
  }
}

class AndMode<T> extends AddMode<T> {
  apply(first: Optional<DescribedPredicate<T>>, other: DescribedPredicate<T>): DescribedPredicate<T> {
    return first.isPresent() ? first.orElseThrow().and(other) : other;
  }
}

class OrMode<T> extends AddMode<T> {
  apply(first: Optional<DescribedPredicate<T>>, other: DescribedPredicate<T>): DescribedPredicate<T> {
    return first.isPresent() ? first.orElseThrow().or(other) : other;
  }
}
