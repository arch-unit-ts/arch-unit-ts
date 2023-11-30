import { ArchFunction } from './ArchFunction';
import { DescribedPredicate } from './DescribedPredicate';

export abstract class ChainableFunction<F, T> implements ArchFunction<F, T> {
  abstract apply(t: F): T;

  public is(predicate: DescribedPredicate<T>): DescribedPredicate<F> {
    return predicate.onResultOf(this);
  }
}
