import { Project } from 'ts-morph';

import { Path } from './Path';

import { ArchDirectory } from '@/arch-unit/domain/ArchDirectory';

export class ArchProject {
  private readonly rootDirectory: ArchDirectory;

  constructor(rootPackagePath: Path) {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    tsMorphProject.addSourceFilesAtPaths(`${rootPackagePath.get()}/**/*.ts`);
    const tsMorphRootDirectory = tsMorphProject.getDirectory(rootPackagePath.get());
    if (!tsMorphRootDirectory) {
      throw new Error(`The directory ${rootPackagePath.get()} was not found`);
    }
    this.rootDirectory = new ArchDirectory(tsMorphRootDirectory);
  }

  public get(): ArchDirectory {
    return this.rootDirectory;
  }
}
