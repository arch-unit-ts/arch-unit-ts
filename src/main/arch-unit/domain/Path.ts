import { Assert } from '@/error/domain/Assert';

export class Path {
  private readonly path: string;

  private constructor(path: string) {
    const pathTrimmed = path.trim();
    Assert.path(pathTrimmed);
    this.path = pathTrimmed;
  }

  get(): string {
    return this.path;
  }

  static of(path: string): Path {
    return new Path(path);
  }
}
