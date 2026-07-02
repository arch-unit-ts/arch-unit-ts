import { ArchRule } from '../../ArchRule';

import { ClassesThat } from './ClassesThat';

export interface MethodsShould {
  beDecoratedWith(decorator: string): MethodsShouldConjunction;

  beDeclaredInClassesThat(): ClassesThat<MethodsShouldConjunction>;
}

export interface MethodsShouldConjunction extends ArchRule {
  orShould(): MethodsShould;

  andShould(): MethodsShould;

  allowEmptyShould(allow: boolean): MethodsShouldConjunction;
}
