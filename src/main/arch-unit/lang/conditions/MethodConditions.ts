import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../core/domain/TypeScriptMethod';
import { ArchCondition } from '../ArchCondition';
import { ConditionEvents } from '../ConditionEvents';
import { SimpleConditionEvent } from '../SimpleConditionEvent';

export abstract class MethodConditions {
  static beDecoratedWith(decorator: string): ArchCondition<TypeScriptMethod> {
    return new MethodDecoratedWithCondition(decorator);
  }

  static beAsync(): ArchCondition<TypeScriptMethod> {
    return new AsyncMethodCondition();
  }

  static beDeclaredInClassThat(classPredicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptMethod> {
    return new DeclaredInClassCondition(classPredicate);
  }
}

class MethodDecoratedWithCondition extends ArchCondition<TypeScriptMethod> {
  private readonly decorator: string;

  constructor(decorator: string) {
    super(`be decorated with @${decorator}`);
    this.decorator = decorator;
  }

  check(method: TypeScriptMethod, events: ConditionEvents): void {
    const satisfied = method.isDecoratedWith(this.decorator);
    events.add(
      new SimpleConditionEvent(
        `${method.methodName} in ${method.declaringClass.getSimpleName()} ${satisfied ? 'is' : 'is not'} decorated with @${this.decorator} in ${method.declaringClass.getPath().get()}`,
        !satisfied
      )
    );
  }
}

class AsyncMethodCondition extends ArchCondition<TypeScriptMethod> {
  constructor() {
    super('be async');
  }

  check(method: TypeScriptMethod, events: ConditionEvents): void {
    const satisfied = method.isAsync();
    events.add(
      new SimpleConditionEvent(
        `${method.methodName} in ${method.declaringClass.getSimpleName()} ${satisfied ? 'is' : 'is not'} async in ${method.declaringClass.getPath().get()}`,
        !satisfied
      )
    );
  }
}

class DeclaredInClassCondition extends ArchCondition<TypeScriptMethod> {
  private readonly classPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(classPredicate: DescribedPredicate<TypeScriptClass>) {
    super(`be declared in classes that ${classPredicate.description}`);
    this.classPredicate = classPredicate;
  }

  check(method: TypeScriptMethod, events: ConditionEvents): void {
    const satisfied = this.classPredicate.test(method.declaringClass);
    events.add(
      new SimpleConditionEvent(
        `${method.methodName} in ${method.declaringClass.getSimpleName()} ${satisfied ? 'is' : 'is not'} declared in class that ${this.classPredicate.description} in ${method.declaringClass.getPath().get()}`,
        !satisfied
      )
    );
  }
}
