import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { MorphProjectFixture } from '../../morph/MorphProjectFixture';

import { TypeScriptClassesFixture } from './TypeScriptClassesFixture';

export class TypeScriptClassFixture {
  static fruitContextOne = (): TypeScriptClass => {
    return this.getTypeScriptClass('src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
  };

  static fruitContextTwo = (): TypeScriptClass => {
    return this.getTypeScriptClass('src/test/fake-src/business-context-two/domain/Fruit.ts');
  };

  static client = (): TypeScriptClass => {
    return this.getTypeScriptClass('Client.ts');
  };

  static fruitJson = (): TypeScriptClass => {
    return this.getTypeScriptClass('BadPackageFruitJson.ts');
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
