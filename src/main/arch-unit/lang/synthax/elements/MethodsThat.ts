import { ClassesThat } from './ClassesThat';

export interface MethodsThat<CONJUNCTION> {
  arePublic(): CONJUNCTION;

  areNotAbstract(): CONJUNCTION;

  areAsync(): CONJUNCTION;

  areDecoratedWith(decorator: string): CONJUNCTION;

  areDeclaredInClassesThat(): ClassesThat<CONJUNCTION>;
}
