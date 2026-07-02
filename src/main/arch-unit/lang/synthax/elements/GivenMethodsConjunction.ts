import { MethodsShould } from './MethodsShould';
import { MethodsThat } from './MethodsThat';

export interface GivenMethodsConjunction {
  should(): MethodsShould;

  and(): MethodsThat<GivenMethodsConjunction>;

  or(): MethodsThat<GivenMethodsConjunction>;
}
