import { Project } from 'ts-morph';

import { ArchFile } from '@/arch-unit/domain/ArchFile';

function getArchFile(fileName: string) {
  const tsMorphProject = new Project({
    tsConfigFilePath: 'tsconfig.json',
  });

  return new ArchFile(tsMorphProject.getSourceFile(fileName));
}

describe('ArchFile', () => {
  it('Should build', () => {
    const fruitFile = getArchFile('Fruit.ts');

    expect(fruitFile.name.get()).toEqual('Fruit.ts');
    expect(fruitFile.directory.get()).toEqual('business-context-one');
    expect(fruitFile.importPaths).toEqual([
      '/src/test/fake-src/business-context-one/FruitColor.ts',
      '/src/test/fake-src/business-context-one/FruitType.ts',
    ]);
  });

  describe('hasImport', () => {
    it('Should find import', () => {
      const fruitFile = getArchFile('Fruit.ts');
      expect(fruitFile.hasImport('FruitColor')).toEqual(true);
    });

    it('Should not find when absent', () => {
      const fruitFile = getArchFile('Fruit.ts');
      expect(fruitFile.hasImport('FruitSmell')).toEqual(false);
    });
  });
});
