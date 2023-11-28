import { TypeScriptClass } from '../../../../../main/arch-unit/domain/TypeScriptClass';

import { MorphProjectFixture } from './MorphProjectFixture';
import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Fruit.ts'));
  };

  static client = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Client.ts'));
  };

  static fakeSrcClasses = (): TypeScriptClass[] => {
    return TypeScriptProjectFixture.fakeSrc().allClasses();
  };

  static businessContextOneClasses = (): TypeScriptClass[] => {
    return this.fakeSrcClasses().filter(typeScriptClass => typeScriptClass.getPath().contains('business-context-one'));
  };
}
