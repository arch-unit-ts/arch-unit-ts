import { Project } from 'ts-morph';

import { DirectoryName } from '../../../../main/arch-unit/domain/DirectoryName';

import { ArchDirectory } from '@/arch-unit/domain/ArchDirectory';

describe('ArchDirectory', () => {
  it('Should build', () => {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

    const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

    const directory = new ArchDirectory(tsMorphRootDirectory);

    expect(directory.name.get()).toBe('domain');
    expect(directory.directories.map(directory => directory.name.get())).toEqual(['fruit']);
    expect(directory.files.map(file => file.name.get())).toEqual(['Client.ts', 'ClientName.ts']);
    expect(directory.path.get()).toBe('/src/test/fake-src/business-context-one/domain');
  });

  describe('filterFilesByName', () => {
    it('Should filter', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src');

      const directory = new ArchDirectory(tsMorphRootDirectory);
      const files = directory.filterFilesByName('package-info');

      expect(files[0].name.get()).toEqual('package-info.ts');
      expect(files[0].directory.get()).toEqual('business-context-one');

      expect(files[1].name.get()).toEqual('package-info.ts');
      expect(files[1].directory.get()).toEqual('business-context-two');

      expect(files[2].name.get()).toEqual('package-info.ts');
      expect(files[2].directory.get()).toEqual('shared-kernel-one');
    });
  });

  describe('allImports', () => {
    it('Should get all', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const directory = new ArchDirectory(tsMorphRootDirectory);

      expect(directory.allImports().map(importFound => importFound.get())).toEqual([
        '/src/test/fake-src/business-context-one/domain/ClientName.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        '/src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
      ]);
    });
  });
  describe('getDirectory', () => {
    it('Should not find directory', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const directory = new ArchDirectory(tsMorphRootDirectory);

      expect(directory.getDirectory(DirectoryName.of('test')).isEmpty()).toBe(true);
    });

    it('Should find directory', () => {
      const tsMorphProject = new Project({
        tsConfigFilePath: 'tsconfig.json',
      });
      tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

      const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

      const directory = new ArchDirectory(tsMorphRootDirectory);

      expect(directory.getDirectory(DirectoryName.of('fruit')).isPresent()).toBe(true);
    });
  });
});
