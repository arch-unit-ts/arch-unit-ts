import { ClassesShould } from '@/arch-unit/domain/fluentapi/ClassesShould';
import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';
import { GivenClassesConjunction } from '@/arch-unit/domain/fluentapi/GIvenClassesConjunction';

export interface GivenClasses {
  that(): ClassesThat<GivenClassesConjunction>;
  should(): ClassesShould;
}
