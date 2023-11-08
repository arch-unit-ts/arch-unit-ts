import { MorphProjectFixture } from './MorphProjectFixture';

import { PackageName } from '@/arch-unit/domain/PackageName';
import { TypeScriptPackage } from '@/arch-unit/domain/TypeScriptPackage';

describe('TypeScriptPackage', () => {
  const fakeSrcMorphProject = MorphProjectFixture.fakeSrc();

  it('Should build', () => {
    const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

    const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

    expect(typeScriptPackage.name.get()).toBe('domain');
    expect(typeScriptPackage.packages.map(typeScriptPackage => typeScriptPackage.name.get())).toEqual(['fruit']);
    expect(typeScriptPackage.classes.map(typeScriptClass => typeScriptClass.name.get())).toEqual(['Client.ts', 'ClientName.ts']);
    expect(typeScriptPackage.path.get()).toBe('/src/test/fake-src/business-context-one/domain');
  });

  describe('filterClassesByClassName', () => {
    it('Should filter', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);
      const classes = typeScriptPackage.filterClassesByClassName('package-info');

      expect(classes[0].name.get()).toEqual('package-info.ts');
      expect(classes[0].packagePath.get()).toEqual('/src/test/fake-src/business-context-one');

      expect(classes[1].name.get()).toEqual('package-info.ts');
      expect(classes[1].packagePath.get()).toEqual('/src/test/fake-src/business-context-two');

      expect(classes[2].name.get()).toEqual('package-info.ts');
      expect(classes[2].packagePath.get()).toEqual('/src/test/fake-src/shared-kernel-one');
    });
  });

  describe('allClasses', () => {
    it('Should get all', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.allClasses().map(typeScriptClass => typeScriptClass.name.get())).toEqual([
        'Client.ts',
        'ClientName.ts',
        'Fruit.ts',
        'FruitColor.ts',
        'FruitType.ts',
      ]);
    });
  });

  describe('allDependencies', () => {
    it('Should get all', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.allDependencies().map(dependency => dependency.path.get())).toEqual([
        '/src/test/fake-src/business-context-one/domain/ClientName.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });

  describe('getPackage', () => {
    it('Should not find package', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.getPackage(PackageName.of('test')).isEmpty()).toBe(true);
    });

    it('Should find package', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.getPackage(PackageName.of('fruit')).isPresent()).toBe(true);
    });
  });
  describe('filterClassesByPackageIdentifier', () => {
    it('should find classes', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(
        typeScriptPackage.filterClassesByPackageIdentifier('business-context-one').map(typeScriptClass => typeScriptClass.path().get())
      ).toEqual([
        '/src/test/fake-src/business-context-one/package-info.ts',
        '/src/test/fake-src/business-context-one/domain/Client.ts',
        '/src/test/fake-src/business-context-one/domain/ClientName.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });
});
