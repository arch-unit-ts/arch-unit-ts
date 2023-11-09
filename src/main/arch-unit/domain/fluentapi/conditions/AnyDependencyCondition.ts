import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';
import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';
import { Dependency } from '@/arch-unit/domain/fluentapi/Dependency';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class AnyDependencyCondition extends ArchCondition<TypeScriptClass> {
  private readonly conditionPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(description: string, conditionPredicate: DescribedPredicate<TypeScriptClass>) {
    super(description);
    this.conditionPredicate = conditionPredicate;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    const anyDepedency = typeScriptClass.dependencies.some(dependency => !this.testPredicateOnDepedency(dependency));
    typeScriptClass.dependencies.forEach(dependency =>
      events.add(
        new ConditionEvent(
          `Wrong dependency in ${typeScriptClass.path().get()}: ${dependency.path.get()}`,
          !anyDepedency || !this.testPredicateOnDepedency(dependency)
        )
      )
    );
  }

  private testPredicateOnDepedency(dependency: Dependency) {
    return this.conditionPredicate.test(new TypeScriptClass(dependency.typeScriptClass.name.get(), dependency.path.get(), []));
  }
}
