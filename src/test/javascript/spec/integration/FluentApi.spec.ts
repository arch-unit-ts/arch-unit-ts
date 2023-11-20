import { ArchRuleDefinition } from '../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { TypeScriptProjectFixture } from '../arch-unit/domain/TypeScriptProjectFixture';

describe('FluentApi', () => {
  it('should test "and" and "or" combination', () => {
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
        .resideInAPackage('not existing packahe')
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
});
