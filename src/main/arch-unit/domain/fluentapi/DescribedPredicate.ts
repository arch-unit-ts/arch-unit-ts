import { Assert } from '../../../error/domain/Assert';

import { Predicate } from './Predicate';

export abstract class DescribedPredicate<T> implements Predicate<T> {
  readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract test(t: T): boolean;

  public and(other: DescribedPredicate<T>): DescribedPredicate<T> {
    return new AndPredicate<T>(this, other);
  }

  public or(other: DescribedPredicate<T>): DescribedPredicate<T> {
    return new OrPredicate<T>(this, other);
  }
}

class AndPredicate<T> extends DescribedPredicate<T> {
  private readonly current: DescribedPredicate<T>;
  private readonly other: DescribedPredicate<T>;

  constructor(current: DescribedPredicate<T>, other: DescribedPredicate<T>) {
    Assert.notNullOrUndefined('current', current);
    Assert.notNullOrUndefined('other', other);
    super(current.description + ' and ' + other.description);
    this.current = current;
    this.other = other;
  }

  public test(input: T): boolean {
    return this.current.test(input) && this.other.test(input);
  }
}

class OrPredicate<T> extends DescribedPredicate<T> {
  private readonly current: DescribedPredicate<T>;
  private readonly other: DescribedPredicate<T>;

  constructor(current: DescribedPredicate<T>, other: DescribedPredicate<T>) {
    Assert.notNullOrUndefined('current', current);
    Assert.notNullOrUndefined('other', other);
    super(current.description + ' or ' + other.description);
    this.current = current;
    this.other = other;
  }

  public test(input: T): boolean {
    return this.current.test(input) || this.other.test(input);
  }
}
