import * as typeScriptPath from 'path';

import { Assert } from '../../error/domain/Assert';

export class RelativePath {
  private readonly path: string;

  private constructor(path: string) {
    Assert.notBlank('path', path);
    const pathTrimmed = path.trim().replace((typeScriptPath.resolve() + '/').replace(/\\/g, '/'), '');
    Assert.path('path', pathTrimmed);
    this.path = pathTrimmed;
  }

  get(): string {
    return this.path;
  }

  static of(path: string): RelativePath {
    return new RelativePath(path);
  }

  contains(path: string) {
    return this.path.includes(path);
  }
}
