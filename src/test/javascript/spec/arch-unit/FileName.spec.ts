import { EMPTY_STRINGS } from '../fixture.config';

import { FileName } from '@/arch-unit/domain/FileName';

describe('FileName', () => {
  it.each([null, undefined])('should not build for %s', fileName => {
    expect(() => FileName.of(fileName)).toThrow('fileName should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', fileName => {
    expect(() => FileName.of(fileName)).toThrow('fileName should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', fileName => {
    expect(FileName.of(fileName).get()).toEqual('test');
  });
});
