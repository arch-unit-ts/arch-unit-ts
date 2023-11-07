import { ImportDeclaration, SourceFile } from 'ts-morph';

import { ClassName } from '@/arch-unit/domain/ClassName';
import { Dependency } from '@/arch-unit/domain/fluentapi/Dependency';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';

export class TypeScriptClass {
  readonly name: ClassName;
  readonly packagePath: Path;
  readonly dependencies: Dependency[];

  // FIXME le constructeur n'est utilisé que pour construire une typescriptclass pour les dépendances
  constructor(name: string, packagePath: string, imports: ImportDeclaration[]) {
    this.name = ClassName.of(name);
    this.packagePath = Path.of(packagePath);
    this.dependencies = imports.map(importDeclaration =>
      Dependency.of(Path.of(importDeclaration.getModuleSpecifierSourceFileOrThrow().getFilePath()), this)
    );
  }

  static of(file: SourceFile): TypeScriptClass {
    return new TypeScriptClass(file.getBaseName(), file.getDirectory().getPath(), file.getImportDeclarations());
  }

  hasImport(importSearched: string) {
    return this.dependencies.some(dependency => dependency.path.contains(importSearched));
  }

  static resideInAPackage(packageIdentifier: string): DescribedPredicate<TypeScriptClass> {
    return new PackageMatchesPredicate(PackageName.of(packageIdentifier), `reside in a package '${packageIdentifier}'`);
  }

  path() {
    return Path.of(`${this.packagePath.get()}/${this.name.get()}`);
  }
}

class PackageMatchesPredicate extends DescribedPredicate<TypeScriptClass> {
  packageToMatch: PackageName;

  constructor(packageToMatch: PackageName, description: string) {
    super(description);
    this.packageToMatch = packageToMatch;
  }

  test(typeScriptClass: TypeScriptClass): boolean {
    return typeScriptClass.packagePath.contains(this.packageToMatch.get());
  }
}
