import { DescribedPredicate } from '../fluentapi/DescribedPredicate';

import { ArchFunction } from './ArchFunction';

export abstract class ChainableFunction<F, T> implements ArchFunction<F, T> {
  abstract apply(t: F): T;

  public is(predicate: DescribedPredicate<T>): DescribedPredicate<F> {
    return predicate.onResultOf(this);
  }
}
