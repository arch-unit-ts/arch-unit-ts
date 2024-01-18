import { AllowEmptyShould } from '../../../../../main/arch-unit/lang/AllowEmptyShould';

describe('AllowEmptyShould', () => {
  it.each([null, undefined])('should not build for %s', className => {
    expect(() => AllowEmptyShould.of(className)).toThrow('allow should not be null or undefined');
  });

  it('should build', () => {
    expect(AllowEmptyShould.of(true).isAllowed()).toEqual(true);
  });
});
