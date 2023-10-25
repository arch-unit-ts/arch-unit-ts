import { Project } from 'ts-morph';

import { ArchDirectory } from '@/arch-unit/domain/ArchDirectory';

export class ArchProject {
  private readonly rootDirectory: ArchDirectory;

  constructor(rootPackage: string) {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    tsMorphProject.addSourceFilesAtPaths(`${rootPackage}/**/*.ts`);

    const tsMorphRootDirectory = tsMorphProject.getDirectory(rootPackage);
    if (!tsMorphRootDirectory) {
      throw new Error(`The directory ${rootPackage} was not found`);
    }
    this.rootDirectory = new ArchDirectory(tsMorphRootDirectory);
  }

  public get(): ArchDirectory {
    return this.rootDirectory;
  }
}
