import { PathFixture } from './PathFixture';

import { Dependency } from '@/arch-unit/domain/fluentapi/Dependency';

describe('Dependency', () => {
  it.each([undefined, null])('should not build without path [%s]', nullOrUndefined => {
    expect(() => new Dependency(nullOrUndefined, null)).toThrow('path should not be null');
  });

  it.each([undefined, null])('should not build without typeScriptClass [%s]', nullOrUndefined => {
    expect(() => new Dependency(PathFixture.fruit(), nullOrUndefined)).toThrow('typeScriptClass should not be null');
  });
});
