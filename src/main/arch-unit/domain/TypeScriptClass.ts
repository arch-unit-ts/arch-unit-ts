import { SourceFile } from 'ts-morph';

import { ClassName } from '@/arch-unit/domain/ClassName';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';

export class TypeScriptClass {
  readonly name: ClassName;
  readonly packageName: PackageName;
  readonly importPaths: Path[];

  constructor(file: SourceFile) {
    this.name = ClassName.of(file.getBaseName());
    this.packageName = PackageName.of(file.getDirectory().getBaseName());
    this.importPaths = file
      .getImportDeclarations()
      .map(importDeclaration => Path.of(importDeclaration.getModuleSpecifierSourceFileOrThrow().getFilePath()));
  }

  hasImport(importSearched: string) {
    return this.importPaths.some(importPath => importPath.contains(importSearched));
  }
}
