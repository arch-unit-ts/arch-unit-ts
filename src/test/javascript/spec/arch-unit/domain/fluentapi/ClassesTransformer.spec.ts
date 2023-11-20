import { ClassesTransformer } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesTransformer';
import { PredicateAggregator } from '../../../../../../main/arch-unit/domain/fluentapi/PredicateAggregator';
import { TypeScriptClassFixture } from '../TypeScriptClassFixture';

import { ClassesTransformerFixture } from './ClassesTransformerFixture';

describe('ClassesTransformer', () => {
  describe('transform', () => {
    it('should not filter with empty aggregator', () => {
      const classesTransformer = new ClassesTransformer(PredicateAggregator.default());

      const classesAfterTransform = classesTransformer.transform(TypeScriptClassFixture.businessContextOneClasses());

      expect(classesAfterTransform.map(typeScriptClass => typeScriptClass.path().get())).toEqual([
        'src/test/fake-src/business-context-one/package-info.ts',
        'src/test/fake-src/business-context-one/application/FruitApplicationService.ts',
        'src/test/fake-src/business-context-one/domain/Client.ts',
        'src/test/fake-src/business-context-one/domain/ClientName.ts',
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
        'src/test/fake-src/business-context-one/infrastructure/primary/Field.ts',
        'src/test/fake-src/business-context-one/infrastructure/secondary/FruitJson.ts',
      ]);
    });

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
