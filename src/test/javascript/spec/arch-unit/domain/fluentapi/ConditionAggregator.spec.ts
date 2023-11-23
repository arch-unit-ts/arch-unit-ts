import { ConditionAggregator } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionAggregator';

import { ArchConditionFixture } from './ArchConditionFixture';

describe('ConditionAggregator', () => {
  it('should build', () => {
    expect(ConditionAggregator.default().getCondition().isEmpty()).toEqual(true);
  });

  describe('add', () => {
    it('should add to predicate', () => {
      const conditionAggregator = ConditionAggregator.default();
      const newCondition = conditionAggregator.add(ArchConditionFixture.okCondition());
      expect(newCondition.getCondition().orElseThrow()).toEqual(ArchConditionFixture.okCondition());
    });

    it('should add to predicate with "ands" and "ors"', () => {
      const conditionAggregator = ConditionAggregator.default();
      const newCondition = conditionAggregator
        .thatORs()
        .add(ArchConditionFixture.okCondition())
        .add(ArchConditionFixture.koCondition())
        .thatANDs()
        .add(ArchConditionFixture.okCondition())
        .thatORs()
        .add(ArchConditionFixture.koCondition());

      expect(newCondition.getCondition().orElseThrow()).toEqual(
        ArchConditionFixture.okCondition()
          .or(ArchConditionFixture.koCondition())
          .and(ArchConditionFixture.okCondition())
          .or(ArchConditionFixture.koCondition())
      );
    });
  });
});
