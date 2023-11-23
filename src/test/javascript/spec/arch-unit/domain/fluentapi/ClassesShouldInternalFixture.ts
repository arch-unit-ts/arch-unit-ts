import { ClassesShouldInternal } from '../../../../../../main/arch-unit/domain/fluentapi/ClassesShouldInternal';
import { ConditionAggregator } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionAggregator';
import { ArchCondition } from '../../../../../../main/arch-unit/domain/fluentapi/conditions/ArchCondition';
import { TypeScriptClass } from '../../../../../../main/arch-unit/domain/TypeScriptClass';

import { ArchConditionFixture } from './ArchConditionFixture';
import { ClassesTransformerFixture } from './ClassesTransformerFixture';

export class ClassesShouldInternalFixture {
  static classesShouldInternalOk = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextOneFruitTransformer(),
      ConditionAggregator.default().add(ArchConditionFixture.okCondition()),
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition
    );
  };

  static classesShouldInternalKo = (): ClassesShouldInternal => {
    return new ClassesShouldInternal(
      ClassesTransformerFixture.contextTwoTransformer(),
      ConditionAggregator.default().add(ArchConditionFixture.koCondition()),
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition
    );
  };
}
