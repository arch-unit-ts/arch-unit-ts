import { ArchCondition } from '../../../../../../main/arch-unit/domain/fluentapi/ArchCondition';
import { ConditionEvent } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionEvent';
import { ConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionEvents';
import { TypeScriptClass } from '../../../../../../main/arch-unit/domain/TypeScriptClass';

import { ConditionEventFixture } from './ConditionEventFixture';

export class ArchConditionFixture {
  static allOkCondition = (): ArchCondition<TypeScriptClass> => new OkCondition("I'm ok");
  static allKoCondition = (): ArchCondition<TypeScriptClass> => new KoCondition("I'm ko");
}

export class OkCondition extends ArchCondition<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    events.add(ConditionEventFixture.ok());
  }
}

export class KoCondition extends ArchCondition<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  check(typeScriptClass: TypeScriptClass, events: ConditionEvents): void {
    events.add(new ConditionEvent(`Error in ${typeScriptClass.name.get()}`, true));
  }
}
