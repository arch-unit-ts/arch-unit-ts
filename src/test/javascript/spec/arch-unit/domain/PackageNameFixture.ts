import { PackageName } from '@/arch-unit/domain/PackageName';

export class PackageNameFixture {
  static domain = (): PackageName => PackageName.of('domain');
}
