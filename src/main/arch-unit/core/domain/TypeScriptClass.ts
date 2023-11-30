import { ImportDeclaration, SourceFile } from 'ts-morph';

import { Assert } from '../../../error/domain/Assert';
import { ChainableFunction } from '../../base/ChainableFunction';
import { DescribedPredicate } from '../../base/DescribedPredicate';
import { HasDescription } from '../../base/HasDescription';

import { ClassName } from './ClassName';
import { RelativePath } from './RelativePath';

export class TypeScriptClass {
  readonly name: ClassName;
  readonly packagePath: RelativePath;
  readonly dependencies: Dependency[];
  private readonly fullPath: RelativePath;

  private constructor(name: ClassName, packagePath: RelativePath, imports: ImportDeclaration[]) {
    Assert.notNullOrUndefined('name', name);
    Assert.notNullOrUndefined('packagePath', packagePath);
    Assert.notNullOrUndefined('imports', imports);
    this.name = name;
    this.packagePath = packagePath;
    this.dependencies = imports.map(importDeclaration =>
      Dependency.of(
        ClassName.of(importDeclaration.getModuleSpecifierSourceFileOrThrow().getBaseName()),
        RelativePath.of(importDeclaration.getModuleSpecifierSourceFileOrThrow().getSourceFile().getDirectory().getPath()),
        this
      )
    );
    this.fullPath = RelativePath.of(`${this.packagePath.get()}/${this.name.get()}`);
  }

  static of(file: SourceFile): TypeScriptClass {
    Assert.notNullOrUndefined('file', file);
    return new TypeScriptClass(
      ClassName.of(file.getBaseName()),
      RelativePath.of(file.getDirectory().getPath()),
      file.getImportDeclarations()
    );
  }

  static withoutDependencies(name: ClassName, packagePath: RelativePath): TypeScriptClass {
    return new TypeScriptClass(name, packagePath, []);
  }

  hasImport(importSearched: string) {
    return this.dependencies.some(dependency => dependency.typeScriptClass.getPath().contains(importSearched));
  }

  static resideInAPackage(packageIdentifier: string): DescribedPredicate<TypeScriptClass> {
    return new PackageMatchesPredicate([packageIdentifier], `reside in a package '${packageIdentifier}'`);
  }

  static resideInAnyPackage(packageIdentifiers: string[]) {
    return new PackageMatchesPredicate(
      packageIdentifiers,
      `reside in any package ${packageIdentifiers.map(packageIdentifier => `'${packageIdentifier}'`).join(', ')}`
    );
  }

  static GET_DIRECT_DEPENDENCIES_FROM_SELF: ChainableFunction<TypeScriptClass, Dependency[]> = new (class extends ChainableFunction<
    TypeScriptClass,
    Dependency[]
  > {
    public apply(input: TypeScriptClass) {
      return input.dependencies;
    }
  })();

  getPath() {
    return this.fullPath;
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

export class Dependency implements HasDescription {
  readonly owner: TypeScriptClass;
  readonly typeScriptClass: TypeScriptClass;

  public constructor(name: ClassName, path: RelativePath, owner: TypeScriptClass) {
    Assert.notNullOrUndefined('name', name);
    Assert.notNullOrUndefined('path', path);
    Assert.notNullOrUndefined('owner', owner);
    this.owner = owner;
    this.typeScriptClass = TypeScriptClass.withoutDependencies(name, path);
  }

  static of(name: ClassName, path: RelativePath, typeScriptClass: TypeScriptClass): Dependency {
    return new Dependency(name, path, typeScriptClass);
  }

  getDescription(): string {
    return `${this.typeScriptClass.getPath().get()} in ${this.owner.getPath().get()}`;
  }
}

export abstract class Functions {
  public static GET_TARGET_CLASS: ChainableFunction<Dependency, TypeScriptClass> = new (class extends ChainableFunction<
    Dependency,
    TypeScriptClass
  > {
    public apply(input: Dependency): TypeScriptClass {
      return input.typeScriptClass;
    }
  })();
}
