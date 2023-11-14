import { Predicate } from './Predicate';

export abstract class DescribedPredicate<T> implements Predicate<T> {
  readonly description: string;

  protected constructor(description: string) {
    this.description = description;
  }

  abstract test(t: T): boolean;
}
