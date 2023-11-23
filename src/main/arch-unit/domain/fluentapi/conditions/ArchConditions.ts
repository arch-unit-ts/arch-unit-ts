import { Dependency, TypeScriptClass } from '../../TypeScriptClass';
import { ConditionEvents } from '../ConditionEvents';
import { DescribedPredicate } from '../DescribedPredicate';
import { InvertingConditionEvents } from '../InvertingConditionEvents';
import { SimpleConditionEvent } from '../SimpleConditionEvent';

import { ArchCondition } from './ArchCondition';

export abstract class ArchConditions {
  static onlyDependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AllDependencyCondition('only depend on classes that ' + predicate.description, predicate);
  };

  static dependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AnyDependencyCondition('depend on classes that ' + predicate.description, predicate);
  };

  static negate<T>(condition: ArchCondition<T>): ArchCondition<T> {
    return new NeverCondition(condition);
  }
}

export class AllDependencyCondition extends ArchCondition<TypeScriptClass> {
  private readonly conditionPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(description: string, conditionPredicate: DescribedPredicate<TypeScriptClass>) {
    super(description);
    this.conditionPredicate = conditionPredicate;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    typeScriptClass.dependencies.forEach(dependency =>
      events.add(
        new SimpleConditionEvent(
          `Wrong dependency in ${typeScriptClass.path().get()}: ${dependency.path.get()}`,
          !this.conditionPredicate.test(new TypeScriptClass(dependency.typeScriptClass.name.get(), dependency.path.get(), []))
        )
      )
    );
  }
}

export class AnyDependencyCondition extends ArchCondition<TypeScriptClass> {
  private readonly conditionPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(description: string, conditionPredicate: DescribedPredicate<TypeScriptClass>) {
    super(description);
    this.conditionPredicate = conditionPredicate;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    const anyDependency = typeScriptClass.dependencies.some(dependency => this.testPredicateOnDependency(dependency));
    typeScriptClass.dependencies.forEach(dependency =>
      events.add(new SimpleConditionEvent(`Wrong dependency in ${typeScriptClass.path().get()}: ${dependency.path.get()}`, !anyDependency))
    );
  }

  private testPredicateOnDependency(dependency: Dependency) {
    return this.conditionPredicate.test(new TypeScriptClass(dependency.typeScriptClass.name.get(), dependency.path.get(), []));
  }
}

class NeverCondition<T> extends ArchCondition<T> {
  private readonly condition: ArchCondition<T>;

  constructor(condition: ArchCondition<T>) {
    super('never ' + condition.description);
    this.condition = condition;
  }

  check(item: T, events: ConditionEvents): void {
    this.condition.check(item, new InvertingConditionEvents(events));
  }
}
