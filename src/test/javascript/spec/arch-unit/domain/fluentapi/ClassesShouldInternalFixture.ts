import { ArchCondition } from '../../../../../../main/arch-unit/domain/fluentapi/ArchCondition';
import { ClassesShouldInternal } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesShouldInternal';
import { TypeScriptClass } from '../../../../../../main/arch-unit/domain/TypeScriptClass';

import { ArchConditionFixture } from './ArchConditionFIxture';
import { ClassesTransformerFixture } from './ClassesTransformerFixture';

export class ClassesShouldInternalFixture {
  static classesShouldInternalOk = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextOneFruitTransformer(),
      [ArchConditionFixture.allOkCondition()],
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition
    );
  };

  static classesShouldInternalKo = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextTwoTransformer(),
      [ArchConditionFixture.allKoCondition()],
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition
    );
  };
}
