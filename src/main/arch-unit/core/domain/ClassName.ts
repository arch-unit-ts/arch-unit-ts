import { Assert } from '../../../error/domain/Assert';

export class ClassName {
  private readonly className: string;

  constructor(className: string) {
    Assert.notBlank('className', className);
    this.className = className.trim();
  }

  static of(className: string): ClassName {
    return new ClassName(className);
  }

  get(): string {
    return this.className;
  }
}
