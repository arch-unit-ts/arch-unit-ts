import { RelativePath } from '../../../../../../main/arch-unit/core/domain/RelativePath';
import { TypeScriptClasses } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { TypeScriptProject } from '../../../../../../main/arch-unit/core/domain/TypeScriptProject';

import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

describe('TypeScriptProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new TypeScriptProject(RelativePath.of('not/a/valid/root/package'))).toThrow(
      'The package not/a/valid/root/package was not found'
    );
  });

  describe('filterClasses', () => {
    it('Should filter', () => {
      const typeScriptProject = TypeScriptProjectFixture.fakeSrc();

      const classes = typeScriptProject.filterClasses('**/package-info.ts');

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
      const allClasses: TypeScriptClasses = TypeScriptProjectFixture.fakeSrc().allClasses();
      expect(allClasses.get().map(typeScriptClass => typeScriptClass.getPath().get())).toEqual([
        'src/test/fake-src/business-context-one/package-info.ts',
        'src/test/fake-src/business-context-one/application/FruitApplicationService.ts',
        'src/test/fake-src/business-context-one/domain/Client.ts',
        'src/test/fake-src/business-context-one/domain/ClientName.ts',
        'src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
        'src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
        'src/test/fake-src/business-context-one/infrastructure/primary/Field.ts',
        'src/test/fake-src/business-context-one/infrastructure/primary/FruitJson.ts',
        'src/test/fake-src/business-context-one/infrastructure/primary/TypeScriptFruitsAdapter.ts',
        'src/test/fake-src/business-context-one/infrastructure/secondary/BadPackageFruitJson.ts',
        'src/test/fake-src/business-context-two/package-info.ts',
        'src/test/fake-src/business-context-two/application/BasketApplicationService.ts',
        'src/test/fake-src/business-context-two/domain/Basket.ts',
        'src/test/fake-src/business-context-two/domain/Fruit.ts',
        'src/test/fake-src/business-context-two/infrastructure/primary/BasketJson.ts',
        'src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts',
        'src/test/fake-src/business-context-two/infrastructure/primary/TypeScriptBasketsAdapter.ts',
        'src/test/fake-src/business-context-two/infrastructure/secondary/BadPackageBasketJson.ts',
        'src/test/fake-src/business-context-two/infrastructure/secondary/BasketRepository.ts',
        'src/test/fake-src/shared-kernel-one/package-info.ts',
        'src/test/fake-src/shared-kernel-one/infrastructure/primary/MoneyJson.ts',
      ]);

      expect(
        allClasses
          .get()
          .find(typeScriptClass => typeScriptClass.name.get() === 'Fruit.ts')
          .getDirectDependenciesToSelf()
          .map(reverseDependency => reverseDependency.owner.name.get())
      ).toEqual(['FruitApplicationService.ts', 'Client.ts', 'Basket.ts']);
    });
  });
});
