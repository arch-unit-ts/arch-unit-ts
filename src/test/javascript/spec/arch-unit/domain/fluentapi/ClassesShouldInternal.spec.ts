import { ClassesShouldInternal } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesShouldInternal';
import { TypeScriptClassFixture } from '../TypeScriptClassFixture';

import { ClassesShouldInternalFixture } from './ClassesShouldInternalFixture';

describe('ClassesShouldInternal', () => {
  describe('because', () => {
    it('should override description', () => {
      const classesShouldInternal: ClassesShouldInternal = ClassesShouldInternalFixture.classesShouldInternalOk();
      classesShouldInternal.because('overriden description');

      expect(classesShouldInternal.getDescription()).toEqual('overriden description');
    });
  });

  describe('check', () => {
    it('should return not throw', () => {
      const classesShouldInternal: ClassesShouldInternal = ClassesShouldInternalFixture.classesShouldInternalOk();
      expect(() => classesShouldInternal.check(TypeScriptClassFixture.fakeSrcClasses())).not.toThrow();
    });

    it('should throw with evaluation report', () => {
      const classesShouldInternal: ClassesShouldInternal = ClassesShouldInternalFixture.classesShouldInternalKo();
      classesShouldInternal.because('Everything went wrong');

      expect(() => classesShouldInternal.check(TypeScriptClassFixture.fakeSrcClasses())).toThrow(
        'Architecture violation : Everything went wrong.\n' +
          'Errors : Error in package-info.ts\n' +
          'Error in BasketApplicationService.ts\n' +
          'Error in Basket.ts\n' +
          'Error in Supplier.ts\n' +
          'Error in BasketJson.ts'
      );
    });
  });
});
