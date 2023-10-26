import * as typeScriptPath from 'path';

import { Assert } from '@/error/domain/Assert';

export class Path {
  private readonly path: string;

  private constructor(path: string) {
    Assert.notBlank('path', path);
    const pathTrimmed = path.trim();
    Assert.path('path', pathTrimmed);
    this.path = pathTrimmed.replace(typeScriptPath.resolve(), '');
  }

  get(): string {
    return this.path;
  }

  static of(path: string): Path {
    return new Path(path);
  }

  contains(path: string) {
    return this.path.includes(path);
  }
}
