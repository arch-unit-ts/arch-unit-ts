import { MethodDeclaration, Scope, SourceFile } from 'ts-morph';

import { DescribedPredicate } from '../../base/DescribedPredicate';

import { TypeScriptClass } from './TypeScriptClass';

export class TypeScriptMethod {
  readonly methodName: string;
  readonly declaringClass: TypeScriptClass;
  private readonly _isPublic: boolean;
  private readonly _isAbstract: boolean;
  readonly decorators: string[];

  private constructor(methodName: string, declaringClass: TypeScriptClass, isPublic: boolean, isAbstract: boolean, decorators: string[]) {
    this.methodName = methodName;
    this.declaringClass = declaringClass;
    this._isPublic = isPublic;
    this._isAbstract = isAbstract;
    this.decorators = decorators;
  }

  static fromSourceFile(sourceFile: SourceFile, declaringClass: TypeScriptClass): TypeScriptMethod[] {
    const methods: TypeScriptMethod[] = [];

    for (const classDecl of sourceFile.getClasses()) {
      for (const method of classDecl.getMethods()) {
        methods.push(TypeScriptMethod.fromMethodDeclaration(method, declaringClass));
      }
    }

    for (const interfaceDecl of sourceFile.getInterfaces()) {
      for (const signature of interfaceDecl.getMethods()) {
        methods.push(new TypeScriptMethod(signature.getName(), declaringClass, true, false, []));
      }
    }

    return methods;
  }

  private static fromMethodDeclaration(method: MethodDeclaration, declaringClass: TypeScriptClass): TypeScriptMethod {
    const scope = method.getScope();
    const isPublic = scope === Scope.Public || scope === undefined;
    return new TypeScriptMethod(
      method.getName(),
      declaringClass,
      isPublic,
      method.isAbstract(),
      method.getDecorators().map(d => d.getName())
    );
  }

  isPublic(): boolean {
    return this._isPublic;
  }

  isAbstract(): boolean {
    return this._isAbstract;
  }

  isDecoratedWith(decorator: string): boolean {
    return this.decorators.includes(decorator);
  }

  static arePublic(): DescribedPredicate<TypeScriptMethod> {
    return new PublicMethodPredicate();
  }

  static areNotAbstract(): DescribedPredicate<TypeScriptMethod> {
    return new NotAbstractMethodPredicate();
  }

  static areDecoratedWith(decorator: string): DescribedPredicate<TypeScriptMethod> {
    return new MethodDecoratedWithPredicate(decorator);
  }

  static areDeclaredInClassThat(predicate: DescribedPredicate<TypeScriptClass>): DescribedPredicate<TypeScriptMethod> {
    return new DeclaredInClassPredicate(predicate);
  }
}

class PublicMethodPredicate extends DescribedPredicate<TypeScriptMethod> {
  constructor() {
    super('are public');
  }

  test(method: TypeScriptMethod): boolean {
    return method.isPublic();
  }
}

class NotAbstractMethodPredicate extends DescribedPredicate<TypeScriptMethod> {
  constructor() {
    super('are not abstract');
  }

  test(method: TypeScriptMethod): boolean {
    return !method.isAbstract();
  }
}

class MethodDecoratedWithPredicate extends DescribedPredicate<TypeScriptMethod> {
  private readonly decorator: string;

  constructor(decorator: string) {
    super(`are decorated with @${decorator}`);
    this.decorator = decorator;
  }

  test(method: TypeScriptMethod): boolean {
    return method.isDecoratedWith(this.decorator);
  }
}

class DeclaredInClassPredicate extends DescribedPredicate<TypeScriptMethod> {
  private readonly classPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(classPredicate: DescribedPredicate<TypeScriptClass>) {
    super(`are declared in classes that ${classPredicate.description}`);
    this.classPredicate = classPredicate;
  }

  test(method: TypeScriptMethod): boolean {
    return this.classPredicate.test(method.declaringClass);
  }
}
