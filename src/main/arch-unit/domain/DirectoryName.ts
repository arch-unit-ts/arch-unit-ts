import { Assert } from '@/error/domain/Assert';

export class DirectoryName {
  private readonly directoryName: string;

  private constructor(directoryName: string) {
    Assert.notBlank('directoryName', directoryName);
    this.directoryName = directoryName.trim();
  }

  get(): string {
    return this.directoryName;
  }

  static of(name: string): DirectoryName {
    return new DirectoryName(name);
  }
}
