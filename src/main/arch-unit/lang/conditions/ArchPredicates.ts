import { DescribedPredicate } from '../../base/DescribedPredicate';

export abstract class ArchPredicates {
  public static have<T>(predicate: DescribedPredicate<T>): DescribedPredicate<T> {
    return predicate.as('have ' + predicate.description);
  }
}
