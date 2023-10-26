import * as path from 'path';

import { SourceFile } from 'ts-morph';

import { DirectoryName } from '@/arch-unit/domain/DirectoryName';
import { FileName } from '@/arch-unit/domain/FileName';

export class ArchFile {
  readonly name: FileName;
  readonly directory: DirectoryName;
  readonly importPaths: string[];

  constructor(file: SourceFile) {
    this.name = FileName.of(file.getBaseName());
    this.directory = DirectoryName.of(file.getDirectory().getBaseName());
    this.importPaths = file
      .getImportDeclarations()
      .map(importDeclaration => importDeclaration.getModuleSpecifierSourceFileOrThrow().getFilePath().replace(path.resolve(), ''));
  }

  hasImport(importSearched: string) {
    return this.importPaths.some(importPath => importPath.includes(importSearched));
  }
}
