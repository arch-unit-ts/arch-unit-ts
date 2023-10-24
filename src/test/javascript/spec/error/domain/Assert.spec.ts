import { Assert } from '@/error/domain/Assert';

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

  describe('maxLength', () => {
    it('Should throw when length exceeded', () => {
      expect(() => Assert.maxLength('fieldName', 'aaaa', 3)).toThrow('fieldName should not exceed 3 characters');
    });

    it('Should not throw when length equals', () => {
      expect(() => Assert.maxLength('fieldName', 'aaa', 3)).not.toThrow();
    });

    it('Should not throw when inferior length', () => {
      expect(() => Assert.maxLength('fieldName', 'aa', 3)).not.toThrow();
    });
  });

  describe('minLength', () => {
    it('Should not throw when length exceeded', () => {
      expect(() => Assert.minLength('fieldName', 'aaaa', 3)).not.toThrow();
    });

    it('Should not throw when length equals', () => {
      expect(() => Assert.minLength('fieldName', 'aaa', 3)).not.toThrow();
    });

    it('Should throw when inferior length', () => {
      expect(() => Assert.minLength('fieldName', 'aa', 3)).toThrow('fieldName should not have less than 3 characters');
    });
  });

  describe('positive', () => {
    it('Should throw for negative number', () => {
      expect(() => Assert.positive('fieldName', -1)).toThrow('fieldName should be a positive number');
    });
  });

  describe('max', () => {
    it('Should throw number exceeding max', () => {
      expect(() => Assert.max('fieldName', 11, 10)).toThrow('fieldName should not exceed 10');
    });
  });

  describe('min', () => {
    it('Should throw when number inferior min', () => {
      expect(() => Assert.min('fieldName', 0, 1)).toThrow('fieldName should not be less than 1');
    });
  });
});
