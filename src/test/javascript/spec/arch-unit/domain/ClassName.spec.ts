import { ClassName } from '../../../../../main/arch-unit/domain/ClassName';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('ClassName', () => {
  it.each([null, undefined])('should not build for %s', className => {
    expect(() => ClassName.of(className)).toThrow('className should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', className => {
    expect(() => ClassName.of(className)).toThrow('className should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', className => {
    expect(ClassName.of(className).get()).toEqual('test');
  });
});
