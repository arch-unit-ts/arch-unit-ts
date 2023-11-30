import { DescribedPredicateFixture } from './DescribedPredicateFixture';

describe('DescribePredicate', () => {
  describe('and', () => {
    it('should and true and true', () => {
      const trueAndTrue = DescribedPredicateFixture.okPredicate().and(DescribedPredicateFixture.okPredicate());
      expect(trueAndTrue.description).toEqual("I'm ok and I'm ok");
      expect(trueAndTrue.test(null)).toEqual(true);
    });
    it('should and true and false', () => {
      const trueAndTrue = DescribedPredicateFixture.okPredicate().and(DescribedPredicateFixture.koPredicate());
      expect(trueAndTrue.description).toEqual("I'm ok and I'm ko");
      expect(trueAndTrue.test(null)).toEqual(false);
    });
    it('should and false and false', () => {
      const trueAndTrue = DescribedPredicateFixture.koPredicate().and(DescribedPredicateFixture.koPredicate());
      expect(trueAndTrue.description).toEqual("I'm ko and I'm ko");
      expect(trueAndTrue.test(null)).toEqual(false);
    });
  });

  describe('or', () => {
    it('should or true and true', () => {
      const trueAndTrue = DescribedPredicateFixture.okPredicate().or(DescribedPredicateFixture.okPredicate());
      expect(trueAndTrue.description).toEqual("I'm ok or I'm ok");
      expect(trueAndTrue.test(null)).toEqual(true);
    });
    it('should or true and false', () => {
      const trueAndTrue = DescribedPredicateFixture.okPredicate().or(DescribedPredicateFixture.koPredicate());
      expect(trueAndTrue.description).toEqual("I'm ok or I'm ko");
      expect(trueAndTrue.test(null)).toEqual(true);
    });
    it('should or false and false', () => {
      const trueAndTrue = DescribedPredicateFixture.koPredicate().or(DescribedPredicateFixture.koPredicate());
      expect(trueAndTrue.description).toEqual("I'm ko or I'm ko");
      expect(trueAndTrue.test(null)).toEqual(false);
    });
  });
});
