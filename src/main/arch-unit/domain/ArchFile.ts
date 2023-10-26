import { SourceFile } from 'ts-morph';

import { DirectoryName } from '@/arch-unit/domain/DirectoryName';
import { FileName } from '@/arch-unit/domain/FileName';
import { Path } from '@/arch-unit/domain/Path';

export class ArchFile {
  readonly name: FileName;
  readonly directory: DirectoryName;
  readonly importPaths: Path[];

  constructor(file: SourceFile) {
    this.name = FileName.of(file.getBaseName());
    this.directory = DirectoryName.of(file.getDirectory().getBaseName());
    this.importPaths = file
      .getImportDeclarations()
      .map(importDeclaration => Path.of(importDeclaration.getModuleSpecifierSourceFileOrThrow().getFilePath()));
  }

  hasImport(importSearched: string) {
    return this.importPaths.some(importPath => importPath.contains(importSearched));
  }
}
