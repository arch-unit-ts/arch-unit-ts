import { PackageName } from '../../../../../../main/arch-unit/core/domain/PackageName';

export class PackageNameFixture {
  static domain = (): PackageName => PackageName.of('domain');
}
