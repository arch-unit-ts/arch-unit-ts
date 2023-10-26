import { EMPTY_STRINGS } from '../fixture.config';

import { Path } from '@/arch-unit/domain/Path';

describe('Path', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => Path.of(blank)).toThrow('path should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => Path.of(blank)).toThrow('path should not be blank');
  });

  it.each(['\\src\\apple', 'src/', 'src/ba+nana'])('should not build when not a path (%s)', blank => {
    expect(() => Path.of(blank)).toThrow('path should be a path');
  });

  it('should trim', () => {
    expect(Path.of(' /src/bananas \n  ').get()).toEqual('/src/bananas');
  });
});
