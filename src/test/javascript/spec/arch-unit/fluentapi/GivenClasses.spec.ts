import { Path } from '../../../../../main/arch-unit/domain/Path';
import { TypeScriptProject } from '../../../../../main/arch-unit/domain/TypeScriptProject';
import { EMPTY_STRINGS } from '../../fixture.config';

import { GivenClasses } from '@/arch-unit/domain/fluentapi/GivenClasses';

describe('GivenClasses', () => {
  describe('that', () => {
    it('Should return itself', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.that()).toEqual(givenClasses);
    });
  });

  describe('should', () => {
    it('Should return itself', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.should()).toEqual(givenClasses);
    });
  });

  describe('resideInAPackage', () => {
    it.each([undefined, null, ...EMPTY_STRINGS])('should throw for %s', blank => {
      const givenClasses = new GivenClasses();
      expect(() => givenClasses.resideInAPackage(blank)).toThrow('The package name should not be blank.');
    });

    it('Should return itself and set package', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.resideInAPackage('myPackage')).toEqual(givenClasses);
      expect(givenClasses.packageNameToCheck.orElseThrow().get()).toEqual('myPackage');
    });
  });

  describe('from', () => {
    it.each([undefined, null, ...EMPTY_STRINGS])('should throw for %s', blank => {
      const givenClasses = new GivenClasses();
      expect(() => givenClasses.from(blank)).toThrow('The package to check from should not be blank.');
    });

    it('Should return itself and set package', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.from('myOtherPackage')).toEqual(givenClasses);
      expect(givenClasses.dependingOn.orElseThrow().get()).toEqual('myOtherPackage');
    });
  });

  describe('onlyHaveDependentClassesThat', () => {
    it('Should return itself', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.onlyHaveDependentClassesThat()).toEqual(givenClasses);
    });
  });

  describe('because', () => {
    it.each([undefined, null, ...EMPTY_STRINGS])('should throw for %s', blank => {
      const givenClasses = new GivenClasses();
      expect(() => givenClasses.because(blank)).toThrow('The reason should not be blank.');
    });

    it('Should return itself and set reason of failure', () => {
      const givenClasses = new GivenClasses();
      expect(givenClasses.because('That is why I failed')).toEqual(givenClasses);
      expect(givenClasses.reason.orElseThrow().get()).toEqual('That is why I failed');
    });
  });
  describe('check', () => {
    it('Should throw if packageToCheck is absent', () => {
      const givenClasses = new GivenClasses();
      expect(() => givenClasses.check(new TypeScriptProject(Path.of('src/test/fake-src/business-context-two')))).toThrow(
        'The package to check is needed.'
      );
    });
  });
});
