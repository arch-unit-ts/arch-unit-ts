import { TypeScriptClassFixture } from '../TypeScriptClassFixture';

import { ClassesTransformerFixture } from './ClassesTransformerFixture';

describe('ClassTransformer', () => {
  describe('transform', () => {
    it('should filter class based on predicates', () => {
      const classesTransformer = ClassesTransformerFixture.contextOneFruitTransformer();

      const classesAfterTransform = classesTransformer.transform(TypeScriptClassFixture.fakeSrcClasses());

      expect(classesAfterTransform.map(typeScriptClass => typeScriptClass.path().get())).toEqual([
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });
});
