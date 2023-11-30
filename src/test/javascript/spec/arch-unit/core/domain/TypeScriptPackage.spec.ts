import { TypeScriptPackage } from '../../../../../../main/arch-unit/core/domain/TypeScriptPackage';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

describe('TypeScriptPackage', () => {
  const fakeSrcMorphProject = MorphProjectFixture.fakeSrc();

  it('Should build', () => {
    const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src/business-context-one/domain');

    const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);

    expect(typeScriptPackage.name.get()).toBe('domain');
    expect(typeScriptPackage.packages.map(typeScriptPackage => typeScriptPackage.name.get())).toEqual(['fruit']);
    expect(typeScriptPackage.classes.map(typeScriptClass => typeScriptClass.name.get())).toEqual(['Client.ts', 'ClientName.ts']);
    expect(typeScriptPackage.path.get()).toBe('src/test/fake-src/business-context-one/domain');
  });

  describe('containsExactly', () => {
    const typeScriptPackage = new TypeScriptPackage(fakeSrcMorphProject.getDirectory('src/test/fake-src'));
    it('Should contain exactly', () => {
      expect(typeScriptPackage.containsExactly(['business-context-one', 'business-context-two', 'shared-kernel-one'])).toBe(true);
    });

    it('Should be false with wrong directories', () => {
      expect(typeScriptPackage.containsExactly(['bananes'])).toBe(false);
    });
  });

  describe('filterClassesByClassName', () => {
    it('Should filter', () => {
      const tsMorphRootDirectory = fakeSrcMorphProject.getDirectory('src/test/fake-src');

      const typeScriptPackage = new TypeScriptPackage(tsMorphRootDirectory);
      const classes = typeScriptPackage.filterClassesByClassName('package-info');

      expect(classes[0].name.get()).toEqual('package-info.ts');
      expect(classes[0].packagePath.get()).toEqual('src/test/fake-src/business-context-one');

      expect(classes[1].name.get()).toEqual('package-info.ts');
      expect(classes[1].packagePath.get()).toEqual('src/test/fake-src/business-context-two');

      expect(classes[2].name.get()).toEqual('package-info.ts');
      expect(classes[2].packagePath.get()).toEqual('src/test/fake-src/shared-kernel-one');
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
});
