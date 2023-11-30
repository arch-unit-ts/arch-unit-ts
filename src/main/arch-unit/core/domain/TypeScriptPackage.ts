import { Directory } from 'ts-morph';

import { PackageName } from './PackageName';
import { RelativePath } from './RelativePath';
import { TypeScriptClass } from './TypeScriptClass';

export class TypeScriptPackage {
  readonly name: PackageName;
  readonly packages: TypeScriptPackage[];
  readonly classes: TypeScriptClass[];
  readonly path: RelativePath;

  constructor(directory: Directory) {
    this.name = PackageName.of(directory.getBaseName());
    this.packages = directory.getDirectories().map(directory => new TypeScriptPackage(directory));
    this.classes = directory.getSourceFiles().map(file => TypeScriptClass.of(file));
    this.path = RelativePath.of(directory.getPath());
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
}
