import { Assert } from '../../../../../main/error/domain/Assert';
import { EMPTY_STRINGS } from '../../fixture.config';

describe('Assert', () => {
  describe('notNullOrUndefined', () => {
    it('Should throw when null', () => {
      expect(() => Assert.notNullOrUndefined('fieldName', null)).toThrow('fieldName should not be null or undefined');
    });

    it('Should throw when undefined', () => {
      expect(() => Assert.notNullOrUndefined('fieldName', undefined)).toThrow('fieldName should not be null or undefined');
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
      expect(() => Assert.path('path', path)).toThrow('path should not be null or undefined');
    });

    it.each(EMPTY_STRINGS)('Should throw for "%s"', path => {
      expect(() => Assert.path('path', path)).toThrow('path should not be blank');
    });

    it.each(['/path]to/package', 'path{to/package', 'path/to:package'])('Should throw when path contains forbidden char %s', path => {
      expect(() => Assert.path('path', path)).toThrow(`path '${path}' should be a path`);
    });

    it('Should end with a valid character', () => {
      expect(() => Assert.path('path', 'path/to/package/')).toThrow("path 'path/to/package/' should be a path");
    });

    it.each(['path/to/package', '/path/to/package', 'path', '/path/Bananas.ts', 'path_to-package', '/@angular/common/http'])(
      'Should not throw for %s',
      path => {
        expect(() => Assert.path('path', path)).not.toThrow();
      }
    );
  });

  describe('min', () => {
    it('should throw when number inferior to min', () => {
      expect(() => Assert.min('fieldName', 0, 1)).toThrow('fieldName should not be less than 1');
    });

    it('should not throw when number equal min', () => {
      expect(() => Assert.min('fieldName', 1, 1)).not.toThrow();
    });

    it('should not throw when number superior to min', () => {
      expect(() => Assert.min('fieldName', 2, 1)).not.toThrow();
    });
  });

  describe('notEmpty', () => {
    it.each([null, undefined])('should throw when collection is null or undefined', nullOrUndefined => {
      expect(() => Assert.notEmpty('collection', nullOrUndefined)).toThrow('collection should not be null or undefined');
    });

    it('should throw when collection is empty', () => {
      expect(() => Assert.notEmpty('collection', [])).toThrow('collection size should not be less than 1');
    });

    it('should not throw when collection is not empty', () => {
      expect(() => Assert.notEmpty('collection', [8])).not.toThrow();
    });
  });
});
