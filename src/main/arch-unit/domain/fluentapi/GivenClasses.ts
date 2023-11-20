import { ClassesShould } from './ClassesShould';
import { ClassesThat } from './ClassesThat';
import { GivenClassesConjunction } from './GivenClassesConjunction';

export interface GivenClasses {
  that(): ClassesThat<GivenClassesConjunction>;

  should(): ClassesShould;
}
