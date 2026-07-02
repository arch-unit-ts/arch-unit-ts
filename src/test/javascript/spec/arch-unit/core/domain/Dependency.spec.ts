import { Dependency } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { ClassNameFixture } from './ClassNameFixture';
import { RelativePathFixture } from './RelativePathFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('Dependency', () => {
  it.each([undefined, null])('should not build without name [%s]', nullOrUndefined => {
    expect(() => new Dependency(nullOrUndefined as unknown as never, null as unknown as never, null as unknown as never)).toThrow(
      'name should not be null or undefined'
    );
  });

  it.each([undefined, null])('should not build without path [%s]', nullOrUndefined => {
    expect(() => new Dependency(ClassNameFixture.fruit(), nullOrUndefined as unknown as never, null as unknown as never)).toThrow(
      'path should not be null or undefined'
    );
  });

  it.each([undefined, null])('should not build without owner [%s]', nullOrUndefined => {
    expect(
      () =>
        new Dependency(ClassNameFixture.fruit(), RelativePathFixture.fruitDomainPackageContextOne(), nullOrUndefined as unknown as never)
    ).toThrow('owner should not be null or undefined');
  });

  describe('getDescription', () => {
    it('should get description', () => {
      expect(
        new Dependency(
          ClassNameFixture.fruit(),
          RelativePathFixture.fruitDomainPackageContextOne(),
          TypeScriptClassFixture.client()
        ).getDescription()
      ).toEqual('src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-one.domain.Client.ts');
    });
  });
});
