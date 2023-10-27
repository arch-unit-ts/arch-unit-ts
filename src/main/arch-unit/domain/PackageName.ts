import { Assert } from '@/error/domain/Assert';

export class PackageName {
  private readonly packageName: string;

  private constructor(packageName: string) {
    Assert.notBlank('packageName', packageName);
    this.packageName = packageName.trim();
  }

  get(): string {
    return this.packageName;
  }

  static of(name: string): PackageName {
    return new PackageName(name);
  }
}
