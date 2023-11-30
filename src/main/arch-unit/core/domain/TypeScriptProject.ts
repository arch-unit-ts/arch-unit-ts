import { Project } from 'ts-morph';

import { RelativePath } from './RelativePath';
import { TypeScriptClass } from './TypeScriptClass';
import { TypeScriptPackage } from './TypeScriptPackage';

export class TypeScriptProject {
  private readonly rootPackage: TypeScriptPackage;

  constructor(rootPackagePath: RelativePath) {
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

  filterClassesByClassName(className: string): TypeScriptClass[] {
    return this.rootPackage.filterClassesByClassName(className);
  }

  allClasses() {
    return this.rootPackage.allClasses();
  }
}
