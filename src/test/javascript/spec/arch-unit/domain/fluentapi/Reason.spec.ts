import { Reason } from '../../../../../../main/arch-unit/domain/fluentapi/Reason';
import { EMPTY_STRINGS } from '../../../fixture.config';

describe('Reason', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => Reason.of(blank)).toThrow('reason should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => Reason.of(blank)).toThrow('reason should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', reason => {
    expect(Reason.of(reason).get()).toEqual('test');
  });
});
