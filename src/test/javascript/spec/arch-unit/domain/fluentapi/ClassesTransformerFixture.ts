import { ClassesTransformer } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesTransformer';
import { PackageMatchesPredicate } from '../PackageMatchesPredicate';

export class ClassesTransformerFixture {
  static contextOneFruitTransformer = (): ClassesTransformer => {
    return new ClassesTransformer([
      new PackageMatchesPredicate(['business-context-one'], 'context-one'),
      new PackageMatchesPredicate(['fruit'], 'fruit'),
    ]);
  };

  static contextTwoTransformer = (): ClassesTransformer => {
    return new ClassesTransformer([new PackageMatchesPredicate(['business-context-two'], 'context-two')]);
  };
}
