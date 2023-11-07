import { Project } from 'ts-morph';

import { PackageName } from '../../../../main/arch-unit/domain/PackageName';
import { TypeScriptPackage } from '../../../../main/arch-unit/domain/TypeScriptPackage';

describe('TypeScriptPackage', () => {
  it('Should build', () => {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

    const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

    const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

    expect(typeScriptPackage.name.get()).toBe('domain');
    expect(typeScriptPackage.packages.map(typeScriptPackage => typeScriptPackage.name.get())).toEqual(['fruit']);
    expect(typeScriptPackage.classes.map(typeScriptClass => typeScriptClass.name.get())).toEqual(['Client.ts', 'ClientName.ts']);
    expect(typeScriptPackage.path.get()).toBe('/src/test/fake-src/business-context-one/domain');
  });

  describe('filterClassesByName', () => {
    it('Should filter', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);
      const classes = typeScriptPackage.filterClassesByName('package-info');

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
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

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
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

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
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.getPackage(PackageName.of('test')).isEmpty()).toBe(true);
    });

    it('Should find package', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

      expect(typeScriptPackage.getPackage(PackageName.of('fruit')).isPresent()).toBe(true);
    });
  });
});
