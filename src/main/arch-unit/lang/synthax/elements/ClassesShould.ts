import { ArchRule } from '../../ArchRule';

import { ClassesThat } from './ClassesThat';

export interface ClassesShould {
  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;

  onlyHaveDependentClassesThat(): ClassesThat<ClassesShouldConjunction>;

  haveSimpleNameStartingWith(prefix: string): ClassesShouldConjunction;
}

export interface ClassesShouldConjunction extends ArchRule {
  andShould(): ClassesShould;

  orShould(): ClassesShould;

  allowEmptyShould(allowEmptyShould: boolean): ClassesShouldConjunction;
}
