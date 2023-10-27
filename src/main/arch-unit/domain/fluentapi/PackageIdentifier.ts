import { Assert } from '@/error/domain/Assert';

export class PackageIdentifier {
  private readonly packageIdentifier: string;

  constructor(packageIdentifier: string) {
    Assert.notBlank('packageIdentifier', packageIdentifier);
    this.packageIdentifier = packageIdentifier.trim();
  }

  static of(packageIdentifier: string): PackageIdentifier {
    return new PackageIdentifier(packageIdentifier);
  }

  get(): string {
    return this.packageIdentifier;
  }
}
