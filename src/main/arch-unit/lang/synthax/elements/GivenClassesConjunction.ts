import { ClassesShould } from './ClassesShould';
import { ClassesThat } from './ClassesThat';

export interface GivenClassesConjunction {
  should(): ClassesShould;

  and(): ClassesThat<GivenClassesConjunction>;

  or(): ClassesThat<GivenClassesConjunction>;
}
