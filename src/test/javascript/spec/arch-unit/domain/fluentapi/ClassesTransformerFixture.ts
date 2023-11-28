import { ClassesTransformer } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesTransformer';
import { PredicateAggregator } from '../../../../../../main/arch-unit/domain/fluentapi/PredicateAggregator';

import { DescribedPredicateFixture } from './DescribedPredicateFixture';
import { DescriptionFixture } from './DescriptionFixture';

export class ClassesTransformerFixture {
  static contextOneFruitTransformer = (): ClassesTransformer => {
    const predicateAggregator = PredicateAggregator.default()
      .add(DescribedPredicateFixture.packageMatchesPredicate(['business-context-one'], 'context-one'))
      .add(DescribedPredicateFixture.packageMatchesPredicate(['fruit'], 'fruit'));
    return new ClassesTransformer(DescriptionFixture.classesTransformer(), predicateAggregator);
  };

  static contextTwoTransformer = (): ClassesTransformer => {
    const predicateAggregator = PredicateAggregator.default().add(
      DescribedPredicateFixture.packageMatchesPredicate(['business-context-two'], 'context-two')
    );
    return new ClassesTransformer(DescriptionFixture.classesTransformer(), predicateAggregator);
  };
}
