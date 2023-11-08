import { ImportDeclaration, SourceFile } from 'ts-morph';

import { ClassName } from '@/arch-unit/domain/ClassName';
import { Dependency } from '@/arch-unit/domain/fluentapi/Dependency';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
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
    return new PackageMatchesPredicate([packageIdentifier], `reside in a package '${packageIdentifier}'`);
  }

  static resideInAnyPackage(packageIdentifiers: string[]) {
    return new PackageMatchesPredicate(packageIdentifiers, `reside in any package '${packageIdentifiers.join(', ')}'`);
  }

  path() {
    return Path.of(`${this.packagePath.get()}/${this.name.get()}`);
  }
}

class PackageMatchesPredicate extends DescribedPredicate<TypeScriptClass> {
  packageIdentifiers: string[];

  constructor(packageIdentifiers: string[], description: string) {
    super(description);
    this.packageIdentifiers = packageIdentifiers;
  }

  test(typeScriptClass: TypeScriptClass): boolean {
    return this.packageIdentifiers.some(packageIdentifier => typeScriptClass.packagePath.contains(packageIdentifier));
  }
}