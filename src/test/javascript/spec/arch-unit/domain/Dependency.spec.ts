import { Dependency } from '../../../../../main/arch-unit/domain/TypeScriptClass';

import { ClassNameFixture } from './ClassNameFixture';
import { PathFixture } from './PathFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('Dependency', () => {
  it.each([undefined, null])('should not build without name [%s]', nullOrUndefined => {
    expect(() => new Dependency(nullOrUndefined, null, null)).toThrow('name should not be null');
  });

  it.each([undefined, null])('should not build without path [%s]', nullOrUndefined => {
    expect(() => new Dependency(ClassNameFixture.fruit(), nullOrUndefined, null)).toThrow('path should not be null');
  });

  it.each([undefined, null])('should not build without owner [%s]', nullOrUndefined => {
    expect(() => new Dependency(ClassNameFixture.fruit(), PathFixture.fruitPackage(), nullOrUndefined)).toThrow('owner should not be null');
  });

  describe('getDescription', () => {
    it('should get description', () => {
      expect(
        new Dependency(ClassNameFixture.fruit(), PathFixture.fruitPackage(), TypeScriptClassFixture.client()).getDescription()
      ).toEqual('/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts in src/test/fake-src/business-context-one/domain/Client.ts');
    });
  });
});
