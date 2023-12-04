import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Fruit.ts'));
  };

  static client = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Client.ts'));
  };

  static fileWithUnknownImport = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.otherSrc().getSourceFile('FileWithUnknownImport.ts'));
  };

  static fakeSrcClasses = (): TypeScriptClass[] => {
    return TypeScriptProjectFixture.fakeSrc().allClasses();
  };

  static businessContextOneClasses = (): TypeScriptClass[] => {
    return this.fakeSrcClasses().filter(typeScriptClass => typeScriptClass.getPath().contains('business-context-one'));
  };
}
