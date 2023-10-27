import { PackageIdentifier } from '../../../../../main/arch-unit/domain/fluentapi/PackageIdentifier';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('PackageIdentifier', () => {
  it.each(EMPTY_STRINGS)('should not build for "%s"', packageIdentifier => {
    expect(() => PackageIdentifier.of(packageIdentifier)).toThrow('packageIdentifier should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', packageIdentifier => {
    expect(PackageIdentifier.of(packageIdentifier).get()).toEqual('test');
  });
});
