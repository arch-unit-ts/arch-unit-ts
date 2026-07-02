import { GivenMethodsConjunction } from './GivenMethodsConjunction';
import { MethodsShould } from './MethodsShould';
import { MethodsThat } from './MethodsThat';

export interface GivenMethods {
  that(): MethodsThat<GivenMethodsConjunction>;

  should(): MethodsShould;
}
