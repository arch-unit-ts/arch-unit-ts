import { ArchRuleDefinition } from '../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { TypeScriptProjectFixture } from '../arch-unit/domain/TypeScriptProjectFixture';

describe('FluentApi', () => {
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
        .resideInAPackage('not existing package')
        .because('I want the test to fail')
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).toThrow(
      "Architecture violation : Rule classes reside in a package 'business-context-two' and reside in a package 'domain' or reside in a package 'fruit' should only depend on classes that reside in a package 'not existing package' because I want the test to fail.\n" +
        'Errors : Dependency src/test/fake-src/business-context-one/domain/fruit/Fruit.ts in src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Dependency src/test/fake-src/business-context-one/domain/fruit/Fruit.ts in src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts\n' +
        'Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/shared-kernel-one/infrastructure/primary/MoneyJson.ts'
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
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).toThrow(
      "Architecture violation : Rule classes should depend on classes that reside in a package 'business-context-one' and depend on classes that reside in a package 'fruit' or only depend on classes that reside in a package 'business-context-two' because I want the test to fail.\n" +
        'Errors : Dependency src/test/fake-src/business-context-one/package-info.ts in src/main/arch-unit/domain/hexagonal/BusinessContext.ts\n' +
        'Dependency src/test/fake-src/business-context-two/package-info.ts in src/main/arch-unit/domain/hexagonal/BusinessContext.ts\n' +
        'Dependency src/test/fake-src/shared-kernel-one/package-info.ts in src/main/arch-unit/domain/hexagonal/SharedKernel.ts'
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
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).toThrow(
      "Architecture violation : Rule no classes should depend on classes that reside in a package 'business-context-one' and depend on classes that reside in a package 'fruit' or only depend on classes that reside in a package 'business-context-two' because I want the test to fail.\n" +
        'Errors : Dependency src/test/fake-src/business-context-one/application/FruitApplicationService.ts in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Dependency src/test/fake-src/business-context-one/application/FruitApplicationService.ts in src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Dependency src/test/fake-src/business-context-one/application/FruitApplicationService.ts in src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Dependency src/test/fake-src/business-context-one/domain/Client.ts in src/test/fake-src/business-context-one/domain/ClientName.ts\n' +
        'Dependency src/test/fake-src/business-context-one/domain/Client.ts in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Dependency src/test/fake-src/business-context-one/domain/fruit/Fruit.ts in src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Dependency src/test/fake-src/business-context-one/domain/fruit/Fruit.ts in src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Dependency src/test/fake-src/business-context-two/application/BasketApplicationService.ts in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts\n' +
        'Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Dependency src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts\n' +
        'Dependency src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts in src/test/fake-src/business-context-two/application/BasketApplicationService.ts\n' +
        'Dependency src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts'
    );
  });
});
