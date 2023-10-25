import { Project } from 'ts-morph';

import { Path } from './Path';

import { ArchDirectory } from '@/arch-unit/domain/ArchDirectory';

export class ArchProject {
  private readonly rootDirectory: ArchDirectory;

  constructor(rootPackageRaw: string) {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    const rootPackage = Path.of(rootPackageRaw);

    tsMorphProject.addSourceFilesAtPaths(`${rootPackage.get()}/**/*.ts`);
    const tsMorphRootDirectory = tsMorphProject.getDirectory(rootPackage.get());
    if (!tsMorphRootDirectory) {
      throw new Error(`The directory ${rootPackage.get()} was not found`);
    }
    this.rootDirectory = new ArchDirectory(tsMorphRootDirectory);
  }

  public get(): ArchDirectory {
    return this.rootDirectory;
  }
}
