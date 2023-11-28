import { Assert } from '../../../error/domain/Assert';
import { TypeScriptClass } from '../TypeScriptClass';

import { DescribedPredicate } from './DescribedPredicate';
import { HasDescription } from './HasDescription';
import { PredicateAggregator } from './PredicateAggregator';

export class ClassesTransformer implements HasDescription {
  private readonly description: string;
  private readonly predicateAggregator: PredicateAggregator<TypeScriptClass>;

  constructor(description: string, predicateAggregator: PredicateAggregator<TypeScriptClass>) {
    Assert.notNullOrUndefined('description', description);
    Assert.notNullOrUndefined('predicateAggregator', predicateAggregator);
    this.description = description;
    this.predicateAggregator = predicateAggregator;
  }

  addPredicate(predicate: DescribedPredicate<TypeScriptClass>): ClassesTransformer {
    return new ClassesTransformer(this.description, this.predicateAggregator.add(predicate));
  }

  switchModeAnd(): ClassesTransformer {
    return new ClassesTransformer(this.description, this.predicateAggregator.thatANDs());
  }

  switchModeOr(): ClassesTransformer {
    return new ClassesTransformer(this.description, this.predicateAggregator.thatORs());
  }

  transform(classes: TypeScriptClass[]): TypeScriptClass[] {
    if (this.predicateAggregator.getPredicate().isEmpty()) {
      return classes;
    }

    return classes.filter(aClass =>
      this.predicateAggregator
        .getPredicate()
        .map(predicate => predicate.test(aClass))
        .orElseThrow()
    );
  }

  getDescription(): string {
    return this.description;
  }

  getFullDescription(): string {
    return (
      this.description +
      this.predicateAggregator
        .getPredicate()
        .map(predicate => ' ' + predicate.description)
        .orElse('')
    );
  }
}
