import { TypeScriptClass } from '../../../core/domain/TypeScriptClass';
import { ArchCondition } from '../../ArchCondition';

import { ClassesShould, ClassesShouldConjunction } from './ClassesShould';
import { ClassesThat } from './ClassesThat';

export interface GivenClassesConjunction {
  should(): ClassesShould;

  shouldWithConjunction(condition: ArchCondition<TypeScriptClass>): ClassesShouldConjunction;

  and(): ClassesThat<GivenClassesConjunction>;

  or(): ClassesThat<GivenClassesConjunction>;
}
