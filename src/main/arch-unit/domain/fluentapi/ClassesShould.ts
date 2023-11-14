import { ClassesShouldConjunction } from './ClassesShouldConjunction';
import { ClassesThat } from './ClassesThat';

export interface ClassesShould {
  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;
}
