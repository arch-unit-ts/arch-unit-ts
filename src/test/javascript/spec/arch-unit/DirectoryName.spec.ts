import { EMPTY_STRINGS } from '../fixture.config';

import { DirectoryName } from '@/arch-unit/domain/DirectoryName';

describe('DirectoryName', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => DirectoryName.of(blank)).toThrow('directoryName should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => DirectoryName.of(blank)).toThrow('directoryName should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', directoryName => {
    expect(DirectoryName.of(directoryName).get()).toEqual('test');
  });
});
