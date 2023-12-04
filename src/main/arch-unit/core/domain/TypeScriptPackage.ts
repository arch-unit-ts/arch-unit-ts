import { createFilter } from 'file-path-filter';
import { Directory, SourceFile } from 'ts-morph';

import { PackageName } from './PackageName';
import { RelativePath } from './RelativePath';
import { TypeScriptClass } from './TypeScriptClass';

export class TypeScriptPackage {
  readonly name: PackageName;
  readonly packages: TypeScriptPackage[];
  readonly classes: TypeScriptClass[];
  readonly path: RelativePath;

  constructor(directory: Directory, ...classesFilter: string[]) {
    this.name = PackageName.of(directory.getBaseName());
    this.packages = directory.getDirectories().map(directory => new TypeScriptPackage(directory, ...classesFilter));
    this.classes = directory
      .getSourceFiles()
      .filter(
        createFilter(
          { map: (sourceFile: SourceFile): string => sourceFile.getFilePath() },
          classesFilter.map(filter => `!${filter}`)
        )
      )
      .map(file => TypeScriptClass.of(file));
    this.path = RelativePath.of(directory.getPath());
  }

  containsExactly(names: string[]): boolean {
    return !this.packages.some(folder => !names.includes(folder.name.get()));
  }

  filterClasses(classesFilter: string): TypeScriptClass[] {
    return this.packages.flatMap(typesScriptPackage =>
      typesScriptPackage.classes.filter(
        createFilter({ map: (typeScriptClass: TypeScriptClass): string => typeScriptClass.getPath().get() }, classesFilter)
      )
    );
  }

  allClasses(): TypeScriptClass[] {
    return [...this.classes, ...this.packages.flatMap(typesScriptPackage => typesScriptPackage.allClasses())];
  }
}
