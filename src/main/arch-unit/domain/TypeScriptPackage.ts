import { Directory } from 'ts-morph';

import { Dependency } from '@/arch-unit/domain/fluentapi/Dependency';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';
import { Optional } from '@/common/domain/Optional';

export class TypeScriptPackage {
  readonly name: PackageName;
  readonly packages: TypeScriptPackage[];
  readonly classes: TypeScriptClass[];
  readonly path: Path;

  constructor(directory: Directory) {
    this.name = PackageName.of(directory.getBaseName());
    this.packages = directory.getDirectories().map(directory => new TypeScriptPackage(directory));
    this.classes = directory.getSourceFiles().map(file => TypeScriptClass.of(file));
    this.path = Path.of(directory.getPath());
  }

  containsExactly(names: string[]): boolean {
    return !this.packages.some(folder => !names.includes(folder.name.get()));
  }

  filterClassesByClassName(className: string): TypeScriptClass[] {
    return this.packages.flatMap(typesScriptPackage =>
      typesScriptPackage.classes.filter(typeScriptClass => typeScriptClass.name.get().includes(className))
    );
  }

  allClasses(): TypeScriptClass[] {
    return [...this.classes, ...this.packages.flatMap(typesScriptPackage => typesScriptPackage.allClasses())];
  }

  allDependencies(): Dependency[] {
    const currentPackageImport = this.classes.flatMap(typeScriptClass => typeScriptClass.dependencies);
    const subPackagesImport = this.packages.flatMap(typesScriptPackage => typesScriptPackage.allDependencies());
    return [...currentPackageImport, ...subPackagesImport];
  }

  getPackage(packageToCheck: PackageName): Optional<TypeScriptPackage> {
    return Optional.ofUndefinable(this.packages.find(typesScriptPackage => typesScriptPackage.name.get() === packageToCheck.get()));
  }

  filterClassesByPackageIdentifier(packageIdentifier: string): TypeScriptClass[] {
    const classesCurrentPackage = this.classes.filter(typeScriptClass => typeScriptClass.packagePath.get().includes(packageIdentifier));
    const classesChildrenPackages = this.packages.flatMap(typeScriptPackage =>
      typeScriptPackage.filterClassesByPackageIdentifier(packageIdentifier)
    );
    return [...classesCurrentPackage, ...classesChildrenPackages];
  }
}
