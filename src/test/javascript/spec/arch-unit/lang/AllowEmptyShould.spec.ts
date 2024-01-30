import { AllowEmptyShould } from '../../../../../main/arch-unit/lang/AllowEmptyShould';

describe('AllowEmptyShould', () => {
  it.each([null, undefined])('should not build for %s', type => {
    expect(() => new AllowEmptyShould(type)).toThrow('type should not be null or undefined');
  });

  describe('isAllowed', () => {
    it('should return true for TRUE type', () => {
      expect(AllowEmptyShould.fromBoolean(true).isAllowed()).toEqual(true);
    });
    it('should return false for FALSE type', () => {
      expect(AllowEmptyShould.fromBoolean(false).isAllowed()).toEqual(false);
    });
    it('should return true for AS_CONFIGURED type', () => {
      expect(AllowEmptyShould.asConfigured().isAllowed()).toEqual(true);
    });
  });
});
