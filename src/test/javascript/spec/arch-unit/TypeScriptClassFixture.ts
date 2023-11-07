import { Project } from 'ts-morph';

import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class TypeScriptClassFixture {
  static fruit = (): TypeScriptClass => {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    return TypeScriptClass.of(tsMorphProject.getSourceFile('Fruit.ts'));
  };
}
