import { ImportDeclaration, SourceFile } from 'ts-morph';

import { Assert } from '../../../error/domain/Assert';
import { ChainableFunction } from '../../base/ChainableFunction';
import { DescribedPredicate } from '../../base/DescribedPredicate';
import { HasDescription } from '../../base/HasDescription';

import { ClassName } from './ClassName';
import { Formatters } from './Formatters';
import { PackageMatcher } from './PackageMatcher';
import { RelativePath } from './RelativePath';

export class TypeScriptClass {
  readonly name: ClassName;
  readonly packagePath: RelativePath;
  readonly dependencies: Dependency[];
  private readonly fullPath: RelativePath;
  reverseDependencies: ReverseDependencies = new ReverseDependencies();

  private constructor(name: ClassName, packagePath: RelativePath, imports: ImportDeclaration[]) {
    Assert.notNullOrUndefined('name', name);
    Assert.notNullOrUndefined('packagePath', packagePath);
    Assert.notNullOrUndefined('imports', imports);
    this.name = name;
    this.packagePath = packagePath;
    this.dependencies = imports
      .filter(importDeclaration => this.isImportValid(importDeclaration))
      .map(importDeclaration =>
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
    const packageMatcher: Set<PackageMatcher> = new Set();
    packageMatcher.add(PackageMatcher.of(packageIdentifier));
    return new PackageMatchesPredicate(packageMatcher, `reside in a package '${packageIdentifier}'`);
  }

  static resideInAnyPackage(packageIdentifiers: string[]) {
    const packageMatchers: Set<PackageMatcher> = new Set();
    packageIdentifiers.map(packageIdentifier => packageMatchers.add(PackageMatcher.of(packageIdentifier)));
    return new PackageMatchesPredicate(
      packageMatchers,
      `reside in any package ${packageIdentifiers.map(packageIdentifier => `'${packageIdentifier}'`).join(', ')}`
    );
  }

  static resideOutsideOfPackage(packageIdentifier: string): DescribedPredicate<TypeScriptClass> {
    return DescribedPredicate.not(this.resideInAPackage(packageIdentifier)).as(`reside outside of package '${packageIdentifier}'`);
  }

  static resideOutsideOfPackages(...packageIdentifiers: string[]): DescribedPredicate<TypeScriptClass> {
    return DescribedPredicate.not(TypeScriptClass.resideInAnyPackage(packageIdentifiers)).as(
      `reside outside of packages [${Formatters.joinSingleQuoted(...packageIdentifiers)}]`
    );
  }

  static simpleNameStartingWith(prefix: string): DescribedPredicate<TypeScriptClass> {
    return new SimpleNameStartingWithPredicate(prefix);
  }

  static GET_DIRECT_DEPENDENCIES_FROM_SELF: ChainableFunction<TypeScriptClass, Dependency[]> = new (class extends ChainableFunction<
    TypeScriptClass,
    Dependency[]
  > {
    public apply(input: TypeScriptClass) {
      return input.dependencies;
    }
  })();

  static GET_DIRECT_DEPENDENCIES_TO_SELF: ChainableFunction<TypeScriptClass, Dependency[]> = new (class extends ChainableFunction<
    TypeScriptClass,
    Dependency[]
  > {
    public apply(input: TypeScriptClass) {
      return input.getDirectDependenciesToSelf();
    }
  })();

  getPath() {
    return this.fullPath;
  }

  private isImportValid(importDeclaration: ImportDeclaration) {
    if (importDeclaration.getModuleSpecifierSourceFile() === undefined) {
      console.warn(
        `arch-unit-ts (Ignored import) : could not find the source file for the import : ${importDeclaration.getModuleSpecifierValue()} in file ${importDeclaration
          .getSourceFile()
          .getBaseName()}`
      );
      return false;
    }
    return true;
  }

  getDirectDependenciesToSelf(): Dependency[] {
    return this.reverseDependencies.get(this);
  }

  getSimpleName() {
    return this.name.get();
  }
}

class PackageMatchesPredicate extends DescribedPredicate<TypeScriptClass> {
  packageMatchers: Set<PackageMatcher>;

  constructor(packageMatchers: Set<PackageMatcher>, description: string) {
    super(description);
    this.packageMatchers = packageMatchers;
  }

  test(typeScriptClass: TypeScriptClass): boolean {
    return Array.from(this.packageMatchers).some(matcher => matcher.partialMatches(typeScriptClass.packagePath.getDotsPath()));
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
    return `${this.typeScriptClass.getPath().getDotsPath()} in ${this.owner.getPath().getDotsPath()}`;
  }
}

export abstract class Predicates {
  public static dependencyOrigin(predicate: DescribedPredicate<TypeScriptClass>): DescribedPredicate<Dependency> {
    return Functions.GET_ORIGIN_CLASS.is(predicate).as('origin ' + predicate.description);
  }
}

export class TypeScriptClasses {
  private readonly classes: TypeScriptClass[];

  constructor(classes: TypeScriptClass[]) {
    this.classes = classes;

    const reverseDependencies: ReverseDependencies = new ReverseDependencies();

    classes.forEach(typeScriptClass =>
      typeScriptClass.dependencies.forEach(dependency => {
        reverseDependencies.put(typeScriptClass, dependency);
      })
    );

    classes.forEach(typeScriptClass => (typeScriptClass.reverseDependencies = reverseDependencies));
  }

  public get(): TypeScriptClass[] {
    return this.classes;
  }
}

export class ReverseDependencies {
  readonly reverseDependencies: Map<string, Dependency[]> = new Map<string, Dependency[]>();

  constructor() {}

  get(typeScriptClass: TypeScriptClass): Dependency[] {
    const dependencies = this.reverseDependencies.get(typeScriptClass.getPath().get());
    return dependencies !== undefined ? dependencies : [];
  }

  put(typeScriptClass: TypeScriptClass, dependency: Dependency): void {
    const mapKey = dependency.typeScriptClass.getPath().get();
    const reverseDependency = Dependency.of(dependency.typeScriptClass.name, dependency.typeScriptClass.packagePath, typeScriptClass);

    if (!this.reverseDependencies.has(mapKey)) {
      this.reverseDependencies.set(mapKey, [reverseDependency]);
    } else {
      this.reverseDependencies.get(mapKey).push(reverseDependency);
    }
  }
}

export abstract class Functions {
  public static GET_ORIGIN_CLASS: ChainableFunction<Dependency, TypeScriptClass> = new (class extends ChainableFunction<
    Dependency,
    TypeScriptClass
  > {
    public apply(input: Dependency): TypeScriptClass {
      return input.owner;
    }
  })();

  public static GET_TARGET_CLASS: ChainableFunction<Dependency, TypeScriptClass> = new (class extends ChainableFunction<
    Dependency,
    TypeScriptClass
  > {
    public apply(input: Dependency): TypeScriptClass {
      return input.typeScriptClass;
    }
  })();
}

class SimpleNameStartingWithPredicate extends DescribedPredicate<TypeScriptClass> {
  private readonly prefix: string;

  constructor(prefix: string) {
    super(`simple name starting with ${prefix}`);
    this.prefix = prefix;
  }

  public test(input: TypeScriptClass): boolean {
    return input.getSimpleName().startsWith(this.prefix);
  }
}
