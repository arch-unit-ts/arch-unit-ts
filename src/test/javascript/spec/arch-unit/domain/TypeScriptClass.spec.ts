import { TypeScriptClass } from '../../../../../main/arch-unit/domain/TypeScriptClass';

import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('TypeScriptClass', () => {
  const fruitClass = TypeScriptClassFixture.fruit();

  it('Should build', () => {
    expect(fruitClass.name.get()).toEqual('Fruit.ts');
    expect(fruitClass.packagePath.get()).toEqual('src/test/fake-src/business-context-one/domain/fruit');
    expect(fruitClass.dependencies.map(dependency => dependency.typeScriptClass.getPath().get())).toEqual([
      'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
      'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
    ]);
  });

  it.each([null, undefined])('Should not build without file', nullOrUndefined => {
    expect(() => TypeScriptClass.of(nullOrUndefined)).toThrow('file should not be null');
  });

  describe('hasImport', () => {
    it('Should find import', () => {
      expect(fruitClass.hasImport('FruitColor')).toEqual(true);
    });

    it('Should not find when absent', () => {
      expect(fruitClass.hasImport('FruitSmell')).toEqual(false);
    });
  });

  describe('path', () => {
    it('Should get path', () => {
      expect(fruitClass.getPath().get()).toEqual('src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
    });
  });

  describe('resideInAPackage', () => {
    it('Should be true when in the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAPackage('domain');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in a package 'domain'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });

    it('Should be false when not in the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAPackage('north/carolina');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in a package 'north/carolina'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });
  });

  describe('resideInAnyPackage', () => {
    it('Should be true when in a package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAnyPackage(['domain', 'north/carolina']);
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in any package 'domain', 'north/carolina'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });

    it('Should be false when not in a package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAnyPackage(['do main', 'north/carolina']);
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in any package 'do main', 'north/carolina'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });
  });
});
