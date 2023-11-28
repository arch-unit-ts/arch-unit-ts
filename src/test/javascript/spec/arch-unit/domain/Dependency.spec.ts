import { Dependency } from '../../../../../main/arch-unit/domain/TypeScriptClass';

import { ClassNameFixture } from './ClassNameFixture';
import { PathFixture } from './PathFixture';

describe('Dependency', () => {
  it.each([undefined, null])('should not build without name [%s]', nullOrUndefined => {
    expect(() => new Dependency(nullOrUndefined, null, null)).toThrow('name should not be null');
  });

  it.each([undefined, null])('should not build without path [%s]', nullOrUndefined => {
    expect(() => new Dependency(ClassNameFixture.fruit(), nullOrUndefined, null)).toThrow('path should not be null');
  });

  it.each([undefined, null])('should not build without owner [%s]', nullOrUndefined => {
    expect(() => new Dependency(ClassNameFixture.fruit(), PathFixture.fruit(), nullOrUndefined)).toThrow('owner should not be null');
  });
});
