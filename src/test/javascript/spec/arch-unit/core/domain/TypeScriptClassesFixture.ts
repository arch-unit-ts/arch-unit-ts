import { TypeScriptClasses } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

export class TypeScriptClassesFixture {
  static fakeSrcClasses = (): TypeScriptClasses => {
    return TypeScriptProjectFixture.fakeSrc().allClasses();
  };
}
