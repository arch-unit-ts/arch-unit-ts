import { ClassesTransformer } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesTransformer';
import { PackageMatchesPredicate } from '../PackageMatchesPredicate';
import { TypeScriptClassFixture } from '../TypeScriptClassFixture';

describe('ClassTransformer', () => {
  describe('transform', () => {
    it('should filter class based on predicates', () => {
      const classesTransformer = new ClassesTransformer([
        new PackageMatchesPredicate(['business-context-one'], 'context-one'),
        new PackageMatchesPredicate(['fruit'], 'fruit'),
      ]);

      const classesAfterTransform = classesTransformer.transform(TypeScriptClassFixture.fakeSrcClasses());

      expect(classesAfterTransform.map(typeScriptClass => typeScriptClass.path().get())).toEqual([
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });
});
