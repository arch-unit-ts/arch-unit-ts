import { MorphProjectFixture } from './MorphProjectFixture';
import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Fruit.ts'));
  };

  static client = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Client.ts'));
  };

  static fakeSrcClasses = (): TypeScriptClass[] => {
    return TypeScriptProjectFixture.fakeSrc().get().allClasses();
  };
}
