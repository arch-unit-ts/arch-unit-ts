import { TypeScriptClass } from '../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { ArchCondition } from '../../../../../main/arch-unit/lang/ArchCondition';
import { ConditionEvents } from '../../../../../main/arch-unit/lang/ConditionEvents';

import { SimpleConditionEventFixture } from './SimpleConditionEventFixture';

export class ArchConditionFixture {
  static okCondition = (): ArchCondition<TypeScriptClass> => new OkCondition("I'm ok");
  static koCondition = (): ArchCondition<TypeScriptClass> => new KoCondition("I'm ko");
}

class OkCondition extends ArchCondition<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    events.add(SimpleConditionEventFixture.ok());
  }
}

class KoCondition extends ArchCondition<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    events.add(SimpleConditionEventFixture.violationWithClassName(typeScriptClass.name));
  }
}
