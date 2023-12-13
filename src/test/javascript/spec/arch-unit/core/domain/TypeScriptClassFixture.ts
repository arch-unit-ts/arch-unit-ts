import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

import { TypeScriptClassesFixture } from './TypeScriptClassesFixture';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    return this.getTypeScriptClass('Fruit.ts');
  };

  static client = (): TypeScriptClass => {
    return this.getTypeScriptClass('Client.ts');
  };

  static fruitJson = (): TypeScriptClass => {
    return this.getTypeScriptClass('FruitJson.ts');
  };

  static fileWithUnknownImport = (): TypeScriptClass => {
    return TypeScriptClass.of(MorphProjectFixture.otherSrc().getSourceFile('FileWithUnknownImport.ts'));
  };

  static businessContextOneClasses = (): TypeScriptClass[] => {
    return TypeScriptClassesFixture.fakeSrcClasses()
      .get()
      .filter(typeScriptClass => typeScriptClass.getPath().contains('business-context-one'));
  };

  static basket(): TypeScriptClass {
    return this.getTypeScriptClass('Basket.ts');
  }

  private static getTypeScriptClass(className: string): TypeScriptClass {
    return TypeScriptClass.of(MorphProjectFixture.fakeSrc().getSourceFile(className));
  }

  static fruitApplicationService(): TypeScriptClass {
    return this.getTypeScriptClass('FruitApplicationService.ts');
  }

  static clientName(): TypeScriptClass {
    return this.getTypeScriptClass('ClientName.ts');
  }
}
