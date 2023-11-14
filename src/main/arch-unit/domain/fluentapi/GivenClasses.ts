import { ClassesShould } from './ClassesShould';
import { ClassesThat } from './ClassesThat';
import { GivenClassesConjunction } from './GIvenClassesConjunction';

export interface GivenClasses {
  that(): ClassesThat<GivenClassesConjunction>;

  should(): ClassesShould;
}
