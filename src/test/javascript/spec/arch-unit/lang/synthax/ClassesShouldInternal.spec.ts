import { ClassesShouldInternal } from '../../../../../../main/arch-unit/lang/synthax/ClassesShouldInternal';
import { TypeScriptClassesFixture } from '../../core/domain/TypeScriptClassesFixture';

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
      expect(() => classesShouldInternal.check(TypeScriptClassesFixture.fakeSrcClasses())).not.toThrow();
    });

    it('should throw with evaluation report', () => {
      const classesShouldInternal: ClassesShouldInternal = ClassesShouldInternalFixture.classesShouldInternalKo();
      classesShouldInternal.because('Everything went wrong');

      expect(() => classesShouldInternal.check(TypeScriptClassesFixture.fakeSrcClasses())).toThrow(
        "Architecture violation : Rule classes context-two should I'm ko because Everything went wrong.\n" +
          'Errors : Error in package-info.ts\n' +
          'Error in BasketApplicationService.ts\n' +
          'Error in Basket.ts\n' +
          'Error in BasketJson.ts\n' +
          'Error in Supplier.ts\n' +
          'Error in TypeScriptBasketsAdapter.ts\n' +
          'Error in BadPackageBasketJson.ts\n' +
          'Error in BasketRepository.ts'
      );
    });
  });
});
