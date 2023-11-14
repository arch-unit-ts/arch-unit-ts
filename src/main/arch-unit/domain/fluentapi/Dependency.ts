import { Assert } from '../../../error/domain/Assert';
import { RelativePath } from '../RelativePath';
import { TypeScriptClass } from '../TypeScriptClass';

export class Dependency {
  readonly path: RelativePath;
  readonly typeScriptClass: TypeScriptClass;

  public constructor(path: RelativePath, typeScriptClass: TypeScriptClass) {
    Assert.notNullOrUndefined('path', path);
    Assert.notNullOrUndefined('typeScriptClass', typeScriptClass);
    this.path = path;
    this.typeScriptClass = typeScriptClass;
  }

  static of(path: RelativePath, typeScriptClass: TypeScriptClass): Dependency {
    return new Dependency(path, typeScriptClass);
  }
}
