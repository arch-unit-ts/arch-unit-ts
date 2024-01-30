import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { AllowEmptyShould } from '../../../../../../main/arch-unit/lang/AllowEmptyShould';
import { ArchCondition } from '../../../../../../main/arch-unit/lang/ArchCondition';
import { ClassesShouldInternal } from '../../../../../../main/arch-unit/lang/synthax/ClassesShouldInternal';
import { ConditionAggregator } from '../../../../../../main/arch-unit/lang/synthax/ConditionAggregator';
import { ArchConditionFixture } from '../ArchConditionFixture';
import { ClassesTransformerFixture } from '../ClassesTransformerFixture';

export class ClassesShouldInternalFixture {
  static classesShouldInternalOk = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextOneFruitTransformer(),
      ConditionAggregator.default().add(ArchConditionFixture.okCondition()),
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition,
      AllowEmptyShould.asConfigured()
    );
  };

  static classesShouldInternalKo = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextTwoTransformer(),
      ConditionAggregator.default().add(ArchConditionFixture.koCondition()),
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition,
      AllowEmptyShould.fromBoolean(false)
    );
  };
}
