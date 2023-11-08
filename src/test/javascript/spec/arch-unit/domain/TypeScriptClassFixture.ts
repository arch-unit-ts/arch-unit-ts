import { MorphProjectFixture } from './MorphProjectFixture';

import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile('Fruit.ts'));
  };
}
