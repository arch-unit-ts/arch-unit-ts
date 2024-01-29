import { BooleanUtils } from '../../../../../main/common/domain/BooleanUtils';

describe('BooleanUtils', () => {
  describe('falseIfUndefined', () => {
    it('Should be false if undefined', () => {
      expect(BooleanUtils.falseIfUndefined(undefined)).toEqual(false);
    });
    it('Should be false if false', () => {
      expect(BooleanUtils.falseIfUndefined(false)).toEqual(false);
    });
    it('Should be true if true', () => {
      expect(BooleanUtils.falseIfUndefined(true)).toEqual(true);
    });
  });
});
