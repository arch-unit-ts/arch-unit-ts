import { PredicateAggregator } from '../../../../../../main/arch-unit/domain/fluentapi/PredicateAggregator';

import { DescribedPredicateFixture } from './DescribedPredicateFixture';

describe('PredicateAggregator', () => {
  it('should build', () => {
    expect(PredicateAggregator.default().getPredicate().isEmpty()).toEqual(true);
  });

  describe('add', () => {
    it('should add to predicate', () => {
      const predicateAggregator = PredicateAggregator.default();
      const newPredicate = predicateAggregator.add(DescribedPredicateFixture.okPredicate());
      expect(newPredicate.getPredicate().orElseThrow()).toEqual(DescribedPredicateFixture.okPredicate());
    });

    it('should add to predicate with "ands" and "ors"', () => {
      const predicateAggregator = PredicateAggregator.default();
      const newPredicate = predicateAggregator
        .thatORs()
        .add(DescribedPredicateFixture.okPredicate())
        .add(DescribedPredicateFixture.koPredicate())
        .thatANDs()
        .add(DescribedPredicateFixture.okPredicate())
        .thatORs()
        .add(DescribedPredicateFixture.koPredicate());

      expect(newPredicate.getPredicate().orElseThrow()).toEqual(
        DescribedPredicateFixture.okPredicate()
          .or(DescribedPredicateFixture.koPredicate())
          .and(DescribedPredicateFixture.okPredicate())
          .or(DescribedPredicateFixture.koPredicate())
      );
    });
  });
});
