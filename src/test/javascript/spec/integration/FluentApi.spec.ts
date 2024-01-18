import { ArchRuleDefinition } from '../../../../main/arch-unit/lang/synthax/ArchRuleDefinition';
import { Architectures } from '../../../../main/arch-unit/library/Architectures';
import { TypeScriptProjectFixture } from '../arch-unit/core/domain/TypeScriptProjectFixture';

describe('FluentApi', () => {
  const archProjectFakeSrc = TypeScriptProjectFixture.fakeSrc();
  it('should test "and" and "or" predicate combination', () => {
    expect(() =>
      ArchRuleDefinition.classes()
        .that()
        .resideInAPackage('business-context-two')
        .and()
        .resideInAPackage('domain')
        .or()
        .resideInAPackage('fruit')
        .should()
        .onlyDependOnClassesThat()
        .resideInAPackage('not_existing_package')
        .because('I want the test to fail')
        .check(archProjectFakeSrc.allClasses())
    ).toThrow(
      "Architecture violation : Rule classes reside in a package 'business-context-two' and reside in a package 'domain' or reside in a package 'fruit' should only depend on classes that reside in a package 'not_existing_package' because I want the test to fail.\n" +
        'Errors : Dependency src.test.fake-src.business-context-one.domain.fruit.FruitColor.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitType.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BadPackageBasketJson.ts in src.test.fake-src.business-context-two.domain.Basket.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-two.domain.Basket.ts\n' +
        'Dependency src.test.fake-src.shared-kernel-one.infrastructure.primary.MoneyJson.ts in src.test.fake-src.business-context-two.domain.Basket.ts'
    );
  });

  it('should test "and" and "or" condition combination', () => {
    expect(() =>
      ArchRuleDefinition.classes()
        .should()
        .dependOnClassesThat()
        .resideInAPackage('business-context-one')
        .andShould()
        .dependOnClassesThat()
        .resideInAPackage('fruit')
        .orShould()
        .onlyDependOnClassesThat()
        .resideInAPackage('business-context-two')
        .because('I want the test to fail')
        .check(archProjectFakeSrc.allClasses())
    ).toThrow(
      "Architecture violation : Rule classes should depend on classes that reside in a package 'business-context-one' and depend on classes that reside in a package 'fruit' or only depend on classes that reside in a package 'business-context-two' because I want the test to fail.\n" +
        'Errors : Dependency src.test.hexagonal.BusinessContext.ts in src.test.fake-src.business-context-one.package-info.ts\n' +
        'Dependency src.test.fake-src.business-context-one.infrastructure.primary.FruitJson.ts in src.test.fake-src.business-context-one.infrastructure.primary.TypeScriptFruitsAdapter.ts\n' +
        'Dependency src.test.hexagonal.BusinessContext.ts in src.test.fake-src.business-context-two.package-info.ts\n' +
        'Dependency src.test.fake-src.shared-kernel-one.infrastructure.primary.MoneyJson.ts in src.test.fake-src.business-context-two.infrastructure.primary.BasketJson.ts\n' +
        'Dependency src.test.fake-src.business-context-one.infrastructure.primary.TypeScriptFruitsAdapter.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BasketRepository.ts\n' +
        'Dependency src.test.hexagonal.SharedKernel.ts in src.test.fake-src.shared-kernel-one.package-info.ts'
    );
  });

  it('should test "and" and "or" condition combination with invert', () => {
    expect(() =>
      ArchRuleDefinition.noClasses()
        .should()
        .dependOnClassesThat()
        .resideInAPackage('business-context-one')
        .andShould()
        .dependOnClassesThat()
        .resideInAPackage('fruit')
        .orShould()
        .onlyDependOnClassesThat()
        .resideInAPackage('business-context-two')
        .because('I want the test to fail')
        .check(archProjectFakeSrc.allClasses())
    ).toThrow(
      "Architecture violation : Rule no classes should depend on classes that reside in a package 'business-context-one' and depend on classes that reside in a package 'fruit' or only depend on classes that reside in a package 'business-context-two' because I want the test to fail.\n" +
        'Errors : Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-one.application.FruitApplicationService.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitColor.ts in src.test.fake-src.business-context-one.application.FruitApplicationService.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitType.ts in src.test.fake-src.business-context-one.application.FruitApplicationService.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.ClientName.ts in src.test.fake-src.business-context-one.domain.Client.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-one.domain.Client.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitColor.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitType.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.primary.TypeScriptBasketsAdapter.ts in src.test.fake-src.business-context-two.application.BasketApplicationService.ts\n' +
        'Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-two.domain.Basket.ts\n' +
        'Dependency src.test.fake-src.business-context-two.domain.Basket.ts in src.test.fake-src.business-context-two.domain.Fruit.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BadPackageBasketJson.ts in src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.primary.TypeScriptBasketsAdapter.ts in src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.primary.BasketJson.ts in src.test.fake-src.business-context-two.infrastructure.primary.TypeScriptBasketsAdapter.ts\n' +
        'Dependency src.test.fake-src.business-context-two.application.BasketApplicationService.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BadPackageBasketJson.ts\n' +
        'Dependency src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BadPackageBasketJson.ts'
    );
  });

  it('Should throw error when mandatory layer is absent', () => {
    expect(() =>
      Architectures.layeredArchitecture()
        .consideringOnlyDependenciesInAnyPackage('src.test.fake-src.shared-kernel-one')
        .withOptionalLayers(false)
        .layer('domain models', 'src.test.fake-src.shared-kernel-one.domain..')
        .layer('domain services', 'src.test.fake-src.shared-kernel-one.domain..')
        .layer('application services', 'src.test.fake-src.shared-kernel-one.application..')
        .layer('primary adapters', 'src.test.fake-src.shared-kernel-one.infrastructure.primary..')
        .layer('secondary adapters', 'src.test.fake-src.shared-kernel-one.infrastructure.secondary..')
        .optionalLayer('optional', 'src.test.fake-src.shared-kernel-one.optional..')
        .check(archProjectFakeSrc.allClasses())
    ).toThrow(
      "Architecture violation : Rule Layered architecture considering only dependencies in any package ['src.test.fake-src.shared-kernel-one'], consisting of\n" +
        "layer 'domain models' (reside in any package 'src.test.fake-src.shared-kernel-one.domain..')\n" +
        "layer 'domain services' (reside in any package 'src.test.fake-src.shared-kernel-one.domain..')\n" +
        "layer 'application services' (reside in any package 'src.test.fake-src.shared-kernel-one.application..')\n" +
        "layer 'primary adapters' (reside in any package 'src.test.fake-src.shared-kernel-one.infrastructure.primary..')\n" +
        "layer 'secondary adapters' (reside in any package 'src.test.fake-src.shared-kernel-one.infrastructure.secondary..')\n" +
        "optional layer 'optional' (reside in any package 'src.test.fake-src.shared-kernel-one.optional..').\n" +
        "Errors : Layer 'domain models' is empty\n" +
        "Layer 'domain services' is empty\n" +
        "Layer 'application services' is empty\n" +
        "Layer 'secondary adapters' is empty"
    );
  });

  it('Should throw error when adding condition on layer that does not exist', () => {
    expect(() =>
      Architectures.layeredArchitecture()
        .consideringOnlyDependenciesInAnyPackage('src.test.fake-src.shared-kernel-one')
        .withOptionalLayers(true)
        .layer('domain models', 'src.test.fake-src.shared-kernel-one.domain..')
        .whereLayer('application services')
        .mayOnlyBeAccessedByLayers('primary adapters')
        .check(archProjectFakeSrc.allClasses())
    ).toThrow('There is no layer named application services');
  });

  it('Should throw on have simple name starting with prefix', () => {
    expect(() => {
      ArchRuleDefinition.classes()
        .that()
        .resideInAPackage('..fruit..')
        .should()
        .haveSimpleNameStartingWith('Vegetable')
        .check(archProjectFakeSrc.allClasses());
    }).toThrow(
      "Architecture violation : Rule classes reside in a package '..fruit..' should have simple name starting with Vegetable because .\n" +
        'Errors : Fruit.ts does not have simple name starting with Vegetable in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'FruitColor.ts does not have simple name starting with Vegetable in src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'FruitType.ts does not have simple name starting with Vegetable in src/test/fake-src/business-context-one/domain/fruit/FruitType.ts'
    );
  });

  it('Should have simple name starting with prefix', () => {
    expect(() => {
      ArchRuleDefinition.classes()
        .that()
        .resideInAPackage('..fruit..')
        .should()
        .haveSimpleNameStartingWith('Fruit')
        .check(archProjectFakeSrc.allClasses());
    }).not.toThrow();
  });

  describe('allowEmptyShould', () => {
    it('Should not fail when no classes found (default configuration allowEmptyShould = true)', () => {
      expect(() => {
        ArchRuleDefinition.classes()
          .that()
          .resideInAPackage('..unexistingFolder..')
          .should()
          .haveSimpleNameStartingWith('Fruit')
          .check(archProjectFakeSrc.allClasses());
      }).not.toThrow();
    });
    it('Should fail when allow empty should is false', () => {
      expect(() => {
        ArchRuleDefinition.classes()
          .that()
          .resideInAPackage('..unexistingFolder..')
          .should()
          .haveSimpleNameStartingWith('Fruit')
          .allowEmptyShould(false)
          .because('allowEmptyShould is false')
          .check(archProjectFakeSrc.allClasses());
      }).toThrow(
        "Rule 'allowEmptyShould is false' failed to check any classes. This means either that no classes have been passed to the rule at all, or that no classes passed to the rule matched the `that()` clause. To allow rules being evaluated without checking any classes you can use '.allowEmptyShould(true)' on a single rule or use the default configuration."
      );
    });
  });
});
