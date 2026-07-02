import { ArchConfiguration } from '../../../../../../main/arch-unit/ArchConfiguration';
import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('TypeScriptClass', () => {
  console.warn = jest.fn();
  const fruitClass = TypeScriptClassFixture.fruitContextOne();

  it('Should build', () => {
    expect(fruitClass.name.get()).toEqual('Fruit.ts');
    expect(fruitClass.packagePath.get()).toEqual('src/test/fake-src/business-context-one/domain/fruit');
    expect(fruitClass.dependencies.map(dependency => dependency.typeScriptClass.getPath().get())).toEqual([
      'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
      'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
    ]);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it('Should build with warnings', () => {
    const fileWithUnknownImport = TypeScriptClassFixture.fileWithUnknownImport();

    expect(fileWithUnknownImport.name.get()).toEqual('FileWithUnknownImport.ts');
    expect(fileWithUnknownImport.packagePath.get()).toEqual('src/test/other-src');
    expect(fileWithUnknownImport.dependencies).toEqual([]);

    expect(console.warn).toHaveBeenCalledWith(
      'arch-unit-ts (Ignored import) : could not find the source file for the import : ./Sheep in file FileWithUnknownImport.ts'
    );
  });

  it('Should build with unknown import but without warning when disabled', () => {
    (console.warn as jest.Mock).mockClear();
    jest.spyOn(ArchConfiguration, 'get').mockReturnValue(new ArchConfiguration(false, false));

    const fileWithUnknownImport = TypeScriptClassFixture.fileWithUnknownImport();

    expect(fileWithUnknownImport.dependencies).toEqual([]);
    expect(console.warn).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it.each([null, undefined])('Should not build without file', nullOrUndefined => {
    expect(() => TypeScriptClass.of(nullOrUndefined as unknown as never)).toThrow('file should not be null or undefined');
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

  describe('path with dots', () => {
    it('Should get path with dots', () => {
      expect(fruitClass.getPath().getDotsPath()).toEqual('src.test.fake-src.business-context-one.domain.fruit.Fruit.ts');
    });
  });

  describe('resideInAPackage', () => {
    it('Should be true when in the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAPackage('..domain..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in a package '..domain..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });

    it('Should be false when not in the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAPackage('..north.carolina..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in a package '..north.carolina..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });
  });

  describe('resideInAnyPackage', () => {
    it('Should be true when in a package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAnyPackage(['..domain..', '..north.carolina..']);
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in any package '..domain..', '..north.carolina..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });

    it('Should be false when not in a package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideInAnyPackage(['..do*main..', '..north.carolina..']);
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside in any package '..do*main..', '..north.carolina..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });
  });

  describe('resideOutsideOfPackage', () => {
    it('Should be false when inside the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideOutsideOfPackage('..domain..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside outside of package '..domain..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });

    it('Should be true when outside the package', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideOutsideOfPackage('..north.carolina..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside outside of package '..north.carolina..'");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });
  });

  describe('resideOutsideOfPackages', () => {
    it('Should be true when outside', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideOutsideOfPackages('..do*main..', '..north.carolina..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside outside of packages ['..do*main..', '..north.carolina..']");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(true);
    });

    it('Should be false when inside', () => {
      const typeScriptClassDescribedPredicate = TypeScriptClass.resideOutsideOfPackages('..domain..', '..north.carolina..');
      expect(typeScriptClassDescribedPredicate.description).toEqual("reside outside of packages ['..domain..', '..north.carolina..']");
      expect(typeScriptClassDescribedPredicate.test(fruitClass)).toEqual(false);
    });
  });

  describe('areDecoratedWith', () => {
    it('should have correct description', () => {
      const predicate = TypeScriptClass.areDecoratedWith('Transactional');
      expect(predicate.description).toEqual('are decorated with @Transactional');
    });

    it('should return true when class has the decorator', () => {
      const classTransactionalFile = MorphProjectFixture.fakeSrc().getSourceFile('ClassTransactionalApplicationService.ts')!;
      const classTransactional = TypeScriptClass.of(classTransactionalFile);

      const predicate = TypeScriptClass.areDecoratedWith('Transactional');
      expect(predicate.test(classTransactional)).toEqual(true);
    });

    it('should return false when class does not have the decorator', () => {
      const predicate = TypeScriptClass.areDecoratedWith('Transactional');
      expect(predicate.test(fruitClass)).toEqual(false);
    });

    it('should return false for class without source file', () => {
      const classWithoutSourceFile = TypeScriptClass.withoutDependencies(fruitClass.name, fruitClass.packagePath);
      const predicate = TypeScriptClass.areDecoratedWith('Transactional');
      expect(predicate.test(classWithoutSourceFile)).toEqual(false);
    });
  });

  describe('getDecorators', () => {
    it('should return decorator names for decorated class', () => {
      const classTransactionalFile = MorphProjectFixture.fakeSrc().getSourceFile('ClassTransactionalApplicationService.ts')!;
      const classTransactional = TypeScriptClass.of(classTransactionalFile);

      expect(classTransactional.getDecorators()).toEqual(['Transactional']);
    });

    it('should return empty array for non-decorated class', () => {
      expect(fruitClass.getDecorators()).toEqual([]);
    });

    it('should return empty array for class without source file', () => {
      const classWithoutSourceFile = TypeScriptClass.withoutDependencies(fruitClass.name, fruitClass.packagePath);
      expect(classWithoutSourceFile.getDecorators()).toEqual([]);
    });
  });

  describe('getSourceFile', () => {
    it('should return the source file when created with of()', () => {
      expect(fruitClass.getSourceFile()).toBeDefined();
    });

    it('should return undefined when created with withoutDependencies()', () => {
      const classWithoutSourceFile = TypeScriptClass.withoutDependencies(fruitClass.name, fruitClass.packagePath);
      expect(classWithoutSourceFile.getSourceFile()).toBeUndefined();
    });
  });
});
