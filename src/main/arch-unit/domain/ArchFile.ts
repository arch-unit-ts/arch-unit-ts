import { SourceFile } from 'ts-morph';

export class ArchFile {
  private readonly name: string;
  private readonly importPaths: string[];

  constructor(file: SourceFile, srcPaths: string[]) {
    this.name = file.getBaseName();
    this.importPaths = file.getImportDeclarations().map(importDeclaration => {
      const moduleSpecifierSourceFile = importDeclaration.getModuleSpecifierSourceFileOrThrow();
      return this.stripeSourcePath(moduleSpecifierSourceFile.getFilePath(), srcPaths);
    });
  }

  private stripeSourcePath(path: string, srcPaths: string[]): string {
    for (const srcPath of srcPaths) {
      if (path.startsWith(srcPath)) {
        return path.substring(srcPath.length);
      }
    }
    return path;
  }
}
