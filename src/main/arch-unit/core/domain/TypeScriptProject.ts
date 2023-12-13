import { Project } from 'ts-morph';

import { RelativePath } from './RelativePath';
import { TypeScriptClass, TypeScriptClasses } from './TypeScriptClass';
import { TypeScriptPackage } from './TypeScriptPackage';

export class TypeScriptProject {
  private readonly rootPackage: TypeScriptPackage;

  constructor(rootPackagePath: RelativePath, ...classesFilter: string[]) {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    tsMorphProject.addSourceFilesAtPaths(`${rootPackagePath.get()}/**/*.ts`);
    const tsMorphRootDirectory = tsMorphProject.getDirectory(rootPackagePath.get());
    if (!tsMorphRootDirectory) {
      throw new Error(`The package ${rootPackagePath.get()} was not found`);
    }
    this.rootPackage = new TypeScriptPackage(tsMorphRootDirectory, ...classesFilter);
  }

  filterClasses(classNameFilter: string): TypeScriptClass[] {
    return this.rootPackage.filterClasses(classNameFilter);
  }

  allClasses(): TypeScriptClasses {
    return new TypeScriptClasses(this.rootPackage.allClasses());
  }
}
