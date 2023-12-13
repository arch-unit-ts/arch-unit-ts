import { ClassesTransformer } from '../../../../../main/arch-unit/lang/ClassesTransformer';
import { PredicateAggregator } from '../../../../../main/arch-unit/lang/synthax/PredicateAggregator';
import { TypeScriptClassesFixture } from '../core/domain/TypeScriptClassesFixture';
import { TypeScriptClassFixture } from '../core/domain/TypeScriptClassFixture';

import { ClassesTransformerFixture } from './ClassesTransformerFixture';

describe('ClassesTransformer', () => {
  it.each([undefined, null])('should not build without description [%s]', nullOrUndefined => {
    expect(() => new ClassesTransformer(nullOrUndefined, null)).toThrow('description should not be null');
  });

  it.each([undefined, null])('should not build without predicateAggregator [%s]', nullOrUndefined => {
    expect(() => new ClassesTransformer('description', nullOrUndefined)).toThrow('predicateAggregator should not be null');
  });

  describe('getDescription', () => {
    it('should get description', () => {
      expect(ClassesTransformerFixture.contextOneFruitTransformer().getDescription()).toEqual('classes');
    });
  });

  describe('getDescription', () => {
    it('should get full description', () => {
      expect(ClassesTransformerFixture.contextOneFruitTransformer().getFullDescription()).toEqual('classes context-one and fruit');
    });

    it('should only get classes transformer description when predicate is empty', () => {
      expect(new ClassesTransformer('classes of transformer', PredicateAggregator.default()).getFullDescription()).toEqual(
        'classes of transformer'
      );
    });
  });

  describe('transform', () => {
    it('should not filter with empty aggregator', () => {
      const classesTransformer = new ClassesTransformer('description classes transformer', PredicateAggregator.default());

      const classesAfterTransform = classesTransformer.transform(TypeScriptClassFixture.businessContextOneClasses());

      expect(classesAfterTransform.map(typeScriptClass => typeScriptClass.getPath().get())).toEqual([
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

      const classesAfterTransform = classesTransformer.transform(TypeScriptClassesFixture.fakeSrcClasses().get());

      expect(classesAfterTransform.map(typeScriptClass => typeScriptClass.getPath().get())).toEqual([
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });
});
