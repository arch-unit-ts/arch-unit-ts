import { PackageMatchers } from '../../../../../../main/arch-unit/core/domain/PackageMatchers';

describe('packageMatchers', () => {
  const listOfPackages: [string, boolean][] = [
    ['foo.match.bar', true],
    ['foo.other.bar', true],
    ['foo.match.other.bar', true],
    ['foo.bar', false],
    ['matc.ho.ther', false],
  ];
  it.each(listOfPackages)('should packageMatcher %s match on matcher be %s', (packageMatcher, packageCheck) => {
    expect(PackageMatchers.of('..match..', '..other..').test(packageMatcher)).toEqual(packageCheck);
  });

  it('should match on description', () => {
    expect(PackageMatchers.of('..foo..', '..bar..').description).toEqual("matches any of ['..foo..', '..bar..']");
  });
});
