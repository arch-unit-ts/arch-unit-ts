import { ClassesThat } from './ClassesThat';

export interface MethodsThat<CONJUNCTION> {
  arePublic(): CONJUNCTION;

  areNotAbstract(): CONJUNCTION;

  areDeclaredInClassesThat(): ClassesThat<CONJUNCTION>;
}
