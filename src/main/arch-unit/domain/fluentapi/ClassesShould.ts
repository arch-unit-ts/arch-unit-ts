import { ArchRule } from './ArchRule';
import { ClassesThat } from './ClassesThat';

export interface ClassesShould {
  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;
}

export interface ClassesShouldConjunction extends ArchRule {
  andShould(): ClassesShould;

  orShould(): ClassesShould;
}
