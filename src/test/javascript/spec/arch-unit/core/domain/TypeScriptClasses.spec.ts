import { TypeScriptClasses } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { TypeScriptPackage } from '../../../../../../main/arch-unit/core/domain/TypeScriptPackage';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

describe('TypeScriptClasses', () => {
  it('Should build and populate reverse dependencies', () => {
    const fakeSrcMorphProject = MorphProjectFixture.fakeSrc();
    const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one');
    const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

    const typeScriptClasses = new TypeScriptClasses(typeScriptPackage.allClasses());

    expect(typeScriptClasses.get().map(typeScriptClass => typeScriptClass.name.get())).toEqual([
      'NotToInclude.ts',
      'package-info.ts',
      'FruitApplicationService.ts',
      'Client.ts',
      'ClientName.ts',
      'Fruit.ts',
      'FruitColor.ts',
      'FruitType.ts',
      'Field.ts',
      'FruitJson.ts',
    ]);

    expect(getReverseDependencies(typeScriptClasses, 'Client.ts')).toEqual([]);
    expect(getReverseDependencies(typeScriptClasses, 'ClientName.ts')).toEqual(['Client.ts']);
    expect(getReverseDependencies(typeScriptClasses, 'Fruit.ts')).toEqual(['FruitApplicationService.ts', 'Client.ts']);
    expect(getReverseDependencies(typeScriptClasses, 'FruitColor.ts')).toEqual(['FruitApplicationService.ts', 'Fruit.ts']);
    expect(getReverseDependencies(typeScriptClasses, 'FruitType.ts')).toEqual(['FruitApplicationService.ts', 'Fruit.ts']);
  });
});

function getReverseDependencies(typeScriptClasses: TypeScriptClasses, className: string): string[] {
  return typeScriptClasses
    .get()
    .find(typeScriptClass => typeScriptClass.name.get() === className)
    .getDirectDependenciesToSelf()
    .map(reverseDependency => reverseDependency.owner.name.get());
}
