import { Assert } from '../../error/domain/Assert';

import { ArchFunction } from './ArchFunction';
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

  public onResultOf<F>(function_: ArchFunction<F, T>): DescribedPredicate<F> {
    return new OnResultOfPredicate(this, function_);
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

class OnResultOfPredicate<F, T> extends DescribedPredicate<F> {
  private readonly current: DescribedPredicate<T>;
  private readonly function_: ArchFunction<F, T>;

  constructor(current: DescribedPredicate<T>, function_: ArchFunction<F, T>) {
    super(current.description);
    this.current = current;
    this.function_ = function_;
  }

  public test(input: F): boolean {
    return this.current.test(this.function_.apply(input));
  }
}
