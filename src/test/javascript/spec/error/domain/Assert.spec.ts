import { Assert } from '../../../../../main/error/domain/Assert';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('Assert', () => {
  describe('notNullOrUndefined', () => {
    it('Should throw when null', () => {
      expect(() => Assert.notNullOrUndefined('fieldName', null)).toThrow('fieldName should not be null');
    });

    it('Should throw when undefined', () => {
      expect(() => Assert.notNullOrUndefined('fieldName', undefined)).toThrow('fieldName should not be null');
    });

    it('Should not throw', () => {
      expect(() => Assert.notNullOrUndefined('fieldName', 55)).not.toThrow();
    });
  });

  describe('notBlank', () => {
    it.each(['', ' ', '\t\n'])('Should throw for blank', blank => {
      expect(() => Assert.notBlank('fieldName', blank)).toThrow('fieldName should not be blank');
    });

    it('Should not throw', () => {
      expect(() => Assert.notBlank('fieldName', 'full')).not.toThrow();
    });
  });

  describe('path', () => {
    it.each([null, undefined])('Should throw for %s', path => {
      expect(() => Assert.path('path', path)).toThrow('path should not be null');
    });

    it.each(EMPTY_STRINGS)('Should throw for "%s"', path => {
      expect(() => Assert.path('path', path)).toThrow('path should not be blank');
    });

    it.each(['/path]to/package', 'path{to/package', 'path/to:package'])('Should throw when path contains forbidden char', path => {
      expect(() => Assert.path('path', path)).toThrow('path should be a path');
    });

    it('Should end with a valid character', () => {
      expect(() => Assert.path('path', 'path/to/package/')).toThrow('path should be a path');
    });

    it.each(['path/to/package', '/path/to/package', 'path', '/path/Bananas.ts', 'path_to-package'])('Should not throw for %s', path => {
      expect(() => Assert.path('path', path)).not.toThrow();
    });
  });
});
