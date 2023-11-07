import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';
import { Assert } from '@/error/domain/Assert';

export class Dependency {
  readonly path: Path;
  readonly typeScriptClass: TypeScriptClass;

  public constructor(path: Path, typeScriptClass: TypeScriptClass) {
    Assert.notNullOrUndefined('path', path);
    Assert.notNullOrUndefined('typeScriptClass', typeScriptClass);
    this.path = path;
    this.typeScriptClass = typeScriptClass;
  }

  static of(path: Path, typeScriptClass: TypeScriptClass): Dependency {
    return new Dependency(path, typeScriptClass);
  }
}
