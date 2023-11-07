import { PackageName } from '../../../../main/arch-unit/domain/PackageName';
import { EMPTY_STRINGS } from '../fixture.config';

import { PackageNameFixture } from './PackageNameFixture';

describe('PackageName', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => PackageName.of(blank)).toThrow('packageName should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => PackageName.of(blank)).toThrow('packageName should not be blank');
  });

  it.each(['test ', ' test'])('should trim for "%s"', packageName => {
    expect(PackageName.of(packageName).get()).toEqual('test');
  });

  describe('equals', () => {
    it('Should be true for same name', () => {
      expect(PackageNameFixture.domain().equals(PackageNameFixture.domain())).toEqual(true);
    });

    it('Should be false for different name', () => {
      expect(PackageNameFixture.domain().equals(PackageName.of('anotherPackage'))).toEqual(false);
    });
  });
});
