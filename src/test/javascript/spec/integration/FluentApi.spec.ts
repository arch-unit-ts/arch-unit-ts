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
      'Architecture violation : I want the test to fail.\n' +
        'Errors : Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/shared-kernel-one/infrastructure/primary/MoneyJson.ts'
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
        .dependOnClassesThat()
        .resideInAPackage('business-context-two')
        .because('I want the test to fail')
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).toThrow(
      'Architecture violation : I want the test to fail.\n' +
        'Errors : Wrong dependency in src/test/fake-src/business-context-one/package-info.ts: src/main/arch-unit/domain/hexagonal/BusinessContext.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/package-info.ts: src/main/arch-unit/domain/hexagonal/BusinessContext.ts\n' +
        'Wrong dependency in src/test/fake-src/shared-kernel-one/package-info.ts: src/main/arch-unit/domain/hexagonal/SharedKernel.ts'
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
        .dependOnClassesThat()
        .resideInAPackage('business-context-two')
        .because('I want the test to fail')
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).toThrow(
      'Architecture violation : I want the test to fail.\n' +
        'Errors : Wrong dependency in src/test/fake-src/business-context-one/application/FruitApplicationService.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/application/FruitApplicationService.ts: src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/application/FruitApplicationService.ts: src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/domain/Client.ts: src/test/fake-src/business-context-one/domain/ClientName.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/domain/Client.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitType.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/application/BasketApplicationService.ts: src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/shared-kernel-one/infrastructure/primary/MoneyJson.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts: src/test/fake-src/business-context-two/application/BasketApplicationService.ts\n' +
        'Wrong dependency in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts: src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts'
    );
  });
});
