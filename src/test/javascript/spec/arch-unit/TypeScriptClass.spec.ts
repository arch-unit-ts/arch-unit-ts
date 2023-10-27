import { Project } from 'ts-morph';

import { TypeScriptClass } from '../../../../main/arch-unit/domain/TypeScriptClass';

function getTypeScriptClass(className: string): TypeScriptClass {
  const tsMorphProject = new Project({
    tsConfigFilePath: 'tsconfig.json',
  });

  return new TypeScriptClass(tsMorphProject.getSourceFile(className));
}

describe('TypeScriptClass', () => {
  it('Should build', () => {
    const fruitClass: TypeScriptClass = getTypeScriptClass('Fruit.ts');

    expect(fruitClass.name.get()).toEqual('Fruit.ts');
    expect(fruitClass.packageName.get()).toEqual('fruit');
    expect(fruitClass.importPaths.map(path => path.get())).toEqual([
      '/src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
      '/src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
    ]);
  });

  describe('hasImport', () => {
    it('Should find import', () => {
      const fruitClass = getTypeScriptClass('Fruit.ts');
      expect(fruitClass.hasImport('FruitColor')).toEqual(true);
    });

    it('Should not find when absent', () => {
      const fruitClass = getTypeScriptClass('Fruit.ts');
      expect(fruitClass.hasImport('FruitSmell')).toEqual(false);
    });
  });
});
