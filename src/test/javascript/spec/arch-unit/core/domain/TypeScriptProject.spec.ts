import { RelativePath } from '../../../../../../main/arch-unit/core/domain/RelativePath';
import { TypeScriptProject } from '../../../../../../main/arch-unit/core/domain/TypeScriptProject';

import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

describe('TypeScriptProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new TypeScriptProject(RelativePath.of('not/a/valid/root/package'))).toThrow(
      'The package not/a/valid/root/package was not found'
    );
  });

  describe('filterClassesByClassName', () => {
    it('Should filter', () => {
      const typeScriptProject = TypeScriptProjectFixture.fakeSrc();

      const classes = typeScriptProject.filterClassesByClassName('package-info');

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
      expect(
        TypeScriptProjectFixture.fakeSrc()
          .allClasses()
          .map(typeScriptClass => typeScriptClass.getPath().get())
      ).toEqual([
        'src/test/fake-src/business-context-one/package-info.ts',
        'src/test/fake-src/business-context-one/application/FruitApplicationService.ts',
        'src/test/fake-src/business-context-one/domain/Client.ts',
        'src/test/fake-src/business-context-one/domain/ClientName.ts',
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
        'src/test/fake-src/business-context-one/infrastructure/primary/Field.ts',
        'src/test/fake-src/business-context-one/infrastructure/secondary/FruitJson.ts',
        'src/test/fake-src/business-context-two/package-info.ts',
        'src/test/fake-src/business-context-two/application/BasketApplicationService.ts',
        'src/test/fake-src/business-context-two/domain/Basket.ts',
        'src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts',
        'src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts',
        'src/test/fake-src/shared-kernel-one/package-info.ts',
        'src/test/fake-src/shared-kernel-one/infrastructure/primary/MoneyJson.ts',
      ]);
    });
  });
});
