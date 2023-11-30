import { ClassesTransformer } from '../../../../../main/arch-unit/lang/ClassesTransformer';
import { PredicateAggregator } from '../../../../../main/arch-unit/lang/synthax/PredicateAggregator';
import { DescribedPredicateFixture } from '../base/DescribedPredicateFixture';
import { DescriptionFixture } from '../base/DescriptionFixture';

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
