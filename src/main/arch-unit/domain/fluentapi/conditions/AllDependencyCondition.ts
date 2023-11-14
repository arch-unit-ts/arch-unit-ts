import { TypeScriptClass } from '../../TypeScriptClass';
import { ArchCondition } from '../ArchCondition';
import { ConditionEvent } from '../ConditionEvent';
import { ConditionEvents } from '../ConditionEvents';
import { DescribedPredicate } from '../DescribedPredicate';

export class AllDependencyCondition extends ArchCondition<TypeScriptClass> {
  private readonly conditionPredicate: DescribedPredicate<TypeScriptClass>;

  constructor(description: string, conditionPredicate: DescribedPredicate<TypeScriptClass>) {
    super(description);
    this.conditionPredicate = conditionPredicate;
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    typeScriptClass.dependencies.forEach(dependency =>
      events.add(
        new ConditionEvent(
          `Wrong dependency in ${typeScriptClass.path().get()}: ${dependency.path.get()}`,
          !this.conditionPredicate.test(new TypeScriptClass(dependency.typeScriptClass.name.get(), dependency.path.get(), []))
        )
      )
    );
  }
}
