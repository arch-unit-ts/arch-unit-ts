import { Project } from 'ts-morph';

import { Path } from './Path';

import { TypeScriptPackage } from '@/arch-unit/domain/TypeScriptPackage';

export class TypeScriptProject {
  private readonly rootPackage: TypeScriptPackage;

  constructor(rootPackagePath: Path) {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    tsMorphProject.addSourceFilesAtPaths(`${rootPackagePath.get()}/**/*.ts`);
    const tsMorphRootDirectory = tsMorphProject.getDirectory(rootPackagePath.get());
    if (!tsMorphRootDirectory) {
      throw new Error(`The package ${rootPackagePath.get()} was not found`);
    }
    this.rootPackage = new TypeScriptPackage(tsMorphRootDirectory);
  }

  public get(): TypeScriptPackage {
    return this.rootPackage;
  }
}