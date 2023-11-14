import { ClassesShouldConjunction } from '@/arch-unit/domain/fluentapi/ClassesShouldConjunction';
import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';

export interface ClassesShould {
  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction>;
}
